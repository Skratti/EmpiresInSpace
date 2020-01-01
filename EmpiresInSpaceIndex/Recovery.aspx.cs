using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SpacegameIndex
{
    public partial class Recovery : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected string userLanguage()
        {
            string languageCode = "en";
            try
            {
                languageCode = Request.UserLanguages[0].Substring(0, 2);
            }
            catch { }

            return "<script type='text/javascript'>var userLang = '" + languageCode + "';</script>";
        }

        protected string versionString()
        {
            return System.Web.Configuration.WebConfigurationManager.AppSettings["version"].ToString();
        }

        protected string setJSversionString()
        {
            return "<script type='text/javascript'>var version = '" + versionString() + "';</script>";
        }

        protected string RecoveryInput()
        {
            if (Request.Params["c"] == null)
                return "";
            string key = Request.Params["c"];
            return key;
        }

        protected string RecoveryKeyDisabled()
        {
            if (Request.Params["c"] == null)
                return "";            

            return "disabled";
        }

        protected string RecoveryKeyHidden()
        {
            if (Request.Params["c"] == null)
                return "";            

            return "type='hidden'";
        }
        
    }
}