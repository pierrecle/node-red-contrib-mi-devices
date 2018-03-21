import {Red, NodeProperties} from "node-red";
import {Constants} from "../constants";

export default (RED: Red) => {
    class Light {
        public color: string;
        public brightness: number;

        constructor(props: NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            this.color = (<any>props).color;
            this.brightness = (<any>props).brightness;
            (<any> this).setListeners();
        }

        protected setListeners() {
            (<any> this).on('input', (msg) => {
                msg.payload = {
                    action: "setLight",
                    color: msg.color || this.color,
                    brightness: msg.brightness || this.brightness
                };
                (<any> this).send(msg);
            });
        }
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-actions light`, <any> Light);
};