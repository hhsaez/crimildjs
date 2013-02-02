define(["./parametricPrimitive"], function(parametricPrimitive) {
	"use strict";

	var kleinBottlePrimitive = Object.create(parametricPrimitive);

	Object.defineProperties(kleinBottlePrimitive, {
		scale: {
			get: function() {
				return this._scale;
			},
			set: function(value) {
				this._scale = value;
			}
		}
	});

	kleinBottlePrimitive.evaluate = function(domain, dest) {
		if (!dest) {
			dest = vec3.create();
		}

		var v = 1.0 - domain[0];
		var u = domain[1];
		var x0 = 3.0 * Math.cos(u) * (1 + Math.sin(u)) + (2.0 * (1.0 - Math.cos(u) / 2.0)) * Math.cos(u) * Math.cos(v);
		var y0 = 8.0 * Math.sin(u) + (2 * (1.0 - Math.cos(u) / 2.0)) * Math.sin(u) * Math.cos(v);
		var x1 = 3.0 * Math.cos(u) * (1 + Math.sin(u)) + (2.0 * (1.0 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
		var y1 = 8 * Math.sin(u);

		dest[0] = (u < Math.PI ? x0 : x1) * this.scale;
		dest[1] = (u < Math.PI ? -y0 : -y1) * this.scale;
		dest[2] = ((-2.0 * (1.0 - Math.cos(u) / 2)) * Math.sin(v)) * this.scale;

		return dest;
	};

	kleinBottlePrimitive.invertNormal = function(domain) {
		return domain[1] > 3 * Math.PI / 2;
	};

	kleinBottlePrimitive.set = function(spec) {
		spec = spec || {};

		spec.divisions = vec2.create(spec.divisions || [20, 20]);
		spec.upperBound = [2.0 * Math.PI, 2.0 * Math.PI];
		spec.textureCount = [1, 2];

		this._scale = spec.scale || 1.0;

		parametricPrimitive.set.call(this, spec);

		return this;
	};

	kleinBottlePrimitive.destroy = function() {
		parametricPrimitive.destroy.call(this);
	};

	return kleinBottlePrimitive;
});

