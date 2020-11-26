var Utils = {
    relativePath: '',
    Path: 'images/',
    isNotNull: function (obj) {
        return obj !== undefined && obj !== 'undefined' && obj !== null && obj !== 'null' && obj !== '';
    },

    loadFile: function (url, onLoad) {
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
    },


    containsInArray: function (array, obj, refProperty) {
        if (ModelUtils.indexInArray(array, obj, refProperty) >= 0) {
            return true;
        }
        return false;
    },

    indexInArray: function (array, obj, refProperty) {
        if (!refProperty) {
            refProperty = "id";
        }
        for (var i = 0; i < array.length; i++) {
            if (obj == array[i][refProperty]) {
                return i;
            }
        }
        return -1;
    },

    covertTo3DPosition: function (node) {
        var p = node.getCenterLocation();
        var position = {};
        position.x = p.x;
        var size = node.getClient("size");
        if (size) {
            position.y = size.y / 2;
        }
        position.z = p.y;
        return position;
    },

    isEquals: function (s, t) {
        if (s) {
            return (s.x == t.x) && (s.y == t.y) && (s.z == t.z);
        } else if (!t) {
            return true;
        }
        return false;

    },

    containsID: function (array, id) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].id) {
                return true;
            }
        }
        return false;
    },

    removeChild: function (array, id) {
        var child;
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].id) {
                child = array[i];
            }
        }
        if (child) {
            var index = array.indexOf(child);
            if (index > -1) {
                array.splice(index, 1);
            }
        }
    },

    copyProperties: function (target, source, except) {
        for (var p in source) {
            if (p != except) {
                target[p] = source[p];
            }
        }
    },

    copyNeedProperties: function (target, source) {
        for (var p in source) {
            if (!target[p]) {
                target[p] = source[p];
            } else if (target[p] != source[p]) {
                target[p] = source[p];
            }
        }
    },

    mergeBoundingBox: function (b1, b2, b2p) {
        if (!b1) {
            b1 = new mono.BoundingBox();
        }
        if (!b2) {
            b2 = new mono.BoundingBox();
        }
        var offx = (b2.max.x - b2.min.x) / 2;
        var offy = (b2.max.y - b2.min.y) / 2;
        var offz = (b2.max.z - b2.min.z) / 2;
        var maxx = b2p.x + offx;
        var maxy = b2p.y + offy;
        var maxz = b2p.z + offz;
        var minx = b2p.x - offx;
        var miny = b2p.y - offy;
        var minz = b2p.z - offz;

        var max = {
            x: (b1.max.x > maxx) ? b1.max.x : maxx,
            y: (b1.max.y > maxy) ? b1.max.y : maxy,
            z: (b1.max.z > maxz) ? b1.max.z : maxz
        };
        var min = {
            x: (b1.min.x < minx) ? b1.min.x : minx,
            y: (b1.min.y < miny) ? b1.min.y : miny,
            z: (b1.min.z < minz) ? b1.min.z : minz
        };
        return new mono.BoundingBox(min, max);
    },

    getCenterOfBoundingBox: function (b) {
        return { x: (b.max.x + b.min.x) / 2, y: (b.max.y + b.min.y) / 2, z: (b.max.z + b.min.z) / 2 };
    },

    registerImage: function (url, network, component, callback, scope, name) {
        var image = new Image();
        if (url.startsWith("data:image")) {
            image.src = url;
        } else {
            image.crossOrigin = "";
            image.src = Utils.relativePath + url;
        }
        var views = arguments;

        if (name) {
            url = name;
        }
        image.onload = function () {
            if (component == "component") {
                twaver.Util.registerImage(url, image, image.width, image.height, network);
            } else {
                twaver.Util.registerImage(url, image, image.width, image.height);
            }
            if (callback) {
                callback.call(scope, image.width, image.height);
            }
            for (var i = 1; i < views.length; i++) {
                var view = views[i];

                if (view && view.invalidateElementUIs) {
                    view.invalidateElementUIs();
                }
                if (view && view.invalidateDisplay) {
                    view.invalidateDisplay();
                }
            }
        };

    },

    transforAndScaleCanvasContext: function (canvas, force) {
        var context = canvas.getContext("2d");
        if (!force && canvas.isTransfor && canvas.width && canvas.height) return context;
        devicePixelRatio = window.devicePixelRatio || 1,
        backingStoreRatio = context.webkitBackingStorePixelRatio ||
                            context.mozBackingStorePixelRatio ||
                            context.msBackingStorePixelRatio ||
                            context.oBackingStorePixelRatio ||
                            context.backingStorePixelRatio || 1,

        ratio = devicePixelRatio / backingStoreRatio;

        if (devicePixelRatio !== backingStoreRatio) {

            var oldWidth = canvas.width;
            var oldHeight = canvas.height;

            canvas.width = oldWidth * ratio;
            canvas.height = oldHeight * ratio;

            canvas.style.width = oldWidth + 'px';
            canvas.style.height = oldHeight + 'px';

            // now scale the context to counter
            // the fact that we've manually scaled
            // our canvas element
            context.scale(ratio, ratio);

        }
        if (canvas.width && canvas.height) canvas.isTransfor = true;
        return context;
    },

    covertTo3DPosition: function (node) {
        var p = node.getCenterLocation();
        var position = {};
        position.x = p.x;
        var size = node.getClient("size");
        if (size) {
            position.y = size.y / 2;
        }
        position.z = p.y;
        return position;
    },

    handlerTexture: function (texture, isAbs, isDecode) {
        var result;
        if (Utils.isNotNull(texture)) {
            if (texture instanceof Array) {
                result = [];
                for (var i = 0; i < texture.length; i++) {
                    var text = Utils.handlerTexture(texture[i], isAbs, isDecode);
                    result.push(text);
                }
            } else if (typeof (texture) == 'string'
                    && !(texture.startsWith('data:image')) && !(texture.startsWith('http'))) {
                result = Utils.RelativePath + texture;
                if (isAbs) {
                    result = Propertyconsts.MONO_IMG_PRE + result;
                }
            } else if (texture.startsWith('http')) {
                if (isDecode && texture.indexOf('%') >= 0) {
                    result = decodeURI(texture);
                } else {
                    result = texture;
                }
            } else {
                result = texture;
            }
            return result;
        }
        return result;
    },

    _createPath: function (array, scale) {
        var pscale = scale || 1;
        var path = new mono.Path();
        if (array instanceof Array) {
            var data = array.concat();
            while (data && data.length > 0) {
                var op = data.shift();
                if (op === 'm') {
                    path.moveTo(parseInt(data.shift() * pscale), parseInt(data.shift() * pscale), parseInt(data.shift() * pscale));
                }
                if (op === 'l') {
                    path.lineTo(parseInt(data.shift() * pscale), parseInt(data.shift() * pscale), parseInt(data.shift() * pscale));
                }
                if (op === 'c') {
                    path.curveTo(parseInt(data.shift() * pscale), parseInt(data.shift() * pscale), parseInt(data.shift() * pscale),
                        parseInt(data.shift() * pscale), parseInt(data.shift() * pscale), parseInt(data.shift() * pscale));
                }
            }

        }
        return path;
    },

    isCtrlDown: function (evt) {
        return evt.ctrlKey || evt.metaKey;
    },
    isAltDown: function (evt) {
        return evt.altKey;
    },
    isShiftDown: function (evt) {
        return evt.shiftKey;
    },
    getVersion: function () {
        return '1.0';
    },
    changeTwoDecimal: function (s) {
        return $utils.changeDecimalDigit(s, 2);
    },
    rChangeTwoDecimal: function (x) {
        if (x) {
            return parseFloat(x.toString().replace(/[^\d\.-]/g, ""));
        }
        return 0;
    },
    changeDecimalDigit: function (s, digit) {
        digit = digit > 0 && digit <= 20 ? digit : 2;
        s = $utils.rChangeTwoDecimal(s);
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(digit) + "";
        var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
        t = "";
        for (i = 0; i < l.length; i++) {
            //           t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : ""); 
            t += l[i];
        }
        var result = t.split("").reverse().join("") + "." + r;
        return parseFloat(result);
    },
    generateRandom: function (n) {
        var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var res = "";
        var num = n || 26;
        for (var i = 0; i < num ; i++) {
            var id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    },
    showInputDialog: function (table, title, showButton, callback) {
        var inputDialog = new mono.edit.ui.InputDialog(table, title, callback);
        inputDialog.show();
    },
    copyDatasToBoxAnchor: function (datas, box) {
        var contents = modelManager.serializeDatasInfo(datas, network._scaleUnitValue);
        // console.log(contents);
        box.copyAnchor = contents;
    },
    loadFile: function (url, onLoad) {
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
    },
    getRByD: function (degree) {
        return degree * Math.PI / 180;
    },
    getDByR: function (radian) {
        return radian * 180 / Math.PI
    },
    getModelLabelMap: function () {
        modelLabelMap = { 'tree': '树' };
        var categories = categoryJson.categories;
        for (var i = 0; i < categories.length; i++) {
            var datas = categories[i].contents;
            for (var j = 0; j < datas.length; j++) {
                var data = datas[j];
                modelLabelMap[data.name] = data.label;
            }
        }
        return modelLabelMap;
    },
    stopPropagation: function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }


}



