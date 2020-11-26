/// <reference path="Self3d.js" />
/**全局渲染器 */
var renderer;
/**全局镜头 */
var camera3D;
/**全局场景对象 */
var scene3D;
/**全局光照对象 */
var light;
var container;
var controls;
var raycaster;
//var transformControl;
//var frustumSize = 1000;
//var planeGeometry;
//var tempObj;
//var loaderFont;
//var fontJsonUrl;
//var fontNew;
//var gui, objMTL;
//var groupRegion = null;
var mapLayer = [], almArea = [], proBar = undefined, proNum = 0, hisDrawTrack = [], trackAlt = 0, hisTotal = 0, hisNum = 0, chkTime = 100, sumToatl = 0, hisSetInte = undefined, isPause = true, isHisPlay = false, isClear = false;//底层选中元素
var obj3DRegs = undefined, obj3Drollcall = undefined, obj3DEmp = undefined, obj3DDev = undefined, objSelected = undefined, isSelectReg = false, objSelectTrack = undefined, is3DFull = false, isdraw = false, isdb = true, isOpen = false, plan3D;
var rtMousePs = undefined;
/***************************************************************
 * 该脚本提供基础的场景操作
 * 1.initCamera 初始化相机 
 * 2.initScene 初始化场景 
 * 3.initLight 初始化光线
 * 4.initThree 渲染场景 
 * 5.AddLine() 添加直线
 * 6.AddPoint() 添加点 
 * 7.AddPoline() 添加折线 
 * 8.InitMap() 初始化图 
 * 9.RemoveObj(obj) 移除场景中的元素
 * 
 *************************************************************/
sys.newmap3D = {
    /**********渲染场景************/
    initThree: function () {
        container = document.getElementById('newmap3d');
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);
        window.addEventListener('resize', sys.newmap3D.onWindowResize, false);
    },
    /**********初始化摄像机************/
    initCamera: function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        camera3D = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 10000);
        camera3D.position.set(0, 0, 200);
        camera3D.lookAt(new THREE.Vector3());

    },
    /************初始化场景************************/
    initScene: function () {
        scene3D = new THREE.Scene();
        scene3D.background = new THREE.Color(0xf0f0f0);
        ///  helper = new THREE.GridHelper(GridSize, GridStep, 0x0000ff, 0x808080);
        ///2D绘制面板 绘制网格
        //var geometry = new THREE.PlaneBufferGeometry(4000, 4000);
        var geometry = new THREE.PlaneBufferGeometry(sysConfig.mapWidth, sysConfig.mapHeight);
        var plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        plane.name = '元素选中层';
        // objects.push(plane);
        mapLayer.push(plane);
        // scene2D.add(plane);
        sys.newmap3D.AddScene3D(plane);
        //实现屏幕坐标向世界坐标系的转换功能
        raycaster = new THREE.Raycaster();

        // group = new THREE.Group();
        /////存人员对象的集合
        //obj3DEmp = new THREE.Object3D();
        //sys.newmap3D.AddScene3D(obj3DEmp);

        /////存车辆对象的集合
        //obj3DDev = new THREE.Object3D();
        //sys.newmap3D.AddScene3D(obj3DDev);



        ///存区域的集合对象
        obj3DRegs = new THREE.Object3D();
        obj3DRegs.name = 'obj3DRegs';
        sys.newmap3D.AddScene3D(obj3DRegs);

        ///轨迹线的集合
        //trackLine = new THREE.Object3D();
        //trackLine.name = 'trackLine';
        //sys.newmap3D.AddScene3D(trackLine);

    },

    /**********渲染环境光************/
    initLight: function () {
        sys.newmap3D.AddScene3D(new THREE.AmbientLight(0xf0f0f0));
    },
    ////初始化操作框，拖动，旋转，放大
    initOrbit: function () {

        ///创建网格
        helper = new THREE.GridHelper(GridSize, GridStep, 0x0000ff, 0x808080);
        helper.position.y = -10;
        helper.material.transparent = true;
        helper.material.opacity = 0.25;
        //  helper.visible = false;

        var plane = new THREE.Object3D();
        plane.add(helper);
        plane.rotateX(Math.PI / 2); //沿X轴方向选中90°     
        sys.newmap3D.AddScene3D(plane);

        controls = new THREE.OrbitControls(camera3D, renderer.domElement);
        // 如果使用animate方法时，将此函数删除
        //controls.addEventListener( 'change', renderer );

        // 使动画循环使用时阻尼或自转 意思是否有惯性
        controls.enableDamping = true;
        // controls.damping = 0.2;
        //动态阻尼系数 就是鼠标拖拽旋转灵敏度
        controls.dampingFactor = 0.25;
        //是否可以缩放
        controls.enableZoom = true;
        //是否自动旋转
        controls.autoRotate = false;
        //是否开启右键拖拽
        controls.enableRotate = true;

        //设置相机距离原点的最远距离
        controls.minDistance = -10;
        //设置相机距离原点的最远距离
        controls.maxDistance = 8000;
        //是否可旋转
        controls.enablePan = false;
    },
    render: function () {
        renderer.render(scene3D, camera3D);
    },
    animate: function () {
        //更新控制器
        //controls.update();


        ///是否显示网格
        if (sysConfig.isShowGrid == 0) {
            helper.visible = false;
        } else {
            helper.visible = true;
        }
        sys.newmap3D.render();

        requestAnimationFrame(sys.newmap3D.animate);
    },


    //自适应窗口大小
    onWindowResize: function () {
        camera3D.aspect = window.innerWidth / window.innerHeight;
        camera3D.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    },
    /***************Objects集合体*管理*Start*************************/
    AddScene3D: function (obj) {
        if (scene3D != undefined)
            scene3D.add(obj);
    },
    ///添加报警区域
    AddObj3DRegs: function (obj) {
        if (obj3DRegs != undefined)
            obj3DRegs.add(obj);
    },
    removeObj3DRegs: function (obj) {
        obj3DRegs.remove(obj);
    },
    ///添加电子点名区域
    //AddObj3Drollcall: function (obj) {
    //    obj3Drollcall.add(obj);
    //},
    ///添加人员图标
    //AddObj3DEmp: function (obj) {
    //    if (obj3DEmp != undefined)
    //        obj3DEmp.add(obj)
    //},
    IsExistTrackLine: function (obj, lid) {
        let isHave = false;
        $.each(obj.trackList, function (i, line) {
            if (line == lid) {
                isHave = true;
            }
        });
        return isHave;
    },
    GetTrackLineById: function (lid) {
        var isHave = null;
        $.each(plan3D.children, function (i, line) {
            if (line.lid == lid) {
                isHave = line;
            }
        });
        return isHave;
    },

    IsExistEmpObj3D: function (rtemp) {
        var isHave = false;
        //plan3D
        //$.each(obj3DEmp.children, function (i, emp) {
        $.each(plan3D.children, function (i, emp) {
            //          empIcon.objType = 'emp';    empIcon.drawcolor = Math.random() * 0xffffff; //随机色
            if (emp.objType == 'emp') {
                if (emp.name == rtemp.tagCode) {
                    isHave = true;
                    //转换坐标              
                    if (objSelectTrack != undefined) {
                        if (objSelectTrack == emp.name) {
                            sys.newmap3D.changeCamreLookat(emp);
                        }
                    }
                }
            }
        });
        return isHave;
    },

    drawHisTrack: function (tagCode, ps) {
        var isHave = false;
        $.each(plan3D.children, function (i, emp) {
            if (emp.objType == 'emp_his') {
                if (emp.name == tagCode) {
                    isHave = true;
                    //转换坐标               
                    var prePs = emp.PrePoint;
                    emp.position.set(ps.x, ps.y - 40, ps.z);

                    //画线
                    var lid = prePs.x + ',' + prePs.y + ',' + prePs.z + '&' + ps.x + ',' + ps.y + ',' + ps.z;
                    var isHH = sys.newmap3D.IsExistTrackLine(emp, lid);
                    if (isHH == false) {
                        var points = [];
                        points.push(prePs);
                        points.push(ps);
                        emp.PrePoint = ps;
                        emp.trackList.push(lid);
                        var lineT = sys.baseNew3D.createLine(points, emp.drawcolor);
                        lineT.objType = 'emp_histrackline';
                        lineT.name = emp.name;
                        lineT.lid = lid;
                        sys.draw.plan3DAdd(lineT);

                    }

                }
            }

        });
        return isHave;
    },
    clearHisTrack: function () {
        var delObj = [];
        $.each(plan3D.children, function (i, emp) {
            if (emp.objType == 'emp_his') {
                delObj.push(emp);
            }
        });
        if (delObj.length > 0) {
            $.each(delObj, function (i, obj) {
                $.each(obj.trackList, function (j, lid) {
                    var delObj = sys.newmap3D.GetTrackLineById(lid);
                    sys.draw.removePlan3D(delObj);
                });
                sys.draw.removePlan3D(obj);
            });
        };
    },

    clearRtEmpByDeptId: function () {
        var delObj = [];
        $.each(plan3D.children, function (i, emp) {
            if (emp.objType == 'emp') {
                if ($.inArray(emp.deptid, showDeptIds) == -1) {
                    delObj.push(emp);
                }

            }
        });
        if (delObj.length > 0) {
            $.each(delObj, function (i, obj) {
                $.each(obj.trackList, function (j, lid) {
                    var delObj = sys.newmap3D.GetTrackLineById(lid);
                    sys.draw.removePlan3D(delObj);
                });
                sys.draw.removePlan3D(obj);
            });
        };

    },

    changeEmpPosition: function (tagCode, ps) {
        // var isHave = false;
        //plan3D
        //$.each(obj3DEmp.children, function (i, emp) {
        $.each(plan3D.children, function (i, emp) {
            //          empIcon.objType = 'emp';    empIcon.drawcolor = Math.random() * 0xffffff; //随机色
            if (emp != undefined && emp.objType == 'emp') {
                if (emp.name == tagCode) {
                    // isHave = true;
                    //转换坐标               
                    var prePs = emp.PrePoint;
                    emp.position.set(ps.x, ps.y - 40, ps.z);
                    // console.log(tagCode + "号标签 坐标:" + ps.x + "," + ps.y + "," + ps.z );
                    if (emp.showTrack == true) {
                        //画线
                        //var lid = rtemp.position.Self + '&' + rtemp.PrePoint;
                        var lid = prePs.x + ',' + prePs.y + ',' + prePs.z + '&' + ps.x + ',' + ps.y + ',' + ps.z;
                        var isHH = sys.newmap3D.IsExistTrackLine(emp, lid);
                        if (isHH == false) {
                            var points = [];
                            points.push(prePs);
                            points.push(ps);
                            emp.PrePoint = ps;
                            emp.trackList.push(lid);
                            // var points = [rtemp.PrePoint, rtemp.position];
                            var lineT = sys.baseNew3D.createLine(points, emp.drawcolor);
                            lineT.objType = 'emp_trackline';
                            lineT.name = emp.name;
                            lineT.lid = lid
                            // emp.add(lineT);
                            // plan3D.add(lineT);
                            sys.draw.plan3DAdd(lineT);
                            //    sys.newmap3D.AddTrackLine(lineT);
                            //if (emp.trackList.length > 1000) {
                            if (emp.trackList.length > 500) {
                                //移除
                                var lid = emp.trackList.shift();
                                var delObj = sys.newmap3D.GetTrackLineById(lid);
                                sys.draw.removePlan3D(delObj);
                            }
                        }
                    } else {
                        emp.PrePoint = ps;
                        if (emp.trackList.length > 0) {
                            //移除轨迹线                         
                            $.each(emp.trackList, function (j, lid) {
                                var delObj = sys.newmap3D.GetTrackLineById(lid);
                                sys.draw.removePlan3D(delObj);
                            });
                        }
                    }
                }
            }

        });
        // return isHave;
    },
    changeEmpVilible: function (isTrue) {
        //$.each(plan3D.children, function (i, emp) {
        //    if (emp != undefined && emp.objType == 'emp') {
        //        emp.visible = isTrue;
        //    }
        //});
    },
    /////添加车辆图标
    //AddObj3DDev: function (obj) {
    //    obj3DDev.add(obj);
    //},
    RemoveObj3D: function (obj) {
        if (obj != null) {
            if (obj.length >= 1) {
                $.each(obj, function (i, pt) {
                    scene3D.remove(pt);
                });
            }
            else {
                scene3D.remove(obj);
            }
        }
    },


    //添加轨迹线
    //AddTrackLine:function(obj)
    //{
    //    trackLine.add(obj);
    //},

    /***************Objects集合体*管理*End*************************/
    Load3DMap: function () {
        localStorage.clear();
        mapNew3D.initMqttConfig();
        //加载配置文件
        sys.draw.initSysConfig();
        sys.draw.initRegWLConfig();
        sys.draw.initRegDMConfig();

        //sys.newmap3D.initFont();
        sys.newmap3D.initThree();
        sys.newmap3D.initScene();
        sys.newmap3D.initCamera();
        sys.newmap3D.initOrbit();
        //  this.initTrackballControls();
        sys.newmap3D.initLight();
        sys.baseNew3D.loadButs();
        ////加载配置文件
        //sys.draw.initSysConfig();
        //sys.draw.initRegWLConfig();
        //sys.draw.initRegDMConfig();

        //加载二级菜单条
        // sys.busi2D.loadToolbit();

        //加载实时快捷键
        //sys.baseNew3D.loadRtShortKey();
        sys.baseNew3D.loadRtOne();
        //sys.baseNew3D.empsearchShow1();
        // sys.baseNew3D.loadRtEmpList();//实时人员列表
        sys.baseNew3D.createDivList('rtemplist', 'rtemplist_ul', '实时人员');
        // sys.baseNew3D.loadRtRegList();//实时区域列表   //createDivListChk
        sys.baseNew3D.createDivListChk('rtreglist', 'rtreglist_ul', '电子围栏', 'chkrtregShow');

        //sys.baseNew3D.loadRtRollCallList(); //实时点名区域列表
        sys.baseNew3D.createDivListChk('rtrollcalllist', 'rtrollcalllist_ul', '电子点名', 'chkrtrcShow');
        //sys.baseNew3D.loadRtDevList();//实时车辆列表
        sys.baseNew3D.createDivList('rtdevlist', 'rtdevlist_ul', '实时车辆');
        //   sys.baseNew3D.loadStationlList(); //加载定位基站信息
        //rtStationlist
        sys.baseNew3D.createDivListChk('rtStationlist', 'rtStationlist_ul', '定位基站信息', 'chkStaShow');

        // sys.baseNew3D.loadRtVideoList() //实时摄像机列表     
        sys.baseNew3D.createDivList('rtvideolist', 'rtvideolist_ul', '实时监控');
        //  sys.baseNew3D.loadsecondmenu(); //加载二级菜单
        sys.baseNew3D.loadsecondmenu1();

        //  sys.baseNew3D.loadSearchMenu();//实时查询
        sys.baseNew3D.loadRtHisMenu();//历史轨迹查询

        sys.baseNew3D.FindAllDeptInfo();// 缓存部门信息到客户端
        mapNew3D.loadTagList(); // 缓存人员信息到客户端

        // sys.busi2D.loadBox();//一级菜单
        // sys.busi2D.loadAlarmRegionList();//电子围栏
        // sys.busi2D.loadRollCallRegList();//电子点名
        // sys.busi2D.loadSysConfigList();//系统设置

        //       sys.newmap3D.initFont();
        //sys.draw.initMap("3d");
        setTimeout(function () {
            sys.newmap3D.initFont();
            sys.draw.initMap("3d");
            //mapNew3D.loadStation();
            sys.baseNew3D.rtShowAlarmInvert();
            mapNew3D.initTree();
        }, 2000);
        window.onresize = sys.newmap3D.onWindowResize;
        window.addEventListener("mousedown", sys.newmap3D.mousedown);//页面绑定鼠标点击事件
        //  window.addEventListener("mouseup", mouseup);//页面绑定鼠标点击事件  
        window.addEventListener("mousemove", sys.newmap3D.onDocumentMouseMove);

        sys.newmap3D.animate();
        sys.baseNew3D.loadAlarmMes(); ///实时报警
        mapNew3D.rtLocTagShow();//实时刷新标签位置

        //setInterval(function () {
        //    sys.newmap3D.changePositionEmp();
        //}, 3000);

        sys.baseNew3D.DepartmentOfScreening();//部门筛选信息



    },

    initFont: function () {
        //声明一个保存需求修改的相关数据的对象
        gui = {
            //size: 2,
            //height: 0.4,
            size: 7,
            height: 1,
            weight: "normal",
            font: null,
            // bevelThickness: 2,
            // bevelSize: 0.5,
            // bevelEnabled: true,
            // bevelSegments: 3,
            // curveSegments: 12,
            // steps: 1,
            // fontName: "helvetiker",
            // fontWeight: "bold",
            // weight: "normal",
            // font: null,
            // style: "italics",
            changeFont: function () {
                //创建loader进行字体加载，供后面的模型使用
                var loader = new THREE.FontLoader();
                //fileParam
                //loader.load('./Scripts/json/FangSong_GB2312_Regular.json', function (response) {
                //    gui.font = response;
                //    gui.backOk();
                //});
                loader.load(fileParam.fontGB2312json_path, function (response) {
                    gui.font = response;
                    gui.backOk();
                });
            },
            backOk: function () {
                isBackOk = true;

                //加载模拟信息
                //加载实时人员信息
                sys.baseNew3D.loadRtEmp();
                sys.baseNew3D.loadRtDev();


                //接入实时数据
                sys.newmap3D.RtRefreshMes();
                mapNew3D.startReadMes();

                ///摄像机跟踪
                mapNew3D.trackvideosStartMqtt();

            },
            asGeom: function (msg, point, isload) {
                if (isBackOk == true) {
                    var meg = msg; //encodeURI(JSON.stringify(msg),"utf-8");//encodeURI(encodeURI(msg)); //new String(msg,"UTF-8");
                    if ($.trim(meg) == "")
                        return;

                    var isload = isload || true;
                    var ps = point;

                    // var color = 0xFF0033;  
                    var color = 0x0000FF;
                    // 重新创建模型
                    var options = {
                        size: gui.size,
                        height: gui.height,
                        //weight: gui.weight,
                        font: gui.font
                        // bevelThickness: gui.bevelThickness,
                        // bevelSize: gui.bevelSize,
                        // bevelSegments: gui.bevelSegments,
                        // bevelEnabled: gui.bevelEnabled,
                        // curveSegments: gui.curveSegments,
                        // steps: gui.steps
                    };
                    var textGeo = new THREE.TextGeometry(meg, options);
                    var material = new THREE.MultiMaterial([
                        new THREE.MeshPhongMaterial({ color: color, shading: THREE.FlatShading }), // front
                        new THREE.MeshPhongMaterial({ color: color, shading: THREE.SmoothShading }) // side
                    ]);
                    //新建mesh,加入
                    var textObj = new THREE.Mesh(textGeo, material);
                    // textObj.castShadow = true;

                    textObj.position.x = ps.X;
                    textObj.position.y = ps.Y;
                    textObj.position.z = ps.Z;

                    //textObj.position.x = -5;
                    //textObj.position.y = 33;
                    //textObj.position.z = 0;

                    return textObj;
                }
            }
        };
        gui.changeFont();
    },


    onDocumentMouseMove: function (event) {

        event.preventDefault();
        var mouseps = new THREE.Vector2();
        mouseps.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseps.y = -(event.clientY / window.innerHeight) * 2 + 1;

        rtMousePs = sys.newmap3D.getPoints(event);
        sys.newmap3D.showRtMousePoint(rtMousePs);

        sys.newmap3D.selectedEmpSta(mouseps);
        if (isSelectReg == false)
            sys.newmap3D.selectedObj(mouseps);




    },
    ///选中窗体中的元素
    selectedObj: function (moveps) {
        if (obj3DRegs != undefined) {
            raycaster.setFromCamera(moveps, camera3D);
            var intersects = raycaster.intersectObjects(obj3DRegs.children, true);
            sys.newmap3D.selObj(intersects);

        }
    },

    selObj: function (intersects) {
        if (intersects.length > 0) {
            var objSelectNew = intersects[0].object;
            if (objSelectNew !== objSelected) {

                if (objSelected !== undefined) {
                    objSelected.material.transparent = true;
                    objSelected.material.opacity = 0.5;
                }
                objSelectNew.material.transparent = true;
                if ((objSelectNew.objType === 'alarmRegion') || (objSelectNew.objType === 'rollcallRegion')) {
                    objSelectNew.material.opacity = 1;
                    //objSelected.material.emissive.setHex(0xff0000);
                }
             //   console.log("选中" + objSelectNew.objType + " " + objSelectNew.material.opacity);
                objSelected = objSelectNew;          
                sys.newmap3D.showTips();

            }
            document.getElementsByTagName("html").item(0).style.cursor = "pointer"
        } else {

            if (objSelected !== undefined) {
                objSelected.material.transparent = true;         
                if ((objSelected.objType === 'alarmRegion') || (objSelected.objType === 'rollcallRegion')) {
                    objSelected.material.opacity = 0.5;   
                }
                //if (objSelected.objType === 'alarmRegion') {          
                //    objSelected.material.emissive.setHex(sysConfig.regColor.normal);     
                //} else if (objSelected.objType === 'rollcallRegion') {
                //    objSelected.material.emissive.setHex(sysConfig.rcallColor.normal);                
                //} 
             //   console.log("移除" + objSelected.objType + " " + objSelected.material.opacity);
            }
            objSelected = undefined;
            document.getElementsByTagName("html").item(0).style.cursor = "default"
        }
    },

    ///实时刷新数据
    RtRefreshMes: function () {
        setInterval(function () {
            //刷新人员
            //  mapNew3D.rtEmpInfo();

        }, 1000);

        //刷新区域
        mapNew3D.rtAreaInfo();
    },

    ///获取平面上的点
    getPoints: function (event) {

        var point = null;
        event.preventDefault();
        // mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        var mouseps = new THREE.Vector2();
        mouseps.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseps.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouseps, camera3D);
        var intersects = raycaster.intersectObjects(mapLayer);
        if (intersects.length > 0) {
            point = intersects[0].point;
        }
        return point;
    },

    ///跟踪对象
    changeCamreLookat: function (emp) {
        if (emp != undefined) {
            camera3D.position.set(emp.position.x, emp.position.y, camera3D.position.z);
            controls.target = new THREE.Vector3(camera3D.position.x, camera3D.position.y, 0);
            controls.update();
            //camera3D.lookAt(camera3D.position.x, camera3D.position.y, camera3D.position.z);
        }
    },

    changePositionEmp: function () {
        // obj3DEmp
        //obj2DRegion.children
        if (obj3DEmp != undefined)
            $.each(obj3DEmp.children, function (i, emp) {
                var X = Math.floor(Math.random() * 100 + 1);
                var Y = Math.floor(Math.random() * 100 + 1);
                emp.position.set(X, Y, 0);
                if (objSelectTrack != undefined)
                    if (objSelectTrack == emp.name) {
                        sys.newmap3D.changeCamreLookat(emp);
                    }
            });
    },


    //rtPositionEmp: function (rtemp) {
    //    // obj3DEmp
    //    //obj2DRegion.children
    //    if (obj3DEmp != undefined)
    //        $.each(obj3DEmp.children, function (i, emp) {
    //            //var X = Math.floor(Math.random() * 100 + 1);
    //            //var Y = Math.floor(Math.random() * 100 + 1);
    //            if (emp.name == rtemp.tagCode) {
    //                //转换坐标
    //                var ps = StrToPoint3D(rtemp.position);
    //                emp.position.set(ps.X, ps.Y, ps.Z);
    //                if (objSelectTrack != undefined)
    //                    if (objSelectTrack == emp.name) {
    //                        //  sys.newmap3D.changeCamreLookat(emp);
    //                    }
    //            }
    //        });
    //},

    //点击方法
    mousedown: function (e) {
        //stopCount();
        //鼠标左击 0-左 2-右
        //if (objSelectTrack != undefined && isdraw == true) {
        if (objSelectTrack != undefined) {
            if (e.button == 0) {
                mouseKey = 1;
                console.log("点击左键 mouseKey=" + mouseKey);
            }

            isdb = !isdb;
            if (isdb) {
                isdb = true;
                //  stopCount();
                //双击不画圆
                mouseKey = -1;
                if (e.button == 0) {
                    //左键双击
                    objSelectTrack = undefined;
                }
                else if (e.button == 2) {
                    //右键双击
                }
                return;
            }
            tc = window.setTimeout(cc, 200)
            function cc() {
                // if(isdb!=false)return; 
                console.log("单击 mouseKey=" + mouseKey);
                isdb = true;
                if (e.button == 0) {
                    // draw(ps);
                }
            }

        }
        //else {
        //    if (e.button == 2)
        //        return;
        //}
    },


    clearAllRtEmp: function () {
        var delObj = [];
        $.each(plan3D.children, function (i, emp) {
            if (emp.objType == 'emp') {
                if ($.inArray(emp.name, showChkRtEmp) == -1) {
                    delObj.push(emp);
                }
            }
        });
        if (delObj.length > 0) {
            $.each(delObj, function (i, obj) {
                $.each(obj.trackList, function (j, lid) {
                    let deltra = sys.newmap3D.GetTrackLineById(lid);
                    sys.draw.removePlan3D(deltra);
                });
                sys.draw.removePlan3D(obj);
            });
        };
    },

    getEmpObj3D: function (rtemp) {
        var isHave;
        //plan3D
        //$.each(obj3DEmp.children, function (i, emp) {
        $.each(plan3D.children, function (i, emp) {
            //          empIcon.objType = 'emp';    empIcon.drawcolor = Math.random() * 0xffffff; //随机色
            if (emp.objType == 'emp') {
                if (emp.name == rtemp.tagCode) {
                    isHave = emp;

                }
            }
        });
        return isHave;
    },
    inock: function () {
        //var big=document.createElement("a");
        //var wa = document.getElementById("newmap3d");
        //wa.style.display = "none";

    },

    showRtMousePoint: function (ps) {
        if (ps !== null) {
            let rtPoint = sys.newmap3D.offsetPs(ps);
            //let rtPoint = { x: Number(ps.x).toFixed(2), y: Number(ps.y).toFixed(2), z: 0 };
            $("#mouseps").html(rtPoint.x + "，" + rtPoint.y);
        }
    },
    offsetPs: function (ps) {
        let rtPoint = { x: (Number(ps.x) - Number(tranX)).toFixed(2), y: (Number(ps.y) - Number(tranY)).toFixed(2), z: 0 };
        return rtPoint;
    },
    selectedEmpSta: function (moveps) {
        if (plan3D === undefined)
            return;
        raycaster.setFromCamera(moveps, camera3D);
        //plan3D
        let rtempstaobj = raycaster.intersectObjects(plan3D.children, true);
        sys.newmap3D.selObj(rtempstaobj);
    },
    showTips: function () {
        let regname = "";
        let strmsg = '<table  width="100% " id="able">'
        if (objSelected !== undefined) {
            if (objSelected.objType === 'alarmRegion')
                regname = "电子围栏 ";
            else if (objSelected.objType === 'rollcallRegion')
                regname = "电子点名 ";
            else if (objSelected.objType === 'sta')
                regname = "定位基站 ";
            else if (objSelected.objType === 'emp')
                regname = "人员 ";
            strmsg += '<tr ><td style="width:35%;text-align:right;">名称:</td><td style="width:70%;text-align:left;">' + objSelected.showname + '</td></tr>'

            //layer.open({
            //    type: 1,
            //    time:3000,
            //    shade: false,
            //    title: false, //不显示标题
            //    content: strmsg //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
            //    //cancel: function () {
            //    //    layer.msg('捕获就是从页面已经存在的元素上，包裹layer的结构', { time: 5000, icon: 6 });
            //    //}
            //});

            //layer.open({
            //    type: 1,
            //    time: 2000,
            //    skin: 'layui-layer-demo', //样式类名
            //    title:'提示111',
            //    closeBtn: 0, //不显示关闭按钮
            //    shade:false,
            //    content: strmsg
            //});

            //layer.open({
            //    id:'layertips',
            //    type: 2,
            //    time: 2000,
            //    offset: 't',
            //    title: '信息',
            //    closeBtn: 0, //不显示关闭按钮
            //    shadeClose: true,
            //    shade: false,
            //    area: ['380px', '200px'],
            //    content: 'attendRegEdit.html' //iframe的url
            //}); 

            strmsg += '</table>';
            layer.open({
                type: 1,
                time: 2000,
                area: ['200px', '90px'],
                offset: 't',
                title: regname + '信息',
                closeBtn: 0, //不显示关闭按钮
                shadeClose: true,
                shade: false,
                id: 'layertips', //设定一个id，防止重复弹出
                resize: false,
                moveType: 1, //拖拽模式，0或者1
                content: '<div style="padding: 10px; line-height: 22px; background-color: #0352a7;height:26px; color: #fff; font-weight: 300;">' + strmsg + '</div>'

            });



        }

    },
}

//$(function () {
//    var map = new sys.newmap3D();
//    map.Load3DMap();
//});





