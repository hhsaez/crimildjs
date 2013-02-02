define(["../third-party/gl-matrix"], function(glMatrix) {
	"use strict";

	return {
		testSphereRay: function(center, radius, origin, direction) {
			var dx = origin[0] - center[0];
			var dy = origin[1] - center[1];
			var dz = origin[2] - center[2];
			var a = direction[0] * direction[0] + direction[1] * direction[1] + direction[2] * direction[2];
			var b = 2 * (dx * direction[0] + dy * direction[1] + dz * direction[2]);
			var c = (dx * dx + dy * dy + dz * dz) - radius * radius;

			var roots = numeric.findRealRoots(a, b, c);
			if (roots.length > 0) {
				var maxRoot = roots.length == 1 ? roots[0] : Math.max(roots[0], roots[1]);
				return maxRoot > 0.0;
			}

			return false;
		},
	}
});

