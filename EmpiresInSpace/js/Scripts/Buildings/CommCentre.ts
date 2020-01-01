/// <reference path="../../References.ts" />
module Scripts {


    class CommCentre extends Scripts.ScriptWithWindow {

        CommCentrePopup: JQuery;

        constructor(_type: number, _id: number) {
            super(_type, _id);

            this.scriptHeader = i18n.label(53);
            this.scriptBody = $('<p/>', { text: "Hier kommt der Aufruf eines einzelnen Forenthread hin. Momentan muß dieser über das rechte Menü 'Kommunikation' aufgerufen werden." });          

            //call super, set scriptType to 1 (Building) and Id to 8 (Commcenter)
            super(1, 8);
            //mainObject.scriptsAdmin.scripts.push(this);         
            this.run();

        }


        //called by constructor, so the selfReference is needed (or another feature had changed the this operator...)
        run() {
            //super.run();

            var commNode = CommModule.commNodeFindOnTile(mainObject.currentColony.parentArea.getCurrentTile());
            commNode.showCommMessages(null);
        }       

    }

    new CommCentre(1, 4);
    //mainObject.scriptsAdmin.scripts.push(new Spaceport());
    //mainObject.scriptsAdmin.find(1, 4).run();

}