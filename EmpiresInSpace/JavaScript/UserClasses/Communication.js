//Communication handles Comm networks - those of the player (if he owns any) and the foreign ones.
var CommModule;
(function (CommModule) {
    var CommunicationPanels;
    (function (CommunicationPanels) {
        CommunicationPanels[CommunicationPanels["ForeignNetworks"] = 0] = "ForeignNetworks";
        CommunicationPanels[CommunicationPanels["OwnNetworks"] = 1] = "OwnNetworks";
        CommunicationPanels[CommunicationPanels["Alliance"] = 2] = "Alliance";
        CommunicationPanels[CommunicationPanels["None"] = 3] = "None";
    })(CommunicationPanels || (CommunicationPanels = {}));
    ;
    CommModule.commNodes = [];
    var windowHandle;
    var panelBody;
    var messageShown = 0;
    var messageListDiv1;
    var foreignNetworksKnown = false;
    var ownNetworksExists = false;
    var allianceNetworksExists = false;
    var foreignNetworksMessagesUnread = 0;
    var ownNetworksMessagesUnread = 0;
    var allianceNetworksMessagesUnread = 0;
    function RemoveAllianceNode() {
        for (var i = 0; i < CommModule.commNodes.length; i++) {
            if (CommModule.commNodes[i] && CommModule.commNodes[i].connectionType == 4)
                CommModule.commNodes[i] = null;
        }
        allianceNetworksExists = false;
    }
    CommModule.RemoveAllianceNode = RemoveAllianceNode;
    var CommMessage = /** @class */ (function () {
        function CommMessage(id, commNode) {
            //id = unique key (in combination with commNodeId)
            //commNode is just a reference to the commNode which owns this message
            this.id = id;
            this.commNode = commNode;
            this.messageTime = '20:15';
        }
        CommMessage.prototype.update = function (XMLmessage, showMessage) {
            //quit if the message text element is empty
            if (!XMLmessage.getElementsByTagName("messageBody")[0] || !XMLmessage.getElementsByTagName("messageBody")[0].childNodes || !XMLmessage.getElementsByTagName("messageBody")[0].childNodes[0])
                return;
            var senderId = XMLmessage.getElementsByTagName("sender")[0].childNodes[0].nodeValue;
            var header = XMLmessage.getElementsByTagName("headline")[0].childNodes[0].nodeValue;
            var message = XMLmessage.getElementsByTagName("messageBody")[0].childNodes[0].nodeValue;
            var sendingDate = XMLmessage.getElementsByTagName("sendingDate")[0].childNodes[0].nodeValue;
            this.sender = parseInt(senderId);
            this.header = header;
            this.messageText = message;
            this.messageDT = new Date(sendingDate);
            if (showMessage === true) {
                this.commNode.injectMessageIntoPanel(this);
            }
        };
        CommMessage.prototype.updateJson = function (json) {
            //quit if the message text element is empty
            if (!json["messageBody"] || !json["sender"] || !json["headline"] || !json["sendingDate"])
                return;
            var senderId = json["sender"];
            var header = json["headline"];
            var message = json["messageBody"];
            var sendingDate = json["sendingDate"];
            var sendingDate2 = new Date(parseInt(sendingDate.replace("/Date(", "").replace(")/", ""), 10));
            this.sender = parseInt(senderId);
            this.header = header;
            this.messageText = message;
            this.messageDT = sendingDate2;
        };
        CommMessage.prototype.getMessageHeaderDTstring = function () {
            var dtNow = new Date();
            if (this.messageDT.getFullYear() == dtNow.getFullYear() &&
                this.messageDT.getMonth() == dtNow.getMonth() &&
                this.messageDT.getDate() == dtNow.getDate())
                return this.messageDT.toLocaleTimeString();
            return this.messageDT.toLocaleDateString();
        };
        CommMessage.prototype.initSendMessage = function (commNode) {
            var receiver = $("#messageWrite").first().data("receiverId");
            this.sender = mainObject.user.id;
            this.commNode = commNode;
            this.header = $("#messageWrite #messageWriteSubject").val().toString();
            this.messageText = $("#messageWrite .messageWriteBody").val().toString();
        };
        return CommMessage;
    }());
    CommModule.CommMessage = CommMessage;
    var CommNode = /** @class */ (function () {
        function CommNode(id) {
            this.id = id;
            this.defaultRights = [];
            this.messageTogetFromServer = 10;
            this.messagesById = []; //an array of all messages from this node.
            this.messageToNr = 0; //a number representating how many messages were read. opening Message-Dialog sets this to 10, paging back in time in the messageList increases this nuber by 10 each time...
            this.messageHighestToNr = 0; // the highest reachedMessageTo-Value. "Can't exceed messageCount" -> ToDO has to be checked. Is used to determine if the database is again queried
            this.messageHighestId = 0; //the latest message read. this time the messageId! 
            //commNodes act as Trade Stations
            //these variables are set via the TradeOffersForm:
            this.goodsOverall = []; // all goods from the player at the location of the commNode
            //goodsAvailable: number[] = []; // all goods from the player at the location of the commNode that are not in sales offers
            //goodsOfferedSum = 0;
            this.overallCargoRoom = 0; // the cargoroom of all ships currently present
        }
        CommNode.prototype.update = function (XMLCommNode) {
            var owner = XMLCommNode.getElementsByTagName("owner")[0].childNodes[0].nodeValue;
            var name = XMLCommNode.getElementsByTagName("name")[0] && XMLCommNode.getElementsByTagName("name")[0].childNodes && XMLCommNode.getElementsByTagName("name")[0].childNodes[0] && XMLCommNode.getElementsByTagName("name")[0].childNodes[0].nodeValue || '';
            var unformattedName = XMLCommNode.getElementsByTagName("unformattedName")[0].childNodes[0].nodeValue;
            var positionX = XMLCommNode.getElementsByTagName("positionX")[0].childNodes[0].nodeValue;
            var positionY = XMLCommNode.getElementsByTagName("positionY")[0].childNodes[0].nodeValue;
            var systemX = XMLCommNode.getElementsByTagName("systemX")[0].childNodes[0].nodeValue;
            var systemY = XMLCommNode.getElementsByTagName("systemY")[0].childNodes[0].nodeValue;
            var connectionType = XMLCommNode.getElementsByTagName("connectionType")[0].childNodes[0].nodeValue;
            var connectionId = XMLCommNode.getElementsByTagName("connectionId")[0].childNodes[0].nodeValue;
            var activ = XMLCommNode.getElementsByTagName("activ")[0].childNodes[0].nodeValue;
            var visited = XMLCommNode.getElementsByTagName("visited")[0].childNodes[0].nodeValue;
            var readAccess = XMLCommNode.getElementsByTagName("readAccess")[0].childNodes[0].nodeValue;
            var writeAccess = XMLCommNode.getElementsByTagName("writeAccess")[0].childNodes[0].nodeValue;
            var adminRights = XMLCommNode.getElementsByTagName("adminRights")[0].childNodes[0].nodeValue;
            var informWhenNew = XMLCommNode.getElementsByTagName("informWhenNew")[0].childNodes[0].nodeValue;
            var messageCount = XMLCommNode.getElementsByTagName("messageCount")[0].childNodes[0].nodeValue;
            var messageUnReadCount = XMLCommNode.getElementsByTagName("messageUnReadCount")[0].childNodes[0].nodeValue;
            this.owner = parseInt(owner);
            this.name = name;
            this.unformattedName = unformattedName;
            this.positionX = parseInt(positionX);
            this.positionY = parseInt(positionY);
            this.systemX = parseInt(systemX);
            this.systemY = parseInt(systemY);
            this.connectionType = parseInt(connectionType);
            this.connectionId = parseInt(connectionId);
            this.activ = activ == "true" ? true : false;
            this.visited = visited == "true" ? true : false;
            this.readAccess = readAccess == "true" ? true : false;
            this.writeAccess = writeAccess == "true" ? true : false;
            this.adminRights = adminRights == "true" ? true : false;
            this.informWhenNew = informWhenNew == "true" ? true : false;
            this.messageCount = parseInt(messageCount);
            this.messageUnReadCount = parseInt(messageUnReadCount);
            this.defaultRights[0].readAccess = true;
            this.defaultRights[0].writeAccess = true;
            if (this.messageUnReadCount > 0 && this.informWhenNew)
                document.getElementById('alertCommNode').style.display = 'block';
        };
        //Helpers.Log(i + ' BuildingProduction  dem Gebäude hinterlegt.');
        CommNode.prototype.informWhenNewChecked = function () {
            Helpers.Log("informWhenNewChecked");
            Helpers.Log("informWhenNew");
            this.informWhenNew = !this.informWhenNew;
            //mainObject.user.coordinates = !mainObject.user.coordinates;
            var xhttp = GetXmlHttpObject();
            xhttp.open("GET", "Server/Messages.aspx?action=informWhenNew&commNodeId=" + this.id + "&value=" + this.informWhenNew, true);
            xhttp.send("");
        };
        CommNode.prototype.readAndUnreadCount = function () {
            return " " + (this.messageCount - this.messageUnReadCount) + " / " + this.messageCount;
        };
        CommNode.prototype.getTile = function () {
            var StarTile;
            //StarTile = galaxyMap.tilemap.map[this.positionX][this.positionY];
            //StarTile = mainObject.
            //var tile = mainObject.currentShip.parentArea.tilemap.map[mainObject.parseInt(mainObject.currentShip.colRow.col)][mainObject.parseInt(mainObject.currentShip.colRow.row)];
            return null;
        };
        CommNode.prototype.spaceObjectsAtNode = function (onlyUser) {
            if (onlyUser == null)
                onlyUser = false;
            var spaceObjects = [];
            var starPosition = { col: this.positionX, row: this.positionY };
            var systemPosition = null;
            //ToDO: commNodes this should not be evaluated with != 0
            if (this.systemX != null && this.systemX != 0 && this.systemY != 0) {
                //systemPosition = { col: TradeOffersModule.callingAtTradeport.systemX, row: TradeOffersModule.callingAtTradeport.systemY };
                systemPosition = { col: this.systemX, row: this.systemY };
            }
            //the tile of the commNode may not be loaded yet (if the commNode is inside a system - so we can't just cycle throug that node...
            //var tile = mainObject.currentShip.parentArea.tilemap.map[mainObject.parseInt(mainObject.currentShip.colRow.col)][mainObject.parseInt(mainObject.currentShip.colRow.row)];
            //if (newShip.owner == mainObject.user.id)
            //ToDO - the colony has to be listed. -- but then @@identity would not work anymore...
            // colonies and ships shoud get the ids from the same numberGeneration
            for (var i = 0; i < mainObject.ships.length; i++) {
                if (mainObject.ships[i] != undefined && mainObject.ships[i] != null) {
                    if (onlyUser && mainObject.ships[i].owner != mainObject.user.id)
                        continue;
                    if (mainObject.ships[i].galaxyColRow.col != starPosition.col || mainObject.ships[i].galaxyColRow.row != starPosition.row)
                        continue;
                    if (systemPosition != null && (mainObject.ships[i].starColRow.col != systemPosition.col || mainObject.ships[i].starColRow.row != systemPosition.row))
                        continue;
                    spaceObjects.push(mainObject.ships[i]);
                }
            }
            if (ColonyModule.existColonyByCoordinates(starPosition, systemPosition) && (!onlyUser || ColonyModule.findColonyByCoordinates(starPosition, systemPosition).owner == mainObject.user.id))
                spaceObjects.push(ColonyModule.findColonyByCoordinates(starPosition, systemPosition));
            return spaceObjects;
        };
        CommNode.prototype.showCommMessages = function (_parent, writeButton) {
            //messageListDiv1.empty();
            var _this = this;
            if (writeButton === void 0) { writeButton = true; }
            //var windowHandle = new ElementGenerator.WindowManager(_parent, e => { this.deleteMessageDivs(); });
            //var setupPanel = windowHandle.element;
            //windowHandle.setHeader(this.name);
            //var panelBody = $('.relPopupBody', setupPanel);7
            //panelBody.addClass("ScriptWithWindowBody");
            //panelBody.css("background", "#222222");
            if (writeButton) {
                messageListDiv1.empty();
                var writeMessageButtonDiv = $("<div/>");
                writeMessageButtonDiv.css("text-align", "right");
                var writeMessageButton = $("<button/>", { text: i18n.label(543) }); //new message button
                writeMessageButton.css("margin-left", "20px").css("margin-top", "20px");
                writeMessageButton.click(function (e) { if (isDemo)
                    ElementGenerator.messagePopup(338); _this.createUserMessageDiv(writeMessageButton); });
                writeMessageButtonDiv.append(writeMessageButton);
                messageListDiv1.append(writeMessageButtonDiv);
                writeMessageButton.button();
            }
            else {
                this.createMessageWrite();
            }
            var allMessages = $("<div/>", { "class": "allCommMessages" });
            messageListDiv1.append(allMessages);
            this.appendMoreButton(messageListDiv1, allMessages);
            var messagesToShow = 10 > this.messageHighestToNr ? 10 : this.messageHighestToNr;
            if (this.messageHighestToNr < messagesToShow) {
                this.getReceivedMessages(1, messagesToShow, allMessages); //also calls showMessages
                this.messageUnReadCount = 0;
            }
            else {
                this.showMessages(1, 1000, allMessages);
            }
            $('#loader')[0].style.display = 'none';
        };
        CommNode.prototype.deleteMessageDivs = function () {
            for (var x = 0; x < this.messagesById.length; x++) {
                if (this.messagesById[x] !== undefined && this.messagesById[x].messageDiv !== null)
                    this.messagesById[x].messageDiv = null;
            }
        };
        CommNode.prototype.appendMoreButton = function (panelBody, allMessages) {
            var _this = this;
            //var getMoreMessagesButton = $("<div/>", { "class" : "fullscreenTableButton right", text: "Mehr" });
            var getMoreMessagesButtonDiv = $("<div/>");
            getMoreMessagesButtonDiv.css("text-align", "center");
            var getMoreMessagesButton = $("<button/>", { text: i18n.label(544) });
            getMoreMessagesButton.css("margin-left", "20px");
            getMoreMessagesButton.click(function (e) { _this.getReceivedMessages(_this.messageHighestToNr, _this.messageHighestToNr + 10, allMessages); });
            getMoreMessagesButtonDiv.append(getMoreMessagesButton);
            panelBody.append(getMoreMessagesButtonDiv);
            getMoreMessagesButton.button();
        };
        CommNode.prototype.showMessages = function (from, to, allMessages) {
            messageShown = 0;
            var elementNo = 0;
            for (var i = this.messagesById.length; i > -1; i--) {
                if (this.messagesById[i] == null)
                    continue;
                elementNo++;
                messageShown++;
                if (elementNo < from)
                    continue;
                if (elementNo >= to)
                    break;
                allMessages.append(this.createMessageDiv(this.messagesById[i], messageShown % 2 == 0));
            }
        };
        CommNode.prototype.injectMessageIntoPanel = function (message) {
            var newId = message.id;
            var lastpreviousId = 0;
            for (var x = 0; x < this.messagesById.length; x++) {
                if (this.messagesById[x] !== undefined && this.messagesById[x].id < newId)
                    lastpreviousId = this.messagesById[x].id;
            }
            messageShown++;
            if (lastpreviousId !== 0) {
                //var previousmessage = $(".marginClass .messageId" + lastpreviousId + "x");
                var newMessageDiv = this.createMessageDiv(message, messageShown % 2 == 0);
                //previousmessage.before(newMessageDiv);
                this.messagesById[lastpreviousId].messageDiv.before(newMessageDiv);
            }
            else {
                $(".allCommMessages").append(this.createMessageDiv(message, messageShown % 2 == 0));
            }
        };
        CommNode.prototype.createMessageDiv = function (message, gray) {
            if (gray === void 0) { gray = false; }
            //ToDo : Use Data element instead of id-class
            var messageBorder = $("<div/>", { "class": "messageId" + message.id + "x" });
            var messageDiv = $("<div/>", { "class": "CommMessage" });
            messageBorder.append(messageDiv);
            if (gray) {
                messageDiv.addClass("CommMessageGray");
            }
            var headerPadding = $("<div/>", { "class": "MessageHeaderPadding MessageHeaderTextAlign" });
            messageDiv.append(headerPadding);
            headerPadding.append(PlayerData.createUserLink(PlayerData.findUser(message.sender)));
            headerPadding.append($("<span/>", { "text": " " + message.getMessageHeaderDTstring() }));
            //headerPadding.append(messageDiv);
            //var senderName = mainObject.user.otherUsers[message.sender] && mainObject.user.otherUsers[message.sender].name || mainObject.user.name;
            //var header = $("<header/>", { style: "display:inline;", text: message.id.toString() + " " + senderName + " " + message.getMessageHeaderDTstring() });
            //header.html(message.id.toString() + " " + senderName + " " + message.getMessageHeaderDTstring());
            //headerPadding.append(header);
            //var titleDiv = $("<div/>", { text: message.header });
            //messageDiv.append(titleDiv);
            //var contentDiv = $("<div/>", { text: message.messageText });
            var contentDiv = $("<div/>", { "class": "CommMessageLayout selectText" });
            var leftSide = $("<div>", { "class": "inlineBlockTopAlign" });
            var leftProfile = PlayerData.findUser(message.sender).MakeAvatarDiv();
            leftSide.append(leftProfile);
            contentDiv.append(leftSide);
            contentDiv.append($("<p class='commMessageP inlineBlockTopAlign'>").html(message.messageText));
            messageDiv.append(contentDiv);
            message.messageDiv = messageBorder;
            return messageBorder;
        };
        CommNode.prototype.createMessageWrite = function () {
            var _this = this;
            var newMessage = $("<div/>");
            var messageBody = $("<div/>", { "class": "commMessageMaxHeight" });
            //var messageText = $("<textarea/>", { "class": "messageWriteBody" });
            var messageText = $("<textarea/>");
            messageText.css("font-family", "Verdana, Geneva, Arial, Helvetica, sans-serif");
            messageText.keyup(function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
            messageText.val(i18n.label(546));
            messageBody.append(messageText);
            newMessage.append(messageBody);
            var newMessageFooter = $("<div/>", { "class": "CommMessageWriteButtons" });
            newMessageFooter.css("text-align", "right");
            var newMessageFooterButton2 = $("<button/>", { text: i18n.label(228) });
            newMessageFooterButton2.click(function (e) { _this.sendUserMessage(messageText); messageText.val(''); });
            newMessageFooter.append(newMessageFooterButton2);
            newMessage.append(newMessageFooter);
            messageListDiv1.prepend(newMessage);
            // writeMessageButton.after(newMessage);
            newMessageFooterButton2.button();
        };
        //Todo: this could be way cooler, by using keypress events on a div and working with the input data to show the result... WHY is that cooler??? Should have written...
        CommNode.prototype.createUserMessageDiv = function (writeMessageButton) {
            var _this = this;
            writeMessageButton.css("display", "none");
            var newMessage = $("<div/>");
            //newMessage.css("margin-left", "20px").css("margin-right", "5px").css("margin-top", "20px");
            //newMessage.addClass("CommMessageWriteContainer");
            var messageBody = $("<div/>", { "class": "commMessageMaxHeight" });
            //var messageText = $("<textarea/>", { "class": "messageWriteBody" });
            var messageText = $("<textarea/>");
            messageText.val(i18n.label(546));
            messageBody.append(messageText);
            newMessage.append(messageBody);
            //ToDo: Align buttons to the right , perhaps with the new css:::   display: box; box - orient: horizontal;   box - pack: center;    box - align: center;
            var newMessageFooter = $("<div/>", { "class": "CommMessageWriteButtons" });
            var newMessageFooterButton1 = $("<button/>", { text: i18n.label(545) });
            var newMessageFooterButton2 = $("<button/>", { text: i18n.label(228) });
            newMessageFooterButton1.click(function (e) { newMessage.remove(); writeMessageButton.css("display", "inline-block"); });
            newMessageFooterButton2.click(function (e) { _this.sendUserMessage(messageText); newMessage.remove(); writeMessageButton.css("display", "inline-block"); });
            newMessageFooter.append(newMessageFooterButton1).append(newMessageFooterButton2);
            newMessage.append(newMessageFooter);
            writeMessageButton.after(newMessage);
            newMessageFooterButton1.button();
            newMessageFooterButton2.button();
            mainObject.keymap.isActive = false;
            return newMessage;
        };
        //ToDO: put written message to the front
        CommNode.prototype.sendUserMessage = function (nodeName) {
            var xhttp = GetXmlHttpObject();
            if (xhttp == null) {
                return;
            }
            var that = this;
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4) {
                    var XMLresponse = xhttp.responseXML;
                    var XMLobjects = XMLresponse.getElementsByTagName("message");
                    var length = XMLobjects.length;
                    for (var i = 0; i < length; i++) {
                        that.createUpdateMessageElement(XMLobjects[i], true);
                    }
                    Helpers.Log("sendUserMessage : " + length);
                    that.messageCount += 1;
                }
            };
            xhttp.open("POST", "Server/Messages.aspx?action=sendCommMessage&commNode=" + this.id.toString()
                + "&messageHeader=" + "Title", true);
            xhttp.send(nodeName.val().toString());
        };
        CommNode.prototype.showCommAdministration = function (_parent) {
            var windowHandle = new ElementGenerator.WindowManager(_parent);
            var setupPanel = windowHandle.element;
            setupPanel.css("width", "900px");
            /*setupPanel.css("margin-left", "-450px");
            setupPanel.css("padding-top", "10px").css("padding-left", "10px");
            */
            $(".relPopupPanel", setupPanel).css("height", ($(document).height() - 200) + "px");
            windowHandle.setHeader(i18n.label(537));
            $('.relPopupHeader span', setupPanel).html(this.name);
            var panelBody = $('.relPopupBody', setupPanel);
            //setupPanel.addClass("ui-widget");
            this.refreshCommAdministration(panelBody);
            $('#loader')[0].style.display = 'none';
        };
        CommNode.prototype.refreshCommAdministration = function (_panel) {
            var _this = this;
            _panel.empty();
            var nameInput = $("<input/>", { type: "text", value: this.name });
            nameInput.css("width", "22em");
            var name = $("<span>" + this.name + "</span>");
            name.css("margin-left", "10px");
            nameInput.change(function (_event, _input) {
                _this.sendCommNodeNameChange(_event.currentTarget.value);
                name.html(_event.currentTarget.value);
            });
            var nameSpan = $("<span/>");
            _panel.append(nameSpan);
            nameSpan.append(nameInput);
            nameSpan.append(name);
        };
        CommNode.prototype.sendCommNodeNameChange = function (_nodeName) {
            Helpers.Log(_nodeName);
            this.name = _nodeName;
            var postData = _nodeName;
            $.ajax("Server/messages.aspx?action=commNodeNameChange&commNode=" + this.id.toString(), {
                type: "POST",
                data: postData,
                contentType: "xml",
                processData: false
            });
        };
        //#region Messages
        //gets all Messages between From and To, 
        //and all new messages that were received since the last getMessage-Command (by use of messageHighestId)
        //from is the newest message (and lowest number). e.g. 1 means that the newest messag eist to be received
        CommNode.prototype.getReceivedMessages = function (fromNumber, toNumber, allMessages) {
            this.messageHighestToNr = toNumber;
            var xhttp = GetXmlHttpObject();
            if (xhttp == null) {
                alert("Your browser does not support AJAX!");
                return;
            }
            var that = this;
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4) {
                    var XMLGetBuildingsResponse = xhttp.responseXML;
                    var XMLobjects = XMLGetBuildingsResponse.getElementsByTagName("message");
                    var length = XMLobjects.length;
                    for (var i = 0; i < length; i++) {
                        that.createUpdateMessageElement(XMLobjects[i], true);
                    }
                    Helpers.Log(length + " messages added");
                    //that.showMessages(fromNumber, toNumber, allMessages);
                }
            };
            Helpers.Log("getReceivedMessages&commNode=" + this.id.toString() + "&fromNr=" + fromNumber + "&toNr=" + toNumber + "&messageHighestId=" + this.messageHighestId);
            xhttp.open("GET", "Server/Messages.aspx?action=getCommMessages&commNode=" + this.id.toString() + "&fromNr=" + fromNumber + "&toNr=" + toNumber + "&messageHighestId=" + this.messageHighestId, true);
            xhttp.send("");
        };
        CommNode.prototype.messageExists = function (id) {
            if (this.messagesById[mainObject.parseInt(id)] != null)
                return true;
            else
                return false;
        };
        CommNode.prototype.messageAdd = function (XMLmessage, showMessage) {
            var id = parseInt(XMLmessage.getElementsByTagName("id")[0].childNodes[0].nodeValue, 10);
            var newMessage = new CommMessage(id, this);
            //add to messagesById array
            this.messagesById[id] = newMessage;
            this.messageHighestId = this.messageHighestId < id ? id : this.messageHighestId;
            //get all Building Data out of the XMLresearch
            newMessage.update(XMLmessage, showMessage);
        };
        CommNode.prototype.messageAddJson = function (json, id) {
            var newMessage = new CommMessage(id, this);
            //add to messagesById array
            this.messagesById[id] = newMessage;
            this.messageHighestId = this.messageHighestId < id ? id : this.messageHighestId;
            //get all Building Data out of the XMLresearch
            newMessage.updateJson(json);
        };
        CommNode.prototype.createUpdateMessageElement = function (XMLmessage, showMessage) {
            var XMLmessageId = XMLmessage.getElementsByTagName("id")[0].childNodes[0].nodeValue;
            if (this.messageExists(XMLmessageId)) // if message exists, update it.
                this.messagesById[XMLmessageId].update(XMLmessage);
            else // if ships does not yet exists, add it
                this.messageAdd(XMLmessage, showMessage);
        };
        return CommNode;
    }());
    CommModule.CommNode = CommNode;
    function commNodeExistsOnTile(tile) {
        //for (var i = 0; i < commNodes.length; i++) {
        //if (commNodes[i] === undefined || commNodes[i] === null ) continue;
        //}
        var isSystemTile = false;
        var tileStarColRow;
        var tileSystemColRow;
        if (tile instanceof GalaxyTile) {
            isSystemTile = false;
            tileStarColRow = tile.colRow;
            //Helpers.Log('isStarTile ' + tileStarColRow.col + ' ' + tileStarColRow.row);
        }
        if (tile instanceof SystemTile) {
            isSystemTile = true;
            tileSystemColRow = tile.colRow;
            tileStarColRow = tile.parentArea.colRow;
            //Helpers.Log('isSystemTile1 ' + tileStarColRow.col + ' ' + tileStarColRow.row);
            //tileStarColRow = tile.parentArea.parentArea.colRow;
            //Helpers.Log('isSystemTile2 ' + tileStarColRow.col + ' ' + tileStarColRow.row);
        }
        for (var i = 0; i < CommModule.commNodes.length; i++) {
            if (CommModule.commNodes[i] == null)
                continue;
            if (CommModule.commNodes[i].positionX != tileStarColRow.col || CommModule.commNodes[i].positionY != tileStarColRow.row)
                continue;
            if (isSystemTile) {
                if (CommModule.commNodes[i].systemX != tileSystemColRow.col || CommModule.commNodes[i].systemY != tileSystemColRow.row)
                    continue;
            }
            return true;
        }
        return false;
    }
    CommModule.commNodeExistsOnTile = commNodeExistsOnTile;
    function commNodeFindOnTile(tile) {
        //for (var i = 0; i < commNodes.length; i++) {
        //if (commNodes[i] === undefined || commNodes[i] === null ) continue;
        //}
        var isSystemTile = false;
        var tileStarColRow;
        var tileSystemColRow;
        if (tile instanceof GalaxyTile) {
            isSystemTile = false;
            tileStarColRow = tile.colRow;
            Helpers.Log('isStarTile ' + tileStarColRow.col + ' ' + tileStarColRow.row);
        }
        if (tile instanceof SystemTile) {
            isSystemTile = true;
            tileSystemColRow = tile.colRow;
            tileStarColRow = tile.parentArea.colRow;
            //Helpers.Log('isSystemTile1 ' + tileStarColRow.col + ' ' + tileStarColRow.row);
            //tileStarColRow = tile.parentArea.parentArea.colRow;
            //Helpers.Log('isSystemTile2 ' + tileStarColRow.col + ' ' + tileStarColRow.row);
        }
        for (var i = 0; i < CommModule.commNodes.length; i++) {
            if (CommModule.commNodes[i] == null)
                continue;
            if (CommModule.commNodes[i].positionX != tileStarColRow.col || CommModule.commNodes[i].positionY != tileStarColRow.row)
                continue;
            if (isSystemTile) {
                if (CommModule.commNodes[i].systemX != tileSystemColRow.col || CommModule.commNodes[i].systemY != tileSystemColRow.row)
                    continue;
            }
            return CommModule.commNodes[i];
        }
        return null;
    }
    CommModule.commNodeFindOnTile = commNodeFindOnTile;
    var commNodeExists = function (id) {
        if (CommModule.commNodes[id] != null)
            return true;
        else
            return false;
    };
    function getNodesFromXML(responseXML) {
        if (responseXML === null)
            return;
        var XMLcommNodes = responseXML.getElementsByTagName("commNode");
        var length = XMLcommNodes.length;
        for (var i = 0; i < length; i++) {
            createUpdateCommNode(XMLcommNodes[i]);
        }
        Helpers.Log(length + " commNodes added");
    }
    CommModule.getNodesFromXML = getNodesFromXML;
    var createUpdateCommNode = function (XMLCommNode) {
        var id = parseInt(XMLCommNode.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        if (commNodeExists(id))
            CommModule.commNodes[id].update(XMLCommNode);
        else
            otherCommNodeAdd(XMLCommNode);
    };
    var otherCommNodeAdd = function (XMLCommNode) {
        var id = parseInt(XMLCommNode.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        var newCommNode = new CommNode(id);
        CommModule.commNodes[id] = newCommNode;
        for (var i = 0; i < mainObject.relationTypes.length; i++) {
            newCommNode.defaultRights[i] = { readAccess: false, writeAccess: false };
        }
        newCommNode.update(XMLCommNode);
    };
    function nearestCommNode(startDestination) {
        Helpers.Log('startDestination col ' + startDestination.col + ' -  row ' + startDestination.row);
        var endDest;
        var smallestdistance = 1000;
        for (var i = 0; i < CommModule.commNodes.length; i++) {
            if (CommModule.commNodes[i] == null)
                continue;
            if (CommModule.commNodes[i].owner != 0)
                continue;
            var distance = BaseDataModule.distance(startDestination, { col: CommModule.commNodes[i].positionX, row: CommModule.commNodes[i].positionY });
            /*
                Math.sqrt(
                ((startDestination.col - commNodes[i].positionX) * (startDestination.col - commNodes[i].positionX)) +
                ((startDestination.row - commNodes[i].positionY) * (startDestination.row - commNodes[i].positionY))
                );
                */
            if (distance < smallestdistance) {
                smallestdistance = distance;
                endDest = { col: CommModule.commNodes[i].positionX, row: CommModule.commNodes[i].positionY };
                //endDest.col = commNodes[i].positionX;
                //endDest.row = commNodes[i].positionY;
            }
        }
        Helpers.Log('endDest col ' + endDest.col + ' -  row ' + endDest.row);
        return endDest;
    }
    CommModule.nearestCommNode = nearestCommNode;
    function newCommNodeTarget(targetDestination) {
        for (var i = 0; i < CommModule.commNodes.length; i++) {
            if (CommModule.commNodes[i] != null
                && CommModule.commNodes[i].visited === false
                && CommModule.commNodes[i].owner !== mainObject.user.id
                && CommModule.commNodes[i].positionX === targetDestination.col
                && CommModule.commNodes[i].positionY === targetDestination.row) {
                return i;
            }
            else {
                /*if (commNodes[i]) {
                    
                    Helpers.Log(<any>commNodes[i]);
                    Helpers.Log(commNodes[i].visited + ' ')
                    Helpers.Log(commNodes[i].owner + ' ' + mainObject.user.id)
                    Helpers.Log(commNodes[i].positionX + ' ' + targetDestination.col)
                    Helpers.Log(commNodes[i].positionY + ' ' + targetDestination.row)

                    if (typeof commNodes[i] !== 'undefined') Helpers.Log('undefined OK');
                    if (commNodes[i].visited === false) Helpers.Log('visited OK');
                    if (commNodes[i].owner !== mainObject.user.id) Helpers.Log('owner OK');
                    if (commNodes[i].positionX === targetDestination.col) Helpers.Log('positionX OK');
                    if (commNodes[i].positionY === targetDestination.row) Helpers.Log('positionY OK');
                }*/
                continue;
            }
        }
        return -1;
    }
    CommModule.newCommNodeTarget = newCommNodeTarget;
    //interface
    function showCommunications(_parent) {
        //create main Panel and add header + content
        windowHandle = ElementGenerator.MainPanel();
        windowHandle.setHeader(i18n.label(299));
        var commListPage = windowHandle.element;
        commListPage.addClass("BackgroundDarkGray");
        $(".yesButton", windowHandle.element).css("display", "none");
        refreshAll(commListPage, windowHandle);
        //windowHandle.SetBottom();   
        /*
         var windowHandle = new ElementGenerator.WindowManager(_parent);
         //windowHandle.makeStandardSize();
         windowHandle.setHeader(i18n.label(299));
         windowHandle.prepareScrollableTable();
        
         var commListPage = windowHandle.element;
         refreshAll(commListPage, windowHandle);
         $('#loader')[0].style.display = 'none';
         */
    }
    CommModule.showCommunications = showCommunications;
    function refreshAll(commNodesPanel, windowHandle) {
        var popupPanel;
        popupPanel = windowHandle.element;
        panelBody = $('.relPanelBody', commNodesPanel);
        panelBody.empty();
        var tabDiv = $("<div id='tabs'/>", { "class": "MessageTabPage" });
        //tab header ul
        var tabUl = $("<ul/>");
        tabUl.css("display", "table");
        //create Button for Foreign Networks
        for (var i = 0; i < CommModule.commNodes.length; i++) {
            if (CommModule.commNodes[i] == null || CommModule.commNodes[i].visited === false || CommModule.commNodes[i].owner === mainObject.user.id) {
                continue;
            }
            foreignNetworksKnown = true;
            break;
        }
        if (foreignNetworksKnown) {
            var li0 = $("<li/>");
            //var aHref1 = $("<a href = '#tab1' > " + "Alle" + " </a >");
            var aHref1 = $("<a/>", { "href": "#tab1", "text": "Foreign Networks", "class": "CommButton" + CommunicationPanels.ForeignNetworks }); // , "id": 'messageA' + messageTypes[i].type
            li0.data("num", CommunicationPanels.ForeignNetworks);
            li0.append(aHref1);
            tabUl.append(li0);
        }
        //create Button for Own Networks
        for (var i = 0; i < CommModule.commNodes.length; i++) {
            if (CommModule.commNodes[i] == null || CommModule.commNodes[i].visited === false || CommModule.commNodes[i].owner !== mainObject.user.id || CommModule.commNodes[i].connectionType == 4) {
                continue;
            }
            ownNetworksExists = true;
            break;
        }
        if (ownNetworksExists) {
            var own = $("<li/>");
            //var aHref1 = $("<a href = '#tab1' > " + "Alle" + " </a >");
            var aHref1 = $("<a/>", { "href": "#tab1", "text": "Own Networks", "class": "CommButton" + CommunicationPanels.OwnNetworks }); // , "id": 'messageA' + messageTypes[i].type
            own.data("num", CommunicationPanels.OwnNetworks);
            own.append(aHref1);
            tabUl.append(own);
        }
        //create Button for ALliance channel
        for (var i = 0; i < CommModule.commNodes.length; i++) {
            if (CommModule.commNodes[i] == null || CommModule.commNodes[i].visited === false || CommModule.commNodes[i].owner !== mainObject.user.id || CommModule.commNodes[i].connectionType != 4) {
                continue;
            }
            allianceNetworksExists = true;
            break;
        }
        if (allianceNetworksExists) {
            var allianceLi = $("<li/>");
            //var aHref1 = $("<a href = '#tab1' > " + "Alle" + " </a >");
            var aHref2 = $("<a/>", { "href": "#tab1", "text": "Alliance", "class": "CommButton" + CommunicationPanels.Alliance }); // , "id": 'messageA' + messageTypes[i].type
            allianceLi.data("num", CommunicationPanels.Alliance);
            allianceLi.append(aHref2);
            tabUl.append(allianceLi);
        }
        tabDiv.append(tabUl);
        //create the content container
        messageListDiv1 = $("<div id='tab1'/>"); //tab1 is the same id as is given in the a href in the buttons 
        messageListDiv1.addClass("MessageRowContainer");
        /*popupPanel.css("overflow-y", "none");*/
        tabDiv.append(messageListDiv1);
        var activeTab = detectActiveTab();
        if (activeTab != CommunicationPanels.None) {
            panelBody.append(tabDiv);
            var IndexSearch = "CommButton" + CommunicationPanels.Alliance;
            var index = $('a[href=".CommButton' + activeTab + '"]', tabDiv).parent().index();
            tabDiv.tabs({
                "active": index,
                "activate": function (event, ui) {
                    Helpers.Log("activate");
                    var selectedTab = parseInt($(ui.newTab.context.parentElement).data("num"), 10);
                    showTabDiv(selectedTab);
                }
            });
            tabDiv.addClass("MessageTabPage");
            showTabDiv(activeTab);
        }
    }
    function detectActiveTab() {
        if (allianceNetworksMessagesUnread > 0)
            return CommunicationPanels.Alliance;
        if (ownNetworksMessagesUnread > 0)
            return CommunicationPanels.OwnNetworks;
        if (foreignNetworksMessagesUnread > 0)
            return CommunicationPanels.ForeignNetworks;
        if (allianceNetworksExists)
            return CommunicationPanels.Alliance;
        if (foreignNetworksKnown)
            return CommunicationPanels.ForeignNetworks;
        if (ownNetworksExists)
            return CommunicationPanels.OwnNetworks;
        return CommunicationPanels.None;
    }
    function showTabDiv(selectedTab) {
        messageListDiv1.empty();
        switch (selectedTab) {
            case CommunicationPanels.ForeignNetworks:
                showForeignNetworks();
                break;
            case CommunicationPanels.OwnNetworks:
                showOwnNetworks();
                break;
            case CommunicationPanels.Alliance:
                showAlliance();
                break;
            default:
                showForeignNetworks();
        }
    }
    function showForeignNetworks() {
        //create a table with foreign commnodes 
        /*
        var foreignNetworksTitle = $("<div>", { "class": "commNodesSectionHeader" });
        var foreigns = $('<span><b>' + i18n.label(301) + '</b></span>'); //text: i18n.label(300)
        foreignNetworksTitle.append(foreigns);
        messageListDiv1.append(foreignNetworksTitle);
        */
        var foreignCommNodes = [];
        for (var i = 0; i < CommModule.commNodes.length; i++) {
            if (CommModule.commNodes[i] == null || CommModule.commNodes[i].visited === false || CommModule.commNodes[i].owner === mainObject.user.id) {
                continue;
            }
            foreignCommNodes.push(CommModule.commNodes[i]);
        }
        var t2 = windowHandle.createTable(messageListDiv1, foreignCommNodes, createCommListHeader, createTableLine, null, 110, null, 65, false);
    }
    function showOwnNetworks() {
        //create a table with own commnodes - if there are any
        var ownCommNodes = [];
        for (var i = 0; i < CommModule.commNodes.length; i++) {
            if (CommModule.commNodes[i] == null || CommModule.commNodes[i].visited === false || CommModule.commNodes[i].owner !== mainObject.user.id) {
                continue;
            }
            ownCommNodes.push(CommModule.commNodes[i]);
        }
        if (ownCommNodes.length > 0) {
            /*
            var ownNetworksTitle = $("<div>", { "class": "commNodesSectionHeader" });
            var owns = $('<span><b>' + i18n.label(300) + '</b></span>'); //text: i18n.label(300)
            ownNetworksTitle.append(owns);
            messageListDiv1.append(ownNetworksTitle);
            */
            var t1 = windowHandle.createTable(messageListDiv1, ownCommNodes, function () { return createCommListHeader(true); }, createTableLine, null, 110, null, 60, false);
            //Helpers.setTBodyHeight(panelBody, t1, null, 170, true);
        }
    }
    function showAlliance() {
        //messageListDiv1.html("   222   ");
        for (var i = 0; i < CommModule.commNodes.length; i++) {
            if (CommModule.commNodes[i] == null || CommModule.commNodes[i].visited === false || CommModule.commNodes[i].owner !== mainObject.user.id || CommModule.commNodes[i].connectionType != 4) {
                continue;
            }
            //commNodes[i].createMessageWrite();
            CommModule.commNodes[i].showCommMessages(null, false);
            break;
        }
    }
    function createCommListHeader(showAdministration) {
        if (!showAdministration)
            showAdministration = false;
        var th = ElementGenerator.headerElement;
        var tableRow = $('<tr/>');
        //Name     
        if (showAdministration) {
            tableRow.append(th(443, 322, false, 540)); //empty 
        }
        else {
            tableRow.append(th(443, 472, false, 540)); //empty 
        }
        //Count
        var ReadUnread = $("<div>");
        var messCountHeader = $("<span>");
        messCountHeader.css("font-size", "0.85em");
        messCountHeader.append($("<p>", { text: i18n.label(135) })).append($("<p>", { text: i18n.label(538) }));
        ReadUnread.append(messCountHeader); //ID
        var tableDataId = $('<th/>', { "class": "tdTextLeft borderBottom" });
        tableDataId.append(ReadUnread);
        ReadUnread.css("width", "140px");
        tableRow.append(tableDataId);
        ReadUnread.attr("title", i18n.label(541));
        //Inform when new 
        var tableDataInviteDiv = $("<div>");
        tableDataInviteDiv.append($("<div>", { "class": "informNewComMMessage" }));
        var tableDataInvite = $('<th/>', { "class": "tdTextLeft borderBottom" });
        tableDataInviteDiv.css("width", "70px");
        tableDataInvite.append(tableDataInviteDiv);
        tableRow.append(tableDataInvite);
        tableDataInviteDiv.attr("title", i18n.label(539));
        /*
        //Read thread
        var tableDataInviteDiv = $("<div>");
        tableDataInviteDiv.append($("<span>", { text: "" }));
        var tableDataInvite = $('<th/>', { "class": "tdTextLeft borderBottom" });
        tableDataInviteDiv.css("width", "140px");
        tableDataInvite.append(tableDataInviteDiv);
        tableRow.append(tableDataInvite);
        */
        //tableRow.append(th(null, 140, !showAdministration)); //Admin - Setup        
        if (showAdministration)
            tableRow.append(th(537, 140, true)); //Admin - Setup        
        //tableRow.append(th(null, 10)); //empty 
        return tableRow;
    }
    function createTableLine(_caller, commNode) {
        var tableRow = $('<tr/>');
        tableRow.click(function (e) { e.stopPropagation(); commNode.showCommMessages(_caller); messages.text(commNode.readAndUnreadCount()); });
        /*
        id  OK
        
        active -> border red if inactive
        currentMessage, lastReadMessage, something geeky if lastReadMessage < currentMessage
        OK Button to read? -> Should show data (caption?) from last post?
        
        in stu:
        (owner)
        Button to administer? -> later
        (gif of object) -> onClick zoom to it
        
        */
        //id                
        //var = commNode.id.toString();
        //var tableDataId = $('<td/>', { text: commNode.name, "class" : "firstchild" });
        //tableRow.append(tableDataId);
        //Name
        //ID
        var name = $('<td/>');
        name.append($("<span>" + commNode.name + "</span>"));
        //        name.append($("<span>", { text: _alliance.name }));
        tableRow.append(name);
        var messages = $('<td/>', { text: commNode.readAndUnreadCount() });
        tableRow.append(messages);
        var informWhenNewTD = $('<td/>');
        tableRow.append(informWhenNewTD);
        var informCheckbox = $("<input/>", { type: "checkbox", text: "Beobachten" });
        informCheckbox.prop('checked', commNode.informWhenNew);
        informWhenNewTD.append(informCheckbox);
        informCheckbox.click(function () { commNode.informWhenNewChecked(); });
        /*
        var tableDataRead = $('<td/>');
        var readComm = $('<div/>', { "class" : "fullscreenTableButton", text: i18n.label(302) });
        readComm.click((e: JQueryEventObject) => { e.stopPropagation(); commNode.showCommMessages(_caller); messages.text(commNode.readAndUnreadCount());});
        tableDataRead.append(readComm);
        tableRow.append(tableDataRead);
        */
        //ToDo Gif
        //Administration
        if (commNode.owner === mainObject.user.id) {
            var tableDataAdmin = $('<td/>', { "class": "lastchild" });
            var tableDataAdmin = $('<td/>');
            var adminComm = $('<div/>', { "class": "fullscreenTableButton", text: i18n.label(537) });
            //adminComm.click(showCommAdministration(commNode));
            adminComm.click(function (e) { e.stopPropagation(); commNode.showCommAdministration(_caller); });
            tableDataAdmin.append(adminComm);
            tableRow.append(tableDataAdmin);
        }
        /*
        else {
            informWhenNewTD.addClass("lastchild");
        }*/
        return tableRow;
    }
    function ReceiveCommMessage(message) {
        if (!message["Message"]) {
            Helpers.Log('3 ReceiveCommMessage did sent empty return', Helpers.LogType.DataUpdate);
            return;
        }
        //id: 225, commNodeId: 41, sender: 158, headline: "Title", messageBody: "New textaaa" newMessage:0  sender :158 sendingDate  :"/Date(1475683179540)/"
        var json = $.parseJSON(message["Message"]);
        //console.log(json);
        var id = parseInt(json["id"]);
        var commNodeId = json["commNodeId"];
        if (!CommModule.commNodes[commNodeId])
            return;
        var commNode = CommModule.commNodes[commNodeId];
        //var DummyShip = Ships.MakeDummyShipFromJSON(json);
        if (commNode.messageExists(id)) // if message exists, update it.
            commNode.messagesById[id].updateJson(json);
        else // if ships does not yet exists, add it
            commNode.messageAddJson(json, id);
        commNode.messageCount++;
        commNode.messageUnReadCount++;
        if (commNode.messageUnReadCount > 0 && commNode.informWhenNew)
            document.getElementById('alertCommNode').style.display = 'block';
    }
    CommModule.ReceiveCommMessage = ReceiveCommMessage;
})(CommModule || (CommModule = {}));
CommModule.getNodesFromXML(null);
//# sourceMappingURL=Communication.js.map