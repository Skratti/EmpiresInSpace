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
    var Quest0080 = /** @class */ (function (_super) {
        __extends(Quest0080, _super);
        function Quest0080() {
            var _this = this;
            var questId = 8;
            _this = _super.call(this, 0, questId, QuestModule.buildQuests, 244, 245) || this;
            return _this;
        }
        //called by constructor, so the selfReference is needed (or another feature had changed the this operator...)
        Quest0080.prototype.run = function () {
            _super.prototype.run.call(this);
            var body = $('.relPopupBody', this.questPopup);
            /*
             var questImage0 = $('<div/>', { style: "background: url(images/152.png) no-repeat;width:30px;height:30px; border: 1px solid #666;" });
             var questImage1 = $('<div/>', { style: "background: url(images/Solar.png) no-repeat;width:30px;height:30px; border: 1px solid #666;" });
             var questImage3 = $('<div/>', { style: "background: url(images/152.png) no-repeat;width:30px;height:30px; border: 1px solid #666;" });*/
            var buildingMaterialTexturePath = mainObject.imageObjects[mainObject.buildings[9].buildingObjectId].texture.src;
            var solarPowerTexturePath = mainObject.imageObjects[mainObject.buildings[10].buildingObjectId].texture.src;
            var assemblyPlantTexturePath = mainObject.imageObjects[mainObject.buildings[19].buildingObjectId].texture.src;
            var questImage1 = $('<div/>', { style: "background: url(" + buildingMaterialTexturePath + ") no-repeat;width:30px;height:30px; border: 1px solid #666;margin:5px;background-size: 100%;" });
            var questImage2 = $('<div/>', { style: "background: url(" + solarPowerTexturePath + ") no-repeat;width:30px;height:30px; border: 1px solid #666;margin:5px;background-size: 100%;" });
            var questImage3 = $('<div/>', { style: "background: url(" + assemblyPlantTexturePath + ") no-repeat;width:30px;height:30px; border: 1px solid #666;margin:5px;background-size: 100%;" });
            body.append($("<br>"));
            body.append(questImage1).append(questImage2).append(questImage3);
        };
        Quest0080.prototype.check = function (arrayIndex, surfaceField) {
            Helpers.Log("Quest 6 check ");
            var factoryBuild = false;
            var solarPlantBuild = false;
            var mineBuild = false;
            var warehouseBuild = false;
            var assemblyPlant = false;
            for (var i = 0; i < ColonyModule.colonyBuildings[mainObject.currentColony.id].length; i++) {
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i] == null)
                    continue;
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i].buildingId === 9)
                    factoryBuild = true;
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i].buildingId === 10)
                    solarPlantBuild = true;
                //if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i].buildingId === 2) mineBuild = true;
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i].buildingId === 19)
                    assemblyPlant = true; //assembly
            }
            if (factoryBuild && solarPlantBuild && assemblyPlant) {
                this.finishQuest();
            }
        };
        Quest0080.prototype.finishQuest = function () {
            if (!this.quest.isCompleted) {
                _super.prototype.finishQuest.call(this);
                PlayerData.getUserResearch(mainObject.user);
            }
        };
        return Quest0080;
    }(Scripts.QuestWithCheckScript));
    new Quest0080();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=BuildInfrastructure.js.map