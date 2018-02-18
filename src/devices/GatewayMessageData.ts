export interface GatewayMessageHeartbeatData {
    ip: string;
}

export interface GatewayMessageGetIdListData extends Array<string> {
}

export interface GatewayMessageDefaultSubdeviceData {
    voltage: number;
}

export interface GatewayMessageReadAckMagnetData extends GatewayMessageDefaultSubdeviceData {
    status: string;
}

export interface GatewayMessageReadAckReportWeatherData extends GatewayMessageDefaultSubdeviceData {
    temperature?: string;
    humidity?: string;
    pressure?: string;
}