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
define(["require", "exports", "../DataStructures/LinkList"], function (require, exports, DS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MediaNode = (function (_super) {
        __extends(MediaNode, _super);
        function MediaNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return MediaNode;
    }(DS.LNode));
    var Mediator = (function () {
        function Mediator() {
            this.Storage = [];
        }
        Mediator.prototype.Register = function (id, fn, type) {
            var item = this.Storage.filter(function (s) { return s.Id === id; })[0];
            if (!item) {
                item = new DS.LinkList();
                item.Id = id;
                this.Storage.push(item);
            }
            var newItem = new MediaNode();
            newItem.Type = type;
            newItem.Data = fn;
            item.Add(newItem);
        };
        Mediator.prototype.Change = function (id, type) {
            var item = this.Storage.filter(function (s) { return s.Id === id; })[0];
            if (item)
                item.ForEach(function (i) {
                    if (type && i.Type != type)
                        return;
                    i.Data();
                });
        };
        Mediator.prototype.Unregister = function (id, fn, type) {
            var item = this.Storage.filter(function (s) { return s.Id === id; })[0];
            if (item)
                item.Del_ByData(fn);
        };
        return Mediator;
    }());
    exports.Mediator = Mediator;
});
