import {Red, Node, NodeProperties} from 'node-red';
import {Constants} from '../constants';
import {Gateway} from "../../devices/Gateway";

export interface IGatewayInNode extends Node {
    gatewayConf: any;
    gateway: Gateway;
}

export default (RED: Red) => {
    class GatewayIn {
        protected gatewayConf: any;

        constructor(props: NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            this.gatewayConf = RED.nodes.getNode((<any> props).gateway);

            (<any>this).status({fill: "red", shape: "ring", text: "offline"});

            if (this.gatewayConf.gateway) {
                this.gatewayOnline();
            }

            this.gatewayConf.on('gateway-online', () => this.gatewayOnline());

            this.gatewayConf.on('gateway-offline', () => this.gatewayOffline());
        }

        protected gatewayOnline() {
            (<any>this).status({fill: "blue", shape: "dot", text: "online"});
            this.gatewayConf.on('subdevice-update', (subdevice) => {
                (<any> this).send({payload: subdevice});
            });
        }

        protected gatewayOffline() {
            (<any>this).status({fill: "red", shape: "ring", text: "offline"});
        }

        /*setGateway(gateway:LumiAqara.Gateway) {
            this.gateway = gateway;
            this.gateway.setPassword(this.gatewayConf.password);
            (<any>this).status({fill:"blue", shape:"dot", text: "online"});

            this.gateway.on('offline', () => {
                this.gateway = null;
                (<any>this).status({fill:"red", shape:"ring", text: "offline"});
            });
            
            this.gateway.on('subdevice', (device) => {
                device.sid = device.getSid();
                device.type = device.getType();
                device.data = {
                    voltage: device.getBatteryVoltage(),
                    batteryLevel: device.getBatteryPercentage()
                };
                switch (device.type) {
                    case 'magnet':
                        device.data.status = device.isOpen() ? 'open' : 'close';
                        break;
                    case 'switch':
                        device.on('click', () => {
                            // Saaad
                        });
                        break;
                    case 'motion':
                        break;
                    case 'sensor':
                        device.data.temperature = device.getTemperature();
                        device.data.humidity = device.getHumidity();
                        device.data.pressure = device.getPressure();
                        break;
                    case 'leak':
                        break;
                    case 'cube':
                        break;
                };

                (<any>this).send({
                    payload: device
                });
            });
        }*/
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-gateway in`, <any> GatewayIn);
};