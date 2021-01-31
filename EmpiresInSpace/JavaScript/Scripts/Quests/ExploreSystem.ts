/// <reference path="../../References.ts" />


module Scripts {
    //0080BuildInfrastructure
    class Quest0100 extends Scripts.QuestWithCheckScript {

        checkProxy: (ship: Ships.Ship, movementXML: Document, arrayIndex: number) => void;        

        constructor() {
            var questId = 10;
            super(0, questId, QuestModule.movementQuests, 111, 249);        



        }       
         
        check(ship: Ships.Ship, movementXML: Document, arrayIndex: number) {
            var result = parseInt(movementXML.getElementsByTagName("result")[0].childNodes[0].nodeValue);

            if (result == 5) {

                this.finishQuest();
            }
        }
    }

    new Quest0100();
}
