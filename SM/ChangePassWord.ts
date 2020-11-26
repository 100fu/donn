// module 关键字被namespace 取代 //http://www.tuicool.com/articles/2eEVNbV
namespace SystemSetting {

    export class ChangePassWord extends EAP.UI.Core.LayoutWithActions {
        toptitle: HTMLDivElement;
        filterForm: EAP.UI.FormControl;
        //constructor 構造函數  为对象成员赋初始值
        constructor(element: HTMLElement, options?: any) {
            //通过this关键字来访问类内的属性和方法
            //　如果我们要在子类中调用基类中的属性与方法就要使用super关键字
            super(element, options);//调用基类的构造函数
            this.init();
        }

        initLayout() {
            this.toptitle = this.layoutAppend({ id: "toptitle", css: { height: "200px", width: "100%" } });

        }
        init() {
            let that = this, options = new EAP.UI.FormOption();
            options.selector = this.toptitle;
            options.titleWidth = "60px";
            options.columnsAmount = 1;
            options.controlUniteWidth = 140;
            options.Data = [
                { name: "oldPwd", type: "input", title: System.CultureInfo.GetDisplayText("oldPwd"), validateOptions: { required: true },width:200 },
                { name: "newPwd", type: "input", title: System.CultureInfo.GetDisplayText("newPwd"), validateOptions: { required: true }, width: 200},
                { name: "confirmPwd", type: "input", title: System.CultureInfo.GetDisplayText("confirmPwd"), validateOptions: { required: true }, width: 200 },
                {
                    controls: [
                        {
                            type: "button", content: System.CultureInfo.GetDisplayText("save"), onClick: function () {
                                that.changePwd();
                            }, width: 80, spectialWidth: "85px"
                        }], spectialWidth: "255px"
                }

            ];
            that.filterForm = new EAP.UI.FormControl(options);
            that.toptitle.style.margin = "2px";
        }
        changePwd() {
            var that = this;
            if (!that.filterForm.validate()) return;
            var oldPwd = $("input[name=oldPwd]").val();
            var newPwd = $("input[name=newPwd]").val();
            var confirmPwd = $("input[name=confirmPwd]").val();
            new EAP.EAMController().ExecuteServerAction(new System.UrlObj("EMReportItem", "EMAssignTo"), {  }, function (result) {
               
            });
        }
    }
}
let ChangePassWord = new SystemSetting.ChangePassWord($('<div style="height:100%"></div>').appendTo(document.body)[0], { toolbar: true, dependencys: "acts" });
$(":text").attr({ type: "password" });


