/*
 * Copyright (c) 2014, Hugo Hernan Saez
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met: 
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer. 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution. 
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

precision mediump float;

struct LightSource {
    vec3 position;
    vec3 attenuation;
    vec3 direction;
    vec3 color;
    float outerCutoff;
    float innerCutoff;
    float exponent;
};

struct Material {
   vec4 ambient;
   vec4 diffuse;
   vec4 specular;
   float shininess;
};

uniform int uLightCount;
uniform LightSource uLights[4];

uniform Material uMaterial;

varying vec4 vPosition;
varying vec3 vNormal;
varying vec3 vViewVector;

void main( void )
{
	if (uLightCount > 0) {
        vec4 color = vec4(uMaterial.ambient.rgb, 1.0);

        for (int i = 0; i < 4; i++) {
            if (i >= uLightCount) {
                break;
            }

            // compute light to vertex vector
            vec3 L = normalize(uLights[i].position - vPosition.xyz);

            // compute diffuse factor
            float df = dot(vNormal, L);
            if (df > 0.0) {
                // compute specular factor
                vec3 r = -normalize(reflect(L, vNormal));
                float sf = pow(max(dot(r, vViewVector), 0.0), uMaterial.shininess);

                // add to color
                color.xyz += (df * uMaterial.diffuse.rgb + sf * uMaterial.specular.rgb) * uLights[i].color;
            }
        }

        gl_FragColor = color;
    }
    else {
    	gl_FragColor = vec4(uMaterial.diffuse.rgb, 1.0);
    }
}

