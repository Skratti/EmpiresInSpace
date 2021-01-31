
module Chat {

    var IsOpen: boolean = false;
    var newChatMessages: number = 0;    

    //creates the single icon for when the chat is minimized
    function createIcon() {
        this.icon = $("<button>");
        this.icon.button({ "icons": { "primary": 'imageSpeak', "secondary": null } });
        this.icon.tooltip();
        this.icon.click((e) => {
            IsOpen = true;
            newChatMessages = 0;
            $(".UnreadChats").css("display", "none");
            $("#chat").css("display", "block");
            $("#chatRestore").css("display", "none"); 
            if (Helpers.supportsHtmlStorage()) { localStorage.setItem('chat', 'true'); }                    
        });

        var li = $('<li id="chatRestore" >');
        li.append(this.icon);

        var unreadChats = $('<div class="UnreadChats UnreadMarker" >');
        li.append(unreadChats);
        //<li><button id="chatRestore"><span class="imageSpeak liButton2"></span></button></li>
        $("#QuestList ul").append(li);

        //the close button on the chat window
        $("#chat button").click((e) => {
            IsOpen = false;
            $("#chatRestore").css("display", "block");     
            $("#chat").css("display", "none");

            if (Helpers.supportsHtmlStorage()) {localStorage.setItem('chat', 'false');}
        });   

        //Assign last size values if available
        if (Helpers.supportsHtmlStorage()) {
            if (localStorage.getItem("chat_height") !== null) {
                $("#chat").css("height", localStorage.getItem("chat_height") + "px");
                $("#chat").css("width", localStorage.getItem("chat_width") + "px");
            }
        }

        //make resizable
        // prevent setting of left and top, since bottom and right are used to position
        // save size during resizing, so that these values may be used as defaults
        $("#chat").resizable({
            "handles": "nw",
            "resize": function (event, ui) {
                $(this).css({ "left": 'inherit' }).css({ "top": 'inherit' });
                if (Helpers.supportsHtmlStorage()) { localStorage.setItem('chat_height', $(this).height().toString()); localStorage.setItem('chat_width', $(this).width().toString()); } 
            }
        });
        $("#chat").css({ "resize": 'inherit' }).css({ "top": 'inherit' });
        
        //$("#chat").css("left", (($(window).width() - $("#chat").width()) - 20) + "px");
        //$("#chat").css("top", ($(window).height() - 445) + "px");
         
       //$("#chat").css("top", $("#chat").offset().top + 'px');
    }

    //createt the chat Icon, sets visibility, sets events
    export function initChat() {
        createIcon();

        if (Helpers.supportsHtmlStorage()) {
            var isVisible = localStorage.getItem('chat');
            if (isVisible == null || isVisible == 'true') {
                $("#chatRestore").css("display", "none");
                $("#chat").css("display", "block");
                IsOpen = true;
            } else {
                $("#chatRestore").css("display", "block");
                $("#chat").css("display", "none");
                IsOpen = false;
            }
        }
        else {
            $("#chatRestore").css("display", "none");
            $("#chat").css("display", "block");
            IsOpen = true;
        }


        $("#chat input").click(e=> { e.stopPropagation(); e.preventDefault(); Chat.toggleUsedOn(); });

        $("#chat input").keyup(function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (e.keyCode == 13) {
                // Call the Send method on the hub.
                $.connection.spaceHub.server.send($('#chat input').val().toString());
                // Clear text box and reset focus for next comment.
                $('#chat input').val('').focus();
            }
        });
    }
    
    // sets focus on the Chat input line
    export function toggleUsedOn() {
        if (this.IsUsed) return;
        this.IsUsed = true;
        //mainObject.keymap.isActive = false;
       // $('#chat input').focus();
    }

    //removes focus from chat input line
    export function toggleUsedOff() {
        if (!this.IsUsed) return;

        $('#chat input').blur();
        this.IsUsed = false;
        //mainObject.keymap.isActive = true;
    }

    export function initChatTooltip() {
        $("#chatRestore").attr('title', i18n.label(913));        
    }

    export function initActiveUsers() {
        $.connection.spaceHub.invoke("FetchActiveUsers").done(e => { Chat.ActiveUsersDone(e); Helpers.Log('FetchActiveUsers');});      
    }

    function addParticipant(userId: number) {
        //Helpers.Log("add to Chat  " + userId);
        //this method is also called when a new user joins the galaxy. mainObject.findUser(userId) does return null at that moment...
        removeUserFromChat(userId);
        var chatParticipants = mainObject.findUser(userId);
        var UserLink = null;
        if (chatParticipants) UserLink = PlayerData.createUserLink(chatParticipants);
        var chatParticipantsDiv = $('<div data-id="' + userId.toString() + '"/>');
        if (UserLink) {
            chatParticipantsDiv.append(UserLink);
        } else {
            chatParticipantsDiv.html( chatParticipants && chatParticipants.name || userId.toString());
        }     
        $("#chatParticipantsList").append(chatParticipantsDiv);
        //chatParticipantsDiv.data('id', userId);
    }

    export function refreshParticipantName(userId: number) {
        //Helpers.Log("refreshParticipantName  " + userId + " Show X" );
        var chatParticipants = mainObject.findUser(userId);
        var UserLink = null;
        if (chatParticipants) UserLink = PlayerData.createUserLink(chatParticipants);

        if (UserLink) {
            $('#chatParticipantsList div[data-id="' + userId.toString() + '"]').empty();
            $('#chatParticipantsList div[data-id="' + userId.toString() + '"]').append(UserLink);
        } else {
            $('#chatParticipantsList div[data-id="' + userId.toString() + '"]').html(UserLink && UserLink.html() || chatParticipants && chatParticipants.name || userId.toString());
        }  

        //Helpers.Log("refreshParticipantName  " + userId + " Show " + chatParticipants && chatParticipants.name || userId.toString());
        //$('#chatParticipantsList div[data-id="' + userId.toString() + '"]').html(UserLink && UserLink.html() || chatParticipants && chatParticipants.name || userId.toString());
    }

    //add users to the list of active users
    export function ActiveUsersDone(x: any) {
        //Helpers.Log(x);
        var Active: number[] = x["Active"];
        for (var i = 0; i < Active.length; i++) {
            addParticipant(Active[i]);                       
        }
    }

    function addMessageCount() {
        if (!IsOpen) {
            newChatMessages++;
            $(".UnreadChats").html(newChatMessages.toString());
            $(".UnreadChats").css("display", "block");
        }        
    }

    //Receive message from other users (or own message)
    export function BroadcastMessage(id: number, message: string) {

        if (message == null || message.isEmpty()) return;

        var sender = mainObject.findUser(id);
        var name = sender && sender.name || '';

        var messageDiv = $('<div />');
        var nameSpan = $('<span />');
        nameSpan.html(name);
        var messageSpan = $('<span />').text(': ' + message);
        messageDiv.append(nameSpan).append(messageSpan);

        $("#chatWindowContent").append(messageDiv);
        $('#chatWindow').scrollTop($('#chatWindow')[0].scrollHeight);

        addMessageCount();

    }

    export function removeUserFromChat(userId: number) {
        //Helpers.Log("removeUserFromChat  " + userId);
        $('#chatParticipantsList div[data-id="' + userId.toString() + '"]').remove();
    }

    export function addUserToChat(userId: number) {
        //Helpers.Log('addUserToChat ' + userId);
        //mainObject.user.checkNewContactSimple(targetUserId);

        if (mainObject.user.id == userId) return;

        if (!mainObject.user.otherUserExists(userId)) {
            mainObject.user.checkNewContactSimple(userId);
        }

        addParticipant(userId);
    }
}