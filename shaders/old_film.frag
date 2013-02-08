precision highp float;

uniform float uSepiaCoeff;
uniform float uNoiseCoeff;
//uniform float uRandomValue;
uniform float uScratchCoeff;
//uniform float uTimeLapse;
//uniform float uOuterVignetting;
uniform float uInnerVignetting;

uniform bool uUseTextures;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;
//varying vec4 vPosition;
//varying vec3 vNormal;
//varying vec3 vViewVector;

/// <summary>
/// 2D Noise by Ian McEwan, Ashima Arts.
/// <summary>
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise (vec2 v)
{
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626, // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0

    // First corner
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);

    // Other corners
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    // Permutations
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;

    // Gradients: 41 points uniformly over a line, mapped onto a diamond.
    // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt( a0*a0 + h*h );
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    // Compute final noise value at P
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main(void) {
    vec4 baseColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));

    vec4 result = baseColor;

    if (uSepiaCoeff > 0.0) {
        float gray = (result.r + result.g + result.b) / 3.0;
        vec3 grayscale = vec3(gray, gray, gray);
        vec4 sepia = vec4(0.4392156863, 0.2588235294, 0.07843137255, 1.0);
        result = vec4((gray < 0.5 ? 2.0 * sepia.r * grayscale.x : 1.0 - 2.0 * (1.0 - grayscale.x) * (1.0 - sepia.r)),
                      (gray < 0.5 ? 2.0 * sepia.g * grayscale.y : 1.0 - 2.0 * (1.0 - grayscale.y) * (1.0 - sepia.g)),
                      (gray < 0.5 ? 2.0 * sepia.b * grayscale.z : 1.0 - 2.0 * (1.0 - grayscale.z) * (1.0 - sepia.b)),
                      1.0);
        result.rgb = grayscale + uSepiaCoeff * (result.rgb - grayscale);
    }

    float uRandomValue = 0.5;
    if (uNoiseCoeff > 0.0) {
        float noise = snoise(vTextureCoord * vec2(1024.0 + uRandomValue * 512.0, 1024.0 + uRandomValue * 512.0)) * 0.5;
        result += noise * uNoiseCoeff;
    }

    float uTimeLapse = 0.0;
    if (uScratchCoeff > uRandomValue) {
        float dist = 1.0 / uScratchCoeff;
        float d = distance(vTextureCoord, vec2(uRandomValue * dist, uRandomValue * dist));
        if (d < 0.4) {
            float xPeriod = 8.0;
            float yPeriod = 1.0;
            float pi = 3.141592;
            float phase = uTimeLapse;
            float turbulence = snoise(vTextureCoord * 2.5);
            float vScratch = 0.5 + (sin(((vTextureCoord.x * xPeriod + vTextureCoord.y * yPeriod + turbulence)) * pi + phase) * 0.5);
            vScratch = clamp((vScratch * 3000.0) + 0.35, 0.0, 1.0);

            result.xyz *= vScratch;
        }
    }

    float uOuterVignetting = 1.5;
    float d = distance(vec2(0.5, 0.5), vTextureCoord) * 1.414213;
    float vignetting = clamp((uOuterVignetting - d) / (uOuterVignetting - uInnerVignetting), 0.0, 1.0);
    result.xyz *= vignetting;

    gl_FragColor = result;
}

