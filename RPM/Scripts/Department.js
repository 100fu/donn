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
///<reference path="./../../Resource/Scripts/ts/Controller.ts"/>
var RPM;
(function (RPM) {
    var panelOptionDept = {
        panes: [{ collapsible: true, size: "30%" }, { collapsible: false, size: "70%" }]
    };
    $('#ContainerDept').kendoSplitter(panelOptionDept).data("kendoSplitter");
    var Department = (function (_super) {
        __extends(Department, _super);
        function Department(classType) {
            return _super.call(this, classType || EAP.UI.AGrid, document.getElementById("gridContainerView")) || this;
        }
        Department.prototype.configOptions = function (options) {
            var _this = this;
            options.filter = false;
            options.gridDataRequest = new EAP.UI.GridDataRequest();
            options.gridDataRequest.postdata = { uid: function () { return _this.nodeid; } };
            options.formOption = new EAP.UI.FormApplicationOption();
            // options.formOption.sourceData = { IdParent: "1a9eb330-792f-4281-85ee-ded7b2de62a9" }
            options.viewScheme = true;
            //options.formOption.columnsAmount = 2;
            this.initTree();
            this.setAssetTreeData();
        };
        Department.prototype.Refresh_Action = function (e) {
            this.methods.Refresh_Action(e);
            this.setAssetTreeData();
        };
        Department.prototype.Add_Action = function (e) {
            this.methods.Add_Action(e);
        };
        Department.prototype.initTree = function () {
            var _this = this;
            var that = this, treeOption = new EAP.UI.TreeOption();
            treeOption.nodeClick = function (e) {
                // let checkedIds = treeOption.getCheckedItems().ids;
                var uid = e.sender.dataItem(e.node).id;
                if (uid === '2018-08-25') {
                    _this.nodeid = undefined;
                }
                else {
                    _this.nodeid = uid;
                }
                //this.nodeid = e.sender.dataItem(e.node).id;     
                // alert(e.node.outerText + " " + this.nodeid);
                that.methods.Refresh_Action({ sender: _this.app });
            };
            treeOption.showCheckBox = false;
            treeOption.selector = "#assetPanel";
            that.treeControl = new EAP.UI.TreeControl(treeOption);
        };
        Department.prototype.setAssetTreeData = function () {
            var that = this;
            var clientMode = new System.Net.HttpClient();
            var urlPath = '/Graphic/GetDeptTree';
            clientMode.post(urlPath, "", function (data) {
                if (data.length > 0)
                    that.initData(data);
            });
        };
        Department.prototype.initData = function (data) {
            var that = this;
            if (data == undefined)
                return;
            that.treeControl.setTreeData(data);
            that.treeControl.expandall();
        };
        return Department;
    }(EAP.UI.BaseController));
    RPM.Department = Department;
})(RPM || (RPM = {}));
(function () {
    var vb = window["ViewBag"];
    var ctrl = new RPM.Department();
})();
//declare namespace EAP.UI {
//    export class GridApplication {
//        constructor(option: EAP.UI.GridApplicationOption)
//        Add(): void;
//        View(): void;
//        Edit(): void;
//        Delete(): void;
//        Refresh(): void;
//        Export(): void;
//        Import(): void;
//        Query(): void;
//        SaveView(): void;
//        saveFilterView(): void;
//        CustomShow(): void;
//        gridControl: GridControl
//        formOption: EAP.UI.FormOption
//        gridAppOption: EAP.UI.GridApplicationOption
//    }
//}
//var deptTreeControl = {}, selectRtEmpIds = [], rtEmpTags = [], reDevTags = [], isInOut = undefined;
//namespace RPM {
//    export class Department {
//        thisApp: EAP.UI.GridApplication
//        constructor(viewbag: EAP.UI.Core.IViewInfo) {
//            let panelOption = {
//                panes: [{ collapsible: true, size: "30%" }, { collapsible: false, size: "70%" }]
//            } as kendo.ui.SplitterOptions;
//            $('#Container').kendoSplitter(panelOption).data("kendoSplitter");
//            var tableOption = new EAP.UI.GridApplicationOption();
//            tableOption.entityId = viewbag.EntityId;
//            tableOption.viewCode = viewbag.ViewCode;
//            tableOption.serviceId = viewbag.ServiceId;
//            tableOption.funCode = viewbag.FunCode;
//            tableOption.filter = true;
//            tableOption.selector = "#gridContainerView";
//            tableOption.viewScheme = true;
//            tableOption.gridDataRequest = new EAP.UI.GridDataRequest();
//            tableOption.toolbarOption.owner = this;
//            tableOption.formOption.columnsAmount = 2;
//            this.thisApp = new EAP.UI.GridApplication(tableOption);
//        }
//        Add() {
//            this.thisApp.Add();
//        }
//        View() {
//            this.thisApp.View();
//        }
//        Edit() {
//            this.thisApp.Edit();
//        }
//        Delete() {
//            this.thisApp.Delete();
//        }
//    };
//}
//(function () {
//    var vb: EAP.UI.Core.IViewInfo = window["ViewBag"];
//    var ctrl = new RPM.Department(vb);
//})(); 
