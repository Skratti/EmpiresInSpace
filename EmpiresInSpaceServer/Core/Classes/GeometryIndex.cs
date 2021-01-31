using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    public class SimpleField
    {

        /*         
         * a field is always unique!
         * each field always knows the geomtery index it resides on
         * */

        public int x;
        public int y;
        //public int id;

        //public List<Ship> ships;
        //public List<Colony> colonies;
        //public List<SolarSystemInstance> systemObjects;
        //public System.Nullable<int> starId;


        public int O;
        //public Dictionary<int, int> Influence;

        public SimpleField()
        {
        }
        public SimpleField(int _x, int _y)
        {
            //id = ((_y - GeometryIndex.startXY) * (GeometryIndex.regionsInRow * GeometryIndex.regionSize)) + _x;
            x = _x;
            y = _y;

            //ships = new List<Ship>();
            //colonies = new List<Colony>();
            //systemObjects = new List<SolarSystemInstance>();

            //Influence = new Dictionary<int, int>();
        }

        public SimpleField(Field original)
        {
            //id = original.id;
            x = original.x;
            y = original.y;

            //ships = original.ships;
            //colonies = original.colonies;
            //systemObjects = original.systemObjects;
            //starId = original.starId;

            O = original.Owner != null ? original.Owner.id : 0;
            //Influence = original.Influence;
            
        }
    }

    public class Field : Lockable
    {
        
        /*         
         * a field is always unique!
         * each field always knows the geomtery index it resides on
         * */

        public int x;
        public int y;
        public int id;
        private Area index;

        public List<Ship> ships;
        public List<Colony> colonies;
        public List<SolarSystemInstance> systemObjects;
        public System.Nullable<int> starId;


        public User Owner;
        public Dictionary<int, int> Influence;
        public List<UserSpaceObject> InfluencedBy;
        

        public int Entity;

        public Field(int _x, int _y , Area _index)
        {
            id = ((_y - GeometryIndex.startXY) * (GeometryIndex.regionsInRow * GeometryIndex.regionSize)) + _x;
            x = _x;
            y = _y;
            index = _index;
            
            ships = new List<Ship>();
            colonies = new List<Colony>();
            systemObjects = new List<SolarSystemInstance>();

            Influence = new Dictionary<int, int>();
            InfluencedBy = new List<UserSpaceObject>();

            

        }       

        public bool AddShip(Ship ship)
        {           
            this.ships.Add(ship);
            ship.field = this;
            return true;               
        }

        public bool addColony(Colony _colony)
        {
            this.colonies.Add(_colony);
            _colony.field = this;
            return true;
        }

        public bool removeShip(Ship ship)
        {            
            for (int i = 0; i < ships.Count; i++)
            {
                if (ships[i].id == ship.id)
                {
                    ships.RemoveAt(i);
                    return true;
                }
            }
            return false;               
        }
        public void getScanRange(byte _scanRange, List<int> _scannedFields)
        {
            int leftX = this.x - _scanRange;
            int upY = this.y - _scanRange;
            int rightX = this.x + _scanRange;
            int bottomY = this.y + _scanRange;

            IEnumerable<Area> regions = this.index.getNeighboursAndSelf();
            foreach (Area region in regions)
            {
                foreach (Field field in region.fields)
                {
                    if (field.x >= leftX
                        && field.x <= rightX
                        && field.y >= upY
                        && field.y <= bottomY)
                        _scannedFields.Add(field.id);

                }
            }            
        }

        public void addInfluence(int userId, int value, UserSpaceObject influenceCreator)
        {
            if (this.Influence.Any(e=>e.Key == userId))
            {
                this.Influence[userId] += value;
            }
            else
            {
                this.Influence.Add(userId, value);
                this.InfluencedBy.Add(influenceCreator);
            }
        }


        public int getDistanceTo(Field target)
        {
            int xDist = Math.Abs( this.x - target.x);
            int yDist = Math.Abs(this.y - target.y);
            return Math.Max(xDist, yDist);            
        }

        public string toWKTString()
        {            
            return "POINT ("+this.x+" "+this.y+")";
        }

        //insert a system field, get the next ship/colony free field
        public Tuple<byte, byte> nextFreeInSystem(Tuple<byte, byte> originXY)
        {
           // Tuple<byte, byte> systemXY = null;
            if (starId == null) return null;

            short size = Core.Instance.stars[(int)starId].size;

            //check all fields around the center 
            for (short radius = 1; radius < size; radius++)
            {
                int left = Math.Max((short)(originXY.Item1) - radius, 0);
                int right = Math.Min((short)(originXY.Item1) + radius, size);
                int top = Math.Max((short)(originXY.Item2) - radius, 0);
                int bottom = Math.Min((short)(originXY.Item2) + radius, size);

                for(int x = left; x <  right; x++)
                {
                    
                    for (int y = top; y < bottom;y++)                    
                    {
                        //skip all fields inside the box
                        if (left < x && x < right && top < y && y < bottom) continue;

                        if (this.ships.Any(ship => ship.systemx == x && ship.systemy == y)) continue;
                        return new Tuple<byte, byte>((byte)x, (byte)y);
                    }

                    
                }

            }

            return null;
        }

        public Field nextFreeNonSystem()
        {
            int size = Core.Instance.GalaxyMap.size;

            int targetRegionId;

            //check all fields around the center 
            for (short radius = 1; radius < size; radius++)
            {
                int left = Math.Max((short)(this.x) - radius, 0);
                int right = Math.Min((short)(this.x) + radius, size);
                int top = Math.Max((short)(this.y) - radius, 0);
                int bottom = Math.Min((short)(this.y) + radius, size);

                for (int x = left; x < right; x++)
                {
                    //skip all fields inside the box
                    for (int y = top; y < bottom; y++)
                    {
                        if (left < x && x < right && top < y && y < bottom) continue;

                        targetRegionId = GeometryIndex.calcRegionId(x, y);
                        if (GeometryIndex.regions[targetRegionId].existsField(x, y)) continue;

                        return GeometryIndex.regions[targetRegionId].findOrCreateField(x, y); 

                    }                                                 
                }
            }

            return null;
        }

        public void fieldCombat(List<Ship> ShipsFighting, User Attacker, Tuple<byte, byte> SysXY)
        {
            Core core = Core.Instance;
            //check attacker ships, find the one with the best combat ratio against any defender
            Ship AttackingShip = this.detectAttackingShip(Attacker, SysXY);
            if (AttackingShip == null) return;
            Ship Defender = this.StrongestEnemyOnField(AttackingShip, SysXY);
            if (Defender == null) return;

            //if Attacker has only non-Combatants and defender has combatants, destroy them and quit
            if (AttackingShip.attack == 0)
            {
                if (!ShipsFighting.Any(e => e.id == AttackingShip.id)) 
                { 
                    ShipsFighting.Add(AttackingShip); 
                }
                AttackingShip.destroy();
                this.fieldCombat(ShipsFighting, Attacker, SysXY);
                return;
            }

            if (Defender.attack == 0)
            {
                if (!ShipsFighting.Any(e => e.id == Defender.id)) 
                { 
                    ShipsFighting.Add(Defender); 
                }
                Defender.destroy();
                this.fieldCombat(ShipsFighting, Attacker, SysXY);
                return;
            }


            //let them fight     
            if (!ShipsFighting.Any(e => e.id == AttackingShip.id)) 
            { 
                ShipsFighting.Add(AttackingShip); 
            }
            if (!ShipsFighting.Any(e => e.id == Defender.id)) 
            { 
                ShipsFighting.Add(Defender); 
            }
            Combat Combat = new Combat((int)Core.Instance.identities.combat.getNext());
            Combat.fight(AttackingShip, Defender, this);

            //save Combat and both ships
            Core.Instance.combats[Combat.CombatId] = Combat;
            Core.Instance.dataConnection.saveCombat(Combat);

            //continue with evaluation
            this.fieldCombat(ShipsFighting, Attacker, SysXY);
            
        }

        public Ship detectAttackingShip(User Attacker, Tuple<byte,byte> SysCoords)
        {
            //var DefendingShips;
            //if (systemXY != null)
            //{
             //   DefendingShips

            CombatField CombatField = new SpacegameServer.Core.CombatField(this, SysCoords);

            var DefendingShips = this.ships.Where(ship => (ship.userid != Attacker.id
                        &&  ((SysCoords != null && ship.systemX == SysCoords.Item1 && ship.systemY == SysCoords.Item2)
                            || (SysCoords == null))
                        && UserRelations.IsLower(Core.Instance.userRelations.getRelation(Attacker.id, ship.userid) , Relation.Neutral)));

            var AttackingShips = this.ships.Where(ship => ship.userid == Attacker.id
                 && ((SysCoords != null && ship.systemX == SysCoords.Item1 && ship.systemY == SysCoords.Item2)
                        || (SysCoords == null)));

            double BestRatio = -1.0;
            Ship BestAttackerSoFar = null;

            foreach(var PossibleAttacker in AttackingShips)
            {
                if (BestAttackerSoFar == null) BestAttackerSoFar = PossibleAttacker;

                double bestDefender = Double.MaxValue;
                foreach(var Defender in DefendingShips)
                {
                    var ratio = Defender.AttackerDefenderRatio(PossibleAttacker, CombatField);
                    if (ratio < bestDefender)
                    {
                        bestDefender = ratio;
                    }
                }

                if (bestDefender > BestRatio)
                {
                    BestRatio = bestDefender;
                    BestAttackerSoFar = PossibleAttacker;
                }
            }

            //}

            return BestAttackerSoFar;
        }

        public Ship StrongestEnemyOnField(Ship attackingShip, Tuple<byte, byte> SysCoords, int attackedShipId = 0)
        {
            CombatField CombatField = new SpacegameServer.Core.CombatField(this, SysCoords);

            var DefendingShips = this.ships.Where(ship => (ship.userid != attackingShip.userid
                        && ((SysCoords != null && ship.systemX == SysCoords.Item1 && ship.systemY == SysCoords.Item2)
                            || (SysCoords == null))
                        &&  UserRelations.IsLower(Core.Instance.userRelations.getRelation(attackingShip.userid, ship.userid) , Relation.Neutral)));

            if (DefendingShips.Count() == 0 && attackedShipId != 0 && this.ships.Any(e => e.id == attackedShipId))
            {
                // the ship to attack is on the field. Add it to the DefendingShips, then add all other ships of this user or his alliance members, and all other ships from pact-members, as long as the pact is not also with the attacker
                var ShipToAttack = this.ships.First(e => e.id == attackedShipId);                                
                var UserToAttack = Core.Instance.users[ShipToAttack.userid];
                var UserThatAttacks = Core.Instance.users[attackingShip.userid];

                //Prepare Lists to get all other users that might defend the attcked ships      
                var AttackerPacts = Core.Instance.userRelations.getAllContacts(UserThatAttacks, Relation.Pact);
                List<DiplomaticEntity> ExclusivePacts = new List<DiplomaticEntity>();
                List<User> AllEnemyUsers = new List<User>();

                if (UserToAttack.allianceId != 0  && UserThatAttacks.allianceId != UserToAttack.allianceId)
                {
                    AllEnemyUsers.AddRange(Core.Instance.alliances[UserToAttack.allianceId].getUsers());
                }
                else
                {
                    AllEnemyUsers.Add(UserToAttack);
                }

                //add pact-users that are not in a pact with the attacker
                foreach (var entry in Core.Instance.userRelations.getAllContacts(UserToAttack, Relation.Pact))
                {
                    if (AttackerPacts.Any(e => e.target == entry.target)) continue;

                    AllEnemyUsers.AddRange(entry.target.getUsers());
                }

                DefendingShips = this.ships.Where(
                    ship => AllEnemyUsers.Any(enemy => enemy.id == ship.userid)  
                        && ((SysCoords != null && ship.systemX == SysCoords.Item1 && ship.systemY == SysCoords.Item2)
                            || (SysCoords == null))
                        );

            }

            //defensive pacts could provide additional defense unit at this point

            double BestRatio = Double.MaxValue;
            Ship BestDefenderSoFar = null;

            foreach (var Defender in DefendingShips)
            {
                if (BestDefenderSoFar == null) BestDefenderSoFar = Defender;

                var ratio = Defender.AttackerDefenderRatio(attackingShip, CombatField);
                if (ratio < BestRatio)
                {
                    BestRatio = ratio;
                    BestDefenderSoFar = Defender;
                }
            }

            return BestDefenderSoFar;
        }

        public List<Ship> EnemiesOnField(int defenderUserId, Tuple<byte, byte> SysCoords)
        {
            var DefendingShips = this.ships.Where(ship => (ship.userid != defenderUserId
                        && ((SysCoords != null && ship.systemX == SysCoords.Item1 && ship.systemY == SysCoords.Item2)
                            || (SysCoords == null))
                        &&  UserRelations.IsLower(Core.Instance.userRelations.getRelation(defenderUserId, ship.userid) , Relation.Neutral)));

            return DefendingShips.ToList();
        }
    }
    public static class GeometryIndex 
    {
        
        public static int startXY = 0; //0   //the upper left ccordinates


        public static readonly int regionsInRow = 41;// 41;       // leads to 200^2 regions -> ~120000 suns //ToDo: this leads to a maximum siz of the world. Units should not leave the area...
        public static readonly int regionSize = 10;
        public static List<int> neighbours = new List<int>(); //list of summands to get the ids of the 8 neighbouring regions
        public static Hashtable allFields = new Hashtable();
        public static Area[] regions = new Area[GeometryIndex.regionsInRow * GeometryIndex.regionsInRow];

        /// <summary>
        /// fetches a ring of fields aroung the destination
        /// </summary>
        /// <param name="field"></param>
        /// <param name="distance"></param>
        /// <param name="neigbouringFields"></param>
        public static void getNeighbourFields(Field field, int distance, List<Field> neigbouringFields, int overallRings)
        {
            int leftX = field.x - distance;
            int upY = field.y - distance;
            int rightX = field.x + distance;
            int bottomY = field.y + distance;

            int targetRegionId;

            // Excluded corner fields are fields that are not used, starting from a corner in each direction
            // 1 means that only the corner is missing, 2 means that the corner and one field in each direction is missing
            // 3 means that thecorner and two fields in each direction are missing etc
            //var ExcludedCornerFields = Math.max(0, 2 * distance - overallRings - 1);
            // maximum number of excluded fields is distance - 1
            var ExcludedCornerFields = (distance - 1);
            // it is reduced by 1 for each additional ring around the colony after this ring: 
            ExcludedCornerFields = ExcludedCornerFields - (overallRings - distance);
            ExcludedCornerFields = Math.Max(0, ExcludedCornerFields);


            //upper row and lower row
            for (var x = leftX + ExcludedCornerFields; x <= rightX - ExcludedCornerFields; x++)
            {
                targetRegionId = GeometryIndex.calcRegionId(x, upY);
                neigbouringFields.Add(GeometryIndex.regions[targetRegionId].findOrCreateField(x, upY));

                targetRegionId = GeometryIndex.calcRegionId(x, bottomY);
                neigbouringFields.Add(GeometryIndex.regions[targetRegionId].findOrCreateField(x, bottomY));
            }

            //left and right column (except top line and bottom line)
            var ExcludedY = Math.Max(1, ExcludedCornerFields);
            for (var y = upY + ExcludedY; y <= bottomY - ExcludedY; y++)
            {
                targetRegionId = GeometryIndex.calcRegionId(leftX, y);
                neigbouringFields.Add(GeometryIndex.regions[targetRegionId].findOrCreateField(leftX, y));

                targetRegionId = GeometryIndex.calcRegionId(rightX, y);
                neigbouringFields.Add(GeometryIndex.regions[targetRegionId].findOrCreateField(rightX, y));
            }
        }

        public static void getFields(Field field, int distance, List<Field> neigbouringFields)
        {
            int leftX = field.x - distance;
            int upY = field.y - distance;
            int rightX = field.x + distance;
            int bottomY = field.y + distance;

            int targetRegionId;
            
            //upper row and lower row
            for (var x = leftX ; x <= rightX ; x++)
            {
                for (var y = upY ; y <= bottomY ; y++)
                {
                    targetRegionId = GeometryIndex.calcRegionId(x, y);
                    if (GeometryIndex.regions[targetRegionId].existsField(x,y))
                    {
                        neigbouringFields.Add(GeometryIndex.regions[targetRegionId].findOrCreateField(x, y));
                    }                    
                }
            }            
        }
        
        /// <summary>
        /// Fetch 4 direct neighbours
        /// </summary>
        /// <param name="field"></param>
        /// <returns></returns>
        public static List<Field> getDirectNeighbours(Field field)
        {
            List<Field> neigbouringFields = new List<Field>();

            int targetRegionId;
            int x = field.x - 1;
            int y = field.y;
            targetRegionId = GeometryIndex.calcRegionId(x, y );
            neigbouringFields.Add(GeometryIndex.regions[targetRegionId].findOrCreateField(x, y));

            x = field.x + 1;
            y = field.y;
            targetRegionId = GeometryIndex.calcRegionId(x, y );
            neigbouringFields.Add(GeometryIndex.regions[targetRegionId].findOrCreateField(x, y));

            x = field.x ;
            y = field.y - 1;
            targetRegionId = GeometryIndex.calcRegionId(x, y );
            neigbouringFields.Add(GeometryIndex.regions[targetRegionId].findOrCreateField(x, y));

            x = field.x;
            y = field.y + 1;
            targetRegionId = GeometryIndex.calcRegionId(x, y );
            neigbouringFields.Add(GeometryIndex.regions[targetRegionId].findOrCreateField(x, y));

            return neigbouringFields;
        }

        public static void setNeighbours()
        {
            neighbours.Add((-regionsInRow) - 1);
            neighbours.Add((-regionsInRow));
            neighbours.Add((-regionsInRow) + 1);

            neighbours.Add(-1);
            neighbours.Add(1);

            neighbours.Add(regionsInRow - 1);
            neighbours.Add(regionsInRow);
            neighbours.Add(regionsInRow + 1);
        }

        public static int calcRegionId(int _fieldX, int _fieldY)
        {
            int regionX = (_fieldX - startXY) / regionSize;
            int regionY = (_fieldY - startXY) / regionSize;
            return  (regionY * regionsInRow) + regionX;
        }
        
        /*
         * a region consists of 10x10 fields
         * a field is always unique or null         
         * */
        

        public static void createIndex(){
            int id = 0;
            for (int x = 0; x < GeometryIndex.regionsInRow; x++)
            {
                for (int y = 0; y < GeometryIndex.regionsInRow; y++)
                {
                    GeometryIndex.regions[id] = new Area(id, x, y);
                    id++;
                }
            }

            GeometryIndex.setNeighbours();
        }
       
    }

   public class Area : Lockable{
        private int x;
        private int y;
        private int id;
        public List<Field> fields {get;set;}

        public Area(int _id, int _x, int _y)
        {
            id = _id;
            x = _x;
            y = _y;
            fields = new List<Field>();
        }
        public bool existsField(int _fieldX, int _fieldY)
        {
            for (int j = 0; j < fields.Count; j++)
            {
                if (fields[j].x == _fieldX && fields[j].y == _fieldY) return true;
            }
            return false;
        }
        

        public Field findOrCreateField(int _fieldX, int _fieldY)
        {
            for (int j = 0; j < fields.Count; j++)
            {
                if (fields[j].x == _fieldX && fields[j].y == _fieldY) return fields[j];
            }
            return createField(_fieldX, _fieldY);
        }

        private Field createField(int _fieldX, int _fieldY)
        {
            for (int i = 0; i < 10; i++)
            {
                if (setLock())
                {
                    Field field = new Field(_fieldX, _fieldY, this);
                    this.fields.Add(field);
                    GeometryIndex.allFields[field.id] = field;
                    removeLock();
                    return field;
                }
                else
                {
                    Thread.Sleep(rnd.Next(0, 50));
                    for (int j = 0; j < fields.Count; j++)
                    {
                        if (fields[j].x == _fieldX && fields[j].y == _fieldY) return fields[j];
                    }
                }
            }
            return null;
        }

        public IEnumerable<Area> getNeighboursAndSelf()
        {
            for (int i = 0; i < GeometryIndex.neighbours.Count; i++)
            {
                yield return GeometryIndex.regions[this.id + GeometryIndex.neighbours[i]];
            }
            yield return this;
        }


   }
}
