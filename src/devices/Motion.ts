import {GatewaySubdevice} from "./GatewaySubdevice";
import {GatewayMessage} from "./GatewayMessage";

export class Motion extends GatewaySubdevice {

    static get acceptedModels():string[] {
        return ['motion'];
    }

    get internalModel(): string {
        return 'mi.motion';
    }

    handleMessage(msg: GatewayMessage) {
        super.handleMessage(msg);
    }
}