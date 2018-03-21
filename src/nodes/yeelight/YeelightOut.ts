import {Red, Node, NodeProperties, NodeStatus, ClearNodeStatus} from "node-red";
import {Constants} from "../constants";
import {IYeelightConfiguratorNode} from "./YeelightConfigurator";

export interface IYeelightOutNode {
    yeelightConf: IYeelightConfiguratorNode;
}

export default (RED: Red) => {
    class YeelightOut implements IYeelightOutNode {
        yeelightConf: IYeelightConfiguratorNode;

        constructor(props: NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            this.yeelightConf = <any> RED.nodes.getNode((<any> props).yeelight);


            (<any>this).status({fill: "red", shape: "ring", text: "offline"});

            if (this.yeelightConf.bulb) {
                this.yeelightOnline();
            }

            this.yeelightConf.on('bulb-online', () => this.yeelightOnline());
            this.yeelightConf.on('bulb-offline', () => this.yeelightOffline());

            this.setListener();
        }

        protected yeelightOnline() {
            (<any>this).status({fill: "blue", shape: "dot", text: "online"});
        }

        protected yeelightOffline() {
            (<any>this).status({fill: "red", shape: "ring", text: "offline"});
        }

        protected setListener() {
            (<any> this).on("input", (msg) => {
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

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-yeelight out`, <any> YeelightOut);
};
