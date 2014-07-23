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
		MODEL_VIEW_MATRIX: "uMVMatrix"
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

