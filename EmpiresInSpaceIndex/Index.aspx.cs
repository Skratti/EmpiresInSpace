using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SpacegameIndex
{
    public partial class index : System.Web.UI.Page
    {
        //LINQDataClasses1DataContext dc = new LINQDataClasses1DataContext();

        protected void Page_Load(object sender, EventArgs e)
        {

        }               

        public string userLanguage()
        {
            string languageCode = "en";
            try
            {
                languageCode = Request.UserLanguages[0].Substring(0, 2);
            }
            catch{}

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

        protected string recaptchaPublicString()
        {
            return "<script type='text/javascript'>var recaptchaPublic = '" + ConfigurationHelper.ReCaptchaPublicKey + "';</script>";
        }

    }

    public static class ConfigurationHelper
    {
        public static string ReCaptchaPublicKey
        {
            get { return System.Configuration.ConfigurationManager.AppSettings["ReCaptchaPublicKey"]; }
        }

        public static string ReCaptchaPrivateKey
        {
            get { return System.Configuration.ConfigurationManager.AppSettings["ReCaptchaPrivateKey"]; }
        }
    }
}