import { ModifyPassword } from './Index_Actions';
import * as Nav from "../../FES/scripts/Plugins/Nav_Custom";
import { Post } from "../../FES/Business/Request";
import { DataSource } from "../../FES/scripts/Utilities/DataSource";
import { CultureInfo } from "../../FES/Business/Cultures";

let i = 0;
/**
    * It is adapter of enums for ignoring differences betwoon server data and structure in script
    */
let MenuAdapter: (data: any) => Array<Nav.IMenuData> = (data: any) => {
    let result: Array<any> = [];//id 本应使用d.IdPrivilege;
    (data as Array<any>).forEach(d => {
        let obj: Nav.IMenuData = {};
        if (d.menus) obj.children = MenuAdapter(d.menus);
        obj.id = (++i).toString();//d.IdPrivilege;
        obj.title = d.menuname;
        obj.url = d.url;
        result.push(obj);
    })
    return result;
}

export let InitializeUserInfo = (mainPage: Nav.MainPage) => {
    //TODO　异步
    let name: string = "";
    Post({ url: "/Home/GerUserInfo", async: false, onSuccess: d => name = d });
    let result: { name: string, dataSource: Array<Nav.IMenuData & { click?: ({ sender: MenuItem }) => void }> } = {
        name: name, dataSource: [
            { title: CultureInfo.TranslateText("Exit"), click: () => location.assign("/Home/Logout"),id:(++i).toString() },
            { title: CultureInfo.TranslateText("PwdMod"), click: () =>ModifyPassword() },
            { title: CultureInfo.TranslateText("Console"), url: "/SM/Darggable"  ,id:(++i).toString()},
            { title: "AssetDetail_DEMO", url: "/Archives/AssetDetials" ,id:(++i).toString()},
        ]
    };
    mainPage.InitUserInfo(result);
}
InitializeUserInfo(new Nav.MainPage(document.getElementById("mp"), {
    data: new DataSource({
        Read: (p) => Post({
            url: "/Home/GerArchMenus_new", onSuccess: d =>
                p.Success(MenuAdapter(d))
        })
    })
}));