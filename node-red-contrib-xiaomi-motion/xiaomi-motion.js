const miDevicesUtils = require('../src/utils');

module.exports = (RED) => {
    function XiaomiMotionNode(config) {
        miDevicesUtils.defaultNode(RED, config, this);
    }
    RED.nodes.registerType("xiaomi-motion", XiaomiMotionNode);
};
