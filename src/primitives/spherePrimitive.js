define(["../rendering/primitive", "../rendering/vertexFormat", "../rendering/vertexBufferObject", "../rendering/indexBufferObject"], 
	function(primitive, vertexFormat, vertexBufferObject, indexBufferObject) {

	"use strict";

	var spherePrimitive = Object.create(primitive);

	spherePrimitive.generateVertexBuffer = function(spec) {
		var vertexPositionData = [];
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

				vertexPositionData.push(spec.radius * x);
				vertexPositionData.push(spec.radius * y);
				vertexPositionData.push(spec.radius * z);

				if (spec.vertexFormat.normals > 0) {
					vertexPositionData.push(x);
					vertexPositionData.push(y);
					vertexPositionData.push(z);
				}

				if (spec.vertexFormat.textureCoords > 0) {
					vertexPositionData.push(spec.textureOffset[0] + spec.textureScale[0] * u);
					vertexPositionData.push(spec.textureOffset[1] + spec.textureScale[1] * v);
				}
			}
		}

		return {
			vertexCount: vertexPositionData.length,
			vertexFormat: spec.vertexFormat,
			data: new Float32Array(vertexPositionData)
		};
	};

	spherePrimitive.generateIndexBuffer = function(spec) {
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

		return {
			indexCount: indexData.length,
			data: new Uint16Array(indexData)
		};
	};

	spherePrimitive.set = function(spec) {
		spec = spec || {};

		spec.radius = spec.radius || 1.0;
		spec.vertexFormat = Object.create(vertexFormat).set(spec.vertexFormat || {
			positions: 3,
			normals: 3,
			textureCoords: 2
		});
		spec.divisions = vec2.create(spec.divisions || [20, 20]);
		spec.textureOffset = vec2.create(spec.textureOffset || [0, 0]);
		spec.textureScale = vec2.create(spec.textureScale || [1, 1]);
		spec.vertexBuffer = this.generateVertexBuffer(spec);
		spec.indexBuffer = this.generateIndexBuffer(spec);

		primitive.set.call(this, spec);

		return this;
	};

	return spherePrimitive;
});

