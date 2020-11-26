export abstract class ScriptsHelper {
    static Load(url: string,onload?:(this:HTMLElement,event:Event)=>any) {
        let script = document.createElement("script");
        script.async = false;
        script.type="text/javascript";
        script.setAttribute('src', url + '?' + 'time=' + Date.parse(new Date().toString()));
        script.onload=onload;
        var div=document.createElement("div");
        div.appendChild(script);
        document.head.appendChild(div);
    }
}

export abstract class CssHelper {
    static Load(url: string,onload?:(this:HTMLElement,event:Event)=>any) {
        let link = document.createElement('link');
        // link.id   = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.onload=onload;
        link.media = 'all';
        document.head.appendChild(link);
    }
}