var Pathfinder;
(function (Pathfinder) {
    var Step = /** @class */ (function () {
        function Step(x, y, xT, yT, totalSteps, parent, FieldCost) {
            this.x = x;
            this.y = y;
            this.xT = xT;
            this.yT = yT;
            this.totalSteps = totalSteps;
            this.parent = parent;
            this.FieldCost = FieldCost;
            this.Heuristic = Math.max(Math.abs(x - xT), Math.abs(y - yT));
            this.HeuristicDraw = Math.abs(x - xT) + Math.abs(y - yT);
            this.g = totalSteps;
            this.f = totalSteps + this.Heuristic;
            this.fDraw = totalSteps + this.HeuristicDraw;
        }
        return Step;
    }());
    Pathfinder.Step = Step;
    var Tile = /** @class */ (function () {
        function Tile(x, y, fieldCost) {
            this.x = x;
            this.y = y;
            this.fieldCost = fieldCost;
        }
        return Tile;
    }());
    // Taken steps
    var closed = [];
    // Available steps that can be taken
    var open = [];
    // Step count
    var step = 0;
    // Maximum number of steps that can be taken before shutting down a closed path
    var maxSearchDistance = 10;
    function addOpen(step) {
        open.push(step);
    }
    // Remove a step that already exists by object memory address (not actual x and y values)
    function removeOpen(step) {
        for (var i = 0; i < open.length; i++) {
            if (open[i] === step)
                open.splice(i, 1);
        }
    }
    ;
    // Check if the step is already in the open set
    function inOpen(tile) {
        for (var i = 0; i < open.length; i++) {
            if (open[i].x === tile.x && open[i].y === tile.y)
                return open[i];
        }
    }
    ;
    // Get the lowest costing tile in the open set
    function getBestOpen() {
        var bestI = 0;
        for (var i = 0; i < open.length; i++) {
            if (open[i].f < open[bestI].f) {
                bestI = i;
                continue;
            }
            if (open[i].f == open[bestI].f && open[i].fDraw < open[bestI].fDraw)
                bestI = i;
        }
        return open[bestI];
    }
    ;
    function addClosed(step) {
        closed.push(step);
    }
    ;
    // Check if the step is already in the closed set
    function inClosed(tile) {
        for (var i = 0; i < closed.length; i++) {
            if (closed[i].x === tile.x && closed[i].y === tile.y)
                return closed[i];
        }
        return null;
    }
    ;
    function getNeighbors(x, y) {
        var neighbors = [];
        if (currentMap instanceof TilemapModule.StarMap) {
            var currentBox = StarMapModule.makeBox(x, y);
            var neigbouringFields = StarMapModule.starMap.getNeighbourFieldsPath(currentBox, 1);
            for (var i = 0; i < neigbouringFields.length; i++) {
                if (neigbouringFields[i] == undefined) {
                    Helpers.Log("undef");
                }
                if (neigbouringFields[i].starData == null) {
                    var MovementCost = neigbouringFields[i].MovementCost;
                    //(deprecated) neutral space is forbidden / cost = 20
                    //if (neigbouringFields[i].OwnerId != mainObject.user.id && neigbouringFields[i].OwnerId != 0 && neigbouringFields[i].OwnerId != null  && neigbouringFields[i].DiplomaticId == 2) MovementCost = 20;
                    neighbors.push(new Tile(neigbouringFields[i].lowerLeft.x, neigbouringFields[i].lowerLeft.y, MovementCost));
                }
            }
        }
        if (currentMap instanceof TilemapModule.SolarSystemMap) {
            var leftX = x - 1;
            var upY = y - 1;
            var rightX = x + 1;
            var bottomY = y + 1;
            /*
            leftX = Math.max(leftX, 0);
            upY = Math.max(upY, 0);
            rightX = Math.min(rightX, 20);
            bottomY = Math.min(bottomY, 20);
            */
            var targetRegionId;
            //upper row and lower row
            for (var cur_x = leftX; cur_x <= rightX; cur_x++) {
                //top row               
                var colRow = { col: cur_x, row: upY };
                var insideOfSystem = upY >= 0 && upY < 24 && cur_x >= 0 && cur_x < 24;
                if (currentMap.tileExist(colRow) && currentMap.findCreateTile(colRow).astronomicalObject) {
                    var cost = mainObject.imageObjects[currentMap.findCreateTile(colRow).astronomicalObject.typeId].moveCost;
                    neighbors.push(new Tile(cur_x, upY, cost));
                }
                else {
                    neighbors.push(new Tile(cur_x, upY, insideOfSystem ? 1 : 50));
                }
                //bottom row
                insideOfSystem = bottomY >= 0 && bottomY < 24 && cur_x >= 0 && cur_x < 24;
                colRow = { col: cur_x, row: bottomY };
                if (currentMap.tileExist(colRow) && currentMap.findCreateTile(colRow).astronomicalObject) {
                    var cost = mainObject.imageObjects[currentMap.findCreateTile(colRow).astronomicalObject.typeId].moveCost;
                    neighbors.push(new Tile(cur_x, bottomY, cost));
                }
                else {
                    neighbors.push(new Tile(cur_x, bottomY, insideOfSystem ? 1 : 50));
                }
            }
            //left and right column (except top line and bottom line)
            for (var cur_y = upY + 1; cur_y < bottomY; cur_y++) {
                //left column
                var insideOfSystem = leftX >= 0 && leftX < 24 && cur_y >= 0 && cur_y < 24;
                var colRow = { col: leftX, row: cur_y };
                if (currentMap.tileExist(colRow) && currentMap.findCreateTile(colRow).astronomicalObject) {
                    var cost = mainObject.imageObjects[currentMap.findCreateTile(colRow).astronomicalObject.typeId].moveCost;
                    neighbors.push(new Tile(leftX, cur_y, cost));
                }
                else {
                    neighbors.push(new Tile(leftX, cur_y, insideOfSystem ? 1 : 50));
                }
                //right column
                insideOfSystem = rightX >= 0 && rightX < 24 && cur_y >= 0 && cur_y < 24;
                colRow = { col: rightX, row: cur_y };
                if (currentMap.tileExist(colRow) && currentMap.findCreateTile(colRow).astronomicalObject) {
                    var cost = mainObject.imageObjects[currentMap.findCreateTile(colRow).astronomicalObject.typeId].moveCost;
                    neighbors.push(new Tile(rightX, cur_y, cost));
                }
                else {
                    neighbors.push(new Tile(rightX, cur_y, insideOfSystem ? 1 : 50));
                }
            }
        }
        return neighbors;
    }
    function getCost(x, y) {
        //var targetBox = StarMapModule.makeBox(x, y);
        var colRow = { col: x, row: y };
        var cost = 1;
        //set nebula cost
        if (currentMap instanceof TilemapModule.StarMap) {
            var box = StarMapModule.makeBox(x, y);
            var existingField = StarMapModule.starMap.queryRange(box);
            if (existingField && existingField.length && existingField.length != 0) {
                if (existingField[0].imageId == 5000) {
                    //mainObject.imageObjects[5000].moveCost;
                    cost = mainObject.imageObjects[existingField[0].imageId].moveCost;
                }
            }
        }
        //set in solar system cost 
        if (currentMap instanceof TilemapModule.SolarSystemMap) {
            if (currentMap.tileExist(colRow)
                && currentMap.findCreateTile(colRow).astronomicalObject) {
                Helpers.Log(mainObject.imageObjects[currentMap.findCreateTile(colRow).astronomicalObject.typeId].moveCost.toString());
                Helpers.Log(currentMap.findCreateTile(colRow).astronomicalObject.typeId.toString());
                cost = mainObject.imageObjects[currentMap.findCreateTile(colRow).astronomicalObject.typeId].moveCost;
            }
        }
        return cost;
    }
    // @TODO Integrate maximum step limiter
    function findPath(currentX, currentY, targetX, targetY, maxSteps) {
        var current, // Current best open tile
        neighbors, // Dump of all nearby neighbor tiles
        neighborRecord, // Any pre-existing records of a neighbor
        stepCost, // Dump of a total step score for a neighbor
        i;
        // You must add the starting step
        reset();
        addOpen(new Step(currentX, currentY, targetX, targetY, step, null, 0));
        while (open.length !== 0) {
            current = getBestOpen();
            // Check if goal has been discovered to build a path
            if (current.x === targetX && current.y === targetY) {
                return buildPath(current, []);
            }
            // Move current into closed set
            removeOpen(current);
            addClosed(current);
            // Get neighbors from the map and check them
            neighbors = getNeighbors(current.x, current.y);
            for (i = 0; i < neighbors.length; i++) {
                // Get current step and distance from current to neighbor
                stepCost = current.g + neighbors[i].fieldCost;
                // Check for the neighbor in the closed set
                // then see if its cost is >= the stepCost, if so skip current neighbor
                neighborRecord = inClosed(neighbors[i]);
                if (neighborRecord && stepCost >= neighborRecord.g)
                    continue;
                // Verify neighbor doesn't exist or new score for it is better
                neighborRecord = inOpen(neighbors[i]);
                if (!neighborRecord || stepCost < neighborRecord.g) {
                    if (!neighborRecord) {
                        addOpen(new Step(neighbors[i].x, neighbors[i].y, targetX, targetY, stepCost, current, neighbors[i].fieldCost));
                    }
                    else {
                        neighborRecord.parent = current;
                        neighborRecord.g = stepCost;
                        neighborRecord.f = stepCost + neighborRecord.Heuristic;
                    }
                }
            }
        }
        return false;
    }
    Pathfinder.findPath = findPath;
    ;
    // Recursive path buliding method
    function buildPath(tile, stack) {
        stack.push(tile);
        if (tile.parent) {
            return buildPath(tile.parent, stack);
        }
        else {
            return stack;
        }
    }
    ;
    /*
    function setVisual  () {
        jp.visual.clearPath()
            .setTileGroup(this.open, 'set-opened')
            .setTileGroup(this.closed, 'set-closed');
    };*/
    function reset() {
        closed = [];
        open = [];
    }
})(Pathfinder || (Pathfinder = {}));
//# sourceMappingURL=Pathfinder.js.map