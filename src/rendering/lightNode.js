define(["core/node", "./lightingComponent"], function(node, lightingComponent) {
	"use strict";

	var lightNode = Object.create(node);

	lightNode.set = function(spec) {
		spec = spec || {};

		spec.name = spec.name || "lightNode";
		node.set.call(this, spec);

		this.attachComponent(Object.create(lightingComponent).set(spec));

		return this;
	};

	lightNode.destroy = function() {
		node.destroy.call(this);
	};

	return lightNode;
});