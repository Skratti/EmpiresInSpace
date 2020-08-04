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
    public partial class User : System.Web.UI.Page
    {        
        string userId;
        Users currentUser;
        SqlConnection conn;
        string resp;

        protected void Page_Load(object sender, EventArgs e)
        {
            string action = "";
            
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
            }

            //check if a user object was saved in the session - array (this is done during login)
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
                case "getData":                 getData();                  return;
                case "getDetails":              getDetails();               return;
                case "setRaster":               setRaster();                return;
                case "setCoordinates":          setCoordinates();           return;
                case "setSystemNames":          setSystemNames();           return;
                case "setColonyNames":          setColonyNames();           return;
                case "setShipNames":            setShipNames();             return;
                case "setColonyOwners":         setColonyOwners();          return;
                case "setShipOwners":           setShipOwners();            return;
                case "setShipMovement":         setShipMovement();          return;
                case "logout":                  logOut();                   return;
                case "demoLogout":              demoLogOut();               return;
                case "renameUser":              renameUser();               return;
                case "ChangeProfileUrl":        ChangeProfileUrl();         return;
                case "getLanguage":             getLanguage();              return;
                case "changeBrightness":        changeBrightness();         return;
                case "setLanguage":             setLanguage();              return;
                case "setRelation":             setRelation();              return;
                case "removeRelation":          removeRelation();           return;
                case "checkNewContact":         checkNewContact();          return;
                case "newTurn":                 newTurn();                  return;
                case "newTurnByUser":           newTurnByUser();            return;
                case "getTradeOffers":          getTradeOffers();           return;
                case "saveFog":                 saveFog();                  return;
                case "getFog":                  getFog();                   return;
                case "changeDescription":       changeDescription();        return;
                case "SetDemoId":               SetDemoId();                return;
                case "SetstartingRegionInput":  SetstartingRegionInput();   return;
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
                
                SqlCommand cmd = new SqlCommand("[dbo].getUserData" , conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter param2 = new SqlParameter("@xml", SqlDbType.Xml);
                param2.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param2);

                string sqlResponse = "<user></user>";

                SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
                string coreUserData = bc.getUserData(currentUser.id);
                sqlResponse = sqlResponse.Insert(6, coreUserData);

                resp += sqlResponse;


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


        protected void getDetails()
        {
            if (Request.Params["targetUserId"] == null)
                return;
            string targetUserId = Request.Params["targetUserId"];

            int targetUseInt;
            Int32.TryParse(targetUserId, out targetUseInt);

            try
            {

                SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
                resp = bc.getUserDetails(currentUser.id, targetUseInt);

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
            Response.ContentType = "application/json";
            Response.Write(resp);
        }


        protected void getLanguage()
        {


            try
            {


                if (Request.Params["languageId"] == null)
                    return;
                string languageId = Request.Params["languageId"];

                int languageIdInt;
                Int32.TryParse(languageId, out languageIdInt);

                var  Labels = SpacegameServer.BC.XMLGroups.Labels.GetLabels(languageIdInt);

                string x = "";
                SpacegameServer.BC.BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.Labels>(Labels, ref x, true);
                resp += x;
            }
            catch(Exception x)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(x);
            }

            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }

        protected void sendLastObjectData()
        {
            if (Request.Params["lastObjectType"] == null)
                return;
            string lastObjectType = Request.Params["lastObjectType"];

            if (Request.Params["lastObjectId"] == null)
                return;
            string lastObjectId = Request.Params["lastObjectId"];

            int lastObjectTypeInt;
            int lastObjectIdInt;
            if (!Int32.TryParse(lastObjectType, out lastObjectTypeInt)) return;
            if (!Int32.TryParse(lastObjectId, out lastObjectIdInt)) return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.sendLastObjectDataAndLogout(currentUser.id, lastObjectTypeInt, lastObjectIdInt);

            
            try
            {
                conn.Open();

                /*
                SqlCommand cmd = new SqlCommand("update Users set player_ip = null , lastSelectedObjectType = @objType, lastSelectedObjectId = @objId  where id = @userId", conn);

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter objTypeParameter = new SqlParameter("@objType", SqlDbType.Int);
                //objTypeParameter.ParameterName = "@objType";
                objTypeParameter.Value = lastObjectTypeInt;
                cmd.Parameters.Add(objTypeParameter);

                SqlParameter objIdParameter = new SqlParameter("@objId", SqlDbType.Int);
                //objIdParameter.ParameterName = "@objId";
                objIdParameter.Value = lastObjectIdInt;
                cmd.Parameters.Add(objIdParameter);


                cmd.ExecuteReader();

                */

                string query = "[dbo].[userLogout]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;               

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter objTypeParameter = new SqlParameter("@lastSelectedObjectType", SqlDbType.Int);
                //objTypeParameter.ParameterName = "@objType";
                objTypeParameter.Value = lastObjectTypeInt;
                cmd.Parameters.Add(objTypeParameter);

                SqlParameter objIdParameter = new SqlParameter("@lastSelectedObjectId", SqlDbType.Int);
                //objIdParameter.ParameterName = "@objId";
                objIdParameter.Value = lastObjectIdInt;
                cmd.Parameters.Add(objIdParameter);
               
                cmd.ExecuteNonQuery();                        
                conn.Close();
            }
            finally
            {
                if (conn != null)
                {
                    conn.Close();
                }
            }
        }

        protected void logOut()
        {
            sendLastObjectData();

            //TOTO:TEST
            //remove user_ip from index - user will autologin if he has a cookie for that....
            string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["onlineInSpaceIndexConnectionString"].ToString();
            SqlConnection conn = new SqlConnection(ConnectionString);
            try
            {
                // 2. Open the connection
                conn.Open();

                //gets the userid for the ip-address. the ip-address has to have a logged-in date not smaller than an hour ago...
                string query = "[dbo].[logout]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param4 = new SqlParameter("@userId", SqlDbType.Int);
                //param4.Direction = ParameterDirection.Output;
                param4.Value = 0;
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


            SpacegameServer.Core.Core.Instance.writeToLog("Logout Set Session Null " + Session["user"].ToString());          

            Session["user"] = null;
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/html";
            
            string resp = "logout";
            Response.Write(resp);

            string redirectPath = System.Web.Configuration.WebConfigurationManager.AppSettings["index"].ToString(); 
            Response.Redirect(redirectPath);
            return;
        }

        //demo user may decide  not to delete player ip, so that the player can return...
        protected void demoLogOut()
        {
            //may not be called, else the playerIp is set to null and a reload won't load the user created this session (a new user would be generated instead)
            //sendLastObjectData();

            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/html";        

            string redirectPath = System.Web.Configuration.WebConfigurationManager.AppSettings["index"].ToString();
            Response.Redirect(redirectPath);
            return;
        }

        protected void setRaster()
        {            
            if (Request.Params["value"] == null)
                return;
            string action = Request.Params["value"];

            bool newValue;
            newValue = action == "true" ? true : false;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.setRaster(currentUser.id, newValue);
           
            /*
            try
            {  
                
                conn.Open();
               
                string query = "[dbo].[userRaster]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter rasterValueParameter = new SqlParameter();
                rasterValueParameter.ParameterName = "@newValue";
                rasterValueParameter.Value = newValue;
                cmd.Parameters.Add(rasterValueParameter);            

                cmd.ExecuteNonQuery();
                conn.Close();
                
            }
            finally
            {                
                if (conn != null)
                {
                    conn.Close();
                }
            }          
             * */

            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";           
        }

        protected void setCoordinates()
        {
            if (Request.Params["value"] == null)
                return;
            string action = Request.Params["value"];

            bool newValue;
            newValue = action == "true" ? true : false;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.setCoordinates(currentUser.id, newValue);
           
            /*
            try
            {
                conn.Open();
                string query = "[dbo].[userCoordinates]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter rasterValueParameter = new SqlParameter();
                rasterValueParameter.ParameterName = "@newValue";
                rasterValueParameter.Value = newValue;
                cmd.Parameters.Add(rasterValueParameter);

                cmd.ExecuteNonQuery();
                conn.Close();

            }
            finally
            {
                if (conn != null)
                {
                    conn.Close();
                }
            }
             * */
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
        }

        protected void setSystemNames()
        {
            if (Request.Params["value"] == null)
                return;
            string action = Request.Params["value"];

            bool newValue;
            newValue = action == "true" ? true : false;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.setSystemNames(currentUser.id, newValue);
           
            /*
            try
            {
                conn.Open();
                string query = "[dbo].[userSystemnames]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter rasterValueParameter = new SqlParameter();
                rasterValueParameter.ParameterName = "@newValue";
                rasterValueParameter.Value = newValue;
                cmd.Parameters.Add(rasterValueParameter);

                cmd.ExecuteNonQuery();
                conn.Close();

            }
            finally
            {
                if (conn != null)
                {
                    conn.Close();
                }
            }
             * */
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
        }

        protected void setColonyNames()
        {
            if (Request.Params["value"] == null)
                return;
            string action = Request.Params["value"];

            bool newValue;
            newValue = action == "true" ? true : false;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.setColonyNames(currentUser.id, newValue);
           
            /*
            try
            {
                conn.Open();
                string query = "[dbo].[userColonyNames]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter rasterValueParameter = new SqlParameter();
                rasterValueParameter.ParameterName = "@newValue";
                rasterValueParameter.Value = newValue;
                cmd.Parameters.Add(rasterValueParameter);

                cmd.ExecuteNonQuery();
                conn.Close();

            }
            finally
            {
                if (conn != null)
                {
                    conn.Close();
                }
            }
             * */
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";

        }

        protected void setColonyOwners()
        {
            if (Request.Params["value"] == null)
                return;
            string action = Request.Params["value"];

            bool newValue;
            newValue = action == "true" ? true : false;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.setColonyOwners(currentUser.id, newValue);
           
            /*
            try
            {
                conn.Open();
                string query = "[dbo].[userColonyOwners]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter rasterValueParameter = new SqlParameter();
                rasterValueParameter.ParameterName = "@newValue";
                rasterValueParameter.Value = newValue;
                cmd.Parameters.Add(rasterValueParameter);

                cmd.ExecuteNonQuery();
                conn.Close();

            }
            finally
            {
                if (conn != null)
                {
                    conn.Close();
                }
            }
             * */
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";

        }

        protected void setShipNames()
        {
            if (Request.Params["value"] == null)
                return;
            string action = Request.Params["value"];

            bool newValue;
            newValue = action == "true" ? true : false;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.setShipNames(currentUser.id, newValue);
           
            /*

            try
            {
                conn.Open();
                string query = "[dbo].[userShipNames]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter rasterValueParameter = new SqlParameter();
                rasterValueParameter.ParameterName = "@newValue";
                rasterValueParameter.Value = newValue;
                cmd.Parameters.Add(rasterValueParameter);

                cmd.ExecuteNonQuery();
                conn.Close();

            }
            finally
            {
                if (conn != null)
                {
                    conn.Close();
                }
            }
             * */
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";

        }

        protected void setShipOwners()
        {
            if (Request.Params["value"] == null)
                return;
            string action = Request.Params["value"];

            bool newValue;
            newValue = action == "true" ? true : false;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.setShipOwners(currentUser.id, newValue);
           
            /*
            try
            {
                conn.Open();
                string query = "[dbo].[userShipOwners]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter rasterValueParameter = new SqlParameter();
                rasterValueParameter.ParameterName = "@newValue";
                rasterValueParameter.Value = newValue;
                cmd.Parameters.Add(rasterValueParameter);

                cmd.ExecuteNonQuery();
                conn.Close();

            }
            finally
            {
                if (conn != null)
                {
                    conn.Close();
                }
            }
             * */
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";

        }


        protected void setLanguage()
        {
            if (Request.Params["value"] == null)
                return;
            string newLanguage = Request.Params["value"];            


           
            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.setLanguage(currentUser.id, newLanguage);
           
            /*
             * 
            try
            {
                conn.Open();
                string query = "[dbo].[userLanguage]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter rasterValueParameter = new SqlParameter();
                rasterValueParameter.ParameterName = "@newValue";
                rasterValueParameter.Value = newLanguage;
                cmd.Parameters.Add(rasterValueParameter);

                cmd.ExecuteNonQuery();
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
        }

        protected void setRelation()
        {
            if (Request.Params["targetUser"] == null)
                return;
            if (Request.Params["targetRelation"] == null)
                return;
            string targetUser = Request.Params["targetUser"];
            string targetRelation = Request.Params["targetRelation"];


            int targetUserId;
            int targetRelationInt;
            if (!Int32.TryParse(targetUser, out targetUserId)) return;
            if (!Int32.TryParse(targetRelation, out targetRelationInt)) return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            resp += bc.trySetRelation(currentUser.id, targetUserId, 1, targetRelationInt);
            /*
            try
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("[dbo].[setRelation]", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter targetUserId = new SqlParameter();
                targetUserId.ParameterName = "@targetUserId";
                targetUserId.Value = targetUser;
                cmd.Parameters.Add(targetUserId);
   
                SqlParameter relationParameter = new SqlParameter();
                relationParameter.ParameterName = "@targetRelation";
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


        //setAdvRelation
        protected void setAdvRelation()
        {
            if (Request.Params["targetUser"] == null)
                return;
            if (Request.Params["targetRelation"] == null)
                return;
            string targetUser = Request.Params["targetUser"];
            string targetRelation = Request.Params["targetRelation"];

            try
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("[dbo].setAdvRelation", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter targetUserId = new SqlParameter();
                targetUserId.ParameterName = "@targetUserId";
                targetUserId.Value = targetUser;
                cmd.Parameters.Add(targetUserId);

                SqlParameter relationParameter = new SqlParameter();
                relationParameter.ParameterName = "@targetRelation";
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

            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";


            Response.Write(resp);
        }

        protected void removeRelation()
        {
            if (Request.Params["targetUser"] == null)
                return;
            
            string targetUser = Request.Params["targetUser"];
          

            try
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("[dbo].removeRelation", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter targetUserId = new SqlParameter();
                targetUserId.ParameterName = "@targetUserId";
                targetUserId.Value = targetUser;
                cmd.Parameters.Add(targetUserId);

                cmd.ExecuteNonQuery();              

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

        protected void checkNewContact()
        {
            if (Request.Params["targetUserId"] == null)
                return;
            /*if (Request.Params["targetShipId"] == null)
                return;
            if (Request.Params["targetColonyId"] == null)
                return;
            if (Request.Params["userShipId"] == null)
                return;
            if (Request.Params["userColonyId"] == null)
                return;
            */
            string targetUser = Request.Params["targetUserId"];
            /*string targetShip = Request.Params["targetShipId"];
            string targetColony = Request.Params["targetColonyId"];
            string userShip = Request.Params["userShipId"];
            string userColony = Request.Params["userColonyId"];
            */
            int targetUserInt;
            /*  int targetShipInt;
                int targetColonyInt;
                int userShipInt;
                int userColonyInt;
            */
              Int32.TryParse(targetUser, out targetUserInt);
             /* Int32.TryParse(targetShip, out targetShipInt);
              Int32.TryParse(targetColony, out targetColonyInt);
              Int32.TryParse(userShip, out userShipInt);
              Int32.TryParse(userColony, out userColonyInt);
              */
            int userIdInt;
            Int32.TryParse(userId, out userIdInt);
            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            string xml;
            bc.checkuserContact(userIdInt, targetUserInt, out xml);
            resp += xml;

            
            
            /*
            try
            {
                // 2. Open the connection
                conn.Open();
               
                SqlCommand cmd = new SqlCommand("[dbo].checkUserContact", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter targetUserId = new SqlParameter("@targetUserId", SqlDbType.Int);
                targetUserId.Value = targetUserInt;
                cmd.Parameters.Add(targetUserId);


                SqlParameter targetShipId = new SqlParameter("@targetShipId", SqlDbType.Int);
                targetShipId.Value = targetShipInt;
                cmd.Parameters.Add(targetShipId);

                SqlParameter targetColonyId = new SqlParameter("@targetColonyId", SqlDbType.Int);
                targetColonyId.Value = targetColonyInt;
                cmd.Parameters.Add(targetColonyId);

                SqlParameter userShipId = new SqlParameter("@userShipId", SqlDbType.Int);
                userShipId.Value = userShipInt;
                cmd.Parameters.Add(userShipId);

                SqlParameter userColonyId = new SqlParameter("@userColonyId", SqlDbType.Int);
                userColonyId.Value = userColonyInt;
                cmd.Parameters.Add(userColonyId);

                SqlParameter result = new SqlParameter("@result", SqlDbType.Int);
                result.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(result);

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
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }
        


        //switches between async and sync shipmovement
        protected void setShipMovement()
        {
            if (Request.Params["value"] == null)
                return;
            string action = Request.Params["value"];

            bool newValue;
            newValue = action == "true" ? true : false;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.setShipMovement(currentUser.id, newValue);
           
            /*
            try
            {
                conn.Open();
                string query = "[dbo].[userShipMovement]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter rasterValueParameter = new SqlParameter();
                rasterValueParameter.ParameterName = "@newValue";
                rasterValueParameter.Value = newValue;
                cmd.Parameters.Add(rasterValueParameter);

                cmd.ExecuteNonQuery();
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
            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            //Response.Write(resp);
        }
        protected void renameUser()
        {
            System.IO.StreamReader reader3 = new System.IO.StreamReader(Request.InputStream);
            string newName = reader3.ReadToEnd();

            newName = Helpers.StripUserHtml(newName);

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.renameUser(currentUser.id, newName);
            
            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }

        protected void ChangeProfileUrl()
        {
            System.IO.StreamReader reader3 = new System.IO.StreamReader(Request.InputStream);
            string NewUrl = reader3.ReadToEnd();

            NewUrl = Helpers.StripUserHtml(NewUrl);
            if (String.IsNullOrEmpty(NewUrl)) NewUrl = @"images/interface/defaultprofile.png";
            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.ChangeProfileUrl(currentUser.id, NewUrl);

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }

        protected void changeBrightness()
        {

            if (Request.Params["newBrightness"] == null)
                return;
            string newBrightness = Request.Params["newBrightness"];
            int newBrightInt; 
            if (!Int32.TryParse(newBrightness, out newBrightInt)) return;

            newBrightInt = Math.Min(newBrightInt, 100);
            newBrightInt = Math.Max(newBrightInt, 0);

            byte newValue = (byte)newBrightInt;
           
            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.changeBrightness(currentUser.id, newValue);
           
            /*
             * 
            try
            {
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[dbo].[ChangeBrightness]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = currentUser.id;
                cmd.Parameters.Add(param1);
               

                SqlParameter param3 = new SqlParameter();
                param3.ParameterName = "@newBrightness";
                param3.Value = newBrightInt;
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
        
        protected void newTurn()
        {
            try
            {
                // 2. Open the connection
                conn.Open();

                
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[dbo].[newTurn]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param6 = new SqlParameter("@nextTurn", SqlDbType.Int);
                param6.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param6);

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

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }

        protected void newTurnByUser()
        {
            string demoUser = System.Web.Configuration.WebConfigurationManager.AppSettings["demoUser"].ToString();

            if (demoUser != "0")
            {
                try
                {
                    // 2. Open the connection
                    /*conn.Open();
                    // 3. Pass the connection to a command object
                    //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                    string query = "[dbo].[newTurnByUser]";
                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    SqlParameter userIdParameter = new SqlParameter();
                    userIdParameter.ParameterName = "@userId";
                    userIdParameter.Value = userId;
                    cmd.Parameters.Add(userIdParameter);

                    cmd.ExecuteNonQuery();

                    conn.Close();
                    */
                    SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
                    bc.userNewTurn(currentUser.id);
                    
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
            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }

        protected void getTradeOffers()
        {

            /*
            <TradeOffers>
              <TradeOffer>
                <tradeOfferId>803</tradeOfferId>
                <commNodeId>166</commNodeId>
                <spaceObjectId>104</spaceObjectId>
                <spaceObjectType>0</spaceObjectType>
                <userId>0</userId>
                <offered>
                  <goodsId>1</goodsId>
                  <amount>100</amount>
                </offered>
                <offered>
                  <goodsId>10</goodsId>
                  <amount>30</amount>
                </offered>
                <requested>
                  <goodsId>61</goodsId>
                  <amount>5</amount>
                </requested>
              </TradeOffer>
              <TradeOffer>
                <tradeOfferId>804</tradeOfferId>
                <commNodeId>166</commNodeId>
                <spaceObjectId>104</spaceObjectId>
                <spaceObjectType>0</spaceObjectType>
                <userId>0</userId>
                <offered>
                  <goodsId>1</goodsId>
                  <amount>100</amount>
                </offered>
                <offered>
                  <goodsId>10</goodsId>
                  <amount>30</amount>
                </offered>
                <requested>
                  <goodsId>61</goodsId>
                  <amount>5</amount>
                </requested>
              </TradeOffer>
            </TradeOffers> 
              
             * */


            /*
            <TradeOffers>
              <TradeOffer>
                <TradeOffer>
                  <offered>
                    <TradeOfferGood>
                      <tradeoffersid>1</tradeoffersid>
                      <goodsid>1</goodsid>
                      <amount>100</amount>
                      <offer>true</offer>
                    </TradeOfferGood>
                    <TradeOfferGood>
                      <tradeoffersid>1</tradeoffersid>
                      <goodsid>10</goodsid>
                      <amount>30</amount>
                      <offer>true</offer>
                    </TradeOfferGood>
                  </offered>
                  <requested>
                    <TradeOfferGood>
                      <tradeoffersid>1</tradeoffersid>
                      <goodsid>61</goodsid>
                      <amount>5</amount>
                      <offer>false</offer>
                    </TradeOfferGood>
                  </requested>
                  <tradeOfferId>1</tradeOfferId>
                  <commNodeId>86</commNodeId>
                  <spaceObjectId>5</spaceObjectId>
                  <spaceObjectType>0</spaceObjectType>
                  <userId>0</userId>
                </TradeOffer>
              </TradeOffer>
            </TradeOffers> 
             
             * */


            /*
            try
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("[dbo].getTradeData", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter param6 = new SqlParameter("@xml", SqlDbType.Xml);
                param6.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param6);

                cmd.ExecuteNonQuery();
                resp += param6.Value.ToString();

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

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            string Trades = bc.GetTradeOffers();
            resp = Trades;  

            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";


            Response.Write(resp);
        }

        static public int newTurnServer()
        {
            SqlConnection conn;
            string activeConnection = System.Web.Configuration.WebConfigurationManager.AppSettings["activeConnection"].ToString();
            string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings[activeConnection].ConnectionString;            
            conn = new SqlConnection(ConnectionString);

            int retValue;

            try
            {
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[dbo].[newTurn]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param6 = new SqlParameter("@secondsUntilNextTurn", SqlDbType.Int);
                param6.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param6);

                cmd.ExecuteNonQuery();
                retValue = (int)param6.Value;
                /*
                if (!Int32.TryParse((string)param6.Value,out retValue))
                    retValue = 10000;*/

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
            return retValue;
        }

        protected void saveFog()
        {
            if (Request.Params["fogVersion"] == null)
                return;
            string fogVersionStr = Request.Params["fogVersion"];

            int fogVersion;
            if (!Int32.TryParse(fogVersionStr, out fogVersion))
                return;

            System.IO.StreamReader reader3 = new System.IO.StreamReader(Request.InputStream);
            string fog = reader3.ReadToEnd();


            try
            {                  
                SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
                bc.saveFogString(currentUser.id, fog, fogVersion);
                    
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

        protected void getFog()
        {

            try
            {
                SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
                string coreUserData = bc.getFogString(currentUser.id);
                resp = coreUserData;  
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
            
            //Response.ContentType = "text/xml";
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
            bc.changeUserDescription(currentUser.id, newName);


            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }

        protected void SetDemoId()
        {
            /*
            if (Request.Params["newName"] == null)
                return;
            string newName = Request.Params["newName"];
            */

            System.IO.StreamReader reader3 = new System.IO.StreamReader(Request.InputStream);
            string NewIdString = reader3.ReadToEnd();

            int NewId;
            if (!Int32.TryParse(NewIdString, out NewId)) return;

            //Check that a user with this ID exists:
            //if (!SpacegameServer.Core.Core.Instance.users.ContainsKey(NewId)) return;

            Application["DemoId"] = NewId;
            
            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }

        protected void SetstartingRegionInput()
        {
            /*
            if (Request.Params["newName"] == null)
                return;
            string newName = Request.Params["newName"];
            */

            System.IO.StreamReader reader3 = new System.IO.StreamReader(Request.InputStream);
            string StartingRegion = reader3.ReadToEnd();

          

            //Check that a user with this ID exists:
            //if (!SpacegameServer.Core.Core.Instance.users.ContainsKey(NewId)) return;

            Application["StartingRegion"] = StartingRegion;

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        }

    }


}

