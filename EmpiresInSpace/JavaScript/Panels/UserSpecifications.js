//atm not called by a webworker. Should be fixed later on...
var UserSpecifications;
(function (UserSpecifications) {
    var FreePics = 0;
    //creates the single icon #UserSpecsRestore for when the SpecWindow is minimized
    function createIcon() {
        var icon = $("<button>");
        //icon.append($("<span>", {text:i18n.label(911)})); // label = '?'
        //icon.tooltip();
        ElementGenerator.Button(icon, 911, 909); // label = '?', tooltip =  'Global Ranking'
        icon.click(function (e) {
            UserSpecifications.showSpecifications();
            $("#UserSpecs").css("display", "block");
            $("#UserSpecsRestore").css("display", "none");
            if (Helpers.supportsHtmlStorage()) {
                localStorage.setItem('chat', 'true');
            }
        });
        var li = $('<li id="UserSpecsRestore" >');
        li.append(icon);
        li.css("display", "none");
        var unreadChats = $('<div class="FreePicks UnreadMarker" >');
        li.append(unreadChats);
        //<li><button id="chatRestore"><span class="imageSpeak liButton2"></span></button></li>
        $("#QuestList ul").append(li);
        setFreePics();
    }
    function CountFreePicks() {
        var Counted = 0;
        for (var i = 0; i < BaseDataModule.SpecializationGroups.length; i++) {
            var SpecGroup = BaseDataModule.SpecializationGroups[i];
            Counted += SpecGroup.Picks;
            for (var j = 0; j < SpecGroup.SpecializationResearch.length; j++) {
                var SpecResearch = SpecGroup.SpecializationResearch[j];
                if (SpecResearch.PickState.isFixed())
                    Counted--;
            }
        }
        return Counted;
    }
    function CountAndShowFreePics(showButton) {
        if (showButton === void 0) { showButton = false; }
        FreePics = CountFreePicks();
        setFreePics(showButton);
    }
    UserSpecifications.CountAndShowFreePics = CountAndShowFreePics;
    function setFreePics(showButton) {
        if (showButton === void 0) { showButton = false; }
        if (FreePics > 0) {
            $(".FreePicks").html(FreePics.toString());
            $(".FreePicks").css("display", "block");
            if (showButton)
                $("#UserSpecsRestore").css("display", "block");
        }
        else {
            $(".FreePicks").css("display", "none");
            $("#UserSpecsRestore").css("display", "none");
        }
    }
    //createt the UserSpecs Icon, sets visibility, sets events
    function initUserSpecs() {
        createIcon();
    }
    UserSpecifications.initUserSpecs = initUserSpecs;
    function showSpecifications() {
        Helpers.Log("showSpecifications");
        //create main Panel and add header + content
        var windowHandle = ElementGenerator.MainPanel();
        //windowHandle.setHeader(($("<span>" + "Civilizatory Traits" + "</span>")).html());
        windowHandle.callbackOnRemove = function (e) { $("#UserSpecsRestore").css("display", "block"); UserSpecifications.CountAndShowFreePics(); };
        var body = $('.relPopupBody', windowHandle.element);
        body.css("padding-right", "3px");
        for (var i = 0; i < BaseDataModule.SpecializationGroups.length; i++) {
            var SpecGroup = BaseDataModule.SpecializationGroups[i];
            SpecGroup.setPickState(mainObject.user);
        }
        (new DiplomacyModule.UserSpecificationCreator(mainObject.user, body)).refresh();
    }
    UserSpecifications.showSpecifications = showSpecifications;
    function FetchAllUserSpecifications() {
        $.connection.spaceHub.invoke("FetchAllUserResearch").done(function (e) {
            //user.researchDataLoaded = true;
            //Helpers.Log(e);
            var SpecPicks = [];
            //make a list of references to the specializationPicks
            for (var i = 0; i < BaseDataModule.SpecializationGroups.length; i++) {
                var SpecGroup = BaseDataModule.SpecializationGroups[i];
                for (var j = 0; j < SpecGroup.SpecializationResearch.length; j++) {
                    var Pick = SpecGroup.SpecializationResearch[j];
                    SpecPicks[Pick.ResearchId] = Pick;
                }
            }
            for (var i = 0; i < e["Researchs"].length; i++) {
                var UserSpec = e["Researchs"][i];
                var User = mainObject.findUser(UserSpec["Item1"]);
                var researchId = UserSpec["Item2"];
                //Helpers.Log('FetchUserResearch ' + User.name + ' ' + researchId);
                var newResearch = new PlayerData.PlayerResearches(researchId);
                User.playerResearches[researchId] = newResearch;
                User.playerResearches[researchId].isCompleted = true;
                User.researchDataLoaded = true;
                if (SpecPicks[researchId] != null)
                    SpecPicks[researchId].AmountTaken++;
            }
            UserSpecifications.CountAndShowFreePics(true);
        });
    }
    UserSpecifications.FetchAllUserSpecifications = FetchAllUserSpecifications;
})(UserSpecifications || (UserSpecifications = {}));
//# sourceMappingURL=UserSpecifications.js.map