var showDeptIds = [], showChkRtEmp = [];
var mqttClient = undefined;
var TagList = [];
var rtLocTags  = {};
var DeptList = {};
var deptTreeControl = {}, selectRtEmpIds = [], rtEmpTags = [], reDevTags = [], isInOut = undefined;

var rtTrackVideo = {};


var mapNew3D = {

    showChkPointDetail: function (id) {
        // HisTaskFunction.loadChkPointDetail(id);
        // HisTaskFunction.loadChkPointDetail(id);
        var par = { taskid: id };
        clientMode.post('/ControlMs/GetCheckPointDetailByTaskId', par, function (data) {
            if (data !== null && data.length > 0) {
                var option = "";
                option += "<tbody>";
                jQuery.each(data, function (i, n) {
                    if (n.OrderAlarmStatus == true && n.TimeAlarmStatus == true) {
                        option += "<tr ><td>" + n.PersonName + "</td><td>" + n.CheckPointName + "</td><td>" + (n.EnterTime == null ? '--' : n.EnterTime) + "</td><td>" + (n.ExitTime == null ? '--' : n.ExitTime) + "</td><td style='background:rgba(250, 20, 20, 0.6)'>" + (n.CheckTimeDesc == null ? '无' : n.CheckTimeDesc) + "</td><td style='background:rgba(250, 20, 20, 0.6)'>" + (n.CheckOrderDesc == null ? '无' : n.CheckOrderDesc) + "</td><td >" + n.AlarmDesc + "</td></tr>";
                    }
                    else if (n.EnterTime == null) {
                        option += "<tr ><td>" + n.PersonName + "</td><td>" + n.CheckPointName + "</td><td>" + (n.EnterTime == null ? '未开始' : n.EnterTime) + "</td><td>" + (n.ExitTime == null ? '' : n.ExitTime) + "</td><td>" + (n.CheckTimeDesc == null ? '无' : n.CheckTimeDesc) + "</td><td>" + (n.CheckOrderDesc == null ? '无' : n.CheckOrderDesc) + "</td><td>" + n.AlarmDesc + "</td></tr>";
                    } else if (n.ExitTime == null) {
                        option += "<tr ><td>" + n.PersonName + "</td><td>" + n.CheckPointName + "</td><td>" + (n.EnterTime == null ? '' : n.EnterTime) + "</td><td>" + (n.ExitTime == null ? '未结束' : n.ExitTime) + "</td><td>" + (n.CheckTimeDesc == null ? '无' : n.CheckTimeDesc) + "</td><td>" + (n.CheckOrderDesc == null ? '无' : n.CheckOrderDesc) + "</td><td>" + n.AlarmDesc + "</td></tr>";

                    } else if (n.OrderAlarmStatus == true && n.TimeAlarmStatus == false) {
                        option += "<tr><td>" + n.PersonName + "</td><td>" + n.CheckPointName + "</td><td>" + (n.EnterTime == null ? '--' : n.EnterTime) + "</td><td>" + (n.ExitTime == null ? '--' : n.ExitTime) + "</td><td style='background:rgba(0, 255, 33,0.6)'>" + (n.CheckTimeDesc == null ? '无' : n.CheckTimeDesc) + "</td><td style='background:rgba(250, 20, 20, 0.6)'>" + (n.CheckOrderDesc == null ? '无' : n.CheckOrderDesc) + "</td><td >" + n.AlarmDesc + "</td></tr>";
                    } else if (n.OrderAlarmStatus == false && n.TimeAlarmStatus == true) {
                        option += "<tr><td>" + n.PersonName + "</td><td>" + n.CheckPointName + "</td><td>" + (n.EnterTime == null ? '--' : n.EnterTime) + "</td><td>" + (n.ExitTime == null ? '--' : n.ExitTime) + "</td><td style='background:rgba(250, 20, 20, 0.6)'>" + (n.CheckTimeDesc == null ? '无' : n.CheckTimeDesc) + "</td><td style='background:rgba(0, 255, 33,0.6)'>" + (n.CheckOrderDesc == null ? '无' : n.CheckOrderDesc) + "</td><td >" + n.AlarmDesc + "</td></tr>";
                    } else if (n.OrderAlarmStatus == false && n.TimeAlarmStatus == false) {
                        option += "<tr><td>" + n.PersonName + "</td><td>" + n.CheckPointName + "</td><td>" + (n.EnterTime == null ? '--' : n.EnterTime) + "</td><td>" + (n.ExitTime == null ? '--' : n.ExitTime) + "</td><td style='background:rgba(0, 255, 33,0.6)'>" + (n.CheckTimeDesc == null ? '无' : n.CheckTimeDesc) + "</td><td style='background:rgba(0, 255, 33,0.6)'>" + (n.CheckOrderDesc == null ? '无' : n.CheckOrderDesc) + "</td><td >" + n.AlarmDesc + "</td></tr>";
                    } else {
                        option += "<tr><td>" + n.PersonName + "</td><td>" + n.CheckPointName + "</td><td>" + (n.EnterTime == null ? '' : n.EnterTime) + "</td><td>" + (n.ExitTime == null ? '' : n.ExitTime) + "</td><td>" + (n.CheckTimeDesc == null ? '无' : n.CheckTimeDesc) + "</td><td>" + (n.CheckOrderDesc == null ? '无' : n.CheckOrderDesc) + "</td><td>" + n.AlarmDesc + "</td></tr>";
                    }
                })
                option += "</tbody></table>";
                showDetailLists = "";
                showDetailLists = option;
                BDZFunction.loadChkPointMessage(data[0].TaskName);
            } else { layer.msg('没有可显示的信息!', { icon: 0, time: 2000 }); }
        }, true, function (err) { });
    },
    showEditAlarm: function (tagNo) {
        layer.msg('完成对' + tagNo + '号标签的操作.', { icon: 0, time: 2000 });
    },


    showMessage: function (data) {

        //var dsf = "<tbody><tr ><td>1</td><td>江小白</td><td>020-111-222-098</td><td style='background:rgba(250, 20, 20, 0.6)'>电子围栏报警</td><td >1号电子围栏</td><td style='background:rgba(250, 20, 20, 0.6)'>2018-03-29 13:00:00</td><td class='f-14 td-manage'><a style='text-decoration:none' onclick=mapNew3D.showEditAlarm('020-111-222-098') title='编辑' ><i class='Hui-iconfont icoButton'>&#xe6df;</i></a>  </td></tr>";
        if (data !== null && data.length > 0) {
            var option = "";
            option += "<tbody>";
            jQuery.each(data, function (i, n) {
                option += "<tr ><td>" + n.id + "</td><td>" + n.tName + "</td><td>" + n.tagNo + "</td><td style='background:rgba(250, 20, 20, 0.6)'>" + n.regType + "</td><td >" + n.regName + "</td><td style='background:rgba(250, 20, 20, 0.6)'>" + n.regStart + "</td></tr>";
            })
            option += "</tbody></table>";

            var showMes = '<div class="cl pd-5 " id="chkList">    <table id="chktMode" class="table table-border table-bordered table-bg "> <thead><tr class="text-c"> <th>序号</th> <th>姓名</th><th>标签号</th><th>报警类型</th><th>报警信息</th><th>开始时间</th> </tr>'
                + option + '</thead>   <tbody></tbody> </table></div>';

            mapNew3D.showLayerMsg(showMes);
        } else {
            isOpen = false;
            layer.msg('没有可显示的信息!', { icon: 0, time: 2000 });
        }
    },
    showLayerMsg: function (showMes) {

        //clientMode.getfile('/FromEdit/Configure/showMessage.html', function (data) {
        //    $("#chktMode").append(showDetailLists);
        //    var mes = $("#chktMode").html;
        //});

        layer.open({
            type: 1,
            shade: false,
            id: 'almlayer', //设定一个id，防止重复弹出
            area: ['600px', '360px'],
            title: '报警信息', //不显示标题
            content: showMes,
            end: function () {
                //location.reload();
                isOpen = false;
            }

        });
    },

    loadChkPointMessage: function (obj) {
        clientMode.getfile('/FromEdit/Configure/showMessage.html', function (data) {
            jQuery("#formShowDialog").empty().html(data);
            $("#chktMode").append(obj);
            jQuery("#formShowDialog").dialog({
                title: "报警信息",
                modal: true,
                fit: true,
                autoOpen: true,
                width: 740,
                height: 350,
                position: ['center', 50],
                close: function (event, ui) {
                    $("#formShowDialog").dialog("destroy");
                    $("#formShowDialog").html("");
                }
            });
        });
    },

    /**********************从地图上移除基站对象***********************************************************************/

    /******************实时信息查询*Start******************************************************/


    addRtMapEmp(emp) {
        // var emp = { tName: item.EmpInfo.Name, tCode: item.EmpInfo.Code, tagCode: item.TagNo, position: new Point3D_CM(item.RtPoint), PrePoint: new Point3D_CM(item.PrePoint), icon: fileParam.empIcon + 'emp_4.png' };
        let isHave = sys.newmap3D.IsExistEmpObj3D(emp);
        //没有就添加
        if (isHave == false) {
            ////存在就修改位置
            //sys.newmap3D.rtPositionEmp(emp);
            //} else {
            ///不存在就添加位置信息
            if (emp.useState == 1) {
                emp.icon = fileParam.empIcon + 'emp_4.png';
              //  sys.baseNew3D.addRtEmpList(emp);
                if (rtEmpTags.indexOf(emp.tagCode) == -1) {
                    rtEmpTags.push(emp.tagCode);   //实时人员标签列表
                }
                //
                let list = document.getElementById('rtemplist_ul');
                let rtEmpA = document.getElementById("rtemp_a");
                if (rtEmpA != undefined) {
                    document.getElementById("rtemp_a").innerText = (list.children.length);
                }
                let lblEmpInfo = document.getElementById("pos");
                if (lblEmpInfo != undefined) {
                    lblEmpInfo.innerText = rtEmpTags.length; //(list.children.length);
                }

            }
            else if (emp.useState == 2) {
                emp.icon = fileParam.devIcon + 'dev_01.png';
            //    sys.baseNew3D.addRtDevList(emp);
                if (reDevTags.indexOf(emp.tagCode) == -1) {
                    reDevTags.push(emp.tagCode); //实时设备标签列表
                }

                let list = document.getElementById('rtdevlist_ul');
                let rtVideoA = document.getElementById("rtvideo_a");
                if (rtVideoA != undefined) {
                    document.getElementById("rtvideo_a").innerText = (list.children.length);
                }

                let lbldevInfo = document.getElementById("device");
                if (lbldevInfo != undefined) {
                    lbldevInfo.innerText = reDevTags.length;  //(list.children.length);
                }

            }

            var empIcon = sys.draw.createRtIcon(emp);
            empIcon.objType = 'emp';
            empIcon.useState = emp.useState; //1-人员，2-车辆
            empIcon.drawcolor = Math.random() * 0xffffff; //随机色
            empIcon.trackList = []; //实时轨迹集合
            empIcon.showName = emp.tName;//人员姓名
            empIcon.showname = emp.tName;//人员姓名
            empIcon.showTrack = false;
            empIcon.name = emp.tagCode;  //人员标签号
            empIcon.deptid = emp.deptid;  //人员部门Id
            //empIcon.RtPoint = new THREE.Vector3(emp.position.X, emp.position.Y, emp.position.Z);
            empIcon.PrePoint = new THREE.Vector3(emp.position.x, emp.position.y, emp.position.z);

            //czlt-20180408 添加到地图plan中
            sys.draw.plan3DAdd(empIcon);

            if (isInOut != undefined) {
                mapNew3D.loadInOutDeptTree(isInOut);
            }
            //czlt-20180408 注销
            //  sys.baseNew3D.addRtEmpList(emp);
        } else {
            sys.newmap3D.changeEmpPosition(emp.tagCode, emp.position);
        }
    },

    addAlmArea: function (areaId, tagNo) {
        //{ id: '1', tName: '江小白', tagNo: '020-111-222-098', regType: '电子围栏报警', regName: '1号电子围栏', regStart: '2018-03-29 13:00:00' }
        var regObj = null;
        if (areaId != "")
            if (obj3DRegs != undefined) {
                $.each(scene3D.children, function (i, obj) {
                    if (obj.name == 'obj3DRegs') {
                        $.each(obj.children, function (n, item) {
                            if (item.name == areaId) {
                                regObj = item;
                            }
                        });
                    }
                });
            }

        let tag = null;
        let tagList = tagNo.split(';');

        $.each(TagList, function (i, n) {
            if (n.tagCode == tagList[0])
                tag = n;
        });
        if (tag == null)
            return;
        //{ tName: rtMes.TName, tCode: rtMes.TagNo, tagCode: rtMes.TagNo, deptid: deptId, useState: rtMes.TagState };

        var regsType = '电子围栏报警';
        var regsName = "";
        var empName = "";
        var rtChkTime = new Date(tagList[1].replace('T', ' ')).Format("yyyy-MM-dd HH:mm:ss")
        if (areaId != "") {
            //区域为空就不显示电子围栏报警
            if (regObj !== null) {
                regsName = regObj.showname;
                if (tag.tName != "") {
                    var almMsg = { id: (almArea.length + 1), tName: tag.tName, tagNo: tag.tagCode, regType: regsType, regName: regsName, regStart: rtChkTime };
                    almArea.push(almMsg);
                }
            }
        } else {
            regsType = '碰撞预警';
            if (tag.tName != "") {
                var almMsg = { id: (almArea.length + 1), tName: tag.tName, tagNo: tag.tagCode, regType: regsType, regName: regsName, regStart: rtChkTime };
                almArea.push(almMsg);
            }
        }
    },
    onConnectionLostWarning: function () {
        console.log('mqtt failure!! reStart!!');
        mapNew3D.rtAreaInfo();
    },
    rtAreaInfo: function () {

        var host = mqttConfig.Server;//  serverIP
        var port = mqttConfig.Port;// serverPort
        var clientId = new Date().getTime().toString(); //id
        var user = mqttConfig.UserId; // userid
        var password = mqttConfig.Password;// password

        let destination = mqttConfig.rtAlm; //key
        let client = new Messaging.Client(host, Number(port), clientId);
        client.onConnect = () => { client.subscribe(destination); }
        client.onMessageArrived = mapNew3D.onMessageArrived;
        client.onConnectionLost = mapNew3D.onConnectionLostWarning;
        client.connect({
            userName: user,
            password: password,
            onSuccess: () => {
                console.log('rpm/locwarning successFull');
                //client.subscribe('rpm/locwarning');
                client.subscribe(destination);
            },
            onFailure: () => { }
        });

    },

    onConnectionLost: function () {
        console.log('mqtt failure!! reStart!!');
        mapNew3D.startReadMes();
    },
    startReadMes: function () {

        var host = mqttConfig.Server;// 'mqtt.dev.portsys.cn';//$("#connect_host").val();
        var port = mqttConfig.Port;//$("#connect_port").val();
        var clientId = new Date().getTime().toString(); //$("#connect_clientId").val();
        var user = mqttConfig.UserId; // $("#connect_user").val();
        var password = mqttConfig.Password;// $("#connect_password").val();


        let destination = mqttConfig.rtPs; // rpm/sfloc 
        let mqttClient = new Messaging.Client(host, Number(port), clientId);
        mqttClient.onConnect = () => { mqttClient.subscribe(destination); };
        mqttClient.onMessageArrived = mapNew3D.onRtMessage;
        mqttClient.onConnectionLost = mapNew3D.onConnectionLost;
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

    //{"UniqueId":"309","Type":null,"X":181.370970194723,"Y":52.6933157313687,"Z":null,"Duration":0.0,"speedX":0.0705099880714933,"speedY":0.0856359911698425,"speed":0.11092872216645909,"dir":null,"dirRadian":null,"CollectTime":"2018-05-22T13:16:44.8382215+08:00","Region":null,"Floor":null,"Name":null,"RelativePosition1":null,"RelativePosition2":null,"RelativePosition3":null}

    onRtMessage: function (event) {
        //rtLocTags
        var rtEmpMsg = '[' + event.payloadString + ']';
        // var rtList = JSON.parse(event.payloadString);
        // console.log(data);
        var rtList = JSON.parse(rtEmpMsg);
        rtList.forEach(function (item) {
            rtLocTags[item.UniqueId] = item;
            // console.log(item);
        })
    },
    onRtMessageShow: function (item) {
        //历史轨迹回放时不更新位置数据
        if (isHisPlay == false) {
            let rtPoint = { x: Number(item.X) + Number(tranX), y: Number(item.Y) + Number(tranY), z: 0 };
            let rtMes = null;
            $.each(TagList, function (i, tag) {
                if (tag.tagCode == item.UniqueId) {
                    rtMes = tag;
                }
            });

            if (rtMes !== null) {
                rtMes.position = rtPoint;
                if (showChkRtEmp.length > 0) {
                    if ($.inArray(rtMes.tagCode, showChkRtEmp) != -1) {
                        mapNew3D.addRtEmpObjOnMap(rtMes);
                    }
                } else {
                    mapNew3D.addRtEmpObjOnMap(rtMes);
                }
            }
        }
    },
    addRtEmpObjOnMap(rtMes) {
        if (rtMes.tName != "") {

            //var state = rtMes.useState == undefined ? 1 : rtMes.useState;
            //var emp = { tName: rtMes.tName, tCode: rtMes.tCode, tagCode: rtMes.tagNo, position: rtMes.position, deptid: rtMes.deptid, useState: state };
            ////sys.newmap3D.changeEmpPosition(rtMes.UniqueId, rtPoint);
            if (rtMes.useState != 0)
                mapNew3D.addRtMapEmp(rtMes);
        }
    },
    onMessageArrived: function (message) {
        if (message.payloadString != "") {
            var data = JSON.parse(message.payloadString);
            almArea = [];
            var almId = [];
            // console.log(data);

            $.each(data, function (i, strItem) {
                let item = JSON.parse(strItem);
                if (item.ListTags == "") {
                    sys.baseNew3D.setAreaAlm(item.AreaId, false);
                } else {
                    if (item.AreaId == "") {
                        if (item.ListTags != "") {
                            let tags = item.ListTags.split(',');
                            $.each(tags, function (n, tag) {
                                mapNew3D.addAlmArea(item.AreaId, tag);

                            });
                        }
                    } else {
                        let tags = item.ListTags.split(',');
                        $.each(tags, function (n, tag) {
                            //if (tag.EmpInfo !== null) {
                            var isHaveA = false;
                            //var isDeptShow = true;
                            ////判断部门是否在显示的队列中
                            //if (showDeptIds.length > 0) {
                            //    if ($.inArray(tag.EmpInfo.IdDepartment, showDeptIds) == -1) {
                            //        isDeptShow = false;
                            //    }
                            //}
                            //if (isDeptShow == true) {
                            mapNew3D.addAlmArea(item.AreaId, tag);
                            $.each(almId, function (i, obj) {
                                if (obj == item.AreaId) {
                                    isHaveA = true;
                                }
                            });
                            if (isHaveA == false) {
                                almId.push(item.AreaId);
                            }
                            //  }
                            // }
                        });
                    }
                }
            });

            if (almId.length > 0) {
                //弹出报警窗体
                sys.baseNew3D.openAlarmPage();

                //设置报警区域
                $.each(almId, function (i, key) {
                    sys.baseNew3D.setAreaAlm(key, true);
                });
            } else {
                if (almArea.length == 0) {
                    let perRtMessage = document.getElementById('alarmDiv');
                    perRtMessage.style.display = 'none';
                    layer.close(layer.index);
                    isOpen = false;
                } else {
                    //没有设置区域的情况下，显示碰撞报警的信息                    
                    sys.baseNew3D.openAlarmPage();
                }
            }


        }

    },
    /******************实时信息查询*End******************************************************/

    //查询历史数据
    searchHisMes: function () {

        //layer.tips('点击历史信息查询', '.tips ', {
        //    tips: [1, '#3595CC'],
        //    time: 4000
        //});

        if (hisTotal > 0) {
            layer.msg('是否结束当前操作，重新查询...', {
                time: 0 //不自动关闭
                , btn: ['是', '否']
                , yes: function (index) {
                    layer.close(index);
                    sys.baseNew3D.clearPlay();
                    mapNew3D.searchPostHisMes();
                }, btn2: function () {
                    layer.close();
                }
            });
        } else {
            mapNew3D.searchPostHisMes();
        }
        //  layer.msg('点击历史信息查询', { time: 1000 });


    },
    searchPostHisMes: function () {
        var hisInfo = mapNew3D.isHisValidity();
        if (hisInfo == "")
            return;
        var urlPath = '/Graphic/GetHisEmpTrack';
        clientMode.post(urlPath, hisInfo, function (data) {
            if (data.length > 0)
                sys.baseNew3D.hisSearchMes(data);
            else {
                layer.msg('没有可播放的信息...', { icon: 5, time: 3000 });
            }
        });
    },
    isHisValidity: function () {
        var selType = $("#selectid").val();
        if (selType == "0") {
            layer.msg('请选择查询方式...', { icon: 5, time: 3000 });
            return "";
        }
        var txtsel = $("#txtsel").val();//txtsel
        if (txtsel == "") {
            var strMes = "";
            if (selType == "1") {
                strMes = "标签号不能为空...";
            } else if (selType == "2") {
                strMes = "名称不能为空...";
            }
            layer.msg(strMes, { icon: 5, time: 3000 });
            return "";
        }
        var begin = $("#logmin").val();
        if (begin == "") {
            layer.msg("开始时间不能为空...", { icon: 5, time: 3000 });
            return "";
        }
        var end = $("#logmax").val();
        if (end == "") {
            layer.msg("结束时间不能为空...", { icon: 5, time: 3000 });
            return ""
        }
        //string iType, string tName,string startTime, string endTime
        var hisInfo = { iType: selType, tName: txtsel, startTime: begin, endTime: end };
        return hisInfo;

    },
    loadRtHisBtn: function () {
        clientMode.getfile('/RPM/3DJS/rtSearch.html', function (data) {
            var div = document.getElementById('localHis');
            div.innerHTML = data;
        });

    },


    /****************************MQTT处理*******************************************/
    loadMqttClient: function () {
        var host = mqttConfig.Server;// 'mqtt.dev.portsys.cn';//$("#connect_host").val();
        var port = mqttConfig.Port;//$("#connect_port").val();
        var clientId = new Date().getTime().toString(); //$("#connect_clientId").val();
        var user = mqttConfig.UserId; // $("#connect_user").val();
        var password = mqttConfig.Password;// $("#connect_password").val();
        //  destination = "rpm/rtlocation"; //'rpm/sfloc';
        mqttClient = new Messaging.Client(host, Number(port), clientId);
        //mqttClient.onConnect = function () {
        //    client.subscribe("rpm/rtlocation");
        //}
        mqttClient.connect({
            userName: user,
            password: password,
            //onSuccess: () => { client.subscribe("rpm/rtlocation"); },
            //onFailure: () => { }
        });
    },

    loadTagList: function () {
        var urlPath = '/Graphic/GetTagAllInfo';  //GetTagAllInfo
        clientMode.post(urlPath, null, function (data) {
            if (data.length > 0) {
                TagList = [];
                $.each(data, function (i, rtMes) {
                    // var empName = tagNew.EmpInfo !== null ? tagNew.EmpInfo.Name : (tagNew.DevInfo !== null ? tagNew.DevInfo.Name : "");
                    // var empCode = tagNew.EmpInfo !== null ? tagNew.EmpInfo.Code : (tagNew.DevInfo !== null ? tagNew.DevInfo.Code : "");
                    let deptId = rtMes.EmpInfo !== null ? rtMes.EmpInfo.IdDepartment : (rtMes.DevInfo !== null ? rtMes.DevInfo.IdDepartment : "");
                    let tel = rtMes.EmpInfo !== null ? rtMes.EmpInfo.Telephone : (rtMes.DevInfo !== null ? rtMes.DevInfo.DriverTel : "");
                    let objNum = rtMes.EmpInfo !== null ? rtMes.EmpInfo.Code : (rtMes.DevInfo !== null ? rtMes.DevInfo.Code : "");
                    let remark = rtMes.EmpInfo !== null ? rtMes.EmpInfo.Description : (rtMes.DevInfo !== null ? rtMes.DevInfo.Description : "");
                    //description
                    if (rtMes.TName !== null) {
                        var tag = { tName: rtMes.TName, tCode: rtMes.TagNo, tagCode: rtMes.TagNo, deptid: deptId, useState: rtMes.TagState, tel: (tel !== null ? tel : ""), objNum: (objNum !== null ? objNum : ""), remark: (remark !== null ? remark:"") };
                        TagList.push(tag);
                    }
                });
            }
        });
    },
    rtLocTagShow: function () {
        setInterval(function () {
            for (var n in rtLocTags) {
                mapNew3D.onRtMessageShow(rtLocTags[n]);
            }
        }, 40);
    },



    /*************************加载树********************************************/
    //loadTestTree: function () {
    //    var butReback = document.createElement('div');
    //    butReback.style.position = 'absolute';
    //    butReback.style.right = '10px';
    //    butReback.style.top = '2px';
    //    butReback.setAttribute('id', 'deptTree');

    //    $('#newmap3d').append($(butReback));

    //    sys.baseNew3D.initTree();

    //},
    loadDeptTree: function () {
        var urlPath = '/Graphic/GetDeptEmpTree';
        clientMode.post(urlPath, "", function (data) {
            if (data.length > 0)
                mapNew3D.initData(data);

        });
    },

    loadInOutDeptTree: function (isInOut) {
        let self = isInOut;
        var urlPath = '/Graphic/GetDeptEmpTree';
        clientMode.post(urlPath, "", function (data) {
            if (data.length > 0) {
                //let dtnew = undefined;
                if (self) {
                    mapNew3D.rtInDeptEmpTree(data);
                } else {
                    mapNew3D.initData(mapNew3D.rtOutDeptEmpTree(data));
                }

            }
            //  mapNew3D.initData(dtnew);

        });
    },
    rtInDeptEmpTree: function (data) {
        $.each(data[0].children, function (j, n) {
            let delList = [];
            $.each(n.children, function (i, item) {
                if ($.inArray(item.id, rtEmpTags) == -1) {
                    delList.push(i);
                }
            });

            delList.reverse().forEach(function (index) {
                //data[0].children[j].children.splice(index, 1);
                //data[0].children[j].items.splice(index, 1);
                data[0].items[j].children.splice(index, 1);
                data[0].items[j].items.splice(index, 1);
            });
        });
        mapNew3D.initData(data);

    },

    rtOutDeptEmpTree: function (data) {

        $.each(data[0].children, function (j, n) {
            let delList = [];
            $.each(n.children, function (i, item) {
                if ($.inArray(item.id, rtEmpTags) != -1) {
                    delList.push(i);
                }
            });
            delList.reverse().forEach(function (index) {
                //data[0].children[j].children.splice(index, 1);
                //data[0].children[j].items.splice(index, 1);
                data[0].items[j].children.splice(index, 1);
                data[0].items[j].items.splice(index, 1);
            });
        });
        mapNew3D.initData(data);

    },
    initData: function (data) {
        if (data == undefined)
            return;

        let totalEmp = 0;
        $.each(data[0].items, function (i, n) {
            data[0].items[i].text = n.text + "(" + n.items.length + ")";
            totalEmp += n.items.length;

        });
        let rtBtnState = "-全部";
        if (isInOut) {
            rtBtnState = "-在线";
        } else if (isInOut == false)
        { rtBtnState = "-离线"; }

        data[0].text = data[0].text + "(" + totalEmp + ")" + rtBtnState;

        kendo.ui.progress($('#splitContainer'), true);
        kendo.ui.progress($('#splitContainer'), false);
        deptTreeControl.setTreeData("");
        deptTreeControl.setTreeData(data);
        deptTreeControl.tree.expand('.k-item:first');
      
        if (!this.selectRtEmpIds)
            return;

        kendo.ui.progress($('#splitContainer'), true);
    },

    isExitRole: function () {
        //判断是否选中role
        if (!this.selectRtEmpIds) {
            alert("请选中要过滤的部门");
            //  EAP.UI.MessageBox.alert(this.prompt, System.CultureInfo.GetDisplayText('SelectRoleFirst'));
            return false;
        } else {
            return true;
        }
    },

    //部门过滤
    filtrateRtDept: function () {
        // if (!this.isExitRole()) return;
        showChkRtEmp = [];
        var checkedIds = deptTreeControl.getCheckedItems().ids;
        if (checkedIds.length == 0) {
            // showChkRtEmp = [];
            layer.msg("没有过滤信息，显示所有实时信息...", { icon: 5, time: 3000 });
        } else {
            checkedIds.forEach(n => {
                let tagNoList = n.split('-');
                if (tagNoList.length == 1) {
                    showChkRtEmp.push(n);
                }
            });
            //  showChkRtEmp = checkedIds;
        }
        kendo.ui.progress($('#splitContainer'), true);
        //  alert(checkedIds);
        sys.newmap3D.clearAllRtEmp();
    },
    initTree: function () {
        let that = this;
        deptTreeControl = {};
        let treeoption = {};
        treeoption.selector = '#a6';
        //treeoption.selector = '#lefttop';
        treeoption.showCheckBox = true;
        treeoption.check = function (e) {
            that.selectRtEmpIds = e.sender.dataItem(e.node);
            deptTreeControl.checkItemsDownward(e.node);
            if (deptTreeControl.tree.dataItem(e.node).checked)
                return;
            deptTreeControl.checkItemsUpward(e.node);
        }
        deptTreeControl = new EAP.UI.TreeControl(treeoption);
        // this._loadAuthorityData();
        mapNew3D.loadDeptTree();
    },

    initMqttConfig: function ()
    {
        let fileMPath ='../../Config/mqtt.json';
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
        });
    },


    /***********************视频跟踪******************************************************/
    trackvideosStartMqtt: function () {

        var host = mqttConfig.Server;// 'mqtt.dev.portsys.cn';//$("#connect_host").val();
        var port = mqttConfig.Port;//$("#connect_port").val();
        var clientId = new Date().getTime().toString(); //$("#connect_clientId").val();
        var user = mqttConfig.UserId; // $("#connect_user").val();
        var password = mqttConfig.Password;// $("#connect_password").val();


        let destination = mqttConfig.trackVideo;//"rpm/videotrack"; //mqttConfig.rtPs; // rpm/sfloc 
        let mqttClient = new Messaging.Client(host, Number(port), clientId);
        mqttClient.onConnect = () => { mqttClient.subscribe(destination); };
        mqttClient.onMessageArrived = mapNew3D.trackvideos;
        // mqttClient.onConnectionLost = mapNew3D.onConnectionLost;
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
    trackvideos: function (message) {    
        var rtEmpMsg = '[' + message.payloadString + ']';
        var rtList = JSON.parse(rtEmpMsg);
        rtList.forEach(function (item) {
            rtTrackVideo[item.IPAddress] = item;
        })
    },


}