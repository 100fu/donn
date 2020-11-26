var plan3D, plan3D2; //3D地图存储模块
var planObj = {};
var rtLocTags = {};
var TagList = [];
var mapW = sysConfig.mapWidth;
var mapH = sysConfig.mapHeight;
var wallW = 5, wallH = 30, pillarW = 20, pillarH = 100, diffPillar = 7, diffWall = 34, diffFloorHeight = -1, floorHeight = floorHeightbs+20; // floorHeight = -480;
var diffpillarH = pillarH / 2 - 30;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var pillarPic = fileParam.img_path + '/grid.png';
var wallPic = fileParam.img_path + '/rocks.jpg';

map3DLayer = {

    LoadMap: function () {
        localStorage.clear();
        map3DLayer.loadTagList();
        //加载配置文件
        //sys.draw.initSysConfig();
        sys.MapData.initFont();
        sys.MapData.initThree3D();
        sys.MapData.initScene3D();
        sys.MapData.initCamera3D();
        sys.MapData.initOrbit3D();
        sys.MapData.initLight3D();
        // sys.MapData.initSky();
        sys.MapData.initPhysics();

        //接收Mqtt数据
        map3DLayer.startReadMes();

        sys.MapData.initObjMtl();

        setTimeout(function () {
            // sys.draw.initMap("3d");
            //  map3DLayer.loadOneFloor();
            map3DLayer.loadFloor(1);
            //  sys.draw.loadStation();
            //
            map3DLayer.rtLocTagShow();
            //map3DLayer.loadObjMtl();
        }, 5000);

        window.onresize = sys.MapData.onWindowResize;

        sys.MapData.animate();
        window.addEventListener('mousemove', map3DLayer.onDocumentMouseMove, false);
        window.addEventListener('mousedown', map3DLayer.onDocumentMouseDown, false);
        $("btnfirst").toggle(
            function () { sys.MapData.initFirstOrbit3D(); },
            function () { sys.MapData.initFirstOrbit3D(); }
        );
    },

    loadObjMtl:function()
    {
        let objList = [{ name: 'fangzi1', ps: { x: 0, y: 0, z: 0 } }, { name: 'ta', ps: { x: 620, y: 780, z: 10 } }];
        objList.forEach((obj) => {
            objMtl.loadObjMtl(obj.name);
            //let objmtl = objMtl.objmesh;
            //objmtl.position.x = obj.ps.x;
            //objmtl.position.y = obj.ps.y;
            //objmtl.position.z = obj.ps.z;
        });

    },
    loadOneFloor: function () {

        let plan3DMode = sys.draw.initMapJPG();
        plan3DMode.rotateX(- Math.PI / 2);
        plan3DMode.position.y = 0;
        sys.MapData.AddScene(plan3DMode);
        let strTxt = "一楼一楼哦";
        map3DLayer.CreateWall(strTxt, 0);
        map3DLayer.CreatePillar(0);


    },
    //fileParam.img_path
    CreatePillar: function (height, floor) {
        let cubeLeftBotton = drawmap3Dcli.createBoxGeometry(pillarW, pillarH, pillarW, 1, pillarPic);
        cubeLeftBotton.position.x = -(mapW / 2 - diffPillar);
        cubeLeftBotton.position.y = height;
        cubeLeftBotton.position.z = mapH / 2 - diffPillar;
        cubeLeftBotton.name = 'Pillar';
        cubeLeftBotton.objType = 'Pillar';
        cubeLeftBotton.floor = floor;
        sys.MapData.AddScene(cubeLeftBotton);

        let cubeLeftUp = drawmap3Dcli.createBoxGeometry(pillarW, pillarH, pillarW, 1, pillarPic);
        cubeLeftUp.position.x = -(mapW / 2 - diffPillar);
        cubeLeftUp.position.y = height;
        cubeLeftUp.position.z = -(mapH / 2 - diffPillar);

        cubeLeftUp.name = 'Pillar';
        cubeLeftUp.objType = 'Pillar';
        cubeLeftUp.floor = floor;
        sys.MapData.AddScene(cubeLeftUp);


        let cubeRightBotton = drawmap3Dcli.createBoxGeometry(pillarW, pillarH, pillarW, 1, pillarPic);
        cubeRightBotton.position.x = (mapW / 2 - diffPillar);
        cubeRightBotton.position.y = height;
        cubeRightBotton.position.z = mapH / 2 - diffPillar;

        cubeRightBotton.name = 'Pillar';
        cubeRightBotton.objType = 'Pillar';
        cubeRightBotton.floor = floor;
        sys.MapData.AddScene(cubeRightBotton);


        let cubeRightUp = drawmap3Dcli.createBoxGeometry(pillarW, pillarH, pillarW, 1, pillarPic);
        cubeRightUp.position.x = (mapW / 2 - diffPillar);
        cubeRightUp.position.y = height;
        cubeRightUp.position.z = -(mapH / 2 - diffPillar);

        cubeRightUp.name = 'Pillar';
        cubeRightUp.objType = 'Pillar';
        cubeRightUp.floor = floor;
        sys.MapData.AddScene(cubeRightUp);


    },
    CreateWall: function (strTxt, height, floor) {
        // let mapW = sysConfig.mapWidth;
        // let mapH = sysConfig.mapHeight;

        ///长边围墙
        let cubeBotton = drawmap3Dcli.createBoxGeometry((mapW - diffWall), wallH, wallW);
        cubeBotton.position.x = 0;
        cubeBotton.position.y = height;
        cubeBotton.position.z = mapH / 2;
        cubeBotton.name = 'wall';
        cubeBotton.objType = 'wall';
        cubeBotton.floor = floor;
        var ps = { X: 0, Y: 0, Z: 3 };

        var txt = sys.MapData.createText(strTxt, ps);
        cubeBotton.add(txt);
        sys.MapData.AddScene(cubeBotton);

        let cubeUp = drawmap3Dcli.createBoxGeometry((mapW - diffWall), wallH, wallW);
        cubeUp.position.x = 0;
        cubeUp.position.y = height;
        cubeUp.position.z = -mapH / 2;
        cubeUp.name = 'wall';
        cubeUp.objType = 'wall';
        cubeUp.floor = floor;
        ps = { X: 0, Y: 0, Z: -3 };
        txt = sys.MapData.createText(strTxt, ps);
        txt.rotateY(- Math.PI);
        cubeUp.add(txt);
        sys.MapData.AddScene(cubeUp);

        ///短边围墙
        let cuberight = drawmap3Dcli.createBoxGeometry(wallW, wallH, (mapH - diffWall));
        cuberight.position.x = mapW / 2;
        cuberight.position.y = height;
        cuberight.position.z = 0;
        cuberight.name = 'wall';
        cuberight.objType = 'wall';
        cuberight.floor = floor;
        ps = { X: 3, Y: 0, Z: 0 };
        txt = sys.MapData.createText(strTxt, ps);
        txt.rotateY(Math.PI / 2);
        cuberight.add(txt);

        sys.MapData.AddScene(cuberight);


        let cubeLeft = drawmap3Dcli.createBoxGeometry(wallW, wallH, (mapH - diffWall));
        cubeLeft.position.x = -mapW / 2;
        cubeLeft.position.y = height;
        cubeLeft.position.z = 0;
        cubeLeft.name = 'wall';
        cubeLeft.objType = 'wall';
        cubeLeft.floor = floor;
        ps = { X: -3, Y: 0, Z: 0 };
        txt = sys.MapData.createText(strTxt, ps);
        txt.rotateY(-Math.PI / 2);
        cubeLeft.add(txt);

        sys.MapData.AddScene(cubeLeft);
    },

    loadFloor: function (floor) {
        // let floor=2;
        for (let i = 0; i < floor; i++) {
            let plan3DMode = drawmap3Dcli.initMapJPG();  //sys.draw.initMapJPG();
            plan3DMode.rotateX(- Math.PI / 2);
            plan3DMode.position.y = floorHeight + i * 100;
            sys.MapData.AddScene(plan3DMode);
        
            //let objStalist = new THREE.Object3D(); 
            //objStalist.rotateX(- Math.PI / 2);
            //plan3DMode.add(objStalist);
            planObj[i + 1] = plan3DMode;

            map3DLayer.loadStation(plan3DMode, (i + 1));

            objMtl.loadObjMtl('fangzi1', { x: -200, y: 100, z: 22 }, '办公楼', plan3DMode); //fangzi2
            objMtl.loadObjMtl('fangzi2', { x: 100, y: -300, z: 22 }, '办公楼2', plan3DMode); 
            let line = map3DLayer.createLineTest();
            plan3DMode.add(line);

            let strTxt = "第" + (i + 1) + "层楼";
            map3DLayer.CreateWall(strTxt, floorHeight + (i * 100) + diffFloorHeight, (i + 1));
            map3DLayer.CreatePillar(floorHeight + (i * 100) + diffFloorHeight + diffpillarH);

        }

        // let plan3DTop= sys.draw.initMapJPG("/Scripts/images/floor.jpg");
        // plan3DTop.rotateX(- Math.PI / 2);
        // plan3DTop.position.y =floorHeight+floor * 100 ;// -(pillarH/2);
        // sys.MapData.AddScene(plan3DTop);


    },

    createLineTest: function()
    {
        let linePs = [];
        let p1 = new THREE.Vector3(0, 0, 0);
        linePs.push(p1);
        let p2 = new THREE.Vector3(-1200,10,0);
        linePs.push(p2);

        let p3 = new THREE.Vector3(0, 100, 0);
        linePs.push(p3);

        let p4 = new THREE.Vector3(800, 100, 0);
        linePs.push(p4);

        let line = drawmap3Dcli.createLine(linePs, 0xFF0000);

        return line;
    },
    ///鼠标移动事件
    onDocumentMouseMove: function (event) {
        event.preventDefault();
        mouse.x = (event.clientX / SCREEN_WIDTH) * 2 - 1;
        mouse.y = -(event.clientY / SCREEN_HEIGHT) * 2 + 1;

        // 把屏幕坐标转成 three.js 三维坐标
        var mouse3d = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        mouse3d.unproject(camera);
        var dir = mouse3d.sub(camera.position).normalize();
        var distance = -camera.position.z / dir.z;
        var pos3d = camera.position.clone().add(dir.multiplyScalar(distance));

    },

    ///鼠标按下事件
    onDocumentMouseDown: function (event) {
        event.preventDefault();
        if (event.target.tagName != 'CANVAS')
            return;
        raycaster.setFromCamera(mouse, camera);
        // var intersects = raycaster.intersectObjects(scene.getObjectByName('wall'), 
        // 	false);

        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length < 1) {
            //highlightBox.visible = false;
            // alert('wall');
            return;
        } else {

            var intersected = intersects[0].object;
            if (intersected.name == 'wall') {
              
               // window.location.href = 'New3DMap.html';
            }


        }


    },



    /**********************接入实时数据*start*************************************/

    rtLocTagShow: function () {
        setInterval(function () {
            for (var n in rtLocTags) {
                map3DLayer.onRtMessageShow(rtLocTags[n]);
            }
        }, 40);
    },

    onRtMessageShow: function (item) {
        let rtPoint = { x: Number(item.X) + Number(tranX), y: Number(item.Y) + Number(tranY), z: 1 };
        let rtMes = null;
        $.each(TagList, function (i, tag) {
            if (tag.tagCode == item.UniqueId) {
                rtMes = tag;
            }
        });

        if (rtMes != null) {
            rtMes.position = rtPoint;
            ////部门过滤
            //if (showChkRtEmp.length > 0) {
            //    if ($.inArray(rtMes.tagCode, showChkRtEmp) != -1) {
            //        mapNew3D.addRtEmpObjOnMap(rtMes);
            //    }
            //} else {
            //    mapNew3D.addRtEmpObjOnMap(rtMes);
            //}         

            if (rtMes.tName != "") {
                if (rtMes.useState != 0)
                    map3DLayer.addRtMapEmp(rtMes);
            }
        }
    },

    addRtMapEmp(emp) {
        // var emp = { tName: item.EmpInfo.Name, tCode: item.EmpInfo.Code, tagCode: item.TagNo, position: new Point3D_CM(item.RtPoint), PrePoint: new Point3D_CM(item.PrePoint), icon: fileParam.empIcon + 'emp_4.png' };
        let floor = emp.position.z;
        let isHave = sys.MapData.IsExistEmpObj3D(planObj[floor],emp);
        //没有就添加
        if (isHave == false) {
            ///不存在就添加位置信息
            if (emp.useState == 1) {
                emp.icon = fileParam.empIcon + 'emp_4.png';
           
            }
            else if (emp.useState == 2) {
                emp.icon = fileParam.devIcon + 'dev_01.png';
            }
         //   var empIcon = sys.draw.createRtIcon(emp);
            var empIcon = drawmap3Dcli.createSphereGeometry(emp.position);    //sys.draw.createRtIcon(emp);
            empIcon.objType = 'emp';
            empIcon.useState = emp.useState; //1-人员，2-车辆
            empIcon.drawcolor = Math.random() * 0xffffff; //随机色
            empIcon.trackList = []; //实时轨迹集合
            empIcon.showName = emp.tName;//人员姓名
            empIcon.showTrack = false;
            empIcon.name = emp.tagCode;  //人员标签号
            empIcon.deptid = emp.deptid;  //人员部门Id
            let txt = sys.MapData.createTextSphere(emp.tName);
            txt.name = emp.tagCode;
            empIcon.add(txt);
          //  empIcon.PrePoint = new THREE.Vector3(emp.position.x, emp.position.y, emp.position.z);
            //czlt-20180408 添加到地图plan中
            planObj[floor].add(empIcon);
        } else {
            sys.MapData.changeEmpPosition(planObj[floor],emp.tagCode, emp.position);
           // sys.newmap3D.changeEmpPosition(emp.tagCode, emp.position);
        }
    },
    startReadMes: function () {

        var host = mqttConfig.Server;// 'mqtt.dev.portsys.cn';//$("#connect_host").val();
        var port = mqttConfig.Port;//$("#connect_port").val();
        var clientId = new Date().getTime().toString(); //$("#connect_clientId").val();
        var user = mqttConfig.UserId; // $("#connect_user").val();
        var password = mqttConfig.Password;// $("#connect_password").val();


        let destination = mqttConfig.rtPs; // rpm/sfloc 
        let mqttClient = new Messaging.Client(host, Number(port), clientId);
        mqttClient.onConnect = () => { mqttClient.subscribe(destination); };
        mqttClient.onMessageArrived = map3DLayer.onRtMessage;
        mqttClient.onConnectionLost = map3DLayer.onConnectionLost;
        mqttClient.connect({
            userName: user,
            password: password,
            onSuccess: () => {
                console.log('mqtt connected successFull.');
                mqttClient.subscribe(destination);
            },
            onFailure: () => {
                console.log('mqtt failure  onFailure');
            }
        });

    },
    onRtMessage: function (event) {

        var rtEmpMsg = '[' + event.payloadString + ']';
        var rtList = JSON.parse(rtEmpMsg);
        rtList.forEach((item) => {
            rtLocTags[item.UniqueId] = item;

        })
    },
    onConnectionLost: function () {
        //  console.log('mqtt failure!! reStart!!');
        map3DLayer.startReadMes();
    },

    //loadTagList: function () {
    //    var urlPath = '/Graphic/GetTagAllInfo';  //GetTagAllInfo
    //    clientMode.post(urlPath, null, function (data) {
    //        if (data.length > 0) {
    //            TagList = [];
    //            $.each(data, function (i, rtMes) {
    //                // var empName = tagNew.EmpInfo != null ? tagNew.EmpInfo.Name : (tagNew.DevInfo != null ? tagNew.DevInfo.Name : "");
    //                // var empCode = tagNew.EmpInfo != null ? tagNew.EmpInfo.Code : (tagNew.DevInfo != null ? tagNew.DevInfo.Code : "");
    //                var deptId = rtMes.EmpInfo != null ? rtMes.EmpInfo.IdDepartment : (rtMes.DevInfo != null ? rtMes.DevInfo.IdDepartment : "");
    //                if (rtMes.TName != null) {
    //                    var tag = { tName: rtMes.TName, tCode: rtMes.TagNo, tagCode: rtMes.TagNo, deptid: deptId, useState: rtMes.TagState };
    //                    TagList.push(tag);
    //                }
    //            });
    //        }
    //    });
    //},
    loadTagList: function () {
        var urlPath = '/Graphic/GetTagAllInfo';  //GetTagAllInfo
        clientMode.post(urlPath, null, function (data) {
            if (data.length > 0) {
                TagList = [];
                $.each(data, function (i, rtMes) {
                    // var empName = tagNew.EmpInfo !== null ? tagNew.EmpInfo.Name : (tagNew.DevInfo !== null ? tagNew.DevInfo.Name : "");
                    // var empCode = tagNew.EmpInfo !== null ? tagNew.EmpInfo.Code : (tagNew.DevInfo !== null ? tagNew.DevInfo.Code : "");
                    let deptId = rtMes.EmpInfo !== null ? rtMes.EmpInfo.IdDepartment : (rtMes.DevInfo !== null ? rtMes.DevInfo.IdDepartment : "");
                    let tel = rtMes.EmpInfo !== null ? rtMes.EmpInfo.Telephone : (rtMes.DevInfo !== null ? rtMes.DevInfo.DriverTel : "");
                    let objNum = rtMes.EmpInfo !== null ? rtMes.EmpInfo.Code : (rtMes.DevInfo !== null ? rtMes.DevInfo.Code : "");
                    let remark = rtMes.EmpInfo !== null ? rtMes.EmpInfo.Description : (rtMes.DevInfo !== null ? rtMes.DevInfo.Description : "");
                    //description
                    if (rtMes.TName !== null) {
                        var tag = { tName: rtMes.TName, tCode: rtMes.TagNo, tagCode: rtMes.TagNo, deptid: deptId, useState: rtMes.TagState, tel: (tel !== null ? tel : ""), objNum: (objNum !== null ? objNum : ""), remark: (remark !== null ? remark : "") };
                        TagList.push(tag);
                    }
                });
            }
        });
    },

    loadStation: function (planMap3D, floor) {
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
                           // let sta = drawmap3Dcli.createCylinder();
                           // sta.objType = 'sta';                  
                           // sta.staId = item.Id;
                           // sta.floor = floor;
                           // sta.position.set((psNew.X), (psNew.Y), (staHeight / 2));
                           //// let strTxt = "基站名称12345456";
                            var staTxt = sys.MapData.createText(item.Name, psNew);
                            staTxt.position.set((psNew.X), (psNew.Y), (2.4*staHeight));
                            staTxt.rotateX(Math.PI / 2);
                            selfPlan.add(staTxt);                         
                            // sys.MapData.AddScene(sta);                     

                            objMtl.loadObjMtl('ta', { x: psNew.X, y: psNew.Y, z: staHeight }, item.Name, selfPlan);
                            
                            //
                            //sys.MapData.AddObj3DList(sta);

                        }
                    }
                });
            }
        });

       // objMtl.loadObjMtl('ta', { x: 0, y: 0, z: 0 }, 'testObj', selfPlan);
       
    },
    /**********************接入实时数据*End*************************************/


}