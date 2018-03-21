"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = (RED) => {
    class Gateway {
        constructor(props) {
            RED.nodes.createNode(this, props);
            this.gatewayConf = RED.nodes.getNode(props.gateway);
            this.status({ fill: "red", shape: "ring", text: "offline" });
            if (this.gatewayConf.gateway) {
                this.gatewayOnline();
            }
            this.gatewayConf.on('gateway-online', () => this.gatewayOnline());
            this.gatewayConf.on('gateway-offline', () => this.gatewayOffline());
            this.setMessageListener();
        }
        gatewayOnline() {
            this.status({ fill: "blue", shape: "dot", text: "online" });
        }
        gatewayOffline() {
            this.status({ fill: "red", shape: "ring", text: "offline" });
        }
        setMessageListener() {
            this.on('input', (msg) => {
                if (this.gatewayConf.gateway) {
                    var payload = msg.payload;
                    // Input from gateway
                    if (payload.sid && payload.sid == this.gatewayConf.gateway.sid) {
                        if (payload.data.rgb) {
                            /*var decomposed = miDevicesUtils.computeColor(payload.data.rgb);
                            payload.data.brightness = decomposed.brightness;
                            payload.data.color = decomposed.color;*/
                        }
                        this.send(msg);
                    }
                    else {
                        msg.sid = this.gatewayConf.gateway.sid;
                        msg.gateway = this.gatewayConf.gateway;
                        this.send(msg);
                    }
                }
            });
        }
    }
    RED.nodes.registerType(`${constants_1.Constants.NODES_PREFIX}-gateway`, Gateway);
};
