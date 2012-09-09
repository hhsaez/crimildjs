attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

uniform bool uUseLighting;

varying vec4 vColor;
varying vec3 vEyespaceNormal;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    vColor = vec4(aVertexPosition, 1.0);

    if (uUseLighting) {
        vEyespaceNormal = uNMatrix * aVertexNormal;
    }
}
