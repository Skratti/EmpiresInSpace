/// <reference path="../References.ts" />
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
var TranscendenceList;
(function (TranscendenceList_1) {
    var TranscendenceList = /** @class */ (function (_super) {
        __extends(TranscendenceList, _super);
        function TranscendenceList() {
            var _this = 
            //call super, set scriptType to 3(Form) and Id to 5 (TranscendenceList)
            _super.call(this, 3, 5) || this;
            //mainObject.scriptsAdmin.scripts.push(this);
            Scripts.scriptsAdmin.scripts.push(_this);
            _this.run();
            return _this;
        }
        TranscendenceList.prototype.run = function () {
            this.showTransList();
        };
        TranscendenceList.prototype.showTransList = function () {
            var _this = this;
            mainObject.keymap.isActive = false;
            $('#loader')[0].style.display = 'none';
            var windowHandle = ElementGenerator.MainPanel(); // new ElementGenerator.WindowManager(null, e => { this.removeGameOverWindow(); });
            windowHandle.callbackOnRemove = function (e) { _this.removeGameOverWindow(); };
            var _DesignerContainer = windowHandle.element;
            //_DesignerContainer.css("width", "900px");
            //$(".relPopupPanel", _DesignerContainer).css("height", ($(document).height() - 200) + "px");
            var DesignerContainer = _DesignerContainer;
            var panelHeader = $('.relPopupHeader', DesignerContainer);
            var caption = $('<h2/>', { "text": i18n.label(590) });
            panelHeader.append(caption);
            var panelBody = $('.relPopupBody', windowHandle.element);
            var filteredArray = [];
            for (var i = 0; i < mainObject.ships.length; i++) {
                if (mainObject.ships[i] == null)
                    continue;
                if (mainObject.ships[i].transcension != null)
                    filteredArray.push(mainObject.ships[i]);
            }
            var transTable = windowHandle.createTable(panelBody, filteredArray, this.createTableHeader, this.createTableLine2);
            transTable.addClass("transcendenceList");
            this.showCreateIcon();
            windowHandle.SetBottom();
        };
        TranscendenceList.prototype.createTableHeader = function () {
            var tableRow = $('<tr/>');
            var th = ElementGenerator.headerElement;
            /*
            tableRow.append(th(null, 10, true)); //empty
            tableRow.append(th(null, 30, true)); //image
            tableRow.append(th(442, 40)); //ID
            tableRow.append(th(443, 180)); //Name
            tableRow.append(th(201, 80)); //Distance
            tableRow.append(th(463, 340, true)); //Progress
            tableRow.append(th(null, 10)); //empty
            */
            tableRow.append(th(null, 10, true)); //empty 
            tableRow.append(th(null, 30, true)); //image
            tableRow.append(th(442, 40)); //ID
            tableRow.append(th(443, 352)); //Name
            tableRow.append(th(185, 220)); //Movement
            return tableRow;
        };
        TranscendenceList.prototype.createTableLine2 = function (_caller, ship) {
            var tableRow = $('<tr/>');
            var tableDataFirst = $('<td/>');
            tableRow.append(tableDataFirst);
            var imageSource = ship.objectType.texture.src;
            var tableDataGif = $('<td/>', { style: "background-image:url(" + imageSource + ");width:30px;height:30px;background-repeat:no-repeat;background-size: 90%;background-position: center center;" });
            tableRow.append(tableDataGif);
            var tableDataId = $('<td/>', { text: ship.id.toString() });
            tableRow.append(tableDataId);
            //var tableDataName = $('<td/>', { text: ship.name });
            var tableDataName = $('<td/>');
            tableDataName.html(ship.name);
            tableRow.append(tableDataName);
            //Strength
            /*
            var attackDefense = "13";
            var tableDataAD1 = $('<td/>', { text: attackDefense });
            tableRow.append(tableDataAD1);
            */
            //Progress            
            var moves = ship.starMoves.toString() + ' (' + ship.galaxyMovesMax.toString() + ') / ' + ship.sytemMoves.toString() + ' (' + ship.systemMovesMax.toString() + ')';
            var tableDataMoves = $('<td/>');
            createProgress(tableDataMoves, ship);
            tableRow.append(tableDataMoves);
            /*
            var tableDataRead = $('<td/>', { "class": "lastchild" });
            tableRow.append(tableDataRead);
            */
            tableRow.click(function (e) { ship.selectAndCenter(); _caller.remove(); });
            return tableRow;
        };
        TranscendenceList.prototype.createIcon = function () {
            var _this = this;
            this.icon = $("<button>", { "class": "transcendenceButton" });
            this.icon.css("display", "none");
            this.icon.button({ "icons": { "primary": 'transcendence', "secondary": null } });
            this.icon.data("quest", this);
            this.icon.tooltip();
            this.icon.click(function (e) {
                _this.showTransList();
                _this.icon.css("display", "none");
            });
            var li = $("<li>");
            li.append(this.icon);
            $("#ui #alerts ul").append(li);
        };
        TranscendenceList.prototype.showCreateIcon = function () {
            if (this.icon == null)
                this.createIcon();
            else
                this.icon.css("display", "block");
        };
        TranscendenceList.prototype.removeGameOverWindow = function () {
            this.showCreateIcon();
        };
        return TranscendenceList;
    }(Scripts.Script));
    function currentProgress(currentShip) {
        //return mainInterface.cargoHoldUsed(this.countCargo(), this.cargoroom);
        return Math.floor((currentShip.transcension.amountInvested() / currentShip.transcension.transAddNeeded) * 100);
    }
    TranscendenceList_1.currentProgress = currentProgress;
    function currentEndProgress(currentShip) {
        //return mainInterface.cargoHoldUsed(this.countCargo(), this.cargoroom);
        var Developing = galaxyMap.TurnNumber - currentShip.transcension.finishedInTurn;
        var PercentageDone = Developing / (6 * 7 * 3);
        return Math.floor(PercentageDone);
    }
    TranscendenceList_1.currentEndProgress = currentEndProgress;
    function createBar() {
        var cargobar = $('<div/>');
        cargobar.css("margin", "15px");
        cargobar.progressbar();
        cargobar.progressbar("option", "value", 25);
        cargobar.find(".ui-progressbar-value").css({
            //"background": '#' + Math.floor(Math.random() * 16777215).toString(16)
            "background": '#00FF00'
        });
        var progressLabel = $('<div/>', { "class": "progressLabel text" });
        cargobar.append(progressLabel);
        return cargobar;
    }
    TranscendenceList_1.createBar = createBar;
    //get a TD - JQuery and fills it with a progrss bar
    function createProgress(td, currentShip) {
        currentShip.transcension.amountInvested();
        var cargobar = createBar();
        var progressLabel = $(".progressLabel", cargobar);
        cargobar.progressbar("option", {
            value: currentProgress(currentShip)
        });
        progressLabel.text(currentProgress(currentShip) + "%");
        td.append(cargobar);
        var transAddCount = $('<div/>', { "class": "transAddCount text" });
        transAddCount.text(currentShip.transcension.amountInvested());
        td.append(transAddCount);
        var overallCosts = $('<div/>', { "class": "overallCosts text" });
        overallCosts.text(currentShip.transcension.transAddNeeded);
        td.append(overallCosts);
        //2nd
        /*
        var cargobar2 = createBar();
        progressLabel = $(".progressLabel", cargobar2);
        cargobar2.progressbar("option", {
            value: currentEndProgress(currentShip)
        });
        progressLabel.text(currentEndProgress(currentShip) + "%");

        td.append(cargobar2);

        */
        /*
        var transAddCount2 = $('<div/>', { "class": "transAddCount text" });
        transAddCount2.text(currentShip.transcension.amountInvested());

        td.append(transAddCount2);

        var overallCosts2 = $('<div/>', { "class": "overallCosts text" });
        overallCosts2.text(currentShip.transcension.transAddNeeded);

        td.append(overallCosts2);
        */
    }
    TranscendenceList_1.createProgress = createProgress;
    new TranscendenceList();
})(TranscendenceList || (TranscendenceList = {}));
//# sourceMappingURL=TranscendenceList.js.map