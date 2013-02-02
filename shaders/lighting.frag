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

varying vec4 vDestinationColor;
varying vec4 vPosition;
varying vec3 vNormal;
varying vec3 vViewVector;

void main(void) {
    if (uUseLighting && uUsePerPixelShading) {
        vec4 color = vec4(uMaterial.Ambient, 1.0);

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
                color.xyz += (df * uMaterial.Diffuse + sf * uMaterial.Specular) * uLights[i].Color;
            }
        }

        gl_FragColor = color;
    }
    else {
        gl_FragColor = vDestinationColor;
    }
}