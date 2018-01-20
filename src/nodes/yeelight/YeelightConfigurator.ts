import { Red, NodeProperties, NodeStatus, ClearNodeStatus } from "node-red";
import { Constants } from "../constants";
import { Searcher } from "./Searcher";

export interface IYeelightConfiguratorNode {
    ip:string;
    sid:number;
    bulb:any;

    on(event: "bulbFound", listener: () => void): any;
}

export default (RED:Red) => {
    class YeelightConfigurator {
        ip:string;
        sid:number;
        _bulb:any;

        constructor(props: NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            let {ip, sid} = <any> props;
            this.sid = sid;
            this.ip = ip;
        }

        set bulb(bulb) {
            this._bulb = bulb;
            (<any> this).emit('bulbFound');
        }

        get bulb() {
            return this._bulb;
        }
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-yeelight configurator`, <any> YeelightConfigurator, {
        settings: {
            miDevicesYeelightConfiguratorDiscoveredBulbs: { value: Searcher.bulbs, exportable: true }
        }
    });
};
