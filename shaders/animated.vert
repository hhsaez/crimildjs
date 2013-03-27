/**
    Implements a generic vertex shaders

    Disclaimer: This program is not intended to be used in productive environments
*/

struct Joint {
	mat4 Transform;
	int ParentIdx;
	mat4 InvBindPose;
};

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;
attribute vec3 aVertexTangent;
attribute vec2 aVertexWeight;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

uniform bool uUseVertexSkinning;
uniform int uJointCount;
uniform Joint uJoints[64];

varying vec2 vTextureCoord;
varying vec4 vPosition;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vViewVector;
varying vec3 vJointColor;

void main(void) {
	//mat4 pose = uJointPoses[int(aVertexWeight.x)];
	//mat4 pose = uJointPoses[1];
	mat4 pose = mat4(0.0);
	//vec4 joint = pose * vec4(0.0) * aVertexWeight.y;
	//vPosition = uMMatrix * (joint + vec4(aVertexPosition, 1.0));
	vPosition = uMMatrix * vec4(aVertexPosition, 1.0);
	vec4 vViewVertex = uVMatrix * vPosition;
    vViewVector = normalize(-vViewVertex.xyz);
    vTextureCoord = aTextureCoord;
    vNormal = uNMatrix * aVertexNormal;
    vTangent = uNMatrix * aVertexTangent;
    //vJointColor = vec3(aVertexWeight.x / float(uJointCount), aVertexWeight.x / float(uJointCount), aVertexWeight.x / float(uJointCount));
    vJointColor = vec3(aVertexWeight.x / 51.0, aVertexWeight.y, 0.0);

    gl_Position = uPMatrix * vViewVertex;
}
