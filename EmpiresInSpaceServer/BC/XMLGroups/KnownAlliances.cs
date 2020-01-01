using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC.XMLGroups
{
    /*
     <allianceDiplomacy>
      <allianceDetail>
        <id>5</id>
        <name>Centaurus Hive</name>
        <allianceOwner>157</allianceOwner>
        <overallVicPoints>0</overallVicPoints>
        <overallRank>1</overallRank>
      </allianceDetail>
    </allianceDiplomacy>

     * */
    public class KnownAlliances
    {
        [XmlElement("allianceDetail")]
        public List<AllianceDetail> allianceDetail;
        public bool ShouldSerializeallianceDetail()
        {
            return allianceDetail.Count > 0;
        }

        public KnownAlliances() { }

        public static KnownAlliances createAllianceContacts(Core.User player)
        {
            KnownAlliances allianceDiplomacy = new KnownAlliances();
            allianceDiplomacy.allianceDetail = new List<AllianceDetail>();


            //create an entry for each allianceId
            foreach (var alliance in Core.Core.Instance.alliances.Values)
            {
                allianceDiplomacy.allianceDetail.Add(
                    new AllianceDetail(alliance.id, alliance.NAME,
                        alliance.allianceowner ?? 0,
                        alliance.overallVicPoints,
                        alliance.overallRank)
                    );
            }

            return allianceDiplomacy;
        }

        public static KnownAlliances createAllianceContactsOld(Core.User player)
        {
            KnownAlliances allianceDiplomacy = new KnownAlliances();
            allianceDiplomacy.allianceDetail = new List<AllianceDetail>();

            HashSet<int> knownAlliances = new HashSet<int>();

            //first add player alliance
            if (player.allianceId > 0) knownAlliances.Add(player.allianceId);

            //get all contacts, get their allianecIds:
            var targetRelations = Core.Core.Instance.userRelations.getDiplomatics(player, 1);
            foreach (var targetRelation in targetRelations)
            {
                var targetUser = (Core.User)targetRelation.target;
                if (targetUser.allianceId != 0) knownAlliances.Add(targetUser.allianceId);
            }

            //create an entry for each allianceId
            foreach (var allianceId in knownAlliances)
            {
                if (!Core.Core.Instance.alliances.ContainsKey(allianceId)) continue;
                var alliance = Core.Core.Instance.alliances[allianceId];

                allianceDiplomacy.allianceDetail.Add(
                    new AllianceDetail(alliance.id, alliance.NAME,
                        alliance.allianceowner ?? 0,
                        alliance.overallVicPoints,
                        alliance.overallRank)
                    );
            }


            return allianceDiplomacy;
        }
    }

    public class AllianceDetail
    {
        public int id;
        public string name;
        public int allianceOwner;
        public int overallVicPoints;
        public int overallRank;

        public AllianceDetail()
        {

        }

        public AllianceDetail(int id,
            string name,
            int allianceOwner,           
            int overallVicPoints,
            int overallRank)
        {
            this.id = id;
            this.name = String.IsNullOrEmpty(name) ? "..." : name;
            this.allianceOwner = allianceOwner;          
            this.overallVicPoints = overallVicPoints;
            this.overallRank = overallRank;            
        }

    }
}
