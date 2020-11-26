/// <reference path="../../../scripts/typings/eap1.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/kendo-ui/kendo.web.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
document.onreadystatechange = function (e) {
    if (document.readyState == 'complete') {
        for (var fn in EAP.UI.ctors) {
            EAP.UI.ctors[fn]();
        }
    }
};
if (!Storage.prototype.getObject) {
    Storage.prototype.getObject = function (key) {
        var result = this.getItem(key);
        try {
            return JSON.parse(result);
        }
        catch (e) {
            return result;
        }
    };
}
if (!Storage.prototype.setObject) {
    Storage.prototype.setObject = function (key, obj) {
        this.setItem(key, JSON.stringify(obj));
    };
}
//interface Math {
//    minInArrary(array: Array<number | string>): number|string
//}
///Array distinct very very good, admir myself
if (!Array.prototype.distinct)
    Array.prototype.distinct = function (fn) {
        var o = {}, a = [], i, e;
        for (i = 0; e = this[i]; i++) {
            o[fn ? fn(e) : this[i]] = e;
        }
        for (i in o) {
            if (o.hasOwnProperty(i))
                a.push(o[i]);
        }
        return a;
    };
//if (!Array.prototype.select)  请使用map
//    Array.prototype.select = function (fn: (obj) => any) {
//        let a = [], i, e;
//        for (i = 0; e = this[i] && fn ? fn(this[i]) : undefined; i++) a.push(e);
//        return a;
//    }
if (!Array.prototype.where)
    Array.prototype.where = function (fn) {
        if (!fn)
            return this;
        var a = [], i, e, s;
        for (i = 0; e = this[i]; i++) {
            s = fn(e);
            if (s)
                a.push(e);
        }
        return a;
    };
if (!Array.prototype.group)
    Array.prototype.group = function (fn) {
        var a = [], i, e, s, o = {};
        for (i = 0; e = this[i]; i++) {
            s = fn(e);
            if (o[s])
                o[s].push(e);
            else
                o[s] = [e];
        }
        for (i in o) {
            if (o.hasOwnProperty(i)) {
                o[i].Key = i;
                a.push(o[i]);
            }
        }
        return a;
    };
if (!Array.prototype.firstOrDefault)
    Array.prototype.firstOrDefault = function (fn) {
        var i, e;
        for (i = 0; e = this[i]; i++)
            if (fn(e))
                return e;
    };
if (!Array.prototype.extends)
    Array.prototype.extends = function (targets, fn, extendsMathod) {
        var o = {}, a = [], i, e, all = this.concat(targets);
        for (i = 0; e = all[i]; i++) {
            var n = fn ? fn(e) : all[i];
            o[n] = o[n] ? (extendsMathod || $.extend)(o[n], e) : e;
        }
        for (i in o) {
            if (o.hasOwnProperty(i))
                a.push(o[i]);
        }
        return a;
    };
if (!Array.prototype.sum)
    Array.prototype.sum = function (fn) {
        var sum = 0, i, e;
        for (i = 0; e = this[i]; i++)
            sum += fn(this[i]);
        return sum;
    };
if (!Array.prototype.findIndex)
    Array.prototype.findIndex = function (fn) {
        var i, e;
        for (i = 0; e = this[i]; i++)
            if (fn(e))
                return i;
        return -1;
    };
var Patterns;
(function (Patterns) {
    /**
     * singleton
     * @param fn {Function|ObjectConstructor} Function must return something, and this returns will be single.
     * @param isClass
     * @param classArgs
     */
    Patterns.Singleton = function (fn, isClass) {
        var classArgs = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            classArgs[_i - 2] = arguments[_i];
        }
        var result;
        if (isClass)
            return function () {
                return result || (result = new fn(classArgs));
            };
        return function () {
            return result || (result = fn.apply(this, classArgs));
        };
    };
    var Composite = (function () {
        function Composite() {
            this.children = [];
        }
        Object.defineProperty(Composite.prototype, "Id", {
            /**System.GUID*/
            get: function () {
                return this.id || (this.id = System.GUID.NewId());
            },
            enumerable: true,
            configurable: true
        });
        Composite.prototype.Remove = function (index) {
            if (typeof index === "number")
                return this.children.splice(index, 1)[0];
            else if (System.GUID.Validate(index))
                return this.children.firstOrDefault(function (c) { return c.Id === index; });
        };
        Composite.prototype.Add = function (item) {
            if (item && item instanceof Composite)
                this.children.push(item);
            return this;
        };
        Composite.prototype.Children = function () {
            return this.children;
        };
        Composite.prototype.Parent = function () {
            return this.parent;
        };
        /**
        * 部件自有属性摧毁方法
        */
        Composite.prototype.destroy = function () { };
        Composite.prototype.Destory = function () {
            var ri;
            while (ri = this.children.pop())
                ri.destroy();
            delete this.children;
            if (this.parent) {
                this.parent.Remove(this.Id);
                delete this.parent;
            }
            delete this.Parent;
            delete this.Children;
            delete this.Add;
            delete this.id;
            this.destroy();
        };
        return Composite;
    }());
    Patterns.Composite = Composite;
    var SimplyFactory = (function () {
        function SimplyFactory() {
            this.workshops = {};
        }
        SimplyFactory.prototype.Generate = function (name) {
            return (this.workshops[name] || this[name])();
        };
        return SimplyFactory;
    }());
    Patterns.SimplyFactory = SimplyFactory;
    var AbstractFactory = (function () {
        function AbstractFactory() {
        }
        return AbstractFactory;
    }());
    Patterns.AbstractFactory = AbstractFactory;
    //export abstract class 
})(Patterns || (Patterns = {}));
var System;
(function (System) {
    var GUIDBuilder = (function () {
        function GUIDBuilder() {
        }
        GUIDBuilder.prototype.s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        GUIDBuilder.prototype.NewId = function () {
            return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
                this.s4() + '-' + this.s4() + this.s4() + this.s4();
        };
        GUIDBuilder.prototype.Validate = function (str) {
            return new RegExp(/^{?[\da-f]{8}(-[\da-f]{4}){4}[\da-f]{8}\}?$/i).test(str);
        };
        return GUIDBuilder;
    }());
    /**
     * GUID Builder, doesn't built by logic of ms
     */
    System.GUID = Patterns.Singleton(GUIDBuilder, true);
    /**转化source=》target*/
    System.ReplaceJsonShrink = function (target, source) {
        if (target instanceof Array) {
            var template = target[0], data_1 = {};
            $.extend(true, data_1, template);
            target = [];
            if (template) {
                source.forEach(function (d) {
                    System.ReplaceJsonShrink(data_1, d);
                    target.push(data_1);
                });
            }
        }
        else {
            for (var propName in target) {
                if (target[propName] instanceof System.Object)
                    System.ReplaceJsonShrink(target[propName], source[propName]);
                target[propName] = source[propName];
            }
        }
        return target;
    };
    //UrlObj
    var UrlObj = (function () {
        function UrlObj(controller, action, parameters) {
            this.controller = controller;
            this.action = action;
            this.parameters = parameters;
        }
        UrlObj.prototype.toString = function () {
            var url = "/" + this.controller + '/' + this.action;
            if (this.parameters) {
                url = System.Url.Combine(url, System.Net.PostDataProcesser(this.parameters));
            }
            return url;
        };
        return UrlObj;
    }());
    System.UrlObj = UrlObj;
    var PageData = (function () {
        function PageData() {
        }
        PageData.prototype.clear = function () {
            System.PageDataTransportationStore = new System.Object();
            if (parent && parent.window)
                parent.window["System"].PageData.Storage.clear();
        };
        ;
        PageData.prototype.key = function (index) { return "not Sport"; };
        ;
        PageData.prototype.removeItem = function (key) {
            System.PageDataTransportationStore[key] = undefined;
            if (parent && parent.window)
                parent.window["System"].PageData.Storage.removeItem(key);
        };
        ;
        //self&parent
        PageData.prototype.setObject = function (key, value) {
            System.PageDataTransportationStore[key] = value;
            if (parent && parent.window)
                parent.window["System"].PageData.Storage.setObject(key, value);
            // parent.window[key] = value;
        };
        //self|parent
        PageData.prototype.getObject = function (key) {
            if (System.PageDataTransportationStore[key]) {
                return System.PageDataTransportationStore[key];
            }
            if (parent && parent.window)
                return parent.window["System"].PageData.Storage.getObject(key);
            return undefined;
        };
        PageData.prototype.setItem = function (key, value) {
            this.setObject(key, value);
        };
        PageData.prototype.getItem = function (key) {
            return this.getObject(key);
        };
        Object.defineProperty(PageData, "Storage", {
            get: function () {
                if (PageData.storage)
                    return PageData.storage;
                return this.storage = new PageData();
            },
            enumerable: true,
            configurable: true
        });
        return PageData;
    }());
    System.PageData = PageData;
    System.PageDataTransportationStore = new System.Object();
    //页面数据传递  Storage 
    var Transportation = (function () {
        function Transportation() {
        }
        ///初始化sign
        Transportation.getSign = function () {
            if (document.location.search.indexOf(this.TRANSPORTSIGN) >= 0) {
                return System.Url._get(this.TRANSPORTSIGN);
            }
            return new Date().getTime().toString();
        };
        Transportation.setSignForUrl = function (url) {
            if (typeof url === "string") {
                return System.Url.Combine(url, { TransportSign: this.sign });
            }
            var obj = url;
            if (!obj.parameters)
                obj.parameters = new System.Object();
            obj.parameters[this.TRANSPORTSIGN] = this.sign;
            return url;
        };
        Object.defineProperty(Transportation, "_storage", {
            get: function () {
                if (typeof Storage === "undefined" || this.pageData) {
                    return PageData.Storage;
                }
                if (this.local)
                    return localStorage;
                else
                    return sessionStorage;
            },
            enumerable: true,
            configurable: true
        });
        Transportation.setValue = function (key, value) {
            if (typeof value === "object") {
                this._storage.setObject(key + "_" + this.sign, value);
            }
            else {
                this._storage.setItem(key + "_" + this.sign, value);
            }
        };
        Transportation.getValue = function (key) {
            return this._storage.getObject(key + "_" + this.sign);
        };
        Transportation.clear = function () {
            this._storage.clear();
        };
        Transportation.removeItem = function (key) {
            this._storage.removeItem(key + "_" + this.sign);
        };
        return Transportation;
    }());
    Transportation.TRANSPORTSIGN = 'TransportSign';
    //可设置参数
    Transportation.local = false;
    Transportation.sign = Transportation["getSign"]();
    Transportation.pageData = false;
    System.Transportation = Transportation;
    //调用父页面方法，数据使用System.Transportation
    System.InvokeParent = function (mothedName) {
        var method = System.Reference(parent.window, mothedName);
        var index = mothedName.lastIndexOf('.');
        if (index == -1)
            method.apply(parent.window);
        else {
            var call = System.Reference(parent.window, mothedName.substr(0, index));
            method.apply(call);
        }
    };
    //调用子页面方法，数据使用System.Transportation
    System.InvokeChild = function (iframe, mothedName) {
        var method = System.Reference(iframe.contentWindow.window, mothedName);
        var index = mothedName.lastIndexOf('.');
        if (index == -1)
            method.apply(iframe.contentWindow.window);
        else {
            var call = System.Reference(iframe.contentWindow.window, mothedName.substr(0, index));
            method.apply(call);
        }
    };
    var Permission = (function () {
        function Permission() {
        }
        /// pCod 是Code 或Name 不重要 主要看matchCode怎么匹配。验证按钮或页面权限都可以，主要看getPermissions的设定
        Permission.validatePermission = function (pCod, moduleCode) {
            var allPermission;
            if (!this._permissions[moduleCode || "current"]) {
                if (!this.getPermissions)
                    throw new Error(" getPermissions is null ");
                else {
                    allPermission = this._permissions[moduleCode || "current"] = this.getPermissions(moduleCode);
                }
            }
            else
                allPermission = this._permissions[moduleCode || "current"];
            var result = false;
            if (allPermission) {
                if ($.isArray(allPermission)) {
                    for (var i = 0; i < allPermission.length; i++)
                        if (result = this.matchCode(allPermission[i], pCod))
                            break;
                }
                else
                    return this.matchCode(allPermission, pCod);
            }
            return result;
        };
        return Permission;
    }());
    Permission._permissions = {};
    ///fn(moduleCode:string):Array<any> 
    Permission.getPermissions = undefined;
    ///fn(item, code):boolean
    Permission.matchCode = function (item, code) { return item.Code == code; };
    System.Permission = Permission;
    var AngularApp = (function () {
        function AngularApp(element, appDependency) {
            if (appDependency === void 0) { appDependency = new Array(); }
            this.element = element;
            this.appDependency = appDependency;
            this.APPNAME = "angularApp";
            this.NGAPP = "ng-app";
            if (!this.element.hasAttribute(this.NGAPP)) {
                var allApps = $(document).find("[" + this.NGAPP + "]");
                this.APPNAME += allApps.length;
                this.element.setAttribute(this.NGAPP, this.APPNAME);
            }
            else
                this.APPNAME = this.element.getAttribute(this.NGAPP);
        }
        Object.defineProperty(AngularApp.prototype, "module", {
            get: function () {
                var _this = this;
                if (!this._module) {
                    try {
                        this._module = angular.module(this.APPNAME);
                        this.$controllerProvider = this.element["$controllerProvider"];
                    }
                    catch (e) {
                        this._module = angular.module(this.APPNAME, this.appDependency, function ($controllerProvider) {
                            _this.$controllerProvider = $controllerProvider;
                            _this.element["$controllerProvider"] = $controllerProvider;
                        });
                    }
                }
                // this._module["AngularApp"] = this;
                return this._module;
            },
            enumerable: true,
            configurable: true
        });
        // Register Ctrl controller manually
        // If you can reference the controller function directly, just run:
        // $controllerProvider.register(controllerName, controllerFunction);
        // Note: I haven't found a way to get $controllerProvider at this stage
        //    so I keep a reference from when I ran my module config
        AngularApp.registerController = function (moduleName, controllerName, controllerProvider) {
            //Here I cannot get the controller function directly so I
            //need to loop through the module's _invokeQueue to get it
            var queue = angular.module(moduleName)["_invokeQueue"];
            for (var i = 0; i < queue.length; i++) {
                var call = queue[i];
                if (call[0] == "$controllerProvider" &&
                    call[1] == "register" &&
                    call[2][0] == controllerName) {
                    controllerProvider.register(controllerName, call[2][1]);
                }
            }
        };
        return AngularApp;
    }());
    AngularApp.APP_DEPENDENCYS = [];
    System.AngularApp = AngularApp;
    var AngularController = (function () {
        ///默认一个页面一个模块，如果element上存在ng-app特性则以element为准,该页面所有AngularController不能有重叠,多模块
        function AngularController(element, fn, app) {
            this.element = element;
            this.app = app;
            this.APPNAME = "angularApp";
            this.NGAPP = "ng-app";
            this.CONTROLLERNAME = "Controller";
            this.NGCONTROLLER = "ng-controller";
            var appElement;
            //app
            if (!app) {
                this.app = angular.element('body').AngularApp(AngularApp.APP_DEPENDENCYS);
                //let body = document.getElementsByTagName('body')[0];
                //if (!body.hasAttribute(this.NGAPP)) body.setAttribute(this.NGAPP, this.APPNAME);
                //else this.APPNAME = body.getAttribute(this.NGAPP)
                //try {
                //    this._module = angular.module(this.APPNAME)
                //} catch (e) {
                //    this._module = angular.module(this.APPNAME, AngularApp.APP_DEPENDENCYS)
                //}
                //appElement = body
            }
            //else {
            this._module = this.app.module;
            this.APPNAME = this.app.APPNAME;
            appElement = angular.element("[" + this.NGAPP + "='" + this.APPNAME + "']")[0];
            //}
            //controller
            var $element = angular.element(appElement);
            var allControllers = $element.find("[" + this.NGCONTROLLER + "]");
            this.CONTROLLERNAME = (element.getAttribute(this.NAME) || ("auto" + allControllers.length)) + this.CONTROLLERNAME;
            this.element.setAttribute(this.NGCONTROLLER, this.CONTROLLERNAME);
            this._module.controller(this.CONTROLLERNAME, fn ||
                function ($scope) {
                    $scope = new System.Object();
                });
        }
        AngularController.prototype.getScope = function () {
            return angular.element(this.element).scope();
        };
        AngularController.prototype.recompile = function (module, registed) {
            if (module === void 0) { module = false; }
            if (registed === void 0) { registed = true; }
            if (!module) {
                var controller = angular.element(this.element);
                var that_1 = this;
                angular.element("[" + this.NGAPP + "='" + this.APPNAME + "']").injector().invoke(function ($compile, $timeout) {
                    if (!registed)
                        AngularApp.registerController(that_1.APPNAME, that_1.CONTROLLERNAME, that_1.app.$controllerProvider);
                    var scope = controller.scope();
                    $compile(that_1.element)(scope);
                    scope.$apply();
                });
            }
            else
                angular.bootstrap("[" + this.NGAPP + "='" + this.APPNAME + "']", [this.APPNAME]);
            return this;
        };
        AngularController.prototype.rebindScope = function () {
            var injector = angular.injector(['ng', this.APPNAME]), controller = injector.get('$controller'), rootScope = injector.get('$rootScope'), newScope = rootScope.$new();
            // 调用控制器
            controller(this.CONTROLLERNAME, { $scope: newScope });
            return this;
        };
        AngularController.prototype.setValue = function (fieldName, value) {
            var scope = this.getScope();
            if (angular.isArray(value) || angular.isObject(value)) {
                System.SetValue(scope, fieldName, value);
                scope.$apply();
                return this;
            }
            if (typeof value === "string")
                value = "'" + value + "'";
            scope.$apply(fieldName + "=" + value);
            return this;
        };
        return AngularController;
    }());
    System.AngularController = AngularController;
    var DivCell = (function () {
        function DivCell(element, options, mark) {
            this.element = element;
            this.mark = mark;
            this.options = { align: "", width: "auto", height: "auto", destroy: undefined }; //align：指DivCell内容的对齐方式,destroy:(mark){}
            if (typeof options === "object")
                $.extend(this.options, options);
            this._decrate();
        }
        DivCell.prototype._decrate = function () {
            this.wrapper = document.createElement("div");
            this.wrapper.style.height = this.options.height;
            this.wrapper.classList.add("l_divCell");
            this.wrapper.appendChild(this.element);
        };
        DivCell.prototype.insertInto = function (container, index) {
            container.insert(this, index);
        };
        DivCell.prototype.destroy = function () {
            this._remove();
            if (this.wrapper) {
                this.element.remove();
                this.element = undefined;
                this.wrapper.remove();
                this.wrapper = undefined;
                //parents
            }
            if (this.options.destroy)
                this.options.destroy(this.mark);
        };
        DivCell.prototype._remove = function () {
            if (this.divRow) {
                this.divRow._remove(this.element);
                this.divRow = undefined;
            }
            if (this.divLattice) {
                this.divLattice._remove(this.element);
                this.divLattice = undefined;
            }
        };
        return DivCell;
    }());
    System.DivCell = DivCell;
    var DivRow = (function () {
        function DivRow(divArray, options) {
            if (divArray === void 0) { divArray = new Array(); }
            this.divArray = divArray;
            this.options = { align: "left" }; //align：指DivRow中DivCell的对齐方式
            if (typeof options === "object")
                $.extend(this.options, options);
            this._decrate();
        }
        DivRow.prototype._decrate = function () {
            this.element = document.createElement("div");
            this.element.style.height = "auto";
            this.element.style.alignContent = this.options.align;
            this.element.classList.add("l_divRow");
            this.wrapper == this.element;
            this._build();
        };
        DivRow.prototype._build = function () {
            var _this = this;
            this.element.innerHTML = "";
            this.divArray.forEach(function (d) {
                _this.element.appendChild(d.element);
            });
        };
        DivRow.prototype.insert = function (divcell, index) {
            this.divArray.splice(index || this.divArray.length, 0, divcell);
            this._build();
        };
        DivRow.prototype.insertInto = function (container, index) {
            container.insert(this, index);
        };
        DivRow.prototype.destroy = function (index) {
            if (index == undefined) {
                this._remove();
                for (var index_1 = this.divArray.length - 1; index_1 == 0; index_1--) {
                    var d = this.divArray[index_1];
                    d.destroy();
                }
                if (this.wrapper) {
                    this.element.remove();
                    this.element = undefined;
                    this.wrapper.remove();
                    this.wrapper = undefined;
                }
                return;
            }
            var div;
            if (typeof index === "number") {
                div = this.divArray.slice(index, 1)[0];
            }
            else {
                for (var i = 0; i < this.divArray.length; i++) {
                    var d = this.divArray[i];
                    if (d.element == index || d.wrapper == index) {
                        div = this.divArray.slice(i, 1)[0];
                        break;
                    }
                }
            }
            if (div)
                div.destroy();
        };
        DivRow.prototype._remove = function (index) {
            if (index == undefined && this.divLattice)
                this.divLattice._remove(this.wrapper);
            else {
                var div = void 0;
                if (typeof index === "number") {
                    div = this.divArray.splice(index, 1)[0];
                }
                else {
                    for (var i = 0; i < this.divArray.length; i++) {
                        var d = this.divArray[i];
                        if (d.element == index || d.wrapper == index) {
                            div = this.divArray.splice(i, 1)[0];
                            break;
                        }
                    }
                }
            }
        };
        DivRow.prototype.getCell = function (mark) {
            var cell;
            this.divArray.forEach(function (d) {
                if (d.mark === mark)
                    cell = d;
            });
            return cell;
        };
        return DivRow;
    }());
    System.DivRow = DivRow;
    var DivLattic = (function () {
        function DivLattic(element, options, divArray) {
            if (divArray === void 0) { divArray = new Array(); }
            this.element = element;
            this.divArray = divArray;
            this.options = { align: "left", width: "100%" }; //align：指DivCell|DivRow的对齐方式
            if (typeof options === "object")
                $.extend(this.options, options);
            if (element.style.width === "")
                element.style.width = this.options.width;
            this.element.innerHTML = "";
            this.element.classList.add("divLattic");
            this.wrapper = this.element;
            this.build();
        }
        DivLattic.prototype.build = function () {
            var _this = this;
            this.element.innerHTML = "";
            this.divArray.forEach(function (d) {
                _this.element.appendChild(d.wrapper);
                if (d instanceof DivCell) {
                    var dc = d;
                    dc.wrapper.setAttribute("style", "width:" + dc.options.width);
                    if (dc.options.align)
                        dc.wrapper.setAttribute("style", "float:" + dc.options.align);
                }
            });
            return this;
        };
        DivLattic.prototype.insert = function (div, index) {
            this.divArray.splice(index || this.divArray.length, 0, div);
            this.build();
        };
        DivLattic.prototype.destroy = function (obj) {
            if (obj == undefined) {
                for (var index = this.divArray.length - 1; index == 0; index--) {
                    var d = this.divArray[index];
                    d.destroy();
                }
                return;
            }
            if (obj instanceof jQuery)
                obj = obj[0];
            var div;
            if (typeof obj === "number") {
                div = this.divArray.splice(obj, 1)[0];
            }
            else {
                for (var index = 0; index < this.divArray.length; index++) {
                    var d = this.divArray[index];
                    if (d.element == obj || d.wrapper == obj) {
                        div = this.divArray.splice(index, 1)[0];
                        break;
                    }
                }
            }
            if (div)
                div.destroy();
        };
        DivLattic.prototype._remove = function (obj) {
            if (obj instanceof jQuery)
                obj = obj[0];
            var div;
            if (typeof obj === "number") {
                div = this.divArray.splice(obj, 1)[0];
            }
            else {
                for (var index = 0; index < this.divArray.length; index++) {
                    var d = this.divArray[index];
                    if (d.element == obj || d.wrapper == obj) {
                        div = this.divArray.splice(index, 1)[0];
                        break;
                    }
                }
            }
        };
        DivLattic.prototype.getCell = function (mark) {
            var cell;
            this.divArray.forEach(function (d) {
                if (d instanceof DivRow)
                    cell = d.getCell(mark);
                else if (d.mark === mark)
                    cell = d;
            });
            return cell;
        };
        return DivLattic;
    }());
    System.DivLattic = DivLattic;
    /**状态顺序流程 方案*/
    var SequenceSolution = (function () {
        /**状态顺序流程 方案
        * @param {string} name - 用于区分不同顺序方案
        */
        function SequenceSolution(name) {
            this.name = name;
            this._sequences = [];
            this._refusingSequences = [];
            this._sObj = {};
            this._rsObj = {};
            this._objs = {};
            this._changed = false;
            var e = SequenceSolution.solutions.where(function (s) { return s.name === name; })[0];
            if (e)
                return e;
            SequenceSolution.solutions.push(this);
        }
        SequenceSolution.prototype.analyse = function () {
            var _this = this;
            this._sObj = {};
            this._rsObj = {};
            this._sequences.forEach(function (s) {
                for (var i = 0; i < s.length - 1; i++) {
                    var c = s[i], n = s[i + 1];
                    _this._sObj[c.id + "-" + n.id] = [c, n];
                    _this._objs[c.id] = c;
                    _this._objs[n.id] = n;
                }
            });
            this._refusingSequences.forEach(function (s) {
                for (var i = 0; i < s.length - 1; i++) {
                    var c = s[i], n = s[i + 1];
                    _this._rsObj[c.id + "-" + n.id] = [c, n];
                    _this._objs[c.id] = c;
                    _this._objs[n.id] = n;
                }
            });
            this._changed = false;
        };
        /**添加一种顺序
        * @param {Array<{ id: string, toString: Function, actName: Function }>} sequence - 顺序  toString:状态名称 ，actName：行为名称
        */
        SequenceSolution.prototype.add = function (sequence, refusing) {
            if (refusing === void 0) { refusing = false; }
            if (sequence) {
                this[refusing ? "_refusingSequences" : "_sequences"].push(sequence);
                this._changed = true;
            }
        };
        /**修改一种顺序
       * @param {number} index - 索引
       * @param {Array<{ id: string, toString: Function, actName: Function }>} sequence - 顺序 toString:状态名称 ，actName：行为名称
       */
        SequenceSolution.prototype.edit = function (index, sequence, refusing) {
            if (refusing === void 0) { refusing = false; }
            if (sequence) {
                this[refusing ? "_refusingSequences" : "_sequences"][index] = sequence;
                this._changed = true;
            }
        };
        /**验证状态是否可以变迁到target状态  default err msg:{状态名称}状态数据无法进行{行为名称}
        * @param {string} fromId - 起始状态.id
        * @param {string} targetId - 目标状态.id
        * @param {string} failMsg - 可选参数，自定义失败消息 若包含{0}:将默认提示替代{0};若包含{0},{1}:将fromStr 和targetStr分别替换{0},{1}
        * @returns {boolean} 可以变迁：true； 不可以：false
        */
        SequenceSolution.prototype.validate = function (fromId, targetId, failMsg) {
            if (this._changed)
                this.analyse();
            var re = this._rsObj[fromId + "-" + targetId], e = this._sObj[fromId + "-" + targetId] || this._sObj[SequenceSolution.all.id + "-" + targetId] || this._sObj[fromId + "-" + SequenceSolution.all.id];
            if (re || !e) {
                var f = this._objs[fromId], t = this._objs[targetId], msg = System.CultureInfo.GetDisplayText("{0}状态数据无法进行{1}").format(f, t.actName());
                if (failMsg) {
                    if (failMsg.indexOf("{1}") >= 0)
                        msg = failMsg.format(f, t);
                    else
                        msg = failMsg.format(msg);
                }
                EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText("prompt"), msg);
                return false;
            }
            return true;
        };
        return SequenceSolution;
    }());
    /** @typedef {Array<SequenceSolution>} 用于存放所有方案*/
    SequenceSolution.solutions = [];
    SequenceSolution.all = { id: "all", toString: Function, actName: Function };
    System.SequenceSolution = SequenceSolution;
    var FilterParameters = (function () {
        function FilterParameters() {
        }
        FilterParameters.generateWithFilter = function (logic) {
            var items = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                items[_i - 1] = arguments[_i];
            }
            var kg = new RequestItem(), fs = items.where(function (i) { return i instanceof FilterItem; }), ss = items.where(function (i) { return i instanceof SortItem; });
            if (fs.length > 0)
                kg.filter = new Filters(logic, fs);
            if (ss.length > 0)
                kg.sort = ss;
            return kg;
        };
        return FilterParameters;
    }());
    FilterParameters.logics = { and: "and", or: "or", endswith: "endswith" };
    FilterParameters.itemOperators = {
        eq: "eq", in: "in", neq: "neq", contains: "contains", startswith: "startswith", doesnotcontain: "doesnotcontain", isnotempty: "isnotempty",
        isempty: "isempty", isnotnull: "isnotnull", isnull: "isnull", lte: "lte", gte: "gte", lt: "lt", gt: "gt"
    };
    System.FilterParameters = FilterParameters;
    var FilterItem = (function () {
        function FilterItem(logic, itemOperator, value) {
            var filters = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                filters[_i - 3] = arguments[_i];
            }
            this.logic = logic;
            this.itemOperator = itemOperator;
            this.value = value;
            this.filters = filters;
        }
        return FilterItem;
    }());
    System.FilterItem = FilterItem;
    var Filters = (function () {
        function Filters(logic, filters) {
            this.logic = logic;
            this.filters = filters;
        }
        return Filters;
    }());
    System.Filters = Filters;
    var SortItem = (function () {
        function SortItem(dir, field) {
            this.dir = dir;
            this.field = field;
        }
        return SortItem;
    }());
    System.SortItem = SortItem;
    var RequestItem = (function () {
        function RequestItem() {
        }
        return RequestItem;
    }());
    System.RequestItem = RequestItem;
})(System || (System = {}));
(function (System) {
    var Web;
    (function (Web) {
        var ScriptsHelper = (function () {
            function ScriptsHelper() {
            }
            ScriptsHelper.prototype.loadScript = function (url) {
                var script = document.createElement("script");
                script.async = false;
                script.setAttribute('src', url + '?' + 'time=' + Date.parse(new Date().toString()));
                document.body.appendChild(script);
            };
            return ScriptsHelper;
        }());
        Web.Scripts = Patterns.Singleton(ScriptsHelper, true);
    })(Web = System.Web || (System.Web = {}));
})(System || (System = {}));
(function (System) {
    var DateEx;
    (function (DateEx) {
        var ISODateStandar = (function () {
            function ISODateStandar() {
            }
            ISODateStandar.prototype.weekOfYear = function (date) {
                var target = new Date(date.valueOf()), dayNr = (date.getDay() + 6) % 7;
                target.setDate(target.getDate() - dayNr + 3);
                var thisThursday = target.valueOf();
                target.setMonth(0, 1);
                if (target.getDay() != 4)
                    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
                return 1 + Math.ceil((thisThursday - target.valueOf()) / 604800000);
            };
            ISODateStandar.prototype.dateOfWeek = function (year, weekOfYear, day) {
                if (day === void 0) { day = 0; }
                var target = new Date(year, 0, 4 + (weekOfYear - 1) * 7);
                target.setDate(target.getDate() - (target.getDay() + 6) % 7 + day);
                return target;
            };
            ISODateStandar.prototype.weekFormat = function (date, format) {
                return (format || "yyyy-WW").replace(/yyyy/g, this.fullYear(date).toString()).replace(/WW/g, "W" + this.weekOfYear(date).toString());
            };
            ISODateStandar.prototype.fullYear = function (date) {
                var target = new Date(date.valueOf());
                target.setDate(target.getDate() - ((date.getDay() + 6) % 7) + 3);
                return target.getFullYear();
            };
            return ISODateStandar;
        }());
        var DateStandars = (function (_super) {
            __extends(DateStandars, _super);
            function DateStandars() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.iso = Patterns.Singleton(ISODateStandar, true);
                return _this;
            }
            return DateStandars;
        }(Patterns.SimplyFactory));
        /**时间日期标准s  { Generate(name: string):System.DateEx.IDateStandar}  name:["iso"]*/
        DateEx.DateStandar = Patterns.Singleton(DateStandars, true);
    })(DateEx = System.DateEx || (System.DateEx = {}));
})(System || (System = {}));
var EAP;
(function (EAP) {
    var UI;
    (function (UI) {
        var UIAF = (function (_super) {
            __extends(UIAF, _super);
            function UIAF() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return UIAF;
        }(Patterns.AbstractFactory));
        UI.UIAF = UIAF;
        /// UI Controls' base class in TS
        var UiBasicOption = (function () {
            function UiBasicOption(selector, owner) {
                if (selector === void 0) { selector = ''; }
                if (owner === void 0) { owner = null; }
                this.selector = selector;
                this.owner = owner;
            }
            return UiBasicOption;
        }());
        var MessageBox = (function () {
            function MessageBox() {
            }
            MessageBox.showInput = function (option) {
                var winDiv = jQuery("<div class='k-popup-edit-form' style='overflow:hidden'/>");
                var contentTemplate = "<div class='k-edit-form-container'>"
                    + "<p class='k-popup-message' style='text-align:left;margin-left:2em;padding-bottom:5px;padding-top:0.5em'>" + System.CultureInfo.GetDisplayText(option.content)
                    + ":</br><span><input type='text' class='k-input' style='margin-top:5px;width:300px' /></span><br/><span style='display:none' class='k-widget k-tooltip k-tooltip-validation k-invalid-msg'/><p>"
                    + "<div class='k-edit-buttons k-state-default'>  "
                    + "<button class='k-primary k-button' data-role='OK' style='width:60px'>" + System.CultureInfo.GetDisplayText("OK") + "</button>"
                    + "<button class='k-button' data-role='Cancel'  style='width:60px'>" + System.CultureInfo.GetDisplayText("Cancel") + "</button>"
                    + "</div>";
                var kwindow = winDiv.kendoWindow({
                    modal: true,
                    width: 400,
                    //height: 150,
                    title: System.CultureInfo.GetDisplayText(option.title),
                    resizable: true,
                    content: {
                        template: contentTemplate
                    },
                    deactivate: function () {
                        //var kwin = winDiv.getKendoWindow();
                        //kwin.destroy();
                        kwindow.destroy();
                    }
                }).data("kendoWindow");
                winDiv.find('[data-role=OK]').on('click', function () {
                    var inputcontrol = winDiv.find('.k-input');
                    var inputText = inputcontrol.val();
                    if (!inputText && option.inputRequired) {
                        var tooltip = winDiv.find('.k-tooltip');
                        if (!option.errorMessage) {
                            option.errorMessage = 'text is required';
                        }
                        tooltip.kendoTooltip({
                            autoHide: false,
                            position: "top",
                            content: option.errorMessage
                        }).data("kendoTooltip").show(winDiv.find('.k-input'));
                        return;
                    }
                    kwindow.close();
                    if (option.OK) {
                        return option.OK(inputText);
                    }
                    return true;
                });
                winDiv.find('[data-role=Cancel]').on('click', function () {
                    kwindow.close();
                    if (option.Cancel) {
                        return option.Cancel();
                    }
                    return false;
                });
                winDiv.find('.k-input').val(option.text);
                kwindow.center();
                kwindow.open();
            };
            MessageBox.confirm = function (option) {
                var winDiv = jQuery("<div class='k-popup-edit-form' style='overflow:hidden'/>");
                this.contentTemplate = "<div class='k-edit-form-container'><p class='k-popup-message'>" + System.CultureInfo.GetDisplayText(option.content) +
                    "<p><div class='k-edit-buttons k-state-default'>  "
                    + "<button class='k-primary k-button' data-role='OK' style='width:60px'>" + System.CultureInfo.GetDisplayText("OK") + "</button>"
                    + "<button class='k-button' data-role='Cancel'  style='width:60px'>" + System.CultureInfo.GetDisplayText("Cancel") + "</button>"
                    + "</div>";
                var kwindow = winDiv.kendoWindow({
                    modal: true,
                    width: 400,
                    //height: 140,
                    title: System.CultureInfo.GetDisplayText(option.title),
                    resizable: false,
                    content: {
                        template: this.contentTemplate,
                    },
                    deactivate: function () {
                        //var kwin = winDiv.getKendoWindow();
                        //kwin.destroy();
                        kwindow.destroy();
                        if (option.onClose)
                            option.onClose();
                    }
                }).data("kendoWindow");
                winDiv.find('[data-role=OK]').on('click', function () {
                    kwindow.close();
                    if (option.OK) {
                        return option.OK();
                    }
                    return true;
                });
                winDiv.find('[data-role=Cancel]').on('click', function () {
                    kwindow.close();
                    if (option.Cancel) {
                        return option.Cancel();
                    }
                    return false;
                });
                kwindow.center();
                kwindow.open();
            };
            MessageBox.showConfirmationWindow = function (message) {
                return this.showWindow(this.contentTemplate, message);
            };
            MessageBox.showWindow = function (template, message) {
                var dfd = jQuery.Deferred();
                var result = false;
                $("<div id='popupWindow'></div>")
                    .appendTo("body")
                    .kendoWindow({
                    width: "200px",
                    title: "",
                    modal: true,
                    visible: false,
                    close: function (e) {
                        this.destroy();
                        dfd.resolve(result);
                    }
                }).data('kendoWindow').content($(template).html())["center"]().open();
                $('.popupMessage').html(message);
                $('#popupWindow .confirm_yes').val('OK');
                $('#popupWindow .confirm_no').val('Cancel');
                $('#popupWindow .confirm_no').click(function () {
                    $('#popupWindow').data('kendoWindow').close();
                });
                $('#popupWindow .confirm_yes').click(function () {
                    result = true;
                    $('#popupWindow').data('kendoWindow').close();
                });
                return dfd.promise();
            };
            MessageBox.alert = function (title, content, timeout) {
                if (content === void 0) { content = ""; }
                if (!timeout) {
                    var seconds = (content.length / 8) * 2000;
                    timeout = Math.max(seconds, 2000);
                }
                //timeout = timeout || 2000;
                var winDiv = jQuery("<div class='k-popup-edit-form' style='overflow:hidden'/>");
                var contentTemplate = "<div class='k-edit-form-container'><p class='k-popup-message'>" + System.CultureInfo.GetDisplayText(content) +
                    "<p><div class='k-edit-buttons k-state-default'>  <button class='k-primary k-button' style='width:60px'>" + System.CultureInfo.GetDisplayText("OK") + "</button></div>";
                var kwindow = winDiv.kendoWindow({
                    modal: true,
                    width: 400,
                    title: System.CultureInfo.GetDisplayText(title),
                    resizable: false,
                    content: {
                        template: contentTemplate,
                    },
                    deactivate: function () {
                        kwindow.destroy();
                    }
                }).data("kendoWindow");
                winDiv.find('.k-button').on('click', function () {
                    kwindow.close();
                });
                if (timeout != "never")
                    window.setTimeout(function () {
                        kwindow.close();
                    }, timeout);
                kwindow.center();
                kwindow.open();
            };
            return MessageBox;
        }());
        MessageBox.kwindow = null;
        UI.MessageBox = MessageBox;
        //iframe对象
        var IframeItem = (function () {
            function IframeItem(src, flag, guid, iframe) {
                if (src === void 0) { src = ""; }
                if (flag === void 0) { flag = ""; }
                if (guid === void 0) { guid = ""; }
                if (iframe === void 0) { iframe = null; }
                this.src = src;
                this.flag = flag;
                this.guid = guid;
                this.iframe = iframe;
                this.loaded = false;
            }
            IframeItem.prototype.load = function () {
                if (!this.loaded && this.src) {
                    this.iframe.src = this.src;
                    this.loaded = true;
                }
            };
            ;
            return IframeItem;
        }());
        UI.IframeItem = IframeItem;
        var ComOption = (function () {
            function ComOption() {
                this.viewsReadUrl = new System.UrlObj("ViewsManager", "ViewList");
                this.listReadUrl = new System.UrlObj("Business", "GetListPage");
                this.viewColsReadUrl = new System.UrlObj("ViewsManager", "GetViewColumns");
                this.viewEditUrl = new System.UrlObj("ViewsManager", "UserViewSolutionEdit");
                this.viewDeleteUrl = new System.UrlObj("ViewsManager", "UserViewSolutionDel");
                this.viewGetPersonalSolutions = new System.UrlObj("ViewsManager", "GetPersonalViewSolutions");
                this.saveViewUrl = new System.UrlObj("ViewsManager", "AppendUserView");
                this.filterCreateQuerySolution = new System.UrlObj("ViewsManager", "CreateQuerySolution");
                this.filterEditUrl = new System.UrlObj("ViewsManager", "UserQuerySolutionEdit");
                this.filterDeleteUrl = new System.UrlObj("ViewsManager", "UserQuerySolutionDel");
                this.filterGetFormStructure = new System.UrlObj("ViewsManager", "GetFormStructure");
                this.filterGetItemsBySolutionId = new System.UrlObj("ViewsManager", "GetItemsBySolutionId");
                this.filterGetPersonalSolutions = new System.UrlObj("ViewsManager", "GetPersonalSolutions");
                this.filterGetAllSolutions = new System.UrlObj("ViewsManager", "GetAllSolutions");
                //表单视图
                this.formViewUrl = new System.UrlObj("ViewsManager", "GetFormView"); //或直接给出formViewModelId
                //表单视图列
                this.formViewColsUrl = new System.UrlObj("ViewsManager", "GetFormViewColumns");
                //增删改
                this.formProcessUrl = new System.UrlObj("Business", "FormProcess");
                this.listByEntityIdUrl = new System.UrlObj("Utilities", "GetListByFilter");
                this.pagerByEntityIdUrl = new System.UrlObj("Utilities", "GetPagerByFilter");
                /**枚举获取 */
                this.enumItemsUrl = new System.UrlObj("Utilities", "EnumItems");
                /**导出url */
                this.exportUrl = new System.UrlObj("Utilities", "GetExportFileUri");
                /**导入模板url */
                this.importTemplateUrl = new System.UrlObj("Utilities", "GetExportTemplete");
                /**导入url */
                this.importUrl = new System.UrlObj("Utilities", "ImportFile");
                /**get available buttons by Code*/
                this.getButtonsByCodeUrl = new System.UrlObj("Utilities", "GetButtonsByCode");
                /**general query for searchbox */
                this.query4SBUrl = new System.UrlObj("Utilities", "Query4SB");
                /**get GridEditItems */
                this.getGridEditItemsUrl = new System.UrlObj("Utilities", "GetGridEditItemsByPId");
                /**edito控件的统一处理URL*/
                this.editorBatchEditUrl = new System.UrlObj("Utilities", "BatchEdit");
            }
            return ComOption;
        }());
        UI.ComOption = ComOption;
        UI.ComOptionObj = new ComOption();
        UI.ctors = [];
        UI.documentReady = function (fn) {
            EAP.UI.ctors.push(fn);
        };
        //[ControllerName,...]
        UI.formControllers = [];
        //directiveControls
        UI.DirectiveControls = {};
        Storage.prototype["setObj"] == function (key, obj) {
            this.setItem(key, JSON.stringify(obj));
        };
        UI.DropDownListOptionsConvert = function (item, dataItem, comOption, enums, otherP) {
            if (otherP.type) {
                item.subType = otherP.type;
                delete otherP.type;
            }
            $.extend(item, otherP);
            if (otherP.entityId && otherP.filter)
                delete item.filter; //otherP.entityId?otherP.filter 则代表对实体的筛选
            if (otherP.url)
                item.readurl = otherP.url;
            else if (otherP.entityId) {
                item.readurl = {};
                $.extend(item.readurl, comOption.listByEntityIdUrl);
                item.postData = { entityId: otherP.entityId, filter: otherP.filter };
                //item.readurl.parameters = { entityId: otherP.entityId, filter: otherP.filter };
            }
            else if (otherP.enumId) {
                item.dataTextField = "Code";
                item.dataValueField = "Id";
                item.readurl = {};
                $.extend(item.readurl, comOption.enumItemsUrl);
                item.readurl.parameters = { id: otherP.enumId };
                item.dataProcess = item.dataProcess || function (datas) {
                    if (datas instanceof Array) {
                        datas.forEach(function (data) {
                            data.Code = System.CultureInfo.GetDisplayText(data.Code);
                        });
                    }
                    return datas;
                };
            }
            else {
                var matched = false;
                if (enums) {
                    for (var i = 0; i < enums.length; i++) {
                        if (enums[i].field == dataItem.Code) {
                            item.Data = enums[i].values;
                            matched = true;
                            break;
                        }
                    }
                }
                //匹配不到enum 根据DataType找默认配置
                if (!matched) {
                    switch (dataItem.DataType) {
                        case "bool":
                            item.Data = [];
                            item.Data.push({ text: System.CultureInfo.GetDisplayText('True'), value: true });
                            item.Data.push({ text: System.CultureInfo.GetDisplayText('False'), value: false });
                            break;
                    }
                }
            }
            if (!otherP.enumId) {
                if (otherP.dataTextField)
                    item.dataTextField = otherP.dataTextField;
                else
                    item.dataTextField = "text";
                if (otherP.dataValueField)
                    item.dataValueField = otherP.dataValueField;
                else
                    item.dataValueField = "value";
            }
            return item;
        };
        UI.SearchBoxOptionsConvert = function (item, dataItem, comOption, otherParameters) {
            var otherP = otherParameters;
            item.matchField = otherP.mathField || otherP.matchField;
            item.showField = otherP.showField;
            item.entityId = otherP.entityId;
            //$.extend(item, otherP)
            switch (otherP.type) {
                case "grid":
                    item.gridOptions = new EAP.UI.GridOption();
                    if (otherP.gridSolutionId) {
                        item.gridOptions.gridSolutionId = otherP.gridSolutionId;
                        item.gridOptions.viewColsReadUrl = comOption.viewColsReadUrl;
                    }
                    else if (otherP.columns) {
                        item.gridOptions.columns = [];
                        otherP.columns.forEach(function (citem) {
                            item.gridOptions.columns.push({
                                field: citem.field, title: System.CultureInfo.GetDisplayText(citem.title), template: function (data) {
                                    return System.Reference(data, citem.field);
                                }
                            });
                        });
                    }
                    else {
                        item.gridOptions.columns = [{
                                field: "Name", title: System.CultureInfo.GetDisplayText("Name"), template: function (data) {
                                    return data.Name || "";
                                }
                            }];
                    }
                    //if (otherP.entityId) {
                    //    item.gridDateRequestOptions = new EAP.UI.GridDataRequest();
                    //    item.gridDateRequestOptions.url = comOption.pagerByEntityIdUrl;
                    //    item.gridDateRequestOptions.postdata = { entityId: otherP.entityId, filterStr: otherP.filter };
                    //}
                    if (otherP.url) {
                        item.gridDateRequestOptions = new EAP.UI.GridDataRequest();
                        item.gridDateRequestOptions.url = otherP.url;
                    }
                    item.format = otherP.format;
                    item.multiselect = otherP.multiselect;
                    item.pageable = otherP.pageable;
                    item.editable = otherP.editable;
                    break;
                case "tree":
                    item.treeOptions = new EAP.UI.TreeOption();
                    if (otherP.url) {
                        item.treeOptions.readurl = otherP.url;
                    }
                    item.format = otherP.format;
                    item.multiselect = otherP.multiselect;
                    item.editable = otherP.editable;
                    break;
            }
        };
        ///Formton 转化入口
        //options={columnsAmount, titleWidth, controlUniteWidth, comOption,enums,Data}
        UI.FormViewColumnConvert = function (items, options) {
            var _getDropdownListValues = function (field) {
                if (!options.enums) {
                    return [];
                }
                for (var i = 0; i < options.enums.length; i++) {
                    if (options.enums[i].field == field)
                        return options.enums[i].values;
                }
            };
            //将ViewColumn对象数组转化成formcontrol.data可用类型 
            if (!items || items.length <= 0)
                return options.Data || [];
            var result = [];
            items.forEach(function (di) {
                if (!di.Code) {
                    result.push(di);
                    return;
                }
                if (!di.IsVisible)
                    return;
                var item = { validateOptions: {}, style: {}, colspan: di.Colspan, title: "", name: "", readonly: false, maxLength: 200, type: "", format: "", width: undefined };
                item.validateOptions["required"] = di.Required;
                item.title = di.CustomHeader || System.CultureInfo.GetDisplayText(di.Header);
                item.name = di.Code;
                item.readonly = di.ReadOnly;
                item.width = di.Width;
                var otherP = {};
                if (di.OtherParameter) {
                    otherP = JSON.parse(di.OtherParameter);
                }
                item.maxLength = otherP["maxLength"];
                if (di.ControlType.indexOf('.') == -1) {
                    item.type = di.ControlType;
                    switch (item.type) {
                        case "numericinput":
                            item["decimals"] = otherP["decimals"] || (di.DataType == "int" ? 0 : 1);
                            break;
                        case "datepicker":
                            item.format = otherP["format"] || System.CultureInfo.GetDateFormatStr();
                            break;
                        case "datetimepicker":
                            item.format = otherP["format"] || System.CultureInfo.GetDateTimeFormatStr();
                            break;
                        case 'dropdownlist':
                            UI.DropDownListOptionsConvert(item, di, options.comOption, options.enums, otherP);
                            break;
                        case 'searchbox':
                            UI.SearchBoxOptionsConvert(item, di, options.comOption, otherP);
                            break;
                        default:
                            $.extend(item, otherP);
                    }
                }
                else {
                    new Error("You should remove '.' from ControlType");
                }
                result.push(item);
            });
            return result = result.extends(options.Data || [], function (r) { return r.name; });
        };
        var NoTranslate = (function () {
            function NoTranslate(title) {
                if (title === void 0) { title = ""; }
                this.title = title;
            }
            return NoTranslate;
        }());
        UI.NoTranslate = NoTranslate;
        //视图列转成gridColumns
        UI.GridViewColumnConvert = function (items, customColumns) {
            var result = [], index = 0, that = this, length = items.length, remainLength = length, cloneCols = [];
            $.extend(cloneCols, customColumns);
            items.forEach(function (data) {
                var option = {
                    field: data.Code,
                    title: data.CustomHeader ? new NoTranslate(data.CustomHeader) : data.Header,
                    hidden: !data.IsVisible,
                    attributes: { style: "text-align:left" },
                    filterable: { cell: { enabled: data.IsFilterable } },
                    sortable: (!data.SortType || data.SortType === 0) ? false : true,
                    template: function (value) {
                        if (value) {
                            var result = System.Reference(value, data.Code);
                            if (result === undefined || result === null) {
                                return result || "";
                            }
                            switch (data.DataType) {
                                case "bool":
                                    return '<input type="checkbox" disabled ' + (result ? "checked" : "") + ' style="height: 16px;width: 16px;">';
                                //var bool = "False";
                                //if (result) bool = "True";
                                //return System.CultureInfo.GetDisplayText(bool);
                                case "select":
                                    return System.CultureInfo.GetDisplayText(result);
                                case "DateTime":
                                    return System.CultureInfo.FormatDateTime(result);
                                //return new Date(result).format('yyyy/MM/dd HH:mm');
                                case "Time":
                                    return new Date(result).format('HH:mm');
                                case "Date":
                                    return System.CultureInfo.FormatDate(result);
                                //return new Date(result).format('yyyy/MM/dd');
                                case "EAP.Core.EnumItem":
                                    if (result)
                                        return System.CultureInfo.GetDisplayText(result.Code);
                                    return "";
                                default:
                                    return result;
                            }
                        }
                    },
                    width: data.Width,
                    editor: null
                };
                switch (data.DataType) {
                    case "bool":
                        if (!data.IsReadOnly) {
                            option.editor = function (container, option) {
                                var input = document.createElement("input");
                                input.type = "checkbox";
                                input.name = data.Code;
                                container.append(input);
                            };
                        }
                        else
                            option["editable"] = false;
                        option.attributes = { style: "text-align:center" };
                        break;
                    case "select":
                        if (!data.IsReadOnly) {
                            option.editor = function (container, option) {
                                var select = document.createElement("select");
                                select.name = data.Code;
                                $(select).attr("data-value-primitive", "true");
                                container.append(select);
                                $(select).kendoDropDownList({
                                    dataTextField: "text", dataValueField: "value", dataSource: status, change: function (e) {
                                        // that.grid.refresh();
                                    }
                                });
                            };
                        }
                        else
                            option["editable"] = false;
                        option.attributes = { style: "text-align:center" };
                        break;
                    case "DateTime":
                        if (!data.IsReadOnly) {
                            option.editor = function (container, option) {
                                var input = document.createElement("input");
                                input.name = data.Code;
                                ;
                                container.append(input);
                                $(input).kendoDateTimePicker({ format: System.CultureInfo.GetDateTimeFormatStr() });
                                //$(input).kendoDateTimePicker({ formate: 'yyyy/MM/dd HH:mm' });
                            };
                        }
                        else
                            option["editable"] = false;
                        break;
                    case "Time":
                        if (!data.IsReadOnly) {
                            option.editor = function (container, option) {
                                var input = document.createElement("input");
                                input.name = option.field;
                                container.append(input);
                                $(input).kendoTimePicker({ format: 'HH:mm' });
                            };
                        }
                        else
                            option["editable"] = false;
                        break;
                    case "Date":
                        if (!data.IsReadOnly) {
                            option.editor = function (container, option) {
                                var input = document.createElement("input");
                                input.name = data.Code;
                                ;
                                container.append(input);
                                $(input).kendoDateTimePicker({ format: System.CultureInfo.GetDateFormatStr() });
                                //$(input).kendoDatePicker({ formate: 'yyyy/MM/dd' });
                            };
                        }
                        else
                            option["editable"] = false;
                        break;
                    case "int":
                    case "decimal":
                        if (!data.IsReadOnly) {
                            option.editor = function (container, option) {
                                var input = document.createElement("input");
                                input.name = data.Code;
                                ;
                                container.append(input);
                                $(input).kendoNumericTextBox();
                            };
                        }
                        else
                            option["editable"] = false;
                        //option.attributes = { style: "text-align:right" }
                        break;
                    case "EAP.Core.EnumItem":
                        option.attributes = { style: "text-align:center" };
                        break;
                    default:
                }
                for (var c = 0; c < cloneCols.length; c++) {
                    if (cloneCols[c].field == data.Code) {
                        var cCol = cloneCols.splice(c, 1)[0];
                        cCol.title = cCol.title || option.title;
                        option.attributes = undefined;
                        $.extend(option, cCol);
                        break;
                    }
                }
                result.push(option);
            });
            //有自定义列显示在其后
            return result.concat(cloneCols || []);
        };
        //获取视图列
        UI.GetGridViewColumns = function (gridViewId) {
            var controller = new EAP.EAMController();
            var that = this;
            var postData = { id: gridViewId };
            var viewColsReadUrl = EAP.UI.ComOptionObj.viewColsReadUrl;
            var reuslt = [];
            controller.ExecuteServerActionSync(viewColsReadUrl, postData, function (data) {
                reuslt = data;
            });
            return reuslt;
        };
        //迭代获取GridColumns  gridSolutionId:""||gridSolutionId:{id,subId}   { columns: cols, items: items, gridSolutionId: gridSolutionId ,subColumns:[]}
        UI.GetGridColumns = function (gridSolutionId, customColumns) {
            if (typeof gridSolutionId === "string") {
                var items = EAP.UI.GetGridViewColumns(gridSolutionId), cols = EAP.UI.GridViewColumnConvert(items, customColumns);
                return { columns: cols, items: items, gridSolutionId: gridSolutionId };
            }
            else if (gridSolutionId instanceof Object) {
                var items = EAP.UI.GetGridViewColumns(gridSolutionId.id), cols = EAP.UI.GridViewColumnConvert(items, customColumns ? customColumns.columns : null), result = { columns: cols, items: items, gridSolutionId: gridSolutionId };
                if (gridSolutionId.subId) {
                    result["subColumns"] = EAP.UI.GetGridColumns(gridSolutionId.subId, customColumns ? customColumns.subColumns : null);
                }
                return result;
            }
        };
        var MiniPager = (function () {
            function MiniPager(selector) {
                this.selector = selector;
                this._init();
            }
            MiniPager.prototype._init = function () {
                var optionObj = {
                    pageSize: false,
                    messages: { display: "{0}-{1}of{2}" },
                    numeric: false
                };
                this._pagerOption = optionObj;
                if (this.selector) {
                    this._kendoPager = $(this.selector).kendoPager(optionObj).data("kendoPager");
                }
            };
            Object.defineProperty(MiniPager.prototype, "pagerOption", {
                get: function () {
                    return this._pagerOption;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MiniPager.prototype, "kendoPager", {
                get: function () {
                    return this._kendoPager;
                },
                enumerable: true,
                configurable: true
            });
            ///**
            // * getPageOption
            // */
            //public getPageOption() {
            //    return this._pagerOption;
            //}
            ///**
            //* getKendoPager
            //*/
            //public getKendoPager() {
            //    return this._kendoPager;
            //}
            MiniPager.prototype.destroy = function () {
                if (this._kendoPager) {
                    this._kendoPager.destroy();
                }
            };
            return MiniPager;
        }());
        UI.MiniPager = MiniPager;
        UI.UiOption = System.Object.Extends({
            selector: '',
            owner: null
        });
        UI.TreeOption = EAP.UI.UiOption.Extends({
            showCheckBox: false,
            selector: '#tree',
            nodeClick: undefined,
            dragable: false,
            showIcon: true,
            checkChildren: false,
            check: null,
            requestOptions: null
        });
        UI.ITreeControl = System.Object.Extends({
            ctor: function (treeOption) {
            },
            setTreeData: function (data) {
            },
            getCheckedItems: function () {
            },
            expand: function () {
            },
            expandall: function () {
            },
            collapseall: function () {
            },
            collapse: function () {
            }
        });
        ///GridControl's initial Parameter
        var GridOption = (function (_super) {
            __extends(GridOption, _super);
            ///showrowcheckbox:是否显示复选框 默认false
            ///pageable:是否分页 默认true
            function GridOption(selector, showrowcheckbox, pageable) {
                if (selector === void 0) { selector = ''; }
                if (showrowcheckbox === void 0) { showrowcheckbox = false; }
                if (pageable === void 0) { pageable = true; }
                var _this = _super.call(this, selector) || this;
                _this.showrowcheckbox = showrowcheckbox;
                _this.pageable = pageable;
                _this.columns = [];
                //gridControl中未使用
                _this.gridSolutionId = null;
                //单选("row")或多选("multiple, row"),默认单选
                _this.selectable = "row";
                //选择改变之后 回调
                _this.change = undefined;
                //pageSizes = [10,20,30, 50, 100]
                //pageSize = 30
                //初始grid高度
                _this.height = undefined;
                //数据绑定回调
                _this.dataBound = null;
                /**dataBinding(e: kendo.ui.GridDataBindingEvent)*/
                _this.dataBinding = undefined;
                //是否筛选  mode: "row"=>行筛选
                _this.filterable = false;
                //双击事件
                _this.dblClick = null;
                _this.editable = false;
                _this.toolTip = false;
                _this.cellColor = false;
                _this.cellColorField = "ColorCells";
                _this.showIndex = false;
                _this.toolbar = null;
                _this.excelExport = undefined;
                return _this;
            }
            return GridOption;
        }(UiBasicOption));
        UI.GridOption = GridOption;
        var DataRequest = (function () {
            function DataRequest() {
                this.sync = false;
                this.responseData = undefined;
            }
            DataRequest.prototype.getRequest = function (request) {
                if (request) {
                    if (request instanceof DataRequest)
                        return request;
                    $.extend(this, request);
                    if (request.postdata) {
                        this._postdata = request._postdata || request.postdata;
                    }
                    return this;
                }
            };
            Object.defineProperty(DataRequest.prototype, "url", {
                get: function () {
                    if (this._url && Object.prototype.toString.call(this._url) === '[object Function]')
                        return this._url();
                    return this._url;
                },
                set: function (_url) {
                    this._url = _url;
                },
                enumerable: true,
                configurable: true
            });
            DataRequest.convertPostdata = function (cp) {
                if (!$.isArray(cp)) {
                    var result = $.extend({}, cp);
                    for (var name_1 in result) {
                        if (result[name_1] && Object.prototype.toString.call(result[name_1]) === '[object Function]') {
                            result[name_1] = result[name_1]();
                        }
                    }
                    return result;
                }
                return cp;
            };
            Object.defineProperty(DataRequest.prototype, "postdata", {
                ///不可直接添加属性和字段等 请使用apendPostData
                get: function () {
                    return EAP.UI.DataRequest.convertPostdata(this._postdata);
                },
                set: function (_postdata) {
                    this._postdata = _postdata;
                },
                enumerable: true,
                configurable: true
            });
            DataRequest.prototype.apendPostData = function (postdata) {
                if (!postdata)
                    return;
                if (!this._postdata)
                    this._postdata = postdata;
                if ($.isArray(postdata) && $.isArray(this._postdata)) {
                    //array
                    this._postdata = this._postdata.concat(postdata);
                }
                if (!$.isArray(postdata) && !$.isArray(this._postdata) && typeof postdata === "object" && typeof this._postdata === "object") {
                    //object
                    $.extend(this._postdata, postdata);
                }
            };
            DataRequest.prototype.clone = function () {
            };
            return DataRequest;
        }());
        UI.DataRequest = DataRequest;
        ///建议存在方法postdata的时候 不要使用扩展 例如$.extend() 使用apendPostData() 添加postdata内容，object类型存在覆盖作用
        var GridDataRequest = (function (_super) {
            __extends(GridDataRequest, _super);
            function GridDataRequest(request) {
                var _this = _super.call(this) || this;
                _this.onLoaded = undefined;
                _this.onError = undefined;
                return _super.prototype.getRequest.call(_this, request);
            }
            return GridDataRequest;
        }(EAP.UI.DataRequest));
        UI.GridDataRequest = GridDataRequest;
        var TreeListDataRequest = (function (_super) {
            __extends(TreeListDataRequest, _super);
            function TreeListDataRequest() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.subGridField = null;
                return _this;
            }
            return TreeListDataRequest;
        }(EAP.UI.GridDataRequest));
        UI.TreeListDataRequest = TreeListDataRequest;
        ;
        UI.ITreeListControl = System.Object.Extends({
            ctor: function () {
            },
            refresh: function () {
            },
            getSelectedId: function () {
            },
            getSelectedRows: function () {
            },
            setData: function (griddataRequest) {
            }
        });
        UI.TreeListOption = EAP.UI.UiOption.Extends({
            //添加属性eidtable  可以是{columns:[],subColumns:[]|{columns...}}
            columns: [],
            //gridControl中未使用  可以是{id:"",subId:""||{id...}}
            gridSolutionId: null,
            //单选("row")或多选("multiple, row"),默认单选
            selectable: "row",
            //选择改变之后 回调
            change: function () { },
            pageSizes: [5, 10, 20],
            pageSize: 10,
            //初始grid高度
            height: '80%',
            showrowcheckbox: false,
            //数据绑定回调
            dataBound: null,
            //是否筛选
            filterable: false,
            //双击事件
            dblClick: null,
            editable: null,
            pageable: true,
            //是否仅使用叶子节点
            leafOnly: false
        });
        /**older 弃用 请使用VinciToolBarOptions*/
        var ToolbarOption = (function (_super) {
            __extends(ToolbarOption, _super);
            /**older 弃用 请使用VinciToolBarOptions*/
            function ToolbarOption() {
                var _this = _super.call(this) || this;
                _this.items = [];
                ///是否远端获取按钮
                _this.pull = false;
                ///远端读取的url，pull为true才有效
                _this.readUrl = EAP.UI.ComOptionObj.getButtonsByCodeUrl;
                ///不填默认使用当前页面url参数code，前提pull=true
                _this.code = undefined;
                _this.click = undefined;
                return _this;
            }
            return ToolbarOption;
        }(UiBasicOption));
        UI.ToolbarOption = ToolbarOption;
        var TabsOption = (function (_super) {
            __extends(TabsOption, _super);
            function TabsOption() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                ///top,left,right,buttom
                _this.tabPosition = "top";
                ///会覆盖原有的，若是iframe 需要手动加载iframe内容
                _this.onActivate = undefined;
                ///Array<EAP.UI.TabItemOption> | EAP.UI.TabItemOption
                _this.Data = undefined;
                return _this;
            }
            return TabsOption;
        }(UiBasicOption));
        UI.TabsOption = TabsOption;
        var TabItemOption = (function (_super) {
            __extends(TabItemOption, _super);
            ///flag:在onActivate事件中标识tab   option.onActivate = function (e) { var flag = e.item.getAttribute("flag"); switch(flag){...}}
            ///selector:与item 互斥， 若有item 此项不填
            function TabItemOption(title, flag, selector) {
                if (title === void 0) { title = ''; }
                if (flag === void 0) { flag = ''; }
                if (selector === void 0) { selector = ''; }
                var _this = _super.call(this, selector) || this;
                _this.title = title;
                ///在onActivate事件中标识tab   option.onActivate = function (e) { var flag = e.item.getAttribute("flag"); switch(flag){...}}
                _this.flag = '';
                ///页签中内容与selector 互斥
                _this.item = undefined;
                ///是否可移除
                _this.removeable = false;
                ///标签移除事件，前提：removeable==true
                _this.onRemove = undefined;
                _this.flag = flag;
                return _this;
            }
            return TabItemOption;
        }(UiBasicOption));
        UI.TabItemOption = TabItemOption;
        var TabSubItem = (function () {
            function TabSubItem() {
                ///用来表示
                this.sign = '';
                ///与content互斥
                this.url = '';
                ///与url互斥
                this.content = '';
            }
            return TabSubItem;
        }());
        UI.TabSubItem = TabSubItem;
        var DialogOption = (function () {
            function DialogOption() {
                this.title = '';
                this.width = 420;
                this.height = 260;
                this.content = '';
                this.OK = undefined;
                this.Cancel = undefined;
            }
            return DialogOption;
        }());
        UI.DialogOption = DialogOption;
        var InputDialogOption = (function (_super) {
            __extends(InputDialogOption, _super);
            function InputDialogOption() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.errorMessage = '';
                _this.inputRequired = false;
                return _this;
            }
            return InputDialogOption;
        }(DialogOption));
        UI.InputDialogOption = InputDialogOption;
        ;
        //#region FormControl
        UI.DropdownListOption = EAP.UI.UiOption.Extends({
            bound: null,
            //应用||保存
            onChange: null,
            readurl: null,
            Data: null,
            dataTextField: "text",
            dataValueField: "value",
            postData: {},
            dataProcess: null
        });
        var SearchBoxOption = (function (_super) {
            __extends(SearchBoxOption, _super);
            function SearchBoxOption() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.style = {};
                _this.editable = false;
                //匹配键
                _this.matchField = "Id";
                _this.icon = "";
                return _this;
            }
            return SearchBoxOption;
        }(UiBasicOption));
        UI.SearchBoxOption = SearchBoxOption;
        var FormOption = (function (_super) {
            __extends(FormOption, _super);
            function FormOption() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /** 获取数据源URL*/
                _this.url = undefined;
                /** 控件配置项 {Array<any>} length>0 容器清空*/
                _this.Data = [];
                /** {Array<any>} array [{selector:"",Data},...,...] */
                _this.subForms = undefined;
                /** 控件名称 {string} 默认80px*/
                _this.titleWidth = "80px";
                /** 列的数量 {number} 若为0 则依据controlUniteWidth+titleWidth 自适应排版*/
                _this.columnsAmount = 3;
                /** 提交的URL {System.UrlObj} */
                _this.postUrl = undefined;
                /** 自定义验证 (d: any) => boolean */
                _this.customValidate = undefined;
                /**widgetCreated: (control: any, type:string, name:string) => void
                *每个控件生成后的回掉事件 grid DropDownList textarea editor datetimepicker datepicker input 这些控件可以使用*/
                _this.widgetCreated = undefined;
                /**
                 * 表单创建完成事件
                 * @param tableElement
                 */
                _this.tableCreated = undefined;
                /** 提交之前回调*/
                _this.prePostProcess = undefined;
                /** 自定义处理错误信息 原错误效果将不现实 function(errors)*/
                _this.processErrorMessages = undefined;
                ///EAP.UI.VinciButtonGroupOptions
                _this.buttonGroupOptions = undefined;
                ////自动展现编译，当前可以 setOption 进行编译
                //autoPerform:true
                /** 是否自动设置容器宽度 是则根据 columnsAmount controlUniteWidth+titleWidth 进行设置*/
                _this.autoWidth = false;
                /** 控件统一宽度 默认140*/
                _this.controlUniteWidth = 140;
                _this.trStyle = undefined;
                /** 控件readonly属性统一设置 默认false*/
                _this.readonly = false;
                /**数据绑定后事件*/
                _this.onDataBound = undefined;
                return _this;
            }
            return FormOption;
        }(UiBasicOption));
        UI.FormOption = FormOption;
        UI.FormAfterProcessObj = System.Object.Extends({
            controlType: "",
            behaviour: "",
            valueFieldName: "",
            processControl: {}
        });
        var EditApplicationOpion = (function (_super) {
            __extends(EditApplicationOpion, _super);
            function EditApplicationOpion() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.comOption = new EAP.UI.ComOption();
                ///与chang不同 是EditApplicationOpion应用|保存 触发的事件
                _this.onChange = undefined;
                _this.setOrd = false;
                _this.postUrl = undefined;
                _this.isWindow = false;
                _this.deleteUrl = undefined;
                ///option.prePost(pd,result);
                _this.prePost = undefined;
                _this.title = '';
                _this.gridHeight = undefined;
                _this.autoClose = true;
                ///Array<kendo.ui.ToolBarItem>
                _this.toolbarItems = undefined;
                _this.editable = true;
                _this.toolbar = true;
                return _this;
            }
            return EditApplicationOpion;
        }(EAP.UI.GridOption));
        UI.EditApplicationOpion = EditApplicationOpion;
        ;
        UI.FilterFormApplicationOpion = EAP.UI.UiOption.Extends({
            comOption: new EAP.UI.ComOption(),
            searchCallback: function (dataSource, filterResult) {
            },
            viewColumns: [],
            saveViewCallback: function (dataSource, filterResult) {
            },
            editViewCallback: function () { },
            columnsAmount: 8,
            titleWidth: '80px',
            enums: [],
            slideToggle: null //slideToggle(extend) 展开收缩时触发 extend==是否展开
        });
        var FormApplicationOption = (function (_super) {
            __extends(FormApplicationOption, _super);
            function FormApplicationOption() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.comOption = new EAP.UI.ComOption();
                //如果存在优先
                _this.formViewModelId = undefined;
                _this.funCode = "";
                _this.viewCode = "";
                ///表单视图  true 初始化data部分会加在其后，false 不加载视图
                _this.formView = true;
                _this.winTitle = "";
                _this.validatorOptions = undefined;
                _this.autoDestroy = false;
                _this.autoWidth = true;
                return _this;
            }
            return FormApplicationOption;
        }(EAP.UI.FormOption));
        UI.FormApplicationOption = FormApplicationOption;
        //
        var GridApplicationOption = (function (_super) {
            __extends(GridApplicationOption, _super);
            function GridApplicationOption() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /// <field name='selector' type='CssSelector|JQuery'>若不填gridOption，toolbarOption 或他们的selector 那么这个选项将非常重要</field>
                /// <field name='gridOption' type='EAP.UI.GridOption'>选填，GridOption.selector也可选填，若不填写则GridApplicationOption.selector必填</field>
                /// <field name='comOption' type='EAP.UI.ComOption'></field>
                /// <field name='gridDataRequest' type='GridDataRequest'></field>
                /// <field name='toolbarOption' type='EAP.UI.ToolbarOption'>选填，ToolbarOption.selector也可选填</field>
                _this.comOption = new EAP.UI.ComOption();
                _this.gridOption = new EAP.UI.GridOption();
                _this.gridDataRequest = undefined;
                _this.toolbarOption = new EAP.UI.ToolbarOption();
                ///form
                _this.formOption = new EAP.UI.FormApplicationOption();
                ///是否可筛选 默认表单筛选，
                _this.filter = true;
                ///filterFormControl.Data
                _this.filterData = undefined;
                ///表单筛选，false 为grid筛选
                _this.formFilter = true;
                ///视图方案
                _this.viewScheme = true;
                ///下拉框枚举值
                _this.enums = [];
                //
                _this.funCode = null;
                ///视图编号
                _this.viewCode = null;
                ///实体完整类名
                _this.entityId = undefined;
                ///服务接口完整名称
                _this.serviceId = undefined;
                //表单的另一个数据源 新增等其他情况时使用
                _this.formBaseData = {};
                ///edit 对数据源的处理 function (data,oper)
                _this.formDataProcess = undefined;
                ///自动加载数据
                _this.autoLoad = true;
                ///增上改之前的检查 function(data,"edit")  现只加了edit
                _this.processGate = undefined;
                ///删除验证 function(itemObjs)
                _this.delValiator = undefined;
                ///模块导入导出器 全名
                _this.importorExportor_FullName = undefined;
                ///最顶部区域 string||Array<string>
                _this.topOtherTools = undefined;
                ///导出模板表单方案Code
                _this.templateCode = undefined;
                return _this;
            }
            return GridApplicationOption;
        }(UiBasicOption));
        UI.GridApplicationOption = GridApplicationOption;
        var ContainerManagerOpotion = (function (_super) {
            __extends(ContainerManagerOpotion, _super);
            function ContainerManagerOpotion() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ContainerManagerOpotion;
        }(UiBasicOption));
        UI.ContainerManagerOpotion = ContainerManagerOpotion;
        //#endregion
        //export let IWindow = System.Object.Extends({
        //    showModalDialog: function (dialogOption) {
        //    }
        //});
    })(UI = EAP.UI || (EAP.UI = {}));
})(EAP || (EAP = {}));
var EAM;
(function (EAM) {
    var dateTimeFormat = "yyyy/MM/dd HH:mm";
    //用于_ajax
    System.Net.PostDataProcesser = function (data) {
        if (typeof data !== "object" || data === null)
            return data;
        data = jQuery.extend(jQuery.isArray(data) ? [] : {}, data);
        if (data instanceof Array)
            for (var i = 0; i < data.length; i++)
                data[i] = System.Net.PostDataProcesser(data[i]);
        else {
            for (var fname in data) {
                if (data[fname] && data[fname] instanceof Date) {
                    data[fname] = data[fname].format(dateTimeFormat);
                    continue;
                }
                data[fname] = System.Net.PostDataProcesser(data[fname]);
            }
        }
        return data;
    };
    ///用于 System.Permission 
    System.Permission.getPermissions = function (mCode) {
        var postData = {};
        if (mCode)
            postData["code"] = mCode;
        return new EAP.EAMController().ExecuteServerActionSync(EAP.UI.ComOptionObj.getButtonsByCodeUrl, postData);
    };
    System.Permission.matchCode = function (item, name) { return item == name; };
    var ButtonsIcon = (function () {
        function ButtonsIcon() {
        }
        Object.defineProperty(ButtonsIcon, "iconUrl", {
            get: function () {
                if (!this.moduelName)
                    this._getModuelName();
                return this.URL.format(this.moduelName);
            },
            set: function (url) {
                this.URL = url;
            },
            enumerable: true,
            configurable: true
        });
        ButtonsIcon._getModuelName = function () {
            var thisUrl = window.location.pathname;
            var array = thisUrl.split('/');
            if (!array[1])
                throw Error("moduelName is empty");
            this.moduelName = array[1];
        };
        ButtonsIcon.getIconClass = function (name) {
            if (!this._data) {
                this._getData();
            }
            var lower = name.toLowerCase();
            var value = this._data[lower];
            if (value == undefined) {
                if (lower.indexOf("_"))
                    value = this._data[lower.split("_")[0]];
            }
            return value || this._data[this.OTHER];
        };
        ButtonsIcon._getData = function () {
            var client = new System.Net.HttpClient();
            var req = new System.Net.HttpRequest();
            req.url = this.iconUrl;
            try {
                this._data = JSON.parse(client.getfileSync(req));
            }
            catch (e) {
                this._data = {};
            }
            return this._data;
        };
        return ButtonsIcon;
    }());
    ButtonsIcon.URL = "/Resource/Scripts/Buttons/{0}.json";
    ButtonsIcon.OTHER = "other";
    ButtonsIcon.moduelName = "";
    EAM.ButtonsIcon = ButtonsIcon;
    var ExportOptions = (function () {
        function ExportOptions() {
            this.url = "";
            this.postData = {};
            this.methodName = "";
            this.exportorFullName = "";
        }
        return ExportOptions;
    }());
    EAM.ExportOptions = ExportOptions;
    var Export = (function () {
        function Export(options) {
            this.options = options;
        }
        //默认同步 AsynFn=>异步回调
        Export.prototype.getFilePath = function (AsynFn) {
            var that = this;
            //可自选导出执行的方法名称
            if (that.options.methodName)
                that.options.postData["methodName"] = that.options.methodName;
            that.options.postData["imex_FullName"] = that.options.exportorFullName;
            that.options.postData["language"] = System.Cookies.get('EAMLANGUAGE');
            that.options.postData["buid"] = parseInt(System.Cookies.get('Buid'));
            return new EAP.EAMController()[AsynFn ? "ExecuteServerAction" : "ExecuteServerActionSync"](that.options.url, that.options.postData, AsynFn);
        };
        Export.prototype.icon = function (show) {
            var iDiv = this.iDiv;
            if (show) {
                if (!iDiv) {
                    this.iDiv = iDiv = document.createElement("div");
                    iDiv.style.position = "fixed";
                    iDiv.style.backgroundColor = "silver";
                    iDiv.style.width = "80px";
                    iDiv.style.height = "80px";
                    iDiv.style.bottom = "4px";
                    iDiv.style.right = "4px";
                    iDiv.innerHTML = ' <span style="width:100%;height:100%;display: block;font-size:34px" class="k-icon k-i-download twinkle animated "></span>';
                }
                document.getElementsByTagName("body")[0].appendChild(iDiv);
            }
            else if (iDiv) {
                $(iDiv).remove();
            }
        };
        Export.prototype.export = function (fileUri) {
            var _this = this;
            var that = this;
            if (!fileUri) {
                that.icon(true);
                that.getFilePath(function (f) {
                    if (!that.downloadFram) {
                        that.downloadFram = document.createElement('iframe');
                        that.downloadFram.name = "IamDownLoadIframe";
                        document.getElementsByTagName('body')[0].appendChild(_this.downloadFram);
                    }
                    that.icon(false);
                    that.downloadFram.src = f;
                    that.downloadFram.style.display = "none";
                });
            }
            else {
                if (!that.downloadFram) {
                    that.downloadFram = document.createElement('iframe');
                    that.downloadFram.name = "IamDownLoadIframe";
                    document.getElementsByTagName('body')[0].appendChild(this.downloadFram);
                }
                that.downloadFram.src = fileUri.toString();
                that.downloadFram.style.display = "none";
            }
            //下载文件
            //this.downloadLink = document.createElement('a');
            //this.downloadLink.href = fileUri;
            // this.downloadLink.click();
            //会产生：Resource interpreted as Document but transferred with MIME type application/vnd.ms-excel 问题
            //window.location.href = fileUri;
            //window.open(fileUri) //, '_blank'
            //也会产生：Resource interpreted as Document but transferred with MIME type application/vnd.ms-excel 问题
        };
        Export.prototype.setOptions = function (opitons_new) {
            $.extend(this.options, opitons_new);
        };
        return Export;
    }());
    EAM.Export = Export;
    var ImportOptions = (function () {
        function ImportOptions() {
            this.url = "";
            // postData: Object = {};
            this.methodName = "";
            this.importorFullName = "";
            this.selector = "";
            this.items = "";
            this.templateDownloadLink = null;
            this.autoUpload = false;
            this.success = undefined;
            this.error = undefined;
            this.templateCode = "";
            this.accept = "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        }
        return ImportOptions;
    }());
    EAM.ImportOptions = ImportOptions;
    var Import = (function () {
        function Import(options) {
            this.options = options;
            this.elements = [];
            this.kUploads = [];
            this.defaultWindowOptions = {
                title: System.CultureInfo.GetDisplayText('Import'),
                modal: true
            };
            this._initUploadOptions();
            this._createImportControl();
            this._convertKendoContol();
        }
        ///初始化UploadOptions
        Import.prototype._initUploadOptions = function () {
            var that = this;
            this.defaultUploadOptions = {
                multiple: false,
                success: function (e) {
                    var obj = JSON.parse(e.XMLHttpRequest.responseText);
                    if (obj.IsSuccess) {
                        if (that.options.success)
                            that.options.success(obj.Data);
                        else
                            EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('Upload') + System.CultureInfo.GetDisplayText('Success'));
                        return;
                    }
                    if (that.options.error)
                        that.options.error(obj.Message);
                    else
                        EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('Upload') + System.CultureInfo.GetDisplayText('Fail') + ":" + System.CultureInfo.GetDisplayText(obj.Message));
                },
                async: {
                    saveUrl: '',
                    autoUpload: false
                },
                error: function (e) {
                    var obj = JSON.parse(e.XMLHttpRequest.responseText);
                    if (that.options.error)
                        that.options.error(obj.Message);
                    else
                        EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('Upload') + System.CultureInfo.GetDisplayText('Fail') + ":" + System.CultureInfo.GetDisplayText(obj.Message), 5000);
                }
            };
            var superParameters = {
                imex_FullName: this.options.importorFullName,
                methodName: this.options.methodName,
                FormCode: this.options.templateCode
            };
            if (typeof this.options.url === 'string') {
                this.defaultUploadOptions.async.saveUrl = this.options.url;
            }
            else {
                var urlobj = this.options.url;
                this.defaultUploadOptions.async.saveUrl = "/" + urlobj.controller + "/" + urlobj.action;
                if (urlobj.parameters)
                    $.extend(superParameters, urlobj.parameters);
            }
            this.defaultUploadOptions.async.saveUrl = System.Url.Combine(this.defaultUploadOptions.async.saveUrl, superParameters);
        };
        Import.prototype.import = function () {
            //this.kUploads[0][1].wrapper.find('.k-upload-button').trigger('click');
            //不是自动提交 则设置为自动
            if (!this.options.autoUpload) {
                this.kUploads.forEach(function (kupload) {
                    kupload[1].setOptions({ async: { autoUpload: true } });
                });
            }
            $(this.elements).trigger('click');
            return this;
        };
        Import.prototype._createImportControl = function () {
            var _this = this;
            var that = this;
            if (this.options.selector) {
                if (this.options.selector instanceof Array) {
                    this.options.selector.forEach(function (value, index) {
                        that.elements.push($(value)[0]);
                    });
                }
                else {
                    that.elements.push($(this.options.selector)[0]);
                }
            }
            if (this.options.items) {
                var importContrainer_1 = this.importContainer = document.createElement('div');
                importContrainer_1.id = "importContainer";
                importContrainer_1.style.display = 'none';
                importContrainer_1.style.width = "420px";
                if (this.options.items instanceof Array) {
                    this.options.items.forEach(function (value, index) {
                        if (!value)
                            return;
                        var fileControl = document.createElement('input');
                        fileControl.name = value;
                        fileControl.type = 'file';
                        fileControl.accept = that.options.accept;
                        importContrainer_1.appendChild(fileControl);
                        that.elements.push(fileControl);
                        if (_this.options.templateDownloadLink) {
                            _this.options.templateDownloadLink.forEach(function (tdl) {
                                if (tdl.name == value) {
                                    var link = document.createElement('a');
                                    link.href = 'javascript:void(0)';
                                    link.onclick = function () {
                                        new EAP.EAMController().ExecuteServerActionSync(EAP.UI.ComOptionObj.importTemplateUrl, { imex_FullName: that.options.importorFullName, FormCode: that.options.templateCode }, function (data) {
                                            if (!that.downloadFram) {
                                                that.downloadFram = document.createElement('iframe');
                                                that.downloadFram.name = "DownLoadTemplateIframe";
                                                document.getElementsByTagName('body')[0].appendChild(that.downloadFram);
                                            }
                                            that.downloadFram.src = data;
                                            that.downloadFram.style.display = "none";
                                        });
                                    };
                                    link.innerText = System.CultureInfo.GetDisplayText('DownTemplate');
                                    importContrainer_1.appendChild(link);
                                }
                            });
                        }
                    });
                }
                else {
                    var fileControl = document.createElement('input');
                    fileControl.name = this.options.items;
                    fileControl.type = 'file';
                    importContrainer_1.appendChild(fileControl);
                    that.elements.push(fileControl);
                    if (this.options.templateDownloadLink) {
                        this.options.templateDownloadLink.forEach(function (tdl) {
                            if (tdl.name == _this.options.items) {
                                var link = document.createElement('a');
                                link.href = 'javascript:void(0)';
                                link.onclick = function () {
                                    new EAP.EAMController().ExecuteServerActionSync(EAP.UI.ComOptionObj.importTemplateUrl, { imex_FullName: that.options.importorFullName, FormCode: that.options.templateCode }, function (data) {
                                        if (!that.downloadFram) {
                                            that.downloadFram = document.createElement('iframe');
                                            that.downloadFram.name = "DownLoadTemplateIframe";
                                            document.getElementsByTagName('body')[0].appendChild(that.downloadFram);
                                        }
                                        that.downloadFram.src = data;
                                        that.downloadFram.style.display = "none";
                                    });
                                };
                                link.innerText = System.CultureInfo.GetDisplayText('DownTemplate');
                                importContrainer_1.appendChild(link);
                            }
                        });
                    }
                }
                $('body').append(importContrainer_1);
            }
        };
        Import.prototype._convertKendoContol = function () {
            var _this = this;
            var that = this;
            this.defaultUploadOptions.async.autoUpload = this.options.autoUpload;
            this.elements.forEach(function (value, index) {
                that.kUploads.push([value.name, $(value).kendoUpload(_this.defaultUploadOptions).data('kendoUpload')]);
            });
        };
        Import.prototype.open = function () {
            if (this.importContainer)
                this.kWindow = $(this.importContainer).kendoWindow(this.defaultWindowOptions).data('kendoWindow');
            this.kWindow.center().open();
            return this;
        };
        Import.prototype.close = function () {
            this.kWindow.close();
            return this;
        };
        Import.prototype.destroy = function () {
            this.kUploads.forEach(function (value, index) {
                value[1].destroy();
            });
            this.options = null;
            this.kUploads = null;
            if (this.kWindow)
                this.kWindow.destroy();
        };
        return Import;
    }());
    EAM.Import = Import;
    var GridViewColumn = (function () {
        function GridViewColumn(Code, CustomHeader, DataType, Width, IsExport, IsVisible) {
            if (IsVisible === void 0) { IsVisible = true; }
            this.Code = Code;
            this.CustomHeader = CustomHeader;
            this.DataType = DataType;
            this.Width = Width;
            this.IsExport = IsExport;
            this.IsVisible = IsVisible;
            this.Id = undefined;
            //public IsExport: boolean = undefined
            this.FormElement = undefined;
            this.IsReadOnly = undefined;
            //public Width: number = undefined
            this.ControlAttribute = undefined;
            this.ControlType = undefined;
            this.ColumnIndex = undefined;
            this.IsFilterable = undefined;
            //public DataType: string = undefined
            //public IsVisible: boolean = undefined
            this.IsSystem = undefined;
            this.Header = undefined;
            this.DataField = this.Code;
            this.IdGridViewModel = undefined;
            //public Code: string = undefined
            this.Name = undefined;
            this.Description = undefined;
            //public CustomHeader: string = undefined
            this.SortType = undefined;
        }
        Object.defineProperty(GridViewColumn.prototype, "GridColumn", {
            ///以后会使用它
            get: function () {
                return {};
            },
            enumerable: true,
            configurable: true
        });
        return GridViewColumn;
    }());
    EAM.GridViewColumn = GridViewColumn;
    var ImageHelper = (function () {
        /**
         *
         * @param element
         * @param options  popup必须需要anchor
         */
        function ImageHelper(element, options) {
            this.element = element;
            this.options = options;
            this.defaultSize = [500, 500];
            if (this.options.window)
                this.setWindowOptions();
            else if (this.options.popup)
                this.setPopupOptions();
            else
                this.fillImage(this.options.id); //popupOptions没有，则直接显示图片
        }
        ImageHelper.prototype.fillImage = function (id) {
            var that = this, options = that.options, size = options.size || that.defaultSize;
            that.uri = ImageHelper.getImageUri(id); //display: "table",
            var extansion = "";
            $(that.element).empty().append("<div style='display: table-cell;vertical-align: middle;'><a href='" + that.uri + "' target='_blank'><img src='" + that.uri + "' alt='" + that.uri + "' style='max-width:" + (size[0] - 2) + "px;max-height:" + (size[1] - 2) + "px;'/></a></div>");
        };
        ImageHelper.prototype.setWindowOptions = function () {
            var that = this, options = that.options, wops = options.window;
            $(document.body).on("click", that.options.anchor || "", function (e) {
                if ($.isFunction(options.id))
                    that.fillImage(options.id(e));
                if (!that.vinciWindow)
                    that.vinciWindow = $(that.element).kendoVinciWindow({ open: function () { return $(that.element).css({ display: "table", textAlign: "center" }); }, title: "" }).data("kendoVinciWindow");
                $(that.element).resize(function () {
                    return that.vinciWindow.center();
                });
                that.vinciWindow.open();
            });
        };
        ImageHelper.prototype.setPopupOptions = function () {
            var that = this, options = that.options, pops = options.popup;
            if (!pops)
                return;
            var pops_copy = $.extend({}, pops), customAnchorTrigger = pops_copy.anchorTriggerCallback;
            pops_copy.anchorTriggerCallback = function (e) {
                if ($.isFunction(options.id))
                    that.fillImage(options.id(e));
                if (customAnchorTrigger)
                    customAnchorTrigger(e);
            };
            pops_copy.anchor = options.anchor || pops_copy.anchor;
            pops_copy.customSize = options.size;
            pops_copy.open = function () {
                $(that.element).css({ display: "table", textAlign: "center" });
            };
            that.vinciPopup = $(that.element).kendoVinciPopup(pops_copy).data("kendoVinciPopup");
        };
        ImageHelper.getImageUri = function (id) {
            if (!id)
                return "";
            return new EAP.EAMController().ExecuteServerActionSync(new System.UrlObj("Attachment", "URL"), { id: id });
        };
        return ImageHelper;
    }());
    EAM.ImageHelper = ImageHelper;
})(EAM || (EAM = {}));
(function (jq) {
    //ajax 错误统一处理
    System.Net.HttpErrorHandler = {
        ShowError: function (msg) {
            if (EAP.UI.MessageBox) {
                EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText("Error"), System.CultureInfo.GetDisplayText(msg));
            }
            else {
                alert(msg);
            }
        }
    };
    jq.fn.AngularController = function (fn, app) {
        return new System.AngularController(this[0], fn, app);
    };
    jq.fn.AngularApp = function (appDependency) {
        if (appDependency === void 0) { appDependency = new Array(); }
        return new System.AngularApp(this[0], appDependency);
    };
    jq.fn.DivCell = function (options, mark) {
        ///<param name="options" type="any"> { align, width, height, destroy }</param>
        return new System.DivCell(this[0], options, mark);
    };
    jq.fn.DivLattic = function (options, divArray) {
        ///<param name="options" type="any"> { align,width }</param>
        ///<param name="divArray" type="Array<System.DivCell | System.DivRow >"> </param>
        return new System.DivLattic(this[0], options, divArray);
    };
})(jQuery);
