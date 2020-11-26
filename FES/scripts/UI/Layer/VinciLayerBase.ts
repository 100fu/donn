import { VinciWidget } from "../VinciWidget";
export abstract class VinciLayerBase<OptionsT> extends VinciWidget<OptionsT> {
    public Open() {
        if(!this.Wrapper.parentNode)document.body.appendChild(this.Wrapper);
        this.Wrapper.style.display = "block";
    }
    public Close() {
        this.Wrapper.style.display = "none";
    }
}