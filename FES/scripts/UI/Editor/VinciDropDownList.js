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
define(["require", "exports", "./../../Utilities/DataSource", "./VinciEditorBase"], function (require, exports, Utilities, VinciEditorBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VinciDropDownList = (function (_super) {
        __extends(VinciDropDownList, _super);
        function VinciDropDownList(element, options) {
            return _super.call(this, element, options) || this;
        }
        Object.defineProperty(VinciDropDownList.prototype, "DefaultOptions", {
            get: function () {
                return { ValueField: "value", TextField: "text", DataSource: [] };
            },
            enumerable: true,
            configurable: true
        });
        VinciDropDownList.prototype.Initialization = function () {
            var _this = this;
            if (this.Wrapper == this.Element)
                this.Wrapper = document.createElement("div");
            if (!this.Wrapper.classList.contains("dropdown"))
                this.Wrapper.classList.add("dropdown");
            if (this.WrapperClickEvent)
                this.Wrapper.removeEventListener(this.WrapperClickEvent);
            this.Wrapper.addEventListener("click", this.WrapperClickEvent || (this.WrapperClickEvent = this.WrapperClick.bind(this)), true);
            this.Element.type = "button";
            this.Element.dataset.toggle = "dropdown";
            this.Element.setAttribute("aria-haspopup", "true");
            this.Element.setAttribute("aria-expanded", "false");
            if (!this.Element.querySelector(".caret"))
                this.Element.innerHTML += '<span class="caret"></span>';
            this.Element.parentElement.insertBefore(this.Wrapper, this.Element).appendChild(this.Element);
            var ul = this.Wrapper.querySelector("ul");
            if (!ul) {
                ul = document.createElement("ul");
                this.Wrapper.appendChild(ul);
            }
            if (!ul.classList.contains("dropdown-menu"))
                ul.classList.add("dropdown-menu");
            if (this.UlClickEvent)
                ul.removeEventListener(this.UlClickEvent);
            ul.addEventListener("click", this.UlClickEvent || (this.UlClickEvent = this.Selected.bind(this)), true);
            if (this.Options.DataSource instanceof Utilities.DataSource)
                this.DataSource = this.Options.DataSource;
            else
                this.DataSource = new Utilities.DataSource({ Data: this.Options.DataSource });
            this.DataSource.Success = function (e) { _this.GenerateUL(ul, e.Data); };
            this.DataSource.Read();
        };
        VinciDropDownList.prototype.GenerateUL = function (ul, data) {
            var _this = this;
            ul.innerHTML = "";
            (data || []).forEach(function (d) {
                var li = document.createElement("li");
                li.innerHTML = '<a href="javascript:void(0);">' + d[_this.Options.TextField] + '</a>';
                li.dataset.value = d[_this.Options.ValueField];
                li.dataset.source = d;
                ul.appendChild(li);
            });
            this.Options.TextField;
        };
        VinciDropDownList.prototype.WrapperClick = function (e) {
            var t = this.Wrapper;
            if (t.classList.contains("open"))
                t.classList.remove("open");
            else
                t.classList.add("open");
        };
        VinciDropDownList.prototype.Selected = function (e) {
            if (e.target instanceof HTMLLIElement) {
                var li = e.target;
            }
        };
        VinciDropDownList.prototype.Destroy = function () {
            if (this.UlClickEvent) {
                this.Wrapper.querySelector("ul").removeEventListener(this.UlClickEvent);
                delete this.UlClickEvent;
            }
            if (this.WrapperClickEvent) {
                this.Wrapper.removeEventListener(this.WrapperClickEvent);
                delete this.WrapperClickEvent;
            }
            if (this.DataSource)
                delete this.DataSource;
            _super.prototype.Destroy.call(this);
        };
        return VinciDropDownList;
    }(VinciEditorBase_1.VinciEditorBase));
    exports.VinciDropDownList = VinciDropDownList;
});
