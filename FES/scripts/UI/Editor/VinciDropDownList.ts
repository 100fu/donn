import { Type } from './../../Utilities/Type';
import * as Utilities from './../../Utilities/DataSource';
import { VinciEditorBase } from './VinciEditorBase';

export interface IVinciDropDownListOptions {
    ValueField?: string
    TextField?: string
    DataSource?: Utilities.DataSource | any[]
}
export class VinciDropDownList<OptionsT> extends VinciEditorBase<IVinciDropDownListOptions> {
    public DataSource: Utilities.DataSource
    private UlClickEvent
    private WrapperClickEvent
    public get DefaultOptions(): IVinciDropDownListOptions {
        return { ValueField: "value", TextField: "text", DataSource: [] }
    }

    constructor(element: HTMLButtonElement, options?: IVinciDropDownListOptions) {
        super(element, options);
    }
    protected Initialization() {
        if (this.Wrapper == this.Element)
            this.Wrapper = document.createElement("div");
        if (!this.Wrapper.classList.contains("dropdown")) this.Wrapper.classList.add("dropdown");
        if (this.WrapperClickEvent)
        this.Wrapper.removeEventListener(this.WrapperClickEvent);
        this.Wrapper.addEventListener("click", this.WrapperClickEvent || (this.WrapperClickEvent = this.WrapperClick.bind(this)), true);
        (this.Element as HTMLButtonElement).type = "button";
        this.Element.dataset.toggle = "dropdown";
        this.Element.setAttribute("aria-haspopup", "true");
        this.Element.setAttribute("aria-expanded", "false");
        if (!this.Element.querySelector(".caret"))
            this.Element.innerHTML += '<span class="caret"></span>'
        this.Element.parentElement.insertBefore(this.Wrapper, this.Element).appendChild(this.Element);
        let ul = this.Wrapper.querySelector("ul");
        if (!ul) { ul = document.createElement("ul"); this.Wrapper.appendChild(ul) }
        if (!ul.classList.contains("dropdown-menu"))
            ul.classList.add("dropdown-menu");
        if (this.UlClickEvent)
            ul.removeEventListener(this.UlClickEvent);
        ul.addEventListener("click", this.UlClickEvent || (this.UlClickEvent = this.Selected.bind(this)), true)
      
        if (this.Options.DataSource instanceof Utilities.DataSource)
            this.DataSource = this.Options.DataSource as Utilities.DataSource
        else this.DataSource = new Utilities.DataSource({ Data: this.Options.DataSource as any[] })
        this.DataSource.Success = (e) => { this.GenerateUL(ul, e.Data) }
        this.DataSource.Read();
    }
    protected GenerateUL(ul: HTMLUListElement, data: any[]) {
        ul.innerHTML = "";
        (data || []).forEach(d => {
            let li = document.createElement("li");
            li.innerHTML = '<a href="javascript:void(0);">' + d[this.Options.TextField] + '</a>';
            li.dataset.value = d[this.Options.ValueField];
            li.dataset.source = d;
            ul.appendChild(li);
        })
        this.Options.TextField
    }
    private WrapperClick(e:Event) {
        let t=this.Wrapper;
        if(t.classList.contains("open"))
        t.classList.remove("open");
        else t.classList.add("open");
    }
    private Selected(e: Event) {
        if (e.target instanceof HTMLLIElement) {
            let li = e.target as HTMLLIElement;

        }
    }
    public Destroy() {
        if (this.UlClickEvent) {
            this.Wrapper.querySelector("ul").removeEventListener(this.UlClickEvent);
            delete this.UlClickEvent;
        }
        if (this.WrapperClickEvent) {
            this.Wrapper.removeEventListener(this.WrapperClickEvent);
            delete this.WrapperClickEvent;
        }
        if (this.DataSource) delete this.DataSource;
        super.Destroy();
    }
}
