define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
    * singleton
    * @param fn {Function|ObjectConstructor}
    * @param isClass
    * @param classArgs
    */
    exports.Singleton = function (fn, isClass) {
        var classArgs = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            classArgs[_i - 2] = arguments[_i];
        }
        var result;
        if (isClass)
            return function () {
                return result || (result = new fn(classArgs));
            };
        return function () {
            return result || (result = fn.apply(this, classArgs));
        };
    };
});
