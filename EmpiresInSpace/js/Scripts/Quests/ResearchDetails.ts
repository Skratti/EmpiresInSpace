/// <reference path="../../References.ts" />

module Scripts {
    class Quest0150 extends Scripts.QuestWithCheckScript {

        checkProxy: (arrayIndex: number) => void;
        eventHandler: any[];
        newIndex: number;

        constructor() {
            var questId = 15;
            super(0, questId, QuestModule.researchQuests, 251, 266);   

        }        

        check(arrayIndex: number) {
            Helpers.Log("Quest 15 check ");
            //var researched = false;
            //if (mainObject.user.researchs[400] === 1) researched = true;                
            if (mainObject.user.playerResearches[400].isCompleted) {
                this.finishQuest();
            }
        }


    }

    new Quest0150();
}
