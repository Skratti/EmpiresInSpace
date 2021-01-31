var ImageCache;
(function (ImageCache) {
    //images are save as a image object (class ImageObject)
    // and are managed in the mainObjects-array imageObjects
    ImageCache.ImagesToLoad = 0;
    ImageCache.imagesLoaded = 0;
    //loads all images
    var ImageObject = /** @class */ (function () {
        function ImageObject(typeId, objectimageUrl, startUp, versionNo) {
            var _this = this;
            if (startUp === void 0) { startUp = true; }
            if (versionNo === void 0) { versionNo = 1; }
            this.typeId = typeId;
            //var typeId = instanceId;
            this.name = 'ClassMPlanet';
            this.texture = new Image();
            // damage: number;
            this.loaded = false;
            this.versionNo = 1;
            this.canvasCache = null;
            this.tileSheetCount = 1;
            this.imageSize = 60;
            this.tilesOffset = 0; //0 means no offset, 1 would mean starting drawing one tile to the upper left and ending one tile offest to the lower right, meaning the tile would be three times as big
            if (startUp) {
                //ImageCache.ImagesToLoad++;
                this.texture.onload = function () {
                    ImageCache.imagesLoaded++;
                    _this.loaded = true;
                    if (_this.typeId >= 5000 && _this.typeId < 5100) {
                        _this.tileSheetCount = 8;
                        _this.imageSize = 240;
                        _this.tilesOffset = 1.5;
                        _this.moveCost = 3;
                    }
                    checkImageLoad();
                    //mainInterface.addQuickMessage('Image' +  this.name + ' loaded', 300);
                };
                var path = "images/" + objectimageUrl + "?" + imageVersion + versionNo.toString();
                this.texture.src = path;
                var textureLoader = new THREE.TextureLoader();
                var texture3D = textureLoader.load(path);
                this.material3D = new THREE.SpriteMaterial({ map: texture3D, color: 0xffffff });
            }
        }
        ImageObject.prototype.isColonizable = function () {
            //planet earthlike
            if (this.typeId > 23 && this.typeId < 27)
                return true;
            //Moon earthlike 
            if (this.typeId == 34 || this.typeId == 35 || this.typeId == 36)
                return true;
            //desert
            if (this.typeId == 27 || this.typeId == 38) {
                if (PlayerData.PlayerResearchFind(300).isCompleted) {
                    //Helpers.Log("desert allowed");
                    return true;
                }
                //Helpers.Log("desert NOT allowed");
                return false;
            }
            //arctic
            if (this.typeId == 28 || this.typeId == 39) {
                if (PlayerData.PlayerResearchFind(301).isCompleted) {
                    return true;
                }
                return false;
            }
            //barren
            if (this.typeId == 29 || this.typeId == 40) {
                if (PlayerData.PlayerResearchFind(302).isCompleted) {
                    return true;
                }
                return false;
            }
            //asteroid
            /* // research 303 does not exist anymore (atm)
            if (this.typeId == 44) {
                if (PlayerData.PlayerResearchFind(303).isCompleted) {
                    return true;
                }
                return false;
            }*/
            //vulcanic
            if (this.typeId == 30 || this.typeId == 41) {
                if (PlayerData.PlayerResearchFind(304).isCompleted) {
                    return true;
                }
                return false;
            }
            //toxic
            if (this.typeId == 31 || this.typeId == 42) {
                if (PlayerData.PlayerResearchFind(305).isCompleted) {
                    return true;
                }
                return false;
            }
            return false;
        };
        ImageObject.prototype.isMainColony = function () {
            //planet earthlike
            if (this.typeId > 23 && this.typeId < 32)
                return true;
            return false;
        };
        ImageObject.prototype.setCanvas = function (_texture, x, y) {
            this.canvasCache = document.createElement("canvas");
            this.canvasCache.width = 60;
            this.canvasCache.height = 60;
            this.canvasCache.getContext("2d").drawImage(_texture, x, y, 60, 60, 0, 0, 60, 60);
        };
        ImageObject.prototype.setCanvasRotate = function (_texture, angle) {
            this.canvasCache = document.createElement("canvas");
            this.canvasCache.width = 600;
            this.canvasCache.height = 600;
            var context = this.canvasCache.getContext("2d");
            context.save(); //saves the state of canvas           
            context.translate(300, 300); // translate      
            context.rotate(angle * Math.PI / 180);
            context.drawImage(_texture, -300, -300);
            //-300,-300);
            //    0, 0, 60, 60,
            //   0, 0, 60, 60);
            context.restore(); //restore the state of canvas;
        };
        return ImageObject;
    }());
    ImageCache.ImageObject = ImageObject;
    /// called after each images is preLoaded, and checks if all images are ready. calls onLoadWorker.endStartup();
    function checkImageLoad() {
        //bad hack: imagesLoaded > 50 --- there are atm 87 images to Load. sometimes the first one is done before the second is constructed - this would resolve to true (1 >= 1). This hack seems to always work, but it is really not good.
        //perhaps the db-request could return the number of images, so the check would run against that number...
        if (ImageCache.imagesLoaded >= ImageCache.ImagesToLoad && ImageCache.imagesLoaded > 50) {
            ImageCache.generateObjectCanvas();
            //Helpers.Log('checkImageLoad : ' + imagesLoaded + ' -  ' + ImagesToLoad);
            onLoadWorker.objectDataLoaded = true;
            onLoadWorker.endStartup();
            onLoadWorker.progress = onLoadWorker.progress + 20;
            $('#loadingProgressbar').attr('value', onLoadWorker.progress);
            //Helpers.Log("get ObjectData done");
        }
    }
    ImageCache.checkImageLoad = checkImageLoad;
    //all images from DB
    function getSpaceObjectsFromXML(responseXML) {
        var xmlObj = responseXML.getElementsByTagName("spaceObject");
        var length = xmlObj.length;
        ImageCache.ImagesToLoad = length + 1;
        for (var i = 0; i < length; i++) {
            addXMLobject(xmlObj[i]);
        }
        mainInterface.addQuickMessage(length + ' images loaded', 3000);
    }
    ImageCache.getSpaceObjectsFromXML = getSpaceObjectsFromXML;
    //create the imageObject from XML
    function addXMLobject(XMLobject) {
        var id = XMLobject.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        var objectimageUrl = XMLobject.getElementsByTagName("objectimageUrl")[0].childNodes[0].nodeValue;
        var name = XMLobject.getElementsByTagName("name")[0].childNodes[0].nodeValue;
        var moveCost = XMLobject.getElementsByTagName("moveCost")[0].childNodes[0].nodeValue;
        //var damage = XMLobject.getElementsByTagName("damage")[0].childNodes[0].nodeValue;
        var versionNo = parseInt(XMLobject.getElementsByTagName("versionNo")[0].childNodes[0].nodeValue, 10);
        var label = parseInt(XMLobject.getElementsByTagName("label")[0].childNodes[0].nodeValue, 10);
        var newObjectType = new ImageObject(parseInt(id), objectimageUrl, true, versionNo);
        newObjectType.name = name;
        newObjectType.moveCost = parseInt(moveCost);
        //newObjectType.damage = parseInt(damage);
        newObjectType.label = label;
        newObjectType.versionNo = versionNo;
        mainObject.imageObjects[id] = newObjectType;
        //Helpers.Log('ObjectType  ' + name + ' added ' + moveCost);
    }
    ImageCache.addXMLobject = addXMLobject;
    function generateNebulaCanvas() {
        var fullNebula = mainObject.imageObjects[5000];
        var fullTexture = fullNebula.texture;
        fullNebula.setCanvas(fullTexture, 120, 360);
        //one corner:            
        createTileSetPart(5010, fullTexture, 0, 0);
        createTileSetPart(5011, fullTexture, 60, 0);
        createTileSetPart(5012, fullTexture, 120, 0);
        createTileSetPart(5013, fullTexture, 180, 0);
        //two corners:
        createTileSetPart(5020, fullTexture, 0, 60);
        createTileSetPart(5021, fullTexture, 60, 60);
        createTileSetPart(5022, fullTexture, 120, 60);
        createTileSetPart(5023, fullTexture, 180, 60);
        createTileSetPart(5024, fullTexture, 240, 60);
        createTileSetPart(5025, fullTexture, 300, 60);
        //three corners:
        createTileSetPart(5030, fullTexture, 0, 120);
        createTileSetPart(5031, fullTexture, 60, 120);
        createTileSetPart(5032, fullTexture, 120, 120);
        createTileSetPart(5033, fullTexture, 180, 120);
        //one side:
        createTileSetPart(5040, fullTexture, 0, 180);
        createTileSetPart(5041, fullTexture, 60, 180);
        createTileSetPart(5042, fullTexture, 120, 180);
        createTileSetPart(5043, fullTexture, 180, 180);
        //two sides:
        createTileSetPart(5050, fullTexture, 0, 240);
        createTileSetPart(5051, fullTexture, 60, 240);
        createTileSetPart(5052, fullTexture, 120, 240);
        createTileSetPart(5053, fullTexture, 180, 240);
        createTileSetPart(5054, fullTexture, 240, 240);
        createTileSetPart(5055, fullTexture, 300, 240);
        //three sides:
        createTileSetPart(5060, fullTexture, 0, 300);
        createTileSetPart(5061, fullTexture, 60, 300);
        createTileSetPart(5062, fullTexture, 120, 300);
        createTileSetPart(5063, fullTexture, 180, 300);
        //4
        //sides:
        createTileSetPart(5070, fullTexture, 0, 360);
        //corners
        createTileSetPart(5071, fullTexture, 60, 360);
        //one corner , one side:
        createTileSetPart(5080, fullTexture, 0, 420);
        createTileSetPart(5081, fullTexture, 60, 420);
        createTileSetPart(5082, fullTexture, 120, 420);
        createTileSetPart(5083, fullTexture, 180, 420);
        createTileSetPart(5084, fullTexture, 240, 420);
        createTileSetPart(5085, fullTexture, 300, 420);
        createTileSetPart(5086, fullTexture, 360, 420);
        createTileSetPart(5087, fullTexture, 420, 420);
        //one corner , two sides:
        createTileSetPart(5090, fullTexture, 0, 480);
        createTileSetPart(5091, fullTexture, 60, 480);
        createTileSetPart(5092, fullTexture, 120, 480);
        createTileSetPart(5093, fullTexture, 180, 480);
        //two corners , one sides:
        createTileSetPart(5100, fullTexture, 0, 540);
        createTileSetPart(5101, fullTexture, 60, 540);
        createTileSetPart(5102, fullTexture, 120, 540);
        createTileSetPart(5103, fullTexture, 180, 540);
    }
    function generateBordersYellowCanvas() {
        var fullBordersYello = mainObject.imageObjects[5200];
        var fullTexture = fullBordersYello.texture;
        fullBordersYello.setCanvas(fullTexture, 120, 360);
        //one corner:            
        createTileSetPart(5210, fullTexture, 0, 0);
        createTileSetPart(5211, fullTexture, 60, 0);
        createTileSetPart(5212, fullTexture, 120, 0);
        createTileSetPart(5213, fullTexture, 180, 0);
        //two corners:
        createTileSetPart(5220, fullTexture, 0, 60);
        createTileSetPart(5221, fullTexture, 60, 60);
        createTileSetPart(5222, fullTexture, 120, 60);
        createTileSetPart(5223, fullTexture, 180, 60);
        createTileSetPart(5224, fullTexture, 240, 60);
        createTileSetPart(5225, fullTexture, 300, 60);
        //three corners:
        createTileSetPart(5230, fullTexture, 0, 120);
        createTileSetPart(5231, fullTexture, 60, 120);
        createTileSetPart(5232, fullTexture, 120, 120);
        createTileSetPart(5233, fullTexture, 180, 120);
        //one side:
        createTileSetPart(5240, fullTexture, 0, 180);
        createTileSetPart(5241, fullTexture, 60, 180);
        createTileSetPart(5242, fullTexture, 120, 180);
        createTileSetPart(5243, fullTexture, 180, 180);
        //two sides:
        createTileSetPart(5250, fullTexture, 0, 240);
        createTileSetPart(5251, fullTexture, 60, 240);
        createTileSetPart(5252, fullTexture, 120, 240);
        createTileSetPart(5253, fullTexture, 180, 240);
        createTileSetPart(5254, fullTexture, 240, 240);
        createTileSetPart(5255, fullTexture, 300, 240);
        //three sides:
        createTileSetPart(5260, fullTexture, 0, 300);
        createTileSetPart(5261, fullTexture, 60, 300);
        createTileSetPart(5262, fullTexture, 120, 300);
        createTileSetPart(5263, fullTexture, 180, 300);
        //4
        //sides:
        createTileSetPart(5270, fullTexture, 0, 360);
        createTileSetPart(5271, fullTexture, 60, 360);
        //one corner , one side:
        createTileSetPart(5280, fullTexture, 0, 420);
        createTileSetPart(5281, fullTexture, 60, 420);
        createTileSetPart(5282, fullTexture, 120, 420);
        createTileSetPart(5283, fullTexture, 180, 420);
        createTileSetPart(5284, fullTexture, 240, 420);
        createTileSetPart(5285, fullTexture, 300, 420);
        createTileSetPart(5286, fullTexture, 360, 420);
        createTileSetPart(5287, fullTexture, 420, 420);
        //one corner , two sides:
        createTileSetPart(5290, fullTexture, 0, 480);
        createTileSetPart(5291, fullTexture, 60, 480);
        createTileSetPart(5292, fullTexture, 120, 480);
        createTileSetPart(5293, fullTexture, 180, 480);
        //two corners , one sides:
        createTileSetPart(5300, fullTexture, 0, 540);
        createTileSetPart(5301, fullTexture, 60, 540);
        createTileSetPart(5302, fullTexture, 120, 540);
        createTileSetPart(5303, fullTexture, 180, 540);
    }
    function generateBordersCanvas(imageId) {
        var fullBordersYello = mainObject.imageObjects[imageId];
        var fullTexture = fullBordersYello.texture;
        fullBordersYello.setCanvas(fullTexture, 120, 360);
        //one corner:            
        createTileSetPart(imageId + 10, fullTexture, 0, 0);
        createTileSetPart(imageId + 11, fullTexture, 60, 0);
        createTileSetPart(imageId + 12, fullTexture, 120, 0);
        createTileSetPart(imageId + 13, fullTexture, 180, 0);
        //two corners:
        createTileSetPart(imageId + 20, fullTexture, 0, 60);
        createTileSetPart(imageId + 21, fullTexture, 60, 60);
        createTileSetPart(imageId + 22, fullTexture, 120, 60);
        createTileSetPart(imageId + 23, fullTexture, 180, 60);
        createTileSetPart(imageId + 24, fullTexture, 240, 60);
        createTileSetPart(imageId + 25, fullTexture, 300, 60);
        //three corners:
        createTileSetPart(imageId + 30, fullTexture, 0, 120);
        createTileSetPart(imageId + 31, fullTexture, 60, 120);
        createTileSetPart(imageId + 32, fullTexture, 120, 120);
        createTileSetPart(imageId + 33, fullTexture, 180, 120);
        //one side:
        createTileSetPart(imageId + 40, fullTexture, 0, 180);
        createTileSetPart(imageId + 41, fullTexture, 60, 180);
        createTileSetPart(imageId + 42, fullTexture, 120, 180);
        createTileSetPart(imageId + 43, fullTexture, 180, 180);
        //two sides:
        createTileSetPart(imageId + 50, fullTexture, 0, 240);
        createTileSetPart(imageId + 51, fullTexture, 60, 240);
        createTileSetPart(imageId + 52, fullTexture, 120, 240);
        createTileSetPart(imageId + 53, fullTexture, 180, 240);
        createTileSetPart(imageId + 54, fullTexture, 240, 240);
        createTileSetPart(imageId + 55, fullTexture, 300, 240);
        //three sides:
        createTileSetPart(imageId + 60, fullTexture, 0, 300);
        createTileSetPart(imageId + 61, fullTexture, 60, 300);
        createTileSetPart(imageId + 62, fullTexture, 120, 300);
        createTileSetPart(imageId + 63, fullTexture, 180, 300);
        //4
        //sides:
        createTileSetPart(imageId + 70, fullTexture, 0, 360);
        createTileSetPart(imageId + 71, fullTexture, 60, 360);
        //one corner , one side:
        createTileSetPart(imageId + 80, fullTexture, 0, 420);
        createTileSetPart(imageId + 81, fullTexture, 60, 420);
        createTileSetPart(imageId + 82, fullTexture, 120, 420);
        createTileSetPart(imageId + 83, fullTexture, 180, 420);
        createTileSetPart(imageId + 84, fullTexture, 240, 420);
        createTileSetPart(imageId + 85, fullTexture, 300, 420);
        createTileSetPart(imageId + 86, fullTexture, 360, 420);
        createTileSetPart(imageId + 87, fullTexture, 420, 420);
        //one corner , two sides:
        createTileSetPart(imageId + 90, fullTexture, 0, 480);
        createTileSetPart(imageId + 91, fullTexture, 60, 480);
        createTileSetPart(imageId + 92, fullTexture, 120, 480);
        createTileSetPart(imageId + 93, fullTexture, 180, 480);
        //two corners , one sides:
        createTileSetPart(imageId + 100, fullTexture, 0, 540);
        createTileSetPart(imageId + 101, fullTexture, 60, 540);
        createTileSetPart(imageId + 102, fullTexture, 120, 540);
        createTileSetPart(imageId + 103, fullTexture, 180, 540);
    }
    //generates images from tileSets
    //and generates the canvas-Cache of the image
    function generateObjectCanvas() {
        //generate nebula 5000 -> 5500
        /*
        if (mainObject.imageObjects[5000] != null) {
            generateNebulaCanvas();
        }
        */
        generateBordersCanvas(5200); //light grey
        generateBordersCanvas(5400); //dark blue
        generateBordersCanvas(5600); // light blue
        generateBordersCanvas(5800); // dark green
        generateBordersCanvas(6000); // light green
        generateBordersCanvas(6200); //dark red
        generateBordersCanvas(6400); //light red
        generateBordersCanvas(6600); //orange
        generateBordersCanvas(6800); //yellow
        generateBordersCanvas(7000); //yellowGreen
        generateBordersCanvas(7200); //white
        generateBordersCanvas(7400); //darkGrey
    }
    ImageCache.generateObjectCanvas = generateObjectCanvas;
    function createTileSetPart(id, texture, x, y) {
        var tile = new ImageObject(id, null, false);
        mainObject.imageObjects[tile.typeId] = tile;
        tile.setCanvas(texture, x, y);
    }
})(ImageCache || (ImageCache = {}));
//# sourceMappingURL=ImageCanvasCache.js.map