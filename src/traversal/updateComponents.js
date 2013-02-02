define(["core/nodeVisitor"], function(nodeVisitor) {
	"use strict";

	/**
		Traverses a scene updating components for all nodes
	*/
	var updateComponents = Object.create(nodeVisitor);

	updateComponents.visitNode = function(node) {
		node.updateAllComponents(this._time);
	};

	updateComponents.set = function(spec) {
		spec = spec || {};

		nodeVisitor.set.call(this, spec);

		this._time = spec;

		return this;
	};

	return updateComponents;
});

