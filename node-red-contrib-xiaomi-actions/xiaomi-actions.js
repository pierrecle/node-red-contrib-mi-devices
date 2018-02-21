const miDevicesUtils = require('../src/utils');
module.exports = (RED) => {
    /*********************************************
     Turn device on
     *********************************************/
    function XiaomiActionPowerOn(config) {
        RED.nodes.createNode(this, config);

        this.on('input', (msg) => {
            if(msg.sid){
                msg.payload = {
                    cmd: "write",
                    data: { status: "on", sid: msg.sid }
                };
            }
            else {
                msg.payload = "on";
            }
            this.send(msg);
        });
    }
    RED.nodes.registerType("mi-devices-actions on", XiaomiActionPowerOn);

    /*********************************************
     Turn device off
     *********************************************/
    function XiaomiActionPowerOff(config) {
        RED.nodes.createNode(this, config);

        this.on('input', (msg) => {
            if(msg.sid){
                msg.payload = {
                    cmd: "write",
                    data: { status: "off", sid: msg.sid }
                };
            }
            else {
                msg.payload = "off";
            }
            this.send(msg);
        });
    }
    RED.nodes.registerType("mi-devices-actions off", XiaomiActionPowerOff);

    /*********************************************
     Toggle device
     *********************************************/
    function XiaomiActionToggle(config) {
        RED.nodes.createNode(this, config);

        this.on('input', (msg) => {
            msg.payload = "toggle";
            this.send(msg);
        });
    }
    RED.nodes.registerType("mi-devices-actions toggle", XiaomiActionToggle);
}
