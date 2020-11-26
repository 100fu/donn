
var videoInfo = [];
// mapview.loadData()
mapview = {
    loadData() {
        callbackmqtt = 'mapview.initMqtt';
        ///初始化mqtt
        mapview.initMqttConfig();
        //加载设备基础信息
        basicdata.loadDevTagList(); 
        //加载摄像机基础信息
        mapview.loadvideo();
        //加载基站基础信息
        //加载区域基础信息
     
    },
    loadvideo: function (planMap3D, floor) {
        let urlPath = '/Graphic/GetVideoInfoList';
        videoInfo = {};
        clientMode.post(urlPath, null, function (data) {
            if (data.length > 0) {
                data.forEach((item) => {
                    if (item.Position !== null) {
                        //{
                        //    "coordinates": [12832329.737785626, 3521321.8991833637],
                        //        "tag": "监控点1",
                        //            "Id": "1121241"
                        //},
                        let strList = item.Position.split(',');
                        let vinfo = { coordinates: [strList[0], strList[1]], tag: item.Name, Id: item.IPAddress };
                        videoInfo[item.IPAddress] = vinfo;
                    }
                });               
            }
        });
    },
    initMqtt() {
        // config: { Server: "192.168.8.46", Port: 8080, User: "admin", Password: "password", Topic: "rpm/warning" },
        mqttService.config.Topic = "rpm/warning";
        mqttService.initMqtt();
    },
    initMqttConfig: function () {
        let fileMPath = '../../Config/mqtt.json';
        $.getJSON(fileMPath, function (data) {
            mqttService.config.Server = data.Server;
            mqttService.config.Port = data.Port;
            mqttService.config.SSL = data.SSL;
            mqttService.config.User = data.UserId;
            mqttService.config.Password = data.Password;
            mqttService.config.Timeout = data.Timeout;
            //mqttConfig.rtPs = data.dataKeys[0];
            //mqttConfig.rtAlm = data.dataKeys[1];
            //mqttConfig.rtAtt = data.dataKeys[2];
            //mqttConfig.trackVideo = data.dataKeys[3];
            //mqttConfig.wsip = data.wsip;
            //mqttConfig.wsport = data.wsport;


            if (callbackmqtt !== '') {
                funcallback(eval(callbackmqtt));
            }

        });
    },

};