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
define(["require", "exports", "./VinciLayerBase"], function (require, exports, VinciLayerBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VinciModalLayer = (function (_super) {
        __extends(VinciModalLayer, _super);
        function VinciModalLayer(element, options) {
            var _this = this;
            var ele = element || document.createElement("div");
            ele.classList.add("modal-backdrop");
            ele.classList.add("fade");
            ele.classList.add("in");
            if (options && options.opacity)
                ele.style.opacity = options.opacity.toString();
            _this = _super.call(this, ele, options) || this;
            return _this;
        }
        return VinciModalLayer;
    }(VinciLayerBase_1.VinciLayerBase));
    exports.VinciModalLayer = VinciModalLayer;
});
