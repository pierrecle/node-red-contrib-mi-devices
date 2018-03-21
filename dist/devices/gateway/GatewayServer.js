"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
const dgram = require("dgram");
const _1 = require("./");
const GatewayMessage_1 = require("./GatewayMessage");
class GatewayServer extends events.EventEmitter {
    constructor() {
        super(...arguments);
        this._gateways = {};
        this._gatewaysPing = {};
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new GatewayServer();
        }
        return this.instance;
    }
    discover(ipv = 4) {
        if (this.server) {
            return;
        }
        this.server = dgram.createSocket({
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
            }
            catch (e) {
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
            let msg = new GatewayMessage_1.GatewayMessage(JSON.parse(message.toString('utf8')));
            //console.log(msg);
            let gatewaySid = null;
            if ((msg.isHeartbeat() || msg.isIam()) && msg.model === "gateway") {
                if (!this._gateways[msg.sid]) {
                    this._gateways[msg.sid] = new _1.Gateway(msg.sid, remote.address);
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
                let msg = Buffer.from(JSON.stringify({ cmd: "whois" }));
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
    getGateway(sid) {
        return this._gateways[sid] || null;
    }
    hasGateway(sid) {
        return !!this._gateways[sid];
    }
    get gateways() {
        return this._gateways;
    }
    sendToGateway(sid, message) {
        if (this.server && this._gateways[sid]) {
            let msg = Buffer.from(JSON.stringify(message));
            this.server.send(msg, 0, msg.length, GatewayServer.SERVER_PORT, this._gateways[sid].ip);
        }
    }
}
GatewayServer.MULTICAST_ADDRESS = '224.0.0.50';
GatewayServer.MULTICAST_PORT = 4321;
GatewayServer.SERVER_PORT = 9898;
exports.GatewayServer = GatewayServer;
