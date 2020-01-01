using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

//contains all classes and methods handling communication nodes
namespace SpacegameServer.Core
{
    public partial class CommNodeUser
    {

        private int _userid;

        private int _commnodeid;

        private bool _readaccess;

        private bool _writeaccess;

        private int _lastreadmessage;

        private bool _informwhennew;

        public CommNodeUser()
        {
        }
        public CommNodeUser(int userId, int commNodeId, bool readAccess = true, bool writeAccess = true, int lastReadMessage = 0, bool informWhenNew = true)
        {
            this.userId = userId;
            this.commNodeId = commNodeId;

            this.readAccess = readAccess;
            this.writeAccess = writeAccess;
            this.lastReadMessage = lastReadMessage;
            this.informWhenNew = informWhenNew;
        }


        public static System.Data.DataTable createDataTable()
        {
            var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "userId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "commNodeId");
            dataTable.AddColumn(System.Type.GetType("System.Boolean"), "readAccess");
            dataTable.AddColumn(System.Type.GetType("System.Boolean"), "writeAccess");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "lastReadMessage");
            dataTable.AddColumn(System.Type.GetType("System.Boolean"), "informWhenNew");

            return dataTable;
        }

        public object createData()
        {
            return new
            {
                this.userId,                
                this.commNodeId,                
                this.readAccess,
                this.writeAccess,
                this.lastReadMessage,
                this.informWhenNew
            };
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
        public int commNodeId
        {
            get
            {
                return this._commnodeid;
            }
            set
            {
                if ((this._commnodeid != value))
                {
                    this._commnodeid = value;
                }
            }
        }
        public bool readAccess
        {
            get
            {
                return this._readaccess;
            }
            set
            {
                if ((this._readaccess != value))
                {
                    this._readaccess = value;
                }
            }
        }
        public bool writeAccess
        {
            get
            {
                return this._writeaccess;
            }
            set
            {
                if ((this._writeaccess != value))
                {
                    this._writeaccess = value;
                }
            }
        }
        public int lastReadMessage
        {
            get
            {
                return this._lastreadmessage;
            }
            set
            {
                if ((this._lastreadmessage != value))
                {
                    this._lastreadmessage = value;
                }
            }
        }
        public bool informWhenNew
        {
            get
            {
                return this._informwhennew;
            }
            set
            {
                if ((this._informwhennew != value))
                {
                    this._informwhennew = value;
                }
            }
        }

        public bool adminRights
        {
            get
            {
                return true;
            }
            set
            {               
            }
        }

        

    }

    
    public partial class CommunicationNodeMessage
    {

        private int _id;

        private int _commnodeid;

        private System.Nullable<int> _sender;

        private string _headline;

        private string _messagebody;

        private System.DateTime _sendingdate;

        public CommunicationNodeMessage()
        {
        }
        public CommunicationNodeMessage(int id, int commNodeId)
        {
            this.id = id;
            this.commNodeId = commNodeId;

        }

        public CommunicationNodeMessage(int commNodeId, System.Nullable<int> sender, string headLine, string messageBody)
        {
            this.id = (int)Core.Instance.identities.commNodeMessage.getNext();
            this.commNodeId = commNodeId;
            this.sender = sender;
            this.headline = headLine;
            this.messageBody = messageBody;
            this.sendingDate = DateTime.UtcNow;
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


        public int commNodeId
        {
            get
            {
                return this._commnodeid;
            }
            set
            {
                if ((this._commnodeid != value))
                {
                    this._commnodeid = value;
                }
            }
        }


        public System.Nullable<int> sender
        {
            get
            {
                return this._sender;
            }
            set
            {
                if ((this._sender != value))
                {
                    this._sender = value;
                }
            }
        }


        public string headline
        {
            get
            {
                return this._headline;
            }
            set
            {
                if ((this._headline != value))
                {
                    this._headline = value;
                }
            }
        }


        public string messageBody
        {
            get
            {
                return this._messagebody;
            }
            set
            {
                if ((this._messagebody != value))
                {
                    this._messagebody = value;
                }
            }
        }

        public System.DateTime sendingDate
        {
            get
            {
                return this._sendingdate;
            }
            set
            {
                if ((this._sendingdate != value))
                {
                    this._sendingdate = value;
                }
            }
        }


        public int newMessage
        {
            get
            {
                return 0;
            }
            set
            {
            }
        }
    }
    

    public partial class CommunicationNode : Lockable
    {

        private int _id;

        private System.Nullable<int> _userid;

        private string _NAME;

        private int _positionx;

        private int _positiony;

        private System.Nullable<int> _sysx;

        private System.Nullable<int> _sysy;

        private int _connectiontype;

        private int _connectionid;

        private bool _activ;

        private string _unformattedname;

        private System.Collections.Concurrent.ConcurrentDictionary<int, CommNodeUser> _commNodeUsers;

        private System.Collections.Concurrent.ConcurrentDictionary<int, CommunicationNodeMessage> _commNodeMessages;

        public CommunicationNode()
        {
        }

        public CommunicationNode(int id)
        {
            this.id = id;
            _commNodeUsers = new System.Collections.Concurrent.ConcurrentDictionary<int, CommNodeUser>();
            _commNodeMessages = new System.Collections.Concurrent.ConcurrentDictionary<int, CommunicationNodeMessage>();
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

        [XmlIgnoreAttribute]
        public System.Nullable<int> userId
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
        public int owner
        {
            get { return (int)(this._userid ?? 0); }
            set { }
        }

        [XmlIgnoreAttribute]
        public string name
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

        [XmlElement(ElementName = "name")]
        public string xmlName
        {
            get
            {
                return this._NAME ?? "NoName";
            }
            set
            {               
            }
        }


        public int positionX
        {
            get
            {
                return this._positionx;
            }
            set
            {
                if ((this._positionx != value))
                {
                    this._positionx = value;
                }
            }
        }
        public int positionY
        {
            get
            {
                return this._positiony;
            }
            set
            {
                if ((this._positiony != value))
                {
                    this._positiony = value;
                }
            }
        }
        /// <summary>
        /// System coordinates X
        /// </summary>
        [XmlIgnoreAttribute]
        public System.Nullable<int> sysX
        {
            get
            {
                return this._sysx;
            }
            set
            {
                if ((this._sysx != value))
                {
                    this._sysx = value;
                }
            }
        }
        [XmlIgnoreAttribute]
        public System.Nullable<int> sysY
        {
            get
            {
                return this._sysy;
            }
            set
            {
                if ((this._sysy != value))
                {
                    this._sysy = value;
                }
            }
        }
        public int systemX
        {
            get
            {
                return this._sysx ?? 0;
            }
            set
            {
                if ((this._sysx != value))
                {
                    this._sysx = value;
                }
            }
        }

        public int systemY
        {
            get
            {
                return this._sysy ?? 0;
            }
            set
            {
                if ((this._sysy != value))
                {
                    this._sysy = value;
                }
            }
        }

        public int connectionType
        {
            get
            {
                return this._connectiontype;
            }
            set
            {
                if ((this._connectiontype != value))
                {
                    this._connectiontype = value;
                }
            }
        }
        public int connectionId
        {
            get
            {
                return this._connectionid;
            }
            set
            {
                if ((this._connectionid != value))
                {
                    this._connectionid = value;
                }
            }
        }
        public bool activ
        {
            get
            {
                return this._activ;
            }
            set
            {
                if ((this._activ != value))
                {
                    this._activ = value;
                }
            }
        }

        

        [XmlIgnoreAttribute]
        public string unformattedName
        {
            get
            {
                return this._unformattedname;
            }
            set
            {
                if ((this._unformattedname != value))
                {
                    this._unformattedname = value;
                }
            }
        }

        [XmlElement(ElementName = "unformattedName")]
        public string xmlunformattedName
        {
            get
            {
                return String.IsNullOrEmpty(this._unformattedname) ? "NoName" : this._unformattedname;
            }
            set
            {
            }
        }

        public int messageCount
        {
            get
            {
                return this.commNodeMessages.Count;
            }
            set
            {
            }
        }

        [XmlIgnoreAttribute]
        public System.Collections.Concurrent.ConcurrentDictionary<int, CommNodeUser> commNodeUsers
        {
            get
            {
                return _commNodeUsers;
            }
            set
            {
                _commNodeUsers = value;
            }
        }
        [XmlIgnoreAttribute]
        public System.Collections.Concurrent.ConcurrentDictionary<int, CommunicationNodeMessage> commNodeMessages
        {
            get
            {
                return _commNodeMessages;
            }
            set
            {
                _commNodeMessages = value;
            }
        }

        private bool checkShipCoordinates(Ship ship)
        {
            //todo: compare system position
            // ToDo: set distance = 0
            //distance should be 0. < 2 is used, because Movement and check are send in two async requests, and the check may reach server before the movement is done
            if (!(Math.Abs(ship.posX - this.positionX) < 2
                && Math.Abs(ship.posY - this.positionY) < 2)
                ) return false;

            return true;
        }

        private bool addToNode(User user )
        {
            List<Lockable> elementsToLock = new List<Lockable>(1);
            elementsToLock.Add(this);
            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return false;
            }
            try
            {

                //add contact data from this commNode to users contacts:          
                /*
                foreach (var commNodeUser in this.commNodeUsers)
                {
                    User commUser = Core.Instance.users[commNodeUser.Key];
                    if (Core.Instance.userRelations.hasContact(user, commUser)) continue;

                    Core.Instance.userRelations.addUserRelation(user, commUser, newContacts);
                }
                

                //save new contact data:
                Core.Instance.dataConnection.saveDiplomaticEntities(newContacts);
                */

                //add User to CommNode
                var newUser = new CommNodeUser(user.id, this.id);
                this.commNodeUsers.TryAdd(user.id, newUser);
                user.commNodeRights.Add(this.id, newUser);

                //and save to DB:
                var toSave = new List<CommNodeUser>();
                toSave.Add(newUser);
                Core.Instance.dataConnection.saveCommNodeUsers(toSave);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }

            return true;
        }


        public bool checkAndAddUser(User user, Ship ship)
        {
            //check if user is just discovering this commnode. If yes, add him to the users of the commnode...   
            if (this.commNodeUsers.ContainsKey(user.id)) return false;

            if (!checkShipCoordinates( ship)) return false;
                
            return addToNode(user);

        }

        public void addUserAndSave(User user)
        {
            if (this.commNodeUsers.ContainsKey(user.id)) return;

            var nodeSave = new List<CommNodeUser>();
            
            //add User to CommNode
            var newUser = new CommNodeUser(user.id, this.id);
            this.commNodeUsers.TryAdd(user.id, newUser);
            user.commNodeRights.Add(this.id, newUser);

            nodeSave.Add(newUser);
            Core.Instance.dataConnection.saveCommNodeUsers(nodeSave);

        }


        public List<CommunicationNodeMessage> sendCommMessage(User user, string header, string body)
        {
            if (!this.commNodeUsers.ContainsKey(user.id)) return null;

            /*
            if (!user.commNodeRights.ContainsKey(this.id)
                || !user.commNodeRights[this.id].writeAccess) return null;
            */
            CommunicationNodeMessage newMessage = new CommunicationNodeMessage(this.id, user.id, header, body);
            if (!this.commNodeMessages.TryAdd(newMessage.id, newMessage)) return null;

            Core.Instance.dataConnection.saveCommNodeMessage(newMessage);


            
            if (Core.Instance.SendCommMessage != null)
            {
                var Serialized = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(newMessage);
                var otherUserIds = this.commNodeUsers.Where(e => e.Value.userId != user.id).Select(e => e.Value.userId).ToList();               
                object Ship = new { Message = Serialized };
                Core.Instance.SendCommMessage(Ship, otherUserIds);
            }



            //fetch all messages since the users lastReadMessage value. This will include the actual message, and all from other users written in the meantime.
            List<CommunicationNodeMessage> result = getCommMessages(user, -1, -1);
            return result;
        }

        
        /// <summary>
        ///     get all messages (within a range) for the user
        ///     Usersided messages count from 1 (the latest/newest) to @counted (the earliest) the "Nr" have nothing to do with the Id!!!
        /// </summary>
        /// <param name="userId">the user by id</param>
        /// <param name="fromNr">the message number in desc order - last message = 0</param>
        /// <param name="toNr">the oldest message (counted, not id)</param>
        /// <param name="messageHighestId">user has already all messages including this id. Newer ones have also ahve to be sent</param>
        /// <returns></returns>
        public List<CommunicationNodeMessage> getCommMessages(User user, int fromNr, int toNr)
        {            
            /*
            	problem (as with messages):
                Usersided messages count from 1 (the latest/newest) to @counted (the earliest) the "Nr" have nothing to do with the Id!!!
                @toNr = 150 means that we have to read the last 150 messages, and return those that are >= fromNumber
                @lastMessageId is needed to get newer messages than known during a getMessage-query which requests old messgaes...
                so it would also be possibe to request all messages from  @fromNr = 0 (the last posted) to @toNr = 0 (which means we have no messages defined), and also get all messages bigger than @lastMessageId
            */
            if (!this.commNodeUsers.ContainsKey(user.id)) return null;
            var commNodeUser = this.commNodeUsers[user.id];
            int messageHighestId = commNodeUser.lastReadMessage;


            List<CommunicationNodeMessage> result = new List<CommunicationNodeMessage>();

            Comparer<CommunicationNodeMessage> bc = Comparer<CommunicationNodeMessage>.Create((x, y) => y.id.CompareTo(x.id)); //x and y switched -> descending order
            var ordered = this.commNodeMessages.OrderBy(e => e.Value, bc) //order by id desc
                .Select((e, index) => new { Message = e, Index = index  }).ToList();  //assign index

            result = ordered.Where(e => ( e.Index >= fromNr && e.Index < toNr ) || ( e.Message.Value.id > messageHighestId)).Select(e => e.Message.Value).ToList();

            //get messageHighest, write it for the user
            int messageHighest = ordered.Count != 0 ? ordered.First().Message.Key : 0;
            commNodeUser.lastReadMessage = messageHighest;
            var toSave = new List<CommNodeUser>();
            toSave.Add(commNodeUser);
            Core.Instance.dataConnection.saveCommNodeUsers(toSave);

            return result;
        }

        public void commNodeNameChange() { }


        public static void createCommNodeBuilding(ColonyBuilding building)
        {
            if (building.buildingId != 8) return;

            CommunicationNode node = new CommunicationNode((int)Core.Instance.identities.commNode.getNext());

            node.userId = building.userId;
            node.name = building.colony.name;
            node.unformattedName = building.colony.name;

            node.positionX = building.colony.X;
            node.positionY = building.colony.Y;
            node.systemX = building.colony.SystemX;
            node.systemY = building.colony.SystemY;

            node.connectionType = 1;
            node.connectionId = building.id;
            node.activ = true;
           
            var instance = Core.Instance;
            instance.commNodes.TryAdd(node.id, node);

            //add to tree
            SpacegameServer.Core.NodeQuadTree.Field commNodeField2 = new SpacegameServer.Core.NodeQuadTree.Field(node.positionX, node.positionY);
            instance.nodeQuadTree.insertNode(commNodeField2, node.id);

            //add CommNodeUser
            CommNodeUser user = new CommNodeUser(building.userId, node.id);
            node.commNodeUsers.TryAdd(building.userId, user);
            instance.users[building.userId].commNodeRights.Add(node.id, user);

            instance.dataConnection.saveCommNode(node);

            building.node = node;
        }


        public static void CreateAllianceNode(Alliance alliance)
        {
            CommunicationNode node = new CommunicationNode((int)Core.Instance.identities.commNode.getNext());
            
            node.userId = alliance.allianceowner;
            node.name = alliance.NAME;
            node.unformattedName = alliance.NAME;

            node.connectionType = 4;
            node.connectionId = alliance.id;
            node.activ = true;

            var instance = Core.Instance;
            instance.commNodes.TryAdd(node.id, node);

            //add CommNodeUser
            CommNodeUser user = new CommNodeUser((int)alliance.allianceowner, node.id);
            node.commNodeUsers.TryAdd((int)alliance.allianceowner, user);
            instance.users[(int)alliance.allianceowner].commNodeRights.Add(node.id, user);

            instance.dataConnection.saveCommNode(node);
        }


        public static CommunicationNode GetAllianceNode(User user)
        {
            if (user.allianceId == 0) return null;
            if (!Core.Instance.commNodes.Any(e=>e.Value.connectionType == 4 && e.Value.connectionId == user.allianceId)) return null;

            return Core.Instance.commNodes.First(e => e.Value.connectionType == 4 && e.Value.connectionId == user.allianceId).Value;
        }

        public static CommunicationNode GetAllianceNode(Alliance alliance)
        {            
            if (!Core.Instance.commNodes.Any(e => e.Value.connectionType == 4 && e.Value.connectionId == alliance.id)) return null;

            return Core.Instance.commNodes.First(e => e.Value.connectionType == 4 && e.Value.connectionId == alliance.id).Value;
        }

    }
}
