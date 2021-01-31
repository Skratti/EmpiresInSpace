// AreaSpecifications hold Data for the various Areas (Galaxy, Systems, Planets)
//var stars = [];  //inserted at index starId
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//var AreaSpecifications = function (starId)
//could also extend Tile - has to be tested 
var AreaSpecifications = /** @class */ (function (_super) {
    __extends(AreaSpecifications, _super);
    function AreaSpecifications(Id) {
        var _this = 
        //super(0, 0);
        _super.call(this) || this;
        _this.Id = Id;
        _this.hasSubElements = false;
        _this.name = 'Galaxy';
        //Id = 1;
        _this.size = 10;
        _this.elementsInArea = []; //indexed by objectId //an array of objects in the system  - only stars, planets, nebulars and so on -> These Objects may themselves be a map!
        _this.shipsInArea = []; // NOT SORTED BY ID... contains an array of ships. Needed to find out if ships are present in a System...
        _this.parentArea = null;
        _this.gameState = 1;
        _this.winningTranscendenceConstruct = 0; //the transcendence Construct that has won.
        _this.IsDemo = false;
        _this.DemoUser = null;
        //stars/planets and so on need draw-informations
        _this.drawsize = 1.0; //factor to apply to image size
        _this.fieldSize = 1; //how many fields are covered? 2 = 2x2
        _this.offset = 0; //offset to the upper left corner. normally (fieldSize - drawsize) / 2
        _this.TurnNumber = 1;
        _this.ressourceId = 0;
        _this.ColonyMap = null;
        _this.tilemap = new TilemapModule.Tilemap(_this);
        return _this;
    }
    AreaSpecifications.prototype.GetImageId = function () {
        if (this.ImageId != null)
            return this.ImageId;
        if (mainObject.objectOnMaps[this.typeId] != null) {
            this.ImageId = mainObject.objectOnMaps[this.typeId].getImageId(this.Id);
        }
        if (this.ImageId != null)
            return this.ImageId;
        else
            return this.typeId;
    };
    AreaSpecifications.prototype.GetImage = function () {
        if (this.Image != null)
            return this.Image;
        if (mainObject.objectOnMaps[this.typeId] != null) {
            this.Image = mainObject.objectOnMaps[this.typeId].getImage(this.Id);
        }
        //Helpers.Log("caching " + this.Id);
        return this.Image;
    };
    AreaSpecifications.prototype.removeShipFromArea = function (ship) {
        for (var i = 0; i < this.shipsInArea.length; i++) {
            if (this.shipsInArea[i].id == ship.id) {
                this.shipsInArea.splice(i, 1);
            }
        }
    };
    AreaSpecifications.prototype.refreshScanMap = function () {
        scanMap.scanmap = [];
        for (var i = 0; i < mainObject.ships.length; i++) {
            if (mainObject.ships[i] != null && mainObject.ships[i].owner == mainObject.user.id) {
                mainObject.ships[i].addScanrange();
            }
        }
        if (currentMap.correspondingArea.Id == -1) {
            for (var i = 0; i < mainObject.colonies.length; i++) {
                if (mainObject.colonies[i] != null && mainObject.colonies[i].owner == mainObject.user.id) {
                    mainObject.colonies[i].addGalaxyScanrange();
                }
            }
        }
    };
    AreaSpecifications.prototype.update = function (XMLStar) {
        var X = parseInt(XMLStar.getElementsByTagName("xpos")[0].childNodes[0].nodeValue);
        var Y = parseInt(XMLStar.getElementsByTagName("ypos")[0].childNodes[0].nodeValue);
        var type = parseInt(XMLStar.getElementsByTagName("type")[0].childNodes[0].nodeValue);
        var gif = XMLStar.getElementsByTagName("gif")[0].childNodes[0].nodeValue;
        var starName = XMLStar.getElementsByTagName("name")[0].childNodes[0].nodeValue;
        var size = parseInt(XMLStar.getElementsByTagName("size")[0].childNodes[0].nodeValue);
        var fieldSize = parseInt(XMLStar.getElementsByTagName("fieldSize")[0].childNodes[0].nodeValue, 10);
        var drawSize = parseFloat(XMLStar.getElementsByTagName("drawsize")[0].childNodes[0].nodeValue);
        var colRow = { col: X, row: Y };
        this.name = starName;
        this.typeId = type;
        this.colRow = colRow;
        this.size = size;
        if (size > 1) {
            this.tilemap.gridsize =
                {
                    cols: size,
                    rows: size
                };
        }
        this.fieldSize = fieldSize;
        this.drawsize = drawSize;
        this.offset = (fieldSize - drawSize) / 2.0;
        if (this instanceof StarData) {
            var starBox = StarMapModule.makeBox(mainObject.parseInt(X), mainObject.parseInt(Y));
            StarMapModule.starMap.insertStar(starBox, this.typeId, this.Id);
        }
    };
    AreaSpecifications.prototype.initSubElements = function () {
        var _this = this;
        $.ajax("Server/initStarMap.aspx", {
            "type": "GET",
            "async": false
        }).done(function (msg) {
            _this.getStarsFromXML(msg.responseXML);
        });
    };
    AreaSpecifications.prototype.getStarsFromXML = function (xmlMap) {
        //set grid size:                
        var galMap = xmlMap.getElementsByTagName("GalaxyMap")[0];
        //Helpers.Log(galMap);
        var gridSize = galMap.getElementsByTagName("size")[0].childNodes[0].nodeValue;
        var galaxyName = galMap.getElementsByTagName("galaxyName")[0].childNodes[0].nodeValue;
        var gameState = galMap.getElementsByTagName("gameState")[0].childNodes[0].nodeValue;
        var winningTranscendenceConstruct = galMap.getElementsByTagName("winningTranscendenceConstruct")[0].childNodes[0].nodeValue;
        var turnNumber = galMap.getElementsByTagName("TurnNumber")[0].childNodes[0].nodeValue;
        this.name = galaxyName;
        this.tilemap.gridsize.cols = parseInt(gridSize);
        this.tilemap.gridsize.rows = parseInt(gridSize);
        this.gameState = parseInt(gameState);
        this.winningTranscendenceConstruct = parseInt(winningTranscendenceConstruct);
        this.TurnNumber = parseInt(turnNumber);
        //this.TurnNumber = parseInt(galMap.getElementsByTagName("TurnNumber")[0].childNodes[0].nodeValue);
        console.log("TurnNumber : " + this.TurnNumber.toString());
        if (galMap.getElementsByTagName("isdemo")[0] && galMap.getElementsByTagName("isdemo")[0].childNodes[0].nodeValue == 'true') {
            this.IsDemo = true;
            //Helpers.Log("this.IsDemo = true;");
        }
        else {
            this.IsDemo = false;
            //Helpers.Log("this.IsDemo = false;");
        }
        //console.dirxml(xmlMap)            
        var xmlStars = xmlMap.getElementsByTagName("star");
        var length = xmlStars.length;
        //Helpers.Log('l: ' + length);
        for (var i = 0; i < length; i++) {
            this.addSubElement(xmlStars[i]);
        }
        mainInterface.addQuickMessage(length + ' known stars added', 3000);
        //Helpers.Log(length + " stars and nebula added");
        onLoadWorker.galaxyMapLoaded = true;
        onLoadWorker.progress = onLoadWorker.progress + 10;
        $('#loadingProgressbar').attr('value', onLoadWorker.progress);
        onLoadWorker.endStartup();
        //Helpers.Log("getStarsFromXML() Done");
    };
    AreaSpecifications.prototype.SolarObjectsUpdate = function (XMLSolObj) {
        var solObjId = XMLSolObj.getElementsByTagName("starId")[0].childNodes[0].nodeValue;
        if (this.objectsExists(solObjId)) // if star exists, update it.
            this.elementsInArea[mainObject.parseInt(solObjId)].update(XMLSolObj);
        else // if ships does not yet exists, add it
            this.addSubElement(XMLSolObj);
    };
    AreaSpecifications.prototype.addSubElement = function (XMLSolObj) {
        var objectId = XMLSolObj.getElementsByTagName("starId")[0].childNodes[0].nodeValue;
        var solarObject = new AreaSpecifications(objectId);
        solarObject.update(XMLSolObj);
        solarObject.size = XMLSolObj.getElementsByTagName("size")[0].childNodes[0].nodeValue;
        this.elementsInArea[objectId] = solarObject;
        //solarSystems.solarSystemsById[this.Id].findCreateTile(solarObject.colRow).stars.push(solarObject);
        this.tilemap.findCreateTile(solarObject.colRow).astronomicalObject = solarObject;
        //galaxyMap.findCreateTile(starObject.colRow).stars.push(starObject);
    };
    AreaSpecifications.prototype.objectsExists = function (solObjId) {
        if (this.elementsInArea[mainObject.parseInt(solObjId)] != null)
            return true;
        else
            return false;
    };
    AreaSpecifications.prototype.loadAndSwitchThisMap = function () {
        DrawInterface.ScreenUpdate = true;
        if (this.Id === currentMap.correspondingArea.Id)
            return;
        if (this.hasSubElements == true && (this.elementsInArea == null || this.elementsInArea.length == 0)) {
            this.initSubElements();
        }
        DrawInterface.switchToArea(this);
        //this.switchInterfaceToThisMap();
    };
    AreaSpecifications.prototype.switchInterfaceToThisMap = function () {
        DrawInterface.ScreenUpdate = true;
        PanelController.hideMenus();
        if (!this.ColonyMap)
            mainObject.currentColony = null;
        mainObject.currentArea = this;
        currentMap = this.tilemap;
        if (this.ColonyMap)
            currentMap = this.ColonyMap;
        this.refreshScanMap();
        mainInterface.checkScrollEnabling();
        mainInterface.refreshNavigationBar(this);
        mainInterface.checkMapSizeScroll();
        mainInterface.drawAll();
        //set tilemaps to the right cooridnates:
        if (this.ColonyMap) {
            this.ColonyMap.zoomLevels.level = this.ColonyMap.zoomLevels.CLOSE;
            this.ColonyMap.tileSize = mainInterface.standardTileSize * this.ColonyMap.zoomLevels.level;
            //set coordinates on the starmap as center
            if (galaxyMap.useSolarSystems)
                mainInterface.scrollMapToPosition(this.parentArea.parentArea.tilemap, this.parentArea.colRow.col, this.parentArea.colRow.row);
            //set coordinates of the parent map, so that wehn leaving this area the zoom is centered on the planet:
            if (galaxyMap.useSolarSystems)
                mainInterface.scrollMapToPosition(this.parentArea.tilemap, this.colRow.col, this.colRow.row);
            //set coordinates of the colonyMap
            var currentPlanet = this;
            var area = currentPlanet.ColonyMap.findArea(this.Id);
            if (area != null) {
                mainInterface.scrollMapToPosition(currentPlanet.ColonyMap, area.AreaOffset.col + area.PlanetArea.TilestartingAt, area.AreaOffset.row + area.PlanetArea.TilestartingAt);
                // Helpers.Log("switchInterfaceToThisMap - area found : " + area.AreaOffset.col + area.PlanetArea.TilestartingAt + 6 + ' ' + area.AreaOffset.row + area.PlanetArea.TilestartingAt + 3);
            }
            else {
                mainInterface.scrollMapToPosition(currentPlanet.ColonyMap, 31, 31);
                // Helpers.Log("switchInterfaceToThisMap - area NOT found : 31 31");
            }
            //mainInterface.scrollMapToPosition(this.parentArea.tilemap, this.colRow.col, this.colRow.row);
        }
        if (this instanceof StarData) {
            mainInterface.scrollMapToPosition(this.parentArea.tilemap, this.colRow.col, this.colRow.row);
        }
    };
    AreaSpecifications.prototype.createUpdateSurfaceFieldElement = function (XMLsurfaceField) {
        Helpers.Log("AreaData.createUpdateSurfaceFieldElement was not overloaded");
        throw Error("AreaData.createUpdateSurfaceFieldElement was not overloaded");
    };
    return AreaSpecifications;
}(SpaceObject));
//Galaxymap - single instance - StarData is added in its elementsInArea-Array:
var GalaxyData = /** @class */ (function (_super) {
    __extends(GalaxyData, _super);
    function GalaxyData(Id) {
        var _this = _super.call(this, Id) || this;
        _this.Id = Id;
        _this.elementsInArea = []; // PlanetData is added here
        _this.useSolarSystems = false; //Todo: should be set first when client is started - perhaps using a websocket 
        _this.tilemap = new TilemapModule.StarMap(_this);
        _this.shipsInArea = [];
        return _this;
    }
    GalaxyData.prototype.getStarsFromXML = function (xmlMap) {
        var galMap = xmlMap.getElementsByTagName("GalaxyMap")[0];
        var useSolarSystems = galMap.getElementsByTagName("useSolarSystems")[0].childNodes[0].nodeValue;
        this.useSolarSystems = useSolarSystems == 'true' ? true : false;
        _super.prototype.getStarsFromXML.call(this, xmlMap);
    };
    GalaxyData.prototype.addSubElement = function (XMLSolObj) {
        var objectId = parseInt(XMLSolObj.getElementsByTagName("starId")[0].childNodes[0].nodeValue);
        var solarObject = new StarData(objectId, this);
        solarObject.update(XMLSolObj);
        this.elementsInArea[objectId] = solarObject;
        //solarSystems.solarSystemsById[this.Id].findCreateTile(solarObject.colRow).stars.push(solarObject);
        this.tilemap.findCreateTile(solarObject.colRow).astronomicalObject = solarObject;
        //galaxyMap.findCreateTile(starObject.colRow).stars.push(starObject);
        //check if one of the stars added has a colony - then update that colony
        for (var i = 0; i < mainObject.colonies.length; i++) {
            if (mainObject.colonies[i].galaxyColRow.col == solarObject.colRow.col && mainObject.colonies[i].galaxyColRow.row == solarObject.colRow.row) {
                mainObject.colonies[i].parentArea = solarObject;
            }
        }
    };
    return GalaxyData;
}(AreaSpecifications));
//Element/Star in Galaxymap:
var StarData = /** @class */ (function (_super) {
    __extends(StarData, _super);
    function StarData(Id, parentArea) {
        var _this = _super.call(this, Id) || this;
        _this.Id = Id;
        _this.parentArea = parentArea;
        _this.elementsInArea = []; // PlanetData is added here
        _this.shipsInArea = [];
        _this.hasSubElements = true; //true if solarSystem or colony is present
        _this.size = 100;
        _this.drawSize = 1;
        _this.isColonizable = false;
        _this.colony = null; //reference to the colony object (if one is present)
        _this.BackgroundObjectId = null;
        _this.BackgroundDrawSize = null;
        _this.TilestartingAt = null;
        _this.tilemap = new TilemapModule.SolarSystemMap(_this);
        return _this;
    }
    StarData.prototype.isMainColony = function () {
        return this.colRow.col == this.colony.colRow.col && this.colRow.row == this.colony.colRow.row;
    };
    StarData.prototype.update = function (xmlMap) {
        this.ressourceId = parseInt(xmlMap.getElementsByTagName("ressourceId")[0].childNodes[0].nodeValue, 10);
        _super.prototype.update.call(this, xmlMap);
        this.drawSize = this.typeId == 80 ? 10 : 1;
        var XMLStar = xmlMap;
        var X = XMLStar.getElementsByTagName("colonizable")[0].childNodes[0].nodeValue;
        var colonyId = XMLStar.getElementsByTagName("ColonyId")[0].childNodes.length > 0 && XMLStar.getElementsByTagName("ColonyId")[0].childNodes[0].nodeValue || null;
        if (colonyId != null)
            colonyId = parseInt(colonyId);
        this.isColonizable = X == 1 ? true : false;
        var BackgroundObjectIdS = XMLStar.getElementsByTagName("BackgroundObjectId")[0].childNodes.length > 0 && XMLStar.getElementsByTagName("BackgroundObjectId")[0].childNodes[0].nodeValue || null;
        var BackgroundDrawSizeS = XMLStar.getElementsByTagName("BackgroundDrawSize")[0].childNodes.length > 0 && XMLStar.getElementsByTagName("BackgroundDrawSize")[0].childNodes[0].nodeValue || null;
        var TilestartingAtS = XMLStar.getElementsByTagName("TilestartingAt")[0].childNodes.length > 0 && XMLStar.getElementsByTagName("TilestartingAt")[0].childNodes[0].nodeValue || null;
        if (BackgroundObjectIdS != null)
            this.BackgroundObjectId = parseInt(BackgroundObjectIdS);
        if (BackgroundDrawSizeS != null)
            this.BackgroundDrawSize = parseInt(BackgroundDrawSizeS);
        if (TilestartingAtS != null)
            this.TilestartingAt = parseInt(TilestartingAtS);
        if (colonyId != null && colonyId > -1 && mainObject.coloniesById[colonyId] != null) {
            this.colony = colonyId > -1 ? mainObject.coloniesById[colonyId] : null;
            if (this.colony.ColonyMap != null) {
                this.ColonyMap = this.colony.ColonyMap;
                if (this.isMainColony()) { // this.typeId == 24 || this.typeId == 25 || this.typeId == 26) {
                    this.ColonyMap._correspondingArea = this;
                }
            }
            else {
                var NewMap = new TilemapModule.ColonyMap(this);
                this.ColonyMap = NewMap;
                this.colony.ColonyMap = NewMap;
            }
            this.hasSubElements = true;
            if (this.isMainColony()) { // if (this.typeId == 24 || this.typeId == 25 || this.typeId == 26) {
                mainObject.coloniesById[colonyId].planetArea = this;
            }
            //if (this.colony != null) this.name = this.colony.name;
            //Hack - has to be done better
            if (!this.isMainColony() &&
                (this.typeId == 24 || this.typeId == 25 || this.typeId == 26)) {
                this.BackgroundDrawSize = 9;
                this.TilestartingAt = 1;
            }
        }
        this.tilemap.gridsize =
            {
                cols: 11,
                rows: 8
            };
    };
    //#region SurfaceTiles    
    StarData.prototype.surfaceFieldExists = function (id) {
        if (this.elementsInArea[mainObject.parseInt(id)] != null)
            return true;
        else
            return false;
    };
    StarData.prototype.surfaceFieldAdd = function (XMLsurfaceTile) {
        var id = XMLsurfaceTile.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        var newSurfaceTile = new SurfaceField(id, this);
        //add to SurfaceTile array
        this.elementsInArea[parseInt(id)] = newSurfaceTile;
        //get all SurfaceTile Data out of the XMLsurfaceTile
        newSurfaceTile.update(XMLsurfaceTile);
        //solarSystems.solarSystemsById[this.Id].findCreateTile(solarObject.colRow).stars.push(solarObject);
        this.tilemap.findCreateTile(newSurfaceTile.colRow).astronomicalObject = newSurfaceTile;
        //this.ColonyMap.findCreateTile(newSurfaceTile.colRow).stars = newSurfaceTile;
        this.ColonyMap.findCreatePlanetTile(newSurfaceTile.colRow, this).astronomicalObject = newSurfaceTile;
    };
    StarData.prototype.createUpdateSurfaceFieldElement = function (XMLsurfaceField) {
        var XMLsurfaceFieldId = XMLsurfaceField.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        if (this.surfaceFieldExists(XMLsurfaceFieldId)) // if surface tile exists, update it.
            this.elementsInArea[XMLsurfaceFieldId].update(XMLsurfaceField);
        else // if ships does not yet exists, add it
            this.surfaceFieldAdd(XMLsurfaceField);
    };
    //#endregion
    StarData.prototype.addSubElement = function (XMLSolObj) {
        /* Deprecated: No more SolarSystems
        var objectId = parseInt(XMLSolObj.getElementsByTagName("starId")[0].childNodes[0].nodeValue);
        var solarObject = new PlanetData(objectId,this);
        solarObject.update(XMLSolObj);

        this.elementsInArea[objectId] = solarObject;
        this.tilemap.findCreateTile(solarObject.colRow).astronomicalObject = solarObject;
        */
    };
    StarData.prototype.initColonySubelements = function () {
        var _this = this;
        $.ajax("Server/initStarMap.aspx", {
            "type": "GET",
            "async": false,
            "data": {
                "colonyId": this.colony.id.toString()
            }
        }).done(function (msg) {
            var xmlTiles = msg.getElementsByTagName("surfaceTile");
            for (var j = 0; j < xmlTiles.length; j++) {
                _this.createUpdateSurfaceFieldElement(xmlTiles[j]);
            }
            if (mainInterface != null) {
                mainInterface.drawAll();
            }
        }).always(function (msg) { document.getElementById('loader').style.display = 'none'; DrawInterface.ScreenUpdate = true; });
    };
    StarData.prototype.initSubElements = function () {
        var _this = this;
        document.getElementById('loader').style.display = 'block';
        Helpers.Log("AAAAAAAAAAAAAA", Helpers.LogType.Debug);
        this.initColonySubelements();
        return;
        $.ajax("Server/initStarMap.aspx", {
            "type": "GET",
            "async": false,
            "data": {
                "systemId": this.Id.toString()
            }
        }).done(function (msg) {
            //console.dirxml(xmlMap)            
            var xmlStars = msg.getElementsByTagName("SolarSystemTile");
            var length = xmlStars.length;
            //Helpers.Log('l: ' + length);
            for (var i = 0; i < length; i++) {
                _this.addSubElement(xmlStars[i]);
            }
            if (mainInterface != null)
                mainInterface.drawAll();
        }).always(function (msg) { document.getElementById('loader').style.display = 'none'; DrawInterface.ScreenUpdate = true; });
    };
    StarData.prototype.switchInterfaceToThisMap = function () {
        AreaSpecifications.prototype.switchInterfaceToThisMap.call(this);
        if (this.colony != null) {
            this.colony.onOpenColonyScreen();
            //Quests            
            for (var i = 0; i < QuestModule.inspectSurfaceQuests.length; i++) {
                QuestModule.inspectSurfaceQuests[i](i);
            }
        }
    };
    return StarData;
}(AreaSpecifications));
//Element in SolarSystemMap (planet, sun, asteroids etc):
var PlanetData = /** @class */ (function (_super) {
    __extends(PlanetData, _super);
    function PlanetData(Id, parentArea) {
        var _this = _super.call(this, Id) || this;
        _this.Id = Id;
        _this.parentArea = parentArea;
        _this.elementsInArea = []; //holds SurfaceFields
        _this.shipsInArea = [];
        //parentArea: StarData;
        _this.hasSubElements = false; //true id colony is present
        _this.isColonizable = false;
        _this.size = 11;
        _this.colony = null; //reference to the colony object (if one is present)
        _this.BackgroundObjectId = null;
        _this.BackgroundDrawSize = null;
        _this.TilestartingAt = null;
        _this.tilemap = new TilemapModule.PlanetMap(_this);
        return _this;
    }
    PlanetData.prototype.isMainColony = function () {
        return this.colRow.col == this.colony.colRow.col && this.colRow.row == this.colony.colRow.row;
    };
    PlanetData.prototype.update = function (XMLStar) {
        GalaxyData.prototype.update.call(this, XMLStar); //ToDO: 
        var X = XMLStar.getElementsByTagName("colonizable")[0].childNodes[0].nodeValue;
        var colonyId = XMLStar.getElementsByTagName("ColonyId")[0].childNodes.length > 0 && XMLStar.getElementsByTagName("ColonyId")[0].childNodes[0].nodeValue || null;
        if (colonyId != null)
            colonyId = parseInt(colonyId);
        this.isColonizable = X == 1 ? true : false;
        var BackgroundObjectIdS = XMLStar.getElementsByTagName("BackgroundObjectId")[0].childNodes.length > 0 && XMLStar.getElementsByTagName("BackgroundObjectId")[0].childNodes[0].nodeValue || null;
        var BackgroundDrawSizeS = XMLStar.getElementsByTagName("BackgroundDrawSize")[0].childNodes.length > 0 && XMLStar.getElementsByTagName("BackgroundDrawSize")[0].childNodes[0].nodeValue || null;
        var TilestartingAtS = XMLStar.getElementsByTagName("TilestartingAt")[0].childNodes.length > 0 && XMLStar.getElementsByTagName("TilestartingAt")[0].childNodes[0].nodeValue || null;
        if (BackgroundObjectIdS != null)
            this.BackgroundObjectId = parseInt(BackgroundObjectIdS);
        if (BackgroundDrawSizeS != null)
            this.BackgroundDrawSize = parseInt(BackgroundDrawSizeS);
        if (TilestartingAtS != null)
            this.TilestartingAt = parseInt(TilestartingAtS);
        if (colonyId != null && colonyId > -1 && mainObject.coloniesById[colonyId] != null) {
            this.colony = colonyId > -1 ? mainObject.coloniesById[colonyId] : null;
            if (this.colony.ColonyMap != null) {
                this.ColonyMap = this.colony.ColonyMap;
                if (this.isMainColony()) { // this.typeId == 24 || this.typeId == 25 || this.typeId == 26) {
                    this.ColonyMap._correspondingArea = this;
                }
            }
            else {
                var NewMap = new TilemapModule.ColonyMap(this);
                this.ColonyMap = NewMap;
                this.colony.ColonyMap = NewMap;
            }
            this.hasSubElements = true;
            if (this.isMainColony()) { // if (this.typeId == 24 || this.typeId == 25 || this.typeId == 26) {
                mainObject.coloniesById[colonyId].planetArea = this;
            }
            //if (this.colony != null) this.name = this.colony.name;
            //Hack - has to be done better
            if (!this.isMainColony() &&
                (this.typeId == 24 || this.typeId == 25 || this.typeId == 26)) {
                this.BackgroundDrawSize = 9;
                this.TilestartingAt = 1;
            }
        }
        this.tilemap.gridsize =
            {
                cols: 11,
                rows: 8
            };
    };
    /*
    switchInterfaceToThisMap ()
    {
        AreaSpecifications.prototype.switchInterfaceToThisMap.call(this);
        mainObject.currentPlanet = this;
    }
    */
    PlanetData.prototype.initPlanetSubelements = function () {
        var _this = this;
        $.ajax("Server/initStarMap.aspx", {
            "type": "GET",
            "async": false,
            "data": {
                "planetId": this.Id.toString()
            }
        }).done(function (msg) {
            var xmlTile = msg.getElementsByTagName("surfaceTile");
            var length = xmlTile.length;
            //Helpers.Log('l: ' + length); 
            for (var i = 0; i < length; i++) {
                //that.addSubElement(xmlTile[i]); 
                _this.createUpdateSurfaceFieldElement(xmlTile[i]);
            }
            if (mainInterface != null)
                mainInterface.drawAll();
        }).always(function (msg) { document.getElementById('loader').style.display = 'none'; DrawInterface.ScreenUpdate = true; });
    };
    PlanetData.prototype.initColonySubelements = function () {
        var _this = this;
        $.ajax("Server/initStarMap.aspx", {
            "type": "GET",
            "async": false,
            "data": {
                "colonyId": this.colony.id.toString()
            }
        }).done(function (msg) {
            //Some of the surface fields may belong to other areas (planets) - fetch that area (or create it if needed)
            var Planet = msg.getElementsByTagName("planet");
            for (var i = 0; i < Planet.length; i++) {
                var xmlTiles = Planet[i].getElementsByTagName("surfaceTile");
                var PlanetId = parseInt(Planet[i].getElementsByTagName("Id")[0].childNodes[0].nodeValue);
                if (_this.Id == PlanetId) {
                    for (var j = 0; j < xmlTiles.length; j++) {
                        _this.createUpdateSurfaceFieldElement(xmlTiles[j]);
                    }
                }
                else {
                    //we have to get the PlanetData - Area. Worst case is: we have to first add the PlanetData to it's StarData 
                    var Area = Planet[i].getElementsByTagName("PlanetData")[0];
                    var SolarSystemId = parseInt(Area.getElementsByTagName("systemId")[0].childNodes[0].nodeValue);
                    if (_this.parentArea.elementsInArea[PlanetId] != null) {
                        Helpers.Log('SWITCH to other Planet: - PlanetId ' + PlanetId);
                        for (var j = 0; j < xmlTiles.length; j++) {
                            _this.parentArea.elementsInArea[PlanetId].createUpdateSurfaceFieldElement(xmlTiles[j]);
                        }
                    }
                    else {
                        Helpers.Log('SWITCH to other star: SolarSystemId - PlanetId' + SolarSystemId + ' - ' + PlanetId);
                    }
                }
            }
            if (mainInterface != null) {
                mainInterface.drawAll();
            }
        }).always(function (msg) { document.getElementById('loader').style.display = 'none'; DrawInterface.ScreenUpdate = true; });
    };
    PlanetData.prototype.initSubElements = function () {
        //Helpers.Log("PlanetData.prototype.initSubElements 2 ");
        document.getElementById('loader').style.display = 'block';
        this.initColonySubelements();
    };
    //#region SurfaceTiles    
    PlanetData.prototype.surfaceFieldExists = function (id) {
        if (this.elementsInArea[mainObject.parseInt(id)] != null)
            return true;
        else
            return false;
    };
    PlanetData.prototype.surfaceFieldAdd = function (XMLsurfaceTile) {
        var id = XMLsurfaceTile.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        var newSurfaceTile = new SurfaceField(id, this);
        //add to SurfaceTile array
        this.elementsInArea[parseInt(id)] = newSurfaceTile;
        //get all SurfaceTile Data out of the XMLsurfaceTile
        newSurfaceTile.update(XMLsurfaceTile);
        //solarSystems.solarSystemsById[this.Id].findCreateTile(solarObject.colRow).stars.push(solarObject);
        this.tilemap.findCreateTile(newSurfaceTile.colRow).astronomicalObject = newSurfaceTile;
        //this.ColonyMap.findCreateTile(newSurfaceTile.colRow).stars = newSurfaceTile;
        this.ColonyMap.findCreatePlanetTile(newSurfaceTile.colRow, this).astronomicalObject = newSurfaceTile;
    };
    PlanetData.prototype.createUpdateSurfaceFieldElement = function (XMLsurfaceField) {
        var XMLsurfaceFieldId = XMLsurfaceField.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        if (this.surfaceFieldExists(XMLsurfaceFieldId)) // if surface tile exists, update it.
            this.elementsInArea[XMLsurfaceFieldId].update(XMLsurfaceField);
        else // if ships does not yet exists, add it
            this.surfaceFieldAdd(XMLsurfaceField);
    };
    //#endregion
    PlanetData.prototype.switchInterfaceToThisMap = function () {
        AreaSpecifications.prototype.switchInterfaceToThisMap.call(this);
        if (this.colony != null) {
            this.colony.onOpenColonyScreen();
            //Quests            
            for (var i = 0; i < QuestModule.inspectSurfaceQuests.length; i++) {
                QuestModule.inspectSurfaceQuests[i](i);
            }
        }
    };
    PlanetData.prototype.loadAndSwitchThisMap = function () {
        AreaSpecifications.prototype.loadAndSwitchThisMap.call(this);
    };
    return PlanetData;
}(AreaSpecifications));
//Element on planet (mountain, grassland etc):
var SurfaceField = /** @class */ (function (_super) {
    __extends(SurfaceField, _super);
    //surfaceBuildingId = null;
    //surfaceBuildingActive = 1;
    //surfaceBuildingInConstruction = 0;
    //buildingGif = null;
    //buildingName = null;
    //buildingObjectId = null;
    function SurfaceField(Id, parentArea) {
        var _this = _super.call(this, Id) || this;
        _this.parentArea = parentArea;
        _this.elementsInArea = []; //for late user only
        _this.shipsInArea = [];
        //tilemap = null;
        _this.hasSubElements = false;
        _this.size = 100;
        return _this;
    }
    SurfaceField.prototype.update = function (XMLStar) {
        /*GalaxyData.prototype.update.call(this, XMLStar);

        var surfaceBuildingId = XMLStar.getElementsByTagName("surfaceBuildingId")[0].childNodes[0].nodeValue;
        var buildingGif = XMLStar.getElementsByTagName("buildingGif")[0].childNodes[0].nodeValue;
        var buildingName = XMLStar.getElementsByTagName("buildingName")[0].childNodes[0].nodeValue;
        var buildingObjectId = XMLStar.getElementsByTagName("buildingObjectId")[0].childNodes[0].nodeValue;
        var surfaceFieldId = XMLStar.getElementsByTagName("surfaceFieldId")[0].childNodes[0].nodeValue;
        var surfaceFieldType = XMLStar.getElementsByTagName("fieldType")[0].childNodes[0].nodeValue;

        this.surfaceFieldId = surfaceFieldId;
        this.surfaceFieldType = surfaceFieldType;
        this.surfaceBuildingId = surfaceBuildingId;
        this.buildingGif = buildingGif;
        this.buildingName = buildingName;
        this.buildingObjectId = buildingObjectId;
        */
        GalaxyData.prototype.update.call(this, XMLStar);
        //this.colRow.col += 2;
        //this.colRow.row += 2;
        //var surfaceBuildingId = parseInt(XMLStar.getElementsByTagName("surfaceBuildingId")[0].childNodes[0].nodeValue);        
        var surfaceFieldType = parseInt(XMLStar.getElementsByTagName("fieldType")[0].childNodes[0].nodeValue);
        this.surfaceFieldType = surfaceFieldType;
        //this.surfaceBuildingId = surfaceBuildingId;
        //get building Data, so that these are present during draw()
        /*if (this.building != null) {
            var buildingObjectId = mainObject.buildings[surfaceBuildingId].buildingObjectId;
            this.buildingObjectId = buildingObjectId;
            this.buildingName = i18n.label(mainObject.buildings[surfaceBuildingId].label);
        }
        else {
            this.buildingObjectId = null;
            this.buildingName = null;
        }
        */
        if (this.parentArea.colony != null) {
            if (ColonyModule.colonyBuildings[this.parentArea.colony.id] && ColonyModule.colonyBuildings[this.parentArea.colony.id][this.Id]) {
                this.building = ColonyModule.colonyBuildings[this.parentArea.colony.id][this.Id];
                this.building.surfaceTile = this;
                //Helpers.Log('Col-Building ' + this.Id);
            }
        }
    };
    return SurfaceField;
}(AreaSpecifications));
//# sourceMappingURL=areaData.js.map