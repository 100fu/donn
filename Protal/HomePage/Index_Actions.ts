import { VinciWindow } from "../../FES/scripts/UI/Layer/VinciWindow";
import { Post } from "../../FES/Business/Request";
import { CultureInfo } from "../../FES/Business/Cultures";

export let ModifyPassword = () => {
    let div = document.createElement("div");
    div.innerHTML = '<form>\
        <h4 id="msg" style="color:red;"></h4>\
    <div class="form-group row">\
          <label class="col-sm-3 col-form-label" for="oldPwd">'+ CultureInfo.TranslateText("oldPwd") +'</label>\
          <div class="col-sm-9">\
            <input type="password" id="oldPwd" name="oldPwd" placeholder="Please fill in original password" class="form-control">\
            <p id="oldPwdHelp" class="help-block" style="display:none;">Supporting help text</p>\
          </div>\
        </div>\
    <div class="form-group row">\
          <label class="col-sm-3 col-form-label" for="newPwd">'+ CultureInfo.TranslateText("newPwd") +'</label>\
          <div class="col-sm-9">\
            <input type="password" id="newPwd" name="newPwd"  placeholder="Please fill in new password" class="form-control">\
            <p id="newPwdHelp" class="help-block" style="display:none;">Supporting help text</p>\
          </div>\
        </div>\
    <div class="form-group row">\
          <label class="col-sm-3 col-form-label" for="confirmPwd">'+ CultureInfo.TranslateText("confirmPwd") +'</label>\
          <div class="col-sm-9">\
            <input type="password" id="confirmPwd" name="confirmPwd" placeholder="Please fill in new password again" class="form-control">\
            <p id="confirmPwdHelp" class="help-block" style="display:none;">Supporting help text</p>\
          </div>\
        </div>\
    <div class="form-group row justify-content-md-center">\
          <div class="col-sm-6">\
            <button class="form-control btn btn-success">'+ CultureInfo.TranslateText("save") +'</button>\
          </div>\
        </div>\
        </form>';
    div.getElementsByTagName("button")[0].onclick = (e) => {
        e.preventDefault();
        (div.querySelector("#msg") as HTMLHeadElement).innerText = "";
        document.getElementById("confirmPwdHelp").innerText = "";
        let fd = new FormData(div.getElementsByTagName("form")[0]);
        if (fd.get("newPwd") !== fd.get("confirmPwd")) {
            let ele = document.getElementById("confirmPwdHelp");
            ele.style.display = "block";
            ele.innerText = "confirm password must correspond to new password "
            return;
        }
        Post({
            url: "/Privilege/UserUpdatePwd", data: fd, onSuccess: (d) => {
                (div.querySelector("#msg") as HTMLHeadElement).innerText=CultureInfo.TranslateText(d)
            }
        })
    }
    new VinciWindow(div, { AutoDestory: true, Title: "Password Modifying" }).Open();
}