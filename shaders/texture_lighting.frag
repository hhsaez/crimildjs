/**
    Implements a fragment shaders, supporting most common operations like lighting,
    texturing, specular and normal mapping, etc.

    Disclaimer: This program is not intended to be used in productive environments. 
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
uniform bool uUseSpecularMap;
uniform sampler2D uSpecularMapSampler;
uniform bool uUseNormalMap;
uniform sampler2D uNormalMapSampler;

varying vec2 vTextureCoord;
varying vec4 vPosition;
varying vec3 vNormal;
varying vec3 vViewVector;
varying vec3 vTangent;

void main(void) {
    vec4 baseColor = vec4(1.0, 1.0, 1.0, 1.0);

    if (uUseTextures) {
        baseColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    }

    //baseColor *= vec4(uMaterial.Ambient, 1.0);

    vec4 result = vec4(1.0, 1.0, 1.0, 1.0);

    if (uUseLighting) {
        if (uUseNormalMap) {
            vec3 normal = 2.0 * texture2D(uNormalMapSampler, vec2(vTextureCoord.s, vTextureCoord.t)).xyz - 1.0;
            normal = normalize(normal);

            vec3 n = normalize(vNormal);
            vec3 t = normalize(vTangent);
            vec3 b = normalize(cross(n, t));

            result = vec4(uMaterial.Ambient * baseColor.rgb, baseColor.a);

            for (int i = 0; i < 4; i++) {
                if (i >= uLightCount) {
                    break;
                }

                // compute light to vertex vector
                vec3 lightDir = normalize(uLights[i].Position - vPosition.xyz);
                vec3 lightVec;
                lightVec.x = dot(lightDir, t);
                lightVec.y = dot(lightDir, b);
                lightVec.z = dot(lightDir, n);
                lightVec = normalize(lightVec);

                // compute the half vector
                vec3 halfVec = normalize(vPosition.xyz + lightDir);
                vec3 temp;
                temp.x = dot(halfVec, t);
                temp.y = dot(halfVec, b);
                temp.z = dot(halfVec, n);
                halfVec = normalize(temp);

                // compute diffuse factor
                float df = dot(normal, lightVec);
                if (df > 0.0) {
                    // compute specular factor
                    float sf = 0.0;
                    if ( uUseSpecularMap ) {
                        vec4 specularPixel = texture2D(uSpecularMapSampler, vec2(vTextureCoord.s, vTextureCoord.t)).rgba;
                        if (specularPixel.r < 1.0) {
                            sf = pow(max(dot(lightVec, normal), 0.0), uMaterial.Shininess);
                        }
                    }
                    else {
                        sf = pow(max(dot(lightVec, normal), 0.0), uMaterial.Shininess);
                    }

                    // add to color
                    result.xyz += (df * uMaterial.Diffuse * baseColor.rgb + sf * uMaterial.Specular) * uLights[i].Color;
                }
            }
        }
        else {
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
                    float sf = 0.0;
                    if ( uUseSpecularMap ) {
                        vec4 specularPixel = texture2D(uSpecularMapSampler, vec2(vTextureCoord.s, vTextureCoord.t)).rgba;
                        if (specularPixel.r < 1.0) {
                            sf = pow(max(dot(r, vViewVector), 0.0), uMaterial.Shininess);
                        }
                    }
                    else {
                        sf = pow(max(dot(r, vViewVector), 0.0), uMaterial.Shininess);
                    }

                    // add to color
                    result.xyz += (df * uMaterial.Diffuse * baseColor.rgb + sf * uMaterial.Specular) * uLights[i].Color;
                }
            }
        }
    }
    else {
        result = baseColor;
    }

    gl_FragColor = result;
}

