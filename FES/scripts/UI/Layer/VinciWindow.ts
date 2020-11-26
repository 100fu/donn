import { VinciLayerBase } from './VinciLayerBase';
import { VinciModalLayer } from "./VinciModalLayer";

export interface IVinciWindowOptions  {
    AutoDestory?: boolean
    Title?: string
    // Align?:string
}
export class VinciWindow<OptionsT extends IVinciWindowOptions> extends VinciLayerBase<OptionsT> {
    public MODELLAYER: string;
    protected get DefaultOptions(): IVinciWindowOptions {
        return { AutoDestory: true, Title: "My modal Window" }; //,Align:"center"
    }
    constructor(element: HTMLDivElement, options?: OptionsT) {
        super(element, options)
    }
    /**
     * need to satisfiy rebuiding of widget.
     */
    protected Initialization() {
        if (this.MODELLAYER) {
            let c = this.Remove(this.GetChild(this.MODELLAYER));
            if (c) c.Destroy();
        }
        this.MODELLAYER = this.Add(new VinciModalLayer(undefined, { opacity:0.4 })).Id;

        if (this.Wrapper.parentNode)
            this.Wrapper.parentNode.removeChild(this.Wrapper)
        this.Wrapper = document.createElement("div");
        this.Wrapper.style.color="black";
        let dialog = document.createElement("div");
        dialog.classList.add("modal-dialog")
        let content = document.createElement("div");
        dialog.appendChild(content);
        content.classList.add("modal-content")
        content.appendChild(this.GenerateHeader());
        content.appendChild(this.GenerateContent());
        content.appendChild(this.GenerateFoot());
        this.Wrapper.appendChild(dialog);
        this.Wrapper.classList.add("center-block"); //default Align:"center"
        this.Wrapper.classList.add("modal"); //animation need fade
        this.Wrapper.classList.add("in"); //animation need fade
    }
    private GenerateHeader(): HTMLDivElement {
        let header = document.createElement("div");
        header.classList.add("modal-header");
        let h4 = document.createElement("h4");
        h4.classList.add("modal-title")
        h4.innerText = this.Options.Title;
        header.appendChild(h4)
        let button = document.createElement("button");
        button.type = "button";
        button.classList.add("close");
        button.setAttribute("aria-label", "Close");
        button.innerHTML = '<span aria-hidden="true">&times;</span>';
        button.onclick = this.Close.bind(this);
        header.appendChild(button);
        return header;
    }
    private GenerateContent(): HTMLDivElement {
        let content = document.createElement("div");
        content.appendChild(this.Element);
        content.classList.add("modal-body");
        return content;
    }
    private GenerateFoot(): HTMLDivElement {
        let foot = document.createElement("div");
        foot.classList.add("modal-footer");
        return foot;
    }
    public Open() {
        (this.GetChild(this.MODELLAYER) as VinciModalLayer<any>).Open();
        super.Open();
    }
    public Close() {
        super.Close();
        (this.GetChild(this.MODELLAYER) as VinciModalLayer<any>).Close();
        if (this.Options.AutoDestory) this.Destroy();
    }
}