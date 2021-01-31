using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapGenerator.StarMapSolarSystemGenerator
{

    /// <summary>
    /// Creates some planets and asteroid fields right on the starmap
    /// </summary>
    class CreateSolarSystemsOnStarmap
    {
        Settings settings;
        GalaxyMap map;

        public CreateSolarSystemsOnStarmap(Settings settings, GalaxyMap map)
        {

        }

        public void run()
        {
            foreach (var star in map.stars.Where(e=>e.StarNebulaType == 1))
            {

            }
                                        
        }

    }
}
