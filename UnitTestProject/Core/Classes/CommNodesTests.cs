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
    public class CommNodesTests
    {
        static Core instance;

        [ClassInitializeAttribute()]
        public static void ClassInit(TestContext context)
        {           
            instance = Core.Instance;
            //instance = Core.testCreateCore();
            
        }

        [TestMethod()]
        public void UserHasNearbyCommNode()
        {
            User user = Mock.mockGeneratedUser(instance);

            List<SpacegameServer.BC.XMLGroups.CommNode> commNodes = SpacegameServer.BC.XMLGroups.CommNodes.createKnownAndNearNodesList(user);

            Assert.IsTrue(commNodes.Count > 0, "No comm nodes nearby");
        }

        private Ship createShipAtCommNode(User user, CommunicationNode node)
        {
            SpacegameServer.Core.ShipBuild builder = new ShipBuild(instance);
            int newShipId = (int)instance.identities.shipLock.getNext();
            ShipTemplate template = instance.shipTemplate.Where(e => e.Value.hullid == 1).First().Value;

            var targetRegionId = GeometryIndex.calcRegionId(node.positionX, node.positionY);
            Field field = GeometryIndex.regions[targetRegionId].findOrCreateField(node.positionX, node.positionY);
            Colony colony = Mock.mockColony(ColonyUserId: user.id);
            Ship newShip = builder.buildShip(newShipId, template, field, user.id, colony, false);

            return newShip;
        }

        [TestMethod()]
        public void checkShipAtCommNode()
        {
            User user = Mock.mockGeneratedUser(instance);

            List<SpacegameServer.BC.XMLGroups.CommNode> commNodes = SpacegameServer.BC.XMLGroups.CommNodes.createKnownAndNearNodesList(user);
            Assert.IsTrue(commNodes.Count > 1);
            SpacegameServer.BC.XMLGroups.CommNode BCnode = commNodes[1];
            var node = BCnode.node;

            

            Assert.IsFalse(node.checkAndAddUser(user, user.ships.First()));

            //give the user a ship at the CommNode:
            Ship newShip = this.createShipAtCommNode(user, node);
            Assert.IsTrue( node.checkAndAddUser(user, newShip));
        }

         [TestMethod()]
        public void sendCommMessage()
        {
            User user = Mock.mockGeneratedUser(instance);
            List<SpacegameServer.BC.XMLGroups.CommNode> commNodes = SpacegameServer.BC.XMLGroups.CommNodes.createKnownAndNearNodesList(user);
            var node = commNodes.First().node;
            Ship newShip = this.createShipAtCommNode(user, node);

            node.checkAndAddUser(user, newShip);        
            int messageCount = node.commNodeMessages.Count;

            node.sendCommMessage(user, "head1", "body1");
            Assert.IsTrue(node.commNodeMessages.Count == messageCount + 1);
        }

         [TestMethod()]
        public void getCommMessages()
        {
            instance.commNodes.First().Value.commNodeMessages.Clear();
            instance.identities.commNodeMessage.id = 0;

            //user 1
            User user = Mock.mockGeneratedUser(instance);
            List<SpacegameServer.BC.XMLGroups.CommNode> commNodes = SpacegameServer.BC.XMLGroups.CommNodes.createKnownAndNearNodesList(user);
            var node = commNodes.First().node;
            Ship newShip = this.createShipAtCommNode(user, node);

            node.checkAndAddUser(user, newShip);

            //add second user
            User user2 = Mock.mockGeneratedUser(instance);
            newShip = this.createShipAtCommNode(user2, node);
            node.checkAndAddUser(user2, newShip);

            //Test various stuff:
            List<CommunicationNodeMessage> result;

            //no message present:
            result = node.getCommMessages(user, 0, 50);
            Assert.IsTrue(result.Count == 0);
            // 
            result = node.getCommMessages(user2, 0, 50);
            Assert.IsTrue(result.Count == 0);

            //firstMessage
            result = node.sendCommMessage(user, "head1", "body1");
            Assert.IsTrue(result.Count == 1);
            Assert.IsTrue(result.First().id == 1);
            result = node.getCommMessages(user, 0, 50);
            Assert.IsTrue(result.First().id == 1);
            Assert.IsTrue(result.Count == 1);
            result = node.getCommMessages(user2, 0, 50);
            Assert.IsTrue(result.Count == 1);
            Assert.IsTrue(result.First().id == 1);

            
            //add 120 messages:
            for (int i = 0; i < 120; i++)
            {
                node.sendCommMessage(user, "head " + i.ToString(), "body " + i.ToString());
            }

            //user1 gets the first 50 messages
            result = node.getCommMessages(user, 0, 50);
            Assert.IsTrue(result.Count == 50);
            Assert.IsTrue(result.First().id == 121);
            //user2 gets all new messages
            result = node.getCommMessages(user2, 0, 50);
            Assert.IsTrue(result.Count == 120);

            //add 3 messages:
            for (int i = 0; i < 3; i++)
            {
                node.sendCommMessage(user, "head " + i.ToString(), "body " + i.ToString());
            }

            //user2 gets the 50 messages demanded for, and the three new messages
            //124 messages overall, read 74 to 24
            //ToDo: user might want 71 to 21, since he does nt now yet that there are 3 new ones which are also added, leading to 53 resonse-messages
            result = node.getCommMessages(user2, 50, 100);
            Assert.IsTrue(result.Count == 53);
            Assert.IsTrue(result[3].id == 74);
        }

        public void commNodeNameChange() { }
    }
}
