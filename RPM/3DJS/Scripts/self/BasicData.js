var EmpTagList = [];
var TagList = [];
var DeptList = {};
var VideoInfoList = {};
var almInfoList = {};
///web客户端通信
var webSk = undefined;
var callbackfun = '', callchangefloor = '', funbkemptree = '', callbackmqtt = '';
var DevTagList = [];
var mapHeight = 900;
// basicdata.saveOneRegMode
basicdata = {
    loadEmpTagList: function () {
        EmpTagList = [];
        clientMode.post("/Graphic/GetEmpTagList", null, (data) => {
            //       $.each(data, function (i, tag) {
            data.forEach((d) => {
                EmpTagList.push(d);
            });
        })
    },
    //basicdata.loadTagList
    loadTagList: function () {
        var urlPath = '/Graphic/GetTagAllInfo';  //GetTagAllInfo
        clientMode.post(urlPath, null, function (data) {
            if (data.length > 0) {
                TagList = [];
                $.each(data, function (i, rtMes) {
                    let deptId = rtMes.EmpInfo !== null ? rtMes.EmpInfo.IdDepartment : (rtMes.DevInfo !== null ? rtMes.DevInfo.IdDepartment : "");
                    let tel = rtMes.EmpInfo !== null ? rtMes.EmpInfo.Telephone : (rtMes.DevInfo !== null ? rtMes.DevInfo.DriverTel : "");
                    let objNum = rtMes.EmpInfo !== null ? rtMes.EmpInfo.Code : (rtMes.DevInfo !== null ? rtMes.DevInfo.Code : "");
                    let remark = rtMes.EmpInfo !== null ? rtMes.EmpInfo.Description : (rtMes.DevInfo !== null ? rtMes.DevInfo.Description : "");
                    let Id = rtMes.EmpInfo !== null ? rtMes.EmpInfo.Id : (rtMes.DevInfo !== null ? rtMes.DevInfo.Id : "");
                    let deptname = rtMes.EmpInfo !== null ? (rtMes.EmpInfo.Department.Name) : (rtMes.DevInfo !== null ? (rtMes.DevInfo.Department !== null ? rtMes.DevInfo.Department.Name : "无") : "无");
                    let dutyname = rtMes.EmpInfo !== null ? (rtMes.EmpInfo.DutyInfo !== null ? rtMes.EmpInfo.DutyInfo.Name : "无") : "无";

                    //description
                    if (rtMes.TName !== null) {
                        var tag = { tName: rtMes.TName, tCode: rtMes.TagNo.toLowerCase(), tagCode: rtMes.TagNo.toLowerCase(), deptid: deptId, useState: rtMes.TagState, tel: (tel !== null ? tel : ""), objNum: (objNum !== null ? objNum : ""), remark: (remark !== null ? remark : ""), floor: '', guid: Id, TagType: 0, Voltage: 390, deptname: deptname, dutyname: dutyname,online:false };

                        TagList.push(tag);
                    }
                });
            }
        });
    },

        //basicdata.loadDevTagList
    loadDevTagList: function () {
        var urlPath = '/Graphic/GetTagAllInfo';  //GetTagAllInfo
        clientMode.post(urlPath, null, function (data) {
            if (data.length > 0) {
                TagList = [];
                $.each(data, function (i, rtMes) {
                    if (rtMes.TagState === 2) {
                        let devid = rtMes.DevInfo !== null ? rtMes.DevInfo.Id : "";
                        let assetname = rtMes.DevInfo !== null ? rtMes.DevInfo.Name : "";
                        let idasset = rtMes.DevInfo !== null ? rtMes.DevInfo.Code : "";
                        let tel = rtMes.EmpInfo !== null ? rtMes.EmpInfo.Telephone : (rtMes.DevInfo !== null ? rtMes.DevInfo.DriverTel : "");
                        let devtag = { id: devid, assetName: assetname, idAsset: idasset, terminalName: rtMes.TagNo.toLowerCase(), idTerminal: rtMes.TagNo.toLowerCase(), useState: rtMes.TagState, tel: (tel !== null ? tel : ""), terminalStatus: false };
                        DevTagList.push(devtag);
                    }
                });
            }
        });
    },
    loadAlarmInfo: function () {
        almInfoList = [];
        clientMode.post("/Graphic/GetAlmInfo", null, (data) => {

            data.forEach((d) => {
                // almInfoList.push(d);
                almInfoList[d.IPAddress] = d;
            });
        })
    },
    //查找人员信息
    loadDeptInfo: function () {
        //DeptList
        clientMode.post("/Graphic/GetDeptInfoList", null, function (data) {
            if (data !== null) {
                data.forEach(function (item) {
                    DeptList[item.Id] = item;
                });
            }
        });
    },

    ////查询所有的摄像机
    //loadVideoInfo: function () {
    //    //DeptList
    //    clientMode.post("/Graphic/GetAllVideo", null, function (data) {
    //        if (data != null) {
    //            data.forEach(function (item) {
    //                VideoInfoList[item.IPAddress] = item;
    //            })
    //        }
    //    });
    //},

    loadvideo2D: function (planMap3D, floor) {
        let color = '#A020F0';
        let urlPath = '/Graphic/GetVideoInfoList';
        let selfPlan = planMap3D;
        let selfFloor = floor;
        VideoInfoList = {};
        clientMode.post(urlPath, null, function (data) {
            if (data.length > 0) {
                data.forEach((item) => {
                    if (item.Position !== null && item.Floor === floor) {
                        VideoInfoList[item.IPAddress] = item;
                        let strList = item.Position.split(',');
                        if (strList.length > 1) {
                            let ps = { X: strList[0], Y: strList[1], Z: strList[2] };
                            let psNew = new Point3D_CM(ps);  //完成坐标偏移
                            let video = basicdata.createIcon(psNew, 'video_48.png');
                            video.objType = 'video';
                            // sta.origPosition = ps;
                            video.name = item.Id;
                            video.floor = floor;
                            video.origPosition = ps; //原始坐标
                            video.diffPosition = psNew; //纠偏后坐标
                            video.showname = item.Name;
                            video.showcode = item.Code;
                            video.DeviceID = item.DeviceID; //GBT28181 设备编号
                            video.ChannelID = item.ChannelID; //GBT28181 通道编号
                            video.ip = item.IPAddress; //IP地址
                            //判定有没有之后再添加
                            let isHave = sys.MapData.IsExistObj(selfPlan, video.name);
                            if (isHave === false)
                                selfPlan.add(video);
                        }
                    }
                });

                if (callbackdrawReg !== '') {
                    funcallback(eval(callbackdrawReg));
                    callbackdrawReg = '';
                }
            }
        });
    },
    loadStation2D: function (planMap3D, floor) {
        let color = '#A020F0';
        let urlPath = '/Graphic/GetStaInfoList';
        let selfPlan = planMap3D;
        let selfFloor = floor;
        clientMode.post(urlPath, null, function (data) {
            if (data.length > 0) {
                $.each(data, function (i, item) {
                    if (item.Position !== null && item.Floor === floor) {
                        var strList = item.Position.split(',');
                        //sys.baseNew3D.addStationList(item);
                        if (strList.length > 1) {
                            let ps = { X: strList[0], Y: strList[1], Z: strList[2] };
                            let psNew = new Point3D_CM(ps);  //完成坐标偏移
                            let sta = basicdata.createIcon(psNew, 'wifi_48.png');  //sys.draw.initPoint3d(psNew, color);
                            sta.objType = 'sta';
                            // sta.origPosition = ps;
                            sta.staId = item.Id;
                            sta.name = item.Id;
                            sta.floor = floor;
                            sta.origPosition = ps;
                            sta.showname = item.Name;
                            sta.showcode = item.Code;
                            // sta.position.set((psNew.X), (psNew.Y), (staHeight / 2));
                            //判定有没有之后再添加
                            let isHave = sys.MapData.IsExistObj(selfPlan, sta.name);
                            if (isHave === false)
                                selfPlan.add(sta);

                        }
                    }
                });
            }
        });
    },
    getAlarmMode: function (ip) {
        let almInfo = null;
        for (var n in almInfoList) {
            if (ip === n)
                almInfo = almInfoList[n];
        }
        return almInfo;
    },
    getRatioPic: function () {
        let mapInfo = getLayerByName(curFloor);
        let maxValue = mapInfo.mapHeight > mapInfo.mapWidth ? mapInfo.mapHeight : mapInfo.mapWidth;
        let ratioPic = maxValue / 1000;
        if (ratioPic < 2)
            ratioPic = 2;
        return ratioPic;

    },

    createIcon: function (point, icon) {
        let fileMPath = fileParam.img_path + '/' + icon;
        let loader = new THREE.TextureLoader();
        let clothTexture = loader.load(fileMPath);
        clothTexture.anisotropy = 16;
        var clothMaterial = new THREE.MeshLambertMaterial({
            map: clothTexture,
            side: THREE.DoubleSide,
            alphaTest: 0.5
        });

        //var maxValue = sysConfig.mapHeight > sysConfig.mapWidth ? sysConfig.mapHeight : sysConfig.mapWidth;
        //var ratioPic = maxValue / 1000;
        let ratioPic = basicdata.getRatioPic();
        var picW = 32, picH = 32;
        picW = picH = picW * (ratioPic - 1);
        if (picW > 120)
            picW = picH = 120;

        clothGeometry = new THREE.ParametricGeometry(basicdata.drawPlane(picW, picH), 5, 10);

        sphere = new THREE.Mesh(clothGeometry, clothMaterial);
        sphere.castShadow = true;

        //  sphere.rotateX(Math.PI / 9); //沿X轴方向选中30°     
        sphere.position.set(point.X, point.Y, 10);
        //  sphere.name = emp.tagCode;
        sphere.customDepthMaterial = new THREE.MeshDepthMaterial({
            depthPacking: THREE.RGBADepthPacking,
            map: clothTexture,
            alphaTest: 0.5
        });
        //  var txt = sys.draw.createText(emp);
        //  txt.name = emp.tagCode;
        //  sphere.add(txt);

        return sphere;

    },
    createRtIcon: function (emp) {
        //var fileMPath = fileParam.empIcon + "emp_12.png";
        var fileMPath = emp.icon;
        var loader = new THREE.TextureLoader();
        var clothTexture = loader.load(fileMPath);
        clothTexture.anisotropy = 16;
        var clothMaterial = new THREE.MeshLambertMaterial({
            map: clothTexture,
            side: THREE.DoubleSide,
            alphaTest: 0.5
        });
        //basicdata.drawPlane(19, 33)
        var picW = 33;
        let ratioPic = basicdata.getRatioPic();
        picW = picW * (ratioPic - 1);
        if (picW > 160)
            picW = 160;

        clothGeometry = new THREE.ParametricGeometry(basicdata.drawPlane(picW * 0.65, picW), 5, 10);

        sphere = new THREE.Mesh(clothGeometry, clothMaterial);
        sphere.castShadow = true;
        //sphere.material.depthTest = false;
        //sphere.renderOrder = 99;

        //object.position.set(0, 0, 0); 
        //scene.add(object);

        var point = emp.position; //new StrToPoint3D(emp.position);
        //  sphere.rotateX(Math.PI / 9); //沿X轴方向选中30°     
        sphere.position.set(point.x, point.y, 1);
        sphere.name = emp.tagCode;
        // sys.newmap3D.AddObj3DEmp(sphere);

        sphere.customDepthMaterial = new THREE.MeshDepthMaterial({

            depthPacking: THREE.RGBADepthPacking,
            map: clothTexture,
            alphaTest: 0.5

        });

        var txt = basicdata.createText(emp);
        txt.name = emp.tagCode;
        sphere.add(txt);
        return sphere;

    },
    createText: function (obj) {
        //   var ps = { X: -13, Y: 55, Z: 0 };
        let ratioPic = basicdata.getRatioPic();
        //let fontSize = 8, locY = -3;
        let fontSize = 8, locY = -3,locX=8;
        if (ratioPic < 7) {
            fontSize = fontSize * ratioPic;
            // locY = locY - (5 * (ratioPic - 1));
        }
        let txtLen = (obj.tName.length / 2) * 1.2;

        var ps = { X: -(locX * txtLen), Y: locY, Z: 0 };
        gui.size = fontSize;
        var txt = gui.asGeom(obj.tName, ps);
        return txt;
    },

    drawPlane: function (width, height) {
        return function (u, v, optionalTarget) {
            var result = optionalTarget || new THREE.Vector3();
            var x = (u - 0.5) * width;
            var y = (v + 0.5) * height;
            var z = 2;
            return result.set(x, y, z);
        };

    },
    ///Czltking-按比例显示底图大小
    initFloorMapJPG: function () {

        let mapInfo = getLayerByName(curFloor); //SysConfingList[index];
        let fileMPath = fileParam.sysMap_path + mapInfo.mapName;
        //sysConfig
        //var sphere = sys.draw.createMesh(new THREE.PlaneBufferGeometry(2256, 1598), fileMPath);

        let sphere = sys.draw.createMesh(new THREE.PlaneBufferGeometry(mapInfo.mapWidth, mapInfo.mapHeight), fileMPath);
        // alert('w:' + mapInfo.mapWidth + ',h:' + mapInfo.mapHeight);
        let op = 0.2 * (mapInfo.mapHeight / mapInfo.mapWidth) + 0.3;
        mapHeight = (mapInfo.mapWidth * op);
        camera.position.set(0, 0, (mapInfo.mapWidth * op));

        if (mapInfo.mapType === 1) {
            sphere = new THREE.Object3D();
        }
        return sphere;
        // sys.draw.loadMesh(sphere);
    },
    //initPoint3d: function (point, color) {
    //    // 添加圆形
    //    //var circle = new THREE.Mesh(new THREE.CircleGeometry(1, 20), new THREE.MeshLambertMaterial({ color: 0XFF0033 }));
    //    var circle = new THREE.Mesh(new THREE.CircleGeometry(10, 20), new THREE.MeshLambertMaterial({ color: color, transparent: true, opacity: 0.6 }));
    //    circle.position.x = point.X;
    //    circle.position.y = point.Y;
    //    circle.position.z = point.Z;
    //    circle.castShadow = circle.receiveShadow = true;
    //    //  group.add(circle);
    //    //  pointsTemp.push(circle);
    //    return circle;
    //    //this.scene.add(circle);
    //},

/**********************区域信息存库逻辑****start**************************************/

    saveOneRegMode: function (item) {
        let regList = [];
        let psList = [];
        var strJson = JSON.stringify(item);
        let almIPPort = item.AlmIpPort;
        let attSet = item.AreaSet === undefined ? "5" : item.AreaSet;
        let almvideoid = item.AlmVideoIP;

        if (oldAlmIpPort !== "" && almIPPort !== oldAlmIpPort) {
            almIPPort = almIPPort + "&" + oldAlmIpPort;

        }
        var regMes = { id: item.id, showName: item.showName, drawType: item.drawType, pointList: [], drawJson: strJson, alarmTags: item.TagList, alarmTagsOut: item.TagListOut, AlmIpPort: almIPPort, Floor: curFloor, AreaSet: attSet, AlmVideoIP: almvideoid };
        if (item.drawType === 3) {
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
        if (regionDraw === 'alarmRegion') {
            strMesg = "电子围栏保存成功...";
        }

        var urlPath = "/Graphic/SaveRegList";
        let strJson1 = { strKey: regionDraw, strValue: regList };
        clientMode.post(urlPath, strJson1, function (msg) {
            oldAlmIpPort = "";
            basicdata.loadAlarmInfo(); //更新报警器状态信息
            basicdata.refrushTask();
            layer.msg(strMesg, { icon: 1, time: 3000 });
        });


    },
    updateState: function (strIpPort) {
        let urlPath = "/Graphic/UpdateAlmInfoState";
        let strJson = { strIp: strIpPort };
        clientMode.post(urlPath, strJson, (mes) => {
            console.log(mes);
        });
    },
    delReg: function (key, regName, regid) {
        let urlPath = "/Graphic/DelMapRegInfo";
        let strJson = { strKey: key, strRegName: regid };
        let strMeg = regName;
        let ulid = regid;
        clientMode.post(urlPath, strJson, function (mes) {
            // layer.msg('删除成功!', { icon: 1, time: 3000 });
            // var strMeg = objSelected.showname;
            if (key === 'rollcallRegion') {
                strMeg += " 电子点名"
                $('#rclist_ul>li[id="' + ulid + '"]').remove();
            } else if (key === 'alarmRegion') {
                strMeg += " 电子围栏"
                // sys.busi2D.getElemt('alarmList_ul').removeChild(sys.busi2D.getElemt(objSelected.name));
                $('#alarmList_ul>li[id="' + ulid + '"]').remove();
            } else if (key === 'attendRegion') {
                strMeg += " 电子考勤"
                $('#attendList_ul>li[id="' + ulid + '"]').remove();
            }

            // obj2DRegion.remove(objSelected);

            // map2dLayer.clearSelectObj();
            basicdata.refrushTask();
            layer.msg(strMeg + '删除成功...', { icon: 1, time: 3000 });
        });

    },

    refrushTask: function () {
        //RefrushTask
        var urlPath = "/Graphic/RefrushTask";
        clientMode.post(urlPath, null, function (msg) {
        });
    },
    //basicdata.initLayer
    initLayer: function () {

        SysConfingList = [];
        var urlPath = "/Graphic/GetLayerList";
        clientMode.post(urlPath, null, function (data) {
            if (data.length > 0) {
                data.forEach((item) => {
                    if (item !== null) {
                        let obj = JSON.parse(item);
                        let syslayer = new LayerInfo();
                        syslayer.mapType = obj.mapType;
                        syslayer.mapName = obj.mapName;
                        //tranX = syslayer.mapTranX = obj.mapTranX;
                        //tranY = syslayer.mapTranY = obj.mapTranY;
                        syslayer.mapTranX = obj.mapTranX;
                        syslayer.mapTranY = obj.mapTranY;
                        syslayer.regColor = obj.regColor;
                        syslayer.rcallColor = obj.rcallColor;
                        syslayer.devIcon = obj.devIcon;
                        syslayer.empIcon = obj.empIcon;
                        syslayer.regOpacity = obj.regOpacity;
                        syslayer.isShowStation = obj.isShowStation;
                        syslayer.isShowVideo = obj.isShowVideo;
                        syslayer.isShowGrid = obj.isShowGrid;
                        syslayer.mapWidth = obj.mapWidth;
                        syslayer.mapHeight = obj.mapHeight;
                        GridSize = syslayer.mapWidth + 100;
                        syslayer.floor = obj.floor;
                        syslayer.attRegColor = obj.attRegColor === undefined ? { normal: "#8000ff", alarm: "#FFB6C1" } : obj.attRegColor;

                        SysConfingList.push(syslayer);
                    }
                });
                ///Point3D_CM
                if (allbackfun !== '') {
                    console.log(" initLayer--> 执行回调方法" + allbackfun + " SysConfingList-->Len:" + SysConfingList.length);
                    funcallback(eval(allbackfun));
                    allbackfun = '';

                }
            }
        });
    },
    // basicdata.saveLayers()
    saveLayers: function (laylist) {
        if (laylist.length > 0) {
            //listValue
            var urlPath = "/Graphic/SaveLayer";
            var strJson = { listValue: laylist };
            clientMode.post(urlPath, strJson, function (msg) {
                if (msg === "OK") {
                    layer.msg('保存成功...', { icon: 1, time: 3000 });
                    basicdata.initLayer();
                } else {
                    layer.msg('保存失败...', { icon: 2, time: 3000 });
                }
            }, true, function (msg) {
                // layer.msg('已配置作业的安全区域组不能删除!', { icon: 0, time: 3000 });
            });
        }
    },

    delLayer: function (strLayerName) {
        var urlPath = "/Graphic/DelLayer";
        var strJson = { strValue: strLayerName };
        clientMode.post(urlPath, strJson, function (msg) {
            if (msg === 'OK') {
                basicdata.initLayer();
                layer.msg('删除成功...', { icon: 1, time: 3000 });
            }
        });
    },
    //UpdateLayer(string strKey, string strKeyOld, string strValue)
    updateLayer: function (newLay, oldLay) {
        let strVal = getLayerByName(oldLay);
        if (strVal === undefined) {
            return;
        }
        var urlPath = "/Graphic/UpdateLayer";
        strVal.floor = newLay;
        let strJson = { strKey: newLay, strKeyOld: oldLay, strValue: JSON.stringify(strVal) };
        clientMode.post(urlPath, strJson, function (msg) {
            if (msg === 'OK') {
                basicdata.initLayer();
                layer.msg('修改成功...', { icon: 1, time: 3000 });
            }
        });

    },
    updateSysConfig: function (lay) {
        var urlPath = "/Graphic/UpdateLayer";
        var strJson = { strKey: lay.floor, strKeyOld: lay.floor, strValue: JSON.stringify(lay) };
        clientMode.post(urlPath, strJson, function (msg) {
            if (msg === 'OK') {
                basicdata.initLayer();
                layer.msg('修改成功...', { icon: 1, time: 3000 });
            }
        });

    },

    /************************WebClient通信**************************************************/
    loadWebSocket: function () {
        if (webSk !== undefined)
            return;
        webSk = new WebSocket('ws://' + mqttConfig.wsip + ':' + mqttConfig.wsport + '');
        webSk.onopen = function (event) {
            // layer.msg('数据已连接！', { icon: 6, time: 3000 });
            if (trackTag !== '') {
                basicdata.sendSocket(trackTag + "&add");
            }
        };
        webSk.onclose = function (event) {
            webSk.close();
            webSk = undefined;
            layer.msg('已停止目标跟随...', { icon: 5, time: 3000 });

        };
        webSk.onmessage = function (evt) {
            let received_msg = evt.data;
            let msgList = received_msg.split('&');
            let strMsg = msgList[0].trim();
            if (msgList.length === 2) {
                let option = msgList[1].trim().toLowerCase();
                if (option === "remove") {
                    layer.msg(strMsg, { id: 'showdialog', icon: 6, time: 3000 });
                    basicdata.sendSocket("close");
                    basicdata.closeWS();
                } else if (option === "videoip") {
                    if (callbackfun !== '') {
                        funcallbackvalue(eval(callbackfun), strMsg);
                    }
                }
            } else {
                layer.msg(strMsg, { id: 'layshowm', icon: 6, time: 6000 });
                //alert(strMsg);           
            }

        };
    },
    sendSocket: function (msg) {
        if (webSk !== undefined) {
            let state = webSk.readyState;
            //layer.msg('连接状态:' + state, { icon: 3, time: 3000 });
            if (state === 1) {
                webSk.send(msg);
            } else {
                webSk.close();
                webSk = undefined;
                layer.msg('未连接成功...', { icon: 3, time: 5000 });

            }

        }
    },


    saveEmpAtt: function (taglist, areaid, attTime) {
        //RefrushTask
        var urlPath = "/Graphic/SaveEmpAtt";
        var strJson = { areaid: areaid, taglist: taglist, attTime: attTime };
        clientMode.post(urlPath, strJson, function (msg) {
            layer.msg('考勤人员设置成功...', { icon: 4, time: 3000 });
        });
    },
    closeWS: function () {
        setTimeout(() => {
            if (webSk !== undefined) {
                webSk.close();
                webSk = undefined;
                layer.msg('已停止目标跟随...', { icon: 5, time: 3000 });
            }
        }, 500);
    },


    /**********************************查询摄像机信息*********************************************************/
    loadvideoinfo() {
        let color = '#A020F0';
        let urlPath = '/Graphic/GetVideoInfoList';
        VideoInfoList = {};
        clientMode.post(urlPath, null, function (data) {
            if (data.length > 0) {
                data.forEach((item) => {
                    VideoInfoList[item.IPAddress] = item;
                });
            }
        });
    },
    //drawObj2DLineString: function (points, color) {
    //    color = color || 0xFFFFF;
    //    // color — 线条的十六进制颜色。缺省值为 0xffffff。
    //    // linewidth — 线条的宽度。缺省为 1。（目前该值不起作用）
    //    // linecap — 定义线条端点的外观。缺省为 'round'（即圆形线头）。
    //    // linejoin — 定义线条接口处的外观。缺省为 'round'。
    //    // vertexColors — 定义顶点如何着色。缺省是 THREE.NoColors。
    //    // fog — 定义材质颜色是否受全局雾设置的影响。默认是false。
    //    var material = new THREE.LineBasicMaterial({ color: color, linewidth: 100 });
    //    var geometry = new THREE.Geometry();
    //    $.each(points, function (i, ps) {
    //        geometry.vertices.push(ps);
    //    });
    //    var obj = new THREE.Line(geometry, material);
    //    return obj;
    //},


}

