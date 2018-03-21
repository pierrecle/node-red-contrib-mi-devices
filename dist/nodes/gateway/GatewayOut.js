"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const GatewayServer_1 = require("../../devices/gateway/GatewayServer");
exports.default = (RED) => {
    class GatewayOut {
        constructor(props) {
            RED.nodes.createNode(this, props);
            this.setMessageListener();
        }
        setMessageListener() {
            this.on("input", (msg) => {
                if (msg.hasOwnProperty("payload") && msg.hasOwnProperty("gateway")) {
                    let gateway = GatewayServer_1.GatewayServer.getInstance().getGateway(msg.gateway.sid);
                    if (gateway) {
                        if (msg.payload.cmd) {
                            gateway.send(msg);
                        }
                        else if (msg.payload.action) {
                            switch (msg.payload.action) {
                                case 'setLight':
                                    gateway.setLight(msg.payload.brightness, msg.payload.color);
                                    break;
                                case 'playSound':
                                    gateway.playSound(msg.payload.mid, msg.payload.volume);
                                    break;
                            }
                        }
                    }
                }
            });
        }
    }
    RED.nodes.registerType(`${constants_1.Constants.NODES_PREFIX}-gateway out`, GatewayOut);
};
