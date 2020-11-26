   let config = [], workItems = [], terminalItems = [], layerHtml = '', offlineTerminal = [], warningItems = [], iconItems = [], windowWidth, windowHeight, currentTask = undefined,searchClick=false;
 let toolBar = {
            addLayerHtml: function (layerId, layerName, isVisible) {
                layerHtml += '<tr><td><div class="cbkStyle"><input type="checkbox" id="' + layerId + '" name="cbkLayer" style="display:none"';
                if (isVisible) layerHtml += " checked ";
                layerHtml += '/><label for="' + layerId + '"></label></div></td ><td>' + layerName + '</td></tr >';
            },
            //加载图层数据
            layerInit: function () {
                var layers = map.getLayers();
                for (var i = 0; i < layers.length; i++) {
                    toolBar.addLayerHtml(layers[i].get("id"), layers[i].get("title"), layers[i].get("visible"));
                }
            },
            //打开历史回放页面
            openNewWindow: function () {
                let a = $("<a href='review.html' target='_blank'>review</a>").get(0);
                let e = document.createEvent('MouseEvents');
                e.initEvent('click', true, true);
                a.dispatchEvent(e);
            },
            //切换右侧功能按钮
            opration: function (toolName) {
                let check = $("." + toolName).is(':hidden');
                $(".toolContent").hide();
                toolbarOpration.workDetailClose();
                if (toolName === "search") {
                    if(!searchClick)
                    {
                        $(".search").show();
                        $(".searchContent li").hide();
                        searchClick=true;
                    }
                    else
                    {
                        $(".search").hide();
                        $(".searchContent li").hide();
                        searchClick=false;
                    }
                }
                else {
                    searchClick=false;
                    if (toolName === "dataResource") {
                        this.openNewWindow();
                    }
                    $(".searchBtn").css("visibility", "visible");
                    $(".search").hide();
                    if (check) $("." + toolName).show("fast");
                }
            },
            //图层加载
            refreshLayer: function () {
                $("#tblayer").html(layerHtml);
                $(".mapLayeredit").height($("#tblayer").find("tr").length * 30 + 20);

                $("input[name='cbkLayer']").on("click", function () {
                    toolBar.Highlight();
                    map.setLayerVisible($(this).attr("id"), $(this).is(':checked'));
                });
            },
            Highlight: function () {
                $("#tuli span").css("color", "#000");
                if ($("#section").is(':checked')) {
                    $("#tuli span").css("color", "#fff");
                    $(".hightbackgd").show();
                    $(".blackbackgd").hide();
                    document.getElementById("defaultcss").href ="css/mapMonitor_white.css";
                    return false;
                }
                else {
                    $(".hightbackgd").hide();
                    $(".blackbackgd").show();
                     document.getElementById("defaultcss").href ="css/mapMonitor.css";
                    return false;
                }
            }
        };
        let toolbarOpration = {
            //清除工具
            clear: function () {
                $("input[name='radio']").removeAttr("checked");
                map.addInteraction("None");
            },
            measure: function (type) {
                map.addInteraction(type);
            },
            getIcon: function () {
                $.each(iconItems, function (i, item) {
                    let html = ' <li><img src="' + item.tuli + '"/></li> <li> <span>' + item.name + '</span></li>';
                    $("#tuli").append(html);
                })
            },
            //获取离线终端信息
            getOffineTerminal: function () {
                $(".uloffine").empty();
                $.getJSON("config/offlineTerminal.json", "", function (data) {
                    offlineTerminal = data;
                    $.each(data, function (i, item) {
                        $(".uloffine").append('<li><span>终端编号：' + item.assetName + '<br>离线时间：' + item.offineTime + '</span><hr /></li>');
                    })
                });
            },
            getTerminalStatistics: function () {
                $('#handheldterminal').html(15);
                $('#vehicleterminal').html(10);
            },
            //获取报警信息数据
            getWarningInfo: function () {
                $(".ulwarning").empty();
                $.getJSON("config/regionWarning.json", "", function (data) {
                    warningItems = data;
                    $.each(data, function (i, item) {
                        $(".ulwarning").append('<li><span>' + item.warningTime + ' [' + item.warningInfo + ']</span><hr /></li>');
                    })
                });

            },
            getWorkMisson: function () {
                $(".toolworkMisson").empty();
                $.getJSON("config/work.json", "", function (data) {
                    workItems = data;
                    $.each(data, function (i, item) {
                        let html = '';
                        html += '<ul class="ulworkMisson" id=' + item.id + '><li> 车辆名称：' + item.assetName + '</li><li>终端编号：' + item.terminalName + '</li> <li class="li1">作业内容：' + item.work + '</li><li>作业区域：' + item.regionName + '</li><li>终端状态：';
                        if (item.terminalStatus == "OnLine") html += '<font style="color:#32CD32">在线</font>';
                        else html += '<font style="color:#FFD700">离线</font>';
                        html += '</li > <li class="li1" style="height:10px;"><hr style="border: 0.5px solid #EEEEEE;"></hr></li></ul > ';
                        $(".toolworkMisson").append(html);
                        $(".searchContent").append('<li data="' + item.assetName + '">' + item.assetName + '</li>')
                    })
                });
            },
            searchContent: function (event) {
                var value = $(event.target).val().trim();
                if (value.length > 0) {
                    $('.searchContent li').hide();
                    $('.searchContent').find("li[data*='" + value + "']").show();
                }
                else $('.searchContent li').show();
            },
            workDetailClose: function () {
                $("#workpopup").hide();
                if (currentTask !== undefined) {
                    toolbarOpration.setWorkHighLight(false);
                    currentTask = undefined;
                }
            },
            setWorkHighLight: function (visible) {
                var regionId = currentTask.IdRegion;
                var terminalId = currentTask.idTerminal;
                var regionFeature = map.getFeature("fence", "id", regionId);
                var mobileFeature = map.getFeature("mobileterminal", "id", terminalId);
                var vehicleFeature = map.getFeature("vehicleterminal", "id", terminalId);

                map.setFeatureVisible(regionFeature, visible);
                if (mobileFeature != undefined) {
                    if (visible === false)
                        map.setFeatureFont(mobileFeature, "normal 14px 微软雅黑", "#000000");
                    else 
                        map.setFeatureFont(mobileFeature, "normal 20px 微软雅黑", "#ff0000");
                }
                if (vehicleFeature != undefined) {
                    if (visible === false)
                        map.setFeatureFont(vehicleFeature, "normal 14px 微软雅黑", "#000000");
                    else
                        map.setFeatureFont(vehicleFeature, "normal 20px 微软雅黑", "#ff0000");
                }
            },
            load: function () {
                toolbarOpration.getIcon();
                toolbarOpration.getOffineTerminal();
                toolbarOpration.getWarningInfo();
                toolbarOpration.getWorkMisson();
                toolbarOpration.getTerminalStatistics();
            }
        }