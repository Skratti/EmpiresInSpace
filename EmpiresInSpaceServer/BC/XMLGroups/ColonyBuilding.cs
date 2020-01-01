using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.BC.XMLGroups
{
    public class ColonyBuildings
    {
        public Core.ColonyBuilding ColonyBuilding;
        public Core.PlanetSurface surfaceTile;
        public Core.CommunicationNode node;
        public int result;
        public CommNodes commNodes;
        public BC.XMLGroups.MoveResultTree scan;
        public ColonyBuildings() { }

        public ColonyBuildings(Core.ColonyBuilding colonyBuilding)
        {
            this.ColonyBuilding = colonyBuilding;
            this.result = 1;
            this.surfaceTile = Core.Core.Instance.planetSurface[colonyBuilding.planetSurfaceId];

            scan = new BC.XMLGroups.MoveResultTree();
            scan.ships = new List<Core.Ship>();
            scan.stars = new List<Core.SystemMap>();
            scan.colonies = new List<Core.Colony>();
            Core.Core.Instance.getUserScans(colonyBuilding.userId, null, ref scan.ships, ref scan.stars, ref scan.colonies, colonyBuilding.colony);

            if (colonyBuilding.node != null)
            {
                this.commNodes = new XMLGroups.CommNodes();
                this.commNodes.commNode = XMLGroups.CommNodes.createSingleNodeList(colonyBuilding.node, Core.Core.Instance.users[colonyBuilding.userId]);
            }

        }
    }
}
