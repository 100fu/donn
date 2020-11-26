var taskReportParam = {
    isOper: "",
    parmeter: { alarmType: 0, begin: "", end: "", timeInterval: 1, length: "" },

};
var hisAttParam = {};
var searchParam = {};
var hisAttFun = {
    loadButton: function () {
        //绑定快速查询按钮
        $("#radHtml").html(radHtmlMode);
        $("#btnFind").click(function () {
            hisAttFun.loadForm();
        });

        //绑定点击事件和文本回车事件
        $(".raddwy").radClick("hisAttFun.search");
        $(".dwy").textClick("hisAttFun.search");
        //默认查询一天
        $('#rad-day').trigger("click");
        BDZFunction.getmousewheel();
    },
    loadForm: function () {
        let deptname = $("#selectDept").val();
        let begin = $("#logmin").val();
        let end = $("#logmax").val();
        let taskTypeList = [];
        if (begin === '' || end === '') {
            layer.msg('时间范围不能为空!', { icon: 0, time: 2000 });
            return;
        }
        let empName = $("#empName").val();  //名称
        let tagNo = $("#tagNo").val();
        let empCode = $("#empCode").val();  //编号
        let strRegs = $("#selectRegs").val();

        searchParam = { startTime: begin, endTime: end, DeptName: deptname, empName: empName, empCode: empCode, tagNo: tagNo, strRegs: strRegs };

        clientMode.post('/Graphic/GetHisAttendance', searchParam, function (dt) {
            if (dt.length > 0) {
                hisAttFun.showTable(dt);
                // alert(dt);
            } else {
                layer.msg('没有符合要求的信息...', { icon: 0, time: 2000 });
            }
        });
    },
    loadDeptInfo: function () {
        //DeptList
        clientMode.post("/Graphic/GetDeptInfoList", null, function (data) {
            if (data != null) {

                let option = "<option value='all'>所有部门</option>";
                $("#selectDept").empty();
                data.forEach(function (item) {
                    option += "<option value=" + item.Name + ">" + item.Name + "</option>";
                    // DeptList[item.Id] = item;
                })
                $("#selectDept").append(option);
            }
        });
    },
    loadRegInfo: function () {
        //DeptList
        let strWhere = { strKey: 'attendRegion' };
        clientMode.post("/Graphic/GetAllReg", strWhere, function (data) {
            if (data != null) {

                let option = "<option value='all'>所有考勤区域</option>";
                $("#selectRegs").empty();
                data.forEach(function (item) {
                    option += "<option value=" + item.Name + ">" + item.Name + "</option>";
                })
                $("#selectRegs").append(option);
            }
        });
    },

    search: function (itype, day) {
        switch (itype) {
            case "day":
                taskReportParam.parmeter.timeInterval = 1;
                break;
            case "week":
                taskReportParam.parmeter.timeInterval = 2;
                break;
            case "month":
                taskReportParam.parmeter.timeInterval = 3;
                break;
            default:
                taskReportParam.parmeter.timeInterval = 1;
                break;
        }
        taskReportParam.parmeter.length = day;
        hisAttFun.loadForm();
    },
    mouseWheel: function (delta) {
        BDZFunction.mousewhell(delta);
    },

    //hisAttFun.mouseover
    mouseover: function () {
        let source = event.srcElement;
        if (source.tagName === "TD") {
            source = source.parentElement;
            let cells = source.children;
            for (i = 0; i < cells.length; i++) {
                cells[i].style.backgroundColor = '#D0D0D0';
            }
        }
    },
    mouseout: function () {
        let source = event.srcElement;
        if (source.tagName === "TD") {
            source = source.parentElement;
            let cells = source.children;
            for (i = 0; i < cells.length; i++) {
                cells[i].style.backgroundColor = '';
            }
        }
    },
    showTable: function (data) {
        //tbMain
        let operValues = "";
        $.each(data, function (i, n) {
            operValues += "<tr role='row' ><td style='text- align:left;width:50px;' role='gridcell' >" + (i + 1) + "</td><td style='text- align:left;width:100px;' role='gridcell'>" + n.Name + "</td><td style='text- align:left;width:100px;' role='gridcell'>" + n.Code + "</td><td style='text- align:left;width:100px;' role='gridcell'>" + n.Tagcode + "</td><td style='text- align:left;width:150px;' role='gridcell'>" + n.Deptname + "</td><td style='text- align:left;width:100px;' role='gridcell'>" + n.Duty + "</td><td style='text- align:left;width:200px;' role='gridcell'>" + n.Attarea + "</td><td style='text- align:left;width:200px;' role='gridcell'><a style='text-decoration:none' onclick=hisAttFun.showAttMessage(this,0," + n.Tagcode + ") >" + n.total + "</a></td><td style='text- align:left;width:200px;' role='gridcell'><a onclick=hisAttFun.showAttMessage(this,1," + n.Tagcode + ")>" + n.late + "</a></td><td style='text- align:left;width:auto;' role='gridcell'><a onclick=hisAttFun.showAttMessage(this,2," + n.Tagcode + ")>" + n.early + "</a></td></tr>"
        });
        let tbody = document.getElementById('tbMain');
        tbody.innerHTML = operValues;
    },
    showAttMessage: function (event, itype, tagcode) {
        // alert(itype + "," + tagcode);

        if (event.innerText === "0")
        {
            layer.msg('没有符合要求的信息...', { icon: 0, time: 2000 });
            return;
        }
        let param = searchParam;
        //{ startTime: begin, endTime: end, DeptName: deptname, empName: empName, empCode: empCode, tagNo: tagNo, strRegs: strRegs };
        let strWhere = { startTime: param.startTime, endTime: param.endTime, DeptName: param.DeptName, empName: param.empName, empCode: param.empCode, tagNo: tagcode, strRegs: param.strRegs, isMerge: 1, isAttstatus: itype }
        hisAttParam = strWhere;
        hisAttFun.showHisMsg();
        //hisAttFun.searchHisDigMsg(strWhere);
    },
    searchHisDigMsg: function (strWhere) {
        clientMode.post('/Graphic/GetHisAttMeg', strWhere, function (dt) {
            if (dt.length > 0) {
                hisAttFun.loadDialog(dt);
            } else {
                layer.msg('没有符合要求的信息...', { icon: 0, time: 2000 });
            }
        });
    },
    showHisMsg: function () {
        let strPath = '/RPM/3DJS/showAttMessage.html';
        let strMsg = hisAttParam.tagNo + "号标签 " + hisAttParam.startTime + "---" + hisAttParam.endTime + " 考勤明细..."
        let strWhere = hisAttParam;
        clientMode.getfile(strPath, function (data) {
            jQuery("#formEditDialog").html(data);
            $("#lblMessage").text(strMsg);
            hisAttFun.searchHisDigMsg(strWhere);
            jQuery("#formEditDialog").dialog({
                title: "历史考勤明细",
                width: 900,
                height: 400,
                resizable: false,
                modal: true,
                position: ['center', 50],
                close: function (event, ui) {
                    //  map2dLayer.regPsSave();
                }
            });
        });
    },
    showHisMerge: function () {
        let ischk = document.getElementById("ismerge").checked;
        if (ischk) {
            hisAttParam.isMerge = 1;
        } else {
            hisAttParam.isMerge = 0;
        }
        hisAttFun.searchHisDigMsg(hisAttParam);
    },
    loadDialog: function (data) {   
        let operValues = "";
        $.each(data, function (i, n) {
            operValues += "<tr role='row' ><td style='text- align:left;width:50px;' role='gridcell' >" + (i + 1) + "</td><td style='text- align:left;width:100px;' role='gridcell'>" + n.Name + "</td><td style='text- align:left;width:60px;' role='gridcell'>" + n.Code + "</td><td style='text- align:left;width:60px;' role='gridcell'>" + n.Tagcode + "</td><td style='text- align:left;width:150px;' role='gridcell'>" + n.Deptname + "</td><td style='text- align:left;width:60px;' role='gridcell'>" + n.Duty + "</td><td style='text- align:left;width:150px;' role='gridcell'>" + n.Attarea + "</td><td style='text- align:left;width:160px;' role='gridcell'>" + n.intime + "</td><td style='text- align:left;width:160px;' role='gridcell'>" + n.outtime + "</td><td style='text- align:left;width:100px;' role='gridcell'>" + n.Attdate + "</td></tr>"
        });
        let tbody = document.getElementById('showHisbody');
        tbody.innerHTML = operValues;
    },
};

$(function () {
    hisAttFun.loadDeptInfo();
    hisAttFun.loadRegInfo();
    hisAttFun.loadButton();
});