/// <reference path="../../References.ts" />

module Scripts {
    class Quest0140 extends Scripts.QuestWithCheckScript {

        checkProxy: (arrayIndex: number) => void;        
        newIndex: number;
            

        constructor() {
            var questId = 14;
            super(0, questId, QuestModule.buildQuests,262,264);   

            
            
            //call super, set type to 0 (Quest) and id to questId


            
                    
        }

        run() {
            this.questBody.append($("<br>"));
            this.questBody.append($("<div/>", { "class": "questStandardPicSize questResearchCenter" }));
            this.questBody.append($(i18n.label(573)));
            super.run();
            this.check(this.checkArrayIndex);
        }

        check(arrayIndex: number) {
            Helpers.Log("Quest 14 check ");            
            /*
            if (mainObject.user.playerResearches[1].isCompleted) {
                this.finishQuest();
            }
            */
            var researchCenterBuilt = false;
            if (mainObject.currentColony == null) return;

            for (var i = 0; i < ColonyModule.colonyBuildings[mainObject.currentColony.id].length; i++) {
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i] == null) continue;
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i].buildingId === 15) researchCenterBuilt = true;
            }

            if (researchCenterBuilt) {
                this.finishQuest();
            }

        }

    }

    new Quest0140();
}
