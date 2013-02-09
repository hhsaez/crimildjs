define(["core/nodeComponent", "foundation/collection"], function(nodeComponent, collection) {
	"use strict";

	var effectComponent = Object.create(nodeComponent);

	Object.defineProperties(effectComponent, {
		effects: {
			get: function() {
				return this._effects;
			}
		}
	});

	effectComponent.update = function(time) {
		this.effects.each(function(anEffect) {
			anEffect.update(time);
		});
	};

	effectComponent.set = function(spec) {
		spec = spec || {};

		spec.name = "effects";
		nodeComponent.set.call(this, spec);

		this._effects = Object.create(collection).set({
			elements: spec.effects,
		});

		return this;
	};

	effectComponent.destroy = function() {
		this.effects.clear();
		nodeComponent.destroy.call(this);
	};

	return effectComponent;
});

