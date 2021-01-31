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
/// <reference path="../../References.ts" />
var Scripts;
(function (Scripts) {
    var CommCentre = /** @class */ (function (_super) {
        __extends(CommCentre, _super);
        function CommCentre(_type, _id) {
            var _this = _super.call(this, _type, _id) || this;
            _this.scriptHeader = i18n.label(53);
            _this.scriptBody = $('<p/>', { text: "Hier kommt der Aufruf eines einzelnen Forenthread hin. Momentan muß dieser über das rechte Menü 'Kommunikation' aufgerufen werden." });
            //call super, set scriptType to 1 (Building) and Id to 8 (Commcenter)
            _this = _super.call(this, 1, 8) || this;
            //mainObject.scriptsAdmin.scripts.push(this);         
            _this.run();
            return _this;
        }
        //called by constructor, so the selfReference is needed (or another feature had changed the this operator...)
        CommCentre.prototype.run = function () {
            //super.run();
            var commNode = CommModule.commNodeFindOnTile(mainObject.currentColony.parentArea.getCurrentTile());
            commNode.showCommMessages(null);
        };
        return CommCentre;
    }(Scripts.ScriptWithWindow));
    new CommCentre(1, 4);
    //mainObject.scriptsAdmin.scripts.push(new Spaceport());
    //mainObject.scriptsAdmin.find(1, 4).run();
})(Scripts || (Scripts = {}));
//# sourceMappingURL=CommCentre.js.map