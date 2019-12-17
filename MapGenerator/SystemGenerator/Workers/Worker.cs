using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapGenerator.SystemGenerator.Workers
{
    interface Worker
    {
        SolarSystem createSystem(bool _paint, bool _text, sunTypes _type, bool _startingSystem);
    }
}
