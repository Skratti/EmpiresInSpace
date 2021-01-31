var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MessageModule;
(function (MessageModule) {
    var allMessagesById = []; //an array of all user-messages.
    var messageHighestId = 0; //the latest message read.
    MessageModule.messageTypes = []; //elements are instanciated at the end of this file!
    //each messagetype has its own display, so we have to manage the display-relevant data (messageTo, messageHighestTo)...
    //elements are instanciated at the end of this file!
    var MessageType = /** @class */ (function () {
        function MessageType(type, name, tabNumber) {
            this.type = type;
            this.name = name;
            this.tabNumber = tabNumber;
            this.messageTo = 0; //a number representating how many messages were read. opening Message-Dialog sets this to 50, paging back in time in the messageList increases this nuber by 50 each time...
            this.messageHighestTo = 0; // the highest reachedMessageTo-Value. Can't exceed messageCount. Is used to determine if the database is again queried
            this.messageCount = 0; // the amount of all messages the user has in its inbox
        }
        return MessageType;
    }());
    MessageModule.MessageType = MessageType;
    function setCurrentMessageType(type) {
        MessageModule.currentMessageType = MessageModule.messageTypes[type];
    }
    MessageModule.setCurrentMessageType = setCurrentMessageType;
    function ReceiveCombat(message) {
        console.log(message);
        var combat = message;
        CombatMessageModule.receiveResult(message, true);
        combat["AttackerDamageDealt"];
        var jsonResponse = message["CombatRounds"];
        //console.dirxml(XMLGetBuildingsResponse);
        //CombatMessageModule.fromNumber = fromNumber;
        //CombatMessageModule.toNumber = toNumber;
        CombatMessageModule.receiveResult(jsonResponse);
        //that.loaded = true;
        //that.isRead = true;
        //that.createMessagePanel();
    }
    MessageModule.ReceiveCombat = ReceiveCombat;
    function ReceiveMessage(message) {
        if (!message["Message"]) {
            Helpers.Log('3 ReceiveCommMessage did sent empty return', Helpers.LogType.DataUpdate);
            //return;
        }
        //id: 225, commNodeId: 41, sender: 158, headline: "Title", messageBody: "New textaaa" newMessage:0  sender :158 sendingDate  :"/Date(1475683179540)/"
        var json = $.parseJSON(message["Message"]);
        console.log(json);
        var id = parseInt(json["id"]);
        var messagePartId = parseInt(json["messages"][0]["messagePart"]);
        var message = json["messages"][0]["message"];
        var sender = json["messages"][0]["sender"];
        var newMessage; //= new MessageModule.Message(id);
        if (allMessagesById[id]) {
            newMessage = allMessagesById[id];
        }
        else {
            newMessage = new MessageModule.Message(id);
        }
        var messagePart = new MessageModule.MessagePart(messagePartId, message, sender, new Date());
        newMessage.parts.push(messagePart);
        newMessage.isRead = false;
        document.getElementById('alertMessage').style.display = 'block';
    }
    MessageModule.ReceiveMessage = ReceiveMessage;
    var MessageBase = /** @class */ (function () {
        function MessageBase(id) {
            this.id = id;
            this.isRead = false;
            this.loaded = false; // if the text was loaded
        }
        MessageBase.prototype.getMessageText = function (messagePanel) { };
        MessageBase.prototype.showMessage = function (_parent, tableRow) { };
        MessageBase.prototype.getMessageHeaderDTstring = function () {
            var dtNow = new Date();
            if (this.messageDT.getFullYear() == dtNow.getFullYear() &&
                this.messageDT.getMonth() == dtNow.getMonth() &&
                this.messageDT.getDate() == dtNow.getDate())
                return this.messageDT.toLocaleTimeString();
            return this.messageDT.toLocaleDateString();
        };
        MessageBase.prototype.Header = function () {
            return this.header;
        };
        return MessageBase;
    }());
    MessageModule.MessageBase = MessageBase;
    var MessagePart = /** @class */ (function () {
        function MessagePart(messagePartId, messageText, sender, sendingDate) {
            this.messagePartId = messagePartId;
            this.messageText = messageText;
            this.sender = sender;
            this.sendingDate = sendingDate;
        }
        MessagePart.prototype.getMessageHeaderDTstring = function () {
            var dtNow = new Date();
            if (this.sendingDate.getFullYear() == dtNow.getFullYear() &&
                this.sendingDate.getMonth() == dtNow.getMonth() &&
                this.sendingDate.getDate() == dtNow.getDate())
                return this.sendingDate.toLocaleTimeString();
            return this.sendingDate.toLocaleDateString();
        };
        return MessagePart;
    }());
    MessageModule.MessagePart = MessagePart;
    var Message = /** @class */ (function (_super) {
        __extends(Message, _super);
        function Message(id) {
            var _this = _super.call(this, id) || this;
            _this.id = id;
            _this.parts = [];
            return _this;
        }
        Message.prototype.Header = function () {
            return _super.prototype.Header.call(this);
        };
        Message.prototype.turnToMessagePart = function (headerId, partId) {
            var part = new MessageModule.MessagePart(partId, this.messageText, mainObject.user, new Date());
            this.parts.push(part);
        };
        Message.prototype.messageKey = function () {
            return mainObject.user.id.toString() + "." + galaxyMap.name + "." + this.id.toString() + "." + this.participants.toString();
        };
        Message.prototype.messageKeyHeader = function () {
            var key = this.messageKey();
            return key + ".messageHeader";
        };
        Message.prototype.messageKeyBody = function () {
            var key = this.messageKey();
            return key + ".messageBody";
        };
        Message.prototype.setSendButton = function () {
            var headerNotRequired = true;
            if (this.id == 0)
                headerNotRequired = false;
            if (this.messageText && (headerNotRequired || this.header)) {
                $('.yesButton', this.messagePopup.element).removeClass("deactivate");
                $('.yesButton', this.messagePopup.element).removeAttr("disabled");
            }
            else {
                $('.yesButton', this.messagePopup.element).addClass("deactivate");
                $('.yesButton', this.messagePopup.element).prop("disabled", true);
            }
        };
        Message.prototype.update = function (XMLmessage) {
            var senderId = XMLmessage.getElementsByTagName("sender")[0].childNodes[0].nodeValue;
            var receiverId = XMLmessage.getElementsByTagName("addressee")[0].childNodes[0].nodeValue;
            var header = XMLmessage.getElementsByTagName("headline")[0] && XMLmessage.getElementsByTagName("headline")[0].childNodes[0] && XMLmessage.getElementsByTagName("headline")[0].childNodes[0].nodeValue || '';
            var read = XMLmessage.getElementsByTagName("read")[0].childNodes[0].nodeValue;
            var sendingDate = XMLmessage.getElementsByTagName("sendingDate")[0].childNodes[0].nodeValue;
            var messageType = parseInt(XMLmessage.getElementsByTagName("messageType")[0].childNodes[0].nodeValue, 10);
            var participant = XMLmessage.getElementsByTagName("MessageParticipants")[0].childNodes[0].nodeValue;
            //ToDo: do something if user is not yet known (player is online, was itself discovered by another player etc)
            this.sender = mainObject.user.otherUsers[senderId] || mainObject.user;
            this.receiver = mainObject.user.otherUsers[receiverId] || mainObject.user;
            this.header = header;
            if (read == 1)
                this.isRead = true;
            else
                this.isRead = false;
            if (read != 1)
                this.loaded = false;
            this.messageType = messageType;
            this.messageDT = new Date(sendingDate + "Z");
            this.participants = participant;
        };
        Message.prototype.updateText = function (XMLmessage) {
            var XMLmessageText = XMLmessage.getElementsByTagName("message");
            var text = XMLmessageText[0].childNodes[0].nodeValue;
            var messagePartId = parseInt(XMLmessage.getElementsByTagName("messagePart")[0].childNodes[0].nodeValue);
            var sender = parseInt(XMLmessage.getElementsByTagName("sender")[0].childNodes[0].nodeValue);
            var sendingDate = XMLmessage.getElementsByTagName("sendingDate")[0].childNodes[0].nodeValue;
            var senderUser = mainObject.user.otherUsers[sender] || mainObject.user;
            var part = new MessagePart(messagePartId, text, senderUser, new Date(sendingDate));
            this.parts.push(part);
            this.messageText = text;
            this.isRead = true;
            this.loaded = true;
            $(".messageReadBody").html(text);
            $(".messageReadHead").html(this.Header());
        };
        Message.prototype.getMessageText = function (messagePanel) {
            var xhttp = GetXmlHttpObject();
            if (xhttp == null) {
                return;
            }
            var that = this;
            //xmlMap get the map and draw it:
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4) {
                    var XMLGetBuildingsResponse = xhttp.responseXML;
                    //console.dirxml(xmlMap)            
                    //messageText
                    var XMLtext = XMLGetBuildingsResponse.getElementsByTagName("messageBody");
                    that.parts = [];
                    for (var i = 0; i < XMLtext.length; i++) {
                        that.updateText(XMLtext[i]);
                    }
                    Helpers.Log(length + " messageText added");
                    that.isRead = true;
                    if (messagePanel !== undefined) {
                        //that.updateMessagePanel(messagePanel);
                        that.showMessages(that.allMessages);
                    }
                }
            };
            xhttp.open("GET", "Server/Messages.aspx?action=getMessageText&messageId=" + this.id, true);
            xhttp.send("");
        };
        Message.prototype.initSendMessage = function () {
            var receiver = $("#messageWrite").first().data("receiverId");
            this.sender = mainObject.user;
            this.receiver = mainObject.user.otherUserFind(receiver);
            this.header = $("#messageWrite #messageWriteSubject").val().toString();
            this.messageText = $("#messageWrite .messageWriteBody").val().toString();
            this.isRead = true;
            this.loaded = true;
        };
        Message.prototype.sendMessage = function () {
            var xhttp = GetXmlHttpObject();
            if (xhttp == null) {
                return;
            }
            var that = this;
            if (this.id == 0) {
                this.header = $("input.messageHeaderInput", this.messagePopup.element).val().toString();
            }
            this.messageText = $("textarea.messageBody", this.messagePopup.element).val().toString();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4) {
                    var XMLresponse = xhttp.responseXML;
                    var headerId = parseInt(XMLresponse.getElementsByTagName("newMessageId")[0].childNodes[0].nodeValue);
                    var messagePartId = parseInt(XMLresponse.getElementsByTagName("newMessagePartId")[0].childNodes[0].nodeValue);
                    if (Helpers.supportsHtmlStorage()) {
                        localStorage.setItem(that.messageKeyHeader(), "");
                        localStorage.setItem(that.messageKeyBody(), "");
                    }
                    that.messageText = that.messageText.replace(/\n\r?/g, '<br />');
                    that.turnToMessagePart(headerId, messagePartId);
                    if (that.id != headerId) {
                        that.id = headerId;
                        allMessagesById[headerId] = that;
                    }
                    Helpers.Log(length + " messageId updated");
                }
            };
            //Helpers.Log(this.receiver.id.toString() + " SEND gets Message");
            //Helpers.Log(this.header + " SEND Subject");
            //Helpers.Log(this.messageText + " SEND Body");
            var command = "Server/Messages.aspx?action=sendMessage&messageReceiver=" + this.receiver.id.toString()
                + "&messageHeader=" + this.header;
            if (this.id) {
                command += '&messageId=' + this.id.toString();
            }
            else {
                this.participants = this.sender.id.toString() + ";" + this.receiver.id.toString();
                command += '&participants=' + this.participants;
            }
            xhttp.open("POST", command, true);
            xhttp.send(this.messageText);
            //var z = xhttp.responseXML;
        };
        /////////////// User Interface: 
        Message.prototype.showMessage = function (_parent, tableRow) {
            var _this = this;
            Helpers.Log("message.showMessage()... " + this.id.toString());
            //var popupPanel: JQuery;
            this.messagePopup = ElementGenerator.MainPanel();
            var popupPanel = this.messagePopup.element;
            this.messagePopup.setHeader(this.Header());
            var panelBody = $('.relPopupBody', popupPanel);
            panelBody.addClass("ScriptWithWindowBody");
            panelBody.css("background", "rgba(0, 0, 0, 0.85)");
            this.allMessages = $("<div/>", { "class": "allCommMessages" });
            panelBody.append(this.allMessages);
            $('.noButton', popupPanel).click(function (e) { popupPanel.remove(); });
            var that = this;
            $('.noButton span', popupPanel).text(i18n.label(545)); //abbrechen
            if (this.messageType == 10) {
                $('.noButton', popupPanel).css("display", "inline-block");
            }
            $('.yesButton  span', popupPanel).text(i18n.label(228)); //senden
            $('.yesButton', popupPanel).unbind("click");
            $('.yesButton', popupPanel).click(function (e) { _this.sendMessage(); popupPanel.remove(); });
            // bind action for deactivating / activating send-Button
            // and save work in progress
            if (this.id == 0) {
                this.createMessageHeaderDiv();
                if (Helpers.supportsHtmlStorage()) {
                    var val = localStorage.getItem(this.messageKeyHeader());
                    this.header = val;
                    $("input.messageHeaderInput", popupPanel).val(val);
                }
                $('.yesButton', popupPanel).addClass("deactivate");
                var headerInput = $("input.messageHeaderInput", popupPanel);
                headerInput.bind("input", function () {
                    if (that.header == this.value)
                        return;
                    that.header = this.value;
                    if (Helpers.supportsHtmlStorage()) {
                        localStorage.setItem(that.messageKeyHeader(), that.header);
                    }
                    var bodyText = $(".CommMessageWriteContainer textarea", popupPanel).val();
                    that.setSendButton();
                });
            }
            if (!this.loaded && this.id != 0) {
                this.getMessageText(this.allMessages);
                if (tableRow !== undefined) {
                    tableRow.css("font-weight", "normal");
                }
                //$('[data-messageheadid="' + this.id + '"] span').css("font-weight", "normal");
            }
            else
                this.showMessages(this.allMessages);
            window.scrollTo(0, 0);
            this.setSendButton();
        };
        Message.prototype.showMessages = function (allMessages) {
            var elementNo = 0;
            for (var i = 0; i < this.parts.length; i++) {
                if (typeof this.parts[i] === 'undefined')
                    continue;
                elementNo++;
                allMessages.append(this.createMessageDiv(this.parts[i], elementNo % 2 == 0));
            }
            this.createMessageBodyDiv();
        };
        //show received message
        Message.prototype.createMessageDiv = function (message, gray) {
            if (gray === void 0) { gray = false; }
            //ToDo : Use Data element instead of id-class
            var messageBorder = $("<div/>");
            var messageDiv = $("<div/>", { "class": "CommMessage" });
            messageBorder.append(messageDiv);
            if (gray) {
                messageDiv.addClass("CommMessageGray");
            }
            var headerPadding = $("<div/>", { "class": "headerPadding" });
            messageDiv.append(headerPadding);
            /*
            var senderName = '';
            senderName = (message.sender && message.sender.name || '');
            var header = $("<a/>", { style: "display:inline;" });
            header.html(senderName);
            var userId = message.sender && message.sender.id || 0;
            if (userId) {
                header.click(() => { DiplomacyModule.entryPoint2(userId, null); });
            }*/
            headerPadding.append(PlayerData.createUserLink(message.sender));
            var headerDate = $("<div/>", { style: "display:inline;", text: message.getMessageHeaderDTstring() });
            headerDate.css("float", "right");
            headerPadding.append(headerDate);
            var contentDiv = $("<div/>", { "class": "headerPadding selectText" });
            contentDiv.append($("<p/>").html(message.messageText));
            messageDiv.append(contentDiv);
            return messageBorder;
        };
        Message.prototype.createMessageHeaderDiv = function () {
            var headerDiv = $("<div/>");
            var toDiv = $("<div/>");
            var toLabelDiv = $("<div/>");
            toLabelDiv.css("position", "absolute");
            var toTextSpan = $("<span/>", { text: "To:" });
            toLabelDiv.append(toTextSpan);
            toDiv.append(toLabelDiv);
            var toNameDiv = $("<div/>");
            toNameDiv.css("position", "relative").css("left", "70px").css("width", "500px");
            var toNameSpan = $("<span/>", { text: this.receiver.name });
            toNameSpan.html(this.receiver.name);
            toNameDiv.append(toNameSpan);
            toDiv.append(toNameDiv);
            headerDiv.append(toDiv);
            var messageBody = $("<div/>", { "class": "messageHeaderInputDiv" });
            var messageText = $("<input/>", { text: '', "class": "messageHeaderInput" });
            messageBody.append(messageText);
            headerDiv.append(messageBody);
            setTimeout(function () {
                messageText.focus();
            }, 0);
            this.allMessages.prepend(headerDiv);
            mainObject.keymap.isActive = false;
            return headerDiv;
        };
        //show panel to WRITE message
        Message.prototype.createMessageBodyDiv = function () {
            var writeBodyDiv = $("<div/>");
            writeBodyDiv.addClass("CommMessageWriteContainer");
            var messageBody = $("<div/>", { "class": "commMessageMaxHeight" });
            var messageText = $("<textarea/>", { "class": "messageBody" });
            messageBody.append(messageText);
            writeBodyDiv.append(messageBody);
            if (this.id) {
                setTimeout(function () {
                    messageText.focus();
                }, 0);
            }
            this.allMessages.after(writeBodyDiv);
            mainObject.keymap.isActive = false;
            if (Helpers.supportsHtmlStorage()) {
                this.messageText = localStorage.getItem(this.messageKeyBody());
                messageText.val(this.messageText);
            }
            var that = this;
            $(".CommMessageWriteContainer textarea", this.messagePopup.element).on("change keyup paste", function () {
                var currentVal = $(this).val();
                if (that.messageText == currentVal) {
                    return; //check to prevent multiple simultaneous triggers
                }
                that.messageText = currentVal.toString();
                if (Helpers.supportsHtmlStorage()) {
                    localStorage.setItem(that.messageKeyBody(), that.messageText);
                }
                that.setSendButton();
                /*
                var headerNotRequired = true;
                if (that.id == 0) headerNotRequired = false;

                if (this.value && (headerNotRequired || that.header)) {
                    $('.yesButton', that.messagePopup.element).removeClass("deactivate");
                    $('.yesButton', that.messagePopup.element).removeAttr("disabled");
                } else {
                    $('.yesButton', that.messagePopup.element).addClass("deactivate");
                    $('.yesButton', that.messagePopup.element).attr("disabled", true);
                    
                }*/
            });
            return writeBodyDiv;
        };
        return Message;
    }(MessageBase));
    MessageModule.Message = Message;
    //gets all Messages between From and To, 
    //and all new messages that were received since the last getMessage-Command (by use of messageHighestId)
    function getReceivedMessages(fromNumber, toNumber, messageType) {
        if (messageType === void 0) { messageType = 10; }
        //if (currentMessageType.messageHighestTo >= toNumber) return;
        MessageModule.currentMessageType.messageHighestTo = Math.max(toNumber, MessageModule.currentMessageType.messageHighestTo);
        var xhttp = GetXmlHttpObject();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                var XMLGetBuildingsResponse = xhttp.responseXML;
                //console.dirxml(XMLGetBuildingsResponse);
                receiveResult(XMLGetBuildingsResponse, fromNumber, toNumber, messageType);
            }
        };
        Helpers.Log("getReceivedMessages&fromNr" + fromNumber + "&toNr=" + toNumber + "&messageHighestId=" + messageHighestId + "&messageType=" + messageType);
        xhttp.open("GET", "Server/Messages.aspx?action=getReceivedMessages&fromNr=" + fromNumber + "&toNr=" + toNumber + "&messageHighestId=" + messageHighestId + "&messageType=" + messageType, true);
        xhttp.send("");
    }
    MessageModule.getReceivedMessages = getReceivedMessages;
    function receiveResult(XMLGetBuildingsResponse, fromNumber, toNumber, messageType) {
        if (messageType === void 0) { messageType = 10; }
        switch (messageType) {
            case 10: // Allgemein
            case 30: // Trade
            case 60: //versendet
                var XMLobjects = XMLGetBuildingsResponse.getElementsByTagName("message");
                var length = XMLobjects.length;
                for (var i = 0; i < length; i++) {
                    MessageModule.createUpdateMessageElement(XMLobjects[i]);
                    //that.createUpdateMessageElement(XMLobjects[i]);
                }
                var messageAmount = parseInt(XMLGetBuildingsResponse.getElementsByTagName("amount")[0].childNodes[0].nodeValue);
                MessageModule.currentMessageType.messageCount = Math.max(MessageModule.currentMessageType.messageCount, messageAmount);
                //mainObject.messageCount = Math.max(new Array(mainObject.messageCount, messageAmount));
                Helpers.Log(length + " messages added");
                break;
            case 50: //combat
                Helpers.Log(" Combat messages added");
                break;
            default:
                Helpers.Log(" messages error type " + messageType.toString());
        }
        //refresh the display, since the messages were loaded async...
        if ($(".MessagePanel").get(0)) {
            MessageModule.userInterface.showMessages(fromNumber, toNumber);
        }
    }
    function messageExists(id) {
        if (allMessagesById[parseInt(id, 10)] != null)
            return true;
        else
            return false;
    }
    function messageAdd(XMLmessage) {
        var id = XMLmessage.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        var newMessage = new MessageModule.Message(id);
        //add to Building array
        allMessagesById[mainObject.parseInt(id)] = newMessage;
        messageHighestId = messageHighestId < id ? id : messageHighestId;
        //get all Building Data out of the XMLresearch
        newMessage.update(XMLmessage);
    }
    function createUpdateMessageElement(XMLmessage) {
        var XMLmessageId = XMLmessage.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        if (messageExists(XMLmessageId)) // if message exists, update it.
            allMessagesById[XMLmessageId].update(XMLmessage);
        else // if ships does not yet exists, add it
            messageAdd(XMLmessage);
    }
    MessageModule.createUpdateMessageElement = createUpdateMessageElement;
    // trennung gui und daten? -> 
    var userInterface;
    (function (userInterface) {
        var windowHandle;
        var messagePanel;
        var messageListDiv1;
        var messageShowed = 50; //shows message 0 to 50 (orderer by descending ids)        
        function markAllRead() {
            Helpers.Log("READ : " + MessageModule.currentMessageType.type.toString());
            var messages;
            if (MessageModule.currentMessageType.type == 50) {
                messages = CombatMessageModule.allMessagesById;
            }
            else {
                messages = allMessagesById;
            }
            for (var i = messages.length; i > -1; i--) {
                if (typeof messages[i] === 'undefined')
                    continue;
                if (messages[i].messageType != MessageModule.currentMessageType.type)
                    continue;
                messages[i].isRead = true;
            }
            $.ajax("Server/Messages.aspx", {
                "type": "GET",
                "async": true,
                "data": {
                    "action": "setMessageRead",
                    "messageType": MessageModule.currentMessageType.type.toString()
                }
            });
            //refresh essages, jump to begin
            showMessages(1, 50);
        }
        userInterface.markAllRead = markAllRead;
        function createMessageButton() {
            var _this = this;
            var icon = $("<button>", { "class": "messageButton" });
            icon.css("display", "none");
            icon.button({ "icons": { "primary": 'message', "secondary": null } });
            icon.tooltip();
            icon.click(function (e) {
                _this.showTransList();
                _this.icon.css("display", "none");
            });
            var li = $("<li>");
            li.append(this.icon);
            $("#ui #alerts ul").append(li);
        }
        userInterface.createMessageButton = createMessageButton;
        function createMessageListRelPanel() {
            document.getElementById('alertMessage').style.display = 'none';
            var popupPanel;
            //var windowHandle = new ElementGenerator.WindowManager(null);
            windowHandle = ElementGenerator.MainPanel();
            popupPanel = windowHandle.element;
            //$('.relPopupBody', popupPanel).removeClass("scrollableTableDiv");
            popupPanel.addClass("MessagePanel");
            var panelHeader = $('.relPopupHeader', popupPanel);
            var caption = $('<h2/>', { text: i18n.label(135), style: "float:left" });
            panelHeader.append(caption);
            $('.noButton span', popupPanel).click(function () { MessageModule.userInterface.showLaterMessagesList(); });
            var tabDiv = $("<div id='tabs'/>", { "class": "MessageTabPage" });
            var readButton = $('<button/>', { "class": 'ui-state-default bX', "text": i18n.label(766) });
            readButton.css("float", "right").css("float", "right").css("position", "relative").css("right", "42px");
            readButton.addClass("bX");
            readButton.click(function () { MessageModule.userInterface.markAllRead(); });
            panelHeader.append(readButton);
            //readButton.button();
            var tabUl = $("<ul/>");
            tabUl.css("display", "table"); //.ui-helper-clearfix:before, .ui-helper-clearfix:after
            //tabUl.css("clear", "both");
            for (var i = 0; i < MessageModule.messageTypes.length; i++) {
                if (MessageModule.messageTypes[i] === undefined)
                    continue;
                var li1 = $("<li/>");
                //var aHref1 = $("<a href = '#tab1' > " + "Alle" + " </a >");
                var aHref1 = $("<a/>", { "href": "#tab1", "text": MessageModule.messageTypes[i].name }); // , "id": 'messageA' + messageTypes[i].type
                li1.data("num", MessageModule.messageTypes[i].type);
                li1.append(aHref1);
                tabUl.append(li1);
            }
            tabDiv.append(tabUl);
            messageListDiv1 = $("<div id='tab1'/>");
            messageListDiv1.addClass("MessageRowContainer");
            //messageListDiv1.css("overflow-y", "auto").css("height", "315px").css("margin-top", "5px");
            popupPanel.css("overflow-y", "none");
            tabDiv.append(messageListDiv1);
            var panelBody = $('.relPopupBody', popupPanel);
            panelBody.append(tabDiv);
            tabDiv.tabs({
                "active": MessageModule.currentMessageType.tabNumber,
                "activate": function (event, ui) {
                    messageShowed = 50;
                    var selectedTab = parseInt($(ui.newTab.context.parentElement).data("num"), 10);
                    Helpers.Log(selectedTab.toString());
                    MessageModule.currentMessageType = MessageModule.messageTypes[selectedTab];
                    if (selectedTab == 50) {
                        CombatMessageModule.getReceivedMessages(1, 50);
                        MessageModule.currentMessageType.messageCount = CombatMessageModule.messageCount;
                    }
                    else {
                        getReceivedMessages(1, 50, selectedTab); //also updates , if newer messages are present
                    }
                    showMessages(1, 50);
                }
            });
            tabDiv.addClass("MessageTabPage");
            $('.yesButton', popupPanel).click(function (e) { popupPanel.remove(); });
            $('.noButton', popupPanel).css("display", "inline-block");
            $('.noButton span', popupPanel).text("More");
            $('.yesButton span', popupPanel).text('OK');
            return popupPanel;
        }
        userInterface.createMessageListRelPanel = createMessageListRelPanel;
        //initially generate the Panel and its components
        function showMessageList2() {
            messageShowed = 50;
            messagePanel = createMessageListRelPanel();
            var buildTable = $('<table/>', { "class": "messageTableBorder fullscreenTable width100 ", "cellspacing": 0 }); // , style:"border-collapse: collapse;"
            messageListDiv1.append(buildTable);
            messagePanel.appendTo("body"); //attach to the <body> element
            //make a async call to get the last messages:
            getReceivedMessages(1, 50, MessageModule.currentMessageType.type); //also updates , if newer messages are present
            showMessages(1, 50);
        }
        userInterface.showMessageList2 = showMessageList2;
        function showMultiMessageWrite(participants) {
            //if(isDemo) ElementGenerator.messagePopup(338);
            //Helpers.Log("showMessageWrite()... user " + otherUser.id.toString());
            window.scrollTo(0, 0);
            var newConversation = new MessageModule.Message(0);
            var d = new Date();
            //var n = d.getTimezoneOffset();
            //d.setTime(d.getTime() + n * 60 * 1000);
            newConversation.messageDT = d;
            newConversation.sender = mainObject.user;
            newConversation.receiver = mainObject.user;
            newConversation.messageType = 10;
            newConversation.loaded = true;
            newConversation.isRead = true;
            newConversation.participants = participants;
            newConversation.showMessage(null);
        }
        userInterface.showMultiMessageWrite = showMultiMessageWrite;
        //called by Diplomacy (user-list) - later from other ships, trade screens, alliance-screen...
        function showMessageWrite(otherUser) {
            //if(isDemo) ElementGenerator.messagePopup(338);
            //Helpers.Log("showMessageWrite()... user " + otherUser.id.toString());
            window.scrollTo(0, 0);
            var newConversation = new MessageModule.Message(0);
            var d = new Date();
            //var n = d.getTimezoneOffset();
            //d.setTime(d.getTime() + n * 60 * 1000);
            newConversation.messageDT = d;
            newConversation.sender = mainObject.user;
            newConversation.receiver = otherUser;
            newConversation.messageType = 10;
            newConversation.loaded = true;
            newConversation.isRead = true;
            newConversation.participants = newConversation.sender.id.toString() + ";" + newConversation.receiver.id.toString();
            newConversation.showMessage(null);
        }
        userInterface.showMessageWrite = showMessageWrite;
        function sendMessage(messagePanel, otherUser) {
            //var receiver: number = $("#messageWrite").first().data("receiverId");
            /*
            if (!mainObject.user.otherUserExists(receiver)) {
                Helpers.Log("Error : Unknown userId");
                return;
            }
            */
            // mainObject.user.otherUsers[i]
            var newMessage = new MessageModule.Message(0);
            newMessage.initSendMessage();
            newMessage.sendMessage();
        }
        userInterface.sendMessage = sendMessage;
        function showMessages(from, to) {
            var messageTable = $("#tab1", messagePanel);
            messageTable.empty();
            var elementNo = 0;
            //add messages to the table
            var messages;
            if (MessageModule.currentMessageType.type == 50) {
                messages = CombatMessageModule.allMessagesById;
            }
            else {
                messages = allMessagesById;
                //messages.sort(function (a, b) {return (<any>a.messageDT - <any>b.messageDT) })
            }
            var MessagesInOrder = [];
            for (var i = messages.length; i > -1; i--) {
                if (typeof messages[i] === 'undefined')
                    continue;
                if (messages[i].messageType != MessageModule.currentMessageType.type)
                    continue;
                elementNo++;
                if (elementNo < from)
                    continue;
                if (elementNo >= to)
                    break;
                MessagesInOrder.push(messages[i]);
                //createROw
                //messageTable.append(messageTableRow2(messages[i], windowHandle, elementNo % 2 == 0));
            }
            MessagesInOrder.sort(function (a, b) { return (a.messageDT - b.messageDT); });
            for (var i = MessagesInOrder.length; i > -1; i--) {
                if (typeof MessagesInOrder[i] === 'undefined')
                    continue;
                messageTable.append(messageTableRow2(MessagesInOrder[i], windowHandle, i % 2 == 0));
            }
            // windowHandle.SetBottom();
        }
        userInterface.showMessages = showMessages;
        function messageTableRow2(message, _caller, gray) {
            if (gray === void 0) { gray = false; }
            var tableRow = $('<div/>', { "class": "messageTR messageNotReadTRBackground" });
            if (gray) {
                tableRow.addClass("CommMessageGray");
            }
            //tableRow.click((e: JQueryEventObject) => { MessageModule.userInterface.showMessageRead2(message.id, tableRow); });
            tableRow.click(function (e) { message.showMessage(_caller, tableRow); });
            // onclick="userInputMethods.showMessageRead(' + allMessagesById[i].id + ');"  data-messageheadid="' + allMessagesById[i].id + '">';
            var messageFromToLabelDiv = $('<div/>', { "class": "messageFromToDiv" }); //abs, left , width 70
            messageFromToLabelDiv.append($('<span/>', { "text": i18n.label(817) })).append($('<br/>')).append($('<span/>', { "text": i18n.label(226) })); //From: To:
            tableRow.append(messageFromToLabelDiv);
            var tableDataTime = $('<div/>', { "class": "messageTimeDiv" }); //abs, right 
            var tableDataTimeSpan = $('<span/>', { text: message.getMessageHeaderDTstring() });
            tableDataTime.append(tableDataTimeSpan);
            tableRow.append(tableDataTime);
            var messageFromToNamesDiv = $('<div/>', { "class": "messageFromNames" }); //relativ, left + 70
            var messageFromNamesSpan = $('<span/>');
            messageFromNamesSpan.html(message.sender && message.sender.name || '');
            messageFromToNamesDiv.append(messageFromNamesSpan).append($('<br/>'));
            if (message.participants) {
                var parts = message.participants.split(";");
                for (var i = 0; i < parts.length; i++) {
                    var userId = parts[i];
                    if (userId && parseInt(userId) != message.sender.id) {
                        if (PlayerData.existsUser(parseInt(userId))) {
                            var messageToNamesSpan = $('<span/>');
                            messageToNamesSpan.html(PlayerData.findUser(parseInt(userId)).name);
                            messageFromToNamesDiv.append(messageToNamesSpan).append($('<br/>'));
                        }
                    }
                }
            }
            messageFromToNamesDiv.append($('<br/>'));
            var tableDataHeaderSpan = $('<span/>');
            tableDataHeaderSpan.html(message.Header());
            messageFromToNamesDiv.append(tableDataHeaderSpan);
            tableRow.append(messageFromToNamesDiv);
            if (!message.isRead) {
                tableRow.css("font-weight", "bold");
                tableRow.addClass("MessageUnread");
            }
            return tableRow;
        }
        function showLaterMessagesList() {
            if (messageShowed >= MessageModule.currentMessageType.messageCount)
                return;
            var firstMessage = messageShowed + 1;
            messageShowed += 50;
            getReceivedMessages(firstMessage, messageShowed, 10);
            showMessages(firstMessage, messageShowed);
        }
        userInterface.showLaterMessagesList = showLaterMessagesList;
        function showEarlierMessagesList() {
            if (messageShowed >= 100)
                messageShowed -= 50;
            else
                messageShowed = 50;
            var firstMessage = messageShowed - 49;
            getReceivedMessages(firstMessage, messageShowed, 10);
            showMessages(firstMessage, messageShowed);
        }
        userInterface.showEarlierMessagesList = showEarlierMessagesList;
    })(userInterface = MessageModule.userInterface || (MessageModule.userInterface = {}));
    //10 Allgemein , 20 Produktion ,  30 Handel , 40 Diplomatie , 50 Kampf 
    //lables are set in the i18nSetLanguage
    MessageModule.messageTypes[10] = new MessageType(10, '', 0); //Allgemein
    MessageModule.messageTypes[20] = new MessageType(20, '', 1); //Produktion
    MessageModule.messageTypes[30] = new MessageType(30, '', 2); //Handel
    MessageModule.messageTypes[40] = new MessageType(40, '', 3); //Diplomatie
    MessageModule.messageTypes[50] = new MessageType(50, '', 4); //Kampf
    //    messageTypes[60] = new MessageType(60, '',5); //Versendet 235
    MessageModule.currentMessageType = MessageModule.messageTypes[10];
})(MessageModule || (MessageModule = {}));
//# sourceMappingURL=messages.js.map