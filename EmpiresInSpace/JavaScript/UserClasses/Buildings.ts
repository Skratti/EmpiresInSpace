
// mdTemplate : Template for Modules and Classes 
// this pattern is always to be used!

module ColonyModule {

    export var detailContainer: JQuery;
     
    export var allBuildings: ColonyBuilding[] = [];         //buildings by id
    export var colonyBuildings: ColonyBuilding[][] = [];    //buildings by colonyId and planetSurfaceTileId

    export var staticValue = false;

    export class ColonyBuilding implements DialogWindows.DialogWindowType{

        colonyId = 0;
        surfaceTileId = 0;
        surfaceTile: SurfaceField = null;
        userId = 0;
        buildingId = 0;
        isActive = false;
        underConstruction = false;
        remainingHitpoint = 10;
   


        constructor(public id: number) {
        }

        DialogWindowType() {
            return DialogWindows.DialogWindowTypeEnum.ColonyBuilding;
        }

        deleteBuilding(refund:boolean = true) {
            //allBuildings.splice(this.id, 1);
            //gain the costs of the building
            if (refund) {
                for (var i = 0; i < mainObject.buildings[this.buildingId].costs.length; i++) {
                    if (mainObject.buildings[this.buildingId].costs[i] == null) continue;
                    //if (mainObject.buildings[this.buildingId].costs[i] == null) continue;

                    if (mainObject.goods[i].goodsType == 3) continue;

                    if (mainObject.coloniesById[this.colonyId].goods[i] != null) {
                        mainObject.coloniesById[this.colonyId].goods[i] =
                        mainObject.coloniesById[this.colonyId].goods[i]
                        + mainObject.buildings[this.buildingId].costs[i];
                    }
                    else {
                        mainObject.coloniesById[this.colonyId].goods[i] = mainObject.buildings[this.buildingId].costs[i];
                    }
                }
            }
                     
            this.surfaceTile.building = null;
            delete allBuildings[this.id];
            delete colonyBuildings[this.colonyId][this.surfaceTileId];
        }        

        update(XMLmessage) {

            var colonyId            = parseInt(XMLmessage.getElementsByTagName("colonyId")[0].childNodes[0].nodeValue, 10);
            var planetSurfaceId     = parseInt(XMLmessage.getElementsByTagName("planetSurfaceId")[0].childNodes[0].nodeValue, 10);           
            var userId              = parseInt(XMLmessage.getElementsByTagName("userId")[0].childNodes[0].nodeValue, 10);
            var buildingId          = parseInt(XMLmessage.getElementsByTagName("buildingId")[0].childNodes[0].nodeValue, 10);
            var isActive            = parseInt(XMLmessage.getElementsByTagName("isActive")[0].childNodes[0].nodeValue, 10);
            var underConstruction   = parseInt(XMLmessage.getElementsByTagName("underConstruction")[0].childNodes[0].nodeValue, 10);           
            var remainingHitpoint   = parseInt(XMLmessage.getElementsByTagName("remainingHitpoint")[0].childNodes[0].nodeValue, 10);
            
            this.colonyId           = colonyId;
            this.surfaceTileId      = planetSurfaceId;
            this.userId             = userId;
            this.buildingId         = buildingId;
            this.isActive           = isActive === 1 ? true : false;
            this.underConstruction  = underConstruction === 1 ? true : false;            
            this.remainingHitpoint = remainingHitpoint;

            if (colonyBuildings[this.colonyId] == null) colonyBuildings[this.colonyId] = [];
            colonyBuildings[this.colonyId][this.surfaceTileId] = this;
        }

        changeActivity() {

            $.ajax("Server/Buildings.aspx", {
                type: "GET",
                async: true,
                data: {
                    "action": "activate",
                    "buildingId": this.id.toString()
                }
            });

            this.isActive = !this.isActive;               
        }
    }

    export function colonyBuildingExists(id: number): boolean {
        if (allBuildings[id] != null)
            return true;
        else
            return false;
    }

    export function getColonyBuilding(id: number): ColonyBuilding {
        if (!colonyBuildingExists(id)) return null;
        return allBuildings[id];
    }

    var colonyBuildingAdd = function (XMLmessage: Element) {
        var id = parseInt(XMLmessage.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        var newColonyBuilding = new ColonyBuilding(id);

        allBuildings[id] = newColonyBuilding;

        newColonyBuilding.update(XMLmessage);
    }

    var createUpdateColonyBuilding = function (XMLmessage: Element) {
        var id = parseInt(XMLmessage.getElementsByTagName("id")[0].childNodes[0].nodeValue);

        if (colonyBuildingExists(id))
            allBuildings[id].update(XMLmessage);
        else
            colonyBuildingAdd(XMLmessage);
    }

    export function getColonyBuildingFromXML(XMLmessage: Element) {
        var XMLColonyBuildings = XMLmessage.getElementsByTagName("ColonyBuilding");
        var length = XMLColonyBuildings.length;
        for (var i = 0; i < length; i++) {
            createUpdateColonyBuilding(<Element>XMLColonyBuildings[i]);
        }
        Helpers.Log(length + " ColonyBuildings added or updated");
    }
   
} 