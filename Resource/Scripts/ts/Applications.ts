/// <reference path="../base/eap.kendo1.ts" />
/// <reference path="eap.ui.core.ts" />

namespace EAP.UI {
    export class ApplicationEventArgu extends EAP.UI.Core.EventArgu {
        sender: EAP.UI.Core.IApplication
    }

    export interface IGridApplication extends EAP.UI.Core.IApplication {
        gridControl: EAP.UI.GridControl
    }
    export class AGridOptions extends EAP.UI.Core.ViewLayoutOptions {
        constructor(options?: any | DefaultLayout) {
            super()
            if (!options) return this;
            if (options instanceof AGridOptions) return options
            $.extend(this, options)
        }
        comOption: ComOption = new EAP.UI.ComOption()
        gridOption: GridOption = undefined
        gridDataRequest: GridDataRequest = undefined

      
        ///下拉框枚举值
        enums = []

        ///自动加载数据
        autoLoad: boolean = true

        ///删除验证 function(itemObjs)
        delValiator: (itemObjs) => boolean = undefined
        ///模块导入导出器 全名
        importorExportor_FullName: string = undefined
        templateCode: string = undefined
    }
    export class AGrid extends EAP.UI.Core.ViewLayout implements EAP.UI.Core.IApplication {
        protected gridElement: HTMLDivElement
        gridControl: EAP.UI.GridControl
        exportor: EAM.Export
        importor: EAM.Import
        constructor(element: HTMLElement, options: AGridOptions) {
            super(element, new AGridOptions(options))
            this.isInherit = !(this instanceof AGrid);

            super["initForm"]();
            let that = this;
            options = this.options as AGridOptions
            if (options.autoLoad)
                $(function () {
                    that.loadGridData(); //这是在filter.search()之后的
                })
        }
        protected initComponents() {
            this.initGrid();
            super.initComponents();
        }
        protected initLayout() {
            super.initLayout()
            this.gridElement = this.layoutAppend({ id: "", classes: ["layoutContent"] }, true)
        }
        protected configFilterOptions(fo: EAP.UI.FilterFormOptions) {
            let that = this, options = this.options as AGridOptions
            fo.comOptions = options.comOption;
            fo.enums = options.enums;
            fo.gridControl = that.gridControl;
            fo.titleWidth = "80px";
            fo.slideToggle = function (isExtend) {
                that.layoutSetHeight()
                that.gridControl.grid.resize();
            }
        }
        protected configViewOptions(vo: EAP.UI.ViewSchemeOptions): void {
            let that = this, options = this.options as AGridOptions
            vo.gridControl = that.gridControl;
            vo.comOptions = options.comOption;
        }
        //初始化grid，并设置视图 先于_initToolbar
        private initGrid() {
            let that = this, options = this.options as AGridOptions, gridoption = options.gridOption = options.gridOption || new EAP.UI.GridOption()
            gridoption.toolTip = true;
            gridoption.showIndex = true;
            options.gridOption.selector = $('<div/>', { style: "height:100%" }).appendTo(that.gridElement)

            if (options.filter && !options.formFilter) {
                gridoption.filterable = {
                    mode: "row"
                };
            }
            gridoption.showrowcheckbox = true;
            gridoption.dblClick = function () {
                $(that.toolbarElement).find('#Edit').trigger("click");
            }
            that.gridControl = new EAP.UI.GridControl(gridoption);
            $(window).resize(function () {
                that.gridControl.grid.resize();
            });
        }

        protected configFormOptions(fo: EAP.UI.FormApplicationOption): void {
            let that = this, options = this.options as AGridOptions
            fo["enums"] = options.enums;
            fo.comOption = options.comOption;
        }

        currentItem(): any {
            let items = this.gridControl.getSelectedRows();
            if (items.length !== 1) {
                EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('ChooseOneRecord'));
                return;
            }
            return items[0];
        }
        currentItems(): Array<any> {
            let items = this.gridControl.getSelectedRows();
            if (items.length < 1) {
                EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('MoreOneRecord'));
                return [];
            }
            return items
        }
        /**
         * gridControl.remoteRefresh()
         */
        protected refresh() {
            this.gridControl.remoteRefresh();
        }
        loadData_Init() {
            this.loadGridData()
        }
        //加载grid数据 不包含filter 数据
        loadGridData() {
            let that = this, options = this.options as AGridOptions
            let schema = that.getSchema(options["viewData"]);

            let gridDataRequest = options.gridDataRequest || new EAP.UI.GridDataRequest();
            gridDataRequest.url = gridDataRequest.url||options.comOption.listReadUrl;
            gridDataRequest.apendPostData({ serviceId: options.serviceId, entityId: options.entityId })

            that.gridControl.setData(gridDataRequest, schema);
        }
        private getSchema(items) {
            if (!items) return null;
            let fields = {};
            for (let i = 0; i < items.length; i++) {
                switch (items[i].DataType) {
                    //case "select":
                    //    return System.CultureInfo.GetDisplayText(result);
                    case "DateTime":
                    case "Date":
                        fields[items[i].DataField] = { type: "date" }
                    default:

                }
            }
            let schema = {
                model: {
                    fields: fields
                }
            }
            return schema;
        }
        public Destory() {
            if (this.gridControl) this.gridControl.destroy();
            super.Destory();
        }
    }

    export class AGridExOptions<T> extends EAP.UI.AGridOptions {
        /**右侧pane中的控件的参数*/
        ExtraAppOptions
        /**右侧pane中的控件类型*/
        ExtraAppType: { new (element: HTMLElement, options): T }
        SplitterOptions: kendo.ui.SplitterOptions
    }
    export class AGridEx<T> extends EAP.UI.AGrid {
        private SplitterElement: HTMLDivElement
        private ExtraAppElement: HTMLDivElement
        public ExtraApp: T
        constructor(element: HTMLElement, options) {//: AGridExOptions<T>
            super(element, options)
            let that = this, ops = that.options as AGridExOptions<T>;
            options.ExtraAppOptions = options.ExtraAppOptions || new EAP.UI.Core.ViewLayoutOptions()
        }
        protected configFilterOptions(fo: EAP.UI.FilterFormOptions) {
            let that = this
            super.configFilterOptions(fo)
            fo.slideToggle = function (isExtend) {
                that.layoutSetHeight()
                $(that.SplitterElement).data("kendoSplitter").resize();
                //that.gridControl.grid.resize();
            }
        }
        private initExtraApp(options, type) {
            let that = this
            that.configExtraAppOptions(options)
            that.ExtraApp = new type(that.ExtraAppElement, options);
        }
        protected configExtraAppOptions(options) { }
        protected initLayout() {
            super.initLayout()
            let that = this, options = that.options as AGridExOptions<T>
            that.layoutRemove(that.gridElement);
            that.SplitterElement = that.layoutAppendSplitter($.extend({ panes: [{ collapsedSize: "40%", min: "30%", scrollable: false }, { collapsed: true, collapsible: true, scrollable: false }], expand: $.proxy(that.splitterExpand, that) }, options.SplitterOptions || {}), { id: "splitter", classes: ["layoutContent","k-splitterForWide"] }, true);
            that.gridElement = that.SplitterElement.querySelector(".k-pane") as HTMLDivElement
            that.ExtraAppElement = that.SplitterElement.querySelector(".k-pane:last-child") as HTMLDivElement
        }
        private splitterExpand() {
            let that = this, options = that.options as AGridExOptions<T>;
            if (!that.ExtraApp) that.initExtraApp(options.ExtraAppOptions, options.ExtraAppType)
        }
        public SpliterToggle(expand: boolean) {
          let splitter=  $(this.SplitterElement).data("kendoSplitter")
          splitter.toggle(".k-pane:last-child", expand);
          splitter.trigger("expand");
        }
    }

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
    export class FormApplication {
        option: EAP.UI.FormApplicationOption
        formControl: EAP.UI.FormControl
        viewData = []
        kFormWin: EAP.UI.VinciWindow
        constructor(option) {
            this.option = $.extend(new EAP.UI.FormApplicationOption(), option);
            this._initForm();
        }
        _initForm() {
            let that = this, option = this.option, formContainer = document.createElement('div'), formDiv;
            if (!option.selector) formDiv = document.createElement('div');
            else formDiv = $(option.selector)[0];
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

            this.kFormWin = $formContainer.kendoVinciWindow({ resizable: false, modal: true, title: (option.winTitle || ""), autoDestory: option.autoDestroy, deactivate: () => { if (option.autoDestroy) that.formControl.destroy() } }).data("kendoVinciWindow");
        }
        _initData() {
            var option = this.option;
            var data;
            var client = new EAP.EAMController();
            if (!option.comOption.formViewColsUrl) return;
            if (option.formViewModelId) {
                var formViewModelId = option.formViewModelId;
                client.ExecuteServerActionSync(option.comOption.formViewColsUrl, { id: formViewModelId }, function (value) {
                    data = value;
                });
            } else {
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
            option.Data = resData;//.concat(option.Data || []);
        }
        open() {
            this.formControl.hideMessages();
            //开启模态窗口
            this.kFormWin.center().open();
        }
        close() {
            this.kFormWin.close();
        }
        //设置参数
        setOption(option) {
            this.option = option;
            this.formControl.setOption(this.option);
            if (this.option.winTitle)
                this.kFormWin.setOptions({ title: this.option.winTitle });
        }
        setTitle(title) {
            this.kFormWin.setOptions({ title: title });
        }
        get controlUniteWidth() {
            var intWidth = 200;
            if (this.option.controlUniteWidth) {
                try {
                    intWidth = parseInt(this.option.controlUniteWidth as string);
                } catch (e) {

                }
            }
            return intWidth;
        }
    }

    export class GridEditorOptions extends EAP.UI.Core.LayoutWithActionsOptions {
        /**应用|保存成功后 触发的回调*/
        onChange: Function = undefined
        /**是否可设置顺序 默认false*/
        setOrd = false
        /**是否以窗口形式弹出 默认false*/
        postUrl: System.UrlObj = undefined
        /**If exit multiple Editors conrespond correspond with single entity, then you can set same serviceId and different entityIds, in addition verify type in the back service.*/
        unionPs: { serviceId: string, entityId: string, flag: string }
        /**是否以窗口形式弹出 默认false*/
        isWindow: boolean = false
        onClose: Function = undefined
        /**显示删除按钮 个别情况下使用*/
        deleteUrl: System.UrlObj = undefined
        /**prePost(pd,result)  false 则不再保存 若返回对象则使用其作为回传items的值，若无任何返回且参数pd未作任何处理则使用元数据result*/
        prePost: Function = undefined
        title: string = ''
        gridHeight: number = undefined
        /**自动关闭窗口 默认true*/
        autoClose: boolean = true
        /**Array<kendo.ui.ToolBarItem>*/
        toolbarItems: Array<kendo.ui.ToolBarItem> = undefined
        editable: boolean = true
        width: string | number = '500px'
        columns: Array<any>
        configGridOptions: (gridOptions: EAP.UI.GridOption) => void = undefined
        /**是否使用checkbox 默认false*/
        showrowcheckbox: boolean = false
        /**设置grid是否显示Index*/
        showIndex: boolean = false
        autoDestroy: boolean = false

        constructor(obj?: any) {
            super()
            if (!obj) return this;
            if (obj instanceof GridEditorOptions) return obj;
            $.extend(this, obj)
            return this;
        }

    }

    export class GridEditor extends EAP.UI.Core.LayoutWithActions {
        public gridElement: HTMLDivElement
        protected gridControl: EAP.UI.GridControl
        protected kWindow: EAP.UI.VinciWindow
        protected postFields: string
        constructor(element: HTMLElement, options: GridEditorOptions) {
            super(element, new GridEditorOptions(options))
            this.init();
        }
        protected init() {
            let that = this, options = that.options as GridEditorOptions
            that.element.style.width = typeof options.width === "number" ? options.width + "px" : options.width
            if (options.isWindow) {
                that.element.style.display = "none";
                that.kWindow = $(that.element).kendoVinciWindow({
                    title: options.title || System.CultureInfo.GetDisplayText("CustomShow"), autoDestory: options.autoDestroy
                    , deactivate: () => {
                        if (options.autoDestroy) {
                            that.gridControl = undefined;
                            that.kWindow = undefined;
                        }
                    }, close: () => { if (options.onClose) options.onClose() }
                }).data('kendoVinciWindow');
            }
            that.element.style.width = typeof options.width === "number" ? options.width + "px" : options.width
            that.initGrid();
            if (!options.toolbar) that.initFootButtons();
        }
        protected configToolbarOptions(toolOps: EAP.UI.IVinciToolBarOptions) {
            let that = this, options = that.options as GridEditorOptions
            if (options.unionPs) {
                options.postUrl = options.postUrl || EAP.UI.ComOptionObj.editorBatchEditUrl;
                options.postUrl.parameters = options.unionPs;
            }
            toolOps.owner = that;
            toolOps.items = toolOps.items.concat([{ type: 'button', text: options.postUrl ? System.CultureInfo.GetDisplayText('save') : System.CultureInfo.GetDisplayText('Apply'), id: 'save' }]);
            if (options.deleteUrl)
                toolOps.items.push({ type: 'button', text: System.CultureInfo.GetDisplayText('Delete'), id: 'del' });
            if (options.toolbarItems)
                toolOps.items = toolOps.items.concat(options.toolbarItems)
        }
        protected initLayout() {
            super.initLayout();
            this.gridElement = this.layoutAppend({ id: "", css: { width: "100%" } })
        }
        private initGrid() {
            let that = this, options = that.options as GridEditorOptions, gridopiton = new EAP.UI.GridOption();
            gridopiton.selector = that.gridElement;
            if (options.setOrd) {
                options.columns.push(
                    {
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
                e.sender.tbody.find(".k-font-icon").each(function (idx, element) {//min-width auto
                    element.style.minWidth = 'auto';
                });
            }
            gridopiton.columns = options.columns;
            gridopiton.height = options.gridHeight || 350;
            gridopiton.showrowcheckbox = options.showrowcheckbox;
            gridopiton.pageable = false;
            gridopiton.editable = options.editable;// true;
            gridopiton.showIndex = options.showIndex;
            that.configGridOptions(gridopiton)
            if (options.deleteUrl) gridopiton.showrowcheckbox = true;
            if (options.configGridOptions) options.configGridOptions(gridopiton)
            that.gridControl = new EAP.UI.GridControl(gridopiton);
            that.gridControl.grid.element.on('change', 'input:checkbox', function (e) {
                let target = e.target as HTMLInputElement, checked = target.checked;
                that.gridControl.updateValue($(target).closest('td'), checked);
            });
            that.gridControl.grid.element.on('change', 'input:radio', function () {
                var $target = that.gridControl.grid.element.find('input:radio:checked');
                that.gridControl.updateValue($target.closest('td'), true, true);
            });
        }
        private initFootButtons() {
            let that = this, options = that.options as GridEditorOptions, btnsOptions = new EAP.UI.VinciButtonGroupOptions();
            btnsOptions.items.push(new EAP.UI.VinciButtonOptions({ content: options.postUrl ? System.CultureInfo.GetDisplayText('save') : System.CultureInfo.GetDisplayText('Apply'), id: 'save', click: $.proxy(that.save, that) }))
            if (options.deleteUrl) btnsOptions.items.push(new EAP.UI.VinciButtonOptions({ content: System.CultureInfo.GetDisplayText('Delete'), id: 'del', click: $.proxy(that.del, that) }))
            if (options.toolbarItems)
                options.toolbarItems.forEach(i => {
                    btnsOptions.items.push(new EAP.UI.VinciButtonOptions({ content: i.text, id: i.id, click: $.proxy(i.click as () => any, that) }))
                })
            that.configFootButtons(btnsOptions);
            $(this.layoutAppend({ id: "", css: { width: "100%" } })).kendoVinciButtonGroup(btnsOptions)
        }
        protected configGridOptions(gridopiton: EAP.UI.GridOption) { }
        protected configFootButtons(btnsOptions: EAP.UI.VinciButtonGroupOptions) { }
        setWinTitle(title) {
            this.kWindow.setOptions({ title: title });
        }

        setOption(options) {
            $.extend(this.options, options);
            this.initGrid();
        }
        setData(data) {
            this.gridControl.grid.setDataSource(new kendo.data.DataSource({ data: data }));
        }
        setRequestOption(reqOption) {
            this.gridControl.setData(reqOption);
        }
        private save() {
            let that = this, options = that.options as GridEditorOptions, gridopiton = new EAP.UI.GridOption(), result: kendo.data.ObservableArray | Array<any> = this.gridControl.grid.dataSource.data()
                , pd;
            if (options.showrowcheckbox) {
                result = this.gridControl.getSelectedRows();
            }
            if (that.configAndValidateResult(pd = {}, result as Array<any>) === false) return;
            if (options.postUrl) {
                if (options.prePost) {
                    let processed
                    if ((processed = options.prePost(pd, result)) === false) return;
                    else if (processed && typeof processed !== "boolean") pd.items = processed;
                    else if ((processed == undefined || processed === true)) pd.items = result;
                }
                else pd.items = result;
                pd.postFields = that.postFields;
                new EAP.EAMController().ExecuteServerAction(options.postUrl, pd, function (data) {
                    if (options.onChange) {
                        options.onChange(result, data);
                    }
                    if (options.autoClose !== false) that.close();
                    EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('saveSuccess'));
                });
            }
            else {
                if (options.onChange)
                    options.onChange(result);
                if (options.autoClose !== false) that.close();
            }
        }
        protected configAndValidateResult(otherParameters: Object, items: Array<any>): boolean {
            return true;
        }
        private del() {
            let that = this, options = that.options as GridEditorOptions, gridopiton = new EAP.UI.GridOption(), rows = this.gridControl.getSelectedRows();
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
                        if (!(options.autoClose === false)) that.close();
                        if (options.onChange) options.onChange();
                        kendo.ui.progress(that.kWindow.element, false);
                    })
                }
            })
        }
        open() {
            if (this.kWindow)
                this.kWindow.open();
        }
        close() {
            if (this.kWindow)
                this.kWindow.close();
        }
        private upItem(e) {
            let grid = this.gridControl.grid, items = grid.dataSource.data() as any, item = grid.dataItem($(e.target).closest('tr')), index = $.inArray(item, items);
            //del
            items.splice(index, 1);

            --index;

            index = index < 0 ? 0 : index;
            //add
            items.splice(index, 0, item);
            grid.setDataSource(new kendo.data.DataSource({ data: items }));
            grid.select("tr:eq(" + index + ")")
        }
        private downItem(e) {
            let grid = this.gridControl.grid, items = grid.dataSource.data() as any, item = grid.dataItem($(e.target).closest('tr')), index = $.inArray(item, items);
            //del
            items.splice(index, 1);

            index = Math.min(items.length, ++index);
            //add
            items.splice(index, 0, item);
            grid.setDataSource(new kendo.data.DataSource({ data: items }));
            grid.select("tr:eq(" + index + ")")

        }
    }

    /**GridEditItems 业务实体*/
    class GridEditItem {
        Code: string
        IsField: boolean
        IsColumn: boolean
        ColumnPost: boolean
        DataType: string
        ControlType: string
        ColumnEditable: boolean
        OtherParameter: string
        FieldAction: string
        FieldReadonly: boolean
        ColumnVisable: boolean //only grid column
        Required: boolean
        Header: string
        FieldColspan: number //only form field
        MaxLength: number
        Width: number
        constructor(obj?: any) {
            if (!obj) return this;
            if (obj instanceof GridEditItem) return obj;
            $.extend(this, obj);
            return this;
        }
        getFormViewItems() {
            return {
                Code: this.Code, DataType: this.DataType, Header: this.Header, Colspan: this.FieldColspan, ControlType: this.ControlType
                , IsVisible: true, ReadOnly: this.FieldReadonly, OtherParameter: this.OtherParameter, Required: (this.FieldAction === "none" ? this.Required : false)
            } //, Width: this.Width
        }
        getGridViewItems(): kendo.ui.GridColumn | { editable: boolean } {
            let tStr: Function | string = undefined;
            if (this.ColumnEditable)
                switch (this.ControlType) {
                    case "datetimepicker":
                        tStr = EAP.UI.KendoMVVM.generateDateTimePicker(new EAP.UI.KendoMVVM.controlOptions(this.Code, undefined, this.Required))
                        break;
                    case "datepicker":
                        tStr = EAP.UI.KendoMVVM.generateDatePicker(new EAP.UI.KendoMVVM.controlOptions(this.Code, undefined, this.Required))
                        break;
                    case "input":
                        tStr = EAP.UI.KendoMVVM.generateInput(new EAP.UI.KendoMVVM.controlOptions(this.Code, undefined, this.Required, this.MaxLength))
                        break;
                    case "numbericinput":
                        tStr = EAP.UI.KendoMVVM.generateNumberic(new EAP.UI.KendoMVVM.controlOptions(this.Code, undefined, this.Required, this.MaxLength))
                        break;
                    case "dropdownlist":
                        tStr = EAP.UI.KendoMVVM.generateDropDownList(new EAP.UI.KendoMVVM.controlOptions(this.Code, undefined, this.Required, this.MaxLength, this.Code + "_Source"))
                        break;
                    case "searchbox":
                        tStr = EAP.UI.KendoMVVM.generateSearchBox(new EAP.UI.KendoMVVM.controlOptions(this.Code, undefined, this.Required, this.MaxLength, this.Code + "_Source"))
                        break;
                    default:
                }
            return { field: this.Code, title: System.CultureInfo.GetDisplayText(this.Header), template: tStr, width: this.Width, hidden: !this.ColumnVisable, sortable: false, editable: false }
        }
    }

    export class GridEditExOptions extends GridEditorOptions {
        /**新增删除项 默认false*/
        itemNewDel: boolean | Object = false
        gridDataSource: Array<any> = []
        formDataSource: Object = {}

        disableColPost: boolean = false
        formOptions: EAP.UI.FormOption
        /**DataProcessing.Id*/
        dataProcessingId: string = undefined
        configFormOptions: (formOptions: EAP.UI.FormOption) => void = undefined
        /**grid 中对于 批量、平均分配等操作 的过滤 type 包含"batch""average""non"等,返回false 将不处理赋值等操作*/
        dataProcessFilter: (dataItem: any, field: string, type: string) => boolean
    }
    /**数据处理功能 需赋值则gridcolumn have to be equal to true, 目前dropdownlist searchbox 都是this.Code + "_Source" 作为Source源 后期向form设置靠拢
    *action:none&&ColumnPost==true 则configResult会将form中对应的值赋到gridItems中*/
    export class GridEditEx extends GridEditor {
        protected formElement: HTMLDivElement
        protected formControl: EAP.UI.FormControl
        private dataProcessings: Array<GridEditItem> = []
        /**数据处理功能 需赋值则gridcolumn have to be equal to true, 目前dropdownlist searchbox 都是this.Code + "_Source" 作为Source源 后期向form设置靠拢*/
        constructor(element: HTMLElement, options: GridEditExOptions) {
            super(element, options)
            let that = this, structs = that.structs, thisOptions = that.options as GridEditExOptions;
            that.postFields = that.dataProcessings.where(dp => dp.ColumnPost).map(dp => "this." + dp.Code).join(",");
            if (thisOptions.configFormOptions || structs.fieldStructs.length > 0 || thisOptions.formOptions)
                that.initForm(structs.fieldStructs);
            that.gridControl.setOptions({ columns: structs.columnStructs })
            that.gridInnerControlConfig();
            that.setData((that.options as GridEditExOptions).gridDataSource)
        }
        protected initLayout() {
            this.formElement = this.layoutAppend({ id: "" })
            super.initLayout();
        }
        /**Gain the structs*/
        protected get structs(): { fieldStructs: Array<any>, columnStructs: Array<any> } {
            let that = this, options = that.options as GridEditExOptions, fieldStructs = [], columnStructs = []
            if (that.dataProcessings.length < 1 && options.dataProcessingId) {
                let values = new EAP.EAMController().ExecuteServerActionSync(EAP.UI.ComOptionObj.getGridEditItemsUrl, { id: options.dataProcessingId });
                if (values) { that.dataProcessings = (values as Array<any>).map(v => new GridEditItem(v)) }
            }
            if (that.dataProcessings.length > 0) {
                let fs = that.formViewColumnConvert(that.dataProcessings.where(dp => dp.IsField).group(f => f.FieldAction))
                fieldStructs = fs.length > 0 ? EAP.UI.FormViewColumnConvert(fs, options.formOptions = options.formOptions || new EAP.UI.FormOption()) : []
                columnStructs = that.dataProcessings.where(dp => dp.IsColumn).map(dp => dp.getGridViewItems())
            }
            let cloneCols = $.extend([], that.gridControl.customCols)
            columnStructs.forEach(cs => {
                for (let c = 0; c < cloneCols.length; c++) {
                    if (cloneCols[c].field == cs.field) {
                        let cCol = cloneCols.splice(c, 1)[0];
                        $.extend(cs, cCol);
                        break;
                    }
                }
            })
            columnStructs = columnStructs.concat(cloneCols || []);
            return { fieldStructs: fieldStructs, columnStructs: that.gridControl.convertColumns(columnStructs) }
        }
        private gridInnerControlConfig() {
            let that = this, options = that.options as GridEditExOptions
                , colFieldStructs = that.dataProcessings.where(dp => dp.IsColumn && dp.ColumnEditable && dp.ControlType === "searchbox").map(dp => dp.getFormViewItems())
            that.gridControl["sundries"] = {};
            options.formOptions = options.formOptions || new EAP.UI.FormOption(); options.formOptions.Data = [];
            EAP.UI.FormViewColumnConvert(colFieldStructs, options.formOptions).forEach(f => that.gridControl["sundries"][f.name + "_Source"] = f);
        }
        private formViewColumnConvert(fieldGroups: Array<IGrouping<GridEditItem>>): Array<any> {
            let that = this, a = [];
            fieldGroups.forEach(gs => {
                a = a.concat(gs.map(item => item.getFormViewItems()));
                switch (gs.Key) {
                    case "batch":
                        a.push({
                            type: "button", content: System.CultureInfo.GetDisplayText("BatchSetValue"), onClick: function (e) {
                                that.batchValue();
                            }, colspan: 1, width: 100
                        })
                        a.push({ type: "text", content: '<div class="line_02"></div>', colspan: 3 })
                        break;
                    case "average":
                        a.push({
                            type: "button", content: System.CultureInfo.GetDisplayText("Average"), onClick: function (e) {
                                that.averageValue();
                            }, colspan: 1, width: 100
                        })
                        a.push({ type: "text", content: '<div class="line_02"></div>', colspan: 3 })
                        break;
                    default:
                        a.push({ type: "text", content: '<div class="line_02"></div>', colspan: 3 })

                }
            })
            a.pop();
            return a;
        }
        /**
         * Batch
         */
        private batchValue() {
            let that = this, options = that.options as GridEditExOptions, sourceData = that.formControl.sourceData
                , dataSource = this.gridControl.dataSource
            let batchfields = that.dataProcessings.where(f => f.IsField && f.FieldAction == 'batch' && f.IsColumn), fl = batchfields.length;
            while (fl--) {
                let bf = batchfields[fl], value = System.getValue(sourceData, bf.Code), dl = dataSource.total()
                if (value && value !== Guid.Empty) {
                    if (bf.ControlType === "searchbox" && bf.ColumnEditable) {
                        let sbs = this.gridControl.element.find("[col_field='" + bf.Code + "']"), tl = sbs.length, fd = that.formControl.kendoControls[bf.Code];
                        while (tl--) {
                            let c = ($(sbs[tl]).data("kendoVinciSearchBox") as EAP.UI.VinciSearchBox);
                            c.selectItems = fd.selectItems;
                        }
                    }
                    while (dl--) {
                        let item = dataSource.at(dl);
                        if (options.dataProcessFilter) if (options.dataProcessFilter(item, bf.Code, "batch") === false) continue;
                        item.set(bf.Code, value)
                    }
                }
            }
        }
        /**
         * Average
         */
        private averageValue() {
            let that = this, options = that.options as GridEditExOptions, sourceData = that.formControl.sourceData
                , dataSource = this.gridControl.dataSource
            let batchfields = that.dataProcessings.where(f => f.IsField && f.FieldAction == 'average' && f.IsColumn), fl = batchfields.length;
            while (fl--) {
                let bf = batchfields[fl], value = System.getValue(sourceData, bf.Code), total: number, dl = total = dataSource.total(), them: kendo.data.ObservableObject[] = []
                if (value && value !== Guid.Empty) {
                    if (bf.ControlType === "searchbox" && bf.ColumnEditable) {
                        let sbs = this.gridControl.element.find("[col_field='" + bf.Code + "']"), tl = sbs.length, fd = that.formControl.kendoControls[bf.Code];
                        while (tl--) {
                            let c = ($(sbs[tl]).data("kendoVinciSearchBox") as EAP.UI.VinciSearchBox);
                            c.selectItems = fd.selectItems;
                        }
                    }
                    while (dl--) {
                        let item = dataSource.at(dl);
                        if (options.dataProcessFilter && options.dataProcessFilter(item, bf.Code, "average") === false) {
                            total--; continue;
                        }
                        them.push(item)
                    }
                    value = value / total
                    them.forEach(i => i.set(bf.Code, value))
                }
            }
        }
        /**配置结果*/
        protected configAndValidateResult(otherParameters: Object, items: Array<any>): boolean {
            if (this.formControl && !this.formControl.validate()) return false;
            let that = this, o = {}, dataProcessings = that.dataProcessings, fieldStructs = dataProcessings.where(dp => dp.IsField && dp.FieldAction == 'none' && dp.IsColumn && dp.ColumnPost);
            if (that.formControl) {
                let formData = that.formControl.sourceData
                fieldStructs.forEach(fs => items.forEach(i => System.SetValue(i, fs.Code, System.getValue(formData, fs.Code))));
                dataProcessings.where(dp => dp.IsField && !dp.IsColumn).forEach(fs => System.SetValue(otherParameters, fs.Code, System.getValue(formData, fs.Code)));
            }
            if ((this.options as GridEditExOptions).disableColPost) return true;
            dataProcessings.where(dp => dp.IsColumn && dp.ColumnPost).forEach(dp => System.SetValue(o, dp.Code, ""))
            for (var i = 0; i < items.length; i++) items[i] = System.ReplaceJsonShrink($.extend(true, {}, o), items[i])
            return true;
        }
        protected configGridOptions(gridopiton: EAP.UI.GridOption) {
            super.configGridOptions(gridopiton);
            //gridopiton.editable = false; default==true
            if ((this.options as GridEditExOptions).itemNewDel)
                gridopiton.columns.push({ command: ["destroy"], title: "Operate", width: "100px" })
        }
        protected initForm(field?: Array<any>) {
            let that = this, options = that.options as GridEditExOptions, fOptions = options.formOptions || new EAP.UI.FormOption();
            fOptions.columnsAmount = 3;
            if (field) {
                fOptions.Data = field;
            }
            fOptions.selector = that.formElement;
            fOptions.sourceData = options.formDataSource || {};
            if (options.configFormOptions) options.configFormOptions(fOptions);
            that.formControl = new EAP.UI.FormControl(fOptions);
            that.formControl.reCompile(true, false)
        }
        protected configToolbarOptions(toolOps: EAP.UI.IVinciToolBarOptions) {
            let that = this, options = that.options as GridEditExOptions
            if (options.itemNewDel)
                toolOps.items.push({ text: System.CultureInfo.GetDisplayText("Add"), type: "button", id: "addItem" })
            super.configToolbarOptions(toolOps)
        }
        protected configFootButtons(btnsOptions: EAP.UI.VinciButtonGroupOptions) {
            let that = this, options = that.options as GridEditExOptions
            if (options.itemNewDel) btnsOptions.items.push(new EAP.UI.VinciButtonOptions({ content: System.CultureInfo.GetDisplayText("Add"), id: "addItem", click: $.proxy(that.addItem, that) }))
        }
        public addItem() {
            let that = this, options = that.options as GridEditExOptions
            this.gridControl.appendItems([typeof options.itemNewDel === "object" ? options.itemNewDel : {}])
        }
    }

    /**该类已过时 请使用GridEditor替代 相应的使用GridEditorOptions*/
    export class EditApplication extends GridEditor {
        /**该类已过时 请使用GridEditor替代 相应的使用GridEditorOptions*/
        constructor(options: any) {
            super(options.selector ? $(options.selector)[0] : document.createElement('div'), options as GridEditorOptions)
        }
    }
   
}

