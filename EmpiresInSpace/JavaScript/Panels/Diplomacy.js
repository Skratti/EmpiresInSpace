var DiplomacyModule;
(function (DiplomacyModule) {
    var namesPerhapsToBig = [];
    function RelationColor(relationCode) {
        var RelationColor;
        switch (relationCode) {
            case 0:
                RelationColor = "#ff1010"; //enemy - red
                break;
            case 1:
                RelationColor = "#ff1010"; //enemy - red
                break;
            case 2:
                RelationColor = "#bbbbbb"; //neutral - yellow
                break;
            case 3:
                RelationColor = "#44aa44"; //neutral - trade treaty
                break;
            case 4:
                RelationColor = "#6699FF"; //neutral - pact - light blue
                break;
            case 5:
                RelationColor = "#0000CC"; //neutral - alliance member - dark blue
                break;
            case 10:
                RelationColor = "#10ff10"; //own - green
                break;
            default:
                RelationColor = "#bababa";
        }
        return RelationColor;
    }
    DiplomacyModule.RelationColor = RelationColor;
    function FetchUserResearch(user) {
        $.connection.spaceHub.invoke("FetchUserResearch", user.id).done(function (e) {
            //Chat.ActiveUsersDone(e);
            Helpers.Log('2 FetchUserResearch ' + user.name);
            //user.researchDataLoaded = true;
            Helpers.Log(e);
            for (var i = 0; i < e.Researchs.length; i++) {
                var researchId = e.Researchs[i];
                var newResearch = new PlayerData.PlayerResearches(researchId);
                //add to Building array
                user.playerResearches[researchId] = newResearch;
                user.playerResearches[researchId].isCompleted = true;
            }
            for (var i = 0; i < BaseDataModule.SpecializationGroups.length; i++) {
                var SpecGroup = BaseDataModule.SpecializationGroups[i];
                SpecGroup.setPickState(user);
            }
            user.researchDataLoaded = true;
        });
    }
    DiplomacyModule.FetchUserResearch = FetchUserResearch;
    function relationChanged(relationSelector, targetUser) {
        //var newValue = relationSelector.selectedIndex;
        var newValue = parseInt(relationSelector.value);
        if (newValue == targetUser.currentRelation)
            return;
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
        }
        else {
            var tempTargetRelation = newValue;
            var tempTargetUser = targetUser;
            var tempRelationSelector = relationSelector;
            var captionText = newValue == 0 ? i18n.label(625) : i18n.label(296);
            var bodyText = newValue == 0 ? i18n.label(626) : '';
            var confirmDiplomacyPanel = ElementGenerator.createWorsenRelationPopup(function (e) { e.preventDefault(); DiplomacyModule.relationChangeAccepted(tempTargetUser, tempTargetRelation, tempRelationSelector); confirmDiplomacyPanel.remove(); }, function (e) { e.preventDefault(); confirmDiplomacyPanel.remove(); relationSelector.value = targetUser.currentRelation.toString(); }, captionText, bodyText, null, 0, newValue);
            ElementGenerator.adjustPopupZIndex(confirmDiplomacyPanel, 16000);
            ElementGenerator.makeSmall(confirmDiplomacyPanel);
            confirmDiplomacyPanel.appendTo("body"); //attach to the <body> element
            /*
            var confirmDiplomacyPanel = ElementGenerator.createPopup();

            ElementGenerator.adjustPopupZIndex(confirmDiplomacyPanel, 12000);
            ElementGenerator.makeSmall(confirmDiplomacyPanel);

            var panelBody = $('.panelBody', confirmDiplomacyPanel);
            var captionText = newValue == 0 ? i18n.label(625) : i18n.label(296);
            var caption = $('<h4/>', { text: captionText });
            panelBody.append(caption);

            if (newValue == 0) {
                panelBody.append($('<p/>', { text: i18n.label(626) }));
            }

            $('.noButton', confirmDiplomacyPanel).css("display", "block");
            $('.yesButton span', confirmDiplomacyPanel).text(i18n.label(291));
            $('.noButton span', confirmDiplomacyPanel).text(i18n.label(292));

            var tempTargetRelation = newValue;
            var tempTargetUser = targetUser;
            var tempRelationSelector = relationSelector;

            $('.yesButton', confirmDiplomacyPanel).click((e) => { e.preventDefault(); DiplomacyModule.relationChangeAccepted(tempTargetUser, tempTargetRelation, tempRelationSelector); confirmDiplomacyPanel.remove(); });
            $('.noButton', confirmDiplomacyPanel).click(function (e) { e.preventDefault(); confirmDiplomacyPanel.remove(); relationSelector.value = targetUser.currentRelation.toString(); });

            confirmDiplomacyPanel.appendTo("body"); //attach to the <body> element

            */
        }
        //Helpers.Log(targetUser.id + " relationChanged... " + newValue);
    }
    DiplomacyModule.relationChanged = relationChanged;
    function relationChangeAccepted(_tempTargetUser, _tempTargetRelation, _tempRelationSelector) {
        _tempTargetUser.currentRelation = _tempTargetRelation;
        _tempTargetUser.targetRelation = _tempTargetRelation;
        //update the corresponding field with current Relation
        var parentRow = _tempRelationSelector.parentNode.parentNode;
        var newRelationType = mainObject.relationTypes[_tempTargetRelation];
        $(parentRow).find(".spanCurrentRelation").css("backgroundColor", newRelationType.backGroundColor);
        $(parentRow).find(".spanCurrentRelation").text(newRelationType.name);
        $.ajax("Server/User.aspx", {
            type: "GET",
            data: {
                "targetUser": _tempTargetUser.id.toString(),
                "action": "setRelation",
                "targetRelation": _tempTargetRelation
            }
        }).done(function (msg) {
            mainObject.user.getOtherUsersFromXML(msg);
            mainObject.getShipsFromXML(msg);
            mainInterface.drawAll();
        });
    }
    DiplomacyModule.relationChangeAccepted = relationChangeAccepted;
    var AllUsersDetail = /** @class */ (function () {
        function AllUsersDetail() {
        }
        AllUsersDetail.prototype.showOtherUsers2 = function (_parent) {
            this.windowHandle = ElementGenerator.MainPanel();
            this.windowHandle.setHeader(i18n.label(136));
            this.allUsersPage = this.windowHandle.element;
            this.allUsersPage.addClass("AllContactsPanel");
            this.refreshAllUsers();
            $('#loader')[0].style.display = 'none';
            this.windowHandle.SetBottom();
        };
        AllUsersDetail.prototype.refreshAllUsers = function () {
            var panelBody = $('.relPopupBody', this.allUsersPage);
            panelBody.empty();
            namesPerhapsToBig = [];
            //exclude non players:
            var players = [];
            for (var i = 0; i < PlayerData.users.length; i++) {
                if (typeof PlayerData.users[i] === 'undefined' || PlayerData.users[i].isAI()) {
                    continue;
                }
                players.push(PlayerData.users[i]);
            }
            //build Table of known users
            var buildTable = this.windowHandle.createTable(panelBody, players, createAllUsersHeader, this.showOtherUsersRow, null, 0, this, 40);
        };
        /*
        relationChangeAccepted() {

            this.tempTargetUser.currentRelation = this.tempTargetRelation;
            this.tempTargetUser.targetRelation = this.tempTargetRelation;

            //update the corresponding field with current Relation
            var parentRow = <HTMLTableRowElement> this.tempRelationSelector.parentNode.parentNode;
            var newRelationType = mainObject.relationTypes[this.tempTargetRelation];
            $(parentRow).find(".spanCurrentRelation").css("backgroundColor", newRelationType.backGroundColor);
            $(parentRow).find(".spanCurrentRelation").text(newRelationType.name);

            $.ajax("Server/User.aspx", {
                type: "GET",
                data: {
                    "targetUser": this.tempTargetUser.id.toString(),
                    "action": "setRelation",
                    "targetRelation": this.tempTargetRelation
                }
            }).done(function (msg) {
                    mainObject.user.getOtherUsersFromXML(msg);
                    mainObject.getShipsFromXML(msg);
                    mainInterface.drawAll();
                });
        }
        */
        /*
        relationChanged(relationSelector: HTMLSelectElement, targetUser: PlayerData.OtherPlayer) {

            var newValue = parseInt(relationSelector.value);

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

                var tempTargetRelation = newValue;
                var tempTargetUser = targetUser;
                var tempRelationSelector = relationSelector;

                var captionText = newValue == 0 ? i18n.label(625) : i18n.label(296);
                var bodyText = newValue == 0 ? i18n.label(626) : '';
                var confirmDiplomacyPanel = ElementGenerator.createNoYesPopup(
                    (e) => { e.preventDefault(); DiplomacyModule.relationChangeAccepted(tempTargetUser, tempTargetRelation, tempRelationSelector); confirmDiplomacyPanel.remove(); },
                    (e) => { e.preventDefault(); confirmDiplomacyPanel.remove(); relationSelector.value = targetUser.currentRelation.toString(); },
                    captionText,
                    bodyText
                    );
                ElementGenerator.adjustPopupZIndex(confirmDiplomacyPanel, 16000);
                ElementGenerator.makeSmall(confirmDiplomacyPanel);
                confirmDiplomacyPanel.appendTo("body"); //attach to the <body> element
            }

        }
        */
        AllUsersDetail.prototype.showOtherUsersRow = function (_parent, userdata) {
            var tableRow = $("<tr/>");
            if (mainObject.user.id == userdata.id) {
                tableRow.addClass("ownAlliance");
            }
            //ID
            //var tableDataId = $('<td/>', { text: userdata.id.toString() });
            var tableDataAvatar = $('<td/>');
            tableDataAvatar.append(userdata.MakeAvatarDiv());
            tableRow.append(tableDataAvatar);
            tableRow.click(function () { DiplomacyModule.entryPoint2(userdata.id, _parent); });
            //NAME
            var tableDataName = $('<td/>');
            tableDataName.css("word-break", "break-word");
            //var nameSpan = $("<span>" + userdata.tagFreeName + "</span>");
            var nameSpan = $("<span>" + userdata.name + "</span>");
            tableDataName.append(nameSpan);
            tableRow.append(tableDataName);
            namesPerhapsToBig.push(tableDataName);
            /*
            if (mainObject.user.id != userdata.id) {
                var bgClass = mainObject.relationTypes[userdata.currentRelation].backgroundColorClass;
                if (bgClass != null) {
                    tableDataName.addClass("contactStateWarBgColor");
                }
            }
            */
            //Alliance
            var allianceName = $("<span>" + (userdata.allianceId && AllianceModule.getAlliance(userdata.allianceId).name || ' - ') + "</span>");
            //allianceName.addClass("spanFixedWidth");            
            var tableDataAlliance = $('<td/>');
            tableDataAlliance.css("word-break", "break-word");
            //tableDataAlliance.css("overflow","hidden");
            tableDataAlliance.append(allianceName);
            tableRow.append(tableDataAlliance);
            namesPerhapsToBig.push(tableDataAlliance);
            var tableDataCurrentRelation = $('<td/>');
            var tableDataTargetRelation = $('<td/>');
            var tableDataHisTargetRelation = $('<td/>');
            /*
            var tableDataCurrentRelationSpan = $('<span/>', { text: mainObject.relationTypes[userdata.currentRelation].name });
            tableDataCurrentRelationSpan.css("background-color", mainObject.relationTypes[userdata.currentRelation].backGroundColor);
            tableDataCurrentRelationSpan.addClass("spanCurrentRelation");
            tableDataCurrentRelation.append(tableDataCurrentRelationSpan);
            tableRow.append(tableDataCurrentRelation);
            */
            /*
            //currentRelation
            if (mainObject.user.id != userdata.id) {
                var tableDataCurrentRelationSpan = $('<span/>', { text: mainObject.relationTypes[userdata.currentRelation].name });
                tableDataCurrentRelationSpan.css("background-color", mainObject.relationTypes[userdata.currentRelation].backGroundColor);
                tableDataCurrentRelationSpan.addClass("spanCurrentRelation");
                tableDataCurrentRelation.append(tableDataCurrentRelationSpan);
                tableRow.append(tableDataCurrentRelation);

                //player proposal and other player proposal
                //selector for target Relation
                if (userdata.allianceId > 0 ) {
                    tableRow.append(tableDataTargetRelation);
                    tableRow.append(tableDataHisTargetRelation);
                } else {

                    var selectorTargetRelation = $('<select/>');
                    selectorTargetRelation.click(function (event) { event.stopPropagation(); });

                    var option99 = $('<option/>');
                    var option0 = $('<option/>', { text: mainObject.relationTypes[0].name });
                    var option1 = $('<option/>', { text: mainObject.relationTypes[1].name });
                    var option2 = $('<option/>', { text: mainObject.relationTypes[2].name });
                    var option3 = $('<option/>', { text: mainObject.relationTypes[3].name }); //Allied
                    //var option3 = $('<option/>', { text: mainObject.relationTypes[4].name }); //Alliance

                    option99.val("99");
                    option0.val("0");

                    if (userdata.targetRelation == 0 && userdata.targetRelation != userdata.currentRelation) {
                        option0.attr('selected', 'selected');
                    }

                    option1.val("1");
                    if (userdata.targetRelation == 1 && userdata.targetRelation != userdata.currentRelation) {
                        option1.attr('selected', 'selected');
                    }

                    option2.val("2");
                    if (userdata.targetRelation == 2 && userdata.targetRelation != userdata.currentRelation) {
                        option2.attr('selected', 'selected');
                    }

                    option3.val("3");
                    if (userdata.targetRelation == 3 && userdata.targetRelation != userdata.currentRelation) {
                        option3.attr('selected', 'selected');
                    }

                    if (userdata.targetRelation == userdata.currentRelation) {
                        option99.attr('selected', 'selected');
                    }

                    selectorTargetRelation.append(option99);
                    selectorTargetRelation.append(option0);
                    selectorTargetRelation.append(option1);
                    selectorTargetRelation.append(option2);
                    selectorTargetRelation.append(option3);

                    selectorTargetRelation.change(() => { this.relationChanged(selectorTargetRelation.get()[0], <PlayerData.OtherPlayer>userdata) });

                    tableDataTargetRelation.append(selectorTargetRelation);
                    tableRow.append(tableDataTargetRelation);

                    //hisTargetRelation

                    var spanHisTargetRelation = $('<span/>');
                    if (userdata.hisTargetRelation != userdata.currentRelation) {
                        spanHisTargetRelation.text(mainObject.relationTypes[userdata.hisTargetRelation].name);
                        spanHisTargetRelation.css("background-color", mainObject.relationTypes[userdata.hisTargetRelation].backGroundColor);
                        spanHisTargetRelation.addClass("spanHisTargetRelation");
                    }
                    tableDataHisTargetRelation.append(spanHisTargetRelation);
                    tableRow.append(tableDataHisTargetRelation);
                }
            }
            else {
                tableRow.append(tableDataCurrentRelation);
                tableRow.append(tableDataTargetRelation);
                tableRow.append(tableDataHisTargetRelation)
            }
            */
            //Mail           
            //tableDataMessage.addClass(mainObject.relationTypes[userdata.currentRelation].backgroundSymbolClass);
            //var mailPic = $("<img/>", { src: 'images/mail.png', alt: "goods", width: "45px", height: "30px" });
            //tableDataMessage.append(mailPic);            
            /*
            tableRow.append(tableDataMessage);

            if (mainObject.user.id == userdata.id) {
                mailPic.css("visibility", "hidden");
            } else {
                tableDataMessage.click((e) => { e.preventDefault(); e.stopPropagation(); MessageModule.userInterface.showMessageWrite(<PlayerData.OtherPlayer>userdata); });
            }
            */
            var tableDataCurrentState = $('<td/>');
            var ContactStateDiv = $('<div/>');
            ContactStateDiv.addClass("contactState");
            ContactStateDiv.css("height", "30px");
            ContactStateDiv.css("width", "30px");
            if (mainObject.user.id != userdata.id) {
                ContactStateDiv.addClass(mainObject.relationTypes[userdata.currentRelation].backgroundSymbolClass + "Small");
                ContactStateDiv.attr("title", i18n.label(mainObject.relationTypes[userdata.currentRelation].nameLabel));
            }
            tableDataCurrentState.append(ContactStateDiv);
            tableRow.append(tableDataCurrentState);
            /*
            var tableDataName = $('<td/>', { text: userdata.popVicPoints.toString() });
            tableDataName.css("text-align","right")
            tableRow.append(tableDataName);
            //research
            var tableDataName = $('<td/>', { text: userdata.researchVicPoints.toString() });
            tableDataName.css("text-align", "right")
            tableRow.append(tableDataName);

            //Transcendence
            var tableDataName = $('<td/>', { text: userdata.shipVicPoints.toString() });
            tableDataName.css("text-align", "right")
            tableRow.append(tableDataName);
            */
            //Einladen
            /*
            if (mainObject.user.allianceId && mainObject.user.getAlliance().rightToInvite()) {
                tableRow.append($('<td/>', { text: otherUser.overallVicPoints.toString(), "class": "lastchild" }));
            }
            else tableDataMessage.addClass("lastchild");
            */
            tableRow.append($('<td/>', { text: userdata.overallRank.toString() }));
            //Helpers.Log(userdata.popVicPoints.toString());
            return $(tableRow);
        };
        return AllUsersDetail;
    }());
    function createAllUsersHeader() {
        var tableRow = $('<tr/>');
        //ID
        var goodsDiv = $("<div>");
        //goodsDiv.append($("<span>", { text: i18n.label(442) })); //ID
        var tableDataId = $('<th/>', { "class": "tdTextLeft borderBottom" });
        tableDataId.css("width", "40px");
        tableDataId.append(goodsDiv);
        goodsDiv.css("width", "40px");
        tableRow.append(tableDataId);
        //Name     
        var offerDiv = $("<div>");
        offerDiv.append($("<span>", { text: i18n.label(459) })); //Name
        var tableDataOffer = $('<th/>', { "class": "tdTextLeft borderBottom" });
        tableDataOffer.css("width", "265px");
        offerDiv.css("width", "265px");
        tableDataOffer.append(offerDiv);
        tableRow.append(tableDataOffer);
        //Allianz
        var membersDiv = $("<div>");
        membersDiv.append($("<span>", { text: i18n.label(462) }));
        var tableDataMembers = $('<th/>', { "class": "tdTextLeft borderBottom" });
        tableDataMembers.css("width", "265px");
        membersDiv.css("width", "265px");
        tableDataMembers.append(membersDiv);
        tableRow.append(tableDataMembers);
        /*
        //Status
        var coloniesDiv = $("<div>");
        coloniesDiv.append($("<span>", { text: i18n.label(447) })); //Relation
        var tableDataMembers = $('<th/>', { "class": "tdTextLeft borderBottom" });
        tableDataMembers.append(coloniesDiv);
        coloniesDiv.css("width", "115px");
        tableRow.append(tableDataMembers);

        //eigenes Angebot
        var shipsDiv = $("<div>");
        shipsDiv.css("width", "115px");
        shipsDiv.append($("<span>", { text: i18n.label(448) })); // offer
        var tableDataMembers = $('<th/>', { "class": "tdTextLeft borderBottom" });
        tableDataMembers.append(shipsDiv);
        tableRow.append(tableDataMembers);


        //Eingehend
        var currentRelDiv = $("<div>");
        currentRelDiv.css("width", "115px");
        currentRelDiv.append($("<span>", { text: i18n.label(449) })); //inbound offer
        var tableDataOffer = $('<th/>', { "class": "tdTextLeft borderBottom" });
        tableDataOffer.append(currentRelDiv);
        tableRow.append(tableDataOffer);

       
        */
        //Diplomatic State to that user      
        var ownOfferDiv = $("<div>");
        ownOfferDiv.css("width", "20px");
        ownOfferDiv.append($("<span>", { text: "" }));
        var tableDataOffer = $('<th/>', { "class": "tdTextLeft borderBottom" });
        tableDataOffer.css("width", "30px");
        tableDataOffer.append(ownOfferDiv);
        tableRow.append(tableDataOffer);
        //Einladen
        /*
        if (mainObject.user.allianceId && mainObject.user.getAlliance().rightToInvite()) {
            var offeredDiv = $("<div>");
            offeredDiv.css("width", "60px");
            offeredDiv.css("padding-right", "30px");
            offeredDiv.append($("<span>", { text: i18n.label(461) })); //Einladen
            var tableDataOffer = $('<th/>', { "class": "tdTextLeft borderBottom" });
            tableDataOffer.append(offeredDiv);
            tableRow.append(tableDataOffer);
        }
        */
        /*
        tableRow.append(ElementGenerator.headerPictureElement("url(images/BlackIcons.png) no-repeat -90px 0px", 631)); //id        PopulationPoints
        tableRow.append(ElementGenerator.headerPictureElement("url(images/BlackIcons.png) no-repeat -240px 0px", 632)); //id       research
        tableRow.append(ElementGenerator.headerPictureElement("url(images/BlackIcons.png?v=5) no-repeat -450px 0px", 590)); //id       Transcendence
         */
        //Rank
        var offeredDiv = $("<div>");
        offeredDiv.css("width", "45px");
        offeredDiv.css("padding-right", "30px");
        offeredDiv.append($("<span>", { text: i18n.label(570) })); //Rang
        var tableDataOffer = $('<th/>', { "class": "tdTextLeft borderBottom" });
        tableDataOffer.css("width", "45px");
        tableDataOffer.append(offeredDiv);
        tableRow.append(tableDataOffer);
        return tableRow;
    }
    var UserDetail = /** @class */ (function () {
        function UserDetail(userId) {
            this.userId = userId;
            this.descriptionChanged = false;
            this.user = PlayerData.users[userId];
            DiplomacyModule.UserDetailPage = this;
        }
        UserDetail.prototype.showDetails = function (_parent) {
            var _this_1 = this;
            if (this.user == null)
                return;
            //create main Panel and add header + content
            this.windowHandle = ElementGenerator.MainPanel();
            this.windowHandle.setHeader(this.user.name);
            this.windowHandle.callbackOnRemove = function (e) { _this_1.messageTextChanged(); };
            this.windowHandle.element.addClass('ContactDetails');
            this.UserDetailsPage = this.windowHandle.element;
            this.hasAdminRights = this.user.id == mainObject.user.id;
            var panelHeader = $('.relPopupHeader', this.UserDetailsPage);
            //var caption = $('<h2/>', { text: this.user.name }); //, style: "float:left" }); // Alliances  i18n.label(143)
            //panelHeader.append(caption);
            $('.noButton span', this.windowHandle.element).text(i18n.label(332));
            $('.yesButton span', this.windowHandle.element).text(i18n.label(206));
            var panelBody = $('.relPopupBody', this.UserDetailsPage);
            //panelBody.removeClass("trHighlight").addClass("tdHighlight");
            panelBody.css("padding-top", "6px");
            this.UserDetailsBody = $('<div/>');
            this.UserDetailsBody.appendTo(panelBody);
            // Tab-Pages
            var tabDiv = $("<div/>");
            this.UserDetailsBody.append(tabDiv);
            var tabUl = $("<ul/>");
            tabUl.css("display", "table"); //.ui-helper-clearfix:before, .ui-helper-clearfix:after
            tabUl.css("clear", "both");
            var tab0Id = "id0" + (new Date()).getTime();
            tabUl.append($("<li><a href='#" + tab0Id + "'>" + i18n.label(130) + "</a></li>")); //User statistics - Uebersicht
            //var tab1Id = "id1" + (new Date()).getTime();
            //tabUl.append($("<li><a href='#" + tab1Id + "'>" + i18n.label(453) + "</a></li>")); //Bei fremden Allianzen current Relations Beschreibung
            var tab4Id = "id4" + (new Date()).getTime();
            tabUl.append($("<li><a href='#" + tab4Id + "'>" + i18n.label(455) + "</a></li>")); //Politik current Relations, eingehende Angebote
            //this.refreshPoliticsPage();
            if (this.hasAdminRights) {
                var tab5Id = "id5" + (new Date()).getTime();
                tabUl.append($("<li><a href='#" + tab5Id + "'>" + i18n.label(141) + "</a></li>")); //Einrichtung
            }
            tabDiv.append(tabUl);
            this.overviewPage = $("<div id='" + tab0Id + "'/>");
            //this.detailsPage = $("<div id='" + tab1Id + "'/>");          
            this.politicsPage = $("<div id='" + tab4Id + "'/>");
            if (this.hasAdminRights) {
                this.setupPage = $("<div id='" + tab5Id + "'/>");
            }
            tabDiv.append(this.overviewPage).append(this.politicsPage);
            if (this.hasAdminRights) {
                tabDiv.append(this.setupPage);
            }
            tabDiv.tabs({ "active": 0 });
            tabDiv.on("tabsactivate", function (event, ui) { _this_1.refreshPoliticsPage(); });
            if (!this.user.researchDataLoaded) {
                DiplomacyModule.FetchUserResearch(this.user);
            }
            else {
                for (var i = 0; i < BaseDataModule.SpecializationGroups.length; i++) {
                    var SpecGroup = BaseDataModule.SpecializationGroups[i];
                    SpecGroup.setPickState(this.user);
                }
            }
            if (!this.user.detailDataLoaded) {
                this.loadUser();
            }
            else {
                this.refreshAll();
            }
        };
        UserDetail.prototype.loadUserWorker = function (retObject) {
            //{"userId":157,"description":"BlahBlahBlub","relation":[{"Id":186,"State":0},{"Id":235,"State":2},{"Id":253,"State":3}]}
            this.user.description = retObject["description"];
            this.user.relations = [];
            var relations = retObject["relation"];
            for (var i = 0; i < relations.length; i++) {
                var newRelation = new PlayerData.UserRelation();
                newRelation.targetId = relations[i]["Id"];
                newRelation.state = relations[i]["State"];
                Helpers.Log("PlayerData.UserRelation : " + newRelation.targetId.toString() + "   --   " + newRelation.state.toString());
                this.user.relations.push(newRelation);
            }
            this.user.detailDataLoaded = true;
            this.refreshAll();
        };
        UserDetail.prototype.loadUser = function () {
            var _this_1 = this;
            $.ajax("Server/User.aspx", {
                "type": "POST",
                "data": {
                    "action": "getDetails",
                    "targetUserId": this.user.id
                }
            }).done(function (msg) {
                _this_1.loadUserWorker(msg);
            });
        };
        UserDetail.prototype.refreshAll = function () {
            this.refreshOverviewPage();
            //this.refreshDetailsPage();     
            this.refreshPoliticsPage();
            if (this.hasAdminRights) {
                this.refreshSetupPage();
            }
        };
        UserDetail.prototype.createProfileSection = function () {
            var _this_1 = this;
            var nameDiv = $("<div>", { "class": "PageRegionTitle" });
            nameDiv.html(this.user.name);
            this.overviewPage.append(nameDiv);
            var avatarDescr = $("<div>", {});
            var leftSide = $("<div>", { "class": "inlineBlockTopAlign" });
            var leftProfile = this.user.MakeAvatarDiv();
            //var avatar = $("<img>", { "class": "floatL Avatar" , "src":"images/avatar.png" });
            //leftProfile.append(avatar);
            leftSide.append(leftProfile);
            avatarDescr.append(leftSide);
            var descDiv = $("<div>", { "class": "inlineBlockTopAlign ContactDescr PageRegionBackground" });
            descDiv.html(this.user.description.label());
            avatarDescr.append(descDiv);
            this.overviewPage.append(avatarDescr);
            var messageDiv = $("<div>");
            messageDiv.css("text-align", "left");
            //create write message button
            var messageButton2 = $('<button/>', { "class": "messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" });
            messageButton2.attr("title", i18n.label(841));
            var messageButtonSpan2 = $('<span/>', { "class": "ui-button-icon-primary ui-icon message" });
            messageButton2.append(messageButtonSpan2);
            messageButton2.click(function (e) { e.preventDefault(); e.stopPropagation(); MessageModule.userInterface.showMessageWrite(_this_1.user); });
            messageDiv.append(messageButton2);
            //create invite to alliance button, if player is admin and this user is not already part of the admins alliance
            //and if user is not already invited
            if (mainObject.user.allianceId && mainObject.user.isAllianceAdmin()
                && (this.user.allianceId != mainObject.user.allianceId)
                && (mainObject.user.getAlliance().invitedUsers[this.user.id] == null)) {
                var allianceInvite = $('<button/>', { "class": "IconButton allianceButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" });
                var allianceInviteSpan2 = $('<span/>', { "class": "ui-button-icon-primary ui-icon allianceImage" });
                allianceInvite.attr("title", i18n.label(842));
                allianceInvite.append(allianceInviteSpan2);
                allianceInvite.click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    mainObject.user.getAlliance().invitedUsers[_this_1.user.id] = 1;
                    var postData = _this_1.user.id;
                    $.ajax("Server/Alliances.aspx?action=inviteToAlliance", {
                        type: "POST",
                        data: _this_1.user.id.toString(),
                        contentType: "xml",
                        processData: false
                    });
                    _this_1.refreshAll();
                });
                messageDiv.append(allianceInvite);
            }
            //var IdSpan = $("<span>", { "text": this.user.id });
            //messageDiv.append(IdSpan);
            leftSide.append(messageDiv);
            this.overviewPage.append($("<br>"));
            //var descSpan = $("<span>" + this.user.description + "</span>");
            //this.overviewPage.append(descSpan);
        };
        UserDetail.prototype.createStatissticsSection = function () {
            var nameDiv = $("<div>", { "class": "PageRegionTitle" });
            nameDiv.html(i18n.label(910));
            this.overviewPage.append(nameDiv);
            var userAsArray = [];
            userAsArray.push(this.user);
            //build Table showing relation buttons  if other user
            if (this.user.id != mainObject.user.id) {
                namesPerhapsToBig = [];
                var buildTable = this.windowHandle.createTable(this.overviewPage, userAsArray, this.createUserRelationHeader, this.createUserRelationRow, null, 0, this, 41, true, false);
                buildTable.css("width", "inherit");
                namesPerhapsToBig.forEach(function (value, index) { value.textfill({ "maxFontPixels": 16, "widthOnly": false }); });
                $("select", buildTable).selectmenu({
                    width: "100%",
                    change: function (event, data) {
                        //Helpers.Log($(data.item).toString());
                        //Helpers.Log($(data.item.element).parent());
                        Helpers.Log($(data.item.element).parent().data("userdata"));
                        Helpers.Log($(data.item).parent().data("userdata"));
                        //selectorTargetRelation.change(() => { this.relationChanged(selectorTargetRelation.get()[0], <PlayerData.OtherPlayer>userdata) });
                        relationChanged(data.item.element.parent()[0], $(data.item.element).parent().data("userdata"));
                    }
                });
                $("select", buildTable).parent().click(function (e) { e.preventDefault(); e.stopPropagation(); });
            }
            //build Table showing Rank, Research points, population points, transcendence points        
            namesPerhapsToBig = [];
            var buildTable = this.windowHandle.createTable(this.overviewPage, userAsArray, this.createUserRankingHeader, this.createUserRankingRow, null, 0, this, 42, true, false);
            buildTable.css("width", "inherit");
            namesPerhapsToBig.forEach(function (value, index) { value.textfill({ "maxFontPixels": 16, "widthOnly": false }); });
        };
        UserDetail.prototype.refreshOverviewPage = function () {
            this.overviewPage.empty();
            this.createProfileSection();
            //this.createSpecializationSection(this.overviewPage, this.user);
            var SpecDiv = $("<div>");
            this.overviewPage.append(SpecDiv);
            (new DiplomacyModule.UserSpecificationCreator(this.user, SpecDiv)).refresh();
            this.createStatissticsSection();
        };
        UserDetail.prototype.refreshPoliticsPage = function () {
            var panelBody = $('.relPopupBody', this.politicsPage);
            panelBody = this.politicsPage;
            panelBody.empty();
            namesPerhapsToBig = [];
            //exclude non players:
            var relations = [];
            //var players: PlayerData.User[] = [];
            for (var i = 0; i < this.user.relations.length; i++) {
                if (typeof PlayerData.users[this.user.relations[i].targetId] === 'undefined' || PlayerData.users[this.user.relations[i].targetId].isAI()) {
                    continue;
                }
                relations.push(this.user.relations[i]);
            }
            //build Table of known users                    
            var buildTable = this.windowHandle.createTable(panelBody, relations, this.createUserDiplomaticsHeader, this.showUserDiplomaticsRow, null, 0, this, 40);
            namesPerhapsToBig.forEach(function (value, index) { value.textfill({ "maxFontPixels": 16, "widthOnly": false }); });
        };
        UserDetail.prototype.refreshSetupPage = function () {
            var _this_1 = this;
            this.setupPage.empty();
            var nameInput = $("<input/>", { type: "text", value: this.user.name });
            nameInput.css("width", "22em");
            //nameInput.css("float", "left");
            var name = $("<span>" + this.user.name + "</span>");
            name.css("margin-left", "10px");
            nameInput.change(function (_event, _input) {
                Helpers.Log(_event.currentTarget.value);
                _this_1.user.name = _event.currentTarget.value;
                name.html(_event.currentTarget.value);
                var postData = _event.currentTarget.value;
                $.ajax("Server/User.aspx?action=renameUser", {
                    type: "POST",
                    data: postData,
                    contentType: "xml",
                    processData: false
                });
                /*
                $.ajax("Server/Alliances.aspx?action=renameAlliance", {
                    type: "POST",
                    data: postData,
                    contentType: "xml",
                    processData: false
                });*/
            });
            var nameSpan = $("<span/>");
            this.setupPage.append(nameSpan);
            nameSpan.append(nameInput);
            nameSpan.append(name);
            var avatarDescr = $("<div>", {});
            var leftSide = $("<div>", { "class": "inlineBlockTopAlign" });
            var leftProfile = this.user.MakeAvatarDiv();
            //var avatar = $("<img>", { "class": "floatL Avatar", "src": this.user.ProfileUrl });
            //leftProfile.append(avatar);
            leftSide.append(leftProfile);
            avatarDescr.append(leftSide);
            this.setupPage.append(avatarDescr);
            var UrlInput = $("<input/>", { type: "text", value: this.user.ProfileUrl == "images/interface/defaultprofile.png" ? "URL" : this.user.ProfileUrl });
            UrlInput.css("width", "32em");
            UrlInput.change(function (_event, _input) {
                var NewValue = _event.currentTarget.value;
                Helpers.Log(NewValue);
                if (NewValue == "")
                    NewValue = "images/interface/defaultprofile.png";
                _this_1.user.ProfileUrl = NewValue;
                leftProfile.css("background-image", "url('" + NewValue + "')");
                //avatar.attr("src", _event.currentTarget.value);
                var postData = _event.currentTarget.value;
                $.ajax("Server/User.aspx?action=ChangeProfileUrl", {
                    type: "POST",
                    data: postData,
                    contentType: "xml",
                    processData: false
                });
                //this.user.name = _event.currentTarget.value;
                //name.html(_event.currentTarget.value);
            });
            this.setupPage.append(UrlInput);
            var writeBodyDiv = $("<div/>");
            writeBodyDiv.addClass("CommMessageWriteContainer");
            var messageBody = $("<div/>", { "class": "commMessageMaxHeight" });
            var messageText = $("<textarea/>", { "class": "messageBody" });
            messageBody.append(messageText);
            writeBodyDiv.append(messageBody);
            messageText.val(this.user.description.label());
            messageText.css("min-height", '250px');
            messageText.css("font-family", 'Verdana, Geneva, Arial, Helvetica, sans-serif');
            this.setupPage.append(writeBodyDiv);
            //messageText.val(this.user.description);
            //messageBody.append(messageText);
            //this.setupPage.append(messageBody);
            /*
            messageText.width(this.windowHandle.element.width() - 20);
            //messageBody.css("height",'250px');
            messageText.height(250);
            messageText.css("height", '250px');
            */
            /*
            messageText.change((_event, _input) => {
                this.messageTextChanged(_event.currentTarget.value);
            });*/
            messageText.keyup(function () {
                _this_1.keyUp();
            });
            messageText.on('blur', function (e) {
                _this_1.refreshSetupPage();
            });
            this.setupPage.append($('<br>'));
            this.setupPage.append(this.user.description.label());
            this.refreshOverviewPage();
        };
        //set + view Relations
        UserDetail.prototype.createUserRelationRow = function (_parent, userdata) {
            var tableRow = $("<tr/>");
            //var tableDataCurrentRelation = $('<td/>');
            var tableDataTargetRelation = $('<td/>');
            var tableDataHisTargetRelation = $('<td/>');
            var tableDataMessage = $('<td/>');
            /*
            var tableDataCurrentRelationSpan = $('<span/>', { text: mainObject.relationTypes[userdata.currentRelation].name });
            tableDataCurrentRelationSpan.css("background-color", mainObject.relationTypes[userdata.currentRelation].backGroundColor);
            tableDataCurrentRelationSpan.addClass("spanCurrentRelation");
            tableDataCurrentRelation.append(tableDataCurrentRelationSpan);
            tableRow.append(tableDataCurrentRelation);
            */
            var tableDataCurrentState = $('<td/>');
            tableDataCurrentState.addClass("contactState");
            tableDataCurrentState.css("height", "30px");
            if (mainObject.user.id != userdata.id) {
                var tableDataCurrentStateDiv = $('<div/>', { "class": "Icon" + mainObject.relationTypes[userdata.currentRelation].backgroundSymbolClass + "Small" });
                tableDataCurrentState.append(tableDataCurrentStateDiv);
                //tableDataCurrentState.addClass(mainObject.relationTypes[userdata.currentRelation].backgroundSymbolClass + "Small");
                tableDataCurrentState.attr("title", i18n.label(mainObject.relationTypes[userdata.currentRelation].nameLabel));
            }
            tableRow.append(tableDataCurrentState);
            //player proposal and other player proposal            
            //selector for target Relation
            if (userdata.allianceId > 0) {
                tableRow.append(tableDataTargetRelation);
                tableRow.append(tableDataHisTargetRelation);
            }
            else {
                //JQueryUI .selectMenu is called on this after the line was created!
                var selectorTargetRelation = $('<select/>');
                selectorTargetRelation.data("userdata", userdata);
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
                if (userdata.targetRelation == 0 && userdata.targetRelation != userdata.currentRelation) {
                    option0.attr('selected', 'selected');
                }
                option1.val("1");
                if (userdata.targetRelation == 1 && userdata.targetRelation != userdata.currentRelation) {
                    option1.attr('selected', 'selected');
                }
                option2.val("2");
                if (userdata.targetRelation == 2 && userdata.targetRelation != userdata.currentRelation) {
                    option2.attr('selected', 'selected');
                }
                option3.val("3");
                if (userdata.targetRelation == 3 && userdata.targetRelation != userdata.currentRelation) {
                    option3.attr('selected', 'selected');
                }
                option4.val("4");
                if (userdata.targetRelation == 4 && userdata.targetRelation != userdata.currentRelation) {
                    option4.attr('selected', 'selected');
                }
                if (userdata.targetRelation == userdata.currentRelation) {
                    option99.attr('selected', 'selected');
                }
                selectorTargetRelation.append(option99);
                selectorTargetRelation.append(option0);
                selectorTargetRelation.append(option1);
                selectorTargetRelation.append(option2);
                selectorTargetRelation.append(option3);
                selectorTargetRelation.append(option4);
                //selectorTargetRelation.change(() => { this.relationChanged(selectorTargetRelation.get()[0], <PlayerData.OtherPlayer>userdata) });
                tableDataTargetRelation.append(selectorTargetRelation);
                tableRow.append(tableDataTargetRelation);
                //hisTargetRelation
                var spanHisTargetRelation = $('<span/>');
                if (userdata.hisTargetRelation != userdata.currentRelation) {
                    spanHisTargetRelation.text(mainObject.relationTypes[userdata.hisTargetRelation].name);
                    spanHisTargetRelation.css("background-color", mainObject.relationTypes[userdata.hisTargetRelation].backGroundColor);
                    spanHisTargetRelation.addClass("spanHisTargetRelation");
                }
                tableDataHisTargetRelation.append(spanHisTargetRelation);
                tableRow.append(tableDataHisTargetRelation);
            }
            return $(tableRow);
        };
        UserDetail.prototype.createUserRelationHeader = function () {
            var tableRow = $('<tr/>');
            //Status
            var coloniesDiv = $("<div>");
            coloniesDiv.append($("<span>", { text: i18n.label(447) })); //Relation
            var tableDataMembers = $('<th/>', { "class": "tdTextLeft borderBottom" });
            tableDataMembers.append(coloniesDiv);
            coloniesDiv.css("width", "115px");
            tableRow.append(tableDataMembers);
            //eigenes Angebot
            var shipsDiv = $("<div>");
            shipsDiv.css("width", "165px");
            shipsDiv.append($("<span>", { text: i18n.label(448) })); // offer
            var tableDataMembers = $('<th/>', { "class": "tdTextLeft borderBottom" });
            tableDataMembers.append(shipsDiv);
            tableRow.append(tableDataMembers);
            //Eingehend
            var currentRelDiv = $("<div>");
            currentRelDiv.css("width", "165px");
            currentRelDiv.append($("<span>", { text: i18n.label(449) })); //inbound offer
            var tableDataOffer = $('<th/>', { "class": "tdTextLeft borderBottom" });
            tableDataOffer.append(currentRelDiv);
            tableRow.append(tableDataOffer);
            return tableRow;
        };
        //Rankings
        UserDetail.prototype.createUserRankingRow = function (_parent, userdata) {
            var tableRow = $("<tr/>");
            //population
            var tableDataName = $('<td/>', { text: userdata.popVicPoints.toString() });
            tableDataName.css("text-align", "center");
            tableRow.append(tableDataName);
            //research
            var tableDataName = $('<td/>', { text: userdata.researchVicPoints.toString() });
            tableDataName.css("text-align", "center");
            tableRow.append(tableDataName);
            //Ships
            var tableDataName = $('<td/>', { text: userdata.shipVicPoints.toString() });
            tableDataName.css("text-align", "center");
            tableRow.append(tableDataName);
            //Transcendence
            var tableDataName = $('<td/>', { text: userdata.goodsVicPoints.toString() });
            tableDataName.css("text-align", "center");
            tableRow.append(tableDataName);
            //Rank
            tableRow.append($('<td/>', { text: userdata.overallRank.toString() }));
            return $(tableRow);
        };
        UserDetail.prototype.createUserRankingHeader = function () {
            var tableRow = $('<tr/>');
            //ContactDetails
            //tableRow.append(ElementGenerator.headerPictureElement("url(images/BlackIcons.png) no-repeat -90px 0px", 631));          //id        PopulationPoints
            //tableRow.append(ElementGenerator.headerPictureElement("url(images/BlackIcons.png) no-repeat -240px 0px", 632));         //id       research            
            //tableRow.append(ElementGenerator.headerPictureElement("url(images/BlackIcons.png?v=5) no-repeat -450px 0px", 590));     //id       Transcendence 
            tableRow.append(ElementGenerator.headerClassElement("IconPopulation", 156)); //id        Population
            tableRow.append(ElementGenerator.headerClassElement("IconResearch", 638)); //id       Research            
            tableRow.append(ElementGenerator.headerClassElement("IconShip", 133)); //id       Ships
            tableRow.append(ElementGenerator.headerClassElement("IconTranscendence", 590)); //id       Transcendence 
            var offeredDiv = $("<div>");
            offeredDiv.css("width", "45px");
            offeredDiv.css("padding-right", "30px");
            offeredDiv.append($("<span>", { text: "Rank" })); //Rang
            var tableDataOffer = $('<th/>', { "class": "tdTextLeft borderBottom" });
            tableDataOffer.append(offeredDiv);
            tableRow.append(tableDataOffer);
            return tableRow;
        };
        UserDetail.prototype.keyUp = function () {
            this.user.description = $("textarea", this.UserDetailsPage).val().toString();
            /*
            if (!this.descriptionChanged) {
                this.UserDetailsPage.data("popup").callbackOnRemove = () => {
                    this.messageTextChanged($("textarea", this.UserDetailsPage).val());
                };
            }*/
            this.descriptionChanged = true;
        };
        UserDetail.prototype.messageTextChanged = function () {
            if (!this.descriptionChanged)
                return;
            this.descriptionChanged = false;
            Helpers.Log(this.user.description);
            // messageText.val.html(_event.currentTarget.value);
            var postData = this.user.description.label();
            $.ajax("Server/User.aspx?action=changeDescription", {
                type: "POST",
                data: postData,
                contentType: "xml",
                processData: false
            });
            //this.refreshDetailsPage();
        };
        UserDetail.prototype.createUserDiplomaticsHeader = function () {
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
            //Allianz
            var membersDiv = $("<div>");
            membersDiv.append($("<span>", { text: i18n.label(139) }));
            var tableDataMembers = $('<th/>', { "class": "tdTextLeft borderBottom" });
            membersDiv.css("width", "180px");
            tableDataMembers.append(membersDiv);
            tableRow.append(tableDataMembers);
            //Status
            var coloniesDiv = $("<div>");
            coloniesDiv.append($("<span>", { text: i18n.label(447) })); //Relation
            var tableDataMembers = $('<th/>', { "class": "tdTextLeft borderBottom" });
            tableDataMembers.append(coloniesDiv);
            coloniesDiv.css("width", "115px");
            tableRow.append(tableDataMembers);
            return tableRow;
        };
        UserDetail.prototype.showUserDiplomaticsRow = function (_parent, userRelation) {
            var userdata = PlayerData.users[userRelation.targetId];
            if (userdata == null) {
                return;
            }
            var tableRow = $("<tr/>");
            if (mainObject.user.id == userdata.id) {
                tableRow.addClass("ownAlliance");
            }
            //ID
            var tableDataId = $('<td/>', { text: userdata.id.toString() });
            tableRow.append(tableDataId);
            tableRow.click(function () { DiplomacyModule.entryPoint2(userdata.id, _parent); });
            //NAME
            var tableDataName = $('<td/>');
            var nameSpan = $("<span>" + userdata.tagFreeName + "</span>");
            nameSpan.css("font-size", "1px");
            tableDataName.append(nameSpan);
            tableRow.append(tableDataName);
            namesPerhapsToBig.push(tableDataName);
            //Alliance
            var allianceName = $("<span>" + (userdata.allianceId && AllianceModule.getAlliance(userdata.allianceId).name || ' - ') + "</span>");
            allianceName.css("font-size", "1px");
            //allianceName.addClass("spanFixedWidth");            
            var tableDataAlliance = $('<td/>');
            //tableDataAlliance.css("overflow","hidden");
            tableDataAlliance.append(allianceName);
            tableRow.append(tableDataAlliance);
            namesPerhapsToBig.push(tableDataAlliance);
            /*
            var tableDataCurrentRelation = $('<td/>');


            //currentRelation
            var tableDataCurrentRelationSpan = $('<span/>', { text: mainObject.relationTypes[userRelation.state].name });
            tableDataCurrentRelationSpan.css("background-color", mainObject.relationTypes[userRelation.state].backGroundColor);
            tableDataCurrentRelationSpan.addClass("spanCurrentRelation");
            tableDataCurrentRelation.append(tableDataCurrentRelationSpan);
            tableRow.append(tableDataCurrentRelation);
            */
            var tableDataCurrentRelation = $('<td/>');
            var ContactStateDiv2 = $('<div/>');
            ContactStateDiv2.addClass("contactState");
            ContactStateDiv2.css("height", "30px");
            ContactStateDiv2.css("width", "30px");
            ContactStateDiv2.addClass(mainObject.relationTypes[userRelation.state].backgroundSymbolClass + "Small");
            ContactStateDiv2.attr("title", i18n.label(mainObject.relationTypes[userRelation.state].nameLabel));
            tableDataCurrentRelation.append(ContactStateDiv2);
            tableRow.append(tableDataCurrentRelation);
            return $(tableRow);
        };
        return UserDetail;
    }());
    DiplomacyModule.UserDetail = UserDetail;
    var UserSpecificationCreator = /** @class */ (function () {
        function UserSpecificationCreator(User, OverviewPage) {
            this.User = User;
            this.OverviewPage = OverviewPage;
            DiplomacyModule.UserSpecificationScreen = this;
        }
        //Create a line showing label, remaining picks, and a "People"-image
        UserSpecificationCreator.prototype.MakeSpecGroupHeader = function (specGroup, availablePicks, user, overviewPage) {
            var specDiv = $("<div>", { "class": "PageRegionBackground", "title": i18n.label(specGroup.LabelDescription) });
            specDiv.tooltip();
            specDiv.width(620);
            var nameDiv = $("<div>", { "class": "inlineBlockTopAlign SpecGroupName " });
            nameDiv.html(i18n.label(specGroup.Label));
            specDiv.append(nameDiv);
            if (user.id == mainObject.user.id) {
                var pickDiv = $("<div>", { "class": "inlineBlockTopAlign SpecGroupPick" });
                for (var i = specGroup.Picks; i > availablePicks; i--) {
                    var circle = $("<div>", { "class": "inlineBlockTopAlign specCircles specCirclesEmpty" });
                    pickDiv.append(circle);
                }
                if (availablePicks) {
                    for (var i = 0; i < availablePicks; i++) {
                        var circle = $("<div>", { "class": "inlineBlockTopAlign specCircles specCirclesFilled" });
                        pickDiv.append(circle);
                    }
                    specDiv.append(pickDiv);
                }
                specDiv.append(pickDiv);
            }
            overviewPage.append(specDiv);
        };
        UserSpecificationCreator.prototype.MakeSpecImage = function (imagePath, left) {
            var gainImageDiv = $("<div/>");
            gainImageDiv.css({ "position": "absolute", "left": left + "px" });
            var gainImage = $("<img/>", { "src": imagePath, "alt": "ResearchGain", "title": "test" });
            gainImage.css({ "width": "30px", "height": "30px" });
            gainImageDiv.append(gainImage);
            return gainImageDiv;
        };
        UserSpecificationCreator.prototype.MakeSpecImages = function (specResearch, specDiv) {
            var research = BaseDataModule.researches[specResearch.ResearchId];
            var secondaryResearch = specResearch.SecondaryResearchId ? BaseDataModule.researches[specResearch.SecondaryResearchId] : null;
            var imageNumber = 0;
            var imageLeft = 5; //left position
            var MaxImages = 4;
            //draw Research Gain information: 
            if (BaseDataModule.researchGainExists(research.id)) {
                var researchGain = BaseDataModule.getResearchGain(research.id);
                var imagePath = mainObject.imageObjects[researchGain.objectId].texture.src;
                var gainImageDiv = this.MakeSpecImage(imagePath, imageLeft + (imageNumber * 35));
                gainImageDiv.tooltip(researchGain.createToolTip());
                specDiv.append(gainImageDiv);
                imageNumber++;
            }
            //draw Research Gain information: 
            if (secondaryResearch != null && BaseDataModule.researchGainExists(secondaryResearch.id)) {
                var researchGain = BaseDataModule.getResearchGain(secondaryResearch.id);
                var imagePath = mainObject.imageObjects[researchGain.objectId].texture.src;
                var gainImageDiv = this.MakeSpecImage(imagePath, imageLeft + (imageNumber * 35));
                gainImageDiv.tooltip(researchGain.createToolTip());
                specDiv.append(gainImageDiv);
                imageNumber++;
            }
            if (specResearch.Building1 != null && imageNumber < MaxImages) {
                var Building = mainObject.buildings[specResearch.Building1];
                var imagePath = mainObject.imageObjects[Building.buildingObjectId].texture.src;
                var gainImageDiv = this.MakeSpecImage(imagePath, imageLeft + (imageNumber * 35));
                gainImageDiv.tooltip(BaseDataModule.getRelationObjectTooltip(ObjectTypes.Building, Building.id));
                specDiv.append(gainImageDiv);
                imageNumber++;
            }
            if (specResearch.Building2 != null && imageNumber < MaxImages) {
                var Building = mainObject.buildings[specResearch.Building2];
                var imagePath = mainObject.imageObjects[Building.buildingObjectId].texture.src;
                var gainImageDiv = this.MakeSpecImage(imagePath, imageLeft + (imageNumber * 35));
                gainImageDiv.tooltip(BaseDataModule.getRelationObjectTooltip(ObjectTypes.Building, Building.id));
                specDiv.append(gainImageDiv);
                imageNumber++;
            }
            if (specResearch.Building3 != null && imageNumber < MaxImages) {
                var Building = mainObject.buildings[specResearch.Building3];
                var imagePath = mainObject.imageObjects[Building.buildingObjectId].texture.src;
                var gainImageDiv = this.MakeSpecImage(imagePath, imageLeft + (imageNumber * 35));
                gainImageDiv.tooltip(BaseDataModule.getRelationObjectTooltip(ObjectTypes.Building, Building.id));
                specDiv.append(gainImageDiv);
                imageNumber++;
            }
            if (specResearch.Module1 != null && imageNumber < MaxImages && BaseDataModule.moduleExists(specResearch.Module1)) {
                var Module = BaseDataModule.getModule(specResearch.Module1);
                var imagePath = Module.imagePath();
                var gainImageDiv = this.MakeSpecImage(imagePath, imageLeft + (imageNumber * 35));
                gainImageDiv.tooltip(BaseDataModule.getRelationObjectTooltip(ObjectTypes.ShipModule, Module.id));
                specDiv.append(gainImageDiv);
                imageNumber++;
            }
            if (specResearch.Module2 != null && imageNumber < MaxImages && BaseDataModule.moduleExists(specResearch.Module2)) {
                var Module = BaseDataModule.getModule(specResearch.Module2);
                var imagePath = Module.imagePath();
                var gainImageDiv = this.MakeSpecImage(imagePath, imageLeft + (imageNumber * 35));
                gainImageDiv.tooltip(BaseDataModule.getRelationObjectTooltip(ObjectTypes.ShipModule, Module.id));
                specDiv.append(gainImageDiv);
                imageNumber++;
            }
            if (specResearch.Module3 != null && imageNumber < MaxImages && BaseDataModule.moduleExists(specResearch.Module3)) {
                var Module = BaseDataModule.getModule(specResearch.Module3);
                var imagePath = Module.imagePath();
                var gainImageDiv = this.MakeSpecImage(imagePath, imageLeft + (imageNumber * 35));
                gainImageDiv.tooltip(BaseDataModule.getRelationObjectTooltip(ObjectTypes.ShipModule, Module.id));
                specDiv.append(gainImageDiv);
                imageNumber++;
            }
        };
        //Create a research line showing label and (if picks > 0) picks, and an player-number, indicating how many players already have this research
        UserSpecificationCreator.prototype.MakeSpecGroupEntry = function (specResearch, picks, user, overviewPage, refreshScope, clickRefresh) {
            if (refreshScope === void 0) { refreshScope = null; }
            if (clickRefresh === void 0) { clickRefresh = null; }
            var playerHasResearchedIt = user.playerResearches[specResearch.ResearchId] &&
                user.playerResearches[specResearch.ResearchId].isCompleted;
            if (user.id != mainObject.user.id && !playerHasResearchedIt)
                return;
            //skip this research if the player has no researches left, and the research was not already researched
            //if (picks == 0 && !playerHasResearchedIt) return;
            var research = BaseDataModule.researches[specResearch.ResearchId];
            var specDiv = $("<div>", { "class": "PageRegionBackground specResearchLine" });
            //if (picks) { specDiv.width(620); specDiv.css("float", "left"); }
            specDiv.width(620);
            specDiv.css("float", "left");
            this.MakeSpecImages(specResearch, specDiv);
            var nameDiv = $("<div>", { "class": "inlineBlockTopAlign SpecResearchName", "title": i18n.label(research.labelDescription) });
            nameDiv.html(i18n.label(research.label));
            specDiv.append(nameDiv);
            if (user.id == mainObject.user.id) {
                var pickDiv = specResearch.PickState.pickImage();
                specDiv.append(pickDiv);
                if (user.id == mainObject.user.id) {
                    specDiv.click(function (e) { specResearch.PickState.clicked(specResearch, refreshScope, clickRefresh); });
                }
            }
            overviewPage.append(specDiv);
            var pickedBy = $("<div>", { "class": "inlineBlockTopAlign SpecGroupOther ", "text": specResearch.AmountTaken.toString(), "title": i18n.label(908) });
            overviewPage.append(pickedBy);
        };
        /*
        public RefrehsPickState(user: PlayerData.User) {

            for (var j = 0; j < BaseDataModule.SpecializationGroups.length; j++) {
                var specGroup = BaseDataModule.SpecializationGroups[j];
                specGroup.setPickState(user);

                
            }
        }
        */
        UserSpecificationCreator.prototype.ChooseSpecialization = function (specGroup) {
            Helpers.Log("specGroup: " + specGroup.Id);
            var specId = specGroup.Id.toString();
            var specResearchs = "";
            for (var i = 0; i < specGroup.SpecializationResearch.length; i++) {
                var res = specGroup.SpecializationResearch[i];
                if (res.PickState.isPicked() && !res.PickState.isFixed()) {
                    Helpers.Log("SpecializationResearch: " + res.ResearchId);
                    specResearchs += (res.ResearchId.toString() + ";");
                    res.SetResearched();
                    if (mainObject.user.playerResearches[res.ResearchId] != null)
                        mainObject.user.playerResearches[res.ResearchId].isCompleted = true;
                }
            }
            this.refresh();
            //var ExecuteAfterSetting = this.refreshOverviewPage;
            if (specId && specResearchs) {
                $.ajax("Server/Research.aspx?action=setSpecializations", {
                    "type": "GET",
                    "data": { "Spec": specId, "Researchs": specResearchs }
                }).done(function (msg) {
                    //just assume that everythins is fine -> only JS-hackers might trigger false data, and that would be detected in the server...
                    PlayerData.researchSelectedAjaxDone(msg, DiplomacyModule.UserSpecificationScreen.refresh, DiplomacyModule.UserSpecificationScreen);
                    UserSpecifications.CountAndShowFreePics();
                });
            }
        };
        UserSpecificationCreator.prototype.refresh = function () {
            this.OverviewPage.empty();
            this.createSpecializationSection(this.OverviewPage, this.User);
        };
        UserSpecificationCreator.prototype.createSpecializationSection = function (overviewPage, user) {
            var nameDiv = $("<div>", { "class": "PageRegionTitle" });
            nameDiv.html(i18n.label(909));
            overviewPage.append(nameDiv);
            nameDiv.append($("<div>", { "class": "SpecializationPicksCount", "title": i18n.label(908) }));
            for (var i = 0; i < BaseDataModule.SpecializationGroups.length; i++) {
                var SpecGroup = BaseDataModule.SpecializationGroups[i];
                var picked = 0;
                var fixed = 0;
                for (var j = 0; j < SpecGroup.SpecializationResearch.length; j++) {
                    var SpecResearch = SpecGroup.SpecializationResearch[j];
                    //if (user.playerResearches[SpecResearch.ResearchId] &&
                    //    user.playerResearches[SpecResearch.ResearchId].isCompleted) fixed++; 
                    if (SpecResearch.PickState.isPicked())
                        picked++;
                    if (SpecResearch.PickState.isFixed())
                        fixed++;
                }
                if (user.id != mainObject.user.id && !fixed)
                    continue;
                this.MakeSpecGroupHeader(SpecGroup, SpecGroup.Picks - picked, user, overviewPage);
                for (var j = 0; j < SpecGroup.SpecializationResearch.length; j++) {
                    this.MakeSpecGroupEntry(SpecGroup.SpecializationResearch[j], SpecGroup.Picks - picked, user, overviewPage, this, this.refresh);
                }
                if (SpecGroup.Picks - fixed > 0 && user.id == mainObject.user.id) {
                    var CommitDiv = $("<div>", { "class": "SpecCommit" });
                    var commitButton = $("<button>", { "class": "SpecCommitButton ui-state-default", text: "Commit" });
                    CommitDiv.append(commitButton);
                    (function (SpecGroup, _this) {
                        commitButton.click(function (e) { _this.ChooseSpecialization(SpecGroup); });
                    })(SpecGroup, this);
                    overviewPage.append(CommitDiv);
                }
                var spacerDiv = $("<div>", { "class": "PageSpacer" });
                overviewPage.append(spacerDiv);
            }
        };
        return UserSpecificationCreator;
    }());
    DiplomacyModule.UserSpecificationCreator = UserSpecificationCreator;
    function entryPoint2(userId, _parent) {
        if (userId) {
            //Helpers.Log('EinzelUser');
            (new UserDetail(userId)).showDetails(_parent);
        }
        else {
            //Helpers.Log("Alle Users");
            (new AllUsersDetail()).showOtherUsers2(_parent);
        }
    }
    DiplomacyModule.entryPoint2 = entryPoint2;
})(DiplomacyModule || (DiplomacyModule = {}));
//# sourceMappingURL=Diplomacy.js.map