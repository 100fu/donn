import { Draggable } from './../FES/scripts/Plugins/DraggableComponent';
import { Extend } from "../FES/scripts/Utilities/Extend";
import { CssHelper, ScriptsHelper } from '../FES/scripts/Utilities/DocHelper';

//TODO remove DEMO need them
CssHelper.Load("/Resource/Scripts/Kendo/Style/kendo.common.min.css")
CssHelper.Load("/Resource/Scripts/Kendo/Style/kendo.metro.min.css")
CssHelper.Load("/Resource/Styles/eap.css")
CssHelper.Load("/Resource/Styles/eap.kendo.css")

let btn=document.createElement("button");
btn.innerText = "button1";
let e1 = document.createElement("div");
e1.innerHTML = "Overflowing text to show scroll behavior\
Cras mattis consectetur purus sit amet fermentum.Cras justo odio, dapibus ac facilisis in, egestas eget quam.Morbi leo risus, porta ac consectetur ac, vestibulum at eros.\
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.\
Aenean lacinia bibendum nulla sed consectetur.Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Donec sed odio dui.Donec ullamcorper nulla non metus auctor fringilla.\
Cras mattis consectetur purus sit amet fermentum.Cras justo odio, dapibus ac facilisis in, egestas eget quam.Morbi leo risus, porta ac consectetur ac, vestibulum at eros.\
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.\
Aenean lacinia bibendum nulla sed consectetur.Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Donec sed odio dui.Donec ullamcorper nulla non metus auctor fringilla.\
Cras mattis consectetur purus sit amet fermentum.Cras justo odio, dapibus ac facilisis in, egestas eget quam.Morbi leo risus, porta ac consectetur ac, vestibulum at eros.\
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.\
Aenean lacinia bibendum nulla sed consectetur.Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Donec sed odio dui.Donec ullamcorper nulla non metus auctor fringilla.";
export let Code1 = new Draggable(btn, "button1", { Element: e1 });

let btn1 = document.createElement("button");
btn1.innerText = "button2";
let e2 = document.createElement("div");
e2.innerHTML = e1.innerHTML;
export let Code2 = new Draggable(btn1, "button2", { Element: e2 });


export class TodoPlansController extends EAP.UI.BaseController {
    public element
    constructor(classType?) {
        let w = document.createElement("div");
        w.style.height = "100%";
        super(classType || EAP.UI.AGrid, w, EAP.UI.DefaultLayout.singleTable);
    }
    protected configOptions(options: EAP.UI.AGridOptions): void {
        options.entityId = 'Donn.EAM.MP.Entity.MPlans';
        options.serviceId = 'Donn.EAM.MP.Interface.IMPlansService';
        options.gridOption = new EAP.UI.GridOption();
        options.gridOption.gridSolutionId = "0b1761e2-ebf7-41cf-bafd-0095b415a565";
        //options.gridOption.columns = [{ field: "Asset.Name", template: () =>"Asset.Name" }, { field: "Source" }, { field: "TaskDescription" }]
    }
}
let btn3 = document.createElement("button");
btn3.innerText = "TodoPlans";
export let TodoPlans = new Draggable(btn3, "TodoPlans");
let todoPlans: TodoPlansController;
TodoPlans.ComponentEntity = (): HTMLDivElement => {
    if (!todoPlans) todoPlans = new TodoPlansController();
    return todoPlans.element;
}



let btn4 = document.createElement("button");
btn4.innerText = "TodoPlans2";
export let TodoPlans2 = new Draggable(btn4, "TodoPlans2");
let todoPlans2: TodoPlansController;
TodoPlans2.ComponentEntity = (): HTMLDivElement => {
    if (!todoPlans2) todoPlans2 = new TodoPlansController();
    return todoPlans2.element;
}

let btn5 = document.createElement("button");
btn5.innerText = "TodoPlans3";
export let TodoPlans3 = new Draggable(btn5, "TodoPlans3");
let todoPlans3: TodoPlansController;
TodoPlans3.ComponentEntity = (): HTMLDivElement => {
    if (!todoPlans3) todoPlans3 = new TodoPlansController();
    return todoPlans3.element;
}