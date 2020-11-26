import * as Utilities from './../Utilities/Guid';

export class ObserverMsg {
    public Sender: IObseverable
    public Type: string
    public Value: any
}
export interface IObseverable {
    Id:string
    GetState(type: string);
    Bind(type: string, fn: (msg: ObserverMsg, ...parameters: any[]) => void, ownObj?: Object, ...otherData: any[])
    Once(type: string, fn: (msg: ObserverMsg, ...parameters: any[]) => void, ownObj?: Object, ...otherData: any[])
}
export abstract class Observerable implements IObseverable {
    public Id:string
    public Events:Object
    constructor() {
        this.Id = Utilities.Guid.NewId();
    }
    protected StateTable:Array<{type:string,value?:any}>=[]
    /**
     * 设置状态 如果有改变 会自动notice
     * @param type 
     * @param value 
     */
    protected SetState(type: string,value?:any) {
        if(value){
            let state=this.StateTable.filter(s=>s.type==type)[0];
            if(state){
                if(value!==state.value)
                {
                    //change
                }
            }else{this.StateTable.push(state);
            //change
            }
        }
    }
    public GetState(type: string) {
        let state=this.StateTable.filter(s=>s.type==type)[0];
        if(state)return state.value;
    }
    public Bind(type: string, fn: (msg: ObserverMsg, ...parameters: any[]) => void, ownObj?: Object, ...otherData: any[]) {
        throw new Error("Method not implemented.");
    }
    public Once(type: string, fn: (msg: ObserverMsg, ...parameters: any[]) => void, ownObj?: Object, ...otherData: any[]) {
        throw new Error("Method not implemented.");
    }
}
