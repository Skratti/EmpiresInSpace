/// <reference path="../../References.ts" />

module Scripts {
    //0080BuildInfrastructure
    class Quest0130 extends Scripts.QuestWithCheckScript {

        checkProxy: (ship: Ships.Ship, movementXML: Document, arrayIndex: number) => void;
        eventHandler: any[];

        constructor() {
            var questId = 13;
            super(0, questId, QuestModule.movementQuests, 114);       

            var destColRow = CommModule.nearestCommNode(mainObject.user.homePosition);
           
            //this.questBody.append($("<p>", { "text": i18n.label(577) }));  //Press r to see a raster an c for coordinates, or activate raster and coordinates in your user settings.
     
            /*
            this.questBody = $(
                i18n.label(403)
                + destColRow.col.toString() + '/' + destColRow.row.toString()
                + i18n.label(404));
            */


            //call super, set type to 0 (Quest) and id to questId
                
        }      
        run() {
            

            var destColRow = CommModule.nearestCommNode(mainObject.user.homePosition);
            this.questBody = $("<div>");
            this.questBody.append($("<p>", { "text": i18n.label(574) })); //Drag the scout to the outside of your solar system to fly out of it:
            this.questBody.append($("<img src = 'images\\tutorial\\FlyOut2.png?v=1' style ='width:250px;margin-top: 10px;margin-bottom: 10px;'>"));
            this.questBody.append($("<p>", { "text": i18n.label(575) }));             //Then travel to the next spacestation:
            var SpaceStationImage = $("<div/>", { "style": "position: relative;left: 45%;margin-top: 10px;margin-bottom: 10px;background: url(images/SpaceStation3_1_60.png);background-size: 60px 60px;width: 60px;height: 60px;" });

            //this.questBody.append($("<div/>", { "class": "questStandardPicSize questSpaceStation" }));
            this.questBody.append(SpaceStationImage);

            var coordinates = (destColRow.col.toString() + '/' + destColRow.row.toString());
            this.questBody.append($("<p>", { "text": i18n.label(576) + coordinates }));  //t the coordinates: 

            super.run();
        }


        check(ship: Ships.Ship, movementXML: Document, arrayIndex: number) {            
                   
            //if (CommModule.newCommNodeTarget(ship.galaxyColRow) !== -1) {
            if (ship.canTrade() ) {

                this.finishQuest();
            }
        }
    }

    new Quest0130();

}
