"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GatewayMessage {
    constructor(raw) {
        Object.assign(this, raw);
        if (raw.port) {
            this.port = parseInt(raw.port);
        }
        if (raw.data) {
            this.data = JSON.parse(raw.data) || raw.data;
        }
        this.timestamp = +new Date;
    }
    isHeartbeat() {
        return this.cmd === "heartbeat";
    }
    isIam() {
        return this.cmd === "iam";
    }
    isGetIdListAck() {
        return this.cmd === "get_id_list_ack";
    }
    isReadAck() {
        return this.cmd === "read_ack";
    }
    isReport() {
        return this.cmd === "report";
    }
}
exports.GatewayMessage = GatewayMessage;
