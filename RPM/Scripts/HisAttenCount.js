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
    var HisAttenCount = (function (_super) {
        __extends(HisAttenCount, _super);
        function HisAttenCount() {
            var _this = _super.call(this, EAP.UI.AGrid) || this;
            $(".formFilter").find("span").click();
            $(".group_bar_right").find("button:not(:first)").hide();
            $(".gAppOtherTool_div").parent().hide();
            return _this;
        }
        HisAttenCount.prototype.configOptions = function (options) {
            var gOptions = new EAP.UI.GridOption();
            gOptions.gridSolutionId = 'c28be09c-5c7b-402c-83ad-8fff169017a8'; //栏目Id
            gOptions.dataBound = function () {
                $(".layoutContent .k-grid-content colgroup col:first-child").width(0);
                $(".layoutContent .k-grid-header-wrap colgroup col:first-child").width(0);
            };
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = true;
            options.toolbar = true;
            _super.prototype.configOptions.call(this, options);
        };
        return HisAttenCount;
    }(EAP.UI.BaseController));
    ;
    new HisAttenCount();
})(RPM || (RPM = {}));
