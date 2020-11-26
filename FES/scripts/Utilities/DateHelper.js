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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ISODateStandar = (function () {
        function ISODateStandar() {
        }
        ISODateStandar.prototype.weekOfYear = function (date) {
            var target = new Date(date.valueOf()), dayNr = (date.getDay() + 6) % 7;
            target.setDate(target.getDate() - dayNr + 3);
            var thisThursday = target.valueOf();
            target.setMonth(0, 1);
            if (target.getDay() != 4)
                target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
            return 1 + Math.ceil((thisThursday - target.valueOf()) / 604800000);
        };
        ISODateStandar.prototype.dateOfWeek = function (year, weekOfYear, day) {
            if (day === void 0) { day = 0; }
            var target = new Date(year, 0, 4 + (weekOfYear - 1) * 7);
            target.setDate(target.getDate() - (target.getDay() + 6) % 7 + day);
            return target;
        };
        ISODateStandar.prototype.weekFormat = function (date, format) {
            return (format || "yyyy-WW").replace(/yyyy/g, this.fullYear(date).toString()).replace(/WW/g, "W" + this.weekOfYear(date).toString());
        };
        ISODateStandar.prototype.fullYear = function (date) {
            var target = new Date(date.valueOf());
            target.setDate(target.getDate() - ((date.getDay() + 6) % 7) + 3);
            return target.getFullYear();
        };
        return ISODateStandar;
    }());
    var DateStandars = (function (_super) {
        __extends(DateStandars, _super);
        function DateStandars() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.iso = Patterns.Singleton(ISODateStandar, true);
            return _this;
        }
        return DateStandars;
    }(Patterns.SimplyFactory));
    /**时间日期标准s  { Generate(name: string):System.DateEx.IDateStandar}  name:["iso"]*/
    exports.DateStandar = Patterns.Singleton(DateStandars, true);
});
