
module PlayerData {

    export var users: User[] = [];
    export var languages: language[] = [];
    export class language {
        
        //shortName: string;
        //longName: string;
        
        constructor(public id: number, public shortName: string, public longName: string) {
           // this.shortName = short1;
            //this.longName = long1;
        }

        languageName(): string { return this.longName}
    }       

    export function languageAddAll(XMLlanguages: Document) {
        var XMLAllLanguages = XMLlanguages.getElementsByTagName("languages");
       
        var XMLanguages = XMLAllLanguages[0].getElementsByTagName("language");
        var length = XMLanguages.length;
        for (var i = 0; i < length; i++) {
            languageAdd(XMLanguages[i]);
        }
        Helpers.Log(length + " languages added");
    }

    export function languageAdd(XMLlanguage: Element) {
        var id = parseInt(XMLlanguage.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        var shortName = XMLlanguage.getElementsByTagName("languageShortName")[0].childNodes[0].nodeValue;
        var longName = XMLlanguage.getElementsByTagName("languageFullName")[0].childNodes[0].nodeValue;

        var newLanguage = new language(id, shortName, longName);
        languages[id] = newLanguage;      
    }

    export function findLanguageByShortName(_shortName: string): language{
        for (var i = 0; i < languages.length; i++) {
            if (languages[i] == undefined) continue;
            if (languages[i].shortName === _shortName) return languages[i];
        }
        return null;
    }

    //this should be a part or a subModule of a coming userModule, or of the player-class...
    export var availableBuildings: number[];
    availableBuildings = [];
    export function buildingAvailable  (id: number) {
        if (availableBuildings[id] != null)
            return true;
        else
            return false;
    }

    export function addBuilding(id: number) {
        availableBuildings[id] = 1;
    }

    export function addBuildingsFromXML(responseXML: Document) {
        var XMLuildings = responseXML.getElementsByTagName("allowedBuildingId");
        var length = XMLuildings.length;
        for (var i = 0; i < length; i++) {
            var id = parseInt(XMLuildings[i].childNodes[0].nodeValue);
            addBuilding(id);
            //Helpers.Log("allowedBuildingId : " + id.toString() );
            //createUpdateCommNode(<Element>XMLcommNodes[i]);
        }
        Helpers.Log(length + " allowed Buildings added");
    }

    export var availableHulls: number[];
    availableHulls = [];
    export function hullsAvailable(id: number) {
        if (availableHulls[id] != null)
            return true;
        else
            return false;
    }

    export function addHull(id: number) {
        availableHulls[id] = 1;
    }

    export function addHullsFromXML(responseXML: Document) {

        var respXMLstr = new XMLSerializer().serializeToString(responseXML);
        var hullJqXML = $.parseXML(respXMLstr);
        var hullJq = $(hullJqXML);

        var hullsXML = hullJq.find("ShipHulls");    
        var hulls = hullsXML.find("shipHullId");

        hulls.each(function () {
            var value = $(this).text();
            addHull(parseInt(value,10));
            //select.append("<option class='ddindent' value='" + value + "'>" + value + "</option>");
        });

        /*
        var XMLHull = responseXML.getElementsByTagName("shipHullId");
        var length = XMLHull.length;
        for (var i = 0; i < length; i++) {
            var id = parseInt(XMLHull[i].childNodes[0].nodeValue);
            addHull(id);
            //Helpers.Log("allowedBuildingId : " + id.toString() );
            //createUpdateCommNode(<Element>XMLcommNodes[i]);
        }
        Helpers.Log(length + " allowed Hulls added");
        */
    }


    export var availableModules: number[];
    availableModules = [];
    export function modulesAvailable(id: number) {
        if (availableModules[id] != null)
            return true;
        else
            return false;
    }

    export function addModule(id: number) {
        availableModules[id] = 1;
    }

    export function addModulesFromXML(responseXML: Document) {
        var XMLModule = responseXML.getElementsByTagName("allowedModuleId");
        var length = XMLModule.length;
        for (var i = 0; i < length; i++) {
            var id = parseInt(XMLModule[i].childNodes[0].nodeValue);
            addModule(id);
            //Helpers.Log("allowedBuildingId : " + id.toString() );
            //createUpdateCommNode(<Element>XMLcommNodes[i]);
        }
        Helpers.Log(length + " allowed Modules added");
    }


    export class UserRelation {
        targetId: number;
        state: number;
    }


    //all possible persons: the player, human contrahents, AIs
    export class User {
        playerResearches: PlayerResearches[] = [];  // contains researchId : PlayerResearches 
        name: string;
        tagFreeName: string;
        allianceId: number;

        /*
        relationId	relationName
        0	Krieg
        1	Feindlich
        2	Frieden
        3	Handelsvertrag
        4	Bündnis
        5   Allianzmitglied
            */
        currentRelation = 0;
        targetRelation = 0;
        hisTargetRelation = 0;

        popVicPoints = 0;
        researchVicPoints = 0;
        goodsVicPoints = 0;
        shipVicPoints = 0;
        overallVicPoints = 0;
        overallRank = 0;

        AiId = 0;
        AiRelation = 1;
        AI = false;
        LastReadGalactivEvent = 0;

        ProfileUrl = "images/interface/defaultprofile.png";

        showCombatPopup = true;
        showCombatFast = false;


        detailDataLoaded = false;
        description = '';

        researchDataLoaded = false;

        //
        relations: UserRelation[];

        constructor(public id: number) {
            this.name = 'User1';
            this.relations = [];
        }

        MakeAvatarDiv(): JQuery {
            var Div = $("<div>", { "class": "AvatarCont" });
            Div.css("background-image", "url('" + this.ProfileUrl + "')");

            return Div;
        }

        GetCurrentRelationTowardsUsers(userId: number): number {
            for (var i = 0; i < this.relations.length; i++) {
                if (this.relations[i].targetId == userId) return this.relations[i].state;
            }

            return 2;
        }

        createTagFreeName() {
            this.tagFreeName = $("<div/>").html(this.name || '').text();
        }

        shortTagFreeName(): string {
            var strLen = Math.min(this.tagFreeName.length, 22);
            return this.tagFreeName.substr(0,strLen).label();
        }

        getAlliance(): AllianceModule.Alliance {
            if (!this.allianceId) return null;
            return AllianceModule.getAlliance(this.allianceId);
        }

        isAI(): boolean {
            return this.id == 0 || this.AiId != 0;
        }

    }

    export function createUserLink(user: User) : JQuery{
     
        var senderName = '';
        senderName = (user && user.name || '');
        var header = $("<a/>", { "class":"UserLink" });
        header.html(senderName);
        var userId = user && user.id || 0;
        if (userId) {
            header.click(() => { DiplomacyModule.entryPoint2(userId, null); });
        }

        return header;
    }

    export function createTaglessUserLink(user: User): JQuery {

        var senderName = '';
        senderName = (user && user.tagFreeName || '');
        var header = $("<a/>", { "class": "UserLink" });
        header.html(senderName);
        var userId = user && user.id || 0;
        if (userId) {
            header.click(() => { DiplomacyModule.entryPoint2(userId, null); });
        }

        return header;
    }


    export function createUserHeader(skipAlliance?: boolean, skipRelations?: boolean, allianceView?:boolean): JQuery {
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
        if (typeof skipAlliance == undefined || skipAlliance == false) {
            var allianceDiv = $("<div>");
            allianceDiv.append($("<span>", { text: i18n.label(139) }));
            var tableDataAlliance = $('<th/>', { "class": "tdTextLeft borderBottom" });
            allianceDiv.css("width", "180px");
            tableDataAlliance.append(allianceDiv);
            tableRow.append(tableDataAlliance);
        }
        //Kolonien
        var coloniesDiv = $("<div>");
        coloniesDiv.append($("<span>", { text: i18n.label(445) })); //Known colonies
        var tableDataMembers = $('<th/>', { "class": "tdTextLeft borderBottom" });
        tableDataMembers.append(coloniesDiv);
        coloniesDiv.css("width", "80px");
        tableRow.append(tableDataMembers);

        //Schiffe
        var shipsDiv = $("<div>");
        shipsDiv.css("width", "80px");
        shipsDiv.append($("<span>", { text: i18n.label(446) }));
        var tableDataMembers = $('<th/>', { "class": "tdTextLeft borderBottom" });
        tableDataMembers.append(shipsDiv);
        tableRow.append(tableDataMembers);

        if (typeof skipRelations == undefined || skipRelations == false) {
            //aktuelle Beziehung     
            var currentRelDiv = $("<div>");
            currentRelDiv.css("width", "85px");
            currentRelDiv.append($("<span>", { text: i18n.label(447) })); //Relation
            var tableDataOffer = $('<th/>', { "class": "tdTextLeft borderBottom" });
            tableDataOffer.append(currentRelDiv);
            tableRow.append(tableDataOffer);

            //Eigenes Angebot     
            var ownOfferDiv = $("<div>");
            ownOfferDiv.css("width", "125px");
            ownOfferDiv.append($("<span>", { text: i18n.label(448)})); // offer
            var tableDataOffer = $('<th/>', { "class": "tdTextLeft borderBottom" });
            tableDataOffer.append(ownOfferDiv);
            tableRow.append(tableDataOffer);

            //Sein Angebot     
            var offeredDiv = $("<div>");
            offeredDiv.css("width", "96px");
            offeredDiv.append($("<span>", { text: i18n.label(449) })); //inbound offer
            var tableDataOffer = $('<th/>', { "class": "tdTextLeft borderBottom" });
            tableDataOffer.append(offeredDiv);
            tableRow.append(tableDataOffer);
        }

        //Message     
        var messageDiv = $("<div>");
        messageDiv.append($("<span>", { text: "" }));  //Contact
        var tableDataMessage = $('<th/>', { "class": "tdTextLeft borderBottom" });
        messageDiv.css("width", "180px");
        tableDataMessage.append(messageDiv);
        tableRow.append(tableDataMessage);   

        if (allianceView) {            

            if (mainObject.user.allianceId && mainObject.user.isAllianceAdmin()) {

                var tableDataInviteDiv = $("<div>");
                tableDataInviteDiv.append($("<span>", { text: "" }));
                var tableDataInvite = $('<th/>', { "class": "tdTextLeft borderBottom" });
                tableDataInviteDiv.css("width", "35px");
                tableDataInvite.append(tableDataInviteDiv);
                tableRow.append(tableDataInvite);
            }
        }
        return tableRow;
    }

    //create a tr line per User
    export function createUserTr(_user: PlayerData.User,skipAlliance?:boolean, skipRelations?: boolean, allianceView?:boolean): JQuery {

        var otherUser;
        if (_user instanceof PlayerData.OtherPlayer) otherUser = <PlayerData.OtherPlayer> _user;

        var tableRow = $("<tr/>");

        //ID
        var tableDataId = $('<td/>', { text: _user.id.toString(), "class": "firstchild" });
        tableRow.append(tableDataId);

        //NAME
        var tableDataName = $('<td/>', { text: _user.name });
        tableRow.append(tableDataName);

        //Alliance
        if (typeof skipAlliance == undefined || skipAlliance == false) {
            var tableDataAlliance = $('<td/>', { text: (_user.allianceId && AllianceModule.getAlliance(_user.allianceId).name || ' - ') });
            tableRow.append(tableDataAlliance);
        }

        //Kolonien
        var tableDataColos = $('<td/>', { text: _user.name });
        tableRow.append(tableDataColos);

        //Schiffe
        var tableDataShips = $('<td/>', { text: _user.name });
        tableRow.append(tableDataShips);

        //currentRelation
        if (typeof skipRelations == undefined || skipRelations == false) {
            var tableDataCurrentRelation = $('<td/>');
            var tableDataCurrentRelationSpan = $('<span/>', { text: mainObject.relationTypes[_user.currentRelation].name });
            tableDataCurrentRelationSpan.css("background-color", mainObject.relationTypes[_user.currentRelation].backGroundColor);
            tableDataCurrentRelationSpan.addClass("spanCurrentRelation");
            tableDataCurrentRelation.append(tableDataCurrentRelationSpan);
            tableRow.append(tableDataCurrentRelation);


            //player proposal and other player proposal
            var tableDataTargetRelation = $('<td/>');
            var tableDataHisTargetRelation = $('<td/>');
            //selector for target Relation
            if (_user.allianceId != null && _user.allianceId > 0) {
                tableRow.append(tableDataTargetRelation);
                tableRow.append(tableDataHisTargetRelation);
            } else {


                var selectorTargetRelation = $('<select/>');

                var option99 = $('<option/>');
                var option0 = $('<option/>', { text: mainObject.relationTypes[0].name });  //war
                var option1 = $('<option/>', { text: mainObject.relationTypes[1].name });  //hostle
                var option2 = $('<option/>', { text: mainObject.relationTypes[2].name });  //neutral
                var option3 = $('<option/>', { text: mainObject.relationTypes[3].name }); //trade
                var option4 = $('<option/>', { text: mainObject.relationTypes[4].name }); //Allied
                //var option5 = $('<option/>', { text: mainObject.relationTypes[5].name }); //Alliance

                option99.val("99");
                option0.val("0");

                if (_user.targetRelation == 0 && _user.targetRelation != _user.currentRelation) {
                    option0.attr('selected', 'selected');
                }

                option1.val("1");
                if (_user.targetRelation == 1 && _user.targetRelation != _user.currentRelation) {
                    option1.attr('selected', 'selected');
                }

                option2.val("2");
                if (_user.targetRelation == 2 && _user.targetRelation != _user.currentRelation) {
                    option2.attr('selected', 'selected');
                }

                option3.val("3");
                if (_user.targetRelation == 3 && _user.targetRelation != _user.currentRelation) {
                    option3.attr('selected', 'selected');
                }

                option4.val("4");
                if (_user.targetRelation == 4 && _user.targetRelation != _user.currentRelation) {
                    option4.attr('selected', 'selected');
                }

                if (_user.targetRelation == _user.currentRelation) {
                    option99.attr('selected', 'selected');
                }

                selectorTargetRelation.append(option99);
                selectorTargetRelation.append(option0);
                selectorTargetRelation.append(option1);
                selectorTargetRelation.append(option2);
                selectorTargetRelation.append(option3);
                selectorTargetRelation.append(option4);
                //selectorTargetRelation.append(option5);

                selectorTargetRelation.change(function () { DiplomacyModule.relationChanged(selectorTargetRelation.get()[0] as HTMLSelectElement, otherUser); });

                tableDataTargetRelation.append(selectorTargetRelation);
                tableRow.append(tableDataTargetRelation);

                //hisTargetRelation

                var spanHisTargetRelation = $('<span/>');
                if (_user.hisTargetRelation != _user.currentRelation) {
                    spanHisTargetRelation.text(mainObject.relationTypes[_user.hisTargetRelation].name);
                    spanHisTargetRelation.css("background-color", mainObject.relationTypes[_user.hisTargetRelation].backGroundColor);
                    spanHisTargetRelation.addClass("spanHisTargetRelation");
                }
                tableDataHisTargetRelation.append(spanHisTargetRelation);
                tableRow.append(tableDataHisTargetRelation);
            }
        }
        //Mail
        var tableDataMessage = $('<td/>');
        tableRow.append(tableDataMessage);
        tableDataMessage.css("height","26px");
        if (otherUser) {
            //tableDataMessage.addClass("mailPic");
            //tableDataMessage.append($("<img/>", { src: 'images/mail.png', alt: "goods", width: "45px", height: "30px" }));
            tableDataMessage.css("background", "url(images/Mail.png) no-repeat");
            tableDataMessage.css("background-position-y", "1px");

            tableDataMessage.click((e) => { e.preventDefault(); MessageModule.userInterface.showMessageWrite(otherUser); });
        }

        if (allianceView) {
            //lines appear in member view of allianceDetails
            // either as members - the field the dismisses the selected user from the alliance
            // or as invited users -> the field will then delete the invitation

            //check if otherUser is part of players alliance:
            var isMember = false;
            if (mainObject.user.allianceId && AllianceModule.getAlliance(mainObject.user.allianceId).hasMember(_user.id)) isMember = true;


            if (mainObject.user.allianceId && mainObject.user.isAllianceAdmin()) {
                var tableDataInvite = $('<td/>');
                tableDataInvite.addClass("invite");
                tableDataInvite.css("background", "url(images/BlackIcons.png) no-repeat -300px 0px");
                tableDataInvite.css("height", "28px");                
                tableRow.append(tableDataInvite);

                if (isMember) {
                    if (otherUser) {
                        tableDataInvite.attr("title", "Entlassen");//i18n.label(141));
                    }
                    else {
                        tableDataInvite.attr("title", "Austreten");//i18n.label(141));
                    }
                }
                else {
                    tableDataInvite.attr("title", "Zurücknehmen");//i18n.label(141));
                }

            }
        }
        return $(tableRow);
    }


    export class OtherPlayer extends User {

        constructor(public id: number) {
            super(id);
        }

        updateOtherUser(XMLuser: Element) {
            //var name = XMLuser.getElementsByTagName("username")[0].childNodes[0].nodeValue;
            //name = 'c';
            
            var name = XMLuser.getElementsByTagName("username") &&
                XMLuser.getElementsByTagName("username")[0] &&
                XMLuser.getElementsByTagName("username")[0].childNodes[0] &&
                XMLuser.getElementsByTagName("username")[0].childNodes[0].nodeValue || '';
            

            var allianceId = XMLuser.getElementsByTagName("allianceId")[0].childNodes[0].nodeValue;
            this.name = name;
            this.createTagFreeName();               

            this.allianceId = parseInt(allianceId);
            this.currentRelation = parseInt(XMLuser.getElementsByTagName("currentRelation")[0].childNodes[0].nodeValue);
            this.targetRelation = parseInt(XMLuser.getElementsByTagName("targetRelation")[0].childNodes[0].nodeValue);
            this.hisTargetRelation = parseInt(XMLuser.getElementsByTagName("otherUserRelationTowardsPlayer")[0].childNodes[0].nodeValue);

            this.popVicPoints = parseInt(XMLuser.getElementsByTagName("popVicPoints")[0].childNodes[0].nodeValue);
            this.researchVicPoints = parseInt(XMLuser.getElementsByTagName("researchVicPoints")[0].childNodes[0].nodeValue);
            this.goodsVicPoints = parseInt(XMLuser.getElementsByTagName("goodsVicPoints")[0].childNodes[0].nodeValue);
            this.shipVicPoints = parseInt(XMLuser.getElementsByTagName("shipVicPoints")[0].childNodes[0].nodeValue);
            this.overallVicPoints = parseInt(XMLuser.getElementsByTagName("overallVicPoints")[0].childNodes[0].nodeValue);
            this.overallRank = parseInt(XMLuser.getElementsByTagName("overallRank")[0].childNodes[0].nodeValue);
            
            this.AiId = parseInt(XMLuser.getElementsByTagName("AiId")[0].childNodes[0].nodeValue);
            this.AiRelation = parseInt(XMLuser.getElementsByTagName("AiRelation")[0].childNodes[0].nodeValue);

            //this.ProfileUrl = "images/interface/defaultprofile.png";
            this.ProfileUrl = XMLuser.getElementsByTagName("ProfileUrl")[0].childNodes[0].nodeValue;




            if (this.allianceId == mainObject.user.allianceId) this.currentRelation = 5;

            Chat.refreshParticipantName(this.id);

        }
    }


    export class PlayerResearches {
        userId: number;
        researchId: number;
        researchable: boolean;
        isCompleted: boolean;
        investedResearchpoints: number;
        researchPriority: number;       

        constructor(public id: number) {              
        }

        update(XMLhull: Element) {
            var researchable = parseInt(XMLhull.getElementsByTagName("researchable")[0].childNodes[0].nodeValue, 10);
            var isCompleted = parseInt(XMLhull.getElementsByTagName("isCompleted")[0].childNodes[0].nodeValue,10);
            var investedResearchpoints = parseInt(XMLhull.getElementsByTagName("investedResearchpoints")[0].childNodes[0].nodeValue, 10);
            var researchPriority = parseInt(XMLhull.getElementsByTagName("researchPriority")[0].childNodes[0].nodeValue, 10);
          
            this.researchable = researchable == 1 ? true : false;
            this.isCompleted = isCompleted == 1 ? true : false;;           
            this.investedResearchpoints = investedResearchpoints;
            this.researchPriority = researchPriority;    

            //if this Research is a Player SPecialization
            if (this.isCompleted) {
                var specResearch = BaseDataModule.FindSpecializationResearch(this.id);
                if (specResearch) specResearch.SetResearched();
            }                  
        }

        //try to research this research. If enough RP are present, do this instantly
        selected(ajaxDoneAction?: any) {

            //BaseDataModule.ShowPlayerResearchDetail(this);
            //return;


            //skip if double clicked and the second click is evaluated
            if (this.isCompleted == true) return;

            for (var i = 0; i < mainObject.user.playerResearches.length; i++) {
                if (typeof mainObject.user.playerResearches[i] === 'undefined') continue;
                mainObject.user.playerResearches[i].researchPriority = 0;
            }

            var baseResearch: BaseDataModule.Research = BaseDataModule.researches[this.id];

            Helpers.Log(i18n.label(baseResearch.label) + " selected ... ");
            this.researchPriority = 1;

            if (mainObject.user.researchPoints >= baseResearch.cost) {
                this.isCompleted = true;
                //mainObject.user.researchs[this.id] = 1;
                mainObject.user.playerResearches[this.id].isCompleted = true;
                mainObject.user.researchPoints -= baseResearch.cost;                
            }


            $.ajax("Server/research.aspx", {
                type: "GET",
                async: true,
                data: {
                    "action": "setResearch",
                    "researchId": this.id
                }
            }).done(function (msg) {
                    PlayerData.researchSelectedAjaxDone(msg, ajaxDoneAction);
            });        
        }

        

    }

    export function researchSelectedAjaxDone(msg, ajaxDoneAction?: any, scope = null) {

        //assume that new research is now available (this method is also called when a specialization is choosen) - clear research cache
        for (var i = 0; i < BaseDataModule.researches.length; i++) {
            if (BaseDataModule.researches[i] == null) continue;
            BaseDataModule.researches[i].NeedsSpecResearchCache = null;
        }

        PlayerData.getPlayerResearchesXML(msg);
        PlayerData.addBuildingsFromXML(msg);
        QuestModule.getQuestsFromXML(msg, true);
        PlayerData.addHullsFromXML(msg);
        PlayerData.addModulesFromXML(msg);

        if (mainObject.currentColony != null)
            BaseDataModule.buildingList();

        if (ajaxDoneAction != undefined) {
            if (scope == null) { ajaxDoneAction(); } else { ajaxDoneAction.call(scope);  };
        }

        //Quests            
        for (var i = 0; i < QuestModule.researchQuests.length; i++) {
            QuestModule.researchQuests[i](i);
        }
    }

    export function PlayerResearchExists(id) {
        if (mainObject.user.playerResearches[id]  != null)
            return true;
        else
            return false;
    };

    export function PlayerResearchFind(id) : PlayerResearches {
        return mainObject.user.playerResearches[id];
    };

    function PlayerResearchAdd(XMLobject) {
        var id = parseInt(XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue,10);
        var newResearch = new PlayerResearches(id);

        //add to Building array
        mainObject.user.playerResearches[id] = newResearch;
        

        //get all Building Data out of the XMLbuilding
        newResearch.update(XMLobject);

        //if not during startup, add to the modifiers:
        if (onLoadWorker.startUpFinished()) {
            RealmStatistics.checkPlayerResearch(newResearch);
        }
    };

    function createPlayerResearch(XMLobject) {
        var objectXMLId = parseInt(XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue, 10);

        if (PlayerResearchExists(objectXMLId)) // if ship exists, update it.
            mainObject.user.playerResearches[objectXMLId].update(XMLobject);
        else // if it does not yet exists, add it
            PlayerResearchAdd(XMLobject);
    }

    export function getPlayerResearchesXML(responseXML: Document) {
        var XMLshipHulls = responseXML.getElementsByTagName("PlayerResearch");
        var length = XMLshipHulls.length;
        for (var i = 0; i < length; i++) {
            createPlayerResearch(<Element>XMLshipHulls[i]);
        }
        Helpers.Log(length + " PlayerResearches added");
    }

    export function getUserResearch(user: PlayerData.User) {
        $.connection.spaceHub.invoke("FetchUserResearch", user.id).done(e => {

            for (var i = 0; i < e.Researchs.length; i++) {
                var temp = <PlayerData.PlayerResearches>(e.Researchs[i]);
                var newResearch: PlayerData.PlayerResearches;
                var researchId = temp.researchId;

                if (user.playerResearches[researchId]) {
                    newResearch = user.playerResearches[researchId];
                }
                else { 
                    newResearch = new PlayerData.PlayerResearches(researchId);
                    user.playerResearches[researchId] = newResearch;
                }
                newResearch.isCompleted = temp.isCompleted;
                newResearch.researchable = temp.researchable;
                newResearch.investedResearchpoints = temp.investedResearchpoints;
                newResearch.researchPriority = temp.researchPriority;
            }

            user.researchDataLoaded = true;

        });

    }

    export function refreshUserDataAjaxDone(msg) {
        var responseXML = msg;
        mainObject.getShipsFromXML(responseXML);
        mainObject.messageHighestId = parseInt(responseXML.getElementsByTagName("messageHighestId")[0].childNodes[0].nodeValue);

        //mainObject.serverEvents.lastUpdatedId = parseInt(responseXML.getElementsByTagName("maxServerEventId")[0].childNodes[0].nodeValue);
        
        mainObject.user.researchPoints = parseInt(responseXML.getElementsByTagName("researchPoints")[0].childNodes[0].nodeValue);

        PlayerData.getPlayerResearchesXML(responseXML);

        mainObject.user.getOtherUsersFromXML(responseXML);
        AllianceModule.getAllianceDataFromXML(responseXML);

        PlayerData.addBuildingsFromXML(responseXML);
        PlayerData.addHullsFromXML(responseXML);
        PlayerData.addModulesFromXML(responseXML);

        CommModule.getNodesFromXML(responseXML);
        QuestModule.getQuestsFromXML(responseXML, false);


        TradeOffersModule.getTradeOfferFromXML(responseXML);
        ColonyModule.getColonyBuildingFromXML(responseXML);
        ColonyModule.checkColonyXML(responseXML);

        for (var i = 0; i < mainObject.colonies.length; i++) {
            if (mainObject.colonies[i] == null) continue;
            if (mainObject.colonies[i].owner != mainObject.user.id) continue;
            mainObject.colonies[i].calcColonyRessources();
        }

        mainObject.user.updateUserData(responseXML);

        mainInterface.drawAll();
        //mainInterface.refreshQuickInfo();
        mainInterface.refreshQuickInfoGoods();
        mainInterface.refreshMainScreenStatistics();
        QuestModule.loadAllUncompletedScripts();

        //Quests            
        for (var i = 0; i < QuestModule.researchQuests.length; i++) {
            QuestModule.researchQuests[i](i);
        }
    }

    export enum BordersDisplays {
        UserColor = 1,
        UserDiplomatics = 2,
        AllianceDiplomatics = 3
    }

    //just the current player - contains data that is specific for this player
    //single instance, mainObject.user
    export class Player extends User {        
        

        otherUsers: OtherPlayer[];
        sendMessagesById = [];
        receivedMessagesById = [];
        sendMessages = [];
        receivedMessages = [];


        language: string = 'en';
        languageId: number = 0;



        lastSelectedObjectType = 0;
        lastSelectedObjectId = 0;

        nextTurn: Date;

        homePosition: ColRow =
        {
            row: 10,
            col: 10
        }

        raster = false;
        coordinates = false;
        moveShipsAsynchron = false;
        systemNames = false;
        showRessources = false;
        BordersDisplay: BordersDisplays = BordersDisplays.AllianceDiplomatics;
        colonyNames = false;
        shipNames = false;
        colonyOwners = false;
        shipOwners = false;

        scanRangeBrightness = 10;

        researchPoints = 0;

        fogVersion = 0;

        invitedByAlliance: number[] = [];//sparse array containing allianceIds where user is invited (value is just 1)

        constructor(public id: number) {
            super(id);
            this.otherUsers = [];
            this.language = 'en';
            //this.availableBuildings = [];        
        }

        setRaster() {
            Helpers.Log("setRaster");
            mainObject.user.raster = !mainObject.user.raster;
            var xhttp = GetXmlHttpObject();
            xhttp.open("GET", "Server/User.aspx?action=setRaster&value=" + mainObject.user.raster, true);
            xhttp.send("");
        }

        setCoordinates() {
            Helpers.Log("setCoordinates");
            mainObject.user.coordinates = !mainObject.user.coordinates;
            var xhttp = GetXmlHttpObject();
            xhttp.open("GET", "Server/User.aspx?action=setCoordinates&value=" + mainObject.user.coordinates, true);
            xhttp.send("");
        }

        setSystemNames() {
            Helpers.Log("setCoordinates");
            mainObject.user.systemNames = !mainObject.user.systemNames;
            var xhttp = GetXmlHttpObject();
            xhttp.open("GET", "Server/User.aspx?action=setSystemNames&value=" + mainObject.user.systemNames, true);
            xhttp.send("");
        }

        setResourceInfo() {
            Helpers.Log("setRessources");
            mainObject.user.showRessources = !mainObject.user.showRessources;
            //var xhttp = GetXmlHttpObject();
            //xhttp.open("GET", "Server/User.aspx?action=setSystemNames&value=" + mainObject.user.systemNames, true);
            //xhttp.send("");

        }

        SetBordersDisplay() {
            if (mainObject.user.BordersDisplay == BordersDisplays.UserDiplomatics)
                mainObject.user.BordersDisplay = BordersDisplays.AllianceDiplomatics;
            else
                mainObject.user.BordersDisplay = BordersDisplays.UserDiplomatics;
        }

        setColonyNames() {
            Helpers.Log("setCoordinates");
            mainObject.user.colonyNames = !mainObject.user.colonyNames;
            var xhttp = GetXmlHttpObject();
            xhttp.open("GET", "Server/User.aspx?action=setColonyNames&value=" + mainObject.user.colonyNames, true);
            xhttp.send("");
        }

        setShipNames() {
            Helpers.Log("setCoordinates");
            mainObject.user.shipNames = !mainObject.user.shipNames;
            var xhttp = GetXmlHttpObject();
            xhttp.open("GET", "Server/User.aspx?action=setShipNames&value=" + mainObject.user.shipNames, true);
            xhttp.send("");
        }

        setColonyOwners() {
            Helpers.Log("setColonyOwners");
            mainObject.user.colonyOwners = !mainObject.user.colonyOwners;
            var xhttp = GetXmlHttpObject();
            xhttp.open("GET", "Server/User.aspx?action=setColonyOwners&value=" + mainObject.user.colonyOwners, true);
            xhttp.send("");
        }

        setShipOwners() {
            Helpers.Log("setShipOwners");
            mainObject.user.shipOwners = !mainObject.user.shipOwners;
            var xhttp = GetXmlHttpObject();
            xhttp.open("GET", "Server/User.aspx?action=setShipOwners&value=" + mainObject.user.shipOwners, true);
            xhttp.send("");
        }


        setLanguage() {
            var xhttp = GetXmlHttpObject();
            xhttp.open("GET", "Server/User.aspx?action=setLanguage&value=" + mainObject.user.language, true);
            xhttp.send("");
        }

        setShowCombatPopup() {
            Helpers.Log("setShowCombatPopup");
            mainObject.user.showCombatPopup = !mainObject.user.showCombatPopup;
            $.connection.spaceHub.invoke("SetShowCombatPopup", mainObject.user.showCombatPopup );
        }

        setShowCombatFast() {
            Helpers.Log("setShowCombatFast");
            mainObject.user.showCombatFast = !mainObject.user.showCombatFast;
            $.connection.spaceHub.invoke("SetShowCombatFast", mainObject.user.showCombatFast);
        }

        setShipMovement() {
            mainObject.user.moveShipsAsynchron = !mainObject.user.moveShipsAsynchron;
            var xhttp = GetXmlHttpObject();
            xhttp.open("GET", "Server/User.aspx?action=setShipMovement&value=" + mainObject.user.moveShipsAsynchron, true);
            xhttp.send("");
        }

        getUserData() {

            $.ajax("Server/User.aspx", {
                "type": "GET",
                "async": true,
                "data": { action: "getData" }
            }).done( (msg) => {
                var responseXML = msg;


                galaxyMap.getStarsFromXML(responseXML);
                currentMap = galaxyMap.tilemap;
                scanMap = new TilemapModule.Scanmap();

                var userDataXML = new XMLSerializer().serializeToString(responseXML);
                var userDataJqXML = $.parseXML(userDataXML);
                var userDataJq = $(userDataJqXML);

                var userXML = userDataJq.find("user");
                this.id = parseInt(userXML.children("id").text(), 10);
                Helpers.Log("PlayerId: " + this.id.toString());


                //this.id = parseInt(responseXML.getElementsByTagName("id")[0].childNodes[0].nodeValue);
                //Helpers.Log("PlayerId: " + this.id.toString());
                this.name =
                responseXML.getElementsByTagName("username") &&
                responseXML.getElementsByTagName("username")[0] &&
                responseXML.getElementsByTagName("username")[0].childNodes[0] &&
                responseXML.getElementsByTagName("username")[0].childNodes[0].nodeValue || '';

                this.createTagFreeName();

                this.scanRangeBrightness = parseInt(responseXML.getElementsByTagName("scanRangeBrightness")[0].childNodes[0].nodeValue,10);
                this.homePosition = {
                    col: parseInt(responseXML.getElementsByTagName("homeCoordX")[0].childNodes[0].nodeValue)
                    , row: parseInt(responseXML.getElementsByTagName("homeCoordY")[0].childNodes[0].nodeValue)
                };

                this.popVicPoints = parseInt(responseXML.getElementsByTagName("popVicPoints")[0].childNodes[0].nodeValue);
                this.researchVicPoints = parseInt(responseXML.getElementsByTagName("researchVicPoints")[0].childNodes[0].nodeValue);
                this.goodsVicPoints = parseInt(responseXML.getElementsByTagName("goodsVicPoints")[0].childNodes[0].nodeValue);
                this.shipVicPoints = parseInt(responseXML.getElementsByTagName("shipVicPoints")[0].childNodes[0].nodeValue);
                this.overallVicPoints = parseInt(responseXML.getElementsByTagName("overallVicPoints")[0].childNodes[0].nodeValue);
                this.overallRank = parseInt(responseXML.getElementsByTagName("overallRank")[0].childNodes[0].nodeValue);


                if (responseXML.getElementsByTagName("showRaster")[0].childNodes[0].nodeValue == 'true')
                    this.raster = true;
                else
                    this.raster = false;

                if (responseXML.getElementsByTagName("showSystemNames")[0].childNodes[0].nodeValue == 'true')
                    this.systemNames = true;
                else
                    this.systemNames = false;

                if (responseXML.getElementsByTagName("showColonyNames")[0].childNodes[0].nodeValue == 'true')
                    this.colonyNames = true;
                else
                    this.colonyNames = false;

                if (responseXML.getElementsByTagName("showColonyOwners")[0].childNodes[0].nodeValue == 'true')
                    this.colonyOwners = true;
                else
                    this.colonyOwners = false;

                if (responseXML.getElementsByTagName("showShipNames")[0].childNodes[0].nodeValue == 'true')
                    this.shipNames = true;
                else
                    this.shipNames = false;

                if (responseXML.getElementsByTagName("showShipOwners")[0].childNodes[0].nodeValue == 'true')
                    this.shipOwners = true;
                else
                    this.shipOwners = false;

                if (responseXML.getElementsByTagName("showCoordinates")[0].childNodes[0].nodeValue == 'true')
                    this.coordinates = true;
                else
                    this.coordinates = false;
               


                if (responseXML.getElementsByTagName("moveShipsAsync")[0].childNodes[0].nodeValue == 'true')
                    this.moveShipsAsynchron = true;
                else
                    this.moveShipsAsynchron = false;

                this.language = responseXML.getElementsByTagName("languageShortName")[0].childNodes[0].nodeValue;
                //this.languageId = responseXML.getElementsByTagName("language")[0].childNodes[0].nodeValue;

                this.lastSelectedObjectType = parseInt(responseXML.getElementsByTagName("lastSelectedObjectType")[0].childNodes[0].nodeValue);
                this.lastSelectedObjectId = parseInt(responseXML.getElementsByTagName("lastSelectedObjectId")[0].childNodes[0].nodeValue);


                mainObject.messageHighestId = parseInt(responseXML.getElementsByTagName("messageHighestId")[0].childNodes[0].nodeValue);
                ServerEventsModule.setEventId(parseInt(responseXML.getElementsByTagName("maxServerEventId")[0].childNodes[0].nodeValue));

                //mainObject.serverEvents.lastUpdatedId = parseInt(responseXML.getElementsByTagName("maxServerEventId")[0].childNodes[0].nodeValue);
                this.researchPoints = parseInt(responseXML.getElementsByTagName("researchPoints")[0].childNodes[0].nodeValue);

                var allianceId = parseInt(responseXML.getElementsByTagName("allianceId")[0].childNodes[0].nodeValue);
                if (allianceId != 0)
                    this.allianceId = allianceId;

                this.fogVersion = parseInt(responseXML.getElementsByTagName("fogVersion")[0].childNodes[0].nodeValue);

                this.LastReadGalactivEvent = parseInt(responseXML.getElementsByTagName("LastReadGalactivEvent")[0].childNodes[0].nodeValue);
                this.ProfileUrl = responseXML.getElementsByTagName("ProfileUrl")[0].childNodes[0].nodeValue;

                if (responseXML.getElementsByTagName("showCombatPopup")[0].childNodes[0].nodeValue == 'true')
                    this.showCombatPopup = true;
                else
                    this.showCombatPopup = false;

                if (responseXML.getElementsByTagName("showCombatFast")[0].childNodes[0].nodeValue == 'true')
                    this.showCombatFast = true;
                else
                    this.showCombatFast = false;

                //create FogOfWar and load from cache
                var FogOfWarModuleField = new FogOfWarModule.Field(-2048 + 5000, -2048 + 5000);
                var FogOfWarModuleBox = new FogOfWarModule.Box(FogOfWarModuleField, 4096);
                FogOfWarModule.fog = new FogOfWarModule.FogOfWarRegion(FogOfWarModuleBox);
                FogOfWarModule.fog.load();
                mainInterface.addQuickMessage(' Fog of war loaded', 3000); 
                


                this.getOtherUsersFromXML(responseXML, true);
                AllianceModule.getAllianceDataFromXML(responseXML);

                PlayerData.languageAddAll(responseXML);
                this.languageId = PlayerData.findLanguageByShortName(this.language).id;
                PlayerData.addBuildingsFromXML(responseXML);
                PlayerData.addHullsFromXML(responseXML);
                PlayerData.addModulesFromXML(responseXML);
                ShipTemplateModule.getTemplatesFromXML(responseXML);
                PlayerData.getPlayerResearchesXML(responseXML);

                var userResearchsDone = responseXML.getElementsByTagName("researchId");
                /*for (var i = 0; i < userResearchsDone.length; i++) {
                    var researchId = userResearchsDone[i].childNodes[0].nodeValue;
                    //this.researchs[mainObject.parseInt(researchId)] = 1;
                    this.playerResearches[mainObject.parseInt(researchId)].isCompleted = true;
                }
                */
                CommModule.getNodesFromXML(responseXML);
                QuestModule.getQuestsFromXML(responseXML, false);

                //Ships:
                mainObject.getShipsFromXML(responseXML, true);               
                TradeOffersModule.getTradeOfferFromXML(responseXML);
                ColonyModule.getColonyBuildingFromXML(responseXML);
                ColonyModule.checkColonyXML(responseXML);

                this.updateUserData(responseXML);

                i18n.languageAdd(responseXML);

                onLoadWorker.userDataLoaded = true;
                onLoadWorker.progress = onLoadWorker.progress + 20;
                $('#loadingProgressbar').attr('value', onLoadWorker.progress);

                onLoadWorker.endStartup();
                Helpers.Log("GetUserData() Done");

                if (responseXML.getElementsByTagName("unreadMessages")[0].childNodes[0].nodeValue == '1')
                    document.getElementById('alertMessage').style.display = 'block';
                
                PlayerData.users[this.id] = this;


                //ColonyModule.initColonies(); 
                //ColonyModule.checkColonyXML(responseXML);


                //i18n.loadAndSwitch(this.language);
            });                             
        }

        updateUserData(responseXML: Document) {
            
            var nextTurn = responseXML.getElementsByTagName("targetTime")[0].childNodes[0].nodeValue;
            this.nextTurn = new Date(nextTurn + "Z");
            Helpers.Log(" nextTurn Pure: " + nextTurn);
            Helpers.Log(" nextTurn  : " + this.nextTurn);
            Helpers.Log(" nextTurn Lokal : " + this.nextTurn.toLocaleString());
        }

        refreshUserData() {
            $.ajax("Server/User.aspx", {
                "type": "GET",
                "async": true,
                "data": { action: "getData" }
            }).done((msg) => {
                PlayerData.refreshUserDataAjaxDone(msg);
            });
        }

        

        getOtherUsersFromXML(responseXML: Document, message = false) {
            var XMLusers = responseXML.getElementsByTagName("knownUser");
            var length = XMLusers.length;
            for (var i = 0; i < length; i++) {
                this.createUpdateOtherUser(<Element>XMLusers[i]);
            }
            if (message) {
                mainInterface.addQuickMessage(length + ' known users added', 3000);
            }
            Helpers.Log(length + " other users added");
        }


        
        getLanguages(languageId: number) {

            $.ajax("Server/User.aspx", {
                type: "POST",
                data: {
                    "action": "getLanguage",
                    "languageId": languageId
                }
            }).done(function (msg) {
                i18n.languageAdd(msg);   
                            
            }).always(function (msg) {                  
                document.getElementById('loader').style.display = 'none';
            }); 
                     
        }

        languageChanged(newVal) {
            if (this.language == newVal) return;
            Helpers.Log('OK languageChanged : ' + newVal);
            this.language = newVal;
            
            this.setLanguage(); //set in user data
            var newLanguageId = findLanguageByShortName(newVal).id;
            this.languageId = newLanguageId; 

            if (i18n.sqlLabels[newLanguageId] == undefined) {
                document.getElementById('loader').style.display = 'block';
                this.getLanguages(newLanguageId);
            }
            else
                i18n.setLabels();
            
            
            /*
            djConfig.locale = newVal;
            useI18n();
            */


            //i18n.loadAndSwitch(newVal);
            
        }

        otherUserExists(id: number) {
            if (this.otherUsers[mainObject.parseInt(id)] != null)
                return true;
            else
                return false;
        }

        otherUserFind(userId: number) {
            return this.otherUsers[userId];
        }

        createUpdateOtherUser(XMLuser: Element) {
            var id = parseInt(XMLuser.getElementsByTagName("id")[0].childNodes[0].nodeValue);

            if (this.otherUserExists(id)) // if message exists, update it.
                this.otherUsers[id].updateOtherUser(XMLuser);
            else // if ships does not yet exists, add it
                this.otherUserAdd(XMLuser);
        }

        otherUserAdd(XMLuser: Element) {
            var id = parseInt(XMLuser.getElementsByTagName("id")[0].childNodes[0].nodeValue);
            var newOtherUser = new OtherPlayer(id);

            this.otherUsers[id] = newOtherUser;
            newOtherUser.updateOtherUser(XMLuser);

            PlayerData.users[id] = newOtherUser;
        }

        relationToOtherUser(otherUserId: number): number {
            if (!this.otherUserExists(otherUserId)) return 1;

            return this.otherUserFind(otherUserId).currentRelation;

        }

        checkNewContact(targetUserId: number, targetShipId: number, targetColonyId: number, userShipId: number, userColonyId: number) {
            
            $.ajax("Server/User.aspx", {
                type: "GET",
                data: {
                    "action": "checkNewContact",
                    "targetUserId": targetUserId.toString(),
                    "targetShipId": targetShipId && targetShipId.toString(),
                    "targetColonyId": targetColonyId && targetColonyId.toString(),
                    "userShipId": userShipId && userShipId.toString(),
                    "userColonyId": userColonyId && userColonyId.toString()
                }
            }).done(function (msg) {
                mainObject.user.getOtherUsersFromXML(msg);

                //ToDO: optimize - call only if a new player was really added. Or get serverEvent by the sql-procedure checkNewContact 
                ServerEventsModule.getEvents();
            });

        }

        //mainObject.user.checkNewContactSimple(targetUserId);
        checkNewContactSimple(targetUserId: number) {

            $.ajax("Server/User.aspx", {
                type: "GET",
                data: {
                    "action": "checkNewContact",
                    "targetUserId": targetUserId.toString()       
                }
            }).done(function (msg) {
                    mainObject.user.getOtherUsersFromXML(msg);

                    //ToDO: optimize - call only if a new player was really added. Or get serverEvent by the sql-procedure checkNewContact 
                    ServerEventsModule.getEvents();
                   
                });

        }


        getUser(targetUserId: number) {

            $.ajax("Server/User.aspx", {
                type: "GET",
                data: {
                    "action": "getContact",
                    "targetUserId": targetUserId.toString()
                }
            }).done(function (msg) {
                    mainObject.user.getOtherUsersFromXML(msg);

                    //ToDO: optimize - call only if a new player was really added. Or get serverEvent by the sql-procedure checkNewContact 
                    ServerEventsModule.getEvents();
                });


        }

        isAllianceAdmin(): boolean {
            return this.allianceId && AllianceModule.allianceExists(this.allianceId) && AllianceModule.getAlliance(this.allianceId).getUserRights() || false;
        }
        /*
        numberOfPossibleColonies(): number{
            
            var numberOfColonies = 0;
            for (var x = 0; x < mainObject.colonies.length; x++) {
                if (typeof mainObject.colonies[x] === 'undefined') continue;
                if (mainObject.colonies[x].owner != mainObject.user.id) continue;
                numberOfColonies++;
            }
            

            var retValue = 1;
            for (var i = 0; i < mainObject.user.playerResearches.length; i++) {
                if (typeof mainObject.user.playerResearches[i] === 'undefined') continue;
                if (!mainObject.user.playerResearches[i].isCompleted) continue;
                if (typeof BaseDataModule.researchGains[i] === 'undefined') continue;
               
                retValue += BaseDataModule.researchGains[i].colonyCount;                
            }
            return retValue - numberOfColonies;
        }
        */

        numberOfPossibleShips(): number {
            var retValue = 25;
            for (var i = 0; i < mainObject.user.playerResearches.length; i++) {
                if (typeof mainObject.user.playerResearches[i] === 'undefined') continue;
                if (!mainObject.user.playerResearches[i].isCompleted) continue;
                if (typeof BaseDataModule.researchGains[i] === 'undefined') continue;

                retValue += BaseDataModule.researchGains[i].fleetCount;
            }
            return retValue;
        }

        /*
    
        relationChanged(relationSelector:HTMLSelectElement) {
            var newValue = relationSelector.selectedIndex;
            
            //mainInterface.showHideInfoPanel(false);
            $("#popup")[0].style.display = 'block';
           
            // $("#semiTransOverlay")[0].style.display = 'block';
            document.getElementById('semiTransOverlay').style.display = 'block';
    
           
            Helpers.Log(this.id +  " relationChanged... " + newValue );
        }
        */
    }

    export function existsUser(_id: number): boolean {
        if (mainObject.user.id == _id) return true;
        if (mainObject.user.otherUserExists(_id)) return true;
        Helpers.Log("a");
        return false;
    }


    export function findUser(_id: number): User {
        if (mainObject.user.id == _id) return mainObject.user;
        if (mainObject.user.otherUserExists(_id)) return mainObject.user.otherUserFind(_id);
        return null;
    }

    export function showSettings() {
        Helpers.Log("showSettings");

        //commNodesPanel = ElementGenerator.createFullScreenPanel();

        var settingsWindow = ElementGenerator.createPopupWindow();
        settingsWindow.BackgroundDark();

        var settingsPanel: JQuery;
        settingsPanel = settingsWindow.element;
        settingsPanel.css("height","680px");
        $('.yesButton', settingsPanel).click((e: JQuery.Event) => { settingsPanel.remove(); });
        $('.noButton', settingsPanel)[0].style.display = 'none';       

        //var panelBody = $('.fullscreenPanelBody', commNodesPanel);
        var panelBody = $('.relPanelBody', settingsPanel);

        //var caption = $('<h1/>', { text: "Einstellungen" });
        //panelBody.append(caption);

        var panelHeader = $('.relPopupHeader', settingsPanel);
        var caption = $('<h2/>', { text: i18n.label(141), style: "float:left" });
        panelHeader.append(caption);        

        var settingsDiv = $("<div/>");
        settingsDiv.css("float", "left").css("padding-right","50px");
        settingsDiv.append($('<span/>', { text: i18n.label(308)  }));
        var settingsDivTable = $('<table/>');
        settingsDiv.append(settingsDivTable);

        var selectorTargetRelation = $('<select/>');

        var option1 = $('<option/>', { val: "en", text: "English" });
        if (mainObject.user.language == 'en') option1.attr('selected', 'selected');
        var option2 = $('<option/>', { val : "de" , text: "Deutsch"});
        if (mainObject.user.language == 'de') option2.attr('selected', 'selected');
        

        selectorTargetRelation.append(option1);
        selectorTargetRelation.append(option2);

        //settingsDiv.append(selectorTargetRelation);
        settingsDivTable.append($("<tr/>").append($("<td/>", { text: i18n.label(309) })).append($("<td/>").append(selectorTargetRelation)));
        selectorTargetRelation.change(function () {
            //Helpers.Log("1 " + this.value);
            //Helpers.Log("2 " + selectorTargetRelation.get()[0].value);
            mainObject.user.languageChanged((<HTMLInputElement>this).value)
        });

        

        //var raster = $('<p/>', { text: "Raster" });
        var rasterCheckBox = $("<input/>", { type: "checkbox" });
        rasterCheckBox.prop('checked', mainObject.user.raster);
        //raster.append(rasterCheckBox);
        //settingsDiv.append(raster);
        settingsDivTable.append($("<tr/>").append($("<td/>", { text: i18n.label(310) })).append($("<td/>").append(rasterCheckBox)));     //"Zeige raster"
        rasterCheckBox.click(function () { mainObject.user.setRaster(); mainInterface.drawAll(); });

       
        var coordinatesCheckBox = $("<input/>", { type: "checkbox" });
        coordinatesCheckBox.prop('checked', mainObject.user.coordinates);      
        settingsDivTable.append($("<tr/>").append($("<td/>", { text: i18n.label(311) })).append($("<td/>").append(coordinatesCheckBox)));   //"Zeige Koordinaten"
        coordinatesCheckBox.click(function () { mainObject.user.setCoordinates(); mainInterface.drawAll(); });

        var systemNamesCheckBox = $("<input/>", { type: "checkbox" });
        systemNamesCheckBox.prop('checked', mainObject.user.systemNames);
        settingsDivTable.append($("<tr/>").append($("<td/>", { text: i18n.label(312) })).append($("<td/>").append(systemNamesCheckBox))); //"Zeige Sonnensystemnamen"
        systemNamesCheckBox.click(function () { mainObject.user.setSystemNames(); mainInterface.drawAll(); });

        var colonyNamesCheckBox = $("<input/>", { type: "checkbox" });
        colonyNamesCheckBox.prop('checked', mainObject.user.colonyNames);
        settingsDivTable.append($("<tr/>").append($("<td/>", { text: i18n.label(313) })).append($("<td/>").append(colonyNamesCheckBox))); //"Zeige Kolonienamen"
        colonyNamesCheckBox.click(function () { mainObject.user.setColonyNames(); mainInterface.drawAll(); });

        var colonyOwnersCheckBox = $("<input/>", { type: "checkbox" });
        colonyOwnersCheckBox.prop('checked', mainObject.user.colonyOwners);
        settingsDivTable.append($("<tr/>").append($("<td/>", { text: i18n.label(469) })).append($("<td/>").append(colonyOwnersCheckBox))); //"Zeige Koloniebesitzer"
        colonyOwnersCheckBox.click(function () { mainObject.user.setColonyOwners(); mainInterface.drawAll(); });

        var shipNamesCheckBox = $("<input/>", { type: "checkbox" });
        shipNamesCheckBox.prop('checked', mainObject.user.shipNames);
        settingsDivTable.append($("<tr/>").append($("<td/>", { text: i18n.label(470) })).append($("<td/>").append(shipNamesCheckBox))); //"Zeige Schiffname"
        shipNamesCheckBox.click(function () { mainObject.user.setShipNames(); mainInterface.drawAll(); });

        var shipOwnersCheckBox = $("<input/>", { type: "checkbox" });
        shipOwnersCheckBox.prop('checked', mainObject.user.shipOwners);
        settingsDivTable.append($("<tr/>").append($("<td/>", { text: i18n.label(471) })).append($("<td/>").append(shipOwnersCheckBox))); //"Zeige shipowners"
        shipOwnersCheckBox.click(function () { mainObject.user.setShipOwners(); mainInterface.drawAll(); });


        var scanRange = $("<input/>", { type: "number" });
        scanRange.prop('value', mainObject.user.scanRangeBrightness);
        settingsDivTable.append($("<tr/>").append($("<td/>", { text: i18n.label(405) })).append($("<td/>").append(scanRange))); //"Scan range brightness"
        scanRange.change(function () {
            Helpers.Log((<HTMLInputElement>this).value);
            mainObject.user.scanRangeBrightness = parseInt((<HTMLInputElement>this).value);
            //Ships.UserInterface.refreshMainScreenStatistics(selectedShip);
            $.ajax("Server/User.aspx", {
                type: "GET",
                async: true,
                data: {
                    "action": "changeBrightness",
                    "newBrightness": (<HTMLInputElement>this).value
                }
            });

        });

        var showCombatPopupCheckBox = $("<input/>", { type: "checkbox" });
        showCombatPopupCheckBox.prop('checked', mainObject.user.showCombatPopup);
        settingsDivTable.append($("<tr/>").append($("<td/>", { text: i18n.label(1100) })).append($("<td/>").append(showCombatPopupCheckBox))); //"Zeige Kampf"
        showCombatPopupCheckBox.click(function () { mainObject.user.setShowCombatPopup(); }); 

        var showCombatFastCheckBox = $("<input/>", { type: "checkbox" });
        showCombatFastCheckBox.prop('checked', mainObject.user.showCombatFast);
        settingsDivTable.append($("<tr/>").append($("<td/>", { text: i18n.label(1101) })).append($("<td/>").append(showCombatFastCheckBox))); //"Schneller Kampf"
        showCombatFastCheckBox.click(function () { mainObject.user.setShowCombatFast(); }); 

        //colonyNamesCheckBox.click(function () { mainObject.user.setColonyNames(); mainInterface.drawAll(); });


        var userNameTable = $('<table/>');
        settingsDiv.append(userNameTable);

        userNameTable.append($("<tr/>").append($("<td/>", { text: i18n.label(406) })).append($("<td/>", { "text": mainObject.user.nextTurn.toLocaleString() })));
        userNameTable.append($("<tr/>").append($("<td/>", { text: i18n.label(407) })).append($("<td/>", { "text": mainObject.user.id.toString() })));

        var nameInput = $("<input/>", { type: "text", value: mainObject.user.name });
        nameInput.css("width", "12em");

        nameInput.change(function () {
            Helpers.Log((<HTMLInputElement>this).value);
            mainObject.user.name = (<HTMLInputElement>this).value;
            mainObject.user.createTagFreeName();
            //Ships.UserInterface.refreshMainScreenStatistics(selectedShip);
            /*
            $.ajax("Server/User.aspx", {
                type: "GET",
                async: true,
                data: {
                    "action": "renameUser",                    
                    "newName": this.value
                }
            });
            */
            $.ajax("Server/User.aspx?action=renameUser", {
                type: "POST",
                data: (<HTMLInputElement>this).value,
                contentType: "xml",
                processData: false
            });


        });



        userNameTable.append($("<tr/>").append($("<td/>", { text: i18n.label(408) })).append($("<td/>").append(nameInput)));

        
        panelBody.append(settingsDiv);
      
        
        var keymapInfo = $('<div/>');
        keymapInfo.append($('<span/>', { text: i18n.label(331)}));
        var keymapTable = $('<table/>');
        keymapTable.append($("<tr/>").append($("<td/>", { text: "5" })).append($("<td/>", { text: i18n.label(314) }))); //"Zentriere aktuelles Schiff"
        keymapTable.append($("<tr/>").append($("<td/>", { text: "x" })).append($("<td/>", { text: i18n.label(199) }))); //"Reinzoomen"
        keymapTable.append($("<tr/>").append($("<td/>", { text: "z" })).append($("<td/>", { text: i18n.label(200) })));//"Herauszoomen" 
        keymapTable.append($("<tr/>").append($("<td/>", { text: "r" })).append($("<td/>", { text: i18n.label(317) })));//"Raster ein/aus"
        keymapTable.append($("<tr/>").append($("<td/>", { text: "c" })).append($("<td/>", { text: i18n.label(318) })));// "Koordinaten ein/aus"
        keymapTable.append($("<tr/>").append($("<td/>", { text: "a" })).append($("<td/>", { text: i18n.label(319) })));//"Kolonienamen ein/aus"
        keymapTable.append($("<tr/>").append($("<td/>", { text: "s" })).append($("<td/>", { text: i18n.label(320) }))); //   "Systemnamen ein/aus"   
        //keymapTable.append($("<tr/>").append($("<td/>", { text: "i" })).append($("<td/>", { text: i18n.label(726) }))); //   "Ressources ein/aus"   
        keymapTable.append($("<tr/>").append($("<td/>", { text: "b" })).append($("<td/>", { text: i18n.label(837) }))); //   User borders / Alliance borders
        keymapTable.append($("<tr/>").append($("<td/>", { text: "h" })).append($("<td/>", { text: i18n.label(321) })));//"Zoom zur Heimatposition"
        keymapTable.append($("<tr/>").append($("<td/>", { text: "1" })).append($("<td/>", { text: i18n.label(322) })));//"Schiff nach links unten bewegen"
        keymapTable.append($("<tr/>").append($("<td/>", { text: "2" })).append($("<td/>", { text: i18n.label(323) })));//"Schiff nach unten bewegen"
        keymapTable.append($("<tr/>").append($("<td/>", { text: "3" })).append($("<td/>", { text: i18n.label(324) })));//"Schiff nach unten rechts bewegen"
        keymapTable.append($("<tr/>").append($("<td/>", { text: "4" })).append($("<td/>", { text: i18n.label(325) })));//"Schiff nach links bewegen"
        keymapTable.append($("<tr/>").append($("<td/>", { text: "6" })).append($("<td/>", { text: i18n.label(326) })));//"Schiff nach rechts bewegen"
        keymapTable.append($("<tr/>").append($("<td/>", { text: "7" })).append($("<td/>", { text: i18n.label(327) })));//"Schiff nach links oben bewegen"
        keymapTable.append($("<tr/>").append($("<td/>", { text: "8" })).append($("<td/>", { text: i18n.label(328) })));//"Schiff nach oben bewegen"
        keymapTable.append($("<tr/>").append($("<td/>", { text: "9" })).append($("<td/>", { text: i18n.label(329) })));//"Schiff nach rechts oben bewegen"
        keymapTable.append($("<tr/>").append($("<td/>", { text: "y" })).append($("<td/>", { text: i18n.label(393) + ' ' + i18n.label(394) })));//"Kartenebene nach oben"  -> Back to:


        keymapInfo.append(keymapTable);
        panelBody.append(keymapInfo);

        if (isDemo) {
            var buttonList = $("<ul/>", { "class": "buttonUl" });
            buttonList.css("right", "inherit");
            var buttonListButton = $("<li/>", { text: i18n.label(409), "class": "panelLi" });
            buttonList.append(buttonListButton);
            buttonListButton.click((e: JQuery.Event) => { newTurn(); settingsPanel.remove(); });
            panelBody.append(buttonList);
        }

        if (galaxyMap.IsDemo) {

            settingsDiv.append($('<br>'));

            var TestIdTable = $('<table/>');
            settingsDiv.append(TestIdTable);

            //make an input for the demo user id
            var IdInput = $("<input/>");
            IdInput.attr("type", "number");
            IdInput.attr("min", "1");
            IdInput.attr("max", "20000");

            if (galaxyMap.DemoUser) {
                IdInput.val(galaxyMap.DemoUser);
            } else {
                IdInput.val(mainObject.user.id);
            }

            IdInput.change(function () {
                Helpers.Log((<HTMLInputElement>this).value);
                galaxyMap.DemoUser = parseInt((<HTMLInputElement>this).value);                

                $.ajax("Server/User.aspx?action=SetDemoId", {
                    type: "POST",
                    data: (<HTMLInputElement>this).value,
                    contentType: "xml",
                    processData: false
                });


            });
            TestIdTable.append($("<tr/>").append($("<td/>", { text: "Demo ID " })).append($("<td/>").append(IdInput)));


            //make an input for the startingRegion
            /*
            var startingRegionInput = $("<input/>");
            startingRegionInput.attr("type", "text");

            startingRegionInput.change(function () {
                Helpers.Log((<HTMLInputElement>this).value);                

                $.ajax("Server/User.aspx?action=SetstartingRegionInput", {
                    type: "POST",
                    data: (<HTMLInputElement>this).value,
                    contentType: "xml",
                    processData: false
                });


            });
            TestIdTable.append($("<tr/>").append($("<td/>", { text: "Starting Region  " })).append($("<td/>").append(startingRegionInput)));
            */
        }

        settingsPanel.appendTo("body"); //attach to the <body> element
    }

    export function newTurn() {

        $.ajax("Server/User.aspx", {
            type: "GET",
            data: {
                "action": "newTurnByUser"                
            }
        });
    }

    export function RefreshRankDisplay() {
        $("#Rank").html(i18n.label(570) + ': ' + mainObject.user.overallRank); // Cancel 

        var RankTooltip = $("<div/>");
        /*
        Your overall rank: 3
        ---------------------
        Population: 1
        Ships: 3
        Research: 5
        Transcendence: 3        
        */
        RankTooltip.append($('<span>', { text: i18n.label(611).format(mainObject.user.overallRank.toString())})).append($('<br>')); //Your overall rank: 3

        RankTooltip.append(Helpers.tooltipLine()).append($('<br>'));
        
        RankTooltip.append($('<span>', { text: i18n.label(998).format(mainObject.user.popVicPoints.toString()) })).append($('<br>')); //Population
        RankTooltip.append($('<span>', { text: i18n.label(999).format(mainObject.user.shipVicPoints.toString()) })).append($('<br>')); //Ships
        RankTooltip.append($('<span>', { text: i18n.label(1000).format(mainObject.user.researchVicPoints.toString()) })).append($('<br>')); //Research
        RankTooltip.append($('<span>', { text: i18n.label(1001).format(mainObject.user.goodsVicPoints.toString()) })).append($('<br>')); //Transcendence

        $("#Rank").tooltip({ content: function () { return RankTooltip.html(); } });

    }
}
