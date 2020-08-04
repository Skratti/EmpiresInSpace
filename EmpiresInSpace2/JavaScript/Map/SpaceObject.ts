
//spaceObject is the superClass of : Stars, ships, Planets, Spacestations, anomalies,
//each has a name, a reference to an image-Object, a position, an owner (yes - also stars can have an owner - does just need a few additional parts that have to be implemented yet...)
//the type will be defined by the subClass the object belongs to...
class SpaceObject {

    id = 0;
    name = 'Nameless';
    typeId = 4;        //typeId references objecttTypes (imageObject)    
    ImageId: number = null; //ImageId references ObjectDescription (imageObject)    
    Image: BaseDataModule.ObjectImage = null;
    owner = 0;
    colRow = { col: 1, row: 1 };
    parentArea : AreaSpecifications; //the area containing this object. object is placed on a tile of the tilemap of this area...

    goods : number[] = []; // goodsId - Amount ToDo->Should be moved to ShipModule.Ships and so on...
    cargoroom: number = -1; // -1 means it can contain cargo, but no new cargo may be moved onto it


    select() {
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
    }



    getCurrentTile():Tile {
        /// <summary>Determines the tile the object is located on.</summary>    
        /// <returns type="Object">Returns the tile the ship is currently on.</returns>

        var tileToCheck = { col: mainObject.parseInt(this.colRow.col), row: mainObject.parseInt(this.colRow.row) };
        if (!this.parentArea.tilemap.tileExist(tileToCheck)) return null;

        return this.parentArea.tilemap.map[mainObject.parseInt(tileToCheck.col)][mainObject.parseInt(tileToCheck.row)];
        //if (this.area.tilemap instanceof StarMap)
        //    return this.area.tilemap.map[mainObject.parseInt(this.galaxyColRow.col)][mainObject.parseInt(this.galaxyColRow.row)];
        //if (this.area.tilemap instanceof SolarSystemMap)
        //    return this.area.tilemap.map[mainObject.parseInt(this.starColRow.col)][mainObject.parseInt(this.starColRow.row)];
    }

    isOnCommNodeTile(): boolean {
        var commNode = CommModule.commNodeFindOnTile(this.getCurrentTile());
        return commNode != null;
    }

    // user has to be the owner of the object
    // used to show the trade-button
    //ToDO : omit this check for more performance  (TradePost has then to be selected manually)
    canTrade(): boolean {
        if (this.owner != mainObject.user.id) return false;

        var commNode = CommModule.commNodeFindOnTile(this.getCurrentTile());
        //var ret = CommModule.commNodeExistsOnTile(this.getCurrentTile());
        
        TradeOffersModule.callingObject = this;
        TradeOffersModule.callingAtTradeport = commNode;      
        
        return commNode != null;
    }

    countCargo(isTradebar = false): number {
        var goodsCount = 0;
        for (var i = 0; i < this.goods.length; i++) {
            if (this.goods[i] == null || this.goods[i] == 0) continue;
            if (mainObject.goods[i] == null) continue; //should never occur...
            //if (mainObject.goods[i].goodsType != 1) continue;
            if (mainObject.goods[i].goodsType == 3) continue;



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

        if (isTradebar) goodsCount += TradeOffersModule.TradeCreatePanel.CargoChange(this);

        return goodsCount;
    }

    cargoHoldUsed(isTradebar = false): number   {                      
        return mainInterface.cargoHoldUsed(this.countCargo(isTradebar), this.cargoroom);              
    }

    addCargoToArray(_array: number[]) {
        for (var i = 0; i < this.goods.length; i++) {
            if (this.goods[i] == null || this.goods[i] == 0) continue;

            //if (mainObject.goods[i].goodsType != 1) continue;
            //ToDO: check can probably be omited
            if (_array[i] == null) {
                _array[i] = this.goods[i];
            }
            else {
                _array[i] += this.goods[i];
            }
           
        }
    }

    //user interface:
    refreshMainScreenPanels() {

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
            writeMail.click((e) => { MessageModule.userInterface.showMessageWrite(otherUser); e.stopPropagation(); });
            writeMail.mousedown((e) => { e.stopPropagation(); });
            writeMail.mouseup((e) => { e.stopPropagation(); });
            owner.append(writeMail);
            panel.append($('<br>'));

            //check if colony:
            if (this instanceof ColonyModule.Colony) {
                var colony = <ColonyModule.Colony>this;
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

                    if (isBesieged) break;
                }

                if (isBesieged) {
                    var BesiegerName = colony.BesiegedBy.toString();
                    if (mainObject.user.id == colony.BesiegedBy) {
                        BesiegerName = mainObject.user.name;
                    } else {
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
    }

    getOwner(): PlayerData.User {
        if (this.owner == mainObject.user.id) return mainObject.user;
        else return mainObject.user.otherUsers[this.owner];
    }

}

//colony or ship
class SpaceUnit extends SpaceObject {

    scanRange = 0;
    scanEffectivity = 100;
    colRow = { col: 1, row: 1 }; //used for drawing on the mainInterface (selecting the right tile for this ship)
    galaxyColRow = { col: 1, row: 1 };
    starColRow = { col: 1, row: 1 };

    addGalaxyScanrange() {
        var scanColRow = { col: mainObject.parseInt(this.galaxyColRow.col) - this.scanRange, row: mainObject.parseInt(this.galaxyColRow.row) - this.scanRange };
        for (var i = 0; i < (this.scanRange * 2) + 1; i++) {
            for (var j = 0; j < (this.scanRange * 2) + 1; j++) {
                //Helpers.Log('Add: ' + scanColRow.col + i + ' / ' + scanColRow.row + j);
                scanMap.countUp({ col: mainObject.parseInt(scanColRow.col) + i, row: mainObject.parseInt(scanColRow.row) + j });

                FogOfWarModule.fog.insert(FogOfWarModule.makeBox(mainObject.parseInt(scanColRow.col) + i, mainObject.parseInt(scanColRow.row) + j));
            }
        }
    }

    ScansPosition(position: ColRow): boolean {
        if (this.galaxyColRow.col - this.scanRange <= position.col
            && this.galaxyColRow.col + this.scanRange >= position.col
            && this.galaxyColRow.row - this.scanRange <= position.row
            && this.galaxyColRow.row + this.scanRange >= position.row)
            return true;
        else
            return false;
    }
}
