
var oldAlmVideo = "";
editalm = {
    LoadMap: function () {
        map2dLayer.LoadThreeScene('map2d');
        regionDraw = 'alarmRegion';
        callbackdrawReg = 'editalm.drawReg';

        // sys.busi2D.loadAlarmRegionList();//电子围栏右侧列表
        callregedit = 'editalm.almEdit';
        callbackfloor = 'editalm.showLayerName';
        map2dLayer.loadRegsList('alarmRegList', 'alarmList_ul', '电子围栏', 'map2d');
        map2dLayer.Refresh();
        map2dLayer.loadEmpDeptTree();
        editalm.Refresh();

        editalm.initFence();//新增电子围栏界面
        editalm.initRevise();//坐标修正界面
        var perRtMessage = document.getElementById('alarmRegList');
        perRtMessage.style.display = 'block';
        callchangefloor = 'editalm.changefloor';
        //map2dLayer.loadCurLayer('map2d');//图层显示

     
        setInterval(() => {
            editalm.Refresh();
        }, 60000);


    },
    showLayerName: function () {
          map2dLayer.loadCurLayer('map2d');//图层显示
    },
    drawReg: function () {
        let regs = regFloorList[curFloor];
        regs.forEach((o) => {
            //DrawJson
            if (o.DrawJson !== "" && o.DrawJson.trim() !== "OL") {
                let item = JSON.parse(o.DrawJson);

                //if (!sys.MapData.IsExistObj(obj2DRegion, item.id)) {
                if (!map2dLayer.IsHaveReg(item.id)) {
                    let shape = sys.draw.drawRegByJson(item);
                    // sys.MapData.AddObj3DList(shape);
                    map2dLayer.AddObj2DRegion(shape);
                    map2dLayer.addRegUl('alarmList_ul', item.id, item.showName);
                    // sys.busi2D.addAlarmReg(item);
                    GraphList.add(item);
                }
            }
        })
    },
    almEdit: function (regId) {
        let regIds = regId.split('_');
        let shape = map2dLayer.findRegObj(regIds[1]);
        let drawM = map2dLayer.findDrawRegJson(regIds[1], GraphList);
        editalm.createRegEdit(drawM, shape, 'Edit');
        // var drawM = sys.busi2D.findDrawJson(regIds[1], GraphList);
    },

    //显示禁入人员页面
    initpersonin: function () {

        $('#DialogSelect').html("");
        clientMode.getfile("/RPM/3DJS/EmpTree.html", function (data) {

            $('#DialogSelect').html(data);
            let divid = 'emptree';
            editalm.initEmpTreeDiglo(divid);

        });

    },

    //显示禁出人员页面
    initpersonout: function () {

        $('#DialogSelect').html("");
        clientMode.getfile("/RPM/3DJS/EmpTreeOut.html", function (data) {

            $('#DialogSelect').html(data);
            divid = 'treeDept';
            editalm.initEmpTreeDiglo(divid);

        });

    },

    //新增电子围栏
    initFence: function () {
        //  let strHtml = "<div class='fence' style='width:402px;height:314px;background:rgba(56,58,60,1);opacity:0.9;border-radius:5px;color:white;'><div class='tit'onmousedown='map2dLayer.moveBind(this,event)'><label class='label'>新增电子围栏</label><img src='/RPM/3DJS/Scripts/css/images/x.png' class='img1' id='img1' onclick='editalm.del()' /><div class='line'></div></div><div class='dd'><label>区域名称</label><input class='p'  id='regNames' style='margin-bottom:1px;width: 250px' type='text' /></div><div class='ddd'><input id='chkalm' type='checkbox'  onclick='editalm.chkregalm()' />危险区域禁止入内!</div><div class='dd'><label>禁入人员</label><input class='p' id='empNames' placeholder='请输入人员姓名' type='text' data-perid='0' data-perEmps='' data-tprid='0' /><img class='img' id='idImg' src='/RPM/3DJS/Scripts/css/images/s.png' onclick='editalm.showPoint(true)' /></div><div class='dd'><label>禁出人员</label><input class='p' id='empOutList' placeholder='请输入人员姓名' type='text' data-perid='0' data-perEmps='' data-tprid='0' /><img class='img' id='idImgout' src='/RPM/3DJS/Scripts/css/images/s.png' onclick='editalm.showPoint(false)' /></div><div class='dd'><label style='letter-spacing:7px;'>报警器</label><select class='p' id='alminfo' style='width:255px;height:25px;'></select></div><div class='btn'><button class='b1' id='btnEdit' onclick='map2dLayer.showRegPoints()'>坐标修正</button>&nbsp;&nbsp;<button class='b2' id='btnClose' onclick='editalm.indexClose()'>关闭</button>&nbsp;&nbsp;<button class='b2' id='btnAdd' onclick='editalm.saveRegEmp()'>保存</button></div><label id='lblMessage' style='color:red;margin-left:45px;'> </label><label id='lbMessage' style='color:red;margin-left:45px;'> </label></div>";
        let strHtml = "<div class='fence' style='width:402px;height:334px;background:rgba(56,58,60,1);opacity:0.9;border-radius:5px;color:white;'><div class='tit'onmousedown='map2dLayer.moveBind(this,event)'><label class='label'>新增电子围栏</label><img src='/RPM/3DJS/Scripts/css/images/x.png' class='img1' id='img1' onclick='editalm.del()' /><div class='line'></div></div><div class='dd'><label>区域名称</label><input class='p'  id='regNames' style='margin-bottom:1px;width: 250px' type='text' /></div><div class='ddd'><input id='chkalm' type='checkbox'  onclick='editalm.chkregalm()' />危险区域禁止入内!</div><div class='dd'><label>禁入人员</label><input class='p' id='empNames' placeholder='请输入人员姓名' type='text' data-perid='0' data-perEmps='' data-tprid='0' /><img class='img' id='idImg' src='/RPM/3DJS/Scripts/css/images/s.png' onclick='editalm.showPoint(true)' /></div><div class='dd'><label>禁出人员</label><input class='p' id='empOutList' placeholder='请输入人员姓名' type='text' data-perid='0' data-perEmps='' data-tprid='0' /><img class='img' id='idImgout' src='/RPM/3DJS/Scripts/css/images/s.png' onclick='editalm.showPoint(false)' /></div>"
            + "<div class='dd'><label style='letter-spacing:7px;'>报警器</label><select class='p' id='alminfo' style='width:255px;height:25px;'></select></div>"
            + "<div class='dd'><label style='margin-right: 6px;'>报警录像</label><select class='p' id='almvideo' style='width:255px;height:25px;'></select></div>"
            + "<div class='btn'><button class='b1' id='btnEdit' onclick='map2dLayer.showRegPoints()'>坐标修正</button>&nbsp;&nbsp;<button class='b2' id='btnClose' onclick='editalm.indexClose()'>关闭</button>&nbsp;&nbsp;<button class='b2' id='btnAdd' onclick='editalm.saveRegEmp()'>保存</button></div><label id='lblMessage' style='color:red;margin-left:45px;'> </label><label id='lbMessage' style='color:red;margin-left:45px;'> </label></div>";

        $("#map2d").append(strHtml);
    },

    //坐标修正
    initRevise: function () {
        let strHtml = "<div class='dot'><div class='t'onmousedown='map2dLayer.moveBind(this,event)'><label class='la'>坐标修正</label><img class='img4' src='/RPM/3DJS/Scripts/css/images/x.png' onclick='editalm.delet()' /><div class='line'></div></div><div style='float:left;display:inline-block;margin-top:5px;width:220px;height:179px;border:1px solid rgba(255,255,255,.5);border-radius:5px;margin-left:20px; '><select id='regps' multiple name='list1' ondblclick='map2dLayer.selectdblclick()'><option value='a1'></option><option value='a2'></option></select></div><div class='d'><div class='up'><img src='/RPM/3DJS/Scripts/css/images/up.png' onclick='map2dLayer.moveDiffY1()' /></div><div class='middle'><img src='/RPM/3DJS/Scripts/css/images/l.png' onclick='map2dLayer.moveDiffX1()' />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src='/RPM/3DJS/Scripts/css/images/ri.png' onclick='map2dLayer.moveDiffX2()' /></div><div class='down'><img src='/RPM/3DJS/Scripts/css/images/d.png' onclick='map2dLayer.moveDiffY2()' /></div></div><div><label class='lab'>整体位移量</label><select class='s' id='seldiff'><option value='1'>10</option><option value='2'>20</option><option value='3'>30</option><option value='4'>40</option><option value='5'>50</option><option value='6'>60</option><option value='7'>70</option><option value='8'>80</option><option value='9'>90</option><option value='10'>100</option></select></div><div style='margin-left:26px;margin-top:8px;'><label style='color:white;'>X:</label><span style='margin-left:3px;'><button class='but1' onclick='map2dLayer.changeDIffX1()'>-</button><input class='put1' id='txtX' /><button class='but1' onclick='map2dLayer.changeDIffX2()'>+</button><button class='but2' id='btnEdit' onclick='map2dLayer.regPsEdit()'>修改</button></span></div><div style='margin-left:26px;margin-top:8px;'><label style='color:white;'>Y:</label><span  style='margin-left:3px;'><button class='but1' onclick='map2dLayer.changeDIffY1()'>-</button><input class='put1' id='txtY' /><button class='but1' onclick='map2dLayer.changeDIffY2()'>+</button></span></div><div style='margin-left:26px;margin-top:8px;'><label style='color:white;'>Z:</label><span  style='margin-left:3px;'><button class='but1' onclick='map2dLayer.changeDIffXYZ1()'>-</button><input class='put1' id='txtZ' /><button class='but1' onclick='map2dLayer.changeDIffZ2()'>+</button><button class='but2' id='btnEdit' onclick='map2dLayer.regPsSave()'>保存</button></span></div></div>";
        $("#map2d").append(strHtml);
    },
    //关闭电子围栏
    del: function () {
        var regName = document.getElementById("regNames").value;
        var sShape = selfShape;
        //var arr = $("#alarmList_ul").find("li");
        //for (i = 0; i <= arr.length; i++) {
        //    var text = $(arr[i]).text();
        if (regName === "") {
            if (editReg === "") {
                $('.fence').hide();
                map2dLayer.removeObj2DRegion(sShape);
            } else {
                $('.fence').hide();
            }
        } else if (regName !== "") {
            if (editReg === "") {
                if (isSaveReg === false) {
                    $('.fence').hide();
                    editalm.indexClose();
                } else {
                    $('.fence').hide();

                }

            } else {
                $('.fence').hide();
            }
        }
        //      }
    },

    dele: function () {
        $(".top").hide();
        $(".top1").hide();
        $(".fence").show();
    },

    delet: function () {
        $(".dot").hide();
        $(".fence").show();
    },
    createRegEdit: function (drawM, shape, action) {
        selfDraw = drawM;
        selfShape = shape;
        editReg = action;
        isSaveReg = false;
        //初始化画图
        document.getElementById("regNames").value = "";
        document.getElementById("chkalm").checked = "";
        document.getElementById("empNames").value = "";
        document.getElementById("empOutList").value = "";
        document.getElementById("alminfo").value = "";
        document.getElementById("lblMessage").style.display = "none";
        document.getElementById("lbMessage").style.display = "none";
        document.getElementById("almvideo").value = ""; //录像机设置

        $(".fence").show();
        map2dLayer.setBool(0);
        //电子围栏-新增
        if (action === "Edit") {
            //editReg = action;

            //电子围栏-修改
            document.getElementById("chkalm").checked = selfDraw.TagList === "-1" ? true : false;
            if (selfDraw.TagList === "-1") {
                $("#idImg").hide();
                $("#idImgout").hide();
                $("#empOutList").attr("readonly", "readonly");
                $("#empNames").attr("readonly", "readonly");
            } else {
                $("#idImg").show();
                $("#idImgout").show();
                $("#empNames").removeAttr("readonly", "readonly");
                $("#empNames").val(drawM.EmpNames);
                $("#empNames").data("perid", drawM.TagList);

                $("#empOutList").removeAttr("readonly", "readonly");
                $("#empOutList").val(drawM.EmpNamesOut);
                $("#empOutList").data("perid", drawM.TagListOut);
            }
            $("#regNames").val(drawM.showName);

        } else {//新增界面状态
            $("#idImg").show();
            $("#idImgout").show();
            $("#empOutList").removeAttr("readonly", "readonly");
            $("#empNames").removeAttr("readonly", "readonly");
            oldAlmIpPort = "";
        }
        editalm.loadAlmInfoSelect();

        //加载报警区域IP
        editalm.loadAlmVideoSelect();
    },


    saveRegByClose: function (regMode) {
        //regName, empIds, empNames
        let regName = regMode.regName;
        selfDraw.showName = regName;
        selfDraw.TagList = regMode.inEmpIds;
        selfDraw.EmpNames = regMode.inEmpNames;
        selfDraw.TagListOut = regMode.outEmpIds;  //empIdsOut;
        selfDraw.EmpNamesOut = regMode.outEmpNames; //empNamesOut;
        selfDraw.AlmIpPort = regMode.almIpPort;   
        selfDraw.AlmVideoIP = regMode.almVideo;//报警录像摄像机IP设置

        selfShape.EmpNames = regMode.inEmpNames;
        selfShape.busType = regionDraw;
        selfShape.objType = regionDraw;
        selfShape.showname = regName;
        selfShape.EmpNamesOut = regMode.outEmpNames;
        selfShape.AlmIpPort = regMode.almIpPort;
        selfShape.AlmVideoIP = regMode.almVideo;//报警录像摄像机IP设置

        if (editReg === "Edit") {
            GraphList.updateObj(selfDraw);
            map2dLayer.updateRegName('la_' + selfDraw.id, regName);
            // sys.busi2D.saveRegsWL('alarmRegion');


        } else {
            GraphList.add(selfDraw);
            map2dLayer.addRegUl('alarmList_ul', selfDraw.id, regName);
            //sys.busi2D.addAlarmReg(selfDraw);
        }
        basicdata.saveOneRegMode(selfDraw);
        map2dLayer.setBool(0);
        // sys.busi2D.saveDrawOneRegion(selfDraw);
    },
    saveRegEmp: function () {
        var isTrue = true;
        $("#lblMessage").text("");
        $("#lbMessage").text("");
        var regName = document.getElementById("regNames").value;
        var empNames = document.getElementById("empNames").value;
        var empIds = $("#empNames").data("perid"); // $("#empNames").val

        var empNamesOut = document.getElementById("empOutList").value;
        var empIdsOut = $("#empOutList").data("perid");

        var almIp = document.getElementById("alminfo").value;
        var almMode = basicdata.getAlarmMode(almIp);
        let almIpPort = "";
        if (almMode !== null)
            almIpPort = almMode.IPAddress + ":" + almMode.Port;

        let almVideo = document.getElementById("almvideo").value;



        let ischk = document.getElementById("chkalm").checked;
        // var regName= document.getElementById('regName').value; 
        if (regName === '') {
            // alert('区域名称不能为空...');
            document.getElementById("lblMessage").style.display = "block";
            $("#lblMessage").text("区域名称不能为空...");
            return false;
        }
        //遍历数组找重命名
        //var arr = document.getElementById("alarmList_ul").getElementsByTagName("li");
        var arr = $('#alarmList_ul').find('li');
        for (i = 0; i <= arr.length; i++) {
            var text = $(arr[i]).text();
            if ((regName === text)) {
                if (arr[i].id !== selfDraw.id) {
                    document.getElementById("lbMessage").style.display = "block";
                    $("#lbMessage").text("区域名称不能重复命名...");
                    return false;
                }
            }
        }
        if (!ischk) {
            if (empNames === "" || empNamesOut === "") {
                $("#lblMessage").text("禁出或禁入人员未设置不会触发对应的报警....");
                //layer.msg('未设置禁入人员的区域不会触发禁入人员报警...', { icon: 0, time: 3000 });
            }
        }


        selfDraw.showName = regName;
        selfDraw.TagList = empIds;
        selfDraw.EmpNames = empNames;
        selfDraw.TagListOut = empIdsOut;
        selfDraw.EmpNamesOut = empNamesOut;
        selfDraw.AlmIpPort = almIpPort;
        //报警录像摄像机IP设置
        selfDraw.AlmVideoIP = almVideo;


        selfShape.EmpNames = empNames;
        selfShape.busType = regionDraw;
        selfShape.showname = regName;
        selfShape.EmpNamesOut = empNamesOut;
        selfShape.AlmIpPort = almIpPort;

        //报警录像摄像机IP设置
        selfShape.AlmVideoIP = almVideo;


        if (editReg === "Edit") {
            GraphList.updateObj(selfDraw);
            map2dLayer.updateRegName('la_' + selfDraw.id, regName);

        } else {
            GraphList.add(selfDraw);
            // sys.busi2D.addAlarmReg(selfDraw);
            map2dLayer.addRegUl('alarmList_ul', selfDraw.id, regName);
        }
        basicdata.saveOneRegMode(selfDraw);
        map2dLayer.setBool(0);
        //  sys.busi2D.saveDrawOneRegion(selfDraw);
        isSaveReg = true;
        return isTrue;
    },
    indexClose: function () {
        $(".fence").hide();
        var regName = document.getElementById("regNames").value;
        var empNames = document.getElementById("empNames").value;
        var empIds = $("#empNames").data("perid"); // $("#empNames").val

        var empNamesOut = document.getElementById("empOutList").value;
        var empIdsOut = $("#empOutList").data("perid"); // $("#empNames").val

        var almIp = document.getElementById("alminfo").value;
        var almMode = basicdata.getAlarmMode(almIp);
        let almIpPort = "";
        if (almMode !== null)
            almIpPort = almMode.IPAddress + ":" + almMode.Port;
        let almvideoip = document.getElementById("almvideo").value;

        var sDraw = selfDraw;
        var sShape = selfShape;

        if (regName === '') {
            // alert('区域名称不能为空...');
            if (editReg === "")
                map2dLayer.removeObj2DRegion(selfShape);
        } else {
            if (isSaveReg === false) {
                if (editReg === "") {
                    layer.msg('是否保存已画区域...', {
                        time: 0 //不自动关闭
                        , btn: ['是', '否']
                        , yes: function (index) {
                            selfDraw = sDraw;
                            selfShape = sShape;
                            var regMode = { regName: regName, inEmpIds: empIds, inEmpNames: empNames, outEmpIds: empIdsOut, outEmpNames: empNamesOut, almIpPort: almIpPort, almVideo: almvideoip };
                            editalm.saveRegByClose(regMode);
                            layer.close(index);
                        }, btn2: function () {
                            map2dLayer.removeObj2DRegion(sShape);
                            //obj2DRegion.remove(sShape);
                            layer.close();
                        }
                    });
                }
            }
        }
        isSaveReg = false;
        editReg = "";
        // $("#formEditDialog").dialog("destroy");
        $("#formEditDialog").html("");
    },


    showEmpInfo: function () {
        var data = EmpTagList;
        if (data !== null) {
            var option1 = "";
            var option2 = "";
            var isTrue = true;
            $("#ls1").empty();
            $("#ls2").empty();
            var pointId = $("#empNames").data("perid").toString();
            if (isIn === false)
                pointId = $("#empOutList").data("perid").toString();

            if (editReg === "Edit" || pointId !== "0") {
                var pointList = [];
                if (pointId.indexOf(",") >= 0)
                    pointList = pointId.split(",");
                else
                    pointList.push(pointId.trim());
                $.each(data, function (i, tag) {
                    isTrue = false;
                    if ($.inArray(tag.PositionTag.Code, pointList) === -1) {
                        option1 += "<option value=" + tag.PositionTag.Code + ">" + tag.Name + "</option>";
                    } 

                });
                $.each(pointList, function (i, tag) {
                    data.forEach(function (d) {
                        if (d.PositionTag.Code === tag) {
                            option2 += "<option value=" + d.PositionTag.Code + ">" + d.Name + "</option>";
                        }
                    });


                });
                $("#ls1").append(option1);
                $("#ls2").append(option2);
            } else {
                $.each(data, function (i, tag) {
                    //option1 += "<option value=" + tag.TagCode + ">" + tag.TName + "</option>";
                    option1 += "<option value=" + tag.PositionTag.Code + ">" + tag.Name + "</option>";
                });
                $("#ls1").append(option1);
            }
        }
    },
    loadAlmInfoSelect: function () {
        // var tmp = $("#alminfo").val();
        //alminfo     
        $("#alminfo").empty();
        var option1 = "";
        if (editReg === "Edit") {
            oldAlmIpPort = selfDraw.AlmIpPort;
            if (selfDraw.AlmIpPort !== undefined) {
                var ipport = selfDraw.AlmIpPort.split(':');
                option1 += "<option value=" + ipport[0] + ">" + ipport[0] + "</option>";
            }
        }

        option1 += "<option value=''></option>";
        for (var n in almInfoList) {
            var almInfo = almInfoList[n];
            if (almInfo.UseState === 0) {
                option1 += "<option value=" + almInfo.IPAddress + ">" + almInfo.IPAddress + "</option>";
            }

        }
        if (option1 !== "")
            $("#alminfo").append(option1);

        if (editReg === "Edit") {
            $("#alminfo").selectedIndex = 0;
        }

    },

    Refresh: function () {
        //callbackdrawReg = 'editalm.drawReg';
        //sys.draw.getRegsCallback(regionDraw, map2dLayer.LoadAreaReg);
        //  basicdata.loadEmpTagList();//人员基础信息
        basicdata.loadTagList();//人员信息
        basicdata.loadAlarmInfo();//报警器基础信息

        basicdata.loadvideoinfo();//加载基础摄像机
    },
    changefloor: function () {
        GraphList.clearList();
        // $("#alarmList_ul").find("li").remove();
        map2dLayer.removeULli('alarmList_ul');
        callbackdrawReg = 'editalm.drawReg';
        map2dLayer.Refresh();
        //sys.draw.getRegsCallback(regionDraw, map2dLayer.LoadAreaReg);
    },

    showPoint: function (isOper) {
        $(".fence").hide();
        $(".top").show();
        editalm.initpersonin();
        //$("#lblMessage").text("");   
        //let strPath = '/RPM/3DJS/EmpTree.html';
        //let divid = 'emptree';     
        //editalm.initEmpTreeDiglo(divid);
        if (isOper === false) {
            $(".top1").show();
            editalm.initpersonout();
            // strPath = '/RPM/3DJS/EmpTreeOut.html';
            //divid = 'treeDept';
            //editalm.initEmpTreeDiglo(divid);         
        }
        isIn = isOper;

    },
    initEmpTreeDiglo: function (divid) {
        map2dLayer.initEmpDeptTree(divid);
        let taglist = []; //已经勾选人员集合
        let deltag = [];  //排除人员集合
        //empNames
        //empOutList
        let tags = $("#empNames").data("perid");
        let tagsOut = $("#empOutList").data("perid");
        if (isIn === true) //报警区域
        {
            if (tags !== 0)
                taglist = tags.split(",");
            if (tagsOut !== 0) {
                deltag = tagsOut.split(",");
            }
        } else {  //禁止离开报警
            if (tags !== 0)
                deltag = tags.split(",");
            if (tagsOut !== 0) {
                taglist = tagsOut.split(",");
            }
        }
        var jsonRCallstr = window.localStorage.getItem('deptEmpTree');
        // 还原json对象  
        var deptEmpList = JSON.parse(jsonRCallstr);
        if (deltag.length > 0) {
            $.each(deptEmpList[0].items, function (j, n) {
                let delList = [];
                $.each(n.children, function (i, item) {
                    let txtLs = item.text.split('&');
                    let empname = txtLs[0].trim();
                    if ($.inArray(item.id, deltag) !== -1) {
                        delList.push(i);
                    }
                    item.text = empname;
                    deptEmpList[0].items[j].items[i] = item;
                });
                delList.reverse().forEach((index) => {
                    deptEmpList[0].items[j].children.splice(index, 1);
                    deptEmpList[0].items[j].items.splice(index, 1);
                });
            });
        }
        map2dLayer.initEmpDeptData(deptEmpList, taglist, editReg);
        if (isIn === false) {
            map2dLayer.initSelectOption();
        }
    },

    //editalm.saveEmpTree
    saveEmpTree: function () {
        $(".top").hide();
        $(".top1").hide();
        $(".fence").show();
        let checkedIds = deptTreeControl.getCheckedItems().ids;
        let rulesName = [];
        let rulesId = [];
        //if (editReg !== "Edit") {
        //    addEdit = true;
        //}

        ids = [];
        checkedIds.forEach((o) => {
            TagList.forEach((tag) => {
                if (tag.tagCode === o) {
                    rulesName.push(tag.tName);
                    ids.push(tag.guid);
                    rulesId.push(tag.tagCode);
                }
            });
        });
        if (isIn === false) {
            $("#empOutList").val(rulesName.join(","));
            $("#empOutList").data("perid", rulesId.join(","));
            attInOutTime = $("#selIn option:selected").text() + "&" + $("#selOut option:selected").text();
            selfDraw.AreaSet = attInOutTime;
        } else {
            $("#empNames").val(rulesName.join(","));
            $("#empNames").data("perid", rulesId.join(","));
        }
        //attInOutTime = $("#selIn option:selected").text() + "&" + $("#selOut option:selected").text();
        // $("#DialogSelect").dialog("destroy");
        $("#DialogSelect").html("");
    },
    chkregalm: function () {
        let ischk = document.getElementById("chkalm").checked;
        if (ischk === true) {
            $("#empOutList").val("");
            $("#empOutList").attr("readonly", "readonly");
            $("#empNames").attr("readonly", "readonly");
            $("#empOutList").data("perid", "0");
            $("#empNames").val("");

            $("#empNames").data("perid", "-1");
            $("#idImg").hide();
            $("#idImgout").hide();
            //$("#idImg").bind("click", () => {
            //    return false;               
            //});       
            //$("#idImg").attr({ "disabled": "disabled" });
        } else {
            $("#idImg").show();
            $("#idImgout").show();

            $("#empOutList").removeAttr("readonly");
            $("#empNames").removeAttr("readonly");
            //$("#idImg").removeAttr("disabled");//将按钮可用
            //$("#idImg").bind("click", () => {
            //    editalm.showPoint(true);
            //});

        }

    },

    //VideoInfoList[vip];
    loadAlmVideoSelect: function () {
        $("#almvideo").empty();
        let option1 = "";
        if (editReg === "Edit") {
            oldAlmVideo = selfDraw.AlmVideoIP;
            if (selfDraw.AlmVideoIP !== undefined) {
                var ipport = selfDraw.AlmVideoIP.split(':');
                option1 += "<option value=" + ipport[0] + ">" + ipport[0] + "</option>";
            }
        }

        option1 += "<option value=''></option>";
        for (var n in VideoInfoList) {
            //var almInfo = almInfoList[n];
            //if (almInfo.UseState == 0) {
            //    option1 += "<option value=" + almInfo.IPAddress + ">" + almInfo.IPAddress + "</option>";
            //}
            let videoInfo = VideoInfoList[n];
            //if (videoInfo.IPAddress != oldAlmVideo)
            option1 += "<option value=" + videoInfo.IPAddress + ">" + videoInfo.IPAddress + "</option>";
        }
        if (option1 !== "")
            $("#almvideo").append(option1);

        if (editReg === "Edit") {
            $("#almvideo").selectedIndex = 0;
        }

    },

}