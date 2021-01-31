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
//spaceObject is the superClass of : Stars, ships, Planets, Spacestations, anomalies,
//each has a name, a reference to an image-Object, a position, an owner (yes - also stars can have an owner - does just need a few additional parts that have to be implemented yet...)
//the type will be defined by the subClass the object belongs to...
var SpaceObject = /** @class */ (function () {
    function SpaceObject() {
        this.id = 0;
        this.name = 'Nameless';
        this.typeId = 4; //typeId references objecttTypes (imageObject)    
        this.ImageId = null; //ImageId references ObjectDescription (imageObject)    
        this.Image = null;
        this.owner = 0;
        this.colRow = { col: 1, row: 1 };
        this.goods = []; // goodsId - Amount ToDo->Should be moved to ShipModule.Ships and so on...
        this.cargoroom = -1; // -1 means it can contain cargo, but no new cargo may be moved onto it
    }
    SpaceObject.prototype.select = function () {
        mainObject.selectedObject = this;
        mainObject.currentShip = null;
        mainObject.currentColony = null;
        PanelController.showInfoPanel(PanelController.PanelChoice.Ship);
        //set object related buttons
        //refresh object statistics?
        //click object Quests?
        //for (var i = 0; i < QuestModule.inspectShipQuests.length; i++) {
        //    QuestModule.inspectShipQuests[i](ship, i);
        //}
    };
    SpaceObject.prototype.getCurrentTile = function () {
        if (this instanceof ColonyModule.Colony) {
            var tileToCheck = { col: mainObject.parseInt(this.colRow.col), row: mainObject.parseInt(this.colRow.row) };
            if (!galaxyMap.tilemap.tileExist(tileToCheck))
                return null;
            return galaxyMap.tilemap.map[mainObject.parseInt(tileToCheck.col)][mainObject.parseInt(tileToCheck.row)];
        }
        /// <summary>Determines the tile the object is located on.</summary>    
        /// <returns type="Object">Returns the tile the ship is currently on.</returns>
        var tileToCheck = { col: mainObject.parseInt(this.colRow.col), row: mainObject.parseInt(this.colRow.row) };
        if (!this.parentArea.tilemap.tileExist(tileToCheck))
            return null;
        return this.parentArea.tilemap.map[mainObject.parseInt(tileToCheck.col)][mainObject.parseInt(tileToCheck.row)];
        //if (this.area.tilemap instanceof StarMap)
        //    return this.area.tilemap.map[mainObject.parseInt(this.galaxyColRow.col)][mainObject.parseInt(this.galaxyColRow.row)];
        //if (this.area.tilemap instanceof SolarSystemMap)
        //    return this.area.tilemap.map[mainObject.parseInt(this.starColRow.col)][mainObject.parseInt(this.starColRow.row)];
    };
    SpaceObject.prototype.isOnCommNodeTile = function () {
        var commNode = CommModule.commNodeFindOnTile(this.getCurrentTile());
        return commNode != null;
    };
    // user has to be the owner of the object
    // used to show the trade-button
    //ToDO : omit this check for more performance  (TradePost has then to be selected manually)
    SpaceObject.prototype.canTrade = function () {
        if (this.owner != mainObject.user.id)
            return false;
        var commNode = CommModule.commNodeFindOnTile(this.getCurrentTile());
        //var ret = CommModule.commNodeExistsOnTile(this.getCurrentTile());
        TradeOffersModule.callingObject = this;
        TradeOffersModule.callingAtTradeport = commNode;
        return commNode != null;
    };
    SpaceObject.prototype.countCargo = function (isTradebar) {
        if (isTradebar === void 0) { isTradebar = false; }
        var goodsCount = 0;
        for (var i = 0; i < this.goods.length; i++) {
            if (this.goods[i] == null || this.goods[i] == 0)
                continue;
            if (mainObject.goods[i] == null)
                continue; //should never occur...
            //if (mainObject.goods[i].goodsType != 1) continue;
            if (mainObject.goods[i].goodsType == 3)
                continue;
            //normal goods are jst added
            if (mainObject.goods[i].goodsType == 1) {
                goodsCount += this.goods[i];
            }
            //modules cost as much as their production cost:
            if (mainObject.goods[i].goodsType == 2) {
                var Module = BaseDataModule.FindModuleByGoodId(i);
                goodsCount += this.goods[i] * Module.StorageCost();
            }
        }
        goodsCount += transferPanel.CargoChange(this);
        if (isTradebar)
            goodsCount += TradeOffersModule.TradeCreatePanel.CargoChange(this);
        return goodsCount;
    };
    SpaceObject.prototype.cargoHoldUsed = function (isTradebar) {
        if (isTradebar === void 0) { isTradebar = false; }
        return mainInterface.cargoHoldUsed(this.countCargo(isTradebar), this.cargoroom);
    };
    SpaceObject.prototype.addCargoToArray = function (_array) {
        for (var i = 0; i < this.goods.length; i++) {
            if (this.goods[i] == null || this.goods[i] == 0)
                continue;
            //if (mainObject.goods[i].goodsType != 1) continue;
            //ToDO: check can probably be omited
            if (_array[i] == null) {
                _array[i] = this.goods[i];
            }
            else {
                _array[i] += this.goods[i];
            }
        }
    };
    //user interface:
    SpaceObject.prototype.refreshMainScreenPanels = function () {
        var panel = $('#quickInfoList');
        panel.html('');
        //var heading = $('<span/>', { text: ship.name + " " });
        var heading = $('<span/>');
        heading.html(this.name.label() + " ");
        heading.css("font-weight", "bold");
        panel.append(heading);
        var coords = ' (' + this.colRow.col.toString() + '|' + this.colRow.row.toString() + ')';
        heading.append($('<span/>', { "text": coords, style: "font-size: 0.7em;font-weight: normal;" }));
        panel.append($('<br>'));
        //show message symbol if the selected unit belongs to another player
        if (this.owner != mainObject.user.id) {
            var otherUser = mainObject.user.otherUserFind(this.owner);
            //var owner = $('<span/>', { text: mainObject.user.otherUserFind(this.owner) && mainObject.user.otherUserFind(this.owner).name.label() + " " });
            var owner = $('<span/>');
            owner.html(mainObject.user.otherUserFind(this.owner) && mainObject.user.otherUserFind(this.owner).name.label() + " ");
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
            //check if colony:
            if (this instanceof ColonyModule.Colony) {
                var colony = this;
                // check if besieged If yes, show  
                var isBesieged = false;
                for (var i = 0; i < this.parentArea.shipsInArea.length; i++) {
                    var ship = this.parentArea.shipsInArea[i];
                    if (ship != null && ship.owner != this.owner && ship.owner != 0 && ship.isTroopTransport()) {
                        if (ship.owner != mainObject.user.id) {
                            var shipOwner = mainObject.user.otherUserFind(ship.owner);
                            for (var j = 0; j < shipOwner.relations.length; j++) {
                                if (shipOwner.relations[j].targetId == this.owner && shipOwner.relations[j].state == 0) {
                                    isBesieged = true;
                                    break;
                                }
                            }
                        }
                        else {
                            if (otherUser.currentRelation == 0) {
                                isBesieged = true;
                            }
                        }
                    }
                    if (isBesieged)
                        break;
                }
                if (isBesieged) {
                    var BesiegerName = colony.BesiegedBy.toString();
                    if (mainObject.user.id == colony.BesiegedBy) {
                        BesiegerName = mainObject.user.name;
                    }
                    else {
                        if (mainObject.user.otherUserExists(colony.BesiegedBy)) {
                            BesiegerName = mainObject.user.otherUsers[colony.BesiegedBy].shortTagFreeName();
                        }
                    }
                    var SiegeName = $('<span/>');
                    SiegeName.html(i18n.label(753).format(BesiegerName));
                    //panel.append($('<span/>', { text: i18n.label(753).format(BesiegerName) }));
                    panel.append(SiegeName);
                    var Resistance = $('<span/>', { "text": i18n.label(754).format(colony.TurnsOfSiege.toString()) });
                    Resistance.css("float", "right");
                    panel.append(Resistance);
                }
            }
            if (!isBesieged && colony.TurnsOfRioting > 0) {
                var Rioting = $('<span/>', { "text": i18n.label(981).format(colony.TurnsOfRioting.toString()) });
                Rioting.css("float", "right").css("font-weight", "bold").css("color", "#ff6644");
                panel.append(Rioting);
            }
        }
    };
    SpaceObject.prototype.getOwner = function () {
        if (this.owner == mainObject.user.id)
            return mainObject.user;
        else
            return mainObject.user.otherUsers[this.owner];
    };
    return SpaceObject;
}());
//colony or ship
var SpaceUnit = /** @class */ (function (_super) {
    __extends(SpaceUnit, _super);
    function SpaceUnit() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scanRange = 0;
        _this.scanEffectivity = 100;
        _this.colRow = { col: 1, row: 1 }; //used for drawing on the mainInterface (selecting the right tile for this ship)
        _this.galaxyColRow = { col: 1, row: 1 };
        _this.starColRow = { col: 1, row: 1 };
        return _this;
    }
    SpaceUnit.prototype.addGalaxyScanrange = function () {
        var scanColRow = { col: mainObject.parseInt(this.galaxyColRow.col) - this.scanRange, row: mainObject.parseInt(this.galaxyColRow.row) - this.scanRange };
        for (var i = 0; i < (this.scanRange * 2) + 1; i++) {
            for (var j = 0; j < (this.scanRange * 2) + 1; j++) {
                //Helpers.Log('Add: ' + scanColRow.col + i + ' / ' + scanColRow.row + j);
                scanMap.countUp({ col: mainObject.parseInt(scanColRow.col) + i, row: mainObject.parseInt(scanColRow.row) + j });
                FogOfWarModule.fog.insert(FogOfWarModule.makeBox(mainObject.parseInt(scanColRow.col) + i, mainObject.parseInt(scanColRow.row) + j));
            }
        }
    };
    SpaceUnit.prototype.ScansPosition = function (position) {
        if (this.galaxyColRow.col - this.scanRange <= position.col
            && this.galaxyColRow.col + this.scanRange >= position.col
            && this.galaxyColRow.row - this.scanRange <= position.row
            && this.galaxyColRow.row + this.scanRange >= position.row)
            return true;
        else
            return false;
    };
    return SpaceUnit;
}(SpaceObject));
//# sourceMappingURL=SpaceObject.js.map