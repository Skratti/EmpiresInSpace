class PlanetType {
    id = 0;
    label = 1;
    description: number = 1;
    objectId: number = 1;
    researchRequired: number = 1;
    colonyCenter: number = 1;

    constructor(id) {
        this.id = id;
    }

    updateFromJSON(planetType: any): void {
        this.label = planetType.label;
        this.description = planetType.description;
        this.objectId = planetType.objectId;
        this.researchRequired = planetType.researchRequired;
        this.colonyCenter = planetType.colonyCenter;
    }

    update(XMLobjectOnMap: Element) {

        this.id = parseInt(XMLobjectOnMap.getElementsByTagName("id")[0].childNodes[0].nodeValue, 10);
        this.label = parseInt(XMLobjectOnMap.getElementsByTagName("label")[0].childNodes[0].nodeValue, 10);
        this.description = parseInt(XMLobjectOnMap.getElementsByTagName("description")[0].childNodes[0].nodeValue, 10);
        this.objectId = parseInt(XMLobjectOnMap.getElementsByTagName("objectId")[0].childNodes[0].nodeValue, 10);
        this.researchRequired = parseInt(XMLobjectOnMap.getElementsByTagName("researchRequired")[0].childNodes[0].nodeValue, 10);
        this.colonyCenter = parseInt(XMLobjectOnMap.getElementsByTagName("colonyCenter")[0].childNodes[0].nodeValue, 10);
    }

    static PlanetTypesAdd(XMLobject, id: number) {
        var newPlanetType = new PlanetType(id);

        //add to Building array
        mainObject.planetTypes[id] = newPlanetType;

        //get all Building Data out of the XMLbuilding
        newPlanetType.update(XMLobject);
    };

    static GetPlanetTypes() {
        console.log('GetPlanetTypes 1');
        $.connection.spaceHub.invoke("GetPlanetTypes").done(e => {

            for (var i = 0; i < e.PlanetTypes.length; i++) {
                var planetTypes = e.PlanetTypes[i];
                //console.log(planetTypes);                
                mainObject.planetTypes[planetTypes.id] = new PlanetType(planetTypes.id);
                mainObject.planetTypes[planetTypes.id].updateFromJSON(planetTypes);                
                //console.log(mainObject.planetTypes[planetTypes.id].label.toString());
            }

        });

    }
}