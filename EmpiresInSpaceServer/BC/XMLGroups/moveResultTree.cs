using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC.XMLGroups
{
    [XmlRootAttribute("scanResult")]
    public class MoveResultTree
    {
        public int respCode = 1;

        [XmlArrayItem("ship")]
        public List<SpacegameServer.Core.Ship> ships;
               
        public List<SpacegameServer.Core.Colony> colonies;


        [XmlArrayItem("star")]
        public List<SpacegameServer.Core.SystemMap> stars;

        
        public string combatLog;
        public byte result;

        public MoveResultTree()
        {            
        }
    }


    public class MovePathResult
    {
        [XmlArrayItem("StepResult")]
        public List<string> StepResults;

        public MovePathResult()
        {            
        }
    }
}
