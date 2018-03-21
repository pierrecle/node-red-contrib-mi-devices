"use strict";
const GatewayServer_1 = require("../../devices/gateway/GatewayServer");
const GatewayConfigurator_1 = require("./GatewayConfigurator");
const Gateway_1 = require("./Gateway");
const GatewayIn_1 = require("./GatewayIn");
const GatewayOut_1 = require("./GatewayOut");
module.exports = (RED) => {
    GatewayServer_1.GatewayServer.getInstance().discover();
    GatewayConfigurator_1.default(RED);
    Gateway_1.default(RED);
    GatewayIn_1.default(RED);
    GatewayOut_1.default(RED);
};
