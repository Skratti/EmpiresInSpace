using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.BC.XMLGroups
{
    public class AllianceFullData
    {
        public KnownAlliances allianceDiplomacy;
        public AllianceUserRelations allianceRelations;
        public AllianceInvites allianceInvites;
        public CommNodes commNodes;


        public AllianceFullData()
        {
        }

        public static AllianceFullData createFullData(Core.User user)
        {
            AllianceFullData fullData = new AllianceFullData();

            fullData.allianceDiplomacy = XMLGroups.KnownAlliances.createAllianceContacts(user);
            fullData.allianceRelations = XMLGroups.AllianceUserRelations.createAllianceUserRelations(user);
            fullData.allianceInvites = XMLGroups.AllianceInvites.createAllianceInvites(user);   
      
            return fullData;
        }

    }

    public class AllianceDetails
    {
        public int allianceId;
        public string description;

        public List<AllianceRelation> relation;

        public AllianceDetails()
        {

        }
    }

    public class AllianceRelation
    {
        public int Id;
        public int State;

        public AllianceRelation()
        {

        }

        public AllianceRelation(int id, int state)
        {
            this.Id = id;
            this.State = state;
        }
    }
}
