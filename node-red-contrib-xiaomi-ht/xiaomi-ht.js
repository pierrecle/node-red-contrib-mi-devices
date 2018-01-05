const miDevicesUtils = require('../src/utils');

module.exports = (RED) => {
    // sensor_ht, weather.v1

    function XiaomiHtNode(config) {
        RED.nodes.createNode(this, config);
        this.gateway = RED.nodes.getNode(config.gateway);
        this.sid = config.sid;

        this.status({fill:"grey", shape:"ring", text:"battery - na"});

        if (this.gateway) {
            this.on('input', (msg) => {
                let payload = msg.payload;

                // Input from gateway
                if (payload.sid) {
                    if (payload.sid == this.sid) {
                        miDevicesUtils.setStatus(this, payload.data);
                        ["temperature", "humidity", "pressure"].forEach((dataType) => {
                            if(payload.data[dataType]) {
                                payload.data[dataType] = parseInt(payload.data[dataType])/100;
                            }
                        });
                    }
                    else {
                        msg = null;
                    }
                }
                // Prepare for request
                else {
                    miDevicesUtils.prepareForGatewayRequest(this, msg);
                }
                this.send(msg);
            });
        }
    }

    RED.nodes.registerType("xiaomi-ht", XiaomiHtNode);
};
