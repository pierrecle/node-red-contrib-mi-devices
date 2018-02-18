import { Red, NodeProperties, NodeStatus } from "node-red";
import { Constants } from "../constants";

export default (RED:Red, type:string) => {
    class ReadAction {
        constructor(props:NodeProperties) {
            RED.nodes.createNode(<any> this, props);

            (<any> this).on('input', (msg) => {
                if(msg.sid) {
                    msg.payload = {
                        cmd: (<any> this).type.replace(`${Constants.NODES_PREFIX}-actions `, ''),
                        sid: msg.sid
                    };
                    (<any> this).send(msg);
                }
            });
        }
    }
    
    RED.nodes.registerType(`${Constants.NODES_PREFIX}-actions ${type}`, <any> ReadAction);
};