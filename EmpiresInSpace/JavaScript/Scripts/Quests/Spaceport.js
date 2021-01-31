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
    var Quest0220 = /** @class */ (function (_super) {
        __extends(Quest0220, _super);
        function Quest0220() {
            var _this = this;
            var questId = 22;
            _this = _super.call(this, 0, questId, QuestModule.buildQuests) || this;
            return _this;
            //call super, set type to 0 (Quest) and id to questId
        }
        //called by constructor, so the selfReference is needed (or another feature had changed the this operator...)
        Quest0220.prototype.run = function () {
            this.questHeader = i18n.label(112);
            this.questBody = $('<p/>', { text: i18n.label(250) });
            _super.prototype.run.call(this);
            var body = $('.relPopupBody', this.questPopup);
            var questImage0 = $('<div/>', { style: "background: url(images/Spaceport.png) no-repeat;width:30px;height:30px; border: 1px solid #666;" });
            body.append(questImage0);
        };
        Quest0220.prototype.check = function (arrayIndex, surfaceField) {
            var spaceYardBuild = false;
            /*
            for (var i = 0; i < surfaceField.parentArea.elementsInArea.length; i++) {
                if (surfaceField.parentArea.elementsInArea[i] == null) continue;
                if (surfaceField.parentArea.elementsInArea[i].surfaceBuildingId === 4) spacePortBuild = true;
            }*/
            for (var i = 0; i < ColonyModule.colonyBuildings[mainObject.currentColony.id].length; i++) {
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i] == null)
                    continue;
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i].buildingId === 17)
                    spaceYardBuild = true;
            }
            if (spaceYardBuild) {
                this.finishQuest();
            }
        };
        return Quest0220;
    }(Scripts.QuestWithCheckScript));
    new Quest0220();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=Spaceport.js.map