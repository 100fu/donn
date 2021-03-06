var mono = mono || {};

var list=new ArrayList(); 
mono.loadCad = function () {
    this.dataList = new ArrayList();
    this.dataMap = {};
}
$.extend(true,mono.loadCad,{
    loadDxf: function (data) {
        var self = this;
        if (data instanceof File) {
            if (data.name.match(/\.dxf$/i)) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    self.loadDxf(e.target.result);
                };
                reader.readAsText(data);
            } else {
                alert('Only dxf file is supported');
            }
        } else {
            self._loadDxfFile(data);
        }
    },

    add: function (data) {
        if (!data) {
            return;
        }
        if (arguments.length === 1) {
            index = -1;
        }
        var id = list.size();
        // if (this.dataMap.hasOwnProperty(id)) {
        //     throw "Data with ID '" + id + "' already exists";
        // }
        list.add(data);
       // this.dataMap[id] = data;
        // this._dataBoxChangeDispatcher.fire({
        //     kind: 'add',
        //     data: data,
        //     source: this
        // });
        // data.addPropertyChangeListener(this.handleDataPropertyChange, this);
    },
    _loadDxfFile: function (data) {
        var self = this;
        self.data = data;
        var returnDatas = [];
        var parser = self.parser = new dxf.Dxf();
        parser.parse(data);
        var minY = Number.POSITIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY, minX = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY, walls = [];
        function computeMaxMin(entity) {
            if (entity.attrib.layer.startsWith('road')) {
                if (entity instanceof dxf.LineData) {
                    minY = entity.y1 < minY ? entity.y1 : minY;
                    minY = entity.y2 < minY ? entity.y2 : minY;
                    maxY = entity.y1 > maxY ? entity.y1 : maxY;
                    maxY = entity.y2 > maxY ? entity.y2 : maxY;
                    minX = entity.x1 < minX ? entity.x1 : minX;
                    minX = entity.x2 < minX ? entity.x2 : minX;
                    maxX = entity.x1 > maxX ? entity.x1 : maxX;
                    maxX = entity.x2 > maxX ? entity.x2 : maxX;
                } else if (entity instanceof dxf.PolylineData) {
                    entity.points.forEach(function (vertex) {
                        minY = vertex.y < minY ? vertex.y : minY;
                        maxY = vertex.y > maxY ? vertex.y : maxY;
                        minX = vertex.x < minX ? vertex.x : minX;
                        maxX = vertex.x > maxX ? vertex.x : maxX;
                    });
                } else if (entity instanceof dxf.InsertData) {

                }
            } else if (entity instanceof dxf.InsertData) {//后续添加
                if (entity.name === 'road') {
                    var datas = self.getEntitiesFromInsertData(entity);
                    datas.forEach(function (data) {
                        computeMaxMin(data);
                    });
                }
            }
        };

        parser.sections.entities.forEach(function (entity) {
            computeMaxMin(entity);
        });

        self.minY = minY, self.maxY = maxY, self.minX = minX, self.maxX = maxX;


        //封装json数据,遍历所有的json对象
        var jsons = [];
        //1.wall
        var walls = self.walls = [];
        parser.sections.entities.forEach(function (entity) {
            var layerName = entity.attrib.layer;
            if (layerName.startsWith('weilan') ||
                layerName.startsWith('mono-wall')) {
                self.createJsonArray(entity, jsons, layerName);
            }
        });


        //2.other


        //1.roads
        parser.sections.entities.forEach(function (entity) {
            var layerName = entity.attrib.layer;
            if (layerName.startsWith("damen")) {
                // self.createJsonArray(entity, jsons, layerName); 
                self.createWindowJson(entity, "door", walls, 20);
            }
        });

        parser.sections.entities.forEach(function (entity) {
            var layerName = entity.attrib.layer;
            if (layerName.startsWith('weilan') ||
                layerName.startsWith('mono-wall') || layerName.startsWith("damen")) {
            } else {
                self.createJsonArray(entity, jsons, layerName);
            }
        });

        //根据json数据加载json object
        this.createJsonObject(jsons);

    },

    createRoomJson: function (entity, json, jsonObject, type) {
        var str = entity.attrib.layer.split('#');
        var points = this.getEntityPoints(entity, entity.flags === 1);
        var wallJson = {
            type: type,
            data: points,
            id: str.length > 1 ? str[str.length - 1] : null,
        };
        json.push(wallJson);
        jsonObject.objects.push(wallJson);
    },

    createWindowJson: function (entity, type, walls, height) {
        var self = this;
        var p1 = this.translatePoint({ x: entity.x1, y: entity.y1 });
        var p2 = this.translatePoint({ x: entity.x2, y: entity.y2 });
        var wall;
        walls.some(function (item) {
            index = self.getPointIndex(item, p1)
            if (index < 0) {
                index = self.getPointIndex(item, p2);
            }
            if (index >= 0) {
                wall = item;
            }
            return wall != null;
        });
        if (wall == null || index < 0) {
            return;
        }

        var point = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        var offset = this.getPointOffset(wall, point, index);
        var rotateY = Math.atan((p1.y - p2.y) / (p1.x - p2.x));
        console.log(rotateY);
        wall.children = wall.children || [];
        var width = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
        var wallChild = {
            type: type,
            translate: [point.x, height, point.y],
            // rotate: [0, rotateY, 0],
            angle: rotateY,
            width: width,
            client: { index: index, offset: offset },
        };
        wall.children.push(wallChild);
    },

    createJsonArray: function (entity, jsons, type) {
        var str = entity.attrib.layer.split('#');
        var points = this.getEntityPoints(entity, entity.flags === 1);
        // console.log(points);
        var rect = this.getRectOfPoints(points);
        if (!rect) {
            return null;
        }
        var width = (rect.max.x - rect.min.x);
        var depth = rect.max.y - rect.min.y;
        var center = rect.center();
        // console.log(center.x, center.y);
        var angle = 0;
        if (entity instanceof dxf.InsertData) {
            angle = entity.angle;
        }
        var json = {
            type: type,
            data: points,
            id: str.length > 1 ? str[str.length - 1] : null,
            width: width,
            depth: depth,
            angle: angle,
            translate: [center.x, 0, center.y],
        };
        if (type.startsWith('weilan') || type.startsWith('mono-wall')) {
            this.walls.push(json);
        }
        jsons.push(json);
    },

    createJsonObject: function (jsons) {
        if (jsons.length > 0) {
            for (var i = 0; i < jsons.length; i++) {
                var json = jsons[i];
                var jsonData = this._getJsonData(json);
                this.add(jsonData);
            }
        }
    },

    _getJsonData: function (json) {
        var node = new mono.JsonObject();
        var type = json.type;
        var datas = json.data;
        var translate = json.translate;
        var width = json.width;
        var depth = json.depth;
        node.type = type;
        // if (type) {
        //     if (!model3d._filters[type] && !model3d._creators[type]) {
        //         node.type = 'model';
        //         node.name = type;
        //         node.label = this.modelLabelMap[type];
        //         if (type == 'longjia2' || type == 'ta1' || type == 'shuangxian2') {
        //             translate[1] = 150;
        //         } else if (type == 'longjia1' || type == 'shuangxian' || type == 'longjia') {
        //             translate[1] = 100;
        //         }
        //     } else {
        //         node.type = type;
        //     }
        // }

        //set Data 
        if (datas != null && datas.length > 0) {
            var data = [];
            if (datas[0] instanceof Array) {
                for (var i = 0; i < datas.length; i++) {
                    var data1 = datas[i], length = datas[i].length;
                    if (length == 2) {
                        data.push([data1[0] - translate[0], data1[1] - translate[2]]);
                    } else if (length == 5) {
                        data.push([data1[0], data1[1] - translate[0], data1[2] - translate[2], data1[3] - translate[0], data1[4] - translate[2]]);
                    }
                }
            } else {
                for (var i = 0; i < datas.length; i = i + 2) {
                    data.push([datas[i] - translate[0], datas[i + 1] - translate[2]]);
                }
            }

            node.setData(data);
        }

        if (json.children) {
            var children = [];
            for (var i = 0; i < json.children.length; i++) {
                var childJson = json.children[i];
                var child = this._getJsonData(childJson);
                console.log(child, childJson);
                children.push(child);
            }

            node.setChildren(children);
        }

        if (translate) {
            node.setTranslate(translate);
        }

        if (width) {
            node.setWidth(width);
        }

        if (depth) {
            node.setDepth(depth);
        }

        if (json.angle) {
            node.setRotate([0, json.angle, 0]);
        }
        // if(json.rotate){
        //     node.setRotate([0,json.angle,0]);
        // }
        if (json.client) {
            node.setClient(json.client);
        }

        return node;
    },

    translatePoint: function (point) {
        var self = this;
        // var minX = self.minX,minY = self.minY,maxX = self.maxX,maxY = self.maxY;
        var minX = 0, minY = 0, maxX = 0, maxY = 0;
        var w = maxX - minX;
        var h = maxY - minY;
        var hgap = 0, vgap = 0, scale = this.scale;
        return { x: (point.x - minX - w / 2) * scale + hgap, y: (-point.y + maxY - h / 2) * scale + vgap };

    },
    getFixedNumber: function (num) {
        return parseFloat(num.toFixed(4));
    },

    getEntitiesPoints: function (entities, offsetX, offsetY) {
        var points = [], self = this;
        entities.forEach(function (entity) {
            var pts = self.getEntityPoints(entity, entity.flags === 1, offsetX, offsetY)
            var len = points.length;
            if (len >= 4) {
                if (points[len - 2] === pts[0] && points[len - 1] === pts[1]) {
                    pts.shift(), pts.shift();
                }
            }
            points.push.apply(points, pts);
        });

        return points;
    },

    getRectOfPoints: function (points) {
        if (!points || points.length / 2 < 2) {
            return null;
        }
        var minY = Number.POSITIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY, minX = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY;
        var i = 0, len = points.length;
        var compareMinMax = function (x, y) {
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }
        if (len > 0 && points[i] instanceof Array) {
            for (; i < len; i++) {
                var point = points[i];
                if (point.length == 2) {
                    compareMinMax(point[0], point[1]);
                } else if (point.length == 5 && point[0] == 'c') {
                    // compareMinMax(point[1], point[2]);
                    compareMinMax(point[3], point[4]);
                }
            }
        } else {
            for (; i < len; i += 2) {
                compareMinMax(points[i], points[i + 1]);
            }
        }

        return {
            min: {
                x: minX,
                y: minY,
            },
            max: {
                x: maxX,
                y: maxY
            },
            center: function () {
                return {
                    x: (this.min.x + this.max.x) / 2,
                    y: (this.min.y + this.max.y) / 2,
                };
            }
        };
    },

    getBulgeVertex: function (bulge, vertex1, vertex2) {
        var point1 = { x: vertex1.x, y: vertex1.y };
        var point2 = { x: vertex2.x, y: vertex2.y };
        var newVertex = {};
        var result = (point1.x - point2.x) * (point1.y - point2.y) * bulge;
        if (result > 0) {
            newVertex = { x: point2.x, y: point1.y };
        } else if (result < 0) {
            newVertex = { x: point1.x, y: point2.y };
        }
        return newVertex;
    },

    getEntityPoints: function (entity, closed, offsetX, offsetY) {
        offsetX = offsetX || 0, offsetY = offsetY || 0;
        var points = [], self = this;
        if (entity instanceof dxf.LineData) {
            var point = self.translatePoint({ x: entity.x1 + offsetX, y: entity.y1 + offsetY });
            points.push(this.getFixedNumber(point.x), this.getFixedNumber(point.y));
            point = self.translatePoint({ x: entity.x2 + offsetX, y: entity.y2 + offsetY });
            points.push(this.getFixedNumber(point.x), this.getFixedNumber(point.y));
        } else if (entity instanceof dxf.PolylineData) {
            for (var i = 0; i < entity.points.length; i++) {
                var vertex = entity.points[i];
                var point = self.translatePoint({ x: vertex.x + offsetX, y: vertex.y + offsetY });
                points.push([self.getFixedNumber(point.x), self.getFixedNumber(point.y)]);
                if (vertex.bulge && Math.abs(vertex.bulge.toFixed(3)) == 0.414) {
                    closed = false;
                    var vertex2 = entity.points[++i] || entity.points[0];;
                    var bulgeVertex = self.getBulgeVertex(vertex.bulge.toFixed(3), vertex, vertex2);
                    var point2 = self.translatePoint({ x: vertex2.x + offsetX, y: vertex2.y + offsetY });
                    var bulgePoint = self.translatePoint({ x: bulgeVertex.x + offsetX, y: bulgeVertex.y + offsetY });
                    points.push(['c', self.getFixedNumber(bulgePoint.x), self.getFixedNumber(bulgePoint.y), self.getFixedNumber(point2.x), self.getFixedNumber(point2.y)]);
                }
            }

        } else if (entity instanceof dxf.InsertData) {
            var name = entity.name, block = null;
            var blocks = self.parser.sections.blocks;
            var ipx = entity.ipx + offsetX, ipy = entity.ipy + offsetY;
            block = blocks[name];
            points = self.getEntitiesPoints(block.entities, ipx, ipy)
        }
        if (closed) {
            var len = points.length;
            if (points[len - 2] != points[0] || points[len - 1] != points[1]) {
                points.push(points[0]);
            }
        }
        return points;
    },

    pointArrayToPointObjects: function (pointArray) {
        var i = 0, len = pointArray.length;
        var points = [];
        if (pointArray[0] instanceof Array) {
            for (; i < len; i++) {
                points.push({
                    x: pointArray[i][0],
                    y: pointArray[i][1],
                });
            }
        } else {
            for (; i < len; i += 2) {
                points.push({
                    x: pointArray[i],
                    y: pointArray[i + 1],
                });
            }
        }

        return points;
    },
    isPointOnLine: function (point, point1, point2, width) {
        if (width < 0) {
            width = 0;
        }
        var distance = this.getDistanceFromPointToLine(point, point1, point2);
        return distance <= width
            && (point.x >= Math.min(point1.x, point2.x) - width)
            && (point.x <= Math.max(point1.x, point2.x) + width)
            && (point.y >= Math.min(point1.y, point2.y) - width)
            && (point.y <= Math.max(point1.y, point2.y) + width);
    },

    getDistanceFromPointToLine: function (point, point1, point2) {
        if (point1.x === point2.x) {
            return Math.abs(point.x - point1.x);
        }
        var lineK = (point2.y - point1.y) / (point2.x - point1.x);
        var lineC = (point2.x * point1.y - point1.x * point2.y) / (point2.x - point1.x);
        return Math.abs(lineK * point.x - point.y + lineC) / (Math.sqrt(lineK * lineK + 1));
    },

    getPointOffset: function (wallJson, point, index) {
        var pts = wallJson.data;
        var points = this.pointArrayToPointObjects(pts);
        var p1 = points[index], p2 = points[index + 1];
        p2 = p2 || points[0];

        var offset = 0;
        if (p1.x != p2.x) {
            offset = (point.x - p1.x) / (p2.x - p1.x);
        } else if (p1.y != p2.y) {
            offset = (point.y - p1.y) / (p2.y - p1.y);
        }

        return offset;
    },

    getPointIndex: function (wallJson, point) {
        var pts = wallJson.data;
        var points = this.pointArrayToPointObjects(pts);

        if (points.length < 2) {
            return -1;
        }
        for (var i = 0; i < points.length; i++) {
            if (_twaver.math.getDistance(point, points[i]) <= 10) {
                return -1;
            }
        }
        var p1 = points[0], p2;
        for (var i = 1; i < points.length; i++) {
            p2 = points[i];
            if (this.isPointOnLine(point, p1, p2, 10)) {
                return i - 1;
            }
            p1 = p2;
        }
        p1 = points[0];
        if (this.isPointOnLine(point, p1, p2, 10)) {
            return points.length - 1;
        }
        return -1;
    },

    toJson: function (filter) {
        var jsonObject = [];
        // var datas = this.dataMap;
        //var datas = list.toList();
        // datas.forEach(function(data) {
        //     data.removePropertyChangeListener(this.handleDataPropertyChange, this);
        // }, this);
        // return JSON.stringify(array);

        for (var i = 0; i <list.size(); i++) {
            var data = list.get(i);
            var dataObject = {
                'type': data.type,
            };
            data.serializeJson(data, dataObject);
            if (!filter || filter(data)) {
                jsonObject.push(dataObject);
            }

        }
        // list.forEach(function (data) {

        //     var dataObject = {
        //         'type': data.type,
        //     };
        //     data.serializeJson(data, dataObject);
        //     if (!filter || filter(data)) {
        //         jsonObject.push(dataObject);
        //     }
        // });
        return JSON.stringify(jsonObject);
    }

})