"use strict";
const All_1 = require("./All");
const Plug_1 = require("./Plug");
const GatewaySubdevice_1 = require("./GatewaySubdevice");
module.exports = (RED) => {
    All_1.default(RED);
    Plug_1.default(RED);
    ["magnet", "motion", "sensor", "switch"].forEach((subdeviceType) => {
        GatewaySubdevice_1.default(RED, subdeviceType);
    });
};
