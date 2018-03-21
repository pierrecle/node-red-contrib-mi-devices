import {Red, NodeProperties} from "node-red";
import {Constants} from "../constants";
import {GatewayServer} from "../../devices/gateway/GatewayServer";

export default (RED: Red) => {
    class GatewayOut {
        constructor(props: NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            this.setMessageListener();
        }

        protected setMessageListener() {
            (<any> this).on("input", (msg) => {
                if (msg.hasOwnProperty("payload") && msg.hasOwnProperty("gateway")) {
                    let gateway = GatewayServer.getInstance().getGateway(msg.gateway.sid);
                    if(gateway) {
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

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-gateway out`, <any> GatewayOut);
};