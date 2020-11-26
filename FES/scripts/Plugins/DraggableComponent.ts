import { ToString } from './../Utilities/Type';
import * as Patterns from '../Patterns/Composit';
/**
 * Draggable; this is a container 
 */
export class Draggable extends Patterns.Composit {
    private SpanBtns = [{ text: "1/4", value: 3 }, { text: "1/3", value: 4 }, { text: "1/2", value: 6 }, { text: "1", value: 12 }]
    public Events = {
        DragStart: "DragStart"
    }
    public Span: number = 12
    private DragStartEvent
    public Wrapper: HTMLElement
    /**
     * 
     * @param Element showning draggable handler
     * @param sign unique mark for saving
     * @param component real showing content
     */
    constructor(public Element: HTMLElement, public sign: string, private component?: { Element: HTMLElement, Destroy?: () => void }) {
        super()
        this.Wrapper = document.createElement("div");
        this.Wrapper.draggable = true;
        this.Wrapper.addEventListener("dragstart", this.DragStartEvent = this.Dragstart.bind(this));
        this.Wrapper.addEventListener("mouseover", this.MouseOver.bind(this));
        this.Wrapper.addEventListener("mouseleave", this.MouseLeave.bind(this));
        if (component && component.Element) {
            component.Element.draggable = true;
            component.Element.addEventListener("dragstart", this.DragStartEvent = this.Dragstart.bind(this));
        }
        if (this.Element.parentNode) {
            this.Element.parentNode.insertBefore(this.Wrapper, this.Element);
        }
        this.Wrapper.appendChild(this.Element);
        this.Wrapper.dataset["Draggable"] = this.Id
    }
    public Destroy() {
        if (this.component) {
            if (this.component.Destroy) this.component.Destroy();
            delete this.component;
        }
        var components = this.Element.querySelectorAll("");//TODO destory them

        super.Destroy();
    }
    private Dragstart(e: DragEvent) {
        e.dataTransfer.setData("Id", this.Id);
        e.dataTransfer.dropEffect = "move";
        this.SetState(this.Events.DragStart);
    }
    private MouseOver(e: MouseEvent) {
        if (this.Wrapper.querySelector(".tooltip")) return;
        let tooltip = document.createElement("div");
        tooltip.style.opacity = "1";
        tooltip.classList.add("tooltip");
        tooltip.classList.add("bs-tooltip-bottom");
        tooltip.classList.add("bs-tooltip-bottom-docs");
        tooltip.setAttribute("role", "tooltip");
        let arrow = document.createElement("div");
        arrow.classList.add("arrow");
        tooltip.appendChild(arrow);
        let inner = document.createElement("div");
        inner.classList.add("tooltip-inner");
        this.SpanBtns.forEach(b => {
            let btn = document.createElement("a");
            btn.dataset["value"] = b.value.toString();
            btn.innerText = b.text;
            btn.href = "javascript:void(0);";
            inner.appendChild(document.createTextNode(" "));
            inner.appendChild(btn);
        })
        inner.addEventListener("click", (e: MouseEvent) => {
            let target = e.target as HTMLAnchorElement;
            if (target instanceof HTMLAnchorElement) {
                this.Span = parseInt(target.dataset["value"]);
                this.MouseLeave(e);
            }
        })
        tooltip.appendChild(inner);
        this.Wrapper.appendChild(tooltip);
    }
    private MouseLeave(e: MouseEvent) {
        let tooltip;
        if (tooltip = this.Wrapper.querySelector(".tooltip"))
            this.Wrapper.removeChild(tooltip);
    }
    /**
     * real darggable component entity --done
     */
    public ComponentEntity(): HTMLElement {
        if (this.component)
            return this.component.Element;
        else return this.Wrapper;
    }
    public DropIntoTrashCan(){

    }
}

// interface DraggableToolbarEventsMap{
//     "OnEdit"
// }
export class DraggableToolbar extends Patterns.Composit {
    public Events = {
        OnEdit: "OnEdit",
        OnSave: "OnSave",
        OnDroped: "OnDroped",
    }
    private DropEventHander
    private DragOverEventHander
    constructor(public Element: HTMLDivElement) {
        super();
        this.Initialize();
    }
    /**
     * Initialize
     */
    public Initialize() {
        this.Element.style.height = "3em";
        this.Element.innerHTML = "";
        let Button = document.createElement("button");
        Button.type = "button";
        Button.innerText = "Edit";
        Button.onclick = (e: MouseEvent) => {
            let btn = e.target as HTMLButtonElement;
            if (btn.classList.contains("btn-primary")) {
                btn.classList.remove("btn-primary");
                btn.classList.add("btn-success");
                btn.innerText = "Save";
                this.SetState(this.Events.OnEdit)
                this.Element.querySelector(".RemoveArea").addEventListener("dragover", this.DragOverEventHander || (this.DragOverEventHander = this.DragOverEvent.bind(this)), false)
                this.Element.querySelector(".RemoveArea").addEventListener("drop", this.DropEventHander || (this.DropEventHander = this.DropEvent.bind(this)), false)
            } else {
                this.SaveScript();
                btn.classList.remove("btn-success");
                btn.classList.add("btn-primary");
                btn.innerText = "Edit";
                this.SetState(this.Events.OnSave);
                this.Element.querySelector(".RemoveArea").removeEventListener("dragover", this.DragOverEventHander);
                this.Element.querySelector(".RemoveArea").removeEventListener("drop", this.DropEventHander);
            }
        }
        Button.classList.add("btn", "btn-primary", "float-left", "btn-sm", "align-middle");
        this.Element.appendChild(Button);
        let RemoveArea = document.createElement("div");
        RemoveArea.classList.add("float-right", "border", "border-danger", "RemoveArea")
        RemoveArea.style.width = "4em";
        RemoveArea.style.height = "3em";
        this.Element.appendChild(RemoveArea);
    }
    private DropEvent(e: DragEvent) {
        e.preventDefault();
        let id = e.dataTransfer.getData("Id")
            , com = Patterns.Composit.Get(id) as Draggable
            , ele = com.ComponentEntity()
        //1. the target is draggable.element
        //need to return it's origin place
        if (ele == com.Wrapper) {
            //TODO 
            return;
        }
        //2. the target is created component, and just exist only instance.
        ele.parentElement.removeChild(ele);

        //3. the target is created component, but it is copy of the instance.
        //TODO 
    }
    private DragOverEvent(e: DragEvent) {
        e.preventDefault();
    }
    public SaveScript() {

    }
    public Destroy() {
        if (this.Element.parentElement)
            this.Element.parentElement.removeChild(this.Element);
    }
}
export class DraggableContainer extends Patterns.Composit {
    private _edited: boolean = false;
    private ColSpan: number = 12;
    private DragenterEvent;
    private DropEvent;
    private DragoverEvent;
    private DragendHandler
    private UnitMark = false
    public RowHeight = 180;
    private SpanExt = new RegExp(/col-\d+|col-sm-\d+|col-md-\d+|col-lg-\d+|col-xl-\d+/)

    public get Edited(): boolean {
        return this._edited;
    }
    public set Edited(v: boolean) {
        if (v === this._edited) return;
        if (v) {
            if (!this.DragenterEvent)
                this.Element.addEventListener("dragenter", this.DragenterEvent = this.Dragenter.bind(this), false)
            if (!this.DropEvent)
                this.Element.addEventListener("drop", this.DropEvent = this.Drop.bind(this), false);
            if (!this.DragoverEvent)
                this.Element.addEventListener("dragover", this.DragoverEvent = this.Dragover.bind(this), false);
            this._edited = v;
        }
        if (!v && this.HideAndRemoveRow()) {
            this.Element.removeEventListener("dragenter", this.DragenterEvent)
            this.Element.removeEventListener("drop", this.DropEvent);
            this.Element.removeEventListener("dragover", this.DragoverEvent);
            this._edited = v;
        }
    }
    public RegistCom(com: Draggable) {
        com.Bind("DragStart", msg => {
            if (!this.Edited) return;
            /**
            * 目前因为 GragEnter 中 dataTranfer.getData()无法使用
            */
            let com: Draggable = Patterns.Composit.Get(msg.Sender.Id) as Draggable;
            this.ColSpan = com.Span;
            this.ShowAndCreateRow();
        });
    }
    constructor(public Element: HTMLDivElement, script?: string) {
        super();
        Element.classList.add("DraggableContainer");
        if (script) {
            this.ScriptAnalysis(script);
        }
    }
    /**
     * Dragenter Event
     * @param e 
     */
    private Dragenter(e: DragEvent) {
        e.preventDefault();
        //let id=e.dataTransfer.getData("text/plain");
        //get component coincide with e.dataTransfer ["Id"]

    }
    private Dragover(e: DragEvent) {
        e.preventDefault();
        // e.dataTransfer.dropEffect = "move"
    }
    private Drop(e: DragEvent) {
        this.UnitMark = true;
        e.preventDefault();
        let target = e.target as HTMLDivElement
        if (!target.classList.contains("DC-Col")) target = target.parentElement as HTMLDivElement;
        if (target.classList.contains("DC-Col") && !target.classList.contains("full")) {
            let com: Draggable = Patterns.Composit.Get(e.dataTransfer.getData("Id")) as Draggable
                , ext = new RegExp(/col-\d+|col-sm-\d+|col-md-\d+|col-lg-\d+|col-xl-\d+/)
                , ms = target.getAttribute("class").match(ext)
                , span = parseInt((ms[0] as string).match(/\d+/)[0]);
            if (span != com.Span) return;
            let ele = com.ComponentEntity();
            this.MoveOut(ele.parentElement, ele);
            this.MoveIn(target, ele);
            this.ShowAndCreateRow();
        }
        this.UnitMark = false;
    }
    private DragEnd(target: HTMLElement, e: DragEvent) {
        if (this.UnitMark) return;
        let source = e.target as HTMLElement;
        if (target.classList.contains("full") && !target.contains(source)) {
            this.MoveOut(target, source);
            this.ShowAndCreateRow();
        }
        console.log("end")
        source.removeEventListener("dragend", this.DragendHandler);
    }
    private MoveIn(target: HTMLElement, source: HTMLElement) {
        target.innerHTML = "";
        target.appendChild(source);
        //add one-off drapend for ele
        console.log("drop")
        source.removeEventListener("dragend", this.DragendHandler)
        source.addEventListener("dragend", this.DragendHandler || (this.DragendHandler = this.DragEnd.bind(this, target)));
        target.classList.add("full");
        this.SetRowClass(target.parentElement)
    }
    private MoveOut(target: HTMLElement, source: HTMLElement) {
        if (target && target.classList.contains("DC-Col")) {
            target.classList.remove("full");
            this.SetRowClass(target.parentElement);
        }
    }
    /**
     * 根据情况设置Row的类
     */
    private SetRowClass(row: HTMLElement) {
        let sub = row.querySelector(".full");
        if (sub) row.classList.remove("empty");
        else row.classList.add("empty");
    }
    public Destroy() {
        //DragenterEvent
        //DragendEvent
        //Draggable components Destroion
        super.Destroy();
    }
    /**
     * 再最底层始终保持有两排空的 done
     */
    public ShowAndCreateRow(): boolean {
        //existing layer show --done
        let rows = this.Element.getElementsByClassName("row"), len = rows.length;
        for (var index = 0; index < len; index++) {
            var r = rows[index];
            let sign = 0, subDiv = r.querySelector(".DC-Col:not(.full)") as HTMLDivElement, arry = [];
            while (subDiv) {
                arry.push(subDiv);
                let ms = subDiv.getAttribute("class").match(this.SpanExt), span = parseInt((ms[0] as string).match(/\d+/)[0])
                    , next = subDiv.nextSibling as HTMLDivElement
                sign += span
                if (!next || next.classList.contains("full")) {
                    if (sign >= this.ColSpan) {
                        while (arry.length) r.removeChild(arry.pop());
                        while (sign >= this.ColSpan) {
                            sign -= this.ColSpan;
                            let newDiv = this.GenerateCol(this.ColSpan);
                            if (next)
                                r.insertBefore(newDiv, next);
                            else r.appendChild(newDiv);
                        }
                    }
                    if (sign > 0) {
                        let newDiv = this.GenerateCol(sign);
                        if (next)
                            r.insertBefore(newDiv, next);
                        else r.appendChild(newDiv);
                    }
                    arry = []; sign = 0;
                }
                //skip full column
                while (next && next.classList.contains("full")) {
                    next = subDiv.nextSibling as HTMLDivElement;
                }

                subDiv = next
            }
        }
        let l = this.Element.children.length
        let rs = this.Element.querySelectorAll(".row:not(.empty)");
        if (rs.length > 0) {
            let nodes = Array.prototype.slice.call(this.Element.children);
            l = l - nodes.indexOf(rs[rs.length - 1]) - 1;
        }
        // if (last) {
        //     let nodes = Array.prototype.slice.call(this.Element.children);
        //     l = l - nodes.indexOf(last) - 1;
        // }
        //create new layer --done
        while (l < 2) {
            this.CreateNewRows(this.ColSpan);
            l++;
        }
        while (l > 2) {
            this.Element.removeChild(this.Element.lastElementChild);
            l--;
        }

        return true;
    }
    private GenerateCol(ColSpan: number): HTMLDivElement {
        let subDiv = document.createElement("div");
        subDiv.classList.add("col-" + this.ColSpan);
        subDiv.classList.add("DC-Col");
        subDiv.style.height = "100%";
        subDiv.style.position = "relative";
        let border = document.createElement("div");
        border.classList.add("border", "border-success");
        border.style.borderStyle = "dotted";
        border.style.position = "absolute";
        border.style.top = "0";
        border.style.left = "0";
        border.style.bottom = "0";
        border.style.right = "0";
        border.classList.add("m-1");
        subDiv.appendChild(border);
        return subDiv;
    }
    public HideAndRemoveRow(): boolean {
        //remove redundant rows  done
        while (this.Element.lastElementChild && this.Element.lastElementChild.classList.contains("empty")) {
            this.Element.removeChild(this.Element.lastElementChild);
        }
        //hide current layer --not need for present
        //subDiv.classList.add("border");
        // subDiv.classList.add("border-success");
        return true;
    }
    /**
     * ToString done
     */
    public ToString(): string {
        this.HideAndRemoveRow();
        //genrate string of script
        let rows = this.Element.querySelectorAll(".row"), rl = rows.length
            , res: string = rows.length.toString(), s1 = "", s2 = "";
        for (let i = 0; i < rl; i++) {
            let r = rows[i];
            s1 += ";"; s2 += ";"
            if (r.classList.contains("empty")) return;
            let cols = r.querySelectorAll(".DC-Col"), cl = cols.length, a1 = [], a2 = [];
            for (let ci = 0; ci < cl; ci++) {
                let c = cols[ci];
                let ms = c.getAttribute("class").match(this.SpanExt), span = parseInt((ms[0] as string).match(/\d+/)[0])
                a1.push(span);
                if (c.classList.contains("full")) {
                    let id = (c.firstChild as HTMLElement).dataset["Draggable"];
                    a2.push(id);
                }
            }
            s1 += a1.join(",")
            s2 += a2.join(",");
        }
        return res + s1 + "|" + s2.substr(1);
    }
    /**
     * ScriptAnalysis done
     * @param str rows be splited by ";""
     */
    public ScriptAnalysis(str: string): boolean {
        let l1 = str.split("|"), rN: number, rows: Array<string>, strRCom: Array<string> = l1[1].split(";");
        rN = parseInt((rows = l1[0].split(";")).shift());
        if (rN != rows.length || rN != strRCom.length) { console.error("rN!=rows.length||rN!=strRCom.length"); return false; }
        for (let i = 0; i < rows.length; i++) {
            let r = rows[i], rc = strRCom[i]
                , rowEle = this.CreateNewRows(r.split(","))
                , colEles = rowEle.querySelectorAll(".DC-Col")
            rc.split(",").forEach((id, index) => {
                if (!id) return;
                let com = Patterns.Composit.Get(c => (c as Draggable).sign == id)[0] as Draggable
                let ele = com.ComponentEntity();
                colEles[index].appendChild(ele);
                colEles[index].classList.add("full");
            })
            this.SetRowClass(rowEle)
        }
        return true;
    }

    private CreateNewRows(ColSpan: number | any[]): HTMLDivElement {
        let div = document.createElement("div");
        div.classList.add("row");
        div.classList.add("empty");
        div.style.height = this.RowHeight + "px";
        let count = Math.floor(12 / ((typeof ColSpan === "number") ? ColSpan : ColSpan.length));
        for (let i = 0; i < count; i++) {
            div.appendChild(this.GenerateCol(((typeof ColSpan === "number") ? ColSpan : parseInt(ColSpan[i]))));
        }
        this.Element.appendChild(div);
        return div;
    }
}