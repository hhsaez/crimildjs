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

uniform int uLightCount;
uniform LightSource uLights[4];
uniform Material uMaterial;

varying vec4 vPosition;
varying vec3 vNormal;
varying vec3 vViewVector;

void main(void) {
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

            if (df < 0.1) df = 0.0;
            else if (df < 0.3) df = 0.3;
            else if (df < 0.6) df = 0.6;
            else df = 1.0;
            
            // add to color
            color.xyz += (df * uMaterial.Diffuse + sf * uMaterial.Specular) * uLights[i].Color;
        }
    }

    gl_FragColor = color;
}