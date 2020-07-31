using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace EmpiresInSpace
{
    public partial class Galaxy : System.Web.UI.Page
    {
        public string SocketKey;

        protected void Page_Load(object sender, EventArgs e)
        {
            //check logged in 
            if (Session["user"] == null)
            {
                string redirectPath = System.Web.Configuration.WebConfigurationManager.AppSettings["index"].ToString();
                Response.Redirect(redirectPath);
                return;
            }

            //Websocket: remember userId
            var state = Request.Cookies["shootr.state"];  
            SocketKey = Guid.NewGuid().ToString();
            EmpiresInSpace.Users x = (EmpiresInSpace.Users)Session["user"];
            var rc = new RegisteredClient(SocketKey, x.id);
            Game.Instance.RegistrationHandler.Register(rc);

        }

        protected string demoSwitch()
        {
            string demoUser = System.Web.Configuration.WebConfigurationManager.AppSettings["demoUser"].ToString();

            string script = @"<script>
                    var isDemo = " + (demoUser == "0" ? "false" : "true") + @";
                    </script>";
            script = @"<script>
                    var isDemo = false" + @";
                    </script>";
            return script;
        }

        protected string compiledPaths()
        {
            string demoUser = System.Web.Configuration.WebConfigurationManager.AppSettings["demoUser"].ToString();

            string script =
                @"<script>
                    var ScriptPath = 'Compiled/';
                    var BuildingPath = '';
                    var QuestPath = '';
                </script>";

            return script;
        }


        protected string simplePaths()
        {
            string demoUser = System.Web.Configuration.WebConfigurationManager.AppSettings["demoUser"].ToString();

            string script =
                @"<script>
                    var ScriptPath = 'js/Scripts/';
                    var BuildingPath = 'Buildings/';
                    var QuestPath = 'Quests/';
                </script>";

            return script;
        }

        protected string versionString()
        {
            string version = System.Web.Configuration.WebConfigurationManager.AppSettings["version"].ToString();
            //string version = DateTime.Now.ToString();
            return version;
        }

        protected string didYouKnow()
        {
            //string version = EmpiresInSpace.Core.
            //string version = DateTime.Now.ToString();
            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            Users user = (Users)Session["user"];
            return bc.getLabel(user.id, 1029); //didYouKnow
        }

        protected string didYouKnowFact()
        {
            //string version = EmpiresInSpace.Core.
            //string version = DateTime.Now.ToString();
            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            Users user = (Users)Session["user"];

            Random rand = new Random();
            int randomInt = (int)Math.Floor(rand.NextDouble() * 8.0);

            return bc.getLabel(user.id, 1030 + randomInt);
        }

        protected string imageVersionString()
        {
            string version = System.Web.Configuration.WebConfigurationManager.AppSettings["imageVersion"].ToString();
            return version;
        }

        protected string setJSversionString()
        {
            return "<script type='text/javascript'>var version = '" + versionString() + "';</script>";
        }

        protected string setImageVersionString()
        {
            return "<script type='text/javascript'>var imageVersion = '" + imageVersionString() + "';</script>";
        }

        protected string setSocketKeyString()
        {
            return "<script type='text/javascript'>var SocketKey = '" + this.SocketKey + "';</script>";
        }

    }
}