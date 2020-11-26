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
    var RtAlarm = (function (_super) {
        __extends(RtAlarm, _super);
        function RtAlarm() {
            return _super.call(this, EAP.UI.AGrid) || this;
        }
        RtAlarm.prototype.configOptions = function (options) {
            var gOptions = new EAP.UI.GridOption();
            gOptions.gridSolutionId = 'e80b06fb-d106-427f-9ac8-74855762b6e3';
            options.gridOption = gOptions;
            // options.viewScheme = true;
            options.filter = false;
            //gOptions.showrowcheckbox = false;
            _super.prototype.configOptions.call(this, options);
        };
        return RtAlarm;
    }(EAP.UI.BaseController));
    ;
    new RtAlarm();
})(RPM || (RPM = {}));
