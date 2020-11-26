/**全局渲染器 */
var renderer;
/**全局镜头 */
var camera;
/**全局场景对象 */
var scene;
/**全局光照对象 */
var light;
var cube;
var mode2d3dFunction = {
    initThree: function () {
        width = document.getElementById('canvas-frame').clientWidth;
        height = document.getElementById('canvas-frame').clientHeight;
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(width, height);
        document.getElementById('canvas-frame').appendChild(renderer.domElement);
        renderer.setClearColor(0xFFFFFF, 1.0);
    },
    initCamera: function () {
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        camera.position.x = 0;
        camera.position.y = 1000;
        camera.position.z = 0;
        camera.up.x = 0;
        camera.up.y = 0;
        camera.up.z = 1;
        camera.lookAt({ x: 0, y: 0, z: 0 });

    },
    initScene: function () {
        scene = new THREE.Scene();
    },
    initLight: function () {
        light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
        light.position.set(100, 100, 200);
        scene.add(light);
    },
    initObject: function () {
        var geometry = new THREE.Geometry();
        var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
        var color1 = new THREE.Color(0x444444), color2 = new THREE.Color(0xFF0000);
        /**线的材质可以由2点的颜色决定* */
        var p1 = new THREE.Vector3(-100, 0, 100);
        var p2 = new THREE.Vector3(100, 0, -100);
        geometry.vertices.push(p1);
        geometry.vertices.push(p2);
        geometry.colors.push(color1, color2);

        var line = new THREE.Line(geometry, material, THREE.LinePieces);
        scene.add(line);
    },



    refresh: function () {
        renderer.clear();
        renderer.render(scene, camera);
        requestAnimationFrame(mode2d3dFunction.refresh);
    },

    startThree: function () {
        mode2d3dFunction.initThree();
        mode2d3dFunction.initCamera();
        mode2d3dFunction.initScene();
        mode2d3dFunction.initLight();
        mode2d3dFunction.initObject();
        mode2d3dFunction.refresh();
    },


    /********************Test2********************************************* */
    initobject2: function () {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-500, 0, 0));
        geometry.vertices.push(new THREE.Vector3(500, 0, 0));

        for (var i = 0; i <= 20; i++) {
           

            var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
            line.position.z = ( i * 50 ) - 500;
            scene.add( line );

            line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
            line.position.x = ( i * 50 ) - 500;
            line.rotation.y = 90 * Math.PI / 180;
            scene.add( line );



        }
    },
    startThree2: function () {
        mode2d3dFunction.initThree();
        mode2d3dFunction.initCamera();
        mode2d3dFunction.initScene();
        mode2d3dFunction.initLight();
        mode2d3dFunction.initobject2();
        renderer.clear();
        renderer.render(scene, camera);
    }

};
