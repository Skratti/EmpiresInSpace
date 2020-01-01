using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Data;
using System.Data.SqlClient;
using System.IO;

namespace EmpiresInSpace.data
{
    public partial class Quests : System.Web.UI.Page
    {
        string userId;
        //string colonyId;
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
                case "questRead":
                    questRead();
                    return;  
                case "IntroQuestCompleted":
                    IntroQuestCompleted();
                    return;
                default:
                    return;
            }
        }

        protected void questRead()
        {            

            if (Request.Params["questId"] == null)
                return;
            string questId = Request.Params["questId"];
            int questIdInt;
            if (!Int32.TryParse(questId, out questIdInt))
                return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.setQuestRead(currentUser.id, questIdInt);

            /*
            try
            {
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[quests].[questRead]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = currentUser.id;
                cmd.Parameters.Add(param1);

                SqlParameter param2 = new SqlParameter();
                param2.ParameterName = "@questId";
                param2.Value = questIdInt;
                cmd.Parameters.Add(param2);               

                //cmd.ExecuteNonQuery();                                             

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



        protected void IntroQuestCompleted(){
            if (Request.Params["questId"] == null)
                return;
            string questId = Request.Params["questId"];
            int questIdInt;
            if (!Int32.TryParse(questId, out questIdInt))
                return;


            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            resp += bc.setQuestComplete(currentUser.id, questIdInt);
            
            /*
            try
            {

                

                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[quests].[IntroQuestCompleted]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = currentUser.id;
                cmd.Parameters.Add(param1);

                SqlParameter param2 = new SqlParameter();
                param2.ParameterName = "@questId";
                param2.Value = questIdInt;
                cmd.Parameters.Add(param2);

                SqlParameter param6 = new SqlParameter("@xml", SqlDbType.Xml);
                param6.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param6);

                //cmd.ExecuteNonQuery();
                //resp += param6.Value.ToString();

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
    
    
    }
}