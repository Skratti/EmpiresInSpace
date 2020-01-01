using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    internal class TurnSummary
    {
        SpacegameServer.Core.Core core;
        int SumAllVicPoints = 0; // part of this is needed for transzencence

        public TurnSummary(SpacegameServer.Core.Core _core)
        {
            core = _core;
        }

        //called with "null" if turn summary is done for all players, else specific userId
        public void calc(User _user)
        {
            //prevent all objects from locking

            //do the sql turn summary
            /*
            exec turnSummaryMovement @userId	
	        exec turnSummaryPopBuildingDeactivation @userId	
	        exec turnSummaryRessourcegain @userId
	        exec turnSummaryResearch @userId	
	        exec  turnSummaryPopulationGrowth @userId*/
            if (_user != null)
            {
                Core.Instance.dataConnection.userTurnSummary(_user.id);
                Core.Instance.dataConnection.getShips(core, 0, _user);
                Core.Instance.dataConnection.getColonies(core, null, _user.id);
                Core.Instance.dataConnection.getColonyStock(core, null);
            }
            else
            {
                if (!Ship.setLockAll())
                {
                    Core.Instance.writeToLog("TurnSummary : Ship setLockAll() failed! ");
                    return;
                }

                if (!Colony.setLockAll())
                {
                    Ship.removeLockAll();
                    Core.Instance.writeToLog("TurnSummary : Colony setLockAll() failed! ");
                    return;
                }

                if (!User.setLockAll())
                {
                    Ship.removeLockAll();
                    Colony.removeLockAll();
                    Core.Instance.writeToLog("TurnSummary : User setLockAll() failed! ");
                    return;
                }

                try
                {
                    //Give other operation some time to finish their stuff.
                    //Better solution would be: Try locking all needed, repeat until that is successfull, worst case: kill all other transaction - release all locked objects. Implementation of this should be thouroughly planned
                    System.Threading.Thread.Sleep(1000);


                    var watch = System.Diagnostics.Stopwatch.StartNew();

                    ShipTranscension.CheckGameEnd();
                    
                    ClearGalaxyOwnership();

                    Core.Instance.GalaxyMap.TurnNumber++;

                    Core.Instance.dataConnection.InsertUserHistory();

                    //RepairAlliances();

                    //transfer gains of userResearch into factors for production, research, housing...
                    ratio();
                    
                    ships();
                    colonies();
                    researchSpread(Core.Instance);
                    userRanks2();
                    createScumm();
                    CreateTradeWorker();



                    //save Users
                    Core.Instance.dataConnection.saveUser(null);

                    //save Alliances
                    Core.Instance.dataConnection.saveAlliances(null);

                    Core.Instance.dataConnection.saveShips();
                    
                    Core.Instance.dataConnection.RefitDecrement();

                    CalcGalaxyOwnership();

                    //save Colonies (including stock and Buildings)
                    Core.Instance.dataConnection.saveColonies(null);
                    Core.Instance.dataConnection.saveColoniesGoods();
                    Core.Instance.dataConnection.saveColonyBuildings(null);
                    
                   
                    //write Event
                    Core.Instance.dataConnection.saveServerEvent(0);


                    // the code that you want to measure comes here
                    watch.Stop();
                    var elapsedMs =  watch.ElapsedMilliseconds;
                    int MsInt = 0;
                    try
                    {
                        MsInt = Convert.ToInt32(elapsedMs);                       
                    }
                    catch (OverflowException)
                    {
                        MsInt = Int32.MaxValue;
                    }

                    SpacegameServer.Core.TurnEvaluation evaluation = new TurnEvaluation();
                    evaluation.TurnNumber = Core.Instance.GalaxyMap.TurnNumber;
                    evaluation.EvaluationDate = DateTime.Today;
                    evaluation.EvaluationDuration = MsInt;
                    evaluation.PlayerCount = Core.Instance.users.Count;
                    evaluation.ShipCount = Core.Instance.ships.Count;
                    evaluation.ColonyCount = Core.Instance.colonies.Count;
                    evaluation.TradesCount = Core.Instance.tradeOffer.Count - 100;
                    Core.Instance.TurnEvaluations.Add(evaluation);

                    Core.Instance.dataConnection.InsertTurnEvaluation(evaluation);
                    //SpacegameServer.Core.TurnSummary x = new TurnSummary(Core.Instance);

                    /*
                    Core.Instance.dataConnection.TurnSummary();
                    Core.Instance.dataConnection.getShips(core, 0, null);
                    Core.Instance.dataConnection.getColonies(core);
                    Core.Instance.dataConnection.getColonyStock(core, null);
                    */
                }
                catch (Exception ex)
                {
                    SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
                }
                finally
                {
                    //release the ressources
                    Ship.removeLockAll();
                    Colony.removeLockAll();
                    User.removeLockAll();
                }

                
            }
            //refresh the core data
            //turnSummaryMovement -> Ships (of user, if only user turn was done)

            

            //allow locking
        }

        public void RepairAlliances()
        {
            foreach( var alliance in Core.Instance.alliances)
            {
                alliance.Value.RepairSecondarySpecificationGain();
            }
        }

        private void ClearGalaxyOwnership()
        {
            // GeometryIndex.regions[targetRegionId].findOrCreateField(starXY.Key, starXY.Value);

            foreach (System.Collections.DictionaryEntry HashEntry in GeometryIndex.allFields)
            {
                Field x = (Field)HashEntry.Value;
                x.Influence.Clear();
            }
        }

        public void CalcGalaxyOwnership()
        {
            //apply influence to each field from colony
            AddColoniesOwnership();
            AddSpaceStationsOwnership();

            //set ownerId on each field
            SetFieldOwners();

            //fetch borderfields that do not belong to anybody, check if they are sorrounded on 3 or more sides by a player, then give that player the field
            FillBorderGaps();

            //create neutral zone between factions
            //CreateNeutralZone();

            RemoveSingleFields();
        }

        private void AddColoniesOwnership()
        {
            var colonies = this.core.colonies;
            foreach (var entry in colonies)
            {
                InfluenceManager.applyInfluence(entry.Value.field, entry.Value.Influence, entry.Value.userId, entry.Value);
                //entry.Value.applyInfluence();
            }
        }
        private void AddSpaceStationsOwnership()
        {

        }


        //fill gaps in the border
        //check each field that has an owner
        //fetch the 4 neighbours of it
        //check every neighbour that does not have an owner
        public static void FillBorderGaps()
        {
            var AllFields = new Field[GeometryIndex.allFields.Count];
            GeometryIndex.allFields.Values.CopyTo(AllFields, 0);
            //var AllFields = GeometryIndex.allFields.Count;



            foreach (Field fieldToCheck in AllFields)
            {
                //Field fieldToCheck = (Field)HashEntry.Value;
                if (fieldToCheck.Owner != null)
                {
                    var currentOwner = fieldToCheck.Owner;
                    var currentEntity = fieldToCheck.Entity;
                    var Neighbours = GeometryIndex.getDirectNeighbours(fieldToCheck);

                    //get the 4 neighbours, each of these will be checked
                    foreach (var NeighbouringField in Neighbours)
                    {
                        if (NeighbouringField.Owner != null) continue;

                        var NeighboursToCheck = GeometryIndex.getDirectNeighbours(NeighbouringField);
                        var fieldsOfThatOwner = 0;
                        for (var k = 0; k < NeighboursToCheck.Count; k++)
                        {
                            if (NeighboursToCheck[k].Owner == null) continue;
                            if (NeighboursToCheck[k].Entity.Equals(currentEntity)) fieldsOfThatOwner++;
                        }

                        //if three or more, add the checked field to the currentOwner
                        //field.addInfluence(userId, (int)(influence * factor * 1.5));
                        if (fieldsOfThatOwner > 2) { NeighbouringField.addInfluence(fieldToCheck.Owner.id, 1, fieldToCheck.InfluencedBy.First()); }

                    }

                   
                    //StarMapModule.starMap.insertOwnership(allFields[i], allFields[i].OwnerId);
                }
            }
        }


        //creates a neutral zone between factions (one field widths)
        private void CreateNeutralZone() {

            var ToDelete = new List<Field>();

            foreach (System.Collections.DictionaryEntry HashEntry in GeometryIndex.allFields)
            {
                Field fieldToCheck = (Field)HashEntry.Value;

                if (fieldToCheck.Owner != null)
                {
                    var currentOwner = fieldToCheck.Owner;
                    var currentInfluence = fieldToCheck.Influence[currentOwner.id];
                    var Neighbours = GeometryIndex.getDirectNeighbours(fieldToCheck);

                    //get the 4 neighbours, each of these will be checked
                    foreach (var NeighbouringField in Neighbours)
                    {
                        if (NeighbouringField.Owner == null || NeighbouringField.Owner.Equals(currentOwner)) continue;

                        //skip if neighbour is allied or has a pact
                        //allied:
                        if (fieldToCheck.Entity.Equals(NeighbouringField.Entity)) continue;
                    
                        //pact or better:
                        //fetch relation between the two users:
                        /*
                        //Todo: Relation between two other users are lazy fetched during Diplomacy.ts (new UserDetail(userId)).showDetails(_parent);
                        var relation = 2;
                        if (currentOwner != mainObject.user.id) {
                            relation = mainObject.findUser(currentOwner).GetCurrentRelationTowardsUsers(Neighbours[j].OwnerId);
                        } else {
                            relation = mainObject.findUser(Neighbours[j].OwnerId).GetCurrentRelationTowardsUsers(currentOwner);
                        }                  
                        if (relation > 3) continue;
                        */

                        //if neighbour has higher influence, delete this field
                        if (NeighbouringField.Influence[NeighbouringField.Owner.id] >= currentInfluence)
                        {
                            ToDelete.Add(fieldToCheck);
                            //fieldToCheck.Owner = null;
                            //fieldToCheck.Entity = 0;
                            //fieldToCheck.Influence.Clear();
                            //StarMapModule.starMap.insertOwnership(allFields[i], 0);                        
                        }
                    }
                }
            }
            foreach (var DeleTeMe in ToDelete)
            {
                DeleTeMe.Owner = null;
                DeleTeMe.Entity = 0;
                DeleTeMe.Influence.Clear();
            }
        }

        //Remove all fields that do not have at least one neightbour to the left, right, top or bottom
        private void RemoveSingleFields()
        {

            var ToDelete = new List<Field>();

            foreach (System.Collections.DictionaryEntry HashEntry in GeometryIndex.allFields)
            {
                Field fieldToCheck = (Field)HashEntry.Value;

                if (fieldToCheck.Owner != null)
                {
                    var currentOwner = fieldToCheck.Owner;
                    var currentInfluence = fieldToCheck.Influence[currentOwner.id];
                    var Neighbours = GeometryIndex.getDirectNeighbours(fieldToCheck);

                    //get the 4 neighbours, each of these will be checked
                    var FoundNeighbour = false;
                    foreach (var NeighbouringField in Neighbours)
                    {
                        //skip if owner has a neighbouring gielfd, or if neighbouring field belongs to the same alliance 

                        if ((NeighbouringField.Owner != null && NeighbouringField.Owner.Equals(currentOwner)) || fieldToCheck.Entity.Equals(NeighbouringField.Entity)) FoundNeighbour = true;

                        //skip if neighbour is allied
                        //allied:
                        if (fieldToCheck.Entity.Equals(NeighbouringField.Entity)) FoundNeighbour = true;

                        //pact or better:
                        //fetch relation between the two users:
                        /*
                        //Todo: Relation between two other users are lazy fetched during Diplomacy.ts (new UserDetail(userId)).showDetails(_parent);
                        var relation = 2;
                        if (currentOwner != mainObject.user.id) {
                            relation = mainObject.findUser(currentOwner).GetCurrentRelationTowardsUsers(Neighbours[j].OwnerId);
                        } else {
                            relation = mainObject.findUser(Neighbours[j].OwnerId).GetCurrentRelationTowardsUsers(currentOwner);
                        }                  
                        if (relation > 3) continue;
                        */                        
                    }

                    if (!FoundNeighbour) ToDelete.Add(fieldToCheck);
                }
            }
            foreach (var DeleTeMe in ToDelete)
            {
                DeleTeMe.Owner = null;
                DeleTeMe.Entity = 0;
                DeleTeMe.Influence.Clear();
            }
        }

        private void SetFieldOwners()
        {
            foreach (System.Collections.DictionaryEntry HashEntry in GeometryIndex.allFields)
            {
                Field fieldToSet = (Field)HashEntry.Value;

                if (fieldToSet.Influence.Count == 0) continue;
                if (fieldToSet.Influence.Count == 1) { 
                    fieldToSet.Owner = this.core.users[fieldToSet.Influence.First().Key];
                    fieldToSet.Entity = this.core.users[fieldToSet.Influence.First().Key].GetEntity(); 
                    continue; 
                }

                //var ownerId = order by Influence descending, take the first key
                var ownerId = fieldToSet.Influence.OrderBy(x => -x.Value).ThenBy(x => x.Key).First().Key;
                fieldToSet.Owner = this.core.users[ownerId];
                fieldToSet.Entity = this.core.users[ownerId].GetEntity();
            }
        }

        //Pirates, Aliens and so on
        public void createScumm()
        {
            var Pirate = Core.Instance.users.First(e=>e.Value.AiRelation == 0).Value;

            if (Pirate == null) return;

            //check 10 sectors (20x20) from -4960 - 5060
            for (int x = 0; x < 10; x++)
            {
                for (int y = 0; y < 10; y++)
                {
                    var X = (x * 20) + 4900;
                    var Y = (y * 20) + 4900;
                    var width = 20;

                    //1/5 chance to generate a pirate per turn in this area:                    
                    if (!( Lockable.rnd.Next(0, 4 * 6) < 1)) continue;

                    //only create if there is not yet a pirate in the area:
                    //fetch ships in area
                    SpacegameServer.Core.NodeQuadTree.BoundarySouthWest boundarySouthWest = new SpacegameServer.Core.NodeQuadTree.BoundarySouthWest(X, Y);
                    SpacegameServer.Core.NodeQuadTree.Bounding NodeQuadTreeBounding = new SpacegameServer.Core.NodeQuadTree.Bounding(boundarySouthWest, width);
                    List<Ship> nearby = Core.Instance.nodeQuadTree.queryRangeShips(NodeQuadTreeBounding);
                    if (nearby.Any(e => e.userid == Pirate.id)) continue;

                    //create coordinates in the area
                    var noCoordinatesYet = true;
                    var securityCounter = 10;
                    int areaX = 0;
                    int areaY = 0;
                    while (noCoordinatesYet && securityCounter > 0)
                    {
                        areaX = Lockable.rnd.Next(0, 20);
                        areaY = Lockable.rnd.Next(0, 20);

                        //check that the place is empty - no star, no ships
                        var targetRegionId = GeometryIndex.calcRegionId(X + areaX, Y + areaY);
                        var targetField = GeometryIndex.regions[targetRegionId].findOrCreateField(X + areaX, Y + areaY);
                        if (targetField.starId == null || core.stars[(int)targetField.starId].size == 0)
                        {
                            if (targetField.ships.Count == 0)
                            {
                                noCoordinatesYet = false;
                            }
                        }

                        securityCounter--;
                    }
                    if (noCoordinatesYet) continue;

                    //empty place was found, now place the ship:
                    int newShipId = 0;
                    Ship pirate = null;
                    Ship.createPirateShip(Pirate, X + areaX, Y + areaY, ref newShipId, ref pirate);
                    Ship.createPirateShip(Pirate, X + areaX, Y + areaY, ref newShipId, ref pirate, null, pirate.moveDirection);
                    Ship.createPirateFrigate(Pirate, X + areaX, Y + areaY, ref newShipId, ref pirate, null, pirate.moveDirection);
                }
            }
        }

        //create
        private TradeOffer CreateTrade(User sender, GoodsTransfer offered1 = null, GoodsTransfer offered2 = null, GoodsTransfer requested1 = null, GoodsTransfer requested2 = null)
        {
            ClientTrade TradeStub = new ClientTrade();

            if (offered1 != null) TradeStub.Offered.Add(offered1);
            if (offered2 != null) TradeStub.Offered.Add(offered2);
            if (requested1 != null) TradeStub.Requested.Add(requested1);
            if (requested2 != null) TradeStub.Requested.Add(requested2);

            TradeStub.SenderId = sender.id;
            TradeStub.SenderType = 0;

            int newId = (int)core.identities.trades.getNext();
            TradeOffer NewTradeOffer = new TradeOffer(newId, TradeStub);

            var TradingShip = Core.Instance.ships.First(ship => ship.Value.userid == 0 && ship.Value.hullid == 201 && ship.Value.objectid == 437).Value;
            NewTradeOffer.spaceObjectType = 0;

            NewTradeOffer.spaceObjectId = TradingShip.id;

            //Core.Instance.dataConnection.SaveTradeOffer(NewTradeOffer);
            core.tradeOffer.TryAdd(NewTradeOffer.tradeOfferId, NewTradeOffer);

            NewTradeOffer.TradingShip = Core.Instance.ships[NewTradeOffer.spaceObjectId];
            NewTradeOffer.TradingShip.TradeOffers.Add(NewTradeOffer);

            var offerSerialized = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(NewTradeOffer);
            Core.Instance.SendNewTrade(new { NewTradeOffer = offerSerialized });

            return NewTradeOffer;
        }

        //Create AI-Player trades for basic trade offers
        private void CreateTradeWorker()
        {
            Core core = Core.Instance;
            var AncientAI = Core.Instance.users.First(e => e.Value.id == 0).Value;

            List<TradeOffer> NewTrades = new List<TradeOffer>();
            //count trades where antimatter is demanded, and create up to 5 of theses demands
            var TradeCount = core.tradeOffer.Count(e => e.Value.Owner == AncientAI && e.Value.requested.Any(a => a.goodsId == 61));
            for (;TradeCount < 5;TradeCount++)
            {
                NewTrades.Add(this.CreateTrade(
                    AncientAI,
                    new GoodsTransfer(1, 100),//building material
                    new GoodsTransfer(10, 30), //metal
                    new GoodsTransfer(61, 5) //antimatter
                    ));
            }


            //special ressources: make the 5x5 combinations of special resources - those where offer and demand would be the same resource
            for (int i = 0; i < 5; i++)
            {
                for (int j = 0; j < 5; j++)
                {
                    if (i == j) continue;

                    TradeCount = core.tradeOffer.Count(e => e.Value.Owner == AncientAI && e.Value.offered.Any(a => a.goodsId == (1040 + i)) && e.Value.requested.Any(a => a.goodsId == (1040 + j)));

                    for (; TradeCount < 7; TradeCount++)
                    {
                        NewTrades.Add(this.CreateTrade(
                            AncientAI,
                            new GoodsTransfer((short)(1040 + i), 50), //offered
                            null,
                            new GoodsTransfer((short)(1040 + j), 100) //demanded
                            ));
                    }

                }
            }

            //create offers for: bm-food, bm-metal, food-bm, food-metal, metal-bm, metal-food
            //all should be 35:100

            Core.Instance.dataConnection.SaveTradeList(NewTrades);
        }


        public void ratio()
        {
            var users = Core.Instance.users;
            foreach (var entry in users)
            {
                var user = entry.Value;

                double startingFleet = 25;
                int assemblyModifier = 0; //percentage of (additional) construction
                int industryModifier = 0;
                int foodModifier = 0;
                int energyModifier = 0;
                int researchModifier = 0;
                int housingModifier = 0;

                //add Colony Count
                var colCount = user.colonies.Count - 1;
                if (colCount > 0)
                {
                    assemblyModifier += colCount * -10;
                    industryModifier += colCount * -10;
                    researchModifier += colCount * -10;
                }

                //add researches
                foreach (var userResearch in user.PlayerResearch)
                {

                    var researchGain = Core.Instance.Researchs[userResearch.researchId].ResearchGain;
                    if (researchGain == null) continue;
                    startingFleet += researchGain.fleetCount;

                    assemblyModifier += researchGain.construction;
                    industryModifier += researchGain.industrie;
                    foodModifier += researchGain.food;
                    energyModifier += researchGain.energy;
                    researchModifier += researchGain.research;
                    housingModifier += researchGain.housing;
                }

                double fleetCount = 0;
                foreach (var ship in user.ships)
                {
                    fleetCount += Core.Instance.ShipHulls[ship.hullid].modulesCount;
                }

                //fleetSupport are the additional costs produced by having too many ships
                double fleetSupport = (fleetCount - startingFleet) / startingFleet; // 12 - 25 / 25 => OK   30 - 25 / 25 => 0.2 usw => 0.2 = 20% less production...
                fleetSupport = Math.Max(fleetSupport, 0);

                if (fleetSupport > 0)
                {
                    int fleetModificator = (int)(fleetSupport * -100);
                    assemblyModifier += fleetModificator;
                    industryModifier += fleetModificator ;
                }

                /*
               double constructionRatio = (1.0 + (assemblyModifier / 100.0)) - fleetSupport;
               constructionRatio = Math.Max(constructionRatio, 0);

               double industrieRatio = (1.0 + (industryModifier / 100.0)) - fleetSupport;
               industrieRatio = Math.Max(industrieRatio, 0);

               double foodRatio = (1.0 + (foodModifier / 100.0));
               foodRatio = Math.Max(foodRatio, 0);

               
               user.assemblyRatio = constructionRatio;
               user.industrieRatio = industrieRatio;
               user.foodRatio = foodRatio;
               user.researchRatio = 1;
               user.energyRatio = (1.0 + (energyModifier / 100.0));
               */

                user.assemblyRatio = (1.0 + (assemblyModifier / 100.0)); ;
                user.industrieRatio = (1.0 + (industryModifier / 100.0)); ;
                user.foodRatio = (1.0 + (foodModifier / 100.0)); ;
                user.researchRatio = (1.0 + (researchModifier / 100.0));
                user.energyRatio = (1.0 + (energyModifier / 100.0));
                user.housingRatio = (1.0 + (housingModifier / 100.0));
            }
        }

        public void ships()
        {
            var ships = Core.Instance.ships;
            foreach (var entry in ships)
            {
                var ship = entry.Value;
                if (ship.userid == 0) continue;

                ship.versionId++;
                //refit
                if (ship.refitCounter > 0)
                {
                    ship.refitCounter -= 1;
                    if (ship.refitCounter == 0)
                    {
                        double damageRatio = ((double)ship.hitpoints) / ((double)ship.CombatMaxHitpoint); 
                        StatisticsCalculator.calc(ship, Core.Instance);
                        if (damageRatio != 1.0)
                        {
                            ship.hitpoints = (short)(ship.hitpoints * damageRatio);
                        }
                    }
                }

                //noMovementCounter
                if (ship.noMovementCounter > 0)
                {
                    ship.noMovementCounter -= 1;                    
                }


                //hitpoints : ToDO Performance!
                //Doing this for each ship is stupid
                /*
                var clone = ship.clone();
                StatisticsCalculator.calc(clone, Core.Instance);
                if (ship.hitpoints <  clone.hitpoints )
                {
                    //increase by  1/30
                    ship.hitpoints = (short)(ship.hitpoints + (Math.Ceiling(clone.hitpoints / 42.0)));
                    ship.hitpoints = Math.Min(ship.hitpoints, clone.hitpoints);
                } */

                //MovementPoints
                if (ship.noMovementCounter == 0)
                {
                    if (ship.hyper != ship.max_hyper)
                    {
                        ship.hyper = Math.Min(ship.max_hyper, ship.hyper + (ship.max_hyper / 5m));
                    }

                    if (ship.impuls != ship.max_impuls)
                    {
                        ship.impuls = Math.Min(ship.max_impuls, ship.impuls + (ship.max_impuls / 5m));
                    }
                }

                //XP
                if (ship.Experience < ship.ExperienceBase())
                {
                    ship.Experience++;
                }

                if (ship.Harvesting)
                {
                    int maxGain = ship.cargoroom - ship.AmountOnStock();
                    maxGain = Math.Min(maxGain, 50);

                    if (ship.field.starId != null)
                    {
                        short goodId = 1;
                        int starId = (int)ship.field.starId;
                        SpacegameServer.Core.SystemMap star = SpacegameServer.Core.Core.Instance.stars[starId];
                        if (!(star.objectid > 4999 && star.objectid < 5005)) continue;

                        switch (star.objectid)
                        {
                            case 5000:
                                goodId = 701;
                                break;
                            case 5001:
                                goodId = 704;
                                break;
                            case 5002:
                                goodId = 702;
                                break;
                            case 5003:
                                goodId = 703;
                                break;
                            case 5004:
                                goodId = 700;
                                break;
                        }
                        ship.addGood(goodId, maxGain);

                    }
                }
            }
        }


        private void ColonySiege(Colony colony, List<Ship> enemies)
        {
            var user = Core.Instance.users[colony.userId];
            int colonyLevel = (int)(colony.population / 100000000);
            short maxResistance = (short)(5 + Math.Max((colonyLevel / 6), 1));
            var BesiegingShips = enemies.Where(e => e.isTroopTransport() && Core.Instance.userRelations.getRelation(colony.userId, e.userid) == Relation.War).ToList();

            if (BesiegingShips.Count > 0)
            {
                //check Besieger
                if (colony.BesiegedBy == 0)
                {
                    colony.BesiegedBy = BesiegingShips.First().userid;
                    GalacticEvents.AddNewEvent(GalacticEventType.ColonyBesieged, int1: colony.BesiegedBy, int2: colony.userId, string1: colony.name);
                }
                else
                {
                    //check if besieging user is still in orbit:
                    if (!BesiegingShips.Any(e => e.userid == colony.BesiegedBy))
                    {
                        //choose next Besieger:
                        colony.BesiegedBy = BesiegingShips.First().userid;
                    }
                }

                if (colony.TurnsOfSiege > 0) colony.TurnsOfSiege--;

                //switch colony if necessary
                if (colony.TurnsOfSiege <= 0 && Core.Instance.userRelations.getRelation(user.id, colony.BesiegedBy) == Relation.War)
                {
                    GalacticEvents.AddNewEvent(GalacticEventType.ColonyOccupied, int1: colony.BesiegedBy, int2: colony.userId, string1: colony.name);
                    colony.userId = colony.BesiegedBy;
                    var NewOwner = Core.Instance.users[colony.userId];
                    foreach (var colBuilding in colony.colonyBuildings)
                    {
                        colBuilding.userId = colony.BesiegedBy;
                    }

                    //_user.colonies.Any(e => e.starId == star.id);
                    user.colonies.RemoveAll(x => x.id == colony.id);
                    NewOwner.colonies.Add(colony);

                    colony.TurnsOfSiege++;
                    colony.turnsOfRioting = (short)(colonyLevel / 7);
                    colony.BesiegedBy = 0;
                }


            }
            else
            {
                colony.BesiegedBy = 0;
                if (colony.TurnsOfSiege < maxResistance) colony.TurnsOfSiege++;
            }
        }

        public void colonies()
        {
            //var colonies = Core.Instance.colonies.Where(e=> core.users[e.Value.userId].AiId == 0);
            foreach (var entry in Core.Instance.colonies)
            {                

                var colony = entry.Value;
                var user = Core.Instance.users[colony.userId];
                int colonyLevel = (int) (colony.population / 100000000);
                colony.increaseInfluence();

                short maxResistance = (short)(5 + Math.Max((colonyLevel / 6), 1));

                //Nothing happens on colonies with enemies in orbit:
                var EnemyShips = colony.field.EnemiesOnField(colony.userId, colony.systemXY()).ToList();
                if (EnemyShips.Count > 0)
                {
                    ColonySiege(colony, EnemyShips);                    
                    continue;
                }
                
                colony.BesiegedBy = 0;
                if (colony.TurnsOfSiege < maxResistance) colony.TurnsOfSiege++;

                if (colony.turnsOfRioting > 0)
                {
                    colony.turnsOfRioting--;
                    continue;
                }

                if (core.users[colony.userId].AiId != 0) continue;
                                             
                //reset 7 modifiers
                colony.resetModifiers();

                //set population as a good for consumption by the buildings
                var population = (int)(colony.population / 10000000);
                if (colony.goods.Exists(e => e.goodsId == 8))
                    colony.goods.Find(e => e.goodsId == 8).amount = population;
                else
                    colony.addGood(8, population);

                //set energy
                if (colony.goods.Exists(e => e.goodsId == 6))
                    colony.goods.Find(e => e.goodsId == 6).amount = 0;

                //set research
                if (colony.goods.Exists(e => e.goodsId == 12))
                    colony.goods.Find(e => e.goodsId == 12).amount = 0;

                //3 modifiers are set within 
                colonyProductionAndBuildingDeactivation(colony);

                //the remaining 4 modifiers
                colony.researchModifier = colony.colonyBuildings.Where(e => e.isActive).Sum(e => e.building.researchModifier);
                colony.assemblyModifier = colony.colonyBuildings.Where(e => e.isActive).Sum(e => e.building.assemblyModifier);
                colony.housingModifier = colony.colonyBuildings.Where(e => e.isActive).Sum(e => e.building.housingModifier);
                colony.growthModifier = colony.colonyBuildings.Where(e => e.isActive).Sum(e => e.building.growthModifier);

                colonyProduction(colony);

                

                colonyAssemblyPoints(colony);
                colonyPopulationGrowth(colony);
                overCrowdLoss(colony);
                

                //create research points:
                var change = colony.colonyBuildings
                    .Where(building => building.isActive && building.building.BuildingProductions.Any(e => e.goodsId == 12)) // only choose RP producing Buildings
                    .Sum(building => building.building.BuildingProductions.First(production => production.goodsId == 12).amount);

                //research modifier are applied onto the sum of all research points
                double modifier = colony.getModifier(12, true);
                change = (int)Math.Ceiling(change * modifier);

                //change = colony.goods.Exists(e => e.goodsId == 12) ? colony.goods.Find(e => e.goodsId == 12).amount : 0;

                //var change = user.colonies.SelectMany(colony => colony.colonyBuildings).Count(building => building.buildingId == 15 && building.isActive);
                user.researchPoints += change;
                //user.researchPoints += (int)Math.Ceiling(change * user.researchRatio);
                //user.researchPoints += (int)Math.Ceiling(change * user.researchRatio);

                /*
                Colonies: 
                - Building deactivation when Ressources/Population/Energy is missing
	                - message when Buidling is deractivate -> new Message System
                - Ressource Production
	                - message when storage capacity is exceeded 
                - Population Growth	*/
            }
        }


        //check and deactivate buildings, if the colony can not operate them (missing energy, population, raw materials)
        public void colonyProductionAndBuildingDeactivation(Colony colony) 
        {
            //do Production. if one or more colony stock values are negative after production, prevent them from going negative by deactivating consumer buildings           
            
            //calculate the modifiers of the colony, inclusding global modifiers
            // if a building affecting modifiers is deactivated, this whole method has to be called again afterwards
            var productionModifiersChanged = true; //first run is evaluated as if the Modifiers had changed:
            while (productionModifiersChanged)
            {
                productionModifiersChanged = false;
                colony.foodModifier = colony.colonyBuildings.Where(e => e.isActive).Sum(e => e.building.foodModifier);
                colony.energyModifier = colony.colonyBuildings.Where(e => e.isActive).Sum(e => e.building.energyModifier);
                colony.productionModifier = colony.colonyBuildings.Where(e => e.isActive).Sum(e => e.building.productionModifier);


                //use the colonies to have stock and changing(addGood) methods
                Colony onStock = new Colony(colony.id);
                onStock.userId = colony.userId;

                foreach (var entry in colony.goods) onStock.goods.Add(entry.clone());
                onStock.foodModifier = colony.foodModifier;
                onStock.energyModifier = colony.energyModifier;
                onStock.productionModifier = colony.productionModifier;

                foreach (var building in colony.colonyBuildings)
                {
                    if (!building.isActive) continue;
                    foreach (var prodOrCost in building.building.BuildingProductions)
                    {
                        onStock.addGood(prodOrCost.goodsId, prodOrCost.amount, false, true);
                    }
                }

                bool stockAmountOk = true;
                //initial test if everything is ok:
                foreach (var good in onStock.goods)
                {
                    if (good.amount < 0)
                    {
                        stockAmountOk = false;
                        break;
                    }
                }

                int i = 0;
                //if the initial test failed, deactivate as long as stockAmountOk is not true
                //or until a building was deactivated that changes essential Modifiers
                while (!stockAmountOk)
                {
                    //deactivate building (also gives back the ressources produced and spent by the buidling now deactivated
                    ColonyBuilding deactivatedBuilding = colonyBuildingDeactivation(colony, onStock);
                    if (deactivatedBuilding != null && deactivatedBuilding.building.hasProdModifiers())
                    {
                        productionModifiersChanged = true;
                        break;
                    }

                    stockAmountOk = true;
                    foreach (var good in onStock.goods)
                    {
                        if (good.amount < 0)
                        {
                            stockAmountOk = false;
                            break;
                        }
                    }

                    //security:
                    if (i++ > 100) break;
                }
            }
        }

        public void colonyProduction(Colony colony) 
        {

            //Todo: make a fake production to determine Storage capacity
            //copy modifiers!!!
            /*
            foreach (var building in colony.colonyBuildings)
            {
                if (!building.isActive) continue;
                foreach (var prodOrCost in building.building.BuildingProductions)
                {                   
                    colony.addGood(prodOrCost.goodsId, prodOrCost.amount, false, true);                   
                }
            }
            */

            //check versus colony storage capacities. GoodIds 2 (food), 6 (energy), 7 (assembly), 8 (population) have to be skipped

            //get colony storage:
            colony.storage = colony.colonyBuildings.Where(e => e.isActive).Sum(e => e.building.storage);

            //var currentlyOnStock = colony.goods.Where(good => good.goodsId != 2 &&  good.goodsId != 6 && good.goodsId != 7 && good.goodsId != 8).Sum(e => e.amount);
            var currentlyOnStock = colony.AmountOnStock();
            
            var amountChange = colony.colonyBuildings.Where(e => e.isActive).Sum(colBuilding => colBuilding.building.BuildingProductions.Where(productionLine => productionLine.goodsId != 2 && productionLine.goodsId != 6 && productionLine.goodsId != 7 && productionLine.goodsId != 8).Sum(productionLine => productionLine.amount));



            var availableStock = colony.storage - currentlyOnStock;            
            if (amountChange <= 0 || availableStock >= amountChange)
            {
                //amountChange is negative or there is enough storage:
                foreach (var building in colony.colonyBuildings)
                {
                    if (!building.isActive) continue;
                    foreach (var prodOrCost in building.building.BuildingProductions)
                    {
                        colony.addGood(prodOrCost.goodsId, prodOrCost.amount, false, true);
                    }
                }                                
            }
            else
            {
                //production is positive, but there is not enough room
                //reduce all goods that are just surplus this turn (do not reduce goods that are produced and consumed)
                Colony produced = new Colony(colony.id);
                produced.userId = colony.userId;

                //transfer all productions in a new goodList. This will cancel out those goods which are produced and at the same time consumed:
                foreach (var building in colony.colonyBuildings)
                {
                    if (!building.isActive) continue;
                    foreach (var prodOrCost in building.building.BuildingProductions)
                    {                        
                        produced.addGood(prodOrCost.goodsId, prodOrCost.amount, false, true);
                    }
                }

                //calculate a ratio to apply to all surplus values: 0.0 <= ratio < 1.0
                var ratio = (double)availableStock / (double)amountChange;

                //if available stock was negative, ratio should be 0
                ratio = Math.Max(ratio, 0.0);

                foreach (var good in produced.goods)
                {
                    //do not use modifiers, since that was already done previously when filling produced.good
                    //food is always completely added, as well as energy, assembly and population (population should not be possible by building (yet))
                    if (good.amount > 0 && good.goodsId != 2 && good.goodsId != 6 && good.goodsId != 7 && good.goodsId != 8)
                        colony.addGood(good.goodsId, (int)Math.Ceiling(good.amount * ratio), false, false);
                    else
                        colony.addGood(good.goodsId, good.amount, false, false);
                }
            }                                  
        }

        public void colonyAssemblyPoints(Colony colony)
        {
            string PopulationNeededPerAssemblypointStr = System.Configuration.ConfigurationManager.AppSettings["PopulationNeededPerAssemblypoint"].ToString();
            Double PopulationNeededPerAssemblypoint;
            if (!Double.TryParse(PopulationNeededPerAssemblypointStr, out PopulationNeededPerAssemblypoint)) PopulationNeededPerAssemblypoint = 200000000.0;


            var newAssembly = (int)Math.Round(colony.population / PopulationNeededPerAssemblypoint);

            //newAssembly = (int)(newAssembly * colony.getModifier(7, true));
            //newAssembly = newAssembly * Core.Instance.users[colony.userId].getModifier(7);
            colony.addGood(7, newAssembly, false, true);

            //truncate if more assembly points are present than the colony does allow
            //todo: How many should that be?
            //Manufacturing * 5?
            //var maxValue = (int)Math.Floor(colony.population / 10000000.0);
            var maxValue = colony.colonyBuildings.Where(e => e.isActive).Sum(colBuilding => colBuilding.building.BuildingProductions.Where(productionLine => productionLine.goodsId == 7).Sum(productionLine => productionLine.amount));
            maxValue = maxValue * 9;
       
            if (colony.goods.Find(e=>e.goodsId == 7).amount > maxValue)
            {
                colony.goods.Find(e => e.goodsId == 7).amount = maxValue;
            }
        }
        public ColonyBuilding colonyBuildingDeactivation(Colony colony, Colony onStock)
        {
            ColonyBuilding deactivatedBuilding = null;       
            //choose the onStock good  which has negative amount and has the highest tree Value (meaning further down in prod tree)
            int goodId = 0;
            int prodLevel = 0;
            foreach (var good in onStock.goods)
            {
                if (good.amount >= 0) continue;
                if (Core.Instance.Goods[good.goodsId].prodLevel > prodLevel)
                {
                    prodLevel = Core.Instance.Goods[good.goodsId].prodLevel;
                    goodId = good.goodsId;
                }
            }

            //get all consumers of this good on the colony. 
            var colonyBuilding = new List<ColonyBuilding>();
            foreach (var building in colony.colonyBuildings)
            {
                if (!building.isActive) continue;
                bool isConsumer = false;
                foreach(var prodOrCost in building.building.BuildingProductions)
                {
                    if (prodOrCost.amount < 0 && prodOrCost.goodsId == goodId) isConsumer = true;                    
                }
                if (isConsumer) colonyBuilding.Add(building);
            }

            var sortedColonyBuilding = colonyBuilding.OrderByDescending(o => o.building.prodqueuelevel).ToList();

            // "Positive" deactivation
            //find those consumers whose deactivation doe NOT reduce their production good onStock value to a negative amount, then deactivate the consumer with the highest tree value            
            var positiveDeactivation = false;
            foreach(var building in sortedColonyBuilding)
            {
                //"Positive" deactivation skipped for essential buildings: famr 3 and houses 18
                if (building.id == 3 || building.id == 18) continue;

                //check that no production of this building is essential for the colony:
                var isSave = true;
                foreach (var prodOrCost in building.building.BuildingProductions)
                {
                    if (prodOrCost.amount < 0) continue;
                    var amountOnStock = onStock.goods.Find(e => e.goodsId == prodOrCost.goodsId).amount;

                    if (amountOnStock - prodOrCost.amount < 0) isSave = false;                   
                }

                if (isSave)
                {
                    positiveDeactivation = true;
                    building.isActive = false;
                    deactivatedBuilding = building;
                    foreach (var prodOrCost in building.building.BuildingProductions)
                    {
                        onStock.addGood(prodOrCost.goodsId, -prodOrCost.amount, false, true, true);
                    }
                }

                if (positiveDeactivation) break;
            }

            //since no consumer can safely be deactivated, just deactivate the consumer with the highest tree Value
            if (!positiveDeactivation && sortedColonyBuilding.Count > 0)
            {
                deactivatedBuilding = sortedColonyBuilding.First();
                sortedColonyBuilding.First().isActive = false;
                foreach (var prodOrCost in sortedColonyBuilding.First().building.BuildingProductions)
                {
                    onStock.addGood(prodOrCost.goodsId, -prodOrCost.amount, false, true, true);
                }
            }

            return deactivatedBuilding;
        }
        public void colonyPopulationGrowth(Colony colony) 
        { 

            //food consumption:
            var consumption = (int)(colony.population / 100000000 );
            

            //detect available food
            var foodOnStock = colony.goods.Exists(e => e.goodsId == 2) ? colony.goods.Find(e => e.goodsId == 2).amount : 0;
            //var foodRatio = Math.Min ((foodOnStock / consumption),1.0);
            //foodRatio = Math.Max(foodRatio, 0.25);

            //Shrink if the population has not enough food:
            var remainingFood = foodOnStock - consumption ;
            if (remainingFood < 0 )
            {
                var Loss = (remainingFood * 20000000);
                Loss = Math.Max(Loss, -15000000);
                colony.population = colony.population + Loss;
            }
            else
            {
                //check that housing is available
                long Housing = colony.colonyBuildings.FindAll(e => e.isActive).Sum(e => e.building.housing);
                Housing = Housing * 10000000;
                Housing = (long)(Housing * colony.getModifier(-1, true));
                var freeHousing = Housing - colony.population;

                if (freeHousing < 0)
                {
                    freeHousing = Math.Max(freeHousing, -15000000);
                    colony.population = colony.population + freeHousing;
                }
                else
                {
                    //normal growth
                    var growth = freeHousing / 4;

                    //maxGrowth :  10000000000 / 100000000 = 100...
                    double maxGrowth = colony.population / 1000000000.0 ;
                    maxGrowth = Math.Max(maxGrowth , 1);
                    maxGrowth = Math.Sqrt(maxGrowth);
                    var additionalReduction = Math.Max(0,maxGrowth - 2.0); //reduce values a bit if they exceed a threshold
                    maxGrowth = (6.0 - maxGrowth) - additionalReduction;
                    maxGrowth = Math.Max(1, maxGrowth);
                    maxGrowth = maxGrowth * 10000000;


                    growth = Math.Min(growth, 10000000);  // between 1 and 5 points...
                    growth = Math.Max(growth, (int)maxGrowth);

                    if (growth > freeHousing) growth = freeHousing;

                    colony.population = (long)(colony.population + (growth * colony.getModifier(8, true)));

                }
                
                
                
            }

            colony.addGood(2, -consumption, true);
        }

        private void overCrowdLoss( Colony colony) 
        {
            //colony looses half of the unhoused population
            long Housing = colony.colonyBuildings.FindAll(e => e.isActive).Sum(e => e.building.housing);
            Housing = Housing * 10000000;
            Housing = (long)(Housing * colony.getModifier(-1, true));
            colony.population = (long)(colony.population + Math.Min(((Housing - colony.population) / 2), 0.0));

        }
        public long newPopulation(long currentPopulation, double foodRatio)
        {
            //growth of 1.5% per turn
            return currentPopulation + (long)(40000000 * foodRatio);
        }

        //Todo: make somehing more intelligent ;)
        public long newPopulation2(long currentPopulation , double foodRatio)
        {
            //foodRatio will mostly be 2
            if (currentPopulation < 200000000) return currentPopulation + 10000000;
            if (currentPopulation < 400000000) return (long)(currentPopulation * (1 + 0.050 * foodRatio));
            if (currentPopulation < 600000000) return (long)(currentPopulation * (1 + 0.040 * foodRatio));
            if (currentPopulation < 800000000) return (long)(currentPopulation * (1 + 0.020 * foodRatio));
            if (currentPopulation < 1000000000) return (long)(currentPopulation * (1 + 0.010 * foodRatio));
           
            //growth of 1.5% per turn
            return (long)(currentPopulation * (1 + 0.005 * foodRatio)); 
        }

        //research cost according to spread
        // is atm also called during server startup (in the constructor of Core) , so the not yet constructed core has to be provided as parameter -> and may NEVER use Core.Instance to get a core object!
        public void researchSpread(SpacegameServer.Core.Core core)
        {
            // Each user has colonies, each colony has a population value
            // SelectMany merges the many colony-lists
            long populationCount = core.users.SelectMany(user => user.Value.colonies).Sum(colony => colony.population);

            //set full Population Count per user
            foreach (var user in core.users.Values)
            {
                user.Population = user.colonies.Sum(colony => colony.population);
            }

            // loop users, get their research, get the number of population per userresearch
            // results in a ResearchesAndPopulation collection. Each ResearchesAndPopulation consists of PlayerResearchId and the overall amount of population for that user
            // move mouse cursor over "var" to examine the created type
            var researchPopulations = core.users.Select(user => new
            {
                ResearchesAndPopulation = user.Value.PlayerResearch.Where(playerResearch => playerResearch.isCompleted == 1).Select(
                    PlayerResearch =>
                    new {
                        PlayerResearchId = PlayerResearch.researchId,
                        Population = user.Value.Population  
                    })
            });


            //flat the previous enumerator
            var flatted = researchPopulations.SelectMany(userResearches=> userResearches.ResearchesAndPopulation);
            
            //group by researchId and then sum the population per researchId
            var groupedAndSummed = flatted.GroupBy(flattedResearchPopulations => flattedResearchPopulations.PlayerResearchId).Select(e =>
                new
                {
                    ResearchId = e.Key,
                    Population = flatted.Where(flattedElement => flattedElement.PlayerResearchId == e.Key).Sum(flattedElement => flattedElement.Population)
                });


            //apply values to the researches in list core.Researchs
            foreach (var summedResearch in groupedAndSummed)
            {
                var research = core.Researchs[summedResearch.ResearchId];
                research.cost = research.baseCost;

                //example is with research reducer factor 0.5:
                //So if 99 of 100 players have already discovered the research, the hundreth should only have to pay ~50% of base cost, due to knowledge spread...
                //Current research cost should equal: base cost - ( 1/2 * base cost * ( population who has already discovered the research / population overall )
                double reducingBy = ((double)research.baseCost * 0.7 * (double)summedResearch.Population / (double)populationCount);
                research.cost = (short)Math.Ceiling(research.baseCost - reducingBy);                
            }
           
            core.dataConnection.saveResearch(core);
        }
        


        public void userRanks()
        {


            var popFactor = turnCount() / 200.0;
            popFactor = Math.Min(popFactor, 1);
            popFactor = Math.Max(popFactor, 0.1);

            var users = Core.Instance.users;
            foreach (var entry in users)
            {
                var user = entry.Value;

                //toDO: test wih empty list (colonies on turn one may be empty).
                user.popVicPoints = (int)(user.colonies.Sum(e => e.population) / 10000000 * popFactor);

                user.researchVicPoints =
                    (user.PlayerResearch.Select(playerResearch => (int)Core.Instance.Researchs[playerResearch.researchId].cost).Sum()
                    + user.researchPoints);

                //if (user.id == 253) user.researchVicPoints += 1500;

                user.researchVicPoints = user.researchVicPoints / 10;
                
                //user.researchVicPoints = (int)(user.PlayerResearch.Sum(e => (int)e.research.baseCost) / 10);                
                //user.goodsVicPoints = (int)(user.ships.Sum(ship => ship.goods.Sum(good => good.amount)) / 100);
                //user.goodsVicPoints += (int)(user.colonies.Sum(colony => colony.goods.Sum(good => good.amount)) / 100);
                //user.shipVicPoints = user.ships.Sum(ship => core.ShipHulls[ship.hullid].modulesCount);

                //user.overallVicPoints = user.popVicPoints + user.researchVicPoints + user.goodsVicPoints + user.shipVicPoints;
            }

            this.SumAllVicPoints = users.Sum(e => e.Value.popVicPoints) + users.Sum(e => e.Value.researchVicPoints);
            string transcendenceVicPointsFactorStr = System.Configuration.ConfigurationManager.AppSettings["transcendenceVicPointsFactor"].ToString();
            int transcendenceVicPointsFactor;
            if (!Int32.TryParse(transcendenceVicPointsFactorStr, out transcendenceVicPointsFactor)) transcendenceVicPointsFactor = 6;
            this.SumAllVicPoints = this.SumAllVicPoints / transcendenceVicPointsFactor;


            foreach (var entry in users)
            {
                var user = entry.Value;

                //get maximum help that the user did provide so far
                user.shipVicPoints = 0;
                 //select transcensions if user is part of any
                if (core.ships.Any(e => e.Value.isTranscension() && e.Value.shipTranscension.shipTranscensionUsers.Any(transUser => transUser.userId == user.id)))
                {
                   var userTranscensionParticipation = core.ships
                        .Where(e => e.Value.isTranscension() && e.Value.shipTranscension.shipTranscensionUsers.Any(transUser => transUser.userId == user.id))
                        //select for each ship the amount of userHelp
                        .Select(e => e.Value.shipTranscension.shipTranscensionUsers.Where(transUsers => transUsers.userId == user.id).First().helpCount) 
                        .Max();  
                    
                    //set the maximum help into relation of the needed help.
                    var maximumFactor = userTranscensionParticipation / (this.core.GalaxyMap.transcendenceRequirement * 1.0 );
                    user.shipVicPoints = (int)(this.SumAllVicPoints * maximumFactor);
                    
                }

                user.overallVicPoints = user.popVicPoints + user.researchVicPoints + user.shipVicPoints; // +user.goodsVicPoints
            }


            var sortedUsers = users.Values.ToList().OrderByDescending(user => user.overallVicPoints);
            int rank = 1;
            foreach (var user in sortedUsers)
            {
                if (user.AiId != 0) continue;
               
                user.overallRank = rank;
                rank++;
            }

            //alliances
            foreach (var entry in core.alliances)
            {
                var alliance = entry.Value;
                alliance.overallVicPoints = core.users.Values.Where(e => e.allianceId == alliance.id).Sum(e => e.overallVicPoints);
            }

            var sortedAlliances = core.alliances.Values.ToList().OrderByDescending(alliance => alliance.overallVicPoints);           
            rank = 1;
            foreach (var alliances in sortedAlliances)
            {
                alliances.overallRank = rank;
                rank++;
            }

        }

        public void userRanks2()
        {

            var users = Core.Instance.users.Where(e => e.Value.AiId == 0);

            //sum up population
            var usersByPopulation = users.Select(e => new { user = e.Value, population = e.Value.colonies.Sum(c => c.population)}).ToList().OrderByDescending(user => user.population);
            int rank = 1;
            long PreviousPopulation = long.MaxValue;            
            foreach (var user in usersByPopulation)
            {
                //if (user.user.AiId != 0) continue;
                user.user.popVicPoints = rank;

                if (PreviousPopulation > user.population)
                {
                    PreviousPopulation = user.population;
                    rank++;
                }
            }

            //sum up hull size
            var usersByShips = users.Select(e => new { user = e.Value, ships = e.Value.ships.Sum(ship => Core.Instance.ShipHulls[ship.hullid].modulesCount) }).ToList().OrderByDescending(user => user.ships);
            rank = 1;
            int PreviousValue = int.MaxValue;     
            foreach (var user in usersByShips)
            {
                //if (user.user.AiId != 0) continue;

                user.user.shipVicPoints = rank;
                if (PreviousValue > user.ships)
                {
                    PreviousValue = user.ships;
                    rank++;
                }
            }

            //sum research points spent and those unspent
            var usersByResearch = users.Select(e => new
            {
                user = e.Value,
                researchs =
                    (e.Value.PlayerResearch.Select(playerResearch => (int)Core.Instance.Researchs[playerResearch.researchId].cost).Sum()
                    + e.Value.researchPoints)
            }).ToList().OrderByDescending(user => user.researchs);
            rank = 1;
            PreviousValue = int.MaxValue;   
            foreach (var user in usersByResearch)
            {
                //if (user.user.AiId != 0) continue;

                user.user.researchVicPoints = rank;
                if (PreviousValue > user.researchs)
                {
                    PreviousValue = user.researchs;
                    rank++;
                }
            }

            //fetch the transcendence construct where the user has invested the highest amount of ships
            var usersByTranscendence = users.Select(e => new
            {
                user = e.Value,
                transcendence =
                    (core.ships.Any(ship => ship.Value.isTranscension()
                        && ship.Value.shipTranscension != null
                        && ship.Value.shipTranscension.shipTranscensionUsers.Any(transUser => transUser.userId == e.Value.id))) ?
                    core.ships
                         .Where(ship => ship.Value.isTranscension() && ship.Value.shipTranscension.shipTranscensionUsers.Any(transUser => transUser.userId == e.Value.id))
                         //select for each ship the amount of userHelp
                         .Select(ship => ship.Value.shipTranscension.shipTranscensionUsers.Where(transUsers => transUsers.userId == e.Value.id).First().helpCount)
                         .Max() :
                    0
            }).ToList().OrderByDescending(user => user.transcendence);
            rank = 1;
            PreviousValue = int.MaxValue; 
            foreach (var user in usersByTranscendence)
            {
               // if (user.user.AiId != 0) continue;

                user.user.goodsVicPoints = rank;
                if (PreviousValue > user.transcendence)
                {
                    PreviousValue = user.transcendence;
                    rank++;
                }
            }

            var usersOverall = users.Select(e => new { user = e.Value, overall = e.Value.popVicPoints + e.Value.shipVicPoints + e.Value.researchVicPoints + e.Value.goodsVicPoints }).ToList().OrderBy(user => user.overall);
            rank = 1;
            PreviousValue = 0; 
            foreach (var user in usersOverall)
            {
                //if (user.user.AiId != 0) continue;

                user.user.overallRank = rank;
                if (PreviousValue < user.overall)
                {
                    PreviousValue = user.overall;
                    rank++;
                }               
            }

            
        }

        //Todo: count records in turnLog Table 
        public int turnCount() 
        {
            return 100;
        }


    }
}
