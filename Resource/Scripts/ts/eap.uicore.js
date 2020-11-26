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
var EAP;
(function (EAP) {
    var UI;
    (function (UI) {
        var Core;
        (function (Core) {
            var ServicesBase = (function () {
                function ServicesBase(serviceName) {
                    this._servicName = serviceName;
                }
                return ServicesBase;
            }());
            ServicesBase._serviceArray = new Array();
            var EventArgu = (function () {
                function EventArgu() {
                }
                return EventArgu;
            }());
            Core.EventArgu = EventArgu;
            var ApplicationServices = (function (_super) {
                __extends(ApplicationServices, _super);
                function ApplicationServices(serviceName) {
                    var _this = _super.call(this, serviceName) || this;
                    if (!serviceName)
                        return _this;
                    var s = ApplicationServices._service(serviceName);
                    if (s)
                        return s;
                    ApplicationServices._serviceArray.push(_this);
                    return _this;
                }
                ApplicationServices.commonService = function () {
                    if (this.cSObject)
                        return this.cSObject;
                    this.cSObject = $.extend(new ApplicationServices(), this._commonService);
                    return this.cSObject;
                };
                ApplicationServices._service = function (serviceName) {
                    var result;
                    this._serviceArray.forEach(function (s) { if (serviceName == s._servicName)
                        result = s; });
                    return result;
                };
                ApplicationServices.prototype.appendDelegate = function (deleName, fn) {
                    this._delegate(deleName, fn);
                };
                ApplicationServices.prototype.getDelegate = function (deleName) {
                    return this._delegate(deleName);
                };
                ///if(!fn) 则是获取委托
                ApplicationServices.prototype._delegate = function (deleName, fn) {
                    if (!this._delegrateArray)
                        this._delegrateArray = [];
                    for (var i = 0; i < this._delegrateArray.length; i++) {
                        var d = this._delegrateArray[i];
                        if (deleName == d[0]) {
                            if (!fn)
                                return d[1];
                            else {
                                d[1] = fn;
                                return fn;
                            }
                        }
                    }
                    if (fn)
                        this._delegrateArray.push([deleName, fn]);
                    return fn;
                };
                return ApplicationServices;
            }(ServicesBase));
            ApplicationServices._commonService = (function () {
                var src = new ServicesBase();
                src._delegrateArray = [];
                src._delegrateArray.push(["Add", function (e) {
                        var that = e.sender;
                        if (that.options.processGate && !that.options.processGate(that.currentItem, "add"))
                            return;
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
                            };
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
                src._delegrateArray.push(["View", function (e) {
                        var that = e.sender;
                        var currentItem = that.currentItem();
                        if (!currentItem || (that.options.processGate && !that.options.processGate(that.currentItem, "view")))
                            return;
                        var faOption = that.formApplication.option;
                        faOption.success = null;
                        faOption.cancle = null;
                        faOption.buttonGroupOptions = null;
                        if (that.options.formDataProcess) {
                            faOption.sourceData = that.options.formDataProcess(currentItem, "view");
                        }
                        else
                            faOption.sourceData = currentItem;
                        faOption.readonly = true;
                        faOption.winTitle = System.CultureInfo.GetDisplayText('View');
                        that.formApplication.setOption(faOption);
                        that.formApplication.open();
                    }]);
                src._delegrateArray.push(["Edit", function (e) {
                        var that = e.sender;
                        var currentItem = that.currentItem();
                        if (!currentItem || (that.options.processGate && !that.options.processGate(that.currentItem, "edit")))
                            return;
                        currentItem = $.extend(true, {}, currentItem);
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
                        }
                        else
                            faOption.sourceData = currentItem;
                        faOption.prePostProcess = function (data) {
                            var pd = { item: data, oper: 'edit', entityId: that.options.entityId, serviceId: that.options.serviceId };
                            if (that.options.formOption.prePostProcess)
                                return that.options.formOption.prePostProcess(pd);
                            return pd;
                        };
                        faOption.readonly = false;
                        faOption.winTitle = System.CultureInfo.GetDisplayText('Edit');
                        that.formApplication.open();
                        that.formApplication.setOption(faOption);
                    }]);
                src._delegrateArray.push(["Delete", function (e) {
                        var that = e.sender;
                        var rows = that.currentItems();
                        if (rows.length < 1)
                            return;
                        var ids = [];
                        for (var i = 0; i < rows.length; i++) {
                            ids.push(rows[i].Id);
                        }
                        if (ids.length <= 0) {
                            EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('ChooseOneRecord'));
                            return;
                        }
                        var comfirmOption = {
                            title: System.CultureInfo.GetDisplayText('Prompt'),
                            content: System.CultureInfo.GetDisplayText('DeleteSure'),
                            OK: function () {
                                var faOption = that.formApplication.option;
                                var pd = { ids: ids, oper: 'delete', entityId: that.options.entityId, serviceId: that.options.serviceId }; // that.currentItem.Id
                                new EAP.EAMController().ExecuteServerAction(faOption.postUrl, pd, function (data) {
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
                src._delegrateArray.push(["Refresh", function (e) {
                        var that = e.sender;
                        //this.gridControl.customFilter = this.filterResult;
                        if (that.filterControl) {
                            that.filterControl.search(true);
                            return;
                        }
                        that["refresh"]();
                        // that.loadData_Init();
                    }]);
                src._delegrateArray.push(["Export", function (e) {
                        var that = e.sender;
                        if (!that.options.comOption)
                            return;
                        var item = that["gridControl"].currentPostData;
                        //item.currentGridViewId = this.viewScheme.gridoption.gridSolutionId;
                        item.currentCols = that["gridControl"].grid.options.viewData;
                        //item.currentCols = that.viewScheme.currentCols;
                        var pd = item; // { item: item }
                        var option = new EAM.ExportOptions();
                        option.postData = pd;
                        option.exportorFullName = that.options.importorExportor_FullName;
                        option.url = that.options.comOption.exportUrl;
                        if (!that.exportor)
                            that.exportor = new EAM.Export(option);
                        else
                            that.exportor.setOptions(option);
                        that.exportor.export();
                    }]);
                src._delegrateArray.push(["Import", function (e) {
                        var that = e.sender;
                        if (!that.importor) {
                            var options = new EAM.ImportOptions();
                            options.importorFullName = that.options.importorExportor_FullName;
                            options.templateCode = that.options.templateCode;
                            options.url = that.options.comOption.importUrl;
                            options.items = ["import"];
                            options.templateDownloadLink = [{ name: 'import', link: '../../template/EMRecord/{0}Template.xls'.format(that.options.viewCode) }];
                            options.success = function () {
                                that.Refresh();
                                EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('Upload') + System.CultureInfo.GetDisplayText('Success'));
                            };
                            that.importor = new EAM.Import(options);
                        }
                        that.importor.open();
                    }]);
                src._delegrateArray.push(["Query", function (e) {
                        var that = e.sender;
                        that.filterControl.togglePanel();
                    }]);
                src._delegrateArray.push(["SaveView", function (e) {
                        var that = e.sender;
                        that.viewScheme.saveView();
                    }]);
                src._delegrateArray.push(["CustomShow", function (e) {
                        var that = e.sender;
                        that.viewScheme.open();
                    }]);
                return src;
            })();
            Core.ApplicationServices = ApplicationServices;
            var VBaseOptions = (function () {
                function VBaseOptions() {
                    this.owner = undefined;
                    this.dependencys = undefined;
                }
                return VBaseOptions;
            }());
            var VBase = (function () {
                function VBase(element, options) {
                    this.element = element;
                    this.isInherit = false;
                    this.options = new VBaseOptions();
                    $.extend(this.options, options);
                    this.dependencys = this.options.dependencys;
                }
                //兼容了 扩展app方法  带owner的controller
                VBase.prototype._invokeDelegate = function (delegateName, argu) {
                    var dependencys, that = this, options = that.options;
                    if (!that.dependencys)
                        dependencys = [];
                    else if (typeof that.dependencys === "string")
                        dependencys = [that.dependencys];
                    else
                        dependencys = that.dependencys;
                    dependencys = dependencys.reverse();
                    for (var i = 0; i < dependencys.length; i++) {
                        var d = dependencys[i];
                        var src_1 = ApplicationServices._service(d);
                        var delegate_1 = src_1.getDelegate(delegateName);
                        if (delegate_1) {
                            if ($.isFunction(delegate_1))
                                delegate_1.call(options.owner || that, argu);
                            else {
                                delegate_1.go(argu); //argu
                            }
                            return;
                        }
                    }
                    //inherit  兼容旧版
                    if (this.isInherit && $.isFunction(this[delegateName])) {
                        this[delegateName](argu);
                        return;
                    }
                    //common
                    var src = ApplicationServices.commonService();
                    var delegate = src.getDelegate(delegateName);
                    if (delegate)
                        delegate.call(this, argu);
                };
                VBase.prototype.InvokeDelegate = function (deleName) {
                    //TODO 调用参数问题
                    var argu = new UI.ApplicationEventArgu();
                    argu.sender = this;
                    this._invokeDelegate(deleName, argu);
                };
                VBase.prototype.loadData_Init = function () { console.error("loadData_Init wasn't implemented"); };
                /**
                 * direct refresh method
                 */
                VBase.prototype.refresh = function () { console.error("refresh wasn't implemented"); };
                /**
                 * Destory
                 */
                VBase.prototype.Destory = function () {
                    var parent = this.element.parentNode;
                    parent.removeChild(this.element);
                };
                /**
                 * button event
                 */
                VBase.prototype.Refresh = function () {
                    this.InvokeDelegate("Refresh");
                };
                return VBase;
            }());
            var VLayoutOptions = (function (_super) {
                __extends(VLayoutOptions, _super);
                function VLayoutOptions() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return VLayoutOptions;
            }(VBaseOptions));
            /**
             * 该类可以单独剥离出来 无任何关联
             */
            var VLayout = (function (_super) {
                __extends(VLayout, _super);
                function VLayout(element, options) {
                    var _this = _super.call(this, element, options) || this;
                    _this.layoutDivs = [];
                    _this.initLayout();
                    window.addEventListener("resize", _this.winResizeEvent = _this.layoutSetHeight.bind(_this));
                    return _this;
                }
                VLayout.prototype.layoutRemove = function (div) {
                    var removingItem = this.layoutDivs.splice(this.layoutDivs.indexOf(div), 1)[0];
                    if (removingItem) {
                        if (removingItem.layoutAutoHeight && this.winResizeEvent) {
                            delete this.winResizeEvent;
                        }
                        this.element.removeChild(removingItem);
                    }
                };
                VLayout.prototype.initLayout = function () { };
                VLayout.prototype.layoutInster = function (index, div, autoHeight) {
                    if (autoHeight === void 0) { autoHeight = false; }
                    var e;
                    if (!(div instanceof HTMLDivElement)) {
                        e = document.createElement("div");
                        e.id = div.id;
                        if (div.attribute)
                            for (var n in div.attribute) {
                                if (div.attribute.hasOwnProperty(n))
                                    e.setAttribute(n, div.attribute[n]);
                            }
                        if (div.css)
                            $.extend(e.style, div.css);
                        if (div.classes)
                            div.classes.forEach(function (cl) { return e.classList.add(cl); });
                    }
                    e["layoutAutoHeight"] = autoHeight;
                    this.element.insertBefore(e, this.element.children[index]);
                    this.layoutDivs.push(e);
                    this.layoutSetHeight();
                    return e;
                };
                VLayout.prototype.layoutAppend = function (div, autoHeight) {
                    if (autoHeight === void 0) { autoHeight = false; }
                    return this.layoutInster(this.element.children.length, div, autoHeight);
                };
                /**
                 * 插入kendo.ui.Splitter控件
                 * @param index {number} start from 0
                 * @param options {kendo.ui.SplitterOptions} kendo.ui.SplitterOptions
                 * @param div {id:string,attribute?:Object,css?:Object} wrapper.id
                 * @param autoHeight {boolean} false is default, use to specifies wrapper if filling the remanent vertical space
                 * @returns {HTMLDivElement} 使用$(return).find(".k-pan") 找到各个panes ,使用$(return).data("kendoSplitter")获取kendo.ui.Splitter控件
                 */
                VLayout.prototype.layoutInsterSplitter = function (index, options, div, autoHeight) {
                    if (autoHeight === void 0) { autoHeight = false; }
                    var e = this.layoutInster(index, div, autoHeight);
                    if (options && options.panes)
                        options.panes.forEach(function (p) { return e.appendChild(document.createElement("div")); });
                    var s = new kendo.ui.Splitter(e, options);
                    return e;
                };
                /**
                 * 添加kendo.ui.Splitter控件
                 * @param options {kendo.ui.SplitterOptions} kendo.ui.SplitterOptions
                 * @param div {id:string,attribute?:Object,css?:Object} wrapper.id
                 * @param autoHeight {boolean} false is default, use to specifies wrapper if filling the remanent vertical space
                 * @returns {HTMLDivElement} 使用$(return).find(".k-pan") 找到各个panes ,使用$(return).data("kendoSplitter")获取kendo.ui.Splitter控件
                 */
                VLayout.prototype.layoutAppendSplitter = function (options, div, autoHeight) {
                    if (autoHeight === void 0) { autoHeight = false; }
                    return this.layoutInsterSplitter(this.element.children.length, options, div, autoHeight);
                };
                VLayout.prototype.layoutSetHeight = function () {
                    var h = 0, d = this.layoutDivs.where(function (ld) { if (!ld.layoutAutoHeight) {
                        h += $(ld).outerHeight();
                    }
                    else
                        return true; })[0];
                    if (d) {
                        d.style.height = "calc(100% - " + h + "px)";
                    }
                };
                VLayout.prototype.Resize = function () {
                    this.layoutSetHeight();
                };
                VLayout.prototype.Destory = function () {
                    if (this.winResizeEvent) {
                        window.removeEventListener("resize", this.winResizeEvent);
                        delete this.winResizeEvent;
                    }
                    delete this.layoutDivs;
                    _super.prototype.Destory.call(this);
                };
                return VLayout;
            }(VBase));
            Core.VLayout = VLayout;
            var LayoutWithActionsOptions = (function (_super) {
                __extends(LayoutWithActionsOptions, _super);
                function LayoutWithActionsOptions() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    /**是否存在按钮工具条 默认true*/
                    _this.toolbar = true;
                    /**工具条options 默认自动创建 可自行指定*/
                    _this.toolbarOption = undefined;
                    //
                    _this.funCode = undefined;
                    return _this;
                }
                return LayoutWithActionsOptions;
            }(VLayoutOptions));
            Core.LayoutWithActionsOptions = LayoutWithActionsOptions;
            var LayoutWithActions = (function (_super) {
                __extends(LayoutWithActions, _super);
                function LayoutWithActions(element, options) {
                    var _this = _super.call(this, element, options) || this;
                    if (options.toolbar)
                        _this.initToolbar();
                    return _this;
                }
                LayoutWithActions.prototype.initLayout = function () {
                    var options = this.options;
                    if (options.toolbar)
                        this.toolbarElement = this.layoutAppend({ id: "", css: { boxSizing: "border-box", minHeight: "auto", lineHeight: "24px", height: "27px", width: "100%" }, classes: ["k-widget"] });
                };
                LayoutWithActions.prototype.initToolbar = function () {
                    var that = this, options = this.options;
                    if (!options.toolbarOption)
                        options.toolbarOption = new EAP.UI.VinciToolBarOptions();
                    options.toolbarOption.code = options.toolbarOption.code || options.funCode;
                    that.configToolbarOptions(options.toolbarOption);
                    that.toolbarControl = $(this.toolbarElement).kendoVinciToolBar(options.toolbarOption).data("kendoVinciToolBar");
                };
                /**默认使用服务端拉去权限按钮，需要设置urlParameter:Code 或options.Code*/
                LayoutWithActions.prototype.configToolbarOptions = function (toolOps) {
                    var _this = this;
                    toolOps.click = function (e) { return _this.InvokeDelegate(e.id); };
                    if (typeof toolOps.pull === 'undefined')
                        toolOps.pull = true;
                };
                LayoutWithActions.prototype.Destory = function () {
                    if (this.toolbarControl)
                        this.toolbarControl.destroy();
                    _super.prototype.Destory.call(this);
                };
                return LayoutWithActions;
            }(VLayout));
            Core.LayoutWithActions = LayoutWithActions;
            var ViewLayoutOptions = (function (_super) {
                __extends(ViewLayoutOptions, _super);
                function ViewLayoutOptions() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.viewScheme = true;
                    _this.filter = true;
                    _this.formFilter = true;
                    _this.viewCode = undefined;
                    _this.topOtherTools = undefined;
                    /**FormApplicationOption*/
                    _this.formOption = undefined;
                    /**实体完整类名*/
                    _this.entityId = undefined;
                    /**服务接口完整名称*/
                    _this.serviceId = undefined;
                    /**表单的另一个数据源 新增等其他情况时使用*/
                    _this.formBaseData = {};
                    /**edit 对数据源的处理 function (data,oper)*/
                    _this.formDataProcess = undefined;
                    /**增上改之前的检查 function(data,"edit")*/
                    _this.processGate = undefined;
                    return _this;
                }
                return ViewLayoutOptions;
            }(LayoutWithActionsOptions));
            Core.ViewLayoutOptions = ViewLayoutOptions;
            var ViewLayout = (function (_super) {
                __extends(ViewLayout, _super);
                function ViewLayout(element, options) {
                    var _this = _super.call(this, element, options) || this;
                    _this.initComponents();
                    return _this;
                    //if (options.formOption) this.initForm()
                }
                ViewLayout.prototype.initComponents = function () {
                    var that = this, options = this.options;
                    if (options.viewScheme)
                        this.initViewScheme();
                    if (options.filter && options.formFilter)
                        this.initFilter();
                    if (options.topOtherTools || options.viewScheme || options.formFilter)
                        this.initTopOtherTools();
                };
                ViewLayout.prototype.initLayout = function () {
                    var options = this.options;
                    if (this.weatherBuidTopToolbar(options))
                        this.topOtherToolsElement = this.layoutAppend({ id: "", css: { height: "24px", width: "100%" } }); //classList.add("gAppOtherTool_container")
                    //if (options.viewScheme) this.viewSchemeElement = this.layoutAppend({ id: "" })
                    _super.prototype.initLayout.call(this);
                    if (options.filter && options.formFilter)
                        this.formFilterElement = this.layoutAppend({ id: "", css: { width: "100%", minHeight: options.filterSolutionId ? "0px" : "16px" } });
                };
                ViewLayout.prototype.weatherBuidTopToolbar = function (options) {
                    if (options.topOtherTools || options.viewScheme)
                        return true;
                    if (options.formFilter && !options.filterSolutionId)
                        return true;
                    return false;
                };
                ViewLayout.prototype.initTopOtherTools = function () {
                    var that = this, options = this.options;
                    if (options.topOtherTools) {
                        if (!$.isArray(options.topOtherTools)) {
                            options.topOtherTools = [options.topOtherTools];
                        }
                        options.topOtherTools.forEach(function (tool) {
                            var toolDiv = document.createElement('div');
                            toolDiv.classList.add('gAppOtherTool_div');
                            toolDiv.innerHTML = tool;
                            that.topOtherToolsElement.appendChild(toolDiv);
                        });
                    }
                };
                //初始表单筛选
                ViewLayout.prototype.initFilter = function () {
                    var that = this, options = this.options;
                    var fo = new EAP.UI.FilterFormOptions();
                    if (!options.filterSolutionId) {
                        var queryDiv = document.createElement('div');
                        queryDiv.innerHTML = System.CultureInfo.GetDisplayText('QueryName') + ':<select id="filterViewSelector" style="width:100px"></select>';
                        that.topOtherToolsElement.appendChild(queryDiv);
                        queryDiv.classList.add('gAppOtherTool_div');
                        fo.ddlSelector = $(queryDiv).find("#filterViewSelector")[0];
                    }
                    fo.solutionCode = options.viewCode;
                    fo.containSelector = that.formFilterElement; // $("<div/>").addClass("formFilter");
                    fo.items = options.filterData;
                    fo.filterSolutionId = options.filterSolutionId;
                    that.configFilterOptions(fo);
                    that.filterControl = new EAP.UI.FilterForm(fo);
                };
                ViewLayout.prototype.configFilterOptions = function (fo) { };
                //ViewScheme
                ViewLayout.prototype.initViewScheme = function () {
                    var that = this, options = this.options;
                    var gridViewDiv = document.createElement('div');
                    gridViewDiv.innerHTML = System.CultureInfo.GetDisplayText('ViewName') + ':<select id="viewSelector" style="width:100px"></select>';
                    that.topOtherToolsElement.appendChild(gridViewDiv);
                    gridViewDiv.classList.add('gAppOtherTool_div');
                    //TODO 需要修改ViewScheme
                    var vo = new EAP.UI.ViewSchemeOptions();
                    vo.ddlSelector = $(gridViewDiv).find('#viewSelector')[0];
                    vo.viewCode = options.viewCode;
                    //viewSchemeOpiton.gridControl = this.gridControl;
                    //viewSchemeOpiton.comOptions = this.gridAppOption.comOption;
                    that.configViewOptions(vo);
                    that.viewScheme = new EAP.UI.ViewScheme(vo);
                    //this.gridoption["viewData"] = this.viewScheme.gridoption["viewData"];
                };
                ViewLayout.prototype.configViewOptions = function (vo) { };
                //构建form表单
                ViewLayout.prototype.initForm = function () {
                    var that = this, options = this.options, formOption = options.formOption = options.formOption || new EAP.UI.FormApplicationOption();
                    formOption.viewCode = options.viewCode;
                    formOption["postData"] = {};
                    formOption.autoDestroy = false;
                    that.prePostProcess = options.formOption.prePostProcess;
                    that.configFormOptions(formOption);
                    that.formApplication = new EAP.UI.FormApplication(formOption);
                };
                ViewLayout.prototype.configFormOptions = function (fo) { };
                ViewLayout.prototype.setDataControl = function (c) {
                };
                ViewLayout.prototype.Destory = function () {
                    //if (this.viewScheme) this.viewScheme.destroy();
                    //if (this.filterControl) this.filterControl.destroy();
                    //if (this.formApplication)  this.formApplication.destroy();
                    _super.prototype.Destory.call(this);
                };
                return ViewLayout;
            }(LayoutWithActions));
            Core.ViewLayout = ViewLayout;
        })(Core = UI.Core || (UI.Core = {}));
    })(UI = EAP.UI || (EAP.UI = {}));
})(EAP || (EAP = {}));
