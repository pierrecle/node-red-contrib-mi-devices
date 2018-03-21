"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = (RED) => {
    class GatewayIn {
        constructor(props) {
            RED.nodes.createNode(this, props);
            this.gatewayConf = RED.nodes.getNode(props.gateway);
            this.status({ fill: "red", shape: "ring", text: "offline" });
            if (this.gatewayConf.gateway) {
                this.gatewayOnline();
            }
            this.gatewayConf.on('gateway-online', () => this.gatewayOnline());
            this.gatewayConf.on('gateway-offline', () => this.gatewayOffline());
        }
        gatewayOnline() {
            this.status({ fill: "blue", shape: "dot", text: "online" });
            this.gatewayConf.on('subdevice-update', (subdevice) => {
                this.send({ payload: subdevice });
            });
        }
        gatewayOffline() {
            this.status({ fill: "red", shape: "ring", text: "offline" });
        }
    }
    RED.nodes.registerType(`${constants_1.Constants.NODES_PREFIX}-gateway in`, GatewayIn);
};
