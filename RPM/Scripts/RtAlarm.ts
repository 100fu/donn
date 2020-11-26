
namespace RPM {
    class RtAlarm extends EAP.UI.BaseController{
        constructor() {
            super(EAP.UI.AGrid);
        }
        protected configOptions(options: EAP.UI.AGridOptions) {
            let gOptions = new EAP.UI.GridOption();
            gOptions.gridSolutionId = 'e80b06fb-d106-427f-9ac8-74855762b6e3';
            options.gridOption = gOptions;
            // options.viewScheme = true;
            options.filter = false;
            //gOptions.showrowcheckbox = false;

            super.configOptions(options);
        }
    };
    new RtAlarm();
}

