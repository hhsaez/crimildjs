precision highp float;

uniform float uBrickSize;
uniform float uBrickPct;

varying vec2 vTextureCoord;

void main(void) {
    vec3 BrickColor = vec3(1.0, 0.3, 0.2);
    vec3 MortarColor = vec3(0.85, 0.86, 0.84);
    vec2 BrickSize = vec2(uBrickSize * 0.3, 0.15);
    vec2 BrickPct = vec2(uBrickPct * 0.90, uBrickPct * 0.85);

    vec2 position = vTextureCoord / BrickSize;

    if (fract(position.y * 0.5) > 0.5) {
        position.x += 0.5;
    }

    position = fract(position);

    vec2 useBrick = step(position, BrickPct);

    vec3 color = mix(MortarColor, BrickColor, useBrick.x * useBrick.y);

    gl_FragColor = vec4(color, 1.0);;
}

