define(["crimild.core"], function(core) {
	"use strict";

	var objNode = function(spec) {
		spec = spec || {};

		var that = core.groupNode(spec);

		if (spec.file) {
			var lines = spec.file.split("\n");
			var positions = [];
			var normals = [];
			var faces = [];
			var hasNormals = false;

			for (var l in lines) {
				var vals = lines[l].replace(/^\s+/, "").split(/\s+/);
				if (vals.length > 0 && vals[0] != "#") {
					if (vals[0] === "v") {
						positions.push(parseFloat(vals[1]));
						positions.push(parseFloat(vals[2]));
						positions.push(parseFloat(vals[3]));
					}
					else if (vals[0] === "vn") {
						hasNormals = true;
						normals.push(parseFloat(vals[1]));
						normals.push(parseFloat(vals[2]));
						normals.push(parseFloat(vals[3]));
					}
					else if (vals[0] === "f") {
						var faceCount = vals.length - 1;
						if (faceCount === 4) {
							// triangle
							faces.push(vals[1]);
							faces.push(vals[2]);
							faces.push(vals[3]);							
						}
						else if (faceCount === 5) {
							// quad 
							faces.push(vals[1]);
							faces.push(vals[2]);
							faces.push(vals[3]);
							faces.push(vals[1]);
							faces.push(vals[3]);
							faces.push(vals[4]);
						}
					}
				}
			}

			var vertexFormat = core.vertexFormat({positions: 3, normals: hasNormals ? 3 : 0});
			var indices = [];
			var vertices = [];

			for (var i = 0; i < faces.length; i++) {
				var face = faces[i].split("/");

				var pIdx = parseInt(face[0]) - 1;
				vertices.push(positions[pIdx * 3 + 0]);
				vertices.push(positions[pIdx * 3 + 1]);
				vertices.push(positions[pIdx * 3 + 2]);

				if (hasNormals) {
					var nIdx = parseInt(face[2]) - 1;
					vertices.push(normals[nIdx * 3 + 0]);
					vertices.push(normals[nIdx * 3 + 1]);
					vertices.push(normals[nIdx * 3 + 2]);
				}

				indices.push(i);
			}

			var vertexCount = vertices.length / vertexFormat.getVertexSize();

			that.addNode(core.geometryNode({
				primitives: [
					core.primitive({
						vertexBuffer: core.vertexBufferObject({vertexFormat: vertexFormat, vertexCount: vertexCount, data: new Float32Array(vertices)}),
						indexBuffer: core.indexBufferObject({indexCount: indices.length, data: new Uint16Array(indices)})
					})
				]
			}));
		}

		return that;
	};

	return {
		objNode: objNode,
	}

});

