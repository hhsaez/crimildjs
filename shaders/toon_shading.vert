attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec4 vPosition;
varying vec3 vNormal;
varying vec3 vViewVector;

void main(void) {
    // compute position in view space
    vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
    gl_Position = uPMatrix * vPosition;

    // approximate the view vector 
    vViewVector = normalize(-vPosition.xyz);

    // compute normal in world space
    vNormal = normalize(uNMatrix * aVertexNormal);
}

