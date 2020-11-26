import { Ajax, Options as AjaxOpts } from "../scripts/Utilities/Ajax";
interface Options extends AjaxOpts {
    onError?: (msg?: string, code?: number) => void;
    onSuccess?: (data?: any) => void;
}
let SuccessCallback: (data: Object,code:number,oAjax?:XMLHttpRequest) => void;
//TODO 
let FailtureCallback: (code: number,oAjax?:XMLHttpRequest) => void;
let ReLocation:(url:string)=>void;
export let Post = (options: Options) => {
    new Ajax(options).done(SuccessCallback.bind(options), FailtureCallback.bind(options))
}

//DONN
SuccessCallback = function(data: { IsSuccess: boolean, Message: string, Data: any },code:number,oAjax:XMLHttpRequest) {
    let opt = this as Options,url:string
    if(url=oAjax.getResponseHeader("OutlineRedirectory")){
        ReLocation(oAjax.responseURL);
    }
    if (data && data.IsSuccess !== undefined) {
        if (data.IsSuccess === false) {
            if (data.Message == "RedirectLogin") ReLocation("/");
            opt.onError(data.Message)
        } else opt.onSuccess(data.Data);
    } else opt.onSuccess(data)
}
FailtureCallback = function(code: number,oAjax?:XMLHttpRequest) {
    // if(code==302 ||code==307){ReLocation( reponseHeader("Location")||"/");return;}
    (this as Options).onError(undefined, code);
}
ReLocation=(url:string)=>{
    let cw=window;
    while(cw.parent!=cw) cw=cw.parent;
    cw.location.assign(url);
}
//END DONN