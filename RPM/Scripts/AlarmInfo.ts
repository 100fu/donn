namespace RPM {

    class AlarmInfo extends EAP.UI.BaseController {
        constructor() {
            super(EAP.UI.AGrid);
        }
        protected configOptions(options: EAP.UI.AGridOptions) {
            let gOptions = new EAP.UI.GridOption();
            gOptions.gridSolutionId = 'c1f6d0fc-8834-4bfe-a400-65f0fdfc0a31';  //栏目Id
            //gOptions.gridSolutionId = 'a16d2166-3c13-4421-9c8f-6ce56cd18923	';  //栏目Id
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = false;
            super.configOptions(options);
        }
    };
    new AlarmInfo();

}