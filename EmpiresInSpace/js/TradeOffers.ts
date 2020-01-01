
//second part is in scripts/TradeoffersForm.ts
module TradeOffersModule {

    export var callingObject: SpaceObject;
    export var callingAtTradeport: CommModule.CommNode;
    export var tradeOffers: TradeOffer[] = [];    
     
    export class TradeOffer {

        userId: number;
        creatorId: number; //ship or colonyid 
        objectType: number; //0 Ship, 1 Colony
        creator : SpaceObject;  //Ship or Colony
        commNodeId: number;

        offer : number[] = [];
        request: number[] = [];

        //needed by TradeOffersForm - these are changed when the user wants to see only trade offers that are acceptable
        calculated: boolean = false;
        covered: boolean = false;

        OfferElement: JQuery = null;
        Acceptable: boolean = false; //True if the user has enough goods at trade ports to accept the offer


        constructor(public id: number) {
        }

        update(XMLmessage) {
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
        }

        UpdateFromObject(JSONobject: any) {
            var CommNodeId: number =  parseInt(JSONobject["commNodeId"]);
            var SpaceObjectId: number = parseInt(JSONobject["spaceObjectId"]);
            var SpaceObjectType: number = parseInt(JSONobject["spaceObjectType"]);
            var UserId: number = parseInt( JSONobject["userId"]);

            this.commNodeId = CommNodeId;   
            this.creatorId = SpaceObjectId;
            this.objectType = SpaceObjectType;            
            this.userId = UserId;

            this.offer = []; 
            for (var i = 0; i < JSONobject["offered"].length; i++){
                this.offer[JSONobject["offered"][i]["goodsId"]] = JSONobject["offered"][i]["amount"];
            }

            this.request = [];
            for (var i = 0; i < JSONobject["requested"].length; i++) {
                this.request[JSONobject["requested"][i]["goodsId"]] = JSONobject["requested"][i]["amount"];
            }

            if (this.userId === mainObject.user.id && this.objectType === 0) {
                mainObject.shipFind(this.creatorId).hasTradeOffers = true;
            }   
        }


        deleteTradeOffer() {
            this.offer.length = 0;
            this.request.length = 0;
        }

        getTrader() : SpaceObject {
            if (this.objectType == 1) return mainObject.coloniesById[this.creatorId];
            if (this.objectType == 0) return mainObject.ships[this.creatorId];
        }

        acceptedBy(spaceObject: SpaceObject, shipId?: number) {
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
        }
        
    }
    

    export function tradeOfferExists(id: number): boolean {
        if (tradeOffers[id] != null)
            return true;
        else
            return false;
    }

    export function getTradeOffer(id: number): TradeOffer {
        if (!tradeOfferExists(id)) return null;
        return tradeOffers[id];
    }

    var tradeOfferAdd = function (XMLTradeOffer: Element) {
        var id = parseInt(XMLTradeOffer.getElementsByTagName("tradeOfferId")[0].childNodes[0].nodeValue);
        var newTradeOffer = new TradeOffer(id);

        tradeOffers[id] = newTradeOffer;

        newTradeOffer.update(XMLTradeOffer);
        
    }

    var createUpdateTradeOffer = function (XMLTradeOffer: Element) {
        var id = parseInt(XMLTradeOffer.getElementsByTagName("tradeOfferId")[0].childNodes[0].nodeValue);

        if (tradeOfferExists(id))
            tradeOffers[id].update(XMLTradeOffer);
        else
            tradeOfferAdd(XMLTradeOffer);
    }

    export function getTradeOfferFromXML(responseXML: Document) {
        tradeOffers.length = 0;
        updateTradeOfferFromXML(responseXML);        
    }

    export function updateTradeOfferFromXML(responseXML: Document) {
        
        var XMLTradeOffer = responseXML.getElementsByTagName("TradeOffer");
        var length = XMLTradeOffer.length;
        for (var i = 0; i < length; i++) {
            createUpdateTradeOffer(<Element>XMLTradeOffer[i]);
        }
        Helpers.Log(length + " TradeOffer added or updated");
    }

    export function createTradeOffer(tradingShip: Ships.Ship, offeredGoods: number[], demandedGoods: number[] ) {

        var DenseOfferedGoods = [];
        for (var i = 0; i < offeredGoods.length; i++) {
            if (!offeredGoods[i]) continue;
            DenseOfferedGoods.push({ "goodsId": i, "amount": offeredGoods[i] });
        }

        var DenseRequestedGoods = [];
        for (var i = 0; i < demandedGoods.length; i++) {
            if (!demandedGoods[i]) continue;
            DenseRequestedGoods.push({ "goodsId": i, "amount": demandedGoods[i] });
        }

        $.connection.spaceHub.invoke("CreateTrade", tradingShip.id, 0, DenseOfferedGoods, DenseRequestedGoods).done(e => {

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
            $('.yesButton', SuccessPanelElement).click((e: JQuery.Event) => { SuccessPanelElement.remove(); });

            var panelHeader = $('.relPopupHeader', SuccessPanelElement);
            var caption = $('<h2/>', { text: i18n.label(990), style: "float:left" }); //Offer Created
            panelHeader.append(caption);

            var panelBody = $('.relPopupBody', SuccessPanelElement);
            panelBody.removeClass("trHighlight").addClass("tdHighlight");

            var text = $('<p/>', { "text": i18n.label(991) });  //Your offer was created and is now available on the trading network.
            panelBody.append(text);

            var text2 = $('<p/>', { "text": i18n.label(992) });  //Your offer:
            panelBody.append(text2);


            var OfferedGoods = $('<div/>', { "class": "TradeLineGoodsArea BorderBox goodsOverflow" });
            //offeredGoods.append(TradeTradeAreaOfferText).append(TradeTradeAreaOfferArea); 
            panelBody.append(OfferedGoods);

            for (var offerIndex = 0; offerIndex < json["offered"].length; offerIndex++) {
                if (json["offered"][offerIndex] == null) continue;
                
                var goodsDiv = mainInterface.createGoodsDiv(json["offered"][offerIndex]["goodsId"], json["offered"][offerIndex]["amount"] );
                //goodsDiv.addClass("floatLeft");
                goodsDiv.css("display", "inline-block");
                goodsDiv.css("margin", "2px");
                OfferedGoods.append(goodsDiv);
                
            }

            var text3 = $('<p/>', { "text": i18n.label(993) });  //Your demand:
            panelBody.append(text3);

            var DemandedGoods = $('<div/>', { "class": "TradeLineGoodsArea BorderBox goodsOverflow" });
            //offeredGoods.append(TradeTradeAreaOfferText).append(TradeTradeAreaOfferArea); 
            panelBody.append(DemandedGoods);

            for (var offerIndex = 0; offerIndex < json["requested"].length; offerIndex++) {
                if (json["requested"][offerIndex] == null) continue;

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

    

    export function SendNewTrade(tradeOffer: any) {

        if (!tradeOffer["NewTradeOffer"]) {
            Helpers.Log('3 SendNewTrade did sent empty value', Helpers.LogType.DataUpdate);
            return;
        }

        var json = $.parseJSON(tradeOffer["NewTradeOffer"]);
        
        Helpers.Log( json, Helpers.LogType.Trade);

        var NewTrade: TradeOffer = null;
        var TradeId: number = json["tradeOfferId"]; 
        if (tradeOfferExists(TradeId))
            NewTrade = tradeOffers[TradeId];
        else {
            NewTrade = new TradeOffer(TradeId);
            tradeOffers[TradeId] = NewTrade;
        }
        NewTrade.UpdateFromObject(json);

        if (TradeListPanel.allTradesDiv != null) {
            TradeListPanel.showAllTrades();
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

    export function DeleteTrade(tradeId: number) {
        if (tradeOfferExists(tradeId)) {

            if (TradeOffersModule.tradeOffers[tradeId].OfferElement != null) {
                $('#loader')[0].style.display = 'block'; 
                TradeOffersModule.tradeOffers[tradeId].OfferElement.remove();
                DrawInterface.HideLoader();
            }

            delete TradeOffersModule.tradeOffers[tradeId];
        }           
    }


}