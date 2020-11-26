/// <reference path="../../../scripts/typings/eap1.ts" />
/// <reference path="../base/eap.ui1.ts" />
/// <reference path="eap.uicore.ts" />
var EAP;
(function (EAP) {
    var UI;
    (function (UI) {
        var Action = (function () {
            function Action(name) {
                this.name = name;
            }
            /**
            * 多语言词条
            * @param code
            */
            Action.prototype.Text = function (code) {
                return System.CultureInfo.GetDisplayText(code);
            };
            /*
            * 消息框
            * @param title 标题
            * @param content 内容
            * @param timeout 超时
            */
            Action.prototype.Message = function (title, content, timeout) {
                if (content === void 0) { content = ""; }
                EAP.UI.MessageBox.alert(this.Text(title), (content ? this.Text(content) : ""), timeout);
            };
            /*
            * 警告框
            * @param content 内容
            */
            Action.prototype.AlertMsg = function (msg) {
                this.Message("Alert", msg);
            };
            /*
            * 提示框
            * @param msg 内容
            */
            Action.prototype.PromptMsg = function (msg) {
                this.Message("Prompt", msg);
            };
            Action.prototype.Confirm = function (msg, YFn, NFn) {
                EAP.UI.MessageBox.confirm({ title: this.Text("Prompt"), content: msg, OK: YFn, Cancel: NFn });
            };
            /**
                    * 异步服务调用
                    * @param controller
                    * @param action
                    * @param postdata
                    */
            Action.prototype.post = function (url, postdata, onSuccess, onFail) {
                new EAP.EAMController().ExecuteServerAction(url, postdata, onSuccess, onFail);
            };
            /**
             * 同步服务调用
             * @param controller
             * @param action
             * @param postdata
             */
            Action.prototype.postSync = function (url, postdata, onSuccess, onFail) {
                return new EAP.EAMController().ExecuteServerActionSync(url, postdata, onSuccess, onFail);
            };
            /**
             * 获取cookies值
             * @param key
             */
            Action.prototype.CookieValue = function (key) {
                return System.Cookies.get(key);
            };
            return Action;
        }());
        UI.Action = Action;
        var AppMethods = (function () {
            function AppMethods() {
                this.comService = EAP.UI.Core.ApplicationServices.commonService();
            }
            AppMethods.prototype.Add_Action = function (e) {
                this.comService.getDelegate("Add")(e);
            };
            AppMethods.prototype.Edit_Action = function (e) {
                this.comService.getDelegate("Edit")(e);
            };
            AppMethods.prototype.View_Action = function (e) {
                this.comService.getDelegate("View")(e);
            };
            AppMethods.prototype.Delete_Action = function (e) {
                this.comService.getDelegate("Delete")(e);
            };
            AppMethods.prototype.Refresh_Action = function (e) {
                this.comService.getDelegate("Refresh")(e);
            };
            AppMethods.prototype.Export_Action = function (e) {
                this.comService.getDelegate("Export")(e);
            };
            AppMethods.prototype.Import_Action = function (e) {
                this.comService.getDelegate("Import")(e);
            };
            AppMethods.prototype.Query_Action = function (e) {
                this.comService.getDelegate("Query")(e);
            };
            AppMethods.prototype.SaveView_Action = function (e) {
                this.comService.getDelegate("SaveView")(e);
            };
            return AppMethods;
        }());
        var DefaultLayout;
        (function (DefaultLayout) {
            DefaultLayout[DefaultLayout["singleTable"] = 0] = "singleTable";
        })(DefaultLayout = UI.DefaultLayout || (UI.DefaultLayout = {}));
        //按钮行为 只能以 _Action 作为后缀 例如 Add_Action （Add_Action>options.dependencys>继承扩展app方法>默认方法）
        var BaseController = (function () {
            function BaseController(classType, element, defaultLayout) {
                this.deftOptons = [];
                this.methods = new AppMethods();
                this.setDeftOptions();
                var that = this, options, a = that.configOptions(options = $.extend(typeof defaultLayout === "number" ? that.deftOptons[defaultLayout] : {}, window["ViewBag"]));
                options.owner = that;
                that.element = element || $("<div/>", { style: "height:100%;", id: "aaaa" }).appendTo("body")[0];
                options.height = options.height || "100%";
                that.setAction(options);
                that.app = new classType(that.element, options);
            }
            BaseController.prototype.setDeftOptions = function () {
                this.deftOptons[DefaultLayout.singleTable] = { toolbar: false, viewScheme: false, filter: false, formFilter: false };
            };
            //可在options中设置dependencys  优先级 
            BaseController.prototype.configOptions = function (options) { };
            BaseController.prototype.setAction = function (options) {
                var re = new RegExp("_Action$"), sn = "controller_" + new Date().getTime(), a = {}, hasAct = false;
                for (var n in this) {
                    if ($.isFunction(this[n]) && re.test(n)) {
                        hasAct = true;
                        a[n.substr(0, n.indexOf("_Action"))] = this[n];
                    }
                }
                if (hasAct) {
                    var service = new EAP.UI.Core.ApplicationServices(sn);
                    for (var n in a)
                        if (a.hasOwnProperty(n))
                            service.appendDelegate(n, a[n]);
                    options.dependencys = options.dependencys ? (typeof options.dependencys === "string" ? [options.dependencys, sn] : options.dependencys.concat([sn])) : sn;
                }
            };
            BaseController.prototype.loadScript = function (url) {
                var script = document.createElement("script");
                script.async = false;
                script.setAttribute('src', url + '?' + 'time=' + Date.parse(new Date().toString()));
                document.body.appendChild(script);
            };
            /**
           * 多语言词条
           * @param code
           */
            BaseController.prototype.cultureText = function (code) {
                return System.CultureInfo.GetDisplayText(code);
            };
            /**
             * 异步服务调用
             * @param controller
             * @param action
             * @param postdata
             */
            BaseController.prototype.post = function (url, postdata, onSuccess, onFail) {
                new EAP.EAMController().ExecuteServerAction(url, postdata, onSuccess, onFail);
            };
            /**
             * 同步服务调用
             * @param controller
             * @param action
             * @param postdata
             */
            BaseController.prototype.postSync = function (url, postdata, onSuccess, onFail) {
                return new EAP.EAMController().ExecuteServerActionSync(url, postdata, onSuccess, onFail);
            };
            /**
             * 获取cookies值
             * @param key
             */
            BaseController.prototype.cookie = function (key) {
                return System.Cookies.get(key);
            };
            return BaseController;
        }());
        UI.BaseController = BaseController;
    })(UI = EAP.UI || (EAP.UI = {}));
})(EAP || (EAP = {}));
