export interface GatewayMessageHeartbeatData {
    ip: string;
}

export interface GatewayMessageGetIdListData extends Array<string> {
}

export interface GatewayMessageDefaultSubdeviceData {
    voltage: number;
    timestamp: number;
}

export interface GatewayMessageReadAckMagnetData extends GatewayMessageDefaultSubdeviceData {
    status: string;
}

export interface GatewayMessageReadAckReportWeatherData extends GatewayMessageDefaultSubdeviceData {
    temperature?: string;
    humidity?: string;
    pressure?: string;
}

export interface GatewayMessageReadAckReportMotionData extends GatewayMessageDefaultSubdeviceData {
    status?: string;
    no_motion?: string;
    lux?: string;
}