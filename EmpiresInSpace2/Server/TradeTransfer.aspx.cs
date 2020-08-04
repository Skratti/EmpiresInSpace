using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.IO;
using System.Xml;
using System.Data;
using System.Data.SqlClient;
using System.Xml.Linq;

namespace EmpiresInSpace.interaction
{
    public partial class TradeTransfer : System.Web.UI.Page
    {

        string userId;
        Users currentUser;
        SqlConnection conn;
        string resp;
        bool checkOk = true;

        protected void Page_Load(object sender, EventArgs e)
        {
                        
            string action = "";
            try
            {
                if (Request.Params["action"] == null)
                    return;
                action = Request.Params["action"];
            }
            catch (Exception ex)
            {
                string x = ex.Message;
                return;
            }
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
            conn = new SqlConnection(ConnectionString);

            resp = "<?xml version='1.0' encoding='utf-8' ?>";
            switch (action)
            {
                case "transfer":
                    Transfer();
                    return;
                case "transfer2":
                    Transfer2();
                    return;
                case "trade":
                    Trade();
                    return;
                case "trade2":
                    Trade2();
                    return;
                case "deleteTrade":
                    deleteTrade();
                    return;
                case "acceptTrade":
                    acceptTrade();
                    return;
                case "deleteSOTrade":
                    deleteSpaceObjectTrades();
                    return;
                default:
                    return;
            }
   
        }
        public void transferSettingsValidationEventHandler(object sender, System.Xml.Schema.ValidationEventArgs e)
        {
            if (e.Severity == System.Xml.Schema.XmlSeverityType.Warning)
            {
                Console.Write("WARNING: ");
                Console.WriteLine(e.Message);
            }
            else if (e.Severity == System.Xml.Schema.XmlSeverityType.Error)
            {
                checkOk = false;
                Console.Write("ERROR: ");
                Console.WriteLine(e.Message);
            }
        }

        protected void Transfer()
        {
            StreamReader reader3 = new StreamReader(Request.InputStream);            
            string transferXML = reader3.ReadToEnd();
            checkOk = true;
            //string transferXML = Request.InputStream;
            
            try
            {
                StringReader textReader = new StringReader(transferXML);
                XmlReaderSettings settings = new XmlReaderSettings();

                string x = Request.PhysicalPath;
                x = x.Substring(0, x.Length - "TradeTransfer.aspx".Length);
                x = x + "transfer.xsd";
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

            if (checkOk == false) return;
            
                        
            XElement xmlIn = XElement.Parse(transferXML);            
            //XElement user = new XElement("user", userId);
            //xmlIn.Element("sender").Add(user);

            /*
            try
            {
                conn.Open();

                string query = "[dbo].[transferGoods]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter xmlParameter = new SqlParameter();
                xmlParameter.ParameterName = "@xmlData";
                xmlParameter.Value = transferXML;
                cmd.Parameters.Add(xmlParameter);

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
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }
            */
            int userIdI;
            if (!Int32.TryParse(userId, out userIdI)) return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            resp += bc.transfer(userIdI, transferXML);

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);

        }

        protected void Transfer2()
        {
            //{"Sender":2,"Target":5,"SenderType":1,"TargetType":2,"Goods":[{"Id":1,"Qty":5},{"Id":3,"Qty":15},{"Id":2015,"Qty":6}]}
            //{"Sender":27,"SenderType":2,"Target":89,"TargetType":1,"Goods":[{"Id":1,"Qty":-10},{"Id":5,"Qty":10},{"Id":10,"Qty":-10}]}

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            string transferXML;
            try
            {
                StreamReader reader3 = new StreamReader(Request.InputStream);
                transferXML = reader3.ReadToEnd();
            }
            catch (Exception e)
            {
                bc.Log(e.ToString());
                return;
            }

            System.Web.Script.Serialization.JavaScriptSerializer ser = new System.Web.Script.Serialization.JavaScriptSerializer();
            

            SpacegameServer.Core.Transfer records;
            try
            {
                records = ser.Deserialize<SpacegameServer.Core.Transfer>(transferXML);
            }
            catch (Exception e)
            {
                bc.Log(e.ToString());               
                return;
            }
           
            int userIdI;
            if (!Int32.TryParse(userId, out userIdI)) return;


            resp += bc.transfer2(userIdI, records);

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);

        }
        protected void Trade()
        {
            /*
            StringReader textReader = new StringReader("ccc");
            XmlReaderSettings settings = new XmlReaderSettings();
            settings.XmlResolver = null;
            settings.MaxCharactersInDocument = 10000;

            // Successfully parse the file, otherwise an XmlException is to be thrown
            XmlReader reader = XmlReader.Create(textReader, settings);
            while (reader.Read()) ;
            */
            //string x =  $_POST["value"];
            string text = Request.Form["value"];
            
            text = Request.QueryString["value"];

            StreamReader reader3 = new StreamReader(Request.InputStream);           
            string transferXML = reader3.ReadToEnd();

            checkOk = true;
            //string transferXML = Request.InputStream;

            //ToDO: check xml vs xsd



            XElement xmlIn = XElement.Parse(transferXML);
            //XElement user = new XElement("user", userId);
            //xmlIn.Element("sender").Add(user);

            if (Request.Params["commNodeId"] == null)
                return;
            string commNodeIdId = Request.Params["commNodeId"];
            int commNodeIdInt;
            if (!Int32.TryParse(commNodeIdId, out commNodeIdInt))
                return;    


            try
            {
                conn.Open();

                string query = "[dbo].[createTradeOffer]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter commNodeIdParameter = new SqlParameter();
                commNodeIdParameter.ParameterName = "@commNodeId";
                commNodeIdParameter.Value = commNodeIdInt;
                cmd.Parameters.Add(commNodeIdParameter);
                 
                SqlParameter xmlParameter = new SqlParameter();
                xmlParameter.ParameterName = "@xmlData";
                xmlParameter.Value = transferXML;
                cmd.Parameters.Add(xmlParameter);

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

        protected void Trade2()
        {
            

            Response.Clear();
            Response.Expires = -1;
        }

        protected void acceptTrade()
        {                
            //XElement user = new XElement("user", userId);
            //xmlIn.Element("sender").Add(user);

            if (Request.Params["tradeId"] == null)
                return;
            string tradeOfferId = Request.Params["tradeId"];
            int tradeOfferIdInt;
            if (!Int32.TryParse(tradeOfferId, out tradeOfferIdInt))
                return;  

            if (Request.Params["soId"] == null)
                return;
            string soIdId = Request.Params["soId"];
            int soIdIdInt;
            if (!Int32.TryParse(soIdId, out soIdIdInt))
                return;  

            if (Request.Params["soType"] == null)
                return;
            string soType = Request.Params["soType"];
            int soTypeInt;
            if (!Int32.TryParse(soType, out soTypeInt))
                return;

            if (Request.Params["receiverId"] == null)
                return;
            string receiverIdStr = Request.Params["receiverId"];
            int receiverId;
            if (!Int32.TryParse(receiverIdStr, out receiverId))
                return;

            if (Request.Params["receiverType"] == null)
                return;
            string receiverTypeStr = Request.Params["receiverType"];
            int receiverType;
            if (!Int32.TryParse(receiverTypeStr, out receiverType))
                return;
            /*
            try
            {
                conn.Open();
            
                string query = "[dbo].[acceptTradeOffer]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter accepterSpaceObjectIdParameter = new SqlParameter();
                accepterSpaceObjectIdParameter.ParameterName = "@accepterSpaceObjectId";
                accepterSpaceObjectIdParameter.Value = soIdIdInt;
                cmd.Parameters.Add(accepterSpaceObjectIdParameter);

                SqlParameter objectTypeIdParameter = new SqlParameter();
                objectTypeIdParameter.ParameterName = "@objectType";
                objectTypeIdParameter.Value = soTypeInt;
                cmd.Parameters.Add(objectTypeIdParameter);

                SqlParameter tradeOfferIdParameter = new SqlParameter();
                tradeOfferIdParameter.ParameterName = "@tradeOfferId";
                tradeOfferIdParameter.Value = tradeOfferIdInt;
                cmd.Parameters.Add(tradeOfferIdParameter);

                SqlParameter param6 = new SqlParameter("@retValue", SqlDbType.Int);
                param6.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param6);

                cmd.ExecuteNonQuery();
                resp = param6.Value.ToString();

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
            resp = bc.acceptTrade(userIdInt, soIdIdInt, soTypeInt, tradeOfferIdInt, receiverId, receiverType);


            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text";
            Response.Write(resp);

        }


        protected void deleteTrade()
        {

            if (Request.Params["tradeOfferId"] == null)
                return;
            string tradeOfferId = Request.Params["tradeOfferId"];
            int tradeOfferIdInt;
            if (!Int32.TryParse(tradeOfferId, out tradeOfferIdInt))
                return;


            try
            {
                conn.Open();

                string query = "[dbo].[deleteTradeOffer]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter commNodeIdParameter = new SqlParameter();
                commNodeIdParameter.ParameterName = "@tradeOfferId";
                commNodeIdParameter.Value = tradeOfferIdInt;
                cmd.Parameters.Add(commNodeIdParameter);
               
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

        protected void deleteSpaceObjectTrades()
        {

            if (Request.Params["objectId"] == null)
                return;
            string objectId = Request.Params["objectId"];
            int objectIdInt;
            if (!Int32.TryParse(objectId, out objectIdInt))
                return;

            if (Request.Params["objectType"] == null)
                return;
            string objectType = Request.Params["objectType"];
            int objectTypeInt;
            if (!Int32.TryParse(objectType, out objectTypeInt))
                return;

            try
            {
                conn.Open();

                string query = "[dbo].[deleteTradeOffersOfObject]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter userIdParameter = new SqlParameter();
                userIdParameter.ParameterName = "@userId";
                userIdParameter.Value = userId;
                cmd.Parameters.Add(userIdParameter);

                SqlParameter objectIdParameter = new SqlParameter();
                objectIdParameter.ParameterName = "@objectId";
                objectIdParameter.Value = objectIdInt;
                cmd.Parameters.Add(objectIdParameter);

                SqlParameter objectTypeParameter = new SqlParameter();
                objectTypeParameter.ParameterName = "@objectType";
                objectTypeParameter.Value = objectTypeInt;
                cmd.Parameters.Add(objectTypeParameter);

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
    }

    
}