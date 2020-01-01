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

    public partial class Colony : UserSpaceObject, Scanners, AllLockable
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

        public int GetUserid()
        {
            return userId;
        }

        private int _id;

        private int _userid;

        private string _NAME;

        private int _storage;

        public override byte scanRange { get; set; }

        private int _starid;

        private int _planetid;

        private System.Nullable<int> _shipinconstruction;

        private int _constructionduration;

        private long _population;

        private int _construction;

        private short _turnsofrioting;

        private short _TurnsOfSiege;

        private int _besiegedBy;

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public Field field { get; set; }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public SolarSystemInstance planet { get; set; }

        private List<colonyStock> _good;

        private List<ColonyBuilding> _colonyBuildings;

        private Int64 _versionId;

        private int influence;

        public Colony(int _id)
        {
            id = _id;
            _good = new List<colonyStock>();
            _colonyBuildings = new List<ColonyBuilding>();            
        }

        public Colony()
        {
            id = -1;
        }


        public Colony(int ColonyId ,int ColonyUserId ,string NAME ,
         int storage ,byte scanRange ,
         int starid ,int planetid ,
         int constructionduration ,
         long population ,int construction ,
         short turnsofrioting ,
         short TurnsOfSiege,

        int besiegedBy,

          int   researchModifier,
            int  assemblyModifier,
            int  energyModifier,
            int  housingModifier,
            int  foodModifier,
            int  productionModifier,
            int  growthModifier,
            int housing,
            Int64 versionId,
            int influence)
        {
            this.id = ColonyId;
            this.userId = ColonyUserId;
            this.name = NAME;
            this.storage = storage;
            this.scanRange = scanRange;
            this.starId = starid;
            this.planetId = planetid;
            this.constructionDuration = constructionduration;
            this.population = population;
            this.construction = construction;
            this.turnsOfRioting = turnsofrioting;
            this.TurnsOfSiege = TurnsOfSiege;
            this._besiegedBy = besiegedBy;

            this.versionId = versionId;

            this.researchModifier   = researchModifier;
            this.assemblyModifier   = assemblyModifier;
            this.energyModifier     = energyModifier;
            this.housingModifier    = housingModifier;
            this.foodModifier       = foodModifier;
            this.productionModifier = productionModifier;
            this.growthModifier     = growthModifier;
            this.housing            = housing;
            this.Influence          = influence;

            _good = new List<colonyStock>();
            _colonyBuildings = new List<ColonyBuilding>();
        }


        public static System.Data.DataTable createDataTableGoods()
        {
            var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            DataColumn column;
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "colonyId";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int16");
            column.ColumnName = "goodsId";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "amount";
            dataTable.Columns.Add(column);

            return dataTable;
        }

        public override Task save(System.Data.SqlClient.SqlCommand _command)
        {
            return Core.Instance.dataConnection.saveColony(this, _command);
        }

        public override void update(System.Data.SqlClient.SqlCommand _command)
        {
            Core.Instance.dataConnection.getColonies(Core.Instance, this.id);
        }

        public override void updateStock(System.Data.SqlClient.SqlCommand _command)
        {
            Core.Instance.dataConnection.getColonyStock(Core.Instance, Core.Instance.colonies[this.id]);
        }

        public Tuple<byte, byte> systemXY()
        {
            return new Tuple<byte, byte>((byte)(this.planet.x), (byte)(this.planet.y));
        }

        /// <summary>
        /// adds a good with amount to the goods list
        /// </summary>
        /// <param name="goodsId"></param>
        /// <param name="amount"></param>
        /// <param name="preventNegatives"></param>
        /// <param name="applyModifiers">Colony and realm modifiers. These are rounded UP! Client sided, some values get the modifiers applied after creating a sum (energy for example), which lead to differences</param>
        /// <param name="reverse">Changes check of positiveAmount</param>
        public override void addGood(short goodsId, int amount, bool preventNegatives = true, bool applyModifiers = false, bool reverse = false)
        {
            bool positiveAmount = reverse ? amount <= 0 : amount > 0;
            if (applyModifiers)
            {
                double modifier = this.getModifier(goodsId, positiveAmount);
                amount = (int)Math.Ceiling(amount * modifier);
            }

            bool foundGood = false;
            foreach (var good in this.goods)
            {
                if (good.goodsId == goodsId)
                {
                    foundGood = true;
                    good.amount += amount;
                    break;
                }
            }
            if (foundGood)
            {
                if(preventNegatives)
                    this.goods.RemoveAll(good => good.goodsId == goodsId && good.amount <= 0);
            }
            else
                this.goods.Add(new colonyStock(this.id, goodsId, amount));

        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public override int Id
        {
            get
            {
                return this._id;
            }
            set
            {
                if ((this._id != value))
                {
                    this._id = value;
                }
            }
        }

        public int id
        {
            get
            {
                return this._id;
            }
            set
            {
                if ((this._id != value))
                {
                    this._id = value;
                }
            }
        }


        public int userId
        {
            get
            {
                return this._userid;
            }
            set
            {
                if ((this._userid != value))
                {
                    this._userid = value;
                }
            }
        }

        public string name
        {
            get
            {
                return this._NAME;
            }
            set
            {
                if ((this._NAME != value))
                {
                    this._NAME = value;
                }
            }
        }

        public override int CalcStorage()
        {
            storage = colonyBuildings.Where(e => e.isActive).Sum(e => e.building.storage);
            return storage;
        }

        public int storage
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
        }


        public int starId
        {
            get
            {
                return this._starid;
            }
            set
            {
                if ((this._starid != value))
                {
                    this._starid = value;
                }
            }
        }

        public int planetId
        {
            get
            {
                return this._planetid;
            }
            set
            {
                if ((this._planetid != value))
                {
                    this._planetid = value;
                }
            }
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public System.Nullable<int> shipinconstruction
        {
            get
            {
                return this._shipinconstruction;
            }
            set
            {
                if ((this._shipinconstruction != value))
                {
                    this._shipinconstruction = value;
                }
            }
        }

        public int shipInConstruction
        {
            get
            {
                return 0;
            }
            set
            {
            }
        }

        public int constructionDuration
        {
            get
            {
                return this._constructionduration;
            }
            set
            {
                if ((this._constructionduration != value))
                {
                    this._constructionduration = value;
                }
            }
        }

        public int X
        {
            get
            {
                return this.field.x;
            }
            set
            {
            }
        }

        public int Y
        {
            get
            {
                return this.field.y;
            }
            set
            {
            }
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public override int posX
        {
            get
            {
                return this.X;
            }
            set
            {
                if ((this.X != value))
                {                    
                    this.X = value;
                }
            }
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public override int posY
        {
            get
            {
                return this.Y;
            }
            set
            {
                if ((this.Y != value))
                {
                    this.Y = value;
                }
            }
        }

        public int SystemX
        {
            get
            {
                return planet.x;
            }
            set
            {
            }
        }

        public int SystemY
        {
            get
            {
                return planet.y;
            }
            set
            {
            }
        }

        public long population
        {
            get
            {
                return this._population;
            }
            set
            {
                if ((this._population != value))
                {
                    this._population = value;
                }
            }
        }

        public System.Nullable<int> buildQueue
        {
            get
            {
                return null;
            }
            set
            {
            }
        }
        public int construction
        {
            get
            {
                return this._construction;
            }
            set
            {
                if ((this._construction != value))
                {
                    this._construction = value;
                }
            }
        }


        public short turnsOfRioting
        {
            get
            {
                return this._turnsofrioting;
            }
            set
            {
                if ((this._turnsofrioting != value))
                {
                    this._turnsofrioting = value;
                }
            }
        }

        public short  TurnsOfSiege
        {
            get
            {
                return this._TurnsOfSiege;
            }
            set
            {
                if ((this._TurnsOfSiege != value))
                {
                    this._TurnsOfSiege = value;
                }
            }
        }

        public int BesiegedBy
        {
            get
            {
                return this._besiegedBy;
            }
            set
            {
                if ((this._besiegedBy != value))
                {
                    this._besiegedBy = value;
                }
            }
        }

        


        [XmlIgnore]      
        public Int64 versionId
        {
            get
            {
                return this._versionId;
            }
            set
            {
                if ((this._versionId != value))
                {
                    this._versionId = value;
                }
            }
        }

        public int Influence
        {
            get
            {
                return this.influence;
            }
            set
            {
                if ((this.influence != value))
                {
                    this.influence = value;
                }
            }
        }

        [XmlArrayItem("good")]
        public List<colonyStock> goods
        {
            get
            {
                return _good;
            }
            set
            {
                if ((this._good != value))
                {
                    this._good = value;
                }
            }
        }

        [XmlArrayItem("ColonyBuilding")]
        public List<ColonyBuilding> colonyBuildings
        {
            get
            {
                return _colonyBuildings;
            }
            set
            {
                if ((this._colonyBuildings != value))
                {
                    this._colonyBuildings = value;
                }
            }
        }

        public bool ShouldSerializecolonyBuildings()
        {
            return true;
        }
        

    }

    
}
