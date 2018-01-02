module.exports = function(RED) {
    "use strict";
    var miDevicesUtils = require('../utils');

    function XiaomiActionRead(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            if(msg.sid) {
                msg.payload = {
                    cmd: "read",
                    sid: msg.sid
                };
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("xiaomi-actions read", XiaomiActionRead);


    function XiaomiActionGetIdList(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            msg.payload = {
                cmd: "get_id_list"
            };
            node.send(msg);
        });
    }
    RED.nodes.registerType("xiaomi-actions get_id_list", XiaomiActionGetIdList);


    function XiaomiActionSingleClick(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            if(msg.gateway && msg.sid && msg.gateway.key && msg.gateway.lastToken) {
                msg.payload = {
                    cmd: "write",
                    data: {
                        status: "click",
                        sid: msg.sid,
                        key: miDevicesUtils.getGatewayKey(msg.gateway.key, msg.gateway.lastToken)
                    }
                };
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("xiaomi-actions click", XiaomiActionSingleClick);


    function XiaomiActionDoubleClick(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            if(msg.gateway && msg.sid && msg.gateway.key && msg.gateway.lastToken) {
                msg.payload = {
                    cmd: "write",
                    data: {
                        status: "double_click",
                        sid: msg.sid,
                        key: miDevicesUtils.getGatewayKey(msg.gateway.key, msg.gateway.lastToken)
                    }
                };
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("xiaomi-actions double_click", XiaomiActionDoubleClick);




    function XiaomiActionGatewayLight(config) {
        RED.nodes.createNode(this, config);
        this.gateway = RED.nodes.getNode(config.gateway);
        this.color = RED.nodes.getNode(config.color);
        this.brightness = RED.nodes.getNode(config.brightness);
        var node = this;

        node.on('input', function(msg) {
            if(node.gateway && node.gateway.sid && node.gateway.key && node.gateway.lastToken) {
                var color = msg.color || node.color;
                var brightness = msg.brightness || node.brightness;
                var rgb = miDevicesUtils.computeColorValue(brightness, color.red, color.green, color.blue);
                msg.payload = {
                    cmd: "write",
                    data: {
                        rgb: rgb,
                        sid: node.gateway.sid,
                        key: miDevicesUtils.getGatewayKey(node.gateway.key, node.gateway.lastToken)
                    }
                };
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("xiaomi-actions gateway_light", XiaomiActionGatewayLight);




    function XiaomiActionGatewaySound(config) {
        RED.nodes.createNode(this, config);
        this.gateway = RED.nodes.getNode(config.gateway);
        this.mid = config.mid;
        this.volume = config.volume;
        var node = this;

        node.on('input', function(msg) {
            if(node.gateway && node.gateway.sid && node.gateway.key && node.gateway.lastToken) {
                msg.payload = {
                    cmd: "write",
                    data: {
                        mid: parseInt(msg.mid || node.mid),
                        volume: parseInt(msg.volume || node.volume),
                        sid: node.gateway.sid,
                        key: miDevicesUtils.getGatewayKey(node.gateway.key, node.gateway.lastToken)
                    }
                };
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("xiaomi-actions gateway_sound", XiaomiActionGatewaySound);



    function XiaomiActionGatewayStopSound(config) {
        RED.nodes.createNode(this, config);
        this.gateway = RED.nodes.getNode(config.gateway);
        var node = this;

        node.on('input', function(msg) {
            if(node.gateway && node.gateway.sid && node.gateway.key && node.gateway.lastToken) {
                msg.payload = {
                    cmd: "write",
                    data: {
                        mid: 1000,
                        sid: node.gateway.sid,
                        key: miDevicesUtils.getGatewayKey(node.gateway.key, node.gateway.lastToken)
                    }
                };
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("xiaomi-actions gateway_stop_sound", XiaomiActionGatewayStopSound);
}
