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
    public partial class Ship : UserSpaceObject, Scanners, AsyncDeleteable, AllLockable, ShipStatistics
    {

        private int _id;
        private int _userid;
        private string _NAME;
        private int xpos;
        private int ypos;

        private Int64 _versionId;
        private Int64 _shipStockVersionId;
		private Int64 _shipModulesVersionId;
        private System.Nullable<byte> _systemx;
        private System.Nullable<byte> _systemy;
        private short _hitpoints;
        private short _attack;
        private short _verteidigung;
        private byte _scanrange;
        private Decimal _max_hyper;
        private Decimal _max_impuls;
        private Decimal _rest_hyper;
        private Decimal _rest_impuls;
        private bool _colonizer;
        private System.Nullable<bool> _heimat;
        private byte _hullid;
        private System.Nullable<int> _systemid;
        private int _templateid;
        private int _objectid;
        private byte _damagereduction;
        private int _energy;
		private int _crew;
		private short _cargoroom;
        private short _fuelroom;
		private long _population;
        private int _shipHullsImage;

        private byte _moveDirection = 0;
        private byte _refitCounter = 0;
        private byte _noMovementCounter = 0;

        //private byte _evasion = 0;
        private int _experience = 0;

        private int? _fleetId;
        private bool _sentry = false;
        private int? _targetX;
        private int? _targetY;
        private string _movementroute;

        private bool _harvesting = false;

        private int combatStartHitpoint = 0;
        private int combatMaxHitpoint = 0;

        // The JavaScriptSerializer ignores this field.
        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public Field field { get; set; }
        
        public ShipTranscension shipTranscension;

        private List<shipStock> _good;

        private List<shipDirection> _shipDirection;

        private List<ShipModule> _shipModules;

        public int ServerVersion = 0; //temporary value, set to 0 each time the server starts. Increased for each chage of "data that should be shared between players". Ownership, position, cargo, hitpoints
        public int ServerVersionSent = 0; //set when clients are informed about a change

        // The JavaScriptSerializer ignores this field.
        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public string ShipSerialized = "";

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public int FormerOwner = 0; //When a ship is destroyed, the Former owner should be able to get a last update about it being destroyed. If the debris is not in scan range, he is verified by this field

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public List<TradeOffer> TradeOffers;
        
        public Ship()
        {
            id = -1;                   
            _good = new List<shipStock>();
            _shipDirection = new List<shipDirection>();
            _shipModules = new List<ShipModule>();
            TradeOffers = new List<TradeOffer>();            
        }

        public Ship clone()
        {         
            Ship clone = new Ship(0);
            clone.id = this.id;
            clone.userid = this.userid;
            clone.NAME = this.NAME  ; 
            clone.energy =  this.energy  ; 
            clone.crew =   this.crew  ; 
            clone.scanRange = this.scanRange   ; 
            clone.attack = this.attack   ; 
            clone.defense = this.defense   ; 
            clone.hitpoints = this.hitpoints   ; 
            clone.damagereduction = this.damagereduction   ; 
            clone.cargoroom = this.cargoroom   ; 
            clone.fuelroom = this.fuelroom   ; 
            clone.max_hyper = this.max_hyper   ; 
            clone.max_impuls = this.max_impuls   ; 
            clone.hyper = this.hyper   ; 
            clone.impuls = this.impuls   ; 
            clone.colonizer = this. colonizer  ; 
            clone.population = this.population   ; 
            clone.shipHullsImage = this.shipHullsImage   ; 
            clone.hullid = this. hullid  ;
            clone.posX = this.posX;
            clone.posY = this.posY;
            clone._systemx = this._systemx;
            clone._systemy = this._systemy;            
            clone._systemid = this._systemid   ; 
            clone.templateid = this.templateid   ; 
            clone.refitCounter = this.refitCounter   ; 
            clone.objectid = this.objectid   ;
            clone.versionId = this.versionId;

            clone._shipModules = this.shipModules; //ToDO: can we really use the same list, or should we copy list and items?

            return clone;

        }

        public override Task save(System.Data.SqlClient.SqlCommand _command)
        {
            return Core.Instance.dataConnection.saveShip(this, _command);            
        }

        public override void update(System.Data.SqlClient.SqlCommand _command)
        {
            Core.Instance.dataConnection.getShips(Core.Instance, this.id, null);
        }

        public override void updateStock(System.Data.SqlClient.SqlCommand _command)
        {
            Core.Instance.dataConnection.getShipStock(Core.Instance, Core.Instance.ships[this.id]);
        }

        public Task delete(System.Data.SqlClient.SqlCommand _command)
        {
            return Core.Instance.dataConnection.deleteShip(this, _command);
        }


        public static System.Data.DataTable createDataTable()
        {
            var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());
            
            DataColumn column;
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "id";
            dataTable.Columns.Add(column);
            
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "userId";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.String");
            column.ColumnName = "name";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int16");
            column.ColumnName = "energy";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "crew";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Byte");
            column.ColumnName = "scanRange";
            dataTable.Columns.Add(column);
            
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int16");
            column.ColumnName = "attack";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int16");
            column.ColumnName = "defense";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int16");
            column.ColumnName = "hitpoints";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Byte");
            column.ColumnName = "damageReduction";
            dataTable.Columns.Add(column);
            
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int16");
            column.ColumnName = "cargoroom";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int16");
            column.ColumnName = "fuelroom";
            dataTable.Columns.Add(column);
             
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Decimal");
            column.ColumnName = "max_hyper";
            dataTable.Columns.Add(column);
             
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Decimal");
            column.ColumnName = "max_impuls";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Decimal");
            column.ColumnName = "hyper";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Decimal");
            column.ColumnName = "impuls";
            dataTable.Columns.Add(column);
             
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Boolean");
            column.ColumnName = "colonizer";
            dataTable.Columns.Add(column);
             
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int64");
            column.ColumnName = "population";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "shipHullsImage";
            dataTable.Columns.Add(column);

             column = new DataColumn();
            column.DataType = System.Type.GetType("System.Byte");
            column.ColumnName = "hullId";
            dataTable.Columns.Add(column);
                        	 
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Byte");
            column.ColumnName = "systemX";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Byte");
            column.ColumnName = "systemY";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "spaceX";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "spaceY";
            dataTable.Columns.Add(column);
             
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "systemId";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "templateId";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Byte");
            column.ColumnName = "refitCounter";
            dataTable.Columns.Add(column);

            dataTable.AddColumn(System.Type.GetType("System.Byte"), "noMovementCounter");
            
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "objectId";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int64");
            column.ColumnName = "versionId";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "experience";
            dataTable.Columns.Add(column);
                                                                                                    
            return dataTable;
        }

        public object createData()
        {
            this.versionId++;
            var data = this;
            return new
            {
                data.id,
                data.userid,
                NAME = data.NAME.Substring(0,Math.Min(data.NAME.Length,63)),
                //data.NAME,
                data.energy,
                data.crew,
                data.scanRange,
                data.attack,
                data.defense,
                data.hitpoints,
                data.damagereduction,
                data.cargoroom,
                data.fuelroom,
                data.max_hyper,
                data.max_impuls,
                data.hyper,
                data.impuls,
                data.colonizer,
                data.population,
                data.shipHullsImage,
                data.hullid,
                systemX = (object)data.systemx ?? DBNull.Value,
                systemY = (object)data.systemy ?? DBNull.Value,
                spaceX = data.posX,
                spaceY = data.posY,
                systemId = (object)data.systemid ?? DBNull.Value,
                data.templateid,
                data.refitCounter,
                data.noMovementCounter,
                data.objectid,
                data.versionId,
                data.Experience
            };
        }
       
        /*
        public object getData()
        {
            Ship data = this;

            return new
            {
                data.id,
                data.userid,
                data.NAME,
                data.energy,
                data.crew,
                data.scanRange,
                data.attack,
                data.defense,
                data.hitpoints,
                data.damagereduction,
                data.cargoroom,
                data.fuelroom,
                data.max_hyper,
                data.max_impuls,
                data.hyper,
                data.impuls,
                data.colonizer,
                data.population,
                data.shipHullsImage,
                data.hullid,
                data.systemX,
                data.systemY,
                spaceX = data.posX,
                spaceY = data.posY,
                data.systemId,
                data.templateid,
                data.refitCounter,
                data.objectid,
                data.versionId
            };

        }
        */
        public Ship(int _id)
        {
            id = _id;
            _good = new List<shipStock>();
            _shipDirection = new List<shipDirection>();
            _shipModules = new List<ShipModule>();
            TradeOffers = new List<TradeOffer>();
        }

        [XmlElement(ElementName = "shipId")]
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

        

        [XmlElement(ElementName = "xpos")]
        public override int posX
        {
            get
            {
                return this.xpos;
            }
            set
            {
                if ((this.xpos != value))
                {
                    ServerVersion++;
                    this.xpos = value;
                }
            }
        }

        [XmlElement(ElementName = "ypos")]
        public override int posY
        {
            get
            {
                return this.ypos;
            }
            set
            {
                if ((this.ypos != value))
                {
                    ServerVersion++;
                    this.ypos = value;
                }
            }
        }

        [XmlElement(ElementName = "ownerId")]
        public int userid
        {
            get
            {
                return this._userid;
            }
            set
            {
                if ((this._userid != value))
                {
                    ServerVersion++;
                    this._userid = value;
                }
            }
        }

        public int systemId
        {
            get
            {
                return this._systemid ?? 0;
            }
            set
            {
                if ((this._systemid != value))
                {
                    ServerVersion++;
                    this._systemid = value;
                }
            }
        }


        [XmlElement(ElementName = "name")]
        public string NAME
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


        public decimal max_hyper
        {
            get
            {
                return this._max_hyper;
            }
            set
            {
                if ((this._max_hyper != value))
                {                    
                    this._max_hyper = value;
                }
            }
        }


        public decimal max_impuls
        {
            get
            {
                return this._max_impuls;
            }
            set
            {
                if ((this._max_impuls != value))
                {
                    this._max_impuls = value;
                }
            }
        }

        [XmlElement(ElementName = "rest_hyper")]
        public decimal hyper
        {
            get
            {
                return this._rest_hyper;
            }
            set
            {
                if ((this._rest_hyper != value))
                {
                    ServerVersion++;
                    this._rest_hyper = value;
                }
            }
        }

        [XmlElement(ElementName = "rest_impuls")]
        public decimal impuls
        {
            get
            {
                return this._rest_impuls;
            }
            set
            {
                if ((this._rest_impuls != value))
                {
                    ServerVersion++;
                    this._rest_impuls = value;
                }
            }
        }

        public short hitpoints
        {
            get
            {
                return this._hitpoints;
            }
            set
            {
                if ((this._hitpoints != value))
                {
                    ServerVersion++;
                    this._hitpoints = value;
                }
            }
        }


        [XmlElement(ElementName = "damageReduction")]
        public byte damagereduction
        {
            get
            {
                return this._damagereduction;
            }
            set
            {
                if ((this._damagereduction != value))
                {
                    this._damagereduction = value;
                }
            }
        }


        // The JavaScriptSerializer ignores this field.
        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public System.Nullable<byte> systemx
        {
            get
            {
                return this._systemx;
            }
            set
            {
                if ((this._systemx != value))
                {
                    ServerVersion++;
                    this._systemx = value;
                }
            }
        }

        // The JavaScriptSerializer ignores this field.
        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]

        public System.Nullable<byte> systemy
        {
            get
            {
                return this._systemy;
            }
            set
            {
                if ((this._systemy != value))
                {
                    ServerVersion++;
                    this._systemy = value;
                }
            }
        }

        [System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Never)]
        public byte systemX
        {
            get
            {
                return this._systemx == null ? (byte)0 : (byte)this._systemx;
            }
            set
            {
                if ((this._systemx != value))
                {
                    ServerVersion++;
                    this._systemx = value;
                }
            }
        }

        [System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Never)]
        public byte systemY
        {
            get
            {
                return this._systemy == null ? (byte)0 : (byte)this._systemy;
            }
            set
            {
                if ((this._systemy != value))
                {
                    ServerVersion++;
                    this._systemy = value;
                }
            }
        }

        [XmlElement(ElementName = "scanRange")]
        public override byte scanRange
        {
            get
            {
                return this._scanrange;
            }
            set
            {
                if ((this._scanrange != value))
                {
                    this._scanrange = value;
                }
            }
        }

        // The JavaScriptSerializer ignores this field.
        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public bool colonizerBool
        {
            get
            {
                return this._colonizer;
            }
            set
            {
                if ((this._colonizer != value))
                {
                    this._colonizer = value;
                }
            }
        }

        public byte colonizer
        {
            get
            {
                return this._colonizer ? (byte)1 : (byte)0;
            }
            set
            {
                bool newValue = value == 1 ? true  : false;
                if ((this._colonizer != newValue))
                {
                    this._colonizer = newValue;
                }
            }
        }


        [XmlElement(ElementName = "hullId")]
        public byte hullid
        {
            get
            {
                return this._hullid;
            }
            set
            {
                if ((this._hullid != value))
                {
                    ServerVersion++;
                    this._hullid = value;
                }
            }
        }

        public short attack
        {
            get
            {
                return this._attack;
            }
            set
            {
                if ((this._attack != value))
                {
                    ServerVersion++;
                    this._attack = value;
                }
            }
        }
        [XmlElement(ElementName = "verteidigung")]
        public short defense
        {
            get
            {
                return this._verteidigung;
            }
            set
            {
                if ((this._verteidigung != value))
                {
                    ServerVersion++;
                    this._verteidigung = value;
                }
            }
        }

        // The JavaScriptSerializer ignores this field.
        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public System.Nullable<bool> heimat
        {
            get
            {
                return this._heimat;
            }
            set
            {
                if ((this._heimat != value))
                {
                    this._heimat = value;
                }
            }
        }

        [System.Xml.Serialization.XmlIgnoreAttribute]
        public System.Nullable<int> systemid
        {
            get
            {
                return this._systemid;
            }
            set
            {
                if ((this._systemid != value))
                {
                    ServerVersion++;
                    this._systemid = value;
                }
            }
        }

        [XmlElement(ElementName = "templateId")]
        public int templateid
        {
            get
            {
                return this._templateid;
            }
            set
            {
                if ((this._templateid != value))
                {
                    this._templateid = value;
                }
            }
        }

        [XmlElement(ElementName = "objectId")]
        public int objectid
        {
            get
            {
                return this._objectid;
            }
            set
            {
                if ((this._objectid != value))
                {
                    this._objectid = value;
                }
            }
        }

        public int energy
        {
            get
            {
                return this._energy;
            }
            set
            {
                if ((this._energy != value))
                {
                    this._energy = value;
                }
            }
        }

        public int crew
        {
            get
            {
                return this._crew;
            }
            set
            {
                if ((this._crew != value))
                {
                    this._crew = value;
                }
            }
        }

        public short cargoroom
        {
            get
            {
                return this._cargoroom;
            }
            set
            {
                if ((this._cargoroom != value))
                {
                    ServerVersion++;
                    this._cargoroom = value;
                }
            }
        }

        public short fuelroom
        {
            get
            {
                return this._fuelroom;
            }
            set
            {
                if ((this._fuelroom != value))
                {
                    this._fuelroom = value;
                }
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
        
        public int shipHullsImage
        {
            get
            {
                return this._shipHullsImage;
            }
            set
            {
                if ((this._shipHullsImage != value))
                {
                    this._shipHullsImage = value;
                }
            }
        }
        

        public byte moveDirection
        {
            get
            {
                return _shipDirection.Count > 0 ? _shipDirection[0].moveDirection : (byte)0;
            }
            set
            {
                if ((this._moveDirection != value))
                {
                    shipDirection x = new shipDirection();
                    x.shipId = _id;
                    x.moveCounter = 0;
                    x.moveDirection = value;

                    foreach (shipDirection shipDirections in _shipDirection)
                    {
                        shipDirections.moveCounter += 1;
                    }

                    _shipDirection.Insert(0, x);

                    List<AsyncInsertable> toInsert = new List<AsyncInsertable>();
                    toInsert.Add(x);
                    Core.Instance.dataConnection.insertAsyncTransaction(toInsert);

                    //this._moveDirection = value;
                }
            }
        }

        public byte refitCounter
        {
            get
            {
                return this._refitCounter;
            }
            set
            {
                if ((this._refitCounter != value))
                {
                    ServerVersion++;
                    this._refitCounter = value;
                }
            }
        }

        public byte noMovementCounter
        {
            get
            {
                return this._noMovementCounter;
            }
            set
            {
                if ((this._noMovementCounter != value))
                {
                    this._noMovementCounter = value;
                }
            }
        }

        /*
        public byte Evasion
        {
            get
            {
                return this._evasion;
            }
            set
            {
                if ((this._evasion != value))
                {
                    this._evasion = value;
                }
            }
        }
        */



        // The JavaScriptSerializer ignores this field.
        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public List<shipDirection> shipDirection
        {
            get
            {

                return _shipDirection;
            }
            set
            {
                if ((this._shipDirection != value))
                {
                    this._shipDirection = value;
                }
            }
        }

        [XmlElement(ElementName = "good")]
        public List<shipStock> goods
        {
            get
            {
                return _good;
            }            
        }

       
        [XmlElement(ElementName = "shipModules")]
        public List<ShipModule> shipModules
        {
            get
            {
                return _shipModules;
            }
        }

        // The JavaScriptSerializer ignores this field.
        [System.Web.Script.Serialization.ScriptIgnore]
        [XmlIgnore]
        public List<ShipStatisticModulePosition> shipStatisticsModules
        {
            get
            {
                return _shipModules.OfType<ShipStatisticModulePosition>().ToList();
            }
        }

        public Tuple<byte, byte> getSystemCoords()
        {
            //ToDo: remove conversion, change DB...
            if (this.systemid == null) return null;
            return new Tuple<byte, byte>((byte)this.systemx, (byte)this.systemy);
        }

        // The JavaScriptSerializer ignores this field.
        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
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
        // The JavaScriptSerializer ignores this field.
        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public Int64 shipStockVersionId
        {
            get
            {
                return this._shipStockVersionId;
            }
            set
            {
                if ((this._shipStockVersionId != value))
                {
                    ServerVersion++;
                    this._shipStockVersionId = value;
                }
            }
        }
        // The JavaScriptSerializer ignores this field.
        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public Int64 shipModulesVersionId
        {
            get
            {
                return this._shipModulesVersionId;
            }
            set
            {
                if ((this._shipModulesVersionId != value))
                {
                    this._shipModulesVersionId = value;
                }
            }
        }

        public int Experience
        {
            get
            {
                return this._experience;
            }
            set
            {
                if ((this._experience != value))
                {
                    this._experience = value;
                }
            }
        }

        public int? FleetId
        {
            get
            {
                return this._fleetId;
            }
            set
            {
                if ((this._fleetId != value))
                {
                    this._fleetId = value;
                }
            }
        }

        public Boolean Sentry
        {
            get
            {
                return this._sentry;
            }
            set
            {
                if ((this._sentry != value))
                {
                    this._sentry = value;
                }
            }
        }

        public Boolean Harvesting
        {
            get
            {
                return this._harvesting;
            }
            set
            {
                if ((this._harvesting != value))
                {
                    this._harvesting = value;
                }
            }
        }
        

        public int? TargetX
        {
            get
            {
                return this._targetX;
            }
            set
            {
                if ((this._targetX != value))
                {
                    this._targetX = value;
                }
            }
        }

        public int? TargetY
        {
            get
            {
                return this._targetY;
            }
            set
            {
                if ((this._targetY != value))
                {
                    this._targetY = value;
                }
            }
        }

        public string MovementRoute
        {
            get
            {
                return this._movementroute;
            }
            set
            {
                if ((this._movementroute != value))
                {
                    this._movementroute = value;
                }
            }
        }

        // The JavaScriptSerializer ignores this field.
        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public int CombatStartHitpoint
        {
            get
            {
                return this.combatStartHitpoint;
            }
            set
            {
                if ((this.combatStartHitpoint != value))
                {
                    this.combatStartHitpoint = value;
                }
            }
        }

        // The JavaScriptSerializer ignores this field.
        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public int CombatMaxHitpoint
        {
            get
            {
                return this.combatMaxHitpoint;
            }
            set
            {
                if ((this.combatMaxHitpoint != value))
                {
                    this.combatMaxHitpoint = value;
                }
            }
        }
    }
}