using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace SpacegameServer.Core
{
    public partial class ShipTemplate : Lockable, ShipStatistics, AsyncSaveable
    {
        public static System.Data.DataTable createDataTable()
        {
            var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            DataColumn column;
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "id";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "userId";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Byte");
            column.ColumnName = "shipHullId";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.String");
            column.ColumnName = "name";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.String");
            column.ColumnName = "gif";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "energy";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "crew";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Byte");
            column.ColumnName = "scanRange";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int16");
            column.ColumnName = "attack";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int16");
            column.ColumnName = "defense";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int16");
            column.ColumnName = "hitpoints";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Byte");
            column.ColumnName = "damageReduction";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int16");
            column.ColumnName = "cargoroom";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int16");
            column.ColumnName = "fuelroom";
            dataTable.Columns.Add(column);


            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Decimal");
            column.ColumnName = "systemMovesPerTurn";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Decimal");
            column.ColumnName = "galaxyMovesPerTurn";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Decimal");
            column.ColumnName = "systemMovesMax";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Decimal");
            column.ColumnName = "galaxyMovesMax";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "isColonizer";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int64");
            column.ColumnName = "population";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "constructionDuration";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Boolean");
            column.ColumnName = "constructable";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "amountBuilt";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Boolean");
            column.ColumnName = "obsolete";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "shipHullsImage";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int64");
            column.ColumnName = "versionId";
            dataTable.Columns.Add(column);
            
            return dataTable;
        }

        public object createData()
        {
            return new {
                this.id,
                userId = this.userId,
                shipHullId = this._shiphullid,
                name = this.name,
                gif = "Dummy" ,	
                this.energy,
                this.crew,
                this.scanRange,
                this.attack ,
                this.defense ,
                this.hitpoints ,
                this.damagereduction,
                this.cargoroom,
                this.fuelroom ,
                systemMovesPerTurn = this.systemmovesperturn,
                galaxyMovesPerTurn = this.galaxymovesperturn,
                systemMovesMax = this.max_impuls,
                galaxyMovesMax = this.max_hyper,
                isColonizer = this.iscolonizer,
                this.population,
                constructionDuration = this.constructionduration,
                constructable = this.isConstructable,
                amountBuilt = this.amountbuilt,
                this.obsolete,
                this.shipHullsImage ,
                this.versionId 
            };
        }

        public Task save(System.Data.SqlClient.SqlCommand _command)
        {
            return Core.Instance.dataConnection.saveShipTemplate(this, _command);
        }

        public static bool delete(SpacegameServer.Core.ShipTemplate template)
        {            
            Core core = Core.Instance;
            List<Lockable> elementsToLock = new List<Lockable>(1);

            elementsToLock.Add(template);          
            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return false;
            }
            try
            {
                template.obsolete = true;
                template.isConstructable = true;
                List<AsyncSaveable> elementsToSave = new List<AsyncSaveable>();
                elementsToSave.Add(template);                
                core.dataConnection.saveAsync(elementsToSave);              
            }
            catch (Exception ex)
            {
                core.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }
            return true;
        }

        public static bool createUpdate(string xml, int userId, ref SpacegameServer.Core.ShipTemplate template, ref SpacegameServer.Core.ShipTemplate oldTemplate)
        {
            /*
          <?xml version="1.0" encoding="utf-8" ?>
          <ShipTemplate>
            <ShipTemplateId>1</ShipTemplateId>
            <ShipTemplateHullId>1</ShipTemplateHullId>
            <name>testName</name>
            <gif>scout.png</gif>
            <shipHullsImage>1</shipHullsImage>
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

            Core core = Core.Instance;
            List<Lockable> elementsToLock = new List<Lockable>(2);


            SpacegameServer.Core.User user = core.users[userId];

            XmlDocument doc = new XmlDocument();
            doc.LoadXml(xml);

            string templateIdString = doc.DocumentElement.SelectSingleNode("/ShipTemplate/ShipTemplateId").InnerText;
            int templateId;
            if (!Int32.TryParse(templateIdString, out templateId)) return false;

            string templateHullIdString = doc.DocumentElement.SelectSingleNode("/ShipTemplate/ShipTemplateHullId").InnerText;
            byte templateHullId;
            if (!System.Byte.TryParse(templateHullIdString, out templateHullId)) return false;

            string shipHullsImageString = doc.DocumentElement.SelectSingleNode("/ShipTemplate/shipHullsImage").InnerText;
            int shipHullsImage;
            if (!Int32.TryParse(shipHullsImageString, out shipHullsImage)) return false;
           

            if (templateId != -1)
            {
                template = core.shipTemplate[templateId];
                
                if (template.userId != userId) return false;
                if (template.amountbuilt > 0)
                {
                    oldTemplate = template;
                    int newTemplateId = (int)SpacegameServer.Core.Core.Instance.identities.templateLock.getNext();
                    template = new SpacegameServer.Core.ShipTemplate(newTemplateId);
                }
            }
            else
            {
                int newTemplateId = (int)SpacegameServer.Core.Core.Instance.identities.templateLock.getNext();
                template = new SpacegameServer.Core.ShipTemplate(newTemplateId);
                template.userId = userId;
                template.gif = "Dummy";
            }


            template.name = doc.DocumentElement.SelectSingleNode("/ShipTemplate/name").InnerText;
            template.hullid = templateHullId;
            template.shipHullsImage = shipHullsImage;

            elementsToLock.Add(template);
            if (oldTemplate != null) elementsToLock.Add(oldTemplate);
            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return false;
            }
            try
            {
                template.shipModules.Clear();

                System.Xml.XmlNodeList modules = doc.DocumentElement.SelectNodes("/ShipTemplate/modulePositions/modulePosition");
                foreach (System.Xml.XmlNode node in modules)
                {
                    string posXS = node.SelectSingleNode("posX").InnerText; //or loop through its children as well
                    string posYS = node.SelectSingleNode("posY").InnerText; //or loop through its children as well
                    string moduleIdS = node.SelectSingleNode("moduleId").InnerText; //or loop through its children as well  

                    byte posX, posY;
                    short moduleId;
                    if (!(Byte.TryParse(posXS, out posX) && Byte.TryParse(posYS, out posY) && Int16.TryParse(moduleIdS, out moduleId)))
                    {
                        LockingManager.unlockAll(elementsToLock);
                        return false;
                    }

                    ShipTemplateModules newModule = new ShipTemplateModules();
                    newModule.posX = posX;
                    newModule.posY = posY;
                    newModule.moduleId = moduleId;
                    newModule.shiptemplateid = template.id;
                    template.shipModules.Add(newModule);
                }

                StatisticsCalculator.calc(template, Core.Instance);

                template.isConstructable = template.energy >= 0 && template.crew >= 0;                

                if (!core.shipTemplate.ContainsKey(template.id))
                    core.shipTemplate[template.id] = template;

                //save newTemplate and oldTemplate 
                List<AsyncSaveable> elementsToSave = new List<AsyncSaveable>();
                elementsToSave.Add(template);
                if (oldTemplate != null)
                {
                    oldTemplate.obsolete = true;
                    elementsToSave.Add(oldTemplate);
                }
                core.dataConnection.saveAsync(elementsToSave);                     
            }
            catch (Exception ex)
            {
                core.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }
            return true;
        }

    }


}
