
var rtEmpDiv = 'rtemplist_main', rtDevDiv = 'rtdevlist_main', rtVideoDiv = 'rtvideolist_main', rtRegDiv = 'rtreglist_main', rtrollcallDiv = 'rtrollcalllist_main', rtStaDiv = 'rtStationlist_main';
var hi = 0;
var isChkAlmReg = true, isChkAttReg = true, isChkStaShow = true;
var isChkTrackShow = false;
sys.baseNew3D = {

    loadRtShortKey: function () {
        var div = document.createElement('div');
        //var paemp = document.createElement('p');
        //var paReg = document.createElement('p');
        //var pavideo = document.createElement('p');
        div.setAttribute('id', 'rtshortkey');
        div.style.position = 'absolute';
        div.style.right = '10px';
        div.style.top = '5px';
        //  <a class="a_demo_five" href="#" onclick="show()">50</a>
        var rtemp = document.createElement('a');
        rtemp.setAttribute('class', 'a_demo_five');
        rtemp.setAttribute('id', 'rtemp_a');
        rtemp.setAttribute('title', '实时人员');
        rtemp.href = "#";
        rtemp.innerText = '0';
        rtemp.style.marginRight = '3px';
        rtemp.onclick = function () {

            // sys.baseNew3D.showRtList('rtemplist');
            sys.baseNew3D.showRtList(rtEmpDiv);

            var strmes = '<ul class="layer_notice" id="reginfo" style="display: block;">    <li><a href="#" target="_blank">电子围栏报警区域报警</a></li>    <li><a href="#" target="_blank">点名区域报警</a></li>    <li><a href="#" target="_blank">低电量报警</a></li>  </ul>';
            //  sys.baseNew3D.openAlarmPage(strmes);
        };
        // paemp.appendChild(rtemp)
        div.appendChild(rtemp);

        var rtReg = document.createElement('a');
        rtReg.setAttribute('class', 'a_reg_btn');
        rtReg.setAttribute('id', 'rtreg_a');
        rtReg.setAttribute('title', '电子围栏');
        rtReg.href = "#";
        rtReg.innerText = '0';
        rtReg.style.marginRight = '3px';
        rtReg.onclick = function () {
            //  layer.msg('暂未实现', { icon: 5, time: 3000 });

            // sys.baseNew3D.showRtList('rtreglist'); //rtRegDiv
            sys.baseNew3D.showRtList(rtRegDiv);


        };
        // paReg.appendChild(rtReg);
        div.appendChild(rtReg);

        var rtvideo = document.createElement('a');
        rtvideo.setAttribute('class', 'a_video_btn');
        rtvideo.setAttribute('id', 'rtvideo_a');
        rtvideo.setAttribute('title', '实时车辆');
        rtvideo.href = "#";
        rtvideo.innerText = '0';
        rtvideo.onclick = function () {
            //  layer.msg('暂未实现', { icon: 5, time: 3000 });
            // sys.baseNew3D.showRtList('rtdevlist');
            sys.baseNew3D.showRtList(rtDevDiv);

        };
        //  pavideo.appendChild(rtvideo);
        div.appendChild(rtvideo);



        $('#newmap3d').append($(div));
        var divFrm = document.createElement('div');
        divFrm.setAttribute('id', 'formEditDialog');
        $('#newmap3d').append($(divFrm));
    },


    loadRight: function () {

    },

    //修改菜单
    loadRtOne: function () {
        //  <a class="btn btn-link" href="#navigation-main" title="btn-link">
        //    <i class="fa fa-bars" aria-hidden="true"></i>
        //</a>
        var div = document.createElement('div');
        div.setAttribute('id', 'rtonetool');
        div.style.position = 'absolute';
        div.style.left = '0px';
        div.style.top = '0px';


        var btna = document.createElement('a');
        btna.setAttribute('id', 'caidan1')
        btna.setAttribute('class', 'btn btn-link');
        btna.setAttribute('title', '菜单');
        btna.href = "#";
        btna.onclick = function () {
            // alert("点击事件");
            var div = document.getElementById("lefttop");
            //var bottom = document.getElementById("caidan");
            btna.style.display = "none";
            div.style.display = "block";
        }
        var oi = document.createElement('i');
        oi.setAttribute('class', 'fa fa-bars');
        btna.appendChild(oi);

        div.appendChild(btna);
        $('#newmap3d').append($(div));
    },




    loadSearchMenu: function () {
        var div = document.createElement('div');
        div.setAttribute('id', 'local');
        div.style.display = 'none';
        // div.html(sysHtmlMode);
        div.innerHTML = seachRtHtml;
        $('#newmap3d').append($(div));
    },

    loadRtHisMenu: function () {
        var div = document.createElement('div');
        div.setAttribute('id', 'localHis');
        div.style.display = 'none';
        // div.html(sysHtmlMode);
        //  div.innerHTML = seachRtHisHtml;
        $('#newmap3d').append($(div));
        mapNew3D.loadRtHisBtn();

    },


    ///加载测试摄像头
    loadRtVideo: function () {

        var videoInfo = [
            { tName: '大门前', tCode: 'donn110', IP: '192.168.8.12', position: '-400,800,0' },
            { tName: '走廊', tCode: 'donn110', IP: '192.168.8.123', position: '-200,400,0' },
            { tName: '小东门', tCode: 'donn110', IP: '192.168.8.14', position: '-1200,-1000,0' }
        ];

        $.each(videoInfo, function (i, emp) {
            // sys.draw.createRtEmpIcon(emp);
            sys.baseNew3D.addRtVideoList(emp);
        });


    },

    ///实时人员信息
    loadRtEmp: function () {
        //  var empInfo = [
        //      { tName: '小王', tCode: 'donn110', tagCode: '020-000-000-110', position: '40,80,0', icon: fileParam.empIcon + 'emp_12.png' },
        //      { tName: '小明', tCode: 'donn110', tagCode: '020-000-000-102', position: '20,40,0', icon: fileParam.empIcon + 'emp_1.png' },
        //      { tName: '刘策', tCode: 'donn110', tagCode: '020-000-000-103', position: '120,100,0', icon: fileParam.empIcon + 'emp_4.png' }
        //  ];
        ////  document.getElementById("rtemp_a").innerText = empInfo.length;
        //  $.each(empInfo, function (i, emp) {
        //      var empIcon = sys.draw.createRtIcon(emp);
        //      sys.newmap3D.AddObj3DEmp(sphere);
        //     // sys.baseNew3D.addRtEmpList(emp);
        //  });

    },

    //AddObj3DDev

    ///实时车辆
    loadRtDev: function () {
        //var devInfo = [
        //    { tName: '叉车', tCode: 'donn110', tagCode: '020-020-000-112', position: '-1400,600,0', icon: fileParam.devIcon + 'dev_01.png' },
        //    { tName: '挖掘机', tCode: 'donn110', tagCode: '020-001-000-010', position: '-1200,1400,0', icon: fileParam.devIcon + 'dev_03.png' },
        //    { tName: '重型卡车', tCode: 'donn110', tagCode: '020-200-000-210', position: '-2200,2400,0', icon: fileParam.devIcon + 'dev_04.png' }
        //];
        //document.getElementById("rtvideo_a").innerText = devInfo.length;
        //$.each(devInfo, function (i, dev) {
        //    var empIcon = sys.draw.createRtIcon(dev);
        //    sys.newmap3D.AddObj3DDev(sphere);
        //    sys.baseNew3D.addRtDevList(dev);
        //});
    },
    ///加载实时区域新
    loadRtRegWL: function () {
        ///到Array 里面去找
        if (obj3DRegs != undefined) {
            // GraphList.getList();
            $.each(GraphList.getList(), function (i, obj) {
                var index = sys.baseNew3D.isExistLi(obj.id);
                if (index == 0)
                    sys.baseNew3D.addRtRegList(obj);
            });
            let rtRega = document.getElementById("rtreg_a");
            if (rtRega != undefined) {
                document.getElementById("rtreg_a").innerText = GraphList.arr.length;
            }

            $.each(RollCallList.getList(), function (i, obj) {
                var index = sys.baseNew3D.isExistLi(obj.id);
                if (index == 0)
                    sys.baseNew3D.addRtRegList(obj);
            });
        }
        sys.baseNew3D.loadRtVideo();
    },
    isExistLi: function (regid) {
        var index = 0;
        $('#rtreglist').find('li').each(function () {
            if ($(this).id == regid) {
                index = $(this).index();
            }
        });
        return index;
    },
    /*******************快捷键实时人员*Start******************************************************/
    //loadRtEmpList: function () {
    //    //alarmRegList
    //    var div = document.createElement('div');
    //    div.setAttribute('id', 'rtemplist');

    //    div.onmouseover = function () {
    //        console.log('移入 isdraw=' + isdraw);
    //        //if (isdraw == true)
    //        //    currentDrawing = 1;
    //        //else
    //        //    currentDrawing = 0;

    //        isdraw = false;
    //    };
    //    div.onmouseout = function () {
    //        console.log('移出 isdraw=' + isdraw);
    //        //if (currentDrawing == 1) {
    //        //    isdraw = true;
    //        //}
    //        isdraw = true;
    //    };

    //    //创建UL
    //    var oUL = document.createElement('ul');
    //    oUL.setAttribute('id', 'rtemplist_ul');
    //    oUL.setAttribute('class', 'list');
    //    div.appendChild(oUL);
    //    var uli = document.createElement('li');
    //    uli.setAttribute('id', '_li0');
    //    uli.setAttribute('class', 'list_item active');
    //    //uli.setAttribute('class', 'fa fa-minus-hexagon');
    //    uli.style = 'border-radius: 10px 10px 0px 0px;';
    //    var ua = document.createElement('a');
    //    ua.innerHTML = '实时人员';
    //    uli.appendChild(ua);
    //    oUL.appendChild(uli);
    //    $('#newmap3d').append($(div));
    //},
    addRtEmpList: function (emp) {
        var list = document.getElementById('rtemplist_ul');
        var li = document.createElement('li');
        li.setAttribute('class', 'list_item');
        li.setAttribute('id', emp.tagCode);
        li.setAttribute('title', "标签号:" + emp.tagCode);
        var la = document.createElement('a');
        la.innerHTML = emp.tName;
        la.href = "#"
        la.id = "la_" + emp.tagCode;

        la.onclick = function (e) {
            var regId = e.target.id;
            var keys = regId.split('_');
            // alert(keys[1]);
            sys.baseNew3D.lookAtEmp(keys[1]);
            //$.each(plan3D.children, function (i, emp) {
            //    if (emp.objType == 'emp') {
            //        if (emp.name == keys[1]) {
            //            objSelectTrack = emp.name;
            //        }
            //    }
            //});

        }
        li.appendChild(la);
        list.appendChild(li);
    },

    lookAtEmp: function (tagNo) {
        var isHaveEmp = false;
        $.each(plan3D.children, function (i, emp) {
            if (emp.objType == 'emp') {
                //根据人员标签或是人员姓名查找模型对象
                if (emp.name == tagNo || emp.showName == tagNo) {
                    objSelectTrack = emp.name;
                    isHaveEmp = true;
                }
            }
        });
        return isHaveEmp;
    },


    /*******************实时人员*End************************************************************/

    /*******************快捷键实时车辆*Start******************************************************/
    //loadRtDevList: function () {
    //    var div = document.createElement('div');
    //    div.setAttribute('id', 'rtdevlist');
    //    //创建UL
    //    var oUL = document.createElement('ul');
    //    oUL.setAttribute('id', 'rtdevlist_ul');
    //    oUL.setAttribute('class', 'list');
    //    div.appendChild(oUL);
    //    var uli = document.createElement('li');
    //    uli.setAttribute('id', '_li0');
    //    uli.setAttribute('class', 'list_item active');
    //    //uli.setAttribute('class', 'fa fa-minus-hexagon');
    //    uli.style = 'border-radius: 10px 10px 0px 0px;';
    //    var ua = document.createElement('a');
    //    ua.innerHTML = '实时车辆';
    //    uli.appendChild(ua);
    //    oUL.appendChild(uli);
    //    $('#newmap3d').append($(div));
    //},
    addRtDevList: function (dev) {
        var list = document.getElementById('rtdevlist_ul');
        var li = document.createElement('li');
        li.setAttribute('class', 'list_item');
        li.setAttribute('id', dev.tagCode);
        li.setAttribute('title', "标签号:" + dev.tagCode);
        var la = document.createElement('a');
        la.innerHTML = dev.tName;
        la.href = "#"
        la.id = "la_" + dev.tagCode;

        la.onclick = function (e) {
            var regId = e.target.id;
            //选中区域
        }
        li.appendChild(la);
        list.appendChild(li);
    },
    /*******************快捷键实时车辆*End******************************************************/

    /*******************快捷键实时区域*Start******************************************************/
    //loadRtRegList: function () {
    //    //alarmRegList
    //    var div = document.createElement('div');
    //    div.setAttribute('id', 'rtreglist');

    //    // <ul id="person_list_ul" class="list">
    //    //创建UL
    //    var oUL = document.createElement('ul');
    //    oUL.setAttribute('id', 'rtreglist_ul');
    //    oUL.setAttribute('class', 'listreg');
    //    //  oUL.style.backgroundImage = "url(../images/User.png)";

    //    // oul.css({ "background-image": "url(imgs/left.png)" });
    //    div.appendChild(oUL);
    //    var uli = document.createElement('li');
    //    uli.setAttribute('id', '_li0');
    //    uli.setAttribute('class', 'listreg_item active');
    //    uli.style.textAlign = 'center';
    //    //uli.setAttribute('class', 'fa fa-minus-hexagon');


    //    var ua = document.createElement('a');
    //    ua.innerHTML = '电子围栏';
    //    uli.appendChild(ua);

    //    // var uli2 = document.createElement('li');
    //    uli.setAttribute('id', '_li2');
    //    uli.setAttribute('class', 'listreg_item active');
    //    uli.style.textAlign = 'center';
    //    var br = document.createElement('br');
    //    var checkBox = document.createElement("input");
    //    checkBox.setAttribute("type", "checkbox");
    //    checkBox.setAttribute("id", 'chkrtregShow');
    //    checkBox.setAttribute("checked", true);
    //    checkBox.onclick = function () {
    //        var ischk = document.getElementById("chkrtregShow").checked;
    //        sys.baseNew3D.isshowRegWL(ischk, 'alarmRegion');

    //    }

    //    var li_i1 = document.createElement('i');
    //    li_i1.innerText = '显示电子围栏';

    //    uli.appendChild(br);
    //    uli.appendChild(checkBox);
    //    uli.appendChild(li_i1);
    //    oUL.appendChild(uli);
    //    //oUL.appendChild(uli2);

    //    $('#newmap3d').append($(div));
    //},
    isshowRegWL: function (isShow, regtype) {
        if (obj3DRegs != undefined) {
            // GraphList.getList();
            $.each(scene3D.children, function (i, obj) {
                //busType
                if (obj.name == 'obj3DRegs') {
                    $.each(obj.children, function (n, item) {
                        if (item.busType == regtype) {
                            item.visible = isShow;
                        }

                    });
                }

            });

        }
    },

    addRtRegList: function (reg) {
        if (reg.busType == fileParam.alarmRegName) {
            sys.baseNew3D.addRtRegList2(reg, 'rtreglist_ul')
        } else if (reg.busType == fileParam.rollcallRegName) {
            sys.baseNew3D.addRtRegList2(reg, 'rtrollcalllist_ul');
        }
    },
    /*******************快捷键实时区域*End******************************************************/
    /*******************实时电子点名区域*Start******************************************************/
    loadRtRollCallList: function () {
        //alarmRegList
        var div = document.createElement('div');
        div.setAttribute('id', 'rtrollcalllist');

        // <ul id="person_list_ul" class="list">
        //创建UL
        var oUL = document.createElement('ul');
        oUL.setAttribute('id', 'rtrollcalllist_ul');
        oUL.setAttribute('class', 'listreg');
        //  oUL.style.backgroundImage = "url(../images/User.png)";

        // oul.css({ "background-image": "url(imgs/left.png)" });
        div.appendChild(oUL);
        var uli = document.createElement('li');
        uli.setAttribute('id', '_li0');
        uli.setAttribute('class', 'listreg_item active');
        uli.style.textAlign = 'center';
        //uli.setAttribute('class', 'fa fa-minus-hexagon');


        var ua = document.createElement('a');
        ua.innerHTML = '电子点名';
        uli.appendChild(ua);

        // var uli2 = document.createElement('li');
        uli.setAttribute('id', '_li2');
        uli.setAttribute('class', 'listreg_item active');
        uli.style.textAlign = 'center';
        var br = document.createElement('br');
        var checkBox = document.createElement("input");
        checkBox.setAttribute("type", "checkbox");
        checkBox.setAttribute("id", 'chkrtrcShow');
        checkBox.setAttribute("checked", true);
        checkBox.onclick = function () {
            var ischk = document.getElementById("chkrtrcShow").checked;
            sys.baseNew3D.isshowRegWL(ischk, 'rollcallRegion');

        }

        var li_i1 = document.createElement('i');
        li_i1.innerText = '显示电子点名';

        uli.appendChild(br);
        uli.appendChild(checkBox);
        uli.appendChild(li_i1);

        oUL.appendChild(uli);
        //oUL.appendChild(uli2);

        $('#newmap3d').append($(div));
    },
    ///实时摄像机列表
    //loadRtVideoList: function () {
    //    var div = document.createElement('div');
    //    div.setAttribute('id', 'rtvideolist');
    //    //创建UL
    //    var oUL = document.createElement('ul');
    //    oUL.setAttribute('id', 'rtvideolist_ul');
    //    oUL.setAttribute('class', 'list');
    //    div.appendChild(oUL);
    //    var uli = document.createElement('li');
    //    uli.setAttribute('id', '_li0');
    //    uli.setAttribute('class', 'list_item active');
    //    //uli.setAttribute('class', 'fa fa-minus-hexagon');
    //    uli.style = 'border-radius: 10px 10px 0px 0px;';
    //    var ua = document.createElement('a');
    //    ua.innerHTML = '实时监控';
    //    uli.appendChild(ua);
    //    oUL.appendChild(uli);
    //    $('#newmap3d').append($(div));
    //},
    addRtVideoList: function (video) {
        var list = document.getElementById('rtvideolist_ul');
        var li = document.createElement('li');
        li.setAttribute('class', 'list_item');
        li.setAttribute('id', video.IP);
        var la = document.createElement('a');
        la.innerHTML = video.tName;
        la.href = "#"
        la.id = "la_" + video.IP;

        la.onclick = function (e) {
            var regId = e.target.id;
            //选中区域
        }
        li.appendChild(la);
        list.appendChild(li);
    },
    /*******************实时电子点名区域*End********************************************************/

    /*******************基站显示*Start******************************************************/

    addStationList: function (sta) {
        sta.id = sta.Id;
        sta.showName = sta.Name;
        sta.drawType = 0;
        sys.baseNew3D.addRtRegList2(sta, 'rtStationlist_ul');
    },
    isshowSta: function (isShow) {
        if (plan3D != undefined) {
            $.each(plan3D.children, function (i, sta) {
                if (sta.objType == 'sta') {
                    sta.visible = isShow;
                }
            });

        }
    },
    /*******************基站显示*End********************************************************/
    addRtRegList2: function (reg, key) {

        var list = document.getElementById(key);
        var li = document.createElement('li');
        li.setAttribute('class', 'listreg_item');
        li.setAttribute('id', reg.id);

        var img = document.createElement('img');

        if (reg.drawType == 2) {
            img.setAttribute('title', '多边形区域');
            img.src = fileParam.getImg('polygon_on.png', 'toolbar');
        } else if (reg.drawType == 3) {
            img.setAttribute('title', '矩形区域');
            img.src = fileParam.getImg('rectangle_on.png', 'toolbar');
        } else if (reg.drawType == 4) {
            img.setAttribute('title', '圆形区域');
            img.src = fileParam.getImg('circle_on.png', 'toolbar');
        } else {
            img.setAttribute('title', '定位基站');
            img.src = fileParam.getImg('station.png', 'toolbar');
        }

        li.appendChild(img);

        var la = document.createElement('a');
        la.innerHTML = reg.showName;
        la.href = "#"
        la.id = "la_" + reg.id;

        la.onclick = function (e) {
            var regId = e.target.id;
            if (reg.drawType == 0) {
                sys.baseNew3D.findStaById(regId);
            } else {
                sys.baseNew3D.findRegById(regId);
            }
            //选中区域
        }
        li.appendChild(la);

        //var li_i1 = document.createElement('i');
        //li_i1.innerText = '正常';     
        //li.appendChild(li_i1);

        list.appendChild(li);
    },
    showRtList: function (key) {
        sys.baseNew3D.closeRtKey(key)
        var perRtMessage = document.getElementById(key);
        if (window.getComputedStyle(perRtMessage).getPropertyValue('display') == 'none') {
            perRtMessage.style.display = 'block';
            //rtRegDiv
            // if (key == 'rtreglist' || key == 'rtrollcalllist')
            if (key == rtRegDiv || key == rtrollcallDiv)
                isSelectReg = true;



        } else if (window.getComputedStyle(perRtMessage).getPropertyValue('display') == 'block') {
            perRtMessage.style.display = 'none';
            if (key == rtRegDiv || key == rtrollcallDiv)
                isSelectReg = false;
        }
    },
    closeRtKey: function (key) {
        isSelectReg = false;
        var perRtMessage = document.getElementById(rtRegDiv);
        if (key != rtRegDiv) {
            perRtMessage.style.display = 'none';
        }
        //if (key != 'rtemplist') {
        if (key != rtEmpDiv) {
            //  perRtMessage = document.getElementById('rtemplist');

            perRtMessage = document.getElementById(rtEmpDiv);
            perRtMessage.style.display = 'none';
        }

        //  if (key != 'rtvideolist') {
        if (key != rtVideoDiv) {
            //perRtMessage = document.getElementById('rtvideolist');
            perRtMessage = document.getElementById(rtVideoDiv);
            perRtMessage.style.display = 'none';
        }
        //if (key != 'rtrollcalllist') {
        if (key != rtrollcallDiv) {
            //rtrollcallDiv
            perRtMessage = document.getElementById(rtrollcallDiv);
            perRtMessage.style.display = 'none';
        }
        //if (key != 'rtdevlist') {
        if (key != rtDevDiv) {
            //  perRtMessage = document.getElementById('rtdevlist');
            perRtMessage = document.getElementById(rtDevDiv);
            perRtMessage.style.display = 'none';
        }
        //if (key != 'rtStationlist') {
        if (key != rtStaDiv) {
            //rtStaDiv
            perRtMessage = document.getElementById(rtStaDiv);
            perRtMessage.style.display = 'none';
        }
    },
    findRegById: function (akey) {
        var keys = akey.split('_');
        //alert(keys[1]);
        $.each(scene3D.children, function (i, obj) {
            //busType
            if (obj.name == 'obj3DRegs') {
                $.each(obj.children, function (n, item) {
                    if (item.name == keys[1]) {
                        sys.baseNew3D.selectObjReg(item);
                    }

                });
            }

        });
    },
    selectObjReg: function (obj3d) {
        if (obj3d != undefined) {

            var objSelectNew = obj3d;
            if (objSelectNew !== objSelected) {
                if (objSelected !== undefined) {
                    objSelected.material.transparent = true;
                    objSelected.material.opacity = sysConfig.regOpacity;
                }
                objSelectNew.material.transparent = true;
                objSelectNew.material.opacity = 1;
                objSelected = objSelectNew;
                if (objSelected.objType != undefined && objSelected.objType == 'sta') {
                    objSelected.material.color.setHex(0xA020F0);
                }
                //objSelectNew.material.emissive.setHex(0xff0000);

            }
            // document.getElementsByTagName("html").item(0).style.cursor = "pointer"
        } else {

            if (objSelected !== undefined) {
                objSelected.material.transparent = true;
                objSelected.material.opacity = sysConfig.regOpacity;
                //objSelectNew.material.emissive.setHex(sysConfig.regColor.normal);
                if (objSelected.objType != undefined && objSelected.objType == 'sta') {
                    objSelected.material.color.setHex(0xA020F0);
                }

            }
            objSelected = undefined;
            // document.getElementsByTagName("html").item(0).style.cursor = "default"
        }
    },

    ///根据ID查找基站的信息
    findStaById: function (objId) {
        var keys = objId.split('_');
        //  layer.msg('id:' + keys[1], { icon: 5, time: 3000 });
        if (plan3D != undefined) {
            $.each(plan3D.children, function (i, sta) {
                if (sta.objType == 'sta' && sta.staId == keys[1]) {
                    sys.baseNew3D.selectObjReg(sta);
                }
            });
        }
    },



    /******************二级菜单*Start******************************************************/
    loadsecondmenu: function () {
        var div = document.createElement('div1');
        div.setAttribute('id', 'secondmenu');
        div.setAttribute('class', 'btn-group');

        var div_a = null;
        var div_ai = null;
        for (var i = 0; i < 8; i++) {
            div_a = document.createElement('a');
            div_a.setAttribute('class', 'btn btn-defaul');
            div_a.href = "#";

            div_ai = document.createElement('i');
            switch (i) {
                case 0:
                    // icon-sitemap
                    div_a.onclick = function () {
                        sys.baseNew3D.showRtDept();
                    };
                    div_ai.setAttribute('class', 'fa fa-users fa-lg');
                    div_ai.setAttribute('title', '部门筛选');
                    break;
                case 1:
                    div_a.onclick = function () {
                        // layer.msg('人员搜索,实现中...', { icon: 6, time: 3000 });
                        sys.baseNew3D.empsearchShow();

                    }
                    div_ai.setAttribute('class', 'fa fa-user fa-lg');
                    div_ai.setAttribute('title', '人员搜索');
                    break;
                case 2:
                    div_a.onclick = function () {
                        // layer.msg('车辆搜索,暂未实现', { icon: 5, time: 3000 });
                        sys.baseNew3D.devsearchShow();

                    }
                    div_ai.setAttribute('class', 'fa fa-cogs fa-lg');
                    div_ai.setAttribute('title', '实时车辆搜索');
                    break;
                case 3:
                    div_a.onclick = function () {
                        // layer.msg('电子围栏显示,暂未实现', { icon: 5, time: 3000 });
                        // sys.baseNew3D.showRtList('rtreglist');
                        sys.baseNew3D.showRtList(rtRegDiv);
                    }
                    div_ai.setAttribute('class', 'fa fa-bell-o fa-lg');
                    div_ai.setAttribute('title', '电子围栏');
                    break;
                case 4:
                    div_a.onclick = function () {

                        //  layer.msg('点名区域显示,暂未实现', { icon: 5, time: 3000 });
                        //sys.baseNew3D.showRtList('rtrollcalllist');

                        sys.baseNew3D.showRtList(rtrollcallDiv);
                    }
                    div_ai.setAttribute('class', 'fa fa-bullhorn fa-lg');
                    div_ai.setAttribute('title', '电子点名');
                    break;
                case 5:
                    div_a.onclick = function () {
                        // layer.msg('摄像头搜索,暂未实现', { icon: 5, time: 3000 });
                        //sys.baseNew3D.showRtList('rtvideolist');
                        sys.baseNew3D.showRtList(rtVideoDiv);

                    }
                    div_ai.setAttribute('class', 'fa fa-video-camera fa-lg');
                    div_ai.setAttribute('title', '摄像头');
                    break;
                case 6:
                    //fa fa-wifi
                    div_a.onclick = function () {

                        // sys.baseNew3D.showRtList('rtStationlist');
                        //
                        sys.baseNew3D.showRtList(rtStaDiv);

                    }
                    div_ai.setAttribute('class', 'fa fa-map-marker fa-lg');
                    div_ai.setAttribute('title', '定位基站');
                    break;
                case 7:
                    div_a.onclick = function () {
                        //  layer.msg('全屏', { icon: 5, time: 3000 });
                        if (is3DFull) {
                            sys.baseNew3D.exitFullScreen();
                        } else {
                            sys.baseNew3D.enterFullScreen();
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


    //隐藏菜单
    loadsecondmenu1: function () {

        var div = document.createElement('div');
        div.setAttribute('id', 'secondmenu1');
        div.setAttribute('class', 'btn-group1');

        var yincang = document.getElementById("yincang")

        var div_a = null;
        var div_ai = null;
        for (var i = 0; i < 2; i++) {
            div_a = document.createElement('a');
            div_a.setAttribute('class', 'btn btn-defaul');
            div_a.href = "#";

            div_ai = document.createElement('i');

            switch (i) {

                case 0:
                    div_a.onclick = function () {
                        sys.baseNew3D.createRegEdit1();

                    }
                    div_ai.setAttribute('class', 'fa fa-cog fa-lg');
                    div_ai.setAttribute('title', '设置');
                    break;
                case 1:
                    div_a.onclick = function () {
                        //  layer.msg('全屏', { icon: 5, time: 3000 });
                        if (is3DFull) {
                            sys.baseNew3D.exitFullScreen();
                           
                        } else {
                            sys.baseNew3D.enterFullScreen();
                            
                        }

                    }
                    div_ai.setAttribute('class', 'fa fa-arrows fa-lg');
                    div_ai.setAttribute('title', '全屏');
                    break;
                case 2:
                    div_a.onclick = function () {
                        window.location.href = 'Map3DFloor.html';
                    }
                    div_ai.setAttribute('class', 'fa fa-eye fa-lg');
                    div_ai.setAttribute('title', '3D');

                    break;
                //case 1:
                //    div_a.onclick = function () {
                //        //alert(111);
                //        //function yincang() {
                //        var div = document.getElementById("lefttop");
                //        var btna = document.getElementById("caidan1");
                //        btna.style.display = "block";
                //        div.style.display = "none";
                //        //}

                //    }
                //    div_ai.setAttribute('class', 'fa fa-times fa-lg');
                //    div_ai.setAttribute('title', '隐藏');
                //    break;
            }
            div_a.appendChild(div_ai);
            div.appendChild(div_a);
        }
        $('#newmap3d').append($(div));
    },


    ///二级菜单快捷键
    showSecondMenu: function () {
        var perRtMessage = document.getElementById('secondmenu');
        if (window.getComputedStyle(perRtMessage).getPropertyValue('display') == 'none') {
            perRtMessage.style.display = 'block';

        } else if (window.getComputedStyle(perRtMessage).getPropertyValue('display') == 'block') {
            perRtMessage.style.display = 'none';
        }
    },
    //新的查找方式

    selectareShow: function () {
        //alert(111);
        //$("#input1").var("");
        //var obj = document.getElementById('b1'); //定位id
        //var index = obj.selectedIndex; // 选中索引
        //var text = obj.options[index].text; // 选中文本
        //var value = obj.options[index].value; // 选中值
        //alert(value);

        var option = "";
       
        var a3 = document.getElementById('a3');
        var div = document.createElement('div');
        div.setAttribute('id', 'd1');
        $("#companys").empty();
        let msg = "";
        $.each(TagList, function (i, emp) {

            msg = "";
            if (emp.tel !== "")
            {
                msg +=(" "+ emp.tel);
            }
            if (emp.objNum !== "")
            {
                msg += (" " + emp.objNum);
            }
            if (emp.remark !== "")
            {
                msg += (" " + emp.remark);
            }
            if (msg !== "") {
                option += "<option value=" + emp.tName + ">" + emp.tagCode + " " + msg + "</option>";
            } else
            {
                option += "<option value=" + emp.tName + ">" + emp.tagCode  + "</option>";
            }

            });
            $("#companys").append(option);
            var sel = document
            $("#selectFind").click(function () {
                selectOnClick(sys.baseNew3D.seachEmpNew);
            });
        //if (value == 2) {

        //    //查询所有人员
        //    $.each(TagList, function (i, emp) {
        //        //alert(111);
        //        //alert(emp.tName);
        //        if (emp.useState == 1) {
        //            option += "<option value=" + emp.tName + ">" + emp.tCode + "</option>";
        //        }

        //    });
        //    $("#companys").append(option);
        //    var sel = document
        //    $("#selectFind").click(function () {
        //        selectOnClick(sys.baseNew3D.seachEmpNew);
        //    });

        //} else if (value == 3) {

        //    //查询所有设备
        //    $.each(TagList, function (i, emp) {
        //        //alert(111);
        //        //alert(emp.tName);
        //        if (emp.useState == 2) {
        //            option += "<option value=" + emp.tName + ">" + emp.tCode + "</option>";
        //        }

        //    });
        //    $("#companys").append(option);
        //    var sel = document
        //    $("#selectFind").click(function () {
        //        selectOnClick(sys.baseNew3D.seachEmpNew);
        //    });

        //} else if (value == 1) {

        //    //查询所有
        //    $.each(TagList, function (i, emp) {
        //        //alert(111);
        //        //alert(emp.tName);
        //        option += "<option value=" + emp.tName + ">" + emp.tCode + "</option>";

        //    });
        //    $("#companys").append(option);
        //    var sel = document
        //    $("#selectFind").click(function () {
        //        selectOnClick(sys.baseNew3D.seachEmpNew);
        //    });

        //}


    },
    ////实时人员查找
    empsearchShow: function () {
        // var perRtMessage = document.getElementById('local'); //localHis
        var perRtMessage = document.getElementById('localHis');
        if (window.getComputedStyle(perRtMessage).getPropertyValue('display') == 'none') {
            perRtMessage.style.display = 'block';
            sys.baseNew3D.clearPlay();
            var provicneSelectStr = "";
            provicneSelectStr += "<option value='0'>查询方式</option>";
            provicneSelectStr += "<option value='1'>标签号</option>";
            provicneSelectStr += "<option value='2'>姓名</option>";
            $("#selectid").html(provicneSelectStr);
            var sel = document;
            $("#selectFind").click(function () {
                selectOnClick(sys.baseNew3D.searchEmp);
            });
            //hisSearchMes
            //$("#hisSearch").click(function () {
            //    mapNew3D.searchHisMes();
            //});
            //$("#hisPlay").click(function () {
            //    sys.baseNew3D.hisPlay();
            //});

            //$("#hisBackward").click(function () {
            //    sys.baseNew3D.hisBackward();
            //});
            //$("#hisForward").click(function () {
            //    sys.baseNew3D.hisForward();
            //});
            $("#logmax").val('');
            $("#logmin").val('');
        } else if (window.getComputedStyle(perRtMessage).getPropertyValue('display') == 'block') {
            perRtMessage.style.display = 'none';
            $("#selectid").html("");
            document.getElementById("txtsel").value = "";

        }


    },

    /////实时车辆查找
    devsearchShow: function () {
        var perRtMessage = document.getElementById('localHis');
        if (window.getComputedStyle(perRtMessage).getPropertyValue('display') == 'none') {
            perRtMessage.style.display = 'block';
            sys.baseNew3D.clearPlay();
            var provicneSelectStr = "";
            provicneSelectStr += "<option value='0'>查询方式</option>";
            provicneSelectStr += "<option value='1'>标签号</option>";
            provicneSelectStr += "<option value='2'>车辆编号</option>";
            $("#selectid").html(provicneSelectStr);
            var sel = document;
            $("#selectFind").click(function () {
                selectOnClick(sys.baseNew3D.searchDev);
            });
            $("#logmax").val('');
            $("#logmin").val('');
        } else if (window.getComputedStyle(perRtMessage).getPropertyValue('display') == 'block') {
            perRtMessage.style.display = 'none';
            $("#selectid").html("");
            document.getElementById("txtsel").value = "";

        }
    },
    searchDev: function () {
        layer.msg('id:' + selType + ", txt" + txtsel, { icon: 5, time: 3000 });

    },

    ///进入全屏
    enterFullScreen: function () {
        is3DFull = true;
        var de = document.documentElement;
        if (de.requestFullscreen) {
            de.requestFullscreen();
        } else if (de.mozRequestFullScreen) {
            de.mozRequestFullScreen();
        } else if (de.webkitRequestFullScreen) {
            de.webkitRequestFullScreen();
        }
    },
    ///退出全屏
    exitFullScreen: function () {
        is3DFull = false;
        var de = document;
        if (de.exitFullscreen) {
            de.exitFullscreen();
        } else if (de.mozCancelFullScreen) {
            de.mozCancelFullScreen();
        } else if (de.webkitCancelFullScreen) {
            de.webkitCancelFullScreen();
        }
    },
    //fullSce: function () {

    //    var index = layer.open({
    //        type: 2,
    //        content: 'http://layim.layui.com',
    //        area: ['320px', '195px'],
    //        maxmin: true
    //    });
    //},
    openAlarmPage: function (showMes) {

        //area: ['520px', 'auto'],
        if (isOpen == false) {
            isOpen = true;
            layer.open({
                type: 1,
                shade: false,
                id: 'almlayer2',
                title: '报警提示', //不显示标题
                content: showMes,
                offset: 'rb',
                cancel: function () {
                    sys.baseNew3D.alarmMes();
                    //layer.msg('是否处理报警数据？', {
                    //    time: 0 //不自动关闭
                    //    , btn: ['是', '否']
                    //    , yes: function (index) {
                    //        isOpen = false;
                    //        layer.close(index);
                    //        sys.baseNew3D.alarmMes();
                    //    }, btn2: function () {
                    //        isOpen = false;
                    //        layer.close();
                    //    }
                    //});
                }
            });

        }
        //layer.open({
        //    type: 1,
        //    area: ['600px', '360px'],
        //    shadeClose: true, //点击遮罩关闭
        //    content: '\<\div style="padding:20px;">自定义内容\<\/div>'
        //});
    },
    alarmMes: function () {
        isOpen = true;
        // mapNew3D.showMessage(almArea);

        let divAlarm = document.getElementById('alarmDiv');
        divAlarm.style.display = 'block';
        sys.baseNew3D.showRTAlarmList();

    },
    alarmCL: function () {
        layui.use('table', function () {
            var table = layui.table;

            table.render({
                elem: '#test'
                , url: '/demo/table/user/'
                , cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                , cols: [[
                    { field: 'id', title: 'ID', sort: true }
                    , { field: 'username', title: '用户名' } //width 支持：数字、百分比和不填写。你还可以通过 minWidth 参数局部定义当前单元格的最小宽度，layui 2.2.1 新增
                    , { field: 'sex', title: '性别', sort: true }
                    , { field: 'city', title: '城市' }
                    , { field: 'sign', title: '签名' }
                    , { field: 'classify', title: '职业', align: 'center' } //单元格内容水平居中
                    , { field: 'experience', title: '积分', sort: true, align: 'right' } //单元格内容水平居中
                    , { field: 'score', title: '评分', sort: true, align: 'right' }
                    , { field: 'wealth', title: '财富', sort: true, align: 'right' }
                ]]
            });
        });
    },

    /******************二级菜单*End********************************************************/

    /******************画轨迹线******************************************************/
    createLine: function (points, color) {
        var lineNew = sys.draw.drawObj2DLineString(points, color);
        return lineNew;

    },
    /******************区域报警颜色改变*******************************************************/
    setAreaAlm: function (key, isAlm) {
        if (obj3DRegs != undefined) {
            // GraphList.getList();
            $.each(scene3D.children, function (i, obj) {
                //busType
                if (obj.name == 'obj3DRegs') {
                    $.each(obj.children, function (n, item) {
                        if (item.name == key) {
                            //报警
                            if (isAlm == true) {
                                //INTERSECTED.material.emissive.setHex( 0xff0000 );                          
                                // item.material.emissive.setHex(sysConfig.regColor.alarm);
                                // item.material.color.setHex(0xff0000); //= sysConfig.regColor.alarm;
                                // "normal":"#7CFC00","alarm":"#FFB6C1"
                                item.material.color.setHex(0xFFB6C1); //= sysConfig.regColor.alarm;
                            } else {  //恢复正常                               
                                // item.material.emissive.setHex(sysConfig.regColor.normal);
                                //item.material.color.setHex(0x1A75FF);  //= sysConfig.regColor.normal;
                                item.material.color.setHex(0x7CFC00);  //= sysConfig.regColor.normal;
                            }
                            // item.visible = isShow;
                        }

                    });
                }

            });
        }
    },

    /******************人员快捷查询***start****************************************************/
    //实时信息搜索
    searchEmp: function (selType, txtsel) {
        // layer.msg('id:' + selType + ", txt" + txtsel, { icon: 5, time: 3000 });
        if (selType == 1) {
            if (isHisPlay) {
                layer.msg('是否结束历史回放？', {
                    time: 0 //不自动关闭
                    , btn: ['是', '否']
                    , yes: function (index) {
                        layer.close(index);
                        isHisPlay = false;
                        // sys.newmap3D.changeEmpVilible(true); //显示实时人员                       
                        sys.baseNew3D.clearPlay();

                    }, btn2: function () {
                        layer.close();
                    }
                });
            } else {
                isHisPlay = false;
                var isHEmp = sys.baseNew3D.lookAtEmp(txtsel);
                if (isHEmp == false) {
                    layer.msg(txtsel + '信息没有查到...', { icon: 5, time: 3000 });
                }
            }
        }

    },
    cLogminFun: function (dp) {
        var date = dp.cal.getNewDateStr();
        sys.baseNew3D.BookingRmk(date);

    },
    BookingRmk: function (begin) {
        //var begin = $("#logmin").val();
        var end = $("#logmax").val();
        if (end == "") {
            end = changeDateValue(begin, 10);
            $("#logmax").val(end)

        } else {
            var isTrue = timeIntervalMin(begin, end);
            if (isTrue == false) {
                end = changeDateValue(begin, 10);
                $("#logmax").val(end)
            }
        }
    },
    BookingEndRmk: function (end) {
        var begin = $("#logmin").val();
        // var end = $("#logmax").val();
        if (begin == "") {
            begin = changeDateValue(end, -10);
            $("#logmin").val(begin)

        } else {
            var isTrue = timeIntervalMin(begin, end);
            if (isTrue == false) {
                begin = changeDateValue(end, -10);
                $("#logmin").val(begin)
            }
        }
    },
    cLogmaxFun: function (dp) {
        var date = dp.cal.getNewDateStr();
        sys.baseNew3D.BookingEndRmk(date);
    },
    hisSearchMes: function (data) {

        if (data.length > 0) {
            //if (isPause == true) {
            //if (isClear == false) {
            //    isClear = true;
            //清空所有的历史轨迹
            sys.newmap3D.clearHisTrack();
            hisTotal = data.length;  //数据总长度
            hisDrawTrack = [];
            hisDrawTrack = data;
            proBar = new sys.baseNew3D.createProBar();
            proNum = 0;
            proBar.animate(proNum);
            document.getElementById("hisProIndex").innerHTML = "0/" + hisTotal;
        }


    },
    createHisObj: function (item) {
        var ps = new Point3D_Str(item.Position);
        var emp = { tName: item.TName, tCode: item.TagCode, tagCode: item.TagCode, position: new Point3D_CM(ps), icon: fileParam.empIcon + 'hisemp.png' };
        var empIcon = sys.draw.createRtIcon(emp);
        empIcon.objType = 'emp_his';
        empIcon.drawcolor = Math.random() * 0xffffff; //随机色
        empIcon.trackList = []; //实时轨迹集合
        empIcon.showName = emp.tName;//人员姓名
        empIcon.PrePoint = new THREE.Vector3(emp.position.X, emp.position.Y, emp.position.Z);

        //czlt-20180408 添加到地图plan中
        sys.draw.plan3DAdd(empIcon);

    },
    readHisPosition: function () {
        if (isPause == true)
            return;
        if (hisDrawTrack.length > 0) {
            if (sumToatl >= chkTime) {
                sumToatl = 0;
                var item = hisDrawTrack.shift();
                var ps = new Point3D_Str(item.Position);
                var position = new Point3D_CM(ps);
                if (hisDrawTrack.length > 0) {
                    var end = hisDrawTrack[0];
                    chkTime = timeInterval(item.ChkTime, end.ChkTime);
                } else {
                    chktime = 100;
                }
                chkTime = chkTime + trackAlt;
                if (chkTime <= 10)
                    chkTime = 10;
                else if (chkTime >= 500) {
                    chkTime = 500;
                }
                var index = hisTotal - hisDrawTrack.length;
                var indexPre = Math.floor((index / hisTotal) * 100);
                proBar.animate(indexPre);
                document.getElementById("hisProIndex").innerHTML = index + '/' + hisTotal;

                var rtPs = new THREE.Vector3(position.X, position.Y, position.Z);
                sys.newmap3D.drawHisTrack(item.TagCode, rtPs);


            } else {
                sumToatl = 10 + sumToatl;
            }
        } else {
            if (hisSetInte != undefined) {
                sumToatl = 0;
                chkTime = 100;
                window.clearInterval(hisSetInte);
                isClear = false;
                isPause = true;
                document.getElementById("btnPlay").setAttribute('class', 'fa fa-play fa-lg');

                layer.msg('是否删除历史轨迹？', {
                    time: 0 //不自动关闭
                    , btn: ['是', '否']
                    , yes: function (index) {
                        layer.close(index);
                        isHisPlay = false;
                        // sys.newmap3D.changeEmpVilible(true); //显示实时人员
                        // sys.baseNew3D.isVisibleRtMes(true);
                        hisTotal = 0;
                        document.getElementById("hisProIndex").innerHTML = "播放 0/0";
                        proBar.animate(0);
                        sys.newmap3D.clearHisTrack();
                    }, btn2: function () {
                        layer.close();
                    }
                });

            }
        }

    },

    hisPlay: function () {
        if (isPause == true) {
            if (hisTotal > 0) {
                if (isClear == false) {
                    isClear = true;
                    sys.baseNew3D.createHisObj(hisDrawTrack[0]); //创建历史轨迹对象
                    hisSetInte = setInterval(function () {
                        sys.baseNew3D.readHisPosition();  //对历史轨迹数据
                    }, 10);
                }
                isHisPlay = true;
                ///实时区域，人员
                // sys.baseNew3D.isVisibleRtMes(false);

                isPause = false;
                //   div.setAttribute('id', 'rtshortkey');
                document.getElementById("btnPlay").setAttribute('class', 'fa fa-pause fa-lg');
                document.getElementById("btnPlay").setAttribute('title', '暂停');
                // layer.msg('点击播放', { time: 800 });

            }
        } else {
            isPause = true;

            document.getElementById("btnPlay").setAttribute('class', 'fa fa-play fa-lg');
            document.getElementById("btnPlay").setAttribute('title', '播放');

        }

    },
    hisBackward: function () {
        if (proBar != undefined) {
            trackAlt = trackAlt + 10;
        }
    },
    hisForward: function () {
        if (proBar != undefined) {
            //proNum = proNum + 10;
            //if (proNum > 100)
            //    proNum = 100;
            //proBar.animate(proNum);
            trackAlt = trackAlt - 10;
            // layer.tips('加速+10', '', { tips: [4, rgba(226, 232, 232, 0.5)] });
            // layer.msg('加速+10', { time: 800 });

        }
    },
    createProBar: function () {
        //function randomPercentage() {
        //    return Math.floor(Math.random() * 100);
        //}   
        this.num = 0;
        // var title = $('#sample-pb .title').text('@' + num);
        this.controlBar = $('#localHis .number-pb').NumberProgressBar({
            duration: 12000,
            percentage: this.num
        });

        this.animate = function (val) {
            if (val < 0) {
                this.num = 0;
            } else if (val > 100) {
                this.num = 100;
            } else {
                this.num = val
            }
            this.controlBar.reach(this.num);

        }

    },
    showRtTrack: function (index) {// $("#logmax").val(end)
        //alert(111);
        if (isHisPlay == true)
            return;

        var flag = $("#chkRtT").is(':checked');
        let isShow = false;
        var selType = $("#selectid").val();
        var txtsel = $("#txtsel").val();
        if (selType == '0' || txtsel == '') {
            isShow = false;
        } else {
            isShow = true;
        }
        if (index == 1) {
            $.each(plan3D.children, function (i, emp) {
                if (isShow == true) {
                    if (emp.name == txtsel || emp.showName == txtsel) {
                        emp.showTrack = flag;
                    }
                } else {
                    emp.showTrack = flag;
                }
            });
        }
    },
    clearPlay: function () {
        var playBtn = document.getElementById("hisProIndex");
        if (playBtn == null)
            return;
        document.getElementById("hisProIndex").innerHTML = "播放 0/0";
        if (proBar != undefined)
            proBar.animate(0);
        isPause = true;
        isClear = false;
        document.getElementById("btnPlay").setAttribute('class', 'fa fa-play fa-lg');
        if (hisSetInte != undefined) {
            sumToatl = 0;
            hisTotal = 0;
            chkTime = 100;
            window.clearInterval(hisSetInte);
        }
        sys.newmap3D.clearHisTrack();
    },
    isVisibleRtMes: function (isShow) {
        //实时人员信息隐藏
        sys.newmap3D.changeEmpVilible(isShow);
        //区域隐藏
        sys.baseNew3D.isshowRegWL(isShow, 'alarmRegion');
        sys.baseNew3D.isshowRegWL(isShow, 'rollcallRegion');
    },
    /******************人员快捷查询***End****************************************************/

    /**************************************清理实时区域****************************************/
    ///实时刷新区域信息
    refreshReg: function () {
        // setTimeout(function () { },3000 );
        sys.baseNew3D.ischangeRegs('alarmRegion');
        sys.baseNew3D.ischangeRegs('rollcallRegion');
    },
    loadRegsTimeRef: function () {


        setTimeout(function () {
            sys.baseNew3D.timeRefreshRegs();
        }, 5000);
    },
    timeRefreshRegs: function () {
        ///3秒钟更新一次区域信息
        setInterval(function () {
            sys.baseNew3D.refreshReg();
        }, 3000);
    },

    ischangeRegs: function (keyName) {
        //alarmRegion
        var jsonRCallstr = window.localStorage.getItem(keyName);
        if (jsonRCallstr === null || jsonRCallstr === '') {
        } else {
            // 还原json对象  
            var json = JSON.parse(jsonRCallstr);//json中的
            //json中有 regs没有新增； json中无 regs有删除
            var regs = sys.baseNew3D.findRegs(keyName);
            var delReg = new ArrayList();
            var addReg = new ArrayList();

            $.each(regs, function (i, n) {
                delReg.add(n);
            });
            $.each(json, function (i, m) {
                //sys.draw.drawRegByStorage(n);
                var item = JSON.parse(m);
                var isHave = false;
                $.each(regs, function (j, n) {
                    if (item.id === n.name) {
                        isHave = true;
                        delReg.removeObj(n);
                    }
                });

                if (isHave == false)
                    addReg.add(item);
            });

            ///假如待删除集合中有数据，删除区域
            if (delReg.arr.length > 0) {
                $.each(delReg.arr, function (k, n) {
                    sys.newmap3D.removeObj3DRegs(n);
                });
            };
            ///假如新增集合中有数据，就新增区域
            if (addReg.arr.length > 0) {
                $.each(addReg.arr, function (m, n) {
                    var isHave = sys.baseNew3D.isHaveReg(n.id);
                    if (isHave == false) {
                        sys.draw.drawRegByStorage(n);
                    }
                });
            };


        }
    },

    //清空区域信息
    findRegs: function (keyName) {
        var regIds = [];
        if (obj3DRegs !== undefined) {
            $.each(scene3D.children, function (i, obj) {
                if (obj.name === 'obj3DRegs') {
                    $.each(obj.children, function (n, item) {
                        //shape.busType = item.busType;
                        if (item.busType === keyName)
                            regIds.push(item);
                        //sys.newmap3D.removeObj3DRegs(item);
                    });

                };
            });
        };
        return regIds;
    },

    isHaveReg: function (regid) {
        let isHave = false;
        if (obj3DRegs !== undefined) {
            $.each(scene3D.children, function (i, obj) {
                if (obj.name === 'obj3DRegs') {
                    $.each(obj.children, function (n, item) {
                        if (item.name === regid)
                            isHave = true;
                    });

                };
            });
        };
        return isHave;
    },


    /*****************************实时信息中部门筛选*Start*****************************************************************/
    showRtDept: function (isOper) {
        $("#lblMessage").text("");
        clientMode.getfile("/RPM/3DJS/RtShowDeptList.html", function (data) {
            jQuery("#DialogSelect").html(data);
            sys.baseNew3D.FindAllDeptInfo();
            jQuery("#DialogSelect").dialog({
                title: "设置实时显示部门",
                modal: true,
                autoOpen: true,
                width: 360,
                position: ['center', 50],
                close: function (event, ui) {
                    $("#DialogSelect").dialog("destroy");
                    $("#DialogSelect").html("");
                }
            });
        });
    },
    setRtDeptList: function () {

        showDeptIds = [];
        $("#ls2 option").each(function () {
            showDeptIds.push($(this).val());
        });

        $("#DialogSelect").dialog("destroy");
        $("#DialogSelect").html("");

        //移除不在显示队列的人员
        if (showDeptIds.length > 0)
            sys.newmap3D.clearRtEmpByDeptId();

    },
    //站点选择和上下移动
    moveOption: function (e1, e2) {
        for (var i = 0; i < e1.options.length; i++) {
            if (e1.options[i].selected) {
                var e = e1.options[i];
                e2.options.add(new Option(e.text, e.value));
                e1.remove(i);
                i = i - 1;
            }
        }
    },
    //查找人员信息
    FindAllDeptInfo: function () {
        //DeptList
        clientMode.post("/Graphic/GetDeptInfoList", null, function (data) {

            if (data !== null) {
                data.forEach(function (item) {
                    DeptList[item.Id] = item;
                    // console.log(item);
                })
            }
            //if (data != null) {
            //    var option1 = "";
            //    var option2 = "";
            //    var isTrue = true;
            //    $("#ls1").empty();
            //    $("#ls2").empty();

            //    $.each(data, function (i, dept) {
            //        isTrue = false;
            //        if ($.inArray(dept.Id, showDeptIds) == -1) {
            //            option1 += "<option value=" + dept.Id + ">" + dept.Name + "</option>";
            //        }
            //    });

            //    if (showDeptIds.length > 0)
            //        $.each(showDeptIds, function (i, deptid) {
            //            data.forEach(function (d) {
            //                if (d.Id == deptid) {
            //                    option2 += "<option value=" + d.Id + ">" + d.Name + "</option>";
            //                }
            //            });
            //        });
            //    $("#ls1").append(option1);
            //    $("#ls2").append(option2);
            //}
        });
    },

    loadAlarmMes: function () {

        var div = document.createElement('div');
        var divTop = document.createElement('div');
        var divAlarm = document.createElement('div');
        //var paemp = document.createElement('p');
        //var paReg = document.createElement('p');
        //var pavideo = document.createElement('p');
        //alarmDiv
        divAlarm.setAttribute('id', 'rtAlarmMesList');
        div.setAttribute('id', 'alarmDiv');
        div.style.display = 'none';

        //<h4 align="left">报警管理</h4>
        //    <img id="close" src="pp.jpg" />
        //div.setAttribute('class','tableStyle1');
        divTop.setAttribute('id', 'topAlarm');
        let topTitle = document.createElement('H4');
        topTitle.innerText = "实时报警信息";
        //topTitle.color = "rgb(243,229,223)";
        divTop.appendChild(topTitle);
        var img = document.createElement('img');
        img.setAttribute('src', fileParam.getImg('close.png', 'toolbar'));
        img.setAttribute('title', '关闭');
        img.onclick = function () {
            let divAlarm = document.getElementById('alarmDiv');
            divAlarm.style.display = 'none';
            isOpen = false;
        };
        divTop.appendChild(img);
        //var strbr = document.createElement('br');
        //divTop.appendChild(strbr);
        var lableMes = document.createElement('label');
        //       padding: 4px;
        //  lableMes.style.padding = '4px';
        // lableMes.style.paddingLeft = '4px';
        lableMes.setAttribute('id', 'labMes');
        lableMes.style.color = '#ffc107';
        lableMes.style.cssFloat = 'left'
        lableMes.innerHTML = '围栏报警:10,碰撞预警:20';
        divTop.appendChild(lableMes);

        div.appendChild(divTop);
        div.appendChild(divAlarm);

        var oUL = document.createElement('ul');
        oUL.setAttribute('id', 'rtAlarmEle');
        oUL.setAttribute('class', 'alarmList');
        divAlarm.appendChild(oUL);
        var uliMes = document.createElement('li');
        uliMes.setAttribute('id', 'liAlarmMes');
        uliMes.style = 'border-radius: 0px 0px 5px 5px;';
        //uliMes.style.width = 183 + "px";
        uliMes.style.width = 100+"%";
        oUL.appendChild(uliMes);

        $('#newmap3d').append($(div));
        //  sys.baseNew3D.showRTAlarmTest();
    },
    showRTAlarmList: function () {
        //  var almMsg = { id: (almArea.length + 1), tName: tag.tName, tagNo: tag.tagCode, regType: regsType, regName: regsName, regStart: rtChkTime };
        //almArea
        let eleAlm = 0;
        let collAlm = 0;
        if (almArea.length > 0) {
            let option = "<table width='100%'>";
            for (var i = 0; i < almArea.length; i++) {
                let alm = almArea[i];

                if ((i + 1) % 2 === 1) {
                    option += "<tr style='background:rgba(255, 216, 0,0.35);border-bottom:3px solid rgba(255,255,255,0.5);width='100%''><td  width='100%'>";

                    //alType = "电子围栏报警";
                    //regname = "区域名称" + i;
                } else {
                    option += "<tr style='background:rgba(182, 255, 0,0.35);border-bottom:3px solid rgba(255,255,255,0.5);width='100%'><td  width='100%'>";
                    //  alType = "碰撞预警";

                }
                option += "<table width='100%'>";
                option += "<tr><td>名称:" + alm.tName + "</td><td>标签:" + alm.tagNo + "</td></tr>";
                if (alm.regType === '碰撞预警') {
                    option += "<tr><td colspan='2'><font  color='red'>状态:" + alm.regType + "</font></td></tr>";
                    collAlm++;
                } else {
                    option += "<tr><td colspan='2' ><font  color='blue'>状态:" + alm.regType + "</font></td></tr>";
                    option += "<tr><td colspan='2' >区域:" + alm.regName + "</td></tr>";
                    eleAlm++;
                }
                option += "<tr><td colspan='2' >时间:" + new Date(alm.regStart.replace('T', ' ')).Format("yyyy-MM-dd HH:mm:ss") + "</td></tr>";
                option += "</table><td></tr>"
            }
            option += "</table>";

            let almMes = document.getElementById('liAlarmMes');
            almMes.innerHTML = option;

            let labMes = document.getElementById('labMes');
            labMes.innerHTML = '围栏报警:' + eleAlm + ',碰撞预警:' + collAlm;

        } else {
            isOpen = false;
            let perRtMessage = document.getElementById('alarmDiv');
            perRtMessage.style.display = 'none';
            layer.msg('没有可显示的信息!', { icon: 0, time: 2000 });
        }
    },

    showRTAlarmTest: function () {
        //  var almMsg = { id: (almArea.length + 1), tName: tag.tName, tagNo: tag.tagCode, regType: regsType, regName: regsName, regStart: rtChkTime };
        //almArea
        let option = "<table>";
        for (var i = 1; i < 7; i++) {

            let alType = "";
            let regname = "";
            if (i % 2 === 1) {
                option += "<tr style='background:rgba(255, 216, 0,0.35);border-bottom:3px solid rgba(255,255,255,0.5);'  width='100%'><td  width='100%'>";
                alType = "电子围栏报警";
                regname = "区域名称" + i;
            } else {
                option += "<tr style='background:rgba(182, 255, 0,0.35);border-bottom:3px solid rgba(255,255,255,0.5);'  width='100%'><td  width='100%'>";
                alType = "碰撞预警";
            }
            option += "<table width='100%'>";
            option += "<tr><td  width='60%'>名称:小黑_" + i + "</td><td>标签:" + i * 10 + "</td></tr>";
            option += "<tr><td colspan='2' >状态:" + alType + "</td></tr>";
            option += "<tr><td colspan='2' >时间:2018-05-24 11:22:22</td></tr>";
            option += "<tr><td colspan='2' >备注:" + regname + "</td></tr>";
            option += "</table><td></tr>"

        }
        option += "</table>";

        let almMes = document.getElementById('liAlarmMes');
        almMes.innerHTML = option;
    },

    rtShowAlarmInvert: function () {
        setInterval(function () {
            let perRtMessage = document.getElementById('alarmDiv');
            if (window.getComputedStyle(perRtMessage).getPropertyValue('display') == 'block') {
                if (almArea.length > 0)
                    sys.baseNew3D.showRTAlarmList();
            }

        }, 1500);

    },

    /***********************实时信息中部门筛选*End*************************************************************************/
    createDivList: function (divId, ulId, title) {

        var divFull = document.createElement('div');
        divFull.setAttribute('id', divId + "_main");
        divFull.setAttribute('class', 'divModeList');
        var divTop = document.createElement('div');
        //alarmRegList
        var div = document.createElement('div');
        div.setAttribute('id', divId);
        div.setAttribute('class', 'divBody');

        divFull.onmouseover = function () {
            console.log('移入 isdraw=' + isdraw);
            //if (isdraw == true)
            //    currentDrawing = 1;
            //else
            //    currentDrawing = 0;

            isdraw = false;
        };
        divFull.onmouseout = function () {
            console.log('移出 isdraw=' + isdraw);
            //if (currentDrawing == 1) {
            //    isdraw = true;
            //}
            isdraw = true;
        };

        //创建Top
        var oUL = document.createElement('ul');
        //oUL.setAttribute('id', ulId);
        oUL.setAttribute('class', 'list top');
        divTop.appendChild(oUL);
        var uli = document.createElement('li');
        uli.setAttribute('id', '_li0');
        uli.setAttribute('class', 'list_item active');
        //uli.setAttribute('class', 'fa fa-minus-hexagon');
        uli.style = 'border-radius: 10px 10px 0px 0px;';
        var ua = document.createElement('a');
        ua.innerHTML = title;
        uli.appendChild(ua);
        oUL.appendChild(uli);
        divFull.appendChild(divTop);
        //创建div 中的UL
        var divUL = document.createElement('ul');
        divUL.setAttribute('id', ulId);
        divUL.setAttribute('class', 'list');
        div.appendChild(divUL);

        divFull.appendChild(div);
        $('#newmap3d').append($(divFull));


    },

    createDivListChk: function (divId, ulId, title, chkName) {

        var divFull = document.createElement('div');
        divFull.setAttribute('id', divId + "_main");
        divFull.setAttribute('class', 'divModeList');
        var divTop = document.createElement('div');

        //alarmRegList


        // <ul id="person_list_ul" class="list">
        //创建UL
        var oUL = document.createElement('ul');

        /*    oUL.setAttribute('class', 'listreg');  *///'list top'
        oUL.setAttribute('class', 'listreg');

        divTop.appendChild(oUL);
        var uli = document.createElement('li');
        uli.setAttribute('id', '_li0');
        uli.setAttribute('class', 'active');
        uli.style.textAlign = 'center';
        //uli.setAttribute('class', 'fa fa-minus-hexagon');


        var ua = document.createElement('a');
        ua.innerHTML = title;
        uli.appendChild(ua);

        var br = document.createElement('br');
        var checkBox = document.createElement("input");
        checkBox.setAttribute("type", "checkbox");
        checkBox.setAttribute("id", chkName);
        checkBox.setAttribute("checked", true);
        checkBox.onclick = function (chkName) {
            sys.baseNew3D.chkBoxFun(chkName);
        }

        var li_i1 = document.createElement('i');
        li_i1.innerText = '显示' + title;

        uli.appendChild(br);
        uli.appendChild(checkBox);
        uli.appendChild(li_i1);
        oUL.appendChild(uli);

        divFull.appendChild(divTop);

        var div = document.createElement('div');
        div.setAttribute('id', divId);
        var listUL = document.createElement('ul');
        listUL.setAttribute('id', ulId);
        listUL.setAttribute('class', 'listreg divBody');
        div.appendChild(listUL);
        divFull.appendChild(div);

        $('#newmap3d').append($(divFull));
    },
    chkBoxFun: function (event) {
        let ischk = event.currentTarget.checked;
        let chkType = event.currentTarget.id;
        if (chkType === 'chkrtregShow') {
            sys.baseNew3D.isshowRegWL(ischk, 'alarmRegion');
        } else if (chkType === 'chkrtrcShow') {
            sys.baseNew3D.isshowRegWL(ischk, 'rollcallRegion');
        } else if (chkType === 'chkStaShow') {
            sys.baseNew3D.isshowSta(ischk);
        }

    },
    //实时查找人员信息

    seachEmpNew: function (txtsel) {
        //alert(111);
        var txtsel = $("#input1").val();
        if (txtsel === null || txtsel === "") {
            layer.msg('请输入要查的信息！', { icon: 5, time: 3000 });
        } else {
            isHisPlay = false;
            var isHEmp = sys.baseNew3D.lookAtEmp(txtsel);
            if (isHEmp === false) {
                layer.msg(txtsel + '信息没有查到...', { icon: 5, time: 3000 });
            }
        }


    },
    //查找全部人员信息
    loadButs: function () {

        //全部
        //var inputqb = document.createElement('input');
        var inputqb = document.createElement('div');
        inputqb.setAttribute('id', 'allqb');
        inputqb.setAttribute('type', 'button');
        inputqb.setAttribute('class','back_color color_queen');
        //inputqb.value = "全部";
        inputqb.innerText = "全部";
        //align = "center"
        inputqb.align = "center";
        inputqb.onclick = function () {
            //inputqb.setAttribute('class', 'color_front_1 color_queen_qb');
            inputqb.setAttribute('class', 'color_queen');
            inputzx.setAttribute('class', 'color_front');
            inputlx.setAttribute('class', 'color_front');
            //inputsx.setAttribute('class', 'back_color');
            isInOut = undefined;
            mapNew3D.loadDeptTree();
        }
        //在线
        //var inputzx = document.createElement('input');
        var inputzx = document.createElement('div');
        inputzx.setAttribute('id', 'allzx');
        inputzx.setAttribute('type', 'button');
        inputzx.setAttribute('class', 'back_color');
        //inputzx.value = "在线";
        inputzx.innerText = "在线";
        inputzx.align = "center";
        inputzx.onclick = function () {
            //inputzx.setAttribute('class', 'color_front_1 color_queen_zx');
            inputqb.setAttribute('class', 'color_front');
            inputzx.setAttribute('class', 'color_queen');
            inputlx.setAttribute('class', 'color_front');
            //inputsx.setAttribute('class', 'back_color');
            isInOut = true;
            mapNew3D.loadInOutDeptTree(isInOut);
        }

        //离线
        //var inputlx = document.createElement('input');
        var inputlx = document.createElement('div');
        inputlx.setAttribute('id', 'alllx');
        inputlx.setAttribute('type', 'button');
        inputlx.setAttribute('class', 'back_color');
        //inputlx.value = "离线";
        inputlx.innerText = "离线";
        inputlx.align = "center";
        inputlx.onclick = function () {
            //inputlx.setAttribute('class', 'color_front_lx color_queen_lx');
            inputqb.setAttribute('class', 'color_front');
            inputzx.setAttribute('class', 'color_front');
            inputlx.setAttribute('class', 'color_queen');
            //inputsx.setAttribute('class', 'back_color');
            isInOut = false;
            mapNew3D.loadInOutDeptTree(isInOut);
        }

        //部门筛选
        //var inputsx = document.createElement('input');
        var inputsx = document.createElement('div');
        inputsx.setAttribute('id', 'allsx');
        inputsx.setAttribute('type', 'button');
        inputsx.setAttribute('class', 'back_color');
        //inputsx.value = "部门筛选";
        inputsx.innerText = "部门筛选";
        inputsx.align = "center";
        inputsx.onclick = function () {
            mapNew3D.filtrateRtDept();
            
            let lengthEmp = showChkRtEmp.length;
            //alert(lengthEmp);
            if (lengthEmp === 0) {
                inputsx.setAttribute('class', 'back_color');
            } else {
                inputsx.setAttribute('class', 'color_queen');
            }
        }

        $('#a5').append($(inputqb));
        $('#a5').append($(inputzx));
        $('#a5').append($(inputlx));
        $('#a5').append($(inputsx));
    },

    //查找在线人员信息
    allzx: function () {
       
        isInOut = true;
        mapNew3D.loadInOutDeptTree(isInOut);
    },
    //查找离线人员信息
    alllx: function () {
        isInOut = false;
        mapNew3D.loadInOutDeptTree(isInOut);
    },
    //查找筛选部门信息
    allsx: function () {
        alert("查找筛选部门信息");
    },

    showDivEmp: function (c_Str, imgg) {
        let divEmp = document.getElementById(c_Str);
        let divImg = document.getElementById(imgg);
        if (divEmp.style.display === 'none') {
            divEmp.style.display = 'block';
            divImg.src = './Scripts/images/12493937251.gif'

        } else {
            divEmp.style.display = 'none';
            divImg.src = './Scripts/images/12493937250.gif'

        }

    },
    DepartmentOfScreening: function () {
        var a6 = document.createElement('div');
        a6.setAttribute('id', 'a6');
        //var o = document.getElementById('#lefttop');
        //var h = o.offsetHeight;
        //var h1 = h - 133;
        var letop = $("#lefttop").height();
        var h1 = ((letop - 133) / letop)*100 ;
        //var h2 = h1 + "px";

   
        a6.style.height = "calc(100% - 180px)";
       
        $('#lefttop').append($(a6));
        var divMouse = document.createElement('div');
        divMouse.setAttribute('id', 'mouseps');
        divMouse.style.height = "20px";
        divMouse.style.color = "blue";
        divMouse.style.fontSize = "14px";
        //text-align:center;
        divMouse.style.textAlign = "center";
        divMouse.innerHTML = "";
        $('#lefttop').append($(divMouse));
 
    },
    //回车点击事件
    getKey: function getKey()  {  
        if (event.keyCode === 13) {
            sys.baseNew3D.seachEmpNew();
        }
    },
    createRegEdit1: function () {

        isSaveReg = false;
        clientMode.getfile("/RPM/3DJS/SettingEdit.html", function (data) {
            jQuery("#formEditDialog").html(data);
            var titleReg = "设置显示";
            //isChkAttReg = ischk; 
            document.getElementById("ro").checked = isChkAttReg;
            document.getElementById("ra").checked = isChkAlmReg;
            document.getElementById("st").checked = isChkStaShow;
            document.getElementById("chkRtT").checked = isChkTrackShow;
            jQuery("#formEditDialog").dialog({
                title: titleReg,
                modal: true,
                autoOpen: true,
                width: 450,
                position: ['center', 50],
                close: function (event, ui) {
                    //$("#formEditDialog").dialog("destroy");
                    //$("#formEditDialog").html("");
                    sys.baseNew3D.indexClose();
                    selfDraw = undefined;
                    selfShape = undefined;
                    editReg = "";
                }
            });
        });
    },
    indexClose: function () {

    },

    //显示电子点名
    clickRoll: function () {
        
        let ischk = document.getElementById("ro").checked;
        isChkAttReg = ischk; 
        sys.baseNew3D.isshowRegWL(ischk, 'rollcallRegion');
    },
    //显示电子围栏
    clickRail: function () {

        let ischk = document.getElementById("ra").checked;
        isChkAlmReg = ischk;
        sys.baseNew3D.isshowRegWL(ischk, 'alarmRegion');
    },
    //显示基站
    clickStation: function () {
        let ischk = document.getElementById("st").checked;
        isChkStaShow = ischk;
        sys.baseNew3D.isshowSta(ischk);
    },
    colorqb: function () {

    },
    //显示轨迹
    showRt: function () {
        let chkrt = document.getElementById("chkRtT").checked;
        isChkTrackShow = chkrt;
        sys.baseNew3D.showRtTrack(1);
    },
}


//function show(c_Str, imgg) {
//    if (document.all(c_Str).style.display == 'none') {
//        document.all(c_Str).style.display = 'block';
//        document.all(imgg).src = './Scripts/images/12493937251.gif'
//    }
//    else {
//        document.all(c_Str).style.display = 'none';
//        document.all(imgg).src = './Scripts/images/12493937250.gif'
//    }

//}