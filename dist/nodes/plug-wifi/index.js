"use strict";
const constants_1 = require("../constants");
const miio = require("miio");
module.exports = (RED) => {
    var connectionState = "timeout";
    var retryTimer;
    var delayedStatusMsgTimer;
    function XiaomiPlugWifiNode(config) {
        RED.nodes.createNode(this, config);
        this.ip = config.ip;
        this.plug = null;
        this.status({ fill: "yellow", shape: "dot", text: "connecting" });
        miio.device({ address: this.ip })
            .then((plug) => {
            this.plug = plug;
            this.status({ fill: "green", shape: "dot", text: "connected" });
            connectionState = "connected";
            delayedStatusMsgUpdate();
            this.plug.on('propertyChanged', (e) => {
                if (e.property === "power") {
                    if (e.value['0']) {
                        setState("on");
                    }
                    else {
                        setState("off");
                    }
                }
            });
            watchdog();
        })
            .catch((error) => {
            connectionState = "reconnecting";
            watchdog();
        });
        this.on('input', (msg) => {
            var payload = msg.payload;
            if (connectionState === "connected") {
                if (payload == 'on') {
                    this.plug.setPower(true);
                }
                if (payload == 'off') {
                    this.plug.setPower(false);
                }
            }
        });
        this.on('close', (done) => {
            if (retryTimer) {
                clearTimeout(retryTimer);
            }
            if (delayedStatusMsgTimer) {
                clearTimeout(delayedStatusMsgTimer);
            }
            if (this.plug) {
                this.plug.destroy();
            }
            done();
        });
        var setState = (state) => {
            if (this.plug) {
                let status = {
                    payload: {
                        id: this.plug.id,
                        type: this.plug.type,
                        model: this.plug.model,
                        capabilities: this.plug.capabilities,
                        address: this.plug.address,
                        port: this.plug.port,
                        power: this.plug.power(),
                        state: state
                    }
                };
                this.send(status);
            }
        };
        var delayedStatusMsgUpdate = () => {
            delayedStatusMsgTimer = setTimeout(() => {
                if (this.plug.power()['0']) {
                    setState("on");
                }
                else {
                    setState("off");
                }
            }, 1500);
        };
        var discoverDevice = () => {
            miio.device({ address: this.ip })
                .then((plug) => {
                if (this.plug == null) {
                    this.plug = plug;
                    this.plug.on('propertyChanged', (e) => {
                        if (e.property === "power") {
                            if (e.value['0']) {
                                setState("on");
                            }
                            else {
                                setState("off");
                            }
                        }
                    });
                }
                if (connectionState === "reconnecting") {
                    this.status({ fill: "green", shape: "dot", text: "connected" });
                    connectionState = "connected";
                    delayedStatusMsgUpdate();
                }
            })
                .catch((error) => {
                connectionState = "reconnecting";
                if (this.plug) {
                    this.plug.destroy();
                    this.plug = null;
                }
            });
        };
        var watchdog = () => {
            var node = this;
            function retryTimer() {
                discoverDevice();
                if (connectionState === "reconnecting") {
                    node.status({ fill: "red", shape: "dot", text: "reconnecting" });
                }
                setTimeout(retryTimer, 30000);
            }
            setTimeout(retryTimer, 30000);
        };
    }
    process.on('unhandledRejection', function (reason, p) {
        // console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
        var message = reason + "";
        if (message.indexOf("Call to device timed out") >= 0) {
            if (this.plug) {
                console.log("Issue with miio package; discard plug and reconnect.");
                this.plug.destroy();
                this.plug = null;
            }
        }
    });
    RED.nodes.registerType(`${constants_1.Constants.NODES_PREFIX}-wifi-plug`, XiaomiPlugWifiNode);
};
