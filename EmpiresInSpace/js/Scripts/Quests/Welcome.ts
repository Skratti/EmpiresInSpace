/// <reference path="../../References.ts" />

module Scripts {
    //Welcome-Text
    class Quest0010 extends Scripts.QuestRunScript {               

        constructor() {
            var questId = 1;
            super(0, questId, 128, 129);
            
        }                 
    }

    new Quest0010();
}
//mainObject.scriptsAdmin.scripts.push(new Spaceport());
//mainObject.scriptsAdmin.find(1, 4).run();