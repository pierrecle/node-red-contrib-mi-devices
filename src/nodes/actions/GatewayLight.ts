import { Red, NodeProperties } from "node-red";
import { Constants } from "../constants";

export default (RED:Red) => {
    class GatewayLight {
        public color:string;
        public brightness:number;

        constructor(props:NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            (<any> this).setListeners();
        }

        protected setListeners() {
            (<any> this).on('input', (msg) => {
                let color = msg.color || this.color;
                let brightness = msg.brightness || this.brightness;
                if(msg.sid) {
                    msg.payload = {
                        cmd: "write",
                        data: { rgb: 123, sid: msg.sid }
                    };
                }
                else {
                    msg.payload = {
                        brightness: brightness
                    };
                }
                (<any> this).send(msg);
            });
        }
    }
    RED.nodes.registerType(`${Constants.NODES_PREFIX}-actions gateway_light`, <any> GatewayLight);
};