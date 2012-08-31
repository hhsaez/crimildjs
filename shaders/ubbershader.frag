/**
    Implements a fragment shaders

    Disclaimer: This program is not intended to be used in productive environments
*/

precision mediump float;

varying vec2 vTextureCoord;
varying vec3 vEyespaceNormal;

uniform bool uUseLighting;
uniform bool uUseTextures;

uniform vec4 uLightPosition;
uniform vec3 uLightAmbient;
uniform vec3 uLightDiffuse;
uniform vec3 uLightSpecular;
uniform float uLightShininess;

uniform sampler2D uSampler;

void main(void) {
    vec4 baseColor;

    if (uUseTextures) {
        baseColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    }
    else {
        baseColor = vec4(1.0, 1.0, 1.0, 1.0);
    }

    vec4 result = vec4(1.0, 1.0, 1.0, 1.0);

    if (uUseLighting) {
        vec3 N = normalize(vEyespaceNormal);
        vec3 L = normalize(uLightPosition.xyz);
        vec3 E = vec3(0, 0, 1);
        vec3 H = normalize(L + E);

        float df = max(0.0, dot(N, L));
        float sf = max(0.0, dot(N, H));
        sf = pow(sf, uLightShininess);

        vec3 color = uLightAmbient * baseColor.rgb 
            + df * uLightDiffuse * baseColor.rgb
            + sf * uLightSpecular;
        result = vec4(color, baseColor.a);
    }
    else {
        result = baseColor;
    }

    gl_FragColor = result;
}

