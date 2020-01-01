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
    public class AllianceTests
    {
        static Core instance;
        /*
        static User u3;
        static User u4;
        static User u5;
        static Alliance a1, a2;
        */
        [ClassInitializeAttribute()]
        public static void AssemblyInit(TestContext context)
        {
            //DataConnector connector = new EmptyDataConnector();
            //instance = Core.setTestInstance(connector);
            instance = Core.Instance;
            /*
            u3 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(u3.id, u3);
            u4 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(u4.id, u4);
            u5 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(u5.id, u5);
            User mocked = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(mocked.id, mocked);
            mocked = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(mocked.id, mocked);
            mocked = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(mocked.id, mocked);
            mocked = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(mocked.id, mocked);
            mocked = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(mocked.id, mocked);

            Alliance.createAlliance(u3, "a1");
            a1 = instance.alliances[u3.allianceId];

            Alliance.createAlliance(u5, "a2");
            a2 = instance.alliances[u5.allianceId];
         
            a1.memberRights.Where(e=>e.userId== u3.id).First().mayInvite = true;
            instance.userRelations.setDiplomaticEntityState(u3, u4, Relation.Neutral);
            instance.userRelations.setDiplomaticEntityState(u3, u5, Relation.Neutral);
            */
        }

        [TestMethod()]
        public void inviteToTest()
        {
            var User1 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(User1.id, User1);
            var User2 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(User2.id, User2);
            var User3 = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(User3.id, User3);

            Alliance.createAlliance(User1, "a1");
            var Alliance1 = instance.alliances[User1.allianceId];

            Alliance.createAlliance(User3, "a2");
            var Alliance2 = instance.alliances[User3.allianceId];

            //invite first player
            Alliance.inviteTo(User1, User2);
          
            Assert.AreEqual(1, instance.invitesPerAlliance[Alliance1.id].Count);
            Assert.AreEqual(1, instance.invitesPerUser[User2.id].Count);
            Assert.AreEqual(User2.id, instance.invitesPerAlliance[Alliance1.id][0]);
            Assert.AreEqual(Alliance1.id, instance.invitesPerUser[User2.id][0]);

            //invite first player again
            Alliance.inviteTo(User1, User2);

            Assert.AreEqual(1, instance.invitesPerAlliance[Alliance1.id].Count);
            Assert.AreEqual(1, instance.invitesPerUser[User2.id].Count);
            Assert.AreEqual(User2.id, instance.invitesPerAlliance[Alliance1.id][0]);
            Assert.AreEqual(Alliance1.id, instance.invitesPerUser[User2.id][0]);

            //invote second player
            Alliance.inviteTo(User1, User3);
            Assert.AreEqual(2, instance.invitesPerAlliance[Alliance1.id].Count);
            Assert.AreEqual(1, instance.invitesPerUser[User3.id].Count);
            Assert.AreEqual(User3.id, instance.invitesPerAlliance[Alliance1.id][1]);
            Assert.AreEqual(Alliance1.id, instance.invitesPerUser[User3.id][0]);

        }

        [TestMethod()]
        public void removeInvitationTest()
        {
            User one = Mock.MockUserAndAdd(instance);
            User two = Mock.MockUserAndAdd(instance);

            Alliance.createAlliance(one, "a1");
            Alliance al1 = instance.alliances[one.allianceId];

            //invite first player
            Alliance.inviteTo(one, two);

            Assert.AreEqual(1, instance.invitesPerAlliance[al1.id].Count);
            Assert.AreEqual(1, instance.invitesPerUser[two.id].Count);
            Assert.AreEqual(two.id, instance.invitesPerAlliance[al1.id][0]);
            Assert.AreEqual(al1.id, instance.invitesPerUser[two.id][0]);

            //removeInvitation first player
            Alliance.removeInvitation(one, two);
            Assert.AreEqual(0, instance.invitesPerAlliance[al1.id].Count);
            Assert.AreEqual(0, instance.invitesPerUser[two.id].Count);

        }

        [TestMethod()]
        public void joinCheckTest()
        {

            //when joining, a user is not only member of the new alliance, but does also share diplomatic relationship:
            User user1 = Mock.MockUserAndAdd(instance); //Alliance 1
            User user2 = Mock.MockUserAndAdd(instance); //Alliance 2 Relation.War
            User user3 = Mock.MockUserAndAdd(instance); //Alliance 3 Relation.Hostile
            User user4 = Mock.MockUserAndAdd(instance); //Alliance 4 Relation.Trade
            User user5 = Mock.MockUserAndAdd(instance); //Alliance 5 Relation.Trade, Relation.Pact proposed
            User user6 = Mock.MockUserAndAdd(instance); 
            User user7 = Mock.MockUserAndAdd(instance);   
            User user8 = Mock.MockUserAndAdd(instance); 
            User user9 = Mock.MockUserAndAdd(instance); 

            //the 
            User userToInvite = Mock.MockUserAndAdd(instance);

            //some users that only userToInvite has relations to:
            User user10 = Mock.MockUserAndAdd(instance);
            User user11 = Mock.MockUserAndAdd(instance);


            Alliance.createAlliance(user1, "alliance1");
            Alliance alliance1 = instance.alliances[user1.allianceId];

            Alliance.createAlliance(user2, "alliance2");
            Alliance alliance2 = instance.alliances[user2.allianceId];

            Alliance.createAlliance(user3, "alliance3");
            Alliance alliance3 = instance.alliances[user3.allianceId];

            Alliance.createAlliance(user4, "alliance4");
            Alliance alliance4 = instance.alliances[user4.allianceId];

            Alliance.createAlliance(user5, "alliance5");
            Alliance alliance5 = instance.alliances[user5.allianceId];

            //set relations from user1 to all others, including userToInvite
            UserRelations relations = instance.userRelations;

            //to ALliances
            relations.setDiplomaticEntityState(alliance1, alliance2, Relation.War);
            Assert.AreEqual(Relation.War, relations.getRelation(alliance1, alliance2));

            relations.setDiplomaticEntityState(alliance1, alliance3, Relation.Hostile);
            Assert.AreEqual(Relation.Hostile, relations.getRelation(alliance1, alliance3));

            relations.setDiplomaticEntityState(alliance1, alliance4, Relation.Trade);
            relations.setDiplomaticEntityState(alliance4, alliance1, Relation.Trade);
            Assert.AreEqual(Relation.Trade, relations.getRelation(alliance1, alliance4));

            relations.setDiplomaticEntityState(alliance1, alliance5, Relation.Pact);
            relations.setDiplomaticEntityState(alliance5, alliance1, Relation.Trade);
            Assert.AreEqual(Relation.Trade, relations.getRelation(alliance1, alliance4));

            //to Users
            relations.setDiplomaticEntityState(alliance1, user6, Relation.War);
            Assert.AreEqual(Relation.War, relations.getRelation(alliance1, user6));

            relations.setDiplomaticEntityState(alliance1, user7, Relation.Hostile);
            Assert.AreEqual(Relation.Hostile, relations.getRelation(alliance1, user7));

            relations.setDiplomaticEntityState(alliance1, user8, Relation.Trade);
            Assert.AreEqual(Relation.Neutral, relations.getRelation(alliance1, user8));

            relations.setDiplomaticEntityState(alliance1, user9, Relation.Trade);
            relations.setDiplomaticEntityState(user9, alliance1, Relation.Trade);
            Assert.AreEqual(Relation.Trade, relations.getRelation(alliance1, user9));

            relations.setDiplomaticEntityState(alliance1, userToInvite, Relation.Trade);
            relations.setDiplomaticEntityState(userToInvite, alliance1, Relation.Trade);
            Assert.AreEqual(Relation.Trade, relations.getRelation(alliance1, userToInvite));



            //set some userToInvite relations:
            relations.setDiplomaticEntityState(userToInvite, alliance3, Relation.Trade);
            relations.setDiplomaticEntityState(alliance3, userToInvite, Relation.Trade);
            Assert.AreEqual(Relation.Trade, relations.getRelation(userToInvite, alliance3));

            relations.setDiplomaticEntityState(userToInvite, alliance4, Relation.Hostile);
            relations.setDiplomaticEntityState(alliance4, userToInvite, Relation.Hostile);
            Assert.AreEqual(Relation.Hostile, relations.getRelation(userToInvite, alliance4));


            relations.setDiplomaticEntityState(userToInvite, user7, Relation.Trade);
            relations.setDiplomaticEntityState(user7, userToInvite, Relation.Trade);
            Assert.AreEqual(Relation.Trade, relations.getRelation(userToInvite, user7));

            relations.setDiplomaticEntityState(userToInvite, user9, Relation.Hostile);
            relations.setDiplomaticEntityState(user9, userToInvite, Relation.Hostile);
            Assert.AreEqual(Relation.Hostile, relations.getRelation(userToInvite, user9));



            //invite userToInvite
            Alliance.inviteTo(user1, userToInvite);

            //JOIN
            Alliance.joinCheck(userToInvite, alliance1.id);

            //check that new user is in alliance
            Assert.AreEqual(2, alliance1.members.Count);
            Assert.AreEqual(alliance1.id, userToInvite.allianceId);

            //check that new user has all relations set to the correct value


            // to alliances
            Assert.AreEqual(Relation.War, relations.getRelation(userToInvite, alliance2));
            Assert.AreEqual(Relation.Hostile, relations.getRelation(userToInvite, alliance3));
            Assert.AreEqual(Relation.Trade, relations.getRelation(userToInvite, alliance4));
            Assert.AreEqual(Relation.Trade, relations.getRelation(userToInvite, alliance4));

            //to Users
            Assert.AreEqual(Relation.War, relations.getRelation(userToInvite, user6));
            Assert.AreEqual(Relation.Hostile, relations.getRelation(userToInvite, user7));
            Assert.AreEqual(Relation.Neutral, relations.getRelation(userToInvite, user8));
            Assert.AreEqual(Relation.Trade, relations.getRelation(userToInvite, user9));
        }


        /// <summary>
        /// If a player leaves in a time where his alliane is in a war against an alliance, he should still remain at war.
        /// </summary>
        [TestMethod()]
        public void LeaveDuringWarAgainstAllianceTest()
        {

            //when joining, a user is not only member of the new alliance, but does also share diplomatic relationship:
            User user1 = Mock.MockUserAndAdd(instance); //Alliance 1
            User user2 = Mock.MockUserAndAdd(instance); //Alliance 2 Relation.War

            User user3 = Mock.MockUserAndAdd(instance); //Alliance 1 , will eave the alliance
            User user4 = Mock.MockUserAndAdd(instance); //Alliance 2 , 
         
           

            Alliance.createAlliance(user1, "alliance1");
            Alliance alliance1 = instance.alliances[user1.allianceId];

            Alliance.createAlliance(user2, "alliance2");
            Alliance alliance2 = instance.alliances[user2.allianceId];

            //invite user3
            Alliance.inviteTo(user1, user3);

            //JOIN
            Alliance.joinCheck(user3, alliance1.id);

            //invite user4
            Alliance.inviteTo(user2, user4);

            //JOIN
            Alliance.joinCheck(user4, alliance2.id);


            UserRelations relations = instance.userRelations;

            // set to War:
            //relations.setDiplomaticEntityState(alliance1, alliance2, Relation.War);
            List<SpacegameServer.Core.DiplomaticRelation> changes = new List<DiplomaticRelation>();
            relations.trySetRelation(user1.id, alliance2.id, alliance2.diplomaticType, Relation.War, changes);
            Assert.AreEqual(Relation.War, relations.getRelation(alliance1, alliance2));

            //leave alliance
            Alliance.leaveCheck(user3, user3, user3.allianceId);
            Assert.AreEqual(user3.allianceId, 0);

            foreach (var targetRelation in Core.Instance.userRelations.getAllDiplomatics(user3, 1))
            {
                if (targetRelation.target.id == user2.id) Assert.AreEqual((int)Relation.War, targetRelation.relation);
                if (targetRelation.target.id == user4.id) Assert.AreEqual((int)Relation.War, targetRelation.relation);
            }
            
 
            
        }

    }
}
