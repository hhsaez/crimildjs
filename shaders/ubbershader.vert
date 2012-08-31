/**
    Implements a generic vertex shaders

    Disclaimer: This program is not intended to be used in productive environments
*/

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

uniform bool uUseTextures;
uniform bool uUseLighting;

varying vec2 vTextureCoord;
varying vec3 vEyespaceNormal;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);;

    if (uUseTextures) {
        vTextureCoord = aTextureCoord;
    }

    if (uUseLighting) {
        vEyespaceNormal = uNMatrix * aVertexNormal;
    }
}
