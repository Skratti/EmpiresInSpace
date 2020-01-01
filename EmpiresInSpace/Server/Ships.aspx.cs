using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Xml;

namespace EmpiresInSpace.interaction
{
    public partial class Ships : System.Web.UI.Page
    {
        string userId;
        Users currentUser;
        SqlConnection conn;
        string resp;

        bool xmlCheckOk = true;

        protected void Page_Load(object sender, EventArgs e)
        {
            string shipId = Request.QueryString["shipId"];
            string direction = Request.QueryString["direction"];
            string colonize = Request.QueryString["colonize"];
           
            string action = "";
            try
            {   
                if (Request.Params["action"] == null)
                return;
                action = Request.Params["action"];
            }
            catch (HttpRequestValidationException ex)
            {
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
                case "move":
                    moveShip(shipId, direction);
                    return;
                case "colonize":
                    shipColonize(shipId);
                    return;
                case "createSpaceStation":
                    shipCreateSpaceStation(shipId);
                    return;
                case "transcensionAdd":
                    transcensionAdd(shipId);
                    return;                    
                case "checkCommNode":
                    checkShipAtCommNode(shipId);
                    return;
                case "renameShip":
                    renameShip();
                    return;
                case "sendShipTemplate":
                    sendShipTemplate();
                    return;
                case "sendShipRefit":
                    sendShipRefit();
                    return;
                case "SendShipRepair":
                    SendShipRepair(shipId);
                    return;
                case "deleteShipTemplate":
                    deleteShipTemplate();
                    return;
                case "selfDestruct":
                    selfDestruct();
                    return;

                case "Besiege":
                    Besiege();
                    return;
                default:
                    return;
            }                        
        }

        protected void moveShip(string shipId, string direction)
        {
            try
            {
                
                //http://www.csharp-station.com/Tutorials/AdoDotNet/Lesson07.aspx
                currentUser = (Users)Session["user"];
                string userId = currentUser.id.ToString();


                /*
              
                 */

                // 2. Open the connection



                SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

                int shipInt = 0;
                Int32.TryParse(shipId, out shipInt);
                byte directionInt = 0;
                byte.TryParse(direction, out directionInt);

                string attackedShipIdStr = Request.QueryString["attackedShipId"];
                int attackedShipId = 0;
                int.TryParse(attackedShipIdStr, out attackedShipId);

                //resp = bc.moveShip(shipInt, directionInt, currentUser.id, 1);

                var IdList = shipId.Split(';').ToList();
                List<int> FleetIds = new List<int>();
                foreach(var idString in IdList)
                {
                    int FleetShipId = 0;
                    Int32.TryParse(idString, out FleetShipId);

                    if (FleetShipId != 0) FleetIds.Add(FleetShipId);
                }

                //resp = bc.moveShip2(shipInt, directionInt, currentUser.id, 1, attackedShipId);
                resp = bc.MoveFleet(FleetIds, directionInt, currentUser.id, 1, attackedShipId);

                //System.Data.SqlClient.SqlParameter test = new SqlParameter("output1",1);
                //cmd.Parameters["output1"] = test;
                
                /*
                System.Xml.XmlReader xmlr = cmd.ExecuteXmlReader();
                xmlr.Read();
                              
                while (xmlr.ReadState != System.Xml.ReadState.EndOfFile)
                {
                    resp += xmlr.ReadOuterXml();
                }
                */

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
        } // end of move()

        protected void checkShipAtCommNode(string shipId)
        {
            currentUser = (Users)Session["user"];
            string userId = currentUser.id.ToString();

            int checkCommNodeInt = 0;
            if (Request.Params["commNodeId"] != null)
            {
                if (!Int32.TryParse(Request.Params["commNodeId"], out checkCommNodeInt)) return;
            }
            int shipIdInt;
            if (!Int32.TryParse(shipId, out shipIdInt)) return;
            

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            resp += bc.checkShipAtCommNode(currentUser.id, shipIdInt, checkCommNodeInt);


            /*
            try
           {

                //http://www.csharp-station.com/Tutorials/AdoDotNet/Lesson07.aspx
                

                                
                
                 

                // 2. Open the connection
                conn.Open();

                string query = "[dbo].[checkShipAtCommNode]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                
                SqlParameter param2 = new SqlParameter();
                param2.ParameterName = "@userId";
                param2.Value = currentUser.id;
                cmd.Parameters.Add(param2);

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@shipId";
                param.Value = shipId;
                cmd.Parameters.Add(param);

                SqlParameter checkCommNodeParam = new SqlParameter("@comNodeId", SqlDbType.Int);
                //checkCommNode.ParameterName = ";
                checkCommNodeParam.Value = checkCommNodeInt;
                cmd.Parameters.Add(checkCommNodeParam);                               

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


            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        } // end of move()

        protected void shipColonize(string shipId)
        {
            if (Request.Params["newName"] == null)
                return;
            string newName = Request.Params["newName"];

            try
            {                                              
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[dbo].[TestColonizing]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@shipId";
                param.Value = shipId;
                cmd.Parameters.Add(param);

                SqlParameter param2 = new SqlParameter();
                param2.ParameterName = "@userId";
                param2.Value = userId;
                cmd.Parameters.Add(param2);

                SqlParameter param3 = new SqlParameter();
                param3.ParameterName = "@newname";
                param3.Value = newName;
                cmd.Parameters.Add(param3);



                
                SqlParameter param4 = new SqlParameter();
                param4.ParameterName = "@output1";
                param4.Value = 0;
                cmd.Parameters.Add(param4);

                SqlParameter param5 = new SqlParameter("@xml", SqlDbType.Xml);
                param5.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param5);


                //cmd.ExecuteNonQuery();
                //resp += param5.Value.ToString();



                SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

                int shipInt = 0;
                Int32.TryParse(shipId, out shipInt);
                int userInt = 0;
                Int32.TryParse(userId, out userInt);                
                // bc.colonize(shipInt, userInt, newName, ref resultXML);
                // resp += resultXML;
                resp = bc.colonize(shipInt, userInt, newName);
                /*
                System.Xml.XmlReader xmlr = cmd.ExecuteXmlReader();
                xmlr.Read();

                while (xmlr.ReadState != System.Xml.ReadState.EndOfFile)
                {
                    resp += xmlr.ReadOuterXml();
                }
                */

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
        } // end of colonize()

        protected void shipCreateSpaceStation(string shipId)
        {          
            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

            int shipInt = 0;
            Int32.TryParse(shipId, out shipInt);
            int userInt = 0;
            Int32.TryParse(userId, out userInt);

            resp = bc.createSpaceStation(shipInt, userInt);
              
            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        } // end of colonize()

        protected void transcensionAdd(string shipId)
        {
            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

            int shipInt = 0;
            Int32.TryParse(shipId, out shipInt);
            int userInt = 0;
            Int32.TryParse(userId, out userInt);

            resp = bc.transcensionAdd(shipInt, userInt);

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        } // end of colonize()

        protected void renameShip()
        {

            /*
            if (Request.Params["shipId"] == null)
                return;
            string shipId = Request.Params["shipId"];
            int shipIdInt;
            if (!Int32.TryParse(shipId, out shipIdInt))
                return;


            if (Request.Params["newName"] == null)
                return;
            string newName = Request.Params["newName"];

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

            resp += bc.shipRename(shipIdInt, currentUser.id, newName);
            */

            if (Request.Params["shipId"] == null)
                return;
            string shipId = Request.Params["shipId"];
            int shipIdInt;
            if (!Int32.TryParse(shipId, out shipIdInt))
                return;

            System.IO.StreamReader reader3 = new System.IO.StreamReader(Request.InputStream);
            string newName = reader3.ReadToEnd();

            newName = Helpers.StripUserHtml(newName);

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.shipRename(shipIdInt, currentUser.id, newName);

            /*
            try
            {
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[dbo].[ChangeShipName]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = currentUser.id;
                cmd.Parameters.Add(param1);

                SqlParameter param2 = new SqlParameter();
                param2.ParameterName = "@shipId";
                param2.Value = shipIdInt;
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

        protected void transferSettingsValidationEventHandler(object sender, System.Xml.Schema.ValidationEventArgs e)
        {
            if (e.Severity == System.Xml.Schema.XmlSeverityType.Warning)
            {
                Console.Write("WARNING: ");
                Console.WriteLine(e.Message);
            }
            else if (e.Severity == System.Xml.Schema.XmlSeverityType.Error)
            {
                xmlCheckOk = false;
                Console.Write("ERROR: ");
                Console.WriteLine(e.Message);
            }
        }

        //same as trade: TradeTransfer.aspx
        protected  void sendShipTemplate()
        {
            StreamReader reader3 = new StreamReader(Request.InputStream);            
            string transferXML = reader3.ReadToEnd();
            xmlCheckOk = true;
            //string transferXML = Request.InputStream;
            
            try
            {
                StringReader textReader = new StringReader(transferXML);
                XmlReaderSettings settings = new XmlReaderSettings();

                string x = Request.PhysicalPath;
                x = x.Substring(0, x.Length - "Ships.aspx".Length);
                x = x + "ShipTemplate.xsd";
                settings.Schemas.Add(null, x );
                settings.XmlResolver = null;
                settings.MaxCharactersInDocument = 10000;
                settings.ValidationType = ValidationType.Schema;
                settings.ValidationEventHandler += new System.Xml.Schema.ValidationEventHandler(transferSettingsValidationEventHandler);
                // Successfully parse the file, otherwise an XmlException is to be thrown
                XmlReader reader = XmlReader.Create(textReader, settings);
                try
                {
                    //just check it
                    while (reader.Read()) ;
                }
                finally
                {
                    reader.Close();
                }
            }
            catch(Exception e)
            {
                Console.WriteLine("Exception source: {0}", e.Source);
                return;
            }

            if (xmlCheckOk == false) return;
                                                  
            /*
            try
            {
                conn.Open();

               
                SqlCommand cmd = new SqlCommand("[dbo].[CreateUpdateShipTemplate]", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter xmlParameter = new SqlParameter();
                xmlParameter.ParameterName = "@xmlData";
                xmlParameter.Value = transferXML;
                cmd.Parameters.Add(xmlParameter);

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

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            resp = bc.templateCreateUpdate(currentUser.id, transferXML);


            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);

        }

        protected  void sendShipRefit()
        {
            StreamReader reader3 = new StreamReader(Request.InputStream);            
            string transferXML = reader3.ReadToEnd();
            xmlCheckOk = true;
            //string transferXML = Request.InputStream;
            
            try
            {
                StringReader textReader = new StringReader(transferXML);
                XmlReaderSettings settings = new XmlReaderSettings();

                string x = Request.PhysicalPath;
                x = x.Substring(0, x.Length - "Ships.aspx".Length);
                x = x + "ShipRefit.xsd";
                settings.Schemas.Add(null, x );
                settings.XmlResolver = null;
                settings.MaxCharactersInDocument = 10000;
                settings.ValidationType = ValidationType.Schema;
                settings.ValidationEventHandler += new System.Xml.Schema.ValidationEventHandler(transferSettingsValidationEventHandler);
                // Successfully parse the file, otherwise an XmlException is to be thrown
                XmlReader reader = XmlReader.Create(textReader, settings);
                try
                {
                    //just check it
                    while (reader.Read()) ;
                }
                finally
                {
                    reader.Close();
                }
            }
            catch(Exception e)
            {
                Console.WriteLine("Exception source: {0}", e.Source);
                return;
            }

            if (xmlCheckOk == false) return;


            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

            resp = bc.shipRefit(currentUser.id, transferXML);

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);

        }

        protected void SendShipRepair(string shipId)
        {
            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

            int shipInt = 0;
            Int32.TryParse(shipId, out shipInt);
            int userInt = 0;
            Int32.TryParse(userId, out userInt);

            resp = bc.ShipRepair(shipInt, userInt);

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        } // end of colonize()


        protected void deleteShipTemplate()
        {

            if (Request.Params["templateId"] == null)
                return;
            string templateId = Request.Params["templateId"];
            int templateIdInt;
            if (!Int32.TryParse(templateId, out templateIdInt))
                return;                   
            
            /*
            try
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("[dbo].[deleteShipTemplate]", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter templateIdParameter = new SqlParameter("templateId", SqlDbType.Int);
                templateIdParameter.Value = templateIdInt;
                cmd.Parameters.Add(templateIdParameter);                

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

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.templateDelete(currentUser.id, templateIdInt);

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);

        }

        protected void selfDestruct()
        {

            if (Request.Params["shipId"] == null)
                return;
            string shipId = Request.Params["shipId"];
            int shipIdInt;
            if (!Int32.TryParse(shipId, out shipIdInt))
                return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

            resp += bc.shipSelfdestruct(currentUser.id, shipIdInt);

            /*
            try
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("[dbo].[selfDestruct]", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter templateIdParameter = new SqlParameter("shipId", SqlDbType.Int);
                templateIdParameter.Value = shipIdInt;
                cmd.Parameters.Add(templateIdParameter);

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

        protected void Besiege()
        {

            if (Request.Params["shipId"] == null)
                return;
            string shipId = Request.Params["shipId"];
            int shipIdInt;
            if (!Int32.TryParse(shipId, out shipIdInt))
                return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

            bc.Besiege(currentUser.id, shipIdInt);

           
            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);

        }

    }
}