using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC.XMLGroups
{
    public class ColonySurface
    {
        [XmlArrayItem("surfaceTile")]
        public List<Core.PlanetSurface> surfaceTiles;

        public ColonySurface()
        {

        }
    }

    public class ColonyPlanet
    {
        [XmlArrayItem("surfaceTile")]
        public List<Core.PlanetSurface> SurfaceTiles;

        public int Id;

        public Core.SolarSystemInstance PlanetData;

        public ColonyPlanet()
        {

        }

        public ColonyPlanet(int id, Core.SolarSystemInstance planetData, List<Core.PlanetSurface> surfaceTiles)
        {
            this.Id = id;
            this.PlanetData = planetData;
            this.SurfaceTiles = surfaceTiles;
        }
    }

    public class ColonyPlanets
    {
        [XmlArrayItem("planet")]
        public List<ColonyPlanet> planets;

        public ColonyPlanets()
        {
            planets = new List<ColonyPlanet>();
        }
    }
}
