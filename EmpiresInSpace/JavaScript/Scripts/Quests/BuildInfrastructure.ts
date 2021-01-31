/// <reference path="../../References.ts" />


module Scripts {
    //0080BuildInfrastructure
    class Quest0080 extends Scripts.QuestWithCheckScript {   

        checkProxy: (arrayIndex: number, surfaceField: SurfaceField) => void;
        eventHandler: any[];

        constructor() {
            var questId = 8;
            super(0, questId, QuestModule.buildQuests, 244, 245);    
 
        }

        //called by constructor, so the selfReference is needed (or another feature had changed the this operator...)
        run() {
            super.run();
            var body = $('.relPopupBody', this.questPopup);
           /*
            var questImage0 = $('<div/>', { style: "background: url(images/152.png) no-repeat;width:30px;height:30px; border: 1px solid #666;" });
            var questImage1 = $('<div/>', { style: "background: url(images/Solar.png) no-repeat;width:30px;height:30px; border: 1px solid #666;" });            
            var questImage3 = $('<div/>', { style: "background: url(images/152.png) no-repeat;width:30px;height:30px; border: 1px solid #666;" });*/
            
            var buildingMaterialTexturePath = mainObject.imageObjects[mainObject.buildings[9].buildingObjectId].texture.src;
            var solarPowerTexturePath = mainObject.imageObjects[mainObject.buildings[10].buildingObjectId].texture.src;
            var assemblyPlantTexturePath = mainObject.imageObjects[mainObject.buildings[19].buildingObjectId].texture.src;
            
            var questImage1 = $('<div/>', { style: "background: url(" + buildingMaterialTexturePath +") no-repeat;width:30px;height:30px; border: 1px solid #666;margin:5px;background-size: 100%;" });
            var questImage2 = $('<div/>', { style: "background: url(" + solarPowerTexturePath +") no-repeat;width:30px;height:30px; border: 1px solid #666;margin:5px;background-size: 100%;" });
            var questImage3 = $('<div/>', { style: "background: url(" + assemblyPlantTexturePath +") no-repeat;width:30px;height:30px; border: 1px solid #666;margin:5px;background-size: 100%;" });
            body.append($("<br>"));     

            body.append(questImage1).append(questImage2).append(questImage3);
        }

        check(arrayIndex: number, surfaceField: SurfaceField) {
            Helpers.Log("Quest 6 check ");
            var factoryBuild = false;
            var solarPlantBuild = false;
            var mineBuild = false;
            var warehouseBuild = false;
            var assemblyPlant = false;


            for (var i = 0; i < ColonyModule.colonyBuildings[mainObject.currentColony.id].length; i++) {
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i] == null) continue;
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i].buildingId === 9) factoryBuild = true;
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i].buildingId === 10) solarPlantBuild = true; 
                //if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i].buildingId === 2) mineBuild = true;
                if (ColonyModule.colonyBuildings[mainObject.currentColony.id][i].buildingId === 19) assemblyPlant = true; //assembly
            }
            
            if (factoryBuild && solarPlantBuild && assemblyPlant) {
                this.finishQuest();            
            }
        }

        finishQuest() {
            if (!this.quest.isCompleted) {
                super.finishQuest();               
                PlayerData.getUserResearch(mainObject.user);          
            }
        }

    
    }

    new Quest0080();

}
