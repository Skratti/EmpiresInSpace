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
    public partial class initShips : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string resp = "<?xml version='1.0' encoding='utf-8' ?>";

            string activeConnection = System.Web.Configuration.WebConfigurationManager.AppSettings["activeConnection"].ToString(); 
            string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings[activeConnection].ConnectionString;

            // 1. Instantiate the connection
            SqlConnection conn = new SqlConnection(ConnectionString);           

            try
            {
                Users currentUser;
                if (Session["user"] == null)
                {
                    string redirectPath = System.Web.Configuration.WebConfigurationManager.AppSettings["index"].ToString(); 
                    Response.Redirect(redirectPath);
                    return;
                }

                currentUser = (Users)Session["user"];


                string userId = currentUser.id.ToString();
                

                // 2. Open the connection
                /*
                conn.Open();
                // 3. Pass the connection to a command object
                
                string query = "[dbo].[initShips]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter shipIdParameter = new SqlParameter();
                shipIdParameter.ParameterName = "@shipId";
                shipIdParameter.Value = DBNull.Value;
                cmd.Parameters.Add(shipIdParameter);

                SqlParameter colonyIdParameter = new SqlParameter();
                colonyIdParameter.ParameterName = "@colonyId";
                colonyIdParameter.Value = DBNull.Value;
                cmd.Parameters.Add(colonyIdParameter);

                SqlParameter param2 = new SqlParameter("@xml", SqlDbType.Xml);
                param2.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param2);

                cmd.ExecuteNonQuery();
                resp += param2.Value.ToString();
                
                conn.Close();
                */
                int userIdInt;
                if(Int32.TryParse(userId,out userIdInt))
                {
                    SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
                    int? shipId = null;
                    resp += bc.getShipData(userIdInt, shipId);                    
                }
            }
            finally
            {                
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";

            Response.Write(resp);
        }
    }
}