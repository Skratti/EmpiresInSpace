var PlanetType = /** @class */ (function () {
    function PlanetType(id) {
        this.id = 0;
        this.label = 1;
        this.description = 1;
        this.objectId = 1;
        this.researchRequired = 1;
        this.colonyCenter = 1;
        this.id = id;
    }
    PlanetType.prototype.updateFromJSON = function (planetType) {
        this.label = planetType.label;
        this.description = planetType.description;
        this.objectId = planetType.objectId;
        this.researchRequired = planetType.researchRequired;
        this.colonyCenter = planetType.colonyCenter;
    };
    PlanetType.prototype.update = function (XMLobjectOnMap) {
        this.id = parseInt(XMLobjectOnMap.getElementsByTagName("id")[0].childNodes[0].nodeValue, 10);
        this.label = parseInt(XMLobjectOnMap.getElementsByTagName("label")[0].childNodes[0].nodeValue, 10);
        this.description = parseInt(XMLobjectOnMap.getElementsByTagName("description")[0].childNodes[0].nodeValue, 10);
        this.objectId = parseInt(XMLobjectOnMap.getElementsByTagName("objectId")[0].childNodes[0].nodeValue, 10);
        this.researchRequired = parseInt(XMLobjectOnMap.getElementsByTagName("researchRequired")[0].childNodes[0].nodeValue, 10);
        this.colonyCenter = parseInt(XMLobjectOnMap.getElementsByTagName("colonyCenter")[0].childNodes[0].nodeValue, 10);
    };
    PlanetType.PlanetTypesAdd = function (XMLobject, id) {
        var newPlanetType = new PlanetType(id);
        //add to Building array
        mainObject.planetTypes[id] = newPlanetType;
        //get all Building Data out of the XMLbuilding
        newPlanetType.update(XMLobject);
    };
    ;
    PlanetType.GetPlanetTypes = function () {
        console.log('GetPlanetTypes 1');
        $.connection.spaceHub.invoke("GetPlanetTypes").done(function (e) {
            mainObject.planetTypes = e.PlanetTypes;
            console.log(planetTypes);
            for (var i = 0; i < e.PlanetTypes.length; i++) {
                var planetTypes = e.PlanetTypes[i];
                console.log(planetTypes);
                mainObject.planetTypes[planetTypes.id] = new PlanetType(planetTypes.id);
                mainObject.planetTypes[planetTypes.id].updateFromJSON(planetTypes);
                //console.log(mainObject.planetTypes[planetTypes.id].label.toString());
            }
        });
    };
    return PlanetType;
}());
//# sourceMappingURL=PlanetType.js.map