import { Red, NodeProperties } from "node-red";
import { Constants } from "../constants";
import {Gateway} from "../../devices/Gateway";

export interface IGatewayOutNode extends Node {
    gatewayConf:any;
    gateway: Gateway;
}

export default (RED:Red) => {
    class GatewayOut {
        protected gatewayConf: any;

        constructor(props: NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            this.gatewayConf = RED.nodes.getNode((<any> props).gateway);

            (<any>this).status({fill: "red", shape: "ring", text: "offline"});

            if (this.gatewayConf.gateway) {
                (<any>this).status({fill: "blue", shape: "dot", text: "online"});
            }

            this.gatewayConf.on('gateway-online', () => {
                (<any>this).status({fill: "blue", shape: "dot", text: "online"});
            });

            this.gatewayConf.on('gateway-offline', () => {
                (<any>this).status({fill: "red", shape: "ring", text: "offline"});
            });
        }

        protected setMessageListener() {
            /*(<any> this).on("input", (msg) => {
                if (msg.hasOwnProperty("payload") && this.gateway) {
                    if(msg.payload.cmd === "write" && !msg.payload.data.key && this.gateway && this.gateway.sid && this.gateway._key) {
                        msg.payload.data.key = this.gateway._key;
                    }
                    this.gateway._sendUnicast(JSON.stringify(msg.payload));
                }
            });*/
        }
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-gateway out`, <any> GatewayOut);
};