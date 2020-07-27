using System;
using System.Collections.Generic;
using System.Linq;
//susing System.Threading.Tasks;
using System.Web;

namespace EmpiresInSpace
{
    public static class SocketOut
    {
        public static void sendEvent(SpacegameServer.Core.GalacticEvents galacticEvent)
        {
            Microsoft.AspNet.SignalR.IHubContext _context = Microsoft.AspNet.SignalR.GlobalHost.ConnectionManager.GetHubContext<SpaceHub>();
            _context.Clients.All.newGalacticEvent(galacticEvent);
        }

        public static void RefreshShips(int shipId, int shipVersion)
        {
            //Microsoft.AspNet.SignalR.IHubContext _context = Microsoft.AspNet.SignalR.GlobalHost.ConnectionManager.GetHubContext<SpaceHub>();
            //_context.Clients.All.newGalacticEvent(galacticEvent);
            Microsoft.AspNet.SignalR.IHubContext _context = Microsoft.AspNet.SignalR.GlobalHost.ConnectionManager.GetHubContext<SpaceHub>();
            _context.Clients.All.RefreshShip(shipId, shipVersion);
        }

        public static void SendNewTrade(object tradeOffer)
        {
            Microsoft.AspNet.SignalR.IHubContext _context = Microsoft.AspNet.SignalR.GlobalHost.ConnectionManager.GetHubContext<SpaceHub>();
            _context.Clients.All.NewTradeOffer(tradeOffer);
        }

        public static void DeleteTrade(int tradeId)
        {
            Microsoft.AspNet.SignalR.IHubContext _context = Microsoft.AspNet.SignalR.GlobalHost.ConnectionManager.GetHubContext<SpaceHub>();
            _context.Clients.All.DeleteTrade(tradeId);
        }

        /// <summary>
        ///     Send shipdata to each user that is in the userids list
        /// </summary>
        /// <param name="ship"></param>
        /// <param name="userIds"></param>
        public static void SendShip(object ship, List<int> userIds)
        {                
            var SocketUser = EmpiresInSpace.Game.Instance.UserHandler.GetUsers();
            var FilteredSocketUsers = SocketUser.Where(Socketuser => userIds.Any(userId => userId == Socketuser.RegistrationTicket.UserId)).ToList();
            var ConnectionIdsIEnum = FilteredSocketUsers.Select(Socketuser => Socketuser.ConnectionID);
            var temp = ConnectionIdsIEnum.ToList();

            Microsoft.AspNet.SignalR.IHubContext _context = Microsoft.AspNet.SignalR.GlobalHost.ConnectionManager.GetHubContext<SpaceHub>();
            _context.Clients.Clients(temp).ReceiveShip(ship);               
            //_context.Clients.All.ReceiveShip(ship);
        }

        /// <summary>
        ///     Send a communication message to each user that is in the userids list
        /// </summary>
        /// <param name="ship"></param>
        /// <param name="userIds"></param>
        public static void SendCommMessage(object Message, List<int> userIds)
        {
            var SocketUser = EmpiresInSpace.Game.Instance.UserHandler.GetUsers();
            var FilteredSocketUsers = SocketUser.Where(Socketuser => userIds.Any(userId => userId == Socketuser.RegistrationTicket.UserId)).ToList();
            var ConnectionIdsIEnum = FilteredSocketUsers.Select(Socketuser => Socketuser.ConnectionID);
            var temp = ConnectionIdsIEnum.ToList();

            Microsoft.AspNet.SignalR.IHubContext _context = Microsoft.AspNet.SignalR.GlobalHost.ConnectionManager.GetHubContext<SpaceHub>();
            _context.Clients.Clients(temp).ReceiveCommMessage(Message);
            //_context.Clients.All.ReceiveShip(ship);
        }

        /// <summary>
        ///       Send a message to each user of it
        /// <param name="ship"></param>
        public static void SendMessage(object Message, List<int> userIds)
        {
            var SocketUser = EmpiresInSpace.Game.Instance.UserHandler.GetUsers();
            var FilteredSocketUsers = SocketUser.Where(Socketuser => userIds.Any(userId => userId == Socketuser.RegistrationTicket.UserId)).ToList();
            var ConnectionIdsIEnum = FilteredSocketUsers.Select(Socketuser => Socketuser.ConnectionID);
            var temp = ConnectionIdsIEnum.ToList();

            Microsoft.AspNet.SignalR.IHubContext _context = Microsoft.AspNet.SignalR.GlobalHost.ConnectionManager.GetHubContext<SpaceHub>();
            _context.Clients.Clients(temp).ReceiveMessage(Message);
        }

        /// <summary>
        ///       Send a message to each user of it
        /// <param name="ship"></param>
        public static void SendCombat(object Message, int userId)
        {
            var SocketUser = EmpiresInSpace.Game.Instance.UserHandler.GetUsers();
            var FilteredSocketUsers = SocketUser.Where(Socketuser =>  userId == Socketuser.RegistrationTicket.UserId).ToList();
            var ConnectionIdsIEnum = FilteredSocketUsers.Select(Socketuser => Socketuser.ConnectionID);
            var temp = ConnectionIdsIEnum.ToList();

            Microsoft.AspNet.SignalR.IHubContext _context = Microsoft.AspNet.SignalR.GlobalHost.ConnectionManager.GetHubContext<SpaceHub>();
            _context.Clients.Clients(temp).ReceiveCombat(Message);
        }
    }
}