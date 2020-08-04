
//Tiles contain drawing relevant data
class Tile extends SpaceObject {
    ships: Ships.Ship[] = [];                         //needed for galaxy- nad systemtiles, not needed for planetTiles
    //this.shipIds = [];
    astronomicalObject: AreaSpecifications = null;   //ToDo:should be named spaceObject / astronomicalObject - reference to a areaData (could e.g. a planet with a colony), or a sun - this determines what is drawn. Can also be null, if only ships are present
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
        if (this instanceof GalaxyTile) {
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
        if (this instanceof GalaxyTile) {
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
            this.Tooltip += "<font color=" + relationColor + ">" + i18n.label(917) + "</font><br>"; //Owned by you
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
        if (this instanceof GalaxyTile) {
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
        if (this.astronomicalObject == null || mainObject.imageObjects[this.astronomicalObject.typeId] == null) return;

        //Asteroid
        //2 Move Cost        
        this.Tooltip += i18n.label(mainObject.imageObjects[this.astronomicalObject.typeId].label) + "<br>";
        Helpers.Log("Tile Typeid = " + this.astronomicalObject.typeId);
        this.Tooltip += i18n.label(923).format(mainObject.imageObjects[this.astronomicalObject.typeId].moveCost.toString()) + "<br>"; // {0} Move Cost / Bewegungskosten
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
class GalaxyTile extends Tile {
    astronomicalObject: StarData = null;

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
    astronomicalObject: PlanetData = null;

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
            if ((<SystemTile>this).astronomicalObject != null && (<SystemTile>this).astronomicalObject.colony != null) {
                CurrentColony = (<SystemTile>this).astronomicalObject.colony;
                MainColony = (<SystemTile>this).astronomicalObject.isMainColony();
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
    astronomicalObject: SurfaceField = null;
    building = null;
    constructor(col: number, row: number) {
        super(col, row);
        //Helpers.Log(col + ' ' + row + ' PlanetTile');
    }

    CreateTileTypeTooltip() {


        //Gras/ Desert / Ice ...
        Helpers.Log("Tile Typeid = " + this.astronomicalObject.surfaceFieldType)
        if (!mainObject.surfaceTileExists(this.astronomicalObject.surfaceFieldType)) return;
        var tile = mainObject.surfaceTiles[this.astronomicalObject.surfaceFieldType];

        this.Tooltip += i18n.label(tile.label) + "<br>";

    }

    CreateBuildingTooltip() {
        Helpers.Log("Tile stars = " + this.astronomicalObject)
        if (!this.astronomicalObject) return;

        if (this.astronomicalObject.building == null) return;

        this.Tooltip += i18n.label(mainObject.buildings[this.astronomicalObject.building.buildingId].label) + "<br>";

        if (this.astronomicalObject.building.isActive) {
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