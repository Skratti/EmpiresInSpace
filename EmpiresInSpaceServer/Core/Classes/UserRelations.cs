using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    public interface DiplomaticEntity
    {
        int id { get; set; }
        int diplomaticType { get; set; } // 2: Alliance   -   1 : User 

        Group group { get; set; }

        Rights getMemberRight(DiplomaticEntity member = null);

        List<DiplomaticEntity> GetAllEntities();

        List<DiplomaticEntity> getMembers();

        List<User> getUsers();

        int GetHashCode();
    }

    public interface Group : DiplomaticEntity
    {
        List<DiplomaticEntity> members { get; set; }
        //List<Rights> memberRights { get; set; }
        List<AllianceMember> memberRights { get; set; }       
    }


    public class Rights
    {
        private int _userid;

        private bool _fulladmin;

        private bool _diplomaticadmin;

        private bool _mayinvite;

        private bool _mayfire;

        private bool _maydeclarewar;

        private bool _maymakediplomaticproposals;

        public Rights()
        {
        }

        public bool hasDiplomaticRigths()
        {
            return this._diplomaticadmin || this.fullAdmin;
        }

        public static Rights fullRights(int userId)
        {
            Rights rights = new Rights();
            rights.userId = userId;
            rights.fullAdmin = true;
            rights.diplomaticAdmin = true;
            rights.mayInvite = true;
            rights.mayFire = true;
            rights.mayDeclareWar = true;
            rights.mayMakeDiplomaticProposals = true;

            return rights;
        }

        public static Rights noRights(int userId)
        {
            Rights rights = new Rights();
            rights.userId = userId;
            rights.fullAdmin = false;
            rights.diplomaticAdmin = false;
            rights.mayInvite = false;
            rights.mayFire = false;
            rights.mayDeclareWar = false;
            rights.mayMakeDiplomaticProposals = false;

            return rights;
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

        
        public bool fullAdmin
        {
            get
            {
                return this._fulladmin;
            }
            set
            {
                if ((this._fulladmin != value))
                {
                    this._fulladmin = value;
                }
            }
        }

        
        public bool diplomaticAdmin
        {
            get
            {
                return this._diplomaticadmin;
            }
            set
            {
                if ((this._diplomaticadmin != value))
                {
                    this._diplomaticadmin = value;
                }
            }
        }

        
        public bool mayInvite
        {
            get
            {
                return this._mayinvite;
            }
            set
            {
                if ((this._mayinvite != value))
                {
                    this._mayinvite = value;
                }
            }
        }

        
        public bool mayFire
        {
            get
            {
                return this._mayfire;
            }
            set
            {
                if ((this._mayfire != value))
                {
                    this._mayfire = value;
                }
            }
        }

        
        public bool mayDeclareWar
        {
            get
            {
                return this._maydeclarewar;
            }
            set
            {
                if ((this._maydeclarewar != value))
                {
                    this._maydeclarewar = value;
                }
            }
        }

        
        public bool mayMakeDiplomaticProposals
        {
            get
            {
                return this._maymakediplomaticproposals;
            }
            set
            {
                if ((this._maymakediplomaticproposals != value))
                {
                    this._maymakediplomaticproposals = value;
                }
            }
        }
    }


    public class DiplomaticRelation
    {
        public int sender;
        public int target;
        public int relation;

        public DiplomaticRelation(int sender, int target, int relation)
        {
            this.sender = sender;
            this.target = target;
            this.relation = relation;
        }

        public static System.Data.DataTable createDataTable()
        {
            var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "sender");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "target");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "relation");            

            return dataTable;
        }

        public object createData()
        {
            return new
            {
                this.sender
                ,
                this.target
                ,
                this.relation               
            };
        }


    }


    public enum Relation
    {
        War = 0,
        Hostile = 1,
        Neutral = 2,
        //OpenBorders = 3,
        Trade = 3,
        Pact = 4,
        AllianceMember = 5
    }


    /// <summary>
    /// complete diplomacy between two entities
    /// </summary>
    public class FullDiplomaticRelationProposals
    {
        public DiplomaticEntity sender;
        public DiplomaticEntity target;
        public int relationSenderProposal;
        public int relationTargetProposal;
        public int relation;

        public FullDiplomaticRelationProposals(DiplomaticEntity sender, DiplomaticEntity target, int relationSenderProposal, int relationTargetProposal, int relation )
        {
            this.sender = sender;
            this.target = target;
            this.relationSenderProposal = relationSenderProposal;
            this.relationTargetProposal = relationTargetProposal;
            this.relation = relation;
        }
    }




    public class UserRelations
    {

        //entity1 to entity2. int is the targetState. two entries do always exist(entity2 to entity1), the lesser relation-Value of both targetState is the currentState
        //most of the time both will have the same relation value, only if one makes an offer will that value be bigger        
        protected ConcurrentDictionary<DiplomaticEntity, ConcurrentDictionary<DiplomaticEntity, Relation>> DiplomaticEntityState { get; set; }

        public UserRelations()
        {
            //userContactsAsc = new ConcurrentDictionary<int, ConcurrentDictionary<int, int>>();
            //userContactsDesc = new ConcurrentDictionary<int, ConcurrentDictionary<int, int>>();
            DiplomaticEntityState = new ConcurrentDictionary<DiplomaticEntity, ConcurrentDictionary<DiplomaticEntity, Relation>>();
        }
        
        public static Relation Min(Relation one, Relation two)
        {
            return (int)one < (int)two ? one : two;
        }

        public static bool IsLower(Relation one, Relation two)
        {
            return (int)one < (int)two;
        }

        public static bool IsHigher(Relation one, Relation two)
        {
            return (int)one > (int)two;
        }


        public static DiplomaticEntity hashToDiplomaticEntity(int hash, Core core)
        {

            int type = hash;
            type = (type >> 21);

            int id = hash - (type << 21);

            switch(type)
            {
                case 1:
                    if (core.users.ContainsKey(id))
                        return core.users[id];
                    else
                        return null;
                case 2:
                    if (core.alliances.ContainsKey(id))
                        return core.alliances[id];
                    else
                        return null;
                default:
                    return null;
            }            
        }

       //only public since the dataConnector (read from DB) needs to insert 
        public void setDiplomaticEntityState(DiplomaticEntity sender, DiplomaticEntity target, Relation relation)
        {
            if (DiplomaticEntityState.ContainsKey(sender)
                && DiplomaticEntityState[sender].ContainsKey(target))
            {
                DiplomaticEntityState[sender][target] = relation;
            }
            else
            {
                if (DiplomaticEntityState.ContainsKey(sender))
                {
                    DiplomaticEntityState[sender].TryAdd(target, relation);
                }
                else
                {
                    DiplomaticEntityState.TryAdd(sender, new ConcurrentDictionary<DiplomaticEntity, Relation>());
                    DiplomaticEntityState[sender].TryAdd(target, relation);
                }
            }
        }


        protected void worsenRelation(DiplomaticEntity sender, DiplomaticEntity target, Relation relation, List<DiplomaticRelation> relations)
        {
            //set new relationship on both entites to the new value:
            //first direction / entity
            /*
            setDiplomaticEntityState(sender, target, relation);
            
            //second direction / entity
            setDiplomaticEntityState(target, sender, relation);

            relations.Add(new DiplomaticRelation(sender.GetHashCode(), target.GetHashCode(), (int)relation));
            relations.Add(new DiplomaticRelation(target.GetHashCode(), sender.GetHashCode(), (int)relation));     
            */
            
            //list of ships moved away
            List<Ship> shipsFighting = new List<Ship>();

            //set  new relationship on both entites-USERS to the new value (in case of alliances):
            //create list of sender-Users
            //if (sender.diplomaticType != 1 || target.diplomaticType != 1  )
            //{  

            foreach (var senderUser in sender.GetAllEntities())
            {
                foreach (var targetUser in target.GetAllEntities())
                {
                        
                    setDiplomaticEntityState(senderUser, targetUser, relation);
                    setDiplomaticEntityState(targetUser, senderUser, relation);
                    relations.Add(new DiplomaticRelation(senderUser.GetHashCode(), targetUser.GetHashCode(), (int)relation));
                    relations.Add(new DiplomaticRelation(targetUser.GetHashCode(), senderUser.GetHashCode(), (int)relation));

                    if (relation < Relation.Neutral && senderUser.diplomaticType == 1 && targetUser.diplomaticType == 1)
                    {
                        ((User)senderUser).declaredWar((User)targetUser, shipsFighting, true);
                    }
                    //((User)targetUser).declaredWar((User)senderUser, shipsFighting, false);
                        
                }
            }

            //}

            Core.Instance.dataConnection.saveShips(shipsFighting);
        }


        /// <summary>
        /// set the relation between two entities
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="target"></param>
        /// <param name="relation"></param>
        /// <param name="relations">Is needed to write result to DB (and generate XML?) </param>
        /// <remarks>called with input data is already checked</remarks>
        protected void SetRelation(DiplomaticEntity sender, DiplomaticEntity target, Relation relation, List<DiplomaticRelation> relations)
        {
            Relation currentRelation = Relation.Neutral;
            if (DiplomaticEntityState.ContainsKey(sender) 
                && DiplomaticEntityState[sender].ContainsKey(target)
                && DiplomaticEntityState.ContainsKey(target)
                && DiplomaticEntityState[target].ContainsKey(sender))
            {
                currentRelation = Min(DiplomaticEntityState[sender][target], DiplomaticEntityState[target][sender]);
            }

            //worsening of the relation
            if (relation < currentRelation)
            {
                //Todo: lock all users, ships and alliances. Use a priority lock (to be implemented), since a lot of objects can be part of the transaction
                worsenRelation(sender, target, relation,  relations);

                //always worth a Galactic Event
                GalacticEvents.CreateEventFromDiplomacy(sender, target, relation, currentRelation);
                
                return;
            }

            //relationion is not worsened:
            //either a proposal is done or 
            // a proposal is accepted (and perhaps an additional proposal is done)

            //if targetRelationToSender is the currentRelation
            Relation targetRelationToSender = Relation.Neutral;
            if ( DiplomaticEntityState.ContainsKey(target)
                && DiplomaticEntityState[target].ContainsKey(sender))
            {
                targetRelationToSender = (Relation)DiplomaticEntityState[target][sender];                
            }



            Relation newCurrentRelation = (Relation)Math.Min((int)targetRelationToSender, (int)relation);

            if (newCurrentRelation != currentRelation){
                //change of relation: always worth a Galactic Event
                GalacticEvents.CreateEventFromDiplomacy(sender, target, newCurrentRelation, currentRelation);
            }

            //Some Relations can't be changed
            if (target is User)
            {
                if (((User)target).AiId > 0 && ((User)target).AiRelation < (int)Relation.Neutral)
                {
                    newCurrentRelation = UserRelations.Min(newCurrentRelation, ((Relation)((User)target).AiRelation));
                }
            }


            /*
            //all senderusers should be set to newCurrentRelation            
            //create list of sender-Users
            List<DiplomaticEntity> senders = sender.getMembers();

            //create list of target-Users
            List<DiplomaticEntity> targets = target.getMembers();
            
            //update all users that are mebers and have a lower relationship than the new one:
            foreach(var senderUser in senders)
            {
                foreach(var targetUser in targets)
                {
                    if (UserRelations.IsLower( getRelation(senderUser, targetUser) , newCurrentRelation)) 
                    {
                        setDiplomaticEntityState(senderUser, targetUser, newCurrentRelation);
                        relations.Add(new DiplomaticRelation(senderUser.GetHashCode(), targetUser.GetHashCode(), (int)newCurrentRelation));
                    }
                    if (UserRelations.IsLower(getRelation(targetUser, senderUser) , newCurrentRelation))
                    {
                        setDiplomaticEntityState(targetUser, senderUser, newCurrentRelation);
                        relations.Add(new DiplomaticRelation(targetUser.GetHashCode(), senderUser.GetHashCode(), (int)newCurrentRelation));
                    }
                }
            }


            //and senderDiplomaticEntity proposes "his" relation
            setDiplomaticEntityState(sender, target, relation);
            */

            foreach (var senderUser in sender.GetAllEntities())
            {
                foreach (var targetUser in target.GetAllEntities())
                {
                    setDiplomaticEntityState(senderUser, targetUser, relation);
                    relations.Add(new DiplomaticRelation(senderUser.GetHashCode(), targetUser.GetHashCode(), (int)relation));
                    /*
                    if (UserRelations.IsLower(getRelation(senderUser, targetUser), newCurrentRelation))
                    {
                        setDiplomaticEntityState(senderUser, targetUser, newCurrentRelation);
                        relations.Add(new DiplomaticRelation(senderUser.GetHashCode(), targetUser.GetHashCode(), (int)newCurrentRelation));
                    }
                    if (UserRelations.IsLower(getRelation(targetUser, senderUser), newCurrentRelation))
                    {
                        setDiplomaticEntityState(targetUser, senderUser, newCurrentRelation);
                        relations.Add(new DiplomaticRelation(targetUser.GetHashCode(), senderUser.GetHashCode(), (int)newCurrentRelation));
                    }
                    */
                }
            }                        
        }

        // List<DiplomaticRelation> relations is needed to write result to DB
        // and to generate the xml in cases of war
        /// <summary>
        /// tr to change relation. 
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="diplEntId">the id </param>
        /// <param name="diplEntType">user 0 or aliance 1</param>
        /// <param name="relation"> new target relation</param>
        /// <param name="relations">Is needed to write result to DB (and generate XML?) </param>
        /// <returns></returns>
        public bool trySetRelation(int userId, int diplEntId, int diplEntType, Relation relation, List<SpacegameServer.Core.DiplomaticRelation> relations)
        {
            //List<SpacegameServer.Core.DiplomaticRelation> relations = new List<SpacegameServer.Core.DiplomaticRelation>();

            Core core = Core.Instance;
            DiplomaticEntity senderEntity;
            DiplomaticEntity targetEntity;
            //check sender exists
            if (!core.users.ContainsKey(userId)) return false;
            User user = core.users[userId];

            //check if user has diplomatic rights
            if (!user.getMemberRight(null).hasDiplomaticRigths()) return false;

            senderEntity = user.group == null ? user : (DiplomaticEntity)user.group;

            
            //check target(s) exists and that target is not part of a group
            if (diplEntType == 1)
            {
                if (!core.users.ContainsKey(diplEntId)) return false;
                if (core.users[diplEntId].group != null) return false;
                targetEntity = core.users[diplEntId];
            }
            else
            {
                if (!core.alliances.ContainsKey(diplEntId)) return false;
                if (core.alliances[diplEntId].group != null) return false;
                targetEntity = core.alliances[diplEntId];
            }

            //check that both are not part of the same alliance
            if (senderEntity == targetEntity) return false;

            
            //do the change on DiplomaticEntities
            SetRelation(senderEntity, targetEntity, relation,  relations);

            //and write:
            Core.Instance.dataConnection.saveDiplomaticEntities(relations);

            return true; 
        }


        /// <summary>
        /// get all other users and their current! relation towards user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        /// <remarks>Is used to determine if enemies are on a field, or if goods transfer is allowed</remarks>
        public List<KeyValuePair<int, Relation>> getUserRelationsForUser(User user)
        {
            //ToDo: Repair / remove - UnitTest. Seems to be defect for alliance members that joined an alliance that was already at war
            List<KeyValuePair<int, Relation>> relations = new List<KeyValuePair<int, Relation>>();

            if (!DiplomaticEntityState.ContainsKey(user)) return relations;
         
            foreach( var targetUser in DiplomaticEntityState[user])
            {
                if (targetUser.Key.diplomaticType != 1) continue;

                //overallRelation is the Minimum of user relations towards target and target relation towards user
                var overallRelation = targetUser.Value;
                if (DiplomaticEntityState.ContainsKey(targetUser.Key) 
                    && DiplomaticEntityState[targetUser.Key].ContainsKey(user))
                {
                    overallRelation = Min(overallRelation, DiplomaticEntityState[targetUser.Key][user]);
                }

                relations.Add(new KeyValuePair<int, Relation>(targetUser.Key.id, overallRelation));
            }            

            return relations;
        }

   
        
        
        /// <summary>
        /// Gets a bidirectional relation between user and target. Traverses recursively up, so that alliance relations are used
        /// </summary>
        /// <param name="user"></param>
        /// <param name="target"></param>
        /// <returns></returns>
        private FullDiplomaticRelationProposals getFullDiplomaticRelationProposals(DiplomaticEntity user, DiplomaticEntity target)
        {
            //fetch user parent data
            if (user.group != null) {
                
                FullDiplomaticRelationProposals proposal = getFullDiplomaticRelationProposals(user.group, target);
                proposal.sender = user;
                proposal.target = target;
                return proposal;
            }

            //fetch target parent data
            if (target.group != null)
            {

                FullDiplomaticRelationProposals proposal = getFullDiplomaticRelationProposals(user, target.group);
                proposal.sender = user;
                proposal.target = target;
                return proposal;
            }

            //no more parents left - fetch data
            Relation offer = Relation.Neutral;
            Relation received = Relation.Neutral;
            Relation current = Relation.Neutral;

            if (DiplomaticEntityState.ContainsKey(user) && DiplomaticEntityState[user].ContainsKey(target))
            {
                offer = DiplomaticEntityState[user][target];
            }

            if (DiplomaticEntityState.ContainsKey(target) && DiplomaticEntityState[target].ContainsKey(user))
            {
                received = DiplomaticEntityState[target][user];
            }

            if (target is User)
            {
                if (((User)target).AiId > 0 && ((User)target).AiRelation < (int)Relation.Neutral)
                {
                    received = UserRelations.Min(received, ((Relation)((User)target).AiRelation));
                }
            }

            current = Min(offer, received);

            FullDiplomaticRelationProposals fullDiplomatics = new FullDiplomaticRelationProposals(
                user,
                target,
                (int)offer,
                (int)received,
                (int)current
                );

            return fullDiplomatics;
        }


        /// <summary>
        /// returns a set of bidirectional relations including proposals for one user: All other users are returned!
        /// </summary>
        /// <param name="user">the user that needs the information</param>
        /// <param name="type">null: all, 1 = users, 2 = alliances</param>
        /// <returns>a list containg all relations</returns>     
        public List<FullDiplomaticRelationProposals> getAllDiplomatics(User user, int? type = null)
        {
            List<int> detectedUsers = new List<int>();
            List<FullDiplomaticRelationProposals> relations = new List<FullDiplomaticRelationProposals>();

            //Add Users
            if (type != 2)
            {
                foreach (var coreUser in Core.Instance.users)
                {
                    relations.Add(getFullDiplomaticRelationProposals(user, coreUser.Value));
                }
            }

            //Add alliances
            if (type != 1)
            {
                foreach (var coreAlliance in Core.Instance.alliances)
                {
                    relations.Add(getFullDiplomaticRelationProposals(user, coreAlliance.Value));
                }
            }

            return relations;      
        }

        //returns a set of bidirectional relations including proposals for one user
        // type defines if user, alliances or both are returned
        // type  1 = alliances
        public List<FullDiplomaticRelationProposals> getDiplomatics(User user, int? type = null)
        {
            List<FullDiplomaticRelationProposals> relations = new List<FullDiplomaticRelationProposals>();

            //if user is part of an alliance, only alliance diplomatics are used.
            //but the user-to-user-Contacts are also needed to give the current state between users
            //users are fetched first, but then overwritten by alliance to user data if needed:
            if (!DiplomaticEntityState.ContainsKey(user)) return relations;

            foreach (var targetUser in DiplomaticEntityState[user])
            {
                if (type != null && targetUser.Key.diplomaticType != type) continue;

                //overallRelation is the Minimum of user relations towards target and target relation towards user
                var myRelation = targetUser.Value;
                var overallRelation = Relation.Neutral;
                var hisRelation = Relation.Neutral;
                if (DiplomaticEntityState.ContainsKey(targetUser.Key)
                    && DiplomaticEntityState[targetUser.Key].ContainsKey(user))
                {
                    overallRelation = Min(myRelation, DiplomaticEntityState[targetUser.Key][user]);
                    hisRelation = DiplomaticEntityState[targetUser.Key][user];
                }

                relations.Add(new FullDiplomaticRelationProposals(
                        user,
                        targetUser.Key,
                        (int)myRelation,
                        (int)hisRelation,
                        (int)overallRelation
                        )
                    );
            }

            //overwrite with diplomatic proposals towards the users alliance if needed:
            if (type == 1 && user.group != null)
            {
                if (!DiplomaticEntityState.ContainsKey(user.group)) return relations;

                foreach (var targetUser in DiplomaticEntityState[user.group])
                {
                    if (targetUser.Key.diplomaticType == 2) continue;
                    if (relations.Any(e=> e.target.id == targetUser.Key.id))
                    {
                        var rel = relations.Find(e=> e.target.id == targetUser.Key.id);
                        rel.relationSenderProposal = (int)targetUser.Value;

                        
                        rel.relationTargetProposal = DiplomaticEntityState.ContainsKey(targetUser.Key) &&  DiplomaticEntityState[targetUser.Key].ContainsKey(user.group) ?
                            (int)DiplomaticEntityState[targetUser.Key][user.group] :
                            (int)Relation.Neutral;
                    }

                }
            }


            return relations;
        }

        //only alliance2alliance relations
        public List<FullDiplomaticRelationProposals> getDiplomatics(Alliance alliance, bool includeProposals = true)
        {
            List<FullDiplomaticRelationProposals> relations = new List<FullDiplomaticRelationProposals>();

            //id user is part of an alliance, only alliance diplomatics are used.
            //but the user-to-user-Contacts are also needed to give the current state between users
            //users are fetched first, but then overwritten by alliance to user data if needed:
            //if (!DiplomaticEntityState.ContainsKey(alliance)) return relations;

            //DiplomaticEntityState[alliance] contains state (if that is changed) and offers from alliance towards other alliances 
            if (DiplomaticEntityState.ContainsKey(alliance))
            {
                foreach (var targetUser in DiplomaticEntityState[alliance])
                {

                    //only fetch alliances
                    if (targetUser.Key.diplomaticType != 2) continue;

                    //overallRelation is the Minimum of user relations towards target and target relation towards user
                    var myRelation = targetUser.Value;
                    var overallRelation = Relation.Neutral;
                    var hisRelation = Relation.Neutral;
                    if (DiplomaticEntityState.ContainsKey(targetUser.Key)
                        && DiplomaticEntityState[targetUser.Key].ContainsKey(alliance))
                    {
                        overallRelation = Min(myRelation, DiplomaticEntityState[targetUser.Key][alliance]);
                        hisRelation = DiplomaticEntityState[targetUser.Key][alliance];
                    }

                    relations.Add(new FullDiplomaticRelationProposals(
                            alliance,
                            targetUser.Key,
                            (int)myRelation,
                            (int)hisRelation,
                            (int)overallRelation
                            )
                        );
                }
            }
            //fetch offers from other alliances towards this alliance
            if (includeProposals)
            { 
                foreach (var AllianceRelations in DiplomaticEntityState)
                {
                    if (AllianceRelations.Key.diplomaticType != 2) continue;
                    if (AllianceRelations.Key == alliance) continue;
                
                    //if other alliance is contained in own relations, continue, since it is no offer
                    if (DiplomaticEntityState.ContainsKey(alliance) && DiplomaticEntityState[alliance].ContainsKey(AllianceRelations.Key)) continue;

                    foreach (var OtherRelation in AllianceRelations.Value)
                    {
                        //only offers towards alliance are interesting
                        if (OtherRelation.Key.diplomaticType != 2) continue;
                    
                        //offers towards other alliances are not interesting
                        if (OtherRelation.Key != alliance) continue;

                        relations.Add(new FullDiplomaticRelationProposals(
                            alliance,
                            AllianceRelations.Key,
                            (int)Relation.Neutral,
                            (int)OtherRelation.Value,
                            (int)Relation.Neutral
                            )
                        );
                    }
                }
            }

            return relations;
        }

        //returns a set of bidirectional relations including proposals between two users
        public FullDiplomaticRelationProposals getDiplomaticsToUser(User user, User targetUser)
        {
            return getFullDiplomaticRelationProposals(user, targetUser);
        }

        //returns absolute relation (no proposals)
        public Relation getRelation(DiplomaticEntity user, DiplomaticEntity target)
        {
            Relation relation = Relation.Neutral;

            if (user == target) return Relation.AllianceMember;

            try
            {
                if (user.group != null) return getRelation(user.group, target);
                if (target.group != null) return getRelation(user, target.group);

                

                Relation userTowardsTarget = DiplomaticEntityState.ContainsKey(user)
                    && DiplomaticEntityState[user].ContainsKey(target) ? DiplomaticEntityState[user][target] : Relation.Neutral;

                if (user is User)
                {
                    if (((User)user).AiId > 0 && ((User)user).AiRelation < (int)Relation.Neutral)
                    {
                        userTowardsTarget = UserRelations.Min(userTowardsTarget, ((Relation)((User)user).AiRelation));
                    }
                }

                Relation targetTowardsUser = DiplomaticEntityState.ContainsKey(target)
                    && DiplomaticEntityState[target].ContainsKey(user) ? DiplomaticEntityState[target][user] : Relation.Neutral;

                if (target is User)
                {
                    if (((User)target).AiId > 0 && ((User)target).AiRelation < (int)Relation.Neutral)
                    {
                        targetTowardsUser = UserRelations.Min(targetTowardsUser, ((Relation)((User)target).AiRelation));
                    }
                }

                relation = Min(userTowardsTarget, targetTowardsUser);

            }
            catch(Exception ex)
            {
                var userStr = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(user);
                SpacegameServer.Core.Core.Instance.writeToLog(userStr);

                var targetStr = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(user);
                SpacegameServer.Core.Core.Instance.writeToLog(targetStr);

                var DiplomaticEntityStateStr = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(DiplomaticEntityState);
                SpacegameServer.Core.Core.Instance.writeToLog(DiplomaticEntityStateStr);

                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
            return relation;
        }

        public Relation getRelation(int userId, int targetId)
        {
            DiplomaticEntity user, target;
            user = Core.Instance.users[userId];
            target = Core.Instance.users[targetId];
            return getRelation(user, target);       
        }

        /*
        public bool hasContact(DiplomaticEntity user, DiplomaticEntity target)
        {
            return (DiplomaticEntityState.ContainsKey(user) && DiplomaticEntityState[user].ContainsKey(target));
        }
        */
        /// <summary>
        /// delete if an alliance is deleted or a player banned
        /// </summary>
        /// <param name="toRemove"></param>
        public void removeEntity(DiplomaticEntity toRemove)
        {
            if(!DiplomaticEntityState.ContainsKey(toRemove)) return ;

            //first remove all relations towards the DiplomaticEntity
            ConcurrentDictionary<DiplomaticEntity, Relation> targets = DiplomaticEntityState[toRemove];
            foreach (var target in targets)
            {
                if (DiplomaticEntityState.ContainsKey(target.Key))
                {
                    DiplomaticEntityState[target.Key].TryRemove(toRemove);
                }
            }
            //now remove DiplomaticEntity
            DiplomaticEntityState.TryRemove(toRemove);            
            return;
        }

        //sender asks information about target user
        //only non neutral relations and only relations where both parties are known to the sender
        public List<SpacegameServer.BC.XMLGroups.UserRelation> getUserDiplomatics(User sender, User target)
        {
            List<SpacegameServer.BC.XMLGroups.UserRelation> relations = new List<SpacegameServer.BC.XMLGroups.UserRelation>();

            foreach (var targetRelation in this.getDiplomatics(target,1))
            {
                if (targetRelation.relation != 2)
                {

                    relations.Add(new SpacegameServer.BC.XMLGroups.UserRelation(
                        targetRelation.target.id,
                        targetRelation.relation));
                    
                }
            }
            return relations;
        }

        //sender asks information about target alliance
        //only non neutral relations
        public List<SpacegameServer.BC.XMLGroups.AllianceRelation> getAllianceDiplomatics(Alliance target)
        {
            List<SpacegameServer.BC.XMLGroups.AllianceRelation> relations = new List<SpacegameServer.BC.XMLGroups.AllianceRelation>();

            foreach (var targetRelation in this.getDiplomatics(target, false))
            {
                if (targetRelation.relation != 2)
                {
                    relations.Add(new SpacegameServer.BC.XMLGroups.AllianceRelation(
                        targetRelation.target.id,
                        targetRelation.relation));

                }
            }
            return relations;
        }

        /// <summary>
        /// Gets a List of DiplomaticEntities that are in a non neutral state to the sender DiplomaticEntity
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="target"></param>
        /// <returns></returns>
        public List<FullDiplomaticRelationProposals> getAllContacts(DiplomaticEntity sender, Relation? filter = null)
        {                       
            //fetch user parent data
            if (sender.group != null)
            {
                return getAllContacts(sender.group, filter);                
            }

            List<FullDiplomaticRelationProposals> Diplomatics = new List<FullDiplomaticRelationProposals>(); 
            if (DiplomaticEntityState.ContainsKey(sender))
            {
                foreach (var contact in DiplomaticEntityState[sender])
                {
                    if (filter != null)
                    {
                        if (contact.Value != filter) continue;
                    }

                    FullDiplomaticRelationProposals Prop = new FullDiplomaticRelationProposals(sender, contact.Key, (int)contact.Value, (int)contact.Value, (int)contact.Value);
                    Diplomatics.Add(Prop);
                }
            }

            return Diplomatics;
        }

    }



}
