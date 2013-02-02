define(function() {
	"use strict";

	/**
		Visitors are used to traverse a scene, performing
		operations on the way. Traversal operations include
		world state updates, render state updates, collision
		detection, picking, etc.

		Visitors should be stateless, making it easy to
		reuse objects instead of spawning new ones and
		then saving some memory. For visitors that include 
		some kind of temporary state, the reset method can 
		be use to cleanup any previously stored value before 
		executing it. 
	*/
	var nodeVisitor = { };

	nodeVisitor.reset = function() {};

	nodeVisitor.traverse = function(node) {
		this.reset();
		node.accept(this);
	};

	nodeVisitor.visitNode = function(node) {};

	nodeVisitor.visitGroupNode = function(group) {
		// by default, a group is treated as a regular node
		// and it pushes the operation to their children
		this.visitNode(group);

		var that = this;
		group.nodes.each(function(node) { 
			node.accept(that); 
		});
	}

	nodeVisitor.set = function(spec) {
		return this;
	};

	nodeVisitor.destroy = function() {

	};

	return nodeVisitor;	
});

