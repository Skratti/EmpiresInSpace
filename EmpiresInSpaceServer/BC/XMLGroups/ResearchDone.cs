using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC.XMLGroups
{
    [Serializable]
    public class allowedBuilding
    {
        public int allowedBuildingId = 0;
    }
    [Serializable]
    public class ShipHull
    {
        public int shipHullId = 0;
    }

    
    
    [Serializable]
    public class allowedModule
    {
        public int allowedModuleId = 0;
    }

    public class ResearchDone
    {
        //[XmlElement(ElementName = "PlayerResearch")]
        public List<Core.UserResearch> Researches;


        [XmlElement(ElementName = "Quest")]
        public List<Core.UserQuest> Quest;
        public List<allowedBuilding> allowedBuildings;
        public List<ShipHull> ShipHulls;
        public List<allowedModule> allowedModules;

        public ResearchDone()
        {
        }

        public static ResearchDone createResearchDone(Core.User user, List<SpacegameServer.Core.ResearchQuestPrerequisite> AllNewItems, ref List<SpacegameServer.Core.UserQuest> NewQuests)
        {
            ResearchDone fullData = new ResearchDone();
            fullData.Researches = new List<Core.UserResearch>();
            fullData.Quest = new List<Core.UserQuest>();
            fullData.allowedBuildings = new List<allowedBuilding>();
            fullData.ShipHulls = new List<ShipHull>();
            fullData.allowedModules = new List<allowedModule>();


            //Add new researches into fullData.Researches
            foreach (var newItem in AllNewItems)
            {
                if (newItem.TargetType == 1)
                {
                    Core.UserResearch newUserResearch = new Core.UserResearch();
                    newUserResearch.researchId = newItem.TargetId;
                    newUserResearch.userId = user.id;
                    newUserResearch.isCompleted = 0;
                    newUserResearch.investedResearchpoints = 0;
                    newUserResearch.researchable = 1;
                    fullData.Researches.Add(newUserResearch);
                }
            }

            //Add new quests into [UserQuests]
            fullData.Quest = NewQuests;

            //Add new Buildings
            foreach (var newItem in AllNewItems)
            {
                if (newItem.TargetType == 3)
                {
                    allowedBuilding newAllowedBuilding = new allowedBuilding();
                    newAllowedBuilding.allowedBuildingId = newItem.TargetId;
                    fullData.allowedBuildings.Add(newAllowedBuilding);
                }
            }

            //Add new Shiphulls
            foreach (var newItem in AllNewItems)
            {
                if (newItem.TargetType == 5)
                {
                    ShipHull newShipHull = new ShipHull();
                    newShipHull.shipHullId = newItem.TargetId;
                    fullData.ShipHulls.Add(newShipHull);
                }
            }

            //Add new Modules
            foreach (var newItem in AllNewItems)
            {
                if (newItem.TargetType == 4)
                {
                    allowedModule newShipHull = new allowedModule();
                    newShipHull.allowedModuleId = newItem.TargetId;
                    fullData.allowedModules.Add(newShipHull);
                }
            }

            return fullData;
        }

    }
}
