define([
		"../rendering/primitive", 
		"../rendering/vertexBufferObject", 
		"../rendering/vertexFormat", 
		"../rendering/indexBufferObject"
	], function(
		primitive, 
		vertexBufferObject, 
		vertexFormat,
		indexBufferObject
	) {
	"use strict";

	var planePrimitive = Object.create(primitive);

	planePrimitive.set = function(spec) {
		spec = spec || {};

		var scale = spec.scale || [1, 1, 1];

		spec.type = primitive.types.TRIANGLES;

		spec.vertexBuffer = Object.create(vertexBufferObject).set({
			vertexFormat: Object.create(vertexFormat).set({
				positions: 3,
				normals: 3,
				textureCoords: 2,
				tangents: 3,
			}),
			vertexCount: 4,
			data: new Float32Array([
				-scale[0], scale[1], 0, 	0, 0, 1, 	0, 0, 	0, 1, 0,
				-scale[0], -scale[1], 0, 	0, 0, 1, 	0, 1,	0, 1, 0,
				scale[0], -scale[1], 0, 	0, 0, 1, 	1, 1,	0, 1, 0,
				scale[0], scale[1], 0, 		0, 0, 1, 	1, 0, 	0, 1, 0
			]),
		});

		spec.indexBuffer = Object.create(indexBufferObject).set({
			indexCount: 6,
			data: new Uint16Array([
				0, 1, 2,
				0, 2, 3
			]),
		});

		primitive.set.call(this, spec);

		return this;
	};

	planePrimitive.destroy = function() {
		primitive.destroy.call(this);
	};

	return planePrimitive;	
});

