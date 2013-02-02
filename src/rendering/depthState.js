define(["./renderState"], function(renderState) {
	"use strict";

	var depthState = Object.create(renderState);

	depthState.set = function(spec) {
		spec = spec || {};

		renderState.set.call(this, spec);
		this.enabled = spec.enabled === false ? false : true;

		return this;
	};

	return depthState;
});

