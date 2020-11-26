(function ($, window) {
     "use strict";


    var listenManager = {}, guid = 0,
    // 定时监听类
    Listen = window.Listen = function () {
        if (arguments.length) {
            this.init(arguments[0]);
        }
    };
    Listen.defaultOptions = {
        // 需要操作的对象
        listener: {
            // 操作的对象或方法
            operate: function () { },
            // 完成的标识
            complete: false,
            // 进入下一个监控的标识
            next: true
        },
        notFirst: false,
        // 间隔
        interval: 10,
        // 超时
        timeOut: null,
        // 超时后的操作
        onTimeOut: null,
        // 每一步监听
        onBeforeStep: null,
        // 下一步
        onEndStep: null,
        // 完成后的操作
        onComplete: null,
        // 停止时执行
        onStop: null,
        // 每秒后执行的方法, interval应该是1000的倍数
        onSecStep: null,
        // 暂停后
        onPause: null,
        // 唯一标识
        key: null
    };

    // 监听状态
    Listen.status = {
        // 停止时
        wait: 0,
        // 开始
        start: 1,
        // 暂停
        pause: 2
    };

    $.extend(Listen.prototype, {
        options: null,
        _interval: null,
        _guid: null,
        _status: null,
        _inited: false,
        _process: null,
        _step: 0,
        _secStep: 0,
        _secProcess: null,
        _secInterval: 0,
        // 初始化
        init: function (options) {
            if (!this._inited) {
                this.options = $.extend(true, {}, Listen.defaultOptions, options);
                this._guid = this.options.key || guid++;
                listenManager[this._guid] = this;
                this._interval = this.options.interval;
                this._secInterval = Math.ceil(this._interval / 1000);
                this._inited = true;
                this._step = 0;
                this._status = this.constructor.status.wait;
                //this.start();
            }
        },
        // 停止
        stop: function () {
            this._stopProcess();
            this._stopSecProcess();
            this._step = 0;
            this._secStep = 0;
            this._status = this.constructor.status.wait;
            this._secListener && this._secListener.stop();
            this._completeListener && this._completeListener.stop();
        },
        // 开始
        start: function (notFirst) {
            if (this.getStatus() !== this.constructor.status.start) {
                this._status = this.constructor.status.start;
                notFirst = notFirst !== undefined ? notFirst : this.options.notFirst
                this.options.onSecStep ? this._secStart(notFirst)
                : this._start(notFirst);
            }
        },
        // 暂停
        pause: function () {
            this._stopProcess();
            this._stopSecProcess();
            this._secListener && this._secListener.stop();
            this._completeListener && this._completeListener.stop();
            this._status = this.constructor.status.pause;
        },
        // 当前状态
        getStatus: function () {
            return this._status;
        },
        // 获取当前步
        getStep: function () {
            return this._step - 1;
        },

        manual: function () {
            var that = this, curStatus = this.getStatus();
            if (curStatus === this.constructor.status.start) {
                this.stop();
            }
            this._goStep();
            (new Listen(
                {
                    listener: {
                        complete: this.options.listener.next
                    },
                    onComplete: function () {
                        that.options.onEndStep && that.options.onEndStep.call(null, 0, 0);
                        curStatus === that.constructor.status.start && that.start(true);
                    }
                })).start();
        },

        // 设置间隔
        setInterval: function (interval) {
            this._interval = interval;
            this._secInterval = Math.ceil(this._interval / 1000);
            this._completeListener && this._completeListener.setInterval(interval);

        },

        _stopProcess: function () {
            if ($.isNumeric(this._process)) {
                clearTimeout(this._process);
                this._process = null;
            }
            this._stopSecProcess();

        },

        _stopSecProcess: function () {
            if ($.isNumeric(this._secProcess)) {
                clearInterval(this._secProcess);
                this._secProcess = null;
            }
        },

        _start: function (notFirst) {
            var next = this.options.listener.next,
                that = this;
            isComplete = this._isComplete();
            isTimeOut = this._isTimeOut();

            if (!isComplete
                && !isTimeOut) {
                !notFirst && this._goStep();
            } else {
                this._goComplete(isComplete, isTimeOut);
                return;
            }

            this._completeListener = new Listen({
                listener: {
                    complete: next
                },
                onComplete: function () {
                    !notFirst && that.options.onEndStep
                    && that.options.onEndStep.call(null, that._interval, this._step);
                    that._process = setTimeout(function () {
                        that._start(false);
                    }, that._interval);
                }
            });
            this._completeListener.start();
        },

        _secStart: function (notFirst) {
            var next = this.options.listener.next,
                that = this;
            isComplete = this._isComplete();
            isTimeOut = this._isTimeOut();
            if (!isComplete
                && !isTimeOut) {
                !notFirst && this._goStep();
            } else {
                this._goComplete(isComplete, isTimeOut);
                return;
            }

            this._secListener = new Listen(
                 {
                     listener: {
                         complete: next
                     },
                     onComplete: function () {
                         if (!that._secStep && !notFirst) {
                             that.options.onEndStep
                                && that.options.onEndStep.call(null, that._interval, this._step);
                         }
                         if (that._secStep <= that._secInterval) {
                             that.options.onSecStep.call(null, that._secStep++, that._secInterval);
                             if (!$.isNumeric(that._secProcess)) {
                                 that._secProcess = setInterval(function () {
                                     that._secStart(true);
                                 }, 1000);
                             }
                         }
                         else {
                             that._stopSecProcess();
                             that._secStep = 0;
                             that._secStart(false);
                         }
                     }
                 });
            this._secListener.start();
        },



        _isComplete: function () {
            var complete = this.options.listener.complete;
            return complete !== undefined ?
                ($.isFunction(complete) ? complete.call(null) : complete) : false;
        },

        _isTimeOut: function () {
            var timeOut = this.options.timeOut,
                secFun = this.options.onSecStep,
                curTime = this._interval * this.getStep();
            if ($.isFunction(secFun)) {
                curTime += 1000 * this._secStep;
            }

            return $.isNumeric(this.options.timeOut) ?
                curTime > this.options.timeOut : false;
        },

        _goStep: function () {
            this.options.onBeforeStep && this.options.onBeforeStep.call(null, this._interval, this._step);
            this.options.listener.operate && this.options.listener.operate.call(null);
            this._step++;
        },

        _goComplete: function (isComplete, isTimeOut) {

            isComplete && this.options.onComplete
            && this.options.onComplete.call(null, this.getStep());

            isTimeOut && this.options.onTimeOut
            && this.options.onTimeOut.call(null, this.getStep(), this.options.timeOut);
            this.stop();

        }
    });


    $.extend({
        treeMap: function (tree, mapFunc) {
            //递归转换数据
            function recursionMap(item) {
                //执行客户端代码
                var newItem = mapFunc(item);

                if (newItem.children && $.isArray(newItem.children)) {
                    newItem.children = $.map(newItem.children, function (value, index) {
                        return recursionMap(value);
                    });
                }
                return newItem;
            }

            var mapTree = $.map(tree, function (item, index) {
                return recursionMap(item, mapFunc);
            });
            return mapTree;
        },
        handlerXml: function (xml) {
            return xml && xml.replace(/([<>])/g, function (m, i) {
                return xmlConfig[i];
            });
        },
        parseDate: function (dateStr) {
            if (dateStr) {
                // yyyy-MM-dd[T]HH:mm:ss
                // yyyy/MM/dd[T]HH:mm:ss
                var reg = /^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})(?:|[T ](\d{1,2})(?:|:(\d{1,2})(?:|:(\d{1,2}))))$/;
                if (reg.test(dateStr)) {
                    var args = [];
                    dateStr.replace(/(\d{1,4})/g, function (m, x, i) {
                        // 如果是月份, 减1
                        if (i == 5) {
                            m = parseInt(m) - 1;
                        }

                        args.push(m);
                    });
                    while (args.length < 6) {
                        args.push(0);
                    }
                    return new Date(args[0], args[1], args[2], args[3], args[4], args[5]);
                }
            }
        },
        parseSpan: function (secs) {
            var hour, min, sec;
            if ($.isNumeric(secs)) {
                secs = secs / 1000;
                hour = Math.floor(secs / 3600);
                min = Math.floor(secs % 3600 / 60);
                sec = Math.floor(secs % 3600 % 60);
            }
            return $.intToStr(hour) + ":" + $.intToStr(min) + ":" + $.intToStr(sec);
        },
        intToStr: function (num, dig) {
            dig = $.isNumeric(dig) ? dig : 2;
            var str = parseInt(num) + "", len = str.length;
            if (len < dig) {
                while (dig - len) {
                    str = "0" + str;
                    len++;
                }
            }
            return str;
        },
        getTime: function (str) {
            if (str) {
                var reg = /\d{1,2}:\d{1,2}:\d{1,2}$/;
                if (reg.test(str)) {
                    str = reg.exec(str)[0];
                }
            }
            return str;
        },
        getDate: function (str) {
            if (str) {
                var reg = /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}/;
                if (reg.test(str)) {
                    str = reg.exec(str)[0];
                }
            }
            return str;
        },
        toJson: function (str) {
            /// <summary>将字符串转成JSON对象</summary>
            /// <param name="str" type="String">字符串:'key':1,'key1':2 或者:{'key':1,'key1':2}</param>
            /// <returns type="Object">JSON对象或NULL</returns>
            var result = null;
            // 将单引号转换成双引号
            if (str) {
                str = str.replace(/'/g, '"');
                if (!~str.indexOf("{")) {
                    str = "{" + str;
                }
                if (!~str.indexOf("}")) {
                    str += "}";
                }
                try {
                    result = JSON.parse(str);
                } catch (e) {
                    window.DEBUG && window.console && window.console.log(e);
                }
            }

            return result;
        },
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
            search = location.search && location.search.substring(1) || "",
            strs = search.match(reg), result = "";
            if (strs != null) {
                result =decodeURI(strs[2]);
            }
            return result;
        },
        serialize: function (options) {
            /// <summary>序列化</summary>
            /// <param type="Object" name="options">{selector:"",key:""}</param>
            /// <returns type="Object"/>
            var result = {},
                key = options.key || "name",
                prop, val,
                selector = options.selector || "input";
            $(options.selector).each(function (index, item) {
                var $this = $(this);
                prop = $this.attr(key);
                if ($this.is(":checkbox")) {
                    // 选中或不选中
                    val = $this.prop("checked");
                } else {
                    val = $this.val() || "";
                }
                prop && (result[prop] = val);
            });
            return result;
        },
    });


    $.fn.extend({
        shadeLayer: function (bl, msg, style, opacity) {
            /// <summary>遮罩层</summary>
            /// <param type="Boolean" name="bl">显示或隐藏, true为显示, false为隐藏</param>
            /// <param type="String" name="msg">图片后附加的文字</param>
            /// <param type="String" name="style">字体样式</param>
            /// <param type="Number" name="opacity">透明度, 0-1, 0为全透明</param>
            return this.each(function () {
                var
                $dom = $(this),
                shadeLayer = $dom.find(".shade-layer")[0],
                $shadeLayer = $(shadeLayer);
                if (!shadeLayer) {
                    // 创建一个新的遮罩层
                    $shadeLayer = $('<div class="shade-layer" style="width:100%;height:100%;left:0px;top:0px;display:none;'
                    + 'position:absolute;z-index:1000;"></div>');
                    $dom.append($shadeLayer[0]);
                    $shadeLayer.append('<div class="shade-layer-back" style="width:100%;height:100%;background-color:black;"></div>'
                    + '<div style="width:100%;height:100%;position:absolute;left:0px;top:0px;display:table;">'
                    + '<div style="display:table-cell;vertical-align:middle;text-align:center;"><div >'
                    + '<img src="/images/loading.gif" alt="loading"/><span>&nbsp;</span><span style="' + (style || "color:black;") + '" '
                    + ' class="shade-layer-text"></span></div></div></div>');
                    $shadeLayer.find(".shade-layer-back").css('opacity', opacity || 0.2);
                }
                if ($dom.css("position") === "auto" || $dom.css("position") === "static") {
                    $dom.css("position", "relative");
                }

                bl ? $shadeLayer.show() : $shadeLayer.hide();
                msg && $shadeLayer.find("span.shade-layer-text").html(msg);
                return this;
            });
        },
        //导出Excel
        exportExcel: function (options) {
            var defaultOptions = {
                totalSize: undefined,  //总记录数
                batchSize: 2000,   //批量导出数量
                exportUrl: undefined, //导出地址
                getQueryCriteria: function () {
                    return {
                        sort: '',    //排序列
                        order: '',    //acs/desc
                        columns: []  //导出列
                    };
                },
                getQueryCriteriaForPrint: function () {
                    return {
                    };
                }
            };
            options = $.extend({}, defaultOptions, options);
            var id = this.attr('id') + 'ul_export';
            $('body').on('click', '#' + id + ' a', function (event) {
                event.preventDefault();
                event.stopPropagation();
                var queryCriteria = options.getQueryCriteria();
                var queryCriteriaForPrint = options.getQueryCriteriaForPrint();
                var $this = $(this);
                queryCriteria.page = $this.attr('pageIndex');
                queryCriteria.rows = $this.attr('pageSize');
                window.open($this.attr('href') + '?' + $.param(queryCriteria) + '&' + $.param(queryCriteriaForPrint));
            });

            $(this).click(function (event) {
                event.preventDefault();
                event.stopPropagation();
                var size = options.batchSize;
                var gridgetData = {};
                var flag = options.gridType == 'treegrid'; //兼容treegrid
                if (flag) {
                    gridgetData.total = $('#' + options.gridId).treegrid('getData').length;
                    gridgetData.rows = $('#' + options.gridId).treegrid('getData');

                } else {
                    gridgetData = $('#' + options.gridId).datagrid('getData');
                }
                if (gridgetData.total <= options.batchSize) {
                    size = gridgetData.total;
                }
                if ($('#' + id).size() > 0)
                    return;
                var html = "";
                if (gridgetData.total <= 0) {
                    html = '<ul id="' + id + '" class="shujuul">';
                    html += '<li><span>' + extendLangs.noneDataText + '</span></li>';
                } else {
                    html += '<ul id="' + id + '" class="shujuul">';
                    if (gridgetData.total <= size) {
                        var queryCriteria = options.getQueryCriteria(),
                        queryCriteriaForPrint = options.getQueryCriteriaForPrint();
                        queryCriteria.page = 1;
                        queryCriteria.rows = size;
                        //html += '<li><a href="' + options.exportUrl + '" pageIndex="' + 1 + '" pageSize="' + size + '">' + extendLangs.exportAllText + '</a></li>';
                        window.open(options.exportUrl + '?' + $.param(queryCriteria) + '&'
                            + $.param(queryCriteriaForPrint));
                        return;
                    } else {
                        var pageIndex = 0;
                        for (; pageIndex * size < gridgetData.total; pageIndex++) {
                            var begin = pageIndex * size + 1;
                            var end = (pageIndex + 1) * size;
                            if (end > gridgetData.total)
                                end = gridgetData.total;
                            var text = extendLangs.exportPageText.replace('{begin}', begin).replace('{end}', end);
                            html += '<li><a href="' + options.exportUrl + '" pageIndex="' + (pageIndex + 1)
                                + '" pageSize="' + size + '">' + text + '</a></li>';
                        }
                    }

                }
                html += '</ul>';
                art.dialog({
                    title: extendLangs.exportExcelText,
                    width: 300,
                    height: 300,
                    lock: true,
                    content: html
                });
            });
            return this;
        },

        // 表单数据转变成json
        serializeJson: function () {
            var serializeObj = {},
                array = this.serializeArray();

            $(array).each(function () {
                if (serializeObj[this.name]) {
                    serializeObj[this.name] = serializeObj[this.name] + ',' + this.value;
                } else {
                    serializeObj[this.name] = this.value;
                }
            });
            return serializeObj;
        },
        // 文件
        fileInput: function (options) {
            this.each(function () {
                var $this = $(this),
                html = '<button type="button" class="" >' + extendLangs.browser
                + '</button><input type="file" name="' + $this.attr("name") + "_file"
                + '" class="' + (options && options.fileClass ? options.fileClass : "fileInput") + '"/>',
                $button, $file, left, top, height, width,
                position,
                $parent = $this.parent();
                $this.addClass("file");
                // 修正父节点的位置,添加position:relative
                $(html).insertAfter($this);
                $parent.css("position", "relative");
                $button = $($parent.find("button")[0]);
                position = $this.position();
                left = position.left;
                top = position.top;
                height = $this.outerHeight();
                position = $button.position();
                width = position.left + $button.outerWidth();
                $file = $($parent.find(":file")[0])
                .css({
                    opacity: 0
                })
                .on("change", function (e) {
                    e.preventDefault();
                    $this.val($(this).val());
                });
            });
            return this;
        },
        address: function () {
            this.each(function () {
                var map = new MapBase(),
                    $this = $(this),
                    lng = $this.attr("lng"),
                    lat = $(this).attr("lat");
                if ($.isNumeric(lng) && $.isNumeric(lat)) {
                    map.getAddressNearby({ lng: lng, lat: lat },
                        function (data) {
                            if (data) {
                                if ($this.is("input")) {
                                    $this.val(data);
                                } else {
                                    $this.html(data);
                                }
                                $this.attr("title", data);
                            }
                        });
                }
            });
            return this;
        },
        adjust: function (options) {
            ///<summary>自适应窗口</summary>
            ///<param name="options" type="Object">options:{offset:{x:x,y:y}[,width:false[,height:true][,parent:""]]}</param>
            ///<returns type="JQueryDOM">this</returns>
            var that = this, process;
            function adjust() {
                // 延迟执行, 防止页面卡
                if ($.isNumeric(process)) {
                    clearTimeout(process);
                }
                process = setTimeout(function () {
                    process = null;
                    var
                       opts = $.extend({
                           offset: { x: 0, y: 0 },
                           width: false,
                           height: true,
                           parent: window
                       }, options),
                        $win = $(opts.parent),
                        winWidth = $win.innerWidth(),
                        winHeight = $win.innerHeight(),
                        $elem = $(that[0]),
                        offset = $elem.offset();
                    if (opts.parent != window) {
                        offset = $elem.position();
                    }
                    var
                     left = offset.left,
                     top = offset.top,
                     width = opts.width && (winWidth + opts.offset.x - left),
                     height = opts.height && (winHeight + opts.offset.y - top);
                    height && $elem.height(height);
                    width && $elem.width(width);
                }, 300);
            }
            adjust();
            $(window).on("resize", adjust);
            return this;
        }
    });
})(jQuery, window);


