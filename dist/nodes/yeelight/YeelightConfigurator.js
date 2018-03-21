"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const YeelightServer_1 = require("../../devices/yeelight/YeelightServer");
exports.default = (RED) => {
    class YeelightConfigurator {
        constructor(props) {
            RED.nodes.createNode(this, props);
            let { sid } = props;
            this.sid = parseInt(sid);
            if (this.sid) {
                this.setBulb();
            }
            let server = YeelightServer_1.YeelightServer.getInstance();
            server.on('yeelight-online', (sid) => {
                if (sid === this.sid) {
                    this.setBulb();
                    this.emit('bulb-online');
                }
            });
            server.on('yeelight-offline', (sid) => {
                if (sid === this.sid) {
                    this._bulb = null;
                    this.emit('bulb-offline');
                }
            });
        }
        setBulb() {
            this._bulb = YeelightServer_1.YeelightServer.getInstance().getBulb(this.sid);
        }
        get bulb() {
            return this._bulb;
        }
    }
    RED.nodes.registerType(`${constants_1.Constants.NODES_PREFIX}-yeelight configurator`, YeelightConfigurator, {
        settings: {
            miDevicesYeelightConfiguratorDiscoveredBulbs: {
                value: YeelightServer_1.YeelightServer.getInstance().bulbs,
                exportable: true
            }
        }
    });
};
