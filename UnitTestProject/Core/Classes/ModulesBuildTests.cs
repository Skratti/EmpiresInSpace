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
    public class ModulesBuildTests
    {
        static Core instance;
        static SpacegameServer.BC.BusinessConnector bc;

        [ClassInitializeAttribute()]
        public static void ClassInit(TestContext context)
        {
            instance = Core.Instance;
            bc = new SpacegameServer.BC.BusinessConnector();

            DataConnector connector = new EmptyDataConnector();
            instance.dataConnection = connector;
        }

        [TestMethod()]
        public void buildModulesTest()
        {
            Module crew = instance.Modules[1];   //Mock.mockModule();

            Field field = Mock.mockField();
            User user = Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(user.id, user);
            int userId = user.id;
            user.PlayerResearch.Add(new UserResearch(user.id, 2000));

            Colony colony = Mock.mockColony(ColonyUserId: userId);
            instance.colonies.TryAdd(colony.id, colony);
            colony.addGood(1, 20);
            colony.addGood(2, 40);
            colony.addGood(7, 32);
            colony.addGood(10, 20);

            string transferXML = "{ Sender:" + colony.id + ",Target:0,SenderType:0,TargetType:0,Goods:[{Id:"+ crew.id+ ",Qty:3}]}";
            System.Web.Script.Serialization.JavaScriptSerializer ser = new System.Web.Script.Serialization.JavaScriptSerializer();
            SpacegameServer.Core.Transfer records = ser.Deserialize<SpacegameServer.Core.Transfer>(transferXML);

            Assert.IsFalse(colony.goods.Any(e => e.goodsId == crew.goodsId));
            bc.BuildModules(userId, records);
            Assert.IsTrue(colony.goods.Any(e => e.goodsId == crew.goodsId));

        }

    }
}
