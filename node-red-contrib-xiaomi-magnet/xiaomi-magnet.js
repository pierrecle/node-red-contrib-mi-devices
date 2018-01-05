const miDevicesUtils = require('../src/utils');

module.exports = (RED) => {
    // magnet, sensor_magnet.aq2
    function XiaomiMagnetNode(config) {
        miDevicesUtils.defaultNode(RED, config, this);
    }
    RED.nodes.registerType("xiaomi-magnet", XiaomiMagnetNode);
};
