define(["core/nodeVisitor"], function(nodeVisitor) {
	"use strict";

	/**
		Traverses a scene, updating all world transformations
		and bounding volumes. Groups and geometries are treated
		as default.

		This visitor is stateless. There is no need to instantiate
		a new one
	*/
	var worldStateUpdate = Object.create(nodeVisitor);

	worldStateUpdate.visitNode = function(node) {
		if (node.parent) {
			node.world.computeFrom(node.parent.world, node.local);
		}
		else {
			node.world.set(node.local);
		}
	};

	return worldStateUpdate;	
});

