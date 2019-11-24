#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform float time;
uniform sampler2D uSampler;
uniform sampler2D uSampler2;

void main() {
	vec4 texColor = texture2D(uSampler, vec2(1.0-vTextureCoord.x, vTextureCoord.y));
	
	vec2 centerToPos = vTextureCoord - vec2(0.5,0.5);
    float dist = length(centerToPos);
 
    float perc = 1.0 - (dist/0.55);
    vec4 color = vec4(texColor.xyz * perc, 1);
	float offset = sin((vTextureCoord.y + time) * 60.0)*0.01+0.1;

	gl_FragColor = color + offset * 0.5;
}