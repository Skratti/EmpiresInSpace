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

        /// <summary>
        /// On page load check if a user is logged in and register the client.
        /// </summary>
        /// <param name="sender">???</param>
        /// <param name="e">???</param>
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!CheckUserLogin()) return;

            RegisterClientSocket();
        }

        /// <summary>
        /// Check if a user is logged in and redirect clients without user to the login page.
        /// </summary>
        /// <returns>True if a user is connected, false if not.</returns>
        private bool CheckUserLogin ()
        {
            if (Session["user"] == null)
            {
                string redirectPath = System.Web.Configuration.WebConfigurationManager.AppSettings["index"].ToString();
                Response.Redirect(redirectPath);
                return false;
            }
            else return true;
        }

        /// <summary>
        /// Register the client.
        /// </summary>
        private void RegisterClientSocket()
        {
            //var state = Request.Cookies["shootr.state"];
            //string decoded = HttpUtility.UrlDecode(state.Value);
            //var rc = JsonConvert.DeserializeObject<RegisteredClient>(decoded);
            SocketKey = Guid.NewGuid().ToString();
            EmpiresInSpace.Users user = (EmpiresInSpace.Users)Session["user"];
            var rc = new RegisteredClient(SocketKey, user.id);
            //rc.RegistrationID = (string)Session["user"];
            Game.Instance.RegistrationHandler.Register(rc);
        }

        // -------------------- ALL (OR MOST) OF THE FOLLOWING METHODS ARE USED BY THE PAGE ---------------------------------------

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