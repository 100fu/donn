/// <reference path="./../Scripts/typings/jquery/jquery.d.ts" />
import { Cookie } from './../FES/scripts/Utilities/DataSet';
import { VinciWindow } from './../FES/scripts/UI/Layer/VinciWindow';
import * as ConsoleComs from './ConsoleComponents';
import { Draggable } from './../FES/scripts/Plugins/DraggableComponent';
import { GridStacker } from '../FES/scripts/Plugins/GridStacker';
import { Post } from '../FES/Business/Request';

class Controller {
    private gs: GridStacker
    private privileges = [];
    private win: VinciWindow<any>
    constructor() {
        this.privileges = ["Code1", "Code2", "TodoPlans", "TodoPlans2", "TodoPlans3"];// Permission.getPermissions("code");
        let d = document.createElement("div");
        document.body.appendChild(d);
        this.gs = new GridStacker(d);
        this.gs.Bind(this.gs.Events.DropItem, d => {
            this.win.Element.appendChild((d.Value as Draggable).Element)
        })
        this.WinInit();
        this.CreateBtns();
        let s=Cookie.get("ConsoleScripts");
        if(s)
            this.gs.ScriptAnalysis(s);
        //VinciLoading(document.body, false);
    }
    private CreateBtns() {
        let container = document.createElement("div");
        document.body.appendChild(container);
        container.classList.add("fixed-top");
        container.style.left = "auto";
        container.style.right = "20px";
        container.style.top = "20px";

        let add = document.createElement("button");
        container.appendChild(add);
        add.classList.add("btn", "btn-default", "btn-lg");
        add.innerHTML = '<span class="fa fa-plus fa-3" aria-hidden="true"></span>';
        add.style.display = "none";
        add.addEventListener("click", () => {
            this.WinOpen();
        })

        let edit = document.createElement("button");
        container.appendChild(edit);
        edit.classList.add("btn", "btn-default", "btn-lg", "mt-2")
        edit.innerHTML = '<span class="fa fa-pencil fa-3" aria-hidden="true"></span>';
        edit.addEventListener("click", () => {
            if (!(this.gs.Edited = edit.firstElementChild.classList.contains("fa-pencil"))) {
                if (this.Save(this.gs.ToString())) {
                    add.style.display = "none";
                    edit.firstElementChild.classList.remove("fa-check");
                    edit.firstElementChild.classList.add("fa-pencil");
                }
            } else {
                add.style.display = "block";
                edit.firstElementChild.classList.add("fa-check");
                edit.firstElementChild.classList.remove("fa-pencil");
            }
        })

    }
    private Save(scripts: string) {
        //upgrade cookie
        let result = false;
        //to post scriptes
        Post({ url: "/Home/ConsoleScriptsSave", data: { s: scripts }, async: false,onSuccess:() => {
            result = true;
        } })
        return result;
    }
    private WinInit() {
        let container = document.createElement("div");
        this.privileges.forEach(p => {
            let com = ConsoleComs[p] as Draggable;
            if (!com) return;
            container.appendChild(com.Element)
            this.gs.RegistCom(com);
        });
        container.style.maxWidth = "300px";
        this.win = new VinciWindow(container, { Title: "heihei" });
    }
    public WinOpen() {
        if (this.win) { this.win.Open(); return; }
        this.win.Open()
    }
}

new Controller();