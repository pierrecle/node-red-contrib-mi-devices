import {Red, NodeProperties} from "node-red";
import {Constants} from "../constants";

export default (RED: Red) => {
    class GatewayStopSound {

        constructor(props: NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            (<any> this).setListeners();
        }

        protected setListeners() {
            (<any> this).on('input', (msg) => {
                if (msg.sid) {
                    msg.payload = {
                        action: "playSound",
                        mid: 1000
                    };
                }
                (<any> this).send(msg);
            });
        }
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-actions gateway_stop_sound`, <any> GatewayStopSound);
};