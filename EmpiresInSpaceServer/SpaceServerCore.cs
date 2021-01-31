using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{

    public struct IdentityLocks {
        public IdentityNumbers shipLock;
        public IdentityNumbers templateLock;
        public IdentityNumbers colonyId;
        public IdentityNumbers colonyBuildingId;
        public IdentityNumbers planetSurfaceId;
        public IdentityNumbers allianceId;
        public IdentityNumbers commNode;
        public IdentityNumbers commNodeMessage;
        public IdentityNumbers message;
        public IdentityNumbers combat;
        public IdentityNumbers galacticEvents;
        public IdentityNumbers trades;
        public IdentityNumbers routes;
        public IdentityNumbers chat;
    }

    public sealed partial class Core : Lockable
    {
        private static Core _instance = null;
        private System.Timers.Timer stateTimer;  //Timer for the turn evaluation
        private static readonly object padlock = new object(); //needed when creating the first instance of the singleton        
        public DataConnector dataConnection; //default connects to sql, might be replaced by a mocked dataconnector
        public IdentityLocks identities;

        //Delegate instances. The caller will provide appropriate methods
        public SpacegameServer.Core.sendEventDelegate SendEvent;
        public SpacegameServer.Core.CommunicationGroupsInitDelegate CommunicationGroupsInit;
        public SpacegameServer.Core.CommunicationGroupsRemoveUserDelegate CommunicationGroupsRemoveUser;
        public SpacegameServer.Core.turnEvaluationStart TurnEvaluationStart;
        public SpacegameServer.Core.turnEvaluationEnd TurnEvaluationEnd;
        public SpacegameServer.Core.RefreshShip RefreshShip;
        public SpacegameServer.Core.SendShip SendShip;
        public SpacegameServer.Core.SendCommMessage SendCommMessage;
        public SpacegameServer.Core.SendMessage SendMessage;
        public SpacegameServer.Core.SendCombat SendCombat;
        public SpacegameServer.Core.SendNewTradeDelegate SendNewTrade;
        public SpacegameServer.Core.DeleteTradeDelegate DeleteTrade;

        #region gameData

        public GalaxyMap GalaxyMap;

        public  Dictionary<int, ObjectDescription> ObjectDescriptions { get; set; }  //just graphics

        public Dictionary<short, ObjectOnMap> ObjectsOnMap { get; set; }  //additional informations per ObjectDescription

        public Dictionary<short, Dictionary<short, ObjectWeaponModificator>> ObjectWeaponModificators { get; set; }  //additional informations per ObjectDescription
 
        public Module[] Modules { get; set; }
        
        //public List<ModulesGain> ModulesGain { get; set; }        

        //public List<ModulesCost> ModulesCosts { get; set; }

        public List<ResearchQuestPrerequisite> ResearchQuestPrerequisites { get; set; }                

        public ShipHull[] ShipHulls { get; set; }

        public List<ShipHullsImage> ShipHullsImages { get; set; }

        public Good[] Goods { get; set; }
        public Building[] Buildings { get; set; }
    
        public List<PlanetType> PlanetTypes { get; set; }

        //public Hashtable BuildingProductions { get; set; }
        //public Hashtable BuildingCosts { get; set; }

        public Quest[] Quests { get; set; }

        public Research[] Researchs { get; set; }

        public List<SpecializationGroup> SpecializationGroups { get; set; }

        public List<ResearchGain> ResearchGains;
        //public Hashtable ResearchGain { get; set; }

        public SurfaceTile[] SurfaceTiles { get; set; }

        //Todo
        public List<BuildOption> BuildOptions { get; set; }

        public SurfaceImage[] SurfaceImages { get; set; }

        public List<ResearchQuestPrerequisite> objectRelations { get; set; }

        public List<SurfaceDefaultMap> surfaceDefaultMaps { get; set; }

        public Language[] languages { get; set; }

        public List<TurnEvaluation> TurnEvaluations { get; set; }

        #endregion gameData

        #region map data
        public Dictionary<int, SystemMap> stars { get; set; }
        //public Dictionary<Int32,StarMap> stars { get; set; }
        //public Dictionary<Int32, SolarSystemInstance> planets { get; set; }
        public Dictionary<int, SolarSystemInstance> planets { get; set; }


        public Dictionary<long, PlanetSurface>  planetSurface { get; set; }

        public NodeQuadTree.NodeQuadTree nodeQuadTree;

        #endregion

        #region user data
        //public Hashtable users { get; set; }
        public ConcurrentDictionary<int, User> users { get; set; }
        //public Hashtable ships { get; set; }

        

        public ConcurrentDictionary<int, ShipTemplate> shipTemplate;
        public ConcurrentDictionary<int, Ship> ships { get; set; }

        public ConcurrentDictionary<int, Colony> colonies { get; set; }
        
        public ConcurrentDictionary<int, ColonyBuilding> colonyBuildings { get; set; }

        public ConcurrentDictionary<int, Alliance> alliances { get; set; }
        //public List<UserStarMap> userStarmap { get; set; }

        //lock the alliance before changing the List
        public ConcurrentDictionary<int, List<int>> invitesPerAlliance { get; set; }
        
        //lock the User before changing the List
        public ConcurrentDictionary<int, List<int>> invitesPerUser { get; set; }

        public UserRelations userRelations;
        

        public List<SpacegameServer.Core.SystemMap> knownUser;
        public List<SpacegameServer.Core.SystemMap> knownAlliancesXmls;
        public List<SpacegameServer.Core.SystemMap> knownNode;
        public List<SpacegameServer.Core.SystemMap> knownBuilding;
        public List<SpacegameServer.Core.SystemMap> ShipHullXMLs;
       
        public List<SpacegameServer.Core.SystemMap> knownModule;
     
        public ConcurrentDictionary<int, TradeOffer> tradeOffer { get; set; }

        public ConcurrentDictionary<int, Route> routes { get; set; }

        public List<SpacegameServer.Core.Label> labels;
        public List<shipRefit> shipRefits;

        public ConcurrentDictionary<int, CommunicationNode> commNodes { get; set; }

        public ConcurrentDictionary<int, MessageHead> messages { get; set; }

        public ConcurrentDictionary<int, Combat> combats { get; set; }

        public ConcurrentDictionary<int, SpacegameServer.Core.GalacticEvents> galactivEvents { get; set; }

        public ConcurrentDictionary<int, ChatLog> chatLog { get; set; }
        #endregion

        //public SpaceGame.Game Socket;


        private Core(bool loadData = true, DataConnector connector = null) {
            if (connector == null)
                dataConnection = new SpacegameServer.DataConnectors.SqlConnector();
            else
                dataConnection = connector;

            writeToLog("Starting");

            InfluenceManager.InitInfluenceRings();

            identities.shipLock = new IdentityNumbers();
            identities.templateLock = new IdentityNumbers();
            identities.colonyId = new IdentityNumbers();
            identities.colonyBuildingId = new IdentityNumbers();
            identities.planetSurfaceId = new IdentityNumbers();
            identities.allianceId = new IdentityNumbers();
            identities.commNode = new IdentityNumbers();
            identities.commNodeMessage = new IdentityNumbers();
            identities.message = new IdentityNumbers();
            identities.combat       = new IdentityNumbers();
            identities.galacticEvents = new IdentityNumbers();
            identities.trades = new IdentityNumbers();
            identities.routes = new IdentityNumbers();
            identities.chat = new IdentityNumbers();

            //fill the regions array with (yet empty) regions
            //ToDo: this leads to a maximum siz of the world. Units should not leave the area...
            GeometryIndex.createIndex();
            
            

            //RULES
            //int ObjectDescriptionsSize = 20000;

            int GoodsSize = 10000;
            int BuildingsSize = 10000;
            int ModuleSize = 5000;
            int SurfaceImagesSize = 50; //TODO            
            int ShipHullsSize = 230;
            //int ShipHullsImagesSize = 100;
            int QuestSize = 1000;
            int ResearchsSize = 10000;

            //int SpecializationGroupSize = 10;

            int ResearchQuestPrerequisitesSize = 500;
            int SurfaceTilesSize = 30;

            int languageSize = 8;

            //MAP
            //int StarMapSize = 100000;
            //int SolarSystemInstanceSize = 1000000;
            //int PlanetSurfaceSize = 1000000;
            

            //USERS
            //int UserSize = 1000;
            //int ShipTemplateSize = UserSize * 1000;
            //int ShipSize = UserSize * 100;
            //int ColonySize = UserSize * 10;
            //int ColonyBuildingSize = ColonySize * 100;
            NodeQuadTree.BoundarySouthWest boundarySouthWest = new NodeQuadTree.BoundarySouthWest(4096,4096);
            NodeQuadTree.Bounding NodeQuadTreeBounding = new NodeQuadTree.Bounding(boundarySouthWest, 2048);
            nodeQuadTree = new NodeQuadTree.NodeQuadTree(NodeQuadTreeBounding);

            //RULES
            ObjectDescriptions = new Dictionary<int, ObjectDescription>(); //[ObjectDescriptionsSize];
            ObjectsOnMap = new Dictionary<short, ObjectOnMap>();
            ObjectWeaponModificators = new Dictionary<short, Dictionary<short, ObjectWeaponModificator>>();

            Goods = new Good[GoodsSize];
            Buildings = new Building[BuildingsSize];
            PlanetTypes = new List<PlanetType>(10);
            Modules = new Module[ModuleSize];            
            ShipHulls = new ShipHull[ShipHullsSize];
            ShipHullsImages = new List<ShipHullsImage>();
            Quests = new Quest[QuestSize];
            Researchs = new Research[ResearchsSize];
            ResearchGains = new List<ResearchGain>();

            SpecializationGroups = new List<SpecializationGroup>();

            ResearchQuestPrerequisites = new List<ResearchQuestPrerequisite>(ResearchQuestPrerequisitesSize);
            SurfaceImages = new SurfaceImage[SurfaceImagesSize];
            SurfaceTiles = new SurfaceTile[SurfaceTilesSize];
            BuildOptions = new List<BuildOption>();
            objectRelations = new List<ResearchQuestPrerequisite>(1000);
            surfaceDefaultMaps = new List<SurfaceDefaultMap>(3000);

            TurnEvaluations = new List<TurnEvaluation>(1000);

            languages = new Language[languageSize];
            //SurfaceImages = new SurfaceImages
            //MAP
            stars = new Dictionary<int, SystemMap>();// StarMap[StarMapSize];
            planets = new Dictionary<int, SolarSystemInstance>();//[SolarSystemInstanceSize];
            planetSurface = new Dictionary<long, PlanetSurface>();// [PlanetSurfaceSize];
            
            //USERS
            users = new ConcurrentDictionary<int, User>();// [UserSize];            

            shipTemplate = new ConcurrentDictionary<int, ShipTemplate>(); // ShipTemplate[ShipTemplateSize];
            ships = new ConcurrentDictionary<int, Ship>(); //Ship[ShipSize];
            colonies = new ConcurrentDictionary<int, Colony>(); //Colony[ColonySize];
            colonyBuildings = new ConcurrentDictionary<int, ColonyBuilding>(); //ColonyBuilding[ColonyBuildingSize];

            alliances = new ConcurrentDictionary<int, Alliance>();
            invitesPerAlliance = new ConcurrentDictionary<int, List<int>>();
            invitesPerUser = new ConcurrentDictionary<int, List<int>>();

            tradeOffer = new ConcurrentDictionary<int, TradeOffer>();
            routes = new ConcurrentDictionary<int, Route>();
            chatLog = new ConcurrentDictionary<int, ChatLog>();

            userRelations = new UserRelations();

            labels = new List<Label>();
            shipRefits = new List<shipRefit>();

            commNodes = new ConcurrentDictionary<int, CommunicationNode>();
            messages = new ConcurrentDictionary<int, MessageHead>();
            combats = new ConcurrentDictionary<int, Combat>();
            galactivEvents = new ConcurrentDictionary<int, GalacticEvents>();

            //read all data
            if (loadData)
            {
                dataConnection.loadData(this);
            }

            /*
            (new TurnSummary(this)).researchSpread(this); //Todo - remove, save to db after turn summary, restore from db when getAll(_core); is called         
            (new TurnSummary(this)).CalcGalaxyOwnership();


            //update data in all ships
            foreach (var ship in this.ships.Values)
            {
                var clone = ship.clone();
                SpacegameServer.Core.StatisticsCalculator.calc(clone, this);
                ship.CombatMaxHitpoint = clone.hitpoints;
                ship.CombatStartHitpoint = ship.hitpoints;
            }


            //TODO
            if (identities.shipLock.id == -1) identities.shipLock.id = 1000; //ToDo: F***ing ugly stupid and not even really functioning workaround, :ToDo : 1000 is a really bad workaround, because ships and colonies will sometimes (for example during trading) be stored in the same array as spaceobjects...


            createTurnTimer();
           */
        }

        private void PostConstructor()
        {

            this.GalaxyMap.TurnNumber = this.TurnEvaluations.Count > 0 ?  this.TurnEvaluations.Max(e => e.TurnNumber) : 1;

            (new TurnSummary(this)).researchSpread(this); //Todo - remove, save to db after turn summary, restore from db when getAll(_core); is called         
            (new TurnSummary(this)).CalcGalaxyOwnership();
            (new TurnSummary(this)).RepairAlliances();

            (new TurnSummary(this)).userRanks2();
            

            TradeWorker.AssignAllUsers();

            //update data in all ships
            foreach (var ship in this.ships.Values)
            {
                var clone = ship.clone();
                SpacegameServer.Core.StatisticsCalculator.calc(clone, this);
                ship.CombatMaxHitpoint = clone.hitpoints;
                ship.CombatStartHitpoint = ship.hitpoints;
            }

            //update colony cargo space
            foreach (var colony in this.colonies.Values)
            {
                colony.CalcStorage();
            }
            

            User.RemoveInactives();

            TradeWorker.ConnectTradeWithShips();


            //TODO: should have written why a workaround was needed :(
            //ToDo: Find out qhy this was implemented
            if (identities.shipLock.id == -1) identities.shipLock.id = 1000; //ToDo:  ugly workaround, :ToDo : 1000 is a really bad workaround, because ships and colonies will sometimes (for example during trading) be stored in the same array as spaceobjects...


            createTurnTimer();
        }

        private static Core Construct(bool loadData = true, DataConnector connector = null)
        {
            _instance = new Core(loadData, connector);
            _instance.PostConstructor();
            return _instance;
        }

        public static Core Instance
        {
            get
            {
                if (_instance != null) return _instance;

                lock (padlock)
                {
                    if (_instance == null)
                    {
                        //_instance = new Core();
                        _instance = Construct();
                    }
                    return _instance;
                }
            }
        }

        public static Core setTestInstance(DataConnector connector)
        {
            lock (padlock)
            {
                if (_instance == null)
                {
                    //_instance = new Core(true, connector);
                    _instance = Construct(true, connector);
                    //_instance.SendEvent = new sendEventDelegate()
                }
                return _instance;
            }            
        }
        public static Core InitTestInstance
        {
            get
            {
                lock (padlock)
                {
                    if (_instance == null)
                    {
                        //_instance = new Core(false);
                        _instance = Construct(false);
                    }
                    return _instance;
                }
            }
        }

        public static bool Instanciated()
        {
            return _instance != null;
        }
        
        /*
        public static Core testCreateCore()
        {
            return new Core(false);
        }
        */
        public static void addDataTableColumn(System.Data.DataTable dataTable, Type dataType, string columnName)
        {
            System.Data.DataColumn column;
            column = new System.Data.DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "id";
            dataTable.Columns.Add(column);
        }

        public static DateTime nextTurnDateTime(DateTime now)
        {
            string offsetS = System.Configuration.ConfigurationManager.AppSettings["timezoneoffset"];
            int offset = 0;
            if (!Int32.TryParse(offsetS, out offset)) offset = 0;
            

            string startingDatetimeStr = System.Configuration.ConfigurationManager.AppSettings["startingDatetime"];
            DateTime startingDatetime;
            DateTime.TryParse(startingDatetimeStr, out startingDatetime);
            DateTime returnValue;

            //get minutes between turn summary from config, or set it to 4 hours
            string minutesS = System.Configuration.ConfigurationManager.AppSettings["turnMinutes"];
            int minutes = 0;
            if (!Int32.TryParse(minutesS, out minutes)) minutes = 240;
    
            //if turn evaluation is hourly, start on the next full hour, else according to minutes:
            if (minutes % 60 == 0)
            {
                int hours = minutes / 60;
                int modHours = now.Hour % hours;
                int hoursUntilnextTurn = hours - modHours;
                if (hoursUntilnextTurn == 0) hoursUntilnextTurn = modHours;

                returnValue = new DateTime(now.Year, now.Month, now.Day, now.Hour, 0, 0).AddHours(hoursUntilnextTurn);
                return returnValue < startingDatetime ? startingDatetime : returnValue;                            
            }

            // not hourly, but also not per minute (for example every 5 minutes). 
            if (minutes > 1)
            {
                int minutesInThisInterval = now.Minute % minutes;
                int minutesUntilnextInterval = minutes - minutesInThisInterval;
                if (minutesUntilnextInterval == 0) minutesUntilnextInterval = minutes;

                returnValue = (new DateTime(now.Year, now.Month, now.Day, now.Hour, now.Minute, 0)).AddMinutes(minutesUntilnextInterval);
                return returnValue < startingDatetime ? startingDatetime : returnValue;                           
            }

            //just start in 2 minutes to give startup some time to finish
            returnValue = (new DateTime(now.Year, now.Month, now.Day, now.Hour, now.Minute, 0)).AddMinutes(2);
            return returnValue < startingDatetime ? startingDatetime : returnValue;                       
        }
        

        private void createTurnTimer()
        {
            // Create an event to signal the timeout count threshold in the 
            // timer callback.
            //AutoResetEvent autoEvent = new AutoResetEvent(false);
           

            // Create an inferred delegate that invokes methods for the timer.
            //TimerCallback tcb = turnEvaluation;

            // Create a timer 
            
            //Timer stateTimer = new Timer(tcb, null, startingInSeconds * 1000, 60 * 1000);
            stateTimer = new System.Timers.Timer();
            /*
            int startingInSeconds = 60 - DateTime.Now.Second; // Gets seconds to next minute
            int startingMinutes = 60 - DateTime.Now.Minute; // Gets seconds to next minute
            int startingHours = 3 - (DateTime.Now.Hour  % 4 ); // Gets hours to next 4-hour -point in time
            startingInSeconds = startingInSeconds + startingMinutes * 60 + startingHours * 3600;
            */
            //startingInSeconds = 10;
            var now = DateTime.Now;
            double startingInSeconds = (nextTurnDateTime(now) - now).TotalSeconds;

            writeToLog(" turnEvaluation starting in  " + ((nextTurnDateTime(now) - now).TotalMinutes).ToString() + " minutes");
            stateTimer.Interval = Math.Min(startingInSeconds * 1000,  Int32.MaxValue);
            stateTimer.Elapsed += new System.Timers.ElapsedEventHandler(turnEvaluation);
            stateTimer.AutoReset = false;
            stateTimer.Start();

            // , null, startingInSeconds * 1000, 60 * 1000);
        }
        private void turnEvaluation(object sender, System.Timers.ElapsedEventArgs e)
        {
            if (this.GalaxyMap.gameState != 2) return;
         
           

            string minutesS = System.Configuration.ConfigurationManager.AppSettings["turnMinutes"];
            int minutes = 0;
            if (!Int32.TryParse(minutesS, out minutes)) minutes = 240;

            stateTimer.Interval = minutes * 60 * 1000;
            //stateTimer.Interval = 10 * 1000;

            stateTimer.Start();

            writeToLog(" turnEvaluation start ");
            SpacegameServer.Core.TurnSummary ts = new SpacegameServer.Core.TurnSummary(this);
            ts.calc(null);


            writeToLog(" turnEvaluation end ");
        }

        public void writeToLog(string logMessage)
        {
            string strLogMessage = string.Empty;
            strLogMessage = string.Format("{0}: {1}", DateTime.Now.ToString("o"), logMessage);

            //writeToLogFile(logMessage);
            dataConnection.saveLog(logMessage);
        }

        public static void writeToLogFile(string strLogMessage)
        {
            
            string strLogFile = System.Configuration.ConfigurationManager.AppSettings["logFilePath"].ToString();
           
            //strLogFile = Server.MapPath("~/from_here_on.txt")
            //Server.MapPath("~/from_here_on")

            System.IO.StreamWriter swLog;

            

            if (!System.IO.File.Exists(strLogFile))
            {
                swLog = new System.IO.StreamWriter(strLogFile);
            }
            else
            {
                swLog = System.IO.File.AppendText(strLogFile);
            }

            swLog.WriteLine(strLogMessage);
            swLog.WriteLine();

            swLog.Close();

        }

        public void writeExceptionToLog(Exception ex)
        {
            string message = ("Message :" + ex.Message + "<br/>" + Environment.NewLine + "StackTrace :" + ex.StackTrace +
           "" + Environment.NewLine + "Date :" + DateTime.Now.ToString());
            message += (Environment.NewLine + "-----------------------------------------------------------------------------" + Environment.NewLine);
         


            if (ex.InnerException != null)
            {
                message += ex.InnerException.Message + Environment.NewLine + "<br/>" + ex.InnerException.StackTrace;
            }
            //if (Core.Instanciated())
            writeToLog(message);
        }

        /// <summary>
        /// Called from inside the turnSummary via a check of the transcendence constructs...
        /// </summary>
        /// <param name="transcendenceId"></param>
        public void finishGame(int transcendenceId)
        {

            //lock everything (as in turn evaluation)

            //set state
            this.GalaxyMap.gameState = 3;
            this.GalaxyMap.winningTranscendenceConstruct = transcendenceId;
            
            /*
            //remove all movement points
            if (!Ship.setLockAll())
            {
                Core.Instance.writeToLog("FinishGame : Ship setLockAll() failed! ");
                return;
            }

            if (!Colony.setLockAll())
            {
                Ship.removeLockAll();
                Core.Instance.writeToLog("FinishGame : Ship setLockAll() failed! ");
                return;
            }

            if (!User.setLockAll())
            {
                Colony.removeLockAll();
                Ship.removeLockAll();
                Core.Instance.writeToLog("FinishGame : Ship setLockAll() failed! ");
                return;
            }


            System.Threading.Thread.Sleep(1000);
            */

            try
            {

                //Reset ships
                foreach (var ship in Core.Instance.ships)
                {
                    ship.Value.versionId++;
                    ship.Value.hyper = 0;
                    ship.Value.impuls = 0;
                }
                /*
                //save Ships
                Core.Instance.dataConnection.saveShips();
                List<AsyncSaveable> elementsToSave = new List<AsyncSaveable>();
                elementsToSave.Add(this.GalaxyMap);

                this.dataConnection.saveAsync(elementsToSave);
                */
                //ToDO: Reset COlonies:

                //ToDO; Save COlonies

                //Recalc user rank
                TurnSummary calcRank = new TurnSummary(Core.Instance);
                calcRank.userRanks2();

                //save Users
                //Core.Instance.dataConnection.saveUser(null);

                //ToDo: create event

            }
            finally
            {
                /*
                Ship.removeLockAll();
                Colony.removeLockAll();
                User.removeLockAll();
                */
            }
        }

       
        public void getUserScans(int _userId, Ship _ship, ref List<Ship> _ships, ref List<SpacegameServer.Core.SystemMap> _stars, ref List<SpacegameServer.Core.Colony> _colonies, Colony scanningColony = null)
        {
            if (_userId < 0) return;
            SpacegameServer.Core.User user = (SpacegameServer.Core.User)users[_userId];
            if (user == null) return;


            //during startup, add all colonies of stars known to the user
            if (_ship == null && scanningColony == null)
            {
                _colonies = Core.Instance.stars.Where(star => user.knownStars.Any(known => known == star.Value.id))
                        .SelectMany(star => star.Value.planets)
                        .Where(planet => planet.colony != null)
                        .Select(planet => planet.colony).ToList();
                /*foreach (int starId in user.knownStars)
                {
                    if (Core.Instance.stars[starId].planets.Any(planet => planet.colony != null))
                    {
                        _colonies = Core.Instance.stars[starId].planets.Where(planet => planet.colony != null).Select(planet => planet.colony).ToList();
                    }
                }
                */
            }


            //make a list with unique fields, only the scanner with the greates scanrange is needed
            Dictionary<Int32, KeyValuePair<Field, byte>> fieldScans = new Dictionary<int, KeyValuePair<Field, byte>>();

            if (_ship != null || scanningColony != null)
            {
                if (_ship != null)
                    fieldScans[_ship.field.id] = new KeyValuePair<Field, byte>(_ship.field, _ship.scanRange);

                if (scanningColony != null)
                    fieldScans[scanningColony.field.id] = new KeyValuePair<Field, byte>(scanningColony.field, scanningColony.scanRange);
            }
            else
            {
                for (int i = 0; i < user.ships.Count; i++)
                {
                    Ship currentShip = user.ships[i];
                    KeyValuePair<Field, byte> val;
                    if (fieldScans.TryGetValue(user.ships[i].field.id, out val))
                    {
                        if (val.Value < currentShip.scanRange) fieldScans[currentShip.field.id] = new KeyValuePair<Field, byte>(currentShip.field, currentShip.scanRange);
                    }
                    else
                        fieldScans[currentShip.field.id] = new KeyValuePair<Field, byte>(currentShip.field, currentShip.scanRange);
                }

                for (int i = 0; i < user.colonies.Count; i++)
                {
                    Colony currentColony = user.colonies[i];
                    KeyValuePair<Field, byte> val;

                    if (fieldScans.TryGetValue(currentColony.field.id, out val))
                    {
                        if (val.Value < currentColony.scanRange) fieldScans[currentColony.field.id] = new KeyValuePair<Field, byte>(currentColony.field, currentColony.scanRange);
                    }
                    else
                        fieldScans[currentColony.field.id] = new KeyValuePair<Field, byte>(currentColony.field, currentColony.scanRange);
                }
            }
            //find all neighbouring fields of the scanners
            //use the regions to accomplish this            
            List<int> scannedFields = new List<int>();
            foreach (KeyValuePair<Int32, KeyValuePair<Field, byte>> scanner in fieldScans)
            {
                scanner.Value.Key.getScanRange(scanner.Value.Value, scannedFields);                  
            }
              
            //detect all ships, stars and colonies on the fields scanned
            foreach (int fieldId in (scannedFields.Distinct()))
            {
                Field currentField = ((Field)GeometryIndex.allFields[fieldId]);
                foreach (Ship ship in currentField.ships)
                    _ships.Add(ship);

                _ships = _ships.OrderBy(o => o.id).ToList();

                if (currentField.starId != null)
                {
                    int starId = (int)currentField.starId;
                    SystemMap star = stars[starId];
                    _stars.Add(star);

                    foreach (Colony colony in currentField.colonies)
                    {
                        if (!_colonies.Any(c => c == colony))
                            _colonies.Add(colony);
                    }

                    //if scan is determined for a single ship, check if that user already kwos the systems scanned:
                    if ((_ship != null) && !user.knownStars.Contains(starId))
                    {
                        user.knownStars.Add(starId);
                        UserStarMap newStar = new UserStarMap(user.id, starId);

                        List<AsyncInsertable> newKnownStar = new List<AsyncInsertable>();
                        newKnownStar.Add(newStar);
                        
                        dataConnection.insertAsyncTransaction(newKnownStar);
                    }
                }
            }


            //add usermap and transcensionStars to the list of known stars:
            if (_ship == null && scanningColony == null)
            {
                foreach (int starId in user.knownStars)
                {
                    if (!_stars.Exists(x => x.id == starId))
                    {
                        _stars.Add(this.stars[starId]);
                    }
                }
                
                List<Ship> transcensions =
                (from ship in this.ships
                 where ship.Value.shipTranscension != null
                 select ship.Value).ToList();
                foreach (Ship transc in transcensions)
                {
                    if (transc.systemId == 0) continue;
                    if (!_stars.Exists(x => x.id == transc.systemId))
                    {
                        _stars.Add(this.stars[transc.systemId]);
                    }
                }

                

            }

            return;
        }

        public void getAreaCreator( byte _direction, int _userId, Ship _ship, ref List<Ship> _ships, ref List<SpacegameServer.Core.SystemMap> _stars, ref List<SpacegameServer.Core.Colony> _colonies, Colony scanningColony = null)
        {
            var starXY = getDestinationField(_ship, _direction);

            if (_userId < 0) return;
            SpacegameServer.Core.User user = (SpacegameServer.Core.User)users[_userId];
            if (user == null) return;

            //fetch an area of radius 7 around the target field
            //check all colonies inside it. Every colony that has the targetfield inside it's border range is returned...
            //List<Field> neigbouringFields = new List<Field>();
            //GeometryIndex.getFields(_ship.field, 7, neigbouringFields);

            //int targetRegionId = GeometryIndex.calcRegionId(starXY.Key, starXY.Value);
            //var targetField = GeometryIndex.regions[targetRegionId].findOrCreateField(starXY.Key, starXY.Value);

            int targetRegionId = GeometryIndex.calcRegionId(starXY.Key, starXY.Value);
            var targetField = GeometryIndex.regions[targetRegionId].findOrCreateField(starXY.Key, starXY.Value);
            
            //fetch all colonies affecting the targetField
            _colonies = Core.Instance.colonies.Where(colony => targetField.InfluencedBy.Any(influencer => influencer == colony.Value)).Select(colKeyValue => colKeyValue.Value).ToList();
            

            //fetch the star each colony is positioned
            foreach (int fieldId in (_colonies.Select(colony=>colony.field.id)))
            {
                Field currentField = ((Field)GeometryIndex.allFields[fieldId]);
                
                if (currentField.starId != null)
                {
                    int starId = (int)currentField.starId;
                    SystemMap star = stars[starId];
                    _stars.Add(star);

                    //if scan is determined for a single ship, check if that user already kwos the systems scanned:
                    if ((_ship != null) && !user.knownStars.Contains(starId))
                    {
                        user.knownStars.Add(starId);
                        UserStarMap newStar = new UserStarMap(user.id, starId);

                        List<AsyncInsertable> newKnownStar = new List<AsyncInsertable>();
                        newKnownStar.Add(newStar);

                        dataConnection.insertAsyncTransaction(newKnownStar);
                    }
                }
            }
        
            return;
        }



        public List<Field> getUserScannedFields(int _userId, Ship _ship, Colony scanningColony = null)
        {
            List<Field> scanned = new List<Field>();
            if (_userId < 0) return scanned;
            SpacegameServer.Core.User user = (SpacegameServer.Core.User)users[_userId];
            if (user == null) return scanned;

            //make a list with unique fields, only the scanner with the greates scanrange is needed
            Dictionary<Int32, KeyValuePair<Field, byte>> fieldScans = new Dictionary<int, KeyValuePair<Field, byte>>();

            if (_ship != null || scanningColony != null)
            {
                if (_ship != null)
                    fieldScans[_ship.field.id] = new KeyValuePair<Field, byte>(_ship.field, _ship.scanRange);

                if (scanningColony != null)
                    fieldScans[scanningColony.field.id] = new KeyValuePair<Field, byte>(scanningColony.field, scanningColony.scanRange);
            }
            else
            {
                for (int i = 0; i < user.ships.Count; i++)
                {
                    Ship currentShip = user.ships[i];
                    KeyValuePair<Field, byte> val;
                    if (fieldScans.TryGetValue(user.ships[i].field.id, out val))
                    {
                        if (val.Value < currentShip.scanRange) fieldScans[currentShip.field.id] = new KeyValuePair<Field, byte>(currentShip.field, currentShip.scanRange);
                    }
                    else
                        fieldScans[currentShip.field.id] = new KeyValuePair<Field, byte>(currentShip.field, currentShip.scanRange);
                }

                for (int i = 0; i < user.colonies.Count; i++)
                {
                    Colony currentColony = user.colonies[i];
                    KeyValuePair<Field, byte> val;

                    if (fieldScans.TryGetValue(currentColony.field.id, out val))
                    {
                        if (val.Value < currentColony.scanRange) fieldScans[currentColony.field.id] = new KeyValuePair<Field, byte>(currentColony.field, currentColony.scanRange);
                    }
                    else
                        fieldScans[currentColony.field.id] = new KeyValuePair<Field, byte>(currentColony.field, currentColony.scanRange);
                }
            }
            //find all neighbouring fields of the scanners
            //use the regions to accomplish this            
            List<int> scannedFields = new List<int>();
            foreach (KeyValuePair<Int32, KeyValuePair<Field, byte>> scanner in fieldScans)
            {
                scanner.Value.Key.getScanRange(scanner.Value.Value, scannedFields);
            }

           
            //detect all ships, stars and colonies on the fields scanned
            foreach (int fieldId in (scannedFields.Distinct()))
            {
                scanned.Add((Field)GeometryIndex.allFields[fieldId]);
            }




            return scanned;
        }     

        public bool addShipToField(Ship _ship)
        {
            int regionId = GeometryIndex.calcRegionId(_ship.posX, _ship.posY);
            Field field = GeometryIndex.regions[regionId].findOrCreateField(_ship.posX, _ship.posY);

            SpacegameServer.Core.NodeQuadTree.Field shipField2 = new SpacegameServer.Core.NodeQuadTree.Field(_ship.posX, _ship.posY);
            nodeQuadTree.insertShip(shipField2, _ship);

            return field.AddShip(_ship);
        }

        public bool addColonyToField(Colony _colony)
        {
            SystemMap colonyStar = stars[_colony.starId];
            int regionId = GeometryIndex.calcRegionId(colonyStar.posX, colonyStar.posY);
            Field field = GeometryIndex.regions[regionId].findOrCreateField(colonyStar.posX, colonyStar.posY);

            _colony.field = field;
            return field.addColony(_colony);
        }

        public void addStarToField(SystemMap _star)
        {
            int regionId = GeometryIndex.calcRegionId(_star.posX, _star.posY);
            Field field = GeometryIndex.regions[regionId].findOrCreateField(_star.posX, _star.posY);
            field.starId =_star.id;
            _star.field = field;
        }

        public bool moveShipToField(Ship _ship, Field _targetField)
        {
            int regionId = GeometryIndex.calcRegionId(_ship.posX, _ship.posY);
            Field originField = GeometryIndex.regions[regionId].findOrCreateField(_ship.posX, _ship.posY);

            for (int i = 0; i < 10; i++)
            {
                bool originLocked = originField.setLock();
                bool targetLocked = _targetField.setLock();
                if (originLocked && targetLocked)
                {
                    originField.removeShip(_ship);
                    _targetField.AddShip(_ship);

                    originField.removeLock();
                    _targetField.removeLock();
                    return true;
                }
                if (originLocked) originField.removeLock();
                if (targetLocked) _targetField.removeLock();
                Thread.Sleep(Lockable.rnd.Next(0, 50));
            }

            return false;
        }
    }



}
