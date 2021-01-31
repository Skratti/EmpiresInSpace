/*
Ship Methods:
moveShip()
shipsInScanRange = function (shipXML)
deleteShip()
removeFromOldPosition ()
update = function (shipXML)
updateArea = function (XMLobject)
addScanrange()
addLocalScanrange ()
addGalaxyScanrange ()
removeScanrange()
getCurrentTile()

*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//this is needed to provide tsc hints of the lazy loaded module (see Scripts)
var ShipTemplateDesigner;
(function (ShipTemplateDesigner) {
    var dummy = 0;
})(ShipTemplateDesigner || (ShipTemplateDesigner = {}));
var Ships;
(function (Ships) {
    Ships.Fleets = [];
    var Fleet = /** @class */ (function () {
        function Fleet(FleetId) {
            this.FleetId = FleetId;
            this.FleetShips = [];
            this.IsTemporary = false;
            this.sytemMoves = 1000;
            this.starMoves = 1000;
            this.Active = true;
            this.Sentry = false;
        }
        Fleet.prototype.AddShip = function (ship, save) {
            if (save === void 0) { save = true; }
            if (ship.Fleet && ship.Fleet.FleetId == this.FleetId)
                return;
            this.FleetShips.push(ship);
            ship.Fleet = this;
            ship.FleetId = this.FleetId;
            if (save)
                $.connection.spaceHub.invoke("ShipSetFleetState", ship.id, ship.FleetId);
            this.sytemMoves = Math.min(this.sytemMoves, ship.sytemMoves);
            this.starMoves = Math.min(this.starMoves, ship.starMoves);
            if (ship.MoveShipEndColRow)
                this.MoveFleetEndColRow = ship.MoveShipEndColRow;
        };
        Fleet.prototype.RemoveShip = function (ship) {
            ship.Fleet = null;
            ship.FleetId = null;
            $.connection.spaceHub.invoke("ShipSetFleetState", ship.id, null);
            var IndexOfShip = this.FleetShips.indexOf(ship);
            this.FleetShips.splice(IndexOfShip, 1);
            if (this.FleetShips.length == 0)
                return;
            if (this.FleetShips.length == 1) {
                //disassemble fleet
                this.FleetShips[0].Fleet = null;
                this.FleetShips[0].FleetId = null;
                $.connection.spaceHub.invoke("ShipSetFleetState", this.FleetShips[0].id, null);
                this.FleetShips = [];
                Ships.Fleets[this.FleetId] = null;
            }
            else {
                //recalculate movements points
                this.sytemMoves = 1000;
                this.starMoves = 1000;
                for (var i = 0; i < this.FleetShips.length; i++) {
                    this.sytemMoves = Math.min(this.sytemMoves, this.FleetShips[i].sytemMoves);
                    this.starMoves = Math.min(this.starMoves, this.FleetShips[i].starMoves);
                }
            }
        };
        Fleet.prototype.ShipIds = function () {
            var shipIds = "";
            for (var i = 0; i < this.FleetShips.length; i++) {
                shipIds += (this.FleetShips[i].id.toString() + ";");
            }
            return shipIds;
        };
        Fleet.prototype.RecalcStatistics = function () {
            this.sytemMoves = 1000;
            this.starMoves = 1000;
            for (var i = 0; i < this.FleetShips.length; i++) {
                var ship = this.FleetShips[i];
                this.sytemMoves = Math.min(this.sytemMoves, ship.sytemMoves);
                this.starMoves = Math.min(this.starMoves, ship.starMoves);
            }
        };
        return Fleet;
    }());
    Ships.Fleet = Fleet;
    function RecalcFleetStatistics() {
        for (var i = 0; i < Ships.Fleets.length; i++) {
            if (Ships.Fleets[i] == undefined || Ships.Fleets[i] == null)
                continue;
            Ships.Fleets[i].RecalcStatistics();
        }
    }
    Ships.RecalcFleetStatistics = RecalcFleetStatistics;
    function LoadFleets() {
        for (var i = 0; i < mainObject.ships.length; i++) {
            if (mainObject.ships[i] == null)
                continue;
            if (mainObject.ships[i].owner != mainObject.user.id)
                continue;
            if (mainObject.ships[i].FleetId == null)
                continue;
            var FleetId = mainObject.ships[i].FleetId;
            if (Ships.Fleets[FleetId]) {
                Ships.Fleets[FleetId].AddShip(mainObject.ships[i], false);
            }
            else {
                var NewFleet = new Fleet(FleetId);
                NewFleet.AddShip(mainObject.ships[i], false);
                Ships.Fleets[FleetId] = NewFleet;
            }
        }
    }
    Ships.LoadFleets = LoadFleets;
    function MakeFleet(save, ship1, ship2) {
        if (save === void 0) { save = true; }
        if (ship1 === void 0) { ship1 = null; }
        if (ship2 === void 0) { ship2 = null; }
        var FleetId = Ships.Fleets.length;
        Ships.Fleets[FleetId] = new Fleet(FleetId);
        if (ship1)
            Ships.Fleets[FleetId].AddShip(ship1);
        if (ship2)
            Ships.Fleets[FleetId].AddShip(ship2);
        return Ships.Fleets[FleetId];
    }
    Ships.MakeFleet = MakeFleet;
    var ModulePosition = /** @class */ (function () {
        function ModulePosition() {
        }
        ModulePosition.prototype.createCopy = function () {
            var copied = new ModulePosition();
            copied.posX = this.posX;
            copied.posY = this.posY;
            copied.shipmoduleId = this.shipmoduleId;
            copied.shipmodule = this.shipmodule;
            return copied;
        };
        ModulePosition.prototype.getModule = function () {
            if (BaseDataModule.moduleExists(this.shipmoduleId)) {
                this.shipmodule = BaseDataModule.modules[this.shipmoduleId];
                //Helpers.Log('newModule.shipmodule = BaseDataModule.modules[moduleId];');
            }
            else {
                //Helpers.Log('newModule.shipmodule = null');
            }
        };
        return ModulePosition;
    }());
    Ships.ModulePosition = ModulePosition;
    var ShipTranscension = /** @class */ (function () {
        function ShipTranscension() {
            this.helperMinimumRelation = 1;
            this.transAddCount = 0;
            this.transAddNeeded = 22;
            this.finishedInTurn = 0;
            this.finishingNumber = 0;
            this.shipTranscensionUsers = []; // userId -> amount of ressource provided
        }
        ShipTranscension.prototype.amountInvested = function () {
            var amount = 0;
            for (var i = 0; i < this.shipTranscensionUsers.length; i++) {
                if (this.shipTranscensionUsers[i] != null)
                    amount += this.shipTranscensionUsers[i].amount;
            }
            return amount || this.transAddCount;
        };
        ShipTranscension.prototype.userHasHelped = function () {
            for (var i = 0; i < this.shipTranscensionUsers.length; i++) {
                if (this.shipTranscensionUsers[i] != null && this.shipTranscensionUsers[i].userId == mainObject.user.id)
                    return true;
            }
            return false;
        };
        return ShipTranscension;
    }());
    Ships.ShipTranscension = ShipTranscension;
    var Ship = /** @class */ (function (_super) {
        __extends(Ship, _super);
        function Ship(id) {
            var _this = _super.call(this) || this;
            _this.id = id;
            //SpaceObject.call(this);
            _this.Fleet = null;
            _this.typeId = 5; //typeId references objecttTpes
            _this.systemId = 0;
            /*colRow = { col: 1, row: 1 }; //used for drawing on the mainInterface (selecting the right tile for this ship)
            galaxyColRow = { col: 1, row: 1 };
            starColRow = { col: 1, row: 1 };
            */
            _this.systemMapX = 0;
            _this.systemMapY = 0;
            //this.X = 0;
            //this.Y = 0
            _this.systemMovesPerTurn = 0;
            _this.galaxyMovesPerTurn = 0;
            _this.sytemMoves = 30;
            _this.systemMovesMax = 60;
            _this.starMoves = 10;
            _this.galaxyMovesMax = 20;
            _this.hitpoints = 5;
            _this.currentHitpoints = 1;
            _this.damagereduction = 0;
            _this.maxHitpoints = 5;
            _this.attack = 1;
            _this.defense = 1;
            _this.energy = 0;
            _this.crew = 0;
            _this.cargoroom = 0;
            _this.fuelroom = 0;
            _this.population = 0;
            _this.shipHullsImage = 0;
            //scanRange = 5;
            _this.isColonizer = false;
            _this.shipHullId = 1;
            _this.templateId = 1;
            _this.modulePositions = [];
            //area = null; //reference to an object that inherits AreaSpecifications - can be galaxyMap, solarMap and so on
            _this.movemementCounter = 0; //needed during movement
            _this.hasTradeOffers = false; // is set to true if the ship has offers. Offers are deleted when the ship is moved
            _this.ownerCurrentlyChecked = false; //is set when the owner was unknown, and is updated at the moment (so that the update is not done a second time)
            _this.lastMovedAt = new Date().getTime() - 1000;
            _this.lastMovedFromGalaxyPosition = { col: 1, row: 1 };
            _this.lastMovedFromStarSystemPosition = { col: 1, row: 1 };
            _this.refitCounter = 0;
            _this.MoveShipStartColRow = null;
            _this.MoveShipEndColRow = null;
            _this.neededEnergy = 0;
            _this.neededCrew = 0;
            _this.isSaved = true;
            _this.transcension = null;
            _this.Experience = 0;
            _this.FleetId = null;
            _this.Sentry = false;
            _this.TargetX = null;
            _this.TargetY = null;
            _this.MovementRoute = null;
            _this.Harvesting = false;
            _this.Targeted = false;
            _this.ServerVersion = 0;
            _this.Active = true;
            return _this;
        }
        //implemented in globals.ts class ShipTemplateStatistics, and inserted by mixin
        Ship.prototype.getFactor = function (baseValue, count, factor) { return 0; };
        Ship.prototype.applyFactor = function (baseValue, count, factor) { return 0; };
        Ship.prototype.recalcStats = function () { };
        Ship.prototype.removeModuleAtPosition = function (targetPosition) { };
        Ship.prototype.insertModuleAtPosition = function (targetPosition, shipmodule) { };
        Ship.prototype.changeModuleInTemplate = function (shipModule, factor, speedFactor) {
            if (speedFactor === void 0) { speedFactor = 1; }
        };
        Ship.prototype.createDuplicate = function () {
            var duplicate = new Ship(-1);
            duplicate.id = this.id;
            duplicate.owner = this.owner;
            duplicate.name = this.name;
            duplicate.crew = this.crew;
            duplicate.energy = this.energy;
            duplicate.neededCrew = this.crew;
            duplicate.neededEnergy = this.energy;
            duplicate.scanRange = this.scanRange;
            duplicate.attack = this.attack;
            duplicate.defense = this.defense;
            duplicate.hitpoints = this.hitpoints;
            duplicate.currentHitpoints = this.currentHitpoints;
            duplicate.systemMovesPerTurn = this.systemMovesPerTurn;
            duplicate.galaxyMovesPerTurn = this.galaxyMovesPerTurn;
            duplicate.systemMovesMax = this.systemMovesMax;
            duplicate.galaxyMovesMax = this.galaxyMovesMax;
            duplicate.cargoroom = this.cargoroom;
            duplicate.fuelroom = this.fuelroom;
            duplicate.isColonizer = this.isColonizer;
            duplicate.shipHullId = this.shipHullId;
            duplicate.shipHullsImage = this.shipHullsImage;
            duplicate.refitCounter = this.refitCounter;
            for (var i = 0; i < this.modulePositions.length; i++) {
                duplicate.modulePositions[i] = this.modulePositions[i].createCopy();
            }
            for (var i = 0; i < this.goods.length; i++) {
                duplicate.goods[i] = this.goods[i];
            }
            duplicate.recalcStats();
            return duplicate;
        };
        Ship.prototype.MarkAsTarget = function () {
            if (this.owner == 0) {
                this.Targeted = false;
                return;
            }
            this.Targeted = !this.Targeted;
            DrawInterface.refreshMiddleInfoPanel();
        };
        Ship.prototype.createTagFreeName = function () {
            this.tagFreeName = $("<div/>").html(this.name || '').text();
        };
        Ship.prototype.shortTagFreeName = function () {
            var strLen = Math.min(this.tagFreeName.length, 22);
            return this.tagFreeName.substr(0, strLen).label();
        };
        Ship.prototype.getTemplate = function () {
            if (ShipTemplateModule.templateExists(this.templateId))
                return ShipTemplateModule.getTemplate(this.templateId);
            return null;
        };
        Ship.prototype.renameShip = function (refreshFunction) {
            var _this = this;
            var newNameContainer = ElementGenerator.createPopup(1);
            ElementGenerator.adjustPopupZIndex(newNameContainer, 20000);
            var body = $('.relPopupBody', newNameContainer);
            var caption = $('<h4/>', { text: "Schiff umbenennen " });
            $(".relPopupHeader", newNameContainer).append(caption);
            body.append($("<br>")).append($("<br>"));
            var newNameInput = $('<input/>', { style: "width : 170px;" });
            newNameInput.val(this.name);
            body.append(newNameInput);
            //launchScount.click((e) => { launchScout(mainObject.currentSurfaceField.surfaceFieldId); scoutContainer.remove(); });
            var callAfterRename = refreshFunction;
            ElementGenerator.makeSmall(newNameContainer);
            $(".buttonUl", newNameContainer).css("right", "-10px");
            $('.noButton', newNameContainer).click(function (e) {
                newNameContainer.remove();
            });
            $('.noButton span', newNameContainer).text('Abbrechen');
            $('.yesButton span', newNameContainer).text('OK');
            newNameContainer.appendTo("body"); //attach to the <body> element
            $('.yesButton', newNameContainer).click(function (e) {
                var newName = newNameInput.val();
                $.ajax("Server/Ships.aspx", {
                    type: "GET",
                    async: true,
                    data: {
                        "action": "renameShip",
                        "shipId": _this.id.toString(),
                        "newName": newName
                    }
                });
                newNameContainer.remove();
                _this.name = newName.toString();
                _this.createTagFreeName();
                Ships.UserInterface.refreshMainScreenStatistics(_this);
                //if (callAfterRename != null) callAfterRename();
            });
            Helpers.Log("renameShip");
        };
        Ship.prototype.selectAndCenter = function (offset) {
            if (offset === void 0) { offset = 0; }
            /// <summary>Sets a ship as currentShip and centers map on it.</summary>
            mainObject.deselectObject();
            PanelController.showInfoPanel(PanelController.PanelChoice.Canvas);
            mainObject.selectedObject = this;
            mainObject.currentShip = this;
            mainObject.currentColony = null;
            //load ship Area and switch (if needed)
            this.parentArea.loadAndSwitchThisMap();
            mainObject.selectShip(this);
            //userInputMethods.showCanvas();
            mainInterface.scrollToPosition(this.colRow.col, this.colRow.row, offset);
            /*
            if (!this.systemId || this.systemId < 1) {
                mainInterface.scrollToPosition(this.colRow.col, this.colRow.row, offset);
            }*/
            mainInterface.drawAll();
            mainInterface.refreshQuickInfoGoods();
            PanelController.showInfoPanel(PanelController.PanelChoice.Ship);
        };
        //called when a ship is moved by a mouse-drag or by finger
        // or when the ship did already made one move, but the endpoint is still further away 
        Ship.prototype.dragShip = function (moveShipEndColRow, steps) {
            if (this.Fleet)
                this.Fleet.MoveFleetEndColRow = moveShipEndColRow;
            Helpers.Log("Set MoveShipEndColRow : " + moveShipEndColRow.col.toString() + '/' + moveShipEndColRow.row.toString());
            this.MoveShipEndColRow = moveShipEndColRow;
            if (steps == null) {
                steps = Pathfinder.findPath(this.colRow.col, this.colRow.row, moveShipEndColRow.col, moveShipEndColRow.row, 1);
                steps.pop();
            }
            /// <summary>Moves a ship to a new position.</summary>
            /// <param name="moveShipEndColRow" type="Object"> an object having the attributes col + row</param>   
            var that = this;
            var stepCount = steps.length;
            if (stepCount == 0) {
                FogOfWarModule.fog.save(true);
                return;
            }
            if (stepCount == 1 && steps[0].FieldCost == 0) {
                FogOfWarModule.fog.save(true);
                return;
            }
            var nextStep = steps.pop();
            //determine the direction that the ship should fly
            var start = { col: this.colRow.col, row: this.colRow.row };
            var col = 0;
            var row = 0;
            if (start.col < nextStep.x)
                col = 1;
            if (start.col > nextStep.x)
                col = -1;
            if (start.row < nextStep.y)
                row = 1;
            if (start.row > nextStep.y)
                row = -1;
            //the timer calls moveShip again, until the ship reaches its destination
            //the counter can be interrupted by returnvalue movementType if its value is != (1 or 5)
            if (col != 0 || row != 0) {
                this.movemementCounter++;
                //Helpers.Log(this.name);
                var movementType = this.moveShip({ col: col, row: row });
                this.checkAfterMovement();
                mainInterface.drawAll();
                //Helpers.Log('moveShipEndColRow.movementType ' + movementType);
                // normal flight (1 = interstellar, 5 = in system)
                if (!(movementType == 1 || movementType == 5)) {
                    this.movemementCounter = 0;
                    this.Fleet && this.Fleet.RecalcStatistics();
                    Helpers.Log('endFlight');
                    FogOfWarModule.fog.save(true);
                    return;
                }
                //todo: detect timeout for movement: ship should move about 2-3 fields per second. 
                if (this.movemementCounter < 25) {
                    this.timeOutInstance = setTimeout(function () { that.dragShip(moveShipEndColRow, steps); }, 150);
                    //Helpers.Log('timeOutInstance : ' + this.timeOutInstance);
                }
                else
                    this.movemementCounter = 0;
            }
            else {
                this.movemementCounter = 0;
                Helpers.Log('endFlight');
                FogOfWarModule.fog.save(true);
            }
            this.Fleet && this.Fleet.RecalcStatistics();
            PanelController.showInfoPanel(PanelController.PanelChoice.Ship);
            // normal movement ends with switching to the next unit if no more movement points are present
            if ((this.systemId && !this.sytemMoves)
                || (!this.systemId && !this.starMoves)) {
                clearTimeout(this.timeOutInstance);
                this.MoveShipEndColRow = null;
                mainObject.SelectNextShip();
            }
        };
        //called when a ship is moved by a mouse-drag or by finger
        // or when the ship did already made one move, but the endpoint is still further away 
        Ship.prototype.dragShipOLD = function (moveShipEndColRow) {
            /// <summary>Moves a ship to a new position.</summary>
            /// <param name="moveShipEndColRow" type="Object"> an object having the attributes col + row</param>   
            var that = this;
            var start = { col: this.colRow.col, row: this.colRow.row };
            var col = 0;
            var row = 0;
            if (start.col < moveShipEndColRow.col)
                col = 1;
            if (start.col > moveShipEndColRow.col)
                col = -1;
            if (start.row < moveShipEndColRow.row)
                row = 1;
            if (start.row > moveShipEndColRow.row)
                row = -1;
            //the timer calls moveShip again, until the ship reaches its destination
            //the counter can be interrupted by ?
            if (col != 0 || row != 0) {
                this.movemementCounter++;
                //Helpers.Log(this.name);
                var movementType = this.moveShip({ col: col, row: row });
                this.checkAfterMovement();
                mainInterface.drawAll();
                //Helpers.Log('moveShipEndColRow.movementType ' + movementType);
                // normal flight
                if (!(movementType == 1 || movementType == 5)) {
                    this.movemementCounter = 0;
                    Helpers.Log('endFlight');
                    FogOfWarModule.fog.save(true);
                    return;
                }
                //todo: detect timeout for movement: ship should move about 2-3 fields per second. 
                if (this.movemementCounter < 25) {
                    this.timeOutInstance = setTimeout(function () { that.dragShipOLD(moveShipEndColRow); }, 150);
                    //Helpers.Log('timeOutInstance : ' + this.timeOutInstance);
                }
                else
                    this.movemementCounter = 0;
            }
            else {
                this.movemementCounter = 0;
                Helpers.Log('endFlight');
                FogOfWarModule.fog.save(true);
            }
            PanelController.showInfoPanel(PanelController.PanelChoice.Ship);
        };
        Ship.prototype.checkAfterMovement = function () {
            //check against unvisited CommNodes:
            if (CommModule.newCommNodeTarget(this.galaxyColRow) !== -1) {
                this.sendCheckCommNode(CommModule.newCommNodeTarget(this.galaxyColRow));
            }
        };
        Ship.prototype.sendCheckCommNode = function (commNodeId) {
            var xhttp = GetXmlHttpObject();
            xhttp.open("GET", "Server/Ships.aspx?action=checkCommNode&shipId=" + this.id
                + "&commNodeId=" + commNodeId.toString(), false);
            xhttp.send("");
            var z = xhttp.responseXML;
            if (z != null) {
                CommModule.getNodesFromXML(z);
                //mainObject.user.getOtherUsersFromXML(z);
                //AllianceModule.getAllianceDataFromXML(z);
            }
        };
        Ship.prototype.Besiege = function () {
            $.ajax("Server/Ships.aspx", {
                type: "GET",
                async: true,
                data: {
                    "action": "Besiege",
                    "shipId": this.id.toString()
                }
            });
        };
        Ship.prototype.removeTradeOffers = function () {
            $.ajax("Server/TradeTransfer.aspx", {
                type: "GET",
                async: true,
                data: {
                    "action": "deleteSOTrade",
                    "objectId": this.id,
                    "objectType": 0
                }
            });
            for (var i = 0; i < TradeOffersModule.tradeOffers.length; i++) {
                if (typeof TradeOffersModule.tradeOffers[i] === 'undefined') { /*Helpers.Log("undef");*/
                    continue;
                }
                if (!(TradeOffersModule.tradeOffers[i].creatorId == this.id && TradeOffersModule.tradeOffers[i].objectType == 0))
                    continue;
                delete TradeOffersModule.tradeOffers[i];
            }
        };
        Ship.prototype.MovementSiege = function () {
            if (this.isTroopTransport()) {
                var currentTile = this.getCurrentTile();
                if (currentTile != null) {
                    if (currentTile.astronomicalObject !== null) {
                        if (currentTile.astronomicalObject instanceof PlanetData) {
                            if (currentTile.astronomicalObject.colony != null) {
                                var colonyToBesiege = currentTile.astronomicalObject.colony;
                                if (colonyToBesiege.BesiegedBy == 0 && colonyToBesiege.owner != this.owner) {
                                    if (mainObject.user.otherUserFind(colonyToBesiege.owner).currentRelation == 0) {
                                        this.Besiege();
                                        colonyToBesiege.BesiegedBy = this.owner;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        Ship.prototype.Movement = function (z, targetPosition) {
            DrawInterface.ScreenUpdate = true;
            if (z == null) {
                //Helpers.Log('ship.moveShip() - no ajax response ');
                return 96;
            }
            var result = 94;
            result = parseInt(z.getElementsByTagName("result")[0].childNodes[0].nodeValue);
            //Helpers.Log("result:" + result);
            //flight may be stopped due to an invisible frontier (created by a colony not known yet and out of range
            if (result == 31) {
                var starsFromXML = z.getElementsByTagName("star");
                for (var i = 0; i < starsFromXML.length; i++) {
                    //starUpdate(starsFromXML[i]);
                    galaxyMap.SolarObjectsUpdate(starsFromXML[i]);
                }
                ColonyModule.checkColonyXML(z);
                ColonyModule.getColonyBuildingFromXML(z);
                StarMapModule.ReCreateBorders();
            }
            ////result 1 (Flug Interstellar), 5 (Flug System), 7 Einflug , 8 Ausflug, 14 Angriff,  15 (Schrott)');            
            if (result != 1 && result != 5 && result != 7 && result != 8 && result != 14 && result != 15) {
                return 95;
            }
            if (this.Fleet == null) {
                var Fleet = Ships.MakeFleet(false);
                Fleet.AddShip(this, false);
                Fleet.IsTemporary = true;
            }
            $.each(this.Fleet.FleetShips, function (index, ship) {
                ship.removeScanrange();
                //alert(index + ": " + value);
            });
            //this.removeScanrange();
            var combatMessage = z.getElementsByTagName("combatLog")
                && z.getElementsByTagName("combatLog")[0]
                && z.getElementsByTagName("combatLog")[0].childNodes
                && z.getElementsByTagName("combatLog")[0].childNodes[0]
                && z.getElementsByTagName("combatLog")[0].childNodes[0].nodeValue
                || null;
            if (combatMessage != null) {
                CombatMessageModule.receiveResult(combatMessage, true);
            }
            var starsFromXML = z.getElementsByTagName("star");
            for (var i = 0; i < starsFromXML.length; i++) {
                //starUpdate(starsFromXML[i]);
                galaxyMap.SolarObjectsUpdate(starsFromXML[i]);
            }
            //update all ships included in the response
            var shipsFromXML = z.getElementsByTagName("ship");
            for (var i = 0; i < shipsFromXML.length; i++) {
                var currentXmlShipId = parseInt(shipsFromXML[i].getElementsByTagName("shipId")[0].childNodes[0].nodeValue);
                var IndexOfXMLInFleet = -1;
                for (var j = 0; j < this.Fleet.FleetShips.length; j++) {
                    if (this.Fleet.FleetShips[j].id == currentXmlShipId)
                        IndexOfXMLInFleet = j;
                }
                if (IndexOfXMLInFleet != -1) {
                    var CurrentFleetShip = this.Fleet.FleetShips[IndexOfXMLInFleet];
                    if (result == 7 || result == 8) {
                        //get the starData if it is not loaded yet
                        var tile = CurrentFleetShip.parentArea.tilemap.findCreateTile(targetPosition);
                        if (result == 7)
                            tile.astronomicalObject.loadAndSwitchThisMap(); // für den Einflug wichtg, um das System zu laden
                        CurrentFleetShip.parentArea.removeShipFromArea(CurrentFleetShip);
                        CurrentFleetShip.removeFromOldPosition();
                        CurrentFleetShip.parentArea = null;
                        CurrentFleetShip.updateArea(shipsFromXML[i]);
                        CurrentFleetShip.MoveShipEndColRow = null;
                    }
                    CurrentFleetShip.update(shipsFromXML[i], false, true);
                }
                else
                    mainObject.shipUpdate(shipsFromXML[i], true);
            }
            //check which ships were previously in the scanRange, but not anymore in the XMLResult
            var shipsPreviouslyInNewScanRange = this.shipsInScanRange();
            for (var i = 0; i < shipsFromXML.length; i++) {
                var scannedShipId = parseInt(shipsFromXML[i].getElementsByTagName("shipId")[0].childNodes[0].nodeValue, 10);
                for (var j = 0; j < shipsPreviouslyInNewScanRange.length; j++) {
                    if (shipsPreviouslyInNewScanRange[j] == scannedShipId)
                        shipsPreviouslyInNewScanRange.splice(j, 1);
                }
            }
            for (var j = 0; j < shipsPreviouslyInNewScanRange.length; j++) {
                mainObject.ships[mainObject.parseInt(shipsPreviouslyInNewScanRange[mainObject.parseInt(j)])].deleteShip();
            }
            ColonyModule.checkColonyXML(z);
            ColonyModule.getColonyBuildingFromXML(z);
            //this.addScanrange();
            $.each(this.Fleet.FleetShips, function (index, ship) {
                ship.addScanrange();
                //alert(index + ": " + value);
            });
            FogOfWarModule.fog.save(false);
            //show reduced movement points            
            UserInterface.refreshMainScreenStatistics(this);
            PanelController.showInfoPanel(PanelController.PanelChoice.Ship);
            //Enter or leave System
            if (result == 7 || result == 8) {
                this.parentArea.switchInterfaceToThisMap();
                this.selectAndCenter();
            }
            //if besieger and above an enemy colony which is not yet besieged, send besiege-signal and change values:
            this.MovementSiege();
            this.setShipRelatedButtons();
            //Quests
            for (var i = 0; i < QuestModule.movementQuests.length; i++) {
                var temp = QuestModule.movementQuests[i](this, z, i);
                if (temp != null)
                    result = temp;
            }
            if (this.Fleet.IsTemporary) {
                this.Fleet.IsTemporary = false;
                this.Fleet.RemoveShip(this);
            }
            return result;
        };
        Ship.prototype.moveShip = function (direction) {
            var targetPosition = { col: mainObject.parseInt(this.colRow.col) + mainObject.parseInt(direction.col), row: mainObject.parseInt(this.colRow.row) + mainObject.parseInt(direction.row) };
            if (mainObject.currentShip == null)
                return 100;
            if (mainObject.currentShip.owner != mainObject.user.id)
                return 99;
            if (!mainObject.currentShip.systemId && mainObject.currentShip.starMoves <= 0)
                return 98;
            if (mainObject.currentShip.systemId
                && targetPosition.col > -1
                && targetPosition.row > -1
                && targetPosition.col < this.parentArea.size
                && targetPosition.row < this.parentArea.size
                && mainObject.currentShip.sytemMoves <= 0)
                return 97;
            //check Movement out of system
            if (mainObject.currentShip.systemId
                && (targetPosition.col < 0
                    || targetPosition.row < 0
                    || targetPosition.col >= this.parentArea.size
                    || targetPosition.row >= this.parentArea.size)
                && mainObject.currentShip.starMoves <= 0)
                return 96;
            if (this.hasTradeOffers) {
                this.removeTradeOffers();
            }
            this.getCurrentTile();
            //Helpers.Log(this.id);
            //Helpers.Log('vorher ' + this.colRow.col);
            //check result
            //a list of ships and stars that are in the scan-range of the moved ship
            //these have to be compared with current data, and if a change is present this change has to be saved and the mainInterface redrawn    
            //send the move-command to the server
            var xhttp = GetXmlHttpObject();
            //Helpers.Log("Server/Ships.aspx?action=move&shipId=" + this.id
            //   + "&direction=" + colRowDirection2Int(direction));
            var shipIds = this.id.toString();
            if (this.Fleet) {
                shipIds = "";
                for (var i = 0; i < this.Fleet.FleetShips.length; i++) {
                    shipIds += (this.Fleet.FleetShips[i].id.toString() + ";");
                }
            }
            var Address = "Server/Ships.aspx?action=move&shipId=" + shipIds
                + "&direction=" + colRowDirection2Int(direction);
            //check if destination contains a ship that is marked as target:         
            if (this.parentArea.tilemap.tileExist(targetPosition)) {
                var tile = this.parentArea.tilemap.map[mainObject.parseInt(targetPosition.col)][mainObject.parseInt(targetPosition.row)];
                for (var x = 0; x < tile.ships.length; x++) {
                    if (tile.ships[x] && tile.ships[x].Targeted) {
                        Address += "&attackedShipId=" + tile.ships[x].id;
                        break;
                    }
                }
            }
            //xhttp.open("GET", "Server/Ships.aspx?action=move&shipId=" + this.id
            //    + "&direction=" + colRowDirection2Int(direction), false);
            xhttp.open("GET", Address, false);
            xhttp.send("");
            return this.Movement(xhttp.responseXML, targetPosition);
        };
        Ship.prototype.colonize = function () {
            //check number of colony against administration
            var _this = this;
            var currentTile = this.getCurrentTile();
            /*
            //check if a colony does already exist in this system:
            var MajorColony: ColonyModule.Colony = null;
            for (var i = 0; i < mainObject.colonies.length; i++) {
                if (mainObject.colonies[i] == null) continue;
                if (mainObject.colonies[i].owner == this.owner
                    && mainObject.colonies[i].parentArea.Id == currentTile.stars.parentArea.Id) {
                    Helpers.Log("Colony present OK " + currentTile.stars.parentArea.Id);
                    MajorColony = mainObject.colonies[i];
                    break;
                }
            }
            */
            if (mainObject.imageObjects[currentTile.astronomicalObject.typeId].isMainColony()) {
                ////create major colony
                var starSystemName = this.getCurrentTile().astronomicalObject.parentArea.name;
                var newNameContainer = ElementGenerator.renamePanel(starSystemName, i18n.label(341));
                $('.yesButton', newNameContainer).click(function (e) {
                    var newName = $(".inputEl", newNameContainer).val();
                    $.ajax("Server/Ships.aspx", {
                        "type": "GET",
                        "data": {
                            "shipId": _this.id.toString(),
                            "newName": newName,
                            "action": "colonize"
                        }
                    }).done(function (msg) {
                        checkColonizationResult(msg);
                    });
                    newNameContainer.remove();
                });
            }
            else {
                //create moon
                $.ajax("Server/Ships.aspx", {
                    "type": "GET",
                    "data": {
                        "shipId": this.id.toString(),
                        "newName": "MC",
                        "action": "colonize"
                    }
                }).done(function (msg) {
                    checkColonizationResult(msg);
                });
            }
        };
        ///This version does only allow ine colony per solar system. It creates Sub-colonies from major planets if a colony does already exist 
        Ship.prototype.colonizeOLD = function () {
            //check number of colony against administration
            var _this = this;
            var currentTile = this.getCurrentTile();
            //check if a colony does already exist in this system:
            var MajorColony = null;
            for (var i = 0; i < mainObject.colonies.length; i++) {
                if (mainObject.colonies[i] == null)
                    continue;
                if (mainObject.colonies[i].owner == this.owner
                    && mainObject.colonies[i].parentArea.Id == currentTile.astronomicalObject.parentArea.Id) {
                    Helpers.Log("Colony present OK " + currentTile.astronomicalObject.parentArea.Id);
                    MajorColony = mainObject.colonies[i];
                    break;
                }
            }
            if (mainObject.imageObjects[currentTile.astronomicalObject.typeId].isMainColony()
                && MajorColony == null) {
                ////create major colony
                var starSystemName = this.getCurrentTile().astronomicalObject.parentArea.name;
                var newNameContainer = ElementGenerator.renamePanel(starSystemName, i18n.label(341));
                $('.yesButton', newNameContainer).click(function (e) {
                    var newName = $(".inputEl", newNameContainer).val();
                    $.ajax("Server/Ships.aspx", {
                        "type": "GET",
                        "data": {
                            "shipId": _this.id.toString(),
                            "newName": newName,
                            "action": "colonize"
                        }
                    }).done(function (msg) {
                        checkColonizationResult(msg);
                    });
                    newNameContainer.remove();
                });
            }
            else {
                //create minor colony 
                //Show a dialog indicating the major colony that the new minor will be part of:
                if (MajorColony == null)
                    return;
                var colonyName = MajorColony.name;
                //createPopupWindow(size, drag, parent).element;  
                var popup = ElementGenerator.createNoYesPopup(function () {
                    $.ajax("Server/Ships.aspx", {
                        "type": "GET",
                        "data": {
                            "shipId": _this.id.toString(),
                            "newName": "MC",
                            "action": "colonize"
                        }
                    }).done(function (msg) {
                        checkColonizationResult(msg);
                    });
                    popup.remove();
                }, function () { popup.remove(); }, i18n.label(835), //"Create minor Colony",
                i18n.label(836).format(colonyName), //This colony will be part of colony {0}                    
                null, 1);
            }
        };
        Ship.prototype.colonize2 = function () {
            //var AjaxSettings = new $.j
            $.ajax("Server/Ships.aspx", {
                type: "GET",
                data: { "shipId": this.id.toString(), "action": "colonize" }
            }).done(function (msg) {
                checkColonizationResult(msg);
            });
        };
        Ship.prototype.StartHarvesting = function () {
            console.log("H");
            if (this.owner != mainObject.user.id)
                return false;
            //check that the module is present
            var moduleIsPresent = false;
            for (var i = 0; i < this.modulePositions.length; i++) {
                if (this.modulePositions[i].shipmodule.special == 4) {
                    moduleIsPresent = true;
                    break;
                }
            }
            if (!moduleIsPresent)
                return;
            //check that Ship is in Nebula
            var currentTile = this.getCurrentTile();
            if (!(currentTile.astronomicalObject.typeId > 4999 && currentTile.astronomicalObject.typeId < 5005))
                return;
            //check that this is the only ship, if the ship is to be switched on 
            if (!this.Harvesting) {
                for (var shipNo = 0; shipNo < currentTile.ships.length; shipNo++) {
                    if (currentTile.ships[shipNo] && currentTile.ships[shipNo].id != this.id && currentTile.ships[shipNo].Harvesting)
                        return;
                }
            }
            //now set the new value
            this.Harvesting = !this.Harvesting;
            $.connection.spaceHub.invoke("ShipHarvest", this.id, this.Harvesting);
            //update button state
            if (this.Harvesting)
                $('#harvestNebula button').addClass('buttonActive');
            else
                $('#harvestNebula button').removeClass('buttonActive');
        };
        Ship.prototype.createSpaceStation = function () {
            //var messagePopupContainer = ElementGenerator.messagePopup(627);
            //$('.panelBody', messagePopupContainer).append($('<p/>', { text: i18n.label(628) }));
            var _this = this;
            var createSpaceStationDialog = ElementGenerator.createNoYesPopup(function (e) {
                e.preventDefault();
                $.ajax("Server/Ships.aspx", {
                    "type": "GET",
                    "data": {
                        "shipId": _this.id.toString(),
                        "action": "createSpaceStation"
                    }
                }).done(function (msg) {
                    var shipsFromXML = msg.getElementsByTagName("ship");
                    for (var i = 0; i < shipsFromXML.length; i++) {
                        mainObject.shipUpdate(shipsFromXML[i]);
                    }
                    mainObject.currentShip = null;
                    mainObject.selectedObject = null;
                    PanelController.hideMenus();
                    PanelController.showInfoPanel(PanelController.PanelChoice.Canvas);
                });
                createSpaceStationDialog.remove();
            }, function (e) { e.preventDefault(); createSpaceStationDialog.remove(); }, i18n.label(627), i18n.label(628));
            ElementGenerator.adjustPopupZIndex(createSpaceStationDialog, 16000);
            ElementGenerator.makeSmall(createSpaceStationDialog);
            createSpaceStationDialog.appendTo("body"); //attach to the <body> element
        };
        Ship.prototype.addTranscendence = function () {
            $.ajax("Server/Ships.aspx", {
                "type": "GET",
                "data": {
                    "shipId": this.id.toString(),
                    "action": "transcensionAdd"
                }
            }).done(function (msg) {
                var shipsFromXML = msg.getElementsByTagName("ship");
                for (var i = 0; i < shipsFromXML.length; i++) {
                    mainObject.shipUpdate(shipsFromXML[i]);
                }
                mainObject.currentShip = null;
                mainObject.selectedObject = null;
                PanelController.hideMenus();
                PanelController.showInfoPanel(PanelController.PanelChoice.Canvas);
            });
        };
        /// get the first spaceunit (colony or ship) that has the current ship in its scanning range
        Ship.prototype.FindNearbySpaceUnit = function () {
            if (!scanMap.scanTileExist({ col: this.galaxyColRow.col, row: this.galaxyColRow.row }))
                return null;
            // check colonies:
            for (var i = 0; i < mainObject.colonies.length; i++) {
                if (mainObject.colonies[i] != null && mainObject.colonies[i].owner == mainObject.user.id) {
                    var Colony = mainObject.colonies[i];
                    if (Colony.ScansPosition(this.galaxyColRow))
                        return Colony;
                }
            }
            for (var i = 0; i < mainObject.ships.length; i++) {
                if (mainObject.ships[i] != null && mainObject.ships[i].owner == mainObject.user.id) {
                    if (mainObject.ships[i].ScansPosition(this.galaxyColRow))
                        return mainObject.ships[i];
                }
            }
            return null;
        };
        //returns an array of all ships in the scanRange. (Can be compared with all ships returned by a move-ship-command to delete ships which aren't in the scanRange anymore)...
        //shipsInScanRange(shipXML)
        Ship.prototype.shipsInScanRange = function () {
            var shipIdArry = [];
            var scanColRow = { col: mainObject.parseInt(this.colRow.col) - this.scanRange, row: mainObject.parseInt(this.colRow.row) - this.scanRange };
            for (var i = 0; i < (this.scanRange * 2) + 1; i++) {
                for (var j = 0; j < (this.scanRange * 2) + 1; j++) {
                    var tileToCheck = { col: mainObject.parseInt(scanColRow.col) + i, row: mainObject.parseInt(scanColRow.row) + j };
                    if (this.parentArea.tilemap.tileExist(tileToCheck)) {
                        if (this.parentArea.tilemap.map[mainObject.parseInt(tileToCheck.col)][mainObject.parseInt(tileToCheck.row)].ships != null) {
                            for (var shipNo = 0; shipNo < this.parentArea.tilemap.map[mainObject.parseInt(tileToCheck.col)][mainObject.parseInt(tileToCheck.row)].ships.length; shipNo++) {
                                shipIdArry.push(this.parentArea.tilemap.map[mainObject.parseInt(tileToCheck.col)][mainObject.parseInt(tileToCheck.row)].ships[shipNo].id);
                            }
                        }
                    }
                    //Helpers.Log('Add: ' + scanColRow.col + i + ' / ' + scanColRow.row + j);           
                }
            }
            return shipIdArry;
        };
        Ship.prototype.deleteShip = function () {
            Helpers.Log('delete ship id: ' + this.id);
            if (this.Fleet != null)
                this.Fleet.RemoveShip(this);
            this.parentArea.removeShipFromArea(this);
            if (this.owner == mainObject.user.id) {
                this.removeScanrange();
            }
            //var oldPositionTile = galaxyMap.findCreateTile(this.colRow);
            var oldPositionTile = this.parentArea.tilemap.findCreateTile(this.colRow);
            oldPositionTile.deleteShip(this.id);
            delete mainObject.ships[this.id];
        };
        Ship.prototype.removeFromOldPosition = function () {
            if (mainObject.parseInt(this.owner) != 0) // ship is updated:
             {
                var oldPositionTile = this.parentArea.tilemap.findCreateTile(this.colRow);
                for (var shipNo = 0; shipNo < oldPositionTile.ships.length; shipNo++) {
                    if (oldPositionTile.ships[shipNo].id == this.id)
                        oldPositionTile.ships.splice(shipNo, 1);
                }
            }
        };
        Ship.prototype.ExperienceBase = function () {
            return BaseDataModule.shipHulls[this.shipHullId].modulesCount * 5;
        };
        Ship.prototype.ExperienceNeeded = function (level) {
            var baseValue = this.ExperienceBase();
            switch (level) {
                case 0: return 0;
                case 1: return baseValue;
                case 2: return baseValue * 2; //4
                case 3: return baseValue * 4; //
                case 4: return baseValue * 8; //
            }
        };
        Ship.prototype.ExperienceLevel = function () {
            var baseValue = this.ExperienceBase();
            if (this.Experience < this.ExperienceNeeded(1))
                return 0; //green
            if (this.Experience < this.ExperienceNeeded(2))
                return 1; //standard
            if (this.Experience < this.ExperienceNeeded(3))
                return 2; //veteran
            if (this.Experience < this.ExperienceNeeded(4))
                return 3; //expert
            return 4; //elite
        };
        Ship.prototype.ExperienceLevelLabel = function () {
            switch (this.ExperienceLevel()) {
                case 0: return 731;
                case 1: return 732;
                case 2: return 733;
                case 3: return 734;
                case 4: return 735;
            }
        };
        //finalizeShip does only work after game was fully loaded
        Ship.prototype.finalizeShip = function () {
            if (!onLoadWorker.startUpFinished())
                return;
            //dirty hack
            if (this.owner == 0 && this.shipHullId == 0 && this.objectId == 440 && this.cargoHoldUsed() == 0) {
                this.deleteShip();
                return;
            }
            //try to get the objectType-Reference. Only works if the reference is already loaded, so during startup the refenrences have to be updated during endStartup()            
            if (this.objectId < mainObject.imageObjects.length && mainObject.imageObjects[this.objectId] !== null)
                this.objectType = mainObject.imageObjects[this.objectId];
            if (ShipTemplateModule.templateExists(this.templateId)) {
                this.galaxyMovesPerTurn = ShipTemplateModule.shipTemplates[this.templateId].galaxyMovesPerTurn;
                this.systemMovesPerTurn = ShipTemplateModule.shipTemplates[this.templateId].systemMovesPerTurn;
            }
            //set module link in each shipModule
            for (var i = 0; i < this.modulePositions.length; i++) {
                this.modulePositions[i].getModule();
            }
            this.recalcStats();
            //this.hitpoints = this.getTemplate() && this.getTemplate().hitpoints || this.calcMaxHitpoint();
            //else { Helpers.Log("ERROR getObjectTypeReference 1 " + this.hullId.toString() ); }
        };
        Ship.prototype.update = function (shipXML, checkForNewUser, moved) {
            var _this = this;
            if (checkForNewUser === void 0) { checkForNewUser = false; }
            if (moved === void 0) { moved = false; }
            var shipXMLstr = new XMLSerializer().serializeToString(shipXML);
            var shipJqXML = $.parseXML(shipXMLstr);
            var shipJq = $(shipJqXML);
            var ownerId = shipJq.find("ownerId").text();
            if (parseInt(ownerId) === -1) {
                this.deleteShip();
                return;
            }
            //either the ship is new or it is updated
            this.removeFromOldPosition();
            var col = shipJq.find("xpos").text();
            var row = shipJq.find("ypos").text();
            var systemId = parseInt(shipJq.find("systemId").text(), 10);
            var name = shipJq.find("name").text();
            var max_hyper = shipJq.find("max_hyper").text();
            var max_impuls = shipJq.find("max_impuls").text();
            var rest_hyper = shipJq.find("rest_hyper").text();
            var rest_impuls = shipJq.find("rest_impuls").text();
            var hitpoints = shipJq.find("hitpoints").first().text();
            var damageReduction = shipJq.find("damageReduction").text();
            var SystemX = shipJq.find("systemX").text();
            var SystemY = shipJq.find("systemY").text();
            var sqlScanRange = shipJq.find("scanRange").text();
            var attack = shipJq.find("attack").text();
            var defense = shipJq.find("verteidigung").text();
            var galaxyColRow = { col: parseInt(col), row: parseInt(row) };
            ;
            var starColRow = { col: parseInt(SystemX), row: parseInt(SystemY) };
            var canColonize = parseInt(shipJq.find("colonizer").text(), 10);
            var hullId = shipJq.find("hullId").text();
            var templateId = shipJq.find("templateId").text();
            var objectId = shipJq.find("objectId").text();
            var energy = shipJq.find("energy").text();
            var crew = shipJq.find("crew").text();
            var cargoroom = shipJq.find("cargoroom").text();
            var fuelroom = shipJq.find("fuelroom").text();
            var population = shipJq.find("population").text();
            var shipHullsImage = shipJq.find("shipHullsImage").text();
            var refitCounter = shipJq.find("refitCounter").text();
            var experience = shipJq.find("Experience").text();
            var ServerVersion = shipJq.find("ServerVersion").text();
            var FleetId = shipJq.find("FleetId").text();
            var Sentry = shipJq.find("Sentry").text();
            var TargetX = shipJq.find("TargetX").text();
            var TargetY = shipJq.find("TargetY").text();
            var MovementRoute = shipJq.find("MovementRoute").text();
            var Harvesting = shipJq.find("Harvesting").text();
            //console.log("ServerVersion" + ServerVersion);
            var moveDirection = shipJq.find("moveDirection").text();
            if (moveDirection !== null)
                this.moveDirection = parseInt(moveDirection);
            if (moved) {
                this.lastMovedAt = new Date().getTime();
                this.lastMovedFromGalaxyPosition = this.galaxyColRow;
                this.lastMovedFromStarSystemPosition = this.starColRow;
                if (this.systemId < 1 && systemId != 0) {
                    var last = directionInt2ColRow(directionIntReverse(this.moveDirection));
                    this.lastMovedFromStarSystemPosition = { col: starColRow.col + last.col, row: starColRow.row + last.row };
                    //this.lastMovedFromStarSystemPosition = { col: 25, row: 25 };
                }
            }
            var transcensionXML = shipJq.find("shipTranscension");
            if (transcensionXML.find("shipId").text() != "") {
                Helpers.Log("shipId 2 " + transcensionXML.find("shipId").text());
                var transc = new ShipTranscension();
                var tDate = transcensionXML.find("constructionDate").text();
                transc.constructionDate = new Date(tDate);
                transc.transAddCount = parseInt(transcensionXML.find("ressourceCount").text(), 10);
                transc.helperMinimumRelation = parseInt(transcensionXML.find("helperMinimumRelation").text(), 10);
                transc.transAddCount = parseInt(transcensionXML.find("amountInvested").text(), 10);
                transc.transAddNeeded = parseInt(transcensionXML.find("transcendenceRequirement").text(), 10);
                if (transcensionXML.find("finishedInTurn")) {
                    transc.finishedInTurn = parseInt(transcensionXML.find("finishedInTurn").text(), 10);
                }
                if (transcensionXML.find("finishingNumber")) {
                    transc.finishingNumber = parseInt(transcensionXML.find("finishingNumber").text(), 10);
                }
                //console.log(" transc " + transc);
                this.transcension = transc;
                transcensionXML.find("ShipTranscensionUser").each(function () {
                    var userId = parseInt($(this).find("userId").text());
                    var amount = parseInt($(this).find("helpCount").text());
                    transc.shipTranscensionUsers.push({ userId: userId, amount: amount });
                    //this.transcension.shipTranscensionUsers[userId] = amount;                    
                });
            }
            this.name = name;
            this.createTagFreeName();
            this.galaxyColRow = galaxyColRow;
            this.starColRow = starColRow;
            if (systemId != null && systemId > 0)
                this.colRow = starColRow;
            else
                this.colRow = galaxyColRow;
            this.owner = parseInt(ownerId, 10);
            this.systemId = systemId;
            this.systemMapX = parseInt(SystemX, 10);
            this.systemMapY = parseInt(SystemY, 10);
            this.sytemMoves = Number(rest_impuls);
            this.systemMovesMax = Number(max_impuls);
            this.starMoves = Number(rest_hyper);
            this.galaxyMovesMax = Number(max_hyper);
            this.currentHitpoints = parseInt(hitpoints, 10);
            this.damagereduction = parseInt(damageReduction, 10);
            this.scanRange = parseInt(sqlScanRange, 10);
            this.isColonizer = canColonize == 1 ? true : false;
            this.shipHullId = parseInt(hullId, 10);
            this.attack = parseInt(attack, 10);
            this.defense = parseInt(defense, 10);
            this.templateId = parseInt(templateId, 10);
            this.objectId = parseInt(objectId, 10);
            this.energy = parseInt(energy, 10);
            this.crew = parseInt(crew, 10);
            this.cargoroom = parseInt(cargoroom, 10);
            this.fuelroom = parseInt(fuelroom, 10);
            this.population = parseInt(population, 10);
            this.shipHullsImage = parseInt(shipHullsImage, 10);
            this.refitCounter = parseInt(refitCounter, 10);
            this.Experience = parseInt(experience, 10);
            this.FleetId = FleetId != null && FleetId != '' ? parseInt(FleetId) : null;
            this.Sentry = Sentry == 'true' ? true : false;
            this.TargetX = TargetX != null && TargetX != '' ? parseInt(TargetX) : null;
            this.TargetY = TargetY != null && TargetY != '' ? parseInt(TargetY) : null;
            this.MovementRoute = MovementRoute;
            this.Harvesting = Harvesting == 'true' ? true : false;
            this.ServerVersion = parseInt(ServerVersion, 10);
            //clear goods
            this.goods = [];
            var XMLgoods = shipJq.find("good");
            var length = XMLgoods.length;
            XMLgoods.each(function (index, elem) {
                var goodsIds = $(elem).find("goodsId");
                if (goodsIds.length == 0)
                    return;
                var id = parseInt(goodsIds.text(), 10);
                var amount = parseInt($(elem).find("amount").text(), 10);
                _this.goods[id] = amount;
            });
            //clear modulePositions
            this.modulePositions = [];
            var XMLmodules = shipJq.find("shipModules");
            XMLmodules.each(function (index, elem) {
                var moduleId = $(elem).find("moduleId").text();
                var posX = $(elem).find("posX").text();
                var posY = $(elem).find("posY").text();
                var newModule = new Ships.ModulePosition();
                newModule.shipmoduleId = parseInt(moduleId, 10);
                newModule.posX = parseInt(posX, 10);
                newModule.posY = parseInt(posY, 10);
                newModule.getModule();
                _this.modulePositions.push(newModule);
            });
            var tileOfShipPosition = this.parentArea.tilemap.findCreateTile(this.colRow);
            this.finalizeShip();
            //tileOfShipPosition.ships.push(this);
            if (this.getCurrentTile() != tileOfShipPosition) {
                this.getCurrentTile().deleteShip(this.id);
                tileOfShipPosition.ships.push(this);
            }
            else {
                //check if ship was already added...
                if (!tileOfShipPosition.existShip(this.id))
                    tileOfShipPosition.ships.push(this);
            }
            if (!mainObject.user.otherUserExists(this.owner) && !this.ownerCurrentlyChecked && this.owner != mainObject.user.id && this.owner != 0) {
                var scanShip;
                var scanColony;
                if (mainObject.currentShip == null && mainObject.currentColony == null) {
                    var scanningObject = mainObject.fieldScannedBy(this.galaxyColRow);
                    if (scanningObject instanceof Ship)
                        scanShip = scanningObject.id;
                    if (scanningObject instanceof ColonyModule.Colony)
                        scanColony = scanningObject.id;
                }
                //new player detected
                Helpers.Log('new player detected');
                this.ownerCurrentlyChecked = true;
                mainObject.user.checkNewContact(this.owner, this.id, null, scanShip || mainObject.currentShip && mainObject.currentShip.id, scanColony || mainObject.currentColony && mainObject.currentColony.id);
            }
            if (this.owner == 0)
                this.Targeted = false;
            this.MoveShipStartColRow = this.colRow;
            //dirty hack
            if (onLoadWorker.startUpFinished() && this.owner == 0 && this.shipHullId == 0 && this.objectId == 440 && this.cargoHoldUsed() == 0) {
                this.deleteShip();
                return;
            }
            Helpers.Log(this, Helpers.LogType.DataUpdate);
            //this.getObjectTypeReference();
        };
        Ship.prototype.updateArea = function (XMLobject) {
            if (this.parentArea == null) {
                var systemIdNode = XMLobject.getElementsByTagName("systemId");
                if (systemIdNode != null) {
                    var systemId = systemIdNode[0].childNodes[0].nodeValue;
                    if (systemId != null && systemId > 0)
                        this.parentArea = galaxyMap.elementsInArea[mainObject.parseInt(systemId)];
                }
                if (this.parentArea == null) {
                    this.parentArea = galaxyMap;
                }
                this.parentArea.shipsInArea.push(this);
            }
        };
        Ship.prototype.updateAreaById = function (systemId) {
            if (this.parentArea == null) {
                if (systemId != null && systemId > 0)
                    this.parentArea = galaxyMap.elementsInArea[mainObject.parseInt(systemId)];
                if (this.parentArea == null) {
                    this.parentArea = galaxyMap;
                }
                this.parentArea.shipsInArea.push(this);
            }
        };
        Ship.prototype.addScanrange = function () {
            if (this.systemId == currentMap.correspondingArea.Id && this.owner == mainObject.user.id)
                this.addLocalScanrange();
            if (currentMap.correspondingArea.Id == -1 && this.systemId != currentMap.correspondingArea.Id && this.owner == mainObject.user.id)
                this.addGalaxyScanrange();
        };
        Ship.prototype.addLocalScanrange = function () {
            var scanColRow = { col: mainObject.parseInt(this.colRow.col) - this.scanRange, row: mainObject.parseInt(this.colRow.row) - this.scanRange };
            for (var i = 0; i < (this.scanRange * 2) + 1; i++) {
                for (var j = 0; j < (this.scanRange * 2) + 1; j++) {
                    //Helpers.Log('Add: ' + scanColRow.col + i + ' / ' + scanColRow.row + j);
                    scanMap.countUp({ col: mainObject.parseInt(scanColRow.col) + i, row: mainObject.parseInt(scanColRow.row) + j });
                }
            }
        };
        Ship.prototype.addGalaxyScanrange = function () {
            var scanColRow = { col: mainObject.parseInt(this.galaxyColRow.col) - this.scanRange, row: mainObject.parseInt(this.galaxyColRow.row) - this.scanRange };
            for (var i = 0; i < (this.scanRange * 2) + 1; i++) {
                for (var j = 0; j < (this.scanRange * 2) + 1; j++) {
                    //Helpers.Log('Add: ' + scanColRow.col + i + ' / ' + scanColRow.row + j);
                    scanMap.countUp({ col: mainObject.parseInt(scanColRow.col) + i, row: mainObject.parseInt(scanColRow.row) + j });
                    FogOfWarModule.fog.insert(FogOfWarModule.makeBox(mainObject.parseInt(scanColRow.col) + i, mainObject.parseInt(scanColRow.row) + j));
                }
            }
        };
        Ship.prototype.removeScanrange = function () {
            var scanColRow = { col: mainObject.parseInt(this.colRow.col) - this.scanRange, row: mainObject.parseInt(this.colRow.row) - this.scanRange };
            for (var i = 0; i < (this.scanRange * 2) + 1; i++) {
                for (var j = 0; j < (this.scanRange * 2) + 1; j++) {
                    //Helpers.Log('Remove ' + scanColRow.col +i + ' / ' + scanColRow.row + j);
                    scanMap.countDown({ col: mainObject.parseInt(scanColRow.col) + i, row: mainObject.parseInt(scanColRow.row) + j });
                }
            }
        };
        Ship.prototype.canColonize = function () {
            if (!this.isColonizer)
                return false;
            var currentTile = this.getCurrentTile();
            if (currentTile != null) {
                if (currentTile.astronomicalObject !== null) {
                    if (currentTile.astronomicalObject instanceof PlanetData || currentTile.astronomicalObject instanceof StarData) {
                        var star = currentTile.astronomicalObject;
                        var isAllowed = mainObject.imageObjects[currentTile.astronomicalObject.typeId].isColonizable() && (star.colony == null);
                        if (!isAllowed)
                            return false;
                        return true;
                    }
                }
            }
            return false;
        };
        Ship.prototype.isTroopTransport = function () {
            for (var i = 0; i < this.modulePositions.length; i++) {
                if (this.modulePositions[i].shipmodule.special == 2)
                    return true;
            }
            return false;
        };
        //ToDo: create flag on server side at the modules marking them as "isSpaceStation", and remove the harcoded values here
        Ship.prototype.canCreateSpaceStation = function () {
            if (this.owner != mainObject.user.id)
                return false;
            if (this.shipHullId >= 199 && this.shipHullId < 210)
                return false;
            var shipModules = this.modulePositions; //.getTemplate().modulePositions;
            for (var i = 0; i < shipModules.length; i++) {
                if (shipModules[i].shipmoduleId >= 499 && shipModules[i].shipmoduleId < 521)
                    return true;
            }
            return false;
        };
        Ship.prototype.canCollectNebula = function () {
            if (this.owner != mainObject.user.id)
                return false;
            //check that the module is present
            var moduleIsPresent = false;
            for (var i = 0; i < this.modulePositions.length; i++) {
                if (this.modulePositions[i].shipmodule.special == 4) {
                    moduleIsPresent = true;
                    break;
                }
            }
            if (!moduleIsPresent)
                return false;
            //check that Ship is in Nebula
            var currentTile = this.getCurrentTile();
            if (!(currentTile.astronomicalObject.typeId > 4999 && currentTile.astronomicalObject.typeId < 5005))
                return false;
            //check that no other ships on this field do already harvest
            return true;
        };
        Ship.prototype.canAddTranscendence = function () {
            if (this.owner != mainObject.user.id)
                return false;
            if (this.shipHullId != 221)
                return false;
            var currentTile = this.getCurrentTile();
            var constructIsPresent = false;
            if (currentTile != null) {
                for (var x = 0; x < currentTile.ships.length; x++) {
                    if (currentTile.ships[x] && currentTile.ships[x].id == this.id)
                        continue;
                    if (currentTile.ships[x] && currentTile.ships[x].shipHullId == 220) {
                        constructIsPresent = true;
                        break;
                    }
                }
            }
            return constructIsPresent;
        };
        //enables and disables ship related buttons
        Ship.prototype.setShipRelatedButtons = function () {
            //check Colonizer Button
            var activateColonize = false;
            var currentTile = this.getCurrentTile();
            if (this.canColonize())
                activateColonize = true;
            if (activateColonize)
                document.getElementById('rotate').style.display = 'block';
            else
                document.getElementById('rotate').style.display = 'none';
            document.getElementById('harvestNebula').style.display = true ? 'block' : 'none';
            //ToDO: check Transfer Goods Button
            var activateTrade = false;
            document.getElementById('toolTrade').style.display = this.canTrade() ? 'block' : 'none';
            document.getElementById('harvestNebula').style.display = this.canCollectNebula() ? 'block' : 'none';
            if (this.Harvesting)
                $('#harvestNebula button').addClass('buttonActive');
            else
                $('#harvestNebula button').removeClass('buttonActive');
            document.getElementById('createSpaceStation').style.display = this.canCreateSpaceStation() ? 'block' : 'none';
            document.getElementById('addTranscendence').style.display = this.canAddTranscendence() ? 'block' : 'none';
            document.getElementById('attackTarget').style.display = this.owner != 0 ? 'block' : 'none';
            document.getElementById('design').style.display = 'block';
            if (this.owner == mainObject.user.id) {
                document.getElementById('sentry').style.display = 'block';
                if (this.Sentry)
                    $('#sentry button').addClass('buttonActive');
                else
                    $('#sentry button').removeClass('buttonActive');
                document.getElementById('continue').style.display = 'block';
            }
            TransferModule.enableTransferButton(this);
        };
        Ship.prototype.shipBorderStyle = function () {
            //check ownership of this ship
            if (this.owner == 0)
                return '';
            if (this.owner == mainObject.user.id)
                return 'thin solid green';
            return mainObject.relationTypes[mainObject.user.relationToOtherUser(this.owner)].borderColorStyle;
        };
        Ship.prototype.showDetails = function () {
            var _this = this;
            transferPanel.CloseTransfer();
            Helpers.Log("showDetails");
            //Scripts.scriptsAdmin.loadAndRun(4, 1, 'ShipDetails.js');
            Scripts.scriptsAdmin.loadAndRun(3, 1, './ShipTemplateDesigner.js', false, function () { ShipTemplateDesigner.runTemplate(_this); });
            return;
        };
        Ship.prototype.toolTip = function (toAppendTo) {
            var shipTooltip = $("<div/>");
            //
            /*
                Name
                ---------------------
                Stärke          0
                Trefferpunkte
                ^ +17% von Forschungen
                ---------------------
                Drag&Drop um Flotten zuerstellen
            */
            var name = $('<span>');
            name.html(this.name.label());
            shipTooltip.append(name);
            shipTooltip.append($('<hr/>'));
            if (this.shipHullId != 0) {
                shipTooltip.append($('<span>', { text: i18n.label(201) })); //attack
                var attackSpan = $('<span>', { text: this.attack, "class": "toolTipDataPosition" });
                shipTooltip.append(attackSpan);
                shipTooltip.append($("<br/>"));
                shipTooltip.append($('<span>', { text: i18n.label(218) })); //Hitpoints
                var hitpointsSpan = $('<span>', { text: this.currentHitpoints + "/" + this.hitpoints, "class": "toolTipDataPosition" });
                shipTooltip.append(hitpointsSpan);
                shipTooltip.append($('<br/>'));
                shipTooltip.append($('<span>', { text: i18n.label(203) })); //System Moves
                var systemMovesSpan = $('<span>', { text: this.sytemMoves.toFixed(1) + "/" + this.systemMovesMax.toFixed(1), "class": "toolTipDataPosition" });
                shipTooltip.append(systemMovesSpan);
                shipTooltip.append($("<br/>"));
                shipTooltip.append($('<span>', { text: i18n.label(202) })); //interstellar
                var galaxyMovesSpan = $('<span>', { text: this.starMoves.toFixed(1) + "/" + this.galaxyMovesMax.toFixed(1), "class": "toolTipDataPosition" });
                shipTooltip.append(galaxyMovesSpan);
                shipTooltip.append($("<br/>"));
            }
            shipTooltip.append($('<span>', { text: i18n.label(220) })); //Storage
            var cargoroomSpan = $('<span>', { text: this.countCargo() + "/" + this.cargoroom, "class": "toolTipDataPosition" });
            shipTooltip.append(cargoroomSpan);
            shipTooltip.append($("<br/>"));
            if (this.owner == mainObject.user.id) {
                shipTooltip.append($('<hr/>'));
                shipTooltip.append($('<span>', { text: i18n.label(978) })); //Drag&Drop to create fleets
            }
            toAppendTo.tooltip({ content: function () { return shipTooltip.html(); } });
        };
        return Ship;
    }(SpaceUnit));
    Ships.Ship = Ship;
    applyMixins(Ship, [ShipTemplateStatistics]);
    function checkColonizationResult(resultXML) {
        //resultXML = resultXML.responseXML;
        //Helpers.Log(resultXML);
        //console.dirxml(resultXML);
        //var respCode = resultXML.getElementsByTagName("respCode");// [0].childNodes[0].nodeValue;
        var respCode = parseInt(resultXML.getElementsByTagName("respCode")[0].childNodes[0].nodeValue);
        //Helpers.Log("respCode = " + respCode);
        /*
        1: OK
        2: Schiff ist kein Colonizer
        3: Schiff in Outer Space
        4: kein Planet
        5: schon besiedelt
        */
        switch (respCode) {
            case 1:
                /*
                var path = "/response/colony";
                var colony = parseXMLpath(path, resultXML);
    
                //console.dirxml(colony);
                insertColonyXML(colony);
                systemTileBorder(
                resultXML.getElementsByTagName("systemId")[0].childNodes[0].nodeValue
                , resultXML.getElementsByTagName("planetId")[0].childNodes[0].nodeValue
                );
                */
                Helpers.Log('colonized');
                var tile = mainObject.currentShip.getCurrentTile();
                mainObject.currentShip = null;
                mainObject.selectedObject = null;
                PanelController.hideMenus();
                PanelController.showInfoPanel(PanelController.PanelChoice.Canvas);
                ColonyModule.checkColonyXML(resultXML);
                var newColonyId;
                newColonyId = parseInt($(resultXML).find('Colony > id').text()); //parseInt(resultXML.getElementsByTagName("id")[0].childNodes[0].nodeValue);
                if (mainObject.coloniesById[newColonyId] != null)
                    mainObject.coloniesById[newColonyId].calcColonyRessources();
                // Hide all User Interface stuff
                DrawInterface.deselectObject();
                ShipTemplateModule.getTemplatesFromXML(resultXML);
                //add ShipModule.Ship to map
                var shipsFromXML = resultXML.getElementsByTagName("ship");
                for (var i = 0; i < shipsFromXML.length; i++) {
                    mainObject.shipUpdate(shipsFromXML[i]);
                }
                var shipsFromXML = resultXML.getElementsByTagName("Ship");
                for (var i = 0; i < shipsFromXML.length; i++) {
                    mainObject.shipUpdate(shipsFromXML[i]);
                }
                //mainObject.shipUpdate(resultXML);
                //refresh planet data:
                var xmlStars = resultXML.getElementsByTagName("PlanetData");
                var solarObject = tile.astronomicalObject;
                solarObject.update(xmlStars[0]);
                solarObject.colony = mainObject.coloniesById[newColonyId];
                var Planet = resultXML.getElementsByTagName("ColonyPlanet");
                var SurfaceTiles = Planet[0].getElementsByTagName("SurfaceTiles");
                var xmlTiles = SurfaceTiles[0].getElementsByTagName("surfaceTile");
                for (var j = 0; j < xmlTiles.length; j++) {
                    solarObject.createUpdateSurfaceFieldElement(xmlTiles[j]);
                }
                //var objectId = parseInt(xmlStars[0].getElementsByTagName("starId")[0].childNodes[0].nodeValue);
                //solarObject.update(xmlStars);
                //solarObject.addSubElement(xmlStars);
                /*
                var xmlTile = resultXML.getElementsByTagName("surfaceTile");
                var length = xmlTile.length;
                //Helpers.Log('l: ' + length);

                for (var i = 0; i < length; i++) {
                    //that.addSubElement(xmlTile[i]);
                    this.createUpdateSurfaceFieldElement(xmlTile[i]);
                }
                */
                mainInterface.drawAll();
                //mainInterface.refreshMainScreenStatistics();
                //Quests
                var colonyId = parseInt(resultXML.getElementsByTagName("id")[0].childNodes[0].nodeValue);
                for (var i = 0; i < QuestModule.colonizeQuests.length; i++) {
                    QuestModule.colonizeQuests[i](mainObject.coloniesById[colonyId], i);
                }
                RealmStatistics.checkUserModifiers();
                return;
            default:
                Helpers.Log("not colonized: " + respCode);
        }
    }
    function TranscendenceConstructExists() {
        for (var i = 0; i < mainObject.ships.length; i++) {
            if (mainObject.ships[i] == null)
                continue;
            if (mainObject.ships[i].transcension != null)
                return true;
        }
        return false;
    }
    Ships.TranscendenceConstructExists = TranscendenceConstructExists;
    var shipListPanel;
    var UserInterface;
    (function (UserInterface) {
        //ToDo Performance: change this function - updates during Movement should not run the whole function
        function refreshMainScreenStatistics(ship) {
            var panel = $('#quickInfoList');
            panel.html('');
            //var heading = $('<span/>', { text: ship.name + " " });
            var heading = $('<span/>');
            heading.html(ship.name.label() + " ");
            heading.css("font-weight", "bold");
            panel.append(heading);
            /*heading.append($('<span/>', { text: " " }));
            
            var detailShip = $('<button/>', { text: "D", style: "font-size: 0.7em;" });
            detailShip.button();
            detailShip.click((e) => { ship.showDetails(); e.stopPropagation(); });
            detailShip.mousedown((e) => { e.stopPropagation(); });
            detailShip.mouseup((e) => { e.stopPropagation(); });
            heading.append(detailShip);
            */
            var coords = ' (' + ship.galaxyColRow.col.toString() + '|' + ship.galaxyColRow.row.toString() + ')';
            heading.append($('<span/>', { "text": coords, style: "font-size: 0.7em;font-weight: normal;" }));
            panel.append($('<br>'));
            if (ship.owner != mainObject.user.id) {
                var otherUser = mainObject.user.otherUserFind(ship.owner);
                if (otherUser && !otherUser.isAI()) {
                    //var owner = $('<span/>', { text: mainObject.user.otherUserFind(ship.owner) && mainObject.user.otherUserFind(ship.owner).name + " " });
                    var owner = $('<span/>');
                    owner.html(mainObject.user.otherUserFind(ship.owner) && mainObject.user.otherUserFind(ship.owner).name + " ");
                    owner.css("font-weight", "bold");
                    panel.append(owner);
                    owner.append($('<span/>', { text: " " }));
                    var writeMail = $('<button/>', { text: "M", style: "font-size: 0.7em;" });
                    writeMail.button();
                    writeMail.click(function (e) { MessageModule.userInterface.showMessageWrite(otherUser); e.stopPropagation(); });
                    writeMail.mousedown(function (e) { e.stopPropagation(); });
                    writeMail.mouseup(function (e) { e.stopPropagation(); });
                    owner.append(writeMail);
                    panel.append($('<br>'));
                }
            }
            /*
            var cargobar = $('<div/>');
            cargobar.progressbar();
            cargobar.progressbar("option", "value", 25);

            cargobar.find(".ui-progressbar-value").css({
                "background": '#' + Math.floor(Math.random() * 16777215).toString(16)
            });
            cargobar.progressbar("option", {
                value: 25
            });

            panel.append(cargobar);
            panel.append($('<br>'));
            */
            var buildTable = $('<table/>', { "cellspacing": 0 }); // , style:"border-collapse: collapse;"                       
            //Attack
            var tableRowAttack = $('<tr/>');
            var tableDataAttackText = $('<td/>', { text: i18n.label(201) }); //Strength / Stärke
            tableRowAttack.append(tableDataAttackText);
            var AD = ship.attack.toString();
            if (ship.refitCounter > 0)
                AD = "0 (" + AD + ")";
            var tableDataAttack = $('<td/>', { text: AD });
            tableRowAttack.append(tableDataAttack);
            var tableDataAttackBar = $('<td/>');
            tableRowAttack.append(tableDataAttackBar);
            buildTable.append(tableRowAttack);
            //Hitpoints
            var tableRowTP = $('<tr/>');
            var tableDataTPText = $('<td/>', { text: i18n.label(218) }); //Hitpoints
            tableRowTP.append(tableDataTPText);
            var maxHP = ship.hitpoints; // ship.getTemplate() && ship.getTemplate().hitpoints || '5';
            var HP = ship.currentHitpoints.toString() + ' / ' + maxHP;
            var tableDataTP = $('<td/>', { text: HP });
            tableRowTP.append(tableDataTP);
            buildTable.append(tableRowTP);
            //Star Moves
            //Helpers.Log("AAAA : " + ship.galaxyMovesMax.toFixed(2))
            var tableStarMoves = $('<tr/>');
            var tableDataSMText = $('<td/>', { text: i18n.label(202) }); //Interstellar
            tableStarMoves.append(tableDataSMText);
            var starMoves = ship.starMoves.toFixed(1) + '/' + ship.galaxyMovesMax.toFixed(1) + ' (+' + ship.galaxyMovesPerTurn.toFixed(1) + ')';
            var tableDataSM = $('<td/>', { text: starMoves });
            tableStarMoves.append(tableDataSM);
            var tableStarMovesBar = $('<td/>');
            var starMovesBar;
            starMovesBar = mainInterface.createBar();
            starMovesBar.css("float", "left");
            starMovesBar.css("width", "55px");
            starMovesBar.css("height", "10px");
            starMovesBar.progressbar("option", {
                value: Math.floor((ship.starMoves / Math.max(ship.galaxyMovesMax, 1)) * 100)
            });
            tableStarMovesBar.append(starMovesBar);
            tableStarMoves.append(tableStarMovesBar);
            buildTable.append(tableStarMoves);
            //SystemMoves
            var tableSysMoves = $('<tr/>');
            var tableDataSysMText = $('<td/>', { text: i18n.label(203) }); // systemmoves
            tableSysMoves.append(tableDataSysMText);
            var sysMoves = ship.sytemMoves.toFixed(1) + '/' + ship.systemMovesMax.toFixed(1) + ' (+' + ship.systemMovesPerTurn.toFixed(1) + ')';
            var tableDataSysM = $('<td/>', { text: sysMoves });
            tableSysMoves.append(tableDataSysM);
            var tableSysMovesBar = $('<td/>');
            var sysMovesBar;
            sysMovesBar = mainInterface.createBar();
            sysMovesBar.css("float", "left");
            sysMovesBar.css("width", "55px");
            sysMovesBar.css("height", "10px");
            sysMovesBar.progressbar("option", {
                value: Math.floor((ship.sytemMoves / Math.max(ship.systemMovesMax, 1)) * 100)
            });
            tableSysMovesBar.append(sysMovesBar);
            tableSysMoves.append(tableSysMovesBar);
            buildTable.append(tableSysMoves);
            /*
            if (ship.isColonizer) {

                var tableColoRow = $('<tr/>');
                var tableDataSysMText = $('<td/>', { text: i18n.label(204) });
                tableDataSysMText.attr('colSpan', 2);
                tableColoRow.append(tableDataSysMText);
                buildTable.append(tableColoRow);
            }
            */
            //Experience
            var tableRowExp = $('<tr/>');
            var tableDataExpText = $('<td/>', { text: i18n.label(730) }); //Experience
            tableRowExp.append(tableDataExpText);
            var tableDataExp = $('<td/>', { text: i18n.label(ship.ExperienceLevelLabel()) });
            tableDataExp.css("text-align", "right");
            tableRowExp.append(tableDataExp);
            var tableDataExpBar = $('<td/>');
            var ExperienceBar;
            ExperienceBar = mainInterface.createBar();
            ExperienceBar.css("float", "left");
            ExperienceBar.css("width", "55px");
            ExperienceBar.css("height", "10px");
            var thisLevelReachedAt = ship.ExperienceNeeded(ship.ExperienceLevel());
            var nextLevelReachedAt = ship.ExperienceNeeded(ship.ExperienceLevel() + 1);
            ExperienceBar.progressbar("option", {
                value: Math.floor(((ship.Experience - thisLevelReachedAt) / Math.max(nextLevelReachedAt - thisLevelReachedAt, 1)) * 100)
            });
            tableDataExpBar.append(ExperienceBar);
            tableRowExp.append(tableDataExpBar);
            buildTable.append(tableRowExp);
            //document.getElementById('quickInfoList').innerHTML = shipListInnerHTML;
            //document.getElementById('quickInfoList').
            panel.append(buildTable);
        }
        UserInterface.refreshMainScreenStatistics = refreshMainScreenStatistics;
        //var windowHandle : ElementGenerator.WindowManager;
        function showShipList() {
            //create data to show + module slots of all ships
            var shipModuleCount = 0;
            var filteredArray = [];
            for (var i = 0; i < mainObject.ships.length; i++) {
                if (mainObject.ships[i] == null)
                    continue;
                if (mainObject.ships[i].owner != mainObject.user.id)
                    continue;
                filteredArray.push(mainObject.ships[i]);
                shipModuleCount += BaseDataModule.shipHulls[mainObject.ships[i].shipHullId].modulesCount;
            }
            //get data for Fleet Upkeep
            var allowedShips = mainObject.user.numberOfPossibleShips();
            var ratio = (shipModuleCount - allowedShips) / allowedShips;
            ratio = Math.max(Math.min(ratio, 1), 0); // get value between 0 and 1;
            ratio = ratio * 100; // get percentage
            ratio = Math.round(ratio);
            //create main Panel and add header + content
            var windowHandle = ElementGenerator.MainPanel();
            shipListPanel = windowHandle.element;
            windowHandle.setHeader(i18n.label(133));
            windowHandle.showNoButton(true);
            $('.noButton span', shipListPanel).text(i18n.label(224)); //Designer
            $('.noButton', shipListPanel).click(function (e) { shipListPanel.data("window").remove(); Scripts.scriptsAdmin.loadAndRun(3, 1, './ShipTemplateDesigner.js', false, function () { ShipTemplateDesigner.runTemplate(null); }); });
            var panelBody = $('.relPopupBody', windowHandle.element);
            //Fleet Upkeep 20% ( 30 of 25 ) 
            $(".relPopupHeader span", windowHandle.element).text(i18n.label(563) + ratio.toString() + '% ( ' + shipModuleCount.toString() + i18n.label(564) + allowedShips.toString() + ' )');
            windowHandle.createTable(panelBody, filteredArray, createTableHeader, createTableLine2, null, 0, null, 10, false);
            windowHandle.SetBottom();
        }
        UserInterface.showShipList = showShipList;
        function createTableHeader() {
            var tableRow = $('<tr/>');
            var th = ElementGenerator.headerElement;
            //tableRow.append(th(null, 10,true)); //empty 
            tableRow.append(th(null, 30, true)); //image
            tableRow.append(th(442, 40)); //ID
            tableRow.append(th(443, 352)); //Name
            tableRow.append(th(201, 80)); //Stärke
            tableRow.append(th(463, 140)); //Movement
            /*
            tableRow.append(th(466, 180)); //Template
            tableRow.append(th(467, 180, true)); //Hull - Rumpf
            tableRow.append(th(null, 10)); //empty
            */
            return tableRow;
        }
        function createTableLine2(_caller, ship) {
            var tableRow = $('<tr/>');
            //var tableDataFirst = $('<td/>');
            //tableRow.append(tableDataFirst);
            var imageSource = ship.objectType.texture.src;
            //var tableDataGif = $('<td/>', { style: "background-image:url(" + imageSource + ");width:30px;height:30px;background-repeat:no-repeat;background-size: 90%;background-position: center center;" });
            var tableDataGif = $('<td/>');
            tableDataGif.append(DrawInterface.createShipDiv(ship, true, false, true, false));
            tableRow.append(tableDataGif);
            var tableDataId = $('<td/>', { text: ship.id.toString() });
            tableRow.append(tableDataId);
            //var tableDataName = $('<td/>', { text: ship.name });
            var tableDataName = $('<td/>');
            tableDataName.html(ship.name.label());
            tableRow.append(tableDataName);
            var attackDefense = ship.attack.toString();
            var tableDataAD1 = $('<td/>', { text: attackDefense });
            tableRow.append(tableDataAD1);
            var moves = ship.starMoves.toFixed(1) + ' (' + ship.galaxyMovesMax.toFixed(1) + ') / ' + ship.sytemMoves.toFixed(1) + ' (' + ship.systemMovesMax.toFixed(1) + ')';
            var tableDataMoves = $('<td/>', { text: moves });
            tableRow.append(tableDataMoves);
            /*
            var tableDataTemplate = $('<td/>', { text: ShipTemplateModule.templateExists(ship.templateId) ? ship.getTemplate().name : '' });
            tableRow.append(tableDataTemplate);

            var tableDataType = $('<td/>', { text: i18n.label(BaseDataModule.shipHulls[ship.shipHullId].label) });
            tableRow.append(tableDataType);
            
            var tableDataRead = $('<td/>', { "class": "lastchild" });
            tableRow.append(tableDataRead);
            */
            tableRow.click(function (e) { ship.selectAndCenter(720); });
            return tableRow;
        }
    })(UserInterface = Ships.UserInterface || (Ships.UserInterface = {}));
    function ReceiveShip(ship) {
        if (!ship["Ship"]) {
            Helpers.Log('3 ReceiveShip did sent empty return', Helpers.LogType.DataUpdate);
            return;
        }
        var json = $.parseJSON(ship["Ship"]);
        var DummyShip = Ships.MakeDummyShipFromJSON(json);
        if (mainObject.shipExists(DummyShip.id)) // if ship exists, update it.
            Ships.ApplyDummyToReal(DummyShip);
        else {
            // if ships does not yet exists, add it
            var newShip = new Ships.Ship(DummyShip.id);
            newShip.typeId = 400; //typeId references objecttTypes (imageObject)
            newShip.updateAreaById(DummyShip.systemId);
            //add to ship array
            mainObject.ships[mainObject.parseInt(DummyShip.id)] = newShip;
            Ships.ApplyDummyToReal(DummyShip);
            //add scan Range 
            if (newShip.owner == mainObject.user.id)
                newShip.addScanrange();
        }
        DrawInterface.ScreenUpdate = true;
    }
    Ships.ReceiveShip = ReceiveShip;
    function RefreshShip(shipId, serverversion) {
        setTimeout(function () { Ships.RefreshShipAfterTimeout(shipId, serverversion); }, 1000);
    }
    Ships.RefreshShip = RefreshShip;
    function RefreshShipAfterTimeout(shipId, serverversion) {
        Helpers.Log(shipId.toString() + " " + serverversion.toString(), Helpers.LogType.DataUpdate);
        if (!mainObject.shipExists(shipId))
            return;
        var ShipToUpdate = mainObject.shipFind(shipId);
        if (ShipToUpdate.ServerVersion >= serverversion)
            return;
        //this method checks the former position, not the new position (in case of galaxy movement)
        //It can't check the new position, since that should not be transferred to the client in case that the client should not know of thi ship position
        //So a server sided scan map should be created and used. Then the whole point of fetching the data on demand is not needed anymore...
        //Even an alliance scan map is then viable
        var Scanner = null;
        if (ShipToUpdate.owner == mainObject.user.id)
            Scanner = ShipToUpdate;
        else
            Scanner = ShipToUpdate.FindNearbySpaceUnit();
        if (!Scanner)
            return;
        Ships.FetchShip(shipId, Scanner);
        //mainObject.InitShip(shipId);
    }
    Ships.RefreshShipAfterTimeout = RefreshShipAfterTimeout;
    function MakeDummyShipFromJSON(ship) {
        var Dummy = new Ships.Ship(ship["id"]);
        var ownerId = ship["userid"];
        var moveDirection = ship["moveDirection"];
        if (moveDirection !== null)
            Dummy.moveDirection = parseInt(moveDirection);
        var transcension = ship["shipTranscension"];
        if (transcension != null && transcension["shipId"] != "") {
            Helpers.Log("shipId 2 " + transcension["shipId"]);
            var transc = new ShipTranscension();
            var tDate = transcension["constructionDate"];
            transc.constructionDate = new Date(tDate);
            transc.transAddCount = parseInt(transcension["ressourceCount"], 10);
            transc.helperMinimumRelation = parseInt(transcension["helperMinimumRelation"], 10);
            transc.transAddCount = parseInt(transcension["amountInvested"], 10);
            transc.transAddNeeded = parseInt(transcension["transcendenceRequirement"], 10);
            Dummy.transcension = transc;
            transcension["ShipTranscensionUser"].each(function () {
                var userId = parseInt($(this)["userId"]);
                var amount = parseInt($(this)["helpCount"]);
                transc.shipTranscensionUsers.push({ userId: userId, amount: amount });
                //this.transcension.shipTranscensionUsers[userId] = amount;                    
            });
        }
        Dummy.name = ship["NAME"];
        Dummy.createTagFreeName();
        Dummy.galaxyColRow = { col: ship["posX"], row: ship["posY"] };
        Dummy.starColRow = { col: ship["systemX"], row: ship["systemY"] };
        var systemId = ship["systemId"];
        if (systemId != null && systemId > 0)
            Dummy.colRow = Dummy.starColRow;
        else
            Dummy.colRow = Dummy.galaxyColRow;
        Dummy.owner = parseInt(ownerId, 10);
        Dummy.systemId = systemId;
        Dummy.systemMapX = parseInt(ship["systemX"], 10);
        Dummy.systemMapY = parseInt(ship["systemY"], 10);
        Dummy.sytemMoves = Number(ship["impuls"]);
        Dummy.systemMovesMax = Number(ship["max_impuls"]);
        Dummy.starMoves = Number(ship["hyper"]);
        Dummy.galaxyMovesMax = Number(ship["max_hyper"]);
        Dummy.currentHitpoints = parseInt(ship["hitpoints"], 10);
        Dummy.damagereduction = parseInt(ship["damagereduction"], 10);
        Dummy.scanRange = parseInt(ship["scanRange"], 10);
        Dummy.isColonizer = ship["colonizer"] == 1 ? true : false;
        Dummy.shipHullId = parseInt(ship["hullid"], 10);
        Dummy.attack = parseInt(ship["attack"], 10);
        Dummy.defense = parseInt(ship["defense"], 10);
        Dummy.templateId = parseInt(ship["templateid"], 10);
        Dummy.objectId = parseInt(ship["objectid"], 10);
        Dummy.energy = parseInt(ship["energy"], 10);
        Dummy.crew = parseInt(ship["crew"], 10);
        Dummy.cargoroom = parseInt(ship["cargoroom"], 10);
        Dummy.fuelroom = parseInt(ship["fuelroom"], 10);
        Dummy.population = parseInt(ship["population"], 10);
        Dummy.shipHullsImage = parseInt(ship["shipHullsImage"], 10);
        Dummy.refitCounter = parseInt(ship["refitCounter"], 10);
        Dummy.Experience = parseInt(ship["Experience"], 10);
        Dummy.ServerVersion = parseInt(ship["ServerVersion"], 10);
        //clear goods
        Dummy.goods = [];
        var goods = ship["goods"];
        $.each(goods, function (index, elem) {
            var goodsId = elem["goodsId"];
            var id = parseInt(goodsId, 10);
            var amount = parseInt(elem["amount"], 10);
            Dummy.goods[id] = amount;
        });
        //clear modulePositions
        Dummy.modulePositions = [];
        var XMLmodules = ship["shipModules"];
        $.each(XMLmodules, function (index, elem) {
            var moduleId = elem["moduleId"];
            var posX = elem["posX"];
            var posY = elem["posY"];
            var newModule = new Ships.ModulePosition();
            newModule.shipmoduleId = parseInt(moduleId, 10);
            newModule.posX = parseInt(posX, 10);
            newModule.posY = parseInt(posY, 10);
            newModule.getModule();
            Dummy.modulePositions.push(newModule);
        });
        return Dummy;
    }
    Ships.MakeDummyShipFromJSON = MakeDummyShipFromJSON;
    function ApplyDummyToReal(dummy, checkForNewUser, moved) {
        if (checkForNewUser === void 0) { checkForNewUser = false; }
        if (moved === void 0) { moved = false; }
        if (!mainObject.shipExists(dummy.id))
            return;
        var RealShip = mainObject.shipFind(dummy.id);
        if (dummy.owner === -1) {
            RealShip.deleteShip();
            return;
        }
        if (dummy.systemId != RealShip.systemId) {
            RealShip.parentArea.removeShipFromArea(RealShip);
            RealShip.removeFromOldPosition();
            RealShip.parentArea = null;
            RealShip.updateAreaById(dummy.systemId);
        }
        //either the ship is new or it is updated
        RealShip.removeFromOldPosition();
        if (dummy.moveDirection !== null)
            RealShip.moveDirection = dummy.moveDirection;
        if (moved) {
            RealShip.lastMovedAt = new Date().getTime();
            RealShip.lastMovedFromGalaxyPosition = RealShip.galaxyColRow;
            RealShip.lastMovedFromStarSystemPosition = RealShip.starColRow;
            if (RealShip.systemId < 1 && dummy.systemId != 0) {
                var last = directionInt2ColRow(directionIntReverse(RealShip.moveDirection));
                RealShip.lastMovedFromStarSystemPosition = { col: dummy.starColRow.col + last.col, row: dummy.starColRow.row + last.row };
                //this.lastMovedFromStarSystemPosition = { col: 25, row: 25 };
            }
        }
        RealShip.transcension = dummy.transcension;
        RealShip.name = dummy.name;
        RealShip.createTagFreeName();
        RealShip.galaxyColRow = dummy.galaxyColRow;
        RealShip.starColRow = dummy.starColRow;
        RealShip.colRow = dummy.colRow;
        RealShip.owner = dummy.owner;
        RealShip.systemId = dummy.systemId;
        RealShip.systemMapX = dummy.systemMapX;
        RealShip.systemMapY = dummy.systemMapY;
        RealShip.sytemMoves = dummy.sytemMoves;
        RealShip.systemMovesMax = dummy.systemMovesMax;
        RealShip.starMoves = dummy.starMoves;
        RealShip.galaxyMovesMax = dummy.galaxyMovesMax;
        RealShip.currentHitpoints = dummy.currentHitpoints;
        RealShip.damagereduction = dummy.damagereduction;
        RealShip.scanRange = dummy.scanRange;
        RealShip.isColonizer = dummy.isColonizer;
        RealShip.shipHullId = dummy.shipHullId;
        RealShip.attack = dummy.attack;
        RealShip.defense = dummy.defense;
        RealShip.templateId = dummy.templateId;
        RealShip.objectId = dummy.objectId;
        RealShip.energy = dummy.energy;
        RealShip.crew = dummy.crew;
        RealShip.cargoroom = dummy.cargoroom;
        RealShip.fuelroom = dummy.fuelroom;
        RealShip.population = dummy.population;
        RealShip.shipHullsImage = dummy.shipHullsImage;
        RealShip.refitCounter = dummy.refitCounter;
        RealShip.Experience = dummy.Experience;
        RealShip.ServerVersion = dummy.ServerVersion;
        RealShip.goods = dummy.goods;
        RealShip.modulePositions = dummy.modulePositions;
        var tileOfShipPosition = RealShip.parentArea.tilemap.findCreateTile(RealShip.colRow);
        RealShip.finalizeShip();
        if (RealShip.getCurrentTile() != tileOfShipPosition) {
            RealShip.getCurrentTile().deleteShip(RealShip.id);
            tileOfShipPosition.ships.push(RealShip);
        }
        else {
            //check if ship was already added...
            if (!tileOfShipPosition.existShip(RealShip.id))
                tileOfShipPosition.ships.push(RealShip);
        }
        if (!mainObject.user.otherUserExists(RealShip.owner) && !RealShip.ownerCurrentlyChecked && RealShip.owner != mainObject.user.id && RealShip.owner != 0) {
            var scanShip;
            var scanColony;
            if (mainObject.currentShip == null && mainObject.currentColony == null) {
                var scanningObject = mainObject.fieldScannedBy(RealShip.galaxyColRow);
                if (scanningObject instanceof Ship)
                    scanShip = scanningObject.id;
                if (scanningObject instanceof ColonyModule.Colony)
                    scanColony = scanningObject.id;
            }
            //new player detected
            Helpers.Log('new player detected');
            RealShip.ownerCurrentlyChecked = true;
            mainObject.user.checkNewContact(RealShip.owner, RealShip.id, null, scanShip || mainObject.currentShip && mainObject.currentShip.id, scanColony || mainObject.currentColony && mainObject.currentColony.id);
        }
        if (RealShip.owner == 0)
            RealShip.Targeted = false;
    }
    Ships.ApplyDummyToReal = ApplyDummyToReal;
    function FetchShip(shipId, scanner) {
        $.connection.spaceHub.invoke("FetchShip", shipId, scanner.id, scanner instanceof Ships.Ship ? 0 : 1).done(function (e) {
            //Helpers.Log('2 FetchShip ' + shipId, Helpers.LogType.DataUpdate);            
            //console.log(e);
            if (!e["Ship"]) {
                Helpers.Log('3 FetchShip did sent empty return for ship id:' + shipId, Helpers.LogType.DataUpdate);
                mainObject.shipFind(shipId).deleteShip();
                DrawInterface.ScreenUpdate = true;
                return;
            }
            var json = $.parseJSON(e["Ship"]);
            var DummyShip = Ships.MakeDummyShipFromJSON(json);
            Ships.ApplyDummyToReal(DummyShip);
            DrawInterface.ScreenUpdate = true;
        });
    }
    Ships.FetchShip = FetchShip;
    function NextShip() {
        console.log("Space");
        mainObject.SelectNextShip();
    }
    Ships.NextShip = NextShip;
    function ShipInactive() {
        console.log("d");
        if (mainObject.currentShip) {
            if (mainObject.currentShip.Fleet) {
                mainObject.currentShip.Fleet.Sentry = !mainObject.currentShip.Fleet.Sentry;
            }
            mainObject.currentShip.Sentry = !mainObject.currentShip.Sentry;
            if (mainObject.currentShip.Sentry)
                $('#sentry button').addClass('buttonActive');
            else
                $('#sentry button').removeClass('buttonActive');
            $.connection.spaceHub.invoke("ShipActiveState", mainObject.currentShip.id, mainObject.currentShip.Sentry);
            //if ship was just set to inactive, selectNextShip
            if (mainObject.currentShip.Sentry)
                mainObject.SelectNextShip();
        }
    }
    Ships.ShipInactive = ShipInactive;
})(Ships || (Ships = {}));
//# sourceMappingURL=ships.js.map