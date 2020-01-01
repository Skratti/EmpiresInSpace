using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SpacegameServer;
using SpacegameServer.Core;
using System.Collections.Generic;
using System.Linq;

namespace UnitTestProject
{
    [TestClass]
    public class TestDiplomacy
    {
        static Core instance;

        [ClassInitializeAttribute()]
        public static void AssemblyInit(TestContext context)
        {
            //DataConnector connector = new EmptyDataConnector();
            //instance = Core.setTestInstance(connector);
            instance = Core.Instance;

            User mocked = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(mocked.id, mocked);
            mocked = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(mocked.id, mocked);
            mocked = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(mocked.id, mocked);
            mocked = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(mocked.id, mocked);
            mocked = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());

            /*
            Alliance a1 = Mock.mockAlliance(1, "a1");
            Alliance a2 = Mock.mockAlliance(2, "a2");
            instance.alliances.TryAdd(a1.id, a1);
            instance.alliances.TryAdd(a2.id, a2);           
             * */

           
        }
        
        [TestMethod]
        public void TestSetDiplomaticEntityState()
        {
            //Empty relations
            UserRelations relations = instance.userRelations;

            User u1 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(u1.id, u1);
            User u2 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(u2.id, u2);
            
            relations.setDiplomaticEntityState(u1, u2, Relation.Neutral);
            Assert.AreEqual(relations.getUserRelationsForUser(u1)[0].Value, Relation.Neutral);
            Assert.AreEqual(relations.getRelation(u1, u2), Relation.Neutral);

            relations.setDiplomaticEntityState(u2, u1, Relation.Neutral);
            Assert.AreEqual(relations.getUserRelationsForUser(u2)[0].Value, Relation.Neutral);

            //set an existing erlation to a new value -> proposal
            relations.setDiplomaticEntityState(u1, u2, Relation.Trade);            
            //the overall relation keeps on 1 (proposal)
            Assert.AreEqual(relations.getUserRelationsForUser(u1)[0].Value, Relation.Neutral);
            Assert.AreEqual(relations.getUserRelationsForUser(u2)[0].Value, Relation.Neutral);
            Assert.AreEqual(relations.getRelation(u1, u2), Relation.Neutral);

            //set an existing erlation to a new value 1 -> 3 -> accept + proposal
            relations.setDiplomaticEntityState(u2, u1, Relation.Pact);            
            //the overall relation is now 2
            Assert.AreEqual(relations.getUserRelationsForUser(u1)[0].Value, Relation.Trade);
            Assert.AreEqual(relations.getUserRelationsForUser(u2)[0].Value, Relation.Trade);
            Assert.AreEqual(relations.getRelation(u1, u2), Relation.Trade);


        }

        [TestMethod]
        public void TestSetAllianceDiplomaticEntityState()
        {
            //Empty relations
            UserRelations relations = instance.userRelations;

            User User1 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(User1.id, User1);
            User User2 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(User2.id, User2);

            relations.setDiplomaticEntityState(User1, User2, Relation.Neutral);          
            relations.setDiplomaticEntityState(User2, User1, Relation.Neutral);
            
            //create Alliance for both users:
            Alliance.createAlliance(User1, "a1");
            var Alliance1 = instance.alliances[User1.allianceId];
            Alliance.createAlliance(User2, "a2");
            var Alliance2 = instance.alliances[User2.allianceId];

            // test status
            Assert.AreEqual(Relation.Neutral, relations.getUserRelationsForUser(User1)[0].Value);
            Assert.AreEqual(Relation.Neutral, relations.getUserRelationsForUser(User2)[0].Value);

            //change relationships, check status
            relations.setDiplomaticEntityState(Alliance1, Alliance2, Relation.Trade);
            relations.setDiplomaticEntityState(Alliance2, Alliance1, Relation.Trade);

            Assert.AreEqual(Relation.Neutral, relations.getUserRelationsForUser(User1)[0].Value);
            Assert.AreEqual(Relation.Neutral, relations.getUserRelationsForUser(User2)[0].Value);

            List<FullDiplomaticRelationProposals> diplomatics = relations.getAllDiplomatics(User1, null);
            FullDiplomaticRelationProposals ToTarget = diplomatics.Where(e => e.target == User2).First();
            Assert.AreEqual((int)Relation.Trade, ToTarget.relation);
           
        }


        [TestMethod]
        public void testTrySetRelation()
        {
            UserRelations relations = instance.userRelations;

            //newRelations is used by businessconnector to get all changes and make an xml of them
            //System.Collections.Generic.List<DiplomaticRelation> newRelations = new System.Collections.Generic.List<DiplomaticRelation>();

            User u3 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(u3.id, u3);
            User u4 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(u4.id, u4);
            User u5 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(u5.id, u5);
            User u6 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(u6.id, u6);
            //relations.setDiplomaticEntityState(u3, u4, Relation.Neutral);
            //relations.setDiplomaticEntityState(u4, u3, Relation.Neutral);
            relations.setDiplomaticEntityState(u3, u4, Relation.Trade);
            relations.setDiplomaticEntityState(u4, u3, Relation.Pact);

            System.Collections.Generic.List<SpacegameServer.Core.DiplomaticRelation> changes = new System.Collections.Generic.List<SpacegameServer.Core.DiplomaticRelation>();

            //cancel tradeTraty (2) -> set to 1 (neutral)            
            relations.trySetRelation(u3.id, u4.id, u4.diplomaticType, Relation.Neutral, changes);
            Assert.AreEqual(Relation.Neutral, relations.getRelation(u3, u4), "(u3, u4) != 1");
            Assert.AreEqual(Relation.Neutral, relations.getRelation(u4, u3), "(u4, u3) != 1");

            //offer new pact 
            relations.trySetRelation(u3.id, u4.id, u4.diplomaticType, Relation.Pact, changes);
            Assert.AreEqual(Relation.Neutral, relations.getRelation(u3, u4));
            Assert.AreEqual(Relation.Neutral, relations.getRelation(u4, u3));

            //accept trade
            relations.trySetRelation(u4.id, u3.id, u3.diplomaticType, Relation.Trade, changes);
            Assert.AreEqual(Relation.Trade,  relations.getRelation(u3, u4));
            Assert.AreEqual(Relation.Trade, relations.getRelation(u4, u3));

            //test with alliances and more users:

            Assert.IsTrue( Alliance.createAlliance(u3, "a1"));
            Alliance a1 = instance.alliances[u3.allianceId];

            Alliance.inviteTo(u3, u4);
            Assert.IsTrue(Alliance.joinCheck(u4, a1.id));


            Assert.IsTrue(Alliance.createAlliance(u5, "a2"));
            Alliance a2 = instance.alliances[u5.allianceId];

            relations.setDiplomaticEntityState(u5, u6, Relation.Neutral);
            Alliance.inviteTo(u5, u6);
            Assert.IsTrue(Alliance.joinCheck(u6, a2.id));
        
            //check for diplomatic rights:
            Assert.IsFalse(relations.trySetRelation(u6.id, a1.id, a1.diplomaticType, Relation.Trade, changes));

            //check for missing contact
            a2.getMemberRight(u6).diplomaticAdmin = true;
            //Assert.IsFalse(relations.trySetRelation(u5.id, a1.id, a1.diplomaticType, Relation.Trade, changes));

            //rights are ok, contact is ok:
            relations.setDiplomaticEntityState(u3, u5, Relation.Neutral);
            relations.setDiplomaticEntityState(u5, u3, Relation.Neutral);

            //check that relations can only be sent to the uppermost group:
            Assert.IsFalse(relations.trySetRelation(u5.id, u3.id, u3.diplomaticType, Relation.Pact, changes));

            //now the work can be done: a1 proposes 2 to a1
            Assert.IsTrue(relations.trySetRelation(u5.id, a1.id, a1.diplomaticType, Relation.Trade, changes));

            //add all other users:
            /*
            relations.setDiplomaticEntityState(u3, u6, Relation.Neutral);
            relations.setDiplomaticEntityState(u6, u3, Relation.Neutral);
            relations.setDiplomaticEntityState(u4, u5, Relation.Neutral);
            relations.setDiplomaticEntityState(u5, u4, Relation.Neutral);
            relations.setDiplomaticEntityState(u4, u6, Relation.Neutral);
            relations.setDiplomaticEntityState(u6, u4, Relation.Neutral);
            */

            //a1 declares war 
            a1.getMemberRight(u3).diplomaticAdmin = true;
            relations.trySetRelation(u3.id, a2.id, a2.diplomaticType, Relation.War, changes);
            Assert.AreEqual(Relation.War, relations.getRelation(a1, a2));
            Assert.AreEqual(Relation.War, relations.getRelation(u3, u5));
            Assert.AreEqual(Relation.War, relations.getRelation(u4, u5));
            Assert.AreEqual(Relation.War, relations.getRelation(u3, u6));
            Assert.AreEqual(Relation.War, relations.getRelation(u4, u6));
            Assert.AreEqual(Relation.War, relations.getRelation(a2, a1), "a2, a1 -> 0");
            Assert.AreEqual(Relation.War, relations.getRelation(u5, u3), "(u5, u3) -> 0");
            Assert.AreEqual(Relation.War, relations.getRelation(u5, u4), "(u5, u4) -> 0");
            Assert.AreEqual(Relation.War, relations.getRelation(u6, u3), "(u6, u3) -> 0");
            Assert.AreEqual(Relation.War, relations.getRelation(u6, u4), "(u6, u4) -> 0");

            //proposal: 4
            relations.trySetRelation(u3.id, a2.id, a2.diplomaticType, Relation.Pact, changes);
            Assert.AreEqual(Relation.War, relations.getRelation(a1, a2));
            Assert.AreEqual(Relation.War, relations.getRelation(u3, u5));
            Assert.AreEqual(Relation.War, relations.getRelation(u4, u5));
            Assert.AreEqual(Relation.War, relations.getRelation(u3, u6));
            Assert.AreEqual(Relation.War, relations.getRelation(u4, u6));

            //accepted 2
            relations.trySetRelation(u5.id, a1.id, a1.diplomaticType, Relation.Trade, changes);
            Assert.AreEqual(Relation.Trade, relations.getRelation(a1, a2), " a1, a2 -> 2");
            Assert.AreEqual(Relation.Trade, relations.getRelation(u3, u5), " u3, u5 -> 2");
            Assert.AreEqual(Relation.Trade, relations.getRelation(u4, u5), " u4, u5-> 2");
            Assert.AreEqual(Relation.Trade, relations.getRelation(u3, u6), " u3, u6 -> 2");
            Assert.AreEqual(Relation.Trade, relations.getRelation(u4, u6), " u4, u6 -> 2");
            Assert.AreEqual(Relation.Trade, relations.getRelation(a2, a1), "a2, a1 -> 2");
            Assert.AreEqual(Relation.Trade, relations.getRelation(u5, u3), "(u5, u3) -> 2");
            Assert.AreEqual(Relation.Trade, relations.getRelation(u5, u4), "(u5, u4) -> 2");
            Assert.AreEqual(Relation.Trade, relations.getRelation(u6, u3), "(u6, u3) -> 2");
            Assert.AreEqual(Relation.Trade, relations.getRelation(u6, u4), "(u6, u4) -> 2");

            relations.trySetRelation(u5.id, a1.id, a1.diplomaticType, Relation.Pact, changes);
            Assert.AreEqual(Relation.Pact, relations.getRelation(a1, a2));
            Assert.AreEqual(Relation.Pact, relations.getRelation(u3, u5));
            Assert.AreEqual(Relation.Pact, relations.getRelation(u4, u5));
            Assert.AreEqual(Relation.Pact, relations.getRelation(u3, u6));
            Assert.AreEqual(Relation.Pact, relations.getRelation(u4, u6));
                     
            //test between user and alliance:
            User u7 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(u7.id, u7);
            User u8 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(u8.id, u8);
            relations.setDiplomaticEntityState(u7, u3, Relation.Neutral);
            relations.setDiplomaticEntityState(u3, u7, Relation.Neutral);
            relations.setDiplomaticEntityState(u8, u5, Relation.Neutral);
            relations.setDiplomaticEntityState(u5, u8, Relation.Neutral);

            relations.trySetRelation(u7.id, a1.id, a1.diplomaticType, Relation.Trade, changes);
            Assert.AreEqual(Relation.Neutral, relations.getRelation(a1, u7));
            Assert.AreEqual(Relation.Neutral, relations.getRelation(u7, a1));

            //alliance(-Member) to user
            relations.trySetRelation(u5.id, u8.id, u8.diplomaticType, Relation.Trade, changes);
            Assert.AreEqual(Relation.Neutral, relations.getRelation(u5, u8));
            Assert.AreEqual(Relation.Neutral, relations.getRelation(u8, u5));
        }


        [TestMethod]
        public void testHashToDiplomaticEntity()
        {
            User u3 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(u3.id, u3);

            User u4 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(u4.id, u4);

            Assert.AreEqual(u3, UserRelations.hashToDiplomaticEntity(u3.GetHashCode(), Core.Instance));
            Assert.AreEqual(u4, UserRelations.hashToDiplomaticEntity(u4.GetHashCode(), Core.Instance));

            Alliance a1 = Mock.mockAlliance((int)instance.identities.allianceId.getNext(), "a1");
            instance.alliances.TryAdd(a1.id, a1);
            Alliance a2 = Mock.mockAlliance((int)instance.identities.allianceId.getNext(), "a2");
            instance.alliances.TryAdd(a2.id, a2);
            Assert.AreEqual(a1, UserRelations.hashToDiplomaticEntity(a1.GetHashCode(), Core.Instance));
            Assert.AreEqual(a2, UserRelations.hashToDiplomaticEntity(a2.GetHashCode(), Core.Instance));
            Assert.AreEqual(a1, UserRelations.hashToDiplomaticEntity(a1.GetHashCode(), Core.Instance));


            /*
            User u3 = instance.users[3];
            User u4 = instance.users[4];
            User u5 = instance.users[5];
            Alliance a1 = instance.alliances[1];
            Alliance a2 = instance.alliances[2];

            Assert.AreEqual(u3, UserRelations.hashToDiplomaticEntity(u3.GetHashCode(), Core.Instance));
            Assert.AreEqual(u4, UserRelations.hashToDiplomaticEntity(u4.GetHashCode(), Core.Instance));
            Assert.AreEqual(u5, UserRelations.hashToDiplomaticEntity(u5.GetHashCode(), Core.Instance));
            */
           // Assert.AreEqual(a1, UserRelations.hashToDiplomaticEntity(a1.GetHashCode(), Core.Instance));
           // Assert.AreEqual(a2, UserRelations.hashToDiplomaticEntity(a2.GetHashCode(), Core.Instance));
            //Assert.AreEqual(a1, UserRelations.hashToDiplomaticEntity(a1.GetHashCode(), Core.Instance));
        }
    }
}
