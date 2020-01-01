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
    public partial class Research : System.Web.UI.Page
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
                case "setResearch":
                    setResearch();
                    return;
                case "setSpecializations": 
                    setSpecializations(); 
                    return;
                case "getShipModuleData":
                    getShipModuleData();
                    return;
                case "setColonyModuleProduction":
                    setColonyModuleProduction();
                    return;
                case "doColonyModuleProduction":
                    doColonyModuleProduction();
                    return;
                case "SetColonyBuildOrder":
                    SetColonyBuildOrder();
                    return;
                default:
                    return;
            }
        }

        protected void setResearch()
        {
            if (Request.Params["researchId"] == null)
                return;
            string researchId = Request.Params["researchId"];
            int researchIdInt;
            if (!Int32.TryParse(researchId, out researchIdInt))
                return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

            resp += bc.doResearch(currentUser.id, researchIdInt);
            
            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);

        }

        protected void setSpecializations()
        {
            if (Request.Params["Spec"] == null)
                return;
            string SpecStr = Request.Params["Spec"];

            if (Request.Params["Researchs"] == null)
                return;
            string ResearchsStr = Request.Params["Researchs"];

            string[] researchs = ResearchsStr.Split(';');
            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            resp += bc.ChooseSpecialization(currentUser.id, researchs);

            //return the result (Response)
            Response.Clear();
            Response.StatusCode = 200;
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }
        //

        protected void getShipModuleData()
        {
            try
            {
                // 2. Open the connection
                conn.Open();

                SqlCommand cmd = new SqlCommand("[dbo].[GetUserShipModuleData]", conn);
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

        protected void setColonyModuleProduction()
        {
            if (Request.Params["colonyId"] == null)
                return;
            string colonyId = Request.Params["colonyId"];
            int colonyIdInt;
            if (!Int32.TryParse(colonyId, out colonyIdInt))
                return;

            if (Request.Params["moduleId"] == null)
                return;
            string moduleId = Request.Params["moduleId"];
            int moduleIdInt;
            if (!Int32.TryParse(moduleId, out moduleIdInt))
                return;

            if (Request.Params["amount"] == null)
                return;
            string amount = Request.Params["amount"];
            int amountInt;
            if (!Int32.TryParse(amount, out amountInt))
                return;
            try
            {
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[dbo].[SetColonyShipModuleProduction]";
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
                param3.ParameterName = "@moduleId";
                param3.Value = moduleIdInt;
                cmd.Parameters.Add(param3);

                SqlParameter param4 = new SqlParameter();
                param4.ParameterName = "@amount";
                param4.Value = amountInt;
                cmd.Parameters.Add(param4);

                SqlParameter param6 = new SqlParameter("@xml", SqlDbType.Xml);
                param6.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param6);

                cmd.ExecuteNonQuery();
                resp += param6.Value.ToString();

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

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);

        }

        protected void doColonyModuleProduction()
        {
            if (Request.Params["colonyId"] == null)
                return;
            string colonyId = Request.Params["colonyId"];
            int colonyIdInt;
            if (!Int32.TryParse(colonyId, out colonyIdInt))
                return;
            /*
            try
            {
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[dbo].[doColonyShipModuleProduction]";
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

                SqlParameter param6 = new SqlParameter("@xml", SqlDbType.Xml);
                param6.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param6);

                cmd.ExecuteNonQuery();
                resp += param6.Value.ToString();

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

            int userIdInt = 0;
            Int32.TryParse(userId, out userIdInt);
            resp = bc.buildModules(userIdInt, colonyIdInt);


            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);

        }

        protected void SetColonyBuildOrder()
        {
            if (Request.Params["colonyId"] == null)
                return;
            string colonyId = Request.Params["colonyId"];
            int colonyIdInt;
            if (!Int32.TryParse(colonyId, out colonyIdInt))
                return;

            if (Request.Params["Id"] == null)
                return;
            string moduleId = Request.Params["Id"];
            int moduleIdInt;
            if (!Int32.TryParse(moduleId, out moduleIdInt))
                return;

            if (Request.Params["newOrderNo"] == null)
                return;
            string amount = Request.Params["newOrderNo"];
            int amountInt;
            if (!Int32.TryParse(amount, out amountInt))
                return;
            try
            {
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[dbo].[SetColonyBuildOrder]";
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
                param3.ParameterName = "@Id";
                param3.Value = moduleIdInt;
                cmd.Parameters.Add(param3);

                SqlParameter param4 = new SqlParameter();
                param4.ParameterName = "@newOrderNo";
                param4.Value = amountInt;
                cmd.Parameters.Add(param4);

                SqlParameter param6 = new SqlParameter("@xml", SqlDbType.Xml);
                param6.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param6);

                cmd.ExecuteNonQuery();
                resp += param6.Value.ToString();

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

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);

        }
    }
}