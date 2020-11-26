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
define(["require", "exports", "./VinciEditorBase"], function (require, exports, VinciEditorBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VinciInput = (function (_super) {
        __extends(VinciInput, _super);
        function VinciInput(element, options) {
            var _this = this;
            var elem = element;
            if (!elem) {
                elem = document.createElement("input");
                elem.type = "text";
            }
            if (!elem.classList.contains("form-control"))
                elem.classList.add("form-control");
            _this = _super.call(this, elem, options) || this;
            elem.addEventListener("change", _this.InputChangeEvent || (_this.InputChangeEvent = _this.ValueChanged.bind(_this)));
            return _this;
        }
        VinciInput.prototype.SetValue = function (value) {
            this.Element.value = value;
            _super.prototype.SetValue.call(this, value);
        };
        VinciInput.prototype.ValueChanged = function (e) {
            var value = e.target.value;
            _super.prototype.SetValue.call(this, value);
        };
        VinciInput.prototype.Destroy = function () {
            if (this.InputChangeEvent) {
                this.Element.removeEventListener(this.InputChangeEvent);
                delete this.InputChangeEvent;
            }
            _super.prototype.Destroy.call(this);
        };
        return VinciInput;
    }(VinciEditorBase_1.VinciEditorBase));
    exports.VinciInput = VinciInput;
});
