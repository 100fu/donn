define(["require", "exports", "./../../Patterns/Composit", "./VinciModalLayer"], function (require, exports, Composit_1, VinciModalLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * VinciLoading
     * @param ele the element which want to be disabled
     * @param enable  is the loading layer enabled
     */
    exports.VinciLoading = function (ele, enable) {
        if (enable === void 0) { enable = true; }
        if (enable) {
            var vm = new VinciModalLayer_1.VinciModalLayer(undefined, { opacity: 0.8 });
            //TODO add icon
            var span = document.createElement("span");
            span.classList.add("fa", "fa-spinner", "fa-spin", "align-middle", "fa-5x");
            span.style.position = "absolute";
            span.style.top = "48%";
            vm.Wrapper.appendChild(span);
            vm.Wrapper.style.textAlign = "center";
            vm.Element.style.backgroundColor = "gray";
            ele.dataset["vmId"] = vm.Id;
            vm.Open();
        }
        else {
            var vm = Composit_1.Composit.Get(ele.dataset["vmId"]);
            vm.Destroy();
            delete ele.dataset["vmId"];
        }
    };
});
