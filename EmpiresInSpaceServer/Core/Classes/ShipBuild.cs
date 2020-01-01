using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    public enum ShipBuildErrorCode
    {
        EnemyInSpace = 1,
        GoodsAvailability = 2,
        Spaceport = 3,
        Technology = 4,
        Uniqueness = 5
    }

    public class ShipBuild
    {
        SpacegameServer.Core.Core core;
        public ShipBuild(SpacegameServer.Core.Core _core)
        {
            core = _core;
        }


        private bool checkSpaceport(Colony colony, ref ShipBuildErrorCode errorCode, ref int errorValue)
        {
            if (Core.Instance.colonyBuildings.Values.Any(building => building.colonyId == colony.id && building.buildingId == 17))
                return true;
            else
            {
                errorCode = ShipBuildErrorCode.Spaceport;
                Core.Instance.writeToLog("Spaceport missing! ColonyId: " + colony.id.ToString() + "  --- UserId: " + colony.userId.ToString());
                return false;
            }
        }

        private bool checkTechnology(ShipTemplate template, int userId, bool fastBuild, ref ShipBuildErrorCode errorCode, ref int errorValue)
        {
            User user = Core.Instance.users[userId];

            if (!user.hasGameObjectEnabled(5, template.hullid)) return false;

            if (fastBuild)
            {
                foreach (var module in template.shipModules)
                {

                    if (!user.hasModuleResearch(Core.Instance.Modules[module.moduleId]))
                    {
                        errorCode = ShipBuildErrorCode.Technology;
                        errorValue = module.moduleId;
                        return false;
                    }
                    //foreach(Core.Instance.ResearchQuestPrerequisites
                }
            }
            return true;
        }

        //checks versus enemies in Orbit
        private bool checkFreeOrbit(Field field, int userId, Tuple<byte, byte> systemXY, ref ShipBuildErrorCode errorCode, ref int errorValue)
        {
            User user = Core.Instance.users[userId];

            //check if the user is at war, if yes, check if enemies are present in the targetField
            int relation = 2;
            Ship enemy = null;

            foreach (var contact in core.userRelations.getUserRelationsForUser(user))
            {
                if (contact.Value == Relation.Hostile || contact.Value == Relation.War)
                {
                    relation = 0;
                    break;
                }                
            }
            if (relation == 0)
            {
                enemy = systemXY == null ? core.enemyAtTargetField(field, userId) : core.enemyAtTargetField(field, systemXY, userId);
            }

            if (enemy == null)
                return true;
            else
            {
                errorCode = ShipBuildErrorCode.EnemyInSpace;
                errorValue = enemy.id;
                return false;
            }
            
        }

        //checks (if required) that the ship is unique for the coordinates (Transcendence construct needs it)
        private bool checkUniqueness(Field field, ShipTemplate template, Tuple<byte, byte> systemXY, ref ShipBuildErrorCode errorCode, ref int errorValue)
        {
            if (template.hullid != 220)
            {
                return true;
            }

            //if in deep space, just check the field 
            if (systemXY == null)
            {
                if (field.ships.Any(e => e.hullid == 220))
                {
                    errorCode = ShipBuildErrorCode.Uniqueness;
                    errorValue = 1;
                    return false;
                }

                return true;
            }

            //the same chck,l but now with system coordinates 
            if (field.ships.Any(e => e.hullid == 220 && e.systemx == systemXY.Item1 && e.systemy == systemXY.Item2))
            {
                errorCode = ShipBuildErrorCode.Uniqueness;
                errorValue = 1;
                return false;
            }

            return true;            
        }


        private bool checkGoodsAvailability(Colony colony, ShipTemplate template, bool fastBuild, ref ShipBuildErrorCode errorCode, ref int errorValue)
        {
            Colony dummy = new Colony(colony.id);            
            //add
            foreach (var good in colony.goods)
            {
                dummy.goods.Add(good.clone());
            }

            dummy.goods.RemoveAll(good => good.amount < 0);

            //remove TemplateModules
            foreach (var module in template.shipModules)
            {
                if (!fastBuild)
                    dummy.addGood(core.Modules[module.moduleId].goodsId, -1, false);
                else
                {
                    foreach (var costs in core.Modules[module.moduleId].ModulesCosts)
                    {
                        dummy.addGood(costs.goodsId, -costs.amount, false);
                    }
                }
            }
            //and remove shipHullCosts
            foreach (var good in Core.Instance.ShipHulls[template.hullid].ShipHullsCosts)
            {
                dummy.addGood(good.goodsId, -good.amount, false);
            }

            //check
            if (dummy.goods.Any(good => good.amount < 0))
            {
                errorCode = ShipBuildErrorCode.GoodsAvailability;                
                return false;
            }
            return true;
        }

        private void removeGoods(Colony colony, ShipTemplate template, bool fastBuild)
        {
            Core core = Core.Instance;

            //remove shipHullCosts
            foreach (var shipHullsCost in Core.Instance.ShipHulls[template.hullid].ShipHullsCosts)
            {
                colony.addGood(shipHullsCost.goodsId, -shipHullsCost.amount);
            }

            //remove modules
            if(fastBuild )
            {
                foreach (var module in template.shipModules)
                {
                    foreach (var modulesCost in Core.Instance.Modules[module.moduleId].ModulesCosts)
                    {
                        colony.addGood(modulesCost.goodsId, -modulesCost.amount);
                    }                    
                }   
            }
            else
            {                
                foreach (var module in template.shipModules)
                {
                    colony.addGood(core.Modules[module.moduleId].goodsId, -1);
                }                
           }

        }
        //similar to Ship.createSpaceStation(), but not easily generalizable
        public bool build2(int shipTemplateId, int _userId, int _colonyId, bool fastBuild, ref int newShipId, ref ShipBuildErrorCode errorCode, ref int errorValue)
        {
            Core core = Core.Instance;
            GalaxyMap galaxyMap = null;

            // lock colony and field
            Colony colony = core.colonies[_colonyId];
            if (colony == null) return false;
            if (colony.userId != _userId) return false;

            Field field = colony.field;
            ShipTemplate template = core.shipTemplate[shipTemplateId];

            if (!(  this.checkFreeOrbit(field, _userId, colony.systemXY(), ref errorCode, ref errorValue)
                    && this.checkGoodsAvailability(colony, template, fastBuild, ref errorCode, ref errorValue)
                    && this.checkSpaceport(colony, ref errorCode, ref errorValue)
                    && this.checkTechnology(template, _userId, fastBuild, ref errorCode, ref errorValue)
                    && this.checkUniqueness(field, template, colony.systemXY(),ref errorCode, ref errorValue))) 
                return false;

            //Lock
            List<Lockable> elementsToLock = new List<Lockable>(3);
            elementsToLock.Add(colony);
            elementsToLock.Add(field);

            //check for transcendence //ToDo: replace 220 with a sql data field
            if (template.hullid == 220 && core.GalaxyMap.transcendenceRequirement == 0)
            {
                galaxyMap = core.GalaxyMap;
                elementsToLock.Add(galaxyMap);
            }
                      
            if (!LockingManager.lockAllOrSleep(elementsToLock))            
                return false;

            newShipId = (int)Core.Instance.identities.shipLock.getNext();
            try
            {
                //all checks again inside of lock
                if (!(this.checkFreeOrbit(field, _userId, colony.systemXY(), ref errorCode, ref errorValue)
                    && this.checkGoodsAvailability(colony, template, fastBuild, ref errorCode, ref errorValue)
                    && this.checkSpaceport(colony, ref errorCode, ref errorValue)
                    && this.checkTechnology(template, _userId, fastBuild, ref errorCode, ref errorValue)
                    && this.checkUniqueness(field, template, colony.systemXY(), ref errorCode, ref errorValue))) 
                {                   
                    return false;
                }
                

                //everything checked and locked
                //now do the work
                Ship newShip = buildShip(newShipId, template, field, _userId, colony, fastBuild);

                newShip.SetTranscension(galaxyMap);                               

                //write SQL                                              
                Core.Instance.dataConnection.insertShip(newShip);          
                Core.Instance.dataConnection.saveColonyGoods(colony);      

            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
            finally
            {
                //release the ressources
                LockingManager.unlockAll(elementsToLock);
            }
            
            return true;
        }

        //everything is already checked, locked, checked again
        //write and unlock will also be done by the caller
        public Ship buildShip(int newShipId, ShipTemplate template, Field field, int userId, Colony colony, bool fastBuild)
        {
            Ship newShip = new Ship(newShipId);
            newShip.userid = userId;
            newShip.FormerOwner = userId;
            newShip.initFromTemplate(template, newShip.id);
            newShip.initFromField(field);
            newShip.initFromColony(colony);

            StatisticsCalculator.calc(newShip, Core.Instance);
            
            Core.Instance.ships[newShip.id] = newShip;
            Core.Instance.addShipToField(newShip);
            Core.Instance.users[userId].ships.Add(newShip);
            

            //remove ressources
            removeGoods(colony, template, fastBuild);

            return newShip;
        }



        public bool build(int _shipTemplateId, int _userId, int _colonyId, bool _fastBuild, ref string _xml)
        {
            // lock colony
            Colony colony = core.colonies[_colonyId];
            if (colony == null) return false;

            for (int i = 0; i < 10; i++)
            {
                bool colonyLocked = false;

                colonyLocked = colony.setLock();

                if (colonyLocked)
                {
                    //userId may have been changed by another thread, so check it again after locking
                    if (colony.userId != _userId)
                    {
                        colony.removeLock();                        
                        return false;
                    }
                    int newShipId = 0;
                    Core.Instance.dataConnection.buildShip(_shipTemplateId, _userId, _colonyId, _fastBuild, ref _xml, ref newShipId); 

                    //get new ship data
                    Core.Instance.dataConnection.getShips(core, newShipId, null);
                    Core.Instance.dataConnection.getShipModules(core, core.ships[newShipId], false);

                    // get colony data (goods, later population (colony ships))
                    Core.Instance.dataConnection.getColonyStock(core, colony);

                    //release the ressources and return true
                    colony.removeLock();                
                    return true;
                }
                else
                {
                    Thread.Sleep(Lockable.rnd.Next(0, 50));
                }
            }

            return true;
        }

    }
}
