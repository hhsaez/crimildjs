/**
    Implements a fragment shaders

    Disclaimer: This program is not intended to be used in productive environments
*/

precision highp float;

struct Material {
    vec3 Ambient;
    vec3 Diffuse;
    vec3 Specular;
    float Shininess;
};

uniform Material uMaterial;

void main(void) {
    gl_FragColor = vec4(uMaterial.Diffuse, 1.0);;
}

