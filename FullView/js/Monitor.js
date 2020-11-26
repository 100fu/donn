
let defaultColor = [
    'rgb(72,156,163)', 'rgb(72,156,163)', 'rgb(72,156,163)', 'rgb(72,156,163)', 'rgb(72,156,163)', '#0282DE', '#FF5858', '#FED701', '#67E0E3', '#FE9B1A'

];
let _onlinelTag = [], _videoData = [];
let mileageParams = { "type": "now", "startTime": "", "endTime": "", "State": 1 };
let durationParams = { "type": "now", "startTime": "", "endTime": "", "State": 1 };
let TagData = { "Device": [], "AllTag": [], "Tag": [] };
let currentType = undefined;
let labelObject = undefined;
var videoData = function () {
    var reponseData = [];
    $.ajax({
        url: "/Graphic/GetVideoInfoList",
        type: "post",
        async: false,
        success: function (data) {
            if (data.Data != null)
                reponseData = _videoData = data.Data;
        }
    });
    return reponseData;
};
var personData = function () {
    $.ajax({
        url: "/Graphic/GetTagAllInfo",
        type: "post",
        async: false,
        success: function (data) {
            TagData.Tag = data.Data;
            $.each(TagData.Tag, function (i, item) {
                item["onLine"] = false;
                if (item.EmpInfo != null) TagData.AllTag.push(item);
                if (item.DevInfo != null) TagData.Device.push(item);
            });
        }
    });
};
var mileageData = function () {
    var reponseData = [];
    $.ajax({
        url: "/Graphic/GetTagAllInfo",
        type: "post",
        async: false,
        data: mileageParams,
        success: function (data) {
            reponseData = data.Data;
        }
    });
    return reponseData;

}
var durationData = function () {
    var reponseData = [];
    $.ajax({
        url: "/Graphic/GetTagAllInfo",
        type: "post",
        async: false,
        data: durationParams,
        success: function (data) {
            reponseData = data.Data;
        }
    });
    return reponseData;

}
var baseStation = function (domId) {
    this.percent = 0.0;
    this.target = domId;
    this.myChart = undefined;
    this.option = {
        tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
        },
        series: [{
            name: "基站",
            type: 'gauge',
            radius: '110%',
            splitNumber: 1,
            startAngle: 180,
            endAngle: 0,
            center: ['25%', '63%'],
            data: [{
                value: 100,
                name: '基站'
            }],
            title: {
                fontSize: 14,
                color: "rgb(93,115,171)",
                offsetCenter: [0, '50%'],
            },
            detail: {
                fontSize: 20,
                color: '#fff',
                padding: [-30, 0, 0, 0],
                formatter: function (value) {
                    return "20/20"
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    width: 10,
                    color: [
                        [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0.1,
                            color: "rgb(4,120,203)"
                        },
                        {
                            offset: 0.6,
                            color: "rgb(51,164,203)"
                        },
                        {
                            offset: 1,
                            color: "rgb(89,200,203)"
                        }
                        ])]
                    ]

                }
            }, pointer: {
                width: 4
            },
            axisTick: {            // 坐标轴小标记
                show: false
            },
            splitLine: {           // 分隔线
                show: false
            },
            axisLabel: {
                color: '#fff',
                fontSize: 12,
                formatter: function (e) {
                    switch (e + "") {
                        case "0":
                            return "无信号";
                        case "100":
                            return "优良";
                    }
                },
                padding: [0, -10, -10, -10]
            }

        }, {
            type: 'gauge',
            name: "摄像头",
            radius: '110%',
            startAngle: 180,
            endAngle: 0,
            splitNumber: 1,
            min: 0,
            max: 100,
            center: ['75%', '63%'],
            data: [{
                value:0,
                name: "摄像头"
            }],
            title: {
                fontSize: 14,
                color: "rgb(93,115,171)",
                offsetCenter: [0, '50%'],
            },
            detail: {
                fontSize: 20,
                color: '#fff',
                padding: [-30, 0, 0, 0],
                formatter: function (value) {
                    return value + "/" + value
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    width: 10,
                    color: [
                        [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0.1,
                            color: "rgb(228,149,5)"
                        },
                        {
                            offset: 0.6,
                            color: "rgb(230,192,63)"
                        },
                        {
                            offset: 1,
                            color: "rgb(231,209,85)"
                        }
                        ])]
                    ]

                }
            }, pointer: {
                width: 4
            },
            axisTick: {            // 坐标轴小标记
                show: false
            },
            splitLine: {           // 分隔线
                show: false
            },
            axisLabel: {
                color: '#fff',
                fontSize: 12,
                formatter: function (e) {
                    switch (e + "") {
                        case "0":
                            return "离线";
                        case "100":
                            return "在线";
                    }
                },
                padding: [0, -10, -10, -10]
            }
        }]
    };
    this.init = function () {
        this.myChart = echarts.init(this.target);
        this.getoption();
        var _this = this;
        this.myChart.on("click", function (params) {
            if (params.seriesName === "基站") {
                $("#dialogbg").show();
                $("#baseStationContent").show();
            }
            else if (params.seriesName === "摄像头") {
                $("#dialogbg").show();
                $("#cameraContent").show();
                $("#cameraDetail").find("tbody").empty();
                $.each(_videoData, function (i, item) {
                    let html = ' <tr><td>' + (i + 1) + '</td><td style="color:rgb(14, 252, 255)">' + item.Name + '</td> </tr>';
                    $("#cameraDetail").find("tbody").append(html);
                })
            }
        });

        setInterval(function () { _this.getoption(); }, 1000 * 5);
    }
    this.getoption = function () {
        this.option.series[0].data[0].value = 100;
        var _videoData = videoData();
        var random = (Math.random() * 10).toFixed(0);
        var per = 0;
        this.option.series[1].data[0].value = 0;
        this.option.series[1].detail.formatter = "0/1";
        this.myChart.setOption(this.option, true);
    }
}
var label = function (domId) {
    this.count = 0.0;
    this.target = domId;
    this.myChart = undefined;
    this.defaultConfig = {
        pointer: {
            show: false
        },
        axisTick: {
            show: false
        },
        splitLine: {
            show: false
        },
        axisLabel: {
            show: false
        },
        title: {
            show: true,
            fontSize: 14,
            color: '#fff'
        },
        type: 'gauge',
        startAngle: 0,
        splitNumber: 10,
        endAngle: -270,
        detail: {
            fontSize: 14
        }
    };
    this.option = {
        tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
        },
        series: [
            $.extend(true, {
                radius: '95%',
                center: ['25%', '50%'],
                data: [{
                    value: 0,
                    name: '离线人员'
                }],
                title: {
                    offsetCenter: ['-10%', '-20%'],
                },
                detail: {
                    fontSize: 14,
                    color: "rgb(10,221,226)",
                    offsetCenter: ['45%', '-20%']
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 7,
                        color: [
                            [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0.1,
                                color: "rgb(14,184,188)"
                            },
                            {
                                offset: 0.6,
                                color: "rgb(25,150,188)"
                            },
                            {
                                offset: 1,
                                color: "#0B95FF"
                            }
                            ])]
                        ]

                    }
                }
            }, this.defaultConfig),
            $.extend(true, {
                radius: '75%',
                center: ['25%', '50%'],
                data: [{
                    value: 0,
                    name: '在线人员'
                }],
                title: {
                    offsetCenter: ['-13%', '10%'],
                },
                detail: {
                    color: "#FFC600",
                    offsetCenter: ['55%', '10%']
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 7,
                        color: [
                            [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0.1,
                                color: "#FFC600"
                            },
                            {
                                offset: 0.6,
                                color: "rgb(230,199,71)"
                            },
                            {
                                offset: 1,
                                color: "rgb(231,199,72)"
                            }
                            ])]
                        ]

                    }
                }
            }, this.defaultConfig),
            $.extend(true, {
                radius: '95%',

                center: ['75%', '50%'],
                data: [{
                    value: 0,
                    name: '离线设备'
                }],
                title: {
                    offsetCenter: ['-10%', '-20%'],
                },
                detail: {
                    fontSize: 14,
                    color: "rgb(10,221,226)",
                    offsetCenter: ['45%', '-20%']
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 7,
                        color: [
                            [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0.1,
                                color: "rgb(14,184,188)"
                            },
                            {
                                offset: 0.6,
                                color: "rgb(25,150,188)"
                            },
                            {
                                offset: 1,
                                color: "#0B95FF"
                            }
                            ])]
                        ]

                    }
                }
            }, this.defaultConfig),
            $.extend(true, {
                radius: '75%',
                center: ['75%', '50%'],
                data: [{
                    value: 0,
                    name: '在线设备'
                }],
                title: {
                    offsetCenter: ['-13%', '10%'],
                },
                detail: {
                    color: "#FFC600",
                    offsetCenter: ['55%', '10%']
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 7,
                        color: [
                            [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0.1,
                                color: "#FFC600"
                            },
                            {
                                offset: 0.6,
                                color: "rgb(229,170,34)"
                            },
                            {
                                offset: 1,
                                color: "rgb(231,199,72)"
                            }
                            ])]
                        ]

                    }
                }
            }, this.defaultConfig)

        ]
    };
    this.init = function () {
        this.myChart = echarts.init(this.target);
        personData();
        this.option.series[0].data[0].value = TagData.AllTag.length;
        this.option.series[2].data[0].value = TagData.Device.length;
        this.myChart.setOption(this.option, true);
        labelObject = this;
        mqttService.initMqtt();
        $("#person").on('click', function (params) {
            $("#dialogbg").show();
            $("#personContent").show();
            $("#personDetail tbody").empty();
            $.each(TagData.Tag, function (i, item) {
                let html = '', status = item.Voltage > 390 ? "高电量" : item.Voltage > 370 && item.Voltage < 391 ? "中电量" : item.Voltage > 345 && item.Voltage < 371 ? "低电量" : "需充电";

                if (item.EmpInfo != null) {
                    html += '<tr><td>' + (i + 1) + '</td><td>' + item.EmpInfo.Name + '</td>';
                    if (item["onLine"]) html += '<td style="color:rgb(14, 252, 255)">在线</td>';
                    else html += '<td style="color:rgba(255,255,255,0.7)">离线</td>';
                    html += '<td>' + status + '</td><td>' + item.EmpInfo.Department.Name + '</td><td>人员</td><td>' + item.Voltage + '</td></tr>';
                }
                if (item.DevInfo != null) {
                    html += '<tr><td>' + (i + 1) + '</td><td>' + item.TName + '</td>';
                    if (item["onLine"]) html += '<td style="color:rgb(14, 252, 255)">在线</td>';
                    else html += '<td style="color:rgba(255,255,255,0.7)">离线</td>';
                    html += '<td>' + status + '</td><td>' + item.DevInfo.Department.Name + '</td><td style="color:#FFD700">设备</td><td>' + item.Voltage + '</td></tr>';
                }
                $("#personDetail").find("tbody").append(html);
            })
        });
    }
}
let duration = function (domId) {
    this.count = 0.0;
    this.target = domId;
    this.myChart = undefined;
    this.option = {
        title: {
            text: '标签编号',
            textStyle: {
                color: "rgb(10,221,226)",
                fontSize: 12
            }
        },
        grid: [{
            top: '10%',
            bottom: '10%',
            right: "40%"
        }],
        xAxis: [{
            name: "小时",
            show: true,
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: "rgba(255,255,255,0.7)"
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['rgba(121,121,121,0.3)', 'rgba(121,121,121,0)']
                }
            },
            nameTextStyle: {
                color: "rgb(10,221,226)",
                fontSize: 12
            }
        }],
        yAxis: [{

            show: true,
            type: 'category',
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: "rgba(255,255,255,0.7)"
                }
            }, axisLabel: {
                fontSize: 10
            }
        }],
        series: [{
            type: "bar",
            barWidth: 10,
            itemStyle: {
                normal: {
                    color: function (params) {
                        return defaultColor[params.dataIndex];
                    }
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: function (p) {
                        return p.data.value;
                    }
                }
            }
        },
        {
            name: '工作时长',
            type: 'pie',
            center: ['82%', '50%'],
            radius: ['40%', '50%'],
            clockwise: false,
            avoidLabelOverlap: false,
            itemStyle: {
                normal: {
                    color: function (params) {
                        return [
                            '#FE9B1A', '#67E0E3', '#FED701', '#FF5858', '#0282DE', 'rgb(72,156,163)'

                        ][params.dataIndex];
                    }
                }
            },
            labelLine: {
                normal: {
                    show: true,
                    length: 12,
                    length2: 12,
                    lineStyle: {
                        width: 1
                    }
                }
            },
            label: {
                normal: {
                    formatter: '{b|{b}}\n{hr|}\n{d|{d}%}',
                    rich: {
                        b: {
                            align: 'left'
                        },
                        hr: {
                            width: '100%',
                            borderWidth: 1,
                            height: 0
                        },
                        c: {
                            align: 'center'
                        },
                        d: {
                            padding: 2
                        }
                    }
                }
            },
            data: []
        }, {
            type: 'pie',
            radius: ['21%', '35%'], // 大小缩放
            center: ['82%', '50%'], // 位置调整
            data: [{
                name: '工作状态',
                label: {
                    normal: {
                        show: true,
                        formatter: '{title|工作状态}',
                        lineHeight: 20,
                        rich: {
                            title: {
                                color: '#fff',
                                fontSize: 16,
                                fontWeight: 'bold'
                            }
                        },
                        position: "center"
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    opacity: 0
                },
                tooltip: {
                    show: false
                }
            }]
        }
        ]
    };
    this.init = function () {
        this.myChart = echarts.init(this.target);
        this.getoption();
        var _this = this;
        $("#tuli1 a").on("click", function () {

            $("#tuli1 a").removeClass("select");
            $(this).addClass("select");
            if ($(this).data("type") === "custom") {
                $("#dialogbg").show();
                $("#customContent").show();
                currentType = "duration";
            }
            else durationParams.type = $(this).data("type");
            _this.getoption();
        });
        setInterval(function () {
            _this.getoption();
        }, 1000 * 10);
    };
    this.getoption = function () {
        var _data = [];
        $.ajax({
            url: "/ThreeModel/GetHisOnLine",
            type: "post",
            async: false,
            data: durationParams,
            success: function (data) {
                if (data.Data != null) {
                    data.Data.forEach((val, idx, array) => {
                        _data.push({ 'name': val.Name, 'value': (parseFloat(val.Value) / 3600).toFixed(2) });
                    });
                }
            }
        });
        var pieData = _data.slice(0, 5);
        let sum = 0;
        if (_data.length > 5) {
            var pieData1 = _data.slice(5, 10);
            pieData1.forEach((val, idx, array) => {
                sum += parseFloat(val.value);
            });
            pieData.push({ 'name': "其他", 'value': sum });
        }
        if (_data.length !== 10) {
            let len = 10 - _data.length;
            for (let index = 0; index < len; index++) {
                _data.push({ 'name': "缺省值" + (index + 1), 'value': 0.00 });
            }
        }
        //利用js中的sort方法
        var _items = { "barData": _data.reverse(), "pieData": pieData };
        this.option.dataset = {
            source: _items.barData
        };
        this.option.series[1].data = _items.pieData;
        this.myChart.setOption(this.option, true);
    }
}
let mileage = function (domId) {
    this.count = 0.0;
    this.target = domId;
    this.myChart = undefined;
    this.option = {
        title: {
            text: '运行里程数（km）',
            textStyle: {
                color: "rgb(10,221,226)",
                fontSize: 12
            }
        },
        grid: [{
            top: '15%',
            bottom: '10%',
            left: "5%",
            right: "12%"
        }],
        xAxis: [
            {
                name: "标签编号",
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    fontSize: 9
                },
                axisLine: {
                    lineStyle: {
                        color: "rgba(255,255,255,0.7)"
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['rgba(121,121,121,0.3)', 'rgba(121,121,121,0)']
                    }
                },
                data: [], nameTextStyle: {
                    color: "rgb(10,221,226)",
                    fontSize: 12
                }
            }],
        yAxis: [
            {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: "rgba(255,255,255,0.7)"
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['rgba(121,121,121,0.3)', 'rgba(121,121,121,0)']
                    }
                }
            }],
        series: [{
            type: "bar",
            barWidth: 20,
            itemStyle: {
                normal: {
                    color: "rgba(36,155,163,0.7)",
                    label: {
                        show: true
                    }
                }
            },
            label: {
                normal: {
                    position: 'top',
                    formatter: function (p) {
                        return p.value;
                    },
                    color: "#fff"
                }
            },
            data: []
        }]
    };
    this.init = function () {
        this.myChart = echarts.init(this.target);
        this.getoption();
        var _this = this;
        $("#tuli2 a").on("click", function () {
            $("#tuli2 a").removeClass("select");
            $(this).addClass("select");
            if ($(this).data("type") === "custom") {
                $("#dialogbg").show();
                $("#customContent").show();
                currentType = "mileage";
            }
            else {
                mileageParams.type = $(this).data("type");
            }
            _this.getoption();
        });
        setInterval(function () {
            _this.getoption();
        }, 1000 * 10);
    };
    this.getoption = function () {
        var _data = [];
        $.ajax({
            url: "/ThreeModel/GetHisOnDis",
            type: "post",
            async: false,
            data: mileageParams,
            success: function (data) {
                if (data.Data === null || data.Data.length === 0)
                    _data.push({ 'name': "缺省值", 'value': 0 });
                else {
                    data.Data.forEach((val, idx, array) => {
                        _data.push({ 'name': val.Name, 'value': (parseFloat(val.Value) / 1000).toFixed(2) });
                    });
                }
            }
        });
        this.option.series[0].data = _data.map(function (ele) {
            return ele.value
        });
        this.option.xAxis[0].data = _data.map(function (ele) {
            return ele.name
        });
        this.myChart.setOption(this.option, true);
    }
}
let mqttService = {

    initMqtt: function () {
        var config = { Server: "127.0.0.1", Port: 1234, User: "admin", Password: "password", Topic: "rpm/offtags" };
        $.ajax({
            url: "../Config/mqtt.json", //json文件位置
            type: "GET", //请求方式为get
            dataType: "json", //返回数据格式为json
            async: false,
            success: function (data) { //请求成功完成后要执行的方法 
                config.Server = data.Server;
                config.Port = data.Port;
                config.Password = data.Password;
                config.User = data.UserId;
            }
        })
        this._this = this;
        let mqttClient = new Messaging.Client(config.Server, Number(config.Port), new Date().getTime().toString());
        mqttClient.onConnect = () => {
            mqttClient.subscribe(config.Topic);
        };
        mqttClient.onMessageArrived = this.onRtMessage;
        mqttClient.onConnectionLost = this.onConnectionLost;
        mqttClient.connect({
            userName: config.User,
            password: config.Password,
            onSuccess: () => {
                console.log('mqtt connected successFull.');
                mqttClient.subscribe(config.Topic);
            },
            onFailure: () => {
                console.log('mqtt failure  onFailure');
            }
        });
    },
    onConnectionLost: function () {
        console.log('mqtt failure!! reStart!!');
        this.initMqtt();
    },
    onRtMessage: function (event) {
        let rtEmpMsg = event.payloadString;
        let eventitem = JSON.parse(rtEmpMsg);
        let maxOff = 0, maxCount = 0;
        $.each(TagData.Tag, function (i, item) {
            if (item.EmpInfo != null) {
                maxCount++;
                item["onLine"] = true;
                if ($.inArray(item.TagNo, eventitem) > -1) {
                    item["onLine"] = false;
                }
                else maxOff++;
            }
        });
        let maxOn = maxCount - maxOff;
        labelObject.option.series[0].endAngle = 0 - 270 * ((maxCount - maxOff) / maxCount);
        labelObject.option.series[1].endAngle = 0 - 270 * ((maxCount - maxOn) / maxCount);
        labelObject.option.series[0].data[0].value = maxOn;
        labelObject.option.series[1].data[0].value = maxOff;
        maxOff = 0, maxCount = 0;
        $.each(TagData.Tag, function (i, item) {
            if (item.DevInfo != null) {
                maxCount++;
                item["onLine"] = true;
                if ($.inArray(item.TagNo, eventitem) > -1) {
                    item["onLine"] = false;
                }
                else maxOff++;
            }
        });
        maxOn = maxCount - maxOff;
        labelObject.option.series[2].endAngle = 0 - 270 * ((maxCount - maxOff) / maxCount);
        labelObject.option.series[3].endAngle = 0 - 270 * ((maxCount - maxOn) / maxCount);
        labelObject.option.series[2].data[0].value = maxOn;
        labelObject.option.series[3].data[0].value = maxOff;
        labelObject.myChart.setOption(labelObject.option, true);
    }
}