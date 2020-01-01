using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC.XMLGroups
{
    public class Goods
    {

        [XmlArrayItem("good", IsNullable = false)]     
        public SpacegameServer.Core.Good[] goods;

        public Goods()
        { }
    }
}
