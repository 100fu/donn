



var map2DFun = {
    loadUpMap: function () {

        //map2DFun.loadEmpIconName();
        //map2DFun.loadDevIconName();
        map2DFun.loadSysConfig();

        map2DFun.loadUpEmp();
        map2DFun.loadUpDev();


    },


    fileChange: function () {
        // alert("关闭");
        var file = document.getElementById('btnfile');
        if (file.name != '') {
            $("#fm1").ajaxSubmit({
                url: "/Graphic/Upload", type: "post", success: function (data) {
                    data = data.replace("<PRE>", "").replace("</PRE>", "");
                    $("#imgMap").src = data;
                    var file = $("#btnfile");
                    file.after(file.clone().val(""));
                    file.remove();
                }
            });
        }
    },

    imgClick: function () {
        // document.getElementById('btnfile').click();

        $("#fm1").ajaxSubmit({
            url: "/Graphic/Upload", type: "post", success: function (data) {
                data = data.replace("<PRE>", "").replace("</PRE>", "");
                $("#divimg").append("<img src='" + data + "' width='200px' height='200px' />");
                var file = $("#btnfile");
                file.after(file.clone().val(""));
                file.remove();
            }
        });
    },

    previewFile: function () {
        var preview = document.getElementById("imgMap2");
        var file = document.getElementById("btnfile2").files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            preview.src = reader.result;
        }
        if (file) {
            reader.readAsDataURL(file);
        } else {
            preview.src = "";
        }
    },

    subMap: function () {

        $("#btn").click(function () {
            $("#fm1").ajaxSubmit({
                url: "/Graphic/Upload", type: "post", success: function (data) {
                    data = data.replace("<PRE>", "").replace("</PRE>", "");
                    if (data != '') {
                        //$("#imgMap").src = data;
                        //    var img = document.getElementById("imgMap");
                        //    img.src = data;

                        $("#imgMap").attr("src", data);
                    }
                    //$("#divimg").append("<img src='" + data + "' width='200px' height='200px' />");
                    //var file = $("#btnfile");
                    //file.after(file.clone().val(""));
                    //file.remove();
                }
            });
        });
    },
    /**********************系统设置-加载事件处理***Start***************************************/
    //document.getElementById("myColor").value;
    sendFileMap: function () {
        var options = {
            path: '/Graphic/UploadMap',
            onSuccess: function (res) {
                console.log(res);
            },
            onFailure: function (res) {
                console.log(res);
            }
        }
        var formData = new FormData();
        var file = document.getElementById("fileMaptype").files[0];
        if (file == undefined)
            return;
        sysConfig.mapName = file.name;

        // formData.append(file);
        formData.append('files', file);
        map2DFun.XMLRequest(options, formData);
    },

    XMLRequest: function (options, formData) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    options.onSuccess(xhr.responseText);
                } else {
                    options.onFailure(xhr.responseText);
                }
            }
        }

        xhr.open('POST', options.path, true);
        xhr.send(formData);
    },

    //电子围栏正常颜色
    onANColorChange: function () {
        var value = $('#aRegNormal').val();
        sysConfig.regColor.normal = value;
    },
    onAAColorChange: function () {
        var value = $('#aRegAlarm').val();
        sysConfig.regColor.alarm = value;
    },
    //电子点名正常颜色
    onRNColorChange: function () {
        var value = $('#rRegNormal').val();
        sysConfig.rcallColor.normal = value;
    },

    onRAColorChange: function () {
        var value = $('#rRegAlarm').val();
        sysConfig.rcallColor.alarm = value;
    },

    ///是否显示摄像头
    onChkchange: function () {
        var isChk = $("#isShowView").is(':checked');
        sysConfig.isShowVideo = (isChk == true ? 1 : 0);
    },

    ///是否显示网格
    onChkGridchange: function () {
        var isChk = $("#isShowGrid").is(':checked');
        sysConfig.isShowGrid = (isChk == true ? 1 : 0);
    },

    onChkStationchange: function () {
        var isChk = $("#isShowStation").is(':checked');
        sysConfig.isShowStation = (isChk == true ? 1 : 0);
    },


    ///透明度
    ontextChange: function () {
        var value = $('#opacityReg').val();
        if (!isNaN(value)) {
            value = 50;
        }
        if (value > 100) {
            value = 100;
        } else if (value < 0)
        {
            value = 10;
        }        

        sysConfig.regOpacity = (value / 100);
    },
    onDiffYChange: function () {
        let valDY = $('#diffY').val();
        tranY = sysConfig.mapTranY = valDY;
        let valDX = $('#diffX').val();
        tranX = sysConfig.mapTranX = valDX;  
    },
    onDiffXChange: function () {
        let valDY = $('#diffY').val();
        tranY = sysConfig.mapTranY = valDY;
        let valDX = $('#diffX').val();
        tranX = sysConfig.mapTranX = valDX;  
    },
    onMapWHChange: function ()
    {
        let valWidth = $('#mapWidth').val();
        sysConfig.mapWidth = valWidth;  
        let valHeight = $('#mapHeight').val();
        sysConfig.mapHeight = valHeight;  
    },
    loadUpDev: function () {
        var options = {
            path: '/Graphic/UploadDevIcon',
            onSuccess: function (res) {
                console.log(res);
            },
            onFailure: function (res) {
                console.log(res);
            }
        }
        var upload = new tinyImgUpload('#uploadDev', options, 'idUpDev');
        document.getElementById('idUpDev').onclick = function () {
            upload();
        }
    },
    loadUpEmp: function () {

        var options = {
            path: '/Graphic/UploadEmpIcon',
            onSuccess: function (res) {
                console.log(res);
            },
            onFailure: function (res) {
                console.log(res);
            }
        }

        var upload = new tinyImgUpload('#uploadEmp', options, 'idUpEmp');
        document.getElementById('idUpEmp').onclick = function () {
            upload();
        }
    },
    loadSysConfig: function () {

        //初始化图形单选按钮
        if (sysConfig.mapType == "1") {
            $("#dxf").attr("checked", true);
        } else if (sysConfig.mapType == "2") {
            $("#jpg").attr("checked", true);
        } else if (sysConfig.mapType == "3") {
            $("#png").attr("checked", true);
        }
        sys.busi2D.radioChange();
        //strName.Substring(strName.LastIndexOf("\\") + 1);
        var idMapPath = document.getElementById('idmapPath');
        var fileMapType = document.getElementById('fileMaptype');
        if (sysConfig.mapName == '') {
            idMapPath.style.display = 'none';  //label隐藏
            fileMapType.style.display = 'block';//file 可见
        } else {

            fileMapType.style.display = 'none';//file 隐藏
            idMapPath.style.display = 'block';  //label可见
            idMapPath.innerHTML = sysConfig.mapName;
        }// sysConfig.mapName.substring(sysConfig.mapName.lastIndexOf('/') + 1);

        //地图纠偏值
        //diffX  diffY
        map2DFun.loadText('diffX', sysConfig.mapTranX);
        map2DFun.loadText('diffY', sysConfig.mapTranY);

        map2DFun.loadText('mapWidth', sysConfig.mapWidth);
        map2DFun.loadText('mapHeight', sysConfig.mapHeight);

        //区域透明度
        map2DFun.loadText('opacityReg', sysConfig.regOpacity * 100);

        document.getElementById("aRegNormal").value = sysConfig.regColor.normal; //报警区域正常颜色
        document.getElementById("aRegAlarm").value = sysConfig.regColor.alarm; //报警区域报警颜色
        document.getElementById("rRegNormal").value = sysConfig.rcallColor.normal; //点名区域正常颜色
        document.getElementById("rRegAlarm").value = sysConfig.rcallColor.alarm; //点名区域报警颜色

        //$("#isShowView").attr("checked", true);
        map2DFun.loadcheckbox('isShowStation', sysConfig.isShowStation);
        map2DFun.loadcheckbox('isShowView', sysConfig.isShowVideo);
        map2DFun.loadcheckbox('isShowGrid', sysConfig.isShowGrid);

        //isShowView    //isShowGrid


    },
    loadText: function (id, value) {

        $("#" + id).attr("value", value)
    },
    loadcheckbox: function (id, value) {
        var isTrue = value == 1 ? true : false;
        $("#" + id).attr("checked", isTrue);
    },
    ////人员图标
    //loadEmpIconName:function()
    //{
    //    var urlPath = "/Graphic/GetIconByPath";
    //    var strJson = { strValue: 'empicon' };
    //    clientMode.post(urlPath, strJson, function (msg) {
    //        sysConfig.empIcon = msg;
    //    }, true, function (msg) {
    //        // layer.msg('已配置作业的安全区域组不能删除!', { icon: 0, time: 3000 });
    //    });
    //},
    ////车辆图标
    //loadDevIconName: function () {
    //    var urlPath = "/Graphic/GetIconByPath";
    //    var strJson = { strValue: 'devicon' };
    //    clientMode.post(urlPath, strJson, function (msg) {
    //        sysConfig.devIcon  = msg;
    //    }, true, function (msg) {
    //        // layer.msg('已配置作业的安全区域组不能删除!', { icon: 0, time: 3000 });
    //    });
    //},
    saveSysConfig: function () {      
       
        var urlPath = "/Graphic/SaveSysConfig";
        var jsonstr = JSON.stringify(sysConfig);
        if (jsonstr != '') {
            var strJson = { strValue: jsonstr };
            clientMode.post(urlPath, strJson, function (msg) {
                if (msg == 0) {
                    //layer.msg('删除失败!', { icon: 2, time: 3000 });
                } else if (msg == 1) {
                    // layer.msg('删除成功!', { icon: 1, time: 3000 });

                }
            }, true, function (msg) {
                // layer.msg('已配置作业的安全区域组不能删除!', { icon: 0, time: 3000 });
            });

        }

        ///上传文件
        //var xhr = new XMLHttpRequest();
        //var formData = new FormData();
        //formData.append('strValue', jsonstr);    
        //xhr.onreadystatechange = function (e) {
        //    if (xhr.readyState == 4) {
        //        if (xhr.status == 200) {
        //          //  options.onSuccess(xhr.responseText);
        //        } else {
        //           // options.onFailure(xhr.responseText);
        //        }
        //    }
        //}
        //xhr.open('POST', urlPath, true);
        //xhr.send(formData);

    },

    saveLocStorSys: function () {
        var timeNew = new Date().getTime();
        var sysCF = { changeTime: timeNew, sysConfig: sysConfig };
        var key = 'sysconfig';
        //保存缓存文件到
        window.localStorage.setItem(key, "");
        var jsonSys = JSON.stringify(sysCF);
        // 存储json字符串  
        window.localStorage.setItem(key, jsonSys);
    },

    saveLocStorSys:function()
    {
        var timeNew = new Date().getTime();
        var sysCF = { changeTime: timeNew, sysConfig: sysConfig };
        var key = 'sysconfig';
        //保存缓存文件到
        window.localStorage.setItem(key, "");
        var jsonSys = JSON.stringify(sysCF);
        // 存储json字符串  
        window.localStorage.setItem(key, jsonSys);
    },
    ////保存JSON文件
    saveRegWL: function () {

        var urlPath = "/Graphic/SaveRegsWL";
        var jsonstr = window.localStorage.getItem("alarmRegion");
       // var json = JSON.parse(jsonstr);
        //var jsonstr = JSON.stringify(sysConfig);
        if (jsonstr != '') {
            var strJson = { strValue: jsonstr };
            clientMode.post(urlPath, strJson, function (msg) {
                if (msg == 0) {
                  //  layer.msg('删除失败!', { icon: 2, time: 3000 });
                } else if (msg == 1) {
                   // sys.busi2D.getElemt('alarmList_ul').removeChild(sys.busi2D.getElemt(objSelected.name));
                    layer.msg('保存成功!', { icon: 2, time: 3000 });
                }
            }, true, function (msg) {
                // layer.msg('已配置作业的安全区域组不能删除!', { icon: 0, time: 3000 });
            });

        }
    },
    saveRegDM: function () {

        var urlPath = "/Graphic/SaveRegsDM";
        var jsonstr = window.localStorage.getItem("rollcallRegion");
        // var json = JSON.parse(jsonstr);
        //var jsonstr = JSON.stringify(sysConfig);
        if (jsonstr != '') {
            var strJson = { strValue: jsonstr };
            clientMode.post(urlPath, strJson, function (msg) {
                if (msg == 0) {
                    layer.msg('删除失败!', { icon: 2, time: 3000 });
                } else if (msg == 1) {
                     layer.msg('删除成功!', { icon: 1, time: 3000 });

                }
            }, true, function (msg) {
                // layer.msg('已配置作业的安全区域组不能删除!', { icon: 0, time: 3000 });
            });

        }
    },
    /**********************系统设置-加载事件处理*******End***********************************/

    /**********************区域信息存库逻辑****start**************************************/

    saveOneReg: function (item)
    {
        let regList = [];
        let psList = [];
        var strJson = JSON.stringify(item);
        var regMes = { id: item.id, showName: item.showName, drawType: item.drawType, pointList: [], drawJson: strJson, alarmTags: item.TagList, alarmTagsOut: item.TagListOut, AlmIpPort: item.AlmIpPort };
        if (item.drawType == 3) {
            var rectList = [];
            rectList.push(item.pointList[0]);
            rectList.push({ x: item.pointList[1].x, y: item.pointList[0].y, z: item.pointList[0].z });
            rectList.push(item.pointList[1]);
            rectList.push({ x: item.pointList[0].x, y: item.pointList[1].y, z: item.pointList[1].z });
            $.each(rectList, function (n, data) {
                var newP = { x: (data.x - tranX), y: (data.y - tranY), z: data.z };
                psList.push(newP);

            });


        } else {
            $.each(item.pointList, function (n, data) {
                var newP = { x: (data.x - tranX), y: (data.y - tranY), z: data.z };
                psList.push(newP);

            });
        }
        regMes.pointList = psList;
        regList.push(regMes);


        var strMesg = "电子点名保存成功...";
        if (regionDraw == 'alarmRegion') {
            strMesg = "电子围栏保存成功...";
        }

        var urlPath = "/Graphic/SaveRegList";
        var strJson = { strKey: regionDraw, strValue: regList };
        clientMode.post(urlPath, strJson, function (msg) {
            map2DFun.refrushTask();
            layer.msg(strMesg, { icon: 1, time: 3000 });
        });


    },

    saveAlarmReg: function (listObj)
    {
        // var listObj = GraphList.getList();
        if (listObj.length == 0)
            return;
   
        var regList = [];
        $.each(listObj, function (i, item) {
            var psList = [];
            var strJson = JSON.stringify(item);
            var regMes = { id: item.id, showName: item.showName, drawType: item.drawType, pointList: [], drawJson: strJson, alarmTags:item.TagList };
            if (item.drawType == 3) {
                var rectList = [];
                rectList.push(item.pointList[0]);
                rectList.push({x:item.pointList[1].x,y:item.pointList[0].y,z:item.pointList[0].z});
                rectList.push(item.pointList[1]);
                rectList.push({ x: item.pointList[0].x, y: item.pointList[1].y, z: item.pointList[1].z });
                $.each(rectList, function (n, data) {
                    var newP = { x: (data.x - tranX), y: (data.y - tranY), z: data.z };
                    psList.push(newP);

                });


            } else {
                $.each(item.pointList, function (n, data) {
                    var newP = { x: (data.x - tranX), y: (data.y - tranY), z: data.z };
                    psList.push(newP);

                });
            }
            regMes.pointList = psList;
            regList.push(regMes);

        });
       
        var strMesg = "电子点名保存成功...";
        if (regionDraw == 'alarmRegion') {
            strMesg = "电子围栏保存成功...";
        }

        var urlPath = "/Graphic/SaveRegList";
        var strJson = { strKey: regionDraw, strValue: regList };
        clientMode.post(urlPath, strJson, function (msg) {
            map2DFun.refrushTask();
            layer.msg(strMesg, { icon: 1, time: 3000 });
        });
    },
    refrushTask: function () {
        //RefrushTask
        var urlPath = "/Graphic/RefrushTask";
        clientMode.post(urlPath, null, function (msg) {       
        });
    },

    //saveRegInfo: function (key, strJson) {
    //    if (strJson == '' || key == '')
    //        return;
    //    var urlPath = "/Graphic/SaveMapRegInfo";
    //    var strJson = { strKey: key, strValue: strJson };
    //    clientMode.post(urlPath, strJson, function (msg) {
    //        // layer.msg('保存成功!', { icon: 1, time: 3000 });
    //    });
    //},
    delRegInfo:function(key,regName)
    {
        var urlPath = "/Graphic/DelMapRegInfo";
        var strJson = { strKey: key, strRegName: regName };
        clientMode.post(urlPath, strJson, function (mes) {
            // layer.msg('删除成功!', { icon: 1, time: 3000 });
            var strMeg = objSelected.showname;
            if (key == 'rollcallRegion') {
                strMeg+=" 电子点名"
                $('#rclist_ul>li[id="' + objSelected.name + '"]').remove();
            } else {
                strMeg += " 电子围栏"
               // sys.busi2D.getElemt('alarmList_ul').removeChild(sys.busi2D.getElemt(objSelected.name));
                $('#alarmList_ul>li[id="' + objSelected.name + '"]').remove();
            }

            GraphList.saveJson(key);
            obj2DRegion.remove(objSelected);
            sys.busi2D.RemoveObj(objSelected);
            sys.busi2D.clearSelectObj();
            map2DFun.refrushTask();
            layer.msg(strMeg+'删除成功...', { icon: 1, time: 3000 });
        });

    },

    //getRegInfo: function (key) {
    //    var oneSelf = [];
    //    var urlPath = "/Graphic/GetAllReg";
    //    var strJson = { strKey: key };
    //    clientMode.post(urlPath, strJson, function (data) {           
    //        for (var i = 0; i < data.length; i++) {
    //            oneSelf.push(data[i].DrawAttribute);                  
    //        }
    //        //var jsonstr = JSON.stringify(oneSelf);
    //        //var json = JSON.parse(jsonstr);
    //        //sys.draw.drawRegByStorage(oneSelf);
    //        //将区域画在图上
    //        $.each(oneSelf, function (i, n) {
    //            var item = JSON.parse(n);
    //            oneBusType = item.busType
    //            sys.draw.drawRegByStorage(item);
    //            //将区域信息存在客户端缓存中
    //            if (oneBusType == 'alarmRegion') {
    //                GraphList.saveJson(oneBusType);
    //            } else if (oneBusType == 'rollcallRegion') {
    //                RollCallList.saveJson(oneBusType);
    //            }
    //        });     
    //    });
    //}
}  /**********************区域信息存库逻辑****End**************************************/