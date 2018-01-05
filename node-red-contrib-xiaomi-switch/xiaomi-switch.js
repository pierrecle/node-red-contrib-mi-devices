const miDevicesUtils = require('../src/utils');

module.exports = (RED) => {
    // switch, sensor_switch.aq2
    function XiaomiSwitchNode(config) {
        miDevicesUtils.defaultNode(RED, config, this);
    }
    RED.nodes.registerType("xiaomi-switch", XiaomiSwitchNode);
};
