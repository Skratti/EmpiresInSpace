using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SpacegameServer.Core;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SpacegameServer;
namespace UnitTestProject
{
    [TestClass()]
    public class ShipBuildTests
    {
        static Core instance;

        [ClassInitializeAttribute()]
        public static void ClassInit(TestContext context)
        {
            //DataConnector connector = new TestDataConnector();
            //instance = Core.setTestInstance(connector);
            instance = Core.Instance;
            //Core instance = Core.InitTestInstance;
            //SpacegameServer.DataConnectors.SqlConnector.getGameData(instance);
            //Core.Instance.ResearchQuestPrerequisites  
        }

        [TestMethod()]
        public void buildMockTest()
        {
            Ship newShip = Mock.mockShip();

            Assert.IsNotNull(newShip);            
        }

        //ToDo: Transfer buildings and technology , Template design

        //ToDo: check tests:



        [TestMethod()]
        public void buildShipTest()
        {
            SpacegameServer.Core.ShipBuild builder = new ShipBuild(Core.Instance);

            //mock Hull to be build
            ShipHull hull = null;
            if (Core.Instance.ShipHulls.Count() > 1 && Core.Instance.ShipHulls[1] != null)
            {
                hull = Core.Instance.ShipHulls[1];
            }
            else
            {
                hull = Mock.mockShipHull();
                hull.ShipHullsModulePositions.Add(Mock.mockShipHullsModulePosition(hull.id, 2, 3));
                hull.ShipHullGain = Mock.mockShipHullsGain(hull.id, crew:3);
                Core.Instance.ShipHulls[hull.id] = hull;
            }


            int newShipId = (int)instance.identities.shipLock.getNext();
            
            Field field = Mock.mockField();
            User user = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(user.id, user);
            int userId = user.id;
            Colony colony = Mock.mockColony(ColonyUserId:userId);
            bool fastBuild = false;

            ShipTemplate template = Mock.mockShipTemplate(shiphullid: hull.id, userid:userId);
            Module crew = Mock.mockModule();
            crew.moduleGain = Mock.mockModulesGain(crew.id, crew: 5);
            Core.Instance.Modules[crew.id] = crew;
            template.shipModules.Add(Mock.mockShipTemplateModules());

            Ship newShip = builder.buildShip(newShipId, template, field, user.id, colony, fastBuild);

            Assert.AreEqual(newShip.id, newShipId);
            Assert.AreEqual(newShip.crew, hull.ShipHullGain.crew + crew.moduleGain.crew);
        }


        //ToDo: Process test  + Mock dataConnector
    }
}
