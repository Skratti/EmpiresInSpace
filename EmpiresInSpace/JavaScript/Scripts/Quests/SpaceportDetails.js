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
    var Quest0230 = /** @class */ (function (_super) {
        __extends(Quest0230, _super);
        function Quest0230() {
            var _this = this;
            var questId = 23;
            _this = _super.call(this, 0, questId, QuestModule.inspectShipQuests, 270, 271) || this;
            return _this;
        }
        Quest0230.prototype.check = function (ship, arrayIndex) {
            Helpers.Log("Quest 23 check ");
            //count own ships, if more than one, quest is completed...
            //ToDo: just check if the new ship was built wuith the ship yard (because scout could have been scrapped)
            //also , selected ship is not a good trigger for this quest...
            var ownShips = 0;
            for (var i = 0; i < mainObject.ships.length; i++) {
                if (mainObject.ships[i] === undefined || mainObject.ships[i].owner != mainObject.user.id)
                    continue;
                ownShips++;
            }
            if (ownShips > 1) {
                this.quest.introQuestCompleted();
                this.eventHandler.splice(arrayIndex, 1);
            }
        };
        return Quest0230;
    }(Scripts.QuestWithCheckScript));
    new Quest0230();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=SpaceportDetails.js.map