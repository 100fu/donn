//namespace RPM {
//    class AreaInfo extends EAP.UI.BaseController {
//        constructor() {
//            super(EAP.UI.AGrid);
//        }
//        protected configOptions(options: EAP.UI.AGridOptions)
//        {
//            let gOptions = new EAP.UI.GridOption();
//            gOptions.gridSolutionId = '587b5e3e-87e2-4e19-8b2b-c89e267163a6';  //栏目Id
//            options.gridOption = gOptions;
//            options.viewScheme = false;
//            options.filter = true;
//                //傳入自定義參數
//            options.gridDataRequest = new EAP.UI.GridDataRequest();
//            options.gridDataRequest.postdata = { areatype: function () { return "patrol"; } };
//            super.configOptions(options);
//        }
//    };

//    new AreaInfo();


//}



namespace RPM {

    class AreaInfo extends EAP.UI.BaseController {
        protected currentItem: any;
        protected Item: any;
        protected points: any;
        protected selectIndex: any;
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
            gOptions.gridSolutionId = '587b5e3e-87e2-4e19-8b2b-c89e267163a6';  //栏目Id
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = true;

            //                //傳入自定義參數
            options.gridDataRequest = new EAP.UI.GridDataRequest();
            options.gridDataRequest.postdata = { ttype: function () { return "patrol"; } };
            super.configOptions(options);
        }

        Edit_Action(e: EAP.UI.ApplicationEventArgu) {

            let that = this, dataItem: any;
            if (!that.selectItem(true)) return false;
            that.searchRequest.postdata = { id: that.Item.Id };
          
            this.buidFormOptions();
            that.formOptions.winTitle = "编辑";
            that.formOptions.prePostProcess = function (data) {
                let pd = { item: data, oper: 'edit', entityId: "Donn.RPM.Entity.Area", serviceId: "Donn.RPM.Interface.IAreaService" };
                return pd;
            };
            that.form = new EAP.UI.FormApplication(that.formOptions);
            that.form.open();
            that.form.formControl.reCompile(true, false);
            that.form.formControl.reloadData(that.Item);


            $("input[name='DrawAttribute']").val(that.Item.DrawAttribute);
            $("input[name='DrawAttribute']:text").attr("readonly", "readonly");
            (that.form.formControl.kendoControls["DrawAttribute"] as EAP.UI.VinciSearchBox).element.parent().find(".k-i-search").unbind("click").on("click", $.proxy(that.pointsSearchBox, that));

        }
        Add_Action(e: EAP.UI.ApplicationEventArgu) {

            let that = this, dataItem: any;
            that.searchRequest.postdata = {};
            that.points = "";
            this.buidFormOptions();
            that.formOptions.winTitle = "新增";
            that.formOptions.prePostProcess = function (data) {
                //document.getElementsByName("Company").placeholder = "11111";
                data.TType = "patrol"; //巡检
                data.Description = "3";
                data.AlarmTags = 0;
                data.Alarmtagsout = 0;
                data.AlmIpPort = "0";
                data.Areaset = "5";
                data.code = new Date().getTime().toString();

                let pd = { item: data, oper: 'add', entityId: "Donn.RPM.Entity.Area", serviceId: "Donn.RPM.Interface.IAreaService" };
                return pd;
            };
            that.form = new EAP.UI.FormApplication(that.formOptions);
            that.form.open();
            that.form.formControl.reCompile(true, false);
            (that.form.formControl.kendoControls["DrawAttribute"] as EAP.UI.VinciSearchBox).element.parent().find(".k-i-search").unbind("click").on("click", $.proxy(that.pointsSearchBox, that));

        }
        View_Action(e: EAP.UI.ApplicationEventArgu) {

            let that = this, dataItem: any;
            if (!that.selectItem(true)) return false;
            that.searchRequest.postdata = { id: that.Item.Id };
            this.buidFormOptions();
            that.formOptions.winTitle = "查看";
            that.formOptions.prePostProcess = function (data) {
                let pd = { item: data, oper: 'view', entityId: "Donn.RPM.Entity.Area", serviceId: "Donn.RPM.Interface.IAreaService" };
                return pd;
            };
            that.form = new EAP.UI.FormApplication(that.formOptions);
            that.form.open();
            that.form.formControl.reCompile(true, false);
            that.form.formControl.reloadData(that.Item);
            $("input[name='DrawAttribute']").val(that.Item.DrawAttribute);
            $("input[name='DrawAttribute']:text").attr("readonly", "readonly");
            (that.form.formControl.kendoControls["DrawAttribute"] as EAP.UI.VinciSearchBox).element.parent().find(".k-i-search").unbind("click").on("click", $.proxy(function () { }, that));


            var foot = document.getElementsByName("Foot");
            $(foot).hide();

        }
        buidFormOptions() {
            let that = this;
            that.formOptions.formViewModelId = "4f4ea65b-727f-4d07-b738-4413f6673510";

         

            //that.searchOption.columns = [{ field: "Name", title: "标签编号" }];
            //that.searchRequest.url = new System.UrlObj("RPM", "DevPositionTag");
            //that.formOptions.formViewModelId = "4f4ea65b-727f-4d07-b738-4413f6673510";// "ee16b6c4-32eb-4c48-b656-0d494a0ec255";

            //that.formOptions.Data = [{
            //    type: 'searchbox', title: "标签编号", name: "IdPositionTag", colspan: 1, change: (e) => {
            //        let i = e.sender.selectItems[0];

            //    }, gridOptions: that.searchOption, dateRequestOptions: that.searchRequest, pageable: true, multiselect: false, windowSize: [270, 350],
            //    validateOptions: { required: true }
            //}
            //];
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
            that.points = that.Item.DrawAttribute;
            return true;
        }
        pointsSearchBox()
        {

            let that = this, winDiv = jQuery("<div class='k-popup-edit-form' style='overflow:hidden'/>");
            let content = "<table border= '0' width= '300'>"
                +"<tr><td style='color:green;'>范围坐标点应按照逆时针或顺时针依次输入...</td></tr>"
                + " <tr><td>X:<input type='text' id= 'txtX'  style='width:60px;' maxlength= '20' value= '0'/>"
                + "&nbsp;&nbsp;Y:<input type='text' id= 'txtY'style='width:60px;' maxlength= '20' value= '0' />"
                + "&nbsp;&nbsp;&nbsp;<input type='text' id= 'txtZ' style='width:60px;display:none;' maxlength= '20' value= '0' /></td></tr>"
                + " <tr><td align='left'>"
                + " <input class='btn'  style= 'width:20px;height:15px' type= 'button' id= 'btnAdd' value= '+' />"
                + " <input class='btn ' style= 'width:20px;height:15px' type= 'button' id= 'btnDel' value= '-' />"
                + " <input class='btn'  style= 'width:20px;height:15px' type= 'button' id= 'btnSave' value= '保存' />"
                + " </td></tr>"
                + " <tr><td>"
                + "<select style='width:300px; height:120px' id= 'ls1' multiple name= 'list1' size= '12'  >"
                + " </select></td></tr></table>";
            let kwindow = winDiv.kendoWindow({
                modal: true, width: 310, height: 250,
                title: "巡检点范围设置",
                resizable: false,
                content: { template: content },
                deactivate: function () { kwindow.destroy(); }
            }).data("kendoWindow");
            kwindow.center().open();

            let txtValue = that.form.formControl.sourceData["DrawAttribute"];// $("input[name='DrawAttribute']").val();
            if (txtValue !== undefined) {
                var lst = txtValue.split('&');
                for (var i = 0; i < lst.length; i++) {
                    var option1 = "<option value=" + i + ">" + lst[i].trim() + "</option>";
                    $("#ls1").append(option1);
                }
            }
            $("#btnAdd").on('click', function () {
                var txtX = $("#txtX").val();
                var txtY = $("#txtY").val();
                var txtZ = $("#txtZ").val();
                var position = txtX + "," + txtY + "," + txtZ;
                var reg = /^[-\+]?\d+(\.\d+)\,[-\+]?\d+(\.\d+)$/;
                var regKey = /^[-\+]?\d+(\.?[0-9]{0,2})\,[-\+]?\d+(\.?[0-9]{0,2})\,[-\+]?\d+(\.?[0-9]{0,2})$/;
                //输入值是否与正则匹配
                var r = position.match(regKey);
                if (r == null) {
                    alert(position + " 格式不正确...");
                    return;
                }
                //parseFloat
                position = parseFloat(txtX) + "," + parseFloat(txtY) + "," + parseFloat(txtZ);
                if (that.selectIndex !== undefined) {
                   // var options = $("#ls1");
                    //$(".selector").find("option:selected").text()
                    $("#ls1").find("option:selected").text(position);
                    that.selectIndex = undefined;
                    //$("select").removeSelected();
              
                 
                } else {
                    var num = $("#ls1 option").length;// $("#ls1").select.length;                    
                    var option1 = "<option value=" + num + ">" + position + "</option>";
                    $("#ls1").append(option1);
                }
            })
            $("#btnDel").on('click', function () {
                $("#ls1 option:selected").remove();
                that.selectIndex = undefined;
            })
            $('#ls1').dblclick(function () {
                var options = $("#ls1 option:selected");
                let selValue = options.text();
                let points = selValue.split(',');
                that.selectIndex = options.val();
          
                $("#txtX").val(points[0]);
                $("#txtY").val(points[1]);
                $("#txtZ").val(points[2]);
      
            })

            $("#btnSave").on('click', function () {
                var txtOption = "";
                var len = $("#ls1 option").length;
                if (len < 3)
                {
                    alert("巡检点范围不能小于3个坐标点... ");
                    return;
                }
                $("#ls1 option").each(function () {
                    if (txtOption != "") {
                        txtOption += "&";

                    }
                    txtOption += $(this).context.textContent;
                });

                let control = that.form.formControl.kendoControls["DrawAttribute"] as EAP.UI.VinciSearchBox;
                control.options.editable = true;
                control.value(txtOption);
                that.form.formControl.setSourceValue("DrawAttribute", txtOption);
                $("input[name='DrawAttribute']:text").attr("readonly", "readonly");
                kwindow.close();
            })
        }
    };

    new AreaInfo();


}