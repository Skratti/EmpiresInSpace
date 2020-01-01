module CombatMessageModule {

    export var allMessagesById: CombatMessageModule.CombatMessage[] = []; //an array of all user-messages.
    var messageHighestId = 0; //the latest message read. when messages are fetched (e.g. 50 - 100) all messages newer than this id are also transferred
    export var messageCount = 0; //the overall amount of combatMessages

    export var fromNumber: number;
    export var toNumber: number;

    class CombatSide {

        constructor(public Damage: number, public Output: JQuery,public side: number) {            

        }
    }

    export class CombatMessage extends MessageModule.MessageBase {

        CombatId: number;
        AttackerId: number;
        DefenderId: number;
        AttackerUserId  : number;
	    DefenderUserId : number;
        StarId: number;
        SpaceX: number;
        SpaceY: number;
        SystemX: number;
        SystemY: number;
        AttackerDamageDealt: number;
        DefenderDamageDealt: number;
        AttackerHitPointsRemain: number;
        DefenderHitPointsRemain: number;

        AttackerName: string;
        DefenderName: string;

        DefenderHasRead: boolean;
        MessageDT: Date;

        AttackerExperience: number;
        DefenderExperience: number;
        AttackerShipHullId: number;
        DefenderShipHullId: number;
        AttackerShipHullImageId: number;
        DefenderShipHullImageId: number;

        AttackerEvasion: number;
        AttackerMaxHitPoints: number;
        AttackerStartHitpoint: number;
        AttackerHitpoinsForBar: number;
        DefenderEvasion: number;
        DefenderMaxHitPoints: number;
        DefenderStartHitpoint: number;
        DefenderHitpoinsForBar: number;

        AttackerShield: number;
        DefenderShield: number;


        AttackerBarLife: JQuery;
        DefenderBarLife: JQuery;

        CombatRounds: CombatRound[];

        CombatSides: CombatSide[];

        
        constructor(public id: number) {
            super(id);
            this.CombatRounds = [];
            this.CombatSides = [];
        }

        updateText(XMLmessage) {

            var text = XMLmessage.childNodes[0].nodeValue;

            //this.messageText = text;
            this.isRead = true;
            this.loaded = true;
            $(".messageReadBody1").html(text);
            //$(".messageReadHead").html(this.header);
        }

        getMessageText() {

            var xhttp = GetXmlHttpObject();
            if (xhttp == null) {
                return;
            }

            var that = this;

            //xmlMap get the map and draw it:
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4) {
                    var jsonResponse = xhttp.responseText;
                    //console.dirxml(XMLGetBuildingsResponse);
                    //CombatMessageModule.fromNumber = fromNumber;
                    //CombatMessageModule.toNumber = toNumber;
                    receiveResult(jsonResponse);                    
                    that.loaded = true;
                    that.isRead = true;
                    that.createMessagePanel();
                }
            }
            xhttp.open("GET", "Server/Messages.aspx?action=getCombatMessageRounds&combatId=" + this.id, true);
            xhttp.send("");
        }

        /////////////// User Interface:
        showMessage(_parent?: ElementGenerator.WindowManager, tableRow?: JQuery) {
            if (!this.loaded) {
                this.getMessageText();
                if (tableRow !== undefined) {
                    tableRow.css("font-weight", "normal");
                }
                //$('[data-messageheadid="' + this.id + '"] span').css("font-weight", "normal");
            }
            else {
                this.createMessagePanel();
            }   
        }



        createMessageCheckBoxes(popupPanel: JQuery) {
            var panelHeader = $('.relPopupHeader', popupPanel);

            //<label><input name="Checkbox1" type="checkbox">Admin User</label>
            var input = $('<input/>', { text: i18n.label(138), style: "float:left" });
            input.attr("type", "checkbox");

            panelHeader.html(`<table style=" float: right;text-align: left;">
                <tbody> 
                    <tr>
                        <td><input class="showCombatPopup" name="Checkbox1" type = "checkbox" style = "transform:scale(1.5)" > </td>
                        <td> <span>` + i18n.label(1100) + `</span></td>
                    </tr>
                    <tr>
                        <td><input class="showCombatFast" name="Checkbox2" type = "checkbox" style = "transform:scale(1.5)" > </td>
                        <td> <span>` + i18n.label(1101) + `</span></td>
                    </tr>
                </tbody></table>`);

            var showCombatPopupCheckBox = $(".showCombatPopup", panelHeader);
            showCombatPopupCheckBox.prop('checked', mainObject.user.showCombatPopup);
            showCombatPopupCheckBox.click(function () { mainObject.user.setShowCombatPopup(); });



            var showCombatFastCheckBox = $(".showCombatFast", panelHeader);
            showCombatFastCheckBox.prop('checked', mainObject.user.showCombatFast);
            showCombatFastCheckBox.click(function () { mainObject.user.setShowCombatFast(); }); 
        }

        createMessagePanel() {
            this.CombatSides = [];
            Helpers.Log("CombatMessage.createMessagePanel()... " + this.id.toString());


            var popupWindow: ElementGenerator.WindowManager = ElementGenerator.createPopupWindow(4, false, null);
            var popupPanel: JQuery;
            popupPanel = popupWindow.element;//  ElementGenerator.createPopup(4);
            ElementGenerator.adjustPopupZIndex(popupPanel, 12000);
            popupPanel.addClass("header45");

            this.createMessageCheckBoxes(popupPanel);
            popupWindow.setHeader(i18n.label(1102)); //Combat historys
            //1102

            var panelBody = $('.relPanelBody', popupPanel);
            $('.relPopupPanel', popupPanel).addClass("BackgroundDarkGray");

            //Add left, middle and right side
            var attackerShipDiv = $("<div/>", { "class": "CombatAttacker" });
            var middleDiv = $("<div/>", { "class": "CombatMiddle" });
            var defenderShipDiv = $("<div/>", { "class": "CombatDefender" });

            panelBody.append(attackerShipDiv).append(middleDiv).append(defenderShipDiv);

            this.Attacker(attackerShipDiv);
            this.Defender(defenderShipDiv);

            panelBody = middleDiv;

            var messageBodyDiv = $("<div/>");
            var messageBodyText = $("<div/>", { "class": "messageReadBody1", text: ' ' });
            messageBodyDiv.append(messageBodyText);
            panelBody.append(messageBodyDiv);

            var that = this;
            $('.yesButton  span', popupPanel).text(i18n.label(206)); //OK
            $('.yesButton', popupPanel).click((e: JQuery.Event) => { popupPanel.remove(); });

            
            $(".messageReadBody1", popupPanel).html(this.Body2().html);

            var combatRounds = $('.combatRound');
            var index = 0;

            var combatLoopSpeed = mainObject.user.showCombatFast ? 100 : 1000;

            var loop = function () {
                var combatRound = that.CombatSides[index];

                combatRound.Output.fadeIn(
                    combatLoopSpeed,
                    function () {


                        if (combatRound.side == 0)
                            that.AttackerDamaged(combatRound.Damage);
                        else
                            that.DefenderDamaged(combatRound.Damage);

                        combatLoopSpeed = mainObject.user.showCombatFast ? 100 : 1000;
                        
                        var totalHeight = 0;
                        $(".researchTreePanel").children().each(function () {
                            totalHeight = totalHeight + $(this).outerHeight(true);
                        });

                        $(".researchTreePanel").animate({
                            scrollTop: $(".researchTreePanel").scrollTop() + totalHeight
                        }, 500);

                        index = index + 1 < that.CombatSides.length ? index + 1 : 0;
                        if (index != 0)
                            loop();
                        else {
                            //show the last lines
                            $(".combatEnd").fadeIn(100);
                            $(".researchTreePanel").animate({
                                scrollTop: $(".researchTreePanel").scrollTop() + totalHeight
                            }, 100);
                        }
                    }
                );
            };

            loop();

            popupPanel.appendTo("body"); //attach to the <body> element      
        }

        //called by the async return of getMessageText(panel)
        // or directly
        updateMessagePanel(panel: JQuery) {
            Helpers.Log("showmessage2");
   
        }

        Header(): string {

            var labelNo = 429;

            if (this.StarId == 0 || (<StarData>galaxyMap.elementsInArea[this.StarId]).typeId == 5000) {
                if (this.DefenderHitPointsRemain == 0) {
                    
                    if (this.DefenderUserId == mainObject.user.id) {
                        return i18n.label(428).format(this.DefenderName.label(), this.SpaceX.toString(), this.SpaceY.toString()); //Your ship, the {0}, was destroyed at ({1}/{2})
                    } else {
                        return i18n.label(429).format(this.AttackerName.label(), this.DefenderName.label()); //The {0} destroyed the {1}
                    }
                    //labelNo = 429; //angreifer siegt im leerer Raum  : "Die [%AttackerName] zerstörte im System [%SystemName]([%StarX]/[%StarY]) die [%DefenderName]"
                } else {
                    //AttackerHitPointsRemain == 0
                    if (this.AttackerUserId == mainObject.user.id) {
                        return i18n.label(428).format(this.AttackerName.label(), this.SpaceX.toString(), this.SpaceY.toString()); //Your ship, the {0}, was destroyed at ({1}/{2})
                    } else {
                        return i18n.label(429).format(this.DefenderName.label(), this.AttackerName.label()); //The {0} destroyed the {1}
                    }
                }

                //return i18n.label(labelNo).format(this.AttackerName.label(), this.DefenderName.label());

            } else {
              
                // in system:
                var star: StarData = galaxyMap.elementsInArea[this.StarId];
                var starName = star.name;

                if (this.DefenderHitPointsRemain == 0) {
                    if (this.DefenderUserId == mainObject.user.id) {
                        return i18n.label(427).format(this.DefenderName.label(), starName, this.SpaceX.toString(), this.SpaceY.toString(), this.SystemX.toString(), this.SystemY.toString()); //Your ship, the {0}, was destroyed in {1 }({2 } / {3 }) at({4 } / {5 })
                    }

                    return i18n.label(422).format(this.AttackerName.label(), starName, this.SystemX.toString(), this.SystemY.toString(), this.DefenderName.label()); //The {0} destroyed in {1} ({2}/{3}) the {4}
                    //labelNo = 422; //angreifer siegt im Sonnensystem
                } else {
                    if (this.AttackerUserId == mainObject.user.id) {
                        return i18n.label(427).format(this.AttackerName.label(), starName, this.SpaceX.toString(), this.SpaceY.toString(), this.SystemX.toString(), this.SystemY.toString());    //Your ship, the {0}, was destroyed in {1 }({2 } / {3 }) at({4 } / {5 })
                    } else {
                        return i18n.label(422).format(this.DefenderName.label(), starName, this.SystemX.toString(), this.SystemY.toString(), this.AttackerName.label()); //The {0} destroyed in {1} ({2}/{3}) the {4}
                    }
                }
            }


            //return i18n.label(431).format(this.AttackerName, this.DefenderDamageDealt.toString()); //The [%AttackerName] got [%AttDamageReceived] damage and was destroyed..

            //return super.Header();
        }

        createDamageLines(startHitpoint: number, maxHitPoints: number): string {

            if (startHitpoint == maxHitPoints) return '';
            var ratio = 1 - (startHitpoint / maxHitPoints);
            // i18n.label(219)
            var ret = '<tr><td class="tdTextLeft">' + i18n.label(765) + '</td><td class="tdTextRight">-' + ((ratio / 2) * 100).toFixed(0) + '% ' + i18n.label(414) + '</td></tr>'; //+ i18n.label(414)  Damage
            ret += '<tr><td class="tdTextLeft"></td><td class="tdTextRight">-' + (ratio * 100).toFixed(0) + '% ' + i18n.label(729)  + '</td></tr>';  //i18n.label(729) Evasion
            return ret;
            //Damaged: 20%  less Damage ,  40% less Evasion

        }

        HealthbarWidth(maxHitPoints: number, currentHitpoints : number): number {

            if (currentHitpoints == maxHitPoints) return 280;  
            return Math.min(Math.ceil((currentHitpoints / maxHitPoints) * 280), 280);
        }

        AttackerDamaged(amount: number) {
            this.AttackerHitpoinsForBar -= amount;
            this.AttackerBarLife.css("width", this.HealthbarWidth(this.AttackerMaxHitPoints, this.AttackerHitpoinsForBar).toString() + "px");

            $(".AttackerCombatHPState").html(this.AttackerHitpoinsForBar + ' / ' + this.AttackerMaxHitPoints);
        }

        DefenderDamaged(amount: number) {
            this.DefenderHitpoinsForBar -= amount;
            this.DefenderBarLife.css("width", this.HealthbarWidth(this.DefenderMaxHitPoints, this.DefenderHitpoinsForBar).toString() + "px");
            $(".DefenderCombatHPState").html(this.DefenderHitpoinsForBar + ' / ' + this.DefenderMaxHitPoints);
        }



        Attacker(attackerDiv: JQuery) {

            this.AttackerHitpoinsForBar = this.AttackerStartHitpoint;

            //create Attacker image div
            var attackerHull = BaseDataModule.shipHulls[this.AttackerShipHullId];
            var attackerImageSource = "images/" + attackerHull.templateImageUrl;

            if (BaseDataModule.shipHullsImageExists(this.AttackerShipHullImageId)) {
                attackerImageSource = mainObject.imageObjects[BaseDataModule.shipHullsImages[this.AttackerShipHullImageId].templateImageId].texture.src;
            }
            var AttackerImageWidth = mainObject.imageObjects[BaseDataModule.shipHullsImages[this.AttackerShipHullImageId].templateImageId].texture.width;
            var AttackerImagehHeight = mainObject.imageObjects[BaseDataModule.shipHullsImages[this.AttackerShipHullImageId].templateImageId].texture.height;
            AttackerImageWidth = AttackerImageWidth / 2;
            AttackerImagehHeight = AttackerImagehHeight / 2;
            var AttackerImageDiv = $("<div/>", {
                style: "background-image:url(" + attackerImageSource + ");width:" + "280px" + ";height:" + "280px" + ";background-repeat:no-repeat;" + "background-position:center;" + "background-size:" + Math.min(AttackerImageWidth, 120) + "px;"
            });

            attackerDiv.append(AttackerImageDiv);

            //Add health-bar
            var HealthBar = $("<div/>", { "class": "CombatHPBar" });
            this.AttackerBarLife = $("<div/>", { "class": "CombatHPBarState", });
            this.AttackerBarLife.css("width", this.HealthbarWidth(this.AttackerMaxHitPoints, this.AttackerHitpoinsForBar).toString() + "px");
            HealthBar.append(this.AttackerBarLife);
            attackerDiv.append(HealthBar);

            var AttackerDetailTable = '<table class="DetailsTable">';
            var dummyShip = new Ships.Ship(-1);
            dummyShip.shipHullId = this.AttackerShipHullId;
            dummyShip.Experience = this.AttackerExperience;
            AttackerDetailTable += '<tr><td class="tdTextLeft">' + i18n.label(730) + '</td><td class="tdTextRight">' + i18n.label(dummyShip.ExperienceLevelLabel()) + '</td></tr>';
            AttackerDetailTable += '<tr><td class="tdTextLeft">' + i18n.label(729) + '</td><td class="tdTextRight">' + this.AttackerEvasion.toString() + '</td></tr>';
            AttackerDetailTable += '<tr><td class="tdTextLeft">' + i18n.label(218) + '</td><td class="tdTextRight AttackerCombatHPState">' + this.AttackerHitpoinsForBar + ' / ' + this.AttackerMaxHitPoints + '</td></tr>';
            AttackerDetailTable += '<tr><td class="tdTextLeft">' + i18n.label(219) + '</td><td class="tdTextRight">' + this.AttackerShield.toString() + '%' + '</td></tr>';
            AttackerDetailTable += this.createDamageLines(this.AttackerStartHitpoint, this.AttackerMaxHitPoints);
            AttackerDetailTable += '</table>';

            attackerDiv.append(AttackerDetailTable);
            //AttackerImageDiv.css("background-size", "cover");
        }

        Defender(defenderDiv: JQuery) {

            this.DefenderHitpoinsForBar = this.DefenderStartHitpoint;

            var defenderHull = BaseDataModule.shipHulls[this.DefenderShipHullId];
            var defenderImageSource = "images/" + defenderHull.templateImageUrl;

            if (BaseDataModule.shipHullsImageExists(this.DefenderShipHullImageId)) {
                defenderImageSource = mainObject.imageObjects[BaseDataModule.shipHullsImages[this.DefenderShipHullImageId].templateImageId].texture.src;
            }
            var DefenderImageWidth = mainObject.imageObjects[BaseDataModule.shipHullsImages[this.DefenderShipHullImageId].templateImageId].texture.width;
            var DefenderImagehHeight = mainObject.imageObjects[BaseDataModule.shipHullsImages[this.DefenderShipHullImageId].templateImageId].texture.height;
            DefenderImageWidth = DefenderImageWidth / 2;
            DefenderImagehHeight = DefenderImagehHeight / 2;
            var DefenderImageDiv = $("<div/>", { style: "background-image:url(" + defenderImageSource + ");width:" + "280px" + ";height:" + "280px" + ";background-repeat:no-repeat;" + "background-position:center;" + "background-size:" + Math.min(DefenderImageWidth, 120) + "px;" });
            //DefenderImageDiv.css("background-size", "cover");

            defenderDiv.append(DefenderImageDiv);


            //Add health-bar
            var HealthBar = $("<div/>", { "class": "CombatHPBar" });
            this.DefenderBarLife = $("<div/>", { "class": "CombatHPBarState", });
            this.DefenderBarLife.css("width", this.HealthbarWidth(this.DefenderMaxHitPoints, this.DefenderHitpoinsForBar).toString() + "px");
            HealthBar.append(this.DefenderBarLife);
            defenderDiv.append(HealthBar);


            //Defender data table
            var DefenderDetailTable = '<table class="DetailsTable">';
            var dummyShip = new Ships.Ship(-1);
            dummyShip.shipHullId = this.DefenderShipHullId;
            dummyShip.Experience = this.DefenderExperience;
            DefenderDetailTable += '<tr><td class="tdTextLeft">' + i18n.label(730) + '</td><td class="tdTextRight">' + i18n.label(dummyShip.ExperienceLevelLabel()) + '</td></tr>';
            DefenderDetailTable += '<tr><td class="tdTextLeft">' + i18n.label(729) + '</td><td class="tdTextRight">' + this.DefenderEvasion.toString() + '</td></tr>';
            DefenderDetailTable += '<tr><td class="tdTextLeft">' + i18n.label(218) + '</td><td class="tdTextRight DefenderCombatHPState">' + this.DefenderHitpoinsForBar + ' / ' + this.DefenderMaxHitPoints + '</td></tr>';
            DefenderDetailTable += '<tr><td class="tdTextLeft">' + i18n.label(219) + '</td><td class="tdTextRight">' + this.DefenderShield.toString() + '%' + '</td></tr>';
            DefenderDetailTable += this.createDamageLines(this.DefenderStartHitpoint, this.DefenderMaxHitPoints);
            DefenderDetailTable += '</table>';

            defenderDiv.append(DefenderDetailTable);
        }

        Body(): string {
            var newSide = true; //is set when the actual shooting side (defender<->attacker) switches
            var side = 0; //defender (which also shoots first) - switches to 1 (attacker) after the defender has shot
            var tableOpen = false; //if a html table is currently created

            var returnHTML = '';
            

            returnHTML += '<div class="researchTreePanel">';

            //create combatrounds:
            //fadeIn: number = 400;
            for (var i = 0; i < this.CombatRounds.length; i++) {
                var round = this.CombatRounds[i];
                if (round.Side != side) {
                    newSide = true;
                    side = round.Side;
                }

                if (newSide) {
                    if (tableOpen) {
                        returnHTML += '</table><br>';
                        returnHTML += "</div>";
                        tableOpen = false;
                    }

                    returnHTML += side == 0 ? '<div class="DefenderRightSide combatRound" style="display:none">' : '<div class="combatRound" style="display:none">';


                    var DefenderRightSide = "";                  
                    if (side == 0) {
                        DefenderRightSide = " DefenderRightSide";
                        returnHTML += i18n.label(412).format(this.DefenderName.label(), this.AttackerName.label());  // Die Y verteidigt sich gegen die X
                    } else {
                        returnHTML += i18n.label(419).format(this.AttackerName.label());        //Die X greift an
                    }
                    newSide = false;
                    returnHTML += "<br>";
                    returnHTML += '<table class="combatLogTable' + DefenderRightSide +'"><tr>' +
                    '<th>' + i18n.label(413) + '</th>' + //Waffe
                    '<th>' + i18n.label(414) + '</th>' +  //Schaden
                    '<th>' + i18n.label(415) + '</th>' + //Wahrscheinlichkeit
                    '<th>' + i18n.label(416) + '</th>' + //Treffer
                    '</tr>';

                    tableOpen = true;
                }

                //process round:
                var combatLine = 
                    '<tr>' + 
                    '<td>' + mainInterface.createGoodsImageDiv(BaseDataModule.modules[round.ModuleId].goodsId)[0].outerHTML + '</td>' + //Waffe
                    '<td>' + round.Damage.toString() + '</td>' +  //Schaden
                    '<td>' + (round.HitPropability * 100).toFixed(0) + '%</td>' + //Wahrscheinlichkeit
                    '<td>' + (round.IsHit ? "X" : "") + '</td>' + //Treffer
                    '</tr>';

                returnHTML += combatLine;
            }

            if (tableOpen) {
                returnHTML += '</table><br>';
                returnHTML += "</div>";
            }


            //finalize message:
            returnHTML += '<div class="combatEnd" style="display:none;">';
            if (this.DefenderHitPointsRemain == 0) {
                returnHTML += i18n.label(420).format(this.DefenderName.label(), this.AttackerDamageDealt.toString()); //The [%DefenderName] got [%DefDamageReceived] damage and was destroyed.
                returnHTML += '<br>';
                returnHTML += i18n.label(421).format(this.AttackerName.label(), this.DefenderDamageDealt.toString(), this.AttackerHitPointsRemain.toString()); //The [%AttackerName] got [%AttDamageReceived] damage, [%AttHitPointsRemain] hitpoints remain.
            } else {
                returnHTML += i18n.label(432).format(this.DefenderName.label(), this.AttackerDamageDealt.toString(), this.DefenderHitPointsRemain.toString()); //The [%DefenderName] got [%DefDamageReceived] damage, [%DefHitPointsRemain] hitpoints remain.
                returnHTML += '<br>';
                returnHTML += i18n.label(431).format(this.AttackerName.label(), this.DefenderDamageDealt.toString()); //The [%AttackerName] got [%AttDamageReceived] damage and was destroyed..
            }
            returnHTML += "</div>";

            returnHTML += "</div>";


            
            

            return returnHTML;
        }

        Body2(): JQuery {
            var newSide = true; //is set when the actual shooting side (defender<->attacker) switches
            var side = this.CombatRounds[0].Side;   //0 = defender  -  1 (attacker) 
            var tableOpen = false; //if a html table is currently created

            var returnHTML = '';

            var overflowDiv: JQuery = $("<div/>", { "class": "researchTreePanel" });

            var combatRoundDiv = side == 0 ? $("<div/>", { "class": "DefenderRightSide combatRound", "style": "display:none" }) : $("<div/>", { "class": "combatRound", "style": "display:none" });
            var currentTable: JQuery = $("<table/>", { "class": "combatLogTable DefenderRightSide" });

            combatRoundDiv.append(currentTable);

            var currentCombatSide: CombatSide = new CombatSide(0, combatRoundDiv, this.CombatRounds[0].Side);
            this.CombatSides.push(currentCombatSide);
            //this.CombatSides

            //create combatrounds:
            //fadeIn: number = 400;
            for (var i = 0; i < this.CombatRounds.length; i++) {
                var round = this.CombatRounds[i];
                if (round.Side != side) {
                    newSide = true;
                    side = round.Side;
                }

                if (newSide) {

                    var DefenderRightSide = "";
                    if (side == 0) DefenderRightSide = " DefenderRightSide";

                    if (tableOpen) {
                        combatRoundDiv.append(currentTable);
                        overflowDiv.append(combatRoundDiv);
                        combatRoundDiv = $("<div/>", { "class": "combatRound" + DefenderRightSide, "style": "display:none" });
                        currentTable = $("<table/>", { "class": "combatLogTable" + DefenderRightSide }); 

                        currentCombatSide = new CombatSide(0, combatRoundDiv, side);
                        this.CombatSides.push(currentCombatSide);
                    }

                    var combatRoundHeader: JQuery = (side == 0) ?
                        $('<div>' + i18n.label(412).format(this.DefenderName.label(), this.AttackerName.label()) + '</div>') :
                        $('<div>' + i18n.label(419).format(this.AttackerName.label()) + '</div>');
                    combatRoundDiv.append(combatRoundHeader);


                    newSide = false;
                    var headerTR: JQuery = $( '<tr>' +
                        '<th>' + i18n.label(413) + '</th>' + //Waffe
                        '<th>' + i18n.label(414) + '</th>' +  //Schaden
                        '<th>' + i18n.label(415) + '</th>' + //Wahrscheinlichkeit
                        '<th>' + i18n.label(416) + '</th>' + //Treffer
                        '</tr>');
                    currentTable.append(headerTR);

                    tableOpen = true;

                    //save the round-JQuery, so that it can later be show in an animation ant so that the values of the currentRound are also present...
                    round.Output = combatRoundDiv;
                }

                //process round:
                var combatLine =
                    '<tr>' +
                    '<td>' + mainInterface.createGoodsImageDiv(BaseDataModule.modules[round.ModuleId].goodsId)[0].outerHTML + '</td>' + //Waffe
                    '<td>' + round.Damage.toString() + '</td>' +  //Schaden
                    '<td>' + (round.HitPropability * 100).toFixed(0) + '%</td>' + //Wahrscheinlichkeit
                    '<td>' + (round.IsHit ? "X" : "") + '</td>' + //Treffer
                    '</tr>';

                currentCombatSide.Damage += round.IsHit ? round.Damage : 0;

                currentTable.append($(combatLine));
            }

            if (tableOpen) {
                combatRoundDiv.append(currentTable);
                overflowDiv.append(combatRoundDiv);
            }


            //finalize message:
            var bottomLine:string = '<div class="combatEnd" style="display:none;">';
            if (this.DefenderHitPointsRemain == 0) {
                bottomLine += i18n.label(420).format(this.DefenderName.label(), this.AttackerDamageDealt.toString()); //The [%DefenderName] got [%DefDamageReceived] damage and was destroyed.
                bottomLine += '<br>';
                bottomLine += i18n.label(421).format(this.AttackerName.label(), this.DefenderDamageDealt.toString(), this.AttackerHitPointsRemain.toString()); //The [%AttackerName] got [%AttDamageReceived] damage, [%AttHitPointsRemain] hitpoints remain.
            } else {
                bottomLine += i18n.label(432).format(this.DefenderName.label(), this.AttackerDamageDealt.toString(), this.DefenderHitPointsRemain.toString()); //The [%DefenderName] got [%DefDamageReceived] damage, [%DefHitPointsRemain] hitpoints remain.
                bottomLine += '<br>';
                bottomLine += i18n.label(431).format(this.AttackerName.label(), this.DefenderDamageDealt.toString()); //The [%AttackerName] got [%AttDamageReceived] damage and was destroyed..
            }
            overflowDiv.append($(bottomLine));

            //returnHTML += "</div>";





            return overflowDiv;
        }
    }

    export class CombatRound {

        CombatId: number;
        RoundNumber: number;
        ShotNumber: number;
        Side: number;
        ModuleId: number;
        Damage: number;
        HitPropability: number;
        IsHit: boolean;
        Output: JQuery;


        constructor() {
        }
    }

    export function CreateCombatMessageFromJSON(combatJson: CombatMessage): CombatMessage {

        var message: CombatMessage;

        if (CombatMessageModule.allMessagesById[combatJson["CombatId"]] != null) {
            message = CombatMessageModule.allMessagesById[combatJson["CombatId"]];
        } else {
            message = new CombatMessageModule.CombatMessage(combatJson["CombatId"]);
        }

        message.CombatId = combatJson["CombatId"];
        message.AttackerId = combatJson["AttackerId"];
        message.DefenderId = combatJson["DefenderId"];
        message.AttackerUserId = combatJson["AttackerUserId"];
        message.DefenderUserId = combatJson["DefenderUserId"];
        message.StarId = combatJson["StarId"];
        message.SpaceX = combatJson["SpaceX"];
        message.SpaceY = combatJson["SpaceY"];
        message.SystemX = combatJson["SystemX"];
        message.SystemY = combatJson["SystemY"];
        message.AttackerDamageDealt = combatJson["AttackerDamageDealt"];
        message.DefenderDamageDealt = combatJson["DefenderDamageDealt"];
        message.AttackerHitPointsRemain = combatJson["AttackerHitPointsRemain"];
        message.DefenderHitPointsRemain = combatJson["DefenderHitPointsRemain"];

        message.AttackerName = combatJson["AttackerName"];
        message.DefenderName = combatJson["DefenderName"];

        message.DefenderHasRead = combatJson["DefenderHasRead"];
        message.isRead = combatJson["DefenderHasRead"];

        message.AttackerExperience = combatJson["AttackerExperience"];
        message.DefenderExperience = combatJson["DefenderExperience"];
        message.AttackerShipHullId = combatJson["AttackerShipHullId"];
        message.DefenderShipHullId = combatJson["DefenderShipHullId"];
        message.AttackerShipHullImageId = combatJson["AttackerShipHullImageId"];
        message.DefenderShipHullImageId = combatJson["DefenderShipHullImageId"];

        message.AttackerEvasion = combatJson["AttackerEvasion"];
        message.AttackerMaxHitPoints = combatJson["AttackerMaxHitPoints"];
        message.AttackerStartHitpoint = combatJson["AttackerStartHitpoint"];
        message.DefenderEvasion = combatJson["DefenderEvasion"];
        message.DefenderMaxHitPoints = combatJson["DefenderMaxHitPoints"];
        message.DefenderStartHitpoint = combatJson["DefenderStartHitpoint"];

        message.AttackerShield = combatJson["AttackerShield"];
        message.DefenderShield = combatJson["DefenderShield"];
        

        var dtString: string = <any>combatJson["MessageDT"];
        dtString = dtString.substr(6, dtString.length - 8);
        message.messageDT = new Date(parseInt(dtString,10));

        message.CombatRounds = [];
        var length = combatJson["CombatRounds"].length;
        for (var i = 0; i < length; i++) {
            message.CombatRounds.push(CreateCombatRoundFromJSON(combatJson["CombatRounds"][i]));
        }
        return message;
    }

    export function CreateCombatRoundFromJSON(combatJson: CombatRound): CombatRound {
        var round = new CombatRound();

        round.CombatId = combatJson["CombatId"];
        round.RoundNumber = combatJson["RoundNumber"];
        round.ShotNumber = combatJson["ShotNumber"];
        round.Side = combatJson["Side"];
        round.ModuleId = combatJson["ModuleId"];
        round.Damage = combatJson["Damage"];
        round.HitPropability = combatJson["HitPropability"];
        round.IsHit = combatJson["IsHit"];

        return round;
    }

    export function getReceivedMessages(fromNumber: number, toNumber: number) {
      
        var xhttp = GetXmlHttpObject();

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                var jsonResponse = xhttp.responseText;
                //console.dirxml(XMLGetBuildingsResponse);
                CombatMessageModule.fromNumber = fromNumber;
                CombatMessageModule.toNumber = toNumber;
                receiveResult(jsonResponse);
            }
        }
        Helpers.Log("getCombatMessages&fromNr" + fromNumber + "&toNr=" + toNumber + "&messageHighestId=" + messageHighestId );
        Helpers.Log("COMBAT getCombatMessages&fromNr" + fromNumber + "&toNr=" + toNumber + "&messageHighestId=" + messageHighestId);
        
        xhttp.open("GET", "Server/Messages.aspx?action=getCombatMessages&fromNr=" + fromNumber + "&toNr=" + toNumber + "&messageHighestId=" + messageHighestId, true);
        xhttp.send("");
        //
    }

    export function receiveResult(response: string, fadeInMessage = false) {
        var combats: CombatMessage[];
        combats = JSON.parse(response)["messages"];
        var combat: CombatMessage;
        // parse,
        // set some Combat values
        // and convert to sparse array with combatId as key
        var length = combats.length;
        for (var i = 0; i < length; i++) {

            //JSON objects do not have the methods of the class (they are just values) 
            // so parse to the real object class
            combat = CreateCombatMessageFromJSON(combats[i]);

            combat.messageType = 50;

            //set user objects
            if (mainObject.user.id ==  combat.AttackerUserId) {
                combat.sender = mainObject.user;
                combat.isRead = true;
            }
            if (mainObject.user.id == combat.DefenderUserId) {
                combat.receiver = mainObject.user;
            }

            if (mainObject.user.otherUsers[combat.AttackerUserId]) {
                combat.sender = mainObject.user.otherUsers[combat.AttackerUserId];
            }
            if (mainObject.user.otherUsers[combat.DefenderUserId]) {
                combat.receiver = mainObject.user.otherUsers[combat.AttackerUserId];
            }
            combat.header = 'test';
            CombatMessageModule.allMessagesById[combat.id] = combat;

            if (fadeInMessage) {
                mainInterface.addQuickMessage(combat.Header());

                if (mainObject.user.showCombatPopup) {
                    combat.loaded = true;
                    combat.isRead = true;
                    combat.createMessagePanel();
                }
            }
        }
          
        Helpers.Log(length.toString() + " Combat messages added");

        //refresh the display, since the messages were loaded async...
        if ($(".MessagePanel").get(0)) {
            MessageModule.userInterface.showMessages(fromNumber, toNumber);
        }

        return combat;
    }

    function messageExists(id) {
        if (allMessagesById[parseInt(id, 10)] != null)
            return true;
        else
            return false;
    }


}