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
    var Quest0210 = /** @class */ (function (_super) {
        __extends(Quest0210, _super);
        function Quest0210() {
            var _this = this;
            var questId = 21;
            _this = _super.call(this, 0, questId, QuestModule.buildQuests, 254, 268) || this;
            return _this;
        }
        Quest0210.prototype.check = function (arrayIndex, surfaceField) {
            Helpers.Log("Quest 21 check ");
            var modulePlantBuilt = false;
            for (var i = 0; i < ColonyModule.colonyBuildings[mainObject.currentColony.id].length; i++) {
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i] == null)
                    continue;
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i].buildingId === 16)
                    modulePlantBuilt = true;
            }
            if (modulePlantBuilt) {
                this.finishQuest();
            }
        };
        return Quest0210;
    }(Scripts.QuestWithCheckScript));
    new Quest0210();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=ShipModulePlant.js.map