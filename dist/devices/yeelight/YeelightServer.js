"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
const YeelightSearch = require("yeelight-wifi");
class YeelightServer extends events.EventEmitter {
    constructor() {
        super(...arguments);
        this._bulbs = {};
        this._bulbsJson = {};
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new YeelightServer();
        }
        return this.instance;
    }
    get bulbs() {
        return this._bulbsJson;
    }
    getBulb(sid) {
        return this._bulbs[sid];
    }
    discover() {
        new Promise(() => {
            (new YeelightSearch()).on('found', (bulb) => {
                bulb.sid = parseInt(bulb.id);
                if (!this._bulbs[bulb.sid]) {
                    this._bulbs[bulb.sid] = bulb;
                    this._bulbsJson[bulb.sid] = YeelightServer.bulbToJSON(bulb);
                    this.emit("yeelight-online", bulb.sid);
                }
            });
        });
        // TODO: disconected ?
    }
    static bulbToJSON(bulb) {
        return {
            sid: bulb.sid,
            ip: bulb.hostname,
            name: bulb.name,
            model: bulb.model
        };
    }
}
exports.YeelightServer = YeelightServer;
