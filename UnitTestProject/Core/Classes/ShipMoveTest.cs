using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SpacegameServer.Core;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SpacegameServer;
namespace UnitTestProject
{
    [TestClass()]
    public class ShipMoveTests
    {
        static Core instance;

        [ClassInitializeAttribute()]
        public static void ClassInit(TestContext context)
        {
            //DataConnector connector = new TestDataConnector();
            //instance = Core.setTestInstance(connector);
            instance = Core.Instance;
        }
        
        [TestMethod()]
        public void MoveTest()
        {
            Ship newShip = Mock.mockShip();
            newShip.systemid = null;
            newShip.max_hyper = 10;
            newShip.max_impuls = 10;
            newShip.hyper = 10;
            newShip.impuls = 10;

            byte result = 0;
            string combatLog = "";
            Combat combat = null;

            var OldPositionX = newShip.field.x;
            newShip.move(6, newShip.userid, 1, ref result, ref combatLog, ref combat);
            Assert.AreEqual(OldPositionX + 1, newShip.field.x, "New position is not one to the right of old position.");



            OldPositionX = newShip.field.x;
            newShip.move(4, newShip.userid, 1, ref result, ref combatLog, ref combat);
            Assert.AreEqual(OldPositionX - 1, newShip.field.x, "New position is not one to the left of old position.");

            var OldPositionY = newShip.field.y;
            newShip.move(8, newShip.userid, 1, ref result, ref combatLog, ref combat);
            Assert.AreEqual(OldPositionY + 1, newShip.field.y, "New position is not one down of the old position.");

            OldPositionY = newShip.field.y;
            newShip.move(2, newShip.userid, 1, ref result, ref combatLog, ref combat);
            Assert.AreEqual(OldPositionY - 1, newShip.field.y, "New position is not one up of old position.");           

            
        }

       [TestMethod()]
        public void BCMoveTest()
        {
            string ret = "";
            SpacegameServer.BC.BusinessConnector bc;
            bc = new SpacegameServer.BC.BusinessConnector();

            Ship newShip = Mock.mockShip();
            newShip.systemid = null;
            newShip.max_hyper = 10;
            newShip.max_impuls = 10;
            newShip.hyper = 10;
            newShip.impuls = 10;

            var OldPositionX = newShip.field.x;
            List<int> shipIds = new List<int>();
            shipIds.Add(newShip.id);
            ret = bc.MoveFleet(shipIds, 6, newShip.userid, 1);

            SpacegameServer.BC.XMLGroups.MoveResultTree moveResult = null;
            System.Xml.Serialization.XmlSerializer serializer = new System.Xml.Serialization.XmlSerializer(typeof(SpacegameServer.BC.XMLGroups.MoveResultTree));
            using (System.IO.TextReader reader = new System.IO.StringReader(ret))
            {
                moveResult = (SpacegameServer.BC.XMLGroups.MoveResultTree)serializer.Deserialize(reader);
            }

            Assert.AreEqual(1, moveResult.result);
            Assert.AreEqual(OldPositionX + 1, moveResult.ships.First(ship=>ship.id == newShip.id).posX);

        }

       [TestMethod()]
       public void BCMovePathTest()
       {
           string ret = "";
           SpacegameServer.BC.BusinessConnector bc;
           bc = new SpacegameServer.BC.BusinessConnector();

           Ship newShip = Mock.mockShip();
           newShip.systemid = null;
           newShip.max_hyper = 10;
           newShip.max_impuls = 10;
           newShip.hyper = 10;
           newShip.impuls = 10;

           var OldPositionX = newShip.field.x;

           List<int> shipIds = new List<int>();
           shipIds.Add(newShip.id);
           List<byte> directions = new List<byte>();
           directions.Add(6);
           directions.Add(6);
           ret = bc.MovePathFleet(shipIds, directions, newShip.userid, 1);

           //deserialize MovePathResult
           SpacegameServer.BC.XMLGroups.MovePathResult movePathResult = null;
           System.Xml.Serialization.XmlSerializer serializer = new System.Xml.Serialization.XmlSerializer(typeof(SpacegameServer.BC.XMLGroups.MovePathResult));
           using (System.IO.TextReader reader = new System.IO.StringReader(ret))
           {
               movePathResult = (SpacegameServer.BC.XMLGroups.MovePathResult)serializer.Deserialize(reader);
           }

           //deserialize the first string
           SpacegameServer.BC.XMLGroups.MoveResultTree moveResult = null;
           serializer = new System.Xml.Serialization.XmlSerializer(typeof(SpacegameServer.BC.XMLGroups.MoveResultTree));
           using (System.IO.TextReader reader = new System.IO.StringReader(movePathResult.StepResults[0]))
           {
               moveResult = (SpacegameServer.BC.XMLGroups.MoveResultTree)serializer.Deserialize(reader);
           }

           Assert.AreEqual(1, moveResult.result);
           Assert.AreEqual(OldPositionX + 1, moveResult.ships.First(ship => ship.id == newShip.id).posX, "Step 1 : wrong X coords");


           using (System.IO.TextReader reader = new System.IO.StringReader(movePathResult.StepResults[1]))
           {
               moveResult = (SpacegameServer.BC.XMLGroups.MoveResultTree)serializer.Deserialize(reader);
           }
           Assert.AreEqual(1, moveResult.result);
           Assert.AreEqual(OldPositionX + 2, moveResult.ships.First(ship => ship.id == newShip.id).posX, "Step 2 : wrong X coords");

       }
    }
}
