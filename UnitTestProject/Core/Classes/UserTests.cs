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
    public class UserTests
    {
        static Core Instance;

        [ClassInitializeAttribute()]
        public static void ClassInit(TestContext context)
        {
            //instance = Core.Instance;
            DataConnector connector = new EmptyDataConnector();
            Core instance = Core.setTestInstance(connector);
            Instance = instance;
            //Core instance = Core.InitTestInstance;
            //SpacegameServer.DataConnectors.SqlConnector.getGameData(instance);
            //Core.Instance.ResearchQuestPrerequisites  
        }

        [TestMethod()]
        public void canResearchTest()
        {
            int newUserId = (int)Instance.identities.allianceId.getNext();
            Assert.IsTrue(SpacegameServer.Core.User.registerUser(newUserId));

            User user = Instance.users[newUserId];

            //Arcology (not yet possible)
            Research research = Core.Instance.Researchs[52];
            Assert.IsFalse(user.canResearch(research));

            //add Base research, so that Ecosystem adaption is now enabled
            //user.PlayerResearch.Add(new UserResearch(newUserId, 1));

            //Ecosystem adaption (needs Base research)
            research = Core.Instance.Researchs[9];
            Assert.IsTrue(user.canResearch(research));  
        }

        [TestMethod()]
        public void doResearchTest()
        {
            User user = Mock.mockGeneratedUser(Instance);
            user.PlayerResearch.Add(new UserResearch(user.id, 1));

            Research research = Instance.Researchs[1];
            research.cost = 100;
            Assert.IsTrue(user.canResearch(research));



            //user.doResearch(1);
            //Assert.IsTrue(user.canResearch(research));

        }


        [TestMethod()]
        public void doResearch2Test()
        {
            User user = Mock.mockGeneratedUser(Instance);
            user.researchPoints = 100;

            Research research = Instance.Researchs[9];
            research.cost = 100;
            Assert.IsTrue(user.canResearch(research), "Player should be able to research 9");

            Assert.IsTrue(user.PlayerResearch.Count == 1);
            Assert.IsTrue(user.quests.Count == 0);
            Assert.IsTrue(user.researchPoints == 100);

            List<SpacegameServer.Core.UserQuest> NewQuests = new List<SpacegameServer.Core.UserQuest>();
            user.doResearch2(research.id, ref NewQuests);

            Assert.IsTrue(user.researchPoints == 0, "Player should not have any research points left");
            Assert.IsTrue(user.PlayerResearch.Count == 2, "Player should now have a second research");
            //Assert.IsTrue(user.canResearch(research));

        }
    }
}
