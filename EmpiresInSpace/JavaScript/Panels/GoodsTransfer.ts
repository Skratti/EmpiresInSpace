module TransferModule {

    var TrashCan: SpaceObject;
    var Recycling: SpaceObject;

    export enum TransferAmount {
        One = 1,
        Ten= 10,
        Hundred = 100,
        All = 100000
    }

    export class TransferPanel {

        IsOpen = false;
        HasChanges = false;
        TransferredGoods: number[] = []; //goodid and transferamount. Positiv is sender to target, negativ is target to sender

        Sender: SpaceObject;
        Target: SpaceObject; //the object which has goods to show  -> This can also be a mocked object, to enable scrapping and recycling. id = 0 : recycle | id = -1 : scrap
        tile: Tile;
        AmountToTransfer: TransferAmount = TransferAmount.All;

        TargetCanTransfer = true;

        /*
        if (this.objToTransferTo.owner != mainObject.user.id && this.objToTransferTo.owner != 0
                && mainObject.user.relationToOtherUser(this.objToTransferTo.owner) != 0) {
                div3input.prop('disabled', true);
            }
        */

        SetTransferAmount(newValue: TransferModule.TransferAmount) {
            this.AmountToTransfer = newValue;
            $("#TransferButtons button").removeClass("buttonActive");

            switch (this.AmountToTransfer) {
                case TransferAmount.One:
                    $("#TransferButtons #TransferButton1").addClass("buttonActive");
                    break;
                case TransferAmount.Ten:
                    $("#TransferButtons #TransferButton10").addClass("buttonActive");
                    break;
                case TransferAmount.Hundred:
                    $("#TransferButtons #TransferButton100").addClass("buttonActive");
                    break;
                case TransferAmount.All:
                    $("#TransferButtons #TransferButtonI").addClass("buttonActive");
                    break;
            }
        }

        ShowTargetStorage() {
            //empty and construct the goods area:
            var quickInfo = $("#TransferGoods");
            quickInfo.empty();
            quickInfo.append(DrawInterface.createCargoHoldBar(this.Target));

            var goodsOverflow = $("<div/>");
            goodsOverflow.addClass("goodsOverflow");
            //goodsOverflow.css("overflow-y", "auto");
            //goodsOverflow.css("height", "130px");

            var goodsContainer = $("<div/>");

            quickInfo.append(goodsOverflow);
            goodsOverflow.append(goodsContainer);

            for (var currentGoodsIndex = 0; currentGoodsIndex < mainObject.goods.length; currentGoodsIndex++) {
                if (this.Target.goods[currentGoodsIndex] == null && this.TransferredGoods[currentGoodsIndex] == null) continue;

                if (mainObject.goods[currentGoodsIndex].goodsType == 3) continue;
                
                var amountInStore = 0;
                if (this.Target.goods[currentGoodsIndex] != null) amountInStore = this.Target.goods[currentGoodsIndex];
                amountInStore += this.PendingTransfer(currentGoodsIndex);

                var currentGoodsDiv = DrawInterface.createGoodsDiv(currentGoodsIndex, amountInStore);
                currentGoodsDiv.css("display", "inline-block");
                currentGoodsDiv.css("margin", "2px");
                currentGoodsDiv.css("vertical-align", "middle");

                var cId = currentGoodsIndex;
                this.BindTargetGoodClick(cId, currentGoodsDiv);                                
                
                DrawInterface.tooltipGoods(currentGoodsDiv, currentGoodsIndex, [], null, null);
                
                goodsContainer.append(currentGoodsDiv);
            }
        }

        //The target Ships List
        RefreshShipList() {
            var ownShipBorder = 'thin solid green"';
            var enemyShipBorder = 'thin solid red"';
            var selectedShipBorder = 'thin solid blue';

            var shipList = $("#TransferShips");
            shipList.empty();


            if (mainObject.currentColony == null) {
                if (this.tile.astronomicalObject != null) {
                    if (this.tile.astronomicalObject instanceof PlanetData) {
                        var planet: PlanetData = <PlanetData> this.tile.astronomicalObject;
                        if (planet.colony != null && planet.isMainColony() ) {
                            var outerColony = $("<div/>", { "class": "OuterShipListDiv" });
                            var innerColony = $("<div/>", { "class": "ShipListDiv" });

                            var colonyImage = $("<img/>", { src: mainObject.imageObjects[planet.typeId].texture.src, alt: "goods", width: "30px", height: "30px" });

                            //colonyImage.bind("mousedown touchstart", function (e) { e.stopPropagation(); DrawInterface.clickOnColony(planet.colony); });
                            if (planet.colony.owner == mainObject.user.id)
                                colonyImage.css('border', ownShipBorder);
                            else
                                colonyImage.css('border', enemyShipBorder);

                            innerColony.append(colonyImage);
                            outerColony.append(innerColony);
                            shipList.append(outerColony);

                            this.BindShipListShipClick(planet.colony, outerColony);
                        }
                    }
                }
            }

            for (var i = 0; i < this.tile.ships.length; i++) {
                if (this.tile.ships[i] == null) continue;

                if (this.tile.ships[i] == this.Sender) continue;

                var shipDiv = DrawInterface.createShipDiv(this.tile.ships[i]);
                if (this.Target == this.tile.ships[i]) {
                    shipDiv.css('border', selectedShipBorder);
                }
                var ship = this.tile.ships[i];

                shipDiv.unbind("mousedown");
                shipDiv.unbind("touchstart");
                this.BindShipListShipClick(ship, shipDiv);


                shipList.append(shipDiv);
                this.tile.ships[i].toolTip(shipDiv);  
            }


            //if colony, add trashacan and recycle:
            if (mainObject.currentColony != null) {

                var outerColony = $("<div/>", { "class": "OuterShipListDiv" });
                var innerColony = $("<div/>", { "class": "ShipListDiv" });

                var colonyImage = $("<img/>", { src: mainObject.imageObjects[300].texture.src, alt: "goods", width: "30px", height: "30px" });
                innerColony.append(colonyImage);
                outerColony.append(innerColony);
                shipList.append(outerColony);

                this.BindShipListShipClick(TrashCan, outerColony);

                var outerColony2 = $("<div/>", { "class": "OuterShipListDiv" });
                var innerColony2 = $("<div/>", { "class": "ShipListDiv" });

                var colonyImage2 = $("<img/>", { src: mainObject.imageObjects[301].texture.src, alt: "goods", width: "30px", height: "30px" });
                innerColony2.append(colonyImage2);
                outerColony2.append(innerColony2);
                shipList.append(outerColony2);

                this.BindShipListShipClick(Recycling, outerColony2);

            }

        }

        RefreshTargetDetails() {            
            this.TargetCanTransfer = true;
            if (this.Target.owner != mainObject.user.id && this.Target.owner != 0
                && mainObject.user.relationToOtherUser(this.Target.owner) != 0
                && mainObject.user.relationToOtherUser(this.Target.owner) != 5
                ) {
                this.TargetCanTransfer = false;
            }

            //scrap and recycle can't transfer
            //if (this.Target.id < 1) this.TargetCanTransfer = false;


            var shipList = $("#TransferShipSelection");
            shipList.empty();

            if (this.Target instanceof Ships.Ship) {
                var Ship = <Ships.Ship>this.Target;
                var shipDiv = DrawInterface.createShipDiv(Ship);
                
                shipDiv.unbind("mousedown");
                shipDiv.unbind("touchstart");
                this.BindShipListShipClick(this.Target, shipDiv);

                shipList.append(shipDiv);
                Ship.toolTip(shipDiv);

                var NameDiv = $("<div/>", { "class":"DivVertInlineBlock"});
                var Name = $("<span/>");
                Name.html(Ship.name.label());
                NameDiv.append(Name);
                shipList.append(NameDiv);

                Helpers.Log('Ship', Helpers.LogType.Transfer);
            }

            if (this.Target instanceof ColonyModule.Colony)
            {
                
                var planet: PlanetData = <PlanetData> this.tile.astronomicalObject;
                var outerColony = $("<div/>", { "class": "OuterShipListDiv" });
                var innerColony = $("<div/>", { "class": "ShipListDiv" });
                var colonyImage = $("<img/>", { src: mainObject.imageObjects[planet.typeId].texture.src, alt: "goods", width: "30px", height: "30px" });
               
                innerColony.append(colonyImage);
                outerColony.append(innerColony);
                shipList.append(outerColony);

                var NameDiv = $("<div/>", { "class": "DivVertInlineBlock" });
                var Name = $("<span/>");
                Name.html(this.Target.name.label());
                NameDiv.append(Name);
                shipList.append(NameDiv);
                Helpers.Log('Colony', Helpers.LogType.Transfer);
            }

            if (this.Target instanceof SpaceObject &&
                !(this.Target instanceof Ships.Ship ||
                this.Target instanceof ColonyModule.Colony)) {

                var planet: PlanetData = <PlanetData> this.tile.astronomicalObject;
                var outerColony = $("<div/>", { "class": "OuterShipListDiv" });
                var innerColony = $("<div/>", { "class": "ShipListDiv" });
                var colonyImage = $("<img/>", { src: mainObject.imageObjects[this.Target.ImageId].texture.src, alt: "goods", width: "30px", height: "30px" });

                innerColony.append(colonyImage);
                outerColony.append(innerColony);
                shipList.append(outerColony);

                var NameDiv = $("<div/>", { "class": "DivVertInlineBlock" });
                var Name = $("<span/>");
                Name.html(this.Target.name);
                NameDiv.append(Name);
                shipList.append(NameDiv);
                Helpers.Log('Colony', Helpers.LogType.Transfer);


                Helpers.Log('Scrap or Recycle', Helpers.LogType.Transfer);
            }

        }

        BindShipListShipClick(spaceObject: SpaceObject, shipDiv:JQuery) {
            shipDiv.bind("mousedown touchstart", (e) => { e.stopPropagation(); transferPanel.SwitchTarget(spaceObject); });
        }

        ResetChanges() {
            this.TransferredGoods = [];
            this.HasChanges = false;
            this.ShowTargetStorage();
            DrawInterface.refreshQuickInfoGoods();
        }

        ChooseInitialTarget() {

            
            if (this.Target != null) return;

            //try set colony as target
            if (mainObject.currentColony == null) {
                if (this.tile.astronomicalObject != null) {
                    if (this.tile.astronomicalObject instanceof PlanetData) {
                        var planet: PlanetData = <PlanetData> this.tile.astronomicalObject;
                        if (planet.colony != null && planet.isMainColony()) {
                            this.Target = planet.colony;                                              
                        }
                    }
                }
            } 

            //try set ship as target
            if (this.Target == null) {
                for (var i = 0; i < this.tile.ships.length; i++) {
                    if (this.tile.ships[i] == null) continue;
                    if (this.tile.ships[i] == this.Sender) continue;

                    this.Target = this.tile.ships[i];
                    break;                    
                }
            }

            //fallback: use scrap as target
            if (this.Target == null) this.Target = TrashCan;
            this.RefreshTargetDetails();
        }

        SwitchTarget(spaceObject: SpaceObject) {
            if (this.HasChanges) this.SendChanges();
            

            this.Target = spaceObject;
            this.RefreshShipList();
            this.ShowTargetStorage();
            this.RefreshTargetDetails();
        }

        OpenTransfer() {
            if (this.IsOpen) { this.CloseTransfer(); return; }

            if (this.Sender == null && mainObject.currentShip != null) this.Sender = mainObject.currentShip;
            if (this.Sender == null && mainObject.currentColony != null) this.Sender = mainObject.currentColony;
            this.tile = this.Sender.parentArea.tilemap.findCreateTile({ col: mainObject.parseInt(this.Sender.colRow.col), row: mainObject.parseInt(this.Sender.colRow.row) });

            this.ChooseInitialTarget();
            this.ShowTargetStorage();
            this.RefreshShipList();

            $("#TransferPanel").css("display", "block");
            $("#toolTransfer button").addClass("buttonActive")
            this.IsOpen = true;
        }       

        CloseTransfer() {            
            if (this.HasChanges) this.SendChanges();
            

            $("#TransferPanel").css("display", "none");
            
            this.Sender = null;
            this.Target = null;
            this.IsOpen = false;
            this.SetTransferAmount(TransferAmount.All);

            $("#toolTransfer button").removeClass("buttonActive")
        }

        MakeJSON(): string {
            //{"Sender":2,"Target":5,"SenderType":1,"TargetType":2,"Goods":[{"Item1":1,"Item2":5},{"Item1":3,"Item2":15},{"Item1":2015,"Item2":6}]}
            //{"Sender":2,"Target":5,"SenderType":1,"TargetType":2,"Goods":[{"Id":1,"Qty":5},{"GoodId":3,"Amount":15},{"GoodId":2015,"Amount":6}]}
            if (this.Sender == null || this.Target == null || this.TransferredGoods.length == 0) return "";

            var serialized = '{"Sender":' + this.Sender.id.toString() + ',';
            serialized += '"SenderType":' + (this.Sender instanceof Ships.Ship ? "1" : "2") + ','; 
            serialized += '"Target":' + this.Target.id.toString() + ',';
            serialized += '"TargetType":' + (this.Target instanceof Ships.Ship ? "1" : "2") + ','; 

            serialized += '"Goods":['; 
            var FirstDone = false;
            for (var i = 0; i < this.TransferredGoods.length; i++) {
                if (this.TransferredGoods[i] == null || this.TransferredGoods[i] == 0) continue;
                if (mainObject.goods[i] == null) continue; //should never occur...               
                if (mainObject.goods[i].goodsType == 3) continue;

                if (FirstDone) serialized += ','; else FirstDone = true;
                
                serialized += '{"Id":' + i.toString() + ',"Qty":' + this.TransferredGoods[i].toString() + '}';
            }
            serialized += ']}';

            Helpers.Log(serialized, Helpers.LogType.Transfer);
            return serialized;
        }

        SendChanges() {
            var ToSend = this.MakeJSON();
            if (ToSend == "") return;
            
            // apply changes to Sender and Target
            for (var i = 0; i < this.TransferredGoods.length; i++) {
                if (this.TransferredGoods[i] == null || this.TransferredGoods[i] == 0) continue;
                if (mainObject.goods[i] == null) continue; //should never occur...               
                if (mainObject.goods[i].goodsType == 3) continue;

                if (this.Sender.goods[i]) {
                    this.Sender.goods[i] -= this.TransferredGoods[i];
                } else {
                    this.Sender.goods[i] = -this.TransferredGoods[i];
                }
               
                if (this.Target.goods[i]) {
                    this.Target.goods[i] += this.TransferredGoods[i];
                } else {
                    this.Target.goods[i] = this.TransferredGoods[i];
                }      

                //if recycling action is executes, add the raw materials to storage
                if (this.Target.id == 0) {
                    this.RecycleSelection(i, this.TransferredGoods[i]);                    
                }
            }

            //Send to Server:
            var xhttp = GetXmlHttpObject();
            xhttp.open("POST", "Server/TradeTransfer.aspx?action=transfer2");
            xhttp.send(ToSend);

            TrashCan.goods = [];
            Recycling.goods = [];
            this.TransferredGoods = [];
            this.HasChanges = false;

            //in case of recycle, refresh info. This has to be done after  this.TransferredGoods = []; !
            if (this.Target.id == 0) {
                DrawInterface.refreshQuickInfoGoods();
            }
        }

        RecycleSelection(goodid: number, amount: number) {
            //if recycling action is executes, add the raw materials to storage
            //modules cost as much as their production cost:
            if (mainObject.goods[goodid].goodsType == 2) {

                var Module = BaseDataModule.FindModuleByGoodId(goodid);

                //iterate modules costs
                for (var goodsIndex = 0; goodsIndex < Module.costs.length; goodsIndex++) {
                    if (Module.costs[goodsIndex] == null) continue;

                    //omit all etheral costs (enery, assembly etc)
                    if (mainObject.goods[goodsIndex].goodsType == 3) continue;

                    //if module was created using other modules, recursion:
                    if (mainObject.goods[goodsIndex].goodsType == 2) {
                        this.RecycleSelection(goodsIndex, Module.costs[goodsIndex]);
                        
                        continue;
                    }

                    if (this.Sender.goods[goodsIndex]) {
                        this.Sender.goods[goodsIndex] += Module.costs[goodsIndex];
                    } else {
                        this.Sender.goods[goodsIndex] = Module.costs[goodsIndex];
                    }
                }                             
            }            
        }


        PendingTransfer(goodId: number): number {
            if (this.TransferredGoods.length <= goodId) return 0; 
            if (this.TransferredGoods[goodId]) return this.TransferredGoods[goodId];
            return 0;
        }

        BindTargetGoodClick(goodId: number, div: JQuery) {
            div.bind("mousedown touchstart", (e) => { e.stopPropagation(); transferPanel.TargetGoodClick(goodId); });
        }

        TargetGoodClick(goodId: number) {
            if (!this.TargetCanTransfer) return;

            this.HasChanges = true;
            var Pending = this.TransferredGoods[goodId] || 0;
            var ToTransfer = Math.min((this.Target.goods[goodId] || 0) + Pending, this.AmountToTransfer);            
            var storageCost = 1;

            //modules cost as much as their production cost:
            if (mainObject.goods[goodId].goodsType == 2) {
                var Module = BaseDataModule.FindModuleByGoodId(goodId);
                storageCost = Module.StorageCost();
            }

            var CargoRoomAvailable = Math.max(this.Sender.cargoroom - this.Sender.countCargo(), 0);

            
            CargoRoomAvailable = Math.floor(CargoRoomAvailable / storageCost);

            ToTransfer = Math.min(ToTransfer, CargoRoomAvailable);
            //Helpers.Log(ToTransfer.toString(), Helpers.LogType.Transfer);

            if (this.TransferredGoods[goodId] == null || this.TransferredGoods[goodId] == 0)
                this.TransferredGoods[goodId] = -ToTransfer;
            else
                this.TransferredGoods[goodId] -= ToTransfer;

            this.ShowTargetStorage();
            DrawInterface.refreshQuickInfoGoods();
        }

        BindSenderGoodClick(goodId: number, div: JQuery) {
            div.bind("mousedown touchstart", (e) => { e.stopPropagation(); transferPanel.SenderGoodClick(goodId); });
        }

        SenderGoodClick(goodId: number) {
            if (!this.IsOpen) return;

            //if recycling ist the choosen target, skip all non-module goods:
            if (this.Target.id == 0 && mainObject.goods[goodId].goodsType != 2) return;

            this.HasChanges = true;
            var Pending = this.TransferredGoods[goodId] || 0;
            var ToTransfer = Math.min((this.Sender.goods[goodId] || 0) - Pending, this.AmountToTransfer);

            //modules cost as much as their production cost:
            var storageCost = 1;            
            if (mainObject.goods[goodId].goodsType == 2) {
                var Module = BaseDataModule.FindModuleByGoodId(goodId);
                storageCost = Module.StorageCost();
            }


            var CargoRoomAvailable = Math.max(this.Target.cargoroom - this.Target.countCargo(), 0);
            CargoRoomAvailable = Math.floor(CargoRoomAvailable / storageCost);

            ToTransfer = Math.min(ToTransfer, CargoRoomAvailable);

            

            //Helpers.Log(ToTransfer.toString(), Helpers.LogType.Transfer);

            if (this.TransferredGoods[goodId] == null || this.TransferredGoods[goodId] == 0)
                this.TransferredGoods[goodId] = ToTransfer;
            else
                this.TransferredGoods[goodId] += ToTransfer;

            this.ShowTargetStorage();
            DrawInterface.refreshQuickInfoGoods();
        }

        CargoChange(spaceObject: SpaceObject): number {
            if (!(this.Sender == spaceObject || this.Target == spaceObject)) return 0;

            var Mult = this.Sender == spaceObject ? -1 : 1;
            var goodsCount = 0;

            for (var i = 0; i < this.TransferredGoods.length; i++) {
                if (this.TransferredGoods[i] == null || this.TransferredGoods[i] == 0) continue;
                if (mainObject.goods[i] == null) continue; //should never occur...               
                if (mainObject.goods[i].goodsType == 3) continue;

                //normal goods are jst added
                if (mainObject.goods[i].goodsType == 1) {
                    goodsCount += this.TransferredGoods[i];
                }

                //modules cost as much as their production cost:
                if (mainObject.goods[i].goodsType == 2) {
                    var Module = BaseDataModule.FindModuleByGoodId(i);
                    goodsCount += this.TransferredGoods[i] * Module.StorageCost();
                }
            }

            return goodsCount * Mult;
        }
        

    }

    //enables TransferButton if there is another ship or a colony at the site of the current ship
    //Ships and Colonies both extend SpaceObject  ;
    export function enableTransferButton(_spaceObject: SpaceObject)
    {
        if (_spaceObject.owner != mainObject.user.id) return;

        var counter = 0;
        if (_spaceObject.parentArea instanceof StarData) {
            //counter = _spaceObject.parentArea.tilemap.map[_spaceObject.colRow.col][_spaceObject.colRow.row].ships.length;
            var tile = _spaceObject.getCurrentTile();
            counter = tile.ships.length;

            if (tile.astronomicalObject) {
                var star: PlanetData | StarData = <StarData>tile.astronomicalObject;
                if (star.colony && star.isMainColony()) counter+=2;
            }
        }

        if (_spaceObject.parentArea instanceof GalaxyData) {
            counter = _spaceObject.parentArea.tilemap.map[_spaceObject.colRow.col][_spaceObject.colRow.row].ships.length;
        }


        if (counter > 1)
            document.getElementById('toolTransfer').style.display = 'block'; //transfer
        else
            document.getElementById('toolTransfer').style.display = 'none'; //transfer
    }

    export function CreateSymbols() {
        TrashCan = new SpaceObject();
        TrashCan.id = -1;
        TrashCan.cargoroom = 32000;
        TrashCan.ImageId = 300;
        TrashCan.name = i18n.label(994);

        Recycling = new SpaceObject();
        Recycling.id = 0;
        Recycling.cargoroom = 32000;
        Recycling.ImageId = 301;
        Recycling.name = i18n.label(995);
    }
    
}
