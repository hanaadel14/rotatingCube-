"use strict";

var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

//Rotation variables.
var axis = 0;
var theta = [0, 0, 1];
var thetaLoc;

//Translation Variables.
var translation = [0, 0, 0];
var translationLoc;

//Scaling Variables
var scale = 1.0;
var scaleLoc;

var myTimeOut = 100;

//The render timeout prevents accumilation of rendering.
var renderTimeout;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    colorCube();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");
    translationLoc = gl.getUniformLocation(program, "translation");
    scaleLoc = gl.getUniformLocation(program, "scale");

    // Event listeners for buttons
    document.getElementById("xButton").onclick = function () {
        axis = xAxis;
    };
    document.getElementById("yButton").onclick = function () {
        axis = yAxis;
    };
    document.getElementById("zButton").onclick = function () {
        axis = zAxis;
    };
    //Translation and Scaling buttons added with the functions.
    document.getElementById("MoveRightButton").onclick = function () {
        translation[0] += 0.1;
        render();
    };
    document.getElementById("MoveLeftButton").onclick = function () {
        translation[0] -= 0.1;
        render();
    };
    document.getElementById("ZoomInButton").onclick = function () {
        scale *= 1.1;
        render();
    };
    document.getElementById("ZoomOutButton").onclick = function () {
        scale /= 1.1;
        render();
    };
    document.getElementById("MoveButton").onclick = function () {
        myTimeOut = 10;
        render();
    };

    document.getElementById("StopButton").onclick = function () {
        myTimeOut = 1000;
    };

    document.getElementById("SlowButton").onclick = function () {
        myTimeOut = 200;
        render();
    };

    render();
};

function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

function quad(a, b, c, d) {
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

    var vertexColors = [
        [0.0, 0.0, 0.0, 1.0], // black
        [1.0, 0.0, 0.0, 1.0], // red
        [1.0, 1.0, 0.0, 1.0], // yellow
        [0.0, 1.0, 0.0, 1.0], // green
        [0.0, 0.0, 1.0, 1.0], // blue
        [1.0, 0.0, 1.0, 1.0], // magenta
        [0.0, 1.0, 1.0, 1.0], // cyan
        [1.0, 1.0, 1.0, 1.0]  // white
    ];

    var indices = [a, b, c, a, c, d];

    for (var i = 0; i < indices.length; ++i) {
        points.push(vertices[indices[i]]);
        colors.push(vertexColors[a]);
    }
}

function render() {
    clearTimeout(renderTimeout);

    renderTimeout = setTimeout(function () {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        theta[axis] += 2.0;

        gl.uniform3fv(thetaLoc, theta);
        //The updated part for the translation and scaling.
        gl.uniform3fv(translationLoc, translation);
        gl.uniform1f(scaleLoc, scale);

        gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

        requestAnimFrame(render);
    }, myTimeOut);
}

