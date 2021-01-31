//second part is in scripts/TradeoffersForm.ts
var TradeOffersModule;
(function (TradeOffersModule) {
    TradeOffersModule.tradeOffers = [];
    var TradeOffer = /** @class */ (function () {
        function TradeOffer(id) {
            this.id = id;
            this.offer = [];
            this.request = [];
            //needed by TradeOffersForm - these are changed when the user wants to see only trade offers that are acceptable
            this.calculated = false;
            this.covered = false;
            this.OfferElement = null;
            this.Acceptable = false; //True if the user has enough goods at trade ports to accept the offer
        }
        TradeOffer.prototype.update = function (XMLmessage) {
            var creatorId = XMLmessage.getElementsByTagName("spaceObjectId")[0].childNodes[0].nodeValue;
            var objectType = XMLmessage.getElementsByTagName("spaceObjectType")[0].childNodes[0].nodeValue;
            var commNodeId = XMLmessage.getElementsByTagName("commNodeId")[0].childNodes[0].nodeValue;
            var userId = XMLmessage.getElementsByTagName("userId")[0].childNodes[0].nodeValue;
            this.creatorId = parseInt(creatorId, 10);
            this.objectType = parseInt(objectType, 10);
            this.commNodeId = parseInt(commNodeId, 10);
            this.userId = parseInt(userId, 10);
            this.offer = [];
            var XMLgoods = XMLmessage.getElementsByTagName("offered");
            var length = XMLgoods.length;
            for (var i = 0; i < length; i++) {
                var id = XMLgoods[i].getElementsByTagName("goodsId")[0].childNodes[0].nodeValue;
                var amount = XMLgoods[i].getElementsByTagName("amount")[0].childNodes[0].nodeValue;
                this.offer[id] = parseInt(amount);
            }
            this.request = [];
            var XMLgoods = XMLmessage.getElementsByTagName("requested");
            var length = XMLgoods.length;
            for (var i = 0; i < length; i++) {
                var id = XMLgoods[i].getElementsByTagName("goodsId")[0].childNodes[0].nodeValue;
                var amount = XMLgoods[i].getElementsByTagName("amount")[0].childNodes[0].nodeValue;
                this.request[id] = parseInt(amount);
            }
            if (this.userId === mainObject.user.id && this.objectType === 0) {
                mainObject.shipFind(this.creatorId).hasTradeOffers = true;
            }
        };
        TradeOffer.prototype.UpdateFromObject = function (JSONobject) {
            var CommNodeId = parseInt(JSONobject["commNodeId"]);
            var SpaceObjectId = parseInt(JSONobject["spaceObjectId"]);
            var SpaceObjectType = parseInt(JSONobject["spaceObjectType"]);
            var UserId = parseInt(JSONobject["userId"]);
            this.commNodeId = CommNodeId;
            this.creatorId = SpaceObjectId;
            this.objectType = SpaceObjectType;
            this.userId = UserId;
            this.offer = [];
            for (var i = 0; i < JSONobject["offered"].length; i++) {
                this.offer[JSONobject["offered"][i]["goodsId"]] = JSONobject["offered"][i]["amount"];
            }
            this.request = [];
            for (var i = 0; i < JSONobject["requested"].length; i++) {
                this.request[JSONobject["requested"][i]["goodsId"]] = JSONobject["requested"][i]["amount"];
            }
            if (this.userId === mainObject.user.id && this.objectType === 0) {
                mainObject.shipFind(this.creatorId).hasTradeOffers = true;
            }
        };
        TradeOffer.prototype.deleteTradeOffer = function () {
            this.offer.length = 0;
            this.request.length = 0;
        };
        TradeOffer.prototype.getTrader = function () {
            if (this.objectType == 1)
                return mainObject.coloniesById[this.creatorId];
            if (this.objectType == 0)
                return mainObject.ships[this.creatorId];
        };
        TradeOffer.prototype.acceptedBy = function (spaceObject, shipId) {
            if (spaceObject != null) {
                Helpers.addGoodsToArray(spaceObject.goods, this.offer);
                Helpers.removeGoodsFromArrayNegatives(spaceObject.goods, this.request);
            }
            else {
                //ToDo - get the trader data...
                Helpers.Log("getSpaceObject  " + shipId && shipId.toString() || 'n');
            }
            if (this.getTrader() != null) {
                Helpers.removeGoodsFromArrayNegatives(this.getTrader().goods, this.offer);
                Helpers.addGoodsToArray(this.getTrader().goods, this.request);
            }
            delete TradeOffersModule.tradeOffers[this.id];
        };
        return TradeOffer;
    }());
    TradeOffersModule.TradeOffer = TradeOffer;
    function tradeOfferExists(id) {
        if (TradeOffersModule.tradeOffers[id] != null)
            return true;
        else
            return false;
    }
    TradeOffersModule.tradeOfferExists = tradeOfferExists;
    function getTradeOffer(id) {
        if (!tradeOfferExists(id))
            return null;
        return TradeOffersModule.tradeOffers[id];
    }
    TradeOffersModule.getTradeOffer = getTradeOffer;
    var tradeOfferAdd = function (XMLTradeOffer) {
        var id = parseInt(XMLTradeOffer.getElementsByTagName("tradeOfferId")[0].childNodes[0].nodeValue);
        var newTradeOffer = new TradeOffer(id);
        TradeOffersModule.tradeOffers[id] = newTradeOffer;
        newTradeOffer.update(XMLTradeOffer);
    };
    var createUpdateTradeOffer = function (XMLTradeOffer) {
        var id = parseInt(XMLTradeOffer.getElementsByTagName("tradeOfferId")[0].childNodes[0].nodeValue);
        if (tradeOfferExists(id))
            TradeOffersModule.tradeOffers[id].update(XMLTradeOffer);
        else
            tradeOfferAdd(XMLTradeOffer);
    };
    function getTradeOfferFromXML(responseXML) {
        TradeOffersModule.tradeOffers.length = 0;
        updateTradeOfferFromXML(responseXML);
    }
    TradeOffersModule.getTradeOfferFromXML = getTradeOfferFromXML;
    function updateTradeOfferFromXML(responseXML) {
        var XMLTradeOffer = responseXML.getElementsByTagName("TradeOffer");
        var length = XMLTradeOffer.length;
        for (var i = 0; i < length; i++) {
            createUpdateTradeOffer(XMLTradeOffer[i]);
        }
        Helpers.Log(length + " TradeOffer added or updated");
    }
    TradeOffersModule.updateTradeOfferFromXML = updateTradeOfferFromXML;
    function createTradeOffer(tradingShip, offeredGoods, demandedGoods) {
        var DenseOfferedGoods = [];
        for (var i = 0; i < offeredGoods.length; i++) {
            if (!offeredGoods[i])
                continue;
            DenseOfferedGoods.push({ "goodsId": i, "amount": offeredGoods[i] });
        }
        var DenseRequestedGoods = [];
        for (var i = 0; i < demandedGoods.length; i++) {
            if (!demandedGoods[i])
                continue;
            DenseRequestedGoods.push({ "goodsId": i, "amount": demandedGoods[i] });
        }
        $.connection.spaceHub.invoke("CreateTrade", tradingShip.id, 0, DenseOfferedGoods, DenseRequestedGoods).done(function (e) {
            //Helpers.Log('2 FetchShip ' + shipId, Helpers.LogType.DataUpdate);            
            //console.log(e);
            if (!e["Offer"]) {
                Helpers.Log('3 CreateTrade did sent empty return for Offer :' + tradingShip.id, Helpers.LogType.DataUpdate);
                Helpers.Log('3 CreateTrade did not succeed...', Helpers.LogType.DataUpdate);
                return;
            }
            var json = $.parseJSON(e["Offer"]);
            var SuccessPanel = ElementGenerator.createPopupWindow(1, false, null);
            var SuccessPanelElement = SuccessPanel.element;
            $('.yesButton', SuccessPanelElement).click(function (e) { SuccessPanelElement.remove(); });
            var panelHeader = $('.relPopupHeader', SuccessPanelElement);
            var caption = $('<h2/>', { text: i18n.label(990), style: "float:left" }); //Offer Created
            panelHeader.append(caption);
            var panelBody = $('.relPopupBody', SuccessPanelElement);
            panelBody.removeClass("trHighlight").addClass("tdHighlight");
            var text = $('<p/>', { "text": i18n.label(991) }); //Your offer was created and is now available on the trading network.
            panelBody.append(text);
            var text2 = $('<p/>', { "text": i18n.label(992) }); //Your offer:
            panelBody.append(text2);
            var OfferedGoods = $('<div/>', { "class": "TradeLineGoodsArea BorderBox goodsOverflow" });
            //offeredGoods.append(TradeTradeAreaOfferText).append(TradeTradeAreaOfferArea); 
            panelBody.append(OfferedGoods);
            for (var offerIndex = 0; offerIndex < json["offered"].length; offerIndex++) {
                if (json["offered"][offerIndex] == null)
                    continue;
                var goodsDiv = mainInterface.createGoodsDiv(json["offered"][offerIndex]["goodsId"], json["offered"][offerIndex]["amount"]);
                //goodsDiv.addClass("floatLeft");
                goodsDiv.css("display", "inline-block");
                goodsDiv.css("margin", "2px");
                OfferedGoods.append(goodsDiv);
            }
            var text3 = $('<p/>', { "text": i18n.label(993) }); //Your demand:
            panelBody.append(text3);
            var DemandedGoods = $('<div/>', { "class": "TradeLineGoodsArea BorderBox goodsOverflow" });
            //offeredGoods.append(TradeTradeAreaOfferText).append(TradeTradeAreaOfferArea); 
            panelBody.append(DemandedGoods);
            for (var offerIndex = 0; offerIndex < json["requested"].length; offerIndex++) {
                if (json["requested"][offerIndex] == null)
                    continue;
                var goodsDiv = mainInterface.createGoodsDiv(json["requested"][offerIndex]["goodsId"], json["requested"][offerIndex]["amount"]);
                //goodsDiv.addClass("floatLeft");
                goodsDiv.css("display", "inline-block");
                goodsDiv.css("margin", "2px");
                DemandedGoods.append(goodsDiv);
            }
            SuccessPanelElement.appendTo("body"); //attach to the <body> element
        });
        return;
    }
    TradeOffersModule.createTradeOffer = createTradeOffer;
    function SendNewTrade(tradeOffer) {
        if (!tradeOffer["NewTradeOffer"]) {
            Helpers.Log('3 SendNewTrade did sent empty value', Helpers.LogType.DataUpdate);
            return;
        }
        var json = $.parseJSON(tradeOffer["NewTradeOffer"]);
        Helpers.Log(json, Helpers.LogType.Trade);
        var NewTrade = null;
        var TradeId = json["tradeOfferId"];
        if (tradeOfferExists(TradeId))
            NewTrade = TradeOffersModule.tradeOffers[TradeId];
        else {
            NewTrade = new TradeOffer(TradeId);
            TradeOffersModule.tradeOffers[TradeId] = NewTrade;
        }
        NewTrade.UpdateFromObject(json);
        if (TradeOffersModule.TradeListPanel.allTradesDiv != null) {
            TradeOffersModule.TradeListPanel.showAllTrades();
        }
        /*
        if (mainObject.shipExists(DummyShip.id)) // if ship exists, update it.
            Ships.ApplyDummyToReal(DummyShip);
        else {
            // if ships does not yet exists, add it
            var newShip = new Ships.Ship(DummyShip.id);
            newShip.typeId = 400;        //typeId references objecttTypes (imageObject)
            newShip.updateAreaById(DummyShip.systemId);

            //add to ship array
            mainObject.ships[mainObject.parseInt(DummyShip.id)] = newShip;
            Ships.ApplyDummyToReal(DummyShip);

            //add scan Range
            if (newShip.owner == mainObject.user.id) newShip.addScanrange();
        }

        DrawInterface.ScreenUpdate = true;
        */
    }
    TradeOffersModule.SendNewTrade = SendNewTrade;
    function DeleteTrade(tradeId) {
        if (tradeOfferExists(tradeId)) {
            if (TradeOffersModule.tradeOffers[tradeId].OfferElement != null) {
                $('#loader')[0].style.display = 'block';
                TradeOffersModule.tradeOffers[tradeId].OfferElement.remove();
                DrawInterface.HideLoader();
            }
            delete TradeOffersModule.tradeOffers[tradeId];
        }
    }
    TradeOffersModule.DeleteTrade = DeleteTrade;
})(TradeOffersModule || (TradeOffersModule = {}));
//# sourceMappingURL=TradeOffers.js.map