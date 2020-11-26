/// <reference path="../base/eap.kendo1.ts" />
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
        var Table;
        (function (Table) {
            var TableOnLoadAction = (function (_super) {
                __extends(TableOnLoadAction, _super);
                function TableOnLoadAction() {
                    return _super.call(this, 'OnLoad') || this;
                }
                TableOnLoadAction.prototype.execute = function (ctx) {
                };
                return TableOnLoadAction;
            }(EAP.UI.Core.Action));
            Table.TableOnLoadAction = TableOnLoadAction;
            var TableActionContext = (function (_super) {
                __extends(TableActionContext, _super);
                function TableActionContext() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return TableActionContext;
            }(EAP.UI.Core.ActionContext));
            Table.TableActionContext = TableActionContext;
            /**
             * Table Add
             */
            var TableAddAction = (function (_super) {
                __extends(TableAddAction, _super);
                function TableAddAction() {
                    return _super.call(this, "Add") || this;
                }
                TableAddAction.prototype.execute = function (ctx) {
                    var that = ctx.table;
                    if (that.options.processGate && !that.options.processGate(that.currentItem, "add"))
                        return;
                    var faOption = that.formApplication.option;
                    if (!that.formOption.buttonGroupOptions) {
                        faOption.success = {
                            text: this.Text('save'), onSuccess: function (data) {
                                that.formApplication.close();
                                that.Refresh();
                            }
                        };
                        faOption.cancle = { text: this.Text('Cancel'), fn: function () { that.formApplication.close(); } };
                        faOption.prePostProcess = function (data) {
                            var pd = { item: data, oper: 'add', entityId: that.entityId, serviceId: that.serviceId };
                            if (that.formOption.prePostProcess)
                                return that.formOption.prePostProcess(pd);
                            return pd;
                        };
                    }
                    else {
                        faOption.buttonGroupOptions = that.formOption.buttonGroupOptions;
                    }
                    var newData = {};
                    $.extend(true, newData, that.options.formBaseData);
                    faOption.sourceData = newData;
                    if (that.options.formDataProcess && that.options.formDataProcess(newData, "add")) {
                        faOption.sourceData = that.options.formDataProcess(newData, "add");
                    }
                    faOption.readonly = false;
                    faOption.winTitle = this.Text('Add');
                    that.formApplication.setOption(faOption);
                    that.formApplication.open();
                };
                return TableAddAction;
            }(EAP.UI.Core.Action));
            Table.TableAddAction = TableAddAction;
            /**
             * Table Delete
             */
            var TableDeleteAction = (function (_super) {
                __extends(TableDeleteAction, _super);
                function TableDeleteAction() {
                    return _super.call(this, "Delete") || this;
                }
                TableDeleteAction.prototype.execute = function (ctx) {
                    var that = ctx.table;
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
                };
                return TableDeleteAction;
            }(EAP.UI.Core.Action));
            Table.TableDeleteAction = TableDeleteAction;
            /**
             * Table Refresh
             */
            var TableRefreshAction = (function (_super) {
                __extends(TableRefreshAction, _super);
                function TableRefreshAction() {
                    return _super.call(this, "Refresh") || this;
                }
                TableRefreshAction.prototype.execute = function (ctx) {
                    var that = ctx.table;
                    //this.gridControl.customFilter = this.filterResult;
                    if (that.filterControl) {
                        that.filterControl.search();
                        return;
                    }
                    that.loadData_Init();
                };
                return TableRefreshAction;
            }(EAP.UI.Core.Action));
            Table.TableRefreshAction = TableRefreshAction;
            /**
             * Table SaveView
             */
            var TableSaveViewAction = (function (_super) {
                __extends(TableSaveViewAction, _super);
                function TableSaveViewAction() {
                    return _super.call(this, "SaveView") || this;
                }
                TableSaveViewAction.prototype.execute = function (ctx) {
                    var that = ctx.table;
                    that.viewScheme.saveView();
                };
                return TableSaveViewAction;
            }(EAP.UI.Core.Action));
            Table.TableSaveViewAction = TableSaveViewAction;
            /**
             * Table Edit
             */
            var TableEditAction = (function (_super) {
                __extends(TableEditAction, _super);
                function TableEditAction() {
                    return _super.call(this, "Edit") || this;
                }
                TableEditAction.prototype.execute = function (ctx) {
                    var that = ctx.table;
                    var currentItem = that.currentItem();
                    if (!currentItem || (that.options.processGate && !that.options.processGate(that.currentItem, "edit")))
                        return;
                    currentItem = $.extend(true, {}, currentItem);
                    var faOption = that.formApplication.option;
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
                    if (that.options.formDataProcess) {
                        faOption.sourceData = that.options.formDataProcess(currentItem, "edit");
                    }
                    else
                        faOption.sourceData = currentItem;
                    faOption.prePostProcess = function (data) {
                        var pd = { item: data, oper: 'edit', entityId: that.options.entityId, serviceId: that.options.serviceId };
                        if (that.formOption.prePostProcess)
                            return that.formOption.prePostProcess(pd);
                        return pd;
                    };
                    faOption.readonly = false;
                    faOption.winTitle = System.CultureInfo.GetDisplayText('Edit');
                    that.formApplication.open();
                    that.formApplication.setOption(faOption);
                };
                return TableEditAction;
            }(EAP.UI.Core.Action));
            Table.TableEditAction = TableEditAction;
            var TableViewAction = (function (_super) {
                __extends(TableViewAction, _super);
                function TableViewAction() {
                    return _super.call(this, 'View') || this;
                }
                TableViewAction.prototype.execute = function (ctx) {
                    var that = ctx.table;
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
                        faOption.sourceData = that.currentItem;
                    faOption.readonly = true;
                    faOption.winTitle = System.CultureInfo.GetDisplayText('View');
                    that.formApplication.setOption(faOption);
                    that.formApplication.open();
                };
                return TableViewAction;
            }(EAP.UI.Core.Action));
            Table.TableViewAction = TableViewAction;
            /**
             * Table Export
             */
            var TableExportAction = (function (_super) {
                __extends(TableExportAction, _super);
                function TableExportAction() {
                    return _super.call(this, 'Export') || this;
                }
                TableExportAction.prototype.execute = function (ctx) {
                    var that = ctx.table;
                    if (!that.options.comOption)
                        return;
                    var item = that.gridControl.currentPostData;
                    //item.currentGridViewId = this.viewScheme.gridoption.gridSolutionId;
                    item.currentCols = that.viewScheme.currentCols;
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
                };
                return TableExportAction;
            }(EAP.UI.Core.Action));
            Table.TableExportAction = TableExportAction;
            /**
             * Table Import
             */
            var TableImportAction = (function (_super) {
                __extends(TableImportAction, _super);
                function TableImportAction() {
                    return _super.call(this, 'Import') || this;
                }
                TableImportAction.prototype.execute = function (ctx) {
                    var that = ctx.table;
                    if (!that.importor) {
                        var options = new EAM.ImportOptions();
                        options.importorFullName = that.options.importorExportor_FullName;
                        options.url = that.options.comOption.importUrl;
                        options.templateCode = that.options.templateCode;
                        options.items = ["import"];
                        options.templateDownloadLink = [{ name: 'import', link: '../../template/EMRecord/{0}Template.xls'.format(that.options.viewCode) }];
                        options.success = function () {
                            that.Refresh();
                            EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('Upload') + System.CultureInfo.GetDisplayText('Success'));
                        };
                        that.importor = new EAM.Import(options);
                    }
                    that.importor.open();
                };
                return TableImportAction;
            }(EAP.UI.Core.Action));
            Table.TableImportAction = TableImportAction;
            /**
             * Table Query
             */
            var TableQueryAction = (function (_super) {
                __extends(TableQueryAction, _super);
                function TableQueryAction() {
                    return _super.call(this, 'Query') || this;
                }
                TableQueryAction.prototype.execute = function (ctx) {
                    var that = ctx.table;
                    that.filterControl.togglePanel();
                };
                return TableQueryAction;
            }(EAP.UI.Core.Action));
            Table.TableQueryAction = TableQueryAction;
        })(Table = UI.Table || (UI.Table = {}));
    })(UI = EAP.UI || (EAP.UI = {}));
})(EAP || (EAP = {}));
