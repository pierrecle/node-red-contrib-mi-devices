import {GatewaySubdevice} from "./GatewaySubdevice";
import {GatewayMessage} from "./GatewayMessage";
import {GatewayMessageReadAckReportWeatherData} from "./GatewayMessageData";

export class Weather extends GatewaySubdevice {
    temperature: number;
    humidity: number;
    /**
     * Pressure in Pascals
     */
    pressure: number;

    static get acceptedModels():string[] {
        return ['sensor_ht', 'weather.v1'];
    }

    get internalModel(): string {
        return 'mi.weather';
    }

    get temperatureInDegrees(): number {
        return this.temperature / 100;
    }

    get humidityInPercent(): number {
        return this.humidity / 100;
    }

    get pressureInBar(): number {
        return this.pressure / 100000;
    }

    get pressureInhPa(): number {
        return this.pressure / 100;
    }

    handleMessage(msg: GatewayMessage) {
        super.handleMessage(msg);
        if (msg.isReadAck() || msg.isReport()) {
            let data = <GatewayMessageReadAckReportWeatherData> msg.data;
            ['temperature', 'humidity', 'pressure'].forEach((dataType: string) => {
                if (data[dataType]) {
                    this[dataType] = parseInt(data[dataType]);
                }
            });
            this.emit('values-updated', this.sid);
        }
    }
}