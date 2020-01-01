using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Threading.Tasks;

namespace EmpiresInSpace.data
{
    public partial class ServerEvents : System.Web.UI.Page
    {
        string userId;        
        Users currentUser;
        SqlConnection conn;
        string resp;

        protected void Page_Load(object sender, EventArgs e)
        {
            RegisterAsyncTask(new PageAsyncTask(WorkerAsync));
        }

        public async Task WorkerAsync()
        {
            //check if a user object was saved in the session - array (this is done during login)
            if (Request.Params["action"] == null)
                return;
            string action = Request.Params["action"];

            if (Session["user"] == null)
            {
                string redirectPath = System.Web.Configuration.WebConfigurationManager.AppSettings["index"].ToString();
                Response.Redirect(redirectPath);
                return;
            }
            currentUser = (Users)Session["user"];
            userId = currentUser.id.ToString();
            //resp = "<?xml version='1.0' encoding='utf-8' ?>";
            resp = "";


            string activeConnection = System.Web.Configuration.WebConfigurationManager.AppSettings["activeConnection"].ToString();
            string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings[activeConnection].ConnectionString;

            // 1. Instantiate the connection
            conn = new SqlConnection(ConnectionString);

            switch (action)
            {
                case "getEvents":
                    await getEventsAsync();
                    return;
                default:
                    return;
            }
        }
        
        public async Task getEventsAsync()
        {
            if (Request.Params["fromNr"] == null)
                return;
            string fromNr = Request.Params["fromNr"];


            try
            {
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object                
                string query = "[dbo].[getServerEventsXml]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = currentUser.id;
                cmd.Parameters.Add(param1);

                SqlParameter param2 = new SqlParameter();
                param2.ParameterName = "@fromNr";
                param2.Value = fromNr;
                cmd.Parameters.Add(param2);

                /*
                System.Xml.XmlReader xmlr = cmd.ExecuteXmlReader();
                xmlr.Read();
                conn.Close();
                
               
                //Session["lastMessageId"] = lastMessageId;

                while (xmlr.ReadState != System.Xml.ReadState.EndOfFile)
                {
                    resp += xmlr.ReadOuterXml();
                }
                */

                SqlParameter param6 = new SqlParameter("@xml", SqlDbType.Xml);
                param6.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param6);

                cmd.CommandTimeout = 80;
                await cmd.ExecuteNonQueryAsync();
                resp += param6.Value.ToString();


                if (String.IsNullOrEmpty(resp))
                {
                    resp = "<ServerEvents><lastEventId>" + fromNr + "</lastEventId></ServerEvents>";
                }
                resp = "<?xml version='1.0' encoding='utf-8' ?>" + resp;

            }
            catch (System.Data.SqlClient.SqlException ex)
            {
                SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
                bc.writeExceptionToLog(ex);
                resp = "<ServerEvents><lastEventId>" + fromNr + "</lastEventId></ServerEvents>";
                resp = "<?xml version='1.0' encoding='utf-8' ?>" + resp;
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        } //end of getEvents
    }//end of class
}