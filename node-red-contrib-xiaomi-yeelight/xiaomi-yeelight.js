const miDevicesUtils = require('../src/utils');
const Yeelight = require("yeelight2");

module.exports = (RED) => {
    function XiaomiYeelightOutputNode(config) {
        RED.nodes.createNode(this, config);
        this.ip = config.ip;
        this.port = config.port;

        this.status({fill:"grey", shape:"ring", text:"na"});

        this.setupConnection = function(){
            try {
                this.light = Yeelight(`yeelight://${this.ip}:${this.port}`);
                this.status({fill:"blue", shape:"dot", text:"connected"});
            } catch(err) {
                this.status({fill:"red",shape:"ring",text:err.message});
                this.light = null;
                this.error(err);

                // try to reconnect in 5 minutes
                window.setTimeout((function(self) {
                     return function() {
                            self.setupConnection.apply(self, arguments);
                        }
                })(this), 1000*60*5);
            }
        }

        if (this.ip && this.port) {
            this.setupConnection(); 
            this.on('input', (msg) => {
                if(msg.payload === "on") {
                    this.light && this.light.set_power('on');
                }
                else if(msg.payload === "off") {
                    this.light && this.light.set_power('off');
                }
                else if(msg.payload === "toggle") {
                    this.light && this.light.toggle();
                }

                if(msg.payload.color !== undefined) {
                    this.light && this.light.set_rgb(msg.payload.color);
                }
                if(msg.payload.brightness !== undefined) {
                    this.light && this.light.set_bright(msg.payload.brightness);
                }
            });

            this.on('close', () => {
                this.light && this.light.exit();
            });
        }
    }
    RED.nodes.registerType("xiaomi-yeelight out", XiaomiYeelightOutputNode);
};
