/**
    Implements a fragment shaders

    Disclaimer: This program is not intended to be used in productive environments
*/

precision highp float;

struct LightSource {
    vec3 Position;
    vec3 Attenuation;
    vec3 Direction;
    vec3 Color;
    float OuterCutoff;
    float InnerCutoff;
    float Exponent;
};

struct Material {
    vec3 Ambient;
    vec3 Diffuse;
    vec3 Specular;
    float Shininess;
};

uniform bool uUseLighting;
uniform bool uUsePerPixelShading;
uniform int uLightCount;
uniform LightSource uLights[4];
uniform Material uMaterial;

uniform bool uUseTextures;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec4 vPosition;
varying vec3 vNormal;
varying vec3 vViewVector;

void main(void) {
    vec4 baseColor;

    if (uUseTextures) {
        baseColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    }
    else {
        baseColor = vec4(uMaterial.Diffuse, 1.0);
    }

    vec4 result = vec4(1.0, 1.0, 1.0, 1.0);

    if (uUseLighting) {
        result = vec4(uMaterial.Ambient * baseColor.rgb, baseColor.a);

        for (int i = 0; i < 4; i++) {
            if (i >= uLightCount) {
                break;
            }

            // compute light to vertex vector
            vec3 L = normalize(uLights[i].Position - vPosition.xyz);

            // compute diffuse factor
            float df = dot(vNormal, L);
            if (df > 0.0) {
                // compute specular factor
                vec3 r = -normalize(reflect(L, vNormal));
                float sf = pow(max(dot(r, vViewVector), 0.0), uMaterial.Shininess);

                // add to color
                result.xyz += (df * uMaterial.Diffuse * baseColor.rgb + sf * uMaterial.Specular) * uLights[i].Color;
            }
        }
    }
    else {
        result = baseColor;
    }

    gl_FragColor = result;
}

