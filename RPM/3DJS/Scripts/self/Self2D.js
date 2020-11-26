
var camera2D, scene2D, renderer, controls, trackControls, helper, container;

var group, raycaster, plan2D;
var pointsTemp = [], points = [], objects = [], geometrys = [];
var lineTemp = null, mouseKey = -1, mousedownPs = null, obj2DRegion = null, objSelected = undefined;
var isdrawCir = false, isdrawLine = false, isdrawRec = false, isdrawPolygon = false, isdraw = false, currentDrawing = 0;


sys.map2D = function () {
    var totalTime = 0;
    var tc, moveTime;
    var isdb = true; //是否双击
    var drawPS = [];
    var objTemp = null;
    this.initThree = function () {
        container = document.getElementById('map2d');
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        // renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);





        // renderer = new THREE.WebGLRenderer({ antialias: true });
        // renderer.setPixelRatio(window.devicePixelRatio);
        // renderer.setSize(window.innerWidth, window.innerHeight);
        // //renderer.autoClear = false; // To allow render overlay on top of sprited sphere
        // renderer.shadowMap.enabled = true;
        // document.body.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);
        // container.addEventListener('resize', onWindowResize, false);


    };
    this.initCamera = function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        camera2D = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 10000);
        //   camera.position.set(0, 200, 300);
        //    camera2D.position.set(0, 0, 1300);
        camera2D.position.set(0, 0, 200);
        camera2D.lookAt(new THREE.Vector3());
        // camera2D.position.x = 0;//相机的位置
        // camera2D.position.y = 0;
        // camera2D.position.z = 1000;

        // camera2D.lookAt({//相机看向哪个坐标
        //     x: 0,
        //     y: 0,
        //     z: 0
        // });

    };
    this.initLight = function () {
        AddScenne(new THREE.AmbientLight(0xf0f0f0));

        // scene2D.add(new THREE.AmbientLight(0xf0f0f0));
        // var light = new THREE.SpotLight(0xffffff, 1.5);
        // light.position.set(0, 0, 8000);
        // light.castShadow = true;
        // light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(70, 1, 200, 2000));
        // light.shadow.bias = -0.000222;
        // light.shadow.mapSize.width = 1024;
        // light.shadow.mapSize.height = 1024;
        // //  scene2D.add(light);
        // AddScenne(light);

    };
    this.initOrbit = function () {

        ///创建网格

        // var helper = new THREE.GridHelper(4000, 100, 0x0000ff, 0x808080);
        // //  helper.position.y = - 199;
        // helper.material.opacity = 0.1;
        // helper.material.transparent = true;

        //czlt-2018-02-08 注销
        //var helper = new THREE.GridHelper(1000, 50, 0x0000ff, 0x808080);
        // var helper = new THREE.GridHelper(800, 50, 0x0000ff, 0x808080);
        helper = new THREE.GridHelper(GridSize, GridStep, 0x0000ff, 0x808080);
        helper.position.y = -10;
        helper.material.transparent = true;
        helper.material.opacity = 0.25;
        //  helper.visible = false;

        var plane = new THREE.Object3D();
        plane.add(helper);
        plane.rotateX(Math.PI / 2); //沿X轴方向选中90° 
        // scene2D.add(plane);
        AddScenne(plane);

        controls = new THREE.OrbitControls(camera2D, renderer.domElement);
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
        controls.maxDistance = 2000;
        //是否可旋转
        controls.enablePan = false;



    };
    this.initScene = function () {
        scene2D = new THREE.Scene();
        scene2D.background = new THREE.Color(0xf0f0f0);

        ///2D绘制面板
        //// var geometry = new THREE.PlaneBufferGeometry(4000, 4000);
        //  var sphere = sys.draw.createMesh(new THREE.PlaneBufferGeometry(2255, 1597), fileMPath);
        var geometry = new THREE.PlaneBufferGeometry(sysConfig.mapWidth, sysConfig.mapHeight);
        plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        ///选中物体的面
        objects.push(plane);
        // scene2D.add(plane);
        AddScenne(plane);

        raycaster = new THREE.Raycaster();

        group = new THREE.Group();
        AddScenne(group);

        obj2DRegion = new THREE.Object3D();
        AddScenne(obj2DRegion);

    };
    //this.initTrackballControls = function () {
    //    trackControls = new THREE.TrackballControls(camera2D);
    //    trackControls.rotateSpeed = 1.0;
    //    trackControls.zoomSpeed = 1.2;
    //    trackControls.panSpeed = 0.8;
    //    trackControls.noZoom = false;
    //    trackControls.noPan = false;
    //    trackControls.staticMoving = false;
    //    trackControls.dynamicDampingFactor = 0.3;
    //    var dragControls = new THREE.DragControls(obj2DRegion, camera2D, renderer.domElement);
    //    dragControls.addEventListener('dragstart', function (event) {
    //        objSelected = event.object;
    //        trackControls.enabled = false;
    //    });
    //    dragControls.addEventListener('dragend', function (event) {
    //        objSelected = null;
    //        trackControls.enabled = true;
    //    });
    //};

    function onWindowResize() {
        camera2D.aspect = window.innerWidth / window.innerHeight;
        camera2D.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    function render() {
        renderer.render(scene2D, camera2D);
    };
    function animate() {
        //更新控制器
        controls.update();
        // trackControls.update();
        // group.traverse( function ( child ) {
        //     if ( 'phase' in child.userData ) {
        //         child.position.y = child.userData.phase;
        //     }
        // } );
        // selectedObj();
        ///是否显示网格
        if (sysConfig.isShowGrid == 0) {
            helper.visible = false;
        } else {
            helper.visible = true;
        }
        render();
        requestAnimationFrame(animate);
    };


    this.LoadMap = function () {
        localStorage.clear();
        //加载配置文件
        sys.draw.initSysConfig();

        initFont();
        this.initThree();
        this.initScene();
        this.initCamera();
        this.initOrbit();
        //  this.initTrackballControls();
        this.initLight();


        sys.draw.initRegWLConfig();
        sys.draw.initRegDMConfig();


        //加载二级菜单条
        sys.busi2D.loadToolbit();

        sys.busi2D.loadBox();//一级菜单
        sys.busi2D.loadAlarmRegionList();//电子围栏
        sys.busi2D.loadRollCallRegList();//电子点名
        sys.busi2D.loadSysConfigList();//系统设置

        setTimeout(function () {
            sys.draw.initMap("2d");
            //sys.draw.testLoadShape();
            //loadObj();
            map2DFun.loadUpMap();
        }, 2000);
        window.onresize = onWindowResize;
        //window.addEventListener("mousedown", mousedown);//页面绑定鼠标点击事件
        //window.addEventListener("mouseup", mouseup);//页面绑定鼠标点击事件
        //window.addEventListener("mousemove", onDocumentMouseMove);


        // container.onresize = onWindowResize;
        container.addEventListener("mousedown", mousedown);//页面绑定鼠标点击事件
        container.addEventListener("mouseup", mouseup);//页面绑定鼠标点击事件
        container.addEventListener("mousemove", onDocumentMouseMove);
        animate();


    };

    function onDocumentMouseMove(event) {
        if (isdraw) {
            console.log("move:mouseKey=" + mouseKey);
            if (mouseKey == 1 || mouseKey == 2) {
                if (isdrawCir == true || isdrawRec == true) {
                    var moveps = getPoints(event);
                    if (moveps == null)
                        return;
                    //  var dis = Math.abs((Math.sqrt((mousedownPs.x - moveps.x) * (mousedownPs.x - moveps.x) + (mousedownPs.y - moveps.y) * (mousedownPs.y - moveps.y))));
                    // if (dis > 50) {
                    mouseKey = 2;
                    sys.busi2D.RemoveObj(lineTemp);
                    //lineTemp = sys.draw.draw2DRect(mousedownPs, moveps);
                    if (isdrawCir == true) {
                        lineTemp = sys.draw.draw2DCIRCLE(mousedownPs, moveps, '#990099', false);
                    } else if (isdrawRec == true) {
                        lineTemp = sys.draw.draw2DRect(mousedownPs, moveps);
                    }
                    AddScenne(lineTemp);
                    // }
                }
            } else {
                //event.preventDefault();
                //var mouseps = new THREE.Vector2();
                //mouseps.x = (event.clientX / window.innerWidth) * 2 - 1;
                //mouseps.y = - (event.clientY / window.innerHeight) * 2 + 1;
                //selectedObj(mouseps);
            }
        }

        event.preventDefault();
        var mouseps = new THREE.Vector2();
        mouseps.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseps.y = -(event.clientY / window.innerHeight) * 2 + 1;
        selectedObj(mouseps);

    };

    //点击方法
    function mousedown(e) {

        //stopCount();
        //鼠标左击 0-左 2-右
        if (isdraw) {
            if (e.button == 0) {
                mouseKey = 1;
                console.log("点击左键 mouseKey=" + mouseKey);
            }

            //取点击屏幕的点
            var ps = getPoints(e);
            if (ps == null)
                return;

            mousedownPs = ps;

            if (isdrawLine == true || isdrawPolygon == true) {
                isdb = !isdb;
                if (isdb) {
                    isdb = true;
                    stopCount();
                    //双击不画圆
                    mouseKey = -1;
                    if (e.button == 0) {
                        var color = '#00CC00';
                        if (regionDraw == 'alarmRegion') {
                            color = sysConfig.regColor.normal;
                        } else if (regionDraw == 'rollcallRegion') {
                            color = sysConfig.rcallColor.normal;
                        }
                        //var color = '#00CC00';
                        var drawT = new DrawParam();
                        drawT.busType = regionDraw;
                        var shape = null;

                        // alert("左键双击！");
                        //左键双击绘制出多边形
                        if (isdrawPolygon) {
                            // var ps = getPoints(e);
                            points.push(ps);
                            ///画多边型
                            drawT.id = getId(points);
                            drawT.drawType = DRAW_TYPE.POLYGON;
                            drawT.pointList = points;
                            drawT.color = color;
                            shape = sys.draw.draw2DPOLYGON(points, color);
                            shape.name = drawT.id;
                            points = [];



                            sys.busi2D.RemoveObj(pointsTemp);
                            sys.busi2D.RemoveObj(lineTemp);
                            // AddScenne(shape);
                            AddObj2DRegion(shape);
                            sys.busi2D.addDrawRegion(drawT, shape);

                            points = [];

                        }
                        else if (isdrawLine) {
                            // alert("右键双击！");
                            //右键双击绘制线段结束   
                            //   var drawT = new DrawParam();
                            //  color = 0x0000ff;
                            points.push(ps);
                            drawT.id = getId(points);
                            drawT.drawType = DRAW_TYPE.LINE;
                            drawT.pointList = points;
                            drawT.color = color;

                            shape = createLine();
                            shape.name = drawT.id;
                            AddObj2DRegion(shape);
                            sys.busi2D.RemoveObj(pointsTemp);

                            sys.busi2D.addDrawRegion(drawT, shape);
                            points = [];
                            lineTemp = null;
                        }
                    }
                    else if (e.button == 2) {
                    }
                    return;
                }
                tc = window.setTimeout(cc, 200)
                function cc() {
                    // if(isdb!=false)return; 
                    console.log("单击 mouseKey=" + mouseKey);
                    isdb = true;
                    if (e.button == 0) {
                        draw(ps);
                    }
                }
            }
        } else {
            if (e.button == 2)
                return;
        }
    };


    ///鼠标按下后抬起事件
    function mouseup(e) {
        if (isdraw) {
            var ps = getPoints(e);
            if (ps == null)
                return;

            if (isdrawCir == true || isdrawRec == true) {
                if ((mousedownPs.x == ps.x) && (mousedownPs.y == ps.y)) {
                    mouseKey = -1;
                }

                if (mouseKey == 2) {
                    mouseKey = -1;
                    var drawT = new DrawParam();
                    drawT.busType = regionDraw;
                    points.push(mousedownPs);
                    points.push(ps);
                    drawT.id = getId(points);
                    drawT.drawType = DRAW_TYPE.RECTANGLE;
                    if (isdrawCir == true) {
                        drawT.drawType = DRAW_TYPE.CIRCLE;
                    }
                    drawT.pointList = points;

                    sys.busi2D.RemoveObj(lineTemp);
                    var color = '#9933CC';
                    if (regionDraw == 'alarmRegion') {
                        color = sysConfig.regColor.normal;
                    } else if (regionDraw == 'rollcallRegion') {
                        color = sysConfig.rcallColor.normal;
                    }
                    var rect = sys.draw.draw2DRect(mousedownPs, ps, color, true);
                    if (isdrawCir == true) {
                        //  color = '#0000ff';
                        rect = sys.draw.draw2DCIRCLE(mousedownPs, ps, color, true);
                    }
                    rect.name = drawT.id;
                    drawT.color = color;


                    AddObj2DRegion(rect);
                    sys.busi2D.RemoveObj(pointsTemp);
                    sys.busi2D.addDrawRegion(drawT,rect);

                    points = [];
                }
                console.log("左键抬起:mouseKey=" + mouseKey);
                mouseKey = -1;
            }
        }
    };


    function draw(point) {
        // point.x = point.x - 0.3;
        // point.y = point.y + 0.3;
        //画点
        var ps = initCylinder(point);

        AddScenne(ps);
        points.push(point);
        //画线
        if (points.length > 1) {
            createLine();
        }

    };
    function createLine(color) {

        var color = color || 0x0000ff;
        var lineNew = sys.draw.drawObj2DLineString(points, color);
        AddScenne(lineNew);
        sys.busi2D.RemoveObj(lineTemp);
        lineTemp = lineNew;
        return lineTemp;

    }
    ///球体
    function initSphereGeometry(point) {
        var geometry = new THREE.SphereGeometry(0.6, 20, 20);
        //随机颜色
        //var material = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff } );
        var material = new THREE.MeshPhongMaterial({ color: 0x33FF00 });
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = point.x
        sphere.position.y = point.y
        //  sphere.position.z =point.z
        //sphere.position.normalize();
        // sphere.position.multiplyScalar( Math.random() * 2 + 1 );
        sphere.castShadow = true;
        sphere.receiveShadow = true;

        group.add(sphere);

        // AddScenne(sphere);

    };

    ///添加平面圆形（圆点）
    function initCylinder(point) {
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
    }
    //小方框
    function initObject(point) {
        // <span style="white-space:pre"/>     
        // 创建粒子geometry   

        var geom = new THREE.Geometry();
        var material = new THREE.ParticleBasicMaterial({
            color: 0x00FFFF,
            size: 1
        });
        // 创建单个粒子   

        var color1 = new THREE.Color(0x0000ff);
        var p1 = new THREE.Vector3(point.x, point.y, 0);
        // 将粒子加入粒子geometry   
        geom.vertices.push(p1);
        geom.colors.push(color1);
        // 创建粒子系统   
        return new THREE.ParticleSystem(geom, material);


    };


    ///2D区域缓存空间
    function AddObj2DRegion(obj) {
        obj2DRegion.add(obj);
        render();

    };
    function AddScenne(obj) {
        // 将粒子系统加入场景   
        scene2D.add(obj);
    };

    var mouse = new THREE.Vector2();//创建二维平面
    ///获取界面上的点，
    function getPoints(event) {

        //eg1. //在3D平面中适用
        //var mv = new THREE.Vector3(
        //    (event.clientX / window.innerWidth) * 2 - 1,
        //    -(event.clientY / window.innerHeight) * 2 + 1,
        //    0.5);
        //console.log("获取屏幕坐标直接获取 mv x:" + mv.x + " y:" + mv.y + " z:" + mv.z);
        //mv.unproject(this.camera2D);//将一个向量转成threejs坐标
        //console.log("获取屏幕坐标转换后 mv x:" + mv.x + " y:" + mv.y + " z:" + mv.z);
        //// (x,y,z) ---转成WebGL 坐标系 (x,z,(0-y))
        //mv.y = 10;
        //return mv;

        //eg2.坐标对应不上坐标区域
        // var point = null;
        //event.preventDefault();
        //mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
        //console.log("获取屏幕坐标直接获取 mouse x:" + mouse.x + " y:" + mouse.y);
        //raycaster.setFromCamera(mouse, camera2D);    
        //var intersects = raycaster.intersectObjects(objects);
        //if (intersects.length > 0) {
        //    //var intersect = intersects[0].point;
        //    point = intersects[0].point;
        //    console.log("获取屏幕坐标直接获取 point x:" + point.x + " y:" + point.y);
        //    point.x = point.x - 0.3;
        //    point.y = point.y + 0.3; 
        //}
        //return point;

        //eg3.
        var point = null;
        event.preventDefault();
        var mx = (event.clientX / window.innerWidth) * 2 - 1;
        var my = -(event.clientY / window.innerHeight) * 2 + 1;
   //     console.log("获取屏幕坐标直接获取 mx:" + mx + " my:" + my);

        //var planX = ((event.clientX - plan2D.getBoundingClientRect().left) / plan2D.offsetWidth) * 2 - 1;
        //var planY = ((event.clientX - plan2D.getBoundingClientRect().top) / plan2D.offsetHeight) * 2 - 1;
        //console.log("获取屏幕坐标直接获取 planX:" + planX + " planY:" + planY);

        // mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
        mouse.x = ((event.clientX - container.getBoundingClientRect().left) / container.offsetWidth) * 2 - 1;
        mouse.y = -((event.clientY - container.getBoundingClientRect().top) / container.offsetHeight) * 2 + 1;
      //  console.log("获取屏幕坐标直接获取 mouse x:" + mouse.x + " y:" + mouse.y);
        raycaster.setFromCamera(mouse, camera2D);
        var intersects = raycaster.intersectObjects(objects);
        if (intersects.length > 0) {
            ////var intersect = intersects[0].point;
            point = intersects[0].point;
         //   console.log("获取屏幕坐标直接获取 point x:" + point.x + " y:" + point.y);
            //point.x = point.x - 0.3;
            //point.y = point.y + 0.3; 
        }
        return point;

    };

    function getV3D(points) {
        var ms = new THREE.Vector3();//创建二维平面
        if (Number(points.x) > 0) {
            ms.x = Math.abs(points.z);
        } else {
            ms.x = -Math.abs(points.z);
        }
        ms.y = points.y;
        if (Number(points.z) > 0) {
            ms.z = Math.abs(points.x);
        } else {
            ms.z = -Math.abs(points.x);
        }
        return ms;
    };
    function drawPoint(ps) {
        var objPoint = sys.draw.createGeoPoint(ps);
        //  scene2D.add(objPoint);
        AddScenne(objPoint);
    }
    function drawLine() {
        if (objTemp != null)
            scene2D.remove(objTemp);
        var color = 0X00FF00;
        objTemp = sys.draw.drawObjLineString(drawPS, color);
        // scene2D.add(objTemp);
        AddScenne(objTemp);
    }
    //开始计时器
    function startMoveT() {

        totalTime = totalTime + 1;
        //  tc = setTimeout("startCount()", 2)
        moveTime = setTimeout(function () {
            startMoveT();
        }, 2);
    };
    function stopMoveT() {
        clearTimeout(moveTime);
    };
    function stopCount() {

        clearTimeout(tc)

    };
    function initFont() {
        //声明一个保存需求修改的相关数据的对象
        gui = {
            size: 2,
            height: 0.2,
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
            },
            asGeom: function (msg, point, isload) {

                var meg = msg; //encodeURI(JSON.stringify(msg),"utf-8");//encodeURI(encodeURI(msg)); //new String(msg,"UTF-8");
                if ($.trim(meg) == "")
                    return;

                var isload = isload || true;
                var ps = point;
                if (isload == true)
                    ps = new Point3D_DiffY(point, 50);
                var color = 0xFF0033;
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
                textObj.position.x = ps.X;
                textObj.position.y = ps.Y;
                textObj.position.z = ps.Z;
                textGroup.add(textObj);
            }
        };
        gui.changeFont();
    };
    function showMap2D() {
        if (lineGroup.children.length > 0) {
            // lineGroup.rotateX(- Math.PI / 2); //沿X轴方向选中90° 

            // scene2D.add(lineGroup);
            AddScenne(lineGroup);
        }
        if (textGroup.children.length > 0) {
            // textGroup.rotateX(- Math.PI / 2);
            // scene2D.add(textGroup);
            AddScenne(textGroup);
        }
    };
    function selectedObj(moveps) {
        raycaster.setFromCamera(moveps, camera2D);
        var intersects = raycaster.intersectObjects(obj2DRegion.children, true);
        if (intersects.length > 0) {
            // if ( objSelected !== undefined ) {
            //     objSelected.material.opacity = 1;
            // }
            var objSelectNew = intersects[0].object;
            //  objSelected.material.opacity = 1;
            // objSelected.material.color = 0x33CCFF;

            if (objSelectNew !== objSelected) {

                if (objSelected !== undefined) {
                    objSelected.material.transparent = true;
                    objSelected.material.opacity = 0.5;
                }
                objSelectNew.material.transparent = true;
                objSelectNew.material.opacity = 1;
                objSelected = objSelectNew;

            }

            document.getElementsByTagName("html").item(0).style.cursor = "pointer"


        } else {

            // if (objSelected !== undefined) {   
            //     if(objSelectOld===objSelected)  {

            //     }   else{   
            //     objSelected.material.transparent = true;
            //     objSelected.material.opacity = 0.8;
            //     }
            // }

            // objSelected = undefined;
            document.getElementsByTagName("html").item(0).style.cursor = "default"



        }

    };


}
$(function () {
    var map = new sys.map2D();
    map.LoadMap();
});
