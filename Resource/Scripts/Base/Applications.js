/// <reference path="eap.ui1.js" />
//需要kendo.web eap.kendo   //toolbar filterForm 固定在上方
EAP.UI.GridApplication = System.Object.Extends({
    toolbarOption: undefined,
    gridoption: undefined,
    formOption: undefined,
    gridAppOption: undefined,
    filterControl: undefined,
    filterDDLControl: undefined,
    dropDownListControl: undefined,
    toolbarControl: undefined,
    gridControl: undefined,
    formApplication: undefined,
    currentItem: undefined,
    toolbarGridApp: undefined,
    viewScheme: undefined,
    filterResult: null,
    status: "",
    //containerManagerControl: {},
    ctor: function (gridAppOption) {
        var that = this;

        this.gridAppOption = gridAppOption;
        this.toolbarOption = gridAppOption.toolbarOption;
        this.gridoption = gridAppOption.gridOption;

        this.topDiv = document.createElement("div");//包含toolbar filterForm
        this.buttomDiv = document.createElement("div");//包含grid
        this._initGrid();
        this._initToolbar();
        this._initTopOtherTools();
        if (that.gridAppOption.viewScheme) {
            this._initViewScheme();
        }
        if (this.gridAppOption.filter && this.gridAppOption.formFilter)
            this._initFilter();

        //resize
        this.topDiv.parentElement.classList.add("gAppMain");
        this.topDiv.classList.add("gAppTop");
        this.buttomDiv.classList.add("gAppBottom");
        that.buttomDiv.style.top = $(that.topDiv).outerHeight() + "px";
        //应对切换标签时show出来
        $(this.topDiv.parentElement).resize(function () {
            that.buttomDiv.style.top = $(that.topDiv).outerHeight() + "px";
        });
        //为因对toolbar变化
        $(this.topDiv).one("resize", function () {
            that.buttomDiv.style.top = $(that.topDiv).outerHeight() + "px";
        });
        $(this.buttomDiv).resize(function () {
            that.gridControl.grid.resize();
        });

        if (this.gridAppOption.autoLoad)
            $(function () {
                that.loadGridData();
            })
        //setTimeout(function () {
        //    that.loadGridData();
        //}, 500);

        //formOption存在则初始化formcontrol

        if (gridAppOption.formOption) {
            this.formOption = gridAppOption.formOption;
            this._initForm();
        };
    },

    //#region init 
    _initTopOtherTools: function () {
        var that = this;
        var otherToolsDiv;
        this.otherToolsDiv = otherToolsDiv = document.createElement('div');
        otherToolsDiv.classList.add("gAppOtherTool_container");
        $(otherToolsDiv).insertBefore(that.toolbarOption.selector);

        if (this.gridAppOption.filter && this.gridAppOption.formFilter) {
            var queryDiv = document.createElement('div');
            queryDiv.innerHTML = System.CultureInfo.GetDisplayText('QueryName') + ':<select id="filterViewSelector" style="width:100px"></select>';
            otherToolsDiv.appendChild(queryDiv);
            queryDiv.classList.add('gAppOtherTool_div');
        }
        if (that.gridAppOption.viewScheme) {
            var gridViewDiv = document.createElement('div');
            gridViewDiv.innerHTML = System.CultureInfo.GetDisplayText('ViewName') + ':<select id="viewSelector" style="width:100px"></select>';
            otherToolsDiv.appendChild(gridViewDiv);
            gridViewDiv.classList.add('gAppOtherTool_div');
        }

        if (this.gridAppOption.topOtherTools) {
            if (!$.isArray(this.gridAppOption.topOtherTools)) {
                this.gridAppOption.topOtherTools = [this.gridAppOption.topOtherTools];
            }
            this.gridAppOption.topOtherTools.forEach(function (tool) {
                var toolDiv = document.createElement('div');
                toolDiv.classList.add('gAppOtherTool_div');
                toolDiv.innerHTML = tool;
                otherToolsDiv.appendChild(toolDiv);
            });
        }
    },
    //构建toolbar 包括viewList 和gridSolutionId赋值
    _initToolbar: function () {
        var that = this;
        if (that.toolbarOption == null) {
            that.toolbarOption = new EAP.UI.ToolbarOption();
            that.toolbarOption.pull = true;
        }
        if (!that.toolbarOption.selector) {
            var selector = $('<div/>').insertBefore(that.buttomDiv)
            that.toolbarOption.selector = selector;
        }
        var toolbarOption = that.toolbarOption;

        var $topDiv = $(that.topDiv);
        $topDiv.insertBefore(toolbarOption.selector)
        $topDiv.append($(toolbarOption.selector));
        if (!toolbarOption.owner)
            toolbarOption.owner = that;
        toolbarOption.pull = true;
        that.toolbarControl = new EAP.UI.ToolbarControl(toolbarOption);
    },
    //初始化grid，并设置视图 先于_initToolbar
    _initGrid: function () {
        var that = this;
        if (that.gridoption == null) {
            that.gridoption = new EAP.UI.GridOption();
        }
        that.gridoption.toolTip = true;
        that.gridoption.showIndex = true;
        if (!that.gridoption.selector) {
            var selector = $('<div/>').appendTo(that.gridAppOption.selector)
            that.gridoption.selector = selector;
        }

        var gridoption = that.gridoption;
        var $selector = $(gridoption.selector);
        $(that.buttomDiv).insertAfter(gridoption.selector);
        $(that.buttomDiv).append($selector);
        $selector[0].style.height = "100%";

        if (that.gridAppOption.filter && !that.gridAppOption.formFilter) {
            gridoption.filterable = true;
            gridoption.filterable = {
                mode: "row"
            };
        }
        gridoption.showrowcheckbox = true;
        gridoption.dblClick = function () {
            that.toolbarControl.toolbar.element.find('#Edit').trigger("click");
        };
        that.gridControl = new EAP.UI.GridControl(gridoption);
    },
    //初始表单筛选
    _initFilter: function () {
        var that = this;
        var filterSelector = $("<div ></div>");

        $(this.topDiv).append(filterSelector.addClass("formFilter"));

        var filteroption = new EAP.UI.FilterFormOptions();
        filteroption.comOptions = this.gridAppOption.comOption;
        filteroption.containSelector = filterSelector;
        filteroption.ddlSelector = ".gAppOtherTool_container #filterViewSelector";
        filteroption.enums = this.gridAppOption.enums;
        filteroption.gridControl = this.gridControl;
        filteroption.items = this.gridAppOption.filterData;
        filteroption.titleWidth = "80px";
        filteroption.solutionCode = this.gridAppOption.viewCode
        filteroption.slideToggle = function (isExtend) {
            that.buttomDiv.style.top = $(that.topDiv).outerHeight() + "px";
        }
        that.filterControl = new EAP.UI.FilterForm(filteroption);

    },
    //ViewScheme
    _initViewScheme: function () {
        var viewSchemeOpiton = new EAP.UI.ViewSchemeOptions();
        viewSchemeOpiton.ddlSelector = '#viewSelector';
        viewSchemeOpiton.viewCode = this.gridAppOption.viewCode;
        viewSchemeOpiton.gridControl = this.gridControl;
        viewSchemeOpiton.comOption = this.gridAppOption.comOption;
        this.viewScheme = new EAP.UI.ViewScheme(viewSchemeOpiton);
        //this.gridoption.viewData = this.viewScheme.gridoption.viewData;
    },
    //构建form表单
    _initForm: function () {
        var that = this;
        var formOption = $.extend({}, that.formOption);
        formOption.enums = that.gridAppOption.enums;
        formOption.viewCode = that.gridAppOption.viewCode;
        formOption.comOption = that.gridAppOption.comOption;
        formOption.postData = {};
        //formOption.autoPerform=false
        that.prePostProcess = that.gridAppOption.formOption.prePostProcess;
        that.formApplication = new EAP.UI.FormApplication(formOption);
    },
    // #endregion 

    //返回可用于查询的列
    _getQueryColumns: function () {
        var data = this.gridControl.grid.options.viewData;
        var result = [];
        if (!data) return result;
        for (var i = 0; i < data.length; i++) {
            if (data[i].IsFilterable)
                result.push(data[i]);
        }
        return result;
    },
    //获取form数据源
    getFormDataSource: function () {
        return this.formApplication.formControl.sourceData;
    },
    //
    close: function () {
        this.formApplication.close();
    },
    //加载grid数据 不包含filter 数据
    loadGridData: function () {
        var that = this;
        var gridoption = that.gridoption;
        var schema = that._getSchema(that.gridControl.grid.options.viewData);

        var gridDataRequest = that.gridAppOption.gridDataRequest || new EAP.UI.GridDataRequest();
        gridDataRequest.url = that.gridAppOption.comOption.listReadUrl;
        gridDataRequest.apendPostData({ serviceId: that.gridAppOption.serviceId })

        that.gridControl.setData(gridDataRequest, schema);
    },
    _getSchema: function (items) {
        if (!items) return null;
        var fields = {};
        for (var i = 0; i < items.length; i++) {
            switch (items[i].DataType) {
                //case "select":
                //    return System.CultureInfo.GetDisplayText(result);
                case "DateTime":
                case "Date":
                    fields[items[i].DataField] = { type: "date" }
                default:

            }
        }
        var schema = {
            model: {
                fields: fields
            }
        }
        return schema;
    },
    //获取对象指定字段值
    getValue: function (value, fields) {
        if (!value || fields.length <= 0)
            return '';
        var field = fields.shift();
        if (fields.length > 0) {
            return this.getValue(value[field], fields);
        }
        return value[field] ? value[field] : '';
    },
    CustomShow: function () {
        this.viewScheme.open();

        //this._setCustomOption();
        //this.toolbarGridApp.open();
    },
    //新增操作
    Add: function () {
        this.status = "add";
        var faOption = this.formApplication.option;
        var that = this;
        if (!that.formOption.buttonGroupOptions) {
            faOption.success = {
                text: System.CultureInfo.GetDisplayText('save'), onSuccess: function (data) {
                    that.formApplication.close();
                    that.Refresh();
                }
            };
            faOption.cancle = { text: System.CultureInfo.GetDisplayText('Cancel'), fn: function () { that.formApplication.close(); } };

            faOption.prePostProcess = function (data) {
                var pd = { item: data, oper: 'add', entityId: that.gridAppOption.entityId, serviceId: that.gridAppOption.serviceId };
                if (that.prePostProcess)
                    return that.prePostProcess(pd);
                return pd;
            }
        }
        else {
            faOption.buttonGroupOptions = that.formOption.buttonGroupOptions;
        }
        var newData = {};
        $.extend(true, newData, this.gridAppOption.formBaseData);
        faOption.sourceData = newData;
        if (this.gridAppOption.formDataProcess) {
            this.gridAppOption.formDataProcess(newData, "add");
        }
        faOption.readonly = false;
        faOption.winTitle = System.CultureInfo.GetDisplayText('Add');
        this.formApplication.setOption(faOption);

        this.formApplication.open();
    },
    View: function () {
        if (!this._exitentItem()) return;
        this.status = "view";

        var faOption = this.formApplication.option;
        faOption.success = null;
        faOption.cancle = null;
        faOption.buttonGroupOptions = null;
        if (this.gridAppOption.formDataProcess) {
            faOption.sourceData = this.gridAppOption.formDataProcess(this.currentItem, "view");
        } else
            faOption.sourceData = this.currentItem;
        faOption.readonly = true;
        faOption.winTitle = System.CultureInfo.GetDisplayText('View');

        this.formApplication.setOption(faOption);
        this.formApplication.open();
    },
    Edit: function () {
        if (!this._exitentItem() || (this.gridAppOption.processGate && !this.gridAppOption.processGate(this.currentItem, "edit"))) return;
        this.status = "edit";

        var faOption = this.formApplication.option;
        var that = this;
        if (!that.formOption.buttonGroupOptions) {
            faOption.success = {
                text: System.CultureInfo.GetDisplayText('save'), onSuccess: function (data) {
                    that.formApplication.close();
                    that.Refresh();
                }
            };
            faOption.cancle = { text: System.CultureInfo.GetDisplayText('Cancel'), fn: function () { that.formApplication.close(); } };
        }
        else {
            faOption.buttonGroupOptions = that.formOption.buttonGroupOptions;
        }
        var currentItem = $.extend(true, {}, this.currentItem);
        if (this.gridAppOption.formDataProcess) {
            faOption.sourceData = this.gridAppOption.formDataProcess(currentItem, "edit") || currentItem;
        } else
            faOption.sourceData = currentItem;
        faOption.prePostProcess = function (data) {
            var pd = { item: data, oper: 'edit', entityId: that.gridAppOption.entityId, serviceId: that.gridAppOption.serviceId }
            if (that.prePostProcess)
                return that.prePostProcess(pd);
            return pd;
        }
        faOption.readonly = false;
        faOption.winTitle = System.CultureInfo.GetDisplayText('Edit');

        this.formApplication.open();
        this.formApplication.setOption(faOption);

    },
    Delete: function () {
        //if (!this._exitentItem()) return;
        var rows = this.gridControl.getSelectedRows();
        var ids = [];
        for (var i = 0; i < rows.length; i++) {
            ids.push(rows[i].Id);
        }
        if (ids.length <= 0) {
            EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('ChooseOneRecord'));
            return;
        }
        var that = this;
        if (this.delValiator && this.delValiator(rows) === false)
            return;
        var comfirmOption = {
            title: System.CultureInfo.GetDisplayText('Prompt'),
            content: System.CultureInfo.GetDisplayText('DeleteSure'),
            OK: function () {
                var faOption = that.formApplication.option;
                var pd = { ids: ids, oper: 'delete', entityId: that.gridAppOption.entityId, serviceId: that.gridAppOption.serviceId } // that.currentItem.Id
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
    },
    Refresh: function () {
        //this.gridControl.customFilter = this.filterResult;
        if (this.filterControl) {
            this.filterControl.search(true)
            return;
        }
        this.gridControl.remoteRefresh()
        //this.loadGridData();
    },
    Export: function () {
        if (!this.gridAppOption.comOption)
            return;
        var item = this.gridControl.currentPostData;
        //item.currentGridViewId = this.viewScheme.gridoption.gridSolutionId;
        item.currentCols = this.gridControl.grid.options.viewData;
        var pd = item;// { item: item }
        var option = new EAM.ExportOptions();
        option.postData = pd;
        option.exportorFullName = this.gridAppOption.importorExportor_FullName;
        option.url = this.gridAppOption.comOption.exportUrl;
        if (!this.exportor)
            this.exportor = new EAM.Export(option);
        else
            this.exportor.setOptions(option);
        this.exportor.export();
    },
    Import: function () {
        var that = this;
        if (!this.importor) {
            var options = new EAM.ImportOptions();
            options.importorFullName = this.gridAppOption.importorExportor_FullName;
            options.url = this.gridAppOption.comOption.importUrl;
            options.templateCode = this.gridAppOption.templateCode;
            options.templateUrl = this.gridAppOption.comOption.importTemplateUrl;
            options.items = ["import"];
            options.templateDownloadLink = [{ name: 'import', link: '../../template/EMRecord/{0}Template.xls'.format(this.gridAppOption.viewCode) }];
            options.success = function () {
                that.Refresh();
                EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('Upload') + System.CultureInfo.GetDisplayText('Success'));
            }
            this.importor = new EAM.Import(options);
        }
        this.importor.open();
    },
    Query: function () {
        this.filterControl.togglePanel();
    },
    SaveView: function () {
        this.viewScheme.saveView();
    },
    //保存查询视图
    saveFilterView: function (dataSource, name) {
        var pd = { name: name, filter: JSON.stringify(dataSource) }
        var that = this;
        new EAP.EAMController().ExecuteServerAction(this.gridoption.filterSaveUrl, pd, function (data) {
            EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('saveSuccess'));
            that.filterDDLControl.reRead();
        });
    },
    _exitentItem: function () {
        var items = this.gridControl.getSelectedRows();
        if (items.length !== 1) {
            this.currentItem = undefined;
            EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('ChooseOneRecord'));
            return false;
        }
        var item = {};
        //$.extend(true, item, items[0])
        this.currentItem = items[0]//item;
        return true;
        //var kgrid = this.gridControl.grid;
        //var si = kgrid.select();
        //if (si.length <= 0) {
        //    this.currentItem = undefined;
        //    EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('ChooseOneRecord'));
        //    return false;
        //}
        //var item = {};
        //$.extend(true, item, kgrid.dataItem(si))
        //this.currentItem = item;
        //return true;
    },

});

EAP.UI.FormApplication = System.Object.Extends({
    option: {},
    formControl: {},
    viewData: [],
    ctor: function (option) {
        this.option = {};
        $.extend(this.option, option);
        this._initForm();
    },
    _initForm: function () {
        var option = this.option;
        var formContainer = document.createElement('div');
        var formDiv;
        if (!option.selector) {
            //容器创建
            formDiv = document.createElement('div');
        } else {
            formDiv = $(option.selector)[0];
        }

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

        this.kFormWin = $formContainer.kendoWindow({ resizable: false, modal: true, title: (option.winTitle || "") }).data("kendoWindow");
    },
    _initData: function () {
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
    },

    //_getDropdownListValues: function (field) {
    //    var option = this.option;
    //    if (!option.enums) {
    //        return [];
    //    }
    //    for (var i = 0; i < option.enums.length; i++) {
    //        if (option.enums[i].field == field)
    //            return option.enums[i].values;
    //    }
    //},

    open: function () {
        this.formControl.hideMessages();
        //开启模态窗口
        this.kFormWin.center().open();
    },

    close: function () {
        this.kFormWin.close();
    },
    //设置参数
    setOption: function (option) {
        this.option = option;
        this.formControl.setOption(this.option);
        if (this.option.winTitle)
            this.kFormWin.setOptions({ title: this.option.winTitle });
    },
    setTitle: function (title) {
        this.kFormWin.setOptions({ title: title });
    },
    get controlUniteWidth() {
        var intWidth = 200;
        if (this.option.controlUniteWidth) {
            try {
                intWidth = parseInt(this.option.controlUniteWidth);
            } catch (e) {

            }
        }
        return intWidth;
    }
});

EAP.UI.EditApplication = System.Object.Extends({
    toolbarControl: {},
    gridControl: {},
    $container: {},
    option: {},
    defOption: {
        postUrl: null,
        columns: [],
        onChange: null,
        setOrd: false,
        width: '500px',
        height: '400px'
    },
    ctor: function (option) {
        this.option = $.extend({}, this.defOption, option);
        this._initGrid();
        if (this.option.isWindow)
            this._initWindow();
    },
    _initGrid: function () {
        var option = this.option;
        var container;
        if (option.selector) {
            container = $(option.selector)[0];
        } else {
            option.selector = container = document.createElement('div');
        }
        this.$container = $(container).empty();

        //toolbar
        var tooldiv = document.createElement('div');
        container.appendChild(tooldiv);
        var tooloption = new EAP.UI.ToolbarOption();
        tooloption.owner = this;
        var text = option.postUrl ? System.CultureInfo.GetDisplayText('save') : System.CultureInfo.GetDisplayText('Apply')
        tooloption.items = [{ type: 'button', text: text, id: 'save' }];
        if (option.deleteUrl)
            tooloption.items.push({ type: 'button', text: System.CultureInfo.GetDisplayText('Delete'), id: 'del' });

        //custom items
        if (option.toolbarItems)
            tooloption.items = tooloption.items.concat(option.toolbarItems)

        tooloption.selector = tooldiv;
        this.toolbarControl = new EAP.UI.ToolbarControl(tooloption);

        //grid
        var gridDiv = document.createElement('div');
        container.appendChild(gridDiv);

        var gridopiton = new EAP.UI.GridOption();
        gridopiton.selector = gridDiv;
        var that = this;
        if (option.setOrd) {
            option.columns.push(
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
        gridopiton.columns = option.columns;
        gridopiton.height = option.gridHeight || 350;
        gridopiton.showrowcheckbox = option.showrowcheckbox;
        gridopiton.pageable = false;
        gridopiton.editable = option.editable;// true;
        if (option.deleteUrl)
            gridopiton.showrowcheckbox = true;
        this.gridControl = new EAP.UI.GridControl(gridopiton);
        this.gridControl.grid.wrapper.find('.k-grid-content').outerHeight(that.$container.innerHeight() - 80);
        //this.gridControl.grid.setOptions({ pageable: false, editable: true });//
        this.gridControl.grid.element.find('.k-grid-content').css({ height: gridopiton.height - 25 + 'px' });
        this.gridControl.grid.element.on('change', 'input:checkbox', function (e) {
            var target = e.target;
            var checked = target.checked;
            that.gridControl.updateValue($(target).closest('td'), checked);
        });
        this.gridControl.grid.element.on('change', 'input:radio', function () {
            var $target = that.gridControl.grid.element.find('input:radio:checked');
            that.gridControl.updateValue($target.closest('td'), true, true);
        });
        that.$container.resize(function () {
            //that.gridControl.grid.element.find('.k-grid-content').outerHeight();
            //that.gridControl.grid.setOptions({ height: $(this).innerHeight() - 55 });
            that.gridControl.grid.wrapper.find('.k-grid-content').outerHeight($(this).innerHeight() - 80);
        });
    },
    _initWindow: function () {
        var option = this.option;
        var container = this.$container[0];
        container.style.width = option.width;
        this.kWindow = this.$container.kendoWindow({ title: option.title || System.CultureInfo.GetDisplayText("CustomShow"), modal: true, resizable: false }).data('kendoWindow');
        this.kWindow.center();
    },
    setWinTitle: function (title) {
        this.kWindow.setOptions({ title: title });
    },

    setOption: function (option) {
        $.extend(this.option, option);
        this._initGrid();
    },
    setData: function (data) {
        //var copydata = JSON.parse(JSON.stringify(data));
        this.gridControl.grid.setDataSource(new kendo.data.DataSource({ data: data }));
    },
    setRequestOption: function (reqOption) {
        this.gridControl.setData(reqOption);
    },
    //有postUrl 提交，有onChange触发事件,有Window 关闭
    save: function () {
        var option = this.option;
        var that = this;
        var result = this.gridControl.grid._data;
        if (option.showrowcheckbox) {
            result = this.gridControl.getSelectedRows();
        }
        if (option.postUrl) {
            var pd = {};
            if (option.prePost) {
                var processed
                if ((processed = option.prePost(pd, result)) === false) return;
                else if (processed && typeof processed !== "boolean") pd.items = processed;
                else if (processed == undefined && $.isEmptyObject(pd)) pd.items = result;
            }
            else pd.items = result;
            new EAP.EAMController().ExecuteServerAction(option.postUrl, pd, function (data) {
                if (option.autoClose === false) {
                } else {
                    that.close();
                }
                EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('saveSuccess'));
                if (option.onChange) {
                    option.onChange(result);
                }
            }, function (msg) {
                EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText(msg));
            });
        }
        else {

            if (option.autoClose === false) {
            } else {
                that.close();
            }
            if (option.onChange)
                option.onChange(result);
        }
    },
    del: function () {
        var that = this;
        var option = this.option;
        var rows = this.gridControl.getSelectedRows();
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
                new EAP.EAMController().ExecuteServerAction(option.deleteUrl, { ids: ids }, function () {
                    if (!(option.autoClose === false)) that.close();
                    if (option.onChange) option.onChange();
                    kendo.ui.progress(that.kWindow.element, false);
                })
            }
        })
    },
    open: function () {
        if (this.option.isWindow)
            this.kWindow.open();
    },
    close: function () {
        if (this.option.isWindow)
            this.kWindow.close();
    },
    upItem: function (e) {
        var grid = this.gridControl.grid;
        var items = grid.dataItems();
        var item = grid.dataItem($(e.target).closest('tr'));
        var index = $.inArray(item, items);
        //del
        items.splice(index, 1);

        --index;

        index = index < 0 ? 0 : index;
        //add
        items.splice(index, 0, item);
        grid.setDataSource(new kendo.data.DataSource({ data: items }));
        grid.select("tr:eq(" + index + ")")
    },
    downItem: function (e) {
        var grid = this.gridControl.grid;
        var items = grid.dataItems();
        var item = grid.dataItem($(e.target).closest('tr'));
        var index = $.inArray(item, items);
        //del
        items.splice(index, 1);

        index = Math.min(items.length, ++index);
        //add
        items.splice(index, 0, item);
        grid.setDataSource(new kendo.data.DataSource({ data: items }));
        grid.select("tr:eq(" + index + ")")
    }
});

//容器：两个grid内容可移动
EAP.UI.ContainerManager = System.Object.Extends({
    usefulGridToolbarControl: {},
    usefulGridControl: {},
    unusefulGridToolbarControl: {},
    unusefulGridControl: {},
    kWinControl: {},
    userfulItems: [],
    unuserfulItems: [],
    option: { height: '300px' },
    ctor: function (option) {
        jQuery.extend(this.option, option);
        this._init();
        this._initData();
    },
    _init: function () {
        var option = this.option;
        var container;
        if (option.selector)
            container = $(option.selector)[0];
        else
            container = document.createElement("div");
        container.style.height = option.height;
        var showColumnsPanel = document.createElement('div');
        var hidenColumnsPanel = document.createElement('div');

        var showColumnsToolbar = document.createElement('div');
        var hidenColumnsToolbar = document.createElement('div');
        var showColumnsView = document.createElement('div');
        var hidenColumnsView = document.createElement('div');

        showColumnsPanel.appendChild(showColumnsToolbar);
        showColumnsPanel.appendChild(showColumnsView);
        hidenColumnsPanel.appendChild(hidenColumnsToolbar);
        hidenColumnsPanel.appendChild(hidenColumnsView);
        var splitContainer = document.createElement('div');
        splitContainer.appendChild(showColumnsPanel);
        splitContainer.appendChild(hidenColumnsPanel)
        splitContainer.style.width = '500px';
        splitContainer.style.height = $(container).innerHeight() - 20 + 'px';
        container.appendChild(splitContainer);
        var $splitContainer = $(splitContainer);

        if (!option.selector)
            $('body').append(container);
        var kspl = $splitContainer.kendoSplitter({
            panes: [
                { scrollable: true, size: "50%" },
                { scrollable: true, size: "50%" }
            ]
        }, false).data('kendoSplitter');
        $(container).hide();
        this._initUsefulGrid(showColumnsToolbar, showColumnsView);
        this._initUnusefulGrid(hidenColumnsToolbar, hidenColumnsView);
        //window
        this.kWinControl = $(container).kendoWindow({ resizable: false }).data('kendoWindow');
    },
    _initData: function () {
        var option = this.option;
        if (!option.gridSolutionId && !option.userfulItems && !option.unuserfulItems)
            return;
        if (option.gridSolutionId) {
            //url
        }
        else {
            this.userfulItems = option.userfulItems;
            this.unuserfulItems = option.unuserfulItems;
        }
        this.setUsefulGridData(this.userfulItems);
        this.setUnusefulGridData(this.unuserfulItems);
    },
    _initUsefulGrid: function (toolbar, grid) {
        var that = this;
        if (toolbar) {
            var tOption = new EAP.UI.ToolbarOption();
            tOption.owner = this;
            tOption.selector = toolbar;
            tOption.items = [
                { type: 'button', text: System.CultureInfo.GetDisplayText('Confirm'), id: 'save' },
                { type: 'button', text: System.CultureInfo.GetDisplayText('delete'), id: 'removeItems' }];
            this.usefulGridToolbarControl = new EAP.UI.ToolbarControl(tOption);
        }
        if (grid) {
            var option = new EAP.UI.GridOption();
            option.selector = grid;
            option.showrowcheckbox = true;
            option.columns = [{
                field: 'Code', title: System.CultureInfo.GetDisplayText('Name'), template: this.option.template || function (value) { return value; }
            }, {
                command: [{
                    name: "up",
                    click: function (e) { that.upItem(e); },
                    width: 20
                }]
            }];
            var height = $(grid).closest('.k-pane').innerHeight() - (this.usefulGridToolbarControl ? this.usefulGridToolbarControl.toolbar.wrapper.outerHeight() : 0);
            option.height = height;
            this.usefulGridControl = new EAP.UI.GridControl(option);
            this.usefulGridControl.grid.setOptions({ pageable: false })
        }
    },
    _initUnusefulGrid: function (toolbar, grid) {
        if (toolbar) {
            var tOption = new EAP.UI.ToolbarOption();
            tOption.owner = this;
            tOption.selector = toolbar;
            tOption.items = [
                { type: 'button', text: System.CultureInfo.GetDisplayText('Add'), id: 'addItems' }]
            this.unusefulGridToolbarControl = new EAP.UI.ToolbarControl(tOption);
        }
        if (grid) {
            var option = new EAP.UI.GridOption();
            option.selector = $(grid);
            option.showrowcheckbox = true;
            option.columns = [{
                field: 'Code', title: System.CultureInfo.GetDisplayText('Name'), template: function (value) {
                    if (value.CustomHeader)
                        return value.CustomHeader;
                    else
                        return System.CultureInfo.GetDisplayText(value.Code);
                }
            }];
            var height = $(grid).closest('.k-pane').innerHeight() - (this.unusefulGridToolbarControl ? this.unusefulGridToolbarControl.toolbar.wrapper.outerHeight() : 0);
            option.height = height;
            this.unusefulGridControl = new EAP.UI.GridControl(option);
            this.unusefulGridControl.grid.setOptions({ pageable: false })
        }
    },
    setUsefulGridData: function (data) {
        var dataSource = new kendo.data.DataSource({ data: data });
        this.usefulGridControl.grid.setDataSource(dataSource);
    },
    setUnusefulGridData: function (data) {
        var dataSource = new kendo.data.DataSource({ data: data });
        this.unusefulGridControl.grid.setDataSource(dataSource);
    },
    open: function () {
        this.kWinControl.center().open();
    },
    save: function () {
        if (this.option.onChange) {
            this.option.onChange(this, this.usefulGridControl.grid._data, this.unusefulGridControl.grid._data);
        }
        this.kWinControl.close();
    },
    removeItems: function () {
        var selectedItems = this.usefulGridControl.getSelectedRows();
        this._moveItems(this.usefulGridControl, this.unusefulGridControl, selectedItems);
    },
    addItems: function () {
        var id = this.unusefulGridControl.getSelectedId();
        var selectedItems = this.unusefulGridControl.getSelectedRows();
        this._moveItems(this.unusefulGridControl, this.usefulGridControl, selectedItems);
    },
    _moveItems: function (sourceControl, targetControl, items) {
        sourceControl.removeItems(items);
        targetControl.appendItems(items);
    },
    upItem: function (e) {
        var grid = this.usefulGridControl.grid;
        var items = grid.dataItems();
        var item = grid.dataItem($(e.target).closest('tr'));
        var index = $.inArray(item, items);
        //del
        items.splice(index, 1);
        index--;
        if (index < 0) index = 0;
        //add
        items.splice(index, 0, item);
        grid.setDataSource(new kendo.data.DataSource({ data: items }));
    },
    setOption: function (option) {
        jQuery.extend(this.option, option);
        //this._setUsefulGridColumns();
        this._initData();
    },
    _setUsefulGridColumns: function () {
        var option = {};
        var height = this.usefulGridControl.grid.element.closest('.k-pane').innerHeight() - (this.usefulGridToolbarControl ? this.usefulGridToolbarControl.toolbar.wrapper.outerHeight() : 0);
        option.columns = [{
            field: 'Code', title: System.CultureInfo.GetDisplayText('Name'), template: this.option.template || function (value) { return value; }
        }, {
            command: [{
                name: "up",
                click: function (e) { that.upItem(e); },
                width: 20
            }]
        }];
        option.height = height;
        this.usefulGridControl.grid.setOptions(option);
    },
    _setUnusefulGridColumns: function () {
        var option = {};
        var height = this.unusefulGridControl.grid.element.closest('.k-pane').innerHeight() - (this.unusefulGridToolbarControl ? this.unusefulGridToolbarControl.toolbar.wrapper.outerHeight() : 0);
        option.columns = [{
            field: 'Code', title: System.CultureInfo.GetDisplayText('Name'), template: this.option.template || function (value) { return value; }
        }, {
            command: [{
                name: "up",
                click: function (e) { that.upItem(e); },
                width: 20
            }]
        }];
        option.height = height;
        this.unusefulGridControl.grid.setOptions(option);
    }
});
