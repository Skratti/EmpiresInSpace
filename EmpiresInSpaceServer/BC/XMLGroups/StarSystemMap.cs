using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.BC.XMLGroups
{
    public class StarSystemMap
    {

        [System.Xml.Serialization.XmlArrayItem("SolarSystemTile")]
        public List<Core.SolarSystemInstance> SolarSystem;

        public StarSystemMap() { }
    }
}
