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

define(function(require) {

	"use strict";

	var Base = require("rendering/RenderObject");

	var Map = require("foundation/Map");

	function ShaderProgram(spec) {
		spec = spec || {};
		Base.call(this, spec);

		this.vertexShader = spec.vertexShader;
		this.fragmentShader = spec.fragmentShader;

		if (!this.vertexShader || !this.fragmentShader) {
			console.log(this, spec);
		}

		this.attributes = new Map({ objects: spec.attributes });
		this.uniforms = new Map({ objects: spec.uniforms });
	}

	ShaderProgram.STANDARD_ATTRIBUTES = {
		VERTEX_POSITION: "aPosition",
		VERTEX_NORMAL: "aNormal",
		VERTEX_TEXTURE_COORDS: "aTexCoords"
	};

	ShaderProgram.STANDARD_UNIFORMS = {
		PROJECTION_MATRIX: "uPMatrix",
		MODEL_MATRIX: "uMMatrix",
		VIEW_MATRIX: "uVMatrix",
		NORMAL_MATRIX: "uNMatrix",
		MODEL_VIEW_MATRIX: "uMVMatrix",

		MATERIAL_AMBIENT: "uMaterial.ambient",
		MATERIAL_DIFFUSE: "uMaterial.diffuse",
		MATERIAL_SPECULAR: "uMaterial.specular",
		MATERIAL_SHININESS: "uMaterial.shininess",
		
		// TODO: this needs a refactor.
		LIGHT_COUNT: "uLightCount",
		LIGHT_0_POSITION: "uLights[0].position",
		LIGHT_0_ATTENUATION: "uLights[0].attenuation",
		LIGHT_0_DIRECTION: "uLights[0].direction",
		LIGHT_0_COLOR: "uLights[0].color",
		LIGHT_0_OUTER_CUTOFF: "uLights[0].outerCutoff",
		LIGHT_0_INNER_CUTOFF: "uLights[0].innerCutoff",
		LIGHT_0_EXPONENT: "uLights[0].exponent",
		LIGHT_1_POSITION: "uLights[1].position",
		LIGHT_1_ATTENUATION: "uLights[1].attenuation",
		LIGHT_1_DIRECTION: "uLights[1].direction",
		LIGHT_1_COLOR: "uLights[1].color",
		LIGHT_1_OUTER_CUTOFF: "uLights[1].outerCutoff",
		LIGHT_1_INNER_CUTOFF: "uLights[1].innerCutoff",
		LIGHT_1_EXPONENT: "uLights[1].exponent",
		LIGHT_2_POSITION: "uLights[2].position",
		LIGHT_2_ATTENUATION: "uLights[2].attenuation",
		LIGHT_2_DIRECTION: "uLights[2].direction",
		LIGHT_2_COLOR: "uLights[2].color",
		LIGHT_2_OUTER_CUTOFF: "uLights[2].outerCutoff",
		LIGHT_2_INNER_CUTOFF: "uLights[2].innerCutoff",
		LIGHT_2_EXPONENT: "uLights[2].exponent",
		LIGHT_3_POSITION: "uLights[3].position",
		LIGHT_3_ATTENUATION: "uLights[3].attenuation",
		LIGHT_3_DIRECTION: "uLights[3].direction",
		LIGHT_3_COLOR: "uLights[3].color",
		LIGHT_3_OUTER_CUTOFF: "uLights[3].outerCutoff",
		LIGHT_3_INNER_CUTOFF: "uLights[3].innerCutoff",
		LIGHT_3_EXPONENT: "uLights[3].exponent",
	};

	ShaderProgram.prototype = Object.create(Base.prototype);

	Object.defineProperties(ShaderProgram.prototype, {
		vertexShader: {
			get: function() { return this._vertexShader; },
			set: function(value) { this._vertexShader = value; }
		},
		fragmentShader: {
			get: function() { return this._fragmentShader; },
			set: function(value) { this._fragmentShader = value; }
		},
		attributes: {
			get: function() { return this._attributes; },
			set: function(value) { this._attributes = value; }
		},
		uniforms: {
			get: function() { return this._uniforms; },
			set: function(value) { this._uniforms = value; }
		},
	});

	ShaderProgram.prototype.destroy = function() {
		Base.destroy.call(this);
	};

	return ShaderProgram;

});

