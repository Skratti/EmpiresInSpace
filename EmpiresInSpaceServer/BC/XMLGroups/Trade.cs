using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC.XMLGroups
{
    public class TradeOffers
    {
        //[XmlElement(ElementName = "PlayerResearch")]
        [XmlElement("TradeOffer")]
        public List<Core.TradeOffer> TradeOffer;
    }
}
