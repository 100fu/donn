define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScriptsHelper = (function () {
        function ScriptsHelper() {
        }
        ScriptsHelper.Load = function (url, onload) {
            var script = document.createElement("script");
            script.async = false;
            script.type = "text/javascript";
            script.setAttribute('src', url + '?' + 'time=' + Date.parse(new Date().toString()));
            script.onload = onload;
            var div = document.createElement("div");
            div.appendChild(script);
            document.head.appendChild(div);
        };
        return ScriptsHelper;
    }());
    exports.ScriptsHelper = ScriptsHelper;
    var CssHelper = (function () {
        function CssHelper() {
        }
        CssHelper.Load = function (url, onload) {
            var link = document.createElement('link');
            // link.id   = cssId;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url;
            link.onload = onload;
            link.media = 'all';
            document.head.appendChild(link);
        };
        return CssHelper;
    }());
    exports.CssHelper = CssHelper;
});
