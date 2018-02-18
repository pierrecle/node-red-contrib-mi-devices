import { Red, NodeProperties } from "node-red";
import { Constants } from "../constants";

export default (RED:Red) => {
    class Plug {
        protected gateway: any;
        protected sid: string;

        constructor(props:NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            this.gateway = RED.nodes.getNode((<any> props).gateway);

            (<any> this).status({fill:"grey", shape:"ring", text:"status"});
        }

        protected setListener() {
            if (this.gateway) {
                (<any> this).on('input', (msg) => {
                    var payload = msg.payload;
                    if(payload.sid) {
                        if (payload.sid == this.sid) {
                            if (payload.data.status && payload.data.status == "on") {
                                (<any> this).status({fill:"green", shape:"dot", text:"on"});
                            } else if (payload.data.status && payload.data.status == "off") {
                                (<any> this).status({fill:"red", shape:"dot", text:"off"});
                            }
                            (<any> this).send(msg);
                        }
                    }
                    // Prepare for request
                    else {
                        (<any> this).send(msg);
                    }
                });
            }
        }
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-plug`, <any> Plug);
}