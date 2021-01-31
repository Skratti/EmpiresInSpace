using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{



    public partial class User : Lockable, AllLockable, DiplomaticEntity
    {
        const int _diplomaticType = 1;

        
        /*double constructionRatio ;
        double industrieRatio ;
        double researchRatio;
        */


        private Group _group;

        [System.Xml.Serialization.XmlIgnore]
        public Group group { get { return _group; } set { _group = value; } }

        protected static int lockAll = 0;

        [System.Xml.Serialization.XmlIgnore]
        public int diplomaticType
        {
            get
            {
                return _diplomaticType;
            }
            set
            {
            }
        }

        public int GetEntity()
        {
            if (this.allianceId != 0) return Core.Instance.alliances[this.allianceId].GetHashCode();
            return this.GetHashCode();

        }

        public override int GetHashCode()
        {
            int diplomaticTypeCode = (diplomaticType << 21);
            int hash = diplomaticTypeCode ^ id;
            return hash;
            
        }
        public Rights getMemberRight(DiplomaticEntity x)
        {
            if (this.group == null) return Rights.fullRights(this.id);
            return this.group.getMemberRight(this);
        }
        public List<DiplomaticEntity> GetAllEntities()
        {
            return getMembers();
        }

        public List<DiplomaticEntity> getMembers()
        {
            var thisUser = new List<DiplomaticEntity>(); 
            thisUser.Add(this); 
            return thisUser;            
        }

        public List<User> getUsers()
        {
            var thisUser = new List<User>();
            thisUser.Add(this); // this.members.Select(member => (User)member).ToList();
            return thisUser;
        }


        public static bool setLockAll()
        {
            if (0 == System.Threading.Interlocked.Exchange(ref lockAll, 1)) return true;
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

        public static System.Data.DataTable createDataTable()
        {
            var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            DataColumn column;
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "id";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.String");
            column.ColumnName = "username";
            dataTable.Columns.Add(column);
            /*
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.String");
            column.ColumnName = "player_ip";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.String");
            column.ColumnName = "user_ip";
            dataTable.Columns.Add(column);
            */
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Boolean");
            column.ColumnName = "activity";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Boolean");
            column.ColumnName = "locked";
            dataTable.Columns.Add(column);


            column = new DataColumn();
            column.DataType = System.Type.GetType("System.String");
            column.ColumnName = "user_session";
            dataTable.Columns.Add(column);


            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Boolean");
            column.ColumnName = "showRaster";
            dataTable.Columns.Add(column);


            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Boolean");
            column.ColumnName = "moveShipsAsync";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "homeCoordX";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "homeCoordY";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "language";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.DateTime");
            column.ColumnName = "loginDT";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "lastSelectedObjectType";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "lastSelectedObjectId";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Boolean");
            column.ColumnName = "showSystemNames";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Boolean");
            column.ColumnName = "showColonyNames";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Boolean");
            column.ColumnName = "showCoordinates";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Boolean");
            column.ColumnName = "showcolonyowner";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Boolean");
            column.ColumnName = "showColonyOwners";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Boolean");
            column.ColumnName = "showShipNames";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Boolean");
            column.ColumnName = "showShipOwners";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "researchPoints";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Byte");
            column.ColumnName = "scanRangeBrightness";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Decimal");
            column.ColumnName = "constructionRatio";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Decimal");
            column.ColumnName = "industrieRatio";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Decimal");
            column.ColumnName = "foodRatio";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int64");
            column.ColumnName = "versionId";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "popVicPoints";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "researchVicPoints";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "goodsVicPoints";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "shipVicPoints";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "overallVicPoints";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "overallRank";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.String");
            column.ColumnName = "player_ip";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.String");
            column.ColumnName = "description";
            dataTable.Columns.Add(column);

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "lastReadGalactivEvent");
            dataTable.AddColumn(System.Type.GetType("System.String"), "ProfileUrl");

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "showCombatPopup");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "showCombatFast");

            return dataTable;
        }

        public object createData()
        {
            this.versionId++;
            return new
            {
                this.id
                , this.username
                , activity = (object)this.activity ?? DBNull.Value
                , locked = (object)this.locked ?? DBNull.Value
                , user_session = (object)this.user_session ?? DBNull.Value
                , this.showRaster
                , this.moveShipsAsync
                , this.homeCoordX
                , this.homeCoordY
                , this.language,
                //logindt = (object)this.logindt ?? DBNull.Value,
                logindt = (object)DBNull.Value,
                lastSelectedObjectType = (object)this.lastSelectedObjectType ?? DBNull.Value,
                lastSelectedObjectId = (object)this.lastSelectedObjectId ?? DBNull.Value,

                this.showSystemNames
                , this.showColonyNames
                , this.showCoordinates
                , this.showColonyOwners
                , this.showShipNames
                , this.showShipOwners

                , this.researchPoints
                , this.scanRangeBrightness

                , constructionRatio = 1.0
                , industrieRatio = 1.0
                , foodRatio = 1.0
                , this.versionId

                , this.popVicPoints
                , this.researchVicPoints
                , this.goodsVicPoints
                , this.shipVicPoints
                , this.overallVicPoints
                , this.overallRank
                , this.player_ip
                , description = this.Description
                , lastReadGalactivEvent = this.LastReadGalactivEvent
                , this.ProfileUrl
                , showCombatPopup = this.showCombatPopup ? 1 : 0
                , showCombatFast = this.showCombatFast ? 1 : 0
            };
        }

        public static void turnSummaryRatio()
        {
            var users = Core.Instance.users;
            foreach (var user in users)
            {
                user.Value.calcRatio();
                //calc production ratio
                //users.Value.turnSummary();
            }
        }


        public void calcRatio()
        {
            double startingFleet = 25;

            int housing = 0;
            int energy = 0;
            int construction = 0; //percentage of (additional) construction
            int industrie = 0;
            int food = 0;
            int research = 0;

            foreach (var userResearch in this.PlayerResearch)
            {

                var researchGain = Core.Instance.Researchs[userResearch.researchId].ResearchGain;
                if (researchGain == null) continue;

                energy += researchGain.energy;
                housing += researchGain.housing;
                startingFleet += researchGain.fleetCount;
                construction += researchGain.construction;
                industrie += researchGain.industrie;
                food += researchGain.food;
                research += researchGain.research;
            }

            double fleetCount = 0;
            foreach( var ship in this.ships)
            {
                fleetCount += Core.Instance.ShipHulls[ship.hullid].modulesCount;
            }

            //fleetSupport are the additional costs produced by having too many ships
            double fleetSupport = (fleetCount - startingFleet) / startingFleet; // 12 - 25 / 25 => OK   30 - 25 / 25 => 0.2 usw => 0.2 = 20% less production...
            fleetSupport = Math.Max(fleetSupport, 0);

            double constructionRatio = (1.0 + (construction / 100.0)) - fleetSupport;
            this.assemblyRatio = Math.Max(constructionRatio, 0);

            double industrieRatio = (1.0 + (industrie / 100.0)) - fleetSupport;
            this.industrieRatio = Math.Max(industrieRatio, 0);

            double foodRatio = (1.0 + (food / 100.0)) - fleetSupport;
            this.foodRatio = Math.Max(foodRatio, 0);

            double energyRatio = (1.0 + (energy / 100.0));
            this.energyRatio = Math.Max(energyRatio, 0);

            double housingRatio = (1.0 + (energy / 100.0));
            this.housingRatio = Math.Max(housingRatio, 0);

        }

        public double getModifier(short goodsId)
        {
            switch(goodsId)
            {
                case 6: //energy
                    return this.energyRatio;
                case 7: //energy
                    return this.assemblyRatio;
                default:
                    return 1.0;
            }

        }
        public SpacegameServer.Core.ShipTemplate getTemplate(int templateId, bool obs = false){
            Core core = Core.Instance;
            SpacegameServer.Core.ShipTemplate original = core.shipTemplate[templateId];
            SpacegameServer.Core.ShipTemplate newTemplate = original.clone();
            newTemplate.userId = this.id;
            newTemplate.versionId = 0;
            if (obs)
            {
                newTemplate.amountbuilt = 1;
                newTemplate.obsolete = true;
            }
            core.shipTemplate[newTemplate.id] = newTemplate;
            List<AsyncSaveable> elementsToSave = new List<AsyncSaveable>();
            elementsToSave.Add(newTemplate);
            core.dataConnection.saveAsync(elementsToSave);
            return newTemplate;
        }

        public bool hasResearch(int researchToCheck)
        {
            //ToDO: research in _userResearchs is always completed, since we do not queue anymore
            foreach (var research in this._userResearchs)
            {
                if (research.researchId == researchToCheck) return true;
            }

            //foreach(Core.Instance.ResearchQuestPrerequisites
            return false;

            
        }
        public bool hasResearch(Research researchToCheck)
        {            
            return hasResearch(researchToCheck.id);
        }

        public bool hasPreRequisite(ResearchQuestPrerequisite prerequisite)
        {
            //check 1 : Research
            if (prerequisite.SourceType == 1)
            {
                if (!hasResearch(prerequisite.SourceId)) return false;
            }

            //check 6 : Special ressource
            if (prerequisite.SourceType == 6)
            {
                var allGoods = from colony in this.colonies
                               from good in colony.goods
                               where good.goodsId == prerequisite.SourceId
                               select prerequisite.SourceId;
                var goodCount = allGoods.Count();

                if (goodCount == 0) return false;
            }

            return true;
        }

        public bool hasGameObjectEnabled(short targetType, short targetId)
        {
            /* //targetType : 
             *  1 Forschung	
                2 Quest		- benötigt 2 Quest und/oder 1 Forschung (und auch nicht angezeigt Quests -> 'zufälliges Entdecken von Anomalien') und/oder Auftraggeber
			                - kann gebunden sein an Kolonie oder Schiff eines Spielers
			                - ermöglicht Quest, Forschung, Gebäude, Waren (wenn gebunden an Spielerobjekt)
                3 Gebäude
                4 Schiffsmodule
                5 Schiffsrümpfe 
                6 Ressources  - only as SourceType -> these are needed for special ressources.
             * */

            var researchPrerequisites = from prerequisite in Core.Instance.ResearchQuestPrerequisites
                                        where prerequisite.TargetType == targetType && prerequisite.TargetId == targetId
                                        select prerequisite;

            bool prerequisiteExists = false;
            foreach (var prerequisite in researchPrerequisites)
            {
                prerequisiteExists = true;
                if (!hasPreRequisite(prerequisite)) return false;
            }

            return prerequisiteExists;
        }        

        public bool hasModuleResearch(Module module){
            /*
             *  1 Forschung	
                2 Quest		- benötigt 2 Quest und/oder 1 Forschung (und auch nicht angezeigt Quests -> 'zufälliges Entdecken von Anomalien') und/oder Auftraggeber
			                - kann gebunden sein an Kolonie oder Schiff eines Spielers
			                - ermöglicht Quest, Forschung, Gebäude, Waren (wenn gebunden an Spielerobjekt)
                3 Gebäude
                4 Schiffsmodule
                5 Schiffsrümpfe 
                6 Ressources  - only as SourceType -> these are needed for special ressources.
             * */
            var researchPrerequisites = from prerequisite in Core.Instance.ResearchQuestPrerequisites
                                        where prerequisite.TargetType == 4 && prerequisite.TargetId == module.id
                                        select prerequisite;

            foreach (var prerequisite in researchPrerequisites)
            {
                if (!hasPreRequisite(prerequisite)) return false;
            }

            return true;
        }


        public bool CanColonize(Colonizable planet){
            if (planet.ObjectId == 24 ||
                planet.ObjectId == 25 ||
                planet.ObjectId == 26 ||
                planet.ObjectId == 34 ||
                planet.ObjectId == 35 ||
                planet.ObjectId == 36) return true;

            //desert
            if (planet.ObjectId == 27 || planet.ObjectId == 38)
            {
                if (this.hasResearch(300))
                {
                    return true;
                }
                return false;
            }

            //arctic
            if (planet.ObjectId == 28 || planet.ObjectId == 39)
            {
                if (this.hasResearch(301))
                {
                    return true;
                }
                return false;
            }

            //barren
            if (planet.ObjectId == 29 || planet.ObjectId == 40)
            {
                if (this.hasResearch(302))
                {
                    return true;
                }
                return false;
            }

            //asteroid
            if (planet.ObjectId == 44)
            {
                if (this.hasResearch(303))
                {
                    return true;
                }
                return false;
            }

            //vulcanic
            if (planet.ObjectId == 30 || planet.ObjectId == 41)
            {
                if (this.hasResearch(304))
                {
                    return true;
                }
                return false;
            }

            //toxic
            if (planet.ObjectId == 31 || planet.ObjectId == 42)
            {
                if (this.hasResearch(305))
                {
                    return true;
                }
                return false;
            }

            return false;
        }

        //ToDo: Unit test - mock as learned ;)
        public bool canResearch(Research research)
        {
            var researchPrerequisites = from prerequisite in Core.Instance.ResearchQuestPrerequisites 
                                            where prerequisite.TargetType == 1 && prerequisite.TargetId == research.id
                                        select prerequisite;

            foreach (var prerequisite in researchPrerequisites)
            {
                //check 1 : Research
                if (prerequisite.SourceType == 1)
                {
                    if (!hasResearch(prerequisite.SourceId)) return false;
                }

                //check 6 : Special ressource
                if (prerequisite.SourceType == 6)
                {
                    var allGoods = from colony in this.colonies 
                                   from good in colony.goods
                                   where good.goodsId == prerequisite.SourceId
                                   select prerequisite.SourceId;
                    var goodCount = allGoods.Count();

                    if (goodCount == 0) return false;
                }
            }

            return true;
        }


        public bool doResearch( int researchId, ref string xml)
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;

            var isFirstResearcher = !core.users.Any(user => user.Value.PlayerResearch.Any(research => research.researchId == researchId && research.isCompleted == 1));
                     
            List<Lockable> elementsToLock = new List<Lockable>(4);
            elementsToLock.Add(this);

            /*
            //ToDO when research is implemented in c#
            // lock colony buildings that get updated
            var Research = core.Researchs[researchId];
            if (researchId = 30 || researchId == 31)
            {

            }
            */
            if (!LockingManager.lockAllOrSleep(elementsToLock))
                return false;

            try
            {

                //Refactoring needed sql -> c#
                // First refactor the caller, generate the xml by c#
                
                // Prüfe Vorbedingungen (andere Forschungen, Quests, Rohstoffe) ob diese Forschung erlaubt ist 
                
                
                // Check if enough Research points are available

                //insert into UserResearch

                //Reduce RP on user

                //Reduce overall cost of this research

                //Add new quests into [UserQuests]

                //Update buildings if colony center is autoupdated by research

                //create XML containing:
                /*
                @newResearches,
			    @quests,
			    @newBuildings,
			    @ShipHullXML,
			    @knownModules
                 * */

                Core.Instance.dataConnection.doResearch(this.id, researchId, ref xml);

                // get colony data (goods, later population (colony ships))
                //refresh: dbo.UserResearch, Users.researchPoints, [dbo].[UserQuests], 
                core.dataConnection.getUsers(core, this.id);
                core.dataConnection.getUserResearches(core, this);
                core.dataConnection.getUserQuests(core, this);
                //Core.Instance.dataConnection.getColonyStock(core, colony);

                (new TurnSummary(core)).researchSpread(core); //Todo recalc only the current research
                SpacegameServer.BC.GameData.recalcGameData();

            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }

            if (isFirstResearcher && this.PlayerResearch.Any(research => research.researchId == researchId && research.isCompleted == 1))
            {
                GalacticEvents.AddNewEvent(GalacticEventType.FirstResearch, int1: this.id, int2:researchId);
            }
           
         
            return true;
        }



        public bool doResearch2(int researchId, ref List<UserQuest> NewQuests)
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;

            var isFirstResearcher = !core.users.Any(user => user.Value.PlayerResearch.Any(research => research.researchId == researchId && research.isCompleted == 1));

            //get target Research
            if (Core.Instance.Researchs.Length < researchId || Core.Instance.Researchs[researchId] == null) return false;
            Research TargetResearch = Core.Instance.Researchs[researchId];

            // Prüfe Vorbedingungen (andere Forschungen, Quests, Rohstoffe) ob diese Forschung erlaubt ist 
            if (!this.canResearch(TargetResearch)) return false;

            // Check if enough Research points are available
            if (this.researchPoints < TargetResearch.cost) return false;

            //create new UserResearch
            UserResearch NewUserResearch = new UserResearch(this.id, (short)researchId);
            NewUserResearch.isCompleted = 1;
            NewUserResearch.research = TargetResearch;

            List<Lockable> elementsToLock = new List<Lockable>(4);
            elementsToLock.Add(this);
            elementsToLock.Add(TargetResearch);
            /*
            //ToDO when research is implemented in c#
            // lock colony buildings that get updated
            var Research = core.Researchs[researchId];
            if (researchId = 30 || researchId == 31)
            {

            }
            */
            if (!LockingManager.lockAllOrSleep(elementsToLock))
                return false;

            try
            {
                //Reduce RP on user
                this.researchPoints -= TargetResearch.cost;

                //add the playerResearch
                this.PlayerResearch.Add(NewUserResearch);

                //Reduce overall cost of this research
                TargetResearch.RecalcCosts();

                //fetch all things now available by the new research
                var AllNewItems = ResearchQuestPrerequisite.AvailableQRB(this, 1, researchId);

                //Add new quests into [UserQuests]              
                foreach (var newItem in AllNewItems)
                {
                    //choose quests that are not already in the userQuests (for users having marked all quests as completed at the start)
                    if (newItem.TargetType == 2 && !this.quests.Any(e=>e.questId == newItem.TargetId))
                    {
                        UserQuest newQuest = new UserQuest();
                        newQuest.userId = this.id;
                        newQuest.questId = newItem.TargetId;
                        newQuest.isCompleted = false;
                        newQuest.isRead = false;
                        NewQuests.Add(newQuest);                      
                    }
                }

                //Update buildings if colony center is autoupdated by research

                //save:
                // executed PlayerResearch
                // User
                // new User quests
                // (later) Building , due to the colony center update
                // Research, due to changed costs
                List<UserResearch> AllNewUserResearchs = new List<UserResearch>(1);
                AllNewUserResearchs.Add(NewUserResearch);
                core.dataConnection.SaveUserResearch(core, this,  AllNewUserResearchs, NewQuests);

                //cost of the research may have changed, so update cost on research
                core.dataConnection.saveResearch(core, TargetResearch);

                //update GameData (cashed xml of all game data), so that new Logins can directly use it...
                SpacegameServer.BC.GameData.recalcGameData();

            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }

            if (isFirstResearcher && this.PlayerResearch.Any(research => research.researchId == researchId && research.isCompleted == 1))
            {
                GalacticEvents.AddNewEvent(GalacticEventType.FirstResearch, int1: this.id, int2: researchId);
            }


            return true;
        }

        public bool ChooseSpecialization(List<SpacegameServer.Core.Research> researchIds)
        {            
            SpacegameServer.Core.Core Core = SpacegameServer.Core.Core.Instance;            

            //check which SpecGroup to use, and check that all researchs are of this group
            SpecializationGroup Group = null;
            foreach (var research in researchIds)
            {
                if (!research.IsSpecification()) return false;

                if (Group == null)
                {
                    Group = Core.SpecializationGroups.First(group=>group.SpecializationResearches.Any(SpecResearch=>SpecResearch.ResearchId == research.id));
                }
                else
                {
                    SpecializationGroup NewGroup = Core.SpecializationGroups.First(group=>group.SpecializationResearches.Any(SpecResearch=>SpecResearch.ResearchId == research.id));
                    if (Group.Id != NewGroup.Id ) return false;
                }                
            }
            
            //check that slots are available:  (SpecGroup.count - userResearchs ) >= researchs.count
            //First count userResearchs belonging to the group
            int PicksTaken = this.PlayerResearch.Count(PlayerResearch=> Group.SpecializationResearches.Any(SpecResearch=>SpecResearch.ResearchId ==  PlayerResearch.researchId ));
            var AvailablePicks = Group.Picks - PicksTaken;
            if (AvailablePicks < researchIds.Count) return false;

            //check that the choosen researchs are not already choosen
            if (this.PlayerResearch.Any(pr=> researchIds.Any(rId=>rId.id== pr.researchId) )) return false;


            //everything ok, lock the user and add the specialization-researchs
            //and lock the alliiance in case that the user is member of one...

            List<Lockable> elementsToLock = new List<Lockable>(4);
            elementsToLock.Add(this);

            if (this.allianceId != 0) 
            { 
                elementsToLock.Add(Core.Instance.alliances[this.allianceId]); 
            }


            if (!LockingManager.lockAllOrSleep(elementsToLock))
                return false;

            //just pick the researchs
            List<UserResearch> AllNewUserResearchs = new List<UserResearch>();
            foreach (var research in researchIds)
            {
                UserResearch NewUserResearch = new UserResearch(this.id, (short)research.id);
                NewUserResearch.isCompleted = 1;
                NewUserResearch.research = research;
                this.PlayerResearch.Add(NewUserResearch);
                AllNewUserResearchs.Add(NewUserResearch);

                //remove secondary research from player (if he have one)
                var Spec = research.GetSpecification();
                if (Spec.SecondaryResearchId != null)
                {
                    if (this.PlayerResearch.Any(pr=>pr.researchId ==  Spec.SecondaryResearchId ))
                    {
                        var PR = this.PlayerResearch.First(pr => pr.researchId == Spec.SecondaryResearchId);
                        PR.isCompleted = 0;
                        AllNewUserResearchs.Add(PR);
                    }
                }
            }

            //add PlayerResearches to other members of the alliance:
            if (this.allianceId != 0)
            {
                foreach (var research in researchIds)
                {
                    Core.Instance.alliances[this.allianceId].AddSecondarySpecificationGain(research);
                }               
            }

            try
            {                       
                Core.dataConnection.SaveResearch( AllNewUserResearchs);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }
       
            return true;
        }
        

        public static bool createUser(int userId, string name)
        {



            return true;
        }

        public void createUserTemplates()
        {
            //copy all templates owned by player 0
            Core core = Core.Instance;
            
            foreach (var template in core.shipTemplate.Values.Where(template => template.userId == 0))
            {
                List<AsyncSaveable> elementsToSave = new List<AsyncSaveable>();
                SpacegameServer.Core.ShipTemplate newTemplate = template.clone();                
                newTemplate.userId = this.id;
                StatisticsCalculator.calc(newTemplate, Core.Instance);
                core.shipTemplate[newTemplate.id] = newTemplate;

                elementsToSave.Add(newTemplate);
                core.dataConnection.saveAsync(elementsToSave);       

            }

            
        }

        private static List<SystemMap> AllStartSystems = new List<SystemMap>();
        private static SystemMap FindNewStartingRegionSystem(string startingRegion)
        {
            int RegionDistance = 25;

            //ToDo: this is not thread safe!
            if (AllStartSystems.Count == 0)
            {
                AllStartSystems = Core.Instance.stars.Where(e => e.Value.startsystem == 1 && e.Value.distanceToCenter > RegionDistance).Select(e => e.Value).ToList();
                AllStartSystems.Sort((sys1, sys2) => sys1.distanceToCenter.CompareTo(sys2.distanceToCenter));
            }

            List<SystemMap> StartingRegions = new List<SystemMap>();

            // iterate the sorted systems
            // take the first one that has more than 14 distance to all previously found starting regions.
            foreach (var star in AllStartSystems)
            {
                if (star.startingRegion != null)
                {
                    StartingRegions.Add(star);
                    continue;
                }

                if (star.settled == 1) continue;

                //check if any of the starting regions is nearer than 14 fields, if yes, continue, if not, take this star as new starting region
                if (StartingRegions.Any(e=>
                    Math.Max(Math.Abs(e.posX - star.posX), (e.posY - star.posY)) < RegionDistance
                    )) continue;

                star.startingRegion = startingRegion;
                return star;
            }
           
            return null;
        }


        private static SystemMap FindStartingSystem(int x, int y)
        {
            SystemMap startingSystem = null;

            if (Core.Instance.GalaxyMap.useSolarSystems)
            {
                double distance = 5000 * 5000;
                foreach (var entry in Core.Instance.stars.Where(e => e.Value.startsystem == 1 && e.Value.settled == 0))
                {
                    var star = entry.Value;
                    //var currentDistance = Math.Sqrt(((star.posX - x) * (star.posX - x)) + ((star.posY - y) * (star.posY - y)));
                    var currentDistance = Math.Max(Math.Abs(star.posX - x), Math.Abs(star.posY - y));
                    if (currentDistance < distance)
                    {
                        distance = currentDistance;
                        startingSystem = star;
                    }
                }
            }
            else
            {
                double distance = 5000 * 5000;
                foreach (var entry in Core.Instance.stars.Where(e => e.Value.colonizable == 1 && e.Value.settled == 0))
                {
                    var star = entry.Value;
                    //var currentDistance = Math.Sqrt(((star.posX - x) * (star.posX - x)) + ((star.posY - y) * (star.posY - y)));
                    var currentDistance = Math.Max(Math.Abs(star.posX - x), Math.Abs(star.posY - y));
                    if (currentDistance < distance)
                    {
                        distance = currentDistance;
                        startingSystem = star;
                    }
                }
            }


            return startingSystem;
        }

        /// <summary>
        /// find a free star system
        /// </summary>
        /// <param name="demoStartingRegion"></param>
        /// <returns></returns>
        private static SystemMap FindStartingSystem(string startingRegion)
        {
            SystemMap startingSystem = null;
            
            if (String.IsNullOrEmpty(startingRegion))
            {
                int centerOfMap = Core.Instance.GalaxyMap.size / 2;
                startingSystem = FindStartingSystem(centerOfMap, centerOfMap); 
            }
            else
            {
                
                if (Core.Instance.stars.Any(e=>e.Value.startingRegion == startingRegion))
                {
                    var regionCenter = Core.Instance.stars.First(e => e.Value.startingRegion == startingRegion).Value;
                    startingSystem = FindStartingSystem(regionCenter.posX, regionCenter.posY); 
                }
                else
                {
                    startingSystem = FindNewStartingRegionSystem(startingRegion);
                }
                
            }

            return startingSystem;
        }

        public static bool registerUser(int userId, string demoStartingRegion = null, bool demoMode = false)
        {
            Core core = Core.Instance;

            if (core.users.ContainsKey(userId)) return true;

            //TODO : Checks - Very important!
            // Does User exist (in index DB)
            // Is User allowed for this game
            //OK Is User not already in game
            // Has the game enough starting places for the user
            SpacegameServer.DataConnectors.IndexUser indexUser;
            if (!demoMode)
            {
                indexUser = Core.Instance.dataConnection.getIndexUser(userId);
            }
            else
            {
                indexUser = new DataConnectors.IndexUser();
                indexUser.name = userId.ToString();
                indexUser.user_ip = "123";
                indexUser.language = 0;
                indexUser.id = userId;
                indexUser.StartingRegion = "";
            }
            if (indexUser == null) return false;
       

            //Create User
            SpacegameServer.Core.User user = new SpacegameServer.Core.User(userId);
            user.username = indexUser.name;
            user.user_session = indexUser.user_ip;
            user.Description = "@970"; //You can customize your profile...
            user.player_ip = indexUser.user_ip;
            user.language = indexUser.language;
            user.showColonyOwners = true;
            user.AiRelation = 2;
            user.LastReadGalactivEvent = Core.Instance.galactivEvents.Count > 0 ?  Core.Instance.galactivEvents.Keys.Max() : 0;

            core.users[userId] = user;

            string startingRegion = demoStartingRegion != null ? demoStartingRegion : indexUser.StartingRegion;

            //DEACTIVATED STARTING REGION:
            startingRegion = "";

            //find free star system
            SystemMap startingSystem = null;
            startingSystem = FindStartingSystem(startingRegion);

            if (startingSystem == null) return false;

            //search for the central Node to add the user to it
            int center = Core.Instance.GalaxyMap.size / 2;
            SpacegameServer.Core.NodeQuadTree.BoundarySouthWest boundarySouthWest = new SpacegameServer.Core.NodeQuadTree.BoundarySouthWest(center - 10, center - 10);
            SpacegameServer.Core.NodeQuadTree.Bounding NodeQuadTreeBounding = new SpacegameServer.Core.NodeQuadTree.Bounding(boundarySouthWest, 20);
            List<int> nearby = Core.Instance.nodeQuadTree.queryRange(NodeQuadTreeBounding);       

            //var node = Core.Instance.commNodes.First().Value;
            CommunicationNode node;
            if (nearby.Count > 0 && Core.Instance.commNodes.ContainsKey( nearby.OrderBy(e=>e).First()))
            {
                node = Core.Instance.commNodes[nearby.OrderBy(e => e).First()];
            }
            else
            {
                node = Core.Instance.commNodes.First().Value;
            }

            
            var nodeSave = new List<CommNodeUser>();

            List<Lockable> elementsToLock = new List<Lockable>(2);
            elementsToLock.Add(startingSystem);
            elementsToLock.Add(startingSystem.field);
            elementsToLock.Add(node);

            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return false;
            }

            int colonizerId = 0;

            try
            {
                //check again after locking
                if (startingSystem.settled == 1)
                {
                    LockingManager.unlockAll(elementsToLock);
                    return false;
                }

                startingSystem.settled = 1;
                user.homeCoordX = startingSystem.posX;
                user.homeCoordY = startingSystem.posY;

                //--insert template for the colony ship. Scout hull + colonizer module etc...
                // should later be replaced by a huge colonizing vessel with lots of life support / 
                // insert also template for first galaxyScout


                //insert ship into the free star system
                
                Ship.createStartingColonyShip(user, startingSystem, ref colonizerId);
                user.lastSelectedObjectId = colonizerId;
                user.lastSelectedObjectType = 1;
                user.researchPoints = 5;

                if (demoMode) user.researchPoints = 100;


                //add User to CommNode
                var newUser = new CommNodeUser(user.id, node.id);
                node.commNodeUsers.TryAdd(user.id, newUser);
                user.commNodeRights.Add(node.id, newUser);

                //add user research 1,1 (ToDo: andd userQuest 1)                
                UserResearch NewUserResearch = new UserResearch(user.id, 1);
                NewUserResearch.isCompleted = 1;
                NewUserResearch.research = Core.Instance.Researchs[1];
                user.PlayerResearch.Add(NewUserResearch);

                UserQuest userQuest = new UserQuest();
                userQuest.questId = 1;
                userQuest.userId = user.id;
                user.quests.Add(userQuest);


                nodeSave.Add(newUser);
                GalacticEvents.AddNewEvent(GalacticEventType.Arrival, int1:user.id , string1: user.username);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }
            //transfer data
            //ToDo: saving user should not be async, since the following sql statements might then fail
            Core.Instance.dataConnection.saveUser(user);
            //write SQL                                              
            Core.Instance.dataConnection.insertShip(core.ships[colonizerId]);

            Core.Instance.dataConnection.saveStarmap(startingSystem);

            Core.Instance.dataConnection.saveCommNodeUsers(nodeSave);

            user.createUserTemplates();

            //user.setAIRelations();

            //Core.Instance.dataConnection.registerUser(userId, name,  indexUser.user_ip);          
      
            //ToDo: get User Research
            //core.dataConnection.getUsers(core, userId);
            //core.dataConnection.getShips(core, 0, core.users[userId]);

            return true;
        }
        /*
        public void setAIRelations()
        {
            foreach (var coreUser in Core.Instance.users)
            {
                if (coreUser.Value.AiId > 0 && coreUser.Value.AiRelation < (int)Relation.Neutral)
                {
                    List<SpacegameServer.Core.DiplomaticRelation> changes = new List<SpacegameServer.Core.DiplomaticRelation>();
                    Core.Instance.userRelations.trySetRelation(this.id, coreUser.Value.id, 1, Relation.Neutral, changes);
                }
                
            }
        }
        */

        public static int createDemoUser(string userIp, string userLanguage)
        {
            int userId = Core.Instance.dataConnection.createDemoUser( userIp,  userLanguage);
            if (userId == 0) return 0;

            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;
            Core.Instance.dataConnection.getUsers(core, userId);
            Core.Instance.dataConnection.getShips(core, 0, core.users[userId]);
            return userId;
        }

        public void setLanguage(string languageShortName)
        {
            if (Core.Instance.languages.Count( lang => lang != null && lang.languageShortName == languageShortName) == 1)
            {
                this.versionId++;
                var newLanguage = Core.Instance.languages.First(lang => lang.languageShortName == languageShortName);
                this.language  = newLanguage.id;
                this.languageShortName = newLanguage.languageShortName;
                Core.Instance.dataConnection.saveUser(this);
            }
        }

        public void setRaster(bool newValue)
        {
            this.versionId++;
            this.showRaster = newValue;
            Core.Instance.dataConnection.saveUser(this);
        }

        public void setCoordinates(bool newValue)
        {
            this.versionId++;
            this.showCoordinates = newValue;
            Core.Instance.dataConnection.saveUser(this);
        }

        public void setSystemNames(bool newValue)
        {
            this.versionId++;
            this.showSystemNames = newValue;
            Core.Instance.dataConnection.saveUser(this);
        }

        public void setColonyNames(bool newValue)
        {
            this.versionId++;
            this.showColonyNames = newValue;
            Core.Instance.dataConnection.saveUser(this);
        }

        public void setColonyOwners(bool newValue)
        {
            this.versionId++;
            this.showColonyOwners = newValue;
            Core.Instance.dataConnection.saveUser(this);
        }

        public void setShipNames(bool newValue)
        {
            this.versionId++;
            this.showShipNames = newValue;
            Core.Instance.dataConnection.saveUser(this);
        }

        public void setShipOwners(bool newValue)
        {
            this.versionId++;
            this.showShipOwners = newValue;
            Core.Instance.dataConnection.saveUser(this);
        }

        public void setShipMovement(bool newValue)
        {
            this.versionId++;
            this.moveShipsAsync = newValue;
            Core.Instance.dataConnection.saveUser(this);
        }

        public void changeBrightness(byte newValue)
        {
            this.versionId++;
            this.scanRangeBrightness = newValue;
            Core.Instance.dataConnection.saveUser(this);
        }
        public void renameUser(string newValue)
        {
            this.versionId++;
            this.username = newValue;
            Core.Instance.dataConnection.saveUser(this);
        }

        public void ChangeProfileUrl(string newValue)
        {
            this.versionId++;
            this.ProfileUrl = newValue;
            Core.Instance.dataConnection.saveUser(this);
        }


        public void sendLastObjectDataAndLogout(int lastObjectType, int lastObjectId)
        {
            this.versionId++;
            this.lastSelectedObjectType = lastObjectType;
            this.lastSelectedObjectId = lastObjectId;
            this.player_ip = null;
            Core.Instance.dataConnection.saveUser(this);
        }

        public void trySetRelation(int userId, int diplEntId, int diplEntType, int relation)
        {
            List<DiplomaticRelation> relations = new List<DiplomaticRelation>();
            Core.Instance.dataConnection.saveDiplomaticEntities(relations);
        }

        public void declaredWar( User otherplayer, List<Ship> shipsMoved, bool isAgressor)
        {
            if (isAgressor)
            {
                //move all Ships to the nearest own colony
                /*
                foreach(var ship in this.ships)
                {
                    if (ship.isStationary()) continue;
                    
                    ship.noMovementCounter = 7;
                    ship.impuls = 0;
                    ship.hyper = 0;

                    if (!ship.field.colonies.Any(e=>e.userId == ship.userid))
                    {
                        Field nearestColonyField = null;

                        Tuple<byte, byte> systemXY = null;
                        double distance = 100000;
                        foreach (var colony in this.colonies)
                        {
                            double colonyDistance = ship.field.getDistanceTo(colony.field);
                            if (colonyDistance < distance)
                            {
                                systemXY = colony.systemXY();
                                nearestColonyField = colony.field;
                                distance = colonyDistance;
                            }
                        }                        

                        if(nearestColonyField != null)
                        {
                            ship.field.removeShip(ship);
                            nearestColonyField.addShip(ship);
                            ship.posX = nearestColonyField.x;
                            ship.posY = nearestColonyField.y;
                            ship.systemid = nearestColonyField.starId;
                            ship.systemx = (byte?)systemXY.Item1;
                            ship.systemy = (byte?)systemXY.Item2;                            
                        }
                        else
                        { 
                            // no colony exists anymore, just get a free field (also in system):
                            ship.setToNextFreeField();
                        }

                    }
                    ship.versionId++;
                    shipsMoved.Add(ship);
                }
                */

                //move own stations that are on the same spot as enemy stations one field to the side on a free field
                //should not occur, since stations should not be put onto fields where other player have already stations

                //detect fields where own ships are on the same spot as enemy ships.
                var fields = this.ships.Where(ship => ship.field.ships.Any(otherShip =>
                        otherShip.userid != ship.userid
                        && UserRelations.IsLower(Core.Instance.userRelations.getRelation(this.id, otherShip.userid) , Relation.Neutral)
                        && (otherShip.systemid == null || (otherShip.systemX == ship.systemX && otherShip.systemY == ship.systemY))
                        ))
                        .GroupBy(e => new { Field = e.field, SysXY = e.getSystemCoords() })
                        .Select(e => e.Key).ToList();

                //for each field, detect combat
                foreach (var field in fields)
                {
                    field.Field.fieldCombat( shipsMoved, this, field.SysXY);
                }

                /*
                foreach (var ship in this.ships)
                {
                    if (!ship.isStationary()) continue;
                    if (ship.field.ships.Any(otherShip => otherShip.userid != ship.userid 
                        && (otherShip.systemid == null || (otherShip.systemX == ship.systemX && otherShip.systemY == ship.systemY)) 
                        && otherShip.isStationary()))
                    {
                        ship.versionId++;
                        ship.setToNextFreeField();
                        shipsMoved.Add(ship);
                    }
                }
                */
            }
            else
            {
                //move all ships that are above enemies colonies aside to a free place
                /*
                foreach(var ship in otherplayer.ships)
                {
                    // only ships in the orbit of the aggressor
                    if (ship.field.colonies.Any(e => e.userId == this.id))
                    {
                        ship.versionId++;
                        ship.setToNextFreeField();
                        shipsMoved.Add(ship);
                    }
                }
                */
            }
        }


        public static string x = "";
        public void RemoveDueInactivity()
        {
            x += (this.id.ToString() + ";");
        }


        public static void RemoveInactives()
        {
            // check each User
            // A User will stay if:
            // He has 2+ colonies or
            // He has 10+ Buildings on his one colony
            // He completed the quests
            
            foreach (var entry in  Core.Instance.users)
            {
                var User = entry.Value;
                if (User.colonies.Count > 1) continue;
                if (User.AiId != 0) continue;

                if (Core.Instance.userRelations.getDiplomatics(User).Count > 0) continue;

                var DeleteHim = false;
                if (User.colonies.Count == 0 )
                {
                    if (Core.Instance.galactivEvents.ContainsKey(User.LastReadGalactivEvent))
                    {
                        var Event = Core.Instance.galactivEvents[User.LastReadGalactivEvent];
                        if ((DateTime.Now - Event.EventDatetime).TotalDays > 2) DeleteHim = true;
                    }                   
                }
                if (User.colonies.Count == 1)
                {
                    if (User.colonies.First().colonyBuildings.Count > 15) continue;

                    DeleteHim = true;
                }
                if (DeleteHim) User.RemoveDueInactivity();
            }

            x += ";;";

        }


    }

}
