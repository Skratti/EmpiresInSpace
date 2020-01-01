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
    public class BCUser
    {
        static Core Instance;

        [ClassInitializeAttribute()]
        public static void ClassInit(TestContext context)
        {
            Instance = Core.Instance;
        }

        [TestMethod()]
        public void doBCResearch2Test()
        {
            User user = Mock.mockGeneratedUser(Instance);
            user.researchPoints = 100;
            user.PlayerResearch.Add(new UserResearch(user.id, 400));

            int researchId = 501; //9, 501
            Research research = Instance.Researchs[researchId];
            research.cost = 100;
            Assert.IsTrue(user.canResearch(research), "Player should be able to research 9");

            Assert.IsTrue(user.PlayerResearch.Count == 2);
            Assert.IsTrue(user.quests.Count == 0);
            Assert.IsTrue(user.researchPoints == 100);

            string ret = "";
            SpacegameServer.BC.BusinessConnector bc;
            bc = new SpacegameServer.BC.BusinessConnector();
            ret = bc.doResearch(user.id, research.id);   

            Assert.IsTrue(user.researchPoints == 0, "Player should not have any research points left");
            Assert.IsTrue(user.PlayerResearch.Count == 3, "Player should now have a second research");

            Assert.AreEqual(@"<ResearchDone>
  <Researches>
    <PlayerResearch>
      <id>11</id>
      <researchable>1</researchable>
      <isCompleted>0</isCompleted>
      <investedResearchpoints>0</investedResearchpoints>
      <researchPriority>0</researchPriority>
    </PlayerResearch>
  </Researches>
  <allowedBuildings />
  <ShipHulls>
    <ShipHull>
      <shipHullId>199</shipHullId>
    </ShipHull>
  </ShipHulls>
  <allowedModules>
    <allowedModule>
      <allowedModuleId>499</allowedModuleId>
    </allowedModule>
  </allowedModules>
</ResearchDone>", ret, "Return string is not as expected");

            //Assert.IsTrue(user.canResearch(research));

        }
    }
}
