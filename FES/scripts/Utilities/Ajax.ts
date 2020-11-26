import { Extend } from './Extend';
// enum ContentType{  //vs 2017 ts 15.4 中不可指定string 类型enum
//     json = "application/json"
//     // "form"="multipart/form-data; charset=utf-8; boundary=something"
// }
abstract class ContentType{
    static readonly json = "application/json"
    // static readonly form="multipart/form-data; charset=utf-8; boundary=something"
}

export interface Options {
    url: string
    data?: any
    async?: boolean
    method?: string
    contentType?: "json" | "form"
}
export class Ajax {
    private oAjax: XMLHttpRequest
    constructor(public options: Options) {
        this.options = Extend(this.options, { async: true, method: "POST", contentType: "form" })
        this.configOAjax()
    }
    done(fn?: (data:any,code?:number,oAjax?:XMLHttpRequest) => void, err?: (code: number,oAjax?:XMLHttpRequest) => void) {
        this.oAjax.onreadystatechange = () => {
            if (this.oAjax.readyState == 4)
                if (this.oAjax.status >= 200&&this.oAjax.status<300)
                    fn && fn(this.distillData(),this.oAjax.status,this.oAjax);
                else err && err(this.oAjax.status,this.oAjax);
        }
        this.oAjax.open(this.options.method, this.options.url, this.options.async);
        
        if(ContentType[this.options.contentType])this.oAjax.setRequestHeader("Content-Type",ContentType[this.options.contentType]);
        this.oAjax.send(this.PostDataConvert(this.options.contentType,this.options.data));
    }
    private PostDataConvert(type: string, data: any): any {
        if (!data) return data;
        let res
        switch (type) {
            case "json":
                if(typeof data==="string"){res=data;break;}
                res= JSON.stringify(data)
                break;
            case "form":
                if (data instanceof FormData) { res = data; break; }
                res = new FormData();
                if (typeof data === "string") {
                    data.split("&").forEach(item => {
                        let i = item.split("=")
                        res.append(i[0], i[1])
                    })
                }
                else if (typeof data === "object") {
                    for (let n in data) {
                        if ((data as Object).hasOwnProperty(n))
                            res.append(n, (typeof data[n] === "string") ? data[n] : JSON.stringify(data[n]))
                    }
                }

                break;
            default:
                break;
        }
        return res;
    }
    private configOAjax() {
        if (window["XMLHttpRequest"]) this.oAjax = new XMLHttpRequest();
        else this.oAjax = new ActiveXObject("Microsoft.XMLHTTP"); //为兼容IE6
    }
    private distillData(): any {
        let type: string;
        try {
            type = this.oAjax.getResponseHeader("Content-Type")
        }
        catch (e) {
            console.log(e);
        }
        if (type.indexOf("application/json;") != -1)
            return JSON.parse(this.oAjax.responseText);
        else
            return this.oAjax.responseText;
    }
}