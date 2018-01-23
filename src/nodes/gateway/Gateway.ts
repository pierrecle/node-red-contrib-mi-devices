import { Red, Node, NodeProperties } from "node-red";
import { LumiAqara } from "../../../typings/index";
import { Constants } from "../constants";

export interface IGatewayNode extends Node {
    gatewayConf:any;
    gateway: LumiAqara.Gateway;

    setGateway(gateway:LumiAqara.Gateway);
}

export default (RED:Red) => {
    class Gateway {
        protected gatewayConf: any;
        protected gateway: LumiAqara.Gateway;

        constructor(props:NodeProperties){
            RED.nodes.createNode(<any> this, props);
            this.gatewayConf = RED.nodes.getNode((<any> props).gateway);
            this.gateway = null;

            (<any> this).status({fill:"red", shape:"ring", text: "offline"});
            this.setMessageListener();
        }

        protected setMessageListener() {
            (<any> this).on('input', (msg) => {
                if (this.gateway) {
                    var payload = msg.payload;
    
                    // Input from gateway
                    if(payload.sid && payload.sid == this.gateway.sid) {
                        if(payload.data.rgb) {
                            /*var decomposed = miDevicesUtils.computeColor(payload.data.rgb);
                            payload.data.brightness = decomposed.brightness;
                            payload.data.color = decomposed.color;*/
                        }
                        (<any> this).send(msg);
                    }
                    // Prepare for request
                    else {
                        msg.sid = this.gateway.sid;
                        (<any> this).send(msg);
                    }
                }
            });
        }

        setGateway(gateway:LumiAqara.Gateway) {
            this.gateway = gateway;
            this.gateway.setPassword(this.gatewayConf.password);
            (<any> this).status({fill:"blue", shape:"dot", text: "online"});

            this.gateway.on('offline', () => {
                this.gateway = null;
                (<any> this).status({fill:"red", shape:"ring", text: "offline"});
            });
        };
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-gateway`, <any> Gateway);
};