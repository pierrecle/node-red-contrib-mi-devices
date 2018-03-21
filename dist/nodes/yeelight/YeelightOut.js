"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = (RED) => {
    class YeelightOut {
        constructor(props) {
            RED.nodes.createNode(this, props);
            this.yeelightConf = RED.nodes.getNode(props.yeelight);
            this.status({ fill: "red", shape: "ring", text: "offline" });
            if (this.yeelightConf.bulb) {
                this.yeelightOnline();
            }
            this.yeelightConf.on('bulb-online', () => this.yeelightOnline());
            this.yeelightConf.on('bulb-offline', () => this.yeelightOffline());
            this.setListener();
        }
        yeelightOnline() {
            this.status({ fill: "blue", shape: "dot", text: "online" });
        }
        yeelightOffline() {
            this.status({ fill: "red", shape: "ring", text: "offline" });
        }
        setListener() {
            this.on("input", (msg) => {
                let bulb = this.yeelightConf.bulb;
                if (msg.hasOwnProperty("payload") && bulb) {
                    switch (msg.payload.action) {
                        case 'turn_on':
                            bulb.turnOn();
                            break;
                        case 'turn_off':
                            bulb.turnOff();
                            break;
                        case 'toggle':
                            bulb.toggle();
                            break;
                        case 'setLight':
                            if (msg.payload.color !== undefined) {
                                let rgb = msg.payload.color.blue | (msg.payload.color.green << 8) | (msg.payload.color.red << 16);
                                let hex = '#' + (0x1000000 + rgb).toString(16).slice(1);
                                bulb.setRGB(hex);
                            }
                            (msg.payload.brightness !== undefined) && bulb.setBrightness(Math.max(1, msg.payload.brightness));
                            break;
                    }
                }
            });
            /*(<any> this).on('input', (msg) => {
                if (this.yeelightConf.bulb) {

    
                    if(msg.payload.color !== undefined) {
                        // TODO: revoir la couleur
                        this.yeelightConf.bulb.setRGB(msg.payload.color);
                    }
                    if(msg.payload.brightness !== undefined) {
                        this.yeelightConf.bulb.setBrightness(msg.payload.brightness);
                    }
                }
            });*/
        }
    }
    RED.nodes.registerType(`${constants_1.Constants.NODES_PREFIX}-yeelight out`, YeelightOut);
};
