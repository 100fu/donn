//import { ToString } from './../Utilities/Type';
//import * as Patterns from '../Patterns/Composit';
///**
// * Draggable; this is a container 
// */
//export class Draggable extends Patterns.Composit {
//    public Events = {
//        DragStart: "DragStart"
//    }
//    public Col=1
//    public Row=1
//    public SizeX
//    public SizeY
//    private DragStartEvent
//    public Wrapper: HTMLElement
//    /**
//     * 
//     * @param Element showning draggable handler
//     * @param Sign unique mark for saving
//     * @param component real showing content
//     */
//    constructor(public Element: HTMLElement, public Sign: string, public Size:Array<{x:number,y:number}>=[{x:12,y:1}],private component?: { Element: HTMLElement, Destroy?: () => void }) {
//        super()
//        this.Wrapper = document.createElement("div");
//        let targetEle=Element;
//        if (component && component.Element) 
//            targetEle= component.Element 
//        if (targetEle.parentNode) {
//            targetEle.parentNode.insertBefore(this.Wrapper, this.Element);
//        }
//        this.Wrapper.appendChild(this.Element);
//        this.Wrapper.dataset["Draggable"] = this.Id
//    }
//    public Destroy() {
//        if (this.component) {
//            if (this.component.Destroy) this.component.Destroy();
//            delete this.component;
//        }
//        var components = this.Element.querySelectorAll("");//TODO destory them

//        super.Destroy();
//    }

//    public SwitchOnDrag(){
//        //灰化处理
//        this.Wrapper
//        //Add event listener
//        this.Wrapper.addEventListener("clickdown")
//    }
//    public SwitchOffDrag(){

//    }
//    private Dragstart(e: DragEvent) {
//        e.dataTransfer.setData("Id", this.Id);
//        e.dataTransfer.dropEffect = "move";
//        this.SetState(this.Events.DragStart);
//    }
//    private MouseOver(e: MouseEvent) {
//        if (this.Wrapper.querySelector(".tooltip")) return;
//        let tooltip = document.createElement("div");
//        tooltip.style.opacity = "1";
//        tooltip.classList.add("tooltip");
//        tooltip.classList.add("bs-tooltip-bottom");
//        tooltip.classList.add("bs-tooltip-bottom-docs");
//        tooltip.setAttribute("role", "tooltip");
//        let arrow = document.createElement("div");
//        arrow.classList.add("arrow");
//        tooltip.appendChild(arrow);
//        let inner = document.createElement("div");
//        inner.classList.add("tooltip-inner");
//        this.SpanBtns.forEach(b => {
//            let btn = document.createElement("a");
//            btn.dataset["value"] = b.value.toString();
//            btn.innerText = b.text;
//            btn.href = "javascript:void(0);";
//            inner.appendChild(document.createTextNode(" "));
//            inner.appendChild(btn);
//        })
//        inner.addEventListener("click", (e: MouseEvent) => {
//            let target = e.target as HTMLAnchorElement;
//            if (target instanceof HTMLAnchorElement) {
//                this.Span = parseInt(target.dataset["value"]);
//                this.MouseLeave(e);
//            }
//        })
//        tooltip.appendChild(inner);
//        this.Wrapper.appendChild(tooltip);
//    }
//    private MouseLeave(e: MouseEvent) {
//        let tooltip;
//        if (tooltip = this.Wrapper.querySelector(".tooltip"))
//            this.Wrapper.removeChild(tooltip);
//    }
//    /**
//     * real darggable component entity --done
//     */
//    public ComponentEntity(): HTMLElement {
//        if (this.component)
//            return this.component.Element;
//        else return this.Wrapper;
//    }
//    private DropIntoTrashCan() {

//    }
//}

//// interface DraggableToolbarEventsMap{
////     "OnEdit"
//// }
//export class DraggableToolbar extends Patterns.Composit {
//    public Events = {
//        OnEdit: "OnEdit",
//        OnSave: "OnSave",
//        OnDroped: "OnDroped",
//    }
//    private DropEventHander
//    private DragOverEventHander
//    constructor(public Element: HTMLDivElement) {
//        super();
//        this.Initialize();
//    }
//    /**
//     * Initialize
//     */
//    public Initialize() {
//        this.Element.style.height = "3em";
//        this.Element.innerHTML = "";
//        let Button = document.createElement("button");
//        Button.type = "button";
//        Button.innerText = "Edit";
//        Button.onclick = (e: MouseEvent) => {
//            let btn = e.target as HTMLButtonElement;
//            if (btn.classList.contains("btn-primary")) {
//                btn.classList.remove("btn-primary");
//                btn.classList.add("btn-success");
//                btn.innerText = "Save";
//                this.SetState(this.Events.OnEdit)
//                this.Element.querySelector(".RemoveArea").addEventListener("dragover", this.DragOverEventHander || (this.DragOverEventHander = this.DragOverEvent.bind(this)), false)
//                this.Element.querySelector(".RemoveArea").addEventListener("drop", this.DropEventHander || (this.DropEventHander = this.DropEvent.bind(this)), false)
//            } else {
//                this.SaveScript();
//                btn.classList.remove("btn-success");
//                btn.classList.add("btn-primary");
//                btn.innerText = "Edit";
//                this.SetState(this.Events.OnSave);
//                this.Element.querySelector(".RemoveArea").removeEventListener("dragover", this.DragOverEventHander);
//                this.Element.querySelector(".RemoveArea").removeEventListener("drop", this.DropEventHander);
//            }
//        }
//        Button.classList.add("btn", "btn-primary", "float-left", "btn-sm", "align-middle");
//        this.Element.appendChild(Button);
//        let RemoveArea = document.createElement("div");
//        RemoveArea.classList.add("float-right", "border", "border-danger", "RemoveArea")
//        RemoveArea.style.width = "4em";
//        RemoveArea.style.height = "3em";
//        this.Element.appendChild(RemoveArea);
//    }
//    private DropEvent(e: DragEvent) {
//        e.preventDefault();
//        let id = e.dataTransfer.getData("Id")
//            , com = Patterns.Composit.Get(id) as Draggable
//            , ele = com.ComponentEntity()
//        //1. the target is draggable.element
//        //need to return it's origin place
//        if (ele == com.Wrapper) {
//            //TODO 
//            return;
//        }
//        //2. the target is created component, and just exist only instance.
//        ele.parentElement.removeChild(ele);

//        //3. the target is created component, but it is copy of the instance.
//        //TODO 
//    }
//    private DragOverEvent(e: DragEvent) {
//        e.preventDefault();
//    }
//    public SaveScript() {

//    }
//    public Destroy() {
//        if (this.Element.parentElement)
//            this.Element.parentElement.removeChild(this.Element);
//    }
//}
//export class DraggableContainer extends Patterns.Composit {
//    private _edited: boolean = false;
//    private UnitMark = false
//    public CubleSize={x:280,y:280}
//    public CubleAmount=8
//    public CubleMargin=5
//    private Coms:Array<Draggable>=[]
//    public get Edited(): boolean {
//        return this._edited;
//    }
//    public set Edited(v: boolean) {
//        if (v === this._edited) return;
//        if (v) {
//            this.ShowAndCreateRow();
//        }
//        if (!v && this.HideAndRemoveRow()) {
//        }
//        this._edited = v;
//    }
//    public RegistCom(com: Draggable) {
//        com.Bind("DragStart", msg => {
//            if (!this.Edited) return;
//            /**
//            * 目前因为 GragEnter 中 dataTranfer.getData()无法使用
//            */
//            let com: Draggable = Patterns.Composit.Get(msg.Sender.Id) as Draggable;
//            this.ColSpan = com.Span;
//            this.ShowAndCreateRow();
//        });
//    }
//    constructor(public Element: HTMLDivElement, script?: string) {
//        super();
//        Element.classList.add("DraggableContainer");
//        if (script) {
//            this.ScriptAnalysis(script);
//        }
//        Element.style.width=this.CubleAmount*(this.CubleSize.x+2*this.CubleMargin)+"px";
//    }
 
//    public Destroy() {
//        //DragenterEvent
//        //DragendEvent
//        //Draggable components Destroion
//        super.Destroy();
//    }
//    /**
//     * 再最底层始终保持有两排空的 done
//     */
//    public ShowAndCreateRow(): boolean {
      
//    }
//    private GenerateCol(ColSpan: number): HTMLDivElement {
        
//    }
//    public HideAndRemoveRow(): boolean {
        
//    }

//    protected CalculatePosition(coms:Array<Draggable>,cubleSize:{x:number,y:number}){
        
//    }

//    /**
//     * return index if return -1 then it means this position can not be set
//     */
//    protected PreCalculate(coms:Array<Draggable>,cubleSize:{x:number,y:number},objTopRowCode:number):number{
        
//    }
//    /**
//     * ToString done
//     */
//    public ToString(): string {
//        this.HideAndRemoveRow();
//        //genrate string of script
//        let rows = this.Element.querySelectorAll(".row"), rl = rows.length
//            , res: string = rows.length.toString(), s1 = "", s2 = "";
//        for (let i = 0; i < rl; i++) {
//            let r = rows[i];
//            s1 += ";"; s2 += ";"
//            if (r.classList.contains("empty")) return;
//            let cols = r.querySelectorAll(".DC-Col"), cl = cols.length, a1 = [], a2 = [];
//            for (let ci = 0; ci < cl; ci++) {
//                let c = cols[ci];
//                let ms = c.getAttribute("class").match(this.SpanExt), span = parseInt((ms[0] as string).match(/\d+/)[0])
//                a1.push(span);
//                if (c.classList.contains("full")) {
//                    let id = (c.firstChild as HTMLElement).dataset["Draggable"];
//                    a2.push(id);
//                }
//            }
//            s1 += a1.join(",")
//            s2 += a2.join(",");
//        }
//        return res + s1 + "|" + s2.substr(1);
//    }
//    /**
//     * ScriptAnalysis done
//     * @param str rows be splited by ";""
//     */
//    public ScriptAnalysis(str: string): boolean {
//        let l1 = str.split("|"), rN: number, rows: Array<string>, strRCom: Array<string> = l1[1].split(";");
//        rN = parseInt((rows = l1[0].split(";")).shift());
//        if (rN != rows.length || rN != strRCom.length) { console.error("rN!=rows.length||rN!=strRCom.length"); return false; }
//        for (let i = 0; i < rows.length; i++) {
//            let r = rows[i], rc = strRCom[i]
//                , rowEle = this.CreateNewRows(r.split(","))
//                , colEles = rowEle.querySelectorAll(".DC-Col")
//            rc.split(",").forEach((id, index) => {
//                if (!id) return;
//                let com = Patterns.Composit.Get(c => (c as Draggable).Sign == id)[0] as Draggable
//                let ele = com.ComponentEntity();
//                colEles[index].appendChild(ele);
//                colEles[index].classList.add("full");
//            })
//            this.SetRowClass(rowEle)
//        }
//        return true;
//    }

//}