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
    //0070PlanetSurfaceOverview
    var Quest0400 = /** @class */ (function (_super) {
        __extends(Quest0400, _super);
        function Quest0400() {
            var _this = this;
            var questId = 40;
            _this = _super.call(this, 0, questId, 115, 275) || this;
            return _this;
            //call super, set type to 0 (Quest) and id to questId
        }
        return Quest0400;
    }(Scripts.QuestRunScript));
    new Quest0400();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=FinishedIntro.js.map