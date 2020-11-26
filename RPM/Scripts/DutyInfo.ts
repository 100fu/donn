///<reference path="./../../Resource/Scripts/ts/Controller.ts"/>

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
namespace RPM {

    let panelOption = {
        panes: [{ collapsible: true, size: "30%" }, { collapsible: false, size: "70%" }]
    } as kendo.ui.SplitterOptions;
    $('#Container').kendoSplitter(panelOption).data("kendoSplitter");
    export class DutyInfo extends EAP.UI.BaseController {
        treeControl: any
        nodeid: any
        constructor(classType?) {
            super(classType || EAP.UI.AGrid, document.getElementById("gridContainerView"));
        }
        protected configOptions(options: EAP.UI.AGridOptions): void {
            options.filter = false;
            options.viewScheme = true;
            options.gridDataRequest = new EAP.UI.GridDataRequest();
            options.gridDataRequest.postdata = { uid: () => this.nodeid }
            //options.formOption.columnsAmount = 2;
            this.initTree();
            this.setAssetTreeData();
        }
        Refresh_Action(e) {
           // console.log("refresh");
          
            this.methods.Refresh_Action(e);
            this.setAssetTreeData();
        }

        initTree() {
            let that = this, treeOption = new EAP.UI.TreeOption();
            treeOption.showCheckBox = false;
            treeOption.nodeClick = (e) => {
                // let checkedIds = treeOption.getCheckedItems().ids;
                let uid = e.sender.dataItem(e.node).id;
                if (uid === '2018-08-25') {
                    this.nodeid = undefined
                } else {
                    this.nodeid = uid;
                }
                //this.nodeid = e.sender.dataItem(e.node).id;     

               // alert(e.node.outerText + " " + this.nodeid);
                that.methods.Refresh_Action({ sender: this.app as EAP.UI.AGrid });
            }
            treeOption.selector = "#assetPane2";
            that.treeControl = new EAP.UI.TreeControl(treeOption);

        }
        setAssetTreeData() {
            let that = this;
            var clientMode = new System.Net.HttpClient();
            // var urlPath = '/Graphic/GetDeptTree';
            var urlPath = '/Graphic/GetDutyInfoTree';
            clientMode.post(urlPath, "", function (data) {
                if (data.length > 0)
                    that.initData(data);
            });
        }
        initData(data) {
            let that = this;
            //if (data == undefined)
            //    return;
            //var assetTree = [{ id: Guid.Empty, text: '所有职务', items: [], checked: false }];
            //$.each(data[0].items, function (i, n) {
            //    assetTree[0].items.push({ id: n.id, text: n.text, attributes: n.text });
            //});
            //that.treeControl.setTreeData(assetTree);
            that.treeControl.setTreeData(data);
            that.treeControl.expandall();
        }
    }

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


}
(function () {

    var vb: EAP.UI.Core.IViewInfo = window["ViewBag"];
    var ctrl = new RPM.DutyInfo();


})();