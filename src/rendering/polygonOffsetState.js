define(["./renderState"], function(renderState) {
	"use strict";

	var polygonOffsetState = Object.create(renderState);

	polygonOffsetState.set = function(spec) {
		spec = spec || {};

		renderState.set.call(this, spec);
		this.enabled = (spec.enabled === true);

		return this;
	};

	return polygonOffsetState;
});

