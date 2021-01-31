/// <reference path="../../References.ts" />


module Scripts {
    //0080BuildInfrastructure
    class Quest0240 extends Scripts.QuestWithCheckScript {

        checkProxy: (ship: Ships.Ship, movementXML: Document, arrayIndex: number) => void;        

        constructor() {
            var questId = 24;
            super(0, questId, QuestModule.movementQuests);           

            this.questHeader = i18n.label(113);
            this.questBody = $('<p/>', { text: "Wähle den Raumhafen an und baue dort ein Schiff. Es wird erst in der nächsten Runde fertiggestellt sein. Fliege dann aus deinem Sonnensystem heraus, indem du es auf den Rand ziehst." });
            
            //call super, set type to 0 (Quest) and id to questId
            
        }       

        check(ship: Ships.Ship, movementXML: Document, arrayIndex: number) {
            var result = parseInt(movementXML.getElementsByTagName("result")[0].childNodes[0].nodeValue);

            if (result == 8) {
                this.finishQuest();
            }
        }
    }

    new Quest0240();

}
