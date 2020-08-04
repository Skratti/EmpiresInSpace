
module Scripts {

    export var scriptsAdmin: ScriptAdministrator;

    export class Script {

        id: number;       
        type: number;   //0 = Quest, 1 = Building, 2 = Research.js, 3 ShipTemplateDesigner, 4 Details , 5 ResearchTree
        
        constructor(_type: number, _id : number) {
            this.type = _type;
            this.id = _id;
        }

        //replaced by its childs
        run() {
            //Helpers.Log('Script Id: ' + this.id.toString());
        }
    }


    export class ScriptWithWindow extends Script {
        scriptHeader: string;
        scriptBody: JQuery;

        popup: JQuery;       
        body: JQuery;
        scriptWindow: ElementGenerator.WindowManager;

        constructor(_type: number, _id: number) {
            super(_type, _id);

            Scripts.scriptsAdmin.scripts.push(this); // so that the script will not be loaded again
          
        }

        run() {

            //generate window and set panels
            this.scriptWindow = new ElementGenerator.WindowManager(null, null, null);  // e => { this.removeQuestWindow(); });
            this.popup = this.scriptWindow.element;
            this.body = $('.relPopupBody', this.scriptWindow.element);

            //make draggable
            this.scriptWindow.element.draggable({ containment: "#canvas1" });
            $(".semiTransOverlay", this.scriptWindow.element).css("display", "none");
          
            //add layout
            this.body.addClass("ScriptWithWindowBody");
            this.body.addClass("relTutorialPopup");

            //set draggable starting pos
            var newPos: PanelPosition = ElementGenerator.calculateLeftTopPosition({ Width: 420, Height: 503 });
            this.scriptWindow.element.css('left', newPos.Left + 'px');
            this.scriptWindow.element.css('top', newPos.Top + 'px');
            this.scriptWindow.element.css('margin-left', '0px');  

            //set buttons
            $('.noButton span', this.scriptWindow.element).text(i18n.label(332));
            $('.yesButton span', this.scriptWindow.element).text(i18n.label(206));

            /*
            if (ElementGenerator.currentPanel != null)
                this.scriptWindow = new ElementGenerator.WindowManager(ElementGenerator.currentPanel);
            else
                this.scriptWindow = new ElementGenerator.WindowManager(null);

            this.scriptWindow.setHeader(this.scriptHeader);
            this.body = $('.relPopupBody', this.scriptWindow.element);
            
            this.body.append(this.scriptBody);

            this.popup = this.scriptWindow.element;

            $('.noButton span', this.scriptWindow.element).text(i18n.label(332));
            $('.yesButton span', this.scriptWindow.element).text(i18n.label(206));

            //this.body.css("font-size", "1.1em");
            this.body.addClass("ScriptWithWindowBody");
            */
        }
         
    }

    export class QuestScript extends Script {
        name: string;
        titleLabel: number;
        questPopup: JQuery;
        quest: QuestModule.Quest;
        

        constructor(_type: number, _id: number) {
            super(_type, _id);
            
        }

        finishQuest() {
            this.quest.introQuestCompleted();
        }

        //Scripts are loaded without parameter - thus the existing Quest-object has to be linked to this quest by the loaded script
        checkQuestReference() {
            if (QuestModule.questExists(this.id)) {
                this.quest = QuestModule.getQuest(this.id);
                this.quest.script = this;                
            }
        }

        closeQuest() {
            mainObject.keymap.isActive = false;
        }
    }

    export class QuestRunScript extends QuestScript {
        questHeader: string;
        questBody: JQuery; //is set in the various constructors of child-classes, and then appended in the run method to the bodyElement of the panel
        questWindow: ElementGenerator.WindowManager;

        constructor(_type: number, _id: number, headerLabel?: number, bodyLabel?: number) {
            super(_type, _id);

            if (headerLabel) this.questHeader = i18n.label(headerLabel);
            if (bodyLabel) this.questBody = $(i18n.label(bodyLabel));

            Scripts.scriptsAdmin.scripts.push(this); // so that the script will not be loaded again
            //updates questReferences
            this.checkQuestReference();

            if (!this.quest.isRead || QuestModule.readNextLoadedQuest) {
                this.run();
                this.quest.questIsRead();
            }
        }    

        run() {
            //if (ElementGenerator.currentPanel != null)
            //    this.questWindow = new ElementGenerator.WindowManager(ElementGenerator.currentPanel, null, e => { this.removeQuestWindow(); }  );
            //else
            this.questWindow = new ElementGenerator.WindowManager(null, null, e => { this.removeQuestWindow(); } );

            this.questWindow.element.draggable({ containment: "#canvas1" });
            $(".semiTransOverlay", this.questWindow.element).css("display", "none");

            this.questWindow.setHeader(this.questHeader);
            var panelBody = $('.relPopupBody', this.questWindow.element);  
            panelBody.append(this.questBody);

            this.questPopup = this.questWindow.element;
            
            $('.noButton span', this.questWindow.element).text(i18n.label(332));
            $('.yesButton span', this.questWindow.element).text(i18n.label(206));
            

            this.setYesButton(this.questWindow.element);
            this.setNoButton(this.questWindow.element);

         
            panelBody.addClass("ScriptWithWindowBody");

            this.questWindow.element.addClass("relTutorialPopup");

            var newPos: PanelPosition = ElementGenerator.calculateLeftTopPosition({ Width: 420, Height: 503 });
            this.questWindow.element.css('left', newPos.Left + 'px');
            this.questWindow.element.css('top', newPos.Top + 'px');
            this.questWindow.element.css('margin-left', '0px');  
            
        }

        //event that is attached to the questWindows remove method
        removeQuestWindow() {
            if (this.quest.hasScript && !this.quest.isCompleted) {
                this.quest.showCreateIcon();
            }
            this.questWindow = null;
        }
         
        //overloaded - quest is not completed when a check is needed
        setYesButton(questContainer : JQuery) {
            $('.yesButton, .bX', questContainer).unbind('click').click(
                (e: JQueryEventObject) => {
                    if (!this.quest.isCompleted) {
                        this.quest.introQuestCompleted();                        
                    }
                    //questContainer.remove();
                    this.questWindow.remove();
                });
        }

        setNoButton(questContainer: JQuery) {
            $('.noButton', questContainer)[0].style.display = 'none';
        }

        finishQuest() {
            if (this.questWindow != null) {
                Helpers.Log("closing quest on finish");
                this.questWindow.remove();
            }
            super.finishQuest();
        }

    }

    export class QuestWithCheckScript extends QuestRunScript {

        

        checkProxy: (x,y,z) => void;
        eventHandler: any[];        // is set in the constructor of each quest to the appropriate eventhandler in the QuestModule namespace
        checkArrayIndex: number;    // is set in the constructor when the check method is pushed to the eventhandler

        constructor(_type: number, _id: number, _eventHandler: any[], headerLabel?: number, bodyLabel?: number) {
            super(_type, _id, headerLabel, bodyLabel);
            this.eventHandler = _eventHandler;

            if (headerLabel) this.questHeader = i18n.label(headerLabel);
            if (bodyLabel) this.questBody = $(i18n.label(bodyLabel));

            //creates a proxy for the check-method, so that its scope remains on this object
            //and put the check method into its corresponding Eventhandler
            this.checkProxy = $.proxy(<any>this.check, this);

            if (!this.quest.isCompleted) {
                this.checkArrayIndex = this.eventHandler.push(this.checkProxy) - 1;
            }
            
        }

        
        setYesButton(questContainer: JQuery) {
            $('.yesButton', questContainer).unbind('click').click((e: JQueryEventObject) => {
                //questContainer.remove();                
                this.questWindow.remove();                
            });
        }
        

        setNoButton(questContainer: JQuery) {
            $('.noButton', questContainer).click((e: JQueryEventObject) => {
                this.finishQuest();
                //questContainer.remove();
                this.questWindow.remove();
            });
        }

        finishQuest() {
            if (!this.quest.isCompleted) {
                super.finishQuest();
                this.eventHandler.splice(this.checkArrayIndex, 1);
                this.quest.icon.css("display", "none");
                if (this.questWindow) this.questWindow.remove();
            }
        }

        check(x,y,z) {
        }

    }


    export class ScriptAdministrator {

        scripts: Script[] = [];

        constructor() {
        }

        //type = 0 quest, 1 building,2 1 , Research,  3 1 ShipTemplateDesigner, 4 1 ShipDetails
        scriptIndex(scriptType: number, scriptId: number): number {
            for (var i = 0; i < this.scripts.length; i++) {
                if (this.scripts[i] && this.scripts[i].id === scriptId && this.scripts[i].type === scriptType) return i;
            }
            return -1;
        }

        private find(scriptType: number, scriptId: number): Script {
            for (var i = 0; i < this.scripts.length; i++) {
                if (this.scripts[i] && this.scripts[i].id === scriptId && this.scripts[i].type === scriptType) return this.scripts[i];
            }
            return null;
        }
      

        //if script was already loaded, run that script, else loads and then run (scripts run themselves once during loading!)
        //ToDo: a better way would be to handle that async load with a local function which remembers the parameters with which to call the target JS. The targetJS would, after loading, call this local function and that would in turn call the run method
        //new test with ajax.getScript - now we can use callbacks...
        //two methods of loading are implementded here - $.ajax and appending a HTMLScriptElement to the head of the document
        loadAndRun(scriptType: number, scriptId: number, scriptFilePath: string, loader?: boolean, callbackFunc?: (x?:any) => any ) {

            if (loader) $('#loader')[0].style.display = 'block';

            if (this.scriptIndex(scriptType, scriptId) > -1) {
                //Helpers.Log('Run Script Id: ' + scriptId.toString());
                if (callbackFunc)
                    callbackFunc();
                else
                    this.find(scriptType, scriptId).run();//this.find(scriptType, scriptId));                
                return;
            }
            //Helpers.Log('loadAndRun Script ' + scriptType + ' Id: ' + scriptId.toString());            


            //the good thing is that we have a callBack, the bad thing is that debugging with eval might be more work than loaded JS-files...
            if (callbackFunc) {
                var path = ScriptPath + scriptFilePath + "?version=" + <any>version;
                //Helpers.Log("jQuery.getScript(path) " + path);
                $.ajax({ //
                    cache: false,
                    dataType: "script",
                    url: path,
                    success: callbackFunc
                });
                
                return;
            }

            //standard loading of code by injecting into head element
            var head = document.getElementsByTagName("head")[0];
            var s = <HTMLScriptElement> document.createElement("script");
            //version = (new Date().getTime()).toString();
            s.src = ScriptPath + scriptFilePath + "?version=" + <any>version;
            head.appendChild(s);                        
        }              

    }

    export function initScriptAdmin() {
        scriptsAdmin = new ScriptAdministrator();
    }

}