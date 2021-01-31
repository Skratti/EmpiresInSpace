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
/// <reference path="../../References.ts" />
var Scripts;
(function (Scripts) {
    var Scout = /** @class */ (function (_super) {
        __extends(Scout, _super);
        function Scout() {
            var _this = 
            //call super, set scriptType to 1 (Building) and Id to 4 (Spaceport)
            _super.call(this, 1, 13) || this;
            //mainObject.scriptsAdmin.scripts.push(this);
            Scripts.scriptsAdmin.scripts.push(_this);
            _this.run();
            return _this;
        }
        //called by constructor, so the selfReference is needed (or another feature had changed the this operator...)
        Scout.prototype.run = function (x) {
            Helpers.Log("run(selfRef?, surfaceField: SurfaceField) : " + mainObject.currentSurfaceField.Id);
            var scoutContainer = ElementGenerator.createPopup();
            this.scoutPopup = scoutContainer;
            var body = $('.relPopupBody', scoutContainer);
            var caption = $('<h2/>', { text: "System-Scout  " });
            $(".relPopupHeader", scoutContainer).append(caption);
            body.append($("<br>")).append($("<br>"));
            var launchScount = $('<button/>', { text: i18n.label(344), style: "font-size: 1.5em;" });
            launchScount.button();
            launchScount.click(function (e) { launchScout(); scoutContainer.remove(); });
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
            body.append(launchScount);
            //li.click((e) => { launchScout(mainObject.currentSurfaceField.surfaceFieldId); scoutContainer.remove(); });
            $(".buttonUl", scoutContainer).css("right", "-10px");
            $('.noButton', scoutContainer)[0].style.display = 'none';
            $('.yesButton span', scoutContainer).text(i18n.label(206));
            scoutContainer.appendTo("body"); //attach to the <body> element
            $('.yesButton', scoutContainer).click(function (e) { scoutContainer.remove(); });
        };
        return Scout;
    }(Scripts.Script));
    function launchScout() {
        $.ajax("Server/Buildings.aspx", {
            type: "GET",
            async: true,
            data: {
                "action": "launchScout",
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
    new Scout();
})(Scripts || (Scripts = {}));
//mainObject.scriptsAdmin.scripts.push(new Spaceport());
//mainObject.scriptsAdmin.find(1, 4).run();
//# sourceMappingURL=Scout.js.map