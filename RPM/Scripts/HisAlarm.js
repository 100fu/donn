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
    var HisAlarm = (function (_super) {
        __extends(HisAlarm, _super);
        function HisAlarm() {
            return _super.call(this, EAP.UI.AGrid) || this;
        }
        HisAlarm.prototype.configOptions = function (options) {
            var gOptions = new EAP.UI.GridOption();
            gOptions.gridSolutionId = 'e80b06fb-d106-427f-9ac8-74855762b6e3	'; //栏目Id
            //gOptions.gridSolutionId = 'a16d2166-3c13-4421-9c8f-6ce56cd18923	';  //栏目Id
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = false;
            _super.prototype.configOptions.call(this, options);
        };
        return HisAlarm;
    }(EAP.UI.BaseController));
    ;
    new HisAlarm();
})(RPM || (RPM = {}));
