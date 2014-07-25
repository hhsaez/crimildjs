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

	var Base = require("primitives/Primitive");

	var IndexBufferObject = require("rendering/IndexBufferObject");
	var VertexFormat = require("rendering/VertexFormat");
	var VertexBufferObject = require("rendering/VertexBufferObject");

	function ParametricPrimitive(spec) {
		spec = spec || {};
		Base.call(this, spec);

		this.vertexFormat = spec.vertexFormat || new VertexFormat({
			positions: 3,
			normals: 3,
			textureCoords: 2
		});

		this._upperBound = vec2.create(spec.upperBound || [0, 0]);
		this._divisions = vec2.create(spec.divisions || [0, 0]);
		this._slices = vec2.subtract(this._divisions, vec2.createFrom(1, 1));
		this._textureCount = vec2.create(spec.textureCount || [0, 0]);

		this.generateVertexBuffer();
		if (this.type === Base.PRIMITIVE_TYPE.LINES) {
			this.generateLineIndexBuffer();
		}
		else {
			this.generateTriangleIndexBuffer();
		}
	}

	ParametricPrimitive.prototype = Object.create(Base.prototype);

	Object.defineProperties(ParametricPrimitive.prototype, {
		upperBound: {
			get: function() { return this._upperBound; },
			set: function(value) { this._upperBound = value; }
		},
		divisions: {
			get: function() { return this._divisions; },
			set: function(value) { this._divisions = value; }
		},
		slices: {
			get: function() { return this._slices; },
			set: function(value) { this._slices = value; }
		},
		textureCount: {
			get: function() { return this._textureCount; },
			set: function(value) { this._textureCount = value; }
		},
		vertexFormat: {
			get: function() { return this._vertexFormat; },
			set: function(value) { this._vertexFormat = value; }
		},
	});

	ParametricPrimitive.prototype.destroy = function() {
		Base.prototype.destroy.call(this);
	};

	ParametricPrimitive.prototype.getVertexCount = function() {
		return this.divisions[0] * this.divisions[1];
	};

	ParametricPrimitive.prototype.getLineIndexCount = function() {
		return 4 * this.slices[0] * this.slices[1];
	};

	ParametricPrimitive.prototype.getTriangleIndexCount = function() {
		return 6 * this.slices[0] * this.slices[1];
	};

	ParametricPrimitive.prototype.evaluate = function(domain, dest) {
		if (!dest) {
			dest = vec3.create();
		}

		dest[0] = 0;
		dest[1] = 0;
		dest[2] = 0;

		return 0;
	};

	ParametricPrimitive.prototype.invertNormal = function() {
		return false;
	};

	ParametricPrimitive.prototype.useDomainInCoord = function() {
		return true;
	};

	ParametricPrimitive.prototype.computeDomain = function(x, y, dest) {
		if (!dest) {
			dest = vec2.create();
		}

		dest[0] = x * this.upperBound[0] / this.slices[0];
		dest[1] = y * this.upperBound[1] / this.slices[1];

		return dest;
	};

	ParametricPrimitive.prototype.generateVertexBuffer = function() {
		var vertices = [];
		var s, t;
		var p = vec3.create();
		var u = vec3.create();
		var v = vec3.create();
		var normal = vec3.create();
		var tangent = vec3.create();
		var range = vec3.create();
		var domain = vec2.create();

		for (var i = 0; i < this.divisions[1]; i++) {
			for (var j = 0; j < this.divisions[0]; j++) {
				this.computeDomain(j, i, domain);
				this.evaluate(domain, range);

				vertices.push(range[0]);
				vertices.push(range[1]);
				vertices.push(range[2]);

				if (this.vertexFormat.normals > 0) {
					s = j; 
					t = i;

					if (j === 0) s += 0.01;
					if (j === this.divisions[0] - 1) s -= 0.01;
					if (i === 0) t += 0.01;
					if (i === this.divisions[1] - 1) t -= 0.01;

					this.evaluate(this.computeDomain(s, t), p);
					vec3.subtract(this.evaluate(this.computeDomain(s + 0.01, t)), p, u);
					vec3.subtract(this.evaluate(this.computeDomain(s, t + 0.01)), p, v);
					vec3.cross(u, v, normal);
					vec3.normalize(normal);
					if (this.invertNormal(domain)) {
						vec3.negate(normal);
					}
					vertices.push(normal[0]);
					vertices.push(normal[1]);
					vertices.push(normal[2]);
				}

				if (this.vertexFormat.textureCoords > 0) {
					if (this.useDomainInCoord()) {
						vertices.push(this.textureCount[0] * j / this.divisions[0]);
						vertices.push(this.textureCount[1] * i / this.divisions[1]);
					}
					else {
						vertices.push(0.5 * range[0]);
						vertices.push(0.5 * range[1]);
					}
				}

				if (this.vertexFormat.tangents > 0) {
					s = j; 
					t = i;

					this.computeDomain(s, t, domain);
					this.evaluate(domain, p);

					this.computeDomain(s + 0.01, t, domain);
					this.evaluate(domain, u);

					vec3.subtract(u, p, tangent);
					vec3.normalize(tangent);
					if (this.invertNormal(domain)) {
						vec3.negate(tangent);
					}

					vertices.push(tangent[0]);
					vertices.push(tangent[1]);
					vertices.push(tangent[2]);
				}
			}
		}

		this.vertexBuffer = new VertexBufferObject({
			vertexFormat: this.vertexFormat,
			count: this.getVertexCount(),
			data: new Float32Array(vertices)
		});
	};

	ParametricPrimitive.prototype.generateLineIndexBuffer = function() {
		var indices = [];
		var vertex = 0;
		for (var i = 0; i < this.slices[1]; i++) {
			for (var j = 0; j < this.slices[0]; j++) {
				var next = (j + 1) % this.divisions[0];
				indices.push(vertex + j);
				indices.push(vertex + next);
				indices.push(vertex + j);
				indices.push(vertex + j + this.divisions[0]);
			}
			vertex = vertex + this.divisions[0];
		}

		this.indexBuffer = new IndexBufferObject({
			count: this.getLineIndexCount(),
			data: new Uint16Array(indices)
		});
	};

	ParametricPrimitive.prototype.generateTriangleIndexBuffer = function() {
		var indices = [];
		var vertex = 0;
		for (var i = 0; i < this.slices[1]; i++) {
			for (var j = 0; j < this.slices[0]; j++) {
				var next = (j + 1) % this.divisions[0];
				indices.push(vertex + j);
				indices.push(vertex + next);
				indices.push(vertex + j + this.divisions[0]);
				indices.push(vertex + next);
				indices.push(vertex + next + this.divisions[0]);
				indices.push(vertex + j + this.divisions[0]);
			}
			vertex = vertex + this.divisions[0];
		}

		this.indexBuffer = new IndexBufferObject({
			count: this.getTriangleIndexCount(),
			data: new Uint16Array(indices)
		});
	};

	return ParametricPrimitive;

});

