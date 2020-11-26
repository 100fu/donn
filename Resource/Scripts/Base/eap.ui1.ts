/// <reference path="../../../scripts/typings/eap1.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/kendo-ui/kendo.web.d.ts" />

document.onreadystatechange = function (e) {
    if (document.readyState == 'complete') {
        for (let fn in EAP.UI.ctors) {
            EAP.UI.ctors[fn]();
        }
    }
}
interface Storage {
    getObject(key: string): any
    setObject(key: string, obj: any): void
}
if (!Storage.prototype.getObject) {
    Storage.prototype.getObject = function (key: string) {
        var result = this.getItem(key);
        try {
            return JSON.parse(result);
        }
        catch (e) {
            return result;
        }
    }
}
if (!Storage.prototype.setObject) {
    Storage.prototype.setObject = function (key, obj) {
        this.setItem(key, JSON.stringify(obj))
    }
}

interface Array<T> {
    distinct(fn?: (obj: T) => number | string): Array<T>
    //select(fn: (obj) => any): Array<any>
    where(fn: (obj: T) => boolean): Array<T>
    group(fn: (obj: T) => number | string): Array<IGrouping<T>>
    firstOrDefault(fn: (obj: T) => boolean): T
    extends(targets: Array<any>, fn: (obj: T) => string, extendsMathod?: (obj: T, target: any) => T): Array<T>
    sum(fn: (obj: T) => number): number
    /**
        * js raw findIndex mathod is never supported by IE
        */
    findIndex(fn: (obj: T) => boolean): number
}



//interface Math {
//    minInArrary(array: Array<number | string>): number|string
//}

///Array distinct very very good, admir myself
if (!Array.prototype.distinct)
    Array.prototype.distinct = function (fn?: (obj) => number | string) {
        let o: Object = {}, a = [], i, e;
        for (i = 0; e = this[i]; i++) { o[fn ? fn(e) : this[i]] = e }
        for (i in o) { if (o.hasOwnProperty(i)) a.push(o[i]) }
        return a;
    }
//if (!Array.prototype.select)  请使用map
//    Array.prototype.select = function (fn: (obj) => any) {
//        let a = [], i, e;
//        for (i = 0; e = this[i] && fn ? fn(this[i]) : undefined; i++) a.push(e);
//        return a;
//    }
if (!Array.prototype.where)
    Array.prototype.where = function (fn: (obj) => boolean) {
        if (!fn) return this;
        let a = [], i, e, s;
        for (i = 0; e = this[i]; i++) {
            s = fn(e); if (s) a.push(e);
        }
        return a;
    }
interface IGrouping<T> extends Array<T> {
    Key: any
}
if (!Array.prototype.group)
    Array.prototype.group = function (fn: (obj) => string | number) {
        let a = [], i, e, s, o = {};
        for (i = 0; e = this[i]; i++) {
            s = fn(e);
            if (o[s]) o[s].push(e)
            else o[s] = [e]
        }
        for (i in o) { if (o.hasOwnProperty(i)) { o[i].Key = i; a.push(o[i]) } }
        return a;
    }
if (!Array.prototype.firstOrDefault)
    Array.prototype.firstOrDefault = function (fn: (obj) => boolean) {
        let i, e;
        for (i = 0; e = this[i]; i++)if (fn(e)) return e
    }
if (!Array.prototype.extends)
    Array.prototype.extends = function (targets, fn, extendsMathod?) {
        let o: Object = {}, a = [], i, e, all = this.concat(targets);
        for (i = 0; e = all[i]; i++) {
            let n = fn ? fn(e) : all[i];
            o[n] = o[n] ? (extendsMathod || $.extend)(o[n], e) : e
        }
        for (i in o) { if (o.hasOwnProperty(i)) a.push(o[i]) }
        return a;
    }
if (!Array.prototype.sum)
    Array.prototype.sum = function (fn: (obj) => number) {
        let sum = 0, i, e
        for (i = 0; e = this[i]; i++) sum += fn(this[i])
        return sum;
    }
if (!Array.prototype.findIndex)
    Array.prototype.findIndex = function (fn: (obj) => boolean) {
        let i, e;
        for (i = 0; e = this[i]; i++)if (fn(e)) return i; return -1;
    }

namespace Patterns {
    /**
     * singleton
     * @param fn {Function|ObjectConstructor} Function must return something, and this returns will be single.
     * @param isClass
     * @param classArgs
     */
    export let Singleton = (fn: Function | ObjectConstructor, isClass?: boolean, ...classArgs: Array<any>): any => {
        let result;
        if (isClass)
            return function () {
                return result || (result = new (fn as ObjectConstructor)(classArgs));
            }
        return function () { //不能改写成 ()=> 形式
            return result || (result = (fn as Function).apply(this, classArgs));
        }
    }

    export abstract class Composite {
        private id: string
        /**System.GUID*/
        public get Id(): string {
            return this.id || (this.id = System.GUID.NewId());
        }
        private children: Composite[] = []
        private parent: Composite
        public Remove(index: number | string): Composite {
            if (typeof index === "number")
                return this.children.splice(index, 1)[0];
            else if (System.GUID.Validate(index))
                return this.children.firstOrDefault(c => c.Id === index);
        }
        public Add(item: Composite): Composite {
            if (item && item instanceof Composite) this.children.push(item);
            return this;
        }
        public Children(): Composite[] {
            return this.children;
        }
        public Parent(): Composite {
            return this.parent;
        }
        /**
        * 部件自有属性摧毁方法 
        */
        protected destroy() {}
        public Destory() {
            let ri: Composite
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
        }
    }

    export abstract class SimplyFactory<T> {  //建议使用Singleton来完善工厂
        private workshops = {}
        Generate(name: string): T {
            return (this.workshops[name] || this[name])()
        }
    }

    export abstract class AbstractFactory {

    }

    //export abstract class 
}

namespace System {
    export interface IGUIDBuilder {
        NewId(): string
        /**{xxx...} or xxx....*/
        Validate(str: string): boolean
    }
    class GUIDBuilder implements IGUIDBuilder {
        private s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        public NewId(): string {
            return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
                this.s4() + '-' + this.s4() + this.s4() + this.s4();
        }
        public Validate(str: string): boolean {
            return new RegExp(/^{?[\da-f]{8}(-[\da-f]{4}){4}[\da-f]{8}\}?$/i).test(str);
        }
    }
    /**
     * GUID Builder, doesn't built by logic of ms
     */
    export let GUID: IGUIDBuilder = Patterns.Singleton(GUIDBuilder, true)


    /**转化source=》target*/
    export let ReplaceJsonShrink = (target, source): Object | Array<any> => {
        if (target instanceof Array) {
            let template = target[0], data = {};
            $.extend(true, data, template);
            target = [];
            if (template) {
                source.forEach(function (d) {
                    System.ReplaceJsonShrink(data, d);
                    target.push(data);
                });
            }
        } else {
            for (let propName in target) {
                if (target[propName] instanceof Object) System.ReplaceJsonShrink(target[propName], source[propName]);
                target[propName] = source[propName];
            }
        }
        return target;
    }
    //UrlObj
    export class UrlObj {
        constructor(public controller: string, public action: string, public parameters?: Object) { }
        public toString() {
            let url = "/" + this.controller + '/' + this.action;
            if (this.parameters) {
                url = System.Url.Combine(url, System.Net.PostDataProcesser(this.parameters));
            }
            return url;
        }
    }

    export class PageData implements Storage {
        private static storage: Storage
        length: number;
        clear(): void {
            System.PageDataTransportationStore = new Object();
            if (parent && parent.window)
                parent.window["System"].PageData.Storage.clear()
        };
        key(index: number): string { return "not Sport" };
        [key: string]: any;
        [index: number]: string;

        removeItem(key: string): void {
            System.PageDataTransportationStore[key] = undefined;
            if (parent && parent.window)
                parent.window["System"].PageData.Storage.removeItem(key)
        };
        //self&parent
        public setObject(key: string, value: any) {
            System.PageDataTransportationStore[key] = value;
            if (parent && parent.window)
                parent.window["System"].PageData.Storage.setObject(key, value)
            // parent.window[key] = value;
        }
        //self|parent
        public getObject(key: string): any {
            if (System.PageDataTransportationStore[key]) {
                return System.PageDataTransportationStore[key];
            }
            if (parent && parent.window)
                return parent.window["System"].PageData.Storage.getObject(key)
            return undefined;
        }
        public setItem(key: string, value: string): void {
            this.setObject(key, value);
        }
        public getItem(key: string): any {
            return this.getObject(key);
        }
        public static get Storage(): Storage {
            if (PageData.storage)
                return PageData.storage;
            return this.storage = new PageData();
        }
    }
    export let PageDataTransportationStore = new Object()
    //页面数据传递  Storage 
    export class Transportation {
        static TRANSPORTSIGN = 'TransportSign'
        //可设置参数
        public static local = false
        public static sign: string = Transportation["getSign"]()
        public static pageData = false
        ///初始化sign
        private static getSign(): string {
            if (document.location.search.indexOf(this.TRANSPORTSIGN) >= 0) {
                return System.Url._get(this.TRANSPORTSIGN);
            }
            return new Date().getTime().toString();
        }
        public static setSignForUrl(url: string | System.UrlObj) {
            if (typeof url === "string") {
                return System.Url.Combine(url, { TransportSign: this.sign });
            }
            let obj = (url as System.UrlObj);
            if (!obj.parameters) obj.parameters = new Object();
            obj.parameters[this.TRANSPORTSIGN] = this.sign;
            return url;
        }
        static get _storage(): Storage {
            if (typeof Storage === "undefined" || this.pageData) {
                return PageData.Storage;
            }

            if (this.local)
                return localStorage;
            else
                return sessionStorage;
        }
        public static setValue(key: string, value: any): void {
            if (typeof value === "object") {
                this._storage.setObject(key + "_" + this.sign, value);
            } else {
                this._storage.setItem(key + "_" + this.sign, value);
            }
        }

        public static getValue(key: string) {
            return this._storage.getObject(key + "_" + this.sign);
        }

        public static clear() {
            this._storage.clear();
        }

        public static removeItem(key: string) {
            this._storage.removeItem(key + "_" + this.sign);
        }
    }
    //调用父页面方法，数据使用System.Transportation
    export let InvokeParent = (mothedName: string) => {
        var method = System.Reference(parent.window, mothedName);
        var index = mothedName.lastIndexOf('.');
        if (index == -1)
            (<Function>method).apply(parent.window);
        else {
            var call = System.Reference(parent.window, mothedName.substr(0, index));
            (<Function>method).apply(call);
        }
    }
    //调用子页面方法，数据使用System.Transportation
    export let InvokeChild = (iframe: HTMLIFrameElement, mothedName: string) => {
        var method = System.Reference(iframe.contentWindow.window, mothedName);
        var index = mothedName.lastIndexOf('.');
        if (index == -1)
            (<Function>method).apply(iframe.contentWindow.window);
        else {
            var call = System.Reference(iframe.contentWindow.window, mothedName.substr(0, index));
            (<Function>method).apply(call);
        }
    }

    export class Permission {
        private static _permissions: Object = {}
        ///fn(moduleCode:string):Array<any> 
        static getPermissions: (mCode?: string) => Array<any> = undefined
        ///fn(item, code):boolean
        static matchCode: (item, code) => boolean = (item, code) => { return item.Code == code }
        /// pCod 是Code 或Name 不重要 主要看matchCode怎么匹配。验证按钮或页面权限都可以，主要看getPermissions的设定
        static validatePermission(pCod: string, moduleCode?: string): boolean {
            var allPermission
            if (!this._permissions[moduleCode || "current"]) {
                if (!this.getPermissions) throw new Error(" getPermissions is null ")
                else {
                    allPermission = this._permissions[moduleCode || "current"] = this.getPermissions(moduleCode)
                }
            }
            else allPermission = this._permissions[moduleCode || "current"]
            let result = false;
            if (allPermission) {
                if ($.isArray(allPermission)) {
                    for (let i = 0; i < allPermission.length; i++)   if (result = this.matchCode(allPermission[i], pCod)) break
                }
                else
                    return this.matchCode(allPermission, pCod)
            }
            return result;
        }

    }

    export class AngularApp {
        APPNAME = "angularApp"
        NGAPP = "ng-app"
        private _module: angular.IModule
        public $controllerProvider;
        static APP_DEPENDENCYS: Array<string> = []
        constructor(public element: Element, public appDependency: Array<string> = new Array<string>()) {
            if (!this.element.hasAttribute(this.NGAPP)) {
                let allApps = $(document).find("[" + this.NGAPP + "]")
                this.APPNAME += allApps.length
                this.element.setAttribute(this.NGAPP, this.APPNAME);
            } else this.APPNAME = this.element.getAttribute(this.NGAPP)
        }
        get module(): angular.IModule {
            if (!this._module) {
                try {
                    this._module = angular.module(this.APPNAME)
                    this.$controllerProvider = this.element["$controllerProvider"]
                } catch (e) {
                    this._module = angular.module(this.APPNAME, this.appDependency, ($controllerProvider) => {
                        this.$controllerProvider = $controllerProvider
                        this.element["$controllerProvider"] = $controllerProvider
                    });
                }
            }
            // this._module["AngularApp"] = this;
            return this._module;
        }
        // Register Ctrl controller manually
        // If you can reference the controller function directly, just run:
        // $controllerProvider.register(controllerName, controllerFunction);
        // Note: I haven't found a way to get $controllerProvider at this stage
        //    so I keep a reference from when I ran my module config
        static registerController(moduleName, controllerName, controllerProvider: angular.IControllerProvider) {
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
        }
    }
    export interface IAngularController {
        setValue: (fieldName: string, value: Object) => IAngularController
        getScope: () => angular.IScope
        recompile: (module: boolean) => IAngularController
    }
    export class AngularController implements IAngularController {
        private _module: angular.IModule
        NAME: "name"
        APPNAME = "angularApp"
        NGAPP = "ng-app"
        CONTROLLERNAME = "Controller"
        NGCONTROLLER = "ng-controller"
        ///默认一个页面一个模块，如果element上存在ng-app特性则以element为准,该页面所有AngularController不能有重叠,多模块
        constructor(public element: Element, fn?: (args: Array<any>) => angular.IController, public app?: AngularApp) {
            let appElement: Element
            //app
            if (!app) {
                this.app = angular.element('body').AngularApp(AngularApp.APP_DEPENDENCYS)
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
            this._module = this.app.module
            this.APPNAME = this.app.APPNAME
            appElement = angular.element("[" + this.NGAPP + "='" + this.APPNAME + "']")[0];
            //}

            //controller
            let $element = angular.element(appElement);
            let allControllers = $element.find("[" + this.NGCONTROLLER + "]")
            this.CONTROLLERNAME = (element.getAttribute(this.NAME) || ("auto" + allControllers.length)) + this.CONTROLLERNAME;
            this.element.setAttribute(this.NGCONTROLLER, this.CONTROLLERNAME);

            this._module.controller(this.CONTROLLERNAME, fn ||
                function ($scope) {
                    $scope = new Object()
                }
            );
        }
        getScope(): angular.IScope {
            return angular.element(this.element).scope();
        }
        recompile(module: boolean = false, registed: boolean = true): IAngularController {
            if (!module) {
                var controller = angular.element(this.element)
                let that = this;
                angular.element("[" + this.NGAPP + "='" + this.APPNAME + "']").injector().invoke(function ($compile, $timeout) {
                    if (!registed)
                        AngularApp.registerController(that.APPNAME, that.CONTROLLERNAME, that.app.$controllerProvider)
                    var scope = controller.scope();
                    $compile(that.element)(scope);
                    scope.$apply();
                })
            } else
                angular.bootstrap("[" + this.NGAPP + "='" + this.APPNAME + "']", [this.APPNAME]);
            return this;
        }
        rebindScope(): IAngularController {
            var injector = angular.injector(['ng', this.APPNAME]),
                controller = injector.get('$controller'),
                rootScope = injector.get('$rootScope'),
                newScope = rootScope.$new();
            // 调用控制器
            controller(this.CONTROLLERNAME, { $scope: newScope });
            return this;
        }
        setValue(fieldName: string, value: any): IAngularController {
            let scope = this.getScope();
            if (angular.isArray(value) || angular.isObject(value)) {
                System.SetValue(scope, fieldName, value)
                scope.$apply()
                return this;
            }
            if (typeof value === "string") value = "'" + value + "'";
            scope.$apply(fieldName + "=" + value);
            return this;
        }
    }

    export class DivCell {
        public divLattice: DivLattic
        public divRow: DivRow
        public options = { align: "", width: "auto", height: "auto", destroy: undefined }//align：指DivCell内容的对齐方式,destroy:(mark){}
        public wrapper: HTMLElement
        constructor(public element: HTMLElement, options?: { align?: string, width?: string, height?: string, destroy?: (mark: string) => void }, public mark?) {
            if (typeof options === "object")
                $.extend(this.options, options)
            this._decrate();
        }
        _decrate() {
            this.wrapper = document.createElement("div");
            this.wrapper.style.height = this.options.height;
            this.wrapper.classList.add("l_divCell");
            this.wrapper.appendChild(this.element);
        }
        public insertInto(container: DivRow | DivLattic, index?) {
            (container as DivRow).insert(this, index)
        }
        public destroy() {
            this._remove()
            if (this.wrapper) {
                this.element.remove()
                this.element = undefined
                this.wrapper.remove()
                this.wrapper = undefined
                //parents
            }
            if (this.options.destroy) this.options.destroy(this.mark);
        }
        _remove() {//指从数组中删除 需要build()才能重新排版
            if (this.divRow) {
                this.divRow._remove(this.element);
                this.divRow = undefined;
            }
            if (this.divLattice) {
                this.divLattice._remove(this.element);
                this.divLattice = undefined;
            }
        }
    }
    export class DivRow {
        public divLattice: DivLattic
        public wrapper: HTMLElement
        public element: HTMLElement
        public options = { align: "left" }//align：指DivRow中DivCell的对齐方式
        constructor(public divArray: Array<DivCell> = new Array<DivCell>(), options?: any) {
            if (typeof options === "object")
                $.extend(this.options, options)
            this._decrate();
        }
        _decrate() {
            this.element = document.createElement("div");
            this.element.style.height = "auto";
            this.element.style.alignContent = this.options.align;
            this.element.classList.add("l_divRow");
            this.wrapper == this.element;
            this._build()
        }
        _build() {
            this.element.innerHTML = "";
            this.divArray.forEach(d => {
                this.element.appendChild(d.element);
            })
        }
        public insert(divcell: DivCell, index?) {
            this.divArray.splice(index || this.divArray.length, 0, divcell)
            this._build();
        }
        public insertInto(container: DivLattic, index?) {
            container.insert(this, index)
        }
        public destroy(index?: number | Element) {
            if (index == undefined) {
                this._remove()
                for (let index = this.divArray.length - 1; index == 0; index--) { //倒过来枚举 防止子cell.destroy()将数组中元素移除造成index不正确
                    let d = this.divArray[index];
                    d.destroy()
                }
                if (this.wrapper) {
                    this.element.remove()
                    this.element = undefined
                    this.wrapper.remove()
                    this.wrapper = undefined
                }
                return;
            }
            let div: DivCell
            if (typeof index === "number") {
                div = this.divArray.slice(index as number, 1)[0]
            } else {
                for (let i = 0; i < this.divArray.length; i++) {
                    let d = this.divArray[i];
                    if (d.element == index || d.wrapper == index) {
                        div = this.divArray.slice(i, 1)[0]
                        break;
                    }
                }
            }
            if (div) div.destroy()
        }
        _remove(index?: number | Element) {
            if (index == undefined && this.divLattice) this.divLattice._remove(this.wrapper);
            else {
                let div: DivCell
                if (typeof index === "number") {
                    div = this.divArray.splice(index as number, 1)[0]
                } else {
                    for (let i = 0; i < this.divArray.length; i++) {
                        let d = this.divArray[i];
                        if (d.element == index || d.wrapper == index) {
                            div = this.divArray.splice(i, 1)[0]
                            break;
                        }
                    }
                }
            }
        }

        public getCell(mark: any): DivCell {
            let cell: DivCell
            this.divArray.forEach(d => {
                if (d.mark === mark)
                    cell = d;
            })
            return cell;
        }
    }

    export class DivLattic {
        public wrapper: HTMLElement
        public options = { align: "left", width: "100%" }//align：指DivCell|DivRow的对齐方式
        constructor(public element: HTMLElement, options?: any, public divArray: Array<DivCell | DivRow> = new Array<DivCell | DivRow>()) {
            if (typeof options === "object")
                $.extend(this.options, options)
            if (element.style.width === "") element.style.width = this.options.width
            this.element.innerHTML = "";
            this.element.classList.add("divLattic");
            this.wrapper = this.element;
            this.build();
        }
        public build(): DivLattic {
            this.element.innerHTML = "";
            (this.divArray as Array<DivCell | DivRow>).forEach(d => {
                this.element.appendChild(d.wrapper)
                if (d instanceof DivCell) {
                    let dc = d as DivCell;
                    dc.wrapper.setAttribute("style", "width:" + dc.options.width);
                    if (dc.options.align)
                        dc.wrapper.setAttribute("style", "float:" + dc.options.align);
                }
            })
            return this;
        }
        public insert(div: DivCell | DivRow, index?) {
            this.divArray.splice(index || this.divArray.length, 0, div)
            this.build();
        }
        public destroy(obj?: Element | Number | JQuery) {
            if (obj == undefined) {
                for (let index = this.divArray.length - 1; index == 0; index--) { //倒过来枚举 防止子cell.destroy()将数组中元素移除造成index不正确
                    let d = this.divArray[index];
                    d.destroy()
                }
                return;
            }
            if (obj instanceof jQuery) obj = obj[0];
            let div: DivCell | DivRow
            if (typeof obj === "number") {
                div = this.divArray.splice(obj as number, 1)[0]
            } else {
                for (let index = 0; index < this.divArray.length; index++) {
                    let d = this.divArray[index];
                    if (d.element == obj || d.wrapper == obj) {
                        div = this.divArray.splice(index, 1)[0]
                        break;
                    }
                }
            }
            if (div) div.destroy();
        }
        _remove(obj: Element | Number | JQuery) {
            if (obj instanceof jQuery) obj = obj[0];
            let div: DivCell | DivRow
            if (typeof obj === "number") {
                div = this.divArray.splice(obj as number, 1)[0]
            } else {
                for (let index = 0; index < this.divArray.length; index++) {
                    let d = this.divArray[index];
                    if (d.element == obj || d.wrapper == obj) {
                        div = this.divArray.splice(index, 1)[0]
                        break;
                    }
                }
            }
        }
        public getCell(mark: any): DivCell {
            let cell: DivCell
            this.divArray.forEach(d => {
                if (d instanceof DivRow)
                    cell = (d as DivRow).getCell(mark)
                else if (d.mark === mark) cell = d;
            })
            return cell;
        }
    }
    /**状态顺序流程 方案*/
    export class SequenceSolution {
        private _sequences: Array<Array<{ id: string, toString: Function, actName: Function }>> = []
        private _refusingSequences: Array<Array<{ id: string, toString: Function, actName: Function }>> = []
        private _sObj: Object = {}
        private _rsObj: Object = {}
        private _objs: Object = {}
        private _changed: boolean = false
        private analyse() {
            this._sObj = {};
            this._rsObj = {};
            this._sequences.forEach(s => {
                for (let i = 0; i < s.length - 1; i++) {
                    let c = s[i], n = s[i + 1];
                    this._sObj[c.id + "-" + n.id] = [c, n];
                    this._objs[c.id] = c; this._objs[n.id] = n;
                }
            })
            this._refusingSequences.forEach(s => {
                for (let i = 0; i < s.length - 1; i++) {
                    let c = s[i], n = s[i + 1];
                    this._rsObj[c.id + "-" + n.id] = [c, n];
                    this._objs[c.id] = c; this._objs[n.id] = n;
                }
            })
            this._changed = false;
        }
        /**状态顺序流程 方案
        * @param {string} name - 用于区分不同顺序方案
        */
        constructor(public name: string) {
            let e = SequenceSolution.solutions.where((s: SequenceSolution) => s.name === name)[0];
            if (e) return e
            SequenceSolution.solutions.push(this)
        }
        /**添加一种顺序
        * @param {Array<{ id: string, toString: Function, actName: Function }>} sequence - 顺序  toString:状态名称 ，actName：行为名称
        */
        public add(sequence: Array<{ id: string, toString: Function, actName: Function }>, refusing: boolean = false) {
            if (sequence) {
                this[refusing ? "_refusingSequences" : "_sequences"].push(sequence)
                this._changed = true;
            }
        }
        /**修改一种顺序
       * @param {number} index - 索引 
       * @param {Array<{ id: string, toString: Function, actName: Function }>} sequence - 顺序 toString:状态名称 ，actName：行为名称
       */
        public edit(index: number, sequence: Array<{ id: string, toString: Function, actName: Function }>, refusing: boolean = false) {
            if (sequence) {
                this[refusing ? "_refusingSequences" : "_sequences"][index] = sequence;
                this._changed = true;
            }
        }
        /**验证状态是否可以变迁到target状态  default err msg:{状态名称}状态数据无法进行{行为名称}
        * @param {string} fromId - 起始状态.id
        * @param {string} targetId - 目标状态.id
        * @param {string} failMsg - 可选参数，自定义失败消息 若包含{0}:将默认提示替代{0};若包含{0},{1}:将fromStr 和targetStr分别替换{0},{1}
        * @returns {boolean} 可以变迁：true； 不可以：false
        */
        public validate(fromId: string, targetId: string, failMsg?: string): boolean {
            if (this._changed) this.analyse();
            let re = this._rsObj[fromId + "-" + targetId], e = this._sObj[fromId + "-" + targetId] || this._sObj[SequenceSolution.all.id + "-" + targetId] || this._sObj[fromId + "-" + SequenceSolution.all.id];
            if (re || !e) {
                let f = this._objs[fromId], t = this._objs[targetId], msg = (System.CultureInfo.GetDisplayText("{0}状态数据无法进行{1}") as string).format(f, t.actName());
                if (failMsg) {
                    if (failMsg.indexOf("{1}") >= 0) msg = failMsg.format(f, t);
                    else msg = failMsg.format(msg)
                }
                EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText("prompt"), msg);
                return false;
            }
            return true;
        }
        /** @typedef {Array<SequenceSolution>} 用于存放所有方案*/
        static solutions: Array<SequenceSolution> = []
        static all = { id: "all", toString: Function, actName: Function }
    }

    export class FilterParameters {
        static logics = { and: "and", or: "or", endswith: "endswith" }
        static itemOperators = {
            eq: "eq", in: "in", neq: "neq", contains: "contains", startswith: "startswith", doesnotcontain: "doesnotcontain", isnotempty: "isnotempty"
            , isempty: "isempty", isnotnull: "isnotnull", isnull: "isnull", lte: "lte", gte: "gte", lt: "lt", gt: "gt"
        }
        static generateWithFilter(logic: string, ...items: Array<FilterItem | SortItem>): RequestItem {
            let kg = new RequestItem(), fs = items.where(i => i instanceof FilterItem) as Array<FilterItem>, ss = items.where(i => i instanceof SortItem) as Array<SortItem>
            if (fs.length > 0) kg.filter = new Filters(logic, fs);
            if (ss.length > 0) kg.sort = ss
            return kg;
        }
    }
    export class FilterItem {
        constructor(public logic: string, public itemOperator: string, public value: string, ...filters: Array<FilterItem>) {
            this.filters = filters
        }
        public filters: Array<FilterItem>
    }
    export class Filters {
        constructor(public logic: string, public filters: Array<FilterItem>) { }
    }
    export class SortItem {
        constructor(public dir: string, public field: string) { }
    }
    export class RequestItem {
        public page: number
        public rows: number
        public id: string
        public ids: Array<string>
        public moduleName: string
        public filter: Filters
        public sort: Array<SortItem>
        public entityId: string
        public serviceId: string
        public currentGridViewId: string
        /// <summary>
        /// 表单视图中使用
        /// </summary>
        public filterStr: string
    }
}

namespace System.Web {
    export interface IScripts {
        loadScript(url: string)
    }
    class ScriptsHelper {
        loadScript(url: string) {
            let script = document.createElement("script");
            script.async = false;
            script.setAttribute('src', url + '?' + 'time=' + Date.parse(new Date().toString()));
            document.body.appendChild(script);
        }
    }

    export let Scripts: () => IScripts = Patterns.Singleton(ScriptsHelper, true)
}

namespace System.DateEx { //Ex 可转入另外的ts文件中
    export interface IDateStandar {
        weekOfYear(date: Date): number
        /** 获取该周的日期  day为第几天 默认第一天=0*/
        dateOfWeek(year: number, weekOfYear: number, day?: number): Date
        /**只包含 yyyy WW 默认 yyyy-WW => 1990-W53 (W01) 不可以和时间 一起显示  */
        weekFormat(date: Date, format?: string): string
        fullYear(date: Date): number
    }
    class ISODateStandar implements IDateStandar {
        weekOfYear(date: Date): number {
            let target = new Date(date.valueOf()), dayNr = (date.getDay() + 6) % 7;
            target.setDate(target.getDate() - dayNr + 3);
            let thisThursday = target.valueOf();
            target.setMonth(0, 1);
            if (target.getDay() != 4) target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
            return 1 + Math.ceil((thisThursday - target.valueOf()) / 604800000);
        }
        dateOfWeek(year: number, weekOfYear: number, day: number = 0): Date {
            let target = new Date(year, 0, 4 + (weekOfYear - 1) * 7)
            target.setDate(target.getDate() - (target.getDay() + 6) % 7 + day)
            return target;
        }
        weekFormat(date: Date, format?: string): string {
            return (format || "yyyy-WW").replace(/yyyy/g, this.fullYear(date).toString()).replace(/WW/g, "W" + this.weekOfYear(date).toString())
        }
        fullYear(date: Date): number {
            let target = new Date(date.valueOf());
            target.setDate(target.getDate() - ((date.getDay() + 6) % 7) + 3);
            return target.getFullYear();
        }
    }
    class DateStandars extends Patterns.SimplyFactory<IDateStandar> {
        private iso: IDateStandar = Patterns.Singleton(ISODateStandar, true)
    }
    /**时间日期标准s  { Generate(name: string):System.DateEx.IDateStandar}  name:["iso"]*/
    export let DateStandar: () => {
        /**时间日期标准s  { Generate(name: string):System.DateEx.IDateStandar}  name:["iso"]*/
        Generate(name: string): System.DateEx.IDateStandar
    } = Patterns.Singleton(DateStandars, true);
}



namespace EAP.UI {
    export abstract class UIAF extends Patterns.AbstractFactory {
        abstract Input()
        abstract SearchBox(element: HTMLElement, options: IVinciSearchBoxOptions)
        abstract DateTimePicker(element: HTMLElement, options: IVinciDateTimePickerOptions)
        abstract DatePicker(element: HTMLElement, options: IVinciDatePickerOptions)
        abstract NumericTextBox(element: HTMLElement, options: IVinciNumericTextBoxOptions)
        //......
    }

    /// UI Controls' base class in TS
    class UiBasicOption {
        constructor(public selector: string | HTMLElement | JQuery = '', public owner: any = null) { }
    }

    export class MessageBox {
        static kwindow = null
        static contentTemplate: string
        static showInput(option) {
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
                    var tooltip = winDiv.find('.k-tooltip')

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
            })

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
        }
        static confirm(option) {
            var winDiv = jQuery("<div class='k-popup-edit-form' style='overflow:hidden'/>");
            this.contentTemplate = "<div class='k-edit-form-container'><p class='k-popup-message'>" + System.CultureInfo.GetDisplayText(option.content) +
                "<p><div class='k-edit-buttons k-state-default'>  "
                + "<button class='k-primary k-button' data-role='OK' style='width:60px'>" + System.CultureInfo.GetDisplayText("OK") + "</button>"
                + "<button class='k-button' data-role='Cancel'  style='width:60px'>" + System.CultureInfo.GetDisplayText("Cancel") + "</button>"
                + "</div>";


            let kwindow = winDiv.kendoWindow({
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
            })

            winDiv.find('[data-role=Cancel]').on('click', function () {
                kwindow.close();
                if (option.Cancel) {
                    return option.Cancel();
                }

                return false;
            });


            kwindow.center();
            kwindow.open();
        }
        static showConfirmationWindow(message) {
            return this.showWindow(this.contentTemplate, message)
        }
        static showWindow(template, message) {
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
        }
        static alert(title, content = "", timeout?) {
            if (!timeout) {
                var seconds = (content.length / 8) * 2000;
                timeout = Math.max(seconds, 2000)
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

        }
    }

    //iframe对象
    export class IframeItem {
        loaded = false;
        constructor(public src: string = "", public flag: string = "", public guid: string = "", public iframe: HTMLIFrameElement = null) {

        }
        load() {
            if (!this.loaded && this.src) {
                this.iframe.src = this.src;
                this.loaded = true;
            }
        };
    }

    export class ComOption {
        viewsReadUrl = new System.UrlObj("ViewsManager", "ViewList");
        listReadUrl = new System.UrlObj("Business", "GetListPage");
        viewColsReadUrl = new System.UrlObj("ViewsManager", "GetViewColumns");
        viewEditUrl = new System.UrlObj("ViewsManager", "UserViewSolutionEdit");
        viewDeleteUrl = new System.UrlObj("ViewsManager", "UserViewSolutionDel");
        viewGetPersonalSolutions = new System.UrlObj("ViewsManager", "GetPersonalViewSolutions");
        saveViewUrl = new System.UrlObj("ViewsManager", "AppendUserView");
        filterCreateQuerySolution = new System.UrlObj("ViewsManager", "CreateQuerySolution");
        filterEditUrl = new System.UrlObj("ViewsManager", "UserQuerySolutionEdit");
        filterDeleteUrl = new System.UrlObj("ViewsManager", "UserQuerySolutionDel");
        filterGetFormStructure = new System.UrlObj("ViewsManager", "GetFormStructure");
        filterGetItemsBySolutionId = new System.UrlObj("ViewsManager", "GetItemsBySolutionId");
        filterGetPersonalSolutions = new System.UrlObj("ViewsManager", "GetPersonalSolutions");
        filterGetAllSolutions = new System.UrlObj("ViewsManager", "GetAllSolutions");
        //表单视图
        formViewUrl = new System.UrlObj("ViewsManager", "GetFormView");//或直接给出formViewModelId
        //表单视图列
        formViewColsUrl = new System.UrlObj("ViewsManager", "GetFormViewColumns");
        //增删改
        formProcessUrl = new System.UrlObj("Business", "FormProcess");

        listByEntityIdUrl = new System.UrlObj("Utilities", "GetListByFilter");
        pagerByEntityIdUrl = new System.UrlObj("Utilities", "GetPagerByFilter");
        /**枚举获取 */
        enumItemsUrl = new System.UrlObj("Utilities", "EnumItems");
        /**导出url */
        exportUrl = new System.UrlObj("Utilities", "GetExportFileUri");
         /**导入模板url */
        importTemplateUrl = new System.UrlObj("Utilities", "GetExportTemplete");
        /**导入url */
        importUrl = new System.UrlObj("Utilities", "ImportFile")
        /**get available buttons by Code*/
        getButtonsByCodeUrl = new System.UrlObj("Utilities", "GetButtonsByCode")
        /**general query for searchbox */
        query4SBUrl = new System.UrlObj("Utilities", "Query4SB")
        /**get GridEditItems */
        getGridEditItemsUrl = new System.UrlObj("Utilities", "GetGridEditItemsByPId")
        /**edito控件的统一处理URL*/
        editorBatchEditUrl = new System.UrlObj("Utilities", "BatchEdit")
    }
    export let ComOptionObj = new ComOption();

    export let ctors = [];

    export let documentReady = function (fn) {

        EAP.UI.ctors.push(fn);

    }


    //[ControllerName,...]
    export let formControllers = [];
    //directiveControls
    export let DirectiveControls = {};

    Storage.prototype["setObj"] == function (key, obj) {
        this.setItem(key, JSON.stringify(obj))
    };


    export let DropDownListOptionsConvert = function (item, dataItem, comOption, enums, otherP) {
        if (otherP.type) {
            item.subType = otherP.type;
            delete otherP.type
        }
        $.extend(item, otherP)
        if (otherP.entityId && otherP.filter) delete item.filter//otherP.entityId?otherP.filter 则代表对实体的筛选
        if (otherP.url)
            item.readurl = otherP.url;
        else if (otherP.entityId) {
            item.readurl = {};
            $.extend(item.readurl, comOption.listByEntityIdUrl);
            item.postData = { entityId: otherP.entityId, filter: otherP.filter }
            //item.readurl.parameters = { entityId: otherP.entityId, filter: otherP.filter };
        } else if (otherP.enumId) {
            item.dataTextField = "Code";
            item.dataValueField = "Id";
            item.readurl = {};
            $.extend(item.readurl, comOption.enumItemsUrl);
            item.readurl.parameters = { id: otherP.enumId };
            item.dataProcess = item.dataProcess || function (datas) {
                if (datas instanceof Array) {
                    datas.forEach(function (data) {
                        data.Code = System.CultureInfo.GetDisplayText(data.Code);
                    })
                }
                return datas;
            };
        } else { //enums
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
                item.dataValueField = otherP.dataValueField
            else
                item.dataValueField = "value";
        }

        return item;
    }

    export let SearchBoxOptionsConvert = function (item, dataItem, comOption, otherParameters) {
        var otherP = otherParameters;
        item.matchField = otherP.mathField || otherP.matchField;
        item.showField = otherP.showField;
        item.entityId = otherP.entityId
        //$.extend(item, otherP)
        switch (otherP.type) {
            case "grid":

                item.gridOptions = new EAP.UI.GridOption();
                if (otherP.gridSolutionId) {
                    item.gridOptions.gridSolutionId = otherP.gridSolutionId;
                    item.gridOptions.viewColsReadUrl = comOption.viewColsReadUrl;
                } else
                    if (otherP.columns) {
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
    }

    ///Formton 转化入口
    //options={columnsAmount, titleWidth, controlUniteWidth, comOption,enums,Data}
    export let FormViewColumnConvert = function (items, options): Array<any> {
        let _getDropdownListValues = function (field) {
            if (!options.enums) {
                return [];
            }
            for (var i = 0; i < options.enums.length; i++) {
                if (options.enums[i].field == field)
                    return options.enums[i].values;
            }
        }
        //将ViewColumn对象数组转化成formcontrol.data可用类型 
        if (!items || items.length <= 0) return options.Data || [];
        var result = [];

        items.forEach(function (di) {
            if (!di.Code) { result.push(di); return; }
            if (!di.IsVisible) return;
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
                        item["decimals"] = otherP["decimals"] || (di.DataType == "int" ? 0 : 1)
                        break;
                    case "datepicker":
                        item.format = otherP["format"] || System.CultureInfo.GetDateFormatStr();
                        break;
                    case "datetimepicker":
                        item.format = otherP["format"] || System.CultureInfo.GetDateTimeFormatStr();
                        break;
                    case 'dropdownlist':
                        DropDownListOptionsConvert(item, di, options.comOption, options.enums, otherP);
                        break;
                    case 'searchbox':
                        SearchBoxOptionsConvert(item, di, options.comOption, otherP);
                        break;
                    default:
                        $.extend(item, otherP)
                }
            }
            else {
                new Error("You should remove '.' from ControlType");
            }

            result.push(item);
        });
        return result = result.extends(options.Data || [], r => r.name);
    }
    export class NoTranslate {
        constructor(public title: string = "") {
        }
    }
    //视图列转成gridColumns
    export let GridViewColumnConvert = function (items, customColumns) {
        var result = [], index = 0, that = this, length = items.length, remainLength = length, cloneCols = [];
        $.extend(cloneCols, customColumns);
        items.forEach(function (data) {
            let option = {
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
                                return '<input type="checkbox" disabled ' + (result ? "checked" : "") + ' style="height: 16px;width: 16px;">'
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
                        }
                    } else option["editable"] = false;
                    option.attributes = { style: "text-align:center" }
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
                        }
                    } else option["editable"] = false;
                    option.attributes = { style: "text-align:center" }
                    break;
                case "DateTime":
                    if (!data.IsReadOnly) {
                        option.editor = function (container, option) {
                            var input = document.createElement("input");
                            input.name = data.Code;;
                            container.append(input);
                            $(input).kendoDateTimePicker({ format: System.CultureInfo.GetDateTimeFormatStr() });
                            //$(input).kendoDateTimePicker({ formate: 'yyyy/MM/dd HH:mm' });
                        }
                    } else option["editable"] = false;
                    break;
                case "Time":
                    if (!data.IsReadOnly) {
                        option.editor = function (container, option) {
                            var input = document.createElement("input");
                            input.name = option.field;
                            container.append(input);
                            $(input).kendoTimePicker({ format: 'HH:mm' });
                        }
                    } else option["editable"] = false;
                    break;
                case "Date":
                    if (!data.IsReadOnly) {
                        option.editor = function (container, option) {
                            var input = document.createElement("input");
                            input.name = data.Code;;
                            container.append(input);
                            $(input).kendoDateTimePicker({ format: System.CultureInfo.GetDateFormatStr() });
                            //$(input).kendoDatePicker({ formate: 'yyyy/MM/dd' });
                        }
                    } else option["editable"] = false;
                    break;
                case "int":
                case "decimal":
                    if (!data.IsReadOnly) {
                        option.editor = function (container, option) {
                            var input = document.createElement("input");
                            input.name = data.Code;;
                            container.append(input);
                            $(input).kendoNumericTextBox();
                        }
                    } else option["editable"] = false;
                    //option.attributes = { style: "text-align:right" }
                    break;
                case "EAP.Core.EnumItem":
                    option.attributes = { style: "text-align:center" }
                    break;
                default:
            }

            for (let c = 0; c < cloneCols.length; c++) {
                if (cloneCols[c].field == data.Code) {
                    let cCol = cloneCols.splice(c, 1)[0];
                    cCol.title = cCol.title|| option.title;
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
    export let GetGridViewColumns = function (gridViewId) {
        var controller = new EAP.EAMController();
        var that = this;
        var postData = { id: gridViewId };
        var viewColsReadUrl = EAP.UI.ComOptionObj.viewColsReadUrl;
        var reuslt = [];
        controller.ExecuteServerActionSync(viewColsReadUrl, postData, function (data) {
            reuslt = data
        });
        return reuslt;
    }

    //迭代获取GridColumns  gridSolutionId:""||gridSolutionId:{id,subId}   { columns: cols, items: items, gridSolutionId: gridSolutionId ,subColumns:[]}
    export let GetGridColumns = function (gridSolutionId: string | { id, subId }, customColumns): { columns: Array<any>, items: Array<any>, gridSolutionId: string | { id, subId } } {
        if (typeof gridSolutionId === "string") {
            let items = EAP.UI.GetGridViewColumns(gridSolutionId), cols = EAP.UI.GridViewColumnConvert(items, customColumns);
            return { columns: cols, items: items, gridSolutionId: gridSolutionId };
        }
        else if (gridSolutionId instanceof Object) { //针对子视图的
            let items = EAP.UI.GetGridViewColumns(gridSolutionId.id), cols = EAP.UI.GridViewColumnConvert(items, customColumns ? customColumns.columns : null), result = { columns: cols, items: items, gridSolutionId: gridSolutionId };
            if (gridSolutionId.subId) {
                result["subColumns"] = EAP.UI.GetGridColumns(gridSolutionId.subId, customColumns ? customColumns.subColumns : null);
            }
            return result;
        }
    }

    export class MiniPager {
        private _kendoPager: kendo.ui.Pager;
        private _pagerOption: kendo.ui.PagerOptions;
        constructor(public selector?: string | Element) {
            this._init();
        }

        private _init() {
            var optionObj = {
                pageSize: false,
                messages: { display: "{0}-{1}of{2}" },//
                numeric: false
            };
            this._pagerOption = optionObj;
            if (this.selector) {
                this._kendoPager = $(this.selector).kendoPager(optionObj).data("kendoPager");
            }
        }

        public get pagerOption(): Object {
            return this._pagerOption;
        }


        public get kendoPager(): Object {
            return this._kendoPager;
        }

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

        public destroy() {
            if (this._kendoPager) {
                this._kendoPager.destroy()
            }
        }
    }

    export let UiOption = System.Object.Extends({
        selector: '',
        owner: null
    });

    export let TreeOption = EAP.UI.UiOption.Extends({
        showCheckBox: false,
        selector: '#tree',
        nodeClick: undefined,
        dragable: false,
        showIcon: true,
        checkChildren: false,
        check: null,
        requestOptions: null
    });

    export let ITreeControl = System.Object.Extends({
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
    export class GridOption extends UiBasicOption {
        ///showrowcheckbox:是否显示复选框 默认false
        ///pageable:是否分页 默认true
        constructor(selector: string = '', public showrowcheckbox: boolean = false, public pageable: boolean | Object = true) { super(selector); }
        columns = [];
        //gridControl中未使用
        gridSolutionId = null;
        //单选("row")或多选("multiple, row"),默认单选
        selectable = "row";
        //选择改变之后 回调
        change: Function = undefined;
        //pageSizes = [10,20,30, 50, 100]
        //pageSize = 30
        //初始grid高度
        height: number | string = undefined
        //数据绑定回调
        dataBound: Function = null
        /**dataBinding(e: kendo.ui.GridDataBindingEvent)*/
        dataBinding: (e: kendo.ui.GridDataBindingEvent) => void = undefined
        //是否筛选  mode: "row"=>行筛选
        filterable: boolean | Object = false
        //双击事件
        dblClick = null

        editable: boolean | string = false

        toolTip = false

        cellColor: boolean = false

        cellColorField: string = "ColorCells"

        showIndex: boolean = false

        toolbar: any = null
        excelExport: (e: kendo.ui.GridExcelExportEvent) => void = undefined

    }

    export interface IGridControl {
        refresh: Function
        getSelectedId: Function
        getSelectedRows: Function
        setData(griddataRequest: EAP.UI.GridDataRequest, schema?): void
    }
    export interface IDataRequest {
        sync?: boolean
        url: System.UrlObj | string | Function
        postdata?: Object | Array<any>
    }
    export class DataRequest implements IDataRequest {
        public sync = false
        protected _url
        protected _postdata
        public responseData: (d) => {} = undefined
        protected getRequest(request?: any) {
            if (request) {
                if (request instanceof DataRequest)
                    return request;
                $.extend(this, request)
                if (request.postdata) {
                    this._postdata = request._postdata || request.postdata
                }
                return this;
            }
        }

        public get url(): System.UrlObj | string | Function {
            if (this._url && Object.prototype.toString.call(this._url) === '[object Function]')
                return <System.UrlObj | string | Function>(this._url as Function)();
            return this._url;
        }
        public set url(_url: System.UrlObj | string | Function) {
            this._url = _url;
        }
        public static convertPostdata(cp: any): any {
            if (!$.isArray(cp)) {
                let result = $.extend({}, cp);
                for (let name in result) {
                    if (result[name] && Object.prototype.toString.call(result[name]) === '[object Function]') {
                        result[name] = result[name]();
                    }
                }
                return result;
            }
            return cp;
        }
        ///不可直接添加属性和字段等 请使用apendPostData
        public get postdata(): Object | Array<any> {
            return EAP.UI.DataRequest.convertPostdata(this._postdata);
        }
        public set postdata(_postdata: Object | Array<any>) {
            this._postdata = _postdata;
        }

        public apendPostData(postdata: Object) {
            if (!postdata) return
            if (!this._postdata) this._postdata = postdata
            if ($.isArray(postdata) && $.isArray(this._postdata)) {
                //array
                this._postdata = (this._postdata as Array<Object>).concat(postdata);
            }
            if (!$.isArray(postdata) && !$.isArray(this._postdata) && typeof postdata === "object" && typeof this._postdata === "object") {
                //object
                $.extend(this._postdata, postdata);
            }
        }

        public clone() {

        }
    }
    export interface IGridDataRequest extends IDataRequest {
        onLoaded?: (e: any) => void
        onError?: (e: any) => void
    }
    ///建议存在方法postdata的时候 不要使用扩展 例如$.extend() 使用apendPostData() 添加postdata内容，object类型存在覆盖作用
    export class GridDataRequest extends EAP.UI.DataRequest {
        constructor(request?: IGridDataRequest) {
            super()
            return super.getRequest(request) as GridDataRequest
        }
        public onLoaded: Function = undefined
        public onError: Function = undefined
    }

    export class TreeListDataRequest extends EAP.UI.GridDataRequest {
        subGridField = null
    };

    export let ITreeListControl = System.Object.Extends({
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

    export let TreeListOption = EAP.UI.UiOption.Extends({
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
    export class ToolbarOption extends UiBasicOption {
        items = []
        ///是否远端获取按钮
        pull = false
        ///远端读取的url，pull为true才有效
        readUrl: System.UrlObj = EAP.UI.ComOptionObj.getButtonsByCodeUrl
        ///不填默认使用当前页面url参数code，前提pull=true
        code: string = undefined
        click: (e) => void = undefined
        /**older 弃用 请使用VinciToolBarOptions*/
        constructor() {
            super();
        }
    }

    export class TabsOption extends UiBasicOption {
        ///top,left,right,buttom
        tabPosition = "top"
        ///会覆盖原有的，若是iframe 需要手动加载iframe内容
        onActivate: Function = undefined
        ///Array<EAP.UI.TabItemOption> | EAP.UI.TabItemOption
        Data: Array<TabItemOption> | TabItemOption = undefined
    }

    export class TabItemOption extends UiBasicOption {
        ///在onActivate事件中标识tab   option.onActivate = function (e) { var flag = e.item.getAttribute("flag"); switch(flag){...}}
        flag: string = ''
        ///flag:在onActivate事件中标识tab   option.onActivate = function (e) { var flag = e.item.getAttribute("flag"); switch(flag){...}}
        ///selector:与item 互斥， 若有item 此项不填
        constructor(public title: string = '', flag: string = '', selector: any = '') { super(selector); this.flag = flag; }
        ///页签中内容与selector 互斥
        item: TabSubItem = undefined
        ///是否可移除
        removeable: boolean = false
        ///标签移除事件，前提：removeable==true
        onRemove: Function = undefined
    }

    export class TabSubItem {
        ///用来表示
        sign: string = ''
        ///与content互斥
        url: string = ''
        ///与url互斥
        content: string = ''
    }

    export class DialogOption {
        title = ''
        width = 420
        height = 260
        content = ''
        OK = undefined
        Cancel = undefined
    }

    export class InputDialogOption extends DialogOption {
        errorMessage = ''
        inputRequired = false
    };

    //#region FormControl

    export let DropdownListOption = EAP.UI.UiOption.Extends({
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

    export class SearchBoxOption extends UiBasicOption {
        onChange
        //grid 参数 有则为 搜索列表
        gridOptions
        //tree 参数 有则为 搜索树
        treeOptions
        //grid Load 参数
        gridDateRequestOptions
        //视图列读取
        viewColsReadUrl
        style: Object = {}
        editable: boolean = false
        //匹配键
        matchField: string = "Id"
        icon: string = ""
    }

    export class FormOption extends UiBasicOption {
        /** 获取数据源URL*/
        url: System.UrlObj = undefined
        /** 控件配置项 {Array<any>} length>0 容器清空*/
        Data: Array<any> = [];
        /** {Array<any>} array [{selector:"",Data},...,...] */
        subForms: Array<any> = undefined
        /** 控件名称 {string} 默认80px*/
        titleWidth = "80px"
        /** 列的数量 {number} 若为0 则依据controlUniteWidth+titleWidth 自适应排版*/
        columnsAmount: number = 3
        /** 提交的URL {System.UrlObj} */
        postUrl: System.UrlObj = undefined
        success: any
        cancle: any
        /** 初始化数据源 默认{}*/
        sourceData: {}
        /** angularJs 参数，对应于other 默认{}*/
        ngOther: {}
        /** 自定义验证 (d: any) => boolean */
        customValidate: (d: any) => boolean = undefined

        /**widgetCreated: (control: any, type:string, name:string) => void 
        *每个控件生成后的回掉事件 grid DropDownList textarea editor datetimepicker datepicker input 这些控件可以使用*/
        widgetCreated: (control: any, type: string, name: string) => void = undefined

        /**
         * 表单创建完成事件
         * @param tableElement
         */
        tableCreated: (tableElement: HTMLElement) => void = undefined

        /** 提交之前回调*/
        prePostProcess = undefined
        /** 自定义处理错误信息 原错误效果将不现实 function(errors)*/
        processErrorMessages = undefined

        ///EAP.UI.VinciButtonGroupOptions
        buttonGroupOptions = undefined

        ////自动展现编译，当前可以 setOption 进行编译
        //autoPerform:true

        /** 是否自动设置容器宽度 是则根据 columnsAmount controlUniteWidth+titleWidth 进行设置*/
        autoWidth = false

        /** 控件统一宽度 默认140*/
        controlUniteWidth: number | string = 140
        trStyle: any = undefined
        /** 控件readonly属性统一设置 默认false*/
        readonly: boolean = false

        validatorOptions: any
        /**数据绑定后事件*/
        onDataBound: () => void = undefined
    }


    export let FormAfterProcessObj = System.Object.Extends({
        controlType: "",
        behaviour: "",
        valueFieldName: "",
        processControl: {}
    });


    export class EditApplicationOpion extends EAP.UI.GridOption {
        comOption = new EAP.UI.ComOption()
        ///与chang不同 是EditApplicationOpion应用|保存 触发的事件
        onChange: Function = undefined
        setOrd = false
        postUrl: System.UrlObj = undefined
        isWindow: boolean = false
        deleteUrl: System.UrlObj = undefined
        ///option.prePost(pd,result);
        prePost: Function = undefined
        title: string = ''
        gridHeight: number = undefined
        autoClose: boolean = true
        ///Array<kendo.ui.ToolBarItem>
        toolbarItems: Array<kendo.ui.ToolBarItem> = undefined
        editable: boolean = true
        width: string
        toolbar: boolean = true
    };


    export let FilterFormApplicationOpion = EAP.UI.UiOption.Extends({
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

    export class FormApplicationOption extends EAP.UI.FormOption {
        comOption: EAP.UI.ComOption = new EAP.UI.ComOption()
        //如果存在优先
        formViewModelId: string = undefined
        funCode: string = ""
        viewCode: string = ""

        ///表单视图  true 初始化data部分会加在其后，false 不加载视图
        formView: boolean = true

        winTitle: string = ""
        validatorOptions = undefined
        autoDestroy: boolean = false
        autoWidth: boolean = true;
    }

    //
    export class GridApplicationOption extends UiBasicOption {
        /// <field name='selector' type='CssSelector|JQuery'>若不填gridOption，toolbarOption 或他们的selector 那么这个选项将非常重要</field>
        /// <field name='gridOption' type='EAP.UI.GridOption'>选填，GridOption.selector也可选填，若不填写则GridApplicationOption.selector必填</field>
        /// <field name='comOption' type='EAP.UI.ComOption'></field>
        /// <field name='gridDataRequest' type='GridDataRequest'></field>
        /// <field name='toolbarOption' type='EAP.UI.ToolbarOption'>选填，ToolbarOption.selector也可选填</field>
        comOption: ComOption = new EAP.UI.ComOption()
        gridOption: GridOption = new EAP.UI.GridOption()
        gridDataRequest: GridDataRequest = undefined
        toolbarOption: ToolbarOption = new EAP.UI.ToolbarOption()
        ///form
        formOption: FormApplicationOption = new EAP.UI.FormApplicationOption()

        ///是否可筛选 默认表单筛选，
        filter: boolean = true
        ///filterFormControl.Data
        filterData = undefined

        ///表单筛选，false 为grid筛选
        formFilter: boolean = true

        ///视图方案
        viewScheme: boolean = true

        ///下拉框枚举值
        enums = []

        //
        funCode = null

        ///视图编号
        viewCode: string = null

        ///实体完整类名
        entityId: string = undefined

        ///服务接口完整名称
        serviceId: string = undefined

        //表单的另一个数据源 新增等其他情况时使用
        formBaseData = {}

        ///edit 对数据源的处理 function (data,oper)
        formDataProcess: (data, oper) => any = undefined

        ///自动加载数据
        autoLoad: boolean = true

        ///增上改之前的检查 function(data,"edit")  现只加了edit
        processGate: (data, oper) => void = undefined
        ///删除验证 function(itemObjs)
        delValiator: (itemObjs) => boolean = undefined
        ///模块导入导出器 全名
        importorExportor_FullName: string = undefined
        ///最顶部区域 string||Array<string>
        topOtherTools: string | Array<string> = undefined
         ///导出模板表单方案Code
        templateCode: string = undefined
    }

    export class ContainerManagerOpotion extends UiBasicOption {

    }
    //#endregion

    //export let IWindow = System.Object.Extends({
    //    showModalDialog: function (dialogOption) {

    //    }
    //});
}

namespace EAM {
    let dateTimeFormat = "yyyy/MM/dd HH:mm";
    //用于_ajax
    System.Net.PostDataProcesser = function (data) {
        if (typeof data !== "object" || data === null)
            return data;
        data = jQuery.extend(jQuery.isArray(data) ? [] : {}, data)
        if (data instanceof Array) for (let i = 0; i < data.length; i++)data[i] = System.Net.PostDataProcesser(data[i]);
        else {
            for (let fname in data) {
                if (data[fname] && data[fname] instanceof Date) {
                    data[fname] = (data[fname] as Date).format(dateTimeFormat);
                    continue;
                }
                data[fname] = System.Net.PostDataProcesser(data[fname])
            }
        }
        return data;
    }

    ///用于 System.Permission 
    System.Permission.getPermissions = (mCode?) => {
        let postData = {}
        if (mCode) postData["code"] = mCode
        return new EAP.EAMController().ExecuteServerActionSync(EAP.UI.ComOptionObj.getButtonsByCodeUrl, postData) as Array<any>
    }
    System.Permission.matchCode = (item, name) => { return item == name }


    export class ButtonsIcon {
        private static URL: string = "/Resource/Scripts/Buttons/{0}.json";
        private static _data: Object;
        private static OTHER = "other";
        public static moduelName: string = "";
        public static get iconUrl(): string {
            if (!this.moduelName)
                this._getModuelName();
            return this.URL.format(this.moduelName);
        }
        public static set iconUrl(url: string) {
            this.URL = url;
        }
        private static _getModuelName(): void {
            let thisUrl = window.location.pathname;
            let array = thisUrl.split('/');
            if (!array[1])
                throw Error("moduelName is empty");
            this.moduelName = array[1];
        }
        public static getIconClass(name: string) {
            if (!this._data) {
                this._getData();
            }
            let lower = name.toLowerCase();
            let value = this._data[lower];
            if (value == undefined) {
                if (lower.indexOf("_"))
                    value = this._data[lower.split("_")[0]];
            }
            return value || this._data[this.OTHER];
        }
        private static _getData(): Object {
            let client = new System.Net.HttpClient();
            let req = new System.Net.HttpRequest();
            req.url = this.iconUrl;
            try {
                this._data = JSON.parse(client.getfileSync(req));
            }
            catch (e) {
                this._data = {};
            }
            return this._data;
        }
    }

    ///EXPORT
    export interface IExportOptions {
        url?: string | System.UrlObj
        postData?: Object
        methodName?: string
        exportorFullName?: string
    }
    export class ExportOptions implements IExportOptions {
        url: string | System.UrlObj = "";
        postData: Object = {};
        methodName: string = "";
        exportorFullName: string = "";
    }
    export class Export {
        downloadFram: HTMLIFrameElement
        downloadLink: HTMLAnchorElement
        private iDiv: HTMLDivElement
        constructor(public options?: IExportOptions) {

        }
        //默认同步 AsynFn=>异步回调
        public getFilePath(AsynFn?: Function): string {
            var that = this;
            //可自选导出执行的方法名称
            if (that.options.methodName)
                that.options.postData["methodName"] = that.options.methodName;
            that.options.postData["imex_FullName"] = that.options.exportorFullName;
            that.options.postData["language"] = System.Cookies.get('EAMLANGUAGE')
            that.options.postData["buid"] = parseInt(System.Cookies.get('Buid'))
            return new EAP.EAMController()[AsynFn ? "ExecuteServerAction" : "ExecuteServerActionSync"](that.options.url, that.options.postData, AsynFn);
        }
        protected icon(show: boolean) {
            let iDiv = this.iDiv;
            if (show) {
                if (!iDiv) {
                    this.iDiv = iDiv = document.createElement("div")
                    iDiv.style.position = "fixed";
                    iDiv.style.backgroundColor = "silver"
                    iDiv.style.width = "80px";
                    iDiv.style.height = "80px";
                    iDiv.style.bottom = "4px";
                    iDiv.style.right = "4px";
                    iDiv.innerHTML = ' <span style="width:100%;height:100%;display: block;font-size:34px" class="k-icon k-i-download twinkle animated "></span>';
                }
                document.getElementsByTagName("body")[0].appendChild(iDiv)
            } else if (iDiv) {
                $(iDiv).remove();
            }
        }
        public export(fileUri?: string | System.UrlObj): void {
            let that = this;
            if (!fileUri) {
                that.icon(true)
                that.getFilePath((f) => {
                    if (!that.downloadFram) {
                        that.downloadFram = document.createElement('iframe');
                        that.downloadFram.name = "IamDownLoadIframe";
                        document.getElementsByTagName('body')[0].appendChild(this.downloadFram)
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
                    document.getElementsByTagName('body')[0].appendChild(this.downloadFram)
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

        }
        public setOptions(opitons_new: IExportOptions) {
            $.extend(this.options, opitons_new);
        }
    }

    ///IMPORT
    export interface IImportOptions {
        url: string | System.UrlObj
        // postData: Object
        methodName?: string
        importorFullName: string
        selector?: string | Element | Array<string | Element>
        items?: Array<string> | string
        templateDownloadLink?: Array<{ name: string, link: string }>
        autoUpload: boolean
        success: Function
        error: Function
        accept: string
        templateCode: string
    }
    export class ImportOptions implements IImportOptions {
        url: string | System.UrlObj = "";
        // postData: Object = {};
        methodName: string = "";
        importorFullName: string = ""
        selector: string | Element | Array<string | Element> = "";
        items: Array<string> | string = "";
        templateDownloadLink = null
        autoUpload: boolean = false
        success = undefined
        error = undefined
        templateCode: string = "";
        accept = "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
    export class Import {
        downloadFram: HTMLIFrameElement
        public elements: Array<HTMLInputElement> = [];
        public importContainer: Element;
        public kUploads: Array<[string, kendo.ui.Upload]> = [];
        public kWindow: kendo.ui.Window;
        private defaultUploadOptions: kendo.ui.UploadOptions
        private defaultWindowOptions: kendo.ui.WindowOptions = {
            title: System.CultureInfo.GetDisplayText('Import'),
            modal: true
        }
        constructor(public options: IImportOptions) {
            this._initUploadOptions();
            this._createImportControl();
            this._convertKendoContol();
        }
        ///初始化UploadOptions
        private _initUploadOptions(): void {
            let that = this;
            this.defaultUploadOptions = {
                multiple: false,
                success: (e) => {
                    var obj = JSON.parse(e.XMLHttpRequest.responseText);
                    if (obj.IsSuccess) {
                        if (that.options.success)
                            that.options.success(obj.Data)
                        else
                            EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('Upload') + System.CultureInfo.GetDisplayText('Success'));
                        return;
                    }
                    if (that.options.error)
                        that.options.error(obj.Message)
                    else
                        EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('Upload') + System.CultureInfo.GetDisplayText('Fail') + ":" + System.CultureInfo.GetDisplayText(obj.Message));
                },
                async: {
                    saveUrl: '',
                    autoUpload: false
                },
                error: (e) => {
                    var obj = JSON.parse(e.XMLHttpRequest.responseText);
                    if (that.options.error)
                        that.options.error(obj.Message)
                    else
                        EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('Upload') + System.CultureInfo.GetDisplayText('Fail') + ":" + System.CultureInfo.GetDisplayText(obj.Message), 5000);
                }
            }
            let superParameters = {
                imex_FullName: this.options.importorFullName,
                methodName: this.options.methodName,
                FormCode: this.options.templateCode
            }
            if (typeof this.options.url === 'string') {
                this.defaultUploadOptions.async.saveUrl = <string>this.options.url
            }
            else {
                var urlobj = <System.UrlObj>this.options.url;
                this.defaultUploadOptions.async.saveUrl = "/" + urlobj.controller + "/" + urlobj.action
                if (urlobj.parameters) $.extend(superParameters, urlobj.parameters)
            }

            this.defaultUploadOptions.async.saveUrl = System.Url.Combine(this.defaultUploadOptions.async.saveUrl, superParameters);

        }
        public import(): Import {
            //this.kUploads[0][1].wrapper.find('.k-upload-button').trigger('click');
            //不是自动提交 则设置为自动
            if (!this.options.autoUpload) {
                this.kUploads.forEach((kupload) => {
                    kupload[1].setOptions({ async: { autoUpload: true } });
                });
            }
            $(this.elements).trigger('click');
            return this;
        }
        private _createImportControl(): void {
            var that = this;
            if (this.options.selector) {
                if (this.options.selector instanceof Array) {
                    (<Array<string | Element>>this.options.selector).forEach((value, index) => {
                        that.elements.push(<HTMLInputElement>$(value)[0]);
                    });
                } else {
                    that.elements.push(<HTMLInputElement>$(this.options.selector)[0]);
                }
            }
            if (this.options.items) {
                let importContrainer = this.importContainer = document.createElement('div');
                importContrainer.id = "importContainer";
                importContrainer.style.display = 'none';
                importContrainer.style.width = "420px";
                if (this.options.items instanceof Array) {
                    (<Array<string>>this.options.items).forEach((value, index) => {
                        if (!value) return;
                        let fileControl = document.createElement('input');
                        fileControl.name = value;
                        fileControl.type = 'file';
                        fileControl.accept = that.options.accept;
                        importContrainer.appendChild(fileControl);
                        that.elements.push(fileControl);

                        if (this.options.templateDownloadLink) {
                            this.options.templateDownloadLink.forEach((tdl) => {
                                if (tdl.name == value) {
                                    let link = document.createElement('a');
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
                                    importContrainer.appendChild(link);
                                }
                            });
                        }
                    });
                } else {
                    let fileControl = document.createElement('input');
                    fileControl.name = <string>this.options.items;
                    fileControl.type = 'file';
                    importContrainer.appendChild(fileControl);
                    that.elements.push(fileControl);
                    if (this.options.templateDownloadLink) {
                        this.options.templateDownloadLink.forEach((tdl) => {
                            if (tdl.name == <string>this.options.items) {
                                let link = document.createElement('a');
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
                                importContrainer.appendChild(link);
                            }
                        });
                    }
                }
                $('body').append(importContrainer);
            }
        }
        private _convertKendoContol(): void {
            var that = this;
            this.defaultUploadOptions.async.autoUpload = this.options.autoUpload;
            this.elements.forEach((value, index) => {
                that.kUploads.push([value.name, $(value).kendoUpload(this.defaultUploadOptions).data('kendoUpload')]);
            });
        }
        public open(): Import {
            if (this.importContainer)
                this.kWindow = $(this.importContainer).kendoWindow(this.defaultWindowOptions).data('kendoWindow');
            this.kWindow.center().open();
            return this;
        }
        public close(): Import {
            this.kWindow.close();
            return this;
        }
        public destroy(): void {
            this.kUploads.forEach((value, index) => {
                value[1].destroy();
            });
            this.options = null;
            this.kUploads = null;
            if (this.kWindow)
                this.kWindow.destroy();
        }
    }

    //EAM UI GridViewColumn 实体对象
    export interface IGridViewColumn {
        GridColumn: kendo.ui.GridColumn
    }
    export class GridViewColumn implements IGridViewColumn {
        public Id: string = undefined
        //public IsExport: boolean = undefined
        public FormElement: boolean = undefined
        public IsReadOnly: boolean = undefined
        //public Width: number = undefined
        public ControlAttribute: string = undefined
        public ControlType: string = undefined
        public ColumnIndex: number = undefined
        public IsFilterable: boolean = undefined
        //public DataType: string = undefined
        //public IsVisible: boolean = undefined
        public IsSystem: boolean = undefined
        public Header: string = undefined
        public DataField: string = this.Code
        public IdGridViewModel: string = undefined
        //public Code: string = undefined
        public Name: string = undefined
        public Description: string = undefined
        //public CustomHeader: string = undefined
        public SortType: string = undefined
        ///以后会使用它
        get GridColumn(): kendo.ui.GridColumn {
            return {}
        }

        constructor(public Code?: string, public CustomHeader?: string, public DataType?: string, public Width?: number, public IsExport?: boolean, public IsVisible = true) {

        }
    }

    export class ImageHelper {
        public uri: string
        private defaultSize: [number, number] = [500, 500]
        private vinciPopup: EAP.UI.VinciPopup
        public vinciWindow: EAP.UI.VinciWindow
        /**
         * 
         * @param element
         * @param options  popup必须需要anchor 
         */
        constructor(public element: Element, public options: { id?: string | number | ((e: JQueryEventObject) => string | number), popup?: boolean, window?: boolean, anchor?: string | JQuery, size?: [number, number] }) {
            if (this.options.window) this.setWindowOptions()
            else if (this.options.popup) this.setPopupOptions();
            else this.fillImage(this.options.id as string)//popupOptions没有，则直接显示图片
        }
        private fillImage(id: string | number) {
            let that = this, options = that.options, size: [number, number] = options.size || that.defaultSize
            that.uri = ImageHelper.getImageUri(id)//display: "table",
            let extansion = "";
            $(that.element).empty().append("<div style='display: table-cell;vertical-align: middle;'><a href='" + that.uri + "' target='_blank'><img src='" + that.uri + "' alt='" + that.uri + "' style='max-width:" + (size[0] - 2) + "px;max-height:" + (size[1] - 2) + "px;'/></a></div>");
        }
        private setWindowOptions() {
            let that = this, options = that.options, wops = options.window;
            $(document.body).on("click", that.options.anchor || "", (e) => {
                if ($.isFunction(options.id)) that.fillImage((options.id as ((e: JQueryEventObject) => string | number))(e))
                if (!that.vinciWindow)
                    that.vinciWindow = $(that.element).kendoVinciWindow({ open: () => $(that.element).css({ display: "table", textAlign: "center" }), title: "" }).data("kendoVinciWindow")
                $(that.element).resize(() =>
                    that.vinciWindow.center());
                that.vinciWindow.open();
            })
        }
        private setPopupOptions() {
            let that = this, options = that.options, pops = options.popup
            if (!pops) return
            let pops_copy: EAP.UI.IVinciPopupOptions = $.extend({}, pops), customAnchorTrigger = pops_copy.anchorTriggerCallback
            pops_copy.anchorTriggerCallback = (e) => {
                if ($.isFunction(options.id)) that.fillImage((options.id as ((e: JQueryEventObject) => string | number))(e))
                if (customAnchorTrigger) customAnchorTrigger(e)
            }
            pops_copy.anchor = options.anchor || pops_copy.anchor;
            pops_copy.customSize = options.size;
            pops_copy.open = () => {
                $(that.element).css({ display: "table", textAlign: "center" })
            }
            that.vinciPopup = $(that.element).kendoVinciPopup(pops_copy).data("kendoVinciPopup")
        }
        public static getImageUri(id: string | number): string {
            if (!id) return "";
            return new EAP.EAMController().ExecuteServerActionSync(new System.UrlObj("Attachment", "URL"), { id: id })
        }
    }
}

//----------------------------------------------------------------------
interface JQuery {
    DivLattic(options?: any, divArray?: Array<System.DivCell | System.DivRow>): System.DivLattic;
    DivCell(options?: { align?: string, width?: string, height?: string, destroy?: (mark: string) => void }, mark?: string): System.DivCell;
}
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
    }

    jq.fn.AngularController = function (fn?: (args: Array<any>) => angular.IController, app?: System.AngularApp) {
        return new System.AngularController(this[0], fn, app)
    }
    jq.fn.AngularApp = function (appDependency: Array<string> = new Array<string>()) {
        return new System.AngularApp(this[0], appDependency)
    }
    jq.fn.DivCell = function (options?: any, mark?: string) {
        ///<param name="options" type="any"> { align, width, height, destroy }</param>
        return new System.DivCell(this[0], options, mark)
    }
    jq.fn.DivLattic = function (options?: any, divArray?: Array<System.DivCell | System.DivRow>) {
        ///<param name="options" type="any"> { align,width }</param>
        ///<param name="divArray" type="Array<System.DivCell | System.DivRow >"> </param>
        return new System.DivLattic(this[0], options, divArray)
    }
})(jQuery);

interface JQuery {
    AngularController(fn?: Function, app?: System.AngularApp): System.AngularController;
    AngularApp(appDependency?: Array<string>): System.AngularApp;
}

