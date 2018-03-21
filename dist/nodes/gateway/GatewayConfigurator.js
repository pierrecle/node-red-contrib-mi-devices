"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const GatewayServer_1 = require("../../devices/gateway/GatewayServer");
exports.default = (RED) => {
    class GatewayConfigurator {
        constructor(props) {
            RED.nodes.createNode(this, props);
            let { sid, key, deviceList } = props;
            this.sid = sid;
            this.key = key;
            this.deviceList = deviceList;
            let server = GatewayServer_1.GatewayServer.getInstance();
            if (this.sid) {
                this.setGateway();
            }
            server.on('gateway-online', (sid) => {
                if (sid === this.sid) {
                    this.setGateway();
                    this.emit('gateway-online');
                }
            });
            server.on('gateway-offline', (sid) => {
                if (sid === this.sid) {
                    this._gateway = null;
                    this.emit('gateway-offline');
                }
            });
        }
        setGateway() {
            this._gateway = GatewayServer_1.GatewayServer.getInstance().getGateway(this.sid);
            if (this._gateway) {
                this._gateway.password = this.key;
                this._gateway.on("subdevice-values-updated", (sidOrMessage) => {
                    let sid = sidOrMessage.sid || sidOrMessage;
                    let subdevice = this._gateway.getSubdevice(sid);
                    if (subdevice) {
                        (sidOrMessage.data ? Object.keys(sidOrMessage.data) : []).forEach((key) => {
                            subdevice[key] = sidOrMessage.data[key];
                        });
                        this.emit('subdevice-update', subdevice);
                    }
                });
            }
        }
        get gateway() {
            return this._gateway;
        }
    }
    RED.nodes.registerType(`${constants_1.Constants.NODES_PREFIX}-gateway configurator`, GatewayConfigurator, {
        settings: {
            miDevicesGatewayConfiguratorDiscoveredGateways: {
                value: GatewayServer_1.GatewayServer.getInstance().gateways,
                exportable: true
            }
        }
    });
};
