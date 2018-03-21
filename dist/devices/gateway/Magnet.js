"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GatewaySubdevice_1 = require("./GatewaySubdevice");
class Magnet extends GatewaySubdevice_1.GatewaySubdevice {
    static get acceptedModels() {
        return ['magnet', 'sensor_magnet.aq2'];
    }
    get internalModel() {
        return 'mi.magnet';
    }
    isClosed() {
        return this.status === "close";
    }
    isOpened() {
        return this.status === "open";
    }
    isUnkownState() {
        return this.status === "unkown";
    }
    handleMessage(msg) {
        super.handleMessage(msg);
        if (msg.isReadAck() || msg.isReport()) {
            let data = msg.data;
            // mintime
            if (this.status !== data.status) {
                this.status = data.status;
                this.emit('values-updated', this.sid);
            }
        }
    }
}
exports.Magnet = Magnet;
