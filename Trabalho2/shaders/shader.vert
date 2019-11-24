attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

void main() {
	vTextureCoord = aTextureCoord;
	gl_Position = vec4(aVertexPosition, 1.0);
}