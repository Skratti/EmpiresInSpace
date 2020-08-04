/// <reference path="../References.ts" />

module GameOver {

    class GameOver extends Scripts.Script {

        icon: JQuery;

        constructor() {
            //call super, set scriptType to 3(Form) and Id to 4 (GameOver)
            super(3, 4);
            //mainObject.scriptsAdmin.scripts.push(this);
            Scripts.scriptsAdmin.scripts.push(this);
            this.run();
        }

        run() {
            this.showGameOver();
        }

        showGameOver() {
            mainObject.keymap.isActive = false;


            $('#loader')[0].style.display = 'none';


            var windowHandle = new ElementGenerator.WindowManager(null, e => { this.removeGameOverWindow(); } );
            var _DesignerContainer = windowHandle.element;


            _DesignerContainer.css("width", "900px");
            _DesignerContainer.css("margin-left", "-450px");
            _DesignerContainer.css("left", "50%");
            _DesignerContainer.css("top", "52px");


            $(".relPopupPanel", _DesignerContainer).css("height", ($(document).height() - 200) + "px");

            var DesignerContainer = _DesignerContainer;

            var panelHeader = $('.relPopupHeader', DesignerContainer);
            var caption = $('<h2/>', { "text": i18n.label(599) });
            panelHeader.append(caption);

            var panelBody = $('.relPopupBody', DesignerContainer);
            panelBody.removeClass("trHighlight").addClass("tdHighlight");
            panelBody.css("padding-top", "6px");
            panelBody.css("text-align", "center");
            panelBody.css("font-weigh", "bold");
            panelBody.css("font-size", "18px");
            panelBody.css("padding-left", "150px");
            panelBody.css("padding-right", "150px");


            panelBody.append($('<br/>'));

            if (mainObject.shipExists(galaxyMap.winningTranscendenceConstruct)) {

                var transcendenceConstruct = mainObject.shipFind(galaxyMap.winningTranscendenceConstruct);
                if (transcendenceConstruct.owner == mainObject.user.id) {
                    panelBody.append($('<span/>', { "text": i18n.label(600) }));    //You completed your Transcendence Construct and sentient life throughout the galaxy has ascended to the next higher level of being.
                } else if (mainObject.user.otherUserExists(transcendenceConstruct.owner)
                    && mainObject.user.otherUserFind(transcendenceConstruct.owner).allianceId != 0
                    && mainObject.user.otherUserFind(transcendenceConstruct.owner).allianceId == mainObject.user.allianceId) {
                    panelBody.append($('<span/>', { "text": i18n.label(601) }));    //Your alliance completed its Transcendence Construct and sentient life throughout the galaxy has ascended to the next higher level of being.
                } else if (transcendenceConstruct.transcension.userHasHelped()) {
                    panelBody.append($('<span/>', { "text": i18n.label(602) }));    //A Transcension Construct where you participated was finished and sentient life throughout the galaxy ascended to the next higher level of being.
                } else panelBody.append($('<span/>', { "text": i18n.label(603) })); //A Transcension Construct was finished and sentient life throughout the galaxy has ascended to the next higher level of being.
                panelBody.append($('<br/>'));
                panelBody.append($('<span/>', { "text": i18n.label(604) })); //this game has ended
                panelBody.append($('<br/>'));
                panelBody.append($('<br/>'));

                if (mainObject.user.overallRank == 1)
                    panelBody.append($('<span/>', { "text": i18n.label(610).format(mainObject.user.overallVicPoints.toString()) })); //With %1 points, you are the best player of the game.
                else
                    panelBody.append($('<span/>', { "text": i18n.label(611).format(mainObject.user.overallRank.toString()) })); //Your overall ranking {0}

                panelBody.append($('<br/>'));

                if (mainObject.user.allianceId > 0
                    && mainObject.user.getAlliance().overallRank == 1) {
                    panelBody.append($('<span/>', { "text": i18n.label(608).format(mainObject.user.getAlliance().overallVicPoints.toString()) })); //With {0} points, your alliance won this game!
                } else if (mainObject.user.allianceId > 0) {
                    panelBody.append($('<span/>', { "text": i18n.label(609).format(mainObject.user.getAlliance().overallRank.toString()) })); //Your alliance has archieved the{0}. rank.
                }

                panelBody.append($('<br/>'));
                panelBody.append($('<br/>'));

                panelBody.append($('<span/>', { "text": i18n.label(607) }));  //607, N'A new game is already open. Turn evaluation of the new game will start within two days.
            }


            this.showCreateIcon();


        }


        createIcon() {
            this.icon = $("<button>", { "text": i18n.label(599) });
            this.icon.css("display", "none");
            this.icon.button();
            this.icon.data("quest", this);
            this.icon.tooltip();
            this.icon.click((e: JQueryEventObject) => {
                this.showGameOver();
                this.icon.css("display", "none");
            });
            var li = $("<li>");
            li.append(this.icon);
            $("#ui #alerts ul").append(li);

            //$("#ui #alerts").append(this.icon);
        }

        showCreateIcon() {
            if (this.icon == null) this.createIcon();
            else this.icon.css("display", "block");
        }

        removeGameOverWindow() {
            this.showCreateIcon();           
        }

    }

    new GameOver();
}