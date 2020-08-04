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
enum ObjectTypes {
    Research = 1,
    Quest = 2,
    Building = 3,
    ShipModule = 4,
    ShipHull = 5,
    Good = 6
};



module BaseDataModule {

    export enum Modificators {
        HousingAbs = 1,
        StorageAbs = 2,
        Research = 3,
        Assembly = 4,
        Energy = 5,
        Housing = 6,
        Food = 7,
        Production = 8,
        Growth = 9,
        ColonyCount = 10,
        FleetCount = 11,
        AllowedMines = 12,
        AllowedChemicals = 13,
        AllowedFuel = 14
    };     

    export var shipHulls: ShipHull[] = [];
    export var shipHullsImages: ShipHullsImage[] = [];
    export var modules: ShipModule[] = [];
    export var researches: Research[] = []; //all possible researches

    export var researchGains: ResearchGain[] = []; //all possible researches

    export var SpecializationGroups: SpecializationGroup[] = [];

    export var x: ImageCache.ImageObject;

    export var objectRelations: ObjectRelations[] = [];



    export function distance(position1: ColRow, position2: ColRow) : number {
        //Pythagoras doesn't help here, since moving diagonally costs the same as horizontally and vertically
        //just tyke the bigger value of the difference between both x's and both y's
        return Math.max(Math.abs(position1.col - position2.col), Math.abs(position1.row - position2.row));
        
    }

    function modifierImageObject(type: Modificators) : number {
        if (type == Modificators.HousingAbs) return 162;
        if (type == Modificators.StorageAbs) return 160;
        if (type == Modificators.Research) return 165;
        if (type == Modificators.Assembly) return 1007;
        if (type == Modificators.Energy) return 1000;
        if (type == Modificators.Housing) return 162;
        if (type == Modificators.Food) return 1002;
        if (type == Modificators.Production) return 163;
        if (type == Modificators.Growth) return 1008;
        if (type == Modificators.ColonyCount) return 24; //planet
        if (type == Modificators.FleetCount) return 200; //ship
        if (type == Modificators.AllowedMines) return 152; //Mine
        if (type == Modificators.AllowedFuel) return 166; //Fuel
        if (type == Modificators.AllowedChemicals) return 166; //Mine
    }

    function modifierTooltip(type: Modificators): number {
        if (type == Modificators.HousingAbs) return 410;
        if (type == Modificators.StorageAbs) return 220;
        if (type == Modificators.Research) return 671;
        if (type == Modificators.Assembly) return 672;
        if (type == Modificators.Energy) return 673;
        if (type == Modificators.Housing) return 674;
        if (type == Modificators.Food) return 675;
        if (type == Modificators.Production) return 676;
        if (type == Modificators.Growth) return 677;
        if (type == Modificators.ColonyCount) return 679; //planet
        if (type == Modificators.FleetCount) return 678; //ship

        if (type == Modificators.AllowedMines) return 44; //Mine
        if (type == Modificators.AllowedFuel) return 47; //Fuel
        if (type == Modificators.AllowedChemicals) return 47; //Mine
    }

    export function modifierName(type: Modificators): number {
        if (type == Modificators.HousingAbs) return 410;
        if (type == Modificators.StorageAbs) return 220;
        if (type == Modificators.Research) return 671;
        if (type == Modificators.Assembly) return 672;
        if (type == Modificators.Energy) return 673;
        if (type == Modificators.Housing) return 674;
        if (type == Modificators.Food) return 675;
        if (type == Modificators.Production) return 676;
        if (type == Modificators.Growth) return 677;
        if (type == Modificators.ColonyCount) return 679; //planet
        if (type == Modificators.FleetCount) return 678; //ship

        if (type == Modificators.AllowedMines) return 679; //Mine
        if (type == Modificators.AllowedFuel) return 679; //Fuel
        if (type == Modificators.AllowedChemicals) return 679; //Mine
    }


    // creates a modifierTooltipDiv with modifierName and value (for colonyDetails)
    export function modifierTooltipDiv(type: Modificators, amount: number): JQuery {
        var modifierDiv = $("<div/>");
       
        var textSpan = $("<span/>");
        var text = amount.toFixed(1);
        if (amount > 0) text = "+" + text;
        if (parseInt(<any>type, 10) > 2) text += "% ";
        textSpan.append($("<span/>", { "text": text }));
        modifierDiv.append(textSpan)    

        var modifierName = $('<span/>', { text: i18n.label(640) });      //from Buildings           
        modifierDiv.append(modifierName);        

        modifierDiv.append($('<br>'));
        modifierDiv.append(RealmStatistics.tooltipLine()).append($('<br>'));

        return modifierDiv;
    }

    //create a modifier line with image and value (for buildingdetail)
    export function modifierDiv(type: Modificators, amount: number): JQuery {
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
        if (text.length > 5) text = amount.toFixed(1);
        if (amount > 0) text = "+" + text;
        if (parseInt(<any>type, 10) > 2 && parseInt(<any>type, 10) < 10) text += "%";

        textDiv.append($("<span/>", { "text": text }));
        modifierDiv.append(textDiv)

        modifierDiv.css("clear", "both");
        modifierDiv.css("padding-top"," 10px");

        return modifierDiv;           
    }


    export function modifierRealmStatTooltipDiv(type: Modificators, amount: number): JQuery {
        var modifierDiv = $("<div/>");

        var modifierName = $('<span/>', { text: i18n.label(BaseDataModule.modifierName(type)) + ': '});      //from Buildings           
        modifierDiv.append(modifierName);                

        var isRatio = (parseInt(<any>type, 10) > 2 && parseInt(<any>type, 10) < 10);

        var textSpan = $("<span/>");
        var text = isRatio ? amount.toFixed(0) : amount.toString();
        if (amount > 0) text = "+" + text;
        if (isRatio) text += "% ";
        textSpan.append($("<span/>", { "text": text }));
        modifierDiv.append(textSpan)

        modifierDiv.append($('<br>'));

        return modifierDiv;
    }

    export class ObjectImage {
        ObjectId = 0;
        ImageId = 0;
        Drawsize = 1;
        BackgroundObjectId: number = null;
        BackgroundDrawSize: number = null;
        TilestartingAt: number = null;
        SurfaceDefaultMapId: number = null;
    }

    export class PlanetType {
        id = 0;
        label = 1;
        description: number = 1;
        objectId: number = 1;
        researchRequired: number = 1;
        colonyCenter: number = 1;

        constructor(id) {
            this.id = id;
        }

        update(XMLobjectOnMap: Element) {

            this.id = parseInt(XMLobjectOnMap.getElementsByTagName("id")[0].childNodes[0].nodeValue, 10);
            this.label = parseInt(XMLobjectOnMap.getElementsByTagName("label")[0].childNodes[0].nodeValue, 10);           
            this.description = parseInt(XMLobjectOnMap.getElementsByTagName("description")[0].childNodes[0].nodeValue, 10);
            this.objectId = parseInt(XMLobjectOnMap.getElementsByTagName("objectId")[0].childNodes[0].nodeValue, 10);
            this.researchRequired = parseInt(XMLobjectOnMap.getElementsByTagName("researchRequired")[0].childNodes[0].nodeValue, 10);
            this.colonyCenter = parseInt(XMLobjectOnMap.getElementsByTagName("colonyCenter")[0].childNodes[0].nodeValue, 10);
        }
    }

    export function getPlanetTypesXML(responseXML: Document) {
        var XMLPlanetTypes = responseXML.getElementsByTagName("PlanetType");
        var length = XMLPlanetTypes.length;
        for (var i = 0; i < length; i++) {
            createUpdatePlanetTypes(<Element>XMLPlanetTypes[i]);
        }
        Helpers.Log(length + " planetTypes added");
    }

    function PlanetTypesExists(id) {
        if (mainObject.planetTypes[id] != null)
            return true;
        else
            return false;

    };

    function createUpdatePlanetTypes(XMLobject) {
        var planetTypesId = parseInt(XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue);

        if (PlanetTypesExists(planetTypesId)) // if ship exists, update it.
            mainObject.planetTypes[planetTypesId].update(XMLobject);
        else // if it does not yet exists, add it
            PlanetTypesAdd(XMLobject, planetTypesId);
    }

    function PlanetTypesAdd(XMLobject, id: number) {
        var newPlanetType = new BaseDataModule.PlanetType(id);

        //add to Building array
        mainObject.planetTypes[id] = newPlanetType;

        //get all Building Data out of the XMLbuilding
        newPlanetType.update(XMLobject);
    };


    export class ObjectOnMap {
        Id = 0;
        Movecost = 1;
        Damage = 0;
        Damagetype: number = null;
        Damageprobability = 0;
        Damageprobabilityreducablebyship = false;
        Defensebonus = 0;
        Fieldsize = 1;
        Label = 1;

        ObjectImages: ObjectImage[];

        constructor(id) {
            this.Id = id;
            this.ObjectImages = [];
        }
        

        update(XMLobjectOnMap: Element) {

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
        }

        getImageId(id: number): number {
            var imageCount = this.ObjectImages.length;
            if (imageCount == 0) return null;

            return this.ObjectImages[id % imageCount].ImageId;
        }

        getImage(id: number): BaseDataModule.ObjectImage {
            var imageCount = this.ObjectImages.length;
            if (imageCount == 0) return null;

            return this.ObjectImages[id % imageCount];
        }
        

    }

    export function getObjectOnMapXML(responseXML: Document) {
        var XMLObjectOnMap = responseXML.getElementsByTagName("ObjectOnMap");
        var length = XMLObjectOnMap.length;
        for (var i = 0; i < length; i++) {
            createUpdateObjectOnMap(<Element>XMLObjectOnMap[i]);
        }
        Helpers.Log(length + " ObjectOnMap added");
    }

    function objectOnMapsExists(id) {
        if (mainObject.objectOnMaps[id] != null)
            return true;
        else
            return false;
    };

    function createUpdateObjectOnMap(XMLobject) {
        var objectXMLId = parseInt(XMLobject.getElementsByTagName("Id")[0].childNodes[0].nodeValue);

        if (objectOnMapsExists(objectXMLId)) // if ship exists, update it.
            mainObject.objectOnMaps[objectXMLId].update(XMLobject);
        else // if it does not yet exists, add it
            ObjectOnMapAdd(XMLobject, objectXMLId);
    }

    function ObjectOnMapAdd(XMLobject, id : number) {       
        var newObjectOnMaps = new BaseDataModule.ObjectOnMap(id);

        //add to Building array
        mainObject.objectOnMaps[id] = newObjectOnMaps;

        //get all Building Data out of the XMLbuilding
        newObjectOnMaps.update(XMLobject);
    };



    export class InfluenceRing {
        Influence = 0;
        Ring = 1;

        constructor(influence, ring) {
            this.Influence = influence;
            this.Ring = ring;
        }
    }


    export class Good {
        name = '';
        requiredResearch = 1;
        goodsObjectId = 1001; //the objectDescriptionId
        goodsType: number; //1 good, 2 module, 3 special 

        label: number;

        constructor(public id) { }

        update(XMLgood) {
            var Name = XMLgood.getElementsByTagName("name")[0].childNodes[0].nodeValue;
            //var ResearchId = XMLbuilding.getElementsByTagName("ResearchId")[0].childNodes[0].nodeValue;
            var ObjectId = XMLgood.getElementsByTagName("objectDescriptionId")[0].childNodes[0].nodeValue;
            var goodsType = parseInt(XMLgood.getElementsByTagName("goodsType")[0].childNodes[0].nodeValue,10);

            var label = parseInt(XMLgood.getElementsByTagName("label")[0].childNodes[0].nodeValue, 10);
            this.label = label;
            this.name = Name;
            this.goodsType = goodsType;
            //this.requiredResearch = ResearchId;
            this.goodsObjectId = ObjectId;
        }

        Size(): number {
            if (this.goodsType == 2) {
                var Module = BaseDataModule.FindModuleByGoodId(this.id);                
                return Module.StorageCost();
            }
            return 1;
        }
    }

    export class Building implements DialogWindows.DialogWindowType{
        //name = '';
        //requiredResearch = 1;
        buildingObjectId = 152; //the objectDescriptionId
        hasScript = false;
        scriptFile: string;

        oncePerColony = false;

        isBuildable = true;
        isScrapable = true;
        visibilityNeedsGoods = false;
        groupId = 1;

        costs: number[] = [];       //index is goodId: value is the amount that it costs
        production: number[] = [];  //index is goodId: value is the amount that it produces or needs

        structure = 100;
        housing = 0;

        storage = 0;
        researchModifier = 0;
        assemblyModifier = 0;
        energyModifier = 0;
        housingModifier = 0;
        foodModifier = 0;
        productionModifier = 0;
        growthModifier = 0;

        allowedMines = 0;
        allowedFuel = 0;
        allowedChemicals = 0;

        label: number;

        constructor(public id : number) { }

        DialogWindowType() {
            return DialogWindows.DialogWindowTypeEnum.Building;
        }

        update(XMLbuilding) {
            // buildingName = XMLbuilding.getElementsByTagName("name")[0].childNodes[0].nodeValue;
            //var buildingResearchId = XMLbuilding.getElementsByTagName("ResearchId")[0].childNodes[0].nodeValue;
            var buildingObjectId = XMLbuilding.getElementsByTagName("objectId")[0].childNodes[0].nodeValue;
            var BuildingScript = XMLbuilding.getElementsByTagName("BuildingScript")[0].childNodes[0].nodeValue;
            var isBuildable = XMLbuilding.getElementsByTagName("isBuildable")[0].childNodes[0].nodeValue;
            var oncePerColony = XMLbuilding.getElementsByTagName("oncePerColony")[0].childNodes[0].nodeValue;
            var visibilityNeedsGoods = XMLbuilding.getElementsByTagName("visibilityNeedsGoods")[0].childNodes[0].nodeValue;
            var groupId =parseInt( XMLbuilding.getElementsByTagName("groupId")[0] && XMLbuilding.getElementsByTagName("groupId")[0].childNodes[0].nodeValue || 1);
                    
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
            if (this.id == 1 || this.id == 30 || this.id == 31 ) this.isScrapable = false;
            
            //Helpers.Log(i + ' BuildingProduction  dem Gebäude hinterlegt.');
        }

        buildingListTooltip(checkColonyStorage = false) :JQuery {
            var BuildingTooltip = $("<div/>");

            if (checkColonyStorage) {
                //On colonies, if the building is only allowed a limited number of times, shot the number build and left:
                var Buildingtext = i18n.label(this.label);
                if (this.id == 2 || this.id == 6)
                {
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
                    if (this.costs[goodsIndex] == null) continue;
                    if (goodsIndex == 8) continue;

                    if (checkColonyStorage && this.costs[goodsIndex] > 0 &&
                        (mainObject.currentColony.goods[goodsIndex] == null
                        || Math.abs(this.costs[goodsIndex]) > mainObject.currentColony.goods[goodsIndex])
                        )
                        borderColor = "borderColorRed";
                    else
                        borderColor = null;

                    var goodsDiv2 = mainInterface.createGoodsDiv(goodsIndex, this.costs[goodsIndex], borderColor);
                    //goodsDiv2.addClass("floatLeft");
                    goodsDiv2.css("display","inline-block");
                    goodsDiv2.css("margin", "2px");
                    BuildingTooltip.append(goodsDiv2);
                }
            }

            if (this.production.length || this.hasModifier()) {
                BuildingTooltip.append($('<hr/>'));
                BuildingTooltip.append($("<div/>", { text: i18n.label(976) })); //Operating - betrieb
            }

            var borderColor: string;
            for (var goodsIndex = 0; goodsIndex < this.production.length; goodsIndex++) {
                
                if (this.production[goodsIndex] == null) continue;
                //if (goodsIndex == 8) continue;

                if (checkColonyStorage && this.production[goodsIndex] < 0 &&
                    (mainObject.currentColony.goods[goodsIndex] == null
                    || Math.abs(this.production[goodsIndex]) > mainObject.currentColony.goods[goodsIndex])
                    )
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
        }

        //details about this building
        openBuildingPanel(building : ColonyModule.ColonyBuilding) {

            if (this.hasScript) {
                //mainObject.scriptsAdmin.loadAndRun(1, this.id, this.scriptFile);
                Scripts.scriptsAdmin.loadAndRun(1, this.id, this.scriptFile);
                return;
            }

            if (this.buildingObjectId === 8) {
                //ToDO: Replace with commNode-View
                CommModule.showCommunications(null);
            }

            DialogWindows.ShowDetails( building);
            return;            
        }

        checkGoodsOnColony(): Boolean {

            //check that all goods needed to build are present
            for (var goodsIndex = 0; goodsIndex < this.costs.length; goodsIndex++) {
                if (this.costs[goodsIndex] == null) continue;
                if (mainObject.currentColony.goods[goodsIndex] ===  undefined || mainObject.currentColony.goods[goodsIndex] == null || mainObject.currentColony.goods[goodsIndex] < this.costs[goodsIndex]) return false;                
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
                if (buildingsAllowed <= buildingsPresent) return false;
            }


            return true;
        }


        //detect if this building is buildable on one of the surface tile types in the method argument
        buildableOnThese(surfaceFieldTypes: boolean[]): boolean {
            var buildable: boolean = false;

            //compare surfaceTileBuildings with surfaceFieldTypes to detect if the current building is allowed

            for (var i = 0; i < mainObject.surfaceTileBuildings.length; i++) {
                if (!mainObject.surfaceTileBuildings[i]) continue;
                if (!mainObject.surfaceTileBuildings[i][this.id]) continue;

                if (surfaceFieldTypes[i]){
                    buildable = true;
                    break;
                }
            }

            return buildable;
        }

        imagePath(): string {
            return mainObject.imageObjects[this.buildingObjectId].texture.src;
        }

        hasModifier(): boolean {
            return this.housing != 0
                || this.storage != 0
                || this.researchModifier != 0
                || this.assemblyModifier != 0
                || this.energyModifier != 0
                || this.housingModifier != 0
                || this.foodModifier != 0
                || this.productionModifier != 0
                || this.growthModifier != 0;
        }

        createModifierDiv():JQuery {
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
        }
    }

    export function findBuilding(id: number) {
        return null;
    }

    function checkSpecialRessourceMine(buildingId : number): boolean {
        if (buildingId == 1030 && mainObject.currentColony.planetArea.parentArea.ressourceId != 0) return false;
        if (buildingId == 1031 && mainObject.currentColony.planetArea.parentArea.ressourceId != 1) return false;
        if (buildingId == 1032 && mainObject.currentColony.planetArea.parentArea.ressourceId != 2) return false;
        if (buildingId == 1033 && mainObject.currentColony.planetArea.parentArea.ressourceId != 3) return false;
        if (buildingId == 1034 && mainObject.currentColony.planetArea.parentArea.ressourceId != 4) return false;
        return true;
    }

    function colonySurfaceFieldTypes(): boolean[] {
        var surfaceFieldTypes: boolean[] = []; 

        for (var x = 0; x < 100; x++) {
            for (var y = 0; y < 100; y++) {
                var tileToCheck: Tile =  (currentMap.map[x] && currentMap.map[x][y] || null);               
                if (tileToCheck != null) surfaceFieldTypes[(<PlanetTile>tileToCheck).stars.surfaceFieldType] = true;
            }
        }

        return surfaceFieldTypes;
    }

    function buildingTable(accordionDiv: JQuery, groupNo: number) {

        //arry to store the different surfacefieldTypes of the current colony
        var surfaceFieldTypes: boolean[] = colonySurfaceFieldTypes();

        var hasBuildings = false;
        var div = $("<div/>");
        div.addClass("buildingListDiv");                
        for (var j = 0; j < mainObject.buildings.length; j++) {

            if (mainObject.buildings[j] == null || !PlayerData.buildingAvailable(j) || !mainObject.buildings[j].isBuildable) continue;
            if (mainObject.buildings[j].visibilityNeedsGoods && !mainObject.buildings[j].checkGoodsOnColony()) continue;
            if (mainObject.buildings[j].groupId != groupNo) continue;
            if (!mainObject.buildings[j].buildableOnThese(surfaceFieldTypes)) continue;
            //if (j > 1029 && j < 1035) { if (!checkSpecialRessourceMine(j)) continue; }
            
            //check if buildings is already present on colony:
            if (mainObject.buildings[j].oncePerColony && mainObject.currentColony.countBuildings(mainObject.buildings[j].id) > 0) continue;
            

            hasBuildings = true;
           
            div.append(createBuildingDiv(mainObject.buildings[j]));

        }
        //div.append(buildTable);

        if (hasBuildings)
        {
            //var head = $("<h3/>", { text: i18n.label(276) + ' ' + groupNo.toString() });
            //accordionDiv.append(head);
            accordionDiv.append(div);
        }                
    }

    function buildingTable2(accordionDiv: JQuery, groupNo: number) {
        var hasBuildings = false;
        var div = $("<div/>");
        div.addClass("buildingListDiv");
        var addRow = false;
        var buildTable = $('<table/>', { "cellspacing": 0, "class": "fullscreenTable width100" });// , style:"border-collapse: collapse;"
        for (var j = 0; j < mainObject.buildings.length; j++) {

            if (mainObject.buildings[j] == null || !PlayerData.buildingAvailable(j) || !mainObject.buildings[j].isBuildable) continue;
            if (mainObject.buildings[j].visibilityNeedsGoods && !mainObject.buildings[j].checkGoodsOnColony()) continue;
            if (mainObject.buildings[j].groupId != groupNo) continue;

            //if (j > 1029 && j < 1035) { if (!checkSpecialRessourceMine(j)) continue; }

            //check if buildings is already present on colony:
            if (mainObject.buildings[j].oncePerColony && mainObject.currentColony.countBuildings(mainObject.buildings[j].id) > 0) continue;


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
    export function buildingList() {

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
    
    //ToDo: not called atm. Qhy keep it? what was the intention here?
    export function buildingList2() {

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

    function createBuildingDiv(building: Building): JQuery {
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
        
        buildingDiv.click((e) => { mainObject.buildingSelected(e); });

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



    export class Research implements DialogWindows.DialogWindowType {     
        cost = 0;           
        label: number;
        labelDescription: number;
        researchType: number;
        treeColumn: number;
        treeRow: number;

        NeedsSpecResearchCache: boolean = null;

        constructor(public id) { }

        DialogWindowType() {
            return DialogWindows.DialogWindowTypeEnum.Research;
        }

        update(XMLresearch) {
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
                                  
        }

        TooltipText() {
            var Tooltip = i18n.label(this.labelDescription);
            Tooltip += "<br>";

            var PlayerResearch = PlayerData.PlayerResearchFind(this.id);

            if (PlayerResearch.isCompleted) {
                Tooltip += "----------<br>"
                Tooltip += i18n.label(932); //Already researched
                return Tooltip;
            } 

            if (!PlayerResearch.isCompleted && PlayerResearch.researchable) {
                Tooltip += "----------<br>"
                Tooltip += i18n.label(933); //Can be researched
                return Tooltip;
            }
            if (this.NeedsAdditionalSpecResearch()) {
                Tooltip += "----------<br>"
                Tooltip += i18n.label(935); //Needs a specific civilization trait
                return Tooltip;
            }

            Tooltip += "----------<br>"
            Tooltip += i18n.label(934); //Not yet researchable
            return Tooltip;
        }

        /// returns true if the user needs a specResearch that he does not have yet...
        NeedsAdditionalSpecResearch(): boolean {
            if (this.NeedsSpecResearchCache != null) return this.NeedsSpecResearchCache;

            //check if this research has a corresponding PlayerSpecialization
            var Spec = BaseDataModule.FindSpecializationResearch(this.id);
            if (Spec != null) {

                if (Spec.PickState.isFixed()) {
                    this.NeedsSpecResearchCache = false;
                    return this.NeedsSpecResearchCache;
                } else {
                    this.NeedsSpecResearchCache = true;
                    return this.NeedsSpecResearchCache;
                }
            }

            //check if one of the prerequisites needs a PlayerSpecialization
            var Sources: BaseDataModule.ObjectRelations[] = BaseDataModule.getObjectRelationSources(this, ObjectTypes.Research);
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
        }

        //creates a dialog screen for this research (like the one for buildings)
        Dialog() {
            //ShowResearchDetail
        }

        BackgroundColorLeftSide(): string {
            /*
            appendGradient(def1, "gradBlue" + mode, "White", "#1919FF");
            appendGradient(def1, "gradGreen" + mode, "White", "#00FF00");
            appendGradient(def1, "gradRed" + mode, "White", "#FF0033");
            appendGradient(def1, "gradViolet" + mode, "White", "#FF0066");
            appendGradient(def1, "gradDarkGreen" + mode, "#00FF00", "#008800");
            */
            if (PlayerData.PlayerResearchFind(this.id).isCompleted) return "#00FF00";
            if (PlayerData.PlayerResearchFind(this.id).researchable) return "White";
            if (this.NeedsAdditionalSpecResearch()) return "White";
            return "White";            
        }

        BackgroundColorRightSide(): string {
            /*
            appendGradient(def1, "gradBlue" + mode, "White", "#1919FF");
            appendGradient(def1, "gradGreen" + mode, "White", "#00FF00");
            appendGradient(def1, "gradRed" + mode, "White", "#FF0033");
            appendGradient(def1, "gradViolet" + mode, "White", "#FF0066");
            appendGradient(def1, "gradDarkGreen" + mode, "#00FF00", "#008800");
            */
            if (PlayerData.PlayerResearchFind(this.id).isCompleted) return "#008800";
            if (PlayerData.PlayerResearchFind(this.id).researchable) return "#00FF00";
            if (this.NeedsAdditionalSpecResearch()) return "#FF0033";
            return "#1919FF";            
        }

    }


    //Research Now
    export function DoResearch(research: Research, afterResearchCallback : ()=>void = null) {
        
        Helpers.Log("researchSelected " + research.id);

        if (!PlayerData.PlayerResearchFind(research.id)) return;
        var PlayerResearch = PlayerData.PlayerResearchFind(research.id);
        if (!PlayerResearch.researchable) return;       
        
        PlayerResearch.selected(afterResearchCallback);


    }




    function researchExists(id: number): boolean {
        if (researches[id] != null)
            return true;
        else
            return false;
    }

    function getResearch(id: number): Research {
        if (!researchExists(id)) return null;
        return researches[id];
    }

    var researchAdd = function (XMLResearch: Element) {
        var id = parseInt(XMLResearch.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        var newResearch = new Research(id);

        researches[id] = newResearch;

        newResearch.update(XMLResearch);
    }

    var createUpdateResearch = function (XMLResearch: Element) {
        var id = parseInt(XMLResearch.getElementsByTagName("id")[0].childNodes[0].nodeValue);

        if (researchExists(id))
            researches[id].update(XMLResearch);
        else
            researchAdd(XMLResearch);
    }

    export function getResearchFromXML(responseXML: Document) {
        var XMLResearch = responseXML.getElementsByTagName("Research");
        var length = XMLResearch.length;
        for (var i = 0; i < length; i++) {
            createUpdateResearch(<Element>XMLResearch[i]);
        }
        Helpers.Log(length + " Research added or updated");    
    }

    export class ResearchGain {
               
        growth = 0;

        research = 0;
        energy = 0;
        housing = 0;

        construction = 0;
        industrie = 0;
        food = 0;
        colonyCount = 0;
        fleetCount = 0;
        objectId = 0;

        constructor(public researchId) { }

        update(XMLresearch) {
            //this.name = XMLresearch.getElementsByTagName("name")[0].childNodes[0].nodeValue;            
            this.growth         = parseInt(XMLresearch.getElementsByTagName("growth")[0].childNodes[0].nodeValue);
            this.research       = parseInt(XMLresearch.getElementsByTagName("research")[0].childNodes[0].nodeValue);
            this.energy         = parseInt(XMLresearch.getElementsByTagName("energy")[0].childNodes[0].nodeValue);
            this.housing        = parseInt(XMLresearch.getElementsByTagName("housing")[0].childNodes[0].nodeValue);            
            this.construction   = parseInt(XMLresearch.getElementsByTagName("construction")[0].childNodes[0].nodeValue);
            this.industrie      = parseInt(XMLresearch.getElementsByTagName("industrie")[0].childNodes[0].nodeValue);
            this.food           = parseInt(XMLresearch.getElementsByTagName("food")[0].childNodes[0].nodeValue);
            this.colonyCount    = parseInt(XMLresearch.getElementsByTagName("colonyCount")[0].childNodes[0].nodeValue);
            this.fleetCount     = parseInt(XMLresearch.getElementsByTagName("fleetCount")[0].childNodes[0].nodeValue);
            this.objectId       = parseInt(XMLresearch.getElementsByTagName("objectId")[0].childNodes[0].nodeValue);            
        }

        createModifierDiv(): JQuery {
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
        }

        createToolTip(): any {                       
            var toolTipDiv = $("<div/>");

            toolTipDiv.append($("<div/>", { text: i18n.label(BaseDataModule.researches[this.researchId].label) }));
   
           // toolTipDiv.append($("<div/>", { text:  i18n.label( mainObject.imageObjects[this.objectId].label )}));
            toolTipDiv.append(this.createModifierDiv());

            for (var i = 0; i < mainObject.planetTypes.length; i++)
            {
                if (!mainObject.planetTypes[i]) continue;
                if (mainObject.planetTypes[i].objectId == this.objectId)
                {
                    //list the stuff from the colony center if there is any:
                    var building: Building = mainObject.buildings[mainObject.planetTypes[i].colonyCenter];
                    toolTipDiv.append(building.createModifierDiv());
                    break;
                }
            }

            return {
                "position": { "my": "left+15 top+30", "at": "right center" }
                , "content": function () { return toolTipDiv.html(); }
            };            
        }
    }

    export function researchGainExists(id: number): boolean {
        if (researchGains[id] != null)
            return true;
        else
            return false;
    }

    export function getResearchGain(id: number): ResearchGain {
        if (!researchGainExists(id)) return null;
        return researchGains[id];
    }

    var researchGainAdd = function (XMLResearchGain: Element) {
        var id = parseInt(XMLResearchGain.getElementsByTagName("researchId")[0].childNodes[0].nodeValue);
        var newResearchGain = new ResearchGain(id);

        researchGains[id] = newResearchGain;
        newResearchGain.update(XMLResearchGain);
    }

    var createUpdateResearchGain = function (XMLResearchGain: Element) {
        var id = parseInt(XMLResearchGain.getElementsByTagName("researchId")[0].childNodes[0].nodeValue);

        if (researchGainExists(id))
            researchGains[id].update(XMLResearchGain);
        else
            researchGainAdd(XMLResearchGain);
    }

    export function getResearchGainFromXML(responseXML: Document) {
        var XMLResearchGain = responseXML.getElementsByTagName("ResearchGain");
        var length = XMLResearchGain.length;
        for (var i = 0; i < length; i++) {
            createUpdateResearchGain(<Element>XMLResearchGain[i]);
        }
        Helpers.Log(length + " ResearchGains added or updated");
    }

    export class SurfaceTile {
        name = '';
        objectId = 1;
        label = 1;
        borderId = 5200;

        constructor(public id) { }
        update(XMLtile) {
            var tileName = XMLtile.getElementsByTagName("name")[0].childNodes[0].nodeValue;
            var objectId = parseInt(XMLtile.getElementsByTagName("objectId")[0].childNodes[0].nodeValue);
            this.name = tileName;
            this.objectId = objectId;
            this.label = parseInt(XMLtile.getElementsByTagName("label")[0].childNodes[0].nodeValue);
            this.borderId = parseInt(XMLtile.getElementsByTagName("borderId")[0].childNodes[0].nodeValue);
        }

    }

    // needed for diplomatic relation
    //names are set by the setLanguage-class
    export class RelationType {
        name = '';
        backGroundColor = 'red';
        backgroundColorClass = null;
        //borderColor = ' style = "border:thin solid red"';
        borderColorStyle = 'thin solid red';
        backgroundSymbolClass = null;
        nameLabel: number;
        descriptionLabel: number;

        constructor(public id: number) { }

    }

    export function readShipModuleStatistics(shipStatistics: ShipModuleStatistics, xmlData: Element) {
        shipStatistics.crew = parseInt(xmlData.getElementsByTagName("crew")[0].childNodes[0].nodeValue,10);
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

    //#region ShipHull

    export class ShipHull implements ShipModuleStatistics {
        
        isStarBase: boolean;
        typeName: string;
        labelName : number;
        modulesCount : number;
        templateImageUrl: string;       
        objectId = 400;

        costs: number[] = [];
        modulePositions: Ships.ModulePosition[] = [];

        energy: number = -1;
        crew: number = -2;
        scanRange: number = 2;
        attack: number= 0;
        defense: number= 0;
        hitpoints: number = 1;
        damagereduction: number = 0;
        systemMovesPerTurn: number = 1;
        galaxyMovesPerTurn: number = 0;
        systemMovesMax: number= 3;
        galaxyMovesMax: number= 0;

        cargoroom: number;
        fuelroom: number;
        special: number;
        label: number;

        speedFactor: number = 1;

        constructor(public id) { }

        update(XMLhull : Element) {
            var isStarBase = parseInt(XMLhull.getElementsByTagName("isStarBase")[0].childNodes[0].nodeValue,10);
            var typeName = XMLhull.getElementsByTagName("typename")[0].childNodes[0].nodeValue;
            var labelName = parseInt(XMLhull.getElementsByTagName("labelName")[0].childNodes[0].nodeValue, 10);
            var modulesCount = parseInt(XMLhull.getElementsByTagName("modulesCount")[0].childNodes[0].nodeValue, 10);

            var x1 = XMLhull.getElementsByTagName("templateImageUrl");
            var x2 = XMLhull.getElementsByTagName("templateImageUrl")[0];
            var x3 = XMLhull.getElementsByTagName("templateImageUrl")[0].childNodes
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
                modulePosition.posX = parseInt(posX,10);
                modulePosition.posY = parseInt(posY,10);
                
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
        }

        modulePositionExists(posX:number,posY:number): boolean{
            for (var i = 0; i < this.modulePositions.length; i++)
            {
                if (this.modulePositions[i].posX === posX && this.modulePositions[i].posY === posY) return true;
            }
            return false;
        }

        getModuleByPosition(posX: number, posY: number): Ships.ModulePosition {
            for (var i = 0; i < this.modulePositions.length; i++) {
                if (this.modulePositions[i].posX === posX && this.modulePositions[i].posY === posY) return this.modulePositions[i];
            }
            return null;
        }

        imagePath(): string {
            return mainObject.imageObjects[this.objectId].texture.src;
        }

        tooltipGainDiv(): JQuery {
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
                gainDiv.append($("<span/>", { text: i18n.label(749) + (this.speedFactor * 100 ).toString() + '%' }));
                gainDiv.append($("<br/>"));
            }

            return gainDiv;

        }

        tooltipWithCosts(checkColonyStorage = false): JQuery {
            var moduleTooltip = $("<div/>");
            moduleTooltip.append($("<div/>", { text: i18n.label(this.label) }));

            moduleTooltip.append($('<hr/>'));
            moduleTooltip.append(this.tooltipGainDiv());

            moduleTooltip.append($('<hr/>'));
            var borderColor: string;
            for (var goodsIndex = 0; goodsIndex < this.costs.length; goodsIndex++) {
                if (this.costs[goodsIndex] == null) continue;
                if (goodsIndex == 8) continue;

                if (checkColonyStorage && this.costs[goodsIndex] < 0 &&
                    (mainObject.currentColony.goods[goodsIndex] == null
                    || Math.abs(this.costs[goodsIndex]) > mainObject.currentColony.goods[goodsIndex])
                    )
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
        }

    }

    export function shipHullFirst():number {
        
        for (var i = 0; i < shipHulls.length; i++) {
            if (shipHulls[i] !== undefined) return i;
        }
        return 0;
    };
    
    export function shipHullExists(id )
    {
        if (shipHulls[parseInt(id)] != null)
            return true;
        else
            return false;
    };

    function shipHullAdd(XMLobject)
    {
        var id = XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        var newShipHull = new BaseDataModule.ShipHull(id);

        //add to Building array
        shipHulls[mainObject.parseInt(id)] = newShipHull;

        //get all Building Data out of the XMLbuilding
        newShipHull.update(XMLobject);
    };

    function createUpdateShipHull(XMLobject)
    {
        var objectXMLId = XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue

        if (shipHullExists(objectXMLId)) // if ship exists, update it.
            shipHulls[objectXMLId].update(XMLobject);
        else // if it does not yet exists, add it
            shipHullAdd(XMLobject);
    }

    export function getShipHullsFromXML(responseXML: Document) {
        var XMLshipHulls = responseXML.getElementsByTagName("shipHull");
        var length = XMLshipHulls.length;
        for (var i = 0; i < length; i++) {
            createUpdateShipHull(<Element>XMLshipHulls[i]);
        }
        Helpers.Log(length + " shipHulls added");
    }
    //#endregion

    //#region ShipHullsImages
    export class ShipHullsImage {

        hullId: number;
        objectId = 400;
        templateImageId = 100;
        templateModulesXoffset = 0;
        templateModulesYoffset = 0;
     
        constructor(public id) { }

        update(XMLhull: Element) {
            var hullId                  = parseInt(XMLhull.getElementsByTagName("shipHullId")[0].childNodes[0].nodeValue            , 10);
            var objectId                = parseInt(XMLhull.getElementsByTagName("objectId")[0].childNodes[0].nodeValue              , 10);
            var templateImageId         = parseInt(XMLhull.getElementsByTagName("templateImageId")[0].childNodes[0].nodeValue       , 10);
            var templateModulesXoffset  = parseInt(XMLhull.getElementsByTagName("templateModulesXoffset")[0].childNodes[0].nodeValue, 10);
            var templateModulesYoffset  = parseInt(XMLhull.getElementsByTagName("templateModulesYoffset")[0].childNodes[0].nodeValue, 10);
            
            this.hullId = hullId;
            this.objectId = objectId;
            this.templateImageId = templateImageId;         
            this.templateModulesXoffset = templateModulesXoffset;
            this.templateModulesYoffset = templateModulesYoffset;
        }        
    }

    export function shipHullsImageFirst(hullId  : number): number {

        for (var i = 0; i < shipHulls.length; i++) {
            if (shipHullsImages[i] !== undefined && shipHullsImages[i].hullId == hullId) return i;
        }
        return 0;
    };

    export function changeShipHullsImage(direction, currentImage): number {    
        direction = parseInt(direction, 10);
        currentImage = parseInt(currentImage, 10);

        var step = 1;
        if (direction < 0) step = -1;

        if (!shipHullsImageExists(currentImage)) return 0;
        var hullId = shipHullsImages[currentImage].hullId;
        var length = shipHullsImages.length;
        //iterate the shipHullsImages array. stop if the next one was found. 
        for (var i = currentImage + step; i < length && i >= 0; i += step) {
            if (shipHullsImages[i] != null && shipHullsImages[i].hullId == hullId) return shipHullsImages[i].id;
        }

        //start anew on the other side of the array. Worst case should be that the same id as currentImage is returned.
        i = direction > 0 ? 0 : length - 1; //since direction can be reverse ( < 0) 
        for (; i < length && i >= 0 ; i += step) {
            if (shipHullsImages[i] != null &&  shipHullsImages[i].hullId == hullId) return shipHullsImages[i].id;
        }
         
        return currentImage;
    };

    export function shipHullsImageExists(id) {
        if (shipHullsImages[parseInt(id)] != null)
            return true;
        else
            return false;
    };

    function shipHullsImageAdd(XMLobject) {
        var id = XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        var newShipHullsImage = new BaseDataModule.ShipHullsImage(id);

        //add to Building array
        shipHullsImages[mainObject.parseInt(id)] = newShipHullsImage;

        //get all Building Data out of the XMLbuilding
        newShipHullsImage.update(XMLobject);
    };

    function createUpdateShipHullsImage(XMLobject) {
        var objectXMLId = XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue

        if (shipHullsImageExists(objectXMLId)) // if ship exists, update it.
            shipHullsImages[objectXMLId].update(XMLobject);
        else // if it does not yet exists, add it
            shipHullsImageAdd(XMLobject);
    }

    export function getShipHullsImagesFromXML(responseXML: Document) {
        var XMLshipHullsImages = responseXML.getElementsByTagName("ShipHullsImage");
        var length = XMLshipHullsImages.length;
        for (var i = 0; i < length; i++) {
            createUpdateShipHullsImage(<Element>XMLshipHullsImages[i]);
        }
        Helpers.Log(length + " shipHullsImages added");
    }
    //#endregion

    //#region ShipModule  
    export enum ShipModuleTypes {
        Primary,
        Secondary,
        Auxiliary
    }

    export class ShipModule implements ShipModuleStatistics {

        //name = '';
        objectimageUrl = '';
        buildable = true;
        goodsId: number;

        crew: number;
        energy: number;
        hitpoints: number;
        damagereduction: number;
        defense: number;
        attack: number;
        cargoroom: number;
        fuelroom: number;
        galaxyMovesPerTurn: number;
        systemMovesPerTurn: number;
        galaxyMovesMax: number;
        systemMovesMax: number;
        special: number;
        scanRange: number;
        toHitRatio: number;
        
        moduleType: ShipModuleTypes;
        level: number;

        costs: number[] = [];       //index is goodId: value is the amount that it costs

        label: number;
  
        constructor(public id) { }

        update(XMLModule) {
           
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
        }

        StorageCost(): number {
            var Cost = 0;

            for (var goodsIndex = 0; goodsIndex < this.costs.length; goodsIndex++) {
                if (this.costs[goodsIndex] == null) continue;

                //omit all etheral costs (enery, assembly etc)
                if (mainObject.goods[goodsIndex].goodsType == 3) continue;

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
        }


        GoodsAvailable(GoodsPresent: number[]): boolean {
            for (var goodsIndex = 0; goodsIndex < this.costs.length; goodsIndex++) {
                if (this.costs[goodsIndex] == null) continue;

                //omit all etheral costs (enery, assembly etc)
                if (mainObject.goods[goodsIndex].goodsType == 3) continue;

                if (!GoodsPresent[goodsIndex]) return false;
                if (GoodsPresent[goodsIndex] < this.costs[goodsIndex]) return false;
            }
            return true;
        }

        imagePath(): string {
            return mainObject.imageObjects[mainObject.goods[this.goodsId].goodsObjectId].texture.src;            
        }

        tooltipGainDiv(): JQuery {
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
                    case 1: specialText = i18n.label(750); break;  //colonize
                    case 2: specialText = i18n.label(751); break;  //conquer
                    case 3: specialText = i18n.label(752); break;  //deploy space station
                }

                gainDiv.append($("<span/>", { text: specialText }));
                gainDiv.append($("<br/>"));
            }
            

            return gainDiv;
        
        }

        tooltipWithCosts(checkColonyStorage = false): JQuery {
            var moduleTooltip = $("<div/>");
            moduleTooltip.append($("<div/>", { text: i18n.label(this.label) }));

            moduleTooltip.append($('<hr/>'));
            moduleTooltip.append(this.tooltipGainDiv());

            moduleTooltip.append($('<hr/>'));
            var borderColor: string;
            for (var goodsIndex = 0; goodsIndex < this.costs.length; goodsIndex++) {
                if (this.costs[goodsIndex] == null) continue;
                if (goodsIndex == 8) continue;

                if (checkColonyStorage && this.costs[goodsIndex] < 0 &&
                    (mainObject.currentColony.goods[goodsIndex] == null
                    || Math.abs(this.costs[goodsIndex]) > mainObject.currentColony.goods[goodsIndex])
                    )
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
        }

        tooltipWithoutCosts(checkColonyStorage = false): JQuery {
            var moduleTooltip = $("<div/>");
            moduleTooltip.append($("<div/>", { text: i18n.label(this.label) }));

            moduleTooltip.append($('<hr/>'));
            moduleTooltip.append(this.tooltipGainDiv());

            return moduleTooltip;
        }
    }

    export function moduleExists(id: number): boolean {
        if (modules[id] != null)
            return true;
        else
            return false;
    }

    export function getModule(id: number): ShipModule {
        if (!moduleExists(id)) return null;
        return modules[id];
    }

    export function getModuleByGoodsId(id: number): ShipModule {

        for (var currentGoodsIndex = 0; currentGoodsIndex < modules.length; currentGoodsIndex++) {
            if (modules[currentGoodsIndex] == null) continue;
            if (modules[currentGoodsIndex].goodsId == id) return modules[currentGoodsIndex];            
        }

        return null;
    }

    
    export function FindModuleByGoodId(goodId: number): ShipModule {
        for (var i = 0; i < modules.length;i++){
            if (modules[i] == null) continue;
            if (modules[i].goodsId == goodId) return modules[i];
        }
        return null;
    }

    var moduleAdd = function (XMLResearch: Element) {
        var id = parseInt(XMLResearch.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        var newResearch = new ShipModule(id);

        modules[id] = newResearch;

        newResearch.update(XMLResearch);
    }

    var createUpdateModule = function (XMLResearch: Element) {
        var id = parseInt(XMLResearch.getElementsByTagName("id")[0].childNodes[0].nodeValue);

        if (moduleExists(id))
            modules[id].update(XMLResearch);
        else
            moduleAdd(XMLResearch);
    }

    export function getModulesFromXML(responseXML: Document) {
        var XMLResearch = responseXML.getElementsByTagName("Module");
        var length = XMLResearch.length;
        for (var i = 0; i < length; i++) {
            createUpdateModule(<Element>XMLResearch[i]);
        }
        Helpers.Log(length + " Modules added or updated");
    }
    //#endregion

    //#region ObjectRelations
    export class ObjectRelations  {
        sourceType: number;
        sourceId: number;
        targetType: number;
        targetId: number;  

        sourceObject: any;
        sourceName: string;       
        sourceImage: string;

        targetObject: any;
        targetName: string;
        targetImage: string;

        constructor( ) { }

        insert(XMLModule) {

            var sourceType  = parseInt(XMLModule.getElementsByTagName("SourceType")[0].childNodes[0].nodeValue, 10);
            var sourceId    = parseInt(XMLModule.getElementsByTagName("SourceId")[0].childNodes[0].nodeValue, 10);
            var targetType  = parseInt(XMLModule.getElementsByTagName("TargetType")[0].childNodes[0].nodeValue, 10);
            var targetId    = parseInt(XMLModule.getElementsByTagName("TargetId")[0].childNodes[0].nodeValue, 10);
            
            this.sourceType = sourceType;
            this.sourceId   = sourceId;
            this.targetType = targetType;
            this.targetId   = targetId;            
        }

        //is called after all other basedata is loaded
        setDescribingData() {
            this.sourceObject   = getRelationObject(this.sourceType, this.sourceId);
            this.sourceName     = getRelationObjectName(this.sourceType, this.sourceId);

            this.targetObject   = getRelationObject(this.targetType, this.targetId);
            this.targetName     = getRelationObjectName(this.targetType, this.targetId);
        }
    }



    export function updateObjectRelations() {
        for (var i = 0; i < objectRelations.length; i++) {
            objectRelations[i].setDescribingData();
        }
    }

    export function getObjectType(object: any): ObjectTypes {
        if (object instanceof BaseDataModule.Research) return ObjectTypes.Research;
        if (object instanceof QuestModule.Quest) return ObjectTypes.Quest;
        if (object instanceof BaseDataModule.Building) return ObjectTypes.Building;
        if (object instanceof BaseDataModule.ShipModule) return ObjectTypes.ShipModule;
        if (object instanceof BaseDataModule.ShipHull) return ObjectTypes.ShipHull;
        if (object instanceof BaseDataModule.Good) return ObjectTypes.Good;

        Helpers.Log("error in basedata - 1");
        return null;
    }
    
    export function getObjectId(object: any): number {
        if (object instanceof BaseDataModule.Research) return object.id;
        if (object instanceof QuestModule.Quest) return object.id;
        if (object instanceof BaseDataModule.Building) return object.id;
        if (object instanceof BaseDataModule.ShipModule) return object.id;
        if (object instanceof BaseDataModule.ShipHull) return object.id;
        if (object instanceof BaseDataModule.Good) return object.id;

        Helpers.Log("error in basedata - 2");
        return 0;
    }

    export function getRelationObject(objectType: ObjectTypes, objectId: number): any {

        switch (objectType) {
            case ObjectTypes.Research:
                if (researchExists(objectId)) return researches[objectId];
                Helpers.Log("error in basedata - 4.1");
                return 'r';
            case ObjectTypes.Quest:
                if (QuestModule.questExists(objectId)) return QuestModule.getQuest(objectId);
                //Helpers.Log("error in basedata - 4.2");
                return null;
            case ObjectTypes.Building:
                if (mainObject.buildingsExists(objectId)) return mainObject.buildings[objectId];
                Helpers.Log("error in basedata - 4.3");
                return 'r';
            case ObjectTypes.ShipModule:
                if (moduleExists(objectId)) return modules[objectId];
                Helpers.Log("error in basedata - 4.4");
                return 'r';
            case ObjectTypes.ShipHull:
                if (shipHullExists(objectId)) return shipHulls[objectId];
                Helpers.Log("error in basedata - 4.5");
                return 'r';
            case ObjectTypes.Good:
                if (mainObject.goodExists(objectId)) return mainObject.findGood(objectId);
                Helpers.Log("error in basedata - 4.6");
                return 'r';
        }

        Helpers.Log("error in basedata - 3");
        return '';
    }

    export function getRelationObjectName(objectType: ObjectTypes, objectId : number): string {

        switch (objectType) {
            case ObjectTypes.Research:
                if (researchExists(objectId)) return i18n.label( researches[objectId].label);
                Helpers.Log("error in basedata - 3.1");
                return 'r';
            case ObjectTypes.Quest:
                if (QuestModule.questExists(objectId)) return i18n.label(QuestModule.getQuest(objectId).label);
                //Helpers.Log("error in basedata - 3.2");
                return '';
            case ObjectTypes.Building:
                if (mainObject.buildingsExists(objectId)) return i18n.label(mainObject.buildings[objectId].label);
                Helpers.Log("error in basedata - 3.3");
                return 'r';
            case ObjectTypes.ShipModule:
                if (moduleExists(objectId)) return i18n.label(modules[objectId].label);
                Helpers.Log("error in basedata - 3.4");
                return 'r';
            case ObjectTypes.ShipHull:
                if (shipHullExists(objectId)) return i18n.label(shipHulls[objectId].label);
                Helpers.Log("error in basedata - 3.5");
                return 'r';
            case ObjectTypes.Good:
                if (mainObject.goodExists(objectId)) return i18n.label(mainObject.findGood(objectId).label);
                Helpers.Log("error in basedata - 3.6");
                return 'r';
        }

        Helpers.Log("error in basedata - 3");
        return '';
    }
    
    export function getRelationObjectIcon(objectType: ObjectTypes, objectId: number): JQuery {
         //Only these ObjectTypes are supported, since the other are not yet supported by method getRelationObjectImage
        if (objectType != ObjectTypes.Building && objectType != ObjectTypes.ShipModule && objectType != ObjectTypes.ShipHull) return null;
       
        var RelationObjectIcon = $("<div/>", { "class": "RelationObjectIcon"});
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

    export function getRelationObjectTooltip(objectType: ObjectTypes, objectId: number, withCosts = false): any {

        switch (objectType) {
            case ObjectTypes.Research:
                if (researchExists(objectId)) return i18n.label(researches[objectId].label);
                Helpers.Log("error in basedata - 3.1");
                return 'r';
            case ObjectTypes.Quest:
                if (QuestModule.questExists(objectId)) return i18n.label(QuestModule.getQuest(objectId).label);
                //Helpers.Log("error in basedata - 3.2");
                return '';
            case ObjectTypes.Building:
                if (mainObject.buildingsExists(objectId)) {
                    var building = mainObject.buildings[objectId];
                    return {
                        "position": { "my": "left+15 top+30", "at": "right center" }
                        , "content": function () { return building.buildingListTooltip().html(); } };
                };
                Helpers.Log("error in basedata - 3.3");
                return 'r';
            case ObjectTypes.ShipModule:
                if (moduleExists(objectId)) {
                    var baseModule = getModule(objectId);
                    return {
                        "position": { "my": "left+15 top+30", "at": "right center" }
                        , "content": function () { return baseModule.tooltipWithCosts().html(); }
                    };
                    
                }
                Helpers.Log("error in basedata - 3.4");
                return 'r';
            case ObjectTypes.ShipHull:
                if (shipHullExists(objectId)) {
                    var baseHull = shipHulls[objectId];
                    return {
                        "position": { "my": "left+15 top+30", "at": "right center" }
                        , "content": function () { return baseHull.tooltipWithCosts().html(); }
                    };
                }
                Helpers.Log("error in basedata - 3.5");
                return 'r';
            case ObjectTypes.Good:
                if (mainObject.goodExists(objectId)) return i18n.label(mainObject.findGood(objectId).label);
                Helpers.Log("error in basedata - 3.6");
                return 'r';
        }

        Helpers.Log("error in basedata - 3");
        return '';
    }

    export function getRelationObjectImage(object: any): string {
        if (object instanceof BaseDataModule.Research) return "NotImplemented";
        if (object instanceof QuestModule.Quest) return "NotImplemented";
        if (object instanceof BaseDataModule.Building) return object.imagePath();
        if (object instanceof BaseDataModule.ShipModule) return object.imagePath();
        if (object instanceof BaseDataModule.ShipHull) return object.imagePath();
        if (object instanceof BaseDataModule.Good) return object.name;
        return "images/Scout2K.png";
    }


    export function hasPreriquisite(targetObject: any) : boolean {
        return true;
    }

    export function getObjectRelationTargets(source: any, targetType?: ObjectTypes): ObjectRelations[]{
        var returnValue: ObjectRelations[] = [];

        var sourceType: ObjectTypes = getObjectType(source);
        var sourceId: ObjectTypes = getObjectId(source);            

        for (var i = 0; i < objectRelations.length; i++) {
            if (objectRelations[i].sourceId != sourceId || objectRelations[i].sourceType != sourceType) continue;

            if (targetType != null) {
                if (objectRelations[i].targetType != targetType ) continue;
            }
            returnValue.push(objectRelations[i]);
        }

        return returnValue;
    }

    export function getObjectRelationSources(target: any, sourceType?: ObjectTypes): ObjectRelations[] {
        var returnValue: ObjectRelations[] = [];

        var targetType: ObjectTypes = getObjectType(target);
        var targetId: ObjectTypes = getObjectId(target);

        for (var i = 0; i < objectRelations.length; i++) {
            if (objectRelations[i].targetId != targetId || objectRelations[i].targetType != targetType) continue;

            if (sourceType != null) {
                if (objectRelations[i].sourceType != sourceType) continue;
            }
            returnValue.push(objectRelations[i]);
        }

        return returnValue;
    }

    export function getRelationsFromXML(responseXML: Document) {
        objectRelations.length = 0;
        var XMLObjectRelations = responseXML.getElementsByTagName("objectRelation");
        var length = XMLObjectRelations.length;
        for (var i = 0; i < length; i++) {
            var newRelation = new ObjectRelations();
            newRelation.insert(<Element>XMLObjectRelations[i]);
            objectRelations.push(newRelation);
        }
        Helpers.Log(length + " ObjectRelations added");
    }
    //#endregion

    //#region Player Specialization
    export class SpecializationGroup
    {
        Id: number;

        Name: string;

        Picks: number;

        Label: number;

        LabelDescription: number;

        SpecializationResearch: SpecializationResearch[] = [];

        constructor(id) { this.Id = id; }

        SpecializationGroup(id : number)
        {
            this.Id = id;
            this.SpecializationResearch = [];
        }

        update(XMLSpecializationGroup) {
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
        }

        setPickState(user: PlayerData.User) {

            Helpers.Log('setPickState : ' + user.name);

            var length = this.SpecializationResearch.length;
            for (var i = 0; i < length; i++) {
                var specResearch = this.SpecializationResearch[i];
                if (user.playerResearches[specResearch.ResearchId] &&
                    user.playerResearches[specResearch.ResearchId].isCompleted) {
                    specResearch.PickState = SpecializationResearchPickedState;
                    //Helpers.Log('setPickState : ' + user.name + ' ' + 'SpecializationResearchPickedState');
                } else {
                    specResearch.PickState = SpecializationResearchNotPickedState;
                    //Helpers.Log('setPickState : ' + user.name + ' ' + 'SpecializationResearchNotPickedState');
                }
            }
        }
    }

    export function RefrehsPickState(user: PlayerData.User) {

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

    export interface SpecializationResearchClickState {
        clicked(specResearch: SpecializationResearch, refreshScope?: any, refresh?: () => void): void;
        pickImage(): JQuery;
        isPicked(): boolean;
        isFixed(): boolean;
    }

    class SpecializationResearchNotPicked implements SpecializationResearchClickState {

        clicked(specResearch: SpecializationResearch, refreshScope: any = null , refresh: () => void = null) {

            //check that points to spend are still remaining:
            var specGroup = BaseDataModule.getSpecializationGroup(specResearch.SpecializationGroupId);
            var alreadyPicked = 0;
            var pickedResearch: SpecializationResearch= null;
            for (var i = 0; i < specGroup.SpecializationResearch.length; i++) {
                if (specGroup.SpecializationResearch[i].PickState.isPicked()) { alreadyPicked++; pickedResearch = specGroup.SpecializationResearch[i];}
            }
            if (alreadyPicked >= specGroup.Picks) {
                if  (alreadyPicked > 1)
                    return;
                if (pickedResearch.PickState instanceof SpecializationResearchPicked) return;
                pickedResearch.PickState = SpecializationResearchNotPickedState;
            }

            specResearch.PickState = SpecializationResearchMarkedToPickState;

            if (refreshScope != null && refresh != null) refresh.call(refreshScope);
            //userDetail.refreshOverviewPage();
        }

        pickImage(): JQuery {
            var pickDiv = $("<div>", { "class": "inlineBlockTopAlign SpecGroupPick" });
            var circle = $("<div>", { "class": "inlineBlockTopAlign specCircles" });
            circle.addClass("specCirclesEmpty");
            pickDiv.append(circle);

            return pickDiv;            
        }

        isPicked() {
            return false;
        }

        isFixed() {
            return false;
        }
    }
    var SpecializationResearchNotPickedState = new SpecializationResearchNotPicked();

    class SpecializationResearchPicked implements SpecializationResearchClickState {

        clicked(specResearch: SpecializationResearch, refreshScope: any = null, refresh: () => void = null) {            
        }
        pickImage(): JQuery {
            var pickDiv = $("<div>", { "class": "inlineBlockTopAlign SpecGroupPick" });
            var circle = $("<div>", { "class": "inlineBlockTopAlign specCircles" });
            circle.addClass("specCirclesFixed");
            pickDiv.append(circle);

            return pickDiv;
        }
        isPicked() {
            return true;
        }
        isFixed() {
            return true;
        }
    }
    var SpecializationResearchPickedState = new SpecializationResearchPicked();

    class SpecializationResearchMarkedToPick implements SpecializationResearchClickState {
        clicked(specResearch: SpecializationResearch, refreshScope: any = null, refresh: () => void = null) {

            

            
            specResearch.PickState = SpecializationResearchNotPickedState;
            if (refreshScope != null && refresh != null) refresh.call(refreshScope);
            //userDetail.refreshOverviewPage();
        }
        pickImage(): JQuery {
            var pickDiv = $("<div>", { "class": "inlineBlockTopAlign SpecGroupPick" });
            var circle = $("<div>", { "class": "inlineBlockTopAlign specCircles" });
            circle.addClass("specCirclesMarked");
            pickDiv.append(circle);

            return pickDiv;
        }
        isPicked() {
            return true;
        }
        isFixed() {
            return false;
        }
    }
    var SpecializationResearchMarkedToPickState = new SpecializationResearchMarkedToPick();
    

    export class SpecializationResearch
    {
        SpecializationGroupId: number;

        ResearchId: number;

        SecondaryResearchId: number;

        Building1: number;
        Building2: number;
        Building3: number;

        Module1: number;
        Module2: number;
        Module3: number;

        PickState: SpecializationResearchClickState;

        AmountTaken = 0;

        constructor() {
            this.PickState = new SpecializationResearchNotPicked();
        } 

        SetResearched() {
            this.PickState = SpecializationResearchPickedState;
        }   
    }

    function SpecializationGroupExists(id: number): boolean {
        if (SpecializationGroups[id] != null)
            return true;
        else
            return false;
    }

    export function getSpecializationGroup(id: number): SpecializationGroup {
        if (!SpecializationGroupExists(id)) return null;
        return SpecializationGroups[id];
    }

    var SpecializationGroupAdd = function (XMLSpecializationGroup: Element) {
        var id = parseInt(XMLSpecializationGroup.getElementsByTagName("Id")[0].childNodes[0].nodeValue);
        var newSpecializationGroup = new SpecializationGroup(id);

        SpecializationGroups[id] = newSpecializationGroup;

        newSpecializationGroup.update(XMLSpecializationGroup);
    }

    var createUpdateSpecializationGroup = function (XMLSpecializationGroup: Element) {
        var id = parseInt(XMLSpecializationGroup.getElementsByTagName("Id")[0].childNodes[0].nodeValue);

        if (SpecializationGroupExists(id))
            SpecializationGroups[id].update(XMLSpecializationGroup);
        else
            SpecializationGroupAdd(XMLSpecializationGroup);
    }

    export function getSpecializationGroupFromXML(responseXML: Document) {
        var XMLSpecializationGroup = responseXML.getElementsByTagName("SpecializationGroup");
        var length = XMLSpecializationGroup.length;
        for (var i = 0; i < length; i++) {
            createUpdateSpecializationGroup(<Element>XMLSpecializationGroup[i]);
        }
        Helpers.Log(length + " SpecializationGroups added or updated");

        
    }

    export function FindSpecializationResearch(researchId: number): SpecializationResearch {
        for (var i = 0; i < SpecializationGroups.length; i++) {
            if (SpecializationGroups[i] == null) continue;

            var currentGroup = SpecializationGroups[i];
            for (var j = 0; j < currentGroup.SpecializationResearch.length; j++) {
                if (currentGroup.SpecializationResearch[j] && currentGroup.SpecializationResearch[j].ResearchId == researchId) return currentGroup.SpecializationResearch[j];
            }
        }

        return null;
    }

    //#endregion


    export function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

    //calcs the storage size of a goods array
    export function GoodsArraySize(goods: number[]): number {    
        var goodsCount = 0;

        for (var i = 0; i < goods.length; i++) {
            if (goods[i] == null || goods[i] == 0) continue;
            if (mainObject.goods[i] == null) continue; //should never occur...
            //if (mainObject.goods[i].goodsType != 1) continue;
            if (mainObject.goods[i].goodsType == 3) continue;



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
}

module ResearchModule {
    declare function updateTree(): void;
    declare function setResearchTreeHeader(): void;

    export function CountResearchGeneration(): number {
        var numberOfOverallResearch = 0;

        for (var j = 0; j < ColonyModule.allBuildings.length; j++) {
            if (ColonyModule.allBuildings[j] == null) continue;
            if (ColonyModule.allBuildings[j].userId != mainObject.user.id) continue;
            //if (ColonyModule.allBuildings[j].buildingId !== 15) continue;
            if (!ColonyModule.allBuildings[j].isActive || ColonyModule.allBuildings[j].underConstruction) continue;

            //GoodId 12 stand for generated researchpoints
            if (!mainObject.buildings[ColonyModule.allBuildings[j].buildingId].production[12]) continue;

            numberOfOverallResearch += mainObject.buildings[ColonyModule.allBuildings[j].buildingId].production[12];
        }

        return numberOfOverallResearch;
    }
}
