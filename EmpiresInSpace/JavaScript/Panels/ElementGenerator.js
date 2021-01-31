var ElementGenerator;
(function (ElementGenerator) {
    /*
    Documentation:
    This module generates all windows/lists/popups
    Several types are supported:
    
    MainPanel() : Left Side List -> Only one can exists, if another one is opened, the last one is replaced
    Window() : draggable Buildings-Details Popup
    createNoYesPopup() : small fixed popup
    createPopup() : medium sized popup. Can also be fullScreen


    MainPanel are directly referenced by currentMainPanel
    All other windows get a unique ID, and are saved with that ID in a window stack
    Pressing Escape removes the last window of that stack, triggering the "no"-click-event if that event dows exist - ot the remove() event, which does trigger onemove and afterRemove
    */
    ElementGenerator.windowStack = [];
    ElementGenerator.windowId = 0;
    ElementGenerator.openWindows = 0;
    ElementGenerator.lastPanelPosition = { Left: 0, Top: 0 };
    function Button(button, label, tooltiplabel) {
        if (label === void 0) { label = null; }
        if (tooltiplabel === void 0) { tooltiplabel = null; }
        if (label != null) {
            button.append($("<span>", { text: i18n.label(label) })); // label = '?'
        }
        if (tooltiplabel != null) {
            button.attr('title', i18n.label(tooltiplabel));
            button.tooltip();
        }
    }
    ElementGenerator.Button = Button;
    //copy of ElementGenerator.createTable
    //Todo: change createTable to a call to this method
    function tableGenerator(_parent, _array, _headerFunction, _lineFunction, _skipIndex, _offset, _scope) {
        if (_offset === void 0) { _offset = 0; }
        if (_scope === void 0) { _scope = null; }
        //Helpers.Log("ElementGenerator.createTable");
        var buildTable = $('<table/>', { "class": "tableBorderBlack highlightTableRow fullscreenTable", "cellspacing": 0 }); // , style:"border-collapse: collapse;" class fullscreenTable
        _parent.append(buildTable);
        //add header
        buildTable.append($('<thead/>').append(_headerFunction()));
        //create tBody
        var tBody = $("<tbody/>");
        buildTable.append(tBody);
        //add tr lines to body
        var makeGray = false;
        var addRow = true;
        var spacer;
        for (var i = 0; i < _array.length; i++) {
            if (typeof _array[i] === 'undefined')
                continue;
            if (_skipIndex && _skipIndex == i)
                continue;
            spacer = null;
            if (addRow) {
                spacer = $('<tr/>', { "class": "TRspacer" });
                buildTable.append(spacer);
            }
            else
                addRow = true;
            //var tableRow = _lineFunction(this, _array[i]);
            var tableRow = _lineFunction.apply(_scope, [this, _array[i]]);
            $(tableRow).addClass("sortable");
            tBody.append(tableRow);
        }
        Helpers.makeSortable(buildTable, $("th", buildTable));
        Helpers.copyTableHeaderWidthToRows(buildTable);
        Helpers.setTBodyHeight(_parent, buildTable, _offset);
        return buildTable;
    }
    ElementGenerator.tableGenerator = tableGenerator;
    function calculateLeftTopPosition(size) {
        var overallSize = getSize();
        var newPosition = { Left: 0, Top: 0 };
        if (ElementGenerator.openWindows == 1) {
            newPosition = {
                Left: overallSize.width - (size.Width + 100),
                Top: 100,
            };
        }
        else {
            newPosition = ElementGenerator.lastPanelPosition;
            newPosition.Left += 30;
            newPosition.Top += 30;
        }
        //check bounds:
        if (newPosition.Left + size.Width > overallSize.width)
            newPosition.Left = 100;
        if (newPosition.Top + size.Height > overallSize.height)
            newPosition.Top = 100;
        ElementGenerator.lastPanelPosition = newPosition;
        return newPosition;
    }
    ElementGenerator.calculateLeftTopPosition = calculateLeftTopPosition;
    function setLeftTopPosition(window) {
        var newPos = ElementGenerator.calculateLeftTopPosition({ Width: window.width(), Height: window.height() });
        window.css('left', newPos.Left + 'px');
        window.css('top', newPos.Top + 'px');
        window.css('margin-left', '0px');
    }
    ElementGenerator.setLeftTopPosition = setLeftTopPosition;
    function createPopupWindow(size, drag, parent) {
        if (size === void 0) { size = 2; }
        if (drag === void 0) { drag = false; }
        if (parent === void 0) { parent = null; }
        var popup = new ElementGenerator.WindowManager(parent, null);
        $('.yesButton', popup.element).unbind("click");
        //$(".semiTransOverlay", popup.element).css("display", "none");
        if (drag) {
            popup.element.draggable({ containment: "#canvas1" });
            var newPos = ElementGenerator.calculateLeftTopPosition({ Width: 420, Height: 503 });
            popup.element.css('left', newPos.Left + 'px');
            popup.element.css('top', newPos.Top + 'px');
            popup.element.css('margin-left', '0px');
        }
        else {
            popup.element.addClass("centered");
        }
        mainObject.keymap.isActive = false;
        $('.noButton span', popup.element).text(i18n.label(332));
        $('.yesButton span', popup.element).text(i18n.label(206));
        //$('.noButton span', buttons).text(i18n.label(207));
        $('.noButton span', popup.element).css("display", "none");
        //$('.yesButton span', buttons).text(i18n.label(440));
        popup.element.on("remove", function () {
            //alert("Element was removed");
            mainObject.keymap.isActive = true;
            $("#semitransparentOverlay").css("display", "none");
        });
        if (size == 0) {
            popup.element.addClass("popupSmallest");
            ElementGenerator.makeSmall(popup.element);
        }
        if (size == 1) {
            popup.element.addClass("popupSmall");
        }
        if (size == 4) {
            popup.element.removeClass("centered");
            popup.element.addClass("centeredBig");
            $(".relPopupHeader", popup.element).addClass("popupHeaderBig");
            $(".relPopupPanel", popup.element).addClass("popupPanelBig");
            $(".relPopupFooter", popup.element).addClass("popupFooterBig");
            /*popup.element.css("z-index", 30000);*/
            $("#semitransparentOverlay").css("display", "block");
        }
        /*
        $(document).keydown((event) => {

            if (event.keyCode == 27) {
                //Helpers.Log("Esc");
                event.preventDefault();
                event.stopPropagation();
                popup.remove();
            }
        });
        */
        return popup;
    }
    ElementGenerator.createPopupWindow = createPopupWindow;
    //standard method for windowed panels
    //either small or medium, or stretched to be as bis as possible (with a small margin)
    function createPopup(size, drag, parent) {
        if (size === void 0) { size = 2; }
        if (drag === void 0) { drag = false; }
        if (parent === void 0) { parent = null; }
        return createPopupWindow(size, drag, parent).element;
    }
    ElementGenerator.createPopup = createPopup;
    function createNoYesPopup(yesCallback, noCallback, headerText, bodyText, parent, size) {
        if (parent === void 0) { parent = null; }
        if (size === void 0) { size = 0; }
        var popup = createPopup(size, false, parent);
        if (headerText != null) {
            var panelHead = $('.relPopupHeader', popup);
            var caption = $('<h2/>', { text: headerText });
            panelHead.append(caption);
        }
        if (bodyText != null) {
            var panelBody = $('.relPanelBody', popup);
            var bodySpan = $('<span/>', { text: bodyText });
            panelBody.append(bodySpan);
        }
        $('.yesButton span', popup).text(i18n.label(291));
        $('.noButton span', popup).text(i18n.label(292));
        $('.noButton', popup).css("display", "inline-block");
        $('.noButton span', popup).css("display", "block");
        $('.noButton', popup).css("padding", "0px 5px 0px 5px");
        $('.yesButton', popup).css("padding", "0px 5px 0px 5px");
        $('.noButton', popup).click(function (event) { return (noCallback(event)); });
        $('.yesButton', popup).click(function (event) { return (yesCallback(event)); });
        return popup;
    }
    ElementGenerator.createNoYesPopup = createNoYesPopup;
    function createAppendNoYesPopup(yesCallback, noCallback, headerText, bodyText, parent, size) {
        if (parent === void 0) { parent = null; }
        if (size === void 0) { size = 0; }
        var NoYesPopup = ElementGenerator.createNoYesPopup(yesCallback, noCallback, headerText, bodyText, parent, size);
        //Todo: these events may be triggered before other events of the objetcs are evaluated!
        //$('.yesButton', NoYesPopup).click((event: JQueryEventObject) => NoYesPopup.remove());
        //$('.noButton', NoYesPopup).click((event: JQueryEventObject) => NoYesPopup.remove());
        ElementGenerator.adjustPopupZIndex(NoYesPopup, 16000);
        ElementGenerator.makeSmall(NoYesPopup);
        NoYesPopup.appendTo("body"); //attach to the <body> element
        return NoYesPopup;
    }
    ElementGenerator.createAppendNoYesPopup = createAppendNoYesPopup;
    function createWorsenRelationPopup(yesCallback, noCallback, headerText, bodyText, parent, size, newRelation) {
        if (parent === void 0) { parent = null; }
        if (size === void 0) { size = 0; }
        if (newRelation === void 0) { newRelation = 0; }
        var popup = createNoYesPopup(yesCallback, noCallback, headerText, i18n.label(mainObject.relationTypes[newRelation].descriptionLabel), parent, size);
        //remove X-Button
        //$('.relPopupHeader', popup).addClass("WorsenRelationHeader");
        $(".bX", popup).css("display", "none");
        //Add Icon to display new state
        var panelBody = $('.relPanelBody', popup);
        var tableDataCurrentStateDiv = $('<div/>', { "class": "Icon" + mainObject.relationTypes[newRelation].backgroundSymbolClass + "Small" });
        tableDataCurrentStateDiv.attr("title", i18n.label(mainObject.relationTypes[newRelation].nameLabel));
        var worsenContainer = $('<div/>', { "class": "WorsenRelationIconContainer" });
        worsenContainer.append(tableDataCurrentStateDiv);
        panelBody.prepend(worsenContainer);
        //Remove footer position-adjustment
        $('.relPopupFooter', popup).removeClass("popupFooterSmall");
        return popup;
    }
    ElementGenerator.createWorsenRelationPopup = createWorsenRelationPopup;
    function messagePopup(_label, messageText) {
        var messagePanel = ElementGenerator.createPopup(1);
        ElementGenerator.adjustPopupZIndex(messagePanel, 25000);
        //confirmDiplomacyPanel.adjustPopupZIndex(12000);
        var panelBody = $('.relPanelBody', messagePanel);
        if (_label) {
            var caption = $('<h2/>');
            caption.text(i18n.label(_label));
            $('.relPopupHeader', messagePanel).append(caption);
        }
        if (messageText != undefined) {
            var bodyText = $('<p/>');
            bodyText.text(messageText);
            panelBody.append(bodyText);
        }
        $('.noButton', messagePanel).css("display", "none");
        $('.yesButton span', messagePanel).text(i18n.label(206)); //OK
        $('.yesButton', messagePanel).click(function (e) { messagePanel.remove(); });
        messagePanel.appendTo("body"); //attach to the <body> element
        return messagePanel;
    }
    ElementGenerator.messagePopup = messagePopup;
    function renamePanel(oldName, header) {
        var newNameContainer = ElementGenerator.createPopup(1);
        var body = $('.relPopupBody', newNameContainer);
        var caption = $('<h2/>', { text: header });
        $(".relPopupHeader", newNameContainer).append(caption);
        body.append($("<br>"));
        body.append($("<span>", { "text": i18n.label(818) + ' ' }));
        var newNameInput = $('<input/>', { "class": "inputEl", style: "width : 170px;" });
        newNameInput.val(oldName);
        body.append(newNameInput);
        body.css("text-align", "center");
        //launchScount.click((e) => { launchScout(mainObject.currentSurfaceField.surfaceFieldId); scoutContainer.remove(); });
        ElementGenerator.makeSmall(newNameContainer);
        $(".buttonUl", newNameContainer).css("right", "-10px");
        $('.noButton', newNameContainer).click(function (e) {
            newNameContainer.remove();
        });
        $('.noButton span', newNameContainer).text(i18n.label(207));
        newNameContainer.appendTo("body"); //attach to the <body> element
        //Helpers.Log("renamePanel");
        return newNameContainer;
    }
    ElementGenerator.renamePanel = renamePanel;
    function adjustPopupZIndex(panel, newZIndex) {
        panel.css("z-index", newZIndex);
        panel.find("*").css("z-index", newZIndex);
        return panel;
    }
    ElementGenerator.adjustPopupZIndex = adjustPopupZIndex;
    function makeSmall(panel) {
        $(".relPopupHeader", panel).addClass("popupHeaderSmall");
        $(".relPopupPanel", panel).addClass("popupPanelSmall");
        //$(".relPopupFooter", panel).addClass("popupFooterSmall");
        return panel;
    }
    ElementGenerator.makeSmall = makeSmall;
    function makeMedium(panel) {
        $(".relPopupHeader", panel).addClass("popupHeaderMedium");
        $(".relPopupPanel", panel).addClass("popupPanelMedium");
        $(".relPopupFooter", panel).addClass("popupFooterMedium");
        return panel;
    }
    ElementGenerator.makeMedium = makeMedium;
    function makeRelSmall(panel) {
        $(".relPopupHeader", panel).addClass("popupHeaderSmall");
        $(".relPopupPanel", panel).addClass("popupPanelSmall");
        //$(".relPopupFooter", panel).addClass("popupFooterSmall");
        return panel;
    }
    ElementGenerator.makeRelSmall = makeRelSmall;
    function makeBig(panel) {
        $(".relPopupHeader", panel).addClass("popupHeaderBig");
        $(".relPopupPanel", panel).addClass("popupPanelBig");
        $(".relPopupFooter", panel).addClass("popupFooterBig");
        return panel;
    }
    ElementGenerator.makeBig = makeBig;
    var WindowManager = /** @class */ (function () {
        function WindowManager(parent, _callbackOnRemove, callbackAfterRemove) {
            this.parent = parent;
            ElementGenerator.currentPanel = this;
            this.callbackOnRemove = _callbackOnRemove;
            this.callbackAfterRemove = callbackAfterRemove;
            ElementGenerator.openWindows += 1;
            //create the window
            this.createRelativePopup(parent, _callbackOnRemove);
            this.Id = ElementGenerator.windowId++;
            ElementGenerator.windowStack[this.Id] = this;
        }
        WindowManager.prototype.SetBottom = function () {
            var MenuHeight = $("#menuTools", this.element).height();
            var CenterHeight = $("div.relPopupBody.relPanelBody", this.element).height();
            var HeaderHeight = $("div.relPopupHeader", this.element).height();
            var BottomHeight = $("div.relPopupFooter", this.element).height();
            var ScreenHeight = $(window).height();
            var Neededheight = MenuHeight + HeaderHeight + CenterHeight + BottomHeight + 50;
            var RemainingHeight = ScreenHeight - Neededheight;
            if (RemainingHeight > 50) {
                this.element.css("height", (HeaderHeight + CenterHeight + BottomHeight + 20) + "px");
                this.element.css("bottom", "inherit");
                //this.element.css("bottom", RemainingHeight + "px");
            }
        };
        WindowManager.prototype.remove = function () {
            ElementGenerator.openWindows -= 1;
            if (this.callbackOnRemove)
                this.callbackOnRemove();
            mainObject.keymap.isActive = true;
            this.element.data('window', null);
            this.element.remove();
            ElementGenerator.currentPanel = this.parent;
            if (this.callbackAfterRemove)
                this.callbackAfterRemove();
            ElementGenerator.currentMainPanel = null;
            ElementGenerator.windowStack[this.Id] = null;
        };
        //create dom elements for a window including header, body, footer, buttons. Set the zIndex, removeAction (Escape-key) and set the data-Attribute with the current window-instance
        WindowManager.prototype.createRelativePopup = function (_parent, _callbackOnRemove) {
            mainObject.keymap.isActive = false;
            var container = $('<div/>', { "class": 'relPopup' }); //contains all            
            this.element = container;
            /*
             if (_parent) {
                 this.zIndex = _parent.zIndex + 1000;
             } else this.zIndex = 8500;*/
            container.attr('tabindex', 0);
            //container.append($('<div/>', { "class": 'semiTransOverlay' }));  //grey out backgound
            container.data("window", this);
            var content = $('<div/>', { "class": 'relPopupContent SpaceTheme' }); // contains all visible content
            var header = $('<div/>', { "class": 'relPopupHeader ui-state-default' }); // contains the scroll bar
            var buttonX = $('<button/>', { "class": 'ui-state-default bX', "text": "X" });
            header.append(buttonX);
            buttonX.click(function (e) { container.data("window").remove(); });
            header.addClass("panelHeaderBackground");
            var panel = $('<div/>', { "class": 'relPopupPanel' }); // contains the scroll bar of the body
            var body = $('<div/>', { "class": 'relPopupBody relPanelBody' }); //content
            var footer = $('<div/>', { "class": 'relPopupFooter' }); //footer
            footer.addClass("panelFooterBackground");
            panel.append(body);
            content.append(header).append(panel).append(footer);
            var buttons = $('<div/>', { "class": "ui-dialog-buttonset" });
            /*
            buttons.css("float", "right");
            buttons.css("padding-right", "10px");
            buttons.css("padding-top", "5px");
            */
            var buttonNo = $('<button/>', { "class": 'noButton', "text": "NO" });
            var buttonYes = $('<button/>', { "class": 'yesButton' });
            buttonYes.text("OK");
            buttons.append(buttonNo).append(buttonYes);
            footer.append(buttons);
            buttonNo.button();
            buttonYes.button();
            $('.yesButton span', container).text(i18n.label(206));
            $('.noButton span', container).text(i18n.label(207));
            buttonNo.css("display", "none");
            $('.yesButton span', container).text(i18n.label(440));
            /*
            $('button .bX, button .yesButton', container).click((e: JQueryEventObject) => { //allianceDetailsPage.remove(); });
                //Helpers.Log("yeButton click");
                container.data("window").remove();
            });
            */
            buttonYes.click(function (e) {
                //Helpers.Log("yeButton click");
                container.data("window").remove();
            });
            container.append(content);
            container.on("remove", function () {
                //alert("Element was removed");
                mainObject.keymap.isActive = true;
            });
            if ($(window).height() < 650) {
                $(".relPopupHeader", container).addClass("popupHeaderFullHeight");
                $(".relPopupPanel", container).addClass("popupHeaderFullHeight");
                $(".relPopupFooter", container).addClass("popupHeaderFullHeight");
            }
            if ($(window).width() < 1010) {
                $(".relPopupHeader", container).addClass("popupHeaderFullWidth");
                $(".relPopupPanel", container).addClass("popupHeaderFullWidth");
                $(".relPopupFooter", container).addClass("popupHeaderFullWidth");
            }
            if (_parent != null) {
                _parent.element.append(container);
                container.css("top", "0px");
            }
            else
                container.appendTo("body"); //attach to the <body> element
            //container.css('left', container.position().left + (ElementGenerator.openWindows * 30));
            //container.css('top', container.position().top + (ElementGenerator.openWindows * 30));
            this.setZIndex(8500 + (ElementGenerator.openWindows * 1000));
            container.mousemove(function (e) {
                currentMap.MouseOverField = { col: 0, row: 0 };
                $("#CanvasTooltip").css("display", "none");
                //e.stopPropagation();
            });
        };
        WindowManager.prototype.setZIndex = function (zIndex) {
            this.zIndex = zIndex;
            this.element.css("z-index", this.zIndex + 1);
            this.element.find("*").css("z-index", this.zIndex);
            $(".relPopupHeader", this.element).css("z-index", this.zIndex + 1);
        };
        WindowManager.prototype.setHeader = function (_text) {
            var panelHeader = $('.relPopupHeader', this.element);
            var caption = $('<h2/>'); //, style: "float:left" }); // Alliances  i18n.label(143)
            caption.html(_text);
            panelHeader.append(caption);
            panelHeader.append($("<span/>", { "style": "position: relative; bottom: -3px;margin-left: 7px; " }));
        };
        WindowManager.prototype.makeStandardSize = function () {
            this.element.css("width", "1200px");
            this.element.css("margin-left", "-600px");
            //$(".relPopupPanel", this.element).css("height", ($(document).height() - 200) + "px");
        };
        WindowManager.prototype.prepareScrollableTable = function () {
            var panelBody = $('.relPopupBody', this.element);
            //panelBody.addClass("scrollableTableDiv");
        };
        /*
            creates a table and appends it to _parent
            _parent : where the table is appended
            _array: the array to iterate to get the line elements
            _headerFunction: to create the table header -> width of the header elements will be transferred to the lines
            _lineFunction: the method to create the lines
            _skipIndex: single index which is to be skipped during _array iteration
            _offset: table size will be fixed according to parent size. Since the parent may contain other html elements, the offset is needed. Todo: a better solution would be to detect the height of all sub elements of the _parent, and use that as offset
            _scope: the scope to call _lineFunction

            10  - Colonies list
            60  - own CommNodes
            65  - foreign commNodes
            80  - Quests : finished
            81  - Quests : unfinished
            20  - Spaceport
            25  - Ship Modules
            41  - Contact Details - Relations
            42  - Contact Details - User Victory Points

            50 Alliance
            53 Alliance
            56 Alliance
        */
        WindowManager.prototype.createTable = function (_parent, _array, _headerFunction, _lineFunction, _skipIndex, _offset, _scope, tableId, setHeight, highlightable) {
            if (_offset === void 0) { _offset = 0; }
            if (_scope === void 0) { _scope = null; }
            if (tableId === void 0) { tableId = 0; }
            if (setHeight === void 0) { setHeight = true; }
            if (highlightable === void 0) { highlightable = true; }
            //Helpers.Log("ElementGenerator.createTable");
            //var buildTable = $('<table/>', { "class": "tableBorderBlack highlightTableRow fullscreenTable trLightGrey", "cellspacing": 0 });// , style:"border-collapse: collapse;" class fullscreenTable
            var buildTable = $('<table/>', { "class": "fullscreenTable", "cellspacing": 0 }); // , style:"border-collapse: collapse;" class fullscreenTable
            _parent.append(buildTable);
            //add header            
            buildTable.append($('<thead/>').append(_headerFunction()));
            //create tBody
            var tBody = $("<tbody/>");
            buildTable.append(tBody);
            //add tr lines to body
            var makeGray = false;
            var addRow = true;
            var spacer;
            for (var i = 0; i < _array.length; i++) {
                if (typeof _array[i] === 'undefined')
                    continue;
                if (_skipIndex && _skipIndex == i)
                    continue;
                spacer = null;
                if (addRow) {
                    //spacer = $('<tr/>', { "class": "TRspacer" });
                    // create a spacer by add the <td>, then delete content
                    spacer = _lineFunction.apply(_scope, [this, _array[i]]);
                    jQuery('td', spacer).html('');
                    jQuery('td', spacer).removeAttr('style');
                    jQuery('td', spacer).removeClass();
                    spacer.removeClass();
                    spacer.addClass("TRspacer");
                    buildTable.append(spacer);
                }
                else
                    addRow = true;
                //var tableRow = _lineFunction(this, _array[i]);
                var tableRow = _lineFunction.apply(_scope, [this, _array[i]]);
                $(tableRow).addClass("sortable");
                if (highlightable) {
                    $(tableRow).addClass("Highlight");
                }
                tBody.append(tableRow);
            }
            Helpers.makeSortable(buildTable, $("th", buildTable), tableId);
            //Helpers.copyTableHeaderWidthToRows(buildTable);
            if (setHeight) {
                Helpers.setTBodyHeight(_parent, buildTable, _offset);
            }
            return buildTable;
        };
        WindowManager.prototype.showNoButton = function (show) {
            if (show)
                $(".noButton", this.element).css("display", "inline-block");
            else
                $(".noButton", this.element).css("display", "none");
        };
        WindowManager.prototype.BackgroundDark = function () {
            $(".relPopupPanel", this.element).addClass("BackgroundDarkGray");
        };
        return WindowManager;
    }());
    ElementGenerator.WindowManager = WindowManager;
    //left side window 
    function MainPanel() {
        if (ElementGenerator.currentMainPanel != null)
            ElementGenerator.currentMainPanel.remove();
        var newMainPanel = new ElementGenerator.WindowManager(null);
        newMainPanel.setZIndex(5000);
        $(".relPopupHeader span", newMainPanel.element).text('');
        //newMainPanel.prepareScrollableTable();
        $('#loader')[0].style.display = 'none';
        $('.yesButton span', newMainPanel.element).text(i18n.label(206)); //OK
        //fix header line        
        //add top distance due to header fixing
        $(".relPopupContent", newMainPanel.element).addClass("relPopupHeaderFixed");
        newMainPanel.element.css("bottom", "0px");
        var panelBody = $('.relPopupPanel', newMainPanel.element);
        //panelBody.removeClass("relPopupPanel");
        panelBody.removeClass("trHighlight");
        //panelBody.addClass("relPopupPanelBlack");
        panelBody.addClass("trBlack");
        ElementGenerator.currentMainPanel = newMainPanel;
        return newMainPanel;
    }
    ElementGenerator.MainPanel = MainPanel;
    //Window - small (quest), medium (buildings) or big (research tree)
    function Window(parent, _callbackOnRemove, callbackAfterRemove) {
        var Window = new ElementGenerator.WindowManager(parent, _callbackOnRemove, callbackAfterRemove);
        Window.element.draggable({ "containment": "#canvas1" });
        Window.element.addClass("WindowPanel");
        $(".semiTransOverlay", Window.element).css("display", "none");
        var leftButton = $('.noButton', Window.element);
        leftButton.addClass("WindowLeftButton");
        return Window;
    }
    ElementGenerator.Window = Window;
    function headerElement(_label, _width, _noRightBorder, _tooltip, textAlign) {
        if (_noRightBorder === void 0) { _noRightBorder = false; }
        if (_tooltip === void 0) { _tooltip = 0; }
        var TextDiv = $("<div>");
        TextDiv.append($("<span>", { text: _label && i18n.label(_label) || "" }));
        var tableDataId = $('<th/>', { "class": "tdTextLeft borderBottom" });
        tableDataId.css("width", _width + "px");
        tableDataId.append(TextDiv);
        TextDiv.css("width", _width + "px");
        if (_noRightBorder)
            tableDataId.css("border-right", "none");
        if (_tooltip != 0)
            tableDataId.attr("title", i18n.label(_tooltip));
        if (textAlign != null) {
            tableDataId.css("text-align", textAlign);
        }
        return tableDataId;
    }
    ElementGenerator.headerElement = headerElement;
    function headerDivElement(className, tooltip, size, margin) {
        if (size === void 0) { size = 30; }
        if (margin === void 0) { margin = 10; }
        var tableHeadMemersDiv = $("<div/>");
        tableHeadMemersDiv.addClass(className);
        var s = size.toString();
        var m = margin.toString();
        tableHeadMemersDiv.css({ "width": s + "px", "height": s + "px", "margin-left": m + "px", "margin-right": m + "px" });
        tableHeadMemersDiv.attr("title", i18n.label(tooltip));
        return tableHeadMemersDiv;
    }
    ElementGenerator.headerDivElement = headerDivElement;
    function headerPictureElement(background, tooltip, size, margin) {
        if (size === void 0) { size = 30; }
        if (margin === void 0) { margin = 10; }
        var tableHeadMembers = $('<th/>');
        var tableHeadMemersDiv = $("<div/>");
        tableHeadMemersDiv.css("background", background);
        var s = size.toString();
        var m = margin.toString();
        tableHeadMemersDiv.css({ "width": s + "px", "height": s + "px", "margin-left": m + "px", "margin-right": m + "px" });
        tableHeadMembers.addClass("borderBottom");
        tableHeadMembers.attr("title", i18n.label(tooltip));
        tableHeadMembers.append(tableHeadMemersDiv);
        return tableHeadMembers;
    }
    ElementGenerator.headerPictureElement = headerPictureElement;
    function headerClassElement(className, tooltip, size, margin) {
        if (size === void 0) { size = 30; }
        if (margin === void 0) { margin = 10; }
        var tableHeadMembers = $('<th/>');
        var tableHeadMemersDiv = $("<div/>");
        tableHeadMemersDiv.addClass(className);
        var s = size.toString();
        var m = margin.toString();
        tableHeadMemersDiv.css({ "width": s + "px", "height": s + "px", "margin-left": m + "px", "margin-right": m + "px" });
        tableHeadMembers.addClass("borderBottom");
        tableHeadMembers.attr("title", i18n.label(tooltip));
        tableHeadMembers.append(tableHeadMemersDiv);
        return tableHeadMembers;
    }
    ElementGenerator.headerClassElement = headerClassElement;
    function escapePressed() {
        for (var i = ElementGenerator.windowStack.length; i > 0; i--) {
            if (ElementGenerator.windowStack[i] == null)
                continue;
            ElementGenerator.windowStack[i].remove();
            return;
        }
    }
    ElementGenerator.escapePressed = escapePressed;
    function CloseAll() {
        for (var i = ElementGenerator.windowStack.length; i > 0; i--) {
            if (ElementGenerator.windowStack[i] == null)
                continue;
            ElementGenerator.windowStack[i].remove();
        }
    }
    ElementGenerator.CloseAll = CloseAll;
    $(document).keydown(function (event) {
        if (event.keyCode == 27) {
            //Helpers.Log("Esc");
            ElementGenerator.escapePressed();
        }
    });
})(ElementGenerator || (ElementGenerator = {}));
//# sourceMappingURL=ElementGenerator.js.map