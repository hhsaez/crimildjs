/**
    Implements a generic vertex shaders

    Disclaimer: This program is not intended to be used in productive environments
*/

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;
attribute vec3 aVertexTangent;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec2 vTextureCoord;
varying vec4 vPosition;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vViewVector;

void main(void) {
	vPosition = uMMatrix * vec4(aVertexPosition, 1.0);
	vec4 vViewVertex = uVMatrix * vPosition;
    vViewVector = normalize(-vViewVertex.xyz);
    vTextureCoord = aTextureCoord;
    vNormal = uNMatrix * aVertexNormal;
    vTangent = uNMatrix * aVertexTangent;

    gl_Position = uPMatrix * vViewVertex;
}
