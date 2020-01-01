

/*Object.prototype.Inherits = function (parent) {
    if (arguments.length > 1) {
        parent.apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else {
        parent.call(this);
    }
}

Function.prototype.Inherits = function (parent) {
    this.prototype = new parent();
    this.prototype.constructor = this;
}
*/
/*
interface String {
    format(...replacements: string[]): string;
}

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}
*/

module Helpers {

    export enum LogType {
        Startup = 1,
        DataUpdate = 2,
        FoW = 3,
        Transfer = 4,
        Messages = 5,
        Trade = 6
    };

    

    export function Log(message: any, logtype: LogType = LogType.Startup) {

        var ShowMessage = false;
        switch (logtype) {
            case LogType.Startup:  
                ShowMessage = true;
                break;
            case LogType.DataUpdate: 
                //ShowMessage = true;
                break;
            case LogType.FoW: 
                //ShowMessage = true;
                break;
            case LogType.Transfer: 
                //ShowMessage = true;
                break;
            case LogType.Messages: 
                //ShowMessage = true;
                break;
            case LogType.Trade:
                //ShowMessage = true;
                break;
        }

        if (ShowMessage) {
            console.log(message);
        }
    }

    export function toggleFullScreen() {

        var doc = <any>document;
        if (!doc["fullscreenElement"] &&    // alternative standard method
            !doc["mozFullScreenElement"] && !doc["webkitFullscreenElement"] && !document["msFullscreenElement"]) {  
            // current working methods
            Helpers.Log("start fullscreen");
            if (doc.documentElement.requestFullscreen) {
                doc.documentElement.requestFullscreen();
            } else if (doc.documentElement.msRequestFullscreen) {
                doc.documentElement.msRequestFullscreen();
            } else if (doc.documentElement.mozRequestFullScreen) {
                doc.documentElement.mozRequestFullScreen();
            } else if (doc.documentElement.webkitRequestFullscreen) {
                doc.documentElement.webkitRequestFullscreen((<any>Element).ALLOW_KEYBOARD_INPUT);
            }
        } else {
            Helpers.Log("exit fullscreen");
            if (doc["exitFullscreen"]) {
                doc["exitFullscreen"]();
            } else if (doc["msExitFullscreen"]) {
                doc["msExitFullscreen"]();
            } else if (doc["mozCancelFullScreen"]) {
                doc["mozCancelFullScreen"]();
            } else if (doc["webkitExitFullscreen"]) {
                doc["webkitExitFullscreen"]();
            }
        }
        /*
        if ((doc.fullScreenElement && doc.fullScreenElement !== null) ||
            (!doc.mozFullScreen && !doc.webkitIsFullScreen)) {
            if (doc.body.msRequestFullscreen) {
                doc.body.msRequestFullscreen();
            }
            if (doc.body.requestFullScreen) {
                doc.body.requestFullScreen();
            } else if (doc.body.mozRequestFullScreen) {
                doc.body.mozRequestFullScreen();
            } else if (doc.body.webkitRequestFullScreen) {
                doc.body.webkitRequestFullScreen((<any>Element).ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (doc.cancelFullScreen) {
                doc.cancelFullScreen();
            } else if (doc.mozCancelFullScreen) {
                doc.mozCancelFullScreen();
            } else if (doc.webkitCancelFullScreen) {
                doc.webkitCancelFullScreen();
            }
        }
        */
    }

    export function supportsHtmlStorage():boolean {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            Helpers.Log("no HtmlStorage");
            return false;
        }
    }  


    export function ClearUnusedHtmlStorage() {
        if (!supportsHtmlStorage()) return;

        var ClearedSoFar = "6"; //the just count up if the storage should be cleared again
        var Cleared: string =  localStorage.getItem(mainObject.user.id.toString() + "." + galaxyMap.name + ".ClearedStorage");

        if (Cleared && Cleared == ClearedSoFar) return;

        var arr = []; // Array to hold the keys
        // Iterate over localStorage and insert the keys that meet the condition into arr
        for (var i = 0; i < localStorage.length; i++) {
            var content = localStorage.getItem( localStorage.key(i));
            if (!content || content == '' || content == ' ') {
                arr.push(localStorage.key(i));
            }
        }

        for (var i = 0; i < arr.length; i++) {
            localStorage.removeItem(arr[i]);
        }

        localStorage.setItem(mainObject.user.id.toString() + "." + galaxyMap.name + ".ClearedStorage", ClearedSoFar);
    }

    export function addGoodsToArray(_array: number[], _arrayToGetDataFrom: number[]) {
        for (var i = 0; i < _arrayToGetDataFrom.length; i++) {
            if (_arrayToGetDataFrom[i] == null || _arrayToGetDataFrom[i] == 0) continue;

            //if (mainObject.goods[i].goodsType != 1) continue;
            //ToDO: check can probably be omited
            if (_array[i] == null) {
                _array[i] = _arrayToGetDataFrom[i];
            }
            else {
                _array[i] += _arrayToGetDataFrom[i];
            }

        }
    }

    export function removeGoodsFromArray(_arrayToChange: number[], _arrayToGetDataFrom: number[]) {
        for (var i = 0; i < _arrayToGetDataFrom.length; i++) {
            if (_arrayToGetDataFrom[i] == null || _arrayToGetDataFrom[i] == 0) continue;

            //if (mainObject.goods[i].goodsType != 1) continue;
            //ToDO: check can probably be omited
            if (_arrayToChange[i] == null) {
                continue
            }
            else {
                _arrayToChange[i] -= _arrayToGetDataFrom[i];
            }
        }
    }

    export function removeGoodsFromArrayNegatives(_arrayToChange: number[], _arrayToGetDataFrom: number[]) {
        for (var i = 0; i < _arrayToGetDataFrom.length; i++) {
            if (_arrayToGetDataFrom[i] == null || _arrayToGetDataFrom[i] == 0) continue;

            //if (mainObject.goods[i].goodsType != 1) continue;
            //ToDO: check can probably be omited
            if (_arrayToChange[i] == null) {
                _arrayToChange[i] = -_arrayToGetDataFrom[i];
            }
            else {
                _arrayToChange[i] -= _arrayToGetDataFrom[i];
            }
        }
    }

    export function get_browser() : string {
        var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) { return 'Opera ' + tem[1]; }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
        return M[0];
    }

    export function makeSortable(_table: JQuery, _header: JQuery, tableId = 0) {
        //_header.wrapInner('<span title="sort this column"/>')
        _header.each(function () {

            var th = $(this),
                thIndex = th.index(),
                inverse = false,
                tableIdsave = tableId;

            th.click(function () {

                if (tableId != 0 && Helpers.supportsHtmlStorage()) {
                    localStorage.setItem(mainObject.user.id.toString() + ".Table." + tableIdsave.toString() + ".Sort", thIndex.toString());
                    localStorage.setItem(mainObject.user.id.toString() + ".Table." + tableIdsave.toString() + ".Inv", inverse ? "1" : "0");
                    //Helpers.Log("set " + thIndex.toString());
                }

                _table.find('tr.sortable td').filter(function () {

                    return $(this).index() === thIndex;

                }).sortElements(function (a, b) {
                    var aText = <any>$.text([a]);
                    var bText = <any>$.text([b]);

                    if (stringIsInt(aText) && stringIsInt(bText)) { aText = parseInt(aText, 10); bText = parseInt(bText, 10);}

                    if (aText == bText)
                            return 0;

                    return aText > bText ?
                            inverse ? -1 : 1
                            : inverse ? 1 : -1;

                    }, function () {

                        // parentNode is the element we want to move
                        return this.parentNode;

                    });

                inverse = !inverse;

            });

        });

        if (tableId != 0 && Helpers.supportsHtmlStorage()) {
            var sortedBy = parseInt(localStorage.getItem(mainObject.user.id.toString() + ".Table." + tableId.toString() + ".Sort"));
            var inverseString = localStorage.getItem(mainObject.user.id.toString() + ".Table." + tableId.toString() + ".Inv");
            var inverse = inverseString == "1" ? true : false;
            //Helpers.Log("get " + sortedBy);
            if (sortedBy) {
                if (_header.children().length <= sortedBy ) return;
                //Helpers.Log("getset " + sortedBy);
                _header.children()[sortedBy].click();
                if (inverse) _header.children()[sortedBy].click();
            }
        }
    }

    export function copyTableHeaderWidthToRows(_table: JQuery, lastPaddingRight?: number) {
        if (!lastPaddingRight) lastPaddingRight = 0;

        var $headCells = _table.find('thead tr th');
        var colWidth: number[];
        colWidth = $headCells.map(function () { return $(this).outerWidth(); }).get();
        _table.find('tbody tr').each(function (i, x) { $(x).find('td').each(function (index: number, elem: Element) { $(elem).width(colWidth[index] - 10); }); });        
        _table.find('tbody tr:last-child').width(function (i, w) { return w - lastPaddingRight; });
        
    }

    export function setTBodyHeight(maxHeightElement: JQuery, table: JQuery, _offset?: number , maxSize = 0 , addHeaderEnd = false) {

        var thead = $("thead", table);

        if (_offset == null) _offset = 0;
        var availableHeight = maxHeightElement.height() - thead.height() - 20 - _offset;

        if (maxSize > 0) availableHeight = maxSize;
        if (maxSize < 0) availableHeight = availableHeight + maxSize;

        var bodyRowHeight = 0;
        $("tbody tr", table).each(function () { bodyRowHeight = bodyRowHeight + $(this).outerHeight(); });
        $("tbody", table).height(Math.min(availableHeight, bodyRowHeight));

        if (addHeaderEnd && availableHeight < bodyRowHeight) $("tr", thead).append(ElementGenerator.headerElement(null, 10));
    }

    export function tooltipLine(): JQuery {
        var line = $('<span>', { text: "----------------------" });
        line.css("line-height", "60%");
        return line;
    }

}

interface JQuery {
    iconselectmenu(): JQuery;
    iconselectmenu(options: JQueryUI.SelectableOptions | JQueryUI.SelectmenuEvents): JQuery;
    iconselectmenu(optionLiteral: string, options: JQueryUI.SelectableOptions): JQuery;
    iconselectmenu(optionLiteral: string);
    
}

$.widget("custom.iconselectmenu", (<any>$.ui).selectmenu, {
    '_renderItem': function (ul, item) {
        var li = $("<li>", { 'class': item.element.attr("data-lineSwitch") + ' lineBorders' });
        var wrapper = $("<div>", { 'text': item.label });

        if (item.disabled) {
            li.addClass("ui-state-disabled");
        }

        $("<span>", {
            'style': item.element.attr("data-style"),
            "class": "ui-icon " + item.element.attr("data-class")
        })
            .appendTo(wrapper);

        return li.append(wrapper).appendTo(ul);
    }
});



function colRowDirection2Int(direction)
{
    switch (direction.row)
    {
        case -1:
            switch (direction.col)
            {
                case -1: return 1;
                case 0: return 2;
                case 1: return 3;
            }
        case 0:
            switch (direction.col)
            {
                case -1: return 4;
                case 0: return 5;
                case 1: return 6;
            }
        case 1:
            switch (direction.col)
            {
                case -1: return 7;
                case 0: return 8;
                case 1: return 9;
            }
    }
    return 5;
}

function directionInt2ColRow(direction: number): ColRow {
    switch (direction) {
        case 1: return { col: -1, row: -1 };
        case 2: return { col: 0, row: -1 };
        case 3: return { col: 1, row: -1 };
        case 4: return { col: -1, row: 0 };
        case 5: return { col: 0, row: 0 };
        case 6: return { col: 1, row: 0 };
        case 7: return { col: -1, row: 1 };
        case 8: return { col: 0, row: 1 };
        case 9: return { col: 1, row: 1 };
    }
    return { col: 0, row: 0 };
}

function directionIntReverse(direction: number): number {
    return 10 - direction;   
}

function GetXmlHttpObject()
{
    var xmlHttp : XMLHttpRequest;
    
    try {
        try {
            // Firefox, Opera 8.0+, Safari
            xmlHttp = <XMLHttpRequest>new XMLHttpRequest();
            return xmlHttp;
        }
        catch (e) {
            // Internet Explorer
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
                return xmlHttp;
            }
            catch (e) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                return xmlHttp;
            }
        }
    }
    catch (e) {
        alert("Your browser does not support AJAX!");
        return null;
    }
}


function cancelEvent(e)
{
    e = e ? e : window.event;
    if (e.stopPropagation)
        e.stopPropagation();
    if (e.preventDefault)
        e.preventDefault();
    e.cancelBubble = true;
    e.cancel = true;
    e.returnValue = false;
    return false;
}









