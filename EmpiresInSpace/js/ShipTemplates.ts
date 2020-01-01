
//ShipModuleSimpleModule
module ShipTemplateModule {

    export var shipTemplates: ShipTemplate[] = [];

    //needed in the spaceport for constructing new ships
    //shiptemplates 
    export class ShipTemplate implements ShipTemplateStatistics  {

        name: string;
        gif: string;

        energy: number;
        crew: number;
        neededEnergy: number;
        neededCrew: number;

        scanRange: number;
        scanEffectivity : number;
        attack: number;
        defense: number;
        hitpoints: number;
        damagereduction: number;

        systemMovesPerTurn: number;
        galaxyMovesPerTurn: number;

        systemMovesMax: number;
        galaxyMovesMax: number;

        cargoroom: number;
        fuelroom: number;
        special: number;

        isColonizer = false;
        constructable = true;

        obsolete = false;

        constructionDuration: number;
        costs: number[] = [];
        modulePositions: Ships.ModulePosition[] = [];
        //ModulePositions : n

        shipHullId: number = 1;
        shipHullsImage: number = 1;
        isSaved = true;

        constructor(public id: number) { }

        //These are provided by ShipTemplateStatistics via mixin
        getFactor(baseValue: number, count: number, factor: number): number { return 0;  }
        applyFactor(baseValue: number, count: number, factor: number): number {    return 0;   }
        recalcStats() { }
        removeModuleAtPosition(targetPosition: Ships.ModulePosition) { }
        insertModuleAtPosition(targetPosition: Ships.ModulePosition, shipmodule: BaseDataModule.ShipModule) { }
        changeModuleInTemplate(shipModule: ShipModuleStatistics, factor: number, speedFactor = 1) { }
        isSpaceStation: () => boolean;
        modulePositionExists: (posX: number, posY: number) => boolean;
        getModuleByPosition: (posX: number, posY: number) => Ships.ModulePosition;
        CostsInBaseResources: () => number[];


        update(shipXML) {

            var name = shipXML.getElementsByTagName("name")
                && shipXML.getElementsByTagName("name")[0]
                && shipXML.getElementsByTagName("name")[0].childNodes[0]
                && shipXML.getElementsByTagName("name")[0].childNodes[0].nodeValue || '';

            var energy = shipXML.getElementsByTagName("energy")[0].childNodes[0].nodeValue;
            var crew = shipXML.getElementsByTagName("crew")[0].childNodes[0].nodeValue;

            var scanRange = shipXML.getElementsByTagName("scanRange")[0].childNodes[0].nodeValue;

            var attack = shipXML.getElementsByTagName("attack")[0].childNodes[0].nodeValue;
            var defense = shipXML.getElementsByTagName("attack")[0].childNodes[0].nodeValue;//shipXML.getElementsByTagName("defense")[0].childNodes[0].nodeValue;
            var hitpoints = shipXML.getElementsByTagName("hitpoints")[0].childNodes[0].nodeValue;
            var damagereduction = shipXML.getElementsByTagName("damageReduction")[0].childNodes[0].nodeValue;

            var systemMovesPerTurn = shipXML.getElementsByTagName("systemMovesPerTurn")[0].childNodes[0].nodeValue;
            var galaxyMovesPerTurn = shipXML.getElementsByTagName("galaxyMovesPerTurn")[0].childNodes[0].nodeValue;
            var systemMovesMax = shipXML.getElementsByTagName("systemMovesMax")[0].childNodes[0].nodeValue;
            var galaxyMovesMax = shipXML.getElementsByTagName("galaxyMovesMax")[0].childNodes[0].nodeValue;
            //var systemMoves = shipXML.getElementsByTagName("systemMoves")[0].childNodes[0].nodeValue;
            //var galaxyMoves = shipXML.getElementsByTagName("galaxyMoves")[0].childNodes[0].nodeValue;

            var cargoroom = shipXML.getElementsByTagName("cargoroom")[0].childNodes[0].nodeValue;
            var fuelroom = shipXML.getElementsByTagName("fuelroom")[0].childNodes[0].nodeValue;

            var gif = shipXML.getElementsByTagName("gif")[0].childNodes[0].nodeValue;
            var isColonizer = shipXML.getElementsByTagName("isColonizer")[0].childNodes[0].nodeValue;
            var constructionDuration = shipXML.getElementsByTagName("constructionDuration")[0].childNodes[0].nodeValue;
            var shipHullId = shipXML.getElementsByTagName("shipHullId")[0].childNodes[0].nodeValue;

            var constructable = shipXML.getElementsByTagName("constructable")[0].childNodes[0].nodeValue;
            var obsolete = shipXML.getElementsByTagName("obsolete")[0].childNodes[0].nodeValue;
            var shipHullsImage = shipXML.getElementsByTagName("shipHullsImage")[0].childNodes[0].nodeValue;


            this.name = name;
            this.crew = parseInt(crew,10);
            this.energy = parseInt(energy,10);
            this.neededCrew = parseInt(crew, 10);
            this.neededEnergy = parseInt(energy, 10);



            this.scanRange = scanRange;


            this.attack = parseInt(attack,10);
            this.defense = parseInt(defense,10);
            this.hitpoints = parseInt(hitpoints, 10);
            this.damagereduction = parseInt(damagereduction, 10); 

            this.systemMovesPerTurn = Number(systemMovesPerTurn);
            this.galaxyMovesPerTurn = Number(galaxyMovesPerTurn);
            this.systemMovesMax = Number(systemMovesMax);
            this.galaxyMovesMax = Number(galaxyMovesMax);
            
            this.cargoroom = parseInt(cargoroom, 10);
            this.fuelroom = parseInt(fuelroom, 10);

            this.gif = gif;
            this.isColonizer = isColonizer == 1 ? true : false;
            this.constructionDuration = constructionDuration;
            this.shipHullId = parseInt(shipHullId);
            this.constructable = constructable == 1 ? true : false;
            this.obsolete = obsolete == "true" ? true : false;
            this.shipHullsImage = parseInt(shipHullsImage, 10);

            this.costs = [];
            var XMLgoods = shipXML.getElementsByTagName("ShipTemplateCosts");
            var length = XMLgoods.length;
            for (var i = 0; i < length; i++) {
                var id = XMLgoods[i].getElementsByTagName("goodsId")[0].childNodes[0].nodeValue;
                var amount = XMLgoods[i].getElementsByTagName("amount")[0].childNodes[0].nodeValue;
                this.costs[id] = parseInt(amount);
            }

            this.modulePositions = [];
            var XMLmodPos = shipXML.getElementsByTagName("ShipTemplateModulePositions");
            var length = XMLmodPos.length;
            for (var i = 0; i < length; i++) {
                var posX = XMLmodPos[i].getElementsByTagName("posX")[0].childNodes[0].nodeValue;
                var posY = XMLmodPos[i].getElementsByTagName("posY")[0].childNodes[0].nodeValue;
                var moduleId = XMLmodPos[i].getElementsByTagName("moduleId")[0].childNodes[0].nodeValue;
                var modulePosition = new Ships.ModulePosition();
                modulePosition.posX = parseInt(posX,10);
                modulePosition.posY = parseInt(posY,10);
                modulePosition.shipmoduleId = moduleId;
                if (BaseDataModule.moduleExists(moduleId))
                {
                    modulePosition.shipmodule = BaseDataModule.modules[moduleId];
                }
                this.modulePositions.push(modulePosition);
            }            
        }

        deleteTemplate() {
            shipTemplates[this.id] = null;
        }

        //needed during template creation. just the copy is changed, until saved was pressed.When saving , changes of the copy are transferred and the result written over the original. the original is then again copied...
        createDuplicate(): ShipTemplate {
            var duplicate = new ShipTemplate(-1);

            duplicate.id = this.id;
            duplicate.name = this.name;
            duplicate.crew = this.crew;
            duplicate.energy = this.energy;
            duplicate.neededCrew = this.crew;
            duplicate.neededEnergy = this.energy;

            duplicate.scanRange = this.scanRange;

            duplicate.attack = this.attack;
            duplicate.defense = this.defense;
            duplicate.hitpoints = this.hitpoints;

            duplicate.systemMovesPerTurn = this.systemMovesPerTurn;
            duplicate.galaxyMovesPerTurn = this.galaxyMovesPerTurn;
            duplicate.systemMovesMax = this.systemMovesMax;
            duplicate.galaxyMovesMax = this.galaxyMovesMax;

            duplicate.cargoroom = this.cargoroom;
            duplicate.fuelroom = this.fuelroom;

            duplicate.gif = this. gif;
            duplicate.isColonizer = this.isColonizer;
            duplicate.constructionDuration = this.constructionDuration;
            duplicate.shipHullId = this.shipHullId;
            duplicate.shipHullsImage = this.shipHullsImage;

            duplicate.costs = this.costs.slice(0);
            for (var i = 0; i < this.modulePositions.length; i++) {                
                duplicate.modulePositions[i] = this.modulePositions[i].createCopy();
            }
            //duplicate.modulePositions = this.modulePositions.slice(0);

            duplicate.recalcStats();
            duplicate.recalcCosts();

            return duplicate;
        }

        //inserts module to a position or replaces previous module
        /*insertModuleAtPosition(targetPosition: Ships.ModulePosition, shipmodule: BaseDataModule.ShipModule) {
            this.isSaved = false;
            if (this.modulePositionExists(targetPosition.posX, targetPosition.posY)) {
                var templateTargetPos = this.getModuleByPosition(targetPosition.posX, targetPosition.posY);
                templateTargetPos.shipmodule = shipmodule;
                templateTargetPos.shipmoduleId = shipmodule.id;
            } else {
                var templateTargetPos = new Ships.ModulePosition();
                templateTargetPos.posX = targetPosition.posX;
                templateTargetPos.posY = targetPosition.posY;
                templateTargetPos.shipmodule = shipmodule;
                templateTargetPos.shipmoduleId = shipmodule.id;
                this.modulePositions.push(templateTargetPos);
            }
        }
        
        //called by a draggable item dropped anywhere except the dropzones
        removeModuleAtPosition(targetPosition: Ships.ModulePosition) {
            this.isSaved = false;
            for (var i = 0; i < this.modulePositions.length; i++) {
                if (this.modulePositions[i].posX === targetPosition.posX && this.modulePositions[i].posY === targetPosition.posY)
                {
                    this.modulePositions.splice(i, 1);
                    return;
                }
            }            
        }
        */
        recalcCosts() {
            this.costs = [];
            if (!BaseDataModule.shipHullExists(this.shipHullId)) return;

            this.costs = BaseDataModule.shipHulls[this.shipHullId].costs.concat();

            for (var i = 0; i < this.modulePositions.length; i++) {
                if (this.modulePositions[i] === undefined || this.modulePositions[i] === null) continue;
                var shipModGoodsId = this.modulePositions[i].shipmodule.goodsId;
                if (this.costs[shipModGoodsId] === undefined) {
                    this.costs[shipModGoodsId] = 1;
                } else {
                    this.costs[shipModGoodsId] += 1;
                }
            }
        }

        //Todo: improve performance by allowing single module recalculation during template-creation
        /*
        recalcStats() {
            this.crew = 0; this.energy = 0; this.neededCrew = 0; this.neededEnergy = 0;
            this.systemMovesPerTurn = 0; this.systemMovesMax = 0; this.galaxyMovesPerTurn = 0; this.galaxyMovesMax = 0;
            this.cargoroom = 0; this.fuelroom = 0;
            this.attack = 0; this.defense = 0; this.hitpoints = 0; this.damagereduction = 0;
            this.scanRange = 0;                       
            this.isColonizer = false;

            var hull = BaseDataModule.shipHulls[this.shipHullId];
            var speedFactor = (1.0 / hull.modulePositions.length) * hull.speedFactor;
            this.changeModuleInTemplate(hull, 1, speedFactor);
            
            for (var i = 0; i < this.modulePositions.length; i++) {
                if (this.modulePositions[i] === undefined || this.modulePositions[i] === null) continue;
                this.changeModuleInTemplate(this.modulePositions[i].shipmodule, 1, speedFactor);
            }
        }

        changeModuleInTemplate(shipModule: ShipModuleStatistics, factor: number, speedFactor = 1) {
            if (shipModule.crew > 0) this.crew += shipModule.crew * factor; else this.neededCrew -= shipModule.crew * factor;
            if (shipModule.energy > 0) this.energy += shipModule.energy * factor; else this.neededEnergy -= shipModule.energy * factor;
            this.systemMovesPerTurn += shipModule.systemMovesPerTurn * factor * speedFactor ;
            this.systemMovesMax += shipModule.systemMovesMax * factor * speedFactor;
            this.galaxyMovesPerTurn += shipModule.galaxyMovesPerTurn * factor * speedFactor;
            this.galaxyMovesMax += shipModule.galaxyMovesMax * factor * speedFactor;
            this.cargoroom += shipModule.cargoroom * factor;
            this.fuelroom += shipModule.fuelroom * factor;


            this.attack += shipModule.attack * factor;
            this.defense += shipModule.defense * factor;
            this.hitpoints += shipModule.hitpoints * factor;
            this.damagereduction += shipModule.damagereduction * factor;

            this.scanRange += shipModule.scanRange * factor;
        }

        modulePositionExists(posX: number, posY: number): boolean {
            for (var i = 0; i < this.modulePositions.length; i++) {
                if (this.modulePositions[i] == null) continue;
                if (this.modulePositions[i].posX === posX && this.modulePositions[i].posY === posY) return true;
            }
            return false;
        }

        getModuleByPosition(posX: number, posY: number): Ships.ModulePosition {
            for (var i = 0; i < this.modulePositions.length; i++) {
                if (this.modulePositions[i] == null) continue;
                if (this.modulePositions[i].posX === posX && this.modulePositions[i].posY === posY) return this.modulePositions[i];
            }
            return null;
        }
        */
    }
    applyMixins(ShipTemplate, [ShipTemplateStatistics])

    export function refreshModules() {        
        for (var a = 0; a < shipTemplates.length; a++) {
            if (shipTemplates[a] === undefined) continue;
            for (var i = 0; i < shipTemplates[a].modulePositions.length; i++) {
                if (shipTemplates[a].modulePositions[i].shipmoduleId)
                    shipTemplates[a].modulePositions[i].shipmodule = BaseDataModule.modules[shipTemplates[a].modulePositions[i].shipmoduleId];
            }
        }
        
    }

    export function templateExists(id: number): boolean {
        if (shipTemplates[id] != null)
            return true;
        else
            return false;
    }

    export function getTemplate(id: number): ShipTemplate {
        if (!templateExists(id)) return null;
        return shipTemplates[id];
    }

    var templateAdd = function (XMLTemplate: Element) {
        var id = parseInt(XMLTemplate.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        var shipTemplate = new ShipTemplate(id);

        shipTemplates[id] = shipTemplate;

        shipTemplate.update(XMLTemplate);
        
    }

    var createUpdateTemplate = function (XMLTemplate: Element) {
        var id = parseInt(XMLTemplate.getElementsByTagName("id")[0].childNodes[0].nodeValue);

        if (templateExists(id))
            shipTemplates[id].update(XMLTemplate);
        else
            templateAdd(XMLTemplate);
    }

    export function getTemplatesFromXML(responseXML: Document) {
        var XMLTemplate = responseXML.getElementsByTagName("ShipTemplate");
        var length = XMLTemplate.length;
        for (var i = 0; i < length; i++) {
            createUpdateTemplate(<Element>XMLTemplate[i]);
        }
        Helpers.Log(length + " ShipTemplates added or updated");
    }    

    export function showShipTemplatesPanel() {
        Helpers.Log("showShipTemplatesPanel()");

        var templatesPanel = ElementGenerator.createPopup();
        $('.yesButton', templatesPanel).click((e: JQuery.Event) => { templatesPanel.remove(); });
        $('.noButton', templatesPanel)[0].style.display = 'none';
        $('.yesButton span', templatesPanel).text('OK');

        //var panelBody = $('.fullscreenPanelBody', commNodesPanel);
        var panelHeader = $('.relPopupHeader', templatesPanel);
        var caption = $('<h2/>', { text: "Schiffsmodule", style: "float:left" });
        panelHeader.append(caption);



        var panelBody = $('.relPanelBody', templatesPanel);
        //build Table of incomplete Quests
        var buildTable = $('<table/>', { "class": "fullscreenTable", "cellspacing": 0 });// , style:"border-collapse: collapse;"
        var addRow = false;
        buildTable.append(createFirstLine());
      
        addRow = false;
        for (var i = 0; i < shipTemplates.length; i++) {
            if (typeof shipTemplates[i] === 'undefined') { /*Helpers.Log("undef");*/ continue; }

            if (!shipTemplates[i].constructable) continue;

            (function createLineClosure(shipModule: ShipTemplate) {
                //create a empty TR  , so that we have a little Sapce between the TRs                
                if (addRow) {
                    var spacer = $('<tr/>', { "class": "TRspacer" });
                    buildTable.append(spacer);
                }
                else
                    addRow = true;

                var tableRow = createTableLine(shipModule);

                //tableRow.click((e) => { researchSelected(research); researchPanel.remove(); showResearchPanel(); });


                buildTable.append(tableRow);
            })(shipTemplates[i]);
        }
        var spacer2 = $('<tr/>', { "class": "TRspacer" });
        buildTable.append(spacer2);

        panelBody.append(buildTable);


        templatesPanel.appendTo("body"); //attach to the <body> element
    }

    function createFirstLine(): JQuery {

        var tableRow = $('<tr/>');       

        var tableDataName = $('<th/>', { text: i18n.label(184), "class": "tdTextLeft" });
        tableRow.append(tableDataName);

        return tableRow;
    }


    function createTableLine(shipTemplate: ShipTemplate): JQuery {

        var tableRow = $('<tr/>');

        var tableDataId = $('<td/>', { text: shipTemplate.name, "class": "firstchild lastchild" });
        tableRow.append(tableDataId);        

        return tableRow;
    }



    function sendShipTemplate(shipTemplate: ShipTemplate) {
        Helpers.Log("shipTemplate " + shipTemplate.id );
        //shipModule.

        //sender
        var transferXML = '<transfer><sender>';

        $.ajax("Server/Ships.aspx", {
            type: "POST",
            async: true,
            data: {
                "action": "sendShipTemplate",
                "colonyId": mainObject.currentColony.id.toString(),
                "moduleId": shipTemplate.id.toString()            
            }
        }).done(function (msg) {
            //SMSModule.test(msg);
            //mainObject.currentColony.checkColonyBuildQueueXML(msg);            
        });
    }

   
    
}
