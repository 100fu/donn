namespace EAP.UI.Core {

    export class ActionContext {
        name: string;
        value: any;
    }

    export interface IAction {
        name: string;
        onExecuting(context: ActionContext): boolean;
        execute(context: ActionContext): void;
        onExecuted(context: ActionContext): void
    }

    export abstract class Action implements IAction {
        name: string;
        constructor(name: string) {
            this.name = name;
        }
        /**
        * 多语言词条
        * @param code
        */
        Text(code: string): string {
            return System.CultureInfo.GetDisplayText(code);
        }
        /**
         * 异步服务调用
         * @param controller
         * @param action
         * @param postdata
         */
        ExeuteServerAction(controller: string, action: string, postdata: any, onSuccess: (data: any) => void) {

            let ctrl = new EAP.EAMController(controller);
            ctrl.ExecuteServerAction(controller, postdata, onSuccess);
        }
        /**
         * 同步服务调用
         * @param controller
         * @param action
         * @param postdata
         */
        ExeuteServerActionSync(controller: string, action: string, postdata: any) {

        }
        /**
         * 获取cookies值
         * @param key
         */
        CookieValue(key: string): string {
            return System.Cookies.get(key);
        }
        /**
         * 
         * @param option
         */
        onExecuting(option: ActionContext): boolean {
            return true;
        }
        abstract execute(option: ActionContext): void;
        onExecuted(option: ActionContext): void {

        }
    }


    export interface IViewInfo {
        EntityId: string,
        ServiceId: string,
        ViewCode: string,
        FunCode: string,
    }

    export interface IController {

    }



    export class BaseController implements IController {
        innerActions: Array<IAction>;
        TriggerAction(name: string) {
            this[name]();
        }

    }

}