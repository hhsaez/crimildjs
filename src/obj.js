define(["crimild"], function(crimild) {
	"use strict";

	var obj = {};

	/**
		Add a function to trim strings
		TODO: This may cause conflicts with other implementations
	*/
	String.prototype.trim = function(input) {
		return this.replace(/^\s*/, "").replace(/\s*$/, "");
	};

	String.prototype.getPath = function() {
  		var elem = this.split("/");
  		var str = "";
  		for (var i = 0; i < elem.length - 1; i++)
    		str += elem[i] + "/";
  		return str;
	};

	obj.load = function(fileName, req, onLoad, config) {
		// don't bother processing the input if we're doing a build
		if (config.isBuild) {
			onLoad();
			return;
		}

		this._require = req;
		this._fileName = fileName;
		this._filePath = fileName.getPath();
		this._onLoad = onLoad;
		this._positions = [];
		this._normals = [];
		this._textureCoords = [];
		this._hasNormals = false;
		this._hasTextureCoords = false;
		this._currentGroup = {
			name: "unknown",
			faces: [],
		};
		this._groups = [this._currentGroup];
		this._materials = {};

		var that = this;
		req(["text!" + fileName], function(file) {
			var lines = file.split("\n");

			that.processLines(lines, 0);
		});
	}

	obj.processLines = function(lines, start) {
		for (var i = start; i < lines.length; i++) {
			var vals = lines[i].trim().replace(/^\s+/, "").split(/\s+/);
			if (vals.length > 0 && vals[0] != "#") {
				if (vals[0] === "v") {
					this._positions.push(parseFloat(vals[1]));
					this._positions.push(parseFloat(vals[2]));
					this._positions.push(parseFloat(vals[3]));
				}
				else if (vals[0] === "vn") {
					this._hasNormals = true;
					this._normals.push(parseFloat(vals[1]));
					this._normals.push(parseFloat(vals[2]));
					this._normals.push(parseFloat(vals[3]));
				}
				else if (vals[0] === "vt") {
					this._hasTextureCoords = true;
					this._textureCoords.push(parseFloat(vals[1]));
					this._textureCoords.push(parseFloat(vals[2]));
				}
				else if (vals[0] === "f") {
					var faceCount = vals.length - 1;
					if (faceCount === 3) {
						// triangle
						this._currentGroup.faces.push(vals[1]);
						this._currentGroup.faces.push(vals[2]);
						this._currentGroup.faces.push(vals[3]);							
					}
					else if (faceCount === 4) {
						// quad 
						this._currentGroup.faces.push(vals[1]);
						this._currentGroup.faces.push(vals[2]);
						this._currentGroup.faces.push(vals[3]);
						this._currentGroup.faces.push(vals[1]);
						this._currentGroup.faces.push(vals[3]);
						this._currentGroup.faces.push(vals[4]);
					}
				}
				else if (vals[0] === "g") {
					// unsuported
				}
				else if (vals[0] === "o") {
					// unsupported
				}
				else if (vals[0] === "mtllib") {
					// pause the line processing until the materials have been read
					var that = this;
					this._require(["text!" + this._filePath + vals[1]], function(mtllib) {
						that.processMaterials(mtllib, function() {
							that.processLines(lines, i + 1);
						});
					});
					return;
				}
				else if (vals[0] === "usemtl") {
					// create a new group that will use the new material
					// this will end up generating a new GeometryNode with 
					// a different material attached to it
					this._currentGroup = {
						name: vals[1],
						materialName: vals[1],
						faces: []
					};
					this._groups.push(this._currentGroup);
				}
			}
		}

		this.generateScene();
	};

	obj.processMaterials = function(materialFile, callback) {
		this._materials = {};
		this._currentMaterial = {};

		var lines = materialFile.split("\n");
		this.processMaterialLines(lines, 0, callback);
	};

	obj.processMaterialLines = function(lines, start, callback) {
		for (var i = start; i < lines.length; i++) {
			var vals = lines[i].trim().replace(/^\s+/, "").split(/\s+/);
			if (vals[0] === "newmtl") {
				this._currentMaterial = {
					name: vals[1]
				};
				this._materials[this._currentMaterial.name] = this._currentMaterial;
			}
			else if (vals[0] === "Ka") {
				var r = parseFloat(vals[1]);
				var g = parseFloat(vals[2]);
				var b = parseFloat(vals[2]);
				if (r > 0 || g > 0 || b > 0) {
					this._currentMaterial.ambient = [r, g, b];
				}
			}
			else if (vals[0] === "Kd") {
				var r = parseFloat(vals[1]);
				var g = parseFloat(vals[2]);
				var b = parseFloat(vals[2]);
				if (r > 0 || g > 0 || b > 0) {
					this._currentMaterial.diffuse = [r, g, b];
				}
			}
			else if (vals[0] === "Ks") {
				var r = parseFloat(vals[1]);
				var g = parseFloat(vals[2]);
				var b = parseFloat(vals[2]);
				if (r > 0 || g > 0 || b > 0) {
					this._currentMaterial.specular = [r, g, b];
				}
			}
			else if (vals[0] === "Ns") {
				this._currentMaterial.shininess = parseFloat(vals[1])
			}
			else if (vals[0] === "map_Kd") {
				// pause the line processing until the map has been read
				if (vals[1]) {
					var that = this;
					this._require(["image!" + this._filePath + vals[1]], function(map) {
						that._currentMaterial.diffuseMap = map;
						that.processMaterialLines(lines, i + 1, callback);
					});
					return;
				}
			}
			else if (vals[0] === "map_kS") {
				// pause the line processing until the map has been read
				if (vals[1]) {
					var that = this;
					this._require(["image!" + this._filePath + vals[1]], function(map) {
						that._currentMaterial.specularMap = map;
						that.processMaterialLines(lines, i + 1, callback);
					});
					return;
				}
			}
			else if (vals[0] === "map_bump") {
				// pause the line processing until the map has been read
				if (vals[1]) {
					var that = this;
					this._require(["image!" + this._filePath + vals[1]], function(map) {
						that._currentMaterial.normalMap = map;
						that.processMaterialLines(lines, i + 1, callback);
					});
					return;
				}
			}
		}

		callback();
	};

	obj.generateScene = function() {
		var vertexFormat = crimild.objectFactory.create(crimild.vertexFormat, {
			positions: 3,
			normals: (this._hasNormals ? 3 : 0),
			textureCoords: (this._hasTextureCoords ? 2 : 0)
		});

		var scene = crimild.objectFactory.create(crimild.groupNode);

		for (var g in this._groups) {
			var group = this._groups[g];

			var indices = [];
			var vertices = [];

			for (var i = 0; i < group.faces.length; i++) {
				var face = group.faces[i].split("/");

				var pIdx = parseInt(face[0]) - 1;
				vertices.push(this._positions[pIdx * 3 + 0]);
				vertices.push(this._positions[pIdx * 3 + 1]);
				vertices.push(this._positions[pIdx * 3 + 2]);

				if (this._hasNormals) {
					var nIdx = parseInt(face[2]) - 1;
					vertices.push(this._normals[nIdx * 3 + 0]);
					vertices.push(this._normals[nIdx * 3 + 1]);
					vertices.push(this._normals[nIdx * 3 + 2]);
				}

				if (this._hasTextureCoords) {
					var tIdx = parseInt(face[1]) - 1;
					vertices.push(this._textureCoords[tIdx * 2 + 0]);
					vertices.push(this._textureCoords[tIdx * 2 + 1]);
				}

				indices.push(i);
			}

			var vertexCount = vertices.length / vertexFormat.getVertexSize();

			var geometry = crimild.objectFactory.inflate({
				_prototype: crimild.geometryNode,
				name: group.name || "unknown",
				primitives: [
					{
						_prototype: crimild.primitive,
						type: crimild.primitive.types.TRIANGLES,
						vertexBuffer: {
							_prototype: crimild.vertexBufferObject,
							vertexFormat: vertexFormat,
							vertexCount: vertexCount,
							data: new Float32Array(vertices),
						},
						indexBuffer: {
							indexCount: indices.length,
							data: new Uint16Array(indices)
						}
					}
				],
			});

			var material = this._materials[group.materialName];
			if (material) {
				var textures = [];
				var uniforms = [];

				if (material.diffuseMap) {
					textures.push(crimild.objectFactory.inflate({
						_prototype: crimild.texture,
						name: "uSampler",
						image: {
							_prototype: crimild.image,
							data: material.diffuseMap
						},
						flipVertical: true
					}));
				}

				if (material.specularMap) {
					textures.push(crimild.objectFactory.inflate({
						_prototype: crimild.texture,
						name: "uSpecularMapSampler",
						image: {
							_prototype: crimild.image,
							data: material.specularMap
						},
						flipVertical: true
					}));
					uniforms.push({
						_prototype: crimild.shaderUniform,
	                    name: "uUseSpecularMap",
	                    data: true,
	                    type: crimild.shaderUniform.types.BOOL,
					});
				}

				if (material.normalMap) {
					textures.push(crimild.objectFactory.inflate({
						_prototype: crimild.texture,
						name: "uNormalMapSampler",
						image: {
							_prototype: crimild.image,
							data: material.normalMap
						},
						flipVertical: true
					}));
					uniforms.push({
						_prototype: crimild.shaderUniform,
	                    name: "uUseNormalMap",
	                    data: true,
	                    type: crimild.shaderUniform.types.BOOL,
					});
				}

				geometry.attachComponent(crimild.objectFactory.inflate({
					_prototype: crimild.effectComponent,
					effects: [
						{
							_prototype: crimild.effect,
							diffuse: material.diffuse,
							ambient: material.ambient,
							specular: material.specular,
							shininess: material.shininess,
							textures: textures,
							uniforms: uniforms,
							cullState: { enabled: false }
						}
					]
				}));
			}

			scene.nodes.attach(geometry);
		}

		this._onLoad(scene);
	};

	return obj;
});

