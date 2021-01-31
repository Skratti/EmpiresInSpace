/// <reference path="../../References.ts" />

//ShipModuleSimpleModule
module SMSModule {

    export function showModulesPanel() {
        Helpers.Log("showModulesPanel()");
        var windowHandle = ElementGenerator.MainPanel();
        var modulePanel = windowHandle.element;
        $('.yesButton', modulePanel).click((e: JQueryEventObject) => { doColonyModuleProduction(); modulePanel.remove(); });
        $('.noButton', modulePanel).click((e: JQueryEventObject) => { modulePanel.remove(); });
        //$('.noButton', modulePanel)[0].style.display = 'none';
        $('.yesButton span', modulePanel).text(i18n.label(206));
        $('.noButton span', modulePanel).text(i18n.label(207));

        /*var panelHeader = $('.relPopupHeader', modulePanel);
        var caption = $('<h2/>', { text: i18n.label(121), style: "float:left" }); //Module plant
        panelHeader.append(caption);
        */
        windowHandle.setHeader(i18n.label(121));
        var panelBody = $('.relPopupBody', windowHandle.element);
        panelBody.css("background", "black");

        //Level 1 Modules
        var modulesToShow: BaseDataModule.ShipModule[] = [];
        for (var i = 0; i < BaseDataModule.modules.length; i++) {
            if (typeof BaseDataModule.modules[i] === 'undefined') continue; 
            if (!PlayerData.modulesAvailable(i)) continue;
            if (BaseDataModule.modules[i].level != 1) continue;
            modulesToShow.push(BaseDataModule.modules[i]);         
        }
        windowHandle.createTable(panelBody, modulesToShow, SMSModule.createFirstLine, SMSModule.createTableLine, null, 0, null, 25, false); 
        panelBody.append($("<br>"));

        //Level 2 Modules
        var modulesToShow: BaseDataModule.ShipModule[] = [];
        for (var i = 0; i < BaseDataModule.modules.length; i++) {
            if (typeof BaseDataModule.modules[i] === 'undefined') continue;
            if (!PlayerData.modulesAvailable(i)) continue;
            if (BaseDataModule.modules[i].level != 2) continue;
            modulesToShow.push(BaseDataModule.modules[i]);
        }
        if (modulesToShow.length > 0) {
            windowHandle.createTable(panelBody, modulesToShow, SMSModule.createFirstLine, SMSModule.createTableLine, null, 0, null, 25, false);
            panelBody.append($("<br>"));
        }

        //Level 3 Modules
        var modulesToShow: BaseDataModule.ShipModule[] = [];
        for (var i = 0; i < BaseDataModule.modules.length; i++) {
            if (typeof BaseDataModule.modules[i] === 'undefined') continue;
            if (!PlayerData.modulesAvailable(i)) continue;
            if (BaseDataModule.modules[i].level != 3) continue;
            modulesToShow.push(BaseDataModule.modules[i]);
        }
        if (modulesToShow.length > 0) {
            windowHandle.createTable(panelBody, modulesToShow, SMSModule.createFirstLine, SMSModule.createTableLine, null, 0, null, 25, false);
            panelBody.append($("<br>"));
        }
        //Level 4 Modules
        var modulesToShow: BaseDataModule.ShipModule[] = [];
        for (var i = 0; i < BaseDataModule.modules.length; i++) {
            if (typeof BaseDataModule.modules[i] === 'undefined') continue;
            if (!PlayerData.modulesAvailable(i)) continue;
            if (BaseDataModule.modules[i].level != 4) continue;
            modulesToShow.push(BaseDataModule.modules[i]);
        }
        if (modulesToShow.length > 0) {
            windowHandle.createTable(panelBody, modulesToShow, SMSModule.createFirstLine, SMSModule.createTableLine, null, 0, null, 25, false);
            panelBody.append($("<br>"));
        }
           
        //Level 5 Modules
        var modulesToShow: BaseDataModule.ShipModule[] = [];
        for (var i = 0; i < BaseDataModule.modules.length; i++) {
            if (typeof BaseDataModule.modules[i] === 'undefined') continue;
            if (!PlayerData.modulesAvailable(i)) continue;
            if (BaseDataModule.modules[i].level != 5) continue;
            modulesToShow.push(BaseDataModule.modules[i]);
        }
        if (modulesToShow.length > 0) {
            windowHandle.createTable(panelBody, modulesToShow, SMSModule.createFirstLine, SMSModule.createTableLine, null, 0, null, 25, false);
        }
    }
    
    export function createFirstLine(): JQuery {

        var tableRow = $('<tr/>');
        var th = ElementGenerator.headerElement;

       // tableRow.append(th(442, 40, true)); //ID
        tableRow.append(th(184, 160)); //Name
        tableRow.append(th(551, 438)); //Kosten
        tableRow.append(th(281, 85)); //Menge

        return tableRow;
    }


    export function createTableLine(_caller: ElementGenerator.WindowManager, shipModule: BaseDataModule.ShipModule): JQuery {

        var tableRow = $('<tr/>');

       // var tableDataId = $('<td/>', { text: shipModule.id });
      //  tableRow.append(tableDataId);

        var tableDataName = $('<td/>', { text: i18n.label(shipModule.label), "class": "tdTextLeft" });
        tableRow.append(tableDataName);

        var requiredGoods = $('<td/>');               
        for (var goodsIndex = 0; goodsIndex < shipModule.costs.length; goodsIndex++) {
            if (shipModule.costs[goodsIndex] == null) continue;
            var borderColor = shipModule.costs[goodsIndex] > mainObject.currentColony.goods[goodsIndex] ? "borderColorRed" : null;

            var goodsDiv = mainInterface.createGoodsDiv(goodsIndex, shipModule.costs[goodsIndex], borderColor);
            goodsDiv.addClass("floatLeft marginLeft3");
            requiredGoods.append(goodsDiv);
        }
        
        tableRow.append(requiredGoods);

     
        var tableDataToBuild = $('<td/>');
        var currentlyBuild = mainObject.currentColony.amountCurrentlyBuild(4, shipModule.id);
        var buildAmount = $("<input/>", { type: "number", value: currentlyBuild });
        tableDataToBuild.append(buildAmount);
        tableRow.append(tableDataToBuild);
        buildAmount.change(function () { setColonyModuleProduction(shipModule, parseInt((<HTMLInputElement>this).value)); });

        
        return tableRow;
    }

    export function test(msg) {
        mainObject.currentColony.checkColonyBuildQueueXML(msg);
    }

    function setColonyModuleProduction(shipModule: BaseDataModule.ShipModule, newAmount : number) {
        Helpers.Log("shipModule " + shipModule.id + " Colony " + mainObject.currentColony.id + " Anzahl neu " + newAmount);
        //shipModule.
        
        $.ajax("Server/research.aspx", {
            type: "GET",
            async: true,
            data: {
                "action": "setColonyModuleProduction",
                "colonyId": mainObject.currentColony.id.toString(),
                "moduleId": shipModule.id.toString(),
                "amount": newAmount.toString()
            }
        }).done(function (msg) {
            SMSModule.test(msg);                 
        });
    }

    function doColonyModuleProduction() {       

        $.ajax("Server/research.aspx", {
            type: "GET",
            async: true,
            data: {
                "action": "doColonyModuleProduction",
                "colonyId": mainObject.currentColony.id.toString()                
            }
        }).done(function (msg) {
            //SMSModule.test(msg);
            ColonyModule.checkColonyXML(msg);

            mainObject.currentColony.refreshMainScreenStatistics();
            mainInterface.drawAll();        
            mainInterface.refreshQuickInfoGoods();
      
        });
    } 

    class ShipModulesSimpleScript extends Scripts.Script {

        shipModulesSimplePopup: JQuery;

        constructor() {
            //call super, set scriptType to 1 (Building) and Id to 16  (ShipModulesSimple)
            super(1, 16);            
            Scripts.scriptsAdmin.scripts.push(this);            
            //getGameData();
            this.run();
        }

        run() {
            showModulesPanel();
        }
    }
    new ShipModulesSimpleScript();
}