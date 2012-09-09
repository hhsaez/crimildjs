precision mediump float;

varying vec3 vEyespaceNormal;
varying vec4 vColor;

uniform bool uUseLighting;

uniform vec4 uLightPosition;
uniform vec3 uLightAmbient;
uniform vec3 uLightDiffuse;
uniform vec3 uLightSpecular;
uniform float uLightShininess;

void main(void) {
	if (uUseLighting) {
        vec3 N = normalize(vEyespaceNormal);
        vec3 L = normalize(uLightPosition.xyz);
        vec3 E = vec3(0, 0, 1);
        vec3 H = normalize(L + E);

        float df = max(0.0, dot(N, L));
        float sf = max(0.0, dot(N, H));
        sf = pow(sf, uLightShininess);

        vec3 color = uLightAmbient + df * uLightDiffuse + sf * uLightSpecular;
        gl_FragColor = vec4(color, 1.0);
	}
	else {
	    gl_FragColor = vColor;
	}
}
