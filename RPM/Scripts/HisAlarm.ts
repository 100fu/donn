namespace RPM {


    class HisAlarm extends EAP.UI.BaseController {
        constructor() {
            super(EAP.UI.AGrid);
        }
        protected configOptions(options: EAP.UI.AGridOptions) {
            let gOptions = new EAP.UI.GridOption();
            gOptions.gridSolutionId = 'e80b06fb-d106-427f-9ac8-74855762b6e3	';  //栏目Id
            //gOptions.gridSolutionId = 'a16d2166-3c13-4421-9c8f-6ce56cd18923	';  //栏目Id
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = false;
            super.configOptions(options);
        }
    };

    new HisAlarm();


}