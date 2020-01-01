using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    public interface ModuleStatistics
    {    
       
        short hitpoints { get; set; }
        short damageoutput { get; set; }
        short Evasion { get; set; }
        byte scanRange { get; set; }
        Decimal maxSystemMoves { get; set; }
        Decimal maxSpaceMoves { get; set; }
        int special { get; set; }
        byte damagereduction { get; set; }
        short energy { get; set; }
        int crew { get; set; }
        short cargoroom { get; set; }
        short fuelroom { get; set; }
        long population { get; set; }        
        
    }

    public interface ShipStatisticModulePosition
    {
        short moduleId { get; set; }

        byte posX { get; set; }

        byte posY { get; set; }
    }

    public interface ShipStatistics    
    {
        int id { get; set; }
        short hitpoints { get; set; }        
        short attack  { get; set; }
        short defense { get; set; }
        byte scanRange { get; set; }        
        Decimal max_hyper  { get; set; }        
        Decimal max_impuls  { get; set; }                
        byte colonizer  { get; set; }                
        byte hullid  { get; set; }                                
        byte damagereduction  { get; set; }        
        int energy  { get; set; }        
        int crew  { get; set; }        
        short cargoroom  { get; set; }        
        short fuelroom  { get; set; }        
        long population  { get; set; }        
        int shipHullsImage  { get; set; }

        List<ShipStatisticModulePosition> shipStatisticsModules { get; } 
    }
    static class StatisticsCalculator
    {

        private static double applyFactor(int baseValue, int count, double factor)
        {
            var factor2 = count > 1 ?  Math.Pow(factor, count - 1) : 1.0; //will lead to 1 scanner = 100%
            return count > 1 ? Math.Ceiling(baseValue * factor2) : baseValue;          
        }

        /// <summary>
        /// calculates statistics for ships and templates
        /// <para></para>
        /// <param name="ship">an object implementing the ShipStatistics interface </param>
        /// </summary>
        public static void calc(ShipStatistics ship, Core core)
        {

            int moduleMaximumCount = core.ShipHulls[ship.hullid].ShipHullsModulePositions.Count;
            
            resetStatistics(ship);
            
            addModuleStatistics(ship, core.ShipHulls[ship.hullid].ShipHullGain);

            int scanners = 0;
            int shield = 0;
            int armor = 0;


            foreach (var module in ship.shipStatisticsModules)
            {
                addModuleStatistics(ship, core.Modules[module.moduleId].moduleGain);
                if (core.Modules[module.moduleId].moduleGain.scanRange > 0) scanners++;
                if (core.Modules[module.moduleId].moduleGain.damagereduction > 0) shield++;
                if (core.Modules[module.moduleId].moduleGain.hitpoints > 0) armor++;
            }
            moduleMaximumCount = Math.Max(moduleMaximumCount,1);
            ship.max_hyper = ship.max_hyper / moduleMaximumCount * (decimal)core.ShipHulls[ship.hullid].ShipHullGain.speedFactor;
            ship.max_impuls = ship.max_impuls / moduleMaximumCount * (decimal)core.ShipHulls[ship.hullid].ShipHullGain.speedFactor;

            //5 turns:
            ship.max_hyper = ship.max_hyper * 5;
            ship.max_impuls = ship.max_impuls * 5;

            //some modules loose efficiency when multiples are built in:
            double scannerFactorShip = 0.8;
            double scannerFactorStation = 0.85;
            double shieldFactor = 0.7;
            double armorFactor = 1;

            //Effectivity reduction:
            ship.scanRange = (byte)applyFactor(ship.scanRange, scanners, StatisticsCalculator.isSpaceStation(ship) ? scannerFactorStation : scannerFactorShip);
            ship.hitpoints = (short)applyFactor(ship.hitpoints, armor, armorFactor);
            ship.damagereduction = (byte)applyFactor(ship.damagereduction, shield, shieldFactor);

            if (ship is SpacegameServer.Core.Ship)
            {
                ((SpacegameServer.Core.Ship)ship).CombatMaxHitpoint = ship.hitpoints;
                ((SpacegameServer.Core.Ship)ship).CombatStartHitpoint = ship.hitpoints;

                if (ship.energy < 0 || ship.crew < 0)
                {
                    ship.attack = 0;
                    ship.defense = 0;
                    ship.max_hyper = 0;
                    ship.max_impuls = 0;                    
                }
            }

            //ToDO: if no impuls is present, remove the shipHull-Evasion -(but, full evasion is always calculated, so this seems not to be necessary... 
            /*
            if (scanners > 1)
            {
                var factor = StatisticsCalculator.isSpaceStation(ship) ? 0.85 : 0.8; // 15% - 20% loss if multiples scanners are used
                factor = Math.Pow(factor, scanners - 1); //will lead to 1 scanner = 100%
                ship.scanRange =(byte) Math.Ceiling(ship.scanRange * factor);
            }
            */

            //apply movement reduction according to number of cargo modules
            var CargoFactor = Math.Min(1.0m, 1.6m - (decimal)core.ShipHulls[ship.hullid].ShipHullGain.speedFactor);
            foreach (var module in ship.shipStatisticsModules)
            {
                if (core.Modules[module.moduleId].moduleGain.cargoroom == 0) continue;

                ship.max_hyper = Math.Round(ship.max_hyper * CargoFactor);
                ship.max_impuls = Math.Round(ship.max_impuls * CargoFactor);

                //ship.max_hyper = ship.max_hyper / moduleMaximumCount * (decimal)core.ShipHulls[ship.hullid].ShipHullGain.speedFactor;
                //ship.max_impuls = ship.max_impuls / moduleMaximumCount * (decimal)core.ShipHulls[ship.hullid].ShipHullGain.speedFactor;
            }

            if (ship is SpacegameServer.Core.Ship && (ship as SpacegameServer.Core.Ship).refitCounter > 0) refitStatistics(ship);
        }

        public static void resetStatistics(ShipStatistics ship)
        {
            ship.hitpoints = 0;
            ship.attack = 0;
            ship.defense = 0;
            ship.scanRange = 0;
            ship.max_hyper  = 0;
            ship.max_impuls = 0;
            ship.colonizer = 0;             
            ship.damagereduction = 0;
            ship.energy   = 0;
            ship.crew  = 0;
            ship.cargoroom = 0;
            ship.fuelroom   = 0;
            ship.population  = 0;           
        }

        public static void refitStatistics(ShipStatistics ship)
        {            
            ship.attack = 0;
            ship.defense = 0;
            ship.scanRange = 0;
            ship.max_hyper = 0;
            ship.max_impuls = 0;
            ship.colonizer = 0;
            ship.damagereduction = 0;           
        }

        public static void addModuleStatistics(ShipStatistics ship, ModuleStatistics module)
        {
            ship.hitpoints += module.hitpoints;
            ship.attack += module.damageoutput;
            ship.defense += module.Evasion;           //evasion
            ship.scanRange += module.scanRange;
            ship.max_hyper += module.maxSpaceMoves;
            ship.max_impuls += module.maxSystemMoves;            
            ship.damagereduction += module.damagereduction; //shield
            ship.energy += module.energy;
            ship.crew += module.crew;
            ship.cargoroom += module.cargoroom;
            ship.fuelroom += module.fuelroom;
            ship.population += module.population;

            if (module.population > 0)
                ship.colonizer = 1;
        }

        public static List<shipStock> calcCosts(ShipStatistics ship)
        {
            List<shipStock> costs = new List<shipStock>();
            Core core = Core.Instance;

            //create a dummy ship to sum up all available modules
            Ship availableGoods = new Ship(ship.id);
            List<shipStock> allAvailableModules = new List<shipStock>();
            
            foreach (var cost in core.ShipHulls[ship.hullid].ShipHullsCosts)
            {
                if (costs.Exists(x => x.goodsId == cost.goodsId))
                    costs.FirstOrDefault(x => x.goodsId == cost.goodsId).amount += cost.amount;
                else
                {
                    shipStock hullCost = new shipStock();
                    hullCost.shipId = ship.id;
                    hullCost.amount = cost.amount;
                    hullCost.goodsId = cost.goodsId;
                    costs.Add(hullCost);
                }
            }

            foreach (var module in ship.shipStatisticsModules)
            {
                foreach (var cost in core.Modules[module.moduleId].ModulesCosts)
                {
                    if (costs.Exists(x => x.goodsId == cost.goodsId))
                        costs.FirstOrDefault(x => x.goodsId == cost.goodsId).amount += cost.amount;
                    else
                    {
                        shipStock hullCost = new shipStock();
                        hullCost.shipId = ship.id;
                        hullCost.amount = cost.amount;
                        hullCost.goodsId = cost.goodsId;
                        costs.Add(hullCost);
                    }
                }
            }
            
            return costs;
        }

        public static bool isSpaceStation(ShipStatistics ship)
        {
            return ship.hullid >= 199 && ship.hullid <= 220;        
        } 

    }
}
