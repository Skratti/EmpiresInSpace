using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer
{
    public interface DataConnector
    {
        
#region SqlConnector
        


#endregion

        void loadData(SpacegameServer.Core.Core _core);
        //SqlConnection getConnection();

        //SqlConnection getIndexConnection();

        SpacegameServer.DataConnectors.IndexUser getIndexUser(int userId);

#region TurnSummary
        void userTurnSummary(int _userId);
        void TurnSummary();

        void TurnSummaryRank();

#endregion


#region GetAll
        //GetAll.cs
        void getAll(SpacegameServer.Core.Core _core);
        void getGameData(SpacegameServer.Core.Core _core);
        void getUsersData(SpacegameServer.Core.Core _core);
        void getUsersRefresh(SpacegameServer.Core.Core _core);

        void getGalaxyData(SpacegameServer.Core.Core _core);

        void GetTurnEvaluations(SpacegameServer.Core.Core _core);

        void getSpaceObjects(SpacegameServer.Core.Core _core);

        void getObjectsOnMap(SpacegameServer.Core.Core _core);

        void getObjectImages(SpacegameServer.Core.Core _core);

        void getObjectWeaponModificators(SpacegameServer.Core.Core _core);


        void getGoods(SpacegameServer.Core.Core _core);

        void getBuildings(SpacegameServer.Core.Core _core);

        void getBuildingProductions(SpacegameServer.Core.Core _core);

        void getBuildingCosts(SpacegameServer.Core.Core _core);

        void getPlanetTypes(SpacegameServer.Core.Core _core);

        void getShipHulls(SpacegameServer.Core.Core _core);
        
        void getShipHullsGain(SpacegameServer.Core.Core _core);
        void getShipHullsCosts(SpacegameServer.Core.Core _core);

        void getShipHullsModulePositions(SpacegameServer.Core.Core _core);
        void getShipHullsImages(SpacegameServer.Core.Core _core);
        void getModules(SpacegameServer.Core.Core _core);
        void getModulesGain(SpacegameServer.Core.Core _core);
        void getModulesCost(SpacegameServer.Core.Core _core);
        void getResearchQuestPrerequisites(SpacegameServer.Core.Core _core);
        void getSurfaceImages(SpacegameServer.Core.Core _core);
        void getSurfaceTiles(SpacegameServer.Core.Core _core);
        void getBuildOptions(SpacegameServer.Core.Core _core);

        void getQuests(SpacegameServer.Core.Core _core);
        void getResearchs(SpacegameServer.Core.Core _core);
        void getResearchsGain(SpacegameServer.Core.Core _core);

        void getSpecializationGroups(SpacegameServer.Core.Core _core);

        void getSpecializationResearches(SpacegameServer.Core.Core _core);

        void getTradeOffers(SpacegameServer.Core.Core _core);

        void getTradeOfferDetails(SpacegameServer.Core.Core _core);

        void getObjectRelations(SpacegameServer.Core.Core _core);

        void getSurfaceDefaultMap(SpacegameServer.Core.Core _core);

        void getLanguages(SpacegameServer.Core.Core _core);
        void getLabels(SpacegameServer.Core.Core _core);

        //Game map
        void getSolarSystemInstances(SpacegameServer.Core.Core _core);

        void getPlanetSurface(SpacegameServer.Core.Core _core);

        void getUserStarMap(SpacegameServer.Core.Core _core);

        void getStars(SpacegameServer.Core.Core _core);





        void getUsers(SpacegameServer.Core.Core _core, int userid );

        void getShipTemplates(SpacegameServer.Core.Core _core, int templateId, SpacegameServer.Core.User _user);
        void getShipTemplatesModules(SpacegameServer.Core.Core _core, SpacegameServer.Core.ShipTemplate filterTemplate, bool _refresh = false);


        void getShips(SpacegameServer.Core.Core _core, int _shipId, SpacegameServer.Core.User _user);
        void getShipStock(SpacegameServer.Core.Core _core, SpacegameServer.Core.Ship _ship, bool _refresh = false);
        void getShipModules(SpacegameServer.Core.Core _core, SpacegameServer.Core.Ship _ship, bool _refresh = false);
        void getShipTranscension(SpacegameServer.Core.Core _core);
        void getShipTranscensionUsers(SpacegameServer.Core.Core _core);
        
        void getShipDirection(SpacegameServer.Core.Core _core);
        void getColonies(SpacegameServer.Core.Core _core, int? _colonyId = null, int? userId = null);
        void getColonyStock(SpacegameServer.Core.Core _core, SpacegameServer.Core.Colony _colony, bool _refresh = false);
        void getUserQuests(SpacegameServer.Core.Core _core, SpacegameServer.Core.User _user);
        void getUserResearches(SpacegameServer.Core.Core _core, SpacegameServer.Core.User _user);
        
        void getColonyBuildings(SpacegameServer.Core.Core _core, SpacegameServer.Core.Colony colony);

        void getAlliances(SpacegameServer.Core.Core _core, int? allianceId);

        void getAllianceMembers(SpacegameServer.Core.Core _core);
        void getDiplomaticEntityState(SpacegameServer.Core.Core _core);
        
        void getAllianceInvites(SpacegameServer.Core.Core _core);
       
        void getCommNodes(SpacegameServer.Core.Core _core);
        void getCommNodeUsers(SpacegameServer.Core.Core _core);

        void getCommunicationNodeMessage(SpacegameServer.Core.Core _core);

        void getMessageHeads(SpacegameServer.Core.Core _core);
        void getMessageParticipants(SpacegameServer.Core.Core _core);
        void getMessageBody(SpacegameServer.Core.Core _core);

        void getCombat(SpacegameServer.Core.Core _core);

        void getCombatRounds(SpacegameServer.Core.Core _core);
        void getShipRefits(SpacegameServer.Core.Core _core);


        void getChatLog(SpacegameServer.Core.Core _core);

        #endregion


        #region WriteBuffers
        //WriteBuffers.cs
        //  void closeConnectionOnFinish(List<Task> _tasks, SqlConnection connection);
        //   void closeTransConnectionOnFinish(List<Task> _tasks, SqlConnection connection, SqlTransaction _transaction);

        void saveAsync(List<AsyncSaveable> elementsToSave);
        void insertAsyncTransaction(List<AsyncInsertable> elementsToInsert);
        void insertAsync(List<AsyncInsertable> elementsToInsert);
        //List<Task> insertElements(List<AsyncInsertable> _elementsToLock, SqlCommand _command);
        void deleteAsyncTransaction(List<AsyncDeleteable> elementsToDelete);
        //List<Task> deleteElements(List<AsyncDeleteable> _elementsToLock, SqlCommand _command);
        void update(List<Update> elementsToUpdate);
        void updateStock(List<Core.UserSpaceObject> elementsToUpdate);

        int registerUser(int userId, string name, string ip);
        int createDemoUser(string userIp, string userLanguage);
        void saveLog(string logText);

        void saveServerEvent(int eventId);

         Task saveGame(object command);
        //Task saveShip(SpacegameServer.Core.Ship _ship, SqlCommand command);
         Task saveShip(SpacegameServer.Core.Ship _ship, object command);

        Task saveShipTemplate(SpacegameServer.Core.ShipTemplate template, object command);

        void saveUser(SpacegameServer.Core.User user);

        void saveAlliances(SpacegameServer.Core.Alliance alliance);

        void saveResearch(Core.Core instance, SpacegameServer.Core.Research research = null);

        void SaveUserResearch(Core.Core instance, SpacegameServer.Core.User user, List<SpacegameServer.Core.UserResearch> NewUserResearch, List<SpacegameServer.Core.UserQuest> NewQuests);

        void SaveUserQuests(Core.Core instance, List<SpacegameServer.Core.UserQuest> quests);

        void InsertTurnEvaluation(SpacegameServer.Core.TurnEvaluation turn);

        void SaveResearch(List<SpacegameServer.Core.UserResearch> research);

        void SaveTradeOffer(SpacegameServer.Core.TradeOffer trade);

        void SaveTradeList(List<SpacegameServer.Core.TradeOffer> trades);

        void saveAllianceMembers(SpacegameServer.Core.Alliance alliance);
        void deleteAllianceRelations(int allianceHash);

        void deleteTradeOfferById(int id);
        void deleteTradeOfferByObject(int type, int objectId);

        void deleteAlliance(int allianceId);
        void insertInvite(int allianceId, int userId);
        void removeInvite(int allianceId, int userId);
        void saveColonies(SpacegameServer.Core.Colony colony);

        void saveColonyFull(SpacegameServer.Core.SolarSystemInstance planet, SpacegameServer.Core.Colony colony, bool createSurfaceFiels = true);

        void saveMinorColony(SpacegameServer.Core.SolarSystemInstance planet, int colonyId);

        void saveSingleColony(SpacegameServer.Core.Colony colony);
        void savePlanetSurface(SpacegameServer.Core.SolarSystemInstance planet);
        void saveColonyBuildings(SpacegameServer.Core.ColonyBuilding colonyBuilding);
        //void saveShips();
        void userSaveFog(SpacegameServer.Core.User user);
        void saveShips(List<SpacegameServer.Core.Ship> ships = null);

        void insertShip(SpacegameServer.Core.Ship _ship );

        Task saveColony(SpacegameServer.Core.Colony colony, object command);
        Task deleteShip(SpacegameServer.Core.Ship _ship, object command);
        void saveShipname(SpacegameServer.Core.Ship _ship);
        void saveShipModules(SpacegameServer.Core.Ship _ship);
        void saveShipGoods(SpacegameServer.Core.Ship _ship);

        void InsertUserHistory();

        void SaveShipTranscensionTurn(SpacegameServer.Core.ShipTranscension transcension);

        void saveShipTranscensionUsers(SpacegameServer.Core.Ship ship);        
        void saveColonyGoods(SpacegameServer.Core.Colony colony);

        void saveColoniesGoods();

        Task insertDirection(SpacegameServer.Core.shipDirection _shipDirection, object command);
        Task mergeShipRefit(SpacegameServer.Core.shipRefit _shipRefit, object command);
        void RefitDecrement();

        void saveDiplomaticEntities(List<Core.DiplomaticRelation> relations);

        void saveCommNodeUsers(List<Core.CommNodeUser> users);

        void DeleteCommNodeUsers(Core.CommunicationNode node, Core.User user);

        void saveCommNode(Core.CommunicationNode node);
        void saveCommNodeMessage(Core.CommunicationNodeMessage message);

        void saveCombat(Core.Combat message);
        void updateCombatIsRead(Core.Combat message);

        void updateAllMessageRead(int messageType, int userId);
        Task insertUserStarMap(SpacegameServer.Core.UserStarMap starMap, object command);
        string combat(SpacegameServer.Core.Ship _ship, SpacegameServer.Core.Ship _defShip, SpacegameServer.Core.Field _destination, Tuple<byte, byte> _systemCoords);
        bool writeMovement(SpacegameServer.Core.Ship _ship, SpacegameServer.Core.Ship _enemyship, int _direction);
        void colonize(SpacegameServer.Core.Ship _ship, string _newName, out int colonyId, out string xml);
        int createShip(int userid);
        void buildShip(int _shipTemplateId, int _userId, int _colonyId, bool fastBuild, ref string _xml, ref int _shipId);
        void buildBuilding(int userId, int colonyId, int tileNr, int buildingId, ref string xml);
        void buildModules(int userId, int colonyId, ref string xml);
        void DeconstructBuilding(int userId, int buildingId);
        void doResearch(int userId, int researchId, ref string xml);
        void transfer(int userId, string transferXML, ref string _xml);
        void acceptTrade(int userId, int soIdIdInt, int soTypeInt, int tradeOfferIdInt, ref string output);

        void saveStarmap(SpacegameServer.Core.SystemMap starMap);

        void insertGalacticEvent(SpacegameServer.Core.GalacticEvents galacticEvent);

        void insertChatMessage(SpacegameServer.Core.ChatLog chatMessage);

        void SaveMessage(Core.MessageHead messageHead);

        void SaveMessageparticipant(Core.MessageParticipants messageParticipant);
        #endregion

    } 
}
