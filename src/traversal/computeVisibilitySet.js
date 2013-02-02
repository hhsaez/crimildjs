define(["core/nodeVisitor", "rendering/visibilitySet"], function(nodeVisitor, visibilitySet) {
	"use strict";

	var computeVisibilitySet = Object.create(nodeVisitor);

	Object.defineProperties(computeVisibilitySet, {
		result: {
			get: function() {
				return this._result;
			}
		}
	});

	computeVisibilitySet.visitNode = function(node) {
		var renderComponent = node.getComponent("render");
		if (renderComponent) {
			// this is a geometry
			this._geometries.push(node);
		}
	};

	computeVisibilitySet.set = function(spec) {
		spec = spec || {};

		nodeVisitor.set.call(this, spec);

		this._camera = spec.camera || null;
		this._geometries = [];
		this._result = spec.result || Object.create(visibilitySet);
		this._result.set({
			camera: this._camera,
			geometries: this._geometries
		});

		return this;
	};

	computeVisibilitySet.destroy = function() {
		nodeVisitor.destroy.call(this);
	};

	return computeVisibilitySet;
});

