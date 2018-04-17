const crypto = require("crypto");
const miDevicesUtils = require('../src/utils');

module.exports = (RED) => {
    function XiaomiPlugNode(config) {
        RED.nodes.createNode(this, config);
        this.gateway = RED.nodes.getNode(config.gateway);
        this.sid = config.sid;

        this.status({fill:"grey", shape:"ring", text:"status"});

        if (this.gateway && this.key != "") {
            this.on('input', (msg) => {
                var payload = msg.payload;
                if(payload.sid) {
                    if (payload.sid == this.sid) {
                        if (payload.data && payload.data.status && payload.data.status == "on") {
                            this.status({fill:"green", shape:"dot", text:"on"});
                        } else if (payload.data && payload.data.status && payload.data.status == "off") {
                            this.status({fill:"red", shape:"dot", text:"off"});
                        }
                        this.send(msg);
                    }
                }
                // Prepare for request
                else {
                    miDevicesUtils.prepareForGatewayRequest(this, msg);
                    this.send(msg);
                }
            });
        }

    }

    RED.nodes.registerType("xiaomi-plug", XiaomiPlugNode);

}
