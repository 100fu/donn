var taskReportParam = {
    isOper: "",
    //parmeter: { taskTypeList: [], alarmTypeList: [], begin: "", end: "", timeInterval: 1, Remark: "" },
    parmeter: { alarmType: 0, begin: "", end: "", timeInterval: 1, length: "" },
    chartsParam: { title: '工作量及报警统计', chartType: 'column', categories: [], yText: '单位(条数)', seriesName1: '工作量统计', seriesData1: [], seriesName2: '报警统计', seriesData2: [] },
    kendoChartParam: { title: '', seriesList: [], categoriesList: [], alarmItem1: [], alarmItem2: [] },
};
var searchParam = {};
var hisVideoList = {};

var playlist = {}, curplay = [], playindex = 0, curplayindex = 0;

var hisAlarmFun = {
    loadButton: function () {
        //绑定快速查询按钮
        $("#radHtml").html(radHtmlMode);

        var pointList = [{ ID: '0', Name: '报警类型' }, { ID: '1', Name: '电子围栏报警' }, { ID: '2', Name: '碰撞预警' }, { ID: '4', Name: '求救报警' }];
        var option = "";
        $("#selectType").empty();
        $.each(pointList, function (i, tag) {
            option += "<option value=" + tag.ID + ">" + tag.Name + "</option>";
        });
        $("#selectType").append(option);
        //下拉框
        var List = [{ ID: '0', Name: '所有状态' }, { ID: '1', Name: '未处理' }, { ID: '2', Name: '已处理' }];
        var option1 = "";
        $("#selectState").empty();
        $.each(List, function (i, tag) {
            option1 += "<option value=" + tag.ID + ">" + tag.Name + "</option>";
        });
        $("#selectState").append(option1);

        $("#btnFind").click(function () {

            hisAlarmFun.refresh();
            hisAlarmFun.loadDataCharts();
            //  hisAlarmFun.loadForm();
        });

        //绑定点击事件和文本回车事件
        $(".raddwy").radClick("hisAlarmFun.search");
        $(".dwy").textClick("hisAlarmFun.search");
        //默认查询一天
        $('#rad-day').trigger("click");
        BDZFunction.getmousewheel();
    },
    loadForm: function () {

        hisAlarmFun.initFindWhere();
        let url = '/Graphic/GetHisAlarmMsg';
        clientMode.post(url, searchParam, function (dt) {
            if (dt.length > 0) {
                playlist = {};
                playindex = 0;
                hisAlarmFun.showTable(dt);
            } else {
                layer.msg('没有符合要求的信息...', { icon: 0, time: 2000 });
            }
        });
    },
    //加载部门下拉框
    loadDeptInfo: function () {

        clientMode.post("/Graphic/GetDeptInfoList", null, function (data) {
            if (data !== null) {

                let option = "<option value='all'>所有部门</option>";
                $("#selectDept").empty();
                data.forEach(function (item) {
                    option += "<option value=" + item.Name + ">" + item.Name + "</option>";

                })
                $("#selectDept").append(option);
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
        // hisAlarmFun.loadForm();
        hisAlarmFun.refresh();
        hisAlarmFun.loadDataCharts();


    },
    mouseWheel: function (delta) {
        BDZFunction.mousewhell(delta);
    },

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

    //将表格显示于页面
    showTable: function (data) {
        let operValues = "";
        let prostateCln = "";
        let operCln = "";
        $.each(data, function (i, n) {
            //if (n.Prostate == "0") {
            //    operValues += "<tr role='row' ><td style='text-align:left;width:50px;' role='gridcell' >" + (i + 1) + "</td><td style='text- align:left;width:100px;' role='gridcell'>" + n.TagCode + "</td><td style='text- align:left;width:100px;' role='gridcell'>" + n.Name + "</td><td style='text- align:left;width:100px;' role='gridcell'>" + n.DeptName + "</td><td style='text- align:left;width:150px;' role='gridcell'>" + hisAlarmFun.setAlarmType(n.AlarmType) + "</td><td style='text- align:left;width:200px;' role='gridcell'>" + hisAlarmFun.timeformat(n.StartTime) + "</td><td style='text- align:left;width:200px;' role='gridcell'>" + hisAlarmFun.timeformat(n.EndTime) + "</a></td><td id='tda_" + n.Id + "' style='text- align:left;width:200px;' role='gridcell'><a id='a_" + n.Id + "' onclick=hisAlarmFun.showAttMessage('" + n.Id + "')>" + "未处理" + "</a></td><td id='td_" + n.Id + "' style='text- align:left;width:auto;' role='gridcell'>" + hisAlarmFun.isnullmsg(n.Proresults) + "</td><td style='text- align:left;width:200px;' role='gridcell'>" + n.AreaName + "</td><td><a style= 'text-decoration:none'  title= '测试' ><i class='fa fa-cog fa-lg'></i> 查看录像</a></td></tr>"
            //} else if (n.Prostate == "1") {
            //    operValues += "<tr role='row' ><td style='text-align:left;width:50px;' role='gridcell' >" + (i + 1) + "</td><td style='text- align:left;width:100px;' role='gridcell'>" + n.TagCode + "</td><td style='text- align:left;width:100px;' role='gridcell'>" + n.Name + "</td><td style='text- align:left;width:100px;' role='gridcell'>" + n.DeptName + "</td><td style='text- align:left;width:150px;' role='gridcell'>" + hisAlarmFun.setAlarmType(n.AlarmType) + "</td><td style='text- align:left;width:200px;' role='gridcell'>" + hisAlarmFun.timeformat(n.StartTime) + "</td><td style='text- align:left;width:200px;' role='gridcell'>" + hisAlarmFun.timeformat(n.EndTime) + "</a></td><td style='text- align:left;width:200px;' role='gridcell'>" + "已处理" + "</td><td style='text- align:left;width:auto;' role='gridcell'>" + hisAlarmFun.isnullmsg(n.Proresults) + "</td><td style='text- align:left;width:200px;' role='gridcell'>" + n.AreaName + "</td><td><a style= 'text-decoration:none'  title= '测试' ><i class='fa fa-cog fa-lg'></i> 查看录像</a></td></tr>"
            //}

            if (n.Prostate === "0") {
                // operValues += "<tr><td>" + (i + 1) + "</td><td>" + n.TagCode + "</td><td>" + n.Name + "</td><td>" + n.DeptName + "</td><td>" + hisAlarmFun.setAlarmType(n.AlarmType) + "</td><td>" + hisAlarmFun.timeformat(n.StartTime) + "</td><td>" + hisAlarmFun.timeformat(n.EndTime) + "</a></td><td id='tda_" + n.Id + "'><a id='a_" + n.Id + "' onclick=hisAlarmFun.showAttMessage('" + n.Id + "') > " + "未处理" + "</a></td > <td id='td_" + n.Id + "'>" + hisAlarmFun.isnullmsg(n.Proresults) + "</td> <td>" + n.AreaName + "</td></tr > "
                prostateCln = "<a id='a_" + n.Id + "' onclick=hisAlarmFun.showAttMessage('" + n.Id + "') > " + "未处理" + "</a>";
            } else if (n.Prostate === "1") {
                prostateCln = "已处理";
                // operValues += "<tr><td>" + (i + 1) + "</td><td>" + n.TagCode + "</td><td>" + n.Name + "</td><td>" + n.DeptName + "</td><td>" + hisAlarmFun.setAlarmType(n.AlarmType) + "</td><td>" + hisAlarmFun.timeformat(n.StartTime) + "</td><td>" + hisAlarmFun.timeformat(n.EndTime) + "</a></td><td>" + "已处理" + "</td><td>" + hisAlarmFun.isnullmsg(n.Proresults) + "</td><td>" + n.AreaName + "</td></tr>"
            }


            //电子围栏报警可查看报警类型  alt='" + vid + "'
            if (n.AlarmType === '1') {
                if (n.Almpic === "") { operCln = ""; } else {
                    //downloadhisalm
                    playindex++;
                    let playobj = { vid: n.Almpic, start: hisAlarmFun.timeformat(n.StartTime), end: hisAlarmFun.timeformat(n.EndTime), objname: n.Name };
                    hisAlarmFun.playhisAdd(playindex, playobj);
                    operCln = "<a style='padding-left: 5px;'   onclick='hisAlarmFun.playhisalm(\"" + n.Almpic + "\",\"" + hisAlarmFun.timeformat(n.StartTime) + "\",\"" + hisAlarmFun.timeformat(n.EndTime) + "\"," + playindex + ",\"" + n.Name + "\")' data-ip='" + n.Almpic + "' ><i class='fa fa-camera-retro fa-lg'></i> 查看</a>";
                    //fa-camera-retro fa-upload  fa-video-camera
                    operCln += "&nbsp;&nbsp;<a style='padding-left: 5px;' onclick='hisAlarmFun.downloadhisalm(\"" + n.Almpic + "\",\"" + hisAlarmFun.timeformat(n.StartTime) + "\",\"" + hisAlarmFun.timeformat(n.EndTime) + "\",\"" + n.Name + "\")' ><i class='fa fa-angle-double-down fa-lg'></i> 下载</a>";
                }
            } else {
                operCln = "";
            }

            operValues += "<tr><td>" + (i + 1) + "</td><td>" + n.TagCode + "</td><td>" + n.Name + "</td><td>" + n.DeptName + "</td><td>" + hisAlarmFun.setAlarmType(n.AlarmType) + "</td><td>" + hisAlarmFun.timeformat(n.StartTime) + "</td><td>" + hisAlarmFun.timeformat(n.EndTime) + "</a></td><td id='tda_" + n.Id + "'>" + prostateCln + "</td><td>" + hisAlarmFun.isnullmsg(n.Proresults) + "</td><td>" + n.AreaName + "</td><td>" + operCln + "</td></tr>";


        });
        let tbody = document.getElementById('tbMain');
        tbody.innerHTML = operValues;
    },
    isnullmsg: function (msg) {
        if (msg === null)
            msg = "";
        return msg;
    },
    //弹出输入框
    showAttMessage: function (tid) {

        //EAP.UI.MessageBox.showInput({
        //    content: "请输入处理意见", OK: function (value) {
        //        alert(value);
        //    }
        //})
        let strPath = '/RPM/3DJS/ShowInput.html';
        let lid = tid;
        clientMode.getfile(strPath, function (data) {
            jQuery("#formDialog").html(data);
            $('#lblmessage').html(lid);
            jQuery("#formDialog").dialog({
                width: 400,
                height: 300,
                resizable: false,
                modal: true,
                position: ['center', 50],
                close: function (event, ui) {
                    $("#formDialog").dialog("destroy");
                    $("#formDialog").html("");
                }
            });
        });
    },
    //hisAlarmFun.saveProresults
    saveProresults: function () {
        let strResult = $('#regNames').val();
        let lid = $('#lblmessage').html();
        $('#td_' + lid).html(strResult);
        $('#a_' + lid).remove();
        $('#tda_' + lid).html('已处理');
        let strPath = '/Graphic/UpdateHisAlm';
        let strWhere = { strGuid: lid, strResult: strResult };
        clientMode.post(strPath, strWhere, function (msg) {
            layer.msg("处理完毕...", { icon: 6, time: 2000 });
        });
        hisAlarmFun.indexClose();

    },
    indexClose: function () {
        $("#formDialog").dialog("destroy");
        $("#formDialog").html("");
    },
    setAlarmType: function (type) {
        let strType = "";
        switch (type) {
            case '1':
                strType = "电子围栏报警";
                break;
            case '2':
                strType = "碰撞预警";
                break;
            case '4':
                strType = "求救报警";
                break;
            default:
                strType = "";
                break;
        }
        return strType;
    },
    showCharts: function (seriesList, categoriesList, strtitle) {
        $("#container").kendoChart({
            title: {
                text: "历史报警信息统计 " + strtitle
            },
            legend: {
                position: "top"
            },
            seriesDefaults: {
                type: "column"
            },
            series: seriesList,
            //series: [{
            //    name: "电子围栏报警",
            //    data: [16, 11019, 4195, 21]
            //}, {
            //    name: "碰撞预警",
            //    data: [0, 0, 3269, 0]
            //}],
            valueAxis: {
                labels: {
                    format: "{0}"
                },
                line: {
                    visible: false
                },
                axisCrossingValue: 0
            },
            categoryAxis: {
                //  categories: ["5月16日", "5月17日", "5月18日", "5月21日"],
                categories: categoriesList,
                line: {
                    visible: false
                },
                labels: {
                    padding: { top: 10 }
                }
            },
            tooltip: {
                visible: true,
                format: "{0}",
                template: "#= series.name #: #= value #"
            }
        });
    },

    timeformat: function (tm) {
        return tm.replace('T', ' ').substring(0, 19);
    },

    //  $('#mapInfo').ready(createChart);

    //  $(document).ready(createChart);

    loadPageView() {
        //加载 分页控件 并绑定事件
        $("#tMode_pageLength").html(pageLength);
        $("#selectPageCount").change(function () {
            BDZFunction.pageLengthChange(totalRows, hisAlarmFun.pageselectCallback);
        });
        //  hisAlarmFun.refresh();
    },
    refresh() {

        //var pagingFindMode = { tableName: "", indexPage: 1, pageCount: 10, pathurl: "", where: "" };
        //先查总条数
        hisAlarmFun.initFindWhere();
        pagingFindMode.tableName = "HisAlarm";
        pagingFindMode.pathurl = '/Graphic/GetHisAlarmTotal';
        pagingFindMode.where = searchParam;
        BDZFunction.paginationFind(hisAlarmFun.pageselectCallback);

    },
    pageselectCallback: function (page_index, jq) {
        pagingFindMode.indexPage = (page_index + 1);
        pagingFindMode.pageCount = everyPageCount;
        //$("#tMode").dataTable().fnClearTable();
        //clientMode.post('/Configure/GetPersonList', pagingFindMode, function (data) {
        //    jQuery.each(data, function (i, n) {
        //        $("#tMode").dataTable().fnAddData(["<td class='text-c'><input type='checkbox' id='" + n.ID + "' data-pname='" + n.Name + "' data-height=" + n.Height + " data-tel=" + n.Tel + " data-company=" + n.Company + " data-id='" + n.ID + "'></td>", "<td class='f-14 td-manage text-c'><a style='text-decoration:none' class='ml-5' onclick='PersonnelFunction.personnelEdit(this," + n.ID + ")' title='编辑'><i id='edit_" + n.ID + "' class='Hui-iconfont icoButton'  data-id='" + n.ID + "'>&#xe6df;</i></a><a style='text-decoration:none' class='ml-5' onclick='PersonnelFunction.personnelDel(this," + n.ID + ")' title='删除'><i class='Hui-iconfont icoButton'  data-id='" + n.ID + "'>&#xe6e2;</i></a></td>", n.Name, n.Height, n.Tel, n.Company]);
        //    });
        //});
        hisAlarmFun.loadForm();
        BDZFunction.pageTotalShow(page_index, totalRows);
        return false;
    },
    initFindWhere() {
        let proState = $("#selectState").val();//处理状态
        var taskType = $("#selectType").val();
        let deptName = $("#selectDept").val();  //部门
        if (deptName === "all")
            deptName = "";
        var begin = $("#logmin").val();
        var end = $("#logmax").val();

        if (begin === '' || end === '') {
            layer.msg('时间范围不能为空!', { icon: 0, time: 2000 });
            return;
        }
        let empName = $("#empName").val();  //名称
        let tagNo = $("#tagNo").val();
        searchParam = { startTime: begin, endTime: end, iType: taskType, empName: empName, deptName: deptName, tagNo: tagNo, proState: proState, pageindex: pagingFindMode.indexPage, pagesize: everyPageCount };

    },
    loadDataCharts() {

        hisAlarmFun.initFindWhere();
        let self = taskReportParam.kendoChartParam;
        self.title = searchParam.startTime + "--" + searchParam.endTime;

        let selfTimeType = taskReportParam.parmeter.timeInterval;
        //  '/Graphic/GetHisAlarm';
        let url = '/Graphic/GetHisAlarmAllNum';
        clientMode.post(url, searchParam, function (dt) {
            if (dt.length > 0) {
                self.alarmItem1 = [];
                self.alarmItem2 = [];
                self.alarmItem3 = [];

                self.seriesList = [];
                self.categoriesList = [];

                var indexSelf = "", indexOld = "";
                var totalItem1 = 0;
                var totalItem2 = 0;
                var totalItem3 = 0;
                $.each(dt, function (i, n) {
                    var chkTime = n.StartTime.replace('T', ' ');
                    if (selfTimeType === 1) //天
                    {
                        indexSelf = getCurDateToStr(chkTime);

                    } else if (selfTimeType === 2) //周
                    {
                        indexSelf = getCurWeekToStr(chkTime);
                    } else if (selfTimeType === 3)//月
                    {
                        indexSelf = getCurMonthToStr(chkTime);
                    }
                    if (indexSelf !== indexOld) {
                        if (indexOld === "") {
                            indexOld = indexSelf;
                            if (n.AlarmType === "1") {
                                totalItem1 += n.Prostate;
                            } else if (n.AlarmType === "2") {
                                totalItem2 += n.Prostate;
                            }
                            else if (n.AlarmType === "4") {
                                totalItem3 += n.Prostate;
                            }

                        } else {

                            self.alarmItem1.push(totalItem1);
                            self.alarmItem2.push(totalItem2);
                            self.alarmItem3.push(totalItem3);

                            self.categoriesList.push(indexOld);
                            indexOld = indexSelf;
                            totalItem1 = 0;
                            totalItem2 = 0;
                            totalItem3 = 0;

                            if (n.AlarmType === "1") {
                                totalItem1 += n.Prostate;
                            } else if (n.AlarmType === "2") {
                                totalItem2 += n.Prostate;
                            }
                            else if (n.AlarmType === "4") {
                                totalItem3 += n.Prostate;
                            }
                        }
                    } else {
                        if (n.AlarmType === "1") {
                            totalItem1 += n.Prostate;
                        } else if (n.AlarmType === "2") {
                            totalItem2 += n.Prostate;
                        } else if (n.AlarmType === "4") {
                            totalItem3 += n.Prostate;
                        }
                    }
                });

                //将最后一个统计放入集合
                self.alarmItem1.push(totalItem1);
                self.alarmItem2.push(totalItem2);
                self.alarmItem3.push(totalItem3);

                self.categoriesList.push(indexOld);

                let item1 = { name: "电子围栏报警", data: self.alarmItem1 };
                self.seriesList.push(item1);
                let item2 = { name: "碰撞预警", data: self.alarmItem2 };
                self.seriesList.push(item2);
                let item3 = { name: "求救报警", data: self.alarmItem3 };
                self.seriesList.push(item3);

                hisAlarmFun.showCharts(self.seriesList, self.categoriesList, self.title);
                // hisAlarmFun.showTable(dt);
            } else {
                layer.msg('没有符合要求的信息...', { icon: 0, time: 2000 });
            }
        });
    },

    loadhisvideoinfo() {
        let urlPath = '/Graphic/GetVideoInfoList';
        hisVideoList = {};
        clientMode.post(urlPath, null, function (data) {
            if (data.length > 0) {
                data.forEach((item) => {
                    hisVideoList[item.IPAddress.trim()] = item;
                });
            }
        });
    },
    playhisalm(vid, start, end, curindex, objname) {
        if (vid === undefined || vid === "") {
            alert("没有设置报警录像机...");
            return;
        }
        console.log("playhisvideo:" + vid);
        curplayindex = curindex;
        let vinfo = undefined;
        for (var vi in hisVideoList) {
            if (vi.toString().trim() === vid) {
                vinfo = hisVideoList[vi];
            }
        }
        //根据IP查找摄像机
        // let vinfo = hisVideoList[vip];
        if (vinfo !== undefined) {
            let mouse = { x: 0, y: 0 };
            let showmsg = objname + " " + (new Date(start).Format("MM-dd")) + "(" + (new Date(start).Format("HH:mm:ss")) + "-" + (new Date(end).Format("HH:mm:ss")) + ") " + vinfo.IPAddress;
            let obj = { ip: vinfo.IPAddress, point: mouse, showname: showmsg, DeviceID: vinfo.DeviceID, ChannelID: vinfo.ChannelID };
            //  trackvideo.createHisVideo(obj);
            hisAlarmFun.findm3u8(obj, start, end);

        } else {
            alert(vid + " 不存在可播放的视频文件...");
        }

    },
    downloadhisalm(vid, start, end, objname) {
        if (vid === undefined || vid === "") {
            alert("没有设置报警录像机...");
            return;
        }
        console.log("playhisvideo:" + vid);
        let vinfo = undefined;
        for (var vi in hisVideoList) {
            if (vi.toString().trim() === vid) {
                vinfo = hisVideoList[vi];
            }
        }
        //根据IP查找摄像机
        if (vinfo !== undefined) {
            let strdatetime = getstrdate(start);
            let strdate = strdatetime.substr(0, 8);
            let obj = { ip: vinfo.IPAddress, DeviceID: vinfo.DeviceID, ChannelID: vinfo.ChannelID };
            let url = trackvideo.getplayHism3u8(obj, strdate);

            $.get(url, null, (data) => {
                if (data !== null && data.list.length > 0) {
                    let downtime = new Date(start).Format("yyyyMMddHHmmss") + "/" + new Date(end).Format("yyyyMMddHHmmss");
                    let showmsg = objname + "-" + new Date(start).Format("yyyyMMddHHmmss") + "-" + new Date(end).Format("yyyyMMddHHmmss") +"-"+ obj.ip+".mp4";
                    let downurl = trackvideo.getdownHisVideo(obj, downtime);
                    //let $form = $('<form method="GET"></form>');
                    //$form.attr('action', downurl);
                    //$form.attr('download', showmsg);
                    //$form.appendTo($('body'));
                    //$form.submit();
                    //自定义下载文件名称
                    getBlob(downurl, function (blob) {
                        saveAs(blob, showmsg);
                    });
                } else {
                    alert("没有可下载的视频文件...");
                }
            }).fail(() => {
                alert('历史录像不存在或视频服务器没有打开...');
            });


            // window.open(downurl); //有白屏一闪而过 不友好


        } else {
            alert(vid + " 不存在可下载的视频文件...");
        }
        return "";
    },


    findm3u8(vobj, sdate, end) {
        let totalplaytime = difftime(sdate, end);
        let strdatetime = getstrdate(sdate);
        let strdate = strdatetime.substr(0, 8);
        let hisurl = "";
        let starttime = "";
        //是否进行视频拼接
        let iscmb = false;
        let timecmd = 0;//已经拼接的时间
        let url = trackvideo.getplayHism3u8(vobj, strdate);
        //let downtime = new Date(sdate).Format("yyyyMMddHHmmss") + "/" + new Date(end).Format("yyyyMMddHHmmss");
        //let downurl = trackvideo.getdownHisVideo(vobj, downtime);
        $.get(url, null, (data) => {
            if (data !== null && data.list.length > 0) {
                data.list.forEach(item => {
                    //var sdtime2 = sdtime1.setHours(sdtime1.getHours() -1)//小时
                    let stime = new Date(getdatetime(item.startAt));
                    stime = stime.setSeconds(stime.getSeconds() + item.duration);
                    if (compareTime(new Date(stime).Format("yyyy-MM-dd HH:mm:ss"), sdate) === true && hisurl === "") {
                        starttime = item.startAt;
                        hisurl = item.hls;
                        let totalmin = difftime(getdatetime(starttime), sdate);
                        timecmd = (item.duration - totalmin);
                        ///从报警开始时间到该视频包结束的播放时长小于报警时长就进行拼接
                        if (timecmd < totalplaytime) {
                            iscmb = true;
                        }
                        //测试
                        //let playmode = { vobj: vobj, hisurl: item.hls, totalmin: totalmin, totalmax:(totalplaytime + totalmin) };
                        //curplay.push(playmode);
                    } else if (iscmb === true) {
                        //报警视频被分成两个文件时候
                        let sptime = totalplaytime - timecmd;
                        if (sptime <= item.duration) {
                            let playmode = { vobj: vobj, hisurl: item.hls, totalmin: 0, totalmax: sptime };
                            curplay.push(playmode);
                            iscmb = false;
                        } else {
                            timecmd = timecmd + sptime;
                        }

                    }
                });

            }
            if (hisurl !== "") {
                let totalmin = difftime(getdatetime(starttime), sdate);
                let totalmax = totalplaytime + totalmin;
                hisAlarmFun.showHisVideo(vobj, hisurl, totalmin, totalmax);
                //alert(hisurl);
            } else {
                alert("没有找到该时段的视频文件...");
            }
            // alert(data.list[0]);
        }).fail(() => {
            alert('历史录像不存在或视频服务器没有打开...');
        });
    },
    showHisVideo(obj, rempurl, lengtime, totalmax) {
        // let rempurl = trackvideo.getRTMPUrl(obj);
        let stoptime = totalmax;
        //let showname = obj.showname + "-" + obj.ip;
        let showname = obj.showname;
        let vidplay = "V" + obj.ip.replace(/[.]/g, 'v') + "play";
        let divhtml = "<live-player id='" + vidplay + "' video-url='" + rempurl + "'  current-time='" + lengtime + "' stretch='true'></live-player>";
        jQuery("#formDialog").html(divhtml);
        jQuery("#formDialog").dialog({
            title: showname,
            width: 600,
            height: 400,
            resizable: false,
            modal: true,
            position: ['center', 50],
            close: function (event, ui) {
                let player = document.getElementById(vidplay);
                player.setAttribute("video-url", "");
                $("#formDialog").html("");
                $("#formDialog").dialog("destroy");
            }
        });

        let player = document.getElementById(vidplay);
        player.addEventListener('timeupdate', evt => {
            console.log(evt.detail[0]);
            let minC = evt.detail[0];
            if (minC > stoptime) {
                // let player = document.getElementById(vidplay);

                player.setAttribute("video-url", "");
                $("#formDialog").html("");
                $("#formDialog").dialog("destroy");
                if (curplay.length > 0) {
                    console.log('播放当前报警信息的拼接文件');
                    let playmode = curplay.shift();
                    hisAlarmFun.showHisVideo(playmode.vobj, playmode.hisurl, playmode.totalmin, playmode.totalmax);
                } else if (playindex > 0) {
                    console.log('顺序播放其他报警文件');
                    curplayindex++;
                    let playmode = playlist[curplayindex];
                    if (playmode !== undefined) {
                        hisAlarmFun.playhisalm(playmode.vid, playmode.start, playmode.end, curplayindex, playmode.objname);
                    }


                }

            }
        });
    },

    playhisAdd(pindex, obj) {
        playlist[pindex] = obj;
    },

};

function getBlob(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
        if (xhr.status === 200) {
            cb(xhr.response);
        }
    };
    xhr.send();
}

function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement('a');
        var body = document.querySelector('body');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        // fix Firefox
        link.style.display = 'none';
        body.appendChild(link);
        link.click();
        body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
    };
}


$(function () {
    hisAlarmFun.loadButton();
    hisAlarmFun.loadhisvideoinfo();
    hisAlarmFun.loadDeptInfo();
    hisAlarmFun.loadPageView();
    $(document).bind("kendo:skinChange", hisAlarmFun.showCharts);
    ///获取网络摄像机 GBT28181配置
    trackvideo.initGBT28181();
});

