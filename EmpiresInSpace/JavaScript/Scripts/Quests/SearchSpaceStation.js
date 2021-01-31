/// <reference path="../../References.ts" />
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
var Scripts;
(function (Scripts) {
    //0080BuildInfrastructure
    var Quest0130 = /** @class */ (function (_super) {
        __extends(Quest0130, _super);
        function Quest0130() {
            var _this = this;
            var questId = 13;
            _this = _super.call(this, 0, questId, QuestModule.movementQuests, 114) || this;
            var destColRow = CommModule.nearestCommNode(mainObject.user.homePosition);
            return _this;
            //this.questBody.append($("<p>", { "text": i18n.label(577) }));  //Press r to see a raster an c for coordinates, or activate raster and coordinates in your user settings.
            /*
            this.questBody = $(
                i18n.label(403)
                + destColRow.col.toString() + '/' + destColRow.row.toString()
                + i18n.label(404));
            */
            //call super, set type to 0 (Quest) and id to questId
        }
        Quest0130.prototype.run = function () {
            var destColRow = CommModule.nearestCommNode(mainObject.user.homePosition);
            this.questBody = $("<div>");
            this.questBody.append($("<p>", { "text": i18n.label(574) })); //Drag the scout to the outside of your solar system to fly out of it:
            this.questBody.append($("<img src = 'images\\tutorial\\FlyOut2.png?v=1' style ='width:250px;margin-top: 10px;margin-bottom: 10px;'>"));
            this.questBody.append($("<p>", { "text": i18n.label(575) })); //Then travel to the next spacestation:
            var SpaceStationImage = $("<div/>", { "style": "position: relative;left: 45%;margin-top: 10px;margin-bottom: 10px;background: url(images/SpaceStation3_1_60.png);background-size: 60px 60px;width: 60px;height: 60px;" });
            //this.questBody.append($("<div/>", { "class": "questStandardPicSize questSpaceStation" }));
            this.questBody.append(SpaceStationImage);
            var coordinates = (destColRow.col.toString() + '/' + destColRow.row.toString());
            this.questBody.append($("<p>", { "text": i18n.label(576) + coordinates })); //t the coordinates: 
            _super.prototype.run.call(this);
        };
        Quest0130.prototype.check = function (ship, movementXML, arrayIndex) {
            //if (CommModule.newCommNodeTarget(ship.galaxyColRow) !== -1) {
            if (ship.canTrade()) {
                this.finishQuest();
            }
        };
        return Quest0130;
    }(Scripts.QuestWithCheckScript));
    new Quest0130();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=SearchSpaceStation.js.map