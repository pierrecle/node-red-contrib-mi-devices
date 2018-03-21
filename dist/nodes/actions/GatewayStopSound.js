"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = (RED) => {
    class GatewayStopSound {
        constructor(props) {
            RED.nodes.createNode(this, props);
            this.setListeners();
        }
        setListeners() {
            this.on('input', (msg) => {
                if (msg.sid) {
                    msg.payload = {
                        action: "playSound",
                        mid: 1000
                    };
                }
                this.send(msg);
            });
        }
    }
    RED.nodes.registerType(`${constants_1.Constants.NODES_PREFIX}-actions gateway_stop_sound`, GatewayStopSound);
};
