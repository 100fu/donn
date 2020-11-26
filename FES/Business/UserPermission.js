define(["require", "exports", "./../scripts/Utilities/Ajax"], function (require, exports, Ajax_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Permission = (function () {
        function Permission() {
        }
        /// pCod 是Code 或Name 不重要 主要看matchCode怎么匹配。验证按钮或页面权限都可以，主要看getPermissions的设定
        Permission.validatePermission = function (pCod, moduleCode) {
            var allPermission;
            if (!this._permissions[moduleCode || "current"]) {
                if (!this.getPermissions)
                    throw new Error(" getPermissions is null ");
                else {
                    allPermission = this._permissions[moduleCode || "current"] = this.getPermissions(moduleCode);
                }
            }
            else
                allPermission = this._permissions[moduleCode || "current"];
            var result = false;
            if (allPermission) {
                for (var i = 0; i < allPermission.length; i++)
                    if (result = this.matchCode(allPermission[i], pCod))
                        break;
            }
            return result;
        };
        return Permission;
    }());
    Permission._permissions = {};
    ///fn(moduleCode:string):Array<any> 
    Permission.getPermissions = undefined;
    ///fn(item, code):boolean
    Permission.matchCode = function (item, code) { return item.Code == code; };
    exports.Permission = Permission;
    ///用于 System.Permission 
    Permission.getPermissions = function (mCode) {
        var postData = {}, res;
        if (mCode)
            postData["code"] = mCode;
        new Ajax_1.Ajax({ url: "/Utilities/GetButtonsByCode", data: postData, async: false, method: "POST" }).done(function (d) {
            res = d;
        });
        return res;
    };
    Permission.matchCode = function (item, name) { return item == name; };
});
