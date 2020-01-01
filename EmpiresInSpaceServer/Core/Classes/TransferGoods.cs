using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Xml;

namespace SpacegameServer.Core
{
    public class GoodsTransfer
    {
        public short Id;
        public int Qty;

        public GoodsTransfer()
        {
        }
        public GoodsTransfer(short _GoodId, int _Amount)
        {
            Id = _GoodId;
            Qty = _Amount;
        }
    }

    public class Transfer
    {
        public int Sender;
        public int Target;
        public int SenderType;
        public int TargetType;

        public List<GoodsTransfer> Goods;

        public Transfer()
        {
        }
    }

    internal class TransferGoods
    {
        public static bool transfer(int userId,string  transfer, ref string xml)
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;

            SpacegameServer.Core.UserSpaceObject sender = null;
            SpacegameServer.Core.UserSpaceObject receiver = null;


            //check XML for sender and receiver
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(transfer);

            //string xml = "<transfer><sender><shipId>1760</shipId><goods></goods></sender><receiver><colonyId>11</colonyId><goods><good><goodsId>50</goodsId><amount>3</amount></good></goods></receiver></transfer>";
            //.SelectSingleNode("/book/title");
            XmlNode senderShipNode = doc.DocumentElement.SelectSingleNode("/transfer/sender/shipId");
            XmlNode senderColonyNode = doc.DocumentElement.SelectSingleNode("/transfer/sender/colonyId");
            XmlNode receiverShipNode = doc.DocumentElement.SelectSingleNode("/transfer/receiver/shipId");
            XmlNode receiverColonyNode = doc.DocumentElement.SelectSingleNode("/transfer/receiver/colonyId");

            int senderUserId = 0, receiverUserId = 0;

            if (senderShipNode != null)
            {
                string sendStr = senderShipNode.InnerText;
                int senderId;
                if (Int32.TryParse(sendStr, out senderId))
                {
                    if (core.ships.ContainsKey(senderId)) { 
                        sender = core.ships[senderId];
                        senderUserId = core.ships[senderId].userid;
                    }
                }
            }
            if (senderColonyNode != null)
            {
                string ColonyStr = senderColonyNode.InnerText;
                int ColonyId;
                if (Int32.TryParse(ColonyStr, out ColonyId))
                {
                    if (core.colonies.ContainsKey(ColonyId))
                    { 
                        sender = core.colonies[ColonyId];
                        senderUserId = core.colonies[ColonyId].userId;
                    }
                }
            }
            if (receiverShipNode != null)
            {
                string receiverStr = receiverShipNode.InnerText;
                int receiverId;
                if (Int32.TryParse(receiverStr, out receiverId))
                {
                    if (core.ships.ContainsKey(receiverId))
                    { 
                        receiver = core.ships[receiverId];
                        receiverUserId = core.ships[receiverId].userid;
                    }
                }
            }
            if (receiverColonyNode != null)
            {
                string receiverStr = receiverColonyNode.InnerText;
                int receiverId;
                if (Int32.TryParse(receiverStr, out receiverId))
                {
                    if (core.colonies.ContainsKey(receiverId))
                    {
                        receiver = core.colonies[receiverId];
                        receiverUserId = core.colonies[receiverId].userId;
                    }
                }
            }
            if (sender == null || receiver == null) return false;

            //check that one does not move cargo from a neutral (0) space station (hullId 201)
            if( sender is Ship)
            {
                var SendShip = (Ship)sender;
                if (SendShip.hullid == 201 && SendShip.userid == 0) return false;
            }
            if (receiver is Ship)
            {
                var RecShip = (Ship)receiver;
                if (RecShip.hullid == 201 && RecShip.userid == 0) return false;
            }


            //test if goods are received:
            var receive = false;
            XmlNode sentNode = doc.DocumentElement.SelectSingleNode("/transfer/sender/goods/good");
            XmlNode receiveNode = doc.DocumentElement.SelectSingleNode("/transfer/receiver/goods/good");
            if (receiveNode != null) receive = true;

            //if trade is between users, and goods are received, check that they are at war           
            if (receive &&  senderUserId != receiverUserId && receiverUserId != 0)
            {
                //check that both are enemies (or player 0  is involved)
                if (receive && Core.Instance.userRelations.getRelation(Core.Instance.users[senderUserId], Core.Instance.users[receiverUserId]) != 0)
                {
                    return false;
                }
            }

            List<Lockable> toLock = new List<Lockable>();
            toLock.Add(sender);
            toLock.Add(receiver);

            if (!LockingManager.lockAllOrSleep(toLock)) return false;

            //make changes
            //Core.Instance.dataConnection.deconstructBuilding(userId, buildingId, ref xml);

            //atm : call sql procedure:
            Core.Instance.dataConnection.transfer(userId, transfer, ref xml);


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

            

            return true;
        }

        private static bool TransferChecks(int userId, UserSpaceObject sender, UserSpaceObject receiver, Transfer transfer, Ship senderShip, Ship targetShip, Colony senderColony, Colony targetColony)
        {
            //check that sender is ownder by user
            if (sender.GetUserId() != userId) return false;

            var SenderUser = Core.Instance.users[sender.GetUserId()];
            var ReceiverUser = Core.Instance.users[receiver.GetUserId()];

            //check that one does not move cargo from a neutral (0) space station (hullId 201)
            if (sender is Ship)
            {
                var SendShip = (Ship)sender;
                if (SendShip.hullid == 201 && SendShip.userid == 0) return false;
            }
            if (receiver is Ship)
            {
                var RecShip = (Ship)receiver;
                if (RecShip.hullid == 201 && RecShip.userid == 0) return false;
            }


            //test if goods are sent or received:
            if (transfer.Goods.Count == 0) return false;

            var send = false;
            var receive = false;

            receive = (transfer.Goods.Any(e => e.Qty < 0));
            send = (transfer.Goods.Any(e => e.Qty > 0));

            if (!send && !receive) return false;


            //if trade is between users, and goods are received, check that they are at war           
            if (receive && sender.GetUserId() != receiver.GetUserId() && receiver.GetUserId() != 0)
            {
                Relation CurrentRelation = Core.Instance.userRelations.getRelation(SenderUser, ReceiverUser);
                if (SenderUser.allianceId == ReceiverUser.allianceId) CurrentRelation = Relation.AllianceMember;


                //check that both are enemies (or player 0  is involved)
                if (receive && CurrentRelation != Relation.War && CurrentRelation != Relation.AllianceMember)
                {
                    return false;
                }
            }

            //test that both are on the same field  (if it is not scrap or recycle=
            if (transfer.Target > 0)
            {
                Field SenderField = null;
                Tuple<byte, byte> SenderSystemXY = null;

                if (senderShip != null)
                {
                    SenderField = senderShip.field;
                    SenderSystemXY = senderShip.getSystemCoords();
                }

                if (senderColony != null)
                {
                    SenderField = senderColony.field;
                    SenderSystemXY = senderColony.systemXY();
                }

                Field TargetField = null;
                Tuple<byte, byte> TargetSystemXY = null;

                if (targetShip != null)
                {
                    TargetField = targetShip.field;
                    TargetSystemXY = targetShip.getSystemCoords();
                }

                if (targetColony != null)
                {
                    TargetField = targetColony.field;
                    TargetSystemXY = targetColony.systemXY();
                }

                if (SenderField != TargetField) return false;
                if (SenderSystemXY != null && TargetSystemXY == null) return false;
                if (SenderSystemXY == null && TargetSystemXY != null) return false;
                if (SenderSystemXY != null && (SenderSystemXY.Item1 != TargetSystemXY.Item1 || SenderSystemXY.Item2 != TargetSystemXY.Item2)) return false;
            }

            //tests that all goods are in store on both sides of the transfer
            List<SpaceObjectStock> SenderStock = null;
            List<SpaceObjectStock> TargetStock = null;
            if (senderShip != null) SenderStock = senderShip.goods.ToList<SpaceObjectStock>();
            if (targetShip != null) TargetStock = targetShip.goods.ToList<SpaceObjectStock>();
            if (senderColony != null) SenderStock = senderColony.goods.ToList<SpaceObjectStock>();
            if (targetColony != null) TargetStock = targetColony.goods.ToList<SpaceObjectStock>();

            int TransferCapacity = 0;
            foreach (var transferLine in transfer.Goods){
                var Good = Core.Instance.Goods[transferLine.Id];

                TransferCapacity += Good.Weight() * transferLine.Qty;

                if (transferLine.Qty > 0)
                {
                    //check that sender has it on store
                    if (!SenderStock.Any(e => e.goodsId == transferLine.Id && e.amount >= transferLine.Qty)) return false;
                }
                else
                {
                    //check that target has it on store
                    if (!TargetStock.Any(e => e.goodsId == transferLine.Id && e.amount >= -transferLine.Qty)) return false;
                }

            }

            //test that scrap or recycle does not demand something in return. transfer can be sent to user 0  -> that will always be a scrap or recycle command
            if (receiver.GetUserId() == 0 && ( receiver.Id == 0 || receiver.Id == -1) )
            {
                if (receive) return false;
            }
 
            //sender + receiver : sufficient cargoSpace
            if (TransferCapacity < 0)
            {
                int RemainigFreeSpace = sender.CalcStorage() - sender.AmountOnStock();
                //check SenderStock:
                if (RemainigFreeSpace < -TransferCapacity) return false;
            }
            else
            {
                if (receiver.GetUserId() != 0)
                {
                    int RemainigFreeSpace = receiver.CalcStorage() - receiver.AmountOnStock();
                    //check ReceiverStock:
                    if (RemainigFreeSpace < TransferCapacity) return false;
                }
            }



            return true;
        }

        public static bool transfer2(int userId, SpacegameServer.Core.Transfer transfer, ref string xml)
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;

            SpacegameServer.Core.UserSpaceObject sender = null;
            SpacegameServer.Core.UserSpaceObject receiver = null;
            Ship SenderShip = null;
            Ship TargetShip = null;
            Colony SenderColony = null;
            Colony TargetColony = null;


            int senderUserId = 0;
            int receiverUserId = 0;
            //for sender and receiver
            if (transfer.Sender < 1 || transfer.SenderType < 1 || transfer.TargetType < 1) return false;

            if (transfer.SenderType == 1)
            {
                if (core.ships.ContainsKey(transfer.Sender)) 
                {
                    SenderShip = core.ships[transfer.Sender]; 
                    sender = core.ships[transfer.Sender];
                    senderUserId = SenderShip.userid;
                }
            }
            if (transfer.SenderType == 2)
            {
                if (core.colonies.ContainsKey(transfer.Sender)) 
                {
                    SenderColony = core.colonies[transfer.Sender];
                    sender = core.colonies[transfer.Sender];
                    senderUserId = SenderColony.userId; 
                }
            }

            if (transfer.TargetType == 1)
            {
                if (core.ships.ContainsKey(transfer.Target)) 
                {
                    TargetShip = core.ships[transfer.Target];
                    receiver = core.ships[transfer.Target]; 
                    receiverUserId = core.ships[transfer.Target].userid;
                }
                else
                {
                    
                }
            }
            if (transfer.TargetType == 2)
            {
                if (core.colonies.ContainsKey(transfer.Target)) 
                {
                    TargetColony = core.colonies[transfer.Target]; 
                    receiver = core.colonies[transfer.Target];
                    receiverUserId = TargetColony.userId; 
                }

                //mock a target for srap and recycling actions
                if (transfer.Target < 1)
                {
                    TargetShip = Ship.createTransferMock();
                    receiver = TargetShip;
                    receiverUserId = 0;
                }
            }

            if (sender == null || receiver == null) return false;


            if (!TransferChecks(userId, sender, receiver, transfer, SenderShip, TargetShip, SenderColony, TargetColony)) return false;

            List<Lockable> toLock = new List<Lockable>();
            toLock.Add(sender);
            if (receiver.GetUserId() != 0)
            { 
                toLock.Add(receiver); 
            }

            if (!LockingManager.lockAllOrSleep(toLock)) return false;

            if (!TransferChecks(userId, sender, receiver, transfer, SenderShip, TargetShip, SenderColony, TargetColony)) 
            {
                LockingManager.unlockAll(toLock);
                return false; 
            }

            try
            {

                if (SenderShip != null) SenderShip.RemoveAllTrades();
                if (TargetShip != null) TargetShip.RemoveAllTrades();

                foreach (var transferLine in transfer.Goods)
                {
                    //var Good = Core.Instance.Goods[transferLine.Id];
                    sender.addGood((short)transferLine.Id, -transferLine.Qty);

                    //recycle:
                    if (transfer.Target == 0)
                    {
                        Core.Instance.Goods[transferLine.Id].Recycle(sender, transferLine.Qty);
                    }

                    //add goods if it is not scrapping or rececling...
                    if (TargetShip == null || TargetShip.id > 0) receiver.addGood((short)transferLine.Id, transferLine.Qty);
                }

                //Core.Instance.dataConnection.saveShipGoods(this);
                //core.dataConnection.saveColonyGoods(colony);

                if (SenderShip != null) Core.Instance.dataConnection.saveShipGoods(SenderShip);
                if (TargetShip != null && transfer.Target > 0) Core.Instance.dataConnection.saveShipGoods(TargetShip);

                if (SenderColony != null) Core.Instance.dataConnection.saveColonyGoods(SenderColony);
                if (TargetColony != null && transfer.Target > 0) Core.Instance.dataConnection.saveColonyGoods(TargetColony);

            }
            catch (Exception e)
            {
                Core.Instance.writeExceptionToLog(e);
                return false;
            }
            finally
            {
                //unlock
                LockingManager.unlockAll(toLock);
            }


            return true;
        }

    }
}
