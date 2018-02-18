import { Red, NodeProperties } from "node-red";
import * as LumiAqara from 'lumi-aqara';

import {default as ReadAction} from './ReadAction';
import {default as WriteAction} from './WriteAction';
import {default as GatewayLight} from './GatewayLight';

export = (RED:Red) => {
    GatewayLight(RED);
    ["read", "get_id_list"].forEach((action) => {
        ReadAction(RED, action);
    });
    
    ["click", "double_click"].forEach((action) => {
        WriteAction(RED, action);
    });
};