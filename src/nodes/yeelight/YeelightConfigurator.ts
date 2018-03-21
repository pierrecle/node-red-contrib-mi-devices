import {Red, Node, NodeProperties, NodeStatus, ClearNodeStatus} from "node-red";
import {Constants} from "../constants";
import {YeelightServer} from "../../devices/yeelight/YeelightServer";

export interface IYeelightConfiguratorNode extends Node {
    ip: string;
    sid: number;
    bulb: any;

    on(event: "bulb-online", listener: () => void): any;
    on(event: "bulb-offline", listener: () => void): any;
}

export default (RED: Red) => {
    class YeelightConfigurator {
        ip: string;
        sid: number;
        _bulb: any;

        constructor(props: NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            let {sid} = <any> props;
            this.sid = parseInt(sid);

            if (this.sid) {
                this.setBulb();
            }
            let server = YeelightServer.getInstance();

            server.on('yeelight-online', (sid) => {
                if (sid === this.sid) {
                    this.setBulb();
                    (<any> this).emit('bulb-online');
                }
            });

            server.on('yeelight-offline', (sid) => {
                if (sid === this.sid) {
                    this._bulb = null;
                    (<any> this).emit('bulb-offline');
                }
            });
        }

        protected setBulb() {
            this._bulb = YeelightServer.getInstance().getBulb(this.sid);
        }

        get bulb() {
            return this._bulb;
        }
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-yeelight configurator`, <any> YeelightConfigurator, {
        settings: {
            miDevicesYeelightConfiguratorDiscoveredBulbs: {
                value: YeelightServer.getInstance().bulbs,
                exportable: true
            }
        }
    });
};
