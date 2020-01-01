using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC
{
    public class Building
    {
     
        public Building()
        {             
        }

        public static string buildBuilding(int userId, int colonyId, int tileNr, short buildingId)
        {
            string xml = "";
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;

            //moveShip         
            SpacegameServer.Core.User user = core.users[userId];
            int newBuildingId = -1;
            SpacegameServer.Core.ColonyBuildingActions.build(userId, colonyId, tileNr, buildingId, ref newBuildingId);

            if (newBuildingId == -1)
            {
                xml = @"<buildResult>
                        <result>0</result>
                        </buildResult>";
                 return xml;
            }

            Core.ColonyBuilding newBuilding = core.colonyBuildings[newBuildingId];
            SpacegameServer.BC.XMLGroups.ColonyBuildings buildResult = new XMLGroups.ColonyBuildings(newBuilding);            

            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.ColonyBuildings>(buildResult, ref xml, true);

            return xml;
        }

        public static void  changeActive(int userId, int colonyBuildingId)
        {           
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;

            if (!core.colonyBuildings.ContainsKey(colonyBuildingId)) return;
            if (core.colonyBuildings[colonyBuildingId].userId != userId) return;

            core.colonyBuildings[colonyBuildingId].changeActive();         
        }

        public static bool deconstructBuilding(int userId, int colonyId, int buildingId)
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;

            //ToDo: eventually the xml will be generated here:
            return SpacegameServer.Core.ColonyBuildingActions.deconstruct(userId, colonyId, buildingId); ;
        }

    }
}
