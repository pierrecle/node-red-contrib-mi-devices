import {Red} from "node-red";

import {default as ReadAction} from './ReadAction';
import {default as WriteAction} from './WriteAction';
import {default as Light} from './Light';
import {default as GatewayPlaySound} from './GatewayPlaySound';
import {default as GatewayStopSound} from './GatewayStopSound';

export = (RED: Red) => {
    ["read", "get_id_list"].forEach((action) => {
        ReadAction(RED, action);
    });

    ["click", "double_click"].forEach((action) => {
        WriteAction(RED, action);
    });
    Light(RED);
    GatewayPlaySound(RED);
    GatewayStopSound(RED);
};