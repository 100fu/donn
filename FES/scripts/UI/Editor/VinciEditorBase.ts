import { VinciWidget } from './../VinciWidget';
export abstract class VinciEditorBase<OptionsT> extends VinciWidget<OptionsT> {
    protected GetValue(): any {
        return this.Element.dataset.value;
    }
    protected SetValue(value) {
        this.Element.dataset.value=value;
    }
    public Value(value?: any): any {
        if (value === undefined)
            return this.GetValue();
        else
            this.SetValue(value);
    }
}