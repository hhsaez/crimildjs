attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec2 vTextureCoord;
varying vec4 vVertexPosition;

void main(void) {
    vVertexPosition = uMMatrix * vec4(aVertexPosition, 1.0);
    gl_Position = uPMatrix * uVMatrix * vVertexPosition;
    vTextureCoord = aTextureCoord;
}
