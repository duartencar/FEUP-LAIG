#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float t;

void main()
{
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + aVertexNormal * t * 0.5, 1.0);
}
