using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.BC
{
    class Alliance
    {       
        public static string createAlliance(Core.User user, string allianceName)
        {
            string ret = "";

            Core.Alliance.createAlliance(user, allianceName);

            SpacegameServer.BC.XMLGroups.AllianceFullData allianceInfo = SpacegameServer.BC.XMLGroups.AllianceFullData.createFullData(user);

            allianceInfo.commNodes = new XMLGroups.CommNodes();
            allianceInfo.commNodes.commNode = new List<XMLGroups.CommNode>();
            allianceInfo.commNodes.commNode.Add(XMLGroups.CommNode.createAllianceCommNode(user));


            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.AllianceFullData>(allianceInfo, ref ret, true);

            return ret;
        }

        public static string joinAlliance(Core.User user, int allianceId)
        {
            string ret = "";

            Core.Alliance.joinCheck(user, allianceId);

            SpacegameServer.BC.XMLGroups.AllianceFullData allianceInfo = SpacegameServer.BC.XMLGroups.AllianceFullData.createFullData(user);

            allianceInfo.commNodes = new XMLGroups.CommNodes();
            allianceInfo.commNodes.commNode = new List<XMLGroups.CommNode>();
            allianceInfo.commNodes.commNode.Add(XMLGroups.CommNode.createAllianceCommNode(user));

            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.AllianceFullData>(allianceInfo, ref ret, true);

            return ret;

        }

        public static string leaveAlliance(Core.User user, Core.User userToRemove, int allianceId)
        {
            string xml = "";

            Core.Alliance.leaveCheck(user, userToRemove, allianceId);

            SpacegameServer.BC.XMLGroups.AllianceFullData allianceInfo = SpacegameServer.BC.XMLGroups.AllianceFullData.createFullData(user);
            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.AllianceFullData>(allianceInfo, ref xml, true);

            return xml;
        }


        public static string getAllianceDetails(int userId, int targetUserId)
        {
            /*

        <UserDetails>
          <userId>157</userId>
          <description>BlahBlahBlub</description>
          <relation>
            <UserRelation>
              <Id>186</Id>
              <State>0</State>
            </UserRelation>
            <UserRelation>
              <Id>235</Id>
              <State>2</State>
            </UserRelation>
            <UserRelation>
              <Id>253</Id>
              <State>3</State>
            </UserRelation>
          </relation>
        </UserDetails>

            {"userId":157,"description":"BlahBlahBlub","relation":[{"Id":186,"State":0},{"Id":235,"State":2},{"Id":253,"State":3}]}
            
            */


            BC.XMLGroups.AllianceDetails relations = new BC.XMLGroups.AllianceDetails();

            if (!Core.Core.Instance.users.ContainsKey(userId)) return "<relations></relations>";
            if (!Core.Core.Instance.alliances.ContainsKey(targetUserId)) return "<relations></relations>";


            Core.Alliance targetAlliance = Core.Core.Instance.alliances[targetUserId];

            relations.description = targetAlliance.description;
            relations.allianceId = targetAlliance.id;


            relations.relation = Core.Core.Instance.userRelations.getAllianceDiplomatics( targetAlliance);


            string x = "";
            //BusinessConnector.Serialize<BC.XMLGroups.UserDetails>(relations, ref x, true);
            x = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(relations);

            return x;
        }
    }
}
