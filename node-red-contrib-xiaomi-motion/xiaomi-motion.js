const miDevicesUtils = require('../src/utils');

module.exports = (RED) => {
    // motion
    function XiaomiMotionNode(config) {
        miDevicesUtils.defaultNode(RED, config, this);
    }
    RED.nodes.registerType("xiaomi-motion", XiaomiMotionNode);
};
