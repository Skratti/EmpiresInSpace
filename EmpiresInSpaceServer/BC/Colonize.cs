using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.BC
{
    internal class Colonize
    {      

        private int shipId;
        private int userId;
        private string newname;

        public Colonize(int _shipId, int _userId, string _newname)
        {
            shipId = _shipId;
            userId = _userId;
            newname = _newname;           
        }

        public string colonize()
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;

            //fetch user and ship objects
            SpacegameServer.Core.Ship ship = core.ships[shipId];           
            SpacegameServer.Core.User user = core.users[userId];
            
            //create result data sctructure
            string ret = "";                        
            XMLGroups.MoveResultTree scan = new XMLGroups.MoveResultTree();
            scan.ships = new List<Core.Ship>();
            scan.stars = new List<Core.SystemMap>();
            scan.colonies = new List<Core.Colony>();

            //fetch planet
            if (!core.stars.ContainsKey((int)ship.systemid)) return ret;
            Core.SolarSystemInstance planet = core.stars[(int)ship.systemid].getPlanet(ship.getSystemCoords());
            if (planet == null) return ret;
            if (!user.CanColonize(planet)) return ret;
            //var MajorColony = 

            //create Colony
            Core.Colony newColony = null;
            if (!ship.colonize(user, newname, ref scan.ships, ref newColony, planet))
                return ret;
    
            scan.ships.Add(ship);

            string shipRet = "";
            /*
            BusinessConnector.Serialize<List<SpacegameServer.Core.Ship>>(scan.ships, ref shipRet, true);
            //shipRet += ret;

            // remove </ArrayOfShip> , add ret , add </ArrayOfShip>
            shipRet = shipRet.Substring(0, shipRet.Length - "</ArrayOfShip>".Length);
            shipRet = shipRet + ret + "</ArrayOfShip>";
            */
            SpacegameServer.BC.XMLGroups.Colonize response = new XMLGroups.Colonize();
            response.respCode = 1;
            response.Colony = newColony;
            response.ships = scan.ships;
            //response.planet = planet;

            response.ColonyPlanet = new XMLGroups.ColonyPlanet(planet.id, planet, planet.surfaceFields);
            //response.planet2 = new XMLGroups.ColonyPlanets();
            //response.planet2
            //response.planets.AddRange(core.planets.Where(e => e.Value.colonyId == colonyId).Select(e => new XMLGroups.ColonyPlanet(e.Value.id, e.Value, e.Value.surfaceFields)));


            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.Colonize>(response, ref shipRet, true);

            return shipRet;
        }


    }
}
