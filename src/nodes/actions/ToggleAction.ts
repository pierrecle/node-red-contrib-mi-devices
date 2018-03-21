import {Red, NodeProperties} from "node-red";
import {Constants} from "../constants";

export default (RED: Red, action: string) => {
    class ToggleAction {
        constructor(props: NodeProperties) {
            RED.nodes.createNode(<any> this, props);
            (<any> this).setListeners();
        }

        protected setListeners() {
            (<any> this).on('input', (msg) => {
                msg.payload = { action };
                (<any> this).send(msg);
            });
        }
    }

    RED.nodes.registerType(`${Constants.NODES_PREFIX}-actions ${action}`, <any> ToggleAction);
};