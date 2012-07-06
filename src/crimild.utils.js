crimild.utils = (function () {
	"use strict";
	
	var printScene = function(spec) {
		var that = crimild.core.nodeVisitor(spec);
		var identCout = 0;

		that.visitNode = function(node) {
			print("(node) " + node.getName());
		};

		that.visitGroupNode = function(groupNode) {
			print("(groupNode) " + groupNode.getName());
			identCout++;
			for (var i = 0; i < groupNode.getNodeCount(); i++) {
				groupNode.getNodeAt(i).accept(this);
			}
			identCout--;
		};

		that.visitGeometryNode = function(geometryNode) {
			print("(geometryNode) " + geometryNode.getName());
		}

		var print = function(str) {
			var spaces = "";
			for (var i = 0; i < identCout; i++) {
				spaces = spaces + "   ";
			}
			console.log(spaces + str);
		}

		return that;
	};

	return {
		printScene: printScene
	}

	var assetManager = function(spec) {
		var that = {};
		var assets = [];

		that.addAssetURL = function(assetURL) {

		};

		that.load = function(callback) {
			callback();
		};

		return that;
	};

}());

