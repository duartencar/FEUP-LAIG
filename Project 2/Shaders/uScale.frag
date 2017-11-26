#ifdef GL_ES
precision highp float;
#endif

uniform float t;
uniform float r;
uniform float g;
uniform float b;

void main()
{
	gl_FragColor =  vec4(r*t, g*t, b, 1);
}
