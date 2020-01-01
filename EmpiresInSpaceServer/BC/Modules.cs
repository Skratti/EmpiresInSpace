using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC
{
    internal class Modules
    {
        public static string buildModules(int userId, int colonyId)
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;

            //moveShip         
            SpacegameServer.Core.User user = core.users[userId];
            string retValue = "";
            SpacegameServer.Core.Modules.build(userId, colonyId, ref retValue);

            //ToDo: eventually the xml will be generated here:
            return retValue;
        }

        public static string buildModules2(int _userID, string _transferXml)
        {
            string result = "";

            SpacegameServer.Core.TransferGoods.transfer(_userID, _transferXml, ref result);

            return result;
        }
    }
}
