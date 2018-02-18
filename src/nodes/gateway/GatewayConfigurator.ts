import {Red, Node, NodeProperties} from "node-red";
import {Constants} from "../constants";
import {GatewayServer} from "../../devices/GatewayServer";
import {Gateway} from "../../devices/Gateway";
import {GatewaySubdevice} from "../../devices/GatewaySubdevice";

export interface IGatewayConfiguratorNode extends Node {
    ip: string;
    sid: number;
    gateway: Gateway;

    on(event: "gateway-online", listener: (sid: string) => void): any;

    on(event: "gateway-offline", listener: (sid: string) => void): any;

    on(event: "subdevice-update", listener: (subdevice: GatewaySubdevice) => void): any;
}

export default (RED: Red) => {
    class GatewayConfigurator {
        sid: string;
        key: string;
        _gateway: Gateway;

        constructor(props: NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            let {sid, key} = <any> props;
            this.sid = sid;
            this.key = key;
            let server = GatewayServer.getInstance();
            if (this.sid) {
                this.setGateway();
            }

            server.on('gateway-online', (sid: string) => {
                if (sid === this.sid) {
                    this.setGateway();
                    (<any> this).emit('gateway-online');
                }
            });

            server.on('gateway-offline', (sid: string) => {
                if (sid === this.sid) {
                    this._gateway = null;
                    (<any> this).emit('gateway-offline');
                }
            });
        }

        protected setGateway() {
            this._gateway = GatewayServer.getInstance().getGateway(this.sid);
            this._gateway && this._gateway.on("subdevice-values-updated", (sid: string) => {
                let subdevice = this._gateway.getSubdevice(sid);
                if (subdevice) {
                    (<any> this).emit('subdevice-update', subdevice);
                }
            });
        }

        get gateway(): Gateway {
            return this._gateway;
        }
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-gateway configurator`, <any> GatewayConfigurator, {
        settings: {
            miDevicesGatewayConfiguratorDiscoveredGateways: {
                value: GatewayServer.getInstance().gateways,
                exportable: true
            }
        }
    });
};
