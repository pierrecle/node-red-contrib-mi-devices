import * as events from 'events';
import * as YeelightSearch from 'yeelight-wifi';

export class YeelightServer extends events.EventEmitter {
    private static instance: YeelightServer;

    private _bulbs: { [sid: string]: any } = {};
    private _bulbsJson: { [sid: string]: any } = {};

    static getInstance() {
        if (!this.instance) {
            this.instance = new YeelightServer();
        }
        return this.instance;
    }

    get bulbs(): { [sid: string]: any } {
        return this._bulbsJson;
    }

    getBulb(sid) {
        return this._bulbs[sid];
    }

    discover() {
        new Promise(() => {
            (new YeelightSearch()).on('found', (bulb: any) => {
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