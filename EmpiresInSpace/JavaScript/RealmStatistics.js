//contains "soft"-data : aggregates, calculations and so on derived from "hard"-data
//atm only modifiers
var RealmStatistics;
(function (RealmStatistics) {
    var ModifierTypes;
    (function (ModifierTypes) {
        ModifierTypes[ModifierTypes["Research"] = 1] = "Research";
        ModifierTypes[ModifierTypes["Quest"] = 2] = "Quest";
        ModifierTypes[ModifierTypes["Building"] = 3] = "Building";
        ModifierTypes[ModifierTypes["Ressource"] = 4] = "Ressource";
        ModifierTypes[ModifierTypes["Race"] = 5] = "Race";
        ModifierTypes[ModifierTypes["FleetUpkeep"] = 6] = "FleetUpkeep";
        ModifierTypes[ModifierTypes["ColonyCount"] = 7] = "ColonyCount";
    })(ModifierTypes = RealmStatistics.ModifierTypes || (RealmStatistics.ModifierTypes = {}));
    ;
    function tooltipLine() {
        var line = $('<span>', { text: "----------------------" });
        line.css("line-height", "60%");
        return line;
    }
    RealmStatistics.tooltipLine = tooltipLine;
    //contains an array of modifiers regarding one attribute
    var Modifiers = /** @class */ (function () {
        function Modifiers() {
            this.modifiers = [];
        }
        Modifiers.prototype.getFullModifierSum = function () {
            var sum = 0;
            for (var i = 0; i < this.modifiers.length; i++) {
                sum += this.modifiers[i].value;
            }
            return sum;
        };
        Modifiers.prototype.getModifierSum = function (type) {
            var sum = 0;
            for (var i = 0; i < this.modifiers.length; i++) {
                if (this.modifiers[i].type != type)
                    continue;
                sum += this.modifiers[i].value;
            }
            return sum;
        };
        Modifiers.prototype.add2Tooltip = function (tooltip, summed) {
            if (summed === void 0) { summed = true; }
            var addedLine = false;
            for (var modifierTypeString in ModifierTypes) {
                var modifierType = parseInt(modifierTypeString);
                //only evaluate numbers:
                if (!isNaN(modifierType)) {
                    if (summed) {
                        var sum = this.getModifierSum(modifierType);
                        if (sum != 0) {
                            addedLine = true;
                            var sumText = sum > 0 ? " +" : " ";
                            sumText += sum.toFixed(1) + "% " + i18n.label(RealmStatistics.type2label(modifierType));
                            tooltip.append($('<span>', { text: sumText })).append($('<br>'));
                        }
                    }
                    else {
                        for (var i = 0; i < this.modifiers.length; i++) {
                            if (this.modifiers[i].type != modifierType)
                                continue;
                            if (this.modifiers[i].value == 0)
                                continue;
                            addedLine = true;
                            var lineText = this.modifiers[i].value > 0 ? " +" : " ";
                            lineText += this.modifiers[i].value.toFixed(1) + "% " + i18n.label(this.modifiers[i].originLabel);
                            tooltip.append($('<span>', { text: lineText })).append($('<br>'));
                        }
                    }
                }
            }
            if (addedLine) {
                tooltip.append(tooltipLine()).append($('<br>'));
            }
        };
        return Modifiers;
    }());
    RealmStatistics.Modifiers = Modifiers;
    RealmStatistics.growthModifiers = new Modifiers();
    RealmStatistics.energyModifiers = new Modifiers();
    RealmStatistics.assemblyModifiers = new Modifiers();
    RealmStatistics.industryModifiers = new Modifiers();
    RealmStatistics.researchModifiers = new Modifiers();
    RealmStatistics.foodModifiers = new Modifiers();
    RealmStatistics.housingModifiers = new Modifiers();
    //a single modifier :
    var Modifier = /** @class */ (function () {
        function Modifier(value, type, originLabel) {
            this.value = value;
            this.type = type;
            this.originLabel = originLabel;
        }
        return Modifier;
    }());
    RealmStatistics.Modifier = Modifier;
    //a sum of a type :
    var ModifierSum = /** @class */ (function () {
        function ModifierSum(value, type) {
            this.value = value;
            this.type = type;
        }
        return ModifierSum;
    }());
    RealmStatistics.ModifierSum = ModifierSum;
    function type2label(type) {
        switch (type) {
            case ModifierTypes.Research:
                return 641;
            case ModifierTypes.Quest:
                return 555;
            case ModifierTypes.Building:
                return 640;
            case ModifierTypes.Ressource:
                return 555;
            case ModifierTypes.Race:
                return 555;
            case ModifierTypes.FleetUpkeep:
                return 659;
            case ModifierTypes.ColonyCount:
                return 728;
            default:
                return 555;
        }
    }
    RealmStatistics.type2label = type2label;
    function type2ToolTipLines(type, tooltip, summed) {
        if (summed === void 0) { summed = true; }
        switch (type) {
            case BaseDataModule.Modificators.Research:
                RealmStatistics.researchModifiers.add2Tooltip(tooltip, summed);
                break;
            case BaseDataModule.Modificators.Assembly:
                RealmStatistics.assemblyModifiers.add2Tooltip(tooltip, summed);
                break;
            case BaseDataModule.Modificators.Housing:
                RealmStatistics.housingModifiers.add2Tooltip(tooltip, summed);
                break;
            case BaseDataModule.Modificators.Production:
                RealmStatistics.industryModifiers.add2Tooltip(tooltip, summed);
                break;
            case BaseDataModule.Modificators.Food:
                RealmStatistics.foodModifiers.add2Tooltip(tooltip, summed);
                break;
            case BaseDataModule.Modificators.Energy:
                RealmStatistics.energyModifiers.add2Tooltip(tooltip, summed);
                break;
            default:
                return;
        }
    }
    RealmStatistics.type2ToolTipLines = type2ToolTipLines;
    function checkUserModifiers() {
        //reset
        RealmStatistics.growthModifiers.modifiers = [];
        RealmStatistics.energyModifiers.modifiers = [];
        RealmStatistics.assemblyModifiers.modifiers = [];
        RealmStatistics.industryModifiers.modifiers = [];
        RealmStatistics.researchModifiers.modifiers = [];
        RealmStatistics.foodModifiers.modifiers = [];
        RealmStatistics.housingModifiers.modifiers = [];
        for (var i = 0; i < mainObject.user.playerResearches.length; i++) {
            RealmStatistics.checkPlayerResearch(mainObject.user.playerResearches[i]);
        }
        //check Ship ratio, add as modifier to assemblyPoints and research
        var shipModuleCount = 0;
        var filteredArray = [];
        for (var i = 0; i < mainObject.ships.length; i++) {
            if (mainObject.ships[i] == null)
                continue;
            if (mainObject.ships[i].owner != mainObject.user.id)
                continue;
            filteredArray.push(mainObject.ships[i]);
            shipModuleCount += BaseDataModule.shipHulls[mainObject.ships[i].shipHullId].modulesCount;
        }
        var allowedShips = mainObject.user.numberOfPossibleShips();
        var ratio = -1 * ((shipModuleCount - allowedShips) / allowedShips);
        ratio = Math.max(Math.min(ratio, 0), -1); // get value between 0 and 1;
        ratio = ratio * 100; // get percentage       
        if (ratio != 0) {
            RealmStatistics.assemblyModifiers.modifiers.push(new Modifier(ratio, ModifierTypes.FleetUpkeep, 659));
            RealmStatistics.industryModifiers.modifiers.push(new Modifier(ratio, ModifierTypes.FleetUpkeep, 659));
            Helpers.Log("assemblyModifiers Fleet: " + ratio + "%");
        }
        //calc colony modificator
        var colonyCount = -1;
        for (var i = 0; i < mainObject.colonies.length; i++) {
            if (mainObject.colonies[i] == null)
                continue;
            if (mainObject.colonies[i].owner != mainObject.user.id)
                continue;
            colonyCount++;
        }
        if (colonyCount > 0) {
            RealmStatistics.assemblyModifiers.modifiers.push(new Modifier(colonyCount * -10, ModifierTypes.ColonyCount, 728));
            RealmStatistics.researchModifiers.modifiers.push(new Modifier(colonyCount * -10, ModifierTypes.ColonyCount, 728));
            RealmStatistics.industryModifiers.modifiers.push(new Modifier(colonyCount * -10, ModifierTypes.ColonyCount, 728));
        }
    }
    RealmStatistics.checkUserModifiers = checkUserModifiers;
    function checkPlayerResearch(research) {
        if (typeof research === 'undefined')
            return;
        if (!research.isCompleted)
            return;
        if (typeof BaseDataModule.researchGains[research.id] === 'undefined')
            return;
        if (BaseDataModule.researchGains[research.id].growth != 0) {
            RealmStatistics.growthModifiers.modifiers.push(new Modifier(BaseDataModule.researchGains[research.id].growth, ModifierTypes.Research, BaseDataModule.researches[research.id].label));
        }
        if (BaseDataModule.researchGains[research.id].energy != 0) {
            RealmStatistics.energyModifiers.modifiers.push(new Modifier(BaseDataModule.researchGains[research.id].energy, ModifierTypes.Research, BaseDataModule.researches[research.id].label));
        }
        if (BaseDataModule.researchGains[research.id].construction != 0) {
            RealmStatistics.assemblyModifiers.modifiers.push(new Modifier(BaseDataModule.researchGains[research.id].construction, ModifierTypes.Research, BaseDataModule.researches[research.id].label));
            Helpers.Log('assembyModifiers ' + BaseDataModule.researchGains[research.id].construction);
        }
        if (BaseDataModule.researchGains[research.id].industrie != 0) {
            RealmStatistics.industryModifiers.modifiers.push(new Modifier(BaseDataModule.researchGains[research.id].industrie, ModifierTypes.Research, BaseDataModule.researches[research.id].label));
        }
        if (BaseDataModule.researchGains[research.id].research != 0) {
            RealmStatistics.researchModifiers.modifiers.push(new Modifier(BaseDataModule.researchGains[research.id].research, ModifierTypes.Research, BaseDataModule.researches[research.id].label));
        }
        if (BaseDataModule.researchGains[research.id].food != 0) {
            RealmStatistics.foodModifiers.modifiers.push(new Modifier(BaseDataModule.researchGains[research.id].food, ModifierTypes.Research, BaseDataModule.researches[research.id].label));
        }
        if (BaseDataModule.researchGains[research.id].housing != 0) {
            RealmStatistics.housingModifiers.modifiers.push(new Modifier(BaseDataModule.researchGains[research.id].housing, ModifierTypes.Research, BaseDataModule.researches[research.id].label));
        }
    }
    RealmStatistics.checkPlayerResearch = checkPlayerResearch;
})(RealmStatistics || (RealmStatistics = {}));
//# sourceMappingURL=RealmStatistics.js.map