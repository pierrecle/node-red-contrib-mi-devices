"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
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
            this.gateway = RED.nodes.getNode(props.gateway);
            this.onlyModels = All.getOnlyModelsValue(props.onlyModels || []);
            this.excludedSids = props.excludedSids;
            this.setMessageListener();
        }
        setMessageListener() {
            this.on('input', (msg) => {
                if (this.gateway) {
                    // Filter input
                    if (msg.payload && msg.payload.model && msg.payload.sid) {
                        if (!this.isDeviceValid(msg.payload)) {
                            msg = null;
                        }
                        this.send(msg);
                    }
                    else {
                        Object.keys(this.gateway.deviceList || {})
                            .filter((sid) => this.isDeviceValid(sid))
                            .forEach((sid) => {
                            let curMsg = Object.assign({}, msg);
                            curMsg.sid = sid;
                            curMsg.gateway = this.gateway;
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
            let device = this.gateway.deviceList[sid];
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
