import { Red, NodeProperties } from "node-red";
import { Constants } from "../constants";

export default (RED:Red) => {
    class All {
        protected gateway: any;
        protected onlyModels: string[];
        protected excludedSids: string[];

        static getOnlyModelsValue(input) {
            var cleanOnlyModels = [];
            input.forEach((value) => {
                cleanOnlyModels = cleanOnlyModels.concat(value.split(','));
            });
            return cleanOnlyModels;
        }

        constructor(props:NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            this.gateway = RED.nodes.getNode((<any> props).gateway);
            this.onlyModels = All.getOnlyModelsValue((<any> props).onlyModels || []);
            this.excludedSids = (<any> props).excludedSids;
        }

        protected setMessageListener() {
            (<any> this).on('input', (msg) => {
                if (this.gateway) {
                    // Filter input
                    if(msg.payload && msg.payload.model && msg.payload.sid) {
                        if(!this.isDeviceValid(msg.payload)) {
                            msg = null;
                        }
                    }
                    // Prepare for request
                    else {
                        msg.payload = this.gateway.deviceList.filter((device) => this.isDeviceValid(device));
                    }
                    (<any> this).send(msg);
                }
            });
        }

        isDeviceValid(device) {
            if((!this.onlyModels || this.onlyModels.length == 0) && (!this.excludedSids || this.excludedSids.length == 0)) {
                return true;
            }
            // Is excluded
            if((this.excludedSids && this.excludedSids.length != 0) && this.excludedSids.indexOf(device.sid) >= 0) {
                return false;
            }
            if((this.onlyModels && this.onlyModels.length != 0) && this.onlyModels.indexOf(device.model) >= 0) {
                return true;
            }

            return false;
        }
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-all`, <any> All);
};