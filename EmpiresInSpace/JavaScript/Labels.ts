
module i18n {

    export var sqlLabels: string[][] = [];    

    export function setLabels() {
        //game menu
        $("#shipList").attr("title", label(133));
        $("#colonyList").attr("title", label(134));
        $("#messageList").attr("title", label(135));
        $("#contactsList").attr("title", label(136));
        $("#allianceList").attr("title", label(139));
        $("#communicationList").attr("title", label(137));
        $("#tradeList").attr("title", label(143));
        $("#questList").attr("title", label(104));
        $("#researchList").attr("title", label(138));
        $("#galaxy").attr("title", label(811));
        $("#settingsList").attr("title", label(141));
        $("#quitList").attr("title", label(142));

        //$("#turnByUser").text(label(406));        
        $('#turnByUser span').text(i18n.label(406));

        //lower right goods
        //$("#quickInfo-goods-toggle").text(label(178));        
        //$("#quickInfo-modules-toggle").text(label(164));


        mainObject.relationTypes[0].name = label(176);  // War
        mainObject.relationTypes[1].name = label(768);  // Hostile
        mainObject.relationTypes[2].name = label(436);  // Peace
        mainObject.relationTypes[3].name = label(177);  // Trade treaty
        mainObject.relationTypes[4].name = label(441);  // Pact
        mainObject.relationTypes[5].name = label(462);  // Alliance -> only used when players are in the same alliance...

        //Tooltips:
        $("#toolTransfer").attr("title", label(197));
        $("#toolTrade").attr("title", label(188));
        $("#rotate").attr("title", label(198));
        $("#zoomIn").attr("title", label(199));   
        $("#zoomOut").attr("title", label(200));  
        $("#demolish").attr("title", label(349)); // Gebäudeaktivierung 
        $("#harvestNebula").attr("title", label(1023)); // Collect material from nebula
        $("#createSpaceStation").attr("title", label(596)); // createSpaceStation 
        $("#addTranscendence").attr("title", label(597)); // Gebäudeaktivierung 
        $("#attackTarget").attr("title", label(972)); // markiere als Ziel
        $("#design").attr("title", label(205)); // Details 
        $("#TransferButtonX").attr("title", label(207)); // Cancel 

        $("#sentry").attr("title", label(1002)); // Sentry 
        $("#continue").attr("title", label(1004)); // Cancel 
        
        //if ($("#attackTarget").length > -1) $("#attackTarget").tooltip("Mark as Target<br>----------------<br>Sobald ein bewaffnetes Schiff von dir auf dieses Feld zieht, wird das das Schiff, und falls vorhanden seine Eskorte, angegriffen.");


        //Messages:
        MessageModule.messageTypes[10].name = i18n.label(229); //Allgemein
        MessageModule.messageTypes[20].name = i18n.label(231); //Produktion
        MessageModule.messageTypes[30].name = i18n.label(232); //Handel
        MessageModule.messageTypes[40].name = i18n.label(233); //Diplomatie
        MessageModule.messageTypes[50].name = i18n.label(234);  //Kampf
        //MessageModule.messageTypes[60].name = i18n.label(235); //Versendet 235

        //$('#nextTurnTime').text(i18n.label(772) + mainObject.user.nextTurn.toLocaleTimeString());
         
        QuestModule.refreshIconLabels();
    }

    //get a sql label
    export function label(labelId: number): string {
        
        if (sqlLabels[mainObject.user.languageId] == undefined) return 'LANGUAGE NOT LOADED YET';
        if (sqlLabels[mainObject.user.languageId][labelId] == undefined) return 'LABEL NOT FOUND';
        return sqlLabels[mainObject.user.languageId][labelId];       
    } 

    export function languageAdd(XMLlanguages: Document) {
        var XMLAllLabels = XMLlanguages.getElementsByTagName("Labels");

        //normally only one
        for (var i = 0; i < XMLAllLabels.length; i++) {
            var Language = XMLAllLabels[i];
            var languageId = parseInt(Language.getElementsByTagName("languageId")[0].childNodes[0].nodeValue,10);
            var Labels = Language.getElementsByTagName("Label");

            for (var j = 0; j < Labels.length; j++) {
                var labelId = parseInt(Labels[j].getElementsByTagName("id")[0].childNodes[0].nodeValue, 10);
                var labelValue = Labels[j].getElementsByTagName("label")[0].childNodes[0].nodeValue;
                if (sqlLabels[languageId] == undefined) sqlLabels[languageId] = [];
                sqlLabels[languageId][labelId] = labelValue;
            }
            //languages[languageIndex(languageName)].setLabels();
            setLabels();
            Helpers.Log(Labels.length + " labels for language " + languageId + " added");
            mainInterface.addQuickMessage(Labels.length + ' labels loaded', 3000); 
        }
               
    }
}