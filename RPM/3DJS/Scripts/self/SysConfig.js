
var clientMode = new System.Net.HttpClient();
var AreaSet = undefined; //8:30&18:30
var chkNumSetTime = undefined;
var selStOp = "", selEtOp = "";
let almConfig = {
    SystemType: 1,
    interval: 10,
    safeAngle: 120,
    safeDis: 600,
    trackInt: 1000,
    islight:false
};
///实时视频流读取设置
let gbt28181 = {
    SmsSerial: '34020000002020000001',
    SmsListen: 11935,
    CmsIp: '192.168.8.71',
    CmsPort: 10012

};
///视频联动设置
let trackvs_rpm = {
    SerIp: '127.0.0.1',
    Port: 12500,
    WsIp: '127.0.0.1',
    WsPort: 12510
};

///实时联动设置
let rtAlmOpenSet = {
    IsRttagalm: false,
    IsPZYJAlm: false,
    IsHelpAlm: true,
    IsStaAlm: false,
    IsAreaBjqAlm: false,
    IsLowTagAlm:true
};
///历史在线时长设置
let hisTrackCF = {
    StartTM: '08:00:00',
    EndTM: '17:00:00',
    SleepValue: 180,
    SType: '2',
    EmpEffDis: 30,
    DevEffDis:100
};
///历史报警存入时的最小阈值
let hisAlmCF = {
    HisAlarm: 10,
    HisPatrol: 10,
    HisAttendance: 10,
    SensorAlmInterval: 10,
    IsShowLog: false
};
let exteFun = {
    IsShowHeadMap: false,
    IsShow2DMap: false,
    IsShowEditMap: false  
};
let attFun = {
    StmAtt: '08:00',
    EtmAtt: '17:00',
    SleepVal: 3,
    Interval: 3,
    EarlyStm:60
};

var sysconfig = {
    //    //sysconfig.loadsys()
    loadsys: function () {
        let urlPath = "/Graphic/GetSysConfig";
        //let strJson = { strIp: strIpPort };
        clientMode.post(urlPath, null, (data) => {
            if (data !== null) {
               // almConfig = data;
                sysconfig.showsys(data);
            }
        });
    },
    showsys: function (data) {
     
        almConfig.safeDis = data.SafeDis;
        almConfig.interval = data.Interval;
        almConfig.safeAngle = data.SafeAngle;
        almConfig.islight = data.Islight;

        $('#inputDis').val(almConfig.safeDis);
        $('#inputArc').val(almConfig.safeAngle);
        $('#inputInterval').val(almConfig.interval);
        document.getElementById("chklight").checked = almConfig.islight;
        //      var flag = $("#isEndPoint").is(':checked');
    },
    isValidity: function () {

        let dis = $('#inputDis').val();
        if (dis === "") {
            layer.msg("安全距离不能为空...", { icon: 1, time: 3000 });
            return false;
        }
        if (isNum(dis) === false) {
            layer.msg("安全距离只能输入数字...", { icon: 1, time: 3000 });
            return false;
        }
        let arc = $('#inputArc').val();
        if (arc === "") {
            layer.msg("扫描范围不能为空...", { icon: 1, time: 3000 });
            return false;
        }

        if (isNum(arc) === false) {
            layer.msg("扫描范围只能输入数字..", { icon: 1, time: 3000 });
            return false;
        }
        let inter = $('#inputInterval').val();
        if (inter === "") {
            layer.msg("碰撞预警执行周期不能为空...", { icon: 1, time: 3000 });
            return false;
        }

        let flag = $("#chklight").is(':checked');
        if (almConfig !== undefined) {
            almConfig.safeDis = Number(dis);
            almConfig.safeAngle = Number(arc);
            almConfig.islight = flag;
            almConfig.interval = inter;

      
        }
        return true;
    },
    //sysconfig.save()
    save: function () {
        let flag = sysconfig.isValidity();
        if (flag === false)
            return;
        let urlPath = "/Graphic/SaveAlmConfig";
      //  let strValue = { SystemType: 1, interval: almConfig.Interval, safeAngle: almConfig.SafeAngle, safeDis: almConfig.SafeDis, trackInt: 1000, islight: almConfig.Islight }
        let strJson = { strValue: JSON.stringify(almConfig) };
        clientMode.post(urlPath, strJson, (mes) => {
            console.log(mes);
            basicdata.refrushTask();
            layer.msg("保存成功...", { icon: 6, time: 3000 });
        });
    },
    //sysconfig.refreshTask()
    refreshTask: function () {
        basicdata.refrushTask();
        layer.msg("刷新成功...", { icon: 6, time: 3000 });
    },

    testpatrol: function () {
        let tags = $('#tagNo').val();
        if (tags === "") {
            layer.msg("定位标签不能为空...", { icon: 1, time: 3000 });
            return false;
        }

        let rtpoint = $('#rtpoint').val();

        let urlPath = "/ThreeModel/TestPatrolMsg";
        let strJson = { tagno: tags, strpoint: rtpoint };
        clientMode.post(urlPath, strJson, (mes) => {
            console.log(mes);
            //  basicdata.refrushTask();
            layer.msg("保存成功...", { icon: 6, time: 3000 });
        });

    },
    loadcache: function () {
        //TestLoadCache
        let urlPath = "/ThreeModel/TestLoadCache";

        clientMode.post(urlPath, null, (mes) => {
            console.log(mes);
            //  basicdata.refrushTask();
            layer.msg("重新加载缓存数据...", { icon: 6, time: 3000 });
        });
    },
    testLoadLowerAlm: function () {
        let urlPath = "/ThreeModel/TestLoadLowerAlm";

        clientMode.post(urlPath, null, (mes) => {
            console.log(mes);
            //  basicdata.refrushTask();
            layer.msg("加载低电报警数据...", { icon: 6, time: 3000 });
        });
    },

    savertalm: function () {
        let tags = $('#inputTagNo').val();
        if (tags === "") {
            layer.msg("定位标签不能为空...", { icon: 1, time: 3000 });
            return false;
        }

        let almName = $('#inputAlmName').val();
        if (almName === "") {
            almName = "测试报警点";
        }



        let tagList = tags.split(',');
        let almtype = $('#inputAlmType').val();
        if (almtype === "2") {
            almtype = 2;
        } else {
            almtype = 1;
        }
        let strTime = getNowFormatDate();
        let almList = [];
        tagList.forEach(item => {
            let alm = { tagno: item, alarmtype: almtype, checktime: strTime, alarmname: almName, remark: "" }
            almList.push(alm);
        });

        let urlPath = "/ThreeModel/SaveAlarmMsg";
        let strJson = { strAlarmJson: JSON.stringify(almList) };
        clientMode.post(urlPath, strJson, (mes) => {
            console.log(mes);
            //  basicdata.refrushTask();
            layer.msg("保存成功...", { icon: 6, time: 3000 });
        });

    },
    gethisalm: function () {
        let strdate = $('#inputTagNo').val();
        if (strdate === "") {
            layer.msg("请在定位标签中输入查询日期...", { icon: 1, time: 3000 });
            return false;
        }
        let almtype = $('#inputAlmType').val();
        if (almtype === "2") {
            almtype = 2;
        } else {
            almtype = 1;
        }

        let urlPath = "/ThreeModel/GetAppHisAlarm";
        let strJson = { strDate: strdate, almType: almtype };
        clientMode.post(urlPath, strJson, (mes) => {
            console.log(mes);
            alert(mes);
            //  basicdata.refrushTask();
            // layer.msg("保存成功...", { icon: 6, time: 3000 });
        });
    },
    almdevtest: function () {
        let tagNo = $('#inputTagNo').val();
        let flag = $("#chklight").is(':checked') === true ? 1 : 0;
        let urlPath = "/ThreeModel/TestTagAlm";
        // let strJson = { strAlarmJson: JSON.stringify(almList) };

        let strJson = { tagno: tagNo, istrue: flag }
        clientMode.post(urlPath, strJson, (mes) => {
            console.log(mes);
            //  basicdata.refrushTask();
            layer.msg("已触发报警逻辑...", { icon: 6, time: 3000 });
        });
    },

    testhistrack: function () {
        //histag
        let tagNo = $('#histag').val();
        let strdate = $('#hisdate').val();
        let urlPath = "/ThreeModel/TestHisTrack";
        // TestHisTrack(int usestate, string strdate)



        if (tagNo === "") {
            layer.msg("请输入统计类型: 1-人员，2-车辆", { icon: 1, time: 3000 });
            return false;
        }

        let strJson = { usestate: tagNo, strdate: strdate };
        let stm = new Date();//获取当前时间
        clientMode.post(urlPath, strJson, (mes) => {
            console.log(mes);
            //  basicdata.refrushTask();
            let etm = new Date();//获取当前时间
            let dateDiff = etm.getTime() - stm.getTime();//时间差的毫秒数
            let min = dateDiff / 1000;
            layer.msg("共統計" + mes + "条记录,用时" + min + "秒...", { icon: 6, time: 3000 });
        });
    },

    /**
     * *************************************系统设置***************************************************************
     */
    //sysconfig.loadrpmconfig()
    loadrpmconfig() {
      //  if (Session["username"] === null) {
        //    header("location:login.html");//跳到登录页面
       // }
        //var cokie = Request.Cookies["UserName"];

        //var userName = '@ViewBag.UserName';
        //alert(cokie);
        var getCk = document.cookie;
        if (getCk === undefined || getCk==='') {
            location.assign("/");
        }
        $('.titlehide').parents('.MenuPanel').each(function () {
            $(this).children('.MenuContent').hide();
            $(this).children('.MenuTitle').children('.titlediv').children('.btnhide').hide();
        });

        $('.titlehide').each(function () {
            $(this).click(function () {

                if ($(this).parents('.MenuPanel').children('.MenuContent').css('display') !== 'none') {
                    $(this).parents('.MenuPanel').children('.MenuContent').slideUp();
                    $(this).parents('.titlediv').children('.btnhide').slideUp();
                } else {
                    $(this).parents('.MenuPanel').children('.MenuContent').slideDown();
                    $(this).parents('.titlediv').children('.btnhide').slideDown();
                }
            });

        });

        $('.MenuContent :input').attr("disabled", true);//将input元素设置为disabled 
        sysconfig.loadGBT28181();
        sysconfig.loadTrackvs_rpm();
        sysconfig.loadRtAlmOpenSet();
        sysconfig.loadHisTrackCF();
        sysconfig.loadhisAlmCF();
        sysconfig.loadsys();
        sysconfig.loadExetFun();
        sysconfig.loadAttFun();

    },
    loadAttFun() {
        let urlPath = "/Graphic/GetRpmSysOption";
        let strJson = { strkey: 'AttSet' };
        clientMode.post(urlPath, strJson, function (data) {
            if (data.length > 0) {
                var obj = JSON.parse(data);
                attFun.StmAtt = obj.StmAtt.trim();
                attFun.EtmAtt = obj.EtmAtt.trim();
                attFun.SleepVal = obj.SleepVal;
                attFun.Interval = obj.Interval;
                attFun.EarlyStm = obj.EarlyStm;

                AreaSet = attFun.StmAtt + "&" + attFun.EtmAtt;
                initSelectOption();
                $('#txt_endAttVal').val(attFun.SleepVal);
                $('#txt_runtime').val(attFun.Interval);
                $('#txt_EarlySt').val(attFun.EarlyStm);
            }
        });
    },
    loadGBT28181() {
        //GetRpmSysOption
        let urlPath = "/Graphic/GetRpmSysOption";
        let strJson = { strkey: 'GBT28181' };
        clientMode.post(urlPath, strJson, function (data) {
            if (data.length > 0) {
                var obj = JSON.parse(data);
                gbt28181.SmsSerial = obj.SmsSerial;
                gbt28181.SmsListen = obj.SmsListen;

                gbt28181.CmsIp = obj.CmsIp;
                gbt28181.CmsPort = obj.CmsPort;
                $('#txt_sip').val(obj.SmsSerial);
                $('#txt_livecmsip').val(obj.CmsIp);
                $('#txt_livecmsport').val(obj.CmsPort);
            }
        });
    },

    loadTrackvs_rpm() {
        //GetRpmSysOption
        var urlPath = "/Graphic/GetRpmSysOption";
        var strJson = { strkey: 'VideoTrack' };
        clientMode.post(urlPath, strJson, function (data) {
            if (data.length > 0) {
                var obj = JSON.parse(data);
                trackvs_rpm.SerIp = obj.SerIp;
                trackvs_rpm.Port = obj.Port;

                trackvs_rpm.WsIp = obj.WsIp;
                trackvs_rpm.WsPort = obj.WsPort;

                $('#txt_taskip').val(obj.SerIp);
                $('#txt_taskport').val(obj.Port);
                $('#txt_iisip').val(obj.WsIp);
                $('#txt_iisport').val(obj.WsPort);
            }
        });
    },
    ///设置实时报警联动
    loadExetFun() {
        //GetRpmSysOption
        var urlPath = "/Graphic/GetRpmSysOption";
        var strJson = { strkey: 'ExteFun' };
        clientMode.post(urlPath, strJson, function (data) {
            if (data.length > 0) {
                var obj = JSON.parse(data);
                exteFun.IsShow2DMap = obj.IsShow2DMap;
                exteFun.IsShowHeadMap = obj.IsShowHeadMap;
                exteFun.IsShowEditMap = obj.IsShowEditMap;

                document.getElementById("chk_headmap").checked = exteFun.IsShowHeadMap;     
            }
        });
    },

    ///设置实时报警联动
    loadRtAlmOpenSet() {
        //GetRpmSysOption
        var urlPath = "/Graphic/GetRpmSysOption";
        var strJson = { strkey: 'RtAlmOpenSet' };
        clientMode.post(urlPath, strJson, function (data) {
            if (data.length > 0) {
                var obj = JSON.parse(data);
                rtAlmOpenSet.IsRttagalm = obj.IsRttagalm;
                rtAlmOpenSet.IsPZYJAlm = obj.IsPZYJAlm;
                rtAlmOpenSet.IsHelpAlm = obj.IsHelpAlm;
                rtAlmOpenSet.IsStaAlm = obj.IsStaAlm;
                rtAlmOpenSet.IsAreaBjqAlm = obj.IsAreaBjqAlm;
                rtAlmOpenSet.IsLowTagAlm = obj.isIsLowTagAlm; //低电量报警

                document.getElementById("chk_IsRttagalm").checked = obj.IsRttagalm;
                document.getElementById("chk_IsAreaBjqAlm").checked = obj.IsAreaBjqAlm;
                document.getElementById("chk_IsPZYJAlm").checked = obj.IsPZYJAlm;
                document.getElementById("chk_IsHelpAlm").checked = obj.IsHelpAlm;
                document.getElementById("chk_IsStaAlm").checked = obj.IsStaAlm;
                document.getElementById("chk_IsLowTagAlm").checked = obj.IsLowTagAlm;

            }
        });
    },

    loadHisTrackCF() {

        let selectStr = "";
        selectStr += "<option value='1'>人员</option>";
        selectStr += "<option value='2'>设备</option>";
        selectStr += "<option value='1,2'>人员和设备</option>";
        $("#selectHisType").html(selectStr);
        //GetRpmSysOption
        var urlPath = "/Graphic/GetRpmSysOption";
        var strJson = { strkey: 'HisTrackCf' };
        clientMode.post(urlPath, strJson, function (data) {
            if (data.length > 0) {
                var obj = JSON.parse(data);
                hisTrackCF.StartTM = obj.StartTM;
                hisTrackCF.EndTM = obj.EndTM;

                hisTrackCF.SleepValue = obj.SleepValue;
                hisTrackCF.DevEffDis = obj.DevEffDis;
                hisTrackCF.EmpEffDis = obj.EmpEffDis;
                hisTrackCF.SType = obj.SType;

                $('#txt_stm').val(obj.StartTM);
                $('#txt_etm').val(obj.EndTM);
                $('#txt_sleep').val(obj.SleepValue);
                $('#txt_empeffdis').val(obj.EmpEffDis);
                $('#txt_deveffdis').val(obj.DevEffDis);
                $("#selectHisType option[value='" + obj.SType + "']").attr("selected", true);
            }
        });
    },
    loadhisAlmCF() {
        //GetRpmSysOption
        var urlPath = "/Graphic/GetRpmSysOption";
        var strJson = { strkey: 'HisAlmCf' };
        clientMode.post(urlPath, strJson, function (data) {
            if (data.length > 0) {
                var obj = JSON.parse(data);
                hisAlmCF.HisAlarm = obj.HisAlarm;
                hisAlmCF.HisPatrol = obj.HisPatrol;

                hisAlmCF.HisAttendance = obj.HisAttendance;
                //hisAlmCF.SensorAlmInterval = obj.SensorAlmInterval;

                $('#txt_hispatrol').val(obj.HisPatrol);
                $('#txt_hisalarm').val(obj.HisAlarm);
                $('#txt_hisattendance').val(obj.HisAttendance);
                //$('#txt_sensoralm').val(obj.SensorAlmInterval);
            }
        });
    },

    saveAttSet() {
        //    attInOutTime = $("#selIn option:selected").text() + "&" + $("#selOut option:selected").text();
        let isT = changeTimeOption();
        if (isT) {
            attFun.StmAtt = $("#selIn option:selected").text();
            attFun.EtmAtt = $("#selOut option:selected").text();
            attFun.SleepVal = $('#txt_endAttVal').val().trim();  //txt_runtime
            attFun.Interval = $('#txt_runtime').val().trim();
            attFun.EarlyStm = $('#txt_EarlySt').val().trim();
            sysconfig.saveRpmConfig("AttSet", attFun);
        }
    },
    savegbt28181() {
        let sip = $('#txt_sip').val().trim();
        let cmsip = $('#txt_livecmsip').val().trim();
        let cmsport = $('#txt_livecmsport').val().trim();

        if (sip === "" || cmsip === "" || cmsport === "") {
            layer.msg("输入框均不能为空...", { icon: 6, time: 3000 });
            return;
        }
        if (isChkIP(cmsip) === false) {
            layer.msg("LiveCMS服务器IP格式不正确，eg：192.168.8.1 ", { icon: 6, time: 3000 });
            return;
        }
        if (isInteger(cmsport) === false) {
            layer.msg("服务端口 应为正整数...", { icon: 6, time: 3000 });
            return;
        }

        if (Number(cmsport) > 65535)
        {
            layer.msg("电脑端口最大是65535,请重新设置", { icon: 6, time: 3000 });
            return;
        }

        gbt28181.SmsSerial = sip;
        gbt28181.CmsIp = cmsip;
        gbt28181.CmsPort = Number(cmsport);
        sysconfig.saveRpmConfig("GBT28181", gbt28181);

    },
    savevideovs() {
        let taskip = $('#txt_taskip').val().trim();
        let taskport = $('#txt_taskport').val().trim();
        let iisip = $('#txt_iisip').val().trim();
        let iisport = $('#txt_iisport').val().trim();
        if (taskip === "" || taskport === "" || iisip === "" || iisport === "") {
            layer.msg("输入框均不能为空...", { icon: 6, time: 3000 });
            return;
        }


        if (isChkIP(taskip) === false) {
            layer.msg("联动服务IP格式不正确，eg：192.168.8.1 ", { icon: 6, time: 3000 });
            return;
        }
        if (isInteger(taskport) === false) {
            layer.msg("TaskServer监听端口号 应为正整数...", { icon: 6, time: 3000 });
            return;
        }

        if (Number(taskport) > 65535) {
            layer.msg("电脑端口最大是65535,请重新设置", { icon: 6, time: 3000 });
            return;
        }

        if (isChkIP(iisip) === false) {
            layer.msg("定位平台服务IP格式不正确，eg：192.168.8.1 ", { icon: 6, time: 3000 });
            return;
        }
        if (isInteger(iisport) === false) {
            layer.msg("定位平台监听端口 应为正整数...", { icon: 6, time: 3000 });
            return;
        }

        if (Number(iisport) > 65535) {
            layer.msg("电脑端口最大是65535,请重新设置", { icon: 6, time: 3000 });
            return;
        }

        trackvs_rpm.SerIp = taskip;
        trackvs_rpm.Port = Number(taskport);

        trackvs_rpm.WsIp = iisip;
        trackvs_rpm.WsPort = Number(iisport);
        sysconfig.saveRpmConfig("VideoTrack", trackvs_rpm);

    },
    savertalmopenset() {
        rtAlmOpenSet.IsRttagalm = $("#chk_IsRttagalm").is(":checked");
        rtAlmOpenSet.IsPZYJAlm = $("#chk_IsPZYJAlm").is(":checked");
        rtAlmOpenSet.IsHelpAlm = $("#chk_IsHelpAlm").is(":checked");
        rtAlmOpenSet.IsStaAlm = $("#chk_IsStaAlm").is(":checked");
        rtAlmOpenSet.IsAreaBjqAlm = $("#chk_IsAreaBjqAlm").is(":checked");
        rtAlmOpenSet.IsLowTagAlm = $("#chk_IsLowTagAlm").is(":checked");
        //IsLowTagAlm
        sysconfig.saveRpmConfig("RtAlmOpenSet", rtAlmOpenSet);
    },

    saveextefun() {
        exteFun.IsShowHeadMap = $("#chk_headmap").is(":checked");
        sysconfig.saveRpmConfig("ExteFun", exteFun);
    },

    savehistrackcf() {
        let stm = $('#txt_stm').val().trim();
        let etm = $('#txt_etm').val().trim();
        let sleepvalue = $('#txt_sleep').val().trim();

        let empdis = $('#txt_empeffdis').val().trim();
        let devdis = $('#txt_deveffdis').val().trim();
        
        let histype = $('#selectHisType').val().trim();
        if (stm === "" || etm === "" || sleepvalue === "" || empdis === "" || devdis === "") {
            layer.msg("输入框均不能为空...", { icon: 6, time: 3000 });
            return;
        }

        if (isChkHHmmss(stm) === false) {
            layer.msg("时间格式应为 HH:mm:ss", { icon: 6, time: 3000 });
            return;
        }

        if (isChkHHmmss(etm) === false) {
            layer.msg("时间格式应为 HH:mm:ss", { icon: 6, time: 3000 });
            return;
        }

        if (isInteger(sleepvalue) === false) {
            layer.msg("标签视为休眠阈值 应为正整数...", { icon: 6, time: 3000 });
            return;
        }

        if (Number(sleepvalue) > 600) {
            layer.msg("标签视为休眠阈值取值范围：0-600,请重新设置", { icon: 6, time: 3000 });
            return;
        }
        hisTrackCF.StartTM = stm;
        hisTrackCF.EndTM = etm;

        hisTrackCF.SleepValue = Number(sleepvalue);
        hisTrackCF.DevEffDis = devdis;
        hisTrackCF.EmpEffDis = empdis;
        hisTrackCF.SType = histype;
        sysconfig.saveRpmConfig("HisTrackCf", hisTrackCF);
    },
    savehisalmcf() {
        let hispatrol = $('#txt_hispatrol').val().trim();
        let hisalm = $('#txt_hisalarm').val().trim();
        let hisattendance = $('#txt_hisattendance').val().trim();
        //let sensoralm = $('#txt_sensoralm').val().trim();
        if (hispatrol === "" || hisalm === "" || hisattendance === "") {
            layer.msg("输入框均不能为空...", { icon: 6, time: 3000 });
            return;
        }

        if (isInteger(hispatrol) === false) {
            layer.msg("巡检区域停留最小有效时长 应为正整数...", { icon: 6, time: 3000 });
            return;
        }

        if (Number(hispatrol) > 60) {
            layer.msg("巡检区域停留最小有效时长取值范围：0-60,请重新设置", { icon: 6, time: 3000 });
            return;
        }
        if (isInteger(hisalm) === false) {
            layer.msg("电子围栏报警有效持续时长 应为正整数...", { icon: 6, time: 3000 });
            return;
        }
        if (Number(hisalm) > 60) {
            layer.msg("电子围栏报警有效持续时长取值范围：0-60,请重新设置", { icon: 6, time: 3000 });
            return;
        }
        if (isInteger(hisattendance) === false) {
            layer.msg("电子考勤最小有效持续时长 应为正整数...", { icon: 6, time: 3000 });
            return;
        }
        if (Number(hisattendance) > 60) {
            layer.msg("电子考勤最小有效持续时长取值范围：0-60,请重新设置", { icon: 6, time: 3000 });
            return;
        }

        //if (isInteger(sensoralm) === false) {
        //    layer.msg("基站故障状态阈值 应为正整数...", { icon: 6, time: 3000 });
        //    return;
        //}
        hisAlmCF.HisAlarm = Number(hisalm);
        hisAlmCF.HisPatrol = Number(hispatrol);

        hisAlmCF.HisAttendance = Number(hisattendance);
        //hisAlmCF.SensorAlmInterval = Number(sensoralm);
        sysconfig.saveRpmConfig("HisAlmCf", hisAlmCF);

    },

    saveRpmConfig(key, value) {
        //SaveRPMSysOption(string strkey,string strValue)
        let urlPath = "/Graphic/SaveRPMSysOption";
        let strJson = { strkey: key, strValue: JSON.stringify(value) };
        clientMode.post(urlPath, strJson, (mes) => {
            console.log(mes);
            layer.msg("保存成功...", { icon: 6, time: 3000 });
            sysconfig.refrushTask();
        });
    },
    setbtnhide(divname) {
        if ($('.' + divname).css('display') !== 'none') {
            $('#' + divname + ' input').attr("disabled", true);
            if (divname === 'hisonlineset') {
                $('#selectHisType').attr("disabled", true);
            }
            if (divname === 'attfun') {
                //selOut
                $('#selIn').attr("disabled", true);
                $('#selOut').attr("disabled", true);
            }
            $('#' + divname).html("修改");
            $('.' + divname).slideUp();

        } else {
            $('#' + divname + ' input').attr("disabled", false);
            if (divname === 'hisonlineset') {
                $('#selectHisType').attr("disabled", false);
            }
            if (divname === 'attfun') {
                //selOut
                $('#selIn').attr("disabled", false);
                $('#selOut').attr("disabled", false);
            }
            $('#' + divname).html("取消");
            $('.' + divname).slideDown();
        }
    },
    setdefault(index)
    {
        switch (index)
        {
            case 1:
                hisAlmCF.HisAlarm = 10;
                hisAlmCF.HisPatrol = 10;
                hisAlmCF.HisAttendance =10;

                $('#txt_hispatrol').val(10);
                $('#txt_hisalarm').val(10);
                $('#txt_hisattendance').val(10);
                break;
            case 2:
                hisTrackCF.StartTM = '08:00:00';
                hisTrackCF.EndTM = '17:00:00';
                hisTrackCF.SleepValue = 180;
                hisTrackCF.DevEffDis = 100;
                hisTrackCF.EmpEffDis = 30;
                hisTrackCF.SType = '2';

                $('#txt_stm').val(hisTrackCF.StartTM);
                $('#txt_etm').val(hisTrackCF.EndTM);
                $('#txt_sleep').val(hisTrackCF.SleepValue);
                $('#txt_empeffdis').val(hisTrackCF.EmpEffDis);
                $('#txt_deveffdis').val(hisTrackCF.DevEffDis);
                $("#selectHisType option[value='" + hisTrackCF.SType+"']").attr("selected", true);
                break;
            case 3:
                gbt28181.SmsSerial ='34020000002020000001';
                gbt28181.SmsListen = 11935;
                gbt28181.CmsIp ='192.168.8.71';
                gbt28181.CmsPort = 10012;

                $('#txt_sip').val(gbt28181.SmsSerial);
                $('#txt_livecmsip').val(gbt28181.CmsIp);
                $('#txt_livecmsport').val(gbt28181.CmsPort);
                break;
            case 4:
                trackvs_rpm.SerIp = '127.0.0.1';
                trackvs_rpm.Port = 12500;
                trackvs_rpm.WsIp = '127.0.0.1';
                trackvs_rpm.WsPort = 12510;

                $('#txt_taskip').val(trackvs_rpm.SerIp);
                $('#txt_taskport').val(trackvs_rpm.Port);
                $('#txt_iisip').val(trackvs_rpm.WsIp);
                $('#txt_iisport').val(trackvs_rpm.WsPort);
                break;
            case 5:
               
                rtAlmOpenSet.IsRttagalm = false;
                rtAlmOpenSet.IsPZYJAlm = false;
                rtAlmOpenSet.IsHelpAlm = true;
                rtAlmOpenSet.IsStaAlm = false;
                rtAlmOpenSet.IsAreaBjqAlm = false;
                rtAlmOpenSet.IsLowTagAlm = true;

                document.getElementById("chk_IsRttagalm").checked = rtAlmOpenSet.IsRttagalm;
                document.getElementById("chk_IsAreaBjqAlm").checked = rtAlmOpenSet.IsAreaBjqAlm;
                document.getElementById("chk_IsPZYJAlm").checked = rtAlmOpenSet.IsPZYJAlm;
                document.getElementById("chk_IsHelpAlm").checked = rtAlmOpenSet.IsHelpAlm;
                document.getElementById("chk_IsStaAlm").checked = rtAlmOpenSet.IsStaAlm; //IsLowTagAlm
                document.getElementById("chk_IsLowTagAlm").checked = rtAlmOpenSet.IsLowTagAlm;
                break;
            case 6:
                almConfig.safeDis =600;
                almConfig.interval = 10;
                almConfig.safeAngle = 120;
                almConfig.islight = false;

                $('#inputDis').val(almConfig.safeDis);
                $('#inputArc').val(almConfig.safeAngle);
                $('#inputInterval').val(almConfig.interval);
                document.getElementById("chklight").checked = almConfig.islight;
                break;
            case 7:
                exteFun.IsShow2DMap = false;
                exteFun.IsShowHeadMap = false;
                exteFun.IsShowEditMap = false;  

                document.getElementById("chk_headmap").checked = exteFun.IsShowHeadMap;               
                break;
            case 8:
                attFun.StmAtt = "8:30";
                attFun.EtmAtt = "18:30";
                attFun.SleepVal = 3;
                attFun.Interval = 10;
                AreaSet = "8:30&18:30";
                initSelectOption();
                $('#txt_endAttVal').val(attFun.SleepVal);
                $('#txt_runtime').val(attFun.SleepVal);
                break;
        }
    },

    refrushTask() {
        let urlPath = "/Graphic/RefrushTask";
        //clientMode.post(urlPath, null, function (msg) {
        //    layer.msg("TaskServer 已重启...", { icon: 6, time: 3000 });
        //});
        $.ajax
            ({
                type: "get",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: urlPath,  //这里是网址
                success: function (data) {
                    layer.msg("TaskServer 已自动重启...", { icon: 6, time: 3000 });
                },
                timeout: 1000,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    layer.msg('TaskServer自动重启失败，请手动重启...', { icon: 0, time: 3000 });
                }
            });
    },

    testcreatehisTT() {
        let strdate = $('#hisdate').val();
        let urlPath = "/ThreeModel/TestCreateHisTT";
        let strdateJson = { strdate: strdate };
        clientMode.post(urlPath, strdateJson, function (data) {
            layer.msg("轨迹表创建成功...", { icon: 6, time: 3000 });
        });
    },
    testgethisonline() {
        //(string type, string startTime,string endTime, int state)
        let strdate = $('#hisdate').val();
        let strtype = $('#histag').val();
        let urlPath = "/ThreeModel/GetHisOnDis";
        let strdateJson = { type: strtype, startTime: strdate, endTime: strdate,state:1 };
        clientMode.post(urlPath, strdateJson, function (data) {
            layer.msg(data.length+" 条记录...", { icon: 6, time: 3000 });
        });
    },
}


//判断字符串是否为正整数
function isInteger(num) {
    if (!(/(^[1-9]\d*$)/.test(num))) {

        return false;
    }
    return true;
}
function isChkIP(ip) {
    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;//正则表达式   
    if (re.test(ip)) {
        if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256)
            return true;
    }
    return false;
}

function isChkHHmmss(time) {
    let regex = /^(?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;

    if (!regex.test(time)) {

        let regexs = /^(?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]$/;

        if (!regexs.test(time)) {
            return false;
        }

        // form.time.value = time + ":00";
    }
    return true;
}

/****************时间区间设置********************************************************************/


function changeSelOption() {
    let arr = ['00', '15', '30', '45'];
    let startTime = $("#selIn option:selected").text();
    selStOp = startTime;
    let tlst = startTime.split(':');
    let option = "";

    let index = $.inArray(tlst[1], arr);
    for (var i = index; i < arr.length; i++) {
        strVal = tlst[0] + ":" + arr[i];
        option += "<option value=" + index + ">" + strVal + "</option>";
    }
    option += addOption((Number(tlst[0]) + 1), 24, arr, (arr.length - index));
    $("#selOut").empty();
    $("#selOut").append(option);
    //findselected('selOut', tls[1].trim());
    if (AreaSet !== undefined) {
        let inouttime = AreaSet;
        if (inouttime !== undefined) {
            let tls = inouttime.split('&');
            findselected('selOut', tls[1].trim());
        }
    }
}


function initSelectOption2() {
    let arr = ['00', '15', '30', '45'];
    let intime = addOption(0, 24, arr);
    $("#selIn").append(intime);
    $("#selOut").append(intime);
    if (AreaSet !== undefined) {
        let inouttime = AreaSet;
        if (inouttime !== undefined) {
            let tls = inouttime.split('&');
            let index = findselected('selIn', tls[0].trim());
            changeSelOption();
            findselected('selOut', tls[1].trim());
        }
    }
}
function initSelectOption() {
    //let arr = ['00', '15', '30', '45'];
    //let intime = addOption(0, 24, arr);
    //$("#selIn").append(intime);
    //$("#selOut").append(intime);
    selStOp = "08:00", selEtOp = "17:30";
    if (AreaSet !== undefined) {
        let inouttime = AreaSet;
        if (inouttime !== undefined) {
            let tls = inouttime.split('&');
            selStOp = tls[0].trim();
            selEtOp = tls[1].trim();
            //let index = findselected('selIn', tls[0].trim());
            //changeSelOption();
            //findselected('selOut', tls[1].trim());
        }
    }

    initSelOps();
}


function initSelOps() {
    let arr = ['00', '15', '30', '45'];
    let intime = addOption(0, 24, arr);
   // let index = 0;
    //$("#selIn").empty();
    //$("#selIn").append(intime);
    //$("#selOut").empty();
    //$("#selOut").append(intime);

  // let tls = inouttime.split('&');
    //let index = findselected('selIn', tls[0].trim());
    //  let tlst = startTime.split(':');
   // let tlst = selStOp.split(':');
    let tlst = selEtOp.split(':');
    let option = "";

    let index = $.inArray(tlst[1], arr);

    //整点的时候 不加零
    if (index === 0) {
        option += addOption(0, (Number(tlst[0])), arr, (arr.length - index),true);       
    } else {
        option += addOption(0, (Number(tlst[0])), arr, (arr.length - index));
    }
    if (index !== 0) {
        for (var m = 1; m < index; m++) {
            strVal = tlst[0] + ":" + arr[m];
            option += "<option value=" + index + ">" + strVal + "</option>";
        }
    }
    //  option += addOption((Number(tlst[0]) + 1), 24, arr, (arr.length - index));
    $("#selIn").empty();
    $("#selIn").append(option);
    findselected('selIn', selStOp);
    //结束时间段从开始时间的结束时间 开始
    option = "";
  //  tlst = selEtOp.split(':');
    tlst = selStOp.split(':');
    index = $.inArray(tlst[1], arr);
    if ((index + 1) !== arr.length) {
        for (var i = (index + 1); i < arr.length; i++) {
            strVal = tlst[0] + ":" + arr[i];
            option += "<option value=" + index + ">" + strVal + "</option>";
        }
    }
    option += addOption((Number(tlst[0]) + 1), 24, arr, (arr.length - index));
    $("#selOut").empty();
    $("#selOut").append(option);



    // changeSelOption();
    findselected('selOut', selEtOp);
}


function findselected(id, strVal) {
    let index = 0;
    let selist = document.getElementById(id);
    let txt = "";
    for (var i = 0; i < selist.options.length; i++) {
        txt = selist.options[i];
        if (txt.text === strVal) {
            selist.options[i].selected = true;
            index = i;
        }
    }
    selist.selectedIndex = index;
    return index;
}

function addOption(start, end, arr, index,islast) {
    let option = "";
    let strVal = "";

    if (index === undefined)
        index = 0;
   // let index = index || 0;
    for (var i = start; i < end; i++) {
        arr.forEach((o) => {
            strVal = i + ":" + o;
            option += "<option value=" + index + ">" + strVal + "</option>";
            index++;
        });
    }
    if (end !== 24) {
        if(islast===undefined){
            strVal = end + ":00";
            option += "<option value=" + index + ">" + strVal + "</option>";
        }
    } else {
        strVal = "23:59";
        option += "<option value=" + index + ">" + strVal + "</option>";
    }


    return option;
}

function chknumminmax(obj) {
    if (chkNumSetTime !== undefined) {
        clearInterval(chkNumSetTime);
    }
    chkNumSetTime = setTimeout(function () {
        let min = Number(obj.min);
        let max = Number(obj.max);
        let defvalue = Number($(obj).data("default"));
        let txt = $(obj).data("txt");
        let nowvalue = $(obj).val();
        if (nowvalue === "") {
            return;
        }
        nowvalue = Number(nowvalue);
        //let isT = isInt(nowvalue);
        //let isT1 = isPint4(nowvalue);
        //let isT2 = isPInt(nowvalue);
        if (!isPint4(nowvalue)) {
            layer.msg(txt + " 取值必须为整数", { icon: 1, time: 3000 });
            $(obj).val(defvalue);
            return;
        }

        if (nowvalue < min || nowvalue > max) {
            layer.msg(txt + " 取值范围是" + min + "-" + max + ", 默认值为:" + defvalue, { icon: 1, time: 3000 });
            $(obj).val(defvalue);
        }
    }, 2000);
}

//正整数 不包含0
function isPint4(num) {
    let r = /(^[1-9]\d*$)/;　　//正整数>0
    return r.test(num);
}

function changeSelOp() {
    let arr = ['00', '15', '30', '45'];
    selStOp = $("#selIn option:selected").text();
    selEtOp = $("#selOut option:selected").text();
    initSelOps();

}
function changeTimeOption() {
    let arr = ['00', '15', '30', '45'];
    let startTime = $("#selIn option:selected").text();
    let endTime = $("#selOut option:selected").text();
    let stDt = getTimeByHHmm(startTime);
    let edDt = getTimeByHHmm(endTime);
    let chkmin = getDateDiff(stDt, edDt, 2);
    if (chkmin <= 0) {
        layer.msg(" 考勤结束时间应大于考勤开始时间 ", { icon: 1, time: 3000 });
        return false;
    }
    return true;

}

function getTimeByHHmm(timeStamp) {
    let curDate = new Date();
    curDate.setUTCMinutes(curDate.getUTCMinutes() - 1);
    let year = curDate.getFullYear();
    let month =
        curDate.getMonth() + 1 < 10
            ? "0" + (curDate.getMonth() + 1)
            : curDate.getMonth() + 1;
    let date =
        curDate.getDate() < 10
            ? "0" + curDate.getDate()
            : curDate.getDate();
    let tlst = timeStamp.split(':');
    return year + "-" + month + "-" + date + " " + tlst[0] + ":" + tlst[1] + ":00" ;

};

//window.onload = function () {
//    // 获取main的div元素
//    let selST = document.getElementById("selIn");
//    let selET = document.getElementById("selOut");
//    //resize.onmousedown = function (e) {
//    selST.onchange = function (e) {
//        changeSelOption();
//       let startTime = $("#selIn option:selected").text();
//        findselected('selOut', startTime);
//    };
//    selET.onchange = function (e) {
//        alert('111');
//    };

//};