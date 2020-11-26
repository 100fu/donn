
var light3DFunction = {
    initCamera: function () {
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        camera.position.x = 600;
        camera.position.y = 0;
        camera.position.z = 600;
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.lookAt({ x: 0, y: 0, z: 0 });

    },
    initLight: function () {
        // // AmbientLight 环境光
        // light = new THREE.AmbientLight(0x0FF000);
        // light.position.set(100, 100, 200);
        // scene.add(light);

        // // DirectionalLight 方向光
        // // 第一个参数是光源颜色
        // // 第二个参数是光源强度，你可以改变它试一下
        // light = new THREE.DirectionalLight(0xFF0000);
        // // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
        // light.position.set(0, 0, 1);
        // scene.add(light);
        // // A end

        //组合二
        // light = new THREE.AmbientLight(0x00FF00);
        // light.position.set(100, 100, 200);
        // scene.add(light);
        // // 方向光
        // light = new THREE.DirectionalLight(0xFF0000);
        // light.position.set(0, 0,1);
        // scene.add(light);

        // //点关
        // light = new THREE.PointLight(0x00FF00,1,400,1);
        // light.position.set(0, 0,25);
        // scene.add(light);

        ///反向光
        light = new THREE.DirectionalLight(0xFF0000,1.0);
        light.position.set(0, 0,1);
        scene.add(light);

        light = new THREE.PointLight(0x00FF00,1,400,1);
        light.position.set(0, 0,25);
        scene.add(light);

    },
    initObject: function () {
        // var geometry=new THREE.CubeGeometry(200,100,50,4,4);
        // var material=new THREE.MeshLambertMaterial( { color:0x880000});
        // var mesh1=new THREE.Mesh(geometry,material);
        // mesh1.position=new THREE.Vector3(0,0,0);
        // scene.add(mesh1);

        // var geometry2=new THREE.CubeGeometry(200,100,50,4,4);
        // var material2=new THREE.MeshLambertMaterial( { color:0x880000});
        // var mesh2=new THREE.Mesh(geometry2,material2);
        // mesh2.position=new THREE.Vector3(-300,0,0);
        // scene.add(mesh2);

        // var geometry3=new THREE.CubeGeometry(200,100,50,4,4);
        // var material3=new THREE.MeshLambertMaterial( { color:0x880000});
        // var mesh3=new THREE.Mesh(geometry3,material3);
        // mesh3.position=new THREE.Vector3(0,-150,0);
        // scene.add(mesh3);


        // var mesh4=new THREE.Mesh(geometry3,material3);
        // mesh4.position=new THREE.Vector3(0,150,0);
        // scene.add(mesh4);

        // var mesh5=new THREE.Mesh(geometry3,material3);
        // mesh5.position=new THREE.Vector3(300,10,0);
        // scene.add(mesh5);

        // var mesh6=new THREE.Mesh(geometry3,material3);
        // mesh6.position=new THREE.Vector3(0,0,-100);
        // scene.add(mesh6);

        var geometry = new THREE.CubeGeometry(200, 100, 50, 4, 4);
        var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        var mesh1 = new THREE.Mesh(geometry, material);
        mesh1.position.set(0, 0, 400);
        scene.add(mesh1);

        var geometry2 = new THREE.CubeGeometry(200, 100, 50, 4, 4);
        var material2 = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        var mesh2 = new THREE.Mesh(geometry2, material2);
        mesh2.position.set(-300, 0, 0);
        scene.add(mesh2);

        var geometry3 = new THREE.CubeGeometry(200, 100, 50, 4, 4);
        var material3 = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        var mesh3 = new THREE.Mesh(geometry3, material3);
        mesh3.position.set(0, -150, 0);
        scene.add(mesh3);

        var mesh4 = new THREE.Mesh(geometry3, material3);
        mesh4.position.set(0, 150, 0);
        scene.add(mesh4);

        var mesh5 = new THREE.Mesh(geometry3, material3);
        mesh5.position.set(300, 0, 0);
        scene.add(mesh5);

        var mesh6 = new THREE.Mesh(geometry3, material3);
        mesh6.position.set(0, 0, -100);
        scene.add(mesh6);


    },
    threeStart: function () {
        mode2d3dFunction.initThree();
        light3DFunction.initCamera();
        mode2d3dFunction.initScene();
        light3DFunction.initLight();
        light3DFunction.initObject();

        // renderer.clear();
        // renderer.render(scene, camera);
        light3DFunction.animate();

    },
    animate:function(){
        renderer.clear();
        renderer.render(scene, camera);

        requestAnimationFrame(light3DFunction.animate);
    },


};

