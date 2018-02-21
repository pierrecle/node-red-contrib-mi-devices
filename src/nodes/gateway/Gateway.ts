import { Red, Node, NodeProperties } from "node-red";
import { LumiAqara } from "../../../typings/index";
import { Constants } from "../constants";

export interface IGatewayNode extends Node {
    gatewayConf:any;
}

export default (RED:Red) => {
    class Gateway {
        protected gatewayConf: any;

        constructor(props:NodeProperties){
            RED.nodes.createNode(<any> this, props);
            this.gatewayConf = RED.nodes.getNode((<any> props).gateway);

            (<any>this).status({fill: "red", shape: "ring", text: "offline"});

            if (this.gatewayConf.gateway) {
                this.gatewayOnline();
            }

            this.gatewayConf.on('gateway-online', () => this.gatewayOnline());
            this.gatewayConf.on('gateway-offline', () => this.gatewayOffline());

            this.setMessageListener();
        }

        protected gatewayOnline() {
            (<any>this).status({fill: "blue", shape: "dot", text: "online"});
        }

        protected gatewayOffline() {
            (<any>this).status({fill: "red", shape: "ring", text: "offline"});
        }

        protected setMessageListener() {
            (<any> this).on('input', (msg) => {
                if (this.gatewayConf.gateway) {
                    var payload = msg.payload;
    
                    // Input from gateway
                    if(payload.sid && payload.sid == this.gatewayConf.gateway.sid) {
                        if(payload.data.rgb) {
                            /*var decomposed = miDevicesUtils.computeColor(payload.data.rgb);
                            payload.data.brightness = decomposed.brightness;
                            payload.data.color = decomposed.color;*/
                        }
                        (<any> this).send(msg);
                    }
                    // Prepare for request
                    else {
                        msg.sid = this.gatewayConf.gateway.sid;
                        msg.gateway = this.gatewayConf.gateway;
                        (<any> this).send(msg);
                    }
                }
            });
        }
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-gateway`, <any> Gateway);
};