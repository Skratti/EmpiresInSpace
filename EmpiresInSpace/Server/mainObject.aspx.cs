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
    public partial class mainObject : System.Web.UI.Page
    {
        string userId;
        Users currentUser;
        SqlConnection conn;
        

        protected void Page_Load(object sender, EventArgs e)
        {
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
            


            string activeConnection = System.Web.Configuration.WebConfigurationManager.AppSettings["activeConnection"].ToString(); 
            string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings[activeConnection].ConnectionString;

            // 1. Instantiate the connection
            conn = new SqlConnection(ConnectionString);

            switch (action)
            {
                case "getGameData":
                    getGameData();
                    return;                
                default:
                    return;
            }
        }

        protected void getGameData()
        {
            string resp;
            resp = "<?xml version='1.0' encoding='utf-8' ?>";
            /*
                    try
                    {
                        // 2. Open the connection
                        conn.Open();
                
                        string query = "[dbo].[getGameData]";
                        SqlCommand cmd = new SqlCommand(query, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        SqlParameter param5 = new SqlParameter("@xml", SqlDbType.Xml);
                        param5.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(param5);

                        cmd.ExecuteNonQuery();
                        resp += param5.Value.ToString();

                
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

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            string gameData = bc.getGameData();
            resp += gameData;
            

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }

    }
}