/**全局渲染器 */
var renderer;
/**全局镜头 */
var camera;
/**全局场景对象 */
var scene;
/**全局光照对象 */
var light;
var container;
var controls;
var transformControl;
var frustumSize = 1000;
var planeGeometry;
var tempObj;
var loaderFont;
var fontJsonUrl;
var fontNew;
var gui, objMTL;
var groupRegion = null;


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
// var sys = sys || {};
sys.map = function () {
    this.initThree = function () {
        container = document.getElementById('container');
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);
    };
    this.initCamera = function () {
        //camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
        camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, 100, 200);
      //  camera.rotateX(- Math.PI / 4);
        // scene.add(camera);
        AddSence(camera);

    };
    this.initScene = function () {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        planeGeometry = new THREE.PlaneGeometry(GridSize, GridSize);
        planeGeometry.rotateX(- Math.PI / 2);
        var planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
        //  var planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        // plane.position.y = -200;
        plane.receiveShadow = true;
        // scene.add(plane);
        AddSence(plane);


        groupRegion = new THREE.Object3D();
        groupRegion.rotateX(- Math.PI / 2);
        AddSence(groupRegion);

    };
    this.initLight = function () {
        scene.add(new THREE.AmbientLight(0xf0f0f0));
        // var light = new THREE.SpotLight(0xffffff, 1.5);
        // light.position.set(0, 1500, 200);
        // light.castShadow = true;
        // light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(70, 1, 200, 2000));
        // light.shadow.bias = -0.000222;
        // light.shadow.mapSize.width = 1024;
        // light.shadow.mapSize.height = 1024;
        // scene.add(light);

    };
    this.initOrbit = function () {

        ///创建网格
        // var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        // plane.position.y = -200;
        // plane.receiveShadow = true;
        // scene.add(plane);
        // var helper = new THREE.GridHelper(800, 50, 0x0000ff, 0x808080);
        var helper = new THREE.GridHelper(GridSize, GridStep, 0x0000ff, 0x808080);
        helper.position.y = -10; //- 199;
        helper.material.opacity = 0.25;
        helper.material.transparent = true;
      //  scene.add(helper);

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
        //设置相机距离原点的最远距离
        controls.minDistance = -20;
        //设置相机距离原点的最远距离
        controls.maxDistance = 2000;
        //是否开启右键拖拽
        controls.enablePan = true;

    };
    function render() {
        renderer.render(scene, camera);
    };
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        render();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    function onProgress(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
        }
    };
    function onError(error) { };

    function loadObj2(objName) {
        var target_obj = null;
        // var mtl_base_path = 'Scripts/images/obj/';
        var mtl_base_path = fileParam.mtl_base_path;
        var obj_name = objName + '.obj';
        var mtl_name = objName + '.mtl';
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setBaseUrl(fileParam.mtl_base_path);
        mtlLoader.setPath(fileParam.mtl_base_path);
        mtlLoader.load(mtl_name, function (materials) {
            materials.preload();
            // model
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath(mtl_base_path);
            objLoader.load(obj_name, function (object) {
                //object.position.y = - 95;
                scene.add(object);
                target_obj = object;
                return target_obj;
            });
        }, onProgress, onError);
    };

    function initObjMtl() {
        objMTL = {

        };
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
                loader.load('./Scripts/json/FangSong_GB2312_Regular.json', function (response) {
                    gui.font = response;
                    gui.backOk();
                });
            },
            backOk: function () {
                isBackOk = true;
            },
            asGeom: function (msg, point, isload) {

                var meg =msg;//encodeURI(encodeURI(msg));//new String(msg, "UTF-8");
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
    function AddGroupRegion(obj) {
        groupRegion.add(obj);
    };
    function AddSence(obj) {
        scene.add(obj);
    };
    this.LoadMap = function () {
        initFont();
        this.initThree();
        this.initScene();
        this.initCamera();
        this.initOrbit();
        this.initLight();

        window.onresize = onWindowResize;
        setTimeout(function () {
            sys.draw.initMap("3d");


            //  loadObj2('dianzu');
        }, 400);
        // setTimeout(function () {           
        //     showMap3D();   
        // }, 3000);

        animate();

    };
    function showMap3D() {
        if (lineGroup.children.length > 0) {
            lineGroup.rotateX(- Math.PI / 2); //沿X轴方向选中90° 
            scene.add(lineGroup);
        }
        if (textGroup.children.length > 0) {
            textGroup.rotateX(- Math.PI / 2);
            scene.add(textGroup);
        }
    };
    // function loadObj() {
    //     var loader = new THREE.OBJLoader();//在init函数中，创建loader变量，用于导入模型
    //     loader.load('Scripts/images/obj/dianzu.obj', function (obj) {//第一个表示模型路径，第二个表示完成导入后的回调函数，一般我们需要在这个回调函数中将导入的模型添加到场景中
    //         obj.traverse(function (child) {
    //             if (child instanceof THREE.Mesh) {
    //                 child.material.side = THREE.DoubleSide;
    //             }
    //         });
    //         mesh = obj;//储存到全局变量中
    //         scene.add(obj);//将导入的模型添加到场景中\
    //     });
    // };

    // function loadObj2() {    
    //     var target_obj = null;
    //     var mtl_base_path = 'Scripts/images/obj/';
    //     var obj_mtl_name = 'dianzu.obj';
    //     var  mtl_name = 'dianzu.mtl';
    //     var mtlLoader = new THREE.MTLLoader();
    //     mtlLoader.setBaseUrl(mtl_base_path);
    //     mtlLoader.setPath(mtl_base_path);
    //     mtlLoader.load(mtl_name, function (materials) {
    //         materials.preload();
    //         // model
    //         var objLoader = new THREE.OBJLoader();
    //         objLoader.setMaterials(materials);
    //         objLoader.setPath(mtl_base_path);
    //         objLoader.load(obj_mtl_name, function (object) {
    //             //object.position.y = - 95;
    //              scene.add( object );
    //             target_obj = object;
    //         });
    //     });
    // };

    // ///画线
    // function drawLine(points) {
    //     var line = drawObjLineString(points);
    // };

    // //画圆
    // function drawCircle(points) {
    //     // var geometry = new THREE.CircleGeometry(5, 32 );
    //     // var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    //     // var circle = new THREE.Mesh( geometry, material );
    //     var color = 0x000099;
    //     var circle = drawObjLineString(points, color);
    //    // scene.add(circle);
    // };
    // //画折线
    // function drawPolyline(points) {
    //     var color = 0x000099;
    //     var polyline = drawObjLineString(points, color);
    //    // scene.add(polyline);
    // };
    // function drawObjLineString(points, color) {
    //     color = color || 0xFFFFF;
    //     // color — 线条的十六进制颜色。缺省值为 0xffffff。
    //     // linewidth — 线条的宽度。缺省为 1。
    //     // linecap — 定义线条端点的外观。缺省为 'round'（即圆形线头）。
    //     // linejoin — 定义线条接口处的外观。缺省为 'round'。
    //     // vertexColors — 定义顶点如何着色。缺省是 THREE.NoColors。
    //     // fog — 定义材质颜色是否受全局雾设置的影响。默认是false。
    //     var material = new THREE.LineBasicMaterial(
    //         {
    //             color: color,
    //             opacity: 1,
    //             linewidth: 2
    //         });

    //     var geometry = new THREE.Geometry();
    //     $.each(points, function (i, pt) {
    //         var ps = new Point3D(pt);
    //         geometry.vertices.push(new THREE.Vector3(ps.X, ps.Y, ps.Z));
    //     });
    //     var obj = new THREE.Line(geometry, material);
    //     lineGroup.add(obj);
    //    // obj.rotateX(- Math.PI / 2); //沿X轴方向选中90° 
    //     return obj;
    // };

    // function initMap() {
    //     $.getJSON("Scripts/json/road2018.json", function (data) {
    //         new NewArray();
    //         $.each(data.features, function (i, item) {
    //             var cadM = new cadMode(item, i);
    //             if (cadM.SubClasses.indexOf("AcDbLine") > 0) {
    //                 drawLine(cadM.coordinates);
    //                 // JSON.stringify(cadM);  
    //                 AcDbLine.add(JSON.stringify(cadM));
    //             } else if (cadM.SubClasses.indexOf("AcDbPolyline") > 0) {
    //                 drawPolyline(cadM.coordinates);
    //                 AcDbPolyline.add(JSON.stringify(cadM));
    //             } else if (cadM.SubClasses.indexOf("AcDbCircle") > 0) {
    //                 drawCircle(cadM.coordinates);
    //                 AcDbCircle.add(JSON.stringify(cadM));
    //             } else if (cadM.SubClasses.indexOf("AcDbMText") > 0 || cadM.SubClasses.indexOf("AcDbText") > 0) {
    //                 if (cadM.Text != null) {
    //                     var txtList = TextList(cadM.Text);

    //                     for (j = 0, len = txtList.length; j < len; j++) {

    //                         var txtM = getText(txtList[j]);
    //                         var ps = cadM.coordinates;
    //                         gui.asGeom(txtM, ps);
    //                         // drawText0122(txtM, ps);
    //                         // drawText(txtM, ps);
    //                         // drawText3D(txtM, ps);

    //                     }

    //                     AcDbMText.add(JSON.stringify(cadM));
    //                 }
    //             } else if (cadM.SubClasses.indexOf("AcDbHatch") > 0) { } else if (cadM.SubClasses.indexOf("AcDbBlockReference") > 0) { }
    //         });


    //         if(lineGroup.children.length>0)
    //         {

    //             lineGroup.rotateX(- Math.PI / 2); //沿X轴方向选中90° 
    //             scene.add(lineGroup);
    //         }
    //         if(textGroup.children.length>0)
    //         {
    //             textGroup.rotateX(- Math.PI / 2);
    //             scene.add(textGroup);

    //         }
    //         // if (AcDbLine.size() > 0) {
    //         //     localStorage.setItem('AcDbLine', AcDbLine.toString());
    //         // }
    //         // if (AcDbPolyline.size() > 0) {
    //         //     localStorage.setItem('AcDbPolyline', AcDbPolyline.toString());
    //         // }
    //     });

    //     // $.get('Scripts/json/road2018.txt').success(function(data){ 
    //     //    alert(data);
    //     //     }); 

    //     //   Utils.loadFile('Scripts/json/road2018.json', function (text) {
    //     //       alert(text);
    //     //         // var jsonBox = self.edit2d.getJsonBox();
    //     //         // var importDxf = new mono.edit.ImportDxf(jsonBox);
    //     //         // importDxf.loadDxf(text);
    //     //         // var data = jsonBox.toJson();
    //     //         // localStorage.setItem('substationScene', data);
    //     //         // mono.edit.model.model3d.loadData(box, JSON.parse(localStorage.getItem('substationScene')));
    //     //     });

    // }
    function ImportJson(file, callback) {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = function () {
            if (reader.error) {
                console.log(reader.error);
            } else {
                if (callback) {
                    callback(reader.result);
                }
            }
        }
    };
    function animate() {
        //更新控制器
        controls.update();
        render();
        requestAnimationFrame(animate);
    }
};
// $(document).ready(){}
$(function () {
    var map = new sys.map();
    map.LoadMap();
});



