var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// module 关键字被namespace 取代 //http://www.tuicool.com/articles/2eEVNbV
var SystemSetting;
(function (SystemSetting) {
    var ChangePassWord = (function (_super) {
        __extends(ChangePassWord, _super);
        //constructor 構造函數  为对象成员赋初始值
        function ChangePassWord(element, options) {
            var _this = 
            //通过this关键字来访问类内的属性和方法
            //　如果我们要在子类中调用基类中的属性与方法就要使用super关键字
            _super.call(this, element, options) || this;
            _this.init();
            return _this;
        }
        ChangePassWord.prototype.initLayout = function () {
            this.toptitle = this.layoutAppend({ id: "toptitle", css: { height: "200px", width: "100%" } });
        };
        ChangePassWord.prototype.init = function () {
            var that = this, options = new EAP.UI.FormOption();
            options.selector = this.toptitle;
            options.titleWidth = "60px";
            options.columnsAmount = 1;
            options.controlUniteWidth = 140;
            options.Data = [
                { name: "oldPwd", type: "input", title: System.CultureInfo.GetDisplayText("oldPwd"), validateOptions: { required: true }, width: 200 },
                { name: "newPwd", type: "input", title: System.CultureInfo.GetDisplayText("newPwd"), validateOptions: { required: true }, width: 200 },
                { name: "confirmPwd", type: "input", title: System.CultureInfo.GetDisplayText("confirmPwd"), validateOptions: { required: true }, width: 200 },
                {
                    controls: [
                        {
                            type: "button", content: System.CultureInfo.GetDisplayText("save"), onClick: function () {
                                that.changePwd();
                            }, width: 80, spectialWidth: "85px"
                        }
                    ], spectialWidth: "255px"
                }
            ];
            that.filterForm = new EAP.UI.FormControl(options);
            that.toptitle.style.margin = "2px";
        };
        ChangePassWord.prototype.changePwd = function () {
            var that = this;
            if (!that.filterForm.validate())
                return;
            var oldPwd = $("input[name=oldPwd]").val();
            var newPwd = $("input[name=newPwd]").val();
            var confirmPwd = $("input[name=confirmPwd]").val();
            new EAP.EAMController().ExecuteServerAction(new System.UrlObj("EMReportItem", "EMAssignTo"), {}, function (result) {
            });
        };
        return ChangePassWord;
    }(EAP.UI.Core.LayoutWithActions));
    SystemSetting.ChangePassWord = ChangePassWord;
})(SystemSetting || (SystemSetting = {}));
var ChangePassWord = new SystemSetting.ChangePassWord($('<div style="height:100%"></div>').appendTo(document.body)[0], { toolbar: true, dependencys: "acts" });
$(":text").attr({ type: "password" });
