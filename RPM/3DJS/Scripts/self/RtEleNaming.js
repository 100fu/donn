var series = [], categories = [], Arrived = [], NotReached = [], showMes = [], TagList = [];
var deptInfo = {}, empInfo = {};
rtAtt = {
    initMqttConfig: function () {

        let fileMPath = '../../Config/mqtt.json';
        $.getJSON(fileMPath, function (data) {
            rtAtt.loadMqtt(data);          
        });
    },
    loadMqtt: function (mqttConfig) {
        //var host = '192.168.8.46'; //'mqtt.dev.portsys.cn';//$("#connect_host").val();
        //var port = '61623';//$("#connect_port").val();
        //var clientId = new Date().getTime().toString(); //$("#connect_clientId").val();
        //var user = 'admin'; // $("#connect_user").val();
        //var password = 'password';// $("#connect_password").val();
        let host = mqttConfig.Server;// 'mqtt.dev.portsys.cn';//$("#connect_host").val();
        let port = mqttConfig.Port;//$("#connect_port").val();
        let clientId = new Date().getTime().toString(); //$("#connect_clientId").val();
        let user = mqttConfig.UserId; // $("#connect_user").val();
        let password = mqttConfig.Password;// $("#connect_password").val();

        let destination = mqttConfig.dataKeys[2];//'rpm/rtelenaming'; // rpm/sfloc
        let client = new Messaging.Client(host, Number(port), clientId);
        client.onConnect = () => { client.subscribe(destination); }
        client.onMessageArrived = rtAtt.onMessageArrived;
        // client.onConnectionLost = onConnectionLost;

        client.connect({
            userName: user,
            password: password,
            onSuccess: () => { client.subscribe(destination); },
            onFailure: () => { }
        });
    },
    //  rtAtt.loadAtt()
    loadAtt: function () {
        rtAtt.loadDept();
        rtAtt.loadTagList();
        rtAtt.showChart();
        rtAtt.initMqttConfig();

        setInterval(function () {
            rtAtt.showCollMessage();
        }, 4000);
    },

    ///加载部门信息
    loadDept: function () {
        var urlPath = '/Graphic/GetDeptInfo';  // 部分信息查询
        clientMode.post(urlPath, null, function (data) {
            if (data.length > 0) {
                data.forEach(function (item) {
                    deptInfo[item.Id] = item;
                    // console.log(item);
                });
            }
        });
    },
    ///加载人员信息
    //loadEmpInfo: function () {
    //    var urlPath = '/Graphic/GetEmpInfo';  // 部分信息查询
    //    clientMode.post(urlPath, null, function (data) {
    //        if (data.length > 0) {
    //            data.forEach(function (item) {
    //                empInfo[item.Id] = item;
    //            });
    //        }
    //    });
    //},
    loadTagList: function () {
        var urlPath = '/Graphic/GetTagAllInfo';  // 所有人员  GetTagAllInfo
        clientMode.post(urlPath, null, function (data) {
            if (data.length > 0) {
                TagList = [];
                $.each(data, function (i, rtMes) {
                    var deptId = rtMes.EmpInfo != null ? rtMes.EmpInfo.IdDepartment : "";
                    if (rtMes.TName != null && rtMes.TagState == 1) {
                        var tag = { tName: rtMes.TName, tCode: rtMes.TagNo, tagCode: rtMes.TagNo, deptInfo: deptInfo[deptId], useState: rtMes.TagState, empInfo: rtMes.EmpInfo };
                        TagList.push(tag);
                    }
                });
            }
        });
    },

    showCollMessage: function () {
        if (showMes.length > 0) {

            var o = document.getElementById("html");
            var h = o.offsetHeight;
            var h1 = h - 250;

            $('#rtDivlist').html("");
            document.getElementById("rtDivlist").style.height = h1 + "px";
            // var data = JSON.parse(message.payloadString);
            series = [], categories = [], Arrived = [], NotReached = [];

            $.each(showMes, function (i, item) {
                rtAtt.AddDiv(item);
            });

            if (categories.length > 0) {
                var arr = { name: "已到", data: Arrived };
                var noArr = { name: "未到", data: NotReached };
                series.push(arr);
                series.push(noArr);
                // rtAtt.createChart(series, categories);
                rtAtt.refresh(series, categories);
            }
        } else {
            
            layer.msg('暂无任何信息...', { icon: 0, time: 2000 });
            
        }
    },
    showChart: function () {
        var arr = { name: "已到", data: Arrived };
        var noArr = { name: "未到", data: NotReached };
        series.push(arr);
        series.push(noArr);
        rtAtt.createChart(series, categories);
    },

    onMessageArrived: function (message) {
        if (message.payloadString != "") {
            var data = JSON.parse(message.payloadString);
            if (data != null) {
                $.each(data, function (i, item) {
                    var rtAtt = JSON.parse(item);
                    let ishaveTag = false;
                    for (var i = 0, length = showMes.length; i < length; i++) {
                        if (showMes[i].AreaId == rtAtt.AreaId && rtAtt.IsEnd == showMes[i].IsEnd) {
                            showMes[i] = rtAtt;
                            ishaveTag = true;
                        }
                    };
                    if (ishaveTag == false) {
                        showMes.push(rtAtt);
                    }
                });
            }
            // showMes.push(data);
        }
    },
    AddDiv: function (data) {
       
        if (data != null && data.ListTags.length > 0) {
            var option = "";
            option += "<tbody>";
            let Tags = data.ListTags.split(',');
            let tagCount = 0;
            jQuery.each(Tags, function (i, n) {

                let tag = null;
                let tagList = n.split(';');

                $.each(TagList, function (i, n) {
                    if (n.tagCode == tagList[0])
                        tag = n;
                });
                if (tag != null) {
                    tagCount++;
                    let tel = tag.empInfo.Telephone == null ? '' : tag.empInfo.Telephone;
                    if (data.IsEnd == '2') {//未到人员
                        option += "<tr ><td>" + (i + 1) + "</td><td>" + tag.tName + "</td><td>" + tag.tagCode + "</td><td>" + tag.deptInfo.Name + "</td><td>" + tel + "</td><td >" + data.AreaName + "</td><td style='background:rgba(250, 20, 20, 0.6)'>未到</td></tr>";
                    } else {
                        option += "<tr ><td>" + (i + 1) + "</td><td>" + tag.tName + "</td><td>" + tag.tagCode + "</td><td>" + tag.deptInfo.Name + "</td><td>" + tel + "</td><td >" + data.AreaName + "</td><td style='background:rgba(124, 252, 0, 0.6)'>已到</td></tr>";

                    }
                }
            });
            if (data.IsEnd == '2') {
                NotReached.push(tagCount);
                if (categories.indexOf(data.AreaName) == -1) {
                    categories.push(data.AreaName.toString());
                }
            } else {
                Arrived.push(tagCount);
                categories.push(data.AreaName.toString());
                if (data.IsEnd == '0')
                    NotReached.push(0);
            }

            option += "</tbody>";
            var showMes = ' <table class="table table-border table-bordered table-bg " > <thead><tr > <th>序号</th> <th>姓名</th><th>标签号</th><th>部门</th><th>手机号</th><th>区域名称</th><th>状态</th></tr> </thead> '
                + option + '</table>';

            var div = document.createElement('div');
            div.setAttribute('id', new Date().getTime().toString());
            div.style.width = '100%';
            div.style.marginBottom = '10px';  //  margin-bottom: 10px;
            div.innerHTML = showMes;
            $('#rtDivlist').append($(div));
        } else {
            if (data.IsEnd == '2') {
                NotReached.push(0);
                if (categories.indexOf(data.AreaName) == -1) {
                    categories.push(data.AreaName.toString());
                }
            } else {
                Arrived.push(0);
                categories.push(data.AreaName.toString());
                if (data.IsEnd == '0')
                    NotReached.push(0);
            }
        }
    },
    refresh: function (series, categories) {
        var chart = $("#chart").data("kendoChart");      
        chart.setOptions({
            series: series,
            categoryAxis: {
                categories: categories
                //line: 
                //    visible: false
                //},
                //labels: {
                //    padding: { top: 25 }
                //}
            }
        });
    },
    createChart: function () {
        $("#chart").kendoChart({
            title: {
                text: "电子点名区域人员分布图"
            },
            legend: {
                position: "top"
            },
            seriesDefaults: {
                type: "column"
            },
            //series: seriesList,
            series: series,
            valueAxis: {
                labels: {
                    format: "{0}"
                },
                line: {
                    visible: false
                },
                axisCrossingValue: 0
            },
            categoryAxis: {
                //categories: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011],
              //  categories: categoriesList,
                categories: categories,
                line: {
                    visible: false
                },
                labels: {
                    padding: { top: 8,bottom:4 }
                }
            },
            tooltip: {
                visible: true,
                format: "{0}",
                template: "#= series.name #: #= value #"
            }
        });
    },
}


$(function () {
    rtAtt.loadAtt();
    rtAtt.createChart();
    $(document).bind("kendo:skinChange", rtAtt.createChart);
});

