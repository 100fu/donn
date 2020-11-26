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
define(["require", "exports", "./../VinciWidget"], function (require, exports, VinciWidget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VinciEditorBase = (function (_super) {
        __extends(VinciEditorBase, _super);
        function VinciEditorBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        VinciEditorBase.prototype.GetValue = function () {
            return this.Element.dataset.value;
        };
        VinciEditorBase.prototype.SetValue = function (value) {
            this.Element.dataset.value = value;
        };
        VinciEditorBase.prototype.Value = function (value) {
            if (value === undefined)
                return this.GetValue();
            else
                this.SetValue(value);
        };
        return VinciEditorBase;
    }(VinciWidget_1.VinciWidget));
    exports.VinciEditorBase = VinciEditorBase;
});
