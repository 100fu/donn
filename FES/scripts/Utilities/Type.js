define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var class2type = {};
    "Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function (s) {
        class2type["[ object " + s + " ]"] = s.toLowerCase();
    });
    exports.ToString = class2type.toString;
    exports.Type = function (obj) {
        if (obj == null) {
            return String(obj);
        }
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[exports.ToString.call(obj)] || "object" :
            typeof obj;
    };
});
