"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = (RED) => {
    class Plug {
        constructor(props) {
            RED.nodes.createNode(this, props);
            this.gateway = RED.nodes.getNode(props.gateway);
            this.status({ fill: "grey", shape: "ring", text: "status" });
        }
        setListener() {
            if (this.gateway) {
                this.on('input', (msg) => {
                    var payload = msg.payload;
                    if (payload.sid) {
                        if (payload.sid == this.sid) {
                            if (payload.data.status && payload.data.status == "on") {
                                this.status({ fill: "green", shape: "dot", text: "on" });
                            }
                            else if (payload.data.status && payload.data.status == "off") {
                                this.status({ fill: "red", shape: "dot", text: "off" });
                            }
                            this.send(msg);
                        }
                    }
                    else {
                        this.send(msg);
                    }
                });
            }
        }
    }
    RED.nodes.registerType(`${constants_1.Constants.NODES_PREFIX}-plug`, Plug);
};
