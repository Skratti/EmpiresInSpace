using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Data;
using System.Data.SqlClient;
using System.Text.RegularExpressions;

namespace EmpiresInSpace.data
{
    public partial class Alliances : System.Web.UI.Page
    {
        string userId;
        Users currentUser;
        SqlConnection conn;
        string resp;

        protected void Page_Load(object sender, EventArgs e)
        {
            string action = "";
            //check if a user object was saved in the session - array (this is done during login)
            try
            {
                if (Request.Params["action"] == null)
                    return;
                action = Request.Params["action"];
            }
            catch (HttpRequestValidationException ex)
            {
                //todo: this exception may be thrown when the user tags his name / alliancename. it does not have to be an error

                SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
                bc.writeExceptionToLog(ex);
                // Todo:
               
            }


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
                case "createAlliance"   : createAlliance(); return;
                case "joinAlliance"     : joinAlliance();   return;
                case "leaveAlliance"    : leaveAlliance();  return;
                case "inviteToAlliance" : inviteToAlliance(); return;
                case "removeRelation"   : removeRelation(); return;
                case "removeInvitation" : removeInvitation(); return;
                case "setAdvRelation"   : setAdvRelation(); return;
                case "renameAlliance"   : renameAlliance(); return;
                case "GetDetails"       : GetDetails(); return;
                case "changeDescription": changeDescription(); return;
                default:
                    return;
            }    
        }

        protected void createAlliance()
        {
            if (Request.Params["newName"] == null)
                return;
            string newName = Request.Params["newName"];

            newName = Helpers.StripUserHtml(newName);

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            resp += bc.createAlliance(currentUser.id, newName);

            /*
            try
            {
                // 2. Open the connection
                conn.Open();

                string query = "[dbo].[createAlliance]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter newNameParameter = new SqlParameter();
                newNameParameter.ParameterName = "@allianceName";
                newNameParameter.Value = newName;
                cmd.Parameters.Add(newNameParameter);

                SqlParameter param2 = new SqlParameter("@xml", SqlDbType.Xml);
                param2.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param2);

                cmd.ExecuteNonQuery();
                resp += param2.Value.ToString();
                conn.Close();

            }
            finally
            {            
                if (conn != null)
                {
                    conn.Close();
                }
            }
            */
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }

        protected void joinAlliance()
        {

            System.IO.StreamReader reader3 = new System.IO.StreamReader(Request.InputStream);
            string allianceId = reader3.ReadToEnd();
            int allianceIdInt;
            if (!Int32.TryParse(allianceId, out allianceIdInt))
                return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            resp += bc.joinAlliance(currentUser.id, allianceIdInt);

            /*
             * 
            try
            {
                // 2. Open the connection
                conn.Open();

                string query = "[dbo].[joinAlliance]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter allianceIdParam = new SqlParameter();
                allianceIdParam.ParameterName = "@allianceId";
                allianceIdParam.Value = allianceIdInt;
                cmd.Parameters.Add(allianceIdParam);

                SqlParameter param2 = new SqlParameter("@output1", SqlDbType.Int);
                param2.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param2);

                cmd.ExecuteNonQuery();
                resp += param2.Value.ToString();
                conn.Close();

            }
            finally
            {
                if (conn != null)
                {
                    conn.Close();
                }
            }
            */

            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }

        protected void leaveAlliance()
        {

            if (Request.Params["allianceId"] == null)
                return;
            string allianceId = Request.Params["allianceId"];
            int allianceIdInt;
            if (!Int32.TryParse(allianceId, out allianceIdInt))
                return;

            System.IO.StreamReader reader3 = new System.IO.StreamReader(Request.InputStream);
            string userToRemove = reader3.ReadToEnd();            
            int userToRemoveInt;
            if (!Int32.TryParse(userToRemove, out userToRemoveInt))
                return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            resp += bc.leaveAlliance(currentUser.id, userToRemoveInt, allianceIdInt);

            /*
             * 
             * 
            try
            {
                // 2. Open the connection
                conn.Open();

                string query = "[dbo].[leaveAlliance]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter userToRemoveParam = new SqlParameter();
                userToRemoveParam.ParameterName = "@userToRemove";
                userToRemoveParam.Value = userToRemoveInt;
                cmd.Parameters.Add(userToRemoveParam);

                SqlParameter allianceIdParameter = new SqlParameter();
                allianceIdParameter.ParameterName = "@allianceId";
                allianceIdParameter.Value = allianceIdInt;
                cmd.Parameters.Add(allianceIdParameter);


                SqlParameter param2 = new SqlParameter("@output1", SqlDbType.Int);
                param2.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param2);

                cmd.ExecuteNonQuery();
                resp +="<result>" +  param2.Value.ToString() + "</result>";
                conn.Close();

            }
            finally
            {
                if (conn != null)
                {
                    conn.Close();
                }
            }
            */

            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }

        protected void inviteToAlliance()
        {
            System.IO.StreamReader reader3 = new System.IO.StreamReader(Request.InputStream);
            string invitedUser = reader3.ReadToEnd();

            int invitedUserInt;
            if (!Int32.TryParse(invitedUser, out invitedUserInt))
                return;

            if (invitedUserInt == 0) return;



            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.inviteUserToAlliance(currentUser.id, invitedUserInt);

            /*
            try
            {
                // 2. Open the connection
                conn.Open();

                string query = "[dbo].[inviteToAlliance]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter toInviteUserIdParameter = new SqlParameter();
                toInviteUserIdParameter.ParameterName = "@toInviteUserId";
                toInviteUserIdParameter.Value = invitedUserInt;
                cmd.Parameters.Add(toInviteUserIdParameter);

                SqlParameter param2 = new SqlParameter("@output1", SqlDbType.Int);
                param2.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param2);

                cmd.ExecuteNonQuery();
                resp += param2.Value.ToString();
                conn.Close();

            }
            finally
            {
                if (conn != null)
                {
                    conn.Close();
                }
            }
            */


            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }

        protected void removeRelation()
        {
            if (Request.Params["targetAllianceId"] == null)
                return;
            string targetId = Request.Params["targetAllianceId"];
            int targetIdInt;
            if (!Int32.TryParse(targetId, out targetIdInt))
                return;


            
            
            try
            {
                // 2. Open the connection
                conn.Open();

                string query = "[dbo].[removeAllianceRelation]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter targetIdParameter = new SqlParameter();
                targetIdParameter.ParameterName = "@targetAllianceId";
                targetIdParameter.Value = targetIdInt;
                cmd.Parameters.Add(targetIdParameter);

                cmd.ExecuteNonQuery();
                resp += "<ok>1</ok>";
                conn.Close();

            }
            finally
            {
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

        
        protected void removeInvitation()
        {
            System.IO.StreamReader reader3 = new System.IO.StreamReader(Request.InputStream);
            string invitedUser = reader3.ReadToEnd();

            int invitedUserInt;
            if (!Int32.TryParse(invitedUser, out invitedUserInt))
                return;

            if (invitedUserInt == 0) return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.removeInviteToAlliance(currentUser.id, invitedUserInt);


            /*
            try
            {
                // 2. Open the connection
                conn.Open();

                string query = "[dbo].[removeInviteToAlliance]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter toInviteUserIdParameter = new SqlParameter();
                toInviteUserIdParameter.ParameterName = "@toInviteUserId";
                toInviteUserIdParameter.Value = invitedUserInt;
                cmd.Parameters.Add(toInviteUserIdParameter);

                SqlParameter param2 = new SqlParameter("@output1", SqlDbType.Int);
                param2.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param2);

                cmd.ExecuteNonQuery();
                resp += param2.Value.ToString();
                conn.Close();

            }
            finally
            {
                if (conn != null)
                {
                    conn.Close();
                }
            }
            */

            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }

        protected void renameAlliance()
        {
            /*
            if (Request.Params["newName"] == null)
                return;
            string newName = Request.Params["newName"];
            */
            
            System.IO.StreamReader reader3 = new System.IO.StreamReader(Request.InputStream);
            string newName = reader3.ReadToEnd();

            newName = Helpers.StripUserHtml(newName);

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.renameAlliance(currentUser.id, newName);

            /*
            try
            {
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[dbo].[ChangeAllianceName]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = currentUser.id;
                cmd.Parameters.Add(param1);


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

        protected void changeDescription()
        {
            /*
            if (Request.Params["newName"] == null)
                return;
            string newName = Request.Params["newName"];
            */

            System.IO.StreamReader reader3 = new System.IO.StreamReader(Request.InputStream);
            string newName = reader3.ReadToEnd();

            newName = Helpers.StripUserHtml(newName);


            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.changeDescription(currentUser.id, newName);

            /*
            try
            {
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[dbo].[ChangeAllianceDescription]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = currentUser.id;
                cmd.Parameters.Add(param1);


                SqlParameter param3 = new SqlParameter();
                param3.ParameterName = "@newDescriptiom";
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


        protected void GetDetails()
        {
            /*
            <UserDetails>
              <userId>157</userId>
              <description>BlahBlahBlub</description>
              <relation>
                <UserRelation>
                  <Id>186</Id>
                  <State>0</State>
                </UserRelation>
                <UserRelation>
                  <Id>235</Id>
                  <State>2</State>
                </UserRelation>
                <UserRelation>
                  <Id>253</Id>
                  <State>3</State>
                </UserRelation>
              </relation>
            </UserDetails>

            {"userId":157,"description":"BlahBlahBlub","relation":[{"Id":186,"State":0},{"Id":235,"State":2},{"Id":253,"State":3}]}            
            */


            if (Request.Params["allianceId"] == null)
                return;
            string allianceId = Request.Params["allianceId"];
            int allianceIdInt;
            if (!Int32.TryParse(allianceId, out allianceIdInt))
                return;

            try
            {
                SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
                resp = bc.geAllianceDetails(currentUser.id, allianceIdInt);
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }
            /*
            try
            {
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[dbo].[getAlliancesDetails]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter allianceIdParam = new SqlParameter();
                allianceIdParam.ParameterName = "@allianceId";
                allianceIdParam.Value = allianceIdInt;
                cmd.Parameters.Add(allianceIdParam);

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
            */
            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "application/json";
            Response.Write(resp);
        }


        protected void setAdvRelation()
        {
            if (Request.Params["targetRelation"] == null)
                return;            
            string targetRelation = Request.Params["targetRelation"];

            if (Request.Params["targetId"] == null)
                return;
            string targetId = Request.Params["targetId"];
            int targetIdInt;
            if (!Int32.TryParse(targetId, out targetIdInt))
                return;

            if (Request.Params["targetType"] == null)
                return;
            string targetType = Request.Params["targetType"];
            int targetTypeInt;
            if (!Int32.TryParse(targetType, out targetTypeInt))
                return;


           
            int targetRelationInt;
            if (!Int32.TryParse(targetRelation, out targetRelationInt)) return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            resp += bc.trySetRelation(currentUser.id, targetIdInt, 2, targetRelationInt);
            
            /*
            try
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("[dbo].setAllianceRelation", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter targetUserId = new SqlParameter();
                targetUserId.ParameterName = "@targetAllianceId";
                targetUserId.Value = targetIdInt;
                cmd.Parameters.Add(targetUserId);

                SqlParameter relationParameter = new SqlParameter();
                relationParameter.ParameterName = "@preferredNewRelation";
                relationParameter.Value = targetRelation;
                cmd.Parameters.Add(relationParameter);

                System.Xml.XmlReader xmlr = cmd.ExecuteXmlReader();
                xmlr.Read();

                while (xmlr.ReadState != System.Xml.ReadState.EndOfFile)
                {
                    resp += xmlr.ReadOuterXml();
                }

                conn.Close();
            }
            finally
            {
                if (conn != null)
                {
                    conn.Close();
                }
            }
            */

            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp); 
        }
    }
}