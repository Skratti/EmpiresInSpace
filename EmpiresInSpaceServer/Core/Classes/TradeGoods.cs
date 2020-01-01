using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace SpacegameServer.Core
{
    public class ClientTrade
    {
        public int SenderId;
        public byte SenderType;  //0 = ship , 1 = colony

        public List<GoodsTransfer> Offered;
        public List<GoodsTransfer> Requested;

        public ClientTrade()
        {
            Offered = new List<GoodsTransfer>();
            Requested = new List<GoodsTransfer>();
        }
    }
    public partial class TradeOffer 
    {
        private int _userId;

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public UserSpaceObject Sender;

        public TradeOffer(int id, ClientTrade trade)
        {
            this._id = id;
            this.offered = new List<TradeOfferGood>();
            this.requested = new List<TradeOfferGood>();
            //this.userId = trade.Sender.Owner.id;

            this.spaceObjectId = trade.SenderId;
            this.spaceObjectType = trade.SenderType;
            this.commNodeId = 1;

            foreach (var offer in trade.Offered)
            {
                this.offered.Add(new TradeOfferGood(offer, id, true));
            }

            foreach (var request in trade.Requested)
            {
                this.requested.Add(new TradeOfferGood(request, id, false));
            }
        }

        public int userId
        {
            get
            {
                return this._userId;
            }
            set
            {
                if ((this._userId != value))
                {
                    this._userId = value;
                }
            }
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public User Owner
        {
            get
            {
                return Core.Instance.users.First(e => e.Value.id == userId).Value;
            }
            set
            {
                if ((this.userId != value.id))
                {
                    this.userId = value.id;
                }
            }
        }


        public void FetchUser()
        {
            
            if (this.spaceObjectType == 0)
            {
                if (!SpacegameServer.Core.Core.Instance.ships.ContainsKey(this.spaceObjectId)) return;
                this.Sender = SpacegameServer.Core.Core.Instance.ships[this.spaceObjectId];
                this.userId = this.Sender.GetUserId();
            }
            else
            {
                if (!SpacegameServer.Core.Core.Instance.colonies.ContainsKey(this.spaceObjectId)) return;
                this.Sender = SpacegameServer.Core.Core.Instance.colonies[this.spaceObjectId];
                this.userId = this.Sender.GetUserId();
            }
        }

        public bool Check(int sender)
        {
            if (Owner.id != sender) return false;

            //check that sendingShip exists and belongs to sender
            if (!Core.Instance.ships.ContainsKey(spaceObjectId)) return false;
            var sendingShip = Core.Instance.ships[spaceObjectId];
            if (sendingShip.userid != sender) return false;

            //check that sendingShip is at a trade station (commNode)
            if (!sendingShip.CanTrade()) return false;

            //check that sendingShip has all goods on board that are offered, and calc the storage capacity of the offer
            int OfferCapacity = 0;
            foreach (var GoodOffered in this.offered)
            {
                if (!sendingShip.GoodsAvailable().Any(e => e.goodsId == GoodOffered.goodsId && e.amount >= GoodOffered.amount)) return false;

                var Good = Core.Instance.Goods[GoodOffered.goodsId];
                OfferCapacity += Good.Weight() * GoodOffered.amount;               
            }

            //check that sendingShip has enough cargo capacity to receive the goods after the trade
            //first sum up storage need of the requested goods:
            int RequestedCapacity = 0;
            foreach (var GoodRequested in this.requested)
            {
                var Good = Core.Instance.Goods[GoodRequested.goodsId];
                RequestedCapacity += Good.Weight() * GoodRequested.amount;
            }
            if ((sendingShip.cargoroom - sendingShip.AmountOnStock()) + OfferCapacity <= RequestedCapacity) return false;

            return true;
        }

        public static System.Data.DataTable createDataTable()
        {
            System.Data.DataTable dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "id");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "commNodeId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "spaceObjectId");
            dataTable.AddColumn(System.Type.GetType("System.Byte"), "spaceObjectType");

            return dataTable;
        }

        public object createData()
        {
            return new
            {
                id =  this.tradeOfferId
                ,
                this.commNodeId
                ,
                this.spaceObjectId
                ,
                this.spaceObjectType
            };

        }

    }

    public class TradeWorker
    {

        public static void ConnectTradeWithShips()
        {
            foreach(var trade in Core.Instance.tradeOffer.Values)
            {
                if (!Core.Instance.ships.ContainsKey(trade.spaceObjectId)) continue;

                trade.TradingShip = Core.Instance.ships[trade.spaceObjectId];
                trade.TradingShip.TradeOffers.Add(trade);
            }
        }

        public static bool acceptTrade(int userId, int senderId, int senderType, int tradeOfferIdInt, int receiverId, int receiverType, ref string output)
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;

            SpacegameServer.Core.UserSpaceObject sender = null;
            SpacegameServer.Core.UserSpaceObject receiver = null;

            if (senderType == 0)
            {
                if (core.ships.ContainsKey(senderId))
                    sender = core.ships[senderId];                
            }
            if (senderType == 1)
            {
                if (core.colonies.ContainsKey(senderId))
                    sender = core.colonies[senderId];                
            }

            if (receiverType == 0)
            {
                if (core.ships.ContainsKey(receiverId))
                    receiver = core.ships[receiverId];
            }
            if (receiverType == 1)
            {
                if (core.colonies.ContainsKey(receiverId))
                    receiver = core.colonies[receiverId];
            }
            
            if (sender == null || receiver == null) return false;

            List<Lockable> toLock = new List<Lockable>();
            toLock.Add(sender);
            toLock.Add(receiver);

            if (!LockingManager.lockAllOrSleep(toLock)) return false;

            //make changes
            //Core.Instance.dataConnection.deconstructBuilding(userId, buildingId, ref xml);

            //atm : call sql procedure:
            Core.Instance.dataConnection.acceptTrade(userId, senderId, senderType, tradeOfferIdInt, ref output);


            //save changes
            /*
            List<AsyncSaveable> toSave = new List<AsyncSaveable>();
            toSave.Add(sender);
            toSave.Add(receiver);
            DataConnectors.SqlConnector.saveAsync(toSave);
            */

            // get colony data (goods, later population (colony ships))
            //Core.Instance.dataConnection.getColonyStock(core, colony);
            List<UserSpaceObject> toUpdate = new List<UserSpaceObject>();
            toUpdate.Add(sender);
            toUpdate.Add(receiver);
            Core.Instance.dataConnection.updateStock(toUpdate);

            //unlock
            LockingManager.unlockAll(toLock);


            Core.Instance.DeleteTrade(tradeOfferIdInt);
            return true;
        }

        private static void GetPayingShips(TradeOffer tradeOffer, List<Ship> ships, List<Ship> ShipsToPayGoods)
        {
            //copy requested goods into a new array
            List<shipStock> Requested = new List<shipStock>();
            foreach (var x in tradeOffer.requested)
            {
                Requested.Add(new shipStock(0, x.goodsId, x.amount));
            }

            foreach (var ship in ships)
            {
                if (!ship.CanTrade()) continue;

                var goodToPayFound = false;
                foreach(var shipGood in ship.GoodsAvailable())
                {
                    if (Requested.Any(req=>req.goodsId == shipGood.goodsId && req.amount > 0 ))
                    {
                        goodToPayFound = true;
                        Requested.First(req => req.goodsId == shipGood.goodsId).amount -= shipGood.amount;
                    }
                }

                if (goodToPayFound) ShipsToPayGoods.Add(ship);
            }           
        }

        private static void GetReceivingShips(TradeOffer tradeOffer, List<Ship> ships, List<Ship> ShipsToReceiveGoods, int commNodeId)
        {
            var AmountOffered = 0;
            AmountOffered = tradeOffer.offered.Where(good => Core.Instance.Goods[good.goodsId].goodsType == 1).Sum(e => e.amount);
            //Fetch Goods that are modules, get the module data, sum up all needed ressoures for these modules.
            AmountOffered += tradeOffer.offered.Where(good => Core.Instance.Goods[good.goodsId].goodsType == 2).Select(good => new { ModuleDate = Core.Instance.Modules.First(Module => Module != null && Module.goodsId == good.goodsId), Amount = good.amount }).Sum(Modules => Modules.ModuleDate.CargoCost() * Modules.Amount);

            foreach (var ship in ships)
            {
                if (AmountOffered <= 0) return;

                CommunicationNode ShipNode = ship.GetCommNode();
                if (ShipNode == null || ShipNode.id != commNodeId) continue;

                AmountOffered -= (ship.CalcStorage() - ship.AmountOnStock());
                ShipsToReceiveGoods.Add(ship);
            }
        }


        private static bool CheckStorageCapacity(TradeOffer tradeOffer, List<Ship> ships, int commNodeId)
        {            
            List<shipStock> OnStockAtTradeStations = new List<shipStock>();

            int RemainigFreeSpace = 0;
            foreach (var ship in ships)
            {
                CommunicationNode ShipNode = ship.GetCommNode();
                if (ShipNode == null || ShipNode.id != commNodeId ) continue;

                RemainigFreeSpace  += ship.CalcStorage() - ship.AmountOnStock();                
            }

            var AmountOffered = 0;
            AmountOffered = tradeOffer.offered.Where(good => Core.Instance.Goods[good.goodsId].goodsType == 1).Sum(e => e.amount);
            //Fetch Goods that are modules, get the module data, sum up all needed ressoures for these modules.
            AmountOffered += tradeOffer.offered.Where(good => Core.Instance.Goods[good.goodsId].goodsType == 2).Select(good => new { ModuleDate = Core.Instance.Modules.First(Module => Module != null && Module.goodsId == good.goodsId), Amount = good.amount }).Sum(Modules => Modules.ModuleDate.CargoCost() * Modules.Amount);

            return RemainigFreeSpace >= AmountOffered;
        }

        /// <summary>
        /// Check that the user has all requested goods at trade stations. Those goods may not be in orders already (taken care of by using the GoodsAvailable() method)
        /// </summary>
        /// <param name="tradeOffer"></param>
        /// <param name="ships"></param>
        /// <returns></returns>
        private static bool CheckRequestedGoods(TradeOffer tradeOffer, List<Ship> ships)
        {
            List<shipStock> OnStockAtTradeStations = new List<shipStock>();

            foreach (var ship in ships)
            {
                if (!ship.CanTrade()) continue;

                foreach (var good in ship.GoodsAvailable())
                {
                    if (OnStockAtTradeStations.Any(e => e.goodsId == good.goodsId))
                    {
                        OnStockAtTradeStations.First(e => e.goodsId == good.goodsId).amount += good.amount;
                    }
                    else
                    {
                        OnStockAtTradeStations.Add(new shipStock(0, good.goodsId, good.amount));
                    }
                }
            }

            foreach (var requested in tradeOffer.requested)
            {
                if (!OnStockAtTradeStations.Any(e => e.goodsId == requested.goodsId && e.amount >= requested.amount)) return false;
            }

            return true;
        }

        /// <summary>
        /// swap the goods. Skip player 0 -> those goods are not stored on ships anymore...
        /// </summary>
        /// <param name="tradeOffer"></param>
        /// <param name="ShipsToPayGoods"></param>
        /// <param name="ShipsToReceiveGoods"></param>
        public static void ExecuteTrade(TradeOffer tradeOffer, List<Ship> ShipsToPayGoods, List<Ship> ShipsToReceiveGoods)
        {
            Ship Trader = tradeOffer.TradingShip;


            foreach(var offered in tradeOffer.offered)
            {
                //remove offered good:
                if (Trader.userid != 0)
                {
                    if (!Trader.goods.Any(e => e.goodsId == offered.goodsId && e.amount >= offered.amount))
                    {
                        Core.Instance.writeToLog("executeTrade: TradingShip does not have all offered goods on board");
                        return;
                    }

                    Trader.goods.First(e => e.goodsId == offered.goodsId).amount -= offered.amount;
                }

                //add offered good to the ShipsToReceiveGoods
                foreach(var receivingShip in ShipsToReceiveGoods)
                {
                    if (offered.amount == 0) break;

                    var ReceivingShipCapacity = receivingShip.CalcStorage() - receivingShip.AmountOnStock();
                    var transfer = Math.Min(ReceivingShipCapacity, offered.amount);

                    offered.amount -= transfer;

                    receivingShip.addGood(offered.goodsId, transfer);
                }
            }

            foreach (var requested in tradeOffer.requested)
            {
                //add requested Good:
                if (Trader.userid != 0)
                {
                    Trader.addGood(requested.goodsId, requested.amount);
                }

                //remove requested goods from the ShipsToPayGoods
                foreach(var payingShip in ShipsToPayGoods)
                {
                    if (requested.amount == 0) break;

                    if (!payingShip.GoodsAvailable().Any(e => e.goodsId == requested.goodsId)) continue;
                    var transfer = Math.Min(
                        payingShip.GoodsAvailable().First(e=>e.goodsId == requested.goodsId).amount  
                        , requested.amount);

                    payingShip.addGood(requested.goodsId, -transfer);
                    requested.amount -= transfer;
                }
            }

        }

        /// <summary>
        /// All checks and preparations to accept a trade offer
        /// </summary>
        /// <param name="tradeId">The tradeId of the trade to be accepted</param>
        /// <param name="senderId">The userId of user thataccepts the trade</param>
        /// <param name="commNodeId">The place where the goods should be put on ships</param>
        public static void acceptTrade2(int tradeId, int senderId, int commNodeId)
        {
            if (!Core.Instance.tradeOffer.ContainsKey(tradeId)) return;
            if (!Core.Instance.users.ContainsKey(senderId)) return;
            if (!Core.Instance.commNodes.ContainsKey(commNodeId)) return;

            try { 
            
                var TradeOffer = Core.Instance.tradeOffer[tradeId];
                if (!Core.Instance.ships.ContainsKey(TradeOffer.spaceObjectId)) return;
                if (TradeOffer.Owner.id == senderId) return;

                var User = Core.Instance.users[senderId];
                var PayoutNode = Core.Instance.commNodes[commNodeId];
                var TradingShip = Core.Instance.ships[TradeOffer.spaceObjectId];
                List<Ship> ShipsToPayGoods = new List<Ship>();
                List<Ship> ShipsToReceiveGoods = new List<Ship>();
                

                //checks:
                // 1) has the user enough goods to accept the trade?
                if (!CheckRequestedGoods(TradeOffer, User.ships)) return;

                // 2) has the user enough storage capacity at the payout location to accept the trade?
                if (!CheckStorageCapacity(TradeOffer, User.ships, commNodeId)) return;

                GetPayingShips(TradeOffer, User.ships, ShipsToPayGoods);
                GetReceivingShips(TradeOffer, User.ships, ShipsToReceiveGoods, commNodeId);

                List<Lockable> elementsToLock = new List<Lockable>(4);
                elementsToLock.Add(TradeOffer);
                elementsToLock.AddRange(ShipsToPayGoods.Union(ShipsToReceiveGoods));
                elementsToLock.Add(TradeOffer.TradingShip);


                if (!LockingManager.lockAllOrSleep(elementsToLock))
                {
                    return;
                }
                try
                {                    
                    //Do the Checks again, this time only versus the locked objects
                    // 1) has the user enough goods to accept the trade?
                    if (!CheckRequestedGoods(TradeOffer, ShipsToPayGoods)) return;

                    // 2) has the user enough storage capacity at the payout location to accept the trade?
                    if (!CheckStorageCapacity(TradeOffer, ShipsToReceiveGoods, commNodeId)) return;

                    //swap the goods
                    ExecuteTrade(TradeOffer, ShipsToPayGoods, ShipsToReceiveGoods);

                    //write new ship cargo holds to DB
                    Core.Instance.dataConnection.saveShipGoods(TradeOffer.TradingShip);
                    foreach (var ship in ShipsToPayGoods.Union(ShipsToReceiveGoods))
                    {
                        Core.Instance.dataConnection.saveShipGoods(ship);
                    }

                    //cleanup trade references
                    TradeOffer.TradingShip.TradeOffers.Remove(TradeOffer);
                    TradeOffer.TradingShip = null;

                    //remove trade
                    Core.Instance.dataConnection.deleteTradeOfferById(tradeId);
                    Core.Instance.tradeOffer.TryRemove(tradeId);

                    //send to all players
                    Core.Instance.DeleteTrade(tradeId);                    
                }
                catch (Exception ex)
                {
                    Core.Instance.writeExceptionToLog(ex);
                }
                finally
                {
                    LockingManager.unlockAll(elementsToLock);
                }

            }
            catch (Exception ex)
            {
                Core.Instance.writeExceptionToLog(ex);
            }
        }

        public static TradeOffer createTrade(ClientTrade trade, int senderId)
        {
            Core core = Core.Instance;

            int newId = (int)core.identities.trades.getNext();
            TradeOffer NewTradeOffer = new TradeOffer(newId, trade);

            NewTradeOffer.FetchUser();


            List<Lockable> elementsToLock = new List<Lockable>(2);
            elementsToLock.Add(NewTradeOffer.Sender.Owner);
            

            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {               
                return null;
            }
            try
            {
                if (!NewTradeOffer.Check(senderId)) return null;

                try
                {                    
                    Core.Instance.dataConnection.SaveTradeOffer(NewTradeOffer);
                    core.tradeOffer.TryAdd(NewTradeOffer.tradeOfferId, NewTradeOffer);
                }
                catch (Exception ex)
                {
                    SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
                }

            }
            catch (Exception ex)
            {
                core.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }

            if (NewTradeOffer != null)
            {
                NewTradeOffer.TradingShip = Core.Instance.ships[NewTradeOffer.spaceObjectId];
                NewTradeOffer.TradingShip.TradeOffers.Add(NewTradeOffer);

                var offerSerialized = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(NewTradeOffer);
                Core.Instance.SendNewTrade(new { NewTradeOffer = offerSerialized });
            }

            return NewTradeOffer;
        }

        //called with locked objects, executes the delete
        public static void DeleteTradeExecute(TradeOffer trade)
        {
            int tradeId = trade.tradeOfferId;
            trade.TradingShip.TradeOffers.Remove(trade);
            trade.TradingShip = null;

            Core.Instance.dataConnection.deleteTradeOfferById(tradeId);
            Core.Instance.tradeOffer.TryRemove(tradeId);
            Core.Instance.DeleteTrade(tradeId);
        }

        //Check and lock, then call DeleteTradeExecute
        public static void DeleteTrade(int tradeId, int senderId)
        {
            if (Core.Instance.tradeOffer.ContainsKey(tradeId))
            {
                var trade = Core.Instance.tradeOffer[tradeId];
                
                List<Lockable> elementsToLock = new List<Lockable>(1);
                elementsToLock.Add(trade);
            

                if (!LockingManager.lockAllOrSleep(elementsToLock))
                {               
                    return;
                }
                try
                {
                    if (trade.Owner.id == senderId)
                    {
                        DeleteTradeExecute(trade);
                        /*
                        trade.TradingShip.TradeOffers.Remove(trade);
                        trade.TradingShip = null;

                        Core.Instance.dataConnection.deleteTradeOfferById(tradeId);
                        Core.Instance.tradeOffer.TryRemove(tradeId);
                        Core.Instance.DeleteTrade(tradeId);
                        */
                    }
                }
                catch (Exception ex)
                {
                    Core.Instance.writeExceptionToLog(ex);
                }
                finally
                {
                    LockingManager.unlockAll(elementsToLock);
                }

            }
        }

        /// <summary>
        /// iterate all trade orders, repair the ownership 
        /// called after startup in the postConstructor
        /// </summary>
        public static void AssignAllUsers()
        {
            foreach(var Offer in Core.Instance.tradeOffer.Values)
            {
                Offer.FetchUser();
            }
        }
    }
}
