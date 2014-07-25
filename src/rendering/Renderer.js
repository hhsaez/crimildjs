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

	var Base = require("foundation/CrimildObject");

	var Map = require("foundation/Map");

	var IndexBufferObjectCatalog = require("rendering/catalogs/IndexBufferObjectCatalog");
	var ShaderProgramCatalog = require("rendering/catalogs/ShaderProgramCatalog");
	var VertexBufferObjectCatalog = require("rendering/catalogs/VertexBufferObjectCatalog");

	var ShaderProgram = require("rendering/ShaderProgram");
	var ScreenProgram = require("rendering/programs/ScreenProgram");
	var ForwardPassProgram = require("rendering/programs/ForwardPassProgram");

	function Renderer(spec) {
		spec = spec || {};
		Base.call(this, spec);

		this.canvas = spec.canvas || document.getElementById("crimildjs");
		this.fullscreen = spec.fullscreen || false;
		this.clearColor = spec.clearColor || [0.5, 0.5, 0.5, 1.0];

		this.shaderProgramCatalog = new ShaderProgramCatalog();
		this.vertexBufferObjectCatalog = new VertexBufferObjectCatalog();
		this.indexBufferObjectCatalog = new IndexBufferObjectCatalog();

		this.programs = new Map({
			objects: [
				new ForwardPassProgram({ name: "forwardPass" }),
				new ScreenProgram({ name: "screen" })
			]
		});
	}

	Renderer.prototype = Object.create(Base.prototype);

	Renderer.prototype.destroy = function() {
		Base.apply(this);
	};

	Object.defineProperties(Renderer.prototype, {
		canvas: {
			get: function() { return this._canvas; },
			set: function(value) { this._canvas = value; }
		},
		fullscreen: {
			get: function() { return this._fullscreen; },
			set: function(value) { this._fullscreen = value; }
		},
		gl: {
			get: function() { return this._gl; },
			set: function(value) { this._gl = value; }
		},
		clearColor: {
			get: function() { return this._clearColor; },
			set: function(value) { this._clearColor = value; }
		},
		shaderProgramCatalog: {
			get: function() { return this._shaderProgramCatalog; },
			set: function(value) { this._shaderProgramCatalog = value; }
		},
		vertexBufferObjectCatalog: {
			get: function() { return this._vertexBufferObjectCatalog; },
			set: function(value) { this._vertexBufferObjectCatalog = value; }
		},
		indexBufferObjectCatalog: {
			get: function() { return this._indexBufferObjectCatalog; },
			set: function(value) { this._indexBufferObjectCatalog = value; }
		},
		programs: {
			get: function() { return this._programs; },
			set: function(value) { this._programs = value; }
		},
		projectionMatrix: {
			get: function() { return this._projectionMatrix; },
			set: function(value) { this._projectionMatrix = mat4.create(value); }
		},
		viewMatrix: {
			get: function() { return this._viewMatrix; },
			set: function(value) { this._viewMatrix = mat4.create(value); }
		},
	});

	Renderer.prototype.configure = function(spec) {
		spec = spec || {};

		if (!this.configureCanvas()) {
			return false;
		}

		if (!this.configureGL()) {
			return false;
		}
	};

	Renderer.prototype.configureCanvas = function() {
		this.log.debug("Configuring canvas");

		if (!this.canvas) {
			this.log.error("No canvas element provided. Cannot initialize renderer");
			return false;
		}

		if (this.fullscreen == true) {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		}

		return true;
	};

	Renderer.prototype.configureGL = function() {
		this.log.debug("Configuring WebGL context");

		try {
			this.gl = this.canvas.getContext("experimental-webgl") ||
					  this.canvas.getContext("webgl");
		}
		catch (e) {
			this.log.warning(e);
		}

		if (!this.gl) {
			var answer = confirm("Cannot initialize WebGL context. Please make sure your browser supports WebGL and verify that you have the latest drivers for you graphics card.\n\nClick OK for more information.");
			if (answer) {
				window.location = "http://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation";
			}
			return false;
		}

		this.gl.depthFunc(this.gl.LEQUAL);
		this.gl.enable(this.gl.DEPTH_TEST);

		return true;
	};

	Renderer.prototype.beginRender = function() {

	}

	Renderer.prototype.clearBuffers = function() {
		this.gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}

	Renderer.prototype.endRender = function() {

	};

	Renderer.prototype.getProgram = function(name) {
		return this.programs.get(name);
	};

	Renderer.prototype.bindProgram = function(program) {
		this.shaderProgramCatalog.bind(this, program);
	};

	Renderer.prototype.unbindProgram = function(program) {
		this.shaderProgramCatalog.unbind(this, program);
	};

	Renderer.prototype.bindCamera = function(program, camera) {
		camera.computePVMatrices(this);

		this.projectionMatrix = camera.projectionMatrix;
		this.viewMatrix = camera.viewMatrix;

		this.bindMatrix4Uniform(program.uniforms.get(ShaderProgram.STANDARD_UNIFORMS.PROJECTION_MATRIX), this.projectionMatrix);
		this.bindMatrix4Uniform(program.uniforms.get(ShaderProgram.STANDARD_UNIFORMS.VIEW_MATRIX), this.viewMatrix);
	};

	Renderer.prototype.unbindCamera = function(program, camera) {

	};

	Renderer.prototype.bindBooleanUniform = function(uniform, value) {
		this.gl.uniform1i(uniform.location, value == true ? 1 : 0);
	};

	Renderer.prototype.bindIntUniform = function(uniform, value) {
		this.gl.uniform1i(uniform.location, value);
	};

	Renderer.prototype.bindFloat1Uniform = function(uniform, value) {
		this.gl.uniform1f(uniform.location, value);
	};

	Renderer.prototype.bindFloat2Uniform = function(uniform, value) {
		this.gl.uniform2f(uniform.location, value[0], value[1]);
	};

	Renderer.prototype.bindFloat3Uniform = function(uniform, value) {
		this.gl.uniform3f(uniform.location, value[0], value[1], value[2]);
	};

	Renderer.prototype.bindFloat4Uniform = function(uniform, value) {
		this.gl.uniform4f(uniform.location, value[0], value[1], value[2], value[3]);
	};

	Renderer.prototype.bindMatrix3Uniform = function(uniform, value) {
		this.gl.uniformMatrix3fv(uniform.location, false, value);
	};

	Renderer.prototype.bindMatrix4Uniform = function(uniform, value) {
		this.gl.uniformMatrix4fv(uniform.location, false, value);
	};

	Renderer.prototype.bindLight = function(program, light, i) {
		switch (i) {
			case 0: {
				this.bindFloat3Uniform(program.uniforms.get(ShaderProgram.STANDARD_UNIFORMS.LIGHT_0_POSITION), light.world.translate);
				this.bindFloat3Uniform(program.uniforms.get(ShaderProgram.STANDARD_UNIFORMS.LIGHT_0_COLOR), light.color);
				break;				
			}
			case 1: {
				this.bindFloat3Uniform(program.uniforms.get(ShaderProgram.STANDARD_UNIFORMS.LIGHT_1_POSITION), light.world.translate);
				this.bindFloat3Uniform(program.uniforms.get(ShaderProgram.STANDARD_UNIFORMS.LIGHT_1_COLOR), light.color);
				break;				
			}
			case 2: {
				this.bindFloat3Uniform(program.uniforms.get(ShaderProgram.STANDARD_UNIFORMS.LIGHT_2_POSITION), light.world.translate);
				this.bindFloat3Uniform(program.uniforms.get(ShaderProgram.STANDARD_UNIFORMS.LIGHT_2_COLOR), light.color);
				break;				
			}
			case 3: {
				this.bindFloat3Uniform(program.uniforms.get(ShaderProgram.STANDARD_UNIFORMS.LIGHT_3_POSITION), light.world.translate);
				this.bindFloat3Uniform(program.uniforms.get(ShaderProgram.STANDARD_UNIFORMS.LIGHT_3_COLOR), light.color);
				break;				
			}
		}
	};

	Renderer.prototype.unbindLight = function(program, light, i) {

	};

	Renderer.prototype.bindMaterial = function(program, material) {
		this.bindFloat4Uniform(program.uniforms.get(ShaderProgram.STANDARD_UNIFORMS.MATERIAL_AMBIENT), material.ambient);
		this.bindFloat4Uniform(program.uniforms.get(ShaderProgram.STANDARD_UNIFORMS.MATERIAL_DIFFUSE), material.diffuse);
		this.bindFloat4Uniform(program.uniforms.get(ShaderProgram.STANDARD_UNIFORMS.MATERIAL_SPECULAR), material.specular);
		this.bindFloat1Uniform(program.uniforms.get(ShaderProgram.STANDARD_UNIFORMS.MATERIAL_SHININESS), material.shininess);
	};
	
	Renderer.prototype.unbindMaterial = function(program, material) {

	};

	Renderer.prototype.applyTransformations = function(program, geometry) {
		var mMatrix = mat4.create();
		geometry.world.toMatrix(mMatrix);
		this.bindMatrix4Uniform(program.uniforms.get(ShaderProgram.STANDARD_UNIFORMS.MODEL_MATRIX), mMatrix);

		var normalMatrix = mat3.create();
		var mvMatrix = mat4.multiply(this.viewMatrix, mMatrix);
		mat4.toInverseMat3(mvMatrix, normalMatrix);
		mat3.transpose(normalMatrix);
		this.bindMatrix3Uniform(program.uniforms.get(ShaderProgram.STANDARD_UNIFORMS.NORMAL_MATRIX), normalMatrix);
	};

	Renderer.prototype.restoreTransformations = function(program, geometry) {

	};
	
	Renderer.prototype.renderPrimitive = function(program, primitive) {
		this.vertexBufferObjectCatalog.bind(this, primitive.vertexBuffer, program);
		this.indexBufferObjectCatalog.bind(this, primitive.indexBuffer, program);

		this.gl.drawElements(this.gl.TRIANGLES, primitive.indexBuffer.count, this.gl.UNSIGNED_SHORT, 0);

		this.indexBufferObjectCatalog.unbind(this, primitive.indexBuffer, program);
		this.vertexBufferObjectCatalog.unbind(this, primitive.vertexBuffer, program);
	};

	return Renderer;

});

