//module Quests handles user Quests - Intro-Quests, Story-Quests and Random-Quests
//
var QuestModule;
(function (QuestModule) {
    var quests = [];
    QuestModule.readNextLoadedQuest = false;
    QuestModule.movementQuests = []; //checks after any ship.ts -> moveShip()
    QuestModule.colonizeQuests = []; //checks after any  ship.ts -> checkColonizationResult()
    QuestModule.inspectSurfaceQuests = []; //checks after areaData.ts -> switchInterfaceToThisMap()
    QuestModule.inspectSystemQuests = []; //checks after areaData.ts -> switchInterfaceToThisMap()
    QuestModule.inspectShipQuests = []; //checks after 
    QuestModule.buildQuests = []; //checks after TileMap.ts -> PlanetMap.tileClick()
    QuestModule.researchQuests = [];
    var questPanel;
    var Quest = /** @class */ (function () {
        function Quest(id) {
            this.id = id;
            this.isRead = true;
            this.isCompleted = false;
            this.hasScript = false;
            this.scriptPath = '';
        }
        Quest.prototype.update = function (XMLmessage) {
            var isRead = XMLmessage.getElementsByTagName("isRead")[0].childNodes[0].nodeValue;
            var isCompleted = XMLmessage.getElementsByTagName("isCompleted")[0].childNodes[0].nodeValue;
            var hasScript = XMLmessage.getElementsByTagName("hasScript")[0].childNodes[0].nodeValue;
            //var name = XMLmessage.getElementsByTagName("name")[0].childNodes[0].nodeValue;
            var label = parseInt(XMLmessage.getElementsByTagName("label")[0].childNodes[0].nodeValue, 10);
            this.label = label;
            this.isRead = isRead == 1 || isRead === "true" ? true : false;
            this.isCompleted = isCompleted == 1 || isCompleted === "true" ? true : false;
            this.hasScript = hasScript == 1 || hasScript === "true" ? true : false;
            if (this.hasScript) {
                var scriptPath = XMLmessage.getElementsByTagName("script")[0].childNodes[0].nodeValue;
                this.scriptPath = scriptPath;
            }
            //this.name = this.id.toString();
            //this.name = name;
            this.label = label;
            //only uncompleted quests get an icon
            //if quest is not read, it will be opened as a window, and no icon is required (yet)
            if (!this.isCompleted && this.isRead && this.icon == null)
                this.createIcon();
        };
        Quest.prototype.loadScript = function () {
            if (!this.hasScript)
                return;
            //the scripts add itself to the DOM and runs once. It will add itself to this quest as the this.script variable.
            //Scripts.scriptsAdmin.loadAndRun(0, this.id, 'Quests/' + this.scriptPath);
            Scripts.scriptsAdmin.loadAndRun(0, this.id, QuestPath + this.scriptPath);
        };
        Quest.prototype.questIsRead = function () {
            $.ajax("Server/Quests.aspx", {
                "type": "GET",
                "async": true,
                "data": {
                    "action": "questRead",
                    "questId": this.id.toString()
                }
            });
        };
        Quest.prototype.introQuestCompleted = function () {
            if (!this.isCompleted) {
                this.isCompleted = true;
                $.ajax("Server/Quests.aspx", {
                    "type": "GET",
                    "async": true,
                    "data": {
                        "action": "IntroQuestCompleted",
                        "questId": this.id.toString()
                    }
                }).done(function (msg) {
                    QuestModule.getQuestsFromXML(msg, true);
                    PlayerData.addBuildingsFromXML(msg);
                    if (mainObject.currentColony && PanelController.panelsToShow == PanelController.PanelChoice.Colony) {
                        BaseDataModule.buildingList();
                    }
                });
            }
        };
        Quest.prototype.createIcon = function () {
            var _this = this;
            //this.icon = $("<div>", { "class": "questDummy", "title": i18n.label(this.label), "text": "Q" });   
            this.icon = $("<li>");
            this.icon.css("display", "block");
            Helpers.Log("Quest icon Label : " + this.label);
            //var button = $("<button>", { "title": i18n.label(this.label), "text": "Q" });
            var button = $("<button>");
            this.icon.append(button);
            //button.button();       
            //this.icon.tooltip();
            ElementGenerator.Button(button, 912, null); // label = 'Q', Tooltip are 
            this.icon.data("quest", this);
            button.click(function (e) {
                QuestModule.readNextLoadedQuest = true;
                _this.loadScript();
                _this.icon.css("display", "none");
            });
            $("#ui #QuestList ul").append(this.icon);
        };
        Quest.prototype.showCreateIcon = function () {
            if (this.icon == null)
                this.createIcon();
            else
                this.icon.css("display", "block");
        };
        return Quest;
    }());
    QuestModule.Quest = Quest;
    function refreshIconLabels() {
        for (var i = 0; i < quests.length; i++) {
            if (quests[i] != null && quests[i].hasScript && quests[i].icon != null) {
                $("button", quests[i].icon).attr("title", i18n.label(quests[i].label));
                $("button span", quests[i].icon).text(i18n.label(912));
            }
        }
    }
    QuestModule.refreshIconLabels = refreshIconLabels;
    function loadAllUncompletedScripts() {
        for (var i = 0; i < quests.length; i++) {
            if (quests[i] != null && quests[i].hasScript && !quests[i].isCompleted && quests[i].script == null) {
                quests[i].loadScript();
            }
        }
    }
    QuestModule.loadAllUncompletedScripts = loadAllUncompletedScripts;
    function questExists(id) {
        if (quests[id] != null)
            return true;
        else
            return false;
    }
    QuestModule.questExists = questExists;
    function getQuest(id) {
        if (!questExists(id))
            return null;
        return quests[id];
    }
    QuestModule.getQuest = getQuest;
    var questAdd = function (XMLQuest, loadingScript) {
        var id = parseInt(XMLQuest.getElementsByTagName("questId")[0].childNodes[0].nodeValue);
        var newQuest = new Quest(id);
        quests[id] = newQuest;
        newQuest.update(XMLQuest);
        if (loadingScript)
            newQuest.loadScript();
    };
    var createUpdateQuest = function (XMLQuest, displayScript) {
        var id = parseInt(XMLQuest.getElementsByTagName("questId")[0].childNodes[0].nodeValue);
        if (questExists(id))
            quests[id].update(XMLQuest);
        else
            questAdd(XMLQuest, displayScript);
    };
    function getQuestsFromXML(responseXML, displayScript) {
        var XMLQuest = responseXML.getElementsByTagName("Quest");
        var length = XMLQuest.length;
        for (var i = 0; i < length; i++) {
            createUpdateQuest(XMLQuest[i], displayScript);
        }
        Helpers.Log(length + " Quests added or updated");
    }
    QuestModule.getQuestsFromXML = getQuestsFromXML;
    //Action-Events To Check for Quests:
    function checkMovement(movementResult) {
        for (var i = 0; i < QuestModule.movementQuests.length; i++) {
            QuestModule.movementQuests[i](movementResult, i);
        }
    }
    QuestModule.checkMovement = checkMovement;
    function showQuests() {
        var questWindow = ElementGenerator.MainPanel();
        questWindow.setHeader(i18n.label(104));
        var questPanel = questWindow.element;
        refreshAll(questPanel, questWindow);
        questWindow.SetBottom();
    }
    QuestModule.showQuests = showQuests;
    function refreshAll(_questPanel, _windowHandle) {
        var panelBody = $('.relPanelBody', _questPanel);
        panelBody.empty();
        var placeReservedForOwnNodes = 0;
        // create a table with unfinished quests - if there are any
        var unfinishedQuests = [];
        for (var i = 0; i < quests.length; i++) {
            if (typeof quests[i] === 'undefined' || quests[i].isCompleted) {
                continue;
            }
            unfinishedQuests.push(quests[i]);
        }
        if (unfinishedQuests.length > 0) {
            placeReservedForOwnNodes = 250;
            var owns = $('<span><b>' + i18n.label(547) + '</b></span>'); //text: i18n.label(300)
            panelBody.append(owns);
            var t1 = _windowHandle.createTable(panelBody, unfinishedQuests, createHeader, createTableLine, null, 110, null, 80, false);
            //Helpers.setTBodyHeight(panelBody, t1, null, 170, true);
        }
        //create a table with finished quests
        var finished = $('<span><b>' + i18n.label(548) + '</b></span>'); //text: i18n.label(300)
        panelBody.append(finished);
        var finishedQuests = [];
        for (var i = 0; i < quests.length; i++) {
            if (typeof quests[i] === 'undefined' || quests[i].isCompleted == false) {
                continue;
            }
            finishedQuests.push(quests[i]);
        }
        var t2 = _windowHandle.createTable(panelBody, finishedQuests, createHeader, createTableLine, null, 110, null, 81, false);
        //Helpers.setTBodyHeight(panelBody, t2, null, -placeReservedForOwnNodes, true); 
    }
    function showQuests2() {
        Helpers.Log("showQuests");
        //commNodesPanel = ElementGenerator.createFullScreenPanel();
        questPanel = ElementGenerator.createPopup();
        $('.yesButton', questPanel).click(function (e) { questPanel.remove(); });
        $('.noButton span', questPanel)[0].style.display = 'none';
        //var panelBody = $('.fullscreenPanelBody', commNodesPanel);
        var panelBody = $('.relPanelBody', questPanel);
        //var caption = $('<h1/>', { text: "Aufträge" });
        //panelBody.append(caption);
        var panelHeader = $('.relPopupHeader', questPanel);
        var caption = $('<span/>', { text: i18n.label(104), style: "float:left" });
        panelHeader.append(caption);
        //build Table of incomplete Quests
        var buildTable = $('<table/>', { "class": "fullscreenTable", "cellspacing": 0 }); // , style:"border-collapse: collapse;"
        var addRow = false;
        for (var i = 0; i < quests.length; i++) {
            if (typeof quests[i] === 'undefined') { /*Helpers.Log("undef");*/
                continue;
            }
            if (quests[i].isCompleted)
                continue;
            (function createLineClosure(quest) {
                //create a empty TR  , so that we have a little Sapce between the TRs                
                if (addRow) {
                    var spacer = $('<tr/>', { "class": "TRspacer" });
                    buildTable.append(spacer);
                }
                else
                    addRow = true;
                buildTable.append(createTableLine2(quest));
            })(quests[i]);
        }
        var spacer = $('<tr/>', { "class": "TRspacer" });
        buildTable.append(spacer);
        panelBody.append(buildTable);
        //build table with completed quests:
        panelBody.append($('<hr/>'));
        var buildTable2 = $('<table/>', { "class": "fullscreenTable", "cellspacing": 0 }); // , style:"border-collapse: collapse;"
        addRow = false;
        for (var i = 0; i < quests.length; i++) {
            if (typeof quests[i] === 'undefined') { /*Helpers.Log("undef");*/
                continue;
            }
            if (!quests[i].isCompleted)
                continue;
            (function createLineClosure(quest) {
                //create a empty TR  , so that we have a little Sapce between the TRs                
                if (addRow) {
                    var spacer = $('<tr/>', { "class": "TRspacer" });
                    buildTable2.append(spacer);
                }
                else
                    addRow = true;
                buildTable2.append(createTableLine2(quest));
            })(quests[i]);
        }
        var spacer2 = $('<tr/>', { "class": "TRspacer" });
        buildTable2.append(spacer2);
        panelBody.append(buildTable2);
        questPanel.appendTo("body"); //attach to the <body> element
    }
    QuestModule.showQuests2 = showQuests2;
    function createHeader() {
        var th = ElementGenerator.headerElement;
        var tableRow = $('<tr/>');
        tableRow.append(th(442, 50, true)); //Id
        tableRow.append(th(443, 643, true, 540)); //Name  
        return tableRow;
    }
    function createTableLine(_caller, quest) {
        var tableRow = $('<tr/>');
        //tableRow.click((e: JQueryEventObject) => { e.stopPropagation(); commNode.showCommMessages(_caller); messages.text(commNode.readAndUnreadCount()); });
        var tableDataId = $('<td/>', { text: quest.id.toString() });
        if (!quest.isCompleted)
            tableDataId.addClass("firstchildGreen");
        tableRow.append(tableDataId);
        var tableDataRead = $('<td/>');
        if (!quest.isCompleted)
            tableDataRead.addClass("lastchildGreen");
        var readComm = $('<div/>', { text: i18n.label(quest.label) });
        readComm.click(function (e) { window.scrollTo(0, 0); QuestModule.readNextLoadedQuest = true; quest.loadScript(); });
        tableDataRead.append(readComm);
        tableRow.append(tableDataRead);
        return tableRow;
    }
    function createTableLine2(quest) {
        var tableRow = $('<tr/>');
        var tableDataId = $('<td/>', { text: quest.id.toString(), "class": "firstchild" });
        if (!quest.isCompleted)
            tableDataId.addClass("firstchildGreen");
        tableRow.append(tableDataId);
        var tableDataRead = $('<td/>', { "class": "lastchild" });
        if (!quest.isCompleted)
            tableDataRead.addClass("lastchildGreen");
        var readComm = $('<div/>', { "class": "fullscreenTableButton", text: i18n.label(quest.label) });
        readComm.click(function (e) { QuestModule.readNextLoadedQuest = true; quest.loadScript(); });
        tableDataRead.append(readComm);
        tableRow.append(tableDataRead);
        return tableRow;
    }
})(QuestModule || (QuestModule = {}));
//# sourceMappingURL=Quests.js.map