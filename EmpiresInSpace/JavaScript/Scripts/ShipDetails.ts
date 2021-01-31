/// <reference path="../References.ts" />

module Ships {
    export var detailsContainer: JQuery;
    var shipStatistics: JQuery;
    var shipModuleView: JQuery;
    var shipCosts: JQuery;
    var selectedShip: Ships.Ship;


    class shipDetailPanel extends Scripts.Script {

        constructor() {
            //call super, set scriptType to 4(Details) and Id to 1 (Ship-Details)
            super(4, 1);            
            Scripts.scriptsAdmin.scripts.push(this);
            this.run();
        }

        run() {
            showDetailPanel();
        }
    }

    function showDetailPanel() {
        selectedShip = mainObject.currentShip;
        var _DesignerContainer = ElementGenerator.createPopup();
      
        ElementGenerator.adjustPopupZIndex(_DesignerContainer, 15000);
        ElementGenerator.makeBig(_DesignerContainer);
        detailsContainer = _DesignerContainer;

        var panelHeader = $('.relPopupHeader', detailsContainer);
        var caption = $('<h2/>', { text: i18n.label(205), style: "float:left" });
        panelHeader.append(caption);

        var panelBody = $('.relPopupBody', detailsContainer);
        panelBody.removeClass("trHighlight").addClass("tdHighlight");
                    
        //template statistics, name , hulltype (changeable)
        shipStatistics = $('<div/>', { "class": "shipDetailsStatisticsDiv" });
        panelBody.append(shipStatistics);

        //template module view
        shipModuleView = $('<div/>', { "class": "shipDetailsModuleViewDiv" });
        panelBody.append(shipModuleView);

        //template overall costs
        shipCosts = $('<div/>', { "class": "shipDetailsCostsDiv" });
        panelBody.append(shipCosts);

        $('.noButton', detailsContainer)[0].style.display = 'none';
        //$('.noButton', detailsContainer).text('Selbstzerstörung');
        $('.yesButton span', detailsContainer).text(i18n.label(206));  // Selbstzerstörung
        //spaceportContainer.tooltip();
        detailsContainer.appendTo("body"); //attach to the <body> element

        //spaceportContainer.appendTo($("#generatedPanel"));
        //checkSaveState(selectTemplate,e)
        //$('.noButton', detailsContainer).click((e: JQueryEventObject) => { });
        $('.yesButton', detailsContainer).click((e: JQueryEventObject) => { Ships.detailsContainer.remove(); });

        //var but = $('<div/>', { "class": 'popupBody panelBody trLightGrey trHighlight' });     //content
        var selfDestruct : JQuery;
        if (selectedShip.owner === mainObject.user.id) {
            selfDestruct = $('<button/>', { text: i18n.label(209) , style: "font-size: 1.1em;font-weight: bold;padding: 5px;margin: 8px;" });
            $('.relPopupFooter').append(selfDestruct);
       
            selfDestruct.click(function () {                                               
                $.ajax("Server/Ships.aspx", {
                    type: "GET",
                    async: true,
                    data: {
                        "action": "selfDestruct",
                        "shipId": selectedShip.id.toString(),
                        "newName": (<HTMLInputElement>this).value
                    }
                });
                selectedShip.deleteShip();
                
                mainObject.deselectShip();
                mainInterface.drawAll();
                Ships.detailsContainer.remove();                
            });            
        }
        
        refreshStatistics();
        refreshModuleView();
        refreshCosts();
    }



    function refreshStatistics() {
        shipStatistics.empty();
      
        //create 4 divs for the different Groups:
        var statBase = $("<div/>", { "class": "shipDesignerStatisticDiv" });
        var statDrive = $("<div/>", { "class": "shipDesignerStatisticDiv" });
        var statWar = $("<div/>", { "class": "shipDesignerStatisticDiv" });
        var statSpecial = $("<div/>", { "class": "shipDesignerStatisticDiv" });

        //statBase has name + crew + energy:
        var heading = $('<span/>', { text: selectedShip.name + " " });
        heading.css("font-weight", "bold");
        var nameInput = $("<input/>", { type: "text", value: selectedShip.name });
        nameInput.css("width", "12em");

        Helpers.Log("x");    

        statBase.append(nameInput);
        //statBase.append(heading);
        //stemplateStatistics.append(nameInput);
        nameInput.change(function () {
            selectedShip.name = (<HTMLInputElement>this).value;
            selectedShip.createTagFreeName();       
            Ships.UserInterface.refreshMainScreenStatistics(selectedShip);
            $.ajax("Server/Ships.aspx", {
                type: "GET",
                async: true,
                data: {
                    "action": "renameShip",
                    "shipId": selectedShip.id.toString(),
                    "newName": (<HTMLInputElement>this).value
                }
            });
        });

        var baseDiv = $("<div/>", { "class": "border" });
        baseDiv.css("border-width", "medium");
        var baseTable = $("<table/>");

        //crew
        var baseTrCrew = $("<tr/>");
        var baseTdCrewLable = $("<td/>", { text: i18n.label(210) });    //crew
        baseTdCrewLable.css("width", "5em");
        var baseTdCrewValue = $("<td/>", { text: selectedShip.crew  });
        baseTdCrewValue.css("width", "6em");        

        baseTrCrew.append(baseTdCrewLable).append(baseTdCrewValue);
        baseTable.append(baseTrCrew);


        //energy
        var baseTrEnergy = $("<tr/>");
        var baseTdEnergyLable = $("<td/>", { text: i18n.label(211) }); //Energy
        baseTdEnergyLable.css("width", "5em");
        //var baseTdEnergyValue = $("<td/>", { text: currentTemplate.energy });
        var baseTdEnergyValue = $("<td/>", { text: selectedShip.energy });
        baseTdEnergyValue.css("width", "3em");
       
        baseTrEnergy.append(baseTdEnergyLable).append(baseTdEnergyValue);
        baseTable.append(baseTrEnergy);

        baseDiv.append(baseTable);
        statBase.append(baseDiv);


        //statDrive: all Engines
        var engineTable = $("<table/>");
        engineTable.append((
            $("<tr/>").append($("<td/>", { text: i18n.label(212) })).append($("<td/>", { text: selectedShip.systemMovesPerTurn })) //System drive
            ));
        engineTable.append((
            $("<tr/>").append($("<td/>", { text: i18n.label(213) })).append($("<td/>", { text: selectedShip.galaxyMovesPerTurn })) //Star drive
            ));
        engineTable.append((
            $("<tr/>").append($("<td/>", { text: i18n.label(214) })).append($("<td/>", { text: selectedShip.systemMovesMax })) //System battery
            ));
        engineTable.append((
            $("<tr/>").append($("<td/>", { text: i18n.label(215) })).append($("<td/>", { text: selectedShip.galaxyMovesMax })) //Star battery
            ));
        statDrive.append(engineTable);
      

        //statWar : attack, defense, HP, SHield...
        var warTable = $("<table/>");
        warTable.append((
            $("<tr/>").append($("<td/>", { text: i18n.label(216) })).append($("<td/>", { text: selectedShip.attack }))  //Angriff
            ));
        warTable.append((
            $("<tr/>").append($("<td/>", { text: i18n.label(217) })).append($("<td/>", { text: selectedShip.defense })) //Verteidigung
            ));
        warTable.append((
            $("<tr/>").append($("<td/>", { text: i18n.label(218) })).append($("<td/>", { text: selectedShip.hitpoints })) //Trefferpunkte
            ));
        warTable.append((
            $("<tr/>").append($("<td/>", { text: i18n.label(219) })).append($("<td/>", { text: selectedShip.damagereduction })) //Schilde
            ));
        statWar.append(warTable);

        Helpers.Log("selectedShip.damagereduction" + selectedShip.damagereduction);

        //statSpecial contains scanner + specials like colonizer...
        var specialTable = $("<table/>");
        specialTable.append((
            $("<tr/>").append($("<td/>", { text: i18n.label(220) })).append($("<td/>", { text: selectedShip.cargoroom })) //Lagerraum
            ));
        specialTable.append((
            $("<tr/>").append($("<td/>", { text: i18n.label(221) })).append($("<td/>", { text: selectedShip.fuelroom })) //Tank
            ));

        specialTable.append((
            $("<tr/>").append($("<td/>", { text: i18n.label(222) })).append($("<td/>", { text: selectedShip.scanRange })) //Scanner
            ));


        var selectorHull = $('<select/>');

        for (var i = 0; i < BaseDataModule.shipHulls.length; i++) {
            if (BaseDataModule.shipHulls[i] === undefined || !PlayerData.hullsAvailable(i)) continue;
            if (selectedShip.shipHullId != i) continue;
            var option = $('<option/>', { val: i, text: BaseDataModule.shipHulls[i].typeName });
            if (selectedShip.shipHullId == i) option.attr('selected', 'selected');
            selectorHull.append(option);
        }

        specialTable.append(($("<tr/>").append($("<td/>", {
            text: i18n.label(223)
        })).append($("<td/>").append(selectorHull))));


        statSpecial.append(specialTable);
       


        shipStatistics.append(statBase);
        shipStatistics.append(statDrive);
        shipStatistics.append(statWar);
        shipStatistics.append(statSpecial);

    }

   

    function refreshModuleView() {
        shipModuleView.empty();
        //var currentTemplate : ShipTemplateModule.ShipTemplate;
        //currentTemplate = ShipTemplateModule.getTemplate(selectedShip.templateId);
        //draw a table showing all possible positions to place modules
        var hull = BaseDataModule.shipHulls[selectedShip.shipHullId];
        //var imageSource = "images/" + hull.templateImageUrl;
        var imageSource = mainObject.imageObjects[BaseDataModule.shipHullsImages[selectedShip.shipHullsImage].templateImageId].texture.src;
        var width = mainObject.imageObjects[BaseDataModule.shipHullsImages[selectedShip.shipHullsImage].templateImageId].texture.width;
        var height = mainObject.imageObjects[BaseDataModule.shipHullsImages[selectedShip.shipHullsImage].templateImageId].texture.height;
        var modulesDiv = $("<div/>", { style: "background-image:url(" + imageSource + ");width:" + width + "px;height:" + height+"px;background-repeat:no-repeat;" });
        //{ style: "background-image:url(images/YellowSun.png);width:34px;height:30px;background-repeat:no-repeat;background-position: 4px 5px" } );

        

        modulesDiv.css("background-image", imageSource);
        //modulesDiv.append($("<img/>", { src: imageSource }));
        for (var i = 0; i < hull.modulesCount; i++) {
            var moduleCol = (i * 40) + 2;
            moduleCol += BaseDataModule.shipHullsImages[selectedShip.shipHullsImage].templateModulesXoffset;
            for (var j = 0; j < hull.modulesCount; j++) {
                if (hull.modulePositionExists(i, j)) {
                    var moduleRow = (j * 40) + 2;
                    moduleRow += BaseDataModule.shipHullsImages[selectedShip.shipHullsImage].templateModulesYoffset;
                    var moduleDiv = $("<div/>", { "class": "shipDesignerModulePlace shipDesignerModuleSize", style: "left:" + moduleCol + "px;top:" + moduleRow + "px;" });
                    moduleDiv.css('background-color', 'white');
                    moduleDiv.data("modulePosition", hull.getModuleByPosition(i, j));
                   
                    Helpers.Log("hull.modulePositionExists(...)");
                    if (selectedShip.modulePositionExists(i, j)) {
                        
                        Helpers.Log("Ships.insertModuleDiv(...)");
                        Ships.insertModuleDiv(moduleDiv, selectedShip.getModuleByPosition(i, j).shipmodule, selectedShip.getModuleByPosition(i, j));
                    }

                    modulesDiv.append(moduleDiv);

                    modulesDiv.addClass("modulePosition");
                }
            }
        }
        shipModuleView.append(modulesDiv);
    }

    export function insertModuleDiv(parent: JQuery, shipModule: BaseDataModule.ShipModule, targetPosition: Ships.ModulePosition) {
        parent.empty();

        var goodId = shipModule.goodsId;
        var goodsDiv = $("<div/>", { title: mainObject.goods[goodId].name });
        var imageSource = mainObject.imageObjects[mainObject.goods[goodId].goodsObjectId].texture.src;
        //goodsDiv.append($("<img/>", { src: imageSource, width: "30px", height: "30px", alt: "BLAH", "class": "ui-corner-all" }));
        goodsDiv.append($("<img/>", { src: imageSource, "class": "shipDesignerModuleSize" }));
        
        goodsDiv.data("moduletype", shipModule);
        goodsDiv.data("modulePosition", targetPosition);

        parent.append(goodsDiv);
    }

    

    function refreshCosts() {
        /*
        var currentTemplate: ShipTemplateModule.ShipTemplate;
        currentTemplate = ShipTemplateModule.getTemplate(selectedShip.templateId);

        var costsTable = $("<table/>");
        var currentGoodsIndex = 0; // needed as index in the for-loop   
        // a bit complicated, because we do not know in advance how many lines there will be in the table
        var currentGoodsFound = 0; //just needed to create a new line after 
        var costs: number[] = currentTemplate.costs;
        while (true) {
            if (currentGoodsIndex == costs.length) break;


            var goodsTr = $("<tr/>");
            for (; currentGoodsIndex < costs.length; currentGoodsIndex++) {
                if (costs[currentGoodsIndex] == null) continue;


                if (mainObject.currentColony != null) {
                    goodsTr.append(mainInterface.createGoodsTd(currentGoodsIndex, costs[currentGoodsIndex]));
                }
                else {
                    goodsTr.append(mainInterface.createGoodsTd(currentGoodsIndex, costs[currentGoodsIndex]));
                    //$(".goodsAmount", goodsTr).css("display", "none");
                }

                currentGoodsFound++;
                if (currentGoodsFound % 8 == 0) { currentGoodsIndex++; break; } //jump into the while
            }
            costsTable.append(goodsTr);
        }
        shipCosts.append(costsTable);
        */
    }


    new shipDetailPanel();
}