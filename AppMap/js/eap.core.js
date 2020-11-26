///--------------------JS扩展

Date.prototype.format = function (format) {
    /*
    * eg:format="yyyy-MM-dd hh:mm:ss";
    */
    var o = {
        "M+": this.getMonth() + 1,  //month
        "d+": this.getDate(),     //day
        "h+": this.getHours(),    //hour
        "m+": this.getMinutes(),  //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}


Date.format = function (value, format) {

    var d = new Date(value);

    

    var o = {
        "M+": d.getMonth() + 1,  //month
        "d+": d.getDate(),     //day
        "h+": d.getHours(),    //hour
        "m+": d.getMinutes(),  //minute
        "s+": d.getSeconds(), //second
        "S": d.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}


String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
}

String.prototype.toFixed = function (digits) {
    return parseFloat(this).toFixed(digits);
}

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

String.format = function () {
    if (arguments.length == 0) return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};

//验证是否为邮箱格式
String.prototype.isEmail = function () {
    if (this.length == 0) return false;
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if (re.test(this)) {
        return true;
    }
    return false;
};

String.isEmail = function (value) {
    if (value.length == 0) return false;
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if (re.test(value)) {
        return true;
    }
    return false;
}


String.IsIpAddress = function (value) {
    var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    var reg = value.match(exp);
    if (reg == null) {
        return false;
    }

    return true;

}

///--------------------JS扩展



///--------------------

onerror = function (a1, a2, a3, a4, a5) {
    if (a5) {

        var exception = {
            message: a5.message,
            stack: a5.stack,
            url: a2,
            line: a3
        };

        var newline = System.Enviroment.NewLine;

        showerror = function (exception) {
            var m = 'msg:' + exception.message + newline;
            m += 'detail:' + newline + exception.stack + newline;

            alert(m);
        };
        //注意 网站发布时要注销掉该方法调用
      //  showerror(exception);

        return false;
    }
};

///--------------------


//---------------------System namespace

var System = {
    Isnull: function (v) {
        if (typeof (v) == "undefined") {
            return true;
        } else if (v == "") {
            return true;
        } else if (v == null) {
            return true;
        }

        return false;
    },
    Declare: function (ns) {
        var ar = ns.split('.');
        var root = window;
        for (var i = 0, len = ar.length; i < len; ++i) {
            var n = ar[i];
            if (!root[n]) {
                root[n] = {};
                root = root[n];
            }
            else {
                root = root[n];
            }
        }
    },
    IsDateTime: function (value) {
        var regex = new RegExp("^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$");
        var match = regex.exec(value);
        return match != null && match.length > 0;
    },
    Debugger: function (key) {
        if (window.location.href.indexOf(key) > 0) {
            debugger;
        }
    },
    Handlers: {
        HttpRequestErrorHandler: undefined,
        ErrorMessageHandler: undefined,
        GuidGenerateHandler: undefined,
        CultureInfoLoader: undefined
    },
    Reference: function (obj, path) {

        if (!path || !obj) {
            return undefined;
        }

        var items = path.split('.');

        if (items.length > 1) {
            var nitems = items.slice(1, items.length);
            var nobj = obj[items[0]];
            return this.Reference(nobj, nitems.join('.'));
        }
        return obj[items[0]];

    },
    Create: function (type) {
        eval('var o=new ' + type + '()');

        return o;
    },
    Enviroment: {
        NewLine: '\n',
        Os: window.navigator.appVersion,
        Platform: window.navigator.platform,
        HtmlNewLine: '<br/>'
    }
};

//System.Object
(function () {
    var _init = false;

    System.Object = function (prop) {
        var _base = this.prototype;
        _init = true;
        var proto = new this();
        _init = false;
        for (var name in prop) {
            proto[name] = typeof prop[name] == "function" &&
            typeof _base[name] == "function" ?
                (function (name, fn) {
                    return function () {
                        var tmp = this.base;
                        this.base = _base[name];
                        var ret = fn.apply(this, arguments);
                        this.base = tmp;
                        return ret;
                    };
                })(name, prop[name]) : prop[name];
        }

        function cls() {
            if (!_init && this.ctor)
                this.ctor.apply(this, arguments);
        }

        cls.prototype = proto;
        cls.constructor = cls;
        cls.Extends = arguments.callee;
        cls.prototype.Invoke = function () {
            var action = arguments[0];
            var actionHandler = this[action];
            if (typeof actionHandler === 'function') {
                var args = Array.prototype.slice.call(arguments, 1);
                actionHandler.apply(this, args);
            } else {
                throw new Error("method:" + action + ' not found');
            }
        }
        return cls;
    }.apply(Object, []);
})();

//System.List
(function () {
    var _init = false;

    System.List = function (prop) {
        var _base = this.prototype;
        _init = true;
        var proto = new this();

        _init = false;
        for (var name in prop) {
            proto[name] = typeof prop[name] == "function" &&
            typeof _base[name] == "function" ?
                (function (name, fn) {
                    return function () {
                        var tmp = this.base;
                        this.base = _base[name];
                        var ret = fn.apply(this, arguments);
                        this.base = tmp;
                        return ret;
                    };
                })(name, prop[name]) : prop[name];
        }

        function cls() {
            if (!_init && this.ctor)
                this.ctor.apply(this, arguments);
        }
        cls.prototype = proto;
        cls.constructor = cls;
        cls.Extends = arguments.callee;
        return cls;
    }.apply(Array, []);
})();




//----------------------基础类------------

System.KeyValuePair = System.Object.Extends({
    ctor: function (key, value) {
        if (key && value) {
            this.key = key;
            this.value = value;
        }
    },
    key: null,
    value: null
});

System.Dictionary = System.Object.Extends({

    ctor: function () {
        this.innerValues = new Array();
    },
    byKey: function (key) {
        for (var i = 0; i < this.innerValues.length; i++) {
            var kv = this.innerValues[i];
            if (kv.key == key) {
                return kv.value;
            }
        }
        return null;
    },
    byIndex: function (index) {
        return this.innerValues[index];
    },

    add: function (key, value) {

        if (this.byKey(key) != null) {
            return;
        }
        var kv = new System.KeyValuePair();
        kv.key = key;
        kv.value = value;
        this.innerValues.push(kv);
    },

    tryGet: function (key) {
        for (var i = 0; i < this.innerValues.length; i++) {
            var kv = this.innerValues[i];
            if (kv.key == key) {
                return kv.value;
            }
        }
        return null;
    },
    count: function (filter) {
        return this.innerValues.length;
    }
});


System.StringBuilder = System.Object.Extends({

    ctor: function () {
        this.innerValue = [];
        this.newLine = "\r\n";

    },

    append: function (value) {
        this.innerValue.push(value);
    },

    appendLine: function (value) {
        this.innerValue.push(value + this.newLine);
    },

    ToString: function () {
        return this.innerValue.join(' ');
    }
});

System.Url = {

    rootPath: null,
    queryString: null,
    virtualPath: null,

    GetVirtualPath: function () {
        if (this.virtualPath)
            return this.virtualPath;

        if (!this.rootPath) {
            var f = location.pathname;
            if (location.pathname.indexOf('/') == 0) {
                f = location.pathname.substring(1);
            }

            if (f.indexOf('/') >= 0) {
                f = f.substring(0, f.indexOf('/'));
            }
            this.rootPath = '/' + f;
        }

        var s = location.protocol + '//' + location.host

        s += this.rootPath;
        if (this.rootPath == "/") this.virtualPath = s;
        else {
            this.virtualPath = s + '/';
        }
        return this.virtualPath;
    },

    ParseUrl: function (url) {
        var result = {};
        var loc = url;
        if (loc.indexOf("?") > -1) {
            var l = loc.lastIndexOf("#") > -1 ? loc.lastIndexOf("#") : loc.length;
            var param_str = loc.substring(loc.indexOf("?") + 1, l);
            var params = param_str.split("&");
            for (var x = 0; x < params.length; x++) {
                params[x] = params[x].split("=");
                result[params[x][0]] = params[x][1];
            }
        }
        return result;
    },

    Get: function (key) {

        //分享来的from参数值，朋友：singlemessage；朋友圈：timeline；
        var isFromShare = System.Url._get("from");
        if (isFromShare) {
            var temKey = key.toLowerCase();
            if (temKey == "idwcpmember" || temKey == "openid" || temKey == "idloginmember" || temKey == "uid" || temKey == "entry") {
                return "";
            }
        }

        var parValue = System.Url._get(key);
        return parValue;
    },

    _get: function (key) {

        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            var x = unescape(r[2]);
            if (x == "null") {
                return "";
            }
            return decodeURI(x);
        }
        else {
            return "";
        }
    },

    Replace: function (url, key, val) {
        //替换指定传入参数的值,Key为参数,Val为新值
        var re = eval('/(' + key + '=)([^&]*)/gi');
        var nUrl = url.replace(re, key + '=' + val);
        return nUrl;
    },
    GetQueryStringItems: function (url) {
        var u = url || location.href;
        var obj = this.ParseUrl(u);
        return obj;
    },

    Combine: function (url, param) {
        ///<summary>组合Url</summary>
        ///<param name="url" type="string">原始的url，如：Default.aspx</param>
        ///<param name="param" type="object">参数对象，如：{ID:'XXXX',Type:'New'}</param>
        ///<returns type="string"/>

        var ar = [];
        url = this.getUrl(url);
        if (param) {
            for (var i in param) {
                if (typeof param[i] == 'string' ||
                    typeof param[i] == 'boolean' ||
                    typeof param[i] == 'number') {
                    ar.push(i + "=" + param[i].toString());
                }
            }
        }
        var m = '';
        if (ar.length > 0) {
            m = ar.join('&');
        }

        if (url.indexOf('?') > 0) {
            url += '&' + m;
        }
        else {
            url += '?' + m;
        }

        return url;
    },

    join: function (url, parmeters) {
        if (url.indexOf("?") > 0) {
            return url + "&" + parmeters;
        }
        else {
            return url + "?" + parmeters;
        }
    }
};

//-------------------------------------------------------------------------------------------------------------------------------


System.Net = {};

System.Net.HttpRequest = System.Object.Extends({
    ctor: function () {
        this.isAsync = true,
        this.url = '';
        this.httpMethod = 'POST';
        this.postData = null;
        this.contentType = 'application/json; charset=utf-8';
    },
    url: null,
    isAsync: true,
    onsuccess: undefined,
    onerror: undefined,
    httpMethod: 'post',
    postData: null,
    contentType: 'application/json; charset=utf-8'
});

System.Net.HttpClient = System.Object.Extends({
    postAsync: function (request) {
        request.isAsync = true;
        request.httpMethod = 'POST';
        this._ajax(request);
    },
    getAsync: function (request) {
        request.isAsync = true;
        request.httpMethod = 'GET';
        this._ajax(request);
    },
    postSync: function (request) {
        request.isAsync = false;
        request.httpMethod = 'POST';
        return this._ajax(request);
    },
    getSync: function (request) {
        request.isAsync = false;
        request.httpMethod = 'GET';
        return this._ajax(request);
    },
    getfileSync: function (request) {
        request.httpMethod = 'GET';
        request.isAsync = false;
        return this._get(request);
    },
    getfileAsync: function (request) {
        request.postData = undefined;
        request.httpMethod = 'GET';
        request.isAsync = true;
        return this._get(request);
    },
    post: function (url, data, callback, isAsync, errorCall) {

        var httprequest = new System.Net.HttpRequest();
        httprequest.url = url;
        httprequest.postData = data;
        httprequest.onerror = errorCall;


        if (!isAsync) {
            isAsync = true;
        }
        httprequest.isAsync = isAsync;
        if (isAsync) {
            httprequest.onsuccess = callback;
            this.postAsync(httprequest);
        }
        else {
            return this.postSync(httprequest);
        }


    },
    get: function (url, data, callback, isAsync, errorCall) {
        var httprequest = new System.Net.HttpRequest();
        httprequest.url = url;
        httprequest.postData = data;
        httprequest.onerror = errorCall;
        if (!isAsync) {
            isAsync = true;
        }
        httprequest.isAsync = isAsync;
        if (isAsync) {
            httprequest.onsuccess = callback;
            this.getAsync(httprequest);
        }
        else {
            return this.getSync(httprequest);
        }
    },
    getfile: function (url, callback, isAsync) {
        var httprequest = new System.Net.HttpRequest();
        httprequest.url = url;
        if (!isAsync) {
            isAsync = true;
        }
        httprequest.isAsync = isAsync;
        if (isAsync) {
            httprequest.onsuccess = callback;
            this.getfileAsync(httprequest);
        }
        else {
            return this.getfileSync(httprequest);
        }
    },
    _ajax: function (request) {
        if (!jQuery) {
            return;
        }

        if (!request.url) {
            throw new Error('url is null');
        }

        var json = JSON.stringify(request.postData);

        var retValue = undefined;

        jQuery.ajax({
            url: request.url,
            dataType: 'json',
            contentType: request.contentType,
            type: request.httpMethod,
            async: request.isAsync,
            data: json,
            success: function (data) {

                if (!data.IsSuccess) {
                    if (request.onerror) {
                        request.onerror(data);
                    }
                    return;
                }
                if (request.onsuccess) {
                    request.onsuccess(data.Data);
                }
                else {
                    retValue = data.Data;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var obj = { "Message": "Error" };
                if (jqXHR.status == 500) {
                    if (jqXHR.responseJSON != null) {
                        obj.Message = jqXHR.responseJSON.Message;
                    }
                } else {
                    obj = JSON.parse(jqXHR.responseText);
                }

                //if (request.onerror) {
                //    request.onerror(obj);
                //}
                //else if (System.Handlers.HttpRequestErrorHandler) {
                //    System.Handlers.HttpRequestErrorHandler(obj.Message);
                //}
                //else if (System.Handlers.ErrorMessageHandler) {
                //    System.Handlers.ErrorMessageHandler(obj.Message);
                //}
                return;
            }
        });

        return retValue;
    },
    _get: function (request) {
        if (!jQuery) {
            return;
        }

        if (!request.url) {
            throw new Error('url is null');
        }

        var json = JSON.stringify(request.postData);

        var retValue = undefined;

        jQuery.ajax({
            url: request.url,
            type: 'GET',
            async: request.isAsync,
            data: json,
            success: function (data) {
                if (request.onsuccess) {
                    request.onsuccess(data);
                }
                else {
                    retValue = data;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var obj = JSON.parse(jqXHR.responseText);

                if (request.requesterror) {
                    request.requesterror(obj.Message);
                }

                return;
            }
        });

        return retValue;
    }
});

System.Dom = {

    Element: function (selector, action) {
        var domele = document.querySelector(selector);
        return action(domele);
    },
    Elements: function (selector, action) {
        var doms = document.querySelectorAll(selector);
        Array.prototype.forEach.call(doms, action);
    }
};




EAP = {};

EAP.Controller = System.Object.Extends({
    controller: null,
    ctor: function (controllerName) {
        this.controller = controllerName;
    },
    onerror: undefined,
    ExecuteAction: function (action) {
        this.Invoke.apply(this, arguments);
    },
    ExecuteServerAction: function (action, postdata, onsuccess) {
        var req = new System.Net.HttpRequest();
        req.url = "/" + this.controller + '/' + action
        req.postData = postdata;
        req.onsuccess = onsuccess;
        req.onerror = this.onerror;
        var client = new System.Net.HttpClient();
        client.postAsync(req);

    },
    ExecuteServerActionSync: function (action, postdata) {
        var client = new System.Net.HttpClient();
        var req = new System.Net.HttpRequest();
        req.url = "/" + this.controller + '/' + action;
        req.postData = postdata;
        return client.postSync(req);
    }
});




System.CultureInfo = {
    LanguageName: undefined,
    LanguageId: 2052,
    Localization: undefined,
    GetDisplayText: function (key) {
        return key;
    },
    GetDateFormatStr: function () {
        if (!this._dataFormat) {

            this._dataFormat = System.Cookies.get('DATEFORMAT');// this.GetDisplayText("DoF");
        }
        return this._dataFormat;
    },
    GetDateTimeFormatStr: function () {
        if (!this._dataTimeFormat) {
            this._dataTimeFormat = System.Cookies.get('DATEFORMAT') + " HH:mm";//this.GetDisplayText("DToF");
        }
        return this._dataTimeFormat;
    },
    CovertTimeStr: function (str) {
        str = str.replace(/T/g, ' ').replace(/-/g, "/")
        var dotIndex = str.indexOf('.');
        if (dotIndex >= 0) str = str.substr(0, dotIndex)
        return str;
    },
    StrToDate: function (str) {
        return new Date(this.CovertTimeStr(str))
    },
    FormatDate: function (date) {
        var dObj;
        if (!date)
            return "";
        try {
            if (typeof date === 'string') { //解决ie 和 chrome 不同问题
                date = this.CovertTimeStr(date)
                //date = date.replace(/T/g, ' ').replace(/-/g, "/")
                //var dotIndex = date.indexOf('.');
                //if (dotIndex >= 0) date = date.substr(0, dotIndex)
            }
            dObj = new Date(date);
        } catch (e) {
            return "";
        }
        return dObj.format(this.GetDateFormatStr());
    },
    FormatDateTime: function (date) {
        var dObj;
        if (!date)
            return "";
        try {
            if (typeof date === 'string') { //解决ie 和 chrome 不同问题
                date = this.CovertTimeStr(date)
            }
            dObj = new Date(date);
        } catch (e) {
            return "";
        }
        return dObj.format(this.GetDateTimeFormatStr());
    }
};