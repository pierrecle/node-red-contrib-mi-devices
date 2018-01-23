import { Red, Node, NodeProperties, NodeStatus, ClearNodeStatus } from "node-red";
import { Constants } from "../constants";
import { Searcher } from "./Searcher";
import { LumiAqara } from "../../../typings/index";

export interface IGatewayConfiguratorNode extends Node {
    ip:string;
    sid:number;
    gateway: LumiAqara.Gateway;

    on(event: "gatewayFound", listener: () => void): any;
}

export default (RED:Red) => {
    class GatewayConfigurator {
        ip:string;
        sid:number;
        _gateway:LumiAqara.Gateway;

        constructor(props: NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            let {ip, sid} = <any> props;
            this.sid = sid;
            this.ip = ip;
        }

        set gateway(gateway:LumiAqara.Gateway) {
            this._gateway = gateway;
            this._gateway.setPassword((<any> this).credentials.key);
            (<any> this).emit('gatewayFound');
        }

        get gateway() {
            return this._gateway;
        }
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-gateway configurator`, <any> GatewayConfigurator, {
        settings: {
            miDevicesGatewayConfiguratorDiscoveredGateways: { value: Searcher.gateways, exportable: true }
        },
        credentials: { key: {type:"text"} }
    });
};
