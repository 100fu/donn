var EAP;
(function (EAP) {
    var UI;
    (function (UI) {
        var Core;
        (function (Core) {
            var ActionContext = (function () {
                function ActionContext() {
                }
                return ActionContext;
            }());
            Core.ActionContext = ActionContext;
            var Action = (function () {
                function Action(name) {
                    this.name = name;
                }
                /**
                * 多语言词条
                * @param code
                */
                Action.prototype.Text = function (code) {
                    return System.CultureInfo.GetDisplayText(code);
                };
                /**
                 * 异步服务调用
                 * @param controller
                 * @param action
                 * @param postdata
                 */
                Action.prototype.ExeuteServerAction = function (controller, action, postdata, onSuccess) {
                    var ctrl = new EAP.EAMController(controller);
                    ctrl.ExecuteServerAction(controller, postdata, onSuccess);
                };
                /**
                 * 同步服务调用
                 * @param controller
                 * @param action
                 * @param postdata
                 */
                Action.prototype.ExeuteServerActionSync = function (controller, action, postdata) {
                };
                /**
                 * 获取cookies值
                 * @param key
                 */
                Action.prototype.CookieValue = function (key) {
                    return System.Cookies.get(key);
                };
                /**
                 *
                 * @param option
                 */
                Action.prototype.onExecuting = function (option) {
                    return true;
                };
                Action.prototype.onExecuted = function (option) {
                };
                return Action;
            }());
            Core.Action = Action;
            var BaseController = (function () {
                function BaseController() {
                }
                BaseController.prototype.TriggerAction = function (name) {
                    this[name]();
                };
                return BaseController;
            }());
            Core.BaseController = BaseController;
        })(Core = UI.Core || (UI.Core = {}));
    })(UI = EAP.UI || (EAP.UI = {}));
})(EAP || (EAP = {}));
