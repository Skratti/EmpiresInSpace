using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC.XMLGroups
{
    public class Messages
    {
        [XmlElement(ElementName = "messageBody")]
        public List<Core.MessageBody> messages;

        public Messages()
        {
            messages = new List<Core.MessageBody>();
        }
    }

    [XmlRoot(ElementName = "messageIds")]
    public class SendMessage
    {
        public int newMessageId;
        public int newMessagePartId;
        public SendMessage()
        {

        }
    }

    public class messageHeader
    {
        public int id { get; set; }

        public int? sender { get; set; }

        public int addressee { get; set; }

        public string headline { get; set; }

        public int read { get; set; }

        public short messageType { get; set; }

        public System.DateTime sendingDate { get; set; }

        public string MessageParticipants { get; set; }

        public messageHeader()
        {

        }
        public messageHeader(Core.MessageHead original, Core.User user)
        {
            this.id = original.id;
            this.sender = original.sender;
            
            //a bit complext, because users can send messages to themselves - meaning that sender and addressee are the same
            this.addressee = original.sender != user.id ? user.id :
                 original.messageParticipants.Any(e => e.participant != user.id) ?
                    original.messageParticipants.First(e => e.participant != user.id).participant :
                    user.id;
            this.headline = original.headline;
            this.read = original.messageParticipants.First(e => e.participant == user.id).read ? 1 : 0;
            this.messageType = original.messagetype;
            this.sendingDate = original.sendingdate;

            this.MessageParticipants = "";
            foreach(var part in original.messageParticipants)
            {
                MessageParticipants += (part.participant.ToString() + ";");
            }
        }
        
    }

    [XmlRoot(ElementName = "messages")]
    public class messageExport
    {
        public int amount { get; set; }

        [XmlElement(ElementName = "message")]
        public List<messageHeader> messages;

        public messageExport()
        {
            messages = new List<messageHeader>();
            amount = 0;
        }
    }
}