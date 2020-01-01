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
    public class BusinessConnectorTest
    {
        static Core instance;

        [ClassInitializeAttribute()]
        public static void ClassInit(TestContext context)
        {
            instance = Core.Instance;
        }

        [TestMethod()]
        public void getCommNodeMessageTest()
        {
            instance.commNodes.First().Value.commNodeMessages.Clear();
            instance.identities.commNodeMessage.id = 0;

            //create user
            User user = Mock.mockGeneratedUser(instance);
            List<SpacegameServer.BC.XMLGroups.CommNode> commNodes = SpacegameServer.BC.XMLGroups.CommNodes.createKnownAndNearNodesList(user);
            
            var node = commNodes.First().node;
            
            //create ship
            SpacegameServer.Core.ShipBuild builder = new ShipBuild(instance);                       
            int newShipId = (int)instance.identities.shipLock.getNext();
            ShipTemplate template = instance.shipTemplate.Where(e => e.Value.hullid == 1).First().Value;
            var targetRegionId = GeometryIndex.calcRegionId(node.positionX, node.positionY);
            Field field = GeometryIndex.regions[targetRegionId].findOrCreateField(node.positionX, node.positionY);
            Colony colony = Mock.mockColony(ColonyUserId: user.id);
            Ship newShip = builder.buildShip(newShipId, template, field, user.id, colony, false);

            //add user to commNode
            node.checkAndAddUser(user, newShip);

            node.sendCommMessage(user, "head1", "body1");
            node.sendCommMessage(user, "head2", "body2");


            SpacegameServer.BC.BusinessConnector bc = new SpacegameServer.BC.BusinessConnector();
            string ret = bc.getCommNodeMessage(user.id, node.id, 0, 50);

            string expected = @"<messages>
  <message>
    <id>2</id>
    <commNodeId>" +node.id.ToString()+@"</commNodeId>
    <sender>"+user.id.ToString()+@"</sender>
    <headline>head2</headline>
    <messageBody>body2</messageBody>
    <sendingDate>2015-07-08T20:48:43.2544728Z</sendingDate>
    <newMessage>0</newMessage>
  </message>
  <message>
    <id>1</id>
    <commNodeId>" + node.id.ToString() + @"</commNodeId>
    <sender>1</sender>
    <headline>head1</headline>
    <messageBody>body1</messageBody>
    <sendingDate>2015-07-08T20:48:43.2464723Z</sendingDate>
    <newMessage>0</newMessage>
  </message>
</messages>";

            //sendingDate can't be tested, since it is set to Now()
            // so only the first few lines are compared
            ret = String.Join("", ret.Split(new[] { '\r', '\n' }).Where((e, i) => i < 14));
            expected = String.Join("", expected.Split(new[] { '\r', '\n' }).Where((e, i) => i < 14));
            Assert.AreEqual( expected, ret);
        }
    }
}
