var sysInfoFloor = undefined;
var layeredit = true;
var editLayerName = '';
editbase = {
    // editbase.InitScene()
    InitScene: function () {
        map2dLayer.InitThreeScene('map2d');
        regionDraw = '';
        callbackfloor = 'editbase.initfloor';
        callchangefloor = 'editbase.changefloor';
        divList.push('layerset');
        divList.push('configFloor');
        //callbackdrawReg = 'editbase.drawReg';
    },
    initfloor: function () {
        editbase.loadBox();
        editbase.loadSysConfigList();// 2D配置设置
        editbase.loadLayerSet(); //图层设置
        $("#message").val(""); //

        map2dLayer.loadCurLayer('map2d');//图层显示
    },
    showFloor: function () {
        // map2dLayer.selectedClear();
        map2dLayer.ShowDiv('layerset');
        map2dLayer.ShowDivTF('configFloor', false);
    },
    showLayer: function () {
        //  map2dLayer.selectedClear();
        editbase.loadSysConfig();
        map2dLayer.ShowDiv('configFloor');
        map2dLayer.ShowDivTF('layerset', false);
    },
    //添加一级菜单
    loadBox: function () {
        var strHtml = "<div id='divLeft'><div><img onclick='editbase.showFloor()'  src='" + fileParam.getImg('floor.png', 'toolbar') + "'></div><div><img onclick='editbase.showLayer()'  src='" + fileParam.getImg('set.png', 'toolbar') + "'></div></div> ";
        $('#map2d').append(strHtml);

    },

    loadSysConfigList: function () {
        var strHtml = " <div id='configFloor' class='divstyle'><div style='padding-top:8px;'> 系统设置</div>\
                <div class='wrapp'><div >底图设置</div><div><input type='radio' id='jpg' name='map' onchange='sys.busi2D.radioChange()' value='jpg' checked='checked'>.jpg</div>\
                <div><input type='radio' id='png' name='map' onchange='sys.busi2D.radioChange()' value='png'>.png</div></div> <div style='padding-top:8px;'>更换底图</div>\
                <div class='wrapp'><div><input type='file' id='fileMaptype' onchange='editbase.sendFileMap()' accept='.jpg' style='width:64px'></div>\
                <div><label id='idmapPath' style='display:block;'>fushitu.png</label></div></div>\
                <div style='padding-top:8px;'>底图纠偏值(cm)</div><div class='wrapp'><div class='divTxt'>X:</div><div><input type='text' class='divtext' onchange='editbase.onDiffXChange()' id='diffX' value='-1'></div>\
                <div class='divTxt'>Y:</div><div><input type='text' class='divtext' onchange='editbase.onDiffYChange()' id='diffY' value='1'></div></div><div style='padding-top:8px;'>底图大小设置(cm)</div>\
                <div class='wrapp'><div class='divTxt'>W:</div><div><input type='text' class='divtext' onchange='editbase.onMapWHChange()' id='mapWidth' value='900'></div>\
                <div class='divTxt'>H:</div><div><input type='text' class='divtext' onchange='editbase.onMapWHChange()' id='mapHeight' value='600'></div></div>\
                <div style='padding-top:8px;'>区域透明度</div><div class='wrapp'><div style='margin-left: 5px;'><input type='text' class='divtext' onchange='editbase.ontextChange()' id='opacityReg' value='50'>(1%-100%) </div></div>\
                <div class='wrapright'><div style='padding-top:8px;'><input type='button' id='s_button' type='button' value='保存' onclick='editbase.saveSysConfig()'></div></div></div>";

        $('#map2d').append(strHtml);
        map2dLayer.ShowDivTF('configFloor', false);
        //var div = document.createElement('div');
        //div.setAttribute('id', 'sys_list');
        //div.setAttribute('class', 'rttableStyle');
        //$('#map2d').append($(div));
        //clientMode.getfile("/RPM/3DJS/Config2d.html", function (data) {
        //    var div = document.getElementById('sys_list');
        //    div.innerHTML = data;
        //});
    },
    loadLayerSet: function () {
        var strHtml = "<div id='layerset' class='divstyle'>\
            <div> 楼层设置</div><div>定位区域名称</div><div><select id='ls2' multiple ondblclick='editbase.selectchange()' name='list2' size='12'></select></div>\
            <div class='wrap'><div><label class='labtxt'>名称</label></div><div style='margin: 0px;'><input type='text' id='txtlyname' style='width:180px;' placeholder='请输入定位区域名称' /></div></div>\
            <div id='divline'></div><div class='txtcolor'> 定位区域名称应和结算中定位楼层一致</div>\
            <div class='wrapright'><div><input type='button' id='btnDel' value='删除' onclick='editbase.delLayer()'></div><div> <input type='button' id='btnAdd' value='保存' onclick='editbase.addLayer()'></div></div>";
        $('#map2d').append(strHtml);
        map2dLayer.ShowDivTF('layerset', false);
        editbase.refreshSelectObj('ls2');
        //var div = document.createElement('div');
        //div.setAttribute('id', 'layerset');
        //div.setAttribute('class', 'rttableStyle');
        //$('#map2d').append($(div));
        //clientMode.getfile("/RPM/3DJS/LayerSet.html", function (data) {
        //    var div = document.getElementById('layerset');
        //    div.innerHTML = data;
        //    editbase.refreshSelectObj('ls2');
        //});
    },
    refreshSelectObj: function (objid) {
        $("#" + objid).empty();
        let objSelect = document.getElementById(objid);
        for (var op = 0; op < SysConfingList.length; op++) {
            let option = document.createElement("option");
            option.value = op;
            option.innerText = SysConfingList[op].floor;
            objSelect.appendChild(option);
        }
    },
    initLayerSel: function () {
        if (SysConfingList.length > 0) {
            let oneLayer = getLayerByName(curFloor);//SysConfingList[curFloor];
            var labfloor = document.getElementById("lblsel");
            $('#lblsel').html(oneLayer.floor);
            editbase.refreshSelectObj('selectid');
        }
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
        if (file === undefined)
            return;
        sysInfoFloor.mapName = file.name;
        let idMapPath = document.getElementById('idmapPath');
        idMapPath.innerHTML = sysInfoFloor.mapName;
        // formData.append(file);
        formData.append('files', file);
        editbase.XMLRequest(options, formData);
    },

    XMLRequest: function (options, formData) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    options.onSuccess(xhr.responseText);
                } else {
                    options.onFailure(xhr.responseText);
                }
            }
        }
        xhr.open('POST', options.path, true);
        // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(formData);
    },

    //电子围栏正常颜色
    onANColorChange: function () {
        var value = $('#aRegNormal').val();
        sysInfoFloor.regColor.normal = value;
    },
    onAAColorChange: function () {
        var value = $('#aRegAlarm').val();
        sysInfoFloor.regColor.alarm = value;
    },
    //电子点名正常颜色
    onRNColorChange: function () {
        var value = $('#rRegNormal').val();
        sysInfoFloor.rcallColor.normal = value;
    },

    onRAColorChange: function () {
        var value = $('#rRegAlarm').val();
        sysInfoFloor.rcallColor.alarm = value;
    },
    onAttColorChange: function () {
        var value = $('#rRegAtt').val();
        sysInfoFloor.attRegColor.normal = value;
    },
    ///是否显示摄像头
    onChkchange: function () {
        var isChk = $("#isShowView").is(':checked');
        sysInfoFloor.isShowVideo = (isChk === true ? 1 : 0);
    },

    ///是否显示网格
    onChkGridchange: function () {
        var isChk = $("#isShowGrid").is(':checked');
        sysInfoFloor.isShowGrid = (isChk === true ? 1 : 0);
    },

    onChkStationchange: function () {
        var isChk = $("#isShowStation").is(':checked');
        sysInfoFloor.isShowStation = (isChk === true ? 1 : 0);
    },
    ///透明度
    ontextChange: function () {
        var value = $('#opacityReg').val();
        if (!isNum(value)) {
            value = 50;
        }
        value = parseInt(value);
        if (value > 100) {
            value = 100;
        } else if (value < 0) {
            value = 10;
        }

        sysInfoFloor.regOpacity = (value / 100);
    },
    onDiffYChange: function () {
        let valDY = $('#diffY').val();
        tranY = sysInfoFloor.mapTranY = valDY;
        let valDX = $('#diffX').val();
        tranX = sysInfoFloor.mapTranX = valDX;
    },
    onDiffXChange: function () {
        let valDY = $('#diffY').val();
        tranY = sysInfoFloor.mapTranY = valDY;
        let valDX = $('#diffX').val();
        tranX = sysInfoFloor.mapTranX = valDX;
    },
    onMapWHChange: function () {
        let valWidth = $('#mapWidth').val();
        sysInfoFloor.mapWidth = valWidth;
        let valHeight = $('#mapHeight').val();
        sysInfoFloor.mapHeight = valHeight;
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
        };
    },
    loadSysConfig: function () {

        sysInfoFloor = getLayerByName(curFloor);//SysConfingList[ifloor];
        tranX = sysInfoFloor.mapTranX ;
        tranY = sysInfoFloor.mapTranY ;
        //初始化图形单选按钮
        if (sysInfoFloor.mapType === "1") {
            $("#dxf").attr("checked", true);
        } else if (sysInfoFloor.mapType === "2") {
            $("#jpg").attr("checked", true);
        } else if (sysInfoFloor.mapType === "3") {
            $("#png").attr("checked", true);
        }
       // sys.busi2D.radioChange();
        editbase.radioChange();
        //strName.Substring(strName.LastIndexOf("\\") + 1);
        let idMapPath = document.getElementById('idmapPath');
        idMapPath.innerHTML = sysInfoFloor.mapName;
        let fileMapType = document.getElementById('fileMaptype');
        //if (sysInfoFloor.mapName == '') {
        //    idMapPath.style.display = 'none';  //label隐藏
        //    fileMapType.style.display = 'block';//file 可见
        //} else {

        //    fileMapType.style.display = 'none';//file 隐藏
        //    idMapPath.style.display = 'block';  //label可见
        //    idMapPath.innerHTML = sysInfoFloor.mapName;
        //}
      
        //地图纠偏值
        //diffX  diffY
        editbase.loadText('diffX', sysInfoFloor.mapTranX);
        editbase.loadText('diffY', sysInfoFloor.mapTranY);

        editbase.loadText('mapWidth', sysInfoFloor.mapWidth);
        editbase.loadText('mapHeight', sysInfoFloor.mapHeight);

        //区域透明度
        editbase.loadText('opacityReg', sysInfoFloor.regOpacity * 100);

        //document.getElementById("aRegNormal").value = sysInfoFloor.regColor.normal; //报警区域正常颜色
        //document.getElementById("aRegAlarm").value = sysInfoFloor.regColor.alarm; //报警区域报警颜色
        //document.getElementById("rRegNormal").value = sysInfoFloor.rcallColor.normal; //点名区域正常颜色
        //document.getElementById("rRegAlarm").value = sysInfoFloor.rcallColor.alarm; //点名区域报警颜色       
        //document.getElementById("rRegAtt").value = sysInfoFloor.attRegColor.normal; //电子考勤区域颜色

        //editbase.loadcheckbox('isShowStation', sysInfoFloor.isShowStation);
        //editbase.loadcheckbox('isShowView', sysInfoFloor.isShowVideo);
        //editbase.loadcheckbox('isShowGrid', sysInfoFloor.isShowGrid);


    },
    loadText: function (id, value) {

        $("#" + id).attr("value", value);
    },
    loadcheckbox: function (id, value) {
        var isTrue = value === 1 ? true : false;
        $("#" + id).attr("checked", isTrue);
    },
    saveSysConfig: function () {
       // var plan3DMode = map2dLayer.getFloor();
        map2dLayer.clearObjByObjType('sta');
       // removeObj2DRegion();
        allbackfun = 'map2dLayer.initinfo';
        basicdata.updateSysConfig(sysInfoFloor);   //updateLayer   
    },
    radioChange: function () {
        var item = $("input[name='map']:checked").val();
        var fileVal = document.getElementById("fileMaptype");


        //accept
        if (item === "dxf") {
            fileVal.setAttribute('accept', '.json');
            sysInfoFloor.mapType = 1;
        }
        else if (item === "jpg") {
            fileVal.setAttribute('accept', '.jpg');
            sysInfoFloor.mapType = 2;
        } else if (item === "png") {
            fileVal.setAttribute('accept', '.png');
            sysInfoFloor.mapType = 2;
        }

    },
    /*********************楼层设置********************************************/
    closeLayer: function () {
        //alert(111);
        var sys = document.getElementById("layerset");
        sys.style.display = "none";
    },
    // editbase.saveLayer
    addLayer: function () {
        editbase.showmeg("");
        let txtLayername = $("#txtlyname").val().trim();
        let objSelect = document.getElementById("ls2");
        if (txtLayername === "") {
            editbase.showmeg("定位区域名称不能为空...");
            return;
        }

        if (layeredit === true && isHaveLayer(txtLayername)) {
            editbase.showmeg(txtLayername + " 已经存在...");
            return;
        }

        let count = objSelect.options.length;
        option2 = "";
        if (layeredit) {
            option2 += "<option value=" + (count + 1) + ">" + txtLayername + "</option>";
            $("#ls2").append(option2);
            let syscf = new LayerInfo();
            syscf.floor = txtLayername;
            let laylist = [];
            SysConfingList.push(syscf);
            var jsonstr = JSON.stringify(syscf);
            if (jsonstr !== '') {
                let strValue = txtLayername + "&" + jsonstr;
                laylist.push(strValue);
                allbackfun = 'editbase.refreshLayer';
                basicdata.saveLayers(laylist);
            }
            // editbase.showmeg("添加成功...");
        }
        else {
            if (txtLayername !== editLayerName) {
                objSelect.options[objSelect.selectedIndex].text = txtLayername;
                // editbase.showmeg("修改成功...");         
                allbackfun = 'editbase.refreshLayer';
                basicdata.updateLayer(txtLayername, editLayerName);   //updateLayer     
            }
            $("#btnAdd").val("添加");
            layeredit = true;
            editLayerName = '';
        }
    },
    delLayer: function () {
        editbase.showmeg("");
        let objSelect = document.getElementById("ls2");
        let txt = objSelect.options[objSelect.selectedIndex].text.trim();
        if (objSelect.selectedIndex === 0)
        {
            editbase.showmeg(txt + " 不允许删除...");
            return;
        }
        layer.msg('是否删除' + txt + '定位区域...', {
            time: 0 //不自动关闭
            , btn: ['是', '否']
            , yes: function (index) {
                objSelect.options.remove(objSelect.selectedIndex);
                //从库中删除
                allbackfun = 'editbase.refreshLayer';
                basicdata.delLayer(txt);   //updateLayer
                editbase.showmeg(txt + " 删除成功...");
                let floorTxt = objSelect.options[0].text.trim();
                map2dLayer.setLayerFloorInfo(floorTxt);
                layer.close(index);
            }, btn2: function () {
                objSelect.selectedIndex = 0;
                layer.close();
            }
        });
    },
    saveLayer: function () {
        // layerList
        let selobj = document.getElementById("ls2");
        var laylist = [];
        for (var i = 0; i < selobj.options.length; i++) {
            var e = selobj.options[i];
            //  e2.options.add(new Option(e.text, e.value));
            let syscf = new LayerInfo();
            syscf.floor = e.text;
            if (!isHaveLayer(syscf.floor)) {
                SysConfingList.push(syscf);
                var jsonstr = JSON.stringify(syscf);
                if (jsonstr !== '') {
                    let strValue = e.text + "&" + jsonstr;
                    laylist.push(strValue);
                }
            }
        }

        allbackfun = 'editbase.refreshLayer';
        basicdata.saveLayers(laylist);
        //if (laylist.length > 0) {
        //    //listValue
        //    var urlPath = "/Graphic/SaveLayer";
        //    var strJson = { listValue: laylist };
        //    clientMode.post(urlPath, strJson, function (msg) {
        //        if (msg == "OK") {
        //            layer.msg('保存成功!', { icon: 1, time: 3000 });
        //            editbase.refreshdb();
        //        } else {
        //            layer.msg('保存失败!', { icon: 2, time: 3000 });
        //        }
        //    }, true, function (msg) {
        //        // layer.msg('已配置作业的安全区域组不能删除!', { icon: 0, time: 3000 });
        //    });
        //}
    },
   
    refreshLayer: function () {
        editbase.refreshSelectObj('selectid'); //图层切换下拉框
        //3D图层下拉框
        //2D的图层下拉框
    },


    selectchange: function () {
        let objSelect = document.getElementById("ls2");
        let sectxt = objSelect.options[objSelect.selectedIndex].text;
        $("#txtlyname").val(sectxt);
        editLayerName = sectxt;
        layeredit = false;
        $("#btnAdd").val("编辑");
        editbase.showmeg("");
    },
    showmeg: function (msg) {
        $('#showmsg').html(msg);
    },
    changefloor: function (key) {
      //  map2dLayer.ShowDivTF('sys_list',false);

       // alert('切换完成');
        //map2dLayer.clearLayerdObj(curFloor);
        //curFloor = key;  //当前楼层索引
        //map2dLayer.initinfo();//加载对应的图层信息    
    },

}