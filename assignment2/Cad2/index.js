"use strict";

var canvas;
var gl;

var maxNumPositions  = 200;
var index = 0;

var cindex = 0;

// set the colors with RGB values
var colors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];

// initialize
var t, tt;
var numPolygons = 0;
var numPositions = [];
numPositions[0] = 0;
var start = [0];

// when the page loads
window.onload = function init() {
    // set the canvas
    canvas = document.getElementById("gl-canvas");

    // error if it won't load
    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    // set the menu item
    var m = document.getElementById("mymenu");

    // if you click on the menu, set the index
    m.addEventListener("click", function() {
       cindex = m.selectedIndex;
        });

    // set a as the button
    var a = document.getElementById("Button1")

    // if you click on the button to finish the polygon
    a.addEventListener("click", function(){
    // increase the number of polygons
    numPolygons++;
    numPositions[numPolygons] = 0;
    start[numPolygons] = index;
    render();
    });

    // if you click on the canvas, draw the polygons
    canvas.addEventListener("mousedown", function(event){
        t  = vec2(2*event.clientX/canvas.width-1,
           2*(canvas.height-event.clientY)/canvas.height-1);
        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));

        tt = vec4(colors[cindex]);

        gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(tt));

        numPositions[numPolygons]++;
        index++;
    });

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumPositions, gl.STATIC_DRAW);
    var postionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(postionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(postionLoc);

    var cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 16*maxNumPositions, gl.STATIC_DRAW);
    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);
}

// render function
function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    for(var i=0; i<numPolygons; i++) {
        gl.drawArrays( gl.TRIANGLE_FAN, start[i], numPositions[i] );
    }
}
