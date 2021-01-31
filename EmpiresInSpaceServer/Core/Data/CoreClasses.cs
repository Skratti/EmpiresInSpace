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
    static class Extensions
    {
        /// <summary>
        ///"Adds Columns" to a DataTable
        /// </summary>
        /// <param name="SourceTable">Input DataTable</param>
        /// <param name="FieldNames">Fields to select (distinct)</param>
        /// <param name="Filter">Optional filter to be applied to the selection</param>
        /// <returns></returns>
        public static void AddColumn(this DataTable dataTable, Type dataType, string columnName)
        {
            System.Data.DataColumn column;
            column = new System.Data.DataColumn();
            column.DataType = dataType;
            column.ColumnName = columnName;
            dataTable.Columns.Add(column);
            return;
        }
    }

    public abstract class spaceObject : Lockable
    {
        //private int posX;
        //private int posY;

        public spaceObject() { }

        //during serialization, this abstract method would be serialized if not for these Ignore-Tags (the tags on the override-method are ignored).
        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public abstract int Id { get; set; }
    }

    //ships, colonies or anything else which can hold goods, has a position, might create an area of Influence, has a scan range
    public abstract class UserSpaceObject : spaceObject, AsyncSaveable, Update
    {
        //private int posX;
        //private int posY;
        //private Int64 _versionId;

        public UserSpaceObject() { }

        public abstract Task save(System.Data.SqlClient.SqlCommand _command);

        public abstract void update(System.Data.SqlClient.SqlCommand _command);

        public abstract void updateStock(System.Data.SqlClient.SqlCommand _command);

        public abstract int GetUserId();

        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnore]
        public abstract User Owner { get; set; }

        public abstract int AmountOnStock();
        public abstract int CalcStorage();

        public abstract void addGood(short goodsId, int amount, bool preventNegatives = true, bool applyModifiers = false, bool reverse = false);

        public abstract byte scanRange
        {
            get;
            set;
        }

        [XmlIgnore]
        public abstract int posX { get; set; }
        [XmlIgnore]
        public abstract int posY { get; set; }

        public bool ScansPosition(Tuple<int, int> position)
        {
            if (this.posX - this.scanRange <= position.Item1
                && this.posX + this.scanRange >= position.Item1
                && this.posY - this.scanRange <= position.Item2
                && this.posY + this.scanRange >= position.Item2)
                return true;
            else
                return false;
        }
        
    }

    interface tradeObject
    {

    }

    public interface Scanners
    {
        byte scanRange { get; set; }        

        Field field { get; set; }
    }

    public partial class AllianceContact
    {

        private System.Nullable<int> _alliance1;

        private System.Nullable<int> _alliance2;

        private byte _currentrelation;

        public AllianceContact()
        {
        }

        
        

        public System.Nullable<int> alliance1
        {
            get
            {
                return this._alliance1;
            }
            set
            {
                if ((this._alliance1 != value))
                {
                    this._alliance1 = value;
                }
            }
        }

        
        public System.Nullable<int> alliance2
        {
            get
            {
                return this._alliance2;
            }
            set
            {
                if ((this._alliance2 != value))
                {
                    this._alliance2 = value;
                }
            }
        }

        
        public byte currentrelation
        {
            get
            {
                return this._currentrelation;
            }
            set
            {
                if ((this._currentrelation != value))
                {
                    this._currentrelation = value;
                }
            }
        }
    }

    
    public partial class AllianceTargetRelation
    {

        private System.Nullable<int> _sender;

        private System.Nullable<int> _addressee;

        private System.Nullable<byte> _targetrelation;

        public AllianceTargetRelation()
        {
        }

        
        public System.Nullable<int> sender
        {
            get
            {
                return this._sender;
            }
            set
            {
                if ((this._sender != value))
                {
                    this._sender = value;
                }
            }
        }

        
        public System.Nullable<int> addressee
        {
            get
            {
                return this._addressee;
            }
            set
            {
                if ((this._addressee != value))
                {
                    this._addressee = value;
                }
            }
        }

        
        public System.Nullable<byte> targetrelation
        {
            get
            {
                return this._targetrelation;
            }
            set
            {
                if ((this._targetrelation != value))
                {
                    this._targetrelation = value;
                }
            }
        }
    }

    
    public partial class AllianceInvite
    {

        private int _allianceid;

        private int _userid;

        public AllianceInvite()
        {
        }

        
        public int allianceid
        {
            get
            {
                return this._allianceid;
            }
            set
            {
                if ((this._allianceid != value))
                {
                    this._allianceid = value;
                }
            }
        }

        
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
                    this._userid = value;
                }
            }
        }
    }


    public partial class AllianceMember : Rights
    {

        private int _allianceid;        

        public AllianceMember()
        {
        }

        public static System.Data.DataTable createDataTable()
        {
            var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "allianceId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "userId");
            dataTable.AddColumn(System.Type.GetType("System.Boolean"), "fullAdmin");
            dataTable.AddColumn(System.Type.GetType("System.Boolean"), "diplomaticAdmin");
            dataTable.AddColumn(System.Type.GetType("System.Boolean"), "mayInvite");
            dataTable.AddColumn(System.Type.GetType("System.Boolean"), "mayFire");
            dataTable.AddColumn(System.Type.GetType("System.Boolean"), "mayDeclareWar");
            dataTable.AddColumn(System.Type.GetType("System.Boolean"), "mayMakeDiplomaticProposals");

            return dataTable;
        }

        public object createData()
        {
            return new
            {
                this.allianceId,
                this.userId,
                this.fullAdmin,
                this.diplomaticAdmin,
                this.mayInvite,
                this.mayFire,
                this.mayDeclareWar,
                this.mayMakeDiplomaticProposals
            };
        }


        
        public int allianceId
        {
            get
            {
                return this._allianceid;
            }
            set
            {

                    this._allianceid = value;
            }
        }


        public static AllianceMember fullRights(int userId, int allianceId)
        {
            AllianceMember rights = new AllianceMember();
            rights.allianceId = allianceId;
            rights.userId = userId;
            rights.fullAdmin = true;
            rights.diplomaticAdmin = true;
            rights.mayInvite = true;
            rights.mayFire = true;
            rights.mayDeclareWar = true;
            rights.mayMakeDiplomaticProposals = true;

            return rights;
        }

        public static AllianceMember noRights(int userId, int allianceId)
        {
            AllianceMember rights = new AllianceMember();
            rights.userId = userId;
            rights.allianceId = allianceId;
            rights.fullAdmin = false;
            rights.diplomaticAdmin = false;
            rights.mayInvite = false;
            rights.mayFire = false;
            rights.mayDeclareWar = false;
            rights.mayMakeDiplomaticProposals = false;

            return rights;
        } 


    }


   

    
    public partial class BuildingCost
    {

        private short _buildingid;

        private short _goodsid;

        private short _amount;

        public BuildingCost()
        {
        }

        
        public short buildingId
        {
            get
            {
                return this._buildingid;
            }
            set
            {
                if ((this._buildingid != value))
                {
                    this._buildingid = value;
                }
            }
        }

        
        public short goodsId
        {
            get
            {
                return this._goodsid;
            }
            set
            {
                if ((this._goodsid != value))
                {
                    this._goodsid = value;
                }
            }
        }

        
        public short amount
        {
            get
            {
                return this._amount;
            }
            set
            {
                if ((this._amount != value))
                {
                    this._amount = value;
                }
            }
        }
    }

    
    public partial class ModulesCost
    {

        private short _modulesid;

        private short _goodsid;

        private short _amount;

        public ModulesCost()
        {
        }

        [XmlIgnore]
        public short modulesid
        {
            get
            {
                return this._modulesid;
            }
            set
            {
                if ((this._modulesid != value))
                {
                    this._modulesid = value;
                }
            }
        }

        
        public short goodsId
        {
            get
            {
                return this._goodsid;
            }
            set
            {
                if ((this._goodsid != value))
                {
                    this._goodsid = value;
                }
            }
        }

        
        public short amount
        {
            get
            {
                return this._amount;
            }
            set
            {
                if ((this._amount != value))
                {
                    this._amount = value;
                }
            }
        }
    }

    
    public partial class BuildingProduction
    {

        private short _buildingid;

        private short _goodsid;

        private short _amount;

        public BuildingProduction()
        {
        }

        
        public short buildingId
        {
            get
            {
                return this._buildingid;
            }
            set
            {
                if ((this._buildingid != value))
                {
                    this._buildingid = value;
                }
            }
        }

        
        public short goodsId
        {
            get
            {
                return this._goodsid;
            }
            set
            {
                if ((this._goodsid != value))
                {
                    this._goodsid = value;
                }
            }
        }

        
        public short amount
        {
            get
            {
                return this._amount;
            }
            set
            {
                if ((this._amount != value))
                {
                    this._amount = value;
                }
            }
        }
    }

    
    public partial class Building
    {

        private short _id;

        private short _objectid;

        private string _buildingscript;

        private bool _oncepercolony;

        private short _isbuildable;

        private short _visibilityneedsgoods;

        private byte _groupid;

        private byte _prodqueuelevel;

        private int _label;

        private int _housing;

        private int _storage;
		private int _researchModifier ;
		private int _assemblyModifier ;
		private int _energyModifier ;
		private int _housingModifier ;
		private int _foodModifier ;
		private int _productionModifier;
        private int _growthModifier;

        private int _allowedMines;
        private int _allowedChemicals;
        private int _allowedFuel;


        [XmlElement(ElementName = "BuildingProduction")]
        public List<BuildingProduction> BuildingProductions { get; set; }

        [XmlElement(ElementName = "BuildingCosts")]
        public List<BuildingCost> BuildingCosts { get; set; }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public List<BuildOption> BuildOptions;
        public Building()
        {
        }
        public Building(short _id)
        {
            this.id = _id;
            BuildingProductions = new List<BuildingProduction>();
            BuildingCosts = new List<BuildingCost>(2);
            BuildOptions = new List<BuildOption>();
        }
        
        public short id
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

        
        public short objectId
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

        [XmlElement(IsNullable = true)]
        public string BuildingScript
        {
            get
            {
                return String.IsNullOrEmpty(this._buildingscript) ? "false" : this._buildingscript;
            }
            set
            {
                if ((this._buildingscript != value))
                {
                    this._buildingscript = value;
                }
            }
        }
        
        public string getBuildingScriptXMl
        {
            get
            {
                return String.IsNullOrEmpty(this._buildingscript) ? "false" : this._buildingscript;
            }            
        }

        public bool oncePerColony
        {
            get
            {
                return this._oncepercolony;
            }
            set
            {
                if ((this._oncepercolony != value))
                {
                    this._oncepercolony = value;
                }
            }
        }

        
        public short isBuildable
        {
            get
            {
                return this._isbuildable;
            }
            set
            {
                if ((this._isbuildable != value))
                {
                    this._isbuildable = value;
                }
            }
        }

        
        public short visibilityNeedsGoods
        {
            get
            {
                return this._visibilityneedsgoods;
            }
            set
            {
                if ((this._visibilityneedsgoods != value))
                {
                    this._visibilityneedsgoods = value;
                }
            }
        }

        
        public byte groupId
        {
            get
            {
                return this._groupid;
            }
            set
            {
                if ((this._groupid != value))
                {
                    this._groupid = value;
                }
            }
        }

        
        public byte prodqueuelevel
        {
            get
            {
                return this._prodqueuelevel;
            }
            set
            {
                if ((this._prodqueuelevel != value))
                {
                    this._prodqueuelevel = value;
                }
            }
        }

        
        public int label
        {
            get
            {
                return this._label;
            }
            set
            {
                if ((this._label != value))
                {
                    this._label = value;
                }
            }
        }

        
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

        //
        public int allowedMines
        {
            get
            {
                return this._allowedMines;
            }
            set
            {
                if ((this._allowedMines != value))
                {
                    this._allowedMines = value;
                }
            }
        }
        public int allowedChemicals
        {
            get
            {
                return this._allowedChemicals;
            }
            set
            {
                if ((this._allowedChemicals != value))
                {
                    this._allowedChemicals = value;
                }
            }
        }
        public int allowedFuel
        {
            get
            {
                return this._allowedFuel;
            }
            set
            {
                if ((this._allowedFuel != value))
                {
                    this._allowedFuel = value;
                }
            }
        }

        public bool hasProdModifiers()
        {
            return this._energyModifier != 0 || this.productionModifier != 0 || this.foodModifier != 0; 
        }




    }

    
    public partial class BuildOption
    {

        private short _objectid;

        private short _buildingid;

        public BuildOption()
        {
        }

        
        public short objectId
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

        
        public short buildingId
        {
            get
            {
                return this._buildingid;
            }
            set
            {
                if ((this._buildingid != value))
                {
                    this._buildingid = value;
                }
            }
        }
    }


    public partial class ColoniesBuildQueue
    {

        private int _id;

        private int _colonyid;

        private int _orderno;

        private int _buildtype;

        private int _buildid;

        private int _targetamount;

        private int _productionneededperunit;

        private int _productioninvested;

        private bool _multiturn;

        public ColoniesBuildQueue()
        {
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

        
        public int colonyid
        {
            get
            {
                return this._colonyid;
            }
            set
            {
                if ((this._colonyid != value))
                {
                    this._colonyid = value;
                }
            }
        }

        
        public int orderno
        {
            get
            {
                return this._orderno;
            }
            set
            {
                if ((this._orderno != value))
                {
                    this._orderno = value;
                }
            }
        }

        
        public int buildtype
        {
            get
            {
                return this._buildtype;
            }
            set
            {
                if ((this._buildtype != value))
                {
                    this._buildtype = value;
                }
            }
        }

        
        public int buildid
        {
            get
            {
                return this._buildid;
            }
            set
            {
                if ((this._buildid != value))
                {
                    this._buildid = value;
                }
            }
        }

        
        public int targetamount
        {
            get
            {
                return this._targetamount;
            }
            set
            {
                if ((this._targetamount != value))
                {
                    this._targetamount = value;
                }
            }
        }

        
        public int productionneededperunit
        {
            get
            {
                return this._productionneededperunit;
            }
            set
            {
                if ((this._productionneededperunit != value))
                {
                    this._productionneededperunit = value;
                }
            }
        }

        
        public int productioninvested
        {
            get
            {
                return this._productioninvested;
            }
            set
            {
                if ((this._productioninvested != value))
                {
                    this._productioninvested = value;
                }
            }
        }

        
        public bool multiturn
        {
            get
            {
                return this._multiturn;
            }
            set
            {
                if ((this._multiturn != value))
                {
                    this._multiturn = value;
                }
            }
        }
    }

    
    public partial class ColonyBuilding
    {

        private int _id;

        private int _colonyid;

        private long _planetsurfaceid;

        private int _userid;

        private short _buildingid;

        private bool _isactive;

        private bool _underconstruction;

        private int _remaininghitpoint;

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public Colony colony;

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public PlanetSurface planetSurface;

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public Building building;

        public CommunicationNode node;

        public ColonyBuilding()
        {
        }

        public ColonyBuilding(int _id)
        {
            id = _id;
        }

        public ColonyBuilding(Core core, int id, Colony colony, Building template, long planetSurfaceId, int userId, bool isActive = true, bool underConstruction = false, int remainingHitpoint = 100)
        {
            this.id = id;
            this.colonyId = colony.id;            
            this.planetSurfaceId = planetSurfaceId;
            this.userId = userId;
            this.buildingId = template.id;
            this.isActive = isActive;
            this.underConstruction = underConstruction;
            this.remainingHitpoint = remainingHitpoint;

            this.colony = colony;
            this.building = template;
            this.planetSurface = core.planetSurface[this.planetSurfaceId];

            colony.colonyBuildings.Add(this);
            core.colonyBuildings.TryAdd(id, this);
        }

        
        public static System.Data.DataTable createDataTable()
        {
            System.Data.DataTable dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "id");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "colonyId");
            dataTable.AddColumn(System.Type.GetType("System.Int64"), "planetSurfaceId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "userId");
            dataTable.AddColumn(System.Type.GetType("System.Int16"), "buildingId");
            dataTable.AddColumn(System.Type.GetType("System.Boolean"), "isActive");
            dataTable.AddColumn(System.Type.GetType("System.Boolean"), "underConstruction");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "remainingHitpoint");
           
            return dataTable;
        }

        public object createData()
        {
            return new
            {
                this.id
                ,
                this.colonyId
                ,
                this.planetSurfaceId
                ,
                this.userId
                ,
                this.buildingId
                ,
                isActive = this.isActive
                ,
                underConstruction = this.underConstruction
                ,
                this.remainingHitpoint                
            };
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

        
        public int colonyId
        {
            get
            {
                return this._colonyid;
            }
            set
            {
                if ((this._colonyid != value))
                {
                    this._colonyid = value;
                }
            }
        }

        
        public long planetSurfaceId
        {
            get
            {
                return this._planetsurfaceid;
            }
            set
            {
                if ((this._planetsurfaceid != value))
                {
                    this._planetsurfaceid = value;
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

        
        public short buildingId
        {
            get
            {
                return this._buildingid;
            }
            set
            {
                if ((this._buildingid != value))
                {
                    this._buildingid = value;
                }
            }
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public bool isActive
        {
            get
            {
                return this._isactive;
            }
            set
            {
                if ((this._isactive != value))
                {
                    this._isactive = value;
                }
            }
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public bool underConstruction
        {
            get
            {
                return this._underconstruction;
            }
            set
            {
                if ((this._underconstruction != value))
                {
                    this._underconstruction = value;
                }
            }
        }

        public void changeActive()
        {
            List<Lockable> elementsToLock = new List<Lockable>(1);
            elementsToLock.Add(this.colony);
            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return;
            }
            try
            {
                this._isactive = !this.isActive;
                this.colony.CalcStorage();

                Core.Instance.dataConnection.saveColonyBuildings(this);
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

        [XmlElement(ElementName = "isActive")]       
        public byte isActiveByte
        {
            get
            {
                return this._isactive ? (byte)1 : (byte)0;
            }
            set { this._isactive = value > 0 ? true : false; }
        }

        [XmlElement(ElementName = "underConstruction")]            
        public byte underConstructionByte
        {
            get
            {
                return this._underconstruction ? (byte)1 : (byte)0;
            }
            set { this._underconstruction = value > 0 ? true : false; }
        }
        

        public int remainingHitpoint
        {
            get
            {
                return this._remaininghitpoint;
            }
            set
            {
                if ((this._remaininghitpoint != value))
                {
                    this._remaininghitpoint = value;
                }
            }
        }

        public void Recycle(Colony colony)
        {    
            foreach (var cost in this.building.BuildingCosts)
            {
                if (Core.Instance.Goods[cost.goodsId].goodsType == 1 || Core.Instance.Goods[cost.goodsId].goodsType == 2)
                {
                    colony.addGood((short)cost.goodsId, cost.amount);
                    continue;
                }
            }           
        }

    }

    public interface SpaceObjectStock
    {         
         short goodsId { get; set; }
         int amount { get; set; }

    }

    public partial class colonyStock : SpaceObjectStock
    {

        private int _colonyid;

        private short _goodsid;

        private int _amount;

        public colonyStock()
        {
        }

        public colonyStock(int colonyid, short goodsid, int amount)
        {
            this.colonyId = colonyid;
            this.goodsId = goodsid;
            this.amount = amount;
        }

        public colonyStock clone()
        {
            return new colonyStock(this.colonyId, this.goodsId, this.amount);
        }

        public int colonyId
        {
            get
            {
                return this._colonyid;
            }
            set
            {
                if ((this._colonyid != value))
                {
                    this._colonyid = value;
                }
            }
        }

        
        public short goodsId
        {
            get
            {
                return this._goodsid;
            }
            set
            {
                if ((this._goodsid != value))
                {
                    this._goodsid = value;
                }
            }
        }

        
        public int amount
        {
            get
            {
                return this._amount;
            }
            set
            {
                if ((this._amount != value))
                {
                    this._amount = value;
                }
            }
        }
    }

    
    public partial class CommNodeDefaultRight
    {

        private int _commnodeid;

        private byte _targetrelation;

        private bool _readaccess;

        private bool _writeaccess;

        public CommNodeDefaultRight()
        {
        }

        
        public int commnodeid
        {
            get
            {
                return this._commnodeid;
            }
            set
            {
                if ((this._commnodeid != value))
                {
                    this._commnodeid = value;
                }
            }
        }

        
        public byte targetrelation
        {
            get
            {
                return this._targetrelation;
            }
            set
            {
                if ((this._targetrelation != value))
                {
                    this._targetrelation = value;
                }
            }
        }

        
        public bool readaccess
        {
            get
            {
                return this._readaccess;
            }
            set
            {
                if ((this._readaccess != value))
                {
                    this._readaccess = value;
                }
            }
        }

        
        public bool writeaccess
        {
            get
            {
                return this._writeaccess;
            }
            set
            {
                if ((this._writeaccess != value))
                {
                    this._writeaccess = value;
                }
            }
        }
    }

 
    
    public partial class DamageType
    {

        private short _id;

        private string _NAME;

        private int _label;

        public DamageType()
        {
        }

        
        public short id
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

        
        public int label
        {
            get
            {
                return this._label;
            }
            set
            {
                if ((this._label != value))
                {
                    this._label = value;
                }
            }
        }
    }


    public partial class GalaxyMap : Lockable, AsyncSaveable
    {

        private int _id;

        private System.Nullable<double> _posX;

        private System.Nullable<double> _posY;

        private string _galaxyname;

        private short _objectid;

        private short _size;

        private bool _isdemo;

        private int _colonyCount;

        private int _transcendenceRequirement;

        private System.Nullable<int> _winningTranscendenceConstruct;

        private bool _useSolarSystems;

        public int TurnNumber { get; set; }



        private short _gameState;
        public GalaxyMap()
        {
        }

        public void calcTranscendenceRequirement()
        {
            //this.transcendenceRequirement = (Core.Instance.users.Count() * 5 * 30) / 3;  // a third of the players has to spend one month to build it -> one ship should cost the production of one round            
            //  5 colonies create one ship per turn. 5 turns per day, 30 days. 1/3 of all colonies is required to accomplish this in a month

            string transcDaysFactorStr = System.Configuration.ConfigurationManager.AppSettings["transcDaysFactor"].ToString();
            string playersFactorStr = System.Configuration.ConfigurationManager.AppSettings["playersFactor"].ToString();

            int transcDaysFactor;
            if (!Int32.TryParse(transcDaysFactorStr, out transcDaysFactor)) transcDaysFactor = 7;

            double playersFactor;
            if (!Double.TryParse(playersFactorStr, out playersFactor)) playersFactor = 4.0d;
                        
            int colonyCount = Core.Instance.colonies.Count;
            double colonyFifth = colonyCount / 5.0d;  //normal players have 5 colonies, so colonyFifth equals to player count. If all players only have one colony, colonyFifth is lower, so fewer days are needed... Another way to read: five colonies generate one transcSupporter per turn
            double transcDays = colonyFifth * transcDaysFactor;
            double players = transcDays / playersFactor;


            this.transcendenceRequirement = (int) players;  
        }

        public Task save(System.Data.SqlClient.SqlCommand _command)
        {
            return Core.Instance.dataConnection.saveGame(_command);         
        }
        [XmlIgnore]
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
        [XmlIgnore]
        public int colonyCount
        {
            get
            {
                return this._colonyCount;
            }
            set
            {
                if ((this._colonyCount != value))
                {
                    this._colonyCount = value;
                }
            }
        }

        [XmlIgnore]
        public System.Nullable<double> posX
        {
            get
            {
                return this._posX;
            }
            set
            {
                if ((this._posX != value))
                {
                    this._posX = value;
                }
            }
        }

        [XmlIgnore]
        public System.Nullable<double> posY
        {
            get
            {
                return this._posY;
            }
            set
            {
                if ((this._posY != value))
                {
                    this._posY = value;
                }
            }
        }

        
        public string galaxyName
        {
            get
            {
                return this._galaxyname;
            }
            set
            {
                if ((this._galaxyname != value))
                {
                    this._galaxyname = value;
                }
            }
        }

        [XmlIgnore]
        public short objectid
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

        
        public short size
        {
            get
            {
                return this._size;
            }
            set
            {
                if ((this._size != value))
                {
                    this._size = value;
                }
            }
        }

        
        public bool isdemo
        {
            get
            {
                return this._isdemo;
            }
            set
            {
                if ((this._isdemo != value))
                {
                    this._isdemo = value;
                }
            }
        }




        public int transcendenceRequirement
        {
            get
            {
                return this._transcendenceRequirement;
            }
            set
            {
                if ((this._transcendenceRequirement != value))
                {
                    this._transcendenceRequirement = value;
                }
            }
        }

        
        public short gameState
        {
            get
            {
                return this._gameState;
            }
            set
            {
                if ((this._gameState != value))
                {
                    this._gameState = value;
                }
            }
        }

        public int winningTranscendenceConstruct
        {
            get
            {
                return this._winningTranscendenceConstruct ?? default(int);
            }
            set
            {
                if ((this._winningTranscendenceConstruct != value))
                {
                    this._winningTranscendenceConstruct = value;
                }
            }
        }

        public bool useSolarSystems
        {
            get
            {
                return this._useSolarSystems;
            }
            set
            {
                if ((this._useSolarSystems != value))
                {
                    this._useSolarSystems = value;
                }
            }
        }
        

    }


    public partial class Game
    {

        private string _name;

        private int _colonyCount;
       
        public Game()
        {
        }

        public string name
        {
            get
            {
                return this._name;
            }
            set
            {
                if ((this._name != value))
                {
                    this._name = value;
                }
            }
        }

        public int colonyCount
        {
            get
            {
                return this._colonyCount;
            }
            set
            {
                if ((this._colonyCount != value))
                {
                    this._colonyCount = value;
                }
            }
        }
      
    }
    
    public partial class gameNewTurnLog
    {

        private int _gamenewturnsid;

        private System.DateTime _newturnbegin;

        private System.DateTime _newturnend;

        private int _newturnruntime;

        public gameNewTurnLog()
        {
        }

        
        public int gamenewturnsid
        {
            get
            {
                return this._gamenewturnsid;
            }
            set
            {
                if ((this._gamenewturnsid != value))
                {
                    this._gamenewturnsid = value;
                }
            }
        }

        
        public System.DateTime newturnbegin
        {
            get
            {
                return this._newturnbegin;
            }
            set
            {
                if ((this._newturnbegin != value))
                {
                    this._newturnbegin = value;
                }
            }
        }

        
        public System.DateTime newturnend
        {
            get
            {
                return this._newturnend;
            }
            set
            {
                if ((this._newturnend != value))
                {
                    this._newturnend = value;
                }
            }
        }

        
        public int newturnruntime
        {
            get
            {
                return this._newturnruntime;
            }
            set
            {
                if ((this._newturnruntime != value))
                {
                    this._newturnruntime = value;
                }
            }
        }
    }

    
    public partial class gameNewTurn
    {

        private int _id;

        private System.DateTime _targettime;

        private byte _turnstatus;

        public gameNewTurn()
        {
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

        
        public System.DateTime targettime
        {
            get
            {
                return this._targettime;
            }
            set
            {
                if ((this._targettime != value))
                {
                    this._targettime = value;
                }
            }
        }

        
        public byte turnstatus
        {
            get
            {
                return this._turnstatus;
            }
            set
            {
                if ((this._turnstatus != value))
                {
                    this._turnstatus = value;
                }
            }
        }
    }


    public partial class Good
    {

        private short _id;

        private string _NAME;

        private short _objectdescriptionid;

        private short _goodstype;

        private int _label;

        private byte _prodLevel;

        public Good(short id)
        {
            this.id = id;
        }
        public Good()
        {
        }

        public short id
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


        public short objectDescriptionId
        {
            get
            {
                return this._objectdescriptionid;
            }
            set
            {
                if ((this._objectdescriptionid != value))
                {
                    this._objectdescriptionid = value;
                }
            }
        }


        public short goodsType
        {
            get
            {
                return this._goodstype;
            }
            set
            {
                if ((this._goodstype != value))
                {
                    this._goodstype = value;
                }
            }
        }


        public int label
        {
            get
            {
                return this._label;
            }
            set
            {
                if ((this._label != value))
                {
                    this._label = value;
                }
            }
        }

        public byte prodLevel
        {
            get
            {
                return this._prodLevel;
            }
            set
            {
                if ((this._prodLevel != value))
                {
                    this._prodLevel = value;
                }
            }
        }

        public int Weight()
        {
            if (goodsType == 2)
            {
                var ModuleData = Core.Instance.Modules.First(Module => Module != null && Module.goodsId == id);
                return ModuleData.CargoCost();
               
            }

            return 1;           
        }

        //Recycle adds the components of a good (module) to a UserSpaceObject (colony or ship)
        public void Recycle(UserSpaceObject Sender, int amount)
        {
            if (goodsType == 2)
            {
                var ModuleData = Core.Instance.Modules.First(Module => Module != null && Module.goodsId == id);

                foreach (var cost in ModuleData.ModulesCosts)
                {
                    if (Core.Instance.Goods[cost.goodsId].goodsType == 1)
                    {
                        Sender.addGood((short)cost.goodsId, cost.amount * amount);
                        continue;
                    }

                    if (Core.Instance.Goods[cost.goodsId].goodsType == 2)
                    {
                        Core.Instance.Goods[cost.goodsId].Recycle(Sender, cost.amount * amount);
                        continue;
                    }
                }
            }            
        }
    }

    
    public partial class Label
    {

        private int _id;

        private int _languageid;

        private string _label;

        public Label()
        {
        }

        public static string  getLabel(int userId, int labelId)
        {
            if (!Core.Instance.users.ContainsKey(userId)) return "ERROR";

            User user = Core.Instance.users[userId];

            if (!Core.Instance.labels.Any(e=>e.languageId == user.language && e.id == labelId)) return "ERROR";

            return Core.Instance.labels.First(e => e.languageId == user.language && e.id == labelId).label;
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

        
        public int languageId
        {
            get
            {
                return this._languageid;
            }
            set
            {
                if ((this._languageid != value))
                {
                    this._languageid = value;
                }
            }
        }

        
        public string label
        {
            get
            {
                return this._label;
            }
            set
            {
                if ((this._label != value))
                {
                    this._label = value;
                }
            }
        }

       
    }

    
    public partial class LabelsBase
    {

        private int _id;

        private string _value;

        private string _comment;

        private int _module;

        public LabelsBase()
        {
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

        
        public string value
        {
            get
            {
                return this._value;
            }
            set
            {
                if ((this._value != value))
                {
                    this._value = value;
                }
            }
        }

        
        public string comment
        {
            get
            {
                return this._comment;
            }
            set
            {
                if ((this._comment != value))
                {
                    this._comment = value;
                }
            }
        }

        
        public int module
        {
            get
            {
                return this._module;
            }
            set
            {
                if ((this._module != value))
                {
                    this._module = value;
                }
            }
        }
    }

    
    public partial class Language
    {

        private int _id;

        private string _languagefullname;

        private string _languageshortname;

        public Language()
        {
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

        
        public string languageFullName
        {
            get
            {
                return this._languagefullname;
            }
            set
            {
                if ((this._languagefullname != value))
                {
                    this._languagefullname = value;
                }
            }
        }

        
        public string languageShortName
        {
            get
            {
                return this._languageshortname;
            }
            set
            {
                if ((this._languageshortname != value))
                {
                    this._languageshortname = value;
                }
            }
        }
    }

    
  
    
    public partial class MessageHead
    {

        private int _id;

        private System.Nullable<int> _sender;

        private int _addressee;

        private string _headline;

        private bool _read;

        private short _messagetype;

        private System.DateTime _sendingdate;

        public List<MessageParticipants> messageParticipants;

        public List<MessageBody> messages; 

        public MessageHead()
        {
            messageParticipants = new List<MessageParticipants>();
            messages = new List<MessageBody>();
        }

        public MessageHead(System.Nullable<int> userId,
            string header,
            int id,
            int messageType)
        {
            messageParticipants = new List<MessageParticipants>();
            messages = new List<MessageBody>();

            this.sender = userId;
            this.headline = header;
            this.id = id;
            this.messagetype = messagetype;
        }

        public MessageHead(System.Nullable<int> userId,
            MessageHead head)
        {
            messageParticipants = new List<MessageParticipants>();
            messages = new List<MessageBody>();

            this.sender = userId;
            this.headline = head.headline;
            this.id = head.id;
            this.messagetype = head.messagetype;
            this.sendingdate = head.sendingdate;
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

        
        public System.Nullable<int> sender
        {
            get
            {
                return this._sender;
            }
            set
            {
                if ((this._sender != value))
                {
                    this._sender = value;
                }
            }
        }

        
        public int addressee
        {
            get
            {
                return this._addressee;
            }
            set
            {
                if ((this._addressee != value))
                {
                    this._addressee = value;
                }
            }
        }

        
        public string headline
        {
            get
            {
                return this._headline;
            }
            set
            {
                if ((this._headline != value))
                {
                    this._headline = value;
                }
            }
        }

        
        public bool read
        {
            get
            {
                return this._read;
            }
            set
            {
                if ((this._read != value))
                {
                    this._read = value;
                }
            }
        }

        
        public short messagetype
        {
            get
            {
                return this._messagetype;
            }
            set
            {
                if ((this._messagetype != value))
                {
                    this._messagetype = value;
                }
            }
        }

        
        public System.DateTime sendingdate
        {
            get
            {
                return this._sendingdate;
            }
            set
            {
                if ((this._sendingdate != value))
                {
                    this._sendingdate = value;
                }
            }
        }
    }

    public class MessageParticipants
    {
        public int headerId { get; set; }
        public int participant { get; set; }
        public bool read { get; set; }

        public MessageParticipants()
        {
        }

        public MessageParticipants(int userId)
        {
            participant = userId;

        }

        public object createData()
        {
            return new
            {
                this.headerId
                ,
                this.participant
                ,
                this.read
            };
        }

        public static System.Data.DataTable createDataTable()
        {
            System.Data.DataTable dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "headerId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "participant");
            dataTable.AddColumn(System.Type.GetType("System.Boolean"), "read");            

            return dataTable;
        }
    }

    public partial class MessageBody
    {

        private int _headerid;
        private string _message;
        private int _messagePart;
        private int _sender;
        private DateTime _sendingDate;

        public MessageBody()
        {
        }


        public int headerId
        {
            get
            {
                return this._headerid;
            }
            set
            {
                if ((this._headerid != value))
                {
                    this._headerid = value;
                }
            }
        }

        public string message
        {
            get
            {
                return this._message;
            }
            set
            {
                if ((this._message != value))
                {
                    this._message = value;
                }
            }
        }

        public int messagePart
        {
            get
            {
                return this._messagePart;
            }
            set
            {
                if ((this._messagePart != value))
                {
                    this._messagePart = value;
                }
            }
        }

        public int sender
        {
            get
            {
                return this._sender;
            }
            set
            {
                if ((this._sender != value))
                {
                    this._sender = value;
                }
            }
        }
        public DateTime sendingDate
        {
            get
            {
                return this._sendingDate;
            }
            set
            {
                if ((this._sendingDate != value))
                {
                    this._sendingDate = value;
                }
            }
        }

        public object createData()
        {
            return new
            {
                this.headerId
                ,
                this.message
                ,
                this.messagePart
                ,
                this.sender
                ,
                this.sendingDate
            };
        }

        public static System.Data.DataTable createDataTable()
        {
            System.Data.DataTable dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "headerId");
            dataTable.AddColumn(System.Type.GetType("System.String"), "message");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "messagePart");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "sender");
            dataTable.AddColumn(System.Type.GetType("System.DateTime"), "sendingDate");

            return dataTable;
        }
    }


    public partial class ChatLog
    {

        private int _id;

        private int _userId;

        private string _chatMessage;

        private System.DateTime _sendingdate;

        public ChatLog()
        {
        }

        public ChatLog(int id)
        {
            _id = id;
        }

        public ChatLog(int id
            , int userId
            , string chatMessage
            , System.DateTime sendingdate)
        {
            _id = id;
            _userId = userId;
            _chatMessage = chatMessage;
            _sendingdate = sendingdate;
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
                return this._userId;
            }
            set
            {
                if ((this._userId != value))
                {
                    this._userId = value;
                }
            }
        }        


        public string chatMessage
        {
            get
            {
                return this._chatMessage;
            }
            set
            {
                if ((this._chatMessage != value))
                {
                    this._chatMessage = value;
                }
            }
        }

        public System.DateTime sendingdate
        {
            get
            {
                return this._sendingdate;
            }
            set
            {
                if ((this._sendingdate != value))
                {
                    this._sendingdate = value;
                }
            }
        }
    }

    public partial class Module
    {

        private short _id;

        private System.Nullable<int> _descriptionlabel;

        private short _goodsid;

        private int _label;

        private byte _level;
        
        
        private List<SpacegameServer.Core.ModulesCost> _ModulesCosts;

        public SpacegameServer.Core.ModulesGain moduleGain;
        public Module(short _id)
        {
            id = _id;
            _ModulesCosts = new List<ModulesCost>();
        }

        public Module()
        {           
        }

         public Module(short id ,int descriptionlabel ,short goodsid ,int label,byte level)
        {
            this.id = id;
            this.descriptionLabel = descriptionlabel;
            this.goodsId = goodsid;
            this.label = label;
            this.level = level;
        }
        public short id
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

        public int CargoCost()
        {
            var OverallCosts = 0.0;
            foreach(var cost in this.ModulesCosts)
            {
                if (Core.Instance.Goods[cost.goodsId].goodsType == 1)
                {
                    OverallCosts += cost.amount;
                    continue;
                }

                if (Core.Instance.Goods[cost.goodsId].goodsType == 2)
                {
                    OverallCosts += Core.Instance.Modules.First(Module => Module.goodsId == cost.goodsId).CargoCost() * cost.amount;
                    continue;
                }
            }

            OverallCosts = OverallCosts / 5;
            OverallCosts = Math.Ceiling(OverallCosts);
            return (int)OverallCosts;
        }

        
        public System.Nullable<int> descriptionLabel
        {
            get
            {
                return this._descriptionlabel;
            }
            set
            {
                if ((this._descriptionlabel != value))
                {
                    this._descriptionlabel = value;
                }
            }
        }

        
        public short goodsId
        {
            get
            {
                return this._goodsid;
            }
            set
            {
                if ((this._goodsid != value))
                {
                    this._goodsid = value;
                }
            }
        }

        
        public int label
        {
            get
            {
                return this._label;
            }
            set
            {
                if ((this._label != value))
                {
                    this._label = value;
                }
            }
        }

       
        public byte level
        {
            get
            {
                return this._level;
            }
            set
            {
                if ((this._level != value))
                {
                    this._level = value;
                }
            }
        }

        [XmlElement]
        public List<SpacegameServer.Core.ModulesCost> ModulesCosts { 
            get
            {
                return this._ModulesCosts;
            }
            /*set
            {
                if ((this.ModulesCosts != value))
                {
                    this.ModulesCosts = value;
                }
            }*/
        }

    }


    public partial class ModulesGain : ModuleStatistics
    {

        private short _modulesid;

        private int _crew;

        private short _energy;

        private short _hitpoints;

        private byte _damagereduction;

        private short _damageoutput;

        private short _cargoroom;

        private short _fuelroom;

        private short _inspacespeed;

        private short _insystemspeed;

        private decimal _maxspacemoves;

        private decimal _maxsystemmoves;

        private byte _scanrange;

        private int _special;

        private byte _weapontype;

        private long _population;

        private int _toHitRatio;

        public ModulesGain()
        {
        }
        public ModulesGain(short modulesid ,
            int crew ,
            short energy ,
            short hitpoints ,
            byte damagereduction ,
            short damageoutput ,
            short cargoroom ,
            short fuelroom ,
            short inspacespeed ,
            short insystemspeed ,
            decimal maxspacemoves ,
            decimal maxsystemmoves ,
            byte scanrange ,
            int special ,
            byte weapontype ,
            long population )
        {
            this.modulesId = modulesid;
            this.crew = crew;
            this.energy = energy;
            this.hitpoints = hitpoints;
            this.damagereduction = damagereduction;
            this.damageoutput = damageoutput;
            this.cargoroom = cargoroom;
            this.fuelroom = fuelroom;
            this.inSpaceSpeed = inspacespeed;
            this.inSystemSpeed = insystemspeed;
            this.maxSpaceMoves = maxspacemoves;
            this.maxSystemMoves = maxsystemmoves;
            this.scanRange = scanrange;
            this.special = special;
            this.weaponType = weapontype;
            this.population = population;
        }
        
        
        public short modulesId
        {
            get
            {
                return this._modulesid;
            }
            set
            {
                if ((this._modulesid != value))
                {
                    this._modulesid = value;
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

        
        public short energy
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
                    this._hitpoints = value;
                }
            }
        }

        public short Evasion
        {
            get
            {
                return 0;
            }
            set
            {
                
            }
        }

        
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
        
        public short damageoutput
        {
            get
            {
                return this._damageoutput;
            }
            set
            {
                if ((this._damageoutput != value))
                {
                    this._damageoutput = value;
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
        
        public short inSpaceSpeed
        {
            get
            {
                return this._inspacespeed;
            }
            set
            {
                if ((this._inspacespeed != value))
                {
                    this._inspacespeed = value;
                }
            }
        }

        
        public short inSystemSpeed
        {
            get
            {
                return this._insystemspeed;
            }
            set
            {
                if ((this._insystemspeed != value))
                {
                    this._insystemspeed = value;
                }
            }
        }


        public decimal maxSpaceMoves
        {
            get
            {
                return this._maxspacemoves;
            }
            set
            {
                if ((this._maxspacemoves != value))
                {
                    this._maxspacemoves = value;
                }
            }
        }


        public decimal maxSystemMoves
        {
            get
            {
                return this._maxsystemmoves;
            }
            set
            {
                if ((this._maxsystemmoves != value))
                {
                    this._maxsystemmoves = value;
                }
            }
        }


        public byte scanRange
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

        
        public int special
        {
            get
            {
                return this._special;
            }
            set
            {
                if ((this._special != value))
                {
                    this._special = value;
                }
            }
        }
        
        
        public byte weaponType
        {
            get
            {
                return this._weapontype;
            }
            set
            {
                if ((this._weapontype != value))
                {
                    this._weapontype = value;
                }
            }
        }

        public byte spaceStationHullId
        {
            get
            {
                switch (this.modulesId)
                {
                    case 499: return 199;
                    case 500: return 200;
                    case 501: return 201;
                    case 502: return 202;
                    case 520: return 220;
                    default: return 0;
                }                
            }
            /*
            set
            {
                if ((this._weapontype != value))
                {
                    this._weapontype = value;
                }
            }*/
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

        public int toHitRatio
        {
            get
            {
                return this._toHitRatio;
            }
            set
            {
                if ((this._toHitRatio != value))
                {
                    this._toHitRatio = value;
                }
            }
        }
    }

    public partial class PlanetType
    {
        public short id {get;set;}
        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public string name { get; set; }
        public int label { get; set; }
        public int description { get; set; }
        public short objectId { get; set; }
        public short researchRequired { get; set; }
        public short colonyCenter { get; set; }
        public short shipModuleId { get; set; }

        public PlanetType()
        {
        }

        public PlanetType(short _id)
        {
            id = _id;
        }
    }


    public partial class PlanetSurface
    {

        private long _id;

        private int _planetid;

        private byte _x;

        private byte _y;

        private short _surfaceobjectid;

        private System.Nullable<short> _surfacebuildingid;

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public SolarSystemInstance planet;

        [System.Xml.Serialization.XmlIgnoreAttribute]
        public ColonyBuilding colonyBuilding;
        
        public PlanetSurface()
        {
        }

        public PlanetSurface(long _id)
        {
            id = _id;
        }

        public static System.Data.DataTable createDataTable()
        {
            System.Data.DataTable dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            dataTable.AddColumn(System.Type.GetType("System.Int64"), "id");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "planetId");
            dataTable.AddColumn(System.Type.GetType("System.Byte"), "X");
            dataTable.AddColumn(System.Type.GetType("System.Byte"), "Y");
            dataTable.AddColumn(System.Type.GetType("System.Int16"), "surfaceObjectId");
            dataTable.AddColumn(System.Type.GetType("System.Int16"), "surfaceBuildingId");
          
            return dataTable;
        }

        public object createData()
        {
            return new
            {
                this.id
                ,
                planetId = this.planetid
                ,
                X  = this.x
                ,
                Y = this.y
                ,
                surfaceObjectId = this.surfaceobjectid
                ,
                surfaceBuildingId = (object)this.surfacebuildingid ?? DBNull.Value           
            };
        }

        public long id
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

        [XmlElement(ElementName = "SurfacePlanetId")]       
        public int planetid
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

         [XmlElement(ElementName = "xpos")]            
        public byte x
        {
            get
            {
                return this._x;
            }
            set
            {
                if ((this._x != value))
                {
                    this._x = value;
                }
            }
        }

        [XmlElement(ElementName = "ypos")]            
        public byte y
        {
            get
            {
                return this._y;
            }
            set
            {
                if ((this._y != value))
                {
                    this._y = value;
                }
            }
        }

        [XmlElement(ElementName = "fieldType")]            
        public short surfaceobjectid
        {
            get
            {
                return this._surfaceobjectid;
            }
            set
            {
                if ((this._surfaceobjectid != value))
                {
                    this._surfaceobjectid = value;
                }
            }
        }

        public short type
        {
            get
            {
                return Core.Instance.SurfaceTiles[this._surfaceobjectid].objectId;
            }
            set
            {                
            }
        }

        public string gif
        {
            get
            {
                return Core.Instance.ObjectDescriptions[  Core.Instance.SurfaceTiles[this._surfaceobjectid].objectId].objectimageUrl;
            }
            set
            {
            }
        }

        public string name
        {
            get
            {
                return Core.Instance.ObjectDescriptions[Core.Instance.SurfaceTiles[this._surfaceobjectid].objectId].name;
            }
            set
            {
            }
        }


        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public System.Nullable<short> surfacebuildingid
        {
            get
            {
                return this._surfacebuildingid;
            }
            set
            {
                if ((this._surfacebuildingid != value))
                {
                    this._surfacebuildingid = value;
                }
            }
        }

        public int size
        {
            get
            {
                return 1;
            }
            set
            {               
            }
        }

        public int fieldSize
        {
            get
            {
                return 1;
            }
            set
            {
            }
        }
        public float drawsize
        {
            get
            {
                return 1.0f;
            }
            set
            {
            }
        }
        

    }

    
    public partial class ObjectDescription
    {

        private short _id;

        private string _name;

        private string _objectimageurl;

        public int versionNo;

        public ObjectDescription(short _id)
        {
            id = _id;
        }

        public ObjectDescription( )
        {            
        }
        
        public short id
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

        public string name
        {
            get
            {
                return this._name;
            }
            set
            {
                if ((this._name != value))
                {
                    this._name = value;
                }
            }
        }

        
        public string objectimageUrl
        {
            get
            {
                return this._objectimageurl;
            }
            set
            {
                if ((this._objectimageurl != value))
                {
                    this._objectimageurl = value;
                }
            }
        }

        public byte moveCost
        {
            get
            {
                //check that a least one ObjectsOnMap references this image
                if (!Core.Instance.ObjectsOnMap.Any(e => e.Value.ObjectImages.Any(f => f.ImageId == this._id)))
                {
                    return 1;
                }

                var objectType = Core.Instance.ObjectsOnMap.First(e => e.Value.ObjectImages.Any(f => f.ImageId == this._id));
                return objectType.Value.Movecost;
            }
            set { }
        }
        public int label
        {
            get
            {
                //check that a least one ObjectsOnMap references this image
                if (!Core.Instance.ObjectsOnMap.Any(e => e.Value.ObjectImages.Any(f => f.ImageId == this._id)))
                {
                    if (Core.Instance.ObjectsOnMap.Any(e => e.Value.Id == this._id))
                    {
                        return Core.Instance.ObjectsOnMap.First(e => e.Value.Id == this._id).Value.Label;
                    }
                    else
                    {
                        return 1;
                    }
                }

                var objectType = Core.Instance.ObjectsOnMap.First(e => e.Value.ObjectImages.Any(f => f.ImageId == this._id));
                return objectType.Value.Label;
            }
            set { }
        }
    }

    
    public partial class ObjectOnMap
    {

        private short _id;

        private byte _movecost;

        private short _damage;

        private System.Nullable<short> _damagetype;

        private short _damageprobability;

        private bool _damageprobabilityreducablebyship;

        private byte _defensebonus;

        private byte _fieldsize;

        private int _label;
        /*
        private float _drawsize;

        public short? BackgroundObjectId;
        public byte? BackgroundDrawSize, TilestartingAt;
        */
        public List<SpacegameServer.Core.ObjectImage> ObjectImages;

        public ObjectOnMap()
        {
            ObjectImages = new List<ObjectImage>();
        }

        
        public short Id
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

        
        public byte Movecost
        {
            get
            {
                return this._movecost;
            }
            set
            {
                if ((this._movecost != value))
                {
                    this._movecost = value;
                }
            }
        }

        
        public short Damage
        {
            get
            {
                return this._damage;
            }
            set
            {
                if ((this._damage != value))
                {
                    this._damage = value;
                }
            }
        }

        
        public System.Nullable<short> Damagetype
        {
            get
            {
                return this._damagetype;
            }
            set
            {
                if ((this._damagetype != value))
                {
                    this._damagetype = value;
                }
            }
        }

        
        public short Damageprobability
        {
            get
            {
                return this._damageprobability;
            }
            set
            {
                if ((this._damageprobability != value))
                {
                    this._damageprobability = value;
                }
            }
        }

        
        public bool Damageprobabilityreducablebyship
        {
            get
            {
                return this._damageprobabilityreducablebyship;
            }
            set
            {
                if ((this._damageprobabilityreducablebyship != value))
                {
                    this._damageprobabilityreducablebyship = value;
                }
            }
        }

        
        public byte Defensebonus
        {
            get
            {
                return this._defensebonus;
            }
            set
            {
                if ((this._defensebonus != value))
                {
                    this._defensebonus = value;
                }
            }
        }

        
        public byte Fieldsize
        {
            get
            {
                return this._fieldsize;
            }
            set
            {
                if ((this._fieldsize != value))
                {
                    this._fieldsize = value;
                }
            }
        }

        public int Label
        {
            get
            {
                return this._label;
            }
            set
            {
                if ((this._label != value))
                {
                    this._label = value;
                }
            }
        }

        /*
        public float drawsize
        {
            get
            {
                return this._drawsize;
            }
            set
            {
                if ((this._drawsize != value))
                {
                    this._drawsize = value;
                }
            }
        }
        */
        private ObjectImage getImage(int entityId)
        {
            var imageCount = this.ObjectImages.Count;
            if (imageCount == 0) return null;

            return this.ObjectImages[entityId % imageCount];
        }



        public float drawsize(int entityId) 
        {
            var image = this.getImage(entityId);
            return image != null ? image.Drawsize : 1f;
        }


        public short? BackgroundObjectId(int entityId)
        {
            var image = this.getImage(entityId);
            return image != null ? image.BackgroundObjectId : null;
        }

        public byte? BackgroundDrawSize(int entityId)
        {
            var image = this.getImage(entityId);
            return image != null ? image.BackgroundDrawSize : null;
        }

        public short? SurfaceDefaultMapId(int entityId)
        {
            var image = this.getImage(entityId);
            return image != null ? image.SurfaceDefaultMapId : null;
        }
        public byte? TilestartingAt(int entityId)
        {
            var image = this.getImage(entityId);
            return image != null ? image.TilestartingAt : null;
        }



    }

    public partial class ObjectImage
    {

        private short _objectId;
        private short _imageId;      
        private float _drawsize;

        public short? BackgroundObjectId;
        public byte? BackgroundDrawSize ;
        public byte? TilestartingAt;
        public short? SurfaceDefaultMapId;

        public ObjectImage()
        {
        }

        public short ObjectId
        {
            get
            {
                return this._objectId;
            }
            set
            {
                if ((this._objectId != value))
                {
                    this._objectId = value;
                }
            }
        }

        public short ImageId
        {
            get
            {
                return this._imageId;
            }
            set
            {
                if ((this._imageId != value))
                {
                    this._imageId = value;
                }
            }
        }  

        public float Drawsize
        {
            get
            {
                return this._drawsize;
            }
            set
            {
                if ((this._drawsize != value))
                {
                    this._drawsize = value;
                }
            }
        }


    }

    public partial class ObjectWeaponModificator
    {

        private short _objectid;

        private short _damagetype;

        private short _damagemodificator;

        private short _tohitmodificator;

        private byte _applyto;

        public ObjectWeaponModificator()
        {
        }

        
        public short objectid
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
        public short damagetype
        {
            get
            {
                return this._damagetype;
            }
            set
            {
                if ((this._damagetype != value))
                {
                    this._damagetype = value;
                }
            }
        }

        
        public short damagemodificator
        {
            get
            {
                return this._damagemodificator;
            }
            set
            {
                if ((this._damagemodificator != value))
                {
                    this._damagemodificator = value;
                }
            }
        }

        
        public short tohitmodificator
        {
            get
            {
                return this._tohitmodificator;
            }
            set
            {
                if ((this._tohitmodificator != value))
                {
                    this._tohitmodificator = value;
                }
            }
        }

        
        public byte applyto
        {
            get
            {
                return this._applyto;
            }
            set
            {
                if ((this._applyto != value))
                {
                    this._applyto = value;
                }
            }
        }
    }

    
    public partial class planetStock
    {

        private int _systemid;

        private short _goodsid;

        private short _amount;

        public planetStock()
        {
        }

        
        public int systemid
        {
            get
            {
                return this._systemid;
            }
            set
            {
                if ((this._systemid != value))
                {
                    this._systemid = value;
                }
            }
        }

        
        public short goodsid
        {
            get
            {
                return this._goodsid;
            }
            set
            {
                if ((this._goodsid != value))
                {
                    this._goodsid = value;
                }
            }
        }

        
        public short amount
        {
            get
            {
                return this._amount;
            }
            set
            {
                if ((this._amount != value))
                {
                    this._amount = value;
                }
            }
        }
    }

    
    public partial class Quest
    {

        private int _id;

        private int _label;

        private System.Nullable<int> _descriptionlabel;

        private bool _isintro;

        private bool _israndom;

        private bool _hasscript;

        private string _script;

        public Quest()
        {
        }

        public Quest(int id)
        {
            this.id = id;
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

        
        public int label
        {
            get
            {
                return this._label;
            }
            set
            {
                if ((this._label != value))
                {
                    this._label = value;
                }
            }
        }

        
        public System.Nullable<int> descriptionLabel
        {
            get
            {
                return this._descriptionlabel;
            }
            set
            {
                if ((this._descriptionlabel != value))
                {
                    this._descriptionlabel = value;
                }
            }
        }

        
        public bool isIntro
        {
            get
            {
                return this._isintro;
            }
            set
            {
                if ((this._isintro != value))
                {
                    this._isintro = value;
                }
            }
        }

        
        public bool isRandom
        {
            get
            {
                return this._israndom;
            }
            set
            {
                if ((this._israndom != value))
                {
                    this._israndom = value;
                }
            }
        }

        
        public bool hasScript
        {
            get
            {
                return this._hasscript;
            }
            set
            {
                if ((this._hasscript != value))
                {
                    this._hasscript = value;
                }
            }
        }

        
        public string script
        {
            get
            {
                return this._script;
            }
            set
            {
                if ((this._script != value))
                {
                    this._script = value;
                }
            }
        }
    }

    
    public partial class ServerEvent
    {

        private int _id;

        private System.Nullable<int> _userid;

        private System.Nullable<int> _eventtype;

        private System.Nullable<int> _objectid;

        private System.Nullable<int> _int1;

        private System.Nullable<int> _int2;

        private System.Nullable<int> _int3;

        public ServerEvent()
        {
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

        
        public System.Nullable<int> userid
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

        
        public System.Nullable<int> eventtype
        {
            get
            {
                return this._eventtype;
            }
            set
            {
                if ((this._eventtype != value))
                {
                    this._eventtype = value;
                }
            }
        }

        
        public System.Nullable<int> objectid
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

        
        public System.Nullable<int> int1
        {
            get
            {
                return this._int1;
            }
            set
            {
                if ((this._int1 != value))
                {
                    this._int1 = value;
                }
            }
        }

        
        public System.Nullable<int> int2
        {
            get
            {
                return this._int2;
            }
            set
            {
                if ((this._int2 != value))
                {
                    this._int2 = value;
                }
            }
        }

        
        public System.Nullable<int> int3
        {
            get
            {
                return this._int3;
            }
            set
            {
                if ((this._int3 != value))
                {
                    this._int3 = value;
                }
            }
        }
    }


    public partial class Research : Lockable
    {

        private short _id;

        private string _objectimageurl;

        private string _description;

        private short _baseCost;

        private short _cost;

        private int _label;

        private int _descriptionlabel;

        private byte _researchtype;

        private byte _treecolumn;

        private byte _treerow;

        public ResearchGain ResearchGain;

        public Research(short id)
        {
            this.id = id;          
        }
        public Research()
        {
        }

        public Research(
            short researchid, string objectimageurl, string description, short baseCost, short cost,
            int label ,            int descriptionlabel ,            byte researchtype ,            byte treecolumn ,            byte treerow 
            )
        {
            this.id = researchid;
            this.objectimageUrl = objectimageurl;
            this.description = description;
            this.baseCost = baseCost;
            this.cost = cost;
            this.label = label;
            this.descriptionLabel = descriptionlabel;
            this.researchType = researchtype;
            this.treeColumn = treecolumn;
            this.treeRow = treerow;
        }

        public static System.Data.DataTable createDataTable()
        {
            System.Data.DataTable dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            dataTable.AddColumn(System.Type.GetType("System.Int16"), "id");
            dataTable.AddColumn(System.Type.GetType("System.Int16"), "cost");
      
            return dataTable;
        }

        public object createData()
        {
            return new
            {
                this.id
                ,
                this.cost
            };

        }
        
        public short id
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

        
        public string objectimageUrl
        {
            get
            {
                return this._objectimageurl;
            }
            set
            {
                if ((this._objectimageurl != value))
                {
                    this._objectimageurl = value;
                }
            }
        }

        
        public string description
        {
            get
            {
                return this._description;
            }
            set
            {
                if ((this._description != value))
                {
                    this._description = value;
                }
            }
        }

        
        public short baseCost
        {
            get
            {
                return this._baseCost;
            }
            set
            {
                if ((this._baseCost != value))
                {
                    this._baseCost = value;
                }
            }
        }

        public short cost
        {
            get
            {
                return this._cost;
            }
            set
            {
                if ((this._cost != value))
                {
                    this._cost = value;
                }
            }
        }

        
        public int label
        {
            get
            {
                return this._label;
            }
            set
            {
                if ((this._label != value))
                {
                    this._label = value;
                }
            }
        }

        
        public int descriptionLabel
        {
            get
            {
                return this._descriptionlabel;
            }
            set
            {
                if ((this._descriptionlabel != value))
                {
                    this._descriptionlabel = value;
                }
            }
        }

        
        public byte researchType
        {
            get
            {
                return this._researchtype;
            }
            set
            {
                if ((this._researchtype != value))
                {
                    this._researchtype = value;
                }
            }
        }

        
        public byte treeColumn
        {
            get
            {
                return this._treecolumn;
            }
            set
            {
                if ((this._treecolumn != value))
                {
                    this._treecolumn = value;
                }
            }
        }

        
        public byte treeRow
        {
            get
            {
                return this._treerow;
            }
            set
            {
                if ((this._treerow != value))
                {
                    this._treerow = value;
                }
            }
        }
    }

    
    public partial class ResearchGain
    {

        private short _researchid;


        private short _research;
        private short _energy;
        private short _housing;

        private int _growth;

        private int _construction;

        private int _industrie;

        private int _food;

        private short _colonycount;

        private short _fleetcount;

        private short _objectid;

        public ResearchGain()
        {
        }

        
        public short researchId
        {
            get
            {
                return this._researchid;
            }
            set
            {
                if ((this._researchid != value))
                {
                    this._researchid = value;
                }
            }
        }

        public short research
        {
            get
            {
                return this._research;
            }
            set
            {
                if ((this._research != value))
                {
                    this._research = value;
                }
            }
        }
        public short energy
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
        public short housing
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
        
        public int growth
        {
            get
            {
                return this._growth;
            }
            set
            {
                if ((this._growth != value))
                {
                    this._growth = value;
                }
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

        
        public int industrie
        {
            get
            {
                return this._industrie;
            }
            set
            {
                if ((this._industrie != value))
                {
                    this._industrie = value;
                }
            }
        }

        
        public int food
        {
            get
            {
                return this._food;
            }
            set
            {
                if ((this._food != value))
                {
                    this._food = value;
                }
            }
        }

        
        public short colonyCount
        {
            get
            {
                return this._colonycount;
            }
            set
            {
                if ((this._colonycount != value))
                {
                    this._colonycount = value;
                }
            }
        }

        public short fleetCount
        {
            get
            {
                return this._fleetcount;
            }
            set
            {
                if ((this._fleetcount != value))
                {
                    this._fleetcount = value;
                }
            }
        }

        public short objectId
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
    }

    
    public partial class ResearchQuestPrerequisite : Lockable
    {

        private short _sourcetype;

        private short _sourceid;

        private short _targettype;

        private short _targetid;

        public ResearchQuestPrerequisite()
        {
        }

        /*
         * Sourcetype + TargetType:
        1 Research	
        2 Quest		
        3 Buildings
        4 ShipModule
        5 ShipHulls
        6 Ressources  - only as SourceType -> these are needed for special ressources.
        */
        public ResearchQuestPrerequisite(short sourcetype , short sourceid , short targettype , short targetid )
        {
            this.SourceType = sourcetype;
            this.SourceId = sourceid;
            this.TargetType = targettype;
            this.TargetId = targetid;
        }
        public short SourceType
        {
            get
            {
                return this._sourcetype;
            }
            set
            {
                if ((this._sourcetype != value))
                {
                    this._sourcetype = value;
                }
            }
        }
        
        public short SourceId
        {
            get
            {
                return this._sourceid;
            }
            set
            {
                if ((this._sourceid != value))
                {
                    this._sourceid = value;
                }
            }
        }
        
        public short TargetType
        {
            get
            {
                return this._targettype;
            }
            set
            {
                if ((this._targettype != value))
                {
                    this._targettype = value;
                }
            }
        }
        
        public short TargetId
        {
            get
            {
                return this._targetid;
            }
            set
            {
                if ((this._targetid != value))
                {
                    this._targetid = value;
                }
            }
        }
    }

    
    public partial class resultMessage
    {

        private int _resultid;

        private string _resulttext;

        public resultMessage()
        {
        }

        
        public int resultid
        {
            get
            {
                return this._resultid;
            }
            set
            {
                if ((this._resultid != value))
                {
                    this._resultid = value;
                }
            }
        }

        
        public string resulttext
        {
            get
            {
                return this._resulttext;
            }
            set
            {
                if ((this._resulttext != value))
                {
                    this._resulttext = value;
                }
            }
        }
    }

    
    public partial class ShipHull
    {

        private byte _id;

        private bool _isstarbase;

        private string _typename;

        private int _labelname;

        private int _objectid;

        private byte _modulescount;

        private string _templateimageurl;

        private int _label;

        [XmlElement(ElementName = "shipHullGain")]
        public ShipHullsGain ShipHullGain;
        [XmlElement(ElementName = "shipHullCosts")]
        public List<ShipHullsCost> ShipHullsCosts;

        [XmlIgnoreAttribute]
        public List<ShipHullsImage> ShipHullsImages;

        [XmlElement(ElementName = "ShipHullsModulePositions")]
        public List<ShipHullsModulePosition> ShipHullsModulePositions;


        public ShipHull(byte id)
        {
            this.id = id;
            ShipHullsCosts = new List<ShipHullsCost>();
            ShipHullsImages = new List<ShipHullsImage>();
            ShipHullsModulePositions = new List<ShipHullsModulePosition>();
        }

        public ShipHull()
        {
        }


        public ShipHull(byte ShipHullId , bool ShipHullisstarbase , string ShipHulltypename , int ShipHulllabelname ,
            int ShipHullobjectid , byte ShipHullmodulescount , string ShipHulltemplateimageurl  , int ShipHulllabel )
        {
           this.id = 1;
           this.isstarbase = false;
           this.typename = "UT_Scout";
           this.labelName = 1;
           this.objectId = 1;
           this.modulesCount = 3;
           this.templateImageUrl = "hull.gif";
           this.label = 1;

           this.ShipHullsCosts = new List<ShipHullsCost>();
           this.ShipHullsImages = new List<ShipHullsImage>();
           this.ShipHullsModulePositions = new List<ShipHullsModulePosition>();
        }

        public Tuple<int, short> ExperienceLevelModifiers(int level)
        {
            var ret = new Tuple<int, short>(0, 0);

            if (this.id == 1)
            {
                return new Tuple<int, short>(level * 7,  (short)(level * 3));                
            }

            if (this.id == 2)
            {
                return new Tuple<int, short>(level * 7, (short)(level * 3));
            }

            if (this.id == 3)
            {
                return new Tuple<int, short>(level * 7, (short)(level * 3));
            }

            if (this.id == 4)
            {
                return new Tuple<int, short>(level * 7, (short)Math.Max( (level * 3) - 3,0));
            }

            if (this.id == 5)
            {
                return new Tuple<int, short>(level * 7, (short)Math.Max((level * 3) - 3, 0));
            }

            if (this.id == 7)
            {
                return new Tuple<int, short>(level * 7, (short)Math.Max((level * 3) - 6, 0));
            }

            if (this.id == 8)
            {
                return new Tuple<int, short>(level * 8, 0);
            }

            if (this.id == 199)
            {
                return new Tuple<int, short>(level * 8, 0);
            }

            if (this.id == 200)
            {
                return new Tuple<int, short>(level * 8, 0);
            }

            if (this.id == 201)
            {
                return new Tuple<int, short>(level * 8, 0);
            }

            if (this.id == 202)
            {
                return new Tuple<int, short>(level * 8, 0);
            }

            if (this.id == 220)
            {
                return new Tuple<int, short>(level * 8, 0);
            }

            return new Tuple<int, short>(0, 0); ;
        }

        public byte id
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

        [XmlIgnoreAttribute]
        public bool isstarbase
        {
            get
            {
                return this._isstarbase;
            }
            set
            {
                if ((this._isstarbase != value))
                {
                    this._isstarbase = value;
                }
            }
        }
        
        public byte isStarBase
        {
            get
            {
                return this._isstarbase ? (byte)1 : (byte)0;
            }
            set
            {
                bool newVal = value == 0 ? false : true;
                if ((this._isstarbase != newVal))
                {
                    this._isstarbase = newVal;
                }
            }
        }

        
        
        public string typename
        {
            get
            {
                return this._typename;
            }
            set
            {
                if ((this._typename != value))
                {
                    this._typename = value;
                }
            }
        }

        
        public int labelName
        {
            get
            {
                return this._labelname;
            }
            set
            {
                if ((this._labelname != value))
                {
                    this._labelname = value;
                }
            }
        }

        
        public int objectId
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

        
        public byte modulesCount
        {
            get
            {
                return this._modulescount;
            }
            set
            {
                if ((this._modulescount != value))
                {
                    this._modulescount = value;
                }
            }
        }

        
        public string templateImageUrl
        {
            get
            {
                return this._templateimageurl;
            }
            set
            {
                if ((this._templateimageurl != value))
                {
                    this._templateimageurl = value;
                }
            }
        }

        
        public int label
        {
            get
            {
                return this._label;
            }
            set
            {
                if ((this._label != value))
                {
                    this._label = value;
                }
            }
        }
    }

    //[XmlElement(ElementName = "ship")]
    

    
    public partial class ShipHullsCost
    {

        private byte _shiphullid;

        private short _goodsid;

        private short _amount;

        public ShipHullsCost()
        {
        }

        
        public byte shiphullid
        {
            get
            {
                return this._shiphullid;
            }
            set
            {
                if ((this._shiphullid != value))
                {
                    this._shiphullid = value;
                }
            }
        }

        //ToDo: get from template, or better remove from shipXML
       
        public short goodsId
        {
            get
            {
                return this._goodsid;
            }
            set
            {
                if ((this._goodsid != value))
                {
                    this._goodsid = value;
                }
            }
        }

        
        public short amount
        {
            get
            {
                return this._amount;
            }
            set
            {
                if ((this._amount != value))
                {
                    this._amount = value;
                }
            }
        }
    }


    public partial class ShipHullsGain : ModuleStatistics
    {

        private byte _shiphullid;

        private int _crew;

        private short _energy;

        private short _hitpoints;

        private short _evasion;

        private short _damageoutput;

        private short _cargoroom;

        private short _fuelroom;

        private short _inspacespeed;

        private short _insystemspeed;

        private decimal _maxspacemoves;

        private decimal _maxsystemmoves;

        private int _special;

        private byte _scanrange;

        long _population;

        private double _speedFactor;

        public ShipHullsGain()
        {
        }

        public ShipHullsGain(byte shiphullid,
            int crew ,
            short energy ,
            short hitpoints ,
            byte damagereduction ,
            short damageoutput ,
            short cargoroom ,
            short fuelroom ,
            short inspacespeed ,
            short insystemspeed ,
            decimal maxspacemoves ,
            decimal maxsystemmoves ,
            byte scanrange ,
            int special ,
            long population )
        {
            this.shiphullid = shiphullid;
            this.crew = crew;
            this.energy = energy;
            this.hitpoints = hitpoints;
            this.damagereduction = damagereduction;
            this.damageoutput = damageoutput;
            this.cargoroom = cargoroom;
            this.fuelroom = fuelroom;
            this.inSpaceSpeed = inspacespeed;
            this.inSystemSpeed = insystemspeed;
            this.maxSpaceMoves = maxspacemoves;
            this.maxSystemMoves = maxsystemmoves;
            this.scanRange = scanrange;
            this.special = special;
            this.population = population;
        }

        
        public byte shiphullid
        {
            get
            {
                return this._shiphullid;
            }
            set
            {
                if ((this._shiphullid != value))
                {
                    this._shiphullid = value;
                }
            }
        }

        public double speedFactor
        {
            get
            {
                return this._speedFactor;
            }
            set
            {
                if ((this._speedFactor != value))
                {
                    this._speedFactor = value;
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

        
        public short energy
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
                    this._hitpoints = value;
                }
            }
        }

        public short Evasion
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

        public byte damagereduction
        {
            get
            {
                return 0;
            }
            set
            {
                
            }
        }

        
        public short damageoutput
        {
            get
            {
                return this._damageoutput;
            }
            set
            {
                if ((this._damageoutput != value))
                {
                    this._damageoutput = value;
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

        
        public short inSpaceSpeed
        {
            get
            {
                return this._inspacespeed;
            }
            set
            {
                if ((this._inspacespeed != value))
                {
                    this._inspacespeed = value;
                }
            }
        }

        
        public short inSystemSpeed
        {
            get
            {
                return this._insystemspeed;
            }
            set
            {
                if ((this._insystemspeed != value))
                {
                    this._insystemspeed = value;
                }
            }
        }


        public decimal maxSpaceMoves
        {
            get
            {
                return this._maxspacemoves;
            }
            set
            {
                if ((this._maxspacemoves != value))
                {
                    this._maxspacemoves = value;
                }
            }
        }


        public decimal maxSystemMoves
        {
            get
            {
                return this._maxsystemmoves;
            }
            set
            {
                if ((this._maxsystemmoves != value))
                {
                    this._maxsystemmoves = value;
                }
            }
        }

        
        public int special
        {
            get
            {
                return this._special;
            }
            set
            {
                if ((this._special != value))
                {
                    this._special = value;
                }
            }
        }


        public byte scanRange
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
    }

    
    public partial class ShipHullsImage
    {

        private int _id;

        private byte _shiphullid;

        private int _objectid;

        private int _templateimageid;

        private int _templatemodulesxoffset;

        private int _templatemodulesyoffset;

        public ShipHullsImage()
        {
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

        
        public byte shipHullId
        {
            get
            {
                return this._shiphullid;
            }
            set
            {
                if ((this._shiphullid != value))
                {
                    this._shiphullid = value;
                }
            }
        }

        
        public int objectId
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

        
        public int templateImageId
        {
            get
            {
                return this._templateimageid;
            }
            set
            {
                if ((this._templateimageid != value))
                {
                    this._templateimageid = value;
                }
            }
        }

        
        public int templateModulesXoffset
        {
            get
            {
                return this._templatemodulesxoffset;
            }
            set
            {
                if ((this._templatemodulesxoffset != value))
                {
                    this._templatemodulesxoffset = value;
                }
            }
        }

        
        public int templateModulesYoffset
        {
            get
            {
                return this._templatemodulesyoffset;
            }
            set
            {
                if ((this._templatemodulesyoffset != value))
                {
                    this._templatemodulesyoffset = value;
                }
            }
        }
    }

    
    public partial class ShipHullsModulePosition
    {

        private byte _shiphullid;

        private byte _posx;

        private byte _posy;

        public ShipHullsModulePosition()
        {
        }
        public ShipHullsModulePosition(byte shiphullid, byte posx, byte posy)
        {
            this.shiphullid = shiphullid;
            this.posX = posx;
            this.posY = posy;
        }
        

        public byte shiphullid
        {
            get
            {
                return this._shiphullid;
            }
            set
            {
                if ((this._shiphullid != value))
                {
                    this._shiphullid = value;
                }
            }
        }

        
        public byte posX
        {
            get
            {
                return this._posx;
            }
            set
            {
                if ((this._posx != value))
                {
                    this._posx = value;
                }
            }
        }

        
        public byte posY
        {
            get
            {
                return this._posy;
            }
            set
            {
                if ((this._posy != value))
                {
                    this._posy = value;
                }
            }
        }
    }


    public partial class ShipModule : ShipStatisticModulePosition
    {

        private int _shipid;

        private short _moduleid;

        private byte _posx;

        private byte _posy;

        private short _hitpoints;

        private bool _active;

        public ShipModule()
        {
        }

        public ShipModule(int shipId, short moduleId, byte posx, byte posy, short hitpoints = 100, bool active = true)
        {
            this.shipId = shipId;
            this.moduleId = moduleId;
            this.posX = posx;
            this.posY = posy;
            this.hitpoints = hitpoints;
            this.active = active;
        }

        public ShipModule clone()
        {
            ShipModule clone = new ShipModule();
            clone.shipId = this.shipId;
            clone.moduleId = this.moduleId;
            clone.posX = this.posX;
            clone.posY = this.posY;
            clone.hitpoints = this.hitpoints;
            clone.active = this.active;
            return clone;
        }

        public static System.Data.DataTable createDataTable(){
            var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());
            
            DataColumn column;
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "shipId";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int16");
            column.ColumnName = "moduleId";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Byte");
            column.ColumnName = "posX";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Byte");
            column.ColumnName = "posY";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int16");
            column.ColumnName = "hitpoints";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Boolean");
            column.ColumnName = "active";
            dataTable.Columns.Add(column);

            return dataTable;
        }

        public int shipId
        {
            get
            {
                return this._shipid;
            }
            set
            {
                if ((this._shipid != value))
                {
                    this._shipid = value;
                }
            }
        }

        
        public short moduleId
        {
            get
            {
                return this._moduleid;
            }
            set
            {
                if ((this._moduleid != value))
                {
                    this._moduleid = value;
                }
            }
        }

        
        public byte posX
        {
            get
            {
                return this._posx;
            }
            set
            {
                if ((this._posx != value))
                {
                    this._posx = value;
                }
            }
        }
        
        public byte posY
        {
            get
            {
                return this._posy;
            }
            set
            {
                if ((this._posy != value))
                {
                    this._posy = value;
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
                    this._hitpoints = value;
                }
            }
        }

        
        public bool active
        {
            get
            {
                return this._active;
            }
            set
            {
                if ((this._active != value))
                {
                    this._active = value;
                }
            }
        }

        // The JavaScriptSerializer ignores this field.
        [System.Web.Script.Serialization.ScriptIgnore]
        [XmlIgnore]
        public Module module
        {
            get
            {
                return Core.Instance.Modules[this.moduleId];
            }            
        }
    }

    [XmlRoot(ElementName = "good")]
    public partial class shipStock : SpaceObjectStock
    {

        private int _shipid;

        private short _goodsid;

        private int _amount;

        public shipStock()
        {
        }

        public shipStock(int shipId, short goodsId, int amount)
        {
            this.shipId = shipId; this.goodsId = goodsId; this.amount = amount;
        }

        public static System.Data.DataTable createDataTable()
        {
            var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            DataColumn column;
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "shipId";
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


        public int shipId
        {
            get
            {
                return this._shipid;
            }
            set
            {
                if ((this._shipid != value))
                {
                    this._shipid = value;
                }
            }
        }

        
        public short goodsId
        {
            get
            {
                return this._goodsid;
            }
            set
            {
                if ((this._goodsid != value))
                {
                    this._goodsid = value;
                }
            }
        }

        
        public int amount
        {
            get
            {
                return this._amount;
            }
            set
            {
                if ((this._amount != value))
                {
                    this._amount = value;
                }
            }
        }
    }

    public partial class shipRefit : AsyncInsertable
    {

        private int _shipid;

        private int _refitCounter;

        public shipRefit()
        {
            _refitCounter = 3;
        }

        public Task insert(System.Data.SqlClient.SqlCommand _command)
        {
            return Core.Instance.dataConnection.mergeShipRefit(this, _command);
        }

        
        
        

        
        public int shipId
        {
            get
            {
                return this._shipid;
            }
            set
            {
                if ((this._shipid != value))
                {
                    this._shipid = value;
                }
            }
        }

        public int refitCounter
        {
            get
            {
                return this._refitCounter;
            }
            set
            {
                if ((this._refitCounter != value))
                {
                    this._refitCounter = value;
                }
            }
        }

        public static shipRefit add(int shipId){
            Core core = Core.Instance;            
            foreach (var refit in core.shipRefits)
            {
                if (refit.shipId == shipId) refit.refitCounter = 3;
                core.ships[shipId].refitCounter = 3;
                return refit;
            }
            shipRefit newRefit = new shipRefit();
            newRefit.shipId = shipId;
            core.shipRefits.Add(newRefit);
            core.ships[shipId].refitCounter = 3;
            return newRefit;
        }

        //should only be called during turn evaluation!
        public static void decrement()
        {
            Core core = Core.Instance;
            foreach(var refit in core.shipRefits)
            {
                refit.refitCounter -= 1;
                //core.ships[refit.shipId].refitCounter = refit.refitCounter;

                if(refit.refitCounter == 0)
                {
                    if (core.ships[refit.shipId] != null)
                    {
                        StatisticsCalculator.calc(core.ships[refit.shipId], Core.Instance);
                    }
                }
            }
            core.shipRefits.RemoveAll(refit => refit.refitCounter < 1);
        }
    }


    public partial class shipDirection : AsyncInsertable
    {

        private int _shipid;

        private int _moveCounter;

        private byte _moveDirection;

        public shipDirection()
        {
        }

        public Task insert(System.Data.SqlClient.SqlCommand _command)
        {
            return Core.Instance.dataConnection.insertDirection(this, _command);            
        }

        public int shipId
        {
            get
            {
                return this._shipid;
            }
            set
            {
                if ((this._shipid != value))
                {
                    this._shipid = value;
                }
            }
        }


        public int moveCounter
        {
            get
            {
                return this._moveCounter;
            }
            set
            {
                if ((this._moveCounter != value))
                {
                    this._moveCounter = value;
                }
            }
        }


        public byte moveDirection
        {
            get
            {
                return this._moveDirection;
            }
            set
            {
                if ((this._moveDirection != value))
                {
                    this._moveDirection = value;
                }
            }
        }
    }

    public partial class ShipTemplate : Lockable , ShipStatistics
    {

        private int _id;
        private int _userid;
        private byte _shiphullid;
        private string _name;
        private string _gif;
        private int _energy;
        private int _crew;
        private byte _scanrange;
        private short _attack;
        private short _defense;
        private short _hitpoints;
        private byte _damagereduction;
        private short _cargoroom;
        private short _fuelroom;
        private Decimal _systemmovesperturn;
        private Decimal _galaxymovesperturn;
        private Decimal _systemmovesmax;
        private Decimal _galaxymovesmax;
        private int _iscolonizer;
        private long _population;
        private int _constructionduration;
        private bool _constructable;
        private int _amountbuilt;
        private bool _obsolete;
        private int _shiphullsimage;
        private List<ShipTemplateModules> _shipModules;
        private long _versionId;

        public ShipTemplate()
        {
            _shipModules = new List<ShipTemplateModules>();
        }

        public ShipTemplate(int id)
        {
            this.id = id;
            _shipModules = new List<ShipTemplateModules>();
        }

        public ShipTemplate clone()
        {
            ShipTemplate newTemplate = new ShipTemplate();

            newTemplate.id = (int)SpacegameServer.Core.Core.Instance.identities.templateLock.getNext();

            newTemplate.userId = this.userId;
            newTemplate._shiphullid = this._shiphullid;
            newTemplate.name = this.name;
            newTemplate.gif = this.gif ;
            newTemplate.energy = this.energy ;
            newTemplate.crew = this.crew ;
            newTemplate.scanRange = this.scanRange ;
            newTemplate.attack = this.attack ;
            newTemplate.defense = this.defense ;
            newTemplate.hitpoints = this.hitpoints ;
            newTemplate.damagereduction = this.damagereduction ;
            newTemplate.cargoroom = this.cargoroom ;
            newTemplate.fuelroom = this.fuelroom ;
            newTemplate.systemmovesperturn = this.systemmovesperturn ;
            newTemplate.galaxymovesperturn = this.galaxymovesperturn ;
            newTemplate._systemmovesmax = this._systemmovesmax ;
            newTemplate._galaxymovesmax = this._galaxymovesmax ;
            newTemplate._iscolonizer = this._iscolonizer ;
            newTemplate._iscolonizer = this._iscolonizer ;
            newTemplate._iscolonizer = this._iscolonizer ;
            newTemplate._iscolonizer = this._iscolonizer ;
            newTemplate._iscolonizer = this._iscolonizer ;
            newTemplate.population = this.population ;
            newTemplate._constructionduration = this._constructionduration ;
            newTemplate._constructable = this._constructable ;
            newTemplate._amountbuilt = this._amountbuilt ;
            newTemplate._obsolete = this._obsolete ;
            newTemplate._shiphullsimage = this._shiphullsimage ;
            newTemplate._versionId = this._versionId ;    

            foreach(var module in this.shipModules)
            {
                newTemplate.shipModules.Add(new ShipTemplateModules(newTemplate.id, module.posX, module.posY, module.moduleId));
            }                          

            return newTemplate;
        }

        

        [XmlElement(ElementName = "ShipTemplateModulePositions")]
        public List<ShipTemplateModules> shipModules
        {
            get
            {
                return _shipModules;
            }
        }


        public List<shipStock> ShipTemplateCosts
        {

            get
            {
                return StatisticsCalculator.calcCosts(this);
            }
        }

        [XmlIgnore]
        public List<ShipStatisticModulePosition> shipStatisticsModules
        {
            get
            {
                return _shipModules.OfType<ShipStatisticModulePosition>().ToList();
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

        [XmlElement(ElementName = "shipHullId")]
        public byte hullid
        {
            get
            {
                return this._shiphullid;
            }
            set
            {
                if ((this._shiphullid != value))
                {
                    this._shiphullid = value;
                }
            }
        }

        
        public string name
        {
            get
            {
                return this._name;
            }
            set
            {
                if ((this._name != value))
                {
                    this._name = value;
                }
            }
        }

        
        public string gif
        {
            get
            {
                return this._gif;
            }
            set
            {
                if ((this._gif != value))
                {
                    this._gif = value;
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

        public byte scanRange
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
                    this._attack = value;
                }
            }
        }


        public short defense
        {
            get
            {
                return this._defense;
            }
            set
            {
                if ((this._defense != value))
                {
                    this._defense = value;
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

         [XmlElement(ElementName = "systemMovesPerTurn")]
        public Decimal systemmovesperturn
        {
            get
            {
                return this._systemmovesperturn;
            }
            set
            {
                if ((this._systemmovesperturn != value))
                {
                    this._systemmovesperturn = value;
                }
            }
        }

         [XmlElement(ElementName = "galaxyMovesPerTurn")]
        public Decimal galaxymovesperturn
        {
            get
            {
                return this._galaxymovesperturn;
            }
            set
            {
                if ((this._galaxymovesperturn != value))
                {
                    this._galaxymovesperturn = value;
                }
            }
        }

        [XmlElement(ElementName = "systemMovesMax")]
        public Decimal max_impuls
        {
            get
            {
                return this._systemmovesmax;
            }
            set
            {
                if ((this._systemmovesmax != value))
                {
                    this._systemmovesmax = value;
                }
            }
        }

        [XmlElement(ElementName = "galaxyMovesMax")]
        public Decimal max_hyper
        {
            get
            {
                return this._galaxymovesmax;
            }
            set
            {
                if ((this._galaxymovesmax != value))
                {
                    this._galaxymovesmax = value;
                }
            }
        }

         [XmlElement(ElementName = "isColonizer")]
        public int iscolonizer
        {
            get
            {
                return this._iscolonizer;
            }
            set
            {
                if ((this._iscolonizer != value))
                {
                    this._iscolonizer = value;
                }
            }
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]    
        public byte colonizer
        {
            get
            {
                return this._iscolonizer > 0 ? (byte)1 : (byte)0;
            }
            set
            {                
                if ((this._iscolonizer != value))
                {
                    this._iscolonizer = value;
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

        [XmlElement(ElementName = "constructionDuration")]
        public int constructionduration
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

        [XmlIgnore]
        public bool isConstructable
        {
            get
            {
                return this._constructable;
            }
            set
            {
                if ((this._constructable != value))
                {
                    this._constructable = value;
                }
            }
        }

        public int constructable
        {
            get
            {
                return this._constructable ? 1 : 0;
            }
            set
            {
                bool newVal = value == 1;
                if ((this._constructable != newVal))
                {
                    this._constructable = newVal;
                }
            }
        }


        
        public int amountbuilt
        {
            get
            {
                return this._amountbuilt;
            }
            set
            {
                if ((this._amountbuilt != value))
                {
                    this._amountbuilt = value;
                }
            }
        }

        
        public bool obsolete
        {
            get
            {
                return this._obsolete;
            }
            set
            {
                if ((this._obsolete != value))
                {
                    this._obsolete = value;
                }
            }
        }

        
        public int shipHullsImage
        {
            get
            {
                return this._shiphullsimage;
            }
            set
            {
                if ((this._shiphullsimage != value))
                {
                    this._shiphullsimage = value;
                }
            }
        }

        public long versionId
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
        
    }

    
    public partial class ShipTemplateBlueprint
    {

        private int _id;

        private byte _shiphullid;

        private string _NAME;

        private string _gif;

        private System.Nullable<int> _energy;

        private System.Nullable<int> _crew;

        private System.Nullable<short> _scanrange;

        private System.Nullable<int> _attack;

        private System.Nullable<int> _defense;

        private System.Nullable<int> _hitpoints;

        private System.Nullable<short> _damagereduction;

        private System.Nullable<short> _cargoroom;

        private System.Nullable<short> _fuelroom;

        private System.Nullable<int> _systemmovesperturn;

        private System.Nullable<int> _galaxymovesperturn;

        private System.Nullable<int> _systemmovesmax;

        private System.Nullable<int> _galaxymovesmax;

        private System.Nullable<int> _iscolonizer;

        private System.Nullable<int> _constructionduration;

        private System.Nullable<bool> _constructable;

        private System.Nullable<int> _amountbuilt;

        private System.Nullable<bool> _obsolete;

        public ShipTemplateBlueprint()
        {
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

        
        public byte shiphullid
        {
            get
            {
                return this._shiphullid;
            }
            set
            {
                if ((this._shiphullid != value))
                {
                    this._shiphullid = value;
                }
            }
        }

        
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

        
        public string gif
        {
            get
            {
                return this._gif;
            }
            set
            {
                if ((this._gif != value))
                {
                    this._gif = value;
                }
            }
        }

        
        public System.Nullable<int> energy
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

        
        public System.Nullable<int> crew
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

        
        public System.Nullable<short> scanrange
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

        
        public System.Nullable<int> attack
        {
            get
            {
                return this._attack;
            }
            set
            {
                if ((this._attack != value))
                {
                    this._attack = value;
                }
            }
        }

        
        public System.Nullable<int> defense
        {
            get
            {
                return this._defense;
            }
            set
            {
                if ((this._defense != value))
                {
                    this._defense = value;
                }
            }
        }

        
        public System.Nullable<int> hitpoints
        {
            get
            {
                return this._hitpoints;
            }
            set
            {
                if ((this._hitpoints != value))
                {
                    this._hitpoints = value;
                }
            }
        }

        
        public System.Nullable<short> damagereduction
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

        
        public System.Nullable<short> cargoroom
        {
            get
            {
                return this._cargoroom;
            }
            set
            {
                if ((this._cargoroom != value))
                {
                    this._cargoroom = value;
                }
            }
        }

        
        public System.Nullable<short> fuelroom
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

        
        public System.Nullable<int> systemmovesperturn
        {
            get
            {
                return this._systemmovesperturn;
            }
            set
            {
                if ((this._systemmovesperturn != value))
                {
                    this._systemmovesperturn = value;
                }
            }
        }

        
        public System.Nullable<int> galaxymovesperturn
        {
            get
            {
                return this._galaxymovesperturn;
            }
            set
            {
                if ((this._galaxymovesperturn != value))
                {
                    this._galaxymovesperturn = value;
                }
            }
        }

        
        public System.Nullable<int> systemmovesmax
        {
            get
            {
                return this._systemmovesmax;
            }
            set
            {
                if ((this._systemmovesmax != value))
                {
                    this._systemmovesmax = value;
                }
            }
        }

        
        public System.Nullable<int> galaxymovesmax
        {
            get
            {
                return this._galaxymovesmax;
            }
            set
            {
                if ((this._galaxymovesmax != value))
                {
                    this._galaxymovesmax = value;
                }
            }
        }

        
        public System.Nullable<int> iscolonizer
        {
            get
            {
                return this._iscolonizer;
            }
            set
            {
                if ((this._iscolonizer != value))
                {
                    this._iscolonizer = value;
                }
            }
        }

        
        public System.Nullable<int> constructionduration
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

        
        public System.Nullable<bool> constructable
        {
            get
            {
                return this._constructable;
            }
            set
            {
                if ((this._constructable != value))
                {
                    this._constructable = value;
                }
            }
        }

        
        public System.Nullable<int> amountbuilt
        {
            get
            {
                return this._amountbuilt;
            }
            set
            {
                if ((this._amountbuilt != value))
                {
                    this._amountbuilt = value;
                }
            }
        }

        
        public System.Nullable<bool> obsolete
        {
            get
            {
                return this._obsolete;
            }
            set
            {
                if ((this._obsolete != value))
                {
                    this._obsolete = value;
                }
            }
        }
    }

    
    public partial class ShipTemplateCost
    {

        private int _shiptemplateid;

        private short _goodsid;

        private short _amount;

        public ShipTemplateCost()
        {
        }

        
        public int shiptemplateid
        {
            get
            {
                return this._shiptemplateid;
            }
            set
            {
                if ((this._shiptemplateid != value))
                {
                    this._shiptemplateid = value;
                }
            }
        }

        
        public short goodsid
        {
            get
            {
                return this._goodsid;
            }
            set
            {
                if ((this._goodsid != value))
                {
                    this._goodsid = value;
                }
            }
        }

        
        public short amount
        {
            get
            {
                return this._amount;
            }
            set
            {
                if ((this._amount != value))
                {
                    this._amount = value;
                }
            }
        }
    }


    public partial class ShipTemplateModules : ShipStatisticModulePosition
    {

        private int _shiptemplateid;

        private byte _posx;

        private byte _posy;

        private short _moduleid;

        public ShipTemplateModules()
        {
        }

        public ShipTemplateModules( int shiptemplateid, byte posx, byte posy, short moduleid)
        {
            this._shiptemplateid = shiptemplateid;
            this.posX = posx;
            this.posY = posy;
            this.moduleId = moduleid;
        }

        public ShipTemplateModules clone()
        {
            ShipTemplateModules clone = new ShipTemplateModules();          
            clone.moduleId = this.moduleId;
            clone.posX = this.posX;
            clone.posY = this.posY;       
            return clone;
        }

        public ShipModule createShipModule(int shipId)
        {
            ShipModule clone = new ShipModule();
            clone.shipId = shipId;
            clone.moduleId = this.moduleId;
            clone.posX = this.posX;
            clone.posY = this.posY;
            clone.active = true;
            clone.hitpoints = 10;
            return clone;
        }

        public static System.Data.DataTable createDataTable()
        {
            var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            DataColumn column;
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "templateId";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int16");
            column.ColumnName = "moduleId";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Byte");
            column.ColumnName = "posX";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Byte");
            column.ColumnName = "posY";
            dataTable.Columns.Add(column);
           
            return dataTable;
        }

        public int shiptemplateid
        {
            get
            {
                return this._shiptemplateid;
            }
            set
            {
                if ((this._shiptemplateid != value))
                {
                    this._shiptemplateid = value;
                }
            }
        }

        
        public byte posX
        {
            get
            {
                return this._posx;
            }
            set
            {
                if ((this._posx != value))
                {
                    this._posx = value;
                }
            }
        }

        
        public byte posY
        {
            get
            {
                return this._posy;
            }
            set
            {
                if ((this._posy != value))
                {
                    this._posy = value;
                }
            }
        }

        
        public short moduleId
        {
            get
            {
                return this._moduleid;
            }
            set
            {
                if ((this._moduleid != value))
                {
                    this._moduleid = value;
                }
            }
        }
    }

    //used for SystemMap and SolarSystemInstance
    [XmlInclude(typeof(SystemMap)), XmlInclude(typeof(SolarSystemInstance))]
    public abstract class Colonizable : spaceObject
    {
        private int? _colonyId;

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public Colony colony;

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public List<PlanetSurface> surfaceFields;

        public abstract short ObjectId { get; set; }

        public bool IsMajorPlanet()
        {
            if (this.ObjectId >= 24 &&
                this.ObjectId <= 31) return true;
            return false;
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public abstract SystemMap Star { get; set; }

        public int? ColonyId
        {
            get
            {
                return this._colonyId;
            }
            set
            {
                if ((this._colonyId != value))
                {
                    this._colonyId = value;
                }
            }
        }


        public void createPlanetSurface(bool majorColony)
        {
            if (this.ObjectId >= 24 && this.ObjectId <= 26)
            {
                short defaultMap = 17;

                var surfaceImageCount = Core.Instance.ObjectsOnMap[this.ObjectId].ObjectImages.Count;
                var defaultMapKey = (this.Id % surfaceImageCount);
                defaultMap = (short)Core.Instance.ObjectsOnMap[this.ObjectId].ObjectImages[defaultMapKey].SurfaceDefaultMapId;

                foreach (var tile in Core.Instance.surfaceDefaultMaps.FindAll(tile => tile.id == defaultMap))
                {
                    var newId = Core.Instance.identities.planetSurfaceId.getNext();
                    PlanetSurface surfaceTile = new PlanetSurface(newId);
                    surfaceTile.planetid = this.Id;
                    surfaceTile.x = (byte)tile.x;
                    surfaceTile.y = (byte)tile.y;
                    surfaceTile.surfaceobjectid = (short)tile.surfaceobjectid;
                    Core.Instance.planetSurface.Add(newId, surfaceTile);
                    this.surfaceFields.Add(surfaceTile);
                }
            }
            else
            {
                short surfaceTileTpye = this.SurfaceTileId();
                this.makePlanetSurface(surfaceTileTpye);

                /*
                if (this.objectid > 31)
                {
                    //create moon surface
                    this.createSurfaceTile(0, 0);
                    this.createSurfaceTile(1, 1);
                }
                else
                {
                    //create minor planet surface
                    this.createSurfaceTile(0, 0);
                    this.createSurfaceTile(1, 1);
                    this.createSurfaceTile(1, 2);
                    this.createSurfaceTile(2, 2);
                }
                */
            }
        }


        //Todo: has to compare to a colony and its colonyBuildings
        public PlanetSurface freeSurfaceField()
        {
            short surfaceTileTpye = this.SurfaceTileId();
            PlanetSurface freeField = this.surfaceFields.FindAll(field => field.surfaceobjectid == surfaceTileTpye).OrderBy(x => Guid.NewGuid()).FirstOrDefault();
            return freeField;
        }


        private short SurfaceTileId()
        {
            //desert
            if (this.ObjectId >= 24 && this.ObjectId <= 26)
            {
                return 1;
            }

            //desert
            if (this.ObjectId == 27 || this.ObjectId == 38)
            {
                return 5;
            }

            //arctic
            if (this.ObjectId == 28 || this.ObjectId == 39)
            {
                return 6;
            }

            //barren
            if (this.ObjectId == 29 || this.ObjectId == 40)
            {
                return 7;
            }

            //asteroid
            if (this.ObjectId == 44)
            {
                return 8;
            }

            //vulcanic
            if (this.ObjectId == 30 || this.ObjectId == 41)
            {
                return 9;
            }

            //toxic
            if (this.ObjectId == 31 || this.ObjectId == 42)
            {
                return 10;
            }

            //fallback : gras
            return 1;
        }

        private void makePlanetSurface(short SurfaceTileId)
        {
            //row 0, ---xxx---
            for (byte x = 3; x <= 5; x++)
            {
                this.createSurfaceTile(x, 0, SurfaceTileId);
            }

            //row 1, --xxxxx--
            for (byte x = 2; x <= 6; x++)
            {
                this.createSurfaceTile(x, 1, SurfaceTileId);
            }

            //row 2, -xxxxxxx-
            for (byte x = 1; x <= 7; x++)
            {
                this.createSurfaceTile(x, 2, SurfaceTileId);
            }

            //row 3,4,5, xxxxxxxxx
            for (byte y = 3; y <= 5; y++)
            {
                for (byte x = 0; x <= 8; x++)
                {
                    this.createSurfaceTile(x, y, SurfaceTileId);
                }
            }

            //row 6, -xxxxxxx-
            for (byte x = 1; x <= 7; x++)
            {
                this.createSurfaceTile(x, 6, SurfaceTileId);
            }

            //row 7, --xxxxx--
            for (byte x = 2; x <= 6; x++)
            {
                this.createSurfaceTile(x, 7, SurfaceTileId);
            }

            //row 8, ---xxx---
            for (byte x = 3; x <= 5; x++)
            {
                this.createSurfaceTile(x, 8, SurfaceTileId);
            }

            //create orbit:
            this.createSurfaceTile(10, 1, 11);
        }

        private void createSurfaceTile(byte x, byte y)
        {
            var newId = Core.Instance.identities.planetSurfaceId.getNext();
            PlanetSurface surfaceTile = new PlanetSurface(newId);
            surfaceTile.planetid = this.Id;
            surfaceTile.x = x;
            surfaceTile.y = y;
            surfaceTile.surfaceobjectid = this.SurfaceTileId();

            Core.Instance.planetSurface.Add(newId, surfaceTile);
            this.surfaceFields.Add(surfaceTile);
        }

        private void createSurfaceTile(byte x, byte y, short surfaceTileId)
        {
            var newId = Core.Instance.identities.planetSurfaceId.getNext();
            PlanetSurface surfaceTile = new PlanetSurface(newId);
            surfaceTile.planetid = this.Id;
            surfaceTile.x = x;
            surfaceTile.y = y;
            surfaceTile.surfaceobjectid = surfaceTileId;

            Core.Instance.planetSurface.Add(newId, surfaceTile);
            this.surfaceFields.Add(surfaceTile);
        }

        public byte colonizable
        {
            get { return this.ObjectId > 23 && this.ObjectId < 30 ? (byte)1 : (byte)0; }
            set { }
        }
    }

    /// <summary>
    /// Astronomical object on starMap (Sun, planet, nebula...)
    /// </summary>
    public partial class SystemMap : Colonizable
    {

        private int _id;

        private int _posX;

        private int _posY;

        private string _systemname;

        private short _objectid;

        private short _size;

        private byte _startsystem;

        private byte _settled;

        private byte _ressourceid;

        private int? _colonyId;

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public Colony colony;

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public List<SolarSystemInstance> planets { get; set; }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]        
        public Field field;

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public string startingRegion;

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public double distanceToCenter;


        public SystemMap(int _id)
        {
            id = _id;
            this.planets = new List<SolarSystemInstance>();
            surfaceFields = new List<PlanetSurface>();
        }
        public SystemMap()
        {
            id = -1;
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

        [XmlElement(ElementName = "starId")]
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
        public int posX
        {
            get
            {
                return this._posX;
            }
            set
            {
                if ((this._posX != value))
                {
                    this._posX = value;
                    CalcDistance();
                }
            }
        }

         [XmlElement(ElementName = "ypos")]
        public int posY
        {
            get
            {
                return this._posY;
            }
            set
            {
                if ((this._posY != value))
                {
                    this._posY = value;
                    CalcDistance();
                }
            }
        }

        [System.Xml.Serialization.XmlIgnoreAttribute]
        public override SystemMap Star
        {
            get
            {
                return this;
            }
            set
            {
            }
        }

        [XmlElement(ElementName = "name")]        
        public string systemname
        {
            get
            {
                return this._systemname;
            }
            set
            {
                if ((this._systemname != value))
                {
                    this._systemname = value;
                }
            }
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public override short ObjectId
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

        public short type
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


        public short size
        {
            get
            {
                return this._size;
            }
            set
            {
                if ((this._size != value))
                {
                    this._size = value;
                }
            }
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute] 
        public byte startsystem
        {
            get
            {
                return this._startsystem;
            }
            set
            {
                if ((this._startsystem != value))
                {
                    this._startsystem = value;
                }
            }
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute] 
        public byte settled
        {
            get
            {
                return this._settled;
            }
            set
            {
                if ((this._settled != value))
                {
                    this._settled = value;
                }
            }
        }

        [XmlElement(ElementName = "ressourceId")] 
        public byte ressourceid
        {
            get
            {
                return this._ressourceid;
            }
            set
            {
                if ((this._ressourceid != value))
                {
                    this._ressourceid = value;
                }
            }
        }

        public short? BackgroundObjectId
        {
            get
            {
                return Core.Instance.ObjectsOnMap.ContainsKey(this.ObjectId) ?
                    Core.Instance.ObjectsOnMap[this.ObjectId].BackgroundObjectId(this.id) : null;
            }
            set
            {
            }
        }

        public byte? BackgroundDrawSize
        {
            get
            {
                return Core.Instance.ObjectsOnMap.ContainsKey(this.ObjectId) ?
                    Core.Instance.ObjectsOnMap[this.ObjectId].BackgroundDrawSize(this.id) : null;
            }
            set
            {
            }
        }

        public byte? TilestartingAt
        {
            get
            {
                return Core.Instance.ObjectsOnMap.ContainsKey(this.ObjectId) ?
                    Core.Instance.ObjectsOnMap[this.ObjectId].TilestartingAt(this.id) : null;
            }
            set
            {
            }
        }

        //ToDo : get objectDesc.objectimageUrl 
        public string gif
        {
            get
            {
                return "YellowSun.png";
            }
            set
            {                
            }
        }

        public byte fieldSize
        {
            get
            {
                return Core.Instance.ObjectsOnMap.ContainsKey(this.ObjectId) ?
                    Core.Instance.ObjectsOnMap[this.ObjectId].Fieldsize : (byte)1;
            }
            set
            {               
            }
        }

        public float drawsize
        {
            get
            {
                return Core.Instance.ObjectsOnMap.ContainsKey(this.ObjectId) ?
                    Core.Instance.ObjectsOnMap[this.ObjectId].drawsize(this.id) : 1f;
            }
            set
            {
            }
        }

        
        public SolarSystemInstance getPlanet(Tuple<byte, byte> xy)
        {
            foreach (SolarSystemInstance planet in planets)
            {
                if (planet.x == xy.Item1 && planet.y == xy.Item2) return planet;
            }
            return null;
        }
   
        private void CalcDistance()
        {
            
            //distanceToCenter = Math.Sqrt(((posX - 5000) * (posX - 5000)) + ((posY - 5000) * (posY - 5000)));

            //the bigger one of x and y , since diagonal moevemnt does only cost 1 point
            distanceToCenter = Math.Max(Math.Abs(posX - 5000), Math.Abs(posY - 5000));
        }
    }



    public partial class SolarSystemInstance : Colonizable
    {

        private int _id;

        private int _x;

        private int _y;

        private int _systemid;

        private short _objectid;



        public SolarSystemInstance()
        {
        }
        public SolarSystemInstance(int planetId, int planetx, int planety,
            int planetsystemid, short planetobjectid, byte planetdrawsize)
        {
            this.id = planetId;
            this.x = planetx;
            this.y = planety;
            this.systemid = planetsystemid;
            this.ObjectId = planetobjectid;
            this.fieldSize = planetdrawsize;

        }



        public SolarSystemInstance(int _id)
        {
            id = _id;
            surfaceFields = new List<PlanetSurface>();
        }



        [XmlElement(ElementName = "starId")]
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


        [XmlElement(ElementName = "xpos")]
        public int x
        {
            get
            {
                return this._x;
            }
            set
            {
                if ((this._x != value))
                {
                    this._x = value;
                }
            }
        }

        [XmlElement(ElementName = "ypos")]
        public int y
        {
            get
            {
                return this._y;
            }
            set
            {
                if ((this._y != value))
                {
                    this._y = value;
                }
            }
        }

        [XmlElement(ElementName = "systemId")]
        public int systemid
        {
            get
            {
                return this._systemid;
            }
            set
            {
                if ((this._systemid != value))
                {
                    this._systemid = value;
                }
            }
        }

        [System.Xml.Serialization.XmlIgnoreAttribute]
        public override SystemMap Star
        {
            get
            {
                return Core.Instance.stars[this.systemid];
            }
            set
            {
            }
        }


        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public override short ObjectId
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


        public short type
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



        /*
        public byte fieldSize
        {
            get
            {
                return this._fieldsize;
            }
            set
            {
                if ((this._fieldsize != value))
                {
                    this._fieldsize = value;
                }
            }
        }
        */
        public byte fieldSize
        {
            get
            {
                return Core.Instance.ObjectsOnMap.ContainsKey(this.ObjectId) ?
                    Core.Instance.ObjectsOnMap[this.ObjectId].Fieldsize : (byte)1;
            }
            set
            {
            }
        }

        public float drawsize
        {
            get
            {
                return Core.Instance.ObjectsOnMap.ContainsKey(this.ObjectId) ?
                    Core.Instance.ObjectsOnMap[this.ObjectId].drawsize(this.id) : 1f;
            }
            set
            {
            }
        }

        public short? BackgroundObjectId
        {
            get
            {
                return Core.Instance.ObjectsOnMap.ContainsKey(this.ObjectId) ?
                    Core.Instance.ObjectsOnMap[this.ObjectId].BackgroundObjectId(this.id) : null;
            }
            set
            {
            }
        }

        public byte? BackgroundDrawSize
        {
            get
            {
                return Core.Instance.ObjectsOnMap.ContainsKey(this.ObjectId) ?
                    Core.Instance.ObjectsOnMap[this.ObjectId].BackgroundDrawSize(this.id) : null;
            }
            set
            {
            }
        }

        public byte? TilestartingAt
        {
            get
            {
                return Core.Instance.ObjectsOnMap.ContainsKey(this.ObjectId) ?
                    Core.Instance.ObjectsOnMap[this.ObjectId].TilestartingAt(this.id) : null;
            }
            set
            {
            }
        }


        public string gif
        {
            get { return Core.Instance.ObjectDescriptions[Core.Instance.ObjectDescriptions[this.ObjectId].id].objectimageUrl; }
            set { }
        }

        public string name
        {
            get { return Core.Instance.ObjectDescriptions[Core.Instance.ObjectDescriptions[this.ObjectId].id].name; }
            set { }
        }

        public int size
        {
            get { return 100; }
            set { }
        }

    }



    public partial class TradeOffer : Lockable
    {

        private int _id;

        private int _commnodeid;

        private int _spaceobjectid;

        private byte _spaceobjecttype;        

        private List<TradeOfferGood> _offered;
        private List<TradeOfferGood> _requested;

        [XmlElement("offered")]
        public List<TradeOfferGood> offered { get { return _offered; } set { _offered = value; } }


        [XmlElement("requested")]
        public List<TradeOfferGood> requested { get { return _requested; } set { _requested = value; } }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public Ship TradingShip;


        public TradeOffer()
        {
           
        }

        public TradeOffer(int id)
        {
            this._id = id;
            this.offered = new List<TradeOfferGood>();
            this.requested = new List<TradeOfferGood>();
        }

        
        public int tradeOfferId
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

        
        public int commNodeId
        {
            get
            {
                return this._commnodeid;
            }
            set
            {
                if ((this._commnodeid != value))
                {
                    this._commnodeid = value;
                }
            }
        }

        
        public int spaceObjectId
        {
            get
            {
                return this._spaceobjectid;
            }
            set
            {
                if ((this._spaceobjectid != value))
                {
                    this._spaceobjectid = value;
                }
            }
        }

        
        public byte spaceObjectType
        {
            get
            {
                return this._spaceobjecttype;
            }
            set
            {
                if ((this._spaceobjecttype != value))
                {
                    this._spaceobjecttype = value;
                }
            }
        }

        
    }

    
    public partial class SurfaceDefaultMap
    {

        private short _id;

        private System.Nullable<int> _x;

        private System.Nullable<int> _y;

        private System.Nullable<int> _surfaceobjectid;

        public SurfaceDefaultMap()
        {
        }

        
        public short id
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

        
        public System.Nullable<int> x
        {
            get
            {
                return this._x;
            }
            set
            {
                if ((this._x != value))
                {
                    this._x = value;
                }
            }
        }

        
        public System.Nullable<int> y
        {
            get
            {
                return this._y;
            }
            set
            {
                if ((this._y != value))
                {
                    this._y = value;
                }
            }
        }

        
        public System.Nullable<int> surfaceobjectid
        {
            get
            {
                return this._surfaceobjectid;
            }
            set
            {
                if ((this._surfaceobjectid != value))
                {
                    this._surfaceobjectid = value;
                }
            }
        }
    }

    
    public partial class SurfaceImage
    {

        private short _id;

        private string _NAME;

        private int _seed;

        private string _objectimageurl;

        public SurfaceImage(short id)
        {
            this.id = id;
        }
        public SurfaceImage()
        {
        }
        
        public short id
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

        
        public int seed
        {
            get
            {
                return this._seed;
            }
            set
            {
                if ((this._seed != value))
                {
                    this._seed = value;
                }
            }
        }

        
        public string objectimageurl
        {
            get
            {
                return this._objectimageurl;
            }
            set
            {
                if ((this._objectimageurl != value))
                {
                    this._objectimageurl = value;
                }
            }
        }
    }

    
    public partial class SurfaceTile
    {

        private short _id;

        private string _NAME;

        private short _objectid;

        public int label;

        public short borderId;

        public SurfaceTile(short id)
        {
            this.id = id;
        }

        public SurfaceTile()
        {
        }
        public short id
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

        
        public short objectId
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
    }

    
    public partial class TradeOfferGood
    {

        private int _tradeoffersid;

        private short _goodsid;

        private int _amount;

        private bool _offer;

        public TradeOfferGood()
        {
        }

        public TradeOfferGood(GoodsTransfer transfer, int offerId, bool offer)
        {
            this.tradeoffersid = offerId;
            this.goodsId = transfer.Id;
            this.amount = transfer.Qty;
            this.offer = offer;
        }
        

        public static System.Data.DataTable createDataTable()
        {
            System.Data.DataTable dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "tradeoffersid");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "goodsId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "amount");
            dataTable.AddColumn(System.Type.GetType("System.Boolean"), "offer");

            return dataTable;
        }

        public object createData()
        {
            return new
            {
                this.tradeoffersid
                ,
                this.goodsId
                ,
                this.amount
                ,
                this.offer
            };

        }

        public int tradeoffersid
        {
            get
            {
                return this._tradeoffersid;
            }
            set
            {
                if ((this._tradeoffersid != value))
                {
                    this._tradeoffersid = value;
                }
            }
        }

        
        public short goodsId
        {
            get
            {
                return this._goodsid;
            }
            set
            {
                if ((this._goodsid != value))
                {
                    this._goodsid = value;
                }
            }
        }

        
        public int amount
        {
            get
            {
                return this._amount;
            }
            set
            {
                if ((this._amount != value))
                {
                    this._amount = value;
                }
            }
        }

        
        public bool offer
        {
            get
            {
                return this._offer;
            }
            set
            {
                if ((this._offer != value))
                {
                    this._offer = value;
                }
            }
        }
    }

    
    public partial class UserColonyMap
    {

        private int _userid;

        private int _colonyid;

        public UserColonyMap()
        {
        }

        
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
                    this._userid = value;
                }
            }
        }

        
        public int colonyid
        {
            get
            {
                return this._colonyid;
            }
            set
            {
                if ((this._colonyid != value))
                {
                    this._colonyid = value;
                }
            }
        }
    }
    
    public partial class UserQuest : Lockable
    {

        private int _userid;

        private int _questid;

        private bool _isread;

        private bool _iscompleted;

        public UserQuest()
        {
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

        
        public int questId
        {
            get
            {
                return this._questid;
            }
            set
            {
                if ((this._questid != value))
                {
                    this._questid = value;
                }
            }
        }

        
        public bool isRead
        {
            get
            {
                return this._isread;
            }
            set
            {
                if ((this._isread != value))
                {
                    this._isread = value;
                }
            }
        }

        
        public bool isCompleted
        {
            get
            {
                return this._iscompleted;
            }
            set
            {
                if ((this._iscompleted != value))
                {
                    this._iscompleted = value;
                }
            }
        }
        /*
         * 
                <script>Spaceport.js</script>
                <label>112</label>
         * */

        public int hasScript
        {
            get
            {
                return 1;
            }
            set
            {                
            }
        }

        public string script
        {
            get
            {
                return Core.Instance.Quests[this.questId].script;
            }
            set
            {
            }
        }

        public int label
        {
            get
            {
                return Core.Instance.Quests[this.questId].label;
            }
            set
            {                
            }
        }

    }

    
    public partial class UserRelation
    {

        private byte _relationid;

        private string _relationname;

        private string _relationdescription;

        public UserRelation()
        {
        }

        
        public byte relationid
        {
            get
            {
                return this._relationid;
            }
            set
            {
                if ((this._relationid != value))
                {
                    this._relationid = value;
                }
            }
        }

        
        public string relationname
        {
            get
            {
                return this._relationname;
            }
            set
            {
                if ((this._relationname != value))
                {
                    this._relationname = value;
                }
            }
        }

        
        public string relationdescription
        {
            get
            {
                return this._relationdescription;
            }
            set
            {
                if ((this._relationdescription != value))
                {
                    this._relationdescription = value;
                }
            }
        }
    }

    public partial class TurnEvaluation
    {

        public int TurnNumber { get; set; }
        public int EvaluationDuration { get; set; }
        public int PlayerCount { get; set; }
        public Int64 ShipCount { get; set; }
        public Int64 ColonyCount { get; set; }
        public Int64 TradesCount { get; set; }

        public DateTime EvaluationDate { get; set; }

        public static System.Data.DataTable createDataTable()
        {
            var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            /*
            turnNumber int,
		    evaluationDuration int ,
		    evaluationDate datetime,
		    playerCount int ,
		    shipCount  bigint ,
		    colonyCount  bigint ,
		    tradesCount  bigint 
             * */
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "turnNumber");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "evaluationDuration");
            dataTable.AddColumn(System.Type.GetType("System.DateTime"), "evaluationDate");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "playerCount");
            dataTable.AddColumn(System.Type.GetType("System.Int64"), "shipCount");
            dataTable.AddColumn(System.Type.GetType("System.Int64"), "colonyCount");
            dataTable.AddColumn(System.Type.GetType("System.Int64"), "tradesCount");

            return dataTable;
        }

        public object createData()
        {
            var data = this;
            return new
            {
                data.TurnNumber,
                data.EvaluationDuration,
                data.EvaluationDate,

                //NAME = data.NAME.Substring(0, Math.Min(data.NAME.Length, 63)),
                //data.NAME,
                data.PlayerCount,
                data.ShipCount,
                data.ColonyCount,
                data.TradesCount
            };
        }

    }

    [XmlType(TypeName = "PlayerResearch")]
    public partial class UserResearch
    {

        private int _userid;

        private short _researchid;

        private byte _iscompleted;

        private int _investedresearchpoints;

        private short _researchpriority;

        private byte _researchable;

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public Research research;

        public UserResearch()
        {
        }
        public UserResearch(int userId , short researchid )
        {
            this.userId = userId;
            this.researchId = researchid;
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
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

        [XmlElement(ElementName = "id")]
        public short researchId
        {
            get
            {
                return this._researchid;
            }
            set
            {
                if ((this._researchid != value))
                {
                    this._researchid = value;
                }
            }
        }

        public byte researchable
        {
            get
            {
                return this._researchable;
            }
            set
            {
                if ((this._researchable != value))
                {
                    this._researchable = value;
                }
            }
        }
        
        public byte isCompleted
        {
            get
            {
                return this._iscompleted;
            }
            set
            {
                if ((this._iscompleted != value))
                {
                    this._iscompleted = value;
                }
            }
        }
        
        public int investedResearchpoints
        {
            get
            {
                return this._investedresearchpoints;
            }
            set
            {
                if ((this._investedresearchpoints != value))
                {
                    this._investedresearchpoints = value;
                }
            }
        }
     
        public short researchPriority
        {
            get
            {
                return this._researchpriority;
            }
            set
            {
                if ((this._researchpriority != value))
                {
                    this._researchpriority = value;
                }
            }
        }
    }

    
   
    
    public partial class UserStarMap : AsyncInsertable
    {

        private int _userid;

        private int _starid;

        public UserStarMap(int userid , int starid)
        {
            this._starid = starid;
            this._userid = userid;
        }

        public UserStarMap()
        {
        }

        public Task insert(System.Data.SqlClient.SqlCommand _command)
        {
            return Core.Instance.dataConnection.insertUserStarMap(this, _command);
        }

        
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
                    this._userid = value;
                }
            }
        }

        
        public int starid
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
    }

    
    public partial class UsersHistory
    {

        public int userId;
        public int turnId;

        public int researchPoints; 
		public int popVicPoints;
        public int researchVicPoints;
        public int goodsVicPoints;
        public int shipVicPoints;
        public int overallVicPoints;
        public int overallRank;

        public UsersHistory()
        {
        }

        /*
        public UsersHistory(int shipId, short goodsId, int amount)
        {
            this.shipId = shipId; this.goodsId = goodsId; this.amount = amount;
        }*/

        public static System.Data.DataTable createDataTable()
        {
            var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "userId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "turnId");

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "researchPoints");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "popVicPoints");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "researchVicPoints");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "goodsVicPoints");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "shipVicPoints");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "overallVicPoints");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "overallRank");

            return dataTable;
        }

    }

}
