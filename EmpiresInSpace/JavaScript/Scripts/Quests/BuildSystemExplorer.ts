/// <reference path="../../References.ts" />


module Scripts {
    //0080BuildInfrastructure
    class Quest0090 extends Scripts.QuestWithCheckScript {

        checkProxy: ( arrayIndex: number) => void;        

        constructor() {
            var questId = 9;
            super(0, questId, QuestModule.inspectShipQuests, 246, 247);           

            //this.questBody.append($("<br>"));
            //this.questBody.append($("<div/>", { "class": "questStandardPicSize questSystemScout" }));
            //call super, set type to 0 (Quest) and id to questId
            
        }

        //add image to questText
        /*run() {
            super.run();

            var body = $('.relPopupBody', this.questPopup);                      
            var questImage0 = $('<div/>', { style: "background: url(images/ship.gif) no-repeat;width:30px;height:30px; border: 1px solid #666;" });            
            body.append(questImage0);
        }*/

        check(ship: Ships.Ship, arrayIndex: number) {
            if (ship.owner != mainObject.user.id) return;
            if (ship.systemMovesMax == 0) return;

            this.finishQuest();
        }
    }

    new Quest0090();
}
