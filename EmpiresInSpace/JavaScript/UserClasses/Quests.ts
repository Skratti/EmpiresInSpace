

//module Quests handles user Quests - Intro-Quests, Story-Quests and Random-Quests
//
module QuestModule {

    var quests: Quest[] = [];

    export var readNextLoadedQuest = false;

    export var movementQuests = []; //checks after any ship.ts -> moveShip()
    export var colonizeQuests = []; //checks after any  ship.ts -> checkColonizationResult()
    export var inspectSurfaceQuests = []; //checks after areaData.ts -> switchInterfaceToThisMap()
    export var inspectSystemQuests = []; //checks after areaData.ts -> switchInterfaceToThisMap()
    export var inspectShipQuests = []; //checks after 
    export var buildQuests = []; //checks after TileMap.ts -> PlanetMap.tileClick()
    export var researchQuests = [];

    var questPanel: JQuery;

    export class Quest {
        
        isRead = true;
        isCompleted = false;
        hasScript = false;
        scriptPath = '';
        script: Scripts.Script;
        //name: string;
        label: number;
        icon: JQuery;

        constructor(public id: number) {          
        }


        update(XMLmessage) {
            var isRead = XMLmessage.getElementsByTagName("isRead")[0].childNodes[0].nodeValue;
            var isCompleted = XMLmessage.getElementsByTagName("isCompleted")[0].childNodes[0].nodeValue;
            var hasScript = XMLmessage.getElementsByTagName("hasScript")[0].childNodes[0].nodeValue;
            //var name = XMLmessage.getElementsByTagName("name")[0].childNodes[0].nodeValue;
           
            var label = parseInt(XMLmessage.getElementsByTagName("label")[0].childNodes[0].nodeValue, 10);
            this.label = label;

            this.isRead = isRead == 1 || isRead === "true" ?  true : false;
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
            if (!this.isCompleted && this.isRead && this.icon == null) this.createIcon();
        }

        loadScript() {
            if (!this.hasScript) return;
            
            //the scripts add itself to the DOM and runs once. It will add itself to this quest as the this.script variable.
            //Scripts.scriptsAdmin.loadAndRun(0, this.id, 'Quests/' + this.scriptPath);
            Scripts.scriptsAdmin.loadAndRun(0, this.id, QuestPath + this.scriptPath);                                      
        }

        questIsRead() {
            $.ajax("Server/Quests.aspx", {
                "type": "GET",
                "async": true,
                "data": {
                    "action": "questRead",
                    "questId": this.id.toString()
                }
            });
        }

        introQuestCompleted() {
            
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
        }

        createIcon() {            
            //this.icon = $("<div>", { "class": "questDummy", "title": i18n.label(this.label), "text": "Q" });   
            this.icon = $("<li>");
            this.icon.css("display", "block");
            Helpers.Log("Quest icon Label : " + this.label);

            //var button = $("<button>", { "title": i18n.label(this.label), "text": "Q" });
            var button = $("<button>");
            this.icon.append(button);

            //button.button();       
            //this.icon.tooltip();
            ElementGenerator.Button(button, 912, null);  // label = 'Q', Tooltip are 


            this.icon.data("quest", this);            
            button.click((e: JQueryEventObject) =>
            {
                readNextLoadedQuest = true;
                this.loadScript();
                this.icon.css("display","none");
            });

            $("#ui #QuestList ul").append(this.icon);
        }

        showCreateIcon() {
            if (this.icon == null) this.createIcon();
            else this.icon.css("display","block");
        }
    }

    export function refreshIconLabels() {
        for (var i = 0; i < quests.length; i++) {
            if (quests[i] != null && quests[i].hasScript && quests[i].icon != null) {
                $("button", quests[i].icon).attr("title", i18n.label(quests[i].label));
                $("button span", quests[i].icon).text(i18n.label(912));
            }
        }
    }

    export function loadAllUncompletedScripts() {
        for (var i = 0; i < quests.length; i++)
        {
            if (quests[i] != null && quests[i].hasScript && !quests[i].isCompleted && quests[i].script == null ) {
                quests[i].loadScript();
            }
        }

    }

    export function questExists(id: number): boolean {
        if (quests[id] != null)
            return true;
        else
            return false;
    }

    export function getQuest(id: number) : Quest {
        if (!questExists(id)) return null;
        return quests[id];        
    }

    var questAdd = function (XMLQuest: Element, loadingScript: boolean) {
        var id = parseInt(XMLQuest.getElementsByTagName("questId")[0].childNodes[0].nodeValue);
        var newQuest = new Quest(id);

        quests[id] = newQuest;       

        newQuest.update(XMLQuest);
        if (loadingScript) newQuest.loadScript();
    }

    var createUpdateQuest = function (XMLQuest: Element, displayScript: boolean) {
        var id = parseInt(XMLQuest.getElementsByTagName("questId")[0].childNodes[0].nodeValue);

        if (questExists(id))
            quests[id].update(XMLQuest);
        else
            questAdd(XMLQuest, displayScript);
    }

    export function getQuestsFromXML(responseXML: Document, displayScript: boolean) {
        var XMLQuest = responseXML.getElementsByTagName("Quest");
        var length = XMLQuest.length;
        for (var i = 0; i < length; i++) {
            createUpdateQuest(<Element>XMLQuest[i], displayScript);
        }
        Helpers.Log(length + " Quests added or updated");
    }    

    //Action-Events To Check for Quests:
    export function checkMovement(movementResult : Document) {
        for (var i = 0; i < movementQuests.length; i++) {
            movementQuests[i](movementResult,i);
        }
    }
    export function showQuests() {
        var questWindow = ElementGenerator.MainPanel();

        questWindow.setHeader(i18n.label(104));
        var questPanel = questWindow.element;
        refreshAll(questPanel, questWindow);

        questWindow.SetBottom();
    }

    function refreshAll(_questPanel: JQuery, _windowHandle: ElementGenerator.WindowManager) {

        var panelBody = $('.relPanelBody', _questPanel);
        panelBody.empty();    

        var placeReservedForOwnNodes = 0;

        // create a table with unfinished quests - if there are any
        var unfinishedQuests: Quest[] = [];
        for (var i = 0; i < quests.length; i++) {
            if (typeof quests[i] === 'undefined' || quests[i].isCompleted ) { continue; }
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

        var finishedQuests: Quest[] = [];
        for (var i = 0; i < quests.length; i++) {
            if (typeof quests[i] === 'undefined' || quests[i].isCompleted == false) { continue; }
            finishedQuests.push(quests[i]);
        }
        var t2 = _windowHandle.createTable(panelBody, finishedQuests, createHeader, createTableLine, null, 110, null, 81, false);
        //Helpers.setTBodyHeight(panelBody, t2, null, -placeReservedForOwnNodes, true); 
    }

    export function showQuests2() {
        Helpers.Log("showQuests");

        //commNodesPanel = ElementGenerator.createFullScreenPanel();

        questPanel = ElementGenerator.createPopup();
        $('.yesButton', questPanel).click((e: JQueryEventObject) => { questPanel.remove(); });
        $('.noButton span', questPanel)[0].style.display = 'none';


        //var panelBody = $('.fullscreenPanelBody', commNodesPanel);
        var panelBody = $('.relPanelBody', questPanel);

        //var caption = $('<h1/>', { text: "Aufträge" });
        //panelBody.append(caption);

        var panelHeader = $('.relPopupHeader', questPanel);
        var caption = $('<span/>', { text: i18n.label(104), style: "float:left" });
        panelHeader.append(caption);


        //build Table of incomplete Quests
        var buildTable = $('<table/>', { "class" : "fullscreenTable", "cellspacing": 0 });// , style:"border-collapse: collapse;"
        var addRow = false;
        
        for (var i = 0; i < quests.length; i++) {
            if (typeof quests[i] === 'undefined' ) { /*Helpers.Log("undef");*/ continue; }            

            if (quests[i].isCompleted) continue;

            (function createLineClosure(quest: Quest) {
                //create a empty TR  , so that we have a little Sapce between the TRs                
                if (addRow) {
                    var spacer = $('<tr/>', { "class" : "TRspacer" });
                    buildTable.append(spacer);
                }
                else
                    addRow = true;

                buildTable.append(createTableLine2(quest));
            })(quests[i]);
        }
        var spacer = $('<tr/>', { "class" : "TRspacer" });
        buildTable.append(spacer);

        panelBody.append(buildTable);

        //build table with completed quests:
        panelBody.append($('<hr/>'));

        var buildTable2 = $('<table/>', { "class" : "fullscreenTable", "cellspacing": 0 });// , style:"border-collapse: collapse;"
        addRow = false;
        for (var i = 0; i < quests.length; i++) {
            if (typeof quests[i] === 'undefined') { /*Helpers.Log("undef");*/ continue; }

            if (!quests[i].isCompleted) continue;

            (function createLineClosure(quest: Quest) {
                //create a empty TR  , so that we have a little Sapce between the TRs                
                if (addRow) {
                    var spacer = $('<tr/>', { "class" : "TRspacer" });
                    buildTable2.append(spacer);
                }
                else
                    addRow = true;

                buildTable2.append(createTableLine2(quest));
            })(quests[i]);
        }
        var spacer2 = $('<tr/>', { "class" : "TRspacer" });
        buildTable2.append(spacer2);

        panelBody.append(buildTable2);


        questPanel.appendTo("body"); //attach to the <body> element
    }

    function createHeader(): JQuery {      
        var th = ElementGenerator.headerElement;

        var tableRow = $('<tr/>');
             
        tableRow.append(th(442, 50, true));  //Id
        tableRow.append(th(443, 643, true, 540)); //Name  
         
        return tableRow;
    }


    function createTableLine(_caller: ElementGenerator.WindowManager, quest: Quest): JQuery {

        var tableRow = $('<tr/>');
              
        //tableRow.click((e: JQueryEventObject) => { e.stopPropagation(); commNode.showCommMessages(_caller); messages.text(commNode.readAndUnreadCount()); });

        var tableDataId = $('<td/>', { text: quest.id.toString() });
        if (!quest.isCompleted) tableDataId.addClass("firstchildGreen");
        tableRow.append(tableDataId);        


        var tableDataRead = $('<td/>');
        if (!quest.isCompleted) tableDataRead.addClass("lastchildGreen");

        var readComm = $('<div/>', {  text: i18n.label(quest.label) });
        readComm.click((e: JQueryEventObject) => { window.scrollTo(0, 0); readNextLoadedQuest = true; quest.loadScript(); });
        tableDataRead.append(readComm);
        


        tableRow.append(tableDataRead);                       
        return tableRow;
    }

    function createTableLine2(quest: Quest): JQuery {

        var tableRow = $('<tr/>');

        var tableDataId = $('<td/>', { text: quest.id.toString(), "class": "firstchild" });
        if (!quest.isCompleted) tableDataId.addClass("firstchildGreen");
        tableRow.append(tableDataId);


        var tableDataRead = $('<td/>', { "class": "lastchild" });
        if (!quest.isCompleted) tableDataRead.addClass("lastchildGreen");

        var readComm = $('<div/>', { "class": "fullscreenTableButton", text: i18n.label(quest.label) });
        readComm.click((e: JQueryEventObject) => { readNextLoadedQuest = true; quest.loadScript(); });
        tableDataRead.append(readComm);



        tableRow.append(tableDataRead);
        return tableRow;
    }

}