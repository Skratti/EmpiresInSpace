using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace EmpiresInSpace.Server
{
    public partial class _60turns : System.Web.UI.Page
    {

        private const int numberOfTurns = 4;

        private const string DummyCacheItemKey = "Cache60Turns";
        //This holds a reference to the method to call back
        private System.Web.Caching.CacheItemRemovedCallback OnRemove = null;


        protected void Page_Load(object sender, EventArgs e)
        {
            int? turnCounter;
            turnCounter = Application.Get("turnCounter") as Nullable<Int32>;
            OnRemove += new System.Web.Caching.CacheItemRemovedCallback(myCacheItemRemovedCallback);

            if (!turnCounter.HasValue)
            {
                turnCounter = 0;
                Application.Set("turnCounter", turnCounter);
                RegisterCacheEntry(60);

                EmpiresInSpace.Server._60turns.newTurnServer();
            }       


        }

        private bool RegisterCacheEntry(int secondsUntilNextTurn)
        {
            //if( null != HttpContext.Current.Cache[ DummyCacheItemKey ] ) return false;
            if (secondsUntilNextTurn > 60 * 60 * 24 * 10) return false;

            Cache.Add(DummyCacheItemKey, "Test", null,
                System.Web.Caching.Cache.NoAbsoluteExpiration, TimeSpan.FromSeconds(secondsUntilNextTurn),
                System.Web.Caching.CacheItemPriority.Normal,
                OnRemove);

            return true;
        }

        public void myCacheItemRemovedCallback(string key,
            object value, System.Web.Caching.CacheItemRemovedReason reason)
        {
            int? turnCounter;
            turnCounter = Application.Get("turnCounter") as Nullable<Int32>;

            if (turnCounter.HasValue && turnCounter < numberOfTurns)
            {
                RegisterCacheEntry(60);
            }
            else
            {
                Application.Set("turnCounter", null);
            }


            EmpiresInSpace.Server._60turns.newTurnServer();//Server.MapPath("~/pathdata.txt"));
           
            turnCounter = turnCounter + 1;
            Application.Set("turnCounter", turnCounter);
        }

        static public void newTurnServer()
        {
            SqlConnection conn;
            string activeConnection = System.Web.Configuration.WebConfigurationManager.AppSettings["activeConnection"].ToString();
            string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings[activeConnection].ConnectionString;
            conn = new SqlConnection(ConnectionString);

            

            try
            {

                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[dbo].[newTurnWorker]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;
               
                cmd.ExecuteNonQuery();               

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


    }
}