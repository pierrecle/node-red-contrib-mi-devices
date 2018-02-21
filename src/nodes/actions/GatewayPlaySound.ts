import {Red, NodeProperties} from "node-red";
import {Constants} from "../constants";

export default (RED: Red) => {
    class GatewayPlaySound {
        public mid: number;
        public volume: number;

        constructor(props: NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            this.mid = parseInt((<any>props).mid);
            this.volume = parseInt((<any>props).volume);
            (<any> this).setListeners();
        }

        protected setListeners() {
            (<any> this).on('input', (msg) => {
                if (msg.sid) {
                    msg.payload = {
                        action: "playSound",
                        mid: msg.mid || this.mid,
                        volume: msg.volume || this.volume
                    };
                }
                (<any> this).send(msg);
            });
        }
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-actions gateway_play_sound`, <any> GatewayPlaySound);
};