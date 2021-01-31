//contains method to show Detail Dialogs for research, buildings, ship modules, ship hulls, goods ...
module DialogWindows {
    export var DetailsWindow: ElementGenerator.WindowManager = null;

    export var RearchDetailsResearch: BaseDataModule.Research = null;
    export var ColonyBuilding: ColonyModule.ColonyBuilding;
    export var Building: BaseDataModule.Building;

    export var YesButtonCallback ;
    export var NoButtonCallback ;
    
    export enum DialogWindowTypeEnum {
        Research,
        Building,
        ColonyBuilding,
        ShipModule,
        ShipHull,
        Goods,
        SurfaceField,
        PlanetType
    }

    export interface DialogWindowType {
        DialogWindowType: () => DialogWindowTypeEnum;
    }


    function UpdateDetails(objectToShow: DialogWindowType, callBack: any= null) {
        switch (objectToShow.DialogWindowType()) {
            case DialogWindowTypeEnum.Research:
                YesButtonCallback = (e) => {BaseDataModule.DoResearch(DialogWindows.RearchDetailsResearch, callBack);};   
                NoButtonCallback = (e) => { };
                RearchDetailsResearch = <any>objectToShow;
                UpdateResearchDetail(<any>objectToShow);
                break;
            case DialogWindowTypeEnum.Building:
                YesButtonCallback = (e) => { };
                NoButtonCallback = (e) => { };
                Building = <any>objectToShow;
                UpdateBuildingDetail(<any>objectToShow);
                break;
            case DialogWindowTypeEnum.ColonyBuilding:
                YesButtonCallback = (e) => { };
                NoButtonCallback = (e) => { DialogWindows.ColonyBuildingSelfDestruct();};
                Building = mainObject.buildings[(<ColonyModule.ColonyBuilding>objectToShow).buildingId];
                ColonyBuilding = <any>objectToShow;
                UpdateBuildingDetail(Building);
                UpdateColonyBuildingDetail(<any>objectToShow);
                break;
        }
    }

    export function ShowDetails(objectToShow: DialogWindowType, callBack: any = null) {

        if (DetailsWindow == null) {           
            DetailsWindow = ElementGenerator.Window(null, (e) => { DialogWindows.DetailsWindow = null; });
            $('.yesButton', DetailsWindow.element).click((e) => { DialogWindows.YesButtonCallback(e)});
            $('.noButton', DetailsWindow.element).click((e) => { DialogWindows.NoButtonCallback(e) } );
           
        } else {
            $('.relPopupHeader h2', DetailsWindow.element).remove();
            $('.relPopupBody', DetailsWindow.element).empty();            
        }

        UpdateDetails(objectToShow, callBack);

        if (DetailsWindow == null) {
            ElementGenerator.setLeftTopPosition(DetailsWindow.element);
        }
    }

    export function ShowPlayerResearchDetail(playerResearch: PlayerData.PlayerResearches, afterResearchCallback: () => void = null) {
        var Research: BaseDataModule.Research = BaseDataModule.researches[playerResearch.id];
        ShowDetails(Research, afterResearchCallback);
    }


    //creates a dialog screen for this research (like the one for buildings)
    //see showBuildingDetail
    /*
    export function ShowResearchDetail(research: BaseDataModule.Research, afterResearchCallback: () => void = null) {
        RearchDetailsResearch = research;
        if (DetailsWindow == null) {
            DetailsWindow = ElementGenerator.Window(null, (e) => { DialogWindows.DetailsWindow = null; });
            YesButtonCallback = (e) => {
                BaseDataModule.DoResearch(DialogWindows.RearchDetailsResearch, afterResearchCallback);
            }
            $('.yesButton', DetailsWindow.element).click(YesButtonCallback);

            UpdateResearchDetail(research);
            ElementGenerator.setLeftTopPosition(DetailsWindow.element);
        } else {
            $('.relPopupHeader h2', DetailsWindow.element).remove();
            $('.relPopupBody', DetailsWindow.element).empty();
            UpdateResearchDetail(research);
        }
        return;        
    }
    */

    //Update the ResearchDetailsWindow for another Research
    function ResearchClicked(research: BaseDataModule.Research, ResearchBox: JQuery) {
        ResearchBox.click((e) => { DialogWindows.ShowDetails(research); });
    }

    function UpdateResearchDetail(Research: BaseDataModule.Research) {

        //Left side:
        // Costs
        // Needed Prerequisites
        // Allows/Enables: Buildings , Modules, Ship hulls, Specials
        //Right side:
        //Image
        //Description

        //See Fiddle http://jsfiddle.net/kyr6o6pb/


        var DetailPanel = DetailsWindow.element;
        $('.relPopupPanel', DetailPanel).addClass("NoHover");


        var body = $('.relPopupBody', DetailPanel);

        var caption = $('<h2/>', { text: i18n.label(Research.label) });
        $(".relPopupHeader", DetailPanel).append(caption);

        //var detailsTable = $('<div class="ResearchDetailDialogBody"><div class="OuterRow"><div class="LeftSide"><div class="LeftSideTable"><div class="ResearchCostRow"><div class="ResearchCost">Kosten: 50</div></div><div class="ResearchRequires">Stuff 50</div><div class="ResearchEnables">Zeugs</div></div></div><div class="RightSide"><dix class="RightSideTable"><div class="ResearchImage">Bild 120</div><div class="ResearchTextRow"><div class="ResearchText">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</div></div></div></div></dix></div>');

        //Create Structure and region elements
        var DetailsTable = $('<div class="ResearchDetailDialogBody DetailDialog">');
        var LeftSide = $('<div class="LeftSide">');
        var ResearchCostRow = $('<div class="ResearchCostRow PageRegionBackground">');
        var ResearchCostRegion = $('<div class="ResearchCost">');
        var ResearchRequiresRow = $('<div class="ResearchRequiresRow PageRegionBackground">');
        var ResearchRequiresRegion = $('<div class="ResearchRequires">');
        var ResearchLeadsToRow = $('<div class="ResearchLeadsToRow PageRegionBackground">');
        var ResearchLeadsToRegion = $('<div class="ResearchLeadsTo">');
        var ResearchEnablesRow = $('<div class="ResearchEnablesRow PageRegionBackground">');
        var ResearchEnablesRegion = $('<div class="ResearchEnables">');

        var RightSide = $('<div class="RightSide">');
        var ResearchImageRow = $('<div class="ResearchImageRow PageRegionBackground">');
        var ResearchImageBG = $('<div class="ResearchImageBG DetailDialogBGBox">');
        var ResearchImageRegion = $('<div class="ResearchImage">');
        var ResearchTextRow = $('<div class="ResearchTextRow PageRegionBackground">');
        var ResearchTextBG = $('<div class="DetailDialogFullHeight">');
        var ResearchTextRegion = $('<div class="ResearchText DetailDialogFullHeight">');



        //Fill the various regions of this dialog with data
        //Costs
        ResearchCostRegion.text(i18n.label(927) + Research.cost); //Research Needed: 

        //Requires
        ResearchRequiresRegion.append($('<span>', { "text": i18n.label(928) })); //Requires
        ResearchRequiresRegion.append($('<br>'));
        var connections = BaseDataModule.getObjectRelationSources(Research);

        for (var j = 0; j < connections.length; j++) {
            if (connections[j].targetType != ObjectTypes.Research) continue;
            var PreResearch = <BaseDataModule.Research> BaseDataModule.getRelationObject(connections[j].sourceType, connections[j].sourceId);
            if (PreResearch.NeedsAdditionalSpecResearch()) continue;

            var ResearchBox = $('<div class="ResearchBox">');
            ResearchBox.css("background", "linear-gradient(to right, " + PreResearch.BackgroundColorLeftSide() + " ," + PreResearch.BackgroundColorRightSide() + ")");
            ResearchBox.text(i18n.label(PreResearch.label));
            ResearchClicked(PreResearch, ResearchBox);
            ResearchRequiresRegion.append(ResearchBox);
        }

        //Leads to      
        ResearchLeadsToRegion.append($('<span>', { "text": i18n.label(929) })); //Leads to
        ResearchLeadsToRegion.append($('<br>'));
        connections = BaseDataModule.getObjectRelationTargets(Research);

        for (var j = 0; j < connections.length; j++) {
            if (connections[j].targetType != ObjectTypes.Research) continue;
            var FollowingResearch = <BaseDataModule.Research> BaseDataModule.getRelationObject(connections[j].targetType, connections[j].targetId);
            if (FollowingResearch.NeedsAdditionalSpecResearch()) continue;

            var ResearchBox = $('<div class="ResearchBox">');
            ResearchBox.css("background", "linear-gradient(to right, " + FollowingResearch.BackgroundColorLeftSide() + " ," + FollowingResearch.BackgroundColorRightSide() + ")");
            ResearchBox.text(i18n.label(FollowingResearch.label));
            ResearchClicked(FollowingResearch, ResearchBox);
            ResearchLeadsToRegion.append(ResearchBox);
        }

        //Enables
        ResearchEnablesRegion.append($('<span>', { "text": i18n.label(930) })); //Enables
        ResearchEnablesRegion.append($('<br>'));

        connections = BaseDataModule.getObjectRelationTargets(Research);
        for (var j = 0; j < connections.length; j++) {

            //use only buildings, shipHulls and shipModules
            if (connections[j].targetType == ObjectTypes.Research || connections[j].targetType == ObjectTypes.Quest || connections[j].targetType == ObjectTypes.Good) continue;

            ResearchEnablesRegion.append(BaseDataModule.getRelationObjectIcon(connections[j].targetType, connections[j].targetId));
        }

        if (BaseDataModule.researchGainExists(Research.id)) {

            var researchGain = BaseDataModule.getResearchGain(Research.id);
            /*
            //An Icon
            var imagePath = mainObject.imageObjects[researchGain.objectId].texture.src;
            var RelationObjectIcon = $("<div/>", { "class": "RelationObjectIcon" });
            var RelationObjectImage = $("<img/>", { "src": imagePath, "alt": "ResearchGain", "title": "test" });
            RelationObjectImage.css({ "width": "30px", "height": "30px" });
            RelationObjectIcon.append(RelationObjectImage);
            RelationObjectIcon.tooltip(researchGain.createToolTip());
            ResearchEnablesRegion.append(RelationObjectIcon);
            */
            ResearchEnablesRegion.append(researchGain.createModifierDiv());

        }

        //Right Side: 
        //Image
        //ResearchImageRegion.text("Bild 120");

        //Description
        //ResearchTextRegion.text("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.At vero eos et accusam et justo duo dolores et ea rebum.Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.At vero eos et accusam et justo duo dolores et ea rebum.Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.");
        ResearchTextRegion.text(i18n.label(Research.labelDescription));


        //put everything together:
        DetailsTable.append(LeftSide);

        LeftSide.append(ResearchCostRow);
        ResearchCostRow.append(ResearchCostRegion);

        LeftSide.append(ResearchRequiresRow);
        ResearchRequiresRow.append(ResearchRequiresRegion);

        LeftSide.append(ResearchLeadsToRow);
        ResearchLeadsToRow.append(ResearchLeadsToRegion);

        LeftSide.append(ResearchEnablesRow);
        ResearchEnablesRow.append(ResearchEnablesRegion);

        DetailsTable.append(RightSide);
        RightSide.append(ResearchImageRow);
        ResearchImageRow.append(ResearchImageBG);
        ResearchImageBG.append(ResearchImageRegion);
        RightSide.append(ResearchTextRow);
        ResearchTextRow.append(ResearchTextBG);
        ResearchTextBG.append(ResearchTextRegion);

        body.append(DetailsTable);


        if (!PlayerData.PlayerResearchFind(Research.id).isCompleted && PlayerData.PlayerResearchFind(Research.id).researchable) {
            var PlayerResearch = PlayerData.PlayerResearchFind(Research.id);
            $('.yesButton span', DetailPanel).text(i18n.label(931)); //Research Now
            $('.yesButton', DetailPanel).css("display", "inline-block");
        } else {
            $('.yesButton', DetailPanel).css("display", "none");
        }


        DetailPanel.appendTo("body"); //attach to the <body> element
        //$('.yesButton', DetailPanel).click((e: JQueryEventObject) => { DetailPanel.remove(); });

    }

    function UpdateBuildingDetail(building: BaseDataModule.Building) {

        var detailPanel = DetailsWindow.element;
        $('.relPopupPanel', detailPanel).addClass("NoHover");


        var body = $('.relPopupBody', detailPanel);

        var caption = $('<h2/>', { text: i18n.label(building.label) });
        $(".relPopupHeader", detailPanel).append(caption);


        var buildCostsTD = $('<td/>', { "class": "goodsDisplay goodsOverflow" });
        var buildProduction = $('<td/>', { "class": "goodsDisplay goodsOverflow" });
        var availableFields = $('<td/>', { "class": "goodsDisplay goodsOverflow" });

        buildCostsTD.append($('<h3/>', { text: i18n.label(293) })); //Baukosten
        buildProduction.append($('<h3/>', { text: i18n.label(294) })); //"Produktion/Verbrauch"
        availableFields.append($('<h3/>', { text: i18n.label(295) }));  //"Baubar auf"

        //Bau-Kosten
        for (var goodsIndex = 0; goodsIndex < building.costs.length; goodsIndex++) {
            if (building.costs[goodsIndex] == null) continue;

            var borderColor = null;
            if (mainObject.currentColony.goods[goodsIndex] == null || building.costs[goodsIndex] > mainObject.currentColony.goods[goodsIndex])
                borderColor = "borderColorRed";

            var goodsDiv = mainInterface.createGoodsDiv(goodsIndex, building.costs[goodsIndex], borderColor);
            goodsDiv.addClass("floatLeft");
            goodsDiv.css("margin", "2px");
            buildCostsTD.append(goodsDiv);
        }

        //Produktion + Verbrauch
        for (var goodsIndex = 0; goodsIndex < building.production.length; goodsIndex++) {
            if (building.production[goodsIndex] == null) continue;
            if (goodsIndex == 8) continue;

            if (building.production[goodsIndex] < 0 &&
                (mainObject.currentColony.goods[goodsIndex] == null
                || Math.abs(building.production[goodsIndex]) > mainObject.currentColony.goods[goodsIndex])
                )
                borderColor = "borderColorRed";
            else
                borderColor = null;

            var goodsDiv2 = mainInterface.createGoodsDiv(goodsIndex, building.production[goodsIndex], borderColor);
            goodsDiv2.addClass("floatLeft");
            goodsDiv2.css("margin", "2px");
            buildProduction.append(goodsDiv2);
        }
        //Produktion 2        
        buildProduction.append(building.createModifierDiv());


        //Baubar auf
        for (var tileIndex = 0; tileIndex < mainObject.surfaceTiles.length; tileIndex++) {
            if (mainObject.surfaceTiles[tileIndex] == null) continue;
            if (mainObject.surfaceTileBuildings[tileIndex] == null) continue;
            if (mainObject.surfaceTileBuildings[tileIndex][building.id] == null) continue;

            var goodsDiv2 = DrawInterface.createSurfaceFieldDiv(mainObject.surfaceTiles[tileIndex]);
            goodsDiv2.addClass("floatLeft");
            goodsDiv2.css("margin", "2px");
            availableFields.append(goodsDiv2);
        }

        var detailsTable = $("<table/>", {"class":"ColonyDetailsTable"});
        detailsTable.css("width", "100%");
        detailsTable.append($("<tr/>").append(buildCostsTD).append(buildProduction).append(availableFields));

        //Population and Energy needs:       
        var statistics = $("<tr/>");
        var statisticsData = $('<td colspan="3" />', { "class": "goodsDisplay" });
        statisticsData.append($('<h3/>', { text: i18n.label(140) })); //"Statistik"
        var statisticsTable = $('<table/>');
        var housingText = building.housing.toString();
        var poptext = building.production[8] && building.production[8].toString() || '0';
        statisticsTable.append($("<tr/>").append($("<td/>", { text: i18n.label(410) })).append($("<td/>", { text: housingText })));  //Bevölkerung
        statisticsTable.append($("<tr/>").append($("<td/>", { text: i18n.label(156) })).append($("<td/>", { text: poptext })));  //Bevölkerung
        statisticsTable.append($("<tr/>").append($("<td/>", { text: i18n.label(297) })).append($("<td/>", { text: building.structure.toString() })));       //Struktur  

        statisticsData.append(statisticsTable);
        statistics.append(statisticsData);

        //populationData.append($("<td/>", { text: "Bevölkerung" })).append($("<td/>", { text: (-building.production[8]).toString() }));
        detailsTable.append(statistics);
        

        body.append(detailsTable);
        //body.append($("<table/>").append($("<tr/>").append(buildCostsTD).append(buildProduction).append(availableFields)));


        $('.yesButton span', detailPanel).text('OK');
        detailPanel.appendTo("body"); //attach to the <body> element
        //$('.yesButton', detailPanel).click((e: JQueryEventObject) => { detailPanel.remove(); });

        //ElementGenerator.setLeftTopPosition(detailPanel);
    }

    export function RazeBuildingDone(e) {
        if (e) {
            let currentColony = mainObject.coloniesById[ColonyBuilding.colonyId];

            ColonyBuilding.deleteBuilding();

            currentColony.calcColonyRessources();
            currentColony.refreshMainScreenStatistics();
            mainInterface.refreshQuickInfoGoods();
            BaseDataModule.buildingList();
            mainInterface.drawAll();
        }

        DetailsWindow.remove();
        DetailsWindow = null;
    }

    export function ColonyBuildingSelfDestruct() {
        var currentColony = mainObject.coloniesById[ColonyBuilding.colonyId];

        $.connection.spaceHub.invoke("RazeBuilding", ColonyBuilding.colonyId, ColonyBuilding.id).done(e => {
            DialogWindows.RazeBuildingDone(e);
        });
    
    }

    function UpdateColonyBuildingDetail(colonyBuilding: ColonyModule.ColonyBuilding) {

        var detailPanel = DetailsWindow.element;
        $('.relPopupPanel', detailPanel).addClass("NoHover");

        var building = mainObject.buildings[colonyBuilding.buildingId];

        var body = $('.relPopupBody', detailPanel);
       
        //show additional controls if data was requested from a specific building on the planet surface
        if (colonyBuilding != null) {
            var currentColony = mainObject.coloniesById[colonyBuilding.colonyId];

            var buildingData = $('<td colspan="3" />', { "class": "goodsDisplay" });
            buildingData.append($('<h3/>', { text: i18n.label(193) })); //Aktion

            var actionTable = $('<table/>');

            var activeCheckBox = $("<input/>", { type: "checkbox" });
            activeCheckBox.prop('checked', colonyBuilding.isActive);
            actionTable.append($("<tr/>").append($("<td/>", { text: i18n.label(298) })).append($("<td/>").append(activeCheckBox)));
            activeCheckBox.click((e: JQueryEventObject) => {

                $.ajax("Server/Buildings.aspx", {
                    type: "GET",
                    async: true,
                    data: {
                        "action": "activate",
                        "buildingId": colonyBuilding.id.toString()
                    }
                });

                colonyBuilding.isActive = !colonyBuilding.isActive;
                //mainObject.colonies[colonyBuilding.colonyId].calcColonyRessources();    

                currentColony.calcColonyRessources();
                currentColony.refreshMainScreenStatistics();

                mainInterface.drawAll();
                mainInterface.refreshQuickInfoGoods();

            });

            buildingData.append(actionTable);

            var detailsTable = $("table.ColonyDetailsTable", detailPanel );
            detailsTable.append($("<tr/>").append(buildingData));

            //var selfDestruct = $('<button/>', { text: "Abreißen", style: "font-size: 1.1em;font-weight: bold;padding: 5px;margin: 8px;" });
            /*
            var createTradeButton = $('.noButton', this.popup); // windowHandle.    $('<button/>', { text: i18n.label(304) });
            createTradeButton[0].style.display = 'inline-block';
            createTradeButton.text(i18n.label(304));
            //createTradeButton.css("position", "absolute").css("bottom", "5px").css("left", "680px");
            //tradeDiv2.append(createTradeButton);
            //createTradeButton.button();

            createTradeButton.click(function () {
                createTradeOffer();
                createTradeButton.removeClass("ui-state-focus ui-state-hover");
            });
            */
            //Abreißen
            $('.noButton', detailPanel)[0].style.display = 'none';

            if (building.isScrapable) {
                //var selfDestruct = $('<button/>', { text: i18n.label(163), style: "font-size: 1.1em;font-weight: bold;padding: 5px;margin: 8px;" });

                var selfDestruct = $('.noButton', detailPanel);
                $('span', selfDestruct).text(i18n.label(163));
                selfDestruct.css("display", "inline-block");
            } else {
                var selfDestruct = $('.noButton', detailPanel);
                selfDestruct.css("display", "none");
            }

        }       
    }

    export function showBuildingDetail(building: BaseDataModule.Building, colonyBuilding?: ColonyModule.ColonyBuilding) {
       
        var detailPanel = ElementGenerator.Window(null).element;
        $('.relPopupPanel', detailPanel).addClass("NoHover");


        var body = $('.relPopupBody', detailPanel);

        var caption = $('<h2/>', { text: i18n.label(building.label) });
        $(".relPopupHeader", detailPanel).append(caption);


        var buildCostsTD = $('<td/>', { "class": "goodsDisplay" });
        var buildProduction = $('<td/>', { "class": "goodsDisplay" });
        var availableFields = $('<td/>', { "class": "goodsDisplay" });

        buildCostsTD.append($('<h3/>', { text: i18n.label(293) })); //Baukosten
        buildProduction.append($('<h3/>', { text: i18n.label(294) })); //"Produktion/Verbrauch"
        availableFields.append($('<h3/>', { text: i18n.label(295) }));  //"Baubar auf"

        //Bau-Kosten
        for (var goodsIndex = 0; goodsIndex < building.costs.length; goodsIndex++) {
            if (building.costs[goodsIndex] == null) continue;

            var borderColor = null;
            if (mainObject.currentColony.goods[goodsIndex] == null || building.costs[goodsIndex] > mainObject.currentColony.goods[goodsIndex])
                borderColor = "borderColorRed";

            var goodsDiv = mainInterface.createGoodsDiv(goodsIndex, building.costs[goodsIndex], borderColor);
            goodsDiv.addClass("floatLeft");
            goodsDiv.css("margin", "2px");
            buildCostsTD.append(goodsDiv);
        }

        //Produktion + Verbrauch
        for (var goodsIndex = 0; goodsIndex < building.production.length; goodsIndex++) {
            if (building.production[goodsIndex] == null) continue;
            if (goodsIndex == 8) continue;

            if (building.production[goodsIndex] < 0 &&
                (mainObject.currentColony.goods[goodsIndex] == null
                || Math.abs(building.production[goodsIndex]) > mainObject.currentColony.goods[goodsIndex])
                )
                borderColor = "borderColorRed";
            else
                borderColor = null;

            var goodsDiv2 = mainInterface.createGoodsDiv(goodsIndex, building.production[goodsIndex], borderColor);
            goodsDiv2.addClass("floatLeft");
            goodsDiv2.css("margin", "2px");
            buildProduction.append(goodsDiv2);
        }
        //Produktion 2        
        buildProduction.append(building.createModifierDiv());


        //Baubar auf
        for (var tileIndex = 0; tileIndex < mainObject.surfaceTiles.length; tileIndex++) {
            if (mainObject.surfaceTiles[tileIndex] == null) continue;
            if (mainObject.surfaceTileBuildings[tileIndex] == null) continue;
            if (mainObject.surfaceTileBuildings[tileIndex][building.id] == null) continue;

            var goodsDiv2 = DrawInterface.createSurfaceFieldDiv(mainObject.surfaceTiles[tileIndex]);
            goodsDiv2.addClass("floatLeft");
            goodsDiv2.css("margin", "2px");
            availableFields.append(goodsDiv2);
        }

        var detailsTable = $("<table/>");
        detailsTable.css("width", "100%");
        detailsTable.append($("<tr/>").append(buildCostsTD).append(buildProduction).append(availableFields));

        //Population and Energy needs:       
        var statistics = $("<tr/>");
        var statisticsData = $('<td colspan="3" />', { "class": "goodsDisplay" });
        statisticsData.append($('<h3/>', { text: i18n.label(140) })); //"Statistik"
        var statisticsTable = $('<table/>');
        var housingText = building.housing.toString();
        var poptext = building.production[8] && building.production[8].toString() || '0';
        statisticsTable.append($("<tr/>").append($("<td/>", { text: i18n.label(410) })).append($("<td/>", { text: housingText })));  //Bevölkerung
        statisticsTable.append($("<tr/>").append($("<td/>", { text: i18n.label(156) })).append($("<td/>", { text: poptext })));  //Bevölkerung
        statisticsTable.append($("<tr/>").append($("<td/>", { text: i18n.label(297) })).append($("<td/>", { text: building.structure.toString() })));       //Struktur  

        statisticsData.append(statisticsTable);
        statistics.append(statisticsData);

        //populationData.append($("<td/>", { text: "Bevölkerung" })).append($("<td/>", { text: (-building.production[8]).toString() }));
        detailsTable.append(statistics);


        //show additional controls if data was requested from a specific building on the planet surface
        if (colonyBuilding != null) {
            var currentColony = mainObject.coloniesById[colonyBuilding.colonyId];

            var buildingData = $('<td colspan="3" />', { "class": "goodsDisplay" });
            buildingData.append($('<h3/>', { text: i18n.label(193) })); //Aktion

            var actionTable = $('<table/>');

            var activeCheckBox = $("<input/>", { type: "checkbox" });
            activeCheckBox.prop('checked', colonyBuilding.isActive);
            actionTable.append($("<tr/>").append($("<td/>", { text: i18n.label(298) })).append($("<td/>").append(activeCheckBox)));
            activeCheckBox.click((e: JQueryEventObject) => {

                $.ajax("Server/Buildings.aspx", {
                    type: "GET",
                    async: true,
                    data: {
                        "action": "activate",
                        "buildingId": colonyBuilding.id.toString()
                    }
                });

                colonyBuilding.isActive = !colonyBuilding.isActive;
                //mainObject.colonies[colonyBuilding.colonyId].calcColonyRessources();    

                currentColony.calcColonyRessources();
                currentColony.refreshMainScreenStatistics();

                mainInterface.drawAll();
                mainInterface.refreshQuickInfoGoods();

            });

            buildingData.append(actionTable);

            detailsTable.append($("<tr/>").append(buildingData));

            //var selfDestruct = $('<button/>', { text: "Abreißen", style: "font-size: 1.1em;font-weight: bold;padding: 5px;margin: 8px;" });
            /*
            var createTradeButton = $('.noButton', this.popup); // windowHandle.    $('<button/>', { text: i18n.label(304) });
            createTradeButton[0].style.display = 'inline-block';
            createTradeButton.text(i18n.label(304));
            //createTradeButton.css("position", "absolute").css("bottom", "5px").css("left", "680px");
            //tradeDiv2.append(createTradeButton);
            //createTradeButton.button();

            createTradeButton.click(function () {
                createTradeOffer();
                createTradeButton.removeClass("ui-state-focus ui-state-hover");
            });
            */
            //Abreißen
            $('.noButton', detailPanel)[0].style.display = 'none';

            if (building.isScrapable) {
                //var selfDestruct = $('<button/>', { text: i18n.label(163), style: "font-size: 1.1em;font-weight: bold;padding: 5px;margin: 8px;" });

                var selfDestruct = $('.noButton', detailPanel);
                $('span', selfDestruct).text(i18n.label(163));
                selfDestruct.css("display", "inline-block");

                selfDestruct.click((e: JQueryEventObject) => {

                    $.ajax("Server/Buildings.aspx", {
                        type: "GET",
                        async: true,
                        data: {
                            "action": "raze",
                            "buildingId": colonyBuilding.id.toString(),
                            "colonyId": colonyBuilding.colonyId
                        }
                    });

                    var colonyId = colonyBuilding.colonyId;
                    colonyBuilding.deleteBuilding();

                    //mainObject.colonies[colonyId].calcColonyRessources();     
                    //var currentColony = mainObject.colonies[colonyBuilding.colonyId];
                    currentColony.calcColonyRessources();
                    currentColony.refreshMainScreenStatistics();
                    mainInterface.refreshQuickInfoGoods();
                    BaseDataModule.buildingList();
                    mainInterface.drawAll();
                    detailPanel.remove();
                });
            }

        }

        body.append(detailsTable);
        //body.append($("<table/>").append($("<tr/>").append(buildCostsTD).append(buildProduction).append(availableFields)));


        $('.yesButton span', detailPanel).text('OK');
        detailPanel.appendTo("body"); //attach to the <body> element
        $('.yesButton', detailPanel).click((e: JQueryEventObject) => { detailPanel.remove(); });

        ElementGenerator.setLeftTopPosition(detailPanel);
    }

} 