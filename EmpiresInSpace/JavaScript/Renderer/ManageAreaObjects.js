var Renderer;
(function (Renderer) {
    function NextPowerOf2(n) {
        return 2 << 31 - Math.clz32(n);
    }
    function makeLabelCanvas(size, name) {
        var borderSize = 2;
        var ctx = document.createElement('canvas').getContext('2d');
        var font = size + "px bold sans-serif";
        ctx.font = font;
        // measure how long the name will be
        var doubleBorderSize = borderSize * 2;
        var width = NextPowerOf2(ctx.measureText(name).width + doubleBorderSize);
        var height = NextPowerOf2(size + doubleBorderSize);
        console.log("width: " + width + " | height: " + height);
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        // need to set font again after resizing canvas
        ctx.font = font;
        ctx.textBaseline = 'top';
        ctx.fillStyle = "rgba(255, 255, 255, 0)"; //transparent
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.fillText(name, borderSize, borderSize);
        return ctx.canvas;
    }
    function addObjectsFromMapToArea(currentFieldArea, fieldGroupUpperX, fieldGroupUpperY, areaId, fieldSize, tilemapSize) {
        var RegionToAdd = GameMap.regions[areaId];
        for (var i = 0; i < RegionToAdd.fields.length; i++) {
            var fieldToAdd = RegionToAdd.fields[i];
            var sceneCoords = Renderer.createSceneCoords(fieldToAdd.X, fieldToAdd.Y);
            var root = new THREE.Object3D();
            /*
            if (nebulaImage) {
                sprite.position.set(x, 1, z);  //nebula span three fields (overlapping), so start with one field offset,+1 y level : nebula is over the grid
                sprite.scale.set(fieldSize * 3, fieldSize * 3, 1.0); //*3 to be bigger than the other objects
            }
            else {
                sprite.position.set(x, -1, z);  //images span one field, -1 y level to be behind the grid
                sprite.scale.set(fieldSize, fieldSize, 1.0); //normal size
            }*/
            var sprite = fieldToAdd.star.create3DObject(sceneCoords, fieldSize);
            root.add(sprite);
            //LAB
            var canvasLab = makeLabelCanvas(50, fieldToAdd.star.systemname);
            var textureLab = new THREE.CanvasTexture(canvasLab);
            var labelMaterial = new THREE.SpriteMaterial({ map: textureLab, color: 0xffffff });
            var label = new THREE.Sprite(labelMaterial);
            root.add(label);
            //label.position.set(x, 3, z);
            //label.position = sceneCoords;
            label.position.set(sceneCoords.x, 3, sceneCoords.z);
            // if units are meters then 0.01 here makes size
            // of the label into centimeters.
            var labelBaseScale = 0.01;
            label.scale.set(canvasLab.width / 2, canvasLab.height / 2, 1.0); //normal size
            //LAB
            currentFieldArea.push(root);
        }
    }
    Renderer.addObjectsFromMapToArea = addObjectsFromMapToArea;
})(Renderer || (Renderer = {}));
//# sourceMappingURL=ManageAreaObjects.js.map