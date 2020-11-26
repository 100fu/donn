
//if (!Detector.webgl) Detector.addGetWebGLMessage();
var sys = sys || {};
var AcDbLine = null;  //线集合
var AcDbPolyline = null; //折线集合
var AcDbCircle = null; //圆集合
var AcDbMText = null; //文本集合
var GraphList = null, RollCallList = null, AttendRegList; //2D区域缓存空间
//alarmRegion-报警区域设，rollcallRegion-点名区域
var regionDraw = '';
var lineGroup = null;
var textGroup = null;
var isLoad = false, isBackOk = false;
var ismap3D = true;
var imgMap2d;
//factorylayout2018
//var tranX=-1250,tranY=-300;

//donn20180301
//var tranX = -280, tranY = 400;
var tranX = -420, tranY = -600;
var GridSize = 8000, GridStep = 100;
///多楼层配置集合
var SysConfingList = [];


// var SysConfig={    
//     loadMap={type:1,filename:'1.png'},
//     empParam={openness:2,normal:'2.png',alarm:'3.png',eleLow:'4.png'},
//     deviceParam={openness:2,normal:'2.png',alarm:'3.png',eleLow:'4.png',fault:'5.png'},
//     alarmReg={openness:2,normal:'#FFFFFF',alarm:'#FFFFFF'},
//     rollcallReg={openness:2,normal:'#FFFFFF',alarm:'#FFFFFF'},
//     isShowAlarmReg:1,
//     isShowRollcallReg:1,
//     isShowStation:1,
//     isShowVideo:1,


// };
/**
 * Represents the document type.
 * 
 * @enum
 */
var DRAW_TYPE = {
    LINE: 1,//线
    POLYGON: 2,//多边形
    RECTANGLE: 3,//矩形
    CIRCLE: 4 //圆
};
// '<div id="local">'
var seachRtHtml = '<select id="selectid" name="province"></select>'
    + ' <input class="text" id="txtsel" size="25" style="width: 135px;" type="text">'
    + ' <a class="btn btn-primary" id="selectFind" style="border-radius: 0px;padding: 2px 3px;height:20px" href="#"><i class="fa fa-search fa-lg"></i>搜索</a>'

var seachRtHisHtml = '<select id="selectid" name="province"></select>'
    + ' <input class="text" id="txtsel" size="25" style="width: 135px;" type="text">'
    + ' <a class="btn btn-primary" id="selectFind" style="border-radius: 0px;padding: 2px 3px;height:20px" href="#"><i class="fa fa-search fa-lg"></i>搜索</a><input class="" id="chkTrack" type="checkbox">是否显示轨迹'
    + '<input type="text" onfocus="WdatePicker({ maxDate: "#F{$dp.$D(\'logmax\')||\'%y-%M-%d %HH:%mm:%ss\'}", dateFmt: "yyyy-MM-dd HH:mm:ss" })" id="logmin" class="input-text Wdate" style="width:165px;"> -'
    + '<input type="text" onfocus="WdatePicker({ minDate: "#F{$dp.$D(\'logmin\')}", maxDate: "%y-%M-%d", dateFmt: "yyyy-MM-dd HH:mm:ss" })" id="logmax" class="input-text Wdate" style="width:165px;"> '
//+ '</div>';
//var radHtmlMode = '<ul id="sysconfig_list_ul" class="list">'
//+ '<li class="list_item active" id="_li0" style="border-radius: 10px 10px 0px 0px;"><a>系统设置</a></li>'
//+ '<li class="list_item active" id="_li0" style="border-radius: 10px 10px 0px 0px;"><a>系统设置</a></li>'
//+ '</ul>';

//var sysHtmlMode = '<div id="sys_list" class="rttableStyle"><table class="ttr" width="100%">'
var sysHtml = '<table class="ttr" width="100% " id="able">'
    + '<tr class="trFirst"><td class="tdFirst" colspan="2" id="sett"><span style="float:left;padding-left:5px;margin-top: 4px;">系统设置</span><i id="itu" onclick="sys.busi2D.close()" class="fa fa-times fa-lg" aria-hidden="true"></i></td></tr>'

    + '</table>'
var sysSave = '<div id="message"></div><div id="s_input"><input id="s_button"  type="button" value="保存" onclick="sys.busi2D.ysave()"></div>';

var sysHtmlMode = '<table class="ttr" width="100%" id="able">'
    //+ '<tr class="trFirst"><td class="tdFirst" colspan="2" id="sett">系统设置</td></tr>'
    + '<tr class="trMode"><td class="tdMode" colspan="2">底图设置</td></tr>'
    + '<tr class="trMode"><td class="tdMode1"></td><td class="tdMode2"><input type="radio" id="jpg" name="map" onchange="sys.busi2D.radioChange()" value="jpg">.jpg <input type="radio" id="png" name="map" onchange="sys.busi2D.radioChange()" value="png">.png<input type="radio" id="dxf" name="map" onchange="sys.busi2D.radioChange()" value="dxf">.dxf</td></tr>'
    + '<tr class="trMode"><td class="tdMode1"></td><td class="tdMode2">    <label id="idmapPath" onclick="sys.busi2D.labelOnClick()">2dmap.jpg</label> <input type="file" id="fileMaptype" onchange="map2DFun.sendFileMap()"  accept="" style="display:none"></td></tr>'
    + '<tr class="trMode"><td class="tdMode" colspan="2">底图纠偏值(cm)</td></tr>'
    + '<tr class="trMode"><td class="tdMode1"></td><td class="tdMode2">X:<input type="text" onchange="map2DFun.onDiffXChange()"   id="diffX" class="diff_text">Y:<input type="text" onchange="map2DFun.onDiffYChange()"  id="diffY" class="diff_text"></td></tr>'

    + '<tr class="trMode"><td class="tdMode" colspan="2">底图大小设置(cm)</td></tr>'
    + '<tr class="trMode"><td class="tdMode1"></td><td class="tdMode2">W:<input type="text" onchange="map2DFun.onMapWHChange()"   id="mapWidth" class="diff_text">H:<input type="text" onchange="map2DFun.onMapWHChange()"  id="mapHeight" class="diff_text"></td></tr>'

    + '<tr class="trMode"><td class="tdMode" colspan="2">电子围栏区域颜色</td></tr>'
    + '<tr class="trMode"><td class="tdMode1"></td><td class="tdMode2">正常:<input type="color" onchange="map2DFun.onANColorChange()" id="aRegNormal" class="favcolor">报警:<input type="color" onchange="map2DFun.onAAColorChange()"  id="aRegAlarm" class="favcolor"></td></tr>'
    + '<tr class="trMode"><td class="tdMode" colspan="2">电子点名区域颜色</td></tr>'
    + '<tr class="trMode"><td class="tdMode1"></td><td class="tdMode2">正常:<input type="color" onchange="map2DFun.onRNColorChange()"  id="rRegNormal" class="favcolor">报警:<input type="color"  onchange="map2DFun.onRAColorChange()"  id="rRegAlarm" class="favcolor"></td></tr>'
    + '<tr class="trMode"><td class="tdMode" colspan="2">车辆图标</td></tr>'
    + '<tr class="trMode"><td class="tdMode1"></td><td class="tdMode2" style="float:left">                    <button id="idUpDev" class="submitDev">提交</button><font size="1" face="verdana" color="blue">依次为正常，报警</font><br /><div id="uploadDev" style="height:50px" ></div></td></tr>'
    + '<tr class="trMode"><td class="tdMode" colspan="2">人员图标</td></tr>'
    + '<tr class="trMode"><td class="tdMode1"></td><td class="tdMode2" style="float:left">                    <button id="idUpEmp" class="submitEmp">提交</button><font size="1" face="verdana" color="blue">依次为正常，报警</font><br /><div id="uploadEmp" style="height:50px" ></div></td></tr>'
    + '<tr class="trMode"><td class="tdMode" colspan="2">区域透明度:<input type="text" onchange="map2DFun.ontextChange()" id="opacityReg" class="diff_text">(1%-100%)</td></tr>'
    + '<tr class="trMode"><td class="tdMode" colspan="2">是否显示基站:<input type="checkbox" onchange="map2DFun.onChkStationchange()"  name="chk" id="isShowStation" /></td></tr>'
    + '<tr class="trMode"><td class="tdMode" colspan="2">是否显示摄像头:<input type="checkbox" onchange="map2DFun.onChkchange()" name="chk" id="isShowView" /></td></tr>'
    + '<tr class="trMode"><td class="tdMode" colspan="2">是否显示网格:<input type="checkbox" onchange="map2DFun.onChkGridchange()"  name="chk" id="isShowGrid" /></td></tr>'
    + '</table>';



//paginationClick: function (num_entries, pageCount, pageselectCallback) {
//    everyPageCount = pageCount;
//    $("#Pagination").pagination(num_entries, {
//        num_edge_entries: 1, //边缘页数
//        num_display_entries: 4, //主体页数
//        callback: eval(pageselectCallback),
//        items_per_page: pageCount, //每页显示1项
//        current_page: (pagingFindMode.indexPage - 1), //被初始化时显示哪一页。Default: 0
//        prev_text: "上一页",
//        next_text: "下一页"
//    });
//},
function selectOnClick(slectCallback) {
    var selType = $("#selectid").val();
    if (selType == "0") {
        layer.msg('请选择查询方式...', { icon: 5, time: 3000 });
        return;
    }
    var txtsel = $("#txtsel").val();//txtsel
    if (txtsel == "") {
        var strMes = "";
        if (selType == "1") {
            strMes = "标签号不能为空...";
        } else if (selType == "2") {
            strMes = "名称不能为空...";
        }
        layer.msg(strMes, { icon: 5, time: 3000 });
        return;
    }
    slectCallback(selType, txtsel);
};

///回调方法
function funcallback(callback) {
    callback();
};
function funcallbackvalue(callback, value) {
    callback(value);
};
function funcallbackValue3(callback, v1, v2, v3) {
    callback(v1, v2, v3);
};


function isNum(num) {
    var reg = /^[0-9]+.?[0-9]*$/;
    if (!reg.test(num)) {
        return false;
    }
    return true;
}
var sysConfig = {
    mapType: '2',//1.dxf,2.jpg,3.png
    mapName: 'OLYMap20182.jpg',//全路径名称
    mapTranX: -420,
    mapTranY: -600, //0x1A75FF 
    regColor: { normal: 0X7CFC00, alarm: 0xFFB6C1 },
    rcallColor: { normal: 0x0000FF, alarm: 0xFFB6C1 },
    devIcon: '',//路径
    empIcon: '',//路径
    regOpacity: 0.5,
    isShowStation: 0,//是否显示基站 0-不显示 1-显示
    isShowVideo: 0,//是否显示摄像头 0-不显示 1-显示
    isShowGrid: 1,//是否显示网格线 0-不显示 1-显示
    mapWidth: 1500,  //图片容器的宽度
    mapHeight: 1200, //图片容器的高度
    floor: '',//楼层
};



var fileParam = {
    img_path: '/RPM/3DJS/Scripts/images',
    json_path: '/RPM/3DJS/Scripts/json',
    mtl_base_path: 'Scripts/images/obj/',
    sysConfig_path: '/RPM/3DJS/Scripts/json/SysConfig.json',
    sysRegWL_path: '/RPM/3DJS/Scripts/json/alarmRegion.json',
    sysRegDM_path: '/RPM/3DJS/Scripts/json/rollcallRegion.json',
    devIcon: '/RPM/3DJS/Scripts/images/dev_pic/',
    empIcon: '/RPM/3DJS/Scripts/images/emp_pic/',
    sysMap_path: '/RPM/3DJS/Scripts/json/',
    fontGB2312json_path: './Scripts/json/FangSong_GB2312_Regular.json',
    mapjsonPath: '/RPM/3DJS/Scripts/json/donn20180301.json',
    mapJpgPath: '/RPM/3DJS/Scripts/images/map2d0309.jpg',
    objmtlPath: '/RPM/3DJS/Scripts/obj/',

    alarmRegName: 'alarmRegion', //电子围栏区域缓存键值名称
    rollcallRegName: 'rollcallRegion',//电子点名区域缓存键值名称

    Text: "",
    getImg: function (fileName, Folder) {
        var Folder = Folder || '';
        if (Folder == '') {
            return fileParam.img_path + '/' + fileName;
        } else {
            return fileParam.img_path + '/' + Folder + '/' + fileName;
        }
    },
    getJson: function (fileName) {
        return fileParam.json_path + '/' + fileName;
    }
};

function LayerInfo() {
    this.mapType = "2",//1.dxf,2.jpg,3.png
        this.mapName = "fushitu.jpg",//全路径名称
        this.mapTranX = -420,
        this.mapTranY = -600, //0x1A75FF 
        this.regColor = { normal: 0X7CFC00, alarm: 0xFFB6C1 },
        this.rcallColor = { normal: 0x0000FF, alarm: 0xFFB6C1 },
        this.devIcon = "",//路径
        this.empIcon = "",//路径
        this.regOpacity = 0.5,
        this.isShowStation = 0,//是否显示基站 0-不显示 1-显示
        this.isShowVideo = 0,//是否显示摄像头 0-不显示 1-显示
        this.isShowGrid = 1,//是否显示网格线 0-不显示 1-显示
        this.mapWidth = 1500,  //图片容器的宽度
        this.mapHeight = 1200, //图片容器的高度
        this.floor = "",//楼层
        this.attRegColor = { normal: 0X8000ff, alarm: 0xFFB6C1 }//考勤区域
};
///画线的属性
function DrawParam() {
    this.name = "",
        this.showName = "",//显示的名称
        this.busType = "",//业务类型
        this.id = "",
        this.drawType = DRAW_TYPE,
        this.pointList = [],
        this.color = 0x00CC00,
        this.text = "",
        this.size = 1, //宽度
        this.isVisible = true
    this.extrudeSettings = { amount: 10, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 1, bevelThickness: 1 };

    /*********extrudeSettings 属性说明***********
     * curveSegments — int. 曲线上点的个数
        steps — int. 用于细分拉伸的样条段数量
        amount — int. 拉伸形状的深度
        bevelEnabled — bool. 打开斜面
        bevelThickness — float. 在原来的形状里面弄多深的斜面
        bevelSize — float. 斜面离形状轮廓的距离
        bevelSegments — int. 斜面层的数量
        extrudePath — THREE.CurvePath. 沿3D样条路径拉伸形状. (创建帧（如果帧没有定义))
        frames — THREE.TubeGeometry.FrenetFrames. 包含切线、法线、副法线的数组
        material — int. 前面和后面的材质索引号
        extrudeMaterial — int. 拉伸或斜化面的材质索引号
        UVGenerator — Object. 提供UV生成器各功能的对象
     */
};
function getId(points) {
    if (points.length > 1) {
        return points[0].x + ',' + points[0].y + ',0;' + points[1].x + ',' + points[1].y + ",0"
    } else {
        return points[0].x + ',' + points[0].y + ',0';
    }
};
function isHaveLayer(obj) {
    let ishave = false;
    for (var i = 0; i < SysConfingList.length; i++) {
        if (this.SysConfingList[i].floor === obj) {
            ishave = true;
        }
    }
    return ishave;
};
function getLayerByName(obj) {

    let lay = undefined;
    if (obj === "") {
        lay = this.SysConfingList[0];
        curFloor = lay.floor;
    } else {
        for (var i = 0; i < SysConfingList.length; i++) {
            if (this.SysConfingList[i].floor === obj) {
                lay = this.SysConfingList[i];
            }
        }
    }
    return lay;
};
function ArrayList() {
    this.arr = [],
        this.size = function () {
            return this.arr.length;
        },
        this.add = function (obj) {
            this.arr.push(obj);
            return this;
        },

        this.get = function (index) {
            return this.arr[index];
        },
        this.removeIndex = function (index) {
            this.arr.splice(index, 1);
        },
        this.removeObj = function (obj) {
            this.removeIndex(this.indexOf(obj));
        },
        this.updateObj = function (obj) {
            for (var i = 0; i < this.arr.length; i++) {
                if (this.arr[i].id == obj.id) {
                    this.arr[i] = obj;
                }
            }
        },


        this.removeByName = function (name) {
            var index = -1;
            for (var i = 0; i < this.arr.length; i++) {
                if (this.arr[i].id === name) {
                    index = i;
                };
            }
            if (index != -1)
                this.removeIndex(index);
        },
        this.indexOf = function (obj) {
            for (var i = 0; i < this.arr.length; i++) {
                if (this.arr[i] === obj) {
                    return i;
                };
            }
            return -1;
        },
        this.isEmpty = function () {
            return this.arr.length == 0;
        },
        this.clearList = function () {
            this.arr = [];
        },
        this.contains = function (obj) {
            return this.indexOf(obj) != -1;
        },
        this.toString = function () {
            var strJson = '';
            for (var i = 0; i < this.arr.length; i++) {
                if (strJson != '')
                    strJson += '&';
                strJson += JSON.stringify(this.arr[i]);
            }
            return strJson;
        },
        this.toJsonStr = function () {
            return JSON.stringify(this.arr);
        },
        this.getList = function () {
            return this.arr;
        },
        this.saveJson = function (key) {
            //  if (this.arr.length > 0) {
            window.localStorage.setItem(key, "");
            var jsonstr = JSON.stringify(this.arr);
            // 存储json字符串  
            window.localStorage.setItem(key, jsonstr);


            // }
            // alert('保存成功...');


        }


};

function TextList(text) {
    var txtList = text.split('}');
    return txtList;
};

///返回显示文字
function getText(obj) {
    var objList = obj.split(';');
    var reText = objList[0];
    if (objList.length > 1) {
        reText = objList[1];
    }
    return reText;
};

function Trim(x) {
    return x.replace(/^\s+|\s+$/gm, '');
};
function roundNum2(num) {

    return Math.round(num * 100) / 100;
};
function roundNum1(num) {
    var value = Math.round(num * 10) / 10;
    var xsd = value.toString().split('.');
    if (xsd.length == 1) {
        value = value.toString() + ".0";
    }
    return value;
    //return Math.round(num * 10) / 10;
};
function round2(ps3) {
    ps3.x = Math.round(ps3.x * 100) / 100;
    ps3.y = Math.round(ps3.y * 100) / 100;
    ps3.z = Math.round(ps3.z * 100) / 100;
    this.toString = function () {
        return ps3.x + "," + ps3.y + "," + ps3.z;
    }
    return ps3;
};
//模型初始化加载(毫米转换成米)
function Point3D(points) {
    // this.X = (points[0] / 100)+2000;
    // this.Y = (points[1] / 100)+1700;
    this.X = (points[0] / 1000);
    this.Y = (points[1] / 1000);
    if (points.length > 2)
        this.Z = points[2] / 1000;
    else
        this.Z = 0;

    this.toString = function () {
        return this.X + "," + this.Y + "," + this.Z;
    }

};
function Point3D_Str(strPs) {
    var ps = strPs.split(',');
    this.X = Number(ps[0])
    this.Y = Number(ps[1])
    if (ps.length > 2)
        this.Z = Number(ps[2]);
    else
        this.Z = 0;
}
function Point3D_CM(points) {

    //this.X =(points[0])/1 + tranX;
    //this.Y = (points[1])/1 +tranY;
    //if (points.length > 2)
    //    this.Z = points[2]/1;
    //else
    //    this.Z = 0;
    this.X = Number(tranX) + Number((points.X));
    this.Y = Number((points.Y)) + Number(tranY);
    if (points.length > 2)
        this.Z = Number(points.Z);
    else
        this.Z = 0;

    this.toString = function () {
        return this.X + "," + this.Y + "," + this.Z;
    }

};


///string 转3D类型 
function StrToPoint3D(strPoints) {
    var ps = strPoints.split(',');
    //以后加入单位转换和纠偏量
    this.X = parseFloat(ps[0]) / 10;
    this.Y = parseFloat(ps[1]) / 10;
    if (ps.length > 2)
        this.Z = parseFloat(ps[2]) / 10;
    else
        this.Z = 0;


};

function loadFile(url, onLoad) {
    if (url) {
        var request = new XMLHttpRequest();
        if (onLoad !== undefined) {
            request.addEventListener('load', function (event) {
                onLoad(event.target.responseText);
            }, false);
        }
        request.open('GET', url, true);
        request.send(null);
    }
};
function GetPointByStr(points, offX, offY) {
    //  var ps = points.split(',');
    this.X = points.X + offX;
    this.Y = points.Y + offY;
    this.Z = points.Z;
};
function GetDxfPoint() {
};
///字体加载
function Point3D_DiffY(points, diffY) {
    // this.X = (points[0] / 100)+2000;
    // this.Y = ((points[1] - diffY) / 100)+1700;

    this.X = (points[0] / 100) + tranX;
    this.Y = ((points[1] - diffY) / 100) + tranY;
    if (points.length > 2)
        this.Z = points[2] / 100;
    else
        this.Z = 0;

    this.toString = function () {
        return this.X + "," + this.Y + "," + this.Z;
    }
};
function cadMode(params, index) {
    params = params || {};
    this.id = index;
    this.SubClasses = params.properties.SubClasses;
    // if (params.properties.Text.indexOf("AcDbMText") > 0) {
    //     this.Text = params.properties.Text;
    // }
    this.Text = params.properties.Text;

    // if(this.SubClasses.indexOf("AcDbMText") > 0 )
    // {
    //     console.log(this.Text+" "+params.geometry.coordinates);
    // }

    // if(this.SubClasses.indexOf("AcDbText") > 0 )
    // {
    //     console.log(this.Text+" "+params.geometry.coordinates);
    // }
    this.geometryType = params.geometry.type;
    // if (this.SubClasses.indexOf("AcDbBlockReference") > 0) {

    if (this.geometryType == 'GeometryCollection') {
        this.geometries = params.geometry.geometries;
    } else {
        this.coordinates = params.geometry.coordinates;
    }
    // } else { 
    //     this.coordinates = params.geometry.coordinates; 
    // }
};

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
        "H+": this.getHours(), //小时     
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

var NewArray = function () {
    AcDbLine = new ArrayList();
    AcDbPolyline = new ArrayList();
    AcDbCircle = new ArrayList();
    AcDbMText = new ArrayList();

    //2D区域缓存空间
    GraphList = new ArrayList();
    RollCallList = new ArrayList();
    AttendRegList = new ArrayList(); //电子考勤区域


    lineGroup = new THREE.Object3D();
    lineGroup.name = 'lineGroup-dxf';
    textGroup = new THREE.Object3D();
    textGroup.name = 'textGroup';

    //  var group = new THREE.Group();
    ClearList();

};
var ClearList = function () {
    AcDbLine.clearList();
    AcDbPolyline.clearList();
    AcDbCircle.clearList();
    AcDbMText.clearList();


};

var mqttConfig = {
    Server: '192.168.8.46',
    Port: 61623,
    SSL: false,
    UserId: 'admin',
    Password: 'password',
    Timeout: 3,
    rtPs: 'rpm/sfloc',
    rtAlm: 'rpm/locwarning',
    rtAtt: 'rpm/rtelenaming',
    trackVideo: 'rpm/videotrack',
    wsip: '192.168.8.71',
    wsport: 12510
};

///获取当前时间 返回yyyy-MM-dd HH:mm:ss
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
};


function Point3DToPCScreen(points) {
    this.X = (points.X + 1) * window.innerWidth / 2;
    this.Y = (-points.Y + 1) * window.innerHeight / 2;
    this.Z = 0;
    this.toString = function () {
        return this.X + "," + this.Y + "," + this.Z;
    }

};
