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
define(["require", "exports", "./ObserverableWithMediator", "./../Utilities/Guid"], function (require, exports, ObserverableWithMediator_1, Utilities) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Composit = (function (_super) {
        __extends(Composit, _super);
        function Composit() {
            var _this = _super.call(this) || this;
            _this.Children = [];
            Composit.Coms.push(_this);
            return _this;
        }
        /**
         * Get
         * @param filter can be Id or filter function
         */
        Composit.Get = function (filter) {
            return this.GetViaFunction((typeof filter === "string") ? function (c) { return c.Id == filter; } : filter)[0];
        };
        Composit.GetViaFunction = function (fn) {
            return this.Coms.filter(function (c) { return fn(c); });
        };
        Composit.prototype.Add = function (Obj) {
            Obj.Parent = Obj;
            if (!this.GetChild(Obj.Id))
                this.Children.push(Obj);
            return Obj;
        };
        Composit.prototype.Remove = function (Obj) {
            if (!Obj)
                return;
            return this.Children.splice(this.Children.indexOf(Obj), 1)[0];
        };
        Composit.prototype.GetChild = function (id) {
            if (!Utilities.Guid.Validate(id)) {
                console.log("id:" + id + " is not valid Guid ");
                return;
            }
            return this.Children.filter(function (c) { return c.Id == id; })[0];
        };
        Composit.prototype.Destroy = function () {
            if (this.Parent) {
                this.Parent.Remove(this);
                delete this.Parent;
            }
            if (this.Children) {
                this.Children.forEach(function (c) { c.Parent = undefined; c.Destroy(); });
                delete this.Children;
            }
        };
        return Composit;
    }(ObserverableWithMediator_1.ObserverableWMediator));
    Composit.Coms = [];
    exports.Composit = Composit;
});
