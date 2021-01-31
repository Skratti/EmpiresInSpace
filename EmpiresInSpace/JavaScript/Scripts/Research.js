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
//concepted as async JS 
//class Researchscript is located at the end of this
//is loaded when Research symbol button is pressed
//Research data is in BaseData.ts and in PlayerData (user.ts)
var ResearchModule;
(function (ResearchModule) {
    function showResearchPanelDiv(researchDiv, mode, researchPanel) {
        researchDiv.empty();
        //build Table of incomplete Quests
        var buildTable = $('<table/>', { "class": "fullscreenTable", "cellspacing": 0 }); // , style:"border-collapse: collapse;"
        var addRow = false;
        buildTable.append(createFirstLine());
        addRow = false;
        var researchLength = BaseDataModule.researches.length;
        for (var i = 0; i < researchLength; i++) {
            if (typeof BaseDataModule.researches[i] === 'undefined') {
                continue;
            }
            var userResearch = PlayerData.PlayerResearchFind(i);
            if (mode == 1 && (userResearch.isCompleted || (!userResearch.researchable)))
                continue;
            if (mode == 2 && !userResearch.isCompleted)
                continue;
            (function createLineClosure(research) {
                //create a empty TR  , so that we have a little Sapce between the TRs                
                if (addRow) {
                    var spacer = $('<tr/>', { "class": "TRspacer" });
                    buildTable.append(spacer);
                }
                else
                    addRow = true;
                var tableRow = createTableLine(research);
                //if (research.researchable) {
                //    tableRow.click((e) => { researchSelected(research); /*researchPanel.remove(); showResearchPanel();*/ });
                // }
                buildTable.append(tableRow);
            })(BaseDataModule.researches[i]);
        }
        var spacer2 = $('<tr/>', { "class": "TRspacer" });
        buildTable.append(spacer2);
        researchDiv.append(buildTable);
    }
    function setResearchHeader() {
        var researchHeader = i18n.label(180) + ' ' + mainObject.user.researchPoints.toString() + i18n.label(182).format(ResearchModule.CountResearchGeneration().toString());
        $("#researchHeader").text(researchHeader);
    }
    function showResearchPanel() {
        Helpers.Log("showResearchPanel()");
        var _researchPanel = ElementGenerator.createPopup();
        ResearchModule.researchPanel = _researchPanel;
        ResearchModule.researchPanel.appendTo("body"); //attach to the <body> element
        $('.yesButton', ResearchModule.researchPanel).click(function (e) { ResearchModule.researchPanel.remove(); });
        $('.noButton span', ResearchModule.researchPanel).text(i18n.label(348)); //research tree
        $('.noButton', ResearchModule.researchPanel).click(function (e) { ResearchModule.researchPanel.remove(); Scripts.scriptsAdmin.loadAndRun(5, 1, "ResearchTree.js", true); });
        //var panelBody = $('.fullscreenPanelBody', commNodesPanel);
        var panelHeader = $('.relPopupHeader', ResearchModule.researchPanel);
        var caption = $('<h2/>', { text: i18n.label(138), style: "float:left" });
        panelHeader.append(caption);
        panelHeader.append($("<span/>", { "id": "researchHeader", "style": "position: absolute; bottom: 5px;margin-left: 7px; " }));
        var panelBody = $('.relPanelBody', ResearchModule.researchPanel);
        var tabDiv = $("<div id='tabs'/>");
        panelBody.append(tabDiv);
        var tabUl = $("<ul/>");
        tabUl.css("display", "table"); //.ui-helper-clearfix:before, .ui-helper-clearfix:after
        tabUl.css("clear", "both");
        tabUl.append($("<li><a href='#researchTab1'>" + i18n.label(305) + "</a></li>"));
        tabUl.append($("<li><a href='#researchTab2'>" + i18n.label(306) + "</a></li>"));
        tabUl.append($("<li><a href='#researchTab3'>" + i18n.label(307) + "</a></li>"));
        tabDiv.append(tabUl);
        var researchDiv1 = $("<div id='researchTab1' class='tabDivWithScroll' />");
        var researchDiv2 = $("<div id='researchTab2' class='tabDivWithScroll' />");
        var researchDiv3 = $("<div id='researchTab3' class='tabDivWithScroll' />");
        tabDiv.append(researchDiv1).append(researchDiv2).append(researchDiv3);
        //set height of researchDivs and get the svgHeight
        var panelFooter = $('.relPopupFooter', _researchPanel);
        var maxDivHeight = (panelFooter.offset().top - researchDiv1.offset().top) - 45;
        researchDiv1.height(maxDivHeight);
        researchDiv2.height(maxDivHeight);
        researchDiv3.height(maxDivHeight);
        showResearchPanelDiv(researchDiv1, 1, ResearchModule.researchPanel);
        showResearchPanelDiv(researchDiv2, 2, ResearchModule.researchPanel);
        showResearchPanelDiv(researchDiv3, 3, ResearchModule.researchPanel);
        tabDiv.tabs();
        setResearchHeader();
    }
    ResearchModule.showResearchPanel = showResearchPanel;
    function createFirstLine() {
        var tableRow = $('<tr/>');
        var tableDataId = $('<th/>', { text: "Id" });
        tableRow.append(tableDataId);
        var tableDataName = $('<th/>', { text: i18n.label(184), "class": "tdTextLeft" });
        tableRow.append(tableDataName);
        var tableDataProgress = $('<th/>', { text: i18n.label(185) });
        tableRow.append(tableDataProgress);
        var tableDataRead = $('<th/>', { text: i18n.label(186), "class": "tdTextLeft" });
        //var readComm = $('<div/>', { "class": "fullscreenTableButton", text: "Details" });
        //tableDataRead.append(readComm);
        tableRow.append(tableDataRead);
        var tableDataRead = $('<th/>', { text: i18n.label(187) });
        //var readComm = $('<div/>', { "class": "fullscreenTableButton", text: "Details" });
        //tableDataRead.append(readComm);
        tableRow.append(tableDataRead);
        tableRow.append(tableDataRead);
        return tableRow;
    }
    function createTableLine(research) {
        var userResearch = PlayerData.PlayerResearchFind(research.id);
        var tableRow = $('<tr/>');
        var tableDataId = $('<td/>', { text: research.id, "class": "firstchild" });
        tableRow.append(tableDataId);
        var tableDataName = $('<td/>', { text: i18n.label(research.label), "class": "tdTextLeft" });
        tableRow.append(tableDataName);
        var progress = userResearch.investedResearchpoints.toString() + ' / ' + research.cost.toString();
        var tableDataProgress = $('<td/>', { text: progress });
        tableRow.append(tableDataProgress);
        var tableDataMore = $('<td/>');
        var image2 = $('<div/>', { style: "background: url(images/QuestionMark.png) no-repeat;width:30px;height:30px; border: 1px solid #666; margin: -4px;" });
        image2.click(function (e) { cancelEvent(e); Helpers.Log('.image2.click.'); showResearchDetailPanel(research); });
        //var readComm = $('<div/>', { "class": "fullscreenTableButton", text: "Beschreibung..." });
        tableDataMore.append(image2);
        tableRow.append(tableDataMore);
        //userResearch.researchPriority.toString()
        var tableDataPrio = $('<td/>', { text: userResearch.researchPriority.toString(), "class": "lastchild" });
        tableRow.append(tableDataPrio);
        if (userResearch.isCompleted) {
            tableRow.css("background-color", "lightblue");
        }
        if (userResearch.researchable && !userResearch.isCompleted) {
            tableRow.css("font-weight", "bold");
            tableRow.click(function (e) { researchSelected(userResearch); });
        }
        if (userResearch.researchPriority > 0 && !userResearch.isCompleted) {
            tableDataId.addClass("firstchildGreen");
            tableDataName.addClass("tdGreen");
            tableDataProgress.addClass("tdGreen");
            tableDataMore.addClass("tdGreen");
            tableDataPrio.addClass("lastchildGreen");
        }
        return tableRow;
    }
    function afterCompletedResearch() {
        setResearchHeader();
        showResearchPanelDiv($("#researchTab1"), 1, ResearchModule.researchPanel);
        showResearchPanelDiv($("#researchTab2"), 2, ResearchModule.researchPanel);
        showResearchPanelDiv($("#researchTab3"), 3, ResearchModule.researchPanel);
    }
    ResearchModule.afterCompletedResearch = afterCompletedResearch;
    function researchSelected(research) {
        /*
        var updatePanels = false;
        if (mainObject.user.researchPoints >= BaseDataModule.researches[research.id].cost) { updatePanels = true; }
        
        */
        research.selected(ResearchModule.afterCompletedResearch);
        /*
        if (updatePanels) {
            setResearchHeader();
            showResearchPanelDiv($("#tab1"), 1, ResearchModule.researchPanel);
        }
        */
    }
    function showResearchDetailPanel(research) {
        Helpers.Log("showResearchDetailPanel()");
        var researchPanel = ElementGenerator.createPopup();
        ElementGenerator.adjustPopupZIndex(researchPanel, 20000);
        $('.yesButton', researchPanel).click(function (e) { researchPanel.remove(); });
        $('.noButton', researchPanel)[0].style.display = 'none';
        $('.yesButton span', researchPanel).text('OK');
        //var panelBody = $('.fullscreenPanelBody', commNodesPanel);
        var panelHeader = $('.relPopupHeader', researchPanel);
        var caption = $('<span/>', { text: i18n.label(research.label), style: "float:left" });
        panelHeader.append(caption);
        var panelBody = $('.relPanelBody', researchPanel);
        var researchText = $('<p/>', { text: i18n.label(research.labelDescription) });
        panelBody.append(researchText);
        var researchText2 = $('<span/>', { text: "benötigt: " });
        panelBody.append(researchText2);
        var ObjectRelations = BaseDataModule.getObjectRelationSources(research, ObjectTypes.Research);
        for (var i = 0; i < ObjectRelations.length; i++) {
            panelBody.append($('<br/>'));
            var researchText2 = $('<span/>', { text: ObjectRelations[i].sourceName });
            panelBody.append(researchText2);
        }
        researchPanel.appendTo("body"); //attach to the <body> element
    }
    var ResearchScript = /** @class */ (function (_super) {
        __extends(ResearchScript, _super);
        function ResearchScript() {
            var _this = 
            //call super, set type to 2 (Research)
            _super.call(this, 2, 1) || this;
            Scripts.scriptsAdmin.scripts.push(_this);
            PlayerData.getUserResearch(mainObject.user);
            return _this;
        }
        ResearchScript.prototype.run = function () {
            showResearchPanel();
        };
        return ResearchScript;
    }(Scripts.Script));
    ResearchModule.ResearchScript = ResearchScript;
    new ResearchScript();
})(ResearchModule || (ResearchModule = {}));
//# sourceMappingURL=Research.js.map