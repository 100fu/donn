/**全局渲染器 */
var renderer;
/**全局镜头 */
var camera;
/**全局场景对象 */
var scene;
/**全局光照对象 */
var light;
var cube;
var text;
var canvas3DFunction = {
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
    initObject: function () {
        var geometry=new THREE.CylinderGeometry(70,100,200);
        var material=new THREE.MeshLambertMaterial( { color:0xFFFFFF});
        mesh=new THREE.Mesh(geometry,material);
        mesh.position=new THREE.Vector3(0,0,0);
        scene.add(mesh);
    },
    createUI:function(){
        var FizzyText=function(){ this.fov=45;};
        text=new FizzyText();
        var gui = new dat.GUI();
        gui.add(text,"fov",0,180).name("视角大小(0-180)"); 
    },
    initCamera: function () {
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 600;
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.lookAt({ x: 0, y: 0, z: 0 });

    },
    initScene: function () {
        scene = new THREE.Scene();
    },
    initLight: function () {
        light = new THREE.AmbientLight(0xFF0000);
        light.position.set(100, 100, 200);
        scene.add(light);

        light = new THREE.PointLight(0x00FF00);
        light.position.set(0, 0,300);
        scene.add(light);
    },
    setCameraFov:function(fov){
        camera.fov=fov;
        camera.updateProjectionMatrix();
    },
    changeFov:function()
    {
        canvas3DFunction.setCameraFov(text.fov);
        
    },
    animation:function()
    {
        canvas3DFunction.changeFov();
        renderer.render(scene,camera);
        requestAnimationFrame(canvas3DFunction.animation);
    },

    threeStart:function()
    {
        canvas3DFunction.initThree();
        canvas3DFunction.initCamera();
        canvas3DFunction.initScene();
        canvas3DFunction.initLight();
        
        canvas3DFunction.initObject();
        canvas3DFunction.createUI();
        canvas3DFunction.animation();
      
    },

};
