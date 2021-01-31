var FogOfWarModule;
(function (FogOfWarModule) {
    var isClientSaved = true;
    var isServerSaved = true;
    var version = 0;
    var Field = /** @class */ (function () {
        function Field(x, y) {
            this.x = x;
            this.y = y;
        }
        return Field;
    }());
    FogOfWarModule.Field = Field;
    var Box = /** @class */ (function () {
        //wdith = 1 if the box is a field
        function Box(lowerLeft, width) {
            if (width === void 0) { width = 1; }
            this.lowerLeft = lowerLeft;
            this.width = width;
        }
        Box.prototype.containsPoint = function (fieldBox) {
            if (fieldBox.width > 1)
                return false;
            var fieldLowerLeft = fieldBox.lowerLeft;
            var ret = this.lowerLeft.x <= fieldLowerLeft.x
                && this.lowerLeft.x + this.width > fieldLowerLeft.x
                && this.lowerLeft.y <= fieldLowerLeft.y
                && this.lowerLeft.y + this.width > fieldLowerLeft.y;
            return ret;
        };
        Box.prototype.intersectsBox = function (otherBox) {
            var ret = this.lowerLeft.x < otherBox.lowerLeft.x + otherBox.width && otherBox.lowerLeft.x < this.lowerLeft.x + this.width
                && this.lowerLeft.y < otherBox.lowerLeft.y + otherBox.width && otherBox.lowerLeft.y < this.lowerLeft.y + this.width;
            return ret;
        };
        return Box;
    }());
    FogOfWarModule.Box = Box;
    function makeBox(x, y, width) {
        if (width === void 0) { width = 1; }
        var FogOfWarModuleField = new FogOfWarModule.Field(x, y);
        return new Box(FogOfWarModuleField, width);
    }
    FogOfWarModule.makeBox = makeBox;
    var FogOfWarRegion = /** @class */ (function () {
        function FogOfWarRegion(region) {
            //up to 4 boxes with width=1 are included
            this.fields = [];
            //if all sub-elements are 100% discovered
            this.isDiscovered = false;
            this.region = region;
        }
        FogOfWarRegion.prototype.setIsDiscovered = function () {
            //Lowermost level
            if (this.region.width == 2
                && this.fields.length == 4) {
                this.isDiscovered = true;
                this.fields = [];
                return;
            }
            //Middle Level, all childs have to be discovered
            if (this.A != null) {
                if (this.A.isDiscovered
                    && this.B.isDiscovered
                    && this.C.isDiscovered
                    && this.D.isDiscovered) {
                    this.isDiscovered = true;
                    this.A = null;
                    this.B = null;
                    this.C = null;
                    this.D = null;
                    return;
                }
            }
        };
        FogOfWarRegion.prototype.insert = function (field) {
            // Ignore objects that do not belong in this quad tree
            if (!this.region.containsPoint(field))
                return false; // object cannot be added
            if (this.isDiscovered)
                return false;
            //skip if field already exists on the current level:
            for (var i = 0; i < this.fields.length; i++) {
                if (this.fields[i].lowerLeft.x == field.lowerLeft.x
                    && this.fields[i].lowerLeft.y == field.lowerLeft.y)
                    return false;
            }
            // If there is space in this quad tree, add the object here
            if (this.A == null && this.fields.length < 4) {
                isClientSaved = false;
                isServerSaved = false;
                this.fields.push(field);
                this.setIsDiscovered();
                return true;
            }
            // Otherwise, subdivide and then add the point to whichever node will accept it
            if (this.A == null)
                this.subdivide();
            if (this.A.insert(field)) {
                this.setIsDiscovered();
                return true;
            }
            if (this.B.insert(field)) {
                this.setIsDiscovered();
                return true;
            }
            if (this.C.insert(field)) {
                this.setIsDiscovered();
                return true;
            }
            if (this.D.insert(field)) {
                this.setIsDiscovered();
                return true;
            }
            // Otherwise, the point cannot be inserted for some unknown reason (this should never happen)
            return false;
        };
        // create four children that fully divide this quad into four quads of equal area
        FogOfWarRegion.prototype.subdivide = function () {
            var x = this.region.lowerLeft.x;
            var y = this.region.lowerLeft.y;
            var halfDimension = this.region.width / 2;
            var aLowerLeft = new Field(x, y + halfDimension);
            var aBox = new Box(aLowerLeft, halfDimension);
            this.A = new FogOfWarRegion(aBox);
            var bLowerLeft = new Field(x + halfDimension, y + halfDimension);
            var bBox = new Box(bLowerLeft, halfDimension);
            this.B = new FogOfWarRegion(bBox);
            var cLowerLeft = new Field(x, y);
            var cBox = new Box(cLowerLeft, halfDimension);
            this.C = new FogOfWarRegion(cBox);
            var dLowerLeft = new Field(x + halfDimension, y);
            var dBox = new Box(dLowerLeft, halfDimension);
            this.D = new FogOfWarRegion(dBox);
            //move the fields to the lower layer
            for (var i = 0; i < this.fields.length; i++) {
                this.A.insert(this.fields[i]);
                this.B.insert(this.fields[i]);
                this.C.insert(this.fields[i]);
                this.D.insert(this.fields[i]);
            }
            this.fields = [];
        };
        //returns all boxes that overlap with the range
        FogOfWarRegion.prototype.queryRange = function (range) {
            var includedBoxes = [];
            if (!this.region.intersectsBox(range))
                return includedBoxes; // empty list            
            //if the whole box is already discovered:
            if (this.isDiscovered) {
                includedBoxes.push(this.region);
                return includedBoxes;
            }
            // Add objects at this quad level
            includedBoxes = includedBoxes.concat(this.fields);
            // Terminate here, if there are no children
            if (this.A == null)
                return includedBoxes;
            // Otherwise, add the points from the children
            includedBoxes = includedBoxes.concat(this.A.queryRange(range));
            includedBoxes = includedBoxes.concat(this.B.queryRange(range));
            includedBoxes = includedBoxes.concat(this.C.queryRange(range));
            includedBoxes = includedBoxes.concat(this.D.queryRange(range));
            return includedBoxes;
        };
        FogOfWarRegion.prototype.serialize = function () {
            //isDiscovered = X
            if (this.isDiscovered)
                return '"X":"*"';
            //Fields - array with xy coordinates
            if (this.A == null) {
                var ret = '"fields":[';
                for (var i = 0; i < this.fields.length; i++) {
                    ret += '{"x":' + this.fields[i].lowerLeft.x + ',"y":' + this.fields[i].lowerLeft.y + '},';
                }
                if (ret.substr(ret.length - 1, 1) == ',')
                    ret = ret.substring(0, ret.length - 1);
                ret += ']';
                return ret;
            }
            //or sub-regions, if the subregion contains data
            var ret = '';
            var textAdded = false;
            if (this.A.fields.length > 0 || this.A.A != null || this.A.isDiscovered) {
                ret += '"A":{' + this.A.serialize() + '}';
                textAdded = true;
            }
            if (this.B.fields.length > 0 || this.B.A != null || this.B.isDiscovered) {
                if (textAdded)
                    ret += ',';
                ret += '"B":{' + this.B.serialize() + '}';
                textAdded = true;
            }
            if (this.C.fields.length > 0 || this.C.A != null || this.C.isDiscovered) {
                if (textAdded)
                    ret += ',';
                ret += '"C":{' + this.C.serialize() + '}';
                textAdded = true;
            }
            if (this.D.fields.length > 0 || this.D.A != null || this.D.isDiscovered) {
                if (textAdded)
                    ret += ',';
                ret += '"D":{' + this.D.serialize() + '}';
                textAdded = true;
            }
            return ret;
        };
        FogOfWarRegion.prototype.deSerialize = function (fogJson) {
            if (typeof fogJson["X"] !== "undefined") {
                this.isDiscovered = true;
                return;
            }
            if (typeof fogJson["fields"] !== "undefined") {
                for (var i = 0; i < fogJson["fields"].length; i++) {
                    var x = parseInt(fogJson["fields"][i]["x"]);
                    var y = parseInt(fogJson["fields"][i]["y"]);
                    this.fields.push(makeBox(x, y));
                }
                return;
            }
            this.subdivide();
            if (typeof fogJson["A"] !== "undefined") {
                this.A.deSerialize(fogJson["A"]);
            }
            if (typeof fogJson["B"] !== "undefined") {
                this.B.deSerialize(fogJson["B"]);
            }
            if (typeof fogJson["C"] !== "undefined") {
                this.C.deSerialize(fogJson["C"]);
            }
            if (typeof fogJson["D"] !== "undefined") {
                this.D.deSerialize(fogJson["D"]);
            }
        };
        FogOfWarRegion.prototype.deSerializeRoot = function (fogString) {
            this.isDiscovered = false;
            this.fields = [];
            this.A = null;
            this.B = null;
            this.C = null;
            this.D = null;
            if (!fogString)
                return;
            //var fogString = '{"A":{"D":{"D":{"D":{"D":{"D":{"D":{"D":{"B":{"A":{"fields":[{"x":4995,"y":5012}]},"B":{"C":{"fields":[{"x":4997,"y":5012},{"x":4997,"y":5013},{"x":4996,"y":5012}]},"D":{"X":"*"}},"C":{"B":{"fields":[{"x":4995,"y":5010},{"x":4995,"y":5011},{"x":4994,"y":5010}]},"D":{"X":"*"}},"D":{"X":"*"}},"C":{"fields":[{"x":4991,"y":5000}]},"D":{"A":{"B":{"X":"*"},"C":{"X":"*"},"D":{"X":"*"}},"B":{"A":{"X":"*"},"B":{"fields":[{"x":4998,"y":5007},{"x":4999,"y":5007},{"x":4998,"y":5006}]},"C":{"X":"*"},"D":{"X":"*"}},"C":{"X":"*"},"D":{"X":"*"}}}}}}}}}},"B":{"C":{"C":{"C":{"C":{"C":{"C":{"C":{"A":{"A":{"fields":[{"x":5000,"y":5012},{"x":5000,"y":5013},{"x":5001,"y":5012},{"x":5001,"y":5013}]},"C":{"A":{"X":"*"},"C":{"X":"*"}}},"C":{"A":{"A":{"X":"*"},"C":{"X":"*"}},"C":{"A":{"X":"*"},"B":{"fields":[{"x":5002,"y":5002},{"x":5002,"y":5003}]},"C":{"X":"*"},"D":{"X":"*"}},"D":{"fields":[{"x":5004,"y":5000},{"x":5004,"y":5001}]}}}}}}}}}},"C":{"B":{"B":{"B":{"B":{"B":{"B":{"B":{"A":{"fields":[{"x":4991,"y":4996},{"x":4991,"y":4997},{"x":4991,"y":4998},{"x":4991,"y":4999}]},"B":{"A":{"X":"*"},"B":{"A":{"X":"*"},"B":{"fields":[{"x":4998,"y":4999},{"x":4999,"y":4999}]},"C":{"fields":[{"x":4996,"y":4997}]}}}}}}}}}}},"D":{"A":{"A":{"A":{"A":{"A":{"A":{"A":{"A":{"A":{"A":{"X":"*"},"B":{"X":"*"},"C":{"fields":[{"x":5000,"y":4997},{"x":5001,"y":4997}]},"D":{"fields":[{"x":5002,"y":4997},{"x":5003,"y":4997}]}},"B":{"fields":[{"x":5004,"y":4997},{"x":5004,"y":4998},{"x":5004,"y":4999}]}}}}}}}}}}}';
            var fogJson = JSON.parse(fogString);
            if (typeof fogJson["fogVersion"] !== "undefined") {
                var cversion = parseInt(fogJson["fogVersion"]);
                Helpers.Log("Deserializing FoW Version: " + cversion.toString(), Helpers.LogType.FoW);
                version = cversion;
                //Helpers.Log("Restored Fog of War Version " + version.toString());
            }
            this.deSerialize(fogJson);
        };
        FogOfWarRegion.prototype.serializeRoot = function () {
            return '{"fogVersion":' + version + ',' + this.serialize() + '}';
        };
        FogOfWarRegion.prototype.save = function (server) {
            if (!onLoadWorker.Done) {
                Helpers.Log("FogOfWar save() when not fully loaded", Helpers.LogType.FoW);
                return;
            }
            if (isClientSaved && isServerSaved)
                return;
            ///////////////
            // TEMPORARY
            version += 1;
            var serializedTree = this.serializeRoot();
            isClientSaved = true;
            if (server) {
                this.saveToServer(serializedTree);
                isServerSaved = true;
            }
            return;
            //
            ///////////////
            //client can have a higher versionId than Server
            //During movement, fow is only saved to the client.
            //After movement, Server is updated
            /*
            if (!isClientSaved) {
                version += 1;
            }
            var serializedTree = this.serializeRoot();

            if (!isClientSaved) {
                this.saveToClient(serializedTree);
                isClientSaved = true;
            }

            if (server) {
                this.saveToServer(serializedTree);
                isServerSaved = true;
            }
            */
        };
        FogOfWarRegion.prototype.saveToServer = function (serializedTree) {
            Helpers.Log("FogOfWar saveToServer() Version: " + version.toString(), Helpers.LogType.FoW);
            var postData = serializedTree;
            $.ajax("Server/User.aspx?action=saveFog&fogVersion=" + version.toString(), {
                type: "POST",
                data: postData,
                processData: false
            });
        };
        FogOfWarRegion.prototype.saveToClient = function (serializedTree) {
            if (!Helpers.supportsHtmlStorage())
                return;
            localStorage.setItem(mainObject.user.id.toString() + "." + galaxyMap.name + ".fog", serializedTree);
        };
        FogOfWarRegion.prototype.load = function () {
            ///////////////
            // TEMPORARY
            //puh - there was a reason why the client was not to be trusted
            // possibly because the fow was randomly resetted
            this.loadFromServer();
            return;
            //
            ///////////////
            /*
            if (!Helpers.supportsHtmlStorage()) {
                //Helpers.Log("load Server 1:" + fogString);
                this.loadFromServer();
                return;
            }

            //load from client
            var fogString = localStorage.getItem(mainObject.user.id.toString() + "." + galaxyMap.name +  ".fog");
            //Helpers.Log("load Client:" + fogString);
            if (fogString) {
                Helpers.Log("Deserializing from Client", Helpers.LogType.FoW);
                this.deSerializeRoot(fogString);
            }

            //load from server if needed
            if (version < mainObject.user.fogVersion) {
                //Helpers.Log("load Server 2:" + fogString);
                //version = mainObject.user.fogVersion;
                //Helpers.Log("version < mainObject.user.fogVersion : " + version.toString() + " < " + mainObject.user.fogVersion.toString());
                this.loadFromServer();
                return;
            }
            */
        };
        FogOfWarRegion.prototype.loadFromServer = function () {
            var _this = this;
            version = mainObject.user.fogVersion;
            $.ajax("Server/User.aspx", {
                "type": "GET",
                "async": true,
                "data": {
                    "action": "getFog"
                }
            }).done(function (msg) { Helpers.Log("Getting Fog from Server", Helpers.LogType.FoW); _this.deSerializeRoot(msg); });
        };
        return FogOfWarRegion;
    }());
    FogOfWarModule.FogOfWarRegion = FogOfWarRegion;
})(FogOfWarModule || (FogOfWarModule = {}));
//# sourceMappingURL=FogOfWar.js.map