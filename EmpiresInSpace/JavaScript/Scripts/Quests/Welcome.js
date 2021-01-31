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
    //Welcome-Text
    var Quest0010 = /** @class */ (function (_super) {
        __extends(Quest0010, _super);
        function Quest0010() {
            var _this = this;
            var questId = 1;
            _this = _super.call(this, 0, questId, 128, 129) || this;
            return _this;
        }
        return Quest0010;
    }(Scripts.QuestRunScript));
    new Quest0010();
})(Scripts || (Scripts = {}));
//mainObject.scriptsAdmin.scripts.push(new Spaceport());
//mainObject.scriptsAdmin.find(1, 4).run();
//# sourceMappingURL=Welcome.js.map