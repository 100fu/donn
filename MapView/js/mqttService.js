let mqttService = {
    config: { Server: "192.168.8.46", Port: 8080, User: "admin", Password: "password", Topic: "rpm/warning" },
    initMqtt: function () {
        let host = this.config.Server; 
        let port = this.config.Port; 
        let clientId = new Date().getTime().toString();
        let user = this.config.User; 
        let password = this.config.Password; 


        let destination = this.config.Topic; //mqttConfig.rtPs; // rpm/sfloc
        let mqttClient = new Messaging.Client(host, Number(port), clientId);
        mqttClient.onConnect = () => {
            mqttClient.subscribe(destination);
        };
        mqttClient.onMessageArrived = mqttService.onRtMessage;
        mqttClient.onConnectionLost = mqttService.onConnectionLost;
        mqttClient.connect({
            userName: user,
            password: password,
            onSuccess: () => {
                console.log('mqtt connected successFull.');
                mqttClient.subscribe(destination);
            },
            onFailure: () => {
                console.log('mqtt failure  onFailure');
            }
        });
    },
    onConnectionLost: function () {
        console.log('mqtt failure!! reStart!!');
        mqttService.initMqtt();
    },
    onRtMessage: function (event) {
        let rtEmpMsg = event.payloadString;
        let item = JSON.parse(rtEmpMsg);
        $('<li><span>' + item.warningTime + '[' + item.warningInfo + ']</span><hr /></li>').prependTo(".ulwarning");
    }
};