import { Red, NodeProperties } from "node-red";
import * as LumiAqara from 'lumi-aqara';

import {default as All} from "./All";
import {default as Plug} from "./Plug";
import {default as GatewaySubdevice} from "./GatewaySubdevice";

export = (RED:Red) => {
    All(RED);
    Plug(RED);
    ["magnet", "motion", "sensor", "switch"].forEach((subdeviceType) => {
        GatewaySubdevice(RED, subdeviceType);
    });
};