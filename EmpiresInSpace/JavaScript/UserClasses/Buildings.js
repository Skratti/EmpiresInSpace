// mdTemplate : Template for Modules and Classes 
// this pattern is always to be used!
var ColonyModule;
(function (ColonyModule) {
    ColonyModule.allBuildings = []; //buildings by id
    ColonyModule.colonyBuildings = []; //buildings by colonyId and planetSurfaceTileId
    ColonyModule.staticValue = false;
    var ColonyBuilding = /** @class */ (function () {
        function ColonyBuilding(id) {
            this.id = id;
            this.colonyId = 0;
            this.surfaceTileId = 0;
            this.surfaceTile = null;
            this.userId = 0;
            this.buildingId = 0;
            this.isActive = false;
            this.underConstruction = false;
            this.remainingHitpoint = 10;
        }
        ColonyBuilding.prototype.DialogWindowType = function () {
            return DialogWindows.DialogWindowTypeEnum.ColonyBuilding;
        };
        ColonyBuilding.prototype.deleteBuilding = function (refund) {
            if (refund === void 0) { refund = true; }
            //allBuildings.splice(this.id, 1);
            //gain the costs of the building
            if (refund) {
                for (var i = 0; i < mainObject.buildings[this.buildingId].costs.length; i++) {
                    if (mainObject.buildings[this.buildingId].costs[i] == null)
                        continue;
                    //if (mainObject.buildings[this.buildingId].costs[i] == null) continue;
                    if (mainObject.goods[i].goodsType == 3)
                        continue;
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
            delete ColonyModule.allBuildings[this.id];
            delete ColonyModule.colonyBuildings[this.colonyId][this.surfaceTileId];
        };
        ColonyBuilding.prototype.update = function (XMLmessage) {
            var colonyId = parseInt(XMLmessage.getElementsByTagName("colonyId")[0].childNodes[0].nodeValue, 10);
            var planetSurfaceId = parseInt(XMLmessage.getElementsByTagName("planetSurfaceId")[0].childNodes[0].nodeValue, 10);
            var userId = parseInt(XMLmessage.getElementsByTagName("userId")[0].childNodes[0].nodeValue, 10);
            var buildingId = parseInt(XMLmessage.getElementsByTagName("buildingId")[0].childNodes[0].nodeValue, 10);
            var isActive = parseInt(XMLmessage.getElementsByTagName("isActive")[0].childNodes[0].nodeValue, 10);
            var underConstruction = parseInt(XMLmessage.getElementsByTagName("underConstruction")[0].childNodes[0].nodeValue, 10);
            var remainingHitpoint = parseInt(XMLmessage.getElementsByTagName("remainingHitpoint")[0].childNodes[0].nodeValue, 10);
            this.colonyId = colonyId;
            this.surfaceTileId = planetSurfaceId;
            this.userId = userId;
            this.buildingId = buildingId;
            this.isActive = isActive === 1 ? true : false;
            this.underConstruction = underConstruction === 1 ? true : false;
            this.remainingHitpoint = remainingHitpoint;
            if (ColonyModule.colonyBuildings[this.colonyId] == null)
                ColonyModule.colonyBuildings[this.colonyId] = [];
            ColonyModule.colonyBuildings[this.colonyId][this.surfaceTileId] = this;
        };
        ColonyBuilding.prototype.changeActivity = function () {
            $.ajax("Server/Buildings.aspx", {
                type: "GET",
                async: true,
                data: {
                    "action": "activate",
                    "buildingId": this.id.toString()
                }
            });
            this.isActive = !this.isActive;
        };
        return ColonyBuilding;
    }());
    ColonyModule.ColonyBuilding = ColonyBuilding;
    function colonyBuildingExists(id) {
        if (ColonyModule.allBuildings[id] != null)
            return true;
        else
            return false;
    }
    ColonyModule.colonyBuildingExists = colonyBuildingExists;
    function getColonyBuilding(id) {
        if (!colonyBuildingExists(id))
            return null;
        return ColonyModule.allBuildings[id];
    }
    ColonyModule.getColonyBuilding = getColonyBuilding;
    var colonyBuildingAdd = function (XMLmessage) {
        var id = parseInt(XMLmessage.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        var newColonyBuilding = new ColonyBuilding(id);
        ColonyModule.allBuildings[id] = newColonyBuilding;
        newColonyBuilding.update(XMLmessage);
    };
    var createUpdateColonyBuilding = function (XMLmessage) {
        var id = parseInt(XMLmessage.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        if (colonyBuildingExists(id))
            ColonyModule.allBuildings[id].update(XMLmessage);
        else
            colonyBuildingAdd(XMLmessage);
    };
    function getColonyBuildingFromXML(XMLmessage) {
        var XMLColonyBuildings = XMLmessage.getElementsByTagName("ColonyBuilding");
        var length = XMLColonyBuildings.length;
        for (var i = 0; i < length; i++) {
            createUpdateColonyBuilding(XMLColonyBuildings[i]);
        }
        Helpers.Log(length + " ColonyBuildings added or updated");
    }
    ColonyModule.getColonyBuildingFromXML = getColonyBuildingFromXML;
})(ColonyModule || (ColonyModule = {}));
//# sourceMappingURL=Buildings.js.map