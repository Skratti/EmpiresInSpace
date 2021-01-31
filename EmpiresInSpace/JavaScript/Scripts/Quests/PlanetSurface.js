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
    //0060PlanetSurface
    var Quest0060 = /** @class */ (function (_super) {
        __extends(Quest0060, _super);
        function Quest0060() {
            var _this = this;
            var questId = 6;
            _this = _super.call(this, 0, questId, QuestModule.inspectSurfaceQuests, 240, 241) || this;
            return _this;
        }
        //called by constructor, so the selfReference is needed (or another feature had changed the this operator...)
        Quest0060.prototype.run = function () {
            _super.prototype.run.call(this);
            var body = $('.relPopupBody', this.questPopup);
            var questImage2 = $('<div/>', { style: "position: relative;left: 45%;background: url(images/52.png) no-repeat;width:60px;height:60px; border: 1px solid #666;margin:5px;" });
            body.append(questImage2);
            body.append($("<br>"));
        };
        Quest0060.prototype.check = function (arrayIndex) {
            this.finishQuest();
        };
        return Quest0060;
    }(Scripts.QuestWithCheckScript));
    new Quest0060();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=PlanetSurface.js.map