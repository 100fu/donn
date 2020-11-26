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
define(["require", "exports", "./../FES/scripts/Plugins/DraggableComponent", "../FES/scripts/Utilities/DocHelper"], function (require, exports, DraggableComponent_1, DocHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //TODO remove DEMO need them
    DocHelper_1.CssHelper.Load("/Resource/Scripts/Kendo/Style/kendo.common.min.css");
    DocHelper_1.CssHelper.Load("/Resource/Scripts/Kendo/Style/kendo.metro.min.css");
    DocHelper_1.CssHelper.Load("/Resource/Styles/eap.css");
    DocHelper_1.CssHelper.Load("/Resource/Styles/eap.kendo.css");
    var btn = document.createElement("button");
    btn.innerText = "button1";
    var e1 = document.createElement("div");
    e1.innerHTML = "Overflowing text to show scroll behavior\
Cras mattis consectetur purus sit amet fermentum.Cras justo odio, dapibus ac facilisis in, egestas eget quam.Morbi leo risus, porta ac consectetur ac, vestibulum at eros.\
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.\
Aenean lacinia bibendum nulla sed consectetur.Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Donec sed odio dui.Donec ullamcorper nulla non metus auctor fringilla.\
Cras mattis consectetur purus sit amet fermentum.Cras justo odio, dapibus ac facilisis in, egestas eget quam.Morbi leo risus, porta ac consectetur ac, vestibulum at eros.\
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.\
Aenean lacinia bibendum nulla sed consectetur.Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Donec sed odio dui.Donec ullamcorper nulla non metus auctor fringilla.\
Cras mattis consectetur purus sit amet fermentum.Cras justo odio, dapibus ac facilisis in, egestas eget quam.Morbi leo risus, porta ac consectetur ac, vestibulum at eros.\
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.\
Aenean lacinia bibendum nulla sed consectetur.Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Donec sed odio dui.Donec ullamcorper nulla non metus auctor fringilla.";
    exports.Code1 = new DraggableComponent_1.Draggable(btn, "button1", { Element: e1 });
    var btn1 = document.createElement("button");
    btn1.innerText = "button2";
    var e2 = document.createElement("div");
    e2.innerHTML = e1.innerHTML;
    exports.Code2 = new DraggableComponent_1.Draggable(btn1, "button2", { Element: e2 });
    var TodoPlansController = (function (_super) {
        __extends(TodoPlansController, _super);
        function TodoPlansController(classType) {
            var _this = this;
            var w = document.createElement("div");
            w.style.height = "100%";
            _this = _super.call(this, classType || EAP.UI.AGrid, w, EAP.UI.DefaultLayout.singleTable) || this;
            return _this;
        }
        TodoPlansController.prototype.configOptions = function (options) {
            options.entityId = 'Donn.EAM.MP.Entity.MPlans';
            options.serviceId = 'Donn.EAM.MP.Interface.IMPlansService';
            options.gridOption = new EAP.UI.GridOption();
            options.gridOption.gridSolutionId = "0b1761e2-ebf7-41cf-bafd-0095b415a565";
            //options.gridOption.columns = [{ field: "Asset.Name", template: () =>"Asset.Name" }, { field: "Source" }, { field: "TaskDescription" }]
        };
        return TodoPlansController;
    }(EAP.UI.BaseController));
    exports.TodoPlansController = TodoPlansController;
    var btn3 = document.createElement("button");
    btn3.innerText = "TodoPlans";
    exports.TodoPlans = new DraggableComponent_1.Draggable(btn3, "TodoPlans");
    var todoPlans;
    exports.TodoPlans.ComponentEntity = function () {
        if (!todoPlans)
            todoPlans = new TodoPlansController();
        return todoPlans.element;
    };
    var btn4 = document.createElement("button");
    btn4.innerText = "TodoPlans2";
    exports.TodoPlans2 = new DraggableComponent_1.Draggable(btn4, "TodoPlans2");
    var todoPlans2;
    exports.TodoPlans2.ComponentEntity = function () {
        if (!todoPlans2)
            todoPlans2 = new TodoPlansController();
        return todoPlans2.element;
    };
    var btn5 = document.createElement("button");
    btn5.innerText = "TodoPlans3";
    exports.TodoPlans3 = new DraggableComponent_1.Draggable(btn5, "TodoPlans3");
    var todoPlans3;
    exports.TodoPlans3.ComponentEntity = function () {
        if (!todoPlans3)
            todoPlans3 = new TodoPlansController();
        return todoPlans3.element;
    };
});
