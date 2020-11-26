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
var RPM;
(function (RPM) {
    var Video = (function (_super) {
        __extends(Video, _super);
        function Video() {
            return _super.call(this, EAP.UI.AGrid) || this;
            //   $(".group_bar_right").find("button:not(:first)").hide();
            //  $(".gAppOtherTool_div").parent().hide();
        }
        Video.prototype.configOptions = function (options) {
            var that = this;
            var gOptions = new EAP.UI.GridOption();
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
            gOptions.gridSolutionId = '683dc133-3ee1-4d7b-85a5-cafd8bea36ff'; //栏目Id
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = false;
            _super.prototype.configOptions.call(this, options);
        };
        Video.prototype.Add_Action = function (e) {
            var that = this, dataItem;
            //if (that.selectItem(true)) return false;
            that.searchRequest.postdata = {};
            that.buidFormOptions();
            that.formOptions.winTitle = "新增";
            that.formOptions.prePostProcess = function (data) {
                var pd = { item: data, oper: 'add', entityId: "Donn.RPM.Entity.Video", serviceId: "Donn.RPM.Interface.IVideoService" };
                return pd;
            };
            that.form = new EAP.UI.FormApplication(that.formOptions);
            that.form.open();
            that.form.formControl.reCompile(true, false);
            //placeholder
            var aa = that.form.formControl.kendoControls["Position"];
            console.info($(aa).attr('placeholder', "x,y,z(单位:cm)").css({ color: "#000000" }));
            // that.form.formControl.reloadData(that.Item);
            //Monitorarea
            that.form.formControl.kendoControls["Monitorarea"].element.parent().find(".k-i-search").unbind("click").on("click", $.proxy(that.faultcodeSearchBox, that));
        };
        Video.prototype.Edit_Action = function (e) {
            var that = this, dataItem;
            if (!that.selectItem(true))
                return false;
            that.searchRequest.postdata = { id: that.Item.Id };
            this.buidFormOptions();
            that.formOptions.winTitle = "编辑";
            that.formOptions.prePostProcess = function (data) {
                var pd = { item: data, oper: 'edit', entityId: "Donn.RPM.Entity.Video", serviceId: "Donn.RPM.Interface.IVideoService" };
                return pd;
            };
            that.form = new EAP.UI.FormApplication(that.formOptions);
            that.form.open();
            that.form.formControl.reCompile(true, false);
            that.form.formControl.reloadData(that.Item);
            $("input[name='Monitorarea']").val(that.Item.Monitorarea);
            $("input[name='Monitorarea']:text").attr("readonly", "readonly");
            that.form.formControl.kendoControls["Monitorarea"].element.parent().find(".k-i-search").unbind("click").on("click", $.proxy(that.faultcodeSearchBox, that));
        };
        Video.prototype.View_Action = function (e) {
            var that = this, dataItem;
            if (!that.selectItem(true))
                return false;
            that.searchRequest.postdata = { id: that.Item.Id };
            this.buidFormOptions();
            that.formOptions.winTitle = "查看";
            that.formOptions.prePostProcess = function (data) {
                var pd = { item: data, oper: 'view', entityId: "Donn.RPM.Entity.Video", serviceId: "Donn.RPM.Interface.Video" };
                return pd;
            };
            that.formOptions.success = null;
            that.formOptions.cancle = null;
            that.form = new EAP.UI.FormApplication(that.formOptions);
            that.form.open();
            that.form.formControl.reCompile(true, false);
            that.form.formControl.reloadData(that.Item);
            $('.k-input').attr("readonly", "readonly");
            $("input[name='Monitorarea']").val(that.Item.Monitorarea);
            $("input[name='Monitorarea']:text").attr("readonly", "readonly");
            that.form.formControl.kendoControls["Monitorarea"].element.parent().find(".k-i-search").unbind("click").on("click", $.proxy(function () { }, that));
            //k-select
            //$(".k-select").hide();
            // $('.k-select').removeAttr('onclick');//去掉标签中的onclick事件
        };
        Video.prototype.selectItem = function (single) {
            var that = this, AGrid = that.app;
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
        };
        Video.prototype.buidFormOptions = function () {
            var that = this;
            that.formOptions.formViewModelId = "90fcb3c4-b1a9-499f-abb0-ad587956f9be";
        };
        Video.prototype.faultcodeSearchBox = function () {
            var that = this, winDiv = jQuery("<div class='k-popup-edit-form' style='overflow:hidden'/>");
            var content = "<table border= '0' width= '300'>"
                + " <tr><td>X:<input type='text' id= 'txtX'  style='width:60px;' maxlength= '20' value= '0'/>"
                + "&nbsp;&nbsp;Y:<input type='text' id= 'txtY'style='width:60px;' maxlength= '20' value= '0' />"
                + "&nbsp;&nbsp;Z:<input type='text' id= 'txtZ' style='width:60px;' maxlength= '20' value= '0' /></td></tr>"
                + " <tr><td align='left'>"
                + " <input class='btn'  style= 'width:20px;height:15px' type= 'button' id= 'btnAdd' value= '+' />"
                + " <input class='btn ' style= 'width:20px;height:15px' type= 'button' id= 'btnDel' value= '-' />"
                + " <input class='btn'  style= 'width:20px;height:15px' type= 'button' id= 'btnSave' value= '保存' />"
                + " </td></tr>"
                + " <tr><td>"
                + "<select style='width:300px; height:120px' id= 'ls1' multiple name= 'list1' size= '12'  >"
                + " </select></td></tr></table>";
            var kwindow = winDiv.kendoWindow({
                modal: true, width: 310, height: 250,
                title: "监控有效范围设置",
                resizable: false,
                content: { template: content },
                deactivate: function () { kwindow.destroy(); }
            }).data("kendoWindow");
            kwindow.center().open();
            ////$("input[name='Monitorarea']").val();  //取缓存中的值
            var txtValue = that.form.formControl.sourceData["Monitorarea"]; //取表单中的值
            if (txtValue !== undefined && txtValue !== null) {
                var lst = txtValue.split(';');
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
                //var num = $("#ls1 option").length;// $("#ls1").select.length;                    
                //var option1 = "<option value=" + num+">" + position + "</option>";
                //$("#ls1").append(option1);
                if (that.selectIndex !== undefined) {
                    $("#ls1").find("option:selected").text(position);
                    that.selectIndex = undefined;
                }
                else {
                    var num = $("#ls1 option").length; // $("#ls1").select.length;                    
                    var option1 = "<option value=" + num + ">" + position + "</option>";
                    $("#ls1").append(option1);
                }
            });
            $("#btnDel").on('click', function () {
                $("#ls1 option:selected").remove();
                that.selectIndex = undefined;
            });
            $('#ls1').dblclick(function () {
                var options = $("#ls1 option:selected");
                var selValue = options.text();
                var points = selValue.split(',');
                that.selectIndex = options.val();
                $("#txtX").val(points[0]);
                $("#txtY").val(points[1]);
                $("#txtZ").val(points[2]);
            });
            $("#btnSave").on('click', function () {
                var txtOption = "";
                $("#ls1 option").each(function () {
                    if (txtOption != "") {
                        txtOption += ";";
                    }
                    txtOption += $(this).context.textContent;
                });
                // as EAP.UI.VinciNumericTextBox
                //var aa = (that.form.formControl.kendoControls["Monitorarea"] as EAP.UI.VinciNumericTextBox);
                //aa.readonly;
                //     console.info($(aa).attr('placeholder', "x,y,z(单位:cm)").css({color:"#000000"}));
                //console.info($(aa).val(txtOption));
                //  $("input[name='Monitorarea']").val(txtOption);
                var control = that.form.formControl.kendoControls["Monitorarea"];
                control.options.editable = true;
                control.value(txtOption);
                that.form.formControl.setSourceValue("Monitorarea", txtOption);
                var ddd = that.form.formControl.sourceData;
                $("input[name='Monitorarea']:text").attr("readonly", "readonly");
                kwindow.close();
            });
            //let that = this, winDiv = jQuery("<div class='k-popup-edit-form' style='overflow:hidden'/>");
            //let content = "<table><tr><td><select class='FaultType'   multiple= 'multiple' style = 'width: 120px; height: 200px;' ></select></td><td>"
            //    + "<select class='FaultSystem' multiple= 'multiple' style= 'width: 120px; height: 200px;' ></select></td><td>"
            //    + "<select class='FaultPart' multiple= 'multiple' style= 'width: 120px; height: 200px;' ></select></td><td>"
            //    + "<select class='FaultReason' multiple= 'multiple' style= 'width: 120px; height: 200px;' ></select></td></tr></table>"
            //    + '<div class="formFoot" style="width: 98%;text-align:right;"><button  class="k-primary formCommit k-button faultcodeOK"  type="button" data-role="faultcodeOK">' + that.Localization("OK") + '</button><button  class="formCancel k-button faultcodeCancel" type="button" data-role="faultcodeCancel">' + that.Localization("Cancel") + '</button></div>';
            //let kwindow = winDiv.kendoWindow({
            //    modal: true, width: 550, height: 300,
            //    title: that.Localization("FaultCode"),
            //    resizable: false,
            //    content: { template: content },
            //    deactivate: function () { kwindow.destroy(); }
            //}).data("kendoWindow");
            //kwindow.center().open();
            //winDiv.find('[data-role=faultcodeOK]').on('click', function () {
            //    let faultcode = $(".FaultType option:selected").data("code") + $(".FaultSystem option:selected").data("code") + $(".FaultPart option:selected").data("code") + $(".FaultReason option:selected").data("code");
            //    that.editForm.formControl.setSourceValue("FaultCode", faultcode);
            //    let control = that.editForm.formControl.kendoControls["FaultCode"] as EAP.UI.VinciSearchBox;
            //    control.options.editable = true;
            //    control.value(faultcode);
            //    kwindow.destroy();
            //});
            //winDiv.find('[data-role=faultcodeCancel]').on('click', function () { kwindow.destroy(); });
            //winDiv.find('.FaultType').on('click', function () { that.faultcodeLoad(); });
            //、、that.getFaultCode();
        };
        return Video;
    }(EAP.UI.BaseController));
    ;
    new Video();
})(RPM || (RPM = {}));
