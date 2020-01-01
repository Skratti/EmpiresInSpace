using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.BC
{
    internal class CommNode
    {

        SpacegameServer.Core.Core core;
        SpacegameServer.Core.User user;
        Core.CommunicationNode node;
        public CommNode(Core.CommunicationNode node, Core.User user)
        {
            this.node   = node;
            this.user   = user;
            core = SpacegameServer.Core.Core.Instance;   
        }

        
        public string getCommNodeMessages(int fromNr, int toNr)
        {
            /*
             * <messages>
              <message>
                <id>6</id>
                <commNodeId>936</commNodeId>
                <sender>157</sender>
                <headline>Title</headline>
                <messageBody>Today, the Prokyon Syndicate was founded.&lt;br /&gt;We are a small group of traders living near the Algol 550 space station, which is at the coordinates 5000|5000.&lt;br /&gt;Our products will soon be available at that station. I can especially recommend our high quality Yttrium metal. &lt;br /&gt;In addition, we are offering trade treaties to all peaceful dwellers of this galaxy. &lt;br /&gt;&lt;br /&gt;&lt;br /&gt;Yours sincerely,&lt;br /&gt;&lt;br /&gt;Skratti,&lt;br /&gt;CEO Prokyon Syndicate</messageBody>
                <sendingDate>2015-06-23T05:43:02</sendingDate>
                <newMessage>0</newMessage>
              </message>
              <message>
                <id>9</id>
                <commNodeId>936</commNodeId>
                <sender>186</sender>
                <headline>Title</headline>
                <messageBody>Dear neighbours!&lt;br /&gt;Yesterday a plebiscite of the inhabitants of sector 4980/4980 to 5000/5000 ended with clear decision to close the borders of the sektor for security reasons.&lt;br /&gt;Also, a security zone of one field around the sector will be established.&lt;br /&gt;&lt;br /&gt;Any ship entering the zone without previous declaration of intention, flight plan, destination and onboard cargo will be regarded as a thread and thus treated.&lt;br /&gt;&lt;br /&gt;Expect the diplomatic status to be changed to hostile in near future so al potentialy inevitable actions can be taken, if necessary.&lt;br /&gt;This dont mean you have to fear any thread as long you stand clear of the borders and security zone.</messageBody>
                <sendingDate>2015-06-26T19:19:56</sendingDate>
                <newMessage>0</newMessage>
              </message>
            </messages>
             * */


            /*
            *   <message>
                <id>1</id>
                <commNodeId>913</commNodeId>
                <sender>0</sender>
                <sendingdate>0001-01-01T00:00:00</sendingdate>
              </message>
             * */

            List<Core.CommunicationNodeMessage> result;

            //no message present:
            fromNr -= 1;
            toNr -= 1;
            result = node.getCommMessages(user, fromNr, toNr);

            //todo: convert result to response
            
            SpacegameServer.BC.XMLGroups.CommNodeMessages messages = new SpacegameServer.BC.XMLGroups.CommNodeMessages();
            /*foreach (var message in result )
            {
                messages.message.Add(message);
            }*/
            messages.message = result;

            string ret = "";
            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.CommNodeMessages>(messages, ref ret, true);

            return ret;
        }

        public string sendCommNodeMessages( string header, string body)
        {
            /*
             * <messages>
              <message>
                <id>6</id>
                <commNodeId>936</commNodeId>
                <sender>157</sender>
                <headline>Title</headline>
                <messageBody>Today, the Prokyon Syndicate was founded.&lt;br /&gt;We are a small group of traders living near the Algol 550 space station, which is at the coordinates 5000|5000.&lt;br /&gt;Our products will soon be available at that station. I can especially recommend our high quality Yttrium metal. &lt;br /&gt;In addition, we are offering trade treaties to all peaceful dwellers of this galaxy. &lt;br /&gt;&lt;br /&gt;&lt;br /&gt;Yours sincerely,&lt;br /&gt;&lt;br /&gt;Skratti,&lt;br /&gt;CEO Prokyon Syndicate</messageBody>
                <sendingDate>2015-06-23T05:43:02</sendingDate>
                <newMessage>0</newMessage>
              </message>
              <message>
                <id>9</id>
                <commNodeId>936</commNodeId>
                <sender>186</sender>
                <headline>Title</headline>
                <messageBody>Dear neighbours!&lt;br /&gt;Yesterday a plebiscite of the inhabitants of sector 4980/4980 to 5000/5000 ended with clear decision to close the borders of the sektor for security reasons.&lt;br /&gt;Also, a security zone of one field around the sector will be established.&lt;br /&gt;&lt;br /&gt;Any ship entering the zone without previous declaration of intention, flight plan, destination and onboard cargo will be regarded as a thread and thus treated.&lt;br /&gt;&lt;br /&gt;Expect the diplomatic status to be changed to hostile in near future so al potentialy inevitable actions can be taken, if necessary.&lt;br /&gt;This dont mean you have to fear any thread as long you stand clear of the borders and security zone.</messageBody>
                <sendingDate>2015-06-26T19:19:56</sendingDate>
                <newMessage>0</newMessage>
              </message>
            </messages>
             * */

            List<Core.CommunicationNodeMessage> result;
            result = node.sendCommMessage(user, header, body);

            SpacegameServer.BC.XMLGroups.CommNodeMessages messages = new SpacegameServer.BC.XMLGroups.CommNodeMessages();
            messages.message = result;

            string ret = "";
            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.CommNodeMessages>(messages, ref ret, true);

            return ret;

        }
    
    }

}

