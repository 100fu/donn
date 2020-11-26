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
var RPM;
(function (RPM) {
    var Person = (function (_super) {
        __extends(Person, _super);
        function Person() {
            var _this = _super.call(this, EAP.UI.AGrid) || this;
            $(".group_bar_right").find("button:not(:first)").hide();
            $(".gAppOtherTool_div").parent().hide();
            return _this;
        }
        Person.prototype.configOptions = function (options) {
            var that = this;
            var gOptions = new EAP.UI.GridOption();
            that.searchOption = new EAP.UI.GridOption();
            that.searchRequest = new EAP.UI.GridDataRequest();
            that.formOptions = new EAP.UI.FormApplicationOption();
            that.formOptions.controlUniteWidth = "120px";
            that.formOptions.titleWidth = '80px';
            that.formOptions.columnsAmount = 3;
            that.formOptions.success = {
                text: "保存", onSuccess: function (data) {
                    that.form.close();
                    that.app.Refresh();
                }
            };
            that.formOptions.cancle = {
                text: "取消",
                fn: function () {
                    that.form.close();
                    that.app.Refresh();
                }
            };
            that.formOptions.autoDestroy = true;
            gOptions.gridSolutionId = '2873ea66-0d19-4db9-9b67-64b302dfa333'; //栏目Id
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = true;
            //导入导出时重写导入导出方法的类库文件路径
            options.importorExportor_FullName = "Donn.RPM.Web.HisAttDemoExport";
            //实体对象名称
            options.templateCode = "Person";
            _super.prototype.configOptions.call(this, options);
        };
        Person.prototype.Edit_Action = function (e) {
            var that = this, dataItem;
            if (!that.selectItem(true))
                return false;
            that.searchRequest.postdata = { id: that.Item.Id };
            this.buidFormOptions();
            that.formOptions.winTitle = "编辑";
            that.formOptions.prePostProcess = function (data) {
                var pd = { item: data, oper: 'edit', entityId: "Donn.RPM.Entity.Person", serviceId: "Donn.RPM.Interface.IPersonService" };
                return pd;
            };
            that.form = new EAP.UI.FormApplication(that.formOptions);
            that.form.open();
            that.form.formControl.reCompile(true, false);
            that.form.formControl.reloadData(that.Item);
        };
        Person.prototype.Add_Action = function (e) {
            var that = this, dataItem;
            //if (that.selectItem(true)) return false;
            that.searchRequest.postdata = {};
            this.buidFormOptions();
            that.formOptions.winTitle = "新增";
            that.formOptions.prePostProcess = function (data) {
                var pd = { item: data, oper: 'add', entityId: "Donn.RPM.Entity.Person", serviceId: "Donn.RPM.Interface.IPersonService" };
                return pd;
            };
            that.form = new EAP.UI.FormApplication(that.formOptions);
            that.form.open();
            that.form.formControl.reCompile(true, false);
            // that.form.formControl.reloadData(that.Item);
        };
        Person.prototype.View_Action = function (e) {
            var that = this, dataItem;
            if (!that.selectItem(true))
                return false;
            that.searchRequest.postdata = { id: that.Item.Id };
            this.buidFormOptions();
            that.formOptions.winTitle = "查看";
            that.formOptions.prePostProcess = function (data) {
                var pd = { item: data, oper: 'view', entityId: "Donn.RPM.Entity.Person", serviceId: "Donn.RPM.Interface.IPersonService" };
                return pd;
            };
            that.form = new EAP.UI.FormApplication(that.formOptions);
            that.form.open();
            that.form.formControl.reCompile(true, false);
            that.form.formControl.reloadData(that.Item);
            var foot = document.getElementsByName("Foot");
            $(foot).hide();
        };
        Person.prototype.buidFormOptions = function () {
            var that = this;
            that.searchOption.columns = [{ field: "Code", title: "标签编号" }];
            that.searchRequest.url = new System.UrlObj("RPM", "PositionTag");
            that.formOptions.formViewModelId = "e6d21e74-9546-4d32-b596-3d94ef81bd75";
            that.formOptions.Data = [{
                    type: 'searchbox', title: "标签编号", name: "IdPositionTag", colspan: 1, change: function (e) {
                        var i = e.sender.selectItems[0];
                    }, gridOptions: that.searchOption, dateRequestOptions: that.searchRequest, pageable: true, multiselect: false, windowSize: [270, 350],
                    validateOptions: { required: true }
                }
            ];
        };
        Person.prototype.selectItem = function (single) {
            var that = this, AGrid = that.app;
            that.currentItem = AGrid.gridControl.getSelectedRows();
            if (single && that.currentItem.length != 1) {
                EAP.UI.MessageBox.alert("提示", "请选择一行数据");
                return false;
            }
            if (!single && that.currentItem.length < 0) {
                EAP.UI.MessageBox.alert("提示", "请选择数据");
                return false;
            }
            that.Item = that.currentItem[0];
            return true;
        };
        return Person;
    }(EAP.UI.BaseController));
    ;
    new Person();
})(RPM || (RPM = {}));
