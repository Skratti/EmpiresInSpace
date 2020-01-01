using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.BC
{
    internal class Message
    {
        SpacegameServer.Core.Core core;
        SpacegameServer.Core.User user;

        public Message( Core.User user)
        {
            this.user   = user;
            core = SpacegameServer.Core.Core.Instance;   
        }

        public string getCombatMessages(int fromNr, int toNr, int highestId)
        {
            
            List<Core.Combat> result;

            //no message present:
            fromNr -= 1;
            toNr -= 1;
            result = Core.Combat.getCombatMessages(user, fromNr, toNr, highestId);


            SpacegameServer.BC.XMLGroups.CombatMessages messages = new SpacegameServer.BC.XMLGroups.CombatMessages();

            //messages.messages = result;

            foreach (var x in result)
            {
                messages.messages.Add(Core.Combat.CloneWORounds(x));
            }

            string ret = "";
            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.CombatMessages>(messages, ref ret, true);


            ret = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(messages);
            return ret;
        }

        public string getCombatMessageRounds(int combatId)
        {

            Core.Combat result = Core.Combat.getCombatRounds(user, combatId);


            SpacegameServer.BC.XMLGroups.CombatMessages messages = new SpacegameServer.BC.XMLGroups.CombatMessages();
            messages.messages.Add(result);
            
            string ret = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(messages);
            return ret;
        }

        public void setAllMessageRead(int messageType)
        {
            if (messageType == 50)
            {
                foreach (var combat in Core.Core.Instance.combats.Where(c => c.Value.DefenderUserId == this.user.id && !c.Value.DefenderHasRead))
                {
                    combat.Value.DefenderHasRead = true;
                }
            }

            //Todo: Update normal messages as soon as they get implemented serversided

            Core.Core.Instance.dataConnection.updateAllMessageRead(messageType, this.user.id);
      
            return ;
        }

        public string getReceivedMessages(
            int userId,
            int fromNr,       // fromNr - toNumber create a span of messages that should be fetched (normally 50).0-50 are the moste current messages, 150-200 would be older ones. 
            int toNr,        // 
            int lastMessageId, // The highest ID that the user already got (if he is currently fetching older messages, unreceived newer ones should also be transferred
            int messageType)     // Filter for message type       
        {
            SpacegameServer.BC.XMLGroups.messageExport messages = new XMLGroups.messageExport();

            var allUserMessages = core.messages.Values.Where(e =>e.messagetype == messageType &&  e.messageParticipants.Any(p => p.participant == userId));
            var messagesSorted = allUserMessages.OrderByDescending(e => e.id);
            int messageCounter = 0;

            var messageList = messagesSorted.ToList();

            if (messageList.Count != 0)
            {
                foreach (var message in messagesSorted)
                {
                    messageCounter++;
                    if (messageCounter > toNr) break;

                    if (message.id > lastMessageId)
                    {
                        messages.messages.Add(new XMLGroups.messageHeader(message, user));
                        messages.amount++;
                    }
                    else
                    {
                        if (messageCounter > fromNr)
                        {
                            messages.messages.Add(new XMLGroups.messageHeader(message, user));
                            messages.amount++;
                        }
                    }
                }
            }

            string ret = "";
            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.messageExport>(messages, ref ret, true);
            return ret;
        }

        public string getMessagesText(int userId, int messageId)
        {
            SpacegameServer.BC.XMLGroups.Messages messages = new XMLGroups.Messages();

            var message = core.messages[messageId];

            //check that user is part of the conversation
            if (message.messageParticipants.Any(e => e.participant == userId))
            {
                messages.messages = message.messages;

                var participantToUpdate = message.messageParticipants.First(e => e.participant == userId);
                if (!participantToUpdate.read)
                {
                    participantToUpdate.read = true;

                    core.dataConnection.SaveMessageparticipant(participantToUpdate);
                }
            }

            string ret = "";
            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.Messages>(messages, ref ret, true);
            return ret;
        }

        /// <summary>
        /// creates a new message or adds a new messagePart to an existing conversation
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="addressee"></param>
        /// <param name="header"></param>
        /// <param name="body"></param>
        /// <param name="id"></param>
        /// <param name="messageType"></param>
        /// <param name="messageParticipants"></param>
        /// <returns>0 if no messagePart was created, else the messagePart-Id</returns>
        public string sendMessage(
            int userId,
            string header,
            string body,
            int id,
            int messageType,
            List<Core.MessageParticipants> messageParticipants)
        {

            Core.MessageBody part =  Core.Messages.sendMessage(userId, header, body, id, messageType, messageParticipants);

            string ret = "";

            if (part != null)
            {
                XMLGroups.SendMessage messageIds = new XMLGroups.SendMessage();
                messageIds.newMessageId = part.headerId;
                messageIds.newMessagePartId = part.messagePart;

                BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.SendMessage>(messageIds, ref ret, true);
            }

            return ret;
        }
    }
}
