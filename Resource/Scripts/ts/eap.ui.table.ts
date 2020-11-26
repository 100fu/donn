/// <reference path="../base/eap.kendo1.ts" />

namespace EAP.UI.Table {

    export interface ITable {
        currentItem: () => Object
        currentItems: () => Array<any>
        entityId: string
        serviceId: string
        Refresh: Function
        exportor: EAM.Export
        importor: EAM.Import
        viewScheme: EAP.UI.ViewScheme
        formOption: EAP.UI.FormApplicationOption
        formApplication: FormApplication
        filterControl: EAP.UI.FilterForm
        loadData_Init: Function
        options
        gridControl: EAP.UI.GridControl
    }

    export class TableOnLoadAction extends EAP.UI.Core.Action {
        constructor() {
            super('OnLoad');
        }
        execute(ctx: EAP.UI.Table.TableActionContext): void {

        }
    }

    export class TableActionContext extends EAP.UI.Core.ActionContext {
        table: ITable;
    }

    /**
     * Table Add
     */
    export class TableAddAction extends EAP.UI.Core.Action {

        constructor() {
            super("Add");
        }

        execute(ctx: EAP.UI.Table.TableActionContext): void {

            let that = ctx.table;
            if (that.options.processGate && !that.options.processGate(that.currentItem, "add")) return;
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
                }
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

        }
    }


    /**
     * Table Delete
     */
    export class TableDeleteAction extends EAP.UI.Core.Action {

        constructor() {
            super("Delete");
        }

        execute(ctx: EAP.UI.Table.TableActionContext): void {
            let that = ctx.table;
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
        }
    }

    /**
     * Table Refresh
     */
    export class TableRefreshAction extends EAP.UI.Core.Action {

        constructor() {
            super("Refresh");
        }

        execute(ctx: EAP.UI.Table.TableActionContext): void {
            let that = ctx.table;
            //this.gridControl.customFilter = this.filterResult;
            if (that.filterControl) {
                that.filterControl.search()
                return;
            }
            that.loadData_Init();
        }
    }

    /**
     * Table SaveView
     */
    export class TableSaveViewAction extends EAP.UI.Core.Action {
        constructor() {
            super("SaveView");
        }
        execute(ctx: EAP.UI.Table.TableActionContext): void {
            let that = ctx.table;
            that.viewScheme.saveView();
        }
    }

    /**
     * Table Edit
     */
    export class TableEditAction extends EAP.UI.Core.Action {
        constructor() {
            super("Edit");
        }
        execute(ctx: EAP.UI.Table.TableActionContext): void {
            let that = ctx.table
            let currentItem = that.currentItem();
            if (!currentItem || (that.options.processGate && !that.options.processGate(that.currentItem, "edit"))) return;
            currentItem = $.extend(true, {}, currentItem)
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
            } else
                faOption.sourceData = currentItem;
            faOption.prePostProcess = function (data) {
                var pd = { item: data, oper: 'edit', entityId: that.options.entityId, serviceId: that.options.serviceId }
                if (that.formOption.prePostProcess)
                    return that.formOption.prePostProcess(pd);
                return pd;
            }
            faOption.readonly = false;
            faOption.winTitle = System.CultureInfo.GetDisplayText('Edit');

            that.formApplication.open();
            that.formApplication.setOption(faOption);
        }
    }

    export class TableViewAction extends EAP.UI.Core.Action {
        constructor() {
            super('View');
        }
        execute(ctx: EAP.UI.Table.TableActionContext): void {
            let that = ctx.table;
            let currentItem = that.currentItem()
            if (!currentItem || (that.options.processGate && !that.options.processGate(that.currentItem, "view"))) return;
            let faOption = that.formApplication.option;
            faOption.success = null;
            faOption.cancle = null;
            faOption.buttonGroupOptions = null;
            if (that.options.formDataProcess) {
                faOption.sourceData = that.options.formDataProcess(currentItem, "view");
            } else
                faOption.sourceData = that.currentItem;
            faOption.readonly = true;
            faOption.winTitle = System.CultureInfo.GetDisplayText('View');

            that.formApplication.setOption(faOption);
            that.formApplication.open();
        }
    }

    /**
     * Table Export
     */
    export class TableExportAction extends EAP.UI.Core.Action {
        constructor() {
            super('Export');
        }
        execute(ctx: EAP.UI.Table.TableActionContext): void {
            let that = ctx.table;
            if (!that.options.comOption)
                return;
            let item = that.gridControl.currentPostData;
            //item.currentGridViewId = this.viewScheme.gridoption.gridSolutionId;
            item.currentCols = that.viewScheme.currentCols;
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
        }

    }

    /**
     * Table Import
     */
    export class TableImportAction extends EAP.UI.Core.Action {
        constructor() {
            super('Import');
        }

        execute(ctx: EAP.UI.Table.TableActionContext): void {
            let that = ctx.table;
            if (!that.importor) {
                let options = new EAM.ImportOptions();
                options.importorFullName = that.options.importorExportor_FullName;
                options.url = that.options.comOption.importUrl;
                options.templateCode = that.options.templateCode;
                options.items = ["import"];
                options.templateDownloadLink = [{ name: 'import', link: '../../template/EMRecord/{0}Template.xls'.format(that.options.viewCode) }];
                options.success = function () {
                    that.Refresh();
                    EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('Upload') + System.CultureInfo.GetDisplayText('Success'));
                }
                that.importor = new EAM.Import(options);
            }
            that.importor.open();
        }
    }

    /**
     * Table Query
     */
    export class TableQueryAction extends EAP.UI.Core.Action {
        constructor() {
            super('Query');
        }
        execute(ctx: EAP.UI.Table.TableActionContext): void {
            let that = ctx.table;
            that.filterControl.togglePanel();
        }
    }

}

