/// <reference path="../../References.ts" />

module Scripts {
        
    //0030Movement
    class Quest0030 extends Scripts.QuestWithCheckScript {               

        checkProxy: (ship: Ships.Ship, movementXML: Document, arrayIndex: number) => void;
        
        constructor() {
            var questId = 3;
            
            super(0, questId, QuestModule.movementQuests, 132, 236);              

            

            this.questBody.append($("<img src = 'images\\tutorial\\003ShipMove.png' style ='width:250px;'>"));
            //call super, set type to 0 (Quest) and id to questId
                                                                                         
        }                

        check(ship: Ships.Ship, movementXML: Document, arrayIndex: number) {            
            var result = parseInt(movementXML.getElementsByTagName("result")[0].childNodes[0].nodeValue);

            Helpers.Log('check: ' +  this.id.toString());
            if (result == 5) {
                this.finishQuest();                
                return 0; // changes movement result, so that the ship does not move any further
            }
        }
        
    }
          
    new Quest0030();

}
