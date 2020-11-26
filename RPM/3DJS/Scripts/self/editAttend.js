let ids = [];

editattend = {
    //editattend.saveAttendReg
    LoadMap: function () {
        map2dLayer.LoadThreeScene('map2d');
        regionDraw = 'attendRegion';
        callbackdrawReg = 'editattend.drawReg';
        callregedit = 'editattend.attEdit';
        callbackfun = 'editattend.showAttDept';

        map2dLayer.loadRegsList('attregList', 'attendList_ul', '电子考勤', 'map2d');
        map2dLayer.Refresh();
        map2dLayer.loadEmpDeptTree();
        editattend.initRegDialog();//新增考勤
        editattend.initRevise();//坐标修正
        basicdata.loadTagList();
        callchangefloor = 'editattend.changefloor';
        callbackfloor = 'editattend.showLayerName';
      //  map2dLayer.loadCurLayer('map2d');//图层显示
        setInterval(() => {
            map2dLayer.Refresh();
        }, 60000);
    },
    drawReg: function () {
        let regs = regFloorList[curFloor];
        regs.forEach((o) => {
            if (o.DrawJson !== "" && o.DrawJson.trim() !== "OL") {
                let item = JSON.parse(o.DrawJson);
                //if (!sys.MapData.IsExistObj(obj2DRegion, item.id)) {
                if (!map2dLayer.IsHaveReg(item.id)) {
                    let shape = sys.draw.drawRegByJson(item);
                    map2dLayer.AddObj2DRegion(shape);
                    map2dLayer.addRegUl('attendList_ul', item.id, item.showName);
                    AttendRegList.add(item);
                    //  sys.busi2D.addRollCallReg(item);

                }
            }
        })
    },
    //显示报警人员页面
    initAlarm: function () {

        $('#DialogSelect').html("");
        clientMode.getfile("/RPM/3DJS/attDept.html", function (data) {

            $('#DialogSelect').html(data);
            editattend.initDTreeDiglo();

        });

    },
    showLayerName: function () {
        map2dLayer.loadCurLayer('map2d');//图层显示
    },
    //新增电子考勤
    initRegDialog: function () {
        //var strHtml = "<div id='aaaaa'></div>";
        var strHtml = "<div class='alarm' id='alarm'><div class='tit'  onmousedown='map2dLayer.moveBind(this,event)'><label class='label'>新增电子考勤</label><img src='/RPM/3DJS/Scripts/css/images/x.png' class='img1' id='img1' onclick='editattend.del()' /><div class='line'></div></div><div class='input1'><label class='l'>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称</label><input id='attregNames' type='text' class='p' /></div><div class='input2'><label class='l'>考勤人员</label><input id='empNames'  type='text' role='textbox' data-perid='0' data-perEmps='' data-tprid='0'  class='p' placeholder='请输入人员姓名' /><img src='/RPM/3DJS/Scripts/css/images/s.png' onclick='editattend.openattreg()'/></div><div class='btn'><button id='btnEdit' class='b1' onclick='map2dLayer.showRegPoints()'>坐标修正</button>&nbsp;&nbsp;<button id='btnClose' class='b2' onclick='editattend.indexCloseAttend()'>关闭</button>&nbsp;&nbsp;<button id='btnAdd' class='b2' onclick='editattend.saveAttendReg()'>保存</button></div><label id='lblMessage' style='color:red;margin-left:15px;'> </label><label id='lbMessage' style='color:red;margin-left:15px;'> </label><label id='lMessage' style='color:red;margin-left:15px;'> </label></div>";
        $('#map2d').append(strHtml);
    },

    //坐标修正
    initRevise: function () {
        var strHtml = "<div class='dot'><div class='t' onmousedown='map2dLayer.moveBind(this,event)'><label class='la'>坐标修正</label><img class='img4' src='/RPM/3DJS/Scripts/css/images/x.png' onclick='editattend.delet()' /><div class='line'></div></div><div style='float:left;display:inline-block;margin-top:5px;width:220px;height:179px;border:1px solid rgba(255,255,255, 0.5);border-radius:5px;margin-left:20px; '><select id='regps' multiple name='list1' ondblclick='map2dLayer.selectdblclick()'><option value='a1'></option><option value='a2'></option></select></div><div class='d'><div class='up'><img src='/RPM/3DJS/Scripts/css/images/up.png' onclick='map2dLayer.moveDiffY1()' /></div><div class='middle'><img src='/RPM/3DJS/Scripts/css/images/l.png' onclick='map2dLayer.moveDiffX1()' />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src='/RPM/3DJS/Scripts/css/images/ri.png' onclick='map2dLayer.moveDiffX2()' /></div><div class='down'><img src='/RPM/3DJS/Scripts/css/images/d.png' onclick='map2dLayer.moveDiffY2()' /></div></div><div><label class='lab'>整体位移量</label><select class='s' id='seldiff'><option value='1'>10</option><option value='2'>20</option><option value='3'>30</option><option value='4'>40</option><option value='5'>50</option><option value='6'>60</option><option value='7'>70</option><option value='8'>80</option><option value='9'>90</option><option value='10'>100</option></select></div><div style='margin-left:26px;margin-top:8px;'><label style='color:white;'>X:</label><span style='margin-left:3px;'><button class='but1' onclick='map2dLayer.changeDIffX1()'>-</button><input class='put1' id='txtX' /><button class='but1' onclick='map2dLayer.changeDIffX2()'>+</button><button class='but2' id='btnEdit' onclick='map2dLayer.regPsEdit()'>修改</button></span></div><div style='margin-left:26px;margin-top:8px;'><label style='color:white;'>Y:</label><span  style='margin-left:3px;'><button class='but1' onclick='map2dLayer.changeDIffY1()'>-</button><input class='put1' id='txtY' /><button class='but1' onclick='map2dLayer.changeDIffY2()'>+</button></span></div><div style='margin-left:26px;margin-top:8px;'><label style='color:white;'>Z:</label><span  style='margin-left:3px;'><button class='but1' onclick='map2dLayer.changeDIffXYZ1()'>-</button><input class='put1' id='txtZ' /><button class='but1' onclick='map2dLayer.changeDIffZ2()'>+</button><button class='but2' id='btnEdit' onclick='map2dLayer.regPsSave()'>保存</button></span></div></div>";

        $('#map2d').append(strHtml);
    },
//拖动div
    //moveBind:function (obj,evnt){
    //    //获得元素坐标。
    //    var left = obj.offsetLeft;
    //    var top = obj.offsetTop;
    //    var width = obj.offsetWidth;
    //    var height = obj.offsetHeight;

    //    //计算出鼠标的位置与元素位置的差值。
    //    var cleft = evnt.clientX - left;
    //    var ctop = evnt.clientY - top;

    //    document.onmousemove = function (doc) {
    //        //计算出移动后的坐标。
    //        var moveLeft = doc.clientX - cleft;
    //        var moveTop = doc.clientY - ctop;

    //        //设置成绝对定位，让元素可以移动。
    //        obj.style.position = "absolute";

    //        //当移动位置在范围内时，元素跟随鼠标移动。
    //        obj.style.left = moveLeft + "px";
    //        obj.style.top = moveTop + "px";

    //    }

    //    document.onmouseup = function () {
    //        document.onmousemove = function () { }
    //    }
    //},
    //关闭按钮  
    del: function () {
        var regName = document.getElementById("attregNames").value;
        var sShape = selfShape;
        if (regName === "") {
            if (editReg === "") {
                $('.alarm').hide();
                map2dLayer.removeObj2DRegion(sShape);
            } else {
                $('.alarm').hide();
            }
        } else if (regName !== "") {
            if (editReg === "") {
                if (isSaveReg === false) {
                    $('.alarm').hide();
                    editattend.indexCloseAttend();
                } else {
                    $('.alarm').hide();
                }

            } else if (editReg !== "") {
                $('.alarm').hide();
            }
        }
    },
    dele: function () {
        $('.top1').hide();
        $('.alarm').show();
    },
    delet: function () {
        $('.dot').hide();
        $('.alarm').show();
    },

    /*******************************电子围栏操作**start*****************************/
    attEdit: function (regId) {
        //funcallbackValue3
        let regIds = regId.split('_');
        let shape = map2dLayer.findRegObj(regIds[1]);
        let drawM = map2dLayer.findDrawRegJson(regIds[1], AttendRegList);
        editattend.createAttendEdit(drawM, shape, 'Edit');
    },
    createAttendEdit: function (drawM, shape, action) {
        selfDraw = drawM;
        selfShape = shape;
        editReg = action;
        isSaveReg = false;
        //初始化画图
        document.getElementById("attregNames").value = "";
        document.getElementById("empNames").value = "";
        document.getElementById("lblMessage").style.display = "none";
        document.getElementById("lbMessage").style.display = "none";
        document.getElementById("lMessage").style.display = "none";
        //显示新增考勤弹窗
        $('.alarm').show();
        map2dLayer.setBool(0);

        if (action === "Edit") {
            //电子考勤区域-修改  
            $("#attregNames").val(drawM.showName);
            $("#empNames").val(drawM.EmpNames);
            $("#empNames").data("perid", drawM.TagList);
            attInOutTime = selfDraw.AreaSet;
        }
    },

    saveAttendRegByClose: function (regName, flag, empNames, empIds) {
        selfDraw.showName = regName;
        selfDraw.TagList = "";
        selfDraw.EmpNames = "";

        selfShape.busType = regionDraw;
        selfShape.showname = regName;
        selfShape.EmpNames = empNames;
        selfShape.Empids = empIds;
        selfDraw.TagList = empIds;
        selfDraw.EmpNames = empNames;
        selfDraw.AreaSet = attInOutTime;

        if (editReg === "Edit") {
            AttendRegList.updateObj(selfDraw);
            map2dLayer.updateRegName('la_' + selfDraw.id, regName);
            //sys.busi2D.updateAlarmRegName('la_' + selfDraw.id, regName);

        } else {
            AttendRegList.add(selfDraw);
            // editattend.addAttendReg(selfDraw);
            map2dLayer.addRegUl('attendList_ul', selfDraw.id, regName);
        }
        //  sys.busi2D.saveDrawOneRegion(selfDraw);
        AttendRegList.saveJson(regionDraw);
        basicdata.saveOneRegMode(selfDraw);
        addEdit = false;
        map2dLayer.setBool(0);
        if (empIds !== "" && empIds !== 0)
            basicdata.saveEmpAtt(empIds, selfDraw.id, attInOutTime);
    },
    saveAttendReg: function () {
        var isTrue = true;
        $("#lblMessage").text("");
        $("#lbMessage").text("");
        $("#lMessage").text("");
        var regName = document.getElementById("attregNames").value;
        var empName = document.getElementById("empNames").value;
        if (regName === '') {
            // alert('区域名称不能为空...');
            document.getElementById("lblMessage").style.display = "block";
            $("#lblMessage").text("区域名称不能为空...");
            return false;
        }
        //考勤人员为空
        if (empName === '') {
            document.getElementById("lMessage").style.display = "block";
            $("#lMessage").text("考勤人员不能为空...");
            return false;
        }
        //遍历数组找重命名
        var arr = $("#attendList_ul").find("li");
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
        selfDraw.showName = regName;
        let empNames = document.getElementById("empNames").value;
        let empIds = $("#empNames").data("perid"); // $("#empNames").val
        selfDraw.TagList = empIds;
        selfDraw.EmpNames = empNames;
        selfDraw.AreaSet = attInOutTime;

        selfShape.EmpNames = empNames;
        selfShape.Empids = empIds;
        selfShape.busType = regionDraw;
        selfShape.showname = regName;
        if (editReg === "Edit") {
            AttendRegList.updateObj(selfDraw);
            map2dLayer.updateRegName('la_' + selfDraw.id, regName);


        } else {
            AttendRegList.add(selfDraw);
            map2dLayer.addRegUl('attendList_ul', selfDraw.id, selfDraw.showName);
        }

        AttendRegList.saveJson(regionDraw);
        basicdata.saveOneRegMode(selfDraw);
        map2dLayer.setBool(0);
        // sys.busi2D.saveDrawOneRegion(selfDraw);
        isSaveReg = true;
        addEdit = false;
        //taglist,areaid,attTime
        if (empIds !== "" && empIds !== 0)
            basicdata.saveEmpAtt(empIds, selfDraw.id, attInOutTime);
        return isTrue;
    },

    indexCloseAttend: function () {
        $('.alarm').hide();
        var regName = document.getElementById("attregNames").value;
        var flag = $("#isEndPoint").is(':checked');

        var sDraw = selfDraw;
        var sShape = selfShape;
        let empNames = document.getElementById("empNames").value;
        let empIds = $("#empNames").data("perid");
        if (regName === '') {
            // alert('区域名称不能为空...');
            if (editReg === "")
                map2dLayer.removeObj2DRegion(sShape);
            // obj2DRegion.remove(sShape);

        } else {
            if (isSaveReg === false) {
                if (editReg === "") {
                    layer.msg('是否保存已画区域...', {
                        time: 0 //不自动关闭
                        , btn: ['是', '否']
                        , yes: function (index) {
                            selfDraw = sDraw;
                            selfShape = sShape;

                            editattend.saveAttendRegByClose(regName, flag, empNames, empIds);
                            layer.close(index);
                        }, btn2: function () {
                            map2dLayer.removeObj2DRegion(sShape);
                            //  obj2DRegion.remove(sShape);
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
    /****************电子围栏操作**End********************************** */
    changefloor: function () {
        AttendRegList.clearList();
        map2dLayer.removeULli('attendList_ul');
        callbackdrawReg = 'editattend.drawReg';

        map2dLayer.Refresh();
    },
    openattreg: function () {
        $('.top1').show();
        $('.alarm').hide();
        if (editReg === "Edit") {
            map2dLayer.loadShowEmpInfo(selfShape.name);
        } else {
            map2dLayer.loadShowEmpInfo("");
        }
        // editattend.showAttDept();
    },
    showAttDept: function () {
        editattend.initAlarm();
    },
    initTreeMode: function (deptEmpList) {
        map2dLayer.initSelectOption();
        let tags = $("#empNames").data("perid");
        var taglist = [];
        if (tags !== 0)
            taglist = tags.split(",");

        if (isAttEmp.length > 0) {

            $.each(deptEmpList[0].items, function (j, n) {
                let delList = [];
                $.each(n.children, function (i, item) {
                    let txtLs = item.text.split('&');
                    let empname = txtLs[0].trim();
                    if ($.inArray(item.id, isAttEmp) === -1) {
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
    },
    initDTreeDiglo: function () {
        map2dLayer.initSelectOption();
        map2dLayer.initEmpDeptTree('treeDept');
        let tags = $("#empNames").data("perid");

        var taglist = [];
        if (tags !== 0)
            taglist = tags.split(",");
        var jsonRCallstr = window.localStorage.getItem('deptEmpTree');
        // 还原json对象  
        var deptEmpList = JSON.parse(jsonRCallstr);

        if (isAttEmp.length > 0) {
            //isAttEmp.forEach((o) => {
            //    taglist.push(o);
            //});
            $.each(deptEmpList[0].items, function (j, n) {
                let delList = [];
                $.each(n.children, function (i, item) {
                    let txtLs = item.text.split('&');
                    let empname = txtLs[0].trim();
                    if ($.inArray(item.id, isAttEmp) === -1) {
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

    },
    saveDeptEmp: function () {
        map2dLayer.filtrateRtDept();
        let rulesName = [];
        let rulesId = [];
        if (editReg !== "Edit") {
            addEdit = true;
        }

        ids = [];
        showChkRtEmp.forEach((o) => {
            TagList.forEach((tag) => {
                if (tag.tagCode === o) {
                    rulesName.push(tag.tName);
                    ids.push(tag.guid);
                    rulesId.push(tag.tagCode);
                }
            });
        });
        $("#empNames").val(rulesName.join(","));
        $("#empNames").data("perid", rulesId.join(","));

        attInOutTime = $("#selIn option:selected").text() + "&" + $("#selOut option:selected").text();
        selfDraw.AreaSet = attInOutTime;
        $('.top1').hide();
        $('.alarm').show();
        $("#DialogSelect").html("");
    },
}
