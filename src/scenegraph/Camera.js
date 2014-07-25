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

	require("third-party/gl-matrix");

	var Base = require("scenegraph/Node");

	var ForwardRenderPass = require("rendering/renderPasses/ForwardRenderPass");

	function Camera(spec) {
		spec = spec || {};
		Base.call(this, spec);

		this.renderPass = spec.renderPass || new ForwardRenderPass();
		this.fov = spec.fov || 45.0;
		this.near = spec.near || 1.0;
		this.far = spec.far || 1000.0;

		this.viewMatrix = mat4.identity();
		this.projectionMatrix = mat4.identity();
	}

	Camera.prototype = Object.create(Base.prototype);

	Object.defineProperties(Camera.prototype, {
		renderPass: {
			get: function() { return this._renderPass; },
			set: function(value) { this._renderPass = value; }
		},
		projectionMatrix: {
			get: function() { return this._projectionMatrix; },
			set: function(value) { this._projectionMatrix = value; }
		},
		viewMatrix: {
			get: function() { return this._viewMatrix; },
			set: function(value) { this._viewMatrix = value; }
		},
		fov: {
			get: function() { return this._fov; },
			set: function(value) { this._fov = value; }
		},
		near: {
			get: function() { return this._near; },
			set: function(value) { this._near = value; }
		},
		far: {
			get: function() { return this._far; },
			set: function(value) { this._far = value; }
		}
	});

	Camera.prototype.destroy = function() {
		Base.apply(this);
	};

	Camera.prototype.accept = function(visitor) {
		visitor.visitCamera(this);
	};

	Camera.prototype.computePVMatrices = function(renderer) {
		this.world.toMatrixInverse(this._viewMatrix);
		mat4.perspective(
			this.fov,
			renderer.canvas.width / renderer.canvas.height,
			this.near,
			this.far,
			this._projectionMatrix
		);
	};

	return Camera;

});
