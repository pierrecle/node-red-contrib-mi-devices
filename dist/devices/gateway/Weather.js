"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GatewaySubdevice_1 = require("./GatewaySubdevice");
class Weather extends GatewaySubdevice_1.GatewaySubdevice {
    static get acceptedModels() {
        return ['sensor_ht', 'weather.v1'];
    }
    get internalModel() {
        return 'mi.weather';
    }
    get temperatureInDegrees() {
        return this.temperature / 100;
    }
    get humidityInPercent() {
        return this.humidity / 100;
    }
    get pressureInBar() {
        return this.pressure / 100000;
    }
    get pressureInhPa() {
        return this.pressure / 100;
    }
    handleMessage(msg) {
        super.handleMessage(msg);
        if (msg.isReadAck() || msg.isReport()) {
            let data = msg.data;
            ['temperature', 'humidity', 'pressure'].forEach((dataType) => {
                if (data[dataType]) {
                    this[dataType] = parseInt(data[dataType]);
                }
            });
            this.emit('values-updated', this.sid);
        }
    }
}
exports.Weather = Weather;
