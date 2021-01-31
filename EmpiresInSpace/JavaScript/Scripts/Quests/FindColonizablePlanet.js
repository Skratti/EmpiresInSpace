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
    //0040FindColonizablePlanet
    var Quest0040 = /** @class */ (function (_super) {
        __extends(Quest0040, _super);
        function Quest0040() {
            var _this = this;
            var questId = 4;
            _this = _super.call(this, 0, questId, QuestModule.movementQuests, 237, 238) || this;
            //call super, set type to 0 (Quest) and id to questId
            Helpers.Log("LINQ");
            //mark one planet as colonizable by setting its drawArrow-Property:
            if (!_this.quest.isCompleted) {
                //this.map = mainObject.currentShip ? mainObject.currentShip.parentArea.tilemap : mainObject.ships.f
                _this.map = mainObject.currentShip ? mainObject.currentShip.parentArea.tilemap : null;
                if (!_this.map) {
                    //var dict = new Dictionary<number, Ships.Ship>();
                    for (var i = 0; i < mainObject.ships.length; i++) {
                        if (mainObject.ships[i] && mainObject.ships[i] != null) {
                            //var u = mainObject.ships[i];
                            //dict.add(i, mainObject.ships[i]);
                            _this.map = mainObject.ships[i].parentArea.tilemap;
                        }
                    }
                    //this.map = dict.first().value.parentArea.tilemap;
                }
                for (var i = 0; i < _this.map.map.length; i++) {
                    if (_this.map.map[i] == null)
                        continue;
                    for (var j = 0; j < _this.map.map[i].length; j++) {
                        if (_this.map.map[i][j] != null && _this.map.map[i][j].astronomicalObject != null && _this.map.map[i][j].astronomicalObject.typeId > 23 && _this.map.map[i][j].astronomicalObject.typeId < 27)
                            _this.map.map[i][j].drawArrow = true;
                    }
                }
            }
            return _this;
        }
        //called by constructor, so the selfReference is needed (or another feature had changed the this operator...)
        Quest0040.prototype.run = function () {
            _super.prototype.run.call(this);
            var body = $('.relPopupBody', this.questPopup);
            var questImage2 = $('<div/>', { style: "background: url(images/52.png) no-repeat;width:60px;height:60px; border: 1px solid #666;margin:5px;" });
            body.append(questImage2);
            body.append($('<p/>', { text: i18n.label(401) }));
            var questImage4 = $('<div/>', { style: "background: url(images/ArrowToLowerLeft.png) no-repeat;width:60px;height:60px; border: 1px solid #666;margin:5px;" });
            body.append(questImage4);
        };
        Quest0040.prototype.check = function (ship, movementXML, arrayIndex) {
            var result = parseInt(movementXML.getElementsByTagName("result")[0].childNodes[0].nodeValue);
            if (mainObject.colonies && mainObject.colonies.length > 0) {
                for (var i = 0; i < mainObject.colonies.length; i++) {
                    if (mainObject.colonies[i] != null && mainObject.colonies[i].owner == mainObject.user.id) {
                        this.finishQuest();
                        return;
                    }
                }
            }
            if (ship.canColonize()) {
                this.finishQuest();
            }
        };
        Quest0040.prototype.finishQuest = function () {
            _super.prototype.finishQuest.call(this);
            for (var i = 0; i < this.map.map.length; i++) {
                if (this.map.map[i] == null)
                    continue;
                for (var j = 0; j < this.map.map[i].length; j++) {
                    if (this.map.map[i][j] != null && this.map.map[i][j].astronomicalObject != null && this.map.map[i][j].astronomicalObject.typeId > 23 && this.map.map[i][j].astronomicalObject.typeId < 27)
                        this.map.map[i][j].drawArrow = false;
                }
            }
        };
        return Quest0040;
    }(Scripts.QuestWithCheckScript));
    new Quest0040();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=FindColonizablePlanet.js.map