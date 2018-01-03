const crypto = require("crypto");

module.exports = (RED) => {
    function XiaomiPlugNode(config) {
        RED.nodes.createNode(this, config);
        this.gateway = RED.nodes.getNode(config.gateway);
        this.sid = config.sid;
        this.key = this.gateway.key;

        var currentToken = "";
        var state = "";

        this.status({fill:"yellow", shape:"ring", text:"waiting for key"});

        if (this.gateway && this.key != "") {
            this.on('input', (msg) => {
                var payload = msg.payload;

                if (payload.cmd == "heartbeat" && payload.model == "gateway") {
                    var token = payload.token;

                    if (token) {
                        var cipher = crypto.createCipheriv('aes128', node.key, (new Buffer("17996d093d28ddb3ba695a2e6f58562e", "hex")));
                        var encoded_string = cipher.update(token, 'utf8', 'hex');

                        encoded_string += cipher.final('hex');
                        currentToken = encoded_string.substring(0,32);
                        if (state == "") {
                            node.status({fill:"yellow", shape:"dot", text:"unknown state"});
                        }
                    }
                }
                if (payload == 'on') {
                    var cmd =
                        {   "cmd":"write",
                            "sid": node.sid,
                            "model": "plug",
                            "data": JSON.stringify({"status":"on", "key": currentToken })
                        }
                    msg.payload = JSON.stringify(cmd);
                    node.send([[],[msg]]);

                } else if (payload == "off") {
                    var cmd =
                        {   "cmd":"write",
                            "sid": node.sid,
                            "model": "plug",
                            "data": JSON.stringify({"status":"off", "key": currentToken })
                        }
                    msg.payload = JSON.stringify(cmd);
                    node.send([[],[msg]]);

                } else if (payload.sid == node.sid && payload.model == "plug") {
                    var data = JSON.parse(payload.data)

                    if (currentToken == "") {
                        node.status({fill:"yellow", shape:"ring", text:"waiting for key"});
                    } else if (data.status && data.status == "on") {
                        node.status({fill:"green", shape:"dot", text:"on"});
                        state = "on";
                    } else if (data.status && data.status == "off") {
                        node.status({fill:"red", shape:"dot", text:"off"});
                        state = "off";
                    }

                    msg.payload = payload;
                    node.send([msg]);
                }
            });
        } else if (this.key == "") {
            node.status({fill:"red", shape:"dot", text:"no key configured"});
        }

    }

    RED.nodes.registerType("xiaomi-plug", XiaomiPlugNode);

}
