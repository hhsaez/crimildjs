attribute vec3 aVertexPosition;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec2 vTextureCoord;

void main(void) {
    vTextureCoord = aVertexPosition.xy;

    gl_Position = uPMatrix * uMMatrix * vec4(aVertexPosition, 1.0);;
}
