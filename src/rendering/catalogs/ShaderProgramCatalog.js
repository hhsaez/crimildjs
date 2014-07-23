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

	var Base = require("rendering/RenderObjectCatalog");

	function ShaderProgramCatalog(spec) {
		Base.call(this, spec);

		this._objects = [];
	}

	ShaderProgramCatalog.prototype = Object.create(Base.prototype);

	ShaderProgramCatalog.prototype.destroy = function() {
		Base.destroy.call(this);
	};

	ShaderProgramCatalog.prototype.generateId = function(renderer) {
		return renderer.gl.createProgram();
	};

	ShaderProgramCatalog.prototype.load = function(renderer, program) {
		Base.prototype.load.call(this, renderer, program);

		if (!this.compileShader(renderer, program.vertexShader, renderer.gl.VERTEX_SHADER)) {
			return;
		}

		if (!this.compileShader(renderer, program.fragmentShader, renderer.gl.FRAGMENT_SHADER)) {
			return;
		}

		renderer.gl.attachShader(program.renderObjectId, program.vertexShader.renderObjectId);
		renderer.gl.attachShader(program.renderObjectId, program.fragmentShader.renderObjectId);
		renderer.gl.linkProgram(program.renderObjectId);
		if (!renderer.gl.getProgramParameter(program.renderObjectId, renderer.gl.LINK_STATUS)) {
			this.log.error("Error linking shaders: " + renderer.gl.getProgramInfoLog(program.renderObjectId));
			return;
		}

		program.attributes.each(function(attrib) {
			attrib.location = renderer.gl.getAttribLocation(program.renderObjectId, attrib.name);
			if (attrib.location < 0) {
				attrib.log.warning("No location found for attribute: " + attrib.name);
			}
		});

		program.uniforms.each(function(uniform) {
			uniform.location = renderer.gl.getUniformLocation(program.renderObjectId, uniform.name);
			if (attrib.location < 0) {
				uniform.log.warning("No location found for uniform: " + uniform.name);
			}
		});

		renderer.gl.useProgram(program.renderObjectId);
	};

	ShaderProgramCatalog.prototype.unload = function(renderer, program) {
		renderer.gl.deleteProgram(program.renderObjectId);

		Base.prototype.unload.call(this, renderer, program);
	};

	ShaderProgramCatalog.prototype.bind = function(renderer, program) {
		Base.prototype.bind.call(this, renderer, program);

		renderer.gl.useProgram(program.renderObjectId);
	};

	ShaderProgramCatalog.prototype.unbind = function(renderer, program) {
		renderer.gl.useProgram(null);

		Base.prototype.unbind.call(this, renderer, program);
	};

	ShaderProgramCatalog.prototype.compileShader = function(renderer, shader, type) {
		shader.renderObjectId = renderer.gl.createShader(type);

		renderer.gl.shaderSource(shader.renderObjectId, shader.source);
		renderer.gl.compileShader(shader.renderObjectId);

		if (!renderer.gl.getShaderParameter(shader.renderObjectId, renderer.gl.COMPILE_STATUS)) {
			this.log.error("Error compiling shader: " + renderer.gl.getShaderInfoLog(shader.renderObjectId));
			return false;
		}

		return true;
	};

	return ShaderProgramCatalog;

});

