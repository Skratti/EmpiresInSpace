using System;
using System.Collections.Generic;
using System.Linq;

namespace SpacegameServer.BC
{
    internal class User
    {

        SpacegameServer.Core.Core core;
        int userId;
        SpacegameServer.Core.User user;
        public User(int _userId, Core.User user = null)
        {
            userId = _userId;
            core = SpacegameServer.Core.Core.Instance;           
            this.user = user;
        }

        public string getPlanetSurfacefields( int planetId)
        {
            string ret = "";
            SpacegameServer.BC.XMLGroups.ColonySurface response = new XMLGroups.ColonySurface();
            
            if (core.planets.ContainsKey(planetId))
                response.surfaceTiles = core.planets[planetId].surfaceFields;

            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.ColonySurface>(response, ref ret, true);
            return ret;
        }

        public string getColonySurfacefields(int colonyId)
        {
            string ret = "";
            SpacegameServer.BC.XMLGroups.ColonyPlanets response = new XMLGroups.ColonyPlanets();

            response.planets.AddRange(core.planets.Where(e => e.Value.colonyId == colonyId).Select(e => new XMLGroups.ColonyPlanet(e.Value.id, e.Value, e.Value.surfaceFields)));



            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.ColonyPlanets>(response, ref ret, true);
            return ret;
        }

        public string getSystemFields(int starId)
        {
            string ret = "";
            SpacegameServer.BC.XMLGroups.StarSystemMap response = new XMLGroups.StarSystemMap();

            if (core.stars.ContainsKey(starId))
                response.SolarSystem = core.stars[starId].planets;

            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.StarSystemMap>(response, ref ret, true);
            return ret;
        }

        
        public string getUserData()
        {
            /*
           // Example of the output after serialization
             * <languages>
      <language>
         <id>0</id>
         <shortName>en</shortName>
         <longName>English</longName>
      </language>
      <language>
         <id>1</id>
         <shortName>de</shortName>
         <longName>Deutsch</longName>
      </language>
      <language>
         <id>2</id>
         <shortName>fr</shortName>
         <longName>Francais</longName>
      </language>
   </languages>
   <messageHighestId>3</messageHighestId>
   <unreadMessages>0</unreadMessages>
   <maxServerEventId>2218</maxServerEventId>
   <nextTurn>
      <targetTime>2014-12-14T18:55:52.057</targetTime>
   </nextTurn>


 <map>
      <staticMap>
         <star>
	<starId>23</starId>
            <xpos>4999</xpos>
            <ypos>5014</ypos>
            <type>3</type>
            <gif>RedSun_1.png</gif>
            <name>Capella 457</name>
            <size>24</size>
            <ressourceId>4</ressourceId>
         </star>
      </staticMap>
      <GalaxyMap>
         <id>1</id>
         <galaxyName>Starmap</galaxyName>
         <objectId>1</objectId>
         <size>10000</size>
      </GalaxyMap>
   </map>


<knownUsers>
      <knownUser>
         <id>6</id>
         <username>Demo user 000006</username>
         <currentRelation>1</currentRelation>
         <targetRelation>1</targetRelation>
         <otherUserRelationTowardsPlayer>1</otherUserRelationTowardsPlayer>
         <allianceId>0</allianceId>
         <popVicPoints>-1</popVicPoints>
         <researchVicPoints>-1</researchVicPoints>
         <goodsVicPoints>-1</goodsVicPoints>
         <shipVicPoints>-1</shipVicPoints>
         <overallVicPoints>1095</overallVicPoints>
         <overallRank>3</overallRank>
      </knownUser>


<allianceDiplomacy>
      <allianceDetail>
         <id>4</id>
         <name>Heroes</name>
         <allianceOwner>5</allianceOwner>
         <overallVicPoints>1708</overallVicPoints>
         <overallRank>1</overallRank>
      </allianceDetail>
      <allianceInvite>
         <userId>1</userId>
         <allianceId>4</allianceId>
      </allianceInvite>
   </allianceDiplomacy>



<commNodes>
      <commNode>
         <id>286</id>
         <owner>0</owner>
         <name>Space Station</name>
         <unformattedName>NoName</unformattedName>
         <positionX>4960</positionX>
         <positionY>4960</positionY>
         <systemX>0</systemX>
         <systemY>0</systemY>
         <connectionType>0</connectionType>
         <connectionId>1292</connectionId>
         <activ>1</activ>
         <visited>0</visited>
         <readAccess>0</readAccess>
         <writeAccess>0</writeAccess>
         <adminRights>0</adminRights>
         <informWhenNew>0</informWhenNew>
         <lastReadMessage>0</lastReadMessage>
         <messageCount>0</messageCount>
         <messageUnReadCount>0</messageUnReadCount>
      </commNode>
      <commNode>
         <id>287</id>
         <owner>0</owner>
         <name>Space Station</name>
         <unformattedName>NoName</unformattedName>
         <positionX>5000</positionX>
         <positionY>4960</positionY>
         <systemX>0</systemX>
         <systemY>0</systemY>
         <connectionType>0</connectionType>
         <connectionId>1293</connectionId>
         <activ>1</activ>
         <visited>0</visited>
         <readAccess>0</readAccess>
         <writeAccess>0</writeAccess>
         <adminRights>0</adminRights>
         <informWhenNew>0</informWhenNew>
         <lastReadMessage>0</lastReadMessage>
         <messageCount>0</messageCount>
         <messageUnReadCount>0</messageUnReadCount>
      </commNode>



<allowedBuildings>
      <allowedBuilding>
         <allowedBuildingId>3</allowedBuildingId>
      </allowedBuilding>


 <PlayerResearches>
      <PlayerResearch>
         <id>1</id>
         <researchable>0</researchable>
         <isCompleted>1</isCompleted>
         <investedResearchpoints>3</investedResearchpoints>
         <researchPriority>0</researchPriority>
      </PlayerResearch>


<ShipTemplates>
      <ShipTemplate>



 <Quests>
      <Quest>

<TradeOffers />

 <allowedModules>
      <allowedModule>

 <Colonies>
      <Colony>


 <Labels>
      <languageId>0</languageId>
      <Label>
         <id>1</id>
         <label>Orange dwarf star</label>
      </Label>



   <Colonies>
      <Colony>



            
            
            SpacegameServer.Core.User user = (SpacegameServer.Core.User)Core.Core.Instance.users[userId];
            if (user == null) return "";

            string temp = "";
            BusinessConnector.Serialize<Core.User>(user, ref temp, true);
            */


            BC.XMLGroups.userData userData = new BC.XMLGroups.userData();

            if (!Core.Core.Instance.users.ContainsKey(this.userId)) return "<user></user>";

            Core.User user = Core.Core.Instance.users[this.userId];

            userData.user = user;
            userData.knownUsers = XMLGroups.UserContacts.createAllContacts(user);

            //userData.languageShortName = user.languageShortName;
            userData.languages = Core.Core.Instance.languages.Where(e=>e!=null).ToList();

            
            userData.messageHighestId = 0;
            userData.unreadMessages = 0;
           
            
            if (Core.Core.Instance.messages.Values.Any(e => e.messageParticipants.Any(f => f.participant == this.userId)))
            {
                /*
                userData.messageHighestId = Core.Core.Instance.messages.Values.Where(e => e.messageParticipants.Any(f => f.participant == this.userId))
                .OrderByDescending(e => e.id).First().id;
                */
                userData.messageHighestId = Core.Core.Instance.messages.Values.OrderByDescending(e => e.id).First().id;
                userData.unreadMessages = Core.Core.Instance.messages.Values.Any(e => e.messageParticipants.Any(f => f.participant == this.userId && !f.read)) ? 1 : 0;
            }
            
            


            userData.maxServerEventId = (int)Core.Core.Instance.identities.galacticEvents.id;
            userData.allowedBuildings = XMLGroups.AllowedBuilding.createAllowedBuildings(user);
            userData.PlayerResearches = user.getPlayerResearch();
            userData.ShipHulls = XMLGroups.AllowedShipHulls.createAllowedShipHulls(user);
            userData.ShipTemplates = Core.Core.Instance.shipTemplate.Values.Where(e => e.userId == user.id).ToList();
            userData.Quests = user.quests;
            userData.allowedModules = XMLGroups.AllowedModule.createAllowedModules(user);

            userData.TradeOffers = new List<Core.TradeOffer>();
            /*
            

            
            userData.TradeOffers;
            */


            userData.allianceDiplomacy = XMLGroups.KnownAlliances.createAllianceContacts(user);
            userData.allianceRelations = XMLGroups.AllianceUserRelations.createAllianceUserRelations(user);
            userData.allianceInvites = XMLGroups.AllianceInvites.createAllianceInvites(user);            
            userData.ships = new List<Core.Ship>();
            
            var allColonies = new List<Core.Colony>();
            userData.commNodes = new XMLGroups.CommNodes();
            userData.commNodes.commNode = XMLGroups.CommNodes.createKnownAndNearNodesList(user);
            userData.staticMap = new XMLGroups.StaticMap();
            userData.staticMap.stars = new List<Core.SystemMap>();
            userData.staticMap.GalaxyMap = core.GalaxyMap;
            core.getUserScans(userId, null, ref userData.ships, ref userData.staticMap.stars, ref allColonies);
            userData.Colonies = Core.Colony.userScanCopy(allColonies,user.id);
            List<Core.Ship> transcensions =
            (from ship in core.ships
             where  ship.Value.shipTranscension != null
             select ship.Value).ToList();

            userData.ships.AddRange(transcensions.Except(userData.ships));
            
            //int startingHours = 4 - (DateTime.Now.Hour  % 4 );
            //DateTime nextTurn = DateTime.Now.AddHours(startingHours);
            DateTime nextTurn = SpacegameServer.Core.Core.nextTurnDateTime(DateTime.Now);

            userData.targetTime = nextTurn.ToString("yyyy-MM-ddTHH:mm:00");
            userData.unreadCombatMessages = core.combats.Any(e => e.Value.DefenderUserId == user.id && !e.Value.DefenderHasRead);

            userData.Labels = XMLGroups.Labels.GetLabels(user.language);

            string x = "";          
            BusinessConnector.Serialize<BC.XMLGroups.userData>(userData, ref x, true);
            return x;
        }

        public List<SpacegameServer.Core.SimpleField> getUserBordersData()
        {
            List<SpacegameServer.Core.Field> scanned;
            scanned = core.getUserScannedFields(userId, null);


            List<SpacegameServer.Core.SimpleField> scannedSmall = new List<SpacegameServer.Core.SimpleField>();
            foreach(var scannedField in scanned)
            {
                scannedSmall.Add(new SpacegameServer.Core.SimpleField(scannedField));
            }

            return scannedSmall;
        }


        public string getUserDetails(int targetUserId)
        {
            BC.XMLGroups.UserDetails relations = new BC.XMLGroups.UserDetails();

            if (!Core.Core.Instance.users.ContainsKey(this.userId)) return "<relations></relations>";
            if (!Core.Core.Instance.users.ContainsKey(targetUserId)) return "<relations></relations>";

            Core.User user = Core.Core.Instance.users[this.userId];
            Core.User targetUser = Core.Core.Instance.users[targetUserId];

            relations.description = targetUser.Description;
            relations.userId = targetUser.id;


            relations.relation = Core.Core.Instance.userRelations.getUserDiplomatics(user, targetUser);


            string x = "";
            //BusinessConnector.Serialize<BC.XMLGroups.UserDetails>(relations, ref x, true);
            x = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(relations);

            return x;
        }


        public string getShipData(int? shipId)
        {
            //userData userData = new userData();
            //userData.ships.ship = new List<Core.Ship>();

            BC.XMLGroups.userData userData = new BC.XMLGroups.userData();
            userData.ships = new List<Core.Ship>();           

            Core.Core core = Core.Core.Instance;

            //check if user exists:
            if (core.users.ContainsKey(userId))
            //if (userId >= 0 && userId < core.users.Length)
            {
                if (Core.Core.Instance.users[userId] != null)
                {
                    Core.User user = core.users[userId];    

                    //check ship parameter
                    if (shipId != null)
                    {
                        if (core.ships.ContainsKey((int)shipId))
                        //if (shipId >= 0 && shipId < core.ships.Length)
                        {                            
                            Core.Ship ship = core.ships[(int)shipId];
                            if (ship.userid == user.id)
                            {
                                //userData.ships.ship.Add(ship);
                                userData.ships.Add(ship); 
                            }                            
                        }
                    }
                    else
                    {
                        //userData.ships.ship = user.ships;
                        userData.ships = user.ships;
                    }
                }
            }



            
            string x = "";
            BusinessConnector.Serialize<BC.XMLGroups.userData>(userData, ref x, true);

            return x;
        }

        /// <summary>
        /// if a user creates an account, other user sessions may ask about contact data
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="targetUserId"></param>
        /// <param name="targetShipId"></param>
        /// <param name="targetColonyId"></param>
        /// <param name="userShipId"></param>
        /// <param name="userColonyId"></param>
        /// <param name="xml"></param>
        public void checkuserContact(int userId,
                int targetUserId,
                out string xml)
        {
            xml = "<result>2</result>"; //fail

            if(!Core.Core.Instance.users.ContainsKey(userId)) return;
            Core.User user = Core.Core.Instance.users[userId];

            if (!Core.Core.Instance.users.ContainsKey(targetUserId)) return;
            Core.User targetUser = Core.Core.Instance.users[targetUserId];

            SpacegameServer.BC.XMLGroups.UserContacts knownUsers =
                SpacegameServer.BC.XMLGroups.UserContacts.createContact(user, targetUser);

            BusinessConnector.Serialize<BC.XMLGroups.UserContacts>(knownUsers, ref xml, true);                
            
        }


        public void userNewTurn()
        {
            SpacegameServer.Core.TurnSummary ts = new SpacegameServer.Core.TurnSummary(core);
            SpacegameServer.Core.User user = core.users[userId];
            ts.calc(user);
        }

        /*
         * 
        
        Research of "Space Travel" allows shipyard and scout hull
        -> Returns the two follow up researhces with "researchable" set
        -> Returns old quests (which is wrong) 
           + current quest (which might be set to completed)
           + 2 new quests (which will be loaded and shown)
         * 
        <ResearchDone>
            <Researches>
                <PlayerResearch>
                    <id>501</id>
                    <label>585</label>
                    <descriptionLabel>585</descriptionLabel>
                    <objectimageUrl>1.gif</objectimageUrl>
                    <cost>15</cost>
                    <researchable>1</researchable>
                    <isCompleted>0</isCompleted>
                    <investedResearchpoints>0</investedResearchpoints>
                    <researchPriority>0</researchPriority>
                </PlayerResearch>
                <PlayerResearch>
                    <id>4002</id>
                    <label>553</label>
                    <descriptionLabel>558</descriptionLabel>
                    <objectimageUrl>1.gif</objectimageUrl>
                    <cost>11</cost>
                    <researchable>1</researchable>
                    <isCompleted>0</isCompleted>
                    <investedResearchpoints>0</investedResearchpoints>
                    <researchPriority>0</researchPriority>
                </PlayerResearch>
            </Researches>
            <Quest>
                <userId>1400</userId>
                <questId>1</questId>
                <isRead>1</isRead>
                <isCompleted>1</isCompleted>
                <hasScript>1</hasScript>
                <script>Welcome.js</script>
                <label>103</label>
            </Quest>
            <Quest>
                <userId>1400</userId>
                <questId>2</questId>
                <isRead>1</isRead>
                <isCompleted>1</isCompleted>
                <hasScript>1</hasScript>
                <script>ShortOverview.js</script>
                <label>104</label>
            </Quest>
            <Quest>
                <userId>1400</userId>
                <questId>3</questId>
                <isRead>1</isRead>
                <isCompleted>0</isCompleted>
                <hasScript>1</hasScript>
                <script>Movement.js</script>
                <label>116</label>
            </Quest>
            <Quest>
                <userId>1400</userId>
                <questId>21</questId>
                <isRead>0</isRead>
                <isCompleted>0</isCompleted>
                <hasScript>1</hasScript>
                <script>ShipModulePlant.js</script>
                <label>254</label>
            </Quest>
            <Quest>
                <userId>1400</userId>
                <questId>22</questId>
                <isRead>0</isRead>
                <isCompleted>0</isCompleted>
                <hasScript>1</hasScript>
                <script>Spaceport.js</script>
                <label>112</label>
            </Quest>
            <allowedBuildings>
                <allowedBuilding>
                    <allowedBuildingId>17</allowedBuildingId>
                </allowedBuilding>
            </allowedBuildings>
            <ShipHulls>
                <ShipHull>
                    <shipHullId>1</shipHullId>
                </ShipHull>
            </ShipHulls>
            <allowedModules />
        </ResearchDone>
        
             * */

        /*
         * 
        <ResearchDone>
          <Researches>
            <PlayerResearch>
              <id>501</id>
              <researchable>1</researchable>
              <isCompleted>1</isCompleted>
              <investedResearchpoints>0</investedResearchpoints>
              <researchPriority>0</researchPriority>
            </PlayerResearch>
            <PlayerResearch>
              <id>4002</id>
              <researchable>1</researchable>
              <isCompleted>1</isCompleted>
              <investedResearchpoints>0</investedResearchpoints>
              <researchPriority>0</researchPriority>
            </PlayerResearch>
          </Researches>
          <Quest>
            <UserQuest>
              <userId>1</userId>
              <questId>21</questId>
              <isRead>false</isRead>
              <isCompleted>false</isCompleted>
              <hasScript>1</hasScript>
              <script>ShipModulePlant.js</script>
              <label>254</label>
            </UserQuest>
            <UserQuest>
              <userId>1</userId>
              <questId>22</questId>
              <isRead>false</isRead>
              <isCompleted>false</isCompleted>
              <hasScript>1</hasScript>
              <script>Spaceport.js</script>
              <label>112</label>
            </UserQuest>
          </Quest>
          <allowedBuildings>
            <allowedBuilding>
              <allowedBuildingId>17</allowedBuildingId>
            </allowedBuilding>
          </allowedBuildings>
          <ShipHulls>
            <ShipHull>
              <shipHullId>1</shipHullId>
            </ShipHull>
          </ShipHulls>
        </ResearchDone>
         * 
         * */
        public string doResearch2(int researchId)
        {
            SpacegameServer.Core.User user = core.users[this.userId];
            List<SpacegameServer.Core.UserQuest> NewQuests = new List<SpacegameServer.Core.UserQuest>();  
            user.doResearch2(researchId, ref NewQuests);

            string ret = "";
            
            //fetch all things now available by the new research
            var AllNewItems = Core.ResearchQuestPrerequisite.AvailableQRB(user, 1, researchId);

            SpacegameServer.BC.XMLGroups.ResearchDone ResearchDone = SpacegameServer.BC.XMLGroups.ResearchDone.createResearchDone(user, AllNewItems, ref NewQuests);

            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.ResearchDone>(ResearchDone, ref ret, true);

            return ret;         
        }

        public string ChooseSpecialization(string[] researchs)
        {
            SpacegameServer.Core.User user = core.users[this.userId];
            List<SpacegameServer.Core.UserQuest> NewQuests = new List<SpacegameServer.Core.UserQuest>();

            List<SpacegameServer.Core.Research> researchIds = new List<SpacegameServer.Core.Research>();
            
            //check that all researchs are Id of spececializationResearchs
            foreach (var entry in researchs)
            {
                if (entry == "") continue;
                int result;
                if (!Int32.TryParse(entry, out result)) return "";
                if (!SpacegameServer.Core.Core.Instance.Researchs.sparseContainsIndex(result)) return "";

                var Research = Core.Core.Instance.Researchs[result];
                if (Research.researchType != 10) return "";
                researchIds.Add(Research);
            }

            if (!user.ChooseSpecialization(researchIds)) return "";

            string ret = "";

            //create a list of all possible follow-up researches. These might not fulfill other requirements...
            List<Core.ResearchQuestPrerequisite> AllNewResearchs = Core.Core.Instance.ResearchQuestPrerequisites.Where(e => e.SourceType == 1 && researchIds.Any(rId => rId.id == e.SourceId) && e.TargetType == 1).ToList();

            // Prüfe Vorbedingungen (andere Forschungen, Quests, Rohstoffe) ob diese Forschung erlaubt ist 
            List<Core.ResearchQuestPrerequisite> FilteredNewResearchs = new List<Core.ResearchQuestPrerequisite>();
            foreach (Core.ResearchQuestPrerequisite Follower in AllNewResearchs)
            {
                Core.Research TargetResearch = Core.Core.Instance.Researchs[Follower.TargetId];                
                if (!user.canResearch(TargetResearch)) continue;
                FilteredNewResearchs.Add(Follower);
            }

            SpacegameServer.BC.XMLGroups.ResearchDone ResearchDone = SpacegameServer.BC.XMLGroups.ResearchDone.createResearchDone(user, FilteredNewResearchs, ref NewQuests);

            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.ResearchDone>(ResearchDone, ref ret, true);

            return ret;
        }


        public string setQuestComplete(int userId, int questId)
        {
            string xml = "";

            
            SpacegameServer.Core.User user = core.users[userId];

            if (user.quests.Any(e => e.questId == questId && e.isCompleted)) return xml;

            Core.UserQuest.completeQuest(user, questId);

            BC.XMLGroups.Quests Quests = new XMLGroups.Quests();
            Quests.Quest = user.quests;
            Quests.allowedBuildings = new List<XMLGroups.AllowedBuilding>();

            BusinessConnector.Serialize<BC.XMLGroups.Quests>(Quests, ref xml, true);
            //gib alle unfertigen(neuen) Quests raus und die aktuell beendete. ToDo: könnte eingeschränkt werden auf die gerade fertiggestellten.ToDo2: auch die neuen Gebäude rausgeben, und die neue Forschung
            //und neue gebäude
            return xml;
        }

        public string trySetRelation(int userId, int diplEntId, int diplEntType, SpacegameServer.Core.Relation relation)
        {
            string xml = "";            
            List<SpacegameServer.Core.DiplomaticRelation> changes = new List<SpacegameServer.Core.DiplomaticRelation>();
            
            
            Core.Core.Instance.userRelations.trySetRelation(userId, diplEntId, diplEntType, relation, changes);
            
            //get all contacts of this user:
            //toDo: better would be to only fetch contacts that changed due to the newRelations
            BC.XMLGroups.ChangeRelation ChangeRelation = new XMLGroups.ChangeRelation();
            ChangeRelation.ships = new List<Core.Ship>();

            //fill xml data
            ChangeRelation.knownUsers = SpacegameServer.BC.XMLGroups.UserContacts.createContacts(user, 0);
            ChangeRelation.allianceRelations = SpacegameServer.BC.XMLGroups.AllianceUserRelations.createAllianceUserRelations(user);            
            if (relation == 0)
            {
                List<SpacegameServer.Core.SystemMap> stars = new List<Core.SystemMap>();
                List<SpacegameServer.Core.Colony> colonies = new List<Core.Colony>();

                Core.Core.Instance.getUserScans(userId, null, ref ChangeRelation.ships, ref stars, ref colonies);
            }

            BusinessConnector.Serialize<BC.XMLGroups.ChangeRelation>(ChangeRelation, ref xml, true);

            //BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.StarSystemMap>(response, ref ret, true);
            return xml;
        }

    }

}

