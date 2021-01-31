
//The Paths are provided hard coded in Galaxy.aspx.cs
declare var ScriptPath: string;
declare var BuildingPath: string;
declare var QuestPath: string;


declare var version: string;
declare var imageVersion: string;
declare var SocketKey: string;


interface MSEventObj {
    //getElementsByTagName(...args: any[]): void;
    stopPropagation(): void;
    currentTarget: Node;
}

//ToDo: replace with JQuery.setAttibute
interface Node {
    setAttribute(value1: any, value2: any): void;
}


interface SignalR {
    spaceHub: HubProxy
}

interface SpaceClient {
    broadcastMessage(id: number, message: string);
    ServerRestart();
    newgalacticevent(event: any);
    chatremoveuser(userId: number);
    chatadduser(userId: number);
    refreshship(shipId: number, serverversion: number);
    receiveship(ship: any);
    receivecommmessage(message: any);
    ReceiveMessage(message: any);
    ReceiveCombat(message: any);
    NewTradeOffer(trade: any);
    DeleteTrade(tradeId: number);
}

interface SpaceServer {
    send(message: string);
    FetchActiveUsers(): any;
    FetchUserResearch(userId: number): any;
    FetchShip(shipId: number): any;
    CreateTrade(shipId: number, Offered: any, Requested: any): any;
    DeleteMyTrade(tradeId: number);
    FetchRoutes(): any;
}

interface HubProxy {
    client: SpaceClient;
    server: SpaceServer;
    invoke(methodName: string, ...args: any[]): JQueryDeferred<any>;
}

interface JQuery {
    sortElements(x: any, y: any): () => any;

}

interface JQueryStatic {

    text(x: any): () => any;
}

interface BorderField {
    x: string;
    y: string;
    O: string;
}


$.ajaxSetup({
    // Disable caching of AJAX responses
    cache: false
});

var isDemo: boolean;
Scripts.initScriptAdmin();
var mainInterface = DrawInterface; //used to draw the maps and refresh the panels#
var secondInterface = DrawCanvas; //used to draw the maps and refresh the panels#

var transferPanel: TransferModule.TransferPanel;
var mainObject: MainObject;      //contains all game data
//var goodsTransfer: GoodsTransfer;

var galaxyMap: GalaxyData;      //defines grid data for the starmap

//var scanMap: Tilemap;        //defines scan data for the starmap ToDo -> create a class of its own
var scanMap: TilemapModule.Scanmap;        //defines scan data for the starmap ToDo -> create a class of its own
var currentMap: TilemapModule.Tilemap;     //reference to the Map that is currently drawn (and thus scrolled, clicked and so on)


var canvasMouseEvents: CanvasMouseListener;
var MouseScrollEvent;
var userInputMethods: UserInputMethods; //= new UserInputMethods();

var onLoadWorker: OnLoadWorker;

var texture1 = new Image();
texture1.src = "images/SurfaceTest.png";




var showing3D = false; 

function switchRenderer() {
    if (showing3D) {
        $(".canvasContainer").css("display", "block");
        showing3D = false;
    }
    else {
        $(".canvasContainer").css("display", "none");
        showing3D = true;
    }   
}

function onLoadDoThis() {

    onLoadWorker = new OnLoadWorker(); //helper, that does some finishing tasks after asynchronously loading several xml

    //create StarMap-QuadTree
    var StarMapModuleField = new StarMapModule.Coordinate(0, 0);
    var StarMapModuleBox = new StarMapModule.Box(StarMapModuleField, 400);
    StarMapModule.starMap = new StarMapModule.StarMap(StarMapModuleBox);



    //onLoadWorker.registerWebSocket();

    galaxyMap = new GalaxyData(-1);
    mainObject = new MainObject();
    mainObject.getGameData();   //async load of static game data. could perhaps be stored locally
    mainObject.user.getUserData();


    userInputMethods = new UserInputMethods(); //helper class for user input 
    transferPanel = new TransferModule.TransferPanel(); //helper class for goods transfer 
    //goodsTransfer = new GoodsTransfer();

    mainInterface.setCanvas(<HTMLCanvasElement>document.getElementById("canvas1"));
    mainInterface.initInterface();

    //secondInterface.setCanvas(<HTMLCanvasElement>document.getElementById("canvas1"));
    //secondInterface.initInterface();


    window.addEventListener('contextmenu', mainInterface.showContextMenu, false);


    canvasMouseEvents = new CanvasMouseListener(); //class canvasMouseListener handles click on and dragging of the canvas element (right click hold)
    canvasMouseEvents.init();


    MouseScrollEvent = new canvasMouseScrollListener("canvas1"); //class canvasMouseScrollListener // Detect mousewheel scrolling

    mainObject.initStandardKeymap();

    $(document).tooltip();


    //$("#goodsToggle").bind("mousedown", PanelController.MouseClick);

    //lower left menu
    $("#toolTransfer").click(function () { /*goodsTransfer.objToTransferTo = null; goodsTransfer.objThatTransfers = null; goodsTransfer.createGoodsTransferPanel();*/ transferPanel.OpenTransfer() });
    // $("#toolTrade").click(function () { Scripts.scriptsAdmin.loadAndRun(3, 2, './TradeOfferForm.js', true); });

    $("#toolTrade").click(function () { TradeOffersModule.OpenTradeForm(); });

    $("#zoomIn").click(MouseScrollEvent.extZoomIn);
    $("#zoomOut").click(MouseScrollEvent.extZoomOut);

    $("#rotate").click(function () { mainObject.currentShip.colonize(); });


    $("#harvestNebula").click(function () { mainObject.currentShip.StartHarvesting(); });
    $("#createSpaceStation").click(function () { mainObject.currentShip.createSpaceStation(); });
    $("#addTranscendence").click(function () { mainObject.currentShip.addTranscendence(); });
    $("#attackTarget").click(function () { mainObject.currentShip.MarkAsTarget(); });
    $("#design").click(function (e) { mainObject.currentShip.showDetails(); e.stopPropagation(); });

    $("#sentry").click(function () { Ships.ShipInactive(); });
    $("#continue").click(Ships.NextShip);


    $("#demolish").click(function () {
        mainObject.buildingDeSelect();
        mainObject.buildingActivityMode = !mainObject.buildingActivityMode;
        mainObject.buildingActivityMode ? $("#demolish button").addClass("buttonActive") : $("#demolish button").removeClass("buttonActive");
        DrawInterface.drawAll();
    });




    //upper left Menu
    $("#shipList").click(function () { Ships.UserInterface.showShipList(); });
    $("#colonyList").click(ColonyModule.showColonyList);
    $("#messageList").click(MessageModule.userInterface.showMessageList2);
    $("#contactsList").click(() => { DiplomacyModule.entryPoint2(null, null); });
    $("#allianceList").click(function () { Scripts.scriptsAdmin.loadAndRun(3, 3, './Alliances.js', true, () => { (<any>AllianceModule).entryPoint2(0, null); }); });
    $("#communicationList").click(() => { CommModule.showCommunications(null) });
    $("#tradeList").click(function () { TradeOffersModule.OpenTradeForm(); });
    $("#questList").click(QuestModule.showQuests);
    //$("#researchList").click(function () { Scripts.scriptsAdmin.loadAndRun(2, 1, 'Research.js'); });
    $("#researchList").click(function () { Scripts.scriptsAdmin.loadAndRun(5, 1, "ResearchTree.js"); });
    $("#galaxy").click(() => { GalacticEventsModule.showEvents(); });



    //uper right
    $("#settingsList").click(PlayerData.showSettings);
    $("#quitList").click(userInputMethods.logOut);

    $("#turnByUser").click((e: JQueryEventObject) => { PlayerData.newTurn(); });
    if (!isDemo) $("#turnByUser").css("display", "none");
    $('#turnByUser').button();

    $("#alertMessage").click(function () { $("#alertMessage").css("display", "none"); MessageModule.userInterface.showMessageList2(); });
    $("#alertCommNode").click(function () { $("#alertCommNode").css("display", "none"); CommModule.showCommunications(null); });
    $("#fullscreen").click(function () { Helpers.toggleFullScreen(); });

    $("#TransferPanel").bind("mouseup touchend", (e) => { e.stopPropagation(); });
    $("#TransferPanel").bind("mousedown touchstart", (e) => { e.stopPropagation(); });
    $("#TransferButton1").click(function (e) { e.stopPropagation(); transferPanel.SetTransferAmount(TransferModule.TransferAmount.One) });
    $("#TransferButton10").click(function (e) { e.stopPropagation(); transferPanel.SetTransferAmount(TransferModule.TransferAmount.Ten) });
    $("#TransferButton100").click(function (e) { e.stopPropagation(); transferPanel.SetTransferAmount(TransferModule.TransferAmount.Hundred) });
    $("#TransferButtonI").click(function (e) { e.stopPropagation(); transferPanel.SetTransferAmount(TransferModule.TransferAmount.All) });
    $("#TransferButtonX").click(function (e) { e.stopPropagation(); transferPanel.ResetChanges() });



    Chat.initChat();

    //$("#chatRestore").button();

    //Escape: close the currently open Panel
    $(document).keydown((event) => {
        if (event.keyCode == 27) {
            Helpers.Log("Escape");
            if (ElementGenerator.currentPanel) ElementGenerator.currentPanel.remove();
        }
    });
}


class OnLoadWorker {

    gameDataLoaded = false;
    userDataLoaded = false;
    galaxyMapLoaded = false;
    objectDataLoaded = false;
    webSocketConnected = false;
    finished = false; //all Data loaded
    Done = false;
    progress = 10;


    constructor() {
    }

    private ProcessInit(initialization) {

        //Helpers.Log(initialization);
        //Helpers.Log(initialization["BorderMap"]);
        //Helpers.Log(initialization["BorderMap"][1]["O"]);

        /*
        
        var BorderMap: BorderField[]= initialization["BorderMap"];
        for (var i = 0; i < BorderMap.length; i++) {
            var Field: BorderField = BorderMap[i];
            var x = parseInt( Field["x"]);
            var y = parseInt(Field["y"]);
            var OwnerId = Field["O"];

            if (OwnerId != null && parseInt(OwnerId) != 0) {
                Helpers.Log("OwnerId added to QuadTree");
                var ownerBox = StarMapModule.makeBox(x, y);
                StarMapModule.starMap.insertOwnership(ownerBox, parseInt(OwnerId));              
            }
        }

        var allFields = StarMapModule.starMap.queryAll();
        for (var i = 0; i < allFields.length; i++) {          
            if (allFields[i].OwnerId != 0) {
                allFields[i].OwnerImagesType = allFields[i].OwnerNeigboursGet().toOwnershipId(allFields[i].OwnerId);
                allFields[i].DiplomaticImagesType = allFields[i].DiplomaticNeigboursGet().toOwnershipId(allFields[i].DiplomaticId);
                allFields[i].EntityImagesType = allFields[i].EntityNeighbourGet().toOwnershipId(allFields[i].EntityId);
            }
        }
        
        */
    }



    private TryInitialize(onComplete: (initialization) => void, count: number = 0): void {
        Helpers.Log(SocketKey);
        $.connection.spaceHub.invoke("initializeClient", SocketKey).done((initialization) => {
            //Helpers.Log("initializeClient");
            if (!initialization) {
                if (count > 3) {
                    Helpers.Log("Could not negotiate with server, refreshing the page.");
                    window.location.reload();
                } else {
                    setTimeout(() => {
                        this.TryInitialize(onComplete, count + 1);
                    }, 100); //ServerAdapter.RETRY_DELAY.Milliseconds
                }
            } else {
                //Helpers.Log("onComplete");
                onComplete(initialization);
            }
        });
    }

    registerWebSocket() {

        SpaceHub.RegisterEvents();

        // Start the connection.
        $.connection.hub.start().done(function () {
            onLoadWorker.webSocketConnected = true;
            onLoadWorker.progress = onLoadWorker.progress + 10;
            $('#loadingProgressbar').attr('value', onLoadWorker.progress);
            onLoadWorker.endStartup();

        });
    }


    startUpFinished(): boolean {
        var finished: boolean = false;

        finished = this.gameDataLoaded &&
            this.userDataLoaded &&
            this.galaxyMapLoaded &&
            //this.webSocketConnected &&
            this.objectDataLoaded;

        //Helpers.Log("finished: " +  finished);

        return finished;
    }

    endStartup() {
        Helpers.Log("endStartup");

        if (this.startUpFinished() &&
            !this.finished) {

            this.finished = true;

            //this.TryInitialize(this.ProcessInit);
            StarMapModule.CreateBorders();

            //var ret = $.connection.spaceHub.invoke("getUserScannedFields");
            //ret.done(e=> { alert(e); });

            //Helpers.Log("endStartup finishing");

            var allFields = StarMapModule.starMap.queryAll();

            //update starMapQuadTree 
            for (var i = 0; i < allFields.length; i++) {
                if (allFields[i].imageId) {
                    allFields[i].image = mainObject.imageObjects[allFields[i].imageId];
                }
            }
            //update ships to set their objectType-Reference
            for (var i = 0; i < mainObject.ships.length; i++) {
                //if (mainObject.ships[i] != null) mainObject.ships[i].getObjectTypeReference();
                if (mainObject.ships[i] != null) mainObject.ships[i].finalizeShip();
            }

            BaseDataModule.updateObjectRelations();

            mainInterface.scrollToHomePosition();
            mainInterface.doResize();

            RealmStatistics.checkUserModifiers();

            //update colonyProduction of Energy and Population (we need BuildingProduction (gameData) and colonyBuildings (userData) for this).
            for (var i = 0; i < mainObject.colonies.length; i++) {
                if (mainObject.colonies[i] == null) continue;
                if (mainObject.colonies[i].owner != mainObject.user.id) continue;
                mainObject.colonies[i].calcColonyRessources();
            }


            //Draw ...
            if (mainObject.user.lastSelectedObjectId) {
                //Helpers.Log("try to zoom to ship");
                if (mainObject.user.lastSelectedObjectType === 1 && mainObject.shipExists(mainObject.user.lastSelectedObjectId)) {
                    //selectShip
                    mainObject.shipFind(mainObject.user.lastSelectedObjectId).selectAndCenter();
                }
            }
            else {
                //Helpers.Log("try to zoom to start position");
                mainInterface.scrollToHomePosition();
            }



            //mainInterface.drawAll();
            //gameloop for animated graphics
            window.requestAnimationFrame(mainInterface.drawByRequestAnim);
            DrawInterface.ScreenUpdate = true;

            mainInterface.refreshNavigationBar(currentMap.correspondingArea);
            //Helpers.Log("endStartup finished");

            //Scripts.scriptsAdmin.loadAndRun(0, 1, 'Quests/0010Welcome.js');
            QuestModule.loadAllUncompletedScripts();
            ShipTemplateModule.refreshModules();
            //$(document).tooltip();

            //create the intervalled getEvents()-call
            ServerEventsModule.setEventInterval();

            //(<any>document.documentElement).webkitRequestFullScreen();
            //(<any>document.getElementById('bodyOfAll')).webkitRequestFullScreen();
            //document.getElementById('bodyOfAll').webkitRequestFullScreen();



            $('#loader')[0].style.display = 'none';

            var TranscendenceExists = Ships.TranscendenceConstructExists();
            var GameHasEnded = galaxyMap.gameState != null && galaxyMap.gameState > 2;
            if (TranscendenceExists && !GameHasEnded) Scripts.scriptsAdmin.loadAndRun(3, 5, './TranscendenceList.js');
            if (GameHasEnded) Scripts.scriptsAdmin.loadAndRun(3, 4, './gameOver.js');



            //mainObject.user.nextTurn.toLocaleString()
            //$('#nextTurnTime').text(i18n.label(772) + mainObject.user.nextTurn.toLocaleTimeString());

            ServerEventsModule.setTurnInterval();


            GalacticEventsModule.InitGalacticEvents();
            Chat.initChatTooltip();
            Chat.initActiveUsers();
            UserSpecifications.initUserSpecs();
            //var worker = new Worker('TS_data\StartupWebWorker.js');
            UserSpecifications.FetchAllUserSpecifications();

            Ships.LoadFleets();
            Helpers.ClearUnusedHtmlStorage();
            TransferModule.CreateSymbols();
            PlayerData.RefreshRankDisplay();

            this.Done = true;

            window.addEventListener('resize', mainInterface.doResize, false);



            $.connection.spaceHub.invoke("FetchRoutes").done(e => {

                console.log(e);

                //var json = $.parseJSON(e["Ship"]);
                //var DummyShip = Ships.MakeDummyShipFromJSON(json);
                //Ships.ApplyDummyToReal(DummyShip);
                //DrawInterface.ScreenUpdate = true;

            });



            onLoadWorker.progress = onLoadWorker.progress + 10;
            $('#loadingProgressbar').attr('value', onLoadWorker.progress);


            Renderer.StartUp();
        }

    }

}



function TryInitialize2(count: number = 0): void {
    Helpers.Log(SocketKey);
    $.connection.spaceHub.invoke("initializeClient", SocketKey).done((initialization) => {
        //Helpers.Log("initializeClient");
        if (!initialization) {

            Helpers.Log("!initialization : " + initialization);

            if (count > 3) {
                Helpers.Log("Could not negotiate with server, refreshing the page.");
                window.location.reload();
            } else {
                setTimeout(() => {
                    Helpers.Log("Could not negotiate with server, REPEAT.");
                    this.TryInitialize( count + 1);
                }, 100); //ServerAdapter.RETRY_DELAY.Milliseconds
            }
        } else {
            Helpers.Log("onComplete");
            GameMap.LoadAllData();
            //Load();
            onLoadDoThis();
        }
    });
}
function Load() {
    $.connection.spaceHub.invoke("GetPlanetTypes").done(e => {
        for (var i = 0; i < e.PlanetTypes.length; i++) {
            let planetTypes = e.PlanetTypes[i];
            console.log(planetTypes);                
            //mainObject.planetTypes[planetTypes.id] = new PlanetType(planetTypes.id);
            //mainObject.planetTypes[planetTypes.id].updateFromJSON(planetTypes);
            //console.log(mainObject.planetTypes[planetTypes.id].label.toString());
        }
    });

    

    $.connection.spaceHub.invoke("GetPlanetTypes").done(e => {
        console.log("Done3");
        for (var i = 0; i < e.PlanetTypes.length; i++) {
            let planetTypes = e.PlanetTypes[i];
            console.log("X " );
            //mainObject.planetTypes[planetTypes.id] = new PlanetType(planetTypes.id);
            //mainObject.planetTypes[planetTypes.id].updateFromJSON(planetTypes);
            //console.log(mainObject.planetTypes[planetTypes.id].label.toString());
        }
    }).fail(e => { console.log("Fail 3"); console.log(e);});
}


function registerWebSocket2() {

    SpaceHub.RegisterEvents();

    // Start the connection.
    $.connection.hub.start().done(function () {
        Helpers.Log("Websocket connected");
        //PlanetType.GetPlanetTypes();
        //Load();
        TryInitialize2();
    });
}

$(document).ready(registerWebSocket2);