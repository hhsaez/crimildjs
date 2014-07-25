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

	function generateVertexBuffer(spec) {
		var vertexData = [];
		for (var latNumber=0; latNumber <= spec.divisions[1]; latNumber++) {
			var theta = latNumber * Math.PI / spec.divisions[1];
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);

			for (var longNumber=0; longNumber <= spec.divisions[0]; longNumber++) {
				var phi = longNumber * 2 * Math.PI / spec.divisions[0];
				var sinPhi = Math.sin(phi);
				var cosPhi = Math.cos(phi);

				var x = cosPhi * sinTheta;
				var y = cosTheta;
				var z = sinPhi * sinTheta;
				var u = 1 - (longNumber / spec.divisions[0]);
				var v = 1 - (latNumber / spec.divisions[1]);

				vertexData.push(spec.radius * x);
				vertexData.push(spec.radius * y);
				vertexData.push(spec.radius * z);

				if (spec.vertexFormat.normals > 0) {
					vertexData.push(x);
					vertexData.push(y);
					vertexData.push(z);
				}

				if (spec.vertexFormat.textureCoords > 0) {
					vertexData.push(spec.textureOffset[0] + spec.textureScale[0] * u);
					vertexData.push(spec.textureOffset[1] + spec.textureScale[1] * v);
				}
			}
		}

		return new VertexBufferObject({
			vertexFormat: spec.vertexFormat,
			count: vertexData.length,
			data: new Float32Array(vertexData)
		});
	};

	function generateIndexBuffer(spec) {
		var indexData = [];
		for (var latNumber=0; latNumber < spec.divisions[1]; latNumber++) {
			for (var longNumber=0; longNumber < spec.divisions[0]; longNumber++) {
				var first = (latNumber * (spec.divisions[0] + 1)) + longNumber;
				var second = first + spec.divisions[0] + 1;
				indexData.push(first);
				indexData.push(first + 1);
				indexData.push(second);

				indexData.push(second);
				indexData.push(first + 1);
				indexData.push(second + 1);
			}
		}

		return new IndexBufferObject({
			count: indexData.length,
			data: new Uint16Array(indexData)
		});
	};

	function SpherePrimitive(spec) {
		spec = spec || {};

		spec.radius = spec.radius || 1.0;
		spec.vertexFormat = spec.vertexFormat || new VertexFormat({
			positions: 3,
			normals: 3,
			textureCoords: 2
		});
		spec.divisions = vec2.create(spec.divisions || [20, 20]);
		spec.textureOffset = vec2.create(spec.textureOffset || [0, 0]);
		spec.textureScale = vec2.create(spec.textureScale || [1, 1]);
		
		spec.vertexBuffer = generateVertexBuffer(spec);
		spec.indexBuffer = generateIndexBuffer(spec);

		Base.call(this, spec);
	}

	SpherePrimitive.prototype = Object.create(Base.prototype);

	SpherePrimitive.prototype.destroy = function() {
		Base.prototype.destroy.call(this);
	};

	return SpherePrimitive;

});

