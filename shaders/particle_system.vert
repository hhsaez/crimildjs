attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;   // used for initial velocity
attribute vec3 aTextureCoord;   // tc0 = lifeTime, tc1 = unused

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float uTime;
uniform float uLifetime;
uniform vec3 uGravity;

varying float vTime;

void main(void) {
    float size = aTextureCoord[0];
    float offset = aTextureCoord[1];
    vTime = uTime + offset;
    vTime = vTime - uLifetime * floor(vTime / uLifetime);
    vec3 position = aVertexPosition + aVertexNormal * vTime + 0.5 * vTime * vTime * uGravity;

    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
    gl_PointSize = (uLifetime - vTime) * size;
}
