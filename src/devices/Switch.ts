import {GatewaySubdevice} from "./GatewaySubdevice";
import {GatewayMessage} from "./GatewayMessage";

export class Switch extends GatewaySubdevice {

    static get acceptedModels():string[] {
        return ['switch', 'sensor_switch.aq2'];
    }

    get internalModel(): string {
        return 'mi.switch';
    }

    handleMessage(msg: GatewayMessage) {
        super.handleMessage(msg);
    }
}