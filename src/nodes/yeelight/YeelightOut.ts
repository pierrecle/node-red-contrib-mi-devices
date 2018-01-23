import { Red, Node, NodeProperties, NodeStatus, ClearNodeStatus } from "node-red";
import { Constants } from "../constants";
import { IYeelightConfiguratorNode } from "./YeelightConfigurator";

export interface IYeelightOutNode {
    yeelightConfNode:IYeelightConfiguratorNode;
}

export default (RED:Red) => {
    class YeelightOut implements IYeelightOutNode {
        yeelightConfNode:IYeelightConfiguratorNode;

        constructor(props: NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            this.yeelightConfNode = <any> RED.nodes.getNode((<any> props).yeelight);

            (<any> this).status({fill: "red", shape: "ring", text: "offline"});
            this.yeelightConfNode && this.yeelightConfNode.on('bulbFound', () => {
                (<any>this).status({fill:"blue", shape:"dot", text: "online"});
            });

            this.setListener();
        }

        protected setListener() {
            (<any> this).on('input', (msg) => {
                if (this.yeelightConfNode.bulb) {
                    if(msg.payload === "on") {
                        this.yeelightConfNode.bulb.turnOn();
                    }
                    else if(msg.payload === "off") {
                        this.yeelightConfNode.bulb.turnOff();
                    }
                    else if(msg.payload === "toggle") {
                        this.yeelightConfNode.bulb.toggle();
                    }
    
                    if(msg.payload.color !== undefined) {
                        // TODO: revoir la couleur
                        this.yeelightConfNode.bulb.setRGB(msg.payload.color);
                    }
                    if(msg.payload.brightness !== undefined) {
                        this.yeelightConfNode.bulb.setBrightness(msg.payload.brightness);
                    }
                }
            });
    
        }
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-yeelight out`, <any> YeelightOut);
};
