using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Text.RegularExpressions;

namespace EmpiresInSpace.interaction
{
    public partial class Messages : System.Web.UI.Page
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
                case "getReceivedMessages":
                    getReceivedmessages();
                    return;    
                case "getMessageText":
                    getMessagesText();
                    return;
                case "sendMessage":
                    sendMessage();
                    return;
                case "sendCommMessage":
                    sendCommMessage();
                    return;
                case "setMessageRead":
                    setMessageRead();
                    return;
                case "getCommMessages":
                    getCommMessages();
                    return;
                case "commNodeNameChange":
                    commNodeNameChange();                                    
                    return;
                case "informWhenNew":
                    setInformWhenNew();
                    return;
                case "getCombatMessages":
                    getCombatMessages();
                    return;
                case   "getCombatMessageRounds":
                    getCombatMessageRounds();
                    return;
                case "restart":
                    sendServerRestart();
                    return;
                default:
                    return;
            }
        }

        protected void sendServerRestart()
        {
       
            Microsoft.AspNet.SignalR.IHubContext _context = Microsoft.AspNet.SignalR.GlobalHost.ConnectionManager.GetHubContext<SpaceHub>();
            _context.Clients.All.ServerRestart();
        }

        protected void getReceivedmessages()
        {
            if (Request.Params["fromNr"] == null)
                return;
            string fromNr = Request.Params["fromNr"];

            if (Request.Params["toNr"] == null)
                return;
            string toNr = Request.Params["toNr"];

            
            if (Request.Params["messageHighestId"] == null)
                return;
            string messageHighestId = Request.Params["messageHighestId"];
            int x;
            int y;
            int z;
            if (!Int32.TryParse(fromNr, out x) || !Int32.TryParse(toNr, out y) || !Int32.TryParse(messageHighestId, out z))
                return;

            if (Request.Params["messageType"] == null)
                return;
            string messageType = Request.Params["messageType"];
            int messageTypeInt;
            if (!Int32.TryParse(messageType, out messageTypeInt))
                return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

            resp += bc.getReceivedMessages(currentUser.id, x, y, z, messageTypeInt);
            
    
            Response.Clear();
            Response.StatusCode = 200;
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
            return;
        }

        protected void getMessagesText()
        {
            if (Request.Params["messageId"] == null)
                return;
            string messageId = Request.Params["messageId"];

            int messageIdInt = 0;
            if (Int32.TryParse(messageId, out messageIdInt))
            {

                SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

                resp += bc.getMessagesText(currentUser.id, messageIdInt);
            }

            Response.Clear();
            Response.StatusCode = 200;
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
            return;

        } 

        protected void sendMessage()
        {
            if (Request.Params["messageReceiver"] == null)
                return;
            string receiverId = Request.Params["messageReceiver"];

            string messageHeader = "";
            if (Request.Params["messageHeader"] != null)
            {
                messageHeader = Request.Params["messageHeader"];
            }

            string messageId = null;
            if (Request.Params["messageId"] != null)
            {
                messageId = Request.Params["messageId"];
            }

            string participants = "";
            if (Request.Params["participants"] != null)
            {
                participants = Request.Params["participants"];
            }

            //a new message has to have participants
            if ((messageId == null || messageId == "0") && participants == "") return;

            List<int> participantsList = new List<int>();
            if (participants.Length > 0)
            {
                participantsList.AddRange(participants.Split(';').Select(int.Parse).ToList());
            }

            StreamReader reader3 = new StreamReader(Request.InputStream);
            string messageContent = reader3.ReadToEnd();

            messageContent = Server.HtmlEncode(messageContent);
            messageContent = messageContent.Replace("\r\n", "<br />")
               .Replace(Environment.NewLine, "<br />")
               .Replace("\n", "<br />");


            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

            int messageIdInt = -1;
            Int32.TryParse(messageId, out messageIdInt);


            resp += bc.sendMessage(currentUser.id, messageHeader, messageContent,
                messageIdInt,
                10,
                participantsList
                );
            

            Response.Clear();
            Response.StatusCode = 200;
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
            return;
        }


        protected void setMessageRead()
        {
            if (Request.Params["messageType"] == null)
                return;
            string messageTypeS = Request.Params["messageType"];

            int messageTypeI;
            if (!Int32.TryParse(messageTypeS, out messageTypeI)) return;



            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            bc.setAllMessageRead(currentUser.id, messageTypeI);




         

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);

        } // end of getReceivedmessages()
        //CommNodes::
        protected void getCommMessages()
        {
            if (Request.Params["commNode"] == null)
                return;
            string commNode = Request.Params["commNode"];


            if (Request.Params["fromNr"] == null)
                return;
            string fromNr = Request.Params["fromNr"];

            if (Request.Params["toNr"] == null)
                return;
            string toNr = Request.Params["toNr"];


            if (Request.Params["messageHighestId"] == null)
                return;
            string messageHighestId = Request.Params["messageHighestId"];
            int x;
            if (!Int32.TryParse(fromNr, out x) || !Int32.TryParse(toNr, out x) || !Int32.TryParse(messageHighestId, out x) || !Int32.TryParse(commNode, out x) )
                return;

            
            /*
            int lastMessageId = 0;

            if (Session["messageHighestId"] != null)
            {
                lastMessageId = (int)Session["messageHighestId"];                                        
            }
            */

            /*
            try
            {
                // 2. Open the connection
                conn.Open();
                // 3. Pass the connection to a command object
                //BUG//string query = "exec [dbo].[Movement] @shipId ,@currentUserSession, @direction,@duration,@output";
                string query = "[dbo].[getCommunicationMessage]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = currentUser.id;
                cmd.Parameters.Add(param1);

                SqlParameter param1_2 = new SqlParameter();
                param1_2.ParameterName = "@commNodeId";
                param1_2.Value = commNode;
                cmd.Parameters.Add(param1_2);

                SqlParameter param2 = new SqlParameter();
                param2.ParameterName = "@fromNr";
                param2.Value = fromNr;
                cmd.Parameters.Add(param2);

                SqlParameter param3 = new SqlParameter();
                param3.ParameterName = "@toNr";
                param3.Value = toNr;
                cmd.Parameters.Add(param3);

                SqlParameter param5 = new SqlParameter();
                param5.ParameterName = "@lastMessageId";
                if (messageHighestId != "0")
                    param5.Value = messageHighestId;
                else
                    param5.Value = DBNull.Value;                
                cmd.Parameters.Add(param5);

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

            resp += bc.getCommNodeMessage(currentUser.id, Int32.Parse(commNode), Int32.Parse(fromNr), Int32.Parse(toNr));

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        } // end of 


        protected void commNodeNameChange()
        {
            if (Request.Params["commNode"] == null)
                return;
            string commNode = Request.Params["commNode"];

            int x;
            if (!Int32.TryParse(commNode, out x))
                return;

            /*
            string newName = "";
            if (Request.Params["newName"] != null)
            {
                newName = Request.Params["newName"];
            }
            */

            System.IO.StreamReader reader3 = new System.IO.StreamReader(Request.InputStream);
            string newName = reader3.ReadToEnd();

            String AcceptableTags = "i|b|u|sup|sub|h4|h5|span|div|a|img|font";
            String WhiteListPattern = "</?(?(?=" + AcceptableTags + ")notag|[a-zA-Z0-9]+)(?:\\s[a-zA-Z0-9\\-]+=?(?:([\"']?).*?\\1?)?)*\\s*/?>";
            newName = Regex.Replace(newName, WhiteListPattern, "", RegexOptions.Compiled);

            string fName = Regex.Replace(newName, @"<[^>]*>", String.Empty);
            fName = fName.Substring(0, Math.Min(fName.Length, 30));

            try
            {
                conn.Open();

                string query = "[dbo].[communicationNodeNameChange]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = currentUser.id;
                cmd.Parameters.Add(param1);

                SqlParameter param2 = new SqlParameter();
                param2.ParameterName = "@commNodeId";
                param2.Value = commNode;
                cmd.Parameters.Add(param2);

                SqlParameter param3 = new SqlParameter();
                param3.ParameterName = "@newName";
                param3.Value = newName;
                cmd.Parameters.Add(param3);

                SqlParameter param4 = new SqlParameter();
                param4.ParameterName = "@newFormattedName";
                param4.Value = fName;
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
                if (conn != null)
                {
                    conn.Close();
                }
            }
            
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        } // end          


        protected void sendCommMessage()
        {
            if (Request.Params["commNode"] == null)
                return;
            string commNode = Request.Params["commNode"];


            int x;
            if (!Int32.TryParse(commNode, out x))
                return;


            string messageHeader = "";
            if (Request.Params["messageHeader"] != null)
            {
                messageHeader = Request.Params["messageHeader"];
            }

            

            StreamReader reader3 = new StreamReader(Request.InputStream);
            string messageContent = reader3.ReadToEnd();

            
            //messageContent = Server.HtmlEncode(messageContent);

            messageContent = messageContent.Replace("\r\n", "<br />")
               .Replace(Environment.NewLine, "<br />")
               .Replace("\n", "<br />");
            
            messageContent = Helpers.StripUserHtml(messageContent);


            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

            resp += bc.sendCommNodeMessage(currentUser.id, Int32.Parse(commNode), messageHeader, messageContent);


            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(resp);
        } // end 


        protected void setInformWhenNew()
        {
            if (Request.Params["value"] == null)
                return;
            string action = Request.Params["value"];

            int newValue;
            newValue = action == "true" ? 1 : 0;


            if (Request.Params["commNodeId"] == null)
                return;
            string commNodeId = Request.Params["commNodeId"];

            int commNodeIdInt;
            if (!Int32.TryParse(commNodeId, out commNodeIdInt)) return;




            try
            {
                conn.Open();
                string query = "[dbo].[commNodeInformWhenNew]";
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
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";

        }

        protected void getCombatMessages()
        {
           
            if (Request.Params["fromNr"] == null)
                return;
            string fromNr = Request.Params["fromNr"];

            if (Request.Params["toNr"] == null)
                return;
            string toNr = Request.Params["toNr"];


            if (Request.Params["messageHighestId"] == null)
                return;
            string messageHighestId = Request.Params["messageHighestId"];
            int x;
            if (!Int32.TryParse(fromNr, out x) || !Int32.TryParse(toNr, out x) || !Int32.TryParse(messageHighestId, out x) )
                return;

            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

            resp = bc.getCombatMessages(currentUser.id, Int32.Parse(fromNr), Int32.Parse(toNr), Int32.Parse(messageHighestId));

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            //Response.ContentType = "text/xml";
            Response.Write(resp);
        } // end of 

        protected void getCombatMessageRounds()
        {

            if (Request.Params["combatId"] == null)
                return;
            string combatId = Request.Params["combatId"];

            int x;
            if (!Int32.TryParse(combatId, out x)) 
            { 
                return;
            }
            SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];

            resp = bc.getCombatRounds(currentUser.id, x);

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            //Response.ContentType = "text/xml";
            Response.Write(resp);
        } // end of 
    }
}