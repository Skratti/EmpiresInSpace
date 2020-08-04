module StarMapModule {

    

    export class OwnerNeigboursInfo {
        UpperLeft = 0;
        Upper = 0;
        UpperRight = 0;

        Left = 0;
        Right = 0;
        LowerLeft = 0;
        Lower = 0;
        LowerRight = 0;

       

        toOwnershipId(ownerId: number): number {

            if (ownerId == 0) return 0;

            var corners = 0;
            var edges = 0;
            var bitted = 0;

            if (this.UpperLeft == ownerId) { corners++; bitted += 128 }
            if (this.UpperRight == ownerId) { corners++; bitted += 64 }
            if (this.LowerLeft == ownerId) { corners++; bitted += 32 }
            if (this.LowerRight == ownerId) { corners++; bitted += 16 }

            if (this.Upper == ownerId) { edges++; bitted += 8; }
            if (this.Left == ownerId) { edges++; bitted += 4; }
            if (this.Right == ownerId) { edges++; bitted += 2; }
            if (this.Lower == ownerId) { edges++; bitted += 1; }

            //single field owned by player  o
            if (edges == 0) return 70;

            //one neighbour owned by player:  U, C, 
            if (edges == 1) {
                if (this.Left == ownerId)  return 61;
                if (this.Upper == ownerId) return 62;
                if (this.Right == ownerId) return 63;
                if (this.Lower == ownerId) return 60;  
            }

            // L , II 
            if (edges == 2) {
                //edges are on opposite
                if (this.Left == ownerId && this.Right == ownerId) return 55;
                if (this.Upper == ownerId && this.Lower == ownerId) return 54;

                //edgers are adjacent
                //and the field between both edges does NOT belong to player
                if (this.Left == ownerId  && this.Upper == ownerId && this.UpperLeft != ownerId ) return 91;
                if (this.Upper == ownerId && this.Right == ownerId && this.UpperRight != ownerId) return 92;
                if (this.Right == ownerId && this.Lower == ownerId && this.LowerRight != ownerId) return 93;
                if (this.Lower == ownerId && this.Left == ownerId  && this.LowerLeft != ownerId) return 90;
                             
                if (this.Left == ownerId && this.Upper == ownerId ) return 51;
                if (this.Upper == ownerId && this.Right == ownerId) return 52;
                if (this.Right == ownerId && this.Lower == ownerId) return 53;
                if (this.Lower == ownerId && this.Left == ownerId ) return 50;                                      
            }

            //three edges adjacent to own region, one edge with border, one or two possible corners
            if (edges == 3) {
                if (this.Left != ownerId)
                {
                    if (this.UpperRight != ownerId && this.LowerRight == ownerId) return 87; // one corner
                    if (this.LowerRight != ownerId && this.UpperRight == ownerId) return 82; // one corner
                    if (this.UpperRight != ownerId && this.LowerRight != ownerId) return 103; // 2 corners         
                    return 42;
                }

                if (this.Upper != ownerId) {
                    if (this.LowerRight != ownerId && this.LowerLeft == ownerId) return 84;  // one corner
                    if (this.LowerLeft  != ownerId && this.LowerRight == ownerId) return 83; // one corner
                    if (this.LowerRight != ownerId && this.LowerLeft != ownerId) return 102;  // 2 corners 
                    return 40;
                }

                if (this.Right != ownerId) {
                    if (this.UpperLeft != ownerId && this.LowerLeft == ownerId) return 80;  // one corner
                    if (this.LowerLeft != ownerId && this.UpperLeft == ownerId) return 85;  // one corner
                    if (this.UpperLeft != ownerId && this.LowerLeft != ownerId) return 101;  // 2 corners 
                    return 43;
                }

                if (this.Lower != ownerId) {
                    if (this.UpperRight != ownerId && this.UpperLeft == ownerId) return 81;   // one corner
                    if (this.UpperLeft  != ownerId && this.UpperRight == ownerId) return 86;   // one corner
                    if (this.UpperRight != ownerId && this.UpperLeft != ownerId) return 100;   // 2 corners 
                    return 41;
                }
            }

            //all edges are ajdacent to own territories, but the corners may not (1-4)
            if (edges == 4) {
                if (corners == 0) return 71;

                if (corners == 1)
                {
                    if (this.LowerRight == ownerId) return 30;
                    if (this.UpperRight == ownerId) return 31;
                    if (this.UpperLeft == ownerId) return 32;
                    if (this.LowerLeft == ownerId) return 33;
                }

                if (corners == 2) {
                    if (this.UpperLeft != ownerId && this.UpperRight != ownerId) return 20;
                    if (this.UpperLeft != ownerId && this.LowerLeft  != ownerId)   return 21;
                    if (this.LowerLeft != ownerId && this.LowerRight != ownerId) return 22;
                    if (this.LowerRight != ownerId && this.UpperRight != ownerId) return 23;

                    if (this.UpperLeft != ownerId && this.LowerRight != ownerId) return 24;
                    if (this.LowerLeft != ownerId && this.UpperRight != ownerId) return 25;
                }

                if (corners == 3) {
                    if (this.UpperLeft != ownerId) return 13;
                    if (this.UpperRight != ownerId) return 12;
                    if (this.LowerRight != ownerId) return 10;
                    if (this.LowerLeft != ownerId) return 11;

                    
                }

                return 0;
            }

            
            Helpers.Log("Error in NNI.toId");
            return 0;
        }
    }

    export var starMap: StarMap;
    
    export class Coordinate {
        x: number;
        y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
    }

    export class Box {
        lowerLeft: Coordinate;
        width: number;

        //if box is a field:
        id: number;

        MovementCost: number = 1;

        image: ImageCache.ImageObject;
        imageId: number = null;
        //NebulaNeigbours: NeigboursInfo;

        //OwnerImage: ImageCache.ImageObject;
        //color may be per user, or per userDiplomaticStatus
        Influence: number[] = []; //user->influence array
        OwnerId: number = 0;
        OwnerImagesType: number = 0; //0 = now image. number does describe the form of the border, but not its color
        OnwerNeighbour: OwnerNeigboursInfo;

        //create borders depending on user diplomatic status: save diplomatic status per tile, then create borders
        DiplomaticId: number = 0; //war, hostile. peace etc
        DiplomaticImagesType: number = 0; //0 = now image. number does describe the form of the border, but not its color
        DiplomaticNeighbour: OwnerNeigboursInfo;

        //create borders depending on alliances / "single Users" diplomatic status
        //color may be per region, or per regionDiplomaticStatus
        EntityId: number = 0;
        EntityImagesType: number = 0; //0 = now image. number does describe the form of the border, but not its color
        EntityNeighbour: OwnerNeigboursInfo;


        star: ImageCache.ImageObject; //can also be asteroid, or anything else which occupies a field and does not allow another of its type
        starData: AreaSpecifications = null; //if a star or other object with impuls-space exists (in contrast to hyper space)
        ships: Ships.Ship[];
        drawArrow = false; //if true, draw an arrow pointing to this Tile

        //width = 1 if the box is a field
        constructor(lowerLeft: Coordinate, width: number = 1) {
            this.lowerLeft = lowerLeft;
            this.width = width;
        }

        OwnershipText(): string {
            if (!this.OwnerId) return "";

            var Text = "";
            if (this.OwnerId == mainObject.user.id) {
                var relationColor = DiplomacyModule.RelationColor(10);
             
                Text += "<font color=" + relationColor + ">" + i18n.label(917) + "</font><br>"; //Owned by you
                Text += "<br>";
            }
            else {
                if (mainObject.user.otherUserFind(this.OwnerId)) {
                    var relationColor = DiplomacyModule.RelationColor(this.DiplomaticId);
                    Text += "<font color=" + relationColor + ">" + i18n.label(921).format(mainObject.user.otherUserFind(this.OwnerId).name.label()) + "</font><br>"; //Owner: {0}
                    

                    switch (this.DiplomaticId) {
                        case 0:
                            Text += "<font color=" + relationColor + ">" + i18n.label(176) + "</font><br>"; //WAR RelationColor = "#ff1010"; //enemy - red              
                            Text += "<br>";                                
                            break;
                        case 1:
                            Text += "<font color=" + relationColor + ">" + i18n.label(768) + "</font><br>"; // Hostile                      
                            Text += "<br>";                  
                            break;
                        case 2:
                            Text += "<font color=" + relationColor + ">" + i18n.label(436) + "</font><br>"; //neutral 
                            Text += "<br>";                  
                            break;
                        case 3:
                            Text += "<font color=" + relationColor + ">" + i18n.label(177) + "</font><br>"; //trade treaty 
                            Text += "<br>";                  
                            break;
                        case 4:
                            Text += "<font color=" + relationColor + ">" + i18n.label(441) + "</font><br>"; //- pact - light blue  441
                            Text += "<br>";                  
                            break;
                        case 5:
                            
                            break;
                        case 10:
                            
                            break;                        
                    }

                    Text += "<br>";
                }


            }
            return Text;
        }

        containsPoint(fieldBox: Box): boolean {
            if (fieldBox.width > 1) return false;
            var fieldLowerLeft = fieldBox.lowerLeft;

            var ret = this.lowerLeft.x <= fieldLowerLeft.x
                && this.lowerLeft.x + this.width > fieldLowerLeft.x
                && this.lowerLeft.y <= fieldLowerLeft.y
                && this.lowerLeft.y + this.width > fieldLowerLeft.y;

            return ret;
        }
        intersectsBox(otherBox: Box): boolean {

            var ret = this.lowerLeft.x < otherBox.lowerLeft.x + otherBox.width && otherBox.lowerLeft.x < this.lowerLeft.x + this.width
                && this.lowerLeft.y < otherBox.lowerLeft.y + otherBox.width && otherBox.lowerLeft.y < this.lowerLeft.y + this.width;

            return ret;
        }

        OwnerNeigboursGet(): OwnerNeigboursInfo {
            if (this.OnwerNeighbour == null) this.OnwerNeighbour = new OwnerNeigboursInfo();
            return this.OnwerNeighbour;
        }

        DiplomaticNeigboursGet(): OwnerNeigboursInfo {
            if (this.DiplomaticNeighbour == null) this.DiplomaticNeighbour = new OwnerNeigboursInfo();
            return this.DiplomaticNeighbour;
        }

        EntityNeighbourGet(): OwnerNeigboursInfo {
            if (this.EntityNeighbour == null) this.EntityNeighbour = new OwnerNeigboursInfo();
            return this.EntityNeighbour;
        }

        AddInfluence(userId : number, value : number){
            if (this.Influence[userId] != null)  {
                this.Influence[userId] += value;
            }
            else {
                this.Influence[userId] = value;
            }
        }

        //get the 4 neighbouring fields
        GetNeighbours(): Box[]{
            var Neighbours: Box[] = [];

            var neighbourBox = StarMapModule.makeBox(this.lowerLeft.x - 1, this.lowerLeft.y);
            Neighbours.push(StarMapModule.starMap.queryOrInsert(neighbourBox));        
            
            neighbourBox = StarMapModule.makeBox(this.lowerLeft.x + 1, this.lowerLeft.y);
            Neighbours.push(StarMapModule.starMap.queryOrInsert(neighbourBox));       

            neighbourBox = StarMapModule.makeBox(this.lowerLeft.x, this.lowerLeft.y - 1);
            Neighbours.push(StarMapModule.starMap.queryOrInsert(neighbourBox));       

            neighbourBox = StarMapModule.makeBox(this.lowerLeft.x, this.lowerLeft.y + 1);
            Neighbours.push(StarMapModule.starMap.queryOrInsert(neighbourBox));       

            return Neighbours;
        }

    }

    export function makeBox(x: number, y: number, width: number = 1): Box {
        var coords = new StarMapModule.Coordinate(x, y);
        return new Box(coords, width);
    }

    export function FieldExists(x: number, y: number): boolean {
        var Box: StarMapModule.Box;
        Box = StarMapModule.makeBox(x, y);
        var ExistingField: StarMapModule.Box;
        var ExistingFields = StarMapModule.starMap.queryRange(Box);
        if (!ExistingFields || ExistingFields.length == 0 || !ExistingFields[0]) return false;
        return true;
    }

    export function GetField(x: number, y: number): Box {
        var Box: StarMapModule.Box;
        Box = StarMapModule.makeBox(x, y);
        var ExistingField: StarMapModule.Box;
        var ExistingFields = StarMapModule.starMap.queryRange(Box);
        if (!ExistingFields || ExistingFields.length == 0 || !ExistingFields[0]) return null;
        return ExistingFields[0];
    }

    export class StarMap {

        region: Box;
        
        //up to 4 boxes with width=1 are included
        fields: Box[] = []; 
      

        //  A|B
        //  C|D
        A: StarMap;
        B: StarMap;
        C: StarMap;
        D: StarMap;

        constructor(region: Box) { this.region = region;}



        insert(field: Box) {
            // Ignore objects that do not belong in this quad tree
            if (!this.region.containsPoint(field)) return false; // object cannot be added
                
            //skip if field already exists on the current level:
            for (var i = 0; i < this.fields.length; i++) {
                if(this.fields[i].lowerLeft.x == field.lowerLeft.x
                    && this.fields[i].lowerLeft.y == field.lowerLeft.y) 
                    return false;
            }


            // If there is space in this quad tree, add the object here
            if (this.A == null && this.fields.length < 4) {
                this.fields.push(field);
                return true;
            }

            // Otherwise, subdivide and then add the point to whichever node will accept it
            if (this.A == null)
                this.subdivide();

            if (this.A.insert(field)) { return true; }
            if (this.B.insert(field)) { return true; }
            if (this.C.insert(field)) { return true; }
            if (this.D.insert(field)) { return true; }

            // Otherwise, the point cannot be inserted for some unknown reason (this should never happen)
            return false;
        }

        //can be star, nebula, anomaly etc
        insertStar(field: Box, imageId: number , id = 0) {

            //field.lowerLeft.x == 5008 && field.lowerLeft.y == 5021
            var existingField = this.queryOrInsert(field);
            existingField.id = id;
            existingField.MovementCost = 0;

            if (mainObject.imageObjects[imageId] != null) {
                existingField.imageId = imageId;
                existingField.image = mainObject.imageObjects[imageId];
                existingField.MovementCost = mainObject.imageObjects[imageId].moveCost;
            }
            else {
                existingField.imageId = imageId;
            }
            
            if(!existingField.MovementCost) existingField.MovementCost = 10;
        }

        getNeighbourFields(field: Box, distance : number, overallRings: number) : Box[]
        {
            var ret: Box[] = [];
            var existingField = this.queryOrInsert(field);

            var leftX = existingField.lowerLeft.x - distance;
            var upY = existingField.lowerLeft.y - distance;
            var rightX = existingField.lowerLeft.x + distance;
            var bottomY = existingField.lowerLeft.y + distance;

            var targetRegionId: number;

            // Excluded corner fields are fields that are not used, starting from a corner in each direction
            // 1 means that only the corner is missing, 2 means that the corner and one field in each direction is missing
            // 3 means that thecorner and two fields in each direction are missing etc
            //var ExcludedCornerFields = Math.max(0, 2 * distance - overallRings - 1);
            // maximum number of excluded fields is distance - 1
            var ExcludedCornerFields = (distance - 1);
            // it is reduced by 1 for each additional ring around the colony after this ring: 
            ExcludedCornerFields = ExcludedCornerFields - (overallRings - distance);
            ExcludedCornerFields = Math.max(0, ExcludedCornerFields);

            //upper row and lower row
            for (var x = leftX + ExcludedCornerFields; x <= rightX - ExcludedCornerFields; x++) {
                var neighbourBox = StarMapModule.makeBox(x, upY);
                ret.push(this.queryOrInsert(neighbourBox));

                neighbourBox = StarMapModule.makeBox(x, bottomY);
                ret.push(this.queryOrInsert(neighbourBox));           
            }

            //left and right column (except top line and bottom line)
            var ExcludedY = Math.max(1, ExcludedCornerFields);
            for (var y = upY + ExcludedY; y <= bottomY - ExcludedY; y++) {
                var neighbourBox = StarMapModule.makeBox(leftX, y);
                ret.push(this.queryOrInsert(neighbourBox));
         
                var neighbourBox = StarMapModule.makeBox(rightX, y);
                ret.push(this.queryOrInsert(neighbourBox));
            }

            return ret;
        }

        makeNeighbourPath(neighbourBox: StarMapModule.Box): StarMapModule.Box {
            var existing = this.queryRange(neighbourBox);
            if (existing && existing.length > 0) {

                if (existing[0] == undefined) {
                    Helpers.Log("undef");
                }

                return existing[0];
            } else {
                neighbourBox.MovementCost = 1;
                return neighbourBox;
            }
        }

        
        /// Just for pathing informations. No new fields are to be inserted
        getNeighbourFieldsPath(field: Box, distance: number): Box[] {
            var ret: Box[] = [];
            var existingField = this.queryOrInsert(field);

            var leftX = existingField.lowerLeft.x - distance;
            var upY = existingField.lowerLeft.y - distance;
            var rightX = existingField.lowerLeft.x + distance;
            var bottomY = existingField.lowerLeft.y + distance;

            var targetRegionId: number;

            //upper row and lower row
            for (var x = leftX; x <= rightX; x++) {
                var neighbourBox = StarMapModule.makeBox(x, upY);
                ret.push(this.makeNeighbourPath(neighbourBox));

                neighbourBox = StarMapModule.makeBox(x, bottomY);
                ret.push(this.makeNeighbourPath(neighbourBox));
            }

            //left and right column (except top line and bottom line)
            for (var y = upY + 1; y < bottomY; y++) {
                var neighbourBox = StarMapModule.makeBox(leftX, y);
                ret.push(this.makeNeighbourPath(neighbourBox));

                var neighbourBox = StarMapModule.makeBox(rightX, y);
                ret.push(this.makeNeighbourPath(neighbourBox));
            }

            return ret;
        }


        insertOwnership(field: Box, ownerId = 0) {

            var existingField = this.queryOrInsert(field);
            existingField.OwnerId = ownerId;

            var user = mainObject.findUser(ownerId);

            if (user != null) {
                //var user = mainObject.user.otherUserFind(ownerId);
                existingField.DiplomaticId = user.currentRelation;

                if (user.allianceId) {
                    existingField.EntityId = (2 << 21) + user.allianceId;
                } else {
                    existingField.EntityId = (1 << 21) + user.id;
                }

            }

            //existingField.OwnerImagesType = existingField.OwnerNeigboursGet().toOwnerShipId(ownerId);


            //set the neighbouring info of all 8 neighbouring fields
            //uppers
            var neighbour = new Box(new Coordinate(field.lowerLeft.x - 1, field.lowerLeft.y - 1));
            this.queryOrInsert(neighbour).OwnerNeigboursGet().LowerRight = ownerId;
            this.queryOrInsert(neighbour).EntityNeighbourGet().LowerRight = existingField.EntityId;


            neighbour = new Box(new Coordinate(field.lowerLeft.x, field.lowerLeft.y - 1));
            this.queryOrInsert(neighbour).OwnerNeigboursGet().Lower = ownerId;
            this.queryOrInsert(neighbour).EntityNeighbourGet().Lower = existingField.EntityId;

            neighbour = new Box(new Coordinate(field.lowerLeft.x + 1, field.lowerLeft.y - 1));
            this.queryOrInsert(neighbour).OwnerNeigboursGet().LowerLeft = ownerId;
            this.queryOrInsert(neighbour).EntityNeighbourGet().LowerLeft = existingField.EntityId;

            //left/right
            neighbour = new Box(new Coordinate(field.lowerLeft.x - 1, field.lowerLeft.y));
            this.queryOrInsert(neighbour).OwnerNeigboursGet().Right = ownerId;
            this.queryOrInsert(neighbour).EntityNeighbourGet().Right = existingField.EntityId;

            neighbour = new Box(new Coordinate(field.lowerLeft.x + 1, field.lowerLeft.y));
            this.queryOrInsert(neighbour).OwnerNeigboursGet().Left = ownerId;
            this.queryOrInsert(neighbour).EntityNeighbourGet().Left = existingField.EntityId;
            //lowers
            neighbour = new Box(new Coordinate(field.lowerLeft.x - 1, field.lowerLeft.y + 1));
            this.queryOrInsert(neighbour).OwnerNeigboursGet().UpperRight = ownerId;
            this.queryOrInsert(neighbour).EntityNeighbourGet().UpperRight = existingField.EntityId;

            neighbour = new Box(new Coordinate(field.lowerLeft.x, field.lowerLeft.y + 1));
            this.queryOrInsert(neighbour).OwnerNeigboursGet().Upper = ownerId;
            this.queryOrInsert(neighbour).EntityNeighbourGet().Upper = existingField.EntityId;

            neighbour = new Box(new Coordinate(field.lowerLeft.x + 1, field.lowerLeft.y + 1));
            this.queryOrInsert(neighbour).OwnerNeigboursGet().UpperLeft = ownerId;
            this.queryOrInsert(neighbour).EntityNeighbourGet().UpperLeft = existingField.EntityId;

        }

        /*
        SetNeighboutOwnerData(field: Box, ownerId = 0): void {
            var neighbour = new Box(new Coordinate(field.lowerLeft.x - 1, field.lowerLeft.y - 1));
            this.queryOrInsert(neighbour).OwnerNeigboursGet().LowerRight = ownerId;
            this.queryOrInsert(neighbour).EntityNeighbourGet().LowerRight = existingField.EntityId;


            neighbour = new Box(new Coordinate(field.lowerLeft.x, field.lowerLeft.y - 1));
            this.queryOrInsert(neighbour).OwnerNeigboursGet().Lower = ownerId;
            this.queryOrInsert(neighbour).EntityNeighbourGet().Lower = existingField.EntityId;

            neighbour = new Box(new Coordinate(field.lowerLeft.x + 1, field.lowerLeft.y - 1));
            this.queryOrInsert(neighbour).OwnerNeigboursGet().LowerLeft = ownerId;
            this.queryOrInsert(neighbour).EntityNeighbourGet().LowerLeft = existingField.EntityId;

            //left/right
            neighbour = new Box(new Coordinate(field.lowerLeft.x - 1, field.lowerLeft.y));
            this.queryOrInsert(neighbour).OwnerNeigboursGet().Right = ownerId;
            this.queryOrInsert(neighbour).EntityNeighbourGet().Right = existingField.EntityId;

            neighbour = new Box(new Coordinate(field.lowerLeft.x + 1, field.lowerLeft.y));
            this.queryOrInsert(neighbour).OwnerNeigboursGet().Left = ownerId;
            this.queryOrInsert(neighbour).EntityNeighbourGet().Left = existingField.EntityId;
            //lowers
            neighbour = new Box(new Coordinate(field.lowerLeft.x - 1, field.lowerLeft.y + 1));
            this.queryOrInsert(neighbour).OwnerNeigboursGet().UpperRight = ownerId;
            this.queryOrInsert(neighbour).EntityNeighbourGet().UpperRight = existingField.EntityId;

            neighbour = new Box(new Coordinate(field.lowerLeft.x, field.lowerLeft.y + 1));
            this.queryOrInsert(neighbour).OwnerNeigboursGet().Upper = ownerId;
            this.queryOrInsert(neighbour).EntityNeighbourGet().Upper = existingField.EntityId;

            neighbour = new Box(new Coordinate(field.lowerLeft.x + 1, field.lowerLeft.y + 1));
            this.queryOrInsert(neighbour).OwnerNeigboursGet().UpperLeft = ownerId;
            this.queryOrInsert(neighbour).EntityNeighbourGet().UpperLeft = existingField.EntityId;
        }
        */

        // create four children that fully divide this quad into four quads of equal area
        subdivide() {

            var x = this.region.lowerLeft.x;
            var y = this.region.lowerLeft.y;
            var halfDimension = this.region.width / 2;

            var aLowerLeft = new Coordinate(x, y + halfDimension);
            var aBox = new Box(aLowerLeft, halfDimension);
            this.A = new StarMap(aBox);

            var bLowerLeft = new Coordinate(x + halfDimension, y + halfDimension);
            var bBox = new Box(bLowerLeft, halfDimension);
            this.B = new StarMap(bBox);

            var cLowerLeft = new Coordinate(x, y);
            var cBox = new Box(cLowerLeft, halfDimension);
            this.C = new StarMap(cBox);

            var dLowerLeft = new Coordinate(x + halfDimension, y);
            var dBox = new Box(dLowerLeft, halfDimension);
            this.D = new StarMap(dBox);

            //move the fields to the lower layer
            for (var i = 0; i < this.fields.length; i++)
            {
                this.A.insert(this.fields[i]);
                this.B.insert(this.fields[i]);
                this.C.insert(this.fields[i]);
                this.D.insert(this.fields[i]);
            }
            this.fields = [];
        } 

        //returns all boxes that overlap with the range
        queryRange(range: Box): Box[]{
            var includedBoxes: Box[] = [];

            if (!this.region.intersectsBox(range))
                return includedBoxes; // empty list            

            // Add objects at this quad level
            //includedBoxes = includedBoxes.concat(this.fields);
            for (var i = 0; i < this.fields.length; i++) {
                if (this.fields[i].intersectsBox(range)) includedBoxes.push(this.fields[i]);
            }

            //lowest level of tree does not need to traverse further
            if (this.region.width == 1) {
                includedBoxes.push(this.region);
                return includedBoxes;
            }

            // Terminate here, if there are no children
            if (this.A == null)
                return includedBoxes;

            // Otherwise, add the points from the children
            includedBoxes = includedBoxes.concat(this.A.queryRange(range));
            includedBoxes = includedBoxes.concat(this.B.queryRange(range));
            includedBoxes = includedBoxes.concat(this.C.queryRange(range));
            includedBoxes = includedBoxes.concat(this.D.queryRange(range));            

            return includedBoxes;
        }

        //return all fields in this tree (or subtree)
        queryAll(): Box[]{
            var range = this.region;
            var includedBoxes: Box[] = [];

            if (!this.region.intersectsBox(range))
                return includedBoxes; // empty list            

            // Add objects at this quad level
            //includedBoxes = includedBoxes.concat(this.fields);
            for (var i = 0; i < this.fields.length; i++) {
                if (this.fields[i].intersectsBox(range)) includedBoxes.push(this.fields[i]);
            }

            //lowest level of tree does not need to traverse further
            if (this.region.width == 1) {
                includedBoxes.push(this.region);
                return includedBoxes;
            }

            // Terminate here, if there are no children
            if (this.A == null)
                return includedBoxes;

            // Otherwise, add the points from the children
            includedBoxes = includedBoxes.concat(this.A.queryRange(range));
            includedBoxes = includedBoxes.concat(this.B.queryRange(range));
            includedBoxes = includedBoxes.concat(this.C.queryRange(range));
            includedBoxes = includedBoxes.concat(this.D.queryRange(range));

            return includedBoxes;
        }

        
        queryOrInsert(field: Box): Box {
            if (field.width != 1) return null;

            var existingField = this.queryRange(field);
            if (existingField.length == 0) {
                field.MovementCost = 1;
                this.insert(field);
                existingField = this.queryRange(field);
                if (existingField.length == 0) return null;
            }

            return existingField[0];        
        }
    }

    
    export function InfluenceToRingNo(Influence: number): number {
        //method is used in c# as well as in JS, so no linq here
        var Ring = 0;
        for (var index = 0; index < mainObject.influenceRings.length; ++index) {
            var InfluenceRing = mainObject.influenceRings[index];
            if (InfluenceRing.Influence < Influence && InfluenceRing.Ring > Ring) {
                Ring = InfluenceRing.Ring;
            }
        }
        return Ring;
    }

    function applyInfluence(field: StarMapModule.Box, influence: number, userId: number) {
        //number of rings aroung the field. 1 - 10?
        var rings = 1;
        rings = InfluenceToRingNo(influence);

        //find all neighbouring fields of the field
        //use the regions to accomplish this            
        var factor = 1.0;
        for (var ring = rings; ring > 0; ring--) {
            //remove the influence that was needed to archieve this ring
            //var InfluenceOfThisRing = this.Influence - this.RingToMinInfluence(ring);
            var InfluenceOfThisRing = influence - RingToMinInfluence(ring);

            var neigbouringFields = StarMapModule.starMap.getNeighbourFields(field, ring, rings);
            //factor = 1.0 / Math.pow(ring, 2);
            //factor = 1.0 / ((ring + 1)^2) ;// + ((ring - 1) * 4 ));
            factor = 1.0 / (ring / 2.0 + ((ring - 1) * 4.0));
            factor = 1.0 / (ring / 2.0 + ((ring - 1) * 4.0));
            factor = 1.0 / ((ring * ring * ring) / 3); 
            for (var neighbourId = 0; neighbourId < neigbouringFields.length; neighbourId++) {
                var neighbour = neigbouringFields[neighbourId];
                neighbour.AddInfluence(userId, (InfluenceOfThisRing * factor));
            }
            factor = factor * 1.3;
        }

        //the field where the colony is on
        factor = 1;
        field.AddInfluence(userId, (influence * factor * 100));
    }

    /// <summary>
    /// Returns the minimum Influence required to unlock this ring
    /// </summary>
    /// <param name="Ring"></param>
    /// <returns></returns>
    export function RingToMinInfluence(Ring: number): number {
        var MinInfluence = 1;
        for (var index = 0; index < mainObject.influenceRings.length; ++index) {
            var InfluenceRing = mainObject.influenceRings[index];
            if (Ring >= InfluenceRing.Ring && InfluenceRing.Influence > MinInfluence) {
                MinInfluence = InfluenceRing.Influence;
            }
        }
        return MinInfluence;
    }

    export function CreateBorders() {

        console.log(new Date());
        //apply influence to each field from colony
        AddColoniesOwnership();

        //set ownerId on each field
        SetFieldOwners();
        //console.log(new Date());

        //set neighbouring Info on all fields
        //and add DiplomacyId and EntityId
        SetFieldVisibleOwnership();
        //console.log(new Date());

        //fetch borderfields that do not belong to anybody, check if they are sorrounded on 3 or more sides by a player, then give that player the field
        FillBorderGaps();
        //console.log(new Date());

        //create neutral zone between factions
        //CreateNeutralZone();
        //console.log(new Date());

        RemoveSingleFields();
        //console.log(new Date());

        //calculate the border information for each field
        SetFieldBorders();
        //console.log(new Date());

    }

    export function ReCreateBorders() {

        var allFields = StarMapModule.starMap.queryAll();
        for (var i = 0; i < allFields.length; i++) {
            var fieldToSet = allFields[i];
            if (fieldToSet.Influence.length == 0) continue;

            fieldToSet.Influence = []; //user->influence array
            fieldToSet.OwnerId = 0;
            fieldToSet.OwnerImagesType = 0; //0 = now image. number does describe the form of the border, but not its color
            fieldToSet.OnwerNeighbour = null;
            
            fieldToSet.DiplomaticId = 0; //war, hostile. peace etc
            fieldToSet.DiplomaticImagesType = 0; //0 = now image. number does describe the form of the border, but not its color
            fieldToSet.DiplomaticNeighbour = null;

            fieldToSet.EntityId = 0;
            fieldToSet.EntityImagesType = 0; //0 = now image. number does describe the form of the border, but not its color
            fieldToSet.EntityNeighbour = null;

        }     

        CreateBorders();
    }


    export function AddColonyOwnership(colony : ColonyModule.Colony) {      
            var colonyBox = StarMapModule.makeBox(colony.galaxyColRow.col, colony.galaxyColRow.row);
            colonyBox = StarMapModule.starMap.queryOrInsert(colonyBox);

            applyInfluence(colonyBox, colony.Influence, colony.owner);
    }

    function AddColoniesOwnership() {
        var colonies = mainObject.colonies;
        for (var index = 0; index < colonies.length; index++) {
            var colony = colonies[index];
            if (colony == null) continue;
            AddColonyOwnership(colony);          
        }
    }

    function SetFieldOwners() {
        var allFields = StarMapModule.starMap.queryAll();
        for (var i = 0; i < allFields.length; i++) {
            var fieldToSet = allFields[i];
            if (fieldToSet.Influence.length == 0) continue;

            var highestInfluenceSoFar = 0;
            for (var j = 0; j < fieldToSet.Influence.length; j++) {
                if (fieldToSet.Influence[j] == null) continue;

                if (fieldToSet.Influence[j] > highestInfluenceSoFar) {
                    highestInfluenceSoFar = fieldToSet.Influence[j];
                    fieldToSet.OwnerId = j;
                }
            }           
        }      
    }

    function SetFieldVisibleOwnership(): void{
        var allFields = StarMapModule.starMap.queryAll();

        for (var i = 0; i < allFields.length; i++) {
            if (allFields[i].OwnerId != 0) {
                StarMapModule.starMap.insertOwnership(allFields[i], allFields[i].OwnerId);
            }
        }
    }

    //fill gaps in the border
    //check each field that has an owner
    //fetch the 4 neighbours of it
    //check every neighbour that does not have an owner
    function FillBorderGaps() : void {
        var allFields = StarMapModule.starMap.queryAll();

        for (var i = 0; i < allFields.length; i++) {
            if (allFields[i].OwnerId != 0) {
                var currentOwner = allFields[i].OwnerId;
                var currentEntity = allFields[i].EntityId;
                var Neighbours = allFields[i].GetNeighbours();

                //get the 4 neighbours, each of these will be checked
                for (var j = 0; j < Neighbours.length; j++) {
                    if (Neighbours[j].OwnerId != 0) continue;

                    var NeighboursToCheck = Neighbours[j].GetNeighbours();
                    var fieldsOfThatOwner = 0;
                    for (var k = 0; k < NeighboursToCheck.length; k++) {
                        if (NeighboursToCheck[k].EntityId == currentEntity) fieldsOfThatOwner++;
                    }

                    //if three or more, add the checked field to the currentOwner
                    if (fieldsOfThatOwner > 2) {
                        Neighbours[j].OwnerId = currentOwner;
                        StarMapModule.starMap.insertOwnership(Neighbours[j], currentOwner);
                    }

                }

                //StarMapModule.starMap.insertOwnership(allFields[i], allFields[i].OwnerId);
            }
        }
    }


    
    //creates a neutral zone between factions (one field widths)
    function CreateNeutralZone(): void {
        var allFields = StarMapModule.starMap.queryAll();

        var ToDelete: Box[] = []; 

        for (var i = 0; i < allFields.length; i++) {
            if (allFields[i].OwnerId != 0) {
                var currentOwner = allFields[i].OwnerId;
                var currentInfluence = allFields[i].Influence[currentOwner];
                var Neighbours = allFields[i].GetNeighbours();

                //get the 4 neighbours, each of these will be checked
                for (var j = 0; j < Neighbours.length; j++) {
                    if (Neighbours[j].OwnerId == 0 || Neighbours[j].OwnerId == currentOwner ) continue;

                    //skip if neighbour is allied or has a pact
                    //allied:
                    if (allFields[i].EntityId == Neighbours[j].EntityId) continue;
                    
                    //pact or better:
                    //fetch relation between the two users:
                    /*
                    //Todo: Relation between two other users are lazy fetched during Diplomacy.ts (new UserDetail(userId)).showDetails(_parent);
                    var relation = 2;
                    if (currentOwner != mainObject.user.id) {
                        relation = mainObject.findUser(currentOwner).GetCurrentRelationTowardsUsers(Neighbours[j].OwnerId);
                    } else {
                        relation = mainObject.findUser(Neighbours[j].OwnerId).GetCurrentRelationTowardsUsers(currentOwner);
                    }                  
                    if (relation > 3) continue;
                    */

                    //if neighbour has higher influence, delete this field
                    if (Neighbours[j].Influence[Neighbours[j].OwnerId] >= currentInfluence) {
                        ToDelete.push(allFields[i]);
                        //StarMapModule.starMap.insertOwnership(allFields[i], 0);                        
                    }
                }
            }
        }

        for (var k = 0; k < ToDelete.length; k++) {
            StarMapModule.starMap.insertOwnership(ToDelete[k], 0);                    
        }
    }

    //Remove all fields that do not have at least one neightbour to the left, right, top or bottom
    function RemoveSingleFields(): void {
        var allFields = StarMapModule.starMap.queryAll();

        var ToDelete: Box[] = [];

        for (var i = 0; i < allFields.length; i++) {
            if (allFields[i].OwnerId != 0) {
                var currentOwner = allFields[i].OwnerId;
                var currentInfluence = allFields[i].Influence[currentOwner];
                var Neighbours = allFields[i].GetNeighbours();

                var FoundNeighbour = false;
                //get the 4 neighbours, each of these will be checked
                for (var j = 0; j < Neighbours.length; j++) {

                    //skip if owner has a neighbouring gielfd, or if neighbouring field belongs to the same alliance 
                    if (Neighbours[j].OwnerId == currentOwner || allFields[i].EntityId == Neighbours[j].EntityId)  FoundNeighbour = true; 
                    

                    //pact or better:
                    //fetch relation between the two users:
                    /*
                    //Todo: Relation between two other users are lazy fetched during Diplomacy.ts (new UserDetail(userId)).showDetails(_parent);
                    var relation = 2;
                    if (currentOwner != mainObject.user.id) {
                        relation = mainObject.findUser(currentOwner).GetCurrentRelationTowardsUsers(Neighbours[j].OwnerId);
                    } else {
                        relation = mainObject.findUser(Neighbours[j].OwnerId).GetCurrentRelationTowardsUsers(currentOwner);
                    }                  
                    if (relation > 3) continue;
                    */

                }
                if (!FoundNeighbour) ToDelete.push(allFields[i]);

            }
        }

        for (var k = 0; k < ToDelete.length; k++) {
            StarMapModule.starMap.insertOwnership(ToDelete[k], 0);
        }
    }

    function SetFieldBorders(): void {
        var allFields = StarMapModule.starMap.queryAll();
      
        for (var i = 0; i < allFields.length; i++) {
            if (allFields[i].OwnerId != 0) {
                allFields[i].OwnerImagesType = allFields[i].OwnerNeigboursGet().toOwnershipId(allFields[i].OwnerId);
                allFields[i].DiplomaticImagesType = allFields[i].DiplomaticNeigboursGet().toOwnershipId(allFields[i].DiplomaticId);
                allFields[i].EntityImagesType = allFields[i].EntityNeighbourGet().toOwnershipId(allFields[i].EntityId);
            }
        }
    }
}