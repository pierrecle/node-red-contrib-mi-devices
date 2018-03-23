"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const uniqid = require("uniqid");
exports.default = (RED) => {
    class All {
        static getOnlyModelsValue(input) {
            var cleanOnlyModels = [];
            input.forEach((value) => {
                cleanOnlyModels = cleanOnlyModels.concat(value.split(','));
            });
            return cleanOnlyModels;
        }
        constructor(props) {
            RED.nodes.createNode(this, props);
            this.gatewayConf = RED.nodes.getNode(props.gateway);
            this.onlyModels = All.getOnlyModelsValue(props.onlyModels || []);
            this.excludedSids = props.excludedSids;
            this.setMessageListener();
        }
        setMessageListener() {
            this.on('input', (msg) => {
                if (this.gatewayConf) {
                    // Filter input
                    if (msg.payload && msg.payload.model && msg.payload.sid) {
                        if (!this.isDeviceValid(msg.payload.sid)) {
                            msg = null;
                        }
                        this.send(msg);
                    }
                    else {
                        let partsId = uniqid();
                        Object.keys(this.gatewayConf.deviceList || {})
                            .filter((sid) => this.isDeviceValid(sid))
                            .forEach((sid, i, subSids) => {
                            let curMsg = Object.assign({}, msg);
                            delete curMsg._msgid;
                            curMsg.parts = {
                                id: partsId,
                                index: i,
                                count: subSids.length,
                            };
                            curMsg.sid = sid;
                            curMsg.gateway = this.gatewayConf;
                            this.send(curMsg);
                        });
                    }
                }
            });
        }
        isDeviceValid(sid) {
            if ((!this.onlyModels || this.onlyModels.length == 0) && (!this.excludedSids || this.excludedSids.length == 0)) {
                return true;
            }
            let device = this.gatewayConf.deviceList[sid];
            // Is excluded
            if ((this.excludedSids && this.excludedSids.length != 0) && this.excludedSids.indexOf(sid) >= 0) {
                return false;
            }
            if ((this.onlyModels && this.onlyModels.length != 0) && this.onlyModels.indexOf(device.internalModel) >= 0) {
                return true;
            }
            return false;
        }
    }
    RED.nodes.registerType(`${constants_1.Constants.NODES_PREFIX}-all`, All);
};
