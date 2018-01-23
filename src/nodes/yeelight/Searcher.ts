import { Red } from "node-red";

import * as YeelightSearch from 'yeelight-wifi';
import { Constants } from "../constants";
import { IYeelightConfiguratorNode } from "./YeelightConfigurator";

export class Searcher {
    static _bulbs:any[] = [];

    static discover(RED:Red) {
        new Promise(() => {
            (new YeelightSearch()).on('found', (bulb:any) => {
                this._bulbs.push({
                    name: bulb.name,
                    model: bulb.model,
                    sid: parseInt(bulb.id),
                    ip: bulb.hostname
                });
                RED.nodes.eachNode((tmpNode) => {
                    if(tmpNode.type.indexOf(`${Constants.NODES_PREFIX}-yeelight configurator`) === 0) {
                        let tmpNodeInst = <IYeelightConfiguratorNode> RED.nodes.getNode(tmpNode.id);
                        if(tmpNodeInst.ip == bulb.hostname || tmpNodeInst.sid == parseInt(bulb.id)) {
                            tmpNodeInst.bulb = bulb;
                        }
                    }
                });
            });
        });
    }

    static get bulbs() {
        return this._bulbs;
    }
}