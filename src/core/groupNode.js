define(["foundation/collection", "./node"], function(collection, node) {
	"use strict";

	var groupNode = Object.create(node);

	Object.defineProperties(groupNode, {
		nodes: {
			get: function() {
				return this._nodes;
			}
		}
	});

	// overrides parent's accept to invoke the
	// corresponding method in the visitor
	groupNode.accept = function(visitor) {
		visitor.visitGroupNode(this);
	};

	groupNode.set = function(spec) {
		spec = spec || {};

		spec.name = spec.name || "groupNode";
		node.set.call(this, spec);

		var that = this;
		this._nodes = Object.create(collection).set({
			onAttachElement: function(aNode) {
				aNode.parent = that;
			},
			onDetachElement: function(aNode) {
				aNode.parent = null;
			},
			elements: spec.nodes,
		});


		return this;
	};

	groupNode.destroy = function() {
		this.nodes.clear();
		node.destroy.call(this);
	};

	return groupNode;
});

