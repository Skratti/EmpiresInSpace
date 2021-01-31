/// <reference path="../../References.ts" />


module Scripts {
    //0080BuildInfrastructure
    class Quest0220 extends Scripts.QuestWithCheckScript {

        checkProxy: (arrayIndex: number, surfaceField: SurfaceField) => void;
     

        constructor() {
            var questId = 22;
            super(0, questId, QuestModule.buildQuests);        

            
            //call super, set type to 0 (Quest) and id to questId
                
        }

        //called by constructor, so the selfReference is needed (or another feature had changed the this operator...)
        run() {
            this.questHeader = i18n.label(112);
            this.questBody = $('<p/>', { text: i18n.label(250) });

            super.run();
          
            var body = $('.relPopupBody', this.questPopup);
            var questImage0 = $('<div/>', { style: "background: url(images/Spaceport.png) no-repeat;width:30px;height:30px; border: 1px solid #666;" });
            body.append(questImage0);
        }



        check(arrayIndex: number, surfaceField: SurfaceField) {

            var spaceYardBuild = false;            

            /*
            for (var i = 0; i < surfaceField.parentArea.elementsInArea.length; i++) {
                if (surfaceField.parentArea.elementsInArea[i] == null) continue;
                if (surfaceField.parentArea.elementsInArea[i].surfaceBuildingId === 4) spacePortBuild = true;                
            }*/

            for (var i = 0; i < ColonyModule.colonyBuildings[mainObject.currentColony.id].length; i++) {
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i] == null) continue;
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i].buildingId === 17) spaceYardBuild = true;               
            }


            if (spaceYardBuild) {
                this.finishQuest();
                               
            }


        }
    }

    new Quest0220();

}
