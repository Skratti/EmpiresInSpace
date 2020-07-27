/*/// <reference path="../References.ts" />*/

// first part is in data/Tradeoffers.ts
// this only contains panels and user interactions - data is in first part

module AllianceModule {

    export var allianceListWindow: ElementGenerator.WindowManager;
    export var allianceList: JQuery;
    var panelBody: JQuery;
    var namesPerhapsToBig: JQuery[]= [];

    class Designer extends Scripts.Script {

        constructor() {
            //call super, set scriptType to 3(Form) and Id to 2 (TrafeOfferForm)
            super(3, 3);
            //mainObject.scriptsAdmin.scripts.push(this);
            Scripts.scriptsAdmin.scripts.push(this);
            //this.run();
        }
        
        run() {
            runTemplate();
        }
    }

    export function runTemplate() {    
        allianceListWindow = ElementGenerator.MainPanel();   
        //allianceListWindow = new ElementGenerator.WindowManager(null);

        allianceListWindow.setHeader(i18n.label(139));
        //allianceListWindow.makeStandardSize(); 
        //allianceListWindow.prepareScrollableTable();
        
        panelBody = $('.relPopupBody', allianceListWindow.element);  
        refreshAll();
        $('#loader')[0].style.display = 'none'; 
        
        allianceListWindow.SetBottom();   
    }
 
    export function refreshAll() {

        var hasAdminRights = mainObject.user.allianceId && AllianceModule.alliances[mainObject.user.allianceId] && AllianceModule.alliances[mainObject.user.allianceId].getUserRights() ? true : false;
        this.hasAdminRights = hasAdminRights;

        panelBody.empty();
        namesPerhapsToBig = [];

        if (!mainObject.user.allianceId) {
            panelBody.append(createAllianceButton());            
            panelBody.append($("<br/>"));            
        }
        
        //var allAlliances = $('<h3/>', { text: i18n.label(139) }); //text: i18n.label(300)
        //panelBody.append(allAlliances);

        //ElementGenerator.createTable(panelBody, AllianceModule.alliances, createAllianceHeader, createAllianceLine, mainObject.user.allianceId, 110);
        allianceListWindow.createTable(panelBody, AllianceModule.alliances, createAllAllianceHeaderWithRelation, createAllianceLine2, null, 110, null, 50, false);
        
        //namesPerhapsToBig.forEach((value: any, index: number) => { value.textfill({ "maxFontPixels": 16, "widthOnly": true }); });
        //namesPerhapsToBig.forEach((value: any, index: number) => { value.bigText(); });

        $("select", panelBody).selectmenu({
            "change": (event, data) => {
                Helpers.Log($(data.item.element).parent().data("alliance"));
                Helpers.Log($(data.item).parent().data("alliance"));
                relationChangedTowardsAlliance(data.item.element.parent()[0], $(data.item.element).parent().data("alliance"));
            }
        });
        $("select", panelBody).parent().click((e: JQueryEventObject) => { e.preventDefault(); e.stopPropagation();});
    }   

    function leaveAlliance() {

        $.ajax("Server/Alliances.aspx", {
            type: "GET",
            data: {
                "action": "leaveAlliance",
                "allianceId" : mainObject.user.allianceId
            }
        }).always(
        function () {

            CommModule.RemoveAllianceNode();
 
            var memberCount = AllianceModule.alliances[mainObject.user.allianceId].countMembers(); ;          
            if (!memberCount) AllianceModule.alliances[mainObject.user.allianceId].deleteAlliance();
            mainObject.user.allianceId = 0;         
            refreshAll();
        });

    }

    export function joinAlliance(allianceId) {
        $.ajax("Server/Alliances.aspx?action=joinAlliance", {
            type: "POST",
            data: allianceId,
            contentType: "xml",
            processData: false
        }).done(function (msg) {
            AllianceModule.getAllianceDataFromXML(msg);
            CommModule.getNodesFromXML(msg);
            AllianceModule.refreshAll();
        });

        mainObject.user.allianceId = allianceId;

        refreshAll();
    }

    function createAlliance() {
        var newNameContainer = ElementGenerator.renamePanel('', i18n.label(452));
        $('.yesButton', newNameContainer).click((e: JQueryEventObject) => {
            var newName = $(".inputEl", newNameContainer).val();
            $.ajax("Server/Alliances.aspx", {
                type: "GET",
                data: {
                    "action": "createAlliance",
                    "newName": newName
                }
            }).done(function (msg) {
                AllianceModule.getAllianceDataFromXML(msg);
                CommModule.getNodesFromXML(msg);
                AllianceModule.refreshAll();
            });
            newNameContainer.remove();
        });        
    }

    function relationChangedTowardsAlliance(relationSelector: HTMLSelectElement, targetUser: Alliance) {
        //var newValue = relationSelector.selectedIndex;
        var newValue = parseInt(relationSelector.value);
        //var currentRelation = targetUser.currentRelations[mainObject.user.allianceId];
        var currentRelation = targetUser.currentRelation;

        //Helpers.Log(currentRelation + ' - ' + newValue);

        if (newValue == currentRelation) return;

        if (newValue == 99) {
            $.ajax("Server/Alliances.aspx", {
                "type": "GET",
                "data": { "targetAllianceId": targetUser.id.toString(), "action": "removeRelation" }
            }).done(function (msg) {
                    //mainObject.user.getOtherUsersFromXML(msg);
                });

            targetUser.targetRelation = targetUser.currentRelation;

            return;
        }

        if (newValue >= targetUser.currentRelation) {
            //var xhttp = GetXmlHttpObject();
            //xhttp.open("GET", "Server/User.aspx?action=setRelation&targetUser=" + targetUser.id + "&targetRelation=" + newValue, false);
            //xhttp.send(""); //?action=setShipMovement&value=

            $.ajax("Server/Alliances.aspx", {
                type: "GET",
                data: {
                    "targetId": targetUser.id.toString(),
                    "targetType": "1",
                    "action": "setAdvRelation",
                    "targetRelation": newValue
                }
            }).done(function (msg) {
                mainObject.user.getOtherUsersFromXML(msg);
                AllianceModule.getAllianceDataFromXML(msg);
                mainInterface.drawAll();
                });

        } else {
            //var confirmDiplomacyPanel = ElementGenerator.createPopup(0);
            //var confirmDiplomacyPanel = ElementGenerator.createNoYesPopup();
            //ElementGenerator.adjustPopupZIndex(confirmDiplomacyPanel, 12000);
            //ElementGenerator.makeSmall(confirmDiplomacyPanel);

            
            var headerText = newValue == 0 ? i18n.label(625) : "";
            var captionText = newValue == 0 ? i18n.label(626) : i18n.label(296);
            var confirmDiplomacyPanel = ElementGenerator.createWorsenRelationPopup(
                (e) => {e.preventDefault(); AllianceModule.relationChangeAccepted(newValue, targetUser, relationSelector); confirmDiplomacyPanel.remove();},
                (e) => {e.preventDefault(); confirmDiplomacyPanel.remove(); relationSelector.value = targetUser.currentRelation.toString(); $(relationSelector).selectmenu("refresh");},
                headerText,
                captionText,
                null,
                0,
                newValue);
            
            
            var panelBody = $('.relPanelBody', confirmDiplomacyPanel);
            /*
            panelBody.append(captionText);
            
            var caption = $('<span/>', { text: captionText });
            panelBody.append(caption);

            if (newValue == 0) {
                panelBody.append($('<p/>', { text: i18n.label(626) }));
            }
            */
            $('.noButton span ', confirmDiplomacyPanel).css("display", "block");
            $('.noButton', confirmDiplomacyPanel).css("display","inline-block");
            $('.yesButton span', confirmDiplomacyPanel).text(i18n.label(291));
            $('.noButton span', confirmDiplomacyPanel).text(i18n.label(292));


            this.tempTargetRelation = newValue;
            this.tempTargetUser = targetUser;
            this.tempRelationSelector = relationSelector;
            /*
            $('.yesButton', confirmDiplomacyPanel).click((e) => {
                e.preventDefault(); AllianceModule.relationChangeAccepted(newValue, targetUser, relationSelector); confirmDiplomacyPanel.remove();
            });
            $('.noButton', confirmDiplomacyPanel).click((e) => {
                e.preventDefault(); confirmDiplomacyPanel.remove(); relationSelector.value = targetUser.currentRelation.toString(); $(relationSelector).selectmenu("refresh");
            });
            */
            //confirmDiplomacyPanel.appendTo("body"); //attach to the <body> element

        }

        Helpers.Log(targetUser.id + " relationChanged... " + newValue);
    }

    export function relationChangeAccepted(newValue: number, targetUser: Alliance, relationSelector: HTMLSelectElement) {

        targetUser.currentRelation = newValue;
        targetUser.targetRelation = newValue;

        //update the corresponding field with current Relation
        //ToDO: remove <unknown>
        var parentRow = <HTMLTableRowElement><unknown> relationSelector.parentNode.parentNode;
        var newRelationType = mainObject.relationTypes[newValue];
        $(parentRow).find(".spanCurrentRelation").css("backgroundColor", newRelationType.backGroundColor);
        $(parentRow).find(".spanCurrentRelation").text(newRelationType.name);

        $.ajax("Server/Alliances.aspx", {
            type: "GET",
            data: {
                "targetId": targetUser.id.toString(),
                "targetType": "1",
                "action": "setAdvRelation",
                "targetRelation": newValue
            }
        }).done(function (msg) {
            mainObject.user.getOtherUsersFromXML(msg);
            mainObject.getShipsFromXML(msg);
            AllianceModule.getAllianceDataFromXML(msg);
            mainInterface.drawAll();
        });
    }

    
    
    function ownAllianceInfo(): JQuery {
        //own alliance or create Alliance button
        if (mainObject.user.allianceId) {
            var userAlliance = AllianceModule.getAlliance(mainObject.user.allianceId);
            var ownAllianceTable = $('<table/>', { "class": "tableBorderBlack highlightTable", "cellspacing": 0 });// , style:"border-collapse: collapse;"

            var ownNameRow = $('<tr/>');
            //ownNameRow.addClass("allianceLine");
            //Name Caption
            var tableDataId = $('<td/>', { text: i18n.label(450) , "class": "firstchild tdTextLeft" }); //'Deine Allianz'
            ownNameRow.append(tableDataId);

            //Name
            var name = $('<td/>');
            name.append($("<span>" + userAlliance.name + "</span>" ));
            ownNameRow.append(name);

            ownAllianceTable.append(ownNameRow);

            var ownMembersRow = $('<tr/>');
            //ownMembersRow.addClass("allianceLine");
             //Members Caption
            var membersCaption = $('<td/>', { text: i18n.label(451), "class": "firstchild tdTextLeft" });
            ownMembersRow.append(membersCaption);

            //Members
            var members = $('<td/>');
            members.append($("<span>", { text: userAlliance.countMembers()  }));
            ownMembersRow.append(members);

            ownAllianceTable.append(ownMembersRow);


            ownAllianceTable.click(() => { AllianceModule.entryPoint2(mainObject.user.allianceId, allianceListWindow); });

            return ownAllianceTable;
        }
        
        var buttonYes = $('<button/>');
        buttonYes.text(i18n.label(452)); //Allianz erstellen
        buttonYes.click((e: JQueryEventObject) => { createAlliance(); });
        buttonYes.button();

        return buttonYes;
    }

    function createAllianceButton(): JQuery {
        //own alliance or create Alliance button
        
        var buttonYes = $('<button/>');
        buttonYes.text(i18n.label(452)); //Allianz erstellen
        buttonYes.click((e: JQueryEventObject) => { createAlliance(); });
        buttonYes.button();

        return buttonYes;
    }

    function createAllAllianceHeaderWithRelation(): JQuery {

        var tableRow = $('<tr/>');
        var th = ElementGenerator.headerElement; //labels, width, noRightBorder, tooltip
        var thPic = ElementGenerator.headerPictureElement;

        tableRow.append(th(null, 25)); //id 
        tableRow.append(th(570, 40)); //Rang
        tableRow.append(th(571, 50)); //Points//
        tableRow.append(th(443, 140)); //Alliance Name
        /*
        tableRow.append(thPic("url(images/BlackIcons.png) no-repeat -90px 0px", 444,30,0)); //id        
        tableRow.append(thPic("url(images/BlackIcons.png) no-repeat -30px 0px", 445, 30, 0)); //id        
        tableRow.append(thPic("url(images/BlackIcons.png) no-repeat 0px 0px", 446, 30, 0)); //id 
        */
        tableRow.append(ElementGenerator.headerClassElement("IconPopulation", 444));          //Known Members
        tableRow.append(ElementGenerator.headerClassElement("IconColony", 445));         //Known Colonies
        tableRow.append(ElementGenerator.headerClassElement("IconShip", 446));     //Known Ships

        
        //tableRow.append(th(447, 115)); //relation
        tableRow.append(th(448, 125)); ////Eigenes Angebot     
        tableRow.append(th(449, 96)); //Sein Angebot     
        tableRow.append(th(null, 40)); //invite is present

        return tableRow;
    }


    function createAllianceHeader(skipDetails?: boolean): JQuery {
        if (!skipDetails) skipDetails = false;
        var tableRow = $('<tr/>');

        //ID
        var goodsDiv = $("<div>");
        goodsDiv.append($("<span>", { text: i18n.label(442) })); //ID
        var tableDataId = $('<th/>', { "class": "tdTextLeft borderBottom" });
        tableDataId.append(goodsDiv);
        goodsDiv.css("width", "40px");
        tableRow.append(tableDataId);
        

        //Name     
        var offerDiv = $("<div>");
        offerDiv.append($("<span>", { text: i18n.label(443) }));  //Name
        var tableDataOffer = $('<th/>', { "class": "tdTextLeft borderBottom nameTh" });
        offerDiv.css("width", "180px");
        tableDataOffer.append(offerDiv);
        tableRow.append(tableDataOffer);

        if (!skipDetails) {
            //Mitglieder
            var membersDiv = $("<div>");
            membersDiv.append($("<span>", { text: i18n.label(444) })); //Known members
            var tableDataMembers = $('<th/>', { "class": "tdTextLeft borderBottom" });
            membersDiv.css("width", "85px");
            tableDataMembers.append(membersDiv);
            tableRow.append(tableDataMembers);

            //Kolonien
            var coloniesDiv = $("<div>");
            coloniesDiv.append($("<span>", { text: i18n.label(445) })); //colonies
            var tableDataMembers = $('<th/>', { "class": "tdTextLeft borderBottom" });
            tableDataMembers.append(coloniesDiv);
            coloniesDiv.css("width", "80px");
            tableRow.append(tableDataMembers);

            //Schiffe
            var shipsDiv = $("<div>");
            shipsDiv.css("width", "80px");
            shipsDiv.append($("<span>", { text: i18n.label(446)})); //known ships
            var tableDataMembers = $('<th/>', { "class": "tdTextLeft borderBottom" });
            tableDataMembers.append(shipsDiv);
            tableRow.append(tableDataMembers);
        }

        //aktuelle Beziehung   
        if (mainObject.user.allianceId) {

            var currentRelDiv = $("<div>");
            currentRelDiv.css("width", "115px");
            currentRelDiv.append($("<span>", { text: i18n.label(447)})); //relation
            var tableDataOffer = $('<th/>', { "class": "tdTextLeft borderBottom" });
            tableDataOffer.append(currentRelDiv);
            tableRow.append(tableDataOffer);

            //Eigenes Angebot     
            var ownOfferDiv = $("<div>");
            
            ownOfferDiv.css("width", "125px");
            ownOfferDiv.append($("<span>", { text: i18n.label(448) }));
            var tableDataOffer = $('<th/>', { "class": "tdTextLeft borderBottom" });
            tableDataOffer.append(ownOfferDiv);
            tableRow.append(tableDataOffer);

            //Sein Angebot     
            var offeredDiv = $("<div>");
            offeredDiv.css("width", "96px");
            offeredDiv.append($("<span>", { text: i18n.label(449) })); //Eingehendes Angebot
            var tableDataOffer = $('<th/>', { "class": "tdTextLeft borderBottom" });
            tableDataOffer.append(offeredDiv);
            tableRow.append(tableDataOffer);
        }       

        var tableDataInviteDiv = $("<div>");
        tableDataInviteDiv.append($("<span>", { text: "" }));
        var tableDataInvite = $('<th/>', { "class": "tdTextLeft borderBottom" });
        tableDataInviteDiv.css("width", "40px");
        tableDataInvite.append(tableDataInviteDiv);
        tableRow.append(tableDataInvite);
 
        return tableRow;
    }

    function createAllianceLine2(_caller: ElementGenerator.WindowManager, _alliance: Alliance): JQuery {
        var tableRow = $('<tr/>');
        if (_alliance.id != mainObject.user.allianceId) {
            tableRow.click(function () { Helpers.Log("TR click"); AllianceModule.entryPoint2(_alliance.id, _caller); });
        }
        else {
            tableRow.click(() => { AllianceModule.entryPoint2(mainObject.user.allianceId, allianceListWindow); });
        }
        tableRow.addClass("allianceLine");
        


        if (mainObject.user.allianceId && mainObject.user.allianceId == _alliance.id) {
            tableRow.addClass("ownAlliance");
        }

        //ID
        //var tableDataId = $('<td/>', { text: _alliance.id, "class": "tdTextLeft" });
        //tableRow.append(tableDataId);

        //Relation-Flags
        var relation = $('<td/>');
        var ContactStateDiv = $('<div/>');
        ContactStateDiv.addClass("contactState");
        ContactStateDiv.css("height", "30px");
        ContactStateDiv.css("width", "30px");


        if (_alliance.id != mainObject.user.allianceId) {
            ContactStateDiv.addClass(mainObject.relationTypes[_alliance.currentRelation].backgroundSymbolClass + "Small");
            ContactStateDiv.attr("title", i18n.label(mainObject.relationTypes[_alliance.currentRelation].nameLabel));
        }
        relation.append(ContactStateDiv);
        tableRow.append(relation);


        //Rank:
        var tableDataId = $('<td/>', { text: _alliance.overallRank, "class": "tdTextLeft" });
        tableRow.append(tableDataId);

        //Rank:
        var tableDataId = $('<td/>', { text: _alliance.overallVicPoints, "class": "tdTextLeft" });
        tableRow.append(tableDataId);

        //Name
        var name = $('<td/>');   
       // name.css("height", "25px");
      //  name.css("width", "81px");
        name.css("word-break", "break-word");       
        var nameSpan = $("<span>" + _alliance.name + "</span>");
        //nameSpan.css("font-size","1px");
        name.append(nameSpan);       
        tableRow.append(name);
        namesPerhapsToBig.push(name);                   

        //Members
        var countMembers = $('<td/>');
        countMembers.append($("<span>", { text: _alliance.countMembers() }));
        tableRow.append(countMembers);

        //Kolonien
        var countColonies = $('<td/>');
        countColonies.append($("<span>", { text: _alliance.countColonies() }));
        tableRow.append(countColonies);

        //Schiffe
        var countShips = $('<td/>');
        countShips.append($("<span>", { text: _alliance.countShips() }));
        tableRow.append(countShips);
        
        //Politics : player proposal and other player proposal
        var tableDataCurrentRelation = $('<td/>');
        var tableDataTargetRelation = $('<td/>');
        var tableDataHisTargetRelation = $('<td/>');

        //currentRelation
        if (_alliance.id != mainObject.user.allianceId) {
            
            //var currentRelation = _alliance.currentRelations[mainObject.user.allianceId] != null ? _alliance.currentRelations[mainObject.user.allianceId] : 1;
            var currentRelation = _alliance.currentRelation;
            /*
            var tableDataCurrentRelationSpan = $('<span/>', { text: mainObject.relationTypes[currentRelation].name });
            tableDataCurrentRelationSpan.css("background-color", mainObject.relationTypes[currentRelation].backGroundColor);

            tableDataCurrentRelationSpan.addClass("spanFixedWidth");
            //tableDataCurrentRelationSpan.css("font-weight", "bold");

            tableDataCurrentRelationSpan.addClass("spanCurrentRelation");
            tableDataCurrentRelation.append(tableDataCurrentRelationSpan);
            tableRow.append(tableDataCurrentRelation);
            */

            
            //selector for target Relation
            if (mainObject.user.allianceId == null || AllianceModule.alliances[mainObject.user.allianceId] && AllianceModule.alliances[mainObject.user.allianceId].getUserRights() ) {

                var selectorTargetRelation = $('<select/>');
                selectorTargetRelation.data("alliance", _alliance);

                
                selectorTargetRelation.click(function (event) { event.stopPropagation(); });

                var option99 = $('<option/>');
                var option0 = $('<option/>', { text: mainObject.relationTypes[0].name });
                var option1 = $('<option/>', { text: mainObject.relationTypes[1].name }); //Hostile
                var option2 = $('<option/>', { text: mainObject.relationTypes[2].name });
                var option3 = $('<option/>', { text: mainObject.relationTypes[3].name }); //Trade
                var option4 = $('<option/>', { text: mainObject.relationTypes[4].name }); //Pact
                //var option3 = $('<option/>', { text: mainObject.relationTypes[4].name }); //Alliance

                option99.val("99");
                option0.val("0");
                option1.val("1");
                option2.val("2");
                option3.val("3");
                option4.val("4");

                if (_alliance.targetRelation == null || _alliance.targetRelation == currentRelation) {
                    option99.attr('selected', 'selected');
                } else {

                    if (_alliance.targetRelation == 0) {
                        option0.attr('selected', 'selected');
                    }

                    if (_alliance.targetRelation == 1) {
                        option1.attr('selected', 'selected');
                    }

                    if (_alliance.targetRelation == 2) {
                        option2.attr('selected', 'selected');
                    }

                    if (_alliance.targetRelation == 3) {
                        option3.attr('selected', 'selected');
                    }

                    if (_alliance.targetRelation == 4) {
                        option4.attr('selected', 'selected');
                    }
                }

                selectorTargetRelation.append(option99);
                selectorTargetRelation.append(option0);
                selectorTargetRelation.append(option1);
                selectorTargetRelation.append(option2);
                selectorTargetRelation.append(option3);
                selectorTargetRelation.append(option4);

                selectorTargetRelation.change(() => { relationChangedTowardsAlliance(<HTMLSelectElement> (selectorTargetRelation.get()[0]), _alliance) });

                tableDataTargetRelation.append(selectorTargetRelation);
                //selectorTargetRelation.selectmenu();
                tableRow.append(tableDataTargetRelation);

                //hisTargetRelation                
                if (_alliance.hisTargetRelation != null && _alliance.hisTargetRelation != currentRelation) {
                    
                    var ContactStateDiv2 = $('<div/>');
                    ContactStateDiv2.addClass("contactState");
                    ContactStateDiv2.css("height", "30px");
                    ContactStateDiv2.css("width", "30px");
                    
                    ContactStateDiv2.addClass(mainObject.relationTypes[_alliance.hisTargetRelation].backgroundSymbolClass + "Small");
                    ContactStateDiv2.attr("title", i18n.label(mainObject.relationTypes[_alliance.hisTargetRelation].nameLabel));
                    
                    tableDataHisTargetRelation.append(ContactStateDiv2);

                }
                //tableDataHisTargetRelation.append(spanHisTargetRelation);
                
                tableRow.append(tableDataHisTargetRelation);

            } else {
                tableRow.append(tableDataTargetRelation);
                tableRow.append(tableDataHisTargetRelation);
            }
        } else {            
            //tableRow.append(tableDataCurrentRelation);
            tableRow.append(tableDataTargetRelation);
            tableRow.append(tableDataHisTargetRelation);
        }


        var tableDataInvite = $('<td/>');
        if (mainObject.user.invitedByAlliance[_alliance.id] != null && mainObject.user.invitedByAlliance[_alliance.id] === 1) {

            var tableDataInviteDiv = $("<div/>");
            tableDataInviteDiv.addClass("invite");
            //tableDataInviteDiv.css("background", "url(images/BlackIcons.png) no-repeat -120px 0px");
            //tableDataInviteDiv.css({ "width": "30px", "height": "30px", "margin-left": "10px" });

            tableDataInvite.attr("title", i18n.label(458));//);           //"Einladung vorhanden" 
            tableDataInvite.append(tableDataInviteDiv);
            //tableRow.click(function () { Helpers.Log("TR click"); AllianceModule.entryPoint(_alliance.id, allianceList); });
            tableDataInvite.click(function (e) { e.stopPropagation(); Helpers.Log("join"); AllianceModule.joinAlliance(_alliance.id); });

        }
        tableRow.append(tableDataInvite);

        //tableRow.find("span").addClass("restoreBackground");
        return tableRow;
    }    

    function createAllianceLine(_caller: ElementGenerator.WindowManager, _alliance : Alliance, skipDetails?: boolean): JQuery {
        if (!skipDetails) skipDetails = false;

        var tableRow = $('<tr/>');
        tableRow.click(function () { Helpers.Log("TR click"); AllianceModule.entryPoint2(_alliance.id, _caller); });
        tableRow.addClass("allianceLine");

        
        //ID
        var tableDataId = $('<td/>', { text: _alliance.id, "class": "firstchild tdTextLeft" });
        tableRow.append(tableDataId);

        //Rank:
        var tableDataId = $('<td/>', { text: _alliance.overallRank, "class": "tdTextLeft" });
        tableRow.append(tableDataId);

        //Rank:
        var tableDataId = $('<td/>', { text: _alliance.overallVicPoints, "class": "tdTextLeft" });
        tableRow.append(tableDataId);


        //Name
        var name = $('<td/>');
        name.append($("<span>" + _alliance.name + "</span>"));
//        name.append($("<span>", { text: _alliance.name }));
        tableRow.append(name);

        //Members
        if (!skipDetails) {
            var countMembers = $('<td/>');
            countMembers.append($("<span>", { text: _alliance.countMembers() }));
            tableRow.append(countMembers);

            //Kolonien
            var countColonies = $('<td/>');
            countColonies.append($("<span>", { text: _alliance.countColonies() }));
            tableRow.append(countColonies);

            //Schiffe
            var countShips = $('<td/>');
            countShips.append($("<span>", { text: _alliance.countShips() }));
            tableRow.append(countShips);
        }

        //currentRelation
        if (mainObject.user.allianceId) {
            var tableDataCurrentRelation = $('<td/>');
            var currentRelation = 2; // _alliance.currentRelations[mainObject.user.allianceId] != null ? _alliance.currentRelations[mainObject.user.allianceId] : 1;
            var tableDataCurrentRelationSpan = $('<span/>', { text: mainObject.relationTypes[currentRelation].name });
            tableDataCurrentRelationSpan.css("background-color", mainObject.relationTypes[currentRelation].backGroundColor);
            
            tableDataCurrentRelationSpan.addClass("spanFixedWidth");            
            //tableDataCurrentRelationSpan.css("font-weight", "bold");

            tableDataCurrentRelationSpan.addClass("spanCurrentRelation");
            tableDataCurrentRelation.append(tableDataCurrentRelationSpan);
            tableRow.append(tableDataCurrentRelation);


            //player proposal and other player proposal
            var tableDataTargetRelation = $('<td/>');
            var tableDataHisTargetRelation = $('<td/>');
            //selector for target Relation
            if (mainObject.user.allianceId && mainObject.user.getAlliance().getUserRights()) {

                var selectorTargetRelation = $('<select/>');

                selectorTargetRelation.click(function (event) { event.stopPropagation(); });

                var option99 = $('<option/>');
                var option0 = $('<option/>', { text: mainObject.relationTypes[0].name });
                var option1 = $('<option/>', { text: mainObject.relationTypes[1].name });//Hostile
                var option2 = $('<option/>', { text: mainObject.relationTypes[2].name });
                var option3 = $('<option/>', { text: mainObject.relationTypes[3].name }); //Trade
                var option4 = $('<option/>', { text: mainObject.relationTypes[4].name }); //Pact
                //var option3 = $('<option/>', { text: mainObject.relationTypes[4].name }); //Alliance

                option99.val("99");
                option0.val("0");
                option1.val("1");
                option2.val("2");
                option3.val("3");
                option4.val("4");

                if (_alliance.targetRelation == null || _alliance.targetRelation == currentRelation) {
                    option99.attr('selected', 'selected');
                } else {

                    if (_alliance.targetRelation == 0) {
                        option0.attr('selected', 'selected');
                    }

                    if (_alliance.targetRelation == 1) {
                        option1.attr('selected', 'selected');
                    }

                    if (_alliance.targetRelation == 2) {
                        option2.attr('selected', 'selected');
                    }

                    if (_alliance.targetRelation == 3) {
                        option3.attr('selected', 'selected');
                    }

                    if (_alliance.targetRelation == 4) {
                        option4.attr('selected', 'selected');
                    }
                }

                selectorTargetRelation.append(option99);
                selectorTargetRelation.append(option0);
                selectorTargetRelation.append(option1);
                selectorTargetRelation.append(option2);
                selectorTargetRelation.append(option3);
                selectorTargetRelation.append(option4);

                selectorTargetRelation.change(() => { relationChangedTowardsAlliance(<HTMLSelectElement> (selectorTargetRelation.get()[0]), _alliance) });

                tableDataTargetRelation.append(selectorTargetRelation);
                tableRow.append(tableDataTargetRelation);

                //hisTargetRelation
                var spanHisTargetRelation = $('<span/>');
                if (_alliance.hisTargetRelation != null && _alliance.hisTargetRelation != currentRelation) {
                    spanHisTargetRelation.text(mainObject.relationTypes[_alliance.hisTargetRelation].name);
                    spanHisTargetRelation.css("background-color", mainObject.relationTypes[_alliance.hisTargetRelation].backGroundColor);
                    spanHisTargetRelation.addClass("spanHisTargetRelation");
                }
                tableDataHisTargetRelation.append(spanHisTargetRelation);
                tableRow.append(tableDataHisTargetRelation);

            } else { 
                tableRow.append(tableDataTargetRelation);
                tableRow.append(tableDataHisTargetRelation);    
            }
        }

        var tableDataInvite = $('<td/>');
        tableDataInvite.addClass("lastchild");
        if (mainObject.user.invitedByAlliance[_alliance.id] != null && mainObject.user.invitedByAlliance[_alliance.id] === 1) {

            var tableDataInviteDiv = $("<div/>");
            tableDataInvite.addClass("invite");
            //tableDataInviteDiv.css("background", "url(images/BlackIcons.png) no-repeat -120px 0px");
            //tableDataInviteDiv.css({ "width": "30px", "height": "30px","margin-left":"10px" });
            
            tableDataInvite.attr("title", i18n.label(458));//);           //"Einladung vorhanden" 
            tableDataInvite.append(tableDataInviteDiv);
            //tableRow.click(function () { Helpers.Log("TR click"); AllianceModule.entryPoint(_alliance.id, allianceList); });
            tableDataInvite.click(function (e) { e.stopPropagation(); Helpers.Log("join"); AllianceModule.joinAlliance(_alliance.id); });
            
        }
        tableRow.append(tableDataInvite);

        tableRow.find("span").addClass("restoreBackground");
        return tableRow;
    }    

    //helper class, to save data that is specific for this document. always check that the scope remains inside of this class!
    class AllianceDetails {
        windowHandle: ElementGenerator.WindowManager;
        allianceDetailsPage: JQuery;
        allianceDetailsBody: JQuery;

        detailsPage: JQuery;
        membersPage: JQuery;
        channelsPage: JQuery;
        politicsPage: JQuery;
        setupPage: JQuery;

        alliance: Alliance;
        hasAdminRights: boolean;

        descriptionChanged = false;

        constructor(public allianceId:number) {
            this.alliance = AllianceModule.getAlliance(allianceId);
              
        }

        
        allianceDetailsOld(_parent: ElementGenerator.WindowManager) {

            var hasAdminRights = mainObject.user.allianceId && this.alliance.id == mainObject.user.allianceId && this.alliance.getUserRights() ? true : false;
            this.hasAdminRights = hasAdminRights;

            $('#loader')[0].style.display = 'none';
            this.windowHandle = new ElementGenerator.WindowManager(_parent, e=> { this.messageTextChanged();});
            var allianceDetailsPage = this.windowHandle.element;

            this.allianceDetailsPage = allianceDetailsPage;

            //ElementGenerator.adjustPopupZIndex(this.allianceDetailsPage, 9000);

            allianceDetailsPage.css("width", "900px");
            allianceDetailsPage.css("margin-left", "-450px");
            $(".relPopupPanel", allianceDetailsPage).css("height", ($(document).height() - 200) + "px");

            //ElementGenerator.makeBig(_DesignerContainer);            

            var panelHeader = $('.relPopupHeader', allianceDetailsPage);
            var caption = $('<h2/>', { text: i18n.label(139) }); //, style: "float:left" }); // Alliances  i18n.label(143)
            panelHeader.append(caption);

            var panelBody = $('.relPopupBody', allianceDetailsPage);
            //panelBody.removeClass("trHighlight").addClass("tdHighlight");
            panelBody.css("padding-top", "6px");

            this.allianceDetailsBody = $('<div/>');
            this.allianceDetailsBody.appendTo(panelBody);


            /*Tab-Pages*/
            var tabDiv = $("<div/>");
            this.allianceDetailsBody.append(tabDiv);

            var tabUl = $("<ul/>");
            tabUl.css("display", "table"); //.ui-helper-clearfix:before, .ui-helper-clearfix:after
            tabUl.css("clear", "both");
            var tab1Id = "id1" + (new Date()).getTime();
            tabUl.append($("<li><a href='#" + tab1Id + "'>" + i18n.label(453) + "</a></li>")); //Bei fremden Allianzen current Relations Beschreibung
            var tab2Id = "id2" + (new Date()).getTime();
            tabUl.append($("<li><a href='#" + tab2Id + "'>" + i18n.label(451) + "</a></li>")); // Schiffe, Kolonien? Mitglieder
            var tab3Id = "id3" + (new Date()).getTime();
            tabUl.append($("<li><a href='#" + tab3Id + "'>" + i18n.label(454) + "</a></li>")); // Kommnetzwerke
            var tab4Id = "id4" + (new Date()).getTime();
            tabUl.append($("<li><a href='#" + tab4Id + "'>" + i18n.label(455) + "</a></li>")); //Politik current Relations, eingehende Angebote

            if (hasAdminRights) {
                var tab5Id = "id5" + (new Date()).getTime();
                tabUl.append($("<li><a href='#" + tab5Id + "'>" + i18n.label(141) + "</a></li>")); //Einrichtung
            }
            tabDiv.append(tabUl);

            this.detailsPage = $("<div id='" + tab1Id + "'/>", { "css": 'overflow-y: auto' });
            this.membersPage = $("<div id='" + tab2Id + "'/>", { "css": 'overflow-y: auto' });
            this.channelsPage = $("<div id='" + tab3Id + "'/>", { "css": 'overflow-y: auto' });
            this.politicsPage = $("<div id='" + tab4Id + "'/>", { "css": 'overflow-y: auto' });
            if (hasAdminRights) {
                this.setupPage = $("<div id='" + tab5Id + "'/>", { "css": 'overflow-y: auto' });
            }
            tabDiv.append(this.detailsPage).append(this.membersPage).append(this.channelsPage).append(this.politicsPage);
            if (hasAdminRights) {
                tabDiv.append(this.setupPage);
            }
            /*
            (function (a: AllianceDetails , x) {
                var callBack = x;
                if (!a.alliance.loaded) a.alliance.loadAlliance(a);
            })(this, this.refreshAll);
            */
            if (!this.alliance.loaded) this.loadAlliance();
            this.refreshAll();

            tabDiv.tabs();
            /*------------------------------------*/

        }

        allianceDetails(_parent: ElementGenerator.WindowManager) {

            var hasAdminRights = mainObject.user.allianceId && this.alliance.id == mainObject.user.allianceId && this.alliance.getUserRights() ? true : false;
            this.hasAdminRights = hasAdminRights;

            //create main Panel and add header + content
            this.windowHandle = ElementGenerator.MainPanel();
            this.windowHandle.setHeader(($("<span>" + this.alliance.name + "</span>")).html());
            this.windowHandle.callbackOnRemove = e=> { this.messageTextChanged(); };      
            this.allianceDetailsPage = this.windowHandle.element;

            var panelHeader = $('.relPopupHeader', this.allianceDetailsPage);
            //var caption = $('<h2/>', { text: i18n.label(139) }); //, style: "float:left" }); // Alliances  i18n.label(143)
           // panelHeader.append(caption);

            var panelBody = $('.relPopupBody', this.allianceDetailsPage);
            panelBody.css("padding-top", "6px");

            this.allianceDetailsBody = $('<div/>');
            this.allianceDetailsBody.appendTo(panelBody);


            /*Tab-Pages*/
            var tabDiv = $("<div/>");
            this.allianceDetailsBody.append(tabDiv);

            var tabUl = $("<ul/>");
            tabUl.css("display", "table"); //.ui-helper-clearfix:before, .ui-helper-clearfix:after
            tabUl.css("clear", "both");
            var tab1Id = "id1" + (new Date()).getTime();
            tabUl.append($("<li><a href='#" + tab1Id + "'>" + i18n.label(453) + "</a></li>")); //Bei fremden Allianzen current Relations Beschreibung
            var tab2Id = "id2" + (new Date()).getTime();
            tabUl.append($("<li><a href='#" + tab2Id + "'>" + i18n.label(451) + "</a></li>")); // Schiffe, Kolonien? Mitglieder
            var tab3Id = "id3" + (new Date()).getTime();
            tabUl.append($("<li><a href='#" + tab3Id + "'>" + i18n.label(454) + "</a></li>")); // Kommnetzwerke
            var tab4Id = "id4" + (new Date()).getTime();
            tabUl.append($("<li><a href='#" + tab4Id + "'>" + i18n.label(455) + "</a></li>")); //Politik current Relations, eingehende Angebote

            if (hasAdminRights) {
                var tab5Id = "id5" + (new Date()).getTime();
                tabUl.append($("<li><a href='#" + tab5Id + "'>" + i18n.label(141) + "</a></li>")); //Einrichtung
            }
            tabDiv.append(tabUl);

            this.detailsPage = $("<div id='" + tab1Id + "'/>", { "css": 'overflow-y: auto' });
            this.membersPage = $("<div id='" + tab2Id + "'/>", { "css": 'overflow-y: auto' });
            this.channelsPage = $("<div id='" + tab3Id + "'/>", { "css": 'overflow-y: auto' });
            this.politicsPage = $("<div id='" + tab4Id + "'/>", { "css": 'overflow-y: auto' });
            if (hasAdminRights) {
                this.setupPage = $("<div id='" + tab5Id + "'/>", { "css": 'overflow-y: auto' });
            }
            tabDiv.append(this.detailsPage).append(this.membersPage).append(this.channelsPage).append(this.politicsPage);
            if (hasAdminRights) {
                tabDiv.append(this.setupPage);
            }
            /*
            (function (a: AllianceDetails , x) {
                var callBack = x;
                if (!a.alliance.loaded) a.alliance.loadAlliance(a);
            })(this, this.refreshAll);
            */
            if (!this.alliance.loaded) this.loadAlliance();
            this.refreshAll();

            tabDiv.tabs();
            /*------------------------------------*/

        }

        refreshAll() {
            this.refreshDetailsPage();
            this.refreshMembersPage();
            this.refreshChannelsPage();
            this.refreshPoliticsPage();
            if (this.hasAdminRights) {
                this.refreshSetupPage();
            }
        }

        refreshDetailsPage() {
            this.detailsPage.empty();


            var userAlliance = AllianceModule.getAlliance(this.allianceId);
            var ownAllianceTable = $('<table/>', { "class": "tableBorderBlack highlightTableRow",  "cellspacing": 0 });// , style:"border-collapse: collapse;"
            this.detailsPage.append(ownAllianceTable);

            var ownTableRow = $('<tr/>');
            ownTableRow.addClass("allianceLine");
            //ID
            var tableDataId = $('<td/>', { text: userAlliance.id, "class": "firstchild tdTextLeft" });
            ownTableRow.append(tableDataId);

            //Name
            var name = $('<td/>');
            name.append($("<span>" + userAlliance.name + "</span>"));
            ownTableRow.append(name);

            ownAllianceTable.append(ownTableRow);    
            
            var descSpan = $("<span>" + userAlliance.description + "</span>");
            this.detailsPage.append(descSpan);                        
        }   

        createOwnAllianceMembersTableHeader(): JQuery {

            var tableRow = $('<tr/>');
            var th = ElementGenerator.headerElement; //labels, width, noRightBorder, tooltip
            var thPic = ElementGenerator.headerPictureElement; //labels, width, noRightBorder, tooltip

            tableRow.append(th(442, 40)); //id 
            tableRow.append(th(459, 180)); //User Name
            tableRow.append(th(570, 50)); ////rank
            //tableRow.append(th(571, 80)); //overallVicPoints
            /*tableRow.append(thPic("url(images/BlackIcons.png) no-repeat -90px 0px", 631,30,5)); //id        PopulationPoints
            tableRow.append(thPic("url(images/BlackIcons.png) no-repeat -240px 0px", 632, 30, 5)); //id       research  
            tableRow.append(thPic("url(images/BlackIcons.png) no-repeat 0px 0px", 633, 30, 5)); //id shipVicPoints
            tableRow.append(thPic("url(images/BlackIcons.png) no-repeat -180px 0px", 634, 30, 5)); //id goodsVicPoints
            */            
            tableRow.append(ElementGenerator.headerClassElement("IconPopulation", 631, 30, 5));          //id        PopulationPoints
            tableRow.append(ElementGenerator.headerClassElement("IconResearch", 632, 30, 5));         //id       research            
            tableRow.append(ElementGenerator.headerClassElement("IconShip", 633, 30, 5));     //id       shipVicPoints 
            //tableRow.append(ElementGenerator.headerClassElement("IconGoods", 634, 30, 5));     //id       goodsVicPoints 
            tableRow.append(ElementGenerator.headerClassElement("IconTranscendence", 590, 30, 5));     //id       Transcendence 
                      
            tableRow.append(th(null, 35)); //kick user

            return tableRow;
        }
        
        createAllianceMemberRow(_parent: ElementGenerator.WindowManager, userdata: PlayerData.User): JQuery {

            var tableRow = $("<tr/>", { "class": "trLightGrey" });

            tableRow.click(() => { DiplomacyModule.entryPoint2(userdata.id, null); });

            if (mainObject.user.id == userdata.id) {
                tableRow.addClass("ownAlliance");
            }

            //ID
            var tableDataId = $('<td/>', { text: userdata.id.toString()});
            tableRow.append(tableDataId);

            //NAME
            var tableDataName = $('<td/>');
            tableDataName.html(userdata.name);
            tableRow.append(tableDataName);
                   
            

            //rank
            var tableDataName = $('<td/>', { text: userdata.overallRank.toString() });
            tableRow.append(tableDataName);
            //overallVicPoints
            //var tableDataName = $('<td/>', { text: userdata.overallVicPoints.toString() });
            //tableRow.append(tableDataName);
            //PopulationPoints
            var tableDataName = $('<td/>', { text: userdata.popVicPoints.toString() });
            tableRow.append(tableDataName);
            //research
            var tableDataName = $('<td/>', { text: userdata.researchVicPoints.toString() });
            tableRow.append(tableDataName);
            //shipVicPoints
            var tableDataName = $('<td/>', { text: userdata.shipVicPoints.toString() });
            tableRow.append(tableDataName);
            //goodsVicPoints
            var tableDataName = $('<td/>', { text: userdata.goodsVicPoints.toString() });
            tableRow.append(tableDataName);            

            //
            var tableDataLeaveNKick = $('<td/>');
            tableDataLeaveNKick.addClass("invite");
            

            var tableDataExitDiv = $('<div/>');
            tableDataExitDiv.addClass("IconQuit");
            tableDataLeaveNKick.append(tableDataExitDiv);
            /*
            tableDataExitDiv.css("background", "url(images/BlackIcons.png) no-repeat -300px 0px");
            tableDataExitDiv.css("width", "30px");
            tableDataExitDiv.css("height", "30px");
            */
         
            tableDataLeaveNKick.css("height", "28px");
            tableRow.append(tableDataLeaveNKick);
            if (!mainObject.user.allianceId || userdata.allianceId != mainObject.user.allianceId) {
                tableDataExitDiv.css("visibility", "hidden");
            }
            else {
                //add click event, closure to fetch userId
                //one can kick oneselves or one is the admin and can kick all
                if (mainObject.user.id == userdata.id || mainObject.user.isAllianceAdmin()) {
                    (() => {
                        var __i = userdata.id;
                        $(".invite", tableRow).click((_event, _input) => {
                            _event.preventDefault(); _event.stopPropagation();
                            this.askToLeaveAlliance(_event, _input, __i);
                        });
                    })();
                }


                if (mainObject.user.id == userdata.id) {
                    tableDataLeaveNKick.attr("title", i18n.label(635));//i18n.label(635)); // N'Leave alliance', N'', 7)
                } else {
                    if (mainObject.user.isAllianceAdmin()) {
                        tableDataLeaveNKick.attr("title", i18n.label(636));//i18n.label(636)); //N'Kick member', N'', 7)
                    }
                    else {
                        tableDataExitDiv.css("visibility", "hidden");
                    }
                }
            }                        
            return $(tableRow);
        }


        createOwnAllianceInviteMembersTableHeader(): JQuery {
            var tableRow = $('<tr/>');
            var th = ElementGenerator.headerElement; //labels, width, noRightBorder, tooltip
            var thPic = ElementGenerator.headerPictureElement; //labels, width, noRightBorder, tooltip

            tableRow.append(th(442, 40)); //id 
            tableRow.append(th(459, 180)); //User Name
            tableRow.append(th(570, 80)); ////rank
            tableRow.append(th(571, 80)); //overallVicPoints            
            tableRow.append(th(null, 35)); //kick user

            return tableRow;
        }

        createAllianceInviteMemberRow(_parent: ElementGenerator.WindowManager, userdata: PlayerData.User): JQuery {

            var tableRow = $("<tr/>");
            tableRow.click(() => { DiplomacyModule.entryPoint2(userdata.id, null); });

            //ID
            var tableDataId = $('<td/>', { text: userdata.id.toString(), "class": "firstchild" });
            tableRow.append(tableDataId);

            //NAME
            var tableDataName = $('<td/>', { text: userdata.name });
            tableRow.append(tableDataName);

            //rank
            var tableDataName = $('<td/>', { text: userdata.overallRank.toString() });
            tableRow.append(tableDataName);
            //overallVicPoints
            var tableDataName = $('<td/>', { text: userdata.overallVicPoints.toString() });
            tableRow.append(tableDataName);
            
            //end invitation
            var tableDataLeaveNKick = $('<td/>');
            tableDataLeaveNKick.addClass("invite");

            var tableDataExitDiv = $('<div/>');
            tableDataExitDiv.addClass("IconQuit");
            tableDataLeaveNKick.append(tableDataExitDiv);


            //tableDataInvite.css("background-size", "30px 30px");            
            tableDataLeaveNKick.css("height", "28px");
            tableRow.append(tableDataLeaveNKick);
            
            //add click event, closure to fetch userId
            (() => {
                var __i = userdata.id;
                $(".invite", tableRow).click((_event, _input) => {
                    _event.preventDefault(); _event.stopPropagation();
                    this.invitationRevoked(_event, _input, __i);
                });
            })();            
            
            return $(tableRow);
        }


        refreshMembersPage() {
            this.membersPage.empty();
            
            //list of persons of this alliance                         
            var all: PlayerData.User[] = this.alliance.allMembers();

            this.windowHandle.createTable(this.membersPage, all, this.createOwnAllianceMembersTableHeader, this.createAllianceMemberRow, null, 0, this, 53);              

            //Spieler einladen , alle Einladungen einsehen, Spieler dort dann auch ausladen
            if (this.hasAdminRights) {
            //if (mainObject.user.allianceId && mainObject.user.isAllianceAdmin() && mainObject.user.allianceId == this.alliance.id ) {                



                this.membersPage.append($("<br>"));

                //create innput to invite a player
                var nameInput = $("<input/>", { type: "text", value: "0" });
                nameInput.css("width", "4em");
                var name = $("<span>" + i18n.label(572) + "</span>");  // "invite players"
                name.css("margin-right", "10px");

                this.membersPage.append(name).append(nameInput);
                nameInput.change((_event, _input) => {
                    Helpers.Log((<HTMLInputElement>_event.currentTarget).value);
                    var invitedUser = parseInt((<HTMLInputElement>_event.currentTarget).value, 10);

                    this.alliance.invitedUsers[invitedUser] = 1;
                    var postData = (<HTMLInputElement>_event.currentTarget).value;
                    $.ajax("Server/Alliances.aspx?action=inviteToAlliance", {
                        type: "POST",
                        data: invitedUser.toString(),
                        contentType: "xml",
                        processData: false
                    });
                    this.refreshMembersPage();
                });
                
                //check if at least one invitation exists
                var invitationExists = false;
                var invitation: PlayerData.User[] = [];
                for (var i = 0; i < this.alliance.invitedUsers.length; i++) {
                    if (this.alliance.invitedUsers[i] == null) continue;
                    if (this.alliance.invitedUsers[i] === 1) {
                        invitationExists = true;
                        invitation.push(PlayerData.findUser(i));                        
                    };
                }

                // create a table with existing invitations 
                if (invitationExists) {                   
                    this.windowHandle.createTable(this.membersPage, invitation, this.createOwnAllianceInviteMembersTableHeader, this.createAllianceInviteMemberRow, null, 0, this, 56);  
                }
            }
        }   

       
        invitationRevoked(_event, _input, invitedUser) {
            Helpers.Log(_event.currentTarget.value);

            this.alliance.invitedUsers[invitedUser] = 0;
            var postData = invitedUser;
            $.ajax("Server/Alliances.aspx?action=removeInvitation", {
                type: "POST",
                data: invitedUser,
                contentType: "xml",
                processData: false
            });

            this.refreshMembersPage();
        }

        //can be called on own user or other member of alliance
        askToLeaveAlliance(_event, _input, userToDismiss : number) {
            Helpers.Log("leaveAlliance " + userToDismiss);

            var headerText = (userToDismiss == mainObject.user.id) ? i18n.label(457) : i18n.label(456); //Allianz verlassen? | //Kick member?

            //var windowHandle = new ElementGenerator.WindowManager(this.windowHandle);
            var windowHandle = ElementGenerator.createNoYesPopup(
                (e) => { e.preventDefault(); this.leaveAlliance(userToDismiss); windowHandle.remove(); this.refreshMembersPage();},
                (e) => { e.preventDefault(); windowHandle.remove(); },
                headerText,
                '',
                null,
                0);

            $(".bX", windowHandle).css("display", "none");
            
            /*
            var confirmDiplomacyPanel = windowHandle.element;
            windowHandle.showNoButton(true);
            //var confirmDiplomacyPanel = ElementGenerator.createRelativePopup(this.allianceDetailsPage);
            //$(".noButton", confirmDiplomacyPanel).css("display", "inline-block");     
            
            
            ElementGenerator.makeSmall(confirmDiplomacyPanel);

            var panelBody = $('.relPanelBody', confirmDiplomacyPanel);
            var caption = $('<h4/>', { text: i18n.label(456) }); //Kick member?

            if (userToDismiss == mainObject.user.id) caption = $('<h4/>', { text: i18n.label(457) }); //Allianz verlassen?

            panelBody.append(caption);

            $('.yesButton span', confirmDiplomacyPanel).text(i18n.label(291));
            $('.noButton span', confirmDiplomacyPanel).text(i18n.label(292));

            $('.yesButton', confirmDiplomacyPanel).click((e) => { e.preventDefault(); this.leaveAlliance(userToDismiss);   });
            $('.noButton', confirmDiplomacyPanel).click(function (e) { e.preventDefault(); confirmDiplomacyPanel.data("window").remove(); });



            var postData = userToDismiss;
            this.refreshMembersPage();
            */
        }

        leaveAlliance(userToDismiss) {

            var postData = userToDismiss;
            var allianceId = this.alliance.id;

            $.ajax("Server/Alliances.aspx?action=leaveAlliance&allianceId=" + this.alliance.id, {
                type: "POST",
                data: userToDismiss,
                contentType: "xml",
                processData: false
            });

            PlayerData.findUser(userToDismiss).allianceId = 0;

            if (mainObject.user.id == userToDismiss) {
                CommModule.RemoveAllianceNode();
            }
            
            var memberCount = this.alliance.countMembers();
            if (!memberCount) this.alliance.deleteAlliance();

            this.refreshMembersPage();
        }
 

        refreshChannelsPage() {
            this.channelsPage.empty();
            this.channelsPage.append($("<span/>") );
        }   

        refreshPoliticsPage() {
            this.politicsPage.empty();


            //build Table of known users                    
            var buildTable = this.windowHandle.createTable(this.politicsPage, this.alliance.currentRelations, this.createAllianceDiplomaticsHeader, this.createAllianceDiplomaticsRow, null, 0, this, 40);

            /*

            var allianceTable = $('<table/>', { "class": "tableBorderBlack highlightTableRow", "cellspacing": 0 });// , style:"border-collapse: collapse;"

            this.politicsPage.append(allianceTable);
            allianceTable.append($('<thead/>').append(createAllianceHeader(true)));
            //$("thead th.nameTh div", allianceTable).width(130);

            var tBody = $("<tbody/>");
            allianceTable.append(tBody);
            var makeGray = false;
            for (var i = 0; i < AllianceModule.alliances.length; i++) {
                if (AllianceModule.alliances[i] == null) continue;
                if (this.alliance.id == i) continue;

                //überspringe alle neutralen beziehungen, solange nicht ein Angebot gegenüber der Spielerallianz vorliegt
                if (this.alliance.currentRelations[i] && this.alliance.currentRelations[i] == 2) continue;
                
                //überspringe wenn keine Relation vorliegt (neutral)
                if (!this.alliance.currentRelations[i] ) continue;

                //    && (!(this.alliance.id == mainObject.user.allianceId && AllianceModule.getAlliance(i).targetRelation != null ))) continue;

                ( (_alliance: Alliance) =>  {
                    var tableRow = createAllianceLine(this.windowHandle,_alliance,true);
                    if (makeGray) {
                        //tableRow.find("*").css("background-color", "#888888");
                        //tableRow.css("background-color", "#888888");
                        tableRow.addClass("trDarkGrey");
                        makeGray = false;
                    } else {
                        makeGray = true;
                    }
                    tBody.append(tableRow);
                    //tableRow.click(function () { Helpers.Log("TR click"); AllianceModule.entryPoint2(_alliance.id, allianceListWindow); });
                })(AllianceModule.alliances[i]);
            }

            Helpers.makeSortable(allianceTable, $("th", allianceTable));

            //for each row, set width of tds to withd of head
            Helpers.copyTableHeaderWidthToRows(allianceTable);
            //tbody.height : set height of tbody, so that its overflow-y works - used div height - table head hight
            // or use only the height of the rows included, if that is less (else the border of the table is shown incorrectly)
            Helpers.setTBodyHeight(this.politicsPage, $("#allAlliancesDiv table"));

            */
        }   

        createAllianceDiplomaticsHeader(): JQuery {

            var tableRow = $('<tr/>');

            //ID
            var goodsDiv = $("<div>");
            goodsDiv.append($("<span>", { text: i18n.label(442) })); //ID
            var tableDataId = $('<th/>', { "class": "tdTextLeft borderBottom" });
            tableDataId.append(goodsDiv);
            goodsDiv.css("width", "40px");
            tableRow.append(tableDataId);


            //Name     
            var offerDiv = $("<div>");
            offerDiv.append($("<span>", { text: i18n.label(459) })); //Name
            var tableDataOffer = $('<th/>', { "class": "tdTextLeft borderBottom" });
            offerDiv.css("width", "180px");
            tableDataOffer.append(offerDiv);
            tableRow.append(tableDataOffer);           

            //Status
            var coloniesDiv = $("<div>");
            coloniesDiv.append($("<span>", { text: i18n.label(447) })); //Relation
            var tableDataMembers = $('<th/>', { "class": "tdTextLeft borderBottom" });
            tableDataMembers.append(coloniesDiv);
            coloniesDiv.css("width", "115px");
            tableRow.append(tableDataMembers);


            return tableRow;
        }

        //PlayerData.UserRelation
        createAllianceDiplomaticsRow(_parent: ElementGenerator.WindowManager, userRelation: PlayerData.UserRelation): JQuery {

            if (!AllianceModule.allianceExists(userRelation.targetId)) return;

            var alliance = AllianceModule.alliances[userRelation.targetId];
           

            var tableRow = $("<tr/>");

            if (mainObject.user.allianceId == alliance.id) {
                tableRow.addClass("ownAlliance");
            }

            //ID
            var tableDataId = $('<td/>', { text: alliance.id.toString() });
            tableRow.append(tableDataId);

            tableRow.click(() => { DiplomacyModule.entryPoint2(alliance.id, _parent); });

            //NAME
            var tableDataName = $('<td/>');
            var nameSpan = $("<span>" + alliance.name + "</span>");            
            tableDataName.append(nameSpan);
            tableRow.append(tableDataName);
           

            


            var tableDataCurrentRelation = $('<td/>');

            var ContactStateDiv2 = $('<div/>');
            ContactStateDiv2.addClass("contactState");
            ContactStateDiv2.css("height", "30px");
            ContactStateDiv2.css("width", "30px");

            ContactStateDiv2.addClass(mainObject.relationTypes[userRelation.state].backgroundSymbolClass + "Small");
            ContactStateDiv2.attr("title", i18n.label(mainObject.relationTypes[userRelation.state].nameLabel));

            tableDataCurrentRelation.append(ContactStateDiv2);
            tableRow.append(tableDataCurrentRelation);
            //currentRelation     
            /*
            var tableDataCurrentRelationSpan = $('<span/>', { text: mainObject.relationTypes[userRelation.state].name });
            tableDataCurrentRelationSpan.css("background-color", mainObject.relationTypes[userRelation.state].backGroundColor);
            tableDataCurrentRelationSpan.addClass("spanCurrentRelation");
            tableDataCurrentRelation.append(tableDataCurrentRelationSpan);
            tableRow.append(tableDataCurrentRelation);
            */



            return $(tableRow);
        }



        refreshSetupPage() {
            this.setupPage.empty();

            var nameInput = $("<input/>", { type: "text", value: this.alliance.name });
            nameInput.css("width", "22em");
            //nameInput.css("float", "left");
            var name = $("<span>" + this.alliance.name + "</span>");
            name.css("margin-left","10px");

            nameInput.change( (_event, _input) => {
                Helpers.Log((<HTMLInputElement>_event.currentTarget).value);
                this.alliance.name = (<HTMLInputElement>_event.currentTarget).value;
                name.html((<HTMLInputElement>_event.currentTarget).value);
                
                var postData = (<HTMLInputElement>_event.currentTarget).value;
                $.ajax("Server/Alliances.aspx?action=renameAlliance",{
                    type: "POST",
                    data: postData,
                    contentType: "xml",
                    processData: false
                });
                this.refreshAll();
            });

            var nameSpan = $("<span/>");
            this.setupPage.append(nameSpan);
            nameSpan.append(nameInput);
            nameSpan.append(name);
            

            //create alliance description editor:
            /*
            var messageBody = $("<div/>");
            messageBody.css("overflow-y","auto");
            var messageText = $("<textarea/>");            
            messageText.val(this.alliance.description);
            messageBody.append(messageText);
            this.setupPage.append(messageBody);
            messageText.width(this.setupPage.width() - 20);
            messageBody.css("min-height", 400 + 'px');
            */
            var writeBodyDiv = $("<div/>");
            writeBodyDiv.addClass("CommMessageWriteContainer");
            var messageBody = $("<div/>", { "class": "commMessageMaxHeight" });
            var messageText = $("<textarea/>", { "class": "messageBody" });
            messageBody.append(messageText);
            writeBodyDiv.append(messageBody);
            messageText.val(this.alliance.description);
            messageText.css("min-height", '100px');
            this.setupPage.append(writeBodyDiv);

            /*
            messageText.change((_event, _input) => {
                this.messageTextChanged(_event.currentTarget.value);
            });
            */
            messageText.keyup(() => {
                this.keyUp();
            });



            messageText.on('blur', (e) => {
                this.refreshSetupPage();
            });


            this.setupPage.append($('<br>'));
            this.setupPage.append(this.alliance.description);
        }   

        keyUp() {
            /*
            if (!this.descriptionChanged) {
                this.allianceDetailsPage.data("popup").callbackOnRemove = () => {
                    this.messageTextChanged($("textarea", this.allianceDetailsPage ).val()); };
            }*/
            this.alliance.description = $("textarea", this.allianceDetailsPage).val().toString();
            this.descriptionChanged = true;
        }

        messageTextChanged() {
            if (!this.descriptionChanged) return;
            this.descriptionChanged = false;

            Helpers.Log(this.alliance.description);
           
            // messageText.val.html(_event.currentTarget.value);

            var postData = this.alliance.description;
            $.ajax("Server/Alliances.aspx?action=changeDescription", {
                type: "POST",
                data: postData,
                contentType: "xml",
                processData: false
            });

            this.refreshDetailsPage();
        }
        /*HELPER FUNCTIONS*/
        loadAllianceWorker(msg: Document) {

            Helpers.Log("loadAllianceWorker");

            /*
            {"allianceId":2,"description":"","relation":[{"Id":1,"State":4},{"Id":4,"State":4}]}
            */

            this.alliance.description = msg["description"];

            if (!(mainObject.user.allianceId && this.alliance.id == mainObject.user.allianceId)) {
                this.alliance.currentRelations = [];

                var relations: PlayerData.UserRelation[] = msg["relation"];
                for (var i = 0; i < relations.length; i++) {
                    var newRelation = new PlayerData.UserRelation();
                    newRelation.targetId = relations[i]["Id"];
                    newRelation.state = relations[i]["State"];
                    Helpers.Log("PlayerData.UserRelation : " + newRelation.targetId.toString() + "   --   " + newRelation.state.toString());
                    this.alliance.currentRelations.push(newRelation);
                }


                /*
                var relations: PlayerData.UserRelation[] = msg["relation"];
                for (var i = 0; i < relations.length; i++) {
                    this.alliance.currentRelations[relations[i]["Id"]] = relations[i]["State"]; 
                }
                */
            }
            /*
            var XMLusers = msg.getElementsByTagName("description");
            if (XMLusers && XMLusers[0] && XMLusers[0].childNodes && XMLusers[0].childNodes[0] && XMLusers[0].childNodes[0].nodeValue) {
                this.alliance.description = XMLusers[0].childNodes[0].nodeValue;

            } else return;
            */

            /*
            var invites = msg.getElementsByTagName("allianceInvite");
            var invitesLength = invites.length;

            for (var i = 0; i < invitesLength; i++) {
                var userId = invites[i].getElementsByTagName("userId")[0].childNodes[0].nodeValue;
                this.alliance.invitedUsers[parseInt(userId, 10)] = 1;
            }
            */
            this.alliance.loaded = true;
            this.refreshAll();
        }

        loadAlliance() {
            
            $.ajax("Server/Alliances.aspx", {
                "type": "POST",
                "data": {
                    "action": "GetDetails",
                    "allianceId": this.alliance.id
                }
            }).done((msg) => {
                this.loadAllianceWorker(msg);
                });
        }
    } 


    export function entryPoint2(allianceId: number, _parent: ElementGenerator.WindowManager) {

        if (allianceId) {
            Helpers.Log('EinzelAllianz');
            (new AllianceDetails(allianceId)).allianceDetails(_parent);
        }
        else {
            Helpers.Log("Alle Allianzen");
            runTemplate();
        }
    }


    new Designer();
   
}
//mainObject.scriptsAdmin.scripts.push(new Spaceport());
//mainObject.scriptsAdmin.find(1, 4).run();