define(["require", "exports", "../../FES/scripts/UI/Layer/VinciWindow", "../../FES/Business/Request", "../../FES/Business/Cultures"], function (require, exports, VinciWindow_1, Request_1, Cultures_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ModifyPassword = function () {
        var div = document.createElement("div");
        div.innerHTML = '<form>\
        <h4 id="msg" style="color:red;"></h4>\
    <div class="form-group row">\
          <label class="col-sm-3 col-form-label" for="oldPwd">' + Cultures_1.CultureInfo.TranslateText("oldPwd") + '</label>\
          <div class="col-sm-9">\
            <input type="password" id="oldPwd" name="oldPwd" placeholder="Please fill in original password" class="form-control">\
            <p id="oldPwdHelp" class="help-block" style="display:none;">Supporting help text</p>\
          </div>\
        </div>\
    <div class="form-group row">\
          <label class="col-sm-3 col-form-label" for="newPwd">' + Cultures_1.CultureInfo.TranslateText("newPwd") + '</label>\
          <div class="col-sm-9">\
            <input type="password" id="newPwd" name="newPwd"  placeholder="Please fill in new password" class="form-control">\
            <p id="newPwdHelp" class="help-block" style="display:none;">Supporting help text</p>\
          </div>\
        </div>\
    <div class="form-group row">\
          <label class="col-sm-3 col-form-label" for="confirmPwd">' + Cultures_1.CultureInfo.TranslateText("confirmPwd") + '</label>\
          <div class="col-sm-9">\
            <input type="password" id="confirmPwd" name="confirmPwd" placeholder="Please fill in new password again" class="form-control">\
            <p id="confirmPwdHelp" class="help-block" style="display:none;">Supporting help text</p>\
          </div>\
        </div>\
    <div class="form-group row justify-content-md-center">\
          <div class="col-sm-6">\
            <button class="form-control btn btn-success">' + Cultures_1.CultureInfo.TranslateText("save") + '</button>\
          </div>\
        </div>\
        </form>';
        div.getElementsByTagName("button")[0].onclick = function (e) {
            e.preventDefault();
            div.querySelector("#msg").innerText = "";
            document.getElementById("confirmPwdHelp").innerText = "";
            var fd = new FormData(div.getElementsByTagName("form")[0]);
            if (fd.get("newPwd") !== fd.get("confirmPwd")) {
                var ele = document.getElementById("confirmPwdHelp");
                ele.style.display = "block";
                ele.innerText = "confirm password must correspond to new password ";
                return;
            }
            Request_1.Post({
                url: "/Privilege/UserUpdatePwd", data: fd, onSuccess: function (d) {
                    div.querySelector("#msg").innerText = Cultures_1.CultureInfo.TranslateText(d);
                }
            });
        };
        new VinciWindow_1.VinciWindow(div, { AutoDestory: true, Title: "Password Modifying" }).Open();
    };
});
