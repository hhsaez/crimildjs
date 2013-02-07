precision highp float;

uniform bool uUseTextures;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;

void main(void) {
    if (uUseTextures) {
        gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    }
    else {
        gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
    }
}

