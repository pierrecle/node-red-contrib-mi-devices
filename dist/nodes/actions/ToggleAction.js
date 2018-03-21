"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = (RED, action) => {
    class ToggleAction {
        constructor(props) {
            RED.nodes.createNode(this, props);
            this.setListeners();
        }
        setListeners() {
            this.on('input', (msg) => {
                msg.payload = { action };
                this.send(msg);
            });
        }
    }
    RED.nodes.registerType(`${constants_1.Constants.NODES_PREFIX}-actions ${action}`, ToggleAction);
};
