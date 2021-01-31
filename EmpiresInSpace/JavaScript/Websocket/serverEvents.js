var ServerEventType;
(function (ServerEventType) {
    ServerEventType[ServerEventType["ReceiveMessage"] = 1] = "ReceiveMessage";
    ServerEventType[ServerEventType["TradeAccepted"] = 2] = "TradeAccepted";
    ServerEventType[ServerEventType["ColonyLost"] = 3] = "ColonyLost";
    ServerEventType[ServerEventType["NewTurn"] = 0] = "NewTurn";
    ServerEventType[ServerEventType["ServerRestart"] = 4] = "ServerRestart";
})(ServerEventType || (ServerEventType = {}));
;
var ServerEventsModule;
(function (ServerEventsModule) {
    var lastUpdatedId = 14;
    var eventsToCheck = [];
    var processingEvents = false;
    var readyForUpdate = true;
    var serverEventCaller;
    var int1;
    var int2;
    var int3;
    //get the latest Events for this user. Should only do something if all previous events were evaluated.
    function getEvents() {
        //Helpers.Log("ServerEventsModule.getEvents();");
        processingEvents = !processingEvents;
        if (!processingEvents)
            return;
        //get Events via ajax
        var xhttp = GetXmlHttpObject();
        if (xhttp == null) {
            return;
        }
        readyForUpdate = false;
        //xmlMap get the map and draw it:
        xhttp.onreadystatechange = function () {
            var newEventIsPresent = false;
            if (xhttp.readyState == 4) {
                var XMLServerEvents = xhttp.responseXML;
                //console.dirxml(xmlMap)            
                //messageText
                var XMLtext = XMLServerEvents.getElementsByTagName("ServerEvent");
                for (var i = 0; i < XMLtext.length; i++) {
                    addEvent(XMLtext[i]);
                    newEventIsPresent = true;
                }
                var XMLtext = XMLServerEvents.getElementsByTagName("lastEventId");
                lastUpdatedId = parseInt(XMLtext[0].childNodes[0].nodeValue);
            }
            //process the events
            if (newEventIsPresent)
                checkEvents();
        };
        xhttp.open("GET", "Server/ServerEvents.aspx?action=getEvents&fromNr=" + lastUpdatedId, true);
        xhttp.send("");
        //try to get new events in 5 minutes
        processingEvents = false;
        readyForUpdate = true;
    }
    ServerEventsModule.getEvents = getEvents;
    // only add Events to the array that are unique
    function addEvent(serverEventXML) {
        //transform XML to externalGameEvent-Object
        var eventType = parseInt(serverEventXML.getElementsByTagName("eventType")[0].childNodes[0].nodeValue);
        var objectId = parseInt(serverEventXML.getElementsByTagName("objectId")[0].childNodes[0].nodeValue);
        var int1 = parseInt(serverEventXML.getElementsByTagName("int1")[0].childNodes[0].nodeValue);
        var int2 = parseInt(serverEventXML.getElementsByTagName("int2")[0].childNodes[0].nodeValue);
        var int3 = parseInt(serverEventXML.getElementsByTagName("int3")[0].childNodes[0].nodeValue);
        var serverEvent = { eventType: eventType, objectId: objectId, int1: int1, int2: int2, int3: int3 };
        //check If object has to be kept in the arrays
        //only new events are needed
        for (var i = 0; i < eventsToCheck.length; i++) {
            if (eventsToCheck[i].eventType == serverEvent.eventType
                && eventsToCheck[i].objectId == serverEvent.objectId)
                return;
        }
        eventsToCheck.push(serverEvent);
        Helpers.Log(serverEvent.objectId.toString());
    }
    //reads the eventsToCheck array and updates its elements
    function checkEvents() {
        //Messages - if at least one new message was received, get all new Messages
        for (var i = 0; i < eventsToCheck.length; i++) {
            switch (eventsToCheck[i].eventType) {
                case ServerEventType.TradeAccepted:
                    var trader;
                    if (eventsToCheck[i].int2 == 1)
                        trader = mainObject.coloniesById[eventsToCheck[i].int1];
                    if (eventsToCheck[i].int2 == 0)
                        trader = mainObject.ships[eventsToCheck[i].int1];
                    TradeOffersModule.tradeOffers[eventsToCheck[i].objectId].acceptedBy(trader);
                    break;
                case ServerEventType.ReceiveMessage:
                    if (eventsToCheck[i].int1 != 0) {
                        Helpers.Log("MessageModule.setCurrentMessageType(eventsToCheck[i].int1); " + eventsToCheck[i].int1.toString(), 5);
                        MessageModule.setCurrentMessageType(eventsToCheck[i].int1);
                    }
                    Helpers.Log("MessageModule.getReceivedMessages(MessageModule.currentMessageType.messageHighestTo, MessageModule.currentMessageType.messageHighestTo + 1, 0); " + MessageModule.currentMessageType.messageHighestTo.toString(), 5);
                    MessageModule.getReceivedMessages(1, 5, 10);
                    document.getElementById('alertMessage').style.display = 'block';
                    break;
                case ServerEventType.NewTurn:
                    newTurn();
                    break;
                case ServerEventType.ColonyLost:
                    //switch user view from lost colony away
                    if (mainObject.currentColony != null && mainObject.currentColony.id == eventsToCheck[i].objectId) {
                        mainObject.currentColony.parentArea.switchInterfaceToThisMap();
                        PanelController.showInfoPanel(PanelController.PanelChoice.Canvas);
                    }
                    //set new owner for buildings on lost colony
                    for (var j = 0; j < ColonyModule.allBuildings.length; j++) {
                        if (ColonyModule.allBuildings[j] == null)
                            continue;
                        if (ColonyModule.allBuildings[j].colonyId == eventsToCheck[i].objectId)
                            ColonyModule.allBuildings[j].userId = eventsToCheck[i].int1;
                    }
                    // set new owner of colony
                    mainObject.coloniesById[eventsToCheck[i].objectId].owner = eventsToCheck[i].int1;
                    //also get teh message abut the lost colony
                    MessageModule.getReceivedMessages(mainObject.messageHighestTo, mainObject.messageHighestTo + 1, 0);
                    document.getElementById('alertMessage').style.display = 'block';
                    break;
                case ServerEventType.ServerRestart:
                    mainInterface.addQuickMessage("Server gets restarted in ~", 10000, true, 60 * 1000);
                    break;
            }
            /*
            if (eventsToCheck[i].eventType != 1) continue;
            //mainObject.getReceivedMessages(mainObject.messageHighestTo, mainObject.messageHighestTo + 1);
            MessageModule.getReceivedMessages2(mainObject.messageHighestTo, mainObject.messageHighestTo + 1);
            document.getElementById('alertMessage').style.display = 'block';
            break;
            */
        }
        //ShipModule.Ships - update each ship of the updateArray
        //Colonies - Goods - update the goods for the Colony
        //also the buildings of a colony may be affected by other users...
        //delete all elements of the array...
        eventsToCheck.length = 0;
    }
    //polling of new events
    function setEventInterval() {
        serverEventCaller = window.setInterval(function () { /*Helpers.Log('getEvent');*/ ServerEventsModule.getEvents(); }, 10 * 1000);
    }
    ServerEventsModule.setEventInterval = setEventInterval;
    function newTurn() {
        //Helpers.Log("function newTurn()");
        mainObject.user.refreshUserData(); //gets a lot of user data async
        //refresh user Data
        //ships (movement points)
        mainObject.initShips();
        //colonies (goods, buldings activation)
        ColonyModule.initColonies(); //gets colony data (sync)
        //update colonyProduction of Energy and Population (we need BuildingProduction (gameData) and colonyBuildings (userData) for this).
        //if (mainObject.currentShip != null) mainObject.currentShip.selectAndCenter();
        //if (mainObject.currentColony != null) mainObject.currentColony.selectAndCenter();
        if (mainObject.currentShip != null)
            PanelController.showInfoPanel(PanelController.PanelChoice.Ship);
        if (mainObject.currentColony != null)
            PanelController.showInfoPanel(PanelController.PanelChoice.Colony);
        // if (mainObject.currentShip != null) Ships.UserInterface.refreshMainScreenStatistics(mainObject.currentShip);
        Ships.RecalcFleetStatistics();
        mainInterface.refreshMainScreenStatistics();
        //$('#nextTurnTime').text(i18n.label(772) + mainObject.user.nextTurn.toLocaleTimeString());
        setTurnInterval();
    }
    function setTurnTimer() {
        var currentDT = new Date();
        //currentDT = new Date(currentDT.getTime() + currentDT.getTimezoneOffset() * 60000);
        //currentDT = new Date(currentDT.getTime() + currentDT.getTimezoneOffset() * 60000);
        var MillisecondsDifference = mainObject.user.nextTurn.getTime() - currentDT.getTime();
        var fullHours = Math.floor(MillisecondsDifference / (60 * 60 * 1000));
        MillisecondsDifference = MillisecondsDifference - (fullHours * (60 * 60 * 1000));
        var HoursString = fullHours < 10 ? '0' + fullHours.toString() : fullHours.toString();
        var fullMinutes = Math.floor(MillisecondsDifference / (60 * 1000));
        MillisecondsDifference = MillisecondsDifference - (fullMinutes * (60 * 1000));
        var MinuteString = fullMinutes < 10 ? '0' + fullMinutes.toString() : fullMinutes.toString();
        var fullSeconds = Math.floor(MillisecondsDifference / 1000);
        var SecondString = fullSeconds < 10 ? '0' + fullSeconds.toString() : fullSeconds.toString();
        $('#nextTurnTime').text(i18n.label(772) + HoursString + ':' + MinuteString + ':' + SecondString);
    }
    ServerEventsModule.setTurnTimer = setTurnTimer;
    function setTurnInterval() {
        setInterval(setTurnTimer, 1000);
    }
    ServerEventsModule.setTurnInterval = setTurnInterval;
    function setEventId(id) {
        lastUpdatedId = id;
    }
    ServerEventsModule.setEventId = setEventId;
})(ServerEventsModule || (ServerEventsModule = {}));
//# sourceMappingURL=serverEvents.js.map