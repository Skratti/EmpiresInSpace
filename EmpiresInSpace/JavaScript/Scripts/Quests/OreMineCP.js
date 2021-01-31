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
    var Quest0160 = /** @class */ (function (_super) {
        __extends(Quest0160, _super);
        function Quest0160() {
            var _this = this;
            var questId = 16;
            _this = _super.call(this, 0, questId, 252, 131) || this;
            return _this;
            //call super, set type to 0 (Quest) and id to questId
        }
        return Quest0160;
    }(Scripts.QuestRunScript));
    new Quest0160();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=OreMineCP.js.map