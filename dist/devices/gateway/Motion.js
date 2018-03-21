"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GatewaySubdevice_1 = require("./GatewaySubdevice");
class Motion extends GatewaySubdevice_1.GatewaySubdevice {
    constructor() {
        super(...arguments);
        this.lux = 0;
    }
    static get acceptedModels() {
        return ['motion', 'sensor_motion.aq2'];
    }
    get internalModel() {
        return 'mi.motion';
    }
    handleMessage(msg) {
        super.handleMessage(msg);
        if (msg.isReadAck() || msg.isReport()) {
            let data = msg.data;
            if (data.lux) {
                this.lux = parseInt(data.lux);
            }
            if (data.status === "motion") {
                this.lastMotionTimestamp = data.timestamp;
                this.emit('values-updated', { sid: this.sid, data: { hasMotion: true } });
            }
        }
    }
}
exports.Motion = Motion;
