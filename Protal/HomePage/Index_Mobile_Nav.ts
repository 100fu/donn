import { CultureInfo } from './../../FES/Business/Cultures';
import { Cookie } from './../../FES/scripts/Utilities/DataSet';
import { DataSource } from './../../FES/scripts/Utilities/DataSource';
import { Nav, IMenuData } from './../../FES/scripts/Plugins/Nav';
import { Post } from "../../FES/Business/Request";
let MenuAdapter: (data: any) => Array<IMenuData> = (data: any) => {
    let result: Array<any> = [], id = 0;//id 本应使用d.IdPrivilege;
    (data as Array<any>).forEach(d => {
        let obj: IMenuData = {};
        if (d.menus) obj.children = MenuAdapter(d.menus);
        obj.id = (++id).toString();//d.IdPrivilege;
        obj.title = d.menuname;
        obj.url = d.url;
        result.push(obj);
    })
    return result;
}
let ds = new DataSource({
    Read: p =>
        Post({
            url: "/Home/GerArchMenus_new", onSuccess: d =>{
                p.Success(MenuAdapter(d));
                navControl.SetCurrentUser({
                    title: userName,
                    children: [{ title: CultureInfo.TranslateText("Exit") }]
                }, (e) => {
                    if ((e.target as HTMLAnchorElement).classList.contains("dropdown-item"))
                        location.assign("/Home/Logout");
                })
            }
        })
});
let ifram=document.createElement("iframe");
ifram.style.border="0";
ifram.classList.add("embed-responsive-item")
ifram.style.overflow=""
let nav=document.createElement("div");
document.body.appendChild(nav)
let userName=Cookie.get("EAMUSERNAME")

let navControl=new Nav(nav, { dataSource: ds, brand: "PMDC" ,brandUrl:"/SM/Darggable",target:ifram})
let iframeDiv=document.createElement("div");
iframeDiv.classList.add("embed-responsive","embed-responsive-16by9");
iframeDiv.appendChild(ifram);
document.body.appendChild(iframeDiv)

