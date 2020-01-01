/// <reference path="../References.ts" />


module EmpiresIndex {
   export class User {
        
        name = '';
        email = '';
        language: string;
        premium: boolean;
        premiumExpiry: Date;
        defaultInGameName: string;
        StartRegion: string;

        constructor(public id: number) {
        }

        update(XMLuser: Document) {
            console.log(XMLuser);
            this.email = XMLuser.getElementsByTagName("email")[0].childNodes[0].nodeValue;
            this.premiumExpiry = new Date(XMLuser.getElementsByTagName("premiumExpiry")[0].childNodes[0].nodeValue);
            this.defaultInGameName = XMLuser.getElementsByTagName("defaultInGameName")[0].childNodes[0].nodeValue;
            this.language = XMLuser.getElementsByTagName("language")[0].childNodes[0].nodeValue;
            this.name = XMLuser.getElementsByTagName("username")[0].childNodes[0].nodeValue;
            this.StartRegion = XMLuser.getElementsByTagName("StartRegion") && XMLuser.getElementsByTagName("StartRegion")[0] && XMLuser.getElementsByTagName("StartRegion")[0].childNodes && XMLuser.getElementsByTagName("StartRegion")[0].childNodes[0] && XMLuser.getElementsByTagName("StartRegion")[0].childNodes[0].nodeValue || '';
            pageIndex.languageChanged(this.language);
            $('#languageSelector').val(this.language);
        }
    }
            
    export class Game {
        galaxyName: string;
        rulesId: number;
        objectId: number;
        size: number;
        url: string;
        imageUrl: string;
        isPlayed: boolean;
        gameStatus: number;  // 0 : coming soon (with date) // 1: open for registration // 2: running // 3 : running and closed // stopped-finished
        startingDate: string;
        rule: string;
        maxUsers: number;
        currentUserCount: number;

        constructor(public id: number) {
        }

        update(XMLgame) {
            this.galaxyName = XMLgame.getElementsByTagName("galaxyName")[0].childNodes[0].nodeValue;
            this.imageUrl = XMLgame.getElementsByTagName("imageUrl")[0].childNodes[0].nodeValue;
            this.url = XMLgame.getElementsByTagName("url")[0].childNodes[0].nodeValue;
            this.isPlayed = XMLgame.getElementsByTagName("isPlayed")[0].childNodes[0].nodeValue == 1 ? true : false;
            this.gameStatus = parseInt(XMLgame.getElementsByTagName("gameStatus")[0].childNodes[0].nodeValue);
            this.startingDate = XMLgame.getElementsByTagName("startingDate") && XMLgame.getElementsByTagName("startingDate")[0] && XMLgame.getElementsByTagName("startingDate")[0].childNodes[0].nodeValue || '';
            this.rule = XMLgame.getElementsByTagName("rule")[0].childNodes[0].nodeValue;

            this.maxUsers = parseInt(XMLgame.getElementsByTagName("maxUsers")[0].childNodes[0].nodeValue,10);
            this.currentUserCount = parseInt(XMLgame.getElementsByTagName("currentUserCount")[0].childNodes[0].nodeValue,10);

        }  

        register(newIngameName?: string, tutorials?: boolean, autoLogin = false) {
            var AutoLogin = autoLogin;
            tutorials = true;
            var startingRegion = $("#SettingsScreenStartRegionJoin").val();
            console.log('registerToGame ' + this.id + '-' + pageIndex.user.language + '-' + newIngameName + '-' + tutorials + ' ; StartReg: ' + startingRegion);
            
            if (newIngameName == null) newIngameName = '';            
            var game = this;
            //pageIndex.user.language
            $.ajax("Authentication.aspx", {
                "type": "POST",
                "data": {
                    "action": "registerToGame",
                    "game": this.id,
                    "name": newIngameName,
                    "languageX": pageIndex.user.language,
                    "quests": tutorials,
                    "StartingRegion": startingRegion
                }
            }).done(function (msg) {
                if (typeof (msg.getElementsByTagName) != "undefined") {

                    console.log("register done");


                    var check = msg.getElementsByTagName("success");
                    var length = check.length;

                    if (length == 0) return;
                    if (!check[0] || check[0] == 0) return;

                    check = msg.getElementsByTagName("code");
                    length = check.length;

                    console.log("register done2");

                    if (length == 0) return;
                    if (!check[0] || check[0] == 0 || !check[0].childNodes || !check[0].childNodes[0]) return;

                    var code = check[0].childNodes[0].nodeValue;


                    var newUrl = game.url + "?login=" + code;
                    console.log(game.url);
                    console.log(newUrl);
                    console.log("register done3");
                    window.location.href = newUrl;
                }
            }
            );

        }
    }

    export class languages {
        name: string;
        constructor(public id: number) {
        }
    }
}