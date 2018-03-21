import {Red, Node, NodeProperties} from 'node-red';
import {Constants} from '../constants';
import {Gateway} from "../../devices/gateway/Gateway";

export interface IGatewayInNode extends Node {
    gatewayConf: any;
    gateway: Gateway;
}

export default (RED: Red) => {
    class GatewayIn {
        protected gatewayConf: any;

        constructor(props: NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            this.gatewayConf = RED.nodes.getNode((<any> props).gateway);

            (<any>this).status({fill: "red", shape: "ring", text: "offline"});

            if (this.gatewayConf.gateway) {
                this.gatewayOnline();
            }

            this.gatewayConf.on('gateway-online', () => this.gatewayOnline());

            this.gatewayConf.on('gateway-offline', () => this.gatewayOffline());
        }

        protected gatewayOnline() {
            (<any>this).status({fill: "blue", shape: "dot", text: "online"});
            this.gatewayConf.on('subdevice-update', (subdevice) => {
                (<any> this).send({payload: subdevice});
            });
        }

        protected gatewayOffline() {
            (<any>this).status({fill: "red", shape: "ring", text: "offline"});
        }
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-gateway in`, <any> GatewayIn);
};