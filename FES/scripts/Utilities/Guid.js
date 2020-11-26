define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Guid = (function () {
        function Guid() {
        }
        Guid.s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        Guid.NewId = function () {
            return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
                this.s4() + '-' + this.s4() + this.s4() + this.s4();
        };
        Guid.Validate = function (str) {
            return new RegExp(/^{?[\da-f]{8}(-[\da-f]{4}){4}[\da-f]{8}\}?$/i).test(str);
        };
        return Guid;
    }());
    exports.Guid = Guid;
});
