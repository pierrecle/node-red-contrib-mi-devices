import {GatewaySubdevice} from "./GatewaySubdevice";
import {GatewayMessage} from "./GatewayMessage";
import {GatewayMessageReadAckReportMotionData} from "./GatewayMessageData";

export class Motion extends GatewaySubdevice {
    public lux = 0;
    public lastMotionTimestamp;

    static get acceptedModels(): string[] {
        return ['motion', 'sensor_motion.aq2'];
    }

    get internalModel(): string {
        return 'mi.motion';
    }

    handleMessage(msg: GatewayMessage) {
        super.handleMessage(msg);
        if (msg.isReadAck() || msg.isReport()) {
            let data = <GatewayMessageReadAckReportMotionData> msg.data;
            if (data.lux) {
                this.lux = parseInt(data.lux);
            }
            if (data.status === "motion") {
                this.lastMotionTimestamp = data.timestamp;
                this.emit('values-updated', {sid: this.sid, data: {hasMotion: true}});
            }
        }
    }
}