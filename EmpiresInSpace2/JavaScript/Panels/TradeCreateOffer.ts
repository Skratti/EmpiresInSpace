
module TradeOffersModule {
    export enum TransferAmount {
        One = 1,
        Ten= 10,
        Hundred = 100,
        Thousand = 1000
    }

    export enum DemandGoodType {
        R,
        I,
        II,
        III,
        SI,
        SII
    }

    export var TradeCreatePanel: CreateTrade; //helper class for goods trade creation 


    export function PopulateCreateTradeForm(tradeDiv2: JQuery) {
        //Selectors for the Offer wares page
        //all ships with cargo at trade stations:
        var TradeOwnShips = $('<div/>', { "class": "TradeOwnShips ShipsIconList BorderBox LeftPanelBox" });

        //ship name, cargo bar and cargo of selected ship
        var TradeSelectedShip = $('<div/>', { "class": "TradeSelectedShip ShipSelectionLine BorderBox LeftPanelBox" });

        //trade area buttons with transfer amount labels, one row with offer, one row with demand
        var TradeTradeArea = $('<div/>', { "class": "TradeTradeArea BorderBox LeftPanelBox" });
        var TradeTradeAreaButtons = $('<div/>', { "class": "TradeTradeAreaButtons TradeAmountButtons" });
        var TradeTradeAreaOffer = $('<div/>', { "class": "TradeTradeAreaOffer BorderBox" });
        var TradeTradeAreaDemand = $('<div/>', { "class": "TradeTradeAreaDemand BorderBox" });
        TradeTradeArea.append(TradeTradeAreaButtons).append(TradeTradeAreaOffer).append(TradeTradeAreaDemand);

        var TradeTradeAreaButtonOne = $('<button/>', { "class": "TradeTradeAreaButtonOne ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary", "text": "1" });
        var TradeTradeAreaButtonTen = $('<button/>', { "class": "TradeTradeAreaButtonTen ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary buttonActive", "text": "10" });
        var TradeTradeAreaButtonHundred = $('<button/>', { "class": "TradeTradeAreaButtonHundred ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary", "text": "100" });
        var TradeTradeAreaButtonThousand = $('<button/>', { "class": "TradeTradeAreaButtonThousand ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary", "text": "1000" });
        var TradeTradeAreaButtonCancel = $('<button/>', { "class": "TradeTradeAreaButtonCancel ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary", "text": "C", "title": "Cancel" }); //Cancel
        TradeTradeAreaButtonCancel.attr("title", i18n.label(207));

        TradeTradeAreaButtons.append($('<div/>').append(TradeTradeAreaButtonOne)).
            append($('<div/>').append(TradeTradeAreaButtonTen)).
            append($('<div/>').append(TradeTradeAreaButtonHundred)).
            append($('<div/>').append(TradeTradeAreaButtonThousand)).
            append($('<div/>').append(TradeTradeAreaButtonCancel));

        TradeTradeAreaButtonOne.click(function (e) { e.stopPropagation(); TradeOffersModule.TradeCreatePanel.SetSelectedTransferAmount(TradeOffersModule.TransferAmount.One) });
        TradeTradeAreaButtonTen.click(function (e) { e.stopPropagation(); TradeOffersModule.TradeCreatePanel.SetSelectedTransferAmount(TradeOffersModule.TransferAmount.Ten) });
        TradeTradeAreaButtonHundred.click(function (e) { e.stopPropagation(); TradeOffersModule.TradeCreatePanel.SetSelectedTransferAmount(TradeOffersModule.TransferAmount.Hundred) });
        TradeTradeAreaButtonThousand.click(function (e) { e.stopPropagation(); TradeOffersModule.TradeCreatePanel.SetSelectedTransferAmount(TradeOffersModule.TransferAmount.Thousand) });
        TradeTradeAreaButtonCancel.click(function (e) { e.stopPropagation(); TradeOffersModule.TradeCreatePanel.ClearClick() });

        //$("#TransferButtonX").click(function (e) { e.stopPropagation(); transferPanel.ResetChanges() });



        var TradeTradeAreaOfferText = $('<div/>', { "class": "TradeTradeAreaOfferText", "text": i18n.label(190) }); //Offer
        var TradeTradeAreaOfferArea = $('<div/>', { "class": "TradeTradeAreaOfferArea" });
        TradeTradeAreaOffer.append(TradeTradeAreaOfferText).append(TradeTradeAreaOfferArea);

        var TradeTradeAreaDemandText = $('<div/>', { "class": "TradeTradeAreaOfferText", "text": i18n.label(191) }); //Demand
        var TradeTradeAreaDemandArea = $('<div/>', { "class": "TradeTradeAreaDemandArea" });
        TradeTradeAreaDemand.append(TradeTradeAreaDemandText).append(TradeTradeAreaDemandArea);

        var TradeTradeAreaCommits = $('<div/>', { "class": "TradeTradeAreaCommits" }); //Cancel
        TradeTradeArea.append(TradeTradeAreaCommits);


        //var TradeTradeAreaButtonTen = $('<button/>', { "class": "TradeTradeAreaButtonTen ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary", "text": "10" });
        //var DiplomaticStateSelect = createMinimalDiplomaticStateSelect();
        //TradeTradeAreaCommits.append(DiplomaticStateSelect);

        var TradeCreateInformation = $('<span/>', { "class": "TradeCreateInformation", "text": i18n.label(988) }); //   Overloaded!
        var TradeTradeAreaCreate = $('<button/>', { "class": "TradeTradeAreaCreate ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary buttonActive", "text": i18n.label(989) });  //"Create Trade"
        TradeTradeAreaCommits.append(TradeCreateInformation).append(TradeTradeAreaCreate);
        TradeTradeAreaCreate.click(function (e) { e.stopPropagation(); TradeOffersModule.TradeCreatePanel.CreateTradeClick() });


        //goods selector page
        var TradeGoodsSelect = $('<div/>', { "class": "TradeGoodsSelect BorderBox LeftPanelBox" });

        var TradeGoods = $('<div/>', { "class": "TradeGoods" });
        var TradeGroupSelectGroup = $('<div/>', { "class": "TradeGroupSelectGroup" });
        TradeGoodsSelect.append(TradeGoods).append(TradeGroupSelectGroup);

        var TradeGroupSelectButtonGoods = $('<button/>', { "class": "TradeGroupSelectButtonGoods ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary buttonActive", "text": "Goods" });
        var TradeGroupSelectButton1 = $('<button/>', { "class": "TradeGroupSelectButton1 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary", "text": "I" });
        var TradeGroupSelectButton2 = $('<button/>', { "class": "TradeGroupSelectButton2 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary", "text": "II" });
        var TradeGroupSelectButton3 = $('<button/>', { "class": "TradeGroupSelectButton3 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary", "text": "III" });
        var TradeGroupSelectButtonS1 = $('<button/>', { "class": "TradeGroupSelectButtonS1 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary", "text": "S1" });
        var TradeGroupSelectButtonS2 = $('<button/>', { "class": "TradeGroupSelectButtonS2 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary", "text": "S2" });

        TradeGroupSelectGroup.append(TradeGroupSelectButtonGoods)
            .append(TradeGroupSelectButton1)
            .append(TradeGroupSelectButton2)
            .append(TradeGroupSelectButton3)
            .append(TradeGroupSelectButtonS1)
            .append(TradeGroupSelectButtonS2);

        TradeGroupSelectButtonGoods.click(function (e) { e.stopPropagation(); TradeOffersModule.TradeCreatePanel.SetSelectedDemandGoodType(TradeOffersModule.DemandGoodType.R) });
        TradeGroupSelectButton1.click(function (e) { e.stopPropagation(); TradeOffersModule.TradeCreatePanel.SetSelectedDemandGoodType(TradeOffersModule.DemandGoodType.I) });
        TradeGroupSelectButton2.click(function (e) { e.stopPropagation(); TradeOffersModule.TradeCreatePanel.SetSelectedDemandGoodType(TradeOffersModule.DemandGoodType.II) });
        TradeGroupSelectButton3.click(function (e) { e.stopPropagation(); TradeOffersModule.TradeCreatePanel.SetSelectedDemandGoodType(TradeOffersModule.DemandGoodType.III) });
        TradeGroupSelectButtonS1.click(function (e) { e.stopPropagation(); TradeOffersModule.TradeCreatePanel.SetSelectedDemandGoodType(TradeOffersModule.DemandGoodType.SI) });
        TradeGroupSelectButtonS2.click(function (e) { e.stopPropagation(); TradeOffersModule.TradeCreatePanel.SetSelectedDemandGoodType(TradeOffersModule.DemandGoodType.SII) });




        tradeDiv2.append(TradeOwnShips);
        tradeDiv2.append(TradeSelectedShip);
        tradeDiv2.append(TradeTradeArea);
        tradeDiv2.append(TradeGoodsSelect);
    }


    export class CreateTrade {


        SelectedTransferAmount: TransferAmount = TransferAmount.Ten;
        SelectedDemandGoodType: DemandGoodType = DemandGoodType.R;
       
        TradingShip: Ships.Ship;    
         
        GoodsLeftForTrade: number[];
        OfferedGoods: number[] = [];
        DemandedGoods: number[] = [];

        PendingTransfer(goodId: number): number {
            if (this.OfferedGoods.length <= goodId) return 0;
            if (this.OfferedGoods[goodId]) return this.OfferedGoods[goodId];
            return 0;
        }

        CargoChange(spaceObject: SpaceObject): number {
            
            var goodsCount = 0;

            for (var i = 0; i < this.OfferedGoods.length; i++) {
                if (this.OfferedGoods[i] == null || this.OfferedGoods[i] == 0) continue;
                if (mainObject.goods[i] == null) continue; //should never occur...               
                if (mainObject.goods[i].goodsType == 3) continue;

                //normal goods are just substracted
                if (mainObject.goods[i].goodsType == 1) {
                    goodsCount -= this.OfferedGoods[i];
                }

                //modules cost as much as their production cost:
                if (mainObject.goods[i].goodsType == 2) {
                    var Module = BaseDataModule.FindModuleByGoodId(i);
                    goodsCount -= this.OfferedGoods[i] * Module.StorageCost();
                }
            }

            for (var i = 0; i < this.DemandedGoods.length; i++) {
                if (this.DemandedGoods[i] == null || this.DemandedGoods[i] == 0) continue;
                if (mainObject.goods[i] == null) continue; //should never occur...               
                if (mainObject.goods[i].goodsType == 3) continue;

                //normal goods are just added
                if (mainObject.goods[i].goodsType == 1) {
                    goodsCount += this.DemandedGoods[i];
                }

                //modules cost as much as their production cost:
                if (mainObject.goods[i].goodsType == 2) {
                    var Module = BaseDataModule.FindModuleByGoodId(i);
                    goodsCount += this.DemandedGoods[i] * Module.StorageCost();
                }
            }

            return goodsCount;
        }

        SetSelectedTransferAmount(newValue: TransferAmount) {
            this.SelectedTransferAmount = newValue;
            $(".TradeTradeAreaButtons button").removeClass("buttonActive");

            switch (TradeOffersModule.TradeCreatePanel.SelectedTransferAmount) {
                case TransferAmount.One:
                    $(".TradeTradeAreaButtons .TradeTradeAreaButtonOne").addClass("buttonActive");
                    break;
                case TransferAmount.Ten:
                    $(".TradeTradeAreaButtons .TradeTradeAreaButtonTen").addClass("buttonActive");
                    break;
                case TransferAmount.Hundred:
                    $(".TradeTradeAreaButtons .TradeTradeAreaButtonHundred").addClass("buttonActive");
                    break;
                case TransferAmount.Thousand:
                    $(".TradeTradeAreaButtons .TradeTradeAreaButtonThousand").addClass("buttonActive");
                    break;
            }
        }

        SetSelectedDemandGoodType(newValue: DemandGoodType) {
            this.SelectedDemandGoodType = newValue;
            $(".TradeGroupSelectGroup button").removeClass("buttonActive");

            switch (TradeOffersModule.TradeCreatePanel.SelectedDemandGoodType) {
                case DemandGoodType.R:
                    $(".TradeGroupSelectGroup .TradeGroupSelectButtonGoods").addClass("buttonActive");
                    break;
                case DemandGoodType.I:
                    $(".TradeGroupSelectGroup .TradeGroupSelectButton1").addClass("buttonActive");
                    break;
                case DemandGoodType.II:
                    $(".TradeGroupSelectGroup .TradeGroupSelectButton2").addClass("buttonActive");
                    break;
                case DemandGoodType.III:
                    $(".TradeGroupSelectGroup .TradeGroupSelectButton3").addClass("buttonActive");
                    break;
                case DemandGoodType.SI:
                    $(".TradeGroupSelectGroup .TradeGroupSelectButtonS1").addClass("buttonActive");
                    break;
                case DemandGoodType.SII:
                    $(".TradeGroupSelectGroup .TradeGroupSelectButtonS2").addClass("buttonActive");
                    break;
            }

            this.RefreshTradeGoodsSelect();
        }

        ClearClick() {
            this.OfferedGoods = [];
            this.DemandedGoods = [];      

            this.RefreshTradeSelectedShip();
            this.RefreshTradeTradeArea();
            this.RefreshOfferSection();
            this.RefreshDemandSection();
        }

        OfferGoodClick(goodId: number, addToOffer: boolean) {
            
            Helpers.Log('3 OfferGood ' + goodId.toString() , Helpers.LogType.Trade);

            var ToTransfer = addToOffer ? this.SelectedTransferAmount : -this.SelectedTransferAmount;
            var storageCost = 1;

            //modules cost as much as their production cost:
            if (mainObject.goods[goodId].goodsType == 2) {
                var Module = BaseDataModule.FindModuleByGoodId(goodId);
                storageCost = Module.StorageCost();
            }

            //check if ship has enough of those goods on board, reduce if not
            if (addToOffer) {
                if (ToTransfer > this.GoodsLeftForTrade[goodId]) ToTransfer = this.GoodsLeftForTrade[goodId];
            }

            /*
            var CargoRoomAvailable = Math.max(this.Trader.cargoroom - this.Trader.countCargo(), 0);
            CargoRoomAvailable = Math.floor(CargoRoomAvailable / storageCost);
            ToTransfer = Math.min(ToTransfer, CargoRoomAvailable);
            */
            //Helpers.Log(ToTransfer.toString(), Helpers.LogType.Transfer);

            if (this.OfferedGoods[goodId] == null || this.OfferedGoods[goodId] == 0)
                this.OfferedGoods[goodId] = ToTransfer;
            else
                this.OfferedGoods[goodId] += ToTransfer;

            if (this.OfferedGoods[goodId] > 9999) this.OfferedGoods[goodId] = 9999;
            if (this.OfferedGoods[goodId] < 0) this.OfferedGoods[goodId] = 0;

            this.RefreshOfferSection();
            this.RefreshTradeSelectedShip();

        }

        DemandGoodClick(goodId: number, addToDemand : boolean) {

            //this.HasChanges = true;         
            var ToTransfer = addToDemand ? this.SelectedTransferAmount : -this.SelectedTransferAmount;
            var storageCost = 1;

            //modules cost as much as their production cost:
            if (mainObject.goods[goodId].goodsType == 2) {
                var Module = BaseDataModule.FindModuleByGoodId(goodId);
                storageCost = Module.StorageCost();
            }

            
            var CargoRoomAvailable = Math.max(this.TradingShip.cargoroom - this.TradingShip.countCargo(true), 0);
            CargoRoomAvailable = Math.floor(CargoRoomAvailable / storageCost);
            ToTransfer = Math.min(ToTransfer, CargoRoomAvailable);
            
            //Helpers.Log(ToTransfer.toString(), Helpers.LogType.Transfer);

            if (this.DemandedGoods[goodId] == null || this.DemandedGoods[goodId] == 0)
                this.DemandedGoods[goodId] = ToTransfer;
            else
                this.DemandedGoods[goodId] += ToTransfer;

            if (this.DemandedGoods[goodId] > 9999) this.DemandedGoods[goodId] = 9999;
            if (this.DemandedGoods[goodId] < 0) this.DemandedGoods[goodId] = 0;

            this.RefreshDemandSection();
            this.RefreshTradeSelectedShip();
        }

        CreateTradeClick() {

            if (this.TradingShip.cargoHoldUsed(true) > this.TradingShip.cargoroom) {
                var textSpan = $(".TradeCreateInformation");
                textSpan.css("display", "inline-block");
                textSpan.delay(3000).fadeOut(2000, function () { $(this).css("display", "none") });
                return;
            }

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


            changeexists && TradeOffersModule.createTradeOffer(this.TradingShip, this.OfferedGoods, this.DemandedGoods);

            this.OfferedGoods = [];
            this.DemandedGoods = [];
            this.RefreshOfferSection();
            this.RefreshDemandSection();
        }

        SwitchSelectedShip(spaceObject: SpaceObject) {
            //if (this.HasChanges) this.SendChanges();
            this.OfferedGoods = [];
            this.DemandedGoods = [];            
            this.TradingShip = <Ships.Ship>spaceObject;
           
            this.RefreshTradeOwnShips();
            this.RefreshTradeSelectedShip();
            this.RefreshTradeTradeArea();            
            this.RefreshOfferSection();
            this.RefreshDemandSection();
        }

        //all own ships with cargo at trade stations:
        RefreshTradeOwnShips() {
            var shipList = $(".TradeOwnShips");
            shipList.empty();

            var selectedShipBorder = 'thin solid blue';


            for (var i = 0; i < mainObject.ships.length; i++) {
                if (mainObject.ships[i] == null) continue;
                if (mainObject.ships[i].owner != mainObject.user.id) continue;

                //omit shuips that are not a a trade station
                if (!mainObject.ships[i].isOnCommNodeTile()) continue;

                //omit ships that have bo goods on board? 
                if (mainObject.ships[i].cargoHoldUsed() == 0) continue;

                var Ship = mainObject.ships[i];

                var shipDiv = DrawInterface.createShipDiv(Ship, true, true, true, false);
                shipDiv.css('border', 'none');
                if (this.TradingShip == Ship) {
                    $('.ShipContainer', shipDiv).css('border', selectedShipBorder);
                }

                shipDiv.unbind("mousedown");
                shipDiv.unbind("touchstart");
                this.BindShipListShipClick(Ship, shipDiv);


                shipList.append(shipDiv);
                Ship.toolTip(shipDiv);
            }
        }        

        //ship name, cargo bar and cargo of selected ship
        RefreshTradeSelectedShip() {

            var TradeSelectedShip = $(".TradeSelectedShip");
            TradeSelectedShip.empty();

            if (!this.TradingShip) return;


            var ShipLineDiv = $("<div/>");
            TradeSelectedShip.append(ShipLineDiv);


            var shipDiv = DrawInterface.createShipDiv(this.TradingShip);
            shipDiv.css('border', 'none');

            shipDiv.unbind("mousedown");
            shipDiv.unbind("touchstart");
            //this.BindShipListShipClick(this.Target, shipDiv);

            ShipLineDiv.append(shipDiv);
            this.TradingShip.toolTip(shipDiv);

            var NameDiv = $("<div/>", { "class": "DivVertInlineBlock" });
            var Name = $("<span/>");
            Name.html(this.TradingShip.name.label());
            NameDiv.append(Name);
            ShipLineDiv.append(NameDiv);


            var CargoHoldBarDiv = $("<div/>")
            ShipLineDiv.append(CargoHoldBarDiv);
            CargoHoldBarDiv.css('padding', '14px');
            CargoHoldBarDiv.append(DrawInterface.createCargoHoldBar(this.TradingShip, true));

            var goodsContainer = $("<div/>");
            var goodsOverflow = $("<div/>");
            goodsOverflow.addClass("goodsOverflow");

            TradeSelectedShip.append(goodsOverflow);
            goodsOverflow.append(goodsContainer);


            //Detect all ships that are left for trade on the ship
            // ship goods - those goods already in trade offers - those goods already in the "offer" section
            this.GoodsLeftForTrade = []; // all goods from the player at all locations that are not in sales offers

            // all on ship:
            for (var currentGoodsIndex = 0; currentGoodsIndex < mainObject.goods.length; currentGoodsIndex++) {
                if (!this.TradingShip.goods[currentGoodsIndex]) continue;
                if (mainObject.goods[currentGoodsIndex].goodsType == 3) continue;
                this.GoodsLeftForTrade[currentGoodsIndex] = this.TradingShip.goods[currentGoodsIndex];
            }

            // remove those stuff already in trades
            for (var i = 0; i < TradeOffersModule.tradeOffers.length; i++) {
                if (!TradeOffersModule.tradeOffers[i]) continue;
                if (TradeOffersModule.tradeOffers[i].objectType != 0 || TradeOffersModule.tradeOffers[i].creatorId != this.TradingShip.id) continue;

                Helpers.removeGoodsFromArray(this.GoodsLeftForTrade, TradeOffersModule.tradeOffers[i].offer);          
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

                this.BindOfferGoodClick(cId, currentGoodsDiv, true);

                DrawInterface.tooltipGoods(currentGoodsDiv, currentGoodsIndex, [], null, null);

                goodsContainer.append(currentGoodsDiv);
            }
            /*
            for (var currentGoodsIndex = 0; currentGoodsIndex < mainObject.goods.length; currentGoodsIndex++) {
                if (!this.TradingShip.goods[currentGoodsIndex]) continue;
                if (mainObject.goods[currentGoodsIndex].goodsType == 3) continue;

                var amountInStore = 0;
                if (this.TradingShip.goods[currentGoodsIndex] != null) amountInStore = this.TradingShip.goods[currentGoodsIndex];
                amountInStore -= this.PendingTransfer(currentGoodsIndex);
                if (amountInStore == 0) continue;


                var currentGoodsDiv = DrawInterface.createGoodsDiv(currentGoodsIndex, amountInStore, null, null, true, true);
                currentGoodsDiv.css("display", "inline-block");
                currentGoodsDiv.css("margin", "2px");
                currentGoodsDiv.css("vertical-align", "middle");

                var cId = currentGoodsIndex;
                this.BindOfferGoodClick(cId, currentGoodsDiv, true);
                

                DrawInterface.tooltipGoods(currentGoodsDiv, currentGoodsIndex, [], null, null);

                goodsContainer.append(currentGoodsDiv);
            }
            */
        }

        //trade area buttons with transfer amount labels, one+ row with offer, one+row with demand
        RefreshTradeTradeArea() {
            /*
            <div id="TransferButtons" class="alpha60white">
                            <button id="TransferButton1" class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">1</button>
                            <button id="TransferButton10" class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">10</button>
                            <button id="TransferButton100"class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">100</button>
                            <button id="TransferButtonI" class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary buttonActive">∞</button>
                            <button id="TransferButtonX" class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary buttonActive" title="Cancel">C</button>
                        </div>
            */


        }


        RefreshOfferSection() {
            //empty and construct the goods area:
            var quickInfo = $(".TradeTradeAreaOfferArea");
            quickInfo.empty();


            var goodsOverflow = $("<div/>");
            goodsOverflow.addClass("goodsOverflow");
            //goodsOverflow.css("overflow-y", "auto");
            //goodsOverflow.css("height", "130px");

            var goodsContainer = $("<div/>");

            quickInfo.append(goodsOverflow);
            goodsOverflow.append(goodsContainer);

            for (var currentGoodsIndex = 0; currentGoodsIndex < mainObject.goods.length; currentGoodsIndex++) {
                if (!this.OfferedGoods[currentGoodsIndex]) continue;

                if (mainObject.goods[currentGoodsIndex].goodsType == 3) continue;

                var currentGoodsDiv = DrawInterface.createGoodsDiv(currentGoodsIndex, this.OfferedGoods[currentGoodsIndex], null,  null, true, true);
                currentGoodsDiv.css("display", "inline-block");
                currentGoodsDiv.css("margin", "2px");
                currentGoodsDiv.css("vertical-align", "middle");

                var cId = currentGoodsIndex;
                this.BindOfferGoodClick(cId, currentGoodsDiv, false);

                DrawInterface.tooltipGoods(currentGoodsDiv, currentGoodsIndex, [], null, null);

                goodsContainer.append(currentGoodsDiv);
            }
        }

        BindShipListShipClick(spaceObject: SpaceObject, shipDiv: JQuery) {
            shipDiv.bind("mousedown touchstart", (e) => { e.stopPropagation(); TradeOffersModule.TradeCreatePanel.SwitchSelectedShip(spaceObject); });
        }
       
        BindOfferGoodClick(goodId: number, div: JQuery, addToDemand: boolean) {
            div.bind("mousedown touchstart", (e) => { e.stopPropagation(); TradeOffersModule.TradeCreatePanel.OfferGoodClick(goodId, addToDemand); });
        }

        BindDemandGoodClick(goodId: number, div: JQuery, addToDemand: boolean) {
            div.bind("mousedown touchstart", (e) => { e.stopPropagation(); TradeOffersModule.TradeCreatePanel.DemandGoodClick(goodId, addToDemand); });
        }

        RefreshDemandSection() {
            //empty and construct the goods area:
            var quickInfo = $(".TradeTradeAreaDemandArea");
            quickInfo.empty();
            

            var goodsOverflow = $("<div/>");
            goodsOverflow.addClass("goodsOverflow");
            //goodsOverflow.css("overflow-y", "auto");
            //goodsOverflow.css("height", "130px");

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

        //goods selector page
        RefreshTradeGoodsSelect() {
            var TradeGoods = $(".TradeGoods");
            TradeGoods.empty();


            for (var i = 0; i < mainObject.goods.length; i++) {
                if (mainObject.goods[i] == null) continue;
                if (mainObject.goods[i].goodsType === 3) continue;

                if (this.SelectedDemandGoodType == DemandGoodType.R) {
                    if (mainObject.goods[i].goodsType !== 1) continue;

                    var goodsTd = DrawInterface.createGoodsDiv(i, 0, null, null, false);   //mainInterface.createGoodsTd(BaseDataModule.modules[currentGoodsIndex].goodsId, goodsAmount);
                    //goodsTd.tooltip(BaseDataModule.getRelationObjectTooltip(ObjectTypes.Good, i));

                    goodsTd.css("display", "inline-block");
                    goodsTd.css("margin", "2px");
                    goodsTd.css("vertical-align", "middle");

                    TradeGoods.append(goodsTd);

                    var cId = i;
                    this.BindDemandGoodClick(cId, goodsTd, true);

                } else {
                    if (mainObject.goods[i].goodsType !== 2) continue;

                    var Shipmodule = BaseDataModule.getModuleByGoodsId(i);
                    if (!Shipmodule) continue;

                    if (this.SelectedDemandGoodType == DemandGoodType.I && Shipmodule.level != 1) continue;
                    if (this.SelectedDemandGoodType == DemandGoodType.II && Shipmodule.level != 2) continue;
                    if (this.SelectedDemandGoodType == DemandGoodType.III && Shipmodule.level != 3) continue;
                    if (this.SelectedDemandGoodType == DemandGoodType.SI && Shipmodule.level != 4) continue;
                    if (this.SelectedDemandGoodType == DemandGoodType.SII && Shipmodule.level != 5) continue;

                    var goodsTd = DrawInterface.createGoodsDiv(Shipmodule.goodsId, 0, null, null, false, true);   //mainInterface.createGoodsTd(BaseDataModule.modules[currentGoodsIndex].goodsId, goodsAmount);

                    //goodsTd.addClass("ModuleLevelBg" + Shipmodule.level.toString());

                    goodsTd.tooltip(BaseDataModule.getRelationObjectTooltip(ObjectTypes.ShipModule, Shipmodule.id));

                    goodsTd.css("display", "inline-block");
                    goodsTd.css("margin", "2px");
                    goodsTd.css("vertical-align", "middle");

                    var cId = i;
                    this.BindDemandGoodClick(cId, goodsTd, true);

                    TradeGoods.append(goodsTd);
                }






            }


        }

        showCreateTrade() {
            this.TradingShip = mainObject.currentShip;

            this.SelectedTransferAmount = TransferAmount.Ten;
            this.SelectedDemandGoodType = DemandGoodType.R;

            this.RefreshTradeOwnShips();
            this.RefreshTradeSelectedShip();
            //this.RefreshTradeTradeArea();
            this.RefreshTradeGoodsSelect();


            this.RefreshOfferSection();
            this.RefreshDemandSection();
            /*
            updateTradePortSelector(); 
            updateTradeObjectSelector();

            showTradeCreation();
            */

        }
    }

    TradeCreatePanel = new CreateTrade();
} 