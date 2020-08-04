/// <reference path="../../References.ts" />


module Scripts {
    //0050Colonize
    class Quest0050 extends Scripts.QuestWithCheckScript {       

        checkProxy: (ship: Ships.Ship, movementXML: Document, arrayIndex: number) => void      

        constructor() {
            var questId = 5;
            super(0, questId, QuestModule.colonizeQuests, 237, 239);  


            this.questBody.append($("<br><br>"));
            this.questBody.append($("<div/>", { "class": "questStandardPicSize questColonize" }));

         
        }

        //called by constructor, so the selfReference is needed (or another feature had changed the this operator...)
        run() {
            super.run();
            var body = $('.relPopupBody', this.questPopup);

            //var questImage = $('<div/>', { style: "background-image:url(images/ship.gif);width:34px;height:30px;background-repeat:no-repeat;background-position: 4px 5px" });
            var questImage = $('<div/>', { style: "position: relative;left: 45%;border-radius: 3px;background: rgb(42, 90, 187) url(images/Icons.png) no-repeat -330px 0px;width:30px;height:30px;background-repeat:no-repeat; border: 1px solid #75E0F0;" });

            //var questImage = $('<div/>', { style: "width: 40px height: 40px margin - left: 10px border: 1px solid #75E0F0 -webkit - border - radius: 5px -moz - border - radius: 5px -o - border - radius: 5px border - radius: 5px -ms - border - radius: 5px -webkit - box - shadow: 1px 1px 5px #000 -moz - box - shadow: 1px 1px 5px #000 -o - box - shadow: 1px 1px 5px #000 -ms - box - shadow: 1px 1px 5px #000 box - shadow: 1px 1px 5px #000; background: rgb(57, 191, 191) url(images / ui - icons.png) no - repeat 5px - 204px;" });
            body.append(questImage);     
            body.append($("<br>"));     

            if (mainObject.colonies && mainObject.colonies.length > 0) {
                for (var i = 0; i < mainObject.colonies.length; i++) {
                    if (mainObject.colonies[i] != null && mainObject.colonies[i].owner == mainObject.user.id) {
                        this.finishQuest();
                        return;
                    }
                }
            }
                 
        }

        check(colony: ColonyModule.Colony, arrayIndex: number) {
            Helpers.Log("Quest check(colony...)");
            this.finishQuest();
        }
    }

    new Quest0050();

}
