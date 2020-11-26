namespace RPM {

    //class Basestation extends EAP.UI.BaseController {
    //    constructor() {
    //        super(EAP.UI.AGrid);
    //    }
    //    protected configOptions(options: EAP.UI.AGridOptions) {
    //        let gOptions = new EAP.UI.GridOption();
    //        gOptions.gridSolutionId = '4f7926ef-b210-450c-95e6-b89d785b1b14';
    //        options.gridOption = gOptions;
    //        options.viewScheme = false;
    //        options.filter = true;

    //        super.configOptions(options);
    //    }
    //}

    //new Basestation();
    class Tag extends EAP.UI.BaseController {
        constructor() {
            super(EAP.UI.AGrid);
            $(".group_bar_right").find("button:not(:first)").hide();
            $(".gAppOtherTool_div").parent().hide();
        }
        protected configOptions(options: EAP.UI.AGridOptions)
        {
            let gOptions = new EAP.UI.GridOption();
            gOptions.gridSolutionId = '4f7926ef-b210-450c-95e6-b89d785b1b14';  //栏目Id
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = true;
            super.configOptions(options);
        }
    };

    new Tag();


}