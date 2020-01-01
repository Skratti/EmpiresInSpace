using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC
{
    internal class ShipSelfdestruct
    {        
        public static string selfdestruct(int _userId, int _shipId)
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;            

            SpacegameServer.Core.Ship ship = core.ships[_shipId];

            if (ship.userid != _userId) return "";
            if (ship.isTranscension()) return "";
            ship.selfDestruct();

            return "";
        }
    }
}
