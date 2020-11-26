var Cookies = {
    //    getCookieAdapter: function () {
    //        (function () { }).apply(jquery, arguments);
    //    },
    get: function (name) {

        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));

        if (arr != null) return unescape(arr[2]); return null;
    },
    set: function (name, value, expires) {

        this.remove(name);

        var Days = expires || 7;

        var exp = new Date();

        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);

        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
    },
    remove: function (name) {

        var exp = new Date();

        exp.setTime(exp.getTime() - 1);

        var cval = this.get(name);

        if (cval != null) {
            cval = '';
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
        }
    }
};
window["userName"] = function () {
    return Cookies.get('EAMUSERNAME')
    //return "Admin"
}
window["signOut"] = function () { location.assign("/Home/ExitLogin"); }
window["userCenter"] = function () { this.console.log("userCenter"); }

window["pwReset"] = function () {
   
    this.console.log("pwReset");
    //alert(111);
    var updataPwd = document.createElement('div');
    updataPwd.setAttribute('id', 'upw');

    var oldU = document.createElement('div');
    oldU.setAttribute('id', 'updata_pwd')
    //oldU.setAttribute('class', 'p_up');
    var title = document.createElement('H5');
    title.innerText = "修改密码";
    oldU.append(title);

    //旧密码
    var oldP = document.createElement('div');
    oldP.setAttribute('id', 'old_pwd')
    oldP.setAttribute('class', 'p_up');
    //var titleOld = document.createElement('H6');
    //titleOld.setAttribute('id', 'title_old');
    //titleOld.setAttribute('class', 'h6_Password');
    //titleOld.innerText = "旧密码：";
    var inputOld = document.createElement('input');
    inputOld.setAttribute('id', 'input_old');
    inputOld.setAttribute('class', 'input_Password');
    inputOld.setAttribute('type', 'password');
    //placeholder
    inputOld.placeholder = "请输入旧密码";

    //oldP.append(titleOld);
    oldP.append(inputOld);

    //新密码
    var oldN = document.createElement('div');
    oldN.setAttribute('id', 'new_pwd')
    oldN.setAttribute('class', 'p_up');
    //var titleNew = document.createElement('H6');
    //titleNew.setAttribute('id', 'title_new');
    //titleNew.setAttribute('class', 'h6_Password');
    //titleNew.innerText = "新密码：";
    var inputNew = document.createElement('input');
    inputNew.setAttribute('id', 'input_new');
    inputNew.setAttribute('class', 'input_Password');
    inputNew.setAttribute('type', 'password');
    inputNew.placeholder = "请输入新密码";
    //oldN.append(titleNew);
    oldN.append(inputNew);

    //确认密码
    var oldC = document.createElement('div');
    oldC.setAttribute('id', 'confirm_pwd')
    //oldC.setAttribute('class', 'p_up');
    //var titleConfirm = document.createElement('H6');
    //titleConfirm.setAttribute('id', 'title_confirm');
    //titleConfirm.setAttribute('class', 'h6_Password');
    //titleConfirm.innerText = "确认密码：";
    var inputConfirm = document.createElement('input');
    inputConfirm.setAttribute('id', 'input_confirm');
    inputConfirm.setAttribute('class', 'input_Password');
    inputConfirm.setAttribute('type', 'password');
    inputConfirm.placeholder = "请输入确认密码";
    //oldC.append(titleConfirm);
    oldC.append(inputConfirm);

    //显示错误信息
    var oldM = document.createElement('div');
    oldM.setAttribute('id', 'message_pwd');
    oldM.setAttribute('class', 'p_up');

    updataPwd.append(oldU);
    updataPwd.append(oldP);
    updataPwd.append(oldN);
    updataPwd.append(oldC);
    updataPwd.append(oldM);


    var inputP = document.createElement('input');
    inputP.setAttribute('id', 'inpwdP');
    inputP.setAttribute('type', 'button');
    inputP.value = "取消";
    inputP.onclick = function () {
        updataPwd.style.display = "none";
        lucency.style.display = "none";

    }
    
    var inputS = document.createElement('input');
    inputS.setAttribute('id', 'inpwdS');
    inputS.setAttribute('type', 'button');
    inputS.value = "确定";
    inputS.onclick = function () {
        var confirm_Pwd = inputConfirm.value;
        var new_Pwd = inputNew.value;
        var old_Pwd = inputOld.value;

        if (old_Pwd != "") {
            if (new_Pwd != "") {
                if (confirm_Pwd != "") {
                    if (new_Pwd == confirm_Pwd) {
                        oldM.innerText = "";
                        //let old_pwd = "";
                        //let new_pwd = "";
                        //var urlPathPwd = "UserController/UpdatePassword";
                        //$.ajax({
                        //    type: "post",
                        //    url: "User/UpdatePassword",
                        //    data: { oldPwd: old_Pwd, newPwd: new_Pwd },
                        //    cont
                        //    success: function (data) {
                        //        //$(".show").val(data.d);
                        //        alert(new_pwd);
                        //    }                         

                        //}),
                        let strJson = { "oldPwd": old_Pwd, "newPwd": new_Pwd }
                        $.ajax({
                            type: "post", caches:false,
                            url: "/User/UpdatePassword",
                            data: strJson,
                            success: function (data) {
                                //$(".show").val(data.d);
                                if (data.Data) {
                                    alert("密码修改成功！");
                                }
                                    
                                else {
                                    alert("密码修改失败！");
                                }
                            },
                            async: false
                        });
                        //})
                        //let urlPath = "/User/UpdatePassword";
                        //let strJson = { oldPwd: old_Pwd, newPwd: new_Pwd };
                        //new Ajax({ url: urlPath, data: strJson, contentType: "json", type:"post" }).done(d => {
                        //    alert("121212");
                        //});


                        
                        updataPwd.style.display = "none";
                        lucency.style.display = "none";
                        

                    } else {
                        oldM.innerText = "*新密码和确认密码不符！";
                    }
                } else {
                    oldM.innerText = "*确认密码不能为空！";
                }
            } else {
                oldM.innerText = "*新密码不能为空！";
            }
        } else {
            oldM.innerText = "*旧密码不能为空！";
        }
       
        
    }
    updataPwd.append(inputS);
    updataPwd.append(inputP);
    var lucency = document.createElement('div');
    lucency.setAttribute('id', 'lucency');
    //lucency.setAttribute('class', 'p_up');

    $("#pwd").append($(lucency));
    $("#pwd").append($(updataPwd));

}
function passWord() {
   
}

window["setting"] = function () { this.console.log("setting"); }
window["userInfos"] = function () {
    var s = [
        //     {
        //   class: "userCenter", name: "个人中心", callback: () => {
        //     window["userCenter"]();
        //   }
        // }
        //, 
        {
            class: "pwReset", name: "修改密码", callback: () => {
                window["pwReset"]();
            }
           
        }
        //,
        // {
        //   class: "setting", name: "软件配置", callback: () => {
        //     window["setting"]();
        //   }
        // }
    ];
    return s;
}
window["menus"] = function () {
    var a = [];
    var MenuAdapter = function (d) {
        var result = [];
        d.forEach(i => {
            let obj = {};
            if (i.menus) obj.children = MenuAdapter(i.menus);
            obj.code = i.Code;//d.IdPrivilege;
            obj.name = i.menuname;
            obj.url = i.url;
            obj.class = i.objname;
            result.push(obj);
        });
        return result;
    }
    $.ajax("/Home/GerArchMenus_new", {
        async: false, type: "POST", success: (d) => {
            a = MenuAdapter(d);
        }
    })
    //a=[{
    //  class: "monitor",
    //  name: "实时监控",
    //  url: "https://www.baidu.com",
    //  code: "monitor",
    //  children:[{
    //    class: "monitor",
    //    name: "实时监控",
    //    url: "https://www.baidu.com",
    //    code: "monitor",
    //  }, {
    //      class: "tagManager",
    //      name: "标签管理",
    //      url: "https://www.baidu.com",
    //      code: "tagManager"
    //    }]
    //}]
    //a.push({
    //  class: "monitor",
    //  name: "实时监控",
    //  url: "https://www.baidu.com",
    //  code: "monitor"
    //})
    return a;
    // return [{
    //   class: "monitor",
    //   name: "实时监控",
    //   url: "https://www.baidu.com",
    //   code: "monitor",
    //   target:"baidu_first"
    // }, {
    //   class: "tagManager",
    //   name: "标签管理",
    //   url: "https://www.baidu.com",
    //   code: "tagManager"
    // }, {
    //   class: "history",
    //   name: "历史回放",
    //   url: "https://www.baidu.com",
    //   code: "history"
    // }, {
    //   class: "warnning",
    //   name: "报警管理",
    //   url: "https://www.baidu.com",
    //   code: "warnning"
    // }, {
    //   class: "dataAnalysis",
    //   name: "数据分析",
    //   url: "https://www.baidu.com",
    //   code: "dataAnalysis"
    // }, {
    //   class: "vadio",
    //   name: "视频联动",
    //   url: "https://www.baidu.com",
    //   code: "vadio"
    // }, {
    //   class: "eleMention",
    //   name: "电子点名",
    //   url: "https://www.baidu.com",
    //   code: "eleMention"
    // }];
}
window["defaultPage"]=function(){
    return ""
  }
  window["defaultMainPage"]=function(){
      return "RtMap"
  }