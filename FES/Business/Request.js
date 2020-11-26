define(["require", "exports", "../scripts/Utilities/Ajax"], function (require, exports, Ajax_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SuccessCallback;
    //TODO 
    var FailtureCallback;
    var ReLocation;
    exports.Post = function (options) {
        new Ajax_1.Ajax(options).done(SuccessCallback.bind(options), FailtureCallback.bind(options));
    };
    //DONN
    SuccessCallback = function (data, code, oAjax) {
        var opt = this, url;
        if (url = oAjax.getResponseHeader("OutlineRedirectory")) {
            ReLocation(oAjax.responseURL);
        }
        if (data && data.IsSuccess !== undefined) {
            if (data.IsSuccess === false) {
                if (data.Message == "RedirectLogin")
                    ReLocation("/");
                opt.onError(data.Message);
            }
            else
                opt.onSuccess(data.Data);
        }
        else
            opt.onSuccess(data);
    };
    FailtureCallback = function (code, oAjax) {
        // if(code==302 ||code==307){ReLocation( reponseHeader("Location")||"/");return;}
        this.onError(undefined, code);
    };
    ReLocation = function (url) {
        var cw = window;
        while (cw.parent != cw)
            cw = cw.parent;
        cw.location.assign(url);
    };
});
//END DONN 
