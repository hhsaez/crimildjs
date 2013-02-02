define(["./parametricPrimitive"], function(parametricPrimitive) {
	"use strict";

	var treefoilKnotPrimitive = Object.create(parametricPrimitive);

	Object.defineProperties(treefoilKnotPrimitive, {
		scale: {
			get: function() {
				return this._scale;
			}
		}
	});

	treefoilKnotPrimitive.evaluate = function(domain, dest) {
		if (!dest) {
			dest = vec3.create();
		}

		var a = 0.5;
	    var b = 0.3;
	    var c = 0.5;
	    var d = 0.1;
	    var u = (Math.PI * 2.0 - domain[0]) * 2.0;
	    var v = domain[1];
	    
	    var r = a + b * Math.cos(1.5 * u);
	    var x = r * Math.cos(u);
	    var y = r * Math.sin(u);
	    var z = c * Math.sin(1.5 * u);
	    
	    var dv = vec3.create();
	    dv[ 0 ] = -1.5 * b * Math.sin(1.5 * u) * Math.cos(u) - (a + b * Math.cos(1.5 * u)) * Math.sin(u);
	    dv[ 1 ] = -1.5 * b * Math.sin(1.5 * u) * Math.sin(u) + (a + b * Math.cos(1.5 * u)) * Math.cos(u);
	    dv[ 2 ] = 1.5 * c * Math.cos(1.5 * u);
	    
	    var q = vec3.createFrom(dv[0], dv[1], dv[2]);
	    vec3.normalize(q);
	    var qvn = vec3.createFrom(q[1], -q[0], 0.0)
	    vec3.normalize(qvn);
	    var ww = vec3.create();
	    vec3.cross(q, qvn, ww);
	    
	    dest[0] = this.scale * (x + d * (qvn[0] * Math.cos(v) + ww[0] * Math.sin(v)));
	    dest[1] = this.scale * (y + d * (qvn[1] * Math.cos(v) + ww[1] * Math.sin(v)));
	    dest[2] = this.scale * (z + d * ww[2] * Math.sin(v));

		return dest;
	};

	treefoilKnotPrimitive.set = function(spec) {
		spec = spec || {};

		this._scale = spec.scale || 1.0;

		spec.divisions = vec2.create(spec.divisions || [60, 15]);
		spec.upperBound = vec2.create(spec.upperBound || [2.0 * Math.PI, 2.0 * Math.PI]);
		spec.textureCount = vec2.create(spec.textureCount || [1, 1]);

		parametricPrimitive.set.call(this, spec);

		return this;
	};

	return treefoilKnotPrimitive;

});

