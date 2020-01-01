using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Xml.Serialization;

namespace SpacegameServer.Core
{
    public partial class User : Lockable
    {
        
        private List<SpacegameServer.Core.UserQuest> _quest;        

        private int _id;

        private string _username;

        private System.Nullable<System.DateTime> _created;

        private System.Nullable<bool> _activity;

        private System.Nullable<bool> _locked;

        private byte[] _lastlogin;

        private string _user_session;

        private bool _showraster;

        private bool _moveshipsasync;

        private int _homecoordx;

        private int _homecoordy;

        private int _language;

        private System.Nullable<System.DateTime> _logindt;

        private System.Nullable<int> _lastselectedobjecttype;

        private System.Nullable<int> _lastselectedobjectid;

        private bool _showsystemnames;

        private bool _showcolonynames;

        private bool _showcoordinates;


        private bool _showshipnames;

        private bool _showshipowners;

        private bool _showcolonyowners;

        private int _researchpoints;

        private byte _scanrangebrightness;

        private double _foodRatio;    
        private double _housingRatio;
        private double _energyRatio;
        private double _assemblyRatio;
        private double _industrieRatio;
        private double _researchRatio;

        private Int64 _versionId;

        private int _popVicPoints;
        private int _researchVicPoints;
        private int _goodsVicPoints;
        private int _shipVicPoints;
        private int _overallVicPoints;
        private int _overallRank;

        private int _allianceId;

        private string _player_ip;

        private int _fogVersion;
        private string _fogString;

        private string _description;

        private int _aiId;
        private int _aiRelation;
        private int _lastReadGalactivEvent;
        private string _ProfileUrl;

        private bool _showCombatPopup;
        private bool _showCombatFast;


        private long population;

        [System.Xml.Serialization.XmlIgnore]
        public List<Ship> ships;
        [System.Xml.Serialization.XmlIgnore]
        public List<Colony> colonies;
        [System.Xml.Serialization.XmlIgnore]
        public List<UserStarMap> userStarmap;
        [System.Xml.Serialization.XmlIgnore]
        public List<Int32> knownStars;
        [System.Xml.Serialization.XmlIgnore]
        public Dictionary<int, CommNodeUser> commNodeRights;

        private List<SpacegameServer.Core.UserResearch> _userResearchs;
        

        public User() { }

        public User(int _id)
        {
            id = _id;
            ships = new List<Ship>();
            colonies = new List<Colony>();
            _userResearchs = new List<UserResearch>();           
            _quest = new List<UserQuest>();
            userStarmap = new List<UserStarMap>();
            knownStars = new List<int>();
            commNodeRights = new Dictionary<int, CommNodeUser>();

            username  = "";           
            activity = null;
            locked = null;
            user_session = null;
            showRaster = true;
            moveShipsAsync = true;
            homeCoordX    = 5000;        
            homeCoordY     = 5000;               
            language = 0;          
            logindt = DateTime.Now;
            lastSelectedObjectType = 0;
            lastSelectedObjectId = 0;

            showSystemNames = true;
            showColonyNames = true;
            showCoordinates    = true;                
            showColonyOwners  = false;    
            showShipNames       = false;  
            showShipOwners    = false; 

            researchPoints    = 0;    
            scanRangeBrightness  = 6;

            assemblyRatio = 1;
	        industrieRatio = 1;
	        foodRatio = 1;
	        versionId = 1;
                   
            popVicPoints   = 1;        
            researchVicPoints    = 1;  
            goodsVicPoints     = 1;    
            shipVicPoints     = 1;     
            overallVicPoints    = 1;
            overallRank = 1000;
            player_ip = "";
            _ProfileUrl = "images/interface/defaultprofile.png";
            _showCombatPopup = true;
            _showCombatFast = false;
        }

        public User(int id, string username , bool showraster, bool moveshipsasync,
                int homecoordx , int homecoordy , int language,
                System.Nullable<int> lastselectedobjecttype , System.Nullable<int> lastselectedobjectid,
            bool showsystemnames, bool showcolonynames , bool showcoordinates ,
             int researchpoints , byte scanrangebrightness ,
            bool showcolonyowner ,  bool showshipnames ,  bool showshipowners , bool showcolonyowners )
        {
            ships = new List<Ship>();
            colonies = new List<Colony>();
            _userResearchs = new List<UserResearch>();
            _quest = new List<UserQuest>();
            userStarmap = new List<UserStarMap>();
            knownStars = new List<int>();
            commNodeRights = new Dictionary<int, CommNodeUser>();

            this.id = id;  
            this.username = username;  
            this.showRaster = showraster;
            this.moveShipsAsync = moveshipsasync;
            this.homeCoordX = homecoordx;  
            this.homeCoordY = homecoordy;  
            this.language = language;
            this.lastSelectedObjectType = null;  
            this.lastSelectedObjectId = null;
            this.showSystemNames = showsystemnames;  
            this.showColonyNames = showcolonynames;  
            this.showCoordinates = showcoordinates;
            this.researchPoints = researchpoints; 
            this.scanRangeBrightness = scanrangebrightness; 
            this.showShipNames = showshipnames;   
            this.showShipOwners = showshipowners;
            this.showColonyOwners = showcolonyowners;
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


        public string username
        {
            get
            {
                return String.IsNullOrEmpty( this._username) ? "" : this._username;
            }
            set
            {
                if ((this._username != value))
                {
                    this._username = value;
                }
            }
        }

        [System.Xml.Serialization.XmlIgnore]
        public System.Nullable<System.DateTime> created
        {
            get
            {
                return this._created;
            }
            set
            {
                if ((this._created != value))
                {
                    this._created = value;
                }
            }
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public System.Nullable<bool> activity
        {
            get
            {
                return this._activity;
            }
            set
            {
                if ((this._activity != value))
                {
                    this._activity = value;
                }
            }
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public System.Nullable<bool> locked
        {
            get
            {
                return this._locked;
            }
            set
            {
                if ((this._locked != value))
                {
                    this._locked = value;
                }
            }
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public byte[] lastlogin
        {
            get
            {
                return this._lastlogin;
            }
            set
            {
                if ((this._lastlogin != value))
                {
                    this._lastlogin = value;
                }
            }
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public string user_session
        {
            get
            {
                return this._user_session;
            }
            set
            {
                if ((this._user_session != value))
                {
                    this._user_session = value;
                }
            }
        }


        public bool showRaster
        {
            get
            {
                return this._showraster;
            }
            set
            {
                if ((this._showraster != value))
                {
                    this._showraster = value;
                }
            }
        }


        public bool moveShipsAsync
        {
            get
            {
                return this._moveshipsasync;
            }
            set
            {
                if ((this._moveshipsasync != value))
                {
                    this._moveshipsasync = value;
                }
            }
        }


        public int homeCoordX
        {
            get
            {
                return this._homecoordx;
            }
            set
            {
                if ((this._homecoordx != value))
                {
                    this._homecoordx = value;
                }
            }
        }


        public int homeCoordY
        {
            get
            {
                return this._homecoordy;
            }
            set
            {
                if ((this._homecoordy != value))
                {
                    this._homecoordy = value;
                }
            }
        }


        public int language
        {
            get
            {
                return this._language;
            }
            set
            {
                if ((this._language != value))
                {
                    this._language = value;
                }
            }
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public System.Nullable<System.DateTime> logindt
        {
            get
            {
                return this._logindt;
            }
            set
            {
                if ((this._logindt != value))
                {
                    this._logindt = value;
                }
            }
        }


        public System.Nullable<int> lastSelectedObjectType
        {
            get
            {
                return this._lastselectedobjecttype;
            }
            set
            {
                if ((this._lastselectedobjecttype != value))
                {
                    this._lastselectedobjecttype = value;
                }
            }
        }


        public System.Nullable<int> lastSelectedObjectId
        {
            get
            {
                return this._lastselectedobjectid;
            }
            set
            {
                if ((this._lastselectedobjectid != value))
                {
                    this._lastselectedobjectid = value;
                }
            }
        }


        public bool showSystemNames
        {
            get
            {
                return this._showsystemnames;
            }
            set
            {
                if ((this._showsystemnames != value))
                {
                    this._showsystemnames = value;
                }
            }
        }


        public bool showColonyNames
        {
            get
            {
                return this._showcolonynames;
            }
            set
            {
                if ((this._showcolonynames != value))
                {
                    this._showcolonynames = value;
                }
            }
        }


        public bool showCoordinates
        {
            get
            {
                return this._showcoordinates;
            }
            set
            {
                if ((this._showcoordinates != value))
                {
                    this._showcoordinates = value;
                }
            }
        }


        public int researchPoints
        {
            get
            {
                return this._researchpoints;
            }
            set
            {
                if ((this._researchpoints != value))
                {
                    this._researchpoints = value;
                }
            }
        }


        public byte scanRangeBrightness
        {
            get
            {
                return this._scanrangebrightness;
            }
            set
            {
                if ((this._scanrangebrightness != value))
                {
                    this._scanrangebrightness = value;
                }
            }
        }


        public bool showShipNames
        {
            get
            {
                return this._showshipnames;
            }
            set
            {
                if ((this._showshipnames != value))
                {
                    this._showshipnames = value;
                }
            }
        }


        public bool showShipOwners
        {
            get
            {
                return this._showshipowners;
            }
            set
            {
                if ((this._showshipowners != value))
                {
                    this._showshipowners = value;
                }
            }
        }


        public bool showColonyOwners
        {
            get
            {
                return this._showcolonyowners;
            }
            set
            {
                if ((this._showcolonyowners != value))
                {
                    this._showcolonyowners = value;
                }
            }
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



        public double foodRatio
        {
            get
            {
                return this._foodRatio;
            }
            set
            {
                if ((this._foodRatio != value))
                {
                    this._foodRatio = value;
                }
            }
        }
        public double housingRatio
        {
            get
            {
                return this._housingRatio;
            }
            set
            {
                if ((this._housingRatio != value))
                {
                    this._housingRatio = value;
                }
            }
        }
             
        public double energyRatio
        {
            get
            {
                return this._energyRatio;
            }
            set
            {
                if ((this._energyRatio != value))
                {
                    this._energyRatio = value;
                }
            }
        }
        
        public double assemblyRatio
        {
            get
            {
                return this._assemblyRatio;
            }
            set
            {
                if ((this._assemblyRatio != value))
                {
                    this._assemblyRatio = value;
                }
            }
        }

        public double industrieRatio
        {
            get
            {
                return this._industrieRatio;
            }
            set
            {
                if ((this._industrieRatio != value))
                {
                    this._industrieRatio = value;
                }
            }
        }

        public double researchRatio
        {
            get
            {
                return this._researchRatio;
            }
            set
            {
                if ((this._researchRatio != value))
                {
                    this._researchRatio = value;
                }
            }
        }


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

        //
        public int popVicPoints
        {
            get
            {
                return _popVicPoints;
            }
            set
            {
                if ((_popVicPoints != value))
                {
                    this._popVicPoints = value;
                }
            }
        }

        public int researchVicPoints
        {
            get
            {
                return _researchVicPoints;
            }
            set
            {
                if ((_researchVicPoints != value))
                {
                    this._researchVicPoints = value;
                }
            }
        }

        public int goodsVicPoints
        {
            get
            {
                return _goodsVicPoints;
            }
            set
            {
                if ((_goodsVicPoints != value))
                {
                    this._goodsVicPoints = value;
                }
            }
        }

        public int shipVicPoints
        {
            get
            {
                return _shipVicPoints;
            }
            set
            {
                if ((_shipVicPoints != value))
                {
                    this._shipVicPoints = value;
                }
            }
        }

        public int overallVicPoints
        {
            get
            {
                return _overallVicPoints;
            }
            set
            {
                if ((_overallVicPoints != value))
                {
                    this._overallVicPoints = value;
                }
            }
        }

        public int overallRank
        {
            get
            {
                return _overallRank;
            }
            set
            {
                if ((_overallRank != value))
                {
                    this._overallRank = value;
                }
            }
        }

        [System.Xml.Serialization.XmlIgnore]
        public string player_ip
        {
            get
            {
                return _player_ip;
            }
            set
            {
                if ((_player_ip != value))
                {
                    this._player_ip = value;
                }
            }
        }

       
        public int fogVersion
        {
            get
            {
                return _fogVersion;
            }
            set
            {
                if ((_fogVersion != value))
                {
                    this._fogVersion = value;
                }
            }
        }


        [System.Xml.Serialization.XmlIgnore]
        public string fogString
        {
            get
            {
                return _fogString;
            }
            set
            {
                if ((_fogString != value))
                {
                    this._fogString = value;
                }
            }
        }

        public int allianceId
        {
            get
            {
                return _allianceId;
            }
            set
            {
                if ((_allianceId != value))
                {
                    this._allianceId = value;
                }
            }
        }        

        [XmlElement(ElementName = "PlayerResearches")]
        public List<SpacegameServer.Core.UserResearch> PlayerResearch
        {
            get
            {
                return this._userResearchs;
            }
        }

        public List<SpacegameServer.Core.UserResearch> getPlayerResearch()
        {
            List<SpacegameServer.Core.UserResearch> researches = new List<UserResearch>();

            foreach (var research in Core.Instance.Researchs.Where(e=>e != null))
            {
                UserResearch existingData = null;
                if (PlayerResearch.Any(pr => pr.researchId == research.id))
                    existingData = PlayerResearch.First(pr => pr.researchId == research.id);

                UserResearch userResearch = new UserResearch();
                userResearch.researchId = research.id;
                userResearch.userId = this.id;
                //take data from existingData if possible
                userResearch.researchable = existingData != null ? existingData.researchable :
                    (this.canResearch(research) ? (byte)1 : (byte)0);
                userResearch.isCompleted =
                    existingData != null ? existingData.isCompleted : (byte)0;
                userResearch.investedResearchpoints =
                    existingData != null ? existingData.investedResearchpoints : 0;
                userResearch.researchPriority =
                     existingData != null ? existingData.researchPriority : (short)0;

                researches.Add(userResearch);
            }

            return researches;
        }


        [System.Xml.Serialization.XmlIgnore]
        public List<SpacegameServer.Core.UserQuest> quests
        {
            get
            {
                return this._quest;
            }
        }

        public string languageShortName
        {
            get
            {
                return Core.Instance.languages[this.language].languageShortName;
            }
            set
            {                
            }
        }
        public string Description
        {
            get
            {
                return _description ?? "";
            }
            set
            {
                if ((_description != value))
                {
                    this._description = value;
                }
            }
        }


        public int AiId
        {
            get
            {
                return _aiId;
            }
            set
            {
                if ((_aiId != value))
                {
                    this._aiId = value;
                }
            }
        }


        public int AiRelation
        {
            get
            {
                return _aiRelation;
            }
            set
            {
                if ((_aiRelation != value))
                {
                    this._aiRelation = value;
                }
            }
        }

        public int LastReadGalactivEvent
        {
            get
            {
                return _lastReadGalactivEvent;
            }
            set
            {
                if ((_lastReadGalactivEvent != value))
                {
                    this._lastReadGalactivEvent = value;
                }
            }
        }

        //ProfileUrl
        public string ProfileUrl
        {
            get
            {
                return _ProfileUrl;
            }
            set
            {
                if ((_ProfileUrl != value))
                {
                    this._ProfileUrl = value;
                }
            }
        }

        public bool showCombatPopup
        {
            get
            {
                return _showCombatPopup;
            }
            set
            {
                if ((_showCombatPopup != value))
                {
                    this._showCombatPopup = value;
                }
            }
        }

        public bool showCombatFast
        {
            get
            {
                return _showCombatFast;
            }
            set
            {
                if ((_showCombatFast != value))
                {
                    this._showCombatFast = value;
                }
            }
        }
        
        public long Population
        {
            get
            {
                return population;
            }
            set
            {
                if ((population != value))
                {
                    this.population = value;
                }
            }
        }

        
    }

}
