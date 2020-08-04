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
    public partial class initStarMap : System.Web.UI.Page
    {
        string userId;
        Users currentUser;
        SqlConnection conn;
        string resp;

        protected void Page_Load(object sender, EventArgs e)
        {
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
            conn = new SqlConnection(ConnectionString);

            if (Request.Params["systemId"] != null)
            {
                getSystemData();
                return;
            }

            if (Request.Params["planetId"] != null)
            {
                getColonyData();
                return;
            }

            if (Request.Params["colonyId"] != null)
            {
                getColonyData();
                return;
            }

            //resp = "<?xml version='1.0' encoding='utf-8' ?><map>";
            //initGalaxyMap
            resp = "<?xml version='1.0' encoding='utf-8' ?>";
            
            SqlDataReader rdr = null;

            try
            {
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[dbo].[initGalaxyMap]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = userId;
                cmd.Parameters.Add(param1);

                SqlParameter param6 = new SqlParameter("@xml", SqlDbType.Xml);
                param6.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param6);

                cmd.ExecuteNonQuery();
                resp += param6.Value.ToString();

                conn.Close();
                /*
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
                // close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

                // 5. Close the connection
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

        protected void getSystemData()
        {            
            string systemId = Request.Params["systemId"];

            if (systemId == null || systemId == "") return;

            int systemInt;
            if (!Int32.TryParse(systemId, out systemInt)) return;
            /*
            try
            {               
 
                conn.Open();

                string query = "[dbo].[GetSystemFields]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;
                
                SqlParameter param3 = new SqlParameter("@systemId", SqlDbType.Int);
                param3.Value = systemInt;
                cmd.Parameters.Add(param3);                

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
            int userIdInt;
            if (!Int32.TryParse(userId, out userIdInt)) return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            string xml;
            xml = bc.getSystemFields(userIdInt, systemInt);
            resp += xml;

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }

        protected void getPlanetData()
        {           

            if (Request.Params["planetId"] == null)
                return;
            string planetId = Request.Params["planetId"];
            int planetIdInt;
            if (!Int32.TryParse(planetId, out planetIdInt)) return;
           
            int userIdInt;
            if (!Int32.TryParse(userId, out userIdInt)) return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            string xml;
            xml = bc.getPlanetSurfacefields(userIdInt, planetIdInt);
            resp += xml;


            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }
  
        protected void getColonyData()
        {           

            if (Request.Params["colonyId"] == null)
                return;
            string colonyId = Request.Params["colonyId"];
            int colonyIdInt;
            if (!Int32.TryParse(colonyId, out colonyIdInt)) return;
           
            int userIdInt;
            if (!Int32.TryParse(userId, out userIdInt)) return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            string xml;
            xml = bc.getColonySurfacefields(userIdInt, colonyIdInt);
            resp += xml;


            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }

    }
}