var procic = undefined;
function initCircleProgress() {
    var canvas = document.getElementById("rtempnum");
    var context = canvas.getContext('2d');
    var self = $(canvas),
        value = 0,//Number(value),// 当前百分比,数值
        average = 10,// 平均百分比
        color = "#27b5ff",// 进度条、文字样式
        maxpercent = 200,//最大百分比，可设置
        c_width = self.width(),// canvas，宽度
        c_height = self.height();// canvas,高度
    // 判断设置当前显示颜色

    //if (value == maxpercent) {
    //    color = "#29c9ad";
    //} else if (value > average) {
    //    color = "#27b5ff";
    //} else {
    //    color = "#ff6100";
    //}
    var timer = null, n = 0;
    procic = {
        init: function () {
            n = 0;
            if (timer !== null) {
                clearInterval(timer);
                timer = null;
            }
            // 清空画布
            context.clearRect(0, 0, c_width, c_height);
            // 画初始圆
            context.beginPath();
            // 将起始点移到canvas中心
            context.moveTo(c_width / 2, c_height / 2);
            // 绘制一个中心点为（c_width/2, c_height/2），半径为c_height/2，起始点0，终止点为Math.PI * 2的 整圆
            context.arc(c_width / 2, c_height / 2, c_height / 2, 0, Math.PI * 2, false);
            context.closePath();
            context.fillStyle = '#dddddd'; //填充颜色
            context.fill();
            // 绘制内圆
            context.beginPath();
            context.strokeStyle = color;
            context.lineCap = 'square';
            context.closePath();
            context.fill();
            context.lineWidth = 10.0;//绘制内圆的线宽度
        },
        draw: function (cur) {
            // 画内部空白
            context.beginPath();
            context.moveTo(24, 24);
            context.arc(c_width / 2, c_height / 2, c_height / 2 - 10, 0, Math.PI * 2, true);
            context.closePath();
            context.fillStyle = 'rgba(255,255,255,1)';  // 填充内部颜色
            context.fill();
            // 画内圆
            context.beginPath();
            // 绘制一个中心点为（c_width/2, c_height/2），半径为c_height/2-5不与外圆重叠，
            // 起始点-(Math.PI/2)，终止点为((Math.PI*2)*cur)-Math.PI/2的 整圆cur为每一次绘制的距离
            if (cur > 0) {
                context.arc(c_width / 2, c_height / 2, c_height / 2 - 5, -(Math.PI / 2), ((Math.PI * 2) * cur) - Math.PI / 2, false);
                context.stroke();
            }
            //在中间写字
            context.font = "bold 68pt Arial";  // 字体大小，样式
            context.fillStyle = color;  // 颜色
            context.textAlign = 'center';  // 位置
            context.textBaseline = 'middle';
            context.moveTo(c_width / 2, c_height / 2);  // 文字填充位置
            context.fillText(value, c_width / 2, c_height / 2 - 60);
            context.fillText("实时人数", c_width / 2, c_height / 2 + 90);
        },
        loadCanvas: function (val) {
            value = val;
            let nowT = val / maxpercent;

            if (timer === null) {
                timer = setInterval(function () {

                    if (n > nowT) {
                        clearInterval(timer);
                        timer = null;
                        if (n >= 1) procic.draw(1);
                    } else {
                        procic.draw(n);
                        n += 0.01;
                    }
                }, 15);
            }
        },
        drawQk: function (val) {
            value = val;
            let nowT = val / maxpercent;
            procic.draw(nowT);
            n = nowT;
        },
    }
    procic.init();
    procic.loadCanvas(value);


}

function initMqttConfig() {
    let fileMPath = '../../Config/mqtt.json';
    $.getJSON(fileMPath, function (data) {
        mqttConfig.Server = data.Server;
        mqttConfig.Port = data.Port;
        mqttConfig.SSL = data.SSL;
        mqttConfig.UserId = data.UserId;
        mqttConfig.Password = data.Password;
        mqttConfig.Timeout = data.Timeout;
        mqttConfig.rtPs = data.dataKeys[0];
        mqttConfig.rtAlm = data.dataKeys[1];
        mqttConfig.rtAtt = data.dataKeys[2];
        mqttConfig.trackVideo = data.dataKeys[3];
        mqttConfig.wsip = data.wsip;
        mqttConfig.wsport = data.wsport;

        applogic.startReadMes();
        //if (callbackmqtt !== '') {
        //    funcallback(eval(callbackmqtt));
        //}

    });
};

var mqttConfig = {
    Server: '192.168.8.46',
    Port: 61623,
    SSL: false,
    UserId: 'admin',
    Password: 'password',
    Timeout: 3,
    rtPs: 'rpm/sfloc',
    rtAlm: 'rpm/locwarning',
    rtAtt: 'rpm/rtelenaming',
    trackVideo: 'rpm/videotrack',
    wsip: '192.168.8.71',
    wsport: 12510
};

//(function($){ })(jQuery); 
//立即执行函数；相当于先申明一个函数，声明完后直接调用；
//(function ($) {
//    $.fn.fixDiv = function (options) {
//        var defaultVal = {
//            top: 10
//        };
//        var obj = $.extend(defaultVal, options);
//        $this = this;
//        var _top = $this.offset().top;
//        var _left = $this.offset().left;
//        $(window).scroll(function () {
//            var _currentTop = $this.offset().top;
//            var _scrollTop = $(document).scrollTop();
//            if (_scrollTop > _top) {
//                $this.offset({
//                    top: _scrollTop + obj.top,
//                    left: _left
//                });
//            } else {
//                $this.offset({
//                    top: _top,
//                    left: _left
//                });
//            }
//        });
//        return $this;
//    };
//})(jQuery);