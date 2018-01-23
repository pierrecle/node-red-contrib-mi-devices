import { EventEmitter } from "events";

export module LumiAqara {
    interface Color {
        r:number;
        g:number;
        b:number;
    }
    export interface Gateway extends EventEmitter {
        ip: string;
        sid: string;
        ready: boolean;
        password: string;
        color: Color;
        intensity: number;
        /* Should be public */
        _key: string;

        setPassword(password:string);
        setColor(color:Color);
        setIntensity(intensity:number);
        /* Should be public */
        _sendUnicast(message:string);
    }

    /*************** Subdevices ***************/
    interface SubDeviceOptions {
        sid:string;
        type?:string;
    }
    export interface SubDevice extends EventEmitter {
        constructor(opts:SubDeviceOptions);
        getSid(): string;
        getType(): string;
        getBatteryVoltage(): number;
        getBatteryPercentage(): number;
    }
    export interface Cube extends SubDevice {
        constructor(opts:SubDeviceOptions);
        getType(): "cube";
        getStatus(): "rotate"|string;
        getRotateDegrees(): number|null;
        /**
         * @event Emitted when a device value updated.
         */
        on(event: "update", listener: () => void): any;
    }
    export interface Leak extends SubDevice {
        constructor(opts:SubDeviceOptions);
        getType(): "leak";
        isLeaking(): boolean;
        /**
         * @event Emitted when a device value updated.
         */
        on(event: "update", listener: () => void): any;
    }
    export interface Magnet extends SubDevice {
        constructor(opts:SubDeviceOptions);
        getType(): "magnet";
        isOpen(): boolean;
        /**
         * @event Emitted when a the door/window just opend.
         */
        on(event: "open", listener: () => void): any;
        /**
         * @event Emitted when a the door/window just closed.
         */
        on(event: "close", listener: () => void): any;
    }
    export interface Motion extends SubDevice {
        constructor(opts:SubDeviceOptions);
        getType(): "motion";
        hasMotion(): boolean;
        getLux(): number;
        getSecondsSinceMotion(): number;
        /**
         * @event Emitted when a motion has been detected.
         */
        on(event: "motion", listener: () => void): any;
        /**
         * @event Emitted after a motion ends.
         */
        on(event: "noMotion", listener: () => void): any;
    }
    export interface Sensor extends SubDevice {
        constructor(opts:SubDeviceOptions);
        getType(): "sensor";
        /**
         * @returns Temperature in degrees.
         */
        getTemperature(): number;
        /**
         * @returns Humidity in percent.
         */
        getHumidity(): number;
        /**
         * @returns Pressure in kPa
         */
        getPressure(): number;
        /**
         * @event Emitted when a device value updated.
         */
        on(event: "update", listener: () => void): any;
    }
    export interface Switch extends SubDevice {
        constructor(opts:SubDeviceOptions);
        getType(): "switch";
        /**
         * @event Emitted when a click is done on the switch.
         */
        on(event: "click", listener: () => void): any;
        /**
         * @event Emitted when a double click is done on the switch.
         */
        on(event: "doubleClick", listener: () => void): any;
        /**
         * @event Emitted when a double click is done on the switch.
         */
        on(event: "doubleClick", listener: () => void): any;
        /**
         * @event Emitted when a long press is done.
         */
        on(event: "longClickPress", listener: () => void): any;
        /**
         * @event Emitted when release the switch after a long press.
         */
        on(event: "longClickRelease", listener: () => void): any;
    }
}