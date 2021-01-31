module BuildModulesForm {

    export var BuildModulesHelper: BuildModules; //helper class for goods trade creation 
    export var DesignerContainer: JQuery;
    export var windowHandle: ElementGenerator.WindowManager;
    var popup: JQuery;
    var body: JQuery;
    var tradeDiv2: JQuery;

    export function runTemplate() {
        mainObject.keymap.isActive = false;


        $('#loader')[0].style.display = 'none';
        DesignerContainer = windowHandle.element;

        //Add Caption
        var panelHeader = $('.relPopupHeader', DesignerContainer);
        var caption = $('<h2/>', { text: i18n.label(1025) }); //Build Ship Modules
        panelHeader.append(caption);

        //Panel Layout
        var panelBody = $('.relPopupBody', DesignerContainer);
        panelBody.removeClass("trHighlight").addClass("tdHighlight");
        panelBody.css("padding-top", "6px");
        panelBody.css("font-size", "inherit");

        //The div containing all tabs pages
        var tabDiv = $("<div id='tabs'/>");
        tabDiv.css("border", "none");
        tabDiv.css("text-align", "left");

        //The ul with the tab-page-selectors
        var tabUl = $("<ul/>");
        tabUl.css("display", "table");
        tabUl.css("clear", "both");

        //2. Tab: Offer wares (page)
        tradeDiv2 = $("<div id='tab1'/>");
        PopulateCreateTradeForm(tradeDiv2);


        tabDiv.append(tradeDiv2);

        panelBody.append(tabDiv);


        BuildModulesForm.BuildModulesHelper.showCreateTrade();

    }



    export function OpenTradeForm() {

        windowHandle = ElementGenerator.MainPanel();
        popup = windowHandle.element;
        body = $('.relPopupBody', popup);

        BuildModulesForm.runTemplate();
    }


    // Create the various div elements 
    export function PopulateCreateTradeForm(tradeDiv2: JQuery) {
        //Selectors for the Offer wares page
        
        //ship name, cargo bar and cargo of selected ship
        var ColonyGoods = $('<div/>', { "class": "LeftPanelBox BorderBox" });
        var ColonyGoodsText = $('<div/>', { "class": "TradeTradeAreaOfferText", "text": i18n.label(1024) }); //Colony Goods
        var ColonyGoodsArea = $('<div/>', { "class": "TradeSelectedShip" });
        ColonyGoods.append(ColonyGoodsText).append(ColonyGoodsArea);

        //trade area buttons with transfer amount labels, one row with offer, one row with demand
        var TradeTradeArea = $('<div/>', { "class": "TradeTradeArea BorderBox LeftPanelBox" });
        var TradeTradeAreaButtons = $('<div/>', { "class": "TradeTradeAreaButtons TradeAmountButtons" });
        var TradeTradeAreaOffer = $('<div/>', { "class": "CreateModulesCosts BorderBox" });
        var TradeTradeAreaDemand = $('<div/>', { "class": "CreateModulesOrder BorderBox" });
        TradeTradeArea.append(TradeTradeAreaButtons).append(TradeTradeAreaOffer).append(TradeTradeAreaDemand);


        var TradeTradeAreaOfferText = $('<div/>', { "class": "TradeTradeAreaOfferText", "text": i18n.label(551) }); //Costs
        var TradeTradeAreaOfferArea = $('<div/>', { "class": "TradeTradeAreaOfferArea" });
        TradeTradeAreaOffer.append(TradeTradeAreaOfferText).append(TradeTradeAreaOfferArea);

        var TradeTradeAreaDemandText = $('<div/>', { "class": "TradeTradeAreaOfferText", "text": i18n.label(1026) }); //Order
        var TradeTradeAreaDemandArea = $('<div/>', { "class": "TradeTradeAreaDemandArea" });
        TradeTradeAreaDemand.append(TradeTradeAreaDemandText).append(TradeTradeAreaDemandArea);

        var TradeTradeAreaCommits = $('<div/>', { "class": "TradeTradeAreaCommits" }); //Cancel
        TradeTradeArea.append(TradeTradeAreaCommits);

        var TradeTradeAreaCancel = $('<button/>', { "class": "TradeTradeAreaCreate ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary buttonActive", "text": i18n.label(207) });  //"Cancel"
        var TradeTradeAreaCreate = $('<button/>', { "class": "TradeTradeAreaCreate ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary buttonActive", "text": i18n.label(1027) });  //"Build"
        TradeTradeAreaCommits.append(TradeTradeAreaCancel).append(TradeTradeAreaCreate);
        TradeTradeAreaCancel.click(function (e) { e.stopPropagation(); BuildModulesHelper.ClearClick() });
        TradeTradeAreaCreate.click(function (e) { e.stopPropagation(); BuildModulesHelper.BuildModulesClick() });
        

        //goods selector page
        var TradeGoodsSelect = $('<div/>', { "class": "CreateModulesSelect BorderBox LeftPanelBox" });

        var CreateModulesSelectionText = $('<div/>', { "class": "TradeTradeAreaOfferText", "text": i18n.label(1028) }); //Select Ship modules to build

        var TradeGoods = $('<div/>', { "class": "TradeGoods" });
        var TradeGroupSelectGroup = $('<div/>', { "class": "TradeGroupSelectGroup" });
        TradeGoodsSelect.append(CreateModulesSelectionText).append(TradeGoods).append(TradeGroupSelectGroup);

        var TradeGroupSelectButton1 = $('<button/>', { "class": "TradeGroupSelectButton1 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary", "text": "I" });
        TradeGroupSelectGroup.append(TradeGroupSelectButton1);
        TradeGroupSelectButton1.click(function (e) { e.stopPropagation(); BuildModulesHelper.SetSelectedDemandGoodType(TradeOffersModule.DemandGoodType.I) });

        if (BuildModulesHelper.CheckModuleLevelAvailable(TradeOffersModule.DemandGoodType.II)){
            var TradeGroupSelectButton2 = $('<button/>', { "class": "TradeGroupSelectButton2 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary", "text": "II" });
            TradeGroupSelectGroup.append(TradeGroupSelectButton2);
            TradeGroupSelectButton2.click(function (e) { e.stopPropagation(); BuildModulesHelper.SetSelectedDemandGoodType(TradeOffersModule.DemandGoodType.II) });
        }

        if (BuildModulesHelper.CheckModuleLevelAvailable(TradeOffersModule.DemandGoodType.III)) {
            var TradeGroupSelectButton3 = $('<button/>', { "class": "TradeGroupSelectButton3 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary", "text": "III" });
            TradeGroupSelectGroup.append(TradeGroupSelectButton3);
            TradeGroupSelectButton3.click(function (e) { e.stopPropagation(); BuildModulesHelper.SetSelectedDemandGoodType(TradeOffersModule.DemandGoodType.III) });
        } 

        if (BuildModulesHelper.CheckModuleLevelAvailable(TradeOffersModule.DemandGoodType.SI)) {
            var TradeGroupSelectButtonS1 = $('<button/>', { "class": "TradeGroupSelectButtonS1 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary", "text": "S1" });
            TradeGroupSelectGroup.append(TradeGroupSelectButtonS1);
            TradeGroupSelectButtonS1.click(function (e) { e.stopPropagation(); BuildModulesHelper.SetSelectedDemandGoodType(TradeOffersModule.DemandGoodType.SI) });
        } 

        if (BuildModulesHelper.CheckModuleLevelAvailable(TradeOffersModule.DemandGoodType.SII)) {
            var TradeGroupSelectButtonS2 = $('<button/>', { "class": "TradeGroupSelectButtonS2 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary", "text": "S2" });
            TradeGroupSelectGroup.append(TradeGroupSelectButtonS2);
            TradeGroupSelectButtonS2.click(function (e) { e.stopPropagation(); BuildModulesHelper.SetSelectedDemandGoodType(TradeOffersModule.DemandGoodType.SII) });
        } 

        

        tradeDiv2.append(ColonyGoods);
        tradeDiv2.append(TradeTradeArea);
        tradeDiv2.append(TradeGoodsSelect);
    }

    export class BuildModules {

        SelectedTransferAmount: TradeOffersModule.TransferAmount = TradeOffersModule.TransferAmount.One;
        SelectedDemandGoodType: TradeOffersModule.DemandGoodType = TradeOffersModule.DemandGoodType.I;

        GoodsLeftForTrade: number[];
        OfferedGoods: number[] = [];
        DemandedGoods: number[] = [];

        //colony cargo 
        RefreshTradeSelectedShip() {

            var TradeSelectedShip = $(".TradeSelectedShip");
            TradeSelectedShip.empty();

            if (!mainObject.currentColony) return;

            //Create table for colony relevant values
            var buildTable = $('<table/>', { "cellspacing": 0 });// , style:"border-collapse: collapse;"

            var tableRowConstruction = $('<tr/>', { "Title": '' });

            var tableRowConstructionIcon = $('<td/>', { "class": "ColonyStatisticsIcon" });
            var tableRowConstructionIconDiv = $('<div/>', { "class": "Assembly" });
            tableRowConstructionIcon.append(tableRowConstructionIconDiv);
            tableRowConstruction.append(tableRowConstructionIcon);

            var tableRowConstructionText = $('<td/>', { text: i18n.label(278) });
            tableRowConstruction.append(tableRowConstructionText);
            var construction = (mainObject.currentColony.goods[7] || 0);
            construction -= this.OfferedGoods[7] || 0;

            //var tdConstructionData = $('<td/>', { text: construction });
            var tdConstructionData = $('<td/>');
            tdConstructionData.append($('<span/>', { "text": construction.toString()  }));

            tableRowConstruction.append(tdConstructionData);
            buildTable.append(tableRowConstruction);
            TradeSelectedShip.append(buildTable);

            var goodsContainer = $("<div/>");
            var goodsOverflow = $("<div/>");
            goodsOverflow.addClass("goodsOverflow");

            TradeSelectedShip.append(goodsOverflow);
            goodsOverflow.append(goodsContainer);


            //Detect all ships that are left for trade on the ship
            // ship goods - those goods already in trade offers - those goods already in the "offer" section
            this.GoodsLeftForTrade = []; // all goods from the player at all locations that are not in sales offers

            // all on colony:
            for (var currentGoodsIndex = 0; currentGoodsIndex < mainObject.goods.length; currentGoodsIndex++) {
                if (!mainObject.currentColony.goods[currentGoodsIndex]) continue;
                if (mainObject.goods[currentGoodsIndex].goodsType == 3) continue;
                this.GoodsLeftForTrade[currentGoodsIndex] = mainObject.currentColony.goods[currentGoodsIndex];
            }


            //remove the stuff currently already offered
            Helpers.removeGoodsFromArray(this.GoodsLeftForTrade, this.OfferedGoods);

            for (var currentGoodsIndex = 0; currentGoodsIndex < this.GoodsLeftForTrade.length; currentGoodsIndex++) {
                if (!this.GoodsLeftForTrade[currentGoodsIndex]) continue;
                var currentGoodsDiv = DrawInterface.createGoodsDiv(currentGoodsIndex, this.GoodsLeftForTrade[currentGoodsIndex], null, null, true, true);
                currentGoodsDiv.css("display", "inline-block");
                currentGoodsDiv.css("margin", "2px");
                currentGoodsDiv.css("vertical-align", "middle");
                var cId = currentGoodsIndex;

                DrawInterface.tooltipGoods(currentGoodsDiv, currentGoodsIndex, [], null, null);

                goodsContainer.append(currentGoodsDiv);
            }
            
        }

        BindDemandGoodClick(goodId: number, div: JQuery, addToDemand: boolean) {
            div.bind("mousedown touchstart", (e) => { e.stopPropagation(); this.DemandGoodClick(goodId, addToDemand); });
        }

        /*
        BindOfferGoodClick(goodId: number, div: JQuery, addToDemand: boolean) {
            div.bind("mousedown touchstart", (e) => { e.stopPropagation(); this.OfferGoodClick(goodId, addToDemand); });
        }
        */

        CheckModuleLevelAvailable(levelToCheck: TradeOffersModule.DemandGoodType): boolean {

            for (var i = 0; i < mainObject.goods.length; i++) {
                if (mainObject.goods[i] == null) continue;
                if (mainObject.goods[i].goodsType === 3) continue;
                if (mainObject.goods[i].goodsType !== 2) continue;

                var Shipmodule = BaseDataModule.getModuleByGoodsId(i);
                if (!Shipmodule) continue;

                if (levelToCheck == TradeOffersModule.DemandGoodType.I && Shipmodule.level != 1) continue;
                if (levelToCheck == TradeOffersModule.DemandGoodType.II && Shipmodule.level != 2) continue;
                if (levelToCheck == TradeOffersModule.DemandGoodType.III && Shipmodule.level != 3) continue;
                if (levelToCheck == TradeOffersModule.DemandGoodType.SI && Shipmodule.level != 4) continue;
                if (levelToCheck == TradeOffersModule.DemandGoodType.SII && Shipmodule.level != 5) continue;

                if (!PlayerData.modulesAvailable(Shipmodule.id)) continue;

                return true;
            }

            return false;
        }

        //goods selector page
        RefreshCreateModulesSelect() {
            var TradeGoods = $(".TradeGoods");
            TradeGoods.empty();


            for (var i = 0; i < mainObject.goods.length; i++) {
                if (mainObject.goods[i] == null) continue;
                if (mainObject.goods[i].goodsType === 3) continue;
                if (mainObject.goods[i].goodsType !== 2) continue;

                var Shipmodule = BaseDataModule.getModuleByGoodsId(i);
                if (!Shipmodule) continue;

                if (this.SelectedDemandGoodType == TradeOffersModule.DemandGoodType.I && Shipmodule.level != 1) continue;
                if (this.SelectedDemandGoodType == TradeOffersModule.DemandGoodType.II && Shipmodule.level != 2) continue;
                if (this.SelectedDemandGoodType == TradeOffersModule.DemandGoodType.III && Shipmodule.level != 3) continue;
                if (this.SelectedDemandGoodType == TradeOffersModule.DemandGoodType.SI && Shipmodule.level != 4) continue;
                if (this.SelectedDemandGoodType == TradeOffersModule.DemandGoodType.SII && Shipmodule.level != 5) continue;

                if (!PlayerData.modulesAvailable(Shipmodule.id)) continue;

                //check if module parts are available
                var buildable = Shipmodule.GoodsAvailable(this.GoodsLeftForTrade);
                var borderColor = !buildable ? "borderColorRed" : null;

                var goodsTd = DrawInterface.createGoodsDiv(Shipmodule.goodsId, 0, borderColor, null, false, true);   //mainInterface.createGoodsTd(BaseDataModule.modules[currentGoodsIndex].goodsId, goodsAmount);

                goodsTd.tooltip(BaseDataModule.getRelationObjectTooltip(ObjectTypes.ShipModule, Shipmodule.id));

                goodsTd.css("display", "inline-block");
                goodsTd.css("margin", "2px");
                goodsTd.css("vertical-align", "middle");

                var cId = i;
                if (buildable)
                    this.BindDemandGoodClick(cId, goodsTd, true);

                TradeGoods.append(goodsTd);        
            }
        }

        RefreshOfferSection() {
            //empty and construct the goods area:
            var quickInfo = $(".TradeTradeAreaOfferArea");
            quickInfo.empty();


            var goodsOverflow = $("<div/>");
            goodsOverflow.addClass("goodsOverflow");

            var goodsContainer = $("<div/>");

            quickInfo.append(goodsOverflow);
            goodsOverflow.append(goodsContainer);

            for (var currentGoodsIndex = 0; currentGoodsIndex < mainObject.goods.length; currentGoodsIndex++) {
                if (!this.OfferedGoods[currentGoodsIndex]) continue;

                if (mainObject.goods[currentGoodsIndex].goodsType == 3) continue;

                var currentGoodsDiv = DrawInterface.createGoodsDiv(currentGoodsIndex, this.OfferedGoods[currentGoodsIndex], null, null, true, true);
                currentGoodsDiv.css("display", "inline-block");
                currentGoodsDiv.css("margin", "2px");
                currentGoodsDiv.css("vertical-align", "middle");

                var cId = currentGoodsIndex;
               

                DrawInterface.tooltipGoods(currentGoodsDiv, currentGoodsIndex, [], null, null);

                goodsContainer.append(currentGoodsDiv);
            }
        }

        RefreshDemandSection() {
            //empty and construct the goods area:
            var quickInfo = $(".TradeTradeAreaDemandArea");
            quickInfo.empty();


            var goodsOverflow = $("<div/>");
            goodsOverflow.addClass("goodsOverflow");

            var goodsContainer = $("<div/>");

            quickInfo.append(goodsOverflow);
            goodsOverflow.append(goodsContainer);

            for (var currentGoodsIndex = 0; currentGoodsIndex < mainObject.goods.length; currentGoodsIndex++) {
                if (!this.DemandedGoods[currentGoodsIndex]) continue;

                if (mainObject.goods[currentGoodsIndex].goodsType == 3) continue;

                var currentGoodsDiv = DrawInterface.createGoodsDiv(currentGoodsIndex, this.DemandedGoods[currentGoodsIndex], null, null, true, true);
                currentGoodsDiv.css("display", "inline-block");
                currentGoodsDiv.css("margin", "2px");
                currentGoodsDiv.css("vertical-align", "middle");

                var cId = currentGoodsIndex;
                this.BindDemandGoodClick(cId, currentGoodsDiv, false);

                DrawInterface.tooltipGoods(currentGoodsDiv, currentGoodsIndex, [], null, null);

                goodsContainer.append(currentGoodsDiv);
            }
        }

        DemandGoodClick(goodId: number, addToDemand: boolean) {

            //this.HasChanges = true;         
            var ToTransfer = addToDemand ? this.SelectedTransferAmount : -this.SelectedTransferAmount;
            var storageCost = 1;

            var Module = BaseDataModule.FindModuleByGoodId(goodId);

            //modules cost as much as their production cost:
            if (mainObject.goods[goodId].goodsType == 2) {              
                storageCost = Module.StorageCost();
            }


            var CargoRoomAvailable = 1000;
            ToTransfer = Math.min(ToTransfer, CargoRoomAvailable);


            //add the cost of the module to the offer section:
            for (var goodsIndex = 0; goodsIndex < Module.costs.length; goodsIndex++) {
                if (Module.costs[goodsIndex] == null) continue;

                var moduleMaterial = Module.costs[goodsIndex];

                if (this.OfferedGoods[goodsIndex] == null || this.OfferedGoods[goodsIndex] == 0)
                    this.OfferedGoods[goodsIndex] = ToTransfer * Module.costs[goodsIndex];
                else
                    this.OfferedGoods[goodsIndex] += ToTransfer * Module.costs[goodsIndex];               
            }

            //Helpers.Log(ToTransfer.toString(), Helpers.LogType.Transfer);

            if (this.DemandedGoods[goodId] == null || this.DemandedGoods[goodId] == 0)
                this.DemandedGoods[goodId] = ToTransfer;
            else
                this.DemandedGoods[goodId] += ToTransfer;

            if (this.DemandedGoods[goodId] > 9999) this.DemandedGoods[goodId] = 9999;
            if (this.DemandedGoods[goodId] < 0) this.DemandedGoods[goodId] = 0;

            this.RefreshOfferSection();
            this.RefreshDemandSection();
            this.RefreshTradeSelectedShip();
            this.RefreshCreateModulesSelect();
        }

        SetSelectedTransferAmount(newValue: TradeOffersModule.TransferAmount) {
            this.SelectedTransferAmount = newValue;
            $(".TradeTradeAreaButtons button").removeClass("buttonActive");

            switch (TradeOffersModule.TradeCreatePanel.SelectedTransferAmount) {
                case TradeOffersModule.TransferAmount.One:
                    $(".TradeTradeAreaButtons .TradeTradeAreaButtonOne").addClass("buttonActive");
                    break;
                case TradeOffersModule.TransferAmount.Ten:
                    $(".TradeTradeAreaButtons .TradeTradeAreaButtonTen").addClass("buttonActive");
                    break;
                case TradeOffersModule.TransferAmount.Hundred:
                    $(".TradeTradeAreaButtons .TradeTradeAreaButtonHundred").addClass("buttonActive");
                    break;
                case TradeOffersModule.TransferAmount.Thousand:
                    $(".TradeTradeAreaButtons .TradeTradeAreaButtonThousand").addClass("buttonActive");
                    break;
            }
        }

        SetSelectedDemandGoodType(newValue: TradeOffersModule.DemandGoodType) {
            this.SelectedDemandGoodType = newValue;
            $(".TradeGroupSelectGroup button").removeClass("buttonActive");

            switch (TradeOffersModule.TradeCreatePanel.SelectedDemandGoodType) {
                case TradeOffersModule.DemandGoodType.R:
                    $(".TradeGroupSelectGroup .TradeGroupSelectButtonGoods").addClass("buttonActive");
                    break;
                case TradeOffersModule.DemandGoodType.I:
                    $(".TradeGroupSelectGroup .TradeGroupSelectButton1").addClass("buttonActive");
                    break;
                case TradeOffersModule.DemandGoodType.II:
                    $(".TradeGroupSelectGroup .TradeGroupSelectButton2").addClass("buttonActive");
                    break;
                case TradeOffersModule.DemandGoodType.III:
                    $(".TradeGroupSelectGroup .TradeGroupSelectButton3").addClass("buttonActive");
                    break;
                case TradeOffersModule.DemandGoodType.SI:
                    $(".TradeGroupSelectGroup .TradeGroupSelectButtonS1").addClass("buttonActive");
                    break;
                case TradeOffersModule.DemandGoodType.SII:
                    $(".TradeGroupSelectGroup .TradeGroupSelectButtonS2").addClass("buttonActive");
                    break;
            }

            this.RefreshCreateModulesSelect();
        }

        ClearClick() {
            this.OfferedGoods = [];
            this.DemandedGoods = [];

            this.RefreshTradeSelectedShip();

            this.RefreshOfferSection();
            this.RefreshDemandSection();
            this.RefreshCreateModulesSelect();
        }

        BuildModulesClick() {

            //only executes if something id offered or demanded:
            var changeexists = false;

            for (var i = 0; !changeexists && i < this.OfferedGoods.length; i++) {
                if (this.OfferedGoods[i] == null || this.OfferedGoods[i] == 0) continue;
                if (mainObject.goods[i] == null) continue; //should never occur...               
                if (mainObject.goods[i].goodsType == 3) continue;

                changeexists = true;
            }

            for (var i = 0; !changeexists && i < this.DemandedGoods.length; i++) {
                if (this.DemandedGoods[i] == null || this.DemandedGoods[i] == 0) continue;
                if (mainObject.goods[i] == null) continue; //should never occur...               
                if (mainObject.goods[i].goodsType == 3) continue;

                changeexists = true;
            }


            changeexists && SendBuildModules(this.MakeJSON());
            
        }

        MakeJSON(): string {
            //{"Sender":colobyId,"Target":0,"SenderType":0,"TargetType":0,"Goods":[{"Id":1,"Qty":5},{"GoodId":3,"Amount":15},{"GoodId":2015,"Amount":6}]}

            var serialized = '{"Sender":' + mainObject.currentColony.id.toString() + ',';
            serialized += '"SenderType":0,"Target":0,"TargetType":0,';

            serialized += '"Goods":[';
            var FirstDone = false;
            for (var i = 0; i < this.DemandedGoods.length; i++) {
                if (this.DemandedGoods[i] == null || this.DemandedGoods[i] == 0) continue;
                if (mainObject.goods[i] == null) continue; //should never occur...               
                if (mainObject.goods[i].goodsType == 3) continue;

                if (FirstDone) serialized += ','; else FirstDone = true;

                serialized += '{"Id":' + i.toString() + ',"Qty":' + this.DemandedGoods[i].toString() + '}';
            }
            serialized += ']}';

            Helpers.Log(serialized, Helpers.LogType.Transfer);
            return serialized;
        }


        showCreateTrade() {
            

            this.SelectedTransferAmount = TradeOffersModule.TransferAmount.One;
            this.SelectedDemandGoodType = TradeOffersModule.DemandGoodType.I;

            this.RefreshTradeSelectedShip();

            this.RefreshCreateModulesSelect();


            this.RefreshOfferSection();
            this.RefreshDemandSection();

        }

        BuildAndClose() {
            for (var currentGoodsIndex = 0; currentGoodsIndex < this.OfferedGoods.length; currentGoodsIndex++) {
                if (!this.OfferedGoods[currentGoodsIndex]) continue;
                mainObject.currentColony.goods[currentGoodsIndex] = mainObject.currentColony.goods[currentGoodsIndex] - this.OfferedGoods[currentGoodsIndex];
            }

            for (var currentGoodsIndex = 0; currentGoodsIndex < this.DemandedGoods.length; currentGoodsIndex++) {
                if (!this.DemandedGoods[currentGoodsIndex]) continue;

                if (mainObject.currentColony.goods[currentGoodsIndex])
                    mainObject.currentColony.goods[currentGoodsIndex] = mainObject.currentColony.goods[currentGoodsIndex] + this.DemandedGoods[currentGoodsIndex];
                else
                    mainObject.currentColony.goods[currentGoodsIndex] = this.DemandedGoods[currentGoodsIndex];
            }

            this.OfferedGoods = [];
            this.DemandedGoods = [];
            this.showCreateTrade();
            mainInterface.refreshQuickInfoGoods();
            mainInterface.refreshMainScreenStatistics();
            BuildModulesForm.windowHandle.remove();
        }
    }

    export function NewColonyStock(e) {     
        if (e) {
            BuildModulesForm.BuildModulesHelper.BuildAndClose();
            
        }
    }

    export function SendBuildModules(json: string) {

        $.connection.spaceHub.invoke("BuildModules", json).done(e => {
            BuildModulesForm.NewColonyStock(e);
        });
    }

    BuildModulesHelper = new BuildModules();
}