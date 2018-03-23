import {Red, NodeProperties} from "node-red";
import {Constants} from "../constants";
import * as uniqid from 'uniqid';

export default (RED: Red) => {
    class All {
        protected gatewayConf: any;
        protected onlyModels: string[];
        protected excludedSids: string[];

        static getOnlyModelsValue(input) {
            var cleanOnlyModels = [];
            input.forEach((value) => {
                cleanOnlyModels = cleanOnlyModels.concat(value.split(','));
            });
            return cleanOnlyModels;
        }

        constructor(props: NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            this.gatewayConf = RED.nodes.getNode((<any> props).gateway);
            this.onlyModels = All.getOnlyModelsValue((<any> props).onlyModels || []);
            this.excludedSids = (<any> props).excludedSids;

            this.setMessageListener();
        }

        protected setMessageListener() {
            (<any> this).on('input', (msg) => {
                if (this.gatewayConf) {
                    // Filter input
                    if (msg.payload && msg.payload.model && msg.payload.sid) {
                        if (!this.isDeviceValid(msg.payload.sid)) {
                            msg = null;
                        }
                        (<any> this).send(msg);
                    }
                    // Prepare for request
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

                                (<any> this).send(curMsg);
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

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-all`, <any> All);
};