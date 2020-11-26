sys.draw = {

    initMap: function (mapType) {
        //1.初始化缓存对象
        var map3D = mapType;
        if (map3D == "2d")
            ismap3D = false;
        else {
            ismap3D = true;
        }
        new NewArray();

        ///初始化线缓存集合
        sys.draw.AddlineGroup();
        ///初始化文字缓存集合
        sys.draw.AddtextGroup();

        var mapType = sysConfig.mapType;
        if (mapType == 1) {
            //2.加载json文件
            if (isBackOk == true) {
                isLoad = true;
                if (lineGroup.children.length == 0) {
                    sys.draw.initLoadDxf(mapType);
                }
            } else {
                window.setInterval(function () {
                    if (isLoad == false && isBackOk == true) {
                        isLoad = true;
                        if (lineGroup.children.length == 0) {
                            sys.draw.initLoadDxf(mapType);
                        }
                    }
                }, 1000);
            }
        } //else {

        ////2.加载JPG文件
        if (ismap3D) {
            plan3D = sys.draw.initMapJPG();
            plan3D.rotateX(- Math.PI / 2);
            plan3D.position.y = -100;
            sys.MapData.AddScene(plan3D);

            plan3D2 = sys.draw.initMapJPG();
            plan3D2.rotateX(- Math.PI / 2);
            plan3D2.position.y = 0;
            // sys.newmap3D.AddScene3D(plan3D);
            sys.MapData.AddScene(plan3D2);
        } else {
            plan2D = sys.draw.initMapJPG();
            sys.draw.AddScene2D(plan2D);
        }
        //}



        setTimeout(function () {
            sys.draw.loadStorage();
            //mapNew3D.rtTest();
            if (ismap3D) {
                //sys.baseNew3D.loadRtRegWL();

                //刷新时间 
                // sys.baseNew3D.loadRegsTimeRef();
            }

        }, 3000);
        if (mapType == 2)
            sys.draw.loadStation();
    },

    ///只加载地图
    loadHisMap: function (ismap3D) {
        if (ismap3D) {
            plan3D = sys.draw.initMapJPG();
            sys.MapData.AddScene(plan3D);
        } else {
            plan2D = sys.draw.initMapJPG();
            sys.MapData.AddScene(plan2D);
        }
    },


    plan3DAdd: function (obj) {
        plan3D.add(obj);
    },
    removePlan3D: function (obj) {
        plan3D.remove(obj);
    },
    removePlan2D: function (obj) {
        plan2D.remove(obj);
    },
    plan2DAdd: function (obj) {
        plan2D.add(obj);
    },
    clear3DStaObj: function () {
        if (plan3D != undefined)
            $.each(plan3D.children, function (i, sta) {
                if (sta.objType == 'sta') {
                    sys.draw.removePlan3D(sta);
                }
            });
    },

    clear2DStaObj: function () {
        if (plan2D != undefined)
            $.each(plan2D.children, function (i, sta) {
                if (sta.objType == 'sta') {
                    sys.draw.removePlan2D(sta);
                }
            });
    },
    changeStaPS: function () {
        if (ismap3D) {
            $.each(plan3D.children, function (i, sta) {
                if (sta.objType == 'sta') {
                    var point = new Point3D_CM(sta.origPosition);  //完成坐标偏移                
                    sta.position.x = point.X;
                    sta.position.y = point.Y;
                    sta.position.z = point.Z;
                }
            });
        }
        else {
            $.each(plan2D.children, function (i, sta) {
                if (sta.objType == 'sta') {
                    var point = new Point3D_CM(sta.origPosition);  //完成坐标偏移                
                    sta.position.x = point.X;
                    sta.position.y = point.Y;
                    sta.position.z = point.Z;
                    // sys.draw.removePlan2D(sta);
                }
            });
        }
    },

    //loadStation: function () {
    //    var color = '#A020F0';
    //    var urlPath = '/Graphic/GetStaInfoList';
    //    clientMode.post(urlPath, null, function (data) {
    //        if (data.length > 0) {
    //            if (ismap3D) {
    //                sys.draw.clear3DStaObj();
    //            } else {
    //                sys.draw.clear2DStaObj();
    //            }

    //            $.each(data, function (i, item) {
    //                if (item.Position != null) {
    //                    var strList = item.Position.split(',');
    //                    //sys.baseNew3D.addStationList(item);
    //                    if (strList.length > 1) {
                         
    //                        let ps = { X: strList[0], Y: strList[1], Z: strList[2] };
    //                        let psNew = new Point3D_CM(ps);  //完成坐标偏移
    //                        let sta = drawmap3Dcli.createCylinder();
    //                        sta.objType = 'sta';
    //                        sta.origPosition = ps;
    //                        sta.staId = item.Id;
    //                        sys.MapData.AddScene(sta);
    //                        //var dd = sys.draw.initPoint3d(psNew, color);
    //                        //dd.objType = 'sta';
    //                        //dd.origPosition = ps;
    //                        //dd.staId = item.Id;
    //                        //if (ismap3D) {
    //                        //    //  sys.baseNew3D.addStationList(item);
    //                        //    sys.draw.plan3DAdd(dd);
    //                        //} else {
    //                        //    sys.draw.plan2DAdd(dd);
    //                        //}
    //                    }
    //                }
    //            });
    //        }
    //    });
    //},

    loadStation: function (planMap3D,floor) {
        let color = '#A020F0';
        let urlPath = '/Graphic/GetStaInfoList';
        let selfPlan = planMap3D;
        let selfFloor = floor;
        clientMode.post(urlPath, null, function (data) {
            if (data.length > 0) {
                $.each(data, function (i, item) {
                    if (item.Position != null) {
                        var strList = item.Position.split(',');
                        //sys.baseNew3D.addStationList(item);
                        if (strList.length > 1) {
                            let ps = { X: strList[0], Y: strList[1], Z: strList[2] };
                            let psNew = new Point3D_CM(ps);  //完成坐标偏移
                            let sta = drawmap3Dcli.createCylinder();
                            sta.objType = 'sta';
                           // sta.origPosition = ps;
                            sta.staId = item.Id;
                            sta.floor = floor;

                            sta.position.set((psNew.X), (psNew.Y), (staHeight/2));
                            //sta.position.x = psNew.X;
                            //sta.position.y = psNew.Y;
                            //sta.position.z = psNew.Z;
                           

                            // sys.MapData.AddScene(sta);

                            //判定有没有之后再添加
                            selfPlan.add(sta);
                            //
                            //sys.MapData.AddObj3DList(sta);
                           
                        }
                    }
                });
            }
        });
    },
    ///在图上画点
    drawStaPoints: function () {

        var points = [{ X: 0, Y: 0, Z: 0 }, { X: 32.8, Y: 602.5, Z: 0 }, { X: 902.6, Y: 522.7, Z: 0 }, { X: 870.6, Y: -48.9, Z: 0 }];
        var color = '#A020F0';
        $.each(points, function (i, ps) {
            ps = new Point3D_CM(ps);  //完成坐标偏移
            var dd = sys.draw.initPoint3d(ps, color);
            dd.objType = 'sta';
            if (ismap3D) {
                // sys.newmap3D.AddScene3D(dd);

                sys.draw.plan3DAdd(dd);
            } else {
                //  sys.draw.AddScene2D(dd);
                sys.draw.plan2DAdd(dd);
            }
        });

        //initPoint3d
    },

    ///画3D盒子
    drawBox: function () {
        var skyBoxGeometry = new THREE.BoxGeometry(5000, 5000, 5000);
        var texture = new THREE.TextureLoader().load(fileParam.sysMap_path + sysConfig.mapName);
        var skyBoxMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
        scene.add(skyBox);
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
    addImgElement: function (src) {
        var img = document.createElement('img');
        //img.onclick = function(){document.getElementById('board').removeChild(this)};
        img.src = src;
        img.style.cursor = 'pointer'; // 커서 지정
        img.style.border = '2px solid red';


        var geom = new THREE.PlaneBufferGeometry(800, 600)
        var mat = new THREE.MeshPhongMaterial();
        mat.map = img;//材质的Map属性用于添加纹理     
        var mesh = new THREE.Mesh(geom, mat);
        sys.draw.loadMesh(mesh);
        // document.getElementById('board').appendChild(img); 
    },
    binaryToImage: function (buffer) {
        var loader = new iws.loader(buffer);
        for (var i = 0; i < loader.getCount(); i++) {
            loader.getSrc(i + 1, sys.draw.addImgElement);
        }
        loader.dispose();
    },
    loadImg2: function (url) {

        var reader = new FileReader();
        reader.onload = function () {
            sys.draw.binaryToImage(reader.result);
        };
        //reader.readAsArrayBuffer(blob); 
        reader.readAsDataURL(url);

    },
    loadImg: function (url) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.responseType = "blob";
        xhr.onload = function () {
            if (this.status == 200) {
                var blob = this.response;

                var reader = new FileReader();
                reader.onload = function () {
                    sys.draw.binaryToImage(reader.result);
                };
                reader.readAsArrayBuffer(blob);
            }
        }
        xhr.send();


    },
    initTiff: function () {
        sys.draw.loadImg2(fileParam.mapJpgPath)
    },
    //天空盒
    initMapJPG: function (fileMPath) {

        var fileMPath = fileMPath || fileParam.sysMap_path + sysConfig.mapName;
        //sysConfig
        //var sphere = sys.draw.createMesh(new THREE.PlaneBufferGeometry(2256, 1598), fileMPath);
        var sphere = sys.draw.createMesh(new THREE.PlaneBufferGeometry(sysConfig.mapWidth, sysConfig.mapHeight), fileMPath);
        if (sysConfig.mapType == 1) {
            sphere = new THREE.Object3D();
        }
        return sphere;
        // sys.draw.loadMesh(sphere);
    },

    createMapPlan: function () {
        //var fileMPath = fileParam.empIcon + "emp_12.png";
        var fileMPath = fileParam.sysMap_path + sysConfig.mapName;
        // var fileMPath = emp.icon;
        var loader = new THREE.TextureLoader();
        var clothTexture = loader.load(fileMPath);
        clothTexture.anisotropy = 16;
        var clothMaterial = new THREE.MeshLambertMaterial({
            map: clothTexture,
            side: THREE.DoubleSide,
            alphaTest: 0.5
        });
        //clothGeometry = new THREE.ParametricGeometry(clothFunction, cloth.w, cloth.h);
        //new THREE.PlaneBufferGeometry(2255, 1597);
        clothGeometry = new THREE.ParametricGeometry(sys.draw.plane(2255, 1597), 5, 10);
        // cloth mesh

        sphere = new THREE.Mesh(clothGeometry, clothMaterial);
        sphere.castShadow = true;

        // var point = new StrToPoint3D(emp.position);
        //  sphere.rotateX(Math.PI / 9); //沿X轴方向选中30°     
        sphere.position.set(0, 0, 0);

        sphere.customDepthMaterial = new THREE.MeshDepthMaterial({
            depthPacking: THREE.RGBADepthPacking,
            map: clothTexture,
            alphaTest: 0.5

        });
        return sphere;

    },



    loadMesh: function (sphere) {
        lineGroup.add(sphere);
    },

    initRegWLConfig: function () {
        sys.draw.getRegsInfo('alarmRegion');

    },
    initRegDMConfig: function () {
        sys.draw.getRegsInfo('rollcallRegion');
    },

    initSysConfig: function () {
        var urlPath = "/Graphic/GetSysOption";
        var strJson = { strkey: 'MapConfig' };
        clientMode.post(urlPath, strJson, function (data) {
            if (data.length > 0) {
                var obj = JSON.parse(data);
                sysConfig.mapType = obj.mapType;
                sysConfig.mapName = obj.mapName;
                tranX = sysConfig.mapTranX = obj.mapTranX;
                tranY = sysConfig.mapTranY = obj.mapTranY;
                sysConfig.regColor = obj.regColor;
                sysConfig.rcallColor = obj.rcallColor;
                sysConfig.devIcon = obj.devIcon;
                sysConfig.empIcon = obj.empIcon;
                sysConfig.regOpacity = obj.regOpacity;
                sysConfig.isShowStation = obj.isShowStation;
                sysConfig.isShowVideo = obj.isShowVideo;
                sysConfig.isShowGrid = obj.isShowGrid;
                sysConfig.mapWidth = obj.mapWidth;
                sysConfig.mapHeight = obj.mapHeight;
                GridSize = sysConfig.mapWidth + 100;
            }
        });
    },
    //"Scripts/json/road2018.json",
    initLoadDxf: function (mapType) {
        // fileParam.mapjsonPath
        var fileMPath = fileParam.sysMap_path + sysConfig.mapName;
        $.getJSON(fileMPath, function (data) {
            $.each(data.features, function (i, item) {
                //if (item.properties.Layer == "FURN-3D" || item.properties.Layer == "FURN-2D" || item.properties.Layer == "A-WALL" || item.properties.Layer == "2D" || item.properties.Layer == "3")
                // if (item.properties.Layer == "3" ) 
                {
                    var cadM = new cadMode(item, i);
                    if (cadM.SubClasses.indexOf("AcDbLine") > 0) {
                        sys.draw.drawLine(cadM.coordinates);
                        // JSON.stringify(cadM);  
                        AcDbLine.add(JSON.stringify(cadM));
                    } else if (cadM.SubClasses.indexOf("AcDbPolyline") > 0) {
                        sys.draw.drawPolyline(cadM.coordinates);
                        AcDbPolyline.add(JSON.stringify(cadM));
                    } else if (cadM.SubClasses.indexOf("AcDbCircle") > 0) {
                        sys.draw.drawCircle(cadM.coordinates);
                        AcDbCircle.add(JSON.stringify(cadM));
                    } else if (cadM.SubClasses.indexOf("AcDbMText") > 0 || cadM.SubClasses.indexOf("AcDbText") > 0) {
                        // if (cadM.Text != null) {
                        //     var txtList = TextList(cadM.Text);
                        //     for (j = 0, len = txtList.length; j < len; j++) {
                        //         var txtM = getText(txtList[j]);
                        //         var ps = cadM.coordinates;
                        //         gui.asGeom(txtM, ps);                       
                        //     }
                        //     AcDbMText.add(JSON.stringify(cadM));
                        // }
                    } else if (cadM.SubClasses.indexOf("AcDbHatch") > 0) {

                    } else if (cadM.SubClasses.indexOf("AcDbBlockReference") > 0) {
                        // if (cadM.coordinates != undefined)
                        // {
                        //this.geometryType == 'GeometryCollection'
                        if (cadM.geometryType == 'GeometryCollection') {
                            sys.draw.loadGeometries(cadM.geometries);
                        } else {
                            sys.draw.drawLine(cadM.coordinates);
                        }
                        // }

                    }

                    //   if (this.geometryType.indexOf("GeometryCollection") > 0) {
                }
            });


        });


    },

    saveLocStorSys: function () {
        var timeNew = new Date().getTime();
        var sysCF = { changeTime: timeNew, sysConfig: sysConfig };
        var key = 'sysconfig';
        //保存缓存文件到
        window.localStorage.setItem(key, "");
        var jsonSys = JSON.stringify(sysCF);
        // 存储json字符串  
        window.localStorage.setItem(key, jsonSys);


    },

    loadGeometries: function (data) {
        $.each(data, function (i, item) {
            //cadM.geometryType=='GeometryCollection'
            if (item.type == 'GeometryCollection') {
                sys.draw.loadGeometries(item.geometries);
            } else if (item.type == 'LineString') {
                sys.draw.drawLine(item.coordinates);
            }
        });

    },


    loadStorage: function () {
        sys.draw.loadRegsByJson('alarmRegion');
        sys.draw.loadRegsByJson('rollcallRegion');
    },

    loadRegsByName: function (keyname) {
        var jsonRCallstr = window.localStorage.getItem(keyname);
        if (jsonRCallstr == null || jsonRCallstr == '') {
            //// map2DFun.getRegInfo("rollcallRegion");
            //if (keyname == 'alarmRegion') {
            //    sys.draw.getRegInfoWL(keyname);     
            //} else if (keyname == 'rollcallRegion') {
            //    sys.draw.getRegInfoDM(keyname);
            //}        
        } else {
            sys.draw.loadRegsByJson(keyname);
        }
    },

    loadRegsByJson: function (keyName) {
        var jsonRCallstr = window.localStorage.getItem(keyName);
        if (jsonRCallstr == null || jsonRCallstr == '') {
        } else {
            // 还原json对象  
            var json = JSON.parse(jsonRCallstr);
            // sys.draw.drawRegByStorage(json);
            $.each(json, function (i, n) {
                sys.draw.drawRegByStorage(JSON.parse(n));
            });
        }

    },
    //读取电子围栏信息
    drawRegByStorage: function (item) {
        var shape = null;
        //if (json != null)
        //    $.each(json, function (i, n) {
        if (item == null)
            return;

        // var item = JSON.parse(n);
        switch (parseInt(item.drawType)) {
            case DRAW_TYPE.CIRCLE:
                shape = sys.draw.draw2DCIRCLE(item.pointList[0], item.pointList[1], item.color, true);
                //if (ismap3D == false)
                //    shape = sys.draw.draw2DCIRCLE(item.pointList[0], item.pointList[1], item.color, true);
                //else
                //    shape = sys.draw.draw3DCIRCLE(item);
                break;
            case DRAW_TYPE.LINE:
                shape = sys.draw.drawObj2DLineString(item.pointList, item.color);
                break;
            case DRAW_TYPE.POLYGON:
                shape = sys.draw.draw2DPOLYGON(item.pointList, item.color);
                //if (ismap3D == false)
                //    shape = sys.draw.draw2DPOLYGON(item.pointList, item.color);
                //else
                //    shape = sys.draw.draw3DPOLYGON(item);
                break;
            case DRAW_TYPE.RECTANGLE:
                shape = sys.draw.draw2DRect(item.pointList[0], item.pointList[1], item.color, true);
                //if (ismap3D == false)
                //    shape = sys.draw.draw2DRect(item.pointList[0], item.pointList[1], item.color, true);
                //else
                //    shape = sys.draw.draw3DRect(item);

                break;
        }
        if (shape == undefined)
            return;

        shape.name = item.id;
        shape.busType = item.busType;
        shape.showname = item.showName;
        shape.EmpNames = item.EmpNames;

        //将区域信息放在缓存中，同时加载列表名称
        if (item.busType == 'alarmRegion') {
            if (ismap3D == false) {
                sys.busi2D.addAlarmReg(item);
            }
            GraphList.add(item);
        } else if (item.busType == 'rollcallRegion') {
            if (ismap3D) { }
            else {
                sys.busi2D.addRollCallReg(item);
            }
            RollCallList.add(item);
        }

        //shape.geometry.computeBoundingBox();//计算包围盒  
        //var shava = shape.boundingBox;



        ///加载到窗体中
        if (ismap3D) {
            // sys.map.AddGroupRegion(shape);
            // groupRegion.add(shape);
            //向3D图形中添加区域信息

            sys.newmap3D.AddObj3DRegs(shape);
            // sys.newmap3D.AddObj3DEmp(shape);
        }
        else {
            // sys.map2D.AddScenne(shape);
            obj2DRegion.add(shape);
        }

        //});

        // if (map3D == "2d") {
        //     //2D中写入缓存  
        //     window.setInterval(function () {
        //         GraphList.saveJson("jsonRegion");
        //     }, 5000);
        // }
    },
    ///画线
    drawLine: function (points) {
        // var color = 0x000099;
        var line = sys.draw.drawObjLineString(points);
        lineGroup.add(line);
    },

    //画圆
    drawCircle: function (points) {
        // var geometry = new THREE.CircleGeometry(5, 32 );
        // var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        // var circle = new THREE.Mesh( geometry, material );
        var color = 0x800080;
        var circle = sys.draw.drawObjLineString(points, color);
        lineGroup.add(circle);
        // scene.add(circle);
    },
    //画折线
    drawPolyline: function (points) {
        var color = 0XFF0000;
        var polyline = sys.draw.drawObjLineString(points, color);
        lineGroup.add(polyline);
        // scene.add(polyline);
    },

    ///创建点模型
    createBoxPoint: function (points) {
        var box = new THREE.BoxGeometry(10, 10, 10);
        var material = new THREE.PointsMaterial({
            color: 0x0000ff,
            size: 10
        });//材质对象
        var mesh = new THREE.Points(box, material);//点模型对象
        mesh.vertices.push(points);
        return mesh;
    },
    ///创建点几个对象
    createGeoPoint: function (points) {
        var geometry = new THREE.Geometry();//声明一个空几何体对象
        geometry.vertices.push(points); //顶点坐标添加到geometry对象
        var material = new THREE.PointsMaterial({
            color: 0x0000ff,
            size: 10.0//点对象像素尺寸
        });//材质对象
        var mesh = new THREE.Points(geometry, material);//点模型对象
        return mesh
    },
    initPoint3d: function (point, color) {
        // 添加圆形
        //var circle = new THREE.Mesh(new THREE.CircleGeometry(1, 20), new THREE.MeshLambertMaterial({ color: 0XFF0033 }));
        var circle = new THREE.Mesh(new THREE.CircleGeometry(10, 20), new THREE.MeshLambertMaterial({ color: color, transparent: true, opacity: 0.6 }));
        circle.position.x = point.X;
        circle.position.y = point.Y;
        circle.position.z = point.Z;
        circle.castShadow = circle.receiveShadow = true;
        //  group.add(circle);
        //  pointsTemp.push(circle);
        return circle;
        //this.scene.add(circle);
    },
    drawObjLineString: function (points, color) {
        //  color = color || 0x000099;

        color = 0xFF8C00;
        // color — 线条的十六进制颜色。缺省值为 0xffffff。
        // linewidth — 线条的宽度。缺省为 1。
        // linecap — 定义线条端点的外观。缺省为 'round'（即圆形线头）。
        // linejoin — 定义线条接口处的外观。缺省为 'round'。
        // vertexColors — 定义顶点如何着色。缺省是 THREE.NoColors。
        // fog — 定义材质颜色是否受全局雾设置的影响。默认是false。
        var material = new THREE.LineBasicMaterial(
            {
                color: color,
                opacity: 1,
                linewidth: 2
            });

        var geometry = new THREE.Geometry();
        $.each(points, function (i, pt) {
            var ps = new Point3D(pt);
            if (ismap3D == true)
                geometry.vertices.push(new THREE.Vector3(ps.X, ps.Y, ps.Z));
            else
                geometry.vertices.push(new THREE.Vector3(ps.X, ps.Y, 0));
        });
        var obj = new THREE.Line(geometry, material);
        // lineGroup.add(obj);
        // obj.rotateX(- Math.PI / 2); //沿X轴方向选中90° 
        return obj;
    },


    drawObj2DLineString: function (points, color) {
        color = color || 0xFFFFF;
        // color — 线条的十六进制颜色。缺省值为 0xffffff。
        // linewidth — 线条的宽度。缺省为 1。（目前该值不起作用）
        // linecap — 定义线条端点的外观。缺省为 'round'（即圆形线头）。
        // linejoin — 定义线条接口处的外观。缺省为 'round'。
        // vertexColors — 定义顶点如何着色。缺省是 THREE.NoColors。
        // fog — 定义材质颜色是否受全局雾设置的影响。默认是false。
        var material = new THREE.LineBasicMaterial({ color: color, linewidth: 100 });
        var geometry = new THREE.Geometry();
        $.each(points, function (i, ps) {
            geometry.vertices.push(ps);
        });
        var obj = new THREE.Line(geometry, material);
        return obj;
    },

    ///画矩形
    draw2DRect: function (pstart, pend, color, isTrue) {

        if (pstart == undefined || pend == undefined)
            return undefined;

        var color = color || 0xFF0033;
        var isTrue = isTrue || false;
        var squareShape = new THREE.Shape();
        squareShape.moveTo(pstart.x, pstart.y);
        squareShape.lineTo(pend.x, pstart.y);
        squareShape.lineTo(pend.x, pend.y);
        squareShape.lineTo(pstart.x, pend.y);
        squareShape.lineTo(pstart.x, pstart.y);
        var mesh = null;
        //画矩形区域
        if (isTrue == true) {
            mesh = sys.draw.addShape(squareShape, color);
        } else {
            //画虚线区域
            mesh = sys.draw.addDottedLineShape(squareShape, color);
        }
        return mesh;
    },

    ///画3D矩形
    draw3DRect: function (drawType) {
        var color = drawType.color || 0xFF0033;
        var pstart = drawType.pointList[0];
        var pend = drawType.pointList[1];
        var squareShape = new THREE.Shape();
        squareShape.moveTo(pstart.x, pstart.y);
        squareShape.lineTo(pend.x, pstart.y);
        squareShape.lineTo(pend.x, pend.y);
        squareShape.lineTo(pstart.x, pend.y);
        squareShape.lineTo(pstart.x, pstart.y);
        return sys.draw.add3DShape(squareShape, color, drawType.extrudeSettings);
    },

    //多边形
    draw2DPOLYGON: function (points, color) {
        if (points.length < 2)
            return null;
        var rectShape = new THREE.Shape();
        var pend = null;
        $.each(points, function (i, ps) {
            if (i == 0) {
                pend = ps;
                rectShape.moveTo(ps.x, ps.y);
            }
            else
                rectShape.lineTo(ps.x, ps.y);

            // geometry.vertices.push(ps);
        });

        rectShape.lineTo(pend.x, pend.y);
        // var geometry = new THREE.ShapeBufferGeometry(rectShape);
        // var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide,opacity:0.2 }));

        return sys.draw.addShape(rectShape, color);
    },
    //画3D多边形
    draw3DPOLYGON: function (drawType) {
        if (drawType.pointList.length < 2)
            return null;
        var rectShape = new THREE.Shape();
        var pend = null;
        $.each(drawType.pointList, function (i, ps) {
            if (i == 0) {
                pend = ps;
                rectShape.moveTo(ps.x, ps.y);
            }
            else
                rectShape.lineTo(ps.x, ps.y);

        });
        rectShape.lineTo(pend.x, pend.y);
        // return sys.draw.addShape(rectShape, color);
        return sys.draw.add3DShape(rectShape, drawType.color, drawType.extrudeSettings);
    },
    addShape: function (shape, color) {
        var geometry = new THREE.ShapeBufferGeometry(shape);

        //sysConfig.regOpacity
        //var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide, transparent: true, opacity: 0.5 }));
        var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide, transparent: true, opacity: sysConfig.regOpacity }));
        return mesh;
    },
    add3DShape: function (shape, color, extrudeSettings) {
        // var geometry = new THREE.ShapeBufferGeometry(shape);
        var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        //var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide, transparent: true, opacity: 0.5 }));
        var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide, transparent: true, opacity: sysConfig.regOpacity }));
        return mesh;
    },
    ///画实线轮廓
    addSolidLineShape: function (shape, color) {
        shape.autoClose = true;
        var points = shape.getPoints();
        var geometryPoints = new THREE.BufferGeometry().setFromPoints(points);

        // 画实线轮廓
        var line = new THREE.Line(geometryPoints, new THREE.LineBasicMaterial({ color: color, linewidth: 0.2 }));
        return line;
    },
    ///画虚线轮廓
    addDottedLineShape: function (shape, color) {
        shape.autoClose = true;
        var spacedPoints = shape.getSpacedPoints(40);
        var geometrySpacedPoints = new THREE.BufferGeometry().setFromPoints(spacedPoints);
        // 画实线轮廓        
        var particles = new THREE.Points(geometrySpacedPoints, new THREE.PointsMaterial({ color: color, size: 0.1 }));
        return particles;
    },
    //圆滑处理的多边形
    draw2DPOLYGON2: function (points, color) {
        var splineShape = new THREE.Shape();
        var pend = null;
        var splinepts = [];
        $.each(points, function (i, ps) {
            if (i == 0) {
                pend = ps;
                splineShape.moveTo(ps.x, ps.y);
            }
            else
                splinepts.push(new THREE.Vector2(ps.x, ps.y));
        });
        splinepts.push(new THREE.Vector2(pend.x, pend.y));
        splineShape.splineThru(splinepts);

        // var geometry = new THREE.ShapeBufferGeometry(splineShape);

        // var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide }));
        // return mesh;
        return sys.draw.addShape(splineShape, color);

    },
    ///2D画圆
    draw2DCIRCLE: function (ps, pe, color, isTrue) {
        var shape = new THREE.Shape();
        var isTrue = isTrue || false;
        var color = color || 0xFF0033;
        //absArc(aX,aY,aRadius,aStartAngle,aEndAngle,aClockwise)：
        // var ps = points[0];
        // var pe = points[1];
        var dis = Math.abs((Math.sqrt((pe.x - ps.x) * (pe.x - ps.x) + (pe.y - ps.y) * (pe.y - ps.y))));
        shape.absarc(ps.x, ps.y, dis, 0, Math.PI * 2);
        if (isTrue == true) {
            return sys.draw.addShape(shape, color);
        } else {
            // return sys.draw.addDottedLineShape(shape, color);
            return sys.draw.addSolidLineShape(shape, color);
        }
    },
    ///3D画圆
    draw3DCIRCLE: function (drawType) {
        var shape = new THREE.Shape();
        // var isTrue = isTrue || false;
        var color = drawType.color || 0xFF0033;
        //absArc(aX,aY,aRadius,aStartAngle,aEndAngle,aClockwise)：
        var ps = drawType.pointList[0];
        var pe = drawType.pointList[1];
        var dis = Math.abs((Math.sqrt((pe.x - ps.x) * (pe.x - ps.x) + (pe.y - ps.y) * (pe.y - ps.y))));
        shape.absarc(ps.x, ps.y, dis, 0, Math.PI * 2);
        return sys.draw.add3DShape(shape, color, drawType.extrudeSettings);
    },

    drawPoints: function (points, color) {
        var geometryPoints = new THREE.BufferGeometry().setFromPoints(points);
        var particles = new THREE.Points(geometryPoints, new THREE.PointsMaterial({ color: color, size: 4 }));
        return particles;
    },

    ///自定义图
    drawShape: function () {
        var shape = new THREE.Shape();

        //将绘图点移动到指定的位置
        shape.moveTo(10, 10);

        //从当前位置画一条线到指定的位置
        shape.lineTo(10, 40);

        //贝塞尔曲线，当前点作为起始点，(15,25) 和 (25,25) 两点决定曲线的曲率，(30,40)作为结束点。
        shape.bezierCurveTo(15, 25, 25, 25, 30, 40);

        //沿着提供的点集绘制一条光滑的曲线。起始点是当前点。
        shape.splineThru(
            [
                new THREE.Vector2(32, 30),
                new THREE.Vector2(28, 20),
                new THREE.Vector2(30, 10)
            ]);

        //二次曲线 (20,15) 决定当前曲线的曲率，(10,10) 曲线的结束点。当前点作为起始点。
        shape.quadraticCurveTo(20, 15, 10, 10);

        var hole1 = new THREE.Path();
        hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true);
        shape.holes.push(hole1);

        var hole2 = new THREE.Path();
        hole2.absellipse(23, 24, 2, 3, 0, Math.PI * 2, true);
        shape.holes.push(hole2);

        var hole3 = new THREE.Path();
        hole3.absarc(20, 16, 2, 0, Math.PI, true);
        shape.holes.push(hole3);

        return shape;
    },
    testLoadShape: function () {
        // var splinepts = [];        

        var shape = new THREE.Shape();
        //absArc(aX,aY,aRadius,aStartAngle,aEndAngle,aClockwise)：
        shape.absarc(0, 0, 10, 0, Math.PI * 2);
        var geometry = new THREE.ShapeGeometry(shape);
        var material = new THREE.MeshLambertMaterial({
            color: 0x0000ff,//三角面颜色
            side: THREE.DoubleSide//两面可见
        });//材质对象
        var mesh = new THREE.Mesh(geometry, material);//网格模型对象
        // scene2D.add(mesh);//网格模型添加到场景中
        sys.draw.AddScene2D(mesh);
    },

    AddScene2D: function (obj) {
        scene2D.add(obj);
    },
    AddlineGroup: function () {

        if (ismap3D) {
            //   sys.newmap3D.AddScene3D(lineGroup);
            sys.MapData.AddScene(lineGroup);
        } else {
            sys.draw.AddScene2D(lineGroup);
        }

    },
    AddtextGroup: function () {
        if (ismap3D) {
            // sys.newmap3D.AddScene3D(textGroup);
            sys.MapData.AddScene(lineGroup);
        } else {
            sys.draw.AddScene2D(textGroup);
        }

    },

    getRegInfoWL: function (key) {

        var oneSelf = [];
        var urlPath = "/Graphic/GetAllReg";
        var strJson = { strKey: key };
        var self = key;
        clientMode.post(urlPath, strJson, function (data) {
            for (var i = 0; i < data.length; i++) {
                oneSelf.push(data[i].DrawAttribute);
            }


            //将区域画在图上
            $.each(oneSelf, function (i, n) {
                var item = JSON.parse(n);
                // self = item.busType
                //只存缓存 不绘图
                sys.draw.drawRegByStorage(item);
                //将区域信息存在客户端缓存中
                GraphList.saveJson(self);


            });



        });

    },

    getRegsInfo: function (key) {

        var oneSelf = [];
        var urlPath = "/Graphic/GetAllReg";
        var strJson = { strKey: key };
        var self = key;
        clientMode.post(urlPath, strJson, function (data) {
            for (var i = 0; i < data.length; i++) {
                oneSelf.push(data[i].DrawJson);
            }
            var jsonstr = JSON.stringify(oneSelf);
            window.localStorage.setItem(key, jsonstr);
        });


    },

    /***********************New3D绘图**********************************/

    createMesh2: function (geom, imageFile) {
        var texture = THREE.ImageUtils.loadTexture(imageFile);
        geom.computeVertexNormals();
        var mat = new THREE.MeshPhongMaterial();
        mat.map = texture;
        if (bump) {
            var bump = THREE.ImageUtils.loadTexture(imageFile);
            mat.bumpMap = bump;
            mat.bumpScale = 0.2;
        }
        var mesh = new THREE.Mesh(geom, mat);
        return mesh;
    },

    createText: function (obj) {
        //   var ps = obj.position;
        //var ps = { X: -20, Y: 90, Z: 0 };
        var ps = { X: -13, Y: 55, Z: 0 };
        var txt = gui.asGeom(obj.tName, ps);
        return txt;
    },

    createRtIcon: function (emp) {
        //var fileMPath = fileParam.empIcon + "emp_12.png";
        var fileMPath = emp.icon;
        var loader = new THREE.TextureLoader();
        var clothTexture = loader.load(fileMPath);
        clothTexture.anisotropy = 16;
        var clothMaterial = new THREE.MeshLambertMaterial({
            map: clothTexture,
            side: THREE.DoubleSide,
            alphaTest: 0.5
        });
        //clothGeometry = new THREE.ParametricGeometry(clothFunction, cloth.w, cloth.h);
        // clothGeometry = new THREE.ParametricGeometry(sys.draw.plane(35, 60), 5, 10);
        clothGeometry = new THREE.ParametricGeometry(sys.draw.plane(19, 33), 5, 10);


        sphere = new THREE.Mesh(clothGeometry, clothMaterial);
        sphere.castShadow = true;
        //object.position.set(0, 0, 0); 
        //scene.add(object);

        var point = emp.position; //new StrToPoint3D(emp.position);
        //  sphere.rotateX(Math.PI / 9); //沿X轴方向选中30°     
        sphere.position.set(point.X, point.Y, 10);
        sphere.name = emp.tagCode;
        // sys.newmap3D.AddObj3DEmp(sphere);

        sphere.customDepthMaterial = new THREE.MeshDepthMaterial({

            depthPacking: THREE.RGBADepthPacking,
            map: clothTexture,
            alphaTest: 0.5

        });

        var txt = sys.draw.createText(emp);
        txt.name = emp.tagCode;
        sphere.add(txt);

        return sphere;
        //var time = Date.now();
        //simulate(time);
    },




    plane: function (width, height) {
        return function (u, v, optionalTarget) {
            var result = optionalTarget || new THREE.Vector3();
            var x = (u - 0.5) * width;
            var y = (v + 0.5) * height;
            var z = 0;
            return result.set(x, y, z);
        };

    },


}