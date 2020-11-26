
namespace RPM {

    class HisAttenCount extends EAP.UI.BaseController {
        constructor() {
            super(EAP.UI.AGrid);
            $(".formFilter").find("span").click();
            $(".group_bar_right").find("button:not(:first)").hide();
            $(".gAppOtherTool_div").parent().hide();
        }

        protected configOptions(options: EAP.UI.AGridOptions) {
            let gOptions = new EAP.UI.GridOption();
            gOptions.gridSolutionId = 'c28be09c-5c7b-402c-83ad-8fff169017a8';  //栏目Id
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

    new HisAttenCount();


}



