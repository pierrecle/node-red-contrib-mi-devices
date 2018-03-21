"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
const crypto = require("crypto");
const GatewayServer_1 = require("./GatewayServer");
const _1 = require("./");
const Color_1 = require("../../utils/Color");
class Gateway extends events.EventEmitter {
    constructor(sid, ip) {
        super();
        this.sid = sid;
        this.ip = ip;
        this._subdevices = {};
    }
    set password(password) {
        this._password = password;
    }
    get key() {
        if (!this.lastToken || !this._password)
            return null;
        var cipher = crypto.createCipheriv('aes-128-cbc', this._password, Gateway.iv);
        var key = cipher.update(Buffer.from(this.lastToken), "ascii", "hex");
        cipher.final('hex');
        return key;
    }
    handleMessage(msg) {
        if (msg.data) {
            if (msg.model === "gateway" && msg.sid === this.sid && msg.token) {
                this.lastToken = msg.token;
            }
        }
        if (msg.isGetIdListAck()) {
            msg.data.forEach((sid) => {
                this.read(sid);
            });
        }
        if (msg.isReadAck() || msg.isReport()) {
            if (!this._subdevices[msg.sid]) {
                for (let SubDeviceClass of [_1.Magnet, _1.Motion, _1.Switch, _1.Weather]) {
                    if (SubDeviceClass.acceptedModels.indexOf(msg.model) >= 0) {
                        this._subdevices[msg.sid] = new SubDeviceClass(msg.sid, msg.model);
                        this._subdevices[msg.sid].on('values-updated', (sidOrMessage) => {
                            this.emit("subdevice-values-updated", sidOrMessage);
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
    getSubdevice(sid) {
        return this._subdevices[sid] || null;
    }
    hasSubdevice(sid) {
        return !!this._subdevices[sid];
    }
    getIdList() {
        this.send({
            cmd: "get_id_list",
        });
    }
    read(sid) {
        this.send({ cmd: "read", sid: sid || this.sid });
    }
    setLight(brightness, rgb) {
        this.send({
            cmd: "write",
            data: {
                rgb: Color_1.Color.toValue(rgb.red, rgb.green, rgb.blue, brightness),
                sid: this.sid
            }
        });
    }
    playSound(musicId, volume) {
        this.send({
            cmd: "write",
            data: {
                mid: musicId,
                volume: volume,
                sid: this.sid
            }
        });
    }
    send(message) {
        let msg = Object.assign({}, message.payload || message);
        if (msg.cmd) {
            msg.sid = message.sid || this.sid;
            if (msg.gateway) {
                delete msg.gateway;
            }
            if (msg.cmd === "write") {
                msg.data.key = this.key;
            }
            GatewayServer_1.GatewayServer.getInstance().sendToGateway(this.sid, msg);
        }
    }
    get subdevices() {
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
Gateway.iv = Buffer.from([0x17, 0x99, 0x6d, 0x09, 0x3d, 0x28, 0xdd, 0xb3, 0xba, 0x69, 0x5a, 0x2e, 0x6f, 0x58, 0x56, 0x2e]);
exports.Gateway = Gateway;
