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
define(["require", "exports", "../VinciWidget"], function (require, exports, VinciWidget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VinciLayerBase = (function (_super) {
        __extends(VinciLayerBase, _super);
        function VinciLayerBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        VinciLayerBase.prototype.Open = function () {
            if (!this.Wrapper.parentNode)
                document.body.appendChild(this.Wrapper);
            this.Wrapper.style.display = "block";
        };
        VinciLayerBase.prototype.Close = function () {
            this.Wrapper.style.display = "none";
        };
        return VinciLayerBase;
    }(VinciWidget_1.VinciWidget));
    exports.VinciLayerBase = VinciLayerBase;
});
