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

	fetchCameras.visitCamera = function(aCamera) {
		this._result.push(aCamera);
	};

	fetchCameras.set = function(spec) {
		spec = spec || {};

		nodeVisitor.set.call(this, spec);

		this._result = spec.result || [];

		return this;
	};

	return fetchCameras;	
});

