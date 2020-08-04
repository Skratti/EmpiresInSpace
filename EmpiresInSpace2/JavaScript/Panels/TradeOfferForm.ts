
//first part is in data/Tradeoffers.ts

module TradeOffersModule {

    

    export var DesignerContainer: JQuery;
    export var windowHandle: ElementGenerator.WindowManager;

    var popup: JQuery;
    var body: JQuery;

    //var allTradesDiv: JQuery;
    var tradeDiv2: JQuery;
    var tradeDiv3: JQuery;

    //export var namesPerhapsToBig: JQuery[] = [];
 
    class Designer extends Scripts.Script {

        constructor() {
            //call super, set scriptType to 3(Form) and Id to 2 (TrafeOfferForm)
            super(3, 2);
            this.run();           
        }

        run() {          
            
            windowHandle = ElementGenerator.MainPanel();
            popup = windowHandle.element;
            body = $('.relPopupBody', popup);
            body.addClass('Trade');
            windowHandle.setHeader(i18n.label(119));
       

            refreshDataAndRun();            
        }

        runOld() {
            /*
            super.run();
            windowHandle = this.scriptWindow;
            this.popup.css("width", "900px");
            this.popup.css("margin-left", "-450px");
            this.scriptWindow.setHeader(i18n.label(119));
            $(".relPopupPanel", this.popup).css("max-height", ($(document).height() - 210) + "px");

            $(".relPopupPanel", this.popup).css("overflow-y", "inherit");
            */
            refreshDataAndRun();
        }
    }

    export function OpenTradeForm() {
       
        windowHandle = ElementGenerator.MainPanel();
        popup = windowHandle.element;
        body = $('.relPopupBody', popup);
        body.addClass('Trade');
        windowHandle.setHeader(i18n.label(119));


        refreshDataAndRun();
    
        windowHandle.callbackOnRemove = e => { TradeOffersModule.RemoveTradeWindow(); };
    }

    export function RemoveTradeWindow() {
        TradeOffersModule.tradeOffers.forEach((value: TradeOffersModule.TradeOffer, index: number) => { value.OfferElement = null; });
        TradeListPanel.goodsAvailable = [];
    }

    function refreshDataAndRun() {
       
        $.ajax("Server/User.aspx", {
            type: "GET",
            data: { "action": "getTradeOffers" }
        }).done(function (msg) {
            //BaseDataModule.sleep(1000);
            TradeOffersModule.getTradeOfferFromXML(msg);
            TradeOffersModule.runTemplate();
        });

    }

    function createMinimalDiplomaticStateSelect(): JQuery {
        var selectorTargetRelation = $('<select/>');        

        selectorTargetRelation.click(function (event) { event.stopPropagation(); });

        var option99 = $('<option/>');
        var option0 = $('<option/>', { text: mainObject.relationTypes[0].name }); //War
        var option1 = $('<option/>', { text: mainObject.relationTypes[1].name }); //Hostile
        var option2 = $('<option/>', { text: mainObject.relationTypes[2].name }); //Neutral
        var option3 = $('<option/>', { text: mainObject.relationTypes[3].name }); //Trade
        var option4 = $('<option/>', { text: mainObject.relationTypes[4].name }); //Pact
        //var option3 = $('<option/>', { text: mainObject.relationTypes[4].name }); //Alliance

        option99.val("99");
        option0.val("0");
        option1.val("1");
        option2.val("2");
        option3.val("3");
        option4.val("4");

        option2.attr('selected', 'selected');
       
        selectorTargetRelation.append(option99);
        selectorTargetRelation.append(option0);
        selectorTargetRelation.append(option1);
        selectorTargetRelation.append(option2);
        selectorTargetRelation.append(option3);
        selectorTargetRelation.append(option4);

        return selectorTargetRelation;
    }

    export function runTemplate() {
        mainObject.keymap.isActive = false;
       

        $('#loader')[0].style.display = 'none';
        DesignerContainer = windowHandle.element;
        
        //Add Caption
        var panelHeader = $('.relPopupHeader', DesignerContainer);
        var caption = $('<h2/>', { text: i18n.label(143)});
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

        
        var li1 = $("<li></li>");
        var aHref1 = $("<a href = '#tab1' > " + i18n.label(303) + " </a >");
        li1.append(aHref1);
        tabUl.append(li1);

        //Offer wares (Tab-Selector)
        tabUl.append($("<li><a href='#tab2'>" + i18n.label(304) + "</a></li>")); 

        //Trade ports (Tab-Selector)
        tabUl.append($("<li><a href='#tab3'>" + i18n.label(770) + "</a></li>")); 

        tabDiv.append(tabUl);

        //1. Tab: All offers (page)
        var tradeDiv1 = $("<div id='tab1'/>"); 
        var allTradesDiv1 = $('<div/>');
        allTradesDiv1.css("min-height", "244px").css("bottom", "0px");
        tradeDiv1.append(allTradesDiv1);

        TradeListPanel.allTradesDiv = allTradesDiv1;

        //2. Tab: Offer wares (page)
        tradeDiv2 = $("<div id='tab2'/>");
        PopulateCreateTradeForm(tradeDiv2);
                       
        //3. Tab:: Trade ports
        //All offers (page)
        var tradeDiv3Parent = $("<div id='tab3'/>");
        tradeDiv3 = $('<div/>');
        tradeDiv3.css("min-height", "244px").css("bottom", "0px");
        tradeDiv3Parent.append(tradeDiv3);


        tabDiv.append(tradeDiv1).append(tradeDiv2).append(tradeDiv3Parent);

        panelBody.append(tabDiv);


        

        //main Panels generated, now fill them with dynamic data
        TradeListPanel.initTradingPosts();

        TradeListPanel.showAllTrades();
        TradeCreatePanel.showCreateTrade();
        showTradePorts();

        //panelBody.append(tabDiv);
        var tabIndex = (mainObject.currentShip && mainObject.currentShip.isOnCommNodeTile()) ? 1 : 0;
        tabDiv.tabs({ "active": tabIndex }); 
        //tabDiv.on("tabsactivate", function (event, ui) { TradeListPanel.showAllTrades(); });

        //DiplomaticStateSelect.selectmenu();
    }    


   

    function TradePortsHeader(): JQuery {

        //654
        var tableRow = $('<tr/>');
        var th = ElementGenerator.headerElement;

        //Id  - Name - Besitzer - Koordinaten - Anzahl Angebote
        tableRow.append(th(442, 40));  //ID
        tableRow.append(th(443, 194,null,0,'left')); //Name
        tableRow.append(th(769, 200, null, 0, 'left')); //Besitzer
        tableRow.append(th(771, 180, null, 0, 'center')); //Koordinaten
        //tableRow.append(th(null, 40));  //Angebote


        return tableRow;
    }

    function TradePortLine(_caller: ElementGenerator.WindowManager, tradePort: CommModule.CommNode): JQuery {
        var tableRow = $('<tr/>');
      
        //Id  - Name - Besitzer - Koordinaten - Anzahl Angebote


        var tableDataId = $('<td/>', { text: tradePort.id.toString() });
        tableRow.append(tableDataId);

        var tableDataName = $('<td/>', { text: tradePort.name });
        tableRow.append(tableDataName);

        var owner = mainObject.user.otherUsers[tradePort.owner];
        var tableDataOwner = $('<td/>');
        tableDataOwner.html(owner.AI ? '' : owner.name);
        tableRow.append(tableDataOwner);

        var tableDataPosition = $('<td/>', { text: tradePort.positionX + ' / ' + tradePort.positionY });
        tableDataPosition.css("text-align","center");
        tableRow.append(tableDataPosition);

        /*
        //amount of offers:
        var offers = 0;
        for (var i = 0; i < TradeOffersModule.tradeOffers.length; i++) {
            if (typeof TradeOffersModule.tradeOffers[i] === 'undefined') { Helpers.Log("undef"); continue; }
            if (TradeOffersModule.tradeOffers[i].commNodeId != tradePort.id) continue;
            offers++;
        }

        var tableDataAmount = $('<td/>', { text: offers.toString() });
        tableRow.append(tableDataAmount);
        */

        return tableRow;
    }    


    function showTradePorts() {
        tradeDiv3.empty();
        //namesPerhapsToBig = [];

        var filteredArray: CommModule.CommNode[] = [];
        for (var i = 0; i < CommModule.commNodes.length; i++) {
            if (CommModule.commNodes[i] == null) continue;
            if (!CommModule.commNodes[i].visited) continue;
            if (CommModule.commNodes[i].connectionType == 4) continue; //skip alliances

            filteredArray.push(CommModule.commNodes[i]);
        }

        windowHandle.createTable(tradeDiv3, filteredArray , TradePortsHeader, TradePortLine, null, 0, null, 20, false);  

        //namesPerhapsToBig.forEach((value: any, index: number) => { value.textfill({ "maxFontPixels": 16, "widthOnly": false }); });
    }

    /*
    function showTradeCreation() {
        goodsOffered.length = 0;
        goodsRequested.length = 0;
        
        selectTradeObjectOffersTable.css("display", "none");
        createTradeTableDiv.css("display", "none");

        updateTradeOfferTable();
        updateTradeTable();
        $('.ui-spinner-button').click(function () {
            $(this).siblings('input').change();
        });
    }
    */

    /*
    //updates the dropDown Menu containing tradecenters 
    function updateTradePortSelector() {
        selectTradePortTable.empty();
        

        var selectorLocation = $('<select/>');
        selectorLocation.css("min-width", "200px");

        var optionLocationAll = $('<option/>', { text: '' });
        if (TradeOffersModule.callingAtTradeport == null) optionLocationAll.attr('selected', 'selected');
        optionLocationAll.val('-1');
        selectorLocation.append(optionLocationAll);
        selectorLocation.data('-1', null);

        for (var i = 0; i < CommModule.commNodes.length; i++) {
            if (CommModule.commNodes[i] == null) continue;
            if (!CommModule.commNodes[i].visited) continue;

            var nodeName = CommModule.commNodes[i].name;
            //nodeName = nodeName.substr(0, i.toString().length);
            //nodeName += ' ' + CommModule.commNodes[i].name;
            var nodeOption = $('<option/>', { text: nodeName }).val(i.toString());
            if (TradeOffersModule.callingAtTradeport != null && TradeOffersModule.callingAtTradeport.id == i) nodeOption.attr('selected', 'selected');
            selectorLocation.append(nodeOption);
            selectorLocation.data(i.toString(), CommModule.commNodes[i]);
        }

        selectorLocation.change((e: Event) => {

            callingAtTradeport = $(selectorLocation).data(<string>selectorLocation.val());
            callingObject = null;
            //var x = $(e.currentTarget).data(selectorObjects.val());
            //callingObject = selectorObjects.data(selectorObjects.val);
            TradeCreatePanel.showCreateTrade();            
        });

        var locationName = $("<span>", { text: i18n.label(192) });
        locationName.css("display", "inline-block");
        locationName.css("width", "100px");
        selectTradePortTable.append(locationName).append(selectorLocation);
        
    } 
    */

    /*
    //updates the dropDown Menu containing objects at the tradecenter (ships and colonies)
    function updateTradeObjectSelector() {

        //Lists all objects present at the selected TradePort       
        selectTradeObjectTable.empty();       

        var selectorObjects = $('<select/>');
        selectorObjects.css("min-width","200px");

        var optionObjectAll = $('<option/>', { text: '' });
        if (TradeOffersModule.callingObject == null) optionObjectAll.attr('selected', 'selected');
        optionObjectAll.val('-1');
        selectorObjects.append(optionObjectAll);
        selectorObjects.data('-1', null);

        if (TradeOffersModule.callingAtTradeport != null) {
            var objectsAtNode = TradeOffersModule.callingAtTradeport.spaceObjectsAtNode(true);

            for (var i = 0; i < objectsAtNode.length; i++) {
                var tradeObject = $('<option/>', { text: objectsAtNode[i].name }).val(i.toString());

                selectorObjects.data(i.toString(), objectsAtNode[i]);
                if (TradeOffersModule.callingObject != null && TradeOffersModule.callingObject.id == objectsAtNode[i].id) tradeObject.attr('selected', 'selected');
                selectorObjects.append(tradeObject);
            }
        }


        selectorObjects.change((e: Event) => {
            callingObject = $(selectorObjects).data(<string>selectorObjects.val());            
            showTradeCreation();
        });

     
        var locationName = $("<span>", { text: i18n.label(189) });
        locationName.css("display", "inline-block");
        locationName.css("width", "100px");

        selectTradeObjectTable.append(locationName).append(selectorObjects);
    } 
    */

    /*
    function updateTradeOfferTable() {
        selectTradeObjectOffersTable.empty();
        namesPerhapsToBig = [];
        if (callingObject == null) return;

        //calc the amount on the ship without current trades
        goodsWithoutOffers.length = 0;
        Helpers.addGoodsToArray(goodsWithoutOffers, callingObject.goods);


        selectTradeObjectOffersTable.css("display", "table");
        selectTradeObjectOffersTable.css("width", "100%");


        selectTradeObjectOffersTable.append(createFirstLineNoFilter());
        var makeGray = false;
        var spacer = $('<tr/>', { "class": "TRspacer" });
        selectTradeObjectOffersTable.append(spacer);
        var trades = 0;
        for (var i = 0; i < TradeOffersModule.tradeOffers.length; i++) {
            if (typeof TradeOffersModule.tradeOffers[i] === 'undefined') {  continue; }
            if (TradeOffersModule.tradeOffers[i].creatorId != callingObject.id) continue;

            (function createLineClosure(tradeOffer: TradeOffer) {
                //create a empty TR  , so that we have a little Sapce between the TRs                

                //var spacer = $('<tr/>', { "class": "TRspacer" });
                //selectTradeObjectOffersTable.append(spacer);


                var tableRow = createTableLine(tradeOffer,false);
                trades++;
                if (makeGray) {
                    tableRow.find("td").addClass("SecondLineBackground");
                    //tableRow.find("*").css("background-color", "#888888");
                    makeGray = false;
                } else {
                    makeGray = true;
                }

                //if (research.researchable) {
                //    tableRow.click((e) => { researchSelected(research); researchPanel.remove(); showResearchPanel(); });
                // }
                selectTradeObjectOffersTable.append(tableRow);
                //tableRow.find("span").addClass("restoreBackground");
            })(TradeOffersModule.tradeOffers[i]);
        }
        //var spacer2 = $('<tr/>', { "class": "TRspacer" });
        //selectTradeObjectOffersTable.append(spacer2);

        //Helpers.Log(" Tabelle  selectTradeObjectOffersTable " + selectTradeObjectOffersTable.height().toString());

        //update design according to numbers of rows currently trading:
        //65 pro Zeile + 35 für den header + 5 Abstand - 155 / 260 / 325 / 390  (0-3+) - overflow deals with all lines after 3
        switch (trades) {
            case 0:
                selectTradeObjectOffersTable.css("display", "none");
                createTradeTableDiv.css("top", "125px");
                break;
            case 1:                
                createTradeTableDiv.css("top", "230px");
                break;
            case 2:
                createTradeTableDiv.css("top", "295px");
                break;
            default:
                createTradeTableDiv.css("top", "360px");
                break;            
        }

        namesPerhapsToBig.forEach((value: any, index: number) => { value.textfill({ "maxFontPixels": 16, "widthOnly": false }); });               
    } 

    */

    /*
    function updateTradeTable() {
        createTradeTable.empty();
        if (callingObject == null) return;
        
        createTradeTableDiv.css("display", "block");    
        createTradeTableDiv.css("width", "100%");
        var thead = $("<thead/>");
        createTradeTable.append(thead.append( createGoodsHeader()));
        var makeGray = false;
        var tbody = $("<tbody/>");        
        
        for (var i = 0; i < mainObject.goods.length; i++) {
            if (mainObject.goods[i] == null) continue;
            if (mainObject.goods[i].goodsType === 3) continue;

            (function createLineClosure(_good: BaseDataModule.Good) {
                var tableRow = createGoodsLine(_good);
                if (makeGray) {                   
                    //tableRow.find("*").addClass("greyRow");  
                    tableRow.find("td").addClass("SecondLineBackground");                  
                    makeGray = false;
                } else {
                    makeGray = true;
                }
                tbody.append(tableRow);
            }) (mainObject.goods[i]);
        }
        createTradeTable.append(tbody);       

        $(".thgoodsimage").css("width", "50px");
        $(".thpresent").css("width", "50px");
        $(".thoffer").css("width", "150px");
        $(".threquest").css("width", "150px");

    }
    */

    /*
    function createGoodsHeader(): JQuery {
        var tableRow = $('<tr/>');

        //Goods
        var goodsDiv = $("<div>");
        goodsDiv.append($("<span>", { text: i18n.label(178) }));        
        var tableDataId = $('<th/>', { "class": "tdTextLeft borderBottom thgoodsname" });
        tableDataId.append(goodsDiv);       
        //tableDataId.css("width", "150px");
        tableRow.append(tableDataId);

        //image
        tableRow.append($("<th/>", { "class": "tdTextLeft borderBottom thgoodsimage" }));

        //AmountPresentAtShip
        tableRow.append($("<th/>", { "class": "tdTextLeft borderBottom thpresent" }));

        //Offer     
        var offerDiv = $("<div>");
        offerDiv.append($("<span>", { text: i18n.label(190) }));
        var tableDataOffer = $('<th/>', { "class": "tdTextLeft borderBottom thoffer" });
        tableDataOffer.css("text-align", "right");
        tableDataOffer.append(offerDiv);
        tableRow.append(tableDataOffer);
      
        //Request
        var requestDiv = $("<div>");
        var requestSpan = $("<span>", { text: i18n.label(191) });
        requestSpan.css("padding-right", "20px");
        requestDiv.append(requestSpan);
        var tableDataReq = $('<th/>', { "class": "tdTextLeft borderBottom threquest" });
        tableDataReq.append(requestDiv);
        tableDataReq.css("text-align", "right");


        tableRow.append(tableDataReq);

        return tableRow;
    }
    */

    /*
    function createGoodsLine(_good: BaseDataModule.Good): JQuery {
       
        var tableRow = $('<tr/>');
        
        var goodsDiv = $("<div>");
        goodsDiv.append($("<span>", { text: i18n.label(_good.label) })); 
        var tableDataName = $('<td/>', { "class": "firstchild tdTextLeft tdgoodsname" });
        //tableDataName.css("width", "180px");       
        tableDataName.append(goodsDiv);
        tableRow.append(tableDataName);


        var offeredGoods = $('<td/>',{ "class": "tdgoodsimage"});
        offeredGoods.css("padding", "4px");
        
        var goodsDiv = mainInterface.createGoodsImageDiv(_good.id);
        //goodsDiv = mainInterface.createGoodsDiv(goodsIndex, tradeOffer.offer[goodsIndex]);
        offeredGoods.append(goodsDiv);        
        tableRow.append(offeredGoods);
        
        var offeredGoodsAmountPresent = $('<td/>', { "class": "tdpresent" });
        if (goodsWithoutOffers[_good.id] != null) {
            offeredGoodsAmountPresent.append($("<span>", { text: goodsWithoutOffers[_good.id].toString() }));
        }
        tableRow.append(offeredGoodsAmountPresent);

        var offeredGoodsSpinner = $('<td/>', { "class": "tdgoodsimage tdoffer" });
        offeredGoodsSpinner.css("padding", "5px"); 
        if (goodsWithoutOffers[_good.id] != null) {
            var spinner = $("<input/>", { name: "value", value: 0 });
            spinner.css("width", "146px");       
            spinner.css("text-align", "right");        
            spinner.css("padding-right", "4px");       
          
            offeredGoodsSpinner.append(spinner);
            spinner.spinner({
                min: 0,
                max: goodsWithoutOffers[_good.id],
                change: function (event, ui)  {
                    Helpers.Log("z");                   
                    TradeOffersModule.transferGoodsChange(_good.id, this.value, 0);                                    
                }
            });
            spinner.keypress(function (event) {
                if (event.which == 45 || event.which == 189) {
                    event.preventDefault();
                }
            });
               
        }
        tableRow.append(offeredGoodsSpinner);


        var requestedGoodsSpinnerTD = $('<td/>', { "class":"tdrequest"});
        requestedGoodsSpinnerTD.css("padding", "5px");
        var requestedSpinner = $("<input/>", { name: "value", value: 0 });
        requestedSpinner.css("width", "146px");
        requestedSpinner.css("text-align", "right");   
        requestedSpinner.css("padding-right", "4px"); 
                    
        requestedGoodsSpinnerTD.append(requestedSpinner);
        requestedSpinner.spinner({
            min: 0,
            change: function (event, ui) {
                Helpers.Log("z");
                TradeOffersModule.transferGoodsChange(_good.id, this.value, 1);
            }
        });
        requestedSpinner.keypress(function (event) {
            if (event.which == 45 || event.which == 189) {
                event.preventDefault();
            }
        });
        tableRow.append(requestedGoodsSpinnerTD);

        tableRow.find("span").addClass("restoreBackground");
        return tableRow;
    }    
    */

    
    export function close() {
        Helpers.Log("closing Trade");
        TradeOffersModule.callingAtTradeport = null;
        TradeOffersModule.callingObject = null;
        TradeOffersModule.DesignerContainer.remove();
    }   

  
}
