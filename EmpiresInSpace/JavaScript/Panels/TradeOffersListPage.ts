module TradeOffersModule {

    var goodsWithoutOffers: number[] = []; // goodsId - Amount

    export var TradeListPanel: TradeList; //helper class for goods trade list 

    function deleteTradeOffer(tradeId: number) {
        //var xhttp = GetXmlHttpObject();
        //xhttp.open("GET", "Server/TradeTransfer.aspx?action=deleteTrade&tradeOfferId=" + tradeId.toString(), false);
        //xhttp.send("");

        $.connection.spaceHub.invoke("DeleteMyTrade", tradeId);

        delete TradeOffersModule.tradeOffers[tradeId];

        if (TradeListPanel.allTradesDiv != null) {
            TradeListPanel.showAllTrades();
        }

        //TradeOffersModule.TradeCreatePanel.showCreateTrade();
        //showTradeCreation();

    }    

    function hasArrayNegatives(_array: number[]): boolean {
        for (var i = 0; i < _array.length; i++) {
            if (_array[i] == null) continue;
            if (_array[i] < 0) return true;
        }
        return false;
    }

    function sumAllTrades(_spaceObject: SpaceObject): number[] {
        var goodsSum: number[] = []; // goodsId - Amount
        for (var i = 0; i < TradeOffersModule.tradeOffers.length; i++) {
            if (typeof TradeOffersModule.tradeOffers[i] === 'undefined') { /*Helpers.Log("undef");*/ continue; }
            if (TradeOffersModule.tradeOffers[i].creatorId != _spaceObject.id) continue;

            if (_spaceObject instanceof Ships.Ship && (TradeOffersModule.tradeOffers[i].objectType != 0)) continue;
            Helpers.addGoodsToArray(goodsSum, TradeOffersModule.tradeOffers[i].offer);
        }
        return goodsSum;
    }

    function acceptTradeOffer2(tradeOffer: TradeOffersModule.TradeOffer) {
        //removeGoodsFromArrayNegatives(_arrayToChange: number[], _arrayToGetDataFrom: number[]) {
        //check if the currently active spaceObject may accept this offer
        var trader: SpaceObject = null;
        var goodsToCheck: number[] = []; //amount on the ship. 
        if (callingObject != null) {
            Helpers.addGoodsToArray(goodsToCheck, callingObject.goods);
            Helpers.removeGoodsFromArrayNegatives(goodsToCheck, sumAllTrades(callingObject));
            Helpers.removeGoodsFromArrayNegatives(goodsToCheck, tradeOffer.request);
            if (!hasArrayNegatives(goodsToCheck)) trader = callingObject;
        }

        if (trader == null) {

            //check all own ships and colony at the position where the trade happens            
            var objectsAtNode = CommModule.commNodes[tradeOffer.commNodeId].spaceObjectsAtNode(true);
            for (var i = 0; i < objectsAtNode.length; i++) {
                goodsToCheck.length = 0;
                Helpers.addGoodsToArray(goodsToCheck, objectsAtNode[i].goods);
                Helpers.removeGoodsFromArrayNegatives(goodsToCheck, sumAllTrades(objectsAtNode[i]));
                Helpers.removeGoodsFromArrayNegatives(goodsToCheck, tradeOffer.request);

                if (!hasArrayNegatives(goodsToCheck)) {
                    trader = objectsAtNode[i];
                    break;
                }
            }
        }

        if (trader == null) {
            Helpers.Log("Nicht genug Güter vorhanden um das Angebot anzunehmen. Die verlangeten Güter müssen auf einem Schiff oder einer Kolonie sein und dürfen selbst nicht in Angeboten enthalten sein.");
            acceptTradeFailed(-10);
            return;
        }

        Helpers.Log('acceptTradeOffer + ' + tradeOffer.id.toString());


        $('#loader')[0].style.display = 'block';

        $.ajax({
            url: "Server/TradeTransfer.aspx",
            type: "GET",
            data: {
                'action': 'acceptTrade',
                'tradeId': tradeOffer.id.toString(),
                'soId': trader.id,
                'soType': trader instanceof Ships.Ship ? 0 : 1,
                'receiverId': tradeOffer.creatorId.toString(),
                'receiverType': tradeOffer.objectType.toString()
            },
            dataType: 'Text',
            success: function (data: string, textStatus, jqXHR) {
                Helpers.Log(" acceptTradeOffer success");
                $('#loader')[0].style.display = 'none';

                if (data == null || data == '' || data != '1') {
                    Helpers.Log('no result / result is null : ' + data);
                    acceptTradeFailed(parseInt(data, 10));
                    return;
                }
                /*
                Helpers.addGoodsToArray(trader.goods, TradeOffersModule.tradeOffers[tradeOffer.id].offer);
                Helpers.removeGoodsFromArrayNegatives(trader.goods, TradeOffersModule.tradeOffers[tradeOffer.id].request);

                if (tradeOffer.getTrader() != null) {
                    Helpers.removeGoodsFromArrayNegatives(tradeOffer.getTrader().goods, TradeOffersModule.tradeOffers[tradeOffer.id].offer);
                    Helpers.addGoodsToArray(tradeOffer.getTrader().goods, TradeOffersModule.tradeOffers[tradeOffer.id].request);
                }

                delete TradeOffersModule.tradeOffers[tradeOffer.id];
                */
                tradeOffer.acceptedBy(trader);
                //showTradeCreation();

                TradeListPanel.showAllTrades();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Helpers.Log(errorThrown);
                Helpers.Log(" acceptTradeOffer error");
                acceptTradeFailed(0);
                $('#loader')[0].style.display = 'none';
            }
        });
    }


    function acceptTradeOffer(tradeOffer: TradeOffersModule.TradeOffer) {
        $.connection.spaceHub.invoke("AcceptTrade", tradeOffer.id, TradeOffersModule.TradeListPanel.PayoutLocationCommNodeId);

        //console.log("AcceptTrade " +  tradeOffer.id + ' ' + TradeOffersModule.TradeListPanel.PayoutLocationCommNodeId);
        //Helpers.Log(json, Helpers.LogType.Trade);

        delete TradeOffersModule.tradeOffers[tradeOffer.id];

        //new cargo data is received by WebSocket...

        if (TradeListPanel.allTradesDiv != null) {
            TradeListPanel.showAllTrades();
        }  

        mainInterface.refreshQuickInfoGoods();

    }

    function acceptTradeFailed(failureCode: number) {

        var newNameContainer = ElementGenerator.createPopup();
        ElementGenerator.adjustPopupZIndex(newNameContainer, 20000);
        var body = $('.relPopupBody', newNameContainer);

        var caption = $('<h4/>', { text: "Fehlgeschlagen " + failureCode.toString() });
        $(".relPopupHeader", newNameContainer).append(caption);

        body.append($("<br>")).append($("<br>"));

        var failedText = $('<span/>', { text: "Fehlgeschlagen..." });
        body.append(failedText);

        ElementGenerator.makeSmall(newNameContainer);

        $(".buttonUl", newNameContainer).css("right", "-10px")
            $('.noButton', newNameContainer).click((e: JQueryEventObject) => {
            newNameContainer.remove();
        });
        $('.noButton', newNameContainer).css('display', 'none');
        $('.yesButton span', newNameContainer).text('OK');
        newNameContainer.appendTo("body"); //attach to the <body> element


        $('.yesButton', newNameContainer).click((e: JQueryEventObject) => {

            newNameContainer.remove();

        });

    }

    export function createTableLine(tradeOffer: TradeOffer, useFilter: boolean): JQuery {
        var foundGoodInOffer = true;
        var offerFilterInt = parseInt(TradeOffersModule.TradeListPanel.offerFilter, 10);
        var foundGoodInRequest = true;
        var requestFilterInt = parseInt(TradeOffersModule.TradeListPanel.requestFilter, 10);

        if (useFilter) {
            //User
            switch (TradeOffersModule.TradeListPanel.userFilter) {
                case '0':
                    break;
                case '5':
                    if (tradeOffer.userId != mainObject.user.id) return null;
                    break;
                default:
                    if (mainObject.user.otherUserExists(tradeOffer.userId) && mainObject.user.otherUserFind(tradeOffer.userId).currentRelation < parseInt(TradeOffersModule.TradeListPanel.userFilter, 10)) return null;
                    break;
            }

            //offered
            if (TradeOffersModule.TradeListPanel.offerFilter != '-1') {
                var foundGoodInOffer = false;
            }

            //Required
            if (TradeOffersModule.TradeListPanel.requestFilter != '-2') {
                var foundGoodInRequest = false;
            }
        }

        var tableRow = $('<tr/>');
        var userName = (PlayerData.existsUser(tradeOffer.userId)) ? PlayerData.findUser(tradeOffer.userId).shortTagFreeName() : 'ErrorNotMetYet';
        //userName = tradeOffer.userId.toString() + ' ' + userName;
        var userSpan = $('<span/>', { text: userName });
        //userSpan.css("font-size", "1px");
        var tableDataId = $('<td/>', { "class": "firstchild tdTextLeft" });
        tableDataId.append(userSpan);
        
        //namesPerhapsToBig.push(tableDataId);

        tableRow.append(tableDataId);


        var offeredGoods = $('<td/>');
        offeredGoods.css("padding", "4px");
        offeredGoods.css("max-width", "300px");
        
        
        //var TradeTradeAreaOfferText = $('<div/>', { "class": "TradeLine", "text": i18n.label(190) }); //Offer
        var TradeTradeAreaOfferArea = $('<div/>', { "class": "TradeLineGoodsArea BorderBox goodsOverflow" });
        //offeredGoods.append(TradeTradeAreaOfferText).append(TradeTradeAreaOfferArea); 
        offeredGoods.append(TradeTradeAreaOfferArea); 

        for (var goodsIndex = 0; goodsIndex < tradeOffer.offer.length; goodsIndex++) {
            if (tradeOffer.offer[goodsIndex] == null) continue;
            if (offerFilterInt == goodsIndex) foundGoodInOffer = true;


            goodsWithoutOffers[goodsIndex] -= tradeOffer.offer[goodsIndex];

            var goodsDiv = mainInterface.createGoodsDiv(goodsIndex, tradeOffer.offer[goodsIndex]);
            //goodsDiv.addClass("floatLeft");
            goodsDiv.css("display", "inline-block");
            goodsDiv.css("margin", "2px");
            TradeTradeAreaOfferArea.append(goodsDiv);
        }
        if (!foundGoodInOffer) return null;
        tableRow.append(offeredGoods);

        

        var requiredGoods = $('<td/>');
        requiredGoods.css("max-width", "300px");

        var TradeTradeAreaDemandArea = $('<div/>', { "class": "TradeLineGoodsArea BorderBox goodsOverflow" });
        requiredGoods.append(TradeTradeAreaDemandArea); 

        tradeOffer.Acceptable = true;
      
        for (var goodsIndex = 0; goodsIndex < tradeOffer.request.length; goodsIndex++) {
            if (tradeOffer.request[goodsIndex] == null) continue;
            if (requestFilterInt == goodsIndex) foundGoodInRequest = true;

            var goodsDiv = mainInterface.createGoodsDiv(goodsIndex, tradeOffer.request[goodsIndex]);
            goodsDiv.css("display", "inline-block");
            goodsDiv.css("margin", "2px");
            TradeTradeAreaDemandArea.append(goodsDiv);

            if (!TradeOffersModule.TradeListPanel.goodsAvailable[goodsIndex]
                || TradeOffersModule.TradeListPanel.goodsAvailable[goodsIndex] < tradeOffer.request[goodsIndex]) {
                tradeOffer.Acceptable = false;
            }


        }
        if (!foundGoodInRequest) return null;
        tableRow.append(requiredGoods);

        if (TradeOffersModule.TradeListPanel.PayoutLocationCommNode && TradeOffersModule.TradeListPanel.PayoutLocationCommNode.overallCargoRoom < BaseDataModule.GoodsArraySize(tradeOffer.offer )) {
            tradeOffer.Acceptable = false;
        }

        //"class": "tdTextRight"
        var action = mainObject.user.id == tradeOffer.userId ? i18n.label(195) : i18n.label(194);
        var tableDataAction = $('<td/>', { "class": "lastchild" });
        var button = $('<button/>', { text: action });
        button.css("float", "right");
        tableDataAction.append(button);
        button.button();
        if (!tradeOffer.Acceptable && tradeOffer.userId != mainObject.user.id) {
            button.button("disable");
        }

        if (mainObject.user.id == tradeOffer.userId) {
            button.click(
                function (event, ui) {
                    Helpers.Log("del");
                    deleteTradeOffer(tradeOffer.id);
                });
        }
        else {
            button.click(
                function (event, ui) {
                    Helpers.Log("acc");
                    acceptTradeOffer(tradeOffer);
                    //deleteTradeOffer(tradeOffer.id);
                });
        }



        //deleteTradeOffer
        tableRow.append(tableDataAction);

        tableRow.find("span").addClass("restoreBackground");
        return tableRow;
    }

    export class TradeList {

        allTradesDiv: JQuery;        
        

        userFilter: string = "0"; //all users
        offerFilter: string = "-1"; // all goods that are offered        
        requestFilter: string = "-2"; // all goods that are requested (-1 is "only acceptable"/payable)
        
        goodsAvailable: number[] = []; // all goods from the player at all locations that are not in sales offers

        PayoutLocationCommNodeId: number = null; 
        PayoutLocationCommNode: CommModule.CommNode = null;

        //calcs the cargoroom and offers of the player for each trading post

        initTradingPosts() {

            for (var i = 0; i < CommModule.commNodes.length; i++) {
                if (typeof CommModule.commNodes[i] === 'undefined') { /*Helpers.Log("undef");*/ continue; }
                if (!CommModule.commNodes[i].visited) { /*Helpers.Log("not visited yet");*/ continue; }

                //CommModule.commNodes[i].goodsAvailable = [];
                CommModule.commNodes[i].goodsOverall = [];
                CommModule.commNodes[i].overallCargoRoom = 0;

                var tileToCheck: Tile;

                //cycle through all own ships at this commNode
                var galaxyColrRow: ColRow = { col: CommModule.commNodes[i].positionX, row: CommModule.commNodes[i].positionY };
                if (!galaxyMap.tilemap.tileExist(galaxyColrRow)) continue;

                var galaxyTile = <GalaxyTile> galaxyMap.tilemap.findCreateTile(galaxyColrRow);


                if (CommModule.commNodes[i].systemX != 0 && CommModule.commNodes[i].systemY != 0) {
                    if (galaxyTile.astronomicalObject == null) continue;
                    var systemColRow: ColRow = { col: CommModule.commNodes[i].systemX, row: CommModule.commNodes[i].systemY };
                    if (!galaxyTile.astronomicalObject.tilemap.tileExist(systemColRow)) continue;

                    tileToCheck = galaxyTile.astronomicalObject.tilemap.findCreateTile(systemColRow);
                } else {
                    tileToCheck = galaxyTile;
                }

                //tile was found, now check objects on tile:
                for (var j = 0; j < tileToCheck.ships.length; j++) {
                    if (typeof tileToCheck.ships[j] === 'undefined') { continue; }
                    if (tileToCheck.ships[j].owner != mainObject.user.id) continue;
                    tileToCheck.ships[j].addCargoToArray(CommModule.commNodes[i].goodsOverall);
                    tileToCheck.ships[j].addCargoToArray(this.goodsAvailable);

                    CommModule.commNodes[i].overallCargoRoom += (tileToCheck.ships[j].cargoroom - tileToCheck.ships[j].countCargo()) ;                    
                }

                //copy goodsOverall to goodAvailable
                /*
                for (var j = 0; j < CommModule.commNodes[i].goodsOverall.length; j++) {
                    if (typeof CommModule.commNodes[i].goodsOverall[j] === 'undefined') { continue; }

                    CommModule.commNodes[i].goodsAvailable[j] = CommModule.commNodes[i].goodsOverall[j];
                }
                */
                

            }

            //cycle through all own offers 
            //ToDo - performace could be improved by running through the array only once
            for (var j = 0; j < TradeOffersModule.tradeOffers.length; j++) {
                if (typeof TradeOffersModule.tradeOffers[j] === 'undefined') { continue; }              
                if (TradeOffersModule.tradeOffers[j].userId != mainObject.user.id) continue;

                //Helpers.removeGoodsFromArray(CommModule.commNodes[i].goodsAvailable, TradeOffersModule.tradeOffers[j].offer);
                Helpers.removeGoodsFromArray(this.goodsAvailable, TradeOffersModule.tradeOffers[j].offer);
            }

        }

        createGoodsAndPayoutSelector(): JQuery {
            //
            var TradeGoodsAndLocation = $('<div/>', { "class": "TradeGoodsAndLocation BorderBox LeftPanelBox" });
            var TradeGoodstext = $('<div/>', { "class": "TradeGoodsText", "text": i18n.label(986) }); //Your available goods
            var TradeGoodsAtLocations = $('<div/>', { "class": "TradeGoodsAtLocations" });
            TradeGoodsAndLocation.append(TradeGoodstext).append(TradeGoodsAtLocations);

            //Goods:
            for (var currentGoodsIndex = 0; currentGoodsIndex < mainObject.goods.length; currentGoodsIndex++) {
                if (!this.goodsAvailable[currentGoodsIndex]) continue;
                if (mainObject.goods[currentGoodsIndex].goodsType == 3) continue;

                var currentGoodsDiv = DrawInterface.createGoodsDiv(currentGoodsIndex, this.goodsAvailable[currentGoodsIndex], null, null, true, true);
                currentGoodsDiv.css("display", "inline-block");
                currentGoodsDiv.css("margin", "2px");
                currentGoodsDiv.css("vertical-align", "middle");

                DrawInterface.tooltipGoods(currentGoodsDiv, currentGoodsIndex, [], null, null);

                TradeGoodsAtLocations.append(currentGoodsDiv);
            }

            var SelectorDiv = $('<div/>', { "class": "TradeGoodsText TradeSelectorDiv " }); 
            TradeGoodsAndLocation.append(SelectorDiv);
            SelectorDiv.append($('<span/>', { "text": i18n.label(987) })); //"Trade payout location: "
            //Location Selector
            var LocationSelector = $('<select/>');

            var highestCargoCapacitiy = 0;
            var highestCargoCapacitiyNode: JQuery = null;

            for (var i = 0; i < CommModule.commNodes.length; i++) {
                if (typeof CommModule.commNodes[i] === 'undefined') { /*Helpers.Log("undef");*/ continue; }
                if (!CommModule.commNodes[i].visited) { /*Helpers.Log("not visited yet");*/ continue; }
                if (CommModule.commNodes[i].overallCargoRoom <= 0) { /*Helpers.Log("undef");*/ continue; }

                var option = $('<option/>', { text: CommModule.commNodes[i].name + ' -  Cargo capacity: ' + CommModule.commNodes[i].overallCargoRoom.toString() });
                option.data('CommNode', CommModule.commNodes[i].id );
                LocationSelector.append(option);

                if (CommModule.commNodes[i].overallCargoRoom > highestCargoCapacitiy) {
                    highestCargoCapacitiy = CommModule.commNodes[i].overallCargoRoom;
                    highestCargoCapacitiyNode = option;
                }
            } 

            if (highestCargoCapacitiyNode) {
                highestCargoCapacitiyNode.attr('selected', 'selected');
                TradeOffersModule.TradeListPanel.PayoutLocationCommNodeId = parseInt(highestCargoCapacitiyNode.data('CommNode'));

                TradeOffersModule.TradeListPanel.PayoutLocationCommNode = CommModule.commNodes[TradeOffersModule.TradeListPanel.PayoutLocationCommNodeId];                
            }

            SelectorDiv.append(LocationSelector);

            return TradeGoodsAndLocation;
        }

        showAllTrades() {
            this.allTradesDiv.empty();            

            var GoodsSelectPanel = this.createGoodsAndPayoutSelector();
            this.allTradesDiv.append(GoodsSelectPanel);

            //Todo any

            $("select", GoodsSelectPanel).selectmenu(<any>{
                change: (event: Event, ui) => {
                    //console.log($(ui.item.element).data('CommNode'));
                    //Helpers.Log(json, Helpers.LogType.Trade);

                    TradeOffersModule.TradeListPanel.PayoutLocationCommNodeId = parseInt($(ui.item.element).data('CommNode'));
                    TradeOffersModule.TradeListPanel.PayoutLocationCommNode = CommModule.commNodes[TradeOffersModule.TradeListPanel.PayoutLocationCommNodeId];
                },
                width: 300
            }).selectmenu("menuWidget")
                .addClass("SelectmenuHeight");
          


            var buildTable = $('<table/>', { "cellspacing": 0 });// , style:"border-collapse: collapse;"
            //buildTable.css("background-color","#888888");

            var addRow = false;

            buildTable.append(this.createFilterLine());
            var spacer = $('<tr/>', { "class": "TRspacer" });
            buildTable.append(spacer);
            var makeGray = false;
            for (var i = TradeOffersModule.tradeOffers.length; i > 0; i--) {
                if (typeof TradeOffersModule.tradeOffers[i] === 'undefined') { /*Helpers.Log("undef");*/ continue; }


                (function createLineClosure(tradeOffer: TradeOffer) {
                    //create a empty TR  , so that we have a little Sapce between the TRs                

                    //var spacer = $('<tr/>', { "class": "TRspacer" });
                    //buildTable.append(spacer);


                    var tableRow = TradeOffersModule.createTableLine(tradeOffer, true);
                    if (tableRow == null) return; //if the filters permit the row, null is returned
                    if (makeGray) {
                        tableRow.find("td").addClass("SecondLineBackground");
                        makeGray = false;
                    } else {
                        makeGray = true;
                    }
                    //if (research.researchable) {
                    //    tableRow.click((e) => { researchSelected(research); researchPanel.remove(); showResearchPanel(); });
                    // }
                    buildTable.append(tableRow);

                    tradeOffer.OfferElement = tableRow;

                })(TradeOffersModule.tradeOffers[i]);
            }
            //var spacer2 = $('<tr/>', { "class": "TRspacer" });
            //buildTable.append(spacer2);

            this.allTradesDiv.append(buildTable);
            //namesPerhapsToBig.forEach((value: any, index: number) => { value.textfill({ "maxFontPixels": 16, "widthOnly": false }); });
        }

        



        createFilterLine(): JQuery {

            var tableRow = $('<tr/>');

            //Seller + Filter
            var selectorSeller = $('<select/>');
            var option0 = $('<option/>', { text: i18n.label(196) });
            var option1 = $('<option/>', { text: mainObject.relationTypes[1].name });
            var option2 = $('<option/>', { text: mainObject.relationTypes[2].name });
            var option3 = $('<option/>', { text: mainObject.relationTypes[3].name });
            var option4 = $('<option/>', { text: mainObject.relationTypes[4].name });
            var option5 = $('<option/>', { text: i18n.label(542) });

            option0.val("0");
            if (this.userFilter == "0") option0.attr('selected', 'selected');
            option1.val("1");
            if (this.userFilter == "1") option1.attr('selected', 'selected');
            option2.val("2");
            if (this.userFilter == "2") option2.attr('selected', 'selected');
            option3.val("3");
            if (this.userFilter == "3") option3.attr('selected', 'selected');
            option4.val("4");
            if (this.userFilter == "4") option4.attr('selected', 'selected');
            option5.val("5");
            if (this.userFilter == "5") option4.attr('selected', 'selected');

            selectorSeller.append(option0);
            selectorSeller.append(option1);
            selectorSeller.append(option2);
            selectorSeller.append(option3);
            selectorSeller.append(option4);
            selectorSeller.append(option5);

            var userDiv = $("<div>");
            userDiv.append($("<span>", { text: i18n.label(189) })).append($("<br>")).append(selectorSeller);
            var tableDataId = $('<th/>', { "class": "tdTextLeft" });
            tableDataId.append(userDiv);
            tableDataId.css("width", "150px");
            tableDataId.find("*").css("width", "150px");
            tableRow.append(tableDataId);

            /*
            selectorSeller.change((e: Event) => {
                this.userFilter = selectorSeller.val();
                this.showAllTrades();
            });
            */
            selectorSeller.selectmenu({
                change: (event: Event, ui) => {
                    this.userFilter = ui.item.value;
                    this.showAllTrades();
                }
            });



            //Offer + Filter 
            var selectorOffer = $('<select/>');
            var optionOfferAll = $('<option/>', { text: i18n.label(196) });
            optionOfferAll.val('-1');
            if (this.offerFilter == '-1') optionOfferAll.attr('selected', 'selected');


            selectorOffer.append(optionOfferAll);
            var lineCount = 0;
            for (var i = 0; i < mainObject.goods.length; i++) {
                if (mainObject.goods[i] == null) continue;
                if (mainObject.goods[i].goodsType === 3) continue;

                lineCount++;
                var imageSource = mainObject.imageObjects[mainObject.goods[i].goodsObjectId].texture.src;       
                var newOption = $('<option/>', { text: i18n.label(mainObject.goods[i].label) }).val(i.toString());
                if (this.offerFilter == i.toString()) newOption.attr('selected', 'selected');
                selectorOffer.append(newOption);
                newOption.attr('data-class', 'ShipModule');                
                newOption.attr('data-style', 'background-image: url(' + imageSource + ')');
                if (lineCount % 2 != 0) newOption.attr('data-lineSwitch', 'lineSwitch');
            }

            var offerDiv = $("<div>");
            offerDiv.append($("<span>", { text: i18n.label(190) })).append($("<br>")).append(selectorOffer);
            var tableDataOffer = $('<th/>', { "class": "tdTextLeft" });
            tableDataOffer.append(offerDiv);
            tableDataOffer.css("width", "150px");
            tableDataOffer.find("*").css("width", "150px");
            tableRow.append(tableDataOffer);

            /*
            selectorOffer.change((e: Event) => {
                this.offerFilter = selectorOffer.val();
                this.showAllTrades();
            });
            */

            /*
            selectorOffer.selectmenu({
                change: (event: Event, ui) => {
                    this.offerFilter = ui.item.value;
                    this.showAllTrades();
                }
            }).selectmenu("menuWidget")
                .addClass("SelectmenuHeight");
            */
            selectorOffer.iconselectmenu({
                change: (event: Event, ui) => {
                    this.offerFilter = ui.item.value;
                    this.showAllTrades();
                }
            }).iconselectmenu("menuWidget")
                .addClass("ui-menu-icons ShipModule SelectmenuHeight");

               
                //



            //Request
            var selectorRequest = $('<select/>');
            var optionRequestAll = $('<option/>', { text: i18n.label(196) });
            optionRequestAll.val('-2');
            if (this.requestFilter == '-2') optionRequestAll.attr('selected', 'selected');
            selectorRequest.append(optionRequestAll);

            /* //ToDo - show only payable as a filter
            var optionRequestPossible = $('<option/>', { text: 'Bezahlbare' });        
            optionRequestPossible.val('-1');
            if (requestFilter == '-1') optionRequestPossible.attr('selected', 'selected');
            selectorRequest.append(optionRequestPossible);
            */

            lineCount = 0;
            for (var i = 0; i < mainObject.goods.length; i++) {
                if (mainObject.goods[i] == null) continue;
                if (mainObject.goods[i].goodsType === 3) continue;

                lineCount++;
                var imageSource = mainObject.imageObjects[mainObject.goods[i].goodsObjectId].texture.src;       
                var newOption = $('<option/>', { text: i18n.label(mainObject.goods[i].label) }).val(i.toString());
                if (this.requestFilter == i.toString()) newOption.attr('selected', 'selected');
                selectorRequest.append(newOption);
                newOption.attr('data-class', 'ShipModule');
                newOption.attr('data-style', 'background-image: url(' + imageSource + ')');
                if (lineCount % 2 != 0) newOption.attr('data-lineSwitch', 'lineSwitch');
               
            }
            var requestDiv = $("<div>");
            requestDiv.append($("<span>", { text: i18n.label(191) })).append($("<br>")).append(selectorRequest);
            var tableDataReq = $('<th/>', { "class": "tdTextLeft" });
            tableDataReq.append(requestDiv);
            tableDataReq.css("text-align", "right");
            tableDataReq.css("width", "150px");
            tableDataReq.find("*").css("width", "150px");
            tableRow.append(tableDataReq);
            /*
            selectorRequest.change((e: Event) => {
                this.requestFilter = selectorRequest.val();
                this.showAllTrades();
            });
            */
            /*
            selectorRequest.selectmenu({
                change: (event: Event, ui) => {
                    this.requestFilter = ui.item.value;
                    this.showAllTrades();
                }
            }).selectmenu("menuWidget")
                .addClass("SelectmenuHeight");
            */
            selectorRequest.iconselectmenu({
                change: (event: Event, ui) => {
                    this.requestFilter = ui.item.value;
                    this.showAllTrades();
                }
            }).iconselectmenu("menuWidget")
                .addClass("ui-menu-icons ShipModule SelectmenuHeight");

            //Action
            //var tableDataAction = $('<th/>', { text: i18n.label(193) });
            var tableDataAction = $('<th/>');
            tableDataAction.css("width", "50px");
            tableRow.append(tableDataAction);


            return tableRow;
        }


       

   
    }

    TradeListPanel = new TradeList();
}