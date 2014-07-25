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

	var Base = require("rendering/ShaderProgram");

	var Shader = require("rendering/Shader");
	var ShaderAttribute = require("rendering/ShaderAttribute");
	var ShaderUniform = require("rendering/ShaderUniform");

	function ForwardPassProgram(spec) {
		spec = spec || {};

		spec.vertexShader = new Shader({ source: require("text!rendering/programs/ForwardPass.vert" ) });
		spec.fragmentShader = new Shader({ source: require("text!rendering/programs/ForwardPass.frag" ) });

		spec.attributes = [
			new ShaderAttribute({ name: Base.STANDARD_ATTRIBUTES.VERTEX_POSITION }),
			new ShaderAttribute({ name: Base.STANDARD_ATTRIBUTES.VERTEX_NORMAL }),
		];

		spec.uniforms = [
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.PROJECTION_MATRIX }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.VIEW_MATRIX }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.MODEL_MATRIX }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.NORMAL_MATRIX }),

			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.MATERIAL_AMBIENT }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.MATERIAL_DIFFUSE }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.MATERIAL_SPECULAR }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.MATERIAL_SHININESS }),

			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_COUNT }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_0_POSITION }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_0_ATTENUATION }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_0_DIRECTION }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_0_COLOR }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_0_OUTER_CUTOFF }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_0_INNER_CUTOFF }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_0_EXPONENT }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_1_POSITION }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_1_ATTENUATION }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_1_DIRECTION }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_1_COLOR }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_1_OUTER_CUTOFF }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_1_INNER_CUTOFF }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_1_EXPONENT }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_2_POSITION }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_2_ATTENUATION }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_2_DIRECTION }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_2_COLOR }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_2_OUTER_CUTOFF }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_2_INNER_CUTOFF }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_2_EXPONENT }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_3_POSITION }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_3_ATTENUATION }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_3_DIRECTION }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_3_COLOR }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_3_OUTER_CUTOFF }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_3_INNER_CUTOFF }),
			new ShaderUniform({ name: Base.STANDARD_UNIFORMS.LIGHT_3_EXPONENT }),
		];

		Base.call(this, spec);
	}

	ForwardPassProgram.prototype = Object.create(Base.prototype);

	ForwardPassProgram.prototype.destroy = function() {
		Base.prototype.destroy.call(this);
	};

	return ForwardPassProgram;

});

