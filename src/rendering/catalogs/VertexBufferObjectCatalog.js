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

	var ShaderProgram = require("rendering/ShaderProgram");

	function VertexBufferObjectCatalog(spec) {
		Base.call(this, spec);
	}

	VertexBufferObjectCatalog.prototype = Object.create(Base.prototype);

	VertexBufferObjectCatalog.prototype.destroy = function() {
		Base.destroy.call(this);
	};

	VertexBufferObjectCatalog.prototype.generateId = function(renderer) {
		return renderer.gl.createBuffer();
	};

	VertexBufferObjectCatalog.prototype.load = function(renderer, vbo) {
		Base.prototype.load.call(this, renderer, vbo);

		renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, vbo.renderObjectId);
		renderer.gl.bufferData(renderer.gl.ARRAY_BUFFER, vbo.data, renderer.gl.STATIC_DRAW);
	};

	VertexBufferObjectCatalog.prototype.unload = function(renderer, vbo) {
		renderer.gl.deleteBuffer(vbo.renderObjectId);

		Base.prototype.unload.call(this, renderer, vbo);
	};

	VertexBufferObjectCatalog.prototype.bind = function(renderer, vbo, program) {
		Base.prototype.bind.call(this, renderer, vbo);

		renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, vbo.renderObjectId);

		var format = vbo.vertexFormat;

		if (format.hasPositions()) {
			var positionAttrib = program.attributes.get(ShaderProgram.STANDARD_ATTRIBUTES.VERTEX_POSITION);
			if (positionAttrib && positionAttrib.location >= 0) {
				renderer.gl.enableVertexAttribArray(positionAttrib.location);
				renderer.gl.vertexAttribPointer(
					positionAttrib.location, 
					format.positions, 
					renderer.gl.FLOAT, 
					false, 
					format.vertexSizeInBytes, 
					format.positionsOffsetInBytes);
			}
		}

		if (format.hasNormals()) {
			var normalAttrib = program.attributes.get(ShaderProgram.STANDARD_ATTRIBUTES.VERTEX_NORMAL);
			if (normalAttrib && normalAttrib.location >= 0) {
				renderer.gl.enableVertexAttribArray(normalAttrib.location);
				renderer.gl.vertexAttribPointer(
					normalAttrib.location, 
					format.normals, 
					renderer.gl.FLOAT, 
					false, 
					format.vertexSizeInBytes, 
					format.normalsOffsetInBytes);
			}
		}
	};

	VertexBufferObjectCatalog.prototype.unbind = function(renderer, vbo, program) {
		Base.prototype.unbind.call(this, renderer, vbo);

		var format = vbo.vertexFormat;

		if (format.hasPositions()) {
			var positionAttrib = program.attributes.get(ShaderProgram.STANDARD_ATTRIBUTES.VERTEX_POSITION);
			if (positionAttrib && positionAttrib.location >= 0) {
				renderer.gl.disableVertexAttribArray(positionAttrib.location);
			}
		}

		if (format.hasNormals()) {
			var normalAttrib = program.attributes.get(ShaderProgram.STANDARD_ATTRIBUTES.VERTEX_NORMAL);
			if (normalAttrib && normalAttrib.location >= 0) {
				renderer.gl.disableVertexAttribArray(normalAttrib.location);
			}
		}

		renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, null);
	};

	return VertexBufferObjectCatalog;

});

