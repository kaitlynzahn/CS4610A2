"use strict";

var positions = [];

// function cube
function cube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

// function quad
function quad(a, b, c, d) {
    // set the vertices of the cube
    var vertices = [
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0)
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    var indices = [a, b, c, a, c, d];

    for (var i = 0; i < indices.length; ++i) {
        positions.push(vertices[indices[i]]);
    }
}

// when the page loads
window.onload = function init() {
    // get the canvas element
    var canvas = document.getElementById("gl-canvas");

    // alert
    var gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //add vertices to positions to create a cube
    cube();

    //setup the canvas
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);;

    //setup the shader program
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //vertex array attribute buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    //rotation of the cube
    var theta = vec3(0, 0, 0);

    //send the (initially no rotation) theta to the shader
    var thetaLoc = gl.getUniformLocation(program, "uTheta");
    gl.uniform3fv(thetaLoc, theta);

    // create variable colorLoc and set it to the color of the cube
    var colorLoc = gl.getUniformLocation(program, "uColor");

    // function to render
    function render() {

        //change the theta somewhat randomly
        theta[0] += 0.221;
        theta[1] += 0.121;
        theta[2] += 0.3;

        //send the updated theta to the shader
        gl.uniform3fv(thetaLoc, theta);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, positions.length);

        requestAnimationFrame(render);
    }
    render();

    // if the person clicks on the mouse
    canvas.addEventListener("mousedown", function(event) {
        // log the event
        console.log(event);

        // calculate x & y based off of the width and height
        var x = event.offsetX / canvas.width;
        var offsetFixed = canvas.height - event.offsetY;
        var y = offsetFixed / canvas.height;

        // set the color to the correct color (blue, magenta, white, cyan)
        gl.uniform4f(colorLoc, x, y, 1, 1);
    });

    // if the person presses a key
    window.addEventListener("keydown", function(event) { 
        // log the event
        console.log(event);

        // if they pressed the space bar
        if(event.code == "Space") {
            // set the cube to white
            gl.uniform4f(colorLoc, 1, 1, 1, 1);
        }
        // if they pressed another key
        else {
            // set the cube to a random color
            gl.uniform4f(colorLoc, Math.random(), Math.random(), Math.random() , 1);
        }
    });
}