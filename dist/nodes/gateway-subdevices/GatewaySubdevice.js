"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = (RED, type) => {
    class GatewayDevice {
        constructor(props) {
            RED.nodes.createNode(this, props);
            this.gateway = RED.nodes.getNode(props.gateway);
            this.sid = props.sid;
            this.status({ fill: "grey", shape: "ring", text: "battery - na" });
            this.setMessageListener();
        }
        setMessageListener() {
            if (this.gateway) {
                this.on('input', (msg) => {
                    let payload = msg.payload;
                    // Input from gateway
                    if (payload.sid) {
                        if (payload.sid == this.sid) {
                            let batteryLevel = payload.batteryLevel;
                            var status = {
                                fill: "green", shape: "dot",
                                text: "battery - " + batteryLevel + "%"
                            };
                            if (batteryLevel < 10) {
                                status.fill = "red";
                            }
                            else if (batteryLevel < 45) {
                                status.fill = "yellow";
                            }
                            this.status(status);
                            this.send([msg]);
                        }
                    }
                    else {
                        msg.sid = this.sid;
                        msg.gateway = this.gateway;
                        this.send(msg);
                    }
                });
            }
        }
    }
    RED.nodes.registerType(`${constants_1.Constants.NODES_PREFIX}-${type}`, GatewayDevice);
};
