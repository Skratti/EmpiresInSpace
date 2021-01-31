/// <reference path="../../References.ts" />


module Scripts {
    //0060PlanetSurface
    class Quest0060 extends Scripts.QuestWithCheckScript {      
        checkProxy: (arrayIndex: number) => void;

        constructor() {
            var questId = 6;
            super(0, questId, QuestModule.inspectSurfaceQuests, 240, 241);            
   
        }

        //called by constructor, so the selfReference is needed (or another feature had changed the this operator...)
        run() {
            super.run();

            var body = $('.relPopupBody', this.questPopup);


            var questImage2 = $('<div/>', { style: "position: relative;left: 45%;background: url(images/52.png) no-repeat;width:60px;height:60px; border: 1px solid #666;margin:5px;" });
            
            body.append(questImage2);

            body.append($("<br>"));     
            

        }

        check(arrayIndex: number) {
           
            this.finishQuest();        
        }
    }

    new Quest0060();
}
