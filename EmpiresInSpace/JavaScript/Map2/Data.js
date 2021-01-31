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
    var spaceObject = /** @class */ (function () {
        function spaceObject() {
        }
        spaceObject.prototype.spaceObject = function () { };
        spaceObject.prototype.Coords = function () {
            var coords = new Coords();
            coords.X = this.X;
            coords.Y = this.Y;
            return coords;
        };
        return spaceObject;
    }());
    //ships, colonies or anything else which can hold goods, has a position, might create an area of Influence, has a scan range
    var UserSpaceObject = /** @class */ (function (_super) {
        __extends(UserSpaceObject, _super);
        function UserSpaceObject() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UserSpaceObject.prototype.ScansPosition = function (x, y) {
            if (this.posX - this.scanRange <= x
                && this.posX + this.scanRange >= x
                && this.posY - this.scanRange <= y
                && this.posY + this.scanRange >= y)
                return true;
            else
                return false;
        };
        return UserSpaceObject;
    }(spaceObject));
    GameMap.UserSpaceObject = UserSpaceObject;
    var ColonyObject = /** @class */ (function (_super) {
        __extends(ColonyObject, _super);
        function ColonyObject() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.colonizable = false;
            _this.surfaceFields = [];
            return _this;
        }
        ColonyObject.prototype.IsMajorPlanet = function () {
            if (this.ObjectId >= 24 &&
                this.ObjectId <= 31)
                return true;
            return false;
        };
        ColonyObject.prototype.freeSurfaceField = function () {
            var surfaceTileTpye = this.SurfaceTileId();
            var freeField;
            ; // = this.surfaceFields.FindAll(field => field.surfaceobjectid == surfaceTileTpye).OrderBy(x => Guid.NewGuid()).FirstOrDefault();
            return freeField;
        };
        ColonyObject.prototype.SurfaceTileId = function () {
            //desert
            if (this.ObjectId >= 24 && this.ObjectId <= 26) {
                return 1;
            }
            //desert
            if (this.ObjectId == 27 || this.ObjectId == 38) {
                return 5;
            }
            //arctic
            if (this.ObjectId == 28 || this.ObjectId == 39) {
                return 6;
            }
            //barren
            if (this.ObjectId == 29 || this.ObjectId == 40) {
                return 7;
            }
            //asteroid
            if (this.ObjectId == 44) {
                return 8;
            }
            //vulcanic
            if (this.ObjectId == 30 || this.ObjectId == 41) {
                return 9;
            }
            //toxic
            if (this.ObjectId == 31 || this.ObjectId == 42) {
                return 10;
            }
            //fallback : gras
            return 1;
        };
        return ColonyObject;
    }(spaceObject));
    /// <summary>
    /// Astronomical object on starMap (Sun, planet, nebula...)
    /// </summary>
    var SystemMap = /** @class */ (function (_super) {
        __extends(SystemMap, _super);
        function SystemMap(_id) {
            var _this = _super.call(this) || this;
            _this.planets = [];
            _this.Id = _id;
            _this.planets = [];
            _this.surfaceFields = [];
            return _this;
        }
        SystemMap.prototype.getPlanet = function (xy) {
            for (var i = 0; i < this.planets.length; i++) {
                if (this.planets[i] && this.planets[i].X == xy.X && this.planets[i].Y == xy.Y)
                    return this.planets[i];
            }
            return null;
        };
        SystemMap.prototype.CalcDistance = function () {
            //Todo: use center from Galaxymap 
            this.distanceToCenter = Math.max(Math.abs(this.X - 200), Math.abs(this.Y - 200));
        };
        SystemMap.CreateFromJSON = function (starExtern) {
            var star = new GameMap.SystemMap(starExtern.Id);
            star.startingRegion = starExtern.startingRegion;
            star.distanceToCenter = starExtern.distanceToCenter;
            star.X = starExtern.posX;
            star.Y = starExtern.posY;
            star.systemname = starExtern.systemname;
            star.ObjectId = starExtern.ObjectId;
            star.type = starExtern.type;
            star.size = starExtern.size;
            star.startsystem = starExtern.startsystem;
            star.settled = starExtern.settled;
            star.ressourceid = starExtern.ressourceid;
            star.BackgroundObjectId = starExtern.BackgroundObjectId;
            star.BackgroundDrawSize = starExtern.BackgroundDrawSize;
            star.TilestartingAt = starExtern.TilestartingAt;
            star.gif = starExtern.gif;
            star.fieldSize = starExtern.fieldSize;
            star.drawsize = starExtern.drawsize;
            star.Id = starExtern.Id;
            star.ColonyId = starExtern.ColonyId;
            return star;
        };
        SystemMap.prototype.create3DObject = function (position, fieldSize) {
            var sprite = new THREE.Sprite(mainObject.imageObjects[this.ObjectId].material3D);
            sprite.position.set(position.x, 1, position.z);
            //sprite.position = position;  //nebula span three fields (overlapping), so start with one field offset,+1 y level : nebula is over the grid
            if (this.ObjectId >= 5000 && this.ObjectId <= 5100) {
                sprite.scale.set(fieldSize * 3, fieldSize * 3, 1.0); //*3 to be bigger than the other objects
            }
            else {
                sprite.scale.set(fieldSize, fieldSize, 1.0); //normal size
            }
            //sprite.scale.set(fieldSize, fieldSize, 1.0); //*3 to be bigger than the other objects
            return sprite;
        };
        return SystemMap;
    }(ColonyObject));
    GameMap.SystemMap = SystemMap;
    var SolarSystemInstance = /** @class */ (function (_super) {
        __extends(SolarSystemInstance, _super);
        function SolarSystemInstance(planetId, planetx, planety, planetsystemid, planetobjectid, planetdrawsize) {
            var _this = _super.call(this) || this;
            _this.Id = planetId;
            _this.X = planetx;
            _this.Y = planety;
            _this.SystemId = planetsystemid;
            _this.ObjectId = planetobjectid;
            _this.surfaceFields = [];
            return _this;
        }
        SolarSystemInstance.prototype.getStar = function () {
            return GameMap.Stars[this.SystemId];
        };
        return SolarSystemInstance;
    }(ColonyObject));
    GameMap.SolarSystemInstance = SolarSystemInstance;
    var PlanetSurface = /** @class */ (function (_super) {
        __extends(PlanetSurface, _super);
        function PlanetSurface(id) {
            var _this = _super.call(this) || this;
            _this.Id = id;
            return _this;
        }
        PlanetSurface.prototype.PlanetSurface = function () {
        };
        PlanetSurface.CreateFromJSON = function (surfaceExtern) {
            var surface = new GameMap.PlanetSurface(surfaceExtern.Id);
            surface.Id = surfaceExtern.startingRegion;
            surface.Planet = surfaceExtern.startingRegion;
            surface.PlanetId = surfaceExtern.startingRegion;
            surface.ColonyBuilding = surfaceExtern.startingRegion;
            surface.SurfaceObjectId = surfaceExtern.startingRegion;
            surface.Type = surfaceExtern.startingRegion;
            surface.Gif = surfaceExtern.startingRegion;
            surface.Name = surfaceExtern.startingRegion;
            surface.SurfaceBuildingId = surfaceExtern.startingRegion;
            surface.Size = surfaceExtern.startingRegion;
            surface.FieldSize = surfaceExtern.startingRegion;
            surface.Drawsize = surfaceExtern.startingRegion;
            return surface;
        };
        return PlanetSurface;
    }(Coords));
    GameMap.PlanetSurface = PlanetSurface;
    function getAllUserData() {
        Helpers.Log("getAllUserData ");
        $.connection.spaceHub.invoke("FetchAllData").done(function (e) {
            //Chat.ActiveUsersDone(e);
            Helpers.Log('2 FetchAllData ');
            //user.researchDataLoaded = true;
            Helpers.Log(e);
            for (var i = 0; i < e.Stars.length; i++) {
                var star = e.Stars[i];
                Helpers.Log(star);
            }
            Helpers.Log("getAllUserData done");
        });
    }
    GameMap.getAllUserData = getAllUserData;
})(GameMap || (GameMap = {}));
//# sourceMappingURL=Data.js.map