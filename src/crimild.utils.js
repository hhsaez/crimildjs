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
		var successCount = 0;
		var errorCount = 0;
		var imageQueue = [];
		var imageCache = {};
		var fileQueue = [];
		var fileCache = {};

		that.queueImage = function(imageUrl) {
			imageQueue.push(imageUrl);
		};

		that.queueFile = function(fileUrl) {
			fileQueue.push(fileUrl);
		};

		that.loadAllImages = function(callback) {
			for (var i = 0; i < imageQueue.length; i++) {
				var url = imageQueue[i];
				var image = new Image();
				image.addEventListener("load", function() {
					successCount += 1;
					if (that.isDone()) {
						callback();
					}
				}, false);
				image.addEventListener("error", function() {
					errorCount += 1;
					if (that.isDone()) {
						callback();
					}
				}, false);
				image.src = url;
				imageCache[url] = rendering.image({contents: image});
			}
		};

		that.loadAllFiles = function(callback) {
			for (var i = 0; i < fileQueue.length; i++) {
				var url = fileQueue[i];
				var request = new XMLHttpRequest();
				request.open("GET", url, false);
				request.onload = function() {
					if (request.status === 200) {
						successCount += 1;
						fileCache[url] = request.responseText;
					}
					else {
						errorCount += 1;
					}

					if (that.isDone()) {
						callback();
					}
				};
				request.onerror = function() {
					errorCount += 1;
					if (that.isDone()) {
						callback();
					}
				};
				request.send(null);
			}
		};

		that.isDone = function() {
			return (imageQueue.length + fileQueue.length === successCount + errorCount);
		}

		that.loadAll = function(callback) {
			if (imageQueue.length === 0 && fileQueue === 0) {
				callback();
			}
			else {
				that.loadAllImages(callback);
				that.loadAllFiles(callback);
			}
		};

		that.getImage = function(url) {
			return imageCache[url];
		};

		that.getFile = function(url) {
			return fileCache[url];
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

