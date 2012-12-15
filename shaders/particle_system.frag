precision highp float;

uniform sampler2D uSampler;

varying float vLifetime;
varying float vTime;

void main(void) {
    vec4 texColor = texture2D(uSampler, gl_PointCoord);
    if (texColor.r * texColor.g * texColor.b < 0.01) {
    	discard;
    }
    else {
    	gl_FragColor = vec4(0.75, 0.75, 0.75, 1.0) * texColor;
    	gl_FragColor.a = 0.5 * (vLifetime - vTime) / vLifetime;
    }
}
