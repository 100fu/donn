import { DataSource } from './../Utilities/DataSource';
export interface IMenuData {
    title?: string
    url?: string
    id?: string
    children?: Array<IMenuData>
}
/**
 * 最多两级菜单
 */
export class Nav {
    private NavElement: HTMLElement
    /**
     * 
     * @param Element body is proposed
     * @param options 
     */
    constructor(public Element: HTMLElement, public options: { dataSource: DataSource, brand: string, brandUrl?: string, target?: HTMLIFrameElement }) {
        options.dataSource.Success = this.GenerateNav.bind(this, options.brand);
        if (options.target && !options.target.name)
            options.target.name = new Date().getTime().toString();
        options.dataSource.Read();
    }
    private GenerateNav(brand: string, data: { Sender: DataSource, Data: Array<IMenuData> }): HTMLElement {
        if (this.NavElement) this.Element.removeChild(this.NavElement);
        let nav = this.NavElement = document.createElement("nav");
        nav.classList.add("navbar", "navbar-expand-lg", "navbar-light", "bg-light")
        this.Element.appendChild(nav)
        nav.innerHTML = '<a class="navbar-brand" href="' + (this.options.brandUrl || "javescript:void(0);") + '" target="' + (this.options.target ? this.options.target.name : "") + '">' + brand + '</a>';
        let btn = document.createElement("button");
        btn.classList.add("navbar-toggler");
        btn.type = "button";
        btn.innerHTML = '<span class="navbar-toggler-icon"></span>';
        btn.onclick = () => {
            if (div.classList.contains("show"))
                div.classList.remove("show");
            else div.classList.add("show");
        }
        nav.appendChild(btn);
        let div = document.createElement("div");
        nav.appendChild(div);
        div.classList.add("collapse", "navbar-collapse");
        div.appendChild(this.GenerateUL(data.Data));
        return nav;
    }
    private GenerateUL(data: Array<IMenuData>): HTMLUListElement {
        let ul = document.createElement("ul"), target = this.options.target ? this.options.target.name : '';
        ul.classList.add("navbar-nav", "mr-auto");
        data.forEach(d => {
            if (d.children) ul.appendChild(this.GenerateSubDDL(d));
            else {
                let li = document.createElement("li");
                li.classList.add("nav-item");
                let a = document.createElement("a");
                a.classList.add("nav-link");
                a.innerText = d.title;
                a.target = target;
                a.href = d.url;
                li.appendChild(a);
                ul.appendChild(li);
            }
        })
        return ul;
    }
    private GenerateSubDDL(data: IMenuData): HTMLLIElement {
        let li = document.createElement("li"), target = this.options.target ? this.options.target.name : '';
        li.classList.add("nav-item", "dropdown");
        let a = document.createElement("a");
        a.classList.add("nav-link", "dropdown-toggle");
        a.innerText = data.title;
        a.href = "javascript:void(0);"
        a.target = target;
        li.appendChild(a);
        li.onclick = () => {
            if (div.classList.contains("show"))
                div.classList.remove("show");
            else div.classList.add("show");
        };
        let div = document.createElement("div");
        div.classList.add("dropdown-menu");
        li.appendChild(div);
        if (data.children)
            data.children.forEach(c => {
                let sa = document.createElement("a");
                sa.classList.add("dropdown-item");
                sa.href = c.url||"javascript:void(0);";
                sa.target = target;
                sa.innerText = c.title;
                div.appendChild(sa);
            })
        return li;
    }
    public SetCurrentUser(options: IMenuData, onclick?: (e: MouseEvent) => void): void {

        let ul = this.GenerateUL([options])
        //ul.classList.add("justify-content-end")
        if(onclick){
           let lias= ul.querySelectorAll("li a"),l=lias.length;
            for (let i = 0; i < l; i++) {
                let ele = lias[i] as HTMLAnchorElement;
                ele.onclick=onclick;
            }
        }
        //this.NavElement.appendChild(ul);
        this.NavElement.getElementsByTagName("ul")[0].appendChild(ul.children[0])
    }
}