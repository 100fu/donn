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
    var AlarmInfo = (function (_super) {
        __extends(AlarmInfo, _super);
        function AlarmInfo() {
            return _super.call(this, EAP.UI.AGrid) || this;
        }
        AlarmInfo.prototype.configOptions = function (options) {
            var gOptions = new EAP.UI.GridOption();
            gOptions.gridSolutionId = 'c1f6d0fc-8834-4bfe-a400-65f0fdfc0a31'; //栏目Id
            //gOptions.gridSolutionId = 'a16d2166-3c13-4421-9c8f-6ce56cd18923	';  //栏目Id
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = false;
            _super.prototype.configOptions.call(this, options);
        };
        return AlarmInfo;
    }(EAP.UI.BaseController));
    ;
    new AlarmInfo();
})(RPM || (RPM = {}));
