/// <reference path="../../References.ts" />


module Scripts {

    export class Spaceport extends Scripts.Script {

        windowHandle: ElementGenerator.WindowManager;
        scriptHeader: string;
        scriptBody: JQuery;
        spacePortPopup: JQuery;
        enemyIsInOrbit: boolean;
        moduleView: boolean;

        constructor() {
            super(1, 17);

            this.scriptHeader = i18n.label(119);
            this.moduleView = true;

            //call super, set scriptType to 1 (Building) and Id to 17 (Spaceport)
            

        
            this.run();

        }

        run() {
            this.windowHandle = ElementGenerator.MainPanel();
            this.windowHandle.setHeader(i18n.label(122));
            var panelBody = $('.relPopupBody', this.windowHandle.element);
            this.scriptBody = panelBody;
            
            this.refreshAll();
            
            var buttons = $('.relPopupFooter div', this.spacePortPopup);
           
            var buttonSwitch = $('<button/>', { "class": 'switchButton'});
            buttons.prepend(buttonSwitch);
            buttonSwitch.button();
            buttonSwitch.click((e) => {
                buttonSwitch.removeClass("ui-state-focus ui-state-hover");
                this.moduleView = !this.moduleView;
                this.refreshAll();
                this.setSwitchLabel();
            });
            buttonSwitch.css("margin-right", "20px");
            this.setSwitchLabel();

            $('.noButton', this.spacePortPopup)[0].style.display = 'inline-block';
            $('.noButton span', this.spacePortPopup).text(i18n.label(224));
            $('.yesButton span', this.spacePortPopup).text(i18n.label(206));
            //spaceportContainer.tooltip();
            

            //spaceportContainer.appendTo($("#generatedPanel"));
            $('.noButton', this.spacePortPopup).click(
                (e: JQueryEventObject) => {
                    //Scripts.scriptsAdmin.loadAndRun(3, 1, 'ShipTemplateDesigner.js');
                    Scripts.scriptsAdmin.loadAndRun(3, 1, './ShipTemplateDesigner.js', false, () => { (<any>ShipTemplateDesigner).runTemplate(null); });

                    //questContainer.remove();
                    this.windowHandle.remove();
                });

            this.windowHandle.SetBottom();
            //$('.noButton', body).click((e: JQueryEventObject) => { Scripts.scriptsAdmin.loadAndRun(3, 1, 'ShipTemplateDesigner.js'); spaceportContainer.remove(); });
        }    

        refreshAll() {
            this.scriptBody.empty();

            this.enemyIsInOrbit = this.isEnemyInOrbit();
            if (this.enemyIsInOrbit) {
                this.scriptBody.append($('<p/>', { text: i18n.label(368) })); //Planet wird belagert - Schiffbau nicht möglich
            }

            //create an array with the shipTemplates to show
            var shipTemplates: ShipTemplateModule.ShipTemplate[] = [];
            for (var i = 0; i < ShipTemplateModule.shipTemplates.length; i++) {
                if (ShipTemplateModule.shipTemplates[i] == null) { /*Helpers.Log("null");*/ continue; }
                if (!ShipTemplateModule.shipTemplates[i].constructable) continue;
                if (ShipTemplateModule.shipTemplates[i].obsolete) continue;

                if (!PlayerData.hullsAvailable(ShipTemplateModule.shipTemplates[i].shipHullId)) continue;
                

                shipTemplates.push(ShipTemplateModule.shipTemplates[i]);
            }

            this.windowHandle.createTable(this.scriptBody, shipTemplates, this.createTableHeader, this.shipTemplateLine2, null, 0, this, 20, false); 
           
             
        }

        setSwitchLabel() {
            if (this.moduleView)
                $('.switchButton span', this.spacePortPopup).text(i18n.label(549));
            else
                $('.switchButton span', this.spacePortPopup).text(i18n.label(550));            
        }
        /*
        // in a previous version, ships could be buit for multiple turns, and the buikld-order could be removed with this methods:
        refreshModuleWithSkipConstructionView() {
            var buildTable = $('<table/>', { "class": "fullscreenTable", "cellspacing": 0 });// , style:"border-collapse: collapse;"

            this.enemyIsInOrbit = this.isEnemyInOrbit();
            if (this.enemyIsInOrbit) {
                this.body.append($('<p/>', { text: i18n.label(368) })); //Planet wird belagert - Schiffbau nicht möglich
            }

            if (mainObject.currentColony.shipInConstruction != 0) {

                buildTable.append(this.shipTemplateLine(ShipTemplateModule.shipTemplates[mainObject.currentColony.shipInConstruction], false, this));
                var spacer = $('<tr/>', { "class": "TRspacer trBottomBorder" });
                spacer.append($("<td></td><td></td><td></td><td></td><td></td><td></td>"));
                buildTable.append(spacer);
                var spacer = $('<tr/>', { "class": "TRspacer" });
                buildTable.append(spacer);

            }

            var addRow = false;
            for (var i = 0; i < ShipTemplateModule.shipTemplates.length; i++) {
                //if (typeof ShipTemplateModule.shipTemplates[i] === 'undefined') { Helpers.Log("undef"); continue; }
                if (ShipTemplateModule.shipTemplates[i] == null) {  continue; }
                if (!ShipTemplateModule.shipTemplates[i].constructable) continue;
                if (ShipTemplateModule.shipTemplates[i].obsolete) continue;

                (function createLineClosure(shipTemplate: ShipTemplateModule.ShipTemplate, spacePort: Spaceport) {
                    //create a empty TR  , so that we have a little Sapce between the TRs                
                    if (addRow) {
                        var spacer = $('<tr/>', { "class": "TRspacer" });
                        buildTable.append(spacer);
                    }
                    else
                        addRow = true;

                    buildTable.append(spacePort.shipTemplateLine(shipTemplate, true, spacePort));
                })(ShipTemplateModule.shipTemplates[i], this);
            }

            this.body.append(buildTable);
        }
        */
      

        createTableHeader(): JQuery {

            var tableRow = $('<tr/>');
            var th = ElementGenerator.headerElement;

            tableRow.append(th(null, 30, true)); //image
            tableRow.append(th(443, 140)); //Name
            tableRow.append(th(201, 80)); //Stärke
            tableRow.append(th(551, 425)); //Kosten
            

            return tableRow;
        }
               
        shipTemplateLine2(_caller: ElementGenerator.WindowManager, shipTemplate: ShipTemplateModule.ShipTemplate): JQuery {           
            var tableRow = $('<tr/>');         
            tableRow.addClass("goodsOverflow");
            //shipGif
            var imageSource = mainObject.imageObjects[BaseDataModule.shipHullsImages[shipTemplate.shipHullsImage].objectId].texture.src;
            var tableDataGif = $('<td/>', { "style": "background-image:url(" + imageSource + ");width:30px;height:30px;background-repeat:no-repeat;background-size: 90%;background-position-y: 10px;" });
            tableRow.append(tableDataGif);

            //NAME
            var tableDataName = document.createElement("td");
            var spanName = document.createElement("span") as HTMLSpanElement;
            spanName.innerHTML = shipTemplate.name.label();
            tableDataName.appendChild(spanName);
            tableRow.append(tableDataName);
  
            //Attack + Defense
            var attackDefense = shipTemplate.attack.toString() + "/" + shipTemplate.defense.toString();
            var tableDataAD1 = $('<td/>', { text: attackDefense });
            tableRow.append(tableDataAD1);

            var requiredGoods = $('<td/>');

            //required goods:
            //from hull
            if (this.moduleView) {

                
                var costs: number[] = BaseDataModule.shipHulls[shipTemplate.shipHullId].costs;

                //from ship Hull
                for (var goodsIndex = 0; goodsIndex < costs.length; goodsIndex++) {
                    if (costs[goodsIndex] == null) continue;
                    var borderColor: string;
                    borderColor = null;
                    if (mainObject.currentColony.goods[goodsIndex] == null) borderColor = "borderColorRed";
                    if (costs[goodsIndex] > mainObject.currentColony.goods[goodsIndex]) borderColor = "borderColorRed";

                    var goodsDiv = mainInterface.createGoodsDiv(goodsIndex, costs[goodsIndex], borderColor);
                    goodsDiv.addClass("floatLeft marginLeft3");
                    requiredGoods.append(goodsDiv);
                }
                               
                //from modules
                var costs: number[] = [];
                for (var moduleIndex = 0; moduleIndex < shipTemplate.modulePositions.length; moduleIndex++) {
                    if (shipTemplate.modulePositions[moduleIndex] == null) continue;
                    var goodsId = shipTemplate.modulePositions[moduleIndex].shipmodule.goodsId;

                    if (costs[goodsId] == null) {
                        costs[goodsId] = 1;
                    }
                    else {
                        costs[goodsId] += 1;
                    }                    
                }

                //create divs for modules
                for (var goodsIndex = 0; goodsIndex < costs.length; goodsIndex++) {
                    if (costs[goodsIndex] == null) continue;
                    var borderColor: string;
                    borderColor = null;
                    if (mainObject.currentColony.goods[goodsIndex] == null) borderColor = "borderColorRed";
                    if (costs[goodsIndex] > mainObject.currentColony.goods[goodsIndex]) borderColor = "borderColorRed";

                    var goodsDiv = mainInterface.createGoodsDiv(goodsIndex, costs[goodsIndex], borderColor);
                    goodsDiv.addClass("floatLeft marginLeft3");
                    requiredGoods.append(goodsDiv);
                }


                tableRow.append(requiredGoods);
            }
            else {

                var costs: number[] = [];
                var hullCosts = BaseDataModule.shipHulls[shipTemplate.shipHullId].costs;
                for (var i = 0; i < hullCosts.length; i++) {
                    if (hullCosts[i] == null || hullCosts[i] == 0) continue;

                    if (costs[i] == null) {
                        costs[i] = hullCosts[i];
                    }
                    else {
                        costs[i] += hullCosts[i];
                    }
                }

                //from modules
                for (var moduleIndex = 0; moduleIndex < shipTemplate.modulePositions.length; moduleIndex++) {
                    if (shipTemplate.modulePositions[moduleIndex] == null) continue;

                    var moduleCosts = shipTemplate.modulePositions[moduleIndex].shipmodule.costs;
                    for (var i = 0; i < moduleCosts.length; i++) {
                        if (moduleCosts[i] == null || moduleCosts[i] == 0) continue;

                        if (costs[i] == null) {
                            costs[i] = moduleCosts[i];
                        }
                        else {
                            costs[i] += moduleCosts[i];
                        }
                    }                                       
                }

                //create divs
                for (var goodsIndex = 0; goodsIndex < costs.length; goodsIndex++) {
                    if (costs[goodsIndex] == null) continue;
                    var borderColor: string;
                    borderColor = null;
                    if (mainObject.currentColony.goods[goodsIndex] == null) borderColor = "borderColorRed";
                    if (costs[goodsIndex] > mainObject.currentColony.goods[goodsIndex]) borderColor = "borderColorRed";

                    var goodsDiv = mainInterface.createGoodsDiv(goodsIndex, costs[goodsIndex], borderColor);
                    goodsDiv.addClass("floatLeft marginLeft3");
                    requiredGoods.append(goodsDiv);
                }

                tableRow.append(requiredGoods);
            }

            //Build-Button
            /*
            var shipButtonText = i18n.label(552);
            var buildShip = $('<div/>', { "class": "popupSpaceportShipBuild", text: shipButtonText });
            buildShip.click((e: JQueryEventObject) => { this.spacePortBuildClicked(shipTemplate, true); });

            var buildShipTD = $('<td/>');
            buildShipTD.append(buildShip);
            tableRow.append(buildShipTD);
            */
            tableRow.click((e: JQueryEventObject) => { this.spacePortBuildClicked(shipTemplate, true); });


            return tableRow;
        }

        showError(msg: HTMLCollection) {
            var errorCode = msg[0].getElementsByTagName("errorCode")[0].textContent;
            var errorValue = msg[0].getElementsByTagName("errorValue")[0].textContent;

            /*
             EnemyInSpace = 1, //Ship building not available: An enemy is in orbit
            GoodsAvailability = 2,  //Goods are missing: %1
            Spaceport = 3,  // A spaceport is missing
            Technology = 4 //Ship building not available: Research for module %1 is missing
            */
            var errorText: string;
            switch (errorCode)
            {
                case "1":                    
                    errorText = i18n.label(615);
                    break;
                case "2":
                    var goodId = parseInt(errorValue);                   
                    errorText = i18n.label(616).format(mainObject.findGood(goodId).name);
                    break;
                case "3":
                        errorText = i18n.label(617);
                    break;
                case "4":
                    var moduleId = parseInt(errorValue);     
                    var moduleName = i18n.label(BaseDataModule.getModule(moduleId).label);
                    errorText = i18n.label(618).format(moduleName);
                    break;
                case "5":
                    errorText = i18n.label(951); // "A Transcendence Construct is already under construction on this field";
                    break;
                default: errorText = 'unknown error';
            }

            ElementGenerator.messagePopup(0, errorText);
            window.scrollTo(0,0);
        }


        spacePortBuildClicked(shipTemplate: ShipTemplateModule.ShipTemplate, build: boolean) {

            //Helpers.Log(' Schiff wird gebaut... ')

            if (mainObject.currentColony.shipInConstruction != 0 && build) {
                //Helpers.Log('Ein Schiff wird schon gebaut... ');
                return;
            }

            if (mainObject.currentColony.shipInConstruction == 0 && !build) {
                //Helpers.Log('Es wird kein Schiff gebaut das abgebrochen werden kann... ');
                return;
            }

            if (!build) {
                //Helpers.Log('abbrechen');

                // @userId int,
                //@colonyId int,

                $.ajax("Server/Buildings.aspx", {
                    type: "GET",
                    data: {
                        "action": "cancelBuildShip",
                        "userId": mainObject.user.id,
                        "colonyId": mainObject.currentColony.id
                    }
                }).done(function (msg) {
                    //mainObject.user.getOtherUsersFromXML(msg);
                    //ToDO: update Colony
                    ColonyModule.checkColonyXML(msg);
                    mainInterface.refreshQuickInfoGoods();
                });


                this.spacePortPopup.remove();
                return;
            }



            $.ajax("Server/Buildings.aspx", {
                type: "GET",
                data: {
                    "action": "buildShip",
                    "shipTemplateId": shipTemplate.id,
                    "userId": mainObject.user.id,
                    "colonyId": mainObject.currentColony.id,
                    "fastBuild" : !this.moduleView
                }
            }).done( (msg) => {
                //mainObject.user.getOtherUsersFromXML(msg);
                //ToDO: update Colony

                var error = msg.getElementsByTagName("error");
                if (error.length > 0) {
                    this.showError(error);
                    return;
                }

                ColonyModule.checkColonyXML(msg);
                mainInterface.refreshMainScreenStatistics();
                //mainInterface.refreshQuickInfo();
                mainInterface.refreshQuickInfoGoods();
                mainObject.getShipsFromXML(msg);
                mainInterface.refreshMiddleInfoPanel();
                this.windowHandle.remove();
            });


            //Helpers.Log('spacePortClicked: ' + shipTemplate.name);
            //Helpers.Log('colonyId: ' + mainObject.currentColony.id.toString() + " shipTemplateId: " + shipTemplate.id.toString());

            //refresh:
            //this.refreshAll();
            //this.scriptWindow.remove();

            return;
        }

        isEnemyInOrbit(): boolean
        {
            var shipsInOrbit = mainObject.currentColony.planetArea.shipsInArea.length;
            shipsInOrbit = mainObject.currentColony.getCurrentTile().ships.length
            for (var i = 0; i < shipsInOrbit; i++) {
                if (mainObject.currentColony.getCurrentTile().ships[i].owner != mainObject.user.id)
                {
                    if ( mainObject.user.otherUserFind(mainObject.currentColony.getCurrentTile().ships[i].owner) && mainObject.user.otherUserFind(mainObject.currentColony.getCurrentTile().ships[i].owner).currentRelation == 0)
                        return true;
                }
                   
            }
            return false;
        }
    }

    new Spaceport();
}
//mainObject.scriptsAdmin.scripts.push(new Spaceport());
//mainObject.scriptsAdmin.find(1, 4).run();