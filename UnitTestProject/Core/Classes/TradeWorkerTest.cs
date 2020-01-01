using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SpacegameServer;
using SpacegameServer.Core;

namespace UnitTestProject
{
    [TestClass]
    public class TradeWorkerTest
    {
        static Core instance;

        [ClassInitializeAttribute()]
        public static void AssemblyInit(TestContext context)
        {            
            instance = Core.Instance;

            instance.SendNewTrade = (e) => { };
            instance.DeleteTrade = (e) => { };
        }

        private TradeOffer AddTradeOffer(Ship creator)
        {
            ClientTrade TradeStub = new ClientTrade();
            TradeStub.Offered.Add(new GoodsTransfer(1, 5));        //building material
            TradeStub.Offered.Add(new GoodsTransfer(2, 10));         //food
            TradeStub.Requested.Add(new GoodsTransfer(10, 12));     //metal
            TradeStub.SenderId = creator.id;
            TradeStub.SenderType = 0;

            return TradeWorker.createTrade(TradeStub, creator.userid);
        }
        private SpacegameServer.Core.Ship CreateTraders()
        {
            var User1 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(User1.id, User1);
            var User2 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(User2.id, User2);

            List<SpacegameServer.BC.XMLGroups.CommNode> commNodes = SpacegameServer.BC.XMLGroups.CommNodes.createKnownAndNearNodesList(User1);
            Assert.IsTrue(commNodes.Count > 1);

            var Ship1 = Mock.CreateShipAtCommNode(instance, User1, commNodes[0].node);
            var Ship2 = Mock.CreateShipAtCommNode(instance, User2, commNodes[1].node);

            Ship1.addGood(1, 30);   //building material
            Ship1.addGood(2, 50);   //food

            return Ship1;
        }



        private TradeOffer CreateTradersAndTrade()
        {
            return AddTradeOffer(CreateTraders());
        }

         [TestMethod]
        public void TestCreateTraders()
        {
            var ship = CreateTraders();
            Assert.IsNotNull(ship);
        }

        [TestMethod]
        public void TestCreateTrade()
        {
            //Assert.IsTrue(instance.tradeOffer.Count == 0);
            int count = instance.tradeOffer.Count;
            
            var NewTrade = this.CreateTradersAndTrade();

            Assert.IsTrue(instance.tradeOffer.Count == count + 1 , "The Trade was not created");
            Assert.IsNotNull(NewTrade);

            var Ship = NewTrade.TradingShip;
            Assert.IsTrue(Ship.TradeOffers.Count == 1, "The ship does not have exactly one trade offer");
        }

        [TestMethod]
        public void TestDeleteTrade()
        {
            //Assert.IsTrue(instance.tradeOffer.Count == 0);
            int count = instance.tradeOffer.Count;

            var NewTrade = this.CreateTradersAndTrade();

            Assert.IsTrue(instance.tradeOffer.Count == count + 1);
            Assert.IsNotNull(NewTrade);

            var Ship = NewTrade.TradingShip;

            TradeWorker.DeleteTrade(NewTrade.tradeOfferId, NewTrade.userId);
            Assert.IsTrue(instance.tradeOffer.Count == count);
            Assert.IsTrue(Ship.TradeOffers.Count == 0);




        }

        [TestMethod]
        //Test that trades are removed if the trader self destructs (should also hit when he is destroyed by others )
        public void TestTraderSelfDestruct()
        {
            //Assert.IsTrue(instance.tradeOffer.Count == 0);
            int count = instance.tradeOffer.Count;

            var NewTrade = this.CreateTradersAndTrade();
            var Ship = NewTrade.TradingShip;

            Ship.selfDestruct();

            Assert.IsTrue(instance.tradeOffer.Count == count);

            //repeat,but create more trades for the ship this time
            NewTrade = this.CreateTradersAndTrade();
            Ship = NewTrade.TradingShip;
            this.AddTradeOffer(Ship);
            this.AddTradeOffer(Ship);

            Assert.IsTrue(instance.tradeOffer.Count == count + 3);

            Ship.selfDestruct();

            Assert.IsTrue(instance.tradeOffer.Count == count);
        }

        [TestMethod]
        //Test that trades are removed if the trader moves away
        public void TestTraderMovedAway()
        {
            //Assert.IsTrue(instance.tradeOffer.Count == 0);
            int count = instance.tradeOffer.Count;

            var NewTrade = this.CreateTradersAndTrade();
            var Ship = NewTrade.TradingShip;


            byte result = 0;
            string combatLog = "";
            Combat Combat = null;
            Ship.hyper += 20;
            Ship.impuls += 20;
            Ship.systemid = null;
            var ret = Ship.move(1, Ship.userid, 1, ref result, ref combatLog, ref Combat);

            Assert.IsTrue(ret, "Ship did not move");
            Assert.IsTrue(instance.tradeOffer.Count == count, "Trade not deleted");


        }

        [TestMethod]
        //test that transfer of goods cancels any trades that both ships have
        public void TestTraderGoodsTransfer()
        {
            //Assert.IsTrue(instance.tradeOffer.Count == 0);
            int count = instance.tradeOffer.Count;

            var NewTrade = this.CreateTradersAndTrade();
            var Ship = NewTrade.TradingShip;
        }

    }
}
