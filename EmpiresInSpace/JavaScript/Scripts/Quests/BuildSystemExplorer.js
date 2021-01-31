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
    var Quest0090 = /** @class */ (function (_super) {
        __extends(Quest0090, _super);
        function Quest0090() {
            var _this = this;
            var questId = 9;
            _this = _super.call(this, 0, questId, QuestModule.inspectShipQuests, 246, 247) || this;
            return _this;
            //this.questBody.append($("<br>"));
            //this.questBody.append($("<div/>", { "class": "questStandardPicSize questSystemScout" }));
            //call super, set type to 0 (Quest) and id to questId
        }
        //add image to questText
        /*run() {
            super.run();

            var body = $('.relPopupBody', this.questPopup);
            var questImage0 = $('<div/>', { style: "background: url(images/ship.gif) no-repeat;width:30px;height:30px; border: 1px solid #666;" });
            body.append(questImage0);
        }*/
        Quest0090.prototype.check = function (ship, arrayIndex) {
            if (ship.owner != mainObject.user.id)
                return;
            if (ship.systemMovesMax == 0)
                return;
            this.finishQuest();
        };
        return Quest0090;
    }(Scripts.QuestWithCheckScript));
    new Quest0090();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=BuildSystemExplorer.js.map