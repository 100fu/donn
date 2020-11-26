///<reference path="./../../Resource/Scripts/ts/Controller.ts"/>
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
//namespace RPM {
//    class DutyInfo extends EAP.UI.BaseController {
//        constructor() {
//            super(EAP.UI.AGrid);
//        }
//        protected configOptions(options: EAP.UI.AGridOptions) {
//            let gOptions = new EAP.UI.GridOption();
//            gOptions.gridSolutionId = '721fa5b1-b530-44d1-bc48-c9d4be6b6ec8';  //栏目Id
//            options.gridOption = gOptions;
//            options.viewScheme = false;
//            options.filter = false;
//            super.configOptions(options);
//        }
//    };
//    new DutyInfo();
//}
//declare namespace EAP.UI {
//    export class GridApplications {
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
var deptTreeControl = {}, selectRtEmpIds = [], rtEmpTags = [], reDevTags = [], isInOut = undefined;
var RPM;
(function (RPM) {
    var panelOption = {
        panes: [{ collapsible: true, size: "30%" }, { collapsible: false, size: "70%" }]
    };
    $('#Container').kendoSplitter(panelOption).data("kendoSplitter");
    var DutyInfo = (function (_super) {
        __extends(DutyInfo, _super);
        function DutyInfo(classType) {
            return _super.call(this, classType || EAP.UI.AGrid, document.getElementById("gridContainerView")) || this;
        }
        DutyInfo.prototype.configOptions = function (options) {
            var _this = this;
            options.filter = false;
            options.viewScheme = true;
            options.gridDataRequest = new EAP.UI.GridDataRequest();
            options.gridDataRequest.postdata = { uid: function () { return _this.nodeid; } };
            //options.formOption.columnsAmount = 2;
            this.initTree();
            this.setAssetTreeData();
        };
        DutyInfo.prototype.Refresh_Action = function (e) {
            // console.log("refresh");
            this.methods.Refresh_Action(e);
            this.setAssetTreeData();
        };
        DutyInfo.prototype.initTree = function () {
            var _this = this;
            var that = this, treeOption = new EAP.UI.TreeOption();
            treeOption.showCheckBox = false;
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
            treeOption.selector = "#assetPane2";
            that.treeControl = new EAP.UI.TreeControl(treeOption);
        };
        DutyInfo.prototype.setAssetTreeData = function () {
            var that = this;
            var clientMode = new System.Net.HttpClient();
            // var urlPath = '/Graphic/GetDeptTree';
            var urlPath = '/Graphic/GetDutyInfoTree';
            clientMode.post(urlPath, "", function (data) {
                if (data.length > 0)
                    that.initData(data);
            });
        };
        DutyInfo.prototype.initData = function (data) {
            var that = this;
            //if (data == undefined)
            //    return;
            //var assetTree = [{ id: Guid.Empty, text: '所有职务', items: [], checked: false }];
            //$.each(data[0].items, function (i, n) {
            //    assetTree[0].items.push({ id: n.id, text: n.text, attributes: n.text });
            //});
            //that.treeControl.setTreeData(assetTree);
            that.treeControl.setTreeData(data);
            that.treeControl.expandall();
        };
        return DutyInfo;
    }(EAP.UI.BaseController));
    RPM.DutyInfo = DutyInfo;
    //export class DutyInfo extends BaseController{
    //    treeControl: any
    //    thisApp: EAP.UI.GridApplication
    //    constructor(viewbag: EAP.UI.Core.IViewInfo) {
    //        super()
    //        let panelOption = {
    //            panes: [{ collapsible: true, size: "30%" }, { collapsible: false, size: "70%" }]
    //        } as kendo.ui.SplitterOptions;
    //        $('#Container').kendoSplitter(panelOption).data("kendoSplitter");
    //        var tableOption = new EAP.UI.GridApplicationOption();
    //        tableOption.entityId = viewbag.EntityId;
    //        tableOption.viewCode = viewbag.ViewCode;
    //        tableOption.serviceId = viewbag.ServiceId;
    //        tableOption.funCode = viewbag.FunCode;
    //        tableOption.filter = false;
    //        tableOption.selector = "#gridContainerView";
    //        tableOption.viewScheme = true;
    //        tableOption.gridDataRequest = new EAP.UI.GridDataRequest();
    //        tableOption.toolbarOption.owner = this;
    //        tableOption.formOption.columnsAmount = 2;
    //        this.thisApp = new EAP.UI.GridApplication(tableOption);
    //        this.initTree();
    //        this.setAssetTreeData();
    //    }
    //    Add() {
    //        this.thisApp.Add();
    //    }
    //    View() {
    //        this.thisApp.View();
    //    }
    //    Edit() {
    //        this.thisApp.Edit();
    //    }
    //    Delete() {
    //        this.thisApp.Delete();
    //    }
    //    Refresh() {
    //        console.log("refresh");
    //        this.thisApp.Refresh();
    //        this.setAssetTreeData();
    //    }
    //    setAssetTreeData() {
    //        let that = this;
    //        var clientMode = new System.Net.HttpClient();
    //        // var urlPath = '/Graphic/GetDeptTree';
    //        var urlPath = '/Graphic/GetDutyInfoTree';
    //        clientMode.post(urlPath, "", function (data) {
    //            if (data.length > 0)
    //               that.initData(data);
    //        });           
    //    }
    //initData(data)
    //{
    //    let that = this;
    //    if (data == undefined)
    //        return;
    //    var assetTree = [{ id: Guid.Empty, text: '所有职务', items: [], checked: false }];
    //    $.each(data[0].items, function (i, n) {
    //        assetTree[0].items.push({ id: n.id, text: n.text, attributes: n.text});
    //    });
    //    that.treeControl.setTreeData(assetTree);
    //    that.treeControl.expandall();
    //}
    //    initTree() {
    //        let that = this, treeOption = new EAP.UI.TreeOption();
    //        treeOption.showCheckBox = false;
    //        treeOption.selector = "#assetPane2";
    //        that.treeControl = new EAP.UI.TreeControl(treeOption);
    //        //let that = this;
    //        //deptTreeControl = {};
    //        //let treeoption  = new EAP.UI.TreeOption();
    //        //treeoption.selector = '#assetPane2';
    //        //treeoption.showCheckBox = false;
    //        //treeoption.expand = true;
    //        //treeoption.check = function (e) {
    //        //    that.selectRtEmpIds = e.sender.dataItem(e.node);
    //        //    deptTreeControl.checkItemsDownward(e.node);
    //        //    if (deptTreeControl.tree.dataItem(e.node).checked)
    //        //        return;
    //        //    deptTreeControl.checkItemsUpward(e.node);
    //        //}
    //        //deptTreeControl = new EAP.UI.TreeControl(treeoption);
    //    }
    //};
})(RPM || (RPM = {}));
(function () {
    var vb = window["ViewBag"];
    var ctrl = new RPM.DutyInfo();
})();
