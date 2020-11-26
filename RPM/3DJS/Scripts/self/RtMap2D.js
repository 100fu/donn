
var showDeptIds = [];
var mqttClient = undefined;
var rtLocTags = {}, almArea = [];
var deptTreeControl = {}, selectRtEmpIds = [], rtEmpTags = [], reDevTags = [], isInOut = undefined;

//区域显示设置
var isTrackVideo = false, isOpen = false, showMainDiv = false, trackTag = undefined;
var videoList = [];

let newmqttClient = undefined;
let offlinemqttClient = undefined;
let rthelptag = [];
var setting = { isChkAlmReg: true, isChkAttReg: false, isChkStaShow: true, isChkDzkq: false, isChkVideo: true, isChkTrackShow: false };
//var videoList = [
//    { IPAddress: '192.168.8.122', Port: 80, Username: 'admin', Password: '123456@q', ChannelId: 1, g_iWndIndex: 0 }];

let regT = [], pzyjT = [], lowT = [];
var offlinetime = 100;//秒
rtmap2d = {
    LoadMap: function () {
        map2dLayer.InitThreeScene('newmap3d');
        isOnlySel = false;
        isdraw = false;
        callbackmqtt = 'rtmap2d.afterMqttConfig';
        map2dLayer.initMqttConfig();
        // callbackdrawReg = 'rtmap2d.drawReg';
        callbackfloor = 'rtmap2d.afterInitfloor';
        callbackfun = 'rtmap2d.showTrackVideo';



        rtmap2d.initToolRight();//加载右边按钮
        rtmap2d.initBottomR();//右下角提示信息
        rtmap2d.initRtAlmBR(); //加载报警信息
        rtmap2d.initSet();//加载设置显示


        rtmap2d.loadLeftDiv();
        rtmap2d.loadDivVideo();  //摄像机显示
        rtmap2d.Refresh();
        //rtmap2d.startReadMes(); //实时人员
        //rtmap2d.rtAreaInfo();//实时区域报警

        callchangefloor = 'rtmap2d.changefloor';
        //  map2dLayer.loadCurLayer('newmap3d');//图层显示


        ///实时人员位置刷新
        setInterval(function () {
            for (var n in rtLocTags) {
                rtmap2d.onRtMessageShow(rtLocTags[n]);
            }
        }, 40);

        ///电子围栏报警刷新
        setInterval(function () {
            let perRtMessage = document.getElementById('alarmDiv');
            if (window.getComputedStyle(perRtMessage).getPropertyValue('display') === 'block') {
                if (almArea.length > 0)
                    rtmap2d.showRTAlarmList();
            }
        }, 1000);
        //  rtmap2d.createalmbar();

        rtmap2d.initSOSDiv();
        rtmap2d.initTagListDiv();

        ///获取实时显示的设置信息
        rtmap2d.getrtsetting();
        ///获取网络摄像机 GBT28181配置
        trackvideo.initGBT28181();


    },
    afterInitfloor: function () {
        callbackdrawReg = 'rtmap2d.initShow';
        map2dLayer.loadVideo();//加载摄像机
        map2dLayer.initLayerSel();

        //callregedit = 'rtmap2d.initShowRegion';
        //sys.draw.getRegsCallback('attendRegion', map2dLayer.LoadRtAreaReg);//电子考勤
        //sys.draw.getRegsCallback('rollcallRegion', map2dLayer.LoadRtAreaReg); //电子点名
        //sys.draw.getRegsCallback('alarmRegion', map2dLayer.LoadRtAreaReg);//电子报警
        rtmap2d.afterchangefloor();
    },
    afterMqttConfig: function () {
        rtmap2d.startReadMes(); //实时人员
        rtmap2d.rtAreaInfo();//实时区域报警
        rtmap2d.rtTagAlmMes();//订阅实时求救信息
        rtmap2d.rtofftags();//订阅离线标签信息
    },
    initShow() {
        map2dLayer.isshowReg(setting.isChkVideo, 'video'); //摄像机
    },
    Refresh: function () {
        //sys.draw.getRegsCallback('attendRegion', map2dLayer.LoadRtAreaReg);//电子考勤
        //sys.draw.getRegsCallback('rollcallRegion', map2dLayer.LoadRtAreaReg); //电子点名
        //sys.draw.getRegsCallback('alarmRegion', map2dLayer.LoadRtAreaReg);//电子报警
        basicdata.loadDeptInfo();//部门信息
        basicdata.loadTagList();
    },
    loadLeftDiv: function () {
        var div = document.createElement('div');
        div.setAttribute('id', 'lefttop');
        div.setAttribute('class', 'floatA');
        $('#newmap3d').append($(div));
        clientMode.getfile("/RPM/3DJS/leftDiv.html", function (data) {
            var div = document.getElementById('lefttop');
            div.innerHTML = data;
            // map2dLayer.initLayerSel();//显示图层         
            map2dLayer.initTree('a6');

        });
        ///默认隐藏筛选面板
        rtmap2d.isShowMainDiv();
    },
    loadDivVideo: function () {
        let div = document.createElement('div');
        div.setAttribute('id', 'videoDiv');
        div.setAttribute('class', 'fillclass');
        $('#newmap3d').append($(div));
    },

    //showVideo: function () {
    //    if (videoList.length > 0) {
    //        map2dLayer.ShowDivTF('videoDiv', true);
    //        for (let index = 0; index < videoList.length; index++) {
    //            try {
    //                var video = videoList[index];
    //                var vid = video.IPAddress;
    //                trackvideo.createVideo(vid, index, video.IPAddress);
    //                trackvideo.webVideo(vid);
    //                trackvideo.loginvideo(video);
    //            } catch (err) {
    //                // alert(err.message);
    //                layer.msg(err.message, { icon: 4, time: 2000 });
    //            }
    //        }
    //    }
    //},

    showTRVideo: function (video, index) {
        try {
            var vid = "onevideo";
            if ($("#videoDiv").children("div").length === 0) {
                trackvideo.createVideo(vid, index, video.IPAddress);
            } else {
                $("#onevideotopleft").html(video.IPAddress);
            }
            trackvideo.webVideo(vid);
            trackvideo.loginvideo(video);
        } catch (err) {
            // alert(err.message);
            layer.msg(err.message, { icon: 4, time: 2000 });
        }
    },

    loadToolmenu: function () {
        let div = document.createElement('div');
        div.setAttribute('id', 'secondmenu1');
        div.setAttribute('class', 'btn-group1');
        let div_a = null;
        let div_ai = null;
        for (var i = 0; i < 2; i++) {
            div_a = document.createElement('a');
            div_a.setAttribute('class', 'btn btn-defaul');
            div_a.href = "#";
            div_ai = document.createElement('i');
            switch (i) {
                case 0:
                    div_a.onclick = function () {
                        rtmap2d.showSetting();
                    }
                    div_ai.setAttribute('class', 'fa fa-cog fa-lg');
                    div_ai.setAttribute('title', '设置');
                    break;
                case 1:
                    div_a.onclick = function () {
                        if (is3DFull) {
                            map2dLayer.exitFullScreen();

                        } else {
                            map2dLayer.enterFullScreen();
                        }

                    }
                    div_ai.setAttribute('class', 'fa fa-arrows fa-lg');
                    div_ai.setAttribute('title', '全屏');
                    break;
            }
            div_a.appendChild(div_ai);
            div.appendChild(div_a);
        }
        $('#newmap3d').append($(div));
    },

    /*********************区域隐藏设置***********************************/
    ///加载
    showSetting: function () {
        isdraw = false;
        $("#taglistdiv").hide();
        if (document.getElementById('little').style.display === "none") {

            map2dLayer.ShowDivTF('little', true);

        } else {

            map2dLayer.ShowDivTF('little', false);

        }
        document.getElementById("ro").checked = setting.isChkAttReg;
        document.getElementById("ra").checked = setting.isChkAlmReg;
        document.getElementById("st").checked = setting.isChkStaShow;
        document.getElementById("att").checked = setting.isChkDzkq;
        document.getElementById("video").checked = setting.isChkVideo;
        document.getElementById("chkRtT").checked = setting.isChkTrackShow;

        map2dLayer.ShowDivTF('lefttop', false);
        showMainDiv = true;

    },


    chickVideo: function () {
        let ischk = document.getElementById("video").checked;
        setting.isChkVideo = ischk;
        map2dLayer.isshowReg(ischk, 'video');
        rtmap2d.savesetting();
    },
    clickAtt: function () {
        let ischk = document.getElementById("att").checked;

        setting.isChkDzkq = ischk;
        map2dLayer.isshowReg(ischk, 'attendRegion');
        rtmap2d.savesetting();
    },
    //显示电子点名
    clickRoll: function () {

        let ischk = document.getElementById("ro").checked;
        setting.isChkAttReg = ischk;
        map2dLayer.isshowReg(ischk, 'rollcallRegion');
        rtmap2d.savesetting();
    },
    //显示电子围栏
    clickRail: function () {

        let ischk = document.getElementById("ra").checked;
        setting.isChkAlmReg = ischk;
        map2dLayer.isshowReg(ischk, 'alarmRegion');
        rtmap2d.savesetting();
    },
    //显示基站
    clickStation: function () {
        let ischk = document.getElementById("st").checked;
        setting.isChkStaShow = ischk;
        map2dLayer.isshowReg(ischk, 'sta');
        rtmap2d.savesetting();
    },
    //显示轨迹
    showRt: function () {
        let chkrt = document.getElementById("chkRtT").checked;
        setting.isChkTrackShow = chkrt;
        let txtsel = $("#input1").val();
        map2dLayer.showEmpTrackLine(chkrt, txtsel);
        rtmap2d.savesetting();
    },

    // rtmap2d.allDeptclick
    /****************************部门树Left********************************************************************/
    allDeptclick: function () {
        let inputqb = document.getElementById('allqb');
        let inputzx = document.getElementById('allzx');
        let inputlx = document.getElementById('alllx');
        inputqb.setAttribute('class', 'color_queen');
        inputzx.setAttribute('class', 'color_front');
        inputlx.setAttribute('class', 'color_front');
        //inputsx.setAttribute('class', 'back_color');
        isInOut = undefined;
        $('input:radio[name="sex"]').removeAttr('checked');
        chkSex = undefined;
        map2dLayer.loadDeptTree();
    },
    zxEmpclick: function () {
        let inputqb = document.getElementById('allqb');
        let inputzx = document.getElementById('allzx');
        let inputlx = document.getElementById('alllx');

        inputqb.setAttribute('class', 'color_front');
        inputzx.setAttribute('class', 'color_queen');
        inputlx.setAttribute('class', 'color_front');
        //inputsx.setAttribute('class', 'back_color');
        isInOut = true;
        map2dLayer.loadInOutDeptTree(isInOut);
    },
    lxEmpclick: function () {
        let inputqb = document.getElementById('allqb');
        let inputzx = document.getElementById('allzx');
        let inputlx = document.getElementById('alllx');

        inputqb.setAttribute('class', 'color_front');
        inputzx.setAttribute('class', 'color_front');
        inputlx.setAttribute('class', 'color_queen');

        isInOut = false;
        map2dLayer.loadInOutDeptTree(isInOut);
    },
    sxDeptclick: function () {
        let inputsx = document.getElementById('allsx');
        map2dLayer.filtrateRtDept();
        let lengthEmp = showChkRtEmp.length;


        //alert(lengthEmp);
        if (lengthEmp === 0) {
            inputsx.setAttribute('class', 'back_color');
        } else {
            inputsx.setAttribute('class', 'color_queen');
            if (lengthEmp === 1) {
                let tagNo = showChkRtEmp[0];
                rtmap2d.moreFloorSearch(tagNo);
            }
        }
    },
    trackvideo: function () {
        // alert('开发中....');
        let txtsel = $("#input1").val();
        if (txtsel === null || txtsel === "") {
            layer.msg('请输入要跟踪的人员！', { id: 'showmsg', icon: 5, time: 2000 });
            return;
        }
        trackTag = txtsel;
        if (isTrackVideo === false) {
            isTrackVideo = true; //addClass
            $('#videoStart').removeClass('back_color');
            $('#videoStart').addClass('color_queen');
            $('#videoStart').html('停止跟随');
            basicdata.loadWebSocket();

            //临时测试使用 
            // rtmap2d.showVideo();

        } else {
            isTrackVideo = false;
            $('#videoStart').removeClass('color_queen');
            $('#videoStart').addClass('back_color');
            //摄像机跟随
            basicdata.sendSocket(trackTag + "&remove");
            $('#videoStart').html('摄像机跟随');
            //basicdata.sendSocket("close");
            map2dLayer.ShowDivTF('videoDiv', false);
            rtmap2d.clearTrackVideo();
        }

    },
    clearTrackVideo: function () {
        map2dLayer.ShowDivTF('videoDiv', false);
        trackvideo.closeVideo();
        videoList = [];
    },
    //showTrackVideo: function (vip) {
    //    //if (vip === '' || vip ==='testTrackVideo') {
    //    //   // layer.msg('测试信息:'+vip, { id:'showmsg', icon: 5, time: 2000 });
    //    //   // return;
    //    //}
    //    // { IPAddress: '192.168.8.122', Port: 80, Username: 'admin', Password: '123456@q', ChannelId: 1, g_iWndIndex: 0 }];
    //    let video = rtmap2d.getVideoByIP(vip, videoList);
    //    if (video === undefined) {

    //        let vinfo = VideoInfoList[vip];
    //        if (vinfo !== undefined && vinfo.Floor === curFloor) {
    //            videoList = [];
    //            let newVideo = { IPAddress: vinfo.IPAddress, Port: 80, Username: vinfo.Username, Password: vinfo.Password, ChannelId: 1, g_iWndIndex: 0, controlPort: vinfo.Port }
    //            videoList.push(newVideo);

    //            map2dLayer.ShowDivTF('videoDiv', true);
    //            rtmap2d.showTRVideo(newVideo, videoList.length - 1);
    //        }
    //    }
    //},
    getVideoByIP: function (vip, list) {
        let video = undefined;
        if (list.length > 0) {
            list.forEach(o => {
                if (o.IPAddress === vip)
                    video = n;
            })
        }
        return video;
    },
    changeSex: function (event) {
        //alert(event.value);
        chkSex = event.value;
        if (isInOut === undefined) {
            map2dLayer.loadDeptTree();
        } else {
            map2dLayer.loadInOutDeptTree(isInOut);
        }
    },



    /****************************实时人员显示Mqtt********************************************************************/
    onConnectionLost: function () {
        console.log('mqtt failure!! reStart!!');
        rtmap2d.startReadMes();
    },
    startReadMes: function () {

        let host = mqttConfig.Server;// 'mqtt.dev.portsys.cn';//$("#connect_host").val();
        let port = mqttConfig.Port;//$("#connect_port").val();
        let clientId = new Date().getTime().toString(); //$("#connect_clientId").val();
        let user = mqttConfig.UserId; // $("#connect_user").val();
        let password = mqttConfig.Password;// $("#connect_password").val();


        let destination = mqttConfig.rtPs; // rpm/sfloc 
        let mqttClient = new Messaging.Client(host, Number(port), clientId);
        mqttClient.onConnect = () => { mqttClient.subscribe(destination); };
        mqttClient.onMessageArrived = rtmap2d.onRtMessage;
        mqttClient.onConnectionLost = rtmap2d.onConnectionLost;
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
    onRtMessage: function (event) {
        let rtEmpMsg = '[' + event.payloadString + ']';
        let rtList = JSON.parse(rtEmpMsg);
        rtList.forEach(function (item) {
            // rtLocTags[item.UniqueId] = item;
            if (item.X !== null && item.Y !== null) {
                rtLocTags[item.UniqueId] = item;
                //设置在线状态
                rtmap2d.setTagListOnLine(item.UniqueId, true);
            }
        });
    },
    onRtMessageShow: function (item) {

        //if (item.Floor === undefined)
        //    item.Floor = item.Region;
        if (item.Region === null)
            item.Region = "首层";
        //只显示当前楼层人员信息
        if (chkOneFloor === true) {
            if (item.Region !== curFloor)
                return;
        }

        let rtPoint = { x: Number(item.X) + Number(tranX), y: Number(item.Y) + Number(tranY), z: 0 };
        let rtMes = null;
        $.each(TagList, function (i, tag) {
            if (tag.tagCode === item.UniqueId) {
                TagList[i].floor = item.Region;
                TagList[i].Voltage = item.Voltage === null ? 390 : item.Voltage;                
                tag.floor = item.Region;           
                rtMes = tag;
            }
        });

        if (rtMes !== null) {
            if (rtMes.online === false)
                return;
            rtMes.position = rtPoint;
            if (showChkRtEmp.length > 0) {
                if ($.inArray(rtMes.tagCode, showChkRtEmp) !== -1) {
                    if (rtMes.tName !== "" && rtMes.useState !== 0)
                        rtmap2d.addRtMapEmp(rtMes);
                }
            } else {
                if (rtMes.tName !== "" && rtMes.useState !== 0)
                    rtmap2d.addRtMapEmp(rtMes);
            }
        }

    },
    addRtMapEmp(emp) {

        let isHave = map2dLayer.IsExistEmpObj3D(emp.tagCode);

        //没有就添加
        if (isHave === false) {
            if (emp.useState === 1) {
                //emp.icon = fileParam.empIcon + 'loc.gif';
                emp.icon = fileParam.empIcon + 'emp_4.png';

                if (rtEmpTags.indexOf(emp.tagCode) === -1) {
                    rtEmpTags.push(emp.tagCode);   //实时人员标签列表
                }

                rtmap2d.setRtTagOnLine("pos",("在线人数：" + rtEmpTags.length));
                if (emp.floor !== curFloor)
                    return;

            }
            else if (emp.useState === 2) {
                emp.icon = fileParam.devIcon + 'dev_01.png';
                //    sys.baseNew3D.addRtDevList(emp);
                if (reDevTags.indexOf(emp.tagCode) === -1) {
                    reDevTags.push(emp.tagCode); //实时设备标签列表
                }
                rtmap2d.setRtTagOnLine("device", ("在线设备：" + reDevTags.length));
                if (emp.floor !== curFloor)
                    return;
            }

            // var empIcon = sys.draw.createRtIcon(emp);
            var empIcon = basicdata.createRtIcon(emp);
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
            // sys.draw.plan3DAdd(empIcon);
            map2dLayer.AddObj2DRegion(empIcon);

            if (isInOut !== undefined) {
                map2dLayer.loadInOutDeptTree(isInOut);
            }
        } else {
            if (emp.floor !== curFloor)
                return;
            map2dLayer.changeEmpPosition(emp.tagCode, emp.position);
        }
    },

    /************************实时区域报警***********************************************************/

    onRtRegAlm: function (message) {
        if (message.payloadString !== "") {
            // alert(message.payloadString);
            let data = JSON.parse(message.payloadString);

            if (data.length === 0)
                return;
            almArea = [];
            let almId = [];
            // console.log(data);
            $.each(data, function (i, strItem) {
                let item = JSON.parse(strItem);
                if (item.ListTags === "") {
                    map2dLayer.setAreaAlmColor(item.AreaId, false);
                } else {
                    if (item.AreaId === "") {
                        if (item.ListTags !== "") {
                            let tags = item.ListTags.split(',');
                            $.each(tags, function (n, tag) {
                                rtmap2d.addAlmArea(item.AreaId, tag);
                            });
                        }
                    } else {
                        let tags = item.ListTags.split(',');
                        $.each(tags, function (n, tag) {
                            var isHaveA = false;

                            rtmap2d.addAlmArea(item.AreaId, tag);
                            $.each(almId, function (i, obj) {
                                if (obj === item.AreaId) {
                                    isHaveA = true;
                                }
                            });
                            if (isHaveA === false) {
                                almId.push(item.AreaId);
                            }
                        });
                    }
                }
            });

            if (almId.length > 0) {
                //弹出报警窗体
                rtmap2d.openAlarmPage();

                //设置报警区域
                $.each(almId, function (i, key) {
                    map2dLayer.setAreaAlmColor(key, true);
                });
            } else {
                if (almArea.length === 0) {
                    //let perRtMessage = document.getElementById('alarmDiv');
                    //perRtMessage.style.display = 'none';
                    try {
                        map2dLayer.ShowDivTF('alarmDiv', false);
                        map2dLayer.ShowDivTF('almid', false);
                        var audio = $('#music1');
                        audio[0].pause();
                        //  layer.close(layer.index);
                        isOpen = false;
                    } catch (e) {
                        console.log('onRtRegAlm() 异常');
                    }
                } else {
                    //没有设置区域的情况下，显示碰撞报警的信息                    
                    rtmap2d.openAlarmPage();
                }
            }
        }

    },
    onConnectionLostWarning: function () {
        console.log('mqtt failure!! reStart!!');
        rtmap2d.rtAreaInfo();
    },
    rtAreaInfo: function () {

        let host = mqttConfig.Server;//  serverIP
        let port = mqttConfig.Port;// serverPort
        let clientId = new Date().getTime().toString(); //id
        let user = mqttConfig.UserId; // userid
        let password = mqttConfig.Password;// password

        let destination = mqttConfig.rtAlm; //key 'rpm/rtemp'; 
        let client = new Messaging.Client(host, Number(port), clientId);
        client.onConnect = () => { client.subscribe(destination); }

        client.onMessageArrived =  rtmap2d.onRtRegAlm; //rtmap2d.onRtRegAlmNew;
        client.onConnectionLost = rtmap2d.onConnectionLostWarning;
        client.connect({
            userName: user,
            password: password,
            onSuccess: () => {
                console.log('rpm/locwarning successFull');
                client.subscribe(destination);
            },
            onFailure: () => { }
        });
    },

    openAlarmPage: function (showMes) {
        if (isOpen === false) {
            try {
                isOpen = true;
                map2dLayer.ShowDivTF('almid', true);
                var audio = $('#music1');
                audio[0].play();
            } catch (e) {
                console.log('openAlarmPage() 异常');
            }
        }
    },
    alarmMes: function () {
        try {
            isOpen = true;
            let divAlarm = document.getElementById('alarmDiv');
            divAlarm.style.display = 'block';
            rtmap2d.showRTAlarmList();
            map2dLayer.ShowDivTF('almid', false);
            var audio = $('#music1');
            audio[0].pause();

        } catch (e) {
            console.log('alarmMes() 异常');
        }

    },
    addAlmArea: function (areaId, tagNo) {
        //{ id: '1', tName: '江小白', tagNo: '020-111-222-098', regType: '电子围栏报警', regName: '1号电子围栏', regStart: '2018-03-29 13:00:00' }
        let regObj = null;
        if (areaId !== "")
            regObj = map2dLayer.findRegObj(areaId);

        let tag = null;
        let tagList = tagNo.split(';');

        $.each(TagList, function (i, n) {
            if (n.tagCode === tagList[0])
                tag = n;
        });
        if (tag === null)
            return;
        //{ tName: rtMes.TName, tCode: rtMes.TagNo, tagCode: rtMes.TagNo, deptid: deptId, useState: rtMes.TagState };

        // let regsType = '危险区禁入报警';
        let regsType = '0';
        let regsName = "";
        let empName = "";
        let rtChkTime = new Date(tagList[1].replace('T', ' ')).Format("yyyy-MM-dd HH:mm:ss");
        if (tagList.length === 3) {
            regsType = tagList[2].trim();
        }
        if (areaId !== "") {
            //区域为空就不显示电子围栏报警
            if (regObj !== undefined) {
                regsName = regObj.showname;
                if (tag.tName !== "") {
                    let almMsg = { id: (almArea.length + 1), tName: tag.tName, tagNo: tag.tagCode, regType: regsType, regName: regsName, regStart: rtChkTime };
                    almArea.push(almMsg);
                }
            }
        } else {
            //regsType = '碰撞预警';
            //if (tag.tName !== "") {
            //    let almMsg = { id: (almArea.length + 1), tName: tag.tName, tagNo: tag.tagCode, regType: regsType, regName: regsName, regStart: rtChkTime };
            //    almArea.push(almMsg);
            //}
            if (tagList.length === 4) {
                regsType = '低电报警';
                regsName = tagList[3].trim();
            } else {
                regsType = '碰撞预警';
            }
            if (tag.tName !== "") {
                let almMsg = { id: (almArea.length + 1), tName: tag.tName, tagNo: tag.tagCode, regType: regsType, regName: regsName, regStart: rtChkTime };
                almArea.push(almMsg);
            }
        }
    },

    showRTAlarmList: function () {

        let eleAlm = 0;
        let collAlm = 0;
        let lowAlm = 0;
        if (almArea.length > 0) {
            let option = " ";
            for (var i = 0; i < almArea.length; i++) {
                let alm = almArea[i];
                ///奇偶行设置
                if ((i + 1) % 2 === 1) {
                    option += "<div class='divodd'> ";
                } else {
                    option += "<div class='diveven'>";

                }
                option += " <div class='divtagalm'>";
                option += "<div>名称:" + alm.tName + "</div><div>标签:" + alm.tagNo + "</div></div>";
                if (alm.regType === '碰撞预警') {
                    option += "<div style='color: rgba(56,255,17,1);'>状态:" + alm.regType + "</div>";
                    collAlm++;
                } else if (alm.regType === '1') {
                    option += "<div>状态:擅离职守报警</div>";
                    option += "<div>区域:" + alm.regName + "</div>";
                    eleAlm++;
                } else if (alm.regType === '低电报警') {
                    option += "<div style='color: rgba(0,255,234,1);'>状态:" + alm.regType + "</div>";
                    option += "<div>电量:" + alm.regName + "</div>";
                    lowAlm++;
                } else {
                    option += "<div style='color: rgba(0,255,234,1);'>状态:危险区禁入报警</div>";
                    option += "<div>区域:" + alm.regName + "</div>";
                    eleAlm++;
                }
                option += "<div>时间:" + new Date(alm.regStart.replace('T', ' ')).Format("yyyy-MM-dd HH:mm:ss") + "</div>";
                option += "</div>"
            }
            //  option += "</table>";

            let almMes = document.getElementById('rtAlarmMesList');
            almMes.innerHTML = option;

            let labMes = document.getElementById('WLMsg');
            labMes.innerHTML = '围栏:' + eleAlm
            let pzMes = document.getElementById('PZMsg');
            pzMes.innerHTML = '碰撞:' + collAlm;
            let lowMes = document.getElementById('LowMsg');
            lowMes.innerHTML = '低电:' + lowAlm;
        } else {
            isOpen = false;
            let perRtMessage = document.getElementById('alarmDiv');
            perRtMessage.style.display = 'none';
            layer.msg('没有可显示的信息!', { icon: 0, time: 2000 });
        }
    },

    changefloor: function () {
        map2dLayer.clearFloorAllRtEmp();
        // rtmap2d.afterInitfloor();
        rtmap2d.afterchangefloor();

    },
    changeCHK: function (event) {
        map2dLayer.clearFloorAllRtEmp();
        let lblEmpInfo = document.getElementById("pos");
        lblEmpInfo.innerText = "在线人数：0";
        let lbldevInfo = document.getElementById("device");
        lbldevInfo.innerText = "在线设备：0";
        chkOneFloor = event.checked;
        map2dLayer.loadInOutDeptTree(isInOut);
    },

    createalmbar: function () {
        let div = document.createElement('div');
        div.setAttribute('id', 'almid');
        div.style.display = 'none';
        div.style.position = 'absolute';
        div.style.right = '238px';
        div.style.top = '2px';
        div.style.opacity = 0.8;
        div.style.borderRadius = '6px';

        let aimg = document.createElement('img');
        aimg.src = fileParam.getImg('timg.gif');
        aimg.style.width = '36px';
        aimg.style.height = '30px';
        aimg.style.borderRadius = '6px';
        aimg.onclick = function () {
            rtmap2d.alarmMes();
        };
        div.appendChild(aimg);
        $('#newmap3d').append($(div));

    },

    initToolRight: function () {
        //var strHtml = "<div id='righttool'><div><img onclick='rtmap2d.initshowFull()' src='" + fileParam.getImg('fullsceen.png', 'toolbar') + "'></div><div><img onclick='rtmap2d.showSetting()' src='" + fileParam.getImg('set.png', 'toolbar') + "'></div><div><img onclick='rtmap2d.isShowMainDiv()'  src='" + fileParam.getImg('find.png', 'toolbar') + "'></div><div id='almid'  style='margin-top: 320px;display: none;'><img onclick='rtmap2d.alarmMes()' src='" + fileParam.getImg('almmsg.png', 'toolbar') + "'><audio preload='auto' autoplay='' id='music1' src='/RPM/3DJS/Scripts/json/alarm.wav' autoplay preload loop='loop'></div></div>";
        var strHtml = "<div id='righttool'><div><img onclick='rtmap2d.initshowFull()' src='" + fileParam.getImg('fullsceen.png', 'toolbar') + "'></div><div><img onclick='rtmap2d.showSetting()' src='" + fileParam.getImg('set.png', 'toolbar') + "'></div><div><img onclick='rtmap2d.isShowMainDiv()'  src='" + fileParam.getImg('find.png', 'toolbar') + "'></div> <div><img onclick='rtmap2d.showTagEmpMsgDiv()'  src='" + fileParam.getImg('empinfo.png', 'toolbar') + "'></div> <div id='almid'  style='margin-top: 320px;display: none;'><img onclick='rtmap2d.alarmMes()' src='" + fileParam.getImg('almmsg.png', 'toolbar') + "'><audio preload='auto' autoplay='' id='music1' src='/RPM/3DJS/Scripts/json/alarm.wav' autoplay preload loop='loop'></div></div>";

        $('#newmap3d').append(strHtml);
        try {
            var audio = $('#music1');
            audio[0].pause();
        } catch (e) {
            console.log('audio pause error');
        }

        map2dLayer.ShowDivTF('almid', false);


    },
    initSet: function () {
        var strHtml = "<div id='little' style='width:145px;height:210px;top:70px;right:60px;position:absolute;opacity:0.9;background: rgba(56,58,60,1);display:none;'><div class='f' style='margin-top:8px;margin-left:18px;color:white;'><label style='color:white;padding-top:10px;margin-left:2px;'>设置显示</label></div><div  style='margin-top:8px;margin-left:18px;color:white;' ><input id='ra' onclick='rtmap2d.clickRail()' type='checkbox' />显示电子围栏  </div> <div  style='margin-top:8px;margin-left:18px;color:white;' ><input id='ro' type='checkbox'onclick='rtmap2d.clickRoll()' />显示电子点名 </div> <div  style='margin-top:8px;margin-left:18px;color:white;' ><input id='att' onclick='rtmap2d.clickAtt()'  type='checkbox' />显示电子考勤</div> <div  style='margin-top:8px;margin-left:18px;color:white;' ><input id='st' type='checkbox' onclick='rtmap2d.clickStation()'/>显示基站  </div><div  style='margin-top:8px;margin-left:18px;color:white;' ><input id='video' type='checkbox' onclick='rtmap2d.chickVideo()' />显示探头 </div><div   style='margin-top:8px;margin-left:18px;color:white;' ><input id='chkRtT' type='checkbox' onclick='rtmap2d.showRt()'/>显示轨迹 </div> </div>";

        $('#newmap3d').append(strHtml);

    },
    initBottomR: function () {
        var strHtml = " <div class='wrapbottom'><div><select id='selectid' class='selectbr' ondblclick='map2dLayer.selectShow()' onchange='map2dLayer.selchanged()'></select></div><div style='width:14px;'></div><div class='divbottomR'><div id='mouseps'>0,0</div><div id='pos'>在线人数：0</div><div id='device'>在线设备：0</div></div></div >";
        $('#newmap3d').append(strHtml);
    },
    initRtAlmBR: function () {
        var strHtml = " <div id='alarmDiv'><div id= 'topAlarm' class='wrapbetween'><div style='margin-top:5px;'><img src='" + fileParam.getImg('alm.png', 'toolbar') + "' style='width: 18px;height: 18px;margin-left: 10px;'></div><div class='txtAlm'>实时报警信息</div><div style='margin-top:5px;'><img onclick='rtmap2d.isShowAlmRtDiv2()'  src='" + fileParam.getImg('close1.png', 'toolbar') + "' style='width: 10px;height: 10px;margin-right: 10px;'></div></div><div class='wrapsparound'><div id='WLMsg'>围栏:0</div><div id='PZMsg'>碰撞:0</div><div id='LowMsg'>低电:0</div></div><div id='rtAlarmMesList'>    </div></div >";
        $('#newmap3d').append(strHtml);
        // rtmap2d.isShowAlmRtDiv();
        map2dLayer.ShowDivTF('alarmDiv', false);
        isOpen = false;
    },
    initshowFull: function () {
        if (is3DFull) {
            map2dLayer.exitFullScreen();

        } else {
            map2dLayer.enterFullScreen();
        }
        map2dLayer.ShowDivTF('lefttop', false);
        showMainDiv = true;
    },
    isShowMainDiv: function () {

        map2dLayer.ShowDivTF('lefttop', showMainDiv);
        showMainDiv = !showMainDiv;
        $("#little").hide();
        $("#taglistdiv").hide();
    },
    isShowAlmRtDiv2: function () {
        map2dLayer.ShowDivTF('alarmDiv', false);
        isOpen = false;
    },
    moreFloorSearch: function (tagNo) {
        let empRt = null;
        ///当只选择一个人的时候
        TagList.forEach((o) => {
            if (o.tagCode === tagNo) {
                empRt = o;
            }
        });
        if (empRt !== null)
            if (empRt.floor !== curFloor) {
                map2dLayer.setSelectChecked(empRt.floor);
            }
    },
    //rtmap2d.moreFloorEmpSearch
    moreFloorEmpSearch: function () {
        if (event.keyCode === 13) {
            var txtsel = $("#input1").val();
            if (txtsel === null || txtsel === "") {
                layer.msg('请输入要查的信息！', { icon: 5, time: 3000 });
            } else {
                var isHEmp = map2dLayer.lookAtEmp(txtsel);
                if (isHEmp === false) {
                    //  layer.msg(txtsel + '信息没有查到...', { icon: 5, time: 3000 });          
                    rtmap2d.moreFloorSearch(txtsel);
                    //  map2dLayer.lookAtEmp(txtsel);
                }
            }
        }
    },

    //testEmpInfo: function ()
    //{
    //    let urlPath = '/ThreeModel/GetEmpInfo';
    //    clientMode.post(urlPath, null, function (data) {
    //        alert(data);
    //        let rtList = JSON.parse(data);
    //        alert(rtList);
    //    })
    //}

    /*******************************************实时求救信息*********************************************************************/

    onRtTagAlmConnLost: function () {
        console.log(' rpm/webrtalm mqtt failure!! reStart!!');
        rtmap2d.rtTagAlmMes();
    },
    onRtTagAlmMsg: function (event) {
        let rtEmpMsg = '[' + event.payloadString + ']';
        let rtList = JSON.parse(rtEmpMsg);
        rtList.forEach((item) => {

            let tagno = item.SensorID;
            let chkTime = item.resettime;
            let almtype = item.AlarmType;
            let key = tagno + '&' + almtype;
            let empinfo = rtmap2d.getTagEmpInfo(tagno);
            if (empinfo !== null) {
                let index = rtmap2d.getArrayIndex(rthelptag, key);
                if (index === -1) {
                    if (almtype === 1)
                        ///向队列中添加求救报警信息
                        rthelptag.push(key); {
                        let empname = '未知';
                        if (empinfo !== null)
                            empname = empinfo.tName;
                        rtmap2d.addSosDiv(tagno, empname, chkTime);
                    }
                }
            }
        });
    },
    sendMqttMsg: function (topic, msg) {

        //s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", content:" + (s) + ", from: web console}";
        let ss = JSON.stringify(msg);
        message = new Messaging.Message(ss);
        message.destinationName = topic;
        newmqttClient.send(message);

    },
    rtTagAlmMes: function () {

        let host = mqttConfig.Server;// 'mqtt.dev.portsys.cn';//$("#connect_host").val();
        let port = mqttConfig.Port;//$("#connect_port").val();
        let clientId = new Date().getTime().toString(); //$("#connect_clientId").val();
        let user = mqttConfig.UserId; // $("#connect_user").val();
        let password = mqttConfig.Password;// $("#connect_password").val();


        let destination = 'rpm/webrtalm'; // rpm/sfloc 
        newmqttClient = new Messaging.Client(host, Number(port), clientId);
        newmqttClient.onConnect = () => { newmqttClient.subscribe(destination); };
        newmqttClient.onMessageArrived = rtmap2d.onRtTagAlmMsg;
        newmqttClient.onConnectionLost = rtmap2d.onRtTagAlmConnLost;
        newmqttClient.connect({
            userName: user,
            password: password,
            onSuccess: () => {
                console.log('mqtt connected successFull.');
                newmqttClient.subscribe(destination);
            },
            onFailure: () => {
                console.log('mqtt failure  onFailure');
            }
        });

    },
    //rtmap2d.showhello()
    delTagHelp: function (obj) {

        let tag = obj.id;
        let id = $("#" + tag).data("id");
        let chktime = $("#" + tag).data("starttime");
        let almMsg = { TagId: id, AlmType: 10 };
        rtmap2d.sendMqttMsg('rpm/rttagalmack', almMsg);
        // alert(tag + " " + id + " " + chktime);
        layer.msg(id + ' 号标签求救解除...', { icon: 0, time: 2000 });
        $("#" + id).remove();
        let key = id + '&1';
        let index = rtmap2d.getArrayIndex(rthelptag, key);  // rthelptag.indexOf(id);
        if (index > - 1) {
            rthelptag.splice(index, 1);
        }
        if (rthelptag.length === 0)
            map2dLayer.ShowDivTF('sosdiv', false);
    },
    loadSosDiv: function () {
        let div = document.createElement('div');
        div.setAttribute('id', 'sosdiv');
        div.innerHTML = " <input type='button' value='222'   onclick='rtmap2d.showhello()'> "
        $('#newmap3d').append($(div));
    },
    initSOSDiv: function () {
        let div = document.createElement('div');
        div.setAttribute('id', 'sosdiv');
        //div.innerHTML = "<div id= 'topTagAlarm' class='wrapbetween'><div><img src='" + fileParam.getImg('alm.png', 'toolbar') + "' style='width: 18px;height: 18px;margin-left: 10px;'></div><div class='txtAlm'>SOS求救信息</div><div><img onclick='rtmap2d.isShowAlmRtDiv(sosdiv)'  src='" + fileParam.getImg('close1.png', 'toolbar') + "' style='width: 10px;height: 10px;margin-right: 10px;padding-top: 5px;'></div></div><div id='rtTagHelpMesList'></div>";
        div.innerHTML = "<div id= 'topTagAlarm' class='wrapbetween'><div><img src='" + fileParam.getImg('alm.png', 'toolbar') + "' style='width: 18px;height: 18px;margin-left: 10px;margin-top:5px;'></div><div class='txtAlmm'>SOS求救信息</div></div><div id='rtTagHelpMesList'></div>";
        $('#newmap3d').append($(div));
        map2dLayer.ShowDivTF('sosdiv', false);
        ////測試
        //for (var i = 0; i < 5; i++) {
        //    rtmap2d.addSosDiv("Tag" + i, "Name" + i, "Test1");
        //}
    },
    addSosDiv: function (tagno, empname, chktime) {

        let div = document.createElement('div');
        let delKey = 'help' + tagno;
        div.setAttribute('id', tagno);
        div.setAttribute('class', 'diveven2');
        div.innerHTML = "<div class='divtagalm'><div> 名称:" + empname + "</div>  <div>标签:" + tagno + "</div></div ><div class='divtagalm'><div>时间:" + chktime.replace('T', ' ') + "</div><div id='" + delKey + "' data-id='" + tagno + "' data-starttime='" + chktime + "' onclick='rtmap2d.delTagHelp(this)'  class='txtbtn3'>删除</div></div><div class='linecss'></div>"
        $('#rtTagHelpMesList').append($(div));
        map2dLayer.ShowDivTF('sosdiv', true);
    },
    getTagEmpInfo: function (tagno) {
        let rtMes = null;
        $.each(TagList, function (i, tag) {
            if (tag.tagCode === tagno) {
                rtMes = tag;
            }
        });
        return rtMes;
    },
    getArrayIndex: function (arr, value) {
        let index = arr.indexOf(value);
        return index;
    },


/*******************************************人员信息*********************************************************************/

    isShowAlmRtDiv: function (event) {
        map2dLayer.ShowDivTF('alarmDiv', false);
        map2dLayer.ShowDivTF('almid', true);
        if (event !== undefined) {
            let divid = event.id;
            map2dLayer.ShowDivTF(divid, false);
        }
    },

    initTagListDiv: function () {
        let div = document.createElement('div');
        div.setAttribute('id', 'taglistdiv');
        //div.innerHTML = "<div id= 'topTagAlarm' class='wrapbetween'><div><img src='" + fileParam.getImg('alm.png', 'toolbar') + "' style='width: 18px;height: 18px;margin-left: 10px;margin-top:5px;'></div><div class='txtAlm'>人员信息</div><div><img onclick='rtmap2d.isShowAlmRtDiv(taglistdiv)'  src='" + fileParam.getImg('close1.png', 'toolbar') + "' style='width: 10px;height: 10px;margin-right: 10px;padding-top: 5px;'></div></div><div id='rtTagEmpMesList'></div>";
        div.innerHTML = "<div id= 'topTagAlarm' class='wrapbetween'><div><img  style='height: 18px;margin-left: 10px;margin-top:5px;'></div><div class='txtAlm1'>人员信息</div><div><img style=' 10px;margin-right: 10px;padding-top: 5px;'></div></div><div id='rtTagEmpMesList'></div>";
        $('#newmap3d').append($(div));
        map2dLayer.ShowDivTF('taglistdiv', false);

    },
    addTagEmpInfodiv: function (tag) {
        //  var tag = { tName: rtMes.TName, tCode: rtMes.TagNo.toLowerCase(), tagCode: rtMes.TagNo.toLowerCase(), deptid: deptId, useState: rtMes.TagState, tel: (tel !== null ? tel : ""), objNum: (objNum !== null ? objNum : ""), remark: (remark !== null ? remark : ""), floor: '', guid: Id, TagType: 0, Voltage:390 };

        let div = document.createElement('div');
        div.setAttribute('id', tag.tagCode);
        div.setAttribute('class', 'diveven2');
        div.innerHTML = "<div><div class='divtagalm'><div>名称:" + tag.tName + "</div><div class='la'>标签:" + tag.tagCode + "</div></div> <div class='divtagalm'><div>部门:" + tag.deptname + "</div><div class='la'>职务:" + tag.dutyname + "</div></div><div class='divtagalm'><div title='" + tag.Voltage + "'>电量:" + map2dLayer.showVolage(tag.Voltage) + "</div><div class='lab'>手机:" + (tag.tel === "" ? "未登记" : tag.tel) + "</div></div><div class='linecss'></div></div >";
        //div.innerHTML = "<div class='diveven2'><div class='divtagalm'><div>名称:" + tag.tName + "</div><div class='la'>标签:" + tag.tagCode + "</div></div> <div class='divtagalm'><div>部门:" + tag.deptname + "</div><div class='la'>职务:" + tag.dutyname + "</div></div><div class='divtagalm'><div title='" + tag.Voltage + "'>电量:" + map2dLayer.showVolage(tag.Voltage) + "</div><div class='lab'>手机:" + (tag.tel === "" ? "未登记" : tag.tel) + "</div></div><div class='linecss'></div></div >";
        $('#rtTagEmpMesList').append($(div));
       
    },
    showTagEmpMsgDiv: function () {
        $("#little").hide();
        $("#lefttop").hide();
        $('#rtTagEmpMesList').html("");
        if (document.getElementById('taglistdiv').style.display === "none") {
            map2dLayer.ShowDivTF('taglistdiv', true);
        } else {
            map2dLayer.ShowDivTF('taglistdiv', false);
        }
        //map2dLayer.ShowDivTF('taglistdiv', true);
        $.each(TagList, function (i, tag) {
            if (tag.useState === 1) {
                rtmap2d.addTagEmpInfodiv(tag);
            }
        });
    },
    ///保存实时显示设置信息
    savesetting() {
        sys.MapData.savelocalStorage("rtset", setting);
    },

    ///获取实时显示设置信息
    getrtsetting() {
        let rtset = sys.MapData.getlocalStorage("rtset");
        if (rtset !== null)
            setting = rtset;
    },

    initShowRegion() {
        map2dLayer.isshowReg(setting.isChkAttReg, 'rollcallRegion'); //电子点名
        map2dLayer.isshowReg(setting.isChkDzkq, 'attendRegion');//电子考勤
        map2dLayer.isshowReg(setting.isChkAlmReg, 'alarmRegion');//电子报警      
    },
    //    showTrackVideo: function (vip) {
    showTrackVideo(vip) {
        try {
            let videos = vip.split('-');

            let vinfo = VideoInfoList[videos[0]];//VideoInfoList[vip];

            if (vinfo !== undefined && vinfo.Floor === curFloor) {
                let strList = vinfo.Position.split(',');
                let ps = { X: strList[0], Y: strList[1], Z: strList[2] };
                let psNew = new Point3D_CM(ps);  //完成坐标偏移
                let mouse = { x: (psNew.X - 10), y: (psNew.Y + 10) };
                let obj = { ip: vinfo.IPAddress, point: mouse, showname: vinfo.Name, DeviceID: vinfo.DeviceID, ChannelID: vinfo.ChannelID };
                if (videos.length > 1) {
                    let option = videos[1];
                    if (option === 'o') {
                        console.log('打开视频窗体');
                        trackvideo.createVideoDiv(obj);
                    }
                    else if (option === 'c') {
                        console.log('关闭已打开视频窗体');
                        trackvideo.closediv(obj);
                    }
                } else {
                    //兼容老版本                
                    trackvideo.createVideoDiv(obj);
                 
                }
            }
        } catch (err) {
            // alert(err.message);
            layer.msg(err.message, { icon: 4, time: 2000 });
        }
    },
    afterchangefloor: function () {
        // callbackdrawReg = 'rtmap2d.initShow';
        // map2dLayer.loadVideo();//加载摄像机

        callregedit = 'rtmap2d.initShowRegion';
        sys.draw.getRegsCallback('attendRegion', map2dLayer.LoadRtAreaReg);//电子考勤
        sys.draw.getRegsCallback('rollcallRegion', map2dLayer.LoadRtAreaReg); //电子点名
        sys.draw.getRegsCallback('alarmRegion', map2dLayer.LoadRtAreaReg);//电子报警

    },

/********************实时区域报警信息显示************************************************************/

    /////添加低电量报警
    //addlowAlmList(low) {
    //    //o.TagNo + ";" + o.Voltage;
    //    let lowlist = low.split(';');
    //    let tag = null;
    //    let regsType = '低电报警';
    //    let regsName = "";
    //    $.each(TagList, function (i, n) {
    //        if (n.tagCode === lowlist[0])
    //            tag = n;
    //    });
    //    let rtChkTime = new Date(lowlist[1].replace('T', ' ')).Format("yyyy-MM-dd HH:mm:ss");
    //    let almMsg = { id: low, tName: tag.tName, tagNo: tag.tagCode, regType: regsType, regName: regsName, regStart: rtChkTime };
    //    lowT.push(almMsg);
    //},
    ////添加碰撞预警
    //addPzyjAlmList(pzyj) {
    //  //  var strValue = o.TagNo + ";" + o.RtChkTime;
    //    let reglist = pzyj.split(';');
    //    let tag = null;
    //    let regsType = '碰撞预警';
    //    let regsName = "";
    //    $.each(TagList, function (i, n) {
    //        if (n.tagCode === reglist[0])
    //            tag = n;
    //    });
    //    let rtChkTime = new Date(reglist[1].replace('T', ' ')).Format("yyyy-MM-dd HH:mm:ss");
    //    let almMsg = { id: pzyj, tName: tag.tName, tagNo: tag.tagCode, regType: regsType, regName: regsName, regStart: rtChkTime };
    //    pzyjT.push(almMsg);
    //},

    ///添加实时区域显示信息
    addalmlist(reg,type) {
        let regObj = null;
        let regsType = '0';
        let regsName = "";
        let empName = "";
        let reglist = reg.split(';');
        let rtemp = regT.find(o => { o.id === reg; });       
        //reg --> tValue = tag.TagNo + ";" + tag.RtChkTime + ";" + strinout+";"+regId;
        //{ id: '1', tName: '江小白', tagNo: '020-111-222-098', regType: '电子围栏报警', regName: '1号电子围栏', regStart: '2018-03-29 13:00:00' }
  
     
        let tag = null;
        $.each(TagList, function (i, n) {
            if (n.tagCode === reglist[0])
                tag = n;
        });

        if (tag === null)
            return;  

        if (rtemp !== undefined) {
            ////将报警的区域设置为红色
            ////修改区域报警颜色   
            //map2dLayer.setAreaAlmColor(reglist[3], true);
            return;
        }
        let rtChkTime = new Date(reglist[1].replace('T', ' ')).Format("yyyy-MM-dd HH:mm:ss");
        if (type === 'reg') {
            if (reglist.length > 3) {
                regObj = map2dLayer.findRegObj(reglist[3]);
            }
            if (regObj === undefined)
                return;
            regsType = reglist[2].trim();
            regsName = regObj.showname;
            let almMsg = { id: reg, tName: tag.tName, tagNo: tag.tagCode, regType: regsType, regName: regsName, regStart: rtChkTime, regid: reglist[3] };
            regT.push(almMsg);
        } else if (type === 'pzyj') {
            regsType = '碰撞预警';
            let almMsg = { id: reg, tName: tag.tName, tagNo: tag.tagCode, regType: regsType, regName: regsName, regStart: rtChkTime };
            pzyjT.push(almMsg);

        } else if (type === 'low') {
            regsType = '低电报警';
            regsName = map2dLayer.showVolage(reglist[2].trim());
            let almMsg = { id: reg, tName: tag.tName, tagNo: tag.tagCode, regType: regsType, regName: regsName, regStart: rtChkTime };
            lowT.push(almMsg);

        }
        ////修改区域报警颜色   
        //map2dLayer.setAreaAlmColor(reglist[3], true);

    },

    //删除不报警的信息-从缓存中
    delList(lst, obj) {
        let index = -1;
        for (var i = 0; i < lst.length; i++) {
            if (lst[i].id === obj) {
                index = i;
            }
        }
        lst.splice(index, 1); 
       // rtmap2d.reflushRegAlm();
        //$('#' + obj).children("div").remove();
        //$('#' + obj).remove();

    },

    //刷新界面显示实时区域状态
    reflushRegAlm() {
        //1.所有当前区域变取消报警
        //2.更新报警区域
        let allregs = map2dLayer.findRegBusType('alarmRegion');
        allregs.forEach(o => {
            o.material.color.setHex(0x7CFC00); 
        });
        regT.forEach(n => {
            map2dLayer.setAreaAlmColor(n.regid, true);
        });
    },

    onRtRegAlmNew(message) {
        if (message.payloadString !== "") {

            let data = JSON.parse(message.payloadString);
            if (data.length >1)
                return;
            ////首先根据类型进行解析
            ////strvalue:reg:list
            ////strValue:pzyj:list
            ////strValue+":pzyj:add"
            ////strVlaue + ":pzyj:del"
            ////tValue + ":reg:add"
            ////key + ":reg:del"
            ////reg --> tValue = tag.TagNo + ";" + tag.RtChkTime + ";" + strinout+";"+regId;
            ////pzyj -->       var strValue = o.TagNo + ";" + o.RtChkTime;
            ////low --> o.TagNo + ";" + o.Voltage;
        
            let alms = data.AlmMsg.split('$');
            if (alms.length > 2) {
                //reg 实时区域报警
                //pzyj 实时碰撞预警
                //low 低电量报警
                if (alms[1] === 'reg') {
                    if (alms[2] === 'add') {
                        rtmap2d.addalmlist(alms[0],'reg');
                    } else if (alms[2] === 'del') {
                        rtmap2d.delList(regT, alms[0]);
                    } else if (alms[2] === 'list') {
                        regT = [];
                        let regs = alms[0].split('&');
                        regs.forEach(o => {
                            rtmap2d.addalmlist(o,'reg');
                        });
                    }
                } else if (alms[1] === 'pzyj') {
                    if (alms[2] === 'add') {
                        rtmap2d.addalmlist(alms[0],'pzyj');
                    }
                    else if (alms[2] === 'del') {
                        rtmap2d.delList(pzyjT, alms[0]);
                    }
                    else if (alms[2] === 'list') {
                        pzyjT = [];
                        let pzlist = alms[0].split('&');
                        pzlist.forEach(o => {
                            rtmap2d.addalmlist(o,'pzyj');
                        });
                    }
                }
                else if (alms[1] === 'low') {
                    if (alms[2] === 'list') {
                        lowT = [];
                        let lowlist = alms[0].split('&');
                        lowlist.forEach(o => {
                            rtmap2d.addalmlist(o,'low');
                        });
                    }
                }
            }

            //显示在列表中
            rtmap2d.reflushRegAlm();
            almArea = [];
            regT.forEach(o => {
                almArea.push(o);
            });
            pzyjT.forEach(o => {
                almArea.push(o);
            });
            lowT.forEach(o => {
                almArea.push(o);
            });

            if (almArea.length === 0) {
                try {
                    map2dLayer.ShowDivTF('alarmDiv', false);
                    map2dLayer.ShowDivTF('almid', false);
                    var audio = $('#music1');
                    audio[0].pause();
                    //  layer.close(layer.index);
                    isOpen = false;
                } catch (e) {
                    console.log('onRtRegAlmNew() 异常');
                }
            } else {
                //没有设置区域的情况下，显示碰撞报警的信息                    
                rtmap2d.openAlarmPage();
            }
        }
    },

/****************************************************标签离线处理****************************************************************************/

    onRtofflineConnLost: function () {
        console.log(' rpm/offtags mqtt failure!! reStart!!');
        rtmap2d.rtofftags();
    },

    rtofftags: function () {
        let host = mqttConfig.Server;
        let port = mqttConfig.Port;
        let clientId = new Date().getTime().toString(); 
        let user = mqttConfig.UserId; 
        let password = mqttConfig.Password;
        let destination = 'rpm/offtags'; 
        offlinemqttClient = new Messaging.Client(host, Number(port), clientId);
        offlinemqttClient.onConnect = () => { newmqttClient.subscribe(destination); };
        offlinemqttClient.onMessageArrived = rtmap2d.onOffTagsMsg;
        offlinemqttClient.onConnectionLost = rtmap2d.onRtofflineConnLost;
        offlinemqttClient.connect({
            userName: user,
            password: password,
            onSuccess: () => {
                console.log('mqtt connected successFull.');
                offlinemqttClient.subscribe(destination);
            },
            onFailure: () => {
                console.log('mqtt failure  onFailure');
            }
        });
    },

    onOffTagsMsg: function (event) {
        let rtEmpMsg =  event.payloadString;
        let rtList = JSON.parse(rtEmpMsg);

        rtList.forEach((item) => {
           //查询标签配置信息
            let tagInfo = rtmap2d.getTagEmpInfo(item);
            let isHave = map2dLayer.IsExistEmpObj3D(item);
            if (isHave) {
                rtmap2d.setTagListOnLine(item,false);
                //移除图标，实时轨迹线
                map2dLayer.showEmpTrackLine(false, item);
                map2dLayer.clearObjByNameType('emp', item);

                //移除实时人员 设备集合
                let indexObj = rtEmpTags.indexOf(item);
                if (indexObj !== -1) {
                    rtEmpTags.splice(indexObj, 1); 
                    rtmap2d.setRtTagOnLine("pos", ("在线人数：" + rtEmpTags.length));
                }
                indexObj = reDevTags.indexOf(item);
                if (indexObj !== -1) {
                    reDevTags.splice(indexObj, 1);
                    rtmap2d.setRtTagOnLine("device", ("在线设备：" + reDevTags.length));
                }
            }
        });
    },

    setRtTagOnLine(did,title) {
        let lbldevInfo = document.getElementById(did);
        if (lbldevInfo !== undefined) {
            lbldevInfo.innerText = title;
        }
    },

    //rtmap2d.setTagListOnLine
    setTagListOnLine(tagno,ison) {
        $.each(TagList, function (i, tag) {
            if (tag.tagCode === tagno) {
                    if (ison === true) {
                        let first = document.getElementById("rtTagEmpMesList").getElementsByTagName("div")[0];
           
                        if (first !== undefined) {
                            let diva = document.getElementById(tagno);
                            if (first.id !== tagno && diva.className !== 'divonline') {
                                $('#' + tagno).remove();
                                //let playerdiv = document.getElementById(tagno);
                                first.parentNode.insertBefore(diva, first);
                                $('#' + tagno).attr('class', 'divonline');
                            } else {
                                $('#' + tagno).attr('class', 'divonline');
                            }
                        }

                    } else {
                        let last = document.getElementById("rtTagEmpMesList").getElementsByTagName("div");
                        if (last.length > 0) {
                            let lastEle = document.getElementById("rtTagEmpMesList");
                            let newChild = document.getElementById(tagno);
                            $('#' + tagno).remove();
                            lastEle.appendChild(newChild);
                            $('#' + tagno).attr('class', 'diveven2');

                        }
                    }
                TagList[i].online = ison;             
            }
        });
    },
}