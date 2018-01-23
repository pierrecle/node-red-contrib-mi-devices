import { Red, NodeProperties } from "node-red";
import { LumiAqara } from "../../../typings/index";
import { Constants } from "../constants";

export interface IGatewayOutNode extends Node {
    gatewayConf:any;
    gateway: LumiAqara.Gateway;

    setGateway(gateway:LumiAqara.Gateway);
}

export default (RED:Red) => {
    class GatewayOut {
        protected gatewayConf: any;
        protected gateway: LumiAqara.Gateway;

        constructor(props:NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            this.gatewayConf= RED.nodes.getNode((<any> props).gateway);
            (<any> this).status({fill:"red", shape:"ring", text: "offline"});

            this.setMessageListener();
        }

        protected setMessageListener() {
            (<any> this).on("input", (msg) => {
                if (msg.hasOwnProperty("payload") && this.gateway) {
                    if(msg.payload.cmd === "write" && !msg.payload.data.key && this.gateway && this.gateway.sid && this.gateway._key) {
                        msg.payload.data.key = this.gateway._key;
                    }
                    this.gateway._sendUnicast(JSON.stringify(msg.payload));
                }
            });
        }

        setGateway(gateway) {
            this.gateway = gateway;
            this.gateway.setPassword(this.gatewayConf.password);
            (<any> this).status({fill:"blue", shape:"dot", text: "online"});

            this.gateway.on('offline', () => {
                this.gateway = null;
                (<any> this).status({fill:"red", shape:"ring", text: "offline"});
            });
        }
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-gateway out`, <any> GatewayOut);
};