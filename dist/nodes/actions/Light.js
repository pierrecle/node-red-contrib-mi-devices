"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = (RED) => {
    class Light {
        constructor(props) {
            RED.nodes.createNode(this, props);
            this.color = props.color;
            this.brightness = props.brightness;
            this.setListeners();
        }
        setListeners() {
            this.on('input', (msg) => {
                msg.payload = {
                    action: "setLight",
                    color: msg.color || this.color,
                    brightness: msg.brightness || this.brightness
                };
                this.send(msg);
            });
        }
    }
    RED.nodes.registerType(`${constants_1.Constants.NODES_PREFIX}-actions light`, Light);
};
