
var staHeight = 50, objRadius = 3;
drawmap3Dcli = {
    createBoxGeometry: function (width_X, height_Y, depth_Z, opacity, imageFile) {

        //  var imageFile= imageFile||"/Scripts/images/caodi-2.jpg";
        var imageFile = imageFile || wallPic;//'./Scripts/images/rocks.jpg';
        var opacity = opacity || 0.8;
        var cubeGeometry = new THREE.BoxGeometry(width_X, height_Y, depth_Z);
        //var cubeMaterial = new THREE.MeshLambertMaterial({ map: mapPath });
        var cubeMaterial = new THREE.MeshLambertMaterial();
        //var texture = THREE.ImageUtils.loadTexture(imageFile);

        let clothNumSegmentsZ = 50;
        let clothNumSegmentsY = 1;

        // var mat = new THREE.MeshPhongMaterial();
        //  cubeMaterial.map = texture;//材质的Map属性用于添加纹理
        cubeMaterial.transparent = true;
        cubeMaterial.opacity = opacity;

        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        textureLoader.load(imageFile, function (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(clothNumSegmentsZ, clothNumSegmentsY);
            cube.material.map = texture;
            cube.material.needsUpdate = true;
        });
        // cube.name = 'cube';

        // var txt = sys.MapData.createText(strTxt);
        // cube.add(txt);
        // cube.position.x = 0;
        // cube.position.y = 0;
        // cube.position.z = 0;

        return cube
        // scene.add(cube);

    },

  
    ///画球
    createSphere: function () {
        //设置球体的值
        var radius = 50, segemnt = 16, rings = 16;
        var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });

        var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segemnt, rings), sphereMaterial);
        return sphere;
    },
    ///球体
    createSphereGeometry: function (point) {
        // THREE.CylinderGeometry(0, 2, 20);
        //   var geometry = new THREE.SphereGeometry(0.6, 20, 20);
        var geometry = new THREE.SphereGeometry(objRadius, 20, 20);
        //随机颜色
        var material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
        // var material = new THREE.MeshPhongMaterial({ color: 0x33FF00 });
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = point.x;
        sphere.position.y = (point.y);
        sphere.position.z = (point.z + objRadius);
        //sphere.position.normalize();
        // sphere.position.multiplyScalar( Math.random() * 2 + 1 );
        sphere.castShadow = true;
        sphere.receiveShadow = true;

       

        return sphere;
        //group.add(sphere);

        // AddScenne(sphere);

    },

    ///圆柱
    createCylinder: function () {
        var cylinderGeometry = new THREE.CylinderGeometry(1, 10, staHeight);
        var cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0xDC143C });
        var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.rotateX(Math.PI / 2);

        //cylinder.position.set(0, 0, 1);
        return cylinder;
    },

    initMapJPG: function (fileMPath) {

        var fileMPath = fileMPath || fileParam.sysMap_path + sysConfig.mapName;
        //sysConfig
        //var sphere = sys.draw.createMesh(new THREE.PlaneBufferGeometry(2256, 1598), fileMPath);
        var sphere = drawmap3Dcli.createMesh(new THREE.PlaneBufferGeometry(sysConfig.mapWidth, sysConfig.mapHeight), fileMPath);
        if (sysConfig.mapType == 1) {
            sphere = new THREE.Object3D();
        }
        return sphere;    
    },

    createMesh: function (geom, imageFile) {
        // sys.draw.loadImg(imageFile);
        var texture = THREE.ImageUtils.loadTexture(imageFile);
        // new THREE.MeshBasicMaterial({ visible: false }
        // var mat = new THREE.MeshPhongMaterial({color:0xFF0000});
        var mat = new THREE.MeshPhongMaterial();
        mat.map = texture;//材质的Map属性用于添加纹理

        // mat.map = img;
        var mesh = new THREE.Mesh(geom, mat);
        return mesh;
    },

    createLine: function (points,color)
    {
        var geometry = new THREE.Geometry();
        var color = color || 0x00008B;
        //定义一种线条的材质,使用THREE.LineBasicMaterial类型来定义，它接受一个集合作为参数
        /*
        * LineBasicMaterial( parameters )
         Parameters是一个定义材质外观的对象，它包含多个属性来定义材质，这些属性是：
         Color：线条的颜色，用16进制来表示，默认的颜色是白色。
         Linewidth：线条的宽度，默认时候1个单位宽度。
         Linecap：线条两端的外观，默认是圆角端点，当线条较粗的时候才看得出效果，如果线条很细，那么你几乎看不出效果了。
         Linejoin：两个线条的连接点处的外观，默认是“round”，表示圆角。
         VertexColors：定义线条材质是否使用顶点颜色，这是一个boolean值。意思是，线条各部分的颜色会根据顶点的颜色来进行插值。（如果关于插值不是很明白，可以QQ问我，QQ在前言中你一定能够找到，嘿嘿，虽然没有明确写出）。
         Fog：定义材质的颜色是否受全局雾效的影响。
         好了，介绍完这些参数，你可以试一试了，在课后，我们会展示不同同学的杰出作品。下面，接着上面的讲，我们这里使用了顶点颜色vertexColors: THREE.VertexColors，就是线条的颜色会根据顶点来计算。
         var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );
        * */
        //var material = new THREE.LineBasicMaterial({ color: color });       
        var material = new THREE.LineBasicMaterial(
            {
                color: color,
                opacity: 1,
                linewidth: 2
            });

        points.forEach(p => {
            geometry.vertices.push(p);
        });
   
        //geometry.vertices.push(p1);
        //geometry.vertices.push(p2);
 
        //定义一条线
        //定义线条，使用THREE.Line类
        //第一个参数是几何体geometry，里面包含了2个顶点和顶点的颜色。第二个参数是线条的材质，或者是线条的属性，表示线条以哪种方式取色。第三个参数是一组点的连接方式
        //var line = new THREE.Line(geometry, material, THREE.LinePieces);
        var line = new THREE.Line(geometry, material);
        return line;
    },





}