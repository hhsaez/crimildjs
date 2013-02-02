define(["core/nodeComponent", "./light"], function(nodeComponent, light) {
	"use strict";

	var lightingComponent = Object.create(nodeComponent);

	Object.defineProperties(lightingComponent, {
		light: {
			get: function() {
				return this._light;
			},
			set: function(value) {
				this._light = value;
			}
		}
	});

	lightingComponent.update = function() {
		this.light.position = this.node.world.translate;
		this.node.world.computeDirection(this.light.direction);
	};

	lightingComponent.set = function(spec) {
		spec = spec || {};

		spec.name = "lighting";
		nodeComponent.set.call(this, spec);

		this._light = Object.create(light).set(spec.light);

		return this;
	};

	lightingComponent.destroy = function() {
		nodeComponent.destroy.call(this);
	};

	return lightingComponent;
});

