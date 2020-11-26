let tagCount = 20;
let rtLocTags = {}, TagList = [], showEmpinfo = [];
let rtAreaMsg = {};
let curpage = 1;
var clientMode = new System.Net.HttpClient();
let findday = 1;
var i = 0, sCurText, cssIndex = 0;
applogic = {
    //applogic.addcrcProgress()
    loadapp: function () {
        // circleProgress(20);
      //  initCircleProgress();
        applogic.loadRtEmpInfo();
        curpage = 0;

    },
    loadRtEmpInfo: function () {
        initMqttConfig();
        applogic.loadTagList();
        //applogic.startReadMes();
        setInterval(function () {
            for (var n in rtLocTags) {
                applogic.onRtMessageShow(rtLocTags[n]);
            }
        }, 1000);
    },
    addcrcProgress: function () {
        tagCount = tagCount + 10;
        if (tagCount >= 200)
            tagCount = 200;

        if (procic !== undefined) {
            procic.loadCanvas(tagCount);
        }
    },
    smallerProgress: function () {
        tagCount = tagCount - 10;
        if (tagCount < 0)
            tagCount = 0;

        if (procic !== undefined) {
            procic.init();
            procic.drawQk(tagCount);
        }
    },

    changrtnum: function (num) {
        //rtnum
        $("#rtnum").html(num);
        //if (num >= tagCount) {
        //    procic.loadCanvas(num);
        //    tagCount = num;

        //} else {
        //    procic.init();
        //    procic.drawQk(num);
        //    tagCount = num;
        //}
    },
    //applogic.winhref
    winhref: function (alt) {
        let url = "";
        if (alt === 1) {
            url = 'rtareamsg.html';
        }
        else if (alt === 2) {
            url = 'hisalmmsg.html';
        } else if (alt === 0) {
            url = 'rtempinfo.html';
        }
        //window.location.href = 'New3DMap.html';
        if (url !== "")
            location.href = url;
    },



    loadrtempinfo: function () {
        curpage = 1;
        applogic.loadRtEmpInfo();

    },
    //applogic.loadrtareainfo()
    loadRtArea: function () {
        curpage = 2;
        applogic.loadRtEmpInfo();

    },
    loadTagList: function () {
        TagList = [];
        clientMode.post("/Graphic/GetEmpTagList", null, (data) => {
            data.forEach((d) => {
                let tag = { tName: d.Name, tCode: d.Code, tagCode: d.PositionTag.Code.toLowerCase(), deptname: d.Department.Name, useState: 1, tel: d.Telephone, remark: d.remark, floor: '', DutyName: d.DutyInfo.Name };
                TagList.push(tag);
            });
        })
    },
    /****************************实时人员显示Mqtt********************************************************************/
    onConnectionLost: function () {
        console.log('mqtt failure!! reStart!!');
        applogic.startReadMes();
    },
    startReadMes: function () {

        let host = mqttConfig.Server;// 'mqtt.dev.portsys.cn';//$("#connect_host").val();
        let port = mqttConfig.Port;//$("#connect_port").val();
        let clientId = new Date().getTime().toString(); //$("#connect_clientId").val();
        let user = mqttConfig.UserId; // $("#connect_user").val();
        let password = mqttConfig.Password;// $("#connect_password").val();


        let destination = mqttConfig.rtPs; // rpm/sfloc 
        let mqttClient = new Messaging.Client(host, Number(port), clientId);
        mqttClient.onConnect = () => { mqttClient.subscribe(destination); };
        mqttClient.onMessageArrived = applogic.onRtMessage;
        mqttClient.onConnectionLost = applogic.onConnectionLost;
        mqttClient.connect({
            userName: user,
            password: password,
            onSuccess: () => {
                console.log('mqtt connected successFull.');
                mqttClient.subscribe(destination);
            },
            onFailure: () => {
                console.log('mqtt failure  onFailure');
            }
        });

    },
    onRtMessage: function (event) {
        let rtEmpMsg = '[' + event.payloadString + ']';
        let rtList = JSON.parse(rtEmpMsg);
        rtList.forEach(function (item) {
            rtLocTags[item.UniqueId] = item;

        })
    },
    onRtMessageShow: function (item) {
        if (item.Region === null)
            item.Region = "首层";

        //if (curpage === 2) {
        //    if ($.inArray(item.Region, areaList) === -1) {
        //        areaList.push(item.Region)
        //    }
        //}
        //let rtPoint = { x: Number(item.X) + Number(tranX), y: Number(item.Y) + Number(tranY), z: 0 };
        let rtPoint = { x: Number(item.X), y: Number(item.Y), z: 0 };
        let rtMes = null;
        $.each(TagList, function (i, tag) {
            if (tag.tagCode === item.UniqueId) {
                TagList[i].floor = item.Region;
                tag.floor = item.Region;
                rtMes = tag;
            }
        });

        if (rtMes !== null) {
            rtMes.position = rtPoint;
            if (rtMes.tName !== "" && rtMes.useState === 1)
                applogic.addRtMapEmp(rtMes);
        }

    },
    addRtMapEmp(emp) {
        let ishave = false;
        showEmpinfo.forEach((n) => {
            if (n.tagCode === emp.tagCode) {
                ishave = true;
            }
        });
        if (ishave === false) {
            showEmpinfo.push(emp);
            if (curpage === 0) {
                applogic.changrtnum(showEmpinfo.length);
            }
            else if (curpage === 1) {
                applogic.showrtempinfo();
            } else if (curpage === 2) {
                applogic.loadrtareainfo();
            }
        }
    },
    //applogic.showrtareainfo
    showrtareainfo: function () {
        let operValues = "";
        if (rtAreaMsg === undefined)
            return;
        for (var n in rtAreaMsg) {
            let ct = rtAreaMsg[n];
            let cardmsg = "";
            let header = "";
            if (ct.length > 0) {
                //  alert(ct.length);
                ct.forEach((o) => {
                    header = o.floor;
                    let card = o.tName + "--" + o.deptname + "--" + o.tel;
                    cardmsg += "<p>" + card + "</p>";
                });

            }
            operValues = applogic.createCard(header, cardmsg);

        }
        let tbody = document.getElementById('accordion');
        tbody.innerHTML = operValues;
    },

    testCard: function () {
        let header = "测试区域";
        let cardmsg = "";
        let dddd = [{ tName: "战士", deptname: "AA", tel: "12594586574" }, { tName: "战士23", deptname: "AA", tel: "12594586574" }, { tName: "战士2", deptname: "AA", tel: "12594586574" }];
        if (dddd.length > 0) {

            dddd.forEach((o) => {

                let card = o.tName + "--" + o.deptname + "--" + o.tel;
                cardmsg += "<p>" + card + "</p>";
            });

        }
        operValues = applogic.createCard(header, cardmsg);
        let tbody = document.getElementById('accordion');
        tbody.innerHTML = operValues;
    },
    createCard: function (heard, msg) {
        let areaid = new Date().getTime().toString();
        let card = "<div class='card'><div class='card-header' id='" + areaid + "'><button class='btn btn-link' data-toggle='collapse' data-target='#" + areaid + "_2' aria-expanded='false' aria-controls='" + areaid + "_2><i class='fa fa-user-circle-o'></i> " + heard + " </button></div>";
        //card += "</div><div id='" + areaid + "_2' class='collapse show' aria-labelledby='" + areaid + "' data-parent='#accordion'><div class='card-body'>" + msg + "</div></div></div>";
        card += "<div id='" + areaid + "_2' class='collapse show' aria-labelledby='" + areaid + "' data-parent='#accordion'><div class='card-body'>" + msg + "</div></div></div>";
        return card;
    },
    loadrtareainfo: function () {
        if (showEmpinfo.length === 0)
            return;
        if (rtAreaMsg.length === 0)
            return;
        showEmpinfo.forEach((n) => {
            let floor = n.floor;
            let item = rtAreaMsg[floor];
            //console.log(item.length);
            if (item === undefined) {
                let tags = [];
                rtAreaMsg[n.floor] = tags;
                // applogic.showrtareainfo();
            } else {
                let ishave = true;
                if (item.length === 0) {
                    item.push(n);
                    rtAreaMsg[n.floor] = item;
                    applogic.showrtareainfo();
                } else {
                    item.forEach((o) => {
                        if (o.tagCode === n.tagCode) {
                            ishave = false;
                        }
                    });
                    if (ishave === true) {
                        item.push(n);
                        rtAreaMsg[n.floor] = item;
                        applogic.showrtareainfo();
                    }
                }
            }
        });

    },
    showrtempinfo: function () {
        let operValues = "";
        let index = 0;
        if (showEmpinfo.length > 0) {
            showEmpinfo.forEach((n, i) => {
                index = (i + 1);
                //operValues += "<div id='div" + index + "' class='wthree-list-grid d-flex flex-wrap' onclick='applogic.clkdiv(" + index + ");' ><div class='wthree-list-icon'><span class='num-list' data-blast='color'>" + index + "</span></div><div class='wthree-list-desc'><h6>" + n.deptname + "</h6><h5>" + n.tName + "</h5><p> " + n.tagCode + "--" + n.DutyName + "--" + n.tel + " </p></div></div>";
                operValues += "<div id='div" + index + "' class='wthree-list-grid d-flex flex-wrap' onclick='applogic.clkdiv(" + index + ");' ><div class='wthree-list-icon'><span class='num-list' data-blast='color'>" + index + "</span></div><div class='wthree-list-desc'><h6>" + n.deptname + "</h6><h5>" + n.tName + "</h5><p> " + n.tel + " </p></div></div>";

            });
        }
        let tbody = document.getElementById('hismsg');
        tbody.innerHTML = operValues;
    },
    /****************************历史报警信息刷新*******************/
    //applogic.refreshHisalm
    refreshHisalm: function () {

        $("#findhis").hide();
        findday = findday + 1;
        applogic.loadhisinfo();
    },

    loadhisinfo: function () {
        //applogic.timeformat
        let searchParam = { startTime: applogic.getNowFormatDate(findday), endTime: applogic.getNowFormatDate((findday - 1)), iType: '0', empName: '', deptName: '', tagNo: '', proState: '0' };
        clientMode.post('/Graphic/GetHisAlarm', searchParam, function (dt) {
            if (dt.length > 0) {
                applogic.showhisinfo(dt);
            }
            $("#findhis").show();
        });
    },
    getNowFormatDate: function (day) {
        if (day < 0)
            day = 0;
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate() - day;
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    },
    timeformat: function (tm) {
        return tm.replace('T', ' ').substring(2, 19);
    },
    //applogic.loadrtEmp
    showhisinfo: function (data) {
        let operValues = "";
        let areaName = "";
        $.each(data, function (i, n) {
            if (n.AlarmType === "2") {
                areaName = "设备  碰撞预警";
            } else {
                areaName = n.AreaName;
            }
            // operValues += "<div class='ui- bar ui- bar - a music_list'><a href='' data-ajax='false'><span>" + n.Name +" " + n.AreaName+" " + n.StartTime + "--" + n.EndTime+" </span></a></div>";
            operValues += "<div class='wthree-list-grid d-flex flex-wrap'><div class='wthree-list-icon'><span class='num-list' data-blast='color'>" + (i + 1) + "</span></div><div class='wthree-list-desc'><h6>" + areaName + "</h6><h5>" + n.Name + "</h5><p> " + applogic.timeformat(n.StartTime) + "--" + applogic.timeformat(n.EndTime) + " </p></div></div>";

        });
        let tbody = document.getElementById('hismsg');
        tbody.innerHTML = operValues;
    },
    findrtemp: function () {
        let empname = $('#keyword').val();
        applogic.highlight();
    },

    /**************************HTML5页面查询*********************************/
    //applogic
    highlight: function () {
        applogic.clearSelection();//先清空一下上次高亮显示的内容；
        let flag = 0;
        let bStart = true;

        //$('#tip').text('');
        //$('#tip').hide();
        let searchText = $('#keyword').val();
        let _searchTop = $('#keyword').offset().top + 30;
        let _searchLeft = $('#keyword').offset().left;
        if ($.trim(searchText) == "") {
            //alert(123);
            //  showTips("请输入查找车站名", _searchTop, 3, _searchLeft);
            return;
        }


        // var searchText = $('#keyword').val();//获取你输入的关键字；
        let regExp = new RegExp(searchText, 'g');//创建正则表达式，g表示全局的，如果不用g，则查找到第一个就不会继续向下查找了；
        let content = $("#hismsg").text();
        if (!regExp.test(content)) {
            showTips("没有找到要查找的车站", _searchTop, 3, _searchLeft);
            return;
        } else {
            if (sCurText != searchText) {
                i = 0;
                sCurText = searchText;
            }
        }

        $('h5').each(function () {
            var html = $(this).html();
            var newHtml = html.replace(regExp, '<span class="highlight">' + searchText + '</span>');//将找到的关键字替换，加上highlight属性；

            $(this).html(newHtml);//更新；
            flag = 1;
        });

        if (flag === 1) {
            if ($(".highlight").size() > 1) {
                var _top = $(".highlight").eq(i).offset().top + $(".highlight").eq(i).height();
                var _tip = $(".highlight").eq(i).parent().find("strong").text();
                if (_tip == "") _tip = $(".highlight").eq(i).parent().parent().find("strong").text();
                var _left = $(".highlight").eq(i).offset().left;
                var _tipWidth = $("#tip").width();
                if (_left > $(document).width() - _tipWidth) {
                    _left = _left - _tipWidth;
                }
                //$("#tip").html(_tip).show();
                //$("#tip").offset({ top: _top, left: _left });
                //$("#search_btn").val("查找下一个");
            } else {
                var _top = $(".highlight").offset().top + $(".highlight").height();
                var _tip = $(".highlight").parent().find("strong").text();
                var _left = $(".highlight").offset().left;
                //$('#tip').show();
                //$("#tip").html(_tip).offset({ top: _top, left: _left });
            }
            $("html, body").animate({ scrollTop: _top - 50 });
            i++;
            if (i > $(".highlight").size() - 1) {
                i = 0;
            }
        }
        $('#keyword').val("");

    },
    clearSelection: function () {
        $('h5').each(function () {
            //找到所有highlight属性的元素；
            $(this).find('.highlight').each(function () {
                $(this).replaceWith($(this).html());//将他们的属性去掉；
            });
        });
    },
    //cleardivfouce: function ()
    //{
    //    $('div').each(function () {
    //        //找到所有highlight属性的元素；
    //        $(this).find('.foucediv').each(function () {
    //            $(this).replaceWith($(this).html());//将他们的属性去掉；
    //        });
    //    });
    //},
    clkdiv: function (id) {
        applogic.clearSelection();
        // applogic.cleardivfouce();
        // $("#div" + id).addClass("foucediv");
        if (cssIndex !== 0)
        {
            $("#div" + cssIndex).removeClass("foucediv")
        }
        $("#div" + id).addClass("foucediv");
        cssIndex = id;
    },

  /**************************登陆界面验证*********************************/
    isLogin: function ()
    {
        document.getElementById('strMsg').innerHTML = "";
        let username = $('#name').val();
        let userpwd = $('#password').val();
        let searchParam = { userName: username, strPwd: userpwd };
        clientMode.post('/Home/UserLoginApp', searchParam, function (data) {

            if (data === "ok")
            {
                window.location.href = 'index.html';
               // alert(data);
            } else {
                document.getElementById('strMsg').innerHTML = "用户名或密码不正确...";
            }
          
        });
    },
}

//$(function () {
//    applogic.loadapp();
//});