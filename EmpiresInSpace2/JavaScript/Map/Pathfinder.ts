module Pathfinder {


    export class Step {
        Heuristic: number;  //Heuristic Estimate - Heuristic uses Manhattan distance. Measures distance from current tile to the goal.
        HeuristicDraw: number; //If multiple fields yield the same Heuristic, use Heuristic to choose the best one
        g: number;  //Step Cost -   Total number of steps required to walk here from the start tile.
        f: number; //Calculated Total - Sum of the heuristic (H) and current step cost (G)
        fDraw: number;

        constructor(public x: number, public y: number, public xT: number, public yT: number, public totalSteps: number, public parent: Step, public FieldCost : number) {
            this.Heuristic = Math.max(Math.abs(x - xT), Math.abs(y - yT));   
            this.HeuristicDraw = Math.abs(x - xT) + Math.abs(y - yT);
            this.g = totalSteps;          
            this.f = totalSteps + this.Heuristic;           
            this.fDraw = totalSteps + this.HeuristicDraw;      
        }

       

    }

    class Tile {
        constructor(public x: number, public y: number, public fieldCost : number) { }
    }

    // Taken steps
    var closed: Step[] = [];

    // Available steps that can be taken
    var open: Step[] = [];

    // Step count
    var step = 0;

    // Maximum number of steps that can be taken before shutting down a closed path
    var maxSearchDistance = 10;



    function addOpen(step: Step) {
        open.push(step);       
        }

    // Remove a step that already exists by object memory address (not actual x and y values)
    function removeOpen(step: Step) {
        for (var i = 0; i < open.length; i++) {
            if (open[i] === step) open.splice(i, 1);
        }       
    };

    // Check if the step is already in the open set
    function inOpen(tile: Tile) {
        for (var i = 0; i < open.length; i++) {
            if (open[i].x === tile.x && open[i].y === tile.y)
                return open[i];
        }

        
    };

    

    // Get the lowest costing tile in the open set
    function getBestOpen(): Step {
        var bestI = 0;
        for (var i = 0; i < open.length; i++) {
            if (open[i].f < open[bestI].f) { bestI = i; continue; }
            if (open[i].f == open[bestI].f && open[i].fDraw < open[bestI].fDraw) bestI = i;
        }

        return open[bestI];
    };

    function addClosed(step: Step) {
        closed.push(step);       
    };

    // Check if the step is already in the closed set
    function inClosed(tile: Tile): Step {
        for (var i = 0; i < closed.length; i++) {
            if (closed[i].x === tile.x && closed[i].y === tile.y)
                return closed[i];
        }

        return null;
    };


    function getNeighbors(x, y): Tile[]{
        var neighbors: Tile[] = [];
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
            var targetRegionId: number;

            //upper row and lower row
            for (var cur_x = leftX; cur_x <= rightX; cur_x++) {

                //top row               
                var colRow = { col: cur_x, row: upY };
                var insideOfSystem = upY >= 0 &&  upY < 24 && cur_x >= 0 && cur_x < 24;
                if (currentMap.tileExist(colRow) && currentMap.findCreateTile(colRow).astronomicalObject) {
                    var cost = mainObject.imageObjects[currentMap.findCreateTile(colRow).astronomicalObject.typeId].moveCost;
                    neighbors.push(new Tile(cur_x, upY, cost));
                } else {
                    neighbors.push(new Tile(cur_x, upY, insideOfSystem ? 1 : 50 ));
                }
                

                //bottom row
                insideOfSystem = bottomY >= 0 && bottomY < 24 && cur_x >= 0 && cur_x < 24;
                colRow = { col: cur_x, row: bottomY };
                if (currentMap.tileExist(colRow) && currentMap.findCreateTile(colRow).astronomicalObject) {
                    var cost = mainObject.imageObjects[currentMap.findCreateTile(colRow).astronomicalObject.typeId].moveCost;
                    neighbors.push(new Tile(cur_x, bottomY, cost));
                } else {
                    neighbors.push(new Tile(cur_x, bottomY, insideOfSystem ?  1 : 50 ));
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
                } else {
                    neighbors.push(new Tile(leftX, cur_y, insideOfSystem ? 1 : 50));
                }

                //right column
                insideOfSystem = rightX >= 0 && rightX < 24 && cur_y >= 0 && cur_y < 24;
                colRow = { col: rightX, row: cur_y };
                if (currentMap.tileExist(colRow) && currentMap.findCreateTile(colRow).astronomicalObject) {
                    var cost = mainObject.imageObjects[currentMap.findCreateTile(colRow).astronomicalObject.typeId].moveCost;
                    neighbors.push(new Tile(rightX, cur_y, cost));
                } else {
                    neighbors.push(new Tile(rightX, cur_y, insideOfSystem ? 1 : 50));
                }
            }

        }

        return neighbors;
    }

    function getCost(x, y): number {
        //var targetBox = StarMapModule.makeBox(x, y);

        var colRow: ColRow = {col:x,row:y};

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
                && currentMap.findCreateTile(colRow).astronomicalObject
                ) {
                Helpers.Log(mainObject.imageObjects[currentMap.findCreateTile(colRow).astronomicalObject.typeId].moveCost.toString());
                Helpers.Log(currentMap.findCreateTile(colRow).astronomicalObject.typeId.toString());

                cost = mainObject.imageObjects[currentMap.findCreateTile(colRow).astronomicalObject.typeId].moveCost;
            }

        }

        return cost;
    }

    // @TODO Integrate maximum step limiter
    export function findPath(currentX: number, currentY: number, targetX: number, targetY: number, maxSteps: number) {
        var current: Step,   // Current best open tile
            neighbors: Tile[], // Dump of all nearby neighbor tiles
            neighborRecord: Step, // Any pre-existing records of a neighbor
            stepCost : number, // Dump of a total step score for a neighbor
            i: number;

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
                    } else {
                        neighborRecord.parent = current;
                        neighborRecord.g = stepCost;
                        neighborRecord.f = stepCost + neighborRecord.Heuristic;
                    }
                }
            }
        }

        return false;
    };

    // Recursive path buliding method
    function buildPath  (tile : Step, stack : Step[]) : any {
        stack.push(tile);

        if (tile.parent) {
            return buildPath(tile.parent, stack);
        } else {
            return stack;
        }
    };

    /*
    function setVisual  () {
        jp.visual.clearPath()
            .setTileGroup(this.open, 'set-opened')
            .setTileGroup(this.closed, 'set-closed');
    };*/

    function reset  () {
        closed = [];
        open = [];        
    }

}