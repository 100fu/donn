
var mapMonitor = function (targetId) {
    this.config = {};
    this.target = targetId;
    this.map = undefined;
    this.style = [];
    this.eventHandler = [];      //记录  事件类型->图层->事件
    this.eventObject = []; //记录所有事件对象，用于移除	
    this.draw;
    this.source = null;
    this.iconStandard = null;  //记录标准
    this.currentFeature = undefined;  //记录当前鼠标移动到的feature
    this.wmtsConfig = {
        "matrixIds": ['EPSG:3857:13', 'EPSG:3857:14', 'EPSG:3857:15', 'EPSG:3857:16', 'EPSG:3857:17', 'EPSG:3857:18', 'EPSG:3857:19'],
        "resolutions": [19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 0.2985821416974068]
    };
    initStyle(this);

    //增加事件，layerName：图层名称，eventName:事件名称，callback：点击回调事件
    this.addClickListener = function (layerName, callback) {
        var eventProvider = {};
        eventProvider.first = callback;
        addEventListener(this, layerName, 'click', eventProvider);
    },
        //添加多边形，layerId：图层的id，layerName：图层名称，featureList：多边形的json列表
        this.addFeatures = function (layerId, layerName, featureList) {
            featureList = JSON.parse(featureList);
            var vectorLayer = addLayer(this, layerId, layerName);
            var source = vectorLayer.getSource();
            for (var i = 0; i < featureList.features.length; i++) {
                var coors;
                if (featureList.features[i].geometry.type === "MultiPolygon") {
                    coors = featureList.features[i].geometry.coordinates[0];
                }
                else if (featureList.features[i].geometry.type === "MultiPolygon") {
                    coors = featureList.features[i].geometry.coordinates;
                }
                else continue;

                var polygon = new ol.geom.Polygon(coors);
                //polygon.applyTransform(ol.proj.getTransform('EPSG:4326', 'EPSG:3857'));

                if (this.style[featureList.features[i].type] === undefined)
                    featureList.features[i].type = "default";
                var ss = this.style[featureList.features[i].type];
                var style = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: ss.fillColor
                    }),
                    stroke: new ol.style.Stroke({
                        color: ss.strokeColor,
                        width: ss.strokeWidth
                    }),
                    text: new ol.style.Text({
                        //对齐方式
                        textAlign: 'center',
                        //文本基线
                        textBaseline: 'middle',
                        //字体样式
                        font: ss.text.font,
                        //文本内容
                        text: ss.text.content,
                        fill: new ol.style.Fill({
                            color: ss.text.fillColor
                        }),
                        stroke: new ol.style.Stroke({
                            color: ss.text.strokeColor,
                            width: ss.text.strokeWidth
                        })
                    })
                });

                var feature = new ol.Feature(polygon);
                feature.setStyle(style);
                source.addFeature(feature);
            }
            vectorLayer.setSource(source);
        },
        this.addFenceList = function (fenceList) {
            var layer = addLayer(this, "fence", "电子围栏");
            fenceList = JSON.parse(fenceList);
            for (var i = 0; i < fenceList.length; i++) {
                var polygon = new ol.geom.Polygon(fenceList[i].coordinates);
                var feature = textStyle(polygon, fenceList[i].text);
                feature.set("tag", fenceList[i].text);
                feature.set("id", fenceList[i].id);
                feature.set("parentId", "fence");
                feature.set("topParent", this);
                layer.getSource().addFeature(feature);
            }
        },
        //添加图标，iconList：图标的json列表，图层的id和名称在列表中
        this.addIcon = function (iconList) {
            this.iconStandard = JSON.parse(iconList);
            iconList = JSON.parse(iconList);
            for (var k = 0; k < this.iconStandard.length; k++) {
                this.iconStandard[k].info = [];
            }

            for (var i = 0; i < iconList.length; i++) {
                if (iconList[i].layer) {
                    for (var j = 0; j < iconList[i].info.length; j++) {
                        var layerId = iconList[i].type;
                        var layerName = iconList[i].name;
                        var anchor = iconList[i].anchor;
                        if (anchor === undefined)
                            anchor = [0.5, 0.5];
                        iconList[i].info[j]["type"] = iconList[i]["type"];
                        iconAdd(this, layerId, layerName, iconList[i].url, iconList[i].size, anchor, iconList[i].info[j]);
                    }
                }
            }
        },
        //测距及面积显示计算结果
        this.addInteraction = function (type) {
            this.map.removeInteraction(this.draw);
            var output;
            var drawLayer = addLayer(this, "draw", "绘制图层");
            if (type !== "None") {
                this.draw = new ol.interaction.Draw({
                    source: this.source,
                    type: type
                });
                this.draw.layer = drawLayer;
                this.map.addInteraction(this.draw);
                var _this = this.map;
                var drawItem = [];
                this.draw.on('drawend', function (evt) {
                    var feature = evt.feature;
                    var geometry = feature.getGeometry().getCoordinates();
                    var polygon;
                    switch (type) {
                        case "Polygon":
                            polygon = new ol.geom.Polygon(geometry);
                            output = polygon.getArea();
                            output = (Math.round(output * 100) / 100).toString() + '平方米';
                            break;
                        case "LineString":
                            polygon = new ol.geom.LineString(geometry);
                            output = polygon.getLength();
                            if (output > 1000) output = (Math.round(output / 1000 * 100) / 100).toString() + '千米';
                            else output = (Math.round(output * 100) / 100).toString() + '米';
                            break;
                    }
                    feature = new ol.Feature(polygon);
                    this.layer.getSource().addFeature(feature);
                    this.layer.getSource().addFeature(textStyle(polygon, output));
                    _this.removeInteraction(this);
                    $("input[name='radio']").removeAttr("checked");
                });
            }
            else {
                drawLayer.getSource().clear(true);
                this.map.removeLayer(drawLayer);
            }
        },
        //电子围栏和图标的绘制	
        this.addCustom = function (type) {
            this.map.removeInteraction(this.draw);
            var output = undefined;
            var drawLayer = addLayer(this, "draw", "绘制图层");
            if (type !== "None") {
                var drawType;
                switch (type) {
                    case "Fence":
                        drawType = "Polygon";
                        break;
                    case "station":
                        drawType = "Point";
                        break;
                    case "camera":
                        drawType = "Point";
                        break;
                }
                this.draw = new ol.interaction.Draw({
                    source: this.source,
                    type: drawType
                });
                this.draw.layer = drawLayer;
                this.map.addInteraction(this.draw);
                var _this = this;
                var drawItem = [];
                this.draw.on('drawend', function (evt) {
                    var feature = evt.feature;
                    var geometry = feature.getGeometry().getCoordinates();
                    var polygon;
                    if (type === "Fence") {
                        polygon = new ol.geom.Polygon(geometry);
                        var output = "电子围栏测试";
                        var layer = addLayer(_this, "fence", "电子围栏");
                        feature = textStyle(polygon, output);
                        feature.set("tag", output);
                        feature.set("parentId", "fence");
                        feature.set("topParent", _this);
                        layer.getSource().addFeature(feature);
                    }
                    else if (type === "station" || type === "camera") {
                        for (var i = 0; i < _this.iconStandard.length; i++) {
                            if (_this.iconStandard[i].type === type) {
                                var addTemp = {};
                                addTemp.coordinates = geometry;
                                addTemp.tag = type === "station" ? "新差分基站" : "新监控点";
                                var layerId = _this.iconStandard[i].type;
                                var layerName = _this.iconStandard[i].name;
                                iconAdd(_this, layerId, layerName, _this.iconStandard[i].url, _this.iconStandard[i].size, _this.iconStandard[i].anchor, addTemp);
                                break;
                            }
                        }
                    }
                    _this.map.removeInteraction(this);
                });
            }
            else {
                drawLayer.getSource().clear(true);
                this.map.removeLayer(drawLayer);
            }
        },

        //鼠标监听
        this.addMouseMoveListener = function (layerName, callback1, callback2) {
            var eventProvider = {};
            eventProvider.first = callback1;
            eventProvider.second = callback2;
            addEventListener(this, layerName, 'pointermove', eventProvider);
        },
        //图层添加图标
        this.addSingleIcon = function (layerId, layerName, pic, size, anchor, coords, tag) {
            tag.coordinates = coords;
            return iconAdd(this, layerId, layerName, pic, size, anchor, tag);
        },
        //删除图层
        this.delLayer = function (layerId, layerName) {
            var vectorLayer = addLayer(this, layerId, layerName);
            this.map.removeLayer(vectorLayer);
        },
        //导出电子围栏配置
        this.exportFenceConfig = function () {
            var resultConfig = [];
            var layer = addLayer(this, "fence");
            var features = layer.getSource().getFeatures();
            for (var i = 0; i < features.length; i++) {
                var temp = {};
                temp.text = features[i].get("tag");
                temp.coordinates = features[i].get('geometry').getCoordinates();
                resultConfig.push(temp);
            }
            return JSON.stringify(resultConfig);
        },
        //导出图标配置
        this.exportIconConfig = function () {
            var resultConfig = JSON.parse(JSON.stringify(this.iconStandard));
            for (var i = 0; i < resultConfig.length; i++) {
                var layerId = resultConfig[i].type;
                var layer = addLayer(this, layerId);
                var features = layer.getSource().getFeatures();
                resultConfig[i].info = [];
                for (var j = 0; j < features.length; j++) {
                    var temp = {};
                    temp.tag = features[j].get("tag");
                    temp.coordinates = features[j].get('geometry').flatCoordinates;
                    resultConfig[i].info.push(temp);
                }
            }
            return JSON.stringify(resultConfig);
        },
        //获取当前feature
        this.getCurrentFeature = function () {
            return this.currentFeature;
        },
        //通过条件查找feature，layerId：图层ID，propertyName：属性的名称，propertyValue：属性的值
        this.getFeature = function (layerId, propertyName, propertyValue) {
            var layer = this.getLayer(layerId);
            var resultFeature = undefined;
            if (layer !== undefined) {
                var fs = layer.getSource().getFeatures();
                for (var i = 0; i < fs.length; i++) {
                    if (fs[i].get(propertyName) === propertyValue) {
                        resultFeature = fs[i];
                    }
                }
            }
            return resultFeature;
        },
        this.getLayer = function (layerId) {
            return addLayer(this, layerId);
        },
        //获取所有图层
        this.getLayers = function () {
            var visibleLayers = [];
            for (var i = 0; i < this.map.getLayers().array_.length; i++) {
                var id = this.map.getLayers().array_[i].get("id");
                if (id !== "fence" && id !== "tempLayer")
                    visibleLayers.push(this.map.getLayers().array_[i]);
            }
            return visibleLayers;
        },
        //标签点移动
        this.moveTo = function (feature, time, coordinates) {
            feature.x = feature.getGeometry().flatCoordinates[0];
            feature.y = feature.getGeometry().flatCoordinates[1];
            TweenMax.to(feature, time, {
                x: coordinates[0],
                y: coordinates[1],
                onUpdate: function () {
                    feature.getGeometry().setCoordinates([feature.x, feature.y]);
                }
            });
        },
        //历史轨迹
        this.moveToWithPath = function (feature, path, showRoute) {
            var pathLayer = addLayer(this, "path", "路径显示");
            var startCoords;
            var endCoords = feature.getGeometry().flatCoordinates;
            for (var i = 0; i < path.length; i++) {
                startCoords = endCoords;
                endCoords = path[i].coords;
                var line = new ol.geom.LineString([startCoords, endCoords]);
                if (showRoute)
                    pathLayer.getSource().addFeature(lineString(line));
                else {
                    pathLayer.getSource().addFeature(lineString(line));
                }
            }

            feature.set("current", 0);  //记录当前段数
            feature.set("count", path.length);  //记录路径的段数
            feature.set("pathLayer", pathLayer);
            feature.set("pathData", path);
            feature.x = feature.getGeometry().getCoordinates()[0];
            feature.y = feature.getGeometry().getCoordinates()[1];
            recursivePath(feature);
        },
        //移除feature
        this.removeFeature = function (feature) {
            var layerId = feature.get('parentId');
            this.getLayer(layerId).getSource().removeFeature(feature);
        },
        this.setFeatureFont = function (feature, font, color) {
            feature.getStyle().getText().setFont(font);
            if (color !== null)
                feature.getStyle().getText().setFill(new ol.style.Fill({
                    color: color
                }));
            feature.changed();
        },
        //设置 单个feature可见
        this.setFeatureVisible = function (feature, visible) {
            var layer = addLayer(this, "tempLayer", "临时图层");
            if (visible)
                layer.getSource().addFeature(feature);
            else
                layer.getSource().removeFeature(feature);
        },
        //图层显示与隐藏
        this.setLayerVisible = function (id, visible) {
            this.map.getLayers().forEach(function (layer, i) {
                if (layer.get('id') === id) {
                    layer.setVisible(visible);
                    return false;
                }
            });
        },
        //加载地图
        this.show = function (_config) {
            config = _config;
            config.initZoom = config.initZoom === undefined ? 16 : config.initZoom;
            config.minZoom = config.minZoom === undefined ? 15 : config.minZoom;
            config.maxZoom = config.maxZoom === undefined ? 19 : config.maxZoom;
            this.config = config;

            var mousePositionControl = new ol.control.MousePosition({
                coordinateFormat: ol.coordinate.createStringXY(4),
                projection: 'EPSG:4326',
                target: document.getElementById('mousePosition'),
                undefinedHTML: '&nbsp;'
            });

            this.map = new ol.Map({
                view:
                new ol.View({
                    center: ol.proj.fromLonLat(config.center),
                    zoom: config.initZoom,
                    minZoom: config.minZoom,
                    maxZoom: config.maxZoom,
                    rotation: -0.9
                }),

                target: this.target,
                logo: false,
                controls: ol.control.defaults({
                    zoom: false
                }).extend([mousePositionControl])
            });

            for (var i = 0; i < config.mapList.length; i++) {
                var current = config.mapList[i];
                var source = undefined;
                if (current.type !== "GeoServer") {
                    source = new ol.source.XYZ({
                        url: current.url,
                        tilePixelRatio: 1,
                        minZoom: config.minZoom,
                        maxZoom: config.maxZoom
                    });
                }
                else {
                    var tilegrid = new ol.tilegrid.WMTS({
                        extent: [-2.003750834E7, -2.003750834E7, 2.003750834E7, 2.003750834E7],//范围
                        tileSize: [256, 256],
                        origin: [-2.003750834E7, 2.003750834E7],//切片原点
                        resolutions: this.wmtsConfig.resolutions,//分辨率
                        matrixIds: this.wmtsConfig.matrixIds//层级标识列表，与地图级数保持一致
                    });
                    source = new ol.source.WMTS({
                        url: current.url,
                        layer: "YellowStone:YellowStone",
                        format: "image/png",
                        matrixSet: "EPSG:3857",
                        tileGrid: tilegrid
                    });
                }

                let layer = new ol.layer.Tile({
                    title: current.name,
                    extent: ol.proj.transformExtent(current.extent, "EPSG:4326", "EPSG:3857"),
                    visible: true,
                    source: source
                });
                layer.set('id', current.id);
                this.map.addLayer(layer);
            }
			/*var layer = new ol.layer.Tile({
			    title: "街景图",
			    extent: ol.proj.transformExtent([115.19989,30.0543,115.38872,30.20656], "EPSG:4326", "EPSG:3857"),
			    visible: true,
				source:new ol.source.TileWMS({   
				     url:'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',   
				     params:{   
				         'LAYERS':'Yellow-street',//此处可以是单个图层名称，也可以是图层组名称，或多个图层名称
				         'TILED':false   
				     },   
				     serverType:'geoserver'    //服务器类型
				 })  
			});
			layer.set('id', 'street');
			this.map.addLayer(layer);*/
            addLayer(this, "tempLayer", "临时图层");
        },
        //加载地图工具条
        this.mapToolbar = function () {

            //添加比例尺控件
            this.map.addControl(new ol.control.ScaleLine());
            //添加缩放控件
            this.map.addControl(new ol.control.Zoom());
            //添加缩放滑动控件
            this.map.addControl(new ol.control.ZoomSlider());
            //添加全屏控件
            //this.map.addControl(new ol.control.FullScreen());
            //this.map.addControl(new ol.control.LayerSwitcher());
        },
        this.setText = function (feature, text) {
            feature.getStyle().getText().setText(text);
            feature.set("tag", text);
            feature.changed();
        };

    function addEventListener(_this, layerName, eventName, callback) {
        if (_this.eventObject[eventName] !== undefined) {
            ol.Observable.unByKey(_this.eventObject[eventName]);   //先移除事件
        }
        if (_this.eventHandler[eventName] === undefined)
            _this.eventHandler[eventName] = [];
        _this.eventHandler[eventName][layerName] = callback;
        _this.eventObject[eventName] = _this.map.on(eventName, function (e) {
            //在点击时获取像素区域
            var pixel = e.map.getEventPixel(e.originalEvent);
            if (eventName === 'click') {
                e.map.forEachFeatureAtPixel(pixel, function (feature) {
                    var tag = feature.get('tag');
                    if (feature.get('topParent') === undefined)
                        return false;
                    var _eventHandler = feature.get('topParent').eventHandler;
                    for (var key in _eventHandler['click']) {
                        if (feature.get('parentId') === key) {
                            _eventHandler['click'][key].first(tag, e);
                        }
                    }
                });
            }
            else if (eventName === 'pointermove') {
                if (e.map.hasFeatureAtPixel(pixel)) {
                    e.map.forEachFeatureAtPixel(pixel, function (feature) {
                        var tag = feature.values_;
                        if (feature.get('topParent') === undefined)
                            return false;
                        var _eventHandler = feature.get('topParent').eventHandler;
                        feature.get('topParent').currentFeature = feature;
                        for (var key in _eventHandler['pointermove']) {
                            if (feature.get('parentId') === key) {
                                _eventHandler['pointermove'][key].first(tag, e);
                                this.map.map.set("currentIn", _eventHandler['pointermove'][key]);
                                this.map.map.set("currentInParam", tag);
                            }
                        }
                    });
                }
                else {
                    if (this.get('currentIn') !== undefined)
                        this.get('currentIn').second(this.get('currentInParam'), e);
                }
            }
        });
    }
    //添加图层,如果是为了获取图层，第三个参数可不填，前提是layerId一定存在
    function addLayer(_this, layerId, layerName) {
        var vectorLayer = undefined;
        _this.map.getLayers().forEach(function (layer, i) {
            if (layer.get('id') === layerId) {
                vectorLayer = layer;
            }
        });
        if (vectorLayer === undefined) {
            vectorLayer = new ol.layer.Vector({ source: new ol.source.Vector() });
            vectorLayer.set('id', layerId);
            vectorLayer.set('title', layerName);
            _this.map.addLayer(vectorLayer);
        }
        return vectorLayer;
    }


    function iconAdd(_this, layerId, layerName, pic, size, anchor, info) {
        var iconLayer = addLayer(_this, layerId, layerName);
        var source = iconLayer.getSource();
        var pointFeature = new ol.Feature({
            geometry: new ol.geom.Point(info.coordinates)
        });
        pointFeature.set("parentId", layerId);
        pointFeature.set("topParent", _this);
        for (var key in info) {
            pointFeature.set(key, info[key]);
        }
        pointFeature.setStyle(
            new ol.style.Style({
                //把点的样式换成ICON图标
                image: new ol.style.Icon({
                    //设置图标偏移
                    anchor: anchor,
                    //标注样式的起点位置
                    anchorOrigin: 'top-right',
                    //X方向单位：分数
                    anchorXUnits: 'fraction',
                    //Y方向单位：像素
                    anchorYUnits: 'pixels',
                    //偏移起点位置的方向
                    offsetOrigin: 'top-right',
                    //透明度
                    opacity: 0.9,
                    scale: size,
                    //图片路径
                    //src: 'images/map.png'
                    src: pic
                }),
                //文本样式
                text: new ol.style.Text({
                    //字体样式
                    font: 'normal 14px 微软雅黑',
                    //文本内容
                    //text: feature.get('name'),
                    text: info.tag,
                    //填充样式
                    fill: new ol.style.Fill({
                        color: '#000', width: 3
                    }),
                    //笔触
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                        width: 3
                    }),
                    offsetX: 0,
                    offsetY: 0 - anchor[1] - 7
                })
            })
        );
        source.addFeature(pointFeature);
        return pointFeature;
    }

    function initStyle(_this) {
        var styleJson = $.ajax({
            url: "config/style.json",
            async: false
        });
        styleJson = styleJson.responseText;
        var styleList = JSON.parse(styleJson);
        for (var i = 0; i < styleList.length; i++) {
            _this.style[styleList[i].type] = styleList[i];
        }
    }
    //轨迹样式
    function lineString(line) {
        var lineStyle = new ol.Feature({
            geometry: line,
            type: 'route'
        });
        lineStyle.setStyle(new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 4, color: "#1E90FF"
            })
        }));
        return lineStyle;
    }

    function recursivePath(feature) {
        var path = feature.get("pathData");
        var current = feature.get("current");
        var count = feature.get("count");
        if (current === count) {
            //feature.get('pathLayer').getSource().clear(true);
            return;
        }
        TweenMax.to(feature, path[current].time, {
            x: path[current].coords[0],
            y: path[current].coords[1],
            onUpdate: function () {
                feature.getGeometry().setCoordinates([feature.x, feature.y]);
            },
            onComplete: function () {
                feature.set("current", feature.get("current") + 1);
                recursivePath(feature);
            }
        });
    }
    //测距及面积计算结果文本样式
    function textStyle(geometry, text) {
        var featureText = new ol.Feature({
            geometry: geometry,
            name: text
        });
        featureText.setStyle(
            new ol.style.Style({
                text: new ol.style.Text({
                    textAlign: 'center',
                    textBaseline: 'middle',
                    font: 'normal 16px 微软雅黑',
                    fill: new ol.style.Fill({
                        color: '#000'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                        width: 3
                    }),
                    text: text
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.6)'
                }),
                stroke: new ol.style.Stroke({
                    width: 3, color: "#1E90FF"
                })
            }));
        return featureText;
    }
};