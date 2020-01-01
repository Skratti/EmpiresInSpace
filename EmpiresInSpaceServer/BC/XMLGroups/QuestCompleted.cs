using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC.XMLGroups
{
    public class Quests
    {
        [XmlElement("Quest")]
        public List<Core.UserQuest> Quest;

        [XmlArrayItem("Quest")]
        public List<XMLGroups.AllowedBuilding> allowedBuildings;
        public Quests()
        {
        }

    }
}
