using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Data;
using System.Data.SqlClient;

namespace EmpiresInSpace.data
{
    public partial class colonies : System.Web.UI.Page
    {
        string userId;
        Users currentUser;
        SqlConnection conn;
        string resp;

        protected void Page_Load(object sender, EventArgs e)
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
            resp = "<?xml version='1.0' encoding='utf-8' ?>";


            string activeConnection = System.Web.Configuration.WebConfigurationManager.AppSettings["activeConnection"].ToString(); 
            string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings[activeConnection].ConnectionString;

            // 1. Instantiate the connection
            conn = new SqlConnection(ConnectionString);

            switch (action)
            {
                case "getData":
                    getData();
                    return;   
                case "renameColony":
                    renameColony();
                    return;
                case "AbandonColony":
                    AbandonColony();
                    return;
                default:
                    return;
            }     

        }
        protected void getData()
        {
            try
            {
                // 2. Open the connection
                conn.Open();

                string query = "[dbo].[initColonies]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter param2 = new SqlParameter("@xml", SqlDbType.Xml);
                param2.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param2);

                cmd.ExecuteNonQuery();
                resp += param2.Value.ToString();
                conn.Close();
                /*
                resp += param2.Value.ToString();
                System.Xml.XmlReader xmlr = cmd.ExecuteXmlReader();
                xmlr.Read();

                while (xmlr.ReadState != System.Xml.ReadState.EndOfFile)
                {

                    resp += xmlr.ReadOuterXml();

                }

                conn.Close();*/

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
        }

        protected void renameColony()
        {


            if (Request.Params["colonyId"] == null)
                return;
            string colonyId = Request.Params["colonyId"];
            int colonyIdInt;
            if (!Int32.TryParse(colonyId, out colonyIdInt))
                return;


            if (Request.Params["newName"] == null)
                return;
            string newName = Request.Params["newName"];


            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

            bc.colonyRename(Int32.Parse(userId), colonyIdInt, newName);

            /*
            try
            {
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[dbo].[ChangeColonyName]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = currentUser.id;
                cmd.Parameters.Add(param1);

                SqlParameter param2 = new SqlParameter();
                param2.ParameterName = "@colonyId";
                param2.Value = colonyIdInt;
                cmd.Parameters.Add(param2);

                SqlParameter param3 = new SqlParameter();
                param3.ParameterName = "@newName";
                param3.Value = newName;
                cmd.Parameters.Add(param3);

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
            */

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }

        protected void AbandonColony()
        {
            if (Request.Params["colonyId"] == null)
                return;
            string colonyId = Request.Params["colonyId"];
            int colonyIdInt;
            if (!Int32.TryParse(colonyId, out colonyIdInt))
                return;


            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

            resp = bc.AbandonColony(Int32.Parse(userId), colonyIdInt);

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        } 
    }
}