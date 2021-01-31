module Renderer {

    function NextPowerOf2(n) {
        return 2 << 31 - Math.clz32(n);
    }

    function makeLabelCanvas(size, name) {
        const borderSize = 2;
        const ctx = document.createElement('canvas').getContext('2d');
        const font = `${size}px bold sans-serif`;
        ctx.font = font;
        // measure how long the name will be
        const doubleBorderSize = borderSize * 2;
        const width = NextPowerOf2(ctx.measureText(name).width + doubleBorderSize);
        const height = NextPowerOf2(size + doubleBorderSize);

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


    export function addObjectsFromMapToArea(
        currentFieldArea: THREE.Object3D[],
        fieldGroupUpperX: number,
        fieldGroupUpperY: number,
        areaId: number,
        fieldSize: number,
        tilemapSize: number

    ) {

        var RegionToAdd = GameMap.regions[areaId];

        for (var i = 0; i < RegionToAdd.fields.length; i++) {
            var fieldToAdd = RegionToAdd.fields[i];
            var sceneCoords = Renderer.createSceneCoords(fieldToAdd.X, fieldToAdd.Y);

            const root = new THREE.Object3D();

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
            const canvasLab = makeLabelCanvas(50, fieldToAdd.star.systemname);
            const textureLab = new THREE.CanvasTexture(canvasLab);
            const labelMaterial = new THREE.SpriteMaterial({ map: textureLab, color: 0xffffff });

            const label = new THREE.Sprite(labelMaterial);

            root.add(label);

            //label.position.set(x, 3, z);
            //label.position = sceneCoords;
            label.position.set(sceneCoords.x, 3, sceneCoords.z);

            // if units are meters then 0.01 here makes size
            // of the label into centimeters.
            const labelBaseScale = 0.01;
            label.scale.set(canvasLab.width / 2, canvasLab.height / 2, 1.0); //normal size
            //LAB


            currentFieldArea.push(root);
        }        
    }
}