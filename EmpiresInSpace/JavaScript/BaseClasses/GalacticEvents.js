var GalacticEventsModule;
(function (GalacticEventsModule) {
    GalacticEventsModule.GalacticEvents = []; //an array of all user-messages.
    var highestEventId = 0;
    var lowestEventId = null; //player can fetch older events from the servers as long as lowestEventId is not 0
    var GalacticEventType;
    (function (GalacticEventType) {
        GalacticEventType[GalacticEventType["CombatAttackerWins"] = 0] = "CombatAttackerWins";
        GalacticEventType[GalacticEventType["Arrival"] = 1] = "Arrival";
        GalacticEventType[GalacticEventType["FirstResearch"] = 2] = "FirstResearch";
        GalacticEventType[GalacticEventType["ColonyBesieged"] = 3] = "ColonyBesieged";
        GalacticEventType[GalacticEventType["ColonyOccupied"] = 4] = "ColonyOccupied";
        GalacticEventType[GalacticEventType["ColonyAbandoned"] = 5] = "ColonyAbandoned";
        GalacticEventType[GalacticEventType["DiplAllyToAllyWar"] = 6] = "DiplAllyToAllyWar";
        GalacticEventType[GalacticEventType["DiplAllyToAllyHostile"] = 7] = "DiplAllyToAllyHostile";
        GalacticEventType[GalacticEventType["DiplAllyToAllyNeutral"] = 8] = "DiplAllyToAllyNeutral";
        GalacticEventType[GalacticEventType["DiplAllyToAllyOpenBorders"] = 9] = "DiplAllyToAllyOpenBorders";
        GalacticEventType[GalacticEventType["DiplAllyToAllyTrade"] = 10] = "DiplAllyToAllyTrade";
        GalacticEventType[GalacticEventType["DiplAllyToAllyPact"] = 11] = "DiplAllyToAllyPact";
        GalacticEventType[GalacticEventType["DiplAllyToPlayerWar"] = 12] = "DiplAllyToPlayerWar";
        GalacticEventType[GalacticEventType["DiplAllyToPlayerHostile"] = 13] = "DiplAllyToPlayerHostile";
        GalacticEventType[GalacticEventType["DiplAllyToPlayerNeutral"] = 14] = "DiplAllyToPlayerNeutral";
        GalacticEventType[GalacticEventType["DiplAllyToPlayerOpenBorders"] = 15] = "DiplAllyToPlayerOpenBorders";
        GalacticEventType[GalacticEventType["DiplAllyToPlayerTrade"] = 16] = "DiplAllyToPlayerTrade";
        GalacticEventType[GalacticEventType["DiplAllyToPlayerPact"] = 17] = "DiplAllyToPlayerPact";
        GalacticEventType[GalacticEventType["DiplPlayerToPlayerWar"] = 18] = "DiplPlayerToPlayerWar";
        GalacticEventType[GalacticEventType["DiplPlayerToPlayerHostile"] = 19] = "DiplPlayerToPlayerHostile";
        GalacticEventType[GalacticEventType["DiplPlayerToPlayerNeutral"] = 20] = "DiplPlayerToPlayerNeutral";
        GalacticEventType[GalacticEventType["DiplPlayerToPlayerOpenBorders"] = 21] = "DiplPlayerToPlayerOpenBorders";
        GalacticEventType[GalacticEventType["DiplPlayerToPlayerTrade"] = 22] = "DiplPlayerToPlayerTrade";
        GalacticEventType[GalacticEventType["DiplPlayerToPlayerPact"] = 23] = "DiplPlayerToPlayerPact";
        GalacticEventType[GalacticEventType["CombatDefenderWins"] = 24] = "CombatDefenderWins";
    })(GalacticEventType = GalacticEventsModule.GalacticEventType || (GalacticEventsModule.GalacticEventType = {}));
    ;
    var GalacticEvent = /** @class */ (function () {
        function GalacticEvent(serverEvent) {
            this.Id = serverEvent["Id"];
            this.EventType = serverEvent["EventType"];
            var sendingDate = serverEvent["EventDatetime"];
            this.EventDatetime = new Date(sendingDate + "Z");
            this.Int1 = serverEvent["Int1"];
            this.Int2 = serverEvent["Int2"];
            this.Int3 = serverEvent["Int3"];
            this.Int4 = serverEvent["Int4"];
            this.Int5 = serverEvent["Int5"];
            this.Int6 = serverEvent["Int6"];
            this.String1 = serverEvent["String1"];
            this.String2 = serverEvent["String2"];
            this.String3 = serverEvent["String3"];
            this.String4 = serverEvent["String4"];
            this.String5 = serverEvent["String5"];
            this.String6 = serverEvent["String6"];
            this.String7 = serverEvent["String7"];
            this.String8 = serverEvent["String8"];
        }
        GalacticEvent.prototype.text = function () {
            switch (this.EventType) {
                case GalacticEventType.CombatAttackerWins: // The {0} ({1}) destroys the {2} ({3})                    
                    var AttackerName = this.String4 ? mainObject.findUser(parseInt(this.String4)).shortTagFreeName() : "";
                    var DefenderName = this.String5 ? mainObject.findUser(parseInt(this.String5)).shortTagFreeName() : "";
                    //var AttackerHull = i18n.label(BaseDataModule.shipHulls[this.Int3].label);
                    //var DefenderHull = i18n.label(BaseDataModule.shipHulls[this.Int4].label);
                    var x = (this.Int5 ? this.Int5.toString() : "50??");
                    var y = (this.Int6 ? this.Int6.toString() : "50??");
                    var Coordinates = x + "/" + y;
                    //systemname is set
                    if (this.String3) {
                        //The {0} of {1} destroys the {2} of {3} in {4} ({5})
                        return i18n.label(974).format(this.String1.label(), AttackerName, this.String2.label(), DefenderName, this.String3, Coordinates);
                    }
                    else {
                        //The {0} of {1} destroys the {2} of {3} at {4}
                        return i18n.label(798).format(this.String1.label(), AttackerName, this.String2.label(), DefenderName, Coordinates);
                    }
                //break;
                case GalacticEventType.CombatDefenderWins: //The {0} ({1}) fights off the {2} ({3})
                    var AttackerName = this.String4 ? mainObject.findUser(parseInt(this.String4)).shortTagFreeName() : "";
                    var DefenderName = this.String5 ? mainObject.findUser(parseInt(this.String5)).shortTagFreeName() : "";
                    //var AttackerHull = i18n.label(BaseDataModule.shipHulls[this.Int3].label);
                    //var DefenderHull = i18n.label(BaseDataModule.shipHulls[this.Int4].label);
                    var x = (this.Int5 ? this.Int5.toString() : "50??");
                    var y = (this.Int6 ? this.Int6.toString() : "50??");
                    var Coordinates = x + "/" + y;
                    //systemname is set
                    if (this.String3) {
                        //The {0} of {1} fights off the {2} of {3} in {4} ({5})
                        return i18n.label(975).format(this.String2.label(), DefenderName, this.String1.label(), AttackerName, this.String3, Coordinates);
                    }
                    else {
                        //The {0} of {1} fights off the {2} of {3} at {4}
                        return i18n.label(799).format(this.String2.label(), DefenderName, this.String1.label(), AttackerName, Coordinates);
                    }
                //break;
                //return i18n.label(799).format(this.String1,'', this.String2, '');
                //return i18n.label(799).format(this.String2.label(), i18n.label(BaseDataModule.shipHulls[this.Int4].label), this.String1.label(), i18n.label(BaseDataModule.shipHulls[this.Int3].label));
                case GalacticEventType.Arrival:
                    return i18n.label(800).format(this.String1);
                case GalacticEventType.FirstResearch:
                    //PlayerData.createUserLink(PlayerData.findUser(message.sender))
                    return i18n.label(801).format(PlayerData.createTaglessUserLink(mainObject.findUser(this.Int1)).html(), i18n.label(BaseDataModule.researches[this.Int2].label));
                //return i18n.label(801).format(mainObject.findUser(this.Int1).name, i18n.label(BaseDataModule.researches[this.Int2].label));
                case GalacticEventType.ColonyBesieged:
                    return i18n.label(802).format(this.String1, mainObject.findUser(this.Int1).name);
                case GalacticEventType.ColonyOccupied:
                    return i18n.label(803).format(this.String1, mainObject.findUser(this.Int1).name);
                case GalacticEventType.ColonyAbandoned: //Colony %1 was abandoned by %2
                    return i18n.label(804).format(this.String1, mainObject.findUser(this.Int1).name);
                //war
                case GalacticEventType.DiplAllyToAllyWar:
                case GalacticEventType.DiplAllyToPlayerWar:
                case GalacticEventType.DiplPlayerToPlayerWar:
                    var labelId = 805; // {2} {0} declared war on {3} {1}
                    var Descriptor1 = this.Int5 == 2 ? i18n.label(462) : '';
                    var Descriptor2 = this.Int6 == 2 ? i18n.label(462) : '';
                    var Name1 = this.Int5 == 2 ? AllianceModule.alliances[this.Int1] && AllianceModule.alliances[this.Int1].name || i18n.label(971).format(this.Int1.toString()) : mainObject.findUser(this.Int1).name;
                    var Name2 = this.Int6 == 2 ? AllianceModule.alliances[this.Int2] && AllianceModule.alliances[this.Int2].name || i18n.label(971).format(this.Int2.toString()) : mainObject.findUser(this.Int2).name;
                    return i18n.label(labelId).format(Name1, Name2, Descriptor1, Descriptor2) // %3 %1 declared war on %4 %2
                        + i18n.label(797).format(mainObject.relationTypes[this.Int4].name); // (previously {0})
                //hostile - relation could have been lowered, but also have been war previously
                case GalacticEventType.DiplAllyToAllyHostile:
                case GalacticEventType.DiplAllyToPlayerHostile:
                case GalacticEventType.DiplPlayerToPlayerHostile:
                    var labelId = this.Int3 < this.Int4 ? 806 : 807; // {2} {0} opens hostilities on {3} {1}  -- {2} {0} and {3} {1} switch to "Hostile"
                    var Descriptor1 = this.Int5 == 2 ? i18n.label(462) : '';
                    var Descriptor2 = this.Int6 == 2 ? i18n.label(462) : '';
                    var Name1 = this.Int5 == 2 ? AllianceModule.alliances[this.Int1] && AllianceModule.alliances[this.Int1].name || i18n.label(971).format(this.Int1.toString()) : mainObject.findUser(this.Int1).name;
                    var Name2 = this.Int6 == 2 ? AllianceModule.alliances[this.Int2] && AllianceModule.alliances[this.Int2].name || i18n.label(971).format(this.Int2.toString()) : mainObject.findUser(this.Int2).name;
                    return i18n.label(labelId).format(Name1, Name2, Descriptor1, Descriptor2) //
                        + i18n.label(797).format(mainObject.relationTypes[this.Int4].name); // (previously {0})
                //neutral or better - relation could have been lowered, but also could have been increased
                case GalacticEventType.DiplAllyToAllyNeutral:
                case GalacticEventType.DiplAllyToPlayerNeutral:
                case GalacticEventType.DiplPlayerToPlayerNeutral:
                case GalacticEventType.DiplAllyToAllyOpenBorders:
                case GalacticEventType.DiplAllyToPlayerOpenBorders:
                case GalacticEventType.DiplPlayerToPlayerOpenBorders:
                case GalacticEventType.DiplAllyToAllyTrade:
                case GalacticEventType.DiplAllyToPlayerTrade:
                case GalacticEventType.DiplPlayerToPlayerTrade:
                case GalacticEventType.DiplAllyToAllyPact:
                case GalacticEventType.DiplAllyToPlayerPact:
                case GalacticEventType.DiplPlayerToPlayerPact:
                    var labelId = this.Int3 < this.Int4 ? 808 : 809; // {2} {0} reduces his diplomatic relationship to "{4}" towards {3} {1} ______  {2} {0} and {3} {1} agree on a {4}
                    var Descriptor1 = this.Int5 == 2 ? i18n.label(462) : '';
                    var Descriptor2 = this.Int6 == 2 ? i18n.label(462) : '';
                    var Name1 = this.Int5 == 2 ? AllianceModule.alliances[this.Int1] && AllianceModule.alliances[this.Int1].name || i18n.label(971).format(this.Int1.toString()) : mainObject.findUser(this.Int1).name;
                    var Name2 = this.Int6 == 2 ? AllianceModule.alliances[this.Int2] && AllianceModule.alliances[this.Int2].name || i18n.label(971).format(this.Int2.toString()) : mainObject.findUser(this.Int2).name;
                    return i18n.label(labelId).format(Name1, Name2, Descriptor1, Descriptor2, mainObject.relationTypes[this.Int3].name) // 
                        + i18n.label(797).format(mainObject.relationTypes[this.Int4].name); // (previously {0})
                default:
                    return 'Unknown galactic event...';
            }
            //return 'Alien invasion';
        };
        GalacticEvent.prototype.getEventDTstring = function () {
            var dtNow = new Date();
            if (this.EventDatetime.getFullYear() == dtNow.getFullYear() &&
                this.EventDatetime.getMonth() == dtNow.getMonth() &&
                this.EventDatetime.getDate() == dtNow.getDate())
                return this.EventDatetime.toLocaleTimeString();
            return this.EventDatetime.toLocaleDateString();
        };
        return GalacticEvent;
    }());
    GalacticEventsModule.GalacticEvent = GalacticEvent;
    function InitGalacticEvents() {
        fetchEvents();
    }
    GalacticEventsModule.InitGalacticEvents = InitGalacticEvents;
    function NewGalacticEvent(event) {
        var newEvent = new GalacticEvent(event);
        GalacticEventsModule.GalacticEvents[newEvent.Id] = newEvent;
        //Helpers.Log("GalacticEvent " + newEvent.Id.toString() + " received");
        if (newEvent.Id > highestEventId) {
            highestEventId = newEvent.Id;
            if (highestEventId > mainObject.user.LastReadGalactivEvent) {
                if (newEvent.EventType == GalacticEventType.Arrival) {
                    if (newEvent.Int1 != mainObject.user.id) {
                        //Helpers.Log("newEvent Arrival User " + newEvent.Int1);
                        mainObject.user.checkNewContact(newEvent.Int1, null, 0, 0, 0);
                    }
                }
                $(".UnreadGalacticEvents").html((highestEventId - mainObject.user.LastReadGalactivEvent).toString());
                $(".UnreadGalacticEvents").css("display", "block");
            }
        }
    }
    GalacticEventsModule.NewGalacticEvent = NewGalacticEvent;
    ;
    function ProcessFetchedEvents(events) {
        Helpers.Log(events);
        var eventsArray = events["NewEvents"];
        if (eventsArray && eventsArray.length > 0) {
            for (var i = 0; i < eventsArray.length; i++) {
                NewGalacticEvent(eventsArray[i]);
            }
        }
    }
    GalacticEventsModule.ProcessFetchedEvents = ProcessFetchedEvents;
    function fetchEvents() {
        if (lowestEventId == 0)
            return;
        if (lowestEventId == null)
            lowestEventId = 2000000000;
        //get next 50 events
        $.connection.spaceHub.invoke("FetchGalacticEvents", lowestEventId).done(function (initialization) {
            if (initialization) {
                GalacticEventsModule.ProcessFetchedEvents(initialization);
            }
        });
    }
    ///////////////////////////////// UI ////////////////////////
    function showEvents() {
        if (highestEventId > mainObject.user.LastReadGalactivEvent) {
            mainObject.user.LastReadGalactivEvent = highestEventId;
            $.connection.spaceHub.invoke("SetLatestGalacticEvents", highestEventId);
            $(".UnreadGalacticEvents").css("display", "none");
        }
        var eventsWindow = ElementGenerator.MainPanel();
        eventsWindow.setHeader(i18n.label(811)); //Galaxy
        var eventsPanel = eventsWindow.element;
        refreshAll(eventsPanel, eventsWindow);
    }
    GalacticEventsModule.showEvents = showEvents;
    function refreshAll(eventsPanel, windowHandle) {
        var panelBody = $('.relPopupPanel', eventsPanel);
        //var panelBody = $('.relPanelBody', eventsPanel);
        panelBody.empty();
        //var t2 = windowHandle.createTable(panelBody, GalacticEvents , createHeader, createTableLine, null, 110, null, 81, false);
        //Helpers.setTBodyHeight(panelBody, t2, null, -placeReservedForOwnNodes, true); 
        panelBody.empty();
        var buildTable = $('<table/>'); // , style:"border-collapse: collapse;" class fullscreenTable
        buildTable.width('100%');
        panelBody.append(buildTable);
        var makeGray = false;
        for (var i = GalacticEventsModule.GalacticEvents.length - 1; i > -1; i--) {
            if (!GalacticEventsModule.GalacticEvents[i])
                continue;
            var galacticEvent = GalacticEventsModule.GalacticEvents[i];
            var tableRow = $('<tr/>');
            var tableDataId = $('<td/>', { text: galacticEvent.getEventDTstring() });
            tableDataId.width(110);
            tableRow.append(tableDataId);
            tableDataId = $('<td/>', { text: galacticEvent.text() });
            tableDataId.html(galacticEvent.text());
            tableRow.append(tableDataId);
            buildTable.append(tableRow);
        }
    }
    function createHeader() {
        var th = ElementGenerator.headerElement;
        var tableRow = $('<tr/>');
        tableRow.append(th(442, 50, true)); //Id
        tableRow.append(th(443, 643, true, 540)); //Name  
        return tableRow;
    }
    function createTableLine(_caller, galacticEvent) {
        var tableRow = $('<tr/>');
        var tableDataId = $('<td/>', { text: galacticEvent.getEventDTstring() });
        tableRow.append(tableDataId);
        tableDataId = $('<td/>', { text: galacticEvent.text() });
        tableDataId.html(galacticEvent.text());
        tableRow.append(tableDataId);
        return tableRow;
    }
})(GalacticEventsModule || (GalacticEventsModule = {}));
//# sourceMappingURL=GalacticEvents.js.map