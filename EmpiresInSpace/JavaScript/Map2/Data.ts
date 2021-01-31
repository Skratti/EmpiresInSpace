
module GameMap {

    interface Drawable3D {
        create3DObject(position: THREE.Vector3, fieldSize: number): THREE.Object3D;
    }

    abstract class spaceObject 
    {
        public Id: number;
        public X: number;
        public Y: number;
        public spaceObject() { }

        public Coords(): Coords {
            let coords = new Coords();
            coords.X = this.X;
            coords.Y = this.Y;
            return coords;
        }
    }

    //ships, colonies or anything else which can hold goods, has a position, might create an area of Influence, has a scan range
    export abstract class UserSpaceObject extends spaceObject
    {
        public abstract GetUserId() : number;

        public abstract Owner: PlayerData.User;

        public abstract  AmountOnStock() : number;
        public abstract CalcStorage(): number;

        public abstract addGood(goodsId: number, amount: number, preventNegatives: boolean, applyModifiers: boolean, reverse: boolean);

        public abstract scanRange: number;        


        public abstract posX: number;        
       
        public abstract posY: number;        

        public ScansPosition(x: number, y: number): boolean
        {
            if (this.posX - this.scanRange <= x
                && this.posX + this.scanRange >= x
                && this.posY - this.scanRange <= y
                && this.posY + this.scanRange >= y)
                return true;
            else
                return false;
        }

    }


    abstract class ColonyObject  extends spaceObject
    {

        colony: ColonyModule.Colony;
        colonizable: boolean = false;
        surfaceFields: PlanetSurface[] = []; 
        ObjectId: number;
        Star: SystemMap;
        ColonyId: number;

        IsMajorPlanet() : boolean
        {
            if (this.ObjectId >= 24 &&
                this.ObjectId <= 31) return true;
            return false;
        }


             
        freeSurfaceField(): PlanetSurface
        {
            var surfaceTileTpye = this.SurfaceTileId();            
            var freeField: PlanetSurface;;// = this.surfaceFields.FindAll(field => field.surfaceobjectid == surfaceTileTpye).OrderBy(x => Guid.NewGuid()).FirstOrDefault();
            return freeField;
        }
        SurfaceTileId() : number
        {
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
        }
       
    }

    /// <summary>
    /// Astronomical object on starMap (Sun, planet, nebula...)
    /// </summary>
    export class SystemMap extends ColonyObject implements Drawable3D
    {
        planets: SolarSystemInstance[] = [];               
        field : Field;
        startingRegion : string;
        distanceToCenter: number;
        systemname: string;
        ObjectId: number;
        type: number;
        size: number;
        startsystem: boolean;
        settled: boolean;
        ressourceid: number;
        BackgroundObjectId: number;
        BackgroundDrawSize: number;
        TilestartingAt: number;
        gif: string;
        fieldSize: number;
        drawsize: number;


        constructor(_id:number)
        {
            super();
            this.Id = _id;
            this.planets = [];
            this.surfaceFields = [];
        }                       

        getPlanet(xy: Coords): SolarSystemInstance
        {
            for (var i = 0; i < this.planets.length;i++)
            {
                if (this.planets[i] && this.planets[i].X == xy.X && this.planets[i].Y == xy.Y) return this.planets[i];
            }
            return null;
        }
   
        CalcDistance()
        {
            //Todo: use center from Galaxymap 
            this.distanceToCenter = Math.max(Math.abs(this.X - 200), Math.abs(this.Y - 200));
        }

        static CreateFromJSON(starExtern: any): SystemMap {
            let star: GameMap.SystemMap = new GameMap.SystemMap(starExtern.Id);
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
        }

        create3DObject(position : THREE.Vector3, fieldSize: number) {
            var sprite = new THREE.Sprite(mainObject.imageObjects[this.ObjectId].material3D);
            sprite.position.set(position.x, 1, position.z);
            //sprite.position = position;  //nebula span three fields (overlapping), so start with one field offset,+1 y level : nebula is over the grid
            
            

            if (this.ObjectId >= 5000 && this.ObjectId <= 5100 ) {               
                sprite.scale.set(fieldSize * 3, fieldSize * 3, 1.0); //*3 to be bigger than the other objects
            }
            else {               
                sprite.scale.set(fieldSize, fieldSize, 1.0); //normal size
            }
            //sprite.scale.set(fieldSize, fieldSize, 1.0); //*3 to be bigger than the other objects

            return sprite
        }
    }


    export class SolarSystemInstance extends ColonyObject
    {
        X: number;
        Y: number;
        SystemId: number;
        ObjectId: number;
        type: number;
        FieldSize: number;      
        Drawsize: number;
        BackgroundObjectId: number;
        BackgroundDrawSize: number;
        TilestartingAt: number;
        gif: string;
        name: string;
        size: number;


        constructor(planetId: number, planetx: number, planety: number,
            planetsystemid: number, planetobjectid: number, planetdrawsize: number)
        {
            super();
            this.Id = planetId;
            this.X = planetx;
            this.Y = planety;
            this.SystemId = planetsystemid;
            this.ObjectId = planetobjectid;            
            this.surfaceFields = [];

        }               
        
        getStar(): SystemMap
        {                        
            return GameMap.Stars[this.SystemId];
        }
                
       
    }

    export class PlanetSurface extends Coords{

        Id: number;
        Planet: SolarSystemInstance ;
        PlanetId: number;
        ColonyBuilding: ColonyModule.ColonyBuilding;

        SurfaceObjectId: number; //fieldType
        Type: number;
        Gif: string;
        Name: string;
        SurfaceBuildingId: number;
        Size: number;
        FieldSize: number;
        Drawsize: number;

        public PlanetSurface() {
        }

        constructor(id: number) {
            super();
            this.Id = id;
        }           

        static CreateFromJSON(surfaceExtern: any): GameMap.PlanetSurface {
            let surface: GameMap.PlanetSurface = new GameMap.PlanetSurface(surfaceExtern.Id);
            
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
        }
    }

    export function getAllUserData() {
        Helpers.Log("getAllUserData ");

        $.connection.spaceHub.invoke("FetchAllData").done(e => {
            //Chat.ActiveUsersDone(e);
            Helpers.Log('2 FetchAllData ' );
            //user.researchDataLoaded = true;
            Helpers.Log(e);

            for (var i = 0; i < e.Stars.length; i++) {
                var star = e.Stars[i];
                Helpers.Log(star);
               
            }


            Helpers.Log("getAllUserData done");
        });
    }

}