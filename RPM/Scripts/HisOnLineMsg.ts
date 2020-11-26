
namespace RPM {
    //class HisOnLineMsg extends EAP.UI.BaseController {
    //    constructor() {
    //        //super(LayoutW);
    //        super(EAP.UI.AGrid);
    //        $(".formFilter").find("span").click();
    //        $(document).ready(function () {
    //            $(".group_bar_right").find("button:not(:first)").hide();
    //            $(".gAppOtherTool_div").parent().hide();
    //            $(".divLattic").find(".l_divCell:last").hide();
    //        });
    //        $(".formFilter").find("span").click(function () {
    //            $(".divLattic").find(".l_divCell:last").hide();
    //        });
    //    }
    //    protected configOptions(options: EAP.UI.AGridOptions) {
    //        let gOptions = new EAP.UI.GridOption();
    //        gOptions.gridSolutionId = '45d4713b-883b-4137-b5b9-ce923fa64152';  //栏目Id
    //        gOptions.dataBound = () => {
    //            $(".layoutContent .k-grid-content colgroup col:first-child").width(0);
    //            $(".layoutContent .k-grid-header-wrap colgroup col:first-child").width(0);
    //        }
    //        options.gridOption = gOptions;
    //        options.viewScheme = false;
    //        options.filter = true;
    //        options.toolbar = true;
    //        //傳入自定義參數
    //        options.gridDataRequest = new EAP.UI.GridDataRequest();
    //        options.gridDataRequest.postdata = { search: function () { return "online"; } };
    //        $("div[name='formFilter']").find("span").click(function () {
    //            $(".divLattic").find(".l_divCell:last").hide();
    //        });
    //        return options;
    //    }
    //};

    class HisOnLineMsg extends EAP.UI.BaseController {
        constructor() {
            super(EAP.UI.AGrid);
            $(".formFilter").find("span").click();
            $(".group_bar_right").find("button:not(:first)").hide();
            $(".gAppOtherTool_div").parent().hide();
        }

        protected configOptions(options: EAP.UI.AGridOptions) {
            let gOptions = new EAP.UI.GridOption();
            gOptions.gridSolutionId = '45d4713b-883b-4137-b5b9-ce923fa64152';  //栏目Id
            gOptions.dataBound = () => {
                $(".layoutContent .k-grid-content colgroup col:first-child").width(0);
                $(".layoutContent .k-grid-header-wrap colgroup col:first-child").width(0);
            }
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = true;
            options.toolbar = true;
            super.configOptions(options);
        }
    };
    new HisOnLineMsg();

}