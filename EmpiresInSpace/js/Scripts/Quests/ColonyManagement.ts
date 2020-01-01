/// <reference path="../../References.ts" />

module Scripts {
    class Quest0110 extends Scripts.QuestRunScript {

        constructor() {
            var questId = 11;
            super(0, questId, 261, 263);       

        } 

        setYesButton(questContainer: JQuery) {
            super.setYesButton(questContainer);
                        
        }     
    }


    new Quest0110();
}
