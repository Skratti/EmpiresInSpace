using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC.XMLGroups
{
    [XmlRoot(ElementName = "messages")]
    public class CommNodeMessages
    {
        [XmlElement("message")]
        public List<SpacegameServer.Core.CommunicationNodeMessage> message;

        public CommNodeMessages()
        {
            message = new List<Core.CommunicationNodeMessage>();
        }

    }
    public class CommNodeData
    {
        //public UserContacts xmlKnownUsers;
        public CommNodes commNodes;
        //public KnownAlliances allianceDiplomacy;
        //public AllianceUserRelations allianceRelations;
        public CommNodeData()
        {

        }
    }

    public class CommNodes
    {
        [System.Xml.Serialization.XmlElement("commNode")]
        public List<CommNode> commNode;

        public bool ShouldSerializecommNode()
        {
            return commNode.Count > 0;
        }

        public CommNodes()
        {

        }

        public static  List<CommNode> createKnownAndNearNodesList(Core.User user)
        {
            List<CommNode> commNodes = new List<CommNode>();

            //create known nodes
            foreach (var node in user.commNodeRights)
            {
                if (Core.Core.Instance.commNodes.ContainsKey(node.Key))
                {
                    CommNode xmlNode = CommNode.createCommNode(
                        Core.Core.Instance.commNodes[node.Key],
                        user);
                    commNodes.Add(xmlNode);
                }
            }

            //fetch nearby nodes
            SpacegameServer.Core.NodeQuadTree.BoundarySouthWest boundarySouthWest = new SpacegameServer.Core.NodeQuadTree.BoundarySouthWest(user.homeCoordX - 80, user.homeCoordY - 80);
            SpacegameServer.Core.NodeQuadTree.Bounding NodeQuadTreeBounding = new SpacegameServer.Core.NodeQuadTree.Bounding(boundarySouthWest, 160);

            List<int> nearby = Core.Core.Instance.nodeQuadTree.queryRange(NodeQuadTreeBounding);

            foreach (var id in nearby)
            {
                if (Core.Core.Instance.commNodes.ContainsKey(id))
                {
                    var node = Core.Core.Instance.commNodes[id];

                    if (node.commNodeUsers.ContainsKey(user.id)) continue;

                    CommNode xmlNode = CommNode.createCommNode(
                        node,
                        user);
                    
                    commNodes.Add(xmlNode);
                }
            }

            return commNodes;
        }

        public static List<CommNode> createSingleNodeList(Core.CommunicationNode node, Core.User user)
        {
            List<CommNode> commNodes = new List<CommNode>();
            //create known nodes
            if (Core.Core.Instance.commNodes.ContainsKey(node.id))
            {
                CommNode xmlNode = CommNode.createCommNode(
                    node,
                    user);
                commNodes.Add(xmlNode);
            }
            return commNodes;
        }
    }

    public class CommNode
    {
        /*
        public int id;
        public int owner;
        public string name;
        public string unformattedName;
        public int positionX;
        public int positionY;
        public System.Nullable<int> sysX;
        public System.Nullable<int> sysY;
        public int _connectiontype;
        public int _connectionid;
        public bool _activ;
        */
        public SpacegameServer.Core.CommunicationNode node;
        public SpacegameServer.Core.CommNodeUser commNodeUser;
        public int messageUnReadCount;
        public bool visited;

        public CommNode()
        {

        }

        

        public static CommNode createCommNode(SpacegameServer.Core.CommunicationNode node, SpacegameServer.Core.User user)
        {
            CommNode xmlNode = new CommNode();

            xmlNode.node = node;
            SpacegameServer.Core.CommNodeUser commNodeUser = node.commNodeUsers.ContainsKey(user.id) ?
                node.commNodeUsers[user.id] :
                new SpacegameServer.Core.CommNodeUser(user.id, node.id);

            xmlNode.commNodeUser = commNodeUser;
            
            xmlNode.visited = node.commNodeUsers.ContainsKey(user.id);
            xmlNode.messageUnReadCount = xmlNode.visited ? node.commNodeMessages.Count(e => e.Key > commNodeUser.lastReadMessage) : 0;

            return xmlNode;
        }

        public static CommNode createAllianceCommNode( SpacegameServer.Core.User user)
        {
            CommNode xmlNode = new CommNode();
            Core.CommunicationNode node = Core.CommunicationNode.GetAllianceNode(user);

            xmlNode.node = node;

            if (node.commNodeUsers.ContainsKey(user.id))
            {
                xmlNode.commNodeUser = node.commNodeUsers[user.id];
            }          

            xmlNode.visited = true;
            xmlNode.messageUnReadCount = xmlNode.visited ? node.commNodeMessages.Count(e => e.Key > node.commNodeUsers[user.id].lastReadMessage) : 0;

            return xmlNode;
        }

    }
}