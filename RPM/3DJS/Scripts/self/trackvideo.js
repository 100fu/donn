
var isover = false;
//var step = 500;
var step = 330;
var stepHeight = 330;
var isStartRecord = false;
var webSk = undefined;
var gbt28181Config = {
    SmsSerial: '192.168.8.46',
    SmsListen: 11935,
    CmsIp: '192.168.8.71',
    CmsPort: 10012
};
//var videoList = [
//    { IPAddress: '192.168.8.122', Port: 80, Username: 'admin', Password: '123456@q', ChannelId: 1, g_iWndIndex: 0 },
//    { IPAddress: '192.168.8.123', Port: 80, Username: 'admin', Password: '123456@q', ChannelId: 1, g_iWndIndex: 0 }
//];
var g_iWndIndex = 0, szInfo = '';
var openIndex = 0, videoObj = undefined;
var trackvideo = {


    // trackvideo.closeVideo
    closeVideo: function () {
        videoList.forEach((o) => {
            trackvideo.StopRealPlay();
            trackvideo.Logout(o.IPAddress);
        });
    },
    //sendMsg: function () {
    //    webSk = new WebSocket('ws://127.0.0.1:12510');
    //    webSk.onopen = function (event) {
    //        alert('开启数据传递');
    //        let msg = document.getElementById('txtSend').value;
    //        webSk.send(msg);
    //    };
    //},
    //loadWebSocket: function () {
    //    webSk = new WebSocket('ws://127.0.0.1:12510');
    //    webSk.onopen = function (event) {
    //        alert('开启数据传递');
    //    };
    //    webSk.onclose = function (event) {
    //        alert('关闭数据传递');

    //    };
    //    webSk.onmessage = function (evt) {
    //        var received_msg = evt.data;
    //        alert("Server:" + evt.data);

    //    };


    //},
    //sendSocket: function () {
    //    //innerText
    //    let msg = document.getElementById('txtSend').value;


    //    if (webSk !== undefined) {
    //        let state = webSk.readyState;
    //        alert(state);
    //        if (state === 1) {
    //            webSk.send(msg);
    //            if (webSk.bufferedAmount == 0) {
    //                alert('发送结束');

    //            } else {
    //                alert('发送正在进行');

    //            }
    //        }

    //    }
    //},
    createVideo: function (vid, index, title) {
        var filldiv = document.createElement('div');
        filldiv.setAttribute('id', vid + "fill");
        filldiv.setAttribute('class', 'vidoClass');

        if (index === 0) {
            filldiv.style.top = (2 + (index * step)) + 'px';
        } else {
            filldiv.style.top = (7 + (index * step)) + 'px';
        }

        var vidtop = vid + "top";
        var topdiv = document.createElement('div');
        topdiv.setAttribute('id', vidtop);
        topdiv.setAttribute('class', 'divTopclass');
        trackvideo.createTool(topdiv, vid);
        trackvideo.createtoolleft(topdiv, title, vid);


        var div = document.createElement('div');
        div.setAttribute('id', vid);
        div.setAttribute('class', 'divclass');
        div.setAttribute('data-id', vid);

        filldiv.appendChild(topdiv);
        filldiv.appendChild(div);
        $('#videoDiv').append($(filldiv));
    },

    //隐藏菜单
    createTool: function (vidtop, vid) {
        var div = document.createElement('div');
        let sIp = vid + "fa";
        //  div.setAttribute('id', 'secondmenu1');
        div.setAttribute('id', 'toolright');
        div.setAttribute('class', 'secondright');
        div.setAttribute('data-id', 'secondright');

        var div_a = null;
        var div_ai = null;
        for (var i = 0; i < 3; i++) {
            div_a = document.createElement('a');
            div_a.setAttribute('class', 'btn2 btn-defaul');
            div_a.href = "#";
            div_ai = document.createElement('i');

            switch (i) {
                case 0:
                    div_a.onclick = function () {
                        trackvideo.CapturePic();
                    }
                    //fa-camera"
                    div_ai.setAttribute('class', 'fa fa-picture-o ');
                    div_ai.setAttribute('title', '抓图');
                    break;
                case 1:
                    div_a.onclick = function (event) {
                        // alert('开始录制');
                        if (isStartRecord) {
                            trackvideo.StopRecord(event);

                        }
                        else {
                            trackvideo.StartRecord(event);

                        }
                    }
                    // div_ai.setAttribute('id', vid + "fa");
                    div_ai.setAttribute('id', sIp);
                    div_ai.setAttribute('class', 'fa fa-video-camera');
                    div_ai.setAttribute('title', '录像');
                    break;
                case 2:
                    div_a.onclick = function () {
                        trackvideo.FullScreen();
                        // alert('全屏');                   
                    }
                    div_ai.setAttribute('class', 'fa fa-arrows');
                    div_ai.setAttribute('title', '全屏');
                    break;
            }
            div_a.appendChild(div_ai);
            div.appendChild(div_a);
        }
        // $(vidtop).append($(div));
        vidtop.appendChild(div);
    },
    createtoolleft: function (vidtop, title, vidtleft) {
        var div = document.createElement('div');
        div.setAttribute('id', vidtleftz + "topleft");
        div.setAttribute('class', 'secmenuLeft');
        div.innerText = title;
        vidtop.appendChild(div);
    },
    webVideo: function (vid) {
        // 检查插件是否已经安装过
        if (-1 === WebVideoCtrl.I_CheckPluginInstall()) {
            alert("您还未安装过插件，双击开发包目录里的WebComponents.exe安装！");
            return;
        }

        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin(500, 300, {
            iWndowType: 2,
            cbSelWnd: function (xmlDoc) {
                g_iWndIndex = $(xmlDoc).find("SelectWnd").eq(0).text();
                //var szInfo = "当前选择的窗口编号：" + g_iWndIndex;
                //trackvideo.showOPInfo(szInfo);
            }
        });
        WebVideoCtrl.I_InsertOBJECTPlugin(vid);
        var iType = 1;
        iType = parseInt(iType, 10);
        WebVideoCtrl.I_ChangeWndNum(iType);

        // 检查插件是否最新
        if (-1 === WebVideoCtrl.I_CheckPluginVersion()) {
            alert("检测到新的插件版本，双击开发包目录里的WebComponents.exe升级！");
            return;
        }
    },
    loginvideo: function (video) {

        var self = video;
        var szIP = video.IPAddress,
            szPort = video.Port,
            szUsername = video.Username, //$("#username").val(),
            szPassword = video.Password;//$("#password").val();

        if ("" === szIP || "" === szPort) {
            return;
        }

        var iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
            success: function (xmlDoc) {
                //   trackvideo.showOPInfo(szIP + " 登录成功！");
                // $("#ip").prepend("<option value='" + szIP + "'>" + szIP + "</option>");

                setTimeout(function () {
                    trackvideo.GetCannelInfo(self);
                }, 10);
            },
            error: function () {
                trackvideo.showOPInfo(szIP + " 登录失败！");
            }
        });

        if (-1 === iRet) {
            //  trackvideo.showOPInfo(szIP + " 已登录过！");
            trackvideo.GetCannelInfo(self);
        }
    },

    // 获取对讲通道
    GetCannelInfo: function (video) {
        var szIP = video.IPAddress;
        var self = video;

        if ("" === szIP) {
            return;
        }
        WebVideoCtrl.I_GetAudioInfo(szIP, {
            success: function (xmlDoc) {
                var oAudioChannels = $(xmlDoc).find("TwoWayAudioChannel");

                var channelss = 1;
                $.each(oAudioChannels, function () {
                    var id = $(this).find("id").eq(0).text();
                    id = id === "" ? 1 : parseInt(id, 10);
                    channelss = id;
                    return;

                    //oSel.append("<option value='" + id + "'>" + id + "</option>");
                });
                self.ChannelId = channelss;
                self.g_iWndIndex = g_iWndIndex;
                trackvideo.StartRealPlay(self);
                //   trackvideo.showOPInfo(szIP + "通道 "+channelss);
            },
            error: function () {
                trackvideo.showOPInfo(szIP + " 获取对讲通道失败,采用默认通道...");
                self.ChannelId = 1;
                self.g_iWndIndex = g_iWndIndex;
                trackvideo.StartRealPlay(self);
            }
        });
    },
    // 开始预览
    StartRealPlay: function (video) {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
            szIP = video.IPAddress,//$("#ip").val(),
            iStreamType = parseInt(1, 10),
            iChannelID = parseInt(video.ChannelId, 10),
            bZeroChannel = false,// $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
            szInfo = "";

        if ("" === szIP) {
            return;
        }

        if (oWndInfo !== null) {// 已经在播放了，先停止
            WebVideoCtrl.I_Stop();
        }

        var iRet = WebVideoCtrl.I_StartRealPlay(szIP, {
            iStreamType: iStreamType,
            iChannelID: iChannelID,
            bZeroChannel: bZeroChannel
        });

        if (0 === iRet) {
            //修改队列中的ID            
            var index = trackvideo.indexOf(video.IPAddress);
            videoList.splice(index, 1, video);
            szInfo = "开始预览成功！";
        } else {
            szInfo = "开始预览失败！";
        }

        trackvideo.showOPInfo(szIP + " " + szInfo + "\r\n");
    },

    // 停止预览
    StopRealPlay: function () {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
            szInfo = "";
        if (oWndInfo !== null) {
            var iRet = WebVideoCtrl.I_Stop();
            if (0 === iRet) {
                szInfo = "停止预览成功！";
            } else {
                szInfo = "停止预览失败！";
            }
            trackvideo.showOPInfo(oWndInfo.szIP + " " + szInfo);
        }
    },

    CapturePic: function () {
        //C:\Users\Administrator\Web\CaptureFiles
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
            szInfo = "";

        if (oWndInfo !== null) {
            var szPicName = oWndInfo.szIP + "_" + new Date().getTime(),
                iRet = WebVideoCtrl.I_CapturePic(szPicName);
            if (0 === iRet) {
                szInfo = "抓图成功！";
            } else {
                szInfo = "抓图失败！";
            }
            //showOPInfo(oWndInfo.szIP + " " + szInfo);
            //  trackvideo.showOPInfo(oWndInfo.szIP + " " + szInfo);
            layer.open({
                title: '提示',
                id: 'showopendialog',
                content: oWndInfo.szIP + " " + szInfo + "  </br>保存路径:C:\\Users\\Administrator\\Web\\CaptureFiles "
            });
        } else {
            trackvideo.showOPInfo('请先连接目标摄像机后再进行截图...');
        }
    },

    showOPInfo: function (strmsg) {
        // alert(strmsg);
        layer.msg(strmsg, { id: 'showmsg', icon: 5, time: 4000 });
    },

    // 开始录像
    StartRecord: function (e) {
        //C:\Users\Administrator\Web\RecordFiles
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
            szInfo = "";

        if (oWndInfo !== null) {
            var szFileName = oWndInfo.szIP + "_" + new Date().getTime(),
                iRet = WebVideoCtrl.I_StartRecord(szFileName);
            if (0 === iRet) {
                szInfo = "开始录像！";
                isStartRecord = true;
                //$('#' + e.target.id).attr('fa-video-camera', 'fa-pause');        
                e.target.setAttribute('class', 'fa fa-pause');
            } else {
                szInfo = "录像失败！";
            }
            trackvideo.showOPInfo(oWndInfo.szIP + " " + szInfo);
        } else {
            // e.target.setAttribute('class', 'fa fa-video-camera');
            trackvideo.showOPInfo('请先连接目标摄像机后再进行录像...');
        }
    },

    // 停止录像
    StopRecord: function (e) {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
            szInfo = "";

        if (oWndInfo !== null) {
            var iRet = WebVideoCtrl.I_StopRecord();
            if (0 === iRet) {
                // e.target.setAttribute('class', 'fa fa-video-camera');
                szInfo = "录像文件保存成功..";
            } else {
                szInfo = "保存失败！";
            }
            // $('#'+e.target.id).attr('fa-pause','fa-video-camera');
            e.target.setAttribute('class', 'fa fa-video-camera');
            isStartRecord = false;
            layer.open({
                title: '提示',
                content: oWndInfo.szIP + " " + szInfo + "  </br>保存路径:C:\\Users\\Administrator\\Web\\RecordFiles "
            });
        }
    },

    indexOf: function (obj) {
        for (var i = 0; i < videoList.length; i++) {
            if (videoList[i].IPAddress === obj) {
                return i;
            };
        }
        return -1;
    },

    Logout: function (szIP) {
        let iRet = WebVideoCtrl.I_Logout(szIP);
        if (0 === iRet) {
            szInfo = "退出成功！";
        } else {
            szInfo = "退出失败！";
        }
        trackvideo.showOPInfo(szIP + " " + szInfo);
    },
    FullScreen: function () {
        WebVideoCtrl.I_FullScreen(true);
    },
    ///创建播放窗体
    createHisVideo: function (obj) {

        // let obj = { ip: '192.168.2.2', point: '', showname: '', remp:''}
        if (obj === undefined)
            return;
        if (obj.ip === undefined || obj.ip === null)
            return;
        let vid = "V" + obj.ip.replace(/[.]/g, 'v');
        let finddiv = $("div[name='" + vid + "']");
        if (finddiv.length > 0)
            return;

        let showtitle = obj.showname + "-" + obj.ip;
        let mouse = map2dLayer.threeToScreen(obj.point);
        //  let mouse = obj.point;

        let filldiv = document.createElement('div');
        filldiv.setAttribute('id', vid);
        filldiv.setAttribute('name', vid);
        filldiv.setAttribute('class', 'CsOuterDiv');

        filldiv.style.top = mouse.y + 'px';
        filldiv.style.left = mouse.x + 'px';


        let vidtop = vid + "top";
        let topdiv = document.createElement('div');
        topdiv.setAttribute('id', vidtop);
        topdiv.setAttribute('class', 'divTopclass2');
        topdiv.innerHTML = "<div class='txtvideo1'>" + showtitle + "</div><div style='margin-top:5px;'><img src='" + fileParam.getImg('close.png', 'toolbar') + "' onclick='trackvideo.removediv(this)' alt='" + vid + "'  style='width: 15px;height: 15px;margin-right: 10px;'></div>";


        let div = document.createElement('div');
        let vidplaydiv = vid + "playdiv";
        let vidplay = vid + "play";
        div.setAttribute('id', vidplaydiv);
        div.setAttribute('class', 'divclass2');
        div.setAttribute('data-id', vid);
        let rempurl = trackvideo.getRTMPUrl(obj);
        div.innerHTML = "<live-player id='" + vidplay + "' video-url='" + rempurl + "' live='true' stretch='true'></live-player>";
        filldiv.appendChild(topdiv);
        filldiv.appendChild(div);
        $('#newmap3d').append($(filldiv));
        trackvideo.dragFunc(vid);
        trackvideo.dragFunc(vidtop);

    },

    dragFunc: function (id) {
        // var Drag = document.getElementById(id).parentNode;
        let Drag = document.getElementById(id);
        Drag.onmousedown = function (event) {
            var ev = event || window.event;
            event.stopPropagation();
            var disX = ev.clientX - Drag.offsetLeft;
            var disY = ev.clientY - Drag.offsetTop;
            document.onmousemove = function (event) {
                var ev = event || window.event;
                Drag.style.left = ev.clientX - disX + "px";
                Drag.style.top = ev.clientY - disY + "px";
                Drag.style.cursor = "move";
            };
        };
        Drag.onmouseup = function () {
            document.onmousemove = null;
            this.style.cursor = "default";
        };
    },


    removediv: function (obj) {
        let vid = obj.alt;
        console.log("remove div:" + vid);
        let vidplaydiv = vid + "playdiv";
        let vidplay = vid + "play";
        let playerdiv = document.getElementById(vidplaydiv);
        let player = document.getElementById(vidplay);
        player.setAttribute("video-url", "");
        playerdiv.innerHTML = "";

        $(obj).parent().parent().parent().remove();
        openIndex = 0;
    },

    ////trackvideo.initGBT28181()
    initGBT28181() {
        //let fileMPath = '../../Config/GBT28181.json';
        //$.getJSON(fileMPath, function (data) {
        //    gbt28181Config.SmsSerial = data.SmsSerial;
        //    gbt28181Config.SmsListen = data.SmsListen;
        //    gbt28181Config.CmsIp = data.CmsIp;
        //    gbt28181Config.CmsPort = data.CmsPort;
        //});
        let urlPath = "/Graphic/GetRpmSysOption";
        let strJson = { strkey: 'GBT28181' };
        clientMode.post(urlPath, strJson, function (data) {
            if (data.length > 0) {
                var obj = JSON.parse(data);
                gbt28181Config.SmsSerial = obj.SmsSerial;
                gbt28181Config.SmsListen = obj.SmsListen;
                gbt28181Config.CmsIp = obj.CmsIp;
                gbt28181Config.CmsPort = obj.CmsPort;
            }
        });
    },
    //PC端 RTMP播放流
    getRTMPUrl(vobj) {
        // "RTMP": "rtmp://192.168.8.71:11935/hls/34020000001320000001_34020000001320000001",
        //  "RTMP": "rtmp://192.168.8.71:11935/hls/34020000001320000003_34020000001310000003",
        let rtmpurl = "rtmp://" + gbt28181Config.CmsIp + ":" + gbt28181Config.SmsListen + "/hls/" + vobj.DeviceID + "_" + vobj.ChannelID;
        return rtmpurl;
    },
    ///手机端路径
    getAppUrl(vobj) {
        ////    "HLS": http://192.168.8.71:10012/sms/34020000002020000001/hls/34020000001320000003_34020000001310000003/34020000001320000003_34020000001310000003_live.m3u8
        let strdevcha = vobj.DeviceID + "_" + vobj.ChannelID;
        let hlsurl = "http://" + gbt28181Config.CmsIp + ":" + gbt28181Config.CmsPort + "/sms/" + gbt28181Config.SmsSerial + "/hls/" + strdevcha + "/" + strdevcha + "_live.m3u8";
        return hlsurl;
    },
    ///flv
    getFlvUrl(vobj) {
        // "FLV": "http://192.168.8.71:10012/sms/34020000002020000001/flv/hls/34020000001320000003_34020000001310000003.flv",
        let flvurl = "http://" + gbt28181Config.CmsIp + ":" + gbt28181Config.CmsPort + "/sms/" + gbt28181Config.SmsSerial + "/flv/hls/" + vobj.DeviceID + "_" + vobj.ChannelID + ".flv";
        return flvurl;
    },
    ///rtsp
    getRtspUrl(vobj) {
        //    "RTSP": "rtsp://192.168.8.71:0/34020000001320000003_34020000001310000003",
        let rtspurl = "rtsp://" + gbt28181Config.CmsIp + ":0" + vobj.DeviceID + "_" + vobj.ChannelID;
        return rtspurl;
    },
    //ws
    getWebflvUrl(vobj) {
        //    "WS_FLV": "ws://192.168.8.71:10012/sms/34020000002020000001/ws-flv/hls/34020000001320000003_34020000001310000003.flv"
        let wsflvurl = "ws://" + gbt28181Config.CmsIp + ":" + gbt28181Config.CmsPort + "/sms/" + gbt28181Config.SmsSerial + "/ws-flv/hls/" + vobj.DeviceID + "_" + vobj.ChannelID + ".flv";
        return wsflvurl;
    },
    ///历史视频播放
    getplayHis(vobj, start, end) {
        //http://192.168.8.71:10012/api/v1/cloudrecord/video/play/34020000001320000001/34020000001320000001/20190822162850/20190822163200
        let playhisUrl = "http://" + gbt28181Config.CmsIp + ":" + gbt28181Config.CmsPort + "/api/v1/cloudrecord/video/play/" + vobj.DeviceID + "/" + vobj.ChannelID + "/" + start + "/" + end;
        return playhisUrl;
    },
    getptz(obj) {
        let vid = obj.alt;
        //serial&ChannelID&left&
        let ptzs = vid.split('&');
        //Request URL: http://192.168.8.71:10012/api/v1/control/ptz?serial=34020000001320000002&code=34020000001320000002&command=left&
        let playhisUrl = "http://" + gbt28181Config.CmsIp + ":" + gbt28181Config.CmsPort + "/api/v1/control/ptz?serial=" + ptzs[0] + "&code=" + ptzs[1] + "&command=" + ptzs[2];
        trackvideo.setptzvideo(playhisUrl);
        return playhisUrl;
    },
    getptzstop(obj) {
        let vid = obj.alt;
        //serial&ChannelID&left&
        let ptzs = vid.split('&');
        // Request URL: http://192.168.8.71:10012/api/v1/control/ptz?serial=34020000001320000002&code=34020000001320000002&command=stop
        let playhisUrl = "http://" + gbt28181Config.CmsIp + ":" + gbt28181Config.CmsPort + "/api/v1/control/ptz?serial=" + ptzs[0] + "&code=" + ptzs[1] + "&command=stop";
        trackvideo.setptzvideo(playhisUrl);
        return playhisUrl;
    },

    setptzvideo(url) {
        try {
            $.get(url, null, (data) => {
                //alert(data);
            });
        } catch (err) {
            console.log('ptzvideo error');
        }
    },
    ///创建播放窗体
    createVideoDiv: function (obj) {
        if (videoObj === undefined) {
            openIndex = 0;
            videoObj = obj;
        } else {
            if (obj.ip !== videoObj.ip) {
                openIndex = 0;
                videoObj = obj;
            }
        }

        if (openIndex === 0) {
            openIndex++;
           // trackvideo.showplaydiv(obj);

            let url = trackvideo.getstarturl(obj);
            $.ajax
                ({
                    type: "get",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: url,  //这里是网址
                    success: function (data) {                     
                        obj.rtspurl = data.FLV;//Flv
                        //obj.rtspurl = data.HLS;//m3u8-手机端
                        //obj.rtspurl = data.RTMP;//rtmp - 需开启flash
                        trackvideo.showplaydiv(obj);
                    },
                    timeout: 1000,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        // $("#welcome").html(XMLHttpRequest + textStatus + errorThrown.message);
                        openIndex = 0;
                        layer.msg('视频流没有接入，或是视频服务没有开启...', { icon: 0, time: 2000 });
                    }
                });
        } else {
            openIndex++;
            if (openIndex > 100) {
                openIndex = 0;
            }
        }
    },


    findm3u8(vobj, sdate) {
        let strdatetime = getstrdate(sdate);
        let strdate = strdatetime.substr(0, 8);
        let hisurl = "";
        // let url = 'http://192.168.8.71:10012/api/v1/cloudrecord/querydaily?serial=34020000001320000002&code=34020000001320000002&period=20190830&sort=startAt&order=ascending';
        let url = trackvideo.getplayHism3u8(vobj, strdate);
        $.get(url, null, (data) => {
            if (data !== null && data.list.length > 0) {
                data.list.forEach(item => {
                    if (compareTime(getdatetime(item.startAt), sdate) === true && hisurl === "") {
                        hisurl = item.hls;
                    }
                });


            }
            // alert(data.list[0]);
        });
    },
    getplayHism3u8(vobj, sdate) {

        //descending  --降序   ascending--升序
        //'http://192.168.8.71:10012/api/v1/cloudrecord/querydaily?serial=34020000001320000002&code=34020000001320000002&period=20190830&sort=startAt&order=descending';
       // let playhisUrl = "http://" + gbt28181Config.CmsIp + ":" + gbt28181Config.CmsPort + "/api/v1/cloudrecord/querydaily?serial=" + vobj.DeviceID + "&code=" + vobj.ChannelID + "&period=" + sdate + "&sort=startAt&order=descending";
        let playhisUrl = "http://" + gbt28181Config.CmsIp + ":" + gbt28181Config.CmsPort + "/api/v1/cloudrecord/querydaily?serial=" + vobj.DeviceID + "&code=" + vobj.ChannelID + "&period=" + sdate + "&sort=startAt&order=ascending";
        return playhisUrl;
    },
    getdownHisVideo(vobj, sdate) {
        //http://localhost:10000/api/v1/cloudrecord/video/download/34020000001320000108/34020000001320000108/20190711172850/20190711174747/video.mp4
        let playhisUrl = "http://" + gbt28181Config.CmsIp + ":" + gbt28181Config.CmsPort + "/api/v1/cloudrecord/video/download/" + vobj.DeviceID + "/" + vobj.ChannelID + "/" + sdate + "/video.mp4";
        return playhisUrl;
    },
    getstarturl(vobj) {
        //http://192.168.8.71:10012/api/v1/stream/start?serial=34020000001320000002&code=34020000001320000002  
        //查询直播url
        let geturl = "http://" + gbt28181Config.CmsIp + ":" + gbt28181Config.CmsPort + "/api/v1/stream/start?serial=" + vobj.DeviceID + "&code=" + vobj.ChannelID;
        return geturl;
    },

    showplaydiv(obj) {
        // let obj = { ip: '192.168.2.2', point: '', showname: '', remp:''}
        if (obj === undefined)
            return;
        if (obj.ip === undefined || obj.ip === null)
            return;
        let vid = "V" + obj.ip.replace(/[.]/g, 'v');
        let finddiv = $("div[name='" + vid + "']");
        if (finddiv.length > 0)
            return;

        let showtitle = obj.showname + "-" + obj.ip;
        let mouse = map2dLayer.threeToScreen(obj.point);

        let filldiv = document.createElement('div');
        filldiv.setAttribute('id', vid);
        filldiv.setAttribute('name', vid);
        filldiv.setAttribute('class', 'CsOuterDiv');

        filldiv.style.top = mouse.y + 'px';
        filldiv.style.left = mouse.x + 'px';
        filldiv.style.height = '250px';


        let vidtop = vid + "top";
        let topdiv = document.createElement('div');
        topdiv.setAttribute('id', vidtop);
        topdiv.setAttribute('class', 'divTopclass1');
        topdiv.innerHTML = "<div class='txtvideo1'>" + showtitle + "</div><div style='margin-top:5px;'><img src='" + fileParam.getImg('close.png', 'toolbar') + "' onclick='trackvideo.removediv(this)' alt='" + vid + "'  style='width: 15px;height: 15px;margin-right: 10px;'></div>";
        filldiv.appendChild(topdiv);

        ///left
        let div = document.createElement('div');
        let vidplaydiv = vid + "playdiv";
        let vidplay = vid + "play";
        div.setAttribute('id', vidplaydiv);
        div.setAttribute('class', 'divclass1');
        div.setAttribute('data-id', vid);

        /////rtmp 路径播放
        //let rempurl = trackvideo.getRTMPUrl(obj);
        //div.innerHTML = "<live-player id='" + vidplay + "' video-url='" + rempurl + "' live='true' stretch='true'></live-player>";

        //flv 路径播放 增加两个参数  hasaudio='false' muted='true'
        // let rempurl = trackvideo.getFlvUrl(obj);  //trackvideo.getRTMPUrl(obj);
        div.innerHTML = "<live-player id='" + vidplay + "' video-url='" + obj.rtspurl + "' live='true' stretch='true' hasaudio='false' muted='true'></live-player>";

        let ptz = obj.DeviceID + "&" + obj.ChannelID;
        ///right
        let divR = document.createElement('div');
        divR.setAttribute('id', 'ptz');
        divR.setAttribute('class', 'divRight');
        divR.innerHTML = " <div id='oneup' style='align- content: center' title='上'><img onmousedown='trackvideo.getptz(this)' onmouseup='trackvideo.getptzstop(this)' alt='" + ptz + "&up' style= 'width: 36px;height: 30px;' src='" + fileParam.getImg('up.png', 'toolbar') + "' > </div >"
            + " <div id='two' class='ptzleftright'><div id='left' title='左' style='margin-right: 3px'> <img onmousedown='trackvideo.getptz(this)' onmouseup='trackvideo.getptzstop(this)' alt='" + ptz + "&left' src='" + fileParam.getImg('left.png', 'toolbar') + "' ></div>"
            + " <div id='round' title='云台控制'> <img  src='" + fileParam.getImg('rounded.png', 'toolbar') + "'></div><div id='right' title='右' style='margin-left: 3px' ><img onmousedown='trackvideo.getptz(this)' onmouseup='trackvideo.getptzstop(this)' alt='" + ptz + "&right' src='" + fileParam.getImg('right.png', 'toolbar') + "' ></div></div>"
            + " <div id='threedown' title='下'><img style='width: 36px;height: 30px;' onmousedown='trackvideo.getptz(this)' onmouseup='trackvideo.getptzstop(this)' alt='" + ptz + "&down' src='" + fileParam.getImg('down.png', 'toolbar') + "'></div>"
            + " <div id='fourminmax' class='ptzminmax'><div title='光圈放大' ><img onmousedown='trackvideo.getptz(this)' onmouseup='trackvideo.getptzstop(this)' alt='" + ptz + "&zoomin' style='width: 38px;height: 38px;' src='" + fileParam.getImg('plus.png', 'toolbar') + "' ></div>"
            + " <div title= '光圈缩小'> <img onmousedown='trackvideo.getptz(this)' onmouseup='trackvideo.getptzstop(this)' alt='" + ptz + "&zoomout' style='width: 38px;height: 38px;' src='" + fileParam.getImg('min.png', 'toolbar') + "'></div></div> ";

        ///main
        let divM = document.createElement('div');
        divM.setAttribute('id', 'divmain');  //divMain
        divM.setAttribute('class', 'divMain');
        divM.appendChild(div);
        divM.appendChild(divR);

        filldiv.appendChild(divM);
        $('#newmap3d').append($(filldiv));
        trackvideo.dragFunc(vid);
    },
    closediv: function (obj) {
        let vid = "V" + obj.ip.replace(/[.]/g, 'v');
        console.log("remove div:" + vid);
        let vidplaydiv = vid + "playdiv";
        let vidplay = vid + "play";
        let playerdiv = document.getElementById(vidplaydiv);
        let player = document.getElementById(vidplay);
        if (player !== undefined) {
            player.setAttribute("video-url", "");
            playerdiv.innerHTML = "";
            $('#' + vid).remove();
        }
    },
}

function getdatetime(vstrdate) {
    //20190830173002
    let strdt = vstrdate.substr(0, 4);
    strdt += "-" + vstrdate.substr(4, 2);
    strdt += "-" + vstrdate.substr(6, 2);

    strdt += " " + vstrdate.substr(8, 2);
    strdt += ":" + vstrdate.substr(10, 2);
    strdt += ":" + vstrdate.substr(12, 2);
    // alert(strdt);
    return strdt;

};
function getstrdate(start) {
    //yyyy-MM-dd HH:mm:ss 转 yyyyMMddHHmmss
    let strdate = start.replace(/-/g, "").replace(/:/g, "").replace(/\s+/g, "");
    //  alert(strdate);
    return strdate;
};
//判断日期，时间大小
function compareTime(logintime, logouttime) {
    if (logintime.length > 0 && logouttime.length > 0) {
        var logintimeTemp = logintime.split(" ");
        var logouttimeTemp = logouttime.split(" ");

        var arrloginDate = logintimeTemp[0].split("-");
        var arrlogoutDate = logouttimeTemp[0].split("-");

        var arrloginTime = logintimeTemp[1].split(":");
        var arrlogoutTime = logouttimeTemp[1].split(":");

        var allLoginDate = new Date(arrloginDate[0], arrloginDate[1], arrloginDate[2], arrloginTime[0], arrloginTime[1], arrloginTime[2]);
        var allLogoutDate = new Date(arrlogoutDate[0], arrlogoutDate[1], arrlogoutDate[2], arrlogoutTime[0], arrlogoutTime[1], arrlogoutTime[2]);

        if (allLoginDate.getTime() >= allLogoutDate.getTime()) {
            // alert("start > end");
            return true;
        } else {
            //  alert("start < end");
            return false;
        }
    } else {
        return false;
    }
};
function difftime(t1, t2) {
    let d1 = new Date(t1);
    let d2 = new Date(t2);
    let totalMin = (parseInt(d2 - d1) / 1000);
    return totalMin;
    //console.log(parseInt(d2 - d1));//两个时间相差的毫秒数
    //console.log(parseInt(d2 - d1) / 1000);//两个时间相差的秒数
    //console.log(parseInt(d2 - d1) / 1000 / 60);//两个时间相差的分钟数
    //console.log(parseInt(d2 - d1) / 1000 / 60);//两个时间相差的小时数
}