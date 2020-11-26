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
define(["require", "exports", "../Patterns/Composit"], function (require, exports, Patterns) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Draggable; this is a container
     */
    var Draggable = (function (_super) {
        __extends(Draggable, _super);
        /**
         *
         * @param Element showning draggable handler
         * @param sign unique mark for saving
         * @param component real showing content
         */
        function Draggable(Element, sign, component) {
            var _this = _super.call(this) || this;
            _this.Element = Element;
            _this.sign = sign;
            _this.component = component;
            _this.SpanBtns = [{ text: "1/4", value: 3 }, { text: "1/3", value: 4 }, { text: "1/2", value: 6 }, { text: "1", value: 12 }];
            _this.Events = {
                DragStart: "DragStart"
            };
            _this.Span = 12;
            _this.Wrapper = document.createElement("div");
            _this.Wrapper.draggable = true;
            _this.Wrapper.addEventListener("dragstart", _this.DragStartEvent = _this.Dragstart.bind(_this));
            _this.Wrapper.addEventListener("mouseover", _this.MouseOver.bind(_this));
            _this.Wrapper.addEventListener("mouseleave", _this.MouseLeave.bind(_this));
            if (component && component.Element) {
                component.Element.draggable = true;
                component.Element.addEventListener("dragstart", _this.DragStartEvent = _this.Dragstart.bind(_this));
            }
            if (_this.Element.parentNode) {
                _this.Element.parentNode.insertBefore(_this.Wrapper, _this.Element);
            }
            _this.Wrapper.appendChild(_this.Element);
            _this.Wrapper.dataset["Draggable"] = _this.Id;
            return _this;
        }
        Draggable.prototype.Destroy = function () {
            if (this.component) {
                if (this.component.Destroy)
                    this.component.Destroy();
                delete this.component;
            }
            var components = this.Element.querySelectorAll(""); //TODO destory them
            _super.prototype.Destroy.call(this);
        };
        Draggable.prototype.Dragstart = function (e) {
            e.dataTransfer.setData("Id", this.Id);
            e.dataTransfer.dropEffect = "move";
            this.SetState(this.Events.DragStart);
        };
        Draggable.prototype.MouseOver = function (e) {
            var _this = this;
            if (this.Wrapper.querySelector(".tooltip"))
                return;
            var tooltip = document.createElement("div");
            tooltip.style.opacity = "1";
            tooltip.classList.add("tooltip");
            tooltip.classList.add("bs-tooltip-bottom");
            tooltip.classList.add("bs-tooltip-bottom-docs");
            tooltip.setAttribute("role", "tooltip");
            var arrow = document.createElement("div");
            arrow.classList.add("arrow");
            tooltip.appendChild(arrow);
            var inner = document.createElement("div");
            inner.classList.add("tooltip-inner");
            this.SpanBtns.forEach(function (b) {
                var btn = document.createElement("a");
                btn.dataset["value"] = b.value.toString();
                btn.innerText = b.text;
                btn.href = "javascript:void(0);";
                inner.appendChild(document.createTextNode(" "));
                inner.appendChild(btn);
            });
            inner.addEventListener("click", function (e) {
                var target = e.target;
                if (target instanceof HTMLAnchorElement) {
                    _this.Span = parseInt(target.dataset["value"]);
                    _this.MouseLeave(e);
                }
            });
            tooltip.appendChild(inner);
            this.Wrapper.appendChild(tooltip);
        };
        Draggable.prototype.MouseLeave = function (e) {
            var tooltip;
            if (tooltip = this.Wrapper.querySelector(".tooltip"))
                this.Wrapper.removeChild(tooltip);
        };
        /**
         * real darggable component entity --done
         */
        Draggable.prototype.ComponentEntity = function () {
            if (this.component)
                return this.component.Element;
            else
                return this.Wrapper;
        };
        Draggable.prototype.DropIntoTrashCan = function () {
        };
        return Draggable;
    }(Patterns.Composit));
    exports.Draggable = Draggable;
    // interface DraggableToolbarEventsMap{
    //     "OnEdit"
    // }
    var DraggableToolbar = (function (_super) {
        __extends(DraggableToolbar, _super);
        function DraggableToolbar(Element) {
            var _this = _super.call(this) || this;
            _this.Element = Element;
            _this.Events = {
                OnEdit: "OnEdit",
                OnSave: "OnSave",
                OnDroped: "OnDroped",
            };
            _this.Initialize();
            return _this;
        }
        /**
         * Initialize
         */
        DraggableToolbar.prototype.Initialize = function () {
            var _this = this;
            this.Element.style.height = "3em";
            this.Element.innerHTML = "";
            var Button = document.createElement("button");
            Button.type = "button";
            Button.innerText = "Edit";
            Button.onclick = function (e) {
                var btn = e.target;
                if (btn.classList.contains("btn-primary")) {
                    btn.classList.remove("btn-primary");
                    btn.classList.add("btn-success");
                    btn.innerText = "Save";
                    _this.SetState(_this.Events.OnEdit);
                    _this.Element.querySelector(".RemoveArea").addEventListener("dragover", _this.DragOverEventHander || (_this.DragOverEventHander = _this.DragOverEvent.bind(_this)), false);
                    _this.Element.querySelector(".RemoveArea").addEventListener("drop", _this.DropEventHander || (_this.DropEventHander = _this.DropEvent.bind(_this)), false);
                }
                else {
                    _this.SaveScript();
                    btn.classList.remove("btn-success");
                    btn.classList.add("btn-primary");
                    btn.innerText = "Edit";
                    _this.SetState(_this.Events.OnSave);
                    _this.Element.querySelector(".RemoveArea").removeEventListener("dragover", _this.DragOverEventHander);
                    _this.Element.querySelector(".RemoveArea").removeEventListener("drop", _this.DropEventHander);
                }
            };
            Button.classList.add("btn", "btn-primary", "float-left", "btn-sm", "align-middle");
            this.Element.appendChild(Button);
            var RemoveArea = document.createElement("div");
            RemoveArea.classList.add("float-right", "border", "border-danger", "RemoveArea");
            RemoveArea.style.width = "4em";
            RemoveArea.style.height = "3em";
            this.Element.appendChild(RemoveArea);
        };
        DraggableToolbar.prototype.DropEvent = function (e) {
            e.preventDefault();
            var id = e.dataTransfer.getData("Id"), com = Patterns.Composit.Get(id), ele = com.ComponentEntity();
            //1. the target is draggable.element
            //need to return it's origin place
            if (ele == com.Wrapper) {
                //TODO 
                return;
            }
            //2. the target is created component, and just exist only instance.
            ele.parentElement.removeChild(ele);
            //3. the target is created component, but it is copy of the instance.
            //TODO 
        };
        DraggableToolbar.prototype.DragOverEvent = function (e) {
            e.preventDefault();
        };
        DraggableToolbar.prototype.SaveScript = function () {
        };
        DraggableToolbar.prototype.Destroy = function () {
            if (this.Element.parentElement)
                this.Element.parentElement.removeChild(this.Element);
        };
        return DraggableToolbar;
    }(Patterns.Composit));
    exports.DraggableToolbar = DraggableToolbar;
    var DraggableContainer = (function (_super) {
        __extends(DraggableContainer, _super);
        function DraggableContainer(Element, script) {
            var _this = _super.call(this) || this;
            _this.Element = Element;
            _this._edited = false;
            _this.ColSpan = 12;
            _this.UnitMark = false;
            _this.RowHeight = 180;
            _this.SpanExt = new RegExp(/col-\d+|col-sm-\d+|col-md-\d+|col-lg-\d+|col-xl-\d+/);
            Element.classList.add("DraggableContainer");
            if (script) {
                _this.ScriptAnalysis(script);
            }
            return _this;
        }
        Object.defineProperty(DraggableContainer.prototype, "Edited", {
            get: function () {
                return this._edited;
            },
            set: function (v) {
                if (v === this._edited)
                    return;
                if (v) {
                    if (!this.DragenterEvent)
                        this.Element.addEventListener("dragenter", this.DragenterEvent = this.Dragenter.bind(this), false);
                    if (!this.DropEvent)
                        this.Element.addEventListener("drop", this.DropEvent = this.Drop.bind(this), false);
                    if (!this.DragoverEvent)
                        this.Element.addEventListener("dragover", this.DragoverEvent = this.Dragover.bind(this), false);
                    this._edited = v;
                }
                if (!v && this.HideAndRemoveRow()) {
                    this.Element.removeEventListener("dragenter", this.DragenterEvent);
                    this.Element.removeEventListener("drop", this.DropEvent);
                    this.Element.removeEventListener("dragover", this.DragoverEvent);
                    this._edited = v;
                }
            },
            enumerable: true,
            configurable: true
        });
        DraggableContainer.prototype.RegistCom = function (com) {
            var _this = this;
            com.Bind("DragStart", function (msg) {
                if (!_this.Edited)
                    return;
                /**
                * 目前因为 GragEnter 中 dataTranfer.getData()无法使用
                */
                var com = Patterns.Composit.Get(msg.Sender.Id);
                _this.ColSpan = com.Span;
                _this.ShowAndCreateRow();
            });
        };
        /**
         * Dragenter Event
         * @param e
         */
        DraggableContainer.prototype.Dragenter = function (e) {
            e.preventDefault();
            //let id=e.dataTransfer.getData("text/plain");
            //get component coincide with e.dataTransfer ["Id"]
        };
        DraggableContainer.prototype.Dragover = function (e) {
            e.preventDefault();
            // e.dataTransfer.dropEffect = "move"
        };
        DraggableContainer.prototype.Drop = function (e) {
            this.UnitMark = true;
            e.preventDefault();
            var target = e.target;
            if (!target.classList.contains("DC-Col"))
                target = target.parentElement;
            if (target.classList.contains("DC-Col") && !target.classList.contains("full")) {
                var com = Patterns.Composit.Get(e.dataTransfer.getData("Id")), ext = new RegExp(/col-\d+|col-sm-\d+|col-md-\d+|col-lg-\d+|col-xl-\d+/), ms = target.getAttribute("class").match(ext), span = parseInt(ms[0].match(/\d+/)[0]);
                if (span != com.Span)
                    return;
                var ele = com.ComponentEntity();
                this.MoveOut(ele.parentElement, ele);
                this.MoveIn(target, ele);
                this.ShowAndCreateRow();
            }
            this.UnitMark = false;
        };
        DraggableContainer.prototype.DragEnd = function (target, e) {
            if (this.UnitMark)
                return;
            var source = e.target;
            if (target.classList.contains("full") && !target.contains(source)) {
                this.MoveOut(target, source);
                this.ShowAndCreateRow();
            }
            console.log("end");
            source.removeEventListener("dragend", this.DragendHandler);
        };
        DraggableContainer.prototype.MoveIn = function (target, source) {
            target.innerHTML = "";
            target.appendChild(source);
            //add one-off drapend for ele
            console.log("drop");
            source.removeEventListener("dragend", this.DragendHandler);
            source.addEventListener("dragend", this.DragendHandler || (this.DragendHandler = this.DragEnd.bind(this, target)));
            target.classList.add("full");
            this.SetRowClass(target.parentElement);
        };
        DraggableContainer.prototype.MoveOut = function (target, source) {
            if (target && target.classList.contains("DC-Col")) {
                target.classList.remove("full");
                this.SetRowClass(target.parentElement);
            }
        };
        /**
         * 根据情况设置Row的类
         */
        DraggableContainer.prototype.SetRowClass = function (row) {
            var sub = row.querySelector(".full");
            if (sub)
                row.classList.remove("empty");
            else
                row.classList.add("empty");
        };
        DraggableContainer.prototype.Destroy = function () {
            //DragenterEvent
            //DragendEvent
            //Draggable components Destroion
            _super.prototype.Destroy.call(this);
        };
        /**
         * 再最底层始终保持有两排空的 done
         */
        DraggableContainer.prototype.ShowAndCreateRow = function () {
            //existing layer show --done
            var rows = this.Element.getElementsByClassName("row"), len = rows.length;
            for (var index = 0; index < len; index++) {
                var r = rows[index];
                var sign = 0, subDiv = r.querySelector(".DC-Col:not(.full)"), arry = [];
                while (subDiv) {
                    arry.push(subDiv);
                    var ms = subDiv.getAttribute("class").match(this.SpanExt), span = parseInt(ms[0].match(/\d+/)[0]), next = subDiv.nextSibling;
                    sign += span;
                    if (!next || next.classList.contains("full")) {
                        if (sign >= this.ColSpan) {
                            while (arry.length)
                                r.removeChild(arry.pop());
                            while (sign >= this.ColSpan) {
                                sign -= this.ColSpan;
                                var newDiv = this.GenerateCol(this.ColSpan);
                                if (next)
                                    r.insertBefore(newDiv, next);
                                else
                                    r.appendChild(newDiv);
                            }
                        }
                        if (sign > 0) {
                            var newDiv = this.GenerateCol(sign);
                            if (next)
                                r.insertBefore(newDiv, next);
                            else
                                r.appendChild(newDiv);
                        }
                        arry = [];
                        sign = 0;
                    }
                    //skip full column
                    while (next && next.classList.contains("full")) {
                        next = subDiv.nextSibling;
                    }
                    subDiv = next;
                }
            }
            var l = this.Element.children.length;
            var rs = this.Element.querySelectorAll(".row:not(.empty)");
            if (rs.length > 0) {
                var nodes = Array.prototype.slice.call(this.Element.children);
                l = l - nodes.indexOf(rs[rs.length - 1]) - 1;
            }
            // if (last) {
            //     let nodes = Array.prototype.slice.call(this.Element.children);
            //     l = l - nodes.indexOf(last) - 1;
            // }
            //create new layer --done
            while (l < 2) {
                this.CreateNewRows(this.ColSpan);
                l++;
            }
            while (l > 2) {
                this.Element.removeChild(this.Element.lastElementChild);
                l--;
            }
            return true;
        };
        DraggableContainer.prototype.GenerateCol = function (ColSpan) {
            var subDiv = document.createElement("div");
            subDiv.classList.add("col-" + this.ColSpan);
            subDiv.classList.add("DC-Col");
            subDiv.style.height = "100%";
            subDiv.style.position = "relative";
            var border = document.createElement("div");
            border.classList.add("border", "border-success");
            border.style.borderStyle = "dotted";
            border.style.position = "absolute";
            border.style.top = "0";
            border.style.left = "0";
            border.style.bottom = "0";
            border.style.right = "0";
            border.classList.add("m-1");
            subDiv.appendChild(border);
            return subDiv;
        };
        DraggableContainer.prototype.HideAndRemoveRow = function () {
            //remove redundant rows  done
            while (this.Element.lastElementChild && this.Element.lastElementChild.classList.contains("empty")) {
                this.Element.removeChild(this.Element.lastElementChild);
            }
            //hide current layer --not need for present
            //subDiv.classList.add("border");
            // subDiv.classList.add("border-success");
            return true;
        };
        /**
         * ToString done
         */
        DraggableContainer.prototype.ToString = function () {
            this.HideAndRemoveRow();
            //genrate string of script
            var rows = this.Element.querySelectorAll(".row"), rl = rows.length, res = rows.length.toString(), s1 = "", s2 = "";
            for (var i = 0; i < rl; i++) {
                var r = rows[i];
                s1 += ";";
                s2 += ";";
                if (r.classList.contains("empty"))
                    return;
                var cols = r.querySelectorAll(".DC-Col"), cl = cols.length, a1 = [], a2 = [];
                for (var ci = 0; ci < cl; ci++) {
                    var c = cols[ci];
                    var ms = c.getAttribute("class").match(this.SpanExt), span = parseInt(ms[0].match(/\d+/)[0]);
                    a1.push(span);
                    if (c.classList.contains("full")) {
                        var id = c.firstChild.dataset["Draggable"];
                        a2.push(id);
                    }
                }
                s1 += a1.join(",");
                s2 += a2.join(",");
            }
            return res + s1 + "|" + s2.substr(1);
        };
        /**
         * ScriptAnalysis done
         * @param str rows be splited by ";""
         */
        DraggableContainer.prototype.ScriptAnalysis = function (str) {
            var l1 = str.split("|"), rN, rows, strRCom = l1[1].split(";");
            rN = parseInt((rows = l1[0].split(";")).shift());
            if (rN != rows.length || rN != strRCom.length) {
                console.error("rN!=rows.length||rN!=strRCom.length");
                return false;
            }
            var _loop_1 = function (i) {
                var r = rows[i], rc = strRCom[i], rowEle = this_1.CreateNewRows(r.split(",")), colEles = rowEle.querySelectorAll(".DC-Col");
                rc.split(",").forEach(function (id, index) {
                    if (!id)
                        return;
                    var com = Patterns.Composit.Get(function (c) { return c.sign == id; })[0];
                    var ele = com.ComponentEntity();
                    colEles[index].appendChild(ele);
                    colEles[index].classList.add("full");
                });
                this_1.SetRowClass(rowEle);
            };
            var this_1 = this;
            for (var i = 0; i < rows.length; i++) {
                _loop_1(i);
            }
            return true;
        };
        DraggableContainer.prototype.CreateNewRows = function (ColSpan) {
            var div = document.createElement("div");
            div.classList.add("row");
            div.classList.add("empty");
            div.style.height = this.RowHeight + "px";
            var count = Math.floor(12 / ((typeof ColSpan === "number") ? ColSpan : ColSpan.length));
            for (var i = 0; i < count; i++) {
                div.appendChild(this.GenerateCol(((typeof ColSpan === "number") ? ColSpan : parseInt(ColSpan[i]))));
            }
            this.Element.appendChild(div);
            return div;
        };
        return DraggableContainer;
    }(Patterns.Composit));
    exports.DraggableContainer = DraggableContainer;
});
