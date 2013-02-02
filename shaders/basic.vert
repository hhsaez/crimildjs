/**
    Implements a generic vertex shaders

    Disclaimer: This program is not intended to be used in productive environments
*/

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

uniform bool uUseLighting;

varying vec4 vDestinationColor;
varying vec4 vPosition;
varying vec3 vNormal;
varying vec3 vViewVector;

void main(void) {
	vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
    vViewVector = normalize(-vPosition.xyz);
    vNormal = uNMatrix * aVertexNormal;

    gl_Position = uPMatrix * vPosition;

    if (!uUseLighting) {
    	vDestinationColor = vec4(aVertexColor);
    }
}
