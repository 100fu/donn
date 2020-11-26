var renderer;
/**全局镜头 */
var camera;
/**全局场景对象 */
var scene;
/**全局光照对象 */
var light, helper = undefined;
var container;
var controls;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var mapLayer = [], Obj3DList = undefined;
var margin = 0.05, gravityConstant = -9.8, physicsWorld, textureLoader;
//设置楼层地基的初始化高度，
var floorHeightbs = -150;
var floorPic = fileParam.img_path + '/caodi-2.jpg';
var objMtl;

var isFirstPeson = false;
var clock = new THREE.Clock();
//  <script src="./Scripts/base/libs/ammo.js"></script>
sys.MapData = {

    /*********************2D场景初始化方法*Start********************************/
    /**********渲染场景************/
    initThree: function (divid) {
        //newmap3d
        container = document.getElementById(divid);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);
        window.addEventListener('resize', sys.MapData.onWindowResize, false);
    },

    /**********初始化摄像机************/
    initCamera: function () {

        //camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 4000);
        //camera.position.set(0, 150, 1300);

        let width = window.innerWidth;
        let height = window.innerHeight;
        camera = new THREE.PerspectiveCamera(90, width / height, 1, 10000);
       // alert(sysConfig.mapWidth);
        camera.position.set(0, 0, (width*0.5));
        camera.lookAt(new THREE.Vector3());


    },

    /************初始化场景************************/
    initScene: function () {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        //  scene.fog = new THREE.Fog(0xf0f0f0,1000,4000);




        ///存区域的集合对象
        Obj3DList = new THREE.Object3D();
        Obj3DList.name = 'Obj3DList';  //objType
        Obj3DList.objType = 'Obj3DList';
        sys.MapData.AddScene(Obj3DList);

    },
    /**********渲染环境光************/
    initLight: function () {
        //0xaabbff
        //  light = new THREE.DirectionalLight(0xaabbff, 0.3);

        // light = new THREE.AmbientLight(0xaabbff);
        light = new THREE.AmbientLight(0xf0f0f0);

        sys.MapData.AddScene(light);
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
        sys.MapData.AddScene(plane);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
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
        controls.maxDistance = 40000;
        //是否可旋转
        controls.enablePan = false;
    },

    render: function () {

        if (isFirstPeson) {
            controls.update(clock.getDelta());
        }

        renderer.render(scene, camera);

    },



    /*******************2D场景初始化方法*End*************************************/

    /*********************3D场景初始化方法*Start********************************/
    initThree3D: function () {
        container = document.getElementById('newmap3d');
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);
    },
    initScene3D: function () {
        scene = new THREE.Scene();
        // scene.background = new THREE.Color(0xf0f0f0);
        scene.background = new THREE.Color(0xbfd1e5);
        scene.fog = new THREE.Fog(0xf0f0f0, 1000, 4000);

        planeGeometry = new THREE.PlaneGeometry(GridSize, GridSize);
        planeGeometry.rotateX(- Math.PI / 2);
        var planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        sys.MapData.AddScene(plane);

        Obj3DList = new THREE.Object3D();
        Obj3DList.rotateX(- Math.PI / 2);
        Obj3DList.name = 'Obj3DList';
        Obj3DList.objType = 'Obj3DList';
        sys.MapData.AddScene(Obj3DList);

    },
    initCamera3D: function () {
        //camera = new THREE.PerspectiveCamera(100, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);   
        //camera.position.set(0, 300, 1000);
        //  camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 4000);
        // camera.position.set(0, 150, 1300);
        camera = new THREE.PerspectiveCamera(38, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 6000);
        camera.position.set(0, 150, 1300);
        // camera.position.set(0, 780, 1000);
        // camera.position.set(0, 120, 2200);
        // camera.position.set(-17.2, 26.6, 2121.7);
        // camera.lookAt(scene.position);
        sys.MapData.AddScene(camera);

    },
    initOrbit3D: function () {

        // ///创建网格     
        // helper = new THREE.GridHelper(GridSize, GridStep, 0x0000ff, 0x808080);
        // //helper.position.y = -10;
        // helper.position.y = -199;
        // helper.material.transparent = true;
        // helper.material.opacity = 0.25;
        // //   scene.add(helper);
        // sys.MapData.AddScene(helper);

        isFirstPeson = false;
        //controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls = new THREE.OrbitControls(camera);

        controls.maxPolarAngle = 1.0 * Math.PI / 2;
        // 使动画循环使用时阻尼或自转 意思是否有惯性
        controls.enableDamping = true;
        // controls.damping = 0.2;
        //动态阻尼系数 就是鼠标拖拽旋转灵敏度
        controls.dampingFactor = 0.25;
        //是否可以缩放
        controls.enableZoom = true;
        //是否自动旋转
        controls.autoRotate = false;
        //设置相机距离原点的最远距离
        controls.minDistance = -20;
        //设置相机距离原点的最远距离
        controls.maxDistance = 2100;
        //是否可旋转
        controls.enablePan = true;
        //是否开启右键拖拽
        controls.enableRotate = true;
        //controls.position0.x = 0;
        //controls.position0.y = 120;
        //controls.position0.z = 2200;

        //controls.target.x = -17.2;
        //controls.target.y = -301.9;
        //controls.target.z = 47.6;

        //controls.object.position.x = -17.2;
        //controls.object.position.y = 26.6;
        //controls.object.position.z = 2121.7;
    },

    initFirstOrbit3D: function () {


        controls = new THREE.FirstPersonControls(camera);
        controls.movementSpeed = 80;//前后左右平移速度
        controls.lookSpeed = 0.1;//视角变化速度
        controls.lookVertical = true;
        controls.constrainVertical = true;
        controls.verticalMin = 1.1;
        controls.verticalMax = 2.2;


        controls.maxPolarAngle = 1.0 * Math.PI / 2;
        isFirstPeson = true;




        //// 使动画循环使用时阻尼或自转 意思是否有惯性
        //controls.enableDamping = true;
        //// controls.damping = 0.2;
        ////动态阻尼系数 就是鼠标拖拽旋转灵敏度
        //controls.dampingFactor = 0.25;
        ////是否可以缩放
        //controls.enableZoom = true;
        ////是否自动旋转
        //controls.autoRotate = false;
        ////设置相机距离原点的最远距离
        //controls.minDistance = -20;
        ////设置相机距离原点的最远距离
        //controls.maxDistance = 2100;
        ////是否可旋转
        //controls.enablePan = true;
        ////是否开启右键拖拽
        //controls.enableRotate = true;

    },
    initThreeOrbit3D: function () {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
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
        controls.maxDistance = 500;
        //是否可旋转
        controls.enablePan = false;
    },

    initGridHelper3D: function () {

        ///创建网格     
        helper = new THREE.GridHelper(GridSize, GridStep, 0x0000ff, 0x808080);
        //helper.position.y = -10;
        helper.position.y = -199;
        helper.material.transparent = true;
        helper.material.opacity = 0.25;
        //   scene.add(helper);
        sys.MapData.AddScene(helper);
    },
    initLight3D: function () {

        var ambientLight = new THREE.AmbientLight(0x404040);
        sys.MapData.AddScene(ambientLight);

        light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(-7, 10, 15);
        light.castShadow = true;
        var d = 10;
        light.shadow.camera.left = -d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = -d;

        light.shadow.camera.near = 2;
        light.shadow.camera.far = 50;

        light.shadow.mapSize.x = 2024;
        light.shadow.mapSize.y = 2024;

        light.shadow.bias = -0.003;
        sys.MapData.AddScene(light);


        //var ambientLight = new THREE.AmbientLight(0x222222);
        //sys.MapData.AddScene(ambientLight);


        //var light = new THREE.DirectionalLight(0xffffff, 2.25);
        //light.position.set(200, 450, 500);
        //light.castShadow = true;
        //light.shadow.mapSize.width = 1024;
        //light.shadow.mapSize.height = 512;

        //light.shadow.camera.near = 100;
        //light.shadow.camera.far = 1200;

        //light.shadow.camera.left = -1000;
        //light.shadow.camera.right = 1000;
        //light.shadow.camera.top = 350;
        //light.shadow.camera.bottom = -350;

        //sys.MapData.AddScene(light);

    },
    initFootstone: function () {
        var pos = new THREE.Vector3();
        var quat = new THREE.Quaternion();

        // Ground
        //pos.set(0, - 0.5, 0);
        // pos.set(0, - 500, 0);
        pos.set(0, floorHeightbs, 0);


        quat.set(0, 0, 0, 1);
        //sysConfig.mapWidth, sysConfig.mapHeight
        //  var ground = sys.MapData.createParalellepiped(1000, 10, 1000, 0, pos, quat, new THREE.MeshPhongMaterial({ color:0xaabbff }));
        var ground = sys.MapData.createParalellepiped(sysConfig.mapWidth + 500, -10, sysConfig.mapHeight + 500, 0, pos, quat, new THREE.MeshPhongMaterial());
        ground.castShadow = true;

        ground.receiveShadow = true;
        var floor = textureLoader.load(floorPic, function (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(40, 40);
            ground.material.map = texture;
            ground.material.needsUpdate = true;
        });


    },
    createParalellepiped: function (sx, sy, sz, mass, pos, quat, material) {

        var threeObject = new THREE.Mesh(new THREE.BoxBufferGeometry(sx, sy, sz, 1, 1, 1), material);
        var shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
        shape.setMargin(margin);

        sys.MapData.createRigidBody(threeObject, shape, mass, pos, quat);

        return threeObject;

    },

    createRigidBody: function (threeObject, physicsShape, mass, pos, quat) {

        threeObject.position.copy(pos);
        threeObject.quaternion.copy(quat);

        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        var motionState = new Ammo.btDefaultMotionState(transform);

        var localInertia = new Ammo.btVector3(0, 0, 0);
        physicsShape.calculateLocalInertia(mass, localInertia);

        var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
        var body = new Ammo.btRigidBody(rbInfo);

        threeObject.userData.physicsBody = body;

        // scene.add(threeObject);
        sys.MapData.AddScene(threeObject);

        if (mass > 0) {
            rigidBodies.push(threeObject);
            // Disable deactivation
            body.setActivationState(4);
        }

        physicsWorld.addRigidBody(body);

    },

    initPhysics: function () {

        // Physics configuration
        textureLoader = new THREE.TextureLoader();
        var collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
        var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
        var broadphase = new Ammo.btDbvtBroadphase();
        var solver = new Ammo.btSequentialImpulseConstraintSolver();
        var softBodySolver = new Ammo.btDefaultSoftBodySolver();
        physicsWorld = new Ammo.btSoftRigidDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration, softBodySolver);
        physicsWorld.setGravity(new Ammo.btVector3(0, gravityConstant, 0));
        physicsWorld.getWorldInfo().set_m_gravity(new Ammo.btVector3(0, gravityConstant, 0));

        sys.MapData.initFootstone();

    },
    ///天空盒
    initSky: function () {
        var vertexShader = document.getElementById('vertexShader').textContent;
        var fragmentShader = document.getElementById('fragmentShader').textContent;
        var uniforms = {
            topColor: { type: "c", value: new THREE.Color(0x0077ff) },
            bottomColor: { type: "c", value: new THREE.Color(0xffffff) },
            offset: { type: "f", value: 400 },
            exponent: { type: "f", value: 0.6 }
        };
        uniforms.topColor.value.copy(light.color);

        var skyGeo = new THREE.SphereBufferGeometry(4000, 32, 15);
        var skyMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide
        });

        var sky = new THREE.Mesh(skyGeo, skyMat);

        sys.MapData.AddScene(sky);

    },


    /*********************3D场景初始化方法*End********************************/
    animate: function () {
        ///是否显示网格
        if (helper != undefined) {
            helper.visible = false;
            //if (sysConfig.isShowGrid == 0) {
            //    helper.visible = false;
            //} else {
            //    helper.visible = true;
            //}
        }
        sys.MapData.render();
        requestAnimationFrame(sys.MapData.animate);
    },
    ///加载字体
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

            },
            asGeom: function (msg, point, isload, color) {
                if (isBackOk === true) {
                    var meg = msg; //encodeURI(JSON.stringify(msg),"utf-8");//encodeURI(encodeURI(msg)); //new String(msg,"UTF-8");
                    if ($.trim(meg) ==="")
                        return;

                    var isload = isload || true;
                    var ps = point;

                    // var color = 0xFF0033;  
                    var color = color || 0x0000FF;
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

    initObjMtl: function () {
        THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
        objMtl = {
            objmesh: undefined,
            loadObjMtl: function (objName, ps, showName, planMap3D) {
                ////fileParam.objmtlPath
                //new THREE.MTLLoader()
                //    .setPath(fileParam.objmtlPath)
                //    .load(objName + '.mtl', function (mtls) {
                //        mtls.preload();
                //        new THREE.OBJLoader()
                //            .setMaterials(mtls)
                //            .load(objName + '.obj', function (objs) {
                //                objMtl.objmesh = objs;
                //            }, gui.onProgress, gui.onError);
                //    });
                new THREE.MTLLoader()
                    .setPath(fileParam.objmtlPath)
                    .load(objName + '.mtl', function (materials) {
                        materials.preload();
                        new THREE.OBJLoader()
                            .setMaterials(materials)
                            .setPath(fileParam.objmtlPath)
                            .load(objName + '.obj', function (object) {

                                object.rotateX(Math.PI / 2);
                                //  objMtl.objmesh = object;                              
                                object.objType = 'objmtl';
                                object.showName = showName;
                                object.position.x = ps.x;
                                object.position.y = ps.y;
                                object.position.z = ps.z;

                                object.scale.x = 0.06;
                                object.scale.y = 0.06;
                                object.scale.z = 0.06;

                                //let txt = sys.MapData.createTextObjMtl(showName);
                                //object.add(txt);
                                planMap3D.add(object);

                            }, gui.onProgress, gui.onError);

                    });
            },
            onProgress: function (xhr) {
                if (xhr.lengthComputable) {
                    let percent = xhr.loaded / xhr.total * 100;
                    console.log(Math.round(percent, 2) + ' % downloaded');
                }
            },
            onError: function (xhr) {
                console.log('initObjMtl  加载异常');
            },
        };
    },

    //自适应窗口大小
    onWindowResize: function () {
        //camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        //camera.updateProjectionMatrix();
        //renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight); 
        if (isFirstPeson) {
            controls.handleResize();
        }
    },
    ///跟踪对象
    changeCamreLookat: function (obj) {
        if (obj !== undefined) {
            camera.position.set(obj.position.x, obj.position.y, camera.position.z);
            controls.target = new THREE.Vector3(camera.position.x, camera.position.y, 0);
            controls.update();
            //camera3D.lookAt(camera3D.position.x, camera3D.position.y, camera3D.position.z);
        }
    },

    AddScene: function (obj) {
        if (scene !== undefined)
            scene.add(obj);
    },

    RemoveScene: function (obj) {
        scene.remove(obj);
    },
    RemoveObj: function (obj) {
        if (obj !== undefined && obj !== null) {
            if (obj.length >= 1) {
                $.each(obj, function (i, pt) {
                    scene.remove(pt);
                });
            }
            else {
                scene.remove(obj);
            }
        }
    },
    AddObj3DList: function (obj) {
        if (Obj3DList !== undefined) {
            Obj3DList.add(obj);
        }
    },
    RemoveObj3DList: function (obj) {
        Obj3DList.remove(obj);
    },



    IsExistEmpObj3D: function (objlist, rtemp) {
        var isHave = false;
        objlist.children.forEach(emp => {
            if (emp.objType === 'emp') {
                if (emp.name === rtemp.tagCode) {
                    isHave = true;
                }
            }
        });
        return isHave;
    },

    IsExistObj: function (objlist, objId) {
        var isHave = false;
        objlist.children.forEach(emp => {
            //if (emp.objType == 'emp') {
            if (emp.name === objId) {
                isHave = true;
            }
            // }
        });
        return isHave;
    },
    changeEmpPosition: function (objlist, tagCode, ps) {
        objlist.children.forEach(emp => {
            if (emp !== undefined && emp.objType === 'emp') {
                if (emp.name === tagCode) {
                    //转换坐标               
                    // var prePs = emp.PrePoint;
                    emp.position.set(ps.x, ps.y, ps.z + objRadius);
                }
            }
        });
    },


    createTextSphere: function (txtName) {
        //   var ps = obj.position;
        //var ps = { X: -20, Y: 90, Z: 0 };
        var ps = { X: -15, Y: 0, Z: 2 };
        var txt = gui.asGeom(txtName, ps);
        txt.rotateX(Math.PI / 2);
        return txt;
    },
    createTextObjMtl: function (txtName) {
        //   var ps = obj.position;
        //var ps = { X: -20, Y: 90, Z: 0 };
        var ps = { X: -20, Y: 0, Z: 2 };

        var txt = gui.asGeom(txtName, ps);
        return txt;
    },
    createText: function (strTxt, ps) {

        var txt = gui.asGeom(strTxt, ps);
        return txt;
    },


    ///获取本地缓存文件
    getlocalStorage: function (keyname) {
        let jsonRCallstr = window.localStorage.getItem(keyname);
        let json = undefined;
        //if (jsonRCallstr !== null || jsonRCallstr !== '') {    
        //}  
        // 还原json对象  
        json = JSON.parse(jsonRCallstr);
        return json;
    },

    ///保存本地缓存文件
    savelocalStorage:function (key,value) {      
        window.localStorage.setItem(key, "");
        let jsonstr = JSON.stringify(value);
        // 存储json字符串  
        window.localStorage.setItem(key, jsonstr);
    },
}