namespace RPM {

    class HisAttendance extends EAP.UI.BaseController {
        constructor() {
            super(EAP.UI.AGrid);
        }
        protected configOptions(options: EAP.UI.AGridOptions) {
            let gOptions = new EAP.UI.GridOption();
            gOptions.gridSolutionId = 'dd0d96d1-b498-476e-938a-9f9670ac5dff';  //栏目Id
            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = false;
            super.configOptions(options);
        }
    };

    new HisAttendance();


}