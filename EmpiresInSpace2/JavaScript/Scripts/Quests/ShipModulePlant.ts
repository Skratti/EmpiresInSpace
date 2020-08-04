/// <reference path="../../References.ts" />

module Scripts {
    class Quest0210 extends Scripts.QuestWithCheckScript {

        checkProxy: (arrayIndex: number, surfaceField: SurfaceField) => void;
       
        constructor() {
            var questId = 21;
            super(0, questId, QuestModule.buildQuests, 254, 268);            
        }       

        check(arrayIndex: number, surfaceField: SurfaceField) {
            Helpers.Log("Quest 21 check ");
            var modulePlantBuilt = false;

            for (var i = 0; i < ColonyModule.colonyBuildings[mainObject.currentColony.id].length; i++) {
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i] == null) continue;
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i].buildingId === 16) modulePlantBuilt = true;
            }

            if (modulePlantBuilt) {
                this.finishQuest();
            }
        }
    }

    new Quest0210();
}
