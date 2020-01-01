using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    //delegates - the caller will implement methods for these
    public delegate void sendEventDelegate(GalacticEvents galacticEvent);
    public delegate void CommunicationGroupsInitDelegate(int CommNodeId , int userId);
    public delegate void CommunicationGroupsRemoveUserDelegate(int CommNodeId, int userId);
    public delegate void turnEvaluationStart();
    public delegate void turnEvaluationEnd();
    public delegate void RefreshShip(int shipId, int serverVersion);
    public delegate void SendShip(object ship, List<int> userIds);
    public delegate void SendCommMessage(object commMessage, List<int> userIds);
    public delegate void SendMessage(object message, List<int> userIds);
    public delegate void SendCombat(object message, int userId);

    public delegate void SendNewTradeDelegate(object newTradeOffer);
    public delegate void DeleteTradeDelegate(int tradeId);

    
    public class SocketOut
    {
    }
}
