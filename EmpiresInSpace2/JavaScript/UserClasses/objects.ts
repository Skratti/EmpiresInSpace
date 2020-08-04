
//spaceObject is the superClass of : Stars, ships, Planets, Spacestations, anomalies,
//each has a name, a reference to an image-Object, a position, an owner (yes - also stars can have an owner - does just need a few additional parts that have to be implemented yet...)
//the type will be defined by the subClass the object belongs to...
class SpaceObject {
    id = 0;
    name = 'Nameless';
    typeId = 4;        //typeId references objecttTypes (imageObject)    
    ImageId: number = null; //ImageId references ObjectDescription (imageObject)    
    Image: BaseDataModule.ObjectImage = null;
    owner = 0;
    colRow = { col: 1, row: 1 };
    parentArea : AreaSpecifications; //the area containing this object. object is placed on a tile of the tilemap of this area...

    goods : number[] = []; // goodsId - Amount ToDo->Should be moved to ShipModule.Ships and so on...
    cargoroom: number = -1; // -1 means it can contain cargo, but no new cargo may be moved onto it
    /*
    constructor(col: number, row: number) {     
        this.colRow.col = col;
        this.colRow.row = row;
    }
    */

    

    select() {
        mainObject.selectedObject = this;
        mainObject.currentShip = null;
        mainObject.currentColony = null;

        PanelController.showInfoPanel(PanelController.PanelChoice.Ship);      
        
        //set object related buttons

        //refresh object statistics?

        //click object Quests?
        //for (var i = 0; i < QuestModule.inspectShipQuests.length; i++) {
        //    QuestModule.inspectShipQuests[i](ship, i);
        //}
    }



    getCurrentTile():Tile {
        /// <summary>Determines the tile the object is located on.</summary>    
        /// <returns type="Object">Returns the tile the ship is currently on.</returns>

        var tileToCheck = { col: mainObject.parseInt(this.colRow.col), row: mainObject.parseInt(this.colRow.row) };
        if (!this.parentArea.tilemap.tileExist(tileToCheck)) return null;

        return this.parentArea.tilemap.map[mainObject.parseInt(tileToCheck.col)][mainObject.parseInt(tileToCheck.row)];
        //if (this.area.tilemap instanceof StarMap)
        //    return this.area.tilemap.map[mainObject.parseInt(this.galaxyColRow.col)][mainObject.parseInt(this.galaxyColRow.row)];
        //if (this.area.tilemap instanceof SolarSystemMap)
        //    return this.area.tilemap.map[mainObject.parseInt(this.starColRow.col)][mainObject.parseInt(this.starColRow.row)];
    }

    isOnCommNodeTile(): boolean {
        var commNode = CommModule.commNodeFindOnTile(this.getCurrentTile());
        return commNode != null;
    }

    // user has to be the owner of the object
    // used to show the trade-button
    //ToDO : omit this check for more performance  (TradePost has then to be selected manually)
    canTrade(): boolean {
        if (this.owner != mainObject.user.id) return false;

        var commNode = CommModule.commNodeFindOnTile(this.getCurrentTile());
        //var ret = CommModule.commNodeExistsOnTile(this.getCurrentTile());
        
        TradeOffersModule.callingObject = this;
        TradeOffersModule.callingAtTradeport = commNode;      
        
        return commNode != null;
    }

    countCargo(isTradebar = false): number {
        var goodsCount = 0;
        for (var i = 0; i < this.goods.length; i++) {
            if (this.goods[i] == null || this.goods[i] == 0) continue;
            if (mainObject.goods[i] == null) continue; //should never occur...
            //if (mainObject.goods[i].goodsType != 1) continue;
            if (mainObject.goods[i].goodsType == 3) continue;



            //normal goods are jst added
            if (mainObject.goods[i].goodsType == 1) {
                goodsCount += this.goods[i];
            }

            //modules cost as much as their production cost:
            if (mainObject.goods[i].goodsType == 2) {

                var Module = BaseDataModule.FindModuleByGoodId(i);

                goodsCount += this.goods[i] * Module.StorageCost();
            }

        }

        goodsCount += transferPanel.CargoChange(this);

        if (isTradebar) goodsCount += TradeOffersModule.TradeCreatePanel.CargoChange(this);

        return goodsCount;
    }

    cargoHoldUsed(isTradebar = false): number   {                      
        return mainInterface.cargoHoldUsed(this.countCargo(isTradebar), this.cargoroom);              
    }

    addCargoToArray(_array: number[]) {
        for (var i = 0; i < this.goods.length; i++) {
            if (this.goods[i] == null || this.goods[i] == 0) continue;

            //if (mainObject.goods[i].goodsType != 1) continue;
            //ToDO: check can probably be omited
            if (_array[i] == null) {
                _array[i] = this.goods[i];
            }
            else {
                _array[i] += this.goods[i];
            }
           
        }
    }

    //user interface:
    refreshMainScreenPanels() {

        var panel = $('#quickInfoList');
        panel.html('');

        //var heading = $('<span/>', { text: ship.name + " " });
        var heading = $('<span/>');
        heading.html(this.name.label() + " ");
        heading.css("font-weight", "bold");
        panel.append(heading);
       
        

        var coords = ' (' + this.colRow.col.toString() + '|' + this.colRow.row.toString() + ')';
        heading.append($('<span/>', { "text": coords, style: "font-size: 0.7em;font-weight: normal;" }));
        panel.append($('<br>'));

        //show message symbol if the selected unit belongs to another player
        if (this.owner != mainObject.user.id) {
            var otherUser = mainObject.user.otherUserFind(this.owner);
            //var owner = $('<span/>', { text: mainObject.user.otherUserFind(this.owner) && mainObject.user.otherUserFind(this.owner).name.label() + " " });
            var owner = $('<span/>');
            owner.html(mainObject.user.otherUserFind(this.owner) && mainObject.user.otherUserFind(this.owner).name.label() + " ");
            owner.css("font-weight", "bold");
            panel.append(owner);
            owner.append($('<span/>', { text: " " }));
           
            var writeMail = $('<button/>', { text: "M", style: "font-size: 0.7em;" });
            writeMail.button();
            writeMail.click((e) => { MessageModule.userInterface.showMessageWrite(otherUser); e.stopPropagation(); });
            writeMail.mousedown((e) => { e.stopPropagation(); });
            writeMail.mouseup((e) => { e.stopPropagation(); });
            owner.append(writeMail);
            panel.append($('<br>'));

            //check if colony:
            if (this instanceof ColonyModule.Colony) {
                var colony = <ColonyModule.Colony>this;
                // check if besieged If yes, show  

                var isBesieged = false;
                for (var i = 0; i < this.parentArea.shipsInArea.length; i++) {

                    var ship = this.parentArea.shipsInArea[i];                    
                    if (ship != null && ship.owner != this.owner && ship.owner != 0 && ship.isTroopTransport()) {
                        if (ship.owner != mainObject.user.id) {
                            var shipOwner = mainObject.user.otherUserFind(ship.owner);

                            for (var j = 0; j < shipOwner.relations.length; j++) {
                                if (shipOwner.relations[j].targetId == this.owner && shipOwner.relations[j].state == 0) {
                                    isBesieged = true;
                                    break;
                                }
                            }
                        }
                        else {
                            if (otherUser.currentRelation == 0) {
                                isBesieged = true;
                            }
                        }
                    }

                    if (isBesieged) break;
                }

                if (isBesieged) {
                    var BesiegerName = colony.BesiegedBy.toString();
                    if (mainObject.user.id == colony.BesiegedBy) {
                        BesiegerName = mainObject.user.name;
                    } else {
                    if (mainObject.user.otherUserExists(colony.BesiegedBy)) {
                        BesiegerName = mainObject.user.otherUsers[colony.BesiegedBy].shortTagFreeName();
                        }
                    }

                    var SiegeName = $('<span/>');
                    SiegeName.html(i18n.label(753).format(BesiegerName));

                    //panel.append($('<span/>', { text: i18n.label(753).format(BesiegerName) }));
                    panel.append(SiegeName);
                    var Resistance = $('<span/>', { "text": i18n.label(754).format(colony.TurnsOfSiege.toString()) });
                    Resistance.css("float", "right");
                    panel.append(Resistance);
                }
            }

            if (!isBesieged && colony.TurnsOfRioting > 0) {
                var Rioting = $('<span/>', { "text": i18n.label(981).format(colony.TurnsOfRioting.toString()) });
                Rioting.css("float", "right").css("font-weight", "bold").css("color", "#ff6644");
                panel.append(Rioting);
            }

        }        
    }

    getOwner(): PlayerData.User {
        if (this.owner == mainObject.user.id) return mainObject.user;
        else return mainObject.user.otherUsers[this.owner];
    }

}

//colony or ship
class SpaceUnit extends SpaceObject {

    scanRange = 0;
    scanEffectivity = 100;
    colRow = { col: 1, row: 1 }; //used for drawing on the mainInterface (selecting the right tile for this ship)
    galaxyColRow = { col: 1, row: 1 };
    starColRow = { col: 1, row: 1 };

    addGalaxyScanrange() {
        var scanColRow = { col: mainObject.parseInt(this.galaxyColRow.col) - this.scanRange, row: mainObject.parseInt(this.galaxyColRow.row) - this.scanRange };
        for (var i = 0; i < (this.scanRange * 2) + 1; i++) {
            for (var j = 0; j < (this.scanRange * 2) + 1; j++) {
                //Helpers.Log('Add: ' + scanColRow.col + i + ' / ' + scanColRow.row + j);
                scanMap.countUp({ col: mainObject.parseInt(scanColRow.col) + i, row: mainObject.parseInt(scanColRow.row) + j });

                FogOfWarModule.fog.insert(FogOfWarModule.makeBox(mainObject.parseInt(scanColRow.col) + i, mainObject.parseInt(scanColRow.row) + j));
            }
        }
    }

    ScansPosition(position: ColRow): boolean {
        if (this.galaxyColRow.col - this.scanRange <= position.col
            && this.galaxyColRow.col + this.scanRange >= position.col
            && this.galaxyColRow.row - this.scanRange <= position.row
            && this.galaxyColRow.row + this.scanRange >= position.row)
            return true;
        else
            return false;
    }
}

//Tiles contain drawing relevant data
class Tile extends SpaceObject {
    ships: Ships.Ship[] = [];                         //needed for galaxy- nad systemtiles, not needed for planetTiles
    //this.shipIds = [];
    stars: AreaSpecifications = null;   //ToDo:should be named objectOnTile - reference to a areaData (could e.g. a planet with a colony), or a sun - this determines what is drawn. Can also be null, if only ships are present
    //this.starIds = [];    
    //colRow: ColRow = { col: col, row: row };

    drawArrow = false; //if true, draw an arrow pointing to this Tile

    Tooltipgenerated = false;
    Tooltip = "";


    QuadTreeBoxExists(): boolean {
        if (this instanceof PlanetTile) return false;
        
        var x, y: number;
        if (this instanceof SystemTile) {
            x = this.parentArea.colRow.col;
            y = this.parentArea.colRow.row;
           
        }
        if (this instanceof StarsTile) {
            x = this.colRow.col;
            y = this.colRow.row;           
        }

        return StarMapModule.FieldExists(x, y);       
    }

    QuadTreeBox(): StarMapModule.Box {
        //get the StarmapQuadTree Box :
        if (this instanceof PlanetTile) return null;

        var x, y: number;
        if (this instanceof SystemTile) {
            x = this.parentArea.colRow.col;
            y = this.parentArea.colRow.row;

        }
        if (this instanceof StarsTile) {
            x = this.colRow.col;
            y = this.colRow.row;
        }

        return StarMapModule.GetField(x, y);        
    }

    CreateShipsTooltip() {       
        //. 12 Ships
        //  Hostile ships present
       

        this.Tooltip += this.ships.length == 1 ? i18n.label(918).format(this.ships.length.toString()) : i18n.label(922).format(this.ships.length.toString()); // {0} Ship : {0} Ships  
        this.Tooltip += "<br>";
        var HostileShipspresent = false;
        for (var shipNo = 0; shipNo < this.ships.length; shipNo++) {
            if (this.ships[shipNo].owner == mainObject.user.id && this.ships[shipNo].owner != 0) {
                if (mainObject.user.otherUserExists(this.ships[shipNo].owner)) {
                    if (mainObject.user.otherUserFind(this.ships[shipNo].owner).currentRelation < 2) {
                        HostileShipspresent = true;
                    }
                }
            }
        }

        if (HostileShipspresent) {
            this.Tooltip += this.ships.length == 1 ? i18n.label(919) : i18n.label(920); //Ship is hostile : "Hostile ships present"
            this.Tooltip += "<br>";
        }
        this.Tooltip += "<br>";
    }

    CreateSpaceStationsTooltip() {
        //Space station
        //Owner: Robots (Neutral)  [Grau]
        //    +12   E Einfluß
        //Owner: Skratti (Neutral)  [Grau]
        //    +12   E Einfluß
    }

    CreateColonyTooltip(CurrentColony: ColonyModule.Colony, MainColony: boolean) {
        
        this.Tooltip += (MainColony ? i18n.label(915) : i18n.label(916)) + "<br>"; //"Colony" : "Minor Colony")
        this.Tooltip += CurrentColony.name + "<br>";
        if (CurrentColony.owner == mainObject.user.id) {
            var relationColor = DiplomacyModule.RelationColor(10);
            this.Tooltip += "<font color=" + relationColor +">" + i18n.label(917) + "</font><br>"; //Owned by you
        }
        else {
            if (mainObject.user.otherUserExists(CurrentColony.owner)) {
                if (mainObject.user.otherUserFind(CurrentColony.owner)) {
                    var relationColor = DiplomacyModule.RelationColor(mainObject.user.otherUserFind(CurrentColony.owner).currentRelation);
                    this.Tooltip += "<font color=" + relationColor + ">" + i18n.label(921).format(mainObject.user.otherUserFind(CurrentColony.owner).name.label()) + "</font><br>"; //Owner: {0}
                }
            }
        }
        this.Tooltip += "<br>";
    }

    CreateTileOwnerTooltip() {
        var HasOwner = true;

        var ExistingField = this.QuadTreeBox();
       
        if (ExistingField == null || !ExistingField.OwnerId) {
            return;
        }

        //Domain - Gebiet
        //Owned by you - Gehört euch / Owner: Skratti (Hostile) [Farbe anpassen] - Besitzer: Skratti (Feindlich) 
        this.Tooltip += ExistingField.OwnershipText();
        /*
        if (ExistingField.OwnerId == mainObject.user.id) {
            var relationColor = DiplomacyModule.RelationColor(10);
            this.Tooltip += "<font color=" + relationColor + ">" + i18n.label(917) + "</font><br>"; //Owned by you
            this.Tooltip += "<br>";
        } else
        {
            if (mainObject.user.otherUserFind(ExistingField.OwnerId)) {
            var relationColor = DiplomacyModule.RelationColor(ExistingField.DiplomaticId);

            this.Tooltip += "<font color=" + relationColor + ">" + i18n.label(921).format(mainObject.user.otherUserFind(ExistingField.OwnerId).name.label()) + "</font><br>"; //Owner: {0}
            this.Tooltip += "<br>";
            }
        }*/
        
    }
    CreateTileOwnerTooltip2() {
        var HasOwner = true;



        //get the StarmapQuadTree Box :
        var Box: StarMapModule.Box;
        if (this instanceof SystemTile) {
            Box = StarMapModule.makeBox(this.parentArea.colRow.col, this.parentArea.colRow.row);
        }
        if (this instanceof StarsTile) {
            Box = StarMapModule.makeBox(this.colRow.col, this.colRow.row);
        }
        var ExistingField: StarMapModule.Box;
        if (Box) {
            var ExistingFields = StarMapModule.starMap.queryRange(Box);
            if (ExistingFields && ExistingFields.length > 0) ExistingField = ExistingFields[0];
        }

        //if (ExistingField.OwnerId != mainObject.user.id && ExistingField.OwnerId != 0 && ExistingField.OwnerId != null && ExistingField.DiplomaticId == 2) MovementCost = 20;

        if (ExistingField == null || !ExistingField.OwnerId) {
            Helpers.Log("Tooltip Generator - Field has no Owner");
        }

        //Domain - Gebiet
        //Owned by you - Gehört euch / Owner: Skratti (Hostile) [Farbe anpassen] - Besitzer: Skratti (Feindlich) 
        if (ExistingField && ExistingField.OwnerId) {
            if (ExistingField.OwnerId == mainObject.user.id) {
                var relationColor = DiplomacyModule.RelationColor(10);
                this.Tooltip += "<font color=" + relationColor + ">" + i18n.label(917) + "</font><br>"; //Owned by you
                this.Tooltip += "<br>";
            } else {
                if (mainObject.user.otherUserFind(ExistingField.OwnerId)) {
                    var relationColor = DiplomacyModule.RelationColor(ExistingField.DiplomaticId);

                    this.Tooltip += "<font color=" + relationColor + ">" + i18n.label(921).format(mainObject.user.otherUserFind(ExistingField.OwnerId).name.label()) + "</font><br>"; //Owner: {0}
                    this.Tooltip += "<br>";
                }
            }
        }
    }

    CreateTileTypeTooltip() {
        if (this.stars == null || mainObject.imageObjects[this.stars.typeId] == null) return;
        
        //Asteroid
        //2 Move Cost        
        this.Tooltip += i18n.label(mainObject.imageObjects[this.stars.typeId].label) + "<br>";
        Helpers.Log("Tile Typeid = " + this.stars.typeId);
        this.Tooltip += i18n.label(923).format(mainObject.imageObjects[this.stars.typeId].moveCost.toString()) + "<br>"; // {0} Move Cost / Bewegungskosten
    }

    GetTooltip(): string {
        this.Tooltip = "";

        return "";
    }
    constructor(col: number, row: number) {
        super();
        this.colRow.col = col;
        this.colRow.row = row;
    }


    getFirstOwnShip(): Ships.Ship {
        if (this.ships == null) return null;
        if (this.ships.length == 0) return null;
        for (var i = 0; i < this.ships.length; i++) {
            if (this.ships[i] == null) continue;
            if (this.ships[i].owner == mainObject.user.id) return this.ships[i];
        }
        return null;
    }

    deleteShip(shipToDeleteId: number) {
        for (var shipNo = 0; shipNo < this.ships.length; shipNo++) {
            if (this.ships[shipNo].id == shipToDeleteId) this.ships.splice(shipNo, 1);
        }
    }

    existShip(shipToFind: number): boolean {
        for (var shipNo = 0; shipNo < this.ships.length; shipNo++) {
            if (this.ships[shipNo].id == shipToFind) return true;
        }
        return false;
    }

}

//a Tile in the Galaxymap
//ToDo: rename´, bacause the tile often contains only Ships. GalaxyTile would be better
class StarsTile extends Tile {
    stars: StarData = null;

    useless(shipToFind: number): boolean {
        return false;
    }

    GetTooltip(): string {

        super.GetTooltip();

        //if (this.Tooltipgenerated) return this.Tooltip;
        /*
        //get the StarmapQuadTree Box :
        var Box: StarMapModule.Box;
        if (this instanceof SystemTile) {
            Box = StarMapModule.makeBox(this.parentArea.colRow.col, this.parentArea.colRow.row);
        }
        if (this instanceof StarsTile) {
            Box = StarMapModule.makeBox(this.colRow.col, this.colRow.row);
        }
        var ExistingField: StarMapModule.Box;
        if (Box) {
            var ExistingFields = StarMapModule.starMap.queryRange(Box);
            if (ExistingFields && ExistingFields.length > 0) ExistingField = ExistingFields[0];
        }
        */
        //if (ExistingField.OwnerId != mainObject.user.id && ExistingField.OwnerId != 0 && ExistingField.OwnerId != null && ExistingField.DiplomaticId == 2) MovementCost = 20;


        if (this.ships != null && this.ships.length > 0) {
            this.CreateShipsTooltip();
        }

        this.CreateSpaceStationsTooltip();

        var CurrentColony: ColonyModule.Colony = null;
        var MainColony = false;
        //check for tileToDraw instanceof starTile
        for (var colonyCounter = 0; colonyCounter < mainObject.colonies.length; colonyCounter++) {
            if (mainObject.colonies[colonyCounter].galaxyColRow.col == this.colRow.col && mainObject.colonies[colonyCounter].galaxyColRow.row == this.colRow.row) {
                CurrentColony = mainObject.colonies[colonyCounter];
                MainColony = true;
            }
        }       

        if (CurrentColony != null) {
            this.CreateColonyTooltip(CurrentColony, MainColony);
        } else {
            this.CreateTileOwnerTooltip();
        }


        // -> ODER
        // ColonyName
        // Gehört euch / Owner: Skratti...
        // Homeworld / Colony / Minor Colony
        // 512    B Bevölkerung
        // 8000   L Lagerkapazität
        //  +12   E Einfluß

        this.CreateTileTypeTooltip();


        this.Tooltipgenerated = true;
        return this.Tooltip;
    }

}

// SystemTile -> a tile inside a star system -   has PlanetData as Areaspecification of the stars - object
class SystemTile extends Tile {
    stars: PlanetData = null;

    constructor(col: number, row: number, _parentArea: AreaSpecifications) {        
        super(col, row);
        //Helpers.Log(col + ' ' + row + ' SystemTile' + _parentArea || _parentArea.id );
        this.parentArea = _parentArea;
    }

    useless(shipToFind: number): boolean {        
        return false;
    }

    GetTooltip(): string {
        super.GetTooltip();
        //if (this.Tooltipgenerated) return this.Tooltip;

        //get the StarmapQuadTree Box :
        /*
        var Box: StarMapModule.Box;
        if (this instanceof SystemTile) {
            Box = StarMapModule.makeBox(this.parentArea.colRow.col, this.parentArea.colRow.row);
        }
        if (this instanceof StarsTile) {
            Box = StarMapModule.makeBox(this.colRow.col, this.colRow.row);
        }
        var ExistingField: StarMapModule.Box;
        if (Box) {
            var ExistingFields = StarMapModule.starMap.queryRange(Box);
            if (ExistingFields && ExistingFields.length > 0) ExistingField = ExistingFields[0];
        }
        */
        //if (ExistingField.OwnerId != mainObject.user.id && ExistingField.OwnerId != 0 && ExistingField.OwnerId != null && ExistingField.DiplomaticId == 2) MovementCost = 20;


        if (this.ships != null && this.ships.length > 0) {
            this.CreateShipsTooltip();
        }

        this.CreateSpaceStationsTooltip();

        var CurrentColony: ColonyModule.Colony = null;
        var MainColony = false;

        //check if a colony is present on the systemTile
        if (this instanceof SystemTile) {
            if ((<SystemTile> this).stars != null && (<SystemTile> this).stars.colony != null) {
                CurrentColony = (<SystemTile> this).stars.colony;
                MainColony = (<SystemTile> this).stars.isMainColony();
            }
        }

        if (CurrentColony != null) {
            this.CreateColonyTooltip(CurrentColony, MainColony);
        } 


        // -> ODER
        // ColonyName
        // Gehört euch / Owner: Skratti...
        // Homeworld / Colony / Minor Colony
        // 512    B Bevölkerung
        // 8000   L Lagerkapazität
        //  +12   E Einfluß

        this.CreateTileTypeTooltip();


        this.Tooltipgenerated = true;
        return this.Tooltip;
    }

}

class PlanetTile extends Tile {
    stars: SurfaceField = null;
    building = null;
    constructor(col: number, row: number) {
        super(col, row);
        //Helpers.Log(col + ' ' + row + ' PlanetTile');
    }

    CreateTileTypeTooltip() {


        //Gras/ Desert / Ice ...
        Helpers.Log("Tile Typeid = " + this.stars.surfaceFieldType)
        if (!mainObject.surfaceTileExists(this.stars.surfaceFieldType)) return;
        var tile = mainObject.surfaceTiles[this.stars.surfaceFieldType];

        this.Tooltip += i18n.label(tile.label) + "<br>";      
       
    }

    CreateBuildingTooltip() {
        Helpers.Log("Tile stars = " + this.stars)
        if (!this.stars) return;

        if (this.stars.building == null) return;

        this.Tooltip += i18n.label(mainObject.buildings[this.stars.building.buildingId].label) + "<br>";

        if (this.stars.building.isActive) {
            this.Tooltip += "<font color=#22dd22>" + i18n.label(298) + "</font><br>"; //Active    
        } else {
            this.Tooltip += "<font color=#dd2222>" + i18n.label(924) + "</font><br>"; //Inactive
        }
        this.Tooltip += "<br>";

    }

    GetTooltip(): string {
        super.GetTooltip();
        //if (this.Tooltipgenerated) return this.Tooltip;
        
        //buildingname
        //Active/inactive
        //
        //surfaceTileType

        this.CreateBuildingTooltip();       
        
        this.CreateTileTypeTooltip();
        

        this.Tooltipgenerated = true;
        return this.Tooltip;
    }

}