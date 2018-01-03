const miDevicesUtils = require('../src/utils');

module.exports = (RED) => {
    /*********************************************
     Read data from Gateway
     *********************************************/
    function XiaomiActionRead(config) {
        RED.nodes.createNode(this, config);

        this.on('input', (msg) => {
            if(msg.sid) {
                msg.payload = { cmd: "read", sid: msg.sid };
                this.send(msg);
            }
        });
    }
    RED.nodes.registerType("xiaomi-actions read", XiaomiActionRead);

    /*********************************************
     Get registred ids of devices on gateway
     *********************************************/
    function XiaomiActionGetIdList(config) {
        RED.nodes.createNode(this, config);

        this.on('input', (msg) => {
            msg.payload = { cmd: "get_id_list" };
            node.send(msg);
        });
    }
    RED.nodes.registerType("xiaomi-actions get_id_list", XiaomiActionGetIdList);

    /*********************************************
     Virtual single click on a button
     *********************************************/
    function XiaomiActionSingleClick(config) {
        RED.nodes.createNode(this, config);

        this.on('input', (msg) => {
            this.gateway = msg.gateway;
            miDevicesUtils.sendWritePayloadToGateway(this, msg, {status: "click", sid: msg.sid});
        });
    }
    RED.nodes.registerType("xiaomi-actions click", XiaomiActionSingleClick);

    /*********************************************
     Virtual Double click on a button
     *********************************************/
    function XiaomiActionDoubleClick(config) {
        RED.nodes.createNode(this, config);

        this.on('input', (msg) => {
            miDevicesUtils.sendWritePayloadToGateway(this, msg, {status: "double_click", sid: msg.sid});
        });
    }
    RED.nodes.registerType("xiaomi-actions double_click", XiaomiActionDoubleClick);

    /*********************************************
     Set the gateway light
     *********************************************/
    function XiaomiActionGatewayLight(config) {
        RED.nodes.createNode(this, config);
        this.gateway = RED.nodes.getNode(config.gateway);
        this.color = RED.nodes.getNode(config.color);
        this.brightness = RED.nodes.getNode(config.brightness);

        this.on('input', (msg) => {
            let color = msg.color || this.color;
            let brightness = msg.brightness || this.brightness;
            let rgb = miDevicesUtils.computeColorValue(brightness, color.red, color.green, color.blue);
            miDevicesUtils.sendWritePayloadToGateway(this, msg, {rgb: rgb});
        });
    }
    RED.nodes.registerType("xiaomi-actions gateway_light", XiaomiActionGatewayLight);

    /*********************************************
     Play a sound on the gateway
     *********************************************/
    function XiaomiActionGatewaySound(config) {
        RED.nodes.createNode(this, config);
        this.gateway = RED.nodes.getNode(config.gateway);
        this.mid = config.mid;
        this.volume = config.volume;

        this.on('input', (msg) => {
            miDevicesUtils.sendWritePayloadToGateway(this, msg, {
                mid: parseInt(msg.mid || this.mid),
                volume: parseInt(msg.volume || this.volume)
            });
        });
    }
    RED.nodes.registerType("xiaomi-actions gateway_sound", XiaomiActionGatewaySound);

    /*********************************************
     Stop playing a sound on the gateway
     *********************************************/
    function XiaomiActionGatewayStopSound(config) {
        RED.nodes.createNode(this, config);
        this.gateway = RED.nodes.getNode(config.gateway);

        this.on('input', (msg) => {
            miDevicesUtils.sendWritePayloadToGateway(this, msg, { mid: 1000 });
        });
    }
    RED.nodes.registerType("xiaomi-actions gateway_stop_sound", XiaomiActionGatewayStopSound);

    /*********************************************
     Turn device on
     *********************************************/
    function XiaomiActionPowerOn(config) {
        RED.nodes.createNode(this, config);
        this.gateway = RED.nodes.getNode(config.gateway);

        this.on('input', (msg) => {
            if(msg.sid){
                miDevicesUtils.sendWritePayloadToGateway(this, msg, { status: "on", sid: msg.sid});
            }
            else {
                msg.payload = "off";
                this.send(msg);
            }
        });
    }
    RED.nodes.registerType("xiaomi-actions on", XiaomiActionPowerOn);

    /*********************************************
     Turn device off
     *********************************************/
    function XiaomiActionPowerOff(config) {
        RED.nodes.createNode(this, config);
        this.gateway = RED.nodes.getNode(config.gateway);

        this.on('input', (msg) => {
            if(msg.sid){
                miDevicesUtils.sendWritePayloadToGateway(this, msg, { status: "off", sid: msg.sid});
            }
            else {
                msg.payload = "off";
                this.send(msg);
            }
        });
    }
    RED.nodes.registerType("xiaomi-actions off", XiaomiActionPowerOff);
}
