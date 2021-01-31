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
    //0030Movement
    var Quest0030 = /** @class */ (function (_super) {
        __extends(Quest0030, _super);
        function Quest0030() {
            var _this = this;
            var questId = 3;
            _this = _super.call(this, 0, questId, QuestModule.movementQuests, 132, 236) || this;
            _this.questBody.append($("<img src = 'images\\tutorial\\003ShipMove.png' style ='width:250px;'>"));
            return _this;
            //call super, set type to 0 (Quest) and id to questId
        }
        Quest0030.prototype.check = function (ship, movementXML, arrayIndex) {
            var result = parseInt(movementXML.getElementsByTagName("result")[0].childNodes[0].nodeValue);
            Helpers.Log('check: ' + this.id.toString());
            if (result == 5) {
                this.finishQuest();
                return 0; // changes movement result, so that the ship does not move any further
            }
        };
        return Quest0030;
    }(Scripts.QuestWithCheckScript));
    new Quest0030();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=Movement.js.map