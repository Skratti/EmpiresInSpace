using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace SpacegameServer.BC
{
    public partial class BusinessConnector
    {

        /*
        //ToDo: this looks better than the solution afterwards. Why not use it?
        public static bool Serialize2<T>(T value, ref string serializeXml, bool _OmitXmlDeclaration = false)
        {
            if (value == null)
            {
                return false;
            }

            XmlSerializer xsSubmit = new XmlSerializer(typeof(T));
            //var subReq = new T();
            var xml = "";

            using(var sww = new StringWriter())
            {
                using(XmlWriter writer = XmlWriter.Create(sww))
                {
                    xsSubmit.Serialize(writer, value);
                    xml = sww.ToString(); // Your XML
                }
            }

            serializeXml = xml;
            return true;

        }
        */

        public static bool Serialize<T>(T value, ref string serializeXml, bool _OmitXmlDeclaration = false)
        {
            if (value == null)
            {
                return false;
            }
            try
            {
                XmlSerializer xmlserializer = new XmlSerializer(typeof(T));
                StringWriter stringWriter = new StringWriter();
                XmlWriterSettings setup = new XmlWriterSettings();
                setup.Indent = true;
                setup.OmitXmlDeclaration = _OmitXmlDeclaration;
                
                XmlWriter writer = XmlWriter.Create(stringWriter, setup);

                XmlSerializerNamespaces ns = new XmlSerializerNamespaces();
                ns.Add("", "");

                xmlserializer.Serialize(writer, value, ns);

                serializeXml = stringWriter.ToString();

                writer.Close();
                return true;
            }
            catch (Exception e)
            {
                Core.Core.Instance.writeExceptionToLog(e);
                //Console.WriteLine("Exception source: {0}", e.Source);
                return false;
            }
        }

        public BusinessConnector()
        {            
        }


        public void writeExceptionToLog(Exception ex)
        {
            Core.Core.Instance.writeExceptionToLog(ex);
        }

        public string getLabel(int userId, int labelId)
        {
            string ret = "";
            try
            {
                ret = Core.Label.getLabel(userId, labelId);
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }


        public string moveShip2(int _shipId, byte _direction, int _userId, int _duration = 1, int _attackedShipId = 0)
        {
            string ret = "";
            try
            {
                ret = (new ShipMove(_shipId, _direction, _userId, _duration, _attackedShipId)).moveShip();
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public string MoveFleet(List<int> fleetIds, byte _direction, int _userId, int _duration = 1, int _attackedShipId = 0)
        {
            string ret = "";
            try
            {
                ret = ShipMove.MoveFleet(fleetIds, _direction, _userId, _duration, _attackedShipId);                
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public string MovePathFleet(List<int> fleetIds, List<byte> directions, int _userId, int _attackedShipId = 0)
        {
            string ret = "";
            try
            {
                ret = ShipMove.MovePathFleet(fleetIds, directions, _userId, _attackedShipId);
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        

        public string Besiege(int _shipId, byte _direction, int _userId, int _duration = 1)
        {
            string ret = "";
            try
            {
                ret = (new ShipMove(_shipId, _direction, _userId, _duration)).moveShip();
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public string getGameData()
        {
            string ret = "";
            try
            {
                ret = GameData.getGameData();
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }
        
        public string colonize(int _shipId, int _userId, string _newname)
        {
            string ret = "";
            try
            {
                ret = (new Colonize(_shipId, _userId, _newname)).colonize();
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public string createSpaceStation(int _shipId, int _userId )
        {
            string ret = "";
            try
            {
                ret = Ship.constructSpaceStation(_shipId, _userId);               
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public string ShipRepair(int _shipId, int _userId)
        {
            string ret = "";
            try
            {
                ret = Ship.Repair(_shipId, _userId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public string transcensionAdd(int _shipId, int _userId)
        {
            string ret = "";
            try
            {
                ret = Ship.transcensionAdd(_shipId, _userId);               
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public void colonyRename(int userId, int colonyId, string newName)
        {
            try
            {
                Colony.rename(userId, colonyId, newName);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public string AbandonColony(int userId, int colonyId)
        {
            try
            {
                return Colony.Abandon( colonyId, userId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
            return "";
        }


        public string buildShip(int _shipTemplateId, int _userId, int _colonyId, bool _fastBuild)
        {
            string ret = "";
            try
            {
                ret = (new ShipBuild(_shipTemplateId, _userId, _colonyId, _fastBuild)).buildShip();                
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public string buildBuilding( int userId, int colonyId, int tileNr, short buildingId )
        {
            string ret = "";
            try
            {
                ret =  Building.buildBuilding(userId, colonyId, tileNr, buildingId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;

        }

        public void buildingChangeActive(int userId, int colonyBuildingId)
        {            
            try
            {
                Building.changeActive(userId, colonyBuildingId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }            
        }


        public string buildModules(int userId, int colonyId)
        {
            string ret = "";
            try
            {
                ret = Modules.buildModules(userId, colonyId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;

        }

        public bool deconstructBuilding(int userId, int colonyId, int buildingId)
        {
            bool ret = false;
            try
            {
                ret = Building.deconstructBuilding(userId, colonyId, buildingId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;

        }


        public string doResearch(int userId, int researchId)
        {
            string ret = "";
            try
            {
                ret = (new BC.User(userId)).doResearch2(researchId);                
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public string ChooseSpecialization(int userId, string[] researchs)
        {
            string ret = "";
            try
            {
                ret = (new BC.User(userId)).ChooseSpecialization(researchs);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public string shipSelfdestruct(int _userId, int _shipId)
        {
            string ret = "";
            try
            {
                ret = ShipSelfdestruct.selfdestruct(_userId, _shipId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;            
        }

        public string shipRename(int _shipId, int _userId, string _newname)
        {
            string ret = "";
            try
            {
                ret = (new ShipRename(_shipId, _userId, _newname)).rename();
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;              
        }

        public string shipRefit(int _userId, string _refitXML)
        {
            string ret = "";
            try
            {
                ret = Ship.refit(_userId, _refitXML);               
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public string templateCreateUpdate(int userId, string templateXML)
        {
            string ret = "";
            try
            {
                ret =  ShipTemplates.createUpdate(userId, templateXML);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public void templateDelete(int userId, int templateId)
        {          
            try
            {
                ShipTemplates.delete(userId, templateId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }


        public string getUserData(int _userId)
        {
            string ret = "";
            try
            {
                ret = (new User(_userId)).getUserData();
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;     
        }

        public List<SpacegameServer.Core.SimpleField> getUserBordersData(int _userId)
        {
            List<SpacegameServer.Core.SimpleField> ret = null;
            try
            {
                ret = (new User(_userId)).getUserBordersData();
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        /// <summary>
        /// Fetches all research for the owner of the call, or only completed specialization research if the owner asks informations about another player(userId )
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="owner"></param>
        /// <returns></returns>
        public List<Core.UserResearch> getUserResearch(int userId, bool owner)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return new List<Core.UserResearch>();
            Core.User user = Core.Core.Instance.users[userId];
            return user.PlayerResearch.Where(e=> owner || (e.isCompleted == 1 && e.research.researchType == 10)).ToList();
        }




        public List<Tuple<int, short>> getAllUsersSpecifications()
        {
            if (!Core.Core.Instance.users
                .Any(user => user.Value.PlayerResearch.Any(playerResearch => playerResearch.isCompleted == 1 && playerResearch.research.researchType == 10)))
                return new List<Tuple<int, short>>();

            var ret = Core.Core.Instance.users
                .Where(user=>user.Value.PlayerResearch.Any(playerResearch=>playerResearch.isCompleted == 1 && playerResearch.research.researchType == 10))
                .SelectMany(user=> user.Value.PlayerResearch.Where(playerResearch=>playerResearch.isCompleted == 1 && playerResearch.research.researchType == 10)
                    .Select(playerResearch=> Tuple.Create( user.Value.id, playerResearch.researchId)));

            return ret.ToList();
         
        }

        public void SetLatestGalacticEvents(int userId, int LatestEventSoFar)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            Core.User user = Core.Core.Instance.users[userId];

            user.LastReadGalactivEvent = LatestEventSoFar;
            Core.Core.Instance.dataConnection.saveUser(user);
            
        }

        public void SetShowCombatPopup(int userId, bool value)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            Core.User user = Core.Core.Instance.users[userId];

            user.showCombatPopup = value;
            Core.Core.Instance.dataConnection.saveUser(user);
        }

        public void SetShowCombatFast(int userId, bool value)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            Core.User user = Core.Core.Instance.users[userId];

            user.showCombatFast = value;
            Core.Core.Instance.dataConnection.saveUser(user);
        }

        public string getUserDetails(int senderUserId, int targetUserId)
        {
            string ret = "";
            try
            {
                ret = (new User(senderUserId)).getUserDetails(targetUserId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public string geAllianceDetails(int senderUserId, int targetUserId)
        {
            string ret = "";
            try
            {
                ret = Alliance.getAllianceDetails(senderUserId, targetUserId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public string getShipData(int _userId, int? shipId)
        {
            string ret = "";
            try
            {
                ret = (new User(_userId)).getShipData(shipId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public string getShip(int _userId, int shipId)
        {           
            try
            {
                var Ship = SpacegameServer.Core.Core.Instance.ships[shipId];
                return Ship.ShipSerialized;               
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return null;
        }

        public string getPlanetSurfacefields(int userId, int planetId)
        {
            string ret = "";
            try
            {
                ret = (new User(userId)).getPlanetSurfacefields(planetId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public string getColonySurfacefields(int userId, int colonyId)
        {
            string ret = "";
            try
            {
                ret = (new User(userId)).getColonySurfacefields(colonyId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public string getSystemFields(int userId, int starId)
        {
            string ret = "";
            try
            {
                ret = (new User(userId)).getSystemFields(starId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }


        public void checkuserContact(int userId,
                int targetUserId,
                out string xml)
        {

            try
            {
                (new User(userId)).checkuserContact(userId,targetUserId,out xml);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
                xml = "";
            }
            return;
        }
        

        public int userCreateDemoUser(string userIp, string userLanguage)
        {
            int ret = 0;
            try
            {
                ret = SpacegameServer.Core.User.createDemoUser(userIp, userLanguage);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public bool UserExists(int userId)
        {
            return SpacegameServer.Core.Core.Instance.users.ContainsKey(userId);
        }

        public bool userRegisterUser(int userId, string startingRegion = null, bool demoMode = false)
        {
            bool ret = false;
            try
            {
                ret = SpacegameServer.Core.User.registerUser(userId, startingRegion, demoMode);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }


        public void userNewTurn(int _userId)
        {
            try
            {
                (new User(_userId)).userNewTurn();
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);                
            }
            return;
        }

        public string transfer(int _userID, string _transferXml)
        {
            string ret = "";
            try
            {
                ret = Transfer.transfer(_userID, _transferXml);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public string transfer2(int _userID, SpacegameServer.Core.Transfer transfer)
        {
            string ret = "";
            try
            {
                string result = "";
                SpacegameServer.Core.TransferGoods.transfer2(_userID, transfer, ref result);
                return result;
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public string BuildModules(int _userID, SpacegameServer.Core.Transfer modules)
        {
            string ret = "";
            try
            {
                string result = "";
                SpacegameServer.Core.Modules.BuildModules(_userID, modules, ref result);
                return result;
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;
        }

        public void Log( string message)
        {
            try
            {
                SpacegameServer.Core.Core.Instance.writeToLog(message);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        
        }


        public string GetTradeOffers()
        {
            string output = "";
            try
            {
                output = Trade.getTrade();
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return output;

        }


        public string CreateTrade(int userId, int senderId, int sendertype)
        {
            string output = "";
            try
            {
                //Trade.acceptTrade(userId, senderId, sendertype, tradeOfferIdInt, receiverId, receiverType, ref output);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return output;

        }

        public string acceptTrade(int userId, int senderId, int sendertype, int tradeOfferIdInt, int receiverId , int receiverType)
        {
            string output = "";
            try
            {
                Trade.acceptTrade(userId, senderId, sendertype, tradeOfferIdInt, receiverId, receiverType, ref output);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return output;

        }


        public void setLanguage(int userId, string languageShortName)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            try
            {
                Core.Core.Instance.users[userId].setLanguage(languageShortName);                   
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public void setRaster(int userId, bool value)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            try
            {
                Core.Core.Instance.users[userId].setRaster(value);                   
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public void setCoordinates(int userId, bool value)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            try
            {
                Core.Core.Instance.users[userId].setCoordinates(value);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public void setSystemNames(int userId, bool value)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            try
            {
                Core.Core.Instance.users[userId].setSystemNames(value);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public void setColonyNames(int userId, bool value)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            try
            {
                Core.Core.Instance.users[userId].setColonyNames(value);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public void setColonyOwners(int userId, bool value)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            try
            {
                Core.Core.Instance.users[userId].setColonyOwners(value);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public void setShipNames(int userId, bool value)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            try
            {
                Core.Core.Instance.users[userId].setShipNames(value);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public void setShipOwners(int userId, bool value)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            try
            {
                Core.Core.Instance.users[userId].setShipOwners(value);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }


        public void setShipMovement(int userId, bool value)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            try
            {
                Core.Core.Instance.users[userId].setShipMovement(value);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public void changeBrightness(int userId, byte value)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            try
            {
                Core.Core.Instance.users[userId].changeBrightness(value);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public void renameUser(int userId, string value)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            try
            {
                Core.Core.Instance.users[userId].renameUser(value);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public void ChangeProfileUrl(int userId, string value)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            try
            {
                Core.Core.Instance.users[userId].ChangeProfileUrl(value);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public void Besiege(int userId, int shipId)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            if (!Core.Core.Instance.ships.ContainsKey(shipId)) return;
            if (Core.Core.Instance.ships[shipId].userid != userId) return;

            Core.Core.Instance.ships[shipId].Besiege();
        }

        public void sendLastObjectDataAndLogout(int userId, int lastObjectType, int lastObjectId)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            try
            {
                Core.Core.Instance.users[userId].sendLastObjectDataAndLogout(lastObjectType, lastObjectId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public string trySetRelation(int userId, int diplEntId, int diplEntType, int relation)
        {
            string xml = "";
            if (!Core.Core.Instance.users.ContainsKey(userId)) return xml;
            try
            {
                xml = (new BC.User(userId, Core.Core.Instance.users[userId])).trySetRelation(userId, diplEntId, diplEntType, (SpacegameServer.Core.Relation)relation);               
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return xml;
        }

        public string setQuestComplete(int userId, int questId)
        {
            string xml = "";
            if (!Core.Core.Instance.users.ContainsKey(userId)) return xml;
            try
            {
                
                xml = (new BC.User(userId, Core.Core.Instance.users[userId])).setQuestComplete(userId, questId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return xml;
        }

        public void setQuestRead(int userId, int questId)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;

            var user = Core.Core.Instance.users[userId];

            if (!user.quests.Any(e => e.questId == questId)) return;
            var quest = user.quests.First(e => e.questId == questId);

            List<Lockable> elementsToLock = new List<Lockable>();
            elementsToLock.Add(quest);
            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return;
            }

            try
            {
                List<Core.UserQuest> UserQuestsToSave = new List<Core.UserQuest>();
                UserQuestsToSave.Add(quest);

                quest.isRead = true;

                Core.Core.Instance.dataConnection.SaveUserQuests(Core.Core.Instance, UserQuestsToSave);
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }

        }
        public string checkShipAtCommNode(int userId, int shipId, int comNodeId)
        {
            string xml = "";
            if (!Core.Core.Instance.users.ContainsKey(userId)) return xml;
            if (!Core.Core.Instance.ships.ContainsKey(shipId)) return xml;
            if (!Core.Core.Instance.commNodes.ContainsKey(comNodeId)) return xml;

            Core.User user = Core.Core.Instance.users[userId];
            Core.Ship ship = Core.Core.Instance.ships[shipId];
            Core.CommunicationNode node = Core.Core.Instance.commNodes[comNodeId];
            if (ship.userid != userId) return xml;

            try
            {
                xml = BC.Ship.checkShipAtCommNode(user, ship, node);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return xml;
        }

        public string sendCommNodeMessage(int userId, int commNodeId, string header, string body)
        {
            /*
             * <messages>
              <message>
                <id>6</id>
                <commNodeId>936</commNodeId>
                <sender>157</sender>
                <headline>Title</headline>
                <messageBody>Today, the Prokyon Syndicate was founded.&lt;br /&gt;We are a small group of traders living near the Algol 550 space station, which is at the coordinates 5000|5000.&lt;br /&gt;Our products will soon be available at that station. I can especially recommend our high quality Yttrium metal. &lt;br /&gt;In addition, we are offering trade treaties to all peaceful dwellers of this galaxy. &lt;br /&gt;&lt;br /&gt;&lt;br /&gt;Yours sincerely,&lt;br /&gt;&lt;br /&gt;Skratti,&lt;br /&gt;CEO Prokyon Syndicate</messageBody>
                <sendingDate>2015-06-23T05:43:02</sendingDate>
                <newMessage>0</newMessage>
              </message>
              <message>
                <id>9</id>
                <commNodeId>936</commNodeId>
                <sender>186</sender>
                <headline>Title</headline>
                <messageBody>Dear neighbours!&lt;br /&gt;Yesterday a plebiscite of the inhabitants of sector 4980/4980 to 5000/5000 ended with clear decision to close the borders of the sektor for security reasons.&lt;br /&gt;Also, a security zone of one field around the sector will be established.&lt;br /&gt;&lt;br /&gt;Any ship entering the zone without previous declaration of intention, flight plan, destination and onboard cargo will be regarded as a thread and thus treated.&lt;br /&gt;&lt;br /&gt;Expect the diplomatic status to be changed to hostile in near future so al potentialy inevitable actions can be taken, if necessary.&lt;br /&gt;This dont mean you have to fear any thread as long you stand clear of the borders and security zone.</messageBody>
                <sendingDate>2015-06-26T19:19:56</sendingDate>
                <newMessage>0</newMessage>
              </message>
            </messages>
             * */
            string xml = "";
            if (!Core.Core.Instance.users.ContainsKey(userId)) return xml;
            if (!Core.Core.Instance.commNodes.ContainsKey(commNodeId)) return xml;
            
            Core.User user = Core.Core.Instance.users[userId];
            Core.CommunicationNode node = Core.Core.Instance.commNodes[commNodeId];

            try
            {
                xml = (new BC.CommNode(node, user)).sendCommNodeMessages(header, body);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return xml;
        }

        public string getCommNodeMessage(int userId, int commNodeId, int from, int to)
        {
            
            string xml = "";
            if (!Core.Core.Instance.users.ContainsKey(userId)) return xml;
            if (!Core.Core.Instance.commNodes.ContainsKey(commNodeId)) return xml;

            Core.User user = Core.Core.Instance.users[userId];
            Core.CommunicationNode node = Core.Core.Instance.commNodes[commNodeId];

            try
            {
                xml = (new BC.CommNode(node, user)).getCommNodeMessages(from, to);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return xml;
        }

        public string getCombatMessages(int userId, int from, int to, int highestId)
        {

            string xml = "";
            if (!Core.Core.Instance.users.ContainsKey(userId)) return xml;
            Core.User user = Core.Core.Instance.users[userId];

            try
            {
                xml = (new BC.Message(user)).getCombatMessages(from, to, highestId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return xml;
        }

        public string getCombatRounds(int userId, int combatId)
        {

            string json = "";
            if (!Core.Core.Instance.users.ContainsKey(userId)) return json;
            Core.User user = Core.Core.Instance.users[userId];

            try
            {
                json = (new BC.Message(user)).getCombatMessageRounds(combatId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return json;
        }

        public void setAllMessageRead(int userId, int messageType)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            Core.User user = Core.Core.Instance.users[userId];

            try
            {
                (new BC.Message(user)).setAllMessageRead(messageType);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public string getReceivedMessages(
            int userId,
            int fromNr,       // fromNr  the earliest already received message 
            int toNr,        // toNr 50 means 50 messages more to read (towards the past)  -> from . to counts backwards (current messages are already loaded, so fetch older ones with this call)
            int lastMessageId, // The highest ID that the user already got (if he is currently fetching oler messages, unreceived newer ones should also be transferred
            int messageType)     // Filter for message type       
        {
            string xml = "";
            if (!Core.Core.Instance.users.ContainsKey(userId)) return xml;
            Core.User user = Core.Core.Instance.users[userId];

            try
            {
                xml = (new BC.Message(user)).getReceivedMessages(userId,fromNr, toNr, lastMessageId, messageType);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return xml;
        }

        public string getMessagesText(int userId, int messageId)
        {
            string xml = "";
            if (!Core.Core.Instance.users.ContainsKey(userId)) return xml;
            if (!Core.Core.Instance.messages.ContainsKey(messageId)) return xml;
            Core.User user = Core.Core.Instance.users[userId];

            try
            {
                xml = (new BC.Message(user)).getMessagesText(userId, messageId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return xml;
        }

        public string sendMessage(
            int userId,
            string header,
            string body,
            int id,
            int messageType,
            List<int> messageParticipantsInts)
        {
            string xml = "";
            if (!Core.Core.Instance.users.ContainsKey(userId)) return xml;
            Core.User user = Core.Core.Instance.users[userId];

            //check the incoming participants
            List<Core.MessageParticipants> messageParticipants = new List<Core.MessageParticipants>();
            foreach(var part in messageParticipantsInts)
            {
                if (!Core.Core.Instance.users.ContainsKey(part)) return xml;
                messageParticipants.Add(new Core.MessageParticipants(part));
            }

            try
            {
                //xml = (new BC.Message(user)).sendMessage(userId, addressee, header, body, id, messageType, messageParticipants);
                xml = (new BC.Message(user)).sendMessage(userId, header, body, id, messageType, messageParticipants);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return xml;
        }

        public string createAlliance(int userId, string allianceName)
        {
            string xml = "";

            if (!Core.Core.Instance.users.ContainsKey(userId)) return xml;
            Core.User user = Core.Core.Instance.users[userId];

            try
            {
                xml = BC.Alliance.createAlliance(user, allianceName);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return xml;
        }

        public string joinAlliance(int userId, int allianceId)
        {
            string xml = "";

            if (!Core.Core.Instance.users.ContainsKey(userId)) return xml;
            Core.User user = Core.Core.Instance.users[userId];

            try
            {
                xml = BC.Alliance.joinAlliance(user, allianceId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return xml;
        }

        public string leaveAlliance(int userId, int userToRemoveId, int allianceId)
        {
            string xml = "";

            if (!Core.Core.Instance.users.ContainsKey(userId)) return xml;
            Core.User user = Core.Core.Instance.users[userId];

            if (!Core.Core.Instance.users.ContainsKey(userToRemoveId)) return xml;
            Core.User userToRemove = Core.Core.Instance.users[userToRemoveId];

            try
            {
                xml = BC.Alliance.leaveAlliance(user, userToRemove, allianceId);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return xml;
        }

        public void inviteUserToAlliance(int senderId, int receiverId)
        {            
            if (!Core.Core.Instance.users.ContainsKey(senderId)) return;
            if (!Core.Core.Instance.users.ContainsKey(receiverId)) return;

            Core.User sender = Core.Core.Instance.users[senderId];
            Core.User receiver = Core.Core.Instance.users[receiverId];     

            try
            {
                SpacegameServer.Core.Alliance.inviteTo(sender, receiver);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void removeInviteToAlliance(int senderId, int receiverId)
        {            
            if (!Core.Core.Instance.users.ContainsKey(senderId)) return;
            if (!Core.Core.Instance.users.ContainsKey(receiverId)) return;

            Core.User sender = Core.Core.Instance.users[senderId];
            Core.User receiver = Core.Core.Instance.users[receiverId];     

            try
            {
                SpacegameServer.Core.Alliance.removeInvitation(sender, receiver);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void renameAlliance(int senderId, string newName)
        {
            if (!Core.Core.Instance.users.ContainsKey(senderId)) return;
            Core.User sender = Core.Core.Instance.users[senderId];


            try
            {
                SpacegameServer.Core.Alliance.renameAlliance(sender, newName);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }
        
        public void changeDescription(int senderId, string newName)
        {
            if (!Core.Core.Instance.users.ContainsKey(senderId)) return;
            Core.User sender = Core.Core.Instance.users[senderId];

            try
            {
                SpacegameServer.Core.Alliance.changeDescription(sender, newName);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void changeUserDescription(int senderId, string newName)
        {
            if (!Core.Core.Instance.users.ContainsKey(senderId)) return;
            Core.User sender = Core.Core.Instance.users[senderId];

            try
            {
                sender.Description = newName;
                Core.Core.Instance.dataConnection.saveUser(sender);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }


        public void saveFogString(int userId, string fogString, int fogVersion)
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return;
            Core.User user = Core.Core.Instance.users[userId];

            if( user.fogVersion >= fogVersion) return;

            user.fogVersion = fogVersion;
            user.fogString = fogString;

            Core.Core.Instance.dataConnection.userSaveFog(user);
            /*
            if (!Core.Core.Instance.users.ContainsKey(senderId)) return;
            Core.User sender = Core.Core.Instance.users[senderId];

            try
            {
                SpacegameServer.Core.Alliance.changeDescription(sender, newName);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLogFile(ex);
            }
            */
            return;
        }

        public string getFogString(int userId )
        {
            if (!Core.Core.Instance.users.ContainsKey(userId)) return "";
            Core.User user = Core.Core.Instance.users[userId];

            return user.fogString;            
        }

        public List<SpacegameServer.Core.GalacticEvents> GetGalacticEvents(int LastEventYet)
        {
            var Events = Core.Core.Instance.galactivEvents;
            if (!Events.Any(e => e.Key < LastEventYet)) return null;
            var Filtered = Core.Core.Instance.galactivEvents.Where(e => e.Key < LastEventYet);
            var OrderedSelected = Filtered.OrderBy(e => -e.Key).Select(e => e.Value);

            return OrderedSelected.Take(50).ToList();
        }

        public struct ships2
        {
            [XmlElement(ElementName = "ship")]
            public List<SpacegameServer.Core.Ship> ship;
        }

        public struct colonies2
        {
            [XmlElement(ElementName = "Colony")]
            public List<SpacegameServer.Core.Colony> colony;
        }

        public struct stars2
        {
            [XmlElement(ElementName = "star")]
            public List<SpacegameServer.Core.SystemMap> star;
        }
        
        public int respCode = 1;        

        public ships2 ships;
        public colonies2 colonies;
        public stars2 stars;
        public string combatLog;
        //combatLog
        public byte result;
    }
}
