editrollcall = {
    LoadMap: function () {
        map2dLayer.LoadThreeScene('map2d');
        regionDraw = 'rollcallRegion';
        callbackdrawReg = 'editrollcall.drawReg';
        callregedit = 'editrollcall.rollcallEdit';
        map2dLayer.loadRegsList('rollCallList', 'rclist_ul', '电子点名', 'map2d'); 
        map2dLayer.Refresh();
        var perRtMessage = document.getElementById('rollCallList');
        perRtMessage.style.display = 'block';
        editrollcall.initAdd();
        editrollcall.initRevise1();
        callchangefloor = 'editrollcall.changefloor';
        callbackfloor = 'editrollcall.showLayerName';
      //  map2dLayer.loadCurLayer('map2d');//图层显示

        //setInterval(() => {
        //    map2dLayer.Refresh();
        //}, 60000);
    },
    showLayerName: function () {
        map2dLayer.loadCurLayer('map2d');//图层显示
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
                
                    RollCallList.add(item);
                    //map2dLayer.addRegUl(item);
                    map2dLayer.addRegUl('rclist_ul', item.id, item.showName);
                
                }
            }
        })
    },


    /**********************************************************************/
    //关闭新增电子框
    del: function () {
        var regName = document.getElementById("regNames").value;
        var sShape = selfShape;     
            if (regName === "") {
                if (editReg === "") {
                    $('.call').hide();
                    map2dLayer.removeObj2DRegion(sShape);
                } else {
                    $('.call').hide();
                }
            } else if (regName !=="" ) {
                if (editReg === "") {
                    if (!isSaveReg) {
                        $('.call').hide();
                        editrollcall.indexCloseRC();
                    } else {
                        $('.call').hide();               
                    }
                    
                } else if (editReg !== "") {
                    $('.call').hide();
                }
            }
    
    },
    dele: function () {
        $('.dot').hide();
        $('.call').show();
    },
    //新增电子点名界面
    initAdd: function (){
        var strHtml = "<div class='call'><div style='padding-top:10px;'onmousedown='map2dLayer.moveBind(this,event)'><label style='width:131px;height:21px;margin-left:20px;font-size:18px;font-weight:normal;color:rgba(255,255,255,1);'>新增电子点名</label><img src='/RPM/3DJS/Scripts/css/images/x.png' style='margin-left:240px;cursor:pointer;'  onclick='editrollcall.del()'/><div style='width:110px;height:1px;opacity:.5;margin-left:20px;margin-top:8px;background-color:#D5D5D5;overflow:hidden;'></div></div><div style='margin-top:20px;margin-left:20px;'><label style='color:white;'>名称</label><input id='regNames' type='text' style='background-color:white;border:none;color:blank;' /></div><div style='margin-top:20px;margin-left:55px;'><input id='isEndPoint' type='checkbox' style='margin-bottom:6px;' /><label style='color:white;'>集合终点</label></div><div style='margin-top:30px;margin-left:80px;'><button style='width:98px;height:24px;background:rgba(245,245,245,1);border-radius:3px;cursor:pointer;'onclick='map2dLayer.showRegPoints()'>坐标修正</button>&nbsp;&nbsp;<button style='width:73px;height:24px;background:rgba(245,245,245,1);border-radius:3px;cursor:pointer;'onclick='editrollcall.indexCloseRC()'>关闭</button>&nbsp;&nbsp;<button style='width:73px;height:24px;background:rgba(245,245,245,1);border-radius:3px;cursor:pointer;'onclick='editrollcall.saveRegRC()'>保存</button></div><label id='lblMessage' style='color:red;margin-left:15px;'> </label><label id='lbMessage' style='color:red;margin-left:15px;'> </label></div>";
        $('#map2d').append(strHtml);
    },
    //坐标修正界面
    initRevise1: function () {
     
        var strHtml = "<div class='dot'><div class='t'onmousedown='map2dLayer.moveBind(this,event)'><label class='la'>坐标修正</label><img class='img4' src='/RPM/3DJS/Scripts/css/images/x.png' onclick='editrollcall.dele()' /><div class='line'></div></div><div style='float:left;display:inline-block;margin-top:5px;width:220px;height:179px;border:1px solid rgba(255,255,255,.5);border-radius:5px;margin-left:20px; '><select id='regps' multiple name='list1' ondblclick='map2dLayer.selectdblclick()'><option value='a1'></option><option value='a2'></option></select></div><div class='d'><div class='up'><img src='/RPM/3DJS/Scripts/css/images/up.png' onclick='map2dLayer.moveDiffY1()' /></div><div class='middle'><img src='/RPM/3DJS/Scripts/css/images/l.png' onclick='map2dLayer.moveDiffX1()' />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src='/RPM/3DJS/Scripts/css/images/ri.png' onclick='map2dLayer.moveDiffX2()' /></div><div class='down'><img src='/RPM/3DJS/Scripts/css/images/d.png' onclick='map2dLayer.moveDiffY2()' /></div></div><div><label class='lab'>整体位移量</label><select class='s' id='seldiff'><option value='1'>10</option><option value='2'>20</option><option value='3'>30</option><option value='4'>40</option><option value='5'>50</option><option value='6'>60</option><option value='7'>70</option><option value='8'>80</option><option value='9'>90</option><option value='10'>100</option></select></div><div style='margin-left:26px;margin-top:8px;'><label style='color:white;'>X:</label><span style='margin-left:3px;'><button class='but1' onclick='map2dLayer.changeDIffX1()'>-</button><input class='put1' id='txtX' /><button class='but1' onclick='map2dLayer.changeDIffX2()'>+</button><button class='but2' id='btnEdit' onclick='map2dLayer.regPsEdit()'>修改</button></span></div><div style='margin-left:26px;margin-top:8px;'><label style='color:white;'>Y:</label><span  style='margin-left:3px;'><button class='but1' onclick='map2dLayer.changeDIffY1()'>-</button><input class='put1' id='txtY' /><button class='but1' onclick='map2dLayer.changeDIffY2()'>+</button></span></div><div style='margin-left:26px;margin-top:8px;'><label style='color:white;'>Z:</label><span  style='margin-left:3px;'><button class='but1' onclick='map2dLayer.changeDIffXYZ1()'>-</button><input class='put1' id='txtZ' /><button class='but1' onclick='map2dLayer.changeDIffZ2()'>+</button><button class='but2' id='btnEdit' onclick='map2dLayer.regPsSave()'>保存</button></span></div></div>";

        $('#map2d').append(strHtml);
    },
     rollcallEdit: function (regId)
    {
        //funcallbackValue3
        let regIds = regId.split('_');
        let shape = map2dLayer.findRegObj(regIds[1]);
        let drawM = map2dLayer.findDrawRegJson(regIds[1], RollCallList);
        editrollcall.createRCEdit(drawM, shape, 'Edit');
    },

    //editrollcall.createRCEdit
    createRCEdit: function (drawM, shape, action) {
        selfDraw = drawM;
        selfShape = shape;
        editReg = action;
        isSaveReg = false;
        document.getElementById("regNames").value = "";
        document.getElementById("isEndPoint").checked = "";
        document.getElementById("lblMessage").style.display = "none";
        document.getElementById("lbMessage").style.display = "none";
        //新增点名弹窗
        $('.call').show();
        map2dLayer.setBool(0);
           if (action === "Edit") {
  
               document.getElementById("isEndPoint").checked = selfDraw.TagList == "1" ? true : false;
               
               $("#regNames").val(drawM.showName);
            }
    },

    saveRegRCByClose: function (regName, flag) {
        selfDraw.showName = regName;
        selfDraw.TagList = flag === true ? "1" : "0";
        selfDraw.EmpNames = "";


        selfShape.busType = regionDraw;
        selfShape.objType = regionDraw;
        selfShape.showname = regName;
        if (editReg === "Edit") {
            RollCallList.updateObj(selfDraw);
           // sys.busi2D.updateAlarmRegName('la_' + selfDraw.id, regName);
            map2dLayer.updateRegName('la_' + selfDraw.id, regName);

        } else {
            RollCallList.add(selfDraw);
           // sys.busi2D.addRollCallReg(selfDraw);
            map2dLayer.addRegUl('rclist_ul', selfDraw.id, regName);
        }
      //  sys.busi2D.saveDrawOneRegion(selfDraw);
        basicdata.saveOneRegMode(selfDraw);
        map2dLayer.setBool(0);

    },
    saveRegRC: function () {
        var isTrue = true;
        $("#lblMessage").text("");
       $("#lbMessage").text("");
        var regName = document.getElementById("regNames").value;
        if (regName === '') {
            // alert('区域名称不能为空...');
            document.getElementById("lblMessage").style.display="block";
            $("#lblMessage").text("区域名称不能为空...");
            return false;
        }
        //遍历数组找重命名
        //var arr = document.getElementById("rclist_ul").getElementsByTagName("li");
      //  let laid = 'la_' + selfDraw.id;
        var arr = $('#rclist_ul').find('li');
        for (i = 0; i <= arr.length; i++) {
            var text = $(arr[i]).text();
            //if ((regName == text) && (editReg == "")) {
            if ((regName === text)) {
                if (arr[i].id !== selfDraw.id) {
                    document.getElementById("lbMessage").style.display = "block";               
                    $("#lbMessage").text("区域名称不能重复命名...");
                    return false;
                }
            }

        }

        selfDraw.showName = regName;
        var flag = $("#isEndPoint").is(':checked');
        selfDraw.TagList = flag === true ? "1" : "0";
        selfDraw.EmpNames = "";

        // selfShape.EmpNames = empNames;
        selfShape.busType = regionDraw;
        selfShape.objType = regionDraw;
        selfShape.showname = regName;
        if (editReg == "Edit") {
            RollCallList.updateObj(selfDraw);
            //sys.busi2D.updateAlarmRegName('la_' + selfDraw.id, regName);
            map2dLayer.updateRegName('la_' + selfDraw.id, regName);


        } else {
            RollCallList.add(selfDraw);
           // sys.busi2D.addRollCallReg(selfDraw);
            map2dLayer.addRegUl('rclist_ul', selfDraw.id, regName);
        }
        basicdata.saveOneRegMode(selfDraw);
        map2dLayer.setBool(0);
        isSaveReg = true;
  
        // $("#lblMessage").text("保存成功...");
        return isTrue;


    },

    indexCloseRC: function () {
        $('.call').hide();
        var regName = document.getElementById("regNames").value;
        var flag = $("#isEndPoint").is(':checked');

        var sDraw = selfDraw;
        var sShape = selfShape;

        if (regName === '') {
            // alert('区域名称不能为空...');
            if (editReg === "")
                map2dLayer.removeObj2DRegion(sShape);

        } else {
            if (!isSaveReg) {
                if (editReg === "") {
                    layer.msg('是否保存已画区域...', {
                        time: 0 //不自动关闭
                        , btn: ['是', '否']
                        , yes: function (index) {
                            selfDraw = sDraw;
                            selfShape = sShape;
                            editrollcall.saveRegRCByClose(regName, flag);
                            layer.close(index);
                        }, btn2: function () {
                            map2dLayer.removeObj2DRegion(sShape);
                            layer.close();
                        }
                    });
                }
            }
        }
        isSaveReg = false;
        editReg = "";
        //$("#formEditDialog").dialog("destroy");
        $("#formEditDialog").html("");
    },
    changefloor: function ()
    {
        RollCallList.clearList();
        map2dLayer.removeULli('rclist_ul');
        callbackdrawReg = 'editrollcall.drawReg';
        map2dLayer.Refresh();
    },
}