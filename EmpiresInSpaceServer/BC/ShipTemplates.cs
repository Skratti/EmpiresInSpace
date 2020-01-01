using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;


namespace SpacegameServer.BC
{
    internal static class ShipTemplates
    {
        public static void delete(int userId, int templateId)
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;
            SpacegameServer.Core.User user = core.users[userId];

            if (core.shipTemplate.ContainsKey(templateId))
            //if(core.shipTemplate.ElementAtOrDefault(templateId) != null)
            {
                SpacegameServer.Core.ShipTemplate template = core.shipTemplate[templateId];
                if (template.userId != userId) return;
                SpacegameServer.Core.ShipTemplate.delete(  template);
            }                       
        }
        public static string createUpdate(int userId, string templateXml)
        {
            /*
           <?xml version="1.0" encoding="utf-8" ?>
           <ShipTemplate>
             <ShipTemplateId>1</ShipTemplateId>
             <ShipTemplateHullId>1</ShipTemplateHullId>
             <name>testName</name>
             <shipHullsImage>1</shipHullsImage>
             <gif>scout.png</gif>
             <modulePositions>
               <modulePosition>
                 <posX>3</posX>
                 <posY>3</posY>
                 <moduleId>1</moduleId>
               </modulePosition>
               <modulePosition>
                 <posX>2</posX>
                 <posY>3</posY>
                 <moduleId>2</moduleId>
               </modulePosition>   
             </modulePositions>
           </ShipTemplate>
           */

            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;
            SpacegameServer.Core.User user = core.users[userId];

            XmlDocument doc = new XmlDocument();
            doc.LoadXml(templateXml);



            string templateIdString = doc.DocumentElement.SelectSingleNode("/ShipTemplate/ShipTemplateId").InnerText;
            int templateId;
            if (!Int32.TryParse(templateIdString, out templateId)) return "";
            SpacegameServer.Core.ShipTemplate newTemplate = null;
            SpacegameServer.Core.ShipTemplate oldTemplate = null;

            if (!SpacegameServer.Core.ShipTemplate.createUpdate(templateXml, userId, ref newTemplate, ref oldTemplate)) return "";

            

          

            //calc the xml result
            SpacegameServer.BC.XMLGroups.ShipTemplates ShipTemplate = new SpacegameServer.BC.XMLGroups.ShipTemplates();
            
            ShipTemplate.ShipTemplate.Add(newTemplate);
            if (oldTemplate != null) ShipTemplate.ShipTemplate.Add(oldTemplate);
          
            string ret = "";
            BusinessConnector.Serialize<SpacegameServer.BC.XMLGroups.ShipTemplates>(ShipTemplate, ref ret);

            return ret;

        }
    }
}
