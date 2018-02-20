import { Red, NodeProperties, NodeStatus } from "node-red";
import { Constants } from "../constants";

export default (RED:Red, type:string) => {
    class GatewayDevice {
        protected gateway: any;
        protected sid: string;

        constructor(props:NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            this.gateway = RED.nodes.getNode((<any> props).gateway);
            this.sid = (<any> props).sid;
    
            (<any> this).status({fill:"grey", shape:"ring", text:"battery - na"});
            this.setMessageListener();
        }

        protected setMessageListener() {
            if (this.gateway) {
                (<any> this).on('input', (msg) => {
                    let payload = msg.payload;

                    // Input from gateway
                    if (payload.sid) {
                        if (payload.sid == this.sid) {
                            let batteryLevel = payload.batteryLevel;
                            var status:NodeStatus = {
                                fill: "green", shape: "dot",
                                text: "battery - " + batteryLevel + "%"
                            };

                            if (batteryLevel < 10) {
                                status.fill = "red";
                            } else if (batteryLevel < 45) {
                                status.fill = "yellow";
                            }
                            (<any> this).status(status);
                            (<any> this).send([msg]);
                        }
                    }
                    // Prepare for request
                    else {
                        msg.sid = this.sid;
                        msg.gateway = this.gateway;
                        (<any> this).send(msg);
                    }
                });
            }
        }
    }
    
    RED.nodes.registerType(`${Constants.NODES_PREFIX}-${type}`, <any> GatewayDevice);
};