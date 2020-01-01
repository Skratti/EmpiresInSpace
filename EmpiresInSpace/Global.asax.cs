using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;

namespace EmpiresInSpace
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
            string path = Server.MapPath("~/");
            SpacegameServer.BC.BusinessConnector bc = SpacegameServer.SpaceServer.createServer();

            Application["bs"] = bc;

            Game.Instance.bc = bc;

            SpacegameServer.Core.Core.Instance.SendEvent = EmpiresInSpace.SocketOut.sendEvent;
            SpacegameServer.Core.Core.Instance.RefreshShip = EmpiresInSpace.SocketOut.RefreshShips;
            SpacegameServer.Core.Core.Instance.SendShip = EmpiresInSpace.SocketOut.SendShip;
            SpacegameServer.Core.Core.Instance.SendCommMessage = EmpiresInSpace.SocketOut.SendCommMessage;
            SpacegameServer.Core.Core.Instance.SendMessage = EmpiresInSpace.SocketOut.SendMessage;
            SpacegameServer.Core.Core.Instance.SendCombat = EmpiresInSpace.SocketOut.SendCombat;
            SpacegameServer.Core.Core.Instance.SendNewTrade = EmpiresInSpace.SocketOut.SendNewTrade;
            SpacegameServer.Core.Core.Instance.DeleteTrade = EmpiresInSpace.SocketOut.DeleteTrade;
            
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}