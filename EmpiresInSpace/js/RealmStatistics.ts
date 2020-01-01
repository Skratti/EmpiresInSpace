//contains "soft"-data : aggregates, calculations and so on derived from "hard"-data
//atm only modifiers
module RealmStatistics {

    export enum ModifierTypes {
        Research = 1,
        Quest = 2,
        Building = 3,
        Ressource = 4,
        Race = 5,
        FleetUpkeep = 6,
        ColonyCount = 7
    };
   
    export function tooltipLine(): JQuery {
        var line = $('<span>', { text: "----------------------" });
        line.css("line-height", "60%");
        return line;
    }

    //contains an array of modifiers regarding one attribute
    export class Modifiers {
        modifiers: Modifier[] = [];

        constructor() //percentage (may be negative or positive)
        {
        }

        getFullModifierSum(): number {
            var sum = 0;
            for (var i = 0; i < this.modifiers.length; i++) {                
                sum += this.modifiers[i].value;
            }

            return sum;
        }

        getModifierSum(type: ModifierTypes): number {
            var sum = 0;
            for (var i = 0; i < this.modifiers.length; i++) {
                if (this.modifiers[i].type != type) continue;
                sum += this.modifiers[i].value;
            }

            return sum;
        }

        


        add2Tooltip(tooltip: JQuery, summed: boolean = true) {
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
                            if (this.modifiers[i].type != modifierType) continue;
                            if (this.modifiers[i].value == 0) continue;

                            addedLine = true;
                            var lineText = this.modifiers[i].value > 0 ? " +" : " ";
                            lineText += this.modifiers[i].value.toFixed(1) + "% " + i18n.label(this.modifiers[i].originLabel );
                            tooltip.append($('<span>', { text: lineText })).append($('<br>'));
                        }
                    }
                }
            }  

            if (addedLine) {
                tooltip.append(tooltipLine()).append($('<br>'));
            }
                      
        }
    }

    export var growthModifiers: Modifiers = new Modifiers();
    export var energyModifiers: Modifiers = new Modifiers();
    export var assemblyModifiers: Modifiers = new Modifiers();
    export var industryModifiers: Modifiers = new Modifiers();
    export var researchModifiers: Modifiers = new Modifiers();
    export var foodModifiers: Modifiers = new Modifiers();
    export var housingModifiers: Modifiers = new Modifiers();
    

    //a single modifier :
    export class Modifier {
        value: number;
        type: number;
        originLabel: number;

        constructor(value: number, type: number, originLabel : number) //percentage (may be negative or positive)
        {
            this.value = value;
            this.type = type;
            this.originLabel = originLabel;
        }
    }
  
    //a sum of a type :
    export class ModifierSum {
        value: number;
        type: number;

        constructor(value: number, type: number) //percentage (may be negative or positive)
        {
            this.value = value;
            this.type = type;
        }
    }

    export function type2label(type: ModifierTypes): number {
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

    export function type2ToolTipLines(type: BaseDataModule.Modificators, tooltip: JQuery, summed: boolean = true) {
        switch (type) {
            case BaseDataModule.Modificators.Research:
                researchModifiers.add2Tooltip(tooltip, summed);
                break;
            case BaseDataModule.Modificators.Assembly:
                assemblyModifiers.add2Tooltip(tooltip, summed);
                break;
            case BaseDataModule.Modificators.Housing:
                housingModifiers.add2Tooltip(tooltip, summed);
                break;
            case BaseDataModule.Modificators.Production:
                industryModifiers.add2Tooltip(tooltip, summed);
                break;
            case BaseDataModule.Modificators.Food:
                foodModifiers.add2Tooltip(tooltip, summed);
                break;
            case BaseDataModule.Modificators.Energy:
                energyModifiers.add2Tooltip(tooltip, summed);
                break;
            default:
                return;
        }
    }

    export function checkUserModifiers() {

        //reset
        growthModifiers.modifiers = [];
        energyModifiers.modifiers = [];
        assemblyModifiers.modifiers = [];
        industryModifiers.modifiers = [];
        researchModifiers.modifiers = [];
        foodModifiers.modifiers = [];
        housingModifiers.modifiers = [];

        for (var i = 0; i < mainObject.user.playerResearches.length; i++) {

            RealmStatistics.checkPlayerResearch(mainObject.user.playerResearches[i]);            
        }

        //check Ship ratio, add as modifier to assemblyPoints and research
        var shipModuleCount = 0;
        var filteredArray: Ships.Ship[] = [];
        for (var i = 0; i < mainObject.ships.length; i++) {
            
            
            if (mainObject.ships[i] == null) continue;
            if (mainObject.ships[i].owner != mainObject.user.id) continue;
            filteredArray.push(mainObject.ships[i]);           
            shipModuleCount += BaseDataModule.shipHulls[mainObject.ships[i].shipHullId].modulesCount;             
        }

        var allowedShips = mainObject.user.numberOfPossibleShips();

        var ratio = -1 * ((shipModuleCount - allowedShips) / allowedShips);
        ratio =  Math.max(Math.min(ratio, 0), -1); // get value between 0 and 1;
        ratio = ratio * 100; // get percentage       

        if (ratio != 0) {
            assemblyModifiers.modifiers.push(new Modifier(ratio, ModifierTypes.FleetUpkeep, 659));
            industryModifiers.modifiers.push(new Modifier(ratio, ModifierTypes.FleetUpkeep, 659));
            Helpers.Log("assemblyModifiers Fleet: " + ratio + "%");
        }

        //calc colony modificator
        var colonyCount = -1;
        for (var i = 0; i < mainObject.colonies.length; i++) {
            if (mainObject.colonies[i] == null) continue;
            if (mainObject.colonies[i].owner != mainObject.user.id) continue;
            colonyCount++;
        }

        if (colonyCount > 0) {
            assemblyModifiers.modifiers.push(new Modifier(colonyCount * -10, ModifierTypes.ColonyCount, 728));
            researchModifiers.modifiers.push(new Modifier(colonyCount * -10, ModifierTypes.ColonyCount, 728));
            industryModifiers.modifiers.push(new Modifier(colonyCount * -10, ModifierTypes.ColonyCount, 728));
        }

    }

    export function checkPlayerResearch(research: PlayerData.PlayerResearches) {
        if (typeof research === 'undefined') return;
        if (!research.isCompleted) return;
        if (typeof BaseDataModule.researchGains[research.id] === 'undefined') return;

        if (BaseDataModule.researchGains[research.id].growth != 0) {
            growthModifiers.modifiers.push(new Modifier(BaseDataModule.researchGains[research.id].growth, ModifierTypes.Research, BaseDataModule.researches[research.id].label));
        }

        if (BaseDataModule.researchGains[research.id].energy != 0) {
            energyModifiers.modifiers.push(new Modifier(BaseDataModule.researchGains[research.id].energy, ModifierTypes.Research, BaseDataModule.researches[research.id].label));
        }

        if (BaseDataModule.researchGains[research.id].construction != 0) {
            assemblyModifiers.modifiers.push(new Modifier(BaseDataModule.researchGains[research.id].construction, ModifierTypes.Research, BaseDataModule.researches[research.id].label));
            Helpers.Log('assembyModifiers ' + BaseDataModule.researchGains[research.id].construction);
        }

        if (BaseDataModule.researchGains[research.id].industrie != 0) {
            industryModifiers.modifiers.push(new Modifier(BaseDataModule.researchGains[research.id].industrie, ModifierTypes.Research, BaseDataModule.researches[research.id].label));
        }

        if (BaseDataModule.researchGains[research.id].research != 0) {
            researchModifiers.modifiers.push(new Modifier(BaseDataModule.researchGains[research.id].research, ModifierTypes.Research, BaseDataModule.researches[research.id].label));
        }

        if (BaseDataModule.researchGains[research.id].food != 0) {
            foodModifiers.modifiers.push(new Modifier(BaseDataModule.researchGains[research.id].food, ModifierTypes.Research, BaseDataModule.researches[research.id].label));
        }

        if (BaseDataModule.researchGains[research.id].housing != 0) {
            housingModifiers.modifiers.push(new Modifier(BaseDataModule.researchGains[research.id].housing, ModifierTypes.Research, BaseDataModule.researches[research.id].label));
        }


    }
}