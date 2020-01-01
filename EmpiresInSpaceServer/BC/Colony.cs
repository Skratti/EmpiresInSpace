using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.BC
{
    internal class Colony
    {
        public Colony()
        {             

        }
        public static void rename(int userId, int colonyId, string name)
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;

            if (!core.colonies.ContainsKey(colonyId)) return;
            if (core.colonies[colonyId].userId != userId) return;

            core.colonies[colonyId].rename(name);
        }

        public static string Abandon(int colonyId, int userId)
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;
            //moveShip         
            SpacegameServer.Core.Colony colony = core.colonies[colonyId];
            
            //prepare output
            string ret = "";
            XMLGroups.MoveResultTree scan = new XMLGroups.MoveResultTree();
            scan.ships = new List<Core.Ship>();
            scan.stars = new List<Core.SystemMap>();
            scan.colonies = new List<Core.Colony>();

            //call abandon
            if (!colony.Abandon(userId, ref scan.ships)) return ret;
            scan.colonies.Add(colony);

            //create xml
            BusinessConnector.Serialize<BC.XMLGroups.MoveResultTree>(scan, ref ret);
            return ret;
        }
    }

    
}
