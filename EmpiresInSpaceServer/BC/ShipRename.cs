using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.BC
{
    internal class ShipRename
    {       

        private int shipId;
        private int userId;
        private string newname;

        public ShipRename(int _shipId, int _userId, string _newname)
        {
            shipId = _shipId;
            userId = _userId;
            newname = _newname;          
        }

        public string rename()
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;            

            //moveShip         
            SpacegameServer.Core.Ship ship = core.ships[shipId];
            SpacegameServer.Core.User user = core.users[userId];

            if (ship.userid != userId) return "";

            ship.rename(newname);

            return "";
        }

    }
}
