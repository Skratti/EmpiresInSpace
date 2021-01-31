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
    var Quest0140 = /** @class */ (function (_super) {
        __extends(Quest0140, _super);
        function Quest0140() {
            var _this = this;
            var questId = 14;
            _this = _super.call(this, 0, questId, QuestModule.buildQuests, 262, 264) || this;
            return _this;
            //call super, set type to 0 (Quest) and id to questId
        }
        Quest0140.prototype.run = function () {
            this.questBody.append($("<br>"));
            this.questBody.append($("<div/>", { "class": "questStandardPicSize questResearchCenter" }));
            this.questBody.append($(i18n.label(573)));
            _super.prototype.run.call(this);
            this.check(this.checkArrayIndex);
        };
        Quest0140.prototype.check = function (arrayIndex) {
            Helpers.Log("Quest 14 check ");
            /*
            if (mainObject.user.playerResearches[1].isCompleted) {
                this.finishQuest();
            }
            */
            var researchCenterBuilt = false;
            if (mainObject.currentColony == null)
                return;
            for (var i = 0; i < ColonyModule.colonyBuildings[mainObject.currentColony.id].length; i++) {
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i] == null)
                    continue;
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i].buildingId === 15)
                    researchCenterBuilt = true;
            }
            if (researchCenterBuilt) {
                this.finishQuest();
            }
        };
        return Quest0140;
    }(Scripts.QuestWithCheckScript));
    new Quest0140();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=ResearchCenter.js.map