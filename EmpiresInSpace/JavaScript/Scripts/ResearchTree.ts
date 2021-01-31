/// <reference path="../References.ts" />

module ResearchModule {
    export var researchTreeContainer: JQuery;

    export var svgHeight: number = 0;

    class researchTreePanel extends Scripts.Script {

        constructor() {
            //call super, set scriptType to 5(ResearchTree) and Id to 1 (ResearchTree)
            super(5, 1);
            Scripts.scriptsAdmin.scripts.push(this);
            this.run();
        }

        run() {
            showResearchTreePanel();
        }
    }

    export function makeModifierDiv(_type: BaseDataModule.Modificators, amount: number): JQuery {

        var mDiv = BaseDataModule.modifierDiv(_type, amount);
        mDiv.css("float", "right");
        mDiv.css("clear", "none");
        mDiv.css("width", "100px");
        mDiv.css("padding-top", "0px");
        mDiv.css("width", "95px");
        mDiv.css("margin-top", "2px");
        mDiv.css("margin-right", "5px");
        mDiv.addClass("border");
        mDiv.attr("title", "");


        $(".modifierImage", mDiv).css("border", "none");
        $(".modifierImage", mDiv).removeAttr("title");

        $(".modifierText", mDiv).css("padding-bottom", "6px");
        $(".modifierText", mDiv).css("text-align", "center");


        /*            
		    +10% Administration I
		    +20% Administration II
		    ---------------------
		    30% Gesamt		    
        */ 
        var Tooltip = $("<div/>");
        var modifierName = $('<span/>', { text: i18n.label(BaseDataModule.modifierName(_type)) });
        Tooltip.append(modifierName);
        Tooltip.append($("<br/>"));
        RealmStatistics.type2ToolTipLines(_type, Tooltip, false);
        //RealmStatistics.energyModifiers.add2Tooltip(Tooltip, false);
        //Tooltip.append($('<br>')).append(RealmStatistics.tooltipLine()).append($('<br>'));
        Tooltip.append($('<span>', { text: i18n.label(727) + amount.toFixed(1) + "%" })); //Total Energy 


        mDiv.tooltip({ content: function () { return Tooltip.html(); } });

        
        return mDiv;
    }

    export function setResearchTreeHeader() {
        var researchPointsGain = ResearchModule.CountResearchGeneration();
        researchPointsGain = researchPointsGain *  (1.0 + (RealmStatistics.researchModifiers.getFullModifierSum() / 100.0 ));
        researchPointsGain = Math.ceil(researchPointsGain);


        var researchHeader = i18n.label(180) + ' ' + mainObject.user.researchPoints.toString() + i18n.label(182).format(researchPointsGain.toString());
        $(".relPopupHeader span", researchTreeContainer).addClass('researchPoints');
        $(".relPopupHeader span", researchTreeContainer).text(researchHeader);


        var modifierDiv = $(".relPopupHeader div.modifiers", researchTreeContainer);
        modifierDiv.empty();

        modifierDiv.append(makeModifierDiv(BaseDataModule.Modificators.Assembly, RealmStatistics.assemblyModifiers.getFullModifierSum()));
        modifierDiv.append(makeModifierDiv(BaseDataModule.Modificators.Energy, RealmStatistics.energyModifiers.getFullModifierSum()));
        modifierDiv.append(makeModifierDiv(BaseDataModule.Modificators.Production, RealmStatistics.industryModifiers.getFullModifierSum()));
        modifierDiv.append(makeModifierDiv(BaseDataModule.Modificators.Research, RealmStatistics.researchModifiers.getFullModifierSum()));
       

        //add modifier divs
        /*
        var mDiv = makeModifierDiv(BaseDataModule.Modificators.Assembly,  RealmStatistics.assemblyModifiers.getFullModifierSum());
        $(".relPopupHeader", researchTreeContainer).append(mDiv);
        mDiv = makeModifierDiv(BaseDataModule.Modificators.Energy,  RealmStatistics.energyModifiers.getFullModifierSum());
        $(".relPopupHeader", researchTreeContainer).append(mDiv);
        mDiv = makeModifierDiv(BaseDataModule.Modificators.Production,  RealmStatistics.industryModifiers.getFullModifierSum());
        $(".relPopupHeader", researchTreeContainer).append(mDiv);
        mDiv = makeModifierDiv(BaseDataModule.Modificators.Research,  RealmStatistics.researchModifiers.getFullModifierSum());
        $(".relPopupHeader", researchTreeContainer).append(mDiv);
        */
    }

    function showResearchTreePanel() {
        window.scrollTo(0, 0);

        ElementGenerator.CloseAll();
        BaseDataModule.RefrehsPickState(mainObject.user);

        var _DesignerContainer = ElementGenerator.createPopup(4);

        //ElementGenerator.adjustPopupZIndex(_DesignerContainer, 30000);
        ElementGenerator.makeBig(_DesignerContainer);
        researchTreeContainer = _DesignerContainer;
        researchTreeContainer.appendTo("body"); //attach to the <body> element    

        $('.relPopupPanel', researchTreeContainer).addClass("mediumTransparent");

        var panelHeader = $('.relPopupHeader', researchTreeContainer);
        var caption = $('<h2/>', { text: i18n.label(138), style: "float:left" });
        panelHeader.append(caption);
        panelHeader.append($("<span/>", { "style": "position: relative; margin-left: 7px;float: left;top: 20px;" }));
        panelHeader.append($("<div/>", { "class": "modifiers" }));

        var panelBody = $('.relPopupBody', researchTreeContainer);
        panelBody.removeClass("trHighlight").addClass("tdHighlight");
        panelBody.addClass("researchTree");
        
        

        var tabDiv = $("<div id='tabs'/>");
        panelBody.append(tabDiv);
        var researchDiv1 = $("<div id='tab1' class='researchTreePanel' />");       
        tabDiv.append(researchDiv1);


        //set height of researchDivs and get the svgHeight
        var panelFooter = $('.relPopupFooter', researchTreeContainer);
        var maxDivHeight = (panelFooter.offset().top - researchDiv1.offset().top) - 45;
        //researchDiv1.height(maxDivHeight);
       
        ResearchModule.svgHeight = maxDivHeight - 50;
        
        /*
        Helpers.Log("researchDiv1.height " + researchDiv1.height());
        Helpers.Log("researchDiv1.offset().top " + researchDiv1.offset().top);
        Helpers.Log("tabUl.height " + tabUl.height());
        Helpers.Log("tabUl.offset().left " + tabUl.offset().left);
        Helpers.Log("tabUl.offset().top " + tabUl.offset().top);
        Helpers.Log("tabUl.offset().top " + tabUl.offset().top);
        Helpers.Log("panelFooter.height " + panelFooter.height());
        Helpers.Log("panelFooter.offset().left " + panelFooter.offset().left);
        Helpers.Log("panelFooter.offset().top " + panelFooter.offset().top);
        Helpers.Log("panelFooter.offset().top " + panelFooter.offset().top);
        */
       
        UpdateAll();        
   
        $('.noButton', researchTreeContainer)[0].style.display = 'none';      
        $('.yesButton span', researchTreeContainer).text(i18n.label(206));     
       
        $('.yesButton', researchTreeContainer).click((e: JQueryEventObject) => { ResearchModule.researchTreeContainer.remove(); });
      
        //$('#loader')[0].style.display = 'none';

        setResearchTreeHeader();       
    }

    export function tabActive(event, ui) {
      
        switch (ui.newTab.index()) {
            case 0: showResearchTreeDiv($("#tab1", researchTreeContainer), 1); break;
            case 1: showResearchTreeDiv($("#tab2", researchTreeContainer), 2); break;
            case 2: showResearchTreeDiv($("#tab3", researchTreeContainer), 3); break;
            case 3: showResearchTreeDiv($("#tab4", researchTreeContainer), 4); break;
        }

        showResearchTreeDiv($("#tab1", researchTreeContainer), 1);
        showResearchTreeDiv($("#tab2", researchTreeContainer), 2);
        showResearchTreeDiv($("#tab3", researchTreeContainer), 3);
        showResearchTreeDiv($("#tab4", researchTreeContainer), 4);
    }
    
    export function UpdateAll() {        
        if (researchTreeContainer == null) return;

        showResearchTreeDiv($("#tab1", researchTreeContainer), 1);    
        RealmStatistics.checkUserModifiers();
        ResearchModule.setResearchTreeHeader();
        if (researchTreeContainer == null) return;

    }

    
    function SVG(tag : string) : Element {
        return document.createElementNS('http://www.w3.org/2000/svg', tag);
    }

    function researchColor(research: BaseDataModule.Research): string {
        /*
        //these gradient were created in the svg:
        "gradBlue", 
        "gradGreen",
        "gradRed"
        "gradViolet"        
        "gradDarkGreen"
        */
        if (PlayerData.PlayerResearchFind(research.id).isCompleted) return "#gradDarkGreen";
        if (PlayerData.PlayerResearchFind(research.id).researchable) return "#gradGreen";
        if (research.NeedsAdditionalSpecResearch()) return "#gradRed";
        return "#gradBlue";

        //if (PlayerData.PlayerResearchFind(research.id).isCompleted) return "#gradBlue";
        //if (PlayerData.PlayerResearchFind(research.id).researchable) return "#gradGreen";      
        //return "#gradViolet";
    }

    function researchColor2(research: BaseDataModule.Research): string {
        if (PlayerData.PlayerResearchFind(research.id).isCompleted) return "#1919FF";
        if (PlayerData.PlayerResearchFind(research.id).researchable) return "#00FF00"
        return "#FF0066";
    }

    function appendGradient(def: JQuery, newId : string,  gradientColor1 : string, gradientColor2 : string) {
        var myLinearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        myLinearGradient.setAttribute("id", newId);
        myLinearGradient.setAttribute("x1", "0%");
        myLinearGradient.setAttribute("x2", "100%");
        myLinearGradient.setAttribute("y1", "0%");
        myLinearGradient.setAttribute("y2", "0%");
        def.append($(myLinearGradient));

        //stops
        var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop1.setAttribute("id", "myStop1");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", gradientColor1);
        myLinearGradient.appendChild(stop1);

        var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop2.setAttribute("id", "myStop2");
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("stop-color", gradientColor2);
        myLinearGradient.appendChild(stop2);
    }

    function appendFilter(def: JQuery) {
        /*
        <filter xmlns="http://www.w3.org/2000/svg" id="dropshadow" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/> 
          <feOffset dx="2" dy="2" result="offsetblur"/> 
          <feMerge> 
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/> 
          </feMerge>
        </filter>
            */

        var Filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        Filter.setAttribute("id", "dropshadow");
        Filter.setAttribute("height", "130%");

        var Blur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
        Blur.setAttribute("in", "SourceAlpha");
        Blur.setAttribute("stdDeviation", "3");
        Filter.appendChild(Blur);

        var Offset = document.createElementNS("http://www.w3.org/2000/svg", "feOffset");
        Offset.setAttribute("dx", "2");
        Offset.setAttribute("dy", "2");
        Offset.setAttribute("result", "offsetblur");
        Filter.appendChild(Offset);

    }


    //complete the selected research 
    function addTreeResearchClickEvent(_research: PlayerData.PlayerResearches, _rect: JQuery) {
        _rect.click((e) => { DialogWindows.ShowPlayerResearchDetail(_research, UpdateAll); });
        //Helpers.Log("c");
        //_rect.click((e) => { Helpers.Log("researchSelected " + _research.id); _research.selected(updateTree); ResearchModule.setResearchTreeHeader(); });
        return;
    }

    //ToDo: open details page
    function addTreeImageClickEvent(_research: BaseDataModule.Research, _rect: JQuery) {
        //_rect.click((e) => { Helpers.Log("researchSelected " + _research.id); ResearchModule.getResearch(_research.id).selected(updateTree); });
        return;
    }



    function showResearchTreeDiv(researchDiv: JQuery, mode: number) {

        researchDiv.empty();
                      
        var svg = $(SVG("svg"));
        svg.attr('width', "5210px")
            .attr('height', ResearchModule.svgHeight + "px");


        var def1 = $(SVG("defs") as HTMLElement);
        svg.append($(def1));

        appendGradient(def1, "gradBlue" + mode, "White", "#1919FF");
        appendGradient(def1, "gradGreen" + mode, "White", "#00FF00");
        appendGradient(def1, "gradRed" + mode, "White", "#FF0033");
        appendGradient(def1, "gradViolet" + mode, "White", "#FF0066");
        appendGradient(def1, "gradDarkGreen" + mode, "#00FF00", "#008800");

        for (var i = 0; i < BaseDataModule.researches.length; i++) {
            var Research = BaseDataModule.researches[i];
            if (BaseDataModule.researches[i] == null) continue;
            //if (BaseDataModule.researches[i].researchType !== mode && BaseDataModule.researches[i].researchType !== 0) continue;
            if (BaseDataModule.researches[i].researchType !== 0 && BaseDataModule.researches[i].treeColumn == 0) continue;

            if (Research.NeedsAdditionalSpecResearch()) continue;

            var fontSize    = 14;
            var rectHeight = 55;
            var rectWidth = 220;
            var columnGap = 40; //distance between two column
            var rowGap = 6;

            // Raster in Inkscape: Origin x: -20,0000 y:377,0000 || Distance X : 260,0000, Distance Y:61,0000

            var researchSelected = BaseDataModule.researches[i];
            var x = researchSelected.treeColumn * (rectWidth + columnGap);
            var y = researchSelected.treeRow * ((rectHeight + rowGap) / 2);

            //create rectangle 
            var color = researchColor(BaseDataModule.researches[i]);

            var group = $(SVG("g")); //document.createElementNS("http://www.w3.org/2000/svg", "rect");             
            group.attr('id', 'r'+BaseDataModule.researches[i].id)


            //var color = "#101010"
            var rectElement = $(SVG("rect") as HTMLElement); //document.createElementNS("http://www.w3.org/2000/svg", "rect");             
            //rectElement.attr('fill', color)
            rectElement.attr('fill', "url(" + color + mode + ")");

            //if (Helpers.get_browser() == "Firefox")
            //    rectElement.attr('fill', researchColor2(BaseDataModule.researches[i]));
            
            rectElement.attr('width', rectWidth + "px")
                .attr('height', rectHeight + "px")
                .attr('x', x)
                .attr('y', y)
                .attr('title', '');
            /*rectElement.attr('fill', researchColor2(BaseDataModule.researches[i]))
                .attr('width', rectWidth + "px")
                .attr('height', rectHeight + "px")
                .attr('x', x)
                .attr('y', y)
                .attr('title', '')
            */
            
            var userResearch = PlayerData.PlayerResearchFind(i);                 
            //rectElement.click((e) => { Helpers.Log("researchSelected " + researchSelected.id) ; ResearchModule.getResearch(researchSelected.id).selected(updateTree); });
            group.append(rectElement);

            //Tooltip von der Forschung: erlaubte Gebäude, Module, Rümpfe + Kosten der Forschung - closure
            (() => {
                var rectTooltip = $("<div/>", { "text": i18n.label(researchSelected.labelDescription) });
                rectTooltip.html(researchSelected.TooltipText());
                rectElement.tooltip({ "content": function () { return rectTooltip.html(); }, "position": { "my": "left+85 top+50", "at": "right center" } });
            })();
            


            //header
            var name = $(SVG("text") as HTMLElement);
            var tspan = $(SVG("tspan") as HTMLElement);
            var fixedSize = fontSize;
            if (i18n.label(BaseDataModule.researches[i].label).length > 26) fixedSize = fontSize - 2;
            tspan.attr('font-size', fixedSize + "px")
                .attr('fill', "rgb(0,0,0)")
                .attr('stroke', "none")
                .attr('x', x + 3)
                .attr('y', y + fontSize + 3)
           
            tspan.append(document.createTextNode(i18n.label(BaseDataModule.researches[i].label ))); 
            name.append(tspan);
            group.append(name);

            var costs = $(SVG("text"));
            var tspan2 = $(SVG("tspan"));
            var costWidth = 10;
            if (BaseDataModule.researches[i].cost > 999) costWidth = 32;
            else if (BaseDataModule.researches[i].cost > 99) costWidth = 24;
            else if (BaseDataModule.researches[i].cost > 9) costWidth = 17;
 

            tspan2.attr('font-size', fontSize + "px")
                .attr('fill', "rgb(0,0,0)")
                .attr('stroke', "none")
                .attr('x', x + rectWidth - costWidth)
                .attr('y', y + fontSize + 3)

            tspan2.append(document.createTextNode(BaseDataModule.researches[i].cost.toString() )); 
            costs.append(tspan2);
            group.append(costs);

                //Todo: remove outcommented
            //if (!userResearch.isCompleted && userResearch.researchable) {
                addTreeResearchClickEvent(userResearch, rectElement);
                addTreeResearchClickEvent(userResearch, name);
            //}

            //splitter - line inside rect element to distinguish name from benefits
            var splitter = $(SVG("line"));
            splitter.attr('fill', "none")
                .attr('stroke', "rgb(0,0,0)")
                .attr('x1', x + 5)
                .attr('y1', y + fontSize + 6)
                .attr('x2', x + rectWidth - 5)
                .attr('y2', y + fontSize + 6);
            group.append(splitter);
            //<path fill = "none" stroke = "rgb(0,0,0)" d ="M 6100,9200 L 9070,9200"/>
            //<line x1="0"  y1="10" x2="0"   y2="100" style="stroke:#006600;"/>

            
            var connections = BaseDataModule.getObjectRelationTargets(BaseDataModule.researches[i]);
            //conection lines between depending researches
            //not added to the group!
            for (var j = 0; j < connections.length; j++) {
                if (connections[j].targetType != ObjectTypes.Research) continue;
                var targetResearch = <BaseDataModule.Research> BaseDataModule.getRelationObject(connections[j].targetType, connections[j].targetId);
                
                if (targetResearch.treeColumn == 0) continue; //will not happen anymore once sql data is correct

                if (targetResearch.NeedsAdditionalSpecResearch()) continue;

                var x2 = targetResearch.treeColumn * (rectWidth + columnGap);
                var y2 = targetResearch.treeRow * ((rectHeight + rowGap) / 2);

                var relationLine = $(SVG("line"));
                relationLine.attr('fill', "none")
                    .attr('stroke', "rgb(66,66,66)")
                    .attr('stroke-width', 2)
                    .attr('x1', x + rectWidth)
                    .attr('y1', y + (rectHeight / 2))
                    .attr('x2', x2)
                    .attr('y2', y2 + (rectHeight / 2));
                svg.append(relationLine);
            }

            //images inside the new rect
            var imageCounter = 0;
            var imageWidth = 32;
            var imageGap = 3;
            for (var j = 0; j < connections.length; j++) {
                
                //use only buildings, shipHulls and shipModules
                if (connections[j].targetType == ObjectTypes.Research || connections[j].targetType == ObjectTypes.Quest) continue;

                //<image x="20" y="20" width="300" height="80" xlink: href ="http://jenkov.com/images/layout/top-bar-logo.png" / >
                var imageX = imageGap + (imageCounter * (imageWidth + imageGap));
                var imageObject = BaseDataModule.getRelationObject(connections[j].targetType, connections[j].targetId);
                var imagePath = BaseDataModule.getRelationObjectImage(imageObject);

                var svgImage = SVG("image");
                var image = $(svgImage);    
                image.attr('x', x + imageX)
                    .attr('y', y + fontSize + 8)
                    .attr('width', imageWidth)
                    .attr('height', imageWidth)
                    .attr('title', BaseDataModule.getRelationObjectName(connections[j].targetType, connections[j].targetId));               
                svgImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imagePath);
                //image.tooltip();
                /*image.tooltip({
                    "position": { "my": "left+15 top+30", "at": "right center" }
                    , "content": function () {
                        var element = $(this);
                        return element.attr("title");
                    }
                });
                */

                image.tooltip(BaseDataModule.getRelationObjectTooltip(connections[j].targetType, connections[j].targetId));  
                group.append(image);
                imageCounter++;
            }

            //draw Research Gain information: 
            if (BaseDataModule.researchGainExists(BaseDataModule.researches[i].id)) {
                var researchGain = BaseDataModule.getResearchGain(BaseDataModule.researches[i].id);
                var imageX = imageGap + (imageCounter * (imageWidth + imageGap));
                //var imageObject = BaseDataModule.getRelationObject(connections[j].targetType, connections[j].targetId);
                var imagePath = mainObject.imageObjects[researchGain.objectId].texture.src;

                var svgImage = SVG("image");
                var image = $(svgImage);
                image.attr('x', x + imageX)
                    .attr('y', y + fontSize + 8)
                    .attr('width', imageWidth)
                    .attr('height', imageWidth)
                    .attr('title', i18n.label(mainObject.imageObjects[researchGain.objectId].label));
                svgImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imagePath);
                //image.tooltip();
                /*image.tooltip({
                    "position": { "my": "left+15 top+30", "at": "right center" }
                    , "tooltipClass": "toolTipResearchGain"
                    , "content": function () {
                        var element = $(this);
                        return element.attr("title");}
                });
                */
                image.tooltip(researchGain.createToolTip());
                group.append(image);
                imageCounter++;
            }

            svg.append(group);

        }
        researchDiv.append(svg);
    }


    new researchTreePanel();
}