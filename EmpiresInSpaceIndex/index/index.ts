/// <reference path="../References.ts" />
interface registerChecks {
    nameCheck: boolean;
    pwCheck: boolean;
    emailCheck: boolean;
    inGameNameCheck: boolean;
    registerPanel: JQuery;
}

declare var userLang : string;
declare var recaptchaPublic : string;


var labels = new EmpiresIndex.Labels();//needed for setLanguages


module EmpiresIndex {

     //ToDO: validate email, show ignoreValidation-checkbox if email seems to be incorrect, only let the user use the email if it is either valid, or the checkbox ist checked
    export function isEmail(email) : boolean {
        return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);
    }

    export function getValueFromCookie(key : string): string {
        var retValue = '';

        var allValues = document.cookie;             
        var cookieArray = allValues.split('; ');

        // Now take key value pair out of this array
        for (var i = 0; i < cookieArray.length; i++) {            
            if (cookieArray[i].split('=')[0] == key) 
                retValue = cookieArray[i].split('=')[1]                 
        }
        console.log('get- Key:' + key + '-- Value:' + retValue + '--');
        console.log('Cookie1:  ' + document.cookie);
        return retValue; 
    }

    export function setValueFromCookie(key: string, value: string) {
        var date = new Date();
        date.setTime(+ date + (100 * 86400000)); //24 * 60 * 60 * 1000

        document.cookie = key + '=' + value +
        '; expires=' + date.toUTCString() +
            '; path=/';
        console.log('set: ' + key + ' ' + value);
        console.log('Cookie komplett:  ' + document.cookie);
    }
    export function removeValueFromCookie(key: string) {
        document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        console.log('Cookie22:  ' + document.cookie);
        getValueFromCookie(key);

    }

    export function tryRememberCookie() :boolean {
        var cookieData = getValueFromCookie('remember');
        var userName = cookieData.split('|')[0];
        var cookieValue = cookieData.split('|')[1];

        if (cookieData && userName && cookieValue) {
            $("#rememberCheckBox").prop('checked', true);

            $.ajax("Authentication.aspx", {
                "type": "POST",
                "data": {
                    "action": "tryCookieLogin",
                    "username": userName,
                    "cookieValue": cookieValue
                }
            }).done(function (msg) {
                //check if answer contains a user:
                if (typeof (msg.getElementsByTagName) != "undefined") {

                    var userId = msg.getElementsByTagName("id");
                    var length = userId.length;

                    if (length == 0) return;
                    if (!userId[0] || userId[0] == 0) return;

                    pageIndex.readIndexData(msg);
                    pageIndex.LoggedIn();


                } else {
                    //set language without user object
                    pageIndex.SetLanguage();
                }
                }
                );

            console.log('tryRememberCookie');
            return true;
        }
        return false;
    }

    export class PageIndex {


        user: User;
        games: Game[] = [];

        registerCheck: registerChecks;

        constructor() {
           
        }

        readIndexData(loginXML) {
            //User
            var XMLuser = loginXML.getElementsByTagName("user");
            var length = XMLuser.length;
            for (var i = 0; i < length; i++) {
                this.createUpdateUserElement(XMLuser[i]);
            }

            var XMLgames = loginXML.getElementsByTagName("game");
            length = XMLgames.length;
            for (var i = 0; i < length; i++) {
                this.createUpdateGameElement(XMLgames[i]);
            }

            //update or create rememberCookie
            var XMLremember = loginXML.getElementsByTagName("remember");
            length = XMLremember.length;
            if (length == 1) {
                var code = XMLremember[0].getElementsByTagName("code")[0].childNodes[0].nodeValue;
                if (code != 0)
                    EmpiresIndex.setValueFromCookie('remember', pageIndex.user.name + '|' + code);
                else
                    EmpiresIndex.removeValueFromCookie('remember');
            } else {
                EmpiresIndex.removeValueFromCookie('remember');
            }

            //create a panel to select the possible games
            //mainGamesSelection
            //mainGamesDemo
            $("#JoinGameScreen .ScreenRight #JoinGameScreenGames").html("");
            for (var i = 0; i < this.games.length; i++) { 

                if (!this.games[i]) continue;

                //skip games that are not open, and are not played by the player
                var gameIsOpenOrPlayed = this.games[i].isPlayed || this.games[i].gameStatus < 3;
                if (!gameIsOpenOrPlayed) continue;

                var gameDiv = $(document.createElement("div"));
                gameDiv.addClass("gameImage");
                gameDiv.css("background-image", "url('" + this.games[i].imageUrl + "')");
               

                //create the login Button 
                if (this.games[i].isPlayed && this.games[i].gameStatus > 0 && this.games[i].gameStatus < 4) {
                    var loginButton = $(document.createElement("input"));
                    loginButton.addClass("LoginToGame");
                    loginButton.attr('type', 'button').attr('value', labels.MULLOGIN).addClass("gamebuttons");
                    gameDiv.append(loginButton);
                    
                    (function createGameClosure(game: Game, loginButton: JQuery, gameDiv : JQuery, userId : number) {
                        //gameDiv.bind("click", function () { console.log(game.url); });
                        loginButton.bind("click", function (event) { event.stopPropagation(); pageIndex.loginToGame(game, userId); });
                        gameDiv.bind("click", function () { pageIndex.loginToGame(game, userId); });
                    })(this.games[i], loginButton, gameDiv, this.user.id);
                }
               
                //create the join button
                //permit registration if game is open for registration (1) and not yet running and closed (3)
                if (!this.games[i].isPlayed && this.games[i].gameStatus > 0 && this.games[i].gameStatus < 3)
                {
                    var joinButton = $(document.createElement("input"));
                    joinButton.addClass("RegisterToGame");
                    joinButton.attr('type', 'button').attr('value', labels.registerGame).addClass("gamebuttons");
                    gameDiv.append(joinButton);

                    (function createGameClosure(game: Game, joinButton: JQuery, gameDiv : JQuery) {
                        //gameDiv.bind("click", function () { console.log(game.url); });
                        joinButton.bind("click", function (event) { event.stopPropagation(); pageIndex.registerToGame(game); });
                        gameDiv.bind("click", function () { pageIndex.registerToGame(game); });
                    })(this.games[i], joinButton, gameDiv);
                }

                //is a relict. Is just kept and set to invisible so that Finished games (display;inline-block) have the GalaxyName in the right row
                var rulesButton = $(document.createElement("input"));
                rulesButton.attr('type', 'button').attr('value', labels.rules).addClass("gamebuttons");
                
                rulesButton.css("visibility", "hidden");
                gameDiv.append(rulesButton);


                //if (this.games[i].isPlayed) gameDiv.addClass("gameIsPlayed");


                var gameName = $(document.createElement("p"));
                gameName.addClass("gameFont");
                gameName.html(this.games[i].galaxyName);
                gameDiv.append(gameName);

                
                var gameDescDiv = $("<div/>");
                gameDescDiv.css("position", "absolute");
                gameDescDiv.css("bottom", "0");
                gameDescDiv.css("left", "0");
                var gameComingSoon = $(document.createElement("p"));
                gameComingSoon.addClass("gameFontMed");
                var gcsSpan = $("<span/>", { "class": "gcs" }); //games used starting positions
                gcsSpan.data("gstat", this.games[i].gameStatus);
                var startSpan = $("<span/>"); //games used starting positions
                var startSpanIsSet = false;

                if (this.games[i].gameStatus == 0) {
                    gcsSpan.text(labels.gamesCS);                    
                }
                if (this.games[i].gameStatus == 1) {
                    //gameComingSoon.html(labels.gamesStartAt + this.games[i].startingDate);
                    gcsSpan.text(labels.gamesStartAt);
                    startSpan.text(this.games[i].startingDate);
                    startSpanIsSet = true;
                }
                if (this.games[i].gameStatus == 2) {
                    //gameComingSoon.html(labels.gamesStarted + this.games[i].startingDate);
                    gcsSpan.text(labels.gamesStarted);
                    startSpan.text(this.games[i].startingDate);
                    startSpanIsSet = true;
                }
                if (this.games[i].gameStatus == 3) {
                    //gameComingSoon.html(labels.gamesRunning);
                    gcsSpan.text(labels.gamesRunning);
                }
                if (this.games[i].gameStatus == 4) {
                    //gameComingSoon.html(labels.gamesFinished);
                    gcsSpan.text(labels.gamesFinished);
                }
                gameComingSoon.append(gcsSpan);

                if (startSpanIsSet) { gameComingSoon.append($('<br>')).append(startSpan);}
                gameDescDiv.append(gameComingSoon);
                gameDiv.append(gameDescDiv);
                

                $("#JoinGameScreen .ScreenRight #JoinGameScreenGames").append(gameDiv);

                var gameUrl = this.games[i].url;

                //gameDiv.setAttribute('style',"width: 300px; height: 200px;");



            }

            //$("#mainGamesSelection").css("display", "block");
            //$("#mainGamesDemo").css("display", "none");

        }

        //#region User
        userExists(id) {
            if (this.user && this.user.id == id)
                return true;
            else
                return false;
        }

        userAdd(XMLuser) {
            var id = XMLuser.getElementsByTagName("id")[0].childNodes[0].nodeValue;
            this.user = new User(id);

            this.user.update(XMLuser);
        }

        createUpdateUserElement(XMLobject) {
            var objectXMLId = XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue
            if (this.userExists(objectXMLId)) // if ship exists, update it.
                this.user.update(XMLobject);
            else // if it does not yet exists, add it
                this.userAdd(XMLobject);
        }
        //#endregion

        //#region Games
        gameExists(id) {
            if (this.games[parseInt(id)] != null)
                return true;
            else
                return false;
        }

        gameAdd(XMLobject) {
            var id = XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue;
            var newGame = new Game(id);

            //add to games array
            this.games[parseInt(id)] = newGame;

            //get all game Data out of the XMLobject
            newGame.update(XMLobject);
        }

        createUpdateGameElement(XMLobject) {
            var objectXMLId = XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue

            if (this.gameExists(objectXMLId)) // if game exists, update it.
                this.games[objectXMLId].update(XMLobject);
            else // if it does not yet exists, add it
                this.gameAdd(XMLobject);
        }
        //#endregion


        languageChanged(selectedValue: string) {
            if (pageIndex.user != null) {
                pageIndex.updateUserLanguage(selectedValue);
            }
            EmpiresIndex.setValueFromCookie('language', selectedValue);            
            labels.loadAndSwitch(selectedValue, pageIndex.user != null);
        }             

        loginFail() {
            $("#loginFail").css("display", "block");
        }

        login(username : string , password : string  , remember : number, autologin = false) {

            var AutoLogin = autologin;

            $.ajax("Authentication.aspx", {
                "type": "POST",
                "data": {
                    "action": "login",
                    "username": username,
                    "userpassword": password,
                    "rememberX": remember
                }
            }).done(function (msg) {
                    //some code which is called when the ajax was successfully sent...
                    if (typeof (msg.getElementsByTagName) != "undefined") {

                        var check = msg.getElementsByTagName("id");
                        if (check.length == 0) { pageIndex.loginFail(); return; }

                        var val = check[0].childNodes[0].nodeValue;
                        if (!val || val == null || val == 0) { pageIndex.loginFail(); return; }

                        pageIndex.readIndexData(msg);
                        pageIndex.LoggedIn();
                        $("#username").val('');
                        $("#password").val('');
                        $("#loginFail").css("display", "none");

                        console.log("AutoLogin " + AutoLogin);

                        if (AutoLogin) {
                            for (var i = pageIndex.games.length - 1; i >= 0; i--) {
                                if (!pageIndex.games[i]) continue;

                                //skip games that are not open, and are not played by the player
                                if (!pageIndex.games[i].isPlayed && pageIndex.games[i].gameStatus > 0 && pageIndex.games[i].gameStatus < 3) {

                                    pageIndex.games[i].register(pageIndex.user.defaultInGameName,true,true);                                                                       
                                    break;                                    
                                }                              
                            }

                        }
                    }
                    else {
                        console.log("pageIndex.loginFail();");
                        pageIndex.loginFail();
                    }

            });

        }

        loginButton() {
            //ToDo 
            //- validate html fields
            //- send passord encrypted!!!
            console.log("pageIndex.loginButton();");

            pageIndex.login($("#username").val().toString(), $("#password").val().toString(), $("#rememberCheckBox").is(':checked') ? 1 : 0);
            return false;            
        }


        recovery(email: string) {
            //if (!this.registerCheck.emailCheck || !this.registerCheck.inGameNameCheck || !this.registerCheck.nameCheck) return;
            /*
            grecaptcha.ready(function () {
                grecaptcha.execute('6LeJYPoSAAAAAK6ouXJLTGfFvybgqivmzlHJgOQs', { action: 'http://localhost:55482' }).then(function (token) {
                         ...
                      });
                        });
        */
            $.ajax("Authentication.aspx", {
                "type": "POST",
                "data": {
                    "action": "recoverUser",
                    "email": email,        
                    "languageX": EmpiresIndex.getLang(),                   
                    "recapChal": Recaptcha.get_challenge(),
                    "recapResp": Recaptcha.get_response()
                }
            }).always(function (msg) {
                console.log(msg);

                //2 : email wrong
                if (msg == "2") {
                    $("#PasswordResetRequest").html(labels.recoveryEmailUnknown);
                    $("#PasswordResetRequest").css("display", "block");
                    $("#PasswordResetRequest").fadeOut(3000);
                    //alert('2 ' + msg);
                    Recaptcha.create(recaptchaPublic,
                        "reCapInput2",
                        {
                            "theme": "blackglass",
                            "callback": Recaptcha.focus_response_field,
                            "lang": EmpiresIndex.getLang()
                        });
                    //alert('1 ' + msg);
                    $("#PasswordResetRequest").fadeOut(3000);
                    return;
                }


               
                //1 captcha wrong
                if (msg == "1") {

                    $("#PasswordResetRequest").html(labels.registerCaptchaError);
                    $("#PasswordResetRequest").css("display", "block");
           
                    Recaptcha.create(recaptchaPublic,
                        "reCapInput2",
                        {
                            "theme": "blackglass",
                            "callback": Recaptcha.focus_response_field,
                            "lang": EmpiresIndex.getLang()
                        });
                    //alert('1 ' + msg);
                    $("#PasswordResetRequest").fadeOut(3000);
                    return;
                }

                

                // email send

                //alert('3 ' + msg);
                $("#PasswordResetRequest").html(labels.recoveryEmailSent);
                $("#PasswordResetRequest").css("display", "block"); 
                $("#PasswordResetRequest").fadeOut(5000);

            });

        }

        recoveryButton() {
            //ToDo 
            //- validate html fields
            //- send password encrypted via https
            console.log("pageIndex.recoveryButton();");

            pageIndex.recovery($("#recoveryEmail").val().toString());
            return false;
        }

        rememberCheckBox() {

            var cookieData = getValueFromCookie('remember');
            var userName = cookieData.split('|')[0];
            var cookieValue = cookieData.split('|')[1];          

            if (!$("#rememberCheckBox").is(':checked') && cookieData && userName && cookieValue) {

                $.ajax("Authentication.aspx", {
                    "type": "POST",
                    "data": {
                        "action": "removeRememberCookie",
                        "username": userName,
                        "cookieValue": cookieValue
                    }
                });

                removeValueFromCookie('remember');
            }
        }

        removeAllCookies() {
            $.ajax("Authentication.aspx", {
                "type": "POST",
                "data": {
                    "action": "removeAllCookies"                    
                }
            });
        }

        loginDemoButton() {
            window.location.href = "./index.aspx?action=demo";
            
        }

        loginDemo2Button() {
            window.location.href = "./index.aspx?action=demo2";
            
        }

        checkLogin() {
            $.ajax("Authentication.aspx", {
                "type": "POST",
                "data": {
                    "action": "checkLogin"
                }
            }).done(function (msg) {
                //check if answer contains a user:
                if (typeof (msg.getElementsByTagName) != "undefined") {

                    var userId = msg.getElementsByTagName("id");
                    var length = userId.length;

                    if (length == 0) return;
                    if (!userId[0] || userId[0] == 0) return;

                    pageIndex.readIndexData(msg);
                    pageIndex.LoggedIn();


                }
            }
           );
        }        

        RefreshCount(game: Game) {
            $("#PlayersInRegionCount").text("?");            
            $.ajax("Authentication.aspx", {
                type: "GET",
                async: true,
                data: {
                    "action": "getStartingRegionCount",
                    "GamedId": game.id,
                    "RegionName": $("#SettingsScreenStartRegionJoin").val()
                }
            }).always(function (msg) {
                    $("#PlayersInRegionCount").text(msg);
                });
        }

        registerToGame(game: Game) {
            this.RefreshCount(game);

            var registerGame = game;

            $('#JoinGameDescriptionScreenTitle').text(labels.rulesFor + game.galaxyName);
            $('#JoinGameDescriptionContent').empty();
            $('#JoinGameDescriptionContent').append($(labels.description1));

            $('#JoinGameDescriptionScreen .yesButton').click((e: JQueryEventObject) => { pageIndex.CloseScreens(); registerGame.register(); });
            $('#JoinGameDescriptionScreen').css('display','inline-block');
            location.href = "#JoinGameDescriptionContent";

            //Starting Region            
            var StartRegionInput = $("#SettingsScreenStartRegionJoin");           
            StartRegionInput.change(function () {
                $("#PlayersInRegionCount").text("?");
                pageIndex.user.StartRegion = $("#SettingsScreenStartRegionJoin").val().toString();                
                $.ajax("Authentication.aspx", {
                    type: "GET",
                    async: true,
                    data: {
                        "action": "getStartingRegionCount",
                        "GamedId": registerGame.id,
                        "RegionName": $("#SettingsScreenStartRegionJoin").val().toString()
                    }
                }).always(function (msg) {
                    console.log(msg);
                    if (msg == 0) console.log("nix");
                    $("#PlayersInRegionCount").text(msg);
                    console.log("nix1");
                    });
            });


        }

        registerCheckNameResult(msg) {
            var errorSpan = $('#errorSpan', this.registerCheck.registerPanel);
            if (msg.responseText != "undefined") {
                if (msg == "1") {                    
                    pageIndex.registerCheck.nameCheck = true;
                    this.registerCheckOk();
                    return;
                }
            }
            errorSpan.text(labels.registerNameError2); //labels.seetingsPWRepeatError
            errorSpan.css("display", "block");
            errorSpan.fadeOut(3000);     
        }

        registerCheckName() {

            if ($("#registerName").val() == '') {
                $("#registerName", this.registerCheck.registerPanel).attr("required", "required");
                var errorSpan = $('#errorSpan', this.registerCheck.registerPanel);
                errorSpan.text(labels.registerNameError); //labels.seetingsPWRepeatError
                errorSpan.css("display", "block");
                errorSpan.fadeOut(3000);     
                return;
            }

            $.ajax("Authentication.aspx", {
                "type": "POST",
                "data": {
                    "action": "checkUniqueName",
                    "username": $("#registerName").val()
                }
            }).always(function (msg) {
                pageIndex.registerCheckNameResult(msg);
            });             
        }

        registerCheckPW() {

            if ($("#registerPassword").val() == '') {
                $("#registerPassword", this.registerCheck.registerPanel).attr("required", "required");
                return;
            }

            pageIndex.registerCheck.pwCheck = true;
            this.registerCheckOk();
        }

        registerCheckEmailresult(msg) {
            var errorSpan = $('#errorSpan', this.registerCheck.registerPanel);
            if (msg.responseText != "undefined") {
                if (msg == "1") {                                      
                    pageIndex.registerCheck.emailCheck = true;
                    this.registerCheckOk();
                    return;
                }
            }
            errorSpan.text(labels.registerEmailError2); //labels.seetingsPWRepeatError
            errorSpan.css("display", "block");   
            errorSpan.fadeOut(3000);     
        }

        registerCheckEmail() {         
            if ($("#registerEmail").val() == '' || !EmpiresIndex.isEmail($("#registerEmail").val()) ) {
                $("#registerEmail", this.registerCheck.registerPanel).attr("required", "required");
                var errorSpan = $('#errorSpan', this.registerCheck.registerPanel);
                errorSpan.text(labels.registerEmailError); //labels.registerEmailError
                errorSpan.css("display", "block");
                errorSpan.fadeOut(3000);     
                return;
            }

            $.ajax("Authentication.aspx", {
                "type": "POST",
                "data": {
                    "action": "checkUniqueEmail",
                    "username": $("#registerEmail").val()
                }
            }).always(function (msg) {
                pageIndex.registerCheckEmailresult(msg);
            });            
        }

        registerCheckInGame() {
            if ($("#defaultInGameName").val() == '') {
                $("#defaultInGameName", this.registerCheck.registerPanel).attr("required", "required");
                return;
            }
           
            pageIndex.registerCheck.inGameNameCheck = true;
            this.registerCheckOk();
        }

        registerDone() {

            console.log($(".g-recaptcha").data("callback"));

            this.registerCheck.nameCheck = false;
            this.registerCheck.pwCheck = false;
            this.registerCheck.emailCheck = false;
            this.registerCheck.inGameNameCheck = false;

            var errorSpan = $('#errorSpan', this.registerCheck.registerPanel);
            errorSpan.text('');
            errorSpan.css("display", "none");

            $("#registerName", this.registerCheck.registerPanel).removeAttr('required');​​​​​
            $("#registerPassword", this.registerCheck.registerPanel).removeAttr('required');​​​​​
            $("#registerEmail", this.registerCheck.registerPanel).removeAttr('required');​​​​​
            $("#defaultInGameName", this.registerCheck.registerPanel).removeAttr('required');​​​​​

            this.registerCheckPW();
            this.registerCheckInGame();
            this.registerCheckName();            
            this.registerCheckEmail();
        }

        RegisterCheckPostEvent(msg) {

            if (msg == "1") {
                var errorSpan = $('#errorSpan');
                errorSpan.text(labels.registerCaptchaError); //labels.seetingsPWRepeatError
                errorSpan.css("display", "block");
                Recaptcha.create(recaptchaPublic,
                    "reCapInput",
                    {
                        "theme": "blackglass",
                        "callback": Recaptcha.focus_response_field,
                        "lang": EmpiresIndex.getLang()
                    });
                return;
            }
            else {
                pageIndex.CloseScreens();
            }
            pageIndex.login($("#registerName").val().toString(), $("#registerPassword").val().toString(), $("#rememberCheckBox").is(':checked') ? 1 : 0, true);
        }

        //called after each asnyc ajax, and checks if the registration is complete...
        registerCheckOk() {
            if (!this.registerCheck.emailCheck || !this.registerCheck.inGameNameCheck || !this.registerCheck.nameCheck) return;

            $.ajax("Authentication.aspx", {
                "type": "POST",
                "data": {
                    "action": "createUser",
                    "username": $("#registerName").val(),
                    "userpassword": $("#registerPassword").val(),
                    "email": $("#registerEmail").val(),
                    "languageX": EmpiresIndex.getValueFromCookie('language') || userLang,
                    "defaultInGameName": $("#defaultInGameName").val(),
                    //defaultStartingRegion:  $("#registerStartRegion").val(),
                    "defaultStartingRegion": 1,
                    "recapChal": "NONE",
                    "recapResp": grecaptcha.getResponse()
                }
            }).always(function (msg) {        
                pageIndex.RegisterCheckPostEvent(msg);
            });
            
        }

        

        registerToEmpiresInSpace() {
            /*
            Recaptcha.create(recaptchaPublic,
                "reCapInput",
                {
                    "theme": "blackglass",
                    callback: Recaptcha.focus_response_field,
                    "lang": EmpiresIndex.getLang()
                });
            */
            var registerPanel = $("#RegisterScreen");
            this.registerCheck = { pwCheck: false, emailCheck: false, nameCheck: false, inGameNameCheck: false, registerPanel: registerPanel };

            /*
            $('.yesButton', registerPanel).click((e: MouseEvent) => { pageIndex.registerDone(); });
            $('.yesButton span', registerPanel).text(labels.ButtonRegister);
            $('.noButton', registerPanel).click((e: MouseEvent) => { $('input', registerPanel).val(''); this.CloseScreens(); });

            //Fix for IE: password inputs do not have the same width as text input 
            //$("input[type='password']", registerPanel).height($("input[type='text']", registerPanel).height());
            $("input[type='password']", registerPanel).width($("input[type='text']", registerPanel).width());
            */

        }

        recoverPassword() {

            
            if ($('#ForgotForm:hidden').length == 0) {
                //there is no hidden element, so hide the currently shown form
                $('#ForgotForm').css('display','none');
                return;
            }
            Recaptcha.create(recaptchaPublic,
                "reCapInput2",
                {
                    "theme": "blackglass",
                    callback: Recaptcha.focus_response_field,
                    "lang": EmpiresIndex.getLang()
                });

            $('#ForgotForm').css('display', 'block');
        }


        showHelp(helpText: string) {

            $("#HelpScreen div.ScreenRight>span").text(helpText);
            $("#HelpScreen").css("display", "inline-block");     
            document.getElementById("HelpScreen").scrollIntoView();
        }


        updateUserLanguage(newLanguageValue : string) {
            pageIndex.user.language = newLanguageValue;

            $.ajax("Authentication.aspx", {
                "type": "POST",
                "data": {
                    "action": "setUserLanguage",
                    "languageX": newLanguageValue
                }
            });
        }


        updateUserEmail(newEmailValue: string, oldPassword: string, userPanel: JQuery):boolean {

            var msg = $.ajax("Authentication.aspx", {
                "type": "POST",
                "async": false,
                "data": {
                    "action": "updateUserEmail",
                    "username": pageIndex.user.name,
                    "userpassword": oldPassword,
                    "newEmail": newEmailValue
                }
            });
           
            var errorSpan = $('#errorSpan', userPanel);
            if (msg.responseText != "undefined") {
                if (msg.responseText == "1") {
                    pageIndex.user.email = newEmailValue;
                    errorSpan.css("display", "none");
                    return true;
                }
                
               
            }        
                
            errorSpan.text(labels.settingsPWwrong); //labels.seetingsPWRepeatError
            errorSpan.css("display", "block");
            return false;
        }

        checkEmailChange(): boolean {
            $('#SettingsPasswordMissing').css('display',"block");
            var pwInput = $("#SettingsScreenRegisterPassword");
            if (pwInput.val() == '') {
                pwInput.attr("required", "required");                
                return false;
            }
            return true;
        }

        updateUserPasswords (oldPassword: string, newPassword: string, userPanel: JQuery): boolean {

            var msg = $.ajax("Authentication.aspx", {
                "type": "POST",
                "async": false,
                "data": {
                    "action": "updateUserPW",
                    "username": pageIndex.user.name,
                    "userpassword": oldPassword,
                    "newUserpassword": newPassword,
                    "rememberX": $("#rememberCheckBox").is(':checked') ? 1 : 0
                }
            });

            
            if (msg.responseText != "undefined") {
                var resp = msg.responseText;
                var result = resp.split('|')[0];
                var cookieHash = resp.split('|')[1];
                var errorSpan = $('#errorSpan', userPanel);

                if (result == "1") {
                    if ($("#rememberCheckBox").is(':checked') && resp.split('|')[1] && resp.split('|')[1] != '')
                        EmpiresIndex.setValueFromCookie('remember', pageIndex.user.name + '|' + resp.split('|')[1]);
                    errorSpan.css("display", "none");
                    return true;
                }

                
                errorSpan.text("Falsches Passwort");
                errorSpan.css("display", "block");
                return false;
            }
            return true;
        }

        checkSettingsPasswords(userPanel: JQuery): boolean{

            var retValue = true;
            var errorSpan = $('#SettingsScreen .errorSpan', userPanel);

            var pwInput = $("#registerPassword", userPanel);
            if (pwInput.val() == '') {
                pwInput.attr("required", "required");
                retValue = false;
            }

            var pwNewInput = $("#newRegisterPassword", userPanel);
            if (pwNewInput.val() == '') {
                pwNewInput.attr("required", "required");
                retValue = false;
            }

            var pwNewRepeatInput = $("#newRepeatRegisterPassword", userPanel);
            if (pwNewRepeatInput.val() == '') {
                pwNewRepeatInput.attr("required", "required");
                retValue = false;
            }

            if (retValue) {
                if (pwNewRepeatInput.val() != pwNewInput.val()) {
                    
                    errorSpan.text(labels.settingsPWRepeatError); 
                    errorSpan.css("display", "block");
                    pwNewRepeatInput.val("");
                    pwNewInput.val("");
                }
            }

            return retValue;
        }

        settingsDone(): boolean {
            var userPanel: JQuery = $("#SettingsScreen");
            var emailInput = $("#SettingsScreenRegisterEmail", userPanel);
            if (emailInput.val() != "" && emailInput.val() != pageIndex.user.email) {
                if (!this.checkEmailChange()) return false;

                if (!this.updateUserEmail(emailInput.val().toString(), $("#SettingsScreenRegisterPassword", userPanel).val().toString(), userPanel)) return false;
            } 
            var pwNewInput = $("#SettingsScreenNewRegisterPassword", userPanel);
            var pwNewRepeatInput = $("#SettingsScreenNewRepeatRegisterPassword", userPanel);
            var pwNewRepeatInputText = pwNewRepeatInput.val();
            var pwNewInputText = pwNewInput.val();
            if (pwNewRepeatInputText != '' || pwNewInputText != '') {
                if (!this.checkSettingsPasswords(userPanel)) return false;
                if (!this.updateUserPasswords($("#SettingsScreenRegisterPassword", userPanel).val().toString(), pwNewRepeatInput.val().toString(), userPanel)) return false;
            }

            return true;
        }
        

        /*
        userSettings Create window
        //forgotten PW 
            
            var forgottenPWText = $('<td/>').append($("<span/>", { "text": "Passwort vergessen " }));
            var buttonForgottenPW = $('<button/>', { "class": "userSettings" });
            buttonForgottenPW.text("Neues zuschicken");
            buttonForgottenPW.button();
            var forgottenPWHelp = $("<button/>", { "text": labels.settingsHelp, "class": "help" });
            forgottenPWHelp.button();
            forgottenPWHelpRow.append(forgottenPWText).append($('<td/>', { "class": "tdAlignRight" }).append(buttonForgottenPW)).append($('<td/>').append(forgottenPWHelp));
            table.append(forgottenPWHelpRow);
            */


        loginToGameResult(game: Game, msg, userId : number) {
            if (!msg) return;
            
            if (msg.responseText == "0") {
                return;
            }
            //window.location.replace("m.contact.html");
            var path = game.url + "?login=" + msg.responseText + "&id=" + userId.toString();
            window.location.href = path;
            //window.open(path);
            //window.location.replace(path);
            //setTimeout( () => { document.location.href = path }, 500);
            //window.location.assign(path)
            //return false;
           
        }

        
        loginToGame(game: Game, userId : number) {
            console.log('loginToGame ' + game.id);
            $.ajax("Authentication.aspx", {
                "type": "POST",
                "data": {
                    "action": "loginToGame",
                    "game": game.id,
                    "userId": userId.toString()
                }
            }).always(function (msg) {
                pageIndex.loginToGameResult(game, msg, userId);               
            }
            );


        }


        logout() {
            pageIndex.CloseScreens();
            pageIndex.ClearInput();
            $.ajax("Authentication.aspx", {
                "type": "POST",
                "data": {
                    "action": "logout"
                }
            }).done(function (msg) { });

            this.LoggedOut();

        }

        CloseScreens() {
            //$(".Screen").css("display", "none");
            $(".Screen").removeClass("Show");
        }

        CloseHelp() {
            $("#HelpScreen").css("display", "none");
        }

        ButtonContinueState() {
            $("#Login").removeClass("TextDisabled");
            if (this.user == null) return;            
            for (var i = 0; i < this.games.length; i++) {
                if (!this.games[i]) continue;

                //skip games that are not open, and are not played by the player
                if (this.games[i].isPlayed) return;              
            }

            $("#Login").addClass("TextDisabled");
        }

        ButtonJoinGameState() {
            $("#NewAccount").removeClass("TextDisabled");
            if (this.user == null) return;
            
            for (var i = 0; i < this.games.length; i++) {
                if (!this.games[i]) continue;

                //skip games that are not open, and are not played by the player
                if (this.games[i].gameStatus == 1 || (this.games[i].gameStatus == 2 && !this.games[i].isPlayed) ) return;              
            }

            $("NewAccount").addClass("TextDisabled");
        }

        LoggedIn() {
            $("#Logout").css("display", "block");         
            //$("#Top div#newLanguageSelect").css("display", "none");
            $("#Settings").removeClass("TextDisabled");
            this.CloseScreens();        
            labels.setUserButtons(true); 
            this.ButtonContinueState();
            this.ButtonJoinGameState();
            this.LoginSetSettingsData();
        }

        ClearInput() {

            //Login
            $("#username").val('');
            $("#password").val('');
            $("#recoveryEmail").val('');

            //Register
            $("#registerName").val('');
            $("#registerPasswordText    ").val('');
            $("#registerEmailText").val('');
            $("#registerIngameNameText").val('');

            //Settings
            $("#SettingsScreenRegisterName").html('');
            $("#SettingsScreenRegisterPassword").val('');
            $("#SettingsScreenNewRegisterPassword").val('');
            $("#SettingsScreenNewRepeatRegisterPassword").val('');
            $("#SettingsScreenRegisterEmail").val('');
            $("#SettingsScreenDefaultInGameName").val('');
            $("#SettingsScreenRegisterEmail").val('');
           
        }

        LoggedOut() {     
            $("#Logout").css("display", "none");          
            //$("#Top div#newLanguageSelect").css("display", "block");
            $("#Settings").addClass("TextDisabled");
            this.user = null;
            labels.setUserButtons(false);
            this.ButtonContinueState();
            this.ButtonJoinGameState();
        }

        LoginClicked() {
            if (this.user != null) {
                //alert("Try to Continue with game...");  
                for (var i = this.games.length -1; i >= 0 ; i--) {
                    if (!this.games[i]) continue;

                    //skip games that are not open, and are not played by the player
                    if (this.games[i].isPlayed) {
                        pageIndex.loginToGame(this.games[i], this.user.id);
                        break;
                    }
                }
                         
            } else {
                $("#LoginScreen").css("display", "inline-block");
                document.getElementById("LoginScreen").scrollIntoView();
            }
        }

        NewAccountClicked() {
            if (this.user != null) {
                $("#JoinGameScreen").css("display", "inline-block")
                document.getElementById("JoinGameScreen").scrollIntoView(); 
            } else {
                $("#RegisterScreen").css("display", "inline-block");
                document.getElementById("RegisterScreen").scrollIntoView(); 
                this.registerToEmpiresInSpace();
            }

        }

        //set the buttons in the HelpScreen Screen
        OnLoadSetHelpScreenButtons() {
            $("#HelpScreen button").click(() => {
                $("#HelpScreen").css("display","none");  });
        }

        LoginSetSettingsData() {
            
            //Name
            $("#SettingsScreenRegisterName").text(this.user.name);

            
                       
            //Email
            var emailInput = $('#SettingsScreenRegisterEmail');
            emailInput.val(this.user.email);         

            //IngameName
            $("#SettingsScreenDefaultInGameName").val(this.user.defaultInGameName);         

            $("#SettingsScreenStartRegion").val(this.user.StartRegion);      
            $("#SettingsScreenStartRegionJoin").val(this.user.StartRegion);      
            
        }

        //set the buttons in the Settings Screen
        OnLoadSetSettingsButtons() {
            
            //IngameName
            var inGameHelp = $("#SettingsScreenIngameHelp");
            var inGameInput = $("#SettingsScreenDefaultInGameName");          
            inGameHelp.click((event) => { pageIndex.showHelp(labels.settingsDefaultNameHelp); });
            inGameInput.change(function () {
                pageIndex.user.defaultInGameName = inGameInput.val().toString();
                //Ships.UserInterface.refreshMainScreenStatistics(selectedShip);
                $.ajax("Authentication.aspx", {
                    type: "GET",
                    async: true,
                    data: {
                        "action": "setUserDefaultName",
                        "defName": inGameInput.val().toString()
                    }
                });
            });

            //Starting Region
            var StartRegionHelp = $(".SettingsScreenStartRegionHelp");
            var StartRegionInput = $("#SettingsScreenStartRegion");
            StartRegionHelp.click((event) => { pageIndex.showHelp(labels.settingsStartRegionHelp); });
            StartRegionInput.change(function () {
                pageIndex.user.StartRegion = StartRegionInput.val().toString();
                //Ships.UserInterface.refreshMainScreenStatistics(selectedShip);
                $.ajax("Authentication.aspx", {
                    type: "GET",
                    async: true,
                    data: {
                        "action": "setUserStartingRegion",
                        "defName": StartRegionInput.val().toString()
                    }
                });
            });


            var cookieData = getValueFromCookie('remember');
            var userName = cookieData.split('|')[0];
            var cookieValue = cookieData.split('|')[1];

            if (cookieData && userName && cookieValue) {
                //remove Cookie
                var cookieText = $('<td/>').append($("<span/>", { "text": labels.settingsDeleteCookie, "class": "sdc" })); //settingsDeleteCookie
                var buttonCookies = $('#SettingsScreenDeleteCookie');
                
                var cookieButtonHelp = $('#SettingsScreenDeleteCookieHelp');
                cookieButtonHelp.click((event) => { pageIndex.showHelp(labels.settingsDeleteCookieHelp); });             

                buttonCookies.bind("click", function () { $("#rememberCheckBox").prop('checked', false); pageIndex.rememberCheckBox(); });
            }


            //remove all Cookies
            var allCookieText = $('<td/>').append($("<span/>", { "text": labels.settingsDeleteAllCookies, "class": "sdac" }));
            var buttonAllCookies = $('#SettingsScreenDeleteAllCookie');         
            buttonAllCookies.bind("click", function () { pageIndex.removeAllCookies(); });

            var allCookieHelp = $("#SettingsScreenDeleteAllCookieHelp");
            allCookieHelp.click((event) => { pageIndex.showHelp(labels.settingsDeleteAllCookiesHelp); });

            //forgotten PW 
            /*
            var forgottenPWText = $('<td/>').append($("<span/>", { "text": "Passwort vergessen " }));
            var buttonForgottenPW = $('<button/>', { "class": "userSettings" });
            buttonForgottenPW.text("Neues zuschicken");
            buttonForgottenPW.button();
            var forgottenPWHelp = $("<button/>", { "text": labels.settingsHelp, "class": "help" });
            forgottenPWHelp.button();
            forgottenPWHelpRow.append(forgottenPWText).append($('<td/>', { "class": "tdAlignRight" }).append(buttonForgottenPW)).append($('<td/>').append(forgottenPWHelp));
            table.append(forgottenPWHelpRow);
            */

            var YesButton = $('#SettingsScreen .yesButton');
           
            YesButton.click((e: JQueryEventObject) => { if (pageIndex.settingsDone()) this.CloseScreens(); });
          

            //correct width of nameSpan and Language-Selector:
            //var nameInput = 
            //nameInput.width(pwInput.width());
           
            var SettingsScreenStartRegionCountHelpHelp = $(".SettingsScreenStartRegionCountHelp");
            SettingsScreenStartRegionCountHelpHelp.click((event) => { pageIndex.showHelp(labels.SettingsScreenStartRegionCountHelp); });
            
        }

        //set the buttons in the Register Screen
        OnLoadSetRegisterButtons() {
            
            //Name                   
            var nameHelp = $("#registerNameHelp");
            nameHelp.click((event) => { pageIndex.showHelp(labels.registerNameHelp); });

            //Passwort
            var pwHelp = $("#registerPasswordHelp");
            pwHelp.click((event) => { pageIndex.showHelp(labels.registerPasswordHelp); });
          
            //Email
            var emailHelp = $("#registerEmailHelp");
            emailHelp.click((event) => { pageIndex.showHelp(labels.registerEmailHelp); });


            //IngameName
            var inGameHelp = $("#registerIngameNameHelp");
            inGameHelp.click((event) => { pageIndex.showHelp(labels.settingsDefaultNameHelp); });

            //set checks = false
            var registerPanel = $("#RegisterScreen");
            this.registerCheck = { pwCheck: false, emailCheck: false, nameCheck: false, inGameNameCheck: false, registerPanel: registerPanel };

            //buttonEvents
            var yesButton = $('.yesButton', registerPanel);

            $('.yesButton', registerPanel).click((e: JQueryEventObject) => { pageIndex.registerDone(); });
            $('.yesButton span', registerPanel).text(labels.ButtonRegister);
            $('.noButton', registerPanel).click((e: JQueryEventObject) => { $('input', registerPanel).val(''); this.CloseScreens(); });

            //Fix for IE: password inputs do not have the same width as text input 
            //$("input[type='password']", registerPanel).height($("input[type='text']", registerPanel).height());
            //$("input[type='password']", registerPanel).width($("input[type='text']", registerPanel).width());

        }

        setHeight() {
            var height = $(window).height();
            //console.log(height);

            var MainMenuTopSpace = 300;
            var ScreenTopSpace = 200;
            var ScreenTopSpaceLogo = 0;
            var MinHeight = 35;
            //height 868 -> MainMenuTopSpace 300, ScreenTopSpace 200

           

            MainMenuTopSpace = height - 568;
            if (MainMenuTopSpace < MinHeight) MainMenuTopSpace = MinHeight;

            ScreenTopSpace = height - 668;
            if (ScreenTopSpace < MinHeight) ScreenTopSpace = MinHeight;

            ScreenTopSpaceLogo = height - 785;
            if (ScreenTopSpaceLogo < MinHeight) ScreenTopSpaceLogo = MinHeight;

            var marginTop = Math.min(140, ScreenTopSpace - 35);
            $('.MainMenuTopSpace').css("height",MainMenuTopSpace.toString() + 'px' );
            $('.ScreenTopSpace').css("height", ScreenTopSpace.toString() + 'px');
            $('.ScreenTopSpaceLogo').css("height", ScreenTopSpaceLogo.toString() + 'px');


            $('#MainMenu').css("margin-top", (-marginTop).toString() + 'px');
        }

        SelectedLanguage(): string {
            return EmpiresIndex.getValueFromCookie('language') || pageIndex && pageIndex.user && pageIndex.user.language || userLang;
        }

        SetLanguage() {
            //read user language from the cookie. If no Cookie is present, try to get it from the browser
            var selectedLanguage = pageIndex.SelectedLanguage();
            //selectedLanguage = document.cookie.substring(document.cookie.length - 2, document.cookie.length);
            //console.log('cookie selectedLanguage = ' + selectedLanguage);

            if (selectedLanguage) {

                //some browser give a cookie-value that does not exist. so check language after cookie-reading
                if (selectedLanguage != "en" && selectedLanguage != "de" && selectedLanguage != "fr") {
                    selectedLanguage = "en";
                    EmpiresIndex.setValueFromCookie('language', selectedLanguage);
                }

                $('#languageSelector').val(selectedLanguage);
                labels.loadAndSwitch(selectedLanguage, pageIndex.user != null);
            }
            else {
                //get the browser language
                selectedLanguage = window.navigator.language; //|| window.navigator.userLanguage;
                console.log('selectedLanguage = ' + selectedLanguage);
                if (selectedLanguage != "en" && selectedLanguage != "de" && selectedLanguage != "fr") {
                    selectedLanguage = "en";
                    EmpiresIndex.setValueFromCookie('language', selectedLanguage);
                }

                $('#languageSelector').val(selectedLanguage);
                labels.loadAndSwitch(selectedLanguage, pageIndex.user != null);

            }
        }

        openChangelog() {
            pageIndex.CloseScreens();
            $("#ChangelogScreen").css("display", "inline-block");
            document.getElementById("ChangelogScreen").scrollIntoView();
        }

        //Called during startup to initialize stuff
        myOnLoad() {
            window.addEventListener('resize', pageIndex.setHeight, false);       

            $("#languageSelector").change(function () { pageIndex.languageChanged($("#languageSelector").val().toString()); });

            //if a user cookie exists, try to login and set language according to cookie
            //if no user cookie exists, try fetching language cookie, set cookie according to that...
            var cookieFound = false;
            if (pageIndex.user == undefined) cookieFound = EmpiresIndex.tryRememberCookie();             
            if (!cookieFound) pageIndex.SetLanguage();


            $("#Login").bind("click", () => { pageIndex.CloseScreens(); pageIndex.LoginClicked(); });
            $("#NewAccount").bind("click", () => { pageIndex.CloseScreens(); pageIndex.NewAccountClicked(); });
            $("#Settings").bind("click", function () { if (pageIndex.user != null) { pageIndex.CloseScreens(); $("#SettingsScreen").css("display", "inline-block"); document.getElementById("SettingsScreen").scrollIntoView(); } });
            $("#About").bind("click", function () { pageIndex.CloseScreens(); $("#AboutScreen").addClass("Show"); /*$("#AboutScreen").css("display", "inline-block");*/ document.getElementById("AboutScreen").scrollIntoView(); });
            $("#Gallery").bind("click", function () { pageIndex.CloseScreens(); $("#GalleryScreen").css("display", "inline-block"); document.getElementById("GalleryScreen").scrollIntoView(); });
            $("#Logout").bind("click", function () { if (pageIndex.user != null) { pageIndex.logout(); } });
        
            
            $('#loginForm').submit(function () { pageIndex.loginButton(); return false; });     
            $('#recoveryForm').submit(function () { pageIndex.recoveryButton(); return false; });          
            //$("#loginButton").bind("click", function () { pageIndex.loginButton(); });
            
            $("#rememberCheckBox").bind("click", function () { pageIndex.rememberCheckBox(); });           
            
            $("#ForgotPassword").bind("click", function () { pageIndex.recoverPassword(); });     
            

            pageIndex.OnLoadSetRegisterButtons();
            pageIndex.OnLoadSetSettingsButtons();
            pageIndex.OnLoadSetHelpScreenButtons();



            //prepare swipebox:
            /* This is basic - uses default settings */
            //http://brutaldesign.github.io/swipebox/
            var x = <any>$('.swipebox');
            x.swipebox();
            pageIndex.setHeight();   
            
            $(document).ready(function () {
                $('#MainMenuRight').animate({ 'margin-left': '0px' }, 700);
            });
            
        }
    }
}

var pageIndex: EmpiresIndex.PageIndex;
pageIndex = new EmpiresIndex.PageIndex();

$(document).ready(pageIndex.myOnLoad);