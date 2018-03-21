"use strict";
const ReadAction_1 = require("./ReadAction");
const WriteAction_1 = require("./WriteAction");
const Light_1 = require("./Light");
const GatewayPlaySound_1 = require("./GatewayPlaySound");
const GatewayStopSound_1 = require("./GatewayStopSound");
const ToggleAction_1 = require("./ToggleAction");
module.exports = (RED) => {
    ["read", "get_id_list"].forEach((action) => {
        ReadAction_1.default(RED, action);
    });
    ["click", "double_click"].forEach((action) => {
        WriteAction_1.default(RED, action);
    });
    Light_1.default(RED);
    GatewayPlaySound_1.default(RED);
    GatewayStopSound_1.default(RED);
    ["turn_on", "turn_off", "toggle"].forEach(action => {
        ToggleAction_1.default(RED, action);
    });
};
