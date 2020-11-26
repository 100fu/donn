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
    var Station = (function (_super) {
        __extends(Station, _super);
        function Station() {
            var _this = _super.call(this, EAP.UI.AGrid) || this;
            $(".group_bar_right").find("button:not(:first)").hide();
            $(".gAppOtherTool_div").parent().hide();
            return _this;
        }
        Station.prototype.configOptions = function (options) {
            var that = this;
            var gOptions = new EAP.UI.GridOption();
            that.searchOption = new EAP.UI.GridOption();
            that.searchRequest = new EAP.UI.GridDataRequest();
            //傳入自定義參數
            //options.gridDataRequest = new EAP.UI.GridDataRequest();
            //options.gridDataRequest.postdata = { AA: function () { return "111111"; } };
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
            gOptions.gridSolutionId = '9f40d80b-969a-4405-baa0-86289c960c1f'; //栏目Id
            //gOptions.dataBound = () => {
            //    $(".layoutContent .k-grid-content colgroup col:first-child").width(0);
            //    $(".layoutContent .k-grid-header-wrap colgroup col:first-child").width(0);
            //}
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = true;
            _super.prototype.configOptions.call(this, options);
        };
        Station.prototype.Add_Action = function (e) {
            var that = this, dataItem;
            //if (that.selectItem(true)) return false;
            that.searchRequest.postdata = {};
            that.buidFormOptions();
            that.formOptions.winTitle = "新增";
            that.formOptions.prePostProcess = function (data) {
                var pd = { item: data, oper: 'add', entityId: "Donn.RPM.Entity.Station", serviceId: "Donn.RPM.Interface.IStationService" };
                return pd;
            };
            that.form = new EAP.UI.FormApplication(that.formOptions);
            that.form.open();
            that.form.formControl.reCompile(true, false);
            //placeholder
            var aa = that.form.formControl.kendoControls["Position"];
            console.info($(aa).attr('placeholder', "x,y,z(单位:cm)").css({ color: "#000000" }));
            // that.form.formControl.reloadData(that.Item);
        };
        Station.prototype.buidFormOptions = function () {
            var that = this;
            that.formOptions.formViewModelId = "eeade07d-d36a-4124-aa23-f5b50a9e1802";
        };
        return Station;
    }(EAP.UI.BaseController));
    ;
    new Station();
})(RPM || (RPM = {}));
