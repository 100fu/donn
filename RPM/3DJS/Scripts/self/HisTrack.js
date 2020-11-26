
var proBar = undefined, proNum = 0, hisDrawTrack = [], trackAlt = 0, hisTotal = 0, hisNum = 0, chkTime = 100, sumToatl = 0, hisSetInte = undefined, isPause = true, isHisPlay = false, isClear = false;//底层选中元素
var progrebar = undefined, ismove = false, isShowBtn = false;
var randomHis = [];
var hisTrackTime = '100%', hisInter = 500, hisplayIndex = -1, playrate = 5;
var trackline = [], isShowLayer = false;
//var myarray = ["2019-10-01", "2019-10-02", "2019-10-03", "2019-10-04", "2019-10-05", "2019-10-06"];
var myarray = [];
var dtStart = "", dtEnd = "";


hisTrack = {
    LoadMap: function () {
        //查询是否启用热力图功能
        hisTrack.getHeadMapSet();
        map2dLayer.InitThreeScene('newmap3d');
        regionDraw = '';
        isOnlySel = false;
        isdraw = false;
        funbkemptree = 'map2dLayer.initHisEmpTree';

        // hisTrack.loadLeftDept();
        basicdata.loadTagList();
        callchangefloor = 'hisTrack.changefloor';
        callbackfloor = 'hisTrack.showLayerName';
    },

    changefloor: function () {
        hisTrack.clearPlay();
        headmap.loadmap();
    },

    showLayerName: function () {
        hisTrack.loadLeftDept();//加载 楼层信息 和 查询界面
        //headmap.loadmap();
    },
    loadLeftDept: function () {
        var div = document.createElement('div');
        div.setAttribute('id', 'lefthisTree');
        $('#newmap3d').append($(div));

        //clientMode.getfile('/RPM/3DJS/leftDivHis.html', function (data) {
        //    var div = document.getElementById('lefthisTree');
        //    div.innerHTML = data;
        //    map2dLayer.initTree('a6');
        //    let minDate = new Date();
        //    let md = minDate.getMinutes();
        //    $("#logmin").val(new Date(minDate.setMinutes(md - 120)).format("yyyy-MM-dd HH:mm:ss"));
        //    $("#logmax").val(new Date().format("yyyy-MM-dd HH:mm:ss"));
        //    map2dLayer.initLayerSel();
        //    hisTrack.initprogress(188);
        //});
        ////查询是否启用热力图功能
        //hisTrack.getHeadMapSet();

        clientMode.getfile('/RPM/3DJS/leftDivHisOne.html', function (data) {
            var div = document.getElementById('lefthisTree');
            div.innerHTML = data;
            //map2dLayer.initTree('a6');
            let minDate = new Date();
            let md = minDate.getMinutes();
            //$("#logmin").val(new Date(minDate.setMinutes(md - 120)).format("yyyy-MM-dd HH:mm:ss"));
            dtStart = minDate.format("yyyy-MM-dd") + " 00:00:00";
            dtEnd = minDate.format("yyyy-MM-dd HH:mm:ss");
            $("#logmin").val(minDate.format("yyyy-MM-dd") + " 00:00:00");
            $("#logmax").val(minDate.format("yyyy-MM-dd HH:mm:ss"));
            map2dLayer.initLayerSel();
            //hisTrack.initprogress(188);

            hisTrack.initprogress(214);
            // hisTrack.getHeadMapSet();
            headmap.loadmap();
            if (isShowBtn === true) {
                let btnHM = document.getElementById("hisheadmap");

                btnHM.style.cssText = "display:block;";
            }
        });

    },


    /***********************历史轨迹回放***********************************************************/

    searchEmp: function (selType, txtsel) {
        // layer.msg('id:' + selType + ", txt" + txtsel, { icon: 5, time: 3000 });
        if (selType === 1) {
            if (isHisPlay) {
                layer.msg('是否结束历史回放？', {
                    time: 0 //不自动关闭
                    , btn: ['是', '否']
                    , yes: function (index) {
                        layer.close(index);
                        isHisPlay = false;
                        // hisTrack.changeEmpVilible(true); //显示实时人员                       
                        hisTrack.clearPlay();

                        //hisTrack.isVisibleRtMes(true);
                        var isHEmp = hisTrack.lookAtEmp(txtsel);
                        if (isHEmp === false) {
                            layer.msg(txtsel + '信息没有查到...', { icon: 5, time: 3000 });
                        }
                        // hisTrack.searchPostHisMes();
                    }, btn2: function () {
                        layer.close();
                    }
                });
            } else {
                isHisPlay = false;
                var isHEmp = hisTrack.lookAtEmp(txtsel);
                if (isHEmp === false) {
                    layer.msg(txtsel + '信息没有查到...', { icon: 5, time: 3000 });
                }
            }
        }

    },
    cLogminFun: function (dp) {
        let date = $dp.cal.getNewDateStr(); // $("#logmin").val();
        dtStart = date;
        // hisTrack.BookingRmk(date);
        //let end = changeDateValue(date, 1440);
        //if (end.length === 10) {
        //    end = end + " 23:59:59";
        //}
        //$("#logmax").val(end);
        if (dtEnd !== "") {
            let dateTime = getDateDiff(dtStart, dtEnd, 2);
            if (dateTime > 1440) {
                //   layer.msg('开始时间和结束时间不能超过24小时,且不能跨天...', { icon: 5, time: 3000 });
                hisTrack.setLoginMinMax(dtStart, 0);
            } else if (dateTime < 0) {
                layer.msg('开始时间不能大于结束时间...', { icon: 5, time: 3000 });
                hisTrack.setLoginMinMax(dtEnd, 0);
            }
        } else if (dtEnd === "") {
            hisTrack.setLoginMinMax(dtStart, 0);
        }
    },
    cLogmaxFun: function (dp) {
        let date = $dp.cal.getNewDateStr(); //$("#logmax").val();//dp.cal.getNewDateStr();
        dtEnd = date;
        if (dtStart !== "") {
            let dateTime = getDateDiff(dtStart, dtEnd, 2);
            if (dateTime > 1440) {
                // layer.msg('开始时间和结束时间不能超过24小时,且不能跨天...', { icon: 5, time: 3000 });
                hisTrack.setLoginMinMax(dtEnd, 0);

            } else if (dateTime < 0) {
                layer.msg('结束时间不能小于开始时间...', { icon: 5, time: 3000 });
                hisTrack.setLoginMinMax(dtStart, 0);

            }
        } else if (dtStart === "") {
            hisTrack.setLoginMinMax(dtEnd, 0);
        }
        //let begin = changeDateValue(date, -1440);
        //if (begin.length === 10) {
        //    begin = begin + " 00:00:00";
        //}
        //$("#logmin").val(begin);
    },
    hisSearchMes: function (data) {

        if (data !== null && data.length > 0) {
            //清空所有的历史轨迹
            hisTrack.clearHisTrack();
            hisTotal = data.length;  //数据总长度
            hisplayIndex = -1;
            hisDrawTrack = [];
            hisDrawTrack = data;
            // let jsonstr = JSON.stringify(data);
            // 存储json字符串  
            //window.localStorage.setItem('histrack', jsonstr);
            let item = hisDrawTrack[0];
            if (item !== undefined) {
                hisTrackTime = item.chkTime.replace('T', ' ').substring(0, 19);
            }


            progrebar.changetext(0);
            //document.getElementById("hisProIndex").innerHTML = "播放 0/" + hisTotal;
            document.getElementById("hisProIndex").innerHTML = "进度:0/100";

        }
    },
    createHisObj: function (item) {
        var ps = new Point3D_Str(item.Position);
        var emp = { tName: item.EmpName, tCode: item.tagCode, tagCode: item.tagCode, position: new Point3D_CM(ps), icon: fileParam.empIcon + 'hisemp.png' };
        var empIcon = basicdata.createRtIcon(emp);//sys.draw.createRtIcon(emp);
        empIcon.objType = 'emp_his';

        empIcon.drawcolor = hisTrack.getRandomColor() * 0xffffff;  // Math.random() * 0xffffff; //随机色
        empIcon.trackList = trackline; //实时轨迹集合
        empIcon.showName = emp.tName;//人员姓名
        empIcon.PrePoint = new THREE.Vector3(emp.position.X, emp.position.Y, emp.position.Z);

        //czlt-20180408 添加到地图plan中
        // sys.MapData.AddObj3DList(empIcon);
        map2dLayer.AddObj2DRegion(empIcon);

    },

    //readHisPosition: function () {
    //    if (isPause === true)
    //        return;
    //    if (hisDrawTrack.length > 0) {
    //        if (sumToatl >= chkTime) {
    //            sumToatl = 0;
    //            let item = hisDrawTrack.shift();
    //            let ps = new Point3D_Str(item.Position);
    //            let position = new Point3D_CM(ps);
    //            if (hisDrawTrack.length > 0) {
    //                let end = hisDrawTrack[0];
    //                let date1 = new Date(item.chkTime.replace('T', ' '))
    //                let date2 = new Date(end.chkTime.replace('T', ' '))
    //                let s1 = date1.getTime(), s2 = date2.getTime();
    //                chkTime = (s2 - s1);
    //                // chkTime = timeInterval(item.chkTime.replace('T', ' '), end.chkTime.replace('T', ' '));
    //            } else {
    //                chktime = 10;
    //            }
    //            chkTime = chkTime + trackAlt;
    //            if (chkTime <= 10)
    //                chkTime = 10;
    //            else if (chkTime >= 500) {
    //                chkTime = 500;
    //            }
    //            let index = hisTotal - hisDrawTrack.length;
    //            let indexPre = parseFloat((index / hisTotal) * 100);
    //            hisTrackTime = item.chkTime.replace('T', ' ');
    //            progrebar.changetext(indexPre);
    //            document.getElementById("hisProIndex").innerHTML = "播放 " + index + '/' + hisTotal;

    //            let rtPs = new THREE.Vector3(position.X, position.Y, position.Z);
    //            //判断有没有该标签有的话修改路径，没有创建对象
    //            let isHave = map2dLayer.IsExistHisEmpObj3D(item.tagCode);
    //            if (isHave === false) {
    //                hisTrack.createHisObj(item); //创建历史轨迹对象
    //            }
    //            else {
    //                hisTrack.drawHisTrack(item.tagCode, rtPs);
    //            }
    //        } else {
    //            sumToatl = 10 + sumToatl;
    //        }
    //    } else {
    //        if (hisSetInte !== undefined) {
    //            sumToatl = 0;
    //            chkTime = 100;
    //            window.clearInterval(hisSetInte);
    //            isClear = false;
    //            isPause = true;
    //            document.getElementById("btnPlay").setAttribute('class', 'fa fa-play fa-lg icon-a');

    //            layer.msg('是否删除历史轨迹？', {
    //                time: 0 //不自动关闭
    //                , btn: ['是', '否']
    //                , yes: function (index) {
    //                    layer.close(index);
    //                    isHisPlay = false;
    //                    // hisTrack.changeEmpVilible(true); //显示实时人员
    //                    // hisTrack.isVisibleRtMes(true);
    //                    hisTotal = 0;
    //                    document.getElementById("hisProIndex").innerHTML = "播放 0/0";
    //                    // proBar.animate(0);
    //                    progrebar.changetext(0);
    //                    hisTrack.clearHisTrack();
    //                }, btn2: function () {
    //                    layer.close();
    //                }
    //            });
    //        }
    //    }
    //},

    ///播放
    hisPlay: function () {
        if (isPause === true) {
            if (hisTotal > 0) {

                if (isClear === false) {
                    layer.load(0);
                    isShowLayer = true;

                    if (hisDrawTrack.length === 0) {
                        hisTrack.getHisDrawTracklocal();
                    }

                    isClear = true;
                    setTimeout(() => {
                        //画出所有轨迹线
                        // let trlines = hisTrack.drawAllMoveline();
                        ///创建路径
                        //hisTrack.createHisObj(hisDrawTrack[0]); //创建历史轨迹对象

                        setTimeout(() => { hisTrack.createHisSetInter(); }, 50);

                    }, 10);




                }
                isHisPlay = true;
                isPause = false;
                ismove = false;
                trackAlt = 0;
                //   div.setAttribute('id', 'rtshortkey');
                document.getElementById("btnPlay").setAttribute('class', 'fa fa-pause fa-lg icon-a');
                document.getElementById("btnPlay").setAttribute('title', '暂停');
                // layer.msg('点击播放', { time: 800 });

            }
        } else {
            isPause = true;
            document.getElementById("btnPlay").setAttribute('class', 'fa fa-play fa-lg icon-a');
            document.getElementById("btnPlay").setAttribute('title', '播放');
        }
    },
    //快退
    hisBackward: function () {
        playrate++;
        if (playrate > 9) {
            playrate = 9;
            return;
        }
        let text = hisTrack.setPlayState(playrate);
        document.getElementById("hisPlayRate").innerHTML = "速率:" + text;
    },

    //快进
    hisForward: function () {
        playrate--;
        if (playrate < 1) {
            playrate = 1;
            return;
        }
        let text = hisTrack.setPlayState(playrate);
        document.getElementById("hisPlayRate").innerHTML = "速率:" + text;
    },
    createProBar: function () {
        this.num = 0;
        this.controlBar = $('#lefthisTree .number-pb').NumberProgressBar({
            duration: 3000,
            percentage: this.num
        });

        this.animate = function (val) {
            if (val < 0) {
                this.num = 0;
            } else if (val > 100) {
                this.num = 100;
            } else {
                this.num = val;
            }
            this.controlBar.reach(this.num);
        };
    },
    clearPlay: function () {
        let hisPText = document.getElementById("hisProIndex");
        if (hisPText !== undefined) {
            document.getElementById("hisProIndex").innerHTML = "播放 0/0";
            if (progrebar !== undefined) {
                // proBar.animate(0);
                progrebar.changetext(0);
            }
            isPause = true;
            isClear = false;
            ismove = false;
            trackAlt = 0;
            document.getElementById("btnPlay").setAttribute('class', 'fa fa-play fa-lg icon-a');
            if (hisSetInte !== undefined) {
                sumToatl = 0;
                hisTotal = 0;
                chkTime = 100;
                window.clearInterval(hisSetInte);
                hisSetInte = undefined;
            }
            hisTrack.clearHisTrack();
        }
    },

    clearHisTrack: function () {
        var delObj = [];
        randomHis = [];
 
        let plan3DMode = map2dLayer.getFloor();
        $.each(plan3DMode.children, function (i, emp) {
            if (emp.objType === 'emp_his') {
                delObj.push(emp);
            }
        });
        if (delObj.length > 0) {
            $.each(delObj, (i, obj) => {
                $.each(obj.trackList, function (j, lid) {
                    let deltra = map2dLayer.GetFloorTrackLineById(lid);
                    map2dLayer.removeObjFromFloor(deltra);
                });
                map2dLayer.removeObjFromFloor(obj);
            });
        };
    },

    GetTrackLineById: function (lid) {
        let isHave = null;
        $.each(Obj3DList.children, function (i, line) {
            if (line.lid === lid) {
                isHave = line;
            }
        });
        return isHave;
    },

    //drawHisTrack: function (tagCode, ps) {
    //    let isHave = false;
    //    let plan3DMode = map2dLayer.getFloor();
    //    $.each(plan3DMode.children, function (i, emp) {
    //        if (emp.objType === 'emp_his') {
    //            if (emp.name === tagCode) {
    //                isHave = true;
    //                //转换坐标               
    //                var prePs = emp.PrePoint;
    //                emp.position.set(ps.x, ps.y - 40, ps.z);

    //                //画线
    //                var lid = prePs.x + ',' + prePs.y + ',' + prePs.z + '&' + ps.x + ',' + ps.y + ',' + ps.z;
    //                //var isHH = hisTrack.IsExistTrackLine(emp, lid);
    //                let isHH = map2dLayer.IsExistTrackLine(emp, lid);
    //                if (isHH === false) {
    //                    var points = [];
    //                    points.push(prePs);
    //                    points.push(ps);
    //                    emp.PrePoint = ps;
    //                    emp.trackList.push(lid);
    //                    var lineT = hisTrack.createLine(points, emp.drawcolor);
    //                    lineT.objType = 'emp_histrackline';
    //                    lineT.name = emp.name;
    //                    lineT.lid = lid;
    //                    // sys.MapData.AddObj3DList(lineT);
    //                    map2dLayer.AddObj2DRegion(lineT);
    //                }

    //            }
    //        }

    //    });
    //    return isHave;
    //},
    createLine: function (points, color) {
        let lineNew = sys.draw.drawObj2DLineString(points, color);
        //let lineNew = basicdata.drawObj2DLineString(points, color);
        return lineNew;
    },

    /*************历史轨迹信息查询********************************************/
    //查询历史数据
    searchHisMes: function () {
        if (hisTotal > 0) {
            layer.msg('是否结束当前操作，重新查询...', {
                time: 0 //不自动关闭
                , btn: ['是', '否']
                , yes: function (index) {
                    layer.close(index);
                    hisTrack.clearPlay();
                    hisTrack.searchPostHisMes();
                }, btn2: function () {
                    layer.close();
                }
            });
        } else {
            hisTrack.searchPostHisMes();
        }
    },
    //GetHisTrackHeadMap
    searchPostHisMes: function () {
        var hisInfo = hisTrack.isHisValidity();
        if (hisInfo === "")
            return;
        layer.load(0);
        var urlPath = '/Graphic/GetHisTrack';
        clientMode.post(urlPath, hisInfo, function (data) {
            if (data !== null && data.length > 0) {
                hisTrack.hisSearchMes(data);
                layer.closeAll();
            }
            else {
                layer.closeAll();
                hisTotal = 0;  //数据总长度
                hisplayIndex = -1;
                hisDrawTrack = [];
                hisTrack.clearPlay();
                $('#text').html(dtStart);
                layer.msg('没有可播放的信息...', { icon: 5, time: 3000 });
            }

        });
    },
    isHisValidity: function (itype) {

        // let checkedIds = deptTreeControl.getCheckedItems().ids;
        let checkedIds = "";
        let txtsel = $("#input1").val();//$("#txtsel").val();
        if (txtsel === "" && checkedIds.length === 0) {
            if (itype === undefined) {
                var strMes = "";
                strMes = "请选择回放人员...";
                layer.msg(strMes, { icon: 5, time: 3000 });
                return "";
            }
        } else if (txtsel === "" && checkedIds.length > 3) {
            layer.msg("同时回放人数不能超过3人...", { icon: 5, time: 3000 });
            return "";
        } else if (txtsel !== "" && checkedIds.length > 2) {
            // if (checkedIds.)
            if ($.inArray(txtsel, checkedIds) === -1) {
                layer.msg("同时回放人数不能超过3人...", { icon: 5, time: 3000 });
                return "";
            }
        }
        let begin = $("#logmin").val();
        if (begin === "") {
            layer.msg("开始时间不能为空...", { icon: 5, time: 3000 });
            return "";
        }
        let end = $("#logmax").val();
        if (end === "") {
            layer.msg("结束时间不能为空...", { icon: 5, time: 3000 });
            return "";
        }

        let dateTime = getDateDiff(dtStart, dtEnd, 2);
        if (dateTime > 1440) {
            //  layer.msg('开始时间和结束时间不能超过24小时,且不能跨天...', { icon: 5, time: 3000 });
            return "";
        }

        if (txtsel !== "")
            txtsel = "'" + txtsel + "'";

        if (checkedIds.length > 0) {
            checkedIds.forEach(n => {
                if (txtsel !== "")
                    txtsel += ","
                txtsel += "'" + n + "'";
            });
        }
        // alert(curFloor);
        let hisInfo = { tName: txtsel, startTime: begin, endTime: end, strFloor: curFloor };

        //        //string tag, string start, string end
        let hisWhere = { tag: 103, start: begin, end: end };
        //  hisTrack.getHisTrackTest(hisWhere);
        return hisInfo;
    },

    initprogress: function (strval) {
        progrebar = {
            statu: false,
            ox: 0,
            lx: 0,
            left: 0,
            bgleft: 0,
            maxlen: 200,
            init: function () {
                $('#btn').bind('mousedown', function (e) {
                    progrebar.lx = $('#btn').offset().left;
                    progrebar.ox = e.pageX - progrebar.left;
                    progrebar.statu = true;
                });
                $(document).bind('mouseup', function () {
                    progrebar.statu = false;
                });
                $('#box').bind('mousemove', function (e) {
                    if (progrebar.statu) {
                        let proper = parseFloat((e.pageX - $('#bg').offset().left) / progrebar.maxlen) * 100;
                        proper = roundNum1(proper);
                        hisTrack.moveemptrack(proper);

                    }
                });
                $('#bg').bind('click', function (e) {
                    let proper = parseFloat((e.pageX - $('#bg').offset().left) / progrebar.maxlen) * 100;
                    proper = roundNum1(proper);
                    progrebar.statu = false;
                    hisTrack.moveemptrack(proper);

                });

            },
            changetext: function (txtval) {
                txtval = progrebar.maxlen * (txtval / 100);
                progrebar.bgleft = 0; //$('#bg').offset().left;
                progrebar.left = txtval - progrebar.bgleft;
                if (progrebar.left < 0) {
                    progrebar.left = 0;
                }
                if (progrebar.left > progrebar.maxlen) {
                    progrebar.left = progrebar.maxlen;
                }
                $('#btn').css('left', progrebar.left);
                $('#bgcolor').stop().animate({ width: progrebar.left }, 10);
                let proval = parseFloat(progrebar.left / progrebar.maxlen) * 100;
                proval = roundNum1(proval);
                $('#text').html(hisTrackTime);
                //if (proval === '0.0' || proval==='100.0') {
                //    $('#text').html(proval);
                //} else {
                //    $('#text').html(hisTrackTime);
                //}

                // $('#text').html(proval + '%');
            }

        };
        progrebar.maxlen = Number(strval);
        progrebar.init();
        progrebar.changetext(100);
    },

    //moveemptrack: function (val) {
    //    ismove = true;
    //    if (val >= 100) {
    //        console.log(' move 100');
    //    }
    //    let movetotal = (parseFloat(val) / 100) * Number(hisTotal);
    //    let calctotal = movetotal - Number(hisTotal - hisDrawTrack.length);
    //    if (calctotal <= 0) {
    //        hisTrack.getHisDrawTracklocal();
    //        calctotal = movetotal;
    //        //ismove = false;
    //    }

    //    for (var i = 0; i < calctotal; i++) {
    //        hisTrack.movedrawTL();
    //    }
    //    let index = hisTotal - hisDrawTrack.length;
    //    document.getElementById("hisProIndex").innerHTML = "播放 " + index + '/' + hisTotal;
    //    progrebar.changetext(val);
    //    ismove = false;
    //},
    moveemptrack: function (val) {
        ismove = true;
        let movetotal = (parseFloat(val) / 100) * Number(hisTotal);
        let calctotal = Math.floor(movetotal);  //movetotal - Number(hisTotal - hisDrawTrack.length);
        if (calctotal >= hisTotal) {
            calctotal = hisTotal;
            hisplayIndex = (calctotal - 1);
        }

        //hisplayIndex = calctotal;
        //let item = hisDrawTrack[calctotal];
        //if (item !== undefined) {
        //    let ps = new Point3D_Str(item.Position);
        //    hisTrackTime = item.chkTime.replace('T', ' ').substring(0, 19);
        //    let position = new Point3D_CM(ps);
        //    let rtPs = new THREE.Vector3(position.X, position.Y, position.Z);
        //    hisTrack.drawHisTrack(item.tagCode, rtPs);
        //}

        if (val >= 100) {

            val = 100;
            calctotal = (hisTotal - 1);
            document.getElementById("hisProIndex").innerHTML = "进度:100/100";
        } else {

            // document.getElementById("hisProIndex").innerHTML = "播放 " + index + '/' + hisTotal;
            document.getElementById("hisProIndex").innerHTML = "进度:" + val.toFixed(2) + '/100';
        }
        hisplayIndex = calctotal;
        let item = hisDrawTrack[calctotal];
        if (item !== undefined) {
            let ps = new Point3D_Str(item.Position);
            hisTrackTime = item.chkTime.replace('T', ' ').substring(0, 19);
            let position = new Point3D_CM(ps);
            let rtPs = new THREE.Vector3(position.X, position.Y, position.Z);
            hisTrack.drawHisTrack(item.tagCode, rtPs);
        }
        progrebar.changetext(val);
        ismove = false;
    },
    movedrawTL: function () {
        if (hisDrawTrack.length === 0)
            return;
        let item = hisDrawTrack.shift();
        let ps = new Point3D_Str(item.Position);
        let position = new Point3D_CM(ps);
        var rtPs = new THREE.Vector3(position.X, position.Y, position.Z);
        //判断有没有该标签有的话修改路径，没有创建对象
        let isHave = map2dLayer.IsExistHisEmpObj3D(item.tagCode);
        if (isHave === false) {
            hisTrack.createHisObj(item); //创建历史轨迹对象
        } else {
            hisTrack.drawHisTrack(item.tagCode, rtPs);
        }
    },
    getHisDrawTracklocal: function () {
        //let strjson = window.localStorage.getItem('histrack');
        //// 还原json对象  
        //hisDrawTrack = JSON.parse(strjson);
        ////czlt-20191014 不清理历史轨迹
        //// hisTrack.clearHisTrack();   
        hisTrack.clearPlay();
        hisTrack.searchPostHisMes();
    },
    getHisTrackTest: function (hisInfo) {
        ////ThreeModel/GetHisEmpInfo
        if (hisInfo === "")
            return;
        var urlPath = '/ThreeModel/GetHisEmpInfo';

        clientMode.post(urlPath, hisInfo, function (data) {
            alert(data.length);
        });
    },
    //生成随机数
    getRandomColor() {
        let rc = Math.random();
        if (randomHis.indexOf(rc) === -1) {
            randomHis.push(rc);
            return rc;
        } else {
            for (var i = 0; i < 3; i++) {
                rc = Math.random();
                if (randomHis.indexOf(rc) === -1) {
                    randomHis.push(rc);
                    return rc;
                }
            }
        }
        return rc;
    },

    drawAllMoveline() {
        if (hisDrawTrack.length === 0)
            return;



        var lineColor = hisTrack.getRandomColor() * 0xffffff;
        var item = hisDrawTrack[0];
        var ps = new Point3D_Str(item.Position);
        var position = new Point3D_CM(ps);
        var rtPs = new THREE.Vector3(position.X, position.Y, position.Z);
        var empname = item.tagCode;
        hisTrackTime = item.chkTime.replace('T', ' ').substring(0, 19);
        // checkedIds.forEach
        hisDrawTrack.forEach(item => {

            ps = new Point3D_Str(item.Position);
            position = new Point3D_CM(ps);
            ps = new THREE.Vector3(position.X, position.Y, position.Z);
            let dis = hisTrack.getDistance(rtPs.x, rtPs.y, ps.x, ps.y);
            //两点之间距离大于20cm 时画点
            if (dis > 20) {

                //画线
                let lid = rtPs.x + ',' + rtPs.y + ',' + rtPs.z + '&' + ps.x + ',' + ps.y + ',' + ps.z;
                let isHH = trackline.indexOf(lid);
                if (isHH === -1) {
                    let points = [];
                    points.push(rtPs);
                    points.push(ps);
                    trackline.push(lid);

                    var lineT = hisTrack.createLine(points, lineColor);
                    lineT.objType = 'emp_histrackline';
                    lineT.name = empname;
                    lineT.lid = lid;
                    map2dLayer.AddObj2DRegion(lineT);
                }
                rtPs = ps;
            }
            // }
        });

        return trackline;
    },

    drawHisTrack: function (tagCode, ps) {
        let isHave = false;
        let plan3DMode = map2dLayer.getFloor();
        $.each(plan3DMode.children, function (i, emp) {
            if (emp.objType === 'emp_his') {
                if (emp.name === tagCode) {
                    isHave = true;
                    let prePoint = emp.PrePoint;
                    //转换坐标               
                    //var prePs = emp.PrePoint;
                    emp.position.set(ps.x, ps.y - 40, ps.z);
                    emp.PrePoint = ps;

                    ///画轨迹线
                    hisTrack.createHisTrack(emp, ps, prePoint);
                }
            }

        });
        return isHave;
    },

    createHisSetInter() {
        if (hisSetInte === undefined)
            hisSetInte = setInterval(function () {
                if (ismove === false)
                    hisTrack.readHisPosition();  //对历史轨迹数据
            }, hisInter);
    },

    readHisPosition: function () {
        if (isPause === true)
            return;


        if (hisDrawTrack.length > 0) {
 
            hisplayIndex++;
            //if (hisplayIndex >= hisDrawTrack.length) {
            //    if (hisSetInte !== undefined) {
            //        window.clearInterval(hisSetInte);
            //        hisSetInte = undefined;
            //    }
            //    return;
            //}
            let item = hisDrawTrack.shift();
            //let item = hisDrawTrack[hisplayIndex];
            let ps = new Point3D_Str(item.Position);
            let position = new Point3D_CM(ps);
            let index = (hisplayIndex + 1); //hisTotal - hisDrawTrack.length;
            let indexPre = parseFloat((index / hisTotal) * 100);
            hisTrackTime = item.chkTime.replace('T', ' ').substring(0, 19);
            progrebar.changetext(indexPre);
            //document.getElementById("hisProIndex").innerHTML = "播放 " + index + '/' + hisTotal;

            if (indexPre === 100) {

                document.getElementById("hisProIndex").innerHTML = "进度:100/100";
            } else {
                document.getElementById("hisProIndex").innerHTML = "进度:" + indexPre.toFixed(2) + '/100';
            }

            let rtPs = new THREE.Vector3(position.X, position.Y, position.Z);
            //判断有没有该标签有的话修改路径，没有创建对象
            let isHave = map2dLayer.IsExistHisEmpObj3D(item.tagCode);
            if (isHave === false) {
                hisTrack.createHisObj(item); //创建历史轨迹对象              
            }
            else {
                hisTrack.drawHisTrack(item.tagCode, rtPs);
            }
            if (isShowLayer) {
                layer.closeAll();
                isShowLayer = false;
            }

        } else {
            if (hisSetInte !== undefined) {
                sumToatl = 0;
                chkTime = 100;
                window.clearInterval(hisSetInte);
                hisSetInte = undefined;
                isClear = false;
                isPause = true;
                document.getElementById("btnPlay").setAttribute('class', 'fa fa-play fa-lg icon-a');

                layer.msg('是否删除历史轨迹？', {
                    time: 0 //不自动关闭
                    , btn: ['是', '否']
                    , yes: function (index) {
                        layer.close(index);
                        isHisPlay = false;
                        hisTotal = 0;
                        document.getElementById("hisProIndex").innerHTML = "进度:0/0";

                        progrebar.changetext(0);
                        hisTrack.clearHisTrack();
                    }, btn2: function () {
                        layer.close();
                    }
                });
            }
        }
    },

    getDistance(x1, y1, x2, y2) {
        var _x = Math.abs(x1 - x2);
        var _y = Math.abs(y1 - y2);
        return Math.sqrt(_x * _x + _y * _y);

    },

    setPlayState(playindex) {
        let text = "正常";
        hisInter = 500;
        switch (playindex) {
            case 1:
                hisInter = 50;
                text = '快4';
                break;
            case 2:
                hisInter = 100;
                text = '快3';
                break;
            case 3:
                hisInter = 200;
                text = '快2';
                break;
            case 4:
                hisInter = 300;
                text = '快1';
                break;
            case 5:
                hisInter = 500;
                text = '正常';
                break;
            case 6:
                hisInter = 800;
                text = '慢1';
                break;
            case 7:
                hisInter = 1000;
                text = '慢2';
                break;
            case 8:
                hisInter = 1500;
                text = '慢3';
                break;
            case 9:
                hisInter = 2000;
                text = '慢4';
                break;
            default:
                hisInter = 500;
                text = '正常';
        }
        if (hisSetInte !== undefined) {
            window.clearInterval(hisSetInte);
            hisSetInte = undefined;
        }
        hisTrack.createHisSetInter();

        return text;

    },

    getHisDate() {
        var event = window.event || arguments.callee.caller.arguments[0];
        if (event.keyCode === 13) {
            hisTrack.showHisDate();
        }
    },
    showHisDate() {
        let urlPath = '/Graphic/GetHisTrackDate';
        let txtsel = $("#input1").val();
        if (txtsel === "") {
            var strMes = "";
            strMes = "请选择回放人员...";
            layer.msg(strMes, { icon: 5, time: 3000 });
            return "";
        }
        myarray = [];
        let hisInfo = { tagcode: txtsel, strdate: dtStart };
        clientMode.post(urlPath, hisInfo, function (data) {
            if (data !== null && data.length > 0) {
                data.forEach(o => {
                    myarray.push(o);
                });
            }
        });
    },
    setLoginMinMax(chktime, numtime) {

        let date = changeDateValue(chktime, numtime);
        let curdate = getCurrentDate();
        let begin = '';
        let end = '';
        begin = date + " 00:00:00";
        if (curdate === date) {
            end = timeFormate("");
        } else {
            end = date + " 23:59:59";
        }
        dtStart = begin;
        dtEnd = end;
        $("#logmin").val(begin);
        $("#logmax").val(end);
    },

    //GetHisTrackHeadMap
    searchHeadMapMes: function () {
        var hisInfo = hisTrack.isHisValidity("headmap");
        if (hisInfo === "")
            return;
        layer.load(0);
        var urlPath = '/Graphic/GetHisTrackHeadMap';
        clientMode.post(urlPath, hisInfo, function (data) {
            if (data !== null && data.length > 0) {
                headmap.refreshData(data);
                layer.closeAll();
            }
            else {
                layer.closeAll();
                layer.msg('没有可绘制的信息...', { icon: 5, time: 3000 });
            }
        });
    },
    //历史热力图显示设置
    getHeadMapSet: function () {
        let urlPath = "/Graphic/GetRpmSysOption";
        let strJson = { strkey: 'ExteFun' };
        clientMode.post(urlPath, strJson, function (data) {
            if (data.length > 0) {
                let obj = JSON.parse(data);
                isShowBtn = obj.IsShowHeadMap;
                let btnHM = document.getElementById("hisheadmap");
                if (obj.IsShowHeadMap === true && isShowBtn !== undefined) {
                    if (btnHM !== null) {
                        btnHM.style.cssText = "display:block;";
                    }
                    //    //headmap.loadmap();

                }
            }
        });
    },

    createHisTrack(emp, ps, prePs) {
        //画线
        var lid = prePs.x + ',' + prePs.y + ',' + prePs.z + '&' + ps.x + ',' + ps.y + ',' + ps.z;
        let isHH = map2dLayer.IsExistTrackLine(emp, lid);
        if (isHH === false) {
            var points = [];
            points.push(prePs);
            points.push(ps);
            emp.PrePoint = ps;
            emp.trackList.push(lid);
            var lineT = hisTrack.createLine(points, emp.drawcolor);
            lineT.objType = 'emp_histrackline';
            lineT.name = emp.name;
            lineT.lid = lid;
            map2dLayer.AddObj2DRegion(lineT);
            if (emp.trackList.length > 100) {
                //移除
                let removeid = emp.trackList.shift();
                let delObj = map2dLayer.GetFloorTrackLineById(removeid);
                map2dLayer.removeObjFromFloor(delObj);
            }
        }
    },

}