interface String {
    format(...replacements: string[]): string;
    label(): string;
    isEmpty(): boolean;
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

if (!String.prototype.label) {
    String.prototype.label = function () {
        if (this.length > 0 && this.charAt(0) == '@') {
            var part = this.substring(1);
            if (isNaN(parseInt(part, 10))) return this;

            return (i18n.label(parseInt(part, 10)));        
        }
        
        return this;        
    };
}

if (!String.prototype.isEmpty) {
    String.prototype.isEmpty = function () {
        return (this.length === 0 || !this.trim());
    };
}

function stringIsInt(valueString): boolean {
    if (valueString.toString().match(/^(\d)/) != null) {        
        return true;
    }
    else {
        return false;
    }
}


function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        })
    });
}

interface ShipModuleStatistics {
    energy: number;
    crew: number;

    scanRange: number;
    attack: number;
    defense: number;
    hitpoints: number;
    damagereduction: number;

    systemMovesPerTurn: number;
    galaxyMovesPerTurn: number;
    systemMovesMax: number;
    galaxyMovesMax: number;

    cargoroom: number;
    fuelroom: number;

    special: number;
}

class ShipTemplateStatistics implements ShipModuleStatistics {
    energy: number;
    crew: number;

    scanRange: number;
    scanEffectivity: number;
    attack: number;
    defense: number;
    hitpoints: number;
    damagereduction: number;

    systemMovesPerTurn: number;
    galaxyMovesPerTurn: number;
    systemMovesMax: number;
    galaxyMovesMax: number;

    cargoroom: number;
    fuelroom: number;

    special: number;

    shipHullId: number;
    shipHullsImage: number;
    isColonizer: boolean;
    neededEnergy: number;
    neededCrew: number;
    name: string;
    id: number;
    isSaved: boolean;

    modulePositions: Ships.ModulePosition[];

    getFactor(baseValue: number, count: number, factor: number) : number  {
        return Math.pow(factor, count - 1); //will lead to 1 scanner = 100%
    }

    applyFactor(baseValue: number, count: number, factor: number): number {
        var factor2 = count > 1 ? this.getFactor(baseValue, count, factor) : 1;
        return count > 1 ? Math.ceil(baseValue * factor2) : baseValue;
    }

    recalcStats() {
        this.crew = 0; this.energy = 0; this.neededCrew = 0; this.neededEnergy = 0;
        this.systemMovesPerTurn = 0; this.systemMovesMax = 0; this.galaxyMovesPerTurn = 0; this.galaxyMovesMax = 0;
        this.cargoroom = 0; this.fuelroom = 0;
        this.attack = 0; this.defense = 0; this.hitpoints = 0; this.damagereduction = 0;
        this.scanRange = 0; this.scanEffectivity = 1;
        this.isColonizer = false;

        //calc speedfactor and add hullGain to the statistics
        var hull = BaseDataModule.shipHulls[this.shipHullId];
        var numberModules = hull.modulePositions.length;
        numberModules = numberModules == 0 ? 1 : numberModules;
        var speedFactor = (1.0 / numberModules) * hull.speedFactor;
        this.changeModuleInTemplate(hull, 1, speedFactor);

        //add modulesGain to the statistics and count scann-modules
        var scanners = 0;
        var shield = 0;
        var armor = 0;
        for (var i = 0; i < this.modulePositions.length; i++) {
            if (this.modulePositions[i] === undefined || this.modulePositions[i] === null) continue;
            this.changeModuleInTemplate(this.modulePositions[i].shipmodule, 1, speedFactor);
            if (this.modulePositions[i].shipmodule.scanRange > 0) scanners++;
            if (this.modulePositions[i].shipmodule.damagereduction > 0) shield++;
            if (this.modulePositions[i].shipmodule.hitpoints > 0) armor++;
        }

        //reduce ScanRange according to shipHull-type and amount of scanners on board
        /*
        if (scanners > 0) {
            var factor = this.isSpaceStation() ? 0.85 : 0.8; // 15% - 20%
            factor = Math.pow(factor, scanners - 1); //will lead to 1 scanner = 100%
            this.scanEffectivity = factor;
            this.scanRange = Math.ceil(this.scanRange * this.scanEffectivity);
        }
        */
        //some modules loose efficiency when multiples are built in:
        var scannerFactorShip = 0.8;
        var scannerFactorStation = 0.85;
        var shieldFactor = 0.7;
        var armorFactor = 1;

        this.scanEffectivity = scanners > 1 ? this.getFactor(this.scanRange, scanners, this.isSpaceStation() ? scannerFactorStation : scannerFactorShip) : 1;

        this.scanRange = this.applyFactor(this.scanRange, scanners, this.isSpaceStation() ? scannerFactorStation : scannerFactorShip);        
        this.hitpoints = this.applyFactor(this.hitpoints, armor, armorFactor);
        this.damagereduction = this.applyFactor(this.damagereduction, shield, shieldFactor);

        if (this.systemMovesMax == 0) { this.defense = 0; }
        else {
            this.defense += this.systemMovesMax / 10;
        }

        //apply movement reduction according to number of cargo modules
        var CargoFactor = Math.min(1, 1.6 - hull.speedFactor);
        for (var i = 0; i < this.modulePositions.length; i++) {
            if (this.modulePositions[i] === undefined || this.modulePositions[i] === null) continue;
            if (this.modulePositions[i].shipmodule.cargoroom == 0) continue;

            this.galaxyMovesMax = Math.round(this.galaxyMovesMax * CargoFactor);
            this.systemMovesMax = Math.round(this.systemMovesMax * CargoFactor);
            this.galaxyMovesPerTurn = Math.round(this.galaxyMovesPerTurn * CargoFactor);
            this.systemMovesPerTurn = Math.round(this.systemMovesPerTurn * CargoFactor);
        }
    }

    changeModuleInTemplate(shipModule: ShipModuleStatistics, factor: number, speedFactor = 1) {
        if (shipModule.crew > 0) this.crew += shipModule.crew * factor; else this.neededCrew -= shipModule.crew * factor;
        if (shipModule.energy > 0) this.energy += shipModule.energy * factor; else this.neededEnergy -= shipModule.energy * factor;
        this.systemMovesPerTurn += shipModule.systemMovesPerTurn * factor * speedFactor;
        this.systemMovesMax += shipModule.systemMovesMax * factor * speedFactor * 5;
        this.galaxyMovesPerTurn += shipModule.galaxyMovesPerTurn * factor * speedFactor;
        this.galaxyMovesMax += shipModule.galaxyMovesMax * factor * speedFactor * 5;
        this.cargoroom += shipModule.cargoroom * factor;
        this.fuelroom += shipModule.fuelroom * factor;


        this.attack += shipModule.attack * factor;
        this.defense += shipModule.defense * factor;
        this.hitpoints += shipModule.hitpoints * factor;
        this.damagereduction += shipModule.damagereduction * factor;

        this.scanRange += shipModule.scanRange * factor;

        if (shipModule.special == 1) this.isColonizer = true;
    }

    removeModuleAtPosition(targetPosition: Ships.ModulePosition) {
        this.isSaved = false;
        for (var i = 0; i < this.modulePositions.length; i++) {
            if (this.modulePositions[i].posX === targetPosition.posX && this.modulePositions[i].posY === targetPosition.posY) {
                this.modulePositions.splice(i, 1);
                return;
            }
        }
    }
    modulePositionExists(posX: number, posY: number): boolean {
        for (var i = 0; i < this.modulePositions.length; i++) {
            if (this.modulePositions[i] == null) continue;
            if (this.modulePositions[i].posX === posX && this.modulePositions[i].posY === posY) return true;
        }
        return false;
    }

    getModuleByPosition(posX: number, posY: number): Ships.ModulePosition {
        for (var i = 0; i < this.modulePositions.length; i++) {
            if (this.modulePositions[i] == null) continue;
            if (this.modulePositions[i].posX === posX && this.modulePositions[i].posY === posY) return this.modulePositions[i];
        }
        return null;
    }

    insertModuleAtPosition(targetPosition: Ships.ModulePosition, shipmodule: BaseDataModule.ShipModule) {
        this.isSaved = false;
        if (this.modulePositionExists(targetPosition.posX, targetPosition.posY)) {
            var templateTargetPos = this.getModuleByPosition(targetPosition.posX, targetPosition.posY);
            templateTargetPos.shipmodule = shipmodule;
            templateTargetPos.shipmoduleId = shipmodule.id;
        } else {
            var templateTargetPos = new Ships.ModulePosition();
            templateTargetPos.posX = targetPosition.posX;
            templateTargetPos.posY = targetPosition.posY;
            templateTargetPos.shipmodule = shipmodule;
            templateTargetPos.shipmoduleId = shipmodule.id;
            this.modulePositions.push(templateTargetPos);
        }
    }

    isSpaceStation(): boolean {
        return this.shipHullId >= 199 && this.shipHullId <= 220;        
    }

    CostsInBaseResources(Factor = 1):number[] {
        var costs: number[] = [];
        var hullCosts = BaseDataModule.shipHulls[this.shipHullId].costs;
        for (var i = 0; i < hullCosts.length; i++) {
            if (hullCosts[i] == null || hullCosts[i] == 0) continue;

            if (costs[i] == null) {
                costs[i] = Math.ceil(hullCosts[i] * Factor);
            }
            else {
                costs[i] += Math.ceil(hullCosts[i] * Factor);
            }
        }

        //from modules
        for (var moduleIndex = 0; moduleIndex < this.modulePositions.length; moduleIndex++) {
            if (this.modulePositions[moduleIndex] == null) continue;

            var moduleCosts = this.modulePositions[moduleIndex].shipmodule.costs;
            for (var i = 0; i < moduleCosts.length; i++) {
                if (moduleCosts[i] == null || moduleCosts[i] == 0) continue;

                if (costs[i] == null) {
                    costs[i] = Math.ceil(moduleCosts[i] * Factor);
                }
                else {
                    costs[i] += Math.ceil(moduleCosts[i] * Factor);
                }
            }
        }

        return costs;
    }
}
