define(["./parametricPrimitive"], function(paramentricPrimitive) {
	"use strict";

	var conePrimitive = Object.create(paramentricPrimitive);

	Object.defineProperties(conePrimitive, {
		height: {
			get: function() {
				return this._height;
			}
		},
		radius: {
			get: function() {
				return this._radius;
			}
		}
	});

	conePrimitive.useDomainInCoord = function() {
		return false;
	};

	conePrimitive.evaluate = function(domain, dest) {
		if (!dest) {
			dest = vec3.create();
		}

		var u = domain[0];
		var v = domain[1];
		dest[0] = this.radius * (1.0 - v) * Math.cos(u);
		dest[1] = this.height * (v - 0.5);
		dest[2] = this.radius * (1.0 - v) * -Math.sin(u);

		return dest;
	};

	conePrimitive.set = function(spec) {
		spec = spec || {};

		this._height = spec.height || 2.0;
		this._radius = spec.radius || 1.0;

		spec.divisions = vec2.create(spec.divisions || [20, 20]);
		spec.upperBound = vec2.create(spec.upperBound || [2.0 * Math.PI, 1.0]);
		spec.textureCount = vec2.create(spec.textureCount || [30, 20]);

		paramentricPrimitive.set.call(this, spec);

		return this;
	};

	return conePrimitive;
});

