var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../Utilities/DataSource"], function (require, exports, DataSource_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SELECTED = "selected";
    var USERINFOWIDTH = 180;
    var MOREWIDTH = 95;
    var Layout = (function () {
        function Layout(element) {
            this.element = element;
            this.layoutDivs = [];
            this.initLayout();
        }
        Layout.prototype.initLayout = function () { };
        Layout.prototype.layoutInster = function (index, div, autoHeight) {
            if (autoHeight === void 0) { autoHeight = false; }
            var e;
            if (!(div instanceof HTMLDivElement)) {
                e = document.createElement("div");
                e.id = div.id;
                if (div.attribute)
                    for (var n in div.attribute) {
                        if (div.attribute.hasOwnProperty(n))
                            e.setAttribute(n, div.attribute[n]);
                    }
                if (div.css) {
                    for (var n in div.css) {
                        e.style[n] = div.css[n];
                    }
                }
                if (div.classes)
                    div.classes.forEach(function (cl) { return e.classList.add(cl); });
            }
            e["layoutAutoHeight"] = autoHeight;
            this.element.insertBefore(e, this.element.children[index]);
            this.layoutDivs.push(e);
            this.layoutSetHeight();
            return e;
        };
        Layout.prototype.layoutAppend = function (div, autoHeight) {
            if (autoHeight === void 0) { autoHeight = false; }
            return this.layoutInster(this.element.children.length, div, autoHeight);
        };
        Layout.prototype.layoutSetHeight = function () {
            var h = 0, d = this.layoutDivs.filter(function (ld) { if (!ld["layoutAutoHeight"]) {
                h += ld.offsetHeight;
            }
            else
                return true; })[0];
            if (d)
                d.style.height = "calc(100% - " + h + "px)";
        };
        return Layout;
    }());
    exports.Layout = Layout;
    var MenuItem = (function () {
        function MenuItem(dataItem, selected, width) {
            this.dataItem = dataItem;
            this.selected = selected;
            this.width = width;
            this.children = [];
            this.deep = 1;
            var that = this;
            if (that.dataItem.children) {
                that.dataItem.children.forEach(function (i) {
                    that.add(i);
                });
            }
        }
        MenuItem.prototype.add = function (dataItem) {
            var a = new MenuItem(dataItem, this.selected);
            a.deep = this.deep + 1;
            a.parent = this;
            this.children.push(a);
        };
        MenuItem.prototype.remove = function () {
            this.children.forEach(function (i) { return i.remove(); });
            delete this.parent;
            if (this.element)
                this.element.parentElement.removeChild(this.element);
        };
        MenuItem.prototype.build = function () {
            if (!this.element) {
                this.element = document.createElement("div");
                this.element.classList.add("v_menuItem");
                this.element.classList.add("v_menuItem_" + this.deep);
                var span = document.createElement("span");
                span.innerText = this.dataItem.title;
                this.element.appendChild(span);
                if (this.width)
                    this.element.style.width = this.width + "px";
                this.selectEvent();
            }
            return this.element;
        };
        MenuItem.prototype.selectEvent = function () {
            var that = this;
            switch (that.deep) {
                case 1:
                    that.element.onmouseover = function () { return that.selected({ sender: that }); };
                    break;
                case 2:
                    that.element.addEventListener("click", function (e) { return that.selected({ sender: that }); });
                    // that.element.onclick = () => that.selected({ sender: that })
                    break;
            }
        };
        MenuItem.prototype.processByDeep = function (fn, deep) {
            if (this.deep === deep)
                fn({ sender: this });
            else
                this.children.forEach(function (i) { return i.processByDeep(fn, deep); }); // i.element.classList.remove(SELECTED)
        };
        return MenuItem;
    }());
    var DDLMenuItem = (function (_super) {
        __extends(DDLMenuItem, _super);
        function DDLMenuItem() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.deep = 0;
            return _this;
        }
        DDLMenuItem.prototype.build = function () {
            var that = this;
            if (!that.wrapper) {
                that.wrapper = document.createElement("div");
                that.wrapper.classList.add("v_menuDLL_container");
                that.wrapper.appendChild(_super.prototype.build.call(this));
                that.wrapper.appendChild(that.popup = document.createElement("div"));
                var pointer = document.createElement("span");
                pointer.classList.add("v_menuDll_pointer");
                that.element.appendChild(pointer);
                that.popup.classList.add("v_menuDLL_popup");
            }
            while (that.popup.lastChild)
                that.popup.removeChild(that.popup.lastChild);
            if (that.children)
                that.children.forEach(function (item) { return that.popup.appendChild(item.build()); });
            return that.wrapper;
        };
        DDLMenuItem.prototype.FindAncestor = function (el, cls) {
            while ((el = el.parentElement) && !el.classList.contains(cls))
                ;
            return el;
        };
        DDLMenuItem.prototype.selectEvent = function () {
            var _this = this;
            var that = this;
            that.wrapper.onclick = function (e) {
                var ele = e.target;
                if (_this.FindAncestor(ele, "v_menuDLL_popup"))
                    return;
                e.stopPropagation();
                that.open();
            };
        };
        DDLMenuItem.prototype.open = function () {
            var items = document.querySelectorAll(".v_menuDLL_popup.activity");
            for (var i = 0; i < items.length; i++) {
                var e = items[i];
                e.classList.remove("activity");
            }
            this.popup.style.width = this.wrapper.offsetWidth + "px";
            this.popup.classList.add("activity");
        };
        DDLMenuItem.prototype.close = function () {
            if (this.popup)
                this.popup.classList.remove("activity");
        };
        DDLMenuItem.prototype.remove = function () {
            _super.prototype.remove.call(this);
            if (this.wrapper)
                this.wrapper.parentElement.removeChild(this.wrapper);
        };
        return DDLMenuItem;
    }(MenuItem));
    var Menu = (function () {
        function Menu(element, options) {
            this.element = element;
            this.options = options;
            var that = this, op = that.options;
            that.dataSource = (op.dataSource instanceof Array) ? new DataSource_1.DataSource({ Data: options.dataSource }) : options.dataSource;
            that.dataSource.Success = function (e) { return that.build(); };
            that.dataSource.Read();
            //document.body["onresize"] = () => that.build();
            document.addEventListener("click", function (e) {
                if (that.suprMore)
                    that.suprMore.close();
                if (that.secMore)
                    that.secMore.close();
                if (that.userInfo)
                    that.userInfo.close();
            });
        }
        Menu.prototype.build = function () {
            var that = this, options = that.options;
            if (!that.menuItems)
                that.menuItems = that.dataSource.Data().map(function (d) { return new MenuItem(d, function (e) { return that.selectedMothed(e); }); });
            if (!that.menuElement) {
                that.element.appendChild(that.menuElement = document.createElement("div"));
                that.menuElement.classList.add("v_menu_menu");
                that.menuElement.style.width = "calc( 100% - " + (USERINFOWIDTH + 2) + "px)";
            }
            if (!that.userInfo)
                that.initUserInfo(options.userInfo, false);
            that.decorate(that.menuElement, that.menuItems, that.suprMore = new DDLMenuItem({ title: "MORE" }, undefined)); //需要缩小宽度
            if (that.userInfo)
                that.element.appendChild(that.userInfo.build());
            if (!that.winResizeEvent)
                window.addEventListener("resize", that.winResizeEvent = that.decorate.bind(that, that.menuElement, that.menuItems, that.suprMore));
            return this.element;
        };
        Menu.prototype.initUserInfo = function (userInfo, reDecorateMenu) {
            if (reDecorateMenu === void 0) { reDecorateMenu = true; }
            if (!userInfo)
                return;
            var that = this;
            if (that.userInfo)
                that.userInfo.remove();
            that.userInfo = new DDLMenuItem({ title: userInfo.name }, undefined, USERINFOWIDTH);
            that.userInfo.children = userInfo.dataSource.map(function (d) { var s = new MenuItem(d, d.click || (function (e) { return that.selectedMothed(e); })); s.deep = 2; return s; });
            if (reDecorateMenu && that.menuElement)
                that.decorate(that.menuElement, that.menuItems, that.suprMore = new DDLMenuItem({ title: "MORE" }, undefined)); //需要缩小宽度
        };
        Menu.prototype.selectedMothed = function (e) {
            var that = this, sender = e.sender;
            if (!sender.element.classList.contains(SELECTED)) {
                // if (sender.parent)
                //     sender.parent.children.forEach(i => i.element.classList.remove(SELECTED));
                // else
                that.menuItems.forEach(function (i) { return i.processByDeep(function (e) { if (e.sender.element)
                    e.sender.element.classList.remove(SELECTED); }, sender.deep); });
                sender.element.classList.add(SELECTED);
            }
            switch (sender.deep) {
                case 1:
                    that.showSecItems(e);
                    break;
                case 2:
                    that.leafClick(e);
                    break;
            }
        };
        Menu.prototype.leafClick = function (e) {
            if (this.click)
                this.click(e);
            this.userInfo.close();
        };
        Menu.prototype.showSecItems = function (e) {
            var that = this, options = that.options;
            that.decorate(options.secContainer, e.sender.children, that.secMore = new DDLMenuItem({ title: "MORE" }, undefined));
        };
        Menu.prototype.decorate = function (element, items, more) {
            var exceeding = false, width = 0, max = element.clientWidth - MOREWIDTH, i, item;
            while (element.lastChild)
                element.removeChild(element.lastChild);
            for (i = 0; item = items[i]; i++) {
                element.appendChild(item.build());
                width += item.element.offsetWidth;
                if (width > max) {
                    exceeding = true;
                    break;
                }
            }
            if (exceeding) {
                more.children = items.slice(i);
                element.appendChild(more.build());
            }
        };
        Menu.prototype.Destroy = function () {
            var that = this;
            if (that.winResizeEvent)
                window.removeEventListener("resize", that.winResizeEvent);
            if (that.dataSource)
                delete that.dataSource;
            if (that.menuItems) {
                that.menuItems.forEach(function (mItem) { return mItem.remove(); });
                delete that.menuItems;
            }
            if (that.menuElement)
                that.menuElement.parentElement.removeChild(that.menuElement);
            if (that.suprMore)
                that.suprMore.remove();
            if (that.secMore)
                that.secMore.remove();
            if (that.userInfo)
                that.userInfo.remove();
        };
        return Menu;
    }());
    var TabPageItem = (function () {
        function TabPageItem(title, url, id, iframeContainer) {
            this.title = title;
            this.url = url;
            this.id = id;
            this.iframeContainer = iframeContainer;
        }
        TabPageItem.prototype.build = function () {
            var that = this;
            if (!that.tabElement) {
                var spen = document.createElement("span");
                spen.textContent = that.title;
                that.tabElement = document.createElement("div");
                that.tabElement.classList.add("v_tabPage_Tab");
                that.tabElement.appendChild(spen);
                spen = document.createElement("span");
                spen.classList.add("v_tabPage_Tab_rm");
                // spen.textContent = "X";
                spen.onclick = function (e) { e.stopPropagation(); that.distory(); };
                that.tabElement.appendChild(spen);
                that.tabElement.onclick = function (e) { that._click(e); };
            }
            if (!that.iframe) {
                that.iframe = document.createElement("iframe");
                that.iframe.classList.add("v_tabPage_Iframe");
                that.iframe.id = that.id;
                that.iframe.src = that.url;
            }
            return that.tabElement;
        };
        TabPageItem.prototype._click = function (e) {
            var that = this, iframs = that.iframeContainer.getElementsByTagName("iframe"), included = false;
            for (var i = 0; i < iframs.length; i++) {
                var iframe = iframs[i];
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
        };
        TabPageItem.prototype.click = function () {
            this._click();
        };
        TabPageItem.prototype.distory = function () {
            if (this.iframe) {
                this.iframe.parentElement.removeChild(this.iframe);
                delete this.iframe;
            }
            if (this.tabElement) {
                if (this.tabElement.classList.contains("selected") && this.tabElement.previousSibling) {
                    this.tabElement.previousElementSibling.click();
                }
                this.tabElement.parentElement.removeChild(this.tabElement);
                delete this.tabElement;
            }
            if (this.tabPage) {
                var t = this.tabPage;
                delete this.tabPage;
                t.remove(this.id);
            }
        };
        return TabPageItem;
    }());
    var TabPage = (function () {
        function TabPage(element) {
            this.element = element;
            this.tpItems = [];
            this.element.classList.add("v_tabPage");
            this.build();
        }
        TabPage.prototype.build = function () {
            var that = this;
            if (!that.tabsDiv) {
                that.tabsDiv = document.createElement("div");
                that.tabsDiv.classList.add("v_tabPage_TabContainer");
                that.element.appendChild(that.tabsDiv);
            }
            if (!that.tcLBtn) {
                that.tcLBtn = document.createElement("div");
                that.tcLBtn.classList.add("v_tabPage_tcLBtn");
                that.element.appendChild(that.tcLBtn);
                that.tabsDiv.onclick = function () { return that.tcLBtn_clik(); };
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
            that.decorate();
        };
        /**
         * 主要实现leftMove rightMove
         */
        TabPage.prototype.decorate = function () {
        };
        TabPage.prototype.add = function (item) {
            var i;
            if (!(i = this.tpItems.filter(function (i) { return i.id === item.id; })[0])) {
                i = new TabPageItem(item.title, item.url, item.id, this.iframeContainer);
                i.tabPage = this;
                this.tpItems.push(i);
                this.tabsDiv.appendChild(i.build());
            }
            else {
                i.click();
            }
            return i;
        };
        TabPage.prototype.selectedMothed = function (e) {
            var that = this, tpItems = that.tpItems, sender = e.sender;
            if (!sender.tabElement.classList.contains(SELECTED)) {
                tpItems.forEach(function (i) { return i.tabElement.classList.remove(SELECTED); });
                sender.tabElement.classList.add(SELECTED);
            }
        };
        TabPage.prototype.remove = function (id) {
            var i = this.tpItems.indexOf(this.tpItems.filter(function (item) { return item.id === id; })[0]);
            if (i !== -1)
                this.tpItems.splice(i, 1)[0].distory();
        };
        TabPage.prototype.tcLBtn_clik = function () {
        };
        TabPage.prototype.tcrBtn_clik = function () {
        };
        TabPage.prototype.TabCount = function () {
            return this.tpItems.length;
        };
        return TabPage;
    }());
    var MainPageLayout = (function (_super) {
        __extends(MainPageLayout, _super);
        function MainPageLayout(element) {
            return _super.call(this, element) || this;
        }
        MainPageLayout.prototype.initLayout = function () {
            this.superMenu = this.layoutAppend({ id: "superMenu", classes: ["v_menu"] }); // css: { height: "36px" } 
            this.secondMenu = this.layoutAppend({ id: "secondMenu", classes: ["v_menu_2"] }); // css: { height: "26px" } 
            this.content = this.layoutAppend({ id: "content" }, true);
        };
        return MainPageLayout;
    }(Layout));
    var MainPage = (function (_super) {
        __extends(MainPage, _super);
        function MainPage(element, options) {
            var _this = _super.call(this, element) || this;
            _this.options = options;
            _this.TabCount = 8;
            _this.element.classList.add("mainpage");
            _this.initMenu();
            _this.initPages();
            return _this;
        }
        MainPage.prototype.initMenu = function () {
            this.menu = new Menu(this.superMenu, { dataSource: this.options.data, secContainer: this.secondMenu });
        };
        MainPage.prototype.initPages = function () {
            var that = this;
            that.page = new TabPage(that.content);
            that.menu.click = function (e) {
                if (that.page.TabCount() >= that.TabCount) {
                    alert("At most remaining " + that.TabCount + " tabs.");
                    return;
                }
                var sender = e.sender, dataItem = e.sender.dataItem;
                if (sender.parent instanceof DDLMenuItem) {
                    that.UserInfoOperate(sender);
                } //User Information click event is different from other level 2 buttons.
                that.page.add({ title: dataItem.title, url: dataItem.url, id: dataItem.id }).click();
            };
        };
        MainPage.prototype.UserInfoOperate = function (sender) {
            var dataItem = sender.dataItem;
            if (dataItem.click)
                dataItem.click({ sender: sender });
        };
        MainPage.prototype.InitUserInfo = function (info) {
            this.menu.initUserInfo(info);
        };
        return MainPage;
    }(MainPageLayout));
    exports.MainPage = MainPage;
});
