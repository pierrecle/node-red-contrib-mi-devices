"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GatewaySubdevice_1 = require("./GatewaySubdevice");
class Switch extends GatewaySubdevice_1.GatewaySubdevice {
    static get acceptedModels() {
        return ['switch', 'sensor_switch.aq2'];
    }
    get internalModel() {
        return 'mi.switch';
    }
    handleMessage(msg) {
        super.handleMessage(msg);
    }
}
exports.Switch = Switch;
