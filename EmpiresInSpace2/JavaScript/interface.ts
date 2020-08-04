
//used for drawing the different maps

interface ScreenSize {
    width: number;
    height: number;
}

interface TileWithPositionOnScreen {
    tile: Tile;
    displayPositionX: number;
    displayPositionY: number;
}

//globals
var screenSize: ScreenSize =
{
    width: 0,
    height: 0
}

 
//global helpers
function getSize() : ScreenSize {    
    return {
        width: $(document.getElementsByTagName("canvas")[0]).parent().width(),
        height: $(document.getElementsByTagName("canvas")[0]).parent().height()
    };
}



function getSize2()
{
    var myWidth = 0, myHeight = 0;

    if (typeof (window.innerWidth) == 'number')
    {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight))
    {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight))
    {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    } else
    {
        myWidth = 300;
        myHeight = 300;
    }

    /*
    Helpers.Log('f getSize() returns: ' + myWidth + '/' + myHeight);
    Helpers.Log('$ getSize() returns: ' + 
        $(document.getElementsByTagName("canvas")[0]).parent().width() +
        '/' + $(document.getElementsByTagName("canvas")[0]).parent().height());
    var parent = $(document.getElementsByTagName("canvas")[0]).parent();
    myWidth = parent.width();
    myHeight = parent.height();
    */
    //myWidth = parent.get(0).offsetWidth;
    //myHeight = parent.get(0).offsetHeight;
  
    return { width: myWidth, height: myHeight };
}


module DrawInterface {

    var canvas: HTMLCanvasElement;
    var context: CanvasRenderingContext2D;

    export var FogCanvas: HTMLCanvasElement = document.createElement("canvas");
    export var FogContext: CanvasRenderingContext2D ;


    export var standardTileSize: number = 30;
    var backgroundSize: number = 600;
    export var isScrollXEnabled = true;
    export var isScrollYEnabled = true;
    export var ScreenUpdate = false;
    export var TooltipShown = false;
    var movingShipOffSet: ColRow;
    //var drawLine = 0;

    var CurrentToolTip: ColRow = { row: 0, col: 0 };

    export function setCanvas(_canvas: HTMLCanvasElement) {
        canvas = _canvas;
        context = canvas.getContext('2d');
        FogContext = FogCanvas.getContext('2d');
        
    }

    export function getCanvas(): HTMLCanvasElement {
        return canvas;
    }

    export function initInterface() {
        var temp = getSize();
        screenSize.width = temp.width;
        screenSize.height = temp.height;
    }
    export function pixelToGrid(_x: number, _y: number) {
        //Helpers.Log('pixelToGrid 1 : ' + x + '/' + y);
        //var left = $(".canvasContainer").position().left
        //var x = _x - left;
        //var x = _x;
        //    Helpers.Log('pixelToGrid: ' + x + '/' + y);
        // x,y are pixel coordinates, we want to get grid-coordinates
        var col = _x;
        var row = _y;
       // Helpers.Log('pixelToGrid 2 : ' + col + '/' + row);
        //mat.round gets the nearest Int-Value, but we want to have the lower int value
        col -= (currentMap.tileSize / 2);
        row -= (currentMap.tileSize / 2);
        col = Math.round(col / currentMap.tileSize);
        row = Math.round(row / currentMap.tileSize);
        //Helpers.Log('pixelToGrid 3 : ' + col + '/' + row);
        return { row: row, col: col };
    }
    function pixelToStandardGrid(x: number, y: number) {
        var col = x;
        var row = y;

        col = Math.round(col / standardTileSize);
        row = Math.round(row / standardTileSize);

        return { row: row, col: col };
    }

    var fps = 0;
    var oldtime = +new Date;
    var frame = 0;
    var Threshold = 30;

    export function drawByRequestAnim(time: any) {
        if (ScreenUpdate) {
            ScreenUpdate = false;
            mainInterface.drawAll();  //GameLoop
            
        }
        
        requestAnimationFrame(mainInterface.drawByRequestAnim);

        if (mainObject.user.id == 234) {
            frame++;
            
            if (frame == Threshold) {
                //Helpers.Log(time - oldtime);
                fps = Threshold *  1000 / (time - oldtime);
                oldtime = time;
                frame = 0;            
            }
            showFPS();
        }
    }
    
    function showFPS() {
        context.fillStyle = "White";
        context.font = "normal 16pt Arial";
        context.fillText(fps.toFixed(1) + " fps", 10, 186);
        //Helpers.Log('drawTileCoordinates: ' + text + 'at : ' + displayPositionX + '/' + displayPositionY ) ;
    }    
    
    export function drawAll() {
        draw(0, 0, screenSize.width, screenSize.height);        
    }


    //draw tile. System Tiles may span multiple fields
    //only the first tile of the planet is drawn
    //buildings are also drawn here
    function drawTile(tileToDraw: Tile, displayPositionX: number, displayPositionY: number, x: number, y: number) {
              
        var lowestRelationCode = 20; //paint a border in the color of the lowest relation code (0 = war = red) 10 = own ship = green , 1 = peace

        //for (var starNo = 0; starNo < currentMap.map[x][y].stars.length; starNo++) {
        //Helpers.Log('f draw() -> draw stars');
        //Helpers.Log('draw star in field:  X:' + x + ' - Y:' + y + ' No: ' + starNo);
        //context.drawImage(objectTypes[1].texture, 250, 70);
        //Helpers.Log('draw star in field:  objectTypes[1]: ' + objectTypes[currentMap.map[x][y].stars[starNo].typeId].name);

        //context.drawImage(objectTypes[1].texture, displayPositionX, displayPositionY, currentMap.tileSize, currentMap.tileSize);
        //context.drawImage(objectTypes[1].texture, displayPositionX, displayPositionY);        
        if (mainObject.imageObjects[tileToDraw.astronomicalObject.typeId] == null) return;

        
        //if (mainObject.objectOnMaps[tileToDraw.stars.typeId] == null) return;

        /*
        if (tileToDraw.stars.Id == 7981) {
            Helpers.Log("draw star 7981");
        } */


        //tile is  part of a multitileimage and not the upper left tile, so skip drawing of this part
        if (tileToDraw instanceof SystemTile) {
            var xyz: SystemTile = <SystemTile>tileToDraw;
            if (xyz.astronomicalObject && xyz.astronomicalObject.fieldSize === 0) return;
        }


        //draw planet, asteroid or central sun
        if (tileToDraw instanceof SystemTile) {
            var xyz: SystemTile = <SystemTile>tileToDraw;
            //xyz.stars.drawSize            
            //context.drawImage(mainObject.imageObjects[tileToDraw.stars.typeId].texture, displayPositionX, displayPositionY, currentMap.tileSize * xyz.stars.fieldSize, currentMap.tileSize * xyz.stars.fieldSize);          

            //context.drawImage(mainObject.imageObjects[mainObject.objectOnMaps[tileToDraw.stars.typeId].ObjectImages[0].ImageId].texture, displayPositionX + (currentMap.tileSize * tileToDraw.stars.offset), displayPositionY + (currentMap.tileSize * tileToDraw.stars.offset), currentMap.tileSize * xyz.stars.drawsize, currentMap.tileSize * xyz.stars.drawsize);
            var Image = tileToDraw.astronomicalObject.GetImage();
            var planetImage = Image.ImageId;
            var PlanetOffset = (1 - Image.Drawsize) / 2;
            var PlanetOffset = (currentMap.tileSize * PlanetOffset);
            if (tileToDraw.astronomicalObject.typeId > 45) PlanetOffset = -currentMap.tileSize / 2;

            //context.drawImage(mainObject.imageObjects[tileToDraw.stars.typeId].texture, displayPositionX + (currentMap.tileSize * tileToDraw.stars.offset), displayPositionY + (currentMap.tileSize * tileToDraw.stars.offset), currentMap.tileSize * xyz.stars.drawsize, currentMap.tileSize * xyz.stars.drawsize);
            //context.drawImage(mainObject.imageObjects[planetImage].texture, displayPositionX + (currentMap.tileSize * tileToDraw.stars.offset), displayPositionY + (currentMap.tileSize * tileToDraw.stars.offset), currentMap.tileSize * xyz.stars.drawsize, currentMap.tileSize * xyz.stars.drawsize);
            context.drawImage(mainObject.imageObjects[Image.ImageId].texture,
                displayPositionX + PlanetOffset,
                displayPositionY + PlanetOffset,
                currentMap.tileSize * Image.Drawsize,
                currentMap.tileSize * Image.Drawsize);
        }
        
        //draw image of the star
        if (tileToDraw instanceof GalaxyTile)
        {     
            var tileToDraw2: GalaxyTile = <GalaxyTile>tileToDraw;
            var imageToDraw = mainObject.imageObjects[tileToDraw.astronomicalObject.typeId];

            if (imageToDraw.tileSheetCount == 1) {
                //draw a star or anomaly
                //context.drawImage(mainObject.imageObjects[tileToDraw.stars.typeId].texture, displayPositionX, displayPositionY, currentMap.tileSize * tileToDraw2.stars.drawSize, currentMap.tileSize * tileToDraw2.stars.drawSize);
                var drawSizeFactor = (tileToDraw2.astronomicalObject.Id % 50) * 0.01;  //between 0 and 0.5
                var starOffset = drawSizeFactor / 2;    //up to 0.25
                drawSizeFactor = drawSizeFactor + 1;
                starOffset = (currentMap.tileSize * starOffset);
                //Helpers.Log(drawSizeFactor);
                context.drawImage(mainObject.imageObjects[tileToDraw.astronomicalObject.typeId].texture, displayPositionX - starOffset, displayPositionY - starOffset, currentMap.tileSize * drawSizeFactor, currentMap.tileSize * drawSizeFactor);                           
            }
        }

        //Draw starname and/or ressource of the star
        if (tileToDraw instanceof GalaxyTile  && tileToDraw.astronomicalObject.typeId < 5000) {
            var systemNameRessource = '';
            if (mainObject.user.systemNames) {
                systemNameRessource = tileToDraw.astronomicalObject.name;
            }

            if (mainObject.user.showRessources) {
                if (mainObject.user.systemNames) {
                    systemNameRessource += ' ';
                }
                systemNameRessource += i18n.label(721 + (<StarData>tileToDraw.astronomicalObject).ressourceId);
            }

            if (systemNameRessource != '') {
                drawString(x, y, systemNameRessource, drawLine);
                drawLine++;
            }
            /*
            var starName = tileToDraw.stars.name;
            starName += ' ' + i18n.label(721 + (<StarData>tileToDraw.stars).ressourceId);
            drawString(x, y, starName, drawLine);
            drawLine++;
            */
        }


        //draw planet tile
        if (tileToDraw instanceof PlanetTile) {            
            var currentPlanetTile = <PlanetTile> tileToDraw;

            //Draw Building or Placeholder
            if (currentPlanetTile.astronomicalObject.building != null) {
                var BuildingOffset = (currentMap.tileSize * 0.1);
                context.drawImage(mainObject.imageObjects[mainObject.buildings[currentPlanetTile.astronomicalObject.building.buildingId].buildingObjectId].texture,
                    displayPositionX + BuildingOffset, displayPositionY + BuildingOffset,
                    currentMap.tileSize * 0.8, currentMap.tileSize * 0.8);
            }
            else {
                //Draw building placeholder border:
                var imageId = 5200 + 70; //Grey border  - O 
                imageId = mainObject.surfaceTiles[currentPlanetTile.astronomicalObject.surfaceFieldType].borderId + 70;

                //Helpers.Log("imageId " + imageId);
                var z = mainObject.imageObjects[imageId].canvasCache;
                context.drawImage(z,
                    displayPositionX, displayPositionY,
                    currentMap.tileSize, currentMap.tileSize);
            }

            //if building is selected to build, grey out fields which are not allowed.
            //also draw the building over the field where the mouse is on
            if (mainObject.selectedBuilding != null && mainObject.selectedBuilding > 0) {
                var fieldAllowedToBuild = false;
                fieldAllowedToBuild = drawBuildingToBuiltGreyOut(displayPositionX, displayPositionY, currentMap.map[x][y].astronomicalObject);

                if (fieldAllowedToBuild && currentPlanetTile.astronomicalObject.building == null && currentMap.MouseOverField.col == x && currentMap.MouseOverField.row == y) {
                    var BuildingOffset = (currentMap.tileSize * 0.1);
                    context.drawImage(mainObject.imageObjects[mainObject.buildings[mainObject.selectedBuilding].buildingObjectId].texture,
                        displayPositionX + BuildingOffset, displayPositionY + BuildingOffset,
                        currentMap.tileSize * 0.8, currentMap.tileSize * 0.8);
                }
            }

            drawBuildingInactivity(displayPositionX, displayPositionY, currentMap.map[x][y].astronomicalObject);
        }

        // draw border around star system if ships or colonies are present in it:
        var ownObjects = 0;
        var enemyObjects = 0;
        if (tileToDraw.astronomicalObject != null && tileToDraw.astronomicalObject.shipsInArea != null && tileToDraw.astronomicalObject.shipsInArea.length > 0) {

            for (var shipNo = 0; shipNo < tileToDraw.astronomicalObject.shipsInArea.length; shipNo++) {
                if (mainObject.currentShip && mainObject.currentShip.id == tileToDraw.astronomicalObject.shipsInArea[shipNo].id) continue;

                if (tileToDraw.astronomicalObject.shipsInArea[shipNo].owner == mainObject.user.id) {
                    ownObjects++;
                    lowestRelationCode = lowestRelationCode < 10 ? lowestRelationCode : 10;
                }
                else {
                    if (tileToDraw.astronomicalObject.shipsInArea[shipNo].owner != 0) {
                        enemyObjects++;
                        var shipRelationCode = 1; //ToDo: get the true relation code
                        if (mainObject.user.otherUserExists(tileToDraw.astronomicalObject.shipsInArea[shipNo].owner))
                            shipRelationCode = mainObject.user.otherUserFind(tileToDraw.astronomicalObject.shipsInArea[shipNo].owner).currentRelation;
                        lowestRelationCode = Math.min(lowestRelationCode, shipRelationCode);
                    }
                }
            }
        }

        //check for tileToDraw instanceof starTile
        for (var colonyCounter = 0; tileToDraw instanceof GalaxyTile && colonyCounter < mainObject.colonies.length; colonyCounter++) {
            if (mainObject.colonies[colonyCounter].galaxyColRow.col == x && mainObject.colonies[colonyCounter].galaxyColRow.row == y) {

                var currentColony: ColonyModule.Colony = mainObject.colonies[colonyCounter];

                if (mainObject.colonies[colonyCounter].owner == mainObject.user.id) {
                    lowestRelationCode = lowestRelationCode < 10 ? lowestRelationCode : 10;
                    ownObjects++;
                }
                else {                   
                    var colonyRelationCode = 1;
                    if (mainObject.user.otherUserExists(mainObject.colonies[colonyCounter].owner))
                        colonyRelationCode = mainObject.user.otherUserFind(mainObject.colonies[colonyCounter].owner).currentRelation;
                    lowestRelationCode = Math.min(lowestRelationCode, colonyRelationCode);
                    enemyObjects++;
                }

                if (mainObject.user.colonyOwners) {

                    if (currentColony.getOwner() != null && drawOwnerString(x, y, currentColony.getOwner().tagFreeName.label(), drawLine, ownersDrawn, currentColony.getOwner().id)) {
                        drawLine++;
                    }
                }

            }
        }
        //check if a colony is present on the systemTile
        if (tileToDraw instanceof SystemTile) {
            if ((<SystemTile> tileToDraw).astronomicalObject.colony != null) {
                var colonyToCheck = (<SystemTile> tileToDraw).astronomicalObject.colony;

                var isMainColony = (<SystemTile> tileToDraw).astronomicalObject.isMainColony();

                if (mainObject.user.colonyNames && isMainColony) {
                    drawString(x, y, colonyToCheck.name, drawLine);
                    drawLine++;
                }

                if (mainObject.user.colonyOwners && isMainColony) {
                    if (colonyToCheck.getOwner() != null && drawOwnerString(x, y, colonyToCheck.getOwner().tagFreeName.label(), drawLine, ownersDrawn, colonyToCheck.getOwner().id)) {
                        drawLine++;
                    }
                }

                if (colonyToCheck.owner == mainObject.user.id) {
                    lowestRelationCode = lowestRelationCode < 10 ? lowestRelationCode : 10;
                    ownObjects++;
                }
                else {
                    var colonyRelationCode = 1; //ToDo: get the true relation code
                    if (mainObject.user.otherUserExists(colonyToCheck.owner))
                        colonyRelationCode = mainObject.user.otherUserFind(colonyToCheck.owner).currentRelation;
                    lowestRelationCode = Math.min(lowestRelationCode, colonyRelationCode);

                    enemyObjects++;
                }
            }
        }
        
        if (lowestRelationCode < 20) {
            drawTileRelationBorder(lowestRelationCode, displayPositionX, displayPositionY);
        }                
    }

    function getOffset(_ship: Ships.Ship): ColRow {
        var currTime = new Date().getTime();
        if (currTime - _ship.lastMovedAt > 200) return { col: 0, row: 0 };
        

        var movingSince = currTime - _ship.lastMovedAt;        
        var movementDuration = 200;
        ScreenUpdate = true;

        if (movingSince < movementDuration) {
            
            var moveDistance = 1 - (movingSince / movementDuration);
            var moveFromX = 0;
            var moveFromY = 0;

            if (_ship.systemId && _ship.systemId != 0 && _ship.systemId !== -1) {
                if (_ship.lastMovedFromStarSystemPosition.col != _ship.starColRow.col) {
                    if (_ship.lastMovedFromStarSystemPosition.col < _ship.starColRow.col)
                        moveFromX = -moveDistance;
                    else
                        moveFromX = moveDistance;
                }

                if (_ship.lastMovedFromStarSystemPosition.row != _ship.starColRow.row) {
                    if (_ship.lastMovedFromStarSystemPosition.row < _ship.starColRow.row)
                        moveFromY = -moveDistance;
                    else
                        moveFromY = moveDistance;
                }
            }
            else {
                //Helpers.Log(_ship.lastMovedFromGalaxyPosition.col + ' X  -   ' + _ship.lastMovedFromGalaxyPosition.row + '  Y' );
                if (_ship.lastMovedFromGalaxyPosition.col != _ship.galaxyColRow.col) {
                    if (_ship.lastMovedFromGalaxyPosition.col < _ship.galaxyColRow.col)
                        moveFromX = -moveDistance;
                    else
                        moveFromX = moveDistance;
                }

                if (_ship.lastMovedFromGalaxyPosition.row != _ship.galaxyColRow.row) {
                    if (_ship.lastMovedFromGalaxyPosition.row < _ship.galaxyColRow.row)
                        moveFromY = -moveDistance;
                    else
                        moveFromY = moveDistance;
                }
            }
            //Helpers.Log(moveDistance + ' ' + moveFromX + ' ' + moveFromY);

            return { col: (moveFromX * currentMap.tileSize), row: (moveFromY * currentMap.tileSize) };
        }
        else {
            return { col: 0, row: 0 };
        }
    }

    function directionToAngle(direction: number): number {
        //1 left up, 2 up, 3 right up...
        switch (direction) {
            case 1:
                return 315;
            case 2:
                return 0;
            case 3:
                return 45;
            case 4:
                return 270;
            case 6:
                return 90;
            case 7:
                return 225;
            case 8:
                return 180;
            case 9:
                return 135;

        }
        return 0;
    }

    function drawShip(tileToDraw: Tile, displayPositionX: number, displayPositionY: number, x: number, y: number) {
        var ownShip = 0;
        var enemyShip = 0;
        var lowestRelationCode = 10;
        var Harvesting = false;
        if (tileToDraw.ships != null && tileToDraw.ships.length > 0) {

            for (var shipNo = 0; shipNo < tileToDraw.ships.length; shipNo++) {

                if (tileToDraw.ships[shipNo].owner == mainObject.user.id) {
                    //lowestRelationCode = Math.min(lowestRelationCode, 10);
                    if (mainObject.currentShip && mainObject.currentShip.id == tileToDraw.ships[shipNo].id) ownShip--;
                    ownShip++;
                }
                else {
                    if (tileToDraw.ships[shipNo].owner != 0) {
                        enemyShip++;
                        var shipRelationCode = 1; //ToDo: get the true relation code
                        if (mainObject.user.otherUserExists(tileToDraw.ships[shipNo].owner))
                            shipRelationCode = mainObject.user.otherUserFind(tileToDraw.ships[shipNo].owner).currentRelation;
                        lowestRelationCode = Math.min(lowestRelationCode, shipRelationCode);
                    }
                }

                if (mainObject.imageObjects[tileToDraw.ships[shipNo].typeId] == null) return;
                
                if (!tileToDraw.ships[shipNo].objectType) {
                    Helpers.Log('bad01');
                    return;
                }

                Harvesting = tileToDraw.ships[shipNo].Harvesting ? true : Harvesting;

                var offset = getOffset(tileToDraw.ships[shipNo]);


                if (tileToDraw.ships[shipNo].moveDirection != null) {
                    context.save();//saves the state of canvas              
                    context.translate(displayPositionX + offset.col + (currentMap.tileSize / 2), displayPositionY + offset.row + (currentMap.tileSize / 2)); //let's translate               
                    var angle = directionToAngle(tileToDraw.ships[shipNo].moveDirection);

                    // 3 = 135 = OK (rechts unten)
                    // 4 = 180 = ok (links)
                    //context.rotate(Math.PI / 180 * (90)); //increment the angle and rotate the image                 
                    context.rotate(angle * Math.PI / 180 ); //increment the angle and rotate the image                                   

                    context.drawImage(tileToDraw.ships[shipNo].objectType.texture,
                        - (currentMap.tileSize / 2),
                        - (currentMap.tileSize / 2),
                        currentMap.tileSize, currentMap.tileSize);
                    context.restore(); //restore the state of canvas;
                }
                else {                                
                    context.drawImage(tileToDraw.ships[shipNo].objectType.texture,
                        displayPositionX + offset.col,
                        displayPositionY + offset.row,
                        currentMap.tileSize, currentMap.tileSize);                    
                }  

                
                if (tileToDraw.ships[shipNo].Targeted) {
                    //490
                    context.drawImage(mainObject.imageObjects[490].texture,
                        displayPositionX + offset.col,
                        displayPositionY + offset.row,
                        currentMap.tileSize, currentMap.tileSize);
                }
                
                
                if ((mainObject.user.shipNames || mainObject.user.shipOwners)) {

                    if (mainObject.user.shipNames) {
                        drawString(x, y, tileToDraw.ships[shipNo].tagFreeName.label(), drawLine);
                        drawLine++;
                    }

                    if (mainObject.user.shipOwners) {
                        if (tileToDraw.ships[shipNo].getOwner() != null) {
                            if (drawOwnerString(x, y, tileToDraw.ships[shipNo].getOwner().tagFreeName.label(), drawLine, ownersDrawn, tileToDraw.ships[shipNo].getOwner().id)) {
                                drawLine++;
                            }
                        }
                    }

                }
                              
            }
        }

        //ToDo: check the color 

        //if (currentMap instanceof SolarSystemMap) {
        //    var currentSolarSystemMap = <SolarSystemMap> currentMap;
        //    if (currentSolarSystemMap.map[x][y].stars !== null) {
        //        var systemTile: SystemTile = <SystemTile> currentSolarSystemMap.map[x][y];
        //        if (systemTile.stars.colony != null) {
        //            ownShip += 1;
        //        }
        //    }
        //}


        if (ownShip != 0 || enemyShip != 0) {
            drawTileBorder(ownShip, enemyShip, displayPositionX, displayPositionY, x, y, lowestRelationCode);
        }

        if (Harvesting) {
            drawHarvest( displayPositionX, displayPositionY);
        }
        


    }

    var drawLine = 0; //the number of the line currently drawn
    var ownersDrawn: number[] = [];

    function draw( sourceX: number, sourceY: number, destinationX: number, destinationY: number) {

        if (!canvas)
            return;

        
        //To mark positions of special interest
        var tilesWithArrow: TileWithPositionOnScreen[] = [];

        //Helpers.Log('function draw()');
        sourceX = (sourceX === undefined) ? 0 : sourceX;
        sourceY = (sourceY === undefined) ? 0 : sourceY;
        destinationX = (destinationX === undefined) ? screenSize.width : destinationX;
        destinationY = (destinationY === undefined) ? screenSize.height : destinationY;

        //clear all:
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#000000'; // Black background
        context.fillRect(0, 0, canvas.width, canvas.height);


        //context.clearRect(0, 0, canvas.width, canvas.height);
        //alert("Size: " + getSize().width + " " + getSize().height);
        var pos_TL = pixelToGrid(currentMap.scroll.x, currentMap.scroll.y);

        var pos_BR = pixelToGrid(currentMap.scroll.x + screenSize.width, currentMap.scroll.y + screenSize.height);

        var startRow = pos_TL.row - 1;
        var startCol = pos_TL.col - 1;
        var rowCount = pos_BR.row + 1;
        var colCount = pos_BR.col + 1;

        /*       
        rowCount = Math.min(rowCount, currentMap.gridsize.rows);
        colCount = Math.min(colCount, currentMap.gridsize.cols);
        Helpers.Log('links oben: ' + startCol + '/' + startRow  +' | rechts unten: ' + colCount + '/' + rowCount);
        */

        var lowestRelationCode = 20; //paint a border in the color of the lowest relation code (0 = war = red) 10 = own ship = green

        //stars background
        drawBackground();

        //The FogContext is used to grey out all not explored areas
        FogContext.clearRect(0, 0, FogCanvas.width, FogCanvas.height);

        var Brightness = mainObject.user.scanRangeBrightness / 100;
        FogContext.fillStyle = "rgba(255, 255, 255, " + Brightness + ")";
        FogContext.fillRect(0, 0, FogCanvas.width, FogCanvas.height);

        //Galaxy view: Draw Nebula and Borders using a QuadTree
        if (currentMap.correspondingArea.Id == -1) {

            //create a box containing more than the screen:
            var FogOfWarModuleField = new FogOfWarModule.Field(startCol, startRow);
            var dimension = Math.max(rowCount - startRow, colCount - startCol);
            var screenBox = new FogOfWarModule.Box(FogOfWarModuleField, dimension);

            //get all FogOfWar-Boxes inside screen
            var discoveredBoxes = FogOfWarModule.fog.queryRange(screenBox);

            //draw them
            for (var boxNo = 0; boxNo < discoveredBoxes.length; boxNo++) {
                var displayPositionX = currentMap.tileSize * discoveredBoxes[boxNo].lowerLeft.x;
                var displayPositionY = currentMap.tileSize * discoveredBoxes[boxNo].lowerLeft.y;
                displayPositionX -= currentMap.scroll.x;
                displayPositionY -= currentMap.scroll.y;             
                clearFogOfWar(displayPositionX, displayPositionY, discoveredBoxes[boxNo].width);
            }
            FogContext.fillRect(0, 0, FogCanvas.width, FogCanvas.height);


            //draw scan Range
            for (var x = startCol; x < colCount; x++) {
                for (var y = startRow; y < rowCount; y++) {
                    if (scanMap.scanTileExist({ col: x, row: y })) {
                        var displayPositionX = currentMap.tileSize * x;
                        var displayPositionY = currentMap.tileSize * y;
                        displayPositionX -= currentMap.scroll.x;
                        displayPositionY -= currentMap.scroll.y;
                        //drawShipScanAreas(displayPositionX, displayPositionY);
                        clearShipScanAreas(displayPositionX, displayPositionY);
                    }
                }
            }
            context.drawImage(FogCanvas, 0, 0);

            //create a box containing more than the screen:
            var coordinate = new StarMapModule.Coordinate(startCol, startRow);            
            var screenBox2 = new StarMapModule.Box(coordinate, dimension);

            //get all StarMap-Boxes inside screen
            var visibleStarMap = StarMapModule.starMap.queryRange(screenBox2);

            //draw them
            for (var boxNo = 0; boxNo < visibleStarMap.length; boxNo++) {
                var displayPositionX = (currentMap.tileSize * visibleStarMap[boxNo].lowerLeft.x);
                var displayPositionY = (currentMap.tileSize * visibleStarMap[boxNo].lowerLeft.y);
                displayPositionX -= (currentMap.scroll.x);
                displayPositionY -= (currentMap.scroll.y);

                //draw Nebula:
                /*
                // tileset
                if (visibleStarMap[boxNo].nebulaId) {
                    var nebulaField = visibleStarMap[boxNo];

                    context.drawImage(nebulaField.nebula.canvasCache,
                        displayPositionX, displayPositionY,
                        currentMap.tileSize, currentMap.tileSize);
                }
                */
                
                // FPS: 24?
                //just draw without rotating
                /*
                if (visibleStarMap[boxNo].nebulaId == 5000) {

                    var z: HTMLImageElement = mainObject.imageObjects[3500].texture;
                    context.drawImage(z,
                        displayPositionX - (currentMap.tileSize * 1.5),
                        displayPositionY - (currentMap.tileSize * 1.5),
                        4 * currentMap.tileSize,
                        4 * currentMap.tileSize);                   
                }        
                */
                //single field
                
                /*
                // FPS: 20?
                //Cache by image.canvasCache 
                if (visibleStarMap[boxNo].nebulaId == 5000) {
                    var nebulaField = visibleStarMap[boxNo];
                    var rotation = visibleStarMap[boxNo].id % 8;


                    var image = mainObject.imageObjects[3500 + rotation];

                    context.drawImage(image.canvasCache,
                        //0,0,600,600,  //clipping of canvas - not needed
                        displayPositionX - (currentMap.tileSize * 1.5),
                        displayPositionY - (currentMap.tileSize * 1.5),
                        4 * currentMap.tileSize,
                        4 * currentMap.tileSize);                 
                }
                */ 

                

                /*
                // FPS: 17?
                //rotate whole canvas
                if (visibleStarMap[boxNo].nebulaId == 5000) {
                    var nebulaField = visibleStarMap[boxNo];

                    var rotation = visibleStarMap[boxNo].id % 8;

                    context.save();//saves the state of canvas              
                    context.translate(displayPositionX + (currentMap.tileSize / 2), displayPositionY + (currentMap.tileSize / 2)); //let's translate               
                    var angle = directionToAngle(rotation + 1);

                    context.rotate(angle * Math.PI / 180); //increment the angle and rotate the image                                   

                    context.drawImage(mainObject.imageObjects[3500].texture,
                        - (currentMap.tileSize * 2),
                        - (currentMap.tileSize * 2),
                        currentMap.tileSize * 4,
                        currentMap.tileSize * 4);

                    context.restore(); //restore the state of canvas;
                }
                */
                //drawFogOfWar(displayPositionX, displayPositionY, discoveredBoxes[boxNo].width);

                var imageObject = mainObject.imageObjects[visibleStarMap[boxNo].imageId];
                if (imageObject && imageObject.tileSheetCount > 1) {
                                        
                    var tileSheetPick = visibleStarMap[boxNo].id % imageObject.tileSheetCount;
                    //The textture contqains all 8 nebula-images. Use an offset to fetch the correct one.
                    context.drawImage(imageObject.texture,

                        imageObject.imageSize * tileSheetPick,
                        0,
                        imageObject.imageSize,
                        imageObject.imageSize,

                        displayPositionX - (currentMap.tileSize * imageObject.tilesOffset),
                        displayPositionY - (currentMap.tileSize * imageObject.tilesOffset),
                        (imageObject.tilesOffset * 2 * currentMap.tileSize) + currentMap.tileSize, //the size to be drawn has to respect its offset of its upper left corner and lower right corner.
                        (imageObject.tilesOffset * 2 * currentMap.tileSize) + currentMap.tileSize
                    );
                }


                //FPS:23
                //draw rotated image
                /*
                if (visibleStarMap[boxNo].imageId == 5000) {
                    var nebulaField = visibleStarMap[boxNo];

                    var rotation = visibleStarMap[boxNo].id % 8;
                    //The textture contqains all 8 nebula-images. Use an offset to fetch the correct one.
                    context.drawImage(mainObject.imageObjects[3500].texture,
                        
                        240 * rotation,
                        0,
                        240,
                        240,

                        displayPositionX - (currentMap.tileSize * 1.5),
                        displayPositionY - (currentMap.tileSize * 1.5),
                        4 * currentMap.tileSize,
                        4 * currentMap.tileSize
                        ); 

                    
                }

                if (visibleStarMap[boxNo].imageId == 5001) {
                    var nebulaField = visibleStarMap[boxNo];

                    var rotation = visibleStarMap[boxNo].id % 8;
                    //The textture contqains all 8 nebula-images. Use an offset to fetch the correct one.
                    context.drawImage(mainObject.imageObjects[3510].texture,

                        240 * rotation,
                        0,
                        240,
                        240,

                        displayPositionX - (currentMap.tileSize * 1.5),
                        displayPositionY - (currentMap.tileSize * 1.5),
                        4 * currentMap.tileSize,
                        4 * currentMap.tileSize
                    );
                }


                if (visibleStarMap[boxNo].imageId == 5002) {
                    var nebulaField = visibleStarMap[boxNo];

                    var rotation = visibleStarMap[boxNo].id % 8;
                    //The textture contqains all 8 nebula-images. Use an offset to fetch the correct one.
                    context.drawImage(mainObject.imageObjects[3520].texture,

                        240 * rotation,
                        0,
                        240,
                        240,

                        displayPositionX - (currentMap.tileSize * 1.5),
                        displayPositionY - (currentMap.tileSize * 1.5),
                        4 * currentMap.tileSize,
                        4 * currentMap.tileSize
                    );
                }

                if (visibleStarMap[boxNo].imageId == 5003) {
                    var nebulaField = visibleStarMap[boxNo];

                    var rotation = visibleStarMap[boxNo].id % 8;
                    //The textture contqains all 8 nebula-images. Use an offset to fetch the correct one.
                    context.drawImage(mainObject.imageObjects[3530].texture,

                        240 * rotation,
                        0,
                        240,
                        240,

                        displayPositionX - (currentMap.tileSize * 1.5),
                        displayPositionY - (currentMap.tileSize * 1.5),
                        4 * currentMap.tileSize,
                        4 * currentMap.tileSize
                    );
                }
                */

                //Borders:  
                var ImageId: number = null;

                /*       
                if (visibleStarMap[boxNo].OwnerImagesType != 0) {
                    ImageId = BorderImageId(visibleStarMap[boxNo].OwnerImagesType, visibleStarMap[boxNo].DiplomaticId, visibleStarMap[boxNo].OwnerId);
                }*/

                //check waht kind of borer is to be shown, and if a border does exist on the field
                switch (mainObject.user.BordersDisplay) {
                    case PlayerData.BordersDisplays.UserDiplomatics:
                        if (visibleStarMap[boxNo].OwnerImagesType != 0) {
                            ImageId = BorderImageId(visibleStarMap[boxNo].OwnerImagesType, visibleStarMap[boxNo].DiplomaticId, visibleStarMap[boxNo].OwnerId);
                        }
                        break;
                    case PlayerData.BordersDisplays.AllianceDiplomatics:
                        if (visibleStarMap[boxNo].EntityImagesType != 0) {
                            ImageId = BorderImageId(visibleStarMap[boxNo].EntityImagesType, visibleStarMap[boxNo].DiplomaticId, visibleStarMap[boxNo].OwnerId);
                        }
                        break;
                }
                


                if (ImageId != null) {
                    //if (mainObject.imageObjects[ImageId] == null) Helpers.Log('ERROR: ' + ImageId);
                    var z = mainObject.imageObjects[ImageId].canvasCache;
                    context.drawImage(z,
                        displayPositionX, displayPositionY,
                        currentMap.tileSize, currentMap.tileSize);
                }

                
            }

        }


        // if (user.raster) drawGrid();

        //drawBorder();
        if (mainObject.user.raster) drawGrid();

        var currentTime = (new Date()).getTime();

        //draw planet background - not yet needed, currentMap is atm always a ColonyMap
        if (currentMap instanceof TilemapModule.PlanetMap ) {
            
            var tileToDraw: Tile = currentMap.map[0][0];           
            //var objectid: number = 10000 + ((tileToDraw.stars.parentArea.Id % 15) + 1);
            var objectid: number = 8000;
            var backGround: HTMLImageElement = mainObject.imageObjects[objectid].texture;
            //context.drawImage(backGround, -currentMap.scroll.x, -currentMap.scroll.y, 11 * currentMap.tileSize, 8 * currentMap.tileSize);
            context.drawImage(backGround, -currentMap.scroll.x - (3 * currentMap.tileSize), -currentMap.scroll.y - (3 * currentMap.tileSize), 15 * currentMap.tileSize, 15 * currentMap.tileSize);
        }

        //draw colony background
        if (currentMap instanceof TilemapModule.ColonyMap) {

            var backgroundMap = <TilemapModule.ColonyMap>currentMap;

            for (var i = 0; i < backgroundMap.correspondingAreas.length; i++) {
                var offset = backgroundMap.correspondingAreas[i].BackGroundOffset;
                var Size = backgroundMap.correspondingAreas[i].BackGroundSize;
                //var tileToDraw: Tile = currentMap.map[0][0];
                //var objectid: number = 10000 + ((tileToDraw.stars.parentArea.Id % 15) + 1);
                //var objectid: number = backgroundMap.correspondingAreas[i].PlanetArea.typeId;
                var objectid: number = backgroundMap.correspondingAreas[i].PlanetArea.BackgroundObjectId;
                //Size = backgroundMap.correspondingAreas[i].PlanetArea.BackgroundDrawSize;


                var backGround: HTMLImageElement = mainObject.imageObjects[objectid].texture;
                //context.drawImage(backGround, -currentMap.scroll.x, -currentMap.scroll.y, 11 * currentMap.tileSize, 8 * currentMap.tileSize);
                context.drawImage(backGround, -currentMap.scroll.x + (offset.col * currentMap.tileSize), -currentMap.scroll.y + (offset.row * currentMap.tileSize), Size * currentMap.tileSize, Size * currentMap.tileSize);
            }
        }

        //draw data from currentMap
        for (var x = startCol; x < colCount; x++) {
            for (var y = startRow; y < rowCount; y++) {



                var tileToDraw: Tile = currentMap.map[x] && currentMap.map[x][y] || null;
                
                drawCanvasTooltip(x, y, currentTime, tileToDraw);


                if (tileToDraw != null) {                    
                    drawLine = 0;
                    ownersDrawn.length = 0;
                    
                    
                   
                                       
                    //Helpers.Log('scroll.x:' + scroll.x + ' - scroll.y:' + scroll.y);
                    //lowestRelationCode = 20;
                    //ownShip = 0;
                    //enemyShip = 0; 

                    var displayPositionX = currentMap.tileSize * x;
                    var displayPositionY = currentMap.tileSize * y;
                    displayPositionX -= currentMap.scroll.x;
                    displayPositionY -= currentMap.scroll.y;
                                                                           
                    if (tileToDraw.drawArrow) tilesWithArrow.push({ tile: tileToDraw, displayPositionX: displayPositionX, displayPositionY: displayPositionY } );

                    //draw element of the map - star, planet, building...
                    if (tileToDraw.astronomicalObject != null && (<SystemTile>tileToDraw).astronomicalObject.fieldSize !== 0) {
                        drawTile(tileToDraw, displayPositionX, displayPositionY, x, y);
                    }                    

                    //draw ships
                    drawShip(tileToDraw, displayPositionX, displayPositionY, x, y);
                    

                    drawSelectedBorder(displayPositionX, displayPositionY, x, y);
                }

                if (mainObject.user.raster && mainObject.user.coordinates && currentMap.allowCoordinatesView && x % 20 == 0 && y % 20 == 0) {
                    drawTileCoordinates(x, y);
                }

                // &/drawStarName
                
            }
        }

        //draw moveShip Path (dragging a ship with mouse or finger
        if (mainObject.currentShip &&
            mainObject.currentShip.MoveShipEndColRow != null &&
            mainObject.currentShip.MoveShipStartColRow != null){
            //drawShipMovementPath();
            drawShipMovementPath2();
        }

        /*
        if (currentMap instanceof TilemapModule.PlanetMap) {
            drawGrid();
        }

        if (currentMap instanceof TilemapModule.PlanetMap) {
            drawBlackSurrounding();
        }
        */


        if (currentMap instanceof TilemapModule.SolarSystemMap) {
            drawSystemBorder();
        }

        if (currentMap instanceof TilemapModule.StarMap) {
            drawCenterCoordinates();
        }


        for (var i = 0; i < tilesWithArrow.length; i++) {
            drawArrow(tilesWithArrow[i]);
        }
               
    }

    /// returns the imageId in the apprrpirate color
    function BorderImageId(imagesType: number, diplomaticId : number, ownerId : number) : number {
        /*
        var z: HTMLImageElement = mainObject.imageObjects[3500].texture;
        context.drawImage(z,
            displayPositionX, displayPositionY,
            currentMap.tileSize, currentMap.tileSize);
        */

        var BorderColor = 5200;

        switch (diplomaticId) {
            case 0:
                BorderColor = 6200;   //dark red
                break;
            case 1:
                BorderColor = 6400;   //light red
                break;
            case 2:
                BorderColor = 5200;  //neutral  //grey
                break;
            case 3:
                BorderColor = 6000;  //Trade   //open borders // light green
                break;
            case 4:
                BorderColor = 5600;  // pact  Light Blue
                break;
            case 5:
                //BorderColor = 5400;  //pact // Dark Blue
                BorderColor = 5800;  //allied  //dark green
                break;
            case 6:
                //BorderColor = 5400;  //allied  //dark blue
                BorderColor = 5800;  //allied  //dark green
                break;
        }
        if (ownerId == mainObject.user.id) BorderColor = 5800;  // dark green

        var imageId = BorderColor + imagesType;

        return imageId;
    }


    function drawShipMovementPoints2(step: Pathfinder.Step, moves) {
        var endColRow = { col: step.x, row: step.y };
        
        if (step.FieldCost == 0) return;

        //Helpers.Log('drawShipMovementSingleLine: ' + startColRow.col + '/' + startColRow.row + ' - ' + endColRow.col + '/' + endColRow.row);
        var endColRowX = currentMap.tileSize * endColRow.col;
        var endColRowY = currentMap.tileSize * endColRow.row;
        endColRowX -= currentMap.scroll.x;
        endColRowY -= currentMap.scroll.y;
        endColRowX += (currentMap.tileSize / 2);
        endColRowY += (currentMap.tileSize / 2);





        context.beginPath();
        context.arc(endColRowX, endColRowY, 3, 0, 2 * Math.PI, false);
        if (step.FieldCost == 1) {
            context.fillStyle = "green";
        }
        else {
            context.fillStyle = "yellow";
        }

        if (moves.remaining <= 0) {
            context.fillStyle = "red";
        }

        context.fill();
        //context.stroke();
        context.closePath();

        //context.lineWidth = 1;

        moves.remaining -= step.FieldCost;
    }


    function drawShipMovementPath2() {
        var nexColRow: ColRow;
        var endColRow: ColRow = mainObject.currentShip.MoveShipEndColRow;

        if (mainObject.currentShip.MoveShipEndColRow) {
            nexColRow = mainObject.currentShip.MoveShipStartColRow;
        }



        if (nexColRow.col != endColRow.col || nexColRow.row != endColRow.row) {
           
            var Fields: Pathfinder.Step[] = Pathfinder.findPath(nexColRow.col, nexColRow.row, endColRow.col, endColRow.row, 1);
            var stepCount = Fields.length;
            if (stepCount == 0) { return; }
            if (stepCount == 1 && Fields[0].FieldCost == 0) { return; }

            var MovesRemaining = 0;
            if (currentMap instanceof TilemapModule.StarMap) {
                if (mainObject.currentShip) {
                    if (mainObject.currentShip.Fleet) MovesRemaining = mainObject.currentShip.Fleet.starMoves;
                    else MovesRemaining = mainObject.currentShip.starMoves;

                    Helpers.Log("MovesRemaining 1: " + MovesRemaining.toString());
                }
            } else {
                if (mainObject.currentShip) {
                    if (mainObject.currentShip.Fleet) MovesRemaining = mainObject.currentShip.Fleet.sytemMoves;
                    else MovesRemaining = mainObject.currentShip.sytemMoves;

                    Helpers.Log("MovesRemaining 2: " + MovesRemaining.toString());
                }
            }
            
            //the remaining moves that the ship has left
            /*var moves = {
                remaining: currentMap instanceof TilemapModule.StarMap &&
                mainObject.currentShip &&
                mainObject.currentShip.starMoves
                || currentMap instanceof TilemapModule.SolarSystemMap &&
                mainObject.currentShip &&
                mainObject.currentShip.sytemMoves
            };*/
            var moves = {
                remaining: MovesRemaining
            };

            for (var i = stepCount - 1; i >= 0; i--) {
                drawShipMovementPoints2(Fields[i], moves);      
            }
        }

        //draw coordinates under current mouse pointer:
        if (currentMap instanceof TilemapModule.StarMap) {
            var endColRowX = currentMap.tileSize * endColRow.col;
            var endColRowY = currentMap.tileSize * endColRow.row;
            endColRowX -= currentMap.scroll.x;
            endColRowY -= currentMap.scroll.y;
            endColRowX += (currentMap.tileSize / 1.5);
            endColRowY += (currentMap.tileSize / 1.5);

            drawTileCoordinates(endColRow.col, endColRow.row, true);
        }

    }

    //draw a line from the movement start to the movement end
    /*
    function drawShipMovementPath() {
        //Helpers.Log('Move ShipModule.Ship: ' + currentMap.moveShipStartColRow.col + '/' + currentMap.moveShipStartColRow.row + ' - ' + currentMap.moveShipEndColRow.col + '/' + currentMap.moveShipEndColRow.row);
        var nexColRow = { col: mainObject.currentShip.MoveShipStartColRow.col, row: mainObject.currentShip.MoveShipStartColRow.row };

        //the remaining moved that the ship has left
        var moves = {
            remaining: currentMap instanceof TilemapModule.StarMap &&
            mainObject.currentShip &&
            mainObject.currentShip.starMoves 
        ||  currentMap instanceof TilemapModule.SolarSystemMap &&
            mainObject.currentShip &&
            mainObject.currentShip.sytemMoves
        };

        while (nexColRow.col != currentMap.moveShipEndColRow.col || nexColRow.row != currentMap.moveShipEndColRow.row) {
            var start = { col: nexColRow.col, row: nexColRow.row };
            var col = 0;
            var row = 0;
            if (nexColRow.col < currentMap.moveShipEndColRow.col) col = 1;
            if (nexColRow.col > currentMap.moveShipEndColRow.col) col = -1;
            if (nexColRow.row < currentMap.moveShipEndColRow.row) row = 1;
            if (nexColRow.row > currentMap.moveShipEndColRow.row) row = -1;
            nexColRow.col = parseInt(nexColRow.col,10) + col;
            nexColRow.row = parseInt(nexColRow.row,10) + row;
            //drawShipMovementSingleLine(start, nexColRow);

            drawShipMovementPoints(nexColRow, moves);
        }

        //draw coordinates under current mouse pointer:
        if (currentMap instanceof TilemapModule.StarMap) {
            var endColRowX = currentMap.tileSize * currentMap.moveShipEndColRow.col;
            var endColRowY = currentMap.tileSize * currentMap.moveShipEndColRow.row;
            endColRowX -= currentMap.scroll.x;
            endColRowY -= currentMap.scroll.y;
            endColRowX += (currentMap.tileSize / 1.5);
            endColRowY += (currentMap.tileSize / 1.5);

            drawTileCoordinates(currentMap.moveShipEndColRow.col, currentMap.moveShipEndColRow.row, true);
        }
        
    }
    */

    //called with position and the nimber of moves the ship has left
    function drawShipMovementPoints(endColRow, moves) {

        var cost = 1;
        if (currentMap instanceof TilemapModule.StarMap) {
            var box = StarMapModule.makeBox(endColRow.col, endColRow.row);
            var existingField = StarMapModule.starMap.queryRange(box);
            if (existingField && existingField.length && existingField.length != 0) {
                if (existingField[0].imageId >= 5000) {
                    cost = 8;
                }
            }
        }

        if (currentMap instanceof TilemapModule.SolarSystemMap) {
            if (currentMap.tileExist(endColRow)
                && currentMap.findCreateTile(endColRow).astronomicalObject
                ) {
                Helpers.Log(mainObject.imageObjects[currentMap.findCreateTile(endColRow).astronomicalObject.typeId].moveCost.toString());
                Helpers.Log(currentMap.findCreateTile(endColRow).astronomicalObject.typeId.toString());

                cost = mainObject.imageObjects[currentMap.findCreateTile(endColRow).astronomicalObject.typeId].moveCost;
            }
            
        }


        //Helpers.Log('drawShipMovementSingleLine: ' + startColRow.col + '/' + startColRow.row + ' - ' + endColRow.col + '/' + endColRow.row);
        var endColRowX = currentMap.tileSize * endColRow.col;
        var endColRowY = currentMap.tileSize * endColRow.row;
        endColRowX -= currentMap.scroll.x;
        endColRowY -= currentMap.scroll.y;
        endColRowX += (currentMap.tileSize / 2);
        endColRowY += (currentMap.tileSize / 2);

        

        

        context.beginPath();
        context.arc(endColRowX, endColRowY, 3, 0, 2 * Math.PI, false);
        if (cost == 1) {
            context.fillStyle = "green";
        }
        else {
            context.fillStyle = "yellow";
        }

        if (moves.remaining <= 0) {
            context.fillStyle = "red";
        }

        context.fill();
        //context.stroke();
        context.closePath();

        context.lineWidth = 1;

        moves.remaining -= cost;
    }


    function drawShipScanAreas(displayPositionX, displayPositionY) {        
        context.beginPath();
        var Brightness = mainObject.user.scanRangeBrightness / 100;
        context.fillStyle = "rgba(255, 255, 255, " + Brightness + ")";       
        context.fillRect(displayPositionX, displayPositionY, currentMap.tileSize, currentMap.tileSize);
        context.closePath();
    }

    function clearShipScanAreas(displayPositionX, displayPositionY) {
        //FogContext.beginPath();        
        FogContext.clearRect(displayPositionX, displayPositionY, currentMap.tileSize, currentMap.tileSize);
        //FogContext.closePath();
    }

    function drawFogOfWar(displayPositionX, displayPositionY, dimension) {
        context.beginPath();
        var Brightness = mainObject.user.scanRangeBrightness / 100;
        context.fillStyle = "rgba(255, 255, 255, " + Brightness + ")";        
        context.fillRect(displayPositionX, displayPositionY, currentMap.tileSize * dimension, currentMap.tileSize * dimension);
        context.closePath();
    }

    function clearFogOfWar(displayPositionX, displayPositionY, dimension) {
        FogContext.beginPath();
        FogContext.clearRect(displayPositionX, displayPositionY, currentMap.tileSize * dimension, currentMap.tileSize * dimension);
        FogContext.closePath();
    }


    //grey out tiles where the build is not possible
    function drawBuildingToBuiltGreyOut(displayPositionX, displayPositionY, surfaceArea) : boolean {
        if (!(surfaceArea instanceof SurfaceField)) return false;


        
        var buildingAllowedArray = mainObject.surfaceTileBuildings[mainObject.parseInt(surfaceArea.surfaceFieldType)];

        if (buildingAllowedArray != null && buildingAllowedArray[mainObject.selectedBuilding] != null) return true;


        //Helpers.Log('Gray out: ' + displayPositionX + '/' + displayPositionY);
        //check selectedBuilding versus the possible buildings for this tile
        context.beginPath();
        context.fillStyle = "rgba(0, 0, 0, 0.5)";

        //context.fillRect(displayPositionX - currentMap.tileSize, displayPositionY - currentMap.tileSize, 3 * currentMap.tileSize, 3 * currentMap.tileSize);
        context.fillRect(displayPositionX, displayPositionY, currentMap.tileSize, currentMap.tileSize);
        context.closePath();

        return false;
    }

    /// draw a semitransparent grey rectangle over the building if it is inactive
    function drawBuildingInactivity(displayPositionX, displayPositionY, surfaceArea) {
        if (!(surfaceArea instanceof SurfaceField)) return;

        var surfaceArea2 = <SurfaceField>surfaceArea;

        //skip if no builidng is present or building is active
        if (surfaceArea2.building == null || surfaceArea2.building.isActive) return;
        
        context.beginPath();
        context.fillStyle = "rgba(0, 0, 0, 0.5)";

        context.fillRect(displayPositionX, displayPositionY, currentMap.tileSize, currentMap.tileSize);
        context.closePath();
    }

    function drawHarvest( displayPositionX, displayPositionY) {

        context.strokeStyle = "#bbbbbb";
        context.beginPath();
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        //context.strokeRect(displayPositionX + 3, displayPositionY + 3, currentMap.tileSize - 3, currentMap.tileSize - 3);
        //context.fillRect(displayPositionX, displayPositionY, currentMap.tileSize, currentMap.tileSize);
        var centerX = displayPositionX + (currentMap.tileSize / 2);
        var centerY = displayPositionY + (currentMap.tileSize / 2);
        var radius = (currentMap.tileSize * 0.3);

        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fill();
        context.closePath();

        
    }


    function drawTileRelationBorder(relationCode: number, displayPositionX, displayPositionY) {

        if (relationCode != 11) {

            context.strokeStyle = DiplomacyModule.RelationColor(relationCode);
            
            context.beginPath();
            context.strokeRect(displayPositionX + 1, displayPositionY + 1, currentMap.tileSize - 1, currentMap.tileSize - 1);
            context.closePath();

        }
    }

    function TooltipCoordinates(displayPositionX: number, displayPositionY: number, tileSize: number): { x: number; y: number } {
        //$("#CanvasTooltip div").html(TooltipText);
        var TooltipWidth = $("#CanvasTooltip").width();
        var TooltipHeight = $("#CanvasTooltip").height();
        var x = 0;
        var y = 0;

        //tooltip should be right (between field and right  with a margin of 20px to the right border of the field and at least 20px to the right border of the screen
        if (displayPositionX + tileSize + TooltipWidth + 40 < screenSize.width) {
            x = displayPositionX + tileSize + 20;
        } else {
            // if this is not possible, the tooltip should be to the left of the field
            x = displayPositionX - 20 - TooltipWidth;
        }

        //tooltip should be centered in height
        if (displayPositionY + tileSize / 2 + TooltipHeight / 2 + 5 < screenSize.height) {            
            y = displayPositionY + tileSize / 2 - TooltipHeight / 2;

            if (y < 5) y = 5;
        } else {
            // if this is not possible, the tooltip should be to the left of the field
            y = screenSize.height - 5 - TooltipHeight;
        }

        return { x: x, y:y };
    }

    function TooltipCoordinatesText(col, row) {
        if ((currentMap instanceof TilemapModule.StarMap)) {
            $("#CanvasTooltip div").prepend($("<br>"));
            var CoordinatesSpan = $("<span>", { text: col + "/" + row });
            CoordinatesSpan.css("font-size", "9px");
            CoordinatesSpan.css("color", "lightgrey");
            CoordinatesSpan.css("float", "right");
            $("#CanvasTooltip div").prepend(CoordinatesSpan);

        }
    }

    export function drawCanvasTooltip( col, row, currentTime: number, tile : Tile) {

        if (currentMap.MouseOverField.col == col && currentMap.MouseOverField.row == row) {
            if (currentTime - currentMap.MouseMoveStartTime > 800) {

                //don't make borders on space tiles in colony screen
                if (currentMap instanceof TilemapModule.ColonyMap
                    && tile == null) return;

                

                //make a border around tile for starmap and systemmap and planet fields on planetmaps                
                var displayPositionX = currentMap.tileSize * col;
                var displayPositionY = currentMap.tileSize * row;
                displayPositionX -= currentMap.scroll.x;
                displayPositionY -= currentMap.scroll.y;
                context.save();
                context.strokeStyle = "#1010ff";
                context.lineWidth = 2;
                context.beginPath();
                context.strokeRect((displayPositionX - 2), (displayPositionY - 2), currentMap.tileSize + 4, currentMap.tileSize + 4);
                context.closePath();
                context.restore();
                

                //create the tooltip once - if the coordinates remain the same, just skip
                if (CurrentToolTip.col === col && CurrentToolTip.row === row) return;
                                
                if (tile != null) {
                    $("#CanvasTooltip div").html(tile.GetTooltip());
                    TooltipCoordinatesText(col, row);

                }
                else {
                    //Leerer Raum, eventuell von Besitzer:


                    //Ownership
                    //
                    //Empty Space
                    //1 Move Cost

                    //or

                    //Outer Space
                    //      5000/5212


                    var TooltipText = "";
                    if (currentMap instanceof TilemapModule.StarMap) {
                        var x, y: number;
                        x = col;
                        y = row;
                        if (StarMapModule.FieldExists(x, y)) {
                            TooltipText += StarMapModule.GetField(x, y).OwnershipText();
                        }
                    }

                    if (currentMap instanceof TilemapModule.SolarSystemMap && (col < 0 || row < 0 || col >= currentMap.gridsize.cols || row >= currentMap.gridsize.rows)) {
                        TooltipText += i18n.label(926);  //Solarsystem: "Outer Space"
                    }
                    else {
                        TooltipText += i18n.label(925) + "<br>"; //"Empty Space"
                        TooltipText += i18n.label(923).format("1"); // {0} Move Cost / Bewegungskosten                      
                    }
                    
                    
                    
                    //TooltipText += CoordinatesSpan.html();


                    $("#CanvasTooltip div").html(TooltipText);
                    TooltipCoordinatesText(col, row);

                }

                $("#CanvasTooltip").css("display", "block");
                TooltipShown = true;
                var TargetCoordinates = TooltipCoordinates(displayPositionX, displayPositionY, currentMap.tileSize);

                $("#CanvasTooltip").css("left", TargetCoordinates.x);
                $("#CanvasTooltip").css("top", TargetCoordinates.y);

                CurrentToolTip.col = col;
                CurrentToolTip.row = row;

                
            } else {
                $("#CanvasTooltip").css("display", "none"); 
                CurrentToolTip.col = null;
                CurrentToolTip.row = null;     
                TooltipShown = false;          
            }
            ScreenUpdate = true;
        }
    }


    function drawSelectedBorder(displayPositionX, displayPositionY, col, row) {

        //draws a blue area around the currently selected ship:
        if (mainObject.currentShip != null && mainObject.currentShip.colRow.col == col && mainObject.currentShip.colRow.row == row) {
            var offset = getOffset(mainObject.currentShip);

            context.strokeStyle = "#1010ff";
            context.lineWidth = 2;
            context.beginPath();
            context.strokeRect((displayPositionX - 2) + offset.col, (displayPositionY - 2) + offset.row, currentMap.tileSize + 4, currentMap.tileSize + 4);
            context.closePath();
            context.lineWidth = 1;

        } 
    }

    function drawTileBorder(ownShip, enemyShip, displayPositionX, displayPositionY, col, row, lowestRelationCode: number) {

        drawTileRelationBorder(lowestRelationCode, displayPositionX, displayPositionY);
        return; 
    }

    function drawTileCoordinates(x: number, y: number, movementOffSet = false) {
        var displayPositionX = currentMap.tileSize * x;
        var displayPositionY = currentMap.tileSize * y;
        displayPositionX -= currentMap.scroll.x;
        displayPositionY -= currentMap.scroll.y;

        if (movementOffSet) {
            displayPositionX = displayPositionX + (currentMap.tileSize / 1.5);
            displayPositionY = displayPositionY + (currentMap.tileSize / 1.5);
        }
        else {
            displayPositionX = displayPositionX + 2;
            displayPositionY = displayPositionY + 12;
        }


        context.font = '10pt Calibri';
        context.fillStyle = 'grey';


        var text = x.toString() + '/' + y.toString();
        context.fillText(text, displayPositionX + 2, displayPositionY + 12);
        //Helpers.Log('drawTileCoordinates: ' + text + 'at : ' + displayPositionX + '/' + displayPositionY ) ;
    }

    function drawCenterCoordinates() {
        var x = Math.floor( (currentMap.scroll.x + (canvas.width / 2)) / currentMap.tileSize);
        var y = Math.floor((currentMap.scroll.y + (canvas.height / 2)) / currentMap.tileSize);
        
        context.font = '10pt Calibri';
        context.fillStyle = 'grey';

        var text = x.toString() + '/' + y.toString();
        context.fillText(text, 20 , 120);
        //Helpers.Log('drawTileCoordinates: ' + text + 'at : ' + displayPositionX + '/' + displayPositionY ) ;
    }    

    function drawString(x: number, y: number, name: string, lineNumber: number = 0, _bold:boolean = false) {
        var displayPositionX = currentMap.tileSize * x;
        var displayPositionY = currentMap.tileSize * y;
        displayPositionX -= currentMap.scroll.x;
        displayPositionY -= currentMap.scroll.y;
        var bold = _bold ? 'bold ' : '';
        var yAdd = 0;
        switch (currentMap.tileSize) {
            case 30:
                context.font = bold + '12pt Trebuchet MS' ;
                yAdd = lineNumber * 14;
                break;
            case 15:
                context.font = bold + '8pt Trebuchet MS';
                yAdd = lineNumber * 10;
                break;
            case 60:
                context.font = bold + '16pt Trebuchet MS' ;
                yAdd = lineNumber * 18;
                break;
            case 120:
                context.font = bold + '20pt Trebuchet MS' ;
                yAdd = lineNumber * 22;
                break;
            default:
                context.font = bold + '12pt Trebuchet MS' ;
                yAdd = lineNumber * 14;
                break;
        }
        //context.font = '10pt Calibri';
        context.fillStyle = _bold ? '#B0B0B0  ' : 'grey';


        var text = name;
        context.fillText(text, displayPositionX + currentMap.tileSize, displayPositionY + (currentMap.tileSize * 4 / 5) + yAdd);
        //Helpers.Log('drawTileCoordinates: ' + text + 'at : ' + displayPositionX + '/' + displayPositionY ) ;
    }

    function drawOwnerString(x: number, y: number, name: string, lineNumber: number, ownerArray : number[], ownerId : number) : boolean {
        if (ownerArray[ownerId] == null) {
            ownerArray[ownerId] = 1;
            drawString(x, y, name, lineNumber, true);
            return true;
        }

    }

    function drawArrow(tileInfo : TileWithPositionOnScreen) {
      
        var z: HTMLImageElement = mainObject.imageObjects[70].texture;
        context.drawImage(z, tileInfo.displayPositionX + currentMap.tileSize * 0.5, tileInfo.displayPositionY - currentMap.tileSize * 0.5, currentMap.tileSize, currentMap.tileSize);       
        //Helpers.Log('drawTileCoordinates: ' + text + 'at : ' + displayPositionX + '/' + displayPositionY ) ;
    }

    //draws the star background images
    function drawBackground() {
        var xStart = -backgroundSize - ((currentMap.scroll.x / 4)  % backgroundSize);
        var xEnd = screenSize.width;
        var yStart = -backgroundSize - ((currentMap.scroll.y / 4)  % backgroundSize);
        var yEnd = screenSize.height;

        for (var x = xStart; x < xEnd; x += backgroundSize) {
            for (var y = yStart; y < yEnd; y += backgroundSize) {
                context.drawImage(mainObject.imageObjects[0].texture, x, y);
            }
        }
    }

    //draws the grid (if needed)
    function drawGrid() {
        context.beginPath();
        context.strokeStyle = "#202020";
        context.lineWidth = 0.5;

        var xStart = -currentMap.tileSize - (currentMap.scroll.x % currentMap.tileSize);
        var xEnd = screenSize.width + currentMap.tileSize;
        var yStart = -currentMap.tileSize - (currentMap.scroll.y % currentMap.tileSize);
        var yEnd = screenSize.height + currentMap.tileSize;

        //Helpers.Log('draw line:  xStart:' + xStart + ' - xEnd : ' + xEnd + '  yStart: ' + yStart + '  yEnd: ' + yEnd);
        for (var x = xStart; x < xEnd; x += currentMap.tileSize) {
            //Helpers.Log('draw line:  X:' + x);
            
            context.moveTo(x, yStart);
            context.lineTo(x, yEnd);

        }
        for (var y = yStart; y < yEnd; y += currentMap.tileSize) {
            //Helpers.Log('draw line:  y:' + y);            
            context.moveTo(xStart, y);
            context.lineTo(xEnd, y);

        }

        context.stroke();
        context.closePath();

        if (!(currentMap instanceof TilemapModule.StarMap)) return;

        context.beginPath();
        context.strokeStyle = "#404040";
        

        // 5113 -> 5110
        //xStart = -currentMap.tileSize - ((currentMap.scroll.x - (currentMap.scroll.x % 10)) % currentMap.tileSize);
        xStart =  - (currentMap.scroll.x % (currentMap.tileSize * 20));
        xEnd = screenSize.width + currentMap.tileSize;
        yStart =  - (currentMap.scroll.y % (currentMap.tileSize * 20));
        yEnd = screenSize.height + currentMap.tileSize;

        //Helpers.Log('draw line:  xStart:' + xStart + ' - xEnd : ' + xEnd + '  yStart: ' + yStart + '  yEnd: ' + yEnd);
        for (var x = xStart; x < xEnd; x += (currentMap.tileSize*20)) {
            //Helpers.Log('draw line:  X:' + x);

            context.moveTo(x, yStart);
            context.lineTo(x, yEnd);

        }
        for (var y = yStart; y < yEnd; y += (currentMap.tileSize*20)) {
            //Helpers.Log('draw line:  y:' + y);           
            context.moveTo(xStart, y);
            context.lineTo(xEnd, y);

        }

        context.stroke();
        context.closePath();
        context.lineWidth = 1;
    }

    //draws the border (if needed)
    function drawBorder() {
        var borderTopLeft = pixelToGrid(currentMap.scroll.x, currentMap.scroll.y);
        var borderbottomRight = pixelToGrid(currentMap.scroll.x + screenSize.width, currentMap.scroll.y + screenSize.height);

        if ((borderTopLeft.col > 0 && borderTopLeft.row > 0) && (borderbottomRight.col < 10000 && borderbottomRight.row < 10000))
            return;

        context.beginPath();
        context.strokeStyle = "#909090";
        context.strokeStyle = "#ffffff";

        context.lineWidth = 4;

        var xStart = 0;
        var xEnd = 0;
        var yStart = 0;
        var yEnd = 0;

        if (borderTopLeft.col < 1 || borderTopLeft.row < 1) {
            xStart = 0 - currentMap.scroll.x;
            xStart = Math.max(0, xStart);

            yStart = 0 - currentMap.scroll.y;
            yStart = Math.max(0, yStart);
        }


        if (borderbottomRight.col > 9999 || borderbottomRight.row > 9999) {
            xEnd = (10000 * currentMap.tileSize) - currentMap.scroll.x;
            xEnd = Math.min(screenSize.width, xEnd);

            yEnd = (10000 * currentMap.tileSize) - currentMap.scroll.y;
            yEnd = Math.min(screenSize.height, yEnd);
        }

        // draw up lines
        if (xStart == 0 && yStart != 0) {
            context.moveTo(0, yStart);
            context.lineTo(screenSize.width, yStart);
        }

        if (xStart != 0 && yStart == 0) {
            context.moveTo(xStart, 0);
            context.lineTo(xStart, screenSize.height);
        }

        if (xStart != 0 && yStart != 0) {
            context.moveTo(xStart, yStart);
            context.lineTo(screenSize.width, yStart);

            context.moveTo(xStart, yStart);
            context.lineTo(xStart, screenSize.height);
        }


        if (xEnd == screenSize.width && yEnd != screenSize.height) {
            context.moveTo(screenSize.width, yEnd);
            context.lineTo(0, yEnd);
        }

        if (xEnd != screenSize.width && yEnd == screenSize.height) {
            context.moveTo(xEnd, screenSize.height);
            context.lineTo(xEnd, 0);
        }

        if (xEnd != screenSize.width && yEnd != screenSize.height) {
            context.moveTo(xEnd, yEnd);
            context.lineTo(0, yEnd);

            context.moveTo(xEnd, yEnd);
            context.lineTo(xEnd, 0);
        }


        context.stroke();
        context.closePath();
        context.lineWidth = 1;
    }

    //draws a black box around the whole map
    function drawBlackSurrounding() {
        var borderTopLeft = pixelToGrid(currentMap.scroll.x, currentMap.scroll.y);
        var borderbottomRight = pixelToGrid(currentMap.scroll.x + canvas.width, currentMap.scroll.y + screenSize.height);

        if ((borderTopLeft.col > 0 && borderTopLeft.row > 0) && (borderbottomRight.col < currentMap.gridsize.cols && borderbottomRight.row < currentMap.gridsize.rows))
            return;

        //context.beginPath();
        context.fillStyle = "rgb(00, 00, 00)";
        //context.fillStyle = "rgba(255, 255, 255, 1)";

        //context.lineWidth = 4;

        var xStart = 0;
        var xEnd = 0;
        var yStart = 0;
        var yEnd = 0;


        //Helpers.Log('borderTopLeft: ' + borderTopLeft.col + '/' + borderTopLeft.row);
        //Helpers.Log('borderbottomRight: ' + borderbottomRight.col + '/' + borderbottomRight.row);
        if (borderTopLeft.row < 0) {
            //zeichne einen oder mehrere (bis zu drei) obere schwarze blöcke:

            if (borderTopLeft.col < 0) {
                //zeichne links oben:
                xEnd = -currentMap.scroll.x;
                yEnd = -currentMap.scroll.y + 1;
                //context.strokeRect(xStart, yStart, xEnd, yEnd);
                context.fillRect(xStart, yStart, xEnd, yEnd);
                //Helpers.Log('Draw Upper Left 0/0 bis ' + xEnd + "/" + yEnd);
            }

            if (borderbottomRight.col > currentMap.gridsize.cols) {
                //zeichne rechts oben
                xStart = (-currentMap.scroll.x) + (mainObject.parseInt(currentMap.gridsize.cols) + 1) * currentMap.tileSize;
                xEnd = canvas.width;
                yStart = 0
                yEnd = -currentMap.scroll.y + 1;
                context.fillRect(xStart, yStart, xEnd, yEnd);
                //Helpers.Log('Draw Upper Right ' + xStart + '/' + yStart + ' bis ' + xEnd + "/" + yEnd);
            }

            //zeichne Mitte Oben
            xStart = Math.max(0, (-currentMap.scroll.x));
            xEnd = Math.min(((-currentMap.scroll.x) + (mainObject.parseInt(currentMap.gridsize.cols)) * currentMap.tileSize), canvas.width);
            yEnd = -currentMap.scroll.y;
            context.fillRect(xStart, yStart, xEnd, yEnd);
            //Helpers.Log('Draw Upper ' + xStart + '/' + yStart + ' bis ' + xEnd + "/" + yEnd);
        }

        if (borderTopLeft.col < 0) {
            //zeichne linken Rand
            xStart = 0;
            yStart = Math.max(-currentMap.scroll.y, 0);   //endpunkt von links oben
            xEnd = -currentMap.scroll.x; //wie links oben
            yEnd = Math.min(((-currentMap.scroll.y) + (mainObject.parseInt(currentMap.gridsize.rows)) * currentMap.tileSize), canvas.height); // muss dort aufhören, wo links unten beginnt
            context.fillRect(xStart, yStart, xEnd, yEnd);
            //Helpers.Log('Draw LEFT ' + xStart + '/' + yStart + ' bis ' + xEnd + "/" + yEnd);
        }

        if (borderbottomRight.col > currentMap.gridsize.cols) {
            //zeichne rechts 
            xStart = (-currentMap.scroll.x) + (mainObject.parseInt(currentMap.gridsize.cols)) * currentMap.tileSize;
            xEnd = canvas.width;
            yStart = Math.max(-currentMap.scroll.y, 0); //endpunkt von rechts oben
            yEnd = Math.min(((-currentMap.scroll.y) + (mainObject.parseInt(currentMap.gridsize.rows)) * currentMap.tileSize), canvas.height); // wie rechter Rand  // muss dort aufhören, wo rechts unten beginnt
            context.fillRect(xStart, yStart, xEnd, yEnd);
            //Helpers.Log('Draw Right ' + xStart + '/' + yStart + ' bis ' + xEnd + "/" + yEnd);
        }
        if (borderbottomRight.row > currentMap.gridsize.rows) {

            if (borderTopLeft.col < 1) {
                //zeichne links unten:
                xStart = 0;
                yStart = Math.min(((-currentMap.scroll.y) + (mainObject.parseInt(currentMap.gridsize.rows)) * currentMap.tileSize), canvas.height);
                xEnd = -currentMap.scroll.x;
                yEnd = canvas.height;
                //context.strokeRect(xStart, yStart, xEnd, yEnd);
                context.fillRect(xStart, yStart, xEnd, yEnd);
                //Helpers.Log('Draw lower left ' + xStart + '/' + yStart + ' bis ' + xEnd + "/" + yEnd);
            }

            if (borderbottomRight.col > currentMap.gridsize.cols) {
                //zeichne rechts unten
                xStart = (-currentMap.scroll.x) + (mainObject.parseInt(currentMap.gridsize.cols)) * currentMap.tileSize;
                xEnd = canvas.width;
                yStart = Math.min(((-currentMap.scroll.y) + (mainObject.parseInt(currentMap.gridsize.rows)) * currentMap.tileSize), canvas.height);
                yEnd = canvas.height;
                context.fillRect(xStart, yStart, xEnd, yEnd);
                //Helpers.Log('Draw lower ' + xStart + '/' + yStart + ' bis ' + xEnd + "/" + yEnd);
            }


            //unten
            xStart = Math.max(0, (-currentMap.scroll.x));
            xEnd = Math.min(((-currentMap.scroll.x) + (mainObject.parseInt(currentMap.gridsize.cols)) * currentMap.tileSize), canvas.width);
            yStart = Math.min(((-currentMap.scroll.y) + (mainObject.parseInt(currentMap.gridsize.rows)) * currentMap.tileSize), canvas.height); //endpunkt von rechts oben
            yEnd = canvas.height; // wie rechter Rand  // muss dort aufhören, wo rechts unten beginnt
            context.fillRect(xStart, yStart, xEnd, yEnd);
            //Helpers.Log('Draw Bottom ' + xStart + '/' + yStart + ' bis ' + xEnd + "/" + yEnd);
        }
    }

    //draws a small border around the solar system view, indicating the area where one can enter hyperspace
    function drawSystemBorder() {
        var borderTopLeft = pixelToGrid(currentMap.scroll.x, currentMap.scroll.y);
        var borderbottomRight = pixelToGrid(currentMap.scroll.x + canvas.width, currentMap.scroll.y + screenSize.height);

        var displayPositionX = 0;
        var displayPositionY = 0;

        for (var x = 0; x < 24; x++) {
            displayPositionX = (currentMap.tileSize * x);
            displayPositionY = (currentMap.tileSize * -1);
            displayPositionX -= (currentMap.scroll.x);
            displayPositionY -= (currentMap.scroll.y);
            var z = mainObject.imageObjects[5641].canvasCache; //neutral - grey
            context.drawImage(z,
                displayPositionX, displayPositionY,
                currentMap.tileSize, currentMap.tileSize);

            displayPositionY = (currentMap.tileSize * 24);
            displayPositionY -= (currentMap.scroll.y);
            var z = mainObject.imageObjects[5640].canvasCache; //neutral - grey
            context.drawImage(z,
                displayPositionX, displayPositionY,
                currentMap.tileSize, currentMap.tileSize);
        }

        for (var y = 0; y < 24; y++) {
            displayPositionX = (currentMap.tileSize * -1);
            displayPositionY = (currentMap.tileSize * y);
            displayPositionX -= (currentMap.scroll.x);
            displayPositionY -= (currentMap.scroll.y);
            var z = mainObject.imageObjects[5643].canvasCache; //neutral - grey
            context.drawImage(z,
                displayPositionX, displayPositionY,
                currentMap.tileSize, currentMap.tileSize);

            displayPositionX = (currentMap.tileSize * 24);            
            displayPositionX -= (currentMap.scroll.x);            
            var z = mainObject.imageObjects[5642].canvasCache; //neutral - grey
            context.drawImage(z,
                displayPositionX, displayPositionY,
                currentMap.tileSize, currentMap.tileSize);
        }
        
        //UpperLeft corner ->
        displayPositionX = (currentMap.tileSize * -1);
        displayPositionY = (currentMap.tileSize * -1);
        displayPositionX -= (currentMap.scroll.x);
        displayPositionY -= (currentMap.scroll.y);
        var z = mainObject.imageObjects[5610].canvasCache; //neutral - grey
        context.drawImage(z,
            displayPositionX, displayPositionY,
            currentMap.tileSize, currentMap.tileSize);

        //Upper right corner ->
        displayPositionX = (currentMap.tileSize * 24);
        displayPositionY = (currentMap.tileSize * -1);
        displayPositionX -= (currentMap.scroll.x);
        displayPositionY -= (currentMap.scroll.y);
        var z = mainObject.imageObjects[5611].canvasCache; //neutral - grey
        context.drawImage(z,
            displayPositionX, displayPositionY,
            currentMap.tileSize, currentMap.tileSize);

        //Lower Left corner ->
        displayPositionX = (currentMap.tileSize * -1);
        displayPositionY = (currentMap.tileSize * 24);
        displayPositionX -= (currentMap.scroll.x);
        displayPositionY -= (currentMap.scroll.y);
        var z = mainObject.imageObjects[5612].canvasCache; //neutral - grey
        context.drawImage(z,
            displayPositionX, displayPositionY,
            currentMap.tileSize, currentMap.tileSize);

        //Lower right corner ->
        displayPositionX = (currentMap.tileSize * 24);
        displayPositionY = (currentMap.tileSize * 24);
        displayPositionX -= (currentMap.scroll.x);
        displayPositionY -= (currentMap.scroll.y);
        var z = mainObject.imageObjects[5613].canvasCache; //neutral - grey
        context.drawImage(z,
            displayPositionX, displayPositionY,
            currentMap.tileSize, currentMap.tileSize);

    }


    export function checkScrollEnabling() {
        return true;
       /*
        if (canvas.width < (currentMap.gridsize.cols * currentMap.tileSize))
            isScrollXEnabled = true;
        else
            isScrollXEnabled = false;

        if (canvas.height < (currentMap.gridsize.rows * currentMap.tileSize))
            isScrollYEnabled = true;
        else
            isScrollYEnabled = false;
      */
    }


    export function checkSrollOutOfBounds() {
        
        var halfScreenWidth = canvas.width / 2;
        var halfScreenHeight = canvas.height / 2;
        var lowerBoundX = -halfScreenWidth;
        var lowerBoundY = -halfScreenHeight;
        var colWidth = (mainObject.parseInt(currentMap.gridsize.cols) * currentMap.tileSize) - halfScreenWidth + 20;
        var rowDepth = (mainObject.parseInt(currentMap.gridsize.rows) * currentMap.tileSize) - halfScreenHeight + 20;
        if (isScrollXEnabled) {
            if (currentMap.scroll.x < lowerBoundX)
                currentMap.scroll.x = lowerBoundX;
            if (currentMap.scroll.x > colWidth)
                currentMap.scroll.x = colWidth;
        }
        if (isScrollYEnabled) {
            if (currentMap.scroll.y < lowerBoundY)
                currentMap.scroll.y = lowerBoundY;
            if (currentMap.scroll.y > rowDepth)
                currentMap.scroll.y = rowDepth;
        }
    }

    //is called by a event, so no this...
    export function doResize() {
        initInterface();
        DrawInterface.getCanvas().width = getSize().width;
        DrawInterface.getCanvas().height = getSize().height;
        DrawInterface.checkScrollEnabling();

        FogCanvas.width = canvas.width;
        FogCanvas.height = canvas.height;
        

        //DrawInterface.checkMapSizeScroll();
        DrawInterface.drawAll();
    }

    export function showContextMenu() {
        Helpers.Log('showContextMenu');
    }

    export function scrollToHomePosition() {
        galaxyMap.loadAndSwitchThisMap();
        DrawInterface.scrollToPosition(mainObject.user.homePosition.col, mainObject.user.homePosition.row);
    }

    export function scrollToPosition(destinationX, destinationY, offset = 0) {
        currentMap.scroll.x = (destinationX * currentMap.tileSize) - (getSize().width / 2);
        currentMap.scroll.y = (destinationY * currentMap.tileSize) - (getSize().height / 2);

        currentMap.scroll.x -= (offset / 2);

        DrawInterface.drawAll();
    }

    export function scrollMapToPosition(map : TilemapModule.Tilemap, destinationX, destinationY, offset = 0) {
        map.scroll.x = (destinationX * map.tileSize) - (getSize().width / 2);
        map.scroll.y = (destinationY * map.tileSize) - (getSize().height / 2);
        map.scroll.x -= (offset / 2);
    }

    // checks if the map is smaller than the sreen size - it has to be centered then:
    // only for colonies
    export function checkMapSizeScroll() {
        Helpers.Log("checkMapSizeScroll");
        
        var oldXCenter = (currentMap.scroll.x + (canvas.width / 2)) / currentMap.tileSize;
        var oldYCenter = (currentMap.scroll.y + (canvas.height / 2)) / currentMap.tileSize;

        var newXCenter = oldXCenter;
        var newYCenter = oldYCenter;
        if (currentMap.gridsize.cols * currentMap.tileSize < canvas.width)
            newXCenter = Math.round(currentMap.gridsize.cols / 2);
        if (currentMap.gridsize.rows * currentMap.tileSize < canvas.height)
            newYCenter = Math.round(currentMap.gridsize.rows / 2);

        //Helpers.Log("oldXCenter: " + oldXCenter + " oldYCenter: " + oldYCenter + " newXCenter: " + newXCenter + " newYCenter: " + newYCenter);

        if (newXCenter != oldXCenter || newYCenter != oldYCenter)
            DrawInterface.scrollToPosition(newXCenter, newYCenter);
        
    }

    export function refreshNavigationBar(areaSpecification: AreaSpecifications) {
        var referenceToArea = areaSpecification;
        var returnHTML = "";
        var currentAreaHTML = "";
        var parentExists = true;
        var counter = 0;

        $("#NavigationBar").empty()

        var ul = $("<ul/>");
        var areaName = referenceToArea.name;
        if (areaSpecification instanceof PlanetData)
        {           
            if ((<PlanetData>areaSpecification).colony != null) areaName = (<PlanetData>areaSpecification).colony.name;
        }
        //var li = $("<li/>", { "id": "liId" + counter, "text": areaName, "class": "ui-state-active" });
        var li = $("<button/>", { "id": "liId" + counter, "text": areaName, "class": "ui-state-default" });
        navigationEvent(li, referenceToArea);
        //ul.append(li);
        $("#NavigationBar").append(li);

        while (referenceToArea.parentArea != null) {
            counter++;
            referenceToArea = referenceToArea.parentArea;
            //var parentLi = $("<button/>", { "id": "liId" + counter, "text": i18n.label(393) + referenceToArea.name, "class": "ui-state-default" });
            
            var parentLi = $("<button/>", { "id": "liId" + counter, "text":  referenceToArea.name, "class": "ui-state-default" });
            navigationEvent(parentLi, referenceToArea); 
            //ul.prepend(parentLi);
            $("#NavigationBar").prepend(parentLi);
        }

        //$("#NavigationBar").empty().append(ul);
        $("#NavigationBar").css("display", "block");
    }

    export function deselectObject() {
        document.getElementById('toolTrade').style.display = 'none';
        document.getElementById('toolTransfer').style.display = 'none';
        document.getElementById('rotate').style.display = 'none';
        document.getElementById('demolish').style.display = 'none'; 
        document.getElementById('createSpaceStation').style.display = 'none';   //create space station   
        document.getElementById('addTranscendence').style.display = 'none';   //add to Transcendence constuct
        document.getElementById('attackTarget').style.display = 'none';
        document.getElementById('design').style.display = 'none';
        document.getElementById('sentry').style.display = 'none';
        document.getElementById('continue').style.display = 'none';
    }

    export function switchToArea(areaSpecification: AreaSpecifications) {     
        Helpers.Log("switchToArea"); 
        if (currentMap === areaSpecification.tilemap) return;
        deselectObject();

        areaSpecification.switchInterfaceToThisMap();
        areaSpecification instanceof PlanetData ?
            PanelController.showInfoPanel(PanelController.PanelChoice.Colony) :
            PanelController.showInfoPanel(PanelController.PanelChoice.Canvas);       
    }

    function navigationEvent(liElement: JQuery, areaSpecification: AreaSpecifications) {
        
        liElement.click(function () {
            mainObject.deselectObject();
            DrawInterface.switchToArea(areaSpecification);            
        });
    }

    function refreshInfoList() {
        if (mainObject.currentShip != undefined && mainObject.currentShip != null) {
            var shipListInnerHTML = '<table>';

            var tile = mainObject.currentShip.parentArea.tilemap.map[mainObject.parseInt(mainObject.currentShip.colRow.col)][mainObject.parseInt(mainObject.currentShip.colRow.row)];
            for (var i = 0; i < tile.ships.length; i++) {
                if (tile.ships[i] != undefined && tile.ships[i] != null) {
                    shipListInnerHTML += '<tr><td>';
                    shipListInnerHTML += tile.ships[i].id + '</td><td>' + tile.ships[i].name + '</td><td>' + tile.ships[i].owner + '</td></tr>';
                }
            }
            shipListInnerHTML += '</table>';
            document.getElementById('quickInfoList').innerHTML = shipListInnerHTML;
            return;
        }


        document.getElementById('quickInfoList').innerHTML = '';
    }

    //shows the middle Area with the ships that are on the same tile as the selected ship
    export function refreshMiddleInfoPanel() {

        var shipList = $("#quickInfoDetails");
        //shipList.css("overflow-y", "auto");
        shipList.empty();


        if (mainObject.currentShip != null || mainObject.currentColony != null || mainObject.selectedObject != null) {
            var ownShipBorder = 'thin solid green"';
            var enemyShipBorder = 'thin solid red"';
            var selectedShipBorder = 'thin solid blue';

            var tile: Tile = null;

            if (mainObject.currentShip != null)
                tile = mainObject.currentShip.parentArea.tilemap.map[mainObject.parseInt(mainObject.currentShip.colRow.col)][mainObject.parseInt(mainObject.currentShip.colRow.row)];

            if (mainObject.currentColony != null)
                tile = mainObject.currentColony.planetArea.parentArea.tilemap.map[mainObject.parseInt(mainObject.currentColony.planetArea.colRow.col)][mainObject.parseInt(mainObject.currentColony.planetArea.colRow.row)];

            if (mainObject.selectedObject != null)
                tile = mainObject.selectedObject.parentArea.tilemap.map[mainObject.parseInt(mainObject.selectedObject.colRow.col)][mainObject.parseInt(mainObject.selectedObject.colRow.row)];

            //fetch all Fleets:
            var FleetIds: number[] = [];
            for (var i = 0; i < tile.ships.length; i++) {
                if (tile.ships[i] != undefined && tile.ships[i] != null) {
                    if (tile.ships[i].Fleet != null) {
                        FleetIds[tile.ships[i].Fleet.FleetId] = 1;
                    }
                }
            }

            //Draw all Fleets:
            for (var j = 0; j < FleetIds.length; j++) {
                if (FleetIds[j] != undefined && FleetIds[j] != null) {
                    var FleetDiv = $("<div/>", {"class":"Fleet"});
                    for (var i = 0; i < Ships.Fleets[j].FleetShips.length; i++) {
                        if (Ships.Fleets[j].FleetShips[i] != undefined && Ships.Fleets[j].FleetShips[i] != null) {                            
                            var shipDiv = createShipDiv(Ships.Fleets[j].FleetShips[i]);
                            FleetDiv.append(shipDiv);
                            Ships.Fleets[j].FleetShips[i].toolTip(shipDiv);
                        }
                    }
                    shipList.append(FleetDiv);
                }
            } 

            //fetch all non fleet ships
            for (var i = 0; i < tile.ships.length; i++) {
                if (tile.ships[i] != undefined && tile.ships[i] != null) {
                    if (tile.ships[i].Fleet != null) continue;
                    var shipDiv = createShipDiv(tile.ships[i]);
                    shipList.append(shipDiv);        
                    tile.ships[i].toolTip(shipDiv);    
                    //console.log("tile.ships[i] " + tile.ships[i].id.toString() );

                }
            }

            shipList.droppable({              
                "accept": ":not(.ui-sortable-helper)",
                "drop": (event, ui) => {
                    Helpers.Log("outerShip.droppable 1");
                    event.stopPropagation();
                    DroppedShipOnPanel(event, ui);

                }
            });


            
            if (tile.astronomicalObject != null) {
                if (tile.astronomicalObject instanceof PlanetData) {
                    var planet: PlanetData = <PlanetData> tile.astronomicalObject;
                    if (planet.colony != null) {
                        var outerColony = $("<div/>", { "class": "OuterShipListDiv" });
                        var innerColony = $("<div/>", { "class": "ShipListDiv" });

                        var colonyImage = $("<img/>", { src: mainObject.imageObjects[planet.typeId].texture.src, alt: "goods", width: "30px", height: "30px" });

                        colonyImage.bind("mousedown touchstart", function (e) { e.stopPropagation(); DrawInterface.clickOnColony(planet.colony); });
                        if (planet.colony.owner == mainObject.user.id)
                            colonyImage.css('border', ownShipBorder);
                        else
                            colonyImage.css('border', enemyShipBorder);

                        innerColony.append(colonyImage);
                        outerColony.append(innerColony);
                        shipList.append(outerColony);   
                        
                                             
                    }
                }                
            }
            
            return;
        }        

    }

    //shows the middle Area with the ships that are on the same tile as the selected ship
   
    export function clickOnColony(colony: ColonyModule.Colony) {
        if (mainObject.currentShip != null) mainObject.deselectShip();

        if (colony.owner === mainObject.user.id) {
            colony.planetArea.loadAndSwitchThisMap();
            //tile.stars.loadAndSwitchThisMap();
        }
        else {
            mainObject.selectedObject = colony;
            PanelController.showInfoPanel(PanelController.PanelChoice.Ship);
            mainObject.selectedObject.refreshMainScreenPanels();
        }
    }

    export var ShipToFleetDrag: Ships.Ship = null;

    function DotCargoColour(ship: Ships.Ship): string {
        return ship.cargoHoldUsed() > 0 ? "white" : "black";
    }

    function DotHyperColour(ship: Ships.Ship): string {
        if (Math.floor(ship.starMoves) == Math.floor( ship.galaxyMovesMax)) return "hsl(200,100%,50%)"; //blue

        if (ship.starMoves > ship.galaxyMovesMax / 4) return "hsl(60,100%,70%)"; //yellow

        return "hsl(0,100%,60%)"; //red

        //return "hsl(120,100%,60%)"; //green
    }

    function DotSystemColour(ship: Ships.Ship): string {

        
        if (Math.floor(ship.sytemMoves) == Math.floor( ship.systemMovesMax)) return "hsl(200,100%,50%)"; //blue

        if (ship.sytemMoves > ship.systemMovesMax / 4) return "hsl(60,100%,70%)"; //yellow

        return "hsl(0,100%,60%)"; //red
    }

    function HealthbarWidth(ship: Ships.Ship): number {

        if (ship.currentHitpoints == ship.hitpoints) return 24;

        //Make a bar, but not wider than 22 px , since one has to see that the ship  is damaged
        return Math.min(Math.ceil((ship.currentHitpoints / ship.hitpoints) * 24),22);
    }

    function MakeShipWithDataDiv(ship: Ships.Ship, dots = true, name = true, bar = true, border = true): JQuery {
        var ShipContainer = $("<div/>", { "class": "ShipContainer" });
        var shipImage = $("<img/>", { src: ship.objectType.texture.src, alt: "ship" });

        if (border && ship.shipBorderStyle() != '') {
            ShipContainer.css('border', ship.shipBorderStyle());
        }

        //Add dots
        var DotCargo = $("<div/>", { "class": "dot cargo" });
        DotCargo.css("border-color", DotCargoColour(ship));
        var DotHyper = $("<div/>", { "class": "dot hyper" });
        DotHyper.css("border-color", DotHyperColour(ship));
        var DotSystem = $("<div/>", { "class": "dot system" });
        DotSystem.css("border-color", DotSystemColour(ship));
        

        //Add Name
        var ShipName = $("<div/>", { "class": "name", "text": ship.tagFreeName.label() });
        
        //Add health-bar
        var HealthBar = $("<div/>", { "class": "bar damage" });
        var BarLife = $("<div/>", { "class": "bar life",  });
        BarLife.css("width", HealthbarWidth(ship).toString() + "px");
        
        HealthBar.append(BarLife);
        
        

        ShipContainer.append(shipImage);  
        dots && ShipContainer.append(DotCargo);
        dots && ship.galaxyMovesMax && ShipContainer.append(DotHyper);
        dots && ship.systemMovesMax && ShipContainer.append(DotSystem);
        name && ShipContainer.append(ShipName);
        bar  && ShipContainer.append(HealthBar);
        

        return ShipContainer;
    }

    export function createShipDiv(ship: Ships.Ship, dots = true, name = true, bar = true, border = true): JQuery {
        var selectedShipBorder = 'thin solid blue';

        var outerShip = $("<div/>", { "class": "OuterShipListDiv ui-widget-content" });
        outerShip.attr('title', ship.name.label()); 
        var innerShip = $("<div/>", { "class": "ShipListDiv" } );

        if (mainObject.currentShip != null && ship.id == mainObject.currentShip.id) {
            outerShip.css('border', selectedShipBorder);
        }
      

        innerShip.append(MakeShipWithDataDiv(ship, dots, name, bar, border));  

        //append a target sign if ship is targeted
        if (ship.Targeted) {
            var TargetImage = $("<img/>", { src: mainObject.imageObjects[490].texture.src, alt: "goods", width: "30px", height: "30px" });
            TargetImage.css("position", "absolute");
            TargetImage.css("left", "0px");
            innerShip.append(TargetImage);  
        }
              
        outerShip.append(innerShip);
        outerShip.bind("mousedown touchstart", function (e) { e.stopPropagation(); mainObject.ships[ship.id].selectAndCenter(); });
        outerShip.draggable({
            "start": function () {
                Helpers.Log("goodsDiv.draggable ID " + ship.id);
                DrawInterface.ShipToFleetDrag = ship;             
            },           

            "appendTo": $('#quickInfoDetails'),
            "containment": "parent",
            "helper": "clone",
            "cursorAt": { left: 20, top: 20 }
        });


        outerShip.droppable({
            "activeClass": "ui-state-default",
            "hoverClass": "ui-state-hover",
            "accept": ":not(.ui-sortable-helper)",
            "greedy": true,
            "drop": (event, ui) => {
                Helpers.Log("outerShip.droppable 1");
                event.stopPropagation();
                DroppedShipOnShip(event, ui);

            }
        });
        outerShip.data("shipId", ship.id);
              
        return outerShip;
    }

    export function DroppedShipOnShip(event, ui) {
        var target = event.target;
        var targetId : number = $(target).data("shipId");
        var targetShip = mainObject.shipFind(targetId);

        if (DrawInterface.ShipToFleetDrag.id == targetShip.id) return;


        Helpers.Log("dragging " + DrawInterface.ShipToFleetDrag.id + " to " + targetShip.id);

        if (ShipToFleetDrag.Fleet != null) ShipToFleetDrag.Fleet.RemoveShip(ShipToFleetDrag);
        if (targetShip.Fleet != null) {
            targetShip.Fleet.AddShip(ShipToFleetDrag)
        } else {
            var NewFleet = Ships.MakeFleet(true, targetShip, ShipToFleetDrag);
        }

        refreshMiddleInfoPanel();
    }

    export function DroppedShipOnPanel(event, ui) {

        Helpers.Log("dropped on panel " + DrawInterface.ShipToFleetDrag.id);

        if (DrawInterface.ShipToFleetDrag.Fleet) DrawInterface.ShipToFleetDrag.Fleet.RemoveShip(ShipToFleetDrag);

        refreshMiddleInfoPanel();
    }

    export function createSurfaceFieldDiv(surfaceTile: BaseDataModule.SurfaceTile): JQuery {
        //var goodsDiv = $("<div/>", { "class": "goodsBorderBlack", title: surfaceTile.name });
        var goodsDiv = $("<div/>", { "class": "goodsBorderBlack", title: i18n.label(surfaceTile.label) });

        var imageSource = mainObject.imageObjects[surfaceTile.objectId].texture.src;
        //goodsDiv.append($("<img/>", { src: imageSource, width: "30px", height: "30px", alt: "BLAH", "class": "ui-corner-all" }));
        goodsDiv.append($("<img/>", { src: imageSource, style:"width:30px" }));
        //goodsDiv.tooltip();
        return goodsDiv;
    }



    export function createGoodsTd(goodId: number, amount: number, borderColor?: string, signs?: boolean, showAmount: boolean = true, colored:boolean = true): JQuery {
        var goodsTd = $("<td/>");
        goodsTd.append(createGoodsDiv(goodId, amount, borderColor, signs, showAmount));        

        if (colored && mainObject.goods[goodId].goodsType == 2) {            
            var Shipmodule = BaseDataModule.getModuleByGoodsId(goodId);
            if (Shipmodule) {
                goodsTd.addClass("ModuleLevelBg" + Shipmodule.level.toString());
            }
        }


        return goodsTd;
    }

    export function createGoodsDiv(goodId: number, amount: number, borderColor?: string, signs?: boolean, showAmount: boolean = true, colored : boolean = true): JQuery {
        var amountStr = amount.toString();

        var goodsDiv = createGoodsImageDiv(goodId);
        if (borderColor !== undefined && borderColor !== null)
            goodsDiv.addClass(borderColor);

        if (showAmount !== undefined && showAmount !== null && showAmount)
            goodsDiv.append($("<div/>", { "class": "goodsAmount", text: amountStr }));       

        if (colored && mainObject.goods[goodId].goodsType == 2) {
            var Shipmodule = BaseDataModule.getModuleByGoodsId(goodId);
            if (Shipmodule) {
                goodsDiv.addClass("ModuleLevelBg" + Shipmodule.level.toString());
            }
        }

        return goodsDiv;
    }    

    export function createGoodsImageDiv(goodId: number): JQuery {       
        var goodsDiv = $("<div/>", { "class": "goodsBorderBlack", "title": i18n.label(mainObject.goods[goodId].label) });        
        var imageSource = mainObject.imageObjects[mainObject.goods[goodId].goodsObjectId].texture.src;       
        //goodsDiv.append($("<img/>", { src: imageSource, "width": "30px" }));
        goodsDiv.append($("<img/>", { src: imageSource }));                 
        return goodsDiv;
    }  

    export function createBar(background = 'linear-gradient(to bottom, #77bb00 0%, #709000 100%)'): JQuery {

        var cargobar = $('<div/>', { "class": "interfaceCreatedToolbar" });

        cargobar.progressbar();
        cargobar.progressbar("option", "value", 25);

        cargobar.find(".ui-progressbar-value").css({
            //"background": '#' + Math.floor(Math.random() * 16777215).toString(16)
            //"background": '#00FF00'
            "background": background
        });        

        return cargobar;
    }

    export function createTextBar(LeftText: string, RightText: string, Progress: number, background = 'linear-gradient(to bottom, #77bb00 0%, #709000 100%)'): JQuery {

        var InfluenceBar: JQuery;
        InfluenceBar = mainInterface.createBar(background);
        InfluenceBar.addClass("ProgressBar");

        //create left and right labels
        var LeftTextJQ = $('<div>', { text: LeftText, "class": "progress-label" });
        InfluenceBar.append(LeftTextJQ);
        var RightTextJQ = $('<div>', { text: RightText, "class": "progress-label" });
        RightTextJQ.css("right", "4px");
        InfluenceBar.append(RightTextJQ);

        //create and append the influence bar
        InfluenceBar.progressbar("option", {
            value: Progress
        });

        return InfluenceBar;
    }


    export function cargoHoldUsed(goodsCount : number, cargoRoom : number ): number {
               
        if (goodsCount <= 0) return 0;
        if (cargoRoom === -1) return 100;
        if (goodsCount > cargoRoom) { /*Helpers.Log('WARNING : Cargo > maxCargo');*/ return 100; }
        goodsCount = Math.floor((goodsCount / cargoRoom) * 100);
        return goodsCount;
    }

    export function createCargoHoldBar(trunk: SpaceObject, isTradebar = false): JQuery {        

        var LeftTextStr = "";
        var RightTextStr = trunk.countCargo(isTradebar) + '/' + trunk.cargoroom;
        var Progress = trunk.cargoHoldUsed(isTradebar);
        var InfluenceBar2 = mainInterface.createTextBar(LeftTextStr, RightTextStr, Progress);
        return InfluenceBar2;
    }    

    //redraws the current open QuickInfo-Panel (bootem right)
    /*
    export function refreshQuickInfo() {
        switch (PanelController.quickInfoPanel) {
            case PanelController.QuickInfoChoice.Goods:
                refreshQuickInfoGoods();
                break;
            case PanelController.QuickInfoChoice.Modules:
                refreshQuickInfoModules();
                break;
        }
    }
    */

    export function refreshMainScreenStatistics() {

        if (mainObject.currentColony != null)
            mainObject.currentColony.refreshMainScreenStatistics();

        if (mainObject.currentShip != null)
            Ships.UserInterface.refreshMainScreenStatistics(mainObject.currentShip);
    }

    export function tooltipGoods(goodsDiv: JQuery, goodsId:number,  buildingAmount : number[],  total :number , colony : ColonyModule.Colony) {
        var assemblyTooltip = $("<div/>");
        /*
        Building material
        5 Building material plant (10 * 130%) : 65       
        */

        /*
        Holmium Laser
        Occupied storage space per unit: 5
        */
        assemblyTooltip.append($('<span>', { text: i18n.label(mainObject.goods[goodsId].label) }));

        if (colony != null) {
            var currentModifier = colony.GoodsModifier(goodsId);
            for (var i = 0; i < buildingAmount.length; i++) {
                if (buildingAmount[i] == null) continue;
                assemblyTooltip.append($('<br>'));

                var building = mainObject.buildings[i];
                var buildingTotal = buildingAmount[i] * (colony.applyModifier(building.production[goodsId], currentModifier));
                var modText = buildingAmount[i].toString() + ' ' + i18n.label(building.label) + ' (' + building.production[goodsId] + ' * ' + (currentModifier * 100).toFixed(0) + '%) : ' + buildingTotal.toFixed(0);
                assemblyTooltip.append($('<span>', { text: modText }));
            }

            if (goodsId == 2) {
                assemblyTooltip.append($('<br>'));
                var change = -(Math.floor(colony.population / 100000000));
                assemblyTooltip.append($('<span>', { text: i18n.label(156) + ' : ' + change.toString() }));

            }
        }

        var Good = mainObject.goods[goodsId];
        if (Good.goodsType == 2) {
            assemblyTooltip.append($('<br>'));
            assemblyTooltip.append($('<span>', { text: i18n.label(979).format(Good.Size().toString() )}));
        }


        goodsDiv.tooltip({ content: function () { return assemblyTooltip.html(); } });

    }


    export function refreshQuickInfoGoods() {
        //PanelController.quickInfoPanel = PanelController.QuickInfoChoice.Goods;

        var trunk: SpaceObject; //the object which has goods to show
        var WithChange: boolean = false;
        var productionAndComsumption: number[] = [];
        var toolTipData: number[][] = [];
        //get the current object
        if (mainObject.currentArea != null && mainObject.currentArea instanceof PlanetData && (<PlanetData>mainObject.currentArea).colony != null) {
            trunk = (<PlanetData>mainObject.currentArea).colony;
            productionAndComsumption = (<PlanetData>mainObject.currentArea).colony.goodsChange;
            toolTipData = (<PlanetData>mainObject.currentArea).colony.goodsChangeBuildingCount;
            WithChange = true;
        }
        else {
            if (mainObject.currentShip != undefined && mainObject.currentShip != null) {
                trunk = mainObject.currentShip;
            } else {

                if (mainObject.currentArea != null && mainObject.currentArea instanceof StarData && mainObject.selectedObject instanceof ColonyModule.Colony) {
                    trunk = mainObject.selectedObject;                    
                }
            }
        }


        var buildingCosts: number[] = [];
        var showBuildingCosts = (mainObject.selectedBuilding != null ? true : false) && (mainObject.currentShip == null);
        if (showBuildingCosts) {
            for (var i = 0; i < mainObject.buildings[mainObject.selectedBuilding].costs.length; i++) {
                if (mainObject.buildings[mainObject.selectedBuilding].costs[i] != null)
                    buildingCosts[i] = 1;
            }
        }
      
        if (trunk === undefined) return;

        var trunkAndProduction: number[] = []; // sparse array that contains a flag for each good from trunk, and all goods that wil be produced are consumed 

        for (var i = 0; i < trunk.goods.length; i++) {
            if (trunk.goods[i] == null || trunk.goods[i] == 0) continue;
            if (mainObject.goods[i] == null) continue; //should never occur...
            if (mainObject.goods[i].goodsType == 3) continue;
            trunkAndProduction[i] = 1;
        }
        if (productionAndComsumption.length > 0) {
            for (var i = 0; i < productionAndComsumption.length; i++) {
                if (productionAndComsumption[i] == null || productionAndComsumption[i] == 0) continue;
                if (mainObject.goods[i] == null) continue; //should never occur...
                if (mainObject.goods[i].goodsType == 3) continue;
                trunkAndProduction[i] = 1;
            }
        }

        //empty and construct the goods area:
        var quickInfo = $("#quickInfo");
        quickInfo.empty();       
        quickInfo.append(createCargoHoldBar(trunk));
       
        var goodsOverflow = $("<div/>");
        goodsOverflow.addClass("goodsOverflow");
        //goodsOverflow.css("overflow-y", "auto");
        //goodsOverflow.css("height", "130px");

        var goodsContainer = $("<div/>");
        
        quickInfo.append(goodsOverflow);
        goodsOverflow.append(goodsContainer);
        
        for (var currentGoodsIndex = 0; currentGoodsIndex < mainObject.goods.length; currentGoodsIndex++) {
            if (trunkAndProduction[currentGoodsIndex] == null && transferPanel.TransferredGoods[currentGoodsIndex] == null) continue;

            var amountInStore = 0;
            if (trunk.goods[currentGoodsIndex] != null) amountInStore = trunk.goods[currentGoodsIndex];
            amountInStore -= transferPanel.PendingTransfer(currentGoodsIndex);

            var currentGoodsDiv = createGoodsDiv(currentGoodsIndex, amountInStore);
            currentGoodsDiv.css("display", "inline-block");
            currentGoodsDiv.css("margin", "2px");
            currentGoodsDiv.css("vertical-align", "middle");

            if (WithChange) $(".goodsAmount", currentGoodsDiv).addClass("WithChange");

            //show the costs of the currently selected building
            if (showBuildingCosts) {
                if (buildingCosts[currentGoodsIndex] === 1) {
                    var x = $(".goodsAmount", currentGoodsDiv).text();
                    //Helpers.Log("x = $(.goodsAmount, currentGoodsTd).text(); -> " + x);

                    $(".goodsAmount", currentGoodsDiv).text(x + " - " + mainObject.buildings[mainObject.selectedBuilding].costs[currentGoodsIndex]);
                }
                buildingCosts[currentGoodsIndex] = 2;
            }

            if (productionAndComsumption.length > 0 && productionAndComsumption[currentGoodsIndex] != null) {
                var x = $(".goodsAmount", currentGoodsDiv).text();

                $(".goodsAmount", currentGoodsDiv).empty();
                $(".goodsAmount", currentGoodsDiv).append($("<span/>", { "text": x }));
                $(".goodsAmount", currentGoodsDiv).append($("<br>"));
                var changetext = productionAndComsumption[currentGoodsIndex] > 0 ? "+" : "";
                changetext += productionAndComsumption[currentGoodsIndex].toString();
                var textColorClass = "noChange";
                if (productionAndComsumption[currentGoodsIndex] > 0) { textColorClass = "positiveChange"; }
                if (productionAndComsumption[currentGoodsIndex] < 0) { textColorClass = "negativeChange"; }

                $(".goodsAmount", currentGoodsDiv).append($("<span/>", { "class": textColorClass, "text": changetext }));

                if (toolTipData[currentGoodsIndex] != null) {
                    tooltipGoods(currentGoodsDiv, currentGoodsIndex, toolTipData[currentGoodsIndex], productionAndComsumption[currentGoodsIndex], (<PlanetData>mainObject.currentArea).colony);
                }
            }
            else {
                tooltipGoods(currentGoodsDiv, currentGoodsIndex, toolTipData[currentGoodsIndex], null, null);
            }

            var ci = currentGoodsIndex;
            transferPanel.BindSenderGoodClick(ci, currentGoodsDiv);
            

            goodsContainer.append(currentGoodsDiv);
        }
        
        return;
    }

    export function addQuickMessage(textToShow: string, delayTime = 12000, countdown = false, overallTime = 2 * 60 * 1000) {

        
        var liNode = $("<li>", { text: textToShow });
        liNode.html(textToShow);
        $("#quickMessage").append(liNode);
        liNode.delay(delayTime).fadeOut(3000, function () { $(this).remove(); });

        //spam server restart messages:
        var timerSeconds = overallTime / 1000;
        if (countdown && overallTime > 0) {
            liNode.text(textToShow + timerSeconds.toString() + " seconds");
            setTimeout(function () { addQuickMessage(textToShow, delayTime, countdown, overallTime - 1000); }, 1000);
            
            //addQuickMessage(textToShow, delayTime -1000 , countdown);
            //setInterval( ()=>{ liNode.text(textToShow + timerSeconds.toString() + " seconds"); }, 1000);            
        }

    }


    export function HideLoader(time: number = 500) {
        setTimeout(function () { $('#loader')[0].style.display = 'none'; }, time);        
    }

    /*
    export function refreshQuickInfoModules() {
        PanelController.quickInfoPanel = PanelController.QuickInfoChoice.Modules;
        var trunk: SpaceObject; //the object which has goods to show

        //get the current object
        if (mainObject.currentArea != null && mainObject.currentArea instanceof PlanetData && (<PlanetData>mainObject.currentArea).colony != null) {
            trunk = (<PlanetData>mainObject.currentArea).colony;
        }
        else {
            if (mainObject.currentShip != undefined && mainObject.currentShip != null) {
                trunk = mainObject.currentShip;
            }
        }

        if (trunk !== undefined) {

            var goodsTable = $("<table/>");
            var currentGoodsIndex = 0; // needed as index in the for-loop   
            // OLD: a bit complicated, because we do not know in advance how many lines there will be in the table
            //ToDO: Use goodsDiv.css("display", "inline-block"), see ShipTemplateDesigner , goodsTable()
            while (true) {
                if (currentGoodsIndex == trunk.goods.length) break;
                var currentGoodsFound = 0; //just needed to create a new line after 

                var goodsTr = $("<tr/>");
                for (; currentGoodsIndex < trunk.goods.length; currentGoodsIndex++) {
                    if (trunk.goods[currentGoodsIndex] == null || trunk.goods[currentGoodsIndex] == 0) continue;
                    if (mainObject.goods[currentGoodsIndex] == null) continue; //should never occur...
                    if (mainObject.goods[currentGoodsIndex].goodsType == 3) continue;

                    goodsTr.append(createGoodsTd(currentGoodsIndex, trunk.goods[currentGoodsIndex]));

                    currentGoodsFound++;
                    if (currentGoodsFound % 4 == 0) { currentGoodsIndex++; break; } //jump into the while
                }
                goodsTable.append(goodsTr);
            }

            $("#quickInfo").empty().append(goodsTable);
            return;
        }
    }
    */
    
}