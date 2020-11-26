import { Mediator } from "./Mediator";
import { Observerable, ObserverMsg } from './Observerable';

class ObserMediator extends Mediator {
    Register(subject, fn: Function, type?: any) {
       super.Register(typeof subject ==="string"?subject: subject.Id, fn, type)
    }
    Change(subject , type?: any,value?:any) {
        let id=typeof subject ==="string"?subject: subject.Id
            ,item= this.Storage.filter(s=>s.Id===id)[0];
            if(item)
            item.ForEach(i=>{
                if(type&&i.Type!=type)return;
                let p=new ObserverMsg();
                p.Type=type;
                p.Value=value;
                p.Sender=subject;
                (i.Data as Function)(p);
            })
    }
    Unregister(subject, fn: Function, type?: any) {
        super.Register(typeof subject ==="string"?subject: subject.Id,fn, type)
    }
}
let mediator=new ObserMediator();

export class ObserverableWMediator extends Observerable {
    protected SetState(type: string,value?:any){
        if(value){
            let state=this.StateTable.filter(s=>s.type==type)[0];
            if(state){
                if(value!==state.value)
                {
                    mediator.Change(this,type,value);
                }
            }else{this.StateTable.push(state);
                mediator.Change(this,type,value);
            }
        }else{
            mediator.Change(this,type,value);
        }
    }
    /**
     * Bind [, ownObj?: Object, ...otherData: any[]]可直接对fn进行bind
     * @param type 
     * @param fn 
     */
    public Bind(type: string, fn: (msg: ObserverMsg, ...parameters: any[]) => void) {
        mediator.Register(this,fn,type)
    }
    /**
     * Once [, ownObj?: Object, ...otherData: any[]]可直接对fn进行bind
     * @param type 
     * @param fn 
     */
    public Once(type: string, fn: (msg: ObserverMsg, ...parameters: any[]) => void) {
        mediator.Register(this,fn,type)
    }
}
