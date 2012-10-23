define(["./crimild.math"], function(math) {
	"use strict";

	var version = "0.1.0";

	var object = function(spec) {
		spec = spec || {};
		var that = {};
		var name = spec.name || "";

		that.setName = function(aName) {
			name = aName;
		};

		that.getName = function() {
			return name;
		};

		return that;
	};

	var node = function(spec) {
		spec = spec || {}
		var that = object(spec);
		var parent = spec.parent || null;

		var _local = spec.local || math.transformation();
		var _world = math.transformation();
		var _components = {};

		Object.defineProperties(that, {
			local: {
				get: function() {
					return _local;
				},
				set: function(value) {
					_local = value;
				}
			},
			world: {
				get: function() {
					return _world;
				},
				set: function(value) {
					_world = value;
				}
			}
		});

		that.getParent = function() {
			return parent;
		};
		that.setParent = function(parentNode) {
			parent = parentNode;
		};

		that.perform = function(visitor) {
			visitor.traverse(this);
		};

		that.accept = function(visitor) {
			visitor.visitNode(this);
		};

		that.attachComponent = function(component) {
			if (component) {
				_components[component.getName()] = component;
				component.node = that;
			}
		};

		that.getComponent = function(componentName) {
			return _components[componentName];
		};

		that.updateAllComponents = function() {
			for (var c in _components) {
				_components[c].update();
			}
		}

		if (spec.components) {
			for (var i in spec.components) {
				that.attachComponent(spec.components[i]);
			}
		}

		return that;
	};

	var groupNode = function(spec) {
		var that = node(spec);
		var nodes = [];

		that.addNode = function(aNode) {
			nodes.push(aNode);
			aNode.setParent(that);
		};

		that.getNodeCount = function() {
			return nodes.length;
		};

		that.getNodeAt = function(index) {
			return nodes[index];
		};

		that.accept = function(visitor) {
			visitor.visitGroupNode(this);
		};

		if (spec) {
			if (spec.nodes) {
				for (var i = 0; i < spec.nodes.length; i++) {
					that.addNode(spec.nodes[i]);
				}
			}
		}

		return that;
	};

	var vertexFormat = function(spec) {
		var spec = spec || {};
		var that = {};

		var _positions = spec.positions || 3;
		var _normals = spec.normals || 0;
		var _colors = spec.colors || 0;
		var _textureCoords = spec.textureCoords || 0;
		var _tangents = spec.tangents || 0;

		Object.defineProperties(that, {
			positions: {
				get: function() {
					return _positions;
				},
				set: function(value) {
					_positions = value;
				}
			},
			normals: {
				get: function() {
					return _normals;
				},
				set: function(value) {
					_normals = value;
				}
			},
			colors: {
				get: function() {
					return _colors;
				},
				set: function(value) {
					_colors = value;
				}
			},
			textureCoords: {
				get: function() {
					return _textureCoords;
				},
				set: function(value) {
					_textureCoords = value;
				}
			},
			tangents: {
				get: function() {
					return _tangents;
				},
				set: function(value) {
					_tangents = value;
				}
			}
		});

		that.getPositionsOffset = function() {
			return 0;
		},

		that.getNormalsOffset = function() {
			return that.getPositionsOffset() + that.positions;
		};

		that.getColorsOffset = function() {
			return that.getNormalsOffset() + that.normals;
		},

		that.getTextureCoordsOffset = function() {
			return that.getColorsOffset() + that.colors;
		};

		that.getTangentsOffset = function() {
			return that.getTextureCoordsOffset() + that.textureCoords;
		};

		that.getVertexSize = function() {
			return that.positions + that.normals + that.colors + that.textureCoords + that.tangents;
		};

		that.getVertexSizeInBytes = function() {
			return 4 * that.getVertexSize();
		};

		return that;
	};

	var vertexBufferObject = function(spec) {
		var that = {};
		var data = [];
		var vertexCount = 0;
		var vertexFormat = null;

		if (spec) {
			data = spec.data ? spec.data : [];
			vertexCount = spec.vertexCount ? spec.vertexCount : 0;
			vertexFormat = spec.vertexFormat ? spec.vertexFormat : null;
		}

		that.getVertexFormat = function() {
			return vertexFormat;
		};

		that.getVertexCount = function() {
			return vertexCount;
		};

		that.getData = function() {
			return data;
		};

		return that;
	};

	var indexBufferObject = function(spec) {
		var that = {};
		var data = [];
		var indexCount = 0;

		if (spec) {
			data = spec.data ? spec.data : [];
			indexCount = spec.indexCount ? spec.indexCount : 0;
		}

		that.getIndexCount = function() {
			return indexCount;
		};

		that.getData = function() {
			return data;
		};

		return that;
	};

	var primitive = function(spec) {
		var that = {};

		var type = primitive.types.TRIANGLES;
		var vertexBuffer = null;
		var indexBuffer = null;

		if (spec) {
			vertexBuffer = spec.vertexBuffer;
			indexBuffer = spec.indexBuffer;
			type = spec.type ? spec.type : type;
		}

		that.getVertexBuffer = function() {
			return vertexBuffer;
		};
		that.setVertexBuffer = function(vbo) {
			vertexBuffer = vbo;
		};

		that.getIndexBuffer = function() {
			return indexBuffer;
		};
		that.setIndexBuffer = function(ibo) {
			indexBuffer = ibo;
		};

		that.getType = function() {
			return type;
		};
		that.setType = function(aType) {
			type = aType;
		};

		return that;
	};

	primitive.types = {
		TRIANGLES: 0,
		LINES: 1
	};

	var geometryNode = function(spec) {
		var that = node(spec);
		var primitives = [];

		if (spec) {
			if (spec.primitives) {
				primitives = spec.primitives;
			}
		}

		that.accept = function(visitor) {
			visitor.visitGeometryNode(this);
		};

		that.attachPrimitive = function(aPrimitive) {
			primitives.push(aPrimitive);
		}

		that.getPrimitiveCount = function() {
			return primitives.length;
		};

		that.getPrimitiveAt = function(index) {
			return primitives[index];
		};

		return that;
	};

	var nodeComponent = function(spec) {
		var that = object(spec);

		var _node = null;

		Object.defineProperties(that, {
			node: {
				get: function() {
					return _node;
				},
				set: function(value) {
					_node = value;
				}
			}
		});

		that.update = function() {

		};

		return that;
	};

	var nodeVisitor = function(spec) {
		var that = {};

		that.traverse = function(aNode) {
			aNode.accept(this);
		};

		that.visitNode = function(aNode) {

		};

		that.visitGroupNode = function(aGroup) {
			for (var i = 0; i < aGroup.getNodeCount(); i++) {
				aGroup.getNodeAt(i).accept(this);
			}
		};

		that.visitGeometryNode = function(aGeometryNode) {

		};

		return that;
	};

	var worldStateUpdate = function(spec) {
		var that = nodeVisitor(spec);

		that.visitNode = function(aNode) {
			if (aNode.getParent()) {
				aNode.world.computeFrom(aNode.getParent().world, aNode.local);
			}
			else {
				aNode.world.set(aNode.local);
			}
		};

		that.visitGroupNode = function(aGroup) {
			that.visitNode(aGroup);
			for (var i = 0; i < aGroup.getNodeCount(); i++) {
				aGroup.getNodeAt(i).accept(this);
			}
		};

		that.visitGeometryNode = function(aGeometry) {
			that.visitNode(aGeometry);
		};

		return that;
	};

	var updateScene = function(spec) {
		var that = nodeVisitor(spec);

		that.visitNode = function(aNode) {
			aNode.updateAllComponents();
		};

		that.visitGroupNode = function(aGroup) {
			that.visitNode(aGroup);
			for (var i = 0; i < aGroup.getNodeCount(); i++) {
				aGroup.getNodeAt(i).accept(this);
			}
		};

		that.visitGeometryNode = function(aGeometry) {
			that.visitNode(aGeometry);
		};

		return that;
	};

	return {
		getVersion: function() {
			return version;
		},
		
		getFullVersion: function() {
			return "CrimildJS v" + this.getVersion() + " July 2012";
		},

		object: object,
		node: node,
		groupNode: groupNode,
		vertexFormat: vertexFormat,
		vertexBufferObject: vertexBufferObject,
		indexBufferObject: indexBufferObject,
		primitive: primitive,
		geometryNode: geometryNode,
		nodeComponent: nodeComponent,
		nodeVisitor: nodeVisitor,
		updateScene: updateScene,
		worldStateUpdate: worldStateUpdate,
	}
});

