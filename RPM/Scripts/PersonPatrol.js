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
    var PersonPatrol = (function (_super) {
        __extends(PersonPatrol, _super);
        function PersonPatrol() {
            var _this = _super.call(this, EAP.UI.AGrid) || this;
            $(".group_bar_right").find("button:not(:first)").hide();
            $(".gAppOtherTool_div").parent().hide();
            return _this;
        }
        PersonPatrol.prototype.configOptions = function (options) {
            var that = this;
            var gOptions = new EAP.UI.GridOption();
            that.searchOption = new EAP.UI.GridOption();
            that.searchRequest = new EAP.UI.GridDataRequest();
            //that.formOptions = new EAP.UI.FormApplicationOption();
            //that.formOptions.controlUniteWidth = "120px";
            //that.formOptions.titleWidth = '80px';
            //that.formOptions.columnsAmount = 3;
            //that.formOptions.success = {
            //    text: "保存", onSuccess: function (data) {
            //        that.form.close();
            //        that.app.Refresh();
            //    }
            //};
            //that.formOptions.cancle = {
            //    text: "取消",
            //    fn: function () {
            //        that.form.close();
            //        that.app.Refresh();
            //    }
            //};
            //that.formOptions.autoDestroy = true;
            //that.formOptions.widgetCreated = function(control, type, name) {
            //    switch (name) {
            //        case "IdDepartment":
            //            //alert('部门');
            //            let deptEmpinfo = function(e) {
            //                let item = e.dataSource;
            //                let control = that.form.formControl.kendoControls["Name"];
            //                let requestOption = new EAP.UI.GridDataRequest(); //请求
            //                requestOption.url = { action: "GetEmpByDeptid", controller: "Graphic" };
            //                requestOption.postdata = { deptid: item.Id };
            //                control.loadGridData(requestOption);
            //            }
            //            control.bind("change", deptEmpinfo);
            //            break;
            //        case "PatrolLocation":
            //            //alert('巡检地点');
            //            break;
            //    }
            //};
            gOptions.gridSolutionId = 'd5ab81f8-cdd3-4f0d-b209-13fd13342526'; //栏目Id
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = true;
            options.gridDataRequest = new EAP.UI.GridDataRequest();
            //  options.gridDataRequest.postdata = { ttype: function () { return "patrol"; } };
            _super.prototype.configOptions.call(this, options);
            //  return options;
        };
        //Edit_Action(e: EAP.UI.ApplicationEventArgu) {
        //    let that = this, dataItem: any;
        //    if (!that.selectItem(true)) return false;
        //    that.searchRequest.postdata = { id: that.Item.Id };
        //    that.formOptions=  this.buidFormOptions();
        //    that.formOptions.winTitle = "编辑";
        //    that.formOptions.prePostProcess = function (data) {
        //        let pd = { item: data, oper: 'edit', entityId: "Donn.RPM.Entity.PersonPatrol", serviceId: "Donn.RPM.Interface.IPersonPatrolService" };
        //        return pd;
        //    };
        //    that.form = new EAP.UI.FormApplication(that.formOptions);
        //    that.form.open();
        //    that.form.formControl.reCompile(true, false);
        //    that.form.formControl.reloadData(that.Item);
        //}
        PersonPatrol.prototype.Add_Action = function (e) {
            var that = this, dataItem;
            that.searchRequest.postdata = {};
            var formOptions = this.buidFormOptions();
            formOptions.winTitle = "新增";
            formOptions.prePostProcess = function (data) {
                // alert(data)
                //data.Description = "3";
                //data.AlarmTags = 0;
                //data.Alarmtagsout = 0;
                //data.AlmIpPort = "0";
                //data.Areaset = "5";
                //data.code = new Date().getTime().toString();
                var pd = { item: data, oper: 'add', entityId: "Donn.RPM.Entity.PersonPatrol", serviceId: "Donn.RPM.Interface.IPersonPatrolService" };
                return pd;
            };
            that.form = new EAP.UI.FormApplication(formOptions);
            that.form.open();
            that.form.formControl.reCompile(false, false);
            $("input[name='PatrolPoint']:text").attr("readonly", "readonly");
            $("input[name='PatrolLocation']:text").attr("readonly", "readonly");
            //  (that.form.formControl.kendoControls["PatrolPoint"] as EAP.UI.VinciSearchBox).options.editable = false;
            //that.points = "";
            //that.formOptions = this.buidFormOptions();
            //that.formOptions.winTitle = "新增";
            //that.formOptions.prePostProcess = function (data) {
            //    //data.TType = "patrol"; //巡检
            //    //data.Description = "3";
            //    //data.AlarmTags = 0;
            //    //data.Alarmtagsout = 0;
            //    //data.AlmIpPort = "0";
            //    //data.Areaset = "5";
            //    //data.code = new Date().getTime().toString();
            //    //let pd = { item: data, oper: 'add', entityId: "Donn.RPM.Entity.PersonPatrol", serviceId: "Donn.RPM.Interface.IPersonPatrolService" };
            //    //return pd;
            //};
            //that.form = new EAP.UI.FormApplication(that.formOptions);
            //that.form.open();
            //that.form.formControl.reCompile(true, false);
            ////(that.form.formControl.kendoControls["Name"] as EAP.UI.VinciSearchBox).element.parent().find(".k-i-search").unbind("click").on("click", $.proxy(that.pointsSearchBox, that));
        };
        //View_Action(e: EAP.UI.ApplicationEventArgu) {
        //    let that = this, dataItem: any;
        //    if (!that.selectItem(true)) return false;
        //    that.searchRequest.postdata = { id: that.Item.Id };
        //    that.formOptions = this.buidFormOptions();
        //    that.formOptions.winTitle = "查看";
        //    that.formOptions.prePostProcess = function (data) {
        //        let pd = { item: data, oper: 'view', entityId: "Donn.RPM.Entity.PersonPatrol", serviceId: "Donn.RPM.Interface.IPersonPatrolService" };
        //        return pd;
        //    };
        //    that.form = new EAP.UI.FormApplication(that.formOptions);
        //    that.form.open();
        //    that.form.formControl.reCompile(true, false);
        //    that.form.formControl.reloadData(that.Item);
        //    //$("input[name='Name']").val(that.Item.DrawAttribute);
        //    //$("input[name='Name']:text").attr("readonly", "readonly");
        //    //(that.form.formControl.kendoControls["Name"] as EAP.UI.VinciSearchBox).element.parent().find(".k-i-search").unbind("click").on("click", $.proxy(function () { }, that));
        //    var foot = document.getElementsByName("Foot");
        //    $(foot).hide();
        //}
        PersonPatrol.prototype.buidFormOptions = function () {
            var that = this, options = new EAP.UI.FormApplicationOption();
            options.controlUniteWidth = "120px";
            options.titleWidth = '80px';
            options.columnsAmount = 3;
            options.formViewModelId = "c67c3eca-35a6-4a05-b94a-cd3bd98598bc";
            options.widgetCreated = function (control, type, name) {
                // alert(name+",type:"+type);
                if (name === "floor") {
                    //selectFloor
                    var floolchange = function (e) {
                        var item = e.sender;
                        var data = item.dataItem(item.select());
                        var control = that.form.formControl.kendoControls["PatrolLocation"];
                        var requestOption = new EAP.UI.GridDataRequest(); //请求
                        requestOption.url = { action: "GetAllDrawjson", controller: "Graphic" };
                        that.selectFloor = data.Name;
                        requestOption.postdata = { selectFloor: data.Name };
                        control.loadGridData(requestOption);
                    };
                    control.bind("change", floolchange);
                }
                else if (name === "Name") {
                    var changeEmp = function (e) {
                        var item = e.dataSource;
                        that.selectEmpId = item.Id;
                    };
                    control.bind("change", changeEmp);
                }
                else if (name === "deptname") {
                    //alert('部门');
                    var deptEmpinfo = function (e) {
                        var item = e.dataSource;
                        var control = that.form.formControl.kendoControls["Name"];
                        var requestOption = new EAP.UI.GridDataRequest(); //请求
                        requestOption.url = { action: "GetEmpByDeptid", controller: "Graphic" };
                        requestOption.postdata = { deptid: item.Id };
                        control.loadGridData(requestOption);
                    };
                    control.bind("change", deptEmpinfo);
                }
                else if (name === "PatrolLocation") {
                    var patrolLoc = function (e) {
                        var item = e.dataSource;
                        var control = that.form.formControl.kendoControls["PatrolPoint"];
                        var requestOption = new EAP.UI.GridDataRequest(); //请求
                        requestOption.url = { action: "GetAllPointName", controller: "Graphic" };
                        requestOption.postdata = { selectFloor: that.selectFloor, ProName: item[0].PatrolLocation, empid: that.selectEmpId };
                        control.loadGridData(requestOption);
                    };
                    control.bind("change", patrolLoc);
                }
            };
            options.success = {
                text: "保存", onSuccess: function (data) {
                    that.form.close();
                    that.app.Refresh();
                }
            };
            options.cancle = {
                text: "取消",
                fn: function () {
                    that.form.close();
                    that.app.Refresh();
                }
            };
            options.autoDestroy = true;
            return options;
        };
        PersonPatrol.prototype.selectItem = function (single) {
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
            that.points = that.Item.DrawAttribute;
            return true;
        };
        PersonPatrol.prototype.pointsSearchBox = function () {
            var that = this, winDiv = jQuery("<div class='k-popup-edit-form' style='overflow:hidden'/>");
            var content = "<table border= '0' width= '300'>"
                + "<tr><td style='color:green;'>范围坐标点应按照逆时针或顺时针依次输入...</td></tr>"
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
            var kwindow = winDiv.kendoWindow({
                modal: true, width: 310, height: 250,
                title: "巡检点范围设置",
                resizable: false,
                content: { template: content },
                deactivate: function () { kwindow.destroy(); }
            }).data("kendoWindow");
            kwindow.center().open();
            var txtValue = that.form.formControl.sourceData["DrawAttribute"]; // $("input[name='DrawAttribute']").val();
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
                var len = $("#ls1 option").length;
                if (len < 3) {
                    alert("巡检点范围不能小于3个坐标点... ");
                    return;
                }
                $("#ls1 option").each(function () {
                    if (txtOption != "") {
                        txtOption += "&";
                    }
                    txtOption += $(this).context.textContent;
                });
                var control = that.form.formControl.kendoControls["DrawAttribute"];
                control.options.editable = true;
                control.value(txtOption);
                that.form.formControl.setSourceValue("DrawAttribute", txtOption);
                $("input[name='DrawAttribute']:text").attr("readonly", "readonly");
                kwindow.close();
            });
        };
        return PersonPatrol;
    }(EAP.UI.BaseController));
    ;
    new PersonPatrol();
})(RPM || (RPM = {}));
