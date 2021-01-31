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
    var Quest0240 = /** @class */ (function (_super) {
        __extends(Quest0240, _super);
        function Quest0240() {
            var _this = this;
            var questId = 24;
            _this = _super.call(this, 0, questId, QuestModule.movementQuests) || this;
            _this.questHeader = i18n.label(113);
            _this.questBody = $('<p/>', { text: "Wähle den Raumhafen an und baue dort ein Schiff. Es wird erst in der nächsten Runde fertiggestellt sein. Fliege dann aus deinem Sonnensystem heraus, indem du es auf den Rand ziehst." });
            return _this;
            //call super, set type to 0 (Quest) and id to questId
        }
        Quest0240.prototype.check = function (ship, movementXML, arrayIndex) {
            var result = parseInt(movementXML.getElementsByTagName("result")[0].childNodes[0].nodeValue);
            if (result == 8) {
                this.finishQuest();
            }
        };
        return Quest0240;
    }(Scripts.QuestWithCheckScript));
    new Quest0240();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=BuildSpaceShip.js.map