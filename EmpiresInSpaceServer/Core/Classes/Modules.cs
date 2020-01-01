using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    public class Modules
    {
        public static bool build(int userId, int colonyId, ref string xml)
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;

            // lock colony
            Colony colony = core.colonies[colonyId];
            if (colony == null) return false;

            for (int i = 0; i < 10; i++)
            {
                bool colonyLocked = false;

                colonyLocked = colony.setLock();

                if (colonyLocked)
                {
                    //userId may have been changed by another thread, so check it again after locking
                    if (colony.userId != userId)
                    {
                        colony.removeLock();
                        return false;
                    }
                    Core.Instance.dataConnection.buildModules(userId, colonyId, ref xml);

                    // get colony data (goods, later population (colony ships))
                    Core.Instance.dataConnection.getColonyStock(core, colony);

                   
                    //release the ressources and return true
                    colony.removeLock();

                    BC.XMLGroups.Colonize bCCol = new BC.XMLGroups.Colonize();
                    bCCol.Colony = colony;
                    BC.BusinessConnector.Serialize<BC.XMLGroups.Colonize>(bCCol, ref xml);

                    return true;
                }
                else
                {
                    Thread.Sleep(Lockable.rnd.Next(0, 50));
                }
            }
            
            return true;
        }


        public static bool BuildModules(int userId, SpacegameServer.Core.Transfer transfer, ref string xml)
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;

            if (!core.colonies.ContainsKey(transfer.Sender))
                return false;

            Colony colony = core.colonies[transfer.Sender];

            if (colony.userId != userId)
                return false;

            User user = Core.Instance.users[userId];

            //check if modules are researched:
            foreach (var moduleLine in transfer.Goods)
            {
                if (moduleLine.Qty < 0)
                    return false;

                //check that the Module exists
                if (!Core.Instance.Modules.Any(e=> e != null && e.goodsId == moduleLine.Id))
                    return false;

                Module toBuild = Core.Instance.Modules.First(e => e != null && e.goodsId == moduleLine.Id);

                if (!user.hasModuleResearch(toBuild))
                {
                    return false;
                }
            }

            if(!Modules.checkGoodsAvailability(colony, transfer))
                return false;

            List<Lockable> elementsToLock = new List<Lockable>(3);
            elementsToLock.Add(colony);

            if (!LockingManager.lockAllOrSleep(elementsToLock))
                return false;

            try
            {
                if (!Modules.checkGoodsAvailability(colony, transfer))
                    return false;

                //remove TemplateModules
                foreach (var moduleLine in transfer.Goods)
                {

                    Module toBuild = core.Modules.First(e => e != null && e.goodsId == moduleLine.Id);

                    foreach (var costs in toBuild.ModulesCosts)
                    {
                        colony.addGood(costs.goodsId, -costs.amount * moduleLine.Qty, false);
                    }

                    colony.addGood(toBuild.goodsId, moduleLine.Qty, false);
                }

                Core.Instance.dataConnection.saveColonyGoods(colony);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
            finally
            {
                //release the ressources and return true
                LockingManager.unlockAll(elementsToLock);
            }

            return true;
        }

        private static bool checkGoodsAvailability(Colony colony, SpacegameServer.Core.Transfer transfer)
        {
            Core core = Core.Instance;
            Colony dummy = new Colony(colony.id);
            //add
            foreach (var good in colony.goods)
            {
                dummy.goods.Add(good.clone());
            }

            dummy.goods.RemoveAll(good => good.amount < 0);

            //remove TemplateModules
            foreach (var moduleLine in transfer.Goods)
            {

                Module toBuild = core.Modules.First(e => e != null && e.goodsId == moduleLine.Id);

                foreach (var costs in toBuild.ModulesCosts)
                {
                    dummy.addGood(costs.goodsId, -costs.amount * moduleLine.Qty, false);
                }
                
            }

            //check
            if (dummy.goods.Any(good => good.amount < 0))
            {                
                return false;
            }

            return true;
        }


    }
}
