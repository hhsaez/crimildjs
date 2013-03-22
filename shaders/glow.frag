precision highp float;

uniform bool uUseTextures;
uniform sampler2D uSampler;
uniform sampler2D uLowResFrameSampler;
uniform bool uUseBloom;

varying vec2 vTextureCoord;

void main() 
{
    vec4 sum = vec4(0.0);

    vec4 baseColor = texture2D(uSampler, vTextureCoord);

    if (uUseBloom) {
        const float glow = 4.0;

        for ( float i = -glow ; i < glow; i++ ) {
            for ( float j = -(glow -1.0); j < (glow - 1.0); j++ ) {
                sum += texture2D(uLowResFrameSampler, vTextureCoord + vec2( i, j ) * 0.004) * 0.25;
            }
        }
           
        if (baseColor.r < 0.3) {
           gl_FragColor = sum * sum * 0.012 + baseColor;
        }
        else {
            if (baseColor.r < 0.5) {
                gl_FragColor = sum * sum * 0.009 + baseColor;
            }
            else {
                gl_FragColor = sum * sum * 0.0075 + baseColor;
            }
        }
    }
    else {
        gl_FragColor = baseColor;
    }
}

