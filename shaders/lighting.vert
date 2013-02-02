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

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

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
    // compute position in view space
    vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
    gl_Position = uPMatrix * vPosition;

    // approximate the view vector 
    vViewVector = normalize(-vPosition.xyz);

    // compute normal in world space
    vNormal = normalize(uNMatrix * aVertexNormal);

    if (uUseLighting) {
        if (!uUsePerPixelShading) {
            vDestinationColor = vec4(uMaterial.Ambient, 1.0);

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
                    vDestinationColor.xyz += (df * uMaterial.Diffuse + sf * uMaterial.Specular) * uLights[i].Color;
                }
            }
        }
    }
    else {
        vDestinationColor = vec4(uMaterial.Diffuse, 1.0);
    }
}

