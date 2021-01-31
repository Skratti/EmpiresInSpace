
module ColonyModule {

    //deprecated, ToDO: remove or reactivate
    class ColonyBuildQueueElement {
        
        orderNo: number;        //also works as priority. Lower number = higher priority and further up in the orderList
        buildType: number;      // 4 : module , 3: Building , 5: shiphull
        buildId: number;        //id of the type to be build
        targetAmount: number;   //  
        productionNeededPerUnit: number; //deprecated, should remain in the base Data
        productionInvested: number;     // if multiturn, one element may be started without goods to be consumed
        multiTurn: boolean;            

        constructor(public id: number) {
        }

        update(XMLobject: Element) {
            var orderNo = parseInt(XMLobject.getElementsByTagName("orderNo")[0].childNodes[0].nodeValue);
            var buildType = parseInt(XMLobject.getElementsByTagName("buildType")[0].childNodes[0].nodeValue);
            var buildId = parseInt(XMLobject.getElementsByTagName("buildId")[0].childNodes[0].nodeValue);
            var targetAmount = parseInt(XMLobject.getElementsByTagName("targetAmount")[0].childNodes[0].nodeValue);
            var productionNeededPerUnit = parseInt(XMLobject.getElementsByTagName("productionNeededPerUnit")[0].childNodes[0].nodeValue);
            var productionInvested = parseInt(XMLobject.getElementsByTagName("productionInvested")[0].childNodes[0].nodeValue);
            var multiTurn = parseInt(XMLobject.getElementsByTagName("multiTurn")[0].childNodes[0].nodeValue);                  

            this.orderNo = orderNo;
            this.buildType = buildType;
            this.buildId = buildId;
            this.targetAmount = targetAmount;
            this.productionNeededPerUnit = productionNeededPerUnit;
            this.productionInvested = productionInvested;
            this.multiTurn = multiTurn != 1 ? false : true;
        }
        
        name(): string{
            //var SMS = requires("test");

            switch (this.buildType) {
                case 4:
                    return i18n.label( BaseDataModule.getModule(this.buildId).label);
                default:
                    return 'NoName'
            }
        }

    }



    export class Colony extends SpaceUnit {
        name = 'Galaxy';

        private colonyBuildQueue : ColonyBuildQueueElement[] = [];

        size = 10;
        //galaxyColRow = { col: 1, row: 1 };
        //starColRow = { col: 1, row: 1 };

        //tilemapRef; //

        //planetArea; //  reference to the area the colony resides in
        planetArea: AreaSpecifications = null;
        ColonyMap: TilemapModule.ColonyMap; // the Map shared by all planets belonging to his colony

        //planetAreas all planets and moons belonging to this colony
        planetAreas: PlanetData[] = null;

        //parentArea: AreaSpecifications = null;
        //scanRange = 2;

        //
        population = 1;   
        populationPoints = 1;
        populationConsumation = 0;     
        populationFoodGain = 40000000;
        populationGainTotal = 40000000;
        populationHousingLost = 0;
        energy = 0;
        energyTotal = 0;        
        energyConsumation = 0;
        constructionGainBuildings = 0;
        constructionGain = 0;
        constructionGainTotal = 0;
        constructionMax = 0;
        housing = 0;
        housingTotal = 0;
        
        goodsChange: number[] = []; //Production and Consumption [goodsId]->amount (of goods per turn)
        goodsChangeBuildingCount: number[][] //[goodsId][buildingid]->amount (of buildings) 

        shipInConstruction: number;
        constructionDuration: number;

        ownerCurrentlyChecked = false; //is set when the owner was unknown, and is updated at the moment (so that the update is not done a second time)
        
        researchModifier = 0;
        assemblyModifier = 0;
        energyModifier = 0;
        housingModifier = 0;
        foodModifier = 0;
        productionModifier = 0;
        growthModifier = 0;

        productionFullModifier = 0;
        foodFullModifier = 0;

        BesiegedBy = 0;
        TurnsOfSiege = 10;
        TurnsOfRioting = 0;
        MaxResistance = 0;

        Influence = 0;

        allowedMines = 0;
        allowedFuel = 0;
        allowedChemicals = 0;

        planetObjectId = 24;

        field: GameMap.Field;

        constructor(public id: number) {
            super();
            this.cargoroom = 5000;
        }

        GoodsModifier(goodsId: number): number {
            switch (goodsId) {
                case 2: return this.foodFullModifier;
                case 12: return this.researchModifier; //research
                case 61: return 1; //Antimatter
                default: return this.productionFullModifier;
            }           
        }

        CalcMaxResistance() {
            var colonyLevel = (this.population / 100000000);
            this.MaxResistance = (5 + Math.max((colonyLevel / 6), 1));
        }

        update(XMLobject: Element) {

            var jColony = $(XMLobject);
            
           // var id = parseInt($(XMLobject).find('> id').text());
            /*
            var X = XMLobject.getElementsByTagName("X")[0].childNodes[0].nodeValue;
            var Y = XMLobject.getElementsByTagName("Y")[0].childNodes[0].nodeValue;
            var SystemX = XMLobject.getElementsByTagName("SystemX")[0].childNodes[0].nodeValue;
            var SystemY = XMLobject.getElementsByTagName("SystemY")[0].childNodes[0].nodeValue;
            var colonyName = XMLobject.getElementsByTagName("name")[0].childNodes[0].nodeValue;
            var owner = XMLobject.getElementsByTagName("userId")[0].childNodes[0].nodeValue;
            var population = parseInt(XMLobject.getElementsByTagName("population")[0].childNodes[0].nodeValue,0);
            var scanRange = parseInt(XMLobject.getElementsByTagName("scanRange")[0].childNodes[0].nodeValue, 0);
            
            var galaxyColRow = { col: parseInt(X, 10), row: parseInt(Y, 10) };;
            var starColRow = { col: parseInt(SystemX,10), row: parseInt(SystemY,10) };

            var shipInConstruction = XMLobject.getElementsByTagName("shipInConstruction")[0].childNodes[0].nodeValue;
            var constructionDuration = XMLobject.getElementsByTagName("constructionDuration")[0].childNodes[0].nodeValue;
            */

            var X = jColony.find('> X').text();
            var Y = jColony.find('> Y').text(); 
            var SystemX = jColony.find('> SystemX').text(); 
            var SystemY = jColony.find('> SystemY').text(); 
            var colonyName = jColony.find('> name').text(); 
            var owner = jColony.find('> userId').text();  
            var population = parseInt(jColony.find('> population').text());   
            var scanRange = parseInt(jColony.find('> scanRange').text());   

            var galaxyColRow = { col: parseInt(X, 10), row: parseInt(Y, 10) };;


            var starColRow = { col: parseInt(SystemX, 10), row: parseInt(SystemY, 10) };

            if (!galaxyMap.useSolarSystems) starColRow = { col: parseInt(X, 10), row: parseInt(Y, 10) };


            var shipInConstruction = jColony.find('> shipInConstruction').text();   
            var constructionDuration = jColony.find('> constructionDuration').text();  

            var besiegedBy = parseInt(jColony.find('> BesiegedBy').text());   
            var turnsOfSiege = parseInt(jColony.find('> TurnsOfSiege').text());  
            
            var influence = parseInt(jColony.find('> Influence').text()); 

            var turnsOfRioting = parseInt(jColony.find('> turnsOfRioting').text()); 

            var sto = parseInt(jColony.find('> storage').text()); 

            var planetObjectId = parseInt(jColony.find('> planetObjectId').text()); 
            this.planetObjectId = planetObjectId;
            this.cargoroom = sto;

            this.name = colonyName;
            this.galaxyColRow = galaxyColRow;
            this.starColRow = starColRow;
            this.colRow = starColRow;
            this.owner = parseInt(owner);
            this.population = population;
            this.scanRange = scanRange;

            this.shipInConstruction = parseInt(shipInConstruction);
            this.constructionDuration = parseInt(constructionDuration);

            this.BesiegedBy = besiegedBy;
            this.TurnsOfSiege = turnsOfSiege;
            this.TurnsOfRioting = turnsOfRioting;
            this.Influence = influence;
            

            //clear goods
            this.goods = [];            

            var XMLgoods = XMLobject.getElementsByTagName("good");
            var length = XMLgoods.length;

            for (var i = 0; i < length; i++) {
                var goodsIds = XMLgoods[i].getElementsByTagName("goodsId");
                if (goodsIds.length == 0) continue; 

                var id = (<Element> XMLgoods[i]).getElementsByTagName("goodsId")[0].childNodes[0].nodeValue;
                var amount = (<Element>  XMLgoods[i]).getElementsByTagName("amount")[0].childNodes[0].nodeValue;
                this.goods[parseInt(id,10)] = parseInt(amount,10);
            }


            //if starId is transmitted, check if galaxyData has a sub-element with that id. if this is so,  this.area = solarObject
            //this is needed if a user creates a colony. In other cases, the colony is added when a star system is loaded (as part of PlaneData.update())
            if (XMLobject.getElementsByTagName("starId").length > 0) {
                var starId = parseInt(XMLobject.getElementsByTagName("starId")[0].childNodes[0].nodeValue);
                if (galaxyMap && typeof galaxyMap.elementsInArea[starId] !== 'undefined' && galaxyMap.elementsInArea[starId] !== null) {

                    this.parentArea = galaxyMap.elementsInArea[starId];
                    if (galaxyMap.elementsInArea[starId]
                        && galaxyMap.elementsInArea[starId].tilemap
                        && galaxyMap.elementsInArea[starId].tilemap.map
                        && galaxyMap.elementsInArea[starId].tilemap.map[starColRow.col]
                        && galaxyMap.elementsInArea[starId].tilemap.map[starColRow.col][starColRow.row]
                        && galaxyMap.elementsInArea[starId].tilemap.map[starColRow.col][starColRow.row].astronomicalObject) {
                        (<PlanetData> galaxyMap.elementsInArea[starId].tilemap.map[starColRow.col][starColRow.row].astronomicalObject).colony = this;
                        galaxyMap.elementsInArea[starId].tilemap.map[starColRow.col][starColRow.row].astronomicalObject.hasSubElements = true;

                        this.planetArea = (<PlanetData> galaxyMap.elementsInArea[starId].tilemap.map[starColRow.col][starColRow.row].astronomicalObject);
                        if (this.planetArea.ColonyMap == null) {
                            this.planetArea.ColonyMap = new TilemapModule.ColonyMap(this.planetArea);
                        }
                    }
                    //currentMap.map[x][y].stars.colony
                }
            }

            //ToDo: no check yet for nonPlayer-Owners (id = 0)
            if (!mainObject.user.otherUserExists(this.owner) && !this.ownerCurrentlyChecked && this.owner != mainObject.user.id && this.owner != 0) {
                //new player detected
                var scanShip: number;
                var scanColony: number;
                if (mainObject.currentShip == null && mainObject.currentColony == null) {
                    var scanningObject = mainObject.fieldScannedBy(this.galaxyColRow);
                    if (scanningObject instanceof Ships.Ship) scanShip = scanningObject.id;
                    if (scanningObject instanceof ColonyModule.Colony) scanColony = scanningObject.id;

                }

                Helpers.Log('new player detected');
                this.ownerCurrentlyChecked = true;
                mainObject.user.checkNewContact(this.owner, null, this.id, mainObject.currentShip && mainObject.currentShip.id, mainObject.currentColony && mainObject.currentColony.id);
            }

            if (colonyBuildings[this.id] == null) colonyBuildings[this.id] = [];
            getColonyBuildingFromXML(XMLobject);

            this.checkColonyBuildQueueXML(XMLobject);

            this.CalcMaxResistance();

            if (!galaxyMap.useSolarSystems && galaxyMap.elementsInArea[this.id]) {
                galaxyMap.elementsInArea[this.id].colony = this;
            }
        }


        countBuildings(buildingId): number {
            var counter = 0;

            for (var i = 0; i < ColonyModule.colonyBuildings[this.id].length; i++) {
                if (ColonyModule.colonyBuildings[this.id][i] == null) continue;
                if (ColonyModule.colonyBuildings[this.id][i].buildingId === buildingId) counter++;
            }

            return counter;
        }

        applyModifier(amount: number, modifier: number): number {
            return Math.ceil(amount * modifier);          
        }

        //calculate population Points and  Energy and their consumation
        calcColonyRessources() {
           
            //reset
            this.populationPoints = 0;
            this.populationConsumation  = 0;
            this.energy                 = 0;
            this.energyTotal            = 0;
            this.constructionGainBuildings  = 0;
            this.energyConsumation      = 0;
            this.constructionGain = 0;
            this.constructionMax = 0;
            this.goodsChange.length     = 0;
            this.goodsChangeBuildingCount = [];
            this.housing = 0;
            this.populationHousingLost  = 0;

            this.cargoroom = 0;
            this.researchModifier = 0;
            this.assemblyModifier = 0;
            this.energyModifier = 0;
            this.housingModifier = 0;
            this.foodModifier = 0;
            this.productionModifier = 0;
            this.growthModifier = 0;

            this.productionFullModifier = 0;
            this.foodFullModifier = 0;

            this.allowedMines = 0;
            this.allowedChemicals = 0;
            this.allowedFuel = 0;

            this.populationPoints = Math.floor(this.population / 10000000);
            this.goodsChange[2] = -(Math.floor(this.population / 100000000));

            //first cycle over buildings, to fetch their modifiers:
            for (var i = 0; i < ColonyModule.colonyBuildings[this.id].length; i++) {  
                if (ColonyModule.colonyBuildings[this.id][i] == null) continue;
                if (!ColonyModule.colonyBuildings[this.id][i].isActive) continue;

                var buildingType = mainObject.buildings[ColonyModule.colonyBuildings[this.id][i].buildingId];           
                this.housing += buildingType.housing;
                this.cargoroom += buildingType.storage;
                

                this.researchModifier += buildingType.researchModifier;
                this.assemblyModifier += buildingType.assemblyModifier;
                this.energyModifier += buildingType.energyModifier;
                this.housingModifier += buildingType.housingModifier;
                this.foodModifier += buildingType.foodModifier;
                this.productionModifier += buildingType.productionModifier;
                this.growthModifier += buildingType.growthModifier;

                this.allowedMines += buildingType.allowedMines;
                this.allowedFuel += buildingType.allowedFuel;
                this.allowedChemicals += buildingType.allowedChemicals;
            }

            this.productionFullModifier = (1.0 + ((this.productionModifier + RealmStatistics.industryModifiers.getFullModifierSum()) / 100));
            this.foodFullModifier = (1.0 + ((this.foodModifier + RealmStatistics.foodModifiers.getFullModifierSum()) / 100));

            //cycle over all buildings of this colony which are activ and sum the needed values
            for (var i = 0; i < ColonyModule.colonyBuildings[this.id].length; i++) {
                if (ColonyModule.colonyBuildings[this.id][i] == null) continue;
                if (!ColonyModule.colonyBuildings[this.id][i].isActive) continue;

                //get consumation and production of this building
                var buildingType = mainObject.buildings[ColonyModule.colonyBuildings[this.id][i].buildingId];
                var buildingProduction: number[] = buildingType.production;

                //energy and population:
                if (buildingProduction[8] != null) this.populationConsumation += buildingProduction[8];
                if (buildingProduction[6] != null) {
                    if (buildingProduction[6] > 0)
                        this.energy += buildingProduction[6];
                    else
                        this.energyConsumation += buildingProduction[6];
                }

                //construction
                if (buildingProduction[7] != null) {
                    this.constructionGainBuildings += buildingProduction[7];
                    this.constructionMax += (buildingProduction[7] * 9);
                }

                // all standard ressources:
                for (var currentGoodsIndex = 0; currentGoodsIndex < buildingProduction.length; currentGoodsIndex++) {                    
                    if (buildingProduction[currentGoodsIndex] == null || buildingProduction[currentGoodsIndex] == 0) continue;
                    if (mainObject.goods[currentGoodsIndex] == null) continue; //should never occur...
                    if (mainObject.goods[currentGoodsIndex].goodsType != 1) continue; //only use standard ressources, no modules etc

                    //add to tooltip array
                    if (this.goodsChangeBuildingCount[currentGoodsIndex] == null) {
                        this.goodsChangeBuildingCount[currentGoodsIndex] = [];
                    }
                    if (this.goodsChangeBuildingCount[currentGoodsIndex][buildingType.id] == null) {
                        this.goodsChangeBuildingCount[currentGoodsIndex][buildingType.id] = 1;
                    } else {
                        this.goodsChangeBuildingCount[currentGoodsIndex][buildingType.id] += 1;
                    }

                    //add to goods change array
                    if (this.goodsChange[currentGoodsIndex] == null) this.goodsChange[currentGoodsIndex] = 0;
                    var currentModifier = this.GoodsModifier(currentGoodsIndex);
                    this.goodsChange[currentGoodsIndex] += this.applyModifier(buildingProduction[currentGoodsIndex], currentModifier);    

                    this.goodsChange[currentGoodsIndex] = Math.round(this.goodsChange[currentGoodsIndex]);
                }
            }          

            var remainingFood = (this.goods[2] || 0) + this.goodsChange[2];
            var housingModifier = 1 + (this.housingModifier / 100);
            //this.housing = this.housing * housingModifier;
            this.housing = this.housing * (1.0 + ((this.housingModifier + RealmStatistics.housingModifiers.getFullModifierSum()) / 100));
            this.housing = Math.round(this.housing); 
            //this.housing = Math.round(this.housing); 

            //apply modifiers:
            //this.housingTotal = this.housing * (1.0 + ((this.housingModifier + RealmStatistics.housingModifiers.getFullModifierSum()) / 100));
            //this.housingTotal = Math.round(this.housingTotal);


            if (remainingFood < 0) {
                this.populationFoodGain = remainingFood * 20000000;
                this.populationFoodGain = Math.max(this.populationFoodGain, -15000000);
            }
            else {
                
                var freeHousing = (this.housing * 10000000) - this.population;

                if (freeHousing < 0) {
                    freeHousing = Math.max(freeHousing, -15000000);
                    this.populationGainTotal = freeHousing;
                }
                else {
                    //normal growth
                    var growth = freeHousing / 4;

                    //maxGrowth :  10000000000 / 100000000 = 100...
                    var maxGrowth = this.population / 1000000000.0;
                    maxGrowth = Math.max(maxGrowth, 1);
                    maxGrowth = Math.sqrt(maxGrowth);
                    var additionalReduction = Math.max(0, maxGrowth - 2.0); //reduce values a bit if they exceed a threshold
                    maxGrowth = (6.0 - maxGrowth) - additionalReduction;
                    maxGrowth = Math.max(1, maxGrowth);
                    maxGrowth = maxGrowth * 10000000;


                    growth = Math.min(growth, 10000000);  // between 1 and 5 points...
                    growth = Math.max(growth, maxGrowth);

                    if (growth > freeHousing) growth = freeHousing;

                    this.populationFoodGain = growth;

                }

                /*var growth = freeHousing / 4;
                growth = Math.min(growth, 200000000);
                growth = Math.max(growth, 40000000);
                
                this.populationFoodGain = growth;
                */

            }

            //apply growthModifiers
            //this.populationGainTotal = this.populationFoodGain;
            var popModifier = 1.0 + ((this.growthModifier + RealmStatistics.growthModifiers.getFullModifierSum()) / 100)
            this.populationGainTotal = this.populationFoodGain * popModifier;

            //warn if overpopulation will occur?
            this.populationHousingLost = this.populationGainTotal;
            if (this.housing * 10000000 < this.population + this.populationGainTotal) {
                this.populationHousingLost = this.populationGainTotal + (((this.housing * 10000000) - (this.population + this.populationGainTotal)) / 2);
            }
            

            

            this.constructionGain += Math.round(this.population / 1000000000);


            //this.constructionGainTotal = (this.constructionGain + this.constructionGainBuildings) * (1.0 + (RealmStatistics.assemblyModifiers.getFullModifierSum() / 100));            
            //calculate the same way as the server: first the buildings, then population:
            var constructionGainTotalBuild = this.constructionGainBuildings * (1.0 + ((this.assemblyModifier +RealmStatistics.assemblyModifiers.getFullModifierSum()) / 100));
            constructionGainTotalBuild = Math.ceil(constructionGainTotalBuild);

            var constructionGainTotalPop = this.constructionGain * (1.0 + ((this.assemblyModifier + RealmStatistics.assemblyModifiers.getFullModifierSum()) / 100));
            constructionGainTotalPop = Math.ceil(constructionGainTotalPop);
            
            //var constructionModifier = 1.0 + ((this.assemblyModifier + RealmStatistics.assemblyModifiers.getFullModifierSum()) / 100)
            //this.constructionGainTotal = (constructionGainTotalBuild + constructionGainTotalPop) * constructionModifier;
            this.constructionGainTotal = (constructionGainTotalBuild + constructionGainTotalPop);
            // Helpers.Log('Colony {0}: PopPoint: {1} - Energy: {2} - PopConsumed: {3} - EnergyConsumed{4}'.format(this.name, this.populationPoints.toString(10), this.energy.toString(10), this.populationConsumation.toString(10), this.energyConsumation.toString()));

            //apply modifiers:
            this.energyTotal = this.energy * (1.0 + ((this.energyModifier + RealmStatistics.energyModifiers.getFullModifierSum()) / 100) );
            this.energyTotal = Math.round(this.energyTotal);

            
        }

        openSystemMap() {
            this.parentArea.loadAndSwitchThisMap();
            //DrawInterface.switchToArea(this.parentArea);                 
        }

        //Open Colony Screen by opening it's parent area, and then "clicking" on the colony-planet
        selectAndCenter() {

            Helpers.Log('selectAndCenter');
            this.parentArea.loadAndSwitchThisMap();

            this.parentArea.tilemap.tileClick(this.colRow);
            //(<PlanetData>this.parentArea).ColonyMap.tileClick(this.colRow);
            //userInputMethods.showCanvas();
             
            //mainInterface.scrollToPosition(this.colRow.col, this.colRow.row);
            mainInterface.drawAll(); //mainInterface.draw(0, 0, screenSize.width, screenSize.height);
        }

        selectAndOpen() {
            this.planetArea.loadAndSwitchThisMap();
        }
         
        onOpenColonyScreen() {
            mainObject.selectedObject = this;

            mainObject.currentShip = null;
            mainObject.currentColony = this;
            PanelController.showInfoPanel(PanelController.PanelChoice.Colony);            
            this.refreshMainScreenStatistics();          
            //$("#panel-buildings-toggle").css("display", "block"); 
        }        
        

        // Build Queue Functions:
        checkColonyBuildQueueXML(XMLColonyBuildQueue: Element) {
            this.colonyBuildQueue.length = 0;
            var xmlObj = XMLColonyBuildQueue.getElementsByTagName("Queue");
            var length = xmlObj.length;
            var lactColonyId: number;
            for (var i = 0; i < length; i++) {
                this.createUpdateBuildQueue(<Element>xmlObj[i]);
               
            }
            //Helpers.Log(length + " QueueElements added");
        }

        createUpdateBuildQueue(XMLColonyBuildQueueElement: Element) {
            var id = parseInt(XMLColonyBuildQueueElement.getElementsByTagName("id")[0].childNodes[0].nodeValue);

            if (this.colonyBuildQueue[id] == null)
                this.addXMLColonyBuildQueueElement(XMLColonyBuildQueueElement);
            else
                this.colonyBuildQueue[id].update(XMLColonyBuildQueueElement);

        }


        addXMLColonyBuildQueueElement(XMLColonyBuildQueueElement: Element) {
            //console.dirxml(XMLobject);
            var id = 0;
            id = parseInt(XMLColonyBuildQueueElement.getElementsByTagName("id")[0].childNodes[0].nodeValue);
            var newXMLColonyBuildQueueElement = new ColonyBuildQueueElement(id);

            //add to ship array
            this.colonyBuildQueue[id] = newXMLColonyBuildQueueElement;            

            //get all ship Data out of the XMLobject
            newXMLColonyBuildQueueElement.update(XMLColonyBuildQueueElement);
        }

        amountCurrentlyBuild(buildType: number, buildId: number) : number {
            var length = this.colonyBuildQueue.length;
            for (var i = 0; i < length; i++) {
                if (this.colonyBuildQueue[i] == null) continue;
                if (this.colonyBuildQueue[i].buildType != buildType || this.colonyBuildQueue[i].buildId != buildId) continue;
                return this.colonyBuildQueue[i].targetAmount;
            }
            return 0;
        }

        CheckSiege() {
            var isBesieged = false;
            for (var i = 0; i < this.parentArea.shipsInArea.length; i++) {
                var ship = this.parentArea.shipsInArea[i];

                if (ship.owner == 0) { continue; }

                if (ship != null && ship.owner != this.owner && ship.isTroopTransport()) {
                    if (ship.owner != mainObject.user.id) {
                        var shipOwner = mainObject.user.otherUserFind(ship.owner);


                        if (shipOwner.currentRelation == 0) {
                            isBesieged = true;
                            break;
                        }

                    }
                }

                if (isBesieged) break;
            }

            return isBesieged;
        }

        refreshMainScreenStatistics() {

            var isBesieged = this.CheckSiege();

            var panel = $('#quickInfoList');
            panel.html('');

            var heading = $('<span/>', { text: this.name + "  " });
            var renameColony = $('<button/>', {
                text: ".", style: "font-size: 0.3em; padding: 2px 1px 3px 3px;" });
            renameColony.button();
            renameColony.click((e) => { this.renameColony(); });

            heading.append(renameColony);
            heading.css("font-weight", "bold");

            panel.append(heading);

            /*
            var AbandonColony = $("<button id='abandonColonyButton'/>");
            AbandonColony.text("X");
            AbandonColony.button();
            AbandonColony.click((e) => { this.AbandonColony(); });

            panel.append(AbandonColony);
            */

            panel.append($('<br>'));



            //Border Growth bar , also the Isbesieged Bar and "Rioting" bar
            /*
            var InfluenceBar: JQuery;
            InfluenceBar = mainInterface.createBar();
            InfluenceBar.addClass("ProgressBar");
            */

            //precalcualte some needed values
            if (!isBesieged && this.TurnsOfRioting == 0) {
                var CurrentRing = StarMapModule.InfluenceToRingNo(this.Influence);
                var NextRing = CurrentRing + 1;
                var CurrentRingRequirement = StarMapModule.RingToMinInfluence(CurrentRing);
                var NextRingRequirement = StarMapModule.RingToMinInfluence(NextRing);
                var InfluenceNeeded = Math.max(NextRingRequirement - CurrentRingRequirement, 1);
                var InfluenceOfNextLevel = this.Influence - CurrentRingRequirement;
                var PerTurn = Math.round(this.population / 1000000000.0);

                //create left and right labels
                /*
                var LeftText = $('<div>', { text: i18n.label(843) + " (+" + PerTurn + ")", "class": "progress-label" });
                InfluenceBar.append(LeftText);          
                var RightText = $('<div>', { text: this.Influence.toString() + "/" + NextRingRequirement , "class": "progress-label" });
                RightText.css("right","4px");
                InfluenceBar.append(RightText);

                //create and append the influence bar
                InfluenceBar.progressbar("option", {
                    value: Math.floor((InfluenceOfNextLevel / InfluenceNeeded) * 100)
                });
                panel.append(InfluenceBar);   
                */

                var LeftTextStr = i18n.label(843) + " (+" + PerTurn + ")";
                var RightTextStr = this.Influence.toString() + "/" + NextRingRequirement;
                var Progress = Math.floor((InfluenceOfNextLevel / InfluenceNeeded) * 100);
                var InfluenceBar2 = mainInterface.createTextBar(LeftTextStr, RightTextStr, Progress);
                panel.append(InfluenceBar2);
            }
            else {
                if (isBesieged) {
                    var BesiegerName = this.BesiegedBy.toString();
                    if (mainObject.user.id == this.BesiegedBy) {
                        BesiegerName = mainObject.user.name;
                    } else {
                        if (mainObject.user.otherUserExists(this.BesiegedBy)) {
                            BesiegerName = mainObject.user.otherUsers[this.BesiegedBy].shortTagFreeName();
                        }
                    }


                    var LeftTextStr = i18n.label(753).format(BesiegerName);
                    var RightTextStr = i18n.label(754).format(this.TurnsOfSiege.toString());
                    var Progress = Math.floor(((this.MaxResistance - this.TurnsOfSiege) / this.MaxResistance) * 100);
                    var InfluenceBar2 = mainInterface.createTextBar(LeftTextStr, RightTextStr, Progress,'linear-gradient(to bottom, #993332 0%, #bb4020 100%)');
                    panel.append(InfluenceBar2);
                }
                else {

                    var LeftTextStr = i18n.label(981).format(this.TurnsOfRioting.toString());
                    var RightTextStr = "";
                    var Progress = Math.floor((this.TurnsOfRioting / this.MaxResistance) * 100);
                    var InfluenceBar2 = mainInterface.createTextBar(LeftTextStr, RightTextStr, Progress, 'linear-gradient(to bottom, #997732 0%, #bb6020 100%)');
                    panel.append(InfluenceBar2);
                }
            }    


            //Create table for colony relevant values
            var buildTable = $('<table/>', { "cellspacing": 0 });// , style:"border-collapse: collapse;"                       

            /*
            var tableRowButton = $('<tr/>');
            var tableDataBut = $('<td/>');
            var but1 = $('<button/>', { text: i18n.label(277) });  //Bauaufträge
            but1.button();
            but1.click((e) => { this.showColonyBuildQueue(); });
            
            tableDataBut.append(but1);
           
            tableRowButton.append(tableDataBut);
            buildTable.append(tableRowButton);
            */
              
            //show overall Population, Housing and remaining not working population
            var tableRowPopulation = $('<tr/>', { "Title": '' });

            var tableRowPopulationIcon = $('<td/>', {"class":"ColonyStatisticsIcon" });
            var tableRowPopulationIconDiv = $('<div/>', {"class":"Population" });
            tableRowPopulationIcon.append(tableRowPopulationIconDiv);
            tableRowPopulation.append(tableRowPopulationIcon);

            var tableRowPopulationText = $('<td/>', { text: i18n.label(156) }); //Population

            tableRowPopulation.append(tableRowPopulationText);
            // var pop =      (-this.populationConsumation).toString() + '/' + this.populationPoints.toString() + ' (' + this.housing.toString() + ')';
            var pop = $('<span>', { text: (this.populationPoints.toString() + '/' + this.housing.toFixed(0) + ' (') });

            var remainingPop = $('<span>', { text: (this.populationPoints + this.populationConsumation).toString() });
            if (this.populationPoints + this.populationConsumation >= 10) remainingPop.addClass('colonyPointsOK');
            else if (this.populationPoints + this.populationConsumation >= 0) remainingPop.addClass('colonyPointsNotOK');
            else remainingPop.addClass('colonyPointsMissing');

            var closing = $('<span>', { text: ')' });

            var popOpen = $('<span>', { text: ' (' });
            var popChangeN = (this.populationHousingLost / 10000000);
            var popChange = $('<span>', { text: popChangeN.toFixed(1) });
            if (popChangeN >= 0) { popChange.addClass('colonyPointsOK'); popChange.text('+' + popChange.text())}
            else popChange.addClass('colonyPointsMissing');
            var popClose = $('<span>', { text: ')' });

            var tableDataPop = $('<td/>');
            tableDataPop.append(pop).append(remainingPop).append(closing).append(popOpen).append(popChange).append(popClose);
            tableRowPopulation.append(tableDataPop);
            this.tooltipPopulation(tableRowPopulation);

            buildTable.append(tableRowPopulation);

            var tableRowEnergy = $('<tr/>', { "Title": '' });

            var tableRowEnergyIcon = $('<td/>', {"class":"ColonyStatisticsIcon" });
            var tableRowEnergyIconDiv = $('<div/>', {"class":"Energy" });
            tableRowEnergyIcon.append(tableRowEnergyIconDiv);
            tableRowEnergy.append(tableRowEnergyIcon);

            var tableRowEnergyText = $('<td/>', { text: i18n.label(62) });

            tableRowEnergy.append(tableRowEnergyText);
            
            //show overall Energy production and remaining energy
            var energy = $('<span>', { text: (this.energyTotal.toString() + ' (') });
            var remainingE = (this.energyTotal + this.energyConsumation);
            var remainingESpan = $('<span>', { text: remainingE.toString() });
            if (remainingE >= 10) remainingESpan.addClass('colonyPointsOK');
            else if (remainingE >= 0) remainingESpan.addClass('colonyPointsNotOK');
            else remainingESpan.addClass('colonyPointsMissing');
            var closing2 = $('<span>', { text: ')' });
            var tableDataEnergy = $('<td/>');
            tableDataEnergy.append(energy).append(remainingESpan).append(closing2);

            tableRowEnergy.append(tableDataEnergy);
            this.tooltipEnergy(tableRowEnergy);

            buildTable.append(tableRowEnergy);

            /*
            var constructionPlants: number = 0;
            for (var j = 0; j < colonyBuildings[this.id].length; j++) {
                if (colonyBuildings[this.id][j] == null) continue;
                if (colonyBuildings[this.id][j].buildingId !== 19) continue;
                if (!colonyBuildings[this.id][j].isActive || colonyBuildings[this.id][j].underConstruction) continue;
                constructionPlants++;
            }
            */
            //Helpers.Log('constructionPlants: ' + constructionPlants);


            //Construction

            //calc change of selected building:
            var selectedBuidlingCosts = '';
            if (mainObject.selectedBuilding != null &&  mainObject.buildings[ mainObject.selectedBuilding].costs[7] != null) {
                selectedBuidlingCosts = '-'+ mainObject.buildings[mainObject.selectedBuilding].costs[7].toString();
            }

            var tableRowConstruction = $('<tr/>', { "Title": '' });

            var tableRowConstructionIcon = $('<td/>', {"class":"ColonyStatisticsIcon" });
            var tableRowConstructionIconDiv = $('<div/>', { "class": "Assembly" });
            tableRowConstructionIcon.append(tableRowConstructionIconDiv);
            tableRowConstruction.append(tableRowConstructionIcon);

            var tableRowConstructionText = $('<td/>', { text: i18n.label(278) }); 
            tableRowConstruction.append(tableRowConstructionText);
            var construction = (this.goods[7] || 0).toString();
            //var tdConstructionData = $('<td/>', { text: construction });
            var tdConstructionData = $('<td/>');
            tdConstructionData.append($('<span/>', { "text": construction + selectedBuidlingCosts }));
            tdConstructionData.append($('<span/>', {"text": " ("}));
            tdConstructionData.append($('<span/>', { "class": "positiveChange", "text": "+" + this.constructionGainTotal.toFixed(0) }));
            tdConstructionData.append($('<span/>', { "text": ")" }));
            //this.constructionGain
            tableRowConstruction.append(tdConstructionData);
            this.tooltipAssembly(tableRowConstruction);
            buildTable.append(tableRowConstruction);

            /*
            //industrie
            var tableRowIndustry = $('<tr/>', { "Title": '' });
            var tableRowIndustryText = $('<td/>', { text: i18n.label(637) }); //Industry
            tableRowIndustry.append(tableRowIndustryText);

            //var tdConstructionData = $('<td/>', { text: construction });
            var tdIndustryData = $('<td/>');
            tdIndustryData.append($('<span/>', { "text": "-15%" }));

            //this.constructionGain
            tableRowIndustry.append(tdIndustryData);
            this.tooltipIndustry(tableRowIndustry);
            buildTable.append(tableRowIndustry);
            */

            //research
            var researchs: number = 0;
            for (var j = 0; j < colonyBuildings[this.id].length; j++) {
                if (colonyBuildings[this.id][j] == null) continue;
                //if (colonyBuildings[this.id][j].buildingId !== 15) continue;
                if (!colonyBuildings[this.id][j].isActive || colonyBuildings[this.id][j].underConstruction) continue;

                //GoodId 12 stand for generated researchpoints
                if (!mainObject.buildings[colonyBuildings[this.id][j].buildingId].production[12]) continue;
                researchs += mainObject.buildings[colonyBuildings[this.id][j].buildingId].production[12];
            }

            var researchModified = researchs * (1.0 + (RealmStatistics.researchModifiers.getFullModifierSum() / 100.0));


            var tableRowResearch = $('<tr/>', { "Title": '' });

            var tableRowResearchIcon = $('<td/>', {"class":"ColonyStatisticsIcon"});
            var tableRowResearchIconDiv = $('<div/>', { "class": "Research" });
            tableRowResearchIcon.append(tableRowResearchIconDiv);
            tableRowResearch.append(tableRowResearchIcon);

            var tableRowResearchText = $('<td/>', { text: i18n.label(638) }); //Research
            tableRowResearch.append(tableRowResearchText);

            //var tdConstructionData = $('<td/>', { text: construction });
            var tdResearchData = $('<td/>');
            tdResearchData.append($('<span/>', { "text": researchModified.toFixed(1) }));
           
            //this.constructionGain
            tableRowResearch.append(tdResearchData);
            this.tooltipResearch(tableRowResearch, researchs);
            buildTable.append(tableRowResearch);


            panel.append(buildTable);
            
            /*
            if (isBesieged) {
                var BesiegerName = this.BesiegedBy.toString();
                if (mainObject.user.id == this.BesiegedBy) {
                    BesiegerName = mainObject.user.name;
                } else {
                if (mainObject.user.otherUserExists(this.BesiegedBy)) {
                    BesiegerName = mainObject.user.otherUsers[this.BesiegedBy].shortTagFreeName();
                    }
                }

                var SiegeName = $('<span/>');
                SiegeName.html(i18n.label(753).format(BesiegerName));
                //panel.append($('<span/>', { text: i18n.label(753).format(BesiegerName) }));
                panel.append(SiegeName);

                var Resistance = $('<span/>', { "text": i18n.label(754).format(this.TurnsOfSiege.toString()) });
                Resistance.css("float", "right");
                panel.append(Resistance);
            }

            if (!isBesieged && this.TurnsOfRioting > 0) {
                var Rioting = $('<span/>', { "text": i18n.label(981).format(this.TurnsOfRioting.toString()) });
                Rioting.css("float", "right").css("font-weight", "bold").css("color", "#ff6644");
                panel.append(Rioting);
            }
            */
            
            //tdResearchData.append(DrawInterface.createGoodsDiv(2, 3));
            //tableRowResearch.tooltip({ content: "BLAHHH111" });

            //tableRowPopulation.tooltip({ content: () => { return this.populationTooltip().html(); } });
        }

        renameColony() {
            var newNameContainer = ElementGenerator.renamePanel(this.name, i18n.label(279) + ' '  );
            $('.yesButton', newNameContainer).click((e) => {
                var newName = $(".inputEl", newNameContainer).val();
                $.ajax("Server/colonies.aspx", {
                    type: "GET",
                    async: true,
                    data: {
                        "action": "renameColony",
                        "colonyId": this.id.toString(),
                        "newName": newName
                    }
                });
                newNameContainer.remove();
                this.name = newName.toString();
                this.refreshMainScreenStatistics();
            });
        }

        AbandonColonyCommit(abandonContainer: JQuery) {
            
            var panelBody = $('.relPanelBody', abandonContainer);
            var input = $('input', panelBody);
            

            if (input.val() == this.owner.toString()) {
                $.ajax("Server/colonies.aspx", {
                    type: "GET",
                    async: false,
                    data: {
                        "action": "AbandonColony",
                        "colonyId": this.id.toString()
                    }
                }).done((msg) => {
                    mainObject.currentShip = null;
                    mainObject.selectedObject = null;
                    PanelController.hideMenus();

                    DrawInterface.switchToArea(this.parentArea); 

                    var shipsFromXML = msg.getElementsByTagName("ship");
                    for (var i = 0; i < shipsFromXML.length; i++) {
                        mainObject.shipUpdate(shipsFromXML[i]);
                    }
                    ColonyModule.checkColonyXML(msg);
                               
                }); 
            }
        }

        AbandonColony() {

            var AbandonContainer = ElementGenerator.createNoYesPopup(
                (e) => { e.preventDefault(); this.AbandonColonyCommit(AbandonContainer); AbandonContainer.remove();},
                (e) => { e.preventDefault(); AbandonContainer.remove(); },
                i18n.label(763),
                i18n.label(764).format(this.name, this.owner.toString()),
                null,
                1);
            ElementGenerator.adjustPopupZIndex(AbandonContainer, 16000);

            var AuthorizationInput = $('<input/>', { "class": "inputEl", style: "width : 170px;" });
            var panelBody = $('.relPanelBody', AbandonContainer);
            panelBody.append($('<br>'));
            panelBody.append(AuthorizationInput);
           
            ElementGenerator.makeMedium(AbandonContainer);
            AbandonContainer.appendTo("body"); //attach to the <body> element
            AuthorizationInput.focus();
        }

        tooltipLine(): JQuery {
            var line = $('<span>', { text: "----------------------" });
            line.css("line-height", "60%");
            return line;
        }

        tooltipPopulation(row: JQuery) {
            var populationTooltipTemp = $("<div/>");
            var populationTooltip = $("<div/>");
            populationTooltip.css("line-height", "140%");

            populationTooltipTemp.append(populationTooltip);
            /*
            4.00 Wachstum
	        ---------------------
	        ^ +10% von Gebäuden
	        ^ +20% von Forschungen
	        ---------------------
	        Wachstum gesamt: 5.2
	        ---------------------
	        484 Bevölkerung
	        460 Limit durch Häuser
            -14 Überbevölkerung 
            ---------------------
            -8.8 Gesamt
	        ---------------------
	        Benötigte Arbeitskräfte: 345
	        Arbeitskräfte verfügbar: 135
            */
            

            if (this.populationFoodGain >= 0) {
                populationTooltip.append($('<span>', { text: (this.populationFoodGain / 10000000).toFixed(2) + ' ' + i18n.label(639) })).append($('<br>'));
                populationTooltip.append(this.tooltipLine()).append($('<br>'));
                /*
                populationTooltip.append($('<span>', { text: " +10% " + i18n.label(640) })).append($('<br>'));
                populationTooltip.append($('<span>', { text: " +20% " + i18n.label(641) })).append($('<br>'));
                populationTooltip.append(this.tooltipLine()).append($('<br>'));
                */
                RealmStatistics.growthModifiers.add2Tooltip(populationTooltip, true);
                if (this.growthModifier) {
                    populationTooltip.append(BaseDataModule.modifierTooltipDiv(BaseDataModule.Modificators.Growth, this.growthModifier));
                }

                populationTooltip.append($('<span>', { text: i18n.label(642) + (this.populationGainTotal / 10000000).toFixed(2) })).append($('<br>')); //Total Growth
            }
            else {
                /*
                Nahrungsmangel
	            -6 wegen Nahrungsmangel (3)
                */
                populationTooltip.append($('<span>', { text: (this.populationFoodGain / 10000000).toFixed(2) + ' ' + i18n.label(646) })).append($('<br>'));
            }
            populationTooltip.append(this.tooltipLine()).append($('<br>'));
            populationTooltip.append($('<span>', { text: this.populationPoints.toString() + ' ' + i18n.label(156) })).append($('<br>'));
            populationTooltip.append($('<span>', { text: this.housing.toFixed(0) + ' ' + i18n.label(410) })).append($('<br>')); //Wohnraum
            if (this.populationHousingLost != this.populationGainTotal) {
                populationTooltip.append($('<span>', { text: ((this.populationHousingLost - this.populationFoodGain) / 10000000).toFixed(1) + ' ' + i18n.label(681) })).append($('<br>'));
                populationTooltip.append(this.tooltipLine()).append($('<br>'));
                populationTooltip.append($('<span>', { text: (this.populationHousingLost / 10000000).toFixed(1) + ' ' + i18n.label(682) })).append($('<br>'));
            }
            else {
                populationTooltip.append(this.tooltipLine()).append($('<br>'));
            }
            populationTooltip.append($('<span>', { text: i18n.label(643) + (-this.populationConsumation) })).append($('<br>'));
            populationTooltip.append($('<span>', { text: i18n.label(644) + (this.populationPoints + this.populationConsumation).toString() })).append($('<br>')); //Arbeiter verbleibend
            
            row.tooltip({ content: function () { return populationTooltipTemp.html(); } });
        }

        tooltipEnergy(row: JQuery) {
            var energyTooltip = $("<div/>");
            /*
            Gebäude: 510
		    ---------------------
		    ^ +5% von Gebäuden
		    ^ +10% von Forschungen
		    ---------------------
		    Energie gesamt: 555
		    -------------------
		    Aktueller Vebrauch: 475
		    Energie verfügbar: 80
            */                             
            energyTooltip.append($('<span>', { text: i18n.label(398) + ': '+ this.energy.toString() })).append($('<br>')); //Gebäude

            energyTooltip.append(this.tooltipLine()).append($('<br>'));
            RealmStatistics.energyModifiers.add2Tooltip(energyTooltip, true);

            if (this.energyModifier) {
                energyTooltip.append(BaseDataModule.modifierTooltipDiv(BaseDataModule.Modificators.Energy, this.energyModifier));
            }

            energyTooltip.append($('<span>', { text: i18n.label(647) + this.energyTotal })).append($('<br>')); //Total Energy 

            energyTooltip.append(this.tooltipLine()).append($('<br>'));
            energyTooltip.append($('<span>', { text: i18n.label(648) + (-this.energyConsumation) })).append($('<br>'));
            energyTooltip.append($('<span>', { text: i18n.label(649) + (this.energyTotal + this.energyConsumation).toString() })).append($('<br>'));

            row.tooltip({ content: function () { return energyTooltip.html(); } });
        }

        tooltipAssembly(row: JQuery) {
            var assemblyTooltip = $("<div/>");
            /*
            3 von Gebäuden
	        15 von Bevölkerung
	        ---------------------
	        ^ +10% von Gebäuden
	        ^ +20% von Forschungen
	        ---------------------
	        Construction gesamt: 20
	        ---------------------
	        340 vorhanden
	        350 Limit
            */
            

            //var construction = (this.goods[7] || 0).toString();
            assemblyTooltip.append($('<span>', { text: " " + this.constructionGainBuildings +" " + i18n.label(640) })).append($('<br>'));
            assemblyTooltip.append($('<span>', { text: " " + this.constructionGain + " " + i18n.label(650) })).append($('<br>'));
            assemblyTooltip.append(this.tooltipLine()).append($('<br>'));

            /*
            assemblyTooltip.append($('<span>', { text: " +10% " + i18n.label(640) })).append($('<br>'));
            assemblyTooltip.append($('<span>', { text: " +20% " + i18n.label(641) })).append($('<br>'));
            assemblyTooltip.append(this.tooltipLine()).append($('<br>'));
            */
            RealmStatistics.assemblyModifiers.add2Tooltip(assemblyTooltip, true);

            if (this.assemblyModifier) {
                assemblyTooltip.append(BaseDataModule.modifierTooltipDiv(BaseDataModule.Modificators.Assembly, this.assemblyModifier));
            }

            assemblyTooltip.append($('<span>', { text: i18n.label(651) + this.constructionGainTotal.toFixed(0) })).append($('<br>')); //Total Growth            

            assemblyTooltip.append(this.tooltipLine()).append($('<br>'));
            assemblyTooltip.append($('<span>', { text: i18n.label(652) + (this.goods[7] || 0).toString()  })).append($('<br>'));  //Current
            assemblyTooltip.append($('<span>', { text: i18n.label(653) + this.constructionMax.toString() })).append($('<br>')); //Limit

            row.tooltip({ content: function () { return assemblyTooltip.html(); } });

        }

        tooltipIndustry(row: JQuery) {
            var industryTooltip = $("<div/>");
            /*
           +12% von Gebäuden 
	-18% von Forschungen
	--------------------
	-6% Industrie Modifikator
            */
            /*
            industryTooltip.append($('<span>', { text: " +10% " + i18n.label(640) })).append($('<br>'));
            industryTooltip.append($('<span>', { text: " +20% " + i18n.label(641) })).append($('<br>'));
            industryTooltip.append(this.tooltipLine()).append($('<br>'));
            */
            RealmStatistics.industryModifiers.add2Tooltip(industryTooltip, true);

            industryTooltip.append($('<span>', { text: " +30% " + i18n.label(654) })).append($('<br>'));
   
          
            row.tooltip({ content: function () { return industryTooltip.html(); } });
        }

        tooltipResearch(row: JQuery, researchs : number) {
            var researchTooltip = $("<div/>");
            //
            /*
            	Gebäude: 15
	            ---------------------
	            ^ +10% von Gebäuden
	            ^ +5% von Rassenbonus
	            ^ +17% von Forschungen
	            ---------------------
	            Forschung gesamt: 19
            */
            

     
            researchTooltip.append($('<span>', { text: researchs.toString() + ' ' + i18n.label(640) })).append($('<br>'));
            researchTooltip.append(this.tooltipLine()).append($('<br>'));

            RealmStatistics.researchModifiers.add2Tooltip(researchTooltip, true);
            if (this.researchModifier) {
                researchTooltip.append(BaseDataModule.modifierTooltipDiv(BaseDataModule.Modificators.Research, this.researchModifier));
            }

            var researchModified = researchs * (1.0 + (RealmStatistics.researchModifiers.getFullModifierSum() / 100.0));

            researchTooltip.append($('<span>', { text: i18n.label(655) + researchModified.toFixed(1) })).append($('<br>')); //Total Growth
         
            row.tooltip({ content: function () { return researchTooltip.html(); } });
        }

       fixHelper(e, ui) {
            ui.children().each(function () {
                $(this).width($(this).width());
            });
            return ui;
        }

    }

    function createBQHeaderLine(): JQuery {

        var tableRow = $('<tr/>');
               
        var tableDataName = $('<th/>', { text: i18n.label(280), "class": "tdTextLeft" });
        tableRow.append(tableDataName);

        var tableDataAmount = $('<th/>', { text: i18n.label(281) });
        tableRow.append(tableDataAmount);
        
        var tableDataProduction = $('<th/>', { text: i18n.label(231) }); //amount of construction points already spent
        tableRow.append(tableDataProduction);
       
        return tableRow;
    }

    function createBQTableLine(buildQueueElement: ColonyBuildQueueElement): JQuery {

        var tableRow = $('<tr/>', { style: "background-color: lightgrey" });
        
        var tableDataName = $('<td/>', { text: buildQueueElement.name(), "class": "firstchild tdTextLeft" });
        tableRow.append(tableDataName);
       
        var tableDataAmount = $('<td/>');
        var span2 = $("<span/>", { text: " Menge: " + buildQueueElement.targetAmount.toString() + " " });
        tableDataAmount.append(span2);
        tableRow.append(tableDataAmount);
        
        var tableDataProduction = $('<td/>', { "class": "lastchild" });
        var span3 = $("<span/>", { text: " " + buildQueueElement.productionInvested.toString() + "/" + buildQueueElement.productionNeededPerUnit.toString() });
        tableDataProduction.append(span3);
        tableRow.append(tableDataProduction);
      
        tableRow.data("buildQueueItem", buildQueueElement);

        return tableRow;
    }

    //called during newTurn
    export function initColonies(startup?: boolean) {


        var xhttp = GetXmlHttpObject();
        if (xhttp == null) {
            alert("Your browser does not support AJAX!");
            return;
        }

        //xmlMap get the map and draw it:
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                checkColonyXML(xhttp.responseXML);
               
            }
        }

        xhttp.open("GET", "Server/colonies.aspx?action=getData", false);
        xhttp.send("");
    };

    export function checkColonyXML(xmlColony: Document) {
        var xmlObj = xmlColony.getElementsByTagName("Colony");
        var length = xmlObj.length;
        var lactColonyId: number;
        for (var i = 0; i < length; i++) {
            createUpdateColony(xmlObj[i]);
            /*
            var id = 0;
            id = parseInt(xmlObj[i].getElementsByTagName("id")[0].childNodes[0].nodeValue);
    
            if (mainObject.coloniesById[id] == null)
                addColony(<Element>xmlObj[i]);
            else
                mainObject.coloniesById[id].update(<Element>xmlObj[i]);
            */
        }

        Helpers.Log(length + " colonies added");
    }

    function createUpdateColony(xmlColony: Element) {
        //var coloniesXMLstr = new XMLSerializer().serializeToString(xmlColony);
        //var coloniesJqXML = $.parseXML(coloniesXMLstr);
        //var coloniesJq = $(coloniesJqXML);
        //Helpers.Log(coloniesXMLstr);

        var id = parseInt($(xmlColony).find('> id').text());
        //var id = parseInt(xmlColony.getElementsByTagName("id")[0].childNodes[0].nodeValue);

        if (mainObject.coloniesById[id] == null)
            addColony(xmlColony);
        else
            mainObject.coloniesById[id].update(xmlColony);

    }


    function addColony(XMLobject: Element) {
        //console.dirxml(XMLobject);
        var id = parseInt($(XMLobject).find('> id').text());
        
        //id = parseInt(XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        var newColony = new Colony(id);

        //add to ship array
        mainObject.colonies.push(newColony);
        mainObject.coloniesById[id] = newColony;

        //get all ship Data out of the XMLobject
        newColony.update(XMLobject);
        if (newColony.owner == mainObject.user.id) newColony.addGalaxyScanrange();

        //add surface tiles
        /*var xmlTile = XMLobject.getElementsByTagName("surfaceTile");
        var length = xmlTile.length;      
        for (var i = 0; i < length; i++) {
            newColony.planetArea.createUpdateSurfaceFieldElement(xmlTile[i]);           
        }*/
    }

    var colonyListPanel: JQuery;

    export function existColonyByCoordinates(galaxyColRow: ColRow, starColRow: ColRow): boolean {
        for (var i = 0; i < mainObject.colonies.length; i++) {
            if (mainObject.colonies[i] == null) continue;
            if (mainObject.colonies[i].galaxyColRow.col == galaxyColRow.col
                && mainObject.colonies[i].galaxyColRow.row == galaxyColRow.row
                && mainObject.colonies[i].colRow.col == starColRow.col
                && mainObject.colonies[i].colRow.row == starColRow.row) return true;               
        }
        return false;
    }

    export function findColonyByCoordinates(galaxyColRow : ColRow, starColRow : ColRow) : Colony {
        for (var i = 0; i < mainObject.colonies.length; i++) {
            if (mainObject.colonies[i] == null) continue;
            if (mainObject.colonies[i].galaxyColRow.col == galaxyColRow.col
                && mainObject.colonies[i].galaxyColRow.row == galaxyColRow.row
                && mainObject.colonies[i].starColRow.col == starColRow.col
                && mainObject.colonies[i].starColRow.row == starColRow.row) return mainObject.colonies[i];
        }
        return null;
    }

    export function showColonyList() {

        //create data to show
        var filteredArray: Colony[] = [];
        for (var i = 0; i < mainObject.colonies.length; i++) {
            if (mainObject.colonies[i] == null) continue;
            if (mainObject.colonies[i].owner != mainObject.user.id) continue;
            filteredArray.push(mainObject.colonies[i]);
        }

        //create main Panel and add header + content
        var windowHandle = ElementGenerator.MainPanel();
        windowHandle.setHeader(i18n.label(134));
        var panelBody = $('.relPopupBody', windowHandle.element);
        windowHandle.createTable(panelBody, filteredArray, createTableHeader, createTableLine, null, 0, null, 10, false);  
        windowHandle.SetBottom();
    }



    function createTableHeader(): JQuery {

        var tableRow = $('<tr/>');
        var th = ElementGenerator.headerElement;

        //tableRow.append(th(null, 10, true)); //empty 
        tableRow.append(th(null, 30, true)); //image
        tableRow.append(th(null, 30, true)); //image
        tableRow.append(th(442, 40)); //ID
        tableRow.append(th(443, 224)); //Name

        var Assembly = th(278, 150);
        Assembly.css("text-align","center");
        tableRow.append(Assembly); //Montage
        
        //tableRow.append(th(156, 180,true)); //Bevölkerung
        //tableRow.append(th(null, 10)); //empty 

        tableRow.append(ElementGenerator.headerClassElement("IconPopulation", 644));          //Arbeiter verbleibend
        tableRow.append(ElementGenerator.headerClassElement("IconColony", 410));         //Wohnraum

        return tableRow;
    }

    function createTableLine(_caller: ElementGenerator.WindowManager, colony: Colony): JQuery {
        var tableRow = $('<tr/>');

        //var tableDataFirst = $('<td/>', { "class" : "firstchild" });
        //tableRow.append(tableDataFirst);


        var starPath = mainObject.imageObjects[colony.parentArea.typeId].texture.src;

        var tableDataStarGif = $('<td/>', { style: "background-image:url(" + starPath + ");width:34px;height:30px;background-repeat:no-repeat;background-size: contain;" });
        tableDataStarGif.click((e : JQueryEventObject) => {
            e.preventDefault();
            DrawInterface.switchToArea(colony.parentArea.parentArea); 

           
            mainInterface.scrollToPosition(colony.parentArea.colRow.col, colony.parentArea.colRow.row);
            _caller.remove();
        });
        tableRow.append(tableDataStarGif);
        
        var planetPath = mainObject.imageObjects[colony.planetObjectId].texture.src;
        var tableDataPlanetGif = $('<td/>', { style: "background-image:url(" + planetPath + ");width:34px;height:30px;background-repeat:no-repeat;background-size: contain;" });

        //var tableDataPlanetGif = $('<td/>', { style: "background-image:url(images/51.png);width:34px;height:30px;background-repeat:no-repeat;background-size: contain;" });
        tableDataPlanetGif.click((e: JQueryEventObject) => { e.preventDefault(); colony.openSystemMap(); _caller.remove(); });
        tableRow.append(tableDataPlanetGif);
 
        var tableDataId = $('<td/>', { text: colony.id.toString() });
        tableRow.append(tableDataId);

        var tableDataName = $('<td/>', { text: colony.name });
        tableRow.append(tableDataName);                

        //Assembly 
        //var tableDataConstruction = $('<td/>', { text: (colony.goods[7] || 0).toString() });
        var tableDataConstruction = $('<td/>');
        var LeftTextStr = "";
        var AssemblyRemaining = colony.goods[7] || 0;
        var RightTextStr = AssemblyRemaining.toString() + "/" + colony.constructionMax;
        var Progress = Math.floor(( AssemblyRemaining / colony.constructionMax) * 100);
        var InfluenceBar2 = mainInterface.createTextBar(LeftTextStr, RightTextStr, Progress);
        tableDataConstruction.append(InfluenceBar2);
        tableRow.append(tableDataConstruction);   

        //Population
        var tableDataPop = $('<td/>', { text: (colony.populationPoints + colony.populationConsumation).toString() });
        tableRow.append(tableDataPop);   



        var tableDataHousing = $('<td/>', { text: colony.populationPoints.toString() + '/' + colony.housing.toFixed(0) });
        tableRow.append(tableDataHousing);   
        //var tableDataPop = $('<td/>', { "class": "ColonyStatisticsIcon" });
        //var tableRowPopulationIconDiv = $('<div/>', { "class": "Population" });
        //tableDataPop.append(tableRowPopulationIconDiv);
        //tableRow.append(tableDataPop);   



       // var tableDataRead = $('<td/>', { "class" : "lastchild" });
        //tableRow.append(tableDataRead);

        tableRow.click((e: JQueryEventObject) => { colony.selectAndCenter(); _caller.remove(); });
        return tableRow;
    }    

}