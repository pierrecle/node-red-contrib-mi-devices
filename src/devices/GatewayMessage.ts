import * as MessageData from './GatewayMessageData';

export interface GatewayRawMessage {
    cmd: string;
    sid: string;
    short_id: string | number;
    model: string;
    port?: string;
    ip?: string;
    token?: string;
    data?: string;
}

export class GatewayMessage {
    cmd: string;
    sid: string;
    short_id: string | number;
    model: string;
    ip?: string;
    token?: string;
    port?: number;
    data?: MessageData.GatewayMessageHeartbeatData
        | MessageData.GatewayMessageGetIdListData
        | MessageData.GatewayMessageReadAckMagnetData
        | MessageData.GatewayMessageReadAckReportWeatherData
        | MessageData.GatewayMessageDefaultSubdeviceData
        | any;

    constructor(raw: GatewayRawMessage) {
        Object.assign(this, raw);
        if (raw.port) {
            this.port = parseInt(raw.port);
        }
        if (raw.data) {
            this.data = JSON.parse(raw.data) || raw.data;
        }
    }

    isHeartbeat(): boolean {
        return this.cmd === "heartbeat";
    }

    isIam(): boolean {
        return this.cmd === "iam";
    }

    isGetIdListAck(): boolean {
        return this.cmd === "get_id_list_ack";
    }

    isReadAck(): boolean {
        return this.cmd === "read_ack";
    }

    isReport(): boolean {
        return this.cmd === "report";
    }
}