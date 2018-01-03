module.exports = (RED) => {
    function XiaomiAllNode(config) {
        RED.nodes.createNode(this, config);
        this.gateway = RED.nodes.getNode(config.gateway);

        if (this.gateway) {
            this.on('input', (msg) => {
                msg.payload = this.gateway.deviceList;
                this.send(msg);
            });
        }
    }

    RED.nodes.registerType("xiaomi-all", XiaomiAllNode);
}
