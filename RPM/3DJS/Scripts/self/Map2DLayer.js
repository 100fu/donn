var floorObj = {};

var objects = [], is3DFull = false, raycaster;

var pointsTemp = [], points = [], showChkRtEmp = [];
var lineTemp = null, mouseKey = -1, mousedownPs = null, obj2DRegion = null, objSelected = undefined;
var isdrawCir = false, isdrawLine = false, isdrawRec = false, isdrawPolygon = false, isdraw = false, currentDrawing = 0;
var mouse = new THREE.Vector2();//创建二维平面
var totalTime = 0;
var tc, moveTime;
var isdb = true; //是否双击
//当前楼层 "" 默认为 0 层
var curFloor = "", editReg = "", oldAlmIpPort = "", callbackdrawReg = '', callbackfloor = '', callregedit = '';
var regList = {}, regFloorList = {};
var divList = [];
var isOnlySel = true, addEdit = false;

var objSelectTrack = undefined, chkSex = undefined, chkOneFloor = undefined;
var empDeptTree = undefined;//部门树的临时信息
var isAttEmp = [], attInOutTime = undefined;
var regindex = 0;

map2dLayer = {

    InitThreeScene: function (divid) {
        //  curFloor = 1;
        //加载配置文件
        allbackfun = 'map2dLayer.initinfo';
        basicdata.initLayer();
        sys.MapData.initFont();
        sys.MapData.initThree(divid);
        sys.MapData.initScene();
        sys.MapData.initCamera();
        sys.MapData.initOrbit();
        sys.MapData.initLight();
        window.onresize = sys.MapData.onWindowResize;

        map2dLayer.initSelectObj();
        container.addEventListener("mousemove", map2dLayer.onDocumentMouseMove);
        container.addEventListener("mousedown", map2dLayer.ondbClickMouseDown);

        sys.MapData.animate();
    },

    LoadThreeScene: function (divid) {
        //curFloor = 1;
        new NewArray();
        //加载配置文件
        allbackfun = 'map2dLayer.initinfo';
        //sys.draw.initSysConfig();
        basicdata.initLayer();
        sys.MapData.initFont();
        sys.MapData.initThree(divid);
        sys.MapData.initScene();
        sys.MapData.initCamera();
        sys.MapData.initOrbit();
        sys.MapData.initLight();
        //加载二级菜单条

        map2dLayer.loadToolbit();
        map2dLayer.initSelectObj();

        window.onresize = sys.MapData.onWindowResize;

        container.addEventListener("mousedown", map2dLayer.mousedown);//页面绑定鼠标点击事件
        container.addEventListener("mouseup", map2dLayer.mouseup);//页面绑定鼠标点击事件
        container.addEventListener("mousemove", map2dLayer.onDocumentMouseMove);

        sys.MapData.animate();

    },
    //map2dLayer.initinfo()
    initinfo: function () {
        //let index = curFloor - 1;
        if (curFloor === "") {
            lay = SysConfingList[0];
            curFloor = lay.floor;
            tranX = lay.mapTranX;
            tranY = lay.mapTranY;
        }
        map2dLayer.loadMap();
        var plan3DMode = map2dLayer.getFloor();
        // sys.draw.loadStation2D(plan3DMode, curFloor);
        basicdata.loadStation2D(plan3DMode, curFloor);

        if (callbackfloor !== '') {
            funcallback(eval(callbackfloor));
            callbackfloor = '';
        }

    },
    loadVideo: function () {
        var plan3DMode = map2dLayer.getFloor();
        if (plan3DMode !== undefined)
            basicdata.loadvideo2D(plan3DMode, curFloor);

    },
    ///只加载地图
    loadMap: function () {
        //  var plan3D = sys.draw.initFloorMapJPG();
        var plan3D = basicdata.initFloorMapJPG();
        plan3D.objType = 'floor';
        plan3D.objid = curFloor;
        plan3D.floor = curFloor;
        plan3D.name = curFloor;
        sys.MapData.AddScene(plan3D);
        floorObj[curFloor] = plan3D;
    },
    initSelectObj: function () {
        //var geometry = new THREE.PlaneBufferGeometry(sysConfig.mapWidth, sysConfig.mapHeight);
        var geometry = new THREE.PlaneBufferGeometry(GridSize, GridSize);
        // layer.msg("mapWidth:" + GridSize + ";mapHeight:" + GridSize, { icon: 6, time: 3000 });
        plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        plane.name = '元素选中层';
        plane.objType = 'selobj';
        ///选中物体的面
        objects.push(plane);
        sys.MapData.AddScene(plane);
        raycaster = new THREE.Raycaster();
        obj2DRegion = new THREE.Object3D();
        sys.MapData.AddScene(obj2DRegion);

    },
    loadToolbit: function () {
        var buttons = [
            {
                label: 'home', id: 'cursor', icon: 'cursor.png', clickFun: function () {
                    map2dLayer.selectedClear();
                    map2dLayer.setBool(0);
                }
            },
            {
                label: '多边形', id: 'polygon', icon: 'polygon_off.png', clickFun: function () {
                    map2dLayer.selectedClear();
                    if (isdrawPolygon) {
                        map2dLayer.setBool(0);
                        document.getElementById('polygon').src = fileParam.getImg('polygon_off.png', 'toolbar');
                    } else {
                        map2dLayer.setBool(1);
                        document.getElementById('polygon').src = fileParam.getImg('polygon_on.png', 'toolbar');

                    }
                }
            },
            {
                label: '矩形', id: 'rectangle', icon: 'rectangle_off.png', clickFun: function () {
                    map2dLayer.selectedClear();
                    if (isdrawRec) {
                        map2dLayer.setBool(0);
                        document.getElementById('rectangle').src = fileParam.getImg('rectangle_off.png', 'toolbar');
                    } else {
                        map2dLayer.setBool(2);
                        document.getElementById('rectangle').src = fileParam.getImg('rectangle_on.png', 'toolbar');

                    }
                }
            },
            {
                label: '圆形', id: 'circle', icon: 'circle_off.png', clickFun: function () {
                    map2dLayer.selectedClear();
                    if (isdrawCir) {
                        map2dLayer.setBool(0);
                        document.getElementById('circle').src = fileParam.getImg('circle_off.png', 'toolbar');
                    } else {
                        map2dLayer.setBool(3);
                        document.getElementById('circle').src = fileParam.getImg('circle_on.png', 'toolbar');

                    }
                }
            },
            {
                label: '删除', id: 'removeBtn', icon: 'remove.png', clickFun: function () {
                    map2dLayer.setBool(0);
                    if (objSelected !== undefined && objSelected.objType !== 'sta') {
                        //从 obj2DRegion 对象删除                     
                        //从scene中删除
                        ////更新缓存
                        //obj2DRegion.remove(objSelected);
                        //sys.busi2D.removeDrawRegion(objSelected);
                        map2dLayer.removeDrawRegion(objSelected);

                    } else {
                        layer.msg('请选中要删除的区域...', { icon: 6, time: 3000 });
                    }
                }
            }
        ];
        map2dLayer.setupToolbar(buttons);
    },
    setupToolbar: function (buttons) {
        var count = buttons.length;
        var step = 38;
        var div = document.createElement('div');
        div.setAttribute('id', 'toolbar');
        div.style.display = 'block';
        // div.style.display = 'none';
        div.style.position = 'absolute';
        div.style.right = '150px';
        div.style.top = '10px';

        div.style.width = (count * step + 8) + 'px';
        div.style.height = '32px';

        //div.style.background = 'rgba(255,255,255,0.75)';
        div.style['border-radius'] = '5px';
        div.onmouseover = function () {
            //    console.log('移入 isdraw=' + isdraw);
            if (isdraw === true)
                currentDrawing = 1;
            else
                currentDrawing = 0;
            isdraw = false;
        };
        div.onmouseout = function () {
            //   console.log('移出 isdraw=' + isdraw);
            if (currentDrawing === 1) {
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
        }

    },

    setBool: function (index) {
        currentDrawing = 0;
        isdrawCir = isdrawLine = isdrawRec = isdrawPolygon = isdraw = false;
        document.getElementById('polygon').src = fileParam.getImg('polygon_off.png', 'toolbar');
        document.getElementById('rectangle').src = fileParam.getImg('rectangle_off.png', 'toolbar');
        document.getElementById('circle').src = fileParam.getImg('circle_off.png', 'toolbar');
        //document.getElementById('line').src = fileParam.getImg('line_off.png', 'toolbar');

        if (index === 0) {
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

    showRtMousePoint: function (event) {
        let ps = map2dLayer.getPoints(event);
        if (ps !== null) {
            let rtPoint = map2dLayer.offsetPs(ps);
            $("#mouseps").html(rtPoint.x + "，" + rtPoint.y);
        }
    },
    selObj: function (moveps) {
        raycaster.setFromCamera(moveps, camera);
        let objFloor = map2dLayer.getFloor();
        if (objFloor === undefined)
            return;

        // var intersects = raycaster.intersectObjects(objFloor.children, true);
        let intersects = raycaster.intersectObjects(objFloor.children);

        if (intersects.length > 0) {
            let mouseSelObj = new THREE.Vector2();
            mouseSelObj.x = intersects[0].point.x;
            mouseSelObj.y = intersects[0].point.y;
            var objSelectNew = intersects[0].object;

            if (objSelectNew !== objSelected) {

                if (objSelected !== undefined) {
                    objSelected.material.transparent = true;
                    objSelected.material.opacity = 0.5;

                }
                objSelectNew.material.transparent = true;
                objSelectNew.material.opacity = 1;
                if (objSelectNew.objType === 'emp_his' || objSelectNew.objType === 'emp' || objSelectNew.objType === 'sta' || objSelectNew.objType === 'video')
                    objSelectNew.material.opacity = 0.5;
                //if ((objSelectNew.objType === 'alarmRegion') || (objSelectNew.objType === 'rollcallRegion')) {
                //    objSelectNew.material.opacity = 1;
                //}
                objSelected = objSelectNew;
                map2dLayer.showTips(mouseSelObj, mouseSelObj);

            }
            document.getElementsByTagName("html").item(0).style.cursor = "pointer"
        } else {
            if (objSelected !== undefined) {
                objSelected.material.transparent = true;
                objSelected.material.opacity = 0.5;
                //if ((objSelected.objType === 'alarmRegion') || (objSelected.objType === 'rollcallRegion')) {
                //    objSelected.material.opacity = 0.5;
                //}
                if (objSelected.objType === 'emp_his' || objSelected.objType === 'emp' || objSelected.objType === 'sta' || objSelected.objType === 'video')
                    objSelected.material.opacity = 1;
            }
            objSelected = undefined;
            document.getElementsByTagName("html").item(0).style.cursor = "default"
            $("#rtDialogDiv").hide();
        }
    },
    selectedObj: function (moveps) {
        raycaster.setFromCamera(moveps, camera);
        let objFloor = map2dLayer.getFloor();

        if (objFloor === undefined)
            return;
        let intersects = raycaster.intersectObjects(objFloor.children, true);
        if (intersects.length > 0) {
            let mouseSelObj = new THREE.Vector2();
            mouseSelObj.x = intersects[0].point.x;
            mouseSelObj.y = intersects[0].point.y;
            var objSelectNew = intersects[0].object;
            if (objSelectNew !== objSelected) {
                if (objSelected !== undefined) {
                    objSelected.material.transparent = true;
                    if (objSelected.objType !== 'sta')
                        objSelected.material.opacity = 0.5;
                    else
                        objSelected.material.opacity = 1;
                }
                objSelectNew.material.transparent = true;
                if (objSelectNew.objType === 'sta') {
                    objSelectNew.material.opacity = 0.6;
                } else {
                    objSelectNew.material.opacity = 1;
                }

                objSelected = objSelectNew;
                map2dLayer.showTips(mouseSelObj, mouseSelObj);
            }
            document.getElementsByTagName("html").item(0).style.cursor = "pointer"
        } else {
            document.getElementsByTagName("html").item(0).style.cursor = "default"
            $("#rtDialogDiv").hide();
        }
    },
    onDocumentMouseMove: function (event) {
        if (isdraw) {
            // console.log("move:mouseKey=" + mouseKey);
            if (mouseKey === 1 || mouseKey === 2) {
                if (isdrawCir === true || isdrawRec === true) {
                    var moveps = map2dLayer.getPoints(event);
                    if (moveps === null)
                        return;
                    mouseKey = 2;
                    if (lineTemp !== null && lineTemp !== undefined) {
                        sys.MapData.RemoveObj(lineTemp);
                    }

                    if (isdrawCir === true) {
                        lineTemp = sys.draw.draw2DCIRCLE(mousedownPs, moveps, '#990099', false);
                    } else if (isdrawRec === true) {
                        lineTemp = sys.draw.draw2DRect(mousedownPs, moveps);
                    }
                    // AddScenne(lineTemp);
                    console.log("move:mouseKey=" + mouseKey);
                    sys.MapData.AddScene(lineTemp);
                }
            }
        }
        if (isdraw === true)
            return;

        //var intersects = map2dLayer.getIntersects(event);
        //if (intersects.length != 0 && intersects[0].object instanceof THREE.Mesh) {
        //   var ssobj = intersects[0].object;
        //   console.log("move:mouse x=" + ssobj.position.x + " y=" + ssobj.position.y);
        //  //  changeMaterial(selectObject);
        //}

        map2dLayer.showRtMousePoint(event);
        event.preventDefault();
        let mouseps = new THREE.Vector2();
        mouseps.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseps.y = -(event.clientY / window.innerHeight) * 2 + 1;
        // console.log("move:mouse x=" + mouseps.x + " y=" + mouseps.y);
        if (isOnlySel === true) {
            map2dLayer.selectedObj(mouseps);
        } else {
            map2dLayer.selObj(mouseps);
        }
    },
    ondbClickMouseDown: function (e) {
        if (objSelectTrack !== undefined) {

            let btnkey = map2dLayer.getbuttonkey(e);
            ///左键双击取消跟踪
            if (btnkey === 0) {
                objSelectTrack = undefined;
            }

            //if (e.button == 0) {
            //    mouseKey = 1;
            //    console.log("点击左键 mouseKey=" + mouseKey);
            //}
            //isdb = !isdb;
            //if (isdb) {
            //    isdb = true;
            //    mouseKey = -1;
            //    if (e.button === 0) {
            //        //左键双击
            //        objSelectTrack = undefined;
            //    }
            //    else if (e.button === 2) {
            //        //右键双击
            //    }
            //    return;
            //}
            //tc = window.setTimeout(cc, 200)
            //function cc() {
            //    //   console.log("单击 mouseKey=" + mouseKey);
            //    isdb = true;
            //}

        } else {
            let btnkey = map2dLayer.getbuttonkey(e);
            if (btnkey === 0) {
                let sobj = map2dLayer.getselectObj(e);
                if (sobj !== undefined && sobj.objType === 'video') {
                    trackvideo.createVideoDiv(sobj);
                }
                // rtmap2d.showTrackVideo(sobj.ip);
            }
            $("#rtDialogDiv").hide();
        }
    },
    //点击方法
    mousedown: function (e) {
        //map2dLayer.stopCount();
        //鼠标左击 0-左 2-右
        if (isdraw) {
            if (e.button === 0) {
                mouseKey = 1;
                //console.log("点击左键 mouseKey=" + mouseKey);

            }
            //取点击屏幕的点
            var ps = map2dLayer.getPoints(e);
            if (ps === null)
                return;
            mousedownPs = round2(ps);
            if (isdrawLine === true || isdrawPolygon === true) {
                isdb = !isdb;
                if (isdb) {
                    isdb = true;
                    map2dLayer.stopCount();
                    //双击不画圆
                    mouseKey = -1;
                    if (e.button === 0) {
                        var color = '#9933CC';
                        if (regionDraw === 'alarmRegion') {
                            color = sysConfig.regColor.normal;
                        } else if (regionDraw === 'rollcallRegion') {
                            color = sysConfig.rcallColor.normal;
                        }
                        //var color = '#00CC00';
                        var drawT = new DrawParam();
                        drawT.busType = regionDraw;
                        var shape = null;
                        //左键双击绘制出多边形
                        if (isdrawPolygon) {
                            // var ps = map2dLayer.getPoints(e);
                            points.push(ps);
                            ///画多边型
                            drawT.id = new Date().getTime().toString(); //getId(points);
                            drawT.drawType = DRAW_TYPE.POLYGON;
                            drawT.pointList = points;
                            drawT.color = color;
                            shape = sys.draw.draw2DPOLYGON(points, color);
                            shape.name = drawT.id;
                            points = [];
                            sys.MapData.RemoveObj(pointsTemp);
                            sys.MapData.RemoveObj(lineTemp);
                            // AddScenne(shape);
                            map2dLayer.AddObj2DRegion(shape);
                            //  sys.busi2D.addDrawRegion(drawT, shape);
                            map2dLayer.addDrawRegion(drawT, shape);
                            points = [];
                        }
                        else if (isdrawLine) {
                            // alert("右键双击！");
                            //右键双击绘制线段结束   
                            points.push(ps);
                            drawT.id = new Date().getTime().toString(); //getId(points);
                            drawT.drawType = DRAW_TYPE.LINE;
                            drawT.pointList = points;
                            drawT.color = color;

                            shape = createLine();
                            shape.name = drawT.id;
                            map2dLayer.AddObj2DRegion(shape);
                            sys.MapData.RemoveObj(pointsTemp);

                            map2dLayer.addDrawRegion(drawT, shape);
                            points = [];
                            lineTemp = null;
                        }
                    }
                    //else if (e.button == 2) {
                    //}
                    return;
                }
                tc = window.setTimeout(cc, 200)
                function cc() {
                    // if(isdb!=false)return; 
                    //  console.log("单击 mouseKey=" + mouseKey);
                    isdb = true;
                    if (e.button === 0) {
                        map2dLayer.drawP(ps);
                    }
                }
            }
        } else {
            $("#rtDialogDiv").hide();
        }
    },

    ///鼠标按下后抬起事件
    mouseup: function (e) {
        if (isdraw) {
            var ps = map2dLayer.getPoints(e);
            if (ps === null)
                return;
            round2(ps);
            if (mousedownPs === null || mousedownPs === undefined)
                return;
            if (isdrawCir === true || isdrawRec === true) {
                if ((mousedownPs.x === ps.x) && (mousedownPs.y === ps.y)) {
                    mouseKey = -1;
                }
                if (mouseKey === 2) {
                    mouseKey = -1;
                    var drawT = new DrawParam();
                    drawT.busType = regionDraw;
                    points.push(mousedownPs);
                    points.push(ps);
                    drawT.id = new Date().getTime().toString(); //getId(points);
                    drawT.drawType = DRAW_TYPE.RECTANGLE;
                    if (isdrawCir === true) {
                        drawT.drawType = DRAW_TYPE.CIRCLE;
                    }
                    drawT.pointList = points;

                    sys.MapData.RemoveObj(lineTemp);
                    var color = '#9933CC';
                    if (regionDraw === 'alarmRegion') {
                        color = sysConfig.regColor.normal;
                    } else if (regionDraw === 'rollcallRegion') {
                        color = sysConfig.rcallColor.normal;
                    }
                    var rect = sys.draw.draw2DRect(mousedownPs, ps, color, true);
                    if (isdrawCir === true) {
                        //  color = '#0000ff';
                        rect = sys.draw.draw2DCIRCLE(mousedownPs, ps, color, true);
                    }
                    rect.name = drawT.id;
                    drawT.color = color;
                    map2dLayer.AddObj2DRegion(rect);
                    sys.MapData.RemoveObj(pointsTemp);
                    map2dLayer.addDrawRegion(drawT, rect);
                    points = [];
                }
                console.log("左键抬起:mouseKey=" + mouseKey);
                mouseKey = -1;
            }
        }
    },

    stopCount: function () {
        clearTimeout(tc);
    },
    ///获取界面上的点，
    getPoints: function (event) {
        var point = null;
        event.preventDefault();
        var mx = (event.clientX / window.innerWidth) * 2 - 1;
        var my = -(event.clientY / window.innerHeight) * 2 + 1;
        //  console.log("获取屏幕坐标直接获取 mx:" + mx + " my:" + my);
        mouse.x = ((event.clientX - container.getBoundingClientRect().left) / container.offsetWidth) * 2 - 1;
        mouse.y = -((event.clientY - container.getBoundingClientRect().top) / container.offsetHeight) * 2 + 1;
        //  console.log("获取屏幕坐标直接获取 mouse x:" + mouse.x + " y:" + mouse.y);
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(objects);
        if (intersects.length > 0) {
            point = intersects[0].point;

            //num.toFixed(2)  //fomatFloat(3.14559267, 2)
            // console.log("获取屏幕坐标直接获取 point x:" + point.x + " y:" + point.y);
        }
        return point;
    },

    // map2dLayer.IsHaveReg
    IsHaveReg: function (regid) {
        let regList = map2dLayer.getFloor();
        return sys.MapData.IsExistObj(regList, regid);
    },
    AddObj2DRegion: function (obj) {
        // obj2DRegion.add(obj);
        let plan3DMode = map2dLayer.getFloor();
        if (plan3DMode !== undefined)
            plan3DMode.add(obj);
        // map2dLayer.AddObj3DList(obj);
    },

    //map2dLayer.removeObj2DRegion()
    removeObj2DRegion: function (obj) {
        let plan3DMode = map2dLayer.getFloor();
        if (plan3DMode !== undefined)
            plan3DMode.remove(obj);
    },
    removeDrawRegion: function (objSelected) {

        if (objSelected === undefined) {
            layer.msg('请选中要删除的区域...', { icon: 5, time: 3000 });
            return;
        }
        if (objSelected.busType !== regionDraw) {
            var strMesg = "请选中电子围栏菜单中的按钮进行删除操作...";
            if (regionDraw === 'alarmRegion') {
                strMesg = "请选中电子点名菜单中的按钮进行删除操作...";
            }
            layer.msg(strMesg, { icon: 5, time: 3000 });
            return;
        }
        if (regionDraw === 'alarmRegion') {
            GraphList.removeByName(objSelected.name);
            //保存缓存中的区域信息
            GraphList.saveJson(regionDraw);
            if (objSelected.AlmIpPort !== undefined && objSelected.AlmIpPort !== "") {
                basicdata.updateState(objSelected.AlmIpPort);
            }

        }
        else if (regionDraw === 'rollcallRegion') {
            RollCallList.removeByName(objSelected.name);
            RollCallList.saveJson(regionDraw);

        } else if (regionDraw === 'attendRegion') {
            AttendRegList.removeByName(objSelected.name);
            AttendRegList.saveJson(regionDraw);
            regionDraw = 'attendRegion';
            basicdata.saveEmpAtt("", objSelected.name, "");
        }
        //删除数据库中的区域信息 
        basicdata.delReg(regionDraw, objSelected.showname, objSelected.name);

        //从界面删除信息
        map2dLayer.removeObj2DRegion(objSelected);
        map2dLayer.selectedClear();

    },

    drawP: function (point) {
        // point.x = point.x - 0.3;
        // point.y = point.y + 0.3;
        //画点
        var ps = map2dLayer.initCylinder(point);

        //AddScenne(ps);
        sys.MapData.AddScene(ps);
        points.push(point);
        //画线
        if (points.length > 1) {
            map2dLayer.createLine();
        }

    },
    createHisLine: function (points, color) {
        var lineNew = sys.draw.drawObj2DLineString(points, color);
        return lineNew;

    },
    createLine: function (color) {

        var color = color || 0x0000ff;
        var lineNew = sys.draw.drawObj2DLineString(points, color);
        //AddScenne(lineNew);
        //sys.busi2D.RemoveObj(lineTemp);
        sys.MapData.AddScene(lineNew);
        sys.MapData.RemoveObj(lineTemp);
        lineTemp = lineNew;
        return lineTemp;

    },
    ///添加平面圆形（圆点）
    initCylinder: function (point) {
        // 添加圆形
        var circle = new THREE.Mesh(new THREE.CircleGeometry(1, 20), new THREE.MeshLambertMaterial({ color: 0XFF0033 }));

        circle.position.x = point.x;
        circle.position.y = point.y;
        circle.position.z = point.z;
        circle.castShadow = circle.receiveShadow = true;
        //  group.add(circle);
        pointsTemp.push(circle);
        return circle;
        //this.scene.add(circle);
    },

    addDrawRegion: function (drawM, shape) {
        ////alarmRegion-报警区域设，rollcallRegion-点名区域
        if (regionDraw === 'alarmRegion') {
            editalm.createRegEdit(drawM, shape, '');
        } else if (regionDraw === 'rollcallRegion') {
            // sys.busi2D.createRollcallEdit(drawM, shape, '');
            editrollcall.createRCEdit(drawM, shape, '');
        }
        else if (regionDraw === 'attendRegion') {
            editattend.createAttendEdit(drawM, shape, '');
        }
    },


    /***********************************加载区域**********************************************************************/

    //'rollCallList'  rclist_ul 电子点名 map2d
    loadRegsList: function (divid, ulid, title, maindiv) {
        //alarmRegList
        var div = document.createElement('div');
        div.setAttribute('id', divid);
        div.setAttribute('class', 'regListDiv');
        div.onmouseover = function () {
            if (isdraw === true)
                currentDrawing = 1;
            else
                currentDrawing = 0;
            isdraw = false;
        };
        div.onmouseout = function () {
            //   console.log('移出 isdraw=' + isdraw);
            if (currentDrawing === 1) {
                isdraw = true;
            }
        };

        //创建UL
        var oUL = document.createElement('ul');
        //oUL.setAttribute('id', 'rclist_ul');
        oUL.setAttribute('id', ulid);
        oUL.setAttribute('class', 'list');
        div.appendChild(oUL);
        var uli = document.createElement('li');
        uli.setAttribute('id', '_li0');
        uli.setAttribute('class', 'list_item active');
        //uli.setAttribute('class', 'fa fa-minus-hexagon');
        uli.style = 'border-radius: 10px 10px 0px 0px;';
        var ua = document.createElement('a');
        //ua.innerHTML = '电子点名';
        ua.innerHTML = title;
        uli.appendChild(ua);
        oUL.appendChild(uli);
        $('#' + maindiv).append($(div));
    },
    ///区域列表中添加信息
    addRegUl: function (ulid, regId, showname) {

        // let rolId = drawM.id;
        let isHave = false;
        //   $("#rclist_ul>li")
        $("#" + ulid + ">li").each(function (index, item) {
            if (item.id === regId) { isHave = true; }
        });

        if (isHave === true) {
            return;
        }

        //var list = document.getElementById('rclist_ul');
        var list = document.getElementById(ulid);
        var li = document.createElement('li');
        li.setAttribute('class', 'list_item');
        li.setAttribute('id', regId);
        var la = document.createElement('a');
        la.innerHTML = showname;
        la.href = "#"
        la.id = "la_" + regId;

        la.onclick = function (e) {
            if (callregedit !== '') {
                funcallbackvalue(eval(callregedit), e.target.id);
            }
        }
        li.appendChild(la);
        list.appendChild(li);

    },
    updateRegName: function (regId, regName) {
        let reg = document.getElementById(regId);
        if (reg !== null)
            reg.innerHTML = regName;
        // document.getElementById(regId).innerHTML = regName;
    },

    findDrawRegJson: function (regId, objList) {
        var regs = objList.getList();
        var drawM = undefined;
        $.each(regs, function (i, n) {
            if (n.id === regId) {
                drawM = n;
            }
        });
        return drawM;
    },

    findRegObj: function (regId) {
        var objReg = undefined;
        let regList = map2dLayer.getFloor();
        if (regList !== undefined) {
            $.each(regList.children, function (i, n) {
                if (n.name === regId) {
                    objReg = n;
                }
            });
        }
        return objReg;
    },

    Refresh: function () {
        sys.draw.getRegsCallback(regionDraw, map2dLayer.LoadAreaReg);
        //basicdata.loadEmpTagList();//人员基础信息
        //basicdata.loadAlarmInfo();//报警器基础信息
    },
    LoadRtAreaReg: function (data) {
        if (data !== null && data !== "") {
            regList = {};
            for (var i = 0; i < data.length; i++) {
                // regList.push(data[i]);
                let reg = data[i];
                if (reg.Floor === curFloor) {
                    regList[reg.Code] = reg;
                }
            }
            for (var n in regList) {
                let o = regList[n];
                if (o.DrawJson !== "" && o.DrawJson.trim() !== "OL") {
                    let item = JSON.parse(o.DrawJson);
                    if (!map2dLayer.IsHaveReg(item.id)) {
                        let shape = sys.draw.drawRegByJson(item);
                        map2dLayer.AddObj2DRegion(shape);
                    }
                }
            }

            if (callregedit !== '') {
                funcallback(eval(callregedit));
                //callregedit = '';
            }
            //map2dLayer.isshowReg(setting.isChkAttReg, 'rollcallRegion'); //电子点名
            //map2dLayer.isshowReg(setting.isChkDzkq, 'attendRegion');//电子考勤



        }



    },


    LoadAreaReg: function (data) {
        if (data !== null && data !== "") {
            regList = {};
            for (var i = 0; i < data.length; i++) {
                // regList.push(data[i]);
                let reg = data[i];
                regList[reg.Code] = reg;
            }
        }
        map2dLayer.loadRegFloor(curFloor);

    },
    loadRegFloor: function (index) {
        var regs = [];
        for (var n in regList) {
            item = regList[n];
            if (item.Floor === index) {
                regs.push(item);
            }
        }
        regFloorList[index] = regs;
        if (callbackdrawReg !== '') {
            funcallback(eval(callbackdrawReg));
            callbackdrawReg = '';
        }
    },

    clearLayerdObj: function (obj) {
        var plan3DMode = floorObj[obj];
        //移除分组
        plan3DMode.children.forEach(item => {
            if (item.floor === obj) {
                sys.MapData.RemoveObj(item);
            }
        });

        //移除图层
        sys.MapData.RemoveObj(plan3DMode);
    },

    ShowDiv: function (obj) {
        if (divList !== undefined) {
            if (divList.length > 0) {
                divList.forEach(item => {
                    if (item !== obj) {
                        var perRtMessage = document.getElementById(item);
                        perRtMessage.style.display = 'none';
                    }
                })
            }
        }
        let perRtMessage = document.getElementById(obj);
        if (window.getComputedStyle(perRtMessage).getPropertyValue('display') === 'none') {
            perRtMessage.style.display = 'block';
        } else if (window.getComputedStyle(perRtMessage).getPropertyValue('display') === 'block') {
            perRtMessage.style.display = 'none';
        }
    },
    ShowDivTF: function (obj, isShow) {
        var perRtMessage = document.getElementById(obj);
        if (isShow === true) {
            perRtMessage.style.display = 'block';
        } else {
            perRtMessage.style.display = 'none';
        }
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
        } else {
            $("#empOutList").val(rulesName.join(","));
            $("#empOutList").data("perid", rulesId.join(","));
        }

        $("#DialogSelect").dialog("destroy");
        $("#DialogSelect").html("");
    },

    /************************选中图层*******************************************************/

    offsetPs: function (ps) {
        let rtPoint = { x: (Number(ps.x) - Number(tranX)).toFixed(2), y: (Number(ps.y) - Number(tranY)).toFixed(2), z: 0 };
        return rtPoint;
    },
    getFloor: function () {
        let layfloor = floorObj[curFloor];
        return layfloor;
    },
    //showTips: function (moveps,mouse) {

    //    if (objSelected.showname === undefined)
    //        return;
    //    let regname = "";
    //    let sizeDig = ['200px', '90px'];
    //    let strmsg = '<table  width="100%" height="100%" id="able">'
    //    if (objSelected !== undefined) {
    //        if (objSelected.objType === 'alarmRegion')
    //            regname = "电子围栏 ";
    //        else if (objSelected.objType === 'rollcallRegion')
    //            regname = "电子点名 ";
    //        else if (objSelected.objType === 'sta')
    //            regname = "定位基站 ";
    //        else if (objSelected.objType === 'emp') {
    //            regname = "人员 ";
    //        }
    //        if (objSelected.objType === 'emp') {
    //            let empInfo = map2dLayer.getTagInfo(objSelected.name);

    //            if (empInfo === undefined) {
    //                strmsg += '<tr ><td style="width:35%;text-align:right;">名称:</td><td style="width:70%;text-align:left;">' + objSelected.showname + '</td></tr>'

    //            } else {
    //                let deptInfo = DeptList[empInfo.deptid];
    //                strmsg += '<tr ><td style="width:35%;text-align:right;">标签号:</td><td style="width:70%;text-align:left;">' + empInfo.tCode + '</td></tr>'
    //                strmsg += '<tr ><td style="width:35%;text-align:right;">名  称:</td><td style="width:70%;text-align:left;">' + empInfo.tName + '</td></tr>'
    //                strmsg += '<tr ><td style="width:35%;text-align:right;">编  号:</td><td style="width:70%;text-align:left;">' + empInfo.objNum + '</td></tr>'
    //                strmsg += '<tr ><td style="width:35%;text-align:right;">电  话:</td><td style="width:70%;text-align:left;">' + empInfo.tel + '</td></tr>'
    //                if (deptInfo !== undefined) {
    //                    strmsg += '<tr ><td style="width:35%;text-align:right;">部  门:</td><td style="width:70%;text-align:left;">' + deptInfo.Name + '</td></tr>'
    //                }
    //                strmsg += '<tr ><td style="width:35%;text-align:right;">备  注:</td><td style="width:70%;text-align:left;">' + empInfo.remark + '</td></tr>'
    //                sizeDig = ['200px', '210px'];
    //            }

    //        } else {
    //            strmsg += '<tr ><td style="width:35%;text-align:right;">名称:</td><td style="width:70%;text-align:left;">' + objSelected.showname + '</td></tr>'
    //        }
    //        strmsg += '</table>';

    //        map2dLayer.renderDiv(objSelected, mouse);
    //        //layer.open({
    //        //    type: 1,
    //        //    time: 2000,
    //        //    area: sizeDig,
    //        //    offset: 't',
    //        //    title: regname + '信息',
    //        //    closeBtn: 0, //不显示关闭按钮
    //        //    shadeClose: true,
    //        //    shade: false,
    //        //    id: 'layertips', //设定一个id，防止重复弹出
    //        //    resize: false,
    //        //    moveType: 1, //拖拽模式，0或者1
    //        //    content: '<div style="padding: 10px; line-height: 22px; background-color: #0352a7;height:auto; color: #fff; font-weight: 300;">' + strmsg + '</div>'
    //        //});
    //    }
    //},


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


    /*************************加载树********************************************/

    loadDeptTree: function () {
        var urlPath = '/Graphic/GetDeptEmpTree';
        let strJson = { strSex: chkSex };
        clientMode.post(urlPath, "", function (data) {
            if (data.length > 0) {
                if (funbkemptree !== '') {
                    funcallbackvalue(eval(funbkemptree), data);
                } else {
                    map2dLayer.initData(data);
                }

            }
        });
    },


    loadInOutDeptTree: function (isInOut) {
        let self = isInOut;
        let urlPath = '/Graphic/GetDeptEmpTree';
        // let strJson = { strSex: chkSex };
        clientMode.post(urlPath, "", function (data) {
            if (data.length > 0) {
                //let dtnew = undefined;
                if (self === true) {
                    map2dLayer.rtInDeptEmpTree(data);
                } else if (self === false) {
                    //  map2dLayer.initData(map2dLayer.rtOutDeptEmpTree(data));
                    map2dLayer.rtOutDeptEmpTree(data);
                } else {
                    map2dLayer.initData(data);
                }

            }


        });
    },
    rtInDeptEmpTree: function (data) {
        $.each(data[0].children, function (j, n) {
            let delList = [];
            $.each(n.children, function (i, item) {
                if ($.inArray(item.id, rtEmpTags) === -1) {
                    delList.push(i);
                }
            });

            delList.reverse().forEach(function (index) {
                // data[0].items[j].children.splice(index, 1);
                data[0].items[j].items.splice(index, 1);
            });
        });
        map2dLayer.initData(data);

    },

    rtOutDeptEmpTree: function (data) {

        $.each(data[0].children, function (j, n) {
            let delList = [];
            $.each(n.children, function (i, item) {
                if ($.inArray(item.id, rtEmpTags) !== -1) {
                    delList.push(i);
                }
            });
            delList.reverse().forEach(function (index) {
                //  data[0].items[j].children.splice(index, 1);
                data[0].items[j].items.splice(index, 1);
            });
        });
        map2dLayer.initData(data);

    },
    initData: function (data) {
        if (data === undefined)
            return;

        //过滤性别
        if (chkSex !== undefined) {
            $.each(data[0].items, function (j, n) {
                let delList = [];
                $.each(n.items, function (i, item) {
                    let txtLs = item.text.split('&');
                    if (txtLs[1].trim() !== chkSex) {
                        delList.push(i);
                    }
                    item.text = txtLs[0];
                    data[0].items[j].items[i] = item;
                });
                delList.reverse().forEach((index) => {
                    //  data[0].items[j].children.splice(index, 1);
                    data[0].items[j].items.splice(index, 1);
                });
            });

        } else {
            $.each(data[0].items, function (j, n) {
                let delList = [];
                $.each(n.items, function (i, item) {
                    let txtLs = item.text.split('&');
                    item.text = txtLs[0];
                    data[0].items[j].items[i] = item;
                });

            });
        }


        let totalEmp = 0;
        $.each(data[0].items, function (i, n) {
            data[0].items[i].text = n.text + "(" + n.items.length + ")";
            totalEmp += n.items.length;

        });
        let rtBtnState = "-全部";
        if (isInOut) {
            rtBtnState = "-在线";
        } else if (isInOut === false) { rtBtnState = "-离线"; }

        data[0].text = data[0].text + "(" + totalEmp + ")" + rtBtnState;

        kendo.ui.progress($('#splitContainer'), true);
        kendo.ui.progress($('#splitContainer'), false);
        deptTreeControl.setTreeData("");
        deptTreeControl.setTreeData(data);
        deptTreeControl.tree.expand('.k-item:first');

        if (!this.selectRtEmpIds)
            return;

        kendo.ui.progress($('#splitContainer'), true);
    },

    initHisEmpTree: function (data) {
        if (data === undefined)
            return;
        $.each(data[0].items, function (j, n) {
            $.each(n.items, function (i, item) {
                let txtLs = item.text.split('&');
                item.text = txtLs[0];
                data[0].items[j].items[i] = item;
            });
        });

        kendo.ui.progress($('#splitContainer'), true);
        kendo.ui.progress($('#splitContainer'), false);
        deptTreeControl.setTreeData("");
        deptTreeControl.setTreeData(data);
        deptTreeControl.tree.expand('.k-item:first');
        kendo.ui.progress($('#splitContainer'), true);
    },
    //部门过滤
    filtrateRtDept: function () {
        // if (!this.isExitRole()) return;
        showChkRtEmp = [];
        var checkedIds = deptTreeControl.getCheckedItems().ids;
        if (checkedIds.length === 0) {
            // showChkRtEmp = [];
            layer.msg("没有过滤信息，显示所有实时信息...", { icon: 5, time: 3000 });
        } else {
            checkedIds.forEach(n => {
                let tagNoList = n.split('-');
                if (tagNoList.length === 1) {
                    showChkRtEmp.push(n);
                }
            });
            //  showChkRtEmp = checkedIds;
        }
        kendo.ui.progress($('#splitContainer'), true);

        map2dLayer.clearFloorAllRtEmp();
    },
    initTree: function (divid) {
        let that = this;
        deptTreeControl = {};
        let treeoption = {};
        treeoption.selector = '#' + divid;
        //treeoption.selector = '#lefttop';
        treeoption.showCheckBox = true;
        treeoption.check = function (e) {
            that.selectRtEmpIds = e.sender.dataItem(e.node);
            deptTreeControl.checkItemsDownward(e.node);
            if (deptTreeControl.tree.dataItem(e.node).checked)
                return;
            deptTreeControl.checkItemsUpward(e.node);
        }
        deptTreeControl = new EAP.UI.TreeControl(treeoption);
        map2dLayer.loadDeptTree();

    },

    IsExistEmpObj3D: function (tagCode) {
        let plan3DMode = map2dLayer.getFloor();

        let isHave = false;
        if (plan3DMode === undefined) {
            return false;
        } 

        //rtemp
        //plan3D
        //$.each(obj3DEmp.children, function (i, emp) {
        $.each(plan3DMode.children, function (i, emp) {
            if (emp.objType === 'emp') {
                if (emp.name === tagCode) {
                    isHave = true;
                    //转换坐标              
                    if (objSelectTrack !== undefined) {
                        if (objSelectTrack === emp.name) {
                            sys.MapData.changeCamreLookat(emp);
                        }
                    }
                }
            }
        });
        return isHave;
    },
    IsExistHisEmpObj3D: function (tagCode) {
        let plan3DMode = map2dLayer.getFloor();
        var isHave = false;
        if (plan3DMode === undefined) {
            return false;
        } 
        $.each(plan3DMode.children, function (i, emp) {
            if (emp.objType === 'emp_his') {
                if (emp.name === tagCode) {
                    isHave = true;
                    //转换坐标              
                    if (objSelectTrack !== undefined) {
                        if (objSelectTrack === emp.name) {
                            sys.MapData.changeCamreLookat(emp);
                        }
                    }
                }
            }
        });
        return isHave;
    },

    isshowReg: function (isShow, regtype) {
        let plan3DMode = map2dLayer.getFloor();
        if (plan3DMode !== undefined) {
            // GraphList.getList();
            $.each(plan3DMode.children, function (i, obj) {
                if (obj.objType === regtype) {
                    obj.visible = isShow;
                }
            });

        }
    },
    lookAtEmp: function (tagNo) {
        var isHaveEmp = false;
        let plan3DMode = map2dLayer.getFloor();
        $.each(plan3DMode.children, function (i, emp) {
            if (emp.objType === 'emp') {
                //根据人员标签或是人员姓名查找模型对象
                if (emp.name === tagNo || emp.showName === tagNo) {
                    objSelectTrack = emp.name;
                    isHaveEmp = true;
                }
            }
        });
        return isHaveEmp;
    },
    showEmpTrackLine: function (flag, empname) {
        let plan3DMode = map2dLayer.getFloor();
        if (empname !== "") {
            $.each(plan3DMode.children, function (i, emp) {
                if (emp.objType === 'emp') {
                    if (emp.name === empname || emp.showName === empname) {
                        emp.showTrack = flag;
                    }
                }
            });
        } else {
            $.each(plan3DMode.children, function (i, emp) {
                if (emp.objType === 'emp') {
                    emp.showTrack = flag;
                }
            });
        }
    },

    IsExistTrackLine: function (obj, lid) {
        let isHave = false;
        $.each(obj.trackList, function (i, line) {
            if (line === lid) {
                isHave = true;
            }
        });
        return isHave;
    },
    changeEmpPosition: function (tagCode, ps) {
        // var isHave = false;
        let plan3DMode = map2dLayer.getFloor();
        //$.each(obj3DEmp.children, function (i, emp) {
        $.each(plan3DMode.children, function (i, emp) {
            //          empIcon.objType = 'emp';    empIcon.drawcolor = Math.random() * 0xffffff; //随机色
            if (emp !== undefined && emp.objType === 'emp') {
                if (emp.name === tagCode) {
                    // isHave = true;
                    //转换坐标               
                    var prePs = emp.PrePoint;
                    emp.position.set(ps.x, ps.y - 40, ps.z);
                    // console.log(tagCode + "号标签 坐标:" + ps.x + "," + ps.y + "," + ps.z );
                    if (emp.showTrack === true) {
                        //画线
                        //var lid = rtemp.position.Self + '&' + rtemp.PrePoint;
                        var lid = prePs.x + ',' + prePs.y + ',' + prePs.z + '&' + ps.x + ',' + ps.y + ',' + ps.z;
                        var isHH = map2dLayer.IsExistTrackLine(emp, lid);
                        if (isHH === false) {
                            var points = [];
                            points.push(prePs);
                            points.push(ps);
                            emp.PrePoint = ps;
                            emp.trackList.push(lid);

                            var lineT = map2dLayer.createHisLine(points, emp.drawcolor);
                            lineT.objType = 'emp_trackline';
                            lineT.name = emp.name;
                            lineT.lid = lid;
                            map2dLayer.AddObj2DRegion(lineT);
                            //sys.draw.plan3DAdd(lineT);

                            if (emp.trackList.length > 500) {
                                //移除
                                var lid = emp.trackList.shift();
                                let delObj = map2dLayer.GetFloorTrackLineById(lid);
                                map2dLayer.removeObjFromFloor(delObj);
                                // var delObj = sys.newmap3D.GetTrackLineById(lid);
                                // sys.draw.removePlan3D(delObj);
                            }
                        }
                    } else {
                        emp.PrePoint = ps;
                        if (emp.trackList.length > 0) {
                            //移除轨迹线                         
                            $.each(emp.trackList, function (j, lid) {
                                let delObj = map2dLayer.GetFloorTrackLineById(lid);
                                map2dLayer.removeObjFromFloor(delObj);
                                //var delObj = sys.newmap3D.GetTrackLineById(lid);
                                //sys.draw.removePlan3D(delObj);
                            });
                        }
                    }
                }
            }

        });
        // return isHave;
    },
    //删除所有人员或设备图标
    clearFloorAllRtEmp: function () {
        let delObj = [];
        let plan3DMode = map2dLayer.getFloor();
        $.each(plan3DMode.children, function (i, emp) {
            if (emp.objType === 'emp') {
                if ($.inArray(emp.name, showChkRtEmp) === -1) {
                    delObj.push(emp);
                }
            }
        });
        if (delObj.length > 0) {
            $.each(delObj, function (i, obj) {
                $.each(obj.trackList, function (j, lid) {
                    let deltra = map2dLayer.GetFloorTrackLineById(lid);
                    map2dLayer.removeObjFromFloor(deltra);
                });
                map2dLayer.removeObjFromFloor(obj);
            });
        };
    },
    /// 根据类型删除
    clearObjByObjType: function (obj) {
        let delObj = [];
        let plan3DMode = map2dLayer.getFloor();
        $.each(plan3DMode.children, function (i, emp) {
            if (emp.objType === obj) {
                delObj.push(emp);
            }
        });
        if (delObj.length > 0) {
            $.each(delObj, function (i, obj) {
                map2dLayer.removeObjFromFloor(obj);
            });
        };
    },
    ///根据类型和名称删除对象
    clearObjByNameType: function (obj, name) {
        let delObj = [];
        let plan3DMode = map2dLayer.getFloor();
        $.each(plan3DMode.children, function (i, emp) {
            if (emp.objType === obj) {
                if (emp.name === name) {
                    delObj.push(emp);
                }
            }
        });
        if (delObj.length > 0) {
            $.each(delObj, function (i, obj) {
                map2dLayer.removeObjFromFloor(obj);
            });
        };
    },
    setAreaAlmColor: function (key, isAlm) {
        let plan3DMode = map2dLayer.getFloor();
        if (plan3DMode !== undefined)
            $.each(plan3DMode.children, function (i, item) {
                if (item.name === key) {
                    //报警
                    if (isAlm === true) {
                        item.material.color.setHex(0xFFB6C1); //= sysConfig.regColor.alarm;
                    } else {  //恢复正常                               
                        item.material.color.setHex(0x7CFC00);  //= sysConfig.regColor.normal;
                    }
                }
            });
    },

    GetFloorTrackLineById: function (lid) {
        var isHave = null;
        let plan3DMode = map2dLayer.getFloor();
        $.each(plan3DMode.children, function (i, line) {
            if (line.lid === lid) {
                isHave = line;
            }
        });
        return isHave;
    },
    removeObjFromFloor: function (obj) {
        let plan3DMode = map2dLayer.getFloor();
        plan3DMode.remove(obj);
    },

    //map2dLayer.selectInfoShow()
    selectInfoShow: function () {
        var option = "";
        var a3 = document.getElementById('a3');
        var div = document.createElement('div');
        div.setAttribute('id', 'd1');
        $("#companys").empty();
        let msg = "";
        $.each(TagList, function (i, emp) {

            msg = "";
            if (emp.tel !== "") {
                msg += (" " + emp.tel);
            }
            if (emp.objNum !== "") {
                msg += (" " + emp.objNum);
            }
            if (emp.remark !== "") {
                msg += (" " + emp.remark);
            }
            if (msg !== "") {
                option += "<option value=" + emp.tagCode + ">" + emp.tName + " " + msg + "</option>";
                //option += "<option value=" + emp.tName + ">" + emp.tagCode + " " + msg + "</option>";
            } else {
                option += "<option value=" + emp.tagCode + ">" + emp.tName + "</option>";
                // option += "<option value=" + emp.tName + ">" + emp.tagCode + "</option>";
            }
        });
        $("#companys").append(option);
        
        //moveOption
        $("#companys").click(() => {
            let input_select = $("#companys")[0].selected;
            alert(input_select);
        });
        $("#companys").change(() => {
            let input_select = $("#companys")[0].selected;
            alert(input_select);

        });
        var sel = document
        $("#selectFind").click(function () {
            selectOnClick(map2dLayer.seachEmpNew);
        });
    },
    getKey: function getKey() {
        if (event.keyCode === 13) {
            map2dLayer.seachEmpNew();
        }
    },
    seachEmpNew: function (txtsel) {
        //alert(111);
        var txtsel = $("#input1").val();
        if (txtsel === null || txtsel === "") {
            layer.msg('请输入要查的信息！', { icon: 5, time: 3000 });
        } else {
            isHisPlay = false;
            var isHEmp = map2dLayer.lookAtEmp(txtsel);
            if (isHEmp === false) {
                layer.msg(txtsel + '信息没有查到...', { icon: 5, time: 3000 });
            }
        }
    },

    initMqttConfig: function () {
        let fileMPath = '../../Config/mqtt.json';
        $.getJSON(fileMPath, function (data) {
            mqttConfig.Server = data.Server;
            mqttConfig.Port = data.Port;
            mqttConfig.SSL = data.SSL;
            mqttConfig.UserId = data.UserId;
            mqttConfig.Password = data.Password;
            mqttConfig.Timeout = data.Timeout;
            mqttConfig.rtPs = data.dataKeys[0];
            mqttConfig.rtAlm = data.dataKeys[1];
            mqttConfig.rtAtt = data.dataKeys[2];
            mqttConfig.trackVideo = data.dataKeys[3];
            mqttConfig.wsip = data.wsip;
            mqttConfig.wsport = data.wsport;

            if (callbackmqtt !== '') {
                funcallback(eval(callbackmqtt));
            }

        });
    },



    /*********************************楼层切换选项***************************************************/
    loadCurLayer: function (vid) {
        let finddiv = $("div[name='divlayer']");
        if (finddiv.length > 0)
            return;
        var div = document.createElement('div');
        div.setAttribute('id', 'divlayer');
        div.setAttribute('name', 'divlayer');
        div.style['z-index'] = 99999;
        $('#' + vid).append($(div));
        clientMode.getfile("/RPM/3DJS/layerOption.html", function (data) {
            var div = document.getElementById('divlayer');
            div.innerHTML = data;
            map2dLayer.initLayerSel();
        });
    },
    initLayerSel: function () {
        if (SysConfingList.length > 0) {
            let oneLayer = getLayerByName(curFloor);//SysConfingList[curFloor];

            //var labfloor = document.getElementById("lblsel");
            //$('#lblsel').html(oneLayer.floor);
            map2dLayer.refreshSelectObj('selectid');
        }
    },
    refreshSelectObj: function (objid) {
        if (SysConfingList.length === 0)
            return;
        $("#" + objid).empty();
        let objSelect = document.getElementById(objid);
        for (var op = 0; op < SysConfingList.length; op++) {
            let option = document.createElement("option");
            option.value = op;
            option.innerText = SysConfingList[op].floor;
            objSelect.appendChild(option);
        }
    },
    divdbclick: function () {
        //editbase.divdbclick
        //  map2dLayer.refreshSelectObj('selectid');
        // map2dLayer.ShowDiv('lblsel');
        map2dLayer.ShowDiv('selectid');
    },
    selchanged: function () {
        map2dLayer.selectShow();
    },
    selectShow: function () {
        let objSelect = document.getElementById("selectid");
        let sectxt = objSelect.options[objSelect.selectedIndex].text;
        map2dLayer.ShowDiv('selectid');
        /////移除楼层   
        map2dLayer.change2Dfloor(sectxt);
        //map2dLayer.setLayerFloorInfo(sectxt);
        //if (callchangefloor !== '') {
        //    funcallbackvalue(eval(callchangefloor), sectxt);
        //}
    },

    setLayerFloorInfo(sectxt) {
        ///移除楼层
        map2dLayer.clearLayerdObj(curFloor);
        curFloor = sectxt;  //当前楼层索引
        map2dLayer.getSysInfoFloor();
        map2dLayer.initinfo();//加载对应的图层信息
        //  $('#lblsel').text(sectxt);
    },
    getSysInfoFloor: function () {
        let sysInfoFloor = getLayerByName(curFloor);//SysConfingList[ifloor];
        tranX = sysInfoFloor.mapTranX;
        tranY = sysInfoFloor.mapTranY;
    },
    selectedClear: function () {
        if (objSelected !== undefined) {
            if (objSelected.objType === 'emp' || objSelected.objType === 'sta' || objSelected.objType === 'video') {
                objSelected.material.opacity = 1;
            }
            else {
                objSelected.material.opacity = 0.5;
            }
        }
        objSelected = undefined;
    },
    removeULli: function (uid) {
        //$("ul>li").not(":eq(0)").remove();
        // $("#ul li").not(":first").remove(); 
        $("#" + uid + ">li").not(":eq(0)").remove();
    },

    /*************************部门树的查询*****************************************************************/
    loadEmpDeptTree: function () {
        let urlPath = '/Graphic/GetDeptEmpTree';
        clientMode.post(urlPath, "", function (data) {
            if (data.length > 0) {
                empDeptTree = data;
                let jsonstr = JSON.stringify(data);
                // 存储json字符串  
                window.localStorage.setItem('deptEmpTree', jsonstr);
            }
        });
    },
    loadShowEmpInfo: function (aid) {
        let urlPath = '/Graphic/GetAttEmpInfo';
        let strJson = { areaid: aid };
        clientMode.post(urlPath, strJson, function (data) {
            isAttEmp = [];
            let Tag = undefined;
            if (data.length > 0) {
                attInOutTime = data[0].Almin + "&" + data[0].Almout;
                data.forEach((o) => {
                    Tag = o.PositionTag;
                    if (Tag !== null) {
                        isAttEmp.push(o.PositionTag.Code);
                    }
                });
            }
            if (callbackfun !== '') {
                funcallback(eval(callbackfun));
            }
        });
    },
    initEmpDeptTree: function (divid) {
        let that = this;
        deptTreeControl = {};
        let treeoption = {};
        treeoption.selector = '#' + divid;
        //treeoption.selector = '#lefttop';
        treeoption.showCheckBox = true;
        treeoption.check = function (e) {
            that.selectRtEmpIds = e.sender.dataItem(e.node);
            deptTreeControl.checkItemsDownward(e.node);
            if (deptTreeControl.tree.dataItem(e.node).checked)
                return;
            deptTreeControl.checkItemsUpward(e.node);
        }
        deptTreeControl = new EAP.UI.TreeControl(treeoption);
        // map2dLayer.loadDeptTree();
    },
    initEmpDeptData: function (data, showEmp, isEdit) {
        if (data === undefined)
            return;

        //取消选择状态
        $.each(data[0].items, function (j, n) {
            data[0].items[j].checked = false;
            $.each(n.items, function (i, item) {
                let txtLs = item.text.split('&');
                let empname = txtLs[0].trim();
                item.text = empname;
                data[0].items[j].items[i] = item;
                data[0].items[j].items[i].checked = false;
            });
        });

        //if (isEdit === "Edit" || addEdit === true) {
        if (showEmp.length > 0) {
            let deptids = {};
            $.each(data[0].items, function (j, n) {
                let delList = [];

                $.each(n.items, function (i, item) {
                    let txtLs = item.text.split('&');
                    let empname = txtLs[0].trim();
                    item.text = empname;
                    data[0].items[j].items[i] = item;
                    //Checked
                    if ($.inArray(item.id, showEmp) !== -1) {
                        let deptid = data[0].items[j].id;
                        let dept = deptids[deptid];
                        if (dept === undefined) {
                            let dt = { id: deptid, count: 1 };
                            deptids[deptid] = dt;
                        } else {
                            dept.count = dept.count + 1;
                            deptids[deptid] = dept;
                        }
                        data[0].items[j].items[i].checked = true;
                    }
                });
            });

            $.each(data[0].items, function (j, n) {
                let did = n.id;
                let deptM = deptids[did];
                if (deptM !== undefined) {
                    let count = deptM.count;
                    if (n.items.length === count) {
                        data[0].items[j].checked = true;
                    }
                }
            });
        } else {
            ///新增时过滤掉已经配置的人员信息
            //$.each(data[0].items, function (j, n) {
            //    let delList = [];
            //    $.each(n.children, function (i, item) {
            //        let txtLs = item.text.split('&');
            //        let empname = txtLs[0].trim();
            //        if ($.inArray(item.id, showEmp) !== -1) {
            //            delList.push(i);
            //        }
            //        item.text = empname;
            //        data[0].items[j].items[i] = item;
            //    });
            //    delList.reverse().forEach((index) => {
            //        //  data[0].items[j].children.splice(index, 1);
            //        data[0].items[j].items.splice(index, 1);
            //    });
            //});

        }
        let totalEmp = 0;
        $.each(data[0].items, function (i, n) {
            data[0].items[i].text = n.text; //n.text + "(" + n.items.length + ")";
            totalEmp += n.items.length;

        });

        data[0].text = data[0].text; //data[0].text + "(" + totalEmp + ")" ;

        kendo.ui.progress($('#splitContainer'), true);
        kendo.ui.progress($('#splitContainer'), false);
        deptTreeControl.setTreeData("");
        deptTreeControl.setTreeData(data);
        deptTreeControl.tree.expand('.k-item:first');
        kendo.ui.progress($('#splitContainer'), true);
    },

    /****************时间区间设置********************************************************************/
    //map2dLayer.changeSelOption()
    changeSelOption: function () {
        let arr = ['00', '15', '30', '45'];
        let startTime = $("#selIn option:selected").text();
        let tlst = startTime.split(':');
        let option = "";

        let index = $.inArray(tlst[1], arr)
        for (var i = index; i < arr.length; i++) {
            strVal = tlst[0] + ":" + arr[i];
            option += "<option value=" + index + ">" + strVal + "</option>";
        }
        option += map2dLayer.addOption((Number(tlst[0]) + 1), 24, arr, (arr.length - index));
        $("#selOut").empty();
        $("#selOut").append(option);
        if (selfDraw.AreaSet !== undefined) {
            let inouttime = selfDraw.AreaSet;
            if (inouttime !== undefined) {
                let tls = inouttime.split('&');
                map2dLayer.findselected('selOut', tls[1].trim());
            }
        }
    },
    initSelectOption: function () {
        let arr = ['00', '15', '30', '45'];
        let intime = map2dLayer.addOption(0, 24, arr);
        $("#selIn").append(intime);
        $("#selOut").append(intime);

        // if (editReg === "Edit") {
        if (selfDraw.AreaSet !== undefined) {
            let inouttime = selfDraw.AreaSet;
            if (inouttime !== undefined) {
                let tls = inouttime.split('&');
                let index = map2dLayer.findselected('selIn', tls[0].trim());
                map2dLayer.changeSelOption();
                map2dLayer.findselected('selOut', tls[1].trim());
            }
        }
    },
    findselected: function (id, strVal) {
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
    },
    addOption: function (start, end, arr, index) {
        let option = "";
        let strVal = "";

        var index = index || 0;
        for (var i = start; i < end; i++) {
            arr.forEach((o) => {
                strVal = i + ":" + o;
                option += "<option value=" + index + ">" + strVal + "</option>";
                index++;
            })
        }
	if(end !==24){
           strVal = end + ":00";
        }else{
	    strVal ="23:59";
        }
        option += "<option value=" + index + ">" + strVal + "</option>";

        return option;
    },
    createOption: function (start, end) {
        let option = "";
        let strVal = "";
        for (let i = start; i <= end; i++) {
            strVal = i * 10;
            option += "<option value=" + i + ">" + strVal + "</option>";
        }
        return option;
    },

    /****************区域坐标调整********************************************************************/
    loadDialog: function () {
        map2dLayer.initRegPoints();
        let option = map2dLayer.createOption(1, 10);
        $("#seldiff").empty();
        $("#seldiff").append(option);

        //jQuery("#formEditDialog").dialog("destroy");
        //$("#formEditDialog").html("");
    },
    initRegPoints: function () {
        if (selfDraw === undefined)
            return;
        let points = selfDraw.pointList;
        let strps = "";
        let drps = undefined;
        let option = "";
        // point.x = point.x.toFixed(2);
        points.forEach((item, index) => {
            drps = round2(item);
            strps = drps.x + "," + drps.y + "," + drps.z;
            option += "<option value=" + index + ">" + (index + 1) + ") " + strps + "</option>";
        });
        $("#regps").empty();
        $("#regps").append(option);

    },

    //map2dLayer.moveDiffXY
    moveDiffXY: function (istype, oper) {
        let objSelect = document.getElementById("seldiff");
        let selValue = objSelect.options[objSelect.selectedIndex].text
        let sectxt = 20;
        if (selValue !== "")
            sectxt = Number(selValue);

        let drps = undefined;
        if (selfDraw === undefined)
            return;

        $("#txtX").val("");
        $("#txtY").val("");
        $("#txtZ").val("");

        let points = selfDraw.pointList;
        let psList = [];
        points.forEach((item) => {
            drps = round2(item);
            if (istype === "x") {
                if (oper === true)//正
                {
                    drps.x = drps.x + sectxt;
                } else {
                    drps.x = drps.x - sectxt;
                }
            }
            else if (istype === "y") {
                if (oper === true)//正
                {
                    drps.y = drps.y + sectxt;
                } else {
                    drps.y = drps.y - sectxt;
                }
            }
            psList.push(drps);
        });
        selfDraw.pointList = psList;
        map2dLayer.initRegPoints();
        map2dLayer.drawRegDiff();
    },
    changeDiffXYZ: function (txtid, oper) {
        let objSelect = document.getElementById("seldiff");
        let selValue = objSelect.options[objSelect.selectedIndex].text
        selValue = parseFloat(selValue);
        let strTxt = parseFloat($("#" + txtid).val());
        let result = 0;
        //T - add F-subtrac
        if (oper) {
            result = strTxt + selValue;
        } else {
            result = strTxt - selValue;
        }
        result = roundNum2(result);
        $("#" + txtid).val(result);
        map2dLayer.regPsEdit();

    },
    drawRegDiff: function () {
        if (selfDraw === undefined)
            return;
        let item = selfDraw;
        if (map2dLayer.IsHaveReg(item.id)) {
            //移除区域
            if (selfShape !== undefined)
                map2dLayer.removeObj2DRegion(selfShape);
        }
        let shape = sys.draw.drawRegByJson(item);
        selfShape = shape;
        map2dLayer.AddObj2DRegion(shape);
    },
    //map2dLayer.showRegPoints()
    showRegPoints: function () {
        $('.dot').show();
        $('.alarm').hide();
        $('.call').hide();
        $('.fence').hide();
        if (selfDraw === undefined)
            return;
        if (selfDraw.showName === "") {
            let showName = $("#regNames").val();
            if (showName === "" || showName === undefined || showName === null) {
                layer.msg('请填写区域名称...', { icon: 6, time: 3000 });
                return;
            } else {
                selfDraw.showName = showName;
                map2dLayer.addULName();
            }
        }
        map2dLayer.loadDialog();

        //$("#lblMessage").text("");
        //let strPath = '/RPM/3DJS/EditRegPoints.html';
        //// isIn = isOper;
        //clientMode.getfile(strPath, function (data) {
        //    jQuery("#DialogSelect").html(data);
        //     map2dLayer.loadDialog();
        //    jQuery("#DialogSelect").dialog({
        //        title: "区域坐标修正",
        //        width: 390,
        //        resizable: false,
        //        modal: true,
        //        position: ['center', 50],
        //        close: function (event, ui) {
        //          map2dLayer.regPsSave();
        //        }
        //    });
        //});
    },

    selectdblclick: function () {
        let objSelect = document.getElementById("regps");
        regindex = objSelect.selectedIndex;
        let selValue = objSelect.options[regindex].text
        let sels = selValue.split(' ');
        let points = sels[1].split(',');
        $("#txtX").val(points[0]);
        $("#txtY").val(points[1]);
        $("#txtZ").val(points[2]);
    },
    regPsEdit: function () {
        //objSelect.selectedIndex
        let ps = selfDraw.pointList[regindex];
        // alert(ps.x + "," + ps.y + "," + ps.z);
        let strX = $("#txtX").val();
        let strY = $("#txtY").val();
        let strZ = $("#txtZ").val();
        if (strX === "" && strY === "" && strZ === "") {
            layer.msg('请双击单个坐标点进行调整...', { icon: 6, time: 3000 });
            return;
        }
        if (parseFloat(strX).toString() === "NaN") {
            layer.msg('请输入数字...', { icon: 6, time: 3000 });
            $("#txtX").val(ps.x);
            return;
        }

        if (parseFloat(strY).toString() === "NaN") {
            layer.msg('请输入数字...', { icon: 6, time: 3000 });
            $("#txtY").val(ps.y);
            return;
        }

        if (parseFloat(strZ).toString() === "NaN") {
            layer.msg('请输入数字...', { icon: 6, time: 3000 });
            $("#txtZ").val(ps.z);
            return;
        }


        selfDraw.pointList[regindex].x = Number(strX);
        selfDraw.pointList[regindex].y = Number(strY);
        selfDraw.pointList[regindex].z = Number(strZ);
        map2dLayer.initRegPoints();
        map2dLayer.drawRegDiff();
    },
    //保存坐标修正
    regPsSave: function () {
        if (selfDraw !== undefined) {
            basicdata.saveOneRegMode(selfDraw);
            $('.dot').hide();
        }
        //$("#DialogSelect").dialog("destroy");
        //$("#DialogSelect").html("");
    },
    addULName: function () {
        if (selfDraw !== undefined) {
            let regName = selfDraw.showName;
            let regid = selfDraw.id;
            let busType = selfDraw.busType;
            if (busType === 'alarmRegion') {
                map2dLayer.addRegUl('alarmList_ul', regid, selfDraw.showName);
                GraphList.add(selfDraw);
            } else if (busType === 'attendRegion') {
                map2dLayer.addRegUl('attendList_ul', regid, regName);
                AttendRegList.add(selfDraw);
            }
            else if (busType === 'rollcallRegion') {
                map2dLayer.addRegUl('rclist_ul', regid, regName);
                RollCallList.add(selfDraw);
            }
        }
    },
    getTagInfo: function (tagno) {
        let tag = undefined;
        $.each(TagList, function (i, n) {
            if (n.tagCode === tagno)
                tag = n;
        });
        return tag;
    },
    showTips: function (moveps, mouse) {

        if (objSelected.showname === undefined)
            return;
        let strmsg = "";
        $("#rtDialogDiv").empty();
        if (objSelected !== undefined) {
            if (objSelected.objType === 'emp') {
                let empInfo = map2dLayer.getTagInfo(objSelected.name);
                let vol = map2dLayer.showVolage(empInfo.Voltage)

                //if (empInfo === undefined) {
                //    strmsg = "<div class='wrapdiv'><div>名 称:</div > <div>" + objSelected.showname + "</div></div>"
                //}
                if (empInfo.useState === 2) {
                    strmsg += "<div class='wrapdiv'><div>标 签:</div > <div>" + empInfo.tCode + "</div></div>"
                    strmsg += "<div class='wrapdiv'><div>电 量:</div > <div>" + vol + "</div></div>"
                    strmsg += "<div class='wrapdiv'><div>名 称:</div > <div>" + empInfo.tName + "</div></div>"
                    strmsg += "<div class='wrapdiv'><div>备 注:</div > <div>" + empInfo.remark + "</div></div>"
                }
                else {
                    let deptInfo = DeptList[empInfo.deptid];
                    strmsg += "<div class='wrapdiv'><div>标 签:</div > <div>" + empInfo.tCode + "</div></div>"
                    strmsg += "<div class='wrapdiv'><div>电 量:</div > <div>" + vol + "</div></div>"
                    strmsg += "<div class='wrapdiv'><div>名 称:</div > <div>" + empInfo.tName + "</div></div>"
                    strmsg += "<div class='wrapdiv'><div>编 号:</div > <div>" + empInfo.objNum + "</div></div>"
                    if (deptInfo !== undefined) {
                        strmsg += "<div class='wrapdiv'><div>部 门:</div > <div>" + deptInfo.Name + "</div></div>"
                    }
                    strmsg += "<div class='wrapdiv'><div>电 话:</div > <div>" + empInfo.tel + "</div></div>"
                    strmsg += "<div class='wrapdiv'><div>备 注:</div > <div>" + empInfo.remark + "</div></div>"

                }

            } else if (objSelected.showname === 'dev') {
                strmsg = "<div class='wrapdiv'><div>名 称:</div > <div>" + objSelected.showname + "</div></div>"
            } else {
                strmsg = "<div class='wrapdiv'><div>名称:</div > <div>" + objSelected.showname + "</div></div>"
            }
            $("#rtDialogDiv").append(strmsg);
            map2dLayer.renderDiv(objSelected, mouse);
        }
    },
    renderDiv: function (object, moveps) {
        var mouse = map2dLayer.threeToScreen(moveps);
        $("#rtDialogDiv").css({
            left: mouse.x,
            top: mouse.y
        });
        $("#rtDialogDiv").show();
    },
    threeToScreen: function (position) {
        var worldVector = new THREE.Vector3(
            position.x,
            position.y,
            position.z
        );
        var standardVector = worldVector.project(camera);//世界坐标转标准设备坐标
        var a = window.innerWidth / 2;
        var b = window.innerHeight / 2;
        var x = Math.round(standardVector.x * a + a);//标准设备坐标转屏幕坐标
        var y = Math.round(-standardVector.y * b + b);//标准设备坐标转屏幕坐标
        return {
            x: x,
            y: y
        };
    },

    // //上下左右图标标
    moveDiffX1: function () {
        map2dLayer.moveDiffXY('x', false);
    },
    moveDiffY1: function () {
        map2dLayer.moveDiffXY('y', true);
    },
    moveDiffX2: function () {
        map2dLayer.moveDiffXY('x', true);
    },
    moveDiffY2: function () {
        map2dLayer.moveDiffXY('y', false);
    },

    //XYZ坐标位移
    changeDIffX1: function () {
        map2dLayer.changeDiffXYZ('txtX', false);
    },
    changeDIffY1: function () {
        map2dLayer.changeDiffXYZ('txtY', false);
    },
    changeDIffZ1: function () {
        map2dLayer.changeDiffXYZ('txtZ', false);
    },
    changeDIffX2: function () {
        map2dLayer.changeDiffXYZ('txtX', true);
    },
    changeDIffY2: function () {
        map2dLayer.changeDiffXYZ('txtY', true);
    },
    changeDIffZ2: function () {
        map2dLayer.changeDiffXYZ('txtZ', true);
    },

    moveBind: function (obj, evnt) {
        //获得元素坐标。
        var left = obj.parentNode.offsetLeft;
        var top = obj.parentNode.offsetTop;
        var width = obj.parentNode.offsetWidth;
        var height = obj.parentNode.offsetHeight;

        //计算出鼠标的位置与元素位置的差值。
        var cleft = evnt.clientX - left;
        var ctop = evnt.clientY - top;

        document.onmousemove = function (doc) {
            //计算出移动后的坐标。
            var moveLeft = doc.clientX - cleft;
            var moveTop = doc.clientY - ctop;

            //设置成绝对定位，让元素可以移动。
            obj.parentNode.style.position = "absolute";

            //当移动位置在范围内时，元素跟随鼠标移动。
            //obj.style.left = moveLeft + "px";
            //obj.style.top = moveTop + "px";
            obj.parentNode.style.left = moveLeft + "px";
            obj.parentNode.style.top = moveTop + "px";

        };

        document.onmouseup = function () {
            document.onmousemove = function () { };
        };
    },

    change2Dfloor: function (sectxt) {
        map2dLayer.setLayerFloorInfo(sectxt);
        if (callchangefloor !== '') {
            funcallbackvalue(eval(callchangefloor), sectxt);
        }
    },
    setSelectChecked: function (checkValue) {
        var select = document.getElementById("selectid");
        for (var i = 0; i < select.options.length; i++) {
            if (select.options[i].innerHTML === checkValue) {
                select.options[i].selected = true;
                break;
            }
        }
        map2dLayer.change2Dfloor(checkValue);
    },
    //map2dLayer.showVolage()
    showVolage(vo) {
        let vomsg = "需充电";
        // 需充电（低于345）  低电量（345 - 370） 中电量（371 - 390）高电量（高于390）
        if (vo > 390) {
            vomsg = "高电量";
        } else if (vo > 370) {
            vomsg = "中电量";
        } else if (vo > 345) {
            vomsg = "低电量";
        }
        return vomsg;
    },

    //获取当前选中的Three对象
    getselectObj: function (event) {
        // map2dLayer.showRtMousePoint(event);
        // event.preventDefault();
        let mouseps = new THREE.Vector2();
        mouseps.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseps.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouseps, camera);
        let objSelectNew = undefined;
        let objFloor = map2dLayer.getFloor();
        if (objFloor === undefined)
            return objSelectNew;
        let intersects = raycaster.intersectObjects(objFloor.children);
        if (intersects.length > 0) {
            let mouseSelObj = new THREE.Vector2();
            mouseSelObj.x = intersects[0].point.x;
            mouseSelObj.y = intersects[0].point.y;
            let objSelNew = intersects[0].object;
            objSelNew.point = intersects[0].point;
            if (objSelNew !== undefined) {
                if (objSelNew.objType === 'video') {
                    return objSelNew;
                }
            }
        }

        return objSelectNew;
    },

    getbuttonkey: function (e) {
        let retBut = -1;
        if (e.button === 0) {
            mouseKey = 1;
            console.log("点击左键 mouseKey=" + mouseKey);
        }

        isdb = !isdb;
        if (isdb) {
            isdb = true;
            mouseKey = -1;
            if (e.button === 0) {
                //左键双击
                // objSelectTrack = undefined;
                retBut = 0;
            }
            else if (e.button === 2) {
                //右键双击
                retBut = 2;
            }
            return retBut;
        }
        tc = window.setTimeout(cc, 200);
        function cc() {
            //   console.log("单击 mouseKey=" + mouseKey);
            isdb = true;
        }
        return retBut;
    },
    ///查找当前图层所有电子围栏信息
    findRegBusType: function (busType) {
        let regs = [];
        let regList = map2dLayer.getFloor();
        if (regList !== undefined) {
            $.each(regList.children, function (i, n) {
                if (n.busType === busType) {
                    regs.push(n);
                }
            });
        }
        return regs;
    },
}