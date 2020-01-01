using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    class ColonyBuildingActions
    {
        public ColonyBuildingActions()
        {           
        }

        private static int allowedBuildings(Colony colony, short buildingId)
        {
            int allowed = 0;

            switch (buildingId)
            {
                case 2:
                    allowed = colony.colonyBuildings.Select(e => e.building.allowedMines).Sum();
                    break;
                case 6:
                    allowed = colony.colonyBuildings.Select(e => e.building.allowedFuel).Sum();
                    break;
                default:
                    allowed = 100;
                    break;
            }

            return allowed;
        }



        private static int countBuildings(Colony colony, short buildingId)
        {
            int counted = 0;
            counted = colony.colonyBuildings.Count(e => e.buildingId == buildingId);

            return counted;
        }

        public static bool build(int userId, int colonyId, int tileNr, short buildingId, ref int newBuildingId)
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;

            //check against research
            if (!Core.Instance.users.ContainsKey(userId)) return false;
            var User = Core.Instance.users[userId];
            if (!User.hasGameObjectEnabled(3, buildingId)) return false;

            
            Colony colony = core.colonies[colonyId];
            if (colony == null) return false;

            Building template = core.Buildings[buildingId];
            if (template == null) return false;

            //check on building count in case of mines, hydrocarbon, rare chemicals
            if (buildingId == 2 || buildingId == 6 )
            {
                if (ColonyBuildingActions.countBuildings(colony, buildingId) >= ColonyBuildingActions.allowedBuildings(colony, buildingId))
                {
                    return false;
                }
            }

            //check tile position
            if (colony.colonyBuildings.Any(e=>e.planetSurfaceId == tileNr))
            {

                return false;
            }



            // lock colony
                List<Lockable> elementsToLock = new List<Lockable>(1);
            elementsToLock.Add(colony);
            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return false;
            } 

            try
            {                
                //userId may have been changed by another thread, so check it again after locking
                if (colony.userId != userId)
                {
                    colony.removeLock();
                    return false;
                }

                //test ressources on colony
                var costOK = true;
                foreach(var cost in template.BuildingCosts)
                {
                    if (!colony.goods.Any(e=>e.goodsId == cost.goodsId))
                    {
                        costOK = false;
                        break;
                    }

                    if (colony.goods.Find(e => e.goodsId == cost.goodsId).amount < cost.amount)
                    {
                        costOK = false;
                        break;
                    }
                }
                if (!costOK)
                {
                    colony.removeLock();
                    return false;
                }



                if (template.oncePerColony)
                {
                    if (colony.colonyBuildings.Any(e=>e.buildingId == template.id))
                    {
                        colony.removeLock();
                        return false;
                    }
                }

                //Special Ressourcen
                /*
                 * if (template.id > 1029 && template.id < 1035)
                {                    
                    var star = Core.Instance.stars[colony.starId]; 
                    if (star.ressourceid != template.id - 1030)
                    {
                        colony.removeLock();
                        return false;
                    }
                }
                */

                //Create Building
                var newId = (int)core.identities.colonyBuildingId.getNext();
                newBuildingId = newId;
                var building = new ColonyBuilding(core, newId, colony, template, tileNr, userId);                
                /*
                var building = new ColonyBuilding(newId);                
                building.colonyId = colony.id;
                building.colony = colony;
                building.planetSurfaceId = tileNr;
                building.userId = userId;
                building.buildingId  = buildingId;
                building.isActive = true;
                building.underConstruction = false;
                building.remainingHitpoint = 100;
                building.building = template;
                colony.colonyBuildings.Add(building);
                Core.Instance.colonyBuildings.Add(newId, building);
                */


                foreach(var cost in template.BuildingCosts)
                {
                    colony.addGood(cost.goodsId,-cost.amount);
                }


                /*check auf:
		            TODO - Feld frei?
		            TODO - Forschung
	            */


                //Todo: Scanrange, CommNode
                if (building.buildingId == 51)
                {
                    building.colony.scanRange =  Math.Max(building.colony.scanRange, (byte)7);
                    core.dataConnection.saveSingleColony(building.colony);
                }

                if (building.buildingId == 64)
                {
                    building.colony.scanRange = Math.Max(building.colony.scanRange, (byte)9);
                    core.dataConnection.saveSingleColony(building.colony);
                }

                core.dataConnection.saveColonyBuildings(building);
                core.dataConnection.saveColonyGoods(colony);

                CommunicationNode.createCommNodeBuilding(building);

                //Core.Instance.dataConnection.buildBuilding(userId,  colonyId,  tileNr,  buildingId, ref xml);
                   
                // get colony data (goods, later population (colony ships))
                //Core.Instance.dataConnection.getColonyStock(core, colony);
                //Core.Instance.dataConnection.getColonyBuildings(core, colony);
                
                              
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

        private static bool deconstructCheck(int userId, Colony colony, int buildingId)
        {
            if (colony.userId != userId)
            {                
                return false;
            }

            return true;
        }

        public static bool deconstruct(int userId, int colonyId, int buildingId)
        {

            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;
            Colony colony = core.colonies[colonyId];
            if (colony == null) return false;

            if (!deconstructCheck(userId, colony, buildingId)) return false;

            List<Lockable> elementsToLock = new List<Lockable>(1);
            elementsToLock.Add(colony);

            if (!LockingManager.lockAllOrSleep(elementsToLock))
                return false;

            try
            {

                //owner may have been changed by another thread, so check it again after locking
                if (!deconstructCheck(userId, colony, buildingId)) return false;

                ColonyBuilding itemToRemove = colony.colonyBuildings.Single(colonyBuilding => colonyBuilding.id == buildingId);
                itemToRemove.Recycle(colony);

                colony.colonyBuildings.Remove(itemToRemove);
                core.colonyBuildings.TryRemove(buildingId);

                Core.Instance.dataConnection.saveColonyGoods(colony);
                Core.Instance.dataConnection.DeconstructBuilding(userId, buildingId);

            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
                return false;
            }
            finally
            {
                //release the ressources
                LockingManager.unlockAll(elementsToLock);
            }


            return true;
        }

    }
}
