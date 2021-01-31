//several objects that bind events to html-elements
//canvasKeyListener  -- keys
//canvasMouseListener -- click and drag
//canvasMouseScrollListener -- zooming
//ToDO: warum werden die events im Konstruktir registriert?
//ToDO: könnte vermutlich komplett überarbeitet werden...
var CanvasMouseListener = /** @class */ (function () {
    function CanvasMouseListener() {
        var _this = this;
        this.moveTimer = new Date();
        this.dragging = false;
        this.shipToMove = false;
        //var listening = false;
        //var disposed = false;
        this.MouseDragBeginX = 0;
        this.MouseDragBeginY = 0;
        this.TooltipTimerId = 0;
        this.moveMouse = function (e) {
            if (!currentMap)
                return;
            var x = $(".canvasContainer").position().left;
            //choose the mouseUp versus touchend and "touchSingleClickEnd"
            var clientX = e.clientX ||
                e.originalEvent.targetTouches && e.originalEvent.targetTouches[0] && e.originalEvent.targetTouches[0].pageX ||
                e.originalEvent.changedTouches && e.originalEvent.changedTouches[0] && e.originalEvent.changedTouches[0].pageX ||
                0;
            var clientY = e.clientY ||
                e.originalEvent.targetTouches && e.originalEvent.targetTouches[0] && e.originalEvent.targetTouches[0].pageY ||
                e.originalEvent.changedTouches && e.originalEvent.changedTouches[0] && e.originalEvent.changedTouches[0].pageY ||
                0;
            var colRow = mainInterface.pixelToGrid(clientX + currentMap.scroll.x - x, clientY + currentMap.scroll.y);
            //refresh screen if a building is selected and the mouseover-Coordinates changed:
            if ((currentMap.MouseOverField.col != colRow.col || currentMap.MouseOverField.row != colRow.row) && mainObject.selectedBuilding != null && mainObject.selectedBuilding > 0) {
                DrawInterface.ScreenUpdate = true;
            }
            //var clientX = e.clientX || (<any>e).originalEvent.targetTouches[0].pageX;
            //var clientY = e.clientY || (<any>e).originalEvent.targetTouches[0].pageY;
            //var colRow : ColRow = mainInterface.pixelToGrid(clientX + currentMap.scroll.x, clientY + currentMap.scroll.y);
            //Helpers.Log("MouseMove colRow" + colRow);
            if (currentMap.MouseOverField.col != colRow.col || currentMap.MouseOverField.row != colRow.row) {
                currentMap.MouseMoveStartTime = (new Date()).getTime();
                currentMap.MouseOverField = colRow;
                clearTimeout(_this.TooltipTimerId);
                if (DrawInterface.TooltipShown) {
                    DrawInterface.ScreenUpdate = true;
                    DrawInterface.TooltipShown = false;
                }
            }
            _this.TooltipTimerId = setTimeout(function () {
                var tileToDraw = currentMap.map[colRow.col] && currentMap.map[colRow.col][colRow.row] || null;
                var currentTime = (new Date()).getTime();
                DrawInterface.drawCanvasTooltip(colRow.col, colRow.row, currentTime, tileToDraw);
            }, 900);
        };
        this.dragMouseBegin = function (e) {
            e.stopPropagation();
            //Helpers.Log('dragMouseBegin');
            //Helpers.Log($(".canvasContainer").position().left);
            //Helpers.Log($(".canvasContainer").offset().left);
            //check if user clicks on one of his ships to move it or activate it:
            var clientX = e.clientX || e.originalEvent.targetTouches && e.originalEvent.targetTouches[0].pageX || 0;
            var clientY = e.clientY || e.originalEvent.targetTouches && e.originalEvent.targetTouches[0].pageY || 0;
            var colRow = mainInterface.pixelToGrid(clientX + currentMap.scroll.x, clientY + currentMap.scroll.y);
            if (currentMap.tileExist(colRow)) {
                var tile = currentMap.map[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)];
                //check if the currentShip is part of the ships in this field. If yes, set selectedShip to currentShip, else chose the first own ship on this tile as the selected
                var selectedShip = null;
                if (mainObject.currentShip !== null && mainObject.currentShip.getCurrentTile() === tile)
                    selectedShip = mainObject.currentShip;
                else
                    selectedShip = tile.getFirstOwnShip();
                if (selectedShip != null) {
                    mainObject.selectShip(selectedShip);
                    _this.shipToMove = true;
                    mainObject.currentShip.MoveShipStartColRow = colRow;
                    //selectedShip.MoveShipEndColRow = null;
                    //mainObject.refreshMovementLeft(selectedShip);
                    Ships.UserInterface.refreshMainScreenStatistics(selectedShip);
                    if (DrawInterface.TooltipShown) {
                        DrawInterface.TooltipShown = false;
                        $("#CanvasTooltip").css("display", "none");
                    }
                    mainInterface.drawAll();
                }
            }
            //DragMouseEnds evaluates to single click or drag
            // check single click with a timeout. After 150 ms, longtouch will be set to true. 
            //this.timeout = setTimeout(function () { this.longtouch = true; }, 300);
            _this.timeout = setTimeout(function () { _this.longtouch = true; }, 150);
            //Helpers.Log('timeout start : ' + this.timeout);
            $("#canvas1").bind("mouseup touchend", _this.dragMouseEnd);
            $("#tools").bind("mouseup touchend", _this.mouseUpOverForeground);
            $("#quickInfo-container").bind("mouseup touchend", _this.mouseUpOverForeground);
            $("#TransferPanel").bind("mouseup touchend", function (e) { e.stopPropagation(); });
            //if (dragging || (!mainInterface.isScrollXEnabled && !mainInterface.isScrollYEnabled))
            if (_this.dragging)
                return;
            _this.dragging = true;
            currentMap.MouseOverField.col = 0;
            currentMap.MouseOverField.row = 0;
            //clearTimeout(this.TooltipTimerId);
            _this.MouseDragBeginX = e.clientX || e.originalEvent.targetTouches[0].pageX;
            _this.MouseDragBeginY = e.clientY || e.originalEvent.targetTouches[0].pageY;
            $("#canvas1").bind("mousemove touchmove", _this.dragMouse);
            $("#tools").bind("mousemove touchmove", _this.dragMouse);
            $("#quickInfo-container").bind("mousemove touchmove", _this.dragMouse);
            $("#CanvasTooltipContainer").bind("mousemove touchmove", _this.dragMouse);
            //$("#ui").mousemove(function (e) {                e.stopPropagation();            });
            //$("#canvas1").bind("touchmove", this.dragMouse);
            DrawInterface.ScreenUpdate = true;
            return cancelEvent(e);
        };
        this.dragOverForeground = function (e) {
            _this.dragMouse(e);
        };
        this.mouseUpOverForeground = function (e) {
            _this.dragMouseEnd(e);
        };
        this.dragMouse = function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (!_this.dragging)
                return;
            DrawInterface.ScreenUpdate = true;
            //clearTimeout(this.TooltipTimerId);
            var newMoveTimer = new Date();
            var dur = newMoveTimer.getTime() - _this.moveTimer.getTime();
            //console.log(dur);
            _this.moveTimer = newMoveTimer;
            var x = e.clientX || e.originalEvent.targetTouches && e.originalEvent.targetTouches[0].pageX || 0;
            var y = e.clientY || e.originalEvent.targetTouches && e.originalEvent.targetTouches[0].pageY || 0;
            //Helpers.Log("x : " + x);
            //Helpers.Log("y : " + y);
            //if ship is selected , draw a directionLine
            if (_this.shipToMove) {
                var colRow = mainInterface.pixelToGrid(x + currentMap.scroll.x, y + currentMap.scroll.y);
                //Helpers.Log(colRow.row);
                if (_this.longtouch) {
                    mainObject.currentShip.MoveShipEndColRow = colRow;
                    //Helpers.Log("Set MoveShipEndColRow : " + mainObject.currentShip.MoveShipEndColRow.col.toString() + '/' + mainObject.currentShip.MoveShipEndColRow.row.toString());
                }
                mainInterface.drawAll(); //toDO: just use draw line?  -> then we would have to clear the line drawing, while dragging the mouse around...
                transferPanel.CloseTransfer();
                return cancelEvent(e);
            }
            //no ship selected, move the map
            if (!mainInterface.isScrollXEnabled && !mainInterface.isScrollYEnabled)
                return;
            //change the scroll coordinates and draw again
            var movedX = x - _this.MouseDragBeginX;
            var movedY = y - _this.MouseDragBeginY;
            /*
            Helpers.Log("movedX : " + movedX);
            Helpers.Log("movedY : " + movedY);
            //Todo: remove?
            movedX = Math.floor(movedX);
            movedY = Math.floor(movedY);
            
            Helpers.Log("movedX : " + movedX);
            Helpers.Log("movedY : " + movedY);
            */
            var CanvasToolttipChangeX = currentMap.scroll.x;
            var CanvasToolttipChangeY = currentMap.scroll.y;
            if (mainInterface.isScrollXEnabled) {
                //Helpers.Log("currentMap.scroll.x : " + currentMap.scroll.x);
                currentMap.scroll.x -= movedX;
                //CanvasToolttipChangeX = movedX;
                //Helpers.Log("currentMap.scroll.x : " + currentMap.scroll.x);
            }
            if (mainInterface.isScrollYEnabled) {
                currentMap.scroll.y -= movedY;
                //CanvasToolttipChangeY = movedY;
            }
            mainInterface.checkSrollOutOfBounds(); //check if user scrolls out of visible area
            _this.MouseDragBeginX = x;
            _this.MouseDragBeginY = y;
            if (currentMap.scroll.x != CanvasToolttipChangeX || currentMap.scroll.y != CanvasToolttipChangeY) {
                var ChangeX = currentMap.scroll.x - CanvasToolttipChangeX;
                var ChangeY = currentMap.scroll.y - CanvasToolttipChangeY;
                var oldPosition = $("#CanvasTooltip").position();
                var newPosition = { left: oldPosition.left - ChangeX, top: oldPosition.top - ChangeY };
                $("#CanvasTooltip").css('left', newPosition.left);
                $("#CanvasTooltip").css('top', newPosition.top);
                //$("#CanvasTooltip").position(newPosition);
            }
            //Helpers.Log("this.MouseDragBeginX : " + this.MouseDragBeginX);
            //Helpers.Log("this.MouseDragBeginY : " + this.MouseDragBeginY);
            mainInterface.drawAll();
            return cancelEvent(e);
        };
        this.dragMouseEnd = function (e) {
            DrawInterface.ScreenUpdate = true;
            Chat.toggleUsedOff();
            var startColRow = null;
            var endColRow = null;
            if (mainObject.currentShip) {
                startColRow = mainObject.currentShip.MoveShipStartColRow;
                endColRow = mainObject.currentShip.MoveShipEndColRow;
            }
            //Helpers.Log('dragMouseEnd end : ');
            e.stopPropagation();
            if (_this.shipToMove && _this.longtouch) {
                if (startColRow != null && endColRow != null) {
                    if (startColRow.col != endColRow.col || startColRow.row != endColRow.row) {
                        //mainObject.currentShip.MoveShipStartColRow = null; // so that the line isn't drawn again
                        mainObject.currentShip.dragShip(endColRow, null);
                    }
                }
                //mainObject.currentShip.MoveShipStartColRow = null;
                _this.shipToMove = false;
                //mainObject.currentShip.MoveShipEndColRow = null;
                //if ship entered a system map, currentMap will have changed -> update its parent
                /*
                if (currentMap.correspondingArea instanceof StarData) {
                    currentMap.correspondingArea.parentArea.tilemap.moveShipEndColRow = null;
                }
                */
            }
            //clear the timeout that will lead to the determination of single click or pressed mouseButton     
            //Helpers.Log('timeout end : ' + this.timeout);
            //Helpers.Log('longtouch  : ' + this.longtouch);
            clearTimeout(_this.timeout);
            if (!_this.longtouch) {
                _this.singleClick(e);
            }
            _this.longtouch = false;
            if (!_this.dragging)
                return;
            $("#canvas1").unbind("mousemove touchmove");
            $("#canvas1").unbind("mouseup touchend");
            $("#tools").unbind("mousemove touchmove");
            $("#quickInfo-container").unbind("mousemove touchmove");
            $("#CanvasTooltipContainer").unbind("mousemove touchmove");
            $("#tools").unbind("mouseup touchend");
            $("#quickInfo-container").unbind("mouseup touchend");
            //$("#ui").mousemove(function (e) { });
            //$("#canvas1").unbind("touchmove");
            _this.dragging = false;
        };
        this.singleClick = function (e) {
            //Helpers.Log('singleClick');
            _this.shipToMove = false;
            _this.dragging = false;
            DrawInterface.ScreenUpdate = true;
            //$("#canvas1").unbind("mousemove", this.dragMouse);
            $("#canvas1").unbind("mousemove touchmove");
            $("#canvas1").unbind("mouseup touchend");
            $("#tools").unbind("mouseup touchend");
            $("#quickInfo-container").unbind("mouseup touchend");
            $("#tools").unbind("mousemove touchmove");
            $("#quickInfo-container").unbind("mousemove touchmove");
            $("#CanvasTooltipContainer").unbind("mousemove touchmove");
            //$("#canvas1").unbind("touchmove");
            var x = $(".canvasContainer").position().left;
            //choose the mouseUp versus touchend and "touchSingleClickEnd"
            var clientX = e.clientX || e.originalEvent.targetTouches[0] && e.originalEvent.targetTouches[0].pageX || e.originalEvent.changedTouches[0] && e.originalEvent.changedTouches[0].pageX;
            var clientY = e.clientY || e.originalEvent.targetTouches[0] && e.originalEvent.targetTouches[0].pageY || e.originalEvent.changedTouches[0] && e.originalEvent.changedTouches[0].pageY;
            var colRow = mainInterface.pixelToGrid(clientX + currentMap.scroll.x - x, clientY + currentMap.scroll.y);
            if (!currentMap.tileExist(colRow)) // click on an empty tile
             {
                //check if click was outside of the map
                /* //deactivated due to user feedback
                Helpers.Log('currentMap -- x: ' + currentMap.gridsize.cols + ' y: ' + currentMap.gridsize.rows);
                Helpers.Log('click -- x: ' + colRow.col + ' y: ' + colRow.row);
                if (colRow.col < 0 || colRow.row < 0 || colRow.col >= currentMap.gridsize.cols || colRow.row >= currentMap.gridsize.rows) {
                    Helpers.Log('UP');
                    DrawInterface.deselectObject();
                    currentMap.correspondingArea.parentArea.switchInterfaceToThisMap();
                    PanelController.showInfoPanel(PanelController.PanelChoice.Canvas);
                }
                */
                if (currentMap instanceof TilemapModule.PlanetMap || currentMap instanceof TilemapModule.ColonyMap)
                    return;
                // remove mainObject.currentShip, currentStar, and so on
                mainObject.deselectObject();
                mainInterface.drawAll();
                return;
            }
            //tile is present, so select ship or colony or building
            currentMap.tileClick(colRow);
            mainInterface.drawAll();
            return;
        };
    } //end of constructor
    CanvasMouseListener.prototype.init = function () {
        $("#canvas1").bind("mousedown touchstart", this.dragMouseBegin);
        $("#quickInfo-container").bind("mousedown touchstart", this.dragMouseBegin);
        $("#bodyOfAll").bind("mousemove", this.moveMouse);
        $("#ui").mousemove(function (e) {
            currentMap.MouseOverField = { col: 0, row: 0 };
            $("#CanvasTooltip").css("display", "none");
            //e.stopPropagation();
        });
    };
    return CanvasMouseListener;
}());
;
function canvasMouseScrollListener(element) {
    var zoomIn = function () {
        switch (currentMap.zoomLevels.level) {
            case currentMap.zoomLevels.NORMAL:
                currentMap.zoomLevels.level = currentMap.zoomLevels.CLOSE;
                scrollZoomIn();
                zoomNow();
                break;
            case currentMap.zoomLevels.FAR:
                currentMap.zoomLevels.level = currentMap.zoomLevels.NORMAL;
                scrollZoomIn();
                zoomNow();
                break;
            //case currentMap.zoomLevels.CLOSE:
            //    return;
            case currentMap.zoomLevels.CLOSE:
                currentMap.zoomLevels.level = currentMap.zoomLevels.CLOSER;
                scrollZoomIn();
                zoomNow();
                break;
            case currentMap.zoomLevels.CLOSER:
                return;
        }
    };
    var zoomOut = function () {
        switch (currentMap.zoomLevels.level) {
            case currentMap.zoomLevels.NORMAL:
                currentMap.zoomLevels.level = currentMap.zoomLevels.FAR;
                scrollZoomOut();
                zoomNow();
                break;
            case currentMap.zoomLevels.CLOSE:
                currentMap.zoomLevels.level = currentMap.zoomLevels.NORMAL;
                scrollZoomOut();
                zoomNow();
                mainInterface.checkSrollOutOfBounds();
                break;
            case currentMap.zoomLevels.CLOSER:
                currentMap.zoomLevels.level = currentMap.zoomLevels.CLOSE;
                scrollZoomOut();
                zoomNow();
                mainInterface.checkSrollOutOfBounds();
                break;
            case currentMap.zoomLevels.FAR:
                return;
        }
    };
    var scrollZoomOut = function () {
        currentMap.scroll.x = (currentMap.scroll.x / 2) - getSize().width / 4;
        currentMap.scroll.y = (currentMap.scroll.y / 2) - getSize().height / 4;
    };
    var scrollZoomIn = function () {
        currentMap.scroll.x = (currentMap.scroll.x * 2) + getSize().width / 2;
        currentMap.scroll.y = (currentMap.scroll.y * 2) + getSize().height / 2;
    };
    var zoomNow = function () {
        currentMap.tileSize = mainInterface.standardTileSize * currentMap.zoomLevels.level;
        //mainInterface.checkMapSizeScroll(); 
        mainInterface.checkScrollEnabling();
        mainInterface.checkSrollOutOfBounds(); //check if user scrolls out of visible area
        mainInterface.drawAll();
    };
    function handleScroll(event, delta) {
        if (delta > 0) {
            zoomIn();
        }
        else {
            zoomOut();
        }
        return false;
    }
    this.extZoomIn = function () {
        zoomIn();
    };
    this.extZoomOut = function () {
        zoomOut();
    };
    $(document.getElementById(element)).bind("mousewheel", handleScroll);
}
var UserInputMethods = /** @class */ (function () {
    function UserInputMethods() {
    }
    //messageShowed = 50; //shows message 0 to 50 (orderer by descending ids)
    UserInputMethods.prototype.logOut = function () {
        var xmlhttp;
        xmlhttp = GetXmlHttpObject();
        if (xmlhttp == null) {
            alert("Your browser does not support AJAX!");
            return;
        }
        var lastObjectId = 0;
        if (mainObject.currentShip)
            lastObjectId = mainObject.currentShip.id;
        if (mainObject.currentColony)
            lastObjectId = mainObject.currentColony.id;
        if (isDemo) {
            var confirmDiplomacyPanel = ElementGenerator.createPopup();
            ElementGenerator.adjustPopupZIndex(confirmDiplomacyPanel, 12000);
            //confirmDiplomacyPanel.adjustPopupZIndex(12000);
            ElementGenerator.makeSmall(confirmDiplomacyPanel);
            var panelBody = $('.relPanelBody', confirmDiplomacyPanel);
            var caption = $('<span/>', { text: i18n.label(333) });
            panelBody.append(caption);
            $('.yesButton span', confirmDiplomacyPanel).text(i18n.label(291));
            $('.noButton span', confirmDiplomacyPanel).text(i18n.label(292));
            $('.yesButton', confirmDiplomacyPanel).click(function (e) { location.href = "Server/User.aspx?action=demoLogout&lastObjectType=1&lastObjectId=" + lastObjectId.toString(); });
            $('.noButton', confirmDiplomacyPanel).click(function (e) { location.href = "Server/User.aspx?action=logout&lastObjectType=1&lastObjectId=" + lastObjectId.toString(); });
            confirmDiplomacyPanel.appendTo("body"); //attach to the <body> element
        }
        else {
            var LogoutForm = ElementGenerator.createAppendNoYesPopup(function (e) { location.href = "Server/User.aspx?action=logout&lastObjectType=1&lastObjectId=" + lastObjectId.toString(); LogoutForm.remove(); }, function (e) { Helpers.Log('ccc', Helpers.LogType.Messages); LogoutForm.remove(); }, i18n.label(997), i18n.label(996));
            //window.location.href =  "../index.aspx";
        }
    };
    UserInputMethods.prototype.popUpClose = function (e) {
        if (e !== null) {
            e.preventDefault();
        }
        $("#popup")[0].style.display = 'none';
        $("#popupNo")[0].style.display = 'block';
        $("#popupOK").text('Ja');
        $("#popupNo").unbind("click");
        $("#popupOK").unbind("click");
    };
    return UserInputMethods;
}());
//var userInputMethods = new UserInputMethods();
/*
PanelController has states about the overlay-panels and opens/closes them. Popups are not included here - they should themselves prevent any action...
States:
    - Shipdetail
    - ColonyDetail
    - no Details, only Canvas
    - alls the above with activated menu or deactivated menu

Actions:
    - click on canvas (evaluated
        -> activate deactivate ship or open colony screen
    - click on menu tabs or items inside the menu
        -> change menu or close/open menu

*/
var PanelController;
(function (PanelController) {
    var MenuChoice;
    (function (MenuChoice) {
        MenuChoice[MenuChoice["MainMenu"] = 0] = "MainMenu";
        MenuChoice[MenuChoice["BuildingsMenu"] = 1] = "BuildingsMenu";
    })(MenuChoice || (MenuChoice = {}));
    var PanelChoice;
    (function (PanelChoice) {
        PanelChoice[PanelChoice["Ship"] = 0] = "Ship";
        PanelChoice[PanelChoice["Colony"] = 1] = "Colony";
        PanelChoice[PanelChoice["Canvas"] = 2] = "Canvas";
    })(PanelChoice = PanelController.PanelChoice || (PanelController.PanelChoice = {}));
    /*
    export enum QuickInfoChoice {
        Goods,
        Modules
    }
    */
    var menuIsOpen = false;
    var lastMenu = MenuChoice.MainMenu;
    PanelController.panelsToShow = PanelChoice.Canvas;
    /*
    export var quickInfoPanel: QuickInfoChoice = QuickInfoChoice.Goods;
    */
    function hideMenus() {
        //$("#panel-container").addClass("hidden");
        $("#quickInfo-container").removeClass("menuOpen");
        resetMenus();
        menuIsOpen = false;
    }
    PanelController.hideMenus = hideMenus;
    function resetMenus() {
        //document.getElementById('panel-ul-menu').setAttribute('class', 'hidden');
        $("#panel-ul-buildings").addClass('hidden');
        //document.getElementById('panel-ul-buildings').setAttribute('class', 'hidden');               
        $(".canvasContainer").css("right", 0);
        mainInterface.doResize();
    }
    function MouseClick(e) {
        var eTarget = $(e.target);
        var id = eTarget.attr('id');
        switch (id) {
            /*
            case 'panel-menu-toggle':
                e.stopPropagation();
                toggleMenu(MenuChoice.MainMenu);
                break;
            case 'panel-buildings-toggle':
                e.stopPropagation();
                toggleMenu(MenuChoice.BuildingsMenu);
                break;*/
            /*
                        case 'quickInfo-goods-toggle':
                            e.stopPropagation();
                            mainInterface.refreshQuickInfoGoods();
                            break;
                        case 'quickInfo-modules-toggle':
                            e.stopPropagation();
                            mainInterface.refreshQuickInfoModules();
                            break;
            */
            default:
                // He didn't click on any option and actually click on an empty section of the UI, fallback to the canvas.
                //e.srcElement = document.getElementById('canvas1');
                //e.target = document.getElementById('canvas1');
                //e.toElement = document.getElementById('canvas1');
                //canvasMouseEvents.handleMouseDown(e);
                break;
        }
        //return cancelEvent(e);
    }
    PanelController.MouseClick = MouseClick;
    function setColonyPanels() {
        hideMenus();
        //$("#panel-container").removeClass("hidden");
        //resetMenus();
        mainObject.buildingDeSelect();
        BaseDataModule.buildingList();
        //check Transfer Goods Button
        //var activateTrade = false;
        //check Trade Goods Button
        //$("#goodsToggle").css("display", "block");
        //document.getElementById('toolTrade').style.display = 'block';
        document.getElementById('toolTrade').style.display = mainObject.currentColony.canTrade() ? 'block' : 'none';
        $("#demolish").css("display", "block");
        TransferModule.enableTransferButton(mainObject.currentColony);
        document.getElementById('rotate').style.display = 'none';
        document.getElementById('createSpaceStation').style.display = 'none'; //create space station   
        document.getElementById('addTranscendence').style.display = 'none'; //add to Transcendence constuct
        document.getElementById('attackTarget').style.display = 'none';
        document.getElementById('design').style.display = 'none';
        $("#upperUI").addClass("openDetails");
        $("#ColonyInfo").addClass("openDetails");
        $(".canvasContainer").css("left", 0); //300 was used to reduce scroll area... obsolet: all calls to $(".canvasContainer").css("left" should be removed
        //$(".canvasContainer").css("right", 300);
        $("#quickInfo-container").removeClass("hidden");
        $("#tools").addClass("openDetails");
        mainInterface.doResize();
    }
    function setShipPanels() {
        //$("#goodsToggle").css("display", "block");
        $(".canvasContainer").css("left", 0);
        $("#upperUI").removeClass("openDetails");
        $("#quickInfo-container").removeClass("hidden");
        $("#tools").addClass("openDetails");
        mainInterface.doResize();
    }
    function setCanvasPanels() {
        //$("#goodsToggle").css("display", "none");
        $("#upperUI").removeClass("openDetails");
        $("#ColonyInfo").removeClass("openDetails");
        $(".canvasContainer").css("left", 0);
        $("#quickInfo-container").addClass("hidden");
        $("#tools").removeClass("openDetails");
        mainInterface.doResize();
    }
    function showInfoPanel(_panelsToShow) {
        PanelController.panelsToShow = _panelsToShow;
        //this.refreshInfoList();
        mainInterface.refreshMiddleInfoPanel();
        switch (PanelController.panelsToShow) {
            case PanelController.PanelChoice.Colony:
                setColonyPanels();
                break;
            case PanelController.PanelChoice.Ship:
                setShipPanels();
                break;
            case PanelController.PanelChoice.Canvas:
                setCanvasPanels();
                break;
            default:
                break;
        }
        mainInterface.refreshQuickInfoGoods();
        /*
        switch (this.quickInfoPanel) {
            case 0:
            case 1:
                mainInterface.refreshQuickInfoGoods();
                break;
            case 2:
                mainInterface.refreshQuickInfoModules();
                break;
            default:
                mainInterface.refreshQuickInfoGoods();
                break;
        }
        */
    }
    PanelController.showInfoPanel = showInfoPanel;
})(PanelController || (PanelController = {}));
//# sourceMappingURL=userInput.js.map