/// <reference path="../../References.ts" />


module Scripts {
    //0040FindColonizablePlanet
    class Quest0040 extends Scripts.QuestWithCheckScript {       

        checkProxy: (ship: Ships.Ship, movementXML: Document, arrayIndex: number) => void;
        map: TilemapModule.Tilemap;
        
        constructor() {
            var questId = 4;
            super(0, questId, QuestModule.movementQuests, 237, 238);   

            //call super, set type to 0 (Quest) and id to questId
                 

            Helpers.Log("LINQ");
            //mark one planet as colonizable by setting its drawArrow-Property:
            if (!this.quest.isCompleted) {
                //this.map = mainObject.currentShip ? mainObject.currentShip.parentArea.tilemap : mainObject.ships.f
                this.map = mainObject.currentShip ? mainObject.currentShip.parentArea.tilemap : null;


                if (!this.map) {
                    //var dict = new Dictionary<number, Ships.Ship>();
                    for (var i = 0; i < mainObject.ships.length; i++) {
                        if (mainObject.ships[i] && mainObject.ships[i] != null)
                        {
                            //var u = mainObject.ships[i];
                            //dict.add(i, mainObject.ships[i]);
                            this.map = mainObject.ships[i].parentArea.tilemap;
                        }                       
                    }
                    //this.map = dict.first().value.parentArea.tilemap;
                }
                
                
                for (var i = 0; i < this.map.map.length; i++) {
                    if (this.map.map[i] == null) continue;
                    for (var j = 0; j < this.map.map[i].length; j++) {
                        if (this.map.map[i][j] != null && this.map.map[i][j].stars != null && this.map.map[i][j].stars.typeId > 23 && this.map.map[i][j].stars.typeId < 27)
                            this.map.map[i][j].drawArrow = true;
                    }
                }
            }
        }

        //called by constructor, so the selfReference is needed (or another feature had changed the this operator...)
        run() {
            super.run();
            var body = $('.relPopupBody', this.questPopup);
          
            var questImage2 = $('<div/>', { style: "background: url(images/52.png) no-repeat;width:60px;height:60px; border: 1px solid #666;margin:5px;" });
            body.append(questImage2);

            body.append($('<p/>', { text: i18n.label(401) }));
            var questImage4 = $('<div/>', { style: "background: url(images/ArrowToLowerLeft.png) no-repeat;width:60px;height:60px; border: 1px solid #666;margin:5px;" });
            body.append(questImage4);

        }

        check(ship : Ships.Ship , movementXML: Document, arrayIndex: number) {
            var result = parseInt(movementXML.getElementsByTagName("result")[0].childNodes[0].nodeValue);

            if (mainObject.colonies && mainObject.colonies.length > 0){
                for (var i = 0; i < mainObject.colonies.length; i++) {
                    if (mainObject.colonies[i] != null && mainObject.colonies[i].owner == mainObject.user.id) {
                        this.finishQuest();
                        return;
                    }
                }
            }

            if (ship.canColonize()) {

                this.finishQuest();
            }
        }       

        finishQuest() {            
            super.finishQuest();      
            
            for (var i = 0; i < this.map.map.length; i++) {
                if (this.map.map[i] == null) continue;
                for (var j = 0; j < this.map.map[i].length; j++) {
                    if (this.map.map[i][j] != null && this.map.map[i][j].stars != null && this.map.map[i][j].stars.typeId > 23 && this.map.map[i][j].stars.typeId < 27)
                        this.map.map[i][j].drawArrow = false;
                }
            }          
        }

    }    

    new Quest0040();

}
