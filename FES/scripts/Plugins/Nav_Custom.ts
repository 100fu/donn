import { DataSource } from "../Utilities/DataSource";

const SELECTED = "selected"
const USERINFOWIDTH = 180
const MOREWIDTH = 95
export abstract class Layout {
    private layoutDivs: Array<HTMLDivElement> = []
    constructor(public element: HTMLElement) {
        this.initLayout();
    }
    protected initLayout() { }
    protected layoutInster(index: number, div: { id: string, attribute?: Object, css?: Object, "classes"?: string[] } | HTMLDivElement, autoHeight: boolean = false): HTMLDivElement {
        let e: HTMLDivElement
        if (!(div instanceof HTMLDivElement)) {
            e = document.createElement("div")
            e.id = div.id;
            if (div.attribute) for (let n in div.attribute) { if (div.attribute.hasOwnProperty(n)) e.setAttribute(n, div.attribute[n]) }
            if (div.css) {
                for (let n in div.css) {
                    e.style[n] = div.css[n];
                }
            }
            if (div.classes) div.classes.forEach(cl => e.classList.add(cl));
        }
        e["layoutAutoHeight"] = autoHeight
        this.element.insertBefore(e, this.element.children[index])
        this.layoutDivs.push(e);
        this.layoutSetHeight();
        return e
    }
    protected layoutAppend(div: { id: string, attribute?: Object, css?: Object, "classes"?: string[] } | HTMLDivElement, autoHeight: boolean = false): HTMLDivElement {
        return this.layoutInster(this.element.children.length, div, autoHeight);
    }
    protected layoutSetHeight() {
        let h: number = 0, d: HTMLDivElement = this.layoutDivs.filter((ld: HTMLDivElement) => { if (!ld["layoutAutoHeight"]) { h += ld.offsetHeight } else return true; })[0];
        if (d) d.style.height = "calc(100% - " + h + "px)";
    }
}
class MenuItem {
    public element: HTMLDivElement
    public children: Array<MenuItem> = []
    public parent: MenuItem
    public deep: number = 1
    constructor(public dataItem: IMenuData, private selected: ({ sender: MenuItem }) => void, public width?: number) {
        let that = this
        if (that.dataItem.children) {
            that.dataItem.children.forEach(i => {
                that.add(i)
            })
        }
    }
    public add(dataItem: IMenuData) {
        let a = new MenuItem(dataItem, this.selected); a.deep = this.deep + 1; a.parent = this;
        this.children.push(a)
    }
    public remove() {
        this.children.forEach(i => i.remove());
        delete this.parent;
        if (this.element) this.element.parentElement.removeChild(this.element);
    }
    public build(): HTMLDivElement {
        if (!this.element) {
            this.element = document.createElement("div");
            this.element.classList.add("v_menuItem")
            this.element.classList.add("v_menuItem_" + this.deep)
            let span = document.createElement("span"); span.innerText = this.dataItem.title;
            this.element.appendChild(span)
            if (this.width) this.element.style.width = this.width + "px";
            this.selectEvent();
        }
        return this.element;
    }
    protected selectEvent() {
        let that = this
        switch (that.deep) {
            case 1:
                that.element.onmouseover = () => that.selected({ sender: that })
                break;
            case 2:
                that.element.addEventListener("click",e =>that.selected({ sender: that }))
                // that.element.onclick = () => that.selected({ sender: that })
                break;
        }
    }
    public processByDeep(fn: (e: { sender: MenuItem }) => void, deep: number) {
        if (this.deep === deep)
            fn({ sender: this })
        else
            this.children.forEach(i => i.processByDeep(fn, deep));// i.element.classList.remove(SELECTED)
    }
}

class DDLMenuItem extends MenuItem {
    public deep: number = 0
    public wrapper: HTMLDivElement
    private popup: HTMLDivElement
    public build(): HTMLDivElement {
        let that = this;
        if (!that.wrapper) {
            that.wrapper = document.createElement("div");
            that.wrapper.classList.add("v_menuDLL_container");
            that.wrapper.appendChild(super.build()); that.wrapper.appendChild(that.popup = document.createElement("div"));
            let pointer = document.createElement("span"); pointer.classList.add("v_menuDll_pointer");
            that.element.appendChild(pointer);
            that.popup.classList.add("v_menuDLL_popup");
        }
        while (that.popup.lastChild) that.popup.removeChild(that.popup.lastChild)
        if (that.children) that.children.forEach(item => that.popup.appendChild(item.build()))
        return that.wrapper;
    }
    private FindAncestor(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}
    protected selectEvent() {
        let that = this;
        that.wrapper.onclick = (e) => {
            let ele = e.target as HTMLElement;
            if (this.FindAncestor(ele,"v_menuDLL_popup")) return;
            e.stopPropagation();
            that.open();
        }
    }
    public open() {
        let items = document.querySelectorAll(".v_menuDLL_popup.activity")
        for (let i = 0; i < items.length; i++) {
            let e = items[i];
            e.classList.remove("activity")
        }
        this.popup.style.width = this.wrapper.offsetWidth + "px";
        this.popup.classList.add("activity");
    }
    public close() {
        if (this.popup)
        this.popup.classList.remove("activity");
    }
    public remove() {
        super.remove();
        if (this.wrapper) this.wrapper.parentElement.removeChild(this.wrapper);
    }
}
export interface IMenuData {
    title?: string
    url?: string
    id?: string
    children?: Array<IMenuData>
}
class Menu {
    public dataSource: DataSource
    private menuItems: Array<MenuItem>
    private menuElement: HTMLDivElement
    private suprMore: DDLMenuItem
    private secMore: DDLMenuItem
    private userInfo: DDLMenuItem
    private winResizeEvent
    public click: (e: { sender: MenuItem }) => void //当前没有必要使用bind
    constructor(public element: HTMLDivElement, public options: { dataSource: DataSource | Array<any>, secContainer: HTMLDivElement, vertical?: boolean, userInfo?: { name: string, dataSource: Array<IMenuData> } }) {
        let that = this, op = that.options;
        that.dataSource = (op.dataSource instanceof Array) ? new DataSource({Data: options.dataSource as Array<any> }) : <DataSource>options.dataSource
        that.dataSource.Success = (e) => that.build();
        that.dataSource.Read();
        //document.body["onresize"] = () => that.build();
        document.addEventListener("click", (e) => {
            if (that.suprMore) that.suprMore.close();
            if (that.secMore) that.secMore.close();
            if (that.userInfo) that.userInfo.close();
        })
    }
    private build(): HTMLDivElement {
        let that = this, options = that.options
        if (!that.menuItems) that.menuItems = that.dataSource.Data().map(d => new MenuItem(d, (e) => that.selectedMothed(e)));
        if (!that.menuElement) {
            that.element.appendChild(that.menuElement = document.createElement("div"));
            that.menuElement.classList.add("v_menu_menu");
            that.menuElement.style.width = "calc( 100% - " + (USERINFOWIDTH+2) + "px)";
        }
        if (!that.userInfo) that.initUserInfo(options.userInfo, false)
        that.decorate(that.menuElement, that.menuItems, that.suprMore = new DDLMenuItem({ title: "MORE" }, undefined))  //需要缩小宽度
        if (that.userInfo) that.element.appendChild(that.userInfo.build());
       
        if (!that.winResizeEvent) window.addEventListener("resize", that.winResizeEvent = that.decorate.bind(that, that.menuElement, that.menuItems, that.suprMore))
        return this.element;
    }
    public initUserInfo(userInfo: { name: string, dataSource: Array<IMenuData&{click?:({ sender: MenuItem }) => void}> }, reDecorateMenu = true) {
        if (!userInfo) return;
        let that = this;
        if (that.userInfo) that.userInfo.remove();
        that.userInfo = new DDLMenuItem({ title: userInfo.name }, undefined, USERINFOWIDTH);
        that.userInfo.children = userInfo.dataSource.map(d => { let s = new MenuItem(d, d.click||((e) => that.selectedMothed(e))); s.deep = 2; return s; });
        if (reDecorateMenu && that.menuElement)
            that.decorate(that.menuElement, that.menuItems, that.suprMore = new DDLMenuItem({ title: "MORE" }, undefined))  //需要缩小宽度
    }
    private selectedMothed(e: { sender: MenuItem }) {
        let that = this, sender = e.sender;
        if (!sender.element.classList.contains(SELECTED)) {
            // if (sender.parent)
            //     sender.parent.children.forEach(i => i.element.classList.remove(SELECTED));
            // else
            that.menuItems.forEach(i => i.processByDeep((e) => { if (e.sender.element) e.sender.element.classList.remove(SELECTED) }, sender.deep));
            sender.element.classList.add(SELECTED);
        }
        switch (sender.deep) {
            case 1:
                that.showSecItems(e)
                break;
            case 2:
                that.leafClick(e)
                break;
        }
    }
    private leafClick(e: { sender: MenuItem }) {
        if (this.click) this.click(e)
        this.userInfo.close()
    }
    private showSecItems(e: { sender: MenuItem }) {
        let that = this, options = that.options
        that.decorate(options.secContainer, e.sender.children, that.secMore = new DDLMenuItem({ title: "MORE" }, undefined))
    }
    private decorate(element: HTMLDivElement, items: Array<MenuItem>, more: DDLMenuItem) {
        let exceeding = false, width: number = 0, max = element.clientWidth - MOREWIDTH, i, item: MenuItem;
        while (element.lastChild) element.removeChild(element.lastChild)
        for (i = 0; item = items[i]; i++) {
            element.appendChild(item.build()); width += item.element.offsetWidth
            if (width > max) { exceeding = true; break; }
        }
        if (exceeding) {
            more.children = items.slice(i);
            element.appendChild(more.build());
        }
    }
    public Destroy() {
        let that = this;
        if (that.winResizeEvent) window.removeEventListener("resize", that.winResizeEvent);
        if (that.dataSource) delete that.dataSource;
        if (that.menuItems) { that.menuItems.forEach(mItem => mItem.remove()); delete that.menuItems; }
        if (that.menuElement) that.menuElement.parentElement.removeChild(that.menuElement);
        if (that.suprMore) that.suprMore.remove();
        if (that.secMore) that.secMore.remove();
        if (that.userInfo) that.userInfo.remove();
    }
}

class TabPageItem {
    public tabElement: HTMLDivElement
    public iframe: HTMLIFrameElement
    public tabPage: TabPage
    constructor(private title: string, private url: string, public id: string, private iframeContainer: HTMLDivElement) {
    }
    build(): HTMLDivElement {
        let that = this;
        if (!that.tabElement) {
            let spen = document.createElement("span");
            spen.textContent = that.title;
            that.tabElement = document.createElement("div");
            that.tabElement.classList.add("v_tabPage_Tab");
            that.tabElement.appendChild(spen);
            spen = document.createElement("span");
            spen.classList.add("v_tabPage_Tab_rm");
            // spen.textContent = "X";
            spen.onclick = (e) => { e.stopPropagation(); that.distory(); };
            that.tabElement.appendChild(spen);
            that.tabElement.onclick = (e) => { that._click(e) }
        }
        if (!that.iframe) {
            that.iframe = document.createElement("iframe");
            that.iframe.classList.add("v_tabPage_Iframe");
            that.iframe.id = that.id;
            that.iframe.src = that.url;
        }
        return that.tabElement;
    }
    private _click(e?: MouseEvent) {
        let that = this, iframs = that.iframeContainer.getElementsByTagName("iframe"), included = false;
        for (let i = 0; i < iframs.length; i++) {
            let iframe = iframs[i];
            if (iframe.id !== that.id)
                iframe.classList.remove(SELECTED);
            else {
                included = true;
                iframe.classList.add(SELECTED);
            }
        }
        if (!included) {
            that.iframeContainer.appendChild(that.iframe);
            that.iframe.classList.add(SELECTED);
        }
        this.tabPage.selectedMothed({ sender: that });
    }
    public click() {
        this._click()
    }
    distory() {
        if (this.iframe) {
           
            this.iframe.parentElement.removeChild(this.iframe)

            delete this.iframe;
        }
        if (this.tabElement) {
            if (this.tabElement.classList.contains("selected") && this.tabElement.previousSibling) {
                (this.tabElement.previousElementSibling as HTMLDivElement).click()
            }
            this.tabElement.parentElement.removeChild(this.tabElement);
            delete this.tabElement;
        }
        if (this.tabPage) {
            let t = this.tabPage;
            delete this.tabPage;
            t.remove(this.id);
        }
    }
}
class TabPage {
    private tpItems: Array<TabPageItem> = []
    private tabsDiv: HTMLDivElement
    private iframeContainer: HTMLDivElement
    private tcLBtn: HTMLDivElement
    private tcrBtn: HTMLDivElement
    constructor(private element: HTMLDivElement) {
        this.element.classList.add("v_tabPage");
        this.build()
    }
    private build() {
        let that = this;
        if (!that.tabsDiv) {
            that.tabsDiv = document.createElement("div");
            that.tabsDiv.classList.add("v_tabPage_TabContainer");
            that.element.appendChild(that.tabsDiv);
        }
        if (!that.tcLBtn) {
            that.tcLBtn = document.createElement("div");
            that.tcLBtn.classList.add("v_tabPage_tcLBtn");
            that.element.appendChild(that.tcLBtn);
            that.tabsDiv.onclick = () => that.tcLBtn_clik();
        }
        if (!that.tcrBtn) {
            that.tcrBtn = document.createElement("div");
            that.tcrBtn.classList.add("v_tabPage_tcrBtn");
            that.element.appendChild(that.tcrBtn);
        }
        if (!that.iframeContainer) {
            that.iframeContainer = document.createElement("div");
            that.iframeContainer.classList.add("v_tabPage_IframeContainer");
            that.element.appendChild(that.iframeContainer);
        }

        that.decorate()
    }
    /**
     * 主要实现leftMove rightMove
     */
    private decorate() {

    }
    public add(item: { title: string, url: string, id: string }): TabPageItem {
        let i: TabPageItem;
        if (!(i = this.tpItems.filter(i => i.id === item.id)[0])) {
            i = new TabPageItem(item.title, item.url, item.id, this.iframeContainer);
            i.tabPage = this;
            this.tpItems.push(i)
            this.tabsDiv.appendChild(i.build())
        } else {
            i.click();
        }
        return i;
    }
    public selectedMothed(e: { sender: TabPageItem }) {
        let that = this, tpItems = that.tpItems, sender = e.sender;
        if (!sender.tabElement.classList.contains(SELECTED)) {
            tpItems.forEach(i => i.tabElement.classList.remove(SELECTED));
            sender.tabElement.classList.add(SELECTED);
        }
    }
    public remove(id: string) {
        let i = this.tpItems.indexOf( this.tpItems.filter(item => item.id === id)[0]);
        if (i !== -1)
            this.tpItems.splice(i, 1)[0].distory();
    }
    public tcLBtn_clik() {

    }
    public tcrBtn_clik() {

    }
    public TabCount(): number {
        return this.tpItems.length;
    }
}


class MainPageLayout extends Layout {
    protected superMenu: HTMLDivElement
    protected secondMenu: HTMLDivElement
    protected content: HTMLDivElement
    constructor(element: HTMLElement) {
        super(element);
    }
    protected initLayout() {
        this.superMenu = this.layoutAppend({ id: "superMenu", classes: ["v_menu"] }) // css: { height: "36px" } 
        this.secondMenu = this.layoutAppend({ id: "secondMenu", classes: ["v_menu_2"] })// css: { height: "26px" } 
        this.content = this.layoutAppend({ id: "content" }, true)
    }
}
export class MainPage extends MainPageLayout {
    protected menu: Menu
    protected page: TabPage
    protected superMenu_Menu
    protected TabCount: number = 8
    constructor(element: HTMLElement,public options:{data:DataSource}) {
        super(element);
        this.element.classList.add("mainpage");
        this.initMenu()
        this.initPages();
    }
    private initMenu() {
        this.menu = new Menu(this.superMenu, { dataSource: this.options.data, secContainer: this.secondMenu });
    }
    private initPages() {
        let that = this;
        that.page = new TabPage(that.content);
        that.menu.click = (e) => {
            if (that.page.TabCount() >= that.TabCount) { alert("At most remaining " + that.TabCount + " tabs."); return; }
            let sender = e.sender, dataItem = e.sender.dataItem
            if (sender.parent instanceof DDLMenuItem) { that.UserInfoOperate(sender) } //User Information click event is different from other level 2 buttons.
            that.page.add({ title: dataItem.title, url: dataItem.url, id: dataItem.id }).click()
        }
    }
    private UserInfoOperate(sender: MenuItem) {
        let dataItem = sender.dataItem as IMenuData & { click?: Function }
        if (dataItem.click) dataItem.click({ sender: sender });
    }
    public InitUserInfo(info: { name: string, dataSource: Array<IMenuData> }) {
        this.menu.initUserInfo(info);
    }
}