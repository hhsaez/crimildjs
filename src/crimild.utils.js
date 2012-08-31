define(["crimild.core", "crimild.rendering"], function(core, rendering) {
	"use strict";

	var printScene = function(spec) {
		var that = core.nodeVisitor(spec);
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

	var assetManager = function(spec) {
		spec = spec || {};
		var that = {};
		var imageSuccessCount = 0;
		var imageErrorCount = 0;
		var imageQueue = [];
		var imageCache = {};

		that.queueImage = function(imageUrl) {
			imageQueue.push(imageUrl);
		};

		that.loadAllImages = function(callback) {
			for (var i = 0; i < imageQueue.length; i++) {
				var url = imageQueue[i];
				var image = new Image();
				image.addEventListener("load", function() {
					imageSuccessCount += 1;
					if (that.isDone()) {
						callback();
					}
				}, false);
				image.addEventListener("error", function() {
					imageErrorCount += 1;
					if (that.isDone()) {
						callback();
					}
				}, false);
				image.src = url;
				imageCache[url] = rendering.image({contents: image});
			}
		};

		that.isDone = function() {
			return (imageQueue.length === imageSuccessCount + imageErrorCount);
		}

		that.loadAll = function(callback) {
			if (imageQueue.length === 0) {
				callback();
			}
			else {
				that.loadAllImages(callback);
			}
		};

		that.getImage = function(url) {
			return imageCache[url];
		};

		return that;
	};

	var getTextFromElement = function(elementId) {
		var script = document.getElementById(elementId);
        var str = "";
        var k = script.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }
        return str;
	}

	return {
		getTextFromElement: getTextFromElement,
		assetManager: assetManager,
		printScene: printScene
	}

});

