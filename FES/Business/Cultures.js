define(["require", "exports", "./Request", "../scripts/Utilities/DataSet"], function (require, exports, Request_1, DataSet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CultureInfo = (function () {
        function CultureInfo() {
        }
        CultureInfo.GetLanages = function () {
            var _this = this;
            var kind = DataSet_1.Cookie.get("EAMLANGUAGE") || "ENG";
            var ver = DataSet_1.Cookie.get('EAMVER') || "";
            Request_1.Post({ url: '/Resource/Localization/' + kind + ".json?v=" + ver, async: false, method: "GET", onSuccess: function (d) { _this.LanageStorage = typeof d === "string" ? JSON.parse(d) : d; } });
        };
        CultureInfo.TranslateText = function (text) {
            if (!this.LanageStorage)
                this.GetLanages();
            return this.LanageStorage[text.toLowerCase()] || text;
        };
        return CultureInfo;
    }());
    exports.CultureInfo = CultureInfo;
});
