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
    var Quest0110 = /** @class */ (function (_super) {
        __extends(Quest0110, _super);
        function Quest0110() {
            var _this = this;
            var questId = 11;
            _this = _super.call(this, 0, questId, 261, 263) || this;
            return _this;
        }
        Quest0110.prototype.setYesButton = function (questContainer) {
            _super.prototype.setYesButton.call(this, questContainer);
        };
        return Quest0110;
    }(Scripts.QuestRunScript));
    new Quest0110();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=ColonyManagement.js.map