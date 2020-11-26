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
    var HisAttendance = (function (_super) {
        __extends(HisAttendance, _super);
        function HisAttendance() {
            return _super.call(this, EAP.UI.AGrid) || this;
        }
        HisAttendance.prototype.configOptions = function (options) {
            var gOptions = new EAP.UI.GridOption();
            gOptions.gridSolutionId = 'dd0d96d1-b498-476e-938a-9f9670ac5dff'; //栏目Id
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = false;
            _super.prototype.configOptions.call(this, options);
        };
        return HisAttendance;
    }(EAP.UI.BaseController));
    ;
    new HisAttendance();
})(RPM || (RPM = {}));
