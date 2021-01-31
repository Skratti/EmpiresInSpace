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
    var Quest0150 = /** @class */ (function (_super) {
        __extends(Quest0150, _super);
        function Quest0150() {
            var _this = this;
            var questId = 15;
            _this = _super.call(this, 0, questId, QuestModule.researchQuests, 251, 266) || this;
            return _this;
        }
        Quest0150.prototype.check = function (arrayIndex) {
            Helpers.Log("Quest 15 check ");
            //var researched = false;
            //if (mainObject.user.researchs[400] === 1) researched = true;                
            if (mainObject.user.playerResearches[400].isCompleted) {
                this.finishQuest();
            }
        };
        return Quest0150;
    }(Scripts.QuestWithCheckScript));
    new Quest0150();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=ResearchDetails.js.map