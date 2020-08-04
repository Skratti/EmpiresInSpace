

interface ColRow {
    col: number;
    row: number;
}

module TilemapModule
{
    // only needed for the galaxymap. Contains coordinates that are seen be the user. Counts up for each user-Object (ShipModule.Ship, Colony) that sees one coordinate
    export class Scanmap {
        scanmap: number[][] = [[], []];
   
        scanTileExist(colRow) {
            if (this.scanmap[mainObject.parseInt(colRow.col)] != null && this.scanmap[parseInt(colRow.col,10)][parseInt(colRow.row,10)] != null) {
                return true;
            }
            else {
                return false;
            }
        }

        countUp(colRow: ColRow) {
            //Helpers.Log('Add ' + colRow.col + ' / ' + colRow.row );
            if (!this.scanTileExist(colRow)) {
                if (this.scanmap[mainObject.parseInt(colRow.col)] == null) {
                    this.scanmap[mainObject.parseInt(colRow.col)] = [];
                }
                this.scanmap[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)] = 1;
            }
            else
                this.scanmap[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)] += 1;
        }

        countDown(colRow: ColRow) {
            //Helpers.Log('Remove ' + colRow.col + ' / ' + colRow.row);
            if (!this.scanTileExist(colRow)) {
                Helpers.Log(colRow.col + '/' + colRow.row + ' DOES NOT EXIST! scanned by ' + currentValue);
                return;
            }
            var currentValue = this.scanmap[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)];
            //Helpers.Log(colRow.col + '/' + colRow.row + ' scanned by ' + currentValue);
            if (currentValue < 2) {
                this.scanmap[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)] -= 1;
                //this.map[mainObject.parseInt(colRow.col)].splice(colRow.row, 1);
                delete this.scanmap[mainObject.parseInt(colRow.col)][colRow.row];
                //if (this.map[mainObject.parseInt(colRow.col)].length < 1) this.map.splice(colRow.col, 1);
                if (this.scanmap[mainObject.parseInt(colRow.col)].length < 1) delete this.scanmap[colRow.col];
                return;
            }

            this.scanmap[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)] -= 1;
        }
    }

    //Tilemaps contain drawing - relevant data
    //there can be multiple Instances of the Tilemap. One will always be drawn on the canvas - a reference to that is saved in var "currentMap"
    export class Tilemap {
    

        map : Tile[][]= [[],[]];
      


        // GridSize
        gridsize =
        {
            cols: 100,
            rows: 100
        }

        //position to which is scrolled
        scroll =
        {
            x: 0,
            y: 0
        }

        //level is the current value -> it is really silly that more than "level" is in the class. ToDo: Move the other stuff out into the TilemapModule Namespace
        zoomLevels =
        {
            level: 1,
            NORMAL: 1,
            FAR: 0.50,
            CLOSE: 2,
            CLOSER: 4
        }
        //standard tileSize for drawing
        tileSize = 30;   

        allowCoordinatesView = false;

        //if shipMovement is drawn
        //moveShipStartColRow = null;
        //moveShipEndColRow = null;

        MouseOverField: ColRow = { row: 0, col: 0 };
        MouseMoveStartTime: number;        

        correspondingArea: AreaSpecifications;
        //correspondingArea = null;
        constructor(public _correspondingArea: AreaSpecifications) {
             this.correspondingArea = _correspondingArea;
        }    

       
        tileClick(colRow:ColRow)
        {
            mainObject.deselectShip();
           
            var tile = this.map[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)];
            if (tile == null) return;

            //switch to starsystem or colony if possible
            if (this.checkObjectClick(tile)) return;


            //check if a ship can be selected
            if (tile.ships != null && tile.ships.length != 0 && (mainObject.currentShip == null || mainObject.currentShip.id != tile.ships[0].id))
            {
                //try to find a ship of the player
                for (var i = 0 ; i < tile.ships.length; i++) {
                    if (tile.ships[i].owner == mainObject.user.id) {                    
                        mainObject.selectShip(tile.ships[i]);
                        mainInterface.drawAll();
                        return;
                    }           
                }
        
                mainObject.selectShip(tile.ships[0]);
                
                mainInterface.drawAll();
                return;
            }
           
            //check if a colony of an other player can be selected

            //just show a clean user interface
            PanelController.showInfoPanel(PanelController.PanelChoice.Canvas);

           
        }

        //overwritten by the various instances--  checks clicks versus non-ShipModule.Ships (planets, wormholes and so on)
        // returns true if a selectable item was found
        checkObjectClick(tile : Tile) : boolean
        {            
            return false;
        }

        tileExist(colRow)
        {

            if (this.map[mainObject.parseInt(colRow.col)] != null && this.map[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)] != null)
            {
                //Helpers.Log('tileExist: ' + colRow.col + '/' + colRow.row);
                return true;
            }
            else
            {
                //Helpers.Log('tileNotExist: ' + colRow.col + '/' + colRow.row);
                return false;
            }
        }    

        findTile(colRow) {
            if (!this.tileExist(colRow)) return null;
            return this.map[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)];
        }

    
        createTile(colRow: ColRow) : Tile
        {
            if (this.map[mainObject.parseInt(colRow.col)] == null)
            {
                this.map[mainObject.parseInt(colRow.col)] = [];
            }        
            var newTile = new Tile(colRow.col, colRow.row);   
            this.map[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)] = newTile;
            return newTile;
        }



        findCreateTile(colRow: ColRow): Tile
        {

            var tile = this.findTile(colRow);

            if (!tile) {
                tile = this.createTile(colRow);
            }
            return tile;
        }   
    }

    //contains all stars -> equals to a galaxy -> ToDo : Should be renamed
    export class StarMap extends Tilemap {
    
        map: GalaxyTile[][] = [[], []];

        constructor(public _correspondingArea: AreaSpecifications) {
            super(_correspondingArea);
            this.allowCoordinatesView = true;
        }

        createTile(colRow: ColRow): GalaxyTile{
            if (this.map[mainObject.parseInt(colRow.col)] == null) {
                this.map[mainObject.parseInt(colRow.col)] = [];
            }
            var newTile = new GalaxyTile(colRow.col, colRow.row);
            this.map[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)] = newTile;
            return newTile;
        }

        checkObjectClick(tile: GalaxyTile) : boolean
        {  
            if (tile.astronomicalObject !== null && tile.astronomicalObject.typeId < 5000) {
                tile.astronomicalObject.loadAndSwitchThisMap();
                return true;
            }
            return false;
        }
    }


    export class SolarSystemMap extends Tilemap {    

        map: SystemTile[][] = [[], []];

        createTile(colRow: ColRow): SystemTile{
            if (this.map[mainObject.parseInt(colRow.col)] == null) {
                this.map[mainObject.parseInt(colRow.col)] = [];
            }
            var newTile = new SystemTile(colRow.col, colRow.row, this._correspondingArea);
            this.map[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)] = newTile;
            return newTile;
        }

        checkObjectClick(tile: SystemTile) : boolean
        {
            //check if colony is present in this tile
            //Helpers.Log("SolarSystemMap.prototype.checkObjectClick"); 
            if (tile.astronomicalObject != null && tile.astronomicalObject.colony != null && tile.astronomicalObject.isMainColony())
            {
                DrawInterface.clickOnColony(tile.astronomicalObject.colony);
                return true;                
            }
            return false;
        }
    }    

    export class PlanetMap extends Tilemap {   

        map: PlanetTile[][] = [[], []];

        correspondingArea: PlanetData;

        constructor(public _correspondingArea: AreaSpecifications) {
            super(_correspondingArea);
            this.zoomLevels.level = this.zoomLevels.CLOSER; 
            this.tileSize = mainInterface.standardTileSize * this.zoomLevels.level;           
        }

        createTile(colRow: ColRow): PlanetTile{
            if (this.map[mainObject.parseInt(colRow.col)] == null) {
                this.map[mainObject.parseInt(colRow.col)] = [];
            }
            var newTile = new PlanetTile(colRow.col, colRow.row);
            this.map[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)] = newTile;
            return newTile;
        }

        //does not need to check versus ships
        tileClick(colRow)
        {
            var surfaceField = <SurfaceField> this.map[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)].astronomicalObject;
            //if (surfaceField.surfaceBuildingId != null && surfaceField.surfaceBuildingId > 0)

            if (surfaceField.building != null && mainObject.selectedBuilding != null && mainObject.selectedBuilding > 0) return;



            if (surfaceField.building != null) {
                if (mainObject.buildingActivityMode) {
                    Helpers.Log('Gebäude angeklickt: ');
                    surfaceField.building.changeActivity();

                    mainObject.currentColony.calcColonyRessources();
                    mainObject.currentColony.refreshMainScreenStatistics();
                    
                    mainInterface.refreshQuickInfoGoods();
                    //update goods-List and BuildingsList:            
                    BaseDataModule.buildingList();
                }
                else
                {
                    mainObject.currentSurfaceField = surfaceField;
                    mainObject.buildings[surfaceField.building.buildingId].openBuildingPanel(surfaceField.building);                    
                }
                return;                
            }

            if (mainObject.selectedBuilding != null && mainObject.selectedBuilding > 0)
            {
                Helpers.Log('build something');
                //var buildingObjectId = null;
                if (mainObject.buildings[mainObject.selectedBuilding] == null) return;

                //all buildings that are allowed on this tile
                var buildingAllowedArray = mainObject.surfaceTileBuildings[mainObject.parseInt(surfaceField.surfaceFieldType)];
                if (buildingAllowedArray != null && buildingAllowedArray[mainObject.selectedBuilding] == null) return;

                //buildingObjectId = mainObject.buildings[mainObject.selectedBuilding].buildingObjectId;
                //var AjaxSettings = new $.j
                document.getElementById('loader').style.display = 'block';
                
                

                $.ajax("Server/Buildings.aspx", {
                    type: "GET",
                    data: {
                        "colonyId": this.correspondingArea.colony.id,
                        "tileNr": surfaceField.Id,
                        "buildingId": mainObject.selectedBuilding,
                        "action": "build"
                    }
                })
                    .done((msg) => { checkBuildResult(msg, surfaceField); DrawInterface.ScreenUpdate = true;})
                    .fail(function () { Helpers.Log('error during building construction...'); document.getElementById('loader').style.display = 'none'; DrawInterface.ScreenUpdate = true;})
                    .always(function () { document.getElementById('loader').style.display = 'none'; DrawInterface.ScreenUpdate = true;});
                
            }

            Helpers.Log('PlanetMap.prototype.tileClick() - do nothing');
        }
     
    }//end class PlanetMap

    export interface ColonyArea {
        Id: number;
        AreaOffset: ColRow;
        BackGroundOffset: ColRow;
        BackGroundSize: number;
        PlanetArea: PlanetData;
    }

    export class ColonyMap extends Tilemap {
        
        //inherited fields:
        map: PlanetTile[][] = [[], []];
        correspondingArea: PlanetData; //The main-planet, having a reference to the colony on it

        correspondingAreas: ColonyArea[]; //all planets of this ColonyMap - needed for : id, draw-coordinates, background image,  surfaceFields



        constructor(public _planetArea: AreaSpecifications) {
            super(_planetArea);
            this.zoomLevels.level = this.zoomLevels.NORMAL;
            this.tileSize = mainInterface.standardTileSize * this.zoomLevels.level;
            this.correspondingAreas = [];
            /*
            this.scroll.x = 33;
            this.scroll.y = 33;
            */
        }

        IsPositionFree(PlanetPosition: ColRow): boolean {
            for (var i = 0; i < this.correspondingAreas.length; i++) {
                if (this.correspondingAreas[i] == null) continue;

                if ( this.correspondingAreas[i].AreaOffset.col == PlanetPosition.col
                  && this.correspondingAreas[i].AreaOffset.row == PlanetPosition.row) {
                    return false;
                }
            }

            return true;
        }


        //Todo: this is a rather ugly method to find a free place. The direction where the free place should be, should be used
        FindFreePositionOnTilemap(Xoffset: number, Yoffset: number): ColRow {
            var Distance = Math.max(Math.abs(Xoffset), Math.abs(Yoffset));

            //ring : distance-Ring around the center
            var ring = 1;
            if (Distance < 4) ring = 1;
            else if (Distance < 11) ring = 2;
            else ring = Math.ceil(Distance / 5);

            var X = 34;
            var Y = 34;

            if (Xoffset < 0) X = X - 2 - (ring * 6);
            if (Xoffset > 0) X = X + 3 + (ring * 6);

            if (Yoffset < 0) Y = Y - 2 - (ring * 6);
            if (Yoffset > 0) Y = Y + 3 + (ring * 6);

            var NewPosition = { col: X, row: Y };
            if (this.IsPositionFree(NewPosition)) return NewPosition;

            //try to find a free place near the current place
            //X axis determined the distance, keep x and change Y a bit
            if (Math.abs(Xoffset) > Math.abs(Yoffset)) {
                if (Yoffset > 0) {
                    NewPosition = { col: X, row: Y - 6 };
                    if (this.IsPositionFree(NewPosition)) return NewPosition;
                } else {
                    NewPosition = { col: X, row: Y + 6 };
                    if (this.IsPositionFree(NewPosition)) return NewPosition;
                }

                //no position found: increase/decrease X
                if (Xoffset < 0) {
                    return this.FindFreePositionOnTilemap(Xoffset - 5, Yoffset);
                }
                else {
                    return this.FindFreePositionOnTilemap(Xoffset + 5, Yoffset);
                }
            } else {
                //Y axis determined the distance, keep Y and change X a bit
                if (Xoffset > 0) {
                    NewPosition = { col: X - 6, row: Y  };
                    if (this.IsPositionFree(NewPosition)) return NewPosition;
                } else {
                    NewPosition = { col: X + 6, row: Y  };
                    if (this.IsPositionFree(NewPosition)) return NewPosition;
                }

                //no position found: increase/decrease X
                if (Yoffset < 0) {
                    return this.FindFreePositionOnTilemap(Xoffset, Yoffset - 5);
                }
                else {
                    return this.FindFreePositionOnTilemap(Xoffset , Yoffset + 5);
                }
            }
        }

        //Each Colony or subColony has its own are
        makeColonyArea(planetArea: PlanetData): ColonyArea {
            //the position that the tiles of this area use as origin
            var AreaOffset = { col: 30, row: 30 }; //this are the coordinates for the center colony

            //if this is not the main colony, choose a new position for this sub colony
            //if (planetArea.typeId != 24 && planetArea.typeId != 25 && planetArea.typeId != 26) {
            if (planetArea.colRow.col != planetArea.colony.colRow.col 
                || planetArea.colRow.row != planetArea.colony.colRow.row ) {                

                var CenterColRow = this._correspondingArea.colRow;
                var CurrentColRow = planetArea.colRow;

                var ColChange = CurrentColRow.col - CenterColRow.col; // negative: the new planet/moon is left of the center
                var RowChange = CurrentColRow.row - CenterColRow.row; // negative: the new planet/moon is top of the center

                AreaOffset = this.FindFreePositionOnTilemap(ColChange, RowChange); 
            }
            /*
            if (planetArea.typeId == 41) {
                AreaOffset.col = 3;
                AreaOffset.row = 3;
            }

            if (planetArea.typeId == 40) {
                AreaOffset.col = 13;
                AreaOffset.row = 3;
            }
            */
            //var backgroundOffsetNumber = 3; //the radius increment of the background compared to the tiles.
            var BackGroundSize = planetArea.BackgroundDrawSize; //habitable planet
            var BackGroundOffset = { col: AreaOffset.col - planetArea.TilestartingAt, row: AreaOffset.row - planetArea.TilestartingAt };

            var ColonyArea : ColonyArea = { Id: planetArea.Id, AreaOffset: AreaOffset, PlanetArea: planetArea, BackGroundSize: BackGroundSize, BackGroundOffset: BackGroundOffset};

            return ColonyArea;
        }

        findCreateTile(_colRow: ColRow): Tile {
            var ColRow = { col: _colRow.col + 0, row: _colRow.row + 0 };
            var tile = this.findTile(ColRow);

            if (!tile) {
                tile = this.createTile(ColRow);
            }
            return tile;
        }

        findCreatePlanetTile(_colRow: ColRow, planetArea: PlanetData): Tile {
            var ColonyArea = this.findArea(planetArea.Id);
            if (ColonyArea == null) {
                ColonyArea = this.makeColonyArea(planetArea);
                this.correspondingAreas.push(ColonyArea);
            }

            var ColRow = { col: _colRow.col + ColonyArea.AreaOffset.col, row: _colRow.row + ColonyArea.AreaOffset.row };
            var tile = this.findTile(ColRow);

            if (!tile) {
                tile = this.createTile(ColRow);
            }
            return tile;
        }

        findArea(planetId: number): ColonyArea {

            for (var i = 0; i < this.correspondingAreas.length; i++) {
                if (this.correspondingAreas[i] == null) continue;
                if (this.correspondingAreas[i].Id == planetId) return this.correspondingAreas[i];
            }

            return null;

        }

        tileExist(colRow) {

            if (this.map[mainObject.parseInt(colRow.col)] != null && this.map[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)] != null) {
                //Helpers.Log('tileExist: ' + colRow.col + '/' + colRow.row);
                return true;
            }
            else {
                //Helpers.Log('tileNotExist: ' + colRow.col + '/' + colRow.row);
                return false;
            }
        }

        findTile(colRow) {
            if (!this.tileExist(colRow)) return null;
            return this.map[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)];
        }

        createTile(_colRow: ColRow): PlanetTile {
            
            var ColRow = _colRow;
            if (this.map[mainObject.parseInt(ColRow.col)] == null) {
                this.map[mainObject.parseInt(ColRow.col)] = [];
            }
            var newTile = new PlanetTile(ColRow.col, ColRow.row);
            this.map[mainObject.parseInt(ColRow.col)][mainObject.parseInt(ColRow.row)] = newTile;
            return newTile;
        }

        
        tileClick(colRow) {
            var surfaceField = <SurfaceField> this.map[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)].astronomicalObject;
            //if (surfaceField.surfaceBuildingId != null && surfaceField.surfaceBuildingId > 0)

            if (surfaceField.building != null && mainObject.selectedBuilding != null && mainObject.selectedBuilding > 0) return;



            if (surfaceField.building != null) {
                if (mainObject.buildingActivityMode) {
                    Helpers.Log('Gebäude angeklickt: ');
                    surfaceField.building.changeActivity();

                    mainObject.currentColony.calcColonyRessources();
                    mainObject.currentColony.refreshMainScreenStatistics();

                    mainInterface.refreshQuickInfoGoods();
                    //update goods-List and BuildingsList:            
                    BaseDataModule.buildingList();
                }
                else {
                    mainObject.currentSurfaceField = surfaceField;
                    mainObject.buildings[surfaceField.building.buildingId].openBuildingPanel(surfaceField.building);
                }
                return;
            }

            if (mainObject.selectedBuilding != null && mainObject.selectedBuilding > 0) {
                Helpers.Log('build something');
                //var buildingObjectId = null;
                if (mainObject.buildings[mainObject.selectedBuilding] == null) return;

                //all buildings that are allowed on this tile
                var buildingAllowedArray = mainObject.surfaceTileBuildings[mainObject.parseInt(surfaceField.surfaceFieldType)];
                if (buildingAllowedArray != null && buildingAllowedArray[mainObject.selectedBuilding] == null) return;

                //buildingObjectId = mainObject.buildings[mainObject.selectedBuilding].buildingObjectId;
                //var AjaxSettings = new $.j
                document.getElementById('loader').style.display = 'block';



                $.ajax("Server/Buildings.aspx", {
                    type: "GET",
                    data: {
                        "colonyId": this.correspondingArea.colony.id,
                        "tileNr": surfaceField.Id,
                        "buildingId": mainObject.selectedBuilding,
                        "action": "build"
                    }
                })
                    .done((msg) => { this.checkBuildResult(msg, surfaceField); })
                    .fail(function () { Helpers.Log('error during building construction...'); document.getElementById('loader').style.display = 'none'; })
                    .always(function () { document.getElementById('loader').style.display = 'none'; DrawInterface.ScreenUpdate = true;});

            }

            Helpers.Log('PlanetMap.prototype.tileClick() - do nothing');
        }


        checkBuildResult(resultXML: Element, surfaceField: SurfaceField) {
            document.getElementById('loader').style.display = 'none';
            Helpers.Log("checkBuildResult");


            if (resultXML == null) {
                Helpers.Log('tileClick build Building - no ajax response ');
                return;
            }

            var result = parseInt(resultXML.getElementsByTagName("result")[0].childNodes[0].nodeValue);
            if (result != 1) {
                Helpers.Log('tileClick build Building - ERROR - ');
                return;
            }

            //update goods : remove costs from colony:
            for (var i = 0; i < mainObject.buildings[mainObject.selectedBuilding].costs.length; i++) {
                if (mainObject.buildings[mainObject.selectedBuilding].costs[i] == null) continue;

                if (mainObject.currentColony.goods[i] != null) {
                    mainObject.currentColony.goods[i] = mainObject.currentColony.goods[i] - mainObject.buildings[mainObject.selectedBuilding].costs[i];
                }
                else {
                    mainObject.currentColony.goods[i] = -mainObject.buildings[mainObject.selectedBuilding].costs[i];
                }
            }

            CommModule.getNodesFromXML(resultXML);
            ColonyModule.getColonyBuildingFromXML(resultXML);

            //the next three 
            //ColonyModule.checkColonyXML(resultXML);
            mainObject.getShipsFromXML(<any>resultXML);
            ColonyModule.checkColonyXML(<any>resultXML);

            //add Building
            /*
            surfaceField.surfaceBuildingId = mainObject.selectedBuilding;
            surfaceField.buildingObjectId = buildingObjectId;
            surfaceField.buildingName = mainObject.buildings[mainObject.selectedBuilding].name ;
            */
            //remove Building from SurfaceTile




            //fetch the surfaceField object and call update, which will set a reference to the new building:
            var xmlTile = resultXML.getElementsByTagName("surfaceTile");
            var length = xmlTile.length;
            for (var i = 0; i < length; i++) {
                var PlanetId = parseInt(xmlTile[i].getElementsByTagName("SurfacePlanetId")[0].childNodes[0].nodeValue);
                var Area = this.findArea(PlanetId);
                if (Area != null) Area.PlanetArea.createUpdateSurfaceFieldElement(xmlTile[i]);

                //mainObject.currentColony.planetArea.createUpdateSurfaceFieldElement(xmlTile[i]);
            }

            // if the building that was built needed some special ressource or is only allowed once, the variable mainObject.selectedBuilding has to be set to null
            if (mainObject.buildings[mainObject.selectedBuilding].visibilityNeedsGoods && !mainObject.buildings[mainObject.selectedBuilding].checkGoodsOnColony())
                mainObject.selectedBuilding = null;
            if (mainObject.buildings[mainObject.selectedBuilding].oncePerColony) mainObject.selectedBuilding = null;

            mainObject.currentColony.calcColonyRessources();

            //mainObject.buildingDeSelect();
            //mainInterface.drawAll();


            mainObject.currentColony.refreshMainScreenStatistics();

            //Quests            
            for (var i = 0; i < QuestModule.buildQuests.length; i++) {
                QuestModule.buildQuests[i](i, surfaceField);
            }

            //update goods-List and BuildingsList:            
            BaseDataModule.buildingList();
            mainInterface.refreshQuickInfoGoods();

            return;
        }


    }


    function checkBuildResult(resultXML: Element, surfaceField: SurfaceField) {
        document.getElementById('loader').style.display = 'none';
        Helpers.Log("checkBuildResult");
        

        if (resultXML == null) {
            Helpers.Log('tileClick build Building - no ajax response ');
            return;
        }

        var result = parseInt(resultXML.getElementsByTagName("result")[0].childNodes[0].nodeValue);
        if (result != 1) {
            Helpers.Log('tileClick build Building - ERROR - ');
            return;
        }

        //update goods : remove costs from colony:
        for (var i = 0; i < mainObject.buildings[mainObject.selectedBuilding].costs.length; i++) {
            if (mainObject.buildings[mainObject.selectedBuilding].costs[i] == null) continue;

            if (mainObject.currentColony.goods[i] != null) {
                mainObject.currentColony.goods[i] = mainObject.currentColony.goods[i] - mainObject.buildings[mainObject.selectedBuilding].costs[i];
            }
            else {
                mainObject.currentColony.goods[i] = -mainObject.buildings[mainObject.selectedBuilding].costs[i];
            }
        }

        CommModule.getNodesFromXML(resultXML);
        ColonyModule.getColonyBuildingFromXML(resultXML);

        //the next three 
        //ColonyModule.checkColonyXML(resultXML);
        mainObject.getShipsFromXML(<any>resultXML);
        ColonyModule.checkColonyXML(<any>resultXML);
 
        //add Building
        /*
        surfaceField.surfaceBuildingId = mainObject.selectedBuilding;
        surfaceField.buildingObjectId = buildingObjectId;
        surfaceField.buildingName = mainObject.buildings[mainObject.selectedBuilding].name ;
        */
        //remove Building from SurfaceTile


        
        
        
        var xmlTile = resultXML.getElementsByTagName("surfaceTile");
        var length = xmlTile.length;
        for (var i = 0; i < length; i++) {

            mainObject.currentColony.planetArea.createUpdateSurfaceFieldElement(xmlTile[i]);
        }
        
        // if the building that was built needed some special ressource or is only allowed once, the variable mainObject.selectedBuilding has to be set to null
        if (mainObject.buildings[mainObject.selectedBuilding].visibilityNeedsGoods && !mainObject.buildings[mainObject.selectedBuilding].checkGoodsOnColony())
            mainObject.selectedBuilding = null;              
        if (mainObject.buildings[mainObject.selectedBuilding].oncePerColony) mainObject.selectedBuilding = null;

        mainObject.currentColony.calcColonyRessources();

        //mainObject.buildingDeSelect();
        //mainInterface.drawAll();


        mainObject.currentColony.refreshMainScreenStatistics();

        //Quests            
        for (var i = 0; i < QuestModule.buildQuests.length; i++) {
            QuestModule.buildQuests[i](i, surfaceField);
        }

        //update goods-List and BuildingsList:            
        BaseDataModule.buildingList();
        mainInterface.refreshQuickInfoGoods();

        return;
    }

}