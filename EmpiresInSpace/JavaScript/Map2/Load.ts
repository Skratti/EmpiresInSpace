module GameMap {

    export function LoadAllData(){
        $.connection.spaceHub.invoke("FetchAllData").done(e => {
            console.log("FetchAllData");

            GameMap.GeometryIndex.createIndex();

            //SystemMap
            for (var i = 0; i < e.Stars.length; i++) {
                let starExtern = e.Stars[i];
                //console.log(starExtern);
                let star = GameMap.SystemMap.CreateFromJSON(starExtern);
                let field = GameMap.GeometryIndex.findOrCreateField(star.Coords());

                GameMap.Stars[star.Id] = star;
                field.star = star;
                star.field = field;
            }

        }).fail(e => { console.log("Fail 2"); console.log(e); });
    }

    function LoadPlanetSurface() {
        $.connection.spaceHub.invoke("FetchPlanetSurface").done(e => {
            console.log("FetchPlanetSurface");

            //SystemMap
            for (var i = 0; i < e.PlanetSurface.length; i++) {
                let planetSurfaceExtern = e.PlanetSurface[i];
                //console.log(starExtern);
                let surface = GameMap.PlanetSurface.CreateFromJSON(planetSurfaceExtern);

                GameMap.PlanetSurfaces[surface.Id] = surface;
            }

        }).fail(e => { console.log("Fail 2"); console.log(e); });
    }

}