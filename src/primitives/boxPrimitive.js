define(["../rendering/primitive", "../rendering/vertexFormat", "../rendering/vertexBufferObject", "../rendering/indexBufferObject"], 
	function(primitive, vertexFormat, vertexBufferObject, indexBufferObject) {

	"use strict";

	var boxPrimitive = Object.create(primitive);

	boxPrimitive.set = function(spec) {
		spec = spec || {};

		var scale = spec.scale || [1.0, 1.0, 1.0];
		var textureOffset = spec.textureOffset || [0, 0];
		var textureScale = spec.textureScale || [1, 1];

		var vertices = [
			// Front face
			-scale[0], -scale[1], scale[2], 	textureOffset[0] + textureScale[0] * 0.0, textureOffset[1] + textureScale[1] * 1.0,
			scale[0], -scale[1], scale[2], 		textureOffset[0] + textureScale[0] * 1.0, textureOffset[1] + textureScale[1] * 1.0,
			scale[0], scale[1], scale[2], 		textureOffset[0] + textureScale[0] * 1.0, textureOffset[1] + textureScale[1] * 0.0,
			-scale[0], scale[1], scale[2], 		textureOffset[0] + textureScale[0] * 0.0, textureOffset[1] + textureScale[1] * 0.0,
            // Back face
            -scale[0], -scale[1], -scale[2], 	textureOffset[0] + textureScale[0] * 1.0, textureOffset[1] + textureScale[1] * 1.0,
            -scale[0], scale[1], -scale[2], 	textureOffset[0] + textureScale[0] * 1.0, textureOffset[1] + textureScale[1] * 0.0,
            scale[0], scale[1], -scale[2], 		textureOffset[0] + textureScale[0] * 0.0, textureOffset[1] + textureScale[1] * 0.0,
            scale[0], -scale[1], -scale[2], 	textureOffset[0] + textureScale[0] * 0.0, textureOffset[1] + textureScale[1] * 1.0,
            // Top face 
            -scale[0], scale[1], -scale[2], 	textureOffset[0] + textureScale[0] * 0.0, textureOffset[1] + textureScale[1] * 0.0,
            -scale[0], scale[1], scale[2], 		textureOffset[0] + textureScale[0] * 0.0, textureOffset[1] + textureScale[1] * 1.0,
            scale[0], scale[1], scale[2], 		textureOffset[0] + textureScale[0] * 1.0, textureOffset[1] + textureScale[1] * 1.0,
            scale[0], scale[1], -scale[2], 		textureOffset[0] + textureScale[0] * 1.0, textureOffset[1] + textureScale[1] * 0.0,
            // Bottom face 
            -scale[0], -scale[1], -scale[2], 	textureOffset[0] + textureScale[0] * 1.0, textureOffset[1] + textureScale[1] * 0.0,
            scale[0], -scale[1], -scale[2], 	textureOffset[0] + textureScale[0] * 0.0, textureOffset[1] + textureScale[1] * 0.0,
            scale[0], -scale[1], scale[2], 		textureOffset[0] + textureScale[0] * 0.0, textureOffset[1] + textureScale[1] * 1.0,
            -scale[0], -scale[1], scale[2], 	textureOffset[0] + textureScale[0] * 1.0, textureOffset[1] + textureScale[1] * 1.0,
            // Right face
            scale[0], -scale[1], -scale[2],		textureOffset[0] + textureScale[0] * 1.0, textureOffset[1] + textureScale[1] * 1.0,
            scale[0], scale[1], -scale[2],		textureOffset[0] + textureScale[0] * 1.0, textureOffset[1] + textureScale[1] * 0.0,
            scale[0], scale[1], scale[2],		textureOffset[0] + textureScale[0] * 0.0, textureOffset[1] + textureScale[1] * 0.0,
            scale[0], -scale[1], scale[2],		textureOffset[0] + textureScale[0] * 0.0, textureOffset[1] + textureScale[1] * 1.0,
            // Left face
            -scale[0], -scale[1], -scale[2],	textureOffset[0] + textureScale[0] * 0.0, textureOffset[1] + textureScale[1] * 1.0,
          	-scale[0], -scale[1], scale[2],		textureOffset[0] + textureScale[0] * 1.0, textureOffset[1] + textureScale[1] * 1.0,
            -scale[0], scale[1], scale[2],		textureOffset[0] + textureScale[0] * 1.0, textureOffset[1] + textureScale[1] * 0.0,
            -scale[0], scale[1], -scale[2],		textureOffset[0] + textureScale[0] * 0.0, textureOffset[1] + textureScale[1] * 0.0
		];

		spec.vertexBuffer = Object.create(vertexBufferObject).set({
			vertexFormat: Object.create(vertexFormat).set({
				positions: 3,
				textureCoords: 2,
			}),
			vertexCount: 24,
			data: new Float32Array(vertices)
		});

		var indices = [
			0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23
		];

		spec.indexBuffer = Object.create(indexBufferObject).set({
			indexCount: 36,
			data: new Uint16Array(indices)
		});

		spec.type = primitive.types.TRIANGLES;

		primitive.set.call(this, spec);

		return this;
	};

	boxPrimitive.destroy = function() {
		primitive.destroy.call(this);
	};

	return boxPrimitive;
});

