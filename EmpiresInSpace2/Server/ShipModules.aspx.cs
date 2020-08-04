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


namespace SpaceGame.interaction
{
    public partial class ShipModules : System.Web.UI.Page
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
                    case "Build":
                        Build();
                        return;
                    default:
                        return;
                }

            }


            protected void Build()
            {
                //{"Sender":13,"Target":0,"SenderType":0,"TargetType":0,"Goods":[{"Id":1,"Qty":5},{"Id":3,"Qty":15},{"Id":2015,"Qty":6}]}
                //Sender = colonyId

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


                resp += bc.BuildModules(userIdI, records);

                //return the result (Response)
                Response.Clear();
                Response.Expires = -1;
                Response.ContentType = "text/xml";
                Response.Write(resp);

            }

        }

    }
}