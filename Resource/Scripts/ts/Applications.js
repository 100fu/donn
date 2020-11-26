/// <reference path="../base/eap.kendo1.ts" />
/// <reference path="eap.ui.core.ts" />
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
        var ApplicationEventArgu = (function (_super) {
            __extends(ApplicationEventArgu, _super);
            function ApplicationEventArgu() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ApplicationEventArgu;
        }(EAP.UI.Core.EventArgu));
        UI.ApplicationEventArgu = ApplicationEventArgu;
        var AGridOptions = (function (_super) {
            __extends(AGridOptions, _super);
            function AGridOptions(options) {
                var _this = _super.call(this) || this;
                _this.comOption = new EAP.UI.ComOption();
                _this.gridOption = undefined;
                _this.gridDataRequest = undefined;
                ///下拉框枚举值
                _this.enums = [];
                ///自动加载数据
                _this.autoLoad = true;
                ///删除验证 function(itemObjs)
                _this.delValiator = undefined;
                ///模块导入导出器 全名
                _this.importorExportor_FullName = undefined;
                _this.templateCode = undefined;
                if (!options)
                    return _this;
                if (options instanceof AGridOptions)
                    return options;
                $.extend(_this, options);
                return _this;
            }
            return AGridOptions;
        }(EAP.UI.Core.ViewLayoutOptions));
        UI.AGridOptions = AGridOptions;
        var AGrid = (function (_super) {
            __extends(AGrid, _super);
            function AGrid(element, options) {
                var _this = _super.call(this, element, new AGridOptions(options)) || this;
                _this.isInherit = !(_this instanceof AGrid);
                _super.prototype["initForm"].call(_this);
                var that = _this;
                options = _this.options;
                if (options.autoLoad)
                    $(function () {
                        that.loadGridData(); //这是在filter.search()之后的
                    });
                return _this;
            }
            AGrid.prototype.initComponents = function () {
                this.initGrid();
                _super.prototype.initComponents.call(this);
            };
            AGrid.prototype.initLayout = function () {
                _super.prototype.initLayout.call(this);
                this.gridElement = this.layoutAppend({ id: "", classes: ["layoutContent"] }, true);
            };
            AGrid.prototype.configFilterOptions = function (fo) {
                var that = this, options = this.options;
                fo.comOptions = options.comOption;
                fo.enums = options.enums;
                fo.gridControl = that.gridControl;
                fo.titleWidth = "80px";
                fo.slideToggle = function (isExtend) {
                    that.layoutSetHeight();
                    that.gridControl.grid.resize();
                };
            };
            AGrid.prototype.configViewOptions = function (vo) {
                var that = this, options = this.options;
                vo.gridControl = that.gridControl;
                vo.comOptions = options.comOption;
            };
            //初始化grid，并设置视图 先于_initToolbar
            AGrid.prototype.initGrid = function () {
                var that = this, options = this.options, gridoption = options.gridOption = options.gridOption || new EAP.UI.GridOption();
                gridoption.toolTip = true;
                gridoption.showIndex = true;
                options.gridOption.selector = $('<div/>', { style: "height:100%" }).appendTo(that.gridElement);
                if (options.filter && !options.formFilter) {
                    gridoption.filterable = {
                        mode: "row"
                    };
                }
                gridoption.showrowcheckbox = true;
                gridoption.dblClick = function () {
                    $(that.toolbarElement).find('#Edit').trigger("click");
                };
                that.gridControl = new EAP.UI.GridControl(gridoption);
                $(window).resize(function () {
                    that.gridControl.grid.resize();
                });
            };
            AGrid.prototype.configFormOptions = function (fo) {
                var that = this, options = this.options;
                fo["enums"] = options.enums;
                fo.comOption = options.comOption;
            };
            AGrid.prototype.currentItem = function () {
                var items = this.gridControl.getSelectedRows();
                if (items.length !== 1) {
                    EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('ChooseOneRecord'));
                    return;
                }
                return items[0];
            };
            AGrid.prototype.currentItems = function () {
                var items = this.gridControl.getSelectedRows();
                if (items.length < 1) {
                    EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('MoreOneRecord'));
                    return [];
                }
                return items;
            };
            /**
             * gridControl.remoteRefresh()
             */
            AGrid.prototype.refresh = function () {
                this.gridControl.remoteRefresh();
            };
            AGrid.prototype.loadData_Init = function () {
                this.loadGridData();
            };
            //加载grid数据 不包含filter 数据
            AGrid.prototype.loadGridData = function () {
                var that = this, options = this.options;
                var schema = that.getSchema(options["viewData"]);
                var gridDataRequest = options.gridDataRequest || new EAP.UI.GridDataRequest();
                gridDataRequest.url = gridDataRequest.url || options.comOption.listReadUrl;
                gridDataRequest.apendPostData({ serviceId: options.serviceId, entityId: options.entityId });
                that.gridControl.setData(gridDataRequest, schema);
            };
            AGrid.prototype.getSchema = function (items) {
                if (!items)
                    return null;
                var fields = {};
                for (var i = 0; i < items.length; i++) {
                    switch (items[i].DataType) {
                        //case "select":
                        //    return System.CultureInfo.GetDisplayText(result);
                        case "DateTime":
                        case "Date":
                            fields[items[i].DataField] = { type: "date" };
                        default:
                    }
                }
                var schema = {
                    model: {
                        fields: fields
                    }
                };
                return schema;
            };
            AGrid.prototype.Destory = function () {
                if (this.gridControl)
                    this.gridControl.destroy();
                _super.prototype.Destory.call(this);
            };
            return AGrid;
        }(EAP.UI.Core.ViewLayout));
        UI.AGrid = AGrid;
        var AGridExOptions = (function (_super) {
            __extends(AGridExOptions, _super);
            function AGridExOptions() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return AGridExOptions;
        }(EAP.UI.AGridOptions));
        UI.AGridExOptions = AGridExOptions;
        var AGridEx = (function (_super) {
            __extends(AGridEx, _super);
            function AGridEx(element, options) {
                var _this = _super.call(this, element, options) || this;
                var that = _this, ops = that.options;
                options.ExtraAppOptions = options.ExtraAppOptions || new EAP.UI.Core.ViewLayoutOptions();
                return _this;
            }
            AGridEx.prototype.configFilterOptions = function (fo) {
                var that = this;
                _super.prototype.configFilterOptions.call(this, fo);
                fo.slideToggle = function (isExtend) {
                    that.layoutSetHeight();
                    $(that.SplitterElement).data("kendoSplitter").resize();
                    //that.gridControl.grid.resize();
                };
            };
            AGridEx.prototype.initExtraApp = function (options, type) {
                var that = this;
                that.configExtraAppOptions(options);
                that.ExtraApp = new type(that.ExtraAppElement, options);
            };
            AGridEx.prototype.configExtraAppOptions = function (options) { };
            AGridEx.prototype.initLayout = function () {
                _super.prototype.initLayout.call(this);
                var that = this, options = that.options;
                that.layoutRemove(that.gridElement);
                that.SplitterElement = that.layoutAppendSplitter($.extend({ panes: [{ collapsedSize: "40%", min: "30%", scrollable: false }, { collapsed: true, collapsible: true, scrollable: false }], expand: $.proxy(that.splitterExpand, that) }, options.SplitterOptions || {}), { id: "splitter", classes: ["layoutContent", "k-splitterForWide"] }, true);
                that.gridElement = that.SplitterElement.querySelector(".k-pane");
                that.ExtraAppElement = that.SplitterElement.querySelector(".k-pane:last-child");
            };
            AGridEx.prototype.splitterExpand = function () {
                var that = this, options = that.options;
                if (!that.ExtraApp)
                    that.initExtraApp(options.ExtraAppOptions, options.ExtraAppType);
            };
            AGridEx.prototype.SpliterToggle = function (expand) {
                var splitter = $(this.SplitterElement).data("kendoSplitter");
                splitter.toggle(".k-pane:last-child", expand);
                splitter.trigger("expand");
            };
            return AGridEx;
        }(EAP.UI.AGrid));
        UI.AGridEx = AGridEx;
        //export class GridApplicationOption1 extends AGridOptions {
        //    /// <field name='selector' type='CssSelector|JQuery'>若不填gridOption，toolbarOption 或他们的selector 那么这个选项将非常重要</field>
        //    /// <field name='gridOption' type='EAP.UI.GridOption'>选填，GridOption.selector也可选填，若不填写则GridApplicationOption.selector必填</field>
        //    /// <field name='comOption' type='EAP.UI.ComOption'></field>
        //    /// <field name='gridDataRequest' type='GridDataRequest'></field>
        //    /// <field name='toolbarOption' type='EAP.UI.ToolbarOption'>选填，ToolbarOption.selector也可选填</field>
        //    selector: string | HTMLElement | JQuery = undefined
        //    gridOption: GridOption = new EAP.UI.GridOption()
        //    ///filterFormControl.Data
        //    filterData = undefined
        //}
        //export class GridApplication1 extends AGrid {
        //    constructor(options: AGridOptions) {
        //        super($(options.selector)[0],options)
        //    }
        //}
        var FormApplication = (function () {
            function FormApplication(option) {
                this.viewData = [];
                this.option = $.extend(new EAP.UI.FormApplicationOption(), option);
                this._initForm();
            }
            FormApplication.prototype._initForm = function () {
                var that = this, option = this.option, formContainer = document.createElement('div'), formDiv;
                if (!option.selector)
                    formDiv = document.createElement('div');
                else
                    formDiv = $(option.selector)[0];
                //var toolbarDiv = document.createElement('div');
                // formContainer.appendChild(toolbarDiv);
                formContainer.appendChild(formDiv);
                var $formContainer = $(formContainer);
                $('body').append($formContainer.hide());
                ////工具条创建
                //var toolbarOption = new EAP.UI.ToolbarOption();
                //toolbarOption.selector = toolbarDiv;
                //toolbarOption.owner = this;
                //toolbarOption.items = [{ type: 'button', text: System.CultureInfo.GetDisplayText('CustomShow'), id: 'customShow' }];
                //new EAP.UI.ToolbarControl(toolbarOption);
                //表单视图使用，需要GetViewColsUrl（根据id获取视图列的url）,GetViewUrl||formViewModelId（视图ID）
                //加载表单视图
                if (option.formView) {
                    this._initData();
                }
                option.selector = formDiv;
                option.postUrl = option.postUrl || option.comOption.formProcessUrl;
                this.formControl = new EAP.UI.FormControl(option);
                this.kFormWin = $formContainer.kendoVinciWindow({ resizable: false, modal: true, title: (option.winTitle || ""), autoDestory: option.autoDestroy, deactivate: function () { if (option.autoDestroy)
                        that.formControl.destroy(); } }).data("kendoVinciWindow");
            };
            FormApplication.prototype._initData = function () {
                var option = this.option;
                var data;
                var client = new EAP.EAMController();
                if (!option.comOption.formViewColsUrl)
                    return;
                if (option.formViewModelId) {
                    var formViewModelId = option.formViewModelId;
                    client.ExecuteServerActionSync(option.comOption.formViewColsUrl, { id: formViewModelId }, function (value) {
                        data = value;
                    });
                }
                else {
                    client.ExecuteServerActionSync(option.comOption.formViewUrl, { code: option.viewCode }, function (value) {
                        if (!value) {
                            data = [];
                            return;
                        }
                        client.ExecuteServerActionSync(option.comOption.formViewColsUrl, { id: value.Id || value[0].Id }, function (value) {
                            data = value;
                        });
                    });
                }
                this.viewData = data;
                var resData = EAP.UI.FormViewColumnConvert(data, option);
                option.Data = resData; //.concat(option.Data || []);
            };
            FormApplication.prototype.open = function () {
                this.formControl.hideMessages();
                //开启模态窗口
                this.kFormWin.center().open();
            };
            FormApplication.prototype.close = function () {
                this.kFormWin.close();
            };
            //设置参数
            FormApplication.prototype.setOption = function (option) {
                this.option = option;
                this.formControl.setOption(this.option);
                if (this.option.winTitle)
                    this.kFormWin.setOptions({ title: this.option.winTitle });
            };
            FormApplication.prototype.setTitle = function (title) {
                this.kFormWin.setOptions({ title: title });
            };
            Object.defineProperty(FormApplication.prototype, "controlUniteWidth", {
                get: function () {
                    var intWidth = 200;
                    if (this.option.controlUniteWidth) {
                        try {
                            intWidth = parseInt(this.option.controlUniteWidth);
                        }
                        catch (e) {
                        }
                    }
                    return intWidth;
                },
                enumerable: true,
                configurable: true
            });
            return FormApplication;
        }());
        UI.FormApplication = FormApplication;
        var GridEditorOptions = (function (_super) {
            __extends(GridEditorOptions, _super);
            function GridEditorOptions(obj) {
                var _this = _super.call(this) || this;
                /**应用|保存成功后 触发的回调*/
                _this.onChange = undefined;
                /**是否可设置顺序 默认false*/
                _this.setOrd = false;
                /**是否以窗口形式弹出 默认false*/
                _this.postUrl = undefined;
                /**是否以窗口形式弹出 默认false*/
                _this.isWindow = false;
                _this.onClose = undefined;
                /**显示删除按钮 个别情况下使用*/
                _this.deleteUrl = undefined;
                /**prePost(pd,result)  false 则不再保存 若返回对象则使用其作为回传items的值，若无任何返回且参数pd未作任何处理则使用元数据result*/
                _this.prePost = undefined;
                _this.title = '';
                _this.gridHeight = undefined;
                /**自动关闭窗口 默认true*/
                _this.autoClose = true;
                /**Array<kendo.ui.ToolBarItem>*/
                _this.toolbarItems = undefined;
                _this.editable = true;
                _this.width = '500px';
                _this.configGridOptions = undefined;
                /**是否使用checkbox 默认false*/
                _this.showrowcheckbox = false;
                /**设置grid是否显示Index*/
                _this.showIndex = false;
                _this.autoDestroy = false;
                if (!obj)
                    return _this;
                if (obj instanceof GridEditorOptions)
                    return obj;
                $.extend(_this, obj);
                return _this;
            }
            return GridEditorOptions;
        }(EAP.UI.Core.LayoutWithActionsOptions));
        UI.GridEditorOptions = GridEditorOptions;
        var GridEditor = (function (_super) {
            __extends(GridEditor, _super);
            function GridEditor(element, options) {
                var _this = _super.call(this, element, new GridEditorOptions(options)) || this;
                _this.init();
                return _this;
            }
            GridEditor.prototype.init = function () {
                var that = this, options = that.options;
                that.element.style.width = typeof options.width === "number" ? options.width + "px" : options.width;
                if (options.isWindow) {
                    that.element.style.display = "none";
                    that.kWindow = $(that.element).kendoVinciWindow({
                        title: options.title || System.CultureInfo.GetDisplayText("CustomShow"), autoDestory: options.autoDestroy,
                        deactivate: function () {
                            if (options.autoDestroy) {
                                that.gridControl = undefined;
                                that.kWindow = undefined;
                            }
                        }, close: function () { if (options.onClose)
                            options.onClose(); }
                    }).data('kendoVinciWindow');
                }
                that.element.style.width = typeof options.width === "number" ? options.width + "px" : options.width;
                that.initGrid();
                if (!options.toolbar)
                    that.initFootButtons();
            };
            GridEditor.prototype.configToolbarOptions = function (toolOps) {
                var that = this, options = that.options;
                if (options.unionPs) {
                    options.postUrl = options.postUrl || EAP.UI.ComOptionObj.editorBatchEditUrl;
                    options.postUrl.parameters = options.unionPs;
                }
                toolOps.owner = that;
                toolOps.items = toolOps.items.concat([{ type: 'button', text: options.postUrl ? System.CultureInfo.GetDisplayText('save') : System.CultureInfo.GetDisplayText('Apply'), id: 'save' }]);
                if (options.deleteUrl)
                    toolOps.items.push({ type: 'button', text: System.CultureInfo.GetDisplayText('Delete'), id: 'del' });
                if (options.toolbarItems)
                    toolOps.items = toolOps.items.concat(options.toolbarItems);
            };
            GridEditor.prototype.initLayout = function () {
                _super.prototype.initLayout.call(this);
                this.gridElement = this.layoutAppend({ id: "", css: { width: "100%" } });
            };
            GridEditor.prototype.initGrid = function () {
                var that = this, options = that.options, gridopiton = new EAP.UI.GridOption();
                gridopiton.selector = that.gridElement;
                if (options.setOrd) {
                    options.columns.push({
                        command: [{
                                className: "k-icon k-i-arrow-chevron-up ",
                                text: " ",
                            }, {
                                className: "k-icon k-i-arrow-chevron-down",
                                text: " ",
                                click: function (e) {
                                    if ($(e.target).hasClass('k-i-arrow-chevron-up'))
                                        that.upItem(e);
                                    else
                                        that.downItem(e);
                                }
                            }],
                        width: '140px'
                    });
                }
                gridopiton.dataBound = function (e) {
                    e.sender.tbody.find(".k-font-icon").each(function (idx, element) {
                        element.style.minWidth = 'auto';
                    });
                };
                gridopiton.columns = options.columns;
                gridopiton.height = options.gridHeight || 350;
                gridopiton.showrowcheckbox = options.showrowcheckbox;
                gridopiton.pageable = false;
                gridopiton.editable = options.editable; // true;
                gridopiton.showIndex = options.showIndex;
                that.configGridOptions(gridopiton);
                if (options.deleteUrl)
                    gridopiton.showrowcheckbox = true;
                if (options.configGridOptions)
                    options.configGridOptions(gridopiton);
                that.gridControl = new EAP.UI.GridControl(gridopiton);
                that.gridControl.grid.element.on('change', 'input:checkbox', function (e) {
                    var target = e.target, checked = target.checked;
                    that.gridControl.updateValue($(target).closest('td'), checked);
                });
                that.gridControl.grid.element.on('change', 'input:radio', function () {
                    var $target = that.gridControl.grid.element.find('input:radio:checked');
                    that.gridControl.updateValue($target.closest('td'), true, true);
                });
            };
            GridEditor.prototype.initFootButtons = function () {
                var that = this, options = that.options, btnsOptions = new EAP.UI.VinciButtonGroupOptions();
                btnsOptions.items.push(new EAP.UI.VinciButtonOptions({ content: options.postUrl ? System.CultureInfo.GetDisplayText('save') : System.CultureInfo.GetDisplayText('Apply'), id: 'save', click: $.proxy(that.save, that) }));
                if (options.deleteUrl)
                    btnsOptions.items.push(new EAP.UI.VinciButtonOptions({ content: System.CultureInfo.GetDisplayText('Delete'), id: 'del', click: $.proxy(that.del, that) }));
                if (options.toolbarItems)
                    options.toolbarItems.forEach(function (i) {
                        btnsOptions.items.push(new EAP.UI.VinciButtonOptions({ content: i.text, id: i.id, click: $.proxy(i.click, that) }));
                    });
                that.configFootButtons(btnsOptions);
                $(this.layoutAppend({ id: "", css: { width: "100%" } })).kendoVinciButtonGroup(btnsOptions);
            };
            GridEditor.prototype.configGridOptions = function (gridopiton) { };
            GridEditor.prototype.configFootButtons = function (btnsOptions) { };
            GridEditor.prototype.setWinTitle = function (title) {
                this.kWindow.setOptions({ title: title });
            };
            GridEditor.prototype.setOption = function (options) {
                $.extend(this.options, options);
                this.initGrid();
            };
            GridEditor.prototype.setData = function (data) {
                this.gridControl.grid.setDataSource(new kendo.data.DataSource({ data: data }));
            };
            GridEditor.prototype.setRequestOption = function (reqOption) {
                this.gridControl.setData(reqOption);
            };
            GridEditor.prototype.save = function () {
                var that = this, options = that.options, gridopiton = new EAP.UI.GridOption(), result = this.gridControl.grid.dataSource.data(), pd;
                if (options.showrowcheckbox) {
                    result = this.gridControl.getSelectedRows();
                }
                if (that.configAndValidateResult(pd = {}, result) === false)
                    return;
                if (options.postUrl) {
                    if (options.prePost) {
                        var processed = void 0;
                        if ((processed = options.prePost(pd, result)) === false)
                            return;
                        else if (processed && typeof processed !== "boolean")
                            pd.items = processed;
                        else if ((processed == undefined || processed === true))
                            pd.items = result;
                    }
                    else
                        pd.items = result;
                    pd.postFields = that.postFields;
                    new EAP.EAMController().ExecuteServerAction(options.postUrl, pd, function (data) {
                        if (options.onChange) {
                            options.onChange(result, data);
                        }
                        if (options.autoClose !== false)
                            that.close();
                        EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('saveSuccess'));
                    });
                }
                else {
                    if (options.onChange)
                        options.onChange(result);
                    if (options.autoClose !== false)
                        that.close();
                }
            };
            GridEditor.prototype.configAndValidateResult = function (otherParameters, items) {
                return true;
            };
            GridEditor.prototype.del = function () {
                var that = this, options = that.options, gridopiton = new EAP.UI.GridOption(), rows = this.gridControl.getSelectedRows();
                if (rows.length <= 0) {
                    EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText("Prompt"), System.CultureInfo.GetDisplayText("MoreOneRecord"));
                    return;
                }
                EAP.UI.MessageBox.confirm({
                    content: System.CultureInfo.GetDisplayText("SureDelete"),
                    OK: function () {
                        kendo.ui.progress(that.kWindow.element, true);
                        var ids = [];
                        for (var i = 0; i < rows.length; i++) {
                            ids.push(rows[i].Id);
                        }
                        new EAP.EAMController().ExecuteServerAction(options.deleteUrl, { ids: ids }, function () {
                            if (!(options.autoClose === false))
                                that.close();
                            if (options.onChange)
                                options.onChange();
                            kendo.ui.progress(that.kWindow.element, false);
                        });
                    }
                });
            };
            GridEditor.prototype.open = function () {
                if (this.kWindow)
                    this.kWindow.open();
            };
            GridEditor.prototype.close = function () {
                if (this.kWindow)
                    this.kWindow.close();
            };
            GridEditor.prototype.upItem = function (e) {
                var grid = this.gridControl.grid, items = grid.dataSource.data(), item = grid.dataItem($(e.target).closest('tr')), index = $.inArray(item, items);
                //del
                items.splice(index, 1);
                --index;
                index = index < 0 ? 0 : index;
                //add
                items.splice(index, 0, item);
                grid.setDataSource(new kendo.data.DataSource({ data: items }));
                grid.select("tr:eq(" + index + ")");
            };
            GridEditor.prototype.downItem = function (e) {
                var grid = this.gridControl.grid, items = grid.dataSource.data(), item = grid.dataItem($(e.target).closest('tr')), index = $.inArray(item, items);
                //del
                items.splice(index, 1);
                index = Math.min(items.length, ++index);
                //add
                items.splice(index, 0, item);
                grid.setDataSource(new kendo.data.DataSource({ data: items }));
                grid.select("tr:eq(" + index + ")");
            };
            return GridEditor;
        }(EAP.UI.Core.LayoutWithActions));
        UI.GridEditor = GridEditor;
        /**GridEditItems 业务实体*/
        var GridEditItem = (function () {
            function GridEditItem(obj) {
                if (!obj)
                    return this;
                if (obj instanceof GridEditItem)
                    return obj;
                $.extend(this, obj);
                return this;
            }
            GridEditItem.prototype.getFormViewItems = function () {
                return {
                    Code: this.Code, DataType: this.DataType, Header: this.Header, Colspan: this.FieldColspan, ControlType: this.ControlType,
                    IsVisible: true, ReadOnly: this.FieldReadonly, OtherParameter: this.OtherParameter, Required: (this.FieldAction === "none" ? this.Required : false)
                }; //, Width: this.Width
            };
            GridEditItem.prototype.getGridViewItems = function () {
                var tStr = undefined;
                if (this.ColumnEditable)
                    switch (this.ControlType) {
                        case "datetimepicker":
                            tStr = EAP.UI.KendoMVVM.generateDateTimePicker(new EAP.UI.KendoMVVM.controlOptions(this.Code, undefined, this.Required));
                            break;
                        case "datepicker":
                            tStr = EAP.UI.KendoMVVM.generateDatePicker(new EAP.UI.KendoMVVM.controlOptions(this.Code, undefined, this.Required));
                            break;
                        case "input":
                            tStr = EAP.UI.KendoMVVM.generateInput(new EAP.UI.KendoMVVM.controlOptions(this.Code, undefined, this.Required, this.MaxLength));
                            break;
                        case "numbericinput":
                            tStr = EAP.UI.KendoMVVM.generateNumberic(new EAP.UI.KendoMVVM.controlOptions(this.Code, undefined, this.Required, this.MaxLength));
                            break;
                        case "dropdownlist":
                            tStr = EAP.UI.KendoMVVM.generateDropDownList(new EAP.UI.KendoMVVM.controlOptions(this.Code, undefined, this.Required, this.MaxLength, this.Code + "_Source"));
                            break;
                        case "searchbox":
                            tStr = EAP.UI.KendoMVVM.generateSearchBox(new EAP.UI.KendoMVVM.controlOptions(this.Code, undefined, this.Required, this.MaxLength, this.Code + "_Source"));
                            break;
                        default:
                    }
                return { field: this.Code, title: System.CultureInfo.GetDisplayText(this.Header), template: tStr, width: this.Width, hidden: !this.ColumnVisable, sortable: false, editable: false };
            };
            return GridEditItem;
        }());
        var GridEditExOptions = (function (_super) {
            __extends(GridEditExOptions, _super);
            function GridEditExOptions() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /**新增删除项 默认false*/
                _this.itemNewDel = false;
                _this.gridDataSource = [];
                _this.formDataSource = {};
                _this.disableColPost = false;
                /**DataProcessing.Id*/
                _this.dataProcessingId = undefined;
                _this.configFormOptions = undefined;
                return _this;
            }
            return GridEditExOptions;
        }(GridEditorOptions));
        UI.GridEditExOptions = GridEditExOptions;
        /**数据处理功能 需赋值则gridcolumn have to be equal to true, 目前dropdownlist searchbox 都是this.Code + "_Source" 作为Source源 后期向form设置靠拢
        *action:none&&ColumnPost==true 则configResult会将form中对应的值赋到gridItems中*/
        var GridEditEx = (function (_super) {
            __extends(GridEditEx, _super);
            /**数据处理功能 需赋值则gridcolumn have to be equal to true, 目前dropdownlist searchbox 都是this.Code + "_Source" 作为Source源 后期向form设置靠拢*/
            function GridEditEx(element, options) {
                var _this = _super.call(this, element, options) || this;
                _this.dataProcessings = [];
                var that = _this, structs = that.structs, thisOptions = that.options;
                that.postFields = that.dataProcessings.where(function (dp) { return dp.ColumnPost; }).map(function (dp) { return "this." + dp.Code; }).join(",");
                if (thisOptions.configFormOptions || structs.fieldStructs.length > 0 || thisOptions.formOptions)
                    that.initForm(structs.fieldStructs);
                that.gridControl.setOptions({ columns: structs.columnStructs });
                that.gridInnerControlConfig();
                that.setData(that.options.gridDataSource);
                return _this;
            }
            GridEditEx.prototype.initLayout = function () {
                this.formElement = this.layoutAppend({ id: "" });
                _super.prototype.initLayout.call(this);
            };
            Object.defineProperty(GridEditEx.prototype, "structs", {
                /**Gain the structs*/
                get: function () {
                    var that = this, options = that.options, fieldStructs = [], columnStructs = [];
                    if (that.dataProcessings.length < 1 && options.dataProcessingId) {
                        var values = new EAP.EAMController().ExecuteServerActionSync(EAP.UI.ComOptionObj.getGridEditItemsUrl, { id: options.dataProcessingId });
                        if (values) {
                            that.dataProcessings = values.map(function (v) { return new GridEditItem(v); });
                        }
                    }
                    if (that.dataProcessings.length > 0) {
                        var fs = that.formViewColumnConvert(that.dataProcessings.where(function (dp) { return dp.IsField; }).group(function (f) { return f.FieldAction; }));
                        fieldStructs = fs.length > 0 ? EAP.UI.FormViewColumnConvert(fs, options.formOptions = options.formOptions || new EAP.UI.FormOption()) : [];
                        columnStructs = that.dataProcessings.where(function (dp) { return dp.IsColumn; }).map(function (dp) { return dp.getGridViewItems(); });
                    }
                    var cloneCols = $.extend([], that.gridControl.customCols);
                    columnStructs.forEach(function (cs) {
                        for (var c = 0; c < cloneCols.length; c++) {
                            if (cloneCols[c].field == cs.field) {
                                var cCol = cloneCols.splice(c, 1)[0];
                                $.extend(cs, cCol);
                                break;
                            }
                        }
                    });
                    columnStructs = columnStructs.concat(cloneCols || []);
                    return { fieldStructs: fieldStructs, columnStructs: that.gridControl.convertColumns(columnStructs) };
                },
                enumerable: true,
                configurable: true
            });
            GridEditEx.prototype.gridInnerControlConfig = function () {
                var that = this, options = that.options, colFieldStructs = that.dataProcessings.where(function (dp) { return dp.IsColumn && dp.ColumnEditable && dp.ControlType === "searchbox"; }).map(function (dp) { return dp.getFormViewItems(); });
                that.gridControl["sundries"] = {};
                options.formOptions = options.formOptions || new EAP.UI.FormOption();
                options.formOptions.Data = [];
                EAP.UI.FormViewColumnConvert(colFieldStructs, options.formOptions).forEach(function (f) { return that.gridControl["sundries"][f.name + "_Source"] = f; });
            };
            GridEditEx.prototype.formViewColumnConvert = function (fieldGroups) {
                var that = this, a = [];
                fieldGroups.forEach(function (gs) {
                    a = a.concat(gs.map(function (item) { return item.getFormViewItems(); }));
                    switch (gs.Key) {
                        case "batch":
                            a.push({
                                type: "button", content: System.CultureInfo.GetDisplayText("BatchSetValue"), onClick: function (e) {
                                    that.batchValue();
                                }, colspan: 1, width: 100
                            });
                            a.push({ type: "text", content: '<div class="line_02"></div>', colspan: 3 });
                            break;
                        case "average":
                            a.push({
                                type: "button", content: System.CultureInfo.GetDisplayText("Average"), onClick: function (e) {
                                    that.averageValue();
                                }, colspan: 1, width: 100
                            });
                            a.push({ type: "text", content: '<div class="line_02"></div>', colspan: 3 });
                            break;
                        default:
                            a.push({ type: "text", content: '<div class="line_02"></div>', colspan: 3 });
                    }
                });
                a.pop();
                return a;
            };
            /**
             * Batch
             */
            GridEditEx.prototype.batchValue = function () {
                var that = this, options = that.options, sourceData = that.formControl.sourceData, dataSource = this.gridControl.dataSource;
                var batchfields = that.dataProcessings.where(function (f) { return f.IsField && f.FieldAction == 'batch' && f.IsColumn; }), fl = batchfields.length;
                while (fl--) {
                    var bf = batchfields[fl], value = System.getValue(sourceData, bf.Code), dl = dataSource.total();
                    if (value && value !== Guid.Empty) {
                        if (bf.ControlType === "searchbox" && bf.ColumnEditable) {
                            var sbs = this.gridControl.element.find("[col_field='" + bf.Code + "']"), tl = sbs.length, fd = that.formControl.kendoControls[bf.Code];
                            while (tl--) {
                                var c = $(sbs[tl]).data("kendoVinciSearchBox");
                                c.selectItems = fd.selectItems;
                            }
                        }
                        while (dl--) {
                            var item = dataSource.at(dl);
                            if (options.dataProcessFilter)
                                if (options.dataProcessFilter(item, bf.Code, "batch") === false)
                                    continue;
                            item.set(bf.Code, value);
                        }
                    }
                }
            };
            /**
             * Average
             */
            GridEditEx.prototype.averageValue = function () {
                var that = this, options = that.options, sourceData = that.formControl.sourceData, dataSource = this.gridControl.dataSource;
                var batchfields = that.dataProcessings.where(function (f) { return f.IsField && f.FieldAction == 'average' && f.IsColumn; }), fl = batchfields.length;
                var _loop_1 = function () {
                    var bf = batchfields[fl], value = System.getValue(sourceData, bf.Code), total = void 0, dl = total = dataSource.total(), them = [];
                    if (value && value !== Guid.Empty) {
                        if (bf.ControlType === "searchbox" && bf.ColumnEditable) {
                            var sbs = this_1.gridControl.element.find("[col_field='" + bf.Code + "']"), tl = sbs.length, fd = that.formControl.kendoControls[bf.Code];
                            while (tl--) {
                                var c = $(sbs[tl]).data("kendoVinciSearchBox");
                                c.selectItems = fd.selectItems;
                            }
                        }
                        while (dl--) {
                            var item = dataSource.at(dl);
                            if (options.dataProcessFilter && options.dataProcessFilter(item, bf.Code, "average") === false) {
                                total--;
                                continue;
                            }
                            them.push(item);
                        }
                        value = value / total;
                        them.forEach(function (i) { return i.set(bf.Code, value); });
                    }
                };
                var this_1 = this;
                while (fl--) {
                    _loop_1();
                }
            };
            /**配置结果*/
            GridEditEx.prototype.configAndValidateResult = function (otherParameters, items) {
                if (this.formControl && !this.formControl.validate())
                    return false;
                var that = this, o = {}, dataProcessings = that.dataProcessings, fieldStructs = dataProcessings.where(function (dp) { return dp.IsField && dp.FieldAction == 'none' && dp.IsColumn && dp.ColumnPost; });
                if (that.formControl) {
                    var formData_1 = that.formControl.sourceData;
                    fieldStructs.forEach(function (fs) { return items.forEach(function (i) { return System.SetValue(i, fs.Code, System.getValue(formData_1, fs.Code)); }); });
                    dataProcessings.where(function (dp) { return dp.IsField && !dp.IsColumn; }).forEach(function (fs) { return System.SetValue(otherParameters, fs.Code, System.getValue(formData_1, fs.Code)); });
                }
                if (this.options.disableColPost)
                    return true;
                dataProcessings.where(function (dp) { return dp.IsColumn && dp.ColumnPost; }).forEach(function (dp) { return System.SetValue(o, dp.Code, ""); });
                for (var i = 0; i < items.length; i++)
                    items[i] = System.ReplaceJsonShrink($.extend(true, {}, o), items[i]);
                return true;
            };
            GridEditEx.prototype.configGridOptions = function (gridopiton) {
                _super.prototype.configGridOptions.call(this, gridopiton);
                //gridopiton.editable = false; default==true
                if (this.options.itemNewDel)
                    gridopiton.columns.push({ command: ["destroy"], title: "Operate", width: "100px" });
            };
            GridEditEx.prototype.initForm = function (field) {
                var that = this, options = that.options, fOptions = options.formOptions || new EAP.UI.FormOption();
                fOptions.columnsAmount = 3;
                if (field) {
                    fOptions.Data = field;
                }
                fOptions.selector = that.formElement;
                fOptions.sourceData = options.formDataSource || {};
                if (options.configFormOptions)
                    options.configFormOptions(fOptions);
                that.formControl = new EAP.UI.FormControl(fOptions);
                that.formControl.reCompile(true, false);
            };
            GridEditEx.prototype.configToolbarOptions = function (toolOps) {
                var that = this, options = that.options;
                if (options.itemNewDel)
                    toolOps.items.push({ text: System.CultureInfo.GetDisplayText("Add"), type: "button", id: "addItem" });
                _super.prototype.configToolbarOptions.call(this, toolOps);
            };
            GridEditEx.prototype.configFootButtons = function (btnsOptions) {
                var that = this, options = that.options;
                if (options.itemNewDel)
                    btnsOptions.items.push(new EAP.UI.VinciButtonOptions({ content: System.CultureInfo.GetDisplayText("Add"), id: "addItem", click: $.proxy(that.addItem, that) }));
            };
            GridEditEx.prototype.addItem = function () {
                var that = this, options = that.options;
                this.gridControl.appendItems([typeof options.itemNewDel === "object" ? options.itemNewDel : {}]);
            };
            return GridEditEx;
        }(GridEditor));
        UI.GridEditEx = GridEditEx;
        /**该类已过时 请使用GridEditor替代 相应的使用GridEditorOptions*/
        var EditApplication = (function (_super) {
            __extends(EditApplication, _super);
            /**该类已过时 请使用GridEditor替代 相应的使用GridEditorOptions*/
            function EditApplication(options) {
                return _super.call(this, options.selector ? $(options.selector)[0] : document.createElement('div'), options) || this;
            }
            return EditApplication;
        }(GridEditor));
        UI.EditApplication = EditApplication;
    })(UI = EAP.UI || (EAP.UI = {}));
})(EAP || (EAP = {}));
