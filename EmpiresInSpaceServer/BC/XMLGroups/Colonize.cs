using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.BC.XMLGroups
{
    
    public class Colonize
    {
        public int respCode;
        public Core.Colony Colony;
        //public Core.SolarSystemInstance planet;
        public SpacegameServer.BC.XMLGroups.ColonyPlanet ColonyPlanet;
        public List<Core.Ship> ships;

       

        public Colonize()
        {
            
        }
    }
}
