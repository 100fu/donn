define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * judge mobile
     * recit from https://www.abeautifulsite.net/detecting-mobile-devices-with-javascript edited by Cory LaViska
     */
    var IsMobile = (function () {
        function IsMobile() {
        }
        IsMobile.Android = function () {
            return navigator.userAgent.match(/Android/i);
        };
        IsMobile.BlackBerry = function () {
            return navigator.userAgent.match(/BlackBerry/i);
        };
        IsMobile.iOS = function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        };
        IsMobile.Opera = function () {
            return navigator.userAgent.match(/Opera Mini/i);
        };
        IsMobile.Windows = function () {
            return navigator.userAgent.match(/IEMobile/i);
        };
        IsMobile.any = function () {
            return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
        };
        return IsMobile;
    }());
    exports.IsMobile = IsMobile;
    ;
});
