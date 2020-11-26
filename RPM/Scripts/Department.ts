

///<reference path="./../../Resource/Scripts/ts/Controller.ts"/>
namespace RPM {

    let panelOptionDept = {
        panes: [{ collapsible: true, size: "30%" }, { collapsible: false, size: "70%" }]
    } as kendo.ui.SplitterOptions;
    $('#ContainerDept').kendoSplitter(panelOptionDept).data("kendoSplitter");
    export class Department extends EAP.UI.BaseController {
        treeControl: any
        nodeid:any
        constructor(classType?) {
            super(classType || EAP.UI.AGrid, document.getElementById("gridContainerView"));
        }
        protected configOptions(options: EAP.UI.AGridOptions): void {
            options.filter = false;
            options.gridDataRequest = new EAP.UI.GridDataRequest();
            options.gridDataRequest.postdata = { uid: () => this.nodeid }
            options.formOption = new EAP.UI.FormApplicationOption();
           // options.formOption.sourceData = { IdParent: "1a9eb330-792f-4281-85ee-ded7b2de62a9" }
            options.viewScheme = true;
            //options.formOption.columnsAmount = 2;
            this.initTree();
            this.setAssetTreeData();
        }
        Refresh_Action(e) {
            this.methods.Refresh_Action(e);
            this.setAssetTreeData();
        }
        Add_Action(e) {

            this.methods.Add_Action(e);
        }

        initTree() {
            let that = this, treeOption = new EAP.UI.TreeOption();
            treeOption.nodeClick = (e) => {
                // let checkedIds = treeOption.getCheckedItems().ids;
                let uid = e.sender.dataItem(e.node).id;  
                if (uid === '2018-08-25')
                {
                    this.nodeid = undefined
                } else {
                    this.nodeid = uid;
                }
                //this.nodeid = e.sender.dataItem(e.node).id;     

               // alert(e.node.outerText + " " + this.nodeid);
                that.methods.Refresh_Action({ sender: this.app as EAP.UI.AGrid });
            }
           
            treeOption.showCheckBox = false;
            treeOption.selector = "#assetPanel";
            that.treeControl = new EAP.UI.TreeControl(treeOption);
        }
        setAssetTreeData() {
            let that = this;
            var clientMode = new System.Net.HttpClient();
            var urlPath = '/Graphic/GetDeptTree';
            clientMode.post(urlPath, "", function (data) {
                if (data.length > 0)
                    that.initData(data);
            });
        }
        initData(data) {
            let that = this;
            if (data == undefined)
                return;
            that.treeControl.setTreeData(data);        
            that.treeControl.expandall();
        }
    }

}
(function () {

    var vb: EAP.UI.Core.IViewInfo = window["ViewBag"];
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