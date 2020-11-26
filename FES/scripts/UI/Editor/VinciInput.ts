import { VinciEditorBase } from './VinciEditorBase';
export class VinciInput<OptionsT extends any> extends VinciEditorBase<OptionsT> {
    private InputChangeEvent;
    constructor(element?: HTMLInputElement, options?) {
        let elem = element;
        if (!elem) {
            elem = document.createElement("input");
            elem.type = "text";
        }
        if (!elem.classList.contains("form-control"))
            elem.classList.add("form-control")
        super(elem, options)
        elem.addEventListener("change",this.InputChangeEvent||(this.InputChangeEvent=this.ValueChanged.bind(this)));
    }
    protected SetValue(value){
        (this.Element as HTMLInputElement).value=value;
        super.SetValue(value);
    }
    protected ValueChanged(e:Event){
       let value= (e.target as HTMLInputElement).value;
        super.SetValue(value)
    }
    public Destroy(){
        if(this.InputChangeEvent){this.Element.removeEventListener(this.InputChangeEvent);delete this.InputChangeEvent;}
        super.Destroy();
    }
}
