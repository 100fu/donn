namespace RPM {


    class Station extends EAP.UI.BaseController {
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

            //傳入自定義參數
            //options.gridDataRequest = new EAP.UI.GridDataRequest();
            //options.gridDataRequest.postdata = { AA: function () { return "111111"; } };

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
            gOptions.gridSolutionId = '9f40d80b-969a-4405-baa0-86289c960c1f';  //栏目Id


            //gOptions.dataBound = () => {
            //    $(".layoutContent .k-grid-content colgroup col:first-child").width(0);
            //    $(".layoutContent .k-grid-header-wrap colgroup col:first-child").width(0);
            //}
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = true;
            super.configOptions(options);
        }

        Add_Action(e: EAP.UI.ApplicationEventArgu) {

            let that = this, dataItem: any;
            //if (that.selectItem(true)) return false;
            that.searchRequest.postdata = {};
            that.buidFormOptions();
            that.formOptions.winTitle = "新增";
            that.formOptions.prePostProcess = function (data) {

                let pd = { item: data, oper: 'add', entityId: "Donn.RPM.Entity.Station", serviceId: "Donn.RPM.Interface.IStationService" };

                return pd;
            };
            that.form = new EAP.UI.FormApplication(that.formOptions);
            that.form.open();
            that.form.formControl.reCompile(true, false);
            //placeholder
            var aa = (that.form.formControl.kendoControls["Position"] as EAP.UI.VinciNumericTextBox);
            console.info($(aa).attr('placeholder', "x,y,z(单位:cm)").css({ color: "#000000" }));
            // that.form.formControl.reloadData(that.Item);
        }
        buidFormOptions() {
            let that = this;
            that.formOptions.formViewModelId = "eeade07d-d36a-4124-aa23-f5b50a9e1802";
        }
        ////checkbox
        //Refresh_Action(e)
        //{
        //    this.methods.Refresh_Action(e);
            
        //   // $(".checkbox>tr>td:nth-child(1)").hide();
        //}
    };

    new Station();


}