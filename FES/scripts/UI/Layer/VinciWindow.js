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
define(["require", "exports", "./VinciLayerBase", "./VinciModalLayer"], function (require, exports, VinciLayerBase_1, VinciModalLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VinciWindow = (function (_super) {
        __extends(VinciWindow, _super);
        function VinciWindow(element, options) {
            return _super.call(this, element, options) || this;
        }
        Object.defineProperty(VinciWindow.prototype, "DefaultOptions", {
            get: function () {
                return { AutoDestory: true, Title: "My modal Window" }; //,Align:"center"
            },
            enumerable: true,
            configurable: true
        });
        /**
         * need to satisfiy rebuiding of widget.
         */
        VinciWindow.prototype.Initialization = function () {
            if (this.MODELLAYER) {
                var c = this.Remove(this.GetChild(this.MODELLAYER));
                if (c)
                    c.Destroy();
            }
            this.MODELLAYER = this.Add(new VinciModalLayer_1.VinciModalLayer(undefined, { opacity: 0.4 })).Id;
            if (this.Wrapper.parentNode)
                this.Wrapper.parentNode.removeChild(this.Wrapper);
            this.Wrapper = document.createElement("div");
            this.Wrapper.style.color = "black";
            var dialog = document.createElement("div");
            dialog.classList.add("modal-dialog");
            var content = document.createElement("div");
            dialog.appendChild(content);
            content.classList.add("modal-content");
            content.appendChild(this.GenerateHeader());
            content.appendChild(this.GenerateContent());
            content.appendChild(this.GenerateFoot());
            this.Wrapper.appendChild(dialog);
            this.Wrapper.classList.add("center-block"); //default Align:"center"
            this.Wrapper.classList.add("modal"); //animation need fade
            this.Wrapper.classList.add("in"); //animation need fade
        };
        VinciWindow.prototype.GenerateHeader = function () {
            var header = document.createElement("div");
            header.classList.add("modal-header");
            var h4 = document.createElement("h4");
            h4.classList.add("modal-title");
            h4.innerText = this.Options.Title;
            header.appendChild(h4);
            var button = document.createElement("button");
            button.type = "button";
            button.classList.add("close");
            button.setAttribute("aria-label", "Close");
            button.innerHTML = '<span aria-hidden="true">&times;</span>';
            button.onclick = this.Close.bind(this);
            header.appendChild(button);
            return header;
        };
        VinciWindow.prototype.GenerateContent = function () {
            var content = document.createElement("div");
            content.appendChild(this.Element);
            content.classList.add("modal-body");
            return content;
        };
        VinciWindow.prototype.GenerateFoot = function () {
            var foot = document.createElement("div");
            foot.classList.add("modal-footer");
            return foot;
        };
        VinciWindow.prototype.Open = function () {
            this.GetChild(this.MODELLAYER).Open();
            _super.prototype.Open.call(this);
        };
        VinciWindow.prototype.Close = function () {
            _super.prototype.Close.call(this);
            this.GetChild(this.MODELLAYER).Close();
            if (this.Options.AutoDestory)
                this.Destroy();
        };
        return VinciWindow;
    }(VinciLayerBase_1.VinciLayerBase));
    exports.VinciWindow = VinciWindow;
});
