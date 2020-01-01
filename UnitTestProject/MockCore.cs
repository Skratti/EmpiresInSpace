using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SpacegameServer.Core;

namespace UnitTestProject
{
    public static class MockCore
    {
        public static void mockResearchQuestPrerequisites(){
            Core core = Core.Instance;
            core.ResearchQuestPrerequisites.Add(Mock.mockResearchQuestPrerequisite(1,1,1,2));
            core.ResearchQuestPrerequisites.Add(Mock.mockResearchQuestPrerequisite(1,2,1,3));
            core.ResearchQuestPrerequisites.Add(Mock.mockResearchQuestPrerequisite(1, 3, 1, 4));
        }
    }
}
