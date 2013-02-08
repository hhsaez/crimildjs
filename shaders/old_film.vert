attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

void main(void) {
    vTextureCoord = aTextureCoord;

	gl_Position = vec4(aVertexPosition.x, aVertexPosition.y, 0, 1);
}

