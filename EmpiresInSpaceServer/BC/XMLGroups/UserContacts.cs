using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.BC.XMLGroups
{
    /*
     <knownUsers>
      <knownUser>
        <id>227</id>
        <username>Pferdchen</username>
        <currentRelation>1</currentRelation>
        <targetRelation>2</targetRelation>
        <otherUserRelationTowardsPlayer>1</otherUserRelationTowardsPlayer>
        <popVicPoints>57</popVicPoints>
        <researchVicPoints>0</researchVicPoints>
        <goodsVicPoints>23</goodsVicPoints>
        <shipVicPoints>10</shipVicPoints>
        <overallVicPoints>90</overallVicPoints>
        <overallRank>8</overallRank>
        <allianceId>0</allianceId>
      </knownUser>
    </knownUsers> 
     
     * */
    public class ChangeRelation
    {
        public UserContacts knownUsers;
        public AllianceUserRelations allianceRelations;

        [System.Xml.Serialization.XmlArrayItem("ship")]
        public List<SpacegameServer.Core.Ship> ships;        

        public ChangeRelation()
        {

        }
    }

    public class UserContacts
    {
        
        [System.Xml.Serialization.XmlArrayItem("knownUser")]
        public List<UserContact> knownUser;

        public bool ShouldSerializeknownUser()
        {
            return knownUser.Count > 0;
        }
        public UserContacts()
        {
            
        }


        /// <summary>
        /// creates a single contact information
        /// </summary>
        /// <param name="player">player</param>
        /// <param name="target">targetUser</param>
        /// <returns></returns>
        public static UserContacts createContact(Core.User player, Core.User targetUser)
        {
            UserContacts knownUsers = new UserContacts();
            knownUsers.knownUser = new List<UserContact>();

            SpacegameServer.Core.FullDiplomaticRelationProposals targetRelation = Core.Core.Instance.userRelations.getDiplomaticsToUser(player, targetUser);

            knownUsers.knownUser.Add(
                    new UserContact(targetUser.id, targetUser.username,
                        targetRelation.relation, targetRelation.relationSenderProposal, targetRelation.relationTargetProposal,
                //Math.Min(relations.Key, relations.Value), relations.Key, relations.Value,
                        targetUser.popVicPoints,
                        targetUser.researchVicPoints,
                        targetUser.goodsVicPoints,
                        targetUser.shipVicPoints,
                        targetUser.overallVicPoints,
                        targetUser.overallRank,
                        targetUser.allianceId,
                        targetUser.AiId,
                        targetUser.AiRelation,
                        targetUser.ProfileUrl)
                    );            
          
            return knownUsers;
        }


        /// <summary>
        /// creates a single contact information
        /// </summary>
        /// <param name="player"></param>
        /// <param name="target"></param>
        /// <returns></returns>
        public static UserContacts createContacts(Core.User player, int target)
        {
            UserContacts knownUsers = new UserContacts();
            knownUsers.knownUser = new List<UserContact>();

            foreach (var targetRelation in Core.Core.Instance.userRelations.getDiplomatics(player, 1))
            {
                Core.User targetUser = (Core.User)targetRelation.target;


                knownUsers.knownUser.Add(
                    new UserContact(targetUser.id, targetUser.username,
                        targetRelation.relation, targetRelation.relationSenderProposal, targetRelation.relationTargetProposal,
                        //Math.Min(relations.Key, relations.Value), relations.Key, relations.Value,
                        targetUser.popVicPoints,
                        targetUser.researchVicPoints,
                        targetUser.goodsVicPoints,
                        targetUser.shipVicPoints,
                        targetUser.overallVicPoints,
                        targetUser.overallRank,
                        targetUser.allianceId,
                        targetUser.AiId,
                        targetUser.AiRelation,
                        targetUser.ProfileUrl)
                    );

            }
            /*
            foreach(var targetRelation in Core.Core.Instance.userRelations.getUserRelationsForUser(player))
            {
                //skip others if single player data is requested
                if (target != 0 && targetRelation.Key != target) continue;
                Core.User targetUser = Core.Core.Instance.users[targetRelation.Key];

                var relations = Core.Core.Instance.userRelations.getProposals(player, targetUser);

                knownUsers.knownUser.Add(
                    new UserContact(targetUser.id, targetUser.username, 
                        Math.Min(relations.Key, relations.Value), relations.Key, relations.Value,
                        targetUser.popVicPoints,
                        targetUser.researchPoints,
                        targetUser.goodsVicPoints,
                        targetUser.shipVicPoints,
                        targetUser.overallVicPoints,
                        targetUser.overallRank,
                        targetUser.allianceId)
                    );

            }
            */
            return knownUsers;
        }

        /// <summary>
        /// creates all contact Informations
        /// </summary>
        /// <param name="player"></param>
        /// <returns></returns>
        public static UserContacts createAllContacts(Core.User player)
        {
            UserContacts knownUsers = new UserContacts();
            knownUsers.knownUser = new List<UserContact>();

            foreach (var targetRelation in Core.Core.Instance.userRelations.getAllDiplomatics(player,1))
            {


                Core.User targetUser = (Core.User)targetRelation.target;

                knownUsers.knownUser.Add(
                    new UserContact(targetUser.id, targetUser.username,
                        targetRelation.relation, targetRelation.relationSenderProposal, targetRelation.relationTargetProposal,
                    //Math.Min(relations.Key, relations.Value), relations.Key, relations.Value,
                        targetUser.popVicPoints,
                        targetUser.researchVicPoints,
                        targetUser.goodsVicPoints,
                        targetUser.shipVicPoints,
                        targetUser.overallVicPoints,
                        targetUser.overallRank,
                        targetUser.allianceId,
                        targetUser.AiId,
                        targetUser.AiRelation,
                        targetUser.ProfileUrl)
                    );
            }       
            return knownUsers;
        }

    }

    public class UserContact
    {
        public int id;
        public string username;
        public int currentRelation;
        public int targetRelation;
        public int otherUserRelationTowardsPlayer;
        public int popVicPoints;
        public int researchVicPoints;
        public int goodsVicPoints;
        public int shipVicPoints;
        public int overallVicPoints;
        public int overallRank;
        public int allianceId;
        public int AiId;
        public int AiRelation;
        public string ProfileUrl;

        public UserContact()
        {
            
        }

        public UserContact(int id,
            string username,
            int currentRelation,
            int targetRelation,
            int otherUserRelationTowardsPlayer,
            int popVicPoints,
            int researchVicPoints,
            int goodsVicPoints,
            int shipVicPoints,
            int overallVicPoints,
            int overallRank,
            int allianceId,
            int AiId,
            int AiRelation,
            string ProfileUrl)
        {
            this.id = id ;
            this.username = username ;
            this.currentRelation =currentRelation  ;
            this.targetRelation = targetRelation ;
            this.otherUserRelationTowardsPlayer = otherUserRelationTowardsPlayer ;
            this.popVicPoints = popVicPoints ;
            this.researchVicPoints = researchVicPoints ;
            this.goodsVicPoints = goodsVicPoints ;
            this.shipVicPoints = shipVicPoints ;
            this.overallVicPoints = overallVicPoints ;
            this.overallRank = overallRank ;
            this.allianceId = allianceId;
            this.AiId = AiId;
            this.AiRelation = AiRelation;
            this.ProfileUrl = ProfileUrl;
        }

    }

    public class UserDetails
    {
        public int userId;
        public string description;

        public List<UserRelation> relation;

        public UserDetails()
        {

        }
    }

    public class UserRelation{
        public int Id;
        public int State;

        public UserRelation()
        {

        }

        public UserRelation(int id, int state)
        {
            this.Id = id;
            this.State = state;
        }
    }
    public class AllianceUserRelations
    {
        public List<AllianceUserRelation> allianceUserRelations;
        public bool ShouldSerializeallianceUserRelations()
        {
            return allianceUserRelations.Count > 0;
        }

        public AllianceUserRelations(){}

        /// <summary>
        /// 
        /// </summary>
        /// <param name="player"></param>
        /// <returns></returns>
        public static AllianceUserRelations createAllianceUserRelations(Core.User player)
        {
            AllianceUserRelations relations = new AllianceUserRelations();
            relations.allianceUserRelations = new List<AllianceUserRelation>();
            /*
            List<SpacegameServer.Core.FullDiplomaticRelationProposals>  relations2 = Core.Core.Instance.userRelations.getDiplomatics(player, 2);
            */
            List<SpacegameServer.Core.FullDiplomaticRelationProposals> relations2;
            if (player.group != null)
            {
                relations2 = Core.Core.Instance.userRelations.getDiplomatics((Core.Alliance)player.group);
                //relations2 = Core.Core.Instance.userRelations.getAllDiplomatics(player);
            }
            else
            {
                relations2 = Core.Core.Instance.userRelations.getDiplomatics(player, 2);
                ///relations2 = Core.Core.Instance.userRelations.getAllDiplomatics(player); //todo: remove if
            }
            
            //List<SpacegameServer.Core.FullDiplomaticRelationProposals> relations2 = Core.Core.Instance.userRelations.getDiplomatics((Core.Alliance)player.group);

            foreach (var targetRelation in relations2)
            {
                relations.allianceUserRelations.Add(
                    new AllianceUserRelation(
                        targetRelation.target.id,
                        targetRelation.relationSenderProposal,
                        targetRelation.relationTargetProposal,
                        targetRelation.relation )
                    );

            }

            return relations;
        }
    }
    public class AllianceUserRelation
    {
        public int alliance;

        public int sendingRelation;
        public int targetRelation;
        public int currentRelation;    

        public AllianceUserRelation()
        {

        }

        public AllianceUserRelation(int alliance,
            int sendingRelation,
            int targetRelation,
            int currentRelation
         )
        {
            this.alliance = alliance;        
            this.currentRelation = currentRelation;
            this.targetRelation = targetRelation;
            this.sendingRelation = sendingRelation;      
        }

    }
}




