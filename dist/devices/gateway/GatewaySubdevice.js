"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
class GatewaySubdevice extends events.EventEmitter {
    constructor(sid, model) {
        super();
        this.sid = sid;
        this.model = model;
    }
    get batteryLevel() {
        /*
          When full, CR2032 batteries are between 3 and 3.4V
          http://farnell.com/datasheets/1496885.pdf
        */
        return this.voltage ? Math.min(Math.round((this.voltage - 2200) / 10), 100) : -1;
    }
    handleMessage(msg) {
        if (msg.data.voltage) {
            this.voltage = msg.data.voltage;
        }
        this.message = msg;
    }
    static get acceptedModels() {
        return [];
    }
    ;
    toJSON() {
        let json = {};
        for (let prop of Object.keys(this)) {
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
exports.GatewaySubdevice = GatewaySubdevice;
