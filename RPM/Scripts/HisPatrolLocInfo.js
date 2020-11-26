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
    var HisPatrolLocInfo = (function (_super) {
        __extends(HisPatrolLocInfo, _super);
        function HisPatrolLocInfo() {
            var _this = 
            //super(LayoutW);
            _super.call(this, EAP.UI.AGrid) || this;
            $(".formFilter").find("span").click();
            $(document).ready(function () {
                $(".group_bar_right").find("button:not(:first)").hide();
                $(".gAppOtherTool_div").parent().hide();
                $(".divLattic").find(".l_divCell:last").hide();
            });
            $(".formFilter").find("span").click(function () {
                $(".divLattic").find(".l_divCell:last").hide();
            });
            return _this;
            //$("div[name='filterFormWrapper']").resize(function () {
            //    $(".divLattic").find(".l_divCell:last").hide();
            //});
        }
        HisPatrolLocInfo.prototype.configOptions = function (options) {
            var gOptions = new EAP.UI.GridOption();
            gOptions.gridSolutionId = '063566e2-83e8-4523-a768-2205e25d7983'; //栏目Id
            gOptions.dataBound = function () {
                $(".layoutContent .k-grid-content colgroup col:first-child").width(0);
                $(".layoutContent .k-grid-header-wrap colgroup col:first-child").width(0);
            };
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = true;
            options.toolbar = true;
            //傳入自定義參數
            options.gridDataRequest = new EAP.UI.GridDataRequest();
            options.gridDataRequest.postdata = { search: function () { return "patrolloc"; } };
            $("div[name='formFilter']").find("span").click(function () {
                $(".divLattic").find(".l_divCell:last").hide();
            });
            return options;
        };
        return HisPatrolLocInfo;
    }(EAP.UI.BaseController));
    ;
    new HisPatrolLocInfo();
})(RPM || (RPM = {}));
