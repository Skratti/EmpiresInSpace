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
            //Response.Write("<script>alert('Hello')</script>");

            /*
            if (Session["secretOk"] == null || Session["secretOk"] != "jupp")
                Response.Redirect("SecretSecurityPanel.aspx");
             * */

            if (Request.Params["action"] == null)
                return;
            string action = Request.Params["action"];

            switch (action)
            {
                case "demo":
                    openDemo();
                    return;
                case "demo2":
                    openDemo2();
                    return;
            }
        }

        void openDemo()
        {
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/html";

            string resp = "demo";
            Response.Write(resp);

            string demoURL = System.Web.Configuration.WebConfigurationManager.AppSettings["demo"].ToString();
            Response.Redirect(demoURL);            

            return;
        }

        void openDemo2()
        {
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/html";

            string resp = "demo2";
            Response.Write(resp);

            string demoURL = System.Web.Configuration.WebConfigurationManager.AppSettings["demo2"].ToString();
            Response.Redirect(demoURL);

            return;
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