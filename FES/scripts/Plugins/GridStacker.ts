import { Draggable } from './DraggableComponent';
import { ObserverableWMediator } from './../Patterns/ObserverableWithMediator';

/**
 * GridStacker 需要引用第三方库 gridstack.min.js including jquery。。。
 */
export class GridStacker extends ObserverableWMediator {
    private _edited: boolean = false;
    private Items: Array<{ x: number, y: number, w: number, h: number, id: string }> = [];
    private Coms: Array<Draggable> = []
    public Events = { DropItem:"DropItem"}
    public get Edited(): boolean {
        return this._edited;
    }
    public set Edited(v: boolean) {
        if (v === this._edited) return;
        let gs = $(this.Element).data("gridstack")
        if (v) {
            $(this.Element).find(".fa-trash").show();
            gs.enable();
        }
        if (!v) {
            $(this.Element).find(".fa-trash").hide();
            gs.disable();
        }
        this._edited = v;
    }
    public RegistCom(com: Draggable) {
        this.Coms.push(com);
        com.Element.addEventListener("click", this.AddWidget.bind(this, com, 0, 0, 4, 4));
    }
    
    public DropItem(id: string): boolean {
        if (!id) { console.log("GridStacker.Remove:id is " + id); return false; }
        let i = this.Coms.filter(c => c.sign == id)[0];
        if (!i) { console.log("GridStacker.Remove:conresponded com is " + i); return false; }
        this.SetState(this.Events.DropItem, i);
        let index = this.Items.indexOf(this.Items.filter(i => i.id == id)[0]);
        if (index >= 0) this.Items.splice(index, 1);
        i.DropIntoTrashCan();
    }
    constructor(public Element: HTMLDivElement) {
        super()
        Element.classList.add("grid-stack");
        //$(Element).before($("<div class='trashCan' style='height:120px;background-color:#d5dea3;margin:10px;'><i class='fa fa- trash' aria-hidden='true'></i></div>").hide())
        $(Element).gridstack({
            //removable: ".trashCan",
            cellHeight: 80,
            verticalMargin: 10
        }).on("change", (e, items) => {
            if (!items) return;
            items.forEach(i => {
                let b = this.Items.filter(e => e.id == i.id)[0]
                if (b) {
                    b.x = i.x;
                    b.y = i.y;
                    b.w = i.width;
                    b.h = i.height;
                }
            });
            }).on("enable", e => {

            }).on("disable", e => {

            })
            //.on('removed', (e, items) => {
            //    if (!items) return;
            //    items.forEach(i => {
            //        let b = this.Coms.filter(e => e.sign == i.id)[0]
            //        b.DropIntoTrashCan();
            //    });
            //});
    }

    public Destroy() {
        //DragenterEvent
        //DragendEvent
        //Draggable components Destroion
        $(this.Element).data("gridstack").destory();
    }

    /**
     * ToString done
     */
    public ToString(): string {
        return JSON.stringify(this.Items);
    }
    public AddWidget(el: Draggable, x, y, w, h,ap=true) {
        if (this.Items.filter(i => i.id == el.sign)[0]) return;
        let item = document.createElement("div");
        if (el.Element.parentElement)
            el.Element.parentElement.removeChild(el.Element);
        let content = document.createElement("div");
        item.appendChild(content);
        content.classList.add("grid-stack-item-content")
        content.appendChild(el.ComponentEntity());
        let it = $(this.Element).data("gridstack").addWidget(item, x, y, w, h, ap, undefined, undefined, undefined, undefined, el.sign);
        $("<i class='fa fa-trash fa-2x' style='cursor:pointer;right:10px;position:absolute;color: gray;' aria-hidden='true'></i>")[this.Edited?"show":"hide"]().on("click", (e) => {
            e.preventDefault();
            $(this.Element).data("gridstack").removeWidget(it)
            this.DropItem(it.data("gsId"));
        }).appendTo(it)
        this.Items.push({ x: it.data("gsX"), y: it.data("gsY"), h: it.data("gsHeight"), w: it.data("gsWidth"), id: el.sign });
    }
    /**
     * ScriptAnalysis done
     * @param str rows be splited by ";""
     */
    public ScriptAnalysis(str: string): boolean {
        let gs=$(this.Element).data("gridstack");
        gs.removeAll();
        let array: Array<{ x: number, y: number, w: number, h: number, id: string }> = JSON.parse(str);
        if (array) this.Items = [];
        array.forEach(i => {
            let item = this.Coms.filter(c => c.sign == i.id)[0]
            //let item = Composit.Get((c: Draggable) => c.sign == i.id) as Draggable;
            if (item) //TODO privilege filtering
            {
                this.AddWidget(item, i.x, i.y, i.w, i.h,false);
            }
        })
        gs.disable()
        return true;
    }

}