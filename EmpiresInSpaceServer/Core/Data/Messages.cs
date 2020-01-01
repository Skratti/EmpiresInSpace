using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{



    public class Messages
    {


        public static void getReceivedMessages(
            int userId ,
            int fromNr ,       // fromNr  the earliest already received message 
            int toNr   ,        // toNr 50 means 50 messages more to read (towards the past)  -> from . to counts backwards (current messages are already loaded, so fetch older ones with this call)
            int lastMessageId , // The highest ID that the user already got (if he is currently fetching oler messages, unreceived newer ones should also be transferred
            int messageType)     // Filter for message type       
        {

        }

        public static void getMessagesText(int userId , int messageId)
        {

        }

        public static MessageBody sendMessage(
            int userId ,
            string header,
            string body ,
            int id ,
            int messageType,
            List<MessageParticipants> messageParticipants)
        {
            Core core = Core.Instance;

            MessageHead head;
            int messagePartId = 0;
            if (id <= 0)
            {
                //completely new message
                int newId = (int)core.identities.message.getNext();
                head = new MessageHead(userId, header, newId, messageType);
                head.messageParticipants = messageParticipants;
                head.sendingdate = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);
                head.messagetype = (short)messageType;

                foreach (var participant in head.messageParticipants)
                {
                    participant.headerId = newId;
                    if (participant.participant == userId) participant.read = true;
                }

                core.messages.TryAdd(newId, head);
            }
            else
            {
                //new messagepart in a conversation
                if (!core.messages.ContainsKey(id) || (!core.messages[id].messageParticipants.Any(e => e.participant == userId))) return null;
                head = core.messages[id];           
                messagePartId = head.messages.OrderByDescending(e => e.messagePart).First().messagePart + 1;
            }

            //set all to unread except the sender
            foreach (var otherParticipant in head.messageParticipants.Where(e => e.participant != userId))
            {
                otherParticipant.read = false; 
            }

            MessageBody messagePart = new MessageBody();
            messagePart.headerId = head.id;
            messagePart.message = body;
            messagePart.sender = userId;
            messagePart.messagePart = messagePartId;
            messagePart.sendingDate = head.sendingdate;

            head.messages.Add(messagePart);

            core.dataConnection.SaveMessage(head);

            // send signal to online participants via websocket 
            // to reduce the signal size, only send the last messagePart and the messagehead/participants
            MessageHead toTransfer = new MessageHead(head.sender, head);
            toTransfer.messageParticipants = head.messageParticipants;
            toTransfer.messages.Add(head.messages.OrderByDescending(e => e.messagePart).First());

            List<int> users = toTransfer.messageParticipants.Where(e=>e.participant != userId).Select(e => e.participant).ToList();


            if (Core.Instance.SendMessage != null)
            {
                var Serialized = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(toTransfer);                
                object MessageEncapsulated = new { Message = Serialized };
                core.SendMessage(MessageEncapsulated, users);
            }

            

            
            return messagePart;
        }

    }
}
