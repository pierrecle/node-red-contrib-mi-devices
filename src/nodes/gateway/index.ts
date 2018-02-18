import { Red, NodeProperties } from "node-red";
import * as LumiAqara from 'lumi-aqara';

import { GatewayServer } from "../../devices/GatewayServer";
import {default as GatewayConfigurator} from "./GatewayConfigurator";
import {default as Gateway} from "./Gateway";
import {default as GatewayIn} from "./GatewayIn";
import {default as GatewayOut} from "./GatewayOut";

export = (RED:Red) => {
    GatewayServer.getInstance().discover();

    GatewayConfigurator(RED);
    Gateway(RED);
    GatewayIn(RED);
    GatewayOut(RED);
};
