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
var Scripts;
(function (Scripts) {
    var Script = /** @class */ (function () {
        function Script(_type, _id) {
            this.type = _type;
            this.id = _id;
        }
        //replaced by its childs
        Script.prototype.run = function () {
            //Helpers.Log('Script Id: ' + this.id.toString());
        };
        return Script;
    }());
    Scripts.Script = Script;
    var ScriptWithWindow = /** @class */ (function (_super) {
        __extends(ScriptWithWindow, _super);
        function ScriptWithWindow(_type, _id) {
            var _this = _super.call(this, _type, _id) || this;
            Scripts.scriptsAdmin.scripts.push(_this); // so that the script will not be loaded again
            return _this;
        }
        ScriptWithWindow.prototype.run = function () {
            //generate window and set panels
            this.scriptWindow = new ElementGenerator.WindowManager(null, null, null); // e => { this.removeQuestWindow(); });
            this.popup = this.scriptWindow.element;
            this.body = $('.relPopupBody', this.scriptWindow.element);
            //make draggable
            this.scriptWindow.element.draggable({ containment: "#canvas1" });
            $(".semiTransOverlay", this.scriptWindow.element).css("display", "none");
            //add layout
            this.body.addClass("ScriptWithWindowBody");
            this.body.addClass("relTutorialPopup");
            //set draggable starting pos
            var newPos = ElementGenerator.calculateLeftTopPosition({ Width: 420, Height: 503 });
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
        };
        return ScriptWithWindow;
    }(Script));
    Scripts.ScriptWithWindow = ScriptWithWindow;
    var QuestScript = /** @class */ (function (_super) {
        __extends(QuestScript, _super);
        function QuestScript(_type, _id) {
            return _super.call(this, _type, _id) || this;
        }
        QuestScript.prototype.finishQuest = function () {
            this.quest.introQuestCompleted();
        };
        //Scripts are loaded without parameter - thus the existing Quest-object has to be linked to this quest by the loaded script
        QuestScript.prototype.checkQuestReference = function () {
            if (QuestModule.questExists(this.id)) {
                this.quest = QuestModule.getQuest(this.id);
                this.quest.script = this;
            }
        };
        QuestScript.prototype.closeQuest = function () {
            mainObject.keymap.isActive = false;
        };
        return QuestScript;
    }(Script));
    Scripts.QuestScript = QuestScript;
    var QuestRunScript = /** @class */ (function (_super) {
        __extends(QuestRunScript, _super);
        function QuestRunScript(_type, _id, headerLabel, bodyLabel) {
            var _this = _super.call(this, _type, _id) || this;
            if (headerLabel)
                _this.questHeader = i18n.label(headerLabel);
            if (bodyLabel)
                _this.questBody = $(i18n.label(bodyLabel));
            Scripts.scriptsAdmin.scripts.push(_this); // so that the script will not be loaded again
            //updates questReferences
            _this.checkQuestReference();
            if (!_this.quest.isRead || QuestModule.readNextLoadedQuest) {
                _this.run();
                _this.quest.questIsRead();
            }
            return _this;
        }
        QuestRunScript.prototype.run = function () {
            var _this = this;
            //if (ElementGenerator.currentPanel != null)
            //    this.questWindow = new ElementGenerator.WindowManager(ElementGenerator.currentPanel, null, e => { this.removeQuestWindow(); }  );
            //else
            this.questWindow = new ElementGenerator.WindowManager(null, null, function (e) { _this.removeQuestWindow(); });
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
            var newPos = ElementGenerator.calculateLeftTopPosition({ Width: 420, Height: 503 });
            this.questWindow.element.css('left', newPos.Left + 'px');
            this.questWindow.element.css('top', newPos.Top + 'px');
            this.questWindow.element.css('margin-left', '0px');
        };
        //event that is attached to the questWindows remove method
        QuestRunScript.prototype.removeQuestWindow = function () {
            if (this.quest.hasScript && !this.quest.isCompleted) {
                this.quest.showCreateIcon();
            }
            this.questWindow = null;
        };
        //overloaded - quest is not completed when a check is needed
        QuestRunScript.prototype.setYesButton = function (questContainer) {
            var _this = this;
            $('.yesButton, .bX', questContainer).unbind('click').click(function (e) {
                if (!_this.quest.isCompleted) {
                    _this.quest.introQuestCompleted();
                }
                //questContainer.remove();
                _this.questWindow.remove();
            });
        };
        QuestRunScript.prototype.setNoButton = function (questContainer) {
            $('.noButton', questContainer)[0].style.display = 'none';
        };
        QuestRunScript.prototype.finishQuest = function () {
            if (this.questWindow != null) {
                Helpers.Log("closing quest on finish");
                this.questWindow.remove();
            }
            _super.prototype.finishQuest.call(this);
        };
        return QuestRunScript;
    }(QuestScript));
    Scripts.QuestRunScript = QuestRunScript;
    var QuestWithCheckScript = /** @class */ (function (_super) {
        __extends(QuestWithCheckScript, _super);
        function QuestWithCheckScript(_type, _id, _eventHandler, headerLabel, bodyLabel) {
            var _this = _super.call(this, _type, _id, headerLabel, bodyLabel) || this;
            _this.eventHandler = _eventHandler;
            if (headerLabel)
                _this.questHeader = i18n.label(headerLabel);
            if (bodyLabel)
                _this.questBody = $(i18n.label(bodyLabel));
            //creates a proxy for the check-method, so that its scope remains on this object
            //and put the check method into its corresponding Eventhandler
            _this.checkProxy = $.proxy(_this.check, _this);
            if (!_this.quest.isCompleted) {
                _this.checkArrayIndex = _this.eventHandler.push(_this.checkProxy) - 1;
            }
            return _this;
        }
        QuestWithCheckScript.prototype.setYesButton = function (questContainer) {
            var _this = this;
            $('.yesButton', questContainer).unbind('click').click(function (e) {
                //questContainer.remove();                
                _this.questWindow.remove();
            });
        };
        QuestWithCheckScript.prototype.setNoButton = function (questContainer) {
            var _this = this;
            $('.noButton', questContainer).click(function (e) {
                _this.finishQuest();
                //questContainer.remove();
                _this.questWindow.remove();
            });
        };
        QuestWithCheckScript.prototype.finishQuest = function () {
            if (!this.quest.isCompleted) {
                _super.prototype.finishQuest.call(this);
                this.eventHandler.splice(this.checkArrayIndex, 1);
                this.quest.icon.css("display", "none");
                if (this.questWindow)
                    this.questWindow.remove();
            }
        };
        QuestWithCheckScript.prototype.check = function (x, y, z) {
        };
        return QuestWithCheckScript;
    }(QuestRunScript));
    Scripts.QuestWithCheckScript = QuestWithCheckScript;
    var ScriptAdministrator = /** @class */ (function () {
        function ScriptAdministrator() {
            this.scripts = [];
        }
        //type = 0 quest, 1 building,2 1 , Research,  3 1 ShipTemplateDesigner, 4 1 ShipDetails
        ScriptAdministrator.prototype.scriptIndex = function (scriptType, scriptId) {
            for (var i = 0; i < this.scripts.length; i++) {
                if (this.scripts[i] && this.scripts[i].id === scriptId && this.scripts[i].type === scriptType)
                    return i;
            }
            return -1;
        };
        ScriptAdministrator.prototype.find = function (scriptType, scriptId) {
            for (var i = 0; i < this.scripts.length; i++) {
                if (this.scripts[i] && this.scripts[i].id === scriptId && this.scripts[i].type === scriptType)
                    return this.scripts[i];
            }
            return null;
        };
        //if script was already loaded, run that script, else loads and then run (scripts run themselves once during loading!)
        //ToDo: a better way would be to handle that async load with a local function which remembers the parameters with which to call the target JS. The targetJS would, after loading, call this local function and that would in turn call the run method
        //new test with ajax.getScript - now we can use callbacks...
        //two methods of loading are implementded here - $.ajax and appending a HTMLScriptElement to the head of the document
        ScriptAdministrator.prototype.loadAndRun = function (scriptType, scriptId, scriptFilePath, loader, callbackFunc) {
            if (loader)
                $('#loader')[0].style.display = 'block';
            if (this.scriptIndex(scriptType, scriptId) > -1) {
                //Helpers.Log('Run Script Id: ' + scriptId.toString());
                if (callbackFunc)
                    callbackFunc();
                else
                    this.find(scriptType, scriptId).run(); //this.find(scriptType, scriptId));                
                return;
            }
            //Helpers.Log('loadAndRun Script ' + scriptType + ' Id: ' + scriptId.toString());            
            //the good thing is that we have a callBack, the bad thing is that debugging with eval might be more work than loaded JS-files...
            if (callbackFunc) {
                var path = ScriptPath + scriptFilePath + "?version=" + version;
                //Helpers.Log("jQuery.getScript(path) " + path);
                $.ajax({
                    cache: false,
                    dataType: "script",
                    url: path,
                    success: callbackFunc
                });
                return;
            }
            //standard loading of code by injecting into head element
            var head = document.getElementsByTagName("head")[0];
            var s = document.createElement("script");
            //version = (new Date().getTime()).toString();
            s.src = ScriptPath + scriptFilePath + "?version=" + version;
            head.appendChild(s);
        };
        return ScriptAdministrator;
    }());
    Scripts.ScriptAdministrator = ScriptAdministrator;
    function initScriptAdmin() {
        Scripts.scriptsAdmin = new ScriptAdministrator();
    }
    Scripts.initScriptAdmin = initScriptAdmin;
})(Scripts || (Scripts = {}));
//# sourceMappingURL=Scripts.js.map