/// <reference path="../References.ts" />

module ShipTemplateDesigner {


    //The shipTemplateDesigner is used to 
    // - design templates, 
    // - modify own ships and transcendence constructs or 
    // - view other ships and other transcendence constructs

    //so a base class provides basic implementations, subclasses provide special handling
    //all subclasses are in this file, declared after the base class
    //the class to use is determined in the "static" construct() method
   
    export var DesignerContainer: JQuery;
    export var DesignWindow: ElementGenerator.WindowManager;
    var templateStatistics: JQuery;
    var templateModuleView: JQuery;
    var templateCosts: JQuery;
   
    var templateModuleSelector: JQuery;
    var copyButton: JQuery;
    var deleteButton: JQuery;    

    export var currentObject: ShipTemplateStatistics;
    export var currentShip: Ships.Ship;
    export var currentTemplate: ShipTemplateModule.ShipTemplate;
    
    export var goodsDivs: Array<{ moduleId: number; goodsDiv: JQuery; }> = [];


    export var designerPanel: DesignerBase;

    class Designer extends Scripts.Script {

        constructor() {
            //call super, set scriptType to 3(Designer) and Id to 1 (Designer)
            super(3, 1);
            
            Scripts.scriptsAdmin.scripts.push(this);            
        }

        run() {
            ShipTemplateDesigner.runTemplate(null);
        }
    }

    //
    export function runTemplate(_currentObject: ShipTemplateStatistics) {
        designerPanel = ShipTemplateDesigner.construct(_currentObject);
        designerPanel.clearStatics();
        designerPanel.runTemplate(_currentObject);
    }

    export class DesignerBase
    {
        owner = 0;

        clearStatics() {            
            Helpers.Log("clearStatics");
            currentShip = null;
            currentTemplate = null;
            goodsDivs = [];
            currentObject = undefined;
        }

        runTemplate(_currentObject: ShipTemplateStatistics) {
            Helpers.Log("Designer");
          
            var _DesignerContainer = ElementGenerator.createPopup(4);
            ElementGenerator.adjustPopupZIndex(_DesignerContainer, 15000);
            ElementGenerator.makeBig(_DesignerContainer);
            DesignerContainer = _DesignerContainer;
            DesignWindow = DesignerContainer.data("window");

            var panelHeader = $('.relPopupHeader', DesignerContainer);
            var caption = $('<h2/>', { text: i18n.label(224), style: "float:left" });
            if (currentShip != null) caption.text(i18n.label(205));
            panelHeader.append(caption);

            var panelBody = $('.relPopupBody', DesignerContainer);
            panelBody.removeClass("trHighlight").addClass("tdHighlight").addClass("ShipTemplateDesigner");

            //right side: module selection        
            $('.noButton span', DesignerContainer).css("display","block");
            $('.noButton', DesignerContainer).css("display", "inline-block");

            //template statistics, name , hulltype (changeable)
            templateStatistics = $('<div/>', { "class": "shipDesignerStatisticsDiv" });
            panelBody.append(templateStatistics);

            //template module view - the main area
            templateModuleView = $('<div/>', { "class": "shipDesignerModuleViewDiv" });
            panelBody.append(templateModuleView);

            //template overall costs
            templateCosts = $('<div/>', { "class": "shipDesignerCostsDiv goodsOverflow" });
            panelBody.append(templateCosts);

            $('.yesButton span', DesignerContainer).text(i18n.label(206));

            
            //set visibility ot formelements and buttons
            this.setDesignerPanels();

            
            DesignerContainer.appendTo("body"); //attach to the <body> element

            $('.yesButton', DesignerContainer).click((e: JQuery.Event) => { this.checkSaveState(ShipTemplateDesigner.designerPanel.close, null); });
            
            this.calcCostsAndRefresh();         
            //DesignerContainer.zIndex(30000);
        }

        //sets the five possible panels per designer/refit - view 
        setDesignerPanels() {            
            throw new Error('This method is abstract');            
        }

        hideLeft() {
            templateStatistics.css("left", "0px");
            templateModuleView.css("left", "0px");
            templateCosts.css("left", "0px");
        }

        hideRight() {
            templateStatistics.css("right", "0px");
            templateModuleView.css("right", "0px");
            templateCosts.css("right", "0px");
        }        

        rightSideSelection() {
            throw new Error('This method is abstract');
        }

        refreshRightSideSelection() {
            throw new Error('This method is abstract');
        }               

        refreshGoodsSelection() {
            throw new Error('This method is abstract');
        }

        


        templateListRow(shipTemplate: ShipTemplateModule.ShipTemplate): JQuery {
            var templateRow = $('<tr/>');
            templateRow.data("id", shipTemplate.id);
            //var texturePath = mainObject.objectTypes[].texture.src;                
            var imageTd = $('<td/>', { "class": "firstchild" });
            templateRow.append(imageTd);
            var content = $("<div/>", { "text": shipTemplate.name.label() });
            var templateName = $('<td/>', { "class": "lastchild" });
            templateName.css("vertical-align", "middle");
            templateName.append(content);
            templateRow.append(templateName);
            templateRow.click((e: JQuery.Event) => { ShipTemplateDesigner.designerPanel.checkSaveState(ShipTemplateDesigner.designerPanel.selectTemplate, e) });   //selectTemplate(e); });
            return templateRow;
        }

        close() {
            ShipTemplateDesigner.currentObject = null;
            ShipTemplateDesigner.currentShip = null;
            ShipTemplateDesigner.currentTemplate = null;
            ShipTemplateDesigner.DesignerContainer.remove();
        }

        setSave(state: boolean) {
            if (state) $('.noButton', DesignerContainer).removeClass("textColorGreen");
            else $('.noButton', DesignerContainer).addClass("textColorGreen");

            ShipTemplateDesigner.currentObject.isSaved = state;            
        }

        selectTemplate(e: Event) {
            if (!e) var e = <Event>window.event;
            var templateId = $(e.currentTarget).data("id");

            if (!ShipTemplateModule.templateExists(templateId)) return;

            currentObject = ShipTemplateModule.shipTemplates[templateId].createDuplicate();
            
            ShipTemplateDesigner.designerPanel.refreshAll();
        }

        

        calcCostsAndRefresh() {
            if (!currentObject) return;


            currentObject.recalcStats();
            if (currentObject instanceof ShipTemplateModule.ShipTemplate) {
                var template = <ShipTemplateModule.ShipTemplate>currentObject;
                template.recalcCosts();
            }
            this.refreshAll();
        }

        refreshAll() {
            throw new Error('This method is abstract');            
        }


        refreshStatistics() {
            templateStatistics.empty();
            if (currentObject === undefined) return;
            //create 4 divs for the different Groups:
            var statBase = $("<div/>", { "class": "shipDesignerStatisticDiv" });
            var statDrive = $("<div/>", { "class": "shipDesignerStatisticDiv" });
            var statWar = $("<div/>", { "class": "shipDesignerStatisticDiv" });
            var statSpecial = $("<div/>", { "class": "shipDesignerStatisticDiv" });

            var ship: Ships.Ship = null;
            var isRefitting = false;
            if (currentShip != null) {
                ship = <Ships.Ship>currentObject;
                if (ship.refitCounter > 0) {
                    isRefitting = true;
                }
            }



            //statBase has name + crew + energy:
            var nameInput = $("<input/>", { type: "text", value: currentObject.name.label() });
            nameInput.css("width", "13em");
            statBase.append(nameInput);
            //stemplateStatistics.append(nameInput);
            if (currentShip != null) {
                nameInput.bind("input", function () {
                //nameInput.change(function () {
                    currentShip.name = (<HTMLInputElement>this).value;
                    currentShip.createTagFreeName();   
                    Ships.UserInterface.refreshMainScreenStatistics(currentShip);
                    /*$.ajax("Server/Ships.aspx", {
                        type: "GET",
                        async: true,
                        data: {
                            "action": "renameShip",
                            "shipId": currentShip.id.toString(),
                            "newName": this.value
                        }
                    });
                    */
                    $.ajax("Server/Ships.aspx?action=renameShip&shipId=" + currentShip.id.toString(), {
                        type: "POST",
                        data: (<HTMLInputElement>this).value,
                        contentType: "xml",
                        processData: false
                    });

                });
            } else {
                nameInput.bind("input", function () { ShipTemplateDesigner.currentObject.name = (<HTMLInputElement>this).value; ShipTemplateDesigner.designerPanel.setSave(false); });
                //nameInput.change(function () { ShipTemplateDesigner.currentObject.name = this.value; ShipTemplateDesigner.designerPanel.setSave(false); });
            }

            var selectorHullContainer = $('<div/>');
            selectorHullContainer.css("display", "inline-block");
            //selectorHullContainer.css("float", "left");
            selectorHullContainer.css("margin-top", "4px");
            var selectorHull = $('<select/>', { "id":"HullSelector"});
            //selectorHull.css("float", "left");
            //selectorHull.css("margin-top", "4px");
            for (var i = 0; i < BaseDataModule.shipHulls.length; i++) {
                if (BaseDataModule.shipHulls[i] === undefined || !PlayerData.hullsAvailable(i)) continue;

                var option = $('<option/>', { val: i, text: BaseDataModule.shipHulls[i].typeName });
                if (currentObject.shipHullId == i) option.attr('selected', 'selected');
                selectorHull.append(option);
            }

            selectorHull.change(function () {
                ShipTemplateDesigner.designerPanel.changeHull(parseInt((<HTMLInputElement>this).value));
            });

            selectorHullContainer.append(selectorHull);

            
            selectorHull.selectmenu({
                width: "100%",
                change: (event, data) => {
                    //Helpers.Log($(data.item).toString());
                    //Helpers.Log($(data.item.element).parent());
                    Helpers.Log($(data.item.element).parent().data("userdata"));
                    Helpers.Log($(data.item).parent().data("userdata"));
                    //selectorTargetRelation.change(() => { this.relationChanged(selectorTargetRelation.get()[0], <PlayerData.OtherPlayer>userdata) });
                    ShipTemplateDesigner.designerPanel.changeHull(data.item.element.parent()[0].value);

                    //relationChanged(data.item.element.parent()[0], $(data.item.element).parent().data("userdata"));
                }
            });
            
            //selectorHull.parent().click((e: JQuery.Event) => { e.preventDefault(); e.stopPropagation(); });


            var statButtonsDiv = $("<div/>");

            //left & right buttons to choose shipHullsImages     
            statButtonsDiv.append(selectorHullContainer);
            var statButtonsB1Div = $("<button/>", { "text": "<" , "id":"LeftHullImage"});
            //statButtonsB1Div.css("float", "left");
            statButtonsB1Div.css("display", "inline-block");
            statButtonsB1Div.click(function () { ShipTemplateDesigner.designerPanel.changeImage(-1); });

            statButtonsDiv.append(statButtonsB1Div);
            var statButtonsB2Div = $("<button/>", { "text": ">", "id": "RightHullImage" });
            statButtonsB2Div.css("display", "inline-block");
            statButtonsB2Div.click(function () { ShipTemplateDesigner.designerPanel.changeImage(1); });

            statButtonsDiv.append(statButtonsB2Div);
            statBase.append(statButtonsDiv);


            var baseDiv = $("<div/>", { "class": "border" });
            baseDiv.css("border-width", "thin");
            var baseTable = $("<table/>");
            baseTable.css("width", "100%");

            //crew
            var baseTrCrew = $("<tr/>");
            var baseTdCrewLable = $("<td/>", { text: i18n.label(210) });
            baseTdCrewLable.css("width", "110px");
            var baseTdCrewValue = $("<td/>", { text: currentObject.crew + ' - ' + currentObject.neededCrew + ' : ' + (currentObject.crew - currentObject.neededCrew) });
            //baseTdCrewValue.css("width", "6em");
            if ((currentObject.crew - currentObject.neededCrew) < 0) {
                baseTdCrewValue.css("background-color", "red");
            }

            baseTrCrew.append(baseTdCrewLable).append(baseTdCrewValue);
            baseTable.append(baseTrCrew);


            //energy
            var baseTrEnergy = $("<tr/>");
            var baseTdEnergyLable = $("<td/>", { text: i18n.label(211) });
            //baseTdEnergyLable.css("width", "5em");
            //var baseTdEnergyValue = $("<td/>", { text: currentTemplate.energy });
            var baseTdEnergyValue = $("<td/>", { text: currentObject.energy + ' - ' + currentObject.neededEnergy + ' : ' + (currentObject.energy - currentObject.neededEnergy) });
            //baseTdEnergyValue.css("width", "3em");
            if ((currentObject.energy - currentObject.neededEnergy) < 0) {
                baseTdEnergyValue.css("background-color", "red");
            }
            baseTrEnergy.append(baseTdEnergyLable).append(baseTdEnergyValue);
            baseTable.append(baseTrEnergy);

            //in case of ships and currently refitting:
            if (isRefitting) {
                var baseTrEnergy = $("<tr/>");
                var baseTdEnergyLable = $("<td/>", { text: i18n.label(612) });
                //baseTdEnergyLable.css("width", "5em");

                var baseTdEnergyValue = $("<td/>", { text: currentShip.refitCounter });
                //baseTdEnergyValue.css("width", "3em");
                baseTdEnergyValue.css("background-color", "orange");

                baseTrEnergy.append(baseTdEnergyLable).append(baseTdEnergyValue);
                baseTable.append(baseTrEnergy);

                //currentShip.ref
            }

            baseDiv.append(baseTable);
            statBase.append(baseDiv);





            templateStatistics.append(statBase);

            //statDrive: all Engines
            var engineTable = $("<table/>");
            engineTable.css("width", "100%");

            //systemDrive
            var systemDriveText: string;
            if (currentObject.systemMovesPerTurn)
                systemDriveText = "+" + (currentObject.systemMovesPerTurn ).toFixed(1) + " | " + currentObject.systemMovesMax.toFixed(1);
            else
                systemDriveText = " - ";
            var systemDriveTd = $("<td/>");
            

            if (isRefitting && currentObject.systemMovesPerTurn) {
                systemDriveText = "+0 (" + (currentObject.systemMovesPerTurn ).toFixed(1) + ") | " + currentObject.systemMovesMax.toFixed(1);
                systemDriveTd.css("background-color", "orange");
            }
            systemDriveTd.text(systemDriveText);
            var systemDriveTextTd = $("<td/>", { text: i18n.label(212) });
            systemDriveTextTd.css("width", "110px");
            engineTable.append((
                $("<tr/>").append(systemDriveTextTd).append(systemDriveTd)
                ));


            //engineTable.append((
            //    $("<tr/>").append($("<td/>", { text: i18n.label(212) })).append($("<td/>", { text: currentObject.systemMovesPerTurn.toFixed(1) }))
            //    ));
            //Star Drive
            var galaxyDriveText: string;
            if (currentObject.systemMovesMax)
                galaxyDriveText = "+" + (currentObject.galaxyMovesPerTurn ).toFixed(1) + " | " + currentObject.galaxyMovesMax.toFixed(1);
            else
                galaxyDriveText = " - ";
            var galaxyDriveTd = $("<td/>");
            if (isRefitting && currentObject.galaxyMovesPerTurn) {
                galaxyDriveText = "+0 (" + (currentObject.galaxyMovesPerTurn ).toFixed(1) + ") | " + currentObject.galaxyMovesMax.toFixed(1);
                galaxyDriveTd.css("background-color", "orange");
            }
            galaxyDriveTd.text(galaxyDriveText);
            engineTable.append((
                $("<tr/>").append($("<td/>", { text: i18n.label(213) })).append(galaxyDriveTd)
                ));

            engineTable.append((
                $("<tr/>").append($("<td/>", { text: i18n.label(220) })).append($("<td/>", { text: currentObject.cargoroom }))
                ));
            /*engineTable.append((
                $("<tr/>").append($("<td/>", { text: i18n.label(221) })).append($("<td/>", { text: currentObject.fuelroom }))
                ));
            */
            var scanRangeText: string;
            scanRangeText = currentObject.scanRange.toString();
            if (currentObject.scanEffectivity != 1) {
                scanRangeText += " " + currentObject.scanEffectivity.toFixed(2);
            }

            var scanRangeTd = $("<td/>");
            if (isRefitting && currentObject.scanRange) {
                scanRangeText = "0 (" + scanRangeText + ")";
                scanRangeTd.css("background-color", "orange");
            }
            scanRangeTd.text(scanRangeText);
            engineTable.append((
                $("<tr/>").append($("<td/>", { text: i18n.label(222) })).append(scanRangeTd)
                ));

            //engineTable.append((
            //    $("<tr/>").append($("<td/>", { text: i18n.label(213) })).append($("<td/>", { text: currentObject.systemMovesMax.toFixed(1) }))
            //    ));
            //SystemBattery
            /*
            engineTable.append((
                $("<tr/>").append($("<td/>", { text: i18n.label(214) })).append($("<td/>", { text: currentObject.systemMovesMax.toFixed(1) }))
                ));
            //Star Battery
            engineTable.append((
                $("<tr/>").append($("<td/>", { text: i18n.label(215) })).append($("<td/>", { text: currentObject.galaxyMovesMax.toFixed(1) }))
                ));
            */
            statDrive.append(engineTable);
            templateStatistics.append(statDrive);

            //statWar : attack, defense, HP, SHield...
            var warTable = $("<table/>");
            warTable.css("width", "100%");

            var attackText: string;
            attackText = currentObject.attack.toString();
            var attackTd = $("<td/>");
            if (isRefitting && currentObject.attack) {
                attackText = "0 (" + attackText + ")";
                attackTd.css("background-color", "orange");
            }
            attackTd.text(attackText);
            var attackTextTd = $("<td/>", { text: i18n.label(216) });
            attackTextTd.css("width", "110px");
            warTable.append((
                $("<tr/>").append(attackTextTd).append(attackTd)
                ));

            var defenseText: string;
            defenseText = currentObject.defense.toFixed(1);
            var defenseTd = $("<td/>");
            if (isRefitting && currentObject.defense) {
                defenseText = "0 (" + defenseText + ")";
                defenseTd.css("background-color", "orange");
            }
            defenseTd.text(defenseText);
            warTable.append((
                $("<tr/>").append($("<td/>", { text: i18n.label(217) })).append(defenseTd)
                ));
            warTable.append((
                $("<tr/>").append($("<td/>", { text: i18n.label(218) })).append($("<td/>", { text: currentObject.hitpoints }))
                ));
            var damagereductionText: string;
            damagereductionText = currentObject.damagereduction.toString();
            var damagereductionTd = $("<td/>");
            if (isRefitting && currentObject.damagereduction) {
                damagereductionText = "0 (" + damagereductionText + ")";
                damagereductionTd.css("background-color", "orange");
            }
            damagereductionTd.text(damagereductionText);
            warTable.append((
                $("<tr/>").append($("<td/>", { text: i18n.label(219) })).append(damagereductionTd)
                ));
            statWar.append(warTable);
            templateStatistics.append(statWar);


        }

        changeHull(newHullId: number) {
            currentObject.shipHullId = newHullId;
            currentObject.shipHullsImage = BaseDataModule.shipHullsImageFirst(currentObject.shipHullId);
            for (var i = 0; i < currentObject.modulePositions.length; i++) {
                currentObject.modulePositions[i] = null;
            }

            currentObject.modulePositions = [];

            this.setSave(false);
            this.calcCostsAndRefresh();
        }

        changeImage(direction: number) {
            currentObject.shipHullsImage = BaseDataModule.changeShipHullsImage(direction, currentObject.shipHullsImage);
            //refreshAll();
            this.refreshModuleView();
        }

        addModuleDivEvent(moduleDiv: JQuery) {            
        }

        //the main panel
        refreshModuleView() {
            templateModuleView.empty();
            if (currentObject === undefined) return;

            //draw a table showing all possible positions to place modules
            var hull = BaseDataModule.shipHulls[currentObject.shipHullId];
            var imageSource = "images/" + hull.templateImageUrl;

            if (BaseDataModule.shipHullsImageExists(currentObject.shipHullsImage)) {                     
                imageSource = mainObject.imageObjects[BaseDataModule.shipHullsImages[currentObject.shipHullsImage].templateImageId].texture.src;                
            }
            var width = mainObject.imageObjects[BaseDataModule.shipHullsImages[currentObject.shipHullsImage].templateImageId].texture.width;
            var height = mainObject.imageObjects[BaseDataModule.shipHullsImages[currentObject.shipHullsImage].templateImageId].texture.height;
            
            var modulesDiv = $("<div/>", { style: "background-image:url(" + imageSource + ");width:" + width + "px;height:" + height + "px;background-repeat:no-repeat;" });
            
            for (var i = 0; i < 15; i++) {
                var moduleCol = (i * 40) + 2;
                moduleCol += BaseDataModule.shipHullsImages[currentObject.shipHullsImage].templateModulesXoffset;
                
                for (var j = 0; j < 15; j++) {
                    if (hull.modulePositionExists(i, j)) {
                        var moduleRow = (j * 40) + 2;
                        moduleRow += BaseDataModule.shipHullsImages[currentObject.shipHullsImage].templateModulesYoffset;

                        var moduleDiv = $("<div/>", { "class": "shipDesignerModulePlace shipDesignerModuleSize", style: "left:" + moduleCol + "px;top:" + moduleRow + "px;" });
                        //moduleDiv.css('background-color', 'Gainsboro');
                        moduleDiv.data("modulePosition", hull.getModuleByPosition(i, j));
                        Helpers.Log("refreshModuleView: moduleDiv.droppable 1");
                        this.addModuleDivEvent(moduleDiv);
                                                

                        if (currentObject.modulePositionExists(i, j)) {
                            ShipTemplateDesigner.designerPanel.insertModuleDiv(moduleDiv, currentObject.getModuleByPosition(i, j).shipmodule, currentObject.getModuleByPosition(i, j));
                        }

                        modulesDiv.append(moduleDiv);

                        modulesDiv.addClass("modulePosition");
                    }
                }
            }
            templateModuleView.append(modulesDiv);
        }

        insertModuleDiv(parent: JQuery, shipModule: BaseDataModule.ShipModule, targetPosition: Ships.ModulePosition) {
            parent.empty();

            var goodId = shipModule.goodsId;
            var goodsDiv = $("<div/>", { title: i18n.label( mainObject.goods[goodId].label) });
            var imageSource = mainObject.imageObjects[mainObject.goods[goodId].goodsObjectId].texture.src;
            //goodsDiv.append($("<img/>", { src: imageSource, width: "30px", height: "30px", alt: "BLAH", "class": "ui-corner-all" }));
            goodsDiv.append($("<img/>", { src: imageSource, "class": "shipDesignerModuleSize" }));
            if (this.owner == mainObject.user.id) {
                goodsDiv.draggable({
                    "containment": $('.relPopupPanel', DesignerContainer),
                    "stop": function () {
                        Helpers.Log("insertModuleDiv: goodsDiv.draggable");
                        ShipTemplateDesigner.designerPanel.setSave(false);
                        var orgPosition = goodsDiv.data("modulePosition");
                        var shipmodule: BaseDataModule.ShipModule = goodsDiv.data("moduletype");
                        if (orgPosition != null) { ShipTemplateDesigner.currentObject.removeModuleAtPosition(orgPosition); }
                        if (currentShip) {
                            var duplicate = <Ships.Ship>currentObject;
                            if (duplicate.goods[shipmodule.goodsId] != null) duplicate.goods[shipmodule.goodsId] += 1; else duplicate.goods[shipmodule.goodsId] = 1;
                        }
                        goodsDiv.remove();
                        ShipTemplateDesigner.designerPanel.calcCostsAndRefresh();
                    }
                    //  appendTo: "body",
                    //helper: "clone"
                });
            }
            goodsDiv.data("moduletype", shipModule);
            goodsDiv.data("modulePosition", targetPosition);

            parent.append(goodsDiv);
        }

        //called by event of droppable area and item -> 
        droppedModule(event, ui) {
            this.setSave(false);
            var target = event.target;
            var targetPosition: Ships.ModulePosition = $(target).data("modulePosition");
            // Helpers.Log("!!!!! " + targetPosition.posX + "  "  + targetPosition.posY);

            var shipmodule: BaseDataModule.ShipModule = ui.draggable.data("moduletype");
            // Helpers.Log("!!!!! " + i18n.label(shipmodule.label));

            if (currentObject.getModuleByPosition(targetPosition.posX, targetPosition.posY)) {
                var oldModulePosition = currentObject.getModuleByPosition(targetPosition.posX, targetPosition.posY);
                var oldModule = oldModulePosition.shipmodule;
                if (currentShip) {
                    var duplicate = <Ships.Ship>currentObject;
                    if (duplicate.goods[oldModule.goodsId])
                        duplicate.goods[oldModule.goodsId] += 1;
                    else
                        duplicate.goods[oldModule.goodsId] = 1;
                }
                currentObject.removeModuleAtPosition(oldModulePosition);
            }

            currentObject.insertModuleAtPosition(targetPosition, shipmodule);
            this.insertModuleDiv($(target), shipmodule, targetPosition);

            if (currentShip) {
                var duplicate = <Ships.Ship>currentObject;
                if (duplicate.goods[shipmodule.goodsId])
                    duplicate.goods[shipmodule.goodsId] -= 1;
                else
                    duplicate.goods[shipmodule.goodsId] = -1;
            }

            this.calcCostsAndRefresh();
        }

       

        
        
        //called when a template is switched to another or when the form is closed
        //shall warn that changed will be omitted
        checkSaveState(methodToCall: any, parameter1: any) {
            //ShipTemplateDesigner.currentTemplate.
            if (currentObject === undefined
                || currentObject.isSaved) {
                methodToCall(parameter1);
                return;
            }
            
            var headerText = "";
            var bodyText = "";
            if (currentObject instanceof (Ships.Ship)) {
                headerText = "Skip refitting?";
            } else {
                headerText = "Skip changes?";
            }
            bodyText = headerText;
            headerText = "";

            var scrapTemplate = ElementGenerator.createNoYesPopup(
                (e) => { e.preventDefault(); methodToCall(parameter1); scrapTemplate.remove(); },
                (e) => { e.preventDefault(); scrapTemplate.remove(); },
                headerText,
                bodyText,
                DesignWindow
                );
            ElementGenerator.adjustPopupZIndex(scrapTemplate, 16000);
            ElementGenerator.makeSmall(scrapTemplate);

            scrapTemplate.appendTo("body"); //attach to the <body> element
        }
        
        save() {
            throw new Error('This method is abstract');
        }

        SaveRepair() {
            throw new Error('This method is abstract');
        }

        SaveRefit() {
            throw new Error('This method is abstract');
        }

        RepairRefitClick() {
            throw new Error('This method is abstract');
        }

    }

    /*----------------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------------------------------------*/

    //The ship designer view dfor creating new Templates
    export class DesignerTemplate extends DesignerBase {

        templateSelector: JQuery;

        runTemplate(_currentObject: ShipTemplateStatistics) {
            Helpers.Log("DesignerTemplate.runTemplate");
            this.owner = mainObject.user.id;
            super.runTemplate(_currentObject);
        }

        refreshTemplateList() {
            var template = <ShipTemplateModule.ShipTemplate>currentObject;
            var templateTable = $('.fullscreenTable', this.templateSelector);
            templateTable.addClass("ShipTemplateShipList");
            templateTable.empty();
            if (currentObject !== undefined && currentObject.id === -1) templateTable.append(this.templateListRow(template));
            for (var templatesIndex = 0; templatesIndex < ShipTemplateModule.shipTemplates.length; templatesIndex++) {
                if (ShipTemplateModule.shipTemplates[templatesIndex] === undefined || ShipTemplateModule.shipTemplates[templatesIndex] === null) continue;
                if (ShipTemplateModule.shipTemplates[templatesIndex].obsolete) continue;
                if (!PlayerData.hullsAvailable(ShipTemplateModule.shipTemplates[templatesIndex].shipHullId)) continue;
                templateTable.append(this.templateListRow(ShipTemplateModule.shipTemplates[templatesIndex]));
            }
        }

        setDesignerPanels() {           
            $('.noButton span', DesignerContainer).css("display", "block");
            this.rightSideSelection();

            //left side: template selection
            this.leftSideTemplateSelection();
            this.refreshTemplateList();
            $('.noButton span', DesignerContainer).text(i18n.label(288));
            $('.noButton', DesignerContainer).click((e: JQuery.Event) => { ShipTemplateDesigner.designerPanel.setSave(true); ShipTemplateDesigner.designerPanel.save(); });                       
        }

        copyTemplate() {
            var template = <ShipTemplateModule.ShipTemplate>currentObject;
            //creates a copy of the selected template. If that templates was changed and is not saved yet, this may be done now...
            if (currentObject === undefined) return;

            if (!currentObject.isSaved) {

                return;
            }
            var newName = i18n.label(289) + currentObject.name;
            currentObject = template.createDuplicate();
            currentObject.id = -1;
            currentObject.name = newName;
            this.setSave(false);
            this.refreshAll();
        }

        createNewTemplate() {
            if (!PlayerData.hullsAvailable(1)) return;
            currentObject = new ShipTemplateModule.ShipTemplate(-1);
            currentObject.shipHullId = BaseDataModule.shipHullExists(1) ? 1 : BaseDataModule.shipHullFirst();
            currentObject.shipHullsImage = BaseDataModule.shipHullsImageFirst(currentObject.shipHullId);
            currentObject.name = i18n.label(290);
            this.calcCostsAndRefresh();
        }

        deleteTemplate() {
            var template = <ShipTemplateModule.ShipTemplate>currentObject;
            if (currentObject.id == -1) {
                currentObject = undefined;
                this.refreshAll();
                return;
            }

            //send ajax to delete (no return value, since delete is always allowed
            var xhttp = GetXmlHttpObject();
            xhttp.open("POST", "Server/Ships.aspx?action=deleteShipTemplate&templateId=" + currentObject.id.toString(), true);
            xhttp.send();

            //delete this template:

            template.deleteTemplate();
            currentObject = undefined;
            this.refreshAll();
        }

        leftSideTemplateSelection() {
            var panelBody = $('.relPopupBody', DesignerContainer);
            var buttonBar = $('<div/>', { "class": "shipDesignerTemplateButtonDiv" });
            var newButton = $("<button/>", { text: i18n.label(285) }); //new
            newButton.click( () => { this.createNewTemplate(); });
            copyButton = $("<button/>", { text: i18n.label(286) }); //copy
            copyButton.click( () => { this.copyTemplate(); });
            deleteButton = $("<button/>", { text: i18n.label(287) }); //delete
            deleteButton.click( () => { this.deleteTemplate(); });
            panelBody.append(buttonBar);
            buttonBar.append(newButton).append(copyButton).append(deleteButton);
            newButton.button();
            copyButton.button({ disabled: true });
            deleteButton.button({ disabled: true });

            this.templateSelector = $('<div/>', { "class": "shipDesignerTemplateDiv BackgroundDarkGray" });
            this.templateSelector.addClass("trHighlight");
            panelBody.append(this.templateSelector);
            var templateTable = $("<table/>", { "cellspacing": 0, "class": "fullscreenTable width100" });// , style:"border-collapse: collapse;"                
            this.templateSelector.append(templateTable);
        }

        rightSideSelection() {
            var panelBody = $('.relPopupBody', DesignerContainer);
            var moduleSelector = $('<div/>', { "class": "shipDesignerModuleDiv BackgroundDarkGray" });
            templateModuleSelector = moduleSelector;
            panelBody.append(moduleSelector);

            var uiAccordion = $("<div/>");
            this.moduleTable(uiAccordion, BaseDataModule.ShipModuleTypes.Primary, i18n.label(282));
            this.moduleTable(uiAccordion, BaseDataModule.ShipModuleTypes.Secondary, i18n.label(283));
            this.moduleTable(uiAccordion, BaseDataModule.ShipModuleTypes.Auxiliary, i18n.label(284));
            moduleSelector.append(uiAccordion);
            uiAccordion.accordion({
                "collapsible": true,
                "heightStyle": "content"
            });
           
        }

        refreshTemplateButtons() {
            //sets the copy and delete button:
            if (currentObject !== undefined && (currentObject.id > -1))
                copyButton.button("enable");
            else
                copyButton.button("disable");

            if (currentObject !== undefined)
                deleteButton.button("enable");
            else
                deleteButton.button("disable");
        }

        setSave(state: boolean) {
            super.setSave(state);
            if (!currentShip) {                
                this.refreshTemplateButtons();
            }
        }


        moduleTable(accordionDiv: JQuery, moduleType: BaseDataModule.ShipModuleTypes, header: string) {
            var hasModule = false;
            var div = $("<div/>");
            var goodsFound = false;


            for (var currentGoodsIndex = 0; currentGoodsIndex < BaseDataModule.modules.length; currentGoodsIndex++) {
                if (BaseDataModule.modules[currentGoodsIndex] == null) continue;
                if (mainObject.goods[BaseDataModule.modules[currentGoodsIndex].goodsId] == null) continue; //should never occur...
                if (BaseDataModule.modules[currentGoodsIndex].moduleType != moduleType) continue;

                var goodsAmount: number;
                if (mainObject.currentColony != null) {
                    goodsAmount = mainObject.currentColony.goods[BaseDataModule.modules[currentGoodsIndex].goodsId] || 0;
                } else goodsAmount = 0;

                var goodsTd = DrawInterface.createGoodsDiv(BaseDataModule.modules[currentGoodsIndex].goodsId, goodsAmount);   //mainInterface.createGoodsTd(BaseDataModule.modules[currentGoodsIndex].goodsId, goodsAmount);
                
                if (mainObject.currentColony != null) { }
                else {
                    $(".goodsAmount", goodsTd).css("display", "none");
                }
                goodsTd.css("z-index", "16000");
                goodsTd.draggable({
                    "appendTo": $('.relPopupPanel', DesignerContainer),
                    "containment": "parent",
                    "helper": "clone"
                });
                goodsTd.data("moduletype", BaseDataModule.modules[currentGoodsIndex]);

                switch (BaseDataModule.modules[currentGoodsIndex].level) {
                    case 1: goodsTd.css("background-color", "#999999"); break;
                    case 2: goodsTd.css("background-color", "lightgreen"); break;
                    case 3: goodsTd.css("background-color", "LightBlue"); break;
                    case 4: goodsTd.css("background-color", "#E0B2C2"); break;  //light red
                    case 5: goodsTd.css("background-color", "#ed89ff"); break;  //light purple
                    case 6: goodsTd.css("background-color", "lightgreen"); break;
                }


                goodsTd.addClass("ModuleLevelBg" + BaseDataModule.modules[currentGoodsIndex].level.toString());
               

                goodsTd.tooltip(BaseDataModule.getRelationObjectTooltip(ObjectTypes.ShipModule, currentGoodsIndex));

                goodsFound = true;

                goodsTd.css("display", "inline-block");
                goodsTd.css("margin", "2px");
                goodsTd.css("vertical-align", "middle");

                div.append(goodsTd);
            }

            /*
            var goodsTable = $("<table/>");
            var currentGoodsIndex = 0; // needed as index in the for-loop   
            //OLD: a bit complicated, because we do not know in advance how many lines there will be in the table
            //ToDO: Use goodsDiv.css("display", "inline-block"), see ShipTemplateDesigner , goodsTable()
            var currentGoodsFound = 0; //just needed to create a new line after 
            while (true) {
                if (currentGoodsIndex == BaseDataModule.modules.length) break;


                var goodsTr = $("<tr/>");
                for (; currentGoodsIndex < BaseDataModule.modules.length; currentGoodsIndex++) {
                    if (BaseDataModule.modules[currentGoodsIndex] == null) continue;
                    if (mainObject.goods[BaseDataModule.modules[currentGoodsIndex].goodsId] == null) continue; //should never occur...
                    if (BaseDataModule.modules[currentGoodsIndex].moduleType != moduleType) continue;

                    var goodsAmount: number;
                    if (mainObject.currentColony != null) {
                        goodsAmount = mainObject.currentColony.goods[BaseDataModule.modules[currentGoodsIndex].goodsId] || 0;
                    } else goodsAmount = 0;

                    var goodsTd = mainInterface.createGoodsTd(BaseDataModule.modules[currentGoodsIndex].goodsId, goodsAmount);
                    goodsTr.append(goodsTd);
                    if (mainObject.currentColony != null) { }
                    else {
                        $(".goodsAmount", goodsTr).css("display", "none");
                    }
                    goodsTd.css("z-index", "16000");
                    goodsTd.draggable({                       
                        "helper": "clone"
                    });
                    goodsTd.data("moduletype", BaseDataModule.modules[currentGoodsIndex]);

                    switch (BaseDataModule.modules[currentGoodsIndex].level) {
                        case 2: $(".goodsBorderBlack", goodsTd).css("background-color", "lightgreen"); break;
                        case 3: $(".goodsBorderBlack", goodsTd).css("background-color", "LightBlue"); break;
                        case 4: $(".goodsBorderBlack", goodsTd).css("background-color", "#E0B2C2"); break;  //light red
                        case 5: $(".goodsBorderBlack", goodsTd).css("background-color", "#ed89ff"); break;  //light purple
                        case 6: $(".goodsBorderBlack", goodsTd).css("background-color", "lightgreen"); break;
                    }

                    goodsTd.tooltip(BaseDataModule.getRelationObjectTooltip(ObjectTypes.ShipModule, currentGoodsIndex));  

                    currentGoodsFound++;
                    if (currentGoodsFound % 4 == 0) { currentGoodsIndex++; break; } //jump into the while
                }
                goodsTable.append(goodsTr);
            }

            div.append(goodsTable);
            */


            if (goodsFound) {
                var head = $("<h3/>", { text: header });
                accordionDiv.append(head);
                accordionDiv.append(div);
            }


            
        }

        


        addModuleDivEvent(moduleDiv : JQuery) {
            moduleDiv.droppable({
                "activeClass": "ui-state-default",
                "hoverClass": "ui-state-hover",
                "accept": ":not(.ui-sortable-helper)",
                "drop":  (event, ui) => {
                    Helpers.Log("refreshModuleView: moduleDiv.droppable 2");
                    event.stopPropagation();
                    this.droppedModule(event, ui);

                }
            });
        }

        refreshCosts() {
            var template = <ShipTemplateModule.ShipTemplate>ShipTemplateDesigner.currentObject;
            templateCosts.empty();
            if (currentObject === undefined) return;        
            var costs: number[] = template.costs;
          
           


            for (var goodsIndex = 0; goodsIndex < costs.length; goodsIndex++) {
                if (costs[goodsIndex] == null) continue;                            


               

                var goodsDiv = mainInterface.createGoodsDiv(goodsIndex, costs[goodsIndex]);
                goodsDiv.css("display","inline-block");               
                templateCosts.append(goodsDiv);
            }
        }

        refreshStatistics() {
            super.refreshStatistics();
            $('#HullSelector').prop('disabled', false);
            $('#LeftHullImage').prop('disabled', false);
            $('#RightHullImage').prop('disabled', false);
        }

        refreshAll() {
            this.refreshTemplateList();            
            this.refreshStatistics();
            this.refreshModuleView();
            this.refreshCosts();
            this.refreshTemplateButtons();            
        }

        save() {
            //create a xml in the same format as ShipTemplate.xml
            /*
            <?xml version="1.0" encoding="utf-8" ?>
            <ShipTemplate>
              <ShipTemplateId>1</ShipTemplateId>
              <ShipTemplateHullId>1</ShipTemplateHullId>
              <name>testName</name>
              <gif>scout.png</gif>
              <modulePositions>
                <modulePosition>
                  <posX>3</posX>
                  <posY>3</posY>
                  <moduleId>1</moduleId>
                </modulePosition>
                <modulePosition>
                  <posX>2</posX>
                  <posY>3</posY>
                  <moduleId>2</moduleId>
                </modulePosition>   
              </modulePositions>
            </ShipTemplate>
            */
            //var templateXml = '<?xml version="1.0" encoding="utf-8" ?><ShipTemplate>'
            var templateXml = '<ShipTemplate>'
            templateXml += '<ShipTemplateId>' + currentObject.id + '</ShipTemplateId>';
            templateXml += '<ShipTemplateHullId>' + currentObject.shipHullId + '</ShipTemplateHullId>';
            templateXml += '<name>' + currentObject.name + '</name>';
            templateXml += '<gif>scout.png</gif>';
            templateXml += '<shipHullsImage>' + currentObject.shipHullsImage + '</shipHullsImage>';
            templateXml += '<modulePositions>';
            for (var i = 0; i < currentObject.modulePositions.length; i++) {
                if (currentObject.modulePositions[i] === undefined) continue;
                templateXml += '<modulePosition>';
                templateXml += '<posX>' + currentObject.modulePositions[i].posX + '</posX>';
                templateXml += '<posY>' + currentObject.modulePositions[i].posY + '</posY>';
                templateXml += '<moduleId>' + currentObject.modulePositions[i].shipmoduleId + '</moduleId>';
                templateXml += '</modulePosition>';
            }
            templateXml += '</modulePositions>';
            templateXml += '</ShipTemplate>';

            //var send = '<transfer><sender><shipId>3</shipId><goods><good><goodsId>3</goodsId><amount>10</amount></good></goods></sender><receiver><shipId>8</shipId><goods></goods></receiver></transfer>';

            var xhttp = GetXmlHttpObject();

            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4) {
                    //Helpers.Log("star id in Ajax: " + starId);

                    var xmlTemplate = xhttp.responseXML;       

                    ShipTemplateModule.getTemplatesFromXML(xmlTemplate);

                    //change template to the returnvalue...
                    var id = parseInt(xmlTemplate.getElementsByTagName("id")[0].childNodes[0].nodeValue);
                    if (ShipTemplateModule.templateExists(id)) {
                        currentObject = ShipTemplateModule.shipTemplates[id].createDuplicate();
                        ShipTemplateDesigner.designerPanel.refreshAll();
                    }

                }


                document.getElementById('loader').style.display = 'none';
            }

            xhttp.open("POST", "Server/Ships.aspx?action=sendShipTemplate", true);
            document.getElementById('loader').style.display = 'block';
            xhttp.send(templateXml);
        }

    }


    //The Ship Details View (base)
    export class DesignerShip extends DesignerBase {
        runTemplate(_currentObject: ShipTemplateStatistics) {
            Helpers.Log("DesignerShip.runTemplate");

            currentShip = <Ships.Ship>_currentObject
            currentObject = currentShip.createDuplicate();
            this.owner = currentShip.owner;

            super.runTemplate(_currentObject);
        }

          createBar(): JQuery {

            var cargobar = $('<div/>');
            cargobar.css("margin", "15px");
            cargobar.progressbar();
            cargobar.progressbar("option", "value", 25);

            cargobar.find(".ui-progressbar-value").css({
                //"background": '#' + Math.floor(Math.random() * 16777215).toString(16)
                "background": '#00FF00'
            });
              var progressLabel = $('<div/>', { "class":"progressLabel text"});
            cargobar.append(progressLabel);          

            return cargobar;
        }

        currentProgress(): number {
            //return mainInterface.cargoHoldUsed(this.countCargo(), this.cargoroom);

            return Math.floor((currentShip.transcension.amountInvested() / currentShip.transcension.transAddNeeded) * 100);
        }

        refreshStatistics() {
            super.refreshStatistics();
            $('#HullSelector').prop('disabled', 'disabled');
            $('#LeftHullImage').css('display', 'none');
            $('#RightHullImage').css('display', 'none');
        }

        refreshTranscensionProgress() {
            
            templateCosts.empty();
            currentShip.transcension.amountInvested();

            var cargobar = this.createBar();
            var progressLabel = $(".progressLabel", cargobar);

            cargobar.progressbar("option", {
                value: this.currentProgress()
            });
            progressLabel.text(this.currentProgress() + "%");

            templateCosts.append(cargobar);

            var transAddCount = $('<div/>', { "class": "transAddCount text" });
            transAddCount.text(currentShip.transcension.amountInvested());

            templateCosts.append(transAddCount);



            var overallCosts = $('<div/>', { "class": "overallCosts text" });
            overallCosts.text(currentShip.transcension.transAddNeeded);

            templateCosts.append(overallCosts);
        }

    }

    //The Ship Details View for own Ships
    export class DesignerOwnShip extends DesignerShip {

        

        setDesignerPanels() {         
            this.hideLeft();               
            //this.setPanels(false, true, true, false);
            this.rightSideSelection();

            var selfDestruct: JQuery;                       
            selfDestruct = $('<button/>', { text: i18n.label(209), style: "font-size: 1.1em;font-weight: bold;padding: 5px;margin: 8px;" });
            $('.relPopupFooter div', DesignerContainer).prepend(selfDestruct);
            selfDestruct.button();
            selfDestruct.css("margin-right", "20px");

            selfDestruct.click(() => {
                var scrapTemplate = ElementGenerator.createNoYesPopup(
                    //create the "yes" function
                    (e) => {
                        e.preventDefault();
                        $.ajax("Server/Ships.aspx", {
                            type: "GET",
                            async: true,
                            data: {
                                "action": "selfDestruct",
                                "shipId": currentShip.id.toString()
                            }
                        });
                        scrapTemplate.remove(); 
                        currentShip.deleteShip();

                        mainObject.deselectShip();
                        mainInterface.drawAll();
                        ShipTemplateDesigner.designerPanel.close();
                        
                    },
                    //the "No"-Event
                    (e) => { e.preventDefault(); scrapTemplate.remove(); },
                    i18n.label(209), //self destruct
                    i18n.label(619) //Should the ship be destroyed?
                    , DesignWindow
                    );
                $(".bX", scrapTemplate).css("display", "none");
                ElementGenerator.adjustPopupZIndex(scrapTemplate, 16000);
                ElementGenerator.makeSmall(scrapTemplate);
                scrapTemplate.appendTo("body"); //attach to the <body> element                
            });
            $('.noButton', DesignerContainer).click((e: JQuery.Event) => { ShipTemplateDesigner.designerPanel.RepairRefitClick(); });


            this.SetRepairRefitButton();

           
        }

        SetRepairRefitButton() {
            $('.noButton', DesignerContainer).css("display", "inline-block");
            //Refit or Repair?
            if (currentShip.currentHitpoints < currentShip.hitpoints) {
                //Repair
                var CanRepair = false;
                var Tile = currentShip.parentArea.tilemap.findCreateTile({ col: mainObject.parseInt(currentShip.colRow.col), row: mainObject.parseInt(currentShip.colRow.row) });
                //detect if ship is over a main colony belongign to player or allied
                if (Tile.stars != null) {
                    if (Tile.stars instanceof PlanetData) {
                        var planet: PlanetData = <PlanetData> Tile.stars;
                        if (planet.colony != null && planet.isMainColony()) {

                            //check if allied or own
                            if (planet.colony.owner == mainObject.user.id ||
                                mainObject.user.relationToOtherUser(planet.colony.owner) == 5) {
                                CanRepair = true;
                            }

                        }
                    }
                }

                if (CanRepair) {
                    $('.noButton span', DesignerContainer).text(i18n.label(983)); //Refit
                   // $('.noButton', DesignerContainer).click((e: JQuery.Event) => { ShipTemplateDesigner.designerPanel.save(); });
                } else {
                    $('.noButton', DesignerContainer).css("display", "none");
                }

            }
            else {
                //Refit
                $('.noButton span', DesignerContainer).text(i18n.label(612)); //Refit
              /*  $('.noButton', DesignerContainer).click((e: JQuery.Event) => {
                    var scrapTemplate = ElementGenerator.createNoYesPopup(
                        (e) => { e.preventDefault(); ShipTemplateDesigner.designerPanel.setSave(true); ShipTemplateDesigner.designerPanel.save(); scrapTemplate.remove(); },
                        (e) => { e.preventDefault(); scrapTemplate.remove(); },
                        i18n.label(613), //Refit the ship?
                        i18n.label(614) //Refitting will disable ship systems for 4 turns, rendering it defenseless.
                        );
                    ElementGenerator.adjustPopupZIndex(scrapTemplate, 16000);
                    ElementGenerator.makeSmall(scrapTemplate);

                    scrapTemplate.appendTo("body"); //attach to the <body> element
                });*/
            }
        }

        RepairRefitClick() {
            if (currentShip.currentHitpoints < currentShip.hitpoints) {
                //Repair - check and repair
                var CanRepair = false;
                var Tile = currentShip.parentArea.tilemap.findCreateTile({ col: mainObject.parseInt(currentShip.colRow.col), row: mainObject.parseInt(currentShip.colRow.row) });
                //detect if ship is over a main colony belongign to player or allied
                if (Tile.stars != null) {
                    if (Tile.stars instanceof PlanetData) {
                        var planet: PlanetData = <PlanetData> Tile.stars;
                        if (planet.colony != null && planet.isMainColony()) {

                            //check if allied or own
                            if (planet.colony.owner == mainObject.user.id ||
                                mainObject.user.relationToOtherUser(planet.colony.owner) == 5) {
                                CanRepair = true;
                            }

                        }
                    }
                }

                if (CanRepair) ShipTemplateDesigner.designerPanel.save();
            }
            else {
                //Refit: make a popup
                var scrapTemplate = ElementGenerator.createNoYesPopup(
                    (e) => { e.preventDefault(); ShipTemplateDesigner.designerPanel.setSave(true); ShipTemplateDesigner.designerPanel.save(); scrapTemplate.remove(); },
                    (e) => { e.preventDefault(); scrapTemplate.remove(); },
                    i18n.label(613), //Refit the ship?
                    i18n.label(614) //Refitting will disable ship systems for 4 turns, rendering it defenseless.
                    );
                ElementGenerator.adjustPopupZIndex(scrapTemplate, 16000);
                ElementGenerator.makeSmall(scrapTemplate);

                scrapTemplate.appendTo("body"); //attach to the <body> element
            }

        }

        rightSideSelection() {
            var panelBody = $('.relPopupBody', DesignerContainer);
            var moduleSelector = $('<div/>', { "class": "shipDesignerGoodsDiv" });
            panelBody.append(moduleSelector);
            this.goodsTable(moduleSelector);
            //refreshGoodsSelection();                       
        }

        addModuleDivEvent(moduleDiv: JQuery) {
            moduleDiv.droppable({
                "activeClass": "ui-state-default",
                "hoverClass": "ui-state-hover",
                "accept": ":not(.ui-sortable-helper)",
                "drop": (event, ui) => {
                    Helpers.Log("refreshModuleView: moduleDiv.droppable 2");
                    event.stopPropagation();
                    this.droppedModule(event, ui);

                }
            });
        }

        goodsTable(parent: JQuery) {
            var duplicateShip = <Ships.Ship>currentObject; //currentObject is a duplicate, changes will only be transferred upon saving
            var hasModule = false;
            var div = $("<div/>");

            for (var currentModuleIndex = 0; currentModuleIndex < BaseDataModule.modules.length; currentModuleIndex++) {
                if (BaseDataModule.modules[currentModuleIndex] == null) continue; //might be a sparse array
                var currentModule = BaseDataModule.modules[currentModuleIndex];
                var currentGoodsIndex = currentModule.goodsId;
                if (mainObject.goods[currentGoodsIndex] == null) continue; //should never occur...
                if (mainObject.goods[currentGoodsIndex].goodsType != 2) continue; //only modules
                if (!duplicateShip.goods[currentGoodsIndex]) continue; //show only modules that are in ship stock

                var goodsAmount: number;
                goodsAmount = duplicateShip.goods[currentGoodsIndex];
                var goodsDiv = mainInterface.createGoodsDiv(BaseDataModule.modules[currentModuleIndex].goodsId, goodsAmount);
                goodsDiv.css("display", "inline-block");
                goodsDiv.css("margin", "2px");
                div.append(goodsDiv);
                goodsDivs.push({ moduleId: currentModuleIndex, goodsDiv: goodsDiv });

                goodsDiv.draggable({
                    "appendTo": $('.relPopupPanel', DesignerContainer),
                    "containment": "parent",
                    "helper": "clone"                  
                });
                goodsDiv.data("moduletype", BaseDataModule.modules[currentModuleIndex]);

                switch (BaseDataModule.modules[currentModuleIndex].level) {
                    case 2: $(".goodsBorderBlack", goodsDiv).css("background-color", "lightgreen"); break;
                    case 3: $(".goodsBorderBlack", goodsDiv).css("background-color", "lightgreen"); break;
                    case 4: $(".goodsBorderBlack", goodsDiv).css("background-color", "#E0B2C2"); break;
                    case 5: $(".goodsBorderBlack", goodsDiv).css("background-color", "lightgreen"); break;
                    case 6: $(".goodsBorderBlack", goodsDiv).css("background-color", "lightgreen"); break;
                }
            }

            parent.append(div);

        }

        // The right side module select tables
        refreshRightSideSelection() {
            var moduleSelector = $('.shipDesignerGoodsDiv', DesignerContainer);
            this.refreshGoodsTable(moduleSelector);
            //goodsTable(moduleSelector);
        }

        refreshGoodsTable(container: JQuery) {
            var duplicateShip = <Ships.Ship>currentObject; //currentObject is a duplicate, changes will only be transferred upon saving

            var div = container.children().first();

            for (var currentModuleIndex = 0; currentModuleIndex < BaseDataModule.modules.length; currentModuleIndex++) {
                if (BaseDataModule.modules[currentModuleIndex] == null) continue; //might be a sparse array
                var currentModule = BaseDataModule.modules[currentModuleIndex];
                var currentGoodsIndex = currentModule.goodsId;
                if (mainObject.goods[currentGoodsIndex] == null) continue; //should never occur...
                if (mainObject.goods[currentGoodsIndex].goodsType != 2) continue; //only modules
                if (duplicateShip.goods[currentGoodsIndex] == null) {//show only modules that are in ship stock

                    //but keep showing them if they are already in the goodsDivs
                    continue;
                }
                var goodsAmount: number;
                goodsAmount = duplicateShip.goods[currentGoodsIndex];

                var alreadyExists = false;
                for (var i = 0; i < goodsDivs.length; i++) {
                    if (goodsDivs[i].moduleId == currentModuleIndex) {
                        alreadyExists = true;
                        $(".goodsAmount", goodsDivs[i].goodsDiv).text(goodsAmount);
                    }
                }
                //containment: 'html',
                if (!alreadyExists) {
                    var goodsDiv = mainInterface.createGoodsDiv(BaseDataModule.modules[currentModuleIndex].goodsId, goodsAmount);
                    goodsDiv.css("display", "inline-block");
                    goodsDiv.css("z-index", 30000);
                    goodsDiv.css("margin", "2px");
                    goodsDivs.push({ moduleId: currentModuleIndex, goodsDiv: goodsDiv });
                    div.append(goodsDiv);
                    goodsDiv.draggable({
                        "appendTo": $('.relPopupPanel', DesignerContainer),
                        "containment": "parent",
                        "helper": "clone" /*,
                        "stack": ".draggable",
                        
                        "start": function (e, ui) {
                            Helpers.Log('3');
                            $(ui.helper).css("display","block");
                        }*/
                    });
                    goodsDiv.data("moduletype", BaseDataModule.modules[currentModuleIndex]);

                    switch (BaseDataModule.modules[currentModuleIndex].level) {
                        case 2: $(".goodsBorderBlack", goodsDiv).css("background-color", "lightgreen"); break;
                        case 3: $(".goodsBorderBlack", goodsDiv).css("background-color", "lightgreen"); break;
                        case 4: $(".goodsBorderBlack", goodsDiv).css("background-color", "#E0B2C2"); break;
                        case 5: $(".goodsBorderBlack", goodsDiv).css("background-color", "lightgreen"); break;
                        case 6: $(".goodsBorderBlack", goodsDiv).css("background-color", "lightgreen"); break;
                    }
                }
            }
        }
      
        refreshCosts() {
            templateCosts.empty();

            var Factor = 1 - (currentShip.currentHitpoints / currentShip.hitpoints);

            if (Factor <= 0) return;

            Factor = Factor * 0.75;

            var costs: number[] = currentObject.CostsInBaseResources(Factor);
            
            var borderColor: string;
            var colony: ColonyModule.Colony = null;
            var Tile = currentShip.parentArea.tilemap.findCreateTile({ col: mainObject.parseInt(currentShip.colRow.col), row: mainObject.parseInt(currentShip.colRow.row) });
            //detect if ship is over a main colony belongign to player or allied
            if (Tile.stars != null) {
                if (Tile.stars instanceof PlanetData) {
                    var planet: PlanetData = <PlanetData> Tile.stars;
                    if (planet.colony != null && planet.isMainColony()) {

                        //check if allied or own
                        if (planet.colony.owner == mainObject.user.id ||
                            mainObject.user.relationToOtherUser(planet.colony.owner) == 5) {
                            colony = planet.colony;
                        }

                    }
                }
            }

            var CostsFound = false;
            for (var goodsIndex = 0; goodsIndex < costs.length; goodsIndex++) {
                if (costs[goodsIndex] == null) continue;

                borderColor = null;
                //var amount = costs[goodsIndex].toString();
                if (colony) {
                    if (colony.goods[goodsIndex] == null) borderColor = "borderColorRed";
                    if (costs[goodsIndex] > colony.goods[goodsIndex]) borderColor = "borderColorRed";
                } else {
                    borderColor = "borderColorRed";
                }

                var goodsDiv = mainInterface.createGoodsDiv(goodsIndex, costs[goodsIndex], borderColor);
                goodsDiv.css("display", "inline-block");
                templateCosts.append(goodsDiv);
                CostsFound = true;
            }

            if (CostsFound) {
                var RepairCosts = $("<span/>", { "text": i18n.label(982) });
                RepairCosts.css("margin-left","4px");
                var RepairCostsNL = $("<br/>");
                templateCosts.prepend(RepairCostsNL);
                templateCosts.prepend(RepairCosts);
            }
        }


        refreshAll() {
            this.refreshStatistics();
            this.refreshModuleView();
            this.refreshRightSideSelection();
            this.refreshCosts();
            this.SetRepairRefitButton();
        }               

        save() {
            if (ShipTemplateDesigner.currentShip.currentHitpoints < ShipTemplateDesigner.currentShip.hitpoints) ShipTemplateDesigner.designerPanel.SaveRepair();
            else ShipTemplateDesigner.designerPanel.SaveRefit(); 

        }

        SaveRepair() {


            $.ajax("Server/Ships.aspx", {
                "type": "GET",
                "data": {
                    "shipId": ShipTemplateDesigner.currentShip.id.toString(),
                    "action": "SendShipRepair"
                }
            }).done(function (msg) {
                var shipsFromXML = msg.getElementsByTagName("ship");
                for (var i = 0; i < shipsFromXML.length; i++) {
                    mainObject.shipUpdate(shipsFromXML[i]);
                }

                ColonyModule.checkColonyXML(msg);

                ShipTemplateDesigner.currentObject = ShipTemplateDesigner.currentShip.createDuplicate();
                ShipTemplateDesigner.designerPanel.calcCostsAndRefresh();
                Ships.UserInterface.refreshMainScreenStatistics(ShipTemplateDesigner.currentShip);

                document.getElementById('loader').style.display = 'none';                

            });            
        }

        SaveRefit() {
            //create a xml in the same format as ShipTemplate.xml
            /*
            <?xml version="1.0" encoding="utf-8" ?>
            <Ship>          
              <modulePositions>
                <modulePosition>
                  <posX>3</posX>
                  <posY>3</posY>
                  <moduleId>1</moduleId>
                </modulePosition>
                <modulePosition>
                  <posX>2</posX>
                  <posY>3</posY>
                  <moduleId>2</moduleId>
                </modulePosition>   
              </modulePositions>
            </Ship>
            */
            //var templateXml = '<?xml version="1.0" encoding="utf-8" ?><ShipTemplate>'
            var templateXml = '<Ship>'
            templateXml += '<ShipId>' + currentObject.id + '</ShipId>';
            templateXml += '<modulePositions>';
            for (var i = 0; i < currentObject.modulePositions.length; i++) {
                if (currentObject.modulePositions[i] === undefined) continue;
                templateXml += '<modulePosition>';
                templateXml += '<posX>' + currentObject.modulePositions[i].posX + '</posX>';
                templateXml += '<posY>' + currentObject.modulePositions[i].posY + '</posY>';
                templateXml += '<moduleId>' + currentObject.modulePositions[i].shipmoduleId + '</moduleId>';
                templateXml += '</modulePosition>';
            }
            templateXml += '</modulePositions>';
            templateXml += '</Ship>';

            //var send = '<transfer><sender><shipId>3</shipId><goods><good><goodsId>3</goodsId><amount>10</amount></good></goods></sender><receiver><shipId>8</shipId><goods></goods></receiver></transfer>';

            var xhttp = GetXmlHttpObject();

            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4) {
                    //Helpers.Log("star id in Ajax: " + starId);

                    var xmlShip = xhttp.responseXML;
                    //console.dirxml(xmlMap)            

                    mainObject.shipUpdate(xmlShip);


                }
                ShipTemplateDesigner.currentObject = ShipTemplateDesigner.currentShip.createDuplicate();
                ShipTemplateDesigner.designerPanel.calcCostsAndRefresh();

                document.getElementById('loader').style.display = 'none';
            }

            xhttp.open("POST", "Server/Ships.aspx?action=sendShipRefit", true);
            document.getElementById('loader').style.display = 'block';
            xhttp.send(templateXml);
        }
    }

    export class DesignerOtherShip extends DesignerShip {

        setDesignerPanels() {                       
            this.hideLeft();
            this.hideRight();
            //this.setPanels(false, true, false, false);           
            var selfDestruct: JQuery;    
            $('.noButton', DesignerContainer).css("display", "none");                   
        }

        refreshAll() {            
            this.refreshStatistics();
            this.refreshModuleView();            
        }

    }

    export class DesignerOwnTranscendence extends DesignerShip {

        setDesignerPanels() {
                         
            var panelBody = $('.relPopupBody', DesignerContainer);
            panelBody.addClass("shipDetailTranscension");

            var selfDestruct: JQuery;            
            this.leftSideSelection();
            this.rightSideSelection();
            /*
            selfDestruct = $('<button/>', { text: i18n.label(209), style: "font-size: 1.1em;font-weight: bold;padding: 5px;margin: 8px;" });
            $('.relPopupFooter', DesignerContainer).append(selfDestruct);

            selfDestruct.click(() => {
                var scrapTemplate = ElementGenerator.createNoYesPopup(
                    //create the "yes" function
                    (e) => {
                        e.preventDefault();
                        $.ajax("Server/Ships.aspx", {
                            type: "GET",
                            async: true,
                            data: {
                                "action": "selfDestruct",
                                "shipId": currentShip.id.toString()
                            }
                        });
                        scrapTemplate.remove(); 
                        currentShip.deleteShip();

                        mainObject.deselectShip();
                        mainInterface.drawAll();
                        ShipTemplateDesigner.designerPanel.close();
                        
                    },
                    //the "No"-Event
                    (e) => { e.preventDefault(); scrapTemplate.remove(); },
                    i18n.label(209), //self destruct
                    i18n.label(619) //Should the ship be destroyed?
                    );
                ElementGenerator.adjustPopupZIndex(scrapTemplate, 16000);
                ElementGenerator.makeSmall(scrapTemplate);
                scrapTemplate.appendTo("body"); //attach to the <body> element                
            });          
               */         
        }

        relationChanged(relationSelector: HTMLSelectElement, targetUser: PlayerData.OtherPlayer) {
            //var newValue = relationSelector.selectedIndex;
            var newValue = parseInt(relationSelector.value);
            //if (newValue == targetUser.currentRelation) return;

            if (newValue == 99) {
                $.ajax("Server/User.aspx", {
                    "type": "GET",
                    "data": { targetUser: targetUser.id.toString(), action: "removeRelation" }
                }).done(function (msg) {
                        mainObject.user.getOtherUsersFromXML(msg);
                    });

                targetUser.targetRelation = targetUser.currentRelation;

                return;
            }

            if (newValue >= targetUser.currentRelation) {
                //var xhttp = GetXmlHttpObject();
                //xhttp.open("GET", "Server/User.aspx?action=setRelation&targetUser=" + targetUser.id + "&targetRelation=" + newValue, false);
                //xhttp.send(""); //?action=setShipMovement&value=

                $.ajax("Server/User.aspx", {
                    type: "GET",
                    data: {
                        "targetUser": targetUser.id.toString(),
                        "action": "setRelation",
                        "targetRelation": newValue
                    }
                }).done(function (msg) {
                        mainObject.user.getOtherUsersFromXML(msg);
                    });

            } else {

                var confirmDiplomacyPanel = ElementGenerator.createPopup();

                ElementGenerator.adjustPopupZIndex(confirmDiplomacyPanel, 12000);
                //confirmDiplomacyPanel.adjustPopupZIndex(12000);
                

                var panelBody = $('.relPanelBody', confirmDiplomacyPanel);
                var caption = $('<h4/>', { text: i18n.label(296) });
                panelBody.append(caption);

                $('.yesButton span', confirmDiplomacyPanel).text(i18n.label(291));
                $('.noButton span', confirmDiplomacyPanel).text(i18n.label(292));

                /*
                this.tempTargetRelation = newValue;
                this.tempTargetUser = targetUser;
                this.tempRelationSelector = relationSelector;

                $('.yesButton', confirmDiplomacyPanel).click((e) => { e.preventDefault(); this.relationChangeAccepted(); confirmDiplomacyPanel.remove(); });
                */
                $('.noButton', confirmDiplomacyPanel).click(function (e) { e.preventDefault(); confirmDiplomacyPanel.remove(); relationSelector.value = targetUser.currentRelation.toString(); });

                confirmDiplomacyPanel.appendTo("body"); //attach to the <body> element

            }

            //Helpers.Log(targetUser.id + " relationChanged... " + newValue);
        }



        leftSideSelection() {

            Helpers.Log("R´Trans leftSideSelection");

            var panelBody = $('.relPopupBody', DesignerContainer);
            

            var selectorTargetRelation = $('<select/>');
           
            var option0 = $('<option/>', { "text": i18n.label(436) + " or better" });
            var option1 = $('<option/>', { "text": i18n.label(177) + " or better" });
            var option2 = $('<option/>', { "text": i18n.label(441) + " or better" });
            var option3 = $('<option/>', { "text": i18n.label(462) }); //Allied
            //var option3 = $('<option/>', { text: mainObject.relationTypes[4].name }); //Alliance

                  

            option0.val("0");            
            option0.attr('selected', 'selected');            

            option1.val("1");           
            option2.val("2");            
            option3.val("3");
                      
            selectorTargetRelation.append(option0);
            selectorTargetRelation.append(option1);
            selectorTargetRelation.append(option2);
            selectorTargetRelation.append(option3);

            selectorTargetRelation.change(() => { this.relationChanged((<HTMLSelectElement>selectorTargetRelation.get()[0]), null) });
            

            panelBody.append(selectorTargetRelation);

            var selectorDiv = $('<div/>', { "class": "shipDesignerTemplateDiv" });
            panelBody.append(selectorDiv);
            var table = ElementGenerator.tableGenerator(selectorDiv, currentShip.transcension.shipTranscensionUsers, this.createTableHeader, this.createTableLine, null, null, 45);
            table.addClass("shipDetailTranscensionHelpers");
            //selectorDiv.append(selectorTargetRelation);
            selectorTargetRelation.selectmenu();
            selectorTargetRelation.selectmenu("option", { "disabled": true });
            //selectorTargetRelation.css("display", "block");             
        }


        createTableHeader(): JQuery {

            var tableRow = $('<tr/>');
            var th = ElementGenerator.headerElement;

            tableRow.append(th(null, 10, true)); //empty            
            tableRow.append(th(442, 35)); //ID
            tableRow.append(th(443, 150)); //Name
            tableRow.append(th(281, 35, true)); //Amount            
            tableRow.append(th(null, 5)); //empty 
            return tableRow;
        }

        createTableLine(_caller: ElementGenerator.WindowManager, user: Ships.ShipTranscensionUser): JQuery {

            var tableRow = $('<tr/>');

            var tableDataFirst = $('<td/>', { "class": "firstchild" });
            tableRow.append(tableDataFirst);         

            var tableDataId = $('<td/>', { text: user.userId.toString() });
            tableRow.append(tableDataId);

            //var tableDataName = $('<td/>', { text: ship.name });

            var tableDataName = $('<td/>');
            if(PlayerData.users[user.userId] != null)
                tableDataName.html(PlayerData.users[user.userId].name);
            tableRow.append(tableDataName);

            var amount = user.amount.toString();
            var tableDataAD1 = $('<td/>', { text: amount });
            tableRow.append(tableDataAD1);

          
            var tableDataEnd = $('<td/>', { "class": "lastchild" });
            tableRow.append(tableDataEnd);
            
            return tableRow;
        }



        rightSideSelection() {
            var panelBody = $('.relPopupBody', DesignerContainer);
            var moduleSelector = $('<div/>', { "class": "shipDesignerTranshelpDiv" });
            panelBody.append(moduleSelector);


            //this.goodsTable(moduleSelector);
            //refreshGoodsSelection();                       
        }

       
        refreshAll() {
            this.refreshStatistics();
            this.refreshModuleView();
            this.refreshTranscensionProgress();
            //this.refreshGoodsSelection();
        }
    }

    export class DesignerOtherTranscendence extends DesignerShip {

        setDesignerPanels() {                        
            //this.setPanels(true, true, true, true);     
            $('.noButton', DesignerContainer).css("display", "none");        
        }

        refreshAll() {
            this.refreshStatistics();
            this.refreshModuleView();
            this.refreshTranscensionProgress();
        }
    }

    //"static" method that returns the appropriate subclass
    export function construct(currentObject: ShipTemplateStatistics): DesignerBase{
        if (!(currentObject instanceof Ships.Ship)) {
            return new DesignerTemplate;
        }
        else {
            var ship = <Ships.Ship> currentObject;
            var ownShip = ship.owner === mainObject.user.id;

            if (ownShip) {
                if (ship.transcension != null)
                    return new DesignerOwnTranscendence;
                else
                    return new DesignerOwnShip;;
            }
            else {
            if (ship.transcension != null) 
                return new DesignerOtherTranscendence;
            else
                return new DesignerOtherShip;;
            }

        }

        //return new DesignerBase();
    }

    //needed so that during first loading of the file, the script is added to the script-array
    new Designer();
}
