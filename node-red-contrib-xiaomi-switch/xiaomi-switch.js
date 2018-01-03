const miDevicesUtils = require('../src/utils');

module.exports = (RED) => {
    function XiaomiSwitchNode(config) {
        miDevicesUtils.defaultNode(RED, config, this);
    }
    RED.nodes.registerType("xiaomi-switch", XiaomiSwitchNode);
};
