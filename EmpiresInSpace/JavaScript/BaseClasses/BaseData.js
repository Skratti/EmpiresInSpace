//
//BaseData contains static data about the game: buildings, tiles, possible research and so on.
//all user independent data should be stored here
//needed by the ObjectRelations class. equivalent to the sql types in table  [ResearchQuestPrerequisites]
/*
    1 Forschung	- benötigt 1 Forschung und/oder 2 Quest
                - ermöglicht 1 Forschung, 2 Quest und oder 3 Gebäude
    2 Quest		- benötigt 2 Quest und/oder 1 Forschung (und auch nicht angezeigt Quests -> 'zufälliges Entdecken von Anomalien') und/oder Auftraggeber
                - kann gebunden sein an Kolonie oder Schiff eines Spielers
                - ermöglicht Quest, Forschung, Gebäude, Waren (wenn gebunden an Spielerobjekt)
    3 Gebäude
    4 Schiffsmodule
    5 Schiffsrümpfe
    6 Rohstoffe  - nur als SourceType, um Quests oder Forschungen zu ermöglichen
*/
var ObjectTypes;
(function (ObjectTypes) {
    ObjectTypes[ObjectTypes["Research"] = 1] = "Research";
    ObjectTypes[ObjectTypes["Quest"] = 2] = "Quest";
    ObjectTypes[ObjectTypes["Building"] = 3] = "Building";
    ObjectTypes[ObjectTypes["ShipModule"] = 4] = "ShipModule";
    ObjectTypes[ObjectTypes["ShipHull"] = 5] = "ShipHull";
    ObjectTypes[ObjectTypes["Good"] = 6] = "Good";
})(ObjectTypes || (ObjectTypes = {}));
;
var BaseDataModule;
(function (BaseDataModule) {
    var Modificators;
    (function (Modificators) {
        Modificators[Modificators["HousingAbs"] = 1] = "HousingAbs";
        Modificators[Modificators["StorageAbs"] = 2] = "StorageAbs";
        Modificators[Modificators["Research"] = 3] = "Research";
        Modificators[Modificators["Assembly"] = 4] = "Assembly";
        Modificators[Modificators["Energy"] = 5] = "Energy";
        Modificators[Modificators["Housing"] = 6] = "Housing";
        Modificators[Modificators["Food"] = 7] = "Food";
        Modificators[Modificators["Production"] = 8] = "Production";
        Modificators[Modificators["Growth"] = 9] = "Growth";
        Modificators[Modificators["ColonyCount"] = 10] = "ColonyCount";
        Modificators[Modificators["FleetCount"] = 11] = "FleetCount";
        Modificators[Modificators["AllowedMines"] = 12] = "AllowedMines";
        Modificators[Modificators["AllowedChemicals"] = 13] = "AllowedChemicals";
        Modificators[Modificators["AllowedFuel"] = 14] = "AllowedFuel";
    })(Modificators = BaseDataModule.Modificators || (BaseDataModule.Modificators = {}));
    ;
    BaseDataModule.shipHulls = [];
    BaseDataModule.shipHullsImages = [];
    BaseDataModule.modules = [];
    BaseDataModule.researches = []; //all possible researches
    BaseDataModule.researchGains = []; //all possible researches
    BaseDataModule.SpecializationGroups = [];
    BaseDataModule.objectRelations = [];
    function distance(position1, position2) {
        //Pythagoras doesn't help here, since moving diagonally costs the same as horizontally and vertically
        //just tyke the bigger value of the difference between both x's and both y's
        return Math.max(Math.abs(position1.col - position2.col), Math.abs(position1.row - position2.row));
    }
    BaseDataModule.distance = distance;
    function modifierImageObject(type) {
        if (type == Modificators.HousingAbs)
            return 162;
        if (type == Modificators.StorageAbs)
            return 160;
        if (type == Modificators.Research)
            return 165;
        if (type == Modificators.Assembly)
            return 1007;
        if (type == Modificators.Energy)
            return 1000;
        if (type == Modificators.Housing)
            return 162;
        if (type == Modificators.Food)
            return 1002;
        if (type == Modificators.Production)
            return 163;
        if (type == Modificators.Growth)
            return 1008;
        if (type == Modificators.ColonyCount)
            return 24; //planet
        if (type == Modificators.FleetCount)
            return 200; //ship
        if (type == Modificators.AllowedMines)
            return 152; //Mine
        if (type == Modificators.AllowedFuel)
            return 166; //Fuel
        if (type == Modificators.AllowedChemicals)
            return 166; //Mine
    }
    function modifierTooltip(type) {
        if (type == Modificators.HousingAbs)
            return 410;
        if (type == Modificators.StorageAbs)
            return 220;
        if (type == Modificators.Research)
            return 671;
        if (type == Modificators.Assembly)
            return 672;
        if (type == Modificators.Energy)
            return 673;
        if (type == Modificators.Housing)
            return 674;
        if (type == Modificators.Food)
            return 675;
        if (type == Modificators.Production)
            return 676;
        if (type == Modificators.Growth)
            return 677;
        if (type == Modificators.ColonyCount)
            return 679; //planet
        if (type == Modificators.FleetCount)
            return 678; //ship
        if (type == Modificators.AllowedMines)
            return 44; //Mine
        if (type == Modificators.AllowedFuel)
            return 47; //Fuel
        if (type == Modificators.AllowedChemicals)
            return 47; //Mine
    }
    function modifierName(type) {
        if (type == Modificators.HousingAbs)
            return 410;
        if (type == Modificators.StorageAbs)
            return 220;
        if (type == Modificators.Research)
            return 671;
        if (type == Modificators.Assembly)
            return 672;
        if (type == Modificators.Energy)
            return 673;
        if (type == Modificators.Housing)
            return 674;
        if (type == Modificators.Food)
            return 675;
        if (type == Modificators.Production)
            return 676;
        if (type == Modificators.Growth)
            return 677;
        if (type == Modificators.ColonyCount)
            return 679; //planet
        if (type == Modificators.FleetCount)
            return 678; //ship
        if (type == Modificators.AllowedMines)
            return 679; //Mine
        if (type == Modificators.AllowedFuel)
            return 679; //Fuel
        if (type == Modificators.AllowedChemicals)
            return 679; //Mine
    }
    BaseDataModule.modifierName = modifierName;
    // creates a modifierTooltipDiv with modifierName and value (for colonyDetails)
    function modifierTooltipDiv(type, amount) {
        var modifierDiv = $("<div/>");
        var textSpan = $("<span/>");
        var text = amount.toFixed(1);
        if (amount > 0)
            text = "+" + text;
        if (parseInt(type, 10) > 2)
            text += "% ";
        textSpan.append($("<span/>", { "text": text }));
        modifierDiv.append(textSpan);
        var modifierName = $('<span/>', { text: i18n.label(640) }); //from Buildings           
        modifierDiv.append(modifierName);
        modifierDiv.append($('<br>'));
        modifierDiv.append(RealmStatistics.tooltipLine()).append($('<br>'));
        return modifierDiv;
    }
    BaseDataModule.modifierTooltipDiv = modifierTooltipDiv;
    //create a modifier line with image and value (for buildingdetail)
    function modifierDiv(type, amount) {
        var modifierDiv = $("<div/>");
        var texturePath = mainObject.imageObjects[modifierImageObject(type)].texture.src;
        var image = $('<div/>', { style: "background: url(" + texturePath + ") no-repeat;width:30px;height:30px; border: 1px solid #666;background-size: contain;margin-right:6px;" });
        image.addClass("floatLeft");
        image.addClass("modifierImage");
        image.attr("Title", i18n.label(modifierTooltip(type)));
        modifierDiv.append(image);
        image.tooltip();
        var textDiv = $("<div/>", { style: "padding-top: 6px;  padding-bottom: 12px;" });
        textDiv.addClass("modifierText");
        var text = amount.toString();
        if (text.length > 5)
            text = amount.toFixed(1);
        if (amount > 0)
            text = "+" + text;
        if (parseInt(type, 10) > 2 && parseInt(type, 10) < 10)
            text += "%";
        textDiv.append($("<span/>", { "text": text }));
        modifierDiv.append(textDiv);
        modifierDiv.css("clear", "both");
        modifierDiv.css("padding-top", " 10px");
        return modifierDiv;
    }
    BaseDataModule.modifierDiv = modifierDiv;
    function modifierRealmStatTooltipDiv(type, amount) {
        var modifierDiv = $("<div/>");
        var modifierName = $('<span/>', { text: i18n.label(BaseDataModule.modifierName(type)) + ': ' }); //from Buildings           
        modifierDiv.append(modifierName);
        var isRatio = (parseInt(type, 10) > 2 && parseInt(type, 10) < 10);
        var textSpan = $("<span/>");
        var text = isRatio ? amount.toFixed(0) : amount.toString();
        if (amount > 0)
            text = "+" + text;
        if (isRatio)
            text += "% ";
        textSpan.append($("<span/>", { "text": text }));
        modifierDiv.append(textSpan);
        modifierDiv.append($('<br>'));
        return modifierDiv;
    }
    BaseDataModule.modifierRealmStatTooltipDiv = modifierRealmStatTooltipDiv;
    var ObjectImage = /** @class */ (function () {
        function ObjectImage() {
            this.ObjectId = 0;
            this.ImageId = 0;
            this.Drawsize = 1;
            this.BackgroundObjectId = null;
            this.BackgroundDrawSize = null;
            this.TilestartingAt = null;
            this.SurfaceDefaultMapId = null;
        }
        return ObjectImage;
    }());
    BaseDataModule.ObjectImage = ObjectImage;
    var PlanetType = /** @class */ (function () {
        function PlanetType(id) {
            this.id = 0;
            this.label = 1;
            this.description = 1;
            this.objectId = 1;
            this.researchRequired = 1;
            this.colonyCenter = 1;
            this.id = id;
        }
        PlanetType.prototype.update = function (XMLobjectOnMap) {
            this.id = parseInt(XMLobjectOnMap.getElementsByTagName("id")[0].childNodes[0].nodeValue, 10);
            this.label = parseInt(XMLobjectOnMap.getElementsByTagName("label")[0].childNodes[0].nodeValue, 10);
            this.description = parseInt(XMLobjectOnMap.getElementsByTagName("description")[0].childNodes[0].nodeValue, 10);
            this.objectId = parseInt(XMLobjectOnMap.getElementsByTagName("objectId")[0].childNodes[0].nodeValue, 10);
            this.researchRequired = parseInt(XMLobjectOnMap.getElementsByTagName("researchRequired")[0].childNodes[0].nodeValue, 10);
            this.colonyCenter = parseInt(XMLobjectOnMap.getElementsByTagName("colonyCenter")[0].childNodes[0].nodeValue, 10);
        };
        return PlanetType;
    }());
    BaseDataModule.PlanetType = PlanetType;
    function getPlanetTypesXML(responseXML) {
        var XMLPlanetTypes = responseXML.getElementsByTagName("PlanetType");
        var length = XMLPlanetTypes.length;
        for (var i = 0; i < length; i++) {
            createUpdatePlanetTypes(XMLPlanetTypes[i]);
        }
        Helpers.Log(length + " planetTypes added");
    }
    BaseDataModule.getPlanetTypesXML = getPlanetTypesXML;
    function PlanetTypesExists(id) {
        if (mainObject.planetTypes[id] != null)
            return true;
        else
            return false;
    }
    ;
    function createUpdatePlanetTypes(XMLobject) {
        var planetTypesId = parseInt(XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        if (PlanetTypesExists(planetTypesId)) // if ship exists, update it.
            mainObject.planetTypes[planetTypesId].update(XMLobject);
        else // if it does not yet exists, add it
            PlanetTypesAdd(XMLobject, planetTypesId);
    }
    function PlanetTypesAdd(XMLobject, id) {
        var newPlanetType = new BaseDataModule.PlanetType(id);
        //add to Building array
        mainObject.planetTypes[id] = newPlanetType;
        //get all Building Data out of the XMLbuilding
        newPlanetType.update(XMLobject);
    }
    ;
    var ObjectOnMap = /** @class */ (function () {
        function ObjectOnMap(id) {
            this.Id = 0;
            this.Movecost = 1;
            this.Damage = 0;
            this.Damagetype = null;
            this.Damageprobability = 0;
            this.Damageprobabilityreducablebyship = false;
            this.Defensebonus = 0;
            this.Fieldsize = 1;
            this.Label = 1;
            this.Id = id;
            this.ObjectImages = [];
        }
        ObjectOnMap.prototype.update = function (XMLobjectOnMap) {
            this.Movecost = parseInt(XMLobjectOnMap.getElementsByTagName("Movecost")[0].childNodes[0].nodeValue, 10);
            this.Damage = parseInt(XMLobjectOnMap.getElementsByTagName("Damage")[0].childNodes[0].nodeValue, 10);
            this.Damagetype = XMLobjectOnMap.getElementsByTagName("Damagetype")[0] && XMLobjectOnMap.getElementsByTagName("Damagetype")[0].childNodes[0] && parseInt(XMLobjectOnMap.getElementsByTagName("Damagetype")[0].childNodes[0].nodeValue, 10) || null;
            this.Damageprobability = parseInt(XMLobjectOnMap.getElementsByTagName("Damageprobability")[0].childNodes[0].nodeValue, 10);
            this.Damageprobabilityreducablebyship = parseInt(XMLobjectOnMap.getElementsByTagName("Damageprobabilityreducablebyship")[0].childNodes[0].nodeValue, 10) == 1 ? true : false;
            this.Defensebonus = parseInt(XMLobjectOnMap.getElementsByTagName("Defensebonus")[0].childNodes[0].nodeValue, 10);
            this.Fieldsize = parseInt(XMLobjectOnMap.getElementsByTagName("Fieldsize")[0].childNodes[0].nodeValue, 10);
            this.Label = parseInt(XMLobjectOnMap.getElementsByTagName("Label")[0].childNodes[0].nodeValue, 10);
            this.ObjectImages = [];
            var XMLObjectImages = XMLobjectOnMap.getElementsByTagName("ObjectImage");
            var length = XMLObjectImages.length;
            for (var i = 0; i < length; i++) {
                var newImage = new ObjectImage();
                newImage.ObjectId = parseInt(XMLObjectImages[i].getElementsByTagName("ObjectId")[0].childNodes[0].nodeValue, 10);
                newImage.ImageId = parseInt(XMLObjectImages[i].getElementsByTagName("ImageId")[0].childNodes[0].nodeValue, 10);
                newImage.Drawsize = parseFloat(XMLObjectImages[i].getElementsByTagName("Drawsize")[0].childNodes[0].nodeValue);
                newImage.BackgroundObjectId = XMLObjectImages[i].getElementsByTagName("BackgroundObjectId")[0] && XMLObjectImages[i].getElementsByTagName("BackgroundObjectId")[0].childNodes[0] && parseInt(XMLObjectImages[i].getElementsByTagName("BackgroundObjectId")[0].childNodes[0].nodeValue, 10) || null;
                newImage.BackgroundDrawSize = XMLObjectImages[i].getElementsByTagName("BackgroundDrawSize")[0] && XMLObjectImages[i].getElementsByTagName("BackgroundDrawSize")[0].childNodes[0] && parseInt(XMLObjectImages[i].getElementsByTagName("BackgroundDrawSize")[0].childNodes[0].nodeValue, 10) || null;
                newImage.TilestartingAt = XMLObjectImages[i].getElementsByTagName("TilestartingAt")[0] && XMLObjectImages[i].getElementsByTagName("TilestartingAt")[0].childNodes[0] && parseInt(XMLObjectImages[i].getElementsByTagName("TilestartingAt")[0].childNodes[0].nodeValue, 10) || null;
                newImage.SurfaceDefaultMapId = XMLObjectImages[i].getElementsByTagName("SurfaceDefaultMapId")[0] && XMLObjectImages[i].getElementsByTagName("SurfaceDefaultMapId")[0].childNodes[0] && parseInt(XMLObjectImages[i].getElementsByTagName("SurfaceDefaultMapId")[0].childNodes[0].nodeValue, 10) || null;
                this.ObjectImages.push(newImage);
                //Helpers.Log("newImage pushed");
            }
            //Helpers.Log(length + " newImages pushed");
        };
        ObjectOnMap.prototype.getImageId = function (id) {
            var imageCount = this.ObjectImages.length;
            if (imageCount == 0)
                return null;
            return this.ObjectImages[id % imageCount].ImageId;
        };
        ObjectOnMap.prototype.getImage = function (id) {
            var imageCount = this.ObjectImages.length;
            if (imageCount == 0)
                return null;
            return this.ObjectImages[id % imageCount];
        };
        return ObjectOnMap;
    }());
    BaseDataModule.ObjectOnMap = ObjectOnMap;
    function getObjectOnMapXML(responseXML) {
        var XMLObjectOnMap = responseXML.getElementsByTagName("ObjectOnMap");
        var length = XMLObjectOnMap.length;
        for (var i = 0; i < length; i++) {
            createUpdateObjectOnMap(XMLObjectOnMap[i]);
        }
        Helpers.Log(length + " ObjectOnMap added");
    }
    BaseDataModule.getObjectOnMapXML = getObjectOnMapXML;
    function objectOnMapsExists(id) {
        if (mainObject.objectOnMaps[id] != null)
            return true;
        else
            return false;
    }
    ;
    function createUpdateObjectOnMap(XMLobject) {
        var objectXMLId = parseInt(XMLobject.getElementsByTagName("Id")[0].childNodes[0].nodeValue);
        if (objectOnMapsExists(objectXMLId)) // if ship exists, update it.
            mainObject.objectOnMaps[objectXMLId].update(XMLobject);
        else // if it does not yet exists, add it
            ObjectOnMapAdd(XMLobject, objectXMLId);
    }
    function ObjectOnMapAdd(XMLobject, id) {
        var newObjectOnMaps = new BaseDataModule.ObjectOnMap(id);
        //add to Building array
        mainObject.objectOnMaps[id] = newObjectOnMaps;
        //get all Building Data out of the XMLbuilding
        newObjectOnMaps.update(XMLobject);
    }
    ;
    var InfluenceRing = /** @class */ (function () {
        function InfluenceRing(influence, ring) {
            this.Influence = 0;
            this.Ring = 1;
            this.Influence = influence;
            this.Ring = ring;
        }
        return InfluenceRing;
    }());
    BaseDataModule.InfluenceRing = InfluenceRing;
    var Good = /** @class */ (function () {
        function Good(id) {
            this.id = id;
            this.name = '';
            this.requiredResearch = 1;
            this.goodsObjectId = 1001; //the objectDescriptionId
        }
        Good.prototype.update = function (XMLgood) {
            var Name = XMLgood.getElementsByTagName("name")[0].childNodes[0].nodeValue;
            //var ResearchId = XMLbuilding.getElementsByTagName("ResearchId")[0].childNodes[0].nodeValue;
            var ObjectId = XMLgood.getElementsByTagName("objectDescriptionId")[0].childNodes[0].nodeValue;
            var goodsType = parseInt(XMLgood.getElementsByTagName("goodsType")[0].childNodes[0].nodeValue, 10);
            var label = parseInt(XMLgood.getElementsByTagName("label")[0].childNodes[0].nodeValue, 10);
            this.label = label;
            this.name = Name;
            this.goodsType = goodsType;
            //this.requiredResearch = ResearchId;
            this.goodsObjectId = ObjectId;
        };
        Good.prototype.Size = function () {
            if (this.goodsType == 2) {
                var Module = BaseDataModule.FindModuleByGoodId(this.id);
                return Module.StorageCost();
            }
            return 1;
        };
        return Good;
    }());
    BaseDataModule.Good = Good;
    var Building = /** @class */ (function () {
        function Building(id) {
            this.id = id;
            //name = '';
            //requiredResearch = 1;
            this.buildingObjectId = 152; //the objectDescriptionId
            this.hasScript = false;
            this.oncePerColony = false;
            this.isBuildable = true;
            this.isScrapable = true;
            this.visibilityNeedsGoods = false;
            this.groupId = 1;
            this.costs = []; //index is goodId: value is the amount that it costs
            this.production = []; //index is goodId: value is the amount that it produces or needs
            this.structure = 100;
            this.housing = 0;
            this.storage = 0;
            this.researchModifier = 0;
            this.assemblyModifier = 0;
            this.energyModifier = 0;
            this.housingModifier = 0;
            this.foodModifier = 0;
            this.productionModifier = 0;
            this.growthModifier = 0;
            this.allowedMines = 0;
            this.allowedFuel = 0;
            this.allowedChemicals = 0;
        }
        Building.prototype.DialogWindowType = function () {
            return DialogWindows.DialogWindowTypeEnum.Building;
        };
        Building.prototype.update = function (XMLbuilding) {
            // buildingName = XMLbuilding.getElementsByTagName("name")[0].childNodes[0].nodeValue;
            //var buildingResearchId = XMLbuilding.getElementsByTagName("ResearchId")[0].childNodes[0].nodeValue;
            var buildingObjectId = XMLbuilding.getElementsByTagName("objectId")[0].childNodes[0].nodeValue;
            var BuildingScript = XMLbuilding.getElementsByTagName("BuildingScript")[0].childNodes[0].nodeValue;
            var isBuildable = XMLbuilding.getElementsByTagName("isBuildable")[0].childNodes[0].nodeValue;
            var oncePerColony = XMLbuilding.getElementsByTagName("oncePerColony")[0].childNodes[0].nodeValue;
            var visibilityNeedsGoods = XMLbuilding.getElementsByTagName("visibilityNeedsGoods")[0].childNodes[0].nodeValue;
            var groupId = parseInt(XMLbuilding.getElementsByTagName("groupId")[0] && XMLbuilding.getElementsByTagName("groupId")[0].childNodes[0].nodeValue || 1);
            var label = parseInt(XMLbuilding.getElementsByTagName("label")[0].childNodes[0].nodeValue, 10);
            var housing = parseInt(XMLbuilding.getElementsByTagName("housing")[0].childNodes[0].nodeValue, 10);
            this.storage = parseInt(XMLbuilding.getElementsByTagName("storage")[0].childNodes[0].nodeValue, 10);
            this.researchModifier = parseInt(XMLbuilding.getElementsByTagName("researchModifier")[0].childNodes[0].nodeValue, 10);
            this.assemblyModifier = parseInt(XMLbuilding.getElementsByTagName("assemblyModifier")[0].childNodes[0].nodeValue, 10);
            this.energyModifier = parseInt(XMLbuilding.getElementsByTagName("energyModifier")[0].childNodes[0].nodeValue, 10);
            this.housingModifier = parseInt(XMLbuilding.getElementsByTagName("housingModifier")[0].childNodes[0].nodeValue, 10);
            this.foodModifier = parseInt(XMLbuilding.getElementsByTagName("foodModifier")[0].childNodes[0].nodeValue, 10);
            this.productionModifier = parseInt(XMLbuilding.getElementsByTagName("productionModifier")[0].childNodes[0].nodeValue, 10);
            this.growthModifier = parseInt(XMLbuilding.getElementsByTagName("growthModifier")[0].childNodes[0].nodeValue, 10);
            this.allowedMines = parseInt(XMLbuilding.getElementsByTagName("allowedMines")[0].childNodes[0].nodeValue, 10);
            this.allowedFuel = parseInt(XMLbuilding.getElementsByTagName("allowedFuel")[0].childNodes[0].nodeValue, 10);
            this.allowedChemicals = parseInt(XMLbuilding.getElementsByTagName("allowedChemicals")[0].childNodes[0].nodeValue, 10);
            this.label = label;
            //this.name = buildingName;
            //this.requiredResearch = buildingResearchId;
            this.buildingObjectId = buildingObjectId;
            if (BuildingScript != 'false') {
                this.hasScript = true;
                this.scriptFile = BuildingPath + BuildingScript;
            }
            this.isBuildable = isBuildable == '1' ? true : false;
            this.visibilityNeedsGoods = visibilityNeedsGoods == '1' ? true : false;
            this.oncePerColony = oncePerColony == '1' || oncePerColony == 'true' ? true : false;
            this.groupId = groupId;
            this.housing = housing;
            //Helpers.Log('groupId ' + groupId );
            var XMLgoods = XMLbuilding.getElementsByTagName("BuildingProduction");
            var length = XMLgoods.length;
            for (var i = 0; i < length; i++) {
                var id = XMLgoods[i].getElementsByTagName("goodsId")[0].childNodes[0].nodeValue;
                var amount = XMLgoods[i].getElementsByTagName("amount")[0].childNodes[0].nodeValue;
                this.production[id] = parseInt(amount);
            }
            XMLgoods = XMLbuilding.getElementsByTagName("BuildingCosts");
            length = XMLgoods.length;
            for (var i = 0; i < length; i++) {
                var id = XMLgoods[i].getElementsByTagName("goodsId")[0].childNodes[0].nodeValue;
                var amount = XMLgoods[i].getElementsByTagName("amount")[0].childNodes[0].nodeValue;
                this.costs[id] = parseInt(amount);
            }
            //TODO: create database field, then export and import this field:
            if (this.id == 1 || this.id == 30 || this.id == 31)
                this.isScrapable = false;
            //Helpers.Log(i + ' BuildingProduction  dem Gebäude hinterlegt.');
        };
        Building.prototype.buildingListTooltip = function (checkColonyStorage) {
            if (checkColonyStorage === void 0) { checkColonyStorage = false; }
            var BuildingTooltip = $("<div/>");
            if (checkColonyStorage) {
                //On colonies, if the building is only allowed a limited number of times, shot the number build and left:
                var Buildingtext = i18n.label(this.label);
                if (this.id == 2 || this.id == 6) {
                    Buildingtext += ' (';
                    Buildingtext += mainObject.currentColony.countBuildings(this.id).toString();
                    Buildingtext += '/';
                    switch (this.id) {
                        case 2:
                            Buildingtext += mainObject.currentColony.allowedMines.toString();
                            break;
                        case 6:
                            Buildingtext += mainObject.currentColony.allowedFuel.toString();
                            break;
                    }
                    Buildingtext += ')';
                }
                BuildingTooltip.append($("<div/>", { text: Buildingtext }));
            }
            else {
                BuildingTooltip.append($("<div/>", { text: i18n.label(this.label) }));
            }
            //buildProduction.append(RealmStatistics.tooltipLine()).append($('<br>'));
            //buildProduction.append(RealmStatistics.tooltipLine()).append($('<br>'));
            if (this.costs.length) {
                BuildingTooltip.append($('<hr/>'));
                BuildingTooltip.append($("<div/>", { text: i18n.label(977) })); // Konstruktion
                for (var goodsIndex = 0; goodsIndex < this.costs.length; goodsIndex++) {
                    if (this.costs[goodsIndex] == null)
                        continue;
                    if (goodsIndex == 8)
                        continue;
                    if (checkColonyStorage && this.costs[goodsIndex] > 0 &&
                        (mainObject.currentColony.goods[goodsIndex] == null
                            || Math.abs(this.costs[goodsIndex]) > mainObject.currentColony.goods[goodsIndex]))
                        borderColor = "borderColorRed";
                    else
                        borderColor = null;
                    var goodsDiv2 = mainInterface.createGoodsDiv(goodsIndex, this.costs[goodsIndex], borderColor);
                    //goodsDiv2.addClass("floatLeft");
                    goodsDiv2.css("display", "inline-block");
                    goodsDiv2.css("margin", "2px");
                    BuildingTooltip.append(goodsDiv2);
                }
            }
            if (this.production.length || this.hasModifier()) {
                BuildingTooltip.append($('<hr/>'));
                BuildingTooltip.append($("<div/>", { text: i18n.label(976) })); //Operating - betrieb
            }
            var borderColor;
            for (var goodsIndex = 0; goodsIndex < this.production.length; goodsIndex++) {
                if (this.production[goodsIndex] == null)
                    continue;
                //if (goodsIndex == 8) continue;
                if (checkColonyStorage && this.production[goodsIndex] < 0 &&
                    (mainObject.currentColony.goods[goodsIndex] == null
                        || Math.abs(this.production[goodsIndex]) > mainObject.currentColony.goods[goodsIndex]))
                    borderColor = "borderColorRed";
                else
                    borderColor = null;
                if (goodsIndex == 6 && checkColonyStorage && this.production[goodsIndex] < 0) { //energy
                    if ((mainObject.currentColony.energyTotal + mainObject.currentColony.energyConsumation) < Math.abs(this.production[goodsIndex]))
                        borderColor = "borderColorRed";
                    else
                        borderColor = null;
                }
                if (goodsIndex == 8 && checkColonyStorage && this.production[goodsIndex] < 0) { //population
                    if ((mainObject.currentColony.populationPoints + mainObject.currentColony.populationConsumation) < Math.abs(this.production[goodsIndex]))
                        borderColor = "borderColorRed";
                    else
                        borderColor = null;
                }
                var goodsDiv2 = mainInterface.createGoodsDiv(goodsIndex, this.production[goodsIndex], borderColor);
                //goodsDiv2.addClass("floatLeft");
                goodsDiv2.css("display", "inline-block");
                goodsDiv2.css("margin", "2px");
                BuildingTooltip.append(goodsDiv2);
            }
            BuildingTooltip.append(this.createModifierDiv());
            return BuildingTooltip;
        };
        //details about this building
        Building.prototype.openBuildingPanel = function (building) {
            if (this.hasScript) {
                //mainObject.scriptsAdmin.loadAndRun(1, this.id, this.scriptFile);
                Scripts.scriptsAdmin.loadAndRun(1, this.id, this.scriptFile);
                return;
            }
            if (this.buildingObjectId === 8) {
                //ToDO: Replace with commNode-View
                CommModule.showCommunications(null);
            }
            DialogWindows.ShowDetails(building);
            return;
        };
        Building.prototype.checkGoodsOnColony = function () {
            //check that all goods needed to build are present
            for (var goodsIndex = 0; goodsIndex < this.costs.length; goodsIndex++) {
                if (this.costs[goodsIndex] == null)
                    continue;
                if (mainObject.currentColony.goods[goodsIndex] === undefined || mainObject.currentColony.goods[goodsIndex] == null || mainObject.currentColony.goods[goodsIndex] < this.costs[goodsIndex])
                    return false;
            }
            //check that the maount  build is OK
            if (this.id == 2 || this.id == 6) {
                var buildingsPresent = mainObject.currentColony.countBuildings(this.id);
                var buildingsAllowed = 0;
                switch (this.id) {
                    case 2:
                        buildingsAllowed = mainObject.currentColony.allowedMines;
                        break;
                    case 6:
                        buildingsAllowed = mainObject.currentColony.allowedFuel;
                        break;
                }
                if (buildingsAllowed <= buildingsPresent)
                    return false;
            }
            return true;
        };
        //detect if this building is buildable on one of the surface tile types in the method argument
        Building.prototype.buildableOnThese = function (surfaceFieldTypes) {
            var buildable = false;
            //compare surfaceTileBuildings with surfaceFieldTypes to detect if the current building is allowed
            for (var i = 0; i < mainObject.surfaceTileBuildings.length; i++) {
                if (!mainObject.surfaceTileBuildings[i])
                    continue;
                if (!mainObject.surfaceTileBuildings[i][this.id])
                    continue;
                if (surfaceFieldTypes[i]) {
                    buildable = true;
                    break;
                }
            }
            return buildable;
        };
        Building.prototype.imagePath = function () {
            return mainObject.imageObjects[this.buildingObjectId].texture.src;
        };
        Building.prototype.hasModifier = function () {
            return this.housing != 0
                || this.storage != 0
                || this.researchModifier != 0
                || this.assemblyModifier != 0
                || this.energyModifier != 0
                || this.housingModifier != 0
                || this.foodModifier != 0
                || this.productionModifier != 0
                || this.growthModifier != 0;
        };
        Building.prototype.createModifierDiv = function () {
            var div = $("<div/>");
            if (this.housing != 0) {
                div.append(modifierDiv(Modificators.HousingAbs, this.housing));
            }
            if (this.storage != 0) {
                div.append(modifierDiv(Modificators.StorageAbs, this.storage));
            }
            if (this.researchModifier != 0) {
                div.append(modifierDiv(Modificators.Research, this.researchModifier));
            }
            if (this.assemblyModifier != 0) {
                div.append(modifierDiv(Modificators.Assembly, this.assemblyModifier));
            }
            if (this.energyModifier != 0) {
                div.append(modifierDiv(Modificators.Energy, this.energyModifier));
            }
            if (this.housingModifier != 0) {
                div.append(modifierDiv(Modificators.Housing, this.housingModifier));
            }
            if (this.foodModifier != 0) {
                div.append(modifierDiv(Modificators.Food, this.foodModifier));
            }
            if (this.productionModifier != 0) {
                div.append(modifierDiv(Modificators.Production, this.productionModifier));
            }
            if (this.growthModifier != 0) {
                div.append(modifierDiv(Modificators.Growth, this.growthModifier));
            }
            if (this.allowedMines != 0) {
                div.append(modifierDiv(Modificators.AllowedMines, this.allowedMines));
            }
            if (this.allowedFuel != 0) {
                div.append(modifierDiv(Modificators.AllowedFuel, this.allowedFuel));
            }
            if (this.allowedChemicals != 0) {
                div.append(modifierDiv(Modificators.AllowedChemicals, this.allowedChemicals));
            }
            return div;
        };
        return Building;
    }());
    BaseDataModule.Building = Building;
    function findBuilding(id) {
        return null;
    }
    BaseDataModule.findBuilding = findBuilding;
    function checkSpecialRessourceMine(buildingId) {
        if (buildingId == 1030 && mainObject.currentColony.planetArea.parentArea.ressourceId != 0)
            return false;
        if (buildingId == 1031 && mainObject.currentColony.planetArea.parentArea.ressourceId != 1)
            return false;
        if (buildingId == 1032 && mainObject.currentColony.planetArea.parentArea.ressourceId != 2)
            return false;
        if (buildingId == 1033 && mainObject.currentColony.planetArea.parentArea.ressourceId != 3)
            return false;
        if (buildingId == 1034 && mainObject.currentColony.planetArea.parentArea.ressourceId != 4)
            return false;
        return true;
    }
    function colonySurfaceFieldTypes() {
        var surfaceFieldTypes = [];
        for (var x = 0; x < 100; x++) {
            for (var y = 0; y < 100; y++) {
                var tileToCheck = (currentMap.map[x] && currentMap.map[x][y] || null);
                if (tileToCheck != null)
                    surfaceFieldTypes[tileToCheck.astronomicalObject.surfaceFieldType] = true;
            }
        }
        return surfaceFieldTypes;
    }
    function buildingTable(accordionDiv, groupNo) {
        //arry to store the different surfacefieldTypes of the current colony
        var surfaceFieldTypes = colonySurfaceFieldTypes();
        var hasBuildings = false;
        var div = $("<div/>");
        div.addClass("buildingListDiv");
        for (var j = 0; j < mainObject.buildings.length; j++) {
            if (mainObject.buildings[j] == null || !PlayerData.buildingAvailable(j) || !mainObject.buildings[j].isBuildable)
                continue;
            if (mainObject.buildings[j].visibilityNeedsGoods && !mainObject.buildings[j].checkGoodsOnColony())
                continue;
            if (mainObject.buildings[j].groupId != groupNo)
                continue;
            if (!mainObject.buildings[j].buildableOnThese(surfaceFieldTypes))
                continue;
            //if (j > 1029 && j < 1035) { if (!checkSpecialRessourceMine(j)) continue; }
            //check if buildings is already present on colony:
            if (mainObject.buildings[j].oncePerColony && mainObject.currentColony.countBuildings(mainObject.buildings[j].id) > 0)
                continue;
            hasBuildings = true;
            div.append(createBuildingDiv(mainObject.buildings[j]));
        }
        //div.append(buildTable);
        if (hasBuildings) {
            //var head = $("<h3/>", { text: i18n.label(276) + ' ' + groupNo.toString() });
            //accordionDiv.append(head);
            accordionDiv.append(div);
        }
    }
    function buildingTable2(accordionDiv, groupNo) {
        var hasBuildings = false;
        var div = $("<div/>");
        div.addClass("buildingListDiv");
        var addRow = false;
        var buildTable = $('<table/>', { "cellspacing": 0, "class": "fullscreenTable width100" }); // , style:"border-collapse: collapse;"
        for (var j = 0; j < mainObject.buildings.length; j++) {
            if (mainObject.buildings[j] == null || !PlayerData.buildingAvailable(j) || !mainObject.buildings[j].isBuildable)
                continue;
            if (mainObject.buildings[j].visibilityNeedsGoods && !mainObject.buildings[j].checkGoodsOnColony())
                continue;
            if (mainObject.buildings[j].groupId != groupNo)
                continue;
            //if (j > 1029 && j < 1035) { if (!checkSpecialRessourceMine(j)) continue; }
            //check if buildings is already present on colony:
            if (mainObject.buildings[j].oncePerColony && mainObject.currentColony.countBuildings(mainObject.buildings[j].id) > 0)
                continue;
            hasBuildings = true;
            //buildTable.append(createBuildingLine(mainObject.buildings[j]));
            div.append(createBuildingDiv(mainObject.buildings[j]));
        }
        //div.append(buildTable);
        if (hasBuildings) {
            var head = $("<h3/>", { text: i18n.label(276) + ' ' + groupNo.toString() });
            accordionDiv.append(head);
            accordionDiv.append(div);
        }
    }
    //a list of all buildings possible on this colony (some buildings 
    function buildingList() {
        var panel = $('#panel-ul-buildings');
        panel.empty();
        var uiAccordion = $("<div/>");
        buildingTable(uiAccordion, 1);
        buildingTable(uiAccordion, 2);
        buildingTable(uiAccordion, 3);
        buildingTable(uiAccordion, 4);
        buildingTable(uiAccordion, 5);
        panel.append(uiAccordion);
        /*
        uiAccordion.accordion({
            "collapsible": true,
            "heightStyle": "content"
        });
        */
        //swithc fokus to the right buildingTable
        //if (mainObject.selectedBuilding != null && mainObject.buildings[mainObject.selectedBuilding] && mainObject.buildings[mainObject.selectedBuilding].groupId > 1)
        //    uiAccordion.accordion({ "active": mainObject.buildings[mainObject.selectedBuilding].groupId - 1 });   
    }
    BaseDataModule.buildingList = buildingList;
    //ToDo: not called atm. Qhy keep it? what was the intention here?
    function buildingList2() {
        var panel = $('#panel-ul-buildings');
        panel.empty();
        var uiAccordion = $("<div/>");
        buildingTable2(uiAccordion, 1);
        buildingTable2(uiAccordion, 2);
        buildingTable2(uiAccordion, 3);
        buildingTable2(uiAccordion, 4);
        buildingTable2(uiAccordion, 5);
        panel.append(uiAccordion);
        uiAccordion.accordion({
            "collapsible": true,
            "heightStyle": "content"
        });
        //swithc fokus to the right buildingTable
        if (mainObject.selectedBuilding != null && mainObject.buildings[mainObject.selectedBuilding] && mainObject.buildings[mainObject.selectedBuilding].groupId > 1)
            uiAccordion.accordion({ "active": mainObject.buildings[mainObject.selectedBuilding].groupId - 1 });
    }
    BaseDataModule.buildingList2 = buildingList2;
    function createBuildingDiv(building) {
        var buildingDiv = $('<div/>', { "Title": '' });
        buildingDiv.data("id", building.id);
        //buildingDiv.css("float","left");
        buildingDiv.addClass("BuildingListBuildingDiv");
        buildingDiv.addClass("buildingListMargin");
        var texturePath = mainObject.imageObjects[building.buildingObjectId].texture.src;
        var buildingImage = $('<div/>');
        var image = $('<div/>', { style: "background: url(" + texturePath + ") no-repeat;background-size: contain;" });
        image.addClass("buildingImage");
        buildingImage.append(image);
        buildingDiv.append(buildingImage);
        buildingDiv.click(function (e) { mainObject.buildingSelected(e); });
        buildingDiv.mousedown(function (event) {
            if (event.button == 2) {
                event.stopPropagation();
                //DialogWindows.showBuildingDetail(building);
                DialogWindows.ShowDetails(building);
                return false;
            }
            return true;
        });
        buildingDiv.tooltip({ content: function () { return building.buildingListTooltip(true).html(); } });
        if (building.checkGoodsOnColony()) {
            buildingImage.addClass("firstchildGreen");
            buildingDiv.addClass("tdGreen");
            buildingDiv.addClass("lastchildGreen");
            if (mainObject.selectedBuilding && mainObject.selectedBuilding == building.id)
                buildingDiv.addClass('selected');
        }
        else {
            buildingImage.addClass("firstchildRed");
            buildingImage.addClass("buildingDisabled");
            buildingDiv.addClass("tdRed");
            buildingDiv.addClass("lastchildRed");
            if (mainObject.selectedBuilding && mainObject.selectedBuilding == building.id) {
                mainObject.buildingDeSelect();
            }
        }
        return buildingDiv;
    }
    var Research = /** @class */ (function () {
        function Research(id) {
            this.id = id;
            this.cost = 0;
            this.NeedsSpecResearchCache = null;
        }
        Research.prototype.DialogWindowType = function () {
            return DialogWindows.DialogWindowTypeEnum.Research;
        };
        Research.prototype.update = function (XMLresearch) {
            //this.name = XMLresearch.getElementsByTagName("name")[0].childNodes[0].nodeValue;
            //Helpers.Log(XMLresearch);            
            this.cost = parseInt(XMLresearch.getElementsByTagName("cost")[0].childNodes[0].nodeValue);
            var label = parseInt(XMLresearch.getElementsByTagName("label")[0].childNodes[0].nodeValue, 10);
            this.label = label;
            var descriptionLabel = parseInt(XMLresearch.getElementsByTagName("descriptionLabel")[0].childNodes[0].nodeValue, 10);
            this.labelDescription = descriptionLabel;
            this.researchType = parseInt(XMLresearch.getElementsByTagName("researchType")[0].childNodes[0].nodeValue, 10);
            this.treeColumn = parseInt(XMLresearch.getElementsByTagName("treeColumn")[0].childNodes[0].nodeValue, 10);
            this.treeRow = parseInt(XMLresearch.getElementsByTagName("treeRow")[0].childNodes[0].nodeValue, 10);
        };
        Research.prototype.TooltipText = function () {
            var Tooltip = i18n.label(this.labelDescription);
            Tooltip += "<br>";
            var PlayerResearch = PlayerData.PlayerResearchFind(this.id);
            if (PlayerResearch.isCompleted) {
                Tooltip += "----------<br>";
                Tooltip += i18n.label(932); //Already researched
                return Tooltip;
            }
            if (!PlayerResearch.isCompleted && PlayerResearch.researchable) {
                Tooltip += "----------<br>";
                Tooltip += i18n.label(933); //Can be researched
                return Tooltip;
            }
            if (this.NeedsAdditionalSpecResearch()) {
                Tooltip += "----------<br>";
                Tooltip += i18n.label(935); //Needs a specific civilization trait
                return Tooltip;
            }
            Tooltip += "----------<br>";
            Tooltip += i18n.label(934); //Not yet researchable
            return Tooltip;
        };
        /// returns true if the user needs a specResearch that he does not have yet...
        Research.prototype.NeedsAdditionalSpecResearch = function () {
            if (this.NeedsSpecResearchCache != null)
                return this.NeedsSpecResearchCache;
            //check if this research has a corresponding PlayerSpecialization
            var Spec = BaseDataModule.FindSpecializationResearch(this.id);
            if (Spec != null) {
                if (Spec.PickState.isFixed()) {
                    this.NeedsSpecResearchCache = false;
                    return this.NeedsSpecResearchCache;
                }
                else {
                    this.NeedsSpecResearchCache = true;
                    return this.NeedsSpecResearchCache;
                }
            }
            //check if one of the prerequisites needs a PlayerSpecialization
            var Sources = BaseDataModule.getObjectRelationSources(this, ObjectTypes.Research);
            for (var i = 0; i < Sources.length; i++) {
                var ResearchPrerequisite = BaseDataModule.researches[Sources[i].sourceId];
                var ResearchPrerequisiteNeedsSpec = ResearchPrerequisite.NeedsAdditionalSpecResearch();
                if (ResearchPrerequisiteNeedsSpec) {
                    this.NeedsSpecResearchCache = true;
                    return this.NeedsSpecResearchCache;
                }
            }
            this.NeedsSpecResearchCache = false;
            return this.NeedsSpecResearchCache;
        };
        //creates a dialog screen for this research (like the one for buildings)
        Research.prototype.Dialog = function () {
            //ShowResearchDetail
        };
        Research.prototype.BackgroundColorLeftSide = function () {
            /*
            appendGradient(def1, "gradBlue" + mode, "White", "#1919FF");
            appendGradient(def1, "gradGreen" + mode, "White", "#00FF00");
            appendGradient(def1, "gradRed" + mode, "White", "#FF0033");
            appendGradient(def1, "gradViolet" + mode, "White", "#FF0066");
            appendGradient(def1, "gradDarkGreen" + mode, "#00FF00", "#008800");
            */
            if (PlayerData.PlayerResearchFind(this.id).isCompleted)
                return "#00FF00";
            if (PlayerData.PlayerResearchFind(this.id).researchable)
                return "White";
            if (this.NeedsAdditionalSpecResearch())
                return "White";
            return "White";
        };
        Research.prototype.BackgroundColorRightSide = function () {
            /*
            appendGradient(def1, "gradBlue" + mode, "White", "#1919FF");
            appendGradient(def1, "gradGreen" + mode, "White", "#00FF00");
            appendGradient(def1, "gradRed" + mode, "White", "#FF0033");
            appendGradient(def1, "gradViolet" + mode, "White", "#FF0066");
            appendGradient(def1, "gradDarkGreen" + mode, "#00FF00", "#008800");
            */
            if (PlayerData.PlayerResearchFind(this.id).isCompleted)
                return "#008800";
            if (PlayerData.PlayerResearchFind(this.id).researchable)
                return "#00FF00";
            if (this.NeedsAdditionalSpecResearch())
                return "#FF0033";
            return "#1919FF";
        };
        return Research;
    }());
    BaseDataModule.Research = Research;
    //Research Now
    function DoResearch(research, afterResearchCallback) {
        if (afterResearchCallback === void 0) { afterResearchCallback = null; }
        Helpers.Log("researchSelected " + research.id);
        if (!PlayerData.PlayerResearchFind(research.id))
            return;
        var PlayerResearch = PlayerData.PlayerResearchFind(research.id);
        if (!PlayerResearch.researchable)
            return;
        PlayerResearch.selected(afterResearchCallback);
    }
    BaseDataModule.DoResearch = DoResearch;
    function researchExists(id) {
        if (BaseDataModule.researches[id] != null)
            return true;
        else
            return false;
    }
    function getResearch(id) {
        if (!researchExists(id))
            return null;
        return BaseDataModule.researches[id];
    }
    var researchAdd = function (XMLResearch) {
        var id = parseInt(XMLResearch.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        var newResearch = new Research(id);
        BaseDataModule.researches[id] = newResearch;
        newResearch.update(XMLResearch);
    };
    var createUpdateResearch = function (XMLResearch) {
        var id = parseInt(XMLResearch.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        if (researchExists(id))
            BaseDataModule.researches[id].update(XMLResearch);
        else
            researchAdd(XMLResearch);
    };
    function getResearchFromXML(responseXML) {
        var XMLResearch = responseXML.getElementsByTagName("Research");
        var length = XMLResearch.length;
        for (var i = 0; i < length; i++) {
            createUpdateResearch(XMLResearch[i]);
        }
        Helpers.Log(length + " Research added or updated");
    }
    BaseDataModule.getResearchFromXML = getResearchFromXML;
    var ResearchGain = /** @class */ (function () {
        function ResearchGain(researchId) {
            this.researchId = researchId;
            this.growth = 0;
            this.research = 0;
            this.energy = 0;
            this.housing = 0;
            this.construction = 0;
            this.industrie = 0;
            this.food = 0;
            this.colonyCount = 0;
            this.fleetCount = 0;
            this.objectId = 0;
        }
        ResearchGain.prototype.update = function (XMLresearch) {
            //this.name = XMLresearch.getElementsByTagName("name")[0].childNodes[0].nodeValue;            
            this.growth = parseInt(XMLresearch.getElementsByTagName("growth")[0].childNodes[0].nodeValue);
            this.research = parseInt(XMLresearch.getElementsByTagName("research")[0].childNodes[0].nodeValue);
            this.energy = parseInt(XMLresearch.getElementsByTagName("energy")[0].childNodes[0].nodeValue);
            this.housing = parseInt(XMLresearch.getElementsByTagName("housing")[0].childNodes[0].nodeValue);
            this.construction = parseInt(XMLresearch.getElementsByTagName("construction")[0].childNodes[0].nodeValue);
            this.industrie = parseInt(XMLresearch.getElementsByTagName("industrie")[0].childNodes[0].nodeValue);
            this.food = parseInt(XMLresearch.getElementsByTagName("food")[0].childNodes[0].nodeValue);
            this.colonyCount = parseInt(XMLresearch.getElementsByTagName("colonyCount")[0].childNodes[0].nodeValue);
            this.fleetCount = parseInt(XMLresearch.getElementsByTagName("fleetCount")[0].childNodes[0].nodeValue);
            this.objectId = parseInt(XMLresearch.getElementsByTagName("objectId")[0].childNodes[0].nodeValue);
        };
        ResearchGain.prototype.createModifierDiv = function () {
            var div = $("<div/>");
            if (this.housing != 0) {
                div.append(modifierRealmStatTooltipDiv(Modificators.Housing, this.housing));
            }
            if (this.research != 0) {
                div.append(modifierRealmStatTooltipDiv(Modificators.Research, this.research));
            }
            if (this.construction != 0) {
                div.append(modifierRealmStatTooltipDiv(Modificators.Assembly, this.construction));
            }
            if (this.energy != 0) {
                div.append(modifierRealmStatTooltipDiv(Modificators.Energy, this.energy));
            }
            if (this.food != 0) {
                div.append(modifierRealmStatTooltipDiv(Modificators.Food, this.food));
            }
            if (this.industrie != 0) {
                div.append(modifierRealmStatTooltipDiv(Modificators.Production, this.industrie));
            }
            if (this.growth != 0) {
                div.append(modifierRealmStatTooltipDiv(Modificators.Growth, this.growth));
            }
            if (this.colonyCount != 0) {
                div.append(modifierRealmStatTooltipDiv(Modificators.ColonyCount, this.colonyCount));
            }
            if (this.fleetCount != 0) {
                div.append(modifierRealmStatTooltipDiv(Modificators.FleetCount, this.fleetCount));
            }
            return div;
        };
        ResearchGain.prototype.createToolTip = function () {
            var toolTipDiv = $("<div/>");
            toolTipDiv.append($("<div/>", { text: i18n.label(BaseDataModule.researches[this.researchId].label) }));
            // toolTipDiv.append($("<div/>", { text:  i18n.label( mainObject.imageObjects[this.objectId].label )}));
            toolTipDiv.append(this.createModifierDiv());
            for (var i = 0; i < mainObject.planetTypes.length; i++) {
                if (!mainObject.planetTypes[i])
                    continue;
                if (mainObject.planetTypes[i].objectId == this.objectId) {
                    //list the stuff from the colony center if there is any:
                    var building = mainObject.buildings[mainObject.planetTypes[i].colonyCenter];
                    toolTipDiv.append(building.createModifierDiv());
                    break;
                }
            }
            return {
                "position": { "my": "left+15 top+30", "at": "right center" },
                "content": function () { return toolTipDiv.html(); }
            };
        };
        return ResearchGain;
    }());
    BaseDataModule.ResearchGain = ResearchGain;
    function researchGainExists(id) {
        if (BaseDataModule.researchGains[id] != null)
            return true;
        else
            return false;
    }
    BaseDataModule.researchGainExists = researchGainExists;
    function getResearchGain(id) {
        if (!researchGainExists(id))
            return null;
        return BaseDataModule.researchGains[id];
    }
    BaseDataModule.getResearchGain = getResearchGain;
    var researchGainAdd = function (XMLResearchGain) {
        var id = parseInt(XMLResearchGain.getElementsByTagName("researchId")[0].childNodes[0].nodeValue);
        var newResearchGain = new ResearchGain(id);
        BaseDataModule.researchGains[id] = newResearchGain;
        newResearchGain.update(XMLResearchGain);
    };
    var createUpdateResearchGain = function (XMLResearchGain) {
        var id = parseInt(XMLResearchGain.getElementsByTagName("researchId")[0].childNodes[0].nodeValue);
        if (researchGainExists(id))
            BaseDataModule.researchGains[id].update(XMLResearchGain);
        else
            researchGainAdd(XMLResearchGain);
    };
    function getResearchGainFromXML(responseXML) {
        var XMLResearchGain = responseXML.getElementsByTagName("ResearchGain");
        var length = XMLResearchGain.length;
        for (var i = 0; i < length; i++) {
            createUpdateResearchGain(XMLResearchGain[i]);
        }
        Helpers.Log(length + " ResearchGains added or updated");
    }
    BaseDataModule.getResearchGainFromXML = getResearchGainFromXML;
    var SurfaceTile = /** @class */ (function () {
        function SurfaceTile(id) {
            this.id = id;
            this.name = '';
            this.objectId = 1;
            this.label = 1;
            this.borderId = 5200;
        }
        SurfaceTile.prototype.update = function (XMLtile) {
            var tileName = XMLtile.getElementsByTagName("name")[0].childNodes[0].nodeValue;
            var objectId = parseInt(XMLtile.getElementsByTagName("objectId")[0].childNodes[0].nodeValue);
            this.name = tileName;
            this.objectId = objectId;
            this.label = parseInt(XMLtile.getElementsByTagName("label")[0].childNodes[0].nodeValue);
            this.borderId = parseInt(XMLtile.getElementsByTagName("borderId")[0].childNodes[0].nodeValue);
        };
        return SurfaceTile;
    }());
    BaseDataModule.SurfaceTile = SurfaceTile;
    // needed for diplomatic relation
    //names are set by the setLanguage-class
    var RelationType = /** @class */ (function () {
        function RelationType(id) {
            this.id = id;
            this.name = '';
            this.backGroundColor = 'red';
            this.backgroundColorClass = null;
            //borderColor = ' style = "border:thin solid red"';
            this.borderColorStyle = 'thin solid red';
            this.backgroundSymbolClass = null;
        }
        return RelationType;
    }());
    BaseDataModule.RelationType = RelationType;
    function readShipModuleStatistics(shipStatistics, xmlData) {
        shipStatistics.crew = parseInt(xmlData.getElementsByTagName("crew")[0].childNodes[0].nodeValue, 10);
        shipStatistics.energy = parseInt(xmlData.getElementsByTagName("energy")[0].childNodes[0].nodeValue, 10);
        shipStatistics.hitpoints = parseInt(xmlData.getElementsByTagName("hitpoints")[0].childNodes[0].nodeValue, 10);
        shipStatistics.damagereduction = parseInt(xmlData.getElementsByTagName("damagereduction")[0].childNodes[0].nodeValue, 10);
        shipStatistics.defense = parseInt(xmlData.getElementsByTagName("Evasion")[0].childNodes[0].nodeValue, 10);
        shipStatistics.attack = parseInt(xmlData.getElementsByTagName("damageoutput")[0].childNodes[0].nodeValue, 10);
        shipStatistics.cargoroom = parseInt(xmlData.getElementsByTagName("cargoroom")[0].childNodes[0].nodeValue, 10);
        shipStatistics.fuelroom = parseInt(xmlData.getElementsByTagName("fuelroom")[0].childNodes[0].nodeValue, 10);
        shipStatistics.galaxyMovesPerTurn = parseInt(xmlData.getElementsByTagName("inSpaceSpeed")[0].childNodes[0].nodeValue, 10);
        shipStatistics.systemMovesPerTurn = parseInt(xmlData.getElementsByTagName("inSystemSpeed")[0].childNodes[0].nodeValue, 10);
        shipStatistics.galaxyMovesMax = parseInt(xmlData.getElementsByTagName("maxSpaceMoves")[0].childNodes[0].nodeValue, 10);
        shipStatistics.systemMovesMax = parseInt(xmlData.getElementsByTagName("maxSystemMoves")[0].childNodes[0].nodeValue, 10);
        shipStatistics.special = parseInt(xmlData.getElementsByTagName("special")[0].childNodes[0].nodeValue, 10);
        shipStatistics.scanRange = parseInt(xmlData.getElementsByTagName("scanRange")[0].childNodes[0].nodeValue, 10);
    }
    BaseDataModule.readShipModuleStatistics = readShipModuleStatistics;
    //#region ShipHull
    var ShipHull = /** @class */ (function () {
        function ShipHull(id) {
            this.id = id;
            this.objectId = 400;
            this.costs = [];
            this.modulePositions = [];
            this.energy = -1;
            this.crew = -2;
            this.scanRange = 2;
            this.attack = 0;
            this.defense = 0;
            this.hitpoints = 1;
            this.damagereduction = 0;
            this.systemMovesPerTurn = 1;
            this.galaxyMovesPerTurn = 0;
            this.systemMovesMax = 3;
            this.galaxyMovesMax = 0;
            this.speedFactor = 1;
        }
        ShipHull.prototype.update = function (XMLhull) {
            var isStarBase = parseInt(XMLhull.getElementsByTagName("isStarBase")[0].childNodes[0].nodeValue, 10);
            var typeName = XMLhull.getElementsByTagName("typename")[0].childNodes[0].nodeValue;
            var labelName = parseInt(XMLhull.getElementsByTagName("labelName")[0].childNodes[0].nodeValue, 10);
            var modulesCount = parseInt(XMLhull.getElementsByTagName("modulesCount")[0].childNodes[0].nodeValue, 10);
            var x1 = XMLhull.getElementsByTagName("templateImageUrl");
            var x2 = XMLhull.getElementsByTagName("templateImageUrl")[0];
            var x3 = XMLhull.getElementsByTagName("templateImageUrl")[0].childNodes;
            //var x4 = XMLgood.getElementsByTagName("templateImageUrl")[0].childNodes[0].nodeValue;
            var templateImageUrl = XMLhull.getElementsByTagName("templateImageUrl")[0].childNodes[0] && XMLhull.getElementsByTagName("templateImageUrl")[0].childNodes[0].nodeValue || '';
            var objectId = parseInt(XMLhull.getElementsByTagName("objectId")[0].childNodes[0].nodeValue, 10);
            var speedFactor = Number(XMLhull.getElementsByTagName("speedFactor")[0].childNodes[0].nodeValue);
            var label = parseInt(XMLhull.getElementsByTagName("label")[0].childNodes[0].nodeValue, 10);
            this.label = label;
            this.speedFactor = speedFactor;
            this.isStarBase = isStarBase == 1 ? true : false;
            this.typeName = typeName;
            this.labelName = labelName;
            this.modulesCount = modulesCount;
            this.templateImageUrl = templateImageUrl;
            this.objectId = objectId;
            this.costs = [];
            var XMLcosts = XMLhull.getElementsByTagName("shipHullCosts");
            var length = XMLcosts.length;
            for (var i = 0; i < length; i++) {
                //var costs = <Node>XMLcosts[i];
                var id = parseInt(XMLcosts[i].getElementsByTagName("goodsId")[0].childNodes[0].nodeValue, 10);
                var amount = parseInt(XMLcosts[i].getElementsByTagName("amount")[0].childNodes[0].nodeValue, 10);
                //var id = costs.getElementsByTagName("goodsId")[0].childNodes[0].nodeValue;
                this.costs[id] = amount;
            }
            this.modulePositions = [];
            var XMLmodPos = XMLhull.getElementsByTagName("ShipHullsModulePositions");
            var length = XMLmodPos.length;
            for (var i = 0; i < length; i++) {
                var posX = XMLmodPos[i].getElementsByTagName("posX")[0].childNodes[0].nodeValue;
                var posY = XMLmodPos[i].getElementsByTagName("posY")[0].childNodes[0].nodeValue;
                var modulePosition = new Ships.ModulePosition();
                modulePosition.posX = parseInt(posX, 10);
                modulePosition.posY = parseInt(posY, 10);
                this.modulePositions.push(modulePosition);
            }
            BaseDataModule.readShipModuleStatistics(this, XMLhull);
            /*
            this.crew = XMLgood.getElementsByTagName("crew")[0].childNodes[0].nodeValue;
            this.energy = XMLgood.getElementsByTagName("energy")[0].childNodes[0].nodeValue;
            this.hitpoints = XMLgood.getElementsByTagName("hitpoints")[0].childNodes[0].nodeValue;
            this.defense = XMLgood.getElementsByTagName("damagereduction")[0].childNodes[0].nodeValue;
            this.attack = XMLgood.getElementsByTagName("damageoutput")[0].childNodes[0].nodeValue;
            this.cargoroom = XMLgood.getElementsByTagName("cargoroom")[0].childNodes[0].nodeValue;
            this.fuelroom = XMLgood.getElementsByTagName("fuelroom")[0].childNodes[0].nodeValue;
            this.galaxyMovesPerTurn = XMLgood.getElementsByTagName("inSpaceSpeed")[0].childNodes[0].nodeValue;
            this.systemMovesPerTurn = XMLgood.getElementsByTagName("inSystemSpeed")[0].childNodes[0].nodeValue;
            this.galaxyMovesMax = XMLgood.getElementsByTagName("maxSpaceMoves")[0].childNodes[0].nodeValue;
            this.systemMovesMax = XMLgood.getElementsByTagName("maxSystemMoves")[0].childNodes[0].nodeValue;
            this.special = XMLgood.getElementsByTagName("special")[0].childNodes[0].nodeValue;
            this.scanRange = XMLgood.getElementsByTagName("scanRange")[0].childNodes[0].nodeValue;
            */
        };
        ShipHull.prototype.modulePositionExists = function (posX, posY) {
            for (var i = 0; i < this.modulePositions.length; i++) {
                if (this.modulePositions[i].posX === posX && this.modulePositions[i].posY === posY)
                    return true;
            }
            return false;
        };
        ShipHull.prototype.getModuleByPosition = function (posX, posY) {
            for (var i = 0; i < this.modulePositions.length; i++) {
                if (this.modulePositions[i].posX === posX && this.modulePositions[i].posY === posY)
                    return this.modulePositions[i];
            }
            return null;
        };
        ShipHull.prototype.imagePath = function () {
            return mainObject.imageObjects[this.objectId].texture.src;
        };
        ShipHull.prototype.tooltipGainDiv = function () {
            var gainDiv = $("<div/>");
            if (this.crew != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(739) + this.crew.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.crew != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(740) + this.energy.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.hitpoints != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(741) + this.hitpoints.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.damagereduction != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(742) + this.damagereduction.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.defense != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(744) + this.defense.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.attack != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(738) + this.attack.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.cargoroom != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(743) + this.cargoroom.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.galaxyMovesPerTurn != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(745) + this.galaxyMovesPerTurn.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.systemMovesPerTurn != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(746) + this.systemMovesPerTurn.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.scanRange != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(747) + this.scanRange.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.modulesCount != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(748) + this.modulesCount.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.speedFactor != 1) {
                gainDiv.append($("<span/>", { text: i18n.label(749) + (this.speedFactor * 100).toString() + '%' }));
                gainDiv.append($("<br/>"));
            }
            return gainDiv;
        };
        ShipHull.prototype.tooltipWithCosts = function (checkColonyStorage) {
            if (checkColonyStorage === void 0) { checkColonyStorage = false; }
            var moduleTooltip = $("<div/>");
            moduleTooltip.append($("<div/>", { text: i18n.label(this.label) }));
            moduleTooltip.append($('<hr/>'));
            moduleTooltip.append(this.tooltipGainDiv());
            moduleTooltip.append($('<hr/>'));
            var borderColor;
            for (var goodsIndex = 0; goodsIndex < this.costs.length; goodsIndex++) {
                if (this.costs[goodsIndex] == null)
                    continue;
                if (goodsIndex == 8)
                    continue;
                if (checkColonyStorage && this.costs[goodsIndex] < 0 &&
                    (mainObject.currentColony.goods[goodsIndex] == null
                        || Math.abs(this.costs[goodsIndex]) > mainObject.currentColony.goods[goodsIndex]))
                    borderColor = "borderColorRed";
                else
                    borderColor = null;
                if (goodsIndex == 6 && checkColonyStorage && this.costs[goodsIndex] < 0) { //energy
                    if ((mainObject.currentColony.energyTotal + mainObject.currentColony.energyConsumation) < Math.abs(this.costs[goodsIndex]))
                        borderColor = "borderColorRed";
                    else
                        borderColor = null;
                }
                var goodsDiv2 = mainInterface.createGoodsDiv(goodsIndex, this.costs[goodsIndex], borderColor);
                goodsDiv2.addClass("floatLeft");
                goodsDiv2.css("margin", "2px");
                moduleTooltip.append(goodsDiv2);
            }
            return moduleTooltip;
        };
        return ShipHull;
    }());
    BaseDataModule.ShipHull = ShipHull;
    function shipHullFirst() {
        for (var i = 0; i < BaseDataModule.shipHulls.length; i++) {
            if (BaseDataModule.shipHulls[i] !== undefined)
                return i;
        }
        return 0;
    }
    BaseDataModule.shipHullFirst = shipHullFirst;
    ;
    function shipHullExists(id) {
        if (BaseDataModule.shipHulls[parseInt(id)] != null)
            return true;
        else
            return false;
    }
    BaseDataModule.shipHullExists = shipHullExists;
    ;
    function shipHullAdd(XMLobject) {
        var id = XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        var newShipHull = new BaseDataModule.ShipHull(id);
        //add to Building array
        BaseDataModule.shipHulls[mainObject.parseInt(id)] = newShipHull;
        //get all Building Data out of the XMLbuilding
        newShipHull.update(XMLobject);
    }
    ;
    function createUpdateShipHull(XMLobject) {
        var objectXMLId = XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        if (shipHullExists(objectXMLId)) // if ship exists, update it.
            BaseDataModule.shipHulls[objectXMLId].update(XMLobject);
        else // if it does not yet exists, add it
            shipHullAdd(XMLobject);
    }
    function getShipHullsFromXML(responseXML) {
        var XMLshipHulls = responseXML.getElementsByTagName("shipHull");
        var length = XMLshipHulls.length;
        for (var i = 0; i < length; i++) {
            createUpdateShipHull(XMLshipHulls[i]);
        }
        Helpers.Log(length + " shipHulls added");
    }
    BaseDataModule.getShipHullsFromXML = getShipHullsFromXML;
    //#endregion
    //#region ShipHullsImages
    var ShipHullsImage = /** @class */ (function () {
        function ShipHullsImage(id) {
            this.id = id;
            this.objectId = 400;
            this.templateImageId = 100;
            this.templateModulesXoffset = 0;
            this.templateModulesYoffset = 0;
        }
        ShipHullsImage.prototype.update = function (XMLhull) {
            var hullId = parseInt(XMLhull.getElementsByTagName("shipHullId")[0].childNodes[0].nodeValue, 10);
            var objectId = parseInt(XMLhull.getElementsByTagName("objectId")[0].childNodes[0].nodeValue, 10);
            var templateImageId = parseInt(XMLhull.getElementsByTagName("templateImageId")[0].childNodes[0].nodeValue, 10);
            var templateModulesXoffset = parseInt(XMLhull.getElementsByTagName("templateModulesXoffset")[0].childNodes[0].nodeValue, 10);
            var templateModulesYoffset = parseInt(XMLhull.getElementsByTagName("templateModulesYoffset")[0].childNodes[0].nodeValue, 10);
            this.hullId = hullId;
            this.objectId = objectId;
            this.templateImageId = templateImageId;
            this.templateModulesXoffset = templateModulesXoffset;
            this.templateModulesYoffset = templateModulesYoffset;
        };
        return ShipHullsImage;
    }());
    BaseDataModule.ShipHullsImage = ShipHullsImage;
    function shipHullsImageFirst(hullId) {
        for (var i = 0; i < BaseDataModule.shipHulls.length; i++) {
            if (BaseDataModule.shipHullsImages[i] !== undefined && BaseDataModule.shipHullsImages[i].hullId == hullId)
                return i;
        }
        return 0;
    }
    BaseDataModule.shipHullsImageFirst = shipHullsImageFirst;
    ;
    function changeShipHullsImage(direction, currentImage) {
        direction = parseInt(direction, 10);
        currentImage = parseInt(currentImage, 10);
        var step = 1;
        if (direction < 0)
            step = -1;
        if (!shipHullsImageExists(currentImage))
            return 0;
        var hullId = BaseDataModule.shipHullsImages[currentImage].hullId;
        var length = BaseDataModule.shipHullsImages.length;
        //iterate the shipHullsImages array. stop if the next one was found. 
        for (var i = currentImage + step; i < length && i >= 0; i += step) {
            if (BaseDataModule.shipHullsImages[i] != null && BaseDataModule.shipHullsImages[i].hullId == hullId)
                return BaseDataModule.shipHullsImages[i].id;
        }
        //start anew on the other side of the array. Worst case should be that the same id as currentImage is returned.
        i = direction > 0 ? 0 : length - 1; //since direction can be reverse ( < 0) 
        for (; i < length && i >= 0; i += step) {
            if (BaseDataModule.shipHullsImages[i] != null && BaseDataModule.shipHullsImages[i].hullId == hullId)
                return BaseDataModule.shipHullsImages[i].id;
        }
        return currentImage;
    }
    BaseDataModule.changeShipHullsImage = changeShipHullsImage;
    ;
    function shipHullsImageExists(id) {
        if (BaseDataModule.shipHullsImages[parseInt(id)] != null)
            return true;
        else
            return false;
    }
    BaseDataModule.shipHullsImageExists = shipHullsImageExists;
    ;
    function shipHullsImageAdd(XMLobject) {
        var id = XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        var newShipHullsImage = new BaseDataModule.ShipHullsImage(id);
        //add to Building array
        BaseDataModule.shipHullsImages[mainObject.parseInt(id)] = newShipHullsImage;
        //get all Building Data out of the XMLbuilding
        newShipHullsImage.update(XMLobject);
    }
    ;
    function createUpdateShipHullsImage(XMLobject) {
        var objectXMLId = XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        if (shipHullsImageExists(objectXMLId)) // if ship exists, update it.
            BaseDataModule.shipHullsImages[objectXMLId].update(XMLobject);
        else // if it does not yet exists, add it
            shipHullsImageAdd(XMLobject);
    }
    function getShipHullsImagesFromXML(responseXML) {
        var XMLshipHullsImages = responseXML.getElementsByTagName("ShipHullsImage");
        var length = XMLshipHullsImages.length;
        for (var i = 0; i < length; i++) {
            createUpdateShipHullsImage(XMLshipHullsImages[i]);
        }
        Helpers.Log(length + " shipHullsImages added");
    }
    BaseDataModule.getShipHullsImagesFromXML = getShipHullsImagesFromXML;
    //#endregion
    //#region ShipModule  
    var ShipModuleTypes;
    (function (ShipModuleTypes) {
        ShipModuleTypes[ShipModuleTypes["Primary"] = 0] = "Primary";
        ShipModuleTypes[ShipModuleTypes["Secondary"] = 1] = "Secondary";
        ShipModuleTypes[ShipModuleTypes["Auxiliary"] = 2] = "Auxiliary";
    })(ShipModuleTypes = BaseDataModule.ShipModuleTypes || (BaseDataModule.ShipModuleTypes = {}));
    var ShipModule = /** @class */ (function () {
        function ShipModule(id) {
            this.id = id;
            //name = '';
            this.objectimageUrl = '';
            this.buildable = true;
            this.costs = []; //index is goodId: value is the amount that it costs
        }
        ShipModule.prototype.update = function (XMLModule) {
            var label = parseInt(XMLModule.getElementsByTagName("label")[0].childNodes[0].nodeValue, 10);
            this.label = label;
            //this.name = XMLModule.getElementsByTagName("name")[0].childNodes[0].nodeValue;
            this.goodsId = XMLModule.getElementsByTagName("goodsId")[0].childNodes[0].nodeValue;
            //var researchable = XMLModule.getElementsByTagName("buildable")[0].childNodes[0].nodeValue;
            this.crew = parseInt(XMLModule.getElementsByTagName("crew")[0].childNodes[0].nodeValue, 10);
            this.energy = parseInt(XMLModule.getElementsByTagName("energy")[0].childNodes[0].nodeValue, 10);
            this.hitpoints = parseInt(XMLModule.getElementsByTagName("hitpoints")[0].childNodes[0].nodeValue, 10);
            this.damagereduction = parseInt(XMLModule.getElementsByTagName("damagereduction")[0].childNodes[0].nodeValue, 10);
            this.defense = 0; //parseInt(XMLModule.getElementsByTagName("damageoutput")[0].childNodes[0].nodeValue, 10); //XMLModule.getElementsByTagName("damagereduction")[0].childNodes[0].nodeValue;
            this.attack = parseInt(XMLModule.getElementsByTagName("damageoutput")[0].childNodes[0].nodeValue, 10);
            this.cargoroom = parseInt(XMLModule.getElementsByTagName("cargoroom")[0].childNodes[0].nodeValue, 10);
            this.fuelroom = parseInt(XMLModule.getElementsByTagName("fuelroom")[0].childNodes[0].nodeValue, 10);
            this.galaxyMovesPerTurn = parseInt(XMLModule.getElementsByTagName("inSpaceSpeed")[0].childNodes[0].nodeValue, 10);
            this.systemMovesPerTurn = parseInt(XMLModule.getElementsByTagName("inSystemSpeed")[0].childNodes[0].nodeValue, 10);
            this.galaxyMovesMax = parseInt(XMLModule.getElementsByTagName("maxSpaceMoves")[0].childNodes[0].nodeValue, 10);
            this.systemMovesMax = parseInt(XMLModule.getElementsByTagName("maxSystemMoves")[0].childNodes[0].nodeValue, 10);
            this.special = parseInt(XMLModule.getElementsByTagName("special")[0].childNodes[0].nodeValue, 10);
            this.scanRange = parseInt(XMLModule.getElementsByTagName("scanRange")[0].childNodes[0].nodeValue, 10);
            this.level = parseInt(XMLModule.getElementsByTagName("level")[0].childNodes[0].nodeValue, 10);
            this.toHitRatio = parseInt(XMLModule.getElementsByTagName("toHitRatio")[0].childNodes[0].nodeValue, 10);
            var XMLgoods = XMLModule.getElementsByTagName("ModulesCosts");
            length = XMLgoods.length;
            for (var i = 0; i < length; i++) {
                var id = XMLgoods[i].getElementsByTagName("goodsId")[0].childNodes[0].nodeValue;
                var amount = XMLgoods[i].getElementsByTagName("amount")[0].childNodes[0].nodeValue;
                this.costs[id] = parseInt(amount);
            }
            if (this.hitpoints > 0 ||
                this.damagereduction > 0 ||
                this.defense > 0 ||
                this.attack > 0)
                this.moduleType = ShipModuleTypes.Secondary;
            if (this.crew > 0 ||
                this.energy > 0 ||
                this.galaxyMovesPerTurn > 0 ||
                this.systemMovesPerTurn > 0 ||
                this.galaxyMovesMax > 0 ||
                this.systemMovesMax > 0 ||
                this.scanRange > 0)
                this.moduleType = ShipModuleTypes.Primary;
            if (this.cargoroom > 0 ||
                this.fuelroom > 0 ||
                this.special > 0)
                this.moduleType = ShipModuleTypes.Auxiliary;
        };
        ShipModule.prototype.StorageCost = function () {
            var Cost = 0;
            for (var goodsIndex = 0; goodsIndex < this.costs.length; goodsIndex++) {
                if (this.costs[goodsIndex] == null)
                    continue;
                //omit all etheral costs (enery, assembly etc)
                if (mainObject.goods[goodsIndex].goodsType == 3)
                    continue;
                if (mainObject.goods[goodsIndex].goodsType == 2) {
                    var SubModule = BaseDataModule.FindModuleByGoodId(goodsIndex);
                    Cost += SubModule.StorageCost();
                    //Cost += 
                    continue;
                }
                Cost += this.costs[goodsIndex];
            }
            Cost = Cost / 5;
            Cost = Math.ceil(Cost);
            return Cost;
        };
        ShipModule.prototype.GoodsAvailable = function (GoodsPresent) {
            for (var goodsIndex = 0; goodsIndex < this.costs.length; goodsIndex++) {
                if (this.costs[goodsIndex] == null)
                    continue;
                //omit all etheral costs (enery, assembly etc)
                if (mainObject.goods[goodsIndex].goodsType == 3)
                    continue;
                if (!GoodsPresent[goodsIndex])
                    return false;
                if (GoodsPresent[goodsIndex] < this.costs[goodsIndex])
                    return false;
            }
            return true;
        };
        ShipModule.prototype.imagePath = function () {
            return mainObject.imageObjects[mainObject.goods[this.goodsId].goodsObjectId].texture.src;
        };
        ShipModule.prototype.tooltipGainDiv = function () {
            var gainDiv = $("<div/>");
            if (this.crew != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(739) + this.crew.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.crew != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(740) + this.energy.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.hitpoints != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(741) + this.hitpoints.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.damagereduction != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(742) + this.damagereduction.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.defense != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(744) + this.defense.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.attack != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(738) + this.attack.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.cargoroom != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(743) + this.cargoroom.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.galaxyMovesPerTurn != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(745) + this.galaxyMovesPerTurn.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.systemMovesPerTurn != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(746) + this.systemMovesPerTurn.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.scanRange != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(747) + this.scanRange.toString() }));
                gainDiv.append($("<br/>"));
            }
            if (this.toHitRatio != 0) {
                gainDiv.append($("<span/>", { text: i18n.label(737) + this.toHitRatio.toString() + '%' }));
                gainDiv.append($("<br/>"));
            }
            if (this.special != 0) {
                var specialText = '';
                switch (this.special) {
                    case 1:
                        specialText = i18n.label(750);
                        break; //colonize
                    case 2:
                        specialText = i18n.label(751);
                        break; //conquer
                    case 3:
                        specialText = i18n.label(752);
                        break; //deploy space station
                }
                gainDiv.append($("<span/>", { text: specialText }));
                gainDiv.append($("<br/>"));
            }
            return gainDiv;
        };
        ShipModule.prototype.tooltipWithCosts = function (checkColonyStorage) {
            if (checkColonyStorage === void 0) { checkColonyStorage = false; }
            var moduleTooltip = $("<div/>");
            moduleTooltip.append($("<div/>", { text: i18n.label(this.label) }));
            moduleTooltip.append($('<hr/>'));
            moduleTooltip.append(this.tooltipGainDiv());
            moduleTooltip.append($('<hr/>'));
            var borderColor;
            for (var goodsIndex = 0; goodsIndex < this.costs.length; goodsIndex++) {
                if (this.costs[goodsIndex] == null)
                    continue;
                if (goodsIndex == 8)
                    continue;
                if (checkColonyStorage && this.costs[goodsIndex] < 0 &&
                    (mainObject.currentColony.goods[goodsIndex] == null
                        || Math.abs(this.costs[goodsIndex]) > mainObject.currentColony.goods[goodsIndex]))
                    borderColor = "borderColorRed";
                else
                    borderColor = null;
                if (goodsIndex == 6 && checkColonyStorage && this.costs[goodsIndex] < 0) { //energy
                    if ((mainObject.currentColony.energyTotal + mainObject.currentColony.energyConsumation) < Math.abs(this.costs[goodsIndex]))
                        borderColor = "borderColorRed";
                    else
                        borderColor = null;
                }
                var goodsDiv2 = mainInterface.createGoodsDiv(goodsIndex, this.costs[goodsIndex], borderColor);
                goodsDiv2.addClass("floatLeft");
                goodsDiv2.css("margin", "2px");
                moduleTooltip.append(goodsDiv2);
            }
            return moduleTooltip;
        };
        ShipModule.prototype.tooltipWithoutCosts = function (checkColonyStorage) {
            if (checkColonyStorage === void 0) { checkColonyStorage = false; }
            var moduleTooltip = $("<div/>");
            moduleTooltip.append($("<div/>", { text: i18n.label(this.label) }));
            moduleTooltip.append($('<hr/>'));
            moduleTooltip.append(this.tooltipGainDiv());
            return moduleTooltip;
        };
        return ShipModule;
    }());
    BaseDataModule.ShipModule = ShipModule;
    function moduleExists(id) {
        if (BaseDataModule.modules[id] != null)
            return true;
        else
            return false;
    }
    BaseDataModule.moduleExists = moduleExists;
    function getModule(id) {
        if (!moduleExists(id))
            return null;
        return BaseDataModule.modules[id];
    }
    BaseDataModule.getModule = getModule;
    function getModuleByGoodsId(id) {
        for (var currentGoodsIndex = 0; currentGoodsIndex < BaseDataModule.modules.length; currentGoodsIndex++) {
            if (BaseDataModule.modules[currentGoodsIndex] == null)
                continue;
            if (BaseDataModule.modules[currentGoodsIndex].goodsId == id)
                return BaseDataModule.modules[currentGoodsIndex];
        }
        return null;
    }
    BaseDataModule.getModuleByGoodsId = getModuleByGoodsId;
    function FindModuleByGoodId(goodId) {
        for (var i = 0; i < BaseDataModule.modules.length; i++) {
            if (BaseDataModule.modules[i] == null)
                continue;
            if (BaseDataModule.modules[i].goodsId == goodId)
                return BaseDataModule.modules[i];
        }
        return null;
    }
    BaseDataModule.FindModuleByGoodId = FindModuleByGoodId;
    var moduleAdd = function (XMLResearch) {
        var id = parseInt(XMLResearch.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        var newResearch = new ShipModule(id);
        BaseDataModule.modules[id] = newResearch;
        newResearch.update(XMLResearch);
    };
    var createUpdateModule = function (XMLResearch) {
        var id = parseInt(XMLResearch.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        if (moduleExists(id))
            BaseDataModule.modules[id].update(XMLResearch);
        else
            moduleAdd(XMLResearch);
    };
    function getModulesFromXML(responseXML) {
        var XMLResearch = responseXML.getElementsByTagName("Module");
        var length = XMLResearch.length;
        for (var i = 0; i < length; i++) {
            createUpdateModule(XMLResearch[i]);
        }
        Helpers.Log(length + " Modules added or updated");
    }
    BaseDataModule.getModulesFromXML = getModulesFromXML;
    //#endregion
    //#region ObjectRelations
    var ObjectRelations = /** @class */ (function () {
        function ObjectRelations() {
        }
        ObjectRelations.prototype.insert = function (XMLModule) {
            var sourceType = parseInt(XMLModule.getElementsByTagName("SourceType")[0].childNodes[0].nodeValue, 10);
            var sourceId = parseInt(XMLModule.getElementsByTagName("SourceId")[0].childNodes[0].nodeValue, 10);
            var targetType = parseInt(XMLModule.getElementsByTagName("TargetType")[0].childNodes[0].nodeValue, 10);
            var targetId = parseInt(XMLModule.getElementsByTagName("TargetId")[0].childNodes[0].nodeValue, 10);
            this.sourceType = sourceType;
            this.sourceId = sourceId;
            this.targetType = targetType;
            this.targetId = targetId;
        };
        //is called after all other basedata is loaded
        ObjectRelations.prototype.setDescribingData = function () {
            this.sourceObject = getRelationObject(this.sourceType, this.sourceId);
            this.sourceName = getRelationObjectName(this.sourceType, this.sourceId);
            this.targetObject = getRelationObject(this.targetType, this.targetId);
            this.targetName = getRelationObjectName(this.targetType, this.targetId);
        };
        return ObjectRelations;
    }());
    BaseDataModule.ObjectRelations = ObjectRelations;
    function updateObjectRelations() {
        for (var i = 0; i < BaseDataModule.objectRelations.length; i++) {
            BaseDataModule.objectRelations[i].setDescribingData();
        }
    }
    BaseDataModule.updateObjectRelations = updateObjectRelations;
    function getObjectType(object) {
        if (object instanceof BaseDataModule.Research)
            return ObjectTypes.Research;
        if (object instanceof QuestModule.Quest)
            return ObjectTypes.Quest;
        if (object instanceof BaseDataModule.Building)
            return ObjectTypes.Building;
        if (object instanceof BaseDataModule.ShipModule)
            return ObjectTypes.ShipModule;
        if (object instanceof BaseDataModule.ShipHull)
            return ObjectTypes.ShipHull;
        if (object instanceof BaseDataModule.Good)
            return ObjectTypes.Good;
        Helpers.Log("error in basedata - 1");
        return null;
    }
    BaseDataModule.getObjectType = getObjectType;
    function getObjectId(object) {
        if (object instanceof BaseDataModule.Research)
            return object.id;
        if (object instanceof QuestModule.Quest)
            return object.id;
        if (object instanceof BaseDataModule.Building)
            return object.id;
        if (object instanceof BaseDataModule.ShipModule)
            return object.id;
        if (object instanceof BaseDataModule.ShipHull)
            return object.id;
        if (object instanceof BaseDataModule.Good)
            return object.id;
        Helpers.Log("error in basedata - 2");
        return 0;
    }
    BaseDataModule.getObjectId = getObjectId;
    function getRelationObject(objectType, objectId) {
        switch (objectType) {
            case ObjectTypes.Research:
                if (researchExists(objectId))
                    return BaseDataModule.researches[objectId];
                Helpers.Log("error in basedata - 4.1");
                return 'r';
            case ObjectTypes.Quest:
                if (QuestModule.questExists(objectId))
                    return QuestModule.getQuest(objectId);
                //Helpers.Log("error in basedata - 4.2");
                return null;
            case ObjectTypes.Building:
                if (mainObject.buildingsExists(objectId))
                    return mainObject.buildings[objectId];
                Helpers.Log("error in basedata - 4.3");
                return 'r';
            case ObjectTypes.ShipModule:
                if (moduleExists(objectId))
                    return BaseDataModule.modules[objectId];
                Helpers.Log("error in basedata - 4.4");
                return 'r';
            case ObjectTypes.ShipHull:
                if (shipHullExists(objectId))
                    return BaseDataModule.shipHulls[objectId];
                Helpers.Log("error in basedata - 4.5");
                return 'r';
            case ObjectTypes.Good:
                if (mainObject.goodExists(objectId))
                    return mainObject.findGood(objectId);
                Helpers.Log("error in basedata - 4.6");
                return 'r';
            default:
                Helpers.Log("error in basedata - 3");
                return '';
        }
    }
    BaseDataModule.getRelationObject = getRelationObject;
    function getRelationObjectName(objectType, objectId) {
        switch (objectType) {
            case ObjectTypes.Research:
                if (researchExists(objectId))
                    return i18n.label(BaseDataModule.researches[objectId].label);
                Helpers.Log("error in basedata - 3.1");
                return 'r';
            case ObjectTypes.Quest:
                if (QuestModule.questExists(objectId))
                    return i18n.label(QuestModule.getQuest(objectId).label);
                //Helpers.Log("error in basedata - 3.2");
                return '';
            case ObjectTypes.Building:
                if (mainObject.buildingsExists(objectId))
                    return i18n.label(mainObject.buildings[objectId].label);
                Helpers.Log("error in basedata - 3.3");
                return 'r';
            case ObjectTypes.ShipModule:
                if (moduleExists(objectId))
                    return i18n.label(BaseDataModule.modules[objectId].label);
                Helpers.Log("error in basedata - 3.4");
                return 'r';
            case ObjectTypes.ShipHull:
                if (shipHullExists(objectId))
                    return i18n.label(BaseDataModule.shipHulls[objectId].label);
                Helpers.Log("error in basedata - 3.5");
                return 'r';
            case ObjectTypes.Good:
                if (mainObject.goodExists(objectId))
                    return i18n.label(mainObject.findGood(objectId).label);
                Helpers.Log("error in basedata - 3.6");
                return 'r';
            default:
                Helpers.Log("error in basedata - 3");
                return '';
        }
    }
    BaseDataModule.getRelationObjectName = getRelationObjectName;
    function getRelationObjectIcon(objectType, objectId) {
        //Only these ObjectTypes are supported, since the other are not yet supported by method getRelationObjectImage
        if (objectType != ObjectTypes.Building && objectType != ObjectTypes.ShipModule && objectType != ObjectTypes.ShipHull)
            return null;
        var RelationObjectIcon = $("<div/>", { "class": "RelationObjectIcon" });
        //get image Path:
        var imageObject = BaseDataModule.getRelationObject(objectType, objectId);
        var imagePath = BaseDataModule.getRelationObjectImage(imageObject);
        RelationObjectIcon.tooltip(getRelationObjectTooltip(objectType, objectId));
        var RelationObjectImage = $("<img/>", { "src": imagePath, "alt": "ResearchGain", "title": "test" });
        RelationObjectImage.css({ "width": "30px", "height": "30px" });
        RelationObjectIcon.append(RelationObjectImage);
        return RelationObjectIcon;
        /*
        switch (objectType) {
            case ObjectTypes.Building:
                if (mainObject.buildingsExists(objectId)) {
                    var Building = mainObject.buildings[objectId];
                    imagePath = mainObject.imageObjects[Building.buildingObjectId].texture.src;
                };
                break;
            case ObjectTypes.ShipModule:
                if (moduleExists(objectId)) {
                    var baseModule = getModule(objectId);
                    var goodId = baseModule.goodsId;
                    imagePath = mainObject.imageObjects[mainObject.goods[goodId].goodsObjectId].texture.src;
                    break;
                }
            case ObjectTypes.ShipHull:
                if (shipHullExists(objectId)) {
                    var baseHull = shipHulls[objectId];
                    var goodId = baseModule.goodsId;
                    imagePath = mainObject.imageObjects[mainObject.goods[goodId].goodsObjectId].texture.src;

                    
                }
                break;
        }
        */
    }
    BaseDataModule.getRelationObjectIcon = getRelationObjectIcon;
    function getRelationObjectTooltip(objectType, objectId, withCosts) {
        if (withCosts === void 0) { withCosts = false; }
        switch (objectType) {
            case ObjectTypes.Research:
                if (researchExists(objectId))
                    return i18n.label(BaseDataModule.researches[objectId].label);
                Helpers.Log("error in basedata - 3.1");
                return 'r';
            case ObjectTypes.Quest:
                if (QuestModule.questExists(objectId))
                    return i18n.label(QuestModule.getQuest(objectId).label);
                //Helpers.Log("error in basedata - 3.2");
                return '';
            case ObjectTypes.Building:
                if (mainObject.buildingsExists(objectId)) {
                    var building = mainObject.buildings[objectId];
                    return {
                        "position": { "my": "left+15 top+30", "at": "right center" },
                        "content": function () { return building.buildingListTooltip().html(); }
                    };
                }
                ;
                Helpers.Log("error in basedata - 3.3");
                return 'r';
            case ObjectTypes.ShipModule:
                if (moduleExists(objectId)) {
                    var baseModule = getModule(objectId);
                    return {
                        "position": { "my": "left+15 top+30", "at": "right center" },
                        "content": function () { return baseModule.tooltipWithCosts().html(); }
                    };
                }
                Helpers.Log("error in basedata - 3.4");
                return 'r';
            case ObjectTypes.ShipHull:
                if (shipHullExists(objectId)) {
                    var baseHull = BaseDataModule.shipHulls[objectId];
                    return {
                        "position": { "my": "left+15 top+30", "at": "right center" },
                        "content": function () { return baseHull.tooltipWithCosts().html(); }
                    };
                }
                Helpers.Log("error in basedata - 3.5");
                return 'r';
            case ObjectTypes.Good:
                if (mainObject.goodExists(objectId))
                    return i18n.label(mainObject.findGood(objectId).label);
                Helpers.Log("error in basedata - 3.6");
                return 'r';
            default:
                Helpers.Log("error in basedata - 3");
                return '';
        }
    }
    BaseDataModule.getRelationObjectTooltip = getRelationObjectTooltip;
    function getRelationObjectImage(object) {
        if (object instanceof BaseDataModule.Research)
            return "NotImplemented";
        if (object instanceof QuestModule.Quest)
            return "NotImplemented";
        if (object instanceof BaseDataModule.Building)
            return object.imagePath();
        if (object instanceof BaseDataModule.ShipModule)
            return object.imagePath();
        if (object instanceof BaseDataModule.ShipHull)
            return object.imagePath();
        if (object instanceof BaseDataModule.Good)
            return object.name;
        return "images/Scout2K.png";
    }
    BaseDataModule.getRelationObjectImage = getRelationObjectImage;
    function hasPreriquisite(targetObject) {
        return true;
    }
    BaseDataModule.hasPreriquisite = hasPreriquisite;
    function getObjectRelationTargets(source, targetType) {
        var returnValue = [];
        var sourceType = getObjectType(source);
        var sourceId = getObjectId(source);
        for (var i = 0; i < BaseDataModule.objectRelations.length; i++) {
            if (BaseDataModule.objectRelations[i].sourceId != sourceId || BaseDataModule.objectRelations[i].sourceType != sourceType)
                continue;
            if (targetType != null) {
                if (BaseDataModule.objectRelations[i].targetType != targetType)
                    continue;
            }
            returnValue.push(BaseDataModule.objectRelations[i]);
        }
        return returnValue;
    }
    BaseDataModule.getObjectRelationTargets = getObjectRelationTargets;
    function getObjectRelationSources(target, sourceType) {
        var returnValue = [];
        var targetType = getObjectType(target);
        var targetId = getObjectId(target);
        for (var i = 0; i < BaseDataModule.objectRelations.length; i++) {
            if (BaseDataModule.objectRelations[i].targetId != targetId || BaseDataModule.objectRelations[i].targetType != targetType)
                continue;
            if (sourceType != null) {
                if (BaseDataModule.objectRelations[i].sourceType != sourceType)
                    continue;
            }
            returnValue.push(BaseDataModule.objectRelations[i]);
        }
        return returnValue;
    }
    BaseDataModule.getObjectRelationSources = getObjectRelationSources;
    function getRelationsFromXML(responseXML) {
        BaseDataModule.objectRelations.length = 0;
        var XMLObjectRelations = responseXML.getElementsByTagName("objectRelation");
        var length = XMLObjectRelations.length;
        for (var i = 0; i < length; i++) {
            var newRelation = new ObjectRelations();
            newRelation.insert(XMLObjectRelations[i]);
            BaseDataModule.objectRelations.push(newRelation);
        }
        Helpers.Log(length + " ObjectRelations added");
    }
    BaseDataModule.getRelationsFromXML = getRelationsFromXML;
    //#endregion
    //#region Player Specialization
    var SpecializationGroup = /** @class */ (function () {
        function SpecializationGroup(id) {
            this.SpecializationResearch = [];
            this.Id = id;
        }
        SpecializationGroup.prototype.SpecializationGroup = function (id) {
            this.Id = id;
            this.SpecializationResearch = [];
        };
        SpecializationGroup.prototype.update = function (XMLSpecializationGroup) {
            //this.name = XMLresearch.getElementsByTagName("name")[0].childNodes[0].nodeValue;
            this.Name = XMLSpecializationGroup.getElementsByTagName("Name")[0].childNodes[0].nodeValue;
            this.Picks = parseInt(XMLSpecializationGroup.getElementsByTagName("Picks")[0].childNodes[0].nodeValue);
            this.Label = parseInt(XMLSpecializationGroup.getElementsByTagName("Label")[0].childNodes[0].nodeValue, 10);
            this.LabelDescription = parseInt(XMLSpecializationGroup.getElementsByTagName("LabelDescription")[0].childNodes[0].nodeValue, 10);
            //Helpers.Log('groupId ' + groupId );
            var XMLSpecializationResearch = XMLSpecializationGroup.getElementsByTagName("SpecializationResearch");
            var length = XMLSpecializationResearch.length;
            for (var i = 0; i < length; i++) {
                var specializationGroupId = parseInt(XMLSpecializationResearch[i].getElementsByTagName("SpecializationGroupId")[0].childNodes[0].nodeValue);
                var researchId = parseInt(XMLSpecializationResearch[i].getElementsByTagName("ResearchId")[0].childNodes[0].nodeValue);
                var secondaryResearchId = XMLSpecializationResearch[i].getElementsByTagName("SecondaryResearchId")[0].childNodes[0] && parseInt(XMLSpecializationResearch[i].getElementsByTagName("SecondaryResearchId")[0].childNodes[0].nodeValue) || null;
                var building1 = XMLSpecializationResearch[i].getElementsByTagName("Building1")[0].childNodes[0] && parseInt(XMLSpecializationResearch[i].getElementsByTagName("Building1")[0].childNodes[0].nodeValue) || null;
                var building2 = XMLSpecializationResearch[i].getElementsByTagName("Building2")[0].childNodes[0] && parseInt(XMLSpecializationResearch[i].getElementsByTagName("Building2")[0].childNodes[0].nodeValue) || null;
                var building3 = XMLSpecializationResearch[i].getElementsByTagName("Building3")[0].childNodes[0] && parseInt(XMLSpecializationResearch[i].getElementsByTagName("Building3")[0].childNodes[0].nodeValue) || null;
                var module1 = XMLSpecializationResearch[i].getElementsByTagName("Module1")[0].childNodes[0] && parseInt(XMLSpecializationResearch[i].getElementsByTagName("Module1")[0].childNodes[0].nodeValue) || null;
                var module2 = XMLSpecializationResearch[i].getElementsByTagName("Module2")[0].childNodes[0] && parseInt(XMLSpecializationResearch[i].getElementsByTagName("Module2")[0].childNodes[0].nodeValue) || null;
                var module3 = XMLSpecializationResearch[i].getElementsByTagName("Module3")[0].childNodes[0] && parseInt(XMLSpecializationResearch[i].getElementsByTagName("Module3")[0].childNodes[0].nodeValue) || null;
                var newSpecResearch = new SpecializationResearch();
                newSpecResearch.SpecializationGroupId = specializationGroupId;
                newSpecResearch.ResearchId = researchId;
                newSpecResearch.SecondaryResearchId = secondaryResearchId == 0 ? null : secondaryResearchId;
                newSpecResearch.Building1 = building1 == 0 ? null : building1;
                newSpecResearch.Building2 = building2 == 0 ? null : building2;
                newSpecResearch.Building3 = building3 == 0 ? null : building3;
                newSpecResearch.Module1 = module1 == 0 ? null : module1;
                newSpecResearch.Module2 = module2 == 0 ? null : module2;
                newSpecResearch.Module3 = module3 == 0 ? null : module3;
                if (mainObject.user.playerResearches[newSpecResearch.ResearchId] &&
                    mainObject.user.playerResearches[newSpecResearch.ResearchId].isCompleted) {
                    newSpecResearch.PickState = SpecializationResearchPickedState;
                }
                this.SpecializationResearch.push(newSpecResearch);
                Helpers.Log('SpecializationResearch added');
            }
        };
        SpecializationGroup.prototype.setPickState = function (user) {
            Helpers.Log('setPickState : ' + user.name);
            var length = this.SpecializationResearch.length;
            for (var i = 0; i < length; i++) {
                var specResearch = this.SpecializationResearch[i];
                if (user.playerResearches[specResearch.ResearchId] &&
                    user.playerResearches[specResearch.ResearchId].isCompleted) {
                    specResearch.PickState = SpecializationResearchPickedState;
                    //Helpers.Log('setPickState : ' + user.name + ' ' + 'SpecializationResearchPickedState');
                }
                else {
                    specResearch.PickState = SpecializationResearchNotPickedState;
                    //Helpers.Log('setPickState : ' + user.name + ' ' + 'SpecializationResearchNotPickedState');
                }
            }
        };
        return SpecializationGroup;
    }());
    BaseDataModule.SpecializationGroup = SpecializationGroup;
    function RefrehsPickState(user) {
        for (var j = 0; j < BaseDataModule.SpecializationGroups.length; j++) {
            var specGroup = BaseDataModule.SpecializationGroups[j];
            specGroup.setPickState(user);
            /*
            var specResearchs = "";
            for (var i = 0; i < specGroup.SpecializationResearch.length; i++) {
                var res = specGroup.SpecializationResearch[i];
                res.s
                if (res.PickState.isPicked() && !res.PickState.isFixed()) {
                    Helpers.Log("SpecializationResearch: " + res.ResearchId);
                    specResearchs += (res.ResearchId.toString() + ";");
                    res.SetResearched();

                    if (mainObject.user.playerResearches[res.ResearchId] != null)
                        mainObject.user.playerResearches[res.ResearchId].isCompleted = true;
                }
            }
            */
        }
    }
    BaseDataModule.RefrehsPickState = RefrehsPickState;
    var SpecializationResearchNotPicked = /** @class */ (function () {
        function SpecializationResearchNotPicked() {
        }
        SpecializationResearchNotPicked.prototype.clicked = function (specResearch, refreshScope, refresh) {
            if (refreshScope === void 0) { refreshScope = null; }
            if (refresh === void 0) { refresh = null; }
            //check that points to spend are still remaining:
            var specGroup = BaseDataModule.getSpecializationGroup(specResearch.SpecializationGroupId);
            var alreadyPicked = 0;
            var pickedResearch = null;
            for (var i = 0; i < specGroup.SpecializationResearch.length; i++) {
                if (specGroup.SpecializationResearch[i].PickState.isPicked()) {
                    alreadyPicked++;
                    pickedResearch = specGroup.SpecializationResearch[i];
                }
            }
            if (alreadyPicked >= specGroup.Picks) {
                if (alreadyPicked > 1)
                    return;
                if (pickedResearch.PickState instanceof SpecializationResearchPicked)
                    return;
                pickedResearch.PickState = SpecializationResearchNotPickedState;
            }
            specResearch.PickState = SpecializationResearchMarkedToPickState;
            if (refreshScope != null && refresh != null)
                refresh.call(refreshScope);
            //userDetail.refreshOverviewPage();
        };
        SpecializationResearchNotPicked.prototype.pickImage = function () {
            var pickDiv = $("<div>", { "class": "inlineBlockTopAlign SpecGroupPick" });
            var circle = $("<div>", { "class": "inlineBlockTopAlign specCircles" });
            circle.addClass("specCirclesEmpty");
            pickDiv.append(circle);
            return pickDiv;
        };
        SpecializationResearchNotPicked.prototype.isPicked = function () {
            return false;
        };
        SpecializationResearchNotPicked.prototype.isFixed = function () {
            return false;
        };
        return SpecializationResearchNotPicked;
    }());
    var SpecializationResearchNotPickedState = new SpecializationResearchNotPicked();
    var SpecializationResearchPicked = /** @class */ (function () {
        function SpecializationResearchPicked() {
        }
        SpecializationResearchPicked.prototype.clicked = function (specResearch, refreshScope, refresh) {
            if (refreshScope === void 0) { refreshScope = null; }
            if (refresh === void 0) { refresh = null; }
        };
        SpecializationResearchPicked.prototype.pickImage = function () {
            var pickDiv = $("<div>", { "class": "inlineBlockTopAlign SpecGroupPick" });
            var circle = $("<div>", { "class": "inlineBlockTopAlign specCircles" });
            circle.addClass("specCirclesFixed");
            pickDiv.append(circle);
            return pickDiv;
        };
        SpecializationResearchPicked.prototype.isPicked = function () {
            return true;
        };
        SpecializationResearchPicked.prototype.isFixed = function () {
            return true;
        };
        return SpecializationResearchPicked;
    }());
    var SpecializationResearchPickedState = new SpecializationResearchPicked();
    var SpecializationResearchMarkedToPick = /** @class */ (function () {
        function SpecializationResearchMarkedToPick() {
        }
        SpecializationResearchMarkedToPick.prototype.clicked = function (specResearch, refreshScope, refresh) {
            if (refreshScope === void 0) { refreshScope = null; }
            if (refresh === void 0) { refresh = null; }
            specResearch.PickState = SpecializationResearchNotPickedState;
            if (refreshScope != null && refresh != null)
                refresh.call(refreshScope);
            //userDetail.refreshOverviewPage();
        };
        SpecializationResearchMarkedToPick.prototype.pickImage = function () {
            var pickDiv = $("<div>", { "class": "inlineBlockTopAlign SpecGroupPick" });
            var circle = $("<div>", { "class": "inlineBlockTopAlign specCircles" });
            circle.addClass("specCirclesMarked");
            pickDiv.append(circle);
            return pickDiv;
        };
        SpecializationResearchMarkedToPick.prototype.isPicked = function () {
            return true;
        };
        SpecializationResearchMarkedToPick.prototype.isFixed = function () {
            return false;
        };
        return SpecializationResearchMarkedToPick;
    }());
    var SpecializationResearchMarkedToPickState = new SpecializationResearchMarkedToPick();
    var SpecializationResearch = /** @class */ (function () {
        function SpecializationResearch() {
            this.AmountTaken = 0;
            this.PickState = new SpecializationResearchNotPicked();
        }
        SpecializationResearch.prototype.SetResearched = function () {
            this.PickState = SpecializationResearchPickedState;
        };
        return SpecializationResearch;
    }());
    BaseDataModule.SpecializationResearch = SpecializationResearch;
    function SpecializationGroupExists(id) {
        if (BaseDataModule.SpecializationGroups[id] != null)
            return true;
        else
            return false;
    }
    function getSpecializationGroup(id) {
        if (!SpecializationGroupExists(id))
            return null;
        return BaseDataModule.SpecializationGroups[id];
    }
    BaseDataModule.getSpecializationGroup = getSpecializationGroup;
    var SpecializationGroupAdd = function (XMLSpecializationGroup) {
        var id = parseInt(XMLSpecializationGroup.getElementsByTagName("Id")[0].childNodes[0].nodeValue);
        var newSpecializationGroup = new SpecializationGroup(id);
        BaseDataModule.SpecializationGroups[id] = newSpecializationGroup;
        newSpecializationGroup.update(XMLSpecializationGroup);
    };
    var createUpdateSpecializationGroup = function (XMLSpecializationGroup) {
        var id = parseInt(XMLSpecializationGroup.getElementsByTagName("Id")[0].childNodes[0].nodeValue);
        if (SpecializationGroupExists(id))
            BaseDataModule.SpecializationGroups[id].update(XMLSpecializationGroup);
        else
            SpecializationGroupAdd(XMLSpecializationGroup);
    };
    function getSpecializationGroupFromXML(responseXML) {
        var XMLSpecializationGroup = responseXML.getElementsByTagName("SpecializationGroup");
        var length = XMLSpecializationGroup.length;
        for (var i = 0; i < length; i++) {
            createUpdateSpecializationGroup(XMLSpecializationGroup[i]);
        }
        Helpers.Log(length + " SpecializationGroups added or updated");
    }
    BaseDataModule.getSpecializationGroupFromXML = getSpecializationGroupFromXML;
    function FindSpecializationResearch(researchId) {
        for (var i = 0; i < BaseDataModule.SpecializationGroups.length; i++) {
            if (BaseDataModule.SpecializationGroups[i] == null)
                continue;
            var currentGroup = BaseDataModule.SpecializationGroups[i];
            for (var j = 0; j < currentGroup.SpecializationResearch.length; j++) {
                if (currentGroup.SpecializationResearch[j] && currentGroup.SpecializationResearch[j].ResearchId == researchId)
                    return currentGroup.SpecializationResearch[j];
            }
        }
        return null;
    }
    BaseDataModule.FindSpecializationResearch = FindSpecializationResearch;
    //#endregion
    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }
    BaseDataModule.sleep = sleep;
    //calcs the storage size of a goods array
    function GoodsArraySize(goods) {
        var goodsCount = 0;
        for (var i = 0; i < goods.length; i++) {
            if (goods[i] == null || goods[i] == 0)
                continue;
            if (mainObject.goods[i] == null)
                continue; //should never occur...
            //if (mainObject.goods[i].goodsType != 1) continue;
            if (mainObject.goods[i].goodsType == 3)
                continue;
            //normal goods are jst added
            if (mainObject.goods[i].goodsType == 1) {
                goodsCount += goods[i];
            }
            //modules cost as much as their production cost:
            if (mainObject.goods[i].goodsType == 2) {
                var Module = BaseDataModule.FindModuleByGoodId(i);
                goodsCount += goods[i] * Module.StorageCost();
            }
        }
        return goodsCount;
    }
    BaseDataModule.GoodsArraySize = GoodsArraySize;
})(BaseDataModule || (BaseDataModule = {}));
var ResearchModule;
(function (ResearchModule) {
    function CountResearchGeneration() {
        var numberOfOverallResearch = 0;
        for (var j = 0; j < ColonyModule.allBuildings.length; j++) {
            if (ColonyModule.allBuildings[j] == null)
                continue;
            if (ColonyModule.allBuildings[j].userId != mainObject.user.id)
                continue;
            //if (ColonyModule.allBuildings[j].buildingId !== 15) continue;
            if (!ColonyModule.allBuildings[j].isActive || ColonyModule.allBuildings[j].underConstruction)
                continue;
            //GoodId 12 stand for generated researchpoints
            if (!mainObject.buildings[ColonyModule.allBuildings[j].buildingId].production[12])
                continue;
            numberOfOverallResearch += mainObject.buildings[ColonyModule.allBuildings[j].buildingId].production[12];
        }
        return numberOfOverallResearch;
    }
    ResearchModule.CountResearchGeneration = CountResearchGeneration;
})(ResearchModule || (ResearchModule = {}));
//# sourceMappingURL=BaseData.js.map