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

		var that = this;
		req(["text!" + fileName], function(file) {
			var lines = file.split("\n");

			that.processLine(lines, 0);
		});
	}

	obj.processLine = function(lines, index) {
		if (index === lines.length) {
			this.generateScene();
			return;
		}

		var vals = lines[index].trim().replace(/^\s+/, "").split(/\s+/);
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
				var that = this;
				this._require(["text!" + this._filePath + vals[1]], function(mtllib) {
					that.processMaterials(mtllib, function() {
						that.processLine(lines, index + 1);
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

		this.processLine(lines, index + 1);
	};

	obj.processMaterials = function(materialFile, callback) {
		this._materials = {};

		var lines = materialFile.split("\n");
		var currentMaterial = {};

		for (var l in lines) {
			var vals = lines[l].trim().replace(/^\s+/, "").split(/\s+/);
			if (vals[0] === "newmtl") {
				currentMaterial = {
					name: vals[1]
				};
				this._materials[currentMaterial.name] = currentMaterial;
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
				geometry.attachComponent(crimild.objectFactory.inflate({
					_prototype: crimild.effectComponent,
					effects: [
						{
							_prototype: crimild.effect,
							diffuse: material.diffuse,
							ambient: material.ambient,
							specular: material.specular,
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

