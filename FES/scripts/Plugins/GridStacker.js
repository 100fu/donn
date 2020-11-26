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
define(["require", "exports", "./../Patterns/ObserverableWithMediator"], function (require, exports, ObserverableWithMediator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * GridStacker 需要引用第三方库 gridstack.min.js including jquery。。。
     */
    var GridStacker = (function (_super) {
        __extends(GridStacker, _super);
        function GridStacker(Element) {
            var _this = _super.call(this) || this;
            _this.Element = Element;
            _this._edited = false;
            _this.Items = [];
            _this.Coms = [];
            _this.Events = { DropItem: "DropItem" };
            Element.classList.add("grid-stack");
            //$(Element).before($("<div class='trashCan' style='height:120px;background-color:#d5dea3;margin:10px;'><i class='fa fa- trash' aria-hidden='true'></i></div>").hide())
            $(Element).gridstack({
                //removable: ".trashCan",
                cellHeight: 80,
                verticalMargin: 10
            }).on("change", function (e, items) {
                if (!items)
                    return;
                items.forEach(function (i) {
                    var b = _this.Items.filter(function (e) { return e.id == i.id; })[0];
                    if (b) {
                        b.x = i.x;
                        b.y = i.y;
                        b.w = i.width;
                        b.h = i.height;
                    }
                });
            }).on("enable", function (e) {
            }).on("disable", function (e) {
            });
            return _this;
            //.on('removed', (e, items) => {
            //    if (!items) return;
            //    items.forEach(i => {
            //        let b = this.Coms.filter(e => e.sign == i.id)[0]
            //        b.DropIntoTrashCan();
            //    });
            //});
        }
        Object.defineProperty(GridStacker.prototype, "Edited", {
            get: function () {
                return this._edited;
            },
            set: function (v) {
                if (v === this._edited)
                    return;
                var gs = $(this.Element).data("gridstack");
                if (v) {
                    $(this.Element).find(".fa-trash").show();
                    gs.enable();
                }
                if (!v) {
                    $(this.Element).find(".fa-trash").hide();
                    gs.disable();
                }
                this._edited = v;
            },
            enumerable: true,
            configurable: true
        });
        GridStacker.prototype.RegistCom = function (com) {
            this.Coms.push(com);
            com.Element.addEventListener("click", this.AddWidget.bind(this, com, 0, 0, 4, 4));
        };
        GridStacker.prototype.DropItem = function (id) {
            if (!id) {
                console.log("GridStacker.Remove:id is " + id);
                return false;
            }
            var i = this.Coms.filter(function (c) { return c.sign == id; })[0];
            if (!i) {
                console.log("GridStacker.Remove:conresponded com is " + i);
                return false;
            }
            this.SetState(this.Events.DropItem, i);
            var index = this.Items.indexOf(this.Items.filter(function (i) { return i.id == id; })[0]);
            if (index >= 0)
                this.Items.splice(index, 1);
            i.DropIntoTrashCan();
        };
        GridStacker.prototype.Destroy = function () {
            //DragenterEvent
            //DragendEvent
            //Draggable components Destroion
            $(this.Element).data("gridstack").destory();
        };
        /**
         * ToString done
         */
        GridStacker.prototype.ToString = function () {
            return JSON.stringify(this.Items);
        };
        GridStacker.prototype.AddWidget = function (el, x, y, w, h, ap) {
            var _this = this;
            if (ap === void 0) { ap = true; }
            if (this.Items.filter(function (i) { return i.id == el.sign; })[0])
                return;
            var item = document.createElement("div");
            if (el.Element.parentElement)
                el.Element.parentElement.removeChild(el.Element);
            var content = document.createElement("div");
            item.appendChild(content);
            content.classList.add("grid-stack-item-content");
            content.appendChild(el.ComponentEntity());
            var it = $(this.Element).data("gridstack").addWidget(item, x, y, w, h, ap, undefined, undefined, undefined, undefined, el.sign);
            $("<i class='fa fa-trash fa-2x' style='cursor:pointer;right:10px;position:absolute;color: gray;' aria-hidden='true'></i>")[this.Edited ? "show" : "hide"]().on("click", function (e) {
                e.preventDefault();
                $(_this.Element).data("gridstack").removeWidget(it);
                _this.DropItem(it.data("gsId"));
            }).appendTo(it);
            this.Items.push({ x: it.data("gsX"), y: it.data("gsY"), h: it.data("gsHeight"), w: it.data("gsWidth"), id: el.sign });
        };
        /**
         * ScriptAnalysis done
         * @param str rows be splited by ";""
         */
        GridStacker.prototype.ScriptAnalysis = function (str) {
            var _this = this;
            var gs = $(this.Element).data("gridstack");
            gs.removeAll();
            var array = JSON.parse(str);
            if (array)
                this.Items = [];
            array.forEach(function (i) {
                var item = _this.Coms.filter(function (c) { return c.sign == i.id; })[0];
                //let item = Composit.Get((c: Draggable) => c.sign == i.id) as Draggable;
                if (item) {
                    _this.AddWidget(item, i.x, i.y, i.w, i.h, false);
                }
            });
            gs.disable();
            return true;
        };
        return GridStacker;
    }(ObserverableWithMediator_1.ObserverableWMediator));
    exports.GridStacker = GridStacker;
});
