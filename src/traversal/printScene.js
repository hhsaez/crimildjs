define(["core/nodeVisitor"], function(nodeVisitor) {
	"use strict";

	var printScene = Object.create(nodeVisitor);

	printScene._parentCount = 0;

	printScene.reset = function() {
		this._parentCount = 0;
	};

	printScene.visitNode = function(node) {
		var spaces = "";
		for (var i = 0; i < this._parentCount; i++) {
			spaces += "\t";
		};
		//console.log(spaces + node.name + " " + vec3.str(node.world.translate));
		console.log(spaces, node);
	};

	printScene.visitGroupNode = function(group) {
		this.visitNode(group);

		this._parentCount++;		
		var that = this;
		group.nodes.each(function(node) { 
			node.accept(that); 
		});
		this._parentCount--;
	};

	return printScene;
});

