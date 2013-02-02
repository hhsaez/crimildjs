define(["core/node", "foundation/collection", "./renderComponent"], function(node, collection, renderComponent) {
	"use strict";

	var geometryNode = Object.create(node);

	Object.defineProperties(geometryNode, {
		primitives: {
			get: function() {
				return this._primitives;
			}
		}
	});

	geometryNode.set = function(spec) {
		spec = spec || {};

		node.set.call(this, spec);

		this._primitives = Object.create(collection).set({
			elements: spec.primitives,
		});

		this.attachComponent(Object.create(renderComponent).set());

		return this;
	};

	geometryNode.destroy = function() {
		this.primitives.destroy();		
		node.destroy.call(this);
	};

	return geometryNode;	
});

