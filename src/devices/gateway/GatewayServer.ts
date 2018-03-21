import * as events from 'events';
import * as dgram from "dgram";
import {Gateway} from "./";
import Timer = NodeJS.Timer;
import {GatewayMessage} from "./GatewayMessage";

export class GatewayServer extends events.EventEmitter {
    static MULTICAST_ADDRESS = '224.0.0.50';
    static MULTICAST_PORT = 4321;
    static SERVER_PORT = 9898;

    private static instance: GatewayServer;

    private server: dgram.Socket;
    private _gateways: { [sid: string]: Gateway } = {};
    private _gatewaysPing: { [sid: string]: Timer } = {};

    static getInstance() {
        if (!this.instance) {
            this.instance = new GatewayServer();
        }
        return this.instance;
    }

    discover(ipv: number = 4) {
        if (this.server) {
            return;
        }

        this.server = dgram.createSocket(<dgram.SocketOptions> {
            type: `udp${ipv}`,
            reuseAddr: true
        });

        this.server.on('listening', () => {
            var address = this.server.address();
            //this.log(RED._("udp.status.listener-at",{host:address.address,port:address.port}));
            this.server.setBroadcast(true);
            try {
                this.server.setMulticastTTL(128);
                this.server.addMembership(GatewayServer.MULTICAST_ADDRESS, null);
            } catch (e) {
                /*if (e.errno == "EINVAL") {
                    this.error(RED._("udp.errors.bad-mcaddress"));
                } else if (e.errno == "ENODEV") {
                    this.error(RED._("udp.errors.interface"));
                } else {
                    this.error(RED._("udp.errors.error",{error:e.errno}));
                }*/
            }
        });

        this.server.on("error", (err) => {
            /*if ((err.code == "EACCES") && (this.port < 1024)) {
                this.error(RED._("udp.errors.access-error"));
            } else {
                this.error(RED._("udp.errors.error",{error:err.code}));
            }*/
            this.server.close();
            delete this.server;
        });

        this.server.on('message', (message, remote) => {
            let msg = new GatewayMessage(JSON.parse(message.toString('utf8')));
            //console.log(msg);
            let gatewaySid = null;
            if ((msg.isHeartbeat() || msg.isIam()) && msg.model === "gateway") {
                if (!this._gateways[msg.sid]) {
                    this._gateways[msg.sid] = new Gateway(msg.sid, remote.address);
                    this._gateways[msg.sid].getIdList();
                    this.emit("gateway-online", msg.sid);
                }
                else {
                    // Any IP update?
                    this._gateways[msg.sid].ip = remote.address;
                }
                if (this._gatewaysPing[msg.sid]) {
                    clearTimeout(this._gatewaysPing[msg.sid]);
                    delete this._gatewaysPing[msg.sid];
                }

                // Consider the gateway as unreachable after 2 heartbeats missed (1 heartbeat every 10s)
                this._gatewaysPing[msg.sid] = setTimeout(() => {
                    this.emit("gateway-offline", msg.sid);
                    delete this._gateways[msg.sid];
                }, 25 * 1000);

                gatewaySid = msg.sid;
            }
            if (!gatewaySid) {
                gatewaySid = Object.keys(this._gateways).filter((gatewaySid) => this._gateways[gatewaySid].ip === remote.address)[0];
            }

            gatewaySid && this._gateways[gatewaySid] && this._gateways[gatewaySid].handleMessage(msg);
        });

        return new Promise((resolve, reject) => {
            try {
                this.server.bind(GatewayServer.SERVER_PORT, null);
                let msg = Buffer.from(JSON.stringify({cmd: "whois"}));
                this.server.send(msg, 0, msg.length, GatewayServer.MULTICAST_PORT, GatewayServer.MULTICAST_ADDRESS);
                resolve(this.server);
            }
            catch (e) {
                reject();
            }
        });
    }

    stop() {
        if (this.server) {
            this.server.close();
            delete this.server;
        }
    }

    getGateway(sid: string): Gateway {
        return this._gateways[sid] || null;
    }

    hasGateway(sid: string): boolean {
        return !!this._gateways[sid];
    }

    get gateways(): { [sid: string]: Gateway } {
        return this._gateways;
    }

    sendToGateway(sid: string, message: any) {
        if (this.server && this._gateways[sid]) {
            let msg = Buffer.from(JSON.stringify(message));
            this.server.send(msg, 0, msg.length, GatewayServer.SERVER_PORT, this._gateways[sid].ip);
        }
    }
}