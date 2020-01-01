using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC
{
    internal class ShipMove
    {        
        private SpacegameServer.Core.Core core;
        int shipId;
        byte direction;
        int userId;
        int duration = 1;
        int attackedShipId = 0;
        public ShipMove(int _shipId, byte _direction, int _userId, int _duration = 1,  int _attackedShipId = 0)
        {            
            shipId = _shipId;
            direction = _direction;
            userId = _userId;
            duration = _duration;
            attackedShipId = _attackedShipId;

            core = SpacegameServer.Core.Core.Instance;
        }

        public string moveShip()
        {
            //moveShip         
            SpacegameServer.Core.Ship ship = core.ships[shipId];
            if (ship == null) return "";
            byte result = 0;

            //Todo: move kann auch occupyColony zurücksenden
            string combatLog = "";

            //SpacegameServer.Core.Classes.ShipMovement move = new SpacegameServer.Core.Classes.ShipMovement();
            Core.Combat Combat = null;
            ship.move(direction, userId, duration, ref result, ref combatLog, ref Combat, attackedShipId);

            if (Combat != null)
            {
                SpacegameServer.BC.XMLGroups.CombatMessages messages = new SpacegameServer.BC.XMLGroups.CombatMessages();
                messages.messages.Add(Combat);
                combatLog = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(messages);
            }
            //move.move(ship, direction, userId, duration, ref result, ref combatLog);
            /*
            scanResult scan = new scanResult();
            scan.ships.ship = new List<Core.Ship>();
            scan.stars.star = new List<Core.StarMap>();
            scan.colonies.colony = new List<Core.Colony>();


            core.getUserScans(ship.userid, ship, ref scan.ships.ship, ref scan.stars.star, ref scan.colonies.colony);
            scan.result = result;
            scan.combatLog = combatLog;
            */
            BC.XMLGroups.MoveResultTree scan = new BC.XMLGroups.MoveResultTree();
            scan.ships = new List<Core.Ship>();
            scan.stars = new List<Core.SystemMap>();
            scan.colonies = new List<Core.Colony>();


            core.getUserScans(ship.userid, ship, ref scan.ships, ref scan.stars, ref scan.colonies);

            //user tried to move into an area that was neutral to him
            //fetch the system/colony that creatd the neutral area
            if (result == 31)
            {
                scan.ships = new List<Core.Ship>();
                scan.stars = new List<Core.SystemMap>();
                scan.colonies = new List<Core.Colony>();
                core.getAreaCreator(direction, ship.userid, ship, ref scan.ships, ref scan.stars, ref scan.colonies);
            }

            scan.result = result;
            scan.combatLog = combatLog;


            string ret = "";
            //BusinessConnector.Serialize<SpacegameServer.Core.Ship>(ship, ref x);
            BusinessConnector.Serialize<BC.XMLGroups.MoveResultTree>(scan, ref ret);
            //fetch new data
            //ship
            //scanrange of ship
            //star
            //non user colonies + colonyStock


            
            //@combatLog
            //@output1 as result,


            //if statement breaks, just return info xml of ship
            return ret;
        }


        public static string MoveFleet(List<int> fleetIds, byte direction, int userId, int duration = 1, int attackedShipId = 0)
        {
             SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;

            List<Core.Ship> fleet = new List<Core.Ship>();
            foreach( var shipId in fleetIds )
            {
                if (!core.ships.ContainsKey(shipId)) return "";
                fleet.Add(core.ships[shipId]);
            }

            if (fleet.Count == 0) return "";
                 
            byte result = 0;

            //Todo: move kann auch occupyColony zurücksenden
            string combatLog = "";

            //SpacegameServer.Core.Classes.ShipMovement move = new SpacegameServer.Core.Classes.ShipMovement();
            Core.Combat Combat = null;
            SpacegameServer.Core.Ship.MoveFleet(fleet, direction, userId, duration, ref result, ref combatLog, ref Combat, attackedShipId);
            
            if (Combat != null)
            {
                SpacegameServer.BC.XMLGroups.CombatMessages messages = new SpacegameServer.BC.XMLGroups.CombatMessages();
                messages.messages.Add(Combat);
                combatLog = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(messages);
            }
            //move.move(ship, direction, userId, duration, ref result, ref combatLog);
            /*
            scanResult scan = new scanResult();
            scan.ships.ship = new List<Core.Ship>();
            scan.stars.star = new List<Core.StarMap>();
            scan.colonies.colony = new List<Core.Colony>();


            core.getUserScans(ship.userid, ship, ref scan.ships.ship, ref scan.stars.star, ref scan.colonies.colony);
            scan.result = result;
            scan.combatLog = combatLog;
            */
            BC.XMLGroups.MoveResultTree scan = new BC.XMLGroups.MoveResultTree();
            scan.ships = new List<Core.Ship>();
            scan.stars = new List<Core.SystemMap>();
            scan.colonies = new List<Core.Colony>();

            var MaxScanrange = fleet.Select(s => s.scanRange).Max();
            var BestScanner = fleet.First(e => e.scanRange == MaxScanrange);

            core.getUserScans(userId, BestScanner, ref scan.ships, ref scan.stars, ref scan.colonies);

            //user tried to move into an area that was neutral to him
            //fetch the system/colony that creatd the neutral area
            if (result == 31)
            {
                scan.ships = new List<Core.Ship>();
                scan.stars = new List<Core.SystemMap>();
                scan.colonies = new List<Core.Colony>();
                core.getAreaCreator(direction, userId, BestScanner, ref scan.ships, ref scan.stars, ref scan.colonies);
            }

            scan.result = result;
            scan.combatLog = combatLog;


            string ret = "";
            //BusinessConnector.Serialize<SpacegameServer.Core.Ship>(ship, ref x);
            BusinessConnector.Serialize<BC.XMLGroups.MoveResultTree>(scan, ref ret);

            //BusinessConnector.Serialize2<BC.XMLGroups.MoveResultTree>(scan, ref ret);

            //fetch new data
            //ship
            //scanrange of ship
            //star
            //non user colonies + colonyStock



            //@combatLog
            //@output1 as result,


            //if statement breaks, just return info xml of ship
            return ret;
        }

        public static BC.XMLGroups.MoveResultTree MoveFleet2(List<int> fleetIds, byte direction, int userId, int duration = 1, int attackedShipId = 0)
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;
            BC.XMLGroups.MoveResultTree scan = new BC.XMLGroups.MoveResultTree();
            scan.result = 0;

            List<Core.Ship> fleet = new List<Core.Ship>();
            foreach (var shipId in fleetIds)
            {
                if (!core.ships.ContainsKey(shipId)) return scan;
                fleet.Add(core.ships[shipId]);
            }

            if (fleet.Count == 0) return scan;

            byte result = 0;

            //Todo: move kann auch occupyColony zurücksenden
            string combatLog = "";

            //SpacegameServer.Core.Classes.ShipMovement move = new SpacegameServer.Core.Classes.ShipMovement();
            Core.Combat Combat = null;
            SpacegameServer.Core.Ship.MoveFleet(fleet, direction, userId, duration, ref result, ref combatLog, ref Combat, attackedShipId);

            if (Combat != null)
            {
                SpacegameServer.BC.XMLGroups.CombatMessages messages = new SpacegameServer.BC.XMLGroups.CombatMessages();
                messages.messages.Add(Combat);
                combatLog = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(messages);
            }
            //move.move(ship, direction, userId, duration, ref result, ref combatLog);
            /*
            scanResult scan = new scanResult();
            scan.ships.ship = new List<Core.Ship>();
            scan.stars.star = new List<Core.StarMap>();
            scan.colonies.colony = new List<Core.Colony>();


            core.getUserScans(ship.userid, ship, ref scan.ships.ship, ref scan.stars.star, ref scan.colonies.colony);
            scan.result = result;
            scan.combatLog = combatLog;
            */
            
            scan.ships = new List<Core.Ship>();
            scan.stars = new List<Core.SystemMap>();
            scan.colonies = new List<Core.Colony>();

            var MaxScanrange = fleet.Select(s => s.scanRange).Max();
            var BestScanner = fleet.First(e => e.scanRange == MaxScanrange);

            core.getUserScans(userId, BestScanner, ref scan.ships, ref scan.stars, ref scan.colonies);

            //user tried to move into an area that was neutral to him
            //fetch the system/colony that creatd the neutral area
            if (result == 31)
            {
                scan.ships = new List<Core.Ship>();
                scan.stars = new List<Core.SystemMap>();
                scan.colonies = new List<Core.Colony>();
                core.getAreaCreator(direction, userId, BestScanner, ref scan.ships, ref scan.stars, ref scan.colonies);
            }

            scan.result = result;
            scan.combatLog = combatLog;



            return scan;
        }

        public static string MovePathFleet(List<int> fleetIds, List<byte> directions, int userId, int attackedShipId = 0)
        {
            
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;

            BC.XMLGroups.MovePathResult Pathresult = new XMLGroups.MovePathResult();
            Pathresult.StepResults = new List<string>();

            foreach(var direction in directions)
            {
                Pathresult.StepResults.Add(MoveFleet(fleetIds,direction, userId, attackedShipId));
            }
 
            string ret = "";
            //BusinessConnector.Serialize<SpacegameServer.Core.Ship>(ship, ref x);
            BusinessConnector.Serialize<BC.XMLGroups.MovePathResult>(Pathresult, ref ret);


            return ret;
           
        }

        
    }
}
