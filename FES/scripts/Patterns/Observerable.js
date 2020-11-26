define(["require", "exports", "./../Utilities/Guid"], function (require, exports, Utilities) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ObserverMsg = (function () {
        function ObserverMsg() {
        }
        return ObserverMsg;
    }());
    exports.ObserverMsg = ObserverMsg;
    var Observerable = (function () {
        function Observerable() {
            this.StateTable = [];
            this.Id = Utilities.Guid.NewId();
        }
        /**
         * 设置状态 如果有改变 会自动notice
         * @param type
         * @param value
         */
        Observerable.prototype.SetState = function (type, value) {
            if (value) {
                var state = this.StateTable.filter(function (s) { return s.type == type; })[0];
                if (state) {
                    if (value !== state.value) {
                        //change
                    }
                }
                else {
                    this.StateTable.push(state);
                    //change
                }
            }
        };
        Observerable.prototype.GetState = function (type) {
            var state = this.StateTable.filter(function (s) { return s.type == type; })[0];
            if (state)
                return state.value;
        };
        Observerable.prototype.Bind = function (type, fn, ownObj) {
            var otherData = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                otherData[_i - 3] = arguments[_i];
            }
            throw new Error("Method not implemented.");
        };
        Observerable.prototype.Once = function (type, fn, ownObj) {
            var otherData = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                otherData[_i - 3] = arguments[_i];
            }
            throw new Error("Method not implemented.");
        };
        return Observerable;
    }());
    exports.Observerable = Observerable;
});
