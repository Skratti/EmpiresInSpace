using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.BC.XMLGroups
{
    public class AllianceInvite
    {
        public int userId;
        public int allianceId;

        public AllianceInvite()
        {

        }
        public AllianceInvite(int userId, int allianceId)
        {
            this.userId = userId;
            this.allianceId = allianceId;
        }
    }

    public class AllianceInvites
    {
        [System.Xml.Serialization.XmlElement("allianceInvite")]
        public List<AllianceInvite> allianceInvite;
        public bool ShouldSerializeuserId()
        {
            return allianceInvite != null && allianceInvite.Count > 0;
        }
        public AllianceInvites()
        {

        }

        public static AllianceInvites createAllianceInvites(Core.User player)
        {            
            AllianceInvites invites = new AllianceInvites();
            invites.allianceInvite = new List<AllianceInvite>();

            if (player.allianceId != 0)
            {
                if (Core.Core.Instance.invitesPerAlliance.ContainsKey(player.allianceId))
                {
                    foreach (var invite in Core.Core.Instance.invitesPerAlliance[player.allianceId])
                    {
                        invites.allianceInvite.Add(new AllianceInvite(invite, player.allianceId));
                    }
                }
            }

            if (Core.Core.Instance.invitesPerUser.ContainsKey(player.id))
            {
                foreach (var invite in Core.Core.Instance.invitesPerUser[player.id])
                {
                    invites.allianceInvite.Add(new AllianceInvite(player.id, invite));
                }
            }

            return invites;
        }

    }
}
