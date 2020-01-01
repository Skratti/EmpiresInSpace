using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SpacegameServer;
using SpacegameServer.Core;


namespace UnitTestProject
{
    [TestClass]
    public class SpacegameServerTest
    {
        

        [AssemblyInitializeAttribute()]
        public static void AssemblyInit(TestContext context)
        {
            DataConnector connector = new TestDataConnector();
            Core.setTestInstance(connector);

           

            //DataConnector connector = new TestDataConnector();
            //Core instance = Core.setTestInstance(connector);
        }

        [ClassInitializeAttribute()]
        public static void ClassInit(TestContext context)
        {
            
            //Core instance = Core.InitTestInstance;
            //SpacegameServer.DataConnectors.SqlConnector.getGameData(instance);
            //Core.Instance.ResearchQuestPrerequisites  
        }

        [TestMethod]
        public void TestProcess()
        {
           

            // arrange
            SpacegameServer.BC.BusinessConnector bc;
            bc = SpacegameServer.SpaceServer.createServer();

            // act
            //account.Debit(debitAmount);

            // assert
            //double actual = account.Balance;
            //Assert.AreEqual(expected, actual, 0.001, "Account not debited correctly");

        }

        [TestMethod]
        public void TestLockable()
        {
            SpacegameServer.Core.Core Instance = SpacegameServer.Core.Core.Instance;


            SpacegameServer.Core.User x = Mock.MockUserAndAdd(Instance);

            int shipId1 = (int)Instance.identities.shipLock.getNext();
            int shipId2 = (int)Instance.identities.shipLock.getNext();

            SpacegameServer.Core.Ship Ship1, Ship2;
            Ship1 = new SpacegameServer.Core.Ship(shipId1);
            Ship2 = new SpacegameServer.Core.Ship(shipId2);

            SpacegameServer.Core.Colony Colony1;
            Colony1 = new SpacegameServer.Core.Colony(1);

            //Object can only be locked once
            Assert.IsTrue(Ship1.setLock());
            Assert.IsFalse(Ship1.setLock());

            //LockAll of Ships can only be set once
            Assert.IsTrue(SpacegameServer.Core.Ship.setLockAll());
            Assert.IsFalse(SpacegameServer.Core.Ship.setLockAll());

            //ships can't be lcoked anymore, colonies can
            Assert.IsFalse(Ship1.setLock());
            Assert.IsFalse(Ship2.setLock());
            Assert.IsTrue(Colony1.setLock());
            Ship1.removeLock();
            Colony1.removeLock();

            //after removing LockAll, all is lockable again
            SpacegameServer.Core.Ship.removeLockAll();
            Assert.IsTrue(Ship1.setLock());
            Assert.IsTrue(Ship2.setLock());
            Assert.IsTrue(Colony1.setLock());
        }

        [TestMethod]
        public void TestBCGameData()
        {
            //SpacegameServer.Core.Core Core = SpacegameServer.Core.Core.testCreateCore();
            SpacegameServer.BC.BusinessConnector bc = new SpacegameServer.BC.BusinessConnector();                        
            string test = bc.getGameData();
        }
    }
}
