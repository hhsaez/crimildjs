define(["core/nodeVisitor"], function(nodeVisitor) {
	"use strict";

	var fetchCameras = Object.create(nodeVisitor);

	Object.defineProperties(fetchCameras, {
		result: {
			get: function() {
				return this._result;
			}
		}
	});

	fetchCameras.visitNode = function(aNode) {
		var cameraComponent = aNode.getComponent("camera");
		if (cameraComponent && cameraComponent.camera) {
			this._result.push(cameraComponent.camera);
		}
	};

	fetchCameras.set = function(spec) {
		spec = spec || {};

		nodeVisitor.set.call(this, spec);

		this._result = spec.result || [];

		return this;
	};

	return fetchCameras;	
});

