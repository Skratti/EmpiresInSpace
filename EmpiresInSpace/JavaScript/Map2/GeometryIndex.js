/// <reference path="Data.ts" />
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
var GameMap;
(function (GameMap) {
    GameMap.Stars = [];
    GameMap.Planets = [];
    GameMap.PlanetSurfaces = [];
    var startXY = 0; //the upper left ccordinates
    var regionsInRow = 20; // leads to 21^2 regions -> ~700 suns //ToDo: this leads to a maximum siz of the world. Units should not leave the area...
    var mapSize = 400;
    var regionSize = 20; //is always mapSize / regionsInRow
    var neighbours = []; //list of summands to get the ids of the 8 neighbouring regions
    var allFields = [];
    GameMap.regions = [];
    var Field = /** @class */ (function (_super) {
        __extends(Field, _super);
        function Field(_x, _y, _index) {
            var _this = _super.call(this) || this;
            _this.ships = [];
            _this.colonies = [];
            _this.systemObjects = [];
            _this.Influence = [];
            _this.InfluencedBy = [];
            _this.id = ((_y - startXY) * (regionsInRow * regionSize)) + _x;
            _this.X = _x;
            _this.Y = _y;
            _this.index = _index;
            return _this;
        }
        Field.prototype.AddShip = function (ship) {
            this.ships.push(ship);
            ship.field = this;
            return true;
        };
        Field.prototype.addColony = function (_colony) {
            this.colonies.push(_colony);
            _colony.field = this;
            return true;
        };
        Field.prototype.removeShip = function (ship) {
            for (var i = 0; i < this.ships.length; i++) {
                if (this.ships[i].id == ship.id) {
                    this.ships.splice(i, 1);
                    return true;
                }
            }
            return false;
        };
        Field.prototype.getScanRange = function (_scanRange, _scannedFields) {
            var leftX = this.X - _scanRange;
            var upY = this.Y - _scanRange;
            var rightX = this.X + _scanRange;
            var bottomY = this.Y + _scanRange;
            /*
             * TODO!
            IEnumerable<Area> regions = this.index.getNeighboursAndSelf();
            foreach (Area region in regions)
            {
                foreach (Field field in region.fields)
                {
                    if (field.x >= leftX
                        && field.x <= rightX
                        && field.y >= upY
                        && field.y <= bottomY)
                        _scannedFields.Add(field.id);

                }
            }
            */
        };
        Field.prototype.addInfluence = function (userId, value, influenceCreator) {
            if (this.Influence[userId]) {
                this.Influence[userId] += value;
            }
            else {
                this.Influence[userId] = value;
                this.InfluencedBy.push(influenceCreator);
            }
        };
        Field.prototype.getDistanceTo = function (target) {
            var xDist = Math.abs(this.X - target.X);
            var yDist = Math.abs(this.Y - target.Y);
            return Math.max(xDist, yDist);
        };
        Field.prototype.toWKTString = function () {
            return "POINT (" + this.X + " " + this.Y + ")";
        };
        //insert a system field, get the next ship/colony free field
        Field.prototype.nextFreeInSystem = function (originXY) {
            // Tuple<byte, byte> systemXY = null;
            if (this.starId == null)
                return null;
            /*
             * TODO: implement for System
            var size = Core.Instance.stars[(int)starId].size;

            //check all fields around the center
            for (short radius = 1; radius < size; radius++)
            {
                int left = Math.Max((short)(originXY.Item1) - radius, 0);
                int right = Math.Min((short)(originXY.Item1) + radius, size);
                int top = Math.Max((short)(originXY.Item2) - radius, 0);
                int bottom = Math.Min((short)(originXY.Item2) + radius, size);

                for(int x = left; x <  right; x++)
                {
                    
                    for (int y = top; y < bottom;y++)
                    {
                        //skip all fields inside the box
                        if (left < x && x < right && top < y && y < bottom) continue;

                        if (this.ships.Any(ship => ship.systemx == x && ship.systemy == y)) continue;
                        return new Tuple<byte, byte>((byte)x, (byte)y);
                    }
                }
            }
            */
            return null;
        };
        return Field;
    }(Coords));
    GameMap.Field = Field;
    var GeometryIndex = /** @class */ (function () {
        function GeometryIndex() {
        }
        /// <summary>
        /// fetches a ring of fields aroung the destination
        /// </summary>
        /// <param name="field"></param>
        /// <param name="distance"></param>
        /// <param name="neigbouringFields"></param>
        GeometryIndex.getNeighbourFields = function (field, distance, neigbouringFields, overallRings) {
            var leftX = field.X - distance;
            var upY = field.Y - distance;
            var rightX = field.X + distance;
            var bottomY = field.Y + distance;
            var targetRegionId;
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
                targetRegionId = this.calcRegionId(x, upY);
                neigbouringFields.push(GameMap.regions[targetRegionId].findOrCreateField(x, upY));
                targetRegionId = this.calcRegionId(x, bottomY);
                neigbouringFields.push(GameMap.regions[targetRegionId].findOrCreateField(x, bottomY));
            }
            //left and right column (except top line and bottom line)
            var ExcludedY = Math.max(1, ExcludedCornerFields);
            for (var y = upY + ExcludedY; y <= bottomY - ExcludedY; y++) {
                targetRegionId = this.calcRegionId(leftX, y);
                neigbouringFields.push(GameMap.regions[targetRegionId].findOrCreateField(leftX, y));
                targetRegionId = this.calcRegionId(rightX, y);
                neigbouringFields.push(GameMap.regions[targetRegionId].findOrCreateField(rightX, y));
            }
        };
        GeometryIndex.getFields = function (field, distance, neigbouringFields) {
            var leftX = field.X - distance;
            var upY = field.Y - distance;
            var rightX = field.X + distance;
            var bottomY = field.Y + distance;
            var targetRegionId;
            //upper row and lower row
            for (var x = leftX; x <= rightX; x++) {
                for (var y = upY; y <= bottomY; y++) {
                    targetRegionId = this.calcRegionId(x, y);
                    if (GameMap.regions[targetRegionId].existsField(x, y)) {
                        neigbouringFields.push(GameMap.regions[targetRegionId].findOrCreateField(x, y));
                    }
                }
            }
        };
        /// <summary>
        /// Fetch 4 direct neighbours
        /// </summary>
        /// <param name="field"></param>
        /// <returns></returns>
        GeometryIndex.getDirectNeighbours = function (field) {
            var neigbouringFields = [];
            var targetRegionId;
            var x = field.X - 1;
            var y = field.Y;
            targetRegionId = this.calcRegionId(x, y);
            neigbouringFields.push(GameMap.regions[targetRegionId].findOrCreateField(x, y));
            x = field.X + 1;
            y = field.Y;
            targetRegionId = this.calcRegionId(x, y);
            neigbouringFields.push(GameMap.regions[targetRegionId].findOrCreateField(x, y));
            x = field.X;
            y = field.Y - 1;
            targetRegionId = this.calcRegionId(x, y);
            neigbouringFields.push(GameMap.regions[targetRegionId].findOrCreateField(x, y));
            x = field.X;
            y = field.Y + 1;
            targetRegionId = this.calcRegionId(x, y);
            neigbouringFields.push(GameMap.regions[targetRegionId].findOrCreateField(x, y));
            return neigbouringFields;
        };
        //neighbours contains the 8 values that can be applied on a regions-index to fetch the 8 neighbouring regions
        GeometryIndex.setNeighbours = function () {
            neighbours.push((-regionsInRow) - 1);
            neighbours.push((-regionsInRow));
            neighbours.push((-regionsInRow) + 1);
            neighbours.push(-1);
            neighbours.push(1);
            neighbours.push(regionsInRow - 1);
            neighbours.push(regionsInRow);
            neighbours.push(regionsInRow + 1);
        };
        GeometryIndex.calcRegionId = function (_fieldX, _fieldY) {
            var regionX = Math.floor(_fieldX / regionSize);
            var regionY = Math.floor(_fieldY / regionSize);
            return (regionY * regionsInRow) + regionX;
        };
        /*
         * a region consists of 10x10 fields
         * a field is always unique or null
         * */
        GeometryIndex.createIndex = function () {
            var id = 0;
            for (var y = 0; y < regionsInRow; y++) {
                for (var x = 0; x < regionsInRow; x++) {
                    //var regionId = GeometryIndex.calcRegionId(x, y);
                    GameMap.regions[id] = new Area(id, x * regionsInRow, y * regionsInRow);
                    id++;
                }
            }
            this.setNeighbours();
        };
        GeometryIndex.findOrCreateField = function (xy) {
            var regionId = GeometryIndex.calcRegionId(xy.X, xy.Y);
            return GameMap.regions[regionId].findOrCreateField(xy.X, xy.Y);
        };
        return GeometryIndex;
    }());
    GameMap.GeometryIndex = GeometryIndex;
    var Area = /** @class */ (function () {
        function Area(_id, _x, _y) {
            this.id = _id;
            this.x = _x;
            this.y = _y;
            this.fields = [];
        }
        Area.prototype.existsField = function (_fieldX, _fieldY) {
            for (var j = 0; j < this.fields.length; j++) {
                if (this.fields[j].X == _fieldX && this.fields[j].Y == _fieldY)
                    return true;
            }
            return false;
        };
        Area.prototype.findOrCreateField = function (_fieldX, _fieldY) {
            for (var j = 0; j < this.fields.length; j++) {
                if (this.fields[j].X == _fieldX && this.fields[j].Y == _fieldY)
                    return this.fields[j];
            }
            return this.createField(_fieldX, _fieldY);
        };
        Area.prototype.createField = function (_fieldX, _fieldY) {
            for (var i = 0; i < 10; i++) {
                var field = new Field(_fieldX, _fieldY, this);
                this.fields.push(field);
                allFields[field.id] = field;
                return field;
            }
            return null;
        };
        Area.prototype.getNeighboursAndSelf = function () {
            var ret = [];
            for (var i = 0; i < neighbours.length; i++) {
                ret.push(GameMap.regions[this.id + neighbours[i]]);
            }
            ret.push(this);
            return ret;
        };
        return Area;
    }());
})(GameMap || (GameMap = {}));
//# sourceMappingURL=GeometryIndex.js.map