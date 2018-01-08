module.exports = (RED) => {


    function XiaomiAllNode(config) {
        RED.nodes.createNode(this, config);
        this.gateway = RED.nodes.getNode(config.gateway);
        this.onlyModels = config.onlyModels;
        this.excludedSids = config.excludedSids;
        console.log(this.onlyModels);


        this.isDeviceValid = (device) => {
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

        if (this.gateway) {
            this.on('input', (msg) => {
                // Filter input
                if(msg.payload.model && msg.payload.sid) {
                    if(!this.isDeviceValid(msg.payload)) {
                        msg = null;
                    }
                }
                // Prepare for request
                else {
                    msg.payload = this.gateway.deviceList.filter((device) => this.isDeviceValid(device));
                }
                this.send(msg);
            });
        }
    }

    RED.nodes.registerType("xiaomi-all", XiaomiAllNode);
}
