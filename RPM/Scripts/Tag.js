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
    //class Basestation extends EAP.UI.BaseController {
    //    constructor() {
    //        super(EAP.UI.AGrid);
    //    }
    //    protected configOptions(options: EAP.UI.AGridOptions) {
    //        let gOptions = new EAP.UI.GridOption();
    //        gOptions.gridSolutionId = '4f7926ef-b210-450c-95e6-b89d785b1b14';
    //        options.gridOption = gOptions;
    //        options.viewScheme = false;
    //        options.filter = true;
    //        super.configOptions(options);
    //    }
    //}
    //new Basestation();
    var Tag = (function (_super) {
        __extends(Tag, _super);
        function Tag() {
            var _this = _super.call(this, EAP.UI.AGrid) || this;
            $(".group_bar_right").find("button:not(:first)").hide();
            $(".gAppOtherTool_div").parent().hide();
            return _this;
        }
        Tag.prototype.configOptions = function (options) {
            var gOptions = new EAP.UI.GridOption();
            gOptions.gridSolutionId = '4f7926ef-b210-450c-95e6-b89d785b1b14'; //栏目Id
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = true;
            _super.prototype.configOptions.call(this, options);
        };
        return Tag;
    }(EAP.UI.BaseController));
    ;
    new Tag();
})(RPM || (RPM = {}));
