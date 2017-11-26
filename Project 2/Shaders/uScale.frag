#ifdef GL_ES
precision highp float;
#endif

uniform float t;

void main()
{
	gl_FragColor =  vec4(0, 0, t, 1);
}
