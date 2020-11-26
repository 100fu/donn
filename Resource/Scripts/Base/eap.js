///--------------------JS扩展

Date.prototype.format = function (format) {
    /*
    * eg:format="yyyy-MM-dd hh:mm:ss";
    */
    var o = {
        "M+": this.getMonth() + 1,  //month
        "d+": this.getDate(),     //day
        "h+": this.getHours(),    //hour

        "H+": this.getHours(),    //TODO hour 24 format add by qzx

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



///--------------------JS扩展

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
            return;
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
    },
    SetValue: function (obj, path, value) {
        if (!path || !obj) {
            return;
        }

        var items = path.split('.');

        if (items.length > 1) {
            var nitems = items.slice(1, items.length);
            var nobj = obj[items[0]] = obj[items[0]] || {};
            this.SetValue(nobj, nitems.join('.'), value);
        } else
            obj[items[0]] = value;
        return obj;
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

//---------------------System namespace

//---------------------静态方法


Guid = {};
Guid.Empty = '00000000-0000-0000-0000-000000000000';
Guid.IdCache = [];
Guid.NewId = function () {
    if (Guid.IdCache.length > 0) {
        return Guid.IdCache.pop();
    }
    else {
        var client = new System.Net.HttpClient();
        var url = '/EAP/NewId';
        var data = { "count": 10 };

        client.post(url, data, function (retData) {

            for (var i = 0; i < retData.length; i++) {
                Guid.IdCache.push(retData[i]);
            }

        }, false);

        return Guid.IdCache.pop();
    }
}



System.isnull = function (a) {
    if (typeof (a) == "undefined") {
        return true;
    } else if (a == "") {
        return true;
    } else if (a == null) {
        return true;
    }

    return false;
};

System.isGuid = function (guid) {
    if (System.isnull(guid)) {
        return false;
    }

    if (guid.length != 36) {
        return false;
    }

    var lens = [8, 13, 18, 23];

    for (var i = 0; i < lens.length; i++) {
        if (guid[lens[i]] != "-") {
            return false;
        }
    }

    return true;
}

System.isDateTime = function (reObj) {

    var regex = new RegExp("^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$");

    var match = regex.exec(reObj);

    return match != null && match.length > 0;

};

System.Declare = function (ns) {
    ///<summary>声明命名空间</summary>
    ///<param name="ns" type="string">命名空间，如：Netsharp.Core</param>
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
};

System.ExecuteScript = function (script) {
    ///<summary>运行传入的脚本内容</summary>
    ///<param name="script" type="string">需要执行的脚本内容</param>
    if (!script) return;
    var head = document.getElementsByTagName("head")[0] || document.documentElement,
        scriptEle = document.createElement("script");

    scriptEle.type = "text/javascript";
    try {
        scriptEle.appendChild(document.createTextNode(script));
    }
    catch (exxx) {
        scriptEle.text = script;
    }

    head.insertBefore(scriptEle, head.firstChild);
    try {
        head.removeChild(scriptEle);
    }
    catch (exxx) { }
}


System.Debugger = function (key) {
    if (window.location.href.indexOf(key) > 0) {
        debugger;
    }
};

System.isDebugger = true;

//---------------------静态方法


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

    tryGet: function (key, value) {

        for (var i = 0; i < this.innerValues.length; i++) {

            var kv = this.innerValues[i];
            if (kv.key == key) {

                value = kv.value;

                return true;
            }
        }

        return false;
    },

    getLength: function () {
        return this.innerValues.length;
    },

    count: function (filter) {
        return this.getLength();
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

//-------------------------------------------------------------------------------------------------------------------------------

System.Url = {

    rootPath: null,
    queryString: null,
    virtualPath: null,

    GetVirtualPath: function () {
        ///<returns type="string"/>
        if (this.virtualPath) return this.virtualPath;

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
        url = url;
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

System.Data = {};
// 摘要: 
//     指定 .NET Framework 数据提供程序的字段、属性或 Parameter 对象的数据类型。
System.Data.DbType =
    {
        // 摘要: 
        //     非 Unicode 字符的可变长度流，范围在 1 到 8,000 个字符之间。
        AnsiString: 0,
        //
        // 摘要: 
        //     二进制数据的可变长度流，范围在 1 到 8,000 个字节之间。
        Binary: 1,
        //
        // 摘要: 
        //     一个 8 位无符号整数，范围在 0 到 255 之间。
        Byte: 2,
        //
        // 摘要: 
        //     简单类型，表示 true 或 false 的布尔值。
        Boolean: 3,
        //
        // 摘要: 
        //     货币值，范围在 -2 63（即 -922,337,203,685,477.5808）到 2 63 -1（即 +922,337,203,685,477.5807）之间，精度为千分之十个货币单位。
        Currency: 4,
        //
        // 摘要: 
        //     表示日期值的类型。
        Date: 5,
        //
        // 摘要: 
        //     表示一个日期和时间值的类型。
        DateTime: 6,
        //
        // 摘要: 
        //     简单类型，表示从 1.0 x 10 -28 到大约 7.9 x 10 28 且有效位数为 28 到 29 位的值。
        Decimal: 7,
        //
        // 摘要: 
        //     浮点型，表示从大约 5.0 x 10 -324 到 1.7 x 10 308 且精度为 15 到 16 位的值。
        Double: 8,
        //
        // 摘要: 
        //     全局唯一标识符（或 GUID）。
        Guid: 9,
        //
        // 摘要: 
        //     整型，表示值介于 -32768 到 32767 之间的有符号 16 位整数。
        Int16: 10,
        //
        // 摘要: 
        //     整型，表示值介于 -2147483648 到 2147483647 之间的有符号 32 位整数。
        Int32: 11,
        //
        // 摘要: 
        //     整型，表示值介于 -9223372036854775808 到 9223372036854775807 之间的有符号 64 位整数。
        Int64: 12,
        //
        // 摘要: 
        //     常规类型，表示任何没有由其他 DbType 值显式表示的引用或值类型。
        Object: 13,
        //
        // 摘要: 
        //     整型，表示值介于 -128 到 127 之间的有符号 8 位整数。
        SByte: 14,
        //
        // 摘要: 
        //     浮点型，表示从大约 1.5 x 10 -45 到 3.4 x 10 38 且精度为 7 位的值。
        Single: 15,
        //
        // 摘要: 
        //     表示 Unicode 字符串的类型。
        String: 16,
        //
        // 摘要: 
        //     一个表示 SQL Server DateTime 值的类型。如果要使用 SQL Server time 值，请使用 System.Data.SqlDbType.Time。
        Time: 17,
        //
        // 摘要: 
        //     整型，表示值介于 0 到 65535 之间的无符号 16 位整数。
        UInt16: 18,
        //
        // 摘要: 
        //     整型，表示值介于 0 到 4294967295 之间的无符号 32 位整数。
        UInt32: 19,
        //
        // 摘要: 
        //     整型，表示值介于 0 到 18446744073709551615 之间的无符号 64 位整数。
        UInt64: 20,
        //
        // 摘要: 
        //     变长数值。
        VarNumeric: 21,
        //
        // 摘要: 
        //     非 Unicode 字符的固定长度流。
        AnsiStringFixedLength: 22,
        //
        // 摘要: 
        //     Unicode 字符的定长串。
        StringFixedLength: 23,
        //
        // 摘要: 
        //     XML 文档或片段的分析表示。
        Xml: 25,
        //
        // 摘要: 
        //     日期和时间数据。日期值范围从公元 1 年 1 月 1 日到公元 9999 年 12 月 31 日。时间值范围从 00:00:00 到 23:59:59.9999999，精度为
        //     100 毫微秒。
        DateTime2: 26,
        //
        // 摘要: 
        //     显示时区的日期和时间数据。日期值范围从公元 1 年 1 月 1 日到公元 9999 年 12 月 31 日。时间值范围从 00:00:00 到 23:59:59.9999999，精度为
        //     100 毫微秒。时区值范围从 -14:00 到 +14:00。
        DateTimeOffset: 27
    }

Loglevel = undefined;

System.Log = {
    info: function (message) {

        //        if (typeof console == 'undefined')
        //        {
        //            return;
        //        }

        //        var d = new Date();
        //        var msg = message;
        //        console.info(msg);
    },
    assert: function (condition, message) {

        //        if (typeof console == 'undefined') {
        //            return;
        //        }

        //        console.assert(condition, message);
    }
};


System.LocalData = {
    storage: window.localStorage,
    get: function (key) {
        if (!this.storage)
            return null;
        return this.storage.getItem(key);
    },
    set: function (key, value) {
        if (!this.storage)
            return;
        this.storage.setItem(key, value);
    },
    remove: function (key) {
        if (!this.storage)
            return false;
        this.storage.removeItem(key);
    }
};


System.Cookies = {
    //    getCookieAdapter: function () {
    //        (function () { }).apply(jquery, arguments);
    //    },
    get: function (name) {

        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));

        if (arr != null) return unescape(arr[2]); return null;
    },
    set: function (name, value, expires) {

        this.remove(name);

        var Days = expires || 7;

        var exp = new Date();

        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);

        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
    },
    remove: function (name) {

        var exp = new Date();

        exp.setTime(exp.getTime() - 1);

        var cval = this.get(name);

        if (cval != null) {
            cval = '';
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
        }
    }
};


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

System.getValue = function (obj, str) {
    if (!str) return null;
    var array = str.trim().split('.');
    var value = obj
    for (var i = 0; i < array.length; i++) {
        if (!value) return null;
        value = value[array[i]];
    }
    return value;
};

System.Using = (function (oHead) {

    function loadError(oError) {
        throw new URIError("The script " + oError.target.src + " is not accessible.");
    }

    return function (sSrc, fOnload) {
        var oScript = document.createElement("script");
        oScript.onerror = loadError;
        if (fOnload) { oScript.onload = fOnload; }
        oHead.appendChild(oScript);
        oScript.src = sSrc;
    }

})(document.head || document.getElementsByTagName("head")[0]);

Activactor = {

    CreateInstance: function (type) {
        eval('var o=new ' + type + '()');

        return o;
    },
    Reference: function (obj, path) {

        if (!path || !obj) {
            return undefined;
        }

        var items = path.split('.');

        if (items.length > 1) {
            var nitems = items.slice(1, items.length);
            var nobj = obj[items[0]];
            return Activactor.Reference(nobj, nitems.join('.'));
        }
        return obj[items[0]];

    }
};


Enviroment = {
    NewLine: '\n',
    Os: window.navigator.appVersion,
    Platform: window.navigator.platform,
    HtmlNewLine: '<br/>'
};

onerror = function (a1, a2, a3, a4, a5) {
    if (a5) {

        var exception = {
            message: a5.message,
            stack: a5.stack,
            url: a2,
            line: a3
        };

        showerror = function (exception) {
            var m = 'msg:' + exception.message + Enviroment.NewLine;
            m += Enviroment.Os + Enviroment.NewLine + Enviroment.Platform + Enviroment.NewLine;
            m += 'url:' + exception.url + Enviroment.NewLine;
            m += 'line:' + exception.line + Enviroment.NewLine;
            m += 'detail:' + Enviroment.NewLine + exception.stack + Enviroment.NewLine;

            alert(m);
        };

        // showerror(exception);

        return false;
    }
};




System.Net = {};

System.Net.HttpErrorHandler = undefined;

System.Net.PostDataProcesser = undefined;

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
    requesterror: function (message) {
        alert(message);
    },
    httpMethod: 'post',
    postData: null,
    contentType: 'application/json; charset=utf-8'
});



System.Net.HttpClient = System.Object.Extends({
    getfile: function (url, callback, isAsync, errorcallback) {
        if (!jQuery) {
            return;
        }

        if (isAsync == undefined) {
            isAsync = true;
        }

        jQuery.ajax({
            url: url,
            type: 'GET',
            async: isAsync,
            success: function (data) {
                if (callback) {
                    callback(data);
                }
                else {
                    return data;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var strmess = jqXHR.responseText;
                if (strmess.trim() == "");
                return;
                var obj = JSON.parse(jqXHR.responseText);
                if (errorcallback) {

                    errorcallback(obj);
                }
                else if (System.Net.HttpErrorHandler) {
                    System.Net.HttpErrorHandler.ShowError(obj.Message);
                }
                else {
                    //alert(jqXHR);
                    //document.body.innerHTML = obj.Message;
                }
            }
        });
    },
    ajax: function (url, method, data, callback, isAsync, errorcallback) {
        if (!jQuery) {
            return;
        }

        if (isAsync == undefined) {
            isAsync = true;
        }

        jQuery.ajax({
            url: url,
            type: method,
            async: isAsync,
            data: data,
            success: function (data) {

                if (!data.IsSuccess) {
                    if (data.indexOf("no_data") >= 0) {
                        alert();
                    } else {
                        alert(data.Message);
                        return;
                    }

                }

                if (callback) {
                    callback(data.Data);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                var obj = JSON.parse(jqXHR.responseText);
                if (errorcallback) {
                    errorcallback(obj);
                }
                else if (System.Net.HttpErrorHandler) {
                    System.Net.HttpErrorHandler.ShowError(obj.Message);
                }
                else {
                    //alert(jqXHR);
                    //document.body.innerHTML = obj.Message;
                }
            },
            complete: function (XHR, TS) {

            }
        });
    },
    post: function (url, data, onsuccess, isAsync, onerror) {
        this.ajax(url, "POST", data, onsuccess, isAsync, onerror);
        //var req = new System.Net.HttpRequest();
        //req.url = url;
        //req.postData = data;
        //req.onsuccess = onsuccess;
        //req.onerror = onerror;

        //if (isAsync == undefined || isAsync == true) {
        //    this.postAsync(req);
        //}
        //else {
        //    return this.postSync(req);
        //}
    },
    get: function (url, data, onsuccess, isAsync, onerror) {
        this.ajax(url, "GET", data, onsuccess, isAsync, onerror);

        //var req = new System.Net.HttpRequest();
        //req.url = url;
        //req.postData = data;
        //req.onsuccess = onsuccess;
        //req.onerror = onerror;

        //if (isAsync == undefined || isAsync == true) {
        //    this.getAsync(req);
        //}
        //else {
        //    return this.getSync(req);
        //}

    },
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
    _ajax: function (request) {
        if (!jQuery) {
            return;
        }

        if (!request.url) {
            throw new Error('url is null');
        }
        if (System.Net.PostDataProcesser)
            request.postData = System.Net.PostDataProcesser(request.postData);
        var json = JSON.stringify(request.postData);// request.postData;// JSON.stringify(request.postData);//.net core requires [fromBody] for body
        //var json = request.postData;
        var retValue = undefined;

        jQuery.ajax({
            url: request.url,
            dataType: 'json',
            contentType: request.contentType, //.net core requires [fromBody] for body
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
                var obj = JSON.parse(jqXHR.responseText);

                if (request.requesterror) {
                    request.requesterror(obj.Message);
                }

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

        //var json = JSON.stringify(request.postData);
        var json = request.postData;
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

//System.Reference = function (obj, path) {

//    if (!path || !obj) {
//        return undefined;
//    }

//    var items = path.split('.');

//    if (items.length > 1) {
//        var nitems = items.slice(1, items.length);
//        var nobj = obj[items[0]];
//        return System.Reference(nobj, nitems.join('.'));
//    }

//    return obj[items[0]];

//};


System.CultureInfo = {
    LanguageName: undefined,
    LanguageId: 2052,
    Localization: undefined,
    GetDisplayText: function (key) {
        if (System.CultureInfo.Localization == undefined) {
            if (System.Handlers.CultureInfoLoader) {
                this.Localization = System.Handlers.CultureInfoLoader(this.LanguageName);
            }
            else {
                throw new Error('System.CultureInfo.Localization 尚未初始化');
            }
        }
        if (!key) return '';
        if (typeof key === "string") {
            key = key.replace(/\r|\n/ig, "");
        }
        else {
            if (key.toString)
                key = key.toString();
        }

        try {
            var v = System.CultureInfo.Localization[key.toLowerCase()];

            if (!v) {
                return key;
            }
            return v;
        }
        catch (error) {
            return key;
        }
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


EAP = {};

EAP.Core = {};


EAP.Core.ObjectState = {
    NoChange: 1,
    New: 2,
    Modified: 4,
    Deleted: 8
}

EAP.Core.Entity = System.Object.Extends({
    Id: null,
    ObjectState: EAP.Core.ObjectState.NoChange
});


EAP.Core.BusinessEntity = EAP.Core.Entity.Extends({
    Code: null,
    Name: null
});

EAP.Core.CommandType =
    {
        Text: 1,
        StoredProcedure: 4,
        TableDirect: 512
    }

EAP.Core.QueryParameter = System.Object.Extends({
    ParameterName: null,
    Value: null
});

EAP.Core.EntityQuerySelectType =
    {
        None: -1,
        Single: 0,
        References: 2,
        Subs: 4,
        SubsWithReference: 8
    };


EAP.Core.EntityQueryCommand = System.Object.Extends({
    ctor: function () {
        this.Parmeters = [];
    },
    EntityType: EAP.Core.EntityQuerySelectType.None,
    Filter: null,
    OrderBy: null,
    PageIndex: 0,
    Pagesize: 0,
    Selects: null,
    SelectType: 0,
    TotalCount: 0,
    Parmeters: [],
    TimeOut: 10,
    InIdSql: function (ids, parmeterName) {
        if (!parmeterName) {
            parmeterName = '@ids';
        }
    },
    AddParmeter: function (parmeterName, value) {
        if (!parmeterName) {
            return;
        }

        if (!value) {
            return;
        }
        var parmeter = new EAP.Core.QueryParameter();
        parmeter.ParameterName = parmeterName;
        parmeter.Value = value;
        this.Parmeters.push(parmeter);
    }
});

System.Handlers.GuidGenerateHandler = function (count) {

    if (!count) {
        count = 10;
    }

    var ctrl = new EAP.EAPController();
    return ctrl.ExecuteServerActionSync('NewId', { "count": count });

}


System.Handlers.CultureInfoLoader = function (languageName) {

    if (!languageName) {
        languageName = System.Cookies.get('EAMLANGUAGE');
    }

    var ver = System.Cookies.get('EAMVER');
    var client = new System.Net.HttpClient();
    var req = new System.Net.HttpRequest();
    req.url = '/Resource/Localization/' + languageName + ".json?v=" + ver;


    var jsondata = JSON.parse(client.getfileSync(req));
    return jsondata;

}



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
        var client = new System.Net.HttpClient();
        client.postAsync(req);

    },
    ExecuteServerActionSync: function (action, postdata) {
        var client = new System.Net.HttpClient();
        var req = new System.Net.HttpRequest();
        req.url = "/" + this.controller + '/' + action;
        req.postData = postdata;
        req.onerror = function (data) {
            if (data.Message == "RedirectLogin") {
                var wc = window
                while (wc.parent != wc) {
                    wc = wc.parent;
                }
                wc.location.assign("/Home/Login");
            }
        };
        return client.postSync(req);
    }
});


EAP.EAMController = EAP.Controller.Extends({
    ctor: function (controllerName) {
        if (controllerName)
            this.controller = controllerName;
    },
    ExecuteServerAction: function (actionOrUrlObj, postdata, onsuccess, onerror) {
        var req = this._initClient(actionOrUrlObj, postdata, onsuccess, onerror);
        req.requesterror = function (data) { req.onerror({ Message: data }) };
        var client = new System.Net.HttpClient();
        client.postAsync(req);
    },
    ExecuteServerActionSync: function (actionOrUrlObj, postdata, onsuccess, onerror) {
        var client = new System.Net.HttpClient();
        var req = this._initClient(actionOrUrlObj, postdata, onsuccess, onerror);
        req.requesterror = function (data) { req.onerror({ Message: data }) };;
        return client.postSync(req);
    },
    _initClient: function (actionOrUrlObj, postdata, onsuccess, onerror) {
        var req = new System.Net.HttpRequest();
        if (typeof actionOrUrlObj === "string")
            req.url = "/" + this.controller + '/' + actionOrUrlObj
        else if (typeof actionOrUrlObj === "object") {
            req.url = "/" + actionOrUrlObj.controller + '/' + actionOrUrlObj.action;
            if (actionOrUrlObj.parameters) {
                req.url = System.Url.Combine(req.url, actionOrUrlObj.parameters);
            }
        }
        req.postData = postdata;
        req.onsuccess = onsuccess;
        req.onerror = function (data) {
            if (data.Message == "RedirectLogin") {
                var wc = window
                while (wc.parent != wc) {
                    wc = wc.parent;
                }
                wc.location.assign("/Home/Login");
            } else
                if (onerror)
                    onerror(data.Message);
                else if (System.Net.HttpErrorHandler)
                    System.Net.HttpErrorHandler.ShowError(data.Message)
        };
        return req;
    }
});

EAP.EAPController = EAP.Controller.Extends({
    ctor: function () {
        this.base('EAP');
    },
    HasReference: function (entitytype, id, onsuccess) {
        this.ExecuteServerAction('CheckReference', { entityType: entitytype, ids: id }, onsuccess);
    },
    Save: function (entity, onsuccess) {
        this.ExecuteServerAction('Save', { entity: entity }, onsuccess);
    },
    Query: function (entitQueryCommand, onsuccess) {
        this.ExecuteServerAction('Query', { command: entitQueryCommand },
            function (data) {
                if (onsuccess) {
                    onsuccess(data);
                }
            });
    }
});

System.EntityService = System.Object.Extends({
    ctor: function () {

    },
    HasReference: function (entitytype, id, callback) {

        var ctrl = new EAP.EAPController();
        ctrl.HasReference(entitytype, id, callback);

    }

});


///'{0} is dead, but {1} is alive! {0} {2}'.format( 'ASP', 'ASP.NET');
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match;
    });
};
