namespace EAP.UI.Core {

    class ServicesBase {
        _servicName: string
        constructor(serviceName?: string) {
            this._servicName = serviceName
        }
        static _serviceArray: Array<ServicesBase> = new Array<ServicesBase>()
        _delegrateArray: Array<[string, ((e: ApplicationEventArgu) => void) | EAP.UI.IAction]>
    }

    export class EventArgu {
        sender: Object
    }
    export interface IApplication {
        currentItem: () => Object
        currentItems: () => Array<any>
        ///**inner mothed */
        //refresh: Function
        /**button event*/
        Refresh: () => void
        exportor: EAM.Export
        importor: EAM.Import
        viewScheme: EAP.UI.ViewScheme
        formApplication: FormApplication
        filterControl: EAP.UI.FilterForm
        loadData_Init: Function
        options
    }
    export class ApplicationServices extends ServicesBase {
        constructor(serviceName?: string) {
            super(serviceName)
            if (!serviceName) return;
            let s = ApplicationServices._service(serviceName);
            if (s) return s;
            ApplicationServices._serviceArray.push(this)
        }
        private static cSObject: ApplicationServices
        private static _commonService: ServicesBase = (() => {
            let src = new ServicesBase()
            src._delegrateArray = [];
            src._delegrateArray.push(["Add", (e: ApplicationEventArgu) => {
                let that = e.sender
                if (that.options.processGate && !that.options.processGate(that.currentItem, "add")) return;
                var faOption = that.formApplication.option;
                if (!that.options.formOption.buttonGroupOptions) {
                    faOption.success = {
                        text: System.CultureInfo.GetDisplayText('save'), onSuccess: function (data) {
                            that.formApplication.close();
                            that.Refresh();
                        }
                    };
                    faOption.cancle = { text: System.CultureInfo.GetDisplayText('Cancel'), fn: function () { that.formApplication.close(); } };

                    faOption.prePostProcess = function (data) {
                        var pd = { item: data, oper: 'add', entityId: that.options.entityId, serviceId: that.options.serviceId };
                        if (that.options.formOption.prePostProcess)
                            return that.options.formOption.prePostProcess(pd);
                        return pd;
                    }
                }
                else {
                    faOption.buttonGroupOptions = that.options.formOption.buttonGroupOptions;
                }
                var newData = {};
                $.extend(true, newData, that.options.formBaseData);
                faOption.sourceData = newData;
                if (that.options.formDataProcess && that.options.formDataProcess(newData, "add")) {
                    faOption.sourceData = that.options.formDataProcess(newData, "add");
                }
                faOption.readonly = false;
                faOption.winTitle = System.CultureInfo.GetDisplayText('Add');
                that.formApplication.setOption(faOption);

                that.formApplication.open();
            }]);
            src._delegrateArray.push(["View", (e: ApplicationEventArgu) => {
                let that = e.sender
                let currentItem = that.currentItem()
                if (!currentItem || (that.options.processGate && !that.options.processGate(that.currentItem, "view"))) return;
                let faOption = that.formApplication.option;
                faOption.success = null;
                faOption.cancle = null;
                faOption.buttonGroupOptions = null;
                if (that.options.formDataProcess) {
                    faOption.sourceData = that.options.formDataProcess(currentItem, "view");
                } else
                    faOption.sourceData = currentItem;
                faOption.readonly = true;
                faOption.winTitle = System.CultureInfo.GetDisplayText('View');

                that.formApplication.setOption(faOption);
                that.formApplication.open();
            }]);
            src._delegrateArray.push(["Edit", (e: ApplicationEventArgu) => {
                let that = e.sender
                let currentItem = that.currentItem()
                if (!currentItem || (that.options.processGate && !that.options.processGate(that.currentItem, "edit"))) return;
                currentItem = $.extend(true, {}, currentItem)
                var faOption = that.formApplication.option;
                if (!that.options.formOption.buttonGroupOptions) {
                    faOption.success = {
                        text: System.CultureInfo.GetDisplayText('save'), onSuccess: function (data) {
                            that.formApplication.close();
                            that.Refresh();
                        }
                    };
                    faOption.cancle = { text: System.CultureInfo.GetDisplayText('Cancel'), fn: function () { that.formApplication.close(); } };
                }
                else {
                    faOption.buttonGroupOptions = that.options.formOption.buttonGroupOptions;
                }
                if (that.options.formDataProcess) {
                    faOption.sourceData = that.options.formDataProcess(currentItem, "edit");
                } else
                    faOption.sourceData = currentItem;
                faOption.prePostProcess = function (data) {
                    var pd = { item: data, oper: 'edit', entityId: that.options.entityId, serviceId: that.options.serviceId }
                    if (that.options.formOption.prePostProcess)
                        return that.options.formOption.prePostProcess(pd);
                    return pd;
                }
                faOption.readonly = false;
                faOption.winTitle = System.CultureInfo.GetDisplayText('Edit');

                that.formApplication.open();
                that.formApplication.setOption(faOption);
            }]);
            src._delegrateArray.push(["Delete", (e: ApplicationEventArgu) => {
                let that = e.sender
                let rows = that.currentItems();
                if (rows.length < 1) return;
                let ids = [];
                for (let i = 0; i < rows.length; i++) {
                    ids.push(rows[i].Id);
                }
                if (ids.length <= 0) {
                    EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('ChooseOneRecord'));
                    return;
                }

                let comfirmOption = {
                    title: System.CultureInfo.GetDisplayText('Prompt'),
                    content: System.CultureInfo.GetDisplayText('DeleteSure'),
                    OK: function () {
                        let faOption = that.formApplication.option;
                        let pd = { ids: ids, oper: 'delete', entityId: that.options.entityId, serviceId: that.options.serviceId } // that.currentItem.Id
                        new EAP.EAMController().ExecuteServerAction(faOption.postUrl,
                            pd,
                            function (data) {
                                if (typeof data === "string" && data != "ok")
                                    EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText(data));
                                that.Refresh();
                            }, function (msg) {
                                EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText(msg));
                            });
                    }
                };
                EAP.UI.MessageBox.confirm(comfirmOption);
            }]);
            src._delegrateArray.push(["Refresh", (e: ApplicationEventArgu) => {
                let that = e.sender
                //this.gridControl.customFilter = this.filterResult;
                if (that.filterControl) {
                    that.filterControl.search(true)
                    return;
                }
                that["refresh"]();
                // that.loadData_Init();
            }]);
            src._delegrateArray.push(["Export", (e: ApplicationEventArgu) => {
                let that = e.sender as IApplication
                if (!that.options.comOption)
                    return;
                let item = that["gridControl"].currentPostData;
                //item.currentGridViewId = this.viewScheme.gridoption.gridSolutionId;
                item.currentCols = that["gridControl"].grid.options.viewData;
                //item.currentCols = that.viewScheme.currentCols;
                let pd = item;// { item: item }
                let option = new EAM.ExportOptions();
                option.postData = pd;
                option.exportorFullName = that.options.importorExportor_FullName;
                option.url = that.options.comOption.exportUrl;
                if (!that.exportor)
                    that.exportor = new EAM.Export(option);
                else
                    that.exportor.setOptions(option);
                that.exportor.export();
            }]);
            src._delegrateArray.push(["Import", (e: ApplicationEventArgu) => {
                let that = e.sender as IApplication
                if (!that.importor) {
                    let options = new EAM.ImportOptions();
                    options.importorFullName = that.options.importorExportor_FullName;
                    options.templateCode = that.options.templateCode;
                    options.url = that.options.comOption.importUrl;
                    options.items = ["import"];
                    options.templateDownloadLink = [{ name: 'import', link: '../../template/EMRecord/{0}Template.xls'.format(that.options.viewCode) }];
                    options.success = function () {
                        that.Refresh();
                        EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('Upload') + System.CultureInfo.GetDisplayText('Success'));
                    }
                    that.importor = new EAM.Import(options);
                }
                that.importor.open();
            }]);
            src._delegrateArray.push(["Query", (e: ApplicationEventArgu) => {
                let that = e.sender as IApplication
                that.filterControl.togglePanel();
            }]);
            src._delegrateArray.push(["SaveView", (e: ApplicationEventArgu) => {
                let that = e.sender as IApplication
                that.viewScheme.saveView();
            }]);
            src._delegrateArray.push(["CustomShow", (e: ApplicationEventArgu) => {
                let that = e.sender as IApplication
                that.viewScheme.open();
            }]);
            return src
        })()
        static commonService(): ApplicationServices {
            if (this.cSObject) return this.cSObject;
            this.cSObject = $.extend(new ApplicationServices(), this._commonService)
            return this.cSObject
        }
        static _service(serviceName: string): ApplicationServices {
            let result: ApplicationServices
            this._serviceArray.forEach(s => { if (serviceName == s._servicName) result = s as ApplicationServices })
            return result;
        }
        public appendDelegate(deleName: string, fn: ((e: ApplicationEventArgu) => void) | EAP.UI.IAction) {
            this._delegate(deleName, fn)
        }
        public getDelegate(deleName: string): ((e: ApplicationEventArgu) => void) | EAP.UI.IAction {
            return this._delegate(deleName)
        }
        ///if(!fn) 则是获取委托
        private _delegate(deleName: string, fn?: ((e: ApplicationEventArgu) => void) | EAP.UI.IAction): ((e: ApplicationEventArgu) => void) | EAP.UI.IAction {
            if (!this._delegrateArray) this._delegrateArray = [];
            for (let i = 0; i < this._delegrateArray.length; i++) {
                let d = this._delegrateArray[i]
                if (deleName == d[0]) {
                    if (!fn) return d[1];
                    else {
                        d[1] = fn; return fn
                    }
                }
            }
            if (fn) this._delegrateArray.push([deleName, fn]);
            return fn;
        }
    }

    class VBaseOptions {
        owner: any = undefined
        dependencys: Array<string> | string = undefined
    }
    abstract class VBase {
        isInherit: boolean = false
        options: VBaseOptions = new VBaseOptions()
        private dependencys: Array<string> | string
        constructor(public element: HTMLElement, options: VBaseOptions) {
            $.extend(this.options, options)
            this.dependencys = this.options.dependencys;
        }
        //兼容了 扩展app方法  带owner的controller
        private _invokeDelegate(delegateName: string, argu: ApplicationEventArgu) {
            let dependencys: Array<string>, that = this, options = that.options;
            if (!that.dependencys) dependencys = []
            else if (typeof that.dependencys === "string") dependencys = [that.dependencys as string];
            else dependencys = that.dependencys as Array<string>
            dependencys = dependencys.reverse()
            for (let i = 0; i < dependencys.length; i++) {
                let d = dependencys[i];
                let src = ApplicationServices._service(d)
                let delegate = src.getDelegate(delegateName)
                if (delegate) {
                    if ($.isFunction(delegate))
                        (delegate as (e: ApplicationEventArgu) => void).call(options.owner || that, argu)
                    else {
                        (delegate as EAP.UI.IAction).go(argu) //argu
                    }
                    return;
                }
            }
            //inherit  兼容旧版
            if (this.isInherit && $.isFunction(this[delegateName])) {
                (this[delegateName] as Function)(argu)
                return;
            }

            //common
            let src = ApplicationServices.commonService()
            let delegate = src.getDelegate(delegateName)
            if (delegate) (delegate as (e: ApplicationEventArgu) => void).call(this, argu)
        }
        protected InvokeDelegate(deleName: string) {
            //TODO 调用参数问题
            let argu = new ApplicationEventArgu();
            argu.sender = this as any;
            this._invokeDelegate(deleName, argu)
        }
        loadData_Init() { console.error("loadData_Init wasn't implemented") }
        /**
         * direct refresh method 
         */
        protected refresh() { console.error("refresh wasn't implemented") }
        /**
         * Destory
         */
        public Destory() {
            let parent = this.element.parentNode;
            parent.removeChild(this.element)
        }
        /**
         * button event
         */
        Refresh() {
            this.InvokeDelegate("Refresh")
        }
    }
    class VLayoutOptions extends VBaseOptions {
    }
    /**
     * 该类可以单独剥离出来 无任何关联
     */
    export abstract class VLayout extends VBase {
        private layoutDivs: Array<HTMLDivElement & { layoutAutoHeight?: boolean }> = []
        private winResizeEvent ;
        constructor(element: HTMLElement, options: VLayoutOptions) {
            super(element, options)
            this.initLayout();
            window.addEventListener("resize", this.winResizeEvent = this.layoutSetHeight.bind(this));
        }
        protected layoutRemove(div: HTMLDivElement) {
            let removingItem = this.layoutDivs.splice(this.layoutDivs.indexOf(div), 1)[0];
            if (removingItem) {
                if (removingItem.layoutAutoHeight && this.winResizeEvent) {
                    delete this.winResizeEvent;
                }
                this.element.removeChild(removingItem);
            }
        }
        protected initLayout() { }
        protected layoutInster(index: number, div: { id: string, attribute?: Object, css?: Object, "classes"?: string[] } | HTMLDivElement, autoHeight: boolean = false): HTMLDivElement {
            let e: HTMLDivElement
            if (!(div instanceof HTMLDivElement)) {
                e = document.createElement("div")
                e.id = div.id;
                if (div.attribute) for (let n in div.attribute) { if (div.attribute.hasOwnProperty(n)) e.setAttribute(n, div.attribute[n]) }
                if (div.css) $.extend(e.style, div.css)
                if (div.classes) div.classes.forEach(cl => e.classList.add(cl));
            }
            e["layoutAutoHeight"] = autoHeight
            this.element.insertBefore(e, this.element.children[index])
            this.layoutDivs.push(e);
            this.layoutSetHeight();
            return e
        }
        protected layoutAppend(div: { id: string, attribute?: Object, css?: Object, "classes"?: string[] } | HTMLDivElement, autoHeight: boolean = false): HTMLDivElement {
            return this.layoutInster(this.element.children.length, div, autoHeight);
        }
        /**
         * 插入kendo.ui.Splitter控件
         * @param index {number} start from 0
         * @param options {kendo.ui.SplitterOptions} kendo.ui.SplitterOptions
         * @param div {id:string,attribute?:Object,css?:Object} wrapper.id
         * @param autoHeight {boolean} false is default, use to specifies wrapper if filling the remanent vertical space
         * @returns {HTMLDivElement} 使用$(return).find(".k-pan") 找到各个panes ,使用$(return).data("kendoSplitter")获取kendo.ui.Splitter控件
         */
        protected layoutInsterSplitter(index: number, options: kendo.ui.SplitterOptions, div: { id: string, attribute?: Object, css?: Object, "classes"?: string[] }, autoHeight: boolean = false): HTMLDivElement {
            let e = this.layoutInster(index, div, autoHeight)
            if (options && options.panes) options.panes.forEach(p => e.appendChild(document.createElement("div")));
            let s = new kendo.ui.Splitter(e, options)
            return e;
        }
        /**
         * 添加kendo.ui.Splitter控件
         * @param options {kendo.ui.SplitterOptions} kendo.ui.SplitterOptions
         * @param div {id:string,attribute?:Object,css?:Object} wrapper.id
         * @param autoHeight {boolean} false is default, use to specifies wrapper if filling the remanent vertical space
         * @returns {HTMLDivElement} 使用$(return).find(".k-pan") 找到各个panes ,使用$(return).data("kendoSplitter")获取kendo.ui.Splitter控件
         */
        protected layoutAppendSplitter(options: kendo.ui.SplitterOptions, div: { id: string, attribute?: Object, css?: Object, "classes"?: string[] }, autoHeight: boolean = false): HTMLDivElement {
            return this.layoutInsterSplitter(this.element.children.length, options, div, autoHeight)
        }
        protected layoutSetHeight() {
            let h: number = 0, d: HTMLDivElement = this.layoutDivs.where(ld => { if (!ld.layoutAutoHeight) { h += $(ld).outerHeight() } else return true; })[0];
            if (d) {
                d.style.height = "calc(100% - " + h + "px)";
            }
        }
        public Resize() {
            this.layoutSetHeight();
        }
        public Destory() {
            if (this.winResizeEvent) { window.removeEventListener("resize", this.winResizeEvent); delete this.winResizeEvent;}
            delete this.layoutDivs;
            super.Destory();
        }
    }

    export abstract class LayoutWithActionsOptions extends VLayoutOptions {
        /**是否存在按钮工具条 默认true*/
        toolbar: boolean = true
        /**工具条options 默认自动创建 可自行指定*/
        toolbarOption: VinciToolBarOptions = undefined
        //
        funCode: string = undefined
    }
    export abstract class LayoutWithActions extends VLayout {
        toolbarElement: HTMLDivElement
        toolbarControl: EAP.UI.VinciToolBar
        constructor(element: HTMLElement, options: LayoutWithActionsOptions) {
            super(element, options)
            if (options.toolbar) this.initToolbar()
        }
        protected initLayout() {
            let options = this.options as LayoutWithActionsOptions
            if (options.toolbar) this.toolbarElement = this.layoutAppend({ id: "", css: { boxSizing: "border-box", minHeight:"auto",lineHeight:"24px",height: "27px", width: "100%" }, classes: ["k-widget"] })
        }
        private initToolbar() {
            let that = this, options = this.options as LayoutWithActionsOptions;
            if (!options.toolbarOption) options.toolbarOption = new EAP.UI.VinciToolBarOptions();
            options.toolbarOption.code = options.toolbarOption.code || options.funCode
            that.configToolbarOptions(options.toolbarOption)
            that.toolbarControl = $(this.toolbarElement).kendoVinciToolBar(options.toolbarOption).data("kendoVinciToolBar")
        }
        /**默认使用服务端拉去权限按钮，需要设置urlParameter:Code 或options.Code*/
        protected configToolbarOptions(toolOps: EAP.UI.IVinciToolBarOptions) {
            toolOps.click = (e) => this.InvokeDelegate(e.id)
            if (typeof toolOps.pull === 'undefined')
                toolOps.pull = true;
        }
        public Destory() {
            if (this.toolbarControl)this.toolbarControl.destroy();
            super.Destory();
        }
    }

    export class ViewLayoutOptions extends LayoutWithActionsOptions {
        viewScheme: boolean = true
        filter: boolean = true
        formFilter: boolean = true
        /**filterFormControl.Data*/
        filterData: Array<any>
        /**filterFormControl.filterSolutionId*/
        filterSolutionId: string
        viewCode: string = undefined
        topOtherTools: string | Array<string> = undefined
        /**FormApplicationOption*/
        formOption: FormApplicationOption = undefined
        /**实体完整类名*/
        entityId: string = undefined
        /**服务接口完整名称*/
        serviceId: string = undefined
        /**表单的另一个数据源 新增等其他情况时使用*/
        formBaseData = {}
        /**edit 对数据源的处理 function (data,oper)*/
        formDataProcess: (data, oper) => any = undefined
        /**增上改之前的检查 function(data,"edit")*/
        processGate: (data, oper) => void = undefined
    }
    export abstract class ViewLayout extends LayoutWithActions {
        topOtherToolsElement: HTMLDivElement
        //viewSchemeElement: HTMLDivElement
        formFilterElement: HTMLDivElement
        viewScheme: EAP.UI.ViewScheme
        filterControl: EAP.UI.FilterForm
        formApplication: FormApplication
        protected prePostProcess: Function
        constructor(element: HTMLElement, options: ViewLayoutOptions) {
            super(element, options)
            this.initComponents();
            //if (options.formOption) this.initForm()
        }
        protected initComponents() {
            let that = this, options = this.options as ViewLayoutOptions
            if (options.viewScheme) this.initViewScheme()
            if (options.filter && options.formFilter) this.initFilter()
            if (options.topOtherTools || options.viewScheme || options.formFilter) this.initTopOtherTools()
        }
        protected initLayout() {
            let options = this.options as ViewLayoutOptions
            if (this.weatherBuidTopToolbar(options)) this.topOtherToolsElement = this.layoutAppend({ id: "", css: { height: "24px", width: "100%" } }) //classList.add("gAppOtherTool_container")
            //if (options.viewScheme) this.viewSchemeElement = this.layoutAppend({ id: "" })
            super.initLayout()
            if (options.filter && options.formFilter) this.formFilterElement = this.layoutAppend({ id: "", css: { width: "100%", minHeight: options.filterSolutionId ? "0px" : "16px" } })
        }
        private weatherBuidTopToolbar(options: ViewLayoutOptions): boolean {
            if (options.topOtherTools || options.viewScheme) return true;
            if (options.formFilter && !options.filterSolutionId) return true;
            return false;
        }
        private initTopOtherTools() {
            let that = this, options = this.options as ViewLayoutOptions;
            if (options.topOtherTools) {
                if (!$.isArray(options.topOtherTools)) {
                    options.topOtherTools = [options.topOtherTools as string];
                }
                (options.topOtherTools as Array<string>).forEach(function (tool) {
                    let toolDiv = document.createElement('div');
                    toolDiv.classList.add('gAppOtherTool_div');
                    toolDiv.innerHTML = tool;
                    that.topOtherToolsElement.appendChild(toolDiv);
                });
            }
        }
        //初始表单筛选
        private initFilter() {
            let that = this, options = this.options as ViewLayoutOptions;
            let fo = new EAP.UI.FilterFormOptions();
            if (!options.filterSolutionId) {
                let queryDiv = document.createElement('div');
                queryDiv.innerHTML = System.CultureInfo.GetDisplayText('QueryName') + ':<select id="filterViewSelector" style="width:100px"></select>';
                that.topOtherToolsElement.appendChild(queryDiv);
                queryDiv.classList.add('gAppOtherTool_div');
                fo.ddlSelector = $(queryDiv).find("#filterViewSelector")[0];
            }
            fo.solutionCode = options.viewCode
            fo.containSelector = that.formFilterElement// $("<div/>").addClass("formFilter");
            fo.items = options.filterData;
            fo.filterSolutionId = options.filterSolutionId;

            that.configFilterOptions(fo)
            that.filterControl = new EAP.UI.FilterForm(fo);
        }
        protected configFilterOptions(fo: EAP.UI.FilterFormOptions): void { }
        //ViewScheme
        private initViewScheme() {
            let that = this, options = this.options as ViewLayoutOptions;
            let gridViewDiv =document.createElement('div');
            gridViewDiv.innerHTML = System.CultureInfo.GetDisplayText('ViewName') + ':<select id="viewSelector" style="width:100px"></select>';
            that.topOtherToolsElement.appendChild(gridViewDiv);
            gridViewDiv.classList.add('gAppOtherTool_div');
            //TODO 需要修改ViewScheme
            let vo = new EAP.UI.ViewSchemeOptions();
            vo.ddlSelector = $(gridViewDiv).find('#viewSelector')[0];
            vo.viewCode = options.viewCode
            //viewSchemeOpiton.gridControl = this.gridControl;
            //viewSchemeOpiton.comOptions = this.gridAppOption.comOption;
            that.configViewOptions(vo)
            that.viewScheme = new EAP.UI.ViewScheme(vo);
            //this.gridoption["viewData"] = this.viewScheme.gridoption["viewData"];
        }
        protected configViewOptions(vo: EAP.UI.ViewSchemeOptions): void { }
        //构建form表单
        private initForm() {
            let that = this, options = this.options as ViewLayoutOptions, formOption = options.formOption = options.formOption || new EAP.UI.FormApplicationOption()
            formOption.viewCode = options.viewCode;
            formOption["postData"] = {};
            formOption.autoDestroy = false;
            that.prePostProcess = options.formOption.prePostProcess;
            that.configFormOptions(formOption)
            that.formApplication = new EAP.UI.FormApplication(formOption);
        }
        protected configFormOptions(fo: EAP.UI.FormApplicationOption): void { }

        protected setDataControl(c: any) { // have not preformance
        }
        public Destory() {
            //if (this.viewScheme) this.viewScheme.destroy();
            //if (this.filterControl) this.filterControl.destroy();
            //if (this.formApplication)  this.formApplication.destroy();
            super.Destory();
        }
    }
}