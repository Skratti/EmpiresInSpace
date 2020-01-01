using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    public partial class Alliance : Lockable, Group, DiplomaticEntity
    {

        const int _diplomaticType = 2;
        private int _id;
        private string _NAME;
        private string _description;
        private string _passwrd;
        private System.Nullable<int> _allianceowner;
        private int _overallRank;
        private int _overallVicPoints;
        private List<AllianceMember> _memberRights;
        private List<DiplomaticEntity> _members;
        private Group _group;

        public List<AllianceMember> memberRights { get { return _memberRights; } set { _memberRights = value; } } 

        public List<DiplomaticEntity> members { get { return _members; } set { _members = value; } }
        public Group group { get { return _group; } set { _group = value; } }

        
        public Alliance()
        {
        }

        public Alliance(int id)
        {
            this.id = id;
            this.members = new List<DiplomaticEntity>();
            this._memberRights = new List<AllianceMember>();
        }

        public Alliance(int id, string name, string description, string password, int? allianceOwner, int overallRank, Group group)
        {
            this.id = id;
            this.NAME = name;
            this.description = description;
            this.passwrd = password;
            this.allianceowner = allianceOwner;
            this.overallRank = overallRank;
            this.group = group;
            this.members = new List<DiplomaticEntity>();
            this._memberRights = new List<AllianceMember>();
        }

        /// <summary>
        /// Check all members. If they have the primary specification , they should not get the secondary specification gain. 
        /// </summary>
        public void RepairSecondarySpecificationGain()
        {            
            foreach (var user in this.getUsers())
            {
                foreach (var PrimaryResearch in user.PlayerResearch.Where(e => e.isCompleted == 1 && Core.Instance.SpecializationGroups.Any(specGroup => specGroup.SpecializationResearches.Any(SpecResearch => SpecResearch.ResearchId == e.researchId && SpecResearch.SecondaryResearchId != null))))
                {
                    this.AddSecondarySpecificationGain(PrimaryResearch.research);
                }
            }
        }

        /// <summary>
        /// called after a user left the alliance, checks if some senodary gains should be removed
        /// </summary>
        /// <param name="user"></param>
        public void RemoveSecondarySpecificationGain(User user)
        {
            //check if the user has a research that is the primary research from a specResearch with a secondary research
            if (!user.PlayerResearch.Any(e=>
                e.isCompleted == 1 &&  
                Core.Instance.SpecializationGroups.Any(specGroup=>specGroup.SpecializationResearches.Any(SpecResearch=>SpecResearch.ResearchId == e.researchId && SpecResearch.SecondaryResearchId != null  )))) return;

            UserResearch PrimaryResearch = user.PlayerResearch.First(e=>e.isCompleted == 1 &&  Core.Instance.SpecializationGroups.Any(specGroup=>specGroup.SpecializationResearches.Any(SpecResearch=>SpecResearch.ResearchId == e.researchId && SpecResearch.SecondaryResearchId != null  ))); 

            //if someone in the alliance yet has the research, skip...
            if (Core.Instance.users.Values.Any(e => e.allianceId == this.id && e.PlayerResearch.Any(userResearch => userResearch.researchId == PrimaryResearch.researchId && userResearch.isCompleted == 1))) return;

            //now remove all Secondary gains of this research:
            short SecondaryResearchId = (short)PrimaryResearch.research.GetSpecification().SecondaryResearchId;

            List<UserResearch> AllNewUserResearchs = new List<UserResearch>();
            var UserToUpdate = Core.Instance.users.Values.Where(u => u.allianceId == this.id && u.PlayerResearch.Any(userResearch => userResearch.researchId == SecondaryResearchId && userResearch.isCompleted == 1));
            foreach (var User in UserToUpdate)
            {
                var PlayerResearch = User.PlayerResearch.First(e => e.researchId == SecondaryResearchId && e.isCompleted == 1);
                PlayerResearch.isCompleted = 0;
                AllNewUserResearchs.Add(PlayerResearch);
            }

            if (AllNewUserResearchs.Count > 0)
            {
                try
                {
                    Core.Instance.dataConnection.SaveResearch(AllNewUserResearchs);
                }
                catch (Exception ex)
                {
                    SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
                }
            }

        }
        
        public void JoinSecondarySpecificationGain(User user)
        {
            //Give other members the Second Spec of the user
            // & give user the secondary research from the other members

            this.RepairSecondarySpecificationGain();

            /*
            //check if the user has a research that is the primary research from a specResearch with a secondary research
            if (!user.PlayerResearch.Any(e =>
                e.isCompleted == 1 &&
                Core.Instance.SpecializationGroups.Any(specGroup => specGroup.SpecializationResearches.Any(SpecResearch => SpecResearch.ResearchId == e.researchId && SpecResearch.SecondaryResearchId != null)))) 
                return;

            //UserResearch PrimaryResearch = user.PlayerResearch.First(e => e.isCompleted == 1 && Core.Instance.SpecializationGroups.Any(specGroup => specGroup.SpecializationResearches.Any(SpecResearch => SpecResearch.ResearchId == e.researchId && SpecResearch.SecondaryResearchId != null))); 
            //this.AddSecondarySpecificationGain(PrimaryResearch.research);
            
            foreach (var PrimaryResearch in user.PlayerResearch.Where(e => e.isCompleted == 1 && Core.Instance.SpecializationGroups.Any(specGroup => specGroup.SpecializationResearches.Any(SpecResearch => SpecResearch.ResearchId == e.researchId && SpecResearch.SecondaryResearchId != null))))
            {
                this.AddSecondarySpecificationGain(PrimaryResearch.research);
            }
            */
        }

        public void AddSecondarySpecificationGain(Research research)
        {
            if (!research.IsSpecification()) return;
            var SpecData = research.GetSpecification();

            if (SpecData.SecondaryResearchId == null) return;

            List<UserResearch> AllNewUserResearchs = new List<UserResearch>();

            //Add to players having neither first nor second research
            var UserToUpdate = Core.Instance.users.Values.Where(user => user.allianceId == this.id && !user.PlayerResearch.Any(userResearch => userResearch.isCompleted == 1 && (userResearch.researchId == SpecData.ResearchId  || userResearch.researchId == SpecData.SecondaryResearchId)));
            foreach (var User in UserToUpdate)
            {
                UserResearch NewUserResearch;
                if (User.PlayerResearch.Any( userResearch => userResearch.isCompleted == 1 && (userResearch.researchId == SpecData.ResearchId  || userResearch.researchId == SpecData.SecondaryResearchId)))
                {
                    NewUserResearch = User.PlayerResearch.First(userResearch => userResearch.isCompleted == 1 && (userResearch.researchId == SpecData.ResearchId || userResearch.researchId == SpecData.SecondaryResearchId));
                }
                else
                {
                    NewUserResearch = new UserResearch(User.id, (short)SpecData.SecondaryResearchId);
                }
                 
                NewUserResearch.isCompleted = 1;
                NewUserResearch.research = research;
                User.PlayerResearch.Add(NewUserResearch);
                AllNewUserResearchs.Add(NewUserResearch);
            }

            if (AllNewUserResearchs.Count > 0)
            {
                try
                {
                    Core.Instance.dataConnection.SaveResearch(AllNewUserResearchs);
                }
                catch (Exception ex)
                {
                    SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
                }
            }

        }

        public Rights getMemberRight(DiplomaticEntity member)
        {
            if (this.group == null)
            {
                Rights userRight = this.memberRights.Where(memberRight => memberRight.userId == member.id).FirstOrDefault();
                if (userRight != null)
                    return userRight;
                else
                    return Rights.noRights(member.id);
            }
            else
                return this.group.getMemberRight(member);
        }

        public static System.Data.DataTable createDataTable()
        {
            System.Data.DataTable dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "id");
            dataTable.AddColumn(System.Type.GetType("System.String"), "name");
            dataTable.AddColumn(System.Type.GetType("System.String"), "description");
            dataTable.AddColumn(System.Type.GetType("System.String"), "passwrd");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "allianceOwner");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "overallVicPoints");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "overallRank");

            return dataTable;
        }

        public object createData()
        {
            return new
            {
                this.id
                ,
                this.NAME
                ,
                description = (object)this.description ?? DBNull.Value
                ,
                this.passwrd
                ,
                allianceowner = (object)this.allianceowner ?? DBNull.Value
                ,
                this.overallVicPoints
                ,
                this.overallRank
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

        public override int GetHashCode()
        {
            int diplomaticTypeBits = (diplomaticType << 21);
            int hash = diplomaticTypeBits ^ id;
            return hash;

        }

        public List<DiplomaticEntity> GetAllEntities()
        {
            var Entities = this.members.ToList();
            Entities.Add(this);
            return Entities;
        }
        public List<DiplomaticEntity> getMembers()
        {
            return this.members;
        }

        public List<User> getUsers()
        {
            return this.members.Select(member => (User)member).ToList();
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

        public string passwrd
        {
            get
            {
                return this._passwrd;
            }
            set
            {
                if ((this._passwrd != value))
                {
                    this._passwrd = value;
                }
            }
        }

        public System.Nullable<int> allianceowner
        {
            get
            {
                return this._allianceowner;
            }
            set
            {
                if ((this._allianceowner != value))
                {
                    this._allianceowner = value;
                }
            }
        }

        public int overallRank
        {
            get
            {
                return this._overallRank;
            }
            set
            {
                if ((this._overallRank != value))
                {
                    this._overallRank = value;
                }
            }
        }

        public int overallVicPoints
        {
            get
            {
                return this._overallVicPoints;
            }
            set
            {
                if ((this._overallVicPoints != value))
                {
                    this._overallVicPoints = value;
                }
            }
        }

        private void join(User user, AllianceMember rights = null)
        {
            this.members.Add(user);
            if (rights != null)
                this.memberRights.Add(rights);
            else
                this.memberRights.Add(AllianceMember.noRights(user.id, this.id));
            user.group = this;
            user.allianceId = this.id;

            foreach (System.Collections.DictionaryEntry HashEntry in GeometryIndex.allFields)
            {
                Field fieldToSet = (Field)HashEntry.Value;

                if (fieldToSet.Influence.Count == 0) continue;
                if (fieldToSet.Owner == user)
                {
                    fieldToSet.Entity = user.GetEntity();
                }
            }


            JoinSecondarySpecificationGain(user);
        }

        private void leave(User user)
        {
            this.members.Remove(user);
            this.memberRights.RemoveAll(e => e.userId == user.id);
            user.group = null;
            user.allianceId = 0;

            var allianceCommNode = CommunicationNode.GetAllianceNode(this);
            if (allianceCommNode != null)
            {
                allianceCommNode.commNodeUsers.TryRemove(user.id);
                Core.Instance.dataConnection.DeleteCommNodeUsers(allianceCommNode, user);
            }

            //remove his secondary trait from other members
            this.RemoveSecondarySpecificationGain(user);

            //remove ALL secondary traits from this user
            List<UserResearch> AllNewUserResearchs = new List<UserResearch>();            
            foreach (var SpecGroup in Core.Instance.SpecializationGroups.Where(specGroup=>specGroup.SpecializationResearches.Any(SpecResearch=>SpecResearch.SecondaryResearchId != null  )))
            {
                foreach (var SpecResearch in SpecGroup.SpecializationResearches)
                {
                    if (!user.PlayerResearch.Any(e=>e.isCompleted == 1 && e.researchId == SpecResearch.SecondaryResearchId )) continue;
                    var PlayerResearch = user.PlayerResearch.First(e => e.researchId == SpecResearch.SecondaryResearchId && e.isCompleted == 1);
                    PlayerResearch.isCompleted = 0;
                    AllNewUserResearchs.Add(PlayerResearch);
                }
            }

            if (AllNewUserResearchs.Count > 0)
            {
                try
                {
                    Core.Instance.dataConnection.SaveResearch(AllNewUserResearchs);
                }
                catch (Exception ex)
                {
                    SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
                }
            }

            foreach (System.Collections.DictionaryEntry HashEntry in GeometryIndex.allFields)
            {
                Field fieldToSet = (Field)HashEntry.Value;

                if (fieldToSet.Influence.Count == 0) continue;
                if (fieldToSet.Owner == user)
                {
                    fieldToSet.Entity = user.GetEntity();
                }               
            }


        }


        public static bool createAlliance(User user, string name)
        {
            Core core = Core.Instance;
            List<Lockable> elementsToLock = new List<Lockable>(1);
            elementsToLock.Add(user);

            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return false;
            }
            try
            {
                //Prüfen ob der Nutzer noch Mitlgied einer ALlianz ist	
                if (user.allianceId != 0 || user.group != null)
                {
                    LockingManager.unlockAll(elementsToLock);
                    return false;
                }

                //create alliance
                int newId = (int)Core.Instance.identities.allianceId.getNext();
                Alliance alliance = new Alliance(newId, name, "", "", user.id, 1000, null);
                core.alliances.TryAdd(newId, alliance);

                //add owner
                AllianceMember fullRights = AllianceMember.fullRights(user.id, newId);
                alliance.join(user, fullRights);                
                
                //All relations from and towards the user are now concerning his new alliance:
                List<DiplomaticRelation> relations = new List<DiplomaticRelation>();
                foreach (var relation in core.userRelations.getDiplomatics(user, 1))
                {
                    core.userRelations.setDiplomaticEntityState(alliance, relation.target, (Relation)relation.relationSenderProposal);
                    relations.Add(new DiplomaticRelation(alliance.GetHashCode(), relation.target.GetHashCode(), relation.relationSenderProposal));
                    core.userRelations.setDiplomaticEntityState(relation.target,alliance, (Relation)relation.relationTargetProposal);
                    relations.Add(new DiplomaticRelation(relation.target.GetHashCode(), alliance.GetHashCode(), relation.relationTargetProposal));
                    
                }

                //save alliance:
                core.dataConnection.saveAlliances(alliance);

                // new relations:
                Core.Instance.dataConnection.saveDiplomaticEntities(relations);

                //members:
                Core.Instance.dataConnection.saveAllianceMembers(alliance);

                CommunicationNode.CreateAllianceNode(alliance);
                
            }
            catch (Exception ex)
            {
                core.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }
            return true;
        }

        public static bool joinCheck(User user, int allianceId)
        {            
            Core core = Core.Instance;

            if (!core.alliances.ContainsKey(allianceId)) return false;
            Alliance alliance = core.alliances[allianceId];

            List<Lockable> elementsToLock = new List<Lockable>(2);
            elementsToLock.Add(user);
            elementsToLock.Add(alliance);

            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {               
                return false;
            }
            try
            {
                //Prüfen ob der Nutzer noch Mitlgied einer ALlianz ist	
                if (user.allianceId != 0 || user.group != null)
                {
                    LockingManager.unlockAll(elementsToLock);
                    return false; 
                }

                //check that user is invited:
                if (!core.invitesPerAlliance.ContainsKey(allianceId) ||  !core.invitesPerAlliance[allianceId].Any(e => e == user.id))
                {
                    LockingManager.unlockAll(elementsToLock);
                    return false; 
                }

                alliance.join(user);
   
                //save alliance:
                core.dataConnection.saveAlliances(alliance);

                //members:
                Core.Instance.dataConnection.saveAllianceMembers(alliance);

                //remove invitation:
                Core.Instance.invitesPerAlliance[alliance.id].RemoveAll(userId => userId == user.id);
                if (Core.Instance.invitesPerUser.ContainsKey(user.id))
                {
                    Core.Instance.invitesPerUser[user.id].RemoveAll(allyId => allyId == alliance.id);
                }
                Core.Instance.dataConnection.removeInvite(alliance.id, user.id);

                //add to alliance communication              
                if (Core.Instance.commNodes.Any(e => e.Value.connectionType == 4 && e.Value.connectionId == alliance.id))
                { 
                    Core.Instance.commNodes.First(e => e.Value.connectionType == 4 && e.Value.connectionId == alliance.id).Value.addUserAndSave(user);
                }
               
            }
            catch (Exception ex)
            {
                core.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }
            return true;
        }

        public static bool leaveCheck(User user,User userToRemove, int allianceId)
        {
            Core core = Core.Instance;

            if (!core.alliances.ContainsKey(allianceId)) return false;
            Alliance alliance = core.alliances[allianceId];

            
           

            List<Lockable> elementsToLock = new List<Lockable>(2);
            elementsToLock.Add(userToRemove);
            elementsToLock.Add(alliance);

            if (user != userToRemove)
            {
                //check that both are in the same alliance
                if (user.allianceId != userToRemove.allianceId) return false;
                //check that user may fire a member
                if (!alliance.memberRights.Any(e => e.userId == user.id && e.mayFire)) return false;
            }

            //Test ob @userId Teil der ALlianz ist 	
            if (!alliance.members.Any(e => e.id == user.id)) return false;            


            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return false;
            }
            try
            {


                if (user != userToRemove)
                {
                    //check that both are in the same alliance
                    if (user.allianceId != userToRemove.allianceId)
                    {
                        LockingManager.unlockAll(elementsToLock);
                        return false;
                    }
                    //check that user may fire a member
                    if (!alliance.memberRights.Any(e => e.userId == user.id && e.mayFire))
                    {
                        LockingManager.unlockAll(elementsToLock);
                        return false;
                    }
                }

                //Test ob @userId Teil der ALlianz ist 	
                if (!alliance.members.Any(e => e.id == user.id))
                {
                    LockingManager.unlockAll(elementsToLock);
                    return false;
                }

                //remove User
                alliance.leave(userToRemove);




                //members:
                Core.Instance.dataConnection.saveAllianceMembers(alliance);

                //delete alliance if the need exists:
                if(alliance.members.Count == 0)
                {
                    int allianceHash = alliance.GetHashCode();
                    core.alliances.TryRemove(alliance.id);

                    //delete all relations:
                    core.userRelations.removeEntity(alliance);
                    core.dataConnection.deleteAllianceRelations(allianceHash);
                    
                    //delete alliance in DB
                    core.dataConnection.deleteAlliance(allianceId);
                }
                else
                {
                    //check if alliance owner has left, if yes, choose a new one
                    if (alliance.allianceowner == userToRemove.id)
                    {
                        alliance.allianceowner = 0;

                        //first fullAdmin
                        if(alliance.memberRights.Any(e=>e.fullAdmin))
                        {
                            alliance.allianceowner = alliance.memberRights.First(e => e.fullAdmin).userId;
                        }

                        //then first diplomaticAdmin 
                        if (alliance.allianceowner == 0 && alliance.memberRights.Any(e => e.diplomaticAdmin))
                        {
                            alliance.allianceowner = alliance.memberRights.First(e => e.diplomaticAdmin).userId;
                        }

                        //then first diplomaticAdmin 
                        if (alliance.allianceowner == 0 && alliance.memberRights.Any(e => e.mayMakeDiplomaticProposals))
                        {
                            alliance.allianceowner = alliance.memberRights.First(e => e.mayMakeDiplomaticProposals).userId;
                        }

                        //at last just anyone
                        if (alliance.allianceowner == 0)
                        {
                            alliance.allianceowner = alliance.memberRights.First().userId;
                        }

                        //update alliance in DB
                        core.dataConnection.saveAlliances(alliance);                        
                    }
                }                                                                

            }
            catch (Exception ex)
            {
                core.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }
            return true;
        }

        public static void inviteTo(User sender, User receiver)
        {
            Core core = Core.Instance;

            //sender invites the receiver to his alliance:           
            if (!(sender.allianceId != 0 && Core.Instance.alliances.ContainsKey(sender.allianceId))) return;
            Alliance alliance = Core.Instance.alliances[sender.allianceId];

            //teste ob sich beide user kennen:
            //if (!core.userRelations.hasContact(sender, receiver)) return;
			
            //teste ob user erlaubt ist invites zu geben
            if (!alliance.getMemberRight(sender).mayInvite) return;

            //teste ob schon ein invite vorhanden ist
            if (core.invitesPerAlliance.ContainsKey(alliance.id)
                && core.invitesPerAlliance[alliance.id].Any(userId => userId == receiver.id)) return;

            List<Lockable> elementsToLock = new List<Lockable>(2);
            elementsToLock.Add(alliance);
            elementsToLock.Add(receiver);
            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return;
            }
            try
            {
                //teste ob schon ein invite vorhanden ist
                if (core.invitesPerAlliance.ContainsKey(alliance.id)
                    && core.invitesPerAlliance[alliance.id].Any(userId => userId == receiver.id))
                {
                    LockingManager.unlockAll(elementsToLock);
                    return;
                }

                //add into both dicts
                if (core.invitesPerAlliance.ContainsKey(alliance.id))
                {
                    core.invitesPerAlliance[alliance.id].Add(receiver.id);
                }
                else
                {
                    core.invitesPerAlliance.TryAdd(alliance.id, new List<int>());
                    core.invitesPerAlliance[alliance.id].Add(receiver.id);
                }

                if (core.invitesPerUser.ContainsKey(receiver.id))
                {
                    core.invitesPerUser[receiver.id].Add(alliance.id);
                }
                else
                {
                    core.invitesPerUser.TryAdd(receiver.id, new List<int>());
                    core.invitesPerUser[receiver.id].Add(alliance.id);
                }

                core.dataConnection.insertInvite(alliance.id, receiver.id);
            }
            catch (Exception ex)
            {
                core.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }

        }

        public static void removeInvitation(User sender, User receiver)
        {
            Core core = Core.Instance;
            //sender removes the invitation invites the receiver to his alliance:           
            if (!(sender.allianceId != 0 && Core.Instance.alliances.ContainsKey(sender.allianceId))) return;
            Alliance alliance = Core.Instance.alliances[sender.allianceId];

            //teste ob user erlaubt ist invites zu geben
            if (!alliance.getMemberRight(sender).mayInvite) return;

            //teste das kein invite vorhanden ist
            if (!(Core.Instance.invitesPerAlliance.ContainsKey(alliance.id)
                && Core.Instance.invitesPerAlliance[alliance.id].Any( user => user == receiver.id))) return;
                

            List<Lockable> elementsToLock = new List<Lockable>(2);
            elementsToLock.Add(alliance);          
            elementsToLock.Add(receiver);          
            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return;
            }
            try
            {
                //teste das kein invite vorhanden ist
                if (!(Core.Instance.invitesPerAlliance.ContainsKey(alliance.id)
                    && Core.Instance.invitesPerAlliance[alliance.id].Any(userId => userId == receiver.id)))
                {
                    LockingManager.unlockAll(elementsToLock);
                    return;
                }

                Core.Instance.invitesPerAlliance[alliance.id].RemoveAll(userId => userId == receiver.id);
                
                if (Core.Instance.invitesPerUser.ContainsKey(receiver.id))
                {
                    Core.Instance.invitesPerUser[receiver.id].RemoveAll(allianceId => allianceId == alliance.id);
                }

                Core.Instance.dataConnection.removeInvite(alliance.id, receiver.id);
            }
            catch (Exception ex)
            {
                core.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }

           
        }

        public static void renameAlliance(User sender, string newName)
        {
            Core core = Core.Instance;

            //sender invites the receiver to his alliance:           
            if (!(sender.allianceId != 0 && Core.Instance.alliances.ContainsKey(sender.allianceId))) return;
            Alliance alliance = Core.Instance.alliances[sender.allianceId];
            alliance.NAME = newName;

            core.dataConnection.saveAlliances(alliance);
        }

        public static void changeDescription(User sender, string newDesc)
        {
            Core core = Core.Instance;

            //sender invites the receiver to his alliance:           
            if (!(sender.allianceId != 0 && Core.Instance.alliances.ContainsKey(sender.allianceId))) return;
            Alliance alliance = Core.Instance.alliances[sender.allianceId];
            alliance.description = newDesc;

            core.dataConnection.saveAlliances(alliance);
        }
    }
}
