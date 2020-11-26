define(["require", "exports", "./Extend"], function (require, exports, Extend_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // enum ContentType{  //vs 2017 ts 15.4 中不可指定string 类型enum
    //     json = "application/json"
    //     // "form"="multipart/form-data; charset=utf-8; boundary=something"
    // }
    var ContentType = (function () {
        function ContentType() {
        }
        return ContentType;
    }());
    ContentType.json = "application/json";
    var Ajax = (function () {
        function Ajax(options) {
            this.options = options;
            this.options = Extend_1.Extend(this.options, { async: true, method: "POST", contentType: "form" });
            this.configOAjax();
        }
        Ajax.prototype.done = function (fn, err) {
            var _this = this;
            this.oAjax.onreadystatechange = function () {
                if (_this.oAjax.readyState == 4)
                    if (_this.oAjax.status >= 200 && _this.oAjax.status < 300)
                        fn && fn(_this.distillData(), _this.oAjax.status, _this.oAjax);
                    else
                        err && err(_this.oAjax.status, _this.oAjax);
            };
            this.oAjax.open(this.options.method, this.options.url, this.options.async);
            if (ContentType[this.options.contentType])
                this.oAjax.setRequestHeader("Content-Type", ContentType[this.options.contentType]);
            this.oAjax.send(this.PostDataConvert(this.options.contentType, this.options.data));
        };
        Ajax.prototype.PostDataConvert = function (type, data) {
            if (!data)
                return data;
            var res;
            switch (type) {
                case "json":
                    if (typeof data === "string") {
                        res = data;
                        break;
                    }
                    res = JSON.stringify(data);
                    break;
                case "form":
                    if (data instanceof FormData) {
                        res = data;
                        break;
                    }
                    res = new FormData();
                    if (typeof data === "string") {
                        data.split("&").forEach(function (item) {
                            var i = item.split("=");
                            res.append(i[0], i[1]);
                        });
                    }
                    else if (typeof data === "object") {
                        for (var n in data) {
                            if (data.hasOwnProperty(n))
                                res.append(n, (typeof data[n] === "string") ? data[n] : JSON.stringify(data[n]));
                        }
                    }
                    break;
                default:
                    break;
            }
            return res;
        };
        Ajax.prototype.configOAjax = function () {
            if (window["XMLHttpRequest"])
                this.oAjax = new XMLHttpRequest();
            else
                this.oAjax = new ActiveXObject("Microsoft.XMLHTTP"); //为兼容IE6
        };
        Ajax.prototype.distillData = function () {
            var type;
            try {
                type = this.oAjax.getResponseHeader("Content-Type");
            }
            catch (e) {
                console.log(e);
            }
            if (type.indexOf("application/json;") != -1)
                return JSON.parse(this.oAjax.responseText);
            else
                return this.oAjax.responseText;
        };
        return Ajax;
    }());
    exports.Ajax = Ajax;
});
