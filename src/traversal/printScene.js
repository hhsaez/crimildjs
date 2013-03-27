define(["core/nodeVisitor"], function(nodeVisitor) {
	"use strict";

	var printScene = Object.create(nodeVisitor);

	Object.defineProperties(printScene, {
		parentCount: {
			get: function() {
				return this._parentCount;
			}
		},
		printCallback: {
			get: function() {
				return this._printCallback;
			},
			set: function(value) {
				this._printCallback = value;
			}
		}
	});

	printScene.reset = function() {
		this._parentCount = 0;
		if (!this._printCallback) {
			this._printCallback = function(aNode, identation) {
				console.log(identation, aNode);
			}
		}
	};

	printScene.visitNode = function(node) {
		var spaces = "";
		for (var i = 0; i < this._parentCount; i++) {
			spaces += "\t";
		};

		this.printCallback(node, spaces);
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

