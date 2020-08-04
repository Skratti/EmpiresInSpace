using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


using System.Data;
using System.Data.SqlClient;

namespace EmpiresInSpace.interaction
{
    public partial class Buildings : System.Web.UI.Page
    {
        string userId;
        string colonyId;
        Users currentUser;
        SqlConnection conn;
        string resp;

        protected void Page_Load(object sender, EventArgs e)
        {            

            //check if a user object was saved in the session - array (this is done during login)
            if (Request.Params["action"] == null)
                return;
            string action = Request.Params["action"];

            if (Request.Params["colonyId"] != null)                
                colonyId = Request.Params["colonyId"];

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
                case "build":
                    build();
                    return;
                case "raze":
                    raze();
                    return;
                case "activate":
                    changeActive();
                    return;
                case "produce":
                    build();
                    return;
                case "buildShip":
                    buildShip();
                    return;
                case "cancelBuildShip":
                    cancelBuildShip();
                    return;
                case "launchScout":
                    launchScout();
                    return;
                case "launchDefSat":
                    launchDefSat();
                    return;
                default:
                    return;
            }
        }

        protected void build()
        {
            if (Request.Params["tileNr"] == null)
                return;
            string tileNr = Request.Params["tileNr"];

            if (Request.Params["buildingId"] == null)
                return;
            string buildingId = Request.Params["buildingId"];
            


            /*
            try
            {
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[dbo].[Build]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                

                SqlParameter param1 = new SqlParameter("@userId",SqlDbType.Int);
               // param1.ParameterName = "@userId";
                param1.Value = currentUser.id;
                cmd.Parameters.Add(param1);

                SqlParameter param2 = new SqlParameter();
                param2.ParameterName = "@colonyId";
                param2.Value = colonyId;
                cmd.Parameters.Add(param2);

                SqlParameter param3 = new SqlParameter();
                param3.ParameterName = "@tileNr";
                param3.Value = tileNr;
                cmd.Parameters.Add(param3);

                SqlParameter param4 = new SqlParameter();
                param4.ParameterName = "@buildingId";
                param4.Value =  buildingId;
                cmd.Parameters.Add(param4);
                                    
                SqlParameter param5 = new SqlParameter();
                param5.ParameterName = "@output1";
                param5.Value = 0;
                cmd.Parameters.Add(param5);

                SqlParameter param6 = new SqlParameter("@xml", SqlDbType.Xml);
                param6.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param6);

                //System.Data.SqlClient.SqlParameter test = new SqlParameter("output1",1);
                //cmd.Parameters["output1"] = test;

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

            int userIdI, colonyIdI, tileNrI;
            short buildingIdI;
            if (!Int32.TryParse(userId, out userIdI)) return;
            if (!Int32.TryParse(colonyId, out colonyIdI)) return;
            if (!Int32.TryParse(tileNr, out tileNrI)) return;
            if (!Int16.TryParse(buildingId, out buildingIdI)) return;
            
            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            resp += bc.buildBuilding(userIdI, colonyIdI, tileNrI, buildingIdI); ;        
               


            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        } 

        protected void raze()
        {
            //buildingId is unique id 
            if (Request.Params["buildingId"] == null)
                return;
            string buildingId = Request.Params["buildingId"];           
            /*
            try
            {
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                string query = "[dbo].[RazeBuilding]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param1 = new SqlParameter("@userId", SqlDbType.Int);
                // param1.ParameterName = "@userId";
                param1.Value = currentUser.id;
                cmd.Parameters.Add(param1);

                SqlParameter param4 = new SqlParameter();
                param4.ParameterName = "@buildingId";
                param4.Value = buildingId;
                cmd.Parameters.Add(param4);
                      
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
            int userIdI, colonyIdI, buildingIdI;
            if (!Int32.TryParse(userId, out userIdI)) return;
            if (!Int32.TryParse(colonyId, out colonyIdI)) return;
            if (!Int32.TryParse(buildingId, out buildingIdI)) return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            resp += bc.deconstructBuilding(userIdI, colonyIdI, buildingIdI);

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        } 

        //switch actie state of one building
        protected void changeActive()
        {
            //buildingId is unique id 
            if (Request.Params["buildingId"] == null)
                return;
            string buildingId = Request.Params["buildingId"];

            /*
            try
            {
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                string query = "[dbo].[changeBuildingActive]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param1 = new SqlParameter("@userId", SqlDbType.Int);
                // param1.ParameterName = "@userId";
                param1.Value = currentUser.id;
                cmd.Parameters.Add(param1);

                SqlParameter param4 = new SqlParameter();
                param4.ParameterName = "@buildingId";
                param4.Value = buildingId;
                cmd.Parameters.Add(param4);

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
            int userIdInt;
            if (!Int32.TryParse(userId, out userIdInt)) return;
            int buildingIdInt;
            if (!Int32.TryParse(buildingId, out buildingIdInt)) return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.buildingChangeActive(userIdInt, buildingIdInt);           

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        } // end of colonize()

        protected void buildShip()
        {
            currentUser = (Users)Session["user"];
            int userId = currentUser.id;

            if (Request.Params["colonyId"] == null)
                return;           
            string colonyId = Request.Params["colonyId"];            
            int colonyIdInt;
            Int32.TryParse(colonyId, out colonyIdInt);

            if (Request.Params["shipTemplateId"] == null)
                return;
            string shipTemplateId = Request.Params["shipTemplateId"];
            int shipTemplateIdInt;
            Int32.TryParse(shipTemplateId, out shipTemplateIdInt);

            if (Request.Params["fastBuild"] == null)
                return;
            string fastBuildStr = Request.Params["fastBuild"];
            bool fastBuild;
            Boolean.TryParse(fastBuildStr, out fastBuild);
            
            try
            {         
                /*       
                conn.Open();
                if (fastBuild)
                { 
                    string query = "[dbo].[buildShipFast]";
                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    SqlParameter param = new SqlParameter("@shipTemplateId",SqlDbType.Int);
                    param.Value = shipTemplateIdInt;
                    cmd.Parameters.Add(param);

                    SqlParameter param2 = new SqlParameter("@userId", SqlDbType.Int);
                    param2.Value = userId;
                    cmd.Parameters.Add(param2);

                    SqlParameter param3 = new SqlParameter("@colonyId", SqlDbType.Int);
                    param3.Value = colonyIdInt;
                    cmd.Parameters.Add(param3);               

                    SqlParameter param4 = new SqlParameter();
                    param4.Direction = ParameterDirection.Output;
                    param4.ParameterName = "@output1";
                    param4.Value = 0;
                    cmd.Parameters.Add(param4);

                    SqlParameter param5 = new SqlParameter("@xml", SqlDbType.Xml);
                    param5.Direction = ParameterDirection.Output;
                    cmd.Parameters.Add(param5);

                    cmd.ExecuteNonQuery();
                    resp += param5.Value.ToString();              
                }
                else
                {
                    string query = "[dbo].[buildShip]";
                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    SqlParameter param = new SqlParameter("@shipTemplateId",SqlDbType.Int);
                    param.Value = shipTemplateIdInt;
                    cmd.Parameters.Add(param);

                    SqlParameter param2 = new SqlParameter("@userId", SqlDbType.Int);
                    param2.Value = userId;
                    cmd.Parameters.Add(param2);

                    SqlParameter param3 = new SqlParameter("@colonyId", SqlDbType.Int);
                    param3.Value = colonyIdInt;
                    cmd.Parameters.Add(param3);               

                    SqlParameter param4 = new SqlParameter();
                    param4.Direction = ParameterDirection.Output;
                    param4.ParameterName = "@output1";
                    param4.Value = 0;
                    cmd.Parameters.Add(param4);

                    SqlParameter param5 = new SqlParameter("@xml", SqlDbType.Xml);
                    param5.Direction = ParameterDirection.Output;
                    cmd.Parameters.Add(param5);

                    cmd.ExecuteNonQuery();
                    resp += param5.Value.ToString();              
                    

                }
                
                conn.Close();
                */

                SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
                
                resp += bc.buildShip(shipTemplateIdInt, userId, colonyIdInt, fastBuild);           

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
        } // end of buildShip()


        protected void cancelBuildShip()
        {
            currentUser = (Users)Session["user"];
            int userId = currentUser.id;

            if (Request.Params["colonyId"] == null)
                return;
            string colonyId = Request.Params["colonyId"];
            int colonyIdInt;
            Int32.TryParse(colonyId, out colonyIdInt);           

            try
            {
                conn.Open();

                string query = "[dbo].[cancelBuildShip]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;
                

                SqlParameter param2 = new SqlParameter("@userId", SqlDbType.Int);
                param2.Value = userId;
                cmd.Parameters.Add(param2);

                SqlParameter param3 = new SqlParameter("@colonyId", SqlDbType.Int);
                param3.Value = colonyIdInt;
                cmd.Parameters.Add(param3);

                SqlParameter param4 = new SqlParameter();
                param4.Direction = ParameterDirection.Output;
                param4.ParameterName = "@output1";
                param4.Value = 0;
                cmd.Parameters.Add(param4);

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

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        } // end of cancelBuildShip()


        protected void launchScout()
        {
            currentUser = (Users)Session["user"];
            int userId = currentUser.id;

            if (Request.Params["colonyId"] == null)
                return;
            string colonyId = Request.Params["colonyId"];
            int colonyIdInt;
            Int32.TryParse(colonyId, out colonyIdInt);

            if (Request.Params["surfaceFieldId"] == null)
                return;
            string surfaceFieldId = Request.Params["surfaceFieldId"];
            int surfaceFieldIdInt;
            Int32.TryParse(surfaceFieldId, out surfaceFieldIdInt);

            try
            {
                conn.Open();

                string query = "[dbo].[launchScout]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param = new SqlParameter("@surfaceFieldId", SqlDbType.Int);
                param.Value = surfaceFieldId;
                cmd.Parameters.Add(param); //2666 //2709

                SqlParameter param2 = new SqlParameter("@userId", SqlDbType.Int);
                param2.Value = userId; //2
                cmd.Parameters.Add(param2);

                SqlParameter param3 = new SqlParameter("@colonyId", SqlDbType.Int);
                param3.Value = colonyIdInt;
                cmd.Parameters.Add(param3); //38
                

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

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        } // end of launchScout()

        protected void launchDefSat()
        {
            currentUser = (Users)Session["user"];
            int userId = currentUser.id;

            if (Request.Params["colonyId"] == null)
                return;
            string colonyId = Request.Params["colonyId"];
            int colonyIdInt;
            Int32.TryParse(colonyId, out colonyIdInt);

            if (Request.Params["surfaceFieldId"] == null)
                return;
            string surfaceFieldId = Request.Params["surfaceFieldId"];
            int surfaceFieldIdInt;
            Int32.TryParse(surfaceFieldId, out surfaceFieldIdInt);

            try
            {
                conn.Open();

                string query = "[dbo].[launchDefSat]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param = new SqlParameter("@surfaceFieldId", SqlDbType.Int);
                param.Value = surfaceFieldId;
                cmd.Parameters.Add(param); //2666 //2709

                SqlParameter param2 = new SqlParameter("@userId", SqlDbType.Int);
                param2.Value = userId; //2
                cmd.Parameters.Add(param2);

                SqlParameter param3 = new SqlParameter("@colonyId", SqlDbType.Int);
                param3.Value = colonyIdInt;
                cmd.Parameters.Add(param3); //38


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

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        } // end of launchDefSat()


    }
}