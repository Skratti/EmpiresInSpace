using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Xml.Serialization;
using System.Data;

namespace SpacegameServer.Core
{
    public partial class Route  : AllLockable
    {
        protected static int lockAll = 0;

        public static bool setLockAll()
        {
            if (0 == Interlocked.Exchange(ref lockAll, 1)) return true;
            return false;
        }

        public static void removeLockAll()
        {
            lockAll = 0;
        }

        public int getLockAll()
        {
            return lockAll;
        }

        public int routeId { get; set; }
        public bool tradeRoute { get; set; }
        public int userid { get; set; }
        public string name { get; set; }

        private List<RouteElement> _elements;
        private List<RouteStopAction> _actions;
        private List<RouteShip> _ships;
        

        [XmlElement("offered")]
        public List<RouteElement> elements { get { return _elements; } set { _elements = value; } }

        [XmlElement("actions")]
        public List<RouteStopAction> actions { get { return _actions; } set { _actions = value; } }

        [XmlElement("actions")]
        public List<RouteShip> ships { get { return _ships; } set { _ships = value; } }

        public Route(int routeId, bool tradeRoute, int userid, string name)        
        {
            this.routeId = routeId;
            this.tradeRoute = tradeRoute;
            this.userid = userid;
            this.name = name;

            this.elements = new List<RouteElement>();
            this.actions = new List<RouteStopAction>();
            this.ships = new List<RouteShip>();
        }
    }

    public partial class RouteElement 
    {
        public int routeId { get; set; }
        public Int16 stepId { get; set; }
        public int starX { get; set; }
        public int starY { get; set; }
        public int? systemX { get; set; }
        public int? systemY { get; set; }
        public int stopNo { get; set; } 

        public RouteElement(int routeId, Int16 stepId, int starX, int starY, int? systemX, int? systemY , int stopNo)
        {
            this.routeId = routeId;
            this.stepId = stepId;
            this.starX = starX;
            this.starY = starY;
            this.systemX = systemX;
            this.systemY = systemY;
            this.stopNo = stopNo;
        }
    }

    public partial class RouteStopAction
    {
        public int routeId { get; set; }
        public Int16 stepId { get; set; }
        public Int16 goodId { get; set; }
        public int amount { get; set; }

        public RouteStopAction(int routeId, Int16 stepId, Int16 goodId, int amount)
        {
            this.routeId = routeId;
            this.stepId = stepId;
            this.goodId = goodId;
            this.amount = amount;          
        }
    }

    public partial class RouteShip
    {
        public int routeId { get; set; }
        public int? shipId { get; set; }
        public int? fleetId { get; set; }
        public Int16 stepId { get; set; }

        public RouteShip(int routeId, int? shipId, int? fleetId, Int16 stepId)
        {
            this.routeId = routeId;
            this.shipId = shipId;
            this.fleetId = fleetId;
            this.stepId = stepId;
        }
    }

}
