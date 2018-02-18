import * as events from 'events';

import {GatewayMessage} from "./GatewayMessage";
import {GatewayMessageDefaultSubdeviceData} from "./GatewayMessageData";

export abstract class GatewaySubdevice extends events.EventEmitter {
    public voltage: number;
    public message: GatewayMessage;

    constructor(public sid: string, public model: string) {
        super();
    }

    get batteryLevel(): number {
        /*
          When full, CR2032 batteries are between 3 and 3.4V
          http://farnell.com/datasheets/1496885.pdf
        */
        return this.voltage ? Math.min(Math.round((this.voltage - 2200) / 10), 100) : -1;
    }

    handleMessage(msg: GatewayMessage): void {
        this.voltage = (<GatewayMessageDefaultSubdeviceData> msg.data).voltage;
        this.message = msg;
    }

    static get acceptedModels(): string[] {
        return [];
    };

    abstract get internalModel(): string;

    toJSON() {
        let json:any = {};
        for(let prop of Object.keys(this)) {
            json[prop] = this[prop];
        }
        delete json._events;
        delete json._eventsCount;
        delete json._maxListeners;
        json.batteryLevel = this.batteryLevel;
        json.internalModel = this.internalModel;
        return json;
    }
}