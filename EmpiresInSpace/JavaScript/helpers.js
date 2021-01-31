// Contains helper functions 
var Helpers;
(function (Helpers) {
    var LogType;
    (function (LogType) {
        LogType[LogType["Startup"] = 1] = "Startup";
        LogType[LogType["DataUpdate"] = 2] = "DataUpdate";
        LogType[LogType["FoW"] = 3] = "FoW";
        LogType[LogType["Transfer"] = 4] = "Transfer";
        LogType[LogType["Messages"] = 5] = "Messages";
        LogType[LogType["Trade"] = 6] = "Trade";
        LogType[LogType["Debug"] = 7] = "Debug";
    })(LogType = Helpers.LogType || (Helpers.LogType = {}));
    ;
    function Log(message, logtype) {
        if (logtype === void 0) { logtype = LogType.Startup; }
        var ShowMessage = false;
        switch (logtype) {
            case LogType.Startup:
                ShowMessage = false;
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
            case LogType.Debug:
                ShowMessage = true;
                break;
        }
        if (ShowMessage) {
            console.log(message);
        }
    }
    Helpers.Log = Log;
    function toggleFullScreen() {
        var doc = document;
        if (!doc["fullscreenElement"] && // alternative standard method
            !doc["mozFullScreenElement"] && !doc["webkitFullscreenElement"] && !document["msFullscreenElement"]) {
            // current working methods
            Helpers.Log("start fullscreen");
            if (doc.documentElement.requestFullscreen) {
                doc.documentElement.requestFullscreen();
            }
            else if (doc.documentElement.msRequestFullscreen) {
                doc.documentElement.msRequestFullscreen();
            }
            else if (doc.documentElement.mozRequestFullScreen) {
                doc.documentElement.mozRequestFullScreen();
            }
            else if (doc.documentElement.webkitRequestFullscreen) {
                doc.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        }
        else {
            Helpers.Log("exit fullscreen");
            if (doc["exitFullscreen"]) {
                doc["exitFullscreen"]();
            }
            else if (doc["msExitFullscreen"]) {
                doc["msExitFullscreen"]();
            }
            else if (doc["mozCancelFullScreen"]) {
                doc["mozCancelFullScreen"]();
            }
            else if (doc["webkitExitFullscreen"]) {
                doc["webkitExitFullscreen"]();
            }
        }
    }
    Helpers.toggleFullScreen = toggleFullScreen;
    function supportsHtmlStorage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        }
        catch (e) {
            Helpers.Log("no HtmlStorage");
            return false;
        }
    }
    Helpers.supportsHtmlStorage = supportsHtmlStorage;
    function ClearUnusedHtmlStorage() {
        if (!supportsHtmlStorage())
            return;
        var ClearedSoFar = "6"; //the just count up if the storage should be cleared again
        var Cleared = localStorage.getItem(mainObject.user.id.toString() + "." + galaxyMap.name + ".ClearedStorage");
        if (Cleared && Cleared == ClearedSoFar)
            return;
        var arr = []; // Array to hold the keys
        // Iterate over localStorage and insert the keys that meet the condition into arr
        for (var i = 0; i < localStorage.length; i++) {
            var content = localStorage.getItem(localStorage.key(i));
            if (!content || content == '' || content == ' ') {
                arr.push(localStorage.key(i));
            }
        }
        for (var i = 0; i < arr.length; i++) {
            localStorage.removeItem(arr[i]);
        }
        localStorage.setItem(mainObject.user.id.toString() + "." + galaxyMap.name + ".ClearedStorage", ClearedSoFar);
    }
    Helpers.ClearUnusedHtmlStorage = ClearUnusedHtmlStorage;
    function addGoodsToArray(_array, _arrayToGetDataFrom) {
        for (var i = 0; i < _arrayToGetDataFrom.length; i++) {
            if (_arrayToGetDataFrom[i] == null || _arrayToGetDataFrom[i] == 0)
                continue;
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
    Helpers.addGoodsToArray = addGoodsToArray;
    function removeGoodsFromArray(_arrayToChange, _arrayToGetDataFrom) {
        for (var i = 0; i < _arrayToGetDataFrom.length; i++) {
            if (_arrayToGetDataFrom[i] == null || _arrayToGetDataFrom[i] == 0)
                continue;
            //if (mainObject.goods[i].goodsType != 1) continue;
            //ToDO: check can probably be omited
            if (_arrayToChange[i] == null) {
                continue;
            }
            else {
                _arrayToChange[i] -= _arrayToGetDataFrom[i];
            }
        }
    }
    Helpers.removeGoodsFromArray = removeGoodsFromArray;
    function removeGoodsFromArrayNegatives(_arrayToChange, _arrayToGetDataFrom) {
        for (var i = 0; i < _arrayToGetDataFrom.length; i++) {
            if (_arrayToGetDataFrom[i] == null || _arrayToGetDataFrom[i] == 0)
                continue;
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
    Helpers.removeGoodsFromArrayNegatives = removeGoodsFromArrayNegatives;
    function get_browser() {
        var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\bOPR\/(\d+)/);
            if (tem != null) {
                return 'Opera ' + tem[1];
            }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) {
            M.splice(1, 1, tem[1]);
        }
        return M[0];
    }
    Helpers.get_browser = get_browser;
    function makeSortable(_table, _header, tableId) {
        if (tableId === void 0) { tableId = 0; }
        _header.each(function () {
            var th = $(this), thIndex = th.index(), inverse = false, tableIdsave = tableId;
            th.click(function () {
                if (tableId != 0 && Helpers.supportsHtmlStorage()) {
                    localStorage.setItem(mainObject.user.id.toString() + ".Table." + tableIdsave.toString() + ".Sort", thIndex.toString());
                    localStorage.setItem(mainObject.user.id.toString() + ".Table." + tableIdsave.toString() + ".Inv", inverse ? "1" : "0");
                    //Helpers.Log("set " + thIndex.toString());
                }
                _table.find('tr.sortable td').filter(function () {
                    return $(this).index() === thIndex;
                }).sortElements(function (a, b) {
                    var aText = $.text([a]);
                    var bText = $.text([b]);
                    if (stringIsInt(aText) && stringIsInt(bText)) {
                        aText = parseInt(aText, 10);
                        bText = parseInt(bText, 10);
                    }
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
                if (_header.children().length <= sortedBy)
                    return;
                //Helpers.Log("getset " + sortedBy);
                _header.children()[sortedBy].click();
                if (inverse)
                    _header.children()[sortedBy].click();
            }
        }
    }
    Helpers.makeSortable = makeSortable;
    function copyTableHeaderWidthToRows(_table, lastPaddingRight) {
        if (!lastPaddingRight)
            lastPaddingRight = 0;
        var $headCells = _table.find('thead tr th');
        var colWidth; // number[];
        colWidth = $headCells.map(function () { return $(this).outerWidth(); }).get();
        _table.find('tbody tr').each(function (i, x) { $(x).find('td').each(function (index, elem) { $(elem).width(colWidth[index] - 10); }); });
        _table.find('tbody tr:last-child').width(function (i, w) { return w - lastPaddingRight; });
    }
    Helpers.copyTableHeaderWidthToRows = copyTableHeaderWidthToRows;
    function setTBodyHeight(maxHeightElement, table, _offset, maxSize, addHeaderEnd) {
        if (maxSize === void 0) { maxSize = 0; }
        if (addHeaderEnd === void 0) { addHeaderEnd = false; }
        var thead = $("thead", table);
        if (_offset == null)
            _offset = 0;
        var availableHeight = maxHeightElement.height() - thead.height() - 20 - _offset;
        if (maxSize > 0)
            availableHeight = maxSize;
        if (maxSize < 0)
            availableHeight = availableHeight + maxSize;
        var bodyRowHeight = 0;
        $("tbody tr", table).each(function () { bodyRowHeight = bodyRowHeight + $(this).outerHeight(); });
        $("tbody", table).height(Math.min(availableHeight, bodyRowHeight));
        if (addHeaderEnd && availableHeight < bodyRowHeight)
            $("tr", thead).append(ElementGenerator.headerElement(null, 10));
    }
    Helpers.setTBodyHeight = setTBodyHeight;
    function tooltipLine() {
        var line = $('<span>', { text: "----------------------" });
        line.css("line-height", "60%");
        return line;
    }
    Helpers.tooltipLine = tooltipLine;
})(Helpers || (Helpers = {}));
$.widget("custom.iconselectmenu", $.ui.selectmenu, {
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
function colRowDirection2Int(direction) {
    switch (direction.row) {
        case -1:
            switch (direction.col) {
                case -1: return 1;
                case 0: return 2;
                case 1: return 3;
            }
        case 0:
            switch (direction.col) {
                case -1: return 4;
                case 0: return 5;
                case 1: return 6;
            }
        case 1:
            switch (direction.col) {
                case -1: return 7;
                case 0: return 8;
                case 1: return 9;
            }
    }
    return 5;
}
function directionInt2ColRow(direction) {
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
function directionIntReverse(direction) {
    return 10 - direction;
}
function GetXmlHttpObject() {
    var xmlHttp;
    try {
        try {
            // Firefox, Opera 8.0+, Safari
            xmlHttp = new XMLHttpRequest();
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
function cancelEvent(e) {
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
//# sourceMappingURL=helpers.js.map