namespace RPM {

    class Device extends EAP.UI.BaseController {
        protected currentItem: any;
        protected Item: any;
        protected searchRequest: EAP.UI.GridDataRequest;
        protected searchOption: EAP.UI.GridOption;
        protected formOptions: EAP.UI.FormApplicationOption;
        protected form: EAP.UI.FormApplication;
        constructor() {
            super(EAP.UI.AGrid);
            $(".group_bar_right").find("button:not(:first)").hide();
            $(".gAppOtherTool_div").parent().hide();

        }


        protected configOptions(options: EAP.UI.AGridOptions) {
            let that = this;
            let gOptions = new EAP.UI.GridOption();
            that.searchOption = new EAP.UI.GridOption();
            that.searchRequest = new EAP.UI.GridDataRequest();
          
            that.formOptions = new EAP.UI.FormApplicationOption();
            that.formOptions.controlUniteWidth = "120px";
            that.formOptions.titleWidth = '80px';
            that.formOptions.columnsAmount = 3;
            that.formOptions.success = {
                text: "保存", onSuccess: function (data) {
                    that.form.close();
                    that.app.Refresh();
                }
            };
            that.formOptions.cancle = {
                text: "取消",
                fn: function () {
                    that.form.close();
                    that.app.Refresh();
                }
            };
            that.formOptions.autoDestroy = true;
            gOptions.gridSolutionId = '7cde0ba9-9f34-4cee-baef-c37a9ed5373a';  //栏目Id
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = true;
            super.configOptions(options);
        }

        Edit_Action(e: EAP.UI.ApplicationEventArgu) {

            let that = this, dataItem: any;
            if (!that.selectItem(true)) return false;
            that.searchRequest.postdata = { id: that.Item.Id };
            this.buidFormOptions();
            that.formOptions.winTitle = "编辑";
            that.formOptions.prePostProcess = function (data) {
                let pd = { item: data, oper: 'edit', entityId: "Donn.RPM.Entity.Device", serviceId: "Donn.RPM.Interface.IDeviceService" };
                return pd;
            };
            that.form = new EAP.UI.FormApplication(that.formOptions);
            that.form.open();
            that.form.formControl.reCompile(true, false);
            that.form.formControl.reloadData(that.Item);
        }
        Add_Action(e: EAP.UI.ApplicationEventArgu) {

            let that = this, dataItem: any;
            //if (that.selectItem(true)) return false;
            that.searchRequest.postdata = {};
            this.buidFormOptions();
            that.formOptions.winTitle = "新增";
            that.formOptions.prePostProcess = function (data) {
                //document.getElementsByName("Company").placeholder = "11111";
                let pd = { item: data, oper: 'add', entityId: "Donn.RPM.Entity.Device", serviceId: "Donn.RPM.Interface.IDeviceService" };
                return pd;
            };
            that.form = new EAP.UI.FormApplication(that.formOptions);
            that.form.open();
            that.form.formControl.reCompile(true, false);
            // that.form.formControl.reloadData(that.Item);
        }
        View_Action(e: EAP.UI.ApplicationEventArgu) {

            let that = this, dataItem: any;
            if (!that.selectItem(true)) return false;
            that.searchRequest.postdata = { id: that.Item.Id };
            this.buidFormOptions();
            that.formOptions.winTitle = "查看";
            that.formOptions.prePostProcess = function (data) {
                let pd = { item: data, oper: 'view', entityId: "Donn.RPM.Entity.Device", serviceId: "Donn.RPM.Interface.IDeviceService" };
                return pd;
            };
            that.form = new EAP.UI.FormApplication(that.formOptions);
            that.form.open();
            that.form.formControl.reCompile(true, false);
            that.form.formControl.reloadData(that.Item);
            var foot = document.getElementsByName("Foot");
            $(foot).hide();
  
        }
        buidFormOptions() {
            let that = this;
            that.searchOption.columns = [{ field: "Code", title: "标签编号" }];
            that.searchRequest.url = new System.UrlObj("RPM", "DevPositionTag");
            that.formOptions.formViewModelId = "ee16b6c4-32eb-4c48-b656-0d494a0ec255";

            that.formOptions.Data = [{
                type: 'searchbox', title: "标签编号", name: "IdPositionTag", colspan: 1, change: (e) => {
                    let i = e.sender.selectItems[0];

                }, gridOptions: that.searchOption, dateRequestOptions: that.searchRequest, pageable: true, multiselect: false, windowSize: [270, 350],
                validateOptions: { required: true }
            }
            ];
        }
        selectItem(single: boolean): boolean {
            let that = this, AGrid = that.app as EAP.UI.AGrid;
            that.currentItem = AGrid.gridControl.getSelectedRows();
            if (single && that.currentItem.length != 1) {
                EAP.UI.MessageBox.alert("提示", "请选择一行数据");
                return false;
            }
            if (!single && that.currentItem.length < 0) {
                EAP.UI.MessageBox.alert("提示", "请选择数据");
                return false;
            }
            that.Item = that.currentItem[0];
            return true;
        }
    };

    new Device();


}