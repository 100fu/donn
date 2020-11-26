import { Composit } from './../../Patterns/Composit';
import { VinciModalLayer } from './VinciModalLayer';
/**
 * VinciLoading
 * @param ele the element which want to be disabled
 * @param enable  is the loading layer enabled
 */
export let VinciLoading = (ele: HTMLElement, enable: boolean = true) => {
    if (enable) {
        let vm = new VinciModalLayer(undefined, { opacity: 0.8 });
        //TODO add icon
        let span=document.createElement("span");
        span.classList.add("fa","fa-spinner","fa-spin","align-middle","fa-5x");
        span.style.position="absolute"
        span.style.top="48%"
        vm.Wrapper.appendChild(span);
        vm.Wrapper.style.textAlign="center";
        vm.Element.style.backgroundColor="gray";
        ele.dataset["vmId"] = vm.Id;
        vm.Open();
    }
    else {
        let vm = Composit.Get(ele.dataset["vmId"]) as VinciModalLayer<any>;
        vm.Destroy();
        delete ele.dataset["vmId"];
    }
}
