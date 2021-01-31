using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace EmpiresInSpace
{
    public class SpaceHub : Hub
    {

        private readonly Game _game;

        public SpaceHub() : this(Game.Instance) { }

        public SpaceHub(Game game)
        {
            _game = game;
        }



        #region Connection Methods
        public override Task OnConnected()
        {
            _game.ConnectionManager.OnConnected(Context.ConnectionId);
            return base.OnConnected();
        }

        public override Task OnReconnected()
        {
            _game.ConnectionManager.OnReconnected(Context.ConnectionId);
            return base.OnReconnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            _game.ConnectionManager.OnDisconnected(Context.ConnectionId);
            return base.OnDisconnected(stopCalled);
        }

        #endregion


        
        //Browsers use these method to Send to the Hub
        /*
        public void SendEvent()
        {


            // Call the broadcastMessage method to update clients.
            //Clients.All.broadcastMessage(name, message);
        }
        */

        public void Send( string message)
        {
            if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
            {
                User user = _game.UserHandler.GetUser(Context.ConnectionId);

                int id = (int)SpacegameServer.Core.Core.Instance.identities.chat.getNext();
                SpacegameServer.Core.ChatLog chatLog = new SpacegameServer.Core.ChatLog(id, user.RegistrationTicket.UserId, message, DateTime.Now);
                SpacegameServer.Core.Core.Instance.chatLog.TryAdd(id,chatLog);
                SpacegameServer.Core.Core.Instance.dataConnection.insertChatMessage(chatLog);

                Clients.All.broadcastMessage(user.RegistrationTicket.UserId , message);                
            }

            // Call the broadcastMessage method to update clients.
            //Clients.All.broadcastMessage( message);
        }



        public object getUserScannedFields()
        {
            if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
            {
                User user = _game.UserHandler.GetUser(Context.ConnectionId);
                
            }

            return null;
            // Call the broadcastMessage method to update clients.
            //Clients.All.broadcastMessage();

            //currentUser = (Users)Session["user"];
            //SpacegameServer.BC.BusinessConnector bc = (SpacegameServer.BC.BusinessConnector)Application["bs"];
            //string coreUserData = bc.getUserData(currentUser.id);

            //var result = Appl
        }

        //displays restart alert
        /*
        public void SendRestartSignal()
        {
            Clients.All.ServerRestartX();
        }
        */
        /// <summary>
        /// Retrieves the game's configuration
        /// Currently only the border map
        /// </summary>
        /// <returns>The game's configuration</returns>
        public object initializeClient(string registrationID)
        {
            if (_game.RegistrationHandler.RegistrationExists(registrationID))
            {
                var ret = _game.initializeClient(Context.ConnectionId, _game.RegistrationHandler.RemoveRegistration(registrationID));
                User user = _game.UserHandler.GetUser(Context.ConnectionId);
                Clients.All.ChatAddUser(user.RegistrationTicket.UserId);

                //Microsoft.AspNet.SignalR.GlobalHost.ConnectionManager.GetHubContext<SpaceHub>().Clients.All.ChatAddUser(user.RegistrationTicket.UserId);
                return ret;
            }

            return null;
        }

        /// <summary>
        /// fetches up to 50 events with lower IDs than lowestEventYet
        /// </summary>
        /// <param name="registrationID"></param>
        /// <param name="lowestEventYet">the lowest galacticEventId the user has until now</param>
        /// <returns></returns>
        public object FetchGalacticEvents(int lowestEventYet)
        {
            if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
            {
                var chatLog = SpacegameServer.Core.Core.Instance.chatLog;
                //foreach (var chat in SpacegameServer.Core.Core.Instance.chatLog.Reverse().Take(10).Reverse())
                foreach (var chat in chatLog.Skip(Math.Max(0, chatLog.Count() - 20)))
                {
                    Clients.Caller.broadcastMessage(chat.Value.userId, chat.Value.chatMessage);
                }

                return new
                {
                    NewEvents = _game.bc.GetGalacticEvents(lowestEventYet)
                };
            }

            return null;
        }

        public object FetchActiveUsers()
        {
            return new { Active = _game.UserHandler.ConnectedUsers() };
        }

        public object FetchUserResearch(int userId)        
        {
            User user = _game.UserHandler.GetUser(Context.ConnectionId);
            int UserId = user.RegistrationTicket.UserId;

            //PlayerResearch
            return new {Researchs =  _game.bc.getUserResearch(userId, UserId == userId) };            
        }
        public object GetPlanetTypes()
        {
            return new { PlanetTypes = SpacegameServer.Core.Core.Instance.PlanetTypes};
        }
        

        public object FetchAllUserResearch()
        {
            //all Player Specifications
            return new { Researchs = _game.bc.getAllUsersSpecifications() };
        }


        public void SetLatestGalacticEvents(int LatestEventSoFar)
        {
            if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
            {
                User user = _game.UserHandler.GetUser(Context.ConnectionId);
                _game.bc.SetLatestGalacticEvents(user.RegistrationTicket.UserId, LatestEventSoFar);           
            }  
        }

        public void SetShowCombatPopup(bool value)
        {
            if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
            {
                User user = _game.UserHandler.GetUser(Context.ConnectionId);
                _game.bc.SetShowCombatPopup(user.RegistrationTicket.UserId, value);
            }
        }

        public void SetShowCombatFast(bool value)
        {
            if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
            {
                User user = _game.UserHandler.GetUser(Context.ConnectionId);
                _game.bc.SetShowCombatFast(user.RegistrationTicket.UserId, value);
            }
        }

        public object CreateTrade(int objectId, byte objectType,  Object Offered, Object Requested)
        {
            if (objectType != 1 && objectType != 0) return new { };
            if (objectType == 0)
            {
                if (!SpacegameServer.Core.Core.Instance.ships.ContainsKey(objectId)) return new {};               
            }
            else
            {
                if (!SpacegameServer.Core.Core.Instance.colonies.ContainsKey(objectId)) return new { };              
            }



            SpacegameServer.Core.TradeOffer NewTradeOffer = null;

            if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
            {
                User user = _game.UserHandler.GetUser(Context.ConnectionId);

                // make a ClientTrade object and put all data into it
                SpacegameServer.Core.ClientTrade TradeData = new SpacegameServer.Core.ClientTrade();

                TradeData.SenderId = objectId;
                TradeData.SenderType = objectType;
            
                var TradeOfferLines = ((System.Collections.IEnumerable)Offered).Cast<object>().ToList();
                foreach (var tradeGoodsLine in TradeOfferLines)
                {
                    dynamic x = tradeGoodsLine;

                    short goodsId = x.goodsId;
                    int amount = x.amount;

                    TradeData.Offered.Add(new SpacegameServer.Core.GoodsTransfer(goodsId, amount));
                }

              
                TradeOfferLines = ((System.Collections.IEnumerable)Requested).Cast<object>().ToList();
                foreach (var tradeGoodsLine in TradeOfferLines)
                {
                    dynamic x = tradeGoodsLine;

                    short goodsId = x.goodsId;
                    int amount = x.amount;

                    TradeData.Requested.Add(new SpacegameServer.Core.GoodsTransfer(goodsId, amount));
                }

                //send the ClientTrade and the current user id to check and create the trade
                NewTradeOffer = SpacegameServer.Core.TradeWorker.createTrade(TradeData, user.RegistrationTicket.UserId);
            }

            if (NewTradeOffer != null)
            {
                string NewTradeOfferJSON = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(NewTradeOffer);

                return new { Offer = NewTradeOfferJSON };
            }

            return new { };
        }

        public void DeleteMyTrade(int tradeId)
        {
            if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
            {
                User user = _game.UserHandler.GetUser(Context.ConnectionId);
                var SendingUserId = user.RegistrationTicket.UserId;

                SpacegameServer.Core.TradeWorker.DeleteTrade(tradeId, SendingUserId);
            }
        }

        public void AcceptTrade(int tradeId, int commNodeId)
        {
            try
            {
                if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
                {
                    User user = _game.UserHandler.GetUser(Context.ConnectionId);
                    var SendingUserId = user.RegistrationTicket.UserId;

                    SpacegameServer.Core.TradeWorker.acceptTrade2(tradeId, SendingUserId, commNodeId);
                }
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public int RazeBuilding(int colonyId, int buildingId)
        {
            Boolean ret = false;

            try
            {
                if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
                {
                    User user = _game.UserHandler.GetUser(Context.ConnectionId);
                    var SendingUserId = user.RegistrationTicket.UserId;

                    ret = SpacegameServer.BC.Building.deconstructBuilding(SendingUserId, colonyId, buildingId);
                }
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret ? 1 : 0;
        }

        public int BuildModules( string modules)
        {
            Boolean ret = false;
            try
            {
                if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
                {

                    System.Web.Script.Serialization.JavaScriptSerializer ser = new System.Web.Script.Serialization.JavaScriptSerializer();
                    SpacegameServer.Core.Transfer records;
                    records = ser.Deserialize<SpacegameServer.Core.Transfer>(modules);

                    User user = _game.UserHandler.GetUser(Context.ConnectionId);
                    var SendingUserId = user.RegistrationTicket.UserId;

                    string result = "";
                    ret = SpacegameServer.Core.Modules.BuildModules(SendingUserId, records, ref result);

                    //SpacegameServer.Core.TradeWorker.acceptTrade2(tradeId, SendingUserId, commNodeId);
                }
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret ? 1 : 0;
        }

        public object FetchShip(int shipId, int scannerId, int scannerType)
        {
            try
            {
                User user = _game.UserHandler.GetUser(Context.ConnectionId);
                int UserId = user.RegistrationTicket.UserId;

                if (!SpacegameServer.Core.Core.Instance.ships.ContainsKey(shipId))
                    return new { };
                SpacegameServer.Core.Ship Ship = SpacegameServer.Core.Core.Instance.ships[shipId];

                //take care that the ships is either seen by the user, or did belong to the user before having been destroyed           
                var CanSeeCheck = false;
                if (scannerType == 0)
                {
                    if (!SpacegameServer.Core.Core.Instance.ships.ContainsKey(scannerId)) return new { };
                    SpacegameServer.Core.Ship ScanShip = SpacegameServer.Core.Core.Instance.ships[scannerId];

                    if (Ship.FormerOwner == UserId)
                    {
                        CanSeeCheck = true;
                    }
                    else
                    {
                        CanSeeCheck = ScanShip.ScansPosition(new Tuple<int, int>(Ship.posX, Ship.posY));
                    }
                }
                if (scannerType == 1)
                {
                    if (!SpacegameServer.Core.Core.Instance.colonies.ContainsKey(scannerId)) return new { };
                    SpacegameServer.Core.Colony ScanColony = SpacegameServer.Core.Core.Instance.colonies[scannerId];
                    CanSeeCheck = ScanColony.ScansPosition(new Tuple<int, int>(Ship.posX, Ship.posY));
                }

                if (!CanSeeCheck) return new { };

                string ShipJSON = _game.bc.getShip(UserId, shipId);

                return new { Ship = ShipJSON };                
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return new { };
            //return new { Ship = _game.bc.getShipData(user.RegistrationTicket.UserId, shipId) };
        }

        /// <summary>
        /// Get all player routes
        /// </summary>
        /// <returns>JSON of the routes and their data</returns>
        public object FetchRoutes()
        {
            try
            {
                User user = _game.UserHandler.GetUser(Context.ConnectionId);
                int UserId = user.RegistrationTicket.UserId;
                var routes = SpacegameServer.Core.Core.Instance.routes.Where(e => e.Value.userid == UserId).Select(e => e.Value);
                string routesSerialized = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(routes);

                return routesSerialized;
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return new { };
            
        }

        //ToDo: shoud be called by client when a new user joins the map 
        public void fetchUserData(int userId)
        {
            /*
            if (_game.UserHandler.UserExistsAndReady(Context.ConnectionId))
            {
                User user = _game.UserHandler.GetUser(Context.ConnectionId);
                _game.bc.SetLatestGalacticEvents(user.RegistrationTicket.UserId, LatestEventSoFar);
            }
            */
        }


        public void ShipActiveState(int shipId, bool sentry)
        {
            try
            {
                User user = _game.UserHandler.GetUser(Context.ConnectionId);
                int UserId = user.RegistrationTicket.UserId;

                if (!SpacegameServer.Core.Core.Instance.ships.ContainsKey(shipId))
                    return;

                SpacegameServer.Core.Ship Ship = SpacegameServer.Core.Core.Instance.ships[shipId];

                if (Ship.userid != UserId)
                    return;

                Ship.Sentry = sentry;


                var toSave = new List<SpacegameServer.AsyncSaveable>();
                toSave.Add(Ship);
                SpacegameServer.Core.Core.Instance.dataConnection.saveAsync(toSave);                
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public void ShipHarvest(int shipId, bool harvest)
        {
            try
            {
                User user = _game.UserHandler.GetUser(Context.ConnectionId);
                int UserId = user.RegistrationTicket.UserId;

                if (!SpacegameServer.Core.Core.Instance.ships.ContainsKey(shipId))
                    return;

                SpacegameServer.Core.Ship Ship = SpacegameServer.Core.Core.Instance.ships[shipId];

                //check user
                if (Ship.userid != UserId)
                    return;

                //check nebula
                if (Ship.field.starId != null)
                {
                    int starId = (int)Ship.field.starId;
                    SpacegameServer.Core.SystemMap star = SpacegameServer.Core.Core.Instance.stars[starId];
                    if (!(star.ObjectId > 4999 && star.ObjectId < 5005)) return;
                }

                //check that the gravity generator exists on ship
                bool moduleExists = false;
                foreach (var module in Ship.shipModules)
                {
                    if( SpacegameServer.Core.Core.Instance.Modules[module.moduleId].moduleGain.special == 4)
                        moduleExists = true;
                }
                if (!moduleExists) return;

                //check that this will be the only ship harvesting
                if (harvest)
                {
                    if (Ship.field.ships.Any(e => e.Harvesting))
                    {
                        return;
                    }
                }

                //set value and save
                Ship.Harvesting = harvest;

                var toSave = new List<SpacegameServer.AsyncSaveable>();
                toSave.Add(Ship);
                SpacegameServer.Core.Core.Instance.dataConnection.saveAsync(toSave);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }


        public void ShipSetFleetState(int shipId, int? fleetId)
        {
            try
            {
                User user = _game.UserHandler.GetUser(Context.ConnectionId);
                int UserId = user.RegistrationTicket.UserId;

                if (!SpacegameServer.Core.Core.Instance.ships.ContainsKey(shipId))
                    return;

                SpacegameServer.Core.Ship Ship = SpacegameServer.Core.Core.Instance.ships[shipId];

                if (Ship.userid != UserId)
                    return;

                Ship.FleetId = fleetId;


                var toSave = new List<SpacegameServer.AsyncSaveable>();
                toSave.Add(Ship);
                SpacegameServer.Core.Core.Instance.dataConnection.saveAsync(toSave);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }
       
    }

}