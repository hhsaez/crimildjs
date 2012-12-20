define(["crimild.core", "crimild.rendering"], function(core, rendering) {
	"use strict";

	/**
		Add a function to trim strings
		TODO: This may cause conflicts with other implementations
	*/
	String.prototype.trim = function() {
		return this.replace(/^\s*/, "").replace(/\s*$/, "");
	}

	/**
		Parse material information from a MTL file
	*/
	var parseMaterials = function(mtlfile) {
		var materials = {};

		var lines = mtlfile.split("\n");
		var currentMaterial = {};

		for (var l in lines) {
			var vals = lines[l].trim().replace(/^\s+/, "").split(/\s+/);
			if (vals[0] === "newmtl") {
				currentMaterial = {
					name: vals[1]
				};
				materials[currentMaterial.name] = currentMaterial;
			}
			else if (vals[0] === "Ka") {
				currentMaterial.ambient = [parseFloat(vals[1]), parseFloat(vals[2]), parseFloat(vals[3])]
			}
			else if (vals[0] === "Kd") {
				currentMaterial.diffuse = [parseFloat(vals[1]), parseFloat(vals[2]), parseFloat(vals[3])]
			}
			else if (vals[0] === "Ks") {
				currentMaterial.specular = [parseFloat(vals[1]), parseFloat(vals[2]), parseFloat(vals[3])]
			}
			else if (vals[0] === "map_Kd") {
				currentMaterial.diffuseMapName = vals[1];
			}
			else if (vals[0] === "map_kS") {
				currentMaterial.specularMapName = vals[1];
			}
		}

		return materials;
	};

	var objNode = function(spec) {
		spec = spec || {};

		var that = core.groupNode(spec);

		var materials = {};
		if (spec.mtlfile) {
			materials = parseMaterials(spec.mtlfile);
		}

		if (spec.file) {
			var lines = spec.file.split("\n");
			var positions = [];
			var normals = [];
			var textureCoords = [];
			var hasNormals = false;
			var hasTextureCoords = false;

			var groups = [];
			var currentGroup = { 
				name: "unknown",
				faces: [],
			};
			groups.push(currentGroup);

			for (var l in lines) {
				var vals = lines[l].trim().replace(/^\s+/, "").split(/\s+/);
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
					else if (vals[0] === "vt") {
						hasTextureCoords = true;
						textureCoords.push(parseFloat(vals[1]));
						textureCoords.push(parseFloat(vals[2]));
					}
					else if (vals[0] === "f") {
						var faceCount = vals.length - 1;
						if (faceCount === 3) {
							// triangle
							currentGroup.faces.push(vals[1]);
							currentGroup.faces.push(vals[2]);
							currentGroup.faces.push(vals[3]);							
						}
						else if (faceCount === 4) {
							// quad 
							currentGroup.faces.push(vals[1]);
							currentGroup.faces.push(vals[2]);
							currentGroup.faces.push(vals[3]);
							currentGroup.faces.push(vals[1]);
							currentGroup.faces.push(vals[3]);
							currentGroup.faces.push(vals[4]);
						}
					}
					else if (vals[0] === "g") {
						// unsuported
					}
					else if (vals[0] === "o") {
						// unsupported
					}
					else if (vals[0] === "mtllib") {
						// unsuported
					}
					else if (vals[0] === "usemtl") {
						// create a new group that will use the new material
						// this will end up generating a new GeometryNode with 
						// a different material attached to it
						currentGroup = {
							name: vals[1],
							materialName: vals[1],
							faces: []
						};
						groups.push(currentGroup);
					}
				}
			}

			var vertexFormat = core.vertexFormat({positions: 3, normals: hasNormals ? 3 : 0, textureCoords: hasTextureCoords ? 2 : 0});

			for (var g in groups) {
				var group = groups[g];

				var indices = [];
				var vertices = [];

				for (var i = 0; i < group.faces.length; i++) {
					var face = group.faces[i].split("/");

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

					if (hasTextureCoords) {
						var tIdx = parseInt(face[1]) - 1;
						vertices.push(textureCoords[tIdx * 2 + 0]);
						vertices.push(textureCoords[tIdx * 2 + 1]);
					}

					indices.push(i);
				}

				var vertexCount = vertices.length / vertexFormat.getVertexSize();

				that.attachNode(core.geometryNode({
					name: group.name || "unknown",
					primitives: [
						core.primitive({
							vertexBuffer: core.vertexBufferObject({vertexFormat: vertexFormat, vertexCount: vertexCount, data: new Float32Array(vertices)}),
							indexBuffer: core.indexBufferObject({indexCount: indices.length, data: new Uint16Array(indices)})
						})
					],
					components: [
						(function() {
							if (group.materialName) {
								var material = materials[group.materialName];
								if (material) {
									return rendering.renderComponent({
										effects: [
											rendering.effect({
												shaderProgram: spec.shaderProgram,
												diffuse: material.diffuse,
												ambient: material.ambient,
												specular: material.specular,
												textures: (function() {
													var textures = [];
													var img;

													if (spec.images) {
														if (material.diffuseMapName) {
															img = spec.images[material.diffuseMapName];
															if (img) {
																textures.push(rendering.texture({image: img}));
															}
														}
														if (material.specularMapName) {
															img = spec.images[material.specularMapName];
															if (img) {
																textures.push(rendering.texture({name: "uSpecularMapSampler", image: img}));
															}
														}
													}

													return textures;
												})()
											})
										]
									})
								}
							}

							return null;
						})()
					]
				}));
			}
		}

		return that;
	};

	return {
		objNode: objNode,
	}

});

