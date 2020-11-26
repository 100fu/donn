//var hmap = {
//    width: 1196,
//    height: 937,
//    radius: 25,
//    max: 800,
//    min: 100,
//    filter: 12
//};

var points = [], width = 600, height = 400, max = 0, heatmapInstance = undefined, heatMapPlane = undefined, canvasW = 800,canvasH=600;
var headwg = undefined;
var px = 1, py = 1, rotate180 = Math.PI / 360;
var headmap = {
    loadmap() {
       // changeCanvas();
        let mapInfo = getLayerByName(curFloor);
        let myCanvas = document.getElementById('newmap3d');//.getElementsByTagName('canvas')[0];
        let canvas = myCanvas.getBoundingClientRect();
        canvasW = canvas.width;
        canvasH = canvas.height;

        width = mapInfo.mapWidth;
        height = mapInfo.mapHeight;

    
        $("#divheadmap").width(width);
        $("#divheadmap").height(height);
        // headmap.loadheadmap();
       // let points = [{ X: 0, Y: 0, Z: 0 }, { X: width / 2, Y: height / 2, Z: 0 }, { X: -115, Y: -74, Z: 0 }];
      //  headmap.drawTest(points);
    },


    drawTest(points) {
        var color = '#A020F0';
        $.each(points, function (i, ps) {
            // ps = new Point3D_CM(ps);  //完成坐标偏移
            let dd = sys.draw.initPoint3d(ps, color);
            sys.MapData.AddScene(dd);
        });
    },
    setCanvasOnScene(canvas) {
        let heatMapGeo = new THREE.PlaneBufferGeometry(width, height); //new THREE.PlaneGeometry(width, height);
        let heatMapTexture = new THREE.Texture(canvas);
        // let rtPs = new THREE.Vector3(0,0, 0);
        //   transparent: true,
        //opacity: 0.7,
          //  color: 0xFF0000
        let heatMapMaterial = new THREE.MeshBasicMaterial({
            map: heatMapTexture,
            transparent: true            
        });
        heatMapMaterial.map.needsUpdate = true;
        if (heatMapPlane !== undefined) {
            console.log('移除画布');
            sys.MapData.RemoveObj(heatMapPlane);
        }
        heatMapPlane = new THREE.Mesh(heatMapGeo, heatMapMaterial);

        heatMapPlane.position.set(0, 0, 0);
        // heatMapPlane.rotateX(Math.PI / 2); //沿X轴方向选中90° 
    
        //heatMapPlane.rotation.copy(new THREE.Euler(0,0, Math.PI));
        heatMapPlane.rotation.copy(new THREE.Euler(0, 0, 0));
        sys.MapData.AddScene(heatMapPlane);
    },
    //刷新数据
    refreshData(data) {
        points = [];
        data.forEach((o) => {
            let val = o.num;
            let ps = new Point3D_Str(o.Position);
            let position2 = new Point3D_CM(ps);
            let position = new PtForeToOne(position2);
            let txtLs = new THREE.Vector3(position.X, position.Y, position.Z);
            max = Math.max(max, val);
            var point = {
                x: txtLs.x,
                y: txtLs.y,
                value: val
            };
            points.push(point);

        });
        headmap.refreshHeadMap();
    },

    refreshHeadMap() {
        heatmapInstance = h337.create({
            container: document.querySelector('#divheadmap'),
            radius: 20,
        });
   
        var data = {
            max: max,
            data: points
        };
        heatmapInstance.setData(data); //数据绑定还可以使用
        let canvas = document.getElementById('divheadmap').getElementsByTagName('canvas')[0];
        document.getElementById('divheadmap').innerHTML = "";
       // alert("W:" + canvas.width + " H:" + canvas.height);
        headmap.setCanvasOnScene(canvas);
    },

    loadheadmap() {
        points = [];
        var len = 200;
        while (len--) {
            var val = Math.floor(Math.random() * 100);
            max = Math.max(max, val);
            var point = {
                x: Math.floor(Math.random() * width),
                y: Math.floor(Math.random() * height),
                value: val
            };
            points.push(point);
        }
        headmap.refreshHeadMap();
    },


};
///原点在中心的坐标系转成左上角坐标系
function PtForeToOne(p) {
    this.X = p.X + width / 2;
    this.Y = -p.Y + height / 2;
    this.Z = 0;
    this.toString = function () {
        return this.X + "," + this.Y + "," + this.Z;
    }
};
