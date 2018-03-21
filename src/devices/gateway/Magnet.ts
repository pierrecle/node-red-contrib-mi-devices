import {GatewaySubdevice} from "./GatewaySubdevice";
import {GatewayMessage} from "./GatewayMessage";
import {GatewayMessageReadAckMagnetData} from "./GatewayMessageData";

export class Magnet extends GatewaySubdevice {
    status: string;

    static get acceptedModels(): string[] {
        return ['magnet', 'sensor_magnet.aq2'];
    }

    get internalModel(): string {
        return 'mi.magnet';
    }

    isClosed(): boolean {
        return this.status === "close";
    }

    isOpened(): boolean {
        return this.status === "open";
    }

    isUnkownState(): boolean {
        return this.status === "unkown";
    }

    handleMessage(msg: GatewayMessage) {
        super.handleMessage(msg);
        if (msg.isReadAck() || msg.isReport()) {
            let data = <GatewayMessageReadAckMagnetData> msg.data;
            // mintime
            if (this.status !== data.status) {
                this.status = data.status;
                this.emit('values-updated', this.sid);
            }
        }
    }
}