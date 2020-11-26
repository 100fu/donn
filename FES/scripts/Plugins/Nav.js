define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 最多两级菜单
     */
    var Nav = (function () {
        /**
         *
         * @param Element body is proposed
         * @param options
         */
        function Nav(Element, options) {
            this.Element = Element;
            this.options = options;
            options.dataSource.Success = this.GenerateNav.bind(this, options.brand);
            if (options.target && !options.target.name)
                options.target.name = new Date().getTime().toString();
            options.dataSource.Read();
        }
        Nav.prototype.GenerateNav = function (brand, data) {
            if (this.NavElement)
                this.Element.removeChild(this.NavElement);
            var nav = this.NavElement = document.createElement("nav");
            nav.classList.add("navbar", "navbar-expand-lg", "navbar-light", "bg-light");
            this.Element.appendChild(nav);
            nav.innerHTML = '<a class="navbar-brand" href="' + (this.options.brandUrl || "javescript:void(0);") + '" target="' + (this.options.target ? this.options.target.name : "") + '">' + brand + '</a>';
            var btn = document.createElement("button");
            btn.classList.add("navbar-toggler");
            btn.type = "button";
            btn.innerHTML = '<span class="navbar-toggler-icon"></span>';
            btn.onclick = function () {
                if (div.classList.contains("show"))
                    div.classList.remove("show");
                else
                    div.classList.add("show");
            };
            nav.appendChild(btn);
            var div = document.createElement("div");
            nav.appendChild(div);
            div.classList.add("collapse", "navbar-collapse");
            div.appendChild(this.GenerateUL(data.Data));
            return nav;
        };
        Nav.prototype.GenerateUL = function (data) {
            var _this = this;
            var ul = document.createElement("ul"), target = this.options.target ? this.options.target.name : '';
            ul.classList.add("navbar-nav", "mr-auto");
            data.forEach(function (d) {
                if (d.children)
                    ul.appendChild(_this.GenerateSubDDL(d));
                else {
                    var li = document.createElement("li");
                    li.classList.add("nav-item");
                    var a = document.createElement("a");
                    a.classList.add("nav-link");
                    a.innerText = d.title;
                    a.target = target;
                    a.href = d.url;
                    li.appendChild(a);
                    ul.appendChild(li);
                }
            });
            return ul;
        };
        Nav.prototype.GenerateSubDDL = function (data) {
            var li = document.createElement("li"), target = this.options.target ? this.options.target.name : '';
            li.classList.add("nav-item", "dropdown");
            var a = document.createElement("a");
            a.classList.add("nav-link", "dropdown-toggle");
            a.innerText = data.title;
            a.href = "javascript:void(0);";
            a.target = target;
            li.appendChild(a);
            li.onclick = function () {
                if (div.classList.contains("show"))
                    div.classList.remove("show");
                else
                    div.classList.add("show");
            };
            var div = document.createElement("div");
            div.classList.add("dropdown-menu");
            li.appendChild(div);
            if (data.children)
                data.children.forEach(function (c) {
                    var sa = document.createElement("a");
                    sa.classList.add("dropdown-item");
                    sa.href = c.url || "javascript:void(0);";
                    sa.target = target;
                    sa.innerText = c.title;
                    div.appendChild(sa);
                });
            return li;
        };
        Nav.prototype.SetCurrentUser = function (options, onclick) {
            var ul = this.GenerateUL([options]);
            //ul.classList.add("justify-content-end")
            if (onclick) {
                var lias = ul.querySelectorAll("li a"), l = lias.length;
                for (var i = 0; i < l; i++) {
                    var ele = lias[i];
                    ele.onclick = onclick;
                }
            }
            //this.NavElement.appendChild(ul);
            this.NavElement.getElementsByTagName("ul")[0].appendChild(ul.children[0]);
        };
        return Nav;
    }());
    exports.Nav = Nav;
});
