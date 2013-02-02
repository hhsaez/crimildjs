define(["../core/nodeComponent", "../traversal/worldStateUpdate"], function(nodeComponent, worldStateUpdate) {
	
	"use strict";

	var rotationComponent = Object.create(nodeComponent);

	Object.defineProperties(rotationComponent, {
		speed: {
			get: function() {
				return this._speed;
			},
			set: function(value) {
				this._speed = value;
			}
		},
		axis: {
			get: function() {
				return this._axis;
			},
			set: function(value) {
				vec3.set(value, this._axis);
			}
		},
	});

	rotationComponent.update = function(time) {
        this.node.local.rotate = quat4.fromAngleAxis(this.speed * this._t * 2 * Math.PI, this.axis);
        this.node.perform(worldStateUpdate);
        this._t += time.deltaTime * 0.001;
	};

	rotationComponent.set = function(spec) {
		spec = spec || {};

		spec.name = spec.name || "rotation";
		nodeComponent.set.call(this, spec);

		this._speed = spec.speed || 1.0;
		this._axis = vec3.normalize(vec3.create(spec.axis || [0, 1, 0]));
		this._t = 0;

		return this;
	};

	return rotationComponent;
});

