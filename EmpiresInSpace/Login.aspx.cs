﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;

namespace EmpiresInSpace
{
    /// <summary>
    /// This handles (a port of) the login logic.
    /// </summary>
    public partial class login : System.Web.UI.Page
    {
        /// <summary>
        /// This logs the demo user in.
        /// </summary>
        /// <param name="demoUserId">The id of the user to be logged in.</param>
        private void LoginDemoUser(int demoUserId)
        {
            this.SetSession(demoUserId);

            if (CheckConnection())
            {
                string newUrl = ResolveUrl("Galaxy.aspx");
                Response.Redirect(newUrl, false);
                Context.ApplicationInstance.CompleteRequest();
            } 
        }

        /// <summary>
        /// This checks if the connection is still running
        /// </summary>
        /// <returns>True if the client is connected, false if it is not.</returns>
        private bool CheckConnection()
        {
            if (Response.IsClientConnected) //example from msdn
            {
                return true;
            }
            else
            {
                // If the browser is not connected
                // stop all response processing.
                Response.End();
                return false;
            }
        }

        /// <summary>
        /// This registers a demo user and logs them in.
        /// </summary>
        /// <param name="demoUserId">Id of the user to be registered.</param>
        /// <param name="startingRegion">???</param>
        /// <returns>True if the user was registered and logged in, false if they were not.</returns>
        private bool RegisterUser(int demoUserId, string startingRegion = null)
        {
            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            if (bc.userRegisterUser(demoUserId, startingRegion, true ))
            {
                this.SetSession(demoUserId);
                Response.Redirect("Galaxy.aspx");
                return true;
            }
            return false;
        }

        /// <summary>
        /// This logs in or registers a demo user.
        /// </summary>
        /// <param name="demoUserId">Id of the user to be logged in or reigstered.</param>
        /// <returns>True if the user was registered and logged in or just logged in, false if they were not.</returns>
        private bool DemoLoginCreate(int demoUserId)
        {
            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            //check if demoUser is really part of the game. If not, go to user creation routine                
            if (bc.UserExists(demoUserId))
            {
                LoginDemoUser(demoUserId);
                return true;
            }
            else
            {
                var StartingRegion = Application["StartingRegion"];
                return RegisterUser(demoUserId, StartingRegion != null ? StartingRegion.ToString() : null);
            }
        }

        /// <summary>
        /// This sets the user in the session storage.
        /// </summary>
        /// <param name="userid">The id of the user to be stored.</param>
        private void SetSession(int userid)
        {
            SpacegameServer.Core.Core.Instance.writeToLog("Page_Load() 10 Set Session " + userid.ToString());
            Session["user"] = new Users(userid);
        }

        /// <summary>
        /// This class handles the login on page load.
        /// </summary>
        /// <param name="sender">The sender (client?)</param>
        /// <param name="e">The event arguments (???)</param>
        protected void Page_Load(object sender, EventArgs e)
        {
            //There are three sources which userId to take:
            //1) userId provided manually in a demo environment in the settings panel
            //2) Demo userId from thw Web.config file
            //3) userId generated by using the logincode from the index page (standard login)

            //in Demo games, a new user may be saved in the DemoId field. If yes, delete the previous session and create a demo user
            if (LoginCheckCache()) return;

            //check if session variable already exists. If yes, user is already correctly logged in and may go to the game
            if (LoginCheckSession()) return;

            //read demouser to force login to a specific user (for debugging)
            if (LoginCheckDemoUser()) return;

            // still do not know what exactly those are doing, but they do it without throwing errors now
            if (LoginCheckIndex()) return;
            if (LoginCheckIp()) return;

            // if the login was unsuccessful, redirect to the index page for a regular login
            RedirectToIndex();
        }

        /// <summary>
        /// This redirects the client to the index page if the login failed.
        /// </summary>
        private void RedirectToIndex()
        {
            // this redirects to the online version
            string redirectPath = System.Web.Configuration.WebConfigurationManager.AppSettings["index"].ToString();
            if (SpacegameServer.Core.Config.Instance.DebugLogin) { SpacegameServer.Core.Core.Instance.writeToLog("Page_Load() 60 redirectPath " + redirectPath); }
            Response.Redirect(redirectPath);
        }

        /// <summary>
        /// This checks if there is a demo user id in the web.config and registers or logs in an user with that id.
        /// </summary>
        /// <returns>True if the user is logged in, false if not.</returns>
        private bool LoginCheckDemoUser()
        {
            string demoUser = System.Web.Configuration.WebConfigurationManager.AppSettings["demoUser"].ToString();
            if (!Int32.TryParse(demoUser, out int demoUserId)) demoUserId = 0;

            if (demoUserId > 0)
            {
                if (SpacegameServer.Core.Config.Instance.DebugLogin) { SpacegameServer.Core.Core.Instance.writeToLog("Page_Load() 20 demoUserId " + demoUser); }
                return DemoLoginCreate(demoUserId);
            }

            return false;
        }

        /// <summary>
        /// This checks if the session already has a user logged in and redirects them to the game if possible.
        /// </summary>
        /// <returns>True if a user was logged in already, false if not.</returns>
        private bool LoginCheckSession()
        {
            if (Session["user"] != null)
            {
                if (SpacegameServer.Core.Config.Instance.DebugLogin) { SpacegameServer.Core.Core.Instance.writeToLog("Page_Load() 10 Response.Redirect(Galaxy.aspx); "); }
                Response.Redirect("Galaxy.aspx");
                return true;
            }
            return false;
        }

        /// <summary>
        /// This checks if there is an id in a cache object and uses this to login a user.
        /// </summary>
        /// <returns>True if a user is created using the cache, false if not.</returns>
        private bool LoginCheckCache ()
        {
            var CachedIdObj = Application["DemoId"];
            if (CachedIdObj != null)
            {
                Session["user"] = null;
                int CachedId = (int)CachedIdObj;
                return DemoLoginCreate(CachedId);
            }
            return false;
        }

        /// <summary>
        /// This checks if the user is already logged in via the index page. (?)
        /// </summary>
        /// <returns>True if the user is logged in, false if not.</returns>
        private bool LoginCheckIndex ()
        {
            string loginCode = "";
            //check if user is already logged in (via index page - comparison of loginCode and last hour)
            //checks game db
            if (Request.Params["login"] != null)
                loginCode = Request.Params["login"];

            if (SpacegameServer.Core.Config.Instance.DebugLogin) { SpacegameServer.Core.Core.Instance.writeToLog("Page_Load() 30 checkLogin " + loginCode); }
            checkLogin(loginCode);
            if (Session["user"] != null)
            {
                if (SpacegameServer.Core.Config.Instance.DebugLogin) { SpacegameServer.Core.Core.Instance.writeToLog("Page_Load() 40 Redirect "); }
                Response.Redirect("Galaxy.aspx");
                return true;
            }
            return false;
        }

        /// <summary>
        /// This checks if the user is already logged in via ip. (?)
        /// </summary>
        /// <returns>True if the user is logged in, false if not.</returns>
        private bool LoginCheckIp ()
        {
            string loginCode = "";
            //check if ip is part of index, and if registration can take place
            //also just logs in if player is already registered
            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

            int userId = 0;
            if (checkIndexLogin(ref userId, loginCode))
            {
                if (SpacegameServer.Core.Config.Instance.DebugLogin) { SpacegameServer.Core.Core.Instance.writeToLog("Page_Load() 50 userRegisterUser " + userId.ToString() + " |  " + loginCode); }
                if (bc.userRegisterUser(userId))
                {
                    this.SetSession(userId);
                    Response.Redirect("Galaxy.aspx");
                    return true;
                }
            }

            return false;
        }

        /// <summary>
        /// This checks if a user is logged in using the database.
        /// </summary>
        /// <param name="userid">The id of the user to be checked.</param>
        /// <param name="loginCode">Some login code. It is always empty.</param>
        /// <returns></returns>
        private bool checkIndexLogin(ref int userid, string loginCode)
        {
            bool ret = false;
            string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["onlineInSpaceIndexConnectionString"].ToString();
            SqlConnection conn = new SqlConnection(ConnectionString);

            if(!Int32.TryParse(loginCode, out int loginCodeValue)) loginCodeValue = -1;

            try
            {
                // 2. Open the connection
                conn.Open();

                //gets the userid for the ip-address. the ip-address has to have a logged-in date not smaller than an hour ago...
                string query = "[dbo].[UserCheckLoggedIn]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userHostAddress = new SqlParameter();
                userHostAddress.ParameterName = "@UserHostAddress";
                userHostAddress.Value = Request.UserHostAddress;
                cmd.Parameters.Add(userHostAddress);

                SqlParameter code = new SqlParameter("@code", SqlDbType.Int);
                code.Value = loginCodeValue;
                cmd.Parameters.Add(code);

                SqlParameter userIdParameter = new SqlParameter("@userId", SqlDbType.Int);
                userIdParameter.Direction = ParameterDirection.Output;
                userIdParameter.Value = 0;
                cmd.Parameters.Add(userIdParameter);




                cmd.ExecuteNonQuery();

                if (Int32.TryParse(userIdParameter.Value.ToString(), out userid) && userid != 0)
                {
                    ret = true;
                }
                /*
                int id;
                if (Int32.TryParse(param4.Value.ToString(), out id) && id != 0)
                {
                    this.SetSession(id); 
                }*/

                conn.Close();
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            return ret;
        }

        /// <summary>
        /// This returns the clients ip.
        /// </summary>
        /// <returns>The clients ip.</returns>
        public string getIp()
        {
            string clientIP;
            string ip = Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (!string.IsNullOrEmpty(ip))
            {
                string[] ipRange = ip.Trim().Split(',');
                clientIP = ipRange[0];
                //string[] ipRange2 = clientIP.Split(':');
                //clientIP = ipRange2[0];
            }
            else
                clientIP = Request.ServerVariables["REMOTE_ADDR"];


            return clientIP;
        }

        /// <summary>
        /// This checks if the user is logged in using the database.
        /// </summary>
        /// <param name="loginCode">Some login code.</param>
        private void checkLogin(string loginCode)
        {
            SqlConnection conn;
            //string activeConnection = System.Web.Configuration.WebConfigurationManager.AppSettings["activeConnection"].ToString();
            //string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings[activeConnection].ConnectionString;
            string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["onlineInSpaceIndexConnectionString"].ToString();
            conn = new SqlConnection(ConnectionString);

            try
            {
                // 2. Open the connection
                conn.Open();

                if (SpacegameServer.Core.Config.Instance.DebugLogin) { SpacegameServer.Core.Core.Instance.writeToLog("checkLogin() 10 loginCode " + loginCode); }
                if (SpacegameServer.Core.Config.Instance.DebugLogin) { SpacegameServer.Core.Core.Instance.writeToLog("checkLogin() 20 Request.UserHostAddress " + Request.UserHostAddress); }
                if (SpacegameServer.Core.Config.Instance.DebugLogin) { SpacegameServer.Core.Core.Instance.writeToLog("checkLogin() 21 HttpContext.Current.Request.UserHostAddress " + HttpContext.Current.Request.UserHostAddress); }
                // if (SpacegameServer.Core.Config.Instance.DebugLogin) { SpacegameServer.Core.Core.Instance.writeToLog("checkLogin() 22 ip " + ip); }

                if (!Int32.TryParse(loginCode, out int loginCodeValue)) loginCodeValue = -1;

                //gets the userid for the ip-address. the ip-address has to have a logged-in date not smaller than an hour ago...
                string query = "[dbo].[UserCheckLoggedIn]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userHostAddress = new SqlParameter();
                userHostAddress.ParameterName = "@UserHostAddress";
                if (String.IsNullOrEmpty(loginCode))
                {
                    userHostAddress.Value = Request.UserHostAddress;
                }
                else
                {
                    userHostAddress.Value = loginCode;
                }
                cmd.Parameters.Add(userHostAddress);

                SqlParameter userIdParameter = new SqlParameter("@userId", SqlDbType.Int);
                userIdParameter.Direction = ParameterDirection.Output;
                userIdParameter.Value = 0;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter code = new SqlParameter("@code", SqlDbType.Int);
                code.Value = loginCodeValue;
                cmd.Parameters.Add(code);

                cmd.ExecuteNonQuery();

                int userId;
                if (Int32.TryParse(userIdParameter.Value.ToString(), out userId) && userId != 0)
                {
                    this.SetSession(userId);
                }

                conn.Close();
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }
        }

        /// <summary>
        /// This returns the users language.
        /// </summary>
        /// <returns>The users language.</returns>
        public string userLanguage()
        {
            return Request.UserLanguages[0].Substring(0, 2);

        }

        /*
        /// <summary>
        /// Some login test. Is it supposed to be a unit test?
        /// </summary>
        protected void loginTest()
        {
            string demoUser = System.Web.Configuration.WebConfigurationManager.AppSettings["demoUser"].ToString();
            this.SetSession(Int16.Parse(demoUser));

            return;
        }*/


    }

    /// <summary>
    /// A class describing a user.
    /// </summary>
    class Users
    {
        // Currently the user has only one parameter, which makes the class kind of useless.
        public int id;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="_id">The new users id.</param>
        public Users(int _id)
        {
            id = _id;
        }
    }
}