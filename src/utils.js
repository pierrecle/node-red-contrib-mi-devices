var crypto = require("crypto");
var iv = Buffer.from([0x17, 0x99, 0x6d, 0x09, 0x3d, 0x28, 0xdd, 0xb3, 0xba, 0x69, 0x5a, 0x2e, 0x6f, 0x58, 0x56, 0x2e]);

module.exports = {
    computeBatteryLevel: function(voltage) {
        /*
          When full, CR2032 batteries are between 3 and 3.4V
          http://farnell.com/datasheets/1496885.pdf
        */
        return Math.min(Math.round((voltage - 2200) / 10), 100);
    },
    setStatus: function(node, data) {
        if (data.voltage) {
            var batteryPercent = Math.min(Math.round((data.voltage - 2200) / 14), 100);
            var status = {
                fill: "green", shape: "dot",
                text: "battery - " + batteryPercent + "%"
            };

            if (data.voltage < 2500) {
                status.color = "red";
            } else if (data.voltage < 2900) {
                status.color = "yellow";
            }
            node.status(status);
        }
    },
    prepareFullDataOutput: function(payload) {
        if(payload.data.voltage) {
            payload.data.batteryLevel = this.computeBatteryLevel(payload.data.voltage);
        }
        return payload;
    },
    getGatewayKey: function(password, token) {
        var cipher = crypto.createCipheriv('aes-128-cbc', password, iv);
        var gatewayToken = token;
        var key = cipher.update(gatewayToken, "ascii", "hex");
        cipher.final('hex');

        return key;
    },
    sendWritePayloadToGateway: function(node, msg, data) {
        let gateway = node.gateway;
        if(gateway && gateway.sid && gateway.key && gateway.lastToken) {
            data.sid = data.sid || gateway.sid;
            data.key = this.getGatewayKey(gateway.key, gateway.lastToken);
            msg.payload = {
                cmd: "write",
                data: data
            };
            node.send(msg);
        }
    },
    prepareForGatewayRequest: function(node, msg) {
        msg.sid = node.sid;
        msg.gateway = node.gateway;
    },
    computeColorValue: function (brightness, red, green, blue) {
        return Math.round(256*256*256*brightness) + (256*256*red) + (256*green) + blue;
    },
    computeColor: function (rgb) {
        var blue = rgb % 256;
        rgb = Math.max(rgb - blue, 0);

        var green = rgb % (256 * 256);
        rgb = Math.max(rgb - green, 0);
        green /= 256;

        var red = rgb % (256 * 256 * 256);
        rgb = Math.max(rgb - red, 0);
        red /= 256 * 256;

        var brightness = rgb / (256*256*256);

        return {
            brightness: brightness,
            color: { red: red, green: green, blue: blue }
        };
    },
    defaultNode: function(RED, config, node) {
        RED.nodes.createNode(node, config);
        node.gateway = RED.nodes.getNode(config.gateway);
        node.sid = config.sid;

        node.status({fill:"grey", shape:"ring", text:"battery - na"});

        if (node.gateway) {
            node.on('input', (msg) => {
                let payload = msg.payload;

                // Input from gateway
                if (payload.sid) {
                    if (payload.sid == node.sid) {
                        this.setStatus(node, payload.data);
                        node.send([msg]);
                    }
                }
                // Prepare for request
                else {
                    this.prepareForGatewayRequest(node, msg);
                    node.send(msg);
                }
            });
        }
    }
}
