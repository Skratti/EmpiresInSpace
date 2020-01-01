using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC
{
    internal class ShipBuild
    {

        

        private int shipTemplateId;
        private int userId;
        private int colonyId;
        private bool fastBuild;        


        public ShipBuild(int _shipTemplateId, int _userId, int _colonyId, bool _fastBuild)
        {
            shipTemplateId = _shipTemplateId;
            userId = _userId;
            colonyId = _colonyId;
            fastBuild = _fastBuild;           
        }

        public string buildShip()
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;            

            //moveShip         
            SpacegameServer.Core.User user = core.users[userId];

            SpacegameServer.Core.ShipBuild builder = new Core.ShipBuild(core);
            string retValue = "";
            int newShipId = 0;
            //builder.build(shipTemplateId, userId, colonyId, fastBuild, ref retValue);
            Core.ShipBuildErrorCode errorCode = 0;
            int errorValue = 0;
            if (builder.build2(shipTemplateId, userId, colonyId, fastBuild, ref newShipId, ref errorCode, ref errorValue))
            {
                SpacegameServer.BC.XMLGroups.shipBuild built = new SpacegameServer.BC.XMLGroups.shipBuild();
                built.Colonies = new List<Core.Colony>();
                built.Colonies.Add(core.colonies[colonyId]);
                built.ship = core.ships[newShipId];

                BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.shipBuild>(built, ref retValue, true);                
            }            
            else
            {
                retValue = "<error><errorCode>" + ((int)errorCode).ToString() + "</errorCode>" + "<errorValue>" + errorValue.ToString() + "</errorValue></error>";
            }

            return retValue;
        }
    }
}
