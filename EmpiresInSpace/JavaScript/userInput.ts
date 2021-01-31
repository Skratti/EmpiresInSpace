
//several objects that bind events to html-elements

//canvasKeyListener  -- keys
//canvasMouseListener -- click and drag
//canvasMouseScrollListener -- zooming
 
//ToDO: warum werden die events im Konstruktir registriert?
//ToDO: könnte vermutlich komplett überarbeitet werden...
class CanvasMouseListener {

    moveTimer = new Date();
    dragging = false;
    shipToMove = false;
    //var listening = false;
    //var disposed = false;

    MouseDragBeginX = 0;
    MouseDragBeginY = 0;

    longtouch; //boolean to determine if mouse is pressed or just clicked
    timeout : number;    //needed for longtouch (> 300ms -> longtouch = true), and to clear the specific timeout

    TooltipTimerId = 0;

    
    public moveMouse: (e: JQueryEventObject) => void;
    public dragMouseBegin: (e: JQueryEventObject) => void;
    public dragMouse: (e: JQueryEventObject) => void;
    public dragMouseEnd: (e: JQueryEventObject) => void;
    public singleClick: (e: JQueryEventObject) => void;
    public dragOverForeground: (e: JQueryEventObject) => void;
    public mouseUpOverForeground: (e: JQueryEventObject) => void;
      
    constructor() {

        this.moveMouse = (e: JQueryEventObject) => {
            if (!currentMap) return;
            var x = $(".canvasContainer").position().left;

            //choose the mouseUp versus touchend and "touchSingleClickEnd"
            var clientX = e.clientX ||
                (<any>e).originalEvent.targetTouches && (<any>e).originalEvent.targetTouches[0] && (<any>e).originalEvent.targetTouches[0].pageX ||
                (<any>e).originalEvent.changedTouches && (<any>e).originalEvent.changedTouches[0] && (<any>e).originalEvent.changedTouches[0].pageX ||
                0;
            var clientY = e.clientY ||
                (<any>e).originalEvent.targetTouches && (<any>e).originalEvent.targetTouches[0] && (<any>e).originalEvent.targetTouches[0].pageY ||
                (<any>e).originalEvent.changedTouches && (<any>e).originalEvent.changedTouches[0] && (<any>e).originalEvent.changedTouches[0].pageY ||
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
                clearTimeout(this.TooltipTimerId);
                if (DrawInterface.TooltipShown) {
                    DrawInterface.ScreenUpdate = true;
                    DrawInterface.TooltipShown = false;                    
                }
            }


            this.TooltipTimerId = setTimeout(function () {
                var tileToDraw: Tile = currentMap.map[colRow.col] && currentMap.map[colRow.col][colRow.row] || null;
                var currentTime = (new Date()).getTime();
                DrawInterface.drawCanvasTooltip(colRow.col, colRow.row, currentTime, tileToDraw);
            },  900);
        }


        this.dragMouseBegin = (e: JQueryEventObject) => {
            e.stopPropagation();
            //Helpers.Log('dragMouseBegin');
            //Helpers.Log($(".canvasContainer").position().left);
            //Helpers.Log($(".canvasContainer").offset().left);

            //check if user clicks on one of his ships to move it or activate it:
            var clientX = e.clientX || (<any>e).originalEvent.targetTouches && (<any>e).originalEvent.targetTouches[0].pageX || 0;
            var clientY = e.clientY || (<any>e).originalEvent.targetTouches && (<any>e).originalEvent.targetTouches[0].pageY || 0;

            var colRow = mainInterface.pixelToGrid(clientX + currentMap.scroll.x , clientY + currentMap.scroll.y);
            if (currentMap.tileExist(colRow)) {
                var tile = currentMap.map[mainObject.parseInt(colRow.col)][mainObject.parseInt(colRow.row)];
                //check if the currentShip is part of the ships in this field. If yes, set selectedShip to currentShip, else chose the first own ship on this tile as the selected
                var selectedShip : Ships.Ship = null;
                if (mainObject.currentShip !== null && mainObject.currentShip.getCurrentTile() === tile)
                    selectedShip = mainObject.currentShip;
                else
                    selectedShip = tile.getFirstOwnShip();
                if (selectedShip != null) {
                    mainObject.selectShip(selectedShip);
                    this.shipToMove = true;
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
            this.timeout = setTimeout(() => { this.longtouch = true; }, 150);
            //Helpers.Log('timeout start : ' + this.timeout);
            $("#canvas1").bind("mouseup touchend", this.dragMouseEnd);
            $("#tools").bind("mouseup touchend", this.mouseUpOverForeground);
            $("#quickInfo-container").bind("mouseup touchend", this.mouseUpOverForeground);
            $("#TransferPanel").bind("mouseup touchend", (e) => { e.stopPropagation() ; });

            

            //if (dragging || (!mainInterface.isScrollXEnabled && !mainInterface.isScrollYEnabled))
            if (this.dragging)
                return;

            
            this.dragging = true;
            currentMap.MouseOverField.col = 0;
            currentMap.MouseOverField.row = 0;
            //clearTimeout(this.TooltipTimerId);

            this.MouseDragBeginX = e.clientX || (<any>e).originalEvent.targetTouches[0].pageX;
            this.MouseDragBeginY = e.clientY || (<any>e).originalEvent.targetTouches[0].pageY;
       
            $("#canvas1").bind("mousemove touchmove", this.dragMouse);
            $("#tools").bind("mousemove touchmove", this.dragMouse);
            $("#quickInfo-container").bind("mousemove touchmove", this.dragMouse);
            $("#CanvasTooltipContainer").bind("mousemove touchmove", this.dragMouse);

            //$("#ui").mousemove(function (e) {                e.stopPropagation();            });

            //$("#canvas1").bind("touchmove", this.dragMouse);
            DrawInterface.ScreenUpdate = true;
            return cancelEvent(e);
        }

        this.dragOverForeground = (e: JQueryEventObject) => {
            this.dragMouse(e);
        }

        this.mouseUpOverForeground = (e: JQueryEventObject) => {
            this.dragMouseEnd(e);
        }

        this.dragMouse = (e: JQueryEventObject) => {
            e.stopPropagation();
            e.preventDefault();          

            if (!this.dragging)
                return;
            DrawInterface.ScreenUpdate = true;
            //clearTimeout(this.TooltipTimerId);

            var newMoveTimer = new Date();
            var dur = newMoveTimer.getTime() - this.moveTimer.getTime();
            //console.log(dur);
            this.moveTimer = newMoveTimer;

            var x = e.clientX || (<any>e).originalEvent.targetTouches && (<any>e).originalEvent.targetTouches[0].pageX || 0;
            var y = e.clientY || (<any>e).originalEvent.targetTouches && (<any>e).originalEvent.targetTouches[0].pageY || 0;

            //Helpers.Log("x : " + x);
            //Helpers.Log("y : " + y);
            //if ship is selected , draw a directionLine
            if (this.shipToMove) {
                var colRow = mainInterface.pixelToGrid(x + currentMap.scroll.x, y + currentMap.scroll.y);
                //Helpers.Log(colRow.row);

                if (this.longtouch) {
                    mainObject.currentShip.MoveShipEndColRow = colRow;
                    //Helpers.Log("Set MoveShipEndColRow : " + mainObject.currentShip.MoveShipEndColRow.col.toString() + '/' + mainObject.currentShip.MoveShipEndColRow.row.toString());

                }

                mainInterface.drawAll(); //toDO: just use draw line?  -> then we would have to clear the line drawing, while dragging the mouse around...
                transferPanel.CloseTransfer();
                return cancelEvent(e);
            }

            //no ship selected, move the map
            if (!mainInterface.isScrollXEnabled && !mainInterface.isScrollYEnabled) return;
            //change the scroll coordinates and draw again
            var movedX = x - this.MouseDragBeginX;
            var movedY = y - this.MouseDragBeginY;
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
            mainInterface.checkSrollOutOfBounds();   //check if user scrolls out of visible area
            this.MouseDragBeginX = x;
            this.MouseDragBeginY = y;


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
        }


       
        this.dragMouseEnd = (e: JQueryEventObject) => {
            DrawInterface.ScreenUpdate = true;
            Chat.toggleUsedOff();

            var startColRow: ColRow = null;
            var endColRow: ColRow = null;

            if (mainObject.currentShip) {
                startColRow = mainObject.currentShip.MoveShipStartColRow;
                endColRow = mainObject.currentShip.MoveShipEndColRow;
            }

            //Helpers.Log('dragMouseEnd end : ');
            e.stopPropagation();
            if (this.shipToMove && this.longtouch) {
                if (startColRow != null && endColRow != null) {
                    if (startColRow.col != endColRow.col || startColRow.row != endColRow.row) {
                        //mainObject.currentShip.MoveShipStartColRow = null; // so that the line isn't drawn again
                        mainObject.currentShip.dragShip(endColRow, null);
                    }
                }
                //mainObject.currentShip.MoveShipStartColRow = null;
                this.shipToMove = false;
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
            clearTimeout(this.timeout);
            if (!this.longtouch) {                
                this.singleClick(e);
            }
            this.longtouch = false;

            if (!this.dragging)
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

            this.dragging = false;
        }


        this.singleClick = (e: JQueryEventObject) => {
            //Helpers.Log('singleClick');
            this.shipToMove = false;
            this.dragging = false;
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
            var clientX = e.clientX || (<any>e).originalEvent.targetTouches[0] && (<any>e).originalEvent.targetTouches[0].pageX || (<any>e).originalEvent.changedTouches[0] && (<any>e).originalEvent.changedTouches[0].pageX;
            var clientY = e.clientY || (<any>e).originalEvent.targetTouches[0] && (<any>e).originalEvent.targetTouches[0].pageY || (<any>e).originalEvent.changedTouches[0] && (<any>e).originalEvent.changedTouches[0].pageY;

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

                if (currentMap instanceof TilemapModule.PlanetMap || currentMap instanceof TilemapModule.ColonyMap) return;

                // remove mainObject.currentShip, currentStar, and so on
                mainObject.deselectObject();
                mainInterface.drawAll();

                return;
            }

            //tile is present, so select ship or colony or building
            currentMap.tileClick(colRow);
            mainInterface.drawAll();
            return;
        }

        
    }//end of constructor


    init() {

        $("#canvas1").bind("mousedown touchstart", this.dragMouseBegin);
        $("#quickInfo-container").bind("mousedown touchstart", this.dragMouseBegin);
        $("#bodyOfAll").bind("mousemove", this.moveMouse);

        $("#ui").mousemove(function (e) {            
            currentMap.MouseOverField = { col: 0, row: 0 };
            $("#CanvasTooltip").css("display", "none"); 
            //e.stopPropagation();
        });
    }


    //listening = true;
    
};


    


function canvasMouseScrollListener(element)
{
    var zoomIn = function ()
    {
        
        switch (currentMap.zoomLevels.level)
        {
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
    }

    var zoomOut = function ()
    {
        switch (currentMap.zoomLevels.level)
        {
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
    }

    var scrollZoomOut = function ()
    {
        currentMap.scroll.x = (currentMap.scroll.x / 2) - getSize().width / 4;
        currentMap.scroll.y = (currentMap.scroll.y / 2) - getSize().height / 4;
    }

    var scrollZoomIn = function ()
    {
        currentMap.scroll.x = (currentMap.scroll.x * 2) + getSize().width / 2;
        currentMap.scroll.y = (currentMap.scroll.y * 2) + getSize().height / 2;
    }

    var zoomNow = function ()
    {
        currentMap.tileSize = mainInterface.standardTileSize * currentMap.zoomLevels.level;
        //mainInterface.checkMapSizeScroll(); 
        
        mainInterface.checkScrollEnabling();
        mainInterface.checkSrollOutOfBounds();   //check if user scrolls out of visible area
        mainInterface.drawAll();
    }

    function handleScroll(event, delta): boolean
    {        
        if (delta > 0) {
            zoomIn();
        } else {
            zoomOut();
        }
        
        return false;        
    }

    this.extZoomIn = function ()
    {
        zoomIn();
    }
    this.extZoomOut = function ()
    {
        zoomOut();
    }
        
    $(document.getElementById(element)).bind("mousewheel", <any>handleScroll);
    
}



class UserInputMethods {
    
    //messageShowed = 50; //shows message 0 to 50 (orderer by descending ids)



    logOut()
    {

        var xmlhttp;

        xmlhttp = GetXmlHttpObject();
        if (xmlhttp == null)
        {
            alert("Your browser does not support AJAX!");
            return;
        }

        var lastObjectId = 0;

        if (mainObject.currentShip) lastObjectId = mainObject.currentShip.id;
        if (mainObject.currentColony) lastObjectId = mainObject.currentColony.id;

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

            var LogoutForm = ElementGenerator.createAppendNoYesPopup(
                (e) => { location.href = "Server/User.aspx?action=logout&lastObjectType=1&lastObjectId=" + lastObjectId.toString(); LogoutForm.remove(); },
                (e) => { Helpers.Log('ccc', Helpers.LogType.Messages); LogoutForm.remove();},
                i18n.label(997),
                i18n.label(996));
            //window.location.href =  "../index.aspx";
        }
    }       

    popUpClose(e: MouseEvent) {   
        if (e !== null) {
            e.preventDefault();
        }

        $("#popup")[0].style.display = 'none';
        $("#popupNo")[0].style.display = 'block';
        $("#popupOK").text('Ja');
        $("#popupNo").unbind("click");
        $("#popupOK").unbind("click");
    }
}

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
module PanelController {
 
    enum MenuChoice {
        MainMenu,
        BuildingsMenu        
    }

    export enum PanelChoice {
        Ship,
        Colony,
        Canvas
    }
    /*
    export enum QuickInfoChoice {
        Goods,
        Modules
    }
    */
    var menuIsOpen: boolean = false;
    var lastMenu: MenuChoice = MenuChoice.MainMenu;
    export var panelsToShow: PanelChoice = PanelChoice.Canvas;

    /*
    export var quickInfoPanel: QuickInfoChoice = QuickInfoChoice.Goods;
    */

    export function hideMenus()
    {        
        //$("#panel-container").addClass("hidden");
        $("#quickInfo-container").removeClass("menuOpen");
        resetMenus();
        menuIsOpen = false;
    }

    function resetMenus() {
        //document.getElementById('panel-ul-menu').setAttribute('class', 'hidden');
        $("#panel-ul-buildings").addClass('hidden');
        //document.getElementById('panel-ul-buildings').setAttribute('class', 'hidden');               
        $(".canvasContainer").css("right", 0);
        mainInterface.doResize();
    }
    

    
    export function MouseClick(e: JQueryEventObject) {
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
        document.getElementById('createSpaceStation').style.display = 'none';   //create space station   
        document.getElementById('addTranscendence').style.display = 'none';   //add to Transcendence constuct
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
    
    export function showInfoPanel(_panelsToShow: PanelController.PanelChoice) {
        panelsToShow = _panelsToShow;
        //this.refreshInfoList();
        mainInterface.refreshMiddleInfoPanel();

        switch (panelsToShow) {
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

}