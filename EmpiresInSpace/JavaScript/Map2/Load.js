var GameMap;
(function (GameMap) {
    function LoadAllData() {
        $.connection.spaceHub.invoke("FetchAllData").done(function (e) {
            console.log("FetchAllData");
            GameMap.GeometryIndex.createIndex();
            //SystemMap
            for (var i = 0; i < e.Stars.length; i++) {
                var starExtern = e.Stars[i];
                //console.log(starExtern);
                var star = GameMap.SystemMap.CreateFromJSON(starExtern);
                var field = GameMap.GeometryIndex.findOrCreateField(star.Coords());
                GameMap.Stars[star.Id] = star;
                field.star = star;
                star.field = field;
            }
        }).fail(function (e) { console.log("Fail 2"); console.log(e); });
    }
    GameMap.LoadAllData = LoadAllData;
    function LoadPlanetSurface() {
        $.connection.spaceHub.invoke("FetchPlanetSurface").done(function (e) {
            console.log("FetchPlanetSurface");
            //SystemMap
            for (var i = 0; i < e.PlanetSurface.length; i++) {
                var planetSurfaceExtern = e.PlanetSurface[i];
                //console.log(starExtern);
                var surface = GameMap.PlanetSurface.CreateFromJSON(planetSurfaceExtern);
                GameMap.PlanetSurfaces[surface.Id] = surface;
            }
        }).fail(function (e) { console.log("Fail 2"); console.log(e); });
    }
})(GameMap || (GameMap = {}));
//# sourceMappingURL=Load.js.map