module.exports = (RED) => {
    function XiaomiConfiguratorNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.deviceList = n.deviceList || [];
        this.key = n.key;
        this.ip = n.ip;
        this.sid = this.sid || n.sid;

        var node = this;
    }

    RED.nodes.registerType("xiaomi-configurator", XiaomiConfiguratorNode);
}
