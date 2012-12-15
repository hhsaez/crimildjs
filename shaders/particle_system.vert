attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;   // used for initial velocity
attribute vec3 aTextureCoord;   // tc0 = lifeTime, tc1 = unused

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float uTime;
uniform vec3 uGravity;

varying float vLifetime;
varying float vTime;

void main(void) {
    vLifetime = aTextureCoord[0];
    vTime = uTime - vLifetime * floor(uTime / vLifetime);
    vec3 position = aVertexPosition + aVertexNormal * vTime + 0.5 * vTime * vTime * uGravity;

    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
    gl_PointSize = (vLifetime - vTime) * 20.0;
}
