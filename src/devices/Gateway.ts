import * as events from 'events';
import * as crypto from 'crypto';

import {GatewayServer} from "./GatewayServer";
import {GatewayMessage, GatewaySubdevice, Magnet, Motion, Switch, Weather} from "./";
import * as MessageData from "./GatewayMessageData";

export class Gateway extends events.EventEmitter {
    static iv: Buffer = Buffer.from([0x17, 0x99, 0x6d, 0x09, 0x3d, 0x28, 0xdd, 0xb3, 0xba, 0x69, 0x5a, 0x2e, 0x6f, 0x58, 0x56, 0x2e]);
    protected lastToken: string;
    protected password: string;
    private _subdevices: { [sid: string]: GatewaySubdevice } = {};

    constructor(public sid: string, public ip: string) {
        super();
    }

    get key(): string {
        var cipher = crypto.createCipheriv('aes-128-cbc', this.password, Gateway.iv);
        var key = cipher.update(this.lastToken, "ascii", "hex");
        cipher.final('hex');

        return key;
    }

    handleMessage(msg: GatewayMessage) {
        if (msg.data) {
            if (msg.model === "gateway" && msg.sid === this.sid && msg.token) {
                this.lastToken = msg.token;
            }
        }

        if (msg.isGetIdListAck()) {
            (<MessageData.GatewayMessageGetIdListData> msg.data).forEach((sid) => {
                this.sendRead({cmd: "read", sid: sid});
            });
        }

        if (msg.isReadAck() || msg.isReport()) {
            if (!this._subdevices[msg.sid]) {
                for (let SubDeviceClass of [Magnet, Motion, Switch, Weather]) {
                    if (SubDeviceClass.acceptedModels.indexOf(msg.model) >= 0) {
                        this._subdevices[msg.sid] = new SubDeviceClass(msg.sid, msg.model);
                        this._subdevices[msg.sid].on('values-updated', (sid: string) => {
                            this.emit("subdevice-values-updated", sid);
                        });
                        this.emit("subdevice-found", msg.sid);
                    }
                }
            }
            if (this._subdevices[msg.sid]) {
                this._subdevices[msg.sid].handleMessage(msg);
            }
        }
    }

    getSubdevice(sid: string): GatewaySubdevice {
        return this._subdevices[sid] || null;
    }

    hasSubdevice(sid: string): boolean {
        return !!this._subdevices[sid];
    }

    setLight() {

    }

    playSound() {

    }

    sendRead(message: any) {
        message.sid = message.sid || this.sid;
        GatewayServer.getInstance().sendToGateway(this.sid, message);
    }

    get subdevices(): { [sid: string]: GatewaySubdevice } {
        return this._subdevices;
    }

    toJSON() {
        return {
            sid: this.sid,
            ip: this.ip,
            key: this.password,
            subdevices: this.subdevices
        };
    }
}