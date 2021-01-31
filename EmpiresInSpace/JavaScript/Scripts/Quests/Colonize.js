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
    //0050Colonize
    var Quest0050 = /** @class */ (function (_super) {
        __extends(Quest0050, _super);
        function Quest0050() {
            var _this = this;
            var questId = 5;
            _this = _super.call(this, 0, questId, QuestModule.colonizeQuests, 237, 239) || this;
            _this.questBody.append($("<br><br>"));
            _this.questBody.append($("<div/>", { "class": "questStandardPicSize questColonize" }));
            return _this;
        }
        //called by constructor, so the selfReference is needed (or another feature had changed the this operator...)
        Quest0050.prototype.run = function () {
            _super.prototype.run.call(this);
            var body = $('.relPopupBody', this.questPopup);
            //var questImage = $('<div/>', { style: "background-image:url(images/ship.gif);width:34px;height:30px;background-repeat:no-repeat;background-position: 4px 5px" });
            var questImage = $('<div/>', { style: "position: relative;left: 45%;border-radius: 3px;background: rgb(42, 90, 187) url(images/Icons.png) no-repeat -330px 0px;width:30px;height:30px;background-repeat:no-repeat; border: 1px solid #75E0F0;" });
            //var questImage = $('<div/>', { style: "width: 40px height: 40px margin - left: 10px border: 1px solid #75E0F0 -webkit - border - radius: 5px -moz - border - radius: 5px -o - border - radius: 5px border - radius: 5px -ms - border - radius: 5px -webkit - box - shadow: 1px 1px 5px #000 -moz - box - shadow: 1px 1px 5px #000 -o - box - shadow: 1px 1px 5px #000 -ms - box - shadow: 1px 1px 5px #000 box - shadow: 1px 1px 5px #000; background: rgb(57, 191, 191) url(images / ui - icons.png) no - repeat 5px - 204px;" });
            body.append(questImage);
            body.append($("<br>"));
            if (mainObject.colonies && mainObject.colonies.length > 0) {
                for (var i = 0; i < mainObject.colonies.length; i++) {
                    if (mainObject.colonies[i] != null && mainObject.colonies[i].owner == mainObject.user.id) {
                        this.finishQuest();
                        return;
                    }
                }
            }
        };
        Quest0050.prototype.check = function (colony, arrayIndex) {
            Helpers.Log("Quest check(colony...)");
            this.finishQuest();
        };
        return Quest0050;
    }(Scripts.QuestWithCheckScript));
    new Quest0050();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=Colonize.js.map