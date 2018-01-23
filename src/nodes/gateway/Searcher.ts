import { Red } from "node-red";
import * as LumiAqara from 'lumi-aqara';

import { Constants } from "../constants";
import { IGatewayConfiguratorNode } from "./GatewayConfigurator";

export class Searcher {
    static _gateways:LumiAqara.Gateway[] = [];

    static discover(RED:Red) {
        new Promise(() => {
            const aqara = new LumiAqara();

            aqara.on('gateway', (gateway:LumiAqara.Gateway) => {
                let frontGateway = {
                    sid: gateway.sid,
                    ip: gateway.ip,
                    subdevices: []
                };
                this._gateways.push(frontGateway);
                gateway.on('subdevice', (device:LumiAqara.SubDevice) => {
                    frontGateway.subdevices.push({
                        sid: device.getSid(),
                        type: device.getType()
                    });
                });
                RED.nodes.eachNode((tmpNode) => {
                    if(tmpNode.type.indexOf(`${Constants.NODES_PREFIX}-gateway configurator`) === 0) {
                        let tmpNodeInst = <IGatewayConfiguratorNode> RED.nodes.getNode(tmpNode.id);
                        if(tmpNodeInst && (tmpNodeInst.ip === gateway.ip || tmpNodeInst.sid === gateway.sid)) {
                            tmpNodeInst.gateway = gateway;
                        }
                    }
                });
            });
        });
    }

    static get gateways():LumiAqara.Gateway {
        return this._gateways;
    }
}