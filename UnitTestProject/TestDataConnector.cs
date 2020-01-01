using SpacegameServer;
using SpacegameServer.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTestProject
{
    class TestDataConnector : DataConnector
    {
        public void loadData(SpacegameServer.Core.Core _core) { getAll(_core); }


        public SpacegameServer.DataConnectors.IndexUser getIndexUser(int userId)
        {
            var user = new SpacegameServer.DataConnectors.IndexUser();            
            user.id = userId;
            user.user_ip = "123";
            user.language = 1;
            user.premiumEnd = DateTime.Now.AddMonths(-1);
            user.userLevel = 1;
            user.name = "Andi";
            return user;
        }

        #region TurnSummary
        public void userTurnSummary(int _userId) { }
        public void TurnSummary() { }

        public void TurnSummaryRank() { }

        #endregion

        #region UserContacts
        public string createUserContact(int userId, int targetUserId) { return "<xml>createUserContact</xml>"; }

        #endregion

        
        //GetAll.cs
        public void getAll(SpacegameServer.Core.Core _core)
        {
            //save the TestDataConnector
            DataConnector connectorTest = _core.dataConnection;
            
            //Read Game Data with sql connector
            DataConnector connector = new SpacegameServer.DataConnectors.SqlConnector();
            _core.dataConnection = connector;
            _core.dataConnection.getGameData(_core);

            //important: Set Data COnnection back to TestDataconnection, so that following write2DB are just skipped 
            _core.dataConnection = connectorTest;

            //TestDataConnector will Mock user data for player 0
            _core.dataConnection.getUsersData(_core);

            //User Data Contains some Data of player 0       
        }
        public void getGameData(SpacegameServer.Core.Core _core) {

            getGalaxyData(_core);
            getSpaceObjects(_core);
            getObjectsOnMap(_core);
            getObjectImages(_core);
            getObjectWeaponModificators(_core);

            getGoods(_core);

            getBuildings(_core);
            getBuildingProductions(_core);
            getBuildingCosts(_core);

            getPlanetTypes(_core);

            getShipHulls(_core);
            getShipHullsGain(_core);
            getShipHullsCosts(_core);
            getShipHullsModulePositions(_core);
            getShipHullsImages(_core);

            getModules(_core);
            getModulesGain(_core);
            getModulesCost(_core);

            getResearchQuestPrerequisites(_core);
            getSurfaceImages(_core);
            getSurfaceTiles(_core);
            getBuildOptions(_core);
            getQuests(_core);
            getResearchs(_core);
            getResearchsGain(_core);

            getObjectRelations(_core);

            getSurfaceDefaultMap(_core);

            getLanguages(_core);
            getLabels(_core);

            //MAP
            getStars(_core);
            getSolarSystemInstances(_core);
            getPlanetSurface(_core);}
        public void getUsersData(SpacegameServer.Core.Core _core) {
            getUsers(_core, 0);
            getUserStarMap(_core);
            getUserQuests(_core, null);
            getUserResearches(_core, null);

            getShipTemplates(_core, 0, null);
            getShipTemplatesModules(_core, null, false);

            getShips(_core, 0, null);
            getShipStock(_core, null, false);
            getShipModules(_core, null, false);
            getShipDirection(_core);
            getShipTranscension(_core);
            getShipTranscensionUsers(_core);

            getColonies(_core);
            getColonyStock(_core, null);
            getColonyBuildings(_core, null);

            getAlliances(_core, null);
            getAllianceMembers(_core);

            getDiplomaticEntityState(_core);
            getAllianceInvites(_core);
            getCommNodes(_core);
            getCommNodeUsers(_core);
            getCommunicationNodeMessage(_core);

            getCombat(_core);
            getCombatRounds(_core);
        }
        public void getUsersRefresh(SpacegameServer.Core.Core _core) { }

        public void getGalaxyData(SpacegameServer.Core.Core _core) { }

        public void GetTurnEvaluations(SpacegameServer.Core.Core _core) { }

        public void getSpaceObjects(SpacegameServer.Core.Core _core) { }

        public void getObjectsOnMap(SpacegameServer.Core.Core _core) { }

        public void getObjectImages(SpacegameServer.Core.Core _core) { }

        public void getObjectWeaponModificators(SpacegameServer.Core.Core _core) { }

        public void getGoods(SpacegameServer.Core.Core _core) { }

        public void getBuildings(SpacegameServer.Core.Core _core) { }

        public void getBuildingProductions(SpacegameServer.Core.Core _core) { }

        public void getBuildingCosts(SpacegameServer.Core.Core _core) { }

        public void getPlanetTypes(SpacegameServer.Core.Core _core) { }

        public void getShipHulls(SpacegameServer.Core.Core _core) {
            SpacegameServer.Core.ShipHullsImage ShipHullsImage = new SpacegameServer.Core.ShipHullsImage();
            ShipHullsImage.id = 1;
            ShipHullsImage.shipHullId = 1;
            ShipHullsImage.objectId = 2;
            ShipHullsImage.templateImageId = 2;
            ShipHullsImage.templateModulesXoffset = 3;
            ShipHullsImage.templateModulesYoffset = 3;
            
            //ShipHull.ShipHullsImages.Add(ShipHullsImage);
            _core.ShipHullsImages.Add(ShipHullsImage);
        }

        public void getShipHullsGain(SpacegameServer.Core.Core _core) { }
        public void getShipHullsCosts(SpacegameServer.Core.Core _core) { }

        public void getShipHullsModulePositions(SpacegameServer.Core.Core _core) { }
        public void getShipHullsImages(SpacegameServer.Core.Core _core) { }
        public void getModules(SpacegameServer.Core.Core _core) { }
        public void getModulesGain(SpacegameServer.Core.Core _core) { }
        public void getModulesCost(SpacegameServer.Core.Core _core) { }
        public void getResearchQuestPrerequisites(SpacegameServer.Core.Core _core) { }
        public void getSurfaceImages(SpacegameServer.Core.Core _core) { }
        public void getSurfaceTiles(SpacegameServer.Core.Core _core) { }
        public void getBuildOptions(SpacegameServer.Core.Core _core) { }

        public void getQuests(SpacegameServer.Core.Core _core)
        {
            Quest MockedQuest = Mock.mockQuest(questId: 1);
            _core.Quests[MockedQuest.id] = MockedQuest;
       
        }

        public void getResearchs(SpacegameServer.Core.Core _core) {
            Research research = Mock.mockResearch(researchid: 1, description:"BaseResearch");
            _core.Researchs[research.id] = research;

            research = Mock.mockResearch(researchid: 2, description: "Wasserkraftwerk");
            _core.Researchs[research.id] = research;

            research = Mock.mockResearch(researchid: 9, description: "Ecosytem Adaption I");
            _core.Researchs[research.id] = research;
        }
        public void getResearchsGain(SpacegameServer.Core.Core _core) { }
        public void getObjectRelations(SpacegameServer.Core.Core _core) { }

        public void getSurfaceDefaultMap(SpacegameServer.Core.Core _core) { }

        public void getSpecializationGroups(SpacegameServer.Core.Core _core) { }

        public void getSpecializationResearches(SpacegameServer.Core.Core _core) { }

        public void getTradeOffers(SpacegameServer.Core.Core _core) { }

        public void getTradeOfferDetails(SpacegameServer.Core.Core _core) { }

        public void getSolarSystemInstances(SpacegameServer.Core.Core _core) { }

        public void getPlanetSurface(SpacegameServer.Core.Core _core) { }

        public void getLanguages(SpacegameServer.Core.Core _core) { }
        public void getLabels(SpacegameServer.Core.Core _core) { }

        //Game map

        public void getUserStarMap(SpacegameServer.Core.Core _core) { }

        public void getStars(SpacegameServer.Core.Core _core) { }


        public void getUsers(SpacegameServer.Core.Core _core, int userid) {
            _core.users.TryAdd(0, Mock.MockUser(id : 0));
        }

        public void getShipTemplates(SpacegameServer.Core.Core _core, int templateId, SpacegameServer.Core.User _user) 
        {
            var newTemplateId = (int)_core.identities.templateLock.getNext();
            var Template = Mock.mockShipTemplate(newTemplateId,0);
            _core.shipTemplate.TryAdd(newTemplateId, Template);
        }
        public void getShipTemplatesModules(SpacegameServer.Core.Core _core, SpacegameServer.Core.ShipTemplate filterTemplate, bool _refresh = false) 
        { 
        }


        public void getShips(SpacegameServer.Core.Core _core, int _shipId, SpacegameServer.Core.User _user) 
        {
            int DefaultUser = 0;

            int shipId1 = (int)_core.identities.shipLock.getNext();
            SpacegameServer.Core.Ship Ship1;
            Ship1 = new SpacegameServer.Core.Ship(shipId1);
            
            Ship1.userid = DefaultUser;
            Ship1.posX = 5000;
            Ship1.posY = 5000;

            _core.ships[shipId1] = Ship1;
            _core.addShipToField(Ship1);
            ((SpacegameServer.Core.User)_core.users[DefaultUser]).ships.Add(Ship1);


            shipId1 = (int)_core.identities.shipLock.getNext();
            Ship1 = new SpacegameServer.Core.Ship(shipId1);

            Ship1.userid = DefaultUser;
            Ship1.posX = 5001;
            Ship1.posY = 5001;

            _core.ships[shipId1] = Ship1;
            _core.addShipToField(Ship1);
            ((SpacegameServer.Core.User)_core.users[DefaultUser]).ships.Add(Ship1);
        }
        public void getShipStock(SpacegameServer.Core.Core _core, SpacegameServer.Core.Ship _ship, bool _refresh = false) { }
        public void getShipModules(SpacegameServer.Core.Core _core, SpacegameServer.Core.Ship _ship, bool _refresh = false) { }
        public void getShipTranscension(SpacegameServer.Core.Core _core) { }

        public void getShipTranscensionUsers(SpacegameServer.Core.Core _core)
        {}
        public void getShipDirection(SpacegameServer.Core.Core _core) { }
        public void getColonies(SpacegameServer.Core.Core _core, int? _colonyId = null, int? userId = null) { }
        public void getColonyStock(SpacegameServer.Core.Core _core, SpacegameServer.Core.Colony _colony, bool _refresh = false) { }
        public void getUserQuests(SpacegameServer.Core.Core _core, SpacegameServer.Core.User _user) { }
        public void getUserResearches(SpacegameServer.Core.Core _core, SpacegameServer.Core.User _user) { }
        public void getUserContacts(SpacegameServer.Core.Core _core) { }
        public void getColonyBuildings(SpacegameServer.Core.Core _core, SpacegameServer.Core.Colony colony) { }

        public void getAlliances(SpacegameServer.Core.Core _core, int? allianceId)
        {}

        public void getAllianceMembers(SpacegameServer.Core.Core _core) { }
        public void getDiplomaticEntityState(SpacegameServer.Core.Core _core) { }

        public void getAllianceInvites(SpacegameServer.Core.Core _core) { }

        public void getCommNodes(SpacegameServer.Core.Core _core) 
        {

            var commNodeId = (int)_core.identities.commNode.getNext();
            int DefaultUser = 0;

            CommunicationNode node = new CommunicationNode(commNodeId);
            node.userId = DefaultUser;
            node.positionX = 5000;
            node.positionY = 5000;

            node.sysX = null ;
            node.sysY = null ;

            node.connectionType = 0;
            node.connectionId = _core.ships.First().Key;
            node.activ = true;
            node.unformattedName = "";
            node.name = "";

            _core.commNodes.TryAdd(commNodeId, node);
            SpacegameServer.Core.NodeQuadTree.Field commNodeField = new SpacegameServer.Core.NodeQuadTree.Field(node.positionX, node.positionY);
            _core.nodeQuadTree.insertNode(commNodeField, node.id);


            commNodeId = (int)_core.identities.commNode.getNext();
            node = new CommunicationNode(commNodeId);
            node.userId = DefaultUser;
            node.positionX = 5001;
            node.positionY = 5001;

            node.sysX = null;
            node.sysY = null;

            node.connectionType = 0;
            node.connectionId = _core.ships[1].id;
            node.activ = true;
            node.unformattedName = "";
            node.name = "";

            _core.commNodes.TryAdd(commNodeId, node);
             commNodeField = new SpacegameServer.Core.NodeQuadTree.Field(node.positionX, node.positionY);
            _core.nodeQuadTree.insertNode(commNodeField, node.id);

        }
        public void getCommNodeUsers(SpacegameServer.Core.Core _core) { }

        public void getCommunicationNodeMessage(SpacegameServer.Core.Core _core) { }

        public void getMessageHeads(SpacegameServer.Core.Core _core) { }
        public void getMessageParticipants(SpacegameServer.Core.Core _core) { }
        public void getMessageBody(SpacegameServer.Core.Core _core) { }

        public void getCombat(SpacegameServer.Core.Core _core) { }
        public void getCombatRounds(SpacegameServer.Core.Core _core) { }
        public void getShipRefits(SpacegameServer.Core.Core _core) { }


        public void getChatLog(SpacegameServer.Core.Core _core) { }






        //WriteBuffers.cs

        public void saveAsync(List<AsyncSaveable> elementsToSave) { }
        public void insertAsyncTransaction(List<AsyncInsertable> elementsToInsert) { }
        public void insertAsync(List<AsyncInsertable> elementsToInsert) { }
        public List<Task> insertElements(List<AsyncInsertable> _elementsToLock, object _command) { return new List<Task>(); }
        public void deleteAsyncTransaction(List<AsyncDeleteable> elementsToDelete) { }
        List<Task> deleteElements(List<AsyncDeleteable> _elementsToLock, object _command) { return new List<Task>(); }
        public void update(List<Update> elementsToUpdate) { }
        public void updateStock(List<UserSpaceObject> elementsToUpdate) { }

        public int registerUser(int userId, string name, string ip) { return 1; }
        public int createDemoUser(string userIp, string userLanguage) { return 1; }
        public void saveLog(string logText) { }

        public void saveServerEvent(int eventId) { }

        public Task saveGame(object command) { return Task.FromResult(0); }
        public Task saveShip(SpacegameServer.Core.Ship _ship, object command) { return Task.FromResult(0); }

        public Task saveShipTemplate(SpacegameServer.Core.ShipTemplate template, object command) { return Task.FromResult(0); }

        public void saveUser(SpacegameServer.Core.User user) { }

        public void saveAlliances(SpacegameServer.Core.Alliance alliance) { }

        public void SaveUserQuests(SpacegameServer.Core.Core instance, List<SpacegameServer.Core.UserQuest> quests) { }
        public void InsertTurnEvaluation(SpacegameServer.Core.TurnEvaluation turn) { }

        public void saveResearch(SpacegameServer.Core.Core instance, SpacegameServer.Core.Research research = null ) { }

        public void SaveUserResearch(SpacegameServer.Core.Core instance, SpacegameServer.Core.User user, List<SpacegameServer.Core.UserResearch> NewUserResearch, List<SpacegameServer.Core.UserQuest> NewQuests) { }

        public void SaveResearch( List<SpacegameServer.Core.UserResearch> research) { }

        public void SaveTradeOffer(SpacegameServer.Core.TradeOffer trade) { }

        public void SaveTradeList(List<SpacegameServer.Core.TradeOffer> trades) { }

        public void saveAllianceMembers(SpacegameServer.Core.Alliance alliance){ }
        public void deleteAllianceRelations(int allianceHash){ }
        public void deleteTradeOfferById(int id) { }
        public void deleteTradeOfferByObject(int type, int objectId) { }


        public void deleteAlliance(int allianceId){ }

        public void insertInvite(int allianceId, int userId) { }
        public void removeInvite(int allianceId, int userId) { }
        public void saveColonies(SpacegameServer.Core.Colony colony) { }

        public void saveColonyFull(SpacegameServer.Core.SolarSystemInstance planet, SpacegameServer.Core.Colony colony) { }

        public void saveColonyFull(SpacegameServer.Core.SolarSystemInstance planet, SpacegameServer.Core.Colony colony, bool createSurfaceFiels = true) { }

        public void saveMinorColony(SpacegameServer.Core.SolarSystemInstance planet, int colonyId) { }
        public void saveSingleColony(SpacegameServer.Core.Colony colony) { }
        public void savePlanetSurface(SpacegameServer.Core.SolarSystemInstance planet) { }
        public void saveColonyBuildings(SpacegameServer.Core.ColonyBuilding colonyBuilding) { }

        public void userSaveFog(SpacegameServer.Core.User user) { }

        public void saveShips(List<SpacegameServer.Core.Ship> ships = null) { }
        public void insertShip(SpacegameServer.Core.Ship _ship) { }

        public Task saveColony(SpacegameServer.Core.Colony colony, object command) { return Task.FromResult(0); }
        public Task deleteShip(SpacegameServer.Core.Ship _ship, object command) { return Task.FromResult(0); }
        public void saveShipname(SpacegameServer.Core.Ship _ship) { }
        public void saveShipModules(SpacegameServer.Core.Ship _ship) { }
        public void saveShipGoods(SpacegameServer.Core.Ship _ship) { }
        public void SaveShipTranscensionTurn(SpacegameServer.Core.ShipTranscension transcension) { }
        public void saveShipTranscensionUsers(SpacegameServer.Core.Ship ship) { }
        public void saveColonyGoods(SpacegameServer.Core.Colony colony) { }

        public void saveColoniesGoods() { }

        public Task insertDirection(SpacegameServer.Core.shipDirection _shipDirection, object command) { return Task.FromResult(0); }
        public Task mergeShipRefit(SpacegameServer.Core.shipRefit _shipRefit, object command) { return Task.FromResult(0); }
        public void RefitDecrement() { }
        public void saveDiplomaticEntities(List<DiplomaticRelation> relations) { }

        public void saveCommNodeUsers(List<CommNodeUser> users) { }

        public void DeleteCommNodeUsers(SpacegameServer.Core.CommunicationNode node, SpacegameServer.Core.User user){ }

        public void saveCommNode(SpacegameServer.Core.CommunicationNode node) { }
        public void saveCommNodeMessage(SpacegameServer.Core.CommunicationNodeMessage message) { }
        public void saveCombat(SpacegameServer.Core.Combat message) { }
        public void updateCombatIsRead(SpacegameServer.Core.Combat message) { }

        public void updateAllMessageRead(int messageType, int userId) { }
        public Task insertUserStarMap(SpacegameServer.Core.UserStarMap starMap, object command) { return Task.FromResult(0); }
        public string combat(SpacegameServer.Core.Ship _ship, SpacegameServer.Core.Ship _defShip, SpacegameServer.Core.Field _destination, Tuple<byte, byte> _systemCoords) { return "<xml>createUserContact</xml>"; }
        public bool writeMovement(SpacegameServer.Core.Ship _ship, SpacegameServer.Core.Ship _enemyship, int _direction) { return true; }
        public void colonize(SpacegameServer.Core.Ship _ship, string _newName, out int colonyId, out string xml) { xml = "<xml>createUserContact</xml>"; colonyId = 1; }
        public int createShip(int userid) { return 1; }
        public void buildShip(int _shipTemplateId, int _userId, int _colonyId, bool fastBuild, ref string _xml, ref int _shipId) { }
        public void buildBuilding(int userId, int colonyId, int tileNr, int buildingId, ref string xml) { }
        public void buildModules(int userId, int colonyId, ref string xml) { }
        public void DeconstructBuilding(int userId, int buildingId) { }
        public void doResearch(int userId, int researchId, ref string xml) { }
        public void transfer(int userId, string transferXML, ref string _xml) { }
        public void acceptTrade(int userId, int soIdIdInt, int soTypeInt, int tradeOfferIdInt, ref string output) { }

        public void saveStarmap(SpacegameServer.Core.SystemMap starMap) { }

        public void insertGalacticEvent(SpacegameServer.Core.GalacticEvents galacticEvent) { }
        public void InsertUserHistory() { }

        public void insertChatMessage(SpacegameServer.Core.ChatLog chatMessage) { }

        public void SaveMessage(SpacegameServer.Core.MessageHead messageHead) { }

        public void SaveMessageparticipant(SpacegameServer.Core.MessageParticipants messageParticipant) { }
    }
}
