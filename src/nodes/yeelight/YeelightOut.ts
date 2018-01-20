import { Red, Node, NodeProperties, NodeStatus, ClearNodeStatus } from "node-red";
import { Constants } from "../constants";
import { IYeelightConfiguratorNode } from "./YeelightConfigurator";

export interface IYeelightOutNode {
    yeelightNode:IYeelightConfiguratorNode;
}

export default (RED:Red) => {
    class YeelightOut implements IYeelightOutNode {
        yeelightNode:IYeelightConfiguratorNode;

        constructor(props: NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            this.yeelightNode = <any> RED.nodes.getNode((<any> props).yeelight);

            (<any> this).status({fill: "red", shape: "ring", text: "offline"});
            this.yeelightNode && this.yeelightNode.on('bulbFound', () => {
                (<any>this).status({fill:"blue", shape:"dot", text: "online"});
            });

            this.setListener();
        }

        protected setListener() {
            (<any> this).on('input', (msg) => {
                if (this.yeelightNode.bulb) {
                    if(msg.payload === "on") {
                        this.yeelightNode.bulb.turnOn();
                    }
                    else if(msg.payload === "off") {
                        this.yeelightNode.bulb.turnOff();
                    }
                    else if(msg.payload === "toggle") {
                        this.yeelightNode.bulb.toggle();
                    }
    
                    if(msg.payload.color !== undefined) {
                        // TODO: revoir la couleur
                        this.yeelightNode.bulb.setRGB(msg.payload.color);
                    }
                    if(msg.payload.brightness !== undefined) {
                        this.yeelightNode.bulb.setBrightness(msg.payload.brightness);
                    }
                }
            });
    
        }
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-yeelight out`, <any> YeelightOut);
};
