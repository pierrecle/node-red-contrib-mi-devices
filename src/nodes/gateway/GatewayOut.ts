import {Red, NodeProperties} from "node-red";
import {Constants} from "../constants";

export default (RED: Red) => {
    class GatewayOut {
        constructor(props: NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            this.setMessageListener();
        }

        protected setMessageListener() {
            (<any> this).on("input", (msg) => {
                if (msg.hasOwnProperty("payload") && msg.hasOwnProperty("gateway")) {
                    msg.gateway.gateway.send(msg);
                }
            });
        }
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-gateway out`, <any> GatewayOut);
};