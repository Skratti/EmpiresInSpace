using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    public class Config
    {
        private static Config _instance = null;
        private static readonly object padlock = new object(); //needed when creating the first instance of the singleton  

        public bool DebugLogin = false;

        public static Config Instance
        {
            get
            {
                if (_instance != null) return _instance;

                lock (padlock)
                {
                    if (_instance == null)
                    {
                        //_instance = new Core();
                        _instance = new Config();
                        _instance.GetWebConfig();                        
                    }
                    return _instance;
                }
            }
        }

        public void GetWebConfig()
        {
            string debugLogin = System.Configuration.ConfigurationManager.AppSettings["DebugLogin"].ToString();
            if (!String.IsNullOrEmpty(debugLogin) && debugLogin == "1") DebugLogin = true;
          
        }
    }
}
