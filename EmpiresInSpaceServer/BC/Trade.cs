using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC
{
    internal class Trade
    {
        public Trade()
        {
            
        }

        public static void acceptTrade(int userId, int senderId, int sendertype, int tradeOfferIdInt, int receiverId, int receiverType, ref string output)
        {
            SpacegameServer.Core.TradeWorker.acceptTrade(userId, senderId, sendertype, tradeOfferIdInt, receiverId, receiverType, ref output);
        }

        public static string getTrade()
        {
            string ret = "";

            SpacegameServer.BC.XMLGroups.TradeOffers TradeOffers = new XMLGroups.TradeOffers();
            TradeOffers.TradeOffer = SpacegameServer.Core.Core.Instance.tradeOffer.Values.ToList();
            //SpacegameServer.BC.XMLGroups.ColonySurface response = new XMLGroups.ColonySurface();

            //if (core.planets.ContainsKey(planetId))
            //    response.surfaceTiles = core.planets[planetId].surfaceFields;

            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.TradeOffers>(TradeOffers, ref ret, true);
            return ret;
        }
    }
}
