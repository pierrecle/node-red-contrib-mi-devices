"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = (RED) => {
    class GatewayPlaySound {
        constructor(props) {
            RED.nodes.createNode(this, props);
            this.mid = parseInt(props.mid);
            this.volume = parseInt(props.volume);
            this.setListeners();
        }
        setListeners() {
            this.on('input', (msg) => {
                if (msg.sid) {
                    msg.payload = {
                        action: "playSound",
                        mid: msg.mid || this.mid,
                        volume: msg.volume || this.volume
                    };
                }
                this.send(msg);
            });
        }
    }
    RED.nodes.registerType(`${constants_1.Constants.NODES_PREFIX}-actions gateway_play_sound`, GatewayPlaySound);
};
