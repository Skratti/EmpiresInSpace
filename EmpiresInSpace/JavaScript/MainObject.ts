


class MainObject {

    influenceRings: BaseDataModule.InfluenceRing[] = [];
    goods: BaseDataModule.Good[] = []; //all possible goods
    buildings: BaseDataModule.Building[] = []; //all possible buildings

    surfaceTiles: BaseDataModule.SurfaceTile[] = []; //all possible surface tiles
    surfaceTileBuildings: number[][] = []; // two dimensional id array surface tile - building -> sets which building may be built on a tile
    buildingCosts = [];
    buildingProduction = [];
    imageObjects: ImageCache.ImageObject[] = [];       // array-index is the object type id
    objectOnMaps: BaseDataModule.ObjectOnMap[] = [];    //type of an object: star, eartlike planet, waterworld. Does link to image-Ids
    planetTypes: BaseDataModule.PlanetType[] = [];

    user = new PlayerData.Player(-1);



    ships: Ships.Ship[] = []; //ship id as array index for the object

    colonies: ColonyModule.Colony[] = [];
    coloniesById: ColonyModule.Colony[] = [];
    //users = []; //list of all known users

    relationTypes: BaseDataModule.RelationType[] = [];


    allMessagesById: MessageModule.Message[] = []; //an array of all user-messages.
    messageTo = 0; //a number representating how many messages were read. opening Message-Dialog sets this to 50, paging back in time in the messageList increses this nuber by 50 each time...
    messageHighestTo = 0; // the highest reachedMessageTo-Value. Can't exceed messageCount. Is used to determine if the database is again queried
    messageHighestId = 0; //the latest message read.

    messageCount = 0; // the amount of all messages the user has in its inbox

    //gameState:
    selectedObject: SpaceObject;

    currentShip: Ships.Ship = null;
    selectedBuilding: number = null;
    buildingActivityMode = false; // if set to true, clicking on a building on the planet surface will activate, deactivate it.

    currentColony: ColonyModule.Colony = null;
    currentArea: AreaSpecifications = null; //reference to the areaData of the current view
    currentSurfaceField: SurfaceField = null; //needed when a building script is loaded (asynchron), so that the script can then detect from which field it was called (currently used in scout.ts)

    //objecs containing the panel-methods
    //diplomacy: DiplomacyModule.Diplomacy;

    //labels: Labels; //needed for setLanguages

    keymap: Keymap; //keymap for user input



    //scriptsAdmin: ScriptAdministrator;

    constructor() {
        //this.diplomacy = new DiplomacyModule.Diplomacy();
        this.keymap = new Keymap();
        //this.labels = new Labels();

        //static data are rules that are universal and are not changed from one version of the game to another.
        // types of Relations are static, while Researchs are game-dependant
        this.relationTypes[0] = new BaseDataModule.RelationType(0);
        this.relationTypes[0].backGroundColor = 'red'; //war
        this.relationTypes[0].backgroundColorClass = 'contactStateWarBgColor'; //war
        this.relationTypes[0].backgroundSymbolClass = 'War'; //war
        this.relationTypes[0].nameLabel = 176;
        this.relationTypes[0].descriptionLabel = 812;     //Enemy ships are attacked and major colonies can be plundered and conquered

        // this.relationTypes[0].borderColor = ' style = "border:thin solid red"';
        this.relationTypes[0].borderColorStyle = 'thin solid red';


        this.relationTypes[1] = new BaseDataModule.RelationType(0);
        this.relationTypes[1].backGroundColor = 'red'; //hostile
        this.relationTypes[1].backgroundColorClass = 'contactStateWarBgColor'; //war
        this.relationTypes[1].borderColorStyle = 'thin solid red';
        this.relationTypes[1].backgroundSymbolClass = 'Hostile'; //war
        this.relationTypes[1].nameLabel = 768;
        this.relationTypes[1].descriptionLabel = 813;    //, N'Enemy ships are attacked and minor colonies can be conquered', N'', 7)

        this.relationTypes[2] = new BaseDataModule.RelationType(1);
        this.relationTypes[2].backGroundColor = 'yellow';  //peace
        this.relationTypes[2].borderColorStyle = 'thin solid yellow';
        this.relationTypes[2].backgroundSymbolClass = 'Neutral'; //war
        this.relationTypes[2].nameLabel = 436;
        this.relationTypes[2].descriptionLabel = 436;

        //814, N'Allows the crossing of borders', N'', 7)

        this.relationTypes[3] = new BaseDataModule.RelationType(2);
        this.relationTypes[3].backGroundColor = '#6AFB92'; //trade
        this.relationTypes[3].borderColorStyle = 'thin solid blue';
        this.relationTypes[3].backgroundSymbolClass = 'Trade'; //war
        this.relationTypes[3].nameLabel = 177;
        this.relationTypes[3].descriptionLabel = 815;     //, N'Trade offers may be restricted to be only visible and accepted by partners having a trade treaty', N'', 7)

        this.relationTypes[4] = new BaseDataModule.RelationType(3);
        this.relationTypes[4].backGroundColor = 'lightblue'; //Pact
        this.relationTypes[4].borderColorStyle = 'thin solid blue';
        this.relationTypes[4].backgroundSymbolClass = 'Pact'; //war
        this.relationTypes[4].nameLabel = 441;
        this.relationTypes[4].descriptionLabel = 816;    //, N'Ships will defend each other', N'', 7)

        this.relationTypes[5] = new BaseDataModule.RelationType(4);
        this.relationTypes[5].backGroundColor = '#4AA02C'; //alliance
        this.relationTypes[5].borderColorStyle = 'thin solid purple';
        this.relationTypes[5].backgroundSymbolClass = 'Allied'; //Green
        this.relationTypes[5].nameLabel = 462;
        this.relationTypes[5].descriptionLabel = 462;

    }

    getGameData() {
        var xhttp = GetXmlHttpObject();
        if (xhttp == null) {
            alert("Your browser does not support AJAX!");

            return;
        }

        var that = this;
        //xmlMap get the map and draw it:
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                //Helpers.Log("star id in Ajax: " + starId);

                var XMLGameData = xhttp.responseXML;
                //console.dirxml(xmlMap)            

                //all Images:
                var newObjectType = new ImageCache.ImageObject(0, 'background.png');
                //var newObjectType = new ImageCache.ImageObject(0, 'background.jpg');
                mainObject.imageObjects[0] = newObjectType;
                ImageCache.getSpaceObjectsFromXML(XMLGameData);

                //Influence
                var XMLobjects = XMLGameData.getElementsByTagName("InfluenceRings");
                var length = XMLobjects.length;
                for (var i = 0; i < length; i++) {
                    that.influenceAdd(XMLobjects[i]);
                }

                //Goods
                var XMLobjects = XMLGameData.getElementsByTagName("good");
                var length = XMLobjects.length;
                for (var i = 0; i < length; i++) {
                    that.createUpdateGoodElement(XMLobjects[i]);
                }
                mainInterface.addQuickMessage(length + ' goods added', 3000);

                //Helpers.Log(length + " goods added");

                //Buildings
                var XMLbuildings = XMLGameData.getElementsByTagName("building");
                var length = XMLbuildings.length;
                for (var i = 0; i < length; i++) {
                    that.createUpdateBuildingElement(XMLbuildings[i]);
                }
                mainInterface.addQuickMessage(length + ' buildings added', 3000);
                //Helpers.Log(length + " buildings added");

                //Research
                //var XMLresearchs = XMLGameData.getElementsByTagName("Researches");
                BaseDataModule.getResearchFromXML(XMLGameData);
                BaseDataModule.getResearchGainFromXML(XMLGameData);

                BaseDataModule.getSpecializationGroupFromXML(XMLGameData);

                //SurfaceTiles
                var XMLsurfaceTile = XMLGameData.getElementsByTagName("surfaceTile");
                length = XMLsurfaceTile.length;
                //Helpers.Log('l: ' + length);

                for (var i = 0; i < length; i++) {
                    that.createUpdateSurfaceTileElement(XMLsurfaceTile[i]);
                }

                //Helpers.Log(length + " surfaceTiles added");

                //surfaceTileBuildings
                var XMLbuildOption = XMLGameData.getElementsByTagName("buildOption");
                length = XMLbuildOption.length;
                //Helpers.Log('l: ' + length);

                for (var i = 0; i < length; i++) {
                    that.createUpdateSurfaceTileBuilding(XMLbuildOption[i]);
                }
                //Helpers.Log(length + " surfaceTileBuildings added");

                //ShipHulls:
                BaseDataModule.getShipHullsFromXML(XMLGameData);
                BaseDataModule.getShipHullsImagesFromXML(XMLGameData);

                BaseDataModule.getModulesFromXML(XMLGameData);
                BaseDataModule.getRelationsFromXML(XMLGameData);

                //ObjectsOnMaps and objectsImages
                BaseDataModule.getObjectOnMapXML(XMLGameData);

                BaseDataModule.getPlanetTypesXML(XMLGameData);

                onLoadWorker.gameDataLoaded = true;
                onLoadWorker.endStartup();
                //Helpers.Log("GetGameData() Done");

                onLoadWorker.progress = onLoadWorker.progress + 20;
                $('#loadingProgressbar').attr('value', onLoadWorker.progress);
            }
        }

        xhttp.open("GET", "Server/mainObject.aspx?action=getGameData", true);
        xhttp.send("");
    }


    fieldScannedBy(_colRow: ColRow): SpaceObject {
        for (var i = 0; i < mainObject.ships.length; i++) {
            if (mainObject.ships[i] == null) continue;
            if (mainObject.ships[i].owner != mainObject.user.id) continue;
            if (Math.abs(mainObject.ships[i].galaxyColRow.col - _colRow.col) <= mainObject.ships[i].scanRange
                && Math.abs(mainObject.ships[i].galaxyColRow.row - _colRow.row) <= mainObject.ships[i].scanRange)
                return mainObject.ships[i]
        }

        for (var i = 0; i < mainObject.colonies.length; i++) {
            if (mainObject.colonies[i] == null) continue;
            if (mainObject.colonies[i].owner != mainObject.user.id) continue;
            if (Math.abs(mainObject.colonies[i].galaxyColRow.col - _colRow.col) <= mainObject.colonies[i].scanRange
                && Math.abs(mainObject.colonies[i].galaxyColRow.row - _colRow.row) <= mainObject.colonies[i].scanRange)
                return mainObject.colonies[i]
        }


        return null;

    }

    //#region Ships

    shipFind(shipId) {
        return this.ships[mainObject.parseInt(shipId)];
    }

    shipExists(shipId) {
        if (this.ships[mainObject.parseInt(shipId)] != null)
            return true;
        else
            return false;
    }

    shipUpdate(shipXML, checkForNewUser = false) {
        var shipXMLId = shipXML.getElementsByTagName("shipId")[0].childNodes[0].nodeValue

        if (this.shipExists(shipXMLId)) // if ship exists, update it.
            this.shipFind(shipXMLId).update(shipXML, checkForNewUser);
        else // if ships does not yet exists, add it
            this.addShip(shipXML, checkForNewUser);
    }

    //called during newTurn (serverEvents.ts) 
    initShips(startup?: boolean) {
        //gets a list of all known ships with a synchron get command  
        var xhttp = GetXmlHttpObject();
        if (xhttp == null) {
            alert("Your browser does not support AJAX!");
            return;
        }

        xhttp.open("GET", "Server/initShips.aspx", false);
        xhttp.send("");
        var xmlShips = xhttp.responseXML;

        //console.dirxml(xmlShips);

        this.getShipsFromXML(xmlShips);

        //onLoadWorker.shipDataLoaded = true;
        //if (startup != null) onLoadWorker.endStartup();

        /*
        var xmlObj = xmlShips.getElementsByTagName("ship");
        var length = xmlObj.length;

        for (var i = 0; i < length; i++)
        {
            this.addShip(xmlObj[i]);
        }
        */
    }

    getShipsFromXML(xmlShips: Document, message = false) {
        var xmlObj = xmlShips.getElementsByTagName("ship");
        var length = xmlObj.length;

        for (var i = 0; i < length; i++) {
            //this.addShip(xmlObj[i]);
            this.shipUpdate(xmlObj[i]);
        }
        if (message) {
            mainInterface.addQuickMessage(length + ' known ships added', 3000);
        }
        Helpers.Log(length + " ships added");
    }

    addShip(XMLobject, checkForNewUser = false) {
        //console.dirxml(XMLobject);
        var id = parseInt(XMLobject.getElementsByTagName("shipId")[0].childNodes[0].nodeValue);
        var newShip = new Ships.Ship(id);
        newShip.typeId = 400;        //typeId references objecttTypes (imageObject)
        newShip.updateArea(XMLobject);

        //add to ship array
        this.ships[mainObject.parseInt(id)] = newShip;

        //get all ship Data out of the XMLobject
        newShip.update(XMLobject, checkForNewUser);



        //add to galaxyMap for drawing the ship
        //galaxyMap.findCreateTile(newShip.colRow).ships.push(newShip);

        //add scan Range 
        if (newShip.owner == mainObject.user.id) newShip.addScanrange();
    }
    //#endregion


    //#region Goods
    goodExists(id) {
        if (this.goods[mainObject.parseInt(id)] != null)
            return true;
        else
            return false;
    }

    findGood(id: number): BaseDataModule.Good {
        return this.goods[mainObject.parseInt(id)];
    }

    findUser(id: number): PlayerData.User {
        return this.user.id == id ? mainObject.user : mainObject.user.otherUserFind(id);
    }

    influenceAdd(XMLobject) {
        var Influence = XMLobject.getElementsByTagName("Influence")[0].childNodes[0].nodeValue;
        var Ring = XMLobject.getElementsByTagName("Ring")[0].childNodes[0].nodeValue;
        var InfluenceRing = new BaseDataModule.InfluenceRing(parseInt(Influence), parseInt(Ring));
        //add to Building array
        this.influenceRings.push(InfluenceRing);
        //Helpers.Log(Ring + ' ' + Influence);
    }


    goodAdd(XMLobject) {
        var id = XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        var newGood = new BaseDataModule.Good(id);

        //add to Building array
        this.goods[mainObject.parseInt(id)] = newGood;

        //get all Building Data out of the XMLbuilding
        newGood.update(XMLobject);
    }

    createUpdateGoodElement(XMLobject) {
        var objectXMLId = XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue

        if (this.goodExists(objectXMLId)) // if ship exists, update it.
            this.goods[objectXMLId].update(XMLobject);
        else // if it does not yet exists, add it
            this.goodAdd(XMLobject);
    }
    //#endregion


    //#region Buildings
    buildingsExists(id) {
        if (this.buildings[mainObject.parseInt(id)] != null)
            return true;
        else
            return false;
    }

    buildingAdd(XMLbuilding) {
        var id = parseInt(XMLbuilding.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        var newBuilding = new BaseDataModule.Building(id);

        //add to Building array
        this.buildings[mainObject.parseInt(id)] = newBuilding;

        //get all Building Data out of the XMLbuilding
        newBuilding.update(XMLbuilding);
    }

    createUpdateBuildingElement(XMLbuilding) {
        var buildingXMLId = XMLbuilding.getElementsByTagName("id")[0].childNodes[0].nodeValue

        if (this.buildingsExists(buildingXMLId)) // if ship exists, update it.
            this.buildings[buildingXMLId].update(XMLbuilding);
        else // if ships does not yet exists, add it
            this.buildingAdd(XMLbuilding);
    }
    //#endregion




    //#region SurfaceTiles

    surfaceTileExists(id) {
        if (this.surfaceTiles[mainObject.parseInt(id)] != null)
            return true;
        else
            return false;
    }

    surfaceTileAdd(XMLsurfaceTile) {
        var id = XMLsurfaceTile.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        var newSurfaceTile = new BaseDataModule.SurfaceTile(id);

        //add to SurfaceTile array
        this.surfaceTiles[mainObject.parseInt(id)] = newSurfaceTile;

        //get all SurfaceTile Data out of the XMLsurfaceTile
        newSurfaceTile.update(XMLsurfaceTile);
    }

    createUpdateSurfaceTileElement(XMLsurfaceTile) {
        var XMLsurfaceTileId = XMLsurfaceTile.getElementsByTagName("id")[0].childNodes[0].nodeValue

        if (this.surfaceTileExists(XMLsurfaceTileId)) // if surface tile exists, update it.
            this.surfaceTiles[XMLsurfaceTileId].update(XMLsurfaceTile);
        else // if ships does not yet exists, add it
            this.surfaceTileAdd(XMLsurfaceTile);
    }
    //#endregion


    //#region surfaceTileBuilding
    SurfaceTileBuildingTileIdExists(tileId) {
        if (this.surfaceTileBuildings[mainObject.parseInt(tileId)] != null)
            return true;
        else
            return false;
    }

    SurfaceTileBuildingTileIdBuildingExists(tileId, buildingId) {
        if (this.surfaceTileBuildings[mainObject.parseInt(tileId)][buildingId] != null)
            return true;
        else
            return false;
    }

    createUpdateSurfaceTileBuilding(XMLsurfaceTile) {
        var XMLsurfaceTileId = XMLsurfaceTile.getElementsByTagName("objectId")[0].childNodes[0].nodeValue
        var XMLsurfaceBuildingId = XMLsurfaceTile.getElementsByTagName("buildingId")[0].childNodes[0].nodeValue

        if (!this.SurfaceTileBuildingTileIdExists(XMLsurfaceTileId))
            this.surfaceTileBuildings[mainObject.parseInt(XMLsurfaceTileId)] = []

        if (!this.SurfaceTileBuildingTileIdBuildingExists(XMLsurfaceTileId, XMLsurfaceBuildingId))
            this.surfaceTileBuildings[mainObject.parseInt(XMLsurfaceTileId)][XMLsurfaceBuildingId] = 1;
    }
    //#endregion




    //mixed methods:

    buildingDeSelect() {
        this.selectedBuilding = null;
        var panels = document.getElementById("panel-ul-buildings");
        var lis = panels.getElementsByTagName("li");
        $(".selected").removeClass("selected");
        /*
        for (var i = 0; i < lis.length; i++) {
            lis[i].setAttribute('class', '');
        }*/
        mainObject.currentColony.refreshMainScreenStatistics();
        mainInterface.drawAll();
    }

    buildingSelected(e) {
        mainObject.buildingActivityMode = false;
        if (!e) var e = <any>window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();

        var li = $(e.currentTarget);

        if (li.children().hasClass("buildingDisabled")) return;


        var buildingId = parseInt(li.data("id"));
        //Helpers.Log("buildingSelected: buildingId = " + buildingId);


        if (this.selectedBuilding != null)
            if (this.selectedBuilding != buildingId) {
                var panels = document.getElementById("panel-ul-buildings");
                var lis = panels.getElementsByTagName("li");

                $(".selected").removeClass("selected");
                /*
                for (var i = 0; i < lis.length; i++) {
                    lis[i].setAttribute('class', '');
                }
                */
                li.addClass('selected');
                //e.currentTarget.setAttribute('class', 'selected');
                this.selectedBuilding = buildingId;
                mainInterface.drawAll();
                mainObject.currentColony.refreshMainScreenStatistics();
            }
            else {
                //var liElement = document.getElementById('buildingsPL' + buildingId);

                this.buildingDeSelect();

            }
        else {
            this.selectedBuilding = buildingId;
            li.addClass('selected');
            //e.currentTarget.setAttribute('class', 'selected');
            mainInterface.drawAll();
            mainObject.currentColony.refreshMainScreenStatistics();
        }
        mainInterface.refreshQuickInfoGoods();
        Helpers.Log('buildingSelected: ' + this.selectedBuilding);
    }

    selectShip(ship: Ships.Ship) {
        mainObject.selectedObject = ship;
        mainObject.currentShip = ship;
        mainObject.currentColony = null;

        PanelController.showInfoPanel(PanelController.PanelChoice.Ship);
        Ships.UserInterface.refreshMainScreenStatistics(ship);


        TransferModule.enableTransferButton(ship); //transfer         
        mainObject.currentShip.setShipRelatedButtons();         //colonize

        //Quests
        for (var i = 0; i < QuestModule.inspectShipQuests.length; i++) {
            QuestModule.inspectShipQuests[i](ship, i);
        }
    }

    SelectNextFleetStartId(id: number, endindex: number): boolean {
        for (var i = id; i < endindex; i++) {
            if (!Ships.Fleets[i]) continue;
            if (Ships.Fleets[i].starMoves <= 0) continue;
            if (Ships.Fleets[i].Sentry) continue;
            if (!Ships.Fleets[i].FleetShips[0]) continue;
            Ships.Fleets[i].FleetShips[0].selectAndCenter();
            return true;
        }
    }


    SelectNextShipStartId(id: number, endindex: number): boolean {
        for (var i = id; i < endindex; i++) {
            if (!this.ships[i]) continue;
            if (this.ships[i].owner != this.user.id) continue;
            if (this.ships[i].Fleet) continue;
            if (!this.ships[i].starMoves) continue;
            if (this.ships[i].Sentry) continue;

            this.ships[i].selectAndCenter();
            return true;
        }

    }

    SelectNextShip() {
        if (!mainObject.currentShip) {

            if (this.SelectNextFleetStartId(0, Ships.Fleets.length)) return;

            if (this.SelectNextShipStartId(0, this.ships.length)) return;
        } else {

            if (mainObject.currentShip.Fleet) {
                //remaining fleets
                if (this.SelectNextFleetStartId(mainObject.currentShip.Fleet.FleetId + 1, Ships.Fleets.length)) return;

                //all ships
                if (this.SelectNextShipStartId(0, this.ships.length)) return;

                //all Fleets before the current one
                if (this.SelectNextFleetStartId(0, mainObject.currentShip.Fleet.FleetId)) return;
            }
            else {

                //remaining ships:
                if (this.SelectNextShipStartId(mainObject.currentShip.id + 1, this.ships.length)) return;

                //all Fleets:
                if (this.SelectNextFleetStartId(0, Ships.Fleets.length)) return;

                //all ships before the current one
                if (this.SelectNextShipStartId(0, mainObject.currentShip.id)) return;
            }
        }
    }


    deselectObject() {
        transferPanel.CloseTransfer();
        FogOfWarModule.fog.save(true);
        mainObject.selectedObject = null;
        mainObject.currentShip = null;
        mainObject.currentColony = null;
        //PanelController.showHideInfoPanel(false);
        PanelController.showInfoPanel(PanelController.PanelChoice.Canvas);

        document.getElementById('rotate').style.display = 'none'; //colonize
        document.getElementById('toolTransfer').style.display = 'none'; //transfer
        document.getElementById('toolTrade').style.display = 'none';   //trade  
        document.getElementById('demolish').style.display = 'none';   //trade  
        document.getElementById('createSpaceStation').style.display = 'none';   //create space station   
        document.getElementById('addTranscendence').style.display = 'none';   //add to Transcendence constuct
        document.getElementById('attackTarget').style.display = 'none';
        document.getElementById('design').style.display = 'none';
        document.getElementById('sentry').style.display = 'none';
        document.getElementById('continue').style.display = 'none';
    }

    deselectShip() {
        transferPanel.CloseTransfer();
        mainObject.selectedObject = null;
        mainObject.currentShip = null;
        //PanelController.showHideInfoPanel(false);
        PanelController.showInfoPanel(PanelController.PanelChoice.Canvas);

        document.getElementById('rotate').style.display = 'none'; //colonize
        document.getElementById('toolTransfer').style.display = 'none'; //transfer
        document.getElementById('toolTrade').style.display = 'none';   //trade  
        document.getElementById('createSpaceStation').style.display = 'none';   //create space station   
        document.getElementById('addTranscendence').style.display = 'none';   //add to Transcendence constuct
        document.getElementById('attackTarget').style.display = 'none';
        document.getElementById('design').style.display = 'none';
        document.getElementById('sentry').style.display = 'none';
        document.getElementById('continue').style.display = 'none';

    }


    initStandardKeymap() {
        this.keymap.install(document.getElementsByTagName('body')[0]);

        function centerCurrentShip() { if (mainObject.currentShip != null) mainObject.currentShip.selectAndCenter(); };
        this.keymap.bind("o", centerCurrentShip);
        this.keymap.bind("X", MouseScrollEvent.extZoomIn);
        this.keymap.bind("Z", MouseScrollEvent.extZoomOut);
        this.keymap.bind("R", mainObject.user.setRaster);
        this.keymap.bind("C", mainObject.user.setCoordinates);
        this.keymap.bind("A", mainObject.user.setColonyNames);
        this.keymap.bind("S", mainObject.user.setSystemNames);
        //this.keymap.bind("I", mainObject.user.setResourceInfo);
        this.keymap.bind("B", mainObject.user.SetBordersDisplay);



        //this.keymap.bind("H", mainInterface.scrollToPosition(mainObject.user.homePosition.x, mainObject.user.homePosition.y) );
        this.keymap.bind("H", mainInterface.scrollToHomePosition);

        function MoveDownLeft() { if (mainObject.currentShip != null) mainObject.currentShip.moveShip({ col: -1, row: 1 }); };
        this.keymap.bind("1", MoveDownLeft);

        function MoveDown() { if (mainObject.currentShip != null) mainObject.currentShip.moveShip({ col: 0, row: 1 }); };
        this.keymap.bind("2", MoveDown);
        this.keymap.bind("Down", MoveDown);

        function MoveDownRight() { if (mainObject.currentShip != null) mainObject.currentShip.moveShip({ col: 1, row: 1 }); };
        this.keymap.bind("3", MoveDownRight);

        function MoveLeft() { if (mainObject.currentShip != null) mainObject.currentShip.moveShip({ col: -1, row: 0 }); };
        this.keymap.bind("4", MoveLeft);
        this.keymap.bind("Left", MoveLeft);

        function MoveRight() { if (mainObject.currentShip != null) mainObject.currentShip.moveShip({ col: 1, row: 0 }); };
        this.keymap.bind("6", MoveRight);
        this.keymap.bind("Right", MoveRight);

        function MoveUpLeft() { if (mainObject.currentShip != null) mainObject.currentShip.moveShip({ col: -1, row: -1 }); };
        this.keymap.bind("7", MoveUpLeft);

        //equals SQL-direction 2
        function MoveUp() { if (mainObject.currentShip != null) mainObject.currentShip.moveShip({ col: 0, row: -1 }); };
        this.keymap.bind("8", MoveUp);
        this.keymap.bind("Up", MoveUp);

        function MoveUpRight() { if (mainObject.currentShip != null) mainObject.currentShip.moveShip({ col: 1, row: -1 }); };
        this.keymap.bind("9", MoveUpRight);

        function NextShip() { console.log("Space"); mainObject.SelectNextShip(); };
        this.keymap.bind("spacebar", NextShip);

        function ShipInactive() {
            console.log("d");
            if (mainObject.currentShip) {
                if (mainObject.currentShip.Fleet) {
                    mainObject.currentShip.Fleet.Active = false;
                }
                mainObject.currentShip.Active = false;
                mainObject.SelectNextShip();
            }
        };
        this.keymap.bind("d", Ships.ShipInactive);


        function centerOnShip() { if (mainObject.currentShip != null) mainInterface.scrollToPosition(mainObject.currentShip.colRow.col, mainObject.currentShip.colRow.row); };
        this.keymap.bind("5", centerOnShip);


        function MapLevelUp() {
            if (galaxyMap != null && currentMap.correspondingArea.parentArea != null) {
                DrawInterface.switchToArea(currentMap.correspondingArea.parentArea);
            };
        };
        this.keymap.bind("Y", MapLevelUp);
    }

    //just to remove the tsc-error
    parseInt(value: any) {
        return parseInt(value, 10);
    }

}




