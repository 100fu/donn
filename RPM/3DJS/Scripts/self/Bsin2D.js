var oldRegType = '';
var selfDraw = undefined;
var selfShape = undefined;
var editReg = "";
var isSaveReg = false;
var isIn = true;
//var httpClient = new System.Net.HttpClient();
sys.busi2D = {
    addRegEmpAlarm: function (obj) {
        var objId = obj.id + '_' + new Date().getTime();
        var showDialog = sys.busi2D.createRegEmpDialog('电子点名-人员设置', objId, function (text) {
            layer.msg('选中图层' + text, { icon: 0, time: 3000 });
            // drawM.showName = text;
            //RollCallList.add(drawM);
            //sys.busi2D.addRollCallReg(drawM);
            isdraw = true;
        });
        showDialog.show();
        // BDZFunction.autoComplete($('regEmp_' + obj.id), "/Graphic/GetEmpTagList", true); //GetChkTagPerson
        BDZFunction.autoComplete($("#regEmp_" + obj.id), "/Graphic/GetEmpTagList?random=" + new Date().getTime(), true);
        // document.getElementById('regEmp_' + obj.name).value = "123";
    },
    //添加区域缓存
    addDrawRegion: function (drawM, shape) {
        ////alarmRegion-报警区域设，rollcallRegion-点名区域
        if (regionDraw == 'alarmRegion') {
            sys.busi2D.createRegEdit(drawM, shape, '');
        } else if (regionDraw == 'rollcallRegion') {
            sys.busi2D.createRollcallEdit(drawM, shape, '');
        }
        
    },


    saveDrawOneRegion: function (drawReg) {
        if (regionDraw == 'alarmRegion') {
            GraphList.saveJson(regionDraw);
        } else if (regionDraw == 'rollcallRegion') {
            RollCallList.saveJson(regionDraw);

        }
      //  map2DFun.saveOneReg(drawReg);
        basicdata.saveOneRegMode(drawReg);
    },

    //保存区域缓存
    saveDrawRegion: function () {
        if (regionDraw == 'alarmRegion') {
            GraphList.saveJson(regionDraw);
            var listObj = GraphList.getList();
            //  map2DFun.saveRegWL();
            if (listObj.length > 0)
                map2DFun.saveAlarmReg(listObj);
        } else if (regionDraw == 'rollcallRegion') {
            RollCallList.saveJson(regionDraw);
            //   map2DFun.saveRegDM();  //保存json
            var listObj = RollCallList.getList();
            if (listObj.length > 0)
                map2DFun.saveAlarmReg(listObj);

        }
    },
    ///保存电子围栏区域信息
    saveRegsWL: function (regionDraw) {
        GraphList.saveJson(regionDraw);
        var listObj = GraphList.getList();
        //  map2DFun.saveRegWL();
        if (listObj.length > 0)
            map2DFun.saveAlarmReg(listObj);
    },
    //删除区域缓存
    removeDrawRegion: function (objSelected) {

        if (objSelected == undefined) {
            layer.msg('请选中要删除的区域...', { icon: 5, time: 3000 });
            return;
        }
        if (objSelected.busType != regionDraw) {
            var strMesg = "请选中电子围栏菜单中的按钮进行删除操作...";
            if (regionDraw == 'alarmRegion') {
                strMesg = "请选中电子点名菜单中的按钮进行删除操作...";
            }
            layer.msg(strMesg, { icon: 5, time: 3000 });
            return;
        }
        if (regionDraw == 'alarmRegion') {
            GraphList.removeByName(objSelected.name);
            //保存缓存中的区域信息
            GraphList.saveJson(regionDraw);
            //  $('#alarmList_ul>li[id="' + objSelected.name + '"]').remove();

            //sys.busi2D.getElemt('alarmList_ul').removeChild(sys.busi2D.getElemt(objSelected.name)); 
            // 保存json文件到本地
            //  map2DFun.saveRegWL();

        }
        else if (regionDraw == 'rollcallRegion') {
            RollCallList.removeByName(objSelected.name);
            RollCallList.saveJson(regionDraw);

        } else if (regionDraw == 'attendRegion') {
            AttendRegList.removeByName(objSelected.name);
            AttendRegList.saveJson(regionDraw);
        }
        //删除数据库中的区域信息 
        basicdata.delRegInfo(regionDraw, objSelected.name);

    },

    getElemt: function (id) {
        var obj = document.getElementById(id);
        return obj;
    },
    RemoveObj: function (obj) {
        if (obj != null) {
            if (obj.length >= 1) {
                $.each(obj, function (i, pt) {
                    scene2D.remove(pt);
                });
            }
            else {
                scene2D.remove(obj);
            }
        }

        // render();
    },

    drawToolShow: function () {

        //隐藏考勤管理
        var sysList = document.getElementById('sys_list');
        sysList.style.display = 'none';

        var perRtMessage = document.getElementById('toolbar');
        if (window.getComputedStyle(perRtMessage).getPropertyValue('display') == 'none') {
            perRtMessage.style.display = 'block';

        } else if (window.getComputedStyle(perRtMessage).getPropertyValue('display') == 'block') {
            if (oldRegType != '' && oldRegType != regionDraw) {
                if (oldRegType == 'alarmRegion')
                    sys.busi2D.showRegList('alarmRegList');
                else if (oldRegType == 'rollcallRegion')
                    sys.busi2D.showRegList('rollCallList');
                oldRegType = regionDraw;

                return;
            }
            perRtMessage.style.display = 'none';

        }
        oldRegType = regionDraw;
    },



    setBool: function (index) {
        currentDrawing = 0;
        isdrawCir = isdrawLine = isdrawRec = isdrawPolygon = isdraw = false;
        document.getElementById('polygon').src = fileParam.getImg('polygon_off.png', 'toolbar');
        document.getElementById('rectangle').src = fileParam.getImg('rectangle_off.png', 'toolbar');
        document.getElementById('circle').src = fileParam.getImg('circle_off.png', 'toolbar');
        //document.getElementById('line').src = fileParam.getImg('line_off.png', 'toolbar');

        if (index == 0) {
            controls.enableRotate = true;
        } else {
            controls.enableRotate = false;
        }
        switch (index) {
            case 1:  //多边
                isdraw = isdrawPolygon = true;
                break;
            case 2://矩形
                isdraw = isdrawRec = true;
                break;
            case 3:  //圆形
                isdraw = isdrawCir = true;
                break;
            case 4://折线
                isdraw = isdrawLine = true;
                break;
        }
    },

    clearSelectObj: function () {
        if (objSelected !== undefined) {
            objSelected.material.transparent = true;
            objSelected.material.opacity = 0.5;
        }
        objSelected = undefined;
    },

    loadToolbit: function () {
        var buttons = [
            {
                label: 'home', id: 'cursor', icon: 'cursor.png', clickFun: function () {
                    sys.busi2D.setBool(0);
                    sys.busi2D.clearSelectObj();
                }
            },
            {
                label: '多边形', id: 'polygon', icon: 'polygon_off.png', clickFun: function () {
                    if (isdrawPolygon) {
                        sys.busi2D.setBool(0);
                        document.getElementById('polygon').src = fileParam.getImg('polygon_off.png', 'toolbar');
                    } else {
                        sys.busi2D.setBool(1);
                        document.getElementById('polygon').src = fileParam.getImg('polygon_on.png', 'toolbar');

                    }
                }
            },
            {
                label: '矩形', id: 'rectangle', icon: 'rectangle_off.png', clickFun: function () {
                    if (isdrawRec) {
                        sys.busi2D.setBool(0);
                        document.getElementById('rectangle').src = fileParam.getImg('rectangle_off.png', 'toolbar');
                    } else {
                        sys.busi2D.setBool(2);
                        document.getElementById('rectangle').src = fileParam.getImg('rectangle_on.png', 'toolbar');

                    }
                }
            },
            {
                label: '圆形', id: 'circle', icon: 'circle_off.png', clickFun: function () {
                    if (isdrawCir) {
                        sys.busi2D.setBool(0);
                        document.getElementById('circle').src = fileParam.getImg('circle_off.png', 'toolbar');
                    } else {
                        sys.busi2D.setBool(3);
                        document.getElementById('circle').src = fileParam.getImg('circle_on.png', 'toolbar');

                    }
                }
            },
            //{
            //    label: '折线', id: 'line', icon: 'line_off.png', clickFun: function () {
            //        if (isdrawLine) {
            //            sys.busi2D.setBool(0);
            //            document.getElementById('line').src = fileParam.getImg('line_off.png', 'toolbar');
            //        } else {
            //            sys.busi2D.setBool(4);
            //            document.getElementById('line').src = fileParam.getImg('line_on.png', 'toolbar');
            //        }
            //    }
            //},
            //{
            //    label: '保存', id: 'saveBtn', icon: 'save1.png', clickFun: function () {
            //        sys.busi2D.setBool(0);
            //        sys.busi2D.saveDrawRegion();
            //       // layer.msg('保存成功!', { icon: 6, time: 3000 });

            //    }
            //},
            {
                label: '删除', id: 'removeBtn', icon: 'remove.png', clickFun: function () {
                    sys.busi2D.setBool(0);
                    if (objSelected !== undefined) {
                        //从 obj2DRegion 对象删除                     
                        //从scene中删除


                        ////更新缓存
                        //obj2DRegion.remove(objSelected);
                        sys.busi2D.removeDrawRegion(objSelected);
                        //sys.busi2D.RemoveObj(objSelected);
                        //sys.busi2D.saveDrawRegion();
                        //sys.busi2D.clearSelectObj();
                        //alert('删除成功...');
                    } else {
                        layer.msg('请选中要删除的区域...', { icon: 6, time: 3000 });
                    }
                }
            }


        ];
        sys.busi2D.setupToolbar(buttons);
    },

    setupToolbar: function (buttons) {

        var count = buttons.length;
        var step = 38;
        var div = document.createElement('div');
        div.setAttribute('id', 'toolbar');
        //  div.style.display = 'block';
        div.style.display = 'none';
        div.style.position = 'absolute';
        div.style.left = '100px';
        div.style.top = '10px';
        // div.style.height = (count * step + 8) + 'px';
        // div.style.width = '32px';
        div.style.width = (count * step + 8) + 'px';
        div.style.height = '32px';

        div.style.background = 'rgba(255,255,255,0.75)';
        div.style['border-radius'] = '5px';

        // $(".header").mouseover(function (){  
        //     $(".content").show();  
        // }).mouseout(function (){  
        //     $(".content").hide();  
        // });  
        div.onmouseover = function () {
            //    console.log('移入 isdraw=' + isdraw);
            if (isdraw == true)
                currentDrawing = 1;
            else
                currentDrawing = 0;

            isdraw = false;
        };
        div.onmouseout = function () {
            //   console.log('移出 isdraw=' + isdraw);
            if (currentDrawing == 1) {
                isdraw = true;
            }
        };

        $('#map2d').append($(div));
        for (var i = 0; i < count; i++) {
            var button = buttons[i];
            var icon = button.icon;
            var img = document.createElement('img');
            img.id = button.id;
            img.style.position = 'absolute';

            // img.style.top = (10 + (i * step)) + 'px';
            // img.style.left = '4px';
            img.style.left = (10 + (i * step)) + 'px';
            img.style.top = '4px';
            img.style['pointer-events'] = 'auto';
            img.style['cursor'] = 'pointer';
            img.setAttribute('src', fileParam.getImg(icon, 'toolbar'));
            img.style.width = '24px';
            img.style.height = '24px';
            img.setAttribute('title', button.label);

            img.onclick = button.clickFun;
            div.appendChild(img);
            //div.appendChild(twoTool);
            // $("#tMode_pageLength").html(pageLength);
        }

    },
    //添加一级菜单
    loadBox: function () {
        var div = document.createElement('div');
        div.setAttribute('id', 'demo_box');
        div.style.display = 'block';
        div.style.position = 'absolute';
        div.style.left = '10px';
        div.style.top = '10px';

        //创建span 
        var ospan = document.createElement('span');
        ospan.setAttribute('class', 'pop_ctrl');
        var oi = document.createElement('i');
        oi.setAttribute('class', 'fa fa-bars');
        ospan.appendChild(oi);

        //创建UL
        var oUL = document.createElement('ul');
        oUL.setAttribute('id', 'demo_ul');
        var oLi, divLi, oULi;
        //alarmRegion-报警区域设，rollcallRegion-点名区域
        for (var i = 0; i < 3; i++) {
            //每次给li赋值一个新的对象
            oLi = document.createElement('li');////////
            oLi.setAttribute('class', 'demo_li');
            divLi = document.createElement('div');
            oULi = document.createElement('i');
            divLi.appendChild(oULi);
            oLi.appendChild(divLi);
            divLi = document.createElement('div');
            if (i == 0) {
                oLi.onclick = function () {
                    regionDraw = 'alarmRegion';
                    sys.busi2D.drawToolShow();
                    //sys.busi2D.alarmRegListShow();
                    sys.busi2D.showRegList('alarmRegList');
                }
                oULi.setAttribute('class', 'fa fa-ban');
                divLi.innerHTML = '电子围栏';
            } else if (i == 1) {
                oULi.setAttribute('class', 'fa fa-user');
                oLi.onclick = function () {
                    regionDraw = 'rollcallRegion';
                    sys.busi2D.drawToolShow();
                    sys.busi2D.showRegList('rollCallList');
                }
                divLi.innerHTML = '电子点名';
            } else if (i == 2) {
                oULi.setAttribute('class', 'fa fa-cog');
                oLi.onclick = function () {
                    regionDraw = '';
                    sys.busi2D.setMenuDisplay('sys_list');
                    sys.busi2D.ConfigSetShow();
                }
                divLi.innerHTML = '系统设置';
            }
            oLi.appendChild(divLi);
            oUL.appendChild(oLi);
        }
        div.appendChild(ospan);
        div.appendChild(oUL);
        $('#map2d').append($(div));
        $('#demo_box').popmenu();
    },

    ///设置二级菜单的显示和隐藏情况
    setMenuDisplay: function (titleName) {
        var sysList = document.getElementById('sys_list');
        var aRegList = document.getElementById('alarmRegList');
        var rRegList = document.getElementById('rollCallList');
        if (titleName == 'sys_list') {
            aRegList.style.display = rRegList.style.display = 'none';
        }
    },
    /****************电子点名操作**start********************************** */
    loadRollCallRegList: function () {
        //alarmRegList
        var div = document.createElement('div');
        div.setAttribute('id', 'rollCallList');
        div.setAttribute('class', 'rclist');

        div.onmouseover = function () {
            //    console.log('移入 isdraw=' + isdraw);
            if (isdraw == true)
                currentDrawing = 1;
            else
                currentDrawing = 0;

            isdraw = false;
        };
        div.onmouseout = function () {
            //   console.log('移出 isdraw=' + isdraw);
            if (currentDrawing == 1) {
                isdraw = true;
            }
        };

        //创建UL
        var oUL = document.createElement('ul');
        oUL.setAttribute('id', 'rclist_ul');
        oUL.setAttribute('class', 'list');
        div.appendChild(oUL);
        var uli = document.createElement('li');
        uli.setAttribute('id', '_li0');
        uli.setAttribute('class', 'list_item active');
        //uli.setAttribute('class', 'fa fa-minus-hexagon');
        uli.style = 'border-radius: 10px 10px 0px 0px;';
        var ua = document.createElement('a');
        ua.innerHTML = '电子点名';
        uli.appendChild(ua);
        oUL.appendChild(uli);
        $('#map2d').append($(div));
    },
    showRegList: function (tid) {
        var perRtMessage = document.getElementById(tid);
        if (window.getComputedStyle(perRtMessage).getPropertyValue('display') == 'none') {
            perRtMessage.style.display = 'block';
        } else if (window.getComputedStyle(perRtMessage).getPropertyValue('display') == 'block') {
            perRtMessage.style.display = 'none';
        }
    },
    ///区域列表中添加信息
    addRollCallReg: function (drawM) {

        let rolId = drawM.id;  
        let isHave = false;       
        $("#rclist_ul>li").each(function (index, item) {
            if (item.id == rolId)
            { isHave = true; }
        });
        if (isHave == true)
        {
            return;
        }

        var list = document.getElementById('rclist_ul');


        var li = document.createElement('li');
        li.setAttribute('class', 'list_item');
        li.setAttribute('id', drawM.id);
        var la = document.createElement('a');
        la.innerHTML = drawM.showName;
        la.href = "#"
        la.id = "la_" + drawM.id;

        la.onclick = function (e) {
            var regId = e.target.id;
            //选中区域

            var regIds = regId.split('_');
            //根据regId  找到已经画好的Obj对象
            //根据regId  找到集合中的数据
            //修改json  修改数据库中的信息
            //选中区域
            // alert(regId);

            var shape = sys.busi2D.findDrawReg(regIds[1]);
            var drawM = sys.busi2D.findDrawJson(regIds[1], RollCallList);
            sys.busi2D.createRollcallEdit(drawM, shape, 'Edit');
        }
        li.appendChild(la);
        list.appendChild(li);

    },
    /****************电子点名操作**End********************************** */
    /****************电子围栏操作**start********************************** */
    //加载报警区域列表显示
    loadAlarmRegionList: function () {
        //alarmRegList
        var div = document.createElement('div');
        div.setAttribute('id', 'alarmRegList');
        div.setAttribute('class', 'reglist');

        div.onmouseover = function () {
            //    console.log('移入 isdraw=' + isdraw);
            if (isdraw == true)
                currentDrawing = 1;
            else
                currentDrawing = 0;

            isdraw = false;
        };
        div.onmouseout = function () {
            //   console.log('移出 isdraw=' + isdraw);
            if (currentDrawing == 1) {
                isdraw = true;
            }
        };


        //创建UL
        var oUL = document.createElement('ul');
        oUL.setAttribute('id', 'alarmList_ul');
        oUL.setAttribute('class', 'list');
        div.appendChild(oUL);
        var uli = document.createElement('li');
        uli.setAttribute('id', '_li0');
        uli.setAttribute('class', 'list_item active');
        //uli.setAttribute('class', 'fa fa-minus-hexagon');
        uli.style = 'border-radius: 10px 10px 0px 0px;';
        var ua = document.createElement('a');
        ua.innerHTML = '电子围栏';
        uli.appendChild(ua);
        oUL.appendChild(uli);
        $('#map2d').append($(div));
    },
    alarmRegListShow: function () {
        var perRtMessage = document.getElementById('alarmRegList');
        if (window.getComputedStyle(perRtMessage).getPropertyValue('display') == 'none') {
            perRtMessage.style.display = 'block';

        } else if (window.getComputedStyle(perRtMessage).getPropertyValue('display') == 'block') {
            // if (oldRegType != '' && oldRegType != regionDraw) {
            //     oldRegType = regionDraw;
            //     return;
            // }
            perRtMessage.style.display = 'none';

        }
        // oldRegType = regionDraw;
    },
    ///区域列表中添加信息
    addAlarmReg: function (drawM) {
     

        let rolId = drawM.id;
        let isHave = false;
        $("#alarmList_ul>li").each(function (index, item) {
            if (item.id == rolId)
            { isHave = true; }
        });
        if (isHave == true) {
            return;
        }
        var list = document.getElementById('alarmList_ul');

        var li = document.createElement('li');
        li.setAttribute('class', 'list_item');
        li.setAttribute('id', drawM.id);
        var la = document.createElement('a');
        la.innerHTML = drawM.showName;
        la.href = "#"
        la.id = "la_" + drawM.id;

        la.onclick = function (e) {
            var regId = e.target.id;
            var regIds = regId.split('_');
            //根据regId  找到已经画好的Obj对象
            //根据regId  找到集合中的数据
            //修改json  修改数据库中的信息
            //选中区域
            // alert(regId);

            var shape = sys.busi2D.findDrawReg(regIds[1]);
            var drawM = sys.busi2D.findDrawJson(regIds[1], GraphList);
            //sys.busi2D.createRegEdit(drawM, shape, 'Edit');
            editalm.createRegEdit(drawM, shape, 'Edit');
            //alert("empName:" + regObj.EmpNames + " empIds:" + drawM.TagList);

        }
        li.appendChild(la);
        list.appendChild(li);

    },

    /****************电子围栏操作**End********************************** */

    /****************系统设置**start********************************** */
    loadSysConfigList: function () {
        var div = document.createElement('div');
        div.setAttribute('id', 'sys_list');
        div.setAttribute('class', 'rttableStyle');
        // div.html(sysHtmlMode);
        //div.innerHTML = sysHtmlMode;

        var div1 = document.createElement("div");
        div1.setAttribute('id', 'list_o');
        div1.setAttribute('class', 'rttableStyle1');
        div1.innerHTML = sysHtml;

        //保存div
        var div3 = document.createElement("div");
        div3.setAttribute('id', 'list_s');
        div3.setAttribute('class', 'rttableStyle3');
        div3.innerHTML = sysSave;
        //var divHeight = $("#sys_list").height();
        //var h = ((divHeight - 28) / divHeight)*100;

        var div2 = document.createElement("div");
        div2.setAttribute('id', 'list_e');
        div2.setAttribute('class', 'rttableStyle2');
        div2.innerHTML = sysHtmlMode;
        //div2.style.height = "calc(100% - 28px)";
        div.appendChild(div1);
        div.appendChild(div3);
        div.appendChild(div2);

        // $("#sys_list").html(sysHtmlMode);
        $('#map2d').append($(div));

        // $("#configSetList").html(sysHtmlMode);
        //  map2DFun.loadUpMap();
    },
    labelOnClick: function () {
        var idMapPath = document.getElementById('idmapPath');
        idMapPath.style.display = 'none';  //   div.style.display = 'none';
        var fileValue = document.getElementById('fileMaptype');
        fileValue.style.display = 'block';

        //idmapPath
        //map2d
    },

    ConfigSetShow: function () {
        var perRtMessage = document.getElementById('sys_list');

        if (window.getComputedStyle(perRtMessage).getPropertyValue('display') == 'none') {
            perRtMessage.style.display = 'block';
            map2DFun.loadSysConfig();
            var mags = document.getElementById("message");
            mags.innerHTML = "";

        //} else if (window.getComputedStyle(perRtMessage).getPropertyValue('display') == 'block') {
        //    perRtMessage.style.display = 'none';
        //    //保存修改后的配置
        //    //map2DFun.saveSysConfig();

        }

    },


    /****************系统设置**End********************************** */
    radioChange: function () {
        var item = $("input[name='map']:checked").val();
        var fileVal = document.getElementById("fileMaptype");


        //accept
        if (item == "dxf") {
            fileVal.setAttribute('accept', '.json');
            sysConfig.mapType = 1;
        }
        else if (item == "jpg") {
            fileVal.setAttribute('accept', '.jpg');
            sysConfig.mapType = 2;
        } else if (item == "png") {
            fileVal.setAttribute('accept', '.png');
            sysConfig.mapType = 2;
        }

    },

    ///保存对话框
    createDialog: function (title, ext, callback) {
        var newDialog = new Dialog(title, {
            确定: function () {
                var regName = document.getElementById('regName_' + ext).value;
                // var regName= document.getElementById('regName').value; 
                if (regName == '') {
                    alert('区域名称不能为空...');
                    return;
                }
                if (callback) {
                    callback(regName);
                }
                $(this).dialog("close");
            }

        })
        $('body').append(newDialog);
        newDialog.init();
        newDialog.getView().dialog("option", "width", 470);
        newDialog.getView().dialog("option", "height", 160);
        var innerHTML = "<div id='showInfo'><label class='field'>名称:</label><input id='regName_" + ext + "' type='text' class='input' size='30' /></div>";
        // var innerHTML = "<div id='showInfo'><label class='field'>名称:</label><input id='regName' type='text' class='input' size='30' /></div>";

        newDialog.setData(innerHTML);
        return newDialog;

    },


    /*****************************电子围栏报警*Start*******************************************************************************/
    indexClose: function () {
        var regName = document.getElementById("regNames").value;
        var empNames = document.getElementById("empNames").value;
        var empIds = $("#empNames").data("perid"); // $("#empNames").val

        var empNamesOut = document.getElementById("empOutList").value;
        var empIdsOut = $("#empOutList").data("perid"); // $("#empNames").val

        var almIp = document.getElementById("alminfo").value;
        var almMode = basicdata.getAlarmMode(almIp);
        let almIpPort = "";
        if (almMode != null)
            almIpPort = almMode.IPAddress + ":" + almMode.Port;

        var sDraw = selfDraw;
        var sShape = selfShape;

        if (regName == '') {
            // alert('区域名称不能为空...');
            if (editReg == "")
                obj2DRegion.remove(selfShape);
        } else {
            if (isSaveReg == false) {
                if (editReg == "") {
                    layer.msg('是否保存已画区域...', {
                        time: 0 //不自动关闭
                        , btn: ['是', '否']
                        , yes: function (index) {
                            selfDraw = sDraw;
                            selfShape = sShape;
                            var regMode = { regName: regName, inEmpIds: empIds, inEmpNames: empNames, outEmpIds: empIdsOut, outEmpNames: empNamesOut, almIpPort: almIpPort };
                            sys.busi2D.saveRegByClose(regMode);
                            layer.close(index);
                        }, btn2: function () {
                            obj2DRegion.remove(sShape);
                            layer.close();
                        }
                    });
                }
            }
        }
        isSaveReg = false;
        editReg = "";
        $("#formEditDialog").dialog("destroy");
        $("#formEditDialog").html("");
    },
    showPoint: function (isOper) {
        $("#lblMessage").text("");
        clientMode.getfile("/RPM/3DJS/FindPointList.html", function (data) {
            jQuery("#DialogSelect").html(data);
            sys.busi2D.FindEmpInfo();
            jQuery("#DialogSelect").dialog({
                title: "设置禁止入内人员",
                modal: true,
                autoOpen: true,
                width: 350,
                position: ['center', 50],
                close: function (event, ui) {
                    $("#DialogSelect").dialog("destroy");
                    $("#DialogSelect").html("");
                }
            });
        });
    },

    saveRegByClose: function (regMode) {
        //regName, empIds, empNames
        selfDraw.showName = regMode.regName;
        selfDraw.TagList = regMode.inEmpIds;
        selfDraw.EmpNames = regMode.inEmpNames;
        selfDraw.TagListOut = regMode.outEmpIds;  //empIdsOut;
        selfDraw.EmpNamesOut = regMode.outEmpNames; //empNamesOut;
        selfDraw.AlmIpPort = regMode.almIpPort;

        selfShape.EmpNames = empNames;
        selfShape.busType = regionDraw;
        selfShape.showname = regName;
        selfShape.EmpNamesOut = regMode.outEmpNames;
        selfShape.AlmIpPort = regMode.almIpPort;

        if (editReg == "Edit") {
            GraphList.updateObj(selfDraw);
            sys.busi2D.updateAlarmRegName('la_' + selfDraw.id, regName);
            // sys.busi2D.saveRegsWL('alarmRegion');


        } else {
            GraphList.add(selfDraw);
            sys.busi2D.addAlarmReg(selfDraw);
        }

        sys.busi2D.saveDrawOneRegion(selfDraw);
    },
    saveRegEmp: function () {
        var isTrue = true;
        $("#lblMessage").text("");
        var regName = document.getElementById("regNames").value;
        var empNames = document.getElementById("empNames").value;
        var empIds = $("#empNames").data("perid"); // $("#empNames").val

        var empNamesOut = document.getElementById("empOutList").value;
        var empIdsOut = $("#empOutList").data("perid");

        var almIp = document.getElementById("alminfo").value;
        var almMode = basicdata.getAlarmMode(almIp);
        let almIpPort = "";
        if (almMode != null)
            almIpPort = almMode.IPAddress + ":" + almMode.Port;


        // var regName= document.getElementById('regName').value; 
        if (regName == '') {
            // alert('区域名称不能为空...');
            $("#lblMessage").text("区域名称不能为空...");
            return false;
        }
        if (empNames == "") {
           // $("#lblMessage").text("未设置禁入人员的区域不会触发报警...");
            layer.msg('未设置禁入人员的区域不会触发禁入人员报警...', { icon: 0, time: 3000 });
        }

        if (empNamesOut == "")
        {
            layer.msg('未设置禁出人员的区域不会触发禁出人员报警...', { icon: 0, time: 3000 });
        }

     


        //var regName = document.getElementById("regNames").value;
        //var empIds = $("#empNames").data("perid");
        //var empNames = document.getElementById("empNames").value;
        selfDraw.showName = regName;
        selfDraw.TagList = empIds;
        selfDraw.EmpNames = empNames;
        selfDraw.TagListOut = empIdsOut;
        selfDraw.EmpNamesOut = empNamesOut;
        selfDraw.AlmIpPort = almIpPort;


        selfShape.EmpNames = empNames;
        selfShape.busType = regionDraw;
        selfShape.showname = regName;
        selfShape.EmpNamesOut = empNamesOut;
        selfShape.AlmIpPort = almIpPort;

        if (editReg == "Edit") {
            GraphList.updateObj(selfDraw);
            sys.busi2D.updateAlarmRegName('la_' + selfDraw.id, regName);

         
            

        } else {
            GraphList.add(selfDraw);
            sys.busi2D.addAlarmReg(selfDraw);
        }
        sys.busi2D.saveDrawOneRegion(selfDraw);
        isSaveReg = true;
        return isTrue;
    },

    createRegEdit: function (drawM, shape, action) {
        selfDraw = drawM;
        selfShape = shape;
        isSaveReg = false;
        clientMode.getfile("/RPM/3DJS/RegEdit.html", function (data) {
            jQuery("#formEditDialog").html(data);
            var titleReg = "电子围栏-新增";
            if (action == "Edit") {
                editReg = action;
                //selfDraw.showName = regName;
                //selfDraw.TagList = empIds;
                //selfDraw.EmpNames = empNames;
                titleReg = "电子围栏-修改";

                $("#regNames").val(drawM.showName)
                $("#empNames").val(drawM.EmpNames);
                $("#empNames").data("perid", drawM.TagList);
            }

            jQuery("#formEditDialog").dialog({
                title: titleReg,
                modal: true,
                autoOpen: true,
                width: 450,
                position: ['center', 50],
                close: function (event, ui) {
                    //$("#formEditDialog").dialog("destroy");
                    //$("#formEditDialog").html("");
                    sys.busi2D.indexClose();
                    selfDraw = undefined;
                    selfShape = undefined;
                    editReg = "";
                }
            });
        });
    },
    //查找人员信息
    FindEmpInfo: function () {
        clientMode.post("/Graphic/GetEmpTagList", null, function (data) {
            if (data != null) {
                var option1 = "";
                var option2 = "";
                var isTrue = true;
                $("#ls1").empty();
                $("#ls2").empty();
                var pointId = $("#empNames").data("perid").toString();
                if (editReg == "Edit" || pointId != "0") {
                    // var pointList = $("#pointList").data("perid").split(",");
                    var pointList = [];
                    if (pointId.indexOf(",") >= 0)
                        pointList = pointId.split(",");
                    else
                        pointList.push(pointId.trim());
                    $.each(data, function (i, tag) {
                        isTrue = false;
                        if ($.inArray(tag.PositionTag.Code, pointList) == -1) {
                            option1 += "<option value=" + tag.PositionTag.Code + ">" + tag.Name + "</option>";
                        } else {
                            //option2 += "<option value=" + tag.ID + ">" + tag.Name + "</option>";
                        }

                    });
                    $.each(pointList, function (i, tag) {
                        data.forEach(function (d) {
                            if (d.PositionTag.Code == tag) {
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
        });
    },

    //站点选择和上下移动
    moveOption: function (e1, e2) {
        for (var i = 0; i < e1.options.length; i++) {
            if (e1.options[i].selected) {
                var e = e1.options[i];
                e2.options.add(new Option(e.text, e.value));
                e1.remove(i);
                i = i - 1
            }
        }

    },
    //上移
    moveUp: function (obj) {
        for (var i = 1; i < obj.length; i++) {//最上面的一个不需要移动，所以直接从i=1开始
            if (obj.options[i].selected) {
                if (!obj.options.item(i - 1).selected) {
                    var selText = obj.options[i].text;
                    var selValue = obj.options[i].value;
                    obj.options[i].text = obj.options[i - 1].text;
                    obj.options[i].value = obj.options[i - 1].value;
                    obj.options[i].selected = false;
                    obj.options[i - 1].text = selText;
                    obj.options[i - 1].value = selValue;
                    obj.options[i - 1].selected = true;
                }
            }
        }
    },
    //下移
    moveDown: function (obj) {
        for (var i = obj.length - 2; i >= 0; i--) {//向下移动，最后一个不需要处理，所以直接从倒数第二个开始
            if (obj.options[i].selected) {
                if (!obj.options[i + 1].selected) {
                    var selText = obj.options[i].text;
                    var selValue = obj.options[i].value;
                    obj.options[i].text = obj.options[i + 1].text;
                    obj.options[i].value = obj.options[i + 1].value;
                    obj.options[i].selected = false;
                    obj.options[i + 1].text = selText;
                    obj.options[i + 1].value = selValue;
                    obj.options[i + 1].selected = true;
                }
            }
        }
    },

    setPointList: function () {
        var rulesName = [];
        var rulesId = [];
        $("#ls2 option").each(function () {
            rulesName.push($(this).text());
            rulesId.push($(this).val());
        });

        if (isIn) {
            $("#empNames").val(rulesName.join(","));
            $("#empNames").data("perid", rulesId.join(","));
        } else
        {
            $("#empOutList").val(rulesName.join(","));
            $("#empOutList").data("perid", rulesId.join(","));
        }

        $("#DialogSelect").dialog("destroy");
        $("#DialogSelect").html("");
    },

    findDrawReg: function (regId) {
        var objReg = undefined;
        $.each(obj2DRegion.children, function (i, n) {
            if (n.name == regId) {
                objReg = n;
            }
        });

        return objReg;
    },

    //GraphList
    ///查找画图Json集合
    findDrawJson: function (regId, objList) {
        var regs = objList.getList();
        var drawM = undefined;
        $.each(regs, function (i, n) {
            if (n.id == regId) {
                drawM = n;
            }
        });
        return drawM;
    },
    updateAlarmRegName: function (regId, regName) {
        document.getElementById(regId).innerHTML = regName;
    },


    /*****************************电子围栏报警*End*******************************************************************************/


    /*****************************电子点名区域名称修改*Start*******************************************************************************/
    createRollcallEdit: function (drawM, shape, action) {
        selfDraw = drawM;
        selfShape = shape;
        editReg = action;
        clientMode.getfile("/RPM/3DJS/rollcallRegEdit.html", function (data) {
            jQuery("#formEditDialog").html(data);
            var titleReg = "电子点名-新增";
            if (action == "Edit") {
                //editReg = action;
                document.getElementById("isEndPoint").checked = selfDraw.TagList == "1" ? true : false;
                titleReg = "电子点名-修改";
                $("#regNames").val(drawM.showName);
            }

            jQuery("#formEditDialog").dialog({
                title: titleReg,
                modal: true,
                autoOpen: true,
                width: 450,
                position: ['center', 50],
                close: function (event, ui) {
                    //$("#formEditDialog").dialog("destroy");
                    //$("#formEditDialog").html("");
                    //sys.busi2D.indexCloseRollCall();
                    sys.busi2D.indexCloseRollCall();
                    selfDraw = undefined;
                    selfShape = undefined;
                    editReg = "";
                }
            });
        });
    },

    saveRegRollCallByClose: function (regName, flag) {
        selfDraw.showName = regName;
        selfDraw.TagList = flag == true ? "1" : "0";
        selfDraw.EmpNames = "";


        selfShape.busType = regionDraw;
        selfShape.showname = regName;
        if (editReg == "Edit") {
            RollCallList.updateObj(selfDraw);
            sys.busi2D.updateAlarmRegName('la_' + selfDraw.id, regName);

        } else {
            RollCallList.add(selfDraw);
            sys.busi2D.addRollCallReg(selfDraw);
        }
        sys.busi2D.saveDrawOneRegion(selfDraw);

    },
    saveRegRollCall: function () {
        var isTrue = true;
        $("#lblMessage").text("");
        var regName = document.getElementById("regNames").value;
        if (regName == '') {
            // alert('区域名称不能为空...');
            $("#lblMessage").text("区域名称不能为空...");
            return false;
        }


        selfDraw.showName = regName;
        var flag = $("#isEndPoint").is(':checked');
        selfDraw.TagList = flag == true ? "1" : "0";
        selfDraw.EmpNames = "";

        // selfShape.EmpNames = empNames;
        selfShape.busType = regionDraw;
        selfShape.showname = regName;
        if (editReg == "Edit") {
            RollCallList.updateObj(selfDraw);
            sys.busi2D.updateAlarmRegName('la_' + selfDraw.id, regName);


        } else {
            RollCallList.add(selfDraw);
            sys.busi2D.addRollCallReg(selfDraw);
        }

        sys.busi2D.saveDrawOneRegion(selfDraw);
        isSaveReg = true;

        // $("#lblMessage").text("保存成功...");
        return isTrue;


    },

    indexCloseRollCall: function () {
        var regName = document.getElementById("regNames").value;
        var flag = $("#isEndPoint").is(':checked');

        var sDraw = selfDraw;
        var sShape = selfShape;

        if (regName == '') {
            // alert('区域名称不能为空...');
            if (editReg == "")
                obj2DRegion.remove(sShape);
        } else {
            if (isSaveReg == false) {
                if (editReg == "") {
                    layer.msg('是否保存已画区域...', {
                        time: 0 //不自动关闭
                        , btn: ['是', '否']
                        , yes: function (index) {
                            selfDraw = sDraw;
                            selfShape = sShape;
                            sys.busi2D.saveRegRollCallByClose(regName, flag);
                            layer.close(index);
                        }, btn2: function () {
                            obj2DRegion.remove(sShape);
                            layer.close();
                        }
                    });
                }
            }
        }
        isSaveReg = false;
        editReg = "";
        $("#formEditDialog").dialog("destroy");
        $("#formEditDialog").html("");
    },
    /*****************************电子点名区域名称修改*End*********************************************************************************/
    close: function () {
        //alert(111);
        var sys = document.getElementById("sys_list");
        sys.style.display = "none";
    },
    ysave: function () {
        var mag = document.getElementById("message");
        //修改保存
        map2DFun.saveSysConfig();
        mag.innerHTML = "保存成功";
    }
}