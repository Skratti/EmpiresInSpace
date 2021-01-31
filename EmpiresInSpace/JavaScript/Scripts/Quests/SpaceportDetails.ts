/// <reference path="../../References.ts" />

module Scripts {
    class Quest0230 extends Scripts.QuestWithCheckScript {

        checkProxy: (arrayIndex: number, surfaceField: SurfaceField) => void;
        
        constructor() {
            var questId = 23;
            super(0, questId, QuestModule.inspectShipQuests, 270, 271);         
        }      

        check(ship: Ships.Ship, arrayIndex: number) {
            Helpers.Log("Quest 23 check ");

            //count own ships, if more than one, quest is completed...
            //ToDo: just check if the new ship was built wuith the ship yard (because scout could have been scrapped)
            //also , selected ship is not a good trigger for this quest...
            var ownShips = 0;
            for (var i = 0; i < mainObject.ships.length; i++) {
                if (mainObject.ships[i] === undefined || mainObject.ships[i].owner != mainObject.user.id) continue;
                ownShips++;
            }            

            if (ownShips > 1) {
                this.quest.introQuestCompleted();
                this.eventHandler.splice(arrayIndex, 1);
            }
        }
    }

    new Quest0230();
}
