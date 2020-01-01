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
     [TestClass()]
    public class ResearchTest
    {
        static Core Instance;

        [ClassInitializeAttribute()]
        public static void ClassInit(TestContext context)
        {
            Instance = Core.Instance;
        }

        [TestMethod()]
        public void RecalcCostsTest()
        {
            int newUserId = (int)Instance.identities.allianceId.getNext();
            Assert.IsTrue(SpacegameServer.Core.User.registerUser(newUserId));
            User user = Instance.users[newUserId];

            //Ecosystem adaption (needs Base research)
            Research research = Core.Instance.Researchs[9];
            research.baseCost = 10;
            research.cost = 10;

            research.RecalcCosts();
            Assert.AreEqual(10, research.cost, "Research cost did change, although no user has researched it...");

            //add a colony to the user, so that he has some population (which is needed to calc research spread)
            Ship target = Instance.ships.First(ship => ship.Value.userid == user.id).Value;
            PrivateObject obj = new PrivateObject(target);
            List<Ship> ships = new List<Ship>();
            Colony newColony = null;
            SolarSystemInstance planet = Instance.planets.First(colonizable => colonizable.Value.systemid == target.systemid &&
                (colonizable.Value.objectid == 24 ||
                colonizable.Value.objectid == 25 ||
                colonizable.Value.objectid == 26)).Value;
            var retVal = obj.Invoke("createMajorColony", user, "ColonyName", ships, newColony, planet);

            research.RecalcCosts();
            Assert.AreEqual(10, research.cost, "Research cost did change, although no user has researched it...");
            

            UserResearch ResearchDone = new UserResearch(newUserId, research.id);
            ResearchDone.isCompleted = 1;
            user.PlayerResearch.Add(ResearchDone);
            research.RecalcCosts();
            Assert.AreNotEqual(10, research.cost, "Research cost did change, although no user has researched it...");
        }
    }
}
