import { Ajax } from './../scripts/Utilities/Ajax';
export class Permission {
    private static _permissions: Object = {}
    ///fn(moduleCode:string):Array<any> 
    static getPermissions: (mCode?: string) => Array<any> = undefined
    ///fn(item, code):boolean
    static matchCode: (item, code) => boolean = (item, code) => { return item.Code == code }
    /// pCod 是Code 或Name 不重要 主要看matchCode怎么匹配。验证按钮或页面权限都可以，主要看getPermissions的设定
    static validatePermission(pCod: string, moduleCode?: string): boolean {
        var allPermission
        if (!this._permissions[moduleCode || "current"]) {
            if (!this.getPermissions) throw new Error(" getPermissions is null ")
            else {
                allPermission = this._permissions[moduleCode || "current"] = this.getPermissions(moduleCode)
            }
        }
        else allPermission = this._permissions[moduleCode || "current"]
        let result = false;
        if (allPermission) {
           for (let i = 0; i < allPermission.length; i++)   if (result = this.matchCode(allPermission[i], pCod)) break
        }
        return result;
    }

}

 ///用于 System.Permission 
 Permission.getPermissions = (mCode?) => {
    let postData = {},res
    if (mCode) postData["code"] = mCode
    new Ajax({url:"/Utilities/GetButtonsByCode",data:postData,async:false,method:"POST"}).done(d=>{
        res=d;
    });
    return res as Array<any>
}
Permission.matchCode = (item, name) => { return item == name }