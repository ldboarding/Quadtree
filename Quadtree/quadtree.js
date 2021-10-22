// some globals
var gl;
var delay = 100;
var direction = true;
var program;

//Points
var pointBuffer;
var colorPointBuffer;
var pointsArray = []; 
var colorPointsArray = []; 

//Lines
var lineBuffer;
var colorLineBuffer;
var linesArray = []; 
var colorLinesArray = []; 

var offset
var colorOffset 
var offset2
var colorOffset2

var tL = {x: 0, y: 200}
var tR = {x: 200, y: 200}
var bL = {x: 0, y: 0}
var bR = {x: 200, y: 0}

var drawLine = false;
var drawTri= false;
var isMouseDown = false;

var lineCount = 0;
var triCount = 0;
var selectedColor = [1, 1, 1, 1];
var selectedColor2 = [1, 0, 0, 1];

var width = 0.0;
var height = 0.0;
var button = "On"

window.onload = function init() {
	// get the canvas handle from the document's DOM
    var canvas = document.getElementById( "gl-canvas" );
	height = canvas.height
	width = canvas.width
	// initialize webgl
    gl = WebGLUtils.setupWebGL(canvas);

	// check for errors
    if ( !gl ) { 
		alert("WebGL isn't available"); 
	}

    // set up a viewing surface to display your image
    gl.viewport(0, 0, canvas.width, canvas.height);

	// clear the display with a background color 
	// specified as R,G,B triplet in 0-1.0 range
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    //  Load shaders -- all work done in init_shaders.js
    program = initShaders(gl, "vertex-shader", "fragment-shader");

	// make this the current shader program
    gl.useProgram(program);

	// Get a handle to theta  - this is a uniform variable defined 
	// by the user in the vertex shader, the second parameter should match
	// exactly the name of the shader variable
    thetaLoc = gl.getUniformLocation(program, "theta");

	colorLoc = gl.getUniformLocation(program, "vertColor");

	//POINTS
	pointBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, (16*60000), gl.STATIC_DRAW)

	colorPointBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorPointBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, (32*60000), gl.STATIC_DRAW)

	//LINES
	lineBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, (16*60000), gl.STATIC_DRAW)

	colorLineBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorLineBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, (32*60000), gl.STATIC_DRAW)

	var points = [
		// {x: 190, y: 160}, 
		// {x: 190, y: 170}, 
		// {x: 60, y: 110}, 
		// {x: 20, y: 190}, 
		// {x: 20, y: 180},
		{x: 55, y: 90}, 
		{x: 55, y: 91}
	]

	//drawPoints()

	drawQuad(tL, tR, bL, bR, points)

    render();
};

function render() {
	// this is render loop
	// clear the display with the background color
    gl.clear( gl.COLOR_BUFFER_BIT );

	//Points
	//gl.drawArrays(gl.POINTS, 0, 10)

	//Lines
	gl.drawArrays(gl.LINES, 0, 10000)

	//Time
    setTimeout(
        function () { requestAnimFrame(render) }, delay
    );
}

function checkPoints(tL, tR, bL, bR, points) {
	var count = 0
	var check = false
	for(var i=0; i<points.length; i++) {
		console.log("----------------CHECK POINTS--------------------")
		console.log(points[i].x)
		console.log(points[i].y)
		console.log("---POINTS---")
		console.log(tL.x + ", " + tR.x)
		console.log(tL.y + ", " + bL.y)
		console.log("---CHECK---")

		if ((points[i].x >= tL.x) && (points[i].x <= tR.x)) {
			if ((points[i].y <= tL.y) && (points[i].y >= bL.y)) {
				console.log("---TRUE (IN QUAD)---")
				count++
				if (count >= 2) {
					check = true
				}
			}
		}
	}
	return check
} 

function newPoints(tL, tR, bL, bR, points) {
	newpoints = []
	console.log("----------------NEW POINTS START--------------------")
	console.log("---TOP LEFT---")
	console.log(tL)
	console.log("---TOP RIGHT---")
	console.log(tR)
	console.log("---BOTTOM LEFT---")
	console.log(bL)
	console.log("---BOTTOM RIGJHT---")
	console.log(bR)
	console.log("-----------------NEW POINTS END-------------------")

	for(var i=0; i<points.length; i++) {
		console.log(points[i])
		if ((points[i].x >= tL.x) && (points[i].x <= tR.x)) {
			if ((points[i].y <= tL.y) && (points[i].y >= bL.y)) {
				console.log("---ADD NEWPOINT---")
				newpoints.push(points[i])
			} 
		} 
	}
	return newpoints
}

function drawQuad(tL, tR, bL, bR, points) {
var boo = checkPoints(tL, tR, bL, bR, points)
console.log("Quad Check: " + boo)

if (boo) {

	console.log("**VARS**")
	console.log(tR)
	console.log(tL)
	console.log(bR)
	//Recurse
	console.log("**RECURSE START**")
	mT = {x: (tL.x+tR.x)/2, y: (tL.y+tR.y)/2}
	console.log("--MIDDLE TOP--")
	console.log(mT)
	mL = {x: (tL.x+bL.x)/2, y: (tL.y+bL.y)/2}
	console.log("--MIDDLE LEFT--")
	console.log(mL)
	mR = {x: (tR.x+bR.x)/2, y: (tR.y+bR.y)/2}
	console.log("--MIDDLE RIGHT--")
	console.log(mR)
	mB = {x: (bL.x+bR.x)/2, y: (bL.y+bR.y)/2}
	console.log("--MIDDLE BOTTOM--")
	console.log(mB)
	mM = {x: (mL.x+mR.x)/2, y: (mT.y+mB.y)/2}
	console.log("--MIDDLE--")
	console.log(mM)

	linesArray.push([mT.x - 100, mT.y - 100])
	linesArray.push([mB.x - 100, mB.y - 100])

	linesArray.push([mL.x - 100, mL.y - 100])
	linesArray.push([mR.x - 100, mR.y - 100])
	colorLinesArray.push(selectedColor)

	gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer)
	gl.bufferSubData(gl.ARRAY_BUFFER, offset2, flatten(linesArray))
	offset2 += 16

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	gl.bindBuffer(gl.ARRAY_BUFFER, colorLineBuffer)
	gl.bufferSubData(gl.ARRAY_BUFFER, colorOffset2, flatten(colorLinesArray))
	colorOffset2 += 16

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0 , 0);
	gl.enableVertexAttribArray(vColor)

	var points1 = newPoints(tL, mT, mL, mM, points)
	console.log("Points 1: " + points1)
	console.log(points1)
	drawQuad(tL, mT, mL, mM, points1)

	var points2 = newPoints(mT, tR, mM, mR, points)
	console.log(points2)
	drawQuad(mT, tR, mM, mR, points2)

	var points3 = newPoints(mL, mM, bL, mB, points)
	console.log(points3)
	drawQuad(mL, mM, bL, mB, points3)

	//var points4 = newPoints(mM, mR, mB, bR, points)
	//console.log(points4)
	//drawQuad(mM, mR, mB, bR, points4)
} else {
	
}
}

function drawPoints() {
	for(var i=0; i<10; i++) {
		x = Math.random() * (90 - -90) + -90
		y = Math.random() * (90 - -90) + -90
		console.log(x + ", " + y)
		selectedColor2 = [1, 0, 0, 1]

		pointsArray.push([x, y])
		colorPointsArray.push(selectedColor2)

		gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer)
		gl.bufferSubData(gl.ARRAY_BUFFER, offset, flatten(pointsArray))
		offset += 8
	
		var vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, colorPointBuffer)
		gl.bufferSubData(gl.ARRAY_BUFFER, colorOffset, flatten(colorPointsArray))
		colorOffset += 16
	
		var vColor = gl.getAttribLocation(program, "vColor");
		gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0 , 0);
		gl.enableVertexAttribArray(vColor)
	}

	//drawQuad(tL, tR, bL, bR)
}

function translate2D(tx, ty, tz){
	translate = mat4(
		1, 0, 0, tx,
		0, 1, 0, ty,
		0, 0, 0, tz,
		0, 0, 0, 1 
		
	)
	return translate
}

function scale2D(sx, sy, sz){
	scale = mat4(
		sx, 0, 0, 0,
		0, sy, 0, 0,
		0, 0, sz, 0,
		0, 0, 0, 1 
	)
	return scale
}

//adapted from MV.js
function dotProd(v1, v2){
	sum = 0.0
	if(v1.length != v2.length){
		throw "dotProduct(): Vectors are not the same dimension"
	}

	for(let i = 0; i < v1.length; i++){
		sum += v1[i] * v2[i]
	}
	return sum
}

function deviceToWorld(x, y, z) {
	var myVec = vec4(x, y, z, 1)
	var tMatrix = translate2D(-8, -8, 0)

	var myVec2 = vec4(dotProd(tMatrix[0], myVec), dotProd(tMatrix[1], myVec)+16, 0, 1)
	var sMatix = scale2D(1/512, 1/512, 0)

	var myVec3 = vec4(dotProd(sMatix[0], myVec2), dotProd(sMatix[1], myVec2), 0, 1)
	var sMatix2 = scale2D(200, 200, 0)

	var myVec4 = vec4(dotProd(sMatix2[0], myVec3), dotProd(sMatix2[1], myVec3), 0, 1)
	var tMatrix2 = translate2D(-100, -100, 0)

	var returnVec = vec4(dotProd(tMatrix2[0], myVec4), dotProd(tMatrix2[1], myVec4), 0, 1)

	return returnVec
}
