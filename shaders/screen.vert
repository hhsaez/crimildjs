attribute vec3 aVertexPosition;

void main(void) {
	gl_Position = vec4(aVertexPosition.x, aVertexPosition.y, 0, 1);
}

