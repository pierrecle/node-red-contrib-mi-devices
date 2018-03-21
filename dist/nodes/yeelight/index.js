"use strict";
const YeelightServer_1 = require("../../devices/yeelight/YeelightServer");
const YeelightConfigurator_1 = require("./YeelightConfigurator");
const YeelightOut_1 = require("./YeelightOut");
module.exports = (RED) => {
    YeelightServer_1.YeelightServer.getInstance().discover();
    YeelightConfigurator_1.default(RED);
    YeelightOut_1.default(RED);
};
