module.exports = function(RED) { //S5
    function XiaomiMonitorNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.status({fill:"blue",shape:"dot",text:"search"});
        var numLostDevices=0;
        var devicesList = RED.nodes.getNode(config.gateway).deviceList;
        var excludedSids = config.excludedSids;
        for (i=0;i<excludedSids.length;i++){
            devicesList = devicesList.filter( el => el.sid != excludedSids[i]);
        }
        const xiaomiDevice = (model, desc) => {
            
            var timerhb;
            var lostdevice=false;
            function stoptimerhb(){
                clearInterval(timerhb);
            }
            function starttimerhb() {
                if (timerhb) clearInterval(timerhb);
                numLostDevices--;
                self.missedheartbeat=0;
                timerhb=setInterval(function(){
                    if (self.missedheartbeat>1){
                        numLostDevices++;
                        node.send("Holis");
                    }
                    self.missedheartbeat++;
                },self.timeout*1000);
            }
            function updatedata(data){
                for (prop in data){
                    if(self.data.hasOwnProperty(prop)){
                        if(self.data[prop].hasOwnProperty('value')){
                            self.data[prop].value=data[prop];
                            self.data[prop].lastupdate=Date.now();
                        } else
                            self.data[prop]=data[prop];
                    }
                }
            }
            var self = {
                model:model,
                desc:desc,
                shortid:"",
                timeout:10,
                missedheartbeat:0,
                starttimerhb,
                stoptimerhb,
                updatedata
            }

            switch(model) {
                case "gateway":
                    self.timeout = 12;
                    break;
                case "sensor_ht":
                    self.data={
                        batteryLevel:0,
                        temperature : {value:0,lastupdate:0},
                        humidity : {value:0,lastupdate:0}
                    };                      
                    break;
                case "sensor_motion.aq2":
                    self.data={
                        batteryLevel:0,
                        status : {value:'',lastupdate:0},
                        lux: {value:'',lastupdate:0}
                    };
                    break;
                case "switch":
                case "motion": 
                case "magnet":
                    self.data={
                        batteryLevel:0,
                        status : {value:'',lastupdate:0}
                    };
                    break;
            }
            starttimerhb();
            return self;
        }

        var device = {};
        for(i=0;i<devicesList.length;i++){
            device[devicesList[i].sid]= xiaomiDevice(devicesList[i].model,devicesList[i].desc);
        }
        
    
        node.on('input', function(msg) {
            var cmd = msg.payload.cmd;
            var data = msg.payload.data;
            var sid = msg.payload.sid;
            if(device.hasOwnProperty(sid)){
                if(cmd=="heartbeat"){
                    device[sid].starttimerhb();
                    msg.payload = "Heartbeat:"+ device[sid].desc;
                    node.send(msg);
                } 
                if(cmd=="report" || cmd=="read_ack"){
                    device[sid].updatedata(data);
                    msg.payload = "report:"+device[sid].desc;
                    node.send(msg);
                }
            }
            if(msg.topic=="request"){
                msg.payload = test;
                node.send(msg);   
            }
        });

        node.on('close', function() {
            for(sid in device){
                device[sid].stoptimerhb();
            }
        });
    }
    RED.nodes.registerType("xiaomi-monitor", XiaomiMonitorNode);
}
