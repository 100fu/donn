define(["require", "exports", "./../FES/scripts/Utilities/DataSet", "./../FES/scripts/UI/Layer/VinciWindow", "./ConsoleComponents", "../FES/scripts/Plugins/GridStacker", "../FES/Business/Request"], function (require, exports, DataSet_1, VinciWindow_1, ConsoleComs, GridStacker_1, Request_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Controller = (function () {
        function Controller() {
            var _this = this;
            this.privileges = [];
            this.privileges = ["Code1", "Code2", "TodoPlans", "TodoPlans2", "TodoPlans3"]; // Permission.getPermissions("code");
            var d = document.createElement("div");
            document.body.appendChild(d);
            this.gs = new GridStacker_1.GridStacker(d);
            this.gs.Bind(this.gs.Events.DropItem, function (d) {
                _this.win.Element.appendChild(d.Value.Element);
            });
            this.WinInit();
            this.CreateBtns();
            var s = DataSet_1.Cookie.get("ConsoleScripts");
            if (s)
                this.gs.ScriptAnalysis(s);
            //VinciLoading(document.body, false);
        }
        Controller.prototype.CreateBtns = function () {
            var _this = this;
            var container = document.createElement("div");
            document.body.appendChild(container);
            container.classList.add("fixed-top");
            container.style.left = "auto";
            container.style.right = "20px";
            container.style.top = "20px";
            var add = document.createElement("button");
            container.appendChild(add);
            add.classList.add("btn", "btn-default", "btn-lg");
            add.innerHTML = '<span class="fa fa-plus fa-3" aria-hidden="true"></span>';
            add.style.display = "none";
            add.addEventListener("click", function () {
                _this.WinOpen();
            });
            var edit = document.createElement("button");
            container.appendChild(edit);
            edit.classList.add("btn", "btn-default", "btn-lg", "mt-2");
            edit.innerHTML = '<span class="fa fa-pencil fa-3" aria-hidden="true"></span>';
            edit.addEventListener("click", function () {
                if (!(_this.gs.Edited = edit.firstElementChild.classList.contains("fa-pencil"))) {
                    if (_this.Save(_this.gs.ToString())) {
                        add.style.display = "none";
                        edit.firstElementChild.classList.remove("fa-check");
                        edit.firstElementChild.classList.add("fa-pencil");
                    }
                }
                else {
                    add.style.display = "block";
                    edit.firstElementChild.classList.add("fa-check");
                    edit.firstElementChild.classList.remove("fa-pencil");
                }
            });
        };
        Controller.prototype.Save = function (scripts) {
            //upgrade cookie
            var result = false;
            //to post scriptes
            Request_1.Post({ url: "/Home/ConsoleScriptsSave", data: { s: scripts }, async: false, onSuccess: function () {
                    result = true;
                } });
            return result;
        };
        Controller.prototype.WinInit = function () {
            var _this = this;
            var container = document.createElement("div");
            this.privileges.forEach(function (p) {
                var com = ConsoleComs[p];
                if (!com)
                    return;
                container.appendChild(com.Element);
                _this.gs.RegistCom(com);
            });
            container.style.maxWidth = "300px";
            this.win = new VinciWindow_1.VinciWindow(container, { Title: "heihei" });
        };
        Controller.prototype.WinOpen = function () {
            if (this.win) {
                this.win.Open();
                return;
            }
            this.win.Open();
        };
        return Controller;
    }());
    new Controller();
});
