using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace SpacegameServer.BC
{
    internal static class Ship
    {
        public static string constructSpaceStation(int shipId, int userId)
        {
         
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;
            //moveShip         
            SpacegameServer.Core.Ship ship = core.ships[shipId];
            SpacegameServer.Core.User user = core.users[userId];

            int newShipId = 0;

            var FinishedConstruction = ship.createSpaceStation(user, ref newShipId);
            //core.colonize(ship, user, newname, ref ret);            
            //do the action
            //ship.colonize(user, newname, ref ret);

            //calc the xml result
            XMLGroups.MoveResultTree scan = new XMLGroups.MoveResultTree();
            scan.ships = new List<Core.Ship>();
            scan.stars = new List<Core.SystemMap>();
            scan.colonies = new List<Core.Colony>();
            if (FinishedConstruction)
            {
                core.getUserScans(ship.userid, core.ships[newShipId], ref scan.ships, ref scan.stars, ref scan.colonies);

                //ship.userid = -1;
                scan.ships.Add(ship);

                //if the scan range of the new base is 0, it is not included so add it to the result manually
                if (!scan.ships.Any(e=>e.id == newShipId))
                {
                    scan.ships.Add(core.ships[newShipId]);
                }
            }

            string ret = "";            
            BusinessConnector.Serialize<BC.XMLGroups.MoveResultTree>(scan, ref ret);

            return ret;
           
        }

        public static string Repair(int shipId, int userId)
        {

            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;
            //moveShip         
            SpacegameServer.Core.Ship ship = core.ships[shipId];
            SpacegameServer.Core.User user = core.users[userId];

            Core.Colony colony = null;
            var IsRepaired = ship.Repair(user, ref colony);
            //core.colonize(ship, user, newname, ref ret);            
            //do the action
            //ship.colonize(user, newname, ref ret);

            //calc the xml result
            XMLGroups.MoveResultTree scan = new XMLGroups.MoveResultTree();
            scan.ships = new List<Core.Ship>();
            scan.stars = new List<Core.SystemMap>();
            scan.colonies = new List<Core.Colony>();

            scan.ships.Add(ship);
            scan.colonies.Add(colony);

            string ret = "";
            BusinessConnector.Serialize<BC.XMLGroups.MoveResultTree>(scan, ref ret);

            return ret;

        }

        public static string transcensionAdd(int shipId, int userId)
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;
            //break if the elements 
            if ((!core.ships.ContainsKey(shipId)) 
                || (!core.users.ContainsKey(userId))) return "";
            
            //moveShip         
            SpacegameServer.Core.Ship ship = core.ships[shipId];
            SpacegameServer.Core.User user = core.users[userId];
            int stationId;
            ship.transcensionAdd(user, out stationId);
            

            //calc the xml result
            XMLGroups.MoveResultTree scan = new XMLGroups.MoveResultTree();
            scan.ships = new List<Core.Ship>();
            scan.stars = new List<Core.SystemMap>();
            scan.colonies = new List<Core.Colony>();            

            ship.userid = -1;
            scan.ships.Add(ship);

            if (stationId != 0 && core.ships.ContainsKey(stationId))
                scan.ships.Add(core.ships[stationId]);

            string ret = "";
            BusinessConnector.Serialize<BC.XMLGroups.MoveResultTree>(scan, ref ret);

            return ret;

        }

        public static string refit( int userId, string refitXml)
        {

            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;                         
            SpacegameServer.Core.User user = core.users[userId];

            XmlDocument doc = new XmlDocument();
            doc.LoadXml(refitXml);
            string shipString = doc.DocumentElement.SelectSingleNode("/Ship/ShipId").InnerText;
            int shipId;
            if(!Int32.TryParse(shipString, out shipId)) return "";

            SpacegameServer.Core.Ship ship = core.ships[shipId];
            if (!ship.refit(refitXml)) return "";

           

            //calc the xml result
            XMLGroups.MoveResultTree scan = new XMLGroups.MoveResultTree();
            scan.ships = new List<Core.Ship>();
            scan.stars = new List<Core.SystemMap>();
            scan.colonies = new List<Core.Colony>();
            scan.ships.Add(ship);

            string ret = "";
            BusinessConnector.Serialize<BC.XMLGroups.MoveResultTree>(scan, ref ret);

            return ret;

        }

        /// <summary>
        /// Wrong name. Does in fact check if the user may be added, then ALSO adds the user to the node
        /// </summary>
        /// <param name="user"></param>
        /// <param name="ship"></param>
        /// <param name="node"></param>
        /// <returns></returns>
        public static string checkShipAtCommNode(Core.User user, Core.Ship ship, Core.CommunicationNode node)
        {
            string ret = "";


            //List<SpacegameServer.Core.DiplomaticRelation> newContacts = new List<SpacegameServer.Core.DiplomaticRelation>();
            if (!node.checkAndAddUser(user, ship)) return ret;

            SpacegameServer.BC.XMLGroups.CommNodeData nodeData = new SpacegameServer.BC.XMLGroups.CommNodeData();
            //nodeData.xmlKnownUsers = SpacegameServer.BC.XMLGroups.UserContacts.createContacts(user, newContacts);
            
            
            nodeData.commNodes = new XMLGroups.CommNodes();
            nodeData.commNodes.commNode = new List<XMLGroups.CommNode>();
            nodeData.commNodes.commNode.Add(XMLGroups.CommNode.createCommNode(node,user));

            //Todo: only transfer "new" alliance contact data
            //nodeData.allianceDiplomacy = XMLGroups.KnownAlliances.createAllianceContacts(user);
            //nodeData.allianceRelations = XMLGroups.AllianceUserRelations.createAllianceUserRelations(user);

            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.CommNodeData>(nodeData, ref ret, true);

            return ret;
        }
    }
}
