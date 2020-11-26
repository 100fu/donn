define(["require", "exports", "./../../FES/Business/Cultures", "./../../FES/scripts/Utilities/DataSet", "./../../FES/scripts/Utilities/DataSource", "./../../FES/scripts/Plugins/Nav", "../../FES/Business/Request"], function (require, exports, Cultures_1, DataSet_1, DataSource_1, Nav_1, Request_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MenuAdapter = function (data) {
        var result = [], id = 0; //id 本应使用d.IdPrivilege;
        data.forEach(function (d) {
            var obj = {};
            if (d.menus)
                obj.children = MenuAdapter(d.menus);
            obj.id = (++id).toString(); //d.IdPrivilege;
            obj.title = d.menuname;
            obj.url = d.url;
            result.push(obj);
        });
        return result;
    };
    var ds = new DataSource_1.DataSource({
        Read: function (p) {
            return Request_1.Post({
                url: "/Home/GerArchMenus_new", onSuccess: function (d) {
                    p.Success(MenuAdapter(d));
                    navControl.SetCurrentUser({
                        title: userName,
                        children: [{ title: Cultures_1.CultureInfo.TranslateText("Exit") }]
                    }, function (e) {
                        if (e.target.classList.contains("dropdown-item"))
                            location.assign("/Home/Logout");
                    });
                }
            });
        }
    });
    var ifram = document.createElement("iframe");
    ifram.style.border = "0";
    ifram.classList.add("embed-responsive-item");
    ifram.style.overflow = "";
    var nav = document.createElement("div");
    document.body.appendChild(nav);
    var userName = DataSet_1.Cookie.get("EAMUSERNAME");
    var navControl = new Nav_1.Nav(nav, { dataSource: ds, brand: "PMDC", brandUrl: "/SM/Darggable", target: ifram });
    var iframeDiv = document.createElement("div");
    iframeDiv.classList.add("embed-responsive", "embed-responsive-16by9");
    iframeDiv.appendChild(ifram);
    document.body.appendChild(iframeDiv);
});
