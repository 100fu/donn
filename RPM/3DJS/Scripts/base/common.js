

(function () {
    System.Handlers.HttpRequestErrorHandler = function (message) {
        alert(message);
    }
    System.Handlers.ErrorMessageHandler = function (message) {
        alert(message);
    }
})();
var cKeyCode = 0;
var wheelIndex = 0;
var radName = "";
var everyPageCount = 10;
var clientMode = new System.Net.HttpClient();
var totalRows = 0;
var pagingFindMode = { tableName: "", indexPage: 1, pageCount: 10, pathurl: "", where: "" };

var radHtmlMode = '<div class="txtlabel"><label style="width:10px">最近:</label></div><div class="radio-box"><input type="radio" id="rad-day" data-id="day" class="raddwy" name="select-1" datatype="*" nullmsg=""><input type="text" id="day" class="dwy"   datatype="n" value="1" /><label for="rad-day">日</label></div>'
    + '<div class="radio-box"><input type="radio" id="rad-week" data-id="week" class="raddwy" name="select-1" datatype="*" nullmsg=""><input type="text" id="week" class="dwy"   datatype="n" value="1" /> <label for="rad-week">周</label></div> '
    + '<div class="radio-box"><input type="radio" id="rad-month" data-id="month" class="raddwy" name="select-1" datatype="*" nullmsg=""><input type="text" id="month" class="dwy"  datatype="n" value="1" /><label for="rad-month">月</label></div>';

var pageLength = '<label>&nbsp;&nbsp;&nbsp;</lblel><label>每页显示 <select id="selectPageCount" style="width:60px" class="select"><option value="10">10</option><option value="25">25</option>'
    + '<option value="50">50</option><option value="100">100</option></select> 条</label><label>&nbsp;&nbsp;&nbsp;</lblel><label id="lblShowCount"></lblel> '

//czlt-2016-03-24 日期输入框回车查询事件
$.fn.textClick = function (search) {
    var $t = $(this);
    $t.keypress(function (event) {
        if (event.keyCode == "13") {
            var dataid = event.target.id; //$(".dwy").data("id");
            var txtValue = $("#" + dataid).val();
            var chk = $("#rad-" + dataid)[0].checked;
            //alert('你输入的内容为：' + txtValue + " " + dataid + " 单选按钮是否被选中:" + chk);

            var logmin = changeTextValue(dataid, txtValue);
            var logmax = changeTextValue(dataid, 0);
            $("#logmin").val(logmin);
            $("#logmax").val(logmax);

            eval(search + "('" + dataid + "','" + txtValue + "')");
        }
    });
    $t.keyup(function (e) {
        var dataid = event.target.id; //$(".dwy").data("id");
        //var txtValue = $("#" + dataid).val();

        var tmptxt = $(this).val();
        $(this).val(tmptxt.replace(/\D|^0/g, ''));
        tmptxt = $(this).val();
        if (tmptxt === '') {
            $(this).val(1);
        }
        tmptxt = $(this).val();

        var logmin = changeTextValue(dataid, tmptxt);
        var logmax = changeTextValue(dataid, 0);
        $("#logmin").val(logmin);
        $("#logmax").val(logmax);
        //$("#" + dataid).val(tmptxt.replace(/\D|^0/g, '1'))




    });
    $t.keydown(function (event) {
        var eventObj = event || e;
        var keyCode = eventObj.keyCode || eventObj.which;
        if ((keyCode >= 48 && keyCode <= 57)) {
            var tmptxt = $(this).val();
            if (tmptxt >= 1) {
                $(this).val("");
            }
        }


    });

};
function split(val) {
    return val.split(/;\s*/);
}
function extractLast(term) {
    return split(term).pop();
}

//判断字符串是否为正整数
function isInteger(num) {
    if (!(/(^[1-9]\d*$)/.test(num))) {

        return false;
    }
    return true;
}
function isChkIP(strip) {
    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;//正则表达式   
    if (re.test(ip)) {
        if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256)
            return true;
    }
    return false;
}

function isChkHHmmss(strtime) {
    let regex = /^(?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;

    if (!regex.test(time)) {

        let regexs = /^(?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]$/;

        if (!regexs.test(time)) {
            return false;
        }

        // form.time.value = time + ":00";
    }
    return true;
}

//define(function (require, exports, module) {
//    exports.addEvent = (function (window, undefined) {
//        var _eventCompat = function (event) {
//            var type = event.type;
//            if (type == 'DOMMouseScroll' || type == 'mousewheel') {
//                event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
//            }
//            //alert(event.delta);
//            if (event.srcElement && !event.target) {
//                event.target = event.srcElement;
//            }
//            if (!event.preventDefault && event.returnValue !== undefined) {
//                event.preventDefault = function () {
//                    event.returnValue = false;
//                };
//            }
//            /* 
//               ......其他一些兼容性处理 */
//            return event;
//        };
//        if (window.addEventListener) {
//            return function (el, type, fn, capture) {
//                if (type === "mousewheel" && document.mozHidden !== undefined) {
//                    type = "DOMMouseScroll";
//                }
//                el.addEventListener(type, function (event) {
//                    fn.call(this, _eventCompat(event));
//                }, capture || false);
//            }
//        } else if (window.attachEvent) {
//            return function (el, type, fn, capture) {
//                el.attachEvent("on" + type, function (event) {
//                    event = event || window.event;
//                    fn.call(el, _eventCompat(event));
//                });
//            }
//        }
//        return function () { };
//    })(window);
//});

var showDetailLists = [];
function timeInterval(begin, end) {
    var startTime = new Date(begin.replace(/-/, '/'));
    var endTime = new Date(end.replace(/-/, '/'));
    var date3 = endTime.getTime() - startTime.getTime(); //相隔总毫秒数
    return date3;
}
function timeIntervalMin(begin, end) {
    var isTrue = true;
    var date3 = timeInterval(begin, end);
    var min = Math.floor(date3 / (60 * 1000)); //相隔分钟数
    if (min < 0)
        return false;
    if (min > 10)
        isTrue = false;
    return isTrue;
}
function changeDateValue(begin, time) {

    let datetime = new Date(begin.replace(/-/, '/'));
    let oldDT = new Date(begin.replace(/-/, '/'));
    datetime.setUTCMinutes(datetime.getUTCMinutes() + time);//  getUTCMinutes
    let dt = datetime.toString();


    //  layer.msg('开始时间：' + dt, { icon: 5, time: 3000 });
    let year = datetime.getYear();
    year = datetime.getFullYear();
    let month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    let date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    if (datetime.getDate() !== oldDT.getDate()) {
       // if (time > 0)
        {
            year = oldDT.getFullYear();
            month = oldDT.getMonth() + 1 < 10 ? "0" + (oldDT.getMonth() + 1) : oldDT.getMonth() + 1;
            date = oldDT.getDate() < 10 ? "0" + oldDT.getDate() : oldDT.getDate();
        }
        let reTime = year + "-" + month + "-" + date;
        return reTime;
    }


    let hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    let minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    let second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    //let endTime = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    let endTime = year + "-" + month + "-" + date;
    return endTime;
}
function changeTextValue(obj, time) {
    var datetime = new Date();
    var year;
    var month;
    var date;
    if (obj === "day") {
        datetime.setUTCDate(datetime.getUTCDate() - time);
    } else if (obj === "week") {
        datetime.setUTCDate(datetime.getUTCDate() - (time * 7));
    } else if (obj === "month") {
        datetime.setUTCMonth(datetime.getUTCMonth() - time);
    } else if (obj === "hour") {
        datetime.setUTCHours(datetime.getUTCHours() - time);
    } else if (obj === "min") {
        datetime.setUTCMinutes(datetime.getUTCMinutes - time);//  getUTCMinutes
    }
    year = datetime.getFullYear();
    month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}
//czlt-2016-03-24 单选按钮点击事件
$.fn.radClick = function (search) {
    var $t = $(this);
    $t.bind("click", function (event) {

        var id = event.target.id;
        if (id === undefined)
            id = "rad-day";
        //var chk = $('input[id="' + id + '"]')[0].checked;               
        var dataId = $("#" + id).data("id");
        radName = dataId;
        var txtValue = $("#" + dataId).val();

        $(".dwy").attr("readonly", "readonly");
        $(".dwy").attr("style", "background:white");
        //$(".dwy").val("1");
        $("#" + dataId).removeAttr("readonly").removeAttr("style");
        $("#" + dataId).attr("style", "background:rgba(0, 148, 255,0.2)").focus().val(txtValue);

        var logmin = changeTextValue(dataId, txtValue);
        var logmax = changeTextValue(dataId, 0);
        $("#logmin").val(logmin);
        $("#logmax").val(logmax);

        eval(search + "('" + dataId + "','" + txtValue + "')");

    });

};
var BDZFunction = {

    checkNum: function () {

        // var specialKey = "#!@&()$%\^*\'\"\+\_";//Specific Key list
        var specialKey = "/[^\d]/g,";
        var realkey = String.fromCharCode(event.keyCode);
        console.log(realkey);
        var flg = false;
        flg = (specialKey.indexOf(realkey) >= 0);
        if (flg === true)
        { event.returnValue = false; }
        else if (event.keyCode === 8 || event.keyCode === 46)
        {
            console.log(event.keyCode);
        } else if (!((event.keyCode >= 48 && event.keyCode <= 57)))
        { event.returnValue = false; }
       



    },
    handle: function (delta) {
        //var t1=document.getElementById("wheelDelta");
        //var number =parseInt(t1.value);
        //number=number+delta;

        //if (number <= 1)
        //    number = 1;
        //if (number >= 9)
        //    number = 9;
        //t1.value=number;
    },
    wheel: function (event) {
        var delta = 0;


        if (!event) /* For IE. */
            event = window.event;
        if (event.wheelDelta) { /* IE/Opera. */
            delta = event.wheelDelta / 120;
        } else if (event.detail) { /** Mozilla case. */
            /** In Mozilla, sign of delta is different than in IE.
             * Also, delta is multiple of 3.
             */
            delta = -event.detail / 3;
        }
        /** If delta is nonzero, handle it.
         * Basically, delta is now positive if wheel was scrolled up,
         * and negative, if wheel was scrolled down.
         */

        wheelIndex++;
        if (wheelIndex % 2 === 0) {
            if (delta)
                handle(delta);
        }
        /** Prevent default actions caused by mouse wheel.
         * That might be ugly, but we handle scrolls somehow
         * anyway, so don't bother here..
         */
        if (event.preventDefault)
            event.preventDefault();
        event.returnValue = false;
    },
    mousewhell: function (delta) {
        // alert(delta);
        if (radName !== "") {
            var chk = $("#rad-" + radName)[0].checked;
            if (chk === true && document.activeElement.id === radName) {
                var index = 0;
                index = delta / 120;
                wheelIndex++;
                if (wheelIndex % 2 === 0) {
                    //HisTaskFunction.handle(index);
                    var t1 = document.getElementById(radName);
                    var number = parseInt(t1.value);
                    number = number + index;
                    if (number <= 1)
                        number = 1;
                    if (number >= 9)
                        number = 9;
                    t1.value = number;

                }
            }
            var tmptxt = $("#" + radName).val();
            var logmin = changeTextValue(radName, tmptxt);
            var logmax = changeTextValue(radName, 0);
            $("#logmin").val(logmin);
            $("#logmax").val(logmax);
        }
    },
    autoComplete: function (obj, url, multiselect) {
        if (multiselect) {
            $(obj)
                .bind("keydown", function (event) {
                    if (event.keyCode === $.ui.keyCode.TAB && $(this).data("autocomplete").menu.active) {
                        event.preventDefault();
                    }
                })
                .autocomplete({
                    //             source: function (request, response) {
                    //                    $.ajax({
                    //                        url: url,
                    //                        dataType: "json",
                    //                        data: {   filters: extractLast(request.term) },
                    //                        cache:false,
                    //                        success: function (data) {
                    //                            response(data);
                    //                        }
                    //                    });
                    //                },
                    source: function (request, response) {
                        $.getJSON(url, {
                            filters: extractLast(request.term)
                        }, response);
                    },
                    minLength: 0,
                    scroll: true,
                    scrollHeight: 200,//提示的高度，溢出显示滚动条
                    autoFocus: true,
                    search: function () {
                        var term = extractLast(this.value);

                        if (term.length < 0) {
                            return false;
                        }
                    },
                    focus: function () {
                        return false;
                    },
                    select: function (event, ui) {
                        var terms = split(this.value);
                        terms.pop();
                        terms.push(ui.item.label);
                        terms.push("");
                        this.value = terms.join(";");
                        return false;
                    }
                });
        }
        else {
            $(obj).autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: url,
                        dataType: "json",
                        data: { filters: request.term },
                        cache: false,
                        success: function (data) {
                            response(data);
                        }
                    });
                },
                select: function (event, ui) {
                    $(obj).val(ui.item.value);
                    return false;
                }
            });
        }
    },
    htmlHref: function (objId, ids, startTime, endTime) {
        //var bStopIndex = 0;
        //var _href = '/3DJS/personHisMode.html';
        //var topWindow = $(window.parent.document);
        //var show_navLi = topWindow.find("#min_title_list li");
        //show_navLi.removeClass("active").eq(bStopIndex).addClass("active");
        //var iframe_box = topWindow.find("#iframe_box");
        //iframe_box.find(".show_iframe").hide().eq(bStopIndex).show();
        //if (bStopIndex == 0) {
        //    mode2d3dFunction.showMessage();
        //}
        //iframe_box.find(".show_iframe").hide().eq(bStopIndex).show().find("iframe").attr("src", _href);           
        var bStop = false;
        var bStopIndex = 0;
        var _href = '/3DJS/personHisMode.html?taskid=' + objId + '&perids=' + ids + '&start=' + startTime + '&end=' + endTime + '';
        var _datahref = '/3DJS/personHisMode.html';

        var _titleName = '历史轨迹回放';
        var topWindow = $(window.parent.document);
        var show_navLi = topWindow.find("#min_title_list li");
        show_navLi.each(function () {
            if ($(this).find('span').attr("data-href") == _datahref) {
                bStop = true;
                bStopIndex = show_navLi.index($(this));
                return false;
            }
        });
        if (!bStop) {
            creatIframe(_href, _titleName);
            min_titleList();
        }
        else {
            BDZFunction.createCookie(objId, ids, startTime, endTime);
            //HisPerFunction.findHisPathOther(objId, ids, startTime, endTime);
            show_navLi.removeClass("active").eq(bStopIndex).addClass("active");
            var iframe_box = topWindow.find("#iframe_box");
            iframe_box.find(".show_iframe").hide().eq(bStopIndex).show();
            //iframe_box.find(".show_iframe").hide().eq(bStopIndex).show().find("iframe").attr("src", _href);  

        }
        //等3D模型加载完毕以后再显示人员轨迹
        // HisPerFunction.findHisPathOther(objId, ids, startTime, endTime);



    },
    paginationClick: function (num_entries, pageCount, pageselectCallback) {
        everyPageCount = pageCount;
        pagingFindMode.indexPage = 1;
        $("#Pagination").pagination(num_entries, {
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            callback: eval(pageselectCallback),
            items_per_page: pageCount, //每页显示1项
            current_page: (pagingFindMode.indexPage - 1), //被初始化时显示哪一页。Default: 0
            prev_text: "上一页",
            next_text: "下一页"
        });
    },
    paginationFind: function (pageselectCallback) {
        clientMode.post(pagingFindMode.pathurl, pagingFindMode.where, function (data) {
            if (data !== null) {
                if (data > 0) {
                    totalRows = data;
                    BDZFunction.paginationClick(totalRows, pagingFindMode.pageCount, eval(pageselectCallback));
                }
            }
        });
    },
    pageLengthChange: function (num_entries, pageselectCallback) {
        var pageLength = $("#selectPageCount").val();
        if (num_entries !== 0) {
            BDZFunction.paginationClick(num_entries, pageLength, pageselectCallback);
        }

    },
    pageTotalShow: function (page_index, total) {
        if ((page_index + 1) * everyPageCount >= total) {
            if (total === 0) {
                $("#lblShowCount").html("显示 0 到 0 共 0 条 ");
            } else {
                $("#lblShowCount").html("显示 " + (page_index * everyPageCount + 1) + " 到 " + total + " 共 " + total + " 条 ");
            }
        } else {
            $("#lblShowCount").html("显示 " + (page_index * everyPageCount + 1) + " 到 " + (page_index + 1) * everyPageCount + " 共 " + total + " 条 ");
        }
    },
    showMessage: function (index, message) {
        if (index === 1) //正确
        {
            $("#lblMessage").css({ "color": "blue" });
        }
        else  //错误
        {
            $("#lblMessage").css({ "color": "red" });
        }
        $("#lblMessage").html(message);
    },
    getIds: function (obj) {
        var Ids = [];
        if (obj !== null) {
            $.each(obj, function (i, val) {
                Ids.push(val.ID);
            });
        } else {
            Ids.push(0)
        }
        return Ids.join(",");
    },
    getId: function (obj) {
        var ruleId = "";
        if (obj === null) {
            ruleId = "0";
        } else {
            ruleId = obj.ID;
        }
        return ruleId;
    },
    getName: function (obj) {
        var ruleId = "";
        if (obj === null) {
            ruleId = "无";
        } else {
            ruleId = obj.Name;
        }
        return ruleId;
    },
    getNames: function (obj) {
        var Names = [];
        if (obj !== null) {
            $.each(obj, function (i, val) {
                Names.push(val.Name);
            });
        } else {
            Names.push(0);
        }
        return Names.join(",");
    },
    getTaskStatus: function (obj) {
        var x = "";
        //作业状态:1-未开始;2-已开始;3-已完成;4-已审核
        switch (obj) {
            case 1:
                x = "未开始";
                break;
            case 2:
                x = "已开始";
                break;
            case 3:
                x = "已完成";
                break;
            case 4:
                x = "已审核";
                break;

            default:
                x = "未开始";
                break;
        }
        return x;
    },
    getTaskType: function (id) {
        var x = "";
        switch (id) {
            case 1:
                x = "巡检";
                break;
            case 2:
                x = "检修";
                break;

            default:
                x = "巡检";
                break;
        }
        return x;
    },
    getAlarmType: function (id) {
        var x = "";
        switch (id) {
            case 1:
                x = "出围栏";
                break;
            case 2:
                x = "偏离路线";
                break;
            case 3:
                x = "检查时间不足";
                break;
            case 4:
                x = "检查顺序异常";
                break;

            default:
                x = "无";
                break;
        }
        return x;
    },
    getDateTime: function (date, type) {
        let retStr = "";
        if (date !== null) {
            if (type === 0) {
                let strList = date.split(" ");
                retStr = strList[0] + "_" + strList[1];
            } else if (type === 1) {
                let strList = date.split("_");
                retStr = strList[0] + " " + strList[1];

            }
        }
        return retStr;
    },
    getCookies: function (name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr !== null) return unescape(arr[2]); return null;
    },
    accordionFill: function () {
        $("#accordion").accordion({
            heightStyle: "fill"
        });
    },
    accordionShow: function () {
        $("#accordion-resizer").resizable({
            minHeight: 140,
            minWidth: 200,
            resize: function () {
                $("#accordion").accordion("refresh");
            }
        });
    },
    showChkPointDetail: function (id) {
        // HisTaskFunction.loadChkPointDetail(id);
        // HisTaskFunction.loadChkPointDetail(id);
        var par = { taskid: id };
        clientMode.post('/ControlMs/GetCheckPointDetailByTaskId', par, function (data) {
            if (data !== null && data.length > 0) {
                var option = "";
                option += "<tbody>";
                jQuery.each(data, function (i, n) {
                    if (n.OrderAlarmStatus === true && n.TimeAlarmStatus === true) {
                        option += "<tr ><td>" + n.PersonName + "</td><td>" + n.CheckPointName + "</td><td>" + (n.EnterTime === null ? '--' : n.EnterTime) + "</td><td>" + (n.ExitTime === null ? '--' : n.ExitTime) + "</td><td style='background:rgba(250, 20, 20, 0.6)'>" + (n.CheckTimeDesc === null ? '无' : n.CheckTimeDesc) + "</td><td style='background:rgba(250, 20, 20, 0.6)'>" + (n.CheckOrderDesc === null ? '无' : n.CheckOrderDesc) + "</td><td >" + n.AlarmDesc + "</td></tr>";
                    }
                    else if (n.EnterTime === null) {
                        option += "<tr ><td>" + n.PersonName + "</td><td>" + n.CheckPointName + "</td><td>" + (n.EnterTime === null ? '未开始' : n.EnterTime) + "</td><td>" + (n.ExitTime === null ? '' : n.ExitTime) + "</td><td>" + (n.CheckTimeDesc === null ? '无' : n.CheckTimeDesc) + "</td><td>" + (n.CheckOrderDesc === null ? '无' : n.CheckOrderDesc) + "</td><td>" + n.AlarmDesc + "</td></tr>";
                    } else if (n.ExitTime === null) {
                        option += "<tr ><td>" + n.PersonName + "</td><td>" + n.CheckPointName + "</td><td>" + (n.EnterTime === null ? '' : n.EnterTime) + "</td><td>" + (n.ExitTime === null ? '未结束' : n.ExitTime) + "</td><td>" + (n.CheckTimeDesc === null ? '无' : n.CheckTimeDesc) + "</td><td>" + (n.CheckOrderDesc === null ? '无' : n.CheckOrderDesc) + "</td><td>" + n.AlarmDesc + "</td></tr>";

                    } else if (n.OrderAlarmStatus === true && n.TimeAlarmStatus === false) {
                        option += "<tr><td>" + n.PersonName + "</td><td>" + n.CheckPointName + "</td><td>" + (n.EnterTime === null ? '--' : n.EnterTime) + "</td><td>" + (n.ExitTime === null ? '--' : n.ExitTime) + "</td><td style='background:rgba(0, 255, 33,0.6)'>" + (n.CheckTimeDesc === null ? '无' : n.CheckTimeDesc) + "</td><td style='background:rgba(250, 20, 20, 0.6)'>" + (n.CheckOrderDesc === null ? '无' : n.CheckOrderDesc) + "</td><td >" + n.AlarmDesc + "</td></tr>";
                    } else if (n.OrderAlarmStatus === false && n.TimeAlarmStatus === true) {
                        option += "<tr><td>" + n.PersonName + "</td><td>" + n.CheckPointName + "</td><td>" + (n.EnterTime === null ? '--' : n.EnterTime) + "</td><td>" + (n.ExitTime === null ? '--' : n.ExitTime) + "</td><td style='background:rgba(250, 20, 20, 0.6)'>" + (n.CheckTimeDesc === null ? '无' : n.CheckTimeDesc) + "</td><td style='background:rgba(0, 255, 33,0.6)'>" + (n.CheckOrderDesc === null ? '无' : n.CheckOrderDesc) + "</td><td >" + n.AlarmDesc + "</td></tr>";
                    } else if (n.OrderAlarmStatus === false && n.TimeAlarmStatus === false) {
                        option += "<tr><td>" + n.PersonName + "</td><td>" + n.CheckPointName + "</td><td>" + (n.EnterTime === null ? '--' : n.EnterTime) + "</td><td>" + (n.ExitTime === null ? '--' : n.ExitTime) + "</td><td style='background:rgba(0, 255, 33,0.6)'>" + (n.CheckTimeDesc === null ? '无' : n.CheckTimeDesc) + "</td><td style='background:rgba(0, 255, 33,0.6)'>" + (n.CheckOrderDesc === null ? '无' : n.CheckOrderDesc) + "</td><td >" + n.AlarmDesc + "</td></tr>";
                    } else {
                        option += "<tr><td>" + n.PersonName + "</td><td>" + n.CheckPointName + "</td><td>" + (n.EnterTime === null ? '' : n.EnterTime) + "</td><td>" + (n.ExitTime === null ? '' : n.ExitTime) + "</td><td>" + (n.CheckTimeDesc === null ? '无' : n.CheckTimeDesc) + "</td><td>" + (n.CheckOrderDesc === null ? '无' : n.CheckOrderDesc) + "</td><td>" + n.AlarmDesc + "</td></tr>";
                    }
                });

                option += "</tbody></table>";
                showDetailLists = "";
                showDetailLists = option;
                BDZFunction.loadChkPointMessage(data[0].TaskName);
            } else { layer.msg('没有可显示的信息!', { icon: 0, time: 2000 }); }
        }, true, function (err) { });
    },
    loadChkPointMessage: function (obj) {
        clientMode.getfile('/FromEdit/Management/ShowChkPointDetail.html', function (data) {
            jQuery("#formShowDialog").empty().html(data);
            $("#chktMode").append(showDetailLists);
            jQuery("#formShowDialog").dialog({
                title: "作业明细:" + obj,
                modal: true,
                fit: true,
                autoOpen: true,
                width: 740,
                height: 350,
                position: ['center', 50],
                close: function (event, ui) {
                    $("#formShowDialog").dialog("destroy");
                    $("#formShowDialog").html("");
                }
            });
        });
    },

    createCookie: function (taskId, personIds, startTime, endTime) {
        $.cookie('taskid', null);
        $.cookie('personid', null);
        $.cookie('startTime', null);
        $.cookie('endTime', null);
        $.cookie('taskid', taskId, { expires: 365, path: '/' });
        $.cookie('personid', personIds, { expires: 365, path: '/' });
        if (startTime === "") {
            $.cookie('startTime', null, { expires: 365, path: '/' });
        } else {
            $.cookie('startTime', BDZFunction.getDateTime(startTime, 1), { expires: 365, path: '/' });
        }
        if (endTime === "") {
            $.cookie('endTime', null, { expires: 365, path: '/' });
        } else { $.cookie('endTime', BDZFunction.getDateTime(endTime, 1), { expires: 365, path: '/' }); }


    },
    //浏览器版本判断
    getBrowserVersion: function () {
        if ($.browser.msie) {
            alert("IE浏览器");
        } else if ($.browser.opera) {
            alert("opera浏览器");
        } else if ($.browser.mozilla) {
            alert("火狐浏览器");
        } else if ($.browser.safari) {
            alert("safari浏览器");
        }
        //火狐浏览器支持window.event
        //if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
        //    var _E = function () {
        //        var c = _E.caller;
        //        while (c.caller) c = c.caller;
        //        return c.arguments[0]
        //    };
        //    __defineGetter__("event", _E);
        //}
    },
    getOs: function () {

        if (navigator.userAgent.indexOf("MSIE") > 0) {
            return "MSIE";
        } else if (navigator.userAgent.split(";")[1].toLowerCase().indexOf("msie 6.0") > 0) {
            return "IE6";
        } else if (navigator.userAgent.split(";")[1].toLowerCase().indexOf("msie 7.0") > 0) {
            return "IE7";
        } else if (navigator.userAgent.split(";")[1].toLowerCase().indexOf("msie 8.0") > 0) {
            return "IE8";
        }
        else if (navigator.userAgent.indexOf("Firefox") > 0) {
            return "Firefox";
        } else if (navigator.userAgent.indexOf("Chrome") > -1) {
            return "Chrome";
        } else if (isSafari = navigator.userAgent.indexOf("Safari") > 0) {
            return "Safari";
        } else
            if (isCamino = navigator.userAgent.indexOf("Camino") > 0) {
                return "Camino";
            } else
                if (isMozilla = navigator.userAgent.indexOf("Gecko/") > 0) {
                    return "Gecko";
                }
    },

    getmousewheel: function () {
        if (radName === "")
            return;
        var chk = $("#rad-" + radName)[0].checked;
        if (chk === true && document.activeElement.id === radName) {
            var oBox = document.getElementById(radName);
            //ie chrome
            document.onmousewheel = mousewheel;
            if (document.addEventListener) {
                //火狐
                document.addEventListener('DOMMouseScroll', mousewheel, false);
            }

            function mousewheel(ev) {
                var oEvent = ev || event;
                var type = oEvent.type;
                if (type == 'DOMMouseScroll') {
                    oEvent.delta = -(oEvent.detail || 0) / 3;
                }
                else if (type == 'mousewheel') {
                    oEvent.delta = oEvent.wheelDelta / 120;
                }
                // addEventLisrener 绑定的时间需要通过event对象下面的的 preventDefaul
                if (oEvent.preventDefault) {
                    oEvent.preventDefault();
                }
                BDZFunction.changeTxtValue(oEvent.delta);
                return false;//阻止默认行为(阻止的是 obj.on时间名称=fn 所触发的默认行为)
            }
        }
    },

    changeTxtValue: function (delta) {
        // alert(delta);
        if (radName !== "") {
            let isfocus = document.getElementById(radName);
            ///当文本框为选中状态时进行滚轮操作
            if (isfocus === document.activeElement) {
                let chk = $("#rad-" + radName)[0].checked;
                if (chk === true && document.activeElement.id === radName) {

                    var index = 0;
                    index = delta / 1;
                    wheelIndex++;
                    if (wheelIndex % 2 === 0) {
                        //HisTaskFunction.handle(index);
                        var t1 = document.getElementById(radName);
                        var number = parseInt(t1.value);
                        number = number + index;
                        if (number <= 1)
                            number = 1;
                        if (number >= 9)
                            number = 9;
                        t1.value = number;

                    }
                }

                var tmptxt = $("#" + radName).val();
                var logmin = changeTextValue(radName, tmptxt);
                var logmax = changeTextValue(radName, 0);
                $("#logmin").val(logmin);
                $("#logmax").val(logmax);
            }
        }
    },

};

//判断当前日期为当月第几周
var getMonthWeek = function (a, b, c) {
    //a = d = 当前日期
    //b = 6 - w = 当前周的还有几天过完(不算今天)
    //a + b 的和在除以7 就是当天是当前月份的第几周
    var date = new Date(a, parseInt(b) - 1, c), w = date.getDay(), d = date.getDate();
    return Math.ceil((d + 6 - w) / 7);
};
//判断当前日期为当年第几周
//方法里面要传入三个值分别为当前日期的年、月、日三个值
var getYearWeek = function (a, b, c) {
    //date1是当前日期
    //date2是当年第一天
    //d是当前日期是今年第多少天
    //用d + 当前年的第一天的周差距的和在除以7就是本年第几周
    var date1 = new Date(a, parseInt(b) - 1, c), date2 = new Date(a, 0, 1),
        d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    return Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7);
};
var getStrToDate = function (s) {
    // s = s.replace(/-/g, "/");
    var datetime = new Date(s.replace(/-/, '/'));
    return datetime;
};

///获取当前周
var getCurWeekToStr = function (s) {
    var datetime = getStrToDate(s);
    var year1 = datetime.getFullYear();
    var month1 = datetime.getMonth() + 1;
    var date1 = datetime.getDate();
    var week1 = getYearWeek(year1, month1, date1);
    return "第" + week1 + "周";
};
///获取当前月
var getCurMonthToStr = function (s) {
    var datetime = getStrToDate(s);
    var year1 = datetime.getFullYear();
    var month1 = datetime.getMonth() + 1;
    return month1 + "月";
};
///获取当月日期
var getCurDateToStr = function (s) {
    var datetime = getStrToDate(s);
    var year1 = datetime.getFullYear();
    var month1 = datetime.getMonth() + 1;
    var date1 = datetime.getDate();
    return month1 + '月' + date1 + "日";
};
//$(document).ready(function () {
//    //var bdzcontroller = new BDZ.TagInfo();
//    //jQuery('#save').click(function () {
//    //    var postadata = {};
//    //    bdzcontroller.Invoke('Save')
//    //    bdzcontroller.ExecuteAction('save');
//    //});
//});

function getDateDiff(begin, end,itype) {

    let datetime = new Date(begin.replace(/-/, '/'));
    let endtime = new Date(end.replace(/-/, '/'));
    let dateDiff = endtime.getTime() - datetime.getTime();//时间差的毫秒数
    //0-相差毫秒数  1-相差秒数 2-相差分钟 3-相差小时 4-相差天数
    if (itype === 1) {
        let dayDiff = Math.floor(dateDiff /1000);
        dateDiff = dayDiff;
    }
    else if (itype === 2) {
        let dayDiff = Math.floor(dateDiff / (60 * 1000));
        dateDiff = dayDiff;
    }
    else if (itype === 3) {
        let dayDiff = Math.floor(dateDiff / (3600 * 1000));
        dateDiff = dayDiff;
    }
    else if (itype === 4) {
        let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));
        dateDiff = dayDiff;
    }  
    return dateDiff;
};

//获取当前时间
function getCurrentDate() {
    let datetime = new Date();
    datetime.setUTCMinutes(datetime.getUTCMinutes());//  getUTCMinutes
    //  layer.msg('开始时间：' + dt, { icon: 5, time: 3000 });
    let year = datetime.getYear();
    year = datetime.getFullYear();
    let month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    let date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    let endTime = year + "-" + month + "-" + date;
    return endTime;
};

function timeFormate(timeStamp) {
    let curDate = new Date();
    if (timeStamp !== "") {
        curDate = new Date(timeStamp);
    }
    curDate.setUTCMinutes(curDate.getUTCMinutes()-1);
    let year = curDate.getFullYear();
    let month =
        curDate.getMonth() + 1 < 10
            ? "0" + (curDate.getMonth() + 1)
            : curDate.getMonth() + 1;
    let date =
        curDate.getDate() < 10
            ? "0" + curDate.getDate()
            : curDate.getDate();
    let hh =
        curDate.getHours() < 10
            ? "0" + curDate.getHours()
            : curDate.getHours();
    let mm =
        curDate.getMinutes() < 10
            ? "0" + curDate.getMinutes()
            : curDate.getMinutes();
    let ss =
        curDate.getSeconds() < 10
            ? "0" + curDate.getSeconds()
            : curDate.getSeconds();
    // return year + "年" + month + "月" + date +"日"+" "+hh+":"+mm ;
    return year + "-" + month + "-" + date + " " + hh + ":" + mm + ":" + ss;

};













