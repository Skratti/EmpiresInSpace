using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    public partial class Colony
    {
        //these values are calculated during each turn summary        
        private int _housing;
       
        private int _researchModifier;
        private int _assemblyModifier;
        private int _energyModifier;
        private int _housingModifier;
        private int _foodModifier;
        private int _productionModifier;
        private int _growthModifier;


        public Colony smallClone()
        {
            var clone = new Colony(this.id, this.userId, this.name, this.storage, this.scanRange, this.starId, this.planetId, this.constructionDuration, this.population, this.construction, 
                this.turnsOfRioting, this.TurnsOfSiege, this.BesiegedBy,
                this.researchModifier  ,
                this.assemblyModifier  ,
                this.energyModifier    ,
                this.housingModifier   ,
                this.foodModifier      ,
                this.productionModifier,
                this.growthModifier    ,
                this.housing           ,
                 this.versionId,
                 this.Influence 
                );

            clone.field = this.field;
            clone.planet = this.planet;
            foreach (var entry in this.goods) clone.goods.Add(entry.clone());

            return clone;
        }


        public override int GetUserId()
        {
            return userId;
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public override User Owner
        {
            get
            {
                return Core.Instance.users.First(e => e.Value.id == userId).Value;
            }
            set
            {
                if ((this.userId != value.id))
                {
                    this.userId = value.id;
                }
            }
        }

        /// <summary>
        /// create reference to own colonies, create reduced clones of foreign colonies. Colony-Surface and Buildings should not be transferred, goods should be transferred
        /// </summary>
        /// <param name="original"></param>
        /// <returns></returns>
        public static List<Colony> userScanCopy(List<Colony> original, int userId)
        {
            var colonies = new List<Colony>(original.Count);

            foreach (var Colony in original)
            {
                if (Colony.userId == userId)
                {
                    colonies.Add(Colony);
                }
                else
                {
                    var clone = Colony.smallClone();
                    
                    //clone.goods = 
                    colonies.Add(clone);
                }
            }

            return colonies;
        }


        public static System.Data.DataTable createDataTable()
        {
            System.Data.DataTable dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "id");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "userId");
            dataTable.AddColumn(System.Type.GetType("System.String"), "name");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "storage");
            dataTable.AddColumn(System.Type.GetType("System.Byte"), "scanRange");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "starId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "planetId");

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "shipInConstruction");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "constructionDuration");
            dataTable.AddColumn(System.Type.GetType("System.Int64"), "population");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "construction");
            dataTable.AddColumn(System.Type.GetType("System.Int16"), "turnsOfRioting");
            dataTable.AddColumn(System.Type.GetType("System.Int64"), "versionId");
            dataTable.AddColumn(System.Type.GetType("System.Int16"), "TurnsOfSiege");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "BesiegedBy");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "Influence");
            
            return dataTable;
        }

        public object createData()
        {
            return new
            {
                this.id
                ,
                this.userId
                ,
                this.name
                ,
                this.storage
                ,
                this.scanRange
                ,
                this.starId
                ,
                this.planetId
                ,
                shipInConstruction = (object)this.shipinconstruction ?? DBNull.Value
                ,
                this.constructionDuration
                ,
                this.population
                ,
                this.construction
                ,
                this.turnsOfRioting
                ,
                this.versionId
                ,
                this.TurnsOfSiege
                ,
                this.BesiegedBy
                ,
                this.Influence
            };
        }
        
        //returns a list of all surface tiles with a building on it
        
        public List<PlanetSurface> surfaceTiles
        {
            get{
                List<PlanetSurface> surface = new List<PlanetSurface>();
                foreach(var building in this.colonyBuildings)
                {
                    surface.Add(Core.Instance.planetSurface[building.planetSurfaceId]);
                }
                return surface;
            }
            set { }
        }


        public void rename(string newName)
        {
            List<Lockable> elementsToLock = new List<Lockable>(1);
            elementsToLock.Add(this);
            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return;
            }
            try
            {
                this.name = newName;
                Core.Instance.dataConnection.saveColonies(this);
            }
            catch (Exception ex)
            {
                Core.Instance.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }
        }


        /*
        public static void turnSummaryAll()
        {
            var colonies = Core.Instance.colonies;
            foreach (var colony in colonies)
            {
                //ship.Value.turnSummary();

            }
        }
        */

        public int housing
        {
            get
            {
                return this._housing;
            }
            set
            {
                if ((this._housing != value))
                {
                    this._housing = value;
                }
            }
        }

        /*public int storage
        {
            get
            {
                return this._storage;
            }
            set
            {
                if ((this._storage != value))
                {
                    this._storage = value;
                }
            }
        }*/

        public int researchModifier
        {
            get
            {
                return this._researchModifier;
            }
            set
            {
                if ((this._researchModifier != value))
                {
                    this._researchModifier = value;
                }
            }
        }

        public int assemblyModifier
        {
            get
            {
                return this._assemblyModifier;
            }
            set
            {
                if ((this._assemblyModifier != value))
                {
                    this._assemblyModifier = value;
                }
            }
        }

        public int energyModifier
        {
            get
            {
                return this._energyModifier;
            }
            set
            {
                if ((this._energyModifier != value))
                {
                    this._energyModifier = value;
                }
            }
        }

        public int housingModifier
        {
            get
            {
                return this._housingModifier;
            }
            set
            {
                if ((this._housingModifier != value))
                {
                    this._housingModifier = value;
                }
            }
        }

        public int foodModifier
        {
            get
            {
                return this._foodModifier;
            }
            set
            {
                if ((this._foodModifier != value))
                {
                    this._foodModifier = value;
                }
            }
        }

        public int productionModifier
        {
            get
            {
                return this._productionModifier;
            }
            set
            {
                if ((this._productionModifier != value))
                {
                    this._productionModifier = value;
                }
            }
        }

        public int growthModifier
        {
            get
            {
                return this._growthModifier;
            }
            set
            {
                if ((this._growthModifier != value))
                {
                    this._growthModifier = value;
                }
            }
        }

        private static double ratio2modifier(double ratio)
        {
            return (ratio - 1) * 100;
        }
        private static double modifier2Ratio(double modifier)
        {
            return (modifier / 100) + 1;
        }

        public double getModifier(short goodsId, bool amountIsPositive)
        {
            switch (goodsId)
            {
                case -1: //housing
                    return modifier2Ratio(this.housingModifier + ratio2modifier(Core.Instance.users[this.userId].housingRatio));
                case 2: //food
                    return amountIsPositive ? modifier2Ratio(this.foodModifier + ratio2modifier(Core.Instance.users[this.userId].foodRatio)) : 1.0;
                case 6: //energy
                    return amountIsPositive ? modifier2Ratio(this.energyModifier + ratio2modifier(Core.Instance.users[this.userId].energyRatio)) : 1.0;
                case 7: //assembly
                    return amountIsPositive ? modifier2Ratio(this.assemblyModifier + ratio2modifier(Core.Instance.users[this.userId].assemblyRatio)) : 1.0;
                case 8: //population
                    return modifier2Ratio(this.growthModifier);
                case 12: //research
                    return modifier2Ratio(this.researchModifier + ratio2modifier(Core.Instance.users[this.userId].researchRatio));
                case 61: //Antimatter
                    return 1.0;
                default: //production
                    return modifier2Ratio(this.productionModifier + ratio2modifier(Core.Instance.users[this.userId].industrieRatio));
            }

        }


        public void resetModifiers(){
            this.researchModifier = 0;
            this.productionModifier = 0;
            this.foodModifier = 0;
            this.researchModifier = 0;
            this.assemblyModifier = 0;
            this.housingModifier = 0;
            this.growthModifier = 0;
        }

        public bool Abandon(int previousOwnerId, ref List<Ship> ships)
        {
            Core Core = Core.Instance;
            if (!Core.users.Any(e=>e.Value.AiId == 3)) return false;
            User Separatist = Core.users.First(e=>e.Value.AiId == 3).Value;

            User oldUser = Core.users[this.userId];

            List<Lockable> elementsToLock = new List<Lockable>(1);
            elementsToLock.Add(this);
            List<Ship> shipsChangingOwnership = new List<Ship>();
            foreach (var ship in this.field.ships.Where(e => e.userid == oldUser.id && e.systemX == this.SystemX && e.systemY == this.SystemY))
            {
                shipsChangingOwnership.Add(ship);
                elementsToLock.Add(ship);                
            }

            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return false;
            }
            try
            {
                if (this.userId != previousOwnerId) return false;
                this.userId = Separatist.id;
                foreach (var colBuilding in this.colonyBuildings)
                {
                    colBuilding.userId = this.userId;
                }

                foreach (var ship in shipsChangingOwnership)
                {
                    ship.userid = Separatist.id;
                    ships.Add(ship);
                }

                //save colony and buildings
                Core.dataConnection.saveColonyFull(this.planet, this, false);

                //save Ships
                Core.dataConnection.saveShips(shipsChangingOwnership);

                GalacticEvents.AddNewEvent(GalacticEventType.ColonyAbandoned, int1: previousOwnerId, int2: this.id, string1: this.name);
            }
            catch (Exception ex)
            {
                Core.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }


            return true;
            
        }


        public void increaseInfluence()
        {
            this.Influence += (int)Math.Ceiling(this.population / 1000000000.0);
        }


        public override int AmountOnStock()
        {
            var Amount = 0;
            Amount = this.goods.Where(good => Core.Instance.Goods[good.goodsId].goodsType == 1).Sum(e => e.amount);
            //Fetch Goods that are modules, get the module data, sum up all needed ressoures for these modules.
            Amount += this.goods.Where(good => Core.Instance.Goods[good.goodsId].goodsType == 2).Select(good => new { ModuleDate = Core.Instance.Modules.First(Module => Module != null && Module.goodsId == good.goodsId), Amount = good.amount }).Sum(Modules => Modules.ModuleDate.CargoCost() * Modules.Amount);

            //comparer excludes food. 
            var comparer = this.goods.Where(good => good.goodsId != 2 && good.goodsId != 6 && good.goodsId != 7 && good.goodsId != 8).Sum(e => e.amount);
            comparer = this.goods.Where(good => good.goodsId != 6 && good.goodsId != 7 && good.goodsId != 8).Sum(e => e.amount);
            return Amount;
        }

        public int planetObjectId
        {
            get
            {
                return this.planet.objectid;
            }
            set
            {             
            }
        }

    }
}
