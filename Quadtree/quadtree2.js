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

var offset = 0;
var colorOffset = 0;
var offset2 = 0;
var colorOffset2 = 0;

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

var index = 0;

var width = 0.0;
var height = 0.0;
var button = "On"

var QuadRect = function(left, top, right, bottom){
	this.left = left;
	this.top = top;
	this.right = right;
	this.bottom = bottom;
};

var QuadNode = function() {
	this.rect = null
	this.data = null;
	this.children = null;
};

var QuadTree = function() {
	this.root = new QuadNode();
	this.depth = 0;
}

var tree = new QuadTree();

var points = [
    {x: -0.55, y: 0.65}, 
    {x: -0.55, y: 0.55}, 
    {x: 0.85, y: 0.85}, 
    {x: 0.95, y: 0.85}
]

function quadTreeBuild(depth, rect){
	console.log("starting build")
	tree.depth = depth;

	quadCreateBranch(tree.root, depth, rect);
	console.log("tree finished")
}

function quadCreateBranch(node, depth, rect){
	console.log("branch " + index);
	index++

    console.log(rect.right)
    console.log(rect.left)
    console.log(rect.top)
    console.log(rect.bottom)
    for (var i=0; i<points.length; i++) {
        console.log(points[i])
    if (points[i].x < rect.right.x && points[i].x > rect.left.x) {
        if (points[i].y < rect.top.y && points[i].y > rect.bottom.y) {
            console.log("SUBDIVED")
            console.log(rect)

            linesArray.push([rect.top.x, rect.top.y])
	        linesArray.push([rect.bottom.x, rect.bottom.y])

	        linesArray.push([rect.left.x, rect.left.y])
	        linesArray.push([rect.right.x, rect.right.y])
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

            node.rect = rect;
		    node.children = [new QuadNode(), new QuadNode(), new QuadNode(), new QuadNode()];
		    childrenRect = rectSubdivide(rect);
            console.log(childrenRect[1])
		    quadCreateBranch(node.children[0], depth - 1, childrenRect[0]);
		    quadCreateBranch(node.children[1], depth - 1, childrenRect[1]);
		    // quadCreateBranch(node.children[2], depth - 1, childrenRect[2]);
		    // quadCreateBranch(node.children[3], depth - 1, childrenRect[3]);

        }
    }
}
}

function rectSubdivide(rect){
	console.log("subdivide")
    //left          top          right             bottom 
    //(rect.left + rect.right)/2, rect.top, rect.right, (rect.top + rect.bottom)/2
    //x and y 
    /*
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

    rect.left, rect.top, (rect.left + rect.right)/2, (rect.top + rect.bottom)/2
    */
    var mid = {x: (rect.left.x + rect.right.x)/2, y:(rect.top.y + rect.bottom.y)/2}
    var tL = {x: rect.left.x, y: rect.top.y}
    var tR = {x: rect.right.x, y: rect.top.y}
    var bL = {x: rect.left.x, y: rect.bottom.y}
    var bR = {x: rect.right.x, y: rect.bottom.y}

	var firstRect = new QuadRect(
        {x: mid.x, y: (rect.top.y + mid.y)/2}, 
        {x: (rect.top.x + tR.x)/2, y: tR.y}, 
        {x: rect.right.x, y: (rect.right.y + tR.y)/2}, 
        {x: (rect.bottom.x + bR.x)/2, y: rect.right.y}
	);
	var secondRect = new QuadRect(
		{x: rect.left.x, y: (rect.left.y + tL.y)/2}, 
        {x: (rect.top.x + tL.x)/2, y: tL.y}, 
        {x: mid.x, y: (rect.left.y + tL.y)/2}, 
        {x: (rect.bottom.x + bL.x)/2, y: rect.left.y}
	);
	var thirdRect = new QuadRect(
		rect.left, (rect.top + rect.bottom)/2, (rect.left + rect.right)/2, rect.bottom
	);
	var fourthRect = new QuadRect(
		(rect.left + rect.right)/2, (rect.top + rect.bottom)/2, rect.right, rect.bottom
	);
	console.log("finished subdivides")
	return [firstRect, secondRect, thirdRect, fourthRect]
}

var rect = new QuadRect({x: -1, y: 0}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1});

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

	drawRandomPoints();

	quadTreeBuild(5, rect);

	render();
};

function render() {
	// this is render loop
	// clear the display with the background color
    gl.clear( gl.COLOR_BUFFER_BIT );

	//Points
	//gl.drawArrays(gl.POINTS, 0, 4);

	//Lines
	gl.drawArrays(gl.LINES, 0, 10000)

	//Time
    setTimeout(
        function () { requestAnimFrame(render) }, delay
    );
}

function drawRandomPoints() {
	pointsArray.push([0.25, 0.5]);
	pointsArray.push([0.35, 0.5]);
	pointsArray.push([0.75, 0.25]);
	pointsArray.push([0.65, 0.25]);

	// pointsArray.push([0.25, -0.5]);
	// pointsArray.push([0.35, -0.5]);
	// pointsArray.push([0.75, -0.25]);
	// pointsArray.push([0.65, -0.25]);

	// pointsArray.push([-0.25, -0.5]);
	// pointsArray.push([-0.35, -0.5]);
	// pointsArray.push([-0.75, -0.25]);
	// pointsArray.push([-0.65, -0.25]);

	// pointsArray.push([-0.25, 0.5]);
	// pointsArray.push([-0.35, 0.5]);
	// pointsArray.push([-0.75, 0.25]);
	// pointsArray.push([-0.65, 0.25]);

	gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, offset, flatten(pointsArray));
	offset += 8;
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
}