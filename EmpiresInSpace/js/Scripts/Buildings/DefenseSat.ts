/// <reference path="../../References.ts" />
module Scripts {

    class DefSat extends Scripts.Script {

        scoutPopup: JQuery;

        constructor() {
            //call super, set scriptType to 1 (Building) and Id to 21 (Defense satellite)
            super(1, 21);
            //mainObject.scriptsAdmin.scripts.push(this);
            Scripts.scriptsAdmin.scripts.push(this);
            this.run();

        }

        //called by constructor, so the selfReference is needed (or another feature had changed the this operator...)
        run(x?) {
            //Helpers.Log("run(selfRef?, surfaceField: SurfaceField) : " + mainObject.currentSurfaceField.Id);
            var scoutContainer = ElementGenerator.createPopup();
            this.scoutPopup = scoutContainer;
            var body = $('.relPopupBody', scoutContainer);

            var caption = $('<h2/>', { text: "System-Scout  " });
            $(".relPopupHeader", scoutContainer).append(caption);

            body.append($("<br>")).append($("<br>"));

            var launchScoutButton = $('<button/>', { text: i18n.label(345), style: "font-size: 1.5em;" });
            launchScoutButton.button();
            launchScoutButton.click((e) => { launchScout(); scoutContainer.remove(); });

            /*
            var ul = $("<ul/>", { "class" : "ulButtonList" } );
            //var li = $("<li/>", { text: "Schiff starten...", "class" : "liButton" });
            var li = $("<li/>", { "class" : "liButton" });            
            li.width(100).height(18);
            li.append($("<div>", { text: "Schiff starten" }).css("margin", "5px"));
            */

            //li.click();

            //$(".relPopupPanel", spaceportContainer).width(300).height(200);
            //$(".relPopupHeader", scoutContainer).addClass("popupPanelSmall");
            //$(".relPopupPanel", scoutContainer).addClass("popupPanelSmall");
            //$(".relPopupFooter", scoutContainer).addClass("popupFooterSmall");
            ElementGenerator.makeSmall(scoutContainer);


            //ul.append(li);
            //body.append(ul);
            body.append(launchScoutButton)
            //li.click((e) => { launchScout(mainObject.currentSurfaceField.surfaceFieldId); scoutContainer.remove(); });

            $(".buttonUl", scoutContainer).css("right", "-10px")
            $('.noButton', scoutContainer)[0].style.display = 'none';
            $('.yesButton span', scoutContainer).text(i18n.label(206));
            scoutContainer.appendTo("body"); //attach to the <body> element

            $('.yesButton', scoutContainer).click((e: JQuery.Event) => { scoutContainer.remove(); });
        }
    }

    function launchScout() {



        $.ajax("Server/Buildings.aspx", {
            type: "GET",
            async: true,
            data: {
                "action": "launchDefSat",
                "colonyId": mainObject.currentColony.id,
                "surfaceFieldId": mainObject.currentSurfaceField.Id
            }
        }).done(function (msg) {

                //remove Building from SurfaceTile
                var xmlTile = msg.getElementsByTagName("surfaceTile");
                var length = xmlTile.length;
                for (var i = 0; i < length; i++) {
                    mainObject.currentColony.planetArea.createUpdateSurfaceFieldElement(xmlTile[i]);
                }

                //add ShipModule.Ship to map
                var shipsFromXML = msg.getElementsByTagName("ship");
                for (var i = 0; i < shipsFromXML.length; i++) {
                    mainObject.shipUpdate(shipsFromXML[i]);
                }

                ShipTemplateModule.getTemplatesFromXML(msg);

                mainObject.currentSurfaceField.building.deleteBuilding(false);
                mainInterface.drawAll();
                mainInterface.refreshMiddleInfoPanel();
            });

    }

    new DefSat();
}
//mainObject.scriptsAdmin.scripts.push(new Spaceport());
//mainObject.scriptsAdmin.find(1, 4).run();