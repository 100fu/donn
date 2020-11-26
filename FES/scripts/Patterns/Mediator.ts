import * as DS from "../DataStructures/LinkList";

export interface IMediator {
    Register(subject, fn: Function, type?)
    Change(subject, type?)
    Unregister(subject, fn: Function, type?)
}
class MediaNode extends DS.LNode {
    public Type: string
}
export abstract class Mediator implements IMediator {
    protected Storage: Array<DS.LinkList<MediaNode>>=[]
    Register(id: string, fn: Function, type?: any) {
       let item= this.Storage.filter(s=>s.Id===id)[0];
       if(!item){
        item=new DS.LinkList<MediaNode>();
        item.Id=id;
        this.Storage.push(item);
       }
       let newItem=new MediaNode();
       newItem.Type=type;
       newItem.Data=fn;
       item.Add(newItem);
    }
    Change(id: string, type?: any) {
        let item= this.Storage.filter(s=>s.Id===id)[0];
        if(item)
        item.ForEach(i=>{
            if(type&&i.Type!=type)return;
            (i.Data as Function)();
        })
    }
    Unregister(id: string, fn: Function, type?: any) {
        let item= this.Storage.filter(s=>s.Id===id)[0];
        if(item) item.Del_ByData(fn);
    }
}
