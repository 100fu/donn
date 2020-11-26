/// <reference path="../../../scripts/typings/eap1.ts" />
/// <reference path="../base/eap.ui1.ts" />
/// <reference path="eap.uicore.ts" />
namespace EAP.UI {

    export interface IAction {
        name: string;
        go(context: ApplicationEventArgu): void;
    }

    export abstract class Action implements IAction {
        name: string;
        constructor(name: string) {
            this.name = name;
        }
        /**
        * 多语言词条
        * @param code
        */
        Text(code: string): string {
            return System.CultureInfo.GetDisplayText(code);
        }
        /*
        * 消息框
        * @param title 标题
        * @param content 内容
        * @param timeout 超时
        */
        Message(title: string, content: string = "", timeout?: string | number): void {
            EAP.UI.MessageBox.alert(this.Text(title), (content ? this.Text(content) :""), timeout)
        }
        /*
        * 警告框
        * @param content 内容
        */
        AlertMsg(msg: string): void {
            this.Message("Alert",msg)
        }
        /*
        * 提示框
        * @param msg 内容
        */
        PromptMsg(msg: string): void {
            this.Message("Prompt", msg)
        }
        Confirm(msg: string, YFn?: () => void, NFn?: () => void) {
            EAP.UI.MessageBox.confirm({ title: this.Text("Prompt"), content: msg, OK: YFn, Cancel: NFn });
        }
        /**
                * 异步服务调用
                * @param controller
                * @param action
                * @param postdata
                */
        post(url: string | System.UrlObj, postdata: any, onSuccess: (data: any) => void, onFail?: (msg: any) => void) {
            new EAP.EAMController().ExecuteServerAction(url, postdata, onSuccess, onFail);
        }
        /**
         * 同步服务调用
         * @param controller
         * @param action
         * @param postdata
         */
        postSync(url: string | System.UrlObj, postdata: any, onSuccess?: (data: any) => void, onFail?: (msg: any) => void): any {
            return new EAP.EAMController().ExecuteServerActionSync(url, postdata, onSuccess, onFail);
        }
        /**
         * 获取cookies值
         * @param key
         */
        CookieValue(key: string): string {
            return System.Cookies.get(key);
        }
        abstract go(option: ApplicationEventArgu): void;
    }

    class AppMethods {
        private comService: EAP.UI.Core.ApplicationServices
        constructor() { this.comService = EAP.UI.Core.ApplicationServices.commonService() }
        Add_Action(e: ApplicationEventArgu) {
            (this.comService.getDelegate("Add") as (e: ApplicationEventArgu) => void)(e)
        }
        Edit_Action(e: ApplicationEventArgu) {
            (this.comService.getDelegate("Edit") as (e: ApplicationEventArgu) => void)(e)
        }
        View_Action(e: ApplicationEventArgu) {
            (this.comService.getDelegate("View") as (e: ApplicationEventArgu) => void)(e)
        }
        Delete_Action(e: ApplicationEventArgu) {
            (this.comService.getDelegate("Delete") as (e: ApplicationEventArgu) => void)(e)
        }
        Refresh_Action(e: ApplicationEventArgu) {
            (this.comService.getDelegate("Refresh") as (e: ApplicationEventArgu) => void)(e)
        }
        Export_Action(e: ApplicationEventArgu) {
            (this.comService.getDelegate("Export") as (e: ApplicationEventArgu) => void)(e)
        }
        Import_Action(e: ApplicationEventArgu) {
            (this.comService.getDelegate("Import") as (e: ApplicationEventArgu) => void)(e)
        }
        Query_Action(e: ApplicationEventArgu) {
            (this.comService.getDelegate("Query") as (e: ApplicationEventArgu) => void)(e)
        }
        SaveView_Action(e: ApplicationEventArgu) {
            (this.comService.getDelegate("SaveView") as (e: ApplicationEventArgu) => void)(e)
        }
    }
    export enum DefaultLayout {
        singleTable
    }
    
    //按钮行为 只能以 _Action 作为后缀 例如 Add_Action （Add_Action>options.dependencys>继承扩展app方法>默认方法）
    export class BaseController {
        private deftOptons: Array<Object> = []
        protected app: EAP.UI.Core.ViewLayout
        protected element: HTMLElement
        methods: AppMethods = new AppMethods();
        private setDeftOptions() {
            this.deftOptons[DefaultLayout.singleTable] = { toolbar: false, viewScheme: false, filter: false, formFilter: false }
        }
        constructor(classType: { new (element: HTMLElement,options) }, element?: HTMLElement, defaultLayout?: DefaultLayout) {
            this.setDeftOptions();
            let that = this, options, a = that.configOptions(options = $.extend(typeof defaultLayout === "number" ? that.deftOptons[defaultLayout] : {}, window["ViewBag"]) as EAP.UI.Core.ViewLayoutOptions)
            options.owner = that;
            that.element =  element || $("<div/>", { style: "height:100%;", id: "aaaa" }).appendTo("body")[0];
            options.height = options.height || "100%"
            that.setAction(options);
            that.app = new classType(that.element, options)
        }
        //可在options中设置dependencys  优先级 
        protected configOptions(options: EAP.UI.Core.ViewLayoutOptions): void { }
        private setAction(options: EAP.UI.Core.ViewLayoutOptions) {
            let re = new RegExp("_Action$"), sn = "controller_" + new Date().getTime(), a = {}, hasAct = false;
            for (let n in this) {
                if ($.isFunction(this[n]) && re.test(n)) {
                    hasAct = true
                    a[n.substr(0, n.indexOf("_Action"))] = this[n];
                }
            }
            if (hasAct) {
                let service = new EAP.UI.Core.ApplicationServices(sn);
                for (let n in a) if ((a as Object).hasOwnProperty(n)) service.appendDelegate(n, a[n])
                options.dependencys = options.dependencys ? (typeof options.dependencys === "string" ? [options.dependencys as string, sn] : (options.dependencys as Array<any>).concat([sn])) : sn
            }

        }
        protected loadScript(url: string) {
            let script = document.createElement("script");
            script.async = false;
            script.setAttribute('src', url + '?' + 'time=' + Date.parse(new Date().toString()));
            document.body.appendChild(script);
        }
        /**
       * 多语言词条
       * @param code
       */
        cultureText(code: string): string {
            return System.CultureInfo.GetDisplayText(code);
        }
        /**
         * 异步服务调用
         * @param controller
         * @param action
         * @param postdata
         */
        post(url: string | System.UrlObj, postdata: any, onSuccess: (data: any) => void, onFail?: (msg: any) => void) {
            new EAP.EAMController().ExecuteServerAction(url, postdata, onSuccess, onFail);
        }
        /**
         * 同步服务调用
         * @param controller
         * @param action
         * @param postdata
         */
        postSync(url: string | System.UrlObj, postdata: any, onSuccess?: (data: any) => void, onFail?: (msg: any) => void): any {
            return new EAP.EAMController().ExecuteServerActionSync(url, postdata, onSuccess, onFail);
        }
        /**
         * 获取cookies值
         * @param key
         */
        cookie(key: string): string {
            return System.Cookies.get(key);
        }
    }
}