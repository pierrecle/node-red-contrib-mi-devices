import { Red, NodeProperties, NodeStatus } from "node-red";
import { Constants } from "../constants";

export default (RED:Red, type:string) => {
    class WriteAction {
        constructor(props:NodeProperties) {
            RED.nodes.createNode(<any> this, props);

            (<any> this).on('input', (msg) => {
                if(msg.sid) {
                    msg.payload = {
                        cmd: "write",
                        data: {
                            status: (<any> this).type.replace(`${Constants.NODES_PREFIX}-actions `, ''),
                            sid: msg.sid
                        }
                    };
                    (<any> this).send(msg);
                }
            });
        }
    }
    RED.nodes.registerType(`${Constants.NODES_PREFIX}-actions ${type}`, <any> WriteAction);
};