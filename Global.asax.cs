using Donn.EAM.Web.Core;
using Donn.EAP.Core;

using System;
using System.IO;
using System.Web;
using System.Web.SessionState;

namespace WebServer
{
    public class MvcApplication : System.Web.HttpApplication
    {
        public override void Init()
        {
            this.PostAuthenticateRequest += (s, a) => HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);



            base.Init();
        }

        protected void Application_Start(object sender, EventArgs e)
        {

            ConfigService.UseAppConfig(Path.Combine(PathService.ConfigPath, "app.json"));
            ConfigService.UseDbConfig(Path.Combine(PathService.ConfigPath, "database.json"));

            EAMApp app = new EAMApp();
            app.Run();



            LogService.GetLogger(this.GetType().FullName).Info("Application_Start");
        }

        void StartInterface()
        {
            //int sysType = Convert.ToInt32(ConfigurationManager.AppSettings["SysType"]);

            //SocketInterfaceDataManager.Instance.LoadSysParam();
            ////初始化缓存
            //SocketInterfaceDataManager.Instance.LoadPool();
            //if (sysType == 1)
            //{
            //    SocketInterfaceDataManager.Instance.StartSF_UDP();
            //}







        }
        void StartSys()
        {
            //   Task<int> task = GetStrLengthAsync();
        }
        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {
            EAMApp.OnError();
        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {
            LogService.GetLogger(this.GetType().FullName).Info("Application_End");
        }
    }
}
