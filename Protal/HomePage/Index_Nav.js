define(["require", "exports", "./Index_Actions", "../../FES/scripts/Plugins/Nav_Custom", "../../FES/Business/Request", "../../FES/scripts/Utilities/DataSource", "../../FES/Business/Cultures"], function (require, exports, Index_Actions_1, Nav, Request_1, DataSource_1, Cultures_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var i = 0;
    /**
        * It is adapter of enums for ignoring differences betwoon server data and structure in script
        */
    var MenuAdapter = function (data) {
        var result = []; //id 本应使用d.IdPrivilege;
        data.forEach(function (d) {
            var obj = {};
            if (d.menus)
                obj.children = MenuAdapter(d.menus);
            obj.id = (++i).toString(); //d.IdPrivilege;
            obj.title = d.menuname;
            obj.url = d.url;
            result.push(obj);
        });
        return result;
    };
    exports.InitializeUserInfo = function (mainPage) {
        //TODO　异步
        var name = "";
        Request_1.Post({ url: "/Home/GerUserInfo", async: false, onSuccess: function (d) { return name = d; } });
        var result = {
            name: name, dataSource: [
                { title: Cultures_1.CultureInfo.TranslateText("Exit"), click: function () { return location.assign("/Home/Logout"); }, id: (++i).toString() },
                { title: Cultures_1.CultureInfo.TranslateText("PwdMod"), click: function () { return Index_Actions_1.ModifyPassword(); } },
                { title: Cultures_1.CultureInfo.TranslateText("Console"), url: "/SM/Darggable", id: (++i).toString() },
                { title: "AssetDetail_DEMO", url: "/Archives/AssetDetials", id: (++i).toString() },
            ]
        };
        mainPage.InitUserInfo(result);
    };
    exports.InitializeUserInfo(new Nav.MainPage(document.getElementById("mp"), {
        data: new DataSource_1.DataSource({
            Read: function (p) { return Request_1.Post({
                url: "/Home/GerArchMenus_new", onSuccess: function (d) {
                    return p.Success(MenuAdapter(d));
                }
            }); }
        })
    }));
});
