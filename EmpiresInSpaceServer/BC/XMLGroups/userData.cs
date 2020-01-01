using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC.XMLGroups
{

    public class StaticMap
    {
        [XmlArrayItem("star")]
        public List<SpacegameServer.Core.SystemMap> stars;

        public SpacegameServer.Core.GalaxyMap GalaxyMap;
    }

    public class ShipTemplates
    {
        public List<SpacegameServer.Core.ShipTemplate> ShipTemplate;

        public ShipTemplates(){
            ShipTemplate = new List<Core.ShipTemplate>();
        }
    }

    public class AllowedBuilding
    {
        public int allowedBuildingId;

        public AllowedBuilding()
        {
        }

        public AllowedBuilding(int allowedBuildingId)
        {
            this.allowedBuildingId = allowedBuildingId;
        }

        public static List<AllowedBuilding> createAllowedBuildings(Core.User player)
        {
            List<AllowedBuilding> allowedBuildings = new List<AllowedBuilding>();

            foreach (var building in Core.Core.Instance.Buildings.Where(e=> e != null))
            {
                if (player.hasGameObjectEnabled(3, building.id))
                {
                    allowedBuildings.Add(new AllowedBuilding(building.id));
                }
            }

            return allowedBuildings; 
        }

    }

    public class AllowedShipHulls
    {
        public int shipHullId;

        public AllowedShipHulls()
        {
        }
        public AllowedShipHulls(int shipHullId)
        {
            this.shipHullId = shipHullId;
        }

        public static List<AllowedShipHulls> createAllowedShipHulls(Core.User player)
        {
            List<AllowedShipHulls> allowedShipHulls = new List<AllowedShipHulls>();

            foreach (var hull in Core.Core.Instance.ShipHulls.Where(e => e != null))
            {
                if (player.hasGameObjectEnabled(5, hull.id))
                {
                    allowedShipHulls.Add(new AllowedShipHulls(hull.id));
                }
            }

            return allowedShipHulls;
        }

    }

    public class AllowedModule
    {
        public int allowedModuleId;

        public AllowedModule()
        {
        }

        public AllowedModule(int allowedModuleId)
        {
            this.allowedModuleId = allowedModuleId;
        }

        public static List<AllowedModule> createAllowedModules(Core.User player)
        {
            List<AllowedModule> allowedModules = new List<AllowedModule>();

            foreach (var module in Core.Core.Instance.Modules.Where(e => e != null))
            {
                if (player.hasGameObjectEnabled(4, module.id))
                {
                    allowedModules.Add(new AllowedModule(module.id));
                }
            }

            return allowedModules;
        }

    }

    public class Labels
    {
        public int languageId;

        public List<SpacegameServer.Core.Label> Label;

        public Labels()
        {
        }

        public static Labels GetLabels(int languageId)
        {
            var labels = new XMLGroups.Labels();
            labels.languageId = languageId;
            labels.Label = Core.Core.Instance.labels.Where(e => e.languageId == languageId).ToList();

            return labels;
        }
    }

    public class userData
    {
        /*
        public Core.User user;
        public int allianceId;
        public string languageShortName;

        public languages languages;
        public int messageHighestId;
        public int unreadMessages;
        public int maxServerEventId;
        public nextTurn nextTurn;
        public map galaxyMap;
       */

        public Core.User user;

        //public string languageShortName;
       

        [XmlArrayItem("language")]
        public List<SpacegameServer.Core.Language> languages;

        public int messageHighestId;
        public int unreadMessages;
        public int maxServerEventId;

        [XmlArrayItem("allowedBuilding")]
        public List<AllowedBuilding> allowedBuildings;

        [XmlArrayItem("PlayerResearch")]
        public List<SpacegameServer.Core.UserResearch> PlayerResearches;

        [XmlArrayItem("ShipHull")]
        public List<AllowedShipHulls> ShipHulls;

        [XmlArrayItem("ShipTemplate")]
        public List<SpacegameServer.Core.ShipTemplate> ShipTemplates;

        [XmlArrayItem("Quest")]
        public List<SpacegameServer.Core.UserQuest> Quests;

        [XmlArrayItem("allowedModule")]
        public List<AllowedModule> allowedModules;

        //ToDo: Check this
        [XmlArrayItem("TradeOffer")]
        public List<SpacegameServer.Core.TradeOffer> TradeOffers;
        


        [XmlArrayItem("ship")]
        public List<SpacegameServer.Core.Ship> ships;        

        [XmlArrayItem("Colony")]
        public List<SpacegameServer.Core.Colony> Colonies;
        

        public UserContacts knownUsers;
        public KnownAlliances allianceDiplomacy;
        public AllianceUserRelations allianceRelations;
        public AllianceInvites allianceInvites;

        public CommNodes commNodes;

        public StaticMap staticMap;

        public string targetTime;

        public bool unreadCombatMessages = false;
        /*
        public knownUsers knownUsers;
        public knownAlliancesXml knownAlliancesXml;
        public knownNodes knownNodes;
        public knownBuildings knownBuildings;
        public ShipHullXML ShipHullXML;
        public shipTemplates shipTemplates;
        public knownModules knownModules;
        public tradeOffers tradeOffers;
        public colonies colonies;
        public colonyBuildings colonyBuildings;
        public labels labels;      
        */

        public Labels Labels;

        public userData() { }
    }
}
