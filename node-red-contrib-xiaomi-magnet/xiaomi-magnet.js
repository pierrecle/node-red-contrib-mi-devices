const miDevicesUtils = require('../src/utils');

module.exports = (RED) => {
    function XiaomiMagnetNode(config) {
        miDevicesUtils.defaultNode(RED, config, this);
    }
    RED.nodes.registerType("xiaomi-magnet", XiaomiMagnetNode);
};
