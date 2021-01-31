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
    var Quest0100 = /** @class */ (function (_super) {
        __extends(Quest0100, _super);
        function Quest0100() {
            var _this = this;
            var questId = 10;
            _this = _super.call(this, 0, questId, QuestModule.movementQuests, 111, 249) || this;
            return _this;
        }
        Quest0100.prototype.check = function (ship, movementXML, arrayIndex) {
            var result = parseInt(movementXML.getElementsByTagName("result")[0].childNodes[0].nodeValue);
            if (result == 5) {
                this.finishQuest();
            }
        };
        return Quest0100;
    }(Scripts.QuestWithCheckScript));
    new Quest0100();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=ExploreSystem.js.map