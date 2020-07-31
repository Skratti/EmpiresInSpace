declare function Stats(): void;

declare module THREE {
	// all our code will end up here
	function Sprite(x: any): void;
	function SpriteMaterial(x: any): void;
	function TextureLoader(): void;
	function OrthographicCamera(positionLeft: number, positionRight: number, positionTop: number, positionBottom: number, zoom: number, arg: number): void;
	function GridHelper(overallsize: number, size: number, color1: number, color2: number): void;
	function Scene(): void;
	function Color(color1: number): void;
	function WebGLRenderer(parameters: any): void;
	function AmbientLight(color: number): void;
} 


//Stats is a tool to show the runtime of methods (in the upper left corner of the page)
var stats = new Stats();
stats.showPanel(1);
document.body.appendChild(stats.dom);

var fields = []; //contains the data to be drawn
var container;
var camera, scene, renderer;
var frustumSize = 1000;

var zoom = 1.0;

//set this to false if you don't have file access to nebula.png in the browser, and check function makeMaterials()
var nebulaImage = true;
var material0, material1, material2, material3, material4, material5, material6, material7, materialRed, materialBlue, materialGreen, materialYellow, materialFuchsia, materialAqua, materialBlack, materialWhite;

//areas contain the sprites to be put on the scene. They are filled when needed, and the items are removed from the scene if they aren't needed anymore...
var currentCenterAreaId;
var areas = [];
var areaSize = 38; // size in x and y direction (game coords) -> critical for game performance. Best if not more than 10.000 elements are in the scene...
var areasinScene = [];

var fieldSize = 64;
var tilemapSize = 1000;  //the size of the game map -> 1000x1000. About every second field gets a sprite to show. This can be modified in makeFields(), e.g. to show a sprite on every single field of the tilemap

var elementsInScene = 0;
var fps = 0;

var mouseDown = false,
	mouseX = 0,
	mouseY = 0;

init();
animate();
render();
setInterval(fpsCalc, 1000);

class Ship {
	image: number;
}

class Field {

	image: number;
	text: string;

	borderImage: number;
	ships: Ship[];

	dot: boolean;

	rectangle: number;

	static CreateField(): Field{
		let field = new Field();

		if (Math.random() > 0.98) { field.text = 'LoremIpsum';}

		return field;
    }
}

function setImageType() {
	nebulaImage = !nebulaImage;
	clearAndFillScene(-1000);
	clearAndFillScene(currentCenterAreaId);
}

function getFieldAreaId(x, y) {
	// projection from two dimensional value to a single dimensional value 
	// puts all fields of a quadratic region (edge length = areaSize) into the same area
	var id = Math.floor(y / areaSize) * areaSize;
	id += Math.floor(x / areaSize);
	return id;
}

function getFieldArea(x, y) {
	var id = getFieldAreaId(x, y);
	if (areas[id] == undefined) {
		areas[id] = [];
	}
	return areas[id];
}

function getAreasToHaveInScene(id) {
	var areasToHave = [];

	if (id - (areaSize + 1) >= 0) areasToHave.push(id - (areaSize + 1));  //upper left
	if (id - areaSize >= 0) areasToHave.push(id - areaSize); //upper
	if (id - (areaSize - 1) >= 0) areasToHave.push(id - (areaSize - 1)); //upper right
	if (id - 1 >= 0) areasToHave.push(id - 1); //left

	areasToHave.push(id); //center

	areasToHave.push(id + 1); //right
	areasToHave.push(id + (areaSize - 1)); //lower left
	areasToHave.push(id + areaSize); //lower
	areasToHave.push(id + (areaSize + 1)); //lower right

	return areasToHave;
}

//create the tile map
function makeFields() {
	var counter = 0;
	for (var i = 0; i < tilemapSize; i++) {
		fields[i] = [];

		for (var j = 0; j < tilemapSize; j++) {
			if (Math.random() > 0.5) { //put true into the condition to let every field have a sprite
				//every ~second field contains a tile, indicated by having a value on the position
				var mod = Math.floor(Math.random() * 8) % 8;
				fields[i][j] = mod;
				counter++;
				getFieldArea(i, j);
			}
		}
	}
	document.getElementById("elementsInMap").innerHTML = "Elements on map: " + counter;
}

function addSpritesToFieldArea(fieldGroupId) {
	if (areas[fieldGroupId] == undefined) {
		areas[fieldGroupId] = [];
	}
	var currentFieldArea = areas[fieldGroupId];

	var fieldGroupUpperX = (fieldGroupId % areaSize) * areaSize;
	var fieldGroupUpperY = Math.floor(fieldGroupId / areaSize) * areaSize;

	for (var i = fieldGroupUpperX; i < fieldGroupUpperX + areaSize; i++) {
		if (fields[i] != undefined) {
			for (var j = fieldGroupUpperY; j < fieldGroupUpperY + areaSize; j++) {
				if (fields[i][j] != undefined) {
					let field: Field = fields[i][j];

					var x = fieldSize * (i - (tilemapSize / 2)) + (fieldSize / 2);  //the grid and camera are at 0/0 , the coords ahave to be moved accordingly to the upper left by tilemapSize / 2. To fit into raster, wh have to add (fieldSize / 2)
					var y = 1;
					var z = fieldSize * (j - (tilemapSize / 2)) + (fieldSize / 2);

					var mat = chooseMaterial(fields[i][j]);
					var sprite = new THREE.Sprite(mat);

					if (nebulaImage) {
						sprite.position.set(x, 1, z);  //nebula span three fields (overlapping), so start with one field offset,+1 y level : nebula is over the grid
						sprite.scale.set(fieldSize * 3, fieldSize * 3, 1.0); //*3 to be bigger than the other objects
					}
					else {
						sprite.position.set(x, -1, z);  //images span one field, -1 y level to be behind the grid
						sprite.scale.set(fieldSize, fieldSize, 1.0); //normal size
					}

					currentFieldArea.push(sprite);
				}

			}
		}
		else continue;
	}
}

function clearAndFillScene(currentFieldGroupId) {

	var areasToHaveInScene = getAreasToHaveInScene(currentFieldGroupId);

	//clear unused areas from scene
	for (var i = areasinScene.length - 1; i >= 0; --i) {
		var fieldGroupIdToDelete = areasinScene[i];
		var shouldBeRemoved = true;
		for (var j = 0; j < areasToHaveInScene.length; j++) {
			if (areasToHaveInScene[j] === fieldGroupIdToDelete) {
				shouldBeRemoved = false;
				break;
			}
		}

		if (shouldBeRemoved) {
			//delete from scene
			var toDelete = areas[fieldGroupIdToDelete];
			for (var j = 0; j < toDelete.length; j++) {
				if (toDelete[j] == null) continue;
				scene.remove(toDelete[j]);
				elementsInScene--;
			}
			//delete from areasinScene
			areasinScene.splice(i, 1);

			//delete objects to free memory
			for (var j = 0; j < toDelete.length; j++) {
				if (toDelete[j] == null) continue;
				toDelete[j] = undefined;

			}
		}
	}

	//add areasToHaveInScene that are not yet in the scene
	for (var i = 0; i < areasToHaveInScene.length; i++) {
		var fieldGroupIdToAdd = areasToHaveInScene[i];
		var indexInareasinScene = areasinScene.indexOf(fieldGroupIdToAdd);
		if (indexInareasinScene < 0) {

			addSpritesToFieldArea(fieldGroupIdToAdd);

			var currentFieldArea2 = areas[fieldGroupIdToAdd];

			for (var j = 0; j < currentFieldArea2.length; j++) {
				if (currentFieldArea2[j] == null) continue;
				scene.add(currentFieldArea2[j]);
				elementsInScene++;
			}
			areasinScene.push(fieldGroupIdToAdd);
		}
	}
}

function makeMaterials() {
	var textureLoader = new THREE.TextureLoader();
	var nebulaTexture = textureLoader.load("images/Nebel Var 01.png");

	material0 = new THREE.SpriteMaterial({ map: nebulaTexture, color: 0xffffff });
	material1 = new THREE.SpriteMaterial({ map: nebulaTexture, color: 0xffffff, rotation: Math.PI * (1 / 4) });
	material2 = new THREE.SpriteMaterial({ map: nebulaTexture, color: 0xffffff, rotation: Math.PI * (2 / 4) });
	material3 = new THREE.SpriteMaterial({ map: nebulaTexture, color: 0xffffff, rotation: Math.PI * (3 / 4) });
	material4 = new THREE.SpriteMaterial({ map: nebulaTexture, color: 0xffffff, rotation: Math.PI });
	material5 = new THREE.SpriteMaterial({ map: nebulaTexture, color: 0xffffff, rotation: Math.PI + Math.PI * (1 / 4) });
	material6 = new THREE.SpriteMaterial({ map: nebulaTexture, color: 0xffffff, rotation: Math.PI + Math.PI * (2 / 4) });
	material7 = new THREE.SpriteMaterial({ map: nebulaTexture, color: 0xffffff, rotation: Math.PI + Math.PI * (3 / 4) });

	materialRed = new THREE.SpriteMaterial({ color: 0xff0000 });
	materialGreen = new THREE.SpriteMaterial({ color: 0x00FF00 });
	materialBlue = new THREE.SpriteMaterial({ color: 0x0000FF });
	materialRed = new THREE.SpriteMaterial({ color: 0xff0000 });
	materialYellow = new THREE.SpriteMaterial({ color: 0xffff00 });
	materialFuchsia = new THREE.SpriteMaterial({ color: 0xff00FF });
	materialAqua = new THREE.SpriteMaterial({ color: 0x00FFFF });
	materialBlack = new THREE.SpriteMaterial({ color: 0x000000 });
	materialWhite = new THREE.SpriteMaterial({ color: 0xFFFFFF });

}

function chooseMaterial(id) {

	if (nebulaImage) {
		switch (id) {
			case 0: return material0;
			case 1: return material1;
			case 2: return material2;
			case 3: return material3;
			case 4: return material4;
			case 5: return material5;
			case 6: return material6;
			case 7: return material7;
			default: return material0;
		}
	}
	else {
		switch (id) {
			case 0: return materialRed;
			case 1: return materialGreen;
			case 2: return materialBlue;
			case 3: return materialYellow;
			case 4: return materialFuchsia;
			case 5: return materialAqua;
			case 6: return materialBlack;
			case 7: return materialWhite;
			default: return materialBlack;
		}
	}
}


function init() {
	makeMaterials();
	makeFields();

	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 50);

	console.log("Init left: " + window.innerWidth / -2);
	console.log("Init right: " + window.innerWidth / 2);
	console.log("Init top: " + window.innerHeight / 2);
	console.log("Init bottom: " + window.innerHeight / -2);


	camera.position.y = 15;
	camera.lookAt(0, 0, 0);

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);

	// Grid
	var gridHelper = new THREE.GridHelper(fieldSize * tilemapSize, tilemapSize, 0x666666, 0x151515);
	scene.add(gridHelper);
	var gridHelper2 = new THREE.GridHelper(fieldSize * tilemapSize, tilemapSize / 20, 0x666666, 0x444444);
	scene.add(gridHelper2);

	//get center coordinates and fillscene
	currentCenterAreaId = getFieldAreaId(getCameraCoordinates(camera.position.x) + (tilemapSize / 2), getCameraCoordinates(camera.position.z) + (tilemapSize / 2));
	clearAndFillScene(currentCenterAreaId);

	// Lights
	var ambientLight = new THREE.AmbientLight(0x404040);
	scene.add(ambientLight);


	renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);


	window.addEventListener('resize', onWindowResize, false);

	renderer.domElement.parentElement.addEventListener('mousewheel', onMouseWheel, false);
	renderer.domElement.addEventListener('DOMMouseScroll', onMouseWheel, false); // firefox

}

function zoomOut() {
	if (zoom > 0.6) zoom -= 0.2;
	camera.zoom = zoom;
	camera.updateProjectionMatrix();
}

function zoomIn() {
	if (zoom < 1.8) zoom += 0.2;
	camera.zoom = zoom;
	camera.updateProjectionMatrix();
}

function onMouseWheel(event) {

	event.preventDefault();
	event.stopPropagation();

	let delta: number;	// added by divine intervention

	if (event.wheelDelta !== undefined) { // WebKit / Opera / Explorer 9
		delta = event.wheelDelta;
	} else if (event.detail !== undefined) { // Firefox
		delta = - event.detail;
	}

	if (delta > 0) {
		zoomIn();
	} else {
		zoomOut();
	}
}

function onWindowResize() {

	var aspect = window.innerWidth / window.innerHeight;

	/*
	camera.left   = - frustumSize * aspect / 2;
	camera.right  =   frustumSize * aspect / 2;
	camera.top    =   frustumSize / 2;
	camera.bottom = - frustumSize / 2;
	console.log(- frustumSize * aspect / 2);
	console.log(frustumSize * aspect / 2);
	console.log(frustumSize / 2);
	console.log(- frustumSize / 2);

	camera.updateProjectionMatrix();
	*/

	camera.left = window.innerWidth / -2;
	camera.right = window.innerWidth / 2;
	camera.top = window.innerHeight / 2;
	camera.bottom = window.innerHeight / -2;

	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

	render();

	requestAnimationFrame(animate);

	fps++;
	refreshLog();
}

function render() {
	stats.begin();
	renderer.render(scene, camera);
	stats.end();
}

function getGameCoords() {
	var x = (camera.position.x / fieldSize) + (tilemapSize / 2);
	var y = (camera.position.z / fieldSize) + (tilemapSize / 2);
	return { x: x, y: y };
}

function getCameraCoordinates(cameraValue) {
	var ret = (cameraValue / fieldSize);
	return ret;
}

function onMouseMove(evt) {
	evt.preventDefault();

	mouseCoords(evt);

	if (!mouseDown) {
		return;
	}

	var deltaX = evt.clientX - mouseX,
		deltaY = evt.clientY - mouseY;
	mouseX = evt.clientX;
	mouseY = evt.clientY;

	moveCamera(deltaX, deltaY);

	//detect which area the camera focuses on
	var newCenterGroupId = getFieldAreaId(getCameraCoordinates(camera.position.x) + (tilemapSize / 2), getCameraCoordinates(camera.position.z) + (tilemapSize / 2));

	//if the camera moves into a new area, dismiss some of the scene data and load new data into the scene
	if (newCenterGroupId != currentCenterAreaId) {

		currentCenterAreaId = newCenterGroupId;
		clearAndFillScene(currentCenterAreaId);
	}

}

function onMouseDown(evt) {
	evt.preventDefault();

	mouseDown = true;
	mouseX = evt.clientX;
	mouseY = evt.clientY;
}

function onMouseUp(evt) {
	evt.preventDefault();

	mouseDown = false;
}

function addMouseHandler() {
	renderer.domElement.addEventListener('mousemove', function (e) {
		onMouseMove(e);
	}, false);
	renderer.domElement.addEventListener('mousedown', function (e) {
		onMouseDown(e);
	}, false);
	renderer.domElement.addEventListener('mouseup', function (e) {
		onMouseUp(e);
	}, false);
}
addMouseHandler();

function moveCamera(deltaX, deltaY) {

	camera.position.x -= deltaX / zoom;
	camera.position.z -= deltaY / zoom;

}

function mouseCoords(evt) {
	//on screen coordinates
	document.getElementById("mouseOverPixel").innerHTML = "Mouse over pixel: " + evt.clientX + " / " + evt.clientY;

	//get game coordinates
	var mouseXtoCenteroffset = evt.clientX - (window.innerWidth / 2)
	mouseXtoCenteroffset = mouseXtoCenteroffset / (fieldSize * zoom);
	var cameraX = (camera.position.x / fieldSize) + (tilemapSize / 2);
	var mouseX = Math.floor(cameraX + mouseXtoCenteroffset);

	var windowHeight = window.innerHeight;
	var mouseYtoCenteroffset = evt.clientY - (window.innerHeight / 2)
	mouseYtoCenteroffset = mouseYtoCenteroffset / (fieldSize * zoom);
	var cameraY = (camera.position.z / fieldSize) + (tilemapSize / 2); //from camera coordinates (z) to gameCoords (y)
	var mouseY = Math.floor(cameraY + mouseYtoCenteroffset);

	document.getElementById("mouseOverField").innerHTML = "Mouse over coords: " + mouseX + " / " + mouseY;
}

function refreshLog() {

	document.getElementById("mapSize").innerHTML = "tilemapSize: " + tilemapSize + "x" + tilemapSize;
	document.getElementById("areaSize").innerHTML = "AreaSize: " + areaSize + "x" + areaSize;
	document.getElementById("imageType").innerHTML = nebulaImage ? 'Nebula' : 'Colors';
	document.getElementById("centeredOn").innerHTML = "Centered on area: " + currentCenterAreaId;
	document.getElementById("AreasinScene").innerHTML = "AreasinScene: " + getAreasToHaveInScene(currentCenterAreaId).length;
	document.getElementById("elementsInScene").innerHTML = "elementsInScene: " + elementsInScene;
	document.getElementById("tileSizeOnScreen").innerHTML = "tileSizeOnScreen: " + Math.round(fieldSize * zoom);

	var coords = getGameCoords();
	document.getElementById("cameraOverField").innerHTML = "Center Coordinates: " + Math.floor(coords.x) + " / " + Math.floor(coords.y);
}

function fpsCalc() {
	document.getElementById("fps").innerHTML = "FPS: " + fps.toString();
	fps = 0;
}