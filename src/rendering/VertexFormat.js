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

	function VertexFormat(spec) {
		spec = spec || {};
		Base.call(this, spec);

		this._positions = spec.positions || 3;
		this._normals = spec.normals || 0;
		this._textureCoords = spec.textureCoords || 0;
	}

	VertexFormat.prototype = Object.create(Base.prototype);

	VertexFormat.VF_P3 = new VertexFormat({ positions: 3 });

	Object.defineProperties(VertexFormat.prototype, {
		positions: {
			get: function() { return this._positions; },
			set: function(value) { this._positions = value; }
		},
		positionOffset: {
			get: function() { return 0; }
		},
		positionOffsetInBytes: {
			get: function() { return 4 * this.positionOffset; }
		},
		normals: {
			get: function() { return this._normals; },
			set: function(value) { this._normals = value; }
		},
		normalsOffset: {
			get: function() { return this.positionOffset + this.positions; }
		},
		normalsOffsetInBytes: {
			get: function() { return 4 * this.normalsOffset; }
		},
		textureCoords: {
			get: function() { return this._textureCoords; },
			set: function(value) { this._textureCoords = value; }
		},
		textureCoordsOffset: {
			get: function() { return this.normalsOffset + this.normals; }
		},
		textureCoordsOffsetInBytes: {
			get: function() { return 4 * this.textureCoordsOffset; }
		},
		vertexSize: {
			get: function() { return this.positions + this.normals + this.textureCoords; }
		},
		vertexSizeInBytes: {
			get: function() { return 4 * this.vertexSize; }
		}
	});

	VertexFormat.prototype.destroy = function() {
		Base.prototype.destroy.call(this);
	};

	VertexFormat.prototype.hasPositions = function() {
		return this.positions > 0;
	};

	VertexFormat.prototype.hasNormals = function() {
		return this.normals > 0;
	};

	VertexFormat.prototype.hasTextureCoords = function() {
		return this.textureCoords > 0;
	};

	return VertexFormat;

});

