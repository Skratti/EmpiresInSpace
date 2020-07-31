<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ThreeJS_ProofOfConcept.aspx.cs" Inherits="EmpiresInSpace.ThreeJS_ProofOfConcept" %>

<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Orthographic top down tilemap with sprites sample</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
		<style>
			body {
				font-family: Monospace;
				background-color: #f0f0f0;
				margin: 0px;
				overflow: hidden;
			}
		</style>
	</head>
	<body>

        <div id="log"  style="position:fixed; right:0px; background-color:#333333; background-color:#333333aa; display:inline-block;color:white;padding:5px;">
            <div id="fps">60</div>
            <div id="mapSize">1000x1000</div>
            <div id="elementsInMap">The amount of elements (each will be represented by a sprite) of the map</div>
            <div id="areaSize">AreaSize: 100x100</div>
            <div><a id="imageType" href="#" onclick="setImageType();return false;" style="color:white">Nebula image</a></div>
            <div id="centeredOn">Centered on areaId - the center area and all surrounding ones are added to the scene</div>
            <div id="AreasinScene">The number of areas added to the scene - near the border of the game area the number of areas in scene will be lower than 9</div>
            <div id="elementsInScene">The amount of elements added to the scene</div>
            <div id="tileSizeOnScreen">The tileSize (depending on zoom)</div>
            <div id="cameraOverField">Center Coordinates:</div>
            <div id="mouseOverPixel">Mouse over Pixel: X Y</div>
            <div id="mouseOverField">Mouse over: X Y</div>
        </div>
        
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/92/three.min.js"></script>
        <script src="https://rawgit.com/mrdoob/stats.js/master/build/stats.min.js"></script>

        
		<script src="ThreeJSPoC.js"></script>


	</body>
</html>

