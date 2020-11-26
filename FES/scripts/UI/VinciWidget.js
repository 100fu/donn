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
define(["require", "exports", "../Patterns/Composit", "./../Utilities/Extend"], function (require, exports, Patterns, Utilities) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VinciWidget = (function (_super) {
        __extends(VinciWidget, _super);
        function VinciWidget(Element, Options) {
            if (Options === void 0) { Options = {}; }
            var _this = _super.call(this) || this;
            _this.Element = Element;
            _this.Options = Options;
            _this.Wrapper = _this.Element;
            Utilities.Extend(_this.Options, _this.DefaultOptions);
            var className = _this.constructor["name"];
            Element.dataset[className] = _this.Id;
            _this.Initialization();
            return _this;
        }
        Object.defineProperty(VinciWidget.prototype, "DefaultOptions", {
            get: function () {
                return {};
            },
            enumerable: true,
            configurable: true
        });
        /**
         * need to satisfiy rebuiding of widget.
         */
        VinciWidget.prototype.Initialization = function () {
        };
        VinciWidget.prototype.SetOptions = function (options) {
            Utilities.Extend(this.Options = options, this.DefaultOptions);
            this.Initialization();
        };
        /**
         * Destroy; Just concerning the chirlren regardless other component because this is a widget not container
         */
        VinciWidget.prototype.Destroy = function () {
            if (this.Wrapper.parentNode)
                this.Wrapper.parentNode.removeChild(this.Wrapper);
            delete this.Wrapper;
            delete this.Element;
            _super.prototype.Destroy.call(this);
        };
        return VinciWidget;
    }(Patterns.Composit));
    exports.VinciWidget = VinciWidget;
});
